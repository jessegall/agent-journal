/* @code-commandments-generated */
import { reactive as Ur, computed as _, openBlock as b, createElementBlock as w, normalizeStyle as ae, Fragment as I, renderList as H, mergeProps as Ro, ref as D, watch as ya, createElementVNode as A, normalizeClass as Fl, toDisplayString as $a, unref as j, createCommentVNode as P, useId as Hr, createBlock as ne, inject as Wr, onMounted as Kr, onUnmounted as Yr, withDirectives as Vr, withModifiers as Xr, createVNode as Co, Transition as qo, withCtx as Do, vShow as Zr } from "vue";
import { l as Qr, A as V, p as Jr, a as ei, f as ti, s as ni, b as ai, c as va, t as oi, B as li, r as le, d as si, e as Ft, g as ri, w as Bl, h as je, R as Tl, i as pn, j as Bt, k as ii, o as Ll, m as ee, n as ui, q as zl, u as It, v as ci, x as Ct, y as mn, z as qt, C as di, D as Il, E as pt, L as Rl, F as Cl, G as fi, H as pi, I as ql, J as me, K as ba, M as Xe, N as hi, O as mi, P as gi, _ as Ge, Q as xa, S as Po, T as yi, U as vi, V as de, W as _a, X as bi, Y as xi, Z as wi, $ as ki, a0 as Et, a1 as $i, a2 as _i, a3 as Mi, a4 as Si, a5 as Mt, a6 as Ai, a7 as Oi, a8 as Ei, a9 as Ni, aa as Fi, ab as Bi, ac as Ti, ad as jo, ae as Go, af as Uo, ag as Ho, ah as Li, ai as zi, aj as Ii, ak as Ri, al as Ci, am as qi, an as Di, ao as Pi, ap as ji, aq as Gi, ar as Ui, as as Hi, at as Wi, au as Ki, av as rn, aw as la, ax as Yi, ay as Vi, az as Xi, aA as Wo, aB as Zi, aC as Qi, aD as Ji, aE as eu, aF as tu, aG as sa, aH as nu, aI as au, aJ as Ko, aK as Yo, aL as Vo, aM as ou, aN as lu, aO as su, aP as ru, aQ as iu, aR as St, aS as uu, aT as cu, aU as du, aV as fu, aW as pu, aX as Ke, aY as Z, aZ as Xo, a_ as Zo, a$ as hu, b0 as mu, b1 as gu, b2 as yu, b3 as vu, b4 as bu, b5 as xu, b6 as dt, b7 as ft, b8 as wu, b9 as Qo, ba as ra, bb as Jo, bc as At, bd as ku, be as $u, bf as _u, bg as el, bh as Mu, bi as Su, bj as Au, bk as tl, bl as Ou, bm as Eu, bn as Nu, bo as nl, bp as Fu, bq as Bu, br as Tu, bs as Lu, bt as zu, bu as al, bv as Iu, bw as Ru, bx as Cu, by as qu, bz as Du, bA as Pu, bB as ol, bC as ju, bD as Gu, bE as Uu, bF as Hu, bG as Wu, bH as Ku, bI as Yu, bJ as Vu, bK as ia, bL as Xu, bM as Zu, bN as Qu, bO as Ju, bP as ec, bQ as tc, bR as nc, bS as ac, bT as oc, bU as lc, bV as sc, bW as ll, bX as rc, bY as ic, bZ as uc, b_ as cc, b$ as dc, c0 as fc, c1 as pc, c2 as hc, c3 as mc, c4 as gc, c5 as yc } from "./index-CE7vMnEk.js";
const Dl = { height: 5.4, middle: 2.4 };
function Rh(e, t, a, r) {
  if (!e) return { facing: t, speed: 0, settled: !0 };
  const s = Math.max(0, Math.min(a, 0.05)), i = ((e.facing - t + 180) % 360 + 360) % 360 - 180, c = e.facing - i, u = 8 / r, p = e.speed + u * i, m = Math.exp(-u * s), f = c + (i + p * s) * m, h = Math.min(Math.max(f - e.facing, -720 * s), 720 * s), k = Math.abs(f - e.facing) > 720 * s ? Math.sign(h) * 720 : (e.speed - u * p * s) * m, E = e.facing + h, x = Math.abs(E - c) < 1e-3 && Math.abs(k) < 0.05;
  return { facing: x ? c : E, speed: x ? 0 : k, settled: x };
}
const vc = { length: 1.36, planted: 0.6, clearance: 0.16 }, bc = { length: 2.16, planted: 0.42, clearance: 0.3 }, xc = (e, t, a = !1) => t > 0 ? e * Dl.height / (t * (a ? bc : vc).length) : 0;
function Ch(e, { length: t, planted: a, clearance: r }) {
  const s = (e % 1 + 1) % 1, i = t * a;
  if (s < a) return [-i / 2 + t * s, 0];
  const c = (s - a) / (1 - a);
  return [i / 2 - i * (3 * c * c - 2 * c * c * c) + t * (1 - a) * c * (1 - c) * (1 - 2 * c), r * Math.sin(Math.PI * c) ** 2];
}
function wc(e, t, a) {
  if (t <= 0) return 1;
  const r = Math.min(Math.max(e, 0), t), s = Math.min(Math.max(a, 0), t / 2);
  if (!s) return r / t;
  const i = t - s, c = (u) => u * u * u * (1 - u / 2);
  return r < s ? s * c(r / s) / i : r > t - s ? 1 - s * c((t - r) / s) / i : (r - s / 2) / i;
}
const Ma = 5, Dt = (e, t) => t >= e.left && t <= e.right, kc = 8, $c = (e, t, a, r = Ma) => e.filter((s) => Dt(s, t) && Math.abs(s.top - a) <= r).sort((s, i) => Math.abs(s.top - a) - Math.abs(i.top - a))[0] ?? null, _c = (e, t, a, r = Ma) => e.filter((s) => Dt(s, t) && s.top >= a - r).sort((s, i) => s.top - i.top)[0] ?? null, Mc = 5, Sc = 3, wa = ["dock", "compose", "foot"], Ac = 30;
function Oc(e, t, a, r) {
  const s = e.find((i) => i.id === t);
  return !s || wa.includes(s.kind) && s.top > r + Ma ? { falls: !0, dx: 0, dy: 0 } : wa.includes(s.kind) && s.top < r - Ac ? { falls: !1, dx: 0, dy: 0 } : { falls: !1, dx: Math.min(Math.max(a, s.left), s.right) - a, dy: s.top - r };
}
const Pl = (e) => e.filter((t) => wa.includes(t.kind));
function jl(e, t) {
  const a = /^cubic-bezier\(([^)]*)\)$/.exec(e ?? "");
  if (!a || t <= 0 || t >= 1) return Math.min(1, Math.max(0, t));
  const [r, s, i, c] = a[1].split(",").map(Number), u = (f, h, k) => 3 * (1 - f) * (1 - f) * f * h + 3 * (1 - f) * f * f * k + f * f * f;
  let [p, m] = [0, 1];
  for (let f = 0; f < 30; f++) {
    const h = (p + m) / 2;
    u(h, r, i) < t ? p = h : m = h;
  }
  return u((p + m) / 2, s, c);
}
const Ec = (e, t, a) => a - t >= e.lead + e.ms;
function ua(e, t, a, r = !1) {
  if (e.pogo && !r) return Nc(e, t, a);
  const s = r && e.hopping ? 1 : e.ramp ? wc(a - e.lead, e.ms, e.ramp) : jl(e.easing, e.ms > 0 ? (a - e.lead) / e.ms : 1);
  return { x: t.x + (e.x - t.x) * s, y: t.y + (e.y - t.y) * s };
}
function Nc(e, t, a) {
  const { bounces: r, spring: s, over: i } = V.pogo, c = Math.min(Math.max(a / e.ms, 0), 1), u = (E) => Math.min(Math.max((c - E[0]) / (E[1] - E[0]), 0), 1);
  if (c < s[0]) return { x: t.x, y: t.y - Jr(ei(), u(r)).height * e.size };
  const p = i * e.size, m = Math.max(t.y - e.y, 0) + p, f = e.y - p, h = Fc(e, t), k = t.x + (e.x - t.x) * u([s[0], h[1]]);
  return c < s[1] ? { x: k, y: f + m * (1 - u(s)) ** 2 } : { x: k, y: f + p * u(h) ** 2 };
}
function Fc(e, t) {
  const { spring: a, over: r } = V.pogo, s = r * e.size, i = Math.max(t.y - e.y, 0) + s;
  return [a[1], Math.min(a[1] + (a[1] - a[0]) * Math.sqrt(s / i), 1)];
}
function Gl(e, t, a, r = !1) {
  const s = Bc(t, e);
  if (s) return { x: e.x, y: s.top, speed: 0, onto: s.id, landed: s };
  const i = Lc(e, t);
  if (i) return i;
  const c = e.onto ? t.find((m) => m.id === e.onto && Dt(m, e.x)) : null;
  if (c && c.top <= e.y) return { x: e.x, y: c.top, speed: 0, onto: c.id, landed: c };
  const u = _c(t, e.x, e.y, 0);
  if (!u) return { ...e, onto: null, landed: null };
  if (r) return { x: e.x, y: u.top, speed: 0, onto: u.id, landed: u };
  const p = ti({ y: e.y, speed: e.speed }, u.top, a, e.most);
  return { x: e.x, y: p.y, speed: p.speed, onto: u.id, landed: p.landed ? u : null };
}
const Bc = (e, t) => t.speed >= 0 ? e.find((a) => a.id === "home" && Dt(a, t.x) && a.top < t.y) ?? null : null, Tc = (e, t, a) => e.filter((r) => Dt(r, t) && r.top < a && a - r.top <= Mc).sort((r, s) => s.top - r.top)[0] ?? null;
function Lc(e, t) {
  if (e.peak === 0 || e.peak === void 0 && e.speed) return null;
  const a = Tc(t, e.x, e.y);
  return e.peak === void 0 ? a ? { ...e, peak: Sc, landed: null } : null : e.peak > 1 ? { ...e, peak: e.peak - 1, landed: null } : a ? { x: e.x, y: a.top, speed: 0, peak: 0, landed: a } : { ...e, peak: 0, landed: null };
}
function zc(e, t, a, r, s = 1 / 0) {
  const i = r.x - e.to.x, c = r.y - e.to.y;
  if (Math.hypot(i, c) <= 0.3) return { trip: e, leg: t, from: a, lost: !1 };
  const u = (e.legs.at(-1) ?? t).y, p = (h) => h.y === u ? { ...h, x: h.x + i, y: h.y + c, planned: h.planned ?? h.y } : h, m = t.y === u, f = m ? p(t) : t;
  return {
    trip: { ...e, to: r, legs: e.legs.map(p) },
    leg: f,
    from: m ? { ...a, x: a.x + i } : a,
    lost: m && f.planned - f.y > s
  };
}
function Ic(e, t, a, r) {
  const s = a.find((c) => c.id === "home"), i = s ? Math.min(e.y, s.top) : e.y;
  return { x: e.x, y: i, posture: e.posture, face: e.face, speed: 0, at: r, to: t };
}
const Rc = (e, t, a, r) => ({ x: e, y: t, posture: "stand", speed: 0, at: r, to: null, most: a, chute: !0 }), Cc = (e, t, a) => ({ x: e.x, y: e.y, posture: "stand", face: e.face, speed: t, at: a, to: null, peak: 0 }), qc = (e, t) => e.speed < 0 && e.y <= t;
function Dc(e, t, a, r = !1) {
  const s = Gl(e, Pl(t), (a - e.at) / 1e3, r);
  if (!s.landed) return { airborne: { ...e, ...s, at: a }, landed: null };
  const i = Qr(e.posture, s.landed.kind);
  return { airborne: null, landed: { spot: { x: s.x, y: s.landed.top, posture: i, face: e.face, view: null, on: s.landed.element ?? null }, to: e.to, standing: i === "stand" } };
}
const Pc = "cubic-bezier(0.42, 0, 0.58, 1)";
function jc(e, t, a) {
  const r = Math.min(1, Math.max(0, (t - e.began) / a)), s = jl(Pc, r);
  return {
    at: { x: e.from.x + (e.to.x - e.from.x) * s, y: e.from.y + (e.to.y - e.from.y) * s },
    done: r >= 1
  };
}
const ca = (e, t, a) => e.map((r) => ({ ...r, x: r.x + t, y: r.y + a }));
function Gc(e) {
  const t = Ur({
    place: { x: 0, y: 0, posture: "stand", view: null, on: null },
    at: { x: 0, y: 0 },
    trip: null,
    leg: { x: 0, y: 0, ms: 0, lead: 0, easing: "linear" },
    walk: { from: { x: 0, y: 0 }, began: 0, on: null },
    footing: null,
    airborne: null,
    landing: !1,
    arriving: !1,
    leaving: !1,
    here: !1,
    slide: null,
    rested: "stand",
    way: 0
  });
  let a = 0;
  const r = () => {
    a = requestAnimationFrame(r), t.here && !document.hidden && e();
  };
  function s() {
    cancelAnimationFrame(a), ni();
  }
  function i() {
    s(), ai(), a = requestAnimationFrame(r);
  }
  return { body: t, start: i, stop: s };
}
const Uc = "voice-figures", Ul = (e) => new URL(e).pathname.split("/").pop(), Hc = (e, t) => Ul(e).startsWith(`${t}.`);
async function Wc(e) {
  const t = await va.voiceFigures(), a = va.voiceFigureUrl(t[e]);
  if (typeof caches > "u") return (await sl(a, e)).arrayBuffer();
  const r = await caches.open(Uc), s = await r.match(a);
  if (s) return s.arrayBuffer();
  const i = await sl(a, e);
  await r.put(a, i.clone());
  const c = (await r.keys()).filter((u) => Hc(u.url, e) && Ul(u.url) !== t[e]);
  return await Promise.all(c.map((u) => r.delete(u))), i.arrayBuffer();
}
async function sl(e, t) {
  const a = await oi.raw(e);
  if (!a.ok) throw new Error(`The ${t} figure did not load: ${a.status}`);
  return a;
}
async function Kc(e) {
  const [{ figureOf: t }, a] = await Promise.all([import("./figure-BynTMELK.js"), Wc(e)]);
  return t(a, e, va.figureDecoderUrl());
}
const Yc = { most: 2.5 }, Ze = ({ size: e, below: t }) => (1 - t - li.top) * e, Hl = (e) => Yc.most * Ze(e), Vc = { share: 0.5 }, Xc = (e, t) => e >= Vc.share * t;
function Zc(e, t, a, r) {
  const s = [];
  let i = e;
  for (; i.y - t > r; ) {
    const c = a.filter((u) => u.y < i.y && u.y > t && i.y - u.y <= r);
    if (!c.length) return null;
    i = c.reduce((u, p) => p.y < u.y ? p : u), s.push(i);
  }
  return s;
}
const Qe = "stand", Ve = "hang", Qc = [8, 20];
function Jc(e, t = {}) {
  const a = pt({ moment: "roam", ...t }, e);
  return { where: a.name, stay: Wl(a.stay, e) };
}
const Wl = ([e, t], a) => e + a() * (t - e), Sa = (e, t) => e.left - t.left > t.right - e.right ? "left" : "right", Aa = (e, t, a) => e.top - fi(a) >= t.top && e.top <= t.bottom - 8, ed = { l: "left", r: "right" }, td = 0.3, nd = 180;
function ad(e, t, a, r, { memory: s = null, now: i = 0, free: c = !1 } = {}) {
  const u = e.floors.filter((x) => x.kind === "bubble" && Aa(x, e.view, t)), p = { moment: "perch", hands: a.length > 0, free: c, memory: s, now: i }, m = ql(p).some((x) => x.name === Ve), f = pt({ moment: "perch", hands: m, free: c }, r).name, h = m ? f === Ve ? [Ve, Qe] : [Qe, Ve] : [Qe], E = u.reverse().flatMap((x) => h.map((F) => od(x, F, e.view, a))).find((x) => gn(x, e, t)) ?? null;
  return (E == null ? void 0 : E.kind) === Ve && mi(p, Ve, r), E;
}
function od(e, t, a, r) {
  const s = Sa(e, a);
  if (t === Qe) return { floor: e.id, kind: t, side: s, grip: "" };
  const i = r.find((c) => ed[c] === s);
  return i ? { floor: e.id, kind: t, side: s, grip: i, face: 0 } : { floor: e.id, kind: t, side: s, grip: r[0], face: nd };
}
function gn(e, t, a) {
  const r = t.floors.find((i) => i.id === e.floor);
  if (!r || !Aa(r, t.view, a)) return null;
  const s = ld(e, r, a);
  return Ct(s, a, t.floors) && mn(s, a) && !qt(s, a) ? s : null;
}
function ld(e, t, a) {
  if (e.kind === Qe)
    return { ...pi({ ...t, width: t.right - t.left }, e.side, a), on: t.element };
  const r = (e.side === "left" ? -1 : 1) * td * a.size;
  return { x: (e.side === "left" ? t.left : t.right) + r, y: t.top, face: e.face, posture: "hang", grip: e.grip, on: t.element };
}
const sd = 1.6, rd = gi.filter((e) => e.when.moment === "ledge_at").map((e) => e.along), rl = 35;
function hn(e, t, a) {
  const r = le(), s = r.floors.find((u) => u.element && u.element === a.on && Rl.has(u.kind));
  if (!s || s.right - s.left < sd * t.size) return null;
  const i = (u) => s.kind !== "compose" ? 0 : u <= 0.5 ? 360 - rl : rl;
  return [e, ...rd.filter((u) => u !== e)].map((u) => ({
    x: s.left + (s.right - s.left) * u,
    y: s.top,
    face: i(u),
    posture: "sit",
    leans: !0,
    on: s.element
  })).find((u) => Ct(u, t, r.floors) && mn(u, t) && !qt(u, t) && Cl(u, t)) ?? null;
}
const id = [0.5, 0.42, 0.58];
function ud(e, t, a = { turn: 0, leans: 0 }) {
  const r = le(), s = r.floors.find((u) => u.element && u.element === t.on && Rl.has(u.kind));
  if (!s) return null;
  const i = (u) => ({ x: s.left + (s.right - s.left) * u, y: s.top, face: a.turn, leans: a.leans, posture: "composed", view: null, on: s.element });
  return id.map(i).find((u) => Ct(u, e, r.floors) && mn(u, e) && !qt(u, e) && Cl(u, e)) ?? null;
}
function Kl(e, t, a = le()) {
  if (!e) return null;
  const { rope: r, ties: s, room: i } = V.rope_swing, c = me(), u = e.bottom + r * t.size, p = s * t.size / 2, m = [Math.max(e.left + p, c.left + i * t.size), Math.min(e.right - p, c.right - i * t.size)], f = cd(e, t, a, u, m);
  if (f === null) return null;
  const h = { x: f, y: u, posture: "sit", face: 0, swings: !0, view: null, on: e.element }, k = a.floors.find((E) => E.id === "home");
  return k && It(h, t).bottom > k.top ? null : Ct(h, t, a.floors) && !qt(h, t) ? h : null;
}
function cd(e, t, a, r, [s, i]) {
  if (s > i) return null;
  const { seat: c, clearance: u } = V.rope_swing, p = e.bottom + (It({ x: 0, y: r, posture: "sit" }, t).bottom - e.bottom) * (1 + u), m = c * t.size / 2 * (1 + u), h = a.floors.filter((F) => F.kind === "bubble" && F.bottom > e.bottom && F.top < p).map((F) => [F.left - m, F.right + m]), k = (e.left + e.right) / 2, E = (F) => !h.some(([L, G]) => F > L && F < G);
  return [k, ...h.flat()].map((F) => Math.min(Math.max(F, s), i)).filter(E).sort((F, L) => Math.abs(F - k) - Math.abs(L - k))[0] ?? null;
}
function il(e, t, a = le()) {
  if (e.posture !== "stand") return null;
  const { ball: r, clear: s, tie: i, far: c } = V.disco, u = e.y - Ze(t), p = Ze(t) + (s + r / 2) * t.size, f = a.floors.filter((k) => k.kind === "bubble" && k.bottom < e.y && k.left < e.x && k.right > e.x).filter((k) => k.bottom <= u - (s + r + i) * t.size).sort((k, E) => E.bottom - k.bottom)[0];
  return a.floors.some((k) => k.kind === "bubble" && k.element === e.on) && f && u - f.bottom <= c * Ze(t) ? { kind: "bubble", above: e.y - f.bottom, hangs: p } : null;
}
const dd = (e, t) => e.floors.filter((a) => a.kind === "bubble" && Kl(a, t, e)), ul = 20;
function ka(e, t) {
  var u;
  const a = document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!a) return null;
  if ((u = ee().element) != null && u.contains(a)) return je(null, t);
  const r = le(), s = r.floors.find((p) => p.kind === "bubble" && p.element.contains(a));
  if (!s) return null;
  const i = Sa(s, r.view);
  return [i, i === "left" ? "right" : "left"].map((p) => gn({ floor: s.id, kind: Qe, side: p, grip: "" }, r, t)).find(Boolean) ?? null;
}
function Oa(e, t, a, r) {
  const i = e.floors.filter((c) => c.kind === "bubble" && c.top < a.y).map((c) => gn({ floor: c.id, kind: Qe, side: Sa(c, e.view), grip: "" }, e, t)).filter(Boolean);
  return Zc(a, r, i, Hl(t));
}
const fd = (e, t) => t.posture === "stand" && e.some((a) => a.kind === "bubble" && a.element === t.on), Yl = (e, t, a, r) => fd(e.floors, a) && Xc(t.y - a.y, e.view.bottom - e.view.top) && ql({ moment: "climb", ...r }).some((s) => s.name === "pogo");
function pd(e, t, a, r, s, i) {
  var u;
  const c = Oa(e, t, a, r.y);
  return Yl(e, a, r, s) ? ((u = pt({ moment: "climb", footholds: !!c, ...s }, i)) == null ? void 0 : u.name) === "pogo" ? { via: [], pogo: !0 } : { via: c, pogo: !1 } : c && { via: c, pogo: !1 };
}
function Tt(e, t, a, r = {}) {
  const s = le();
  return e && (Oa(s, t, a, e.y) || Yl(s, a, e, r)) ? e : null;
}
function Vl(e, t, a, r, { tally: s = null, free: i = !1, room: c = 0, memory: u = null, moment: p = "roam" } = {}) {
  const m = dd(le(), t), { where: f, stay: h } = Jc(r, { moment: p, tally: s, free: i, room: c, swings: m.length > 0, memory: u, now: e }), k = e + h;
  if (f === "ledge") return { where: f, until: k, along: pt({ moment: "ledge_at" }, r).along };
  if (f === "bubble_ledge") return { where: f, until: k, ...hd(t, r) };
  if (f === "rope_swing") return { where: f, until: k, floor: m[Math.floor(r() * m.length)].id };
  if (f === "bubble") {
    const E = ad(le(), t, a, r, { memory: u, now: e, free: i });
    return { where: f, until: (E == null ? void 0 : E.kind) === Ve ? e + Wl(Qc, r) : k, perch: E };
  }
  if (f === "tab") {
    const E = Object.keys(Ll()).filter((x) => je(x, t));
    return { where: f, until: k, view: E[Math.floor(r() * E.length)] };
  }
  if (f === "edge") return { where: f, until: k, along: { x: r() * window.innerWidth, y: 0 } };
  if (f === "composed") {
    const { turn: E, leans: x } = pt({ moment: "composed_as" }, r);
    return { where: f, until: k, turn: E, leans: x };
  }
  return { where: f, until: k };
}
function hd(e, t) {
  var i;
  const a = pt({ moment: "ledge_at" }, t).along, r = le(), s = r.floors.filter((c) => c.kind === "bubble" && Aa(c, r.view, e) && hn(a, e, { on: c.element }));
  return { floor: ((i = s[Math.floor(t() * s.length)]) == null ? void 0 : i.id) ?? "", along: a };
}
function md(e, t, a = le()) {
  const r = a.floors.find((f) => f.element && f.element === t.on);
  if (!r) return null;
  const { wall: s, contact: i } = V.lean, c = r.top - i / Dl.height * e.size, u = ba * e.size;
  return a.floors.filter((f) => f.kind === "bubble" && f.element !== r.element && f.bottom <= r.top && f.top <= c && f.bottom >= c).flatMap((f) => [{ wall: f.left, way: 1, bubble: f }, { wall: f.right, way: -1, bubble: f }]).map(({ wall: f, way: h, bubble: k }) => ({ spot: { x: f - h * s * e.size, y: r.top, face: 0, posture: "stand", view: null, on: r.element, lean: { wall: f, way: h } }, bubble: k })).filter(({ spot: f, bubble: h }) => f.x >= r.left + u && f.x <= r.right - u && !zl(hi(f, e), h)).map(({ spot: f }) => f).filter((f) => Ct(f, e, a.floors) && mn(f, e) && !qt(f, e)).sort((f, h) => Math.abs(f.x - t.x) - Math.abs(h.x - t.x))[0] ?? null;
}
const cl = { reach: 1.1, eyes: 0.72 };
function gd(e, t, a) {
  const r = t.y - cl.eyes * Ze(a), s = (c) => Math.max(c.left - t.x, t.x - c.right, 0);
  return e.floors.filter((c) => c.kind === "bubble" && c.element !== t.on && c.top <= r && c.bottom >= r && s(c) <= cl.reach * a.size).sort((c, u) => s(c) - s(u))[0] ?? null;
}
const yd = (e, t) => e - t.left <= t.right - e ? -1 : 1, vd = 0.18;
function bd(e, t) {
  const a = me(), { edge: r } = ee(), s = je(null, e, { x: t > 0 ? a.right : a.left, y: 0 }), i = t > 0 ? r.left + r.width - ba * e.size : r.left + ba * e.size, u = (t > 0 ? a.right : a.left) - t * vd * e.size, p = t * (u - i);
  if (p < Xe.within) return { ...s, x: t > 0 ? Math.min(u, i) : Math.max(u, i) };
  const m = (F) => Math.tan(F * Math.PI / 180), f = Math.min(p / m(Xe.lean), Xe.most * Ze(e)), h = Math.min(p, f * m(Xe.steepest)), k = Xe.over * Ze(e), E = i + t * h, x = { x: i, y: r.top };
  return { ...s, x: E, y: r.top - f, ladder: { foot: x, top: { x: E + t * k * h / f, y: r.top - f - k }, way: t } };
}
const xd = (e, t) => {
  var a;
  return ((a = t == null ? void 0 : t.to) == null ? void 0 : a.ladder) ?? (e.ladder && (!(t != null && t.moves) || t.clip === "ladder_climb" || t.legs.some((r) => r.clip === "ladder_climb")) ? e.ladder : null);
};
function Rt(e, t, a) {
  var r;
  if (e.where === "bubble") {
    const s = e.perch && gn(e.perch, le(), t);
    return s ? { ...s, view: null } : null;
  }
  if (e.where === "tab") {
    const s = e.view && je(e.view, t, a);
    return s ? { ...s, view: null } : null;
  }
  return e.where === "edge" ? je(null, t, e.along) : e.where === "rummage" ? bd(t, e.way) : e.where === "mark" ? ka(e.card, t) : e.where === "ledge" ? hn(e.along, t, a) : e.where === "bubble_ledge" ? hn(e.along, t, { on: (r = le().floors.find((s) => s.id === e.floor)) == null ? void 0 : r.element }) : e.where === "composed" ? ud(t, a, e) : e.where === "lean" ? md(t, a) : e.where === "rope_swing" ? Kl(le().floors.find((s) => s.id === e.floor), t) : e.where === "seat" ? Il(t, a) ?? pn(t, a) : e.where === "aside" ? e.spot : pn(t, a);
}
function wd({ state: e, counts: t, stay: a, now: r, near: s, figure: i, hands: c, work: u = null, pile: p = null, cleared: m = { until: 0 }, random: f = Math.random, tally: h = null, memory: k = null, room: E = 0 }) {
  var G;
  const x = u && si(i, s, u);
  if (x) return { spot: Ft(x, i) ? x : null, stay: a };
  const F = Md({ state: e, counts: t, stay: a, now: r, near: s, figure: i, hands: c, random: f, tally: h, memory: k, room: E });
  if ((G = F.spot) != null && G.ladder) return { ...F, spot: Ft(F.spot, i) ? F.spot : null };
  const L = kd(_d(ri(Xl(F.spot, { state: e, now: r, near: s, figure: i, cleared: m }), p, i), i), s);
  return { ...F, spot: Ft(L, i) ? L : null };
}
const kd = (e, t) => e != null && e.on && e.on !== t.on && e.on === ee().element && ui() ? null : e;
function $d(e, t) {
  const a = Bl(t) ?? je(null, t);
  return (e == null ? void 0 : e.on) === a.on && e.posture === a.posture && Math.abs(e.x - a.x) < 2 ? null : a;
}
const _d = (e, t) => e && ee().docked && e.on === ee().element ? Bl(t) ?? e : e, dl = (e) => Bt(e) === "work";
function Xl(e, { state: t, now: a, near: r, figure: s, cleared: i }) {
  return a >= i.until || !zl(It(e, s), i.box) ? e : ci(i.box, s, r, Tl.has(t)) ?? e;
}
function Md({ state: e, counts: t, stay: a, now: r, near: s, figure: i, hands: c, random: u, tally: p, memory: m, room: f }) {
  if (Tl.has(e)) return { spot: pn(i, s), stay: a };
  const h = { memory: m, now: r, room: f }, k = Bt(e) === "type" && Sd(a, r, i, c, u, s, h);
  if (k) return k;
  const E = ii(t, Ll()), x = E && Tt(je(E, i, s), i, s, h);
  if (x) return { spot: x, stay: a };
  const F = !a.laptop && r < a.until && Tt(Rt(a, i, s), i, s, h);
  if (F) return { spot: F, stay: a };
  const L = Vl(r, i, c, u, { tally: p, free: f > 0, room: f, memory: m });
  return { spot: Tt(Rt(L, i, s), i, s, h) || pn(i, s), stay: L };
}
function Sd(e, t, a, r, s, i, c) {
  const u = e.laptop && t < e.until && Tt(Rt(e, a, i), a, i, c);
  if (u) return { spot: u, stay: e };
  const p = { ...Vl(t, a, r, s, { moment: "laptop", memory: c.memory }), laptop: !0 }, m = Tt(Rt(p, a, i), a, i, c);
  if (m) return { spot: m, stay: p };
  const f = Il(a, i);
  return f && { spot: f, stay: { ...p, where: "seat" } };
}
const Ad = { seconds: 4 }, Od = (e) => e.some((t) => t.hopping && t.clip !== "fall"), Ed = (e, t, a) => e && t === "bubble" ? { until: a + Ad.seconds } : null, Nd = (e, t, a) => a || !e || t >= e.until, fl = { least: 30, more: 30 };
function Fd(e, t, a, r, s) {
  return t ? a && (e != null && e.seated) ? e : { until: r + fl.least + s() * fl.more, seated: !0 } : e != null && e.seated ? null : e;
}
const Bd = (e, t, a, r) => !(a != null && a.seated) || r >= a.until || e.postures.includes(t) || !!e.rises, dn = 30, Td = (e, t, a) => ({ stay: { ...e, until: 0 }, cleared: { box: t, until: a + dn } }), Ld = (e) => e.where === "edge" ? e : { where: "rest", until: e.where === "rest" ? e.until : 0 }, zd = (e, t) => di(t) ? { ...e, until: 0 } : e, Id = ["width", "height"], un = 14, cn = 4, Rd = {
  __name: "StepLadder",
  props: {
    foot: { type: Object, required: !0 },
    top: { type: Object, required: !0 }
  },
  setup(e) {
    const t = e, a = _(() => ({
      left: Math.min(t.foot.x, t.top.x) - un - cn,
      top: t.top.y - cn,
      right: Math.max(t.foot.x, t.top.x) + un + cn,
      bottom: t.foot.y + cn
    })), r = _(() => ({
      left: `${a.value.left}px`,
      top: `${a.value.top}px`,
      width: `${a.value.right - a.value.left}px`,
      height: `${a.value.bottom - a.value.top}px`,
      "--fallen": `${t.top.x > t.foot.x ? -80 : 80}deg`,
      transformOrigin: `${t.foot.x - a.value.left}px ${t.foot.y - a.value.top}px`
    })), s = _(() => {
      const [i, c, u, p] = [t.foot.x - a.value.left, t.foot.y - a.value.top, t.top.x - a.value.left, t.top.y - a.value.top], m = Math.hypot(u - i, p - c), [f, h] = [(u - i) / m, (p - c) / m], [k, E] = [-h * (un / 2), f * (un / 2)], x = [-1, 1].map((L) => ({ x1: i + L * k, y1: c + L * E, x2: u + L * k, y2: p + L * E })), F = Array.from({ length: Math.floor(m / Xe.rung) }, (L, G) => {
        const se = (G + 0.6) * Xe.rung, [M, Fe] = [i + f * se, c + h * se];
        return { x1: M - k, y1: Fe - E, x2: M + k, y2: Fe + E };
      });
      return { rails: x, rungs: F };
    });
    return (i, c) => (b(), w("div", {
      class: "step-ladder",
      style: ae(r.value),
      "aria-hidden": "true",
      "data-step-ladder": ""
    }, [
      (b(), w("svg", {
        class: "step-ladder-drawing",
        width: a.value.right - a.value.left,
        height: a.value.bottom - a.value.top
      }, [
        (b(!0), w(I, null, H(s.value.rungs, (u, p) => (b(), w("line", Ro({
          key: `rung${p}`,
          class: "step-ladder-rung"
        }, { ref_for: !0 }, u), null, 16))), 128)),
        (b(!0), w(I, null, H(s.value.rails, (u, p) => (b(), w("line", Ro({
          key: `rail${p}`,
          class: "step-ladder-rail"
        }, { ref_for: !0 }, u), null, 16))), 128))
      ], 8, Id))
    ], 4));
  }
}, Cd = /* @__PURE__ */ Ge(Rd, [["__scopeId", "data-v-1674d262"]]), Je = { hopMs: 220, perPixel: 0.7, arc: 0.3, gone: [1e3, 5e3], chute: 1.1 };
function qd(e, t, a) {
  const r = [...t, { x: (t.at(-1) ?? e).x, y: a }];
  return r.map((s, i) => {
    const c = i ? r[i - 1] : e;
    return { from: c, to: s, ms: Je.hopMs + Je.perPixel * Math.hypot(s.x - c.x, s.y - c.y) };
  });
}
function Dd(e, t, a) {
  var s;
  let r = t;
  for (const i of e) {
    if (r < i.ms) {
      const c = r / i.ms, u = Je.arc * a * 4 * c * (1 - c);
      return { x: i.from.x + (i.to.x - i.from.x) * c, y: i.from.y + (i.to.y - i.from.y) * c - u, way: Math.sign(i.to.x - i.from.x), gone: !1 };
    }
    r -= i.ms;
  }
  return { ...(s = e.at(-1)) == null ? void 0 : s.to, way: 0, gone: !0 };
}
const Pd = (e) => Je.gone[0] + e() * (Je.gone[1] - Je.gone[0]), Lt = { sampled: 0.1, fastest: 3e3, spin: 900, bounce: 0.5, away: 500 }, jd = 0.05, Zl = (e, t, a) => Math.min(Math.max(e, t), a);
function Gd(e, t) {
  const a = e.filter((m) => t - m.at <= Lt.sampled);
  if (a.length < 2) return { x: 0, y: 0 };
  const [r, s] = [a[0], a.at(-1)], i = Math.max(s.at - r.at, 1e-3), [c, u] = [(s.x - r.x) / i, (s.y - r.y) / i], p = Math.min(1, Lt.fastest / Math.max(Math.hypot(c, u), 1e-9));
  return { x: c * p, y: u * p };
}
const pl = (e) => !!(e != null && e.held || e != null && e.thrown);
function hl(e, t, a, r = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, s = { x: 0, y: 0 }) {
  const { a: i, b: c, c: u, d: p, e: m, f } = r, h = i * p - c * u, k = t.x - e.x - s.x - m + i * s.x + u * s.y, E = t.y - e.y - s.y - f + c * s.x + p * s.y, x = { x: (p * k - u * E) / h / a, y: (i * E - c * k) / h / a }, F = Math.hypot(i, c);
  return { at: { x: t.x - x.x * a, y: t.y - x.y * a }, point: x, angle: Math.atan2(c, i), scale: [F, h / F] };
}
function Ea(e, t) {
  if (!e.scaleFrom) return [1, 1];
  const a = Zl((t - e.scaleAt) / 180, 0, 1), r = a * a * (3 - 2 * a);
  return e.scaleFrom.map((s) => s + (1 - s) * r);
}
function ml(e, t) {
  var u, p;
  const a = e.hang ?? 0, [r, s] = e.scale ?? [1, 1], i = ((((u = e.grip) == null ? void 0 : u.x) ?? 0.5) - 0.5) * t, c = ((((p = e.grip) == null ? void 0 : p.y) ?? 0.55) - 0.55) * t;
  return { ...e, x: e.x + i - Math.cos(a) * r * i + Math.sin(a) * s * c, y: e.y + c - Math.sin(a) * r * i - Math.cos(a) * s * c };
}
const Ud = (e, t, a) => ({
  place: { ...t, posture: "stand", face: 0, view: null, on: null },
  at: { ...e.at },
  trip: null,
  leg: { x: e.at.x, y: e.at.y, ms: 0, lead: 0, easing: "linear" },
  walk: { from: { ...e.at }, began: 0, on: null },
  footing: null,
  airborne: { ...t, posture: "stand", face: 0, held: !0, hang: 0, grip: a },
  landing: !1,
  arriving: !1,
  leaving: !1,
  slide: null,
  rested: "stand"
}), gl = (e, t, a) => ({
  x: e.x,
  y: e.y,
  posture: "stand",
  face: e.face ?? 0,
  vx: t.x,
  speed: t.y,
  at: a,
  spin: e.held ? (e.hang ?? 0) * 180 / Math.PI : 0,
  peak: 0,
  thrown: !0,
  ...e.scaleFrom && { scale: Ea(e, a), scaleFrom: e.scaleFrom, scaleAt: e.scaleAt }
});
function Hd(e, t, a, r) {
  const s = Math.min((r - e.at) / 1e3, jd), i = e.x + e.vx * s, c = i < a.left || i > a.right, u = Zl(i, a.left, a.right), { landed: p, ...m } = Gl({ ...e, x: u }, t, s);
  if (p) return { airborne: null, landed: { x: u, y: p.top, posture: "stand", face: 0, view: null, on: p.element ?? null }, gone: !1 };
  const f = e.spin + (Math.sign(e.vx) || 1) * Lt.spin * s, h = { ...e, ...m, x: u, vx: c ? -e.vx * Lt.bounce : e.vx, spin: f, at: r, ...e.scaleFrom && { scale: Ea(e, r) } };
  return { airborne: h, landed: null, gone: h.speed < 0 && h.y <= a.top - Lt.away };
}
const ge = { close: 60, open: 90, shut: 0.06, every: [2500, 6e3] };
function Wd(e) {
  if (e < 0 || e >= ge.close + ge.open) return 1;
  const t = e < ge.close ? e / ge.close : 1 - (e - ge.close) / ge.open;
  return 1 + (ge.shut - 1) * t;
}
const yl = (e) => ge.every[0] + e() * (ge.every[1] - ge.every[0]), Kd = ["data-figure-pile"], Yd = ["src"], Vd = {
  __name: "CodeParcel",
  props: {
    x: { type: Number, required: !0 },
    y: { type: Number, required: !0 },
    up: { type: Number, default: 0 },
    scale: { type: Number, default: 1 },
    opacity: { type: Number, default: 1 },
    blows: { type: Number, default: 0 },
    block: { type: Object, required: !0 },
    ahead: { type: Boolean, default: !1 },
    piled: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = e, a = [
      { x: -17, y: -4, size: 14 },
      { x: -7, y: -2, size: 12 },
      { x: 6, y: -3, size: 13 },
      { x: 17, y: -5, size: 12 },
      { x: -11, y: -12, size: 11 },
      { x: 12, y: -13, size: 10 },
      { x: 0, y: -17, size: 11 }
    ], r = D([]);
    let s = 0;
    const i = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function c() {
      const x = ++s, F = yi(Math.random).map((L, G) => ({ ...L, id: `${x}-${G}` }));
      r.value = [...r.value, { id: x, digits: F }], setTimeout(() => r.value = r.value.filter((L) => L.id !== x), Math.max(...F.map((L) => Math.max(L.moveMs, L.fadeMs))));
    }
    ya(
      () => t.blows,
      (x, F) => x > F && !i() && c()
    );
    const u = (x) => ({
      left: `${x.x - x.size / 2}px`,
      top: `${x.y - x.size / 2}px`,
      width: `${x.size}px`,
      height: `${x.size}px`
    }), p = (x) => ({
      "--from-x": `${x.x}px`,
      "--from-y": `${x.y}px`,
      "--to-x": `${x.x + x.dx}px`,
      "--to-y": `${x.y + x.dy}px`,
      "--move-ms": `${x.moveMs}ms`,
      "--fade-ms": `${x.fadeMs}ms`
    }), m = _(() => ({ left: `${t.x}px`, top: `${t.y}px`, zIndex: t.ahead ? xa.ahead : xa.behind })), f = _(() => ({ transform: `translateY(${-t.up}px)` })), h = _(() => ({ transform: `scale(${t.scale})`, opacity: t.opacity })), k = _(() => ({
      width: `${t.block.width}px`,
      height: `${t.block.height}px`,
      bottom: `${-t.block.below}px`,
      "--blink-ms": `${Po.ms * t.block.pictures.length}ms`
    })), E = (x) => ({ animationDelay: `${-(t.block.pictures.length - x) * Po.ms}ms` });
    return (x, F) => (b(), w("div", {
      class: "code-parcel",
      style: ae(m.value),
      "aria-hidden": "true"
    }, [
      A("div", {
        class: "code-parcel-placed",
        style: ae(f.value)
      }, [
        A("div", {
          class: "code-parcel-sized",
          style: ae(h.value)
        }, [
          A("div", {
            class: "code-parcel-box",
            style: ae(k.value),
            "data-figure-pile": e.piled ? "" : null
          }, [
            (b(!0), w(I, null, H(e.block.pictures, (L, G) => (b(), w("img", {
              key: G,
              class: Fl(["code-parcel-step", { blinks: e.block.pictures.length > 1 }]),
              src: L,
              style: ae(E(G)),
              alt: ""
            }, null, 14, Yd))), 128))
          ], 12, Kd)
        ], 4)
      ], 4),
      (b(!0), w(I, null, H(r.value, (L) => (b(), w("div", {
        key: L.id,
        class: "code-parcel-dust"
      }, [
        (b(), w(I, null, H(a, (G) => A("span", {
          key: `${G.x}/${G.y}`,
          class: "code-parcel-cloud",
          style: ae(u(G))
        }, null, 4)), 64)),
        (b(!0), w(I, null, H(L.digits, (G) => (b(), w("span", {
          key: G.id,
          class: "code-parcel-digit",
          style: ae(p(G))
        }, $a(G.text), 5))), 128))
      ]))), 128))
    ], 4));
  }
}, Xd = /* @__PURE__ */ Ge(Vd, [["__scopeId", "data-v-191db8a4"]]), W = { ink: "#272936", paper: "#f6f1e3", red: "#d9413b", wood: "#8a5a2b", gold: "#e8b84a", light: "#fff3a8", silver: "#c3c7d1", smoke: "#e9e7e1" }, Zd = ["transform"], Qd = ["fill"], Jd = ["fill"], ef = ["fill"], tf = {
  __name: "AskSign",
  props: {
    u: { type: Number, required: !0 },
    hand: { type: Object, required: !0 }
  },
  setup(e) {
    const t = e, a = V.ask_sign, r = _(() => t.u > a.raise[0] && t.u < a.lower[1]), s = _(() => {
      const [i, c] = a.waggle, u = Math.min(Math.max((t.u - i) / (c - i), 0), 1);
      return 14 * Math.sin(2 * Math.PI * a.waggles * u) * Math.sin(Math.PI * u);
    });
    return (i, c) => r.value ? (b(), w("g", {
      key: 0,
      transform: `translate(${e.hand.x} ${e.hand.y}) rotate(${s.value})`
    }, [
      A("rect", {
        x: "-1.2",
        y: "-22",
        width: "2.4",
        height: "26",
        fill: j(W).wood
      }, null, 8, Qd),
      A("rect", {
        x: "-12",
        y: "-40",
        width: "24",
        height: "20",
        rx: "2",
        fill: j(W).paper,
        "stroke-width": "1.4"
      }, null, 8, Jd),
      A("text", {
        x: "0",
        y: "-24.5",
        "text-anchor": "middle",
        class: "figure-act-mark",
        fill: j(W).ink,
        stroke: "none"
      }, "?", 8, ef)
    ], 8, Zd)) : P("", !0);
  }
}, nf = /* @__PURE__ */ Ge(tf, [["__scopeId", "data-v-e8e687f5"]]), af = ["x1", "y1", "x2", "y2", "stroke"], of = { id: "figure-act-ball" }, lf = ["cx", "cy", "r"], sf = ["cx", "cy", "r"], rf = { "clip-path": "url(#figure-act-ball)" }, uf = ["x", "y", "width", "height", "fill"], cf = ["cx", "cy", "r", "stroke"], df = ["cx", "cy", "fill"], ff = {
  __name: "DiscoBall",
  props: {
    u: { type: Number, required: !0 },
    middle: { type: Number, required: !0 },
    floor: { type: Number, required: !0 },
    size: { type: Number, required: !0 },
    ball: { type: Object, required: !0 }
  },
  setup(e) {
    const t = e, a = _(() => {
      const r = V.disco.ball * t.size / 2, s = t.floor - t.ball.hangs, i = t.u * 40, c = [];
      for (let p = -2; p <= 2; p++) for (let m = -3; m <= 3; m++) c.push({ name: `tile${p}:${m}`, x: t.middle + m * r * 0.42 + i * r * 0.42 % (r * 0.42) - r * 0.21, y: s + p * r * 0.42, light: (p + m + Math.floor(i)) % 3 === 0 });
      const u = Array.from({ length: 9 }, (p, m) => {
        const f = m * 0.7 + t.u * 9;
        return { name: `fleck${m}`, x: t.middle + Math.cos(f) * t.size * (0.55 + 0.1 * (m % 3)), y: s + 10 + Math.abs(Math.sin(f * 1.3)) * t.size * 0.75, colour: `hsl(${(m * 40 + t.u * 1400) % 360} 95% 65%)` };
      });
      return { x: t.middle, y: s, r, top: t.floor - t.ball.above, tiles: c, flecks: u };
    });
    return (r, s) => (b(), w(I, null, [
      A("line", {
        x1: a.value.x,
        y1: a.value.top,
        x2: a.value.x,
        y2: a.value.y - a.value.r,
        stroke: j(W).silver,
        "stroke-width": "1"
      }, null, 8, af),
      A("clipPath", of, [
        A("circle", {
          cx: a.value.x,
          cy: a.value.y,
          r: a.value.r
        }, null, 8, lf)
      ]),
      A("circle", {
        cx: a.value.x,
        cy: a.value.y,
        r: a.value.r,
        fill: "#8d93a3"
      }, null, 8, sf),
      A("g", rf, [
        (b(!0), w(I, null, H(a.value.tiles, (i) => (b(), w("rect", {
          key: i.name,
          x: i.x - a.value.r * 0.18,
          y: i.y - a.value.r * 0.18,
          width: a.value.r * 0.36,
          height: a.value.r * 0.36,
          fill: i.light ? "#f4f6fb" : "#b9bfcc"
        }, null, 8, uf))), 128))
      ]),
      A("circle", {
        cx: a.value.x,
        cy: a.value.y,
        r: a.value.r,
        fill: "none",
        stroke: j(W).ink,
        "stroke-width": "0.8"
      }, null, 8, cf),
      (b(!0), w(I, null, H(a.value.flecks, (i) => (b(), w("circle", {
        key: i.name,
        cx: i.x,
        cy: i.y,
        r: "2.2",
        fill: i.colour,
        opacity: "0.85"
      }, null, 8, df))), 128))
    ], 64));
  }
}, pf = ["transform"], hf = ["fill"], mf = ["transform"], gf = ["x", "y", "height", "fill"], yf = ["x", "y", "height"], vf = ["x", "y", "width", "fill"], bf = ["x", "y", "fill"], xf = ["d"], wf = {
  __name: "FileCard",
  props: {
    u: { type: Number, required: !0 },
    hand: { type: Object, required: !0 },
    middle: { type: Number, required: !0 },
    floor: { type: Number, required: !0 },
    out: { type: Number, required: !0 },
    size: { type: Number, required: !0 }
  },
  setup(e) {
    const t = e, a = { across: 0.24, top: 0.3 }, r = V.file_card, s = _(() => ({ x: t.middle + t.out * a.across * t.size, top: t.floor - a.top * t.size, up: vi(r, t.u) })), i = _(() => `translate(0 ${t.floor}) scale(1 ${s.value.up}) translate(0 ${-t.floor})`), c = _(() => de(t.u, r.opens) * (1 - de(t.u, r.shuts))), u = _(() => de(t.u, r.filed));
    return (p, m) => (b(), w(I, null, [
      u.value < 1 && e.u > j(r).reach[0] ? (b(), w("g", {
        key: 0,
        transform: `translate(${e.hand.x} ${e.hand.y + 3 + 6 * u.value})`
      }, [
        A("rect", {
          x: "-6",
          y: "-4",
          width: "12",
          height: "8",
          fill: j(W).paper,
          "stroke-width": "0.7"
        }, null, 8, hf),
        m[0] || (m[0] = A("path", {
          d: "M-4 -1.5h8M-4 1h6",
          "stroke-width": "0.5"
        }, null, -1))
      ], 8, pf)) : P("", !0),
      A("g", { transform: i.value }, [
        A("rect", {
          x: s.value.x - 12,
          y: s.value.top,
          width: 24,
          height: e.floor - s.value.top,
          rx: "1",
          fill: j(W).wood
        }, null, 8, gf),
        A("rect", {
          x: s.value.x - 10,
          y: s.value.top + 2 - 5 * c.value,
          width: "20",
          height: 5 * c.value,
          fill: "#5b3a1c",
          "stroke-width": "0.6"
        }, null, 8, yf),
        A("rect", {
          x: s.value.x - 10 - 1.5 * c.value,
          y: s.value.top + 2,
          width: 20 + 3 * c.value,
          height: "10",
          rx: "1",
          fill: j(W).wood
        }, null, 8, vf),
        A("rect", {
          x: s.value.x - 10,
          y: s.value.top + 14,
          width: "20",
          height: "10",
          rx: "1",
          fill: j(W).wood
        }, null, 8, bf),
        A("path", {
          d: `M${s.value.x - 3} ${s.value.top + 7}h6M${s.value.x - 3} ${s.value.top + 19}h6`,
          "stroke-width": "1.4"
        }, null, 8, xf)
      ], 8, mf)
    ], 64));
  }
}, kf = ["cx", "cy", "r", "opacity"], $f = {
  __name: "FumeSteam",
  props: {
    u: { type: Number, required: !0 },
    head: { type: Object, required: !0 }
  },
  setup(e) {
    const t = e, a = V.fume, r = _(() => {
      const s = (t.u - a.steam[0]) / (a.steam[1] - a.steam[0]);
      return s <= 0 || s >= 1 ? [] : Array.from({ length: 6 }, (i, c) => {
        const u = (s * 3 + c / 6) % 1, p = c % 2 ? 1 : -1;
        return { name: `puff${c}`, x: t.head.x + p * (12 + 10 * u), y: t.head.y - 14 - 26 * u, r: 2.5 + 4 * u, fade: 1 - u };
      });
    });
    return (s, i) => (b(!0), w(I, null, H(r.value, (c) => (b(), w("circle", {
      key: c.name,
      cx: c.x,
      cy: c.y,
      r: c.r,
      fill: "#e9e7e1",
      stroke: "#a9adb8",
      "stroke-width": "0.6",
      opacity: c.fade
    }, null, 8, kf))), 128));
  }
}, _f = ["transform"], Mf = ["cx", "cy", "r", "fill", "opacity"], Sf = ["d", "fill", "opacity"], Af = {
  __name: "HandRub",
  props: {
    u: { type: Number, required: !0 },
    hand: { type: Object, required: !0 }
  },
  setup(e) {
    const t = e, a = [[-9, -12], [8, -18], [1, -26]], r = V.hand_rub, s = _(() => {
      const i = (t.u - r.puff[0]) / (r.puff[1] - r.puff[0]);
      if (i <= 0 || i >= 1) return null;
      const c = Math.min(i * 6, 1, (1 - i) * 6), u = Array.from({ length: r.puffs }, (m, f) => {
        const h = (i + f / r.puffs) % 1;
        return { name: `puff${f}`, x: (f - (r.puffs - 1) / 2) * 5 + 3 * Math.sin(h * 6 + f), y: -4 - 16 * h, r: 2 + 3.5 * h, fade: c * (1 - h) * 0.85 };
      }), p = a.slice(0, r.sparkles).map(([m, f], h) => {
        const k = 2.6 * Math.max(Math.sin(Math.PI * ((i * 4 + h / 3) % 1)), 0), E = `M${m} ${f - k * 2}L${m + k * 0.5} ${f - k * 0.5}L${m + k * 2} ${f}L${m + k * 0.5} ${f + k * 0.5}L${m} ${f + k * 2}L${m - k * 0.5} ${f + k * 0.5}L${m - k * 2} ${f}L${m - k * 0.5} ${f - k * 0.5}Z`;
        return { name: `sparkle${h}`, shape: E, fade: c };
      });
      return { puffs: u, sparkles: p };
    });
    return (i, c) => s.value ? (b(), w("g", {
      key: 0,
      class: "figure-act-rub",
      transform: `translate(${e.hand.x} ${e.hand.y})`
    }, [
      (b(!0), w(I, null, H(s.value.puffs, (u) => (b(), w("circle", {
        key: u.name,
        cx: u.x,
        cy: u.y,
        r: u.r,
        fill: j(W).smoke,
        stroke: "#a9adb8",
        "stroke-width": "0.5",
        opacity: u.fade
      }, null, 8, Mf))), 128)),
      (b(!0), w(I, null, H(s.value.sparkles, (u) => (b(), w("path", {
        key: u.name,
        d: u.shape,
        fill: j(W).light,
        stroke: "none",
        opacity: u.fade
      }, null, 8, Sf))), 128))
    ], 8, _f)) : P("", !0);
  }
}, Of = ["transform"], Ef = ["d"], Nf = ["d"], Ff = ["x", "y", "width", "height"], Bf = ["d"], Tf = ["y"], Lf = ["transform", "opacity"], zf = ["cx", "cy", "r"], If = ["transform"], Rf = {
  __name: "PackBox",
  props: {
    u: { type: Number, required: !0 },
    middle: { type: Number, required: !0 },
    floor: { type: Number, required: !0 }
  },
  setup(e) {
    const t = e, a = [-2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4].map((c, u) => ({ name: `cloud${u}`, way: c })), r = [1, 2, 3, 4].map((c) => ({ name: `bit${c}`, place: c })), s = V.pack_box, i = _(() => {
      const { into: c, out: u } = _a(s, t.u), p = u >= s.pops, m = p ? Math.min((u - s.pops) / 0.4, 1) : 0;
      return { grown: de(c, s.appears), popped: p, puff: m, x: t.middle, width: 50, height: 36 };
    });
    return (c, u) => (b(), w(I, null, [
      !i.value.popped && i.value.grown > 0 ? (b(), w("g", {
        key: 0,
        transform: `translate(${i.value.x} ${e.floor}) scale(${i.value.grown})`
      }, [
        A("path", {
          d: `M${-i.value.width / 2} ${-i.value.height}l-12 -9 4 -4 8 13Z`,
          fill: "#b88a55"
        }, null, 8, Ef),
        A("path", {
          d: `M${i.value.width / 2} ${-i.value.height}l12 -9 -4 -4 -8 13Z`,
          fill: "#b88a55"
        }, null, 8, Nf),
        A("rect", {
          x: -i.value.width / 2,
          y: -i.value.height,
          width: i.value.width,
          height: i.value.height,
          fill: "#c89b63"
        }, null, 8, Ff),
        A("path", {
          d: `M${-i.value.width / 2} ${-i.value.height + 5}H${i.value.width / 2}`,
          "stroke-width": "0.6"
        }, null, 8, Bf),
        A("rect", {
          x: "-7",
          y: -i.value.height + 8,
          width: "14",
          height: "6",
          fill: "#e8d4b0",
          "stroke-width": "0.6"
        }, null, 8, Tf)
      ], 8, Of)) : P("", !0),
      i.value.popped && i.value.puff < 1 ? (b(), w("g", {
        key: 1,
        transform: `translate(${i.value.x} ${e.floor - 18})`,
        opacity: 1 - i.value.puff
      }, [
        (b(!0), w(I, null, H(j(a), (p) => (b(), w("circle", {
          key: p.name,
          cx: Math.sin(p.way) * 30 * i.value.puff,
          cy: -Math.cos(p.way) * 16 * i.value.puff,
          r: 8 + 8 * i.value.puff,
          fill: "#e9e7e1",
          stroke: "#a9adb8",
          "stroke-width": "0.8"
        }, null, 8, zf))), 128)),
        (b(!0), w(I, null, H(j(r), (p) => (b(), w("rect", {
          key: p.name,
          x: "-3.5",
          y: "-2",
          width: "7",
          height: "4",
          fill: "#c89b63",
          transform: `translate(${(p.place - 2.5) * 22 * i.value.puff} ${-20 * i.value.puff + 30 * i.value.puff * i.value.puff}) rotate(${p.place * 70 * i.value.puff})`,
          "data-act-box-bit": ""
        }, null, 8, If))), 128))
      ], 8, Lf)) : P("", !0)
    ], 64));
  }
}, Cf = ["x1", "y1", "x2", "y2"], qf = ["transform"], Df = ["href", "x", "y", "width", "height"], Pf = {
  __name: "Parachute",
  props: {
    u: { type: Number, required: !0 },
    head: { type: Object, required: !0 },
    hand: { type: Object, required: !0 },
    other: { type: Object, required: !0 },
    size: { type: Number, required: !0 },
    canopy: { type: Object, required: !0 }
  },
  setup(e) {
    const t = e, a = _(() => bi(t.canopy, t.head, [t.hand, t.other], t.size, t.u)), r = _(() => a.value.lines.map(({ from: i, to: c }, u) => ({ name: `line${u}`, x1: i.x, y1: i.y, x2: c.x, y2: c.y }))), s = _(() => `rotate(${a.value.turn} ${a.value.middle.x} ${a.value.middle.y})`);
    return (i, c) => (b(), w(I, null, [
      (b(!0), w(I, null, H(r.value, (u) => (b(), w("line", {
        key: u.name,
        x1: u.x1,
        y1: u.y1,
        x2: u.x2,
        y2: u.y2,
        "stroke-width": "0.7",
        "data-chute-line": ""
      }, null, 8, Cf))), 128)),
      A("g", { transform: s.value }, [
        A("image", {
          href: e.canopy.picture,
          x: a.value.left,
          y: a.value.top,
          width: e.canopy.width,
          height: e.canopy.height,
          "data-chute-canopy": ""
        }, null, 8, Df)
      ], 8, qf)
    ], 64));
  }
}, jf = ["transform"], Gf = ["y1", "y2", "stroke"], Uf = ["x1", "y1", "x2", "y2", "stroke"], Hf = ["x1", "x2", "stroke"], Wf = ["d", "stroke"], Kf = {
  __name: "PogoStick",
  props: {
    u: { type: Number, required: !0 },
    middle: { type: Number, required: !0 },
    floor: { type: Number, required: !0 },
    size: { type: Number, required: !0 }
  },
  setup(e) {
    const t = e, a = _(() => {
      const { draw: r, drop: s, stick: i } = V.pogo, c = i * t.size, u = de(t.u, s), p = Array.from({ length: 7 }, (m, f) => `${f % 2 ? 3 : -3} ${2 + f * 1.6}`).join(" L");
      return {
        shown: de(t.u, [r[1] * 0.6, r[1]]),
        foot: t.floor,
        top: -t.size * V.pogo.handles,
        bottom: c * 0.18,
        bar: t.size * 0.16,
        peg: t.size * 0.13,
        spring: `M0 1 L${p} L0 ${2 + 7 * 1.6}`,
        fall: u * u * t.size * 9,
        turn: 70 * u
      };
    });
    return (r, s) => a.value.shown ? (b(), w("g", {
      key: 0,
      transform: `translate(${e.middle} ${a.value.foot + a.value.fall}) rotate(${a.value.turn}) scale(${a.value.shown})`,
      "data-pogo-stick": ""
    }, [
      A("line", {
        x1: "0",
        y1: a.value.top,
        x2: "0",
        y2: a.value.bottom,
        stroke: j(W).silver,
        "stroke-width": "2.6",
        "stroke-linecap": "round"
      }, null, 8, Gf),
      A("line", {
        x1: -a.value.bar,
        y1: a.value.top,
        x2: a.value.bar,
        y2: a.value.top,
        stroke: j(W).silver,
        "stroke-width": "3",
        "stroke-linecap": "round"
      }, null, 8, Uf),
      A("line", {
        x1: -a.value.peg,
        y1: "-1",
        x2: a.value.peg,
        y2: "-1",
        stroke: j(W).red,
        "stroke-width": "2.4",
        "stroke-linecap": "round"
      }, null, 8, Hf),
      A("path", {
        d: a.value.spring,
        stroke: j(W).gold,
        "stroke-width": "1.2",
        fill: "none"
      }, null, 8, Wf)
    ], 8, jf)) : P("", !0);
  }
}, Yf = ["x", "y"], Vf = ["x", "y"], Xf = {
  __name: "PressPlate",
  props: {
    u: { type: Number, required: !0 },
    middle: { type: Number, required: !0 },
    size: { type: Number, required: !0 }
  },
  setup(e) {
    const t = e, a = V.press, r = _(() => {
      const { into: s, out: i } = _a(a, t.u);
      return t.size * 0.27 - 6 - 70 * (1 - de(s, a.lowers)) - 90 * de(i, a.lifts);
    });
    return (s, i) => (b(), w(I, null, [
      A("rect", {
        x: e.middle - 2,
        y: r.value - 200,
        width: "4",
        height: "200",
        fill: "#a9adb8"
      }, null, 8, Yf),
      A("rect", {
        x: e.middle - 22,
        y: r.value,
        width: "44",
        height: "6",
        rx: "1",
        fill: "#6b6f7c"
      }, null, 8, Vf)
    ], 64));
  }
}, Zf = ["opacity"], Qf = ["cx", "cy", "r", "fill"], Jf = ["opacity"], ep = ["cx", "cy", "r", "fill"], tp = ["cx", "cy", "r", "fill"], np = ["cx", "cy", "r", "fill", "opacity"], ap = {
  __name: "ThoughtCloud",
  props: {
    name: { type: String, required: !0 },
    u: { type: Number, required: !0 },
    head: { type: Object, required: !0 },
    out: { type: Number, required: !0 },
    size: { type: Number, required: !0 }
  },
  setup(e) {
    const t = e, a = { across: 0.24, above: 0.36, wide: 0.3, puffs: [[0.08, 0.12, 0.022], [0.13, 0.2, 0.03], [0.18, 0.27, 0.04]] }, r = [[-0.32, 0.05, 0.2], [-0.12, -0.12, 0.24], [0.14, -0.1, 0.22], [0.32, 0.06, 0.18], [0, 0.12, 0.22]], s = (c) => c * t.size, i = _(() => {
      const { puffs: c, cloud: u, rise: p, pulse: m, frames: f, fps: h } = V[t.name];
      if (!m) return null;
      const k = (J, o) => c ? de(t.u, [J, o]) : 1, E = c ? de(t.u, [u[0], c[1]]) * (1 - de(t.u, [u[1], p[1]])) : 1;
      if (!E) return null;
      const x = t.u * f / h, F = a.puffs.map(([J, o, ht], Ue) => ({
        name: `puff${Ue}`,
        x: t.head.x + t.out * s(J),
        y: t.head.y - s(o),
        r: s(ht) * (c ? k(c[0] + Ue * (c[1] - c[0]) / 3, c[0] + (Ue + 1) * (c[1] - c[0]) / 3) : 1)
      })), L = t.head.x + t.out * s(a.across), G = t.head.y - s(a.above), se = s(a.wide), M = r.map(([J, o, ht], Ue) => ({ name: `bump${Ue}`, x: L + J * se, y: G + o * se, r: ht * se })), Fe = [-1, 0, 1].map((J, o) => ({ name: `dot${o}`, x: L + J * se * 0.22, y: G, r: se * 0.05 * (1 + 0.5 * Math.max(Math.sin(2 * Math.PI * (x / m - o / 3)), 0)), lit: 0.35 + 0.65 * Math.max(Math.sin(2 * Math.PI * (x / m - o / 3)), 0) }));
      return { shown: E, rising: F, bumps: M, dots: Fe, grown: c ? k(c[0] + 2 * (c[1] - c[0]) / 3, c[1]) : 1 };
    });
    return (c, u) => i.value ? (b(), w("g", {
      key: 0,
      opacity: i.value.shown,
      "data-thought-cloud": ""
    }, [
      (b(!0), w(I, null, H(i.value.rising, (p) => (b(), w("circle", {
        key: p.name,
        cx: p.x,
        cy: p.y,
        r: p.r,
        fill: j(W).paper,
        "stroke-width": "0.8"
      }, null, 8, Qf))), 128)),
      i.value.grown ? (b(), w("g", {
        key: 0,
        opacity: i.value.grown
      }, [
        (b(!0), w(I, null, H(i.value.bumps, (p) => (b(), w("circle", {
          key: p.name,
          cx: p.x,
          cy: p.y,
          r: p.r,
          fill: j(W).paper,
          "stroke-width": "0.9"
        }, null, 8, ep))), 128)),
        (b(!0), w(I, null, H(i.value.bumps, (p) => (b(), w("circle", {
          key: p.name,
          cx: p.x,
          cy: p.y,
          r: p.r - 0.8,
          fill: j(W).paper,
          stroke: "none"
        }, null, 8, tp))), 128)),
        (b(!0), w(I, null, H(i.value.dots, (p) => (b(), w("circle", {
          key: p.name,
          cx: p.x,
          cy: p.y,
          r: p.r,
          fill: j(W).ink,
          stroke: "none",
          opacity: p.lit,
          "data-thought-dot": ""
        }, null, 8, np))), 128))
      ], 8, Jf)) : P("", !0)
    ], 8, Zf)) : P("", !0);
  }
}, op = ["opacity"], lp = ["d", "stroke"], sp = ["d"], rp = ["x", "y"], ip = ["cx", "cy", "fill"], up = ["cx", "cy", "fill"], cp = ["transform"], dp = ["x", "y", "font-size", "opacity", "fill"], fp = {
  __name: "VacuumCleaner",
  props: {
    u: { type: Number, required: !0 },
    hand: { type: Object, required: !0 },
    middle: { type: Number, required: !0 },
    floor: { type: Number, required: !0 },
    out: { type: Number, required: !0 },
    size: { type: Number, required: !0 }
  },
  setup(e) {
    const t = e, a = ["abc", "the", "ok", "do", "fix"], r = V.vacuum, s = _(() => {
      const { into: i, out: c } = _a(r, t.u), u = i * (1 - c), p = t.middle + t.out * t.size * 0.44, m = t.floor, f = { x: t.hand.x + t.out * 7, y: t.hand.y + 4 }, h = (t.u * (r.intro + r.hold + r.outro) - r.intro) / r.hold, k = Array.from({ length: r.words }, (E, x) => {
        const F = ((h * 2 + x / r.words) % 1 + 1) % 1, L = { x: f.x + t.out * (70 + 12 * (x % 3)), y: f.y - 30 + 13 * x };
        return { x: L.x + (f.x - L.x) * F ** 1.6, y: L.y + (f.y - L.y) * F ** 1.6, size: 1 - 0.7 * F, opacity: de(F, [0, 0.12]) * (1 - de(F, [0.85, 1])), word: a[x] };
      });
      return {
        on: u,
        x: p,
        y: m,
        nozzle: `translate(${f.x} ${f.y}) scale(${t.out} 1)`,
        words: k,
        hose: `M${p} ${m - 12}Q${p} ${f.y + 30} ${f.x - t.out * 6} ${f.y}`
      };
    });
    return (i, c) => s.value.on > 0 ? (b(), w("g", {
      key: 0,
      opacity: s.value.on
    }, [
      A("path", {
        d: s.value.hose,
        fill: "none",
        "stroke-width": "2.6",
        stroke: j(W).ink
      }, null, 8, lp),
      A("path", {
        d: s.value.hose,
        fill: "none",
        "stroke-width": "1.4",
        stroke: "#6366f1"
      }, null, 8, sp),
      A("rect", {
        x: s.value.x - 9,
        y: s.value.y - 16,
        width: "18",
        height: "14",
        rx: "4",
        fill: "#ef476f"
      }, null, 8, rp),
      A("circle", {
        cx: s.value.x - 5,
        cy: s.value.y - 2,
        r: "2.5",
        fill: j(W).ink
      }, null, 8, ip),
      A("circle", {
        cx: s.value.x + 5,
        cy: s.value.y - 2,
        r: "2.5",
        fill: j(W).ink
      }, null, 8, up),
      A("g", {
        transform: s.value.nozzle
      }, [...c[0] || (c[0] = [
        A("path", {
          d: "M-6 -1.6H2L6 -4.5V4.5L2 1.6H-6Z",
          fill: "#35374b"
        }, null, -1)
      ])], 8, cp),
      (b(!0), w(I, null, H(s.value.words, (u) => (b(), w("text", {
        key: u.word,
        x: u.x,
        y: u.y,
        "font-size": 7 * u.size,
        opacity: u.opacity,
        "text-anchor": "middle",
        class: "figure-act-word",
        stroke: "none",
        fill: j(W).paper
      }, $a(u.word), 9, dp))), 128))
    ], 8, op)) : P("", !0);
  }
}, pp = /* @__PURE__ */ Ge(fp, [["__scopeId", "data-v-ff0fa3ef"]]), hp = ["transform"], mp = ["href", "x", "y", "width", "height"], gp = ["id"], yp = ["x", "y", "width", "height"], vp = ["clip-path", "data-act-surface"], bp = ["x", "y", "width", "height", "rx", "opacity"], xp = ["cx", "cy", "r", "opacity"], wp = ["cx", "cy", "rx", "ry", "opacity"], kp = ["cx", "cy", "r"], $p = ["opacity"], _p = ["x", "y", "width", "height"], Mp = ["cx", "cy", "r"], Sp = ["cx", "cy", "r"], Ap = ["cx", "cy", "r"], Ot = "#9bd34a", da = "#5f8f24", Op = {
  __name: "WallBugs",
  props: {
    u: { type: Number, required: !0 },
    middle: { type: Number, required: !0 },
    size: { type: Number, required: !0 },
    bug: { type: Object, required: !0 },
    bugs: { type: Array, required: !0 },
    slush: { type: Array, default: () => [] },
    camera: { type: Array, default: () => [] }
  },
  setup(e) {
    const t = e, a = V.bug_shot, r = Hr(), s = _(() => {
      const m = Math.floor(t.u * a.frames / 2) % 2;
      return t.bugs.flatMap((f, h) => f.shot ? [] : [{ name: `bug${h}`, place: `translate(${f.x} ${f.y}) rotate(${f.turn})`, href: t.bug.pictures[m] }]);
    }), i = _(() => t.slush.filter((m) => !m.flying).map((m, f) => ({ ...m, name: `splash${f}` }))), c = _(() => t.slush.filter((m) => m.flying).map((m, f) => ({ ...m, name: `slush${f}` }))), u = _(() => ({ x: -t.bug.at.x, y: -t.bug.at.y, width: t.bug.width, height: t.bug.height })), p = _(() => t.camera.flatMap((m, f) => xi(m.seconds, t.size, m.from, { x: t.middle, y: t.size * 0.5 }).map((h, k) => ({ ...h, name: `drop${f}-${k}` }))));
    return (m, f) => (b(), w(I, null, [
      (b(!0), w(I, null, H(s.value, (h) => (b(), w("g", {
        key: h.name,
        transform: h.place
      }, [
        A("image", {
          href: h.href,
          x: u.value.x,
          y: u.value.y,
          width: u.value.width,
          height: u.value.height,
          "data-act-bug": ""
        }, null, 8, mp)
      ], 8, hp))), 128)),
      A("defs", null, [
        (b(!0), w(I, null, H(i.value, (h) => (b(), w(I, {
          key: h.name
        }, [
          h.clip ? (b(), w("clipPath", {
            key: 0,
            id: `${j(r)}-${h.name}`
          }, [
            A("rect", {
              x: h.clip.left,
              y: h.clip.top,
              width: h.clip.right - h.clip.left,
              height: h.clip.bottom - h.clip.top
            }, null, 8, yp)
          ], 8, gp)) : P("", !0)
        ], 64))), 128))
      ]),
      (b(!0), w(I, null, H(i.value, (h) => (b(), w("g", {
        key: h.name,
        "clip-path": h.clip ? `url(#${j(r)}-${h.name})` : null,
        "data-act-surface": h.on === "surface" ? "" : null
      }, [
        h.run > 0 ? (b(), w(I, { key: 0 }, [
          A("rect", {
            x: h.x - h.r * 0.22,
            y: h.y,
            width: h.r * 0.44,
            height: h.run,
            rx: h.r * 0.2,
            fill: Ot,
            stroke: "none",
            opacity: h.opacity * 0.75,
            "data-act-run": ""
          }, null, 8, bp),
          A("circle", {
            cx: h.x,
            cy: h.y + h.run,
            r: h.r * 0.4,
            fill: Ot,
            stroke: da,
            "stroke-width": "0.5",
            opacity: h.opacity * 0.9
          }, null, 8, xp)
        ], 64)) : P("", !0),
        A("ellipse", {
          cx: h.x,
          cy: h.y,
          rx: h.r * (h.on === "floor" || h.on === "top" ? 1.4 : 0.7),
          ry: h.r * (h.on === "floor" || h.on === "top" ? 0.7 : 1.4),
          fill: Ot,
          stroke: da,
          "stroke-width": "0.5",
          opacity: h.opacity * 0.9,
          "data-act-splash": ""
        }, null, 8, wp)
      ], 8, vp))), 128)),
      (b(!0), w(I, null, H(c.value, (h) => (b(), w("circle", {
        key: h.name,
        cx: h.x,
        cy: h.y,
        r: h.r,
        fill: Ot,
        stroke: da,
        "stroke-width": "0.5",
        "data-act-slush": ""
      }, null, 8, kp))), 128)),
      (b(!0), w(I, null, H(p.value, (h) => (b(), w("g", {
        key: h.name,
        class: "figure-act-lens",
        opacity: h.fade
      }, [
        h.landed ? (b(), w(I, { key: 0 }, [
          A("rect", {
            x: h.x - h.r * 0.25,
            y: h.y,
            width: h.r * 0.5,
            height: h.run,
            rx: "2",
            fill: "#9bd34a",
            opacity: "0.8"
          }, null, 8, _p),
          A("circle", {
            cx: h.x,
            cy: h.y + h.run,
            r: h.r * 0.4,
            fill: "#9bd34a"
          }, null, 8, Mp)
        ], 64)) : P("", !0),
        A("circle", {
          cx: h.x,
          cy: h.y,
          r: h.r,
          fill: Ot,
          opacity: "0.85",
          "data-act-lens": ""
        }, null, 8, Sp),
        A("circle", {
          cx: h.x - h.r * 0.3,
          cy: h.y - h.r * 0.3,
          r: h.r * 0.25,
          fill: "#e8ffd0",
          opacity: "0.8"
        }, null, 8, Ap)
      ], 8, $p))), 128))
    ], 64));
  }
}, Ep = /* @__PURE__ */ Ge(Op, [["__scopeId", "data-v-096d87ce"]]), Np = ["width", "height", "viewBox", "data-act"], Fp = ["stroke"], Bp = {
  __name: "FigureAct",
  props: {
    name: { type: String, required: !0 },
    u: { type: Number, required: !0 },
    hand: { type: Object, required: !0 },
    head: { type: Object, required: !0 },
    feet: { type: Number, required: !0 },
    size: { type: Number, required: !0 },
    room: { type: Object, required: !0 },
    ball: { type: Object, default: null },
    canopy: { type: Object, default: null },
    bug: { type: Object, default: null },
    wallBugs: { type: Array, default: () => [] },
    slush: { type: Array, default: () => [] },
    camera: { type: Array, default: () => [] }
  },
  setup(e) {
    const t = e, a = (f) => f * t.size, r = _(() => ({ x: a(t.hand.x), y: a(t.hand.y) })), s = _(() => ({ x: a(t.hand.other.x), y: a(t.hand.other.y) })), i = _(() => ({ x: a(t.head.x), y: a(t.head.y) })), c = _(() => a(t.feet)), u = _(() => a(0.5)), p = _(() => t.hand.out), m = _(() => !!V[t.name].pulse);
    return (f, h) => (b(), w("svg", {
      class: "figure-act",
      width: e.size,
      height: e.size,
      viewBox: `0 0 ${e.size} ${e.size}`,
      "aria-hidden": "true",
      "data-act": e.name
    }, [
      A("g", {
        stroke: j(W).ink,
        "stroke-width": "1",
        "stroke-linejoin": "round"
      }, [
        e.name === "ask_sign" ? (b(), ne(nf, {
          key: 0,
          u: e.u,
          hand: r.value
        }, null, 8, ["u", "hand"])) : P("", !0),
        m.value ? (b(), ne(ap, {
          key: 1,
          name: e.name,
          u: e.u,
          head: i.value,
          out: p.value,
          size: e.size
        }, null, 8, ["name", "u", "head", "out", "size"])) : P("", !0),
        e.name === "file_card" ? (b(), ne(wf, {
          key: 2,
          u: e.u,
          hand: r.value,
          middle: u.value,
          floor: c.value,
          out: p.value,
          size: e.size
        }, null, 8, ["u", "hand", "middle", "floor", "out", "size"])) : P("", !0),
        e.name === "hand_rub" ? (b(), ne(Af, {
          key: 3,
          u: e.u,
          hand: r.value
        }, null, 8, ["u", "hand"])) : P("", !0),
        e.name === "fume" ? (b(), ne($f, {
          key: 4,
          u: e.u,
          head: i.value
        }, null, 8, ["u", "head"])) : P("", !0),
        e.name === "bug_shot" && e.bug ? (b(), ne(Ep, {
          key: 5,
          u: e.u,
          middle: u.value,
          size: e.size,
          bug: e.bug,
          bugs: e.wallBugs,
          slush: e.slush,
          camera: e.camera
        }, null, 8, ["u", "middle", "size", "bug", "bugs", "slush", "camera"])) : P("", !0),
        e.name === "disco" && e.ball ? (b(), ne(ff, {
          key: 6,
          u: e.u,
          middle: u.value,
          floor: c.value,
          size: e.size,
          ball: e.ball
        }, null, 8, ["u", "middle", "floor", "size", "ball"])) : P("", !0),
        e.name === "pogo" ? (b(), ne(Kf, {
          key: 7,
          u: e.u,
          middle: u.value,
          floor: c.value,
          size: e.size
        }, null, 8, ["u", "middle", "floor", "size"])) : P("", !0),
        e.name === "chute" && e.canopy ? (b(), ne(Pf, {
          key: 8,
          u: e.u,
          head: i.value,
          hand: r.value,
          other: s.value,
          size: e.size,
          canopy: e.canopy
        }, null, 8, ["u", "head", "hand", "other", "size", "canopy"])) : P("", !0),
        e.name === "pack_box" ? (b(), ne(Rf, {
          key: 9,
          u: e.u,
          middle: u.value,
          floor: c.value
        }, null, 8, ["u", "middle", "floor"])) : P("", !0),
        e.name === "press" ? (b(), ne(Xf, {
          key: 10,
          u: e.u,
          middle: u.value,
          size: e.size
        }, null, 8, ["u", "middle", "size"])) : P("", !0),
        e.name === "vacuum" ? (b(), ne(pp, {
          key: 11,
          u: e.u,
          hand: r.value,
          middle: u.value,
          floor: c.value,
          out: p.value,
          size: e.size
        }, null, 8, ["u", "hand", "middle", "floor", "out", "size"])) : P("", !0)
      ], 8, Fp)
    ], 8, Np));
  }
}, Tp = /* @__PURE__ */ Ge(Bp, [["__scopeId", "data-v-4755d5ba"]]), Lp = 1440 * 60;
class vl extends Map {
  constructor(t, a) {
    super(), this.key = t;
    const r = wi(t, {});
    for (const [s, i] of Object.entries(r && typeof r == "object" ? r : {}))
      Number.isFinite(i) && a - i < Lp && super.set(s, i);
  }
  set(t, a) {
    return super.set(t, a), ki(this.key, Object.fromEntries(this)), this;
  }
}
const zp = ["width"], Ip = ["href", "x", "y", "width", "height", "opacity", "transform"], Rp = ["transform", "opacity"], Ye = 48, Cp = {
  __name: "FixedRunBug",
  props: {
    bug: { type: Object, required: !0 },
    at: { type: Object, required: !0 }
  },
  setup(e) {
    const t = e, a = _(() => {
      const c = (t.at.edge ?? t.at.y) - Ye, u = t.at.edge ?? t.at.y + Ye;
      return { left: `${t.at.x - Ye}px`, top: `${c}px`, width: `${2 * Ye}px`, height: `${u - c}px` };
    }), r = _(() => ({ x: Ye, y: t.at.y - (t.at.edge ?? t.at.y) + Ye })), s = _(() => ({ href: t.bug.pictures[t.at.step], x: -t.bug.at.x, y: -t.bug.at.y, width: t.bug.width, height: t.bug.height })), i = _(() => t.at.flat > 0 ? t.at.shows : 0);
    return (c, u) => (b(), w("div", {
      class: "fixed-run-bug",
      style: ae(a.value),
      "aria-hidden": "true",
      "data-act-bug-box": ""
    }, [
      (b(), w("svg", {
        width: 2 * Ye,
        height: "100%"
      }, [
        e.at.whole || e.at.flat ? (b(), w("image", {
          key: 0,
          href: s.value.href,
          x: s.value.x,
          y: s.value.y,
          width: s.value.width,
          height: s.value.height,
          opacity: e.at.shows,
          transform: `translate(${r.value.x} ${r.value.y}) rotate(${(e.at.way > 0 ? -1 : 1) * e.at.turn}) scale(${(e.at.way > 0 ? -1 : 1) * (1 + 0.4 * e.at.flat)} ${1 - 0.78 * e.at.flat})`,
          "data-act-bug": ""
        }, null, 8, Ip)) : P("", !0),
        i.value ? (b(), w("path", {
          key: 1,
          transform: `translate(${r.value.x} ${r.value.y}) scale(${1.3 - 0.3 * i.value})`,
          opacity: i.value,
          d: "M-9 0q2-6 6-3 1-6 5-2 5-3 5 2 5 1 2 4 3 4-3 3-4 4-7 1-3 0-6-1-6-4-4-3Z",
          fill: "#9bd34a",
          stroke: "#5f8f24",
          "stroke-width": "0.8"
        }, null, 8, Rp)) : P("", !0)
      ], 8, zp))
    ], 4));
  }
}, qp = /* @__PURE__ */ Ge(Cp, [["__scopeId", "data-v-6050b099"]]), fa = { waits: [3, 10], seconds: [3, 5], rests: [60, 150] }, fn = Object.freeze({ picture: null, until: 0, next: 0 }), pa = ([e, t], a) => e + (t - e) * a();
function Dp(e, t, a, r) {
  return e.picture ? a < e.until && t.includes(e.picture) ? e : { ...fn, next: a + pa(fa.rests, r) } : t.length ? e.next ? a < e.next ? e : { picture: t[0], until: a + pa(fa.seconds, r), next: 0 } : { ...fn, next: a + pa(fa.waits, r) } : e.next > a ? e : fn;
}
const bl = (e) => ({ ...Et(e), mood: "admiring", behind: !0, faces: !0 }), ye = { turns: 3, within: 1500, least: 6, lingers: 500, reach: 40, prolonged: 2e3, ticklish: 3e3 }, Pp = (e, t, a) => t >= e.left - ye.reach && t <= e.right + ye.reach && a >= e.top - ye.reach && a <= e.bottom + ye.reach, xl = Object.freeze({ x: 0, way: 0, turns: [], at: -1 / 0, firstTurnAt: null, ticklishUntil: -1 / 0 });
function jp(e, t, a) {
  const r = Gp(e, t, a);
  return { ...r, ticklishUntil: Ql(e, a) || Jl(r, a) ? a + ye.ticklish : e.ticklishUntil };
}
function Gp(e, t, a) {
  if (e.at === -1 / 0) return { x: t, way: 0, turns: [], at: a, firstTurnAt: null };
  const r = a - e.at <= ye.lingers ? e.firstTurnAt : null;
  if (Math.abs(t - e.x) < ye.least) return { ...e, at: a, firstTurnAt: r };
  const s = Math.sign(t - e.x), i = e.way !== 0 && s !== e.way, c = [...e.turns.filter((u) => a - u <= ye.within), ...i ? [a] : []];
  return { x: t, way: s, turns: c, at: a, firstTurnAt: i ? r ?? a : r };
}
const Ql = (e, t) => t <= e.ticklishUntil, Jl = (e, t) => e.turns.filter((a) => t - a <= ye.within).length >= ye.turns && e.firstTurnAt !== null && t - e.firstTurnAt >= ye.prolonged, wl = (e, t) => t - e.at <= ye.lingers && (Ql(e, t) || Jl(e, t)), Nt = { most: 5, hold: [6, 22], ease: 1.8 }, Up = Object.freeze({ from: 0, to: 0, began: 0, until: 0 });
function Hp(e, t, a) {
  if (t < e.until) return e;
  const s = a() < 0.25 ? 0 : (a() < 0.5 ? -1 : 1) * Nt.most * (0.4 + 0.6 * a()), i = Math.abs(s - e.to) < 1 ? -s || Nt.most * 0.6 : s, [c, u] = Nt.hold;
  return { from: es(e, t), to: i, began: t, until: t + Nt.ease + c + a() * (u - c) };
}
function es(e, t) {
  const a = Math.min(Math.max((t - e.began) / Nt.ease, 0), 1);
  return e.from + (e.to - e.from) * a * a * (3 - 2 * a);
}
const Wp = (e) => e.here && !e.leaving, Kp = 9.81, ts = 1.5, Yp = 0.3, ns = ts * Yp, ha = Math.sqrt(Kp / ns), Vp = 0.08, Xp = 0.025, Zp = 0.8, Qp = 1 / 30, ma = Object.freeze({ angle: 0, speed: 0 });
function kl({ angle: e, speed: t }, a, r, s, i) {
  const c = Math.min(Math.max(a, 0), Qp), u = e + s / i * ts / ns, p = Xp * Math.sin(ha * r / 2), m = -(ha ** 2) * (Math.sin(u) - p) - 2 * Vp * ha * t, f = t + m * c;
  return { angle: u + f * c, speed: f };
}
const Jp = (e) => ({ angle: 0, speed: -e * Zp }), Me = { watch: 15, along: 0.3, glance: [1, 2], between: [6, 14], act: [8, 14], jump: 0.15, near: 0.9 }, $l = ["ledge_sit", "pocket_watch", "doze"];
function _l(e, t) {
  return !e || e.ended ? null : t - e.began < Me.watch ? "watch" : "sit";
}
const eh = (e, t) => hn(Me.along, e, t);
function th(e, t, a, r) {
  if (!t) return null;
  if (t === "watch") return { watches: !0, seated: !1, until: a };
  if (e != null && e.seated && a < e.until) return e;
  const s = !!(e != null && e.seated) && !e.watches, [i, c] = s ? Me.glance : Me.between;
  return { watches: s, seated: !0, until: a + i + r() * (c - i) };
}
function nh(e, t, a) {
  if (e && t < e.until) return e;
  const r = $l.filter((i) => i !== (e == null ? void 0 : e.clip));
  return { clip: e ? r[Math.floor(a() * r.length)] : $l[0], until: t + Me.act[0] + a() * (Me.act[1] - Me.act[0]) };
}
const ah = (e, t) => e !== null && (t - e >= Me.jump || e < Me.near && t >= Me.near), et = { attachment: 10, said: 9, pointer: 8, run: 7, carrier: 6, confession: 6, reading: 5, message: 4, typing: 3.5, work: 3, typing_pause: 1.75, picture: 2, bar: 2, glance: 1 }, as = { free: 1, gestures: 3, holds: 30, alone: 1 / 0 }, oh = 2, lh = 2, sh = (e) => {
  var t;
  return Number(((t = /\/files\/message\/(\d+)\//.exec(e)) == null ? void 0 : t[1]) ?? 0);
}, rh = 4, ih = 6, uh = 2;
function ch(e, t) {
  const a = t - e;
  return !e || a > ih ? null : a <= uh ? "typing" : "typing_pause";
}
const dh = /* @__PURE__ */ new Set(["attachment", "said", "run", "confession", "reading", "message", "typing", "typing_pause", "picture", "bar"]), fh = (e, t) => e.head === as.alone ? [] : t.map((a) => dh.has(a.kind) ? { ...a, point: { ...a.point, behind: !0 } } : a);
function ph(e, t, a) {
  return !e.amount || !e.point ? null : { ...e.point, ...Number.isFinite(e.point.readingCenter) ? { readingCenter: (e.point.readingCenter - t.x) / a } : {}, x: (e.point.x - t.x) / a, y: (e.point.y - t.y) / a, amount: e.amount, behind: !!e.point.behind, faces: !!e.point.faces, mood: e.point.mood ?? "" };
}
const hh = (e) => e.head >= as.holds, mh = (e, t) => e ? et[e.kind] / (et[e.kind] + t.head) : 0;
function gh(e, t, a) {
  const r = !!(e != null && e.look) && !t.some((f) => f.key === e.look.key) && a - e.seen < lh, s = r ? [...t, e.look] : t;
  if (!s.length) return { look: null, challenger: "", since: a, seen: a };
  const i = (e == null ? void 0 : e.look) && s.find((f) => f.key === e.look.key), c = (f) => r && f === i ? e.seen : a, u = Math.max(...s.map((f) => et[f.kind])), p = i && et[i.kind] === u ? i : s.find((f) => et[f.kind] === u);
  if (!i || i === p || os(p)) return { look: p, challenger: "", since: a, seen: c(p) };
  const m = e.challenger === p.key ? e.since : a;
  return a - m >= oh ? { look: p, challenger: "", since: a, seen: a } : { look: i, challenger: p.key, since: m, seen: c(i) };
}
const zt = { glance: 1.2, rest: 2.5, halt: 1.5, purpose: 6 };
function yh(e, t, a, r, s) {
  const i = !!t && (t.point.x - r.x) * a >= 0;
  return e && s < e.since + zt.glance + zt.rest ? { look: i && s < e.since + zt.glance ? t : null, glancing: e } : i ? { look: t, glancing: { since: s } } : { look: null, glancing: e };
}
const os = (e) => (e == null ? void 0 : e.kind) === "said", vh = (e) => e() < et.said / (et.said + zt.purpose), bh = { every: [6, 14], lasts: 1.6, aside: 0.9, up: 0.12, sides: [-1, 1] }, xh = { every: [4, 10], lasts: 2.4, aside: 0.2, up: 0.04, sides: [-1, 0, 1] };
function wh(e, t, a, r) {
  return e && t < e.at + e.kind.lasts ? e : { at: t + r.every[0] + a() * (r.every[1] - r.every[0]), side: r.sides[Math.floor(a() * r.sides.length)], kind: r };
}
function kh(e, t, a, r) {
  return !e || t < e.at || t >= e.at + e.kind.lasts ? null : { x: a.x + e.side * e.kind.aside * r, y: a.y - e.kind.up * r };
}
const $h = [[/\b\w*test\w*\b/i, "testing"], [/\bbuild\b/i, "building"], [/\b(grep|rg|find)\b|journal search/i, "searching"]], _h = (e) => {
  var t;
  return ((t = $h.find(([a]) => a.test(e))) == null ? void 0 : t[1]) ?? "running";
};
function Mh(e, t, a, { thinking: r = !1, waitingFor: s = "", waitingSince: i = 0, compacting: c = !1 } = {}) {
  if (c) return "compacting";
  const [u, ...p] = e.trim().split(/\s+/);
  if (u) return u === "Bash" ? _h(p.join(" ")) : $i[u] ?? "running";
  if (r) return "thinking";
  const m = t && a - t >= _i;
  return i ? "asking" : s ? m ? "asleep" : "waiting" : m ? "asleep" : "idle";
}
const Ml = { user: "user", comment: "user", agent: "agent" }, Sh = (e) => e.filter((t) => Ml[t.type] && !t.local).map((t) => ({ ...t, table: "message", author: Ml[t.type] })), Ah = ["data-walking", "data-hopping", "data-trip", "data-clip", "data-beats"], Oh = ["data-voice", "data-failure"], S = 112, ga = 1e3, Sl = 30, Al = 3, Ol = 3, Eh = 0.1, Nh = 25, Fh = 1500, Bh = 45, El = 0.3, Nl = "figure-demo", Th = {
  __name: "VoiceFigure",
  props: {
    voice: { type: String, required: !0 },
    running: { type: String, default: "" },
    heardAt: { type: Number, default: 0 },
    thinking: { type: Boolean, default: !1 },
    waitingFor: { type: String, default: "" },
    marks: { type: Array, default: () => [] },
    messages: { type: Array, default: () => [] },
    faces: { type: Array, default: () => [] },
    here: { type: Boolean, default: !0 }
  },
  emits: ["gone"],
  setup(e, { emit: t }) {
    var Fo;
    const a = { next: 0 };
    function r() {
      const n = performance.now();
      a.next || (a.next = n + yl(Math.random));
      const l = Wd(n - a.next);
      return n >= a.next + ge.close + ge.open && (a.next = n + yl(Math.random)), l;
    }
    const s = e, i = t, c = ((Fo = Wr(Mi, null)) == null ? void 0 : Fo.environment) ?? "", u = D(null), p = _(() => s.voice), m = D(""), f = _(() => Si(s.marks)), h = _(() => Sh(s.messages)), k = _(() => f.value.filter((n) => n.type === "questions.question" && n.active).length), E = _(() => ({ question: k.value, waiting: 0, suggestion: 0 }));
    let x = null, F = [], L = 0, G = 0, se = fn;
    const M = D(Date.now() / 1e3), Fe = D(0), J = D(0), { body: o, start: ht, stop: Ue } = Gc(() => Ns()), R = D([]);
    let yn = null;
    const Se = { reacted: new vl(`journal.figure.cooldowns.${c}`, Date.now() / 1e3), tally: { plain: 0, last: "" } }, ls = new vl(`journal.figure.pastimes.${c}`, Date.now() / 1e3), Na = /* @__PURE__ */ new Map(), Fa = /* @__PURE__ */ new Map();
    let Be = null;
    const Pt = D(null), vn = D(null), Ba = D(null), jt = D(null), Ta = /* @__PURE__ */ new Set();
    let Gt = Date.now() / 1e3;
    const bn = Gt;
    let $ = { name: "", started: 0, shown: null, index: 0, closing: null }, Te = !1;
    const mt = D(null), La = D(0);
    let re = "stand";
    const za = D(!1), ss = _(() => {
      var n;
      return !!((n = o.trip) != null && n.moves && o.trip.hopping);
    }), rs = _(() => o.trip ? o.trip.started ? "walking" : "waiting to set off" : o.arriving ? "arriving" : ""), Ae = _(() => ({ data: { cards: f.value, person_at: Math.max(0, ...h.value.filter((n) => n.author === "user").map(Mt)) } })), xn = _(() => ({ state: Mh(s.running, s.heardAt, M.value, { thinking: s.thinking, waitingFor: s.waitingFor, waitingSince: Fe.value, compacting: f.value.some((n) => n.type === "memories.compaction" && n.active) }), since: s.heardAt || M.value })), wn = D(null), ie = _(() => Ai(xn.value, wn.value, M.value));
    let X = { where: "rest", until: 0 }, kn = { until: 0 }, Ia = [], $n = !1, Ra = 0, Ca = 0, qa = 0;
    const Y = D([]);
    let is = 0, Ut = 0, _n = { frames: 1, lands: 0 }, Ht = { started: 0, landed: 0 };
    const Mn = D([]), Wt = D(0), Sn = D(null), An = D(0), Le = D({ x: 0.5, y: 0.3 }), Da = D({ x: 0.75, y: 0.6, out: 1, other: { x: 0.25, y: 0.6 } });
    let K = null;
    const Kt = D(null);
    let z = null, Oe = { state: "", clip: "" }, Yt = null, On = null, Pa = null;
    const gt = (n) => F.find((l) => l.name === n) || F.find((l) => l.name === "idle"), ja = (n) => F.some((l) => l.name === n), Ga = (n, l) => gt(n).postures.includes(l), En = (n) => ja(n) && Ga(n, o.place.posture), q = () => ({ size: S, below: J.value });
    function us() {
      const n = Y.value.find((d) => d.state === "built");
      if (n) return Ua(n) ? "push" : "idle";
      const l = Y.value.find((d) => d.state === "building");
      return l ? Ju(l, performance.now()) ? "inspect" : "work" : qe ? o.place.stays ? "work" : "idle" : dl(ie.value.state) ? "idle" : Ha();
    }
    const Ua = (n) => sc(ke(n), He()) && (!o.trip || o.trip.way === Math.sign(ke(n) - He()));
    function cs() {
      const n = Y.value.find((l) => l.state === "built");
      return !n || !Ua(n) ? 0 : ke(n) > He() ? 90 : 270;
    }
    const Nn = () => Bt(ie.value.state) === "sleep";
    function Ha() {
      var l;
      const { state: n } = ie.value;
      return Oe.state !== n && (Oe = { state: n, clip: lc(Bt(n), Math.random, En, { memory: Se.reacted, now: M.value, home: ((l = o.footing) == null ? void 0 : l.id) === "home", bubble: !!nn() }) }, Oe.clip === "rummage" && (X = { where: "rummage", until: M.value + Nh, way: x.reachWay(yd(o.place.x, me())) })), o.place.swings ? "rope_swing" : o.place.lean && ["idle", "waiting"].includes(Bt(n)) ? "lean" : Us() ? (On = nh(On, M.value, Math.random)).clip : Oe.clip === "rummage" && (X.where !== "rummage" || o.trip) || Oe.clip === "search" && !o.trip && !En("search") || Oe.clip === "glass_bubble" && (o.trip || !nn()) ? "idle" : o.place.leans ? ds[Oe.clip] ?? Oe.clip : Oe.clip;
    }
    const ds = { idle: "ledge_sit" }, fs = (n) => n.clip === "bug_shot" ? Zu(0, n.bugs.length).stretch : null;
    function Wa() {
      var N, C, U, ce, xe, $e, _e;
      if (O) return { clip: gt(O.phase === "scoot" ? "newest_scoot" : "idle"), facing: O.face };
      (!((N = o.trip) != null && N.moves) || o.trip.hopping) && (R.value = R.value.filter((Pe) => Pe.clip !== "stumble"));
      const n = el(R.value, xt()), l = (Pe) => Bd(gt(Pe), o.place.posture, at, M.value), d = ((U = (C = n == null ? void 0 : n.bugs) == null ? void 0 : C[0]) == null ? void 0 : U.wall) === "left" ? 270 : ((xe = (ce = n == null ? void 0 : n.bugs) == null ? void 0 : ce[0]) == null ? void 0 : xe.wall) === "right" ? 90 : 180, g = n && l(n.clip) && { clip: n.clip, facing: n.clip === "bug_shot" ? d : Mu(n.card, o.at.x + S / 2), onto: n.onto || n.approaching, holds: n.holds, stretch: fs(n) }, v = {
        mode: Su(o),
        leaving: o.leaving,
        arriving: o.arriving,
        trip: o.trip,
        landing: o.landing,
        place: o.airborne ? { ...o.place, posture: o.airborne.posture, face: o.airborne.face ?? 0 } : o.place,
        beat: g,
        state: ie.value.state,
        doing: us(),
        doingFacing: cs(),
        flying: Kt.value,
        eager: !!(z != null && z.on),
        chute: !!(($e = o.airborne) != null && $e.chute),
        grabbed: pl(o.airborne),
        composeFacing: ps(),
        readingFacing: $r()
      }, y = Au(v, Ga), B = o.airborne || o.landing || o.arriving || o.leaving || (_e = o.trip) != null && _e.started || Kt.value || z != null && z.on || l(y.clip) ? y : { clip: o.place.leans ? "ledge_sit" : "idle", facing: o.place.face ?? 0 };
      return { ...B, clip: gt(B.clip) };
    }
    function ps() {
      var l;
      const n = (l = sa()) == null ? void 0 : l.getBoundingClientRect();
      return n ? n.left + n.width / 2 >= o.at.x + S / 2 ? Sl : -Sl : 0;
    }
    const Fn = (n) => `${n.clip.name}/${n.facing}`, hs = (n) => n.clip.fps * (n.pace ?? 1), Bn = (n) => (performance.now() - $.started) / 1e3 * hs(n), Tn = (n) => Lu(Bn(n), n.stretch), ze = (n) => Math.floor(Tn(n)), Ln = () => !$.shown || ($.closing !== null ? ze($.shown) >= $.closing + $.shown.clip.outro : Eu($.shown.clip, ze($.shown), $.index)), zn = (n, l = null) => Ou(n, (performance.now() - $.started) / 1e3, l);
    function ms(n = !1) {
      return xc(Math.abs(o.at.x - o.walk.from.x), q().size, n);
    }
    let In = Up;
    function te() {
      var sn, it, he, _t, ut, ct, we, Bo, To, Lo, zo, Io;
      if (cancelAnimationFrame(L), !x || document.hidden || (Is(), Ws())) return;
      if ($.shown && cc($.shown, ze($.shown))) return $s($.shown);
      const n = Wa();
      if (n.clip.name === "bug_shot" && ys()) return;
      (sn = $.shown) != null && sn.clip.outro && n.clip.name !== $.shown.clip.name && $.closing === null && ($.closing = dc($.shown.clip, ze($.shown))), $.closing !== null && n.clip.name === $.shown.clip.name && ze($.shown) < $.closing && ($.closing = null);
      const l = !!(n.startsLeg && ((it = o.trip) != null && it.pressing) && $.shown && !$.shown.clip.interruptible && $.name !== Fn(n)) && zn($.shown, o.trip);
      l && $.shown.once && !$.shown.arrival && !$.shown.departure && !$.shown.landed && (R.value = R.value.slice(1));
      const d = Te || pl(o.airborne) && ((he = $.shown) == null ? void 0 : he.clip.name) !== n.clip.name || Ln() || l || n.clip.cuts && ((_t = $.shown) == null ? void 0 : _t.clip.name) !== n.clip.name && zn($.shown);
      Te = !1;
      const g = nu(n, $.shown, d), v = (Fn(n) === $.name || g) && $.closing === null, y = g ? { ...n, facing: $.shown.facing } : v || d ? n : $.shown, B = Fn(y);
      if ($.name !== B || $.closing !== null && d) {
        const Gr = y.clip.intro && ((ut = $.shown) == null ? void 0 : ut.clip.name) === y.clip.name && $.closing === null;
        $ = { name: B, started: Gr ? $.started : performance.now(), shown: y, index: 0, closing: null };
      } else $.shown = au($.shown, y);
      mt.value = y.clip;
      const N = ze(y);
      $.index = N;
      const C = Ko(y, ((ct = o.airborne) == null ? void 0 : ct.posture) ?? (o.trip ? Yo[o.place.posture].travels : o.place.posture), (we = o.trip) == null ? void 0 : we.moves);
      Ms({ posture: C, facing: O ? O.face : la.has(C) ? Vo(y.clip, o.place.face) : y.facing }), gs(y), vs(y), y === n && n.startsLeg && !o.trip.moves && Xa(), re = Q.posture, !((Bo = o.trip) != null && Bo.departed) && !o.airborne && !K && Vt();
      const U = ou(yn, y.facing, performance.now() / 1e3);
      Be = lu(Be, _r(y), performance.now() / 1e3);
      const ce = y.clip.name === "disco" ? su(ze(y) / y.clip.frames, V.disco.beats) : ru(Be, performance.now() / 1e3, Nn());
      Pt.value = ce && { colour: ce.colour, strength: iu.halo * ce.glow * ce.open }, yn = U.looking;
      const xe = y.clip.name === "run", $e = re === "walk" || y.clip.name === "walk" || xe ? ms(xe) : null;
      za.value = $e !== null, Wt.value = (O == null ? void 0 : O.phase) === "scoot" ? Math.min((performance.now() - O.began) / (St.seconds * 1e3), 1) * (St.frames - 1) : uu(y.clip, Tn(y), $.closing), Sn.value = Q.turning ? gt("idle") : y.clip, An.value = Q.turning ? 0 : Wt.value;
      const _e = performance.now() / 1e3;
      In = Hp(In, _e, Math.random);
      const Pe = _s(y, _e);
      x.show(Sn.value, An.value, Pe, {
        posture: re,
        eyes: (O == null ? void 0 : O.phase) === "notice" ? null : U.eyes,
        stride: (O == null ? void 0 : O.phase) === "scoot" ? Math.abs(O.to - O.from) / S : y.clip.name === "bug_smash" && oe.value ? oe.value.at.steps : (To = ve.value) != null && To.at.way ? -ve.value.at.steps : $e,
        walkWay: (O == null ? void 0 : O.phase) === "scoot" ? Math.sign(O.to - O.from) : y.clip.name === "bug_smash" && oe.value ? oe.value.at.way : ((Lo = ve.value) == null ? void 0 : Lo.at.way) ?? 0,
        throws: y.clip.name === "rummage" ? y.throws ?? (y.throws = cu(Math.random)) : null,
        leanWay: y.clip.name === "rummage" && X.where === "rummage" ? X.way : y.clip.name === "lean" ? ((zo = o.place.lean) == null ? void 0 : zo.way) ?? 0 : re === "composed" ? o.place.leans : 0,
        at: (O == null ? void 0 : O.phase) === "scoot" ? null : Ks() ?? Sr(y),
        target: Lr(y),
        open: r(),
        screen: (O == null ? void 0 : O.phase) === "notice" ? null : ce,
        tilt: y.clip.name === "idle" ? Math.round(es(In, _e) * 4) / 4 : 0,
        grabbed: !!((Io = o.airborne) != null && Io.held),
        airborne: !!(o.airborne || K)
      }), La.value = x.facing ?? y.facing, Le.value = x.headAt(), Da.value = x.handAt(), cr(y), qs(y), Cs(), L = requestAnimationFrame(te);
    }
    const oe = D(null);
    function gs(n) {
      var $e;
      const l = n.clip.name === "bug_smash";
      if (!l && (($e = R.value[0]) == null ? void 0 : $e.clip) !== "bug_smash") return oe.value = null;
      const d = Z().floors;
      if (!oe.value) return l && o.footing ? xs(d) : null;
      const { id: g, plan: v, bug: y, seconds: B } = oe.value, N = l ? nl(v, ze(n) / n.clip.frames, S) : oe.value.at, C = Ke(d, g), U = C ? C.left + N.bug.dx : y.x, ce = C && U >= C.left && U <= C.right ? { x: U, y: C.top } : null, xe = performance.now() / 1e3;
      oe.value = { ...oe.value, at: N, bug: Fu(y, ce, ks(y.x, y.y), xe - B), seconds: xe }, l && C && !o.airborne && ws(C, N.figure);
    }
    const ve = D(null);
    function ys() {
      var g, v;
      const n = el(R.value, xt());
      if ((n == null ? void 0 : n.clip) !== "bug_shot" || n.approaching || !((g = n.bugs) != null && g.length) || o.trip || o.airborne || o.arriving || o.landing || !o.footing || (v = $.shown) != null && v.once || !Ln() && !zn($.shown)) return !1;
      const l = Ke(Z().floors, o.footing.id);
      if (!l) return !1;
      const [d] = tl(n.bugs, me(), { x: o.place.x, y: o.at.y + Le.value.y * S, left: l.left, right: l.right }, S);
      return n.approaching = !0, Math.abs(d.to - o.place.x) < 5 ? !1 : (Zt({ ...o.place, x: d.to, posture: "stand" }, { straight: !0 }), !0);
    }
    function vs(n) {
      var B, N, C, U;
      const l = n.clip.name === "bug_shot" ? (B = R.value[0]) == null ? void 0 : B.bugs : null;
      if (!(l != null && l.length) || !o.footing) return ve.value = null;
      const d = Ke(Z().floors, ((N = ve.value) == null ? void 0 : N.id) ?? o.footing.id);
      if (!d) return ve.value = null;
      const g = Bn(n), v = ((C = ve.value) == null ? void 0 : C.plan) ?? tl(l, me(), { x: o.place.x, y: o.at.y + Le.value.y * S, left: d.left, right: d.right }, S), y = Bu(v, g, S);
      ve.value = { id: d.id, plan: v, left: ((U = ve.value) == null ? void 0 : U.left) ?? d.left, at: y }, o.airborne || bs(d.left + y.x - ve.value.left);
    }
    function bs(n) {
      if (Math.abs(n - o.place.x) < 0.3) return;
      const l = { ...o.place, x: n };
      o.footing = At(l) ?? o.footing, o.place = l;
    }
    function xs(n) {
      const l = Ke(n, o.footing.id);
      if (!l) return;
      const d = ec(o.place.x, l, S), g = nl(d, 0, S);
      oe.value = { id: o.footing.id, plan: d, at: g, bug: { x: l.left + g.bug.dx, y: l.top, speed: 0, falling: !1 }, seconds: performance.now() / 1e3 };
    }
    function ws(n, l) {
      const d = { ...o.place, x: n.left + l };
      Math.abs(d.x - o.place.x) < 0.3 || (o.footing = At(d) ?? o.footing, o.place = d);
    }
    const ks = (n, l) => Math.min(window.innerHeight + S, ...Pl(Z().floors).filter((d) => d.left <= n && n <= d.right && d.top >= l).map((d) => d.top)), Ka = _(() => {
      if (!oe.value) return null;
      const { at: n, bug: l, plan: d } = oe.value, g = l.falling ? 0 : n.bug.below, v = l.falling ? { whole: !0, flat: 0 } : {};
      return { ...n.bug, ...v, x: l.x, y: l.y + g, below: g, edge: g > 0 ? l.y : null, way: Math.sign(d.bug[1] - d.bug[0]) || -1, step: Math.floor(oe.value.seconds * 6) % 2 };
    });
    function $s(n) {
      if (n.clip.name === "tickle_swat" && wl($t, performance.now()))
        return $.started = performance.now(), te();
      if (n.departure) {
        o.leaving = !1, o.here = !1, i("gone");
        return;
      }
      return n.arrival ? o.arriving = !1 : n.landed ? o.landing = !1 : R.value = fc(R.value, n.clip.name), $ = { name: "", started: 0, shown: null, index: 0, closing: null }, n.landed && no(), te();
    }
    let Ie = null;
    function _s(n, l) {
      return O ? O.facing : (Ie = Q.posture === "sit" && !Q.turning && !n.clip.aside ? zu(Ie, Q.facing, l, Math.random) : null, Ie ? al(Ie, l) : Q.facing);
    }
    let Q = { posture: "stand", facing: 0, turning: !1 };
    function Ms(n) {
      if (Q.turning && x.blending()) return;
      const l = Nu(Q, n), d = (g) => g.posture === n.posture && g.facing === n.facing;
      Q = { ...l, turning: !d(l) || Q.turning && !d(Q) };
    }
    const Ee = (n, l) => {
      const d = It(n, q(), l);
      return { x: d.left, y: d.top };
    }, Vt = () => {
      if (o.place.posture === "hang" && re !== "hang") return;
      const n = Ee(o.place, re);
      re !== o.rested && $u(o.rested, re) ? Xt() : re !== o.rested && Ya(), o.rested = re, o.slide ? o.slide = { ...o.slide, to: n } : o.at = n;
    };
    function Ya() {
      o.slide = { from: { ...o.at }, to: { ...o.at }, began: performance.now() };
    }
    const Rn = [];
    function Xt() {
      o.slide = null, Rn.splice(0).forEach((n) => n());
    }
    function Ss() {
      const { at: n, done: l } = jc(o.slide, performance.now(), yc * 1e3);
      o.at = n, l && Xt();
    }
    async function Zt(n, { straight: l = !1, pace: d = 1, pressing: g = !1, urgent: v = !1 } = {}) {
      if (T || o.airborne || K || !Ft(n, q()) || O) return;
      if (!Jo(o.place, n, q(), { straight: l, pace: d, pressing: g })) return Es(n);
      o.trip = { to: n, straight: l, pace: d, pressing: g, urgent: v, footing: At(n), legs: [] };
      const y = o.trip;
      te(), o.slide && await new Promise((B) => Rn.push(B)), o.trip === y && As();
    }
    function As() {
      if (!o.trip || T || o.airborne || K) return;
      const { to: n, straight: l, pace: d, pressing: g, footing: v } = o.trip, y = Vu(ia(n, v, q()), Z().floors, q()), B = Un(), N = l ? { via: [], pogo: !1 } : pd(le(), q(), o.place, y, { memory: Se.reacted, now: M.value, room: B }, Math.random);
      if (!N)
        return o.trip = null, te();
      const C = Jo(o.place, y, q(), { straight: l, pace: d, pressing: g, ...N, memory: Se.reacted, now: M.value, room: B });
      if (o.way = Math.sign(y.x - o.place.x), Dn(), C)
        return o.trip = { ...o.trip, ...C, climbs: Od(C.legs) }, Va();
      o.footing = null, o.trip = null, tt(y, v), te();
    }
    function Va() {
      var g;
      const n = o.trip.legs, l = n.find((v) => v.ms > 0);
      if (!l) {
        const { to: v, footing: y, climbs: B } = o.trip, N = ia(v, y, q());
        return o.trip = null, at = Ed(!!B, (g = Z().floors.find((C) => C.id === (y == null ? void 0 : y.id))) == null ? void 0 : g.kind, performance.now() / 1e3), Math.hypot(N.x - v.x, N.y - v.y) >= 1 && Ya(), tt(N, y), Wo(Y.value) && setTimeout(be), te();
      }
      const d = n.slice(n.indexOf(l));
      o.trip = { ...o.trip, started: !0, moves: !1, hopping: !!l.hopping, clip: l.clip, facing: l.facing, legs: d }, te();
    }
    function Xa() {
      var v;
      if (!o.trip || T || o.airborne || K) return;
      const [n, ...l] = o.trip.legs, d = n.hopping || o.trip.departed ? { ...o.at } : Ee(o.place, Yo[o.place.posture].travels);
      if (Math.hypot(d.x - o.at.x, d.y - o.at.y) > 1) {
        if (o.trip.rising) return;
        o.trip = { ...o.trip, rising: !0 };
        const y = o.trip;
        return o.slide = { from: { ...o.at }, to: d, began: performance.now() }, void Rn.push(() => o.trip === y && Xa());
      }
      if (Q.turning) return;
      o.trip = { ...o.trip, moves: !0, departed: !0, legs: l }, o.footing = null;
      const g = Re(d);
      o.walk = {
        from: d,
        began: performance.now(),
        on: n.hopping ? null : ((v = $c(Z().floors, g.x, g.y, kc)) == null ? void 0 : v.id) ?? null
      }, o.leg = n;
    }
    function Os() {
      o.trip.hopping && (o.landing = !!o.trip.lands), Va();
    }
    function Es(n) {
      const l = At(n);
      l && o.footing && l.id === o.footing.id || tt(n, l);
    }
    function tt(n, l = At(n)) {
      o.place = n, o.footing = l, so = Zo(n, q());
    }
    function Ns() {
      var d, g, v, y, B, N;
      if (T && ((d = o.airborne) != null && d.held)) return Yn();
      if (K) return Ts();
      if (o.slide && !((g = o.trip) != null && g.moves) && !o.airborne && Ss(), (v = o.airborne) != null && v.held) return Yn();
      if ((y = o.airborne) != null && y.thrown) return tr();
      if (o.airborne) return Ls();
      if ((B = o.trip) != null && B.moves) {
        o.trip.hopping ? zs() : Fs(), (N = o.trip) != null && N.moves && Ec(o.leg, o.walk.began, performance.now()) && Os();
        return;
      }
      if (o.footing || (o.footing = pc(o.place)), !o.footing && hc(o.place)) return lo();
      if (!o.footing) return;
      Ds();
      const n = mc(o.footing, o.place, q());
      if (!n) return lo();
      if (n.motion === "flung") return Ps(n.speed);
      if (o.footing = n.footing, n.motion === "dropping" && performance.now() - Ja >= Fh) return yt(o.place, null);
      const l = n.spot;
      Math.hypot(l.x - o.place.x, l.y - o.place.y) <= 0.3 || (n.motion === "launched" && !o.arriving && Cn("launched"), o.trip && (o.trip = { ...o.trip, legs: ca(o.trip.legs, l.x - o.place.x, l.y - o.place.y) }), o.place = l, Vt());
    }
    const Za = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, Re = (n) => ({ x: n.x + S / 2, y: n.y + (1 - J.value) * S });
    function Fs() {
      const n = Re(ua(o.leg, o.walk.from, performance.now() - o.walk.began)), l = Oc(Z().floors, o.walk.on, n.x, n.y);
      if (l.falls) return yt({ ...n, posture: "stand" }, o.trip.to);
      (Math.abs(l.dx) > 0.3 || Math.abs(l.dy) > 0.3) && Bs(l.dx, l.dy), o.at = ua(o.leg, o.walk.from, performance.now() - o.walk.began);
    }
    function Bs(n, l) {
      const [d, g] = ca([o.walk.from, o.leg], n, l);
      o.walk = { ...o.walk, from: d }, o.leg = g, o.trip = { ...o.trip, legs: ca(o.trip.legs, n, l) };
    }
    function Qa() {
      const n = { x: o.place.x, y: o.place.y }, l = me().top, d = Oa(le(), q(), n, l);
      d && (K = { began: performance.now(), hops: qd(n, d, l), back: 0 }, o.footing = null);
    }
    function Ts() {
      const n = performance.now(), l = Dd(K.hops, n - K.began, S);
      if (Kt.value = l.gone ? null : l, !l.gone) return void (o.at = Ee({ ...l, posture: "stand" }, "stand"));
      if (K.back || (K.back = n + Pd(Math.random)), n < K.back) return;
      const d = me(), g = d.left + S / 2 + Math.random() * Math.max(d.right - d.left - S, 0);
      K = null, o.airborne = Rc(g, d.top - S / 4, Je.chute * S, n), o.at = Ee(o.airborne, "stand"), te();
    }
    let Ja = -1 / 0;
    function yt(n, l) {
      eo(Ic(n, l, Z().floors, performance.now()));
    }
    function eo(n) {
      fe.value = null, o.airborne = n, o.trip = null, Xt(), o.footing = null, o.at = Ee(o.airborne, o.airborne.posture), te();
    }
    function Ls() {
      const { airborne: n, landed: l } = Dc(o.airborne, Z().floors, performance.now(), Za());
      if (n && qc(n, me().top)) return oo();
      o.at = Ee(n ?? l.spot, (n ?? l.spot).posture), o.airborne = n, l && (to(l.spot, l.standing), l.to && Zt(l.to));
    }
    function to(n, l) {
      Ja = performance.now(), o.landing = l, Cn("dropping"), tt(n), Vt(), l || no(), te();
    }
    function no() {
      s.here || (o.leaving = !0, o.arriving = !1);
    }
    function zs() {
      const n = o.trip;
      if (n.footing && !gc(n.footing, q())) return yt({ ...Re(o.at), posture: "stand" }, null);
      const l = n.footing ? ia(n.to, n.footing, q()) : n.to, d = zc(n, o.leg, o.walk.from, l, Hl(q()));
      if (d.lost) return yt({ ...Re(o.at), posture: "stand" }, null);
      d.trip !== n && (o.trip = d.trip, o.leg = d.leg, o.walk = { ...o.walk, from: d.from }), o.at = ua(o.leg, o.walk.from, performance.now() - o.walk.began, Za());
    }
    const vt = D(""), Qt = _(() => Oi(p.value)), Cn = (n) => vt.value = n, fe = D(null);
    function Is() {
      if (!fe.value) return;
      const n = Math.min(Math.max((performance.now() - fe.value.began) / (Qt.value.ms / 2), 0), 1), l = n * n * (3 - 2 * n);
      fe.value = n === 1 ? null : { ...fe.value, angle: fe.value.from * (1 - l), scale: fe.value.scaleFrom.map((d) => d + (1 - d) * l) };
    }
    function Rs(n) {
      n.target === n.currentTarget && (vt.value === "launched" && We({ beat: "launched", time: M.value }), vt.value = "", fe.value = null);
    }
    const qn = D(0), bt = D(null), nt = D(null);
    function Cs() {
      const n = xd(o.place, o.trip);
      n !== nt.value && (nt.value = n);
    }
    function qs(n) {
      var l;
      n.clip.name === "disco" && (bt.value = il(o.place, q(), Z()), !bt.value && ((l = R.value[0]) == null ? void 0 : l.clip) === "disco" && (R.value = R.value.slice(1)));
    }
    let Jt = ma, ao = 0, en = null;
    function Ds() {
      if (o.place.posture !== "hang" || o.trip) return Dn();
      const n = performance.now() / 1e3;
      Jt = en === null ? Jp(o.way) : kl(Jt, n - ao, n, o.place.x - en, S), ao = n, en = o.place.x, qn.value = Jt.angle;
    }
    function Dn() {
      Jt = ma, en = null, qn.value = 0;
    }
    const Pn = _(() => {
      var l;
      const n = ((l = mt.value) == null ? void 0 : l.name) ?? "";
      return /^hang_[lr]$/.test(n) ? Ei(n.slice(-1), La.value, J.value) : null;
    });
    function jn() {
      O = null, X = Ld(X), $ = { name: "", started: 0, shown: null, index: 0, closing: null }, R.value = [], o.landing = !1;
    }
    function Ps(n) {
      jn(), Cn("launched"), eo(Cc({ ...Re(o.at), face: o.place.face }, n, performance.now()));
    }
    function oo() {
      o.airborne = null, K = { began: performance.now(), hops: [], back: 0 };
    }
    function lo() {
      jn();
      const n = Rt(X, q(), o.place), l = { state: ie.value.state, now: Date.now() / 1e3, near: o.place, figure: q(), cleared: kn };
      yt({ ...Re(o.at), posture: "stand" }, Xl(n, l));
    }
    const js = () => ({
      voice: p.value,
      moving: !!(o.trip || K || O),
      place: o.place,
      beats: R.value.length,
      held: !!xt(),
      room: Un(),
      arriving: o.arriving,
      leaving: o.leaving
    });
    function Gn() {
      const n = ee();
      return n.docked ? rn(n.element) : null;
    }
    const Gs = (n, l) => n === "sit" && !uo() && !l && o.place.on === ee().element ? eh(q(), o.place) : null, Us = () => _l(Gn(), M.value) === "sit" && !o.trip && o.place.posture === "sit" && o.place.on === ee().element, xt = () => fu({ box: Y.value.some((n) => n.state !== "piled") });
    function Un() {
      const n = ee();
      return xu(ie.value.state, n.docked ? rn(n.element) : null, M.value);
    }
    function be() {
      if (clearTimeout(G), T || o.airborne || K) return void (G = setTimeout(be, ga));
      M.value = Date.now() / 1e3, Fe.value = zi(E.value, Fe.value, M.value), wn.value = Ii(xn.value.state, wn.value, M.value, Math.random, Se.tally), se = Dp(se, Nn() || z != null && z.on ? [] : Ri(kt()), M.value, Math.random);
      const n = Ci(R.value, xn.value.state, on());
      R.value = qi(n.beats, on(), M.value), Te || (Te = n.cut);
      const l = _l(Gn(), M.value);
      Yt = th(Yt, l, M.value, Math.random);
      const d = Gn();
      l === "sit" && ah(Pa, d.share) && We({ beat: "progress_jump", time: M.value }), Pa = l ? d.share : null;
      const g = Math.max(Gt, M.value - Di), v = [
        ...Pi(Ae.value, g),
        ...Uo(Ae.value, Ta, Math.max(bn, g)),
        ...jo(Ae.value, Na, bn),
        ...ji(s.faces, g),
        ...Gi(h.value, g),
        ...Ui(h.value, g)
      ], y = Go(Ae.value, Fa);
      y.length && (Y.value = Y.value.map((we) => ({ ...we, lit: Hi(we, y) }))), v.length && (Gt = Math.max(Gt, ...v.map((we) => we.time))), fr(v) && ho();
      const B = Wi(o.trip, qa, M.value);
      qa = B.began, B.moment && !R.value.some((we) => we.clip === "stumble") && We(B.moment);
      const N = ee(), C = xt(), U = C ? { eager: z, moment: null } : Ki(N.docked ? rn(N.element) : null, z, Math.random, M.value);
      z = U.eager, Te || (Te = !!U.cut), We(), U.moment && We(U.moment);
      const ce = la.has(o.place.posture) && !o.trip;
      at = Fd(at, ce, Hn, M.value, Math.random), Hn = ce;
      const xe = Yi(ie.value.state, $n, Ca, M.value);
      $n = !1, Ca = xe.began, We(...v, ...Vi(xe.moments, Y.value)), Be = Xi(Nn() || R.value.some((we) => ["bug_shot", "bug_smash"].includes(we.clip)) ? [] : y, Be, performance.now() / 1e3);
      const $e = { state: ie.value.state, since: ie.value.since, lasted: M.value - ie.value.since }, _e = Wo(Y.value), Pe = Hs() || !!O, sn = Pe || !!C || _e || !!(z != null && z.on), it = o.trip ? null : il(o.place, q(), Z()), he = sn ? null : Zi({ ...js(), ball: it ? it.kind : "" }, $e, ls, M.value, Math.random, En, Se.tally);
      if ((he == null ? void 0 : he.clip) === "disco" && (bt.value = it), he != null && he.flies && Qa(), he && !he.flies && (R.value = [...R.value, he]), Pe) {
        document.hidden || (G = setTimeout(be, ga));
        return;
      }
      Ys() && !o.airborne && !o.place.stays && !Qi(R.value, on()) && Ji(o.place) && Vs(), lr(), sr();
      const _t = wd({
        state: ie.value.state,
        counts: E.value,
        stay: X,
        now: M.value,
        near: o.place,
        figure: q(),
        hands: Ia,
        cleared: kn,
        work: uo(),
        pile: or(),
        tally: Se.tally,
        memory: Se.reacted,
        room: Un()
      });
      X = _t.stay;
      const ut = Qn("user");
      os(ut) && ut.card !== mo && !pe && go() && vr(ut), br();
      const ct = pe ? null : z != null && z.on ? $d(o.place, q()) : Gs(l, _e) ?? _t.spot;
      z != null && z.urgent && ct && o.trip && !o.trip.urgent && !o.trip.moves && (o.trip = null), !o.trip && !o.arriving && !o.airborne && !K && ct && Nd(at, performance.now() / 1e3, !!(z != null && z.urgent)) && (z != null && z.urgent && (R.value = R.value.slice(0, 1)), Zt(ct, { pace: Ce || z != null && z.on ? eu : 1, pressing: Ce || _e || !!(z != null && z.urgent), urgent: !!(z != null && z.urgent) }), Ce = !1), document.hidden || (G = setTimeout(be, ga));
    }
    let O = null;
    function Hs() {
      var v;
      if (O || !x || T || o.trip || o.airborne || o.arriving || o.leaving || K || !o.footing || o.place.posture === "hang" || (v = $.shown) != null && v.once && !Ln()) return !1;
      const n = pu(), l = Ke(Z().floors, o.footing.id);
      if (!l || !n || Ft(o.place, q(), n)) return !1;
      const d = Xo(q(), o.place, l, n);
      if (!d) return !1;
      const g = performance.now() / 1e3;
      return O = { phase: "notice", began: performance.now(), button: n, spot: d, canonicalFace: o.place.face, footingFace: o.footing.face, face: Q.facing, facing: Ie ? al(Ie, g) : Q.facing }, x.easeFromCurrent(), Te = !0, !0;
    }
    function Ws() {
      if (!O) return !1;
      if (T || o.airborne || o.trip || o.leaving || K)
        return O = null, !1;
      const n = o.footing && Ke(Z().floors, o.footing.id);
      if (!n)
        return O = null, !1;
      const l = (performance.now() - O.began) / 1e3;
      if (O.phase === "notice") {
        if (l < St.notice) return !1;
        const U = Xo(q(), o.place, n);
        return U ? (X = { where: "aside", spot: U, until: M.value + dn }, Ce = !1, la.has(o.place.posture) ? (O = { ...O, phase: "scoot", began: performance.now(), from: o.place.x - n.left, to: U.x - n.left }, Te = !0, !1) : (O = null, Zt(U, { pace: 1, pressing: !0 }), !0)) : (O = null, !1);
      }
      const d = Math.min(l / St.seconds, 1), g = Xu(d), v = n.left + O.from + (O.to - O.from) * g.across;
      if (o.place = { ...o.place, x: v, y: n.top + o.footing.dy }, o.footing = { ...o.footing, dx: v - n.left }, d < 1) return !1;
      const y = O;
      O = null;
      const B = Wa(), N = Vo(B.clip, y.canonicalFace), C = _u(y, o.place, o.footing, N, performance.now() / 1e3);
      return o.place = C.place, o.footing = C.footing, Ko(B, o.place.posture, !1) === o.place.posture && (Q = C.posed, Ie = C.seatPose), X = { where: "aside", spot: { ...o.place }, until: M.value + dn }, Te = !0, !1;
    }
    function Ks() {
      if ((O == null ? void 0 : O.phase) !== "notice") return null;
      const n = Math.min((performance.now() - O.began) / (St.notice * 1e3), 1), l = (g) => {
        const v = Math.min(Math.max(g, 0), 1);
        return v * v * (3 - 2 * v);
      }, d = Et(O.button);
      return { x: (d.x - o.at.x) / S, y: (d.y - o.at.y) / S, amount: l(n / 0.3) * (1 - l((n - 0.75) / 0.25)), most: 0 };
    }
    let so = 0, Ce = !1, at = null, Hn = !1;
    function ro(n) {
      ({ stay: X, cleared: kn } = Td(X, n, Date.now() / 1e3)), Ce = !0;
    }
    const Ys = () => !o.trip && o.footing && Zo(o.place, q()) > so;
    function Vs() {
      const n = Z().floors.find((d) => d.element && d.element === o.place.on) ?? { left: ee().edge.left, right: ee().edge.left + ee().edge.width }, l = hu(q(), o.place, n);
      if (!l) return ro(It(o.place, q(), re));
      X = { where: "aside", spot: l, until: M.value + dn }, Ce = !0;
    }
    function Xs(n) {
      if (Wn) return void (Wn = !1);
      ro(n.currentTarget.parentElement.getBoundingClientRect()), be();
    }
    let T = null, Wn = !1;
    const Zs = () => !!(x && $.shown && o.here) && !T;
    function Qs(n) {
      var y, B;
      if (n.button !== 0 || n.isPrimary === !1 || !Zs()) return;
      n.preventDefault(), Wn = !0;
      const l = Js(n), { point: d } = l;
      o.at = l.at;
      const g = performance.now(), v = Re(o.at);
      T = {
        pointer: n.pointerId,
        target: n.currentTarget,
        point: d,
        caught: { ...v },
        hang: { angle: l.angle, speed: 0 },
        hangAt: g / 1e3,
        offset: { x: v.x - n.clientX, y: v.y - n.clientY },
        moves: [{ x: n.clientX, y: n.clientY, at: g / 1e3 }]
      }, er(v, d), Object.assign(o.airborne, { hang: l.angle, scale: l.scale, scaleFrom: l.scale, scaleAt: g }), (B = (y = n.currentTarget).setPointerCapture) == null || B.call(y, n.pointerId), window.addEventListener("pointermove", Kn), window.addEventListener("pointerup", ot), window.addEventListener("pointercancel", ot), window.addEventListener("blur", ot), te();
    }
    function Js(n) {
      const l = { x: n.clientX, y: n.clientY };
      if (!window.DOMMatrix) return hl(o.at, l, S);
      const d = getComputedStyle(n.currentTarget.parentElement), g = d.rotate.endsWith("rad") ? parseFloat(d.rotate) * 180 / Math.PI : parseFloat(d.rotate) || 0, v = d.scale === "none" ? [1, 1] : d.scale.split(" ").map(Number), y = Number.isFinite(v[0]) ? v[0] : 1, B = Number.isFinite(v[1]) ? v[1] : y, N = new window.DOMMatrix().rotate(g).scale(y, B).multiply(new window.DOMMatrix(d.transform === "none" ? void 0 : d.transform)), [C, U] = d.transformOrigin.split(" ").map(parseFloat);
      return hl(o.at, l, S, N, { x: C, y: U });
    }
    function er(n, l) {
      cancelAnimationFrame(ln);
      const d = x.facing ?? Q.facing;
      x.turn = null, x.drewAt = performance.now(), K = null, Kt.value = null, jn(), Object.assign(o, Ud(o, n, l)), o.place.face = o.airborne.face = d, Xt(), Dn(), X = { where: "rest", until: 0 }, at = null, Ie = null, Hn = !1, Ce = !1, z = null, On = null, Yt = null, pe = null, oe.value = null, ve.value = null, bt.value = null, nt.value = null, vt.value = "", $t = xl, na = null, Q = { posture: "stand", facing: d, turning: !1 }, Te = !1;
    }
    function Kn(n) {
      !T || n.pointerId !== T.pointer || (n.preventDefault(), T.moves = [...T.moves.slice(-19), { x: n.clientX, y: n.clientY, at: performance.now() / 1e3 }], Yn());
    }
    function Yn() {
      var B;
      if (!T || !((B = o.airborne) != null && B.held)) return;
      const n = T.moves.at(-1), l = io(), d = performance.now() / 1e3;
      T.hang = kl(T.hang ?? ma, T.hangAt ? d - T.hangAt : 0, d, n.x - (T.hangX ?? n.x), S), [T.hangAt, T.hangX] = [d, n.x];
      const g = n.x + T.offset.x, v = n.y + T.offset.y, y = T.caught;
      o.airborne = {
        ...o.airborne,
        x: Math.min(Math.max(g, Math.min(l.left, y.x)), Math.max(l.right, y.x)),
        y: Math.min(Math.max(v, Math.min(l.top, y.y)), Math.max(l.bottom, y.y)),
        hang: T.hang.angle,
        grip: T.point,
        scale: Ea(o.airborne, performance.now())
      }, o.at = Ee(o.airborne, "stand");
    }
    function Vn() {
      var n, l;
      window.removeEventListener("pointermove", Kn), window.removeEventListener("pointerup", ot), window.removeEventListener("pointercancel", ot), window.removeEventListener("blur", ot), (l = T == null ? void 0 : (n = T.target).hasPointerCapture) != null && l.call(n, T.pointer) && T.target.releasePointerCapture(T.pointer), T = null;
    }
    function ot(n) {
      if (!T || (n == null ? void 0 : n.type) !== "blur" && (n == null ? void 0 : n.pointerId) !== T.pointer) return;
      const l = performance.now(), d = n.type === "pointercancel" || n.type === "blur";
      d || Kn(n);
      const g = d ? { x: 0, y: 0 } : Gd(T.moves, l / 1e3);
      o.airborne = gl(ml(o.airborne, S), g, l), o.at = Ee(o.airborne, "stand"), Vn(), te();
    }
    function tr() {
      const n = io(), l = Z().floors.map((B) => B.id === "home" ? { ...B, left: n.left, right: n.right } : B), d = o.airborne, { airborne: g, landed: v, gone: y } = Hd(d, l, { ...n, top: me().top }, performance.now());
      if (y) return oo();
      if (o.airborne = g, v) {
        const B = ((d.spin + 180) % 360 + 360) % 360 - 180, N = d.scale ?? [1, 1];
        return fe.value = { began: performance.now(), from: B, angle: B, scaleFrom: N, scale: N }, to(v, !0);
      }
      o.at = Ee(g, "stand");
    }
    function io() {
      const n = me(), l = Ke(Z().floors, "home"), d = n.top + (1 - J.value) * S;
      return { left: n.left + S / 2, right: n.right - S / 2, top: d, bottom: Math.max(l ? l.top : n.bottom, d) };
    }
    const nr = _(() => {
      var l;
      const n = Ni(((l = o.airborne) == null ? void 0 : l.posture) ?? o.place.posture, J.value);
      return {
        left: `${n.left * 100}%`,
        width: `${(n.right - n.left) * 100}%`,
        top: `${n.top * 100}%`,
        height: `${(n.bottom - n.top) * 100}%`
      };
    }), He = () => o.at.x + S / 2, ke = (n) => dt().edge.left + n.along, lt = () => Y.value.filter((n) => n.state === "piled").length, ar = () => {
      var n;
      return (n = o.trip) != null && n.moves ? o.way : Math.sign(wt(lt()) - He()) || 1;
    }, wt = (n) => {
      const { edge: l } = dt();
      return l.left + l.width + ol(n).left;
    };
    function or() {
      const n = Y.value.filter((l) => l.state === "piled").map(ke);
      return n.length ? { left: Math.min(...n) - ft.width / 2, right: Math.max(...n) + ft.width / 2, top: dt().edge.top } : null;
    }
    function uo() {
      const n = Y.value.find((d) => d.state === "built");
      if (n) return { x: wu(ke(n), wt(lt()), o.place.x) };
      const l = Y.value.find((d) => d.state === "building");
      return l ? { x: ke(l) - Ut } : qe ? { beside: Ut, before: wt(lt() + Qo.high) - ft.width / 2, aim: Xn } : null;
    }
    let ue = null, qe = !1, co = 0, Xn = null, fo = 0;
    function lr() {
      var d, g;
      const n = Y.value.some((v) => v.state !== "piled");
      if (ue = mu(ue, gu(((g = (d = Ae.value) == null ? void 0 : d.data) == null ? void 0 : g.cards) || [], ir(), M.value), Se.reacted, M.value, Math.random), n) return;
      const l = !!(ue != null && ue.granted) && M.value >= fo;
      l && !qe && (Xn = rr(), co = M.value), qe = l && yu(vu.build, co, M.value), l && !qe && (ue = { ...ue, granted: !1 });
    }
    let Zn = null;
    function sr() {
      Zn = ue ? null : Zn ?? M.value, bu(Y.value, !!ue, Zn, M.value) && ho();
    }
    function rr() {
      const { edge: n } = dt();
      return Yu(n.left, wt(lt() + Qo.high) - ft.width, Xn, Math.random);
    }
    const ir = () => tn ?? (dl(ie.value.state) ? { card: po(), since: ie.value.since } : null);
    let tn = null;
    function ur(n) {
      var d;
      n.state = "built";
      const l = (d = $.shown) != null && d.once ? 1 : 0;
      R.value = R.value.filter((g, v) => v < l || !oc.has(g.clip)), setTimeout(be);
    }
    function cr(n) {
      var B;
      const { edge: l } = dt(), d = Y.value, g = n.clip.name === "work" && re === "stand" && o.place.stays && !o.trip;
      if (g && !d.some((N) => N.state !== "piled")) {
        const N = Math.min(Math.max(He() + Ut - l.left, ft.inside), l.width - ft.inside);
        Y.value = [...d, { id: ++is, along: N, up: 0, state: "building", ...qu(performance.now(), Math.random), blows: 0, lit: "amber", run: (ue == null ? void 0 : ue.card) || po() }];
      }
      const v = Y.value.find((N) => N.state === "building");
      v && g && dr(v, n), v && performance.now() >= v.until && ur(v);
      const y = d.find((N) => N.state === "built");
      if (y) {
        const N = wt(lt());
        (B = o.trip) != null && B.moves && (y.along = Du(ke(y), He(), N, o.way) - l.left), Math.abs(ke(y) - N) < Pu.room && (Object.assign(y, { along: N - l.left, state: "piled", up: ol(lt()).up }), qe = !1, fo = M.value + ju(Math.random));
      }
      Mn.value = Y.value.map((N) => ({ id: N.id, x: ke(N), y: l.top, up: N.up, scale: 1, opacity: 1, blows: N.blows, lit: N.lit, state: N.state }));
    }
    const po = () => {
      var n, l, d;
      return ((d = (((l = (n = Ae.value) == null ? void 0 : n.data) == null ? void 0 : l.cards) || []).filter((g) => g.process && g.active).at(-1)) == null ? void 0 : d.key) ?? "";
    };
    function dr(n, l) {
      Ht.started !== $.started && (Ht = { started: $.started, landed: 0 });
      const d = ac(Tn(l), _n.frames, _n.lands);
      n.blows += Math.max(d - Ht.landed, 0), Ht.landed = d;
    }
    const fr = (n) => n.some((l) => l.beat === "committed");
    function ho() {
      Y.value = [], Mn.value = [], qe = !1;
    }
    function pr(n) {
      var y, B;
      const l = n.clip.name === "glass_bubble" && nn(), d = nc(Y.value, qe, ke, dt().edge.top, ar()), g = ch(Ra, M.value), v = [
        ["pointer", "pointer", n.clip.name === "tickle_swat" ? na : null],
        ["run", "run", vo()],
        [`reading:${Ne == null ? void 0 : Ne.card}`, "reading", kr()],
        ["glass", "reading", l && wr(l)],
        ["attachment", "attachment", yr()],
        ["said", "said", (y = Qn("user")) == null ? void 0 : y.point],
        ["message", "message", (B = Qn("agent")) == null ? void 0 : B.point],
        ["composer", g ?? "typing", g && gr()],
        ["work", "work", d == null ? void 0 : d.at],
        ["confession", "confession", hr(n)],
        ["picture", "picture", se.picture && bl(se.picture.getBoundingClientRect())],
        ["bar", "bar", mr(n)],
        ["glance", "glance", xr()]
      ];
      return fh(n.clip, v.filter(([, , N]) => N).map(([N, C, U]) => ({ key: N, kind: C, point: U })));
    }
    function hr(n) {
      var g;
      const l = R.value[0];
      if (n.clip.name !== "repent" || (l == null ? void 0 : l.clip) !== "repent" || !l.mark) return null;
      const d = (g = document.querySelector(`[data-figure-mark="${CSS.escape(l.mark)}"]`)) == null ? void 0 : g.getBoundingClientRect();
      return d ? { ...bl(d), most: Bh } : null;
    }
    function mr(n) {
      var g;
      if (!rc(Yt, n)) return null;
      const l = ee(), d = Mr() && ((g = o.footing) != null && g.home || o.place.stays) ? ic(l.element) : null;
      return d && uc(d, { x: He(), y: o.place.y }, l.element.getBoundingClientRect(), q());
    }
    const gr = () => {
      var l;
      const n = (l = sa()) == null ? void 0 : l.getBoundingClientRect();
      return n ? Et(n) : null;
    };
    function yr() {
      const n = sh(s.running), l = n && document.querySelector(`[data-ref="message:${n}"] [data-figure-picture]`);
      return l ? Et(l.getBoundingClientRect()) : null;
    }
    function Qn(n) {
      var v;
      const d = h.value.filter((y) => y.author === n && Mt(y) > bn).reduce((y, B) => !y || Mt(B) > Mt(y) ? B : y, null);
      if (!d || M.value - Mt(d) > rh) return null;
      const g = (v = document.querySelector(`[data-figure-mark="${CSS.escape(ra(d))}"]`)) == null ? void 0 : v.getBoundingClientRect();
      return g ? { key: ra(d), kind: n === "user" ? "said" : "message", card: ra(d), box: g, point: Et(g) } : null;
    }
    let pe = null, mo = "";
    const go = () => {
      var n;
      return !!((n = o.trip) != null && n.moves && !o.trip.hopping);
    };
    function vr(n) {
      const l = Re(o.at), d = Z().floors.find((g) => g.id === o.walk.on);
      pe = { card: n.card, box: n.box, until: M.value + zt.halt }, mo = n.card, o.trip = null, tt({ x: l.x, y: l.y, face: 0, posture: "stand", on: (d == null ? void 0 : d.element) ?? ee().element });
    }
    function br() {
      !pe || M.value < pe.until || (vh(Math.random) && ka(pe.card, q()) && (X = { where: "mark", card: pe.card, until: M.value + ul }), pe = null);
    }
    let Jn = null;
    function xr() {
      return Jn = wh(Jn, M.value, Math.random, re === "sit" ? xh : bh), kh(Jn, M.value, kt(), S);
    }
    const nn = () => gd(Z(), o.place, q());
    function wr(n) {
      const l = S * 0.8, d = { left: Math.max(n.left, o.place.x - l), right: Math.min(n.right, o.place.x + l), top: n.top, bottom: n.bottom };
      return ll(d, performance.now() / 1e3);
    }
    let Ne = null;
    function yo() {
      var n;
      return !Ne || M.value >= Ne.until ? Ne = null : ((n = document.querySelector(`[data-figure-mark="${CSS.escape(Ne.card)}"]`)) == null ? void 0 : n.getBoundingClientRect()) ?? null;
    }
    function kr() {
      const n = yo();
      return n && ll(n, Date.now() / 1e3 - Ne.began);
    }
    function $r() {
      const n = (pe == null ? void 0 : pe.box) ?? yo() ?? (Ha() === "glass_bubble" ? nn() : null);
      return n && Qu(n, o.at.x + S / 2, S);
    }
    function vo() {
      var g, v;
      if (!Be || Be.at !== null) return null;
      const n = ((g = document.querySelector(`[data-figure-mark="${CSS.escape(Be.card)}"]`)) == null ? void 0 : g.getBoundingClientRect()) ?? null, l = ee(), d = l.docked ? ((v = rn(l.element)) == null ? void 0 : v.bar.getBoundingClientRect()) ?? null : null;
      return tc(n, d, kt());
    }
    function _r(n) {
      const l = vo();
      return !l || hh(n.clip) || st.amount === ta && !!st.point && Tu(st.point, l, kt());
    }
    const Mr = () => ee().docked && !o.trip;
    let st = { point: null, toward: null, amount: 0, at: 0 }, ea = null, bo = El, an = null, xo = null, ta = 0;
    function Sr(n) {
      var d;
      an = gh(an, pr(n), performance.now() / 1e3);
      const l = go() ? yh(xo, an.look, o.trip.way ?? o.way, kt(), performance.now() / 1e3) : { look: an.look, glancing: null };
      return xo = l.glancing, ta = mh(l.look, n.clip), st = Cu(st, ((d = l.look) == null ? void 0 : d.point) ?? null, { x: o.at.x + S / 2, y: o.at.y + S * bo }, performance.now(), ea && { ...ea, facing: n.facing }, ta), ph(st, o.at, S);
    }
    const kt = () => ({ x: o.at.x + S / 2, y: o.at.y + S * El }), wo = (n) => {
      var l, d;
      (d = (l = n.target).closest) != null && d.call(l, Li) && ($n = !0, Ra = Date.now() / 1e3);
    }, ko = D(null);
    let $t = xl, na = null;
    function $o(n) {
      var d;
      if (T || o.airborne || K) return;
      const l = (d = ko.value) == null ? void 0 : d.getBoundingClientRect();
      !l || !Pp(l, n.clientX, n.clientY) || ($t = jp($t, n.clientX, performance.now()), na = { x: n.clientX, y: n.clientY }, wl($t, performance.now()) && !R.value.some((g) => g.clip === "tickle_swat") && We({ beat: "tickled", time: M.value }));
    }
    const on = () => {
      var n;
      return (n = $.shown) != null && n.once && !$.shown.arrival && !$.shown.departure && !$.shown.landed ? $.shown.clip.name : "";
    }, Ar = /* @__PURE__ */ new Set(["long_walk", "tickled", "bar_failed"]);
    let _o = [];
    function We(...n) {
      const l = du(z, _o, n);
      _o = l.held, l.answer.forEach(Or);
    }
    function Or(n) {
      var d;
      const l = Gu(n, p.value, Se, M.value, Math.random, ja);
      if (l != null && l.beat && Uu(R.value, l.beat)) {
        const g = { ...l.beat, queuedAt: M.value, bugs: l.beat.clip === "bug_shot" ? Ho(Math.random) : [] };
        R.value = Ar.has(n.beat) ? Hu(R.value, g, on()) : [...R.value, g];
      }
      (d = l == null ? void 0 : l.beat) != null && d.onto && !xt() && ka(l.beat.card, q()) && (X = { where: "mark", card: l.beat.card, until: M.value + ul }, Ce = !0), l != null && l.gaze && (Ne = { card: l.gaze.card, began: M.value, until: M.value + Wu.seconds }), l != null && l.look && (yn = Ku(l.look, performance.now() / 1e3), X = zd(X, o.place));
    }
    let ln = 0;
    function aa() {
      if (cancelAnimationFrame(ln), !(T || o.airborne || K)) {
        if (!sa()) {
          ln = requestAnimationFrame(aa);
          return;
        }
        tt(je(null, q())), Vt();
      }
    }
    function Er(n) {
      if (!x && !n) return void i("gone");
      !x || T || o.airborne || n === Wp(o) || (n && (o.here = !0, aa()), o.leaving = !n, o.arriving = n, te());
    }
    const Mo = () => {
      document.hidden || (be(), te());
    };
    async function So(n) {
      if (T && (o.airborne = gl(ml(o.airborne, S), { x: 0, y: 0 }, performance.now())), Vn(), O = null, x = null, !!n)
        try {
          const [l, d] = await Promise.all([Kc(n), import("./figure-BynTMELK.js")]);
          if (n !== p.value || !u.value) return;
          const { FigurePlayer: g } = await import("./player-C2eRIt9G.js");
          F = d.CLIPS.filter((v) => !v.voices || v.voices.includes(n)), Ia = [...l.stance.free], Ut = d.blowsLandAt(l.stance) * S, _n = { frames: d.WORK.blowFrames, lands: d.WORK.lands }, ea = { depth: d.LOOK_REACH * S, above: d.eyesAboveOf(l) * S, tip: d.HEAD_TIP }, bo = d.headPivotOf(l), jo(Ae.value, Na), Go(Ae.value, Fa), Uo(Ae.value, Ta), J.value = d.GROUND, u.value.width = u.value.height = Math.round(S * (window.devicePixelRatio || 1)), x = new g(l, u.value), Nr(), Fr(), Br(), aa(), o.here = s.here, o.arriving = o.here, ht(), be(), te();
        } catch (l) {
          m.value = String(l.message ?? l);
        }
    }
    function Nr() {
      const n = window.devicePixelRatio || 1, l = (d) => {
        const g = Array.from({ length: ku(d) }, (v, y) => x.stage.drawBlock(d, y, S, n));
        return { pictures: g.map((v) => v.canvas.toDataURL()), width: g[0].canvas.width / n, height: g[0].canvas.height / n, below: g[0].below };
      };
      vn.value = Object.fromEntries(tu.map((d) => [d, l(d)]));
    }
    function Fr() {
      const n = window.devicePixelRatio || 1, l = x.stage.drawCanopy(S, n);
      Ba.value = { picture: l.canvas.toDataURL(), width: l.canvas.width / n, height: l.canvas.height / n, at: l.at, ends: l.ends };
    }
    function Br() {
      const n = window.devicePixelRatio || 1, l = [0, 0.5].map((d) => x.stage.drawBug(d, S, n));
      jt.value = { pictures: l.map((d) => d.canvas.toDataURL()), width: l[0].canvas.width / n, height: l[0].canvas.height / n, at: l[0].at };
    }
    function Ao({ detail: n }) {
      n.parcel !== void 0 && (tn = n.parcel ? { card: "demo", since: 0 } : null), tn && (ue = { card: tn.card, granted: !0 }), n.clip === "hop_up" ? Qa() : n.clip && (R.value = [...R.value, { clip: n.clip, card: "", lifetime: 1 / 0, queuedAt: M.value, bugs: n.clip === "bug_shot" ? Ho(Math.random) : [] }]), be();
    }
    ya(p, So), ya(() => s.here, Er), Kr(() => {
      window.addEventListener(Nl, Ao), document.addEventListener("visibilitychange", Mo), document.addEventListener("input", wo, !0), window.addEventListener("resize", be), window.addEventListener("mousemove", $o, { passive: !0 }), So(p.value);
    }), Yr(() => {
      window.removeEventListener(Nl, Ao), Ue(), cancelAnimationFrame(ln), cancelAnimationFrame(L), clearTimeout(G), document.removeEventListener("visibilitychange", Mo), document.removeEventListener("input", wo, !0), window.removeEventListener("resize", be), window.removeEventListener("mousemove", $o), Vn();
    });
    const Oo = _(() => {
      var l;
      const n = (l = mt.value) == null ? void 0 : l.marks;
      return n != null && n.frames.some(([d, g]) => Wt.value >= d && Wt.value < g) ? n.mark : "";
    }), Tr = _(() => ({
      left: `${Le.value.x * 100}%`,
      top: `${(Le.value.y - Eh) * 100}%`,
      "--mark-seconds": `${Ol}s`
    })), rt = D(null);
    let Eo = null;
    const No = /* @__PURE__ */ new Map();
    function Lr(n) {
      var g;
      const l = n.clip.name === "bug_shot" ? (g = R.value[0]) == null ? void 0 : g.bugs : null;
      if (l !== Eo && (Eo = l, No.clear()), rt.value = l != null && l.length ? Iu(l, me(), Bn(n), { surfaces: Ru(), bursts: No }) : null, !rt.value) return null;
      const { target: d } = rt.value;
      return { x: (d.x - o.at.x) / S, y: (d.y - o.at.y) / S, back: d.back };
    }
    const zr = _(() => {
      var n;
      return (((n = rt.value) == null ? void 0 : n.bugs) ?? []).map((l) => ({ ...l, x: l.x - o.at.x, y: l.y - o.at.y }));
    }), Ir = _(() => {
      var n;
      return (((n = rt.value) == null ? void 0 : n.slush) ?? []).map((l) => ({
        ...l,
        x: l.x - o.at.x,
        y: l.y - o.at.y,
        ...l.clip ? { clip: { left: l.clip.left - o.at.x, right: l.clip.right - o.at.x, top: l.clip.top - o.at.y, bottom: l.clip.bottom - o.at.y } } : {}
      }));
    }), Rr = _(() => {
      var n;
      return (((n = rt.value) == null ? void 0 : n.camera) ?? []).map((l) => ({ ...l, from: { x: l.from.x - o.at.x, y: l.from.y - o.at.y } }));
    }), De = _(() => Fi(Sn.value, An.value)), Cr = _(() => ({ left: o.at.x, right: window.innerWidth - o.at.x - S })), oa = _(() => De.value && Bi(De.value.name, De.value.u)), qr = _(() => ({
      left: `${Le.value.x * 100}%`,
      top: `${Le.value.y * 100}%`,
      opacity: Pt.value.strength,
      "--halo": `rgb(${Pt.value.colour.map((n) => Math.round(n * 255)).join(" ")})`
    })), Dr = _(() => {
      var n;
      return ["enter", "exit"].includes((n = mt.value) == null ? void 0 : n.name);
    }), Pr = _(() => {
      var n, l, d;
      return {
        "--size": `${S}px`,
        "--fall-ms": `${Qt.value.ms}ms`,
        "--squash": Qt.value.squash,
        "--bounce": `${Qt.value.bounce}px`,
        ...oa.value && { scale: `${oa.value.x} ${oa.value.y}`, transformOrigin: `50% ${(1 - J.value) * 100}%` },
        ...Pn.value && { rotate: `${qn.value}rad`, transformOrigin: `${Pn.value.x * 100}% ${Pn.value.y * 100}%` },
        ...fe.value && { rotate: `${fe.value.angle}deg`, scale: fe.value.scale.join(" "), transformOrigin: "50% 55%" },
        ...((n = o.airborne) == null ? void 0 : n.held) && { rotate: `${o.airborne.hang}rad`, transformOrigin: `${o.airborne.grip.x * 100}% ${o.airborne.grip.y * 100}%` },
        ...((l = o.airborne) == null ? void 0 : l.thrown) && { rotate: `${o.airborne.spin}deg`, transformOrigin: "50% 55%" },
        ...((d = o.airborne) == null ? void 0 : d.scale) && { scale: o.airborne.scale.join(" ") }
      };
    }), jr = _(() => {
      const n = me(), { x: l, y: d } = o.at;
      return {
        width: `${S}px`,
        height: `${S}px`,
        zIndex: xa.figure,
        transform: `translate(${l}px, ${d}px)`,
        clipPath: `inset(${n.top - d}px ${l + S - n.right}px ${d + S - n.bottom}px ${n.left - l}px)`
      };
    });
    return (n, l) => {
      var d, g;
      return b(), w(I, null, [
        Vr(A("div", {
          class: "voice-figure",
          style: ae(jr.value),
          "aria-hidden": "true",
          "data-walking": za.value,
          "data-hopping": ss.value,
          "data-trip": rs.value,
          "data-clip": (d = mt.value) == null ? void 0 : d.name,
          "data-beats": R.value.map((v) => v.clip).join(" ")
        }, [
          A("div", {
            class: Fl(["voice-figure-actor", vt.value]),
            style: ae(Pr.value),
            onAnimationend: Rs
          }, [
            A("div", {
              class: "voice-figure-body",
              style: ae(nr.value),
              onMousedown: l[0] || (l[0] = Xr(() => {
              }, ["prevent"])),
              onPointerdown: Qs,
              onClick: Xs,
              ref_key: "bodyArea",
              ref: ko
            }, null, 36),
            A("canvas", {
              ref_key: "canvas",
              ref: u,
              class: "voice-figure-canvas",
              "data-figure-canvas": "",
              "data-voice": p.value,
              "data-failure": m.value || void 0,
              style: ae(Dr.value || j(Ti)((g = De.value) == null ? void 0 : g.name) ? { clipPath: `inset(0 0 ${J.value * 100}% 0)` } : null)
            }, null, 12, Oh),
            Pt.value ? (b(), w("span", {
              key: 0,
              class: "voice-figure-halo",
              style: ae(qr.value)
            }, null, 4)) : P("", !0),
            Oo.value ? (b(), w("span", {
              key: 1,
              class: "voice-figure-marks",
              style: ae(Tr.value)
            }, [
              (b(), w(I, null, H(Al, (v) => A("span", {
                key: v,
                style: ae({ animationDelay: `${-(v - 1) * Ol / Al}s` })
              }, $a(Oo.value), 5)), 64))
            ], 4)) : P("", !0),
            Co(qo, {
              name: "figure-prop",
              duration: 150
            }, {
              default: Do(() => [
                De.value ? (b(), ne(Tp, {
                  key: De.value.name,
                  name: De.value.name,
                  u: De.value.u,
                  hand: Da.value,
                  head: Le.value,
                  feet: 1 - J.value,
                  size: S,
                  room: Cr.value,
                  ball: bt.value,
                  canopy: Ba.value,
                  bug: jt.value,
                  "wall-bugs": zr.value,
                  slush: Ir.value,
                  camera: Rr.value
                }, null, 8, ["name", "u", "hand", "head", "feet", "room", "ball", "canopy", "bug", "wall-bugs", "slush", "camera"])) : P("", !0)
              ]),
              _: 1
            })
          ], 38)
        ], 12, Ah), [
          [Zr, j(o).here]
        ]),
        Ka.value && jt.value ? (b(), ne(qp, {
          key: 0,
          bug: jt.value,
          at: Ka.value
        }, null, 8, ["bug", "at"])) : P("", !0),
        (b(!0), w(I, null, H(Mn.value, (v) => (b(), w(I, {
          key: v.id
        }, [
          vn.value ? (b(), ne(Xd, {
            key: 0,
            x: v.x,
            y: v.y,
            up: v.up,
            scale: v.scale,
            opacity: v.opacity,
            blows: v.blows ?? 0,
            block: vn.value[v.lit],
            ahead: v.state === "built",
            piled: v.state === "piled"
          }, null, 8, ["x", "y", "up", "scale", "opacity", "blows", "block", "ahead", "piled"])) : P("", !0)
        ], 64))), 128)),
        Co(qo, { name: "step-ladder" }, {
          default: Do(() => [
            nt.value ? (b(), ne(Cd, {
              key: 0,
              foot: nt.value.foot,
              top: nt.value.top
            }, null, 8, ["foot", "top"])) : P("", !0)
          ]),
          _: 1
        })
      ], 64);
    };
  }
}, Lh = /* @__PURE__ */ Ge(Th, [["__scopeId", "data-v-39ec43b1"]]), qh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Lh
}, Symbol.toStringTag, { value: "Module" }));
export {
  Dl as F,
  vc as G,
  as as H,
  bc as R,
  qh as V,
  Ch as g,
  hh as h,
  Rh as t
};
