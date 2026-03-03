import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const SPOTS = [
  {
    id: 1,
    name: "Ramu's Chai Corner",
    category: "Street Food",
    area: "Chandni Chowk",
    city: "Delhi",
    rating: 4.8,
    trapScore: 12,
    localPrice: 15,
    touristPrice: 15,
    submittedBy: "Priya_Local",
    submitterType: "local",
    tags: ["authentic", "budget", "no-english-menu"],
    description: "Best cutting chai in the market. Standing room only — that's a good sign.",
    honestTake: "Genuinely the best. No frills, no photos on the wall. Just chai.",
    image: "🍵",
    verified: true,
    localsOnly: false,
    reviews: 234,
    priceVariance: 0,
    lat: 28.6561,
    lng: 77.2300,
  },
  {
    id: 2,
    name: "Sharma Ji Ka Dhaba",
    category: "Desi Food",
    area: "Lajpat Nagar",
    city: "Delhi",
    rating: 4.6,
    trapScore: 8,
    localPrice: 120,
    touristPrice: 140,
    submittedBy: "Arjun_Foodie",
    submitterType: "local",
    tags: ["homestyle", "thali", "lunch-only"],
    description: "Unlimited thali with 4 sabzis, dal, rice, and roti. A true Delhi experience.",
    honestTake: "Only good for lunch. Dinner menu is limited. Go before 2pm.",
    image: "🍛",
    verified: true,
    localsOnly: false,
    reviews: 189,
    priceVariance: 17,
    lat: 28.5685,
    lng: 77.2413,
  },
  {
    id: 3,
    name: "The 'Famous' Tandoor Palace",
    category: "Restaurant",
    area: "Connaught Place",
    city: "Delhi",
    rating: 4.1,
    trapScore: 78,
    localPrice: 0,
    touristPrice: 850,
    submittedBy: "System_Flag",
    submitterType: "system",
    tags: ["tourist-trap", "overpriced", "paid-reviews"],
    description: "Prominently featured in 'top 10 Delhi restaurants' lists you find via Google.",
    honestTake: "Overhyped. Only good for Instagram. Go here instead: Sharma Ji Ka Dhaba.",
    image: "🚨",
    verified: false,
    localsOnly: false,
    reviews: 1240,
    priceVariance: 85,
    lat: 28.6315,
    lng: 77.2167,
  },
  {
    id: 4,
    name: "Baba's Secret Paratha Gali",
    category: "Street Food",
    area: "Old Delhi",
    city: "Delhi",
    rating: 4.9,
    trapScore: 5,
    localPrice: 40,
    touristPrice: 40,
    submittedBy: "Meera_Olddelhi",
    submitterType: "local",
    tags: ["hidden-gem", "locals-only", "cash-only"],
    description: "Down the third alley after the silver market. No sign. Ask for Baba.",
    honestTake: "Perfect. No upgrades needed. Cash only. 6am–11am only.",
    image: "🫓",
    verified: true,
    localsOnly: true,
    reviews: 56,
    priceVariance: 0,
    lat: 28.6562,
    lng: 77.2290,
  },
  {
    id: 5,
    name: "Suresh Cold Coffee",
    category: "Beverages",
    area: "Kamla Nagar",
    city: "Delhi",
    rating: 4.7,
    trapScore: 10,
    localPrice: 60,
    touristPrice: 60,
    submittedBy: "College_Ashish",
    submitterType: "student",
    tags: ["student-fav", "cold-drinks", "evening"],
    description: "Delhi University students swear by this. Thick, rich, no-nonsense cold coffee.",
    honestTake: "Exactly what it claims to be. Nothing more, nothing less. Brilliant.",
    image: "☕",
    verified: true,
    localsOnly: false,
    reviews: 312,
    priceVariance: 0,
    lat: 28.6887,
    lng: 77.2064,
  },
  {
    id: 6,
    name: "Government Museum Cafe",
    category: "Cafe",
    area: "India Gate",
    city: "Delhi",
    rating: 2.9,
    trapScore: 65,
    localPrice: 0,
    touristPrice: 420,
    submittedBy: "Alert_Kavya",
    submitterType: "tourist",
    tags: ["overpriced", "tourist-area", "avoid"],
    description: "Located near India Gate, markets itself as a 'heritage experience'.",
    honestTake: "Mediocre food, premium location tax. You're paying for the zip code.",
    image: "⚠️",
    verified: false,
    localsOnly: false,
    reviews: 890,
    priceVariance: 100,
    lat: 28.6129,
    lng: 77.2295,
  },
];

const SCAM_ALERTS = [
  { id: 1, type: "overcharging", lat: 28.6315, lng: 77.2167, area: "Connaught Place", count: 34, severity: "high" },
  { id: 2, type: "fake-guide", lat: 28.6562, lng: 77.2300, area: "Chandni Chowk", count: 12, severity: "medium" },
  { id: 3, type: "pickpocket", lat: 28.6129, lng: 77.2295, area: "India Gate", count: 8, severity: "medium" },
  { id: 4, type: "overcharging", lat: 28.5685, lng: 77.2413, area: "Lajpat Nagar", count: 3, severity: "low" },
];

const LOCAL_GUIDES = [
  { id: 1, name: "Priya Sharma", handle: "@priya_eats_delhi", type: "Street Food Hunter", followers: 2340, posts: 89, trustScore: 94, avatar: "👩‍🍳", badge: "🌟 Top Local" },
  { id: 2, name: "Arjun Mehta", handle: "@arjun_budget_travel", type: "Budget Traveler", followers: 1890, posts: 67, trustScore: 91, avatar: "🧑‍💼", badge: "💰 Budget Expert" },
  { id: 3, name: "Meera Nair", handle: "@meera_hidden_spots", type: "Hidden Gem Finder", followers: 3120, posts: 134, trustScore: 97, avatar: "👩‍🔬", badge: "🔍 Hidden Gem" },
  { id: 4, name: "Ashish DU", handle: "@college_foodie_ash", type: "Student Food Scout", followers: 780, posts: 45, trustScore: 88, avatar: "🧑‍🎓", badge: "🎓 Student Scout" },
];

const CATEGORIES = ["All", "Street Food", "Desi Food", "Cafe", "Beverages", "Restaurant"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const TrapBadge = ({ score }) => {
  const color = score < 25 ? "#00e676" : score < 55 ? "#ffab40" : "#ff1744";
  const label = score < 25 ? "Safe" : score < 55 ? "Caution" : "Trap Risk";
  return (
    <span style={{
      background: color + "22",
      color,
      border: `1px solid ${color}44`,
      borderRadius: 6,
      padding: "2px 8px",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 0.5,
      fontFamily: "monospace",
    }}>
      {label} {score}%
    </span>
  );
};

const PriceTag = ({ local, tourist }) => {
  if (!local || !tourist) return null;
  const diff = Math.round(((tourist - local) / local) * 100);
  if (diff <= 0) return <span style={{ color: "#00e676", fontSize: 12, fontWeight: 700 }}>✓ Fair Pricing</span>;
  return (
    <span style={{ color: "#ff6b35", fontSize: 12, fontWeight: 700 }}>
      Tourist price +{diff}% higher
    </span>
  );
};

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ color: "#FFD600", fontSize: 13, letterSpacing: -1 }}>
      {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
      <span style={{ color: "#aaa", marginLeft: 4, fontWeight: 600, fontSize: 12 }}>{rating}</span>
    </span>
  );
};

// ─── SCREENS ─────────────────────────────────────────────────────────────────

// DISCOVER SCREEN
function DiscoverScreen({ userType }) {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedSpot, setSelectedSpot] = useState(null);

  const filtered = SPOTS.filter(s => {
    if (s.localsOnly && userType !== "local") return false;
    if (category !== "All" && s.category !== category) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.area.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (selectedSpot) {
    return <SpotDetail spot={selectedSpot} onBack={() => setSelectedSpot(null)} />;
  }

  return (
    <div style={{ padding: "0 0 80px" }}>
      {/* Header */}
      <div style={{ padding: "24px 20px 16px", background: "linear-gradient(180deg, #0d1117 0%, transparent 100%)" }}>
        <div style={{ fontSize: 11, color: "#ff6b35", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>NativeKnows</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: "#fff", lineHeight: 1.1, fontFamily: "'Playfair Display', Georgia, serif" }}>
          Real Spots,<br /><span style={{ color: "#ff6b35" }}>Real Prices</span>
        </div>
        <div style={{ fontSize: 13, color: "#888", marginTop: 6 }}>Curated by locals. Protected from scams.</div>
      </div>

      {/* Search */}
      <div style={{ padding: "0 20px 12px" }}>
        <div style={{ background: "#1a1f2e", borderRadius: 12, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8, border: "1px solid #2a2f3e" }}>
          <span style={{ color: "#666", fontSize: 16 }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search spots or areas..."
            style={{ background: "none", border: "none", outline: "none", color: "#fff", fontSize: 14, flex: 1, fontFamily: "inherit" }}
          />
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: "flex", gap: 8, padding: "0 20px 16px", overflowX: "auto", scrollbarWidth: "none" }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{
            background: category === cat ? "#ff6b35" : "#1a1f2e",
            color: category === cat ? "#fff" : "#888",
            border: category === cat ? "none" : "1px solid #2a2f3e",
            borderRadius: 20,
            padding: "6px 14px",
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: "nowrap",
            cursor: "pointer",
            fontFamily: "inherit",
          }}>{cat}</button>
        ))}
      </div>

      {/* Spots List */}
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(spot => (
          <SpotCard key={spot.id} spot={spot} onClick={() => setSelectedSpot(spot)} />
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "#444", padding: "40px 0", fontSize: 14 }}>
            No spots found. Try a different filter.
          </div>
        )}
      </div>
    </div>
  );
}

function SpotCard({ spot, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: "#0d1117",
      border: "1px solid #1e2333",
      borderRadius: 16,
      overflow: "hidden",
      cursor: "pointer",
      transition: "border-color 0.2s",
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = "#ff6b35"}
    onMouseLeave={e => e.currentTarget.style.borderColor = "#1e2333"}
    >
      {/* Top strip */}
      <div style={{ background: "#0a0e1a", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 32, width: 44, height: 44, background: "#1a1f2e", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {spot.image}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
              {spot.name}
              {spot.localsOnly && <span style={{ fontSize: 10, background: "#7c3aed22", color: "#a78bfa", border: "1px solid #7c3aed44", borderRadius: 4, padding: "1px 5px" }}>LOCALS ONLY</span>}
              {spot.verified && <span style={{ color: "#00e676", fontSize: 12 }}>✓</span>}
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>{spot.area} · {spot.category}</div>
          </div>
        </div>
        <TrapBadge score={spot.trapScore} />
      </div>

      {/* Body */}
      <div style={{ padding: "12px 16px" }}>
        <StarRating rating={spot.rating} />
        <div style={{ fontSize: 13, color: "#aaa", margin: "8px 0 10px", lineHeight: 1.5 }}>{spot.description}</div>
        
        {/* Honest take */}
        <div style={{ background: "#1a1f2e", borderRadius: 8, padding: "8px 12px", borderLeft: "3px solid #ff6b35" }}>
          <div style={{ fontSize: 10, color: "#ff6b35", fontWeight: 700, letterSpacing: 1, marginBottom: 2 }}>LOCAL SAYS</div>
          <div style={{ fontSize: 12, color: "#ccc", fontStyle: "italic" }}>{spot.honestTake}</div>
        </div>

        {/* Price info */}
        {spot.localPrice > 0 && (
          <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 12, color: "#666" }}>
              Local avg: <span style={{ color: "#00e676", fontWeight: 700 }}>₹{spot.localPrice}</span>
              {spot.touristPrice > spot.localPrice && <span style={{ color: "#888" }}> · Tourist: <span style={{ color: "#ff6b35" }}>₹{spot.touristPrice}</span></span>}
            </div>
            <PriceTag local={spot.localPrice} tourist={spot.touristPrice} />
          </div>
        )}

        {/* Tags */}
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          {spot.tags.map(tag => (
            <span key={tag} style={{ fontSize: 10, color: "#666", background: "#1a1f2e", borderRadius: 4, padding: "2px 7px", border: "1px solid #2a2f3e" }}>#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SpotDetail({ spot, onBack }) {
  const [showReportForm, setShowReportForm] = useState(false);
  const [reported, setReported] = useState(false);

  return (
    <div style={{ padding: "0 0 100px" }}>
      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ background: "#1a1f2e", border: "1px solid #2a2f3e", borderRadius: 8, padding: "8px 12px", color: "#fff", cursor: "pointer", fontSize: 16, fontFamily: "inherit" }}>←</button>
        <div style={{ fontSize: 13, color: "#666" }}>Back to Discover</div>
      </div>

      <div style={{ padding: "20px" }}>
        {/* Hero */}
        <div style={{ background: "#1a1f2e", borderRadius: 16, padding: "24px", textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 64 }}>{spot.image}</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginTop: 8, fontFamily: "'Playfair Display', Georgia, serif" }}>{spot.name}</div>
          <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>{spot.area} · {spot.category}</div>
          <div style={{ marginTop: 10 }}><StarRating rating={spot.rating} /></div>
        </div>

        {/* Trap Score Card */}
        <div style={{ background: spot.trapScore > 55 ? "#ff174422" : spot.trapScore > 25 ? "#ffab4022" : "#00e67622", borderRadius: 16, padding: 16, marginBottom: 16, border: `1px solid ${spot.trapScore > 55 ? "#ff174444" : spot.trapScore > 25 ? "#ffab4044" : "#00e67644"}` }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: spot.trapScore > 55 ? "#ff1744" : spot.trapScore > 25 ? "#ffab40" : "#00e676", textTransform: "uppercase", marginBottom: 8 }}>Tourist Trap Risk Score</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 40, fontWeight: 900, color: spot.trapScore > 55 ? "#ff1744" : spot.trapScore > 25 ? "#ffab40" : "#00e676" }}>{spot.trapScore}%</div>
            <div style={{ flex: 1 }}>
              <div style={{ height: 8, background: "#0d1117", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${spot.trapScore}%`, background: spot.trapScore > 55 ? "#ff1744" : spot.trapScore > 25 ? "#ffab40" : "#00e676", borderRadius: 4, transition: "width 0.6s" }} />
              </div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Based on {spot.reviews} verified reviews</div>
            </div>
          </div>
        </div>

        {/* Pricing Transparency */}
        {spot.localPrice > 0 && (
          <div style={{ background: "#0d1117", border: "1px solid #1e2333", borderRadius: 16, padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#888", textTransform: "uppercase", marginBottom: 12 }}>Price Transparency</div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1, background: "#00e67611", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#00e676", fontWeight: 700 }}>LOCAL AVG</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#00e676" }}>₹{spot.localPrice}</div>
              </div>
              {spot.touristPrice > spot.localPrice && (
                <div style={{ flex: 1, background: "#ff6b3511", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#ff6b35", fontWeight: 700 }}>TOURIST AVG</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#ff6b35" }}>₹{spot.touristPrice}</div>
                </div>
              )}
            </div>
            {spot.priceVariance > 0 && (
              <div style={{ marginTop: 10, textAlign: "center", fontSize: 13, color: "#ff6b35", fontWeight: 700 }}>
                ⚠️ Tourists charged {spot.priceVariance}% more on average
              </div>
            )}
          </div>
        )}

        {/* Honest take */}
        <div style={{ background: "#0d1117", border: "1px solid #1e2333", borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#ff6b35", textTransform: "uppercase", marginBottom: 8 }}>Brutally Honest Review</div>
          <div style={{ fontSize: 15, color: "#ccc", lineHeight: 1.6, fontStyle: "italic" }}>"{spot.honestTake}"</div>
          <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>— {spot.submittedBy}</div>
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          {spot.tags.map(tag => (
            <span key={tag} style={{ fontSize: 12, color: "#888", background: "#1a1f2e", borderRadius: 6, padding: "4px 10px", border: "1px solid #2a2f3e" }}>#{tag}</span>
          ))}
        </div>

        {/* Actions */}
        {!reported ? (
          <button onClick={() => setShowReportForm(true)} style={{ width: "100%", background: "transparent", border: "1px solid #ff174444", color: "#ff1744", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            🚨 Report Overcharging / Issue
          </button>
        ) : (
          <div style={{ textAlign: "center", color: "#00e676", fontSize: 14, padding: 12 }}>✓ Report submitted. Thank you for keeping it real.</div>
        )}

        {showReportForm && !reported && (
          <div style={{ marginTop: 12, background: "#1a1f2e", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 13, color: "#ccc", marginBottom: 10 }}>What happened?</div>
            {["Charged more than menu price", "Fake/manipulated menu", "Hostile when I asked for receipt", "Fake guide brought me here"].map(opt => (
              <button key={opt} onClick={() => setReported(true)} style={{ display: "block", width: "100%", background: "#0d1117", border: "1px solid #2a2f3e", borderRadius: 8, padding: "10px 12px", color: "#ccc", fontSize: 13, cursor: "pointer", marginBottom: 8, textAlign: "left", fontFamily: "inherit" }}>
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// MAP SCREEN
function MapScreen() {
  const severityColor = { low: "#ffab40", medium: "#ff6b35", high: "#ff1744" };
  const typeIcon = { overcharging: "💸", "fake-guide": "🎭", pickpocket: "🖐️" };

  return (
    <div style={{ padding: "0 0 80px" }}>
      <div style={{ padding: "24px 20px 16px" }}>
        <div style={{ fontSize: 11, color: "#ff6b35", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Live</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: "#fff", fontFamily: "'Playfair Display', Georgia, serif" }}>Scam Alert<br /><span style={{ color: "#ff6b35" }}>Heatmap</span></div>
        <div style={{ fontSize: 13, color: "#888", marginTop: 6 }}>Anonymous reports from the community</div>
      </div>

      {/* Fake Map Visualization */}
      <div style={{ margin: "0 20px", background: "#0a0e1a", borderRadius: 16, border: "1px solid #1e2333", padding: 20, height: 240, position: "relative", overflow: "hidden" }}>
        {/* Grid lines */}
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ position: "absolute", left: `${i*25}%`, top: 0, bottom: 0, borderLeft: "1px solid #1e2333" }} />
        ))}
        {[0,1,2,3].map(i => (
          <div key={i} style={{ position: "absolute", top: `${i*33}%`, left: 0, right: 0, borderTop: "1px solid #1e2333" }} />
        ))}
        
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: "#1e2333", fontSize: 11, textAlign: "center", pointerEvents: "none", userSelect: "none" }}>
          Delhi NCR Region<br/>Live Map
        </div>

        {/* Alert pins */}
        {SCAM_ALERTS.map((alert, i) => {
          const positions = [{ top: "25%", left: "45%" }, { top: "40%", left: "55%" }, { top: "70%", left: "50%" }, { top: "55%", left: "35%" }];
          const pos = positions[i] || { top: "50%", left: "50%" };
          return (
            <div key={alert.id} style={{ position: "absolute", ...pos, transform: "translate(-50%,-50%)" }}>
              <div style={{
                width: alert.severity === "high" ? 40 : alert.severity === "medium" ? 30 : 22,
                height: alert.severity === "high" ? 40 : alert.severity === "medium" ? 30 : 22,
                borderRadius: "50%",
                background: severityColor[alert.severity] + "33",
                border: `2px solid ${severityColor[alert.severity]}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: alert.severity === "high" ? 16 : 12,
                animation: alert.severity === "high" ? "pulse 2s infinite" : "none",
                cursor: "pointer",
              }}>
                {typeIcon[alert.type]}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 12, padding: "16px 20px" }}>
        {[["💸", "Overcharging", "#ff1744"], ["🎭", "Fake Guide", "#ff6b35"], ["🖐️", "Pickpocket", "#ffab40"]].map(([icon, label, color]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#888" }}>
            <span style={{ color }}>{icon}</span> {label}
          </div>
        ))}
      </div>

      {/* Alert List */}
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#888", textTransform: "uppercase", marginBottom: 4 }}>Recent Alerts</div>
        {SCAM_ALERTS.map(alert => (
          <div key={alert.id} style={{ background: "#0d1117", border: `1px solid ${severityColor[alert.severity]}33`, borderRadius: 12, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                {typeIcon[alert.type]} {alert.area}
              </div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{alert.count} reports · {alert.type.replace("-", " ")}</div>
            </div>
            <span style={{ background: severityColor[alert.severity] + "22", color: severityColor[alert.severity], border: `1px solid ${severityColor[alert.severity]}44`, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
              {alert.severity.toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      {/* Submit Alert */}
      <div style={{ padding: "20px" }}>
        <button style={{ width: "100%", background: "#ff174411", border: "1px solid #ff174433", color: "#ff1744", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          🚨 Submit Anonymous Alert
        </button>
      </div>
    </div>
  );
}

// GUIDES SCREEN
function GuidesScreen() {
  const [followed, setFollowed] = useState({});

  const toggleFollow = (id) => setFollowed(f => ({ ...f, [id]: !f[id] }));

  return (
    <div style={{ padding: "0 0 80px" }}>
      <div style={{ padding: "24px 20px 16px" }}>
        <div style={{ fontSize: 11, color: "#ff6b35", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Reverse Influencer</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: "#fff", fontFamily: "'Playfair Display', Georgia, serif" }}>Follow<br /><span style={{ color: "#ff6b35" }}>Real Locals</span></div>
        <div style={{ fontSize: 13, color: "#888", marginTop: 6 }}>People, not restaurants. Zero paid promotions.</div>
      </div>

      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        {LOCAL_GUIDES.map(guide => (
          <div key={guide.id} style={{ background: "#0d1117", border: "1px solid #1e2333", borderRadius: 16, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ width: 52, height: 52, background: "#1a1f2e", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                  {guide.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{guide.name}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>{guide.handle}</div>
                  <div style={{ fontSize: 11, color: "#a78bfa", marginTop: 3 }}>{guide.badge}</div>
                </div>
              </div>
              <button onClick={() => toggleFollow(guide.id)} style={{
                background: followed[guide.id] ? "#ff6b3522" : "#ff6b35",
                color: followed[guide.id] ? "#ff6b35" : "#fff",
                border: followed[guide.id] ? "1px solid #ff6b3544" : "none",
                borderRadius: 10,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
              }}>
                {followed[guide.id] ? "Following" : "Follow"}
              </button>
            </div>

            <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
              <div style={{ flex: 1, background: "#1a1f2e", borderRadius: 8, padding: "8px 0", textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>{guide.followers.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: "#666" }}>Followers</div>
              </div>
              <div style={{ flex: 1, background: "#1a1f2e", borderRadius: 8, padding: "8px 0", textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>{guide.posts}</div>
                <div style={{ fontSize: 10, color: "#666" }}>Spots</div>
              </div>
              <div style={{ flex: 1, background: "#00e67611", borderRadius: 8, padding: "8px 0", textAlign: "center", border: "1px solid #00e67622" }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#00e676" }}>{guide.trustScore}</div>
                <div style={{ fontSize: 10, color: "#00e676" }}>Trust Score</div>
              </div>
            </div>

            <div style={{ marginTop: 10, fontSize: 12, color: "#888", padding: "8px 12px", background: "#1a1f2e", borderRadius: 8 }}>
              Specializes in: <span style={{ color: "#ccc" }}>{guide.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// SUBMIT SCREEN
function SubmitScreen({ userPoints, setUserPoints }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ spotName: "", area: "", category: "", localPrice: "", description: "", honestTake: "", billUploaded: false, gpsVerified: false });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (formData.spotName && formData.area) {
      setSubmitted(true);
      setUserPoints(p => p + 50);
    }
  };

  if (submitted) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", fontFamily: "'Playfair Display', Georgia, serif" }}>Spot Submitted!</div>
        <div style={{ fontSize: 14, color: "#888", marginTop: 8, lineHeight: 1.6 }}>Your submission is under review.<br />You earned <span style={{ color: "#ff6b35", fontWeight: 700 }}>+50 NativePoints</span></div>
        <div style={{ marginTop: 24, background: "#00e67611", border: "1px solid #00e67622", borderRadius: 12, padding: "12px 20px", display: "inline-block" }}>
          <div style={{ fontSize: 12, color: "#00e676" }}>Total Points: <span style={{ fontSize: 20, fontWeight: 900 }}>{userPoints + 50}</span></div>
        </div>
        <button onClick={() => { setSubmitted(false); setStep(1); setFormData({ spotName: "", area: "", category: "", localPrice: "", description: "", honestTake: "", billUploaded: false, gpsVerified: false }); }} style={{ display: "block", margin: "24px auto 0", background: "#ff6b35", color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          Submit Another Spot
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 80px" }}>
      <div style={{ padding: "24px 20px 16px" }}>
        <div style={{ fontSize: 11, color: "#ff6b35", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Community</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: "#fff", fontFamily: "'Playfair Display', Georgia, serif" }}>Submit a<br /><span style={{ color: "#ff6b35" }}>Local Spot</span></div>
        <div style={{ fontSize: 13, color: "#888", marginTop: 6 }}>Earn NativePoints. Help tourists. Support small businesses.</div>
      </div>

      {/* Points Banner */}
      <div style={{ margin: "0 20px 20px", background: "linear-gradient(135deg, #ff6b3522, #ff6b3511)", border: "1px solid #ff6b3533", borderRadius: 12, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, color: "#ff6b35", fontWeight: 700 }}>Your NativePoints</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{userPoints} pts</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "#888" }}>Submitting earns</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#00e676" }}>+50 pts</div>
        </div>
      </div>

      {/* Step Indicator */}
      <div style={{ display: "flex", gap: 4, padding: "0 20px 20px" }}>
        {[1,2,3].map(s => (
          <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: s <= step ? "#ff6b35" : "#1e2333" }} />
        ))}
      </div>

      <div style={{ padding: "0 20px" }}>
        {step === 1 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Step 1: Basic Info</div>
            <InputField label="Spot Name *" value={formData.spotName} onChange={v => setFormData(f => ({...f, spotName: v}))} placeholder="e.g. Ramu's Chai Corner" />
            <InputField label="Area / Locality *" value={formData.area} onChange={v => setFormData(f => ({...f, area: v}))} placeholder="e.g. Chandni Chowk, Delhi" />
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>Category</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Street Food", "Desi Food", "Cafe", "Beverages", "Restaurant", "Activity"].map(cat => (
                  <button key={cat} onClick={() => setFormData(f => ({...f, category: cat}))} style={{ background: formData.category === cat ? "#ff6b35" : "#1a1f2e", color: formData.category === cat ? "#fff" : "#888", border: formData.category === cat ? "none" : "1px solid #2a2f3e", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{cat}</button>
                ))}
              </div>
            </div>
            <NavButton label="Next →" onClick={() => formData.spotName && formData.area ? setStep(2) : null} disabled={!formData.spotName || !formData.area} />
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Step 2: Pricing & Description</div>
            <InputField label="Local Average Price (₹)" value={formData.localPrice} onChange={v => setFormData(f => ({...f, localPrice: v}))} placeholder="e.g. 50" type="number" />
            <TextAreaField label="Description" value={formData.description} onChange={v => setFormData(f => ({...f, description: v}))} placeholder="Describe the spot honestly..." />
            <TextAreaField label="Honest Take (Brutally Honest!)" value={formData.honestTake} onChange={v => setFormData(f => ({...f, honestTake: v}))} placeholder="What should people really know?" />
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <button onClick={() => setFormData(f => ({...f, billUploaded: !f.billUploaded}))} style={{ flex: 1, background: formData.billUploaded ? "#00e67622" : "#1a1f2e", border: `1px solid ${formData.billUploaded ? "#00e676" : "#2a2f3e"}`, color: formData.billUploaded ? "#00e676" : "#888", borderRadius: 10, padding: "12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                {formData.billUploaded ? "✓ Bill Uploaded" : "📄 Upload Bill"}
              </button>
              <button onClick={() => setFormData(f => ({...f, gpsVerified: !f.gpsVerified}))} style={{ flex: 1, background: formData.gpsVerified ? "#00e67622" : "#1a1f2e", border: `1px solid ${formData.gpsVerified ? "#00e676" : "#2a2f3e"}`, color: formData.gpsVerified ? "#00e676" : "#888", borderRadius: 10, padding: "12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                {formData.gpsVerified ? "✓ GPS Verified" : "📍 Verify GPS"}
              </button>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <NavButton label="← Back" onClick={() => setStep(1)} secondary />
              <NavButton label="Next →" onClick={() => setStep(3)} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Step 3: Review & Submit</div>
            <div style={{ background: "#1a1f2e", borderRadius: 12, padding: 16, marginBottom: 16 }}>
              {[["Spot", formData.spotName], ["Area", formData.area], ["Category", formData.category || "Not set"], ["Avg Price", formData.localPrice ? `₹${formData.localPrice}` : "Not set"], ["Bill", formData.billUploaded ? "✓ Uploaded" : "Not uploaded"], ["GPS", formData.gpsVerified ? "✓ Verified" : "Not verified"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: "#666" }}>{k}</span>
                  <span style={{ color: "#ccc" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#ff6b3511", border: "1px solid #ff6b3533", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#ff6b35", lineHeight: 1.5 }}>
              ⚡ Verified submissions earn 50 pts. Bill + GPS = double verification bonus!
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <NavButton label="← Back" onClick={() => setStep(2)} secondary />
              <NavButton label="🚀 Submit Spot" onClick={handleSubmit} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{label}</div>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", background: "#1a1f2e", border: "1px solid #2a2f3e", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{label}</div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        style={{ width: "100%", background: "#1a1f2e", border: "1px solid #2a2f3e", borderRadius: 10, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit" }}
      />
    </div>
  );
}

function NavButton({ label, onClick, disabled, secondary }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ flex: 1, background: secondary ? "transparent" : disabled ? "#333" : "#ff6b35", color: secondary ? "#888" : disabled ? "#666" : "#fff", border: secondary ? "1px solid #2a2f3e" : "none", borderRadius: 12, padding: "13px", fontSize: 14, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
      {label}
    </button>
  );
}

// PROFILE SCREEN
function ProfileScreen({ userType, setUserType, userPoints }) {
  const perks = [
    { points: 100, perk: "10% off at partner cafes", unlocked: userPoints >= 100 },
    { points: 250, perk: "Locals Only mode access", unlocked: userPoints >= 250 },
    { points: 500, perk: "Verified Local badge", unlocked: userPoints >= 500 },
    { points: 1000, perk: "Free Premium upgrade", unlocked: userPoints >= 1000 },
  ];

  return (
    <div style={{ padding: "0 0 80px" }}>
      <div style={{ padding: "24px 20px 16px" }}>
        <div style={{ fontSize: 11, color: "#ff6b35", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Account</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: "#fff", fontFamily: "'Playfair Display', Georgia, serif" }}>Your<br /><span style={{ color: "#ff6b35" }}>Profile</span></div>
      </div>

      {/* Avatar & Points */}
      <div style={{ margin: "0 20px 20px", background: "linear-gradient(135deg, #1a1f2e, #0d1117)", border: "1px solid #1e2333", borderRadius: 16, padding: "24px", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, background: "#ff6b3522", borderRadius: 20, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, border: "2px solid #ff6b3544" }}>🧑‍🌾</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Traveler_01</div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Member since March 2026</div>
        <div style={{ marginTop: 16, display: "flex", gap: 12, justifyContent: "center" }}>
          <div style={{ background: "#ff6b3511", borderRadius: 10, padding: "10px 20px", border: "1px solid #ff6b3533" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#ff6b35" }}>{userPoints}</div>
            <div style={{ fontSize: 11, color: "#888" }}>NativePoints</div>
          </div>
          <div style={{ background: "#00e67611", borderRadius: 10, padding: "10px 20px", border: "1px solid #00e67622" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#00e676" }}>3</div>
            <div style={{ fontSize: 11, color: "#888" }}>Spots Added</div>
          </div>
        </div>
      </div>

      {/* Mode toggle */}
      <div style={{ margin: "0 20px 20px" }}>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>Viewing Mode</div>
        <div style={{ display: "flex", gap: 8 }}>
          {["tourist", "local"].map(type => (
            <button key={type} onClick={() => setUserType(type)} style={{ flex: 1, background: userType === type ? "#ff6b35" : "#1a1f2e", color: userType === type ? "#fff" : "#888", border: userType === type ? "none" : "1px solid #2a2f3e", borderRadius: 10, padding: "11px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>
              {type === "tourist" ? "🌍 Tourist" : "🏠 Local"}
            </button>
          ))}
        </div>
        {userType === "local" && <div style={{ marginTop: 8, fontSize: 12, color: "#a78bfa" }}>✓ Locals Only spots are now visible to you</div>}
      </div>

      {/* Rewards */}
      <div style={{ padding: "0 20px" }}>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 10, letterSpacing: 1, textTransform: "uppercase", fontSize: 11, fontWeight: 700 }}>Rewards Ladder</div>
        {perks.map(p => (
          <div key={p.points} style={{ background: p.unlocked ? "#00e67611" : "#0d1117", border: `1px solid ${p.unlocked ? "#00e67633" : "#1e2333"}`, borderRadius: 12, padding: "12px 16px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: p.unlocked ? "#fff" : "#666" }}>{p.perk}</div>
              <div style={{ fontSize: 11, color: p.unlocked ? "#00e676" : "#444", marginTop: 2 }}>{p.points} points required</div>
            </div>
            <span style={{ fontSize: 18 }}>{p.unlocked ? "✅" : "🔒"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("discover");
  const [userType, setUserType] = useState("tourist");
  const [userPoints, setUserPoints] = useState(120);

  const tabs = [
    { id: "discover", icon: "🧭", label: "Discover" },
    { id: "map", icon: "🗺️", label: "Map" },
    { id: "guides", icon: "👥", label: "Locals" },
    { id: "submit", icon: "➕", label: "Submit" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  const renderScreen = () => {
    switch (activeTab) {
      case "discover": return <DiscoverScreen userType={userType} />;
      case "map": return <MapScreen />;
      case "guides": return <GuidesScreen />;
      case "submit": return <SubmitScreen userPoints={userPoints} setUserPoints={setUserPoints} />;
      case "profile": return <ProfileScreen userType={userType} setUserType={setUserType} userPoints={userPoints} />;
      default: return null;
    }
  };

  return (
    <div style={{
      background: "#070b12",
      minHeight: "100vh",
      maxWidth: 430,
      margin: "0 auto",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      position: "relative",
      color: "#fff",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=DM+Sans:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0; }
        input::placeholder, textarea::placeholder { color: #444; }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: translate(-50%,-50%) scale(1); }
          50% { opacity: 0.7; transform: translate(-50%,-50%) scale(1.15); }
        }
      `}</style>

      {/* Status bar */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px 0", fontSize: 11, color: "#666" }}>
        <span>9:41</span>
        <span style={{ color: "#ff6b35", fontWeight: 700, fontSize: 10, letterSpacing: 1 }}>NATIVEKNOWS BETA</span>
        <span>●●● 5G</span>
      </div>

      {/* Screen content */}
      <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 80px)" }}>
        {renderScreen()}
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 430,
        background: "rgba(7, 11, 18, 0.95)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid #1e2333",
        display: "flex",
        padding: "8px 0 12px",
        zIndex: 100,
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "4px 0",
              fontFamily: "inherit",
            }}
          >
            <div style={{
              fontSize: activeTab === tab.id ? 22 : 20,
              filter: activeTab === tab.id ? "none" : "grayscale(100%) opacity(0.4)",
              transition: "all 0.2s",
              transform: activeTab === tab.id ? "scale(1.1)" : "scale(1)",
            }}>
              {tab.icon}
            </div>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              color: activeTab === tab.id ? "#ff6b35" : "#444",
              letterSpacing: 0.3,
            }}>
              {tab.label}
            </div>
            {activeTab === tab.id && (
              <div style={{ position: "absolute", bottom: 0, width: 28, height: 2.5, background: "#ff6b35", borderRadius: 2 }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
