import { useState, type ReactNode } from "react";

// ─── Types ───────────────────────────────────────────────────
type Screen = "login" | "catalog" | "detail" | "rentals" | "profile";

interface Game {
  id: number; title: string; platform: string; genre: string; rating: string;
  ppd: number; stars: number; reviews: number; cover: string; coverWide?: string;
  metacritic?: number; developer?: string; publisher?: string; year?: number; synopsis?: string;
}

interface Rental {
  id: number; game: Game; period: 7 | 15 | 30 | "sub";
  daysTotal: number; daysUsed: number; startDate: string; endDate: string;
}

// ─── Palette & helpers ───────────────────────────────────────
const C = {
  bg: "#1A0B2E", card: "#2D1B4E", surface: "#1C0E38",
  blue: "#00F0FF", green: "#39FF14", purple: "#9B30FF",
  white: "#FFFFFF", gray: "#B8A9CC", dim: "#5E4B78",
  red: "#FF4444", border: "rgba(0,240,255,0.12)", borderG: "rgba(57,255,20,0.2)",
};

const gB = (s = 1) => ({ boxShadow: `0 0 ${14 * s}px rgba(0,240,255,${0.5 * s}), 0 0 ${30 * s}px rgba(0,240,255,${0.18 * s})` });
const gG = (s = 1) => ({ boxShadow: `0 0 ${14 * s}px rgba(57,255,20,${0.5 * s}), 0 0 ${30 * s}px rgba(57,255,20,${0.18 * s})` });
const tB = { textShadow: "0 0 12px rgba(0,240,255,0.9)" };
const tG = { textShadow: "0 0 12px rgba(57,255,20,0.9)" };

const MONTHS = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const fmtDate = (d: Date) => `${String(d.getDate()).padStart(2,"0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
const fmtShort = (d: Date) => `${String(d.getDate()).padStart(2,"0")} ${MONTHS[d.getMonth()]}`;

// ─── Game data ───────────────────────────────────────────────
const MW2: Game = {
  id: 0, title: "Call of Duty: Modern Warfare 2", platform: "PS5",
  genre: "FPS / Ação", rating: "18+", ppd: 14.9, stars: 4.9, reviews: 18420,
  metacritic: 94, developer: "Infinity Ward", publisher: "Activision", year: 2009,
  cover: "https://images.unsplash.com/photo-1595472968262-48209bf5b390?w=400&h=560&fit=crop&auto=format",
  coverWide: "https://images.unsplash.com/photo-1757258885972-3c111d1307f3?w=800&h=400&fit=crop&auto=format",
  synopsis: "Situado cinco anos após Call of Duty 4, o jogo acompanha a Task Force 141 na missão para capturar o terrorista Vladimir Makarov. Um massacre num aeroporto moscovita desencadeia uma invasão russa aos EUA, forçando Rangers americanos a defender Washington D.C. enquanto a Task Force busca provas para responsabilizar o vilão.",
};

const GAMES: Game[] = [
  MW2,
  { id: 1, title: "Shadow Blade: Eternal", platform: "PS5", genre: "Ação / RPG", rating: "18+", ppd: 12.9, stars: 4.8, reviews: 2341, cover: "https://images.unsplash.com/photo-1640903581708-8d491706515b?w=300&h=420&fit=crop&auto=format", synopsis: "Uma épica saga sombria onde você enfrenta hordas de demônios ancestrais para salvar um mundo à beira do colapso. Combate visceral que redefine o gênero." },
  { id: 2, title: "Neo Tokyo 2087", platform: "PS5", genre: "Ação / Aventura", rating: "16+", ppd: 10.9, stars: 4.5, reviews: 1876, cover: "https://images.unsplash.com/photo-1672872476232-da16b45c9001?w=300&h=420&fit=crop&auto=format", synopsis: "Explore uma megalópole cyberpunk do futuro. Hackeie sistemas corporativos e enfrente mega corporações em um mundo neon caótico cheio de segredos." },
  { id: 3, title: "Neon District", platform: "Xbox", genre: "RPG / Open World", rating: "14+", ppd: 9.9, stars: 4.3, reviews: 1203, cover: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=300&h=420&fit=crop&auto=format", synopsis: "Mundo aberto cyberpunk onde cada decisão molda sua identidade e destino no submundo criminal da cidade." },
  { id: 4, title: "Crimson Eclipse", platform: "Xbox", genre: "Shooter / Survival", rating: "18+", ppd: 11.9, stars: 4.6, reviews: 987, cover: "https://images.unsplash.com/photo-1629017131883-42f94a913c3f?w=300&h=420&fit=crop&auto=format", synopsis: "Sobreviva ao apocalipse vermelho num mundo devastado por anomalias cósmicas que corrompem a realidade e a sanidade." },
  { id: 5, title: "Kingdom's Fall", platform: "Switch", genre: "Estratégia / RPG", rating: "12+", ppd: 8.9, stars: 4.4, reviews: 3102, cover: "https://images.unsplash.com/photo-1698208189346-6b356d242b09?w=300&h=420&fit=crop&auto=format", synopsis: "Construa, conquiste e lidere um exército através de batalhas épicas num vasto reino medieval repleto de traições e alianças." },
  { id: 6, title: "Night Crawler", platform: "Switch", genre: "Stealth / Thriller", rating: "16+", ppd: 7.9, stars: 4.1, reviews: 654, cover: "https://images.unsplash.com/photo-1679590373888-9363db416357?w=300&h=420&fit=crop&auto=format", synopsis: "Infiltre instalações militares de alta segurança usando as sombras como sua única arma, sem ser detectado." },
];

const MOCK_HISTORY = [
  { title: "Cyberpunk Arena", platform: "PS5", dates: "10–25 Jul 2026", days: 15, cost: 163.5, img: "https://images.unsplash.com/photo-1563863251222-11d3e3bd3b62?w=80&h=80&fit=crop&auto=format" },
  { title: "Stellar Odyssey", platform: "Xbox", dates: "02–09 Jun 2026", days: 7, cost: 69.3, img: "https://images.unsplash.com/photo-1498736297812-3a08021f206f?w=80&h=80&fit=crop&auto=format" },
  { title: "Dragon Siege", platform: "Switch", dates: "15 Mai–14 Jun 2026", days: 30, cost: 267.0, img: "https://images.unsplash.com/photo-1560052775-e4f689f06f07?w=80&h=80&fit=crop&auto=format" },
];

// ─── Icons ───────────────────────────────────────────────────
const Ic = {
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Filter: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>,
  Heart: ({ on }: { on: boolean }) => <svg width="18" height="18" viewBox="0 0 24 24" fill={on ? "#FF4D6D" : "none"} stroke={on ? "#FF4D6D" : "white"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Bell: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>,
  Gamepad: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="10" rx="3"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><circle cx="15" cy="12" r="1.5" fill="currentColor"/><circle cx="18" cy="12" r="1.5" fill="currentColor"/></svg>,
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Star: ({ on }: { on: boolean }) => <svg width="11" height="11" viewBox="0 0 24 24" fill={on ? "#FFD700" : "none"} stroke="#FFD700" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Back: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>,
  Refresh: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  Box: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  Card: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Lock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  UserOutline: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Eye: ({ show }: { show: boolean }) => show
    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  Check: () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  CheckSm: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Edit: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  X: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  LogOut: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  ChevronRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
};

// ─── Shared components ───────────────────────────────────────
function StatusBar() {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px 0", height: 40, flexShrink: 0 }}>
      <span style={{ color: C.white, fontSize: 13, fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>9:41</span>
      <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
        <svg width="14" height="10" viewBox="0 0 14 10"><rect x="0" y="6" width="2" height="4" rx="1" fill="white"/><rect x="3" y="4" width="2" height="6" rx="1" fill="white"/><rect x="6" y="2" width="2" height="8" rx="1" fill="white"/><rect x="9" y="0" width="2" height="10" rx="1" fill="white"/></svg>
        <svg width="14" height="10" viewBox="0 0 18 14"><path d="M1 4C4 1 14 1 17 4" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/><path d="M3.5 7C5.5 5 12.5 5 14.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/><path d="M6 10C7 9 11 9 12 10" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/><circle cx="9" cy="13" r="1.5" fill="white"/></svg>
        <svg width="22" height="11" viewBox="0 0 22 11"><rect x="0" y="1" width="19" height="9" rx="2" stroke="white" strokeWidth="1.5" fill="none"/><rect x="19.5" y="3.5" width="2" height="4" rx="1" fill="white"/><rect x="1.5" y="2.5" width="14" height="6" rx="1" fill="white"/></svg>
      </div>
    </div>
  );
}

function BottomNav({ active, onNavigate }: { active: string; onNavigate: (s: Screen) => void }) {
  const items = [
    { id: "home", label: "Home", Icon: Ic.Home, target: "catalog" as Screen },
    { id: "search", label: "Buscar", Icon: Ic.Search, target: "catalog" as Screen },
    { id: "rentals", label: "Aluguéis", Icon: Ic.Gamepad, target: "rentals" as Screen },
    { id: "profile", label: "Perfil", Icon: Ic.User, target: "profile" as Screen },
  ];
  return (
    <div style={{ background: "rgba(26,11,46,0.97)", backdropFilter: "blur(16px)", borderTop: `1px solid ${C.border}`, padding: "8px 0 14px", display: "flex", justifyContent: "space-around", flexShrink: 0 }}>
      {items.map(({ id, label, Icon, target }) => {
        const on = id === active;
        return (
          <div key={id} onClick={() => onNavigate(target)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", padding: "4px 14px" }}>
            <div style={{ color: on ? C.blue : C.dim, position: "relative" }}>
              <Icon />
              {on && <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: C.blue, ...gB(0.9) }} />}
            </div>
            <span style={{ fontSize: 9, color: on ? C.blue : C.dim, fontWeight: on ? 700 : 400, fontFamily: "'Outfit', sans-serif" }}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(i => <Ic.Star key={i} on={i <= Math.floor(rating)} />)}</div>;
}

function Pill({ children, color, size = "md" }: { children: ReactNode; color: string; size?: "sm" | "md" }) {
  return (
    <span style={{ padding: size === "sm" ? "2px 6px" : "3px 9px", borderRadius: 6, border: `1px solid ${color}45`, background: `${color}18`, color, fontSize: size === "sm" ? 9 : 10, fontWeight: 700, letterSpacing: "0.04em", whiteSpace: "nowrap", fontFamily: "'Outfit', sans-serif" }}>
      {children}
    </span>
  );
}

function AvatarCircle({ name, size = 38 }: { name: string; size?: number }) {
  const words = name.trim().split(/\s+/);
  const initials = (words.length >= 2 ? words[0][0] + words[1][0] : words[0].slice(0, 2)).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg, ${C.purple}BB, ${C.blue}BB)`, border: `2px solid ${C.blue}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...gB(0.6) }}>
      <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: Math.floor(size * 0.34), fontWeight: 900, color: C.white, userSelect: "none" }}>{initials}</span>
    </div>
  );
}

// ─── Screen: Login ───────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!user.trim() || !pass.trim()) { setError("Preencha todos os campos."); return; }
    if (user === "admin" && pass === "admin") {
      setError(""); setLoading(true);
      setTimeout(() => { setLoading(false); onLogin(); }, 900);
    } else {
      setError("Usuário ou senha incorretos.");
    }
  };

  const inputBase = { width: "100%", padding: "13px 14px 13px 44px", background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 14, color: C.white, fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: "none", boxSizing: "border-box" as const };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <img src="https://images.unsplash.com/photo-1757258885972-3c111d1307f3?w=800&h=1400&fit=crop&auto=format" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(26,11,46,0.88) 0%, rgba(26,11,46,0.65) 35%, rgba(26,11,46,0.92) 70%, #1A0B2E 100%)" }} />
      </div>
      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", padding: "40px 28px 32px", justifyContent: "space-between" }}>
        <div style={{ textAlign: "center", paddingTop: 16 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, ...gB(1) }}>🎮</div>
            <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 30, fontWeight: 900, color: C.white, margin: 0 }}>Gaming<span style={{ color: C.blue, ...tB }}>Rent</span></h1>
          </div>
          <p style={{ color: C.gray, fontSize: 13, fontFamily: "'Outfit', sans-serif", margin: 0 }}>Seu game. Seu ritmo.</p>
        </div>

        <div style={{ background: "rgba(45,27,78,0.88)", backdropFilter: "blur(24px)", borderRadius: 24, padding: "28px 24px 24px", border: `1px solid ${C.border}` }}>
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 15, fontWeight: 800, color: C.white, margin: "0 0 6px", textAlign: "center" }}>Entrar na sua conta</h2>
          <p style={{ color: C.dim, fontSize: 11, textAlign: "center", marginBottom: 22, fontFamily: "'Outfit', sans-serif" }}>
            Usuário: <span style={{ color: C.blue, fontWeight: 700 }}>admin</span> &nbsp;·&nbsp; Senha: <span style={{ color: C.blue, fontWeight: 700 }}>admin</span>
          </p>

          <div style={{ marginBottom: 14 }}>
            <label style={{ color: C.gray, fontSize: 10, fontWeight: 700, fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.08em", display: "block", marginBottom: 7 }}>USUÁRIO</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.dim, display: "flex" }}><Ic.UserOutline /></span>
              <input type="text" value={user} onChange={e => { setUser(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="Digite seu usuário" style={inputBase} />
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ color: C.gray, fontSize: 10, fontWeight: 700, fontFamily: "'Orbitron', sans-serif", letterSpacing: "0.08em", display: "block", marginBottom: 7 }}>SENHA</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.dim, display: "flex" }}><Ic.Lock /></span>
              <input type={showPass ? "text" : "password"} value={pass} onChange={e => { setPass(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder="Digite sua senha" style={{ ...inputBase, paddingRight: 46 }} />
              <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: C.dim, cursor: "pointer", display: "flex", padding: 0 }}>
                <Ic.Eye show={showPass} />
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: "rgba(255,68,68,0.1)", border: `1px solid rgba(255,68,68,0.3)`, borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
              <p style={{ color: C.red, fontSize: 12, fontFamily: "'Outfit', sans-serif", margin: 0 }}>⚠️ {error}</p>
            </div>
          )}

          <button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "15px", borderRadius: 14, background: loading ? "rgba(0,240,255,0.25)" : `linear-gradient(135deg, ${C.blue} 0%, #0090B8 100%)`, border: "none", color: loading ? "rgba(0,0,0,0.5)" : C.bg, fontFamily: "'Orbitron', sans-serif", fontSize: 14, fontWeight: 900, letterSpacing: "0.06em", cursor: loading ? "default" : "pointer", ...(loading ? {} : gB(1.3)) }}>
            {loading ? "Entrando..." : "🎮 ENTRAR"}
          </button>
        </div>

        <p style={{ textAlign: "center", color: C.dim, fontSize: 12, fontFamily: "'Outfit', sans-serif", margin: 0 }}>
          Novo por aqui? <span style={{ color: C.blue, fontWeight: 600, cursor: "pointer" }}>Criar conta grátis</span>
        </p>
      </div>
    </div>
  );
}

// ─── Screen: Catalog ─────────────────────────────────────────
function CatalogScreen({ onGameSelect, onNavigate, userName }: { onGameSelect: (g: Game) => void; onNavigate: (s: Screen) => void; userName: string }) {
  const [tab, setTab] = useState("PS5");
  const [query, setQuery] = useState("");

  const isSearching = query.trim().length > 0;
  const results = isSearching
    ? GAMES.filter(g =>
        g.title.toLowerCase().includes(query.toLowerCase()) ||
        g.genre.toLowerCase().includes(query.toLowerCase()) ||
        g.platform.toLowerCase().includes(query.toLowerCase())
      )
    : GAMES.filter(g => g.platform === tab);

  const firstName = userName.trim().split(/\s+/)[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "'Outfit', sans-serif", background: C.bg, color: C.white }}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: "auto" }} className="scroll-hide">
        <div style={{ padding: "12px 20px 0" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <p style={{ color: C.gray, fontSize: 11, marginBottom: 2 }}>Olá, {firstName} 👾</p>
              <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 22, fontWeight: 900, letterSpacing: "-0.3px", margin: 0 }}>Gaming<span style={{ color: C.blue, ...tB }}>Rent</span></h1>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button style={{ color: C.gray, background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}><Ic.Bell /></button>
              <div onClick={() => onNavigate("profile")} style={{ cursor: "pointer" }}>
                <AvatarCircle name={userName} size={38} />
              </div>
            </div>
          </div>

          {/* Search */}
          <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, background: C.card, borderRadius: 14, padding: "10px 14px", border: `1px solid ${isSearching ? C.blue + "55" : C.border}`, transition: "border-color 0.2s" }}>
              <span style={{ color: isSearching ? C.blue : C.dim, display: "flex", flexShrink: 0 }}><Ic.Search /></span>
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar jogos, plataformas..."
                style={{ background: "none", border: "none", outline: "none", color: C.white, fontSize: 13, flex: 1, fontFamily: "'Outfit', sans-serif" }}
              />
              {isSearching && (
                <button onClick={() => setQuery("")} style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", display: "flex", padding: 0 }}>
                  <Ic.X />
                </button>
              )}
            </div>
            <button style={{ width: 46, height: 46, borderRadius: 14, background: C.blue, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.bg, flexShrink: 0, ...gB(1) }}>
              <Ic.Filter />
            </button>
          </div>
        </div>

        {isSearching ? (
          /* ─ Search results ─ */
          <div style={{ padding: "0 20px 20px" }}>
            <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 700, color: C.gray, letterSpacing: "0.06em", marginBottom: 16 }}>
              {results.length} resultado{results.length !== 1 ? "s" : ""} para{" "}
              <span style={{ color: C.blue }}>"{query}"</span>
            </p>
            {results.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <p style={{ fontSize: 32, marginBottom: 12 }}>🔍</p>
                <p style={{ color: C.gray, fontSize: 14 }}>Nenhum jogo encontrado.</p>
                <p style={{ color: C.dim, fontSize: 12, marginTop: 4 }}>Tente outro nome, gênero ou plataforma.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {results.map(g => <GameCard key={g.id} game={g} onSelect={onGameSelect} />)}
              </div>
            )}
          </div>
        ) : (
          /* ─ Normal catalog ─ */
          <>
            {/* Featured banner */}
            <div style={{ padding: "0 20px", marginBottom: 22 }}>
              <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 700, color: C.white, marginBottom: 12, letterSpacing: "0.07em" }}>🔥 DESTAQUE DA SEMANA</p>
              <div onClick={() => onGameSelect(MW2)} style={{ height: 164, borderRadius: 16, overflow: "hidden", position: "relative", background: C.surface, cursor: "pointer", border: `1px solid ${C.border}` }}>
                <img src={MW2.coverWide} alt={MW2.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,11,46,0.96) 0%, rgba(26,11,46,0.1) 55%, transparent 100%)" }} />
                <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6 }}>
                  <Pill color={C.green} size="sm">DESTAQUE</Pill>
                  <Pill color={C.blue} size="sm">PS5</Pill>
                </div>
                <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
                  <p style={{ color: C.blue, fontSize: 9, fontWeight: 700, marginBottom: 3 }}>Infinity Ward · {MW2.year} &nbsp;·&nbsp; <span style={{ color: "#FFD700" }}>★ {MW2.metacritic}/100 Metacritic</span></p>
                  <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 900, color: C.white, marginBottom: 3 }}>{MW2.title}</p>
                  <p style={{ color: C.gray, fontSize: 10 }}>A partir de <span style={{ color: C.blue, fontWeight: 700 }}>R$ {MW2.ppd.toFixed(2)}/dia</span></p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ padding: "0 20px", marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 8 }}>
                {["PS5", "Xbox", "Switch"].map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "9px 0", borderRadius: 12, border: `1.5px solid ${tab === t ? C.blue : C.border}`, background: tab === t ? "rgba(0,240,255,0.1)" : C.card, color: tab === t ? C.blue : C.dim, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif", ...(tab === t ? gB(0.6) : {}) }}>{t}</button>
                ))}
              </div>
            </div>

            {/* Game grid */}
            <div style={{ padding: "0 20px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {results.map(g => <GameCard key={g.id} game={g} onSelect={onGameSelect} />)}
            </div>
          </>
        )}
      </div>
      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}

function GameCard({ game, onSelect }: { game: Game; onSelect: (g: Game) => void }) {
  return (
    <div onClick={() => onSelect(game)} style={{ background: C.card, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}`, cursor: "pointer" }}>
      <div style={{ position: "relative", height: 128, background: C.surface }}>
        <img src={game.cover} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(45,27,78,0.7) 100%)" }} />
        <div style={{ position: "absolute", top: 8, right: 8 }}>
          <Pill color={game.id === 0 ? C.green : C.blue} size="sm">{game.id === 0 ? "🔥 TOP" : game.platform}</Pill>
        </div>
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, fontWeight: 800, color: C.white, lineHeight: 1.3, marginBottom: 3, overflow: "hidden", height: 27 }}>{game.title}</p>
        <p style={{ fontSize: 9, color: C.gray, marginBottom: 8 }}>{game.genre}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 12, fontWeight: 900, color: C.blue, ...tB, lineHeight: 1 }}>R${game.ppd.toFixed(2)}</p>
            <p style={{ fontSize: 8, color: C.dim, marginTop: 1 }}>/dia</p>
          </div>
          <button onClick={e => { e.stopPropagation(); onSelect(game); }} style={{ padding: "5px 9px", borderRadius: 8, background: "rgba(0,240,255,0.12)", border: `1px solid ${C.blue}35`, color: C.blue, fontSize: 9, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
            Alugar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Detail ──────────────────────────────────────────
function DetailScreen({ game, onRent, onBack, period, setPeriod }: { game: Game; onRent: () => void; onBack: () => void; period: 7 | 15 | 30 | "sub"; setPeriod: (p: 7 | 15 | 30 | "sub") => void }) {
  const [wish, setWish] = useState(false);
  const price = period === "sub" ? 49.9 : game.ppd * (period as number);
  const label = period === "sub" ? "Assinatura Mensal" : `${period} dias`;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "'Outfit', sans-serif", background: C.bg, color: C.white }}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: "auto" }} className="scroll-hide">
        <div style={{ position: "relative", height: 280, background: C.surface, flexShrink: 0 }}>
          <img src={game.cover} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 30%, rgba(26,11,46,0.65) 68%, #1A0B2E 100%)" }} />
          <button onClick={onBack} style={{ position: "absolute", top: 8, left: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.white }}><Ic.Back /></button>
          <button onClick={() => setWish(!wish)} style={{ position: "absolute", top: 8, right: 16, width: 36, height: 36, borderRadius: "50%", background: wish ? "rgba(255,77,109,0.2)" : "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", border: `1px solid ${wish ? "#FF4D6D55" : "rgba(255,255,255,0.15)"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Ic.Heart on={wish} /></button>
        </div>

        <div style={{ padding: "0 20px 28px", marginTop: -10 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
            <Pill color={C.blue}>{game.platform}</Pill>
            <Pill color={C.green}>{game.genre}</Pill>
            <Pill color={C.purple}>{game.rating}</Pill>
            {game.year && <Pill color={C.dim}>{game.year}</Pill>}
          </div>
          <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 18, fontWeight: 900, lineHeight: 1.2, margin: "0 0 8px" }}>{game.title}</h1>
          {game.developer && <p style={{ color: C.gray, fontSize: 11, marginBottom: 10 }}>{game.developer} · {game.publisher}{game.metacritic && <span style={{ color: "#FFD700", marginLeft: 10 }}>★ Metacritic {game.metacritic}/100</span>}</p>}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Stars rating={game.stars} />
            <span style={{ color: C.blue, fontSize: 12, fontWeight: 700 }}>{game.stars}</span>
            <span style={{ color: C.dim, fontSize: 11 }}>({game.reviews.toLocaleString()} avaliações)</span>
          </div>
          <p style={{ color: C.gray, fontSize: 12, lineHeight: 1.75, marginBottom: 20 }}>{game.synopsis ?? "Uma experiência épica com gráficos de última geração e jogabilidade visceral que redefine o gênero."}</p>

          <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 700, color: C.white, letterSpacing: "0.08em", marginBottom: 12 }}>PERÍODO DE ALUGUEL</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            {([7, 15, 30] as const).map(d => (
              <button key={d} onClick={() => setPeriod(d)} style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: `1.5px solid ${period === d ? C.blue : C.border}`, background: period === d ? "rgba(0,240,255,0.1)" : C.card, color: period === d ? C.blue : C.dim, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif", ...(period === d ? gB(0.55) : {}) }}>{d} dias</button>
            ))}
          </div>
          <button onClick={() => setPeriod("sub")} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${period === "sub" ? C.green : C.borderG}`, background: period === "sub" ? "rgba(57,255,20,0.08)" : C.card, color: period === "sub" ? C.green : C.gray, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "'Outfit', sans-serif", marginBottom: 18, ...(period === "sub" ? gG(0.55) : {}) }}>
            <Ic.Card /> Assinatura Mensal — Acesso Ilimitado
          </button>

          <div style={{ padding: "14px 16px", background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: C.dim, fontSize: 11, marginBottom: 5 }}>Total · {label}</p>
              <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 27, fontWeight: 900, color: C.blue, margin: 0, ...tB }}>R$ {price.toFixed(2)}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: C.dim, fontSize: 10, marginBottom: 6 }}>R$ {game.ppd.toFixed(2)}/dia</p>
              <span style={{ color: C.green, fontSize: 11, fontWeight: 600 }}>✓ Entrega grátis</span>
            </div>
          </div>

          <button onClick={onRent} style={{ width: "100%", padding: "16px", borderRadius: 16, background: `linear-gradient(135deg, ${C.blue} 0%, #0090B8 100%)`, border: "none", color: C.bg, fontFamily: "'Orbitron', sans-serif", fontSize: 14, fontWeight: 900, letterSpacing: "0.06em", cursor: "pointer", ...gB(1.5) }}>
            🎮 ALUGAR AGORA
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Rental card (reusable) ──────────────────────────────────
function RentalCard({ rental }: { rental: Rental }) {
  const rem = rental.daysTotal - rental.daysUsed;
  const pct = Math.min((rental.daysUsed / rental.daysTotal) * 100, 100);
  const periodLabel = rental.period === "sub" ? "Assinatura Mensal" : `${rental.period} dias`;

  return (
    <div style={{ background: C.card, borderRadius: 20, border: `1px solid rgba(0,240,255,0.22)`, overflow: "hidden", ...gB(0.25) }}>
      <div style={{ display: "flex", gap: 14, padding: "16px 16px 0" }}>
        <div style={{ width: 80, height: 110, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
          <img src={rental.game.cover} alt={rental.game.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ flex: 1, paddingTop: 2 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Pill color={C.blue} size="sm">{rental.game.platform}</Pill>
            <Pill color={C.green} size="sm">{periodLabel}</Pill>
          </div>
          <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 900, color: C.white, marginTop: 7, marginBottom: 4, lineHeight: 1.2 }}>{rental.game.title}</h2>
          <p style={{ color: C.gray, fontSize: 11, marginBottom: 6 }}>{rental.game.genre}</p>
          <p style={{ color: C.dim, fontSize: 10, marginBottom: 2 }}>📅 Início: {rental.startDate}</p>
          <p style={{ color: C.dim, fontSize: 10 }}>📦 Devolução: {rental.endDate}</p>
        </div>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: C.gray, fontSize: 11 }}>Dia {rental.daysUsed} de {rental.daysTotal}</span>
          <span style={{ fontSize: 11, fontWeight: 700 }}>
            <span style={{ color: C.green, ...tG }}>{rem}</span>
            <span style={{ color: C.gray }}> dias restantes</span>
          </span>
        </div>
        <div style={{ height: 8, background: C.surface, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: `${Math.max(pct, 2)}%`, height: "100%", background: `linear-gradient(to right, ${C.blue}, ${C.green})`, borderRadius: 4, boxShadow: "0 0 10px rgba(0,240,255,0.7)" }} />
        </div>
        <p style={{ fontSize: 10, color: C.dim, marginTop: 7 }}>⏰ Vence em {rental.endDate}</p>
      </div>
      <div style={{ display: "flex", borderTop: `1px solid ${C.border}` }}>
        <button style={{ flex: 1, padding: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "none", border: "none", borderRight: `1px solid ${C.border}`, color: C.blue, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
          <Ic.Refresh /> Renovar Prazo
        </button>
        <button style={{ flex: 1, padding: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "none", border: "none", color: "#FF6B6B", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
          <Ic.Box /> Solicitar Devolução
        </button>
      </div>
    </div>
  );
}

// ─── Screen: Rentals ─────────────────────────────────────────
function RentalsScreen({ onNavigate, rentals, userName }: { onNavigate: (s: Screen) => void; rentals: Rental[]; userName: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "'Outfit', sans-serif", background: C.bg, color: C.white }}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: "auto" }} className="scroll-hide">
        <div style={{ padding: "12px 20px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ color: C.gray, fontSize: 11, marginBottom: 2 }}>{userName}</p>
            <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 20, fontWeight: 900, margin: 0 }}>Meus <span style={{ color: C.blue, ...tB }}>Aluguéis</span></h1>
          </div>
          <div onClick={() => onNavigate("profile")} style={{ cursor: "pointer" }}>
            <AvatarCircle name={userName} size={38} />
          </div>
        </div>

        {/* Active rentals */}
        <div style={{ padding: "0 20px" }}>
          {rentals.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", background: C.card, borderRadius: 20, border: `1px solid ${C.border}`, marginBottom: 24 }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>🎮</p>
              <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 6 }}>Nenhum aluguel ativo</p>
              <p style={{ color: C.gray, fontSize: 12, marginBottom: 20 }}>Explore o catálogo e alugue seu próximo jogo!</p>
              <button onClick={() => onNavigate("catalog")} style={{ padding: "11px 24px", borderRadius: 12, background: `linear-gradient(135deg, ${C.blue}, #0090B8)`, border: "none", color: C.bg, fontFamily: "'Orbitron', sans-serif", fontSize: 12, fontWeight: 900, cursor: "pointer", ...gB(1) }}>
                Ver Catálogo
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, ...gG(1.1) }} />
                <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, fontWeight: 700, color: C.green, letterSpacing: "0.1em", ...tG }}>
                  {rentals.length} LOCAÇ{rentals.length === 1 ? "ÃO ATIVA" : "ÕES ATIVAS"}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
                {rentals.map(r => <RentalCard key={r.id} rental={r} />)}
              </div>
            </>
          )}
        </div>

        {/* History */}
        <div style={{ padding: "0 20px" }}>
          <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 700, color: C.white, letterSpacing: "0.08em", marginBottom: 14 }}>HISTÓRICO DE LOCAÇÕES</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MOCK_HISTORY.map((h, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", background: C.card, borderRadius: 14, border: `1px solid ${C.border}` }}>
                <div style={{ width: 46, height: 58, borderRadius: 9, overflow: "hidden", flexShrink: 0 }}>
                  <img src={h.img} alt={h.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, fontWeight: 800, color: C.white, marginBottom: 2, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{h.title}</p>
                  <p style={{ fontSize: 10, color: C.gray, marginBottom: 2 }}>{h.platform} · {h.days} dias</p>
                  <p style={{ fontSize: 9, color: C.dim }}>{h.dates}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 800, color: C.blue, marginBottom: 5 }}>R${h.cost.toFixed(2)}</p>
                  <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 6, background: "rgba(57,255,20,0.1)", color: C.green, border: `1px solid ${C.green}30`, fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}>Devolvido</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ height: 20 }} />
        </div>
      </div>
      <BottomNav active="rentals" onNavigate={onNavigate} />
    </div>
  );
}

// ─── Screen: Profile ─────────────────────────────────────────
function ProfileScreen({ userName, onNameChange, onNavigate, rentals }: { userName: string; onNameChange: (n: string) => void; onNavigate: (s: Screen) => void; rentals: Rental[] }) {
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const totalDays = rentals.reduce((s, r) => s + r.daysTotal, 0);

  const save = () => {
    const trimmed = tempName.trim();
    if (trimmed) onNameChange(trimmed);
    setEditing(false);
  };

  const settingsItems = ["Notificações", "Método de Pagamento", "Endereço de Entrega", "Histórico de Compras", "Suporte"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "'Outfit', sans-serif", background: C.bg, color: C.white }}>
      <StatusBar />
      <div style={{ flex: 1, overflowY: "auto" }} className="scroll-hide">

        {/* Profile header */}
        <div style={{ textAlign: "center", padding: "20px 24px 0" }}>
          {/* Large blank avatar */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <AvatarCircle name={userName} size={84} />
          </div>

          {/* Editable name */}
          {editing ? (
            <div style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center", marginBottom: 6 }}>
              <input
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
                autoFocus
                style={{ background: C.card, border: `1.5px solid ${C.blue}`, borderRadius: 10, color: C.white, fontSize: 16, fontWeight: 700, fontFamily: "'Orbitron', sans-serif", padding: "8px 12px", outline: "none", textAlign: "center", width: 200 }}
              />
              <button onClick={save} style={{ width: 34, height: 34, borderRadius: 10, background: `rgba(57,255,20,0.15)`, border: `1px solid ${C.green}`, color: C.green, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Ic.CheckSm />
              </button>
              <button onClick={() => setEditing(false)} style={{ width: 34, height: 34, borderRadius: 10, background: `rgba(255,68,68,0.1)`, border: `1px solid rgba(255,68,68,0.3)`, color: C.red, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Ic.X />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
              <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 18, fontWeight: 900, color: C.white, margin: 0 }}>{userName}</h2>
              <button onClick={() => { setTempName(userName); setEditing(true); }} style={{ width: 30, height: 30, borderRadius: 8, background: `rgba(0,240,255,0.1)`, border: `1px solid ${C.border}`, color: C.blue, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Ic.Edit />
              </button>
            </div>
          )}

          <p style={{ color: C.dim, fontSize: 12, margin: "0 0 24px" }}>admin · Membro desde Jan 2025</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, margin: "0 20px 24px" }}>
          {[
            { label: "Aluguéis", value: rentals.length },
            { label: "Dias Totais", value: totalDays },
            { label: "Favoritos", value: 3 },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: C.card, borderRadius: 14, padding: "16px 8px", textAlign: "center", border: `1px solid ${C.border}` }}>
              <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 22, fontWeight: 900, color: C.blue, margin: "0 0 4px", ...tB }}>{value}</p>
              <p style={{ color: C.gray, fontSize: 10, margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div style={{ margin: "0 20px 24px", background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <p style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, fontWeight: 700, color: C.dim, letterSpacing: "0.1em", padding: "14px 16px 8px" }}>CONFIGURAÇÕES</p>
          {settingsItems.map((item, i) => (
            <div key={item} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderTop: i === 0 ? `1px solid ${C.border}` : `1px solid ${C.border}` }}>
              <span style={{ color: C.white, fontSize: 13 }}>{item}</span>
              <span style={{ color: C.dim }}><Ic.ChevronRight /></span>
            </div>
          ))}
        </div>

        {/* Logout */}
        <div style={{ margin: "0 20px 20px" }}>
          <button onClick={() => onNavigate("login")} style={{ width: "100%", padding: "14px", borderRadius: 14, background: "rgba(255,68,68,0.08)", border: `1px solid rgba(255,68,68,0.25)`, color: C.red, fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Ic.LogOut /> Sair da Conta
          </button>
        </div>
      </div>
      <BottomNav active="profile" onNavigate={onNavigate} />
    </div>
  );
}

// ─── Success popup ───────────────────────────────────────────
function SuccessPopup({ game, period, onClose, onViewRentals }: { game: Game; period: 7 | 15 | 30 | "sub"; onClose: () => void; onViewRentals: () => void }) {
  const price = period === "sub" ? 49.9 : game.ppd * (period as number);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.78)", backdropFilter: "blur(12px)", padding: "0 24px" }}>
      <div style={{ background: C.card, borderRadius: 24, padding: "32px 26px 26px", border: `1px solid rgba(57,255,20,0.38)`, width: "100%", textAlign: "center", ...gG(0.8) }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(57,255,20,0.1)", border: `2px solid ${C.green}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", ...gG(1.2) }}>
          <div style={{ color: C.green }}><Ic.Check /></div>
        </div>
        <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 18, fontWeight: 900, color: C.white, margin: "0 0 8px" }}>Aluguel Confirmado!</h2>
        <p style={{ color: C.gray, fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
          <span style={{ color: C.green, fontWeight: 700 }}>{game.title}</span>{" "}foi alugado com sucesso! O jogo será enviado em até 24h.
        </p>
        <div style={{ background: C.surface, borderRadius: 14, padding: "14px 16px", marginBottom: 22, textAlign: "left" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ color: C.gray, fontSize: 12 }}>Plataforma</span>
            <span style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>{game.platform}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ color: C.gray, fontSize: 12 }}>Período</span>
            <span style={{ color: C.white, fontSize: 12, fontWeight: 600 }}>{period === "sub" ? "Mensal (Ilimitado)" : `${period} dias`}</span>
          </div>
          <div style={{ height: 1, background: C.border, marginBottom: 10 }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: C.gray, fontSize: 12, fontWeight: 700 }}>Total pago</span>
            <span style={{ fontFamily: "'Orbitron', sans-serif", color: C.blue, fontSize: 16, fontWeight: 900, ...tB }}>R$ {price.toFixed(2)}</span>
          </div>
        </div>
        <button onClick={onViewRentals} style={{ width: "100%", padding: "14px", borderRadius: 14, background: `linear-gradient(135deg, ${C.green} 0%, #28CC00 100%)`, border: "none", color: "#0A0A0A", fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 900, cursor: "pointer", marginBottom: 12, ...gG(1.3) }}>
          🎮 Ver Meus Aluguéis
        </button>
        <button onClick={onClose} style={{ background: "none", border: "none", color: C.dim, fontSize: 13, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
          Continuar Navegando
        </button>
      </div>
    </div>
  );
}

// ─── App root ────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [selectedGame, setSelectedGame] = useState<Game>(MW2);
  const [period, setPeriod] = useState<7 | 15 | 30 | "sub">(15);
  const [showPopup, setShowPopup] = useState(false);
  const [userName, setUserName] = useState("Carlos Pereira");
  const [rentals, setRentals] = useState<Rental[]>([]);

  const handleGameSelect = (g: Game) => { setSelectedGame(g); setScreen("detail"); };

  const handleRent = () => {
    const daysTotal = period === "sub" ? 30 : (period as number);
    const start = new Date();
    const end = new Date(start);
    end.setDate(start.getDate() + daysTotal);
    const rental: Rental = {
      id: Date.now(), game: selectedGame, period,
      daysTotal, daysUsed: 1,
      startDate: fmtShort(start),
      endDate: fmtDate(end),
    };
    setRentals(prev => [rental, ...prev]);
    setShowPopup(true);
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "radial-gradient(ellipse at 50% 30%, #2E1860 0%, #1A0B2E 50%, #0B0619 100%)", display: "flex", alignItems: "stretch", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 430, height: "100%", background: C.bg, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        {screen === "login" && <LoginScreen onLogin={() => setScreen("catalog")} />}
        {screen === "catalog" && <CatalogScreen onGameSelect={handleGameSelect} onNavigate={setScreen} userName={userName} />}
        {screen === "detail" && <DetailScreen game={selectedGame} onRent={handleRent} onBack={() => setScreen("catalog")} period={period} setPeriod={setPeriod} />}
        {screen === "rentals" && <RentalsScreen onNavigate={setScreen} rentals={rentals} userName={userName} />}
        {screen === "profile" && <ProfileScreen userName={userName} onNameChange={setUserName} onNavigate={setScreen} rentals={rentals} />}
        {showPopup && <SuccessPopup game={selectedGame} period={period} onClose={() => setShowPopup(false)} onViewRentals={() => { setShowPopup(false); setScreen("rentals"); }} />}
      </div>
    </div>
  );
}
