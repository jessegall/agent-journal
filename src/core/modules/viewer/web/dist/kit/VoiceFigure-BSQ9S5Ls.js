/* @code-commandments-generated */
import { reactive as Wr, computed as $, openBlock as b, createElementBlock as k, normalizeStyle as ae, Fragment as R, renderList as U, mergeProps as Io, ref as P, watch as va, createElementVNode as A, normalizeClass as Fl, toDisplayString as $a, unref as j, createCommentVNode as q, useId as Kr, createBlock as ne, inject as Yr, onMounted as Vr, onUnmounted as Xr, withDirectives as Zr, withModifiers as Jr, createVNode as Co, Transition as Do, withCtx as Po, vShow as Qr } from "vue";
import { l as ei, A as X, p as ti, a as ni, f as ai, s as oi, b as li, c as ba, t as si, B as ri, d as Bl, e as pt, g as ii, r as oe, h as ui, i as Bt, j as ci, w as Tl, k as je, m as di, n as Dt, o as mn, q as Pt, R as Ll, u as pn, v as Tt, x as fi, y as zl, z as te, C as pi, D as Rl, E as It, F as hi, G as mi, H as gi, I as Il, L as Cl, J as Dl, K as me, M as xa, N as Ze, O as yi, P as vi, _ as Ge, Q as wa, S as qo, T as bi, U as xi, V as de, W as Ma, X as wi, Y as ki, Z as _i, $ as $i, a0 as Nt, a1 as Mi, a2 as Si, a3 as Ai, a4 as Oi, a5 as Ei, a6 as St, a7 as Ni, a8 as Fi, a9 as Bi, aa as Ti, ab as Li, ac as zi, ad as Ri, ae as Ii, af as jo, ag as Go, ah as Ho, ai as Uo, aj as Ci, ak as Di, al as Pi, am as qi, an as ji, ao as Gi, ap as Hi, aq as Ui, ar as Wi, as as Ki, at as Yi, au as Vi, av as Xi, aw as Zi, ax as rn, ay as sa, az as Ji, aA as Qi, aB as eu, aC as Wo, aD as tu, aE as nu, aF as au, aG as ou, aH as lu, aI as ra, aJ as su, aK as ru, aL as Ko, aM as Yo, aN as Vo, aO as iu, aP as uu, aQ as cu, aR as du, aS as fu, aT as At, aU as pu, aV as hu, aW as mu, aX as gu, aY as yu, aZ as Ye, a_ as Z, a$ as Xo, b0 as Zo, b1 as vu, b2 as bu, b3 as xu, b4 as wu, b5 as ku, b6 as _u, b7 as $u, b8 as dt, b9 as ft, ba as Mu, bb as Jo, bc as ia, bd as Qo, be as Ot, bf as Su, bg as Au, bh as Ou, bi as el, bj as Eu, bk as Nu, bl as Fu, bm as tl, bn as Bu, bo as Tu, bp as Lu, bq as nl, br as zu, bs as Ru, bt as Iu, bu as Cu, bv as Du, bw as al, bx as Pu, by as qu, bz as ju, bA as Gu, bB as Hu, bC as Uu, bD as ol, bE as Wu, bF as Ku, bG as Yu, bH as Vu, bI as Xu, bJ as Zu, bK as Ju, bL as Qu, bM as ua, bN as ec, bO as tc, bP as nc, bQ as ac, bR as oc, bS as lc, bT as sc, bU as rc, bV as ic, bW as uc, bX as cc, bY as ll, bZ as dc, b_ as fc, b$ as pc, c0 as hc, c1 as mc, c2 as gc, c3 as yc, c4 as vc, c5 as bc, c6 as xc, c7 as wc } from "./index-BmES2Izh.js";
const Pl = { height: 5.4, middle: 2.4 };
function qh(e, t, a, r) {
  if (!e) return { facing: t, speed: 0, settled: !0 };
  const s = Math.max(0, Math.min(a, 0.05)), i = ((e.facing - t + 180) % 360 + 360) % 360 - 180, c = e.facing - i, u = 8 / r, p = e.speed + u * i, m = Math.exp(-u * s), f = c + (i + p * s) * m, h = Math.min(Math.max(f - e.facing, -720 * s), 720 * s), w = Math.abs(f - e.facing) > 720 * s ? Math.sign(h) * 720 : (e.speed - u * p * s) * m, E = e.facing + h, x = Math.abs(E - c) < 1e-3 && Math.abs(w) < 0.05;
  return { facing: x ? c : E, speed: x ? 0 : w, settled: x };
}
const kc = { length: 1.36, planted: 0.6, clearance: 0.16 }, _c = { length: 2.16, planted: 0.42, clearance: 0.3 }, $c = (e, t, a = !1) => t > 0 ? e * Pl.height / (t * (a ? _c : kc).length) : 0;
function jh(e, { length: t, planted: a, clearance: r }) {
  const s = (e % 1 + 1) % 1, i = t * a;
  if (s < a) return [-i / 2 + t * s, 0];
  const c = (s - a) / (1 - a);
  return [i / 2 - i * (3 * c * c - 2 * c * c * c) + t * (1 - a) * c * (1 - c) * (1 - 2 * c), r * Math.sin(Math.PI * c) ** 2];
}
function Mc(e, t, a) {
  if (t <= 0) return 1;
  const r = Math.min(Math.max(e, 0), t), s = Math.min(Math.max(a, 0), t / 2);
  if (!s) return r / t;
  const i = t - s, c = (u) => u * u * u * (1 - u / 2);
  return r < s ? s * c(r / s) / i : r > t - s ? 1 - s * c((t - r) / s) / i : (r - s / 2) / i;
}
const Sa = 5, qt = (e, t) => t >= e.left && t <= e.right, Sc = 8, Ac = (e, t, a, r = Sa) => e.filter((s) => qt(s, t) && Math.abs(s.top - a) <= r).sort((s, i) => Math.abs(s.top - a) - Math.abs(i.top - a))[0] ?? null, Oc = (e, t, a, r = Sa) => e.filter((s) => qt(s, t) && s.top >= a - r).sort((s, i) => s.top - i.top)[0] ?? null, Ec = 5, Nc = 3, ka = ["dock", "compose", "foot"], Fc = 30;
function Bc(e, t, a, r) {
  const s = e.find((i) => i.id === t);
  return !s || ka.includes(s.kind) && s.top > r + Sa ? { falls: !0, dx: 0, dy: 0 } : ka.includes(s.kind) && s.top < r - Fc ? { falls: !1, dx: 0, dy: 0 } : { falls: !1, dx: Math.min(Math.max(a, s.left), s.right) - a, dy: s.top - r };
}
const ql = (e) => e.filter((t) => ka.includes(t.kind));
function jl(e, t) {
  const a = /^cubic-bezier\(([^)]*)\)$/.exec(e ?? "");
  if (!a || t <= 0 || t >= 1) return Math.min(1, Math.max(0, t));
  const [r, s, i, c] = a[1].split(",").map(Number), u = (f, h, w) => 3 * (1 - f) * (1 - f) * f * h + 3 * (1 - f) * f * f * w + f * f * f;
  let [p, m] = [0, 1];
  for (let f = 0; f < 30; f++) {
    const h = (p + m) / 2;
    u(h, r, i) < t ? p = h : m = h;
  }
  return u((p + m) / 2, s, c);
}
const Tc = (e, t, a) => a - t >= e.lead + e.ms;
function ca(e, t, a, r = !1) {
  if (e.pogo && !r) return Lc(e, t, a);
  const s = r && e.hopping ? 1 : e.ramp ? Mc(a - e.lead, e.ms, e.ramp) : jl(e.easing, e.ms > 0 ? (a - e.lead) / e.ms : 1);
  return { x: t.x + (e.x - t.x) * s, y: t.y + (e.y - t.y) * s };
}
function Lc(e, t, a) {
  const { bounces: r, spring: s, over: i } = X.pogo, c = Math.min(Math.max(a / e.ms, 0), 1), u = (E) => Math.min(Math.max((c - E[0]) / (E[1] - E[0]), 0), 1);
  if (c < s[0]) return { x: t.x, y: t.y - ti(ni(), u(r)).height * e.size };
  const p = i * e.size, m = Math.max(t.y - e.y, 0) + p, f = e.y - p, h = zc(e, t), w = t.x + (e.x - t.x) * u([s[0], h[1]]);
  return c < s[1] ? { x: w, y: f + m * (1 - u(s)) ** 2 } : { x: w, y: f + p * u(h) ** 2 };
}
function zc(e, t) {
  const { spring: a, over: r } = X.pogo, s = r * e.size, i = Math.max(t.y - e.y, 0) + s;
  return [a[1], Math.min(a[1] + (a[1] - a[0]) * Math.sqrt(s / i), 1)];
}
function Gl(e, t, a, r = !1) {
  const s = Rc(t, e);
  if (s) return { x: e.x, y: s.top, speed: 0, onto: s.id, landed: s };
  const i = Cc(e, t);
  if (i) return i;
  const c = e.onto ? t.find((m) => m.id === e.onto && qt(m, e.x)) : null;
  if (c && c.top <= e.y) return { x: e.x, y: c.top, speed: 0, onto: c.id, landed: c };
  const u = Oc(t, e.x, e.y, 0);
  if (!u) return { ...e, onto: null, landed: null };
  if (r) return { x: e.x, y: u.top, speed: 0, onto: u.id, landed: u };
  const p = ai({ y: e.y, speed: e.speed }, u.top, a, e.most);
  return { x: e.x, y: p.y, speed: p.speed, onto: u.id, landed: p.landed ? u : null };
}
const Rc = (e, t) => t.speed >= 0 ? e.find((a) => a.id === "home" && qt(a, t.x) && a.top < t.y) ?? null : null, Ic = (e, t, a) => e.filter((r) => qt(r, t) && r.top < a && a - r.top <= Ec).sort((r, s) => s.top - r.top)[0] ?? null;
function Cc(e, t) {
  if (e.peak === 0 || e.peak === void 0 && e.speed) return null;
  const a = Ic(t, e.x, e.y);
  return e.peak === void 0 ? a ? { ...e, peak: Nc, landed: null } : null : e.peak > 1 ? { ...e, peak: e.peak - 1, landed: null } : a ? { x: e.x, y: a.top, speed: 0, peak: 0, landed: a } : { ...e, peak: 0, landed: null };
}
function Dc(e, t, a, r, s = 1 / 0) {
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
function Pc(e, t, a, r) {
  const s = a.find((c) => c.id === "home"), i = s ? Math.min(e.y, s.top) : e.y;
  return { x: e.x, y: i, posture: e.posture, face: e.face, speed: 0, at: r, to: t };
}
const qc = (e, t, a, r) => ({ x: e, y: t, posture: "stand", speed: 0, at: r, to: null, most: a, chute: !0 }), jc = (e, t, a) => ({ x: e.x, y: e.y, posture: "stand", face: e.face, speed: t, at: a, to: null, peak: 0 }), Gc = (e, t) => e.speed < 0 && e.y <= t;
function Hc(e, t, a, r = !1) {
  const s = Gl(e, ql(t), (a - e.at) / 1e3, r);
  if (!s.landed) return { airborne: { ...e, ...s, at: a }, landed: null };
  const i = ei(e.posture, s.landed.kind);
  return { airborne: null, landed: { spot: { x: s.x, y: s.landed.top, posture: i, face: e.face, view: null, on: s.landed.element ?? null }, to: e.to, standing: i === "stand" } };
}
const Uc = "cubic-bezier(0.42, 0, 0.58, 1)";
function Wc(e, t, a) {
  const r = Math.min(1, Math.max(0, (t - e.began) / a)), s = jl(Uc, r);
  return {
    at: { x: e.from.x + (e.to.x - e.from.x) * s, y: e.from.y + (e.to.y - e.from.y) * s },
    done: r >= 1
  };
}
const da = (e, t, a) => e.map((r) => ({ ...r, x: r.x + t, y: r.y + a }));
function Kc(e) {
  const t = Wr({
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
    cancelAnimationFrame(a), oi();
  }
  function i() {
    s(), li(), a = requestAnimationFrame(r);
  }
  return { body: t, start: i, stop: s };
}
const Yc = "voice-figures", Hl = (e) => new URL(e).pathname.split("/").pop(), Vc = (e, t) => Hl(e).startsWith(`${t}.`);
async function Xc(e) {
  const t = await ba.voiceFigures(), a = ba.voiceFigureUrl(t[e]);
  if (typeof caches > "u") return (await sl(a, e)).arrayBuffer();
  const r = await caches.open(Yc), s = await r.match(a);
  if (s) return s.arrayBuffer();
  const i = await sl(a, e);
  await r.put(a, i.clone());
  const c = (await r.keys()).filter((u) => Vc(u.url, e) && Hl(u.url) !== t[e]);
  return await Promise.all(c.map((u) => r.delete(u))), i.arrayBuffer();
}
async function sl(e, t) {
  const a = await si.raw(e);
  if (!a.ok) throw new Error(`The ${t} figure did not load: ${a.status}`);
  return a;
}
async function Zc(e) {
  const [{ figureOf: t }, a] = await Promise.all([import("./figure-Bvf3SdRV.js"), Xc(e)]);
  return t(a, e, ba.figureDecoderUrl());
}
const Jc = { most: 2.5 }, Je = ({ size: e, below: t }) => (1 - t - ri.top) * e, Ul = (e) => Jc.most * Je(e), Qc = { share: 0.5 }, ed = (e, t) => e >= Qc.share * t;
function td(e, t, a, r) {
  const s = [];
  let i = e;
  for (; i.y - t > r; ) {
    const c = a.filter((u) => u.y < i.y && u.y > t && i.y - u.y <= r);
    if (!c.length) return null;
    i = c.reduce((u, p) => p.y < u.y ? p : u), s.push(i);
  }
  return s;
}
const Qe = "stand", Xe = "hang", nd = [8, 20];
function ad(e, t = {}) {
  const a = pt({ moment: "roam", ...t }, e);
  return { where: a.name, stay: Wl(a.stay, e) };
}
const Wl = ([e, t], a) => e + a() * (t - e), Aa = (e, t) => e.left - t.left > t.right - e.right ? "left" : "right", Oa = (e, t, a) => e.top - di(a) >= t.top && e.top <= t.bottom - 8, od = { l: "left", r: "right" }, ld = 0.3, sd = 180;
function Kl(e, t, a, r, { memory: s = null, now: i = 0, free: c = !1 } = {}) {
  const u = e.floors.filter((x) => x.kind === "bubble" && Oa(x, e.view, t)), p = { moment: "perch", hands: a.length > 0, free: c, memory: s, now: i }, m = Bl(p).some((x) => x.name === Xe), f = pt({ moment: "perch", hands: m, free: c }, r).name, h = m ? f === Xe ? [Xe, Qe] : [Qe, Xe] : [Qe], E = u.reverse().flatMap((x) => h.map((F) => rd(x, F, e.view, a))).find((x) => gn(x, e, t)) ?? null;
  return (E == null ? void 0 : E.kind) === Xe && ii(p, Xe, r), E;
}
function rd(e, t, a, r) {
  const s = Aa(e, a);
  if (t === Qe) return { floor: e.id, kind: t, side: s, grip: "" };
  const i = r.find((c) => od[c] === s);
  return i ? { floor: e.id, kind: t, side: s, grip: i, face: 0 } : { floor: e.id, kind: t, side: s, grip: r[0], face: sd };
}
function gn(e, t, a) {
  const r = t.floors.find((i) => i.id === e.floor);
  if (!r || !Oa(r, t.view, a)) return null;
  const s = id(e, r, a);
  return Dt(s, a, t.floors) && mn(s, a) && !Pt(s, a) ? s : null;
}
function id(e, t, a) {
  if (e.kind === Qe)
    return { ...mi({ ...t, width: t.right - t.left }, e.side, a), on: t.element };
  const r = (e.side === "left" ? -1 : 1) * ld * a.size;
  return { x: (e.side === "left" ? t.left : t.right) + r, y: t.top, face: e.face, posture: "hang", grip: e.grip, on: t.element };
}
const ud = 1.6, cd = vi.filter((e) => e.when.moment === "ledge_at").map((e) => e.along), rl = 35;
function hn(e, t, a) {
  const r = oe(), s = r.floors.find((u) => u.element && u.element === a.on && Cl.has(u.kind));
  if (!s || s.right - s.left < ud * t.size) return null;
  const i = (u) => s.kind !== "compose" ? 0 : u <= 0.5 ? 360 - rl : rl;
  return [e, ...cd.filter((u) => u !== e)].map((u) => ({
    x: s.left + (s.right - s.left) * u,
    y: s.top,
    face: i(u),
    posture: "sit",
    leans: !0,
    on: s.element
  })).find((u) => Dt(u, t, r.floors) && mn(u, t) && !Pt(u, t) && Dl(u, t)) ?? null;
}
const dd = [0.5, 0.42, 0.58];
function fd(e, t, a = { turn: 0, leans: 0 }) {
  const r = oe(), s = r.floors.find((u) => u.element && u.element === t.on && Cl.has(u.kind));
  if (!s) return null;
  const i = (u) => ({ x: s.left + (s.right - s.left) * u, y: s.top, face: a.turn, leans: a.leans, posture: "composed", view: null, on: s.element });
  return dd.map(i).find((u) => Dt(u, e, r.floors) && mn(u, e) && !Pt(u, e) && Dl(u, e)) ?? null;
}
function Yl(e, t, a = oe()) {
  if (!e) return null;
  const { rope: r, ties: s, room: i } = X.rope_swing, c = me(), u = e.bottom + r * t.size, p = s * t.size / 2, m = [Math.max(e.left + p, c.left + i * t.size), Math.min(e.right - p, c.right - i * t.size)], f = pd(e, t, a, u, m);
  if (f === null) return null;
  const h = { x: f, y: u, posture: "sit", face: 0, swings: !0, view: null, on: e.element }, w = a.floors.find((E) => E.id === "home");
  return w && It(h, t).bottom > w.top ? null : Dt(h, t, a.floors) && !Pt(h, t) ? h : null;
}
function pd(e, t, a, r, [s, i]) {
  if (s > i) return null;
  const { seat: c, clearance: u } = X.rope_swing, p = e.bottom + (It({ x: 0, y: r, posture: "sit" }, t).bottom - e.bottom) * (1 + u), m = c * t.size / 2 * (1 + u), h = a.floors.filter((F) => F.kind === "bubble" && F.bottom > e.bottom && F.top < p).map((F) => [F.left - m, F.right + m]), w = (e.left + e.right) / 2, E = (F) => !h.some(([L, G]) => F > L && F < G);
  return [w, ...h.flat()].map((F) => Math.min(Math.max(F, s), i)).filter(E).sort((F, L) => Math.abs(F - w) - Math.abs(L - w))[0] ?? null;
}
function il(e, t, a = oe()) {
  if (e.posture !== "stand") return null;
  const { ball: r, clear: s, tie: i, far: c } = X.disco, u = e.y - Je(t), p = Je(t) + (s + r / 2) * t.size, f = a.floors.filter((w) => w.kind === "bubble" && w.bottom < e.y && w.left < e.x && w.right > e.x).filter((w) => w.bottom <= u - (s + r + i) * t.size).sort((w, E) => E.bottom - w.bottom)[0];
  return a.floors.some((w) => w.kind === "bubble" && w.element === e.on) && f && u - f.bottom <= c * Je(t) ? { kind: "bubble", above: e.y - f.bottom, hangs: p } : null;
}
const hd = (e, t) => e.floors.filter((a) => a.kind === "bubble" && Yl(a, t, e)), ul = 20;
function _a(e, t) {
  var u;
  const a = document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!a) return null;
  if ((u = te().element) != null && u.contains(a)) return je(null, t);
  const r = oe(), s = r.floors.find((p) => p.kind === "bubble" && p.element.contains(a));
  if (!s) return null;
  const i = Aa(s, r.view);
  return [i, i === "left" ? "right" : "left"].map((p) => gn({ floor: s.id, kind: Qe, side: p, grip: "" }, r, t)).find(Boolean) ?? null;
}
function Ea(e, t, a, r) {
  const i = e.floors.filter((c) => c.kind === "bubble" && c.top < a.y).map((c) => gn({ floor: c.id, kind: Qe, side: Aa(c, e.view), grip: "" }, e, t)).filter(Boolean);
  return td(a, r, i, Ul(t));
}
const md = (e, t) => t.posture === "stand" && e.some((a) => a.kind === "bubble" && a.element === t.on), Vl = (e, t, a, r) => md(e.floors, a) && ed(t.y - a.y, e.view.bottom - e.view.top) && Bl({ moment: "climb", ...r }).some((s) => s.name === "pogo");
function gd(e, t, a, r, s, i) {
  var u;
  const c = Ea(e, t, a, r.y);
  return Vl(e, a, r, s) ? ((u = pt({ moment: "climb", footholds: !!c, ...s }, i)) == null ? void 0 : u.name) === "pogo" ? { via: [], pogo: !0 } : { via: c, pogo: !1 } : c && { via: c, pogo: !1 };
}
function Lt(e, t, a, r = {}) {
  const s = oe();
  return e && (Ea(s, t, a, e.y) || Vl(s, a, e, r)) ? e : null;
}
function Xl(e, t, a, r, { tally: s = null, free: i = !1, room: c = 0, memory: u = null, moment: p = "roam" } = {}) {
  const m = hd(oe(), t), { where: f, stay: h } = ad(r, { moment: p, tally: s, free: i, room: c, swings: m.length > 0, memory: u, now: e }), w = e + h;
  if (f === "ledge") return { where: f, until: w, along: pt({ moment: "ledge_at" }, r).along };
  if (f === "bubble_ledge") return { where: f, until: w, ...yd(t, r) };
  if (f === "rope_swing") return { where: f, until: w, floor: m[Math.floor(r() * m.length)].id };
  if (f === "bubble") {
    const E = Kl(oe(), t, a, r, { memory: u, now: e, free: i });
    return { where: f, until: (E == null ? void 0 : E.kind) === Xe ? e + Wl(nd, r) : w, perch: E };
  }
  if (f === "tab") {
    const E = Object.keys(zl()).filter((x) => je(x, t));
    return { where: f, until: w, view: E[Math.floor(r() * E.length)] };
  }
  if (f === "edge") return { where: f, until: w, along: { x: r() * window.innerWidth, y: 0 } };
  if (f === "composed") {
    const { turn: E, leans: x } = pt({ moment: "composed_as" }, r);
    return { where: f, until: w, turn: E, leans: x };
  }
  return { where: f, until: w };
}
function yd(e, t) {
  var i;
  const a = pt({ moment: "ledge_at" }, t).along, r = oe(), s = r.floors.filter((c) => c.kind === "bubble" && Oa(c, r.view, e) && hn(a, e, { on: c.element }));
  return { floor: ((i = s[Math.floor(t() * s.length)]) == null ? void 0 : i.id) ?? "", along: a };
}
function vd(e, t, a = oe()) {
  const r = a.floors.find((f) => f.element && f.element === t.on);
  if (!r) return null;
  const { wall: s, contact: i } = X.lean, c = r.top - i / Pl.height * e.size, u = xa * e.size;
  return a.floors.filter((f) => f.kind === "bubble" && f.element !== r.element && f.bottom <= r.top && f.top <= c && f.bottom >= c).flatMap((f) => [{ wall: f.left, way: 1, bubble: f }, { wall: f.right, way: -1, bubble: f }]).map(({ wall: f, way: h, bubble: w }) => ({ spot: { x: f - h * s * e.size, y: r.top, face: 0, posture: "stand", view: null, on: r.element, lean: { wall: f, way: h } }, bubble: w })).filter(({ spot: f, bubble: h }) => f.x >= r.left + u && f.x <= r.right - u && !Rl(yi(f, e), h)).map(({ spot: f }) => f).filter((f) => Dt(f, e, a.floors) && mn(f, e) && !Pt(f, e)).sort((f, h) => Math.abs(f.x - t.x) - Math.abs(h.x - t.x))[0] ?? null;
}
const cl = { reach: 1.1, eyes: 0.72 };
function bd(e, t, a) {
  const r = t.y - cl.eyes * Je(a), s = (c) => Math.max(c.left - t.x, t.x - c.right, 0);
  return e.floors.filter((c) => c.kind === "bubble" && c.element !== t.on && c.top <= r && c.bottom >= r && s(c) <= cl.reach * a.size).sort((c, u) => s(c) - s(u))[0] ?? null;
}
const xd = (e, t) => e - t.left <= t.right - e ? -1 : 1, wd = 0.18;
function kd(e, t) {
  const a = me(), { edge: r } = te(), s = je(null, e, { x: t > 0 ? a.right : a.left, y: 0 }), i = t > 0 ? r.left + r.width - xa * e.size : r.left + xa * e.size, u = (t > 0 ? a.right : a.left) - t * wd * e.size, p = t * (u - i);
  if (p < Ze.within) return { ...s, x: t > 0 ? Math.min(u, i) : Math.max(u, i) };
  const m = (F) => Math.tan(F * Math.PI / 180), f = Math.min(p / m(Ze.lean), Ze.most * Je(e)), h = Math.min(p, f * m(Ze.steepest)), w = Ze.over * Je(e), E = i + t * h, x = { x: i, y: r.top };
  return { ...s, x: E, y: r.top - f, ladder: { foot: x, top: { x: E + t * w * h / f, y: r.top - f - w }, way: t } };
}
const _d = (e, t) => {
  var a;
  return ((a = t == null ? void 0 : t.to) == null ? void 0 : a.ladder) ?? (e.ladder && (!(t != null && t.moves) || t.clip === "ladder_climb" || t.legs.some((r) => r.clip === "ladder_climb")) ? e.ladder : null);
};
function Ct(e, t, a) {
  var r;
  if (e.where === "bubble") {
    const s = e.perch && gn(e.perch, oe(), t);
    return s ? { ...s, view: null } : null;
  }
  if (e.where === "tab") {
    const s = e.view && je(e.view, t, a);
    return s ? { ...s, view: null } : null;
  }
  return e.where === "edge" ? je(null, t, e.along) : e.where === "rummage" ? kd(t, e.way) : e.where === "mark" ? _a(e.card, t) : e.where === "ledge" ? hn(e.along, t, a) : e.where === "bubble_ledge" ? hn(e.along, t, { on: (r = oe().floors.find((s) => s.id === e.floor)) == null ? void 0 : r.element }) : e.where === "composed" ? fd(t, a, e) : e.where === "lean" ? vd(t, a) : e.where === "rope_swing" ? Yl(oe().floors.find((s) => s.id === e.floor), t) : e.where === "seat" ? Il(t, a) ?? pn(t, a) : e.where === "aside" ? e.spot : pn(t, a);
}
function $d({ state: e, counts: t, stay: a, now: r, near: s, figure: i, hands: c, work: u = null, pile: p = null, cleared: m = { until: 0 }, random: f = Math.random, tally: h = null, memory: w = null, room: E = 0 }) {
  var G;
  const x = u && ui(i, s, u);
  if (x) return { spot: Bt(x, i) ? x : null, stay: a };
  const F = Od({ state: e, counts: t, stay: a, now: r, near: s, figure: i, hands: c, random: f, tally: h, memory: w, room: E });
  if ((G = F.spot) != null && G.ladder) return { ...F, spot: Bt(F.spot, i) ? F.spot : null };
  const L = Md(Ad(ci(Zl(F.spot, { state: e, now: r, near: s, figure: i, cleared: m }), p, i), i), s);
  return { ...F, spot: Bt(L, i) ? L : null };
}
const Md = (e, t) => e != null && e.on && e.on !== t.on && e.on === te().element && pi() ? null : e;
function Sd(e, t) {
  const a = Tl(t) ?? je(null, t);
  return (e == null ? void 0 : e.on) === a.on && e.posture === a.posture && Math.abs(e.x - a.x) < 2 ? null : a;
}
const Ad = (e, t) => e && te().docked && e.on === te().element ? Tl(t) ?? e : e, dl = (e) => Tt(e) === "work";
function Zl(e, { state: t, now: a, near: r, figure: s, cleared: i }) {
  return a >= i.until || !Rl(It(e, s), i.box) ? e : hi(i.box, s, r, Ll.has(t)) ?? e;
}
function Od({ state: e, counts: t, stay: a, now: r, near: s, figure: i, hands: c, random: u, tally: p, memory: m, room: f }) {
  if (Ll.has(e)) return { spot: pn(i, s), stay: a };
  const h = { memory: m, now: r, room: f }, w = Tt(e) === "type" && Ed(a, r, i, c, u, s, h);
  if (w) return w;
  const E = fi(t, zl()), x = E && Lt(je(E, i, s), i, s, h);
  if (x) return { spot: x, stay: a };
  const F = !a.laptop && r < a.until && Lt(Ct(a, i, s), i, s, h);
  if (F) return { spot: F, stay: a };
  const L = Xl(r, i, c, u, { tally: p, free: f > 0, room: f, memory: m });
  return { spot: Lt(Ct(L, i, s), i, s, h) || pn(i, s), stay: L };
}
function Ed(e, t, a, r, s, i, c) {
  const u = e.laptop && t < e.until && Lt(Ct(e, a, i), a, i, c);
  if (u) return { spot: u, stay: e };
  const p = { ...Xl(t, a, r, s, { moment: "laptop", memory: c.memory }), laptop: !0 }, m = Lt(Ct(p, a, i), a, i, c);
  if (m) return { spot: m, stay: p };
  const f = Il(a, i);
  return f && { spot: f, stay: { ...p, where: "seat" } };
}
const Nd = { seconds: 4 }, Fd = (e) => e.some((t) => t.hopping && t.clip !== "fall"), Bd = (e, t, a) => e && t === "bubble" ? { until: a + Nd.seconds } : null, Td = (e, t, a) => a || !e || t >= e.until, fl = { least: 30, more: 30 };
function Ld(e, t, a, r, s) {
  return t ? a && (e != null && e.seated) ? e : { until: r + fl.least + s() * fl.more, seated: !0 } : e != null && e.seated ? null : e;
}
const zd = (e, t, a, r) => !(a != null && a.seated) || r >= a.until || e.postures.includes(t) || !!e.rises, dn = 30, Rd = (e, t, a) => ({ stay: { ...e, until: 0 }, cleared: { box: t, until: a + dn } }), Id = (e) => e.where === "edge" ? e : { where: "rest", until: e.where === "rest" ? e.until : 0 }, Cd = (e, t) => gi(t) ? { ...e, until: 0 } : e, Dd = ["width", "height"], un = 14, cn = 4, Pd = {
  __name: "StepLadder",
  props: {
    foot: { type: Object, required: !0 },
    top: { type: Object, required: !0 }
  },
  setup(e) {
    const t = e, a = $(() => ({
      left: Math.min(t.foot.x, t.top.x) - un - cn,
      top: t.top.y - cn,
      right: Math.max(t.foot.x, t.top.x) + un + cn,
      bottom: t.foot.y + cn
    })), r = $(() => ({
      left: `${a.value.left}px`,
      top: `${a.value.top}px`,
      width: `${a.value.right - a.value.left}px`,
      height: `${a.value.bottom - a.value.top}px`,
      "--fallen": `${t.top.x > t.foot.x ? -80 : 80}deg`,
      transformOrigin: `${t.foot.x - a.value.left}px ${t.foot.y - a.value.top}px`
    })), s = $(() => {
      const [i, c, u, p] = [t.foot.x - a.value.left, t.foot.y - a.value.top, t.top.x - a.value.left, t.top.y - a.value.top], m = Math.hypot(u - i, p - c), [f, h] = [(u - i) / m, (p - c) / m], [w, E] = [-h * (un / 2), f * (un / 2)], x = [-1, 1].map((L) => ({ x1: i + L * w, y1: c + L * E, x2: u + L * w, y2: p + L * E })), F = Array.from({ length: Math.floor(m / Ze.rung) }, (L, G) => {
        const se = (G + 0.6) * Ze.rung, [M, Fe] = [i + f * se, c + h * se];
        return { x1: M - w, y1: Fe - E, x2: M + w, y2: Fe + E };
      });
      return { rails: x, rungs: F };
    });
    return (i, c) => (b(), k("div", {
      class: "step-ladder",
      style: ae(r.value),
      "aria-hidden": "true",
      "data-step-ladder": ""
    }, [
      (b(), k("svg", {
        class: "step-ladder-drawing",
        width: a.value.right - a.value.left,
        height: a.value.bottom - a.value.top
      }, [
        (b(!0), k(R, null, U(s.value.rungs, (u, p) => (b(), k("line", Io({
          key: `rung${p}`,
          class: "step-ladder-rung"
        }, { ref_for: !0 }, u), null, 16))), 128)),
        (b(!0), k(R, null, U(s.value.rails, (u, p) => (b(), k("line", Io({
          key: `rail${p}`,
          class: "step-ladder-rail"
        }, { ref_for: !0 }, u), null, 16))), 128))
      ], 8, Dd))
    ], 4));
  }
}, qd = /* @__PURE__ */ Ge(Pd, [["__scopeId", "data-v-1674d262"]]), et = { hopMs: 220, perPixel: 0.7, arc: 0.3, gone: [1e3, 5e3], chute: 1.1 };
function jd(e, t, a) {
  const r = [...t, { x: (t.at(-1) ?? e).x, y: a }];
  return r.map((s, i) => {
    const c = i ? r[i - 1] : e;
    return { from: c, to: s, ms: et.hopMs + et.perPixel * Math.hypot(s.x - c.x, s.y - c.y) };
  });
}
function Gd(e, t, a) {
  var s;
  let r = t;
  for (const i of e) {
    if (r < i.ms) {
      const c = r / i.ms, u = et.arc * a * 4 * c * (1 - c);
      return { x: i.from.x + (i.to.x - i.from.x) * c, y: i.from.y + (i.to.y - i.from.y) * c - u, way: Math.sign(i.to.x - i.from.x), gone: !1 };
    }
    r -= i.ms;
  }
  return { ...(s = e.at(-1)) == null ? void 0 : s.to, way: 0, gone: !0 };
}
const Hd = (e) => et.gone[0] + e() * (et.gone[1] - et.gone[0]), zt = { sampled: 0.1, fastest: 3e3, spin: 900, bounce: 0.5, away: 500 }, Ud = 0.05, Jl = (e, t, a) => Math.min(Math.max(e, t), a);
function Wd(e, t) {
  const a = e.filter((m) => t - m.at <= zt.sampled);
  if (a.length < 2) return { x: 0, y: 0 };
  const [r, s] = [a[0], a.at(-1)], i = Math.max(s.at - r.at, 1e-3), [c, u] = [(s.x - r.x) / i, (s.y - r.y) / i], p = Math.min(1, zt.fastest / Math.max(Math.hypot(c, u), 1e-9));
  return { x: c * p, y: u * p };
}
const pl = (e) => !!(e != null && e.held || e != null && e.thrown);
function hl(e, t, a, r = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, s = { x: 0, y: 0 }) {
  const { a: i, b: c, c: u, d: p, e: m, f } = r, h = i * p - c * u, w = t.x - e.x - s.x - m + i * s.x + u * s.y, E = t.y - e.y - s.y - f + c * s.x + p * s.y, x = { x: (p * w - u * E) / h / a, y: (i * E - c * w) / h / a }, F = Math.hypot(i, c);
  return { at: { x: t.x - x.x * a, y: t.y - x.y * a }, point: x, angle: Math.atan2(c, i), scale: [F, h / F] };
}
function Na(e, t) {
  if (!e.scaleFrom) return [1, 1];
  const a = Jl((t - e.scaleAt) / 180, 0, 1), r = a * a * (3 - 2 * a);
  return e.scaleFrom.map((s) => s + (1 - s) * r);
}
function ml(e, t) {
  var u, p;
  const a = e.hang ?? 0, [r, s] = e.scale ?? [1, 1], i = ((((u = e.grip) == null ? void 0 : u.x) ?? 0.5) - 0.5) * t, c = ((((p = e.grip) == null ? void 0 : p.y) ?? 0.55) - 0.55) * t;
  return { ...e, x: e.x + i - Math.cos(a) * r * i + Math.sin(a) * s * c, y: e.y + c - Math.sin(a) * r * i - Math.cos(a) * s * c };
}
const Kd = (e, t, a) => ({
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
  ...e.scaleFrom && { scale: Na(e, a), scaleFrom: e.scaleFrom, scaleAt: e.scaleAt }
});
function Yd(e, t, a, r) {
  const s = Math.min((r - e.at) / 1e3, Ud), i = e.x + e.vx * s, c = i < a.left || i > a.right, u = Jl(i, a.left, a.right), { landed: p, ...m } = Gl({ ...e, x: u }, t, s);
  if (p) return { airborne: null, landed: { x: u, y: p.top, posture: "stand", face: 0, view: null, on: p.element ?? null }, gone: !1 };
  const f = e.spin + (Math.sign(e.vx) || 1) * zt.spin * s, h = { ...e, ...m, x: u, vx: c ? -e.vx * zt.bounce : e.vx, spin: f, at: r, ...e.scaleFrom && { scale: Na(e, r) } };
  return { airborne: h, landed: null, gone: h.speed < 0 && h.y <= a.top - zt.away };
}
const ge = { close: 60, open: 90, shut: 0.06, every: [2500, 6e3] };
function Vd(e) {
  if (e < 0 || e >= ge.close + ge.open) return 1;
  const t = e < ge.close ? e / ge.close : 1 - (e - ge.close) / ge.open;
  return 1 + (ge.shut - 1) * t;
}
const yl = (e) => ge.every[0] + e() * (ge.every[1] - ge.every[0]), Xd = ["data-figure-pile"], Zd = ["src"], Jd = {
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
      const x = ++s, F = bi(Math.random).map((L, G) => ({ ...L, id: `${x}-${G}` }));
      r.value = [...r.value, { id: x, digits: F }], setTimeout(() => r.value = r.value.filter((L) => L.id !== x), Math.max(...F.map((L) => Math.max(L.moveMs, L.fadeMs))));
    }
    va(
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
    }), m = $(() => ({ left: `${t.x}px`, top: `${t.y}px`, zIndex: t.ahead ? wa.ahead : wa.behind })), f = $(() => ({ transform: `translateY(${-t.up}px)` })), h = $(() => ({ transform: `scale(${t.scale})`, opacity: t.opacity })), w = $(() => ({
      width: `${t.block.width}px`,
      height: `${t.block.height}px`,
      bottom: `${-t.block.below}px`,
      "--blink-ms": `${qo.ms * t.block.pictures.length}ms`
    })), E = (x) => ({ animationDelay: `${-(t.block.pictures.length - x) * qo.ms}ms` });
    return (x, F) => (b(), k("div", {
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
            style: ae(w.value),
            "data-figure-pile": e.piled ? "" : null
          }, [
            (b(!0), k(R, null, U(e.block.pictures, (L, G) => (b(), k("img", {
              key: G,
              class: Fl(["code-parcel-step", { blinks: e.block.pictures.length > 1 }]),
              src: L,
              style: ae(E(G)),
              alt: ""
            }, null, 14, Zd))), 128))
          ], 12, Xd)
        ], 4)
      ], 4),
      (b(!0), k(R, null, U(r.value, (L) => (b(), k("div", {
        key: L.id,
        class: "code-parcel-dust"
      }, [
        (b(), k(R, null, U(a, (G) => A("span", {
          key: `${G.x}/${G.y}`,
          class: "code-parcel-cloud",
          style: ae(u(G))
        }, null, 4)), 64)),
        (b(!0), k(R, null, U(L.digits, (G) => (b(), k("span", {
          key: G.id,
          class: "code-parcel-digit",
          style: ae(p(G))
        }, $a(G.text), 5))), 128))
      ]))), 128))
    ], 4));
  }
}, Qd = /* @__PURE__ */ Ge(Jd, [["__scopeId", "data-v-191db8a4"]]), W = { ink: "#272936", paper: "#f6f1e3", red: "#d9413b", wood: "#8a5a2b", gold: "#e8b84a", light: "#fff3a8", silver: "#c3c7d1", smoke: "#e9e7e1" }, ef = ["transform"], tf = ["fill"], nf = ["fill"], af = ["fill"], of = {
  __name: "AskSign",
  props: {
    u: { type: Number, required: !0 },
    hand: { type: Object, required: !0 }
  },
  setup(e) {
    const t = e, a = X.ask_sign, r = $(() => t.u > a.raise[0] && t.u < a.lower[1]), s = $(() => {
      const [i, c] = a.waggle, u = Math.min(Math.max((t.u - i) / (c - i), 0), 1);
      return 14 * Math.sin(2 * Math.PI * a.waggles * u) * Math.sin(Math.PI * u);
    });
    return (i, c) => r.value ? (b(), k("g", {
      key: 0,
      transform: `translate(${e.hand.x} ${e.hand.y}) rotate(${s.value})`
    }, [
      A("rect", {
        x: "-1.2",
        y: "-22",
        width: "2.4",
        height: "26",
        fill: j(W).wood
      }, null, 8, tf),
      A("rect", {
        x: "-12",
        y: "-40",
        width: "24",
        height: "20",
        rx: "2",
        fill: j(W).paper,
        "stroke-width": "1.4"
      }, null, 8, nf),
      A("text", {
        x: "0",
        y: "-24.5",
        "text-anchor": "middle",
        class: "figure-act-mark",
        fill: j(W).ink,
        stroke: "none"
      }, "?", 8, af)
    ], 8, ef)) : q("", !0);
  }
}, lf = /* @__PURE__ */ Ge(of, [["__scopeId", "data-v-e8e687f5"]]), sf = ["x1", "y1", "x2", "y2", "stroke"], rf = { id: "figure-act-ball" }, uf = ["cx", "cy", "r"], cf = ["cx", "cy", "r"], df = { "clip-path": "url(#figure-act-ball)" }, ff = ["x", "y", "width", "height", "fill"], pf = ["cx", "cy", "r", "stroke"], hf = ["cx", "cy", "fill"], mf = {
  __name: "DiscoBall",
  props: {
    u: { type: Number, required: !0 },
    middle: { type: Number, required: !0 },
    floor: { type: Number, required: !0 },
    size: { type: Number, required: !0 },
    ball: { type: Object, required: !0 }
  },
  setup(e) {
    const t = e, a = $(() => {
      const r = X.disco.ball * t.size / 2, s = t.floor - t.ball.hangs, i = t.u * 40, c = [];
      for (let p = -2; p <= 2; p++) for (let m = -3; m <= 3; m++) c.push({ name: `tile${p}:${m}`, x: t.middle + m * r * 0.42 + i * r * 0.42 % (r * 0.42) - r * 0.21, y: s + p * r * 0.42, light: (p + m + Math.floor(i)) % 3 === 0 });
      const u = Array.from({ length: 9 }, (p, m) => {
        const f = m * 0.7 + t.u * 9;
        return { name: `fleck${m}`, x: t.middle + Math.cos(f) * t.size * (0.55 + 0.1 * (m % 3)), y: s + 10 + Math.abs(Math.sin(f * 1.3)) * t.size * 0.75, colour: `hsl(${(m * 40 + t.u * 1400) % 360} 95% 65%)` };
      });
      return { x: t.middle, y: s, r, top: t.floor - t.ball.above, tiles: c, flecks: u };
    });
    return (r, s) => (b(), k(R, null, [
      A("line", {
        x1: a.value.x,
        y1: a.value.top,
        x2: a.value.x,
        y2: a.value.y - a.value.r,
        stroke: j(W).silver,
        "stroke-width": "1"
      }, null, 8, sf),
      A("clipPath", rf, [
        A("circle", {
          cx: a.value.x,
          cy: a.value.y,
          r: a.value.r
        }, null, 8, uf)
      ]),
      A("circle", {
        cx: a.value.x,
        cy: a.value.y,
        r: a.value.r,
        fill: "#8d93a3"
      }, null, 8, cf),
      A("g", df, [
        (b(!0), k(R, null, U(a.value.tiles, (i) => (b(), k("rect", {
          key: i.name,
          x: i.x - a.value.r * 0.18,
          y: i.y - a.value.r * 0.18,
          width: a.value.r * 0.36,
          height: a.value.r * 0.36,
          fill: i.light ? "#f4f6fb" : "#b9bfcc"
        }, null, 8, ff))), 128))
      ]),
      A("circle", {
        cx: a.value.x,
        cy: a.value.y,
        r: a.value.r,
        fill: "none",
        stroke: j(W).ink,
        "stroke-width": "0.8"
      }, null, 8, pf),
      (b(!0), k(R, null, U(a.value.flecks, (i) => (b(), k("circle", {
        key: i.name,
        cx: i.x,
        cy: i.y,
        r: "2.2",
        fill: i.colour,
        opacity: "0.85"
      }, null, 8, hf))), 128))
    ], 64));
  }
}, gf = ["transform"], yf = ["fill"], vf = ["transform"], bf = ["x", "y", "height", "fill"], xf = ["x", "y", "height"], wf = ["x", "y", "width", "fill"], kf = ["x", "y", "fill"], _f = ["d"], $f = {
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
    const t = e, a = { across: 0.24, top: 0.3 }, r = X.file_card, s = $(() => ({ x: t.middle + t.out * a.across * t.size, top: t.floor - a.top * t.size, up: xi(r, t.u) })), i = $(() => `translate(0 ${t.floor}) scale(1 ${s.value.up}) translate(0 ${-t.floor})`), c = $(() => de(t.u, r.opens) * (1 - de(t.u, r.shuts))), u = $(() => de(t.u, r.filed));
    return (p, m) => (b(), k(R, null, [
      u.value < 1 && e.u > j(r).reach[0] ? (b(), k("g", {
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
        }, null, 8, yf),
        m[0] || (m[0] = A("path", {
          d: "M-4 -1.5h8M-4 1h6",
          "stroke-width": "0.5"
        }, null, -1))
      ], 8, gf)) : q("", !0),
      A("g", { transform: i.value }, [
        A("rect", {
          x: s.value.x - 12,
          y: s.value.top,
          width: 24,
          height: e.floor - s.value.top,
          rx: "1",
          fill: j(W).wood
        }, null, 8, bf),
        A("rect", {
          x: s.value.x - 10,
          y: s.value.top + 2 - 5 * c.value,
          width: "20",
          height: 5 * c.value,
          fill: "#5b3a1c",
          "stroke-width": "0.6"
        }, null, 8, xf),
        A("rect", {
          x: s.value.x - 10 - 1.5 * c.value,
          y: s.value.top + 2,
          width: 20 + 3 * c.value,
          height: "10",
          rx: "1",
          fill: j(W).wood
        }, null, 8, wf),
        A("rect", {
          x: s.value.x - 10,
          y: s.value.top + 14,
          width: "20",
          height: "10",
          rx: "1",
          fill: j(W).wood
        }, null, 8, kf),
        A("path", {
          d: `M${s.value.x - 3} ${s.value.top + 7}h6M${s.value.x - 3} ${s.value.top + 19}h6`,
          "stroke-width": "1.4"
        }, null, 8, _f)
      ], 8, vf)
    ], 64));
  }
}, Mf = ["cx", "cy", "r", "opacity"], Sf = {
  __name: "FumeSteam",
  props: {
    u: { type: Number, required: !0 },
    head: { type: Object, required: !0 }
  },
  setup(e) {
    const t = e, a = X.fume, r = $(() => {
      const s = (t.u - a.steam[0]) / (a.steam[1] - a.steam[0]);
      return s <= 0 || s >= 1 ? [] : Array.from({ length: 6 }, (i, c) => {
        const u = (s * 3 + c / 6) % 1, p = c % 2 ? 1 : -1;
        return { name: `puff${c}`, x: t.head.x + p * (12 + 10 * u), y: t.head.y - 14 - 26 * u, r: 2.5 + 4 * u, fade: 1 - u };
      });
    });
    return (s, i) => (b(!0), k(R, null, U(r.value, (c) => (b(), k("circle", {
      key: c.name,
      cx: c.x,
      cy: c.y,
      r: c.r,
      fill: "#e9e7e1",
      stroke: "#a9adb8",
      "stroke-width": "0.6",
      opacity: c.fade
    }, null, 8, Mf))), 128));
  }
}, Af = ["transform"], Of = ["cx", "cy", "r", "fill", "opacity"], Ef = ["d", "fill", "opacity"], Nf = {
  __name: "HandRub",
  props: {
    u: { type: Number, required: !0 },
    hand: { type: Object, required: !0 }
  },
  setup(e) {
    const t = e, a = [[-9, -12], [8, -18], [1, -26]], r = X.hand_rub, s = $(() => {
      const i = (t.u - r.puff[0]) / (r.puff[1] - r.puff[0]);
      if (i <= 0 || i >= 1) return null;
      const c = Math.min(i * 6, 1, (1 - i) * 6), u = Array.from({ length: r.puffs }, (m, f) => {
        const h = (i + f / r.puffs) % 1;
        return { name: `puff${f}`, x: (f - (r.puffs - 1) / 2) * 5 + 3 * Math.sin(h * 6 + f), y: -4 - 16 * h, r: 2 + 3.5 * h, fade: c * (1 - h) * 0.85 };
      }), p = a.slice(0, r.sparkles).map(([m, f], h) => {
        const w = 2.6 * Math.max(Math.sin(Math.PI * ((i * 4 + h / 3) % 1)), 0), E = `M${m} ${f - w * 2}L${m + w * 0.5} ${f - w * 0.5}L${m + w * 2} ${f}L${m + w * 0.5} ${f + w * 0.5}L${m} ${f + w * 2}L${m - w * 0.5} ${f + w * 0.5}L${m - w * 2} ${f}L${m - w * 0.5} ${f - w * 0.5}Z`;
        return { name: `sparkle${h}`, shape: E, fade: c };
      });
      return { puffs: u, sparkles: p };
    });
    return (i, c) => s.value ? (b(), k("g", {
      key: 0,
      class: "figure-act-rub",
      transform: `translate(${e.hand.x} ${e.hand.y})`
    }, [
      (b(!0), k(R, null, U(s.value.puffs, (u) => (b(), k("circle", {
        key: u.name,
        cx: u.x,
        cy: u.y,
        r: u.r,
        fill: j(W).smoke,
        stroke: "#a9adb8",
        "stroke-width": "0.5",
        opacity: u.fade
      }, null, 8, Of))), 128)),
      (b(!0), k(R, null, U(s.value.sparkles, (u) => (b(), k("path", {
        key: u.name,
        d: u.shape,
        fill: j(W).light,
        stroke: "none",
        opacity: u.fade
      }, null, 8, Ef))), 128))
    ], 8, Af)) : q("", !0);
  }
}, Ff = ["transform"], Bf = ["d"], Tf = ["d"], Lf = ["x", "y", "width", "height"], zf = ["d"], Rf = ["y"], If = ["transform", "opacity"], Cf = ["cx", "cy", "r"], Df = ["transform"], Pf = {
  __name: "PackBox",
  props: {
    u: { type: Number, required: !0 },
    middle: { type: Number, required: !0 },
    floor: { type: Number, required: !0 }
  },
  setup(e) {
    const t = e, a = [-2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4].map((c, u) => ({ name: `cloud${u}`, way: c })), r = [1, 2, 3, 4].map((c) => ({ name: `bit${c}`, place: c })), s = X.pack_box, i = $(() => {
      const { into: c, out: u } = Ma(s, t.u), p = u >= s.pops, m = p ? Math.min((u - s.pops) / 0.4, 1) : 0;
      return { grown: de(c, s.appears), popped: p, puff: m, x: t.middle, width: 50, height: 36 };
    });
    return (c, u) => (b(), k(R, null, [
      !i.value.popped && i.value.grown > 0 ? (b(), k("g", {
        key: 0,
        transform: `translate(${i.value.x} ${e.floor}) scale(${i.value.grown})`
      }, [
        A("path", {
          d: `M${-i.value.width / 2} ${-i.value.height}l-12 -9 4 -4 8 13Z`,
          fill: "#b88a55"
        }, null, 8, Bf),
        A("path", {
          d: `M${i.value.width / 2} ${-i.value.height}l12 -9 -4 -4 -8 13Z`,
          fill: "#b88a55"
        }, null, 8, Tf),
        A("rect", {
          x: -i.value.width / 2,
          y: -i.value.height,
          width: i.value.width,
          height: i.value.height,
          fill: "#c89b63"
        }, null, 8, Lf),
        A("path", {
          d: `M${-i.value.width / 2} ${-i.value.height + 5}H${i.value.width / 2}`,
          "stroke-width": "0.6"
        }, null, 8, zf),
        A("rect", {
          x: "-7",
          y: -i.value.height + 8,
          width: "14",
          height: "6",
          fill: "#e8d4b0",
          "stroke-width": "0.6"
        }, null, 8, Rf)
      ], 8, Ff)) : q("", !0),
      i.value.popped && i.value.puff < 1 ? (b(), k("g", {
        key: 1,
        transform: `translate(${i.value.x} ${e.floor - 18})`,
        opacity: 1 - i.value.puff
      }, [
        (b(!0), k(R, null, U(j(a), (p) => (b(), k("circle", {
          key: p.name,
          cx: Math.sin(p.way) * 30 * i.value.puff,
          cy: -Math.cos(p.way) * 16 * i.value.puff,
          r: 8 + 8 * i.value.puff,
          fill: "#e9e7e1",
          stroke: "#a9adb8",
          "stroke-width": "0.8"
        }, null, 8, Cf))), 128)),
        (b(!0), k(R, null, U(j(r), (p) => (b(), k("rect", {
          key: p.name,
          x: "-3.5",
          y: "-2",
          width: "7",
          height: "4",
          fill: "#c89b63",
          transform: `translate(${(p.place - 2.5) * 22 * i.value.puff} ${-20 * i.value.puff + 30 * i.value.puff * i.value.puff}) rotate(${p.place * 70 * i.value.puff})`,
          "data-act-box-bit": ""
        }, null, 8, Df))), 128))
      ], 8, If)) : q("", !0)
    ], 64));
  }
}, qf = ["x1", "y1", "x2", "y2"], jf = ["transform"], Gf = ["href", "x", "y", "width", "height"], Hf = {
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
    const t = e, a = $(() => wi(t.canopy, t.head, [t.hand, t.other], t.size, t.u)), r = $(() => a.value.lines.map(({ from: i, to: c }, u) => ({ name: `line${u}`, x1: i.x, y1: i.y, x2: c.x, y2: c.y }))), s = $(() => `rotate(${a.value.turn} ${a.value.middle.x} ${a.value.middle.y})`);
    return (i, c) => (b(), k(R, null, [
      (b(!0), k(R, null, U(r.value, (u) => (b(), k("line", {
        key: u.name,
        x1: u.x1,
        y1: u.y1,
        x2: u.x2,
        y2: u.y2,
        "stroke-width": "0.7",
        "data-chute-line": ""
      }, null, 8, qf))), 128)),
      A("g", { transform: s.value }, [
        A("image", {
          href: e.canopy.picture,
          x: a.value.left,
          y: a.value.top,
          width: e.canopy.width,
          height: e.canopy.height,
          "data-chute-canopy": ""
        }, null, 8, Gf)
      ], 8, jf)
    ], 64));
  }
}, Uf = ["transform"], Wf = ["y1", "y2", "stroke"], Kf = ["x1", "y1", "x2", "y2", "stroke"], Yf = ["x1", "x2", "stroke"], Vf = ["d", "stroke"], Xf = {
  __name: "PogoStick",
  props: {
    u: { type: Number, required: !0 },
    middle: { type: Number, required: !0 },
    floor: { type: Number, required: !0 },
    size: { type: Number, required: !0 }
  },
  setup(e) {
    const t = e, a = $(() => {
      const { draw: r, drop: s, stick: i } = X.pogo, c = i * t.size, u = de(t.u, s), p = Array.from({ length: 7 }, (m, f) => `${f % 2 ? 3 : -3} ${2 + f * 1.6}`).join(" L");
      return {
        shown: de(t.u, [r[1] * 0.6, r[1]]),
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
    return (r, s) => a.value.shown ? (b(), k("g", {
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
      }, null, 8, Wf),
      A("line", {
        x1: -a.value.bar,
        y1: a.value.top,
        x2: a.value.bar,
        y2: a.value.top,
        stroke: j(W).silver,
        "stroke-width": "3",
        "stroke-linecap": "round"
      }, null, 8, Kf),
      A("line", {
        x1: -a.value.peg,
        y1: "-1",
        x2: a.value.peg,
        y2: "-1",
        stroke: j(W).red,
        "stroke-width": "2.4",
        "stroke-linecap": "round"
      }, null, 8, Yf),
      A("path", {
        d: a.value.spring,
        stroke: j(W).gold,
        "stroke-width": "1.2",
        fill: "none"
      }, null, 8, Vf)
    ], 8, Uf)) : q("", !0);
  }
}, Zf = ["x", "y"], Jf = ["x", "y"], Qf = {
  __name: "PressPlate",
  props: {
    u: { type: Number, required: !0 },
    middle: { type: Number, required: !0 },
    size: { type: Number, required: !0 }
  },
  setup(e) {
    const t = e, a = X.press, r = $(() => {
      const { into: s, out: i } = Ma(a, t.u);
      return t.size * 0.27 - 6 - 70 * (1 - de(s, a.lowers)) - 90 * de(i, a.lifts);
    });
    return (s, i) => (b(), k(R, null, [
      A("rect", {
        x: e.middle - 2,
        y: r.value - 200,
        width: "4",
        height: "200",
        fill: "#a9adb8"
      }, null, 8, Zf),
      A("rect", {
        x: e.middle - 22,
        y: r.value,
        width: "44",
        height: "6",
        rx: "1",
        fill: "#6b6f7c"
      }, null, 8, Jf)
    ], 64));
  }
}, ep = ["opacity"], tp = ["cx", "cy", "r", "fill"], np = ["opacity"], ap = ["cx", "cy", "r", "fill"], op = ["cx", "cy", "r", "fill"], lp = ["cx", "cy", "r", "fill", "opacity"], sp = {
  __name: "ThoughtCloud",
  props: {
    name: { type: String, required: !0 },
    u: { type: Number, required: !0 },
    head: { type: Object, required: !0 },
    out: { type: Number, required: !0 },
    size: { type: Number, required: !0 }
  },
  setup(e) {
    const t = e, a = { across: 0.24, above: 0.36, wide: 0.3, puffs: [[0.08, 0.12, 0.022], [0.13, 0.2, 0.03], [0.18, 0.27, 0.04]] }, r = [[-0.32, 0.05, 0.2], [-0.12, -0.12, 0.24], [0.14, -0.1, 0.22], [0.32, 0.06, 0.18], [0, 0.12, 0.22]], s = (c) => c * t.size, i = $(() => {
      const { puffs: c, cloud: u, rise: p, pulse: m, frames: f, fps: h } = X[t.name];
      if (!m) return null;
      const w = (Q, o) => c ? de(t.u, [Q, o]) : 1, E = c ? de(t.u, [u[0], c[1]]) * (1 - de(t.u, [u[1], p[1]])) : 1;
      if (!E) return null;
      const x = t.u * f / h, F = a.puffs.map(([Q, o, ht], He) => ({
        name: `puff${He}`,
        x: t.head.x + t.out * s(Q),
        y: t.head.y - s(o),
        r: s(ht) * (c ? w(c[0] + He * (c[1] - c[0]) / 3, c[0] + (He + 1) * (c[1] - c[0]) / 3) : 1)
      })), L = t.head.x + t.out * s(a.across), G = t.head.y - s(a.above), se = s(a.wide), M = r.map(([Q, o, ht], He) => ({ name: `bump${He}`, x: L + Q * se, y: G + o * se, r: ht * se })), Fe = [-1, 0, 1].map((Q, o) => ({ name: `dot${o}`, x: L + Q * se * 0.22, y: G, r: se * 0.05 * (1 + 0.5 * Math.max(Math.sin(2 * Math.PI * (x / m - o / 3)), 0)), lit: 0.35 + 0.65 * Math.max(Math.sin(2 * Math.PI * (x / m - o / 3)), 0) }));
      return { shown: E, rising: F, bumps: M, dots: Fe, grown: c ? w(c[0] + 2 * (c[1] - c[0]) / 3, c[1]) : 1 };
    });
    return (c, u) => i.value ? (b(), k("g", {
      key: 0,
      opacity: i.value.shown,
      "data-thought-cloud": ""
    }, [
      (b(!0), k(R, null, U(i.value.rising, (p) => (b(), k("circle", {
        key: p.name,
        cx: p.x,
        cy: p.y,
        r: p.r,
        fill: j(W).paper,
        "stroke-width": "0.8"
      }, null, 8, tp))), 128)),
      i.value.grown ? (b(), k("g", {
        key: 0,
        opacity: i.value.grown
      }, [
        (b(!0), k(R, null, U(i.value.bumps, (p) => (b(), k("circle", {
          key: p.name,
          cx: p.x,
          cy: p.y,
          r: p.r,
          fill: j(W).paper,
          "stroke-width": "0.9"
        }, null, 8, ap))), 128)),
        (b(!0), k(R, null, U(i.value.bumps, (p) => (b(), k("circle", {
          key: p.name,
          cx: p.x,
          cy: p.y,
          r: p.r - 0.8,
          fill: j(W).paper,
          stroke: "none"
        }, null, 8, op))), 128)),
        (b(!0), k(R, null, U(i.value.dots, (p) => (b(), k("circle", {
          key: p.name,
          cx: p.x,
          cy: p.y,
          r: p.r,
          fill: j(W).ink,
          stroke: "none",
          opacity: p.lit,
          "data-thought-dot": ""
        }, null, 8, lp))), 128))
      ], 8, np)) : q("", !0)
    ], 8, ep)) : q("", !0);
  }
}, rp = ["opacity"], ip = ["d", "stroke"], up = ["d"], cp = ["x", "y"], dp = ["cx", "cy", "fill"], fp = ["cx", "cy", "fill"], pp = ["transform"], hp = ["x", "y", "font-size", "opacity", "fill"], mp = {
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
    const t = e, a = ["abc", "the", "ok", "do", "fix"], r = X.vacuum, s = $(() => {
      const { into: i, out: c } = Ma(r, t.u), u = i * (1 - c), p = t.middle + t.out * t.size * 0.44, m = t.floor, f = { x: t.hand.x + t.out * 7, y: t.hand.y + 4 }, h = (t.u * (r.intro + r.hold + r.outro) - r.intro) / r.hold, w = Array.from({ length: r.words }, (E, x) => {
        const F = ((h * 2 + x / r.words) % 1 + 1) % 1, L = { x: f.x + t.out * (70 + 12 * (x % 3)), y: f.y - 30 + 13 * x };
        return { x: L.x + (f.x - L.x) * F ** 1.6, y: L.y + (f.y - L.y) * F ** 1.6, size: 1 - 0.7 * F, opacity: de(F, [0, 0.12]) * (1 - de(F, [0.85, 1])), word: a[x] };
      });
      return {
        on: u,
        x: p,
        y: m,
        nozzle: `translate(${f.x} ${f.y}) scale(${t.out} 1)`,
        words: w,
        hose: `M${p} ${m - 12}Q${p} ${f.y + 30} ${f.x - t.out * 6} ${f.y}`
      };
    });
    return (i, c) => s.value.on > 0 ? (b(), k("g", {
      key: 0,
      opacity: s.value.on
    }, [
      A("path", {
        d: s.value.hose,
        fill: "none",
        "stroke-width": "2.6",
        stroke: j(W).ink
      }, null, 8, ip),
      A("path", {
        d: s.value.hose,
        fill: "none",
        "stroke-width": "1.4",
        stroke: "#6366f1"
      }, null, 8, up),
      A("rect", {
        x: s.value.x - 9,
        y: s.value.y - 16,
        width: "18",
        height: "14",
        rx: "4",
        fill: "#ef476f"
      }, null, 8, cp),
      A("circle", {
        cx: s.value.x - 5,
        cy: s.value.y - 2,
        r: "2.5",
        fill: j(W).ink
      }, null, 8, dp),
      A("circle", {
        cx: s.value.x + 5,
        cy: s.value.y - 2,
        r: "2.5",
        fill: j(W).ink
      }, null, 8, fp),
      A("g", {
        transform: s.value.nozzle
      }, [...c[0] || (c[0] = [
        A("path", {
          d: "M-6 -1.6H2L6 -4.5V4.5L2 1.6H-6Z",
          fill: "#35374b"
        }, null, -1)
      ])], 8, pp),
      (b(!0), k(R, null, U(s.value.words, (u) => (b(), k("text", {
        key: u.word,
        x: u.x,
        y: u.y,
        "font-size": 7 * u.size,
        opacity: u.opacity,
        "text-anchor": "middle",
        class: "figure-act-word",
        stroke: "none",
        fill: j(W).paper
      }, $a(u.word), 9, hp))), 128))
    ], 8, rp)) : q("", !0);
  }
}, gp = /* @__PURE__ */ Ge(mp, [["__scopeId", "data-v-ff0fa3ef"]]), yp = ["transform"], vp = ["href", "x", "y", "width", "height"], bp = ["id"], xp = ["x", "y", "width", "height"], wp = ["clip-path", "data-act-surface"], kp = ["x", "y", "width", "height", "rx", "opacity"], _p = ["cx", "cy", "r", "opacity"], $p = ["cx", "cy", "rx", "ry", "opacity"], Mp = ["cx", "cy", "r"], Sp = ["opacity"], Ap = ["x", "y", "width", "height"], Op = ["cx", "cy", "r"], Ep = ["cx", "cy", "r"], Np = ["cx", "cy", "r"], Et = "#9bd34a", fa = "#5f8f24", Fp = {
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
    const t = e, a = X.bug_shot, r = Kr(), s = $(() => {
      const m = Math.floor(t.u * a.frames / 2) % 2;
      return t.bugs.flatMap((f, h) => f.shot ? [] : [{ name: `bug${h}`, place: `translate(${f.x} ${f.y}) rotate(${f.turn})`, href: t.bug.pictures[m] }]);
    }), i = $(() => t.slush.filter((m) => !m.flying).map((m, f) => ({ ...m, name: `splash${f}` }))), c = $(() => t.slush.filter((m) => m.flying).map((m, f) => ({ ...m, name: `slush${f}` }))), u = $(() => ({ x: -t.bug.at.x, y: -t.bug.at.y, width: t.bug.width, height: t.bug.height })), p = $(() => t.camera.flatMap((m, f) => ki(m.seconds, t.size, m.from, { x: t.middle, y: t.size * 0.5 }).map((h, w) => ({ ...h, name: `drop${f}-${w}` }))));
    return (m, f) => (b(), k(R, null, [
      (b(!0), k(R, null, U(s.value, (h) => (b(), k("g", {
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
        }, null, 8, vp)
      ], 8, yp))), 128)),
      A("defs", null, [
        (b(!0), k(R, null, U(i.value, (h) => (b(), k(R, {
          key: h.name
        }, [
          h.clip ? (b(), k("clipPath", {
            key: 0,
            id: `${j(r)}-${h.name}`
          }, [
            A("rect", {
              x: h.clip.left,
              y: h.clip.top,
              width: h.clip.right - h.clip.left,
              height: h.clip.bottom - h.clip.top
            }, null, 8, xp)
          ], 8, bp)) : q("", !0)
        ], 64))), 128))
      ]),
      (b(!0), k(R, null, U(i.value, (h) => (b(), k("g", {
        key: h.name,
        "clip-path": h.clip ? `url(#${j(r)}-${h.name})` : null,
        "data-act-surface": h.on === "surface" ? "" : null
      }, [
        h.run > 0 ? (b(), k(R, { key: 0 }, [
          A("rect", {
            x: h.x - h.r * 0.22,
            y: h.y,
            width: h.r * 0.44,
            height: h.run,
            rx: h.r * 0.2,
            fill: Et,
            stroke: "none",
            opacity: h.opacity * 0.75,
            "data-act-run": ""
          }, null, 8, kp),
          A("circle", {
            cx: h.x,
            cy: h.y + h.run,
            r: h.r * 0.4,
            fill: Et,
            stroke: fa,
            "stroke-width": "0.5",
            opacity: h.opacity * 0.9
          }, null, 8, _p)
        ], 64)) : q("", !0),
        A("ellipse", {
          cx: h.x,
          cy: h.y,
          rx: h.r * (h.on === "floor" || h.on === "top" ? 1.4 : 0.7),
          ry: h.r * (h.on === "floor" || h.on === "top" ? 0.7 : 1.4),
          fill: Et,
          stroke: fa,
          "stroke-width": "0.5",
          opacity: h.opacity * 0.9,
          "data-act-splash": ""
        }, null, 8, $p)
      ], 8, wp))), 128)),
      (b(!0), k(R, null, U(c.value, (h) => (b(), k("circle", {
        key: h.name,
        cx: h.x,
        cy: h.y,
        r: h.r,
        fill: Et,
        stroke: fa,
        "stroke-width": "0.5",
        "data-act-slush": ""
      }, null, 8, Mp))), 128)),
      (b(!0), k(R, null, U(p.value, (h) => (b(), k("g", {
        key: h.name,
        class: "figure-act-lens",
        opacity: h.fade
      }, [
        h.landed ? (b(), k(R, { key: 0 }, [
          A("rect", {
            x: h.x - h.r * 0.25,
            y: h.y,
            width: h.r * 0.5,
            height: h.run,
            rx: "2",
            fill: "#9bd34a",
            opacity: "0.8"
          }, null, 8, Ap),
          A("circle", {
            cx: h.x,
            cy: h.y + h.run,
            r: h.r * 0.4,
            fill: "#9bd34a"
          }, null, 8, Op)
        ], 64)) : q("", !0),
        A("circle", {
          cx: h.x,
          cy: h.y,
          r: h.r,
          fill: Et,
          opacity: "0.85",
          "data-act-lens": ""
        }, null, 8, Ep),
        A("circle", {
          cx: h.x - h.r * 0.3,
          cy: h.y - h.r * 0.3,
          r: h.r * 0.25,
          fill: "#e8ffd0",
          opacity: "0.8"
        }, null, 8, Np)
      ], 8, Sp))), 128))
    ], 64));
  }
}, Bp = /* @__PURE__ */ Ge(Fp, [["__scopeId", "data-v-096d87ce"]]), Tp = ["width", "height", "viewBox", "data-act"], Lp = ["stroke"], zp = {
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
    const t = e, a = (f) => f * t.size, r = $(() => ({ x: a(t.hand.x), y: a(t.hand.y) })), s = $(() => ({ x: a(t.hand.other.x), y: a(t.hand.other.y) })), i = $(() => ({ x: a(t.head.x), y: a(t.head.y) })), c = $(() => a(t.feet)), u = $(() => a(0.5)), p = $(() => t.hand.out), m = $(() => !!X[t.name].pulse);
    return (f, h) => (b(), k("svg", {
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
        e.name === "ask_sign" ? (b(), ne(lf, {
          key: 0,
          u: e.u,
          hand: r.value
        }, null, 8, ["u", "hand"])) : q("", !0),
        m.value ? (b(), ne(sp, {
          key: 1,
          name: e.name,
          u: e.u,
          head: i.value,
          out: p.value,
          size: e.size
        }, null, 8, ["name", "u", "head", "out", "size"])) : q("", !0),
        e.name === "file_card" ? (b(), ne($f, {
          key: 2,
          u: e.u,
          hand: r.value,
          middle: u.value,
          floor: c.value,
          out: p.value,
          size: e.size
        }, null, 8, ["u", "hand", "middle", "floor", "out", "size"])) : q("", !0),
        e.name === "hand_rub" ? (b(), ne(Nf, {
          key: 3,
          u: e.u,
          hand: r.value
        }, null, 8, ["u", "hand"])) : q("", !0),
        e.name === "fume" ? (b(), ne(Sf, {
          key: 4,
          u: e.u,
          head: i.value
        }, null, 8, ["u", "head"])) : q("", !0),
        e.name === "bug_shot" && e.bug ? (b(), ne(Bp, {
          key: 5,
          u: e.u,
          middle: u.value,
          size: e.size,
          bug: e.bug,
          bugs: e.wallBugs,
          slush: e.slush,
          camera: e.camera
        }, null, 8, ["u", "middle", "size", "bug", "bugs", "slush", "camera"])) : q("", !0),
        e.name === "disco" && e.ball ? (b(), ne(mf, {
          key: 6,
          u: e.u,
          middle: u.value,
          floor: c.value,
          size: e.size,
          ball: e.ball
        }, null, 8, ["u", "middle", "floor", "size", "ball"])) : q("", !0),
        e.name === "pogo" ? (b(), ne(Xf, {
          key: 7,
          u: e.u,
          middle: u.value,
          floor: c.value,
          size: e.size
        }, null, 8, ["u", "middle", "floor", "size"])) : q("", !0),
        e.name === "chute" && e.canopy ? (b(), ne(Hf, {
          key: 8,
          u: e.u,
          head: i.value,
          hand: r.value,
          other: s.value,
          size: e.size,
          canopy: e.canopy
        }, null, 8, ["u", "head", "hand", "other", "size", "canopy"])) : q("", !0),
        e.name === "pack_box" ? (b(), ne(Pf, {
          key: 9,
          u: e.u,
          middle: u.value,
          floor: c.value
        }, null, 8, ["u", "middle", "floor"])) : q("", !0),
        e.name === "press" ? (b(), ne(Qf, {
          key: 10,
          u: e.u,
          middle: u.value,
          size: e.size
        }, null, 8, ["u", "middle", "size"])) : q("", !0),
        e.name === "vacuum" ? (b(), ne(gp, {
          key: 11,
          u: e.u,
          hand: r.value,
          middle: u.value,
          floor: c.value,
          out: p.value,
          size: e.size
        }, null, 8, ["u", "hand", "middle", "floor", "out", "size"])) : q("", !0)
      ], 8, Lp)
    ], 8, Tp));
  }
}, Rp = /* @__PURE__ */ Ge(zp, [["__scopeId", "data-v-4755d5ba"]]), Ip = 1440 * 60;
class vl extends Map {
  constructor(t, a) {
    super(), this.key = t;
    const r = _i(t, {});
    for (const [s, i] of Object.entries(r && typeof r == "object" ? r : {}))
      Number.isFinite(i) && a - i < Ip && super.set(s, i);
  }
  set(t, a) {
    return super.set(t, a), $i(this.key, Object.fromEntries(this)), this;
  }
}
const Cp = ["width"], Dp = ["href", "x", "y", "width", "height", "opacity", "transform"], Pp = ["transform", "opacity"], Ve = 48, qp = {
  __name: "FixedRunBug",
  props: {
    bug: { type: Object, required: !0 },
    at: { type: Object, required: !0 }
  },
  setup(e) {
    const t = e, a = $(() => {
      const c = (t.at.edge ?? t.at.y) - Ve, u = t.at.edge ?? t.at.y + Ve;
      return { left: `${t.at.x - Ve}px`, top: `${c}px`, width: `${2 * Ve}px`, height: `${u - c}px` };
    }), r = $(() => ({ x: Ve, y: t.at.y - (t.at.edge ?? t.at.y) + Ve })), s = $(() => ({ href: t.bug.pictures[t.at.step], x: -t.bug.at.x, y: -t.bug.at.y, width: t.bug.width, height: t.bug.height })), i = $(() => t.at.flat > 0 ? t.at.shows : 0);
    return (c, u) => (b(), k("div", {
      class: "fixed-run-bug",
      style: ae(a.value),
      "aria-hidden": "true",
      "data-act-bug-box": ""
    }, [
      (b(), k("svg", {
        width: 2 * Ve,
        height: "100%"
      }, [
        e.at.whole || e.at.flat ? (b(), k("image", {
          key: 0,
          href: s.value.href,
          x: s.value.x,
          y: s.value.y,
          width: s.value.width,
          height: s.value.height,
          opacity: e.at.shows,
          transform: `translate(${r.value.x} ${r.value.y}) rotate(${(e.at.way > 0 ? -1 : 1) * e.at.turn}) scale(${(e.at.way > 0 ? -1 : 1) * (1 + 0.4 * e.at.flat)} ${1 - 0.78 * e.at.flat})`,
          "data-act-bug": ""
        }, null, 8, Dp)) : q("", !0),
        i.value ? (b(), k("path", {
          key: 1,
          transform: `translate(${r.value.x} ${r.value.y}) scale(${1.3 - 0.3 * i.value})`,
          opacity: i.value,
          d: "M-9 0q2-6 6-3 1-6 5-2 5-3 5 2 5 1 2 4 3 4-3 3-4 4-7 1-3 0-6-1-6-4-4-3Z",
          fill: "#9bd34a",
          stroke: "#5f8f24",
          "stroke-width": "0.8"
        }, null, 8, Pp)) : q("", !0)
      ], 8, Cp))
    ], 4));
  }
}, jp = /* @__PURE__ */ Ge(qp, [["__scopeId", "data-v-6050b099"]]), pa = { waits: [3, 10], seconds: [3, 5], rests: [60, 150] }, fn = Object.freeze({ picture: null, until: 0, next: 0 }), ha = ([e, t], a) => e + (t - e) * a();
function Gp(e, t, a, r) {
  return e.picture ? a < e.until && t.includes(e.picture) ? e : { ...fn, next: a + ha(pa.rests, r) } : t.length ? e.next ? a < e.next ? e : { picture: t[0], until: a + ha(pa.seconds, r), next: 0 } : { ...fn, next: a + ha(pa.waits, r) } : e.next > a ? e : fn;
}
const bl = (e) => ({ ...Nt(e), mood: "admiring", behind: !0, faces: !0 }), ye = { turns: 3, within: 1500, least: 6, lingers: 500, reach: 40, prolonged: 2e3, ticklish: 3e3 }, Hp = (e, t, a) => t >= e.left - ye.reach && t <= e.right + ye.reach && a >= e.top - ye.reach && a <= e.bottom + ye.reach, xl = Object.freeze({ x: 0, way: 0, turns: [], at: -1 / 0, firstTurnAt: null, ticklishUntil: -1 / 0 });
function Up(e, t, a) {
  const r = Wp(e, t, a);
  return { ...r, ticklishUntil: Ql(e, a) || es(r, a) ? a + ye.ticklish : e.ticklishUntil };
}
function Wp(e, t, a) {
  if (e.at === -1 / 0) return { x: t, way: 0, turns: [], at: a, firstTurnAt: null };
  const r = a - e.at <= ye.lingers ? e.firstTurnAt : null;
  if (Math.abs(t - e.x) < ye.least) return { ...e, at: a, firstTurnAt: r };
  const s = Math.sign(t - e.x), i = e.way !== 0 && s !== e.way, c = [...e.turns.filter((u) => a - u <= ye.within), ...i ? [a] : []];
  return { x: t, way: s, turns: c, at: a, firstTurnAt: i ? r ?? a : r };
}
const Ql = (e, t) => t <= e.ticklishUntil, es = (e, t) => e.turns.filter((a) => t - a <= ye.within).length >= ye.turns && e.firstTurnAt !== null && t - e.firstTurnAt >= ye.prolonged, wl = (e, t) => t - e.at <= ye.lingers && (Ql(e, t) || es(e, t)), Ft = { most: 5, hold: [6, 22], ease: 1.8 }, Kp = Object.freeze({ from: 0, to: 0, began: 0, until: 0 });
function Yp(e, t, a) {
  if (t < e.until) return e;
  const s = a() < 0.25 ? 0 : (a() < 0.5 ? -1 : 1) * Ft.most * (0.4 + 0.6 * a()), i = Math.abs(s - e.to) < 1 ? -s || Ft.most * 0.6 : s, [c, u] = Ft.hold;
  return { from: ts(e, t), to: i, began: t, until: t + Ft.ease + c + a() * (u - c) };
}
function ts(e, t) {
  const a = Math.min(Math.max((t - e.began) / Ft.ease, 0), 1);
  return e.from + (e.to - e.from) * a * a * (3 - 2 * a);
}
const Vp = (e) => e.here && !e.leaving, Xp = 9.81, ns = 1.5, Zp = 0.3, as = ns * Zp, ma = Math.sqrt(Xp / as), Jp = 0.08, Qp = 0.025, eh = 0.8, th = 1 / 30, ga = Object.freeze({ angle: 0, speed: 0 });
function kl({ angle: e, speed: t }, a, r, s, i) {
  const c = Math.min(Math.max(a, 0), th), u = e + s / i * ns / as, p = Qp * Math.sin(ma * r / 2), m = -(ma ** 2) * (Math.sin(u) - p) - 2 * Jp * ma * t, f = t + m * c;
  return { angle: u + f * c, speed: f };
}
const nh = (e) => ({ angle: 0, speed: -e * eh }), Se = { watch: 15, along: 0.3, glance: [1, 2], between: [6, 14], act: [8, 14], jump: 0.15, near: 0.9 }, _l = ["ledge_sit", "pocket_watch", "doze"];
function $l(e, t) {
  return !e || e.ended ? null : t - e.began < Se.watch ? "watch" : "sit";
}
const ah = (e, t) => hn(Se.along, e, t);
function oh(e, t, a, r) {
  if (!t) return null;
  if (t === "watch") return { watches: !0, seated: !1, until: a };
  if (e != null && e.seated && a < e.until) return e;
  const s = !!(e != null && e.seated) && !e.watches, [i, c] = s ? Se.glance : Se.between;
  return { watches: s, seated: !0, until: a + i + r() * (c - i) };
}
function lh(e, t, a) {
  if (e && t < e.until) return e;
  const r = _l.filter((i) => i !== (e == null ? void 0 : e.clip));
  return { clip: e ? r[Math.floor(a() * r.length)] : _l[0], until: t + Se.act[0] + a() * (Se.act[1] - Se.act[0]) };
}
const sh = (e, t) => e !== null && (t - e >= Se.jump || e < Se.near && t >= Se.near), tt = { attachment: 10, said: 9, pointer: 8, run: 7, confession: 6, reading: 5, message: 4, typing: 3.5, work: 3, typing_pause: 1.75, picture: 2, bar: 2, glance: 1 }, os = { free: 1, gestures: 3, holds: 30, alone: 1 / 0 }, rh = 2, ih = 2, uh = (e) => {
  var t;
  return Number(((t = /\/files\/message\/(\d+)\//.exec(e)) == null ? void 0 : t[1]) ?? 0);
}, ch = 4, dh = 6, fh = 2;
function ph(e, t) {
  const a = t - e;
  return !e || a > dh ? null : a <= fh ? "typing" : "typing_pause";
}
const hh = /* @__PURE__ */ new Set(["attachment", "said", "run", "confession", "reading", "message", "typing", "typing_pause", "picture", "bar"]), mh = (e, t) => e.head === os.alone ? [] : t.map((a) => hh.has(a.kind) ? { ...a, point: { ...a.point, behind: !0 } } : a);
function gh(e, t, a) {
  return !e.amount || !e.point ? null : { ...e.point, ...Number.isFinite(e.point.readingCenter) ? { readingCenter: (e.point.readingCenter - t.x) / a } : {}, x: (e.point.x - t.x) / a, y: (e.point.y - t.y) / a, amount: e.amount, behind: !!e.point.behind, faces: !!e.point.faces, mood: e.point.mood ?? "" };
}
const yh = (e) => e.head >= os.holds, vh = (e, t) => e ? tt[e.kind] / (tt[e.kind] + t.head) : 0;
function bh(e, t, a) {
  const r = !!(e != null && e.look) && !t.some((f) => f.key === e.look.key) && a - e.seen < ih, s = r ? [...t, e.look] : t;
  if (!s.length) return { look: null, challenger: "", since: a, seen: a };
  const i = (e == null ? void 0 : e.look) && s.find((f) => f.key === e.look.key), c = (f) => r && f === i ? e.seen : a, u = Math.max(...s.map((f) => tt[f.kind])), p = i && tt[i.kind] === u ? i : s.find((f) => tt[f.kind] === u);
  if (!i || i === p || ls(p)) return { look: p, challenger: "", since: a, seen: c(p) };
  const m = e.challenger === p.key ? e.since : a;
  return a - m >= rh ? { look: p, challenger: "", since: a, seen: a } : { look: i, challenger: p.key, since: m, seen: c(i) };
}
const Rt = { glance: 1.2, rest: 2.5, halt: 1.5, purpose: 6 };
function xh(e, t, a, r, s) {
  const i = !!t && (t.point.x - r.x) * a >= 0;
  return e && s < e.since + Rt.glance + Rt.rest ? { look: i && s < e.since + Rt.glance ? t : null, glancing: e } : i ? { look: t, glancing: { since: s } } : { look: null, glancing: e };
}
const ls = (e) => (e == null ? void 0 : e.kind) === "said", wh = (e) => e() < tt.said / (tt.said + Rt.purpose), kh = { every: [6, 14], lasts: 1.6, aside: 0.9, up: 0.12, sides: [-1, 1] }, _h = { every: [4, 10], lasts: 2.4, aside: 0.2, up: 0.04, sides: [-1, 0, 1] };
function $h(e, t, a, r) {
  return e && t < e.at + e.kind.lasts ? e : { at: t + r.every[0] + a() * (r.every[1] - r.every[0]), side: r.sides[Math.floor(a() * r.sides.length)], kind: r };
}
function Mh(e, t, a, r) {
  return !e || t < e.at || t >= e.at + e.kind.lasts ? null : { x: a.x + e.side * e.kind.aside * r, y: a.y - e.kind.up * r };
}
const Sh = [[/\b\w*test\w*\b/i, "testing"], [/\bbuild\b/i, "building"], [/\b(grep|rg|find)\b|journal search/i, "searching"]], Ah = (e) => {
  var t;
  return ((t = Sh.find(([a]) => a.test(e))) == null ? void 0 : t[1]) ?? "running";
};
function Oh(e, t, a, { thinking: r = !1, waitingFor: s = "", waitingSince: i = 0, compacting: c = !1 } = {}) {
  if (c) return "compacting";
  const [u, ...p] = e.trim().split(/\s+/);
  if (u) return u === "Bash" ? Ah(p.join(" ")) : Mi[u] ?? "running";
  if (r) return "thinking";
  const m = t && a - t >= Si;
  return i ? "asking" : s ? m ? "asleep" : "waiting" : m ? "asleep" : "idle";
}
const Ml = { user: "user", comment: "user", agent: "agent" }, Eh = (e) => e.filter((t) => Ml[t.type] && !t.local).map((t) => ({ ...t, table: "message", author: Ml[t.type] })), Nh = ["data-walking", "data-hopping", "data-trip", "data-clip", "data-beats"], Fh = ["data-voice", "data-failure"], S = 112, ya = 1e3, Sl = 30, Al = 3, Ol = 3, Bh = 0.1, Th = 25, Lh = 1500, zh = 45, El = 0.3, Nl = "figure-demo", Rh = 60, Ih = {
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
    var Fo;
    const a = { next: 0 };
    function r() {
      const n = performance.now();
      a.next || (a.next = n + yl(Math.random));
      const l = Vd(n - a.next);
      return n >= a.next + ge.close + ge.open && (a.next = n + yl(Math.random)), l;
    }
    const s = e, i = t, c = ((Fo = Yr(Ai, null)) == null ? void 0 : Fo.environment) ?? "", u = P(null), p = $(() => s.voice), m = P(""), f = /* @__PURE__ */ new Map(), h = $(() => Oi(Ei(s.marks), f, Date.now() / 1e3)), w = $(() => Eh(s.messages)), E = $(() => ({ question: s.asking ? 1 : 0, waiting: 0, suggestion: 0 }));
    let x = null, F = [], L = 0, G = 0, se = fn;
    const M = P(Date.now() / 1e3), Fe = P(0), Q = P(0), { body: o, start: ht, stop: He } = Kc(() => Fs()), I = P([]);
    let yn = null;
    const Ae = { reacted: new vl(`journal.figure.cooldowns.${c}`, Date.now() / 1e3), tally: { plain: 0, last: "" } }, ss = new vl(`journal.figure.pastimes.${c}`, Date.now() / 1e3), Fa = /* @__PURE__ */ new Map(), Ba = /* @__PURE__ */ new Map();
    let Be = null;
    const jt = P(null), vn = P(null), Ta = P(null), Gt = P(null), La = /* @__PURE__ */ new Set();
    let Ht = Date.now() / 1e3;
    const bn = Ht;
    let _ = { name: "", started: 0, shown: null, index: 0, closing: null }, Te = !1;
    const mt = P(null), za = P(0);
    let re = "stand";
    const Ra = P(!1), rs = $(() => {
      var n;
      return !!((n = o.trip) != null && n.moves && o.trip.hopping);
    }), is = $(() => o.trip ? o.trip.started ? "walking" : "waiting to set off" : o.arriving ? "arriving" : ""), Oe = $(() => ({ data: { cards: h.value, person_at: Math.max(0, ...w.value.filter((n) => n.author === "user").map(St)) } })), Ia = P(null), xn = $(() => {
      var n;
      return { state: ((n = Ia.value) == null ? void 0 : n.state) ?? Oh(s.running, s.heardAt, M.value, { thinking: s.thinking, waitingFor: s.waitingFor, waitingSince: Fe.value, compacting: Ni(h.value, M.value) }), since: s.heardAt || M.value };
    }), wn = P(null), ie = $(() => Fi(xn.value, wn.value, M.value));
    let V = { where: "rest", until: 0 }, kn = { until: 0 }, Ca = [], _n = !1, Da = 0, Pa = 0, qa = 0;
    const Y = P([]);
    let us = 0, Ut = 0, $n = { frames: 1, lands: 0 }, Wt = { started: 0, landed: 0 };
    const Mn = P([]), Kt = P(0), Sn = P(null), An = P(0), Le = P({ x: 0.5, y: 0.3 }), ja = P({ x: 0.75, y: 0.6, out: 1, other: { x: 0.25, y: 0.6 } });
    let K = null;
    const Yt = P(null);
    let z = null, ke = { state: "", clip: "" }, Vt = null, On = null, Ga = null;
    const gt = (n) => F.find((l) => l.name === n) || F.find((l) => l.name === "idle"), Ha = (n) => F.some((l) => l.name === n), Ua = (n, l) => gt(n).postures.includes(l), En = (n) => Ha(n) && Ua(n, o.place.posture), D = () => ({ size: S, below: Q.value });
    function cs() {
      const n = Y.value.find((d) => d.state === "built");
      if (n) return Wa(n) ? "push" : "idle";
      const l = Y.value.find((d) => d.state === "building");
      return l ? ac(l, performance.now()) ? "inspect" : "work" : De ? o.place.stays ? "work" : "idle" : dl(ie.value.state) ? "idle" : Ka();
    }
    const Wa = (n) => cc(_e(n), We()) && (!o.trip || o.trip.way === Math.sign(_e(n) - We()));
    function ds() {
      const n = Y.value.find((l) => l.state === "built");
      return !n || !Wa(n) ? 0 : _e(n) > We() ? 90 : 270;
    }
    const Nn = () => Tt(ie.value.state) === "sleep";
    function Ka() {
      var l;
      const { state: n } = ie.value;
      return ke.state !== n && (ke = { state: n, clip: uc(Tt(n), Math.random, En, { memory: Ae.reacted, now: M.value, home: ((l = o.footing) == null ? void 0 : l.id) === "home", bubble: !!nn() }) }, ke.clip === "rummage" && (V = { where: "rummage", until: M.value + Th, way: x.reachWay(xd(o.place.x, me())) })), o.place.swings ? "rope_swing" : o.place.lean && ["idle", "waiting"].includes(Tt(n)) ? "lean" : Ws() ? (On = lh(On, M.value, Math.random)).clip : ke.clip === "rummage" && (V.where !== "rummage" || o.trip) || ke.clip === "search" && !o.trip && !En("search") || ke.clip === "glass_bubble" && (o.trip || !nn()) ? "idle" : o.place.leans ? fs[ke.clip] ?? ke.clip : ke.clip;
    }
    const fs = { idle: "ledge_sit" }, ps = (n) => n.clip === "bug_shot" ? tc(0, n.bugs.length).stretch : null;
    function Ya() {
      var N, C, H, ce, xe, $e, Me;
      if (O) return { clip: gt(O.phase === "scoot" ? "newest_scoot" : "idle"), facing: O.face };
      (!((N = o.trip) != null && N.moves) || o.trip.hopping) && (I.value = I.value.filter((qe) => qe.clip !== "stumble"));
      const n = el(I.value, xt()), l = (qe) => zd(gt(qe), o.place.posture, Ue, M.value), d = ((H = (C = n == null ? void 0 : n.bugs) == null ? void 0 : C[0]) == null ? void 0 : H.wall) === "left" ? 270 : ((xe = (ce = n == null ? void 0 : n.bugs) == null ? void 0 : ce[0]) == null ? void 0 : xe.wall) === "right" ? 90 : 180, g = n && l(n.clip) && { clip: n.clip, facing: n.clip === "bug_shot" ? d : Eu(n.card, o.at.x + S / 2), onto: n.onto || n.approaching, holds: n.holds, stretch: ps(n) }, v = {
        mode: Nu(o),
        leaving: o.leaving,
        arriving: o.arriving,
        trip: o.trip,
        landing: o.landing,
        place: o.airborne ? { ...o.place, posture: o.airborne.posture, face: o.airborne.face ?? 0 } : o.place,
        beat: g,
        state: ie.value.state,
        doing: cs(),
        doingFacing: ds(),
        flying: Yt.value,
        eager: !!(z != null && z.on),
        chute: !!(($e = o.airborne) != null && $e.chute),
        grabbed: pl(o.airborne),
        composeFacing: hs(),
        readingFacing: Mr()
      }, y = Fu(v, Ua), B = o.airborne || o.landing || o.arriving || o.leaving || (Me = o.trip) != null && Me.started || Yt.value || z != null && z.on || l(y.clip) ? y : { clip: o.place.leans ? "ledge_sit" : "idle", facing: o.place.face ?? 0 };
      return { ...B, clip: gt(B.clip) };
    }
    function hs() {
      var l;
      const n = (l = ra()) == null ? void 0 : l.getBoundingClientRect();
      return n ? n.left + n.width / 2 >= o.at.x + S / 2 ? Sl : -Sl : 0;
    }
    const Fn = (n) => `${n.clip.name}/${n.facing}`, ms = (n) => n.clip.fps * (n.pace ?? 1), Bn = (n) => (performance.now() - _.started) / 1e3 * ms(n), Tn = (n) => Cu(Bn(n), n.stretch), ze = (n) => Math.floor(Tn(n)), Ln = () => !_.shown || (_.closing !== null ? ze(_.shown) >= _.closing + _.shown.clip.outro : Tu(_.shown.clip, ze(_.shown), _.index)), zn = (n, l = null) => Bu(n, (performance.now() - _.started) / 1e3, l);
    function gs(n = !1) {
      return $c(Math.abs(o.at.x - o.walk.from.x), D().size, n);
    }
    let Rn = Kp;
    function ee() {
      var sn, it, he, Mt, ut, ct, we, Bo, To, Lo, zo, Ro;
      if (cancelAnimationFrame(L), !x || document.hidden || (Cs(), Ys())) return;
      if (_.shown && hc(_.shown, ze(_.shown))) return $s(_.shown);
      const n = Ya();
      if (n.clip.name === "bug_shot" && vs()) return;
      (sn = _.shown) != null && sn.clip.outro && n.clip.name !== _.shown.clip.name && _.closing === null && (_.closing = mc(_.shown.clip, ze(_.shown))), _.closing !== null && n.clip.name === _.shown.clip.name && ze(_.shown) < _.closing && (_.closing = null);
      const l = !!(n.startsLeg && ((it = o.trip) != null && it.pressing) && _.shown && !_.shown.clip.interruptible && _.name !== Fn(n)) && zn(_.shown, o.trip);
      l && _.shown.once && !_.shown.arrival && !_.shown.departure && !_.shown.landed && (I.value = I.value.slice(1));
      const d = Te || pl(o.airborne) && ((he = _.shown) == null ? void 0 : he.clip.name) !== n.clip.name || Ln() || l || n.clip.cuts && ((Mt = _.shown) == null ? void 0 : Mt.clip.name) !== n.clip.name && zn(_.shown);
      Te = !1;
      const g = su(n, _.shown, d), v = (Fn(n) === _.name || g) && _.closing === null, y = g ? { ...n, facing: _.shown.facing } : v || d ? n : _.shown, B = Fn(y);
      if (_.name !== B || _.closing !== null && d) {
        const Ur = y.clip.intro && ((ut = _.shown) == null ? void 0 : ut.clip.name) === y.clip.name && _.closing === null;
        _ = { name: B, started: Ur ? _.started : performance.now(), shown: y, index: 0, closing: null };
      } else _.shown = ru(_.shown, y);
      mt.value = y.clip;
      const N = ze(y);
      _.index = N;
      const C = Ko(y, ((ct = o.airborne) == null ? void 0 : ct.posture) ?? (o.trip ? Yo[o.place.posture].travels : o.place.posture), (we = o.trip) == null ? void 0 : we.moves);
      Ss({ posture: C, facing: O ? O.face : sa.has(C) ? Vo(y.clip, o.place.face) : y.facing }), ys(y), bs(y), y === n && n.startsLeg && !o.trip.moves && Ja(), re = J.posture, !((Bo = o.trip) != null && Bo.departed) && !o.airborne && !K && Xt();
      const H = iu(yn, y.facing, performance.now() / 1e3);
      Be = uu(Be, Sr(y), performance.now() / 1e3);
      const ce = y.clip.name === "disco" ? cu(ze(y) / y.clip.frames, X.disco.beats) : du(Be, performance.now() / 1e3, Nn());
      jt.value = ce && { colour: ce.colour, strength: fu.halo * ce.glow * ce.open }, yn = H.looking;
      const xe = y.clip.name === "run", $e = re === "walk" || y.clip.name === "walk" || xe ? gs(xe) : null;
      Ra.value = $e !== null, Kt.value = (O == null ? void 0 : O.phase) === "scoot" ? Math.min((performance.now() - O.began) / (At.seconds * 1e3), 1) * (At.frames - 1) : pu(y.clip, Tn(y), _.closing), Sn.value = J.turning ? gt("idle") : y.clip, An.value = J.turning ? 0 : Kt.value;
      const Me = performance.now() / 1e3;
      Rn = Yp(Rn, Me, Math.random);
      const qe = Ms(y, Me);
      x.show(Sn.value, An.value, qe, {
        posture: re,
        eyes: (O == null ? void 0 : O.phase) === "notice" ? null : H.eyes,
        stride: (O == null ? void 0 : O.phase) === "scoot" ? Math.abs(O.to - O.from) / S : y.clip.name === "bug_smash" && le.value ? le.value.at.steps : (To = ve.value) != null && To.at.way ? -ve.value.at.steps : $e,
        walkWay: (O == null ? void 0 : O.phase) === "scoot" ? Math.sign(O.to - O.from) : y.clip.name === "bug_smash" && le.value ? le.value.at.way : ((Lo = ve.value) == null ? void 0 : Lo.at.way) ?? 0,
        throws: y.clip.name === "rummage" ? y.throws ?? (y.throws = hu(Math.random)) : null,
        leanWay: y.clip.name === "rummage" && V.where === "rummage" ? V.way : y.clip.name === "lean" ? ((zo = o.place.lean) == null ? void 0 : zo.way) ?? 0 : re === "composed" ? o.place.leans : 0,
        at: (O == null ? void 0 : O.phase) === "scoot" ? null : Vs() ?? Or(y),
        target: Rr(y),
        open: r(),
        screen: (O == null ? void 0 : O.phase) === "notice" ? null : ce,
        tilt: y.clip.name === "idle" ? Math.round(ts(Rn, Me) * 4) / 4 : 0,
        grabbed: !!((Ro = o.airborne) != null && Ro.held),
        airborne: !!(o.airborne || K)
      }), za.value = x.facing ?? y.facing, Le.value = x.headAt(), ja.value = x.handAt(), fr(y), qs(y), Ps(), L = requestAnimationFrame(ee);
    }
    const le = P(null);
    function ys(n) {
      var $e;
      const l = n.clip.name === "bug_smash";
      if (!l && (($e = I.value[0]) == null ? void 0 : $e.clip) !== "bug_smash") return le.value = null;
      const d = Z().floors;
      if (!le.value) return l && o.footing ? ws(d) : null;
      const { id: g, plan: v, bug: y, seconds: B } = le.value, N = l ? nl(v, ze(n) / n.clip.frames, S) : le.value.at, C = Ye(d, g), H = C ? C.left + N.bug.dx : y.x, ce = C && H >= C.left && H <= C.right ? { x: H, y: C.top } : null, xe = performance.now() / 1e3;
      le.value = { ...le.value, at: N, bug: zu(y, ce, _s(y.x, y.y), xe - B), seconds: xe }, l && C && !o.airborne && ks(C, N.figure);
    }
    const ve = P(null);
    function vs() {
      var g, v;
      const n = el(I.value, xt());
      if ((n == null ? void 0 : n.clip) !== "bug_shot" || n.approaching || !((g = n.bugs) != null && g.length) || o.trip || o.airborne || o.arriving || o.landing || !o.footing || (v = _.shown) != null && v.once || !Ln() && !zn(_.shown)) return !1;
      const l = Ye(Z().floors, o.footing.id);
      if (!l) return !1;
      const [d] = tl(n.bugs, me(), { x: o.place.x, y: o.at.y + Le.value.y * S, left: l.left, right: l.right }, S);
      return n.approaching = !0, Math.abs(d.to - o.place.x) < 5 ? !1 : (Jt({ ...o.place, x: d.to, posture: "stand" }, { straight: !0 }), !0);
    }
    function bs(n) {
      var B, N, C, H;
      const l = n.clip.name === "bug_shot" ? (B = I.value[0]) == null ? void 0 : B.bugs : null;
      if (!(l != null && l.length) || !o.footing) return ve.value = null;
      const d = Ye(Z().floors, ((N = ve.value) == null ? void 0 : N.id) ?? o.footing.id);
      if (!d) return ve.value = null;
      const g = Bn(n), v = ((C = ve.value) == null ? void 0 : C.plan) ?? tl(l, me(), { x: o.place.x, y: o.at.y + Le.value.y * S, left: d.left, right: d.right }, S), y = Ru(v, g, S);
      ve.value = { id: d.id, plan: v, left: ((H = ve.value) == null ? void 0 : H.left) ?? d.left, at: y }, o.airborne || xs(d.left + y.x - ve.value.left);
    }
    function xs(n) {
      if (Math.abs(n - o.place.x) < 0.3) return;
      const l = { ...o.place, x: n };
      o.footing = Ot(l) ?? o.footing, o.place = l;
    }
    function ws(n) {
      const l = Ye(n, o.footing.id);
      if (!l) return;
      const d = oc(o.place.x, l, S), g = nl(d, 0, S);
      le.value = { id: o.footing.id, plan: d, at: g, bug: { x: l.left + g.bug.dx, y: l.top, speed: 0, falling: !1 }, seconds: performance.now() / 1e3 };
    }
    function ks(n, l) {
      const d = { ...o.place, x: n.left + l };
      Math.abs(d.x - o.place.x) < 0.3 || (o.footing = Ot(d) ?? o.footing, o.place = d);
    }
    const _s = (n, l) => Math.min(window.innerHeight + S, ...ql(Z().floors).filter((d) => d.left <= n && n <= d.right && d.top >= l).map((d) => d.top)), Va = $(() => {
      if (!le.value) return null;
      const { at: n, bug: l, plan: d } = le.value, g = l.falling ? 0 : n.bug.below, v = l.falling ? { whole: !0, flat: 0 } : {};
      return { ...n.bug, ...v, x: l.x, y: l.y + g, below: g, edge: g > 0 ? l.y : null, way: Math.sign(d.bug[1] - d.bug[0]) || -1, step: Math.floor(le.value.seconds * 6) % 2 };
    });
    function $s(n) {
      if (n.clip.name === "tickle_swat" && wl($t, performance.now()))
        return _.started = performance.now(), ee();
      if (n.departure) {
        if (o.leaving = !1, s.here)
          return _ = { name: "", started: 0, shown: null, index: 0, closing: null }, ee();
        o.here = !1, i("gone");
        return;
      }
      return n.arrival ? o.arriving = !1 : n.landed ? o.landing = !1 : I.value = gc(I.value, n.clip.name), _ = { name: "", started: 0, shown: null, index: 0, closing: null }, n.landed && ao(), ee();
    }
    let Re = null;
    function Ms(n, l) {
      return O ? O.facing : (Re = J.posture === "sit" && !J.turning && !n.clip.aside ? Du(Re, J.facing, l, Math.random) : null, Re ? al(Re, l) : J.facing);
    }
    let J = { posture: "stand", facing: 0, turning: !1 };
    function Ss(n) {
      if (J.turning && x.blending()) return;
      const l = Lu(J, n), d = (g) => g.posture === n.posture && g.facing === n.facing;
      J = { ...l, turning: !d(l) || J.turning && !d(J) };
    }
    const Ee = (n, l) => {
      const d = It(n, D(), l);
      return { x: d.left, y: d.top };
    }, Xt = () => {
      if (o.place.posture === "hang" && re !== "hang") return;
      const n = Ee(o.place, re);
      re !== o.rested && Au(o.rested, re) ? Zt() : re !== o.rested && Xa(), o.rested = re, o.slide ? o.slide = { ...o.slide, to: n } : o.at = n;
    };
    function Xa() {
      o.slide = { from: { ...o.at }, to: { ...o.at }, began: performance.now() };
    }
    const In = [];
    function Zt() {
      o.slide = null, In.splice(0).forEach((n) => n());
    }
    function As() {
      const { at: n, done: l } = Wc(o.slide, performance.now(), wc * 1e3);
      o.at = n, l && Zt();
    }
    async function Jt(n, { straight: l = !1, pace: d = 1, pressing: g = !1, urgent: v = !1 } = {}) {
      if (T || o.airborne || K || !Bt(n, D()) || O) return;
      if (!Qo(o.place, n, D(), { straight: l, pace: d, pressing: g })) return Ns(n);
      o.trip = { to: n, straight: l, pace: d, pressing: g, urgent: v, footing: Ot(n), legs: [] };
      const y = o.trip;
      ee(), o.slide && await new Promise((B) => In.push(B)), o.trip === y && Os();
    }
    function Os() {
      if (!o.trip || T || o.airborne || K) return;
      const { to: n, straight: l, pace: d, pressing: g, footing: v } = o.trip, y = Qu(ua(n, v, D()), Z().floors, D()), B = Un(), N = l ? { via: [], pogo: !1 } : gd(oe(), D(), o.place, y, { memory: Ae.reacted, now: M.value, room: B }, Math.random);
      if (!N)
        return o.trip = null, ee();
      const C = Qo(o.place, y, D(), { straight: l, pace: d, pressing: g, ...N, memory: Ae.reacted, now: M.value, room: B });
      if (o.way = Math.sign(y.x - o.place.x), Pn(), C)
        return o.trip = { ...o.trip, ...C, climbs: Fd(C.legs) }, Za();
      o.footing = null, o.trip = null, nt(y, v), ee();
    }
    function Za() {
      var g;
      const n = o.trip.legs, l = n.find((v) => v.ms > 0);
      if (!l) {
        const { to: v, footing: y, climbs: B } = o.trip, N = ua(v, y, D());
        return o.trip = null, Ue = Bd(!!B, (g = Z().floors.find((C) => C.id === (y == null ? void 0 : y.id))) == null ? void 0 : g.kind, performance.now() / 1e3), Math.hypot(N.x - v.x, N.y - v.y) >= 1 && Xa(), nt(N, y), Wo(Y.value) && setTimeout(be), ee();
      }
      const d = n.slice(n.indexOf(l));
      o.trip = { ...o.trip, started: !0, moves: !1, hopping: !!l.hopping, clip: l.clip, facing: l.facing, legs: d }, ee();
    }
    function Ja() {
      var v;
      if (!o.trip || T || o.airborne || K) return;
      const [n, ...l] = o.trip.legs, d = n.hopping || o.trip.departed ? { ...o.at } : Ee(o.place, Yo[o.place.posture].travels);
      if (Math.hypot(d.x - o.at.x, d.y - o.at.y) > 1) {
        if (o.trip.rising) return;
        o.trip = { ...o.trip, rising: !0 };
        const y = o.trip;
        return o.slide = { from: { ...o.at }, to: d, began: performance.now() }, void In.push(() => o.trip === y && Ja());
      }
      if (J.turning) return;
      o.trip = { ...o.trip, moves: !0, departed: !0, legs: l }, o.footing = null;
      const g = Ie(d);
      o.walk = {
        from: d,
        began: performance.now(),
        on: n.hopping ? null : ((v = Ac(Z().floors, g.x, g.y, Sc)) == null ? void 0 : v.id) ?? null
      }, o.leg = n;
    }
    function Es() {
      o.trip.hopping && (o.landing = !!o.trip.lands), Za();
    }
    function Ns(n) {
      const l = Ot(n);
      l && o.footing && l.id === o.footing.id || nt(n, l);
    }
    function nt(n, l = Ot(n)) {
      o.place = n, o.footing = l, so = Zo(n, D());
    }
    function Fs() {
      var d, g, v, y, B, N;
      if (T && ((d = o.airborne) != null && d.held)) return Vn();
      if (K) return zs();
      if (o.slide && !((g = o.trip) != null && g.moves) && !o.airborne && As(), (v = o.airborne) != null && v.held) return Vn();
      if ((y = o.airborne) != null && y.thrown) return ar();
      if (o.airborne) return Rs();
      if ((B = o.trip) != null && B.moves) {
        o.trip.hopping ? Is() : Bs(), (N = o.trip) != null && N.moves && Tc(o.leg, o.walk.began, performance.now()) && Es();
        return;
      }
      if (o.footing || (o.footing = yc(o.place)), !o.footing && vc(o.place)) return lo();
      if (!o.footing) return;
      js();
      const n = bc(o.footing, o.place, D());
      if (!n) return lo();
      if (n.motion === "flung") return Gs(n.speed);
      if (o.footing = n.footing, n.motion === "dropping" && performance.now() - eo >= Lh) return yt(o.place, null);
      const l = n.spot;
      Math.hypot(l.x - o.place.x, l.y - o.place.y) <= 0.3 || (n.motion === "launched" && !o.arriving && Cn("launched"), o.trip && (o.trip = { ...o.trip, legs: da(o.trip.legs, l.x - o.place.x, l.y - o.place.y) }), o.place = l, Xt());
    }
    const Qa = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, Ie = (n) => ({ x: n.x + S / 2, y: n.y + (1 - Q.value) * S });
    function Bs() {
      const n = Ie(ca(o.leg, o.walk.from, performance.now() - o.walk.began)), l = Bc(Z().floors, o.walk.on, n.x, n.y);
      if (l.falls) return yt({ ...n, posture: "stand" }, o.trip.to);
      (Math.abs(l.dx) > 0.3 || Math.abs(l.dy) > 0.3) && Ts(l.dx, l.dy), o.at = ca(o.leg, o.walk.from, performance.now() - o.walk.began);
    }
    function Ts(n, l) {
      const [d, g] = da([o.walk.from, o.leg], n, l);
      o.walk = { ...o.walk, from: d }, o.leg = g, o.trip = { ...o.trip, legs: da(o.trip.legs, n, l) };
    }
    function Ls() {
      const n = { x: o.place.x, y: o.place.y }, l = me().top, d = Ea(oe(), D(), n, l);
      d && (K = { began: performance.now(), hops: jd(n, d, l), back: 0 }, o.footing = null);
    }
    function zs() {
      const n = performance.now(), l = Gd(K.hops, n - K.began, S);
      if (Yt.value = l.gone ? null : l, !l.gone) return void (o.at = Ee({ ...l, posture: "stand" }, "stand"));
      if (K.back || (K.back = n + Hd(Math.random)), n < K.back) return;
      const d = me(), g = d.left + S / 2 + Math.random() * Math.max(d.right - d.left - S, 0);
      K = null, o.airborne = qc(g, d.top - S / 4, et.chute * S, n), o.at = Ee(o.airborne, "stand"), ee();
    }
    let eo = -1 / 0;
    function yt(n, l) {
      to(Pc(n, l, Z().floors, performance.now()));
    }
    function to(n) {
      fe.value = null, o.airborne = n, o.trip = null, Zt(), o.footing = null, o.at = Ee(o.airborne, o.airborne.posture), ee();
    }
    function Rs() {
      const { airborne: n, landed: l } = Hc(o.airborne, Z().floors, performance.now(), Qa());
      if (n && Gc(n, me().top)) return Gn();
      o.at = Ee(n ?? l.spot, (n ?? l.spot).posture), o.airborne = n, l && (no(l.spot, l.standing), l.to && Jt(l.to));
    }
    function no(n, l) {
      eo = performance.now(), o.landing = l, Cn("dropping"), nt(n), Xt(), l || ao(), ee();
    }
    function ao() {
      s.here || (o.leaving = !0, o.arriving = !1);
    }
    function Is() {
      const n = o.trip;
      if (n.footing && !xc(n.footing, D())) return yt({ ...Ie(o.at), posture: "stand" }, null);
      const l = n.footing ? ua(n.to, n.footing, D()) : n.to, d = Dc(n, o.leg, o.walk.from, l, Ul(D()));
      if (d.lost) return yt({ ...Ie(o.at), posture: "stand" }, null);
      d.trip !== n && (o.trip = d.trip, o.leg = d.leg, o.walk = { ...o.walk, from: d.from }), o.at = ca(o.leg, o.walk.from, performance.now() - o.walk.began, Qa());
    }
    const vt = P(""), Qt = $(() => Bi(p.value)), Cn = (n) => vt.value = n, fe = P(null);
    function Cs() {
      if (!fe.value) return;
      const n = Math.min(Math.max((performance.now() - fe.value.began) / (Qt.value.ms / 2), 0), 1), l = n * n * (3 - 2 * n);
      fe.value = n === 1 ? null : { ...fe.value, angle: fe.value.from * (1 - l), scale: fe.value.scaleFrom.map((d) => d + (1 - d) * l) };
    }
    function Ds(n) {
      n.target === n.currentTarget && (vt.value === "launched" && Ke({ beat: "launched", time: M.value }), vt.value = "", fe.value = null);
    }
    const Dn = P(0), bt = P(null), at = P(null);
    function Ps() {
      const n = _d(o.place, o.trip);
      n !== at.value && (at.value = n);
    }
    function qs(n) {
      var l;
      n.clip.name === "disco" && (bt.value = il(o.place, D(), Z()), !bt.value && ((l = I.value[0]) == null ? void 0 : l.clip) === "disco" && (I.value = I.value.slice(1)));
    }
    let en = ga, oo = 0, tn = null;
    function js() {
      if (o.place.posture !== "hang" || o.trip) return Pn();
      const n = performance.now() / 1e3;
      en = tn === null ? nh(o.way) : kl(en, n - oo, n, o.place.x - tn, S), oo = n, tn = o.place.x, Dn.value = en.angle;
    }
    function Pn() {
      en = ga, tn = null, Dn.value = 0;
    }
    const qn = $(() => {
      var l;
      const n = ((l = mt.value) == null ? void 0 : l.name) ?? "";
      return /^hang_[lr]$/.test(n) ? Ti(n.slice(-1), za.value, Q.value) : null;
    });
    function jn() {
      O = null, V = Id(V), _ = { name: "", started: 0, shown: null, index: 0, closing: null }, I.value = [], o.landing = !1;
    }
    function Gs(n) {
      jn(), Cn("launched"), to(jc({ ...Ie(o.at), face: o.place.face }, n, performance.now()));
    }
    function Gn() {
      o.airborne = null, K = { began: performance.now(), hops: [], back: 0 };
    }
    function lo() {
      jn();
      const n = Ct(V, D(), o.place), l = { state: ie.value.state, now: Date.now() / 1e3, near: o.place, figure: D(), cleared: kn };
      yt({ ...Ie(o.at), posture: "stand" }, Zl(n, l));
    }
    const Hs = () => ({
      voice: p.value,
      moving: !!(o.trip || K || O),
      place: o.place,
      beats: I.value.length,
      held: !!xt(),
      room: Un(),
      arriving: o.arriving,
      leaving: o.leaving
    });
    function Hn() {
      const n = te();
      return n.docked ? rn(n.element) : null;
    }
    const Us = (n, l) => n === "sit" && !uo() && !l && o.place.on === te().element ? ah(D(), o.place) : null, Ws = () => $l(Hn(), M.value) === "sit" && !o.trip && o.place.posture === "sit" && o.place.on === te().element, xt = () => gu({ box: Y.value.some((n) => n.state !== "piled") });
    function Un() {
      const n = te();
      return $u(ie.value.state, n.docked ? rn(n.element) : null, M.value);
    }
    function be() {
      if (clearTimeout(G), T || o.airborne || K) return void (G = setTimeout(be, ya));
      M.value = Date.now() / 1e3, Fe.value = Di(E.value, Fe.value, M.value), wn.value = Pi(xn.value.state, wn.value, M.value, Math.random, Ae.tally), se = Gp(se, Nn() || z != null && z.on ? [] : qi(_t()), M.value, Math.random);
      const n = ji(I.value, xn.value.state, on());
      I.value = Gi(n.beats, on(), M.value), Te || (Te = n.cut);
      const l = $l(Hn(), M.value);
      Vt = oh(Vt, l, M.value, Math.random);
      const d = Hn();
      l === "sit" && sh(Ga, d.share) && Ke({ beat: "progress_jump", time: M.value }), Ga = l ? d.share : null;
      const g = Math.max(Ht, M.value - Hi), v = [
        ...Ui(Oe.value, g),
        ...Ho(Oe.value, La, Math.max(bn, g)),
        ...jo(Oe.value, Fa, bn),
        ...Wi(s.faces, g),
        ...Ki(w.value, g),
        ...Yi(w.value, g)
      ], y = Go(Oe.value, Ba);
      y.length && (Y.value = Y.value.map((we) => ({ ...we, lit: Vi(we, y) }))), v.length && (Ht = Math.max(Ht, ...v.map((we) => we.time))), hr(v) && ho();
      const B = Xi(o.trip, qa, M.value);
      qa = B.began, B.moment && !I.value.some((we) => we.clip === "stumble") && Ke(B.moment);
      const N = te(), C = xt(), H = C ? { eager: z, moment: null } : Zi(N.docked ? rn(N.element) : null, z, Math.random, M.value);
      z = H.eager, Te || (Te = !!H.cut), Ke(), H.moment && Ke(H.moment);
      const ce = sa.has(o.place.posture) && !o.trip;
      Ue = Ld(Ue, ce, Wn, M.value, Math.random), Wn = ce;
      const xe = Ji(ie.value.state, _n, Pa, M.value);
      _n = !1, Pa = xe.began, Ke(...v, ...Qi(xe.moments, Y.value)), Be = eu(Nn() || I.value.some((we) => ["bug_shot", "bug_smash"].includes(we.clip)) ? [] : y, Be, performance.now() / 1e3);
      const $e = { state: ie.value.state, since: ie.value.since, lasted: M.value - ie.value.since }, Me = Wo(Y.value), qe = Ks() || !!O, sn = qe || !!C || Me || !!(z != null && z.on), it = o.trip ? null : il(o.place, D(), Z()), he = sn ? null : tu({ ...Hs(), ball: it ? it.kind : "" }, $e, ss, M.value, Math.random, En, Ae.tally);
      if ((he == null ? void 0 : he.clip) === "disco" && (bt.value = it), he != null && he.flies && Ls(), he && !he.flies && (I.value = [...I.value, he]), qe) {
        document.hidden || (G = setTimeout(be, ya));
        return;
      }
      Xs() && !o.airborne && !o.place.stays && !nu(I.value, on()) && au(o.place) && Zs(), rr(), ir();
      const Mt = $d({
        state: ie.value.state,
        counts: E.value,
        stay: V,
        now: M.value,
        near: o.place,
        figure: D(),
        hands: Ca,
        cleared: kn,
        work: uo(),
        pile: sr(),
        tally: Ae.tally,
        memory: Ae.reacted,
        room: Un()
      });
      V = Mt.stay;
      const ut = Qn("user");
      ls(ut) && ut.card !== mo && !pe && go() && xr(ut), wr();
      const ct = pe ? null : z != null && z.on ? Sd(o.place, D()) : Us(l, Me) ?? Mt.spot;
      z != null && z.urgent && ct && o.trip && !o.trip.urgent && !o.trip.moves && (o.trip = null), !o.trip && !o.arriving && !o.airborne && !K && ct && Td(Ue, performance.now() / 1e3, !!(z != null && z.urgent)) && (z != null && z.urgent && (I.value = I.value.slice(0, 1)), Jt(ct, { pace: Ce || z != null && z.on ? ou : 1, pressing: Ce || Me || !!(z != null && z.urgent), urgent: !!(z != null && z.urgent) }), Ce = !1), document.hidden || (G = setTimeout(be, ya));
    }
    let O = null;
    function Ks() {
      var v;
      if (O || !x || T || o.trip || o.airborne || o.arriving || o.leaving || K || !o.footing || o.place.posture === "hang" || (v = _.shown) != null && v.once && !Ln()) return !1;
      const n = yu(), l = Ye(Z().floors, o.footing.id);
      if (!l || !n || Bt(o.place, D(), n)) return !1;
      const d = Xo(D(), o.place, l, n);
      if (!d) return !1;
      const g = performance.now() / 1e3;
      return O = { phase: "notice", began: performance.now(), button: n, spot: d, canonicalFace: o.place.face, footingFace: o.footing.face, face: J.facing, facing: Re ? al(Re, g) : J.facing }, x.easeFromCurrent(), Te = !0, !0;
    }
    function Ys() {
      if (!O) return !1;
      if (T || o.airborne || o.trip || o.leaving || K)
        return O = null, !1;
      const n = o.footing && Ye(Z().floors, o.footing.id);
      if (!n)
        return O = null, !1;
      const l = (performance.now() - O.began) / 1e3;
      if (O.phase === "notice") {
        if (l < At.notice) return !1;
        const H = Xo(D(), o.place, n);
        return H ? (V = { where: "aside", spot: H, until: M.value + dn }, Ce = !1, sa.has(o.place.posture) ? (O = { ...O, phase: "scoot", began: performance.now(), from: o.place.x - n.left, to: H.x - n.left }, Te = !0, !1) : (O = null, Jt(H, { pace: 1, pressing: !0 }), !0)) : (O = null, !1);
      }
      const d = Math.min(l / At.seconds, 1), g = ec(d), v = n.left + O.from + (O.to - O.from) * g.across;
      if (o.place = { ...o.place, x: v, y: n.top + o.footing.dy }, o.footing = { ...o.footing, dx: v - n.left }, d < 1) return !1;
      const y = O;
      O = null;
      const B = Ya(), N = Vo(B.clip, y.canonicalFace), C = Ou(y, o.place, o.footing, N, performance.now() / 1e3);
      return o.place = C.place, o.footing = C.footing, Ko(B, o.place.posture, !1) === o.place.posture && (J = C.posed, Re = C.seatPose), V = { where: "aside", spot: { ...o.place }, until: M.value + dn }, Te = !0, !1;
    }
    function Vs() {
      if ((O == null ? void 0 : O.phase) !== "notice") return null;
      const n = Math.min((performance.now() - O.began) / (At.notice * 1e3), 1), l = (g) => {
        const v = Math.min(Math.max(g, 0), 1);
        return v * v * (3 - 2 * v);
      }, d = Nt(O.button);
      return { x: (d.x - o.at.x) / S, y: (d.y - o.at.y) / S, amount: l(n / 0.3) * (1 - l((n - 0.75) / 0.25)), most: 0 };
    }
    let so = 0, Ce = !1, Ue = null, Wn = !1;
    function ro(n) {
      ({ stay: V, cleared: kn } = Rd(V, n, Date.now() / 1e3)), Ce = !0;
    }
    const Xs = () => !o.trip && o.footing && Zo(o.place, D()) > so;
    function Zs() {
      const n = Z().floors.find((d) => d.element && d.element === o.place.on) ?? { left: te().edge.left, right: te().edge.left + te().edge.width }, l = vu(D(), o.place, n);
      if (!l) return ro(It(o.place, D(), re));
      V = { where: "aside", spot: l, until: M.value + dn }, Ce = !0;
    }
    function Js(n) {
      if (Kn) return void (Kn = !1);
      ro(n.currentTarget.parentElement.getBoundingClientRect()), be();
    }
    let T = null, Kn = !1;
    const Qs = () => !!(x && _.shown && o.here) && !T;
    function er(n) {
      var y, B;
      if (n.button !== 0 || n.isPrimary === !1 || !Qs()) return;
      n.preventDefault(), Kn = !0;
      const l = tr(n), { point: d } = l;
      o.at = l.at;
      const g = performance.now(), v = Ie(o.at);
      T = {
        pointer: n.pointerId,
        target: n.currentTarget,
        point: d,
        caught: { ...v },
        hang: { angle: l.angle, speed: 0 },
        hangAt: g / 1e3,
        offset: { x: v.x - n.clientX, y: v.y - n.clientY },
        moves: [{ x: n.clientX, y: n.clientY, at: g / 1e3 }]
      }, nr(v, d), Object.assign(o.airborne, { hang: l.angle, scale: l.scale, scaleFrom: l.scale, scaleAt: g }), (B = (y = n.currentTarget).setPointerCapture) == null || B.call(y, n.pointerId), window.addEventListener("pointermove", Yn), window.addEventListener("pointerup", ot), window.addEventListener("pointercancel", ot), window.addEventListener("blur", ot), ee();
    }
    function tr(n) {
      const l = { x: n.clientX, y: n.clientY };
      if (!window.DOMMatrix) return hl(o.at, l, S);
      const d = getComputedStyle(n.currentTarget.parentElement), g = d.rotate.endsWith("rad") ? parseFloat(d.rotate) * 180 / Math.PI : parseFloat(d.rotate) || 0, v = d.scale === "none" ? [1, 1] : d.scale.split(" ").map(Number), y = Number.isFinite(v[0]) ? v[0] : 1, B = Number.isFinite(v[1]) ? v[1] : y, N = new window.DOMMatrix().rotate(g).scale(y, B).multiply(new window.DOMMatrix(d.transform === "none" ? void 0 : d.transform)), [C, H] = d.transformOrigin.split(" ").map(parseFloat);
      return hl(o.at, l, S, N, { x: C, y: H });
    }
    function nr(n, l) {
      cancelAnimationFrame(ln);
      const d = x.facing ?? J.facing;
      x.turn = null, x.drewAt = performance.now(), K = null, Yt.value = null, jn(), Object.assign(o, Kd(o, n, l)), o.place.face = o.airborne.face = d, Zt(), Pn(), V = { where: "rest", until: 0 }, Ue = null, Re = null, Wn = !1, Ce = !1, z = null, On = null, Vt = null, pe = null, le.value = null, ve.value = null, bt.value = null, at.value = null, vt.value = "", $t = xl, aa = null, J = { posture: "stand", facing: d, turning: !1 }, Te = !1;
    }
    function Yn(n) {
      !T || n.pointerId !== T.pointer || (n.preventDefault(), T.moves = [...T.moves.slice(-19), { x: n.clientX, y: n.clientY, at: performance.now() / 1e3 }], Vn());
    }
    function Vn() {
      var B;
      if (!T || !((B = o.airborne) != null && B.held)) return;
      const n = T.moves.at(-1), l = io(), d = performance.now() / 1e3;
      T.hang = kl(T.hang ?? ga, T.hangAt ? d - T.hangAt : 0, d, n.x - (T.hangX ?? n.x), S), [T.hangAt, T.hangX] = [d, n.x];
      const g = n.x + T.offset.x, v = n.y + T.offset.y, y = T.caught;
      o.airborne = {
        ...o.airborne,
        x: Math.min(Math.max(g, Math.min(l.left, y.x)), Math.max(l.right, y.x)),
        y: Math.min(Math.max(v, Math.min(l.top, y.y)), Math.max(l.bottom, y.y)),
        hang: T.hang.angle,
        grip: T.point,
        scale: Na(o.airborne, performance.now())
      }, o.at = Ee(o.airborne, "stand");
    }
    function Xn() {
      var n, l;
      window.removeEventListener("pointermove", Yn), window.removeEventListener("pointerup", ot), window.removeEventListener("pointercancel", ot), window.removeEventListener("blur", ot), (l = T == null ? void 0 : (n = T.target).hasPointerCapture) != null && l.call(n, T.pointer) && T.target.releasePointerCapture(T.pointer), T = null;
    }
    function ot(n) {
      if (!T || (n == null ? void 0 : n.type) !== "blur" && (n == null ? void 0 : n.pointerId) !== T.pointer) return;
      const l = performance.now(), d = n.type === "pointercancel" || n.type === "blur";
      d || Yn(n);
      const g = d ? { x: 0, y: 0 } : Wd(T.moves, l / 1e3);
      o.airborne = gl(ml(o.airborne, S), g, l), o.at = Ee(o.airborne, "stand"), Xn(), ee();
    }
    function ar() {
      const n = io(), l = Z().floors.map((B) => B.id === "home" ? { ...B, left: n.left, right: n.right } : B), d = o.airborne, { airborne: g, landed: v, gone: y } = Yd(d, l, { ...n, top: me().top }, performance.now());
      if (y) return Gn();
      if (o.airborne = g, v) {
        const B = ((d.spin + 180) % 360 + 360) % 360 - 180, N = d.scale ?? [1, 1];
        return fe.value = { began: performance.now(), from: B, angle: B, scaleFrom: N, scale: N }, no(v, !0);
      }
      o.at = Ee(g, "stand");
    }
    function io() {
      const n = me(), l = Ye(Z().floors, "home"), d = n.top + (1 - Q.value) * S;
      return { left: n.left + S / 2, right: n.right - S / 2, top: d, bottom: Math.max(l ? l.top : n.bottom, d) };
    }
    const or = $(() => {
      var l;
      const n = Li(((l = o.airborne) == null ? void 0 : l.posture) ?? o.place.posture, Q.value);
      return {
        left: `${n.left * 100}%`,
        width: `${(n.right - n.left) * 100}%`,
        top: `${n.top * 100}%`,
        height: `${(n.bottom - n.top) * 100}%`
      };
    }), We = () => o.at.x + S / 2, _e = (n) => dt().edge.left + n.along, lt = () => Y.value.filter((n) => n.state === "piled").length, lr = () => {
      var n;
      return (n = o.trip) != null && n.moves ? o.way : Math.sign(wt(lt()) - We()) || 1;
    }, wt = (n) => {
      const { edge: l } = dt();
      return l.left + l.width + ol(n).left;
    };
    function sr() {
      const n = Y.value.filter((l) => l.state === "piled").map(_e);
      return n.length ? { left: Math.min(...n) - ft.width / 2, right: Math.max(...n) + ft.width / 2, top: dt().edge.top } : null;
    }
    function uo() {
      const n = Y.value.find((d) => d.state === "built");
      if (n) return { x: Mu(_e(n), wt(lt()), o.place.x) };
      const l = Y.value.find((d) => d.state === "building");
      return l ? { x: _e(l) - Ut } : De ? { beside: Ut, before: wt(lt() + Jo.high) - ft.width / 2, aim: Zn } : null;
    }
    let ue = null, De = !1, co = 0, Zn = null, fo = 0;
    function rr() {
      var d, g;
      const n = Y.value.some((v) => v.state !== "piled");
      if (ue = bu(ue, xu(kt ? [] : ((g = (d = Oe.value) == null ? void 0 : d.data) == null ? void 0 : g.cards) || [], cr(), M.value), Ae.reacted, M.value, Math.random), n) return;
      const l = !!(ue != null && ue.granted) && M.value >= fo;
      l && !De && (Zn = ur(), co = M.value), De = l && wu(ku.build, co, M.value), l && !De && (ue = { ...ue, granted: !1 });
    }
    let Jn = null;
    function ir() {
      Jn = ue ? null : Jn ?? M.value, _u(Y.value, !!ue, Jn, M.value) && ho();
    }
    function ur() {
      const { edge: n } = dt();
      return Ju(n.left, wt(lt() + Jo.high) - ft.width, Zn, Math.random);
    }
    const cr = () => kt ?? (dl(ie.value.state) ? { card: po(), since: ie.value.since } : null);
    let kt = null;
    function dr(n) {
      var d;
      n.state = "built";
      const l = (d = _.shown) != null && d.once ? 1 : 0;
      I.value = I.value.filter((g, v) => v < l || !ic.has(g.clip)), setTimeout(be);
    }
    function fr(n) {
      var B;
      const { edge: l } = dt(), d = Y.value, g = n.clip.name === "work" && re === "stand" && o.place.stays && !o.trip;
      if (g && !d.some((N) => N.state !== "piled")) {
        const N = Math.min(Math.max(We() + Ut - l.left, ft.inside), l.width - ft.inside);
        Y.value = [...d, { id: ++us, along: N, up: 0, state: "building", ...Gu(performance.now(), Math.random), blows: 0, lit: "amber", run: (ue == null ? void 0 : ue.card) || po() }];
      }
      const v = Y.value.find((N) => N.state === "building");
      v && g && pr(v, n), v && performance.now() >= v.until && dr(v);
      const y = d.find((N) => N.state === "built");
      if (y) {
        const N = wt(lt());
        (B = o.trip) != null && B.moves && (y.along = Hu(_e(y), We(), N, o.way) - l.left), Math.abs(_e(y) - N) < Uu.room && (Object.assign(y, { along: N - l.left, state: "piled", up: ol(lt()).up }), De = !1, fo = M.value + Wu(Math.random));
      }
      Mn.value = Y.value.map((N) => ({ id: N.id, x: _e(N), y: l.top, up: N.up, scale: 1, opacity: 1, blows: N.blows, lit: N.lit, state: N.state }));
    }
    const po = () => {
      var n, l, d;
      return ((d = (((l = (n = Oe.value) == null ? void 0 : n.data) == null ? void 0 : l.cards) || []).filter((g) => g.process && g.active).at(-1)) == null ? void 0 : d.key) ?? "";
    };
    function pr(n, l) {
      Wt.started !== _.started && (Wt = { started: _.started, landed: 0 });
      const d = rc(Tn(l), $n.frames, $n.lands);
      n.blows += Math.max(d - Wt.landed, 0), Wt.landed = d;
    }
    const hr = (n) => n.some((l) => l.beat === "committed");
    function ho() {
      Y.value = [], Mn.value = [], De = !1;
    }
    function mr(n) {
      var y, B;
      const l = n.clip.name === "glass_bubble" && nn(), d = sc(Y.value, De, _e, dt().edge.top, lr()), g = ph(Da, M.value), v = [
        ["pointer", "pointer", n.clip.name === "tickle_swat" ? aa : null],
        ["run", "run", vo()],
        [`reading:${Ne == null ? void 0 : Ne.card}`, "reading", $r()],
        ["glass", "reading", l && _r(l)],
        ["attachment", "attachment", br()],
        ["said", "said", (y = Qn("user")) == null ? void 0 : y.point],
        ["message", "message", (B = Qn("agent")) == null ? void 0 : B.point],
        ["composer", g ?? "typing", g && vr()],
        ["work", "work", d == null ? void 0 : d.at],
        ["confession", "confession", gr(n)],
        ["picture", "picture", se.picture && bl(se.picture.getBoundingClientRect())],
        ["bar", "bar", yr(n)],
        ["glance", "glance", kr()]
      ];
      return mh(n.clip, v.filter(([, , N]) => N).map(([N, C, H]) => ({ key: N, kind: C, point: H })));
    }
    function gr(n) {
      var g;
      const l = I.value[0];
      if (n.clip.name !== "repent" || (l == null ? void 0 : l.clip) !== "repent" || !l.mark) return null;
      const d = (g = document.querySelector(`[data-figure-mark="${CSS.escape(l.mark)}"]`)) == null ? void 0 : g.getBoundingClientRect();
      return d ? { ...bl(d), most: zh } : null;
    }
    function yr(n) {
      var g;
      if (!dc(Vt, n)) return null;
      const l = te(), d = Ar() && ((g = o.footing) != null && g.home || o.place.stays) ? fc(l.element) : null;
      return d && pc(d, { x: We(), y: o.place.y }, l.element.getBoundingClientRect(), D());
    }
    const vr = () => {
      var l;
      const n = (l = ra()) == null ? void 0 : l.getBoundingClientRect();
      return n ? Nt(n) : null;
    };
    function br() {
      const n = uh(s.running), l = n && document.querySelector(`[data-ref="message:${n}"] [data-figure-picture]`);
      return l ? Nt(l.getBoundingClientRect()) : null;
    }
    function Qn(n) {
      var v;
      const d = w.value.filter((y) => y.author === n && St(y) > bn).reduce((y, B) => !y || St(B) > St(y) ? B : y, null);
      if (!d || M.value - St(d) > ch) return null;
      const g = (v = document.querySelector(`[data-figure-mark="${CSS.escape(ia(d))}"]`)) == null ? void 0 : v.getBoundingClientRect();
      return g ? { key: ia(d), kind: n === "user" ? "said" : "message", card: ia(d), box: g, point: Nt(g) } : null;
    }
    let pe = null, mo = "";
    const go = () => {
      var n;
      return !!((n = o.trip) != null && n.moves && !o.trip.hopping);
    };
    function xr(n) {
      const l = Ie(o.at), d = Z().floors.find((g) => g.id === o.walk.on);
      pe = { card: n.card, box: n.box, until: M.value + Rt.halt }, mo = n.card, o.trip = null, nt({ x: l.x, y: l.y, face: 0, posture: "stand", on: (d == null ? void 0 : d.element) ?? te().element });
    }
    function wr() {
      !pe || M.value < pe.until || (wh(Math.random) && _a(pe.card, D()) && (V = { where: "mark", card: pe.card, until: M.value + ul }), pe = null);
    }
    let ea = null;
    function kr() {
      return ea = $h(ea, M.value, Math.random, re === "sit" ? _h : kh), Mh(ea, M.value, _t(), S);
    }
    const nn = () => bd(Z(), o.place, D());
    function _r(n) {
      const l = S * 0.8, d = { left: Math.max(n.left, o.place.x - l), right: Math.min(n.right, o.place.x + l), top: n.top, bottom: n.bottom };
      return ll(d, performance.now() / 1e3);
    }
    let Ne = null;
    function yo() {
      var n;
      return !Ne || M.value >= Ne.until ? Ne = null : ((n = document.querySelector(`[data-figure-mark="${CSS.escape(Ne.card)}"]`)) == null ? void 0 : n.getBoundingClientRect()) ?? null;
    }
    function $r() {
      const n = yo();
      return n && ll(n, Date.now() / 1e3 - Ne.began);
    }
    function Mr() {
      const n = (pe == null ? void 0 : pe.box) ?? yo() ?? (Ka() === "glass_bubble" ? nn() : null);
      return n && nc(n, o.at.x + S / 2, S);
    }
    function vo() {
      var g, v;
      if (!Be || Be.at !== null) return null;
      const n = ((g = document.querySelector(`[data-figure-mark="${CSS.escape(Be.card)}"]`)) == null ? void 0 : g.getBoundingClientRect()) ?? null, l = te(), d = l.docked ? ((v = rn(l.element)) == null ? void 0 : v.bar.getBoundingClientRect()) ?? null : null;
      return lc(n, d, _t());
    }
    function Sr(n) {
      const l = vo();
      return !l || yh(n.clip) || st.amount === na && !!st.point && Iu(st.point, l, _t());
    }
    const Ar = () => te().docked && !o.trip;
    let st = { point: null, toward: null, amount: 0, at: 0 }, ta = null, bo = El, an = null, xo = null, na = 0;
    function Or(n) {
      var d;
      an = bh(an, mr(n), performance.now() / 1e3);
      const l = go() ? xh(xo, an.look, o.trip.way ?? o.way, _t(), performance.now() / 1e3) : { look: an.look, glancing: null };
      return xo = l.glancing, na = vh(l.look, n.clip), st = ju(st, ((d = l.look) == null ? void 0 : d.point) ?? null, { x: o.at.x + S / 2, y: o.at.y + S * bo }, performance.now(), ta && { ...ta, facing: n.facing }, na), gh(st, o.at, S);
    }
    const _t = () => ({ x: o.at.x + S / 2, y: o.at.y + S * El }), wo = (n) => {
      var l, d;
      (d = (l = n.target).closest) != null && d.call(l, Ci) && (_n = !0, Da = Date.now() / 1e3);
    }, ko = P(null);
    let $t = xl, aa = null;
    function _o(n) {
      var d;
      if (T || o.airborne || K) return;
      const l = (d = ko.value) == null ? void 0 : d.getBoundingClientRect();
      !l || !Hp(l, n.clientX, n.clientY) || ($t = Up($t, n.clientX, performance.now()), aa = { x: n.clientX, y: n.clientY }, wl($t, performance.now()) && !I.value.some((g) => g.clip === "tickle_swat") && Ke({ beat: "tickled", time: M.value }));
    }
    const on = () => {
      var n;
      return (n = _.shown) != null && n.once && !_.shown.arrival && !_.shown.departure && !_.shown.landed ? _.shown.clip.name : "";
    }, Er = /* @__PURE__ */ new Set(["long_walk", "tickled", "bar_failed"]);
    let $o = [];
    function Ke(...n) {
      const l = mu(z, $o, n);
      $o = l.held, l.answer.forEach(Nr);
    }
    function Nr(n) {
      var d;
      const l = Ku(n, p.value, Ae, M.value, Math.random, Ha);
      if (l != null && l.beat && Yu(I.value, l.beat)) {
        const g = { ...l.beat, queuedAt: M.value, bugs: l.beat.clip === "bug_shot" ? Uo(Math.random) : [] };
        I.value = Er.has(n.beat) ? Vu(I.value, g, on()) : [...I.value, g];
      }
      (d = l == null ? void 0 : l.beat) != null && d.onto && !xt() && _a(l.beat.card, D()) && (V = { where: "mark", card: l.beat.card, until: M.value + ul }, Ce = !0), l != null && l.gaze && (Ne = { card: l.gaze.card, began: M.value, until: M.value + Xu.seconds }), l != null && l.look && (yn = Zu(l.look, performance.now() / 1e3), V = Cd(V, o.place));
    }
    let ln = 0;
    function oa() {
      if (cancelAnimationFrame(ln), !(T || o.airborne || K)) {
        if (!ra()) {
          ln = requestAnimationFrame(oa);
          return;
        }
        nt(je(null, D())), Xt();
      }
    }
    function Fr(n) {
      if (!x && !n) return void i("gone");
      !x || T || o.airborne || n === Vp(o) || (n && (o.here = !0, oa()), o.leaving = !n, o.arriving = n, ee());
    }
    const Mo = () => {
      document.hidden || (be(), ee());
    };
    async function So(n) {
      if (T && (o.airborne = gl(ml(o.airborne, S), { x: 0, y: 0 }, performance.now())), Xn(), O = null, x = null, !!n)
        try {
          const [l, d] = await Promise.all([Zc(n), import("./figure-Bvf3SdRV.js")]);
          if (n !== p.value || !u.value) return;
          const { FigurePlayer: g } = await import("./player-DV5BlUbM.js");
          F = d.CLIPS.filter((v) => !v.voices || v.voices.includes(n)), Ca = [...l.stance.free], Ut = d.blowsLandAt(l.stance) * S, $n = { frames: d.WORK.blowFrames, lands: d.WORK.lands }, ta = { depth: d.LOOK_REACH * S, above: d.eyesAboveOf(l) * S, tip: d.HEAD_TIP }, bo = d.headPivotOf(l), jo(Oe.value, Fa), Go(Oe.value, Ba), Ho(Oe.value, La), Q.value = d.GROUND, u.value.width = u.value.height = Math.round(S * (window.devicePixelRatio || 1)), x = new g(l, u.value), Br(), Tr(), Lr(), oa(), o.here = s.here, o.arriving = o.here, ht(), be(), ee();
        } catch (l) {
          m.value = String(l.message ?? l);
        }
    }
    function Br() {
      const n = window.devicePixelRatio || 1, l = (d) => {
        const g = Array.from({ length: Su(d) }, (v, y) => x.stage.drawBlock(d, y, S, n));
        return { pictures: g.map((v) => v.canvas.toDataURL()), width: g[0].canvas.width / n, height: g[0].canvas.height / n, below: g[0].below };
      };
      vn.value = Object.fromEntries(lu.map((d) => [d, l(d)]));
    }
    function Tr() {
      const n = window.devicePixelRatio || 1, l = x.stage.drawCanopy(S, n);
      Ta.value = { picture: l.canvas.toDataURL(), width: l.canvas.width / n, height: l.canvas.height / n, at: l.at, ends: l.ends };
    }
    function Lr() {
      const n = window.devicePixelRatio || 1, l = [0, 0.5].map((d) => x.stage.drawBug(d, S, n));
      Gt.value = { pictures: l.map((d) => d.canvas.toDataURL()), width: l[0].canvas.width / n, height: l[0].canvas.height / n, at: l[0].at };
    }
    function Ao({ detail: n }) {
      Ue = null, n.held !== void 0 && (Ia.value = n.held), n.held && (ke = n.held), n.perch && (V = { where: "bubble", perch: Kl(oe(), D(), [], Math.random, { now: M.value }), until: M.value + Rh }), n.parcel !== void 0 && (kt = n.parcel ? { card: "demo", since: 0 } : null), kt && (ue = { card: kt.card, granted: !0 }), n.clip === "chute" ? Gn() : n.clip && (I.value = [...I.value, { clip: n.clip, card: "", lifetime: 1 / 0, queuedAt: M.value, bugs: n.clip === "bug_shot" ? Uo(Math.random) : [] }]), be();
    }
    va(p, So), va(() => s.here, Fr), Vr(() => {
      window.addEventListener(Nl, Ao), document.addEventListener("visibilitychange", Mo), document.addEventListener("input", wo, !0), window.addEventListener("resize", be), window.addEventListener("mousemove", _o, { passive: !0 }), So(p.value);
    }), Xr(() => {
      window.removeEventListener(Nl, Ao), He(), cancelAnimationFrame(ln), cancelAnimationFrame(L), clearTimeout(G), document.removeEventListener("visibilitychange", Mo), document.removeEventListener("input", wo, !0), window.removeEventListener("resize", be), window.removeEventListener("mousemove", _o), Xn();
    });
    const Oo = $(() => {
      var l;
      const n = (l = mt.value) == null ? void 0 : l.marks;
      return n != null && n.frames.some(([d, g]) => Kt.value >= d && Kt.value < g) ? n.mark : "";
    }), zr = $(() => ({
      left: `${Le.value.x * 100}%`,
      top: `${(Le.value.y - Bh) * 100}%`,
      "--mark-seconds": `${Ol}s`
    })), rt = P(null);
    let Eo = null;
    const No = /* @__PURE__ */ new Map();
    function Rr(n) {
      var g;
      const l = n.clip.name === "bug_shot" ? (g = I.value[0]) == null ? void 0 : g.bugs : null;
      if (l !== Eo && (Eo = l, No.clear()), rt.value = l != null && l.length ? Pu(l, me(), Bn(n), { surfaces: qu(), bursts: No }) : null, !rt.value) return null;
      const { target: d } = rt.value;
      return { x: (d.x - o.at.x) / S, y: (d.y - o.at.y) / S, back: d.back };
    }
    const Ir = $(() => {
      var n;
      return (((n = rt.value) == null ? void 0 : n.bugs) ?? []).map((l) => ({ ...l, x: l.x - o.at.x, y: l.y - o.at.y }));
    }), Cr = $(() => {
      var n;
      return (((n = rt.value) == null ? void 0 : n.slush) ?? []).map((l) => ({
        ...l,
        x: l.x - o.at.x,
        y: l.y - o.at.y,
        ...l.clip ? { clip: { left: l.clip.left - o.at.x, right: l.clip.right - o.at.x, top: l.clip.top - o.at.y, bottom: l.clip.bottom - o.at.y } } : {}
      }));
    }), Dr = $(() => {
      var n;
      return (((n = rt.value) == null ? void 0 : n.camera) ?? []).map((l) => ({ ...l, from: { x: l.from.x - o.at.x, y: l.from.y - o.at.y } }));
    }), Pe = $(() => zi(Sn.value, An.value)), Pr = $(() => ({ left: o.at.x, right: window.innerWidth - o.at.x - S })), la = $(() => Pe.value && Ri(Pe.value.name, Pe.value.u)), qr = $(() => ({
      left: `${Le.value.x * 100}%`,
      top: `${Le.value.y * 100}%`,
      opacity: jt.value.strength,
      "--halo": `rgb(${jt.value.colour.map((n) => Math.round(n * 255)).join(" ")})`
    })), jr = $(() => {
      var n;
      return ["enter", "exit"].includes((n = mt.value) == null ? void 0 : n.name);
    }), Gr = $(() => {
      var n, l, d;
      return {
        "--size": `${S}px`,
        "--fall-ms": `${Qt.value.ms}ms`,
        "--squash": Qt.value.squash,
        "--bounce": `${Qt.value.bounce}px`,
        ...la.value && { scale: `${la.value.x} ${la.value.y}`, transformOrigin: `50% ${(1 - Q.value) * 100}%` },
        ...qn.value && { rotate: `${Dn.value}rad`, transformOrigin: `${qn.value.x * 100}% ${qn.value.y * 100}%` },
        ...fe.value && { rotate: `${fe.value.angle}deg`, scale: fe.value.scale.join(" "), transformOrigin: "50% 55%" },
        ...((n = o.airborne) == null ? void 0 : n.held) && { rotate: `${o.airborne.hang}rad`, transformOrigin: `${o.airborne.grip.x * 100}% ${o.airborne.grip.y * 100}%` },
        ...((l = o.airborne) == null ? void 0 : l.thrown) && { rotate: `${o.airborne.spin}deg`, transformOrigin: "50% 55%" },
        ...((d = o.airborne) == null ? void 0 : d.scale) && { scale: o.airborne.scale.join(" ") }
      };
    }), Hr = $(() => {
      const n = me(), { x: l, y: d } = o.at;
      return {
        width: `${S}px`,
        height: `${S}px`,
        zIndex: wa.figure,
        transform: `translate(${l}px, ${d}px)`,
        clipPath: `inset(${n.top - d}px ${l + S - n.right}px ${d + S - n.bottom}px ${n.left - l}px)`
      };
    });
    return (n, l) => {
      var d, g;
      return b(), k(R, null, [
        Zr(A("div", {
          class: "voice-figure",
          style: ae(Hr.value),
          "aria-hidden": "true",
          "data-walking": Ra.value,
          "data-hopping": rs.value,
          "data-trip": is.value,
          "data-clip": (d = mt.value) == null ? void 0 : d.name,
          "data-beats": I.value.map((v) => v.clip).join(" ")
        }, [
          A("div", {
            class: Fl(["voice-figure-actor", vt.value]),
            style: ae(Gr.value),
            onAnimationend: Ds
          }, [
            A("div", {
              class: "voice-figure-body",
              style: ae(or.value),
              onMousedown: l[0] || (l[0] = Jr(() => {
              }, ["prevent"])),
              onPointerdown: er,
              onClick: Js,
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
              style: ae(jr.value || j(Ii)((g = Pe.value) == null ? void 0 : g.name) ? { clipPath: `inset(0 0 ${Q.value * 100}% 0)` } : null)
            }, null, 12, Fh),
            jt.value ? (b(), k("span", {
              key: 0,
              class: "voice-figure-halo",
              style: ae(qr.value)
            }, null, 4)) : q("", !0),
            Oo.value ? (b(), k("span", {
              key: 1,
              class: "voice-figure-marks",
              style: ae(zr.value)
            }, [
              (b(), k(R, null, U(Al, (v) => A("span", {
                key: v,
                style: ae({ animationDelay: `${-(v - 1) * Ol / Al}s` })
              }, $a(Oo.value), 5)), 64))
            ], 4)) : q("", !0),
            Co(Do, {
              name: "figure-prop",
              duration: 150
            }, {
              default: Po(() => [
                Pe.value ? (b(), ne(Rp, {
                  key: Pe.value.name,
                  name: Pe.value.name,
                  u: Pe.value.u,
                  hand: ja.value,
                  head: Le.value,
                  feet: 1 - Q.value,
                  size: S,
                  room: Pr.value,
                  ball: bt.value,
                  canopy: Ta.value,
                  bug: Gt.value,
                  "wall-bugs": Ir.value,
                  slush: Cr.value,
                  camera: Dr.value
                }, null, 8, ["name", "u", "hand", "head", "feet", "room", "ball", "canopy", "bug", "wall-bugs", "slush", "camera"])) : q("", !0)
              ]),
              _: 1
            })
          ], 38)
        ], 12, Nh), [
          [Qr, j(o).here]
        ]),
        Va.value && Gt.value ? (b(), ne(jp, {
          key: 0,
          bug: Gt.value,
          at: Va.value
        }, null, 8, ["bug", "at"])) : q("", !0),
        (b(!0), k(R, null, U(Mn.value, (v) => (b(), k(R, {
          key: v.id
        }, [
          vn.value ? (b(), ne(Qd, {
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
          }, null, 8, ["x", "y", "up", "scale", "opacity", "blows", "block", "ahead", "piled"])) : q("", !0)
        ], 64))), 128)),
        Co(Do, { name: "step-ladder" }, {
          default: Po(() => [
            at.value ? (b(), ne(qd, {
              key: 0,
              foot: at.value.foot,
              top: at.value.top
            }, null, 8, ["foot", "top"])) : q("", !0)
          ]),
          _: 1
        })
      ], 64);
    };
  }
}, Ch = /* @__PURE__ */ Ge(Ih, [["__scopeId", "data-v-07c40a27"]]), Gh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Ch
}, Symbol.toStringTag, { value: "Module" }));
export {
  Pl as F,
  kc as G,
  os as H,
  _c as R,
  Gh as V,
  jh as g,
  yh as h,
  qh as t
};
