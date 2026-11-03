/* @code-commandments-generated */
import { reactive as Ur, computed as S, openBlock as b, createElementBlock as w, normalizeStyle as ne, Fragment as I, renderList as U, mergeProps as Ro, ref as P, watch as ya, createElementVNode as O, normalizeClass as Nl, toDisplayString as _a, unref as j, createCommentVNode as q, useId as Wr, createBlock as te, inject as Kr, onMounted as Yr, onUnmounted as Vr, withDirectives as Xr, withModifiers as Zr, createVNode as Io, Transition as Co, withCtx as Do, vShow as Jr } from "vue";
import { l as Qr, A as X, p as ei, a as ti, f as ni, s as ai, b as oi, c as va, t as li, B as si, d as Fl, e as ft, g as ri, r as ae, h as ii, i as Nt, j as ui, w as Bl, k as je, m as ci, n as It, o as hn, q as Ct, R as Tl, u as fn, v as Ft, x as di, y as Ll, z as Q, C as fi, D as zl, E as zt, F as pi, G as hi, H as mi, I as Rl, L as Il, J as Cl, K as he, M as ba, N as Xe, O as gi, P as yi, _ as Ge, Q as xa, S as Po, T as vi, U as bi, V as ce, W as $a, X as xi, Y as wi, Z as ki, $ as _i, a0 as Ot, a1 as $i, a2 as Mi, a3 as Si, a4 as Ai, a5 as $t, a6 as Oi, a7 as Ei, a8 as Ni, a9 as Fi, aa as Bi, ab as Ti, ac as Li, ad as zi, ae as qo, af as jo, ag as Go, ah as Ho, ai as Ri, aj as Ii, ak as Ci, al as Di, am as Pi, an as qi, ao as ji, ap as Gi, aq as Hi, ar as Ui, as as Wi, at as Ki, au as Yi, av as Vi, aw as sn, ax as la, ay as Xi, az as Zi, aA as Ji, aB as Uo, aC as Qi, aD as eu, aE as tu, aF as nu, aG as au, aH as sa, aI as ou, aJ as lu, aK as Wo, aL as Ko, aM as Yo, aN as su, aO as ru, aP as iu, aQ as uu, aR as cu, aS as Mt, aT as du, aU as fu, aV as pu, aW as hu, aX as mu, aY as Ke, aZ as Z, a_ as Vo, a$ as Xo, b0 as gu, b1 as yu, b2 as vu, b3 as bu, b4 as xu, b5 as wu, b6 as ku, b7 as ct, b8 as dt, b9 as _u, ba as Zo, bb as ra, bc as Jo, bd as St, be as $u, bf as Mu, bg as Su, bh as Qo, bi as Au, bj as Ou, bk as Eu, bl as el, bm as Nu, bn as Fu, bo as Bu, bp as tl, bq as Tu, br as Lu, bs as zu, bt as Ru, bu as Iu, bv as nl, bw as Cu, bx as Du, by as Pu, bz as qu, bA as ju, bB as Gu, bC as al, bD as Hu, bE as Uu, bF as Wu, bG as Ku, bH as Yu, bI as Vu, bJ as Xu, bK as Zu, bL as ia, bM as Ju, bN as Qu, bO as ec, bP as tc, bQ as nc, bR as ac, bS as oc, bT as lc, bU as sc, bV as rc, bW as ic, bX as ol, bY as uc, bZ as cc, b_ as dc, b$ as fc, c0 as pc, c1 as hc, c2 as mc, c3 as gc, c4 as yc, c5 as vc, c6 as bc } from "./index-DLkr0Iql.js";
const Dl = { height: 5.4, middle: 2.4 };
function Dh(e, t, a, r) {
  if (!e) return { facing: t, speed: 0, settled: !0 };
  const s = Math.max(0, Math.min(a, 0.05)), i = ((e.facing - t + 180) % 360 + 360) % 360 - 180, c = e.facing - i, u = 8 / r, p = e.speed + u * i, m = Math.exp(-u * s), f = c + (i + p * s) * m, h = Math.min(Math.max(f - e.facing, -720 * s), 720 * s), x = Math.abs(f - e.facing) > 720 * s ? Math.sign(h) * 720 : (e.speed - u * p * s) * m, k = e.facing + h, _ = Math.abs(k - c) < 1e-3 && Math.abs(x) < 0.05;
  return { facing: _ ? c : k, speed: _ ? 0 : x, settled: _ };
}
const xc = { length: 1.36, planted: 0.6, clearance: 0.16 }, wc = { length: 2.16, planted: 0.42, clearance: 0.3 }, kc = (e, t, a = !1) => t > 0 ? e * Dl.height / (t * (a ? wc : xc).length) : 0;
function Ph(e, { length: t, planted: a, clearance: r }) {
  const s = (e % 1 + 1) % 1, i = t * a;
  if (s < a) return [-i / 2 + t * s, 0];
  const c = (s - a) / (1 - a);
  return [i / 2 - i * (3 * c * c - 2 * c * c * c) + t * (1 - a) * c * (1 - c) * (1 - 2 * c), r * Math.sin(Math.PI * c) ** 2];
}
function _c(e, t, a) {
  if (t <= 0) return 1;
  const r = Math.min(Math.max(e, 0), t), s = Math.min(Math.max(a, 0), t / 2);
  if (!s) return r / t;
  const i = t - s, c = (u) => u * u * u * (1 - u / 2);
  return r < s ? s * c(r / s) / i : r > t - s ? 1 - s * c((t - r) / s) / i : (r - s / 2) / i;
}
const Ma = 5, Dt = (e, t) => t >= e.left && t <= e.right, $c = 8, Mc = (e, t, a, r = Ma) => e.filter((s) => Dt(s, t) && Math.abs(s.top - a) <= r).sort((s, i) => Math.abs(s.top - a) - Math.abs(i.top - a))[0] ?? null, Sc = (e, t, a, r = Ma) => e.filter((s) => Dt(s, t) && s.top >= a - r).sort((s, i) => s.top - i.top)[0] ?? null, Ac = 5, Oc = 3, wa = ["dock", "compose", "foot"], Ec = 30;
function Nc(e, t, a, r) {
  const s = e.find((i) => i.id === t);
  return !s || wa.includes(s.kind) && s.top > r + Ma ? { falls: !0, dx: 0, dy: 0 } : wa.includes(s.kind) && s.top < r - Ec ? { falls: !1, dx: 0, dy: 0 } : { falls: !1, dx: Math.min(Math.max(a, s.left), s.right) - a, dy: s.top - r };
}
const Pl = (e) => e.filter((t) => wa.includes(t.kind));
function ql(e, t) {
  const a = /^cubic-bezier\(([^)]*)\)$/.exec(e ?? "");
  if (!a || t <= 0 || t >= 1) return Math.min(1, Math.max(0, t));
  const [r, s, i, c] = a[1].split(",").map(Number), u = (f, h, x) => 3 * (1 - f) * (1 - f) * f * h + 3 * (1 - f) * f * f * x + f * f * f;
  let [p, m] = [0, 1];
  for (let f = 0; f < 30; f++) {
    const h = (p + m) / 2;
    u(h, r, i) < t ? p = h : m = h;
  }
  return u((p + m) / 2, s, c);
}
const Fc = (e, t, a) => a - t >= e.lead + e.ms;
function ua(e, t, a, r = !1) {
  if (e.pogo && !r) return Bc(e, t, a);
  const s = r && e.hopping ? 1 : e.ramp ? _c(a - e.lead, e.ms, e.ramp) : ql(e.easing, e.ms > 0 ? (a - e.lead) / e.ms : 1);
  return { x: t.x + (e.x - t.x) * s, y: t.y + (e.y - t.y) * s };
}
function Bc(e, t, a) {
  const { bounces: r, spring: s, over: i } = X.pogo, c = Math.min(Math.max(a / e.ms, 0), 1), u = (k) => Math.min(Math.max((c - k[0]) / (k[1] - k[0]), 0), 1);
  if (c < s[0]) return { x: t.x, y: t.y - ei(ti(), u(r)).height * e.size };
  const p = i * e.size, m = Math.max(t.y - e.y, 0) + p, f = e.y - p, h = Tc(e, t), x = t.x + (e.x - t.x) * u([s[0], h[1]]);
  return c < s[1] ? { x, y: f + m * (1 - u(s)) ** 2 } : { x, y: f + p * u(h) ** 2 };
}
function Tc(e, t) {
  const { spring: a, over: r } = X.pogo, s = r * e.size, i = Math.max(t.y - e.y, 0) + s;
  return [a[1], Math.min(a[1] + (a[1] - a[0]) * Math.sqrt(s / i), 1)];
}
function jl(e, t, a, r = !1) {
  const s = Lc(t, e);
  if (s) return { x: e.x, y: s.top, speed: 0, onto: s.id, landed: s };
  const i = Rc(e, t);
  if (i) return i;
  const c = e.onto ? t.find((m) => m.id === e.onto && Dt(m, e.x)) : null;
  if (c && c.top <= e.y) return { x: e.x, y: c.top, speed: 0, onto: c.id, landed: c };
  const u = Sc(t, e.x, e.y, 0);
  if (!u) return { ...e, onto: null, landed: null };
  if (r) return { x: e.x, y: u.top, speed: 0, onto: u.id, landed: u };
  const p = ni({ y: e.y, speed: e.speed }, u.top, a, e.most);
  return { x: e.x, y: p.y, speed: p.speed, onto: u.id, landed: p.landed ? u : null };
}
const Lc = (e, t) => t.speed >= 0 ? e.find((a) => a.id === "home" && Dt(a, t.x) && a.top < t.y) ?? null : null, zc = (e, t, a) => e.filter((r) => Dt(r, t) && r.top < a && a - r.top <= Ac).sort((r, s) => s.top - r.top)[0] ?? null;
function Rc(e, t) {
  if (e.peak === 0 || e.peak === void 0 && e.speed) return null;
  const a = zc(t, e.x, e.y);
  return e.peak === void 0 ? a ? { ...e, peak: Oc, landed: null } : null : e.peak > 1 ? { ...e, peak: e.peak - 1, landed: null } : a ? { x: e.x, y: a.top, speed: 0, peak: 0, landed: a } : { ...e, peak: 0, landed: null };
}
function Ic(e, t, a, r, s = 1 / 0) {
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
function Cc(e, t, a, r) {
  const s = a.find((c) => c.id === "home"), i = s ? Math.min(e.y, s.top) : e.y;
  return { x: e.x, y: i, posture: e.posture, face: e.face, speed: 0, at: r, to: t };
}
const Dc = (e, t, a, r) => ({ x: e, y: t, posture: "stand", speed: 0, at: r, to: null, most: a, chute: !0 }), Pc = (e, t, a) => ({ x: e.x, y: e.y, posture: "stand", face: e.face, speed: t, at: a, to: null, peak: 0 }), qc = (e, t) => e.speed < 0 && e.y <= t;
function jc(e, t, a, r = !1) {
  const s = jl(e, Pl(t), (a - e.at) / 1e3, r);
  if (!s.landed) return { airborne: { ...e, ...s, at: a }, landed: null };
  const i = Qr(e.posture, s.landed.kind);
  return { airborne: null, landed: { spot: { x: s.x, y: s.landed.top, posture: i, face: e.face, view: null, on: s.landed.element ?? null }, to: e.to, standing: i === "stand" } };
}
const Gc = "cubic-bezier(0.42, 0, 0.58, 1)";
function Hc(e, t, a) {
  const r = Math.min(1, Math.max(0, (t - e.began) / a)), s = ql(Gc, r);
  return {
    at: { x: e.from.x + (e.to.x - e.from.x) * s, y: e.from.y + (e.to.y - e.from.y) * s },
    done: r >= 1
  };
}
const ca = (e, t, a) => e.map((r) => ({ ...r, x: r.x + t, y: r.y + a }));
function Uc(e) {
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
    cancelAnimationFrame(a), ai();
  }
  function i() {
    s(), oi(), a = requestAnimationFrame(r);
  }
  return { body: t, start: i, stop: s };
}
const Wc = "voice-figures", Gl = (e) => new URL(e).pathname.split("/").pop(), Kc = (e, t) => Gl(e).startsWith(`${t}.`);
async function Yc(e) {
  const t = await va.voiceFigures(), a = va.voiceFigureUrl(t[e]);
  if (typeof caches > "u") return (await ll(a, e)).arrayBuffer();
  const r = await caches.open(Wc), s = await r.match(a);
  if (s) return s.arrayBuffer();
  const i = await ll(a, e);
  await r.put(a, i.clone());
  const c = (await r.keys()).filter((u) => Kc(u.url, e) && Gl(u.url) !== t[e]);
  return await Promise.all(c.map((u) => r.delete(u))), i.arrayBuffer();
}
async function ll(e, t) {
  const a = await li.raw(e);
  if (!a.ok) throw new Error(`The ${t} figure did not load: ${a.status}`);
  return a;
}
async function Vc(e) {
  const [{ figureOf: t }, a] = await Promise.all([import("./figure-C7ANXsiQ.js"), Yc(e)]);
  return t(a, e, va.figureDecoderUrl());
}
const Xc = { most: 2.5 }, Ze = ({ size: e, below: t }) => (1 - t - si.top) * e, Hl = (e) => Xc.most * Ze(e), Zc = { share: 0.5 }, Jc = (e, t) => e >= Zc.share * t;
function Qc(e, t, a, r) {
  const s = [];
  let i = e;
  for (; i.y - t > r; ) {
    const c = a.filter((u) => u.y < i.y && u.y > t && i.y - u.y <= r);
    if (!c.length) return null;
    i = c.reduce((u, p) => p.y < u.y ? p : u), s.push(i);
  }
  return s;
}
const Je = "stand", Ve = "hang", ed = [8, 20];
function td(e, t = {}) {
  const a = ft({ moment: "roam", ...t }, e);
  return { where: a.name, stay: Ul(a.stay, e) };
}
const Ul = ([e, t], a) => e + a() * (t - e), Sa = (e, t) => e.left - t.left > t.right - e.right ? "left" : "right", Aa = (e, t, a) => e.top - ci(a) >= t.top && e.top <= t.bottom - 8, nd = { l: "left", r: "right" }, ad = 0.3, od = 180;
function Wl(e, t, a, r, { memory: s = null, now: i = 0, free: c = !1 } = {}) {
  const u = e.floors.filter((_) => _.kind === "bubble" && Aa(_, e.view, t)), p = { moment: "perch", hands: a.length > 0, free: c, memory: s, now: i }, m = Fl(p).some((_) => _.name === Ve), f = ft({ moment: "perch", hands: m, free: c }, r).name, h = m ? f === Ve ? [Ve, Je] : [Je, Ve] : [Je], k = u.reverse().flatMap((_) => h.map((B) => ld(_, B, e.view, a))).find((_) => mn(_, e, t)) ?? null;
  return (k == null ? void 0 : k.kind) === Ve && ri(p, Ve, r), k;
}
function ld(e, t, a, r) {
  const s = Sa(e, a);
  if (t === Je) return { floor: e.id, kind: t, side: s, grip: "" };
  const i = r.find((c) => nd[c] === s);
  return i ? { floor: e.id, kind: t, side: s, grip: i, face: 0 } : { floor: e.id, kind: t, side: s, grip: r[0], face: od };
}
function mn(e, t, a) {
  const r = t.floors.find((i) => i.id === e.floor);
  if (!r || !Aa(r, t.view, a)) return null;
  const s = sd(e, r, a);
  return It(s, a, t.floors) && hn(s, a) && !Ct(s, a) ? s : null;
}
function sd(e, t, a) {
  if (e.kind === Je)
    return { ...hi({ ...t, width: t.right - t.left }, e.side, a), on: t.element };
  const r = (e.side === "left" ? -1 : 1) * ad * a.size;
  return { x: (e.side === "left" ? t.left : t.right) + r, y: t.top, face: e.face, posture: "hang", grip: e.grip, on: t.element };
}
const rd = 1.6, id = yi.filter((e) => e.when.moment === "ledge_at").map((e) => e.along), sl = 35;
function pn(e, t, a) {
  const r = ae(), s = r.floors.find((u) => u.element && u.element === a.on && Il.has(u.kind));
  if (!s || s.right - s.left < rd * t.size) return null;
  const i = (u) => s.kind !== "compose" ? 0 : u <= 0.5 ? 360 - sl : sl;
  return [e, ...id.filter((u) => u !== e)].map((u) => ({
    x: s.left + (s.right - s.left) * u,
    y: s.top,
    face: i(u),
    posture: "sit",
    leans: !0,
    on: s.element
  })).find((u) => It(u, t, r.floors) && hn(u, t) && !Ct(u, t) && Cl(u, t)) ?? null;
}
const ud = [0.5, 0.42, 0.58];
function cd(e, t, a = { turn: 0, leans: 0 }) {
  const r = ae(), s = r.floors.find((u) => u.element && u.element === t.on && Il.has(u.kind));
  if (!s) return null;
  const i = (u) => ({ x: s.left + (s.right - s.left) * u, y: s.top, face: a.turn, leans: a.leans, posture: "composed", view: null, on: s.element });
  return ud.map(i).find((u) => It(u, e, r.floors) && hn(u, e) && !Ct(u, e) && Cl(u, e)) ?? null;
}
function Kl(e, t, a = ae()) {
  if (!e) return null;
  const { rope: r, ties: s, room: i } = X.rope_swing, c = he(), u = e.bottom + r * t.size, p = s * t.size / 2, m = [Math.max(e.left + p, c.left + i * t.size), Math.min(e.right - p, c.right - i * t.size)], f = dd(e, t, a, u, m);
  if (f === null) return null;
  const h = { x: f, y: u, posture: "sit", face: 0, swings: !0, view: null, on: e.element }, x = a.floors.find((k) => k.id === "home");
  return x && zt(h, t).bottom > x.top ? null : It(h, t, a.floors) && !Ct(h, t) ? h : null;
}
function dd(e, t, a, r, [s, i]) {
  if (s > i) return null;
  const { seat: c, clearance: u } = X.rope_swing, p = e.bottom + (zt({ x: 0, y: r, posture: "sit" }, t).bottom - e.bottom) * (1 + u), m = c * t.size / 2 * (1 + u), h = a.floors.filter((B) => B.kind === "bubble" && B.bottom > e.bottom && B.top < p).map((B) => [B.left - m, B.right + m]), x = (e.left + e.right) / 2, k = (B) => !h.some(([L, G]) => B > L && B < G);
  return [x, ...h.flat()].map((B) => Math.min(Math.max(B, s), i)).filter(k).sort((B, L) => Math.abs(B - x) - Math.abs(L - x))[0] ?? null;
}
function rl(e, t, a = ae()) {
  if (e.posture !== "stand") return null;
  const { ball: r, clear: s, tie: i, far: c } = X.disco, u = e.y - Ze(t), p = Ze(t) + (s + r / 2) * t.size, f = a.floors.filter((x) => x.kind === "bubble" && x.bottom < e.y && x.left < e.x && x.right > e.x).filter((x) => x.bottom <= u - (s + r + i) * t.size).sort((x, k) => k.bottom - x.bottom)[0];
  return a.floors.some((x) => x.kind === "bubble" && x.element === e.on) && f && u - f.bottom <= c * Ze(t) ? { kind: "bubble", above: e.y - f.bottom, hangs: p } : null;
}
const fd = (e, t) => e.floors.filter((a) => a.kind === "bubble" && Kl(a, t, e)), il = 20;
function ka(e, t) {
  var u;
  const a = document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!a) return null;
  if ((u = Q().element) != null && u.contains(a)) return je(null, t);
  const r = ae(), s = r.floors.find((p) => p.kind === "bubble" && p.element.contains(a));
  if (!s) return null;
  const i = Sa(s, r.view);
  return [i, i === "left" ? "right" : "left"].map((p) => mn({ floor: s.id, kind: Je, side: p, grip: "" }, r, t)).find(Boolean) ?? null;
}
function Oa(e, t, a, r) {
  const i = e.floors.filter((c) => c.kind === "bubble" && c.top < a.y).map((c) => mn({ floor: c.id, kind: Je, side: Sa(c, e.view), grip: "" }, e, t)).filter(Boolean);
  return Qc(a, r, i, Hl(t));
}
const pd = (e, t) => t.posture === "stand" && e.some((a) => a.kind === "bubble" && a.element === t.on), Yl = (e, t, a, r) => pd(e.floors, a) && Jc(t.y - a.y, e.view.bottom - e.view.top) && Fl({ moment: "climb", ...r }).some((s) => s.name === "pogo");
function hd(e, t, a, r, s, i) {
  var u;
  const c = Oa(e, t, a, r.y);
  return Yl(e, a, r, s) ? ((u = ft({ moment: "climb", footholds: !!c, ...s }, i)) == null ? void 0 : u.name) === "pogo" ? { via: [], pogo: !0 } : { via: c, pogo: !1 } : c && { via: c, pogo: !1 };
}
function Bt(e, t, a, r = {}) {
  const s = ae();
  return e && (Oa(s, t, a, e.y) || Yl(s, a, e, r)) ? e : null;
}
function Vl(e, t, a, r, { tally: s = null, free: i = !1, room: c = 0, memory: u = null, moment: p = "roam" } = {}) {
  const m = fd(ae(), t), { where: f, stay: h } = td(r, { moment: p, tally: s, free: i, room: c, swings: m.length > 0, memory: u, now: e }), x = e + h;
  if (f === "ledge") return { where: f, until: x, along: ft({ moment: "ledge_at" }, r).along };
  if (f === "bubble_ledge") return { where: f, until: x, ...md(t, r) };
  if (f === "rope_swing") return { where: f, until: x, floor: m[Math.floor(r() * m.length)].id };
  if (f === "bubble") {
    const k = Wl(ae(), t, a, r, { memory: u, now: e, free: i });
    return { where: f, until: (k == null ? void 0 : k.kind) === Ve ? e + Ul(ed, r) : x, perch: k };
  }
  if (f === "tab") {
    const k = Object.keys(Ll()).filter((_) => je(_, t));
    return { where: f, until: x, view: k[Math.floor(r() * k.length)] };
  }
  if (f === "edge") return { where: f, until: x, along: { x: r() * window.innerWidth, y: 0 } };
  if (f === "composed") {
    const { turn: k, leans: _ } = ft({ moment: "composed_as" }, r);
    return { where: f, until: x, turn: k, leans: _ };
  }
  return { where: f, until: x };
}
function md(e, t) {
  var i;
  const a = ft({ moment: "ledge_at" }, t).along, r = ae(), s = r.floors.filter((c) => c.kind === "bubble" && Aa(c, r.view, e) && pn(a, e, { on: c.element }));
  return { floor: ((i = s[Math.floor(t() * s.length)]) == null ? void 0 : i.id) ?? "", along: a };
}
function gd(e, t, a = ae()) {
  const r = a.floors.find((f) => f.element && f.element === t.on);
  if (!r) return null;
  const { wall: s, contact: i } = X.lean, c = r.top - i / Dl.height * e.size, u = ba * e.size;
  return a.floors.filter((f) => f.kind === "bubble" && f.element !== r.element && f.bottom <= r.top && f.top <= c && f.bottom >= c).flatMap((f) => [{ wall: f.left, way: 1, bubble: f }, { wall: f.right, way: -1, bubble: f }]).map(({ wall: f, way: h, bubble: x }) => ({ spot: { x: f - h * s * e.size, y: r.top, face: 0, posture: "stand", view: null, on: r.element, lean: { wall: f, way: h } }, bubble: x })).filter(({ spot: f, bubble: h }) => f.x >= r.left + u && f.x <= r.right - u && !zl(gi(f, e), h)).map(({ spot: f }) => f).filter((f) => It(f, e, a.floors) && hn(f, e) && !Ct(f, e)).sort((f, h) => Math.abs(f.x - t.x) - Math.abs(h.x - t.x))[0] ?? null;
}
const ul = { reach: 1.1, eyes: 0.72 };
function yd(e, t, a) {
  const r = t.y - ul.eyes * Ze(a), s = (c) => Math.max(c.left - t.x, t.x - c.right, 0);
  return e.floors.filter((c) => c.kind === "bubble" && c.element !== t.on && c.top <= r && c.bottom >= r && s(c) <= ul.reach * a.size).sort((c, u) => s(c) - s(u))[0] ?? null;
}
const vd = (e, t) => e - t.left <= t.right - e ? -1 : 1, bd = 0.18;
function xd(e, t) {
  const a = he(), { edge: r } = Q(), s = je(null, e, { x: t > 0 ? a.right : a.left, y: 0 }), i = t > 0 ? r.left + r.width - ba * e.size : r.left + ba * e.size, u = (t > 0 ? a.right : a.left) - t * bd * e.size, p = t * (u - i);
  if (p < Xe.within) return { ...s, x: t > 0 ? Math.min(u, i) : Math.max(u, i) };
  const m = (B) => Math.tan(B * Math.PI / 180), f = Math.min(p / m(Xe.lean), Xe.most * Ze(e)), h = Math.min(p, f * m(Xe.steepest)), x = Xe.over * Ze(e), k = i + t * h, _ = { x: i, y: r.top };
  return { ...s, x: k, y: r.top - f, ladder: { foot: _, top: { x: k + t * x * h / f, y: r.top - f - x }, way: t } };
}
const wd = (e, t) => {
  var a;
  return ((a = t == null ? void 0 : t.to) == null ? void 0 : a.ladder) ?? (e.ladder && (!(t != null && t.moves) || t.clip === "ladder_climb" || t.legs.some((r) => r.clip === "ladder_climb")) ? e.ladder : null);
};
function Rt(e, t, a) {
  var r;
  if (e.where === "bubble") {
    const s = e.perch && mn(e.perch, ae(), t);
    return s ? { ...s, view: null } : null;
  }
  if (e.where === "tab") {
    const s = e.view && je(e.view, t, a);
    return s ? { ...s, view: null } : null;
  }
  return e.where === "edge" ? je(null, t, e.along) : e.where === "rummage" ? xd(t, e.way) : e.where === "mark" ? ka(e.card, t) : e.where === "ledge" ? pn(e.along, t, a) : e.where === "bubble_ledge" ? pn(e.along, t, { on: (r = ae().floors.find((s) => s.id === e.floor)) == null ? void 0 : r.element }) : e.where === "composed" ? cd(t, a, e) : e.where === "lean" ? gd(t, a) : e.where === "rope_swing" ? Kl(ae().floors.find((s) => s.id === e.floor), t) : e.where === "seat" ? Rl(t, a) ?? fn(t, a) : e.where === "aside" ? e.spot : fn(t, a);
}
function kd({ state: e, counts: t, stay: a, now: r, near: s, figure: i, hands: c, work: u = null, pile: p = null, cleared: m = { until: 0 }, random: f = Math.random, tally: h = null, memory: x = null, room: k = 0 }) {
  var G;
  const _ = u && ii(i, s, u);
  if (_) return { spot: Nt(_, i) ? _ : null, stay: a };
  const B = Sd({ state: e, counts: t, stay: a, now: r, near: s, figure: i, hands: c, random: f, tally: h, memory: x, room: k });
  if ((G = B.spot) != null && G.ladder) return { ...B, spot: Nt(B.spot, i) ? B.spot : null };
  const L = _d(Md(ui(Xl(B.spot, { state: e, now: r, near: s, figure: i, cleared: m }), p, i), i), s);
  return { ...B, spot: Nt(L, i) ? L : null };
}
const _d = (e, t) => e != null && e.on && e.on !== t.on && e.on === Q().element && fi() ? null : e;
function $d(e, t) {
  const a = Bl(t) ?? je(null, t);
  return (e == null ? void 0 : e.on) === a.on && e.posture === a.posture && Math.abs(e.x - a.x) < 2 ? null : a;
}
const Md = (e, t) => e && Q().docked && e.on === Q().element ? Bl(t) ?? e : e, cl = (e) => Ft(e) === "work";
function Xl(e, { state: t, now: a, near: r, figure: s, cleared: i }) {
  return a >= i.until || !zl(zt(e, s), i.box) ? e : pi(i.box, s, r, Tl.has(t)) ?? e;
}
function Sd({ state: e, counts: t, stay: a, now: r, near: s, figure: i, hands: c, random: u, tally: p, memory: m, room: f }) {
  if (Tl.has(e)) return { spot: fn(i, s), stay: a };
  const h = { memory: m, now: r, room: f }, x = Ft(e) === "type" && Ad(a, r, i, c, u, s, h);
  if (x) return x;
  const k = di(t, Ll()), _ = k && Bt(je(k, i, s), i, s, h);
  if (_) return { spot: _, stay: a };
  const B = !a.laptop && r < a.until && Bt(Rt(a, i, s), i, s, h);
  if (B) return { spot: B, stay: a };
  const L = Vl(r, i, c, u, { tally: p, free: f > 0, room: f, memory: m });
  return { spot: Bt(Rt(L, i, s), i, s, h) || fn(i, s), stay: L };
}
function Ad(e, t, a, r, s, i, c) {
  const u = e.laptop && t < e.until && Bt(Rt(e, a, i), a, i, c);
  if (u) return { spot: u, stay: e };
  const p = { ...Vl(t, a, r, s, { moment: "laptop", memory: c.memory }), laptop: !0 }, m = Bt(Rt(p, a, i), a, i, c);
  if (m) return { spot: m, stay: p };
  const f = Rl(a, i);
  return f && { spot: f, stay: { ...p, where: "seat" } };
}
const Od = { seconds: 4 }, Ed = (e) => e.some((t) => t.hopping && t.clip !== "fall"), Nd = (e, t, a) => e && t === "bubble" ? { until: a + Od.seconds } : null, Fd = (e, t, a) => a || !e || t >= e.until, dl = { least: 30, more: 30 };
function Bd(e, t, a, r, s) {
  return t ? a && (e != null && e.seated) ? e : { until: r + dl.least + s() * dl.more, seated: !0 } : e != null && e.seated ? null : e;
}
const Td = (e, t, a, r) => !(a != null && a.seated) || r >= a.until || e.postures.includes(t) || !!e.rises, cn = 30, Ld = (e, t, a) => ({ stay: { ...e, until: 0 }, cleared: { box: t, until: a + cn } }), zd = (e) => e.where === "edge" ? e : { where: "rest", until: e.where === "rest" ? e.until : 0 }, Rd = (e, t) => mi(t) ? { ...e, until: 0 } : e, Id = ["width", "height"], rn = 14, un = 4, Cd = {
  __name: "StepLadder",
  props: {
    foot: { type: Object, required: !0 },
    top: { type: Object, required: !0 }
  },
  setup(e) {
    const t = e, a = S(() => ({
      left: Math.min(t.foot.x, t.top.x) - rn - un,
      top: t.top.y - un,
      right: Math.max(t.foot.x, t.top.x) + rn + un,
      bottom: t.foot.y + un
    })), r = S(() => ({
      left: `${a.value.left}px`,
      top: `${a.value.top}px`,
      width: `${a.value.right - a.value.left}px`,
      height: `${a.value.bottom - a.value.top}px`,
      "--fallen": `${t.top.x > t.foot.x ? -80 : 80}deg`,
      transformOrigin: `${t.foot.x - a.value.left}px ${t.foot.y - a.value.top}px`
    })), s = S(() => {
      const [i, c, u, p] = [t.foot.x - a.value.left, t.foot.y - a.value.top, t.top.x - a.value.left, t.top.y - a.value.top], m = Math.hypot(u - i, p - c), [f, h] = [(u - i) / m, (p - c) / m], [x, k] = [-h * (rn / 2), f * (rn / 2)], _ = [-1, 1].map((L) => ({ x1: i + L * x, y1: c + L * k, x2: u + L * x, y2: p + L * k })), B = Array.from({ length: Math.floor(m / Xe.rung) }, (L, G) => {
        const $ = (G + 0.6) * Xe.rung, [Fe, le] = [i + f * $, c + h * $];
        return { x1: Fe - x, y1: le - k, x2: Fe + x, y2: le + k };
      });
      return { rails: _, rungs: B };
    });
    return (i, c) => (b(), w("div", {
      class: "step-ladder",
      style: ne(r.value),
      "aria-hidden": "true",
      "data-step-ladder": ""
    }, [
      (b(), w("svg", {
        class: "step-ladder-drawing",
        width: a.value.right - a.value.left,
        height: a.value.bottom - a.value.top
      }, [
        (b(!0), w(I, null, U(s.value.rungs, (u, p) => (b(), w("line", Ro({
          key: `rung${p}`,
          class: "step-ladder-rung"
        }, { ref_for: !0 }, u), null, 16))), 128)),
        (b(!0), w(I, null, U(s.value.rails, (u, p) => (b(), w("line", Ro({
          key: `rail${p}`,
          class: "step-ladder-rail"
        }, { ref_for: !0 }, u), null, 16))), 128))
      ], 8, Id))
    ], 4));
  }
}, Dd = /* @__PURE__ */ Ge(Cd, [["__scopeId", "data-v-1674d262"]]), Qe = { hopMs: 220, perPixel: 0.7, arc: 0.3, gone: [1e3, 5e3], chute: 1.1 };
function Pd(e, t, a) {
  const r = [...t, { x: (t.at(-1) ?? e).x, y: a }];
  return r.map((s, i) => {
    const c = i ? r[i - 1] : e;
    return { from: c, to: s, ms: Qe.hopMs + Qe.perPixel * Math.hypot(s.x - c.x, s.y - c.y) };
  });
}
function qd(e, t, a) {
  var s;
  let r = t;
  for (const i of e) {
    if (r < i.ms) {
      const c = r / i.ms, u = Qe.arc * a * 4 * c * (1 - c);
      return { x: i.from.x + (i.to.x - i.from.x) * c, y: i.from.y + (i.to.y - i.from.y) * c - u, way: Math.sign(i.to.x - i.from.x), gone: !1 };
    }
    r -= i.ms;
  }
  return { ...(s = e.at(-1)) == null ? void 0 : s.to, way: 0, gone: !0 };
}
const jd = (e) => Qe.gone[0] + e() * (Qe.gone[1] - Qe.gone[0]), Tt = { sampled: 0.1, fastest: 3e3, spin: 900, bounce: 0.5, away: 500 }, Gd = 0.05, Zl = (e, t, a) => Math.min(Math.max(e, t), a);
function Hd(e, t) {
  const a = e.filter((m) => t - m.at <= Tt.sampled);
  if (a.length < 2) return { x: 0, y: 0 };
  const [r, s] = [a[0], a.at(-1)], i = Math.max(s.at - r.at, 1e-3), [c, u] = [(s.x - r.x) / i, (s.y - r.y) / i], p = Math.min(1, Tt.fastest / Math.max(Math.hypot(c, u), 1e-9));
  return { x: c * p, y: u * p };
}
const fl = (e) => !!(e != null && e.held || e != null && e.thrown);
function pl(e, t, a, r = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, s = { x: 0, y: 0 }) {
  const { a: i, b: c, c: u, d: p, e: m, f } = r, h = i * p - c * u, x = t.x - e.x - s.x - m + i * s.x + u * s.y, k = t.y - e.y - s.y - f + c * s.x + p * s.y, _ = { x: (p * x - u * k) / h / a, y: (i * k - c * x) / h / a }, B = Math.hypot(i, c);
  return { at: { x: t.x - _.x * a, y: t.y - _.y * a }, point: _, angle: Math.atan2(c, i), scale: [B, h / B] };
}
function Ea(e, t) {
  if (!e.scaleFrom) return [1, 1];
  const a = Zl((t - e.scaleAt) / 180, 0, 1), r = a * a * (3 - 2 * a);
  return e.scaleFrom.map((s) => s + (1 - s) * r);
}
function hl(e, t) {
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
}), ml = (e, t, a) => ({
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
function Wd(e, t, a, r) {
  const s = Math.min((r - e.at) / 1e3, Gd), i = e.x + e.vx * s, c = i < a.left || i > a.right, u = Zl(i, a.left, a.right), { landed: p, ...m } = jl({ ...e, x: u }, t, s);
  if (p) return { airborne: null, landed: { x: u, y: p.top, posture: "stand", face: 0, view: null, on: p.element ?? null }, gone: !1 };
  const f = e.spin + (Math.sign(e.vx) || 1) * Tt.spin * s, h = { ...e, ...m, x: u, vx: c ? -e.vx * Tt.bounce : e.vx, spin: f, at: r, ...e.scaleFrom && { scale: Ea(e, r) } };
  return { airborne: h, landed: null, gone: h.speed < 0 && h.y <= a.top - Tt.away };
}
const me = { close: 60, open: 90, shut: 0.06, every: [2500, 6e3] };
function Kd(e) {
  if (e < 0 || e >= me.close + me.open) return 1;
  const t = e < me.close ? e / me.close : 1 - (e - me.close) / me.open;
  return 1 + (me.shut - 1) * t;
}
const gl = (e) => me.every[0] + e() * (me.every[1] - me.every[0]), Yd = ["data-figure-pile"], Vd = ["src"], Xd = {
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
    ], r = P([]);
    let s = 0;
    const i = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function c() {
      const _ = ++s, B = vi(Math.random).map((L, G) => ({ ...L, id: `${_}-${G}` }));
      r.value = [...r.value, { id: _, digits: B }], setTimeout(() => r.value = r.value.filter((L) => L.id !== _), Math.max(...B.map((L) => Math.max(L.moveMs, L.fadeMs))));
    }
    ya(
      () => t.blows,
      (_, B) => _ > B && !i() && c()
    );
    const u = (_) => ({
      left: `${_.x - _.size / 2}px`,
      top: `${_.y - _.size / 2}px`,
      width: `${_.size}px`,
      height: `${_.size}px`
    }), p = (_) => ({
      "--from-x": `${_.x}px`,
      "--from-y": `${_.y}px`,
      "--to-x": `${_.x + _.dx}px`,
      "--to-y": `${_.y + _.dy}px`,
      "--move-ms": `${_.moveMs}ms`,
      "--fade-ms": `${_.fadeMs}ms`
    }), m = S(() => ({ left: `${t.x}px`, top: `${t.y}px`, zIndex: t.ahead ? xa.ahead : xa.behind })), f = S(() => ({ transform: `translateY(${-t.up}px)` })), h = S(() => ({ transform: `scale(${t.scale})`, opacity: t.opacity })), x = S(() => ({
      width: `${t.block.width}px`,
      height: `${t.block.height}px`,
      bottom: `${-t.block.below}px`,
      "--blink-ms": `${Po.ms * t.block.pictures.length}ms`
    })), k = (_) => ({ animationDelay: `${-(t.block.pictures.length - _) * Po.ms}ms` });
    return (_, B) => (b(), w("div", {
      class: "code-parcel",
      style: ne(m.value),
      "aria-hidden": "true"
    }, [
      O("div", {
        class: "code-parcel-placed",
        style: ne(f.value)
      }, [
        O("div", {
          class: "code-parcel-sized",
          style: ne(h.value)
        }, [
          O("div", {
            class: "code-parcel-box",
            style: ne(x.value),
            "data-figure-pile": e.piled ? "" : null
          }, [
            (b(!0), w(I, null, U(e.block.pictures, (L, G) => (b(), w("img", {
              key: G,
              class: Nl(["code-parcel-step", { blinks: e.block.pictures.length > 1 }]),
              src: L,
              style: ne(k(G)),
              alt: ""
            }, null, 14, Vd))), 128))
          ], 12, Yd)
        ], 4)
      ], 4),
      (b(!0), w(I, null, U(r.value, (L) => (b(), w("div", {
        key: L.id,
        class: "code-parcel-dust"
      }, [
        (b(), w(I, null, U(a, (G) => O("span", {
          key: `${G.x}/${G.y}`,
          class: "code-parcel-cloud",
          style: ne(u(G))
        }, null, 4)), 64)),
        (b(!0), w(I, null, U(L.digits, (G) => (b(), w("span", {
          key: G.id,
          class: "code-parcel-digit",
          style: ne(p(G))
        }, _a(G.text), 5))), 128))
      ]))), 128))
    ], 4));
  }
}, Zd = /* @__PURE__ */ Ge(Xd, [["__scopeId", "data-v-191db8a4"]]), W = { ink: "#272936", paper: "#f6f1e3", red: "#d9413b", wood: "#8a5a2b", gold: "#e8b84a", light: "#fff3a8", silver: "#c3c7d1", smoke: "#e9e7e1" }, Jd = ["transform"], Qd = ["fill"], ef = ["fill"], tf = ["fill"], nf = {
  __name: "AskSign",
  props: {
    u: { type: Number, required: !0 },
    hand: { type: Object, required: !0 }
  },
  setup(e) {
    const t = e, a = X.ask_sign, r = S(() => t.u > a.raise[0] && t.u < a.lower[1]), s = S(() => {
      const [i, c] = a.waggle, u = Math.min(Math.max((t.u - i) / (c - i), 0), 1);
      return 14 * Math.sin(2 * Math.PI * a.waggles * u) * Math.sin(Math.PI * u);
    });
    return (i, c) => r.value ? (b(), w("g", {
      key: 0,
      transform: `translate(${e.hand.x} ${e.hand.y}) rotate(${s.value})`
    }, [
      O("rect", {
        x: "-1.2",
        y: "-22",
        width: "2.4",
        height: "26",
        fill: j(W).wood
      }, null, 8, Qd),
      O("rect", {
        x: "-12",
        y: "-40",
        width: "24",
        height: "20",
        rx: "2",
        fill: j(W).paper,
        "stroke-width": "1.4"
      }, null, 8, ef),
      O("text", {
        x: "0",
        y: "-24.5",
        "text-anchor": "middle",
        class: "figure-act-mark",
        fill: j(W).ink,
        stroke: "none"
      }, "?", 8, tf)
    ], 8, Jd)) : q("", !0);
  }
}, af = /* @__PURE__ */ Ge(nf, [["__scopeId", "data-v-e8e687f5"]]), of = ["x1", "y1", "x2", "y2", "stroke"], lf = { id: "figure-act-ball" }, sf = ["cx", "cy", "r"], rf = ["cx", "cy", "r"], uf = { "clip-path": "url(#figure-act-ball)" }, cf = ["x", "y", "width", "height", "fill"], df = ["cx", "cy", "r", "stroke"], ff = ["cx", "cy", "fill"], pf = {
  __name: "DiscoBall",
  props: {
    u: { type: Number, required: !0 },
    middle: { type: Number, required: !0 },
    floor: { type: Number, required: !0 },
    size: { type: Number, required: !0 },
    ball: { type: Object, required: !0 }
  },
  setup(e) {
    const t = e, a = S(() => {
      const r = X.disco.ball * t.size / 2, s = t.floor - t.ball.hangs, i = t.u * 40, c = [];
      for (let p = -2; p <= 2; p++) for (let m = -3; m <= 3; m++) c.push({ name: `tile${p}:${m}`, x: t.middle + m * r * 0.42 + i * r * 0.42 % (r * 0.42) - r * 0.21, y: s + p * r * 0.42, light: (p + m + Math.floor(i)) % 3 === 0 });
      const u = Array.from({ length: 9 }, (p, m) => {
        const f = m * 0.7 + t.u * 9;
        return { name: `fleck${m}`, x: t.middle + Math.cos(f) * t.size * (0.55 + 0.1 * (m % 3)), y: s + 10 + Math.abs(Math.sin(f * 1.3)) * t.size * 0.75, colour: `hsl(${(m * 40 + t.u * 1400) % 360} 95% 65%)` };
      });
      return { x: t.middle, y: s, r, top: t.floor - t.ball.above, tiles: c, flecks: u };
    });
    return (r, s) => (b(), w(I, null, [
      O("line", {
        x1: a.value.x,
        y1: a.value.top,
        x2: a.value.x,
        y2: a.value.y - a.value.r,
        stroke: j(W).silver,
        "stroke-width": "1"
      }, null, 8, of),
      O("clipPath", lf, [
        O("circle", {
          cx: a.value.x,
          cy: a.value.y,
          r: a.value.r
        }, null, 8, sf)
      ]),
      O("circle", {
        cx: a.value.x,
        cy: a.value.y,
        r: a.value.r,
        fill: "#8d93a3"
      }, null, 8, rf),
      O("g", uf, [
        (b(!0), w(I, null, U(a.value.tiles, (i) => (b(), w("rect", {
          key: i.name,
          x: i.x - a.value.r * 0.18,
          y: i.y - a.value.r * 0.18,
          width: a.value.r * 0.36,
          height: a.value.r * 0.36,
          fill: i.light ? "#f4f6fb" : "#b9bfcc"
        }, null, 8, cf))), 128))
      ]),
      O("circle", {
        cx: a.value.x,
        cy: a.value.y,
        r: a.value.r,
        fill: "none",
        stroke: j(W).ink,
        "stroke-width": "0.8"
      }, null, 8, df),
      (b(!0), w(I, null, U(a.value.flecks, (i) => (b(), w("circle", {
        key: i.name,
        cx: i.x,
        cy: i.y,
        r: "2.2",
        fill: i.colour,
        opacity: "0.85"
      }, null, 8, ff))), 128))
    ], 64));
  }
}, hf = ["transform"], mf = ["fill"], gf = ["transform"], yf = ["x", "y", "height", "fill"], vf = ["x", "y", "height"], bf = ["x", "y", "width", "fill"], xf = ["x", "y", "fill"], wf = ["d"], kf = {
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
    const t = e, a = { across: 0.24, top: 0.3 }, r = X.file_card, s = S(() => ({ x: t.middle + t.out * a.across * t.size, top: t.floor - a.top * t.size, up: bi(r, t.u) })), i = S(() => `translate(0 ${t.floor}) scale(1 ${s.value.up}) translate(0 ${-t.floor})`), c = S(() => ce(t.u, r.opens) * (1 - ce(t.u, r.shuts))), u = S(() => ce(t.u, r.filed));
    return (p, m) => (b(), w(I, null, [
      u.value < 1 && e.u > j(r).reach[0] ? (b(), w("g", {
        key: 0,
        transform: `translate(${e.hand.x} ${e.hand.y + 3 + 6 * u.value})`
      }, [
        O("rect", {
          x: "-6",
          y: "-4",
          width: "12",
          height: "8",
          fill: j(W).paper,
          "stroke-width": "0.7"
        }, null, 8, mf),
        m[0] || (m[0] = O("path", {
          d: "M-4 -1.5h8M-4 1h6",
          "stroke-width": "0.5"
        }, null, -1))
      ], 8, hf)) : q("", !0),
      O("g", { transform: i.value }, [
        O("rect", {
          x: s.value.x - 12,
          y: s.value.top,
          width: 24,
          height: e.floor - s.value.top,
          rx: "1",
          fill: j(W).wood
        }, null, 8, yf),
        O("rect", {
          x: s.value.x - 10,
          y: s.value.top + 2 - 5 * c.value,
          width: "20",
          height: 5 * c.value,
          fill: "#5b3a1c",
          "stroke-width": "0.6"
        }, null, 8, vf),
        O("rect", {
          x: s.value.x - 10 - 1.5 * c.value,
          y: s.value.top + 2,
          width: 20 + 3 * c.value,
          height: "10",
          rx: "1",
          fill: j(W).wood
        }, null, 8, bf),
        O("rect", {
          x: s.value.x - 10,
          y: s.value.top + 14,
          width: "20",
          height: "10",
          rx: "1",
          fill: j(W).wood
        }, null, 8, xf),
        O("path", {
          d: `M${s.value.x - 3} ${s.value.top + 7}h6M${s.value.x - 3} ${s.value.top + 19}h6`,
          "stroke-width": "1.4"
        }, null, 8, wf)
      ], 8, gf)
    ], 64));
  }
}, _f = ["cx", "cy", "r", "opacity"], $f = {
  __name: "FumeSteam",
  props: {
    u: { type: Number, required: !0 },
    head: { type: Object, required: !0 }
  },
  setup(e) {
    const t = e, a = X.fume, r = S(() => {
      const s = (t.u - a.steam[0]) / (a.steam[1] - a.steam[0]);
      return s <= 0 || s >= 1 ? [] : Array.from({ length: 6 }, (i, c) => {
        const u = (s * 3 + c / 6) % 1, p = c % 2 ? 1 : -1;
        return { name: `puff${c}`, x: t.head.x + p * (12 + 10 * u), y: t.head.y - 14 - 26 * u, r: 2.5 + 4 * u, fade: 1 - u };
      });
    });
    return (s, i) => (b(!0), w(I, null, U(r.value, (c) => (b(), w("circle", {
      key: c.name,
      cx: c.x,
      cy: c.y,
      r: c.r,
      fill: "#e9e7e1",
      stroke: "#a9adb8",
      "stroke-width": "0.6",
      opacity: c.fade
    }, null, 8, _f))), 128));
  }
}, Mf = ["transform"], Sf = ["cx", "cy", "r", "fill", "opacity"], Af = ["d", "fill", "opacity"], Of = {
  __name: "HandRub",
  props: {
    u: { type: Number, required: !0 },
    hand: { type: Object, required: !0 }
  },
  setup(e) {
    const t = e, a = [[-9, -12], [8, -18], [1, -26]], r = X.hand_rub, s = S(() => {
      const i = (t.u - r.puff[0]) / (r.puff[1] - r.puff[0]);
      if (i <= 0 || i >= 1) return null;
      const c = Math.min(i * 6, 1, (1 - i) * 6), u = Array.from({ length: r.puffs }, (m, f) => {
        const h = (i + f / r.puffs) % 1;
        return { name: `puff${f}`, x: (f - (r.puffs - 1) / 2) * 5 + 3 * Math.sin(h * 6 + f), y: -4 - 16 * h, r: 2 + 3.5 * h, fade: c * (1 - h) * 0.85 };
      }), p = a.slice(0, r.sparkles).map(([m, f], h) => {
        const x = 2.6 * Math.max(Math.sin(Math.PI * ((i * 4 + h / 3) % 1)), 0), k = `M${m} ${f - x * 2}L${m + x * 0.5} ${f - x * 0.5}L${m + x * 2} ${f}L${m + x * 0.5} ${f + x * 0.5}L${m} ${f + x * 2}L${m - x * 0.5} ${f + x * 0.5}L${m - x * 2} ${f}L${m - x * 0.5} ${f - x * 0.5}Z`;
        return { name: `sparkle${h}`, shape: k, fade: c };
      });
      return { puffs: u, sparkles: p };
    });
    return (i, c) => s.value ? (b(), w("g", {
      key: 0,
      class: "figure-act-rub",
      transform: `translate(${e.hand.x} ${e.hand.y})`
    }, [
      (b(!0), w(I, null, U(s.value.puffs, (u) => (b(), w("circle", {
        key: u.name,
        cx: u.x,
        cy: u.y,
        r: u.r,
        fill: j(W).smoke,
        stroke: "#a9adb8",
        "stroke-width": "0.5",
        opacity: u.fade
      }, null, 8, Sf))), 128)),
      (b(!0), w(I, null, U(s.value.sparkles, (u) => (b(), w("path", {
        key: u.name,
        d: u.shape,
        fill: j(W).light,
        stroke: "none",
        opacity: u.fade
      }, null, 8, Af))), 128))
    ], 8, Mf)) : q("", !0);
  }
}, Ef = ["transform"], Nf = ["d"], Ff = ["d"], Bf = ["x", "y", "width", "height"], Tf = ["d"], Lf = ["y"], zf = ["transform", "opacity"], Rf = ["cx", "cy", "r"], If = ["transform"], Cf = {
  __name: "PackBox",
  props: {
    u: { type: Number, required: !0 },
    middle: { type: Number, required: !0 },
    floor: { type: Number, required: !0 }
  },
  setup(e) {
    const t = e, a = [-2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4].map((c, u) => ({ name: `cloud${u}`, way: c })), r = [1, 2, 3, 4].map((c) => ({ name: `bit${c}`, place: c })), s = X.pack_box, i = S(() => {
      const { into: c, out: u } = $a(s, t.u), p = u >= s.pops, m = p ? Math.min((u - s.pops) / 0.4, 1) : 0;
      return { grown: ce(c, s.appears), popped: p, puff: m, x: t.middle, width: 50, height: 36 };
    });
    return (c, u) => (b(), w(I, null, [
      !i.value.popped && i.value.grown > 0 ? (b(), w("g", {
        key: 0,
        transform: `translate(${i.value.x} ${e.floor}) scale(${i.value.grown})`
      }, [
        O("path", {
          d: `M${-i.value.width / 2} ${-i.value.height}l-12 -9 4 -4 8 13Z`,
          fill: "#b88a55"
        }, null, 8, Nf),
        O("path", {
          d: `M${i.value.width / 2} ${-i.value.height}l12 -9 -4 -4 -8 13Z`,
          fill: "#b88a55"
        }, null, 8, Ff),
        O("rect", {
          x: -i.value.width / 2,
          y: -i.value.height,
          width: i.value.width,
          height: i.value.height,
          fill: "#c89b63"
        }, null, 8, Bf),
        O("path", {
          d: `M${-i.value.width / 2} ${-i.value.height + 5}H${i.value.width / 2}`,
          "stroke-width": "0.6"
        }, null, 8, Tf),
        O("rect", {
          x: "-7",
          y: -i.value.height + 8,
          width: "14",
          height: "6",
          fill: "#e8d4b0",
          "stroke-width": "0.6"
        }, null, 8, Lf)
      ], 8, Ef)) : q("", !0),
      i.value.popped && i.value.puff < 1 ? (b(), w("g", {
        key: 1,
        transform: `translate(${i.value.x} ${e.floor - 18})`,
        opacity: 1 - i.value.puff
      }, [
        (b(!0), w(I, null, U(j(a), (p) => (b(), w("circle", {
          key: p.name,
          cx: Math.sin(p.way) * 30 * i.value.puff,
          cy: -Math.cos(p.way) * 16 * i.value.puff,
          r: 8 + 8 * i.value.puff,
          fill: "#e9e7e1",
          stroke: "#a9adb8",
          "stroke-width": "0.8"
        }, null, 8, Rf))), 128)),
        (b(!0), w(I, null, U(j(r), (p) => (b(), w("rect", {
          key: p.name,
          x: "-3.5",
          y: "-2",
          width: "7",
          height: "4",
          fill: "#c89b63",
          transform: `translate(${(p.place - 2.5) * 22 * i.value.puff} ${-20 * i.value.puff + 30 * i.value.puff * i.value.puff}) rotate(${p.place * 70 * i.value.puff})`,
          "data-act-box-bit": ""
        }, null, 8, If))), 128))
      ], 8, zf)) : q("", !0)
    ], 64));
  }
}, Df = ["x1", "y1", "x2", "y2"], Pf = ["transform"], qf = ["href", "x", "y", "width", "height"], jf = {
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
    const t = e, a = S(() => xi(t.canopy, t.head, [t.hand, t.other], t.size, t.u)), r = S(() => a.value.lines.map(({ from: i, to: c }, u) => ({ name: `line${u}`, x1: i.x, y1: i.y, x2: c.x, y2: c.y }))), s = S(() => `rotate(${a.value.turn} ${a.value.middle.x} ${a.value.middle.y})`);
    return (i, c) => (b(), w(I, null, [
      (b(!0), w(I, null, U(r.value, (u) => (b(), w("line", {
        key: u.name,
        x1: u.x1,
        y1: u.y1,
        x2: u.x2,
        y2: u.y2,
        "stroke-width": "0.7",
        "data-chute-line": ""
      }, null, 8, Df))), 128)),
      O("g", { transform: s.value }, [
        O("image", {
          href: e.canopy.picture,
          x: a.value.left,
          y: a.value.top,
          width: e.canopy.width,
          height: e.canopy.height,
          "data-chute-canopy": ""
        }, null, 8, qf)
      ], 8, Pf)
    ], 64));
  }
}, Gf = ["transform"], Hf = ["y1", "y2", "stroke"], Uf = ["x1", "y1", "x2", "y2", "stroke"], Wf = ["x1", "x2", "stroke"], Kf = ["d", "stroke"], Yf = {
  __name: "PogoStick",
  props: {
    u: { type: Number, required: !0 },
    middle: { type: Number, required: !0 },
    floor: { type: Number, required: !0 },
    size: { type: Number, required: !0 }
  },
  setup(e) {
    const t = e, a = S(() => {
      const { draw: r, drop: s, stick: i } = X.pogo, c = i * t.size, u = ce(t.u, s), p = Array.from({ length: 7 }, (m, f) => `${f % 2 ? 3 : -3} ${2 + f * 1.6}`).join(" L");
      return {
        shown: ce(t.u, [r[1] * 0.6, r[1]]),
        foot: t.floor,
        top: -t.size * X.pogo.handles,
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
      O("line", {
        x1: "0",
        y1: a.value.top,
        x2: "0",
        y2: a.value.bottom,
        stroke: j(W).silver,
        "stroke-width": "2.6",
        "stroke-linecap": "round"
      }, null, 8, Hf),
      O("line", {
        x1: -a.value.bar,
        y1: a.value.top,
        x2: a.value.bar,
        y2: a.value.top,
        stroke: j(W).silver,
        "stroke-width": "3",
        "stroke-linecap": "round"
      }, null, 8, Uf),
      O("line", {
        x1: -a.value.peg,
        y1: "-1",
        x2: a.value.peg,
        y2: "-1",
        stroke: j(W).red,
        "stroke-width": "2.4",
        "stroke-linecap": "round"
      }, null, 8, Wf),
      O("path", {
        d: a.value.spring,
        stroke: j(W).gold,
        "stroke-width": "1.2",
        fill: "none"
      }, null, 8, Kf)
    ], 8, Gf)) : q("", !0);
  }
}, Vf = ["x", "y"], Xf = ["x", "y"], Zf = {
  __name: "PressPlate",
  props: {
    u: { type: Number, required: !0 },
    middle: { type: Number, required: !0 },
    size: { type: Number, required: !0 }
  },
  setup(e) {
    const t = e, a = X.press, r = S(() => {
      const { into: s, out: i } = $a(a, t.u);
      return t.size * 0.27 - 6 - 70 * (1 - ce(s, a.lowers)) - 90 * ce(i, a.lifts);
    });
    return (s, i) => (b(), w(I, null, [
      O("rect", {
        x: e.middle - 2,
        y: r.value - 200,
        width: "4",
        height: "200",
        fill: "#a9adb8"
      }, null, 8, Vf),
      O("rect", {
        x: e.middle - 22,
        y: r.value,
        width: "44",
        height: "6",
        rx: "1",
        fill: "#6b6f7c"
      }, null, 8, Xf)
    ], 64));
  }
}, Jf = ["opacity"], Qf = ["cx", "cy", "r", "fill"], ep = ["opacity"], tp = ["cx", "cy", "r", "fill"], np = ["cx", "cy", "r", "fill"], ap = ["cx", "cy", "r", "fill", "opacity"], op = {
  __name: "ThoughtCloud",
  props: {
    name: { type: String, required: !0 },
    u: { type: Number, required: !0 },
    head: { type: Object, required: !0 },
    out: { type: Number, required: !0 },
    size: { type: Number, required: !0 }
  },
  setup(e) {
    const t = e, a = { across: 0.24, above: 0.36, wide: 0.3, puffs: [[0.08, 0.12, 0.022], [0.13, 0.2, 0.03], [0.18, 0.27, 0.04]] }, r = [[-0.32, 0.05, 0.2], [-0.12, -0.12, 0.24], [0.14, -0.1, 0.22], [0.32, 0.06, 0.18], [0, 0.12, 0.22]], s = (c) => c * t.size, i = S(() => {
      const { puffs: c, cloud: u, rise: p, pulse: m, frames: f, fps: h } = X[t.name];
      if (!m) return null;
      const x = (o, ye) => c ? ce(t.u, [o, ye]) : 1, k = c ? ce(t.u, [u[0], c[1]]) * (1 - ce(t.u, [u[1], p[1]])) : 1;
      if (!k) return null;
      const _ = t.u * f / h, B = a.puffs.map(([o, ye, pt], T) => ({
        name: `puff${T}`,
        x: t.head.x + t.out * s(o),
        y: t.head.y - s(ye),
        r: s(pt) * (c ? x(c[0] + T * (c[1] - c[0]) / 3, c[0] + (T + 1) * (c[1] - c[0]) / 3) : 1)
      })), L = t.head.x + t.out * s(a.across), G = t.head.y - s(a.above), $ = s(a.wide), Fe = r.map(([o, ye, pt], T) => ({ name: `bump${T}`, x: L + o * $, y: G + ye * $, r: pt * $ })), le = [-1, 0, 1].map((o, ye) => ({ name: `dot${ye}`, x: L + o * $ * 0.22, y: G, r: $ * 0.05 * (1 + 0.5 * Math.max(Math.sin(2 * Math.PI * (_ / m - ye / 3)), 0)), lit: 0.35 + 0.65 * Math.max(Math.sin(2 * Math.PI * (_ / m - ye / 3)), 0) }));
      return { shown: k, rising: B, bumps: Fe, dots: le, grown: c ? x(c[0] + 2 * (c[1] - c[0]) / 3, c[1]) : 1 };
    });
    return (c, u) => i.value ? (b(), w("g", {
      key: 0,
      opacity: i.value.shown,
      "data-thought-cloud": ""
    }, [
      (b(!0), w(I, null, U(i.value.rising, (p) => (b(), w("circle", {
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
        (b(!0), w(I, null, U(i.value.bumps, (p) => (b(), w("circle", {
          key: p.name,
          cx: p.x,
          cy: p.y,
          r: p.r,
          fill: j(W).paper,
          "stroke-width": "0.9"
        }, null, 8, tp))), 128)),
        (b(!0), w(I, null, U(i.value.bumps, (p) => (b(), w("circle", {
          key: p.name,
          cx: p.x,
          cy: p.y,
          r: p.r - 0.8,
          fill: j(W).paper,
          stroke: "none"
        }, null, 8, np))), 128)),
        (b(!0), w(I, null, U(i.value.dots, (p) => (b(), w("circle", {
          key: p.name,
          cx: p.x,
          cy: p.y,
          r: p.r,
          fill: j(W).ink,
          stroke: "none",
          opacity: p.lit,
          "data-thought-dot": ""
        }, null, 8, ap))), 128))
      ], 8, ep)) : q("", !0)
    ], 8, Jf)) : q("", !0);
  }
}, lp = ["opacity"], sp = ["d", "stroke"], rp = ["d"], ip = ["x", "y"], up = ["cx", "cy", "fill"], cp = ["cx", "cy", "fill"], dp = ["transform"], fp = ["x", "y", "font-size", "opacity", "fill"], pp = {
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
    const t = e, a = ["abc", "the", "ok", "do", "fix"], r = X.vacuum, s = S(() => {
      const { into: i, out: c } = $a(r, t.u), u = i * (1 - c), p = t.middle + t.out * t.size * 0.44, m = t.floor, f = { x: t.hand.x + t.out * 7, y: t.hand.y + 4 }, h = (t.u * (r.intro + r.hold + r.outro) - r.intro) / r.hold, x = Array.from({ length: r.words }, (k, _) => {
        const B = ((h * 2 + _ / r.words) % 1 + 1) % 1, L = { x: f.x + t.out * (70 + 12 * (_ % 3)), y: f.y - 30 + 13 * _ };
        return { x: L.x + (f.x - L.x) * B ** 1.6, y: L.y + (f.y - L.y) * B ** 1.6, size: 1 - 0.7 * B, opacity: ce(B, [0, 0.12]) * (1 - ce(B, [0.85, 1])), word: a[_] };
      });
      return {
        on: u,
        x: p,
        y: m,
        nozzle: `translate(${f.x} ${f.y}) scale(${t.out} 1)`,
        words: x,
        hose: `M${p} ${m - 12}Q${p} ${f.y + 30} ${f.x - t.out * 6} ${f.y}`
      };
    });
    return (i, c) => s.value.on > 0 ? (b(), w("g", {
      key: 0,
      opacity: s.value.on
    }, [
      O("path", {
        d: s.value.hose,
        fill: "none",
        "stroke-width": "2.6",
        stroke: j(W).ink
      }, null, 8, sp),
      O("path", {
        d: s.value.hose,
        fill: "none",
        "stroke-width": "1.4",
        stroke: "#6366f1"
      }, null, 8, rp),
      O("rect", {
        x: s.value.x - 9,
        y: s.value.y - 16,
        width: "18",
        height: "14",
        rx: "4",
        fill: "#ef476f"
      }, null, 8, ip),
      O("circle", {
        cx: s.value.x - 5,
        cy: s.value.y - 2,
        r: "2.5",
        fill: j(W).ink
      }, null, 8, up),
      O("circle", {
        cx: s.value.x + 5,
        cy: s.value.y - 2,
        r: "2.5",
        fill: j(W).ink
      }, null, 8, cp),
      O("g", {
        transform: s.value.nozzle
      }, [...c[0] || (c[0] = [
        O("path", {
          d: "M-6 -1.6H2L6 -4.5V4.5L2 1.6H-6Z",
          fill: "#35374b"
        }, null, -1)
      ])], 8, dp),
      (b(!0), w(I, null, U(s.value.words, (u) => (b(), w("text", {
        key: u.word,
        x: u.x,
        y: u.y,
        "font-size": 7 * u.size,
        opacity: u.opacity,
        "text-anchor": "middle",
        class: "figure-act-word",
        stroke: "none",
        fill: j(W).paper
      }, _a(u.word), 9, fp))), 128))
    ], 8, lp)) : q("", !0);
  }
}, hp = /* @__PURE__ */ Ge(pp, [["__scopeId", "data-v-ff0fa3ef"]]), mp = ["transform"], gp = ["href", "x", "y", "width", "height"], yp = ["id"], vp = ["x", "y", "width", "height"], bp = ["clip-path", "data-act-surface"], xp = ["x", "y", "width", "height", "rx", "opacity"], wp = ["cx", "cy", "r", "opacity"], kp = ["cx", "cy", "rx", "ry", "opacity"], _p = ["cx", "cy", "r"], $p = ["opacity"], Mp = ["x", "y", "width", "height"], Sp = ["cx", "cy", "r"], Ap = ["cx", "cy", "r"], Op = ["cx", "cy", "r"], At = "#9bd34a", da = "#5f8f24", Ep = {
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
    const t = e, a = X.bug_shot, r = Wr(), s = S(() => {
      const m = Math.floor(t.u * a.frames / 2) % 2;
      return t.bugs.flatMap((f, h) => f.shot ? [] : [{ name: `bug${h}`, place: `translate(${f.x} ${f.y}) rotate(${f.turn})`, href: t.bug.pictures[m] }]);
    }), i = S(() => t.slush.filter((m) => !m.flying).map((m, f) => ({ ...m, name: `splash${f}` }))), c = S(() => t.slush.filter((m) => m.flying).map((m, f) => ({ ...m, name: `slush${f}` }))), u = S(() => ({ x: -t.bug.at.x, y: -t.bug.at.y, width: t.bug.width, height: t.bug.height })), p = S(() => t.camera.flatMap((m, f) => wi(m.seconds, t.size, m.from, { x: t.middle, y: t.size * 0.5 }).map((h, x) => ({ ...h, name: `drop${f}-${x}` }))));
    return (m, f) => (b(), w(I, null, [
      (b(!0), w(I, null, U(s.value, (h) => (b(), w("g", {
        key: h.name,
        transform: h.place
      }, [
        O("image", {
          href: h.href,
          x: u.value.x,
          y: u.value.y,
          width: u.value.width,
          height: u.value.height,
          "data-act-bug": ""
        }, null, 8, gp)
      ], 8, mp))), 128)),
      O("defs", null, [
        (b(!0), w(I, null, U(i.value, (h) => (b(), w(I, {
          key: h.name
        }, [
          h.clip ? (b(), w("clipPath", {
            key: 0,
            id: `${j(r)}-${h.name}`
          }, [
            O("rect", {
              x: h.clip.left,
              y: h.clip.top,
              width: h.clip.right - h.clip.left,
              height: h.clip.bottom - h.clip.top
            }, null, 8, vp)
          ], 8, yp)) : q("", !0)
        ], 64))), 128))
      ]),
      (b(!0), w(I, null, U(i.value, (h) => (b(), w("g", {
        key: h.name,
        "clip-path": h.clip ? `url(#${j(r)}-${h.name})` : null,
        "data-act-surface": h.on === "surface" ? "" : null
      }, [
        h.run > 0 ? (b(), w(I, { key: 0 }, [
          O("rect", {
            x: h.x - h.r * 0.22,
            y: h.y,
            width: h.r * 0.44,
            height: h.run,
            rx: h.r * 0.2,
            fill: At,
            stroke: "none",
            opacity: h.opacity * 0.75,
            "data-act-run": ""
          }, null, 8, xp),
          O("circle", {
            cx: h.x,
            cy: h.y + h.run,
            r: h.r * 0.4,
            fill: At,
            stroke: da,
            "stroke-width": "0.5",
            opacity: h.opacity * 0.9
          }, null, 8, wp)
        ], 64)) : q("", !0),
        O("ellipse", {
          cx: h.x,
          cy: h.y,
          rx: h.r * (h.on === "floor" || h.on === "top" ? 1.4 : 0.7),
          ry: h.r * (h.on === "floor" || h.on === "top" ? 0.7 : 1.4),
          fill: At,
          stroke: da,
          "stroke-width": "0.5",
          opacity: h.opacity * 0.9,
          "data-act-splash": ""
        }, null, 8, kp)
      ], 8, bp))), 128)),
      (b(!0), w(I, null, U(c.value, (h) => (b(), w("circle", {
        key: h.name,
        cx: h.x,
        cy: h.y,
        r: h.r,
        fill: At,
        stroke: da,
        "stroke-width": "0.5",
        "data-act-slush": ""
      }, null, 8, _p))), 128)),
      (b(!0), w(I, null, U(p.value, (h) => (b(), w("g", {
        key: h.name,
        class: "figure-act-lens",
        opacity: h.fade
      }, [
        h.landed ? (b(), w(I, { key: 0 }, [
          O("rect", {
            x: h.x - h.r * 0.25,
            y: h.y,
            width: h.r * 0.5,
            height: h.run,
            rx: "2",
            fill: "#9bd34a",
            opacity: "0.8"
          }, null, 8, Mp),
          O("circle", {
            cx: h.x,
            cy: h.y + h.run,
            r: h.r * 0.4,
            fill: "#9bd34a"
          }, null, 8, Sp)
        ], 64)) : q("", !0),
        O("circle", {
          cx: h.x,
          cy: h.y,
          r: h.r,
          fill: At,
          opacity: "0.85",
          "data-act-lens": ""
        }, null, 8, Ap),
        O("circle", {
          cx: h.x - h.r * 0.3,
          cy: h.y - h.r * 0.3,
          r: h.r * 0.25,
          fill: "#e8ffd0",
          opacity: "0.8"
        }, null, 8, Op)
      ], 8, $p))), 128))
    ], 64));
  }
}, Np = /* @__PURE__ */ Ge(Ep, [["__scopeId", "data-v-096d87ce"]]), Fp = ["width", "height", "viewBox", "data-act"], Bp = ["stroke"], Tp = {
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
    const t = e, a = (f) => f * t.size, r = S(() => ({ x: a(t.hand.x), y: a(t.hand.y) })), s = S(() => ({ x: a(t.hand.other.x), y: a(t.hand.other.y) })), i = S(() => ({ x: a(t.head.x), y: a(t.head.y) })), c = S(() => a(t.feet)), u = S(() => a(0.5)), p = S(() => t.hand.out), m = S(() => !!X[t.name].pulse);
    return (f, h) => (b(), w("svg", {
      class: "figure-act",
      width: e.size,
      height: e.size,
      viewBox: `0 0 ${e.size} ${e.size}`,
      "aria-hidden": "true",
      "data-act": e.name
    }, [
      O("g", {
        stroke: j(W).ink,
        "stroke-width": "1",
        "stroke-linejoin": "round"
      }, [
        e.name === "ask_sign" ? (b(), te(af, {
          key: 0,
          u: e.u,
          hand: r.value
        }, null, 8, ["u", "hand"])) : q("", !0),
        m.value ? (b(), te(op, {
          key: 1,
          name: e.name,
          u: e.u,
          head: i.value,
          out: p.value,
          size: e.size
        }, null, 8, ["name", "u", "head", "out", "size"])) : q("", !0),
        e.name === "file_card" ? (b(), te(kf, {
          key: 2,
          u: e.u,
          hand: r.value,
          middle: u.value,
          floor: c.value,
          out: p.value,
          size: e.size
        }, null, 8, ["u", "hand", "middle", "floor", "out", "size"])) : q("", !0),
        e.name === "hand_rub" ? (b(), te(Of, {
          key: 3,
          u: e.u,
          hand: r.value
        }, null, 8, ["u", "hand"])) : q("", !0),
        e.name === "fume" ? (b(), te($f, {
          key: 4,
          u: e.u,
          head: i.value
        }, null, 8, ["u", "head"])) : q("", !0),
        e.name === "bug_shot" && e.bug ? (b(), te(Np, {
          key: 5,
          u: e.u,
          middle: u.value,
          size: e.size,
          bug: e.bug,
          bugs: e.wallBugs,
          slush: e.slush,
          camera: e.camera
        }, null, 8, ["u", "middle", "size", "bug", "bugs", "slush", "camera"])) : q("", !0),
        e.name === "disco" && e.ball ? (b(), te(pf, {
          key: 6,
          u: e.u,
          middle: u.value,
          floor: c.value,
          size: e.size,
          ball: e.ball
        }, null, 8, ["u", "middle", "floor", "size", "ball"])) : q("", !0),
        e.name === "pogo" ? (b(), te(Yf, {
          key: 7,
          u: e.u,
          middle: u.value,
          floor: c.value,
          size: e.size
        }, null, 8, ["u", "middle", "floor", "size"])) : q("", !0),
        e.name === "chute" && e.canopy ? (b(), te(jf, {
          key: 8,
          u: e.u,
          head: i.value,
          hand: r.value,
          other: s.value,
          size: e.size,
          canopy: e.canopy
        }, null, 8, ["u", "head", "hand", "other", "size", "canopy"])) : q("", !0),
        e.name === "pack_box" ? (b(), te(Cf, {
          key: 9,
          u: e.u,
          middle: u.value,
          floor: c.value
        }, null, 8, ["u", "middle", "floor"])) : q("", !0),
        e.name === "press" ? (b(), te(Zf, {
          key: 10,
          u: e.u,
          middle: u.value,
          size: e.size
        }, null, 8, ["u", "middle", "size"])) : q("", !0),
        e.name === "vacuum" ? (b(), te(hp, {
          key: 11,
          u: e.u,
          hand: r.value,
          middle: u.value,
          floor: c.value,
          out: p.value,
          size: e.size
        }, null, 8, ["u", "hand", "middle", "floor", "out", "size"])) : q("", !0)
      ], 8, Bp)
    ], 8, Fp));
  }
}, Lp = /* @__PURE__ */ Ge(Tp, [["__scopeId", "data-v-4755d5ba"]]), zp = 1440 * 60;
class yl extends Map {
  constructor(t, a) {
    super(), this.key = t;
    const r = ki(t, {});
    for (const [s, i] of Object.entries(r && typeof r == "object" ? r : {}))
      Number.isFinite(i) && a - i < zp && super.set(s, i);
  }
  set(t, a) {
    return super.set(t, a), _i(this.key, Object.fromEntries(this)), this;
  }
}
const Rp = ["width"], Ip = ["href", "x", "y", "width", "height", "opacity", "transform"], Cp = ["transform", "opacity"], Ye = 48, Dp = {
  __name: "FixedRunBug",
  props: {
    bug: { type: Object, required: !0 },
    at: { type: Object, required: !0 }
  },
  setup(e) {
    const t = e, a = S(() => {
      const c = (t.at.edge ?? t.at.y) - Ye, u = t.at.edge ?? t.at.y + Ye;
      return { left: `${t.at.x - Ye}px`, top: `${c}px`, width: `${2 * Ye}px`, height: `${u - c}px` };
    }), r = S(() => ({ x: Ye, y: t.at.y - (t.at.edge ?? t.at.y) + Ye })), s = S(() => ({ href: t.bug.pictures[t.at.step], x: -t.bug.at.x, y: -t.bug.at.y, width: t.bug.width, height: t.bug.height })), i = S(() => t.at.flat > 0 ? t.at.shows : 0);
    return (c, u) => (b(), w("div", {
      class: "fixed-run-bug",
      style: ne(a.value),
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
        }, null, 8, Ip)) : q("", !0),
        i.value ? (b(), w("path", {
          key: 1,
          transform: `translate(${r.value.x} ${r.value.y}) scale(${1.3 - 0.3 * i.value})`,
          opacity: i.value,
          d: "M-9 0q2-6 6-3 1-6 5-2 5-3 5 2 5 1 2 4 3 4-3 3-4 4-7 1-3 0-6-1-6-4-4-3Z",
          fill: "#9bd34a",
          stroke: "#5f8f24",
          "stroke-width": "0.8"
        }, null, 8, Cp)) : q("", !0)
      ], 8, Rp))
    ], 4));
  }
}, Pp = /* @__PURE__ */ Ge(Dp, [["__scopeId", "data-v-6050b099"]]), fa = { waits: [3, 10], seconds: [3, 5], rests: [60, 150] }, dn = Object.freeze({ picture: null, until: 0, next: 0 }), pa = ([e, t], a) => e + (t - e) * a();
function qp(e, t, a, r) {
  return e.picture ? a < e.until && t.includes(e.picture) ? e : { ...dn, next: a + pa(fa.rests, r) } : t.length ? e.next ? a < e.next ? e : { picture: t[0], until: a + pa(fa.seconds, r), next: 0 } : { ...dn, next: a + pa(fa.waits, r) } : e.next > a ? e : dn;
}
const vl = (e) => ({ ...Ot(e), mood: "admiring", behind: !0, faces: !0 }), ge = { turns: 3, within: 1500, least: 6, lingers: 500, reach: 40, prolonged: 2e3, ticklish: 3e3 }, jp = (e, t, a) => t >= e.left - ge.reach && t <= e.right + ge.reach && a >= e.top - ge.reach && a <= e.bottom + ge.reach, bl = Object.freeze({ x: 0, way: 0, turns: [], at: -1 / 0, firstTurnAt: null, ticklishUntil: -1 / 0 });
function Gp(e, t, a) {
  const r = Hp(e, t, a);
  return { ...r, ticklishUntil: Jl(e, a) || Ql(r, a) ? a + ge.ticklish : e.ticklishUntil };
}
function Hp(e, t, a) {
  if (e.at === -1 / 0) return { x: t, way: 0, turns: [], at: a, firstTurnAt: null };
  const r = a - e.at <= ge.lingers ? e.firstTurnAt : null;
  if (Math.abs(t - e.x) < ge.least) return { ...e, at: a, firstTurnAt: r };
  const s = Math.sign(t - e.x), i = e.way !== 0 && s !== e.way, c = [...e.turns.filter((u) => a - u <= ge.within), ...i ? [a] : []];
  return { x: t, way: s, turns: c, at: a, firstTurnAt: i ? r ?? a : r };
}
const Jl = (e, t) => t <= e.ticklishUntil, Ql = (e, t) => e.turns.filter((a) => t - a <= ge.within).length >= ge.turns && e.firstTurnAt !== null && t - e.firstTurnAt >= ge.prolonged, xl = (e, t) => t - e.at <= ge.lingers && (Jl(e, t) || Ql(e, t)), Et = { most: 5, hold: [6, 22], ease: 1.8 }, Up = Object.freeze({ from: 0, to: 0, began: 0, until: 0 });
function Wp(e, t, a) {
  if (t < e.until) return e;
  const s = a() < 0.25 ? 0 : (a() < 0.5 ? -1 : 1) * Et.most * (0.4 + 0.6 * a()), i = Math.abs(s - e.to) < 1 ? -s || Et.most * 0.6 : s, [c, u] = Et.hold;
  return { from: es(e, t), to: i, began: t, until: t + Et.ease + c + a() * (u - c) };
}
function es(e, t) {
  const a = Math.min(Math.max((t - e.began) / Et.ease, 0), 1);
  return e.from + (e.to - e.from) * a * a * (3 - 2 * a);
}
const Kp = (e) => e.here && !e.leaving, Yp = 9.81, ts = 1.5, Vp = 0.3, ns = ts * Vp, ha = Math.sqrt(Yp / ns), Xp = 0.08, Zp = 0.025, Jp = 0.8, Qp = 1 / 30, ma = Object.freeze({ angle: 0, speed: 0 });
function wl({ angle: e, speed: t }, a, r, s, i) {
  const c = Math.min(Math.max(a, 0), Qp), u = e + s / i * ts / ns, p = Zp * Math.sin(ha * r / 2), m = -(ha ** 2) * (Math.sin(u) - p) - 2 * Xp * ha * t, f = t + m * c;
  return { angle: u + f * c, speed: f };
}
const eh = (e) => ({ angle: 0, speed: -e * Jp }), Se = { watch: 15, along: 0.3, glance: [1, 2], between: [6, 14], act: [8, 14], jump: 0.15, near: 0.9 }, kl = ["ledge_sit", "pocket_watch", "doze"];
function _l(e, t) {
  return !e || e.ended ? null : t - e.began < Se.watch ? "watch" : "sit";
}
const th = (e, t) => pn(Se.along, e, t);
function nh(e, t, a, r) {
  if (!t) return null;
  if (t === "watch") return { watches: !0, seated: !1, until: a };
  if (e != null && e.seated && a < e.until) return e;
  const s = !!(e != null && e.seated) && !e.watches, [i, c] = s ? Se.glance : Se.between;
  return { watches: s, seated: !0, until: a + i + r() * (c - i) };
}
function ah(e, t, a) {
  if (e && t < e.until) return e;
  const r = kl.filter((i) => i !== (e == null ? void 0 : e.clip));
  return { clip: e ? r[Math.floor(a() * r.length)] : kl[0], until: t + Se.act[0] + a() * (Se.act[1] - Se.act[0]) };
}
const oh = (e, t) => e !== null && (t - e >= Se.jump || e < Se.near && t >= Se.near), et = { attachment: 10, said: 9, pointer: 8, run: 7, carrier: 6, confession: 6, reading: 5, message: 4, typing: 3.5, work: 3, typing_pause: 1.75, picture: 2, bar: 2, glance: 1 }, as = { free: 1, gestures: 3, holds: 30, alone: 1 / 0 }, lh = 2, sh = 2, rh = (e) => {
  var t;
  return Number(((t = /\/files\/message\/(\d+)\//.exec(e)) == null ? void 0 : t[1]) ?? 0);
}, ih = 4, uh = 6, ch = 2;
function dh(e, t) {
  const a = t - e;
  return !e || a > uh ? null : a <= ch ? "typing" : "typing_pause";
}
const fh = /* @__PURE__ */ new Set(["attachment", "said", "run", "confession", "reading", "message", "typing", "typing_pause", "picture", "bar"]), ph = (e, t) => e.head === as.alone ? [] : t.map((a) => fh.has(a.kind) ? { ...a, point: { ...a.point, behind: !0 } } : a);
function hh(e, t, a) {
  return !e.amount || !e.point ? null : { ...e.point, ...Number.isFinite(e.point.readingCenter) ? { readingCenter: (e.point.readingCenter - t.x) / a } : {}, x: (e.point.x - t.x) / a, y: (e.point.y - t.y) / a, amount: e.amount, behind: !!e.point.behind, faces: !!e.point.faces, mood: e.point.mood ?? "" };
}
const mh = (e) => e.head >= as.holds, gh = (e, t) => e ? et[e.kind] / (et[e.kind] + t.head) : 0;
function yh(e, t, a) {
  const r = !!(e != null && e.look) && !t.some((f) => f.key === e.look.key) && a - e.seen < sh, s = r ? [...t, e.look] : t;
  if (!s.length) return { look: null, challenger: "", since: a, seen: a };
  const i = (e == null ? void 0 : e.look) && s.find((f) => f.key === e.look.key), c = (f) => r && f === i ? e.seen : a, u = Math.max(...s.map((f) => et[f.kind])), p = i && et[i.kind] === u ? i : s.find((f) => et[f.kind] === u);
  if (!i || i === p || os(p)) return { look: p, challenger: "", since: a, seen: c(p) };
  const m = e.challenger === p.key ? e.since : a;
  return a - m >= lh ? { look: p, challenger: "", since: a, seen: a } : { look: i, challenger: p.key, since: m, seen: c(i) };
}
const Lt = { glance: 1.2, rest: 2.5, halt: 1.5, purpose: 6 };
function vh(e, t, a, r, s) {
  const i = !!t && (t.point.x - r.x) * a >= 0;
  return e && s < e.since + Lt.glance + Lt.rest ? { look: i && s < e.since + Lt.glance ? t : null, glancing: e } : i ? { look: t, glancing: { since: s } } : { look: null, glancing: e };
}
const os = (e) => (e == null ? void 0 : e.kind) === "said", bh = (e) => e() < et.said / (et.said + Lt.purpose), xh = { every: [6, 14], lasts: 1.6, aside: 0.9, up: 0.12, sides: [-1, 1] }, wh = { every: [4, 10], lasts: 2.4, aside: 0.2, up: 0.04, sides: [-1, 0, 1] };
function kh(e, t, a, r) {
  return e && t < e.at + e.kind.lasts ? e : { at: t + r.every[0] + a() * (r.every[1] - r.every[0]), side: r.sides[Math.floor(a() * r.sides.length)], kind: r };
}
function _h(e, t, a, r) {
  return !e || t < e.at || t >= e.at + e.kind.lasts ? null : { x: a.x + e.side * e.kind.aside * r, y: a.y - e.kind.up * r };
}
const $h = [[/\b\w*test\w*\b/i, "testing"], [/\bbuild\b/i, "building"], [/\b(grep|rg|find)\b|journal search/i, "searching"]], Mh = (e) => {
  var t;
  return ((t = $h.find(([a]) => a.test(e))) == null ? void 0 : t[1]) ?? "running";
};
function Sh(e, t, a, { thinking: r = !1, waitingFor: s = "", waitingSince: i = 0, compacting: c = !1 } = {}) {
  if (c) return "compacting";
  const [u, ...p] = e.trim().split(/\s+/);
  if (u) return u === "Bash" ? Mh(p.join(" ")) : $i[u] ?? "running";
  if (r) return "thinking";
  const m = t && a - t >= Mi;
  return i ? "asking" : s ? m ? "asleep" : "waiting" : m ? "asleep" : "idle";
}
const $l = { user: "user", comment: "user", agent: "agent" }, Ah = (e) => e.filter((t) => $l[t.type] && !t.local).map((t) => ({ ...t, table: "message", author: $l[t.type] })), Oh = ["data-walking", "data-hopping", "data-trip", "data-clip", "data-beats"], Eh = ["data-voice", "data-failure"], A = 112, ga = 1e3, Ml = 30, Sl = 3, Al = 3, Nh = 0.1, Fh = 25, Bh = 1500, Th = 45, Ol = 0.3, El = "figure-demo", Lh = 60, zh = {
  __name: "VoiceFigure",
  props: {
    voice: { type: String, required: !0 },
    running: { type: String, default: "" },
    heardAt: { type: Number, default: 0 },
    thinking: { type: Boolean, default: !1 },
    waitingFor: { type: String, default: "" },
    asking: { type: Boolean, default: !1 },
    marks: { type: Array, default: () => [] },
    messages: { type: Array, default: () => [] },
    faces: { type: Array, default: () => [] },
    here: { type: Boolean, default: !0 }
  },
  emits: ["gone"],
  setup(e, { emit: t }) {
    var No;
    const a = { next: 0 };
    function r() {
      const n = performance.now();
      a.next || (a.next = n + gl(Math.random));
      const l = Kd(n - a.next);
      return n >= a.next + me.close + me.open && (a.next = n + gl(Math.random)), l;
    }
    const s = e, i = t, c = ((No = Kr(Si, null)) == null ? void 0 : No.environment) ?? "", u = P(null), p = S(() => s.voice), m = P(""), f = S(() => Ai(s.marks)), h = S(() => Ah(s.messages)), x = S(() => ({ question: s.asking ? 1 : 0, waiting: 0, suggestion: 0 }));
    let k = null, _ = [], B = 0, L = 0, G = dn;
    const $ = P(Date.now() / 1e3), Fe = P(0), le = P(0), { body: o, start: ye, stop: pt } = Uc(() => Ns()), T = P([]);
    let gn = null;
    const Ae = { reacted: new yl(`journal.figure.cooldowns.${c}`, Date.now() / 1e3), tally: { plain: 0, last: "" } }, ls = new yl(`journal.figure.pastimes.${c}`, Date.now() / 1e3), Na = /* @__PURE__ */ new Map(), Fa = /* @__PURE__ */ new Map();
    let Be = null;
    const Pt = P(null), yn = P(null), Ba = P(null), qt = P(null), Ta = /* @__PURE__ */ new Set();
    let jt = Date.now() / 1e3;
    const vn = jt;
    let M = { name: "", started: 0, shown: null, index: 0, closing: null }, Te = !1;
    const ht = P(null), La = P(0);
    let se = "stand";
    const za = P(!1), ss = S(() => {
      var n;
      return !!((n = o.trip) != null && n.moves && o.trip.hopping);
    }), rs = S(() => o.trip ? o.trip.started ? "walking" : "waiting to set off" : o.arriving ? "arriving" : ""), Oe = S(() => ({ data: { cards: f.value, person_at: Math.max(0, ...h.value.filter((n) => n.author === "user").map($t)) } })), Ra = P(null), bn = S(() => {
      var n;
      return { state: ((n = Ra.value) == null ? void 0 : n.state) ?? Sh(s.running, s.heardAt, $.value, { thinking: s.thinking, waitingFor: s.waitingFor, waitingSince: Fe.value, compacting: Oi(f.value, $.value) }), since: s.heardAt || $.value };
    }), xn = P(null), re = S(() => Ei(bn.value, xn.value, $.value));
    let V = { where: "rest", until: 0 }, wn = { until: 0 }, Ia = [], kn = !1, Ca = 0, Da = 0, Pa = 0;
    const Y = P([]);
    let is = 0, Gt = 0, _n = { frames: 1, lands: 0 }, Ht = { started: 0, landed: 0 };
    const $n = P([]), Ut = P(0), Mn = P(null), Sn = P(0), Le = P({ x: 0.5, y: 0.3 }), qa = P({ x: 0.75, y: 0.6, out: 1, other: { x: 0.25, y: 0.6 } });
    let K = null;
    const Wt = P(null);
    let R = null, ke = { state: "", clip: "" }, Kt = null, An = null, ja = null;
    const mt = (n) => _.find((l) => l.name === n) || _.find((l) => l.name === "idle"), Ga = (n) => _.some((l) => l.name === n), Ha = (n, l) => mt(n).postures.includes(l), On = (n) => Ga(n) && Ha(n, o.place.posture), D = () => ({ size: A, below: le.value });
    function us() {
      const n = Y.value.find((d) => d.state === "built");
      if (n) return Ua(n) ? "push" : "idle";
      const l = Y.value.find((d) => d.state === "building");
      return l ? tc(l, performance.now()) ? "inspect" : "work" : De ? o.place.stays ? "work" : "idle" : cl(re.value.state) ? "idle" : Wa();
    }
    const Ua = (n) => ic(_e(n), Ue()) && (!o.trip || o.trip.way === Math.sign(_e(n) - Ue()));
    function cs() {
      const n = Y.value.find((l) => l.state === "built");
      return !n || !Ua(n) ? 0 : _e(n) > Ue() ? 90 : 270;
    }
    const En = () => Ft(re.value.state) === "sleep";
    function Wa() {
      var l;
      const { state: n } = re.value;
      return ke.state !== n && (ke = { state: n, clip: rc(Ft(n), Math.random, On, { memory: Ae.reacted, now: $.value, home: ((l = o.footing) == null ? void 0 : l.id) === "home", bubble: !!tn() }) }, ke.clip === "rummage" && (V = { where: "rummage", until: $.value + Fh, way: k.reachWay(vd(o.place.x, he())) })), o.place.swings ? "rope_swing" : o.place.lean && ["idle", "waiting"].includes(Ft(n)) ? "lean" : Us() ? (An = ah(An, $.value, Math.random)).clip : ke.clip === "rummage" && (V.where !== "rummage" || o.trip) || ke.clip === "search" && !o.trip && !On("search") || ke.clip === "glass_bubble" && (o.trip || !tn()) ? "idle" : o.place.leans ? ds[ke.clip] ?? ke.clip : ke.clip;
    }
    const ds = { idle: "ledge_sit" }, fs = (n) => n.clip === "bug_shot" ? Qu(0, n.bugs.length).stretch : null;
    function Ka() {
      var N, C, H, ue, xe, $e, Me;
      if (E) return { clip: mt(E.phase === "scoot" ? "newest_scoot" : "idle"), facing: E.face };
      (!((N = o.trip) != null && N.moves) || o.trip.hopping) && (T.value = T.value.filter((qe) => qe.clip !== "stumble"));
      const n = Qo(T.value, bt()), l = (qe) => Td(mt(qe), o.place.posture, He, $.value), d = ((H = (C = n == null ? void 0 : n.bugs) == null ? void 0 : C[0]) == null ? void 0 : H.wall) === "left" ? 270 : ((xe = (ue = n == null ? void 0 : n.bugs) == null ? void 0 : ue[0]) == null ? void 0 : xe.wall) === "right" ? 90 : 180, g = n && l(n.clip) && { clip: n.clip, facing: n.clip === "bug_shot" ? d : Au(n.card, o.at.x + A / 2), onto: n.onto || n.approaching, holds: n.holds, stretch: fs(n) }, v = {
        mode: Ou(o),
        leaving: o.leaving,
        arriving: o.arriving,
        trip: o.trip,
        landing: o.landing,
        place: o.airborne ? { ...o.place, posture: o.airborne.posture, face: o.airborne.face ?? 0 } : o.place,
        beat: g,
        state: re.value.state,
        doing: us(),
        doingFacing: cs(),
        flying: Wt.value,
        eager: !!(R != null && R.on),
        chute: !!(($e = o.airborne) != null && $e.chute),
        grabbed: fl(o.airborne),
        composeFacing: ps(),
        readingFacing: $r()
      }, y = Eu(v, Ha), F = o.airborne || o.landing || o.arriving || o.leaving || (Me = o.trip) != null && Me.started || Wt.value || R != null && R.on || l(y.clip) ? y : { clip: o.place.leans ? "ledge_sit" : "idle", facing: o.place.face ?? 0 };
      return { ...F, clip: mt(F.clip) };
    }
    function ps() {
      var l;
      const n = (l = sa()) == null ? void 0 : l.getBoundingClientRect();
      return n ? n.left + n.width / 2 >= o.at.x + A / 2 ? Ml : -Ml : 0;
    }
    const Nn = (n) => `${n.clip.name}/${n.facing}`, hs = (n) => n.clip.fps * (n.pace ?? 1), Fn = (n) => (performance.now() - M.started) / 1e3 * hs(n), Bn = (n) => Ru(Fn(n), n.stretch), ze = (n) => Math.floor(Bn(n)), Tn = () => !M.shown || (M.closing !== null ? ze(M.shown) >= M.closing + M.shown.clip.outro : Fu(M.shown.clip, ze(M.shown), M.index)), Ln = (n, l = null) => Nu(n, (performance.now() - M.started) / 1e3, l);
    function ms(n = !1) {
      return kc(Math.abs(o.at.x - o.walk.from.x), D().size, n);
    }
    let zn = Up;
    function ee() {
      var ln, rt, pe, _t, it, ut, we, Fo, Bo, To, Lo, zo;
      if (cancelAnimationFrame(B), !k || document.hidden || (Is(), Ks())) return;
      if (M.shown && fc(M.shown, ze(M.shown))) return _s(M.shown);
      const n = Ka();
      if (n.clip.name === "bug_shot" && ys()) return;
      (ln = M.shown) != null && ln.clip.outro && n.clip.name !== M.shown.clip.name && M.closing === null && (M.closing = pc(M.shown.clip, ze(M.shown))), M.closing !== null && n.clip.name === M.shown.clip.name && ze(M.shown) < M.closing && (M.closing = null);
      const l = !!(n.startsLeg && ((rt = o.trip) != null && rt.pressing) && M.shown && !M.shown.clip.interruptible && M.name !== Nn(n)) && Ln(M.shown, o.trip);
      l && M.shown.once && !M.shown.arrival && !M.shown.departure && !M.shown.landed && (T.value = T.value.slice(1));
      const d = Te || fl(o.airborne) && ((pe = M.shown) == null ? void 0 : pe.clip.name) !== n.clip.name || Tn() || l || n.clip.cuts && ((_t = M.shown) == null ? void 0 : _t.clip.name) !== n.clip.name && Ln(M.shown);
      Te = !1;
      const g = ou(n, M.shown, d), v = (Nn(n) === M.name || g) && M.closing === null, y = g ? { ...n, facing: M.shown.facing } : v || d ? n : M.shown, F = Nn(y);
      if (M.name !== F || M.closing !== null && d) {
        const Hr = y.clip.intro && ((it = M.shown) == null ? void 0 : it.clip.name) === y.clip.name && M.closing === null;
        M = { name: F, started: Hr ? M.started : performance.now(), shown: y, index: 0, closing: null };
      } else M.shown = lu(M.shown, y);
      ht.value = y.clip;
      const N = ze(y);
      M.index = N;
      const C = Wo(y, ((ut = o.airborne) == null ? void 0 : ut.posture) ?? (o.trip ? Ko[o.place.posture].travels : o.place.posture), (we = o.trip) == null ? void 0 : we.moves);
      Ms({ posture: C, facing: E ? E.face : la.has(C) ? Yo(y.clip, o.place.face) : y.facing }), gs(y), vs(y), y === n && n.startsLeg && !o.trip.moves && Za(), se = J.posture, !((Fo = o.trip) != null && Fo.departed) && !o.airborne && !K && Yt();
      const H = su(gn, y.facing, performance.now() / 1e3);
      Be = ru(Be, Mr(y), performance.now() / 1e3);
      const ue = y.clip.name === "disco" ? iu(ze(y) / y.clip.frames, X.disco.beats) : uu(Be, performance.now() / 1e3, En());
      Pt.value = ue && { colour: ue.colour, strength: cu.halo * ue.glow * ue.open }, gn = H.looking;
      const xe = y.clip.name === "run", $e = se === "walk" || y.clip.name === "walk" || xe ? ms(xe) : null;
      za.value = $e !== null, Ut.value = (E == null ? void 0 : E.phase) === "scoot" ? Math.min((performance.now() - E.began) / (Mt.seconds * 1e3), 1) * (Mt.frames - 1) : du(y.clip, Bn(y), M.closing), Mn.value = J.turning ? mt("idle") : y.clip, Sn.value = J.turning ? 0 : Ut.value;
      const Me = performance.now() / 1e3;
      zn = Wp(zn, Me, Math.random);
      const qe = $s(y, Me);
      k.show(Mn.value, Sn.value, qe, {
        posture: se,
        eyes: (E == null ? void 0 : E.phase) === "notice" ? null : H.eyes,
        stride: (E == null ? void 0 : E.phase) === "scoot" ? Math.abs(E.to - E.from) / A : y.clip.name === "bug_smash" && oe.value ? oe.value.at.steps : (Bo = ve.value) != null && Bo.at.way ? -ve.value.at.steps : $e,
        walkWay: (E == null ? void 0 : E.phase) === "scoot" ? Math.sign(E.to - E.from) : y.clip.name === "bug_smash" && oe.value ? oe.value.at.way : ((To = ve.value) == null ? void 0 : To.at.way) ?? 0,
        throws: y.clip.name === "rummage" ? y.throws ?? (y.throws = fu(Math.random)) : null,
        leanWay: y.clip.name === "rummage" && V.where === "rummage" ? V.way : y.clip.name === "lean" ? ((Lo = o.place.lean) == null ? void 0 : Lo.way) ?? 0 : se === "composed" ? o.place.leans : 0,
        at: (E == null ? void 0 : E.phase) === "scoot" ? null : Ys() ?? Ar(y),
        target: zr(y),
        open: r(),
        screen: (E == null ? void 0 : E.phase) === "notice" ? null : ue,
        tilt: y.clip.name === "idle" ? Math.round(es(zn, Me) * 4) / 4 : 0,
        grabbed: !!((zo = o.airborne) != null && zo.held),
        airborne: !!(o.airborne || K)
      }), La.value = k.facing ?? y.facing, Le.value = k.headAt(), qa.value = k.handAt(), dr(y), Ps(y), Ds(), B = requestAnimationFrame(ee);
    }
    const oe = P(null);
    function gs(n) {
      var $e;
      const l = n.clip.name === "bug_smash";
      if (!l && (($e = T.value[0]) == null ? void 0 : $e.clip) !== "bug_smash") return oe.value = null;
      const d = Z().floors;
      if (!oe.value) return l && o.footing ? xs(d) : null;
      const { id: g, plan: v, bug: y, seconds: F } = oe.value, N = l ? tl(v, ze(n) / n.clip.frames, A) : oe.value.at, C = Ke(d, g), H = C ? C.left + N.bug.dx : y.x, ue = C && H >= C.left && H <= C.right ? { x: H, y: C.top } : null, xe = performance.now() / 1e3;
      oe.value = { ...oe.value, at: N, bug: Tu(y, ue, ks(y.x, y.y), xe - F), seconds: xe }, l && C && !o.airborne && ws(C, N.figure);
    }
    const ve = P(null);
    function ys() {
      var g, v;
      const n = Qo(T.value, bt());
      if ((n == null ? void 0 : n.clip) !== "bug_shot" || n.approaching || !((g = n.bugs) != null && g.length) || o.trip || o.airborne || o.arriving || o.landing || !o.footing || (v = M.shown) != null && v.once || !Tn() && !Ln(M.shown)) return !1;
      const l = Ke(Z().floors, o.footing.id);
      if (!l) return !1;
      const [d] = el(n.bugs, he(), { x: o.place.x, y: o.at.y + Le.value.y * A, left: l.left, right: l.right }, A);
      return n.approaching = !0, Math.abs(d.to - o.place.x) < 5 ? !1 : (Xt({ ...o.place, x: d.to, posture: "stand" }, { straight: !0 }), !0);
    }
    function vs(n) {
      var F, N, C, H;
      const l = n.clip.name === "bug_shot" ? (F = T.value[0]) == null ? void 0 : F.bugs : null;
      if (!(l != null && l.length) || !o.footing) return ve.value = null;
      const d = Ke(Z().floors, ((N = ve.value) == null ? void 0 : N.id) ?? o.footing.id);
      if (!d) return ve.value = null;
      const g = Fn(n), v = ((C = ve.value) == null ? void 0 : C.plan) ?? el(l, he(), { x: o.place.x, y: o.at.y + Le.value.y * A, left: d.left, right: d.right }, A), y = Lu(v, g, A);
      ve.value = { id: d.id, plan: v, left: ((H = ve.value) == null ? void 0 : H.left) ?? d.left, at: y }, o.airborne || bs(d.left + y.x - ve.value.left);
    }
    function bs(n) {
      if (Math.abs(n - o.place.x) < 0.3) return;
      const l = { ...o.place, x: n };
      o.footing = St(l) ?? o.footing, o.place = l;
    }
    function xs(n) {
      const l = Ke(n, o.footing.id);
      if (!l) return;
      const d = nc(o.place.x, l, A), g = tl(d, 0, A);
      oe.value = { id: o.footing.id, plan: d, at: g, bug: { x: l.left + g.bug.dx, y: l.top, speed: 0, falling: !1 }, seconds: performance.now() / 1e3 };
    }
    function ws(n, l) {
      const d = { ...o.place, x: n.left + l };
      Math.abs(d.x - o.place.x) < 0.3 || (o.footing = St(d) ?? o.footing, o.place = d);
    }
    const ks = (n, l) => Math.min(window.innerHeight + A, ...Pl(Z().floors).filter((d) => d.left <= n && n <= d.right && d.top >= l).map((d) => d.top)), Ya = S(() => {
      if (!oe.value) return null;
      const { at: n, bug: l, plan: d } = oe.value, g = l.falling ? 0 : n.bug.below, v = l.falling ? { whole: !0, flat: 0 } : {};
      return { ...n.bug, ...v, x: l.x, y: l.y + g, below: g, edge: g > 0 ? l.y : null, way: Math.sign(d.bug[1] - d.bug[0]) || -1, step: Math.floor(oe.value.seconds * 6) % 2 };
    });
    function _s(n) {
      if (n.clip.name === "tickle_swat" && xl(kt, performance.now()))
        return M.started = performance.now(), ee();
      if (n.departure) {
        o.leaving = !1, o.here = !1, i("gone");
        return;
      }
      return n.arrival ? o.arriving = !1 : n.landed ? o.landing = !1 : T.value = hc(T.value, n.clip.name), M = { name: "", started: 0, shown: null, index: 0, closing: null }, n.landed && no(), ee();
    }
    let Re = null;
    function $s(n, l) {
      return E ? E.facing : (Re = J.posture === "sit" && !J.turning && !n.clip.aside ? Iu(Re, J.facing, l, Math.random) : null, Re ? nl(Re, l) : J.facing);
    }
    let J = { posture: "stand", facing: 0, turning: !1 };
    function Ms(n) {
      if (J.turning && k.blending()) return;
      const l = Bu(J, n), d = (g) => g.posture === n.posture && g.facing === n.facing;
      J = { ...l, turning: !d(l) || J.turning && !d(J) };
    }
    const Ee = (n, l) => {
      const d = zt(n, D(), l);
      return { x: d.left, y: d.top };
    }, Yt = () => {
      if (o.place.posture === "hang" && se !== "hang") return;
      const n = Ee(o.place, se);
      se !== o.rested && Mu(o.rested, se) ? Vt() : se !== o.rested && Va(), o.rested = se, o.slide ? o.slide = { ...o.slide, to: n } : o.at = n;
    };
    function Va() {
      o.slide = { from: { ...o.at }, to: { ...o.at }, began: performance.now() };
    }
    const Rn = [];
    function Vt() {
      o.slide = null, Rn.splice(0).forEach((n) => n());
    }
    function Ss() {
      const { at: n, done: l } = Hc(o.slide, performance.now(), bc * 1e3);
      o.at = n, l && Vt();
    }
    async function Xt(n, { straight: l = !1, pace: d = 1, pressing: g = !1, urgent: v = !1 } = {}) {
      if (z || o.airborne || K || !Nt(n, D()) || E) return;
      if (!Jo(o.place, n, D(), { straight: l, pace: d, pressing: g })) return Es(n);
      o.trip = { to: n, straight: l, pace: d, pressing: g, urgent: v, footing: St(n), legs: [] };
      const y = o.trip;
      ee(), o.slide && await new Promise((F) => Rn.push(F)), o.trip === y && As();
    }
    function As() {
      if (!o.trip || z || o.airborne || K) return;
      const { to: n, straight: l, pace: d, pressing: g, footing: v } = o.trip, y = Zu(ia(n, v, D()), Z().floors, D()), F = Hn(), N = l ? { via: [], pogo: !1 } : hd(ae(), D(), o.place, y, { memory: Ae.reacted, now: $.value, room: F }, Math.random);
      if (!N)
        return o.trip = null, ee();
      const C = Jo(o.place, y, D(), { straight: l, pace: d, pressing: g, ...N, memory: Ae.reacted, now: $.value, room: F });
      if (o.way = Math.sign(y.x - o.place.x), Dn(), C)
        return o.trip = { ...o.trip, ...C, climbs: Ed(C.legs) }, Xa();
      o.footing = null, o.trip = null, tt(y, v), ee();
    }
    function Xa() {
      var g;
      const n = o.trip.legs, l = n.find((v) => v.ms > 0);
      if (!l) {
        const { to: v, footing: y, climbs: F } = o.trip, N = ia(v, y, D());
        return o.trip = null, He = Nd(!!F, (g = Z().floors.find((C) => C.id === (y == null ? void 0 : y.id))) == null ? void 0 : g.kind, performance.now() / 1e3), Math.hypot(N.x - v.x, N.y - v.y) >= 1 && Va(), tt(N, y), Uo(Y.value) && setTimeout(be), ee();
      }
      const d = n.slice(n.indexOf(l));
      o.trip = { ...o.trip, started: !0, moves: !1, hopping: !!l.hopping, clip: l.clip, facing: l.facing, legs: d }, ee();
    }
    function Za() {
      var v;
      if (!o.trip || z || o.airborne || K) return;
      const [n, ...l] = o.trip.legs, d = n.hopping || o.trip.departed ? { ...o.at } : Ee(o.place, Ko[o.place.posture].travels);
      if (Math.hypot(d.x - o.at.x, d.y - o.at.y) > 1) {
        if (o.trip.rising) return;
        o.trip = { ...o.trip, rising: !0 };
        const y = o.trip;
        return o.slide = { from: { ...o.at }, to: d, began: performance.now() }, void Rn.push(() => o.trip === y && Za());
      }
      if (J.turning) return;
      o.trip = { ...o.trip, moves: !0, departed: !0, legs: l }, o.footing = null;
      const g = Ie(d);
      o.walk = {
        from: d,
        began: performance.now(),
        on: n.hopping ? null : ((v = Mc(Z().floors, g.x, g.y, $c)) == null ? void 0 : v.id) ?? null
      }, o.leg = n;
    }
    function Os() {
      o.trip.hopping && (o.landing = !!o.trip.lands), Xa();
    }
    function Es(n) {
      const l = St(n);
      l && o.footing && l.id === o.footing.id || tt(n, l);
    }
    function tt(n, l = St(n)) {
      o.place = n, o.footing = l, lo = Xo(n, D());
    }
    function Ns() {
      var d, g, v, y, F, N;
      if (z && ((d = o.airborne) != null && d.held)) return Yn();
      if (K) return Ls();
      if (o.slide && !((g = o.trip) != null && g.moves) && !o.airborne && Ss(), (v = o.airborne) != null && v.held) return Yn();
      if ((y = o.airborne) != null && y.thrown) return nr();
      if (o.airborne) return zs();
      if ((F = o.trip) != null && F.moves) {
        o.trip.hopping ? Rs() : Fs(), (N = o.trip) != null && N.moves && Fc(o.leg, o.walk.began, performance.now()) && Os();
        return;
      }
      if (o.footing || (o.footing = mc(o.place)), !o.footing && gc(o.place)) return oo();
      if (!o.footing) return;
      qs();
      const n = yc(o.footing, o.place, D());
      if (!n) return oo();
      if (n.motion === "flung") return js(n.speed);
      if (o.footing = n.footing, n.motion === "dropping" && performance.now() - Qa >= Bh) return gt(o.place, null);
      const l = n.spot;
      Math.hypot(l.x - o.place.x, l.y - o.place.y) <= 0.3 || (n.motion === "launched" && !o.arriving && In("launched"), o.trip && (o.trip = { ...o.trip, legs: ca(o.trip.legs, l.x - o.place.x, l.y - o.place.y) }), o.place = l, Yt());
    }
    const Ja = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, Ie = (n) => ({ x: n.x + A / 2, y: n.y + (1 - le.value) * A });
    function Fs() {
      const n = Ie(ua(o.leg, o.walk.from, performance.now() - o.walk.began)), l = Nc(Z().floors, o.walk.on, n.x, n.y);
      if (l.falls) return gt({ ...n, posture: "stand" }, o.trip.to);
      (Math.abs(l.dx) > 0.3 || Math.abs(l.dy) > 0.3) && Bs(l.dx, l.dy), o.at = ua(o.leg, o.walk.from, performance.now() - o.walk.began);
    }
    function Bs(n, l) {
      const [d, g] = ca([o.walk.from, o.leg], n, l);
      o.walk = { ...o.walk, from: d }, o.leg = g, o.trip = { ...o.trip, legs: ca(o.trip.legs, n, l) };
    }
    function Ts() {
      const n = { x: o.place.x, y: o.place.y }, l = he().top, d = Oa(ae(), D(), n, l);
      d && (K = { began: performance.now(), hops: Pd(n, d, l), back: 0 }, o.footing = null);
    }
    function Ls() {
      const n = performance.now(), l = qd(K.hops, n - K.began, A);
      if (Wt.value = l.gone ? null : l, !l.gone) return void (o.at = Ee({ ...l, posture: "stand" }, "stand"));
      if (K.back || (K.back = n + jd(Math.random)), n < K.back) return;
      const d = he(), g = d.left + A / 2 + Math.random() * Math.max(d.right - d.left - A, 0);
      K = null, o.airborne = Dc(g, d.top - A / 4, Qe.chute * A, n), o.at = Ee(o.airborne, "stand"), ee();
    }
    let Qa = -1 / 0;
    function gt(n, l) {
      eo(Cc(n, l, Z().floors, performance.now()));
    }
    function eo(n) {
      de.value = null, o.airborne = n, o.trip = null, Vt(), o.footing = null, o.at = Ee(o.airborne, o.airborne.posture), ee();
    }
    function zs() {
      const { airborne: n, landed: l } = jc(o.airborne, Z().floors, performance.now(), Ja());
      if (n && qc(n, he().top)) return jn();
      o.at = Ee(n ?? l.spot, (n ?? l.spot).posture), o.airborne = n, l && (to(l.spot, l.standing), l.to && Xt(l.to));
    }
    function to(n, l) {
      Qa = performance.now(), o.landing = l, In("dropping"), tt(n), Yt(), l || no(), ee();
    }
    function no() {
      s.here || (o.leaving = !0, o.arriving = !1);
    }
    function Rs() {
      const n = o.trip;
      if (n.footing && !vc(n.footing, D())) return gt({ ...Ie(o.at), posture: "stand" }, null);
      const l = n.footing ? ia(n.to, n.footing, D()) : n.to, d = Ic(n, o.leg, o.walk.from, l, Hl(D()));
      if (d.lost) return gt({ ...Ie(o.at), posture: "stand" }, null);
      d.trip !== n && (o.trip = d.trip, o.leg = d.leg, o.walk = { ...o.walk, from: d.from }), o.at = ua(o.leg, o.walk.from, performance.now() - o.walk.began, Ja());
    }
    const yt = P(""), Zt = S(() => Ni(p.value)), In = (n) => yt.value = n, de = P(null);
    function Is() {
      if (!de.value) return;
      const n = Math.min(Math.max((performance.now() - de.value.began) / (Zt.value.ms / 2), 0), 1), l = n * n * (3 - 2 * n);
      de.value = n === 1 ? null : { ...de.value, angle: de.value.from * (1 - l), scale: de.value.scaleFrom.map((d) => d + (1 - d) * l) };
    }
    function Cs(n) {
      n.target === n.currentTarget && (yt.value === "launched" && We({ beat: "launched", time: $.value }), yt.value = "", de.value = null);
    }
    const Cn = P(0), vt = P(null), nt = P(null);
    function Ds() {
      const n = wd(o.place, o.trip);
      n !== nt.value && (nt.value = n);
    }
    function Ps(n) {
      var l;
      n.clip.name === "disco" && (vt.value = rl(o.place, D(), Z()), !vt.value && ((l = T.value[0]) == null ? void 0 : l.clip) === "disco" && (T.value = T.value.slice(1)));
    }
    let Jt = ma, ao = 0, Qt = null;
    function qs() {
      if (o.place.posture !== "hang" || o.trip) return Dn();
      const n = performance.now() / 1e3;
      Jt = Qt === null ? eh(o.way) : wl(Jt, n - ao, n, o.place.x - Qt, A), ao = n, Qt = o.place.x, Cn.value = Jt.angle;
    }
    function Dn() {
      Jt = ma, Qt = null, Cn.value = 0;
    }
    const Pn = S(() => {
      var l;
      const n = ((l = ht.value) == null ? void 0 : l.name) ?? "";
      return /^hang_[lr]$/.test(n) ? Fi(n.slice(-1), La.value, le.value) : null;
    });
    function qn() {
      E = null, V = zd(V), M = { name: "", started: 0, shown: null, index: 0, closing: null }, T.value = [], o.landing = !1;
    }
    function js(n) {
      qn(), In("launched"), eo(Pc({ ...Ie(o.at), face: o.place.face }, n, performance.now()));
    }
    function jn() {
      o.airborne = null, K = { began: performance.now(), hops: [], back: 0 };
    }
    function oo() {
      qn();
      const n = Rt(V, D(), o.place), l = { state: re.value.state, now: Date.now() / 1e3, near: o.place, figure: D(), cleared: wn };
      gt({ ...Ie(o.at), posture: "stand" }, Xl(n, l));
    }
    const Gs = () => ({
      voice: p.value,
      moving: !!(o.trip || K || E),
      place: o.place,
      beats: T.value.length,
      held: !!bt(),
      room: Hn(),
      arriving: o.arriving,
      leaving: o.leaving
    });
    function Gn() {
      const n = Q();
      return n.docked ? sn(n.element) : null;
    }
    const Hs = (n, l) => n === "sit" && !io() && !l && o.place.on === Q().element ? th(D(), o.place) : null, Us = () => _l(Gn(), $.value) === "sit" && !o.trip && o.place.posture === "sit" && o.place.on === Q().element, bt = () => hu({ box: Y.value.some((n) => n.state !== "piled") });
    function Hn() {
      const n = Q();
      return ku(re.value.state, n.docked ? sn(n.element) : null, $.value);
    }
    function be() {
      if (clearTimeout(L), z || o.airborne || K) return void (L = setTimeout(be, ga));
      $.value = Date.now() / 1e3, Fe.value = Ii(x.value, Fe.value, $.value), xn.value = Ci(bn.value.state, xn.value, $.value, Math.random, Ae.tally), G = qp(G, En() || R != null && R.on ? [] : Di(wt()), $.value, Math.random);
      const n = Pi(T.value, bn.value.state, an());
      T.value = qi(n.beats, an(), $.value), Te || (Te = n.cut);
      const l = _l(Gn(), $.value);
      Kt = nh(Kt, l, $.value, Math.random);
      const d = Gn();
      l === "sit" && oh(ja, d.share) && We({ beat: "progress_jump", time: $.value }), ja = l ? d.share : null;
      const g = Math.max(jt, $.value - ji), v = [
        ...Gi(Oe.value, g),
        ...Go(Oe.value, Ta, Math.max(vn, g)),
        ...qo(Oe.value, Na, vn),
        ...Hi(s.faces, g),
        ...Ui(h.value, g),
        ...Wi(h.value, g)
      ], y = jo(Oe.value, Fa);
      y.length && (Y.value = Y.value.map((we) => ({ ...we, lit: Ki(we, y) }))), v.length && (jt = Math.max(jt, ...v.map((we) => we.time))), pr(v) && po();
      const F = Yi(o.trip, Pa, $.value);
      Pa = F.began, F.moment && !T.value.some((we) => we.clip === "stumble") && We(F.moment);
      const N = Q(), C = bt(), H = C ? { eager: R, moment: null } : Vi(N.docked ? sn(N.element) : null, R, Math.random, $.value);
      R = H.eager, Te || (Te = !!H.cut), We(), H.moment && We(H.moment);
      const ue = la.has(o.place.posture) && !o.trip;
      He = Bd(He, ue, Un, $.value, Math.random), Un = ue;
      const xe = Xi(re.value.state, kn, Da, $.value);
      kn = !1, Da = xe.began, We(...v, ...Zi(xe.moments, Y.value)), Be = Ji(En() || T.value.some((we) => ["bug_shot", "bug_smash"].includes(we.clip)) ? [] : y, Be, performance.now() / 1e3);
      const $e = { state: re.value.state, since: re.value.since, lasted: $.value - re.value.since }, Me = Uo(Y.value), qe = Ws() || !!E, ln = qe || !!C || Me || !!(R != null && R.on), rt = o.trip ? null : rl(o.place, D(), Z()), pe = ln ? null : Qi({ ...Gs(), ball: rt ? rt.kind : "" }, $e, ls, $.value, Math.random, On, Ae.tally);
      if ((pe == null ? void 0 : pe.clip) === "disco" && (vt.value = rt), pe != null && pe.flies && Ts(), pe && !pe.flies && (T.value = [...T.value, pe]), qe) {
        document.hidden || (L = setTimeout(be, ga));
        return;
      }
      Vs() && !o.airborne && !o.place.stays && !eu(T.value, an()) && tu(o.place) && Xs(), sr(), rr();
      const _t = kd({
        state: re.value.state,
        counts: x.value,
        stay: V,
        now: $.value,
        near: o.place,
        figure: D(),
        hands: Ia,
        cleared: wn,
        work: io(),
        pile: lr(),
        tally: Ae.tally,
        memory: Ae.reacted,
        room: Hn()
      });
      V = _t.stay;
      const it = Jn("user");
      os(it) && it.card !== ho && !fe && mo() && br(it), xr();
      const ut = fe ? null : R != null && R.on ? $d(o.place, D()) : Hs(l, Me) ?? _t.spot;
      R != null && R.urgent && ut && o.trip && !o.trip.urgent && !o.trip.moves && (o.trip = null), !o.trip && !o.arriving && !o.airborne && !K && ut && Fd(He, performance.now() / 1e3, !!(R != null && R.urgent)) && (R != null && R.urgent && (T.value = T.value.slice(0, 1)), Xt(ut, { pace: Ce || R != null && R.on ? nu : 1, pressing: Ce || Me || !!(R != null && R.urgent), urgent: !!(R != null && R.urgent) }), Ce = !1), document.hidden || (L = setTimeout(be, ga));
    }
    let E = null;
    function Ws() {
      var v;
      if (E || !k || z || o.trip || o.airborne || o.arriving || o.leaving || K || !o.footing || o.place.posture === "hang" || (v = M.shown) != null && v.once && !Tn()) return !1;
      const n = mu(), l = Ke(Z().floors, o.footing.id);
      if (!l || !n || Nt(o.place, D(), n)) return !1;
      const d = Vo(D(), o.place, l, n);
      if (!d) return !1;
      const g = performance.now() / 1e3;
      return E = { phase: "notice", began: performance.now(), button: n, spot: d, canonicalFace: o.place.face, footingFace: o.footing.face, face: J.facing, facing: Re ? nl(Re, g) : J.facing }, k.easeFromCurrent(), Te = !0, !0;
    }
    function Ks() {
      if (!E) return !1;
      if (z || o.airborne || o.trip || o.leaving || K)
        return E = null, !1;
      const n = o.footing && Ke(Z().floors, o.footing.id);
      if (!n)
        return E = null, !1;
      const l = (performance.now() - E.began) / 1e3;
      if (E.phase === "notice") {
        if (l < Mt.notice) return !1;
        const H = Vo(D(), o.place, n);
        return H ? (V = { where: "aside", spot: H, until: $.value + cn }, Ce = !1, la.has(o.place.posture) ? (E = { ...E, phase: "scoot", began: performance.now(), from: o.place.x - n.left, to: H.x - n.left }, Te = !0, !1) : (E = null, Xt(H, { pace: 1, pressing: !0 }), !0)) : (E = null, !1);
      }
      const d = Math.min(l / Mt.seconds, 1), g = Ju(d), v = n.left + E.from + (E.to - E.from) * g.across;
      if (o.place = { ...o.place, x: v, y: n.top + o.footing.dy }, o.footing = { ...o.footing, dx: v - n.left }, d < 1) return !1;
      const y = E;
      E = null;
      const F = Ka(), N = Yo(F.clip, y.canonicalFace), C = Su(y, o.place, o.footing, N, performance.now() / 1e3);
      return o.place = C.place, o.footing = C.footing, Wo(F, o.place.posture, !1) === o.place.posture && (J = C.posed, Re = C.seatPose), V = { where: "aside", spot: { ...o.place }, until: $.value + cn }, Te = !0, !1;
    }
    function Ys() {
      if ((E == null ? void 0 : E.phase) !== "notice") return null;
      const n = Math.min((performance.now() - E.began) / (Mt.notice * 1e3), 1), l = (g) => {
        const v = Math.min(Math.max(g, 0), 1);
        return v * v * (3 - 2 * v);
      }, d = Ot(E.button);
      return { x: (d.x - o.at.x) / A, y: (d.y - o.at.y) / A, amount: l(n / 0.3) * (1 - l((n - 0.75) / 0.25)), most: 0 };
    }
    let lo = 0, Ce = !1, He = null, Un = !1;
    function so(n) {
      ({ stay: V, cleared: wn } = Ld(V, n, Date.now() / 1e3)), Ce = !0;
    }
    const Vs = () => !o.trip && o.footing && Xo(o.place, D()) > lo;
    function Xs() {
      const n = Z().floors.find((d) => d.element && d.element === o.place.on) ?? { left: Q().edge.left, right: Q().edge.left + Q().edge.width }, l = gu(D(), o.place, n);
      if (!l) return so(zt(o.place, D(), se));
      V = { where: "aside", spot: l, until: $.value + cn }, Ce = !0;
    }
    function Zs(n) {
      if (Wn) return void (Wn = !1);
      so(n.currentTarget.parentElement.getBoundingClientRect()), be();
    }
    let z = null, Wn = !1;
    const Js = () => !!(k && M.shown && o.here) && !z;
    function Qs(n) {
      var y, F;
      if (n.button !== 0 || n.isPrimary === !1 || !Js()) return;
      n.preventDefault(), Wn = !0;
      const l = er(n), { point: d } = l;
      o.at = l.at;
      const g = performance.now(), v = Ie(o.at);
      z = {
        pointer: n.pointerId,
        target: n.currentTarget,
        point: d,
        caught: { ...v },
        hang: { angle: l.angle, speed: 0 },
        hangAt: g / 1e3,
        offset: { x: v.x - n.clientX, y: v.y - n.clientY },
        moves: [{ x: n.clientX, y: n.clientY, at: g / 1e3 }]
      }, tr(v, d), Object.assign(o.airborne, { hang: l.angle, scale: l.scale, scaleFrom: l.scale, scaleAt: g }), (F = (y = n.currentTarget).setPointerCapture) == null || F.call(y, n.pointerId), window.addEventListener("pointermove", Kn), window.addEventListener("pointerup", at), window.addEventListener("pointercancel", at), window.addEventListener("blur", at), ee();
    }
    function er(n) {
      const l = { x: n.clientX, y: n.clientY };
      if (!window.DOMMatrix) return pl(o.at, l, A);
      const d = getComputedStyle(n.currentTarget.parentElement), g = d.rotate.endsWith("rad") ? parseFloat(d.rotate) * 180 / Math.PI : parseFloat(d.rotate) || 0, v = d.scale === "none" ? [1, 1] : d.scale.split(" ").map(Number), y = Number.isFinite(v[0]) ? v[0] : 1, F = Number.isFinite(v[1]) ? v[1] : y, N = new window.DOMMatrix().rotate(g).scale(y, F).multiply(new window.DOMMatrix(d.transform === "none" ? void 0 : d.transform)), [C, H] = d.transformOrigin.split(" ").map(parseFloat);
      return pl(o.at, l, A, N, { x: C, y: H });
    }
    function tr(n, l) {
      cancelAnimationFrame(on);
      const d = k.facing ?? J.facing;
      k.turn = null, k.drewAt = performance.now(), K = null, Wt.value = null, qn(), Object.assign(o, Ud(o, n, l)), o.place.face = o.airborne.face = d, Vt(), Dn(), V = { where: "rest", until: 0 }, He = null, Re = null, Un = !1, Ce = !1, R = null, An = null, Kt = null, fe = null, oe.value = null, ve.value = null, vt.value = null, nt.value = null, yt.value = "", kt = bl, na = null, J = { posture: "stand", facing: d, turning: !1 }, Te = !1;
    }
    function Kn(n) {
      !z || n.pointerId !== z.pointer || (n.preventDefault(), z.moves = [...z.moves.slice(-19), { x: n.clientX, y: n.clientY, at: performance.now() / 1e3 }], Yn());
    }
    function Yn() {
      var F;
      if (!z || !((F = o.airborne) != null && F.held)) return;
      const n = z.moves.at(-1), l = ro(), d = performance.now() / 1e3;
      z.hang = wl(z.hang ?? ma, z.hangAt ? d - z.hangAt : 0, d, n.x - (z.hangX ?? n.x), A), [z.hangAt, z.hangX] = [d, n.x];
      const g = n.x + z.offset.x, v = n.y + z.offset.y, y = z.caught;
      o.airborne = {
        ...o.airborne,
        x: Math.min(Math.max(g, Math.min(l.left, y.x)), Math.max(l.right, y.x)),
        y: Math.min(Math.max(v, Math.min(l.top, y.y)), Math.max(l.bottom, y.y)),
        hang: z.hang.angle,
        grip: z.point,
        scale: Ea(o.airborne, performance.now())
      }, o.at = Ee(o.airborne, "stand");
    }
    function Vn() {
      var n, l;
      window.removeEventListener("pointermove", Kn), window.removeEventListener("pointerup", at), window.removeEventListener("pointercancel", at), window.removeEventListener("blur", at), (l = z == null ? void 0 : (n = z.target).hasPointerCapture) != null && l.call(n, z.pointer) && z.target.releasePointerCapture(z.pointer), z = null;
    }
    function at(n) {
      if (!z || (n == null ? void 0 : n.type) !== "blur" && (n == null ? void 0 : n.pointerId) !== z.pointer) return;
      const l = performance.now(), d = n.type === "pointercancel" || n.type === "blur";
      d || Kn(n);
      const g = d ? { x: 0, y: 0 } : Hd(z.moves, l / 1e3);
      o.airborne = ml(hl(o.airborne, A), g, l), o.at = Ee(o.airborne, "stand"), Vn(), ee();
    }
    function nr() {
      const n = ro(), l = Z().floors.map((F) => F.id === "home" ? { ...F, left: n.left, right: n.right } : F), d = o.airborne, { airborne: g, landed: v, gone: y } = Wd(d, l, { ...n, top: he().top }, performance.now());
      if (y) return jn();
      if (o.airborne = g, v) {
        const F = ((d.spin + 180) % 360 + 360) % 360 - 180, N = d.scale ?? [1, 1];
        return de.value = { began: performance.now(), from: F, angle: F, scaleFrom: N, scale: N }, to(v, !0);
      }
      o.at = Ee(g, "stand");
    }
    function ro() {
      const n = he(), l = Ke(Z().floors, "home"), d = n.top + (1 - le.value) * A;
      return { left: n.left + A / 2, right: n.right - A / 2, top: d, bottom: Math.max(l ? l.top : n.bottom, d) };
    }
    const ar = S(() => {
      var l;
      const n = Bi(((l = o.airborne) == null ? void 0 : l.posture) ?? o.place.posture, le.value);
      return {
        left: `${n.left * 100}%`,
        width: `${(n.right - n.left) * 100}%`,
        top: `${n.top * 100}%`,
        height: `${(n.bottom - n.top) * 100}%`
      };
    }), Ue = () => o.at.x + A / 2, _e = (n) => ct().edge.left + n.along, ot = () => Y.value.filter((n) => n.state === "piled").length, or = () => {
      var n;
      return (n = o.trip) != null && n.moves ? o.way : Math.sign(xt(ot()) - Ue()) || 1;
    }, xt = (n) => {
      const { edge: l } = ct();
      return l.left + l.width + al(n).left;
    };
    function lr() {
      const n = Y.value.filter((l) => l.state === "piled").map(_e);
      return n.length ? { left: Math.min(...n) - dt.width / 2, right: Math.max(...n) + dt.width / 2, top: ct().edge.top } : null;
    }
    function io() {
      const n = Y.value.find((d) => d.state === "built");
      if (n) return { x: _u(_e(n), xt(ot()), o.place.x) };
      const l = Y.value.find((d) => d.state === "building");
      return l ? { x: _e(l) - Gt } : De ? { beside: Gt, before: xt(ot() + Zo.high) - dt.width / 2, aim: Xn } : null;
    }
    let ie = null, De = !1, uo = 0, Xn = null, co = 0;
    function sr() {
      var d, g;
      const n = Y.value.some((v) => v.state !== "piled");
      if (ie = yu(ie, vu(((g = (d = Oe.value) == null ? void 0 : d.data) == null ? void 0 : g.cards) || [], ur(), $.value), Ae.reacted, $.value, Math.random), n) return;
      const l = !!(ie != null && ie.granted) && $.value >= co;
      l && !De && (Xn = ir(), uo = $.value), De = l && bu(xu.build, uo, $.value), l && !De && (ie = { ...ie, granted: !1 });
    }
    let Zn = null;
    function rr() {
      Zn = ie ? null : Zn ?? $.value, wu(Y.value, !!ie, Zn, $.value) && po();
    }
    function ir() {
      const { edge: n } = ct();
      return Xu(n.left, xt(ot() + Zo.high) - dt.width, Xn, Math.random);
    }
    const ur = () => en ?? (cl(re.value.state) ? { card: fo(), since: re.value.since } : null);
    let en = null;
    function cr(n) {
      var d;
      n.state = "built";
      const l = (d = M.shown) != null && d.once ? 1 : 0;
      T.value = T.value.filter((g, v) => v < l || !sc.has(g.clip)), setTimeout(be);
    }
    function dr(n) {
      var F;
      const { edge: l } = ct(), d = Y.value, g = n.clip.name === "work" && se === "stand" && o.place.stays && !o.trip;
      if (g && !d.some((N) => N.state !== "piled")) {
        const N = Math.min(Math.max(Ue() + Gt - l.left, dt.inside), l.width - dt.inside);
        Y.value = [...d, { id: ++is, along: N, up: 0, state: "building", ...qu(performance.now(), Math.random), blows: 0, lit: "amber", run: (ie == null ? void 0 : ie.card) || fo() }];
      }
      const v = Y.value.find((N) => N.state === "building");
      v && g && fr(v, n), v && performance.now() >= v.until && cr(v);
      const y = d.find((N) => N.state === "built");
      if (y) {
        const N = xt(ot());
        (F = o.trip) != null && F.moves && (y.along = ju(_e(y), Ue(), N, o.way) - l.left), Math.abs(_e(y) - N) < Gu.room && (Object.assign(y, { along: N - l.left, state: "piled", up: al(ot()).up }), De = !1, co = $.value + Hu(Math.random));
      }
      $n.value = Y.value.map((N) => ({ id: N.id, x: _e(N), y: l.top, up: N.up, scale: 1, opacity: 1, blows: N.blows, lit: N.lit, state: N.state }));
    }
    const fo = () => {
      var n, l, d;
      return ((d = (((l = (n = Oe.value) == null ? void 0 : n.data) == null ? void 0 : l.cards) || []).filter((g) => g.process && g.active).at(-1)) == null ? void 0 : d.key) ?? "";
    };
    function fr(n, l) {
      Ht.started !== M.started && (Ht = { started: M.started, landed: 0 });
      const d = lc(Bn(l), _n.frames, _n.lands);
      n.blows += Math.max(d - Ht.landed, 0), Ht.landed = d;
    }
    const pr = (n) => n.some((l) => l.beat === "committed");
    function po() {
      Y.value = [], $n.value = [], De = !1;
    }
    function hr(n) {
      var y, F;
      const l = n.clip.name === "glass_bubble" && tn(), d = oc(Y.value, De, _e, ct().edge.top, or()), g = dh(Ca, $.value), v = [
        ["pointer", "pointer", n.clip.name === "tickle_swat" ? na : null],
        ["run", "run", yo()],
        [`reading:${Ne == null ? void 0 : Ne.card}`, "reading", _r()],
        ["glass", "reading", l && kr(l)],
        ["attachment", "attachment", vr()],
        ["said", "said", (y = Jn("user")) == null ? void 0 : y.point],
        ["message", "message", (F = Jn("agent")) == null ? void 0 : F.point],
        ["composer", g ?? "typing", g && yr()],
        ["work", "work", d == null ? void 0 : d.at],
        ["confession", "confession", mr(n)],
        ["picture", "picture", G.picture && vl(G.picture.getBoundingClientRect())],
        ["bar", "bar", gr(n)],
        ["glance", "glance", wr()]
      ];
      return ph(n.clip, v.filter(([, , N]) => N).map(([N, C, H]) => ({ key: N, kind: C, point: H })));
    }
    function mr(n) {
      var g;
      const l = T.value[0];
      if (n.clip.name !== "repent" || (l == null ? void 0 : l.clip) !== "repent" || !l.mark) return null;
      const d = (g = document.querySelector(`[data-figure-mark="${CSS.escape(l.mark)}"]`)) == null ? void 0 : g.getBoundingClientRect();
      return d ? { ...vl(d), most: Th } : null;
    }
    function gr(n) {
      var g;
      if (!uc(Kt, n)) return null;
      const l = Q(), d = Sr() && ((g = o.footing) != null && g.home || o.place.stays) ? cc(l.element) : null;
      return d && dc(d, { x: Ue(), y: o.place.y }, l.element.getBoundingClientRect(), D());
    }
    const yr = () => {
      var l;
      const n = (l = sa()) == null ? void 0 : l.getBoundingClientRect();
      return n ? Ot(n) : null;
    };
    function vr() {
      const n = rh(s.running), l = n && document.querySelector(`[data-ref="message:${n}"] [data-figure-picture]`);
      return l ? Ot(l.getBoundingClientRect()) : null;
    }
    function Jn(n) {
      var v;
      const d = h.value.filter((y) => y.author === n && $t(y) > vn).reduce((y, F) => !y || $t(F) > $t(y) ? F : y, null);
      if (!d || $.value - $t(d) > ih) return null;
      const g = (v = document.querySelector(`[data-figure-mark="${CSS.escape(ra(d))}"]`)) == null ? void 0 : v.getBoundingClientRect();
      return g ? { key: ra(d), kind: n === "user" ? "said" : "message", card: ra(d), box: g, point: Ot(g) } : null;
    }
    let fe = null, ho = "";
    const mo = () => {
      var n;
      return !!((n = o.trip) != null && n.moves && !o.trip.hopping);
    };
    function br(n) {
      const l = Ie(o.at), d = Z().floors.find((g) => g.id === o.walk.on);
      fe = { card: n.card, box: n.box, until: $.value + Lt.halt }, ho = n.card, o.trip = null, tt({ x: l.x, y: l.y, face: 0, posture: "stand", on: (d == null ? void 0 : d.element) ?? Q().element });
    }
    function xr() {
      !fe || $.value < fe.until || (bh(Math.random) && ka(fe.card, D()) && (V = { where: "mark", card: fe.card, until: $.value + il }), fe = null);
    }
    let Qn = null;
    function wr() {
      return Qn = kh(Qn, $.value, Math.random, se === "sit" ? wh : xh), _h(Qn, $.value, wt(), A);
    }
    const tn = () => yd(Z(), o.place, D());
    function kr(n) {
      const l = A * 0.8, d = { left: Math.max(n.left, o.place.x - l), right: Math.min(n.right, o.place.x + l), top: n.top, bottom: n.bottom };
      return ol(d, performance.now() / 1e3);
    }
    let Ne = null;
    function go() {
      var n;
      return !Ne || $.value >= Ne.until ? Ne = null : ((n = document.querySelector(`[data-figure-mark="${CSS.escape(Ne.card)}"]`)) == null ? void 0 : n.getBoundingClientRect()) ?? null;
    }
    function _r() {
      const n = go();
      return n && ol(n, Date.now() / 1e3 - Ne.began);
    }
    function $r() {
      const n = (fe == null ? void 0 : fe.box) ?? go() ?? (Wa() === "glass_bubble" ? tn() : null);
      return n && ec(n, o.at.x + A / 2, A);
    }
    function yo() {
      var g, v;
      if (!Be || Be.at !== null) return null;
      const n = ((g = document.querySelector(`[data-figure-mark="${CSS.escape(Be.card)}"]`)) == null ? void 0 : g.getBoundingClientRect()) ?? null, l = Q(), d = l.docked ? ((v = sn(l.element)) == null ? void 0 : v.bar.getBoundingClientRect()) ?? null : null;
      return ac(n, d, wt());
    }
    function Mr(n) {
      const l = yo();
      return !l || mh(n.clip) || lt.amount === ta && !!lt.point && zu(lt.point, l, wt());
    }
    const Sr = () => Q().docked && !o.trip;
    let lt = { point: null, toward: null, amount: 0, at: 0 }, ea = null, vo = Ol, nn = null, bo = null, ta = 0;
    function Ar(n) {
      var d;
      nn = yh(nn, hr(n), performance.now() / 1e3);
      const l = mo() ? vh(bo, nn.look, o.trip.way ?? o.way, wt(), performance.now() / 1e3) : { look: nn.look, glancing: null };
      return bo = l.glancing, ta = gh(l.look, n.clip), lt = Pu(lt, ((d = l.look) == null ? void 0 : d.point) ?? null, { x: o.at.x + A / 2, y: o.at.y + A * vo }, performance.now(), ea && { ...ea, facing: n.facing }, ta), hh(lt, o.at, A);
    }
    const wt = () => ({ x: o.at.x + A / 2, y: o.at.y + A * Ol }), xo = (n) => {
      var l, d;
      (d = (l = n.target).closest) != null && d.call(l, Ri) && (kn = !0, Ca = Date.now() / 1e3);
    }, wo = P(null);
    let kt = bl, na = null;
    function ko(n) {
      var d;
      if (z || o.airborne || K) return;
      const l = (d = wo.value) == null ? void 0 : d.getBoundingClientRect();
      !l || !jp(l, n.clientX, n.clientY) || (kt = Gp(kt, n.clientX, performance.now()), na = { x: n.clientX, y: n.clientY }, xl(kt, performance.now()) && !T.value.some((g) => g.clip === "tickle_swat") && We({ beat: "tickled", time: $.value }));
    }
    const an = () => {
      var n;
      return (n = M.shown) != null && n.once && !M.shown.arrival && !M.shown.departure && !M.shown.landed ? M.shown.clip.name : "";
    }, Or = /* @__PURE__ */ new Set(["long_walk", "tickled", "bar_failed"]);
    let _o = [];
    function We(...n) {
      const l = pu(R, _o, n);
      _o = l.held, l.answer.forEach(Er);
    }
    function Er(n) {
      var d;
      const l = Uu(n, p.value, Ae, $.value, Math.random, Ga);
      if (l != null && l.beat && Wu(T.value, l.beat)) {
        const g = { ...l.beat, queuedAt: $.value, bugs: l.beat.clip === "bug_shot" ? Ho(Math.random) : [] };
        T.value = Or.has(n.beat) ? Ku(T.value, g, an()) : [...T.value, g];
      }
      (d = l == null ? void 0 : l.beat) != null && d.onto && !bt() && ka(l.beat.card, D()) && (V = { where: "mark", card: l.beat.card, until: $.value + il }, Ce = !0), l != null && l.gaze && (Ne = { card: l.gaze.card, began: $.value, until: $.value + Yu.seconds }), l != null && l.look && (gn = Vu(l.look, performance.now() / 1e3), V = Rd(V, o.place));
    }
    let on = 0;
    function aa() {
      if (cancelAnimationFrame(on), !(z || o.airborne || K)) {
        if (!sa()) {
          on = requestAnimationFrame(aa);
          return;
        }
        tt(je(null, D())), Yt();
      }
    }
    function Nr(n) {
      if (!k && !n) return void i("gone");
      !k || z || o.airborne || n === Kp(o) || (n && (o.here = !0, aa()), o.leaving = !n, o.arriving = n, ee());
    }
    const $o = () => {
      document.hidden || (be(), ee());
    };
    async function Mo(n) {
      if (z && (o.airborne = ml(hl(o.airborne, A), { x: 0, y: 0 }, performance.now())), Vn(), E = null, k = null, !!n)
        try {
          const [l, d] = await Promise.all([Vc(n), import("./figure-C7ANXsiQ.js")]);
          if (n !== p.value || !u.value) return;
          const { FigurePlayer: g } = await import("./player-Bw4RJKAT.js");
          _ = d.CLIPS.filter((v) => !v.voices || v.voices.includes(n)), Ia = [...l.stance.free], Gt = d.blowsLandAt(l.stance) * A, _n = { frames: d.WORK.blowFrames, lands: d.WORK.lands }, ea = { depth: d.LOOK_REACH * A, above: d.eyesAboveOf(l) * A, tip: d.HEAD_TIP }, vo = d.headPivotOf(l), qo(Oe.value, Na), jo(Oe.value, Fa), Go(Oe.value, Ta), le.value = d.GROUND, u.value.width = u.value.height = Math.round(A * (window.devicePixelRatio || 1)), k = new g(l, u.value), Fr(), Br(), Tr(), aa(), o.here = s.here, o.arriving = o.here, ye(), be(), ee();
        } catch (l) {
          m.value = String(l.message ?? l);
        }
    }
    function Fr() {
      const n = window.devicePixelRatio || 1, l = (d) => {
        const g = Array.from({ length: $u(d) }, (v, y) => k.stage.drawBlock(d, y, A, n));
        return { pictures: g.map((v) => v.canvas.toDataURL()), width: g[0].canvas.width / n, height: g[0].canvas.height / n, below: g[0].below };
      };
      yn.value = Object.fromEntries(au.map((d) => [d, l(d)]));
    }
    function Br() {
      const n = window.devicePixelRatio || 1, l = k.stage.drawCanopy(A, n);
      Ba.value = { picture: l.canvas.toDataURL(), width: l.canvas.width / n, height: l.canvas.height / n, at: l.at, ends: l.ends };
    }
    function Tr() {
      const n = window.devicePixelRatio || 1, l = [0, 0.5].map((d) => k.stage.drawBug(d, A, n));
      qt.value = { pictures: l.map((d) => d.canvas.toDataURL()), width: l[0].canvas.width / n, height: l[0].canvas.height / n, at: l[0].at };
    }
    function So({ detail: n }) {
      He = null, n.held !== void 0 && (Ra.value = n.held), n.held && (ke = n.held), n.perch && (V = { where: "bubble", perch: Wl(ae(), D(), [], Math.random, { now: $.value }), until: $.value + Lh }), n.parcel !== void 0 && (en = n.parcel ? { card: "demo", since: 0 } : null), en && (ie = { card: en.card, granted: !0 }), n.clip === "chute" ? jn() : n.clip && (T.value = [...T.value, { clip: n.clip, card: "", lifetime: 1 / 0, queuedAt: $.value, bugs: n.clip === "bug_shot" ? Ho(Math.random) : [] }]), be();
    }
    ya(p, Mo), ya(() => s.here, Nr), Yr(() => {
      window.addEventListener(El, So), document.addEventListener("visibilitychange", $o), document.addEventListener("input", xo, !0), window.addEventListener("resize", be), window.addEventListener("mousemove", ko, { passive: !0 }), Mo(p.value);
    }), Vr(() => {
      window.removeEventListener(El, So), pt(), cancelAnimationFrame(on), cancelAnimationFrame(B), clearTimeout(L), document.removeEventListener("visibilitychange", $o), document.removeEventListener("input", xo, !0), window.removeEventListener("resize", be), window.removeEventListener("mousemove", ko), Vn();
    });
    const Ao = S(() => {
      var l;
      const n = (l = ht.value) == null ? void 0 : l.marks;
      return n != null && n.frames.some(([d, g]) => Ut.value >= d && Ut.value < g) ? n.mark : "";
    }), Lr = S(() => ({
      left: `${Le.value.x * 100}%`,
      top: `${(Le.value.y - Nh) * 100}%`,
      "--mark-seconds": `${Al}s`
    })), st = P(null);
    let Oo = null;
    const Eo = /* @__PURE__ */ new Map();
    function zr(n) {
      var g;
      const l = n.clip.name === "bug_shot" ? (g = T.value[0]) == null ? void 0 : g.bugs : null;
      if (l !== Oo && (Oo = l, Eo.clear()), st.value = l != null && l.length ? Cu(l, he(), Fn(n), { surfaces: Du(), bursts: Eo }) : null, !st.value) return null;
      const { target: d } = st.value;
      return { x: (d.x - o.at.x) / A, y: (d.y - o.at.y) / A, back: d.back };
    }
    const Rr = S(() => {
      var n;
      return (((n = st.value) == null ? void 0 : n.bugs) ?? []).map((l) => ({ ...l, x: l.x - o.at.x, y: l.y - o.at.y }));
    }), Ir = S(() => {
      var n;
      return (((n = st.value) == null ? void 0 : n.slush) ?? []).map((l) => ({
        ...l,
        x: l.x - o.at.x,
        y: l.y - o.at.y,
        ...l.clip ? { clip: { left: l.clip.left - o.at.x, right: l.clip.right - o.at.x, top: l.clip.top - o.at.y, bottom: l.clip.bottom - o.at.y } } : {}
      }));
    }), Cr = S(() => {
      var n;
      return (((n = st.value) == null ? void 0 : n.camera) ?? []).map((l) => ({ ...l, from: { x: l.from.x - o.at.x, y: l.from.y - o.at.y } }));
    }), Pe = S(() => Ti(Mn.value, Sn.value)), Dr = S(() => ({ left: o.at.x, right: window.innerWidth - o.at.x - A })), oa = S(() => Pe.value && Li(Pe.value.name, Pe.value.u)), Pr = S(() => ({
      left: `${Le.value.x * 100}%`,
      top: `${Le.value.y * 100}%`,
      opacity: Pt.value.strength,
      "--halo": `rgb(${Pt.value.colour.map((n) => Math.round(n * 255)).join(" ")})`
    })), qr = S(() => {
      var n;
      return ["enter", "exit"].includes((n = ht.value) == null ? void 0 : n.name);
    }), jr = S(() => {
      var n, l, d;
      return {
        "--size": `${A}px`,
        "--fall-ms": `${Zt.value.ms}ms`,
        "--squash": Zt.value.squash,
        "--bounce": `${Zt.value.bounce}px`,
        ...oa.value && { scale: `${oa.value.x} ${oa.value.y}`, transformOrigin: `50% ${(1 - le.value) * 100}%` },
        ...Pn.value && { rotate: `${Cn.value}rad`, transformOrigin: `${Pn.value.x * 100}% ${Pn.value.y * 100}%` },
        ...de.value && { rotate: `${de.value.angle}deg`, scale: de.value.scale.join(" "), transformOrigin: "50% 55%" },
        ...((n = o.airborne) == null ? void 0 : n.held) && { rotate: `${o.airborne.hang}rad`, transformOrigin: `${o.airborne.grip.x * 100}% ${o.airborne.grip.y * 100}%` },
        ...((l = o.airborne) == null ? void 0 : l.thrown) && { rotate: `${o.airborne.spin}deg`, transformOrigin: "50% 55%" },
        ...((d = o.airborne) == null ? void 0 : d.scale) && { scale: o.airborne.scale.join(" ") }
      };
    }), Gr = S(() => {
      const n = he(), { x: l, y: d } = o.at;
      return {
        width: `${A}px`,
        height: `${A}px`,
        zIndex: xa.figure,
        transform: `translate(${l}px, ${d}px)`,
        clipPath: `inset(${n.top - d}px ${l + A - n.right}px ${d + A - n.bottom}px ${n.left - l}px)`
      };
    });
    return (n, l) => {
      var d, g;
      return b(), w(I, null, [
        Xr(O("div", {
          class: "voice-figure",
          style: ne(Gr.value),
          "aria-hidden": "true",
          "data-walking": za.value,
          "data-hopping": ss.value,
          "data-trip": rs.value,
          "data-clip": (d = ht.value) == null ? void 0 : d.name,
          "data-beats": T.value.map((v) => v.clip).join(" ")
        }, [
          O("div", {
            class: Nl(["voice-figure-actor", yt.value]),
            style: ne(jr.value),
            onAnimationend: Cs
          }, [
            O("div", {
              class: "voice-figure-body",
              style: ne(ar.value),
              onMousedown: l[0] || (l[0] = Zr(() => {
              }, ["prevent"])),
              onPointerdown: Qs,
              onClick: Zs,
              ref_key: "bodyArea",
              ref: wo
            }, null, 36),
            O("canvas", {
              ref_key: "canvas",
              ref: u,
              class: "voice-figure-canvas",
              "data-figure-canvas": "",
              "data-voice": p.value,
              "data-failure": m.value || void 0,
              style: ne(qr.value || j(zi)((g = Pe.value) == null ? void 0 : g.name) ? { clipPath: `inset(0 0 ${le.value * 100}% 0)` } : null)
            }, null, 12, Eh),
            Pt.value ? (b(), w("span", {
              key: 0,
              class: "voice-figure-halo",
              style: ne(Pr.value)
            }, null, 4)) : q("", !0),
            Ao.value ? (b(), w("span", {
              key: 1,
              class: "voice-figure-marks",
              style: ne(Lr.value)
            }, [
              (b(), w(I, null, U(Sl, (v) => O("span", {
                key: v,
                style: ne({ animationDelay: `${-(v - 1) * Al / Sl}s` })
              }, _a(Ao.value), 5)), 64))
            ], 4)) : q("", !0),
            Io(Co, {
              name: "figure-prop",
              duration: 150
            }, {
              default: Do(() => [
                Pe.value ? (b(), te(Lp, {
                  key: Pe.value.name,
                  name: Pe.value.name,
                  u: Pe.value.u,
                  hand: qa.value,
                  head: Le.value,
                  feet: 1 - le.value,
                  size: A,
                  room: Dr.value,
                  ball: vt.value,
                  canopy: Ba.value,
                  bug: qt.value,
                  "wall-bugs": Rr.value,
                  slush: Ir.value,
                  camera: Cr.value
                }, null, 8, ["name", "u", "hand", "head", "feet", "room", "ball", "canopy", "bug", "wall-bugs", "slush", "camera"])) : q("", !0)
              ]),
              _: 1
            })
          ], 38)
        ], 12, Oh), [
          [Jr, j(o).here]
        ]),
        Ya.value && qt.value ? (b(), te(Pp, {
          key: 0,
          bug: qt.value,
          at: Ya.value
        }, null, 8, ["bug", "at"])) : q("", !0),
        (b(!0), w(I, null, U($n.value, (v) => (b(), w(I, {
          key: v.id
        }, [
          yn.value ? (b(), te(Zd, {
            key: 0,
            x: v.x,
            y: v.y,
            up: v.up,
            scale: v.scale,
            opacity: v.opacity,
            blows: v.blows ?? 0,
            block: yn.value[v.lit],
            ahead: v.state === "built",
            piled: v.state === "piled"
          }, null, 8, ["x", "y", "up", "scale", "opacity", "blows", "block", "ahead", "piled"])) : q("", !0)
        ], 64))), 128)),
        Io(Co, { name: "step-ladder" }, {
          default: Do(() => [
            nt.value ? (b(), te(Dd, {
              key: 0,
              foot: nt.value.foot,
              top: nt.value.top
            }, null, 8, ["foot", "top"])) : q("", !0)
          ]),
          _: 1
        })
      ], 64);
    };
  }
}, Rh = /* @__PURE__ */ Ge(zh, [["__scopeId", "data-v-09e4af2b"]]), qh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Rh
}, Symbol.toStringTag, { value: "Module" }));
export {
  Dl as F,
  xc as G,
  as as H,
  wc as R,
  qh as V,
  Ph as g,
  mh as h,
  Dh as t
};
