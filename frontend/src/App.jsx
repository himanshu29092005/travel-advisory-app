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
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [weather, setWeather] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [weatherTip, setWeatherTip] = useState("")
  const [weatherTipLoading, setWeatherTipLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [budget, setBudget] = useState(10000)
  const [interests, setInterests] = useState([])
  const [reply, setReply] = useState("")
  const [chatLoading, setChatLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("weather")

  const handleCityInput = async (val) => {
    setCity(val)
    if (val.length >= 2) {
      try {
        const res = await axios.get(`http://localhost:8000/api/weather/suggest/${val}`)
        setSuggestions(res.data.suggestions)
        setShowSuggestions(true)
      } catch {
        setSuggestions([])
      }
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const selectCity = (selectedCity) => {
    setCity(selectedCity)
    setSuggestions([])
    setShowSuggestions(false)
    fetchWeather(selectedCity)
  }

  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) return
    setWeatherLoading(true)
    setWeather(null)
    setWeatherTip("")
    try {
      const res = await axios.get(`http://localhost:8000/api/weather/${encodeURIComponent(cityName)}`)
      setWeather(res.data)
      if (!res.data.error) getWeatherTip(res.data)
    } catch {
      setWeather({ error: "City not found — please try again!" })
    }
    setWeatherLoading(false)
  }

  const getWeather = () => {
    setShowSuggestions(false)
    fetchWeather(city)
  }

  const getWeatherTip = async (weatherData) => {
    setWeatherTipLoading(true)
    try {
      const res = await axios.post("http://localhost:8000/api/chat/", {
        message: `Weather in ${weatherData.city}: ${weatherData.weather}, ${weatherData.temperature}°C, humidity ${weatherData.humidity}%, wind ${weatherData.wind_speed} m/s.
1. Is it a good time to visit? Why?
2. What should tourists pack/wear?
3. Top 3 things to do there in this weather?
Keep it short and practical.`,
        budget: 10000,
        interests: ["Travel"],
      })
      setWeatherTip(res.data.reply)
    } catch {
      setWeatherTip("")
    }
    setWeatherTipLoading(false)
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

  const formatReply = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br/>")
  }

  const getWeatherEmoji = (desc) => {
    if (!desc) return "🌤️"
    const d = desc.toLowerCase()
    if (d.includes("clear")) return "☀️"
    if (d.includes("cloud")) return "☁️"
    if (d.includes("rain")) return "🌧️"
    if (d.includes("storm")) return "⛈️"
    if (d.includes("snow")) return "❄️"
    if (d.includes("mist") || d.includes("fog")) return "🌫️"
    if (d.includes("haze")) return "🌫️"
    return "🌤️"
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; }
        .glow-btn { transition: all 0.3s ease; }
        .glow-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(102,126,234,0.5); }
        .card-hover { transition: all 0.3s ease; }
        .card-hover:hover { transform: translateY(-3px); }
        .tab-btn { transition: all 0.3s ease; }
        .interest-btn { transition: all 0.2s ease; }
        .interest-btn:hover { transform: scale(1.05); }
        .suggestion-item { transition: background 0.15s ease; }
        input[type=range] { -webkit-appearance: none; height: 6px; border-radius: 3px; background: #e2e8f0; outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); cursor: pointer; box-shadow: 0 2px 8px rgba(102,126,234,0.4); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 3px; }
        ::-webkit-scrollbar-thumb { background: #c7d2fe; border-radius: 3px; }
      `}</style>

      <div style={s.root}>

        {/* Animated BG Blobs */}
        <div style={{...s.blob, top: "-100px", left: "-100px", background: "rgba(102,126,234,0.15)"}} />
        <div style={{...s.blob, bottom: "-100px", right: "-100px", background: "rgba(118,75,162,0.15)", width: 500, height: 500}} />

        {/* Navbar */}
        <nav style={s.nav}>
          <div style={s.navLeft}>
            <div style={s.navIcon}>✈️</div>
            <div>
              <div style={s.navLogo}>TravelMadeEazy</div>
              <div style={s.navTagline}>AI-Powered Travel Advisor</div>
            </div>
          </div>
          <div style={s.navRight}>
            <div style={s.onlineBadge}>
              <span style={s.onlineDot} />
              AI Online
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div style={s.hero}>
          <div style={s.heroTag}>🌍 Smart Travel Planning</div>
          <h1 style={s.heroTitle}>
            Plan Your <span style={s.heroGradient}>Perfect Trip</span>
          </h1>
          <p style={s.heroSub}>
            Real-time weather · AI itineraries · Budget planning — all in one place
          </p>

          {/* Stats Row */}
          <div style={s.statsRow}>
            {[
              { num: "50+", label: "Countries" },
              { num: "AI", label: "Powered" },
              { num: "Free", label: "Forever" },
            ].map((st, i) => (
              <div key={i} style={s.statCard}>
                <div style={s.statNum}>{st.num}</div>
                <div style={s.statLabel}>{st.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={s.tabBar}>
          {[
            { id: "weather", icon: "🌤️", label: "Weather" },
            { id: "chat", icon: "🤖", label: "AI Advisor" },
          ].map((tab) => (
            <button key={tab.id} className="tab-btn"
              onClick={() => setActiveTab(tab.id)}
              style={{ ...s.tab, ...(activeTab === tab.id ? s.tabActive : {}) }}>
              <span style={{ fontSize: 18 }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div style={s.container}>

          {/* WEATHER TAB */}
          {activeTab === "weather" && (
            <div style={s.card}>

              <div style={s.cardHeader}>
                <div style={s.cardIconWrap}>🌤️</div>
                <div>
                  <h2 style={s.cardTitle}>Live Weather Checker</h2>
                  <p style={s.cardSub}>Type a city — get weather + AI travel tips instantly!</p>
                </div>
              </div>

              <div style={{ position: "relative", marginBottom: 24 }}>
                <div style={s.searchRow}>
                  <div style={s.inputWrap}>
                    <span style={s.inputIcon}>🔍</span>
                    <input
                      value={city}
                      onChange={(e) => handleCityInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && getWeather()}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      placeholder="Type city — e.g. Rewari, Mumbai, Goa..."
                      style={s.input}
                    />
                  </div>
                  <button onClick={getWeather} className="glow-btn" style={s.btnPrimary}>
                    {weatherLoading ? "⏳" : "Search"}
                  </button>
                </div>

                {showSuggestions && suggestions.length > 0 && (
                  <div style={s.dropdown}>
                    {suggestions.map((sg, i) => (
                      <div key={i} className="suggestion-item"
                        onClick={() => selectCity(sg.full_name)}
                        style={s.dropdownItem}
                        onMouseEnter={e => e.currentTarget.style.background = "#f8faff"}
                        onMouseLeave={e => e.currentTarget.style.background = "white"}>
                        <div style={s.dropPin}>📍</div>
                        <div>
                          <div style={s.dropCity}>{sg.name}</div>
                          <div style={s.dropState}>{sg.state}{sg.state ? ", " : ""}{sg.country}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {weatherLoading && (
                <div style={s.loadingBox}>
                  <div style={s.loadingSpinner}>⏳</div>
                  <div>Fetching live weather data...</div>
                </div>
              )}

              {weather && !weather.error && (
                <>
                  {/* Weather Hero Card */}
                  <div style={s.weatherHero}>
                    <div style={s.weatherHeroLeft}>
                      <div style={s.weatherEmoji}>{getWeatherEmoji(weather.weather)}</div>
                      <div>
                        <div style={s.weatherCityName}>{weather.city}</div>
                        <div style={s.weatherCondition}>{weather.weather}</div>
                      </div>
                    </div>
                    <div style={s.weatherTemp}>{weather.temperature}°C</div>
                  </div>

                  {/* Weather Stats */}
                  <div style={s.weatherGrid}>
                    {[
                      { icon: "🤔", label: "Feels Like", val: `${weather.feels_like}°C`, color: "#6366f1" },
                      { icon: "💧", label: "Humidity", val: `${weather.humidity}%`, color: "#0ea5e9" },
                      { icon: "🌬️", label: "Wind Speed", val: `${weather.wind_speed} m/s`, color: "#10b981" },
                      { icon: "🌡️", label: "Temperature", val: `${weather.temperature}°C`, color: "#f59e0b" },
                    ].map((w, i) => (
                      <div key={i} className="card-hover" style={{...s.weatherTile, borderTop: `3px solid ${w.color}`}}>
                        <div style={{ fontSize: 26 }}>{w.icon}</div>
                        <div style={{...s.weatherTileVal, color: w.color}}>{w.val}</div>
                        <div style={s.weatherTileLabel}>{w.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* AI Tips */}
                  <div style={s.tipBox}>
                    <div style={s.tipHeaderRow}>
                      <div style={s.tipIconWrap}>🤖</div>
                      <div style={s.tipTitle}>AI Travel Tips for {weather.city}</div>
                    </div>
                    {weatherTipLoading ? (
                      <div style={s.tipLoading}>
                        <span style={{ marginRight: 8 }}>✨</span>
                        Generating personalized travel tips...
                      </div>
                    ) : weatherTip ? (
                      <div style={s.tipText}
                        dangerouslySetInnerHTML={{ __html: formatReply(weatherTip) }} />
                    ) : null}
                  </div>
                </>
              )}

              {weather?.error && (
                <div style={s.errorBox}>
                  <span style={{ fontSize: 24 }}>😕</span>
                  <div>{weather.error}</div>
                </div>
              )}
            </div>
          )}

          {/* CHAT TAB */}
          {activeTab === "chat" && (
            <div style={s.card}>

              <div style={s.cardHeader}>
                <div style={{...s.cardIconWrap, background: "linear-gradient(135deg, #10b981, #059669)"}}>🤖</div>
                <div>
                  <h2 style={s.cardTitle}>AI Travel Advisor</h2>
                  <p style={s.cardSub}>Set budget & interests — get a personalized trip plan!</p>
                </div>
              </div>

              {/* Budget */}
              <div style={s.section}>
                <div style={s.sectionHeader}>
                  <div style={s.sectionLabel}>
                    <span style={{ marginRight: 6 }}>💰</span> Your Budget
                  </div>
                  <div style={s.budgetBadge}>₹{parseInt(budget).toLocaleString()}</div>
                </div>
                <input type="range" min="1000" max="100000" step="500" value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  style={{ width: "100%", marginTop: 10 }} />
                <div style={s.sliderLabels}>
                  <span>₹1,000</span>
                  <span style={{ color: "#7c3aed", fontWeight: 600 }}>Budget Slider</span>
                  <span>₹1,00,000</span>
                </div>
              </div>

              {/* Interests */}
              <div style={s.section}>
                <div style={s.sectionLabel}>
                  <span style={{ marginRight: 6 }}>🎯</span> Select Your Interests
                </div>
                <div style={s.interestGrid}>
                  {INTERESTS.map(({ label, value }) => (
                    <button key={value} className="interest-btn"
                      onClick={() => toggleInterest(value)}
                      style={{ ...s.interestBtn, ...(interests.includes(value) ? s.interestBtnActive : {}) }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div style={s.section}>
                <div style={s.sectionLabel}>
                  <span style={{ marginRight: 6 }}>💬</span> Ask Your Travel Question
                </div>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Plan a 3-day trip to Goa within ₹15,000 with beach and food..."
                  style={s.textarea} />
              </div>

              <button onClick={sendMessage} disabled={chatLoading} className="glow-btn"
                style={{ ...s.btnPrimary, width: "100%", padding: "16px", fontSize: 16, borderRadius: 14 }}>
                {chatLoading ? "🤔 Thinking..." : "🚀 Ask AI"}
              </button>

              {reply && (
                <div style={s.replyBox}>
                  <div style={s.replyHeaderRow}>
                    <div style={s.replyIcon}>🤖</div>
                    <div style={s.replyTitle}>AI Response</div>
                  </div>
                  <div style={s.replyText}
                    dangerouslySetInnerHTML={{ __html: formatReply(reply) }} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={s.footer}>
          <div style={s.footerLogo}>✈️ TravelMadeEazy</div>
          <div style={s.footerSub}>Built with ❤️ using React + FastAPI + Groq AI</div>
          <div style={s.footerCopy}>© 2025 TravelMadeEazy. All rights reserved.</div>
        </div>
      </div>
    </>
  )
}

const s = {
  root: { minHeight: "100vh", background: "linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #1a1a2e 100%)", fontFamily: "'Inter', sans-serif", position: "relative", overflow: "hidden" },
  blob: { position: "absolute", width: 600, height: 600, borderRadius: "50%", filter: "blur(80px)", zIndex: 0, pointerEvents: "none" },

  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)", position: "relative", zIndex: 10 },
  navLeft: { display: "flex", alignItems: "center", gap: 12 },
  navIcon: { fontSize: 32 },
  navLogo: { color: "white", fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px" },
  navTagline: { color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 1 },
  navRight: { display: "flex", gap: 12, alignItems: "center" },
  onlineBadge: { display: "flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  onlineDot: { width: 7, height: 7, borderRadius: "50%", background: "#34d399", display: "inline-block", boxShadow: "0 0 6px #34d399" },

  hero: { textAlign: "center", padding: "60px 20px 30px", position: "relative", zIndex: 1 },
  heroTag: { display: "inline-block", background: "rgba(102,126,234,0.2)", border: "1px solid rgba(102,126,234,0.4)", color: "#a5b4fc", padding: "6px 18px", borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 20 },
  heroTitle: { color: "white", fontSize: 52, fontWeight: 900, lineHeight: 1.1, marginBottom: 16, letterSpacing: "-1px" },
  heroGradient: { background: "linear-gradient(135deg, #667eea, #f093fb)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSub: { color: "rgba(255,255,255,0.55)", fontSize: 17, maxWidth: 500, margin: "0 auto 32px", lineHeight: 1.6 },
  statsRow: { display: "flex", justifyContent: "center", gap: 16 },
  statCard: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "14px 28px", textAlign: "center" },
  statNum: { color: "white", fontSize: 22, fontWeight: 800 },
  statLabel: { color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 },

  tabBar: { display: "flex", justifyContent: "center", gap: 8, padding: "28px 20px 0", position: "relative", zIndex: 1 },
  tab: { display: "flex", alignItems: "center", gap: 8, padding: "13px 32px", borderRadius: 50, border: "1.5px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.55)", fontSize: 15, fontWeight: 600, cursor: "pointer" },
  tabActive: { background: "linear-gradient(135deg, #667eea, #764ba2)", border: "1.5px solid transparent", color: "white", boxShadow: "0 8px 24px rgba(102,126,234,0.4)" },

  container: { maxWidth: 720, margin: "28px auto 40px", padding: "0 20px", position: "relative", zIndex: 1 },

  card: { background: "rgba(255,255,255,0.97)", borderRadius: 28, padding: "36px", boxShadow: "0 40px 100px rgba(0,0,0,0.4)", backdropFilter: "blur(20px)" },
  cardHeader: { display: "flex", alignItems: "center", gap: 16, marginBottom: 28 },
  cardIconWrap: { width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, #667eea, #764ba2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 },
  cardTitle: { fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" },
  cardSub: { fontSize: 13, color: "#94a3b8", marginTop: 3 },

  searchRow: { display: "flex", gap: 10 },
  inputWrap: { flex: 1, display: "flex", alignItems: "center", background: "#f8fafc", border: "2px solid #e2e8f0", borderRadius: 14, padding: "0 16px", gap: 10, transition: "border 0.2s" },
  inputIcon: { fontSize: 16 },
  input: { flex: 1, border: "none", background: "transparent", padding: "14px 0", fontSize: 14, outline: "none", color: "#1e293b" },
  btnPrimary: { padding: "14px 24px", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", border: "none", borderRadius: 14, cursor: "pointer", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" },

  dropdown: { position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "white", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", zIndex: 200, overflow: "hidden", border: "1px solid #e2e8f0" },
  dropdownItem: { padding: "13px 18px", cursor: "pointer", background: "white", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 12 },
  dropPin: { fontSize: 18, flexShrink: 0 },
  dropCity: { fontSize: 14, fontWeight: 600, color: "#1e293b" },
  dropState: { fontSize: 12, color: "#94a3b8", marginTop: 2 },

  loadingBox: { textAlign: "center", padding: "30px 20px", color: "#7c3aed", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 },
  loadingSpinner: { fontSize: 22 },

  weatherHero: { background: "linear-gradient(135deg, #667eea, #764ba2)", borderRadius: 20, padding: "24px 28px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" },
  weatherHeroLeft: { display: "flex", alignItems: "center", gap: 16 },
  weatherEmoji: { fontSize: 48 },
  weatherCityName: { color: "white", fontSize: 22, fontWeight: 800 },
  weatherCondition: { color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 3, textTransform: "capitalize" },
  weatherTemp: { color: "white", fontSize: 56, fontWeight: 900, letterSpacing: "-2px" },

  weatherGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 },
  weatherTile: { background: "#fafafa", borderRadius: 16, padding: "18px", textAlign: "center", border: "1px solid #f1f5f9" },
  weatherTileVal: { fontSize: 22, fontWeight: 800, margin: "8px 0 4px" },
  weatherTileLabel: { fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" },

  tipBox: { background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", borderRadius: 20, padding: "22px", border: "1px solid #bbf7d0" },
  tipHeaderRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 },
  tipIconWrap: { width: 34, height: 34, background: "#16a34a", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 },
  tipTitle: { fontWeight: 700, color: "#15803d", fontSize: 14 },
  tipLoading: { color: "#16a34a", fontSize: 13, fontStyle: "italic", display: "flex", alignItems: "center" },
  tipText: { color: "#166534", lineHeight: 1.9, fontSize: 13.5 },

  errorBox: { background: "#fef2f2", borderRadius: 16, padding: 20, color: "#dc2626", textAlign: "center", marginTop: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 },

  section: { marginBottom: 24 },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  sectionLabel: { fontSize: 13, fontWeight: 700, color: "#374151", display: "flex", alignItems: "center" },
  budgetBadge: { background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", padding: "6px 16px", borderRadius: 20, fontSize: 15, fontWeight: 800 },
  sliderLabels: { display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginTop: 8 },

  interestGrid: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 },
  interestBtn: { padding: "9px 16px", borderRadius: 50, border: "2px solid #e2e8f0", background: "white", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  interestBtnActive: { border: "2px solid #7c3aed", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", boxShadow: "0 4px 12px rgba(102,126,234,0.4)" },

  textarea: { width: "100%", padding: "14px 16px", borderRadius: 14, border: "2px solid #e2e8f0", fontSize: 14, height: 110, resize: "none", boxSizing: "border-box", outline: "none", fontFamily: "inherit", color: "#1e293b", lineHeight: 1.6, marginTop: 10 },

  replyBox: { marginTop: 24, background: "linear-gradient(135deg, #f8faff, #f0f4ff)", borderRadius: 20, padding: "22px", maxHeight: "520px", overflowY: "auto", border: "1px solid #e0e7ff" },
  replyHeaderRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 },
  replyIcon: { width: 34, height: 34, background: "linear-gradient(135deg, #667eea, #764ba2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 },
  replyTitle: { fontWeight: 700, color: "#1e293b", fontSize: 15 },
  replyText: { color: "#334155", lineHeight: 1.9, fontSize: 14 },

  footer: { textAlign: "center", padding: "40px 20px", position: "relative", zIndex: 1 },
  footerLogo: { color: "white", fontSize: 20, fontWeight: 800, marginBottom: 8 },
  footerSub: { color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 6 },
  footerCopy: { color: "rgba(255,255,255,0.2)", fontSize: 12 },
}