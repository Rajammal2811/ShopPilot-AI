import { store } from './store.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
let aiClient = null;

if (apiKey) {
  try {
    aiClient = new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.warn("Gemini API client initialization failed, falling back to local deterministic engine:", err.message);
  }
}

/**
 * Extract intent from user prompt (budget, category, specs, intent tags)
 */
export function extractIntent(prompt) {
  const text = prompt.toLowerCase();
  
  // Extract budget
  let budget = null;
  const budgetMatch = text.match(/(?:under|below|budget|within|around|for)?\s*₹?\s*(\d+[\d,]*)\s*(?:k|thousand|lakh)?/i);
  
  if (text.includes("60,000") || text.includes("60000") || text.includes("60k")) budget = 60000;
  else if (text.includes("30,000") || text.includes("30000") || text.includes("30k")) budget = 30000;
  else if (text.includes("50,000") || text.includes("50000") || text.includes("50k")) budget = 50000;
  else if (text.includes("10,000") || text.includes("10000") || text.includes("10k")) budget = 10000;
  else if (text.includes("5,000") || text.includes("5000") || text.includes("5k")) budget = 5000;
  else if (text.includes("20,000") || text.includes("20000") || text.includes("20k")) budget = 20000;
  else if (budgetMatch && budgetMatch[1]) {
    let raw = budgetMatch[1].replace(/,/g, '');
    let val = parseInt(raw, 10);
    if (text.includes("k") && val < 1000) val *= 1000;
    budget = val;
  }

  // Extract category
  let category = "All";
  if (text.includes("laptop") || text.includes("macbook") || text.includes("notebook")) category = "Laptops";
  else if (text.includes("phone") || text.includes("smartphone") || text.includes("mobile") || text.includes("nord") || text.includes("galaxy")) category = "Smartphones";
  else if (text.includes("headphone") || text.includes("earbud") || text.includes("earphone") || text.includes("airpod") || text.includes("tws") || text.includes("audio")) category = "Headphones";
  else if (text.includes("watch") || text.includes("smartwatch") || text.includes("band")) category = "Smartwatches";
  else if (text.includes("tablet") || text.includes("ipad") || text.includes("tab")) category = "Tablets";
  else if (text.includes("mouse") || text.includes("keyboard") || text.includes("stand") || text.includes("hub") || text.includes("powerbank")) category = "Accessories";
  else if (text.includes("study") || text.includes("college") || text.includes("setup") || text.includes("desk")) category = "College/Study products";

  // Extract features/intent
  const features = [];
  if (text.includes("coding") || text.includes("programming") || text.includes("developer")) features.push("coding", "programming", "16GB RAM");
  if (text.includes("camera") || text.includes("photo") || text.includes("video")) features.push("camera", "50MP");
  if (text.includes("gaming") || text.includes("performance")) features.push("gaming", "performance");
  if (text.includes("study") || text.includes("college") || text.includes("student")) features.push("student", "study", "portable");
  if (text.includes("noise") || text.includes("anc") || text.includes("quiet")) features.push("anc", "noise canceling");
  if (text.includes("battery") || text.includes("fast charge")) features.push("fastcharge", "battery");

  return { budget, category, features, originalPrompt: prompt };
}

/**
 * Score products deterministically
 */
export function rankProducts(intent, products) {
  const { budget, category, features } = intent;

  return products.map(prod => {
    let score = 0;
    let reasons = [];

    // Category Score (35 pts)
    if (category !== "All") {
      if (prod.category.toLowerCase() === category.toLowerCase()) {
        score += 35;
      } else {
        score += 5; // minimal baseline
      }
    } else {
      score += 20;
    }

    // Budget Score (35 pts)
    if (budget) {
      if (prod.price <= budget) {
        score += 35;
        reasons.push(`✓ Within your ₹${budget.toLocaleString('en-IN')} budget`);
      } else if (prod.price <= budget * 1.1) {
        score += 15; // slightly over budget
        reasons.push(`! Slightly above budget (₹${prod.price.toLocaleString('en-IN')})`);
      } else {
        score -= 20;
      }
    } else {
      score += 25;
    }

    // Tag / Feature Match (20 pts)
    let tagMatches = 0;
    features.forEach(feat => {
      if (prod.tags.some(t => t.toLowerCase().includes(feat.toLowerCase())) ||
          prod.description.toLowerCase().includes(feat.toLowerCase()) ||
          prod.features.some(f => f.toLowerCase().includes(feat.toLowerCase()))) {
        tagMatches++;
      }
    });

    if (tagMatches > 0) {
      score += Math.min(20, tagMatches * 10);
      reasons.push(`✓ Tailored for ${features[0] || 'your requirements'}`);
    }

    // Spec specific reasons
    if (prod.features.some(f => f.includes("16GB"))) reasons.push("✓ High 16GB RAM for smooth multitasking");
    if (prod.features.some(f => f.includes("512GB"))) reasons.push("✓ Fast 512GB SSD storage");
    if (prod.features.some(f => f.includes("OLED") || f.includes("AMOLED"))) reasons.push("✓ Vibrant OLED display");
    if (prod.features.some(f => f.includes("Noise"))) reasons.push("✓ Advanced noise cancellation");

    // Rating & Stock Score (10 pts)
    score += (prod.rating / 5) * 8;
    if (prod.stock > 0) score += 2;
    reasons.push(`✓ Strong customer rating (${prod.rating} ★)`);

    return {
      product: prod,
      score: Math.min(100, Math.round(score)),
      reasons: Array.from(new Set(reasons))
    };
  }).sort((a, b) => b.score - a.score);
}

/**
 * Find relevant cross-sell / upsell add-ons
 */
export function getUpsellSuggestions(primaryProduct, catalog) {
  const frequentlyBoughtIds = primaryProduct.frequentlyBoughtWith || [];
  let upsells = catalog.filter(p => frequentlyBoughtIds.includes(p.id));

  // Fallback if less than 2 items
  if (upsells.length < 2) {
    if (primaryProduct.category === "Laptops") {
      const accessories = catalog.filter(p => p.category === "Accessories" && p.id !== primaryProduct.id);
      upsells = [...upsells, ...accessories].slice(0, 3);
    } else if (primaryProduct.category === "Smartphones") {
      const audioOrAccessory = catalog.filter(p => (p.category === "Headphones" || p.category === "Accessories") && p.id !== primaryProduct.id);
      upsells = [...upsells, ...audioOrAccessory].slice(0, 3);
    } else {
      const generic = catalog.filter(p => p.id !== primaryProduct.id);
      upsells = [...upsells, ...generic].slice(0, 3);
    }
  }

  // Attach explanation reason
  return upsells.map(item => {
    let reason = "Frequently paired with this product.";
    if (primaryProduct.category === "Laptops" && item.name.includes("Mouse")) {
      reason = "Essential ergonomic mouse for coding speed and productivity.";
    } else if (primaryProduct.category === "Laptops" && item.name.includes("Stand")) {
      reason = "Prevents neck posture strain during long coding sessions.";
    } else if (primaryProduct.category === "Laptops" && item.name.includes("Keyboard")) {
      reason = "Tactile mechanical keyboard for effortless typing.";
    } else if (primaryProduct.category === "Smartphones" && item.category === "Headphones") {
      reason = "Immersive wireless audio for calls, focus, and music on the go.";
    } else if (item.name.includes("Power")) {
      reason = "Keep your devices charged during travel and classes.";
    }
    return { ...item, reason };
  });
}

/**
 * Primary AI Chat / Recommendation Service
 */
export async function processAIChat(prompt) {
  const intent = extractIntent(prompt);
  const catalog = store.getProducts();
  const ranked = rankProducts(intent, catalog);
  
  const bestMatch = ranked[0] ? ranked[0].product : catalog[0];
  const bestMatchReasons = ranked[0] ? ranked[0].reasons : [
    "✓ Within budget",
    "✓ High customer satisfaction",
    "✓ Available in stock"
  ];
  
  const alternatives = ranked.slice(1, 4).map(r => r.product);
  const upsellItems = getUpsellSuggestions(bestMatch, catalog);

  const processSteps = [
    { title: "Understanding customer intent", desc: `Budget: ${intent.budget ? '₹' + intent.budget.toLocaleString('en-IN') : 'Flexible'} | Category: ${intent.category}`, icon: "intent" },
    { title: "Searching catalog", desc: `Analyzed ${catalog.length} products`, icon: "search" },
    { title: "Ranking products", desc: `Top score: ${ranked[0]?.score || 95}% match`, icon: "rank" },
    { title: "Identifying relevant add-ons", desc: `Found ${upsellItems.length} complementary add-ons`, icon: "upsell" },
    { title: "Waiting for customer confirmation", desc: "Awaiting explicit approval before checkout", icon: "gate" }
  ];

  let aiMessage = intent.budget 
    ? `Based on your ₹${intent.budget.toLocaleString('en-IN')} budget and ${intent.features[0] || 'coding'} requirements, I found a strong match: **${bestMatch.name}**.`
    : `Based on your preferences, I found a strong match: **${bestMatch.name}**.`;
  
  if (aiClient) {
    try {
      const model = aiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const promptText = `You are ShopPilot AI, an intelligent e-commerce shopping agent. 
      User Prompt: "${prompt}"
      Top Recommended Product: ${bestMatch.name} (Price: ₹${bestMatch.price}, Features: ${bestMatch.features.join(', ')})
      Write a concise, friendly 2-sentence recommendation highlighting why it fits their intent.`;
      
      const response = await model.generateContent(promptText);
      if (response && response.response && response.response.text) {
        aiMessage = response.response.text();
      }
    } catch (err) {
      console.warn("Gemini API call failed, using fallback response:", err.message);
    }
  }

  // Record audit log
  store.recordAuditEvent("USER_INTENT", `Customer prompt: "${prompt}"`, "SUCCESS", { intent });
  store.recordAuditEvent("PRODUCT_SEARCH", `Scored ${catalog.length} products for ${intent.category}`, "SUCCESS", { topScore: ranked[0]?.score });
  store.recordAuditEvent("RECOMMENDATION", `Selected ${bestMatch.name} (₹${bestMatch.price.toLocaleString('en-IN')})`, "SUCCESS", { productId: bestMatch.id });
  store.recordAuditEvent("UPSELL_SUGGESTED", `Suggested ${upsellItems.length} add-ons for setup completion`, "SUCCESS", { items: upsellItems.map(u => u.name) });

  return {
    intent,
    processSteps,
    message: aiMessage,
    bestMatch,
    reasons: bestMatchReasons,
    alternatives,
    upsells: upsellItems
  };
}
