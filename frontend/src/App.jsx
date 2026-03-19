import { useState } from "react"
import axios from "axios"

const INTERESTS = [
  { label: "🏔️ Mountains", value: "Mountains" },
  { label: "🏖️ Beach", value: "Beach" },
  { label: "🏛️ History", value: "History" },
  { label: "🍜 Food", value: "Food" },
  { label: "🧗 Adventure", value: "Adventure" },
  { label: "🛍️ Shopping", value: "Shopping" },
  { label: "🌿 Nature", value: "Nature" },
  { label: "📸 Photography", value: "Photography" },
]

export default function App() {
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [budget, setBudget] = useState(10000)
  const [interests, setInterests] = useState([])
  const [reply, setReply] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("weather")

  const getWeather = async () => {
    if (!city.trim()) return
    setWeatherLoading(true)
    setWeather(null)
    try {
      const res = await axios.get(`http://localhost:8000/api/weather/${city}`)
      setWeather(res.data)
    } catch {
      setWeather({ error: "City not found — please try again!" })
    }
    setWeatherLoading(false)
  }

  const sendMessage = async () => {
    if (!message.trim()) return
    setChatLoading(true)
    setReply("")
    try {
      const res = await axios.post("http://localhost:8000/api/chat/", {
        message,
        budget: parseFloat(budget),
        interests,
      })
      setReply(res.data.reply)
    } catch {
      setReply("Something went wrong — please try again!")
    }
    setChatLoading(false)
  }

  const toggleInterest = (val) =>
    setInterests((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
    )

  return (
    <div style={styles.root}>
      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>✈️ TravelMadeEazy</div>
        <div style={styles.navBadge}>🟢 AI Online</div>
      </nav>

      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Plan Your Perfect Trip</h1>
        <p style={styles.heroSub}>Live Weather · AI Suggestions · Budget Planning — All in One Place</p>
      </div>

      {/* Tabs */}
      <div style={styles.tabBar}>
        {["weather", "chat"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ ...styles.tab, ...(activeTab === tab ? styles.tabActive : {}) }}
          >
            {tab === "weather" ? "🌤️ Weather" : "🤖 AI Advisor"}
          </button>
        ))}
      </div>

      <div style={styles.container}>

        {/* WEATHER TAB */}
        {activeTab === "weather" && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🌤️ Live Weather Checker</h2>
            <p style={styles.cardSub}>Check real-time weather of any city before planning your trip!</p>

            <div style={styles.searchRow}>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && getWeather()}
                placeholder="Enter city name — e.g. Mumbai, Paris, New York"
                style={styles.input}
              />
              <button onClick={getWeather} style={styles.btnPrimary}>
                {weatherLoading ? "⏳" : "Search 🔍"}
              </button>
            </div>

            {weatherLoading && (
              <div style={styles.loadingBox}>⏳ Fetching weather data...</div>
            )}

            {weather && !weather.error && (
              <div style={styles.weatherResult}>
                <div style={styles.weatherCity}>📍 {weather.city}</div>
                <div style={styles.weatherDesc}>☁️ {weather.weather}</div>
                <div style={styles.weatherGrid}>
                  {[
                    { icon: "🌡️", label: "Temperature", val: `${weather.temperature}°C` },
                    { icon: "🤔", label: "Feels Like", val: `${weather.feels_like}°C` },
                    { icon: "💧", label: "Humidity", val: `${weather.humidity}%` },
                    { icon: "🌬️", label: "Wind Speed", val: `${weather.wind_speed} m/s` },
                  ].map((w, i) => (
                    <div key={i} style={styles.weatherTile}>
                      <div style={{ fontSize: 28 }}>{w.icon}</div>
                      <div style={styles.weatherTileVal}>{w.val}</div>
                      <div style={styles.weatherTileLabel}>{w.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {weather?.error && (
              <div style={styles.errorBox}>❌ {weather.error}</div>
            )}
          </div>
        )}

        {/* CHAT TAB */}
        {activeTab === "chat" && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🤖 AI Travel Advisor</h2>
            <p style={styles.cardSub}>Tell us your budget & interests — our AI will plan the perfect trip!</p>

            {/* Budget */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <span style={styles.sectionLabel}>💰 Your Budget</span>
                <span style={styles.budgetValue}>₹{parseInt(budget).toLocaleString()}</span>
              </div>
              <input
                type="range" min="1000" max="100000" step="500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                style={{ width: "100%", accentColor: "#7c3aed", marginTop: 6 }}
              />
              <div style={styles.sliderLabels}>
                <span>₹1,000</span><span>₹1,00,000</span>
              </div>
            </div>

            {/* Interests */}
            <div style={styles.section}>
              <div style={styles.sectionLabel}>🎯 Select Your Interests</div>
              <div style={styles.interestGrid}>
                {INTERESTS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => toggleInterest(value)}
                    style={{
                      ...styles.interestBtn,
                      ...(interests.includes(value) ? styles.interestBtnActive : {}),
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div style={styles.section}>
              <div style={styles.sectionLabel}>💬 Ask Your Travel Question</div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Plan a 3-day trip to Goa within ₹15,000..."
                style={styles.textarea}
              />
            </div>

            <button
              onClick={sendMessage}
              disabled={chatLoading}
              style={{ ...styles.btnPrimary, width: "100%", padding: "15px", fontSize: 16 }}
            >
              {chatLoading ? "🤔 Thinking..." : "🚀 Ask AI"}
            </button>

            {reply && (
              <div style={styles.replyBox}>
                <div style={styles.replyHeader}>🤖 AI Response:</div>
                <div style={styles.replyText}>{reply}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        Built with ❤️ · TravelMadeEazy © 2025
      </div>
    </div>
  )
}

const styles = {
  root: { minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)", fontFamily: "'Segoe UI', sans-serif" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 40px", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.1)" },
  navLogo: { color: "white", fontSize: 24, fontWeight: 700 },
  navBadge: { background: "rgba(255,255,255,0.1)", color: "white", padding: "6px 14px", borderRadius: 20, fontSize: 13 },
  hero: { textAlign: "center", padding: "50px 20px 20px" },
  heroTitle: { color: "white", fontSize: 42, fontWeight: 800, margin: "0 0 10px" },
  heroSub: { color: "rgba(255,255,255,0.6)", fontSize: 16, margin: 0 },
  tabBar: { display: "flex", justifyContent: "center", gap: 12, padding: "24px 20px 0" },
  tab: { padding: "12px 30px", borderRadius: 25, border: "2px solid rgba(255,255,255,0.2)", background: "transparent", color: "rgba(255,255,255,0.6)", fontSize: 15, fontWeight: 600, cursor: "pointer" },
  tabActive: { background: "linear-gradient(135deg, #667eea, #764ba2)", border: "2px solid transparent", color: "white" },
  container: { maxWidth: 700, margin: "24px auto 40px", padding: "0 20px" },
  card: { background: "white", borderRadius: 24, padding: 32, boxShadow: "0 30px 80px rgba(0,0,0,0.3)" },
  cardTitle: { margin: "0 0 6px", fontSize: 22, fontWeight: 700, color: "#1e293b" },
  cardSub: { margin: "0 0 24px", color: "#94a3b8", fontSize: 14 },
  searchRow: { display: "flex", gap: 10, marginBottom: 20 },
  input: { flex: 1, padding: "13px 16px", borderRadius: 12, border: "2px solid #e2e8f0", fontSize: 14, outline: "none" },
  btnPrimary: { padding: "13px 22px", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 700 },
  loadingBox: { textAlign: "center", padding: 20, color: "#7c3aed", fontSize: 15 },
  weatherResult: { background: "linear-gradient(135deg, #667eea15, #764ba215)", borderRadius: 16, padding: 24 },
  weatherCity: { fontSize: 22, fontWeight: 700, color: "#1e293b", marginBottom: 4 },
  weatherDesc: { color: "#64748b", fontSize: 14, marginBottom: 16, textTransform: "capitalize" },
  weatherGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  weatherTile: { background: "white", borderRadius: 12, padding: 16, textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" },
  weatherTileVal: { fontSize: 20, fontWeight: 700, color: "#1e293b", margin: "6px 0 2px" },
  weatherTileLabel: { fontSize: 11, color: "#94a3b8" },
  errorBox: { background: "#fef2f2", borderRadius: 12, padding: 16, color: "#dc2626", textAlign: "center", marginTop: 16 },
  section: { marginBottom: 20 },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  sectionLabel: { fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 8, display: "block" },
  budgetValue: { fontSize: 18, fontWeight: 800, color: "#7c3aed" },
  sliderLabels: { display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 4 },
  interestGrid: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 },
  interestBtn: { padding: "8px 14px", borderRadius: 20, border: "2px solid #e2e8f0", background: "white", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  interestBtnActive: { border: "2px solid #7c3aed", background: "#7c3aed", color: "white" },
  textarea: { width: "100%", padding: "13px 16px", borderRadius: 12, border: "2px solid #e2e8f0", fontSize: 14, height: 100, resize: "none", boxSizing: "border-box", outline: "none", fontFamily: "inherit" },
  replyBox: { marginTop: 20, background: "linear-gradient(135deg, #667eea15, #764ba215)", borderRadius: 16, padding: 20 },
  replyHeader: { fontWeight: 700, color: "#1e293b", marginBottom: 10, fontSize: 15 },
  replyText: { color: "#334155", lineHeight: 1.8, whiteSpace: "pre-wrap", fontSize: 14 },
  footer: { textAlign: "center", color: "rgba(255,255,255,0.3)", padding: "20px", fontSize: 13 },
}