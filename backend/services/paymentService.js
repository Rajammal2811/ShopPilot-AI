import Razorpay from 'razorpay';
import crypto from 'crypto';
import { store } from './store.js';

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

const MAX_AI_ORDER_VALUE = 100000; // ₹1,00,000 maximum AI transaction limit

let razorpayInstance = null;
if (keyId && keySecret) {
  try {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
  } catch (err) {
    console.warn("Razorpay SDK initialization failed, DEMO PAYMENT MODE active:", err.message);
  }
}

export function isRazorpayConfigured() {
  return Boolean(razorpayInstance && keyId && keySecret);
}

/**
 * Create a payment order (Razorpay or Demo)
 */
export async function createOrder(cartItems, customerInfo = {}) {
  // Calculate total
  let subtotal = 0;
  let upsellAmount = 0;

  cartItems.forEach(item => {
    const itemTotal = (item.price || 0) * (item.quantity || 1);
    subtotal += itemTotal;
    if (item.isUpsell) {
      upsellAmount += itemTotal;
    }
  });

  const totalAmount = subtotal;

  // Enforce Max AI Order Boundary Safety
  if (totalAmount > MAX_AI_ORDER_VALUE) {
    store.recordAuditEvent(
      "SECURITY_GUARDRAIL", 
      `Order amount ₹${totalAmount.toLocaleString('en-IN')} exceeded MAX_AI_ORDER_VALUE limit (₹1,00,000)`,
      "WARNING",
      { totalAmount, limit: MAX_AI_ORDER_VALUE }
    );
    throw new Error(`Order amount (₹${totalAmount.toLocaleString('en-IN')}) exceeds the maximum AI transaction boundary of ₹1,00,000. Manual approval required.`);
  }

  const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  // Record audit log for order attempt
  store.recordAuditEvent(
    "USER_CONFIRMATION",
    `Customer approved purchase of ${cartItems.length} item(s) totaling ₹${totalAmount.toLocaleString('en-IN')}`,
    "SUCCESS",
    { totalAmount, itemCount: cartItems.length }
  );

  // If Razorpay is configured, use Razorpay API
  if (razorpayInstance) {
    try {
      const options = {
        amount: totalAmount * 100, // amount in paisa
        currency: 'INR',
        receipt: receipt,
        notes: {
          aiAssisted: 'true',
          upsellAmount: String(upsellAmount)
        }
      };

      const razorpayOrder = await razorpayInstance.orders.create(options);

      // Save order to store
      const order = store.createOrder({
        orderId: razorpayOrder.id,
        items: cartItems,
        amount: totalAmount,
        subtotal: subtotal,
        upsellAmount: upsellAmount,
        receipt: receipt,
        currency: 'INR',
        mode: 'RAZORPAY_TEST',
        aiAssisted: true,
        customer: customerInfo
      });

      store.recordAuditEvent(
        "PAYMENT_ORDER_CREATED",
        `Created Razorpay Test Order ${razorpayOrder.id} for ₹${totalAmount.toLocaleString('en-IN')}`,
        "SUCCESS",
        { orderId: razorpayOrder.id, amount: totalAmount, mode: "RAZORPAY" }
      );

      return {
        mode: 'RAZORPAY',
        keyId: keyId,
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order
      };
    } catch (err) {
      console.error("Razorpay order creation failed, falling back to Demo Mode:", err.message);
    }
  }

  // DEMO PAYMENT MODE FALLBACK
  const demoOrderId = `order_demo_${Date.now().toString().slice(-6)}`;
  const order = store.createOrder({
    orderId: demoOrderId,
    items: cartItems,
    amount: totalAmount,
    subtotal: subtotal,
    upsellAmount: upsellAmount,
    receipt: receipt,
    currency: 'INR',
    mode: 'DEMO_MODE',
    aiAssisted: true,
    customer: customerInfo
  });

  store.recordAuditEvent(
    "PAYMENT_ORDER_CREATED",
    `Created Demo Payment Order ${demoOrderId} for ₹${totalAmount.toLocaleString('en-IN')}`,
    "SUCCESS",
    { orderId: demoOrderId, amount: totalAmount, mode: "DEMO" }
  );

  return {
    mode: 'DEMO',
    orderId: demoOrderId,
    amount: totalAmount * 100,
    currency: 'INR',
    order
  };
}

/**
 * Verify Payment (Razorpay signature verification or Demo simulation)
 */
export async function verifyPayment(paymentPayload) {
  const { 
    orderId, 
    paymentId, 
    signature, 
    isDemoSuccess, 
    failureReason 
  } = paymentPayload;

  // Handle explicit demo failure simulation
  if (isDemoSuccess === false) {
    store.updateOrderStatus(orderId, "FAILED", null, { error: failureReason || "Payment declined by card issuer" });
    
    store.recordAuditEvent(
      "PAYMENT_FAILED",
      `Payment failed for order ${orderId}: ${failureReason || "Simulated payment failure"}`,
      "FAILED",
      { orderId, reason: failureReason || "User simulated payment decline" }
    );

    return {
      success: false,
      status: "FAILED",
      message: failureReason || "Payment simulation failed as requested."
    };
  }

  // Handle Demo Mode success
  if (orderId.startsWith("order_demo_") || !signature) {
    const demoPaymentId = paymentId || `pay_demo_${Date.now().toString().slice(-6)}`;
    const updatedOrder = store.updateOrderStatus(orderId, "PAID", demoPaymentId, {
      method: "Demo Razorpay Card",
      verifiedAt: new Date().toISOString()
    });

    store.recordAuditEvent(
      "PAYMENT_SUCCESS",
      `Demo Payment verified successfully for order ${orderId} (${demoPaymentId})`,
      "SUCCESS",
      { orderId, paymentId: demoPaymentId, amount: updatedOrder?.amount }
    );

    return {
      success: true,
      status: "PAID",
      paymentId: demoPaymentId,
      order: updatedOrder
    };
  }

  // Handle real Razorpay Test signature verification
  if (keySecret) {
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature === signature) {
      const updatedOrder = store.updateOrderStatus(orderId, "PAID", paymentId, {
        method: "Razorpay Test Gateway",
        verifiedAt: new Date().toISOString()
      });

      store.recordAuditEvent(
        "PAYMENT_SUCCESS",
        `Razorpay payment signature verified successfully (${paymentId})`,
        "SUCCESS",
        { orderId, paymentId, signatureVerified: true }
      );

      return {
        success: true,
        status: "PAID",
        paymentId,
        order: updatedOrder
      };
    } else {
      store.updateOrderStatus(orderId, "FAILED", paymentId, { error: "Signature verification mismatch" });
      
      store.recordAuditEvent(
        "PAYMENT_FAILED",
        `Razorpay signature verification failed for order ${orderId}`,
        "FAILED",
        { orderId, paymentId }
      );

      return {
        success: false,
        status: "FAILED",
        message: "Invalid payment signature verification failed."
      };
    }
  }

  // Fallback success if secret missing
  const updatedOrder = store.updateOrderStatus(orderId, "PAID", paymentId || `pay_verified_${Date.now()}`);
  return {
    success: true,
    status: "PAID",
    order: updatedOrder
  };
}
