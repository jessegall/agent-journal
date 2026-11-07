/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, normalizeStyle as ge, unref as q, renderSlot as de, createElementVNode as g, normalizeClass as X, Fragment as V, renderList as te, defineComponent as ii, Comment as ci, h as Jn, cloneVNode as ui, createBlock as H, withCtx as j, createVNode as L, toDisplayString as $, createCommentVNode as O, ref as I, onMounted as Re, onBeforeUnmount as ft, reactive as Zn, shallowRef as Ke, watch as he, onUnmounted as Be, inject as Oe, useAttrs as Xn, computed as T, resolveDynamicComponent as ht, mergeProps as Le, useId as fs, resolveDirective as di, withDirectives as Ye, createTextVNode as ee, Teleport as hs, nextTick as mt, Transition as jt, withModifiers as $e, createApp as fi, TransitionGroup as al, shallowReactive as hi, isRef as Vs, onScopeDispose as ms, resolveComponent as mi, useModel as Wa, getCurrentInstance as pi, mergeModels as Ha, getCurrentScope as sl, provide as ol, onErrorCaptured as gi, toHandlers as vi, createSlots as yi, vShow as ll, useSlots as bi, withKeys as Xt, vModelText as Dn, normalizeProps as wi, guardReactiveProps as ki, defineAsyncComponent as $i } from "vue";
function rl(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const J = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, xi = 1600, Mi = {
  __name: "Shimmer",
  setup(e) {
    const t = rl(xi);
    return (n, a) => (c(), h("span", {
      class: "shimmer",
      style: ge(q(t))
    }, null, 4));
  }
}, Gt = /* @__PURE__ */ J(Mi, [["__scopeId", "data-v-6c018b03"]]), Si = { class: "skeleton-line" }, _i = 2e3, Ei = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = rl(_i);
    return (n, a) => (c(), h("span", Si, [
      de(n.$slots, "default", {}, void 0, !0),
      g("span", {
        class: X(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(V, null, te(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: X(["bar", { still: e.still }]),
          style: ge({ ...q(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, pt = /* @__PURE__ */ J(Ei, [["__scopeId", "data-v-484fe8a0"]]), Pt = ii({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== ci);
      return a.length !== 1 ? Jn(V, { key: n }, a) : a[0].key == null ? ui(a[0], { key: n }) : a[0];
    };
  }
}), Ai = ["aria-label"], Ci = ["aria-label"], Oi = ["aria-label"], Ti = ["aria-label"], Ri = ["aria-label"], Ii = ["aria-label"], Bi = ["aria-label"], Li = {
  __name: "Skeleton",
  props: { shape: { type: String, default: "rows" }, count: { type: Number, default: 4 }, label: { type: String, default: "Loading" } },
  setup(e) {
    const t = [
      { id: "shape-1", width: 46, height: 38, mine: !1 },
      { id: "shape-2", width: 30, height: 22, mine: !0 },
      { id: "shape-3", width: 58, height: 64, mine: !1 },
      { id: "shape-4", width: 40, height: 30, mine: !1 },
      { id: "shape-5", width: 34, height: 22, mine: !0 },
      { id: "shape-6", width: 62, height: 86, mine: !1 },
      { id: "shape-7", width: 26, height: 22, mine: !1 },
      { id: "shape-8", width: 50, height: 44, mine: !0 },
      { id: "shape-9", width: 38, height: 30, mine: !1 },
      { id: "shape-10", width: 56, height: 58, mine: !1 },
      { id: "shape-11", width: 30, height: 22, mine: !0 },
      { id: "shape-12", width: 44, height: 38, mine: !1 },
      { id: "shape-13", width: 60, height: 72, mine: !1 },
      { id: "shape-14", width: 36, height: 30, mine: !0 }
    ], n = [
      { id: "type", bars: [{ width: "64px", height: 8 }] },
      { id: "title", bars: [{ width: "70%", height: 12 }] },
      { id: "line", bars: [{ width: "45%", height: 9 }] }
    ], a = [
      { width: "46%", height: 12 },
      { width: "52px", height: 9 }
    ], s = [
      { id: "first", bars: [{ width: "88%", height: 9 }] },
      { id: "second", bars: [{ width: "64%", height: 9 }] },
      { id: "third", bars: [{ width: "76%", height: 9 }] }
    ], o = [
      { width: "58%", height: 11 },
      { width: "32%", height: 9 }
    ], l = ["94%", "88%", "91%", "62%"].map((i) => ({ width: i, height: 10 })), r = [
      { width: "110px", height: 12 },
      { width: "86%", height: 24 },
      { width: "52%", height: 24 }
    ];
    return (i, d) => (c(), H(Pt, { value: e.shape }, {
      messages: j(() => [
        g("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(V, null, te(t, (u) => L(Gt, {
            key: u.id,
            class: X(["skeleton-message", { mine: u.mine }]),
            style: ge({ width: `${u.width}%`, height: `${u.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, Ai)
      ]),
      older: j(() => [
        g("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(V, null, te(t.slice(0, 3), (u) => (c(), H(Gt, {
            key: u.id,
            class: X(["skeleton-message", { mine: u.mine }]),
            style: ge({ width: `${u.width}%`, height: `${u.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, Ci)
      ]),
      cards: j(() => [
        g("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(V, null, te(e.count, (u) => (c(), h("div", {
            key: u,
            class: "skeleton-card"
          }, [
            (c(), h(V, null, te(n, (f) => L(pt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Oi)
      ]),
      file: j(() => [
        g("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(V, null, te(e.count, (u) => (c(), h("div", {
            key: u,
            class: "skeleton-file"
          }, [
            L(pt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (c(), h(V, null, te(s, (f) => L(pt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Ti)
      ]),
      page: j(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          L(pt, {
            class: "skeleton-heading",
            bars: r
          }),
          (c(!0), h(V, null, te(e.count, (u) => (c(), H(pt, {
            key: u,
            bars: q(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Ri)
      ]),
      text: j(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(V, null, te(e.count, (u) => (c(), H(pt, {
            key: u,
            bars: q(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Ii)
      ]),
      default: j(() => [
        g("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(V, null, te(e.count, (u) => (c(), H(pt, {
            key: u,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Bi)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, _t = /* @__PURE__ */ J(Li, [["__scopeId", "data-v-ef519c5f"]]), Ni = {
  key: 1,
  class: "empty-state titled"
}, Di = { class: "empty-state-title" }, ji = { class: "empty-state-text" }, Pi = {
  key: 2,
  class: "empty-state"
}, qi = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), H(_t, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", Ni, [
      g("p", Di, $(e.title), 1),
      g("p", ji, [
        de(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", Pi, [
      de(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Qt = /* @__PURE__ */ J(qi, [["__scopeId", "data-v-b27e89b0"]]), Fi = { class: "fold-group" }, Wi = ["aria-expanded"], Hi = { class: "fold-label" }, Ui = {
  key: 0,
  class: "fold-count"
}, zi = {
  __name: "FoldGroup",
  props: {
    label: { type: String, required: !0 },
    count: { type: [Number, String], default: "" },
    open: { type: Boolean, default: !0 },
    flush: { type: Boolean, default: !1 },
    bar: { type: Boolean, default: !1 }
  },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", Fi, [
      g("button", {
        type: "button",
        class: X(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        g("span", Hi, $(e.label), 1),
        e.count !== "" ? (c(), h("span", Ui, $(e.count), 1)) : O("", !0),
        g("span", {
          class: X(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Wi),
      e.open ? de(a.$slots, "default", {}, void 0, !0, 0) : O("", !0)
    ]));
  }
}, u4 = /* @__PURE__ */ J(zi, [["__scopeId", "data-v-9ef1865c"]]), Vi = 150, Gi = () => Vi;
function ps(e, t, n = Gi(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function Ki(e, t, n) {
  if (!e) return n(t);
  const { target: a, fields: s } = e, o = Object.fromEntries(Object.keys(s).map((i) => [i, a[i]])), l = () => Object.assign(a, o);
  Object.assign(a, s);
  let r = !1;
  try {
    const i = await n(t);
    return r = i.ok, i;
  } finally {
    r || l();
  }
}
const Yi = 50, Gs = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function d4(e) {
  const t = We().sources.find((n) => n.key === e);
  return t ? Ua(t.read, t.events) : Ua("", []);
}
function il(e, t, n, a, s = () => !1) {
  const o = I([]), l = I(null), r = I(""), i = I(!1), d = performance.now(), u = I(!1), f = I(""), m = I(null), v = /* @__PURE__ */ new Set();
  let y = null;
  function A(p) {
    return s() ? (v.add(p), y ?? (y = new Promise((x) => setTimeout(() => x(R()), Yi)))) : S(p);
  }
  async function R() {
    const p = new Set(v);
    v.clear(), y = null;
    const x = N, M = await t({ ids: [...p].join(","), limit: p.size });
    if (x !== N) return;
    if (!M.ok) return _();
    const C = new Map(M.value.rows.map((P) => [P.id, P]));
    o.value = o.value.flatMap((P) => p.has(P.id) ? C.has(P.id) ? [C.get(P.id)] : [] : [P]);
  }
  async function S(p) {
    const x = N, M = await t({ "before-id": p + 1, limit: 1 });
    if (x !== N) return;
    if (!M.ok) return _();
    const C = M.value.rows.find((P) => P.id === p);
    o.value = C ? o.value.map((P) => P.id === p ? C : P) : o.value.filter((P) => P.id !== p);
  }
  async function D(p) {
    if (a() && String((p == null ? void 0 : p.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((ne) => ne.id !== p.row_id));
    if (a() && (p != null && p.row_id) && !String(p.event ?? "").endsWith(".create") && o.value.some((ne) => ne.id === p.row_id)) return A(p.row_id);
    if (!(a() && o.value.length && String((p == null ? void 0 : p.event) ?? "").endsWith(".create"))) return _();
    const M = Math.max(...o.value.map((ne) => ne.id)), C = N, P = await t({ "after-id": M });
    if (C !== N) return;
    if (!P.ok) return _();
    const Z = new Set(o.value.map((ne) => ne.id));
    o.value = [...P.value.rows.filter((ne) => !Z.has(ne.id)), ...o.value];
  }
  async function U() {
    if (!u.value || !o.value.length) return !1;
    const p = N, x = Math.min(...o.value.map((P) => P.id)), M = await t({ "before-id": x });
    if (p !== N) return !1;
    if (!M.ok || !M.value.rows.length) return u.value = !1;
    u.value = Gs(M.value, n());
    const C = new Set(o.value.map((P) => P.id));
    return o.value = [...o.value, ...M.value.rows.filter((P) => !C.has(P.id))], !0;
  }
  let N = 0;
  function B(p, x) {
    var P, Z;
    const M = p.ok ? e.shared ? [p.value] : ((P = p.value) == null ? void 0 : P.rows) ?? [] : [];
    p.ok && (o.value = x(M)), l.value = p.ok ? p.value : null;
    const C = M.length ? Math.min(...M.map((ne) => ne.id)) : 0;
    p.ok && ((Z = p.value) != null && Z.rows) && !o.value.some((ne) => ne.id < C) && (u.value = !e.shared && Gs(p.value, n())), r.value = p.ok ? "" : p.error, ps(d, () => i.value = !0);
  }
  async function F(p) {
    const x = ++N, M = await t({});
    x === N && B(M, p);
  }
  const E = (p) => {
    if (!a() || !p.length) return p;
    const x = Math.min(...p.map((C) => C.id)), M = Math.max(...p.map((C) => C.id));
    return [...o.value.filter((C) => C.id > M), ...p, ...o.value.filter((C) => C.id < x)];
  }, _ = () => F(E), w = (p) => B(p, E), b = () => F((p) => p);
  async function k(p, x = null) {
    const M = await Ki(x && { target: o, fields: { value: x(o.value) } }, p, e.run);
    return f.value = M.ok ? "" : M.error, m.value = M.ok ? M.value : null, await _(), M;
  }
  return { rows: o, listing: l, failure: r, loaded: i, more: u, load: _, loadLatest: b, older: U, act: k, actionFailure: f, answer: m, context: e, heard: D, showFirst: w };
}
const Ji = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function Ua(e, t, { incremental: n = !1 } = {}) {
  var r;
  const a = Number(((r = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : r[1]) ?? 50), s = We(), l = il(s, (i) => s.read(s.shared && !Object.keys(i).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Ji(i)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Zi = 2e3;
function gs(e, t, n = Zi) {
  let a = null, s = !1, o = !1;
  const l = async (u) => {
    o = !0;
    try {
      await u();
    } catch {
    } finally {
      o = !1;
    }
  }, r = () => l(async () => t() && await e()), i = () => {
    s || document.hidden || (a = setTimeout(
      async () => {
        document.hidden || await r(), i();
      },
      typeof n == "function" ? n() : n
    ));
  }, d = async () => {
    s || document.hidden || o || (clearTimeout(a), await r(), i());
  };
  Re(async () => {
    document.addEventListener("visibilitychange", d), await l(e), i();
  }), ft(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", d);
  });
}
const cl = typeof document < "u" && document.documentElement.classList.contains("phone"), ul = 120;
var tl;
const ua = globalThis[tl = Symbol.for("journal.pressed")] ?? (globalThis[tl] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Xi(e = 0) {
  const t = ua.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, ua.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, ua.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function za(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function dl(e = window) {
  if (!za(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    za(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Va = "journal.stale-build-reload", Qi = 'script[type="module"][src*="/assets/index-"]', Ks = (e) => {
  var t;
  return ((t = e.querySelector(Qi)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function ec(e = document, t = (a, s) => Me.quietRead(a, s), n = () => dl(window)) {
  const a = Ks(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Ks(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let da = "";
function tc(e, t = () => dl(window)) {
  if (!e) return !1;
  const n = !!da && da !== e;
  return da = e, n && t(), n;
}
const nc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function ac(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Va) === e.message) return !1;
    t.setItem(Va, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function sc(e = window.sessionStorage) {
  try {
    e.removeItem(Va);
  } catch {
    return;
  }
}
const oc = 2e3, lc = 3e4, Ue = Zn({ starting: !1, external: !1, late: !1, offline: !1 }), vs = () => Ue.starting, rc = 3;
let vn = 0, Ga = 0, fl = 0, hl = [];
async function ic() {
  try {
    const e = await Me.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ue.external };
  }
}
let Ys = null;
const cc = () => Ys ?? (Ys = ic().finally(() => Ys = null));
function uc() {
  clearTimeout(Ga), clearTimeout(fl), Ga = 0, Object.assign(Ue, { starting: !1, external: !1, late: !1, offline: !1 }), hl.splice(0).forEach((e) => e()), ec();
}
async function dc() {
  Ue.offline = !navigator.onLine;
  const e = await cc();
  if (Ue.external = e.updating, vn = !e.restarting && !e.updating && e.reachable ? vn + 1 : 0, vn < rc) return;
  vn = 0, (!tc(e.started_at) || za()) && uc();
}
function ml() {
  Ga = setTimeout(async () => {
    await dc(), Ue.starting && ml();
  }, oc);
}
function fc() {
  Ue.starting || (Ue.starting = !0, Ue.offline = !navigator.onLine, ml(), fl = setTimeout(() => Ue.late = !0, lc));
}
const pl = () => Ue.starting ? new Promise((e) => hl.push(e)) : Promise.resolve();
function gl(e, t, n = 0) {
  let a = n, s = null, o = !1, l = !1;
  const r = () => {
    o = !1, a = Date.now(), l && (l = !1, d());
  }, i = () => {
    s = null;
    const u = e();
    a = Date.now(), u instanceof Promise && (o = !0, u.catch(() => {
    }).finally(r));
  }, d = () => {
    if (o) {
      l = !0;
      return;
    }
    if (s) return;
    const u = t - (Date.now() - a);
    u <= 0 ? i() : s = setTimeout(i, u);
  };
  return d.cancel = () => {
    clearTimeout(s), s = null, l = !1;
  }, d;
}
function hc(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class mc {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = gl(() => this.leave(), 0);
  }
  leave() {
    const t = this.following;
    this.following = null, this.flying = t, this.outdated = !1, this.tracked("sent", t);
    const n = this.read(t.stop.signal, t);
    t.resolve(n);
    const a = () => {
      this.tracked("answered", t), this.flying === t && (this.flying = null), this.following || this.ended();
    };
    return n.then(a, a), n;
  }
  asked(t) {
    var o;
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = hc(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
    a.askers += 1, a.callers += 1, this.tracked("asked", a);
    const s = this.answerFor(a, t);
    return this.following === a && this.ask(), s;
  }
  answerFor(t, n) {
    return n ? new Promise((a, s) => {
      const o = () => {
        this.left(t), s(new DOMException("cancelled", "AbortError"));
      };
      if (n.aborted) return o();
      n.addEventListener("abort", o, { once: !0 }), t.answer.then(a, s).finally(() => n.removeEventListener("abort", o));
    }) : t.answer;
  }
  left(t) {
    t.askers -= 1, !(t.askers > 0) && (t.stop.abort(), t === this.following && (this.following = null, this.ask.cancel(), this.flying || this.ended()));
  }
  heardEvent() {
    this.flying && (this.outdated = !0);
  }
}
const st = "viewer.shell", yn = 2e4, pc = 4, Js = "/api/read-lines", gc = 5e3, vc = 403, Zs = "/api/repeated-lines", yc = 10, bc = 2e3, wc = 3e5, f4 = 6e5, bn = 6, kc = 500, $c = "/journal/summary", Xs = "/api/server-state", xc = 2e4, wn = cl ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Mc = (e) => e.split("?")[0].endsWith($c), Ka = (e, t) => Object.assign(new Error(t), { status: e });
async function Sc(e, t, n = Ka) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const _c = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), Ec = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), Qs = (e) => e.split(" ").slice(0, 2).join(" "), Xe = "read", Tt = "write", Ac = "stream";
class Cc {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = bn;
  }
  // what is in flight, of one window or of all: each with its window, line, kind (read, write or stream), address and started_at
  inFlight(t = null) {
    return [...this.flights].filter((n) => t === null || n.window === t).map((n) => ({ ...n }));
  }
  // how many requests a window has sent, by noun and verb
  sentCounts(t) {
    return Object.fromEntries(this.lineCounts.get(t) ?? []);
  }
  requestCounts(t) {
    var s;
    const n = this.sentCounts(t), a = [...((s = this.joinCounts.get(t)) == null ? void 0 : s.values()) ?? []];
    return {
      http_requests: this.httpCounts.get(t) ?? 0,
      logical_commands: Object.entries(n).filter(([o]) => !o.startsWith("/")).reduce((o, [, l]) => o + l, 0),
      joined_callers: a.reduce((o, l) => o + l.joined_callers, 0),
      trailing_reads: a.reduce((o, l) => o + l.trailing_reads, 0),
      by_command: n
    };
  }
  requestTotals() {
    const t = [...this.lineCounts.keys()].map((n) => this.requestCounts(n));
    return {
      http_requests: this.httpRequests,
      logical_commands: t.reduce((n, a) => n + a.logical_commands, 0),
      joined_callers: t.reduce((n, a) => n + a.joined_callers, 0),
      trailing_reads: t.reduce((n, a) => n + a.trailing_reads, 0)
    };
  }
  took(t, n) {
    /\/api\/lines?$/.test(n) && (this.httpRequests += 1, new Set(t.map((o) => o.window)).forEach((o) => this.httpCounts.set(o, (this.httpCounts.get(o) ?? 0) + 1)));
    const a = Date.now(), s = t.map((o) => ({ ...o, url: n, started_at: a }));
    return s.forEach((o) => {
      this.flights.add(o), this.counted(o);
    }), () => s.forEach((o) => this.flights.delete(o));
  }
  counted({ window: t, line: n }) {
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = Qs(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one noun and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, i]) => o - i < bc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < yc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const r = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(Zs, { method: "POST", headers: { ...wn, "Content-Type": "application/json" }, body: r }, [{ window: st, line: Zs, kind: Tt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Xi(n ? ul : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: Ec(n.signal, s) } : n;
    try {
      return await fetch(t, a[0].kind === Tt ? { ...l, priority: "high" } : l);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up
  async sent(t, n, a, s = yn) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      throw o instanceof TypeError && fc(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= pc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
    try {
      return await t();
    } finally {
      const n = this.readsWaiting.shift();
      n ? n() : this.readsFlying -= 1;
    }
  }
  // whether a line only reads, as the server knows its command: a line the server has not called a read is a write, which is never joined
  async isRead(t) {
    return this.readLines ?? (this.readLines = this.answeredReadLines()), this.knownReads = await this.readLines, this.knownReads.has(t.slice(0, 2).join(" "));
  }
  // the same, at once and without asking: a line is taken for a write until the server's list of reads has come
  knownRead(t) {
    var n;
    return !!((n = this.knownReads) != null && n.has(t.slice(0, 2).join(" ")));
  }
  answeredReadLines() {
    return this.out(Js, { headers: wn }, [{ window: st, line: Js, kind: Xe }], gc).then(async (t) => {
      if (t.status === vc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw Ka(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new mc(
      (l, r) => n(l, s ? this.readAttribution(r) : void 0),
      () => this.joinedReads.delete(t),
      (l, r) => {
        s && this.trackRead(s, l, r);
      }
    );
    return this.joinedReads.set(t, o), o.asked(a);
  }
  readAttribution(t) {
    return {
      client_id: this.clientId,
      command_id: t.id,
      joined_callers: t.callers - 1,
      followed_command_id: t.trailingOf,
      complete: !1
    };
  }
  trackRead({ window: t, line: n }, a, s) {
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = Qs(n.join(" ")), r = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
    a === "asked" && s.callers > 1 && (r.joined_callers += 1), a === "sent" && s.trailingOf && (r.trailing_reads += 1), o.set(l, r), this.joinCounts.set(t, o), !(a !== "answered" || !this.recording) && (this.readReceipts.push(this.readAttribution(s)), this.receiptTimer ?? (this.receiptTimer = setTimeout(() => this.flushReadReceipts(), 50)));
  }
  flushReadReceipts() {
    clearTimeout(this.receiptTimer), this.receiptTimer = null;
    const t = this.readReceipts;
    return this.readReceipts = [], t.length ? (this.receiptSending = this.receiptSending.then(async () => {
      try {
        (await this.raw("/api/read-receipts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ receipts: t })
        })).ok || (this.receiptFailures += t.length);
      } catch {
        this.receiptFailures += t.length;
      }
    }), this.receiptSending) : this.receiptSending;
  }
  // an event has come: a read in flight may be older than it, so whoever asks that read from now on gets one that runs after it
  readsOutdated() {
    this.joinedReads.forEach((t) => t.heardEvent());
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = bn;
    }
  }
  watch(t) {
    this.watcher = t;
  }
  onWrite(t) {
    this.written = t;
  }
  onBlocked(t) {
    this.refused = t;
  }
  async reach(t, n, a, s, o, l = {}) {
    const r = a instanceof FormData, i = { method: t, headers: { ...wn, ...l, ...a === void 0 || r ? {} : { "Content-Type": "application/json" } }, body: _c(a) }, d = s || (r ? wc : yn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, i, [{ window: st, line: n, kind: Xe }], d)) : await this.sent(n, i, [{ window: st, line: n, kind: Tt }], d);
    } catch (u) {
      if (t !== "GET" || !(u instanceof TypeError) || o <= 1) throw u;
      return await new Promise((f) => setTimeout(f, kc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = bn, l = {}) {
    this.watcher("sent", t, n, a);
    const r = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return Sc(r, `${r.status} ${r.statusText}`).catch((i) => {
      throw i.blocked && t !== "GET" && this.refused(i.message), i;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: st, line: t, kind: Xe }], yn)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: wn });
    if (!n.ok) throw Ka(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, bn, o).then((r) => (this.written(n), r)) : vs() && !Mc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: st, line: t, kind: Ac }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Xs, { cache: "no-store" }, [{ window: st, line: Xs, kind: Xe }], xc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = st, line: s = t, limit: o = yn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? Xe : Tt;
    return l === Tt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const fa = Symbol.for("journal.transport"), Me = globalThis[fa] ?? (globalThis[fa] = new Cc());
class Oc {
  constructor() {
    this.following = Ke([]), this.held = /* @__PURE__ */ new Set();
  }
  follow(t, n, a, s = () => !0) {
    const o = { window: t, patterns: n, heard: a, visible: s };
    return this.following.value = [...this.follows, o], () => this.following.value = this.follows.filter((l) => l !== o);
  }
  get follows() {
    return this.following.value;
  }
  get patterns() {
    return [...new Set(this.follows.flatMap((t) => t.patterns))].sort();
  }
  count(t) {
    return this.follows.filter((n) => n.window === t).length;
  }
  stopAll(t) {
    this.following.value = this.follows.filter((n) => n.window !== t), this.held = new Set([...this.held].filter((n) => n.window !== t));
  }
  dispatch(t) {
    Me.readsOutdated();
    for (const n of this.follows)
      n.patterns.some((a) => ys(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function ys(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const Tc = 50, Rc = "refresh", Ic = 1e3, Bc = 3e4, Lc = "requested", Nc = "after_window", Dc = 50, kn = ".*", jc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function Pc(e) {
  const t = {}, n = Zn({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, r = /* @__PURE__ */ new Set();
  let i = {}, d = 0, u = 0, f = !1;
  function m(w) {
    const b = () => i[w] ?? i[`${w.slice(0, w.lastIndexOf("."))}.*`] ?? {}, k = I(void 0), p = il(e, async (x) => {
      const M = await A(w, x);
      return M.ok && !Object.keys(x).length && (k.value = M.value), M;
    }, () => b().page_size || Dc, () => !!b().page_size, () => !!b().reads_ids);
    return t[w] = { ...p, data: k, readAt: 0 };
  }
  const v = new Proxy({}, { get: (w, b) => typeof b != "string" || b.startsWith("__v") ? void 0 : t[b] ?? m(b) }), y = (w) => (i[w].loading !== Lc || w.endsWith(kn)) && (!i[w].tab || i[w].tab === n.tab);
  function A(w, b = {}) {
    return new Promise((k) => {
      a.push({ name: w, flags: b, resolve: k }), a.length === 1 && setTimeout(R);
    });
  }
  async function R() {
    const w = /* @__PURE__ */ new Map(), b = a.splice(0).filter((x) => {
      const M = JSON.stringify(x.flags);
      return w.has(x.name) || w.set(x.name, M), w.get(x.name) === M ? !0 : (a.push(x), !1);
    });
    a.length && setTimeout(R);
    const k = Object.fromEntries(b.flatMap(({ name: x, flags: M }) => Object.entries(M).map(([C, P]) => [`${x}.${C}`, P]))), p = await e.readKeys({ only: [...new Set(b.map(({ name: x }) => x))], state: { ...n, ...k } });
    b.forEach(({ name: x, resolve: M }) => M(p.ok ? p.value.keys[x] : p));
  }
  async function S(w) {
    var x;
    const b = ++u;
    (w.length ? w : Object.keys(i).filter((M) => !M.endsWith(kn) && i[M].loading === "first" && y(M))).forEach((M) => l[M] = b);
    const p = await e.readKeys({ only: w, state: { ...n } });
    if (!p.ok) {
      if (p.failure === "cancelled") return !1;
      const M = (w.length ? w : Object.keys(t)).filter((P) => (l[P] ?? 0) <= b);
      M.forEach((P) => {
        v[P].readAt = Date.now(), p.failure === "unreachable" ? r.add(P) : r.delete(P), v[P].showFirst(p);
      });
      const C = p.failure === "unreachable" && ((x = e.waitForServer) == null ? void 0 : x.call(e));
      return C && C.then(() => {
        if (f) return;
        const P = M.filter((Z) => l[Z] === b);
        (P.length || !w.length && !M.length && u === b) && S(P);
      }), !1;
    }
    return E(p.value.declared), Object.entries(p.value.keys).forEach(([M, C]) => {
      (l[M] ?? 0) > b || (l[M] = b, v[M].readAt = Date.now(), r.delete(M), C.ok && (v[M].data.value = C.value), v[M].showFirst(C));
    }), !0;
  }
  function D(w) {
    const b = jc(w);
    return b.length ? (b.forEach((k) => o.names.add(k)), o.answer ?? (o.answer = new Promise((k) => setTimeout(() => {
      const p = [...o.names];
      o.names.clear(), o.answer = null, k(S(p));
    })))) : S([]);
  }
  function U(w) {
    w.forEach((b) => s.add(b)), clearTimeout(d), d = setTimeout(() => {
      const b = [...s];
      s.clear(), b.length && S(b);
    }, Tc);
  }
  const N = (w) => w.endsWith(kn) ? Object.keys(t).filter((b) => b.startsWith(w.slice(0, -1)) && t[b].readAt) : [w], B = (w) => (i[w] ?? i[`${w.split(".")[0]}.*`]).reload_seconds;
  function F(w) {
    const b = Object.keys(i).filter((p) => w.event === Rc || i[p].events.some((x) => ys(x, w.event)));
    b.filter((p) => i[p].page_size).forEach((p) => v[p].heard(w));
    const k = b.filter((p) => !i[p].page_size);
    k.filter((p) => !y(p)).forEach((p) => v[p].readAt = 0), U(k.filter(y).flatMap(N));
  }
  function E(w) {
    if (Object.keys(i).length) return;
    i = w;
    const b = [...new Set(Object.values(w).flatMap((p) => p.events))];
    b.length && e.follow(b, F);
    const k = Object.keys(w).filter((p) => w[p].loading === Nc);
    k.length && S(k);
  }
  he(() => n.tab, () => {
    const w = Object.keys(i).filter((b) => !b.endsWith(kn) && y(b) && !v[b].readAt);
    w.length && S(w);
  }), Be(() => {
    f = !0, clearTimeout(d);
  });
  function _() {
    const w = Date.now(), b = Object.keys(i).filter((k) => i[k].reload_seconds > 0 && y(k)).flatMap(N).filter((k) => w - v[k].readAt >= (r.has(k) ? Math.min(B(k) * 1e3, Bc) : B(k) * 1e3));
    b.length && U(b);
  }
  return gs(_, () => e.visible.value, Ic), queueMicrotask(() => S([])), { props: v, state: n, reload: D, readKey: A };
}
const qc = Symbol("open-view"), Ne = Symbol.for("journal.window-context"), vl = Symbol("dock-card");
function Fc(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = Pc(e));
  return Object.defineProperties(e, {
    props: { get: () => n().props },
    state: { get: () => n().state },
    reload: { value: (a) => n().reload(a) },
    readKey: { value: (a, s) => n().readKey(a, s) }
  });
}
function We() {
  const e = Oe(Ne, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return Fc(e);
}
const Wc = (e, t) => e(vl, t), h4 = () => Oe(vl), Hc = ["data-icon", "stroke-width", "innerHTML"], ye = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const t = e, n = { right: 0, down: 90, left: 180, up: 270 }, a = {
      mail: "inbox",
      circle: "todos",
      play: "work",
      flag: "plan",
      file: "docs",
      report: "reports",
      pin: "pins",
      list: "rules",
      clock: "reminders",
      help: "questions",
      bubble: "inbox",
      wrench: "tools",
      brush: "style",
      band: "rules",
      smile: "smile",
      bot: "agents",
      panel: "activity",
      x: "close",
      check: "todos",
      clip: "paperclip",
      send: "arrow",
      more: "dots",
      chevron: "arrow"
    }, s = {
      time: '<circle cx="8" cy="8" r="5.5"/><path d="M8 4.5V8l2.4 1.5"/>',
      allowance: '<path d="M3 4.5h10v7H3zM5 6.5h1M10 9.5h1"/><circle cx="8" cy="8" r="1.4"/>',
      phone: '<rect x="4.5" y="1.5" width="7" height="13" rx="1.6"/><path d="M7 12.2h2"/>',
      key: '<circle cx="5.5" cy="10.5" r="2.8"/><path d="M7.5 8.5 13 3M10.8 5.2l1.7 1.7M9.2 6.8l1.2 1.2"/>',
      terminal: '<path d="M2 3.5h12v9H2zM4.8 6.4 6.9 8l-2.1 1.6M8.4 10h3"/>',
      trash: '<path d="M3 4.5h10M6.4 4.5V3h3.2v1.5M4.4 4.5l.7 8.5h5.8l.7-8.5"/>',
      chat: '<path d="M2.5 3h11v7.5H8L5 13v-2.5H2.5z"/>',
      edits: '<path d="M8 3v6M5 6h6M5 12.5h6"/>',
      gauge: '<path d="M2.6 11.5a5.4 5.4 0 1 1 10.8 0"/><path d="M8 11.5 10.4 7.4"/><circle cx="8" cy="11.5" r=".6" fill="currentColor"/>',
      hook: '<path d="M8 2v7.6a2.9 2.9 0 1 1-2.9-2.9"/><circle cx="8" cy="2.6" r=".7" fill="currentColor"/>',
      request: '<path d="M3 5.2h9.4M10 2.9l2.4 2.3L10 7.5"/><path d="M13 10.8H3.6M6 8.5l-2.4 2.3L6 13.1"/>',
      heart: '<path d="M8 13.2 3.2 8.4a2.9 2.9 0 0 1 4.1-4.1L8 5l.7-.7a2.9 2.9 0 0 1 4.1 4.1z"/>',
      weight: '<path d="M2.5 13.5h11l-1.6-7.5H4.1zM6 6a2 2 0 1 1 4 0"/>',
      points: '<path d="M3 13.2V8.6M6.7 13.2V5.4M10.4 13.2V9.8M14 13.2V2.8" stroke-linecap="round"/>',
      bolt: '<path d="M9.2 2 4.2 8.8h3.6L6.8 14l5-6.8H8.2z"/>',
      bulb: '<path d="M5.4 9.9a4.3 4.3 0 1 1 5.2 0c-.45.35-.7.85-.7 1.4v.2H6.1v-.2c0-.55-.25-1.05-.7-1.4Z"/><path d="M6.3 13.5h3.4"/>',
      todos: '<circle cx="8" cy="8" r="5.75"/><path d="M5.6 8.1l1.7 1.7 3.2-3.5"/>',
      task: '<rect x="3.5" y="2.5" width="9" height="11.5" rx="1.4"/><path d="M6.2 2.5V1.6h3.6v.9M5.8 6.4h4.4M5.8 8.9h4.4M5.8 11.4h2.6"/>',
      pins: '<path d="M8 14V9.5M5 2.5h6M6 2.5v3.5L4 9.5h8L10 6V2.5"/>',
      style: '<path d="M5.5 4.5 2.5 8l3 3.5M10.5 4.5l3 3.5-3 3.5M9 3.5l-2 9"/>',
      warn: '<path d="M8 2.6 14 13H2zM8 6.6v3.2M8 11.6v.1"/>',
      book: '<path d="M8 4.4c-1.7-1.2-3.8-1.5-6-.9v9c2.2-.6 4.3-.3 6 .9 1.7-1.2 3.8-1.5 6-.9v-9c-2.2-.6-4.3-.3-6 .9Z"/><path d="M8 4.4v9"/>',
      auto: '<path d="M5 3.4 12.4 8 5 12.6z" fill="currentColor" stroke-width="1"/>',
      branch: '<circle cx="5" cy="3.6" r="1.6"/><circle cx="5" cy="12.4" r="1.6"/><circle cx="11.6" cy="5.4" r="1.6"/><path d="M5 5.2v5.6M11.6 7v.6a3.6 3.6 0 0 1-3.6 3.6H6.6"/>',
      scheme: '<circle cx="8" cy="8" r="5.75"/><path d="M8 2.25a5.75 5.75 0 0 1 0 11.5z" fill="currentColor" stroke="none"/>',
      wide: '<path d="M6.2 2.6H2.6v3.6M9.8 2.6h3.6v3.6M6.2 13.4H2.6V9.8M9.8 13.4h3.6V9.8"/>',
      narrow: '<path d="M2.6 6.2h3.6V2.6M13.4 6.2H9.8V2.6M2.6 9.8h3.6v3.6M13.4 9.8H9.8v3.6"/>',
      up: '<path d="M8 12.5V4M4.5 7.5L8 4l3.5 3.5"/>',
      down: '<path d="M8 3.5V12M4.5 8.5L8 12l3.5-3.5"/>',
      board: '<rect x="1.8" y="2.5" width="12.4" height="11" rx="2"/><rect x="3.6" y="4.4" width="2.4" height="4" rx=".5" fill="currentColor" stroke="none"/><rect x="3.6" y="9.4" width="2.4" height="2.2" rx=".5" fill="currentColor" stroke="none"/><rect x="6.8" y="4.4" width="2.4" height="5.6" rx=".5" fill="currentColor" stroke="none"/><rect x="10" y="4.4" width="2.4" height="2.4" rx=".5" fill="currentColor" stroke="none"/><rect x="10" y="7.8" width="2.4" height="3.2" rx=".5" fill="currentColor" stroke="none"/>',
      ticket: '<path d="M2.5 4.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v1.75a1.75 1.75 0 0 0 0 3.5v1.75a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V9.75a1.75 1.75 0 0 0 0-3.5z"/><path d="M6.5 5v1M6.5 7.5v1M6.5 10v1"/>',
      download: '<path d="M8 2.5v7.5M5 7l3 3 3-3"/><path d="M3 11v2h10v-2"/>',
      upload: '<path d="M8 10V2.5M5 5.5l3-3 3 3"/><path d="M3 11v2h10v-2"/>',
      open: '<path d="M9 3.5h3.5V7"/><path d="M12.5 3.5L7.5 8.5"/><path d="M11 9.5v3H3.5V5h3"/>',
      sidepanel: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9.5 3v10"/>',
      columns: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M8 3v10"/>',
      rows: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M2.5 8h11"/>',
      tab: '<path d="M2.5 5.5h11V13h-11zM2.5 5.5V3h5v2.5"/>',
      float: '<rect x="5.5" y="5.5" width="8" height="7.5" rx="1"/><path d="M2.5 10.5V3h8"/>',
      minimize: '<path d="M4 8h8"/>',
      chapters: '<path d="M2.5 4h6M2.5 8h11M2.5 12h8"/><path d="M11 2.2v3.6l1.2-.9 1.2.9V2.2"/>',
      reply: '<path d="M6.5 4.2 3 7.6l3.5 3.4"/><path d="M3.4 7.6h5.4a4 4 0 0 1 4 4v1.2"/>',
      copy: '<rect x="5.5" y="5.5" width="8" height="8" rx="1.6"/><path d="M10.5 3.8V3.6A1.6 1.6 0 0 0 8.9 2H4.1A1.6 1.6 0 0 0 2.5 3.6v4.8A1.6 1.6 0 0 0 4.1 10h.2"/>',
      broadcast: '<circle cx="8" cy="8" r="1.3"/><path d="M5.4 5.2a4 4 0 0 0 0 5.6"/><path d="M10.6 5.2a4 4 0 0 1 0 5.6"/><path d="M3.2 2.9a7 7 0 0 0 0 10.2"/><path d="M12.8 2.9a7 7 0 0 1 0 10.2"/>',
      artboard: '<path d="M5 2.5v11M11 2.5v11M2.5 5h11M2.5 11h11"/>',
      webpage: '<rect x="2.5" y="3" width="11" height="10" rx="1.6"/><path d="M2.5 5.8h11M5 8.6h6M5 10.6h3.6"/>',
      pull: '<circle cx="4.5" cy="3.8" r="1.5"/><circle cx="4.5" cy="12.2" r="1.5"/><circle cx="11.5" cy="12.2" r="1.5"/><path d="M4.5 5.3v5.4M11.5 10.7V7.2a2.2 2.2 0 0 0-2.2-2.2H7.4M8.8 3.4 7.2 5l1.6 1.6"/>',
      window: '<rect x="3.5" y="3.5" width="9" height="9" rx="1.5"/>',
      dock: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M8 5.5V10M5.8 7.8 8 10l2.2-2.2"/>',
      restore: '<path d="M3 8a5 5 0 1 0 1.5-3.55"/><path d="M3 2.75V5h2.25"/>',
      caret: '<path d="M5 6.5l3 3 3-3"/>',
      share: '<path d="M5.5 6H4.5A1.5 1.5 0 0 0 3 7.5v5A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 6h-1"/><path d="M8 9.5V2M5.75 4.25L8 2l2.25 2.25"/>',
      floppy: '<path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h6.4L13 5.1v6.4a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5z"/><path d="M5.5 3v3h4.5V3"/><rect x="5" y="8.5" width="6" height="4.5" rx="0.6"/>',
      saveinto: '<path d="M5.5 3H4a1.5 1.5 0 0 0-1.5 1.5v7A1.5 1.5 0 0 0 4 13h8a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 12 3h-1.5"/><path d="M8 1.75v6.5M5.75 6l2.25 2.25L10.25 6"/><path d="M5 10.75h6"/>',
      tiles: '<rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="9" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="2.5" y="9" width="4.5" height="4.5" rx="1"/><rect x="9" y="9" width="4.5" height="4.5" rx="1"/>',
      palette: '<path d="M8 2.5a5.5 5.5 0 1 0 0 11c.8 0 1.2-.5 1.2-1.1 0-.9-.8-1.2-.8-2 0-.6.5-1 1.1-1h1.6a2.4 2.4 0 0 0 2.4-2.4C13.5 4.6 11.1 2.5 8 2.5z"/><circle cx="5.3" cy="7.2" r=".6"/><circle cx="7.4" cy="5.1" r=".6"/><circle cx="10.2" cy="5.4" r=".6"/>',
      pause: '<path d="M5.8 4v8M10.2 4v8"/>',
      stop: '<path d="M4.5 4.5h7v7h-7z"/>',
      phone: '<rect x="4.5" y="1.5" width="7" height="13" rx="1.6"/><path d="M7 12.2h2"/>',
      resume: '<path d="M5.5 3.8v8.4L12.2 8z"/>',
      tick: '<path d="M3.8 8.3l2.6 2.6 5.8-6.1"/>',
      ring: '<circle cx="8" cy="8" r="5.25" stroke-width="2"/>',
      checkbox: '<rect x="2.75" y="2.75" width="10.5" height="10.5" rx="2.5"/><path d="M5.4 8.1l1.8 1.8 3.5-3.7"/>',
      layout: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9 3v10M9 8h4.5"/>',
      info: '<circle cx="8" cy="8" r="5.75"/><path d="M8 7.3v3.4"/><path d="M8 5.1v.1"/>',
      bell: '<path d="M4.5 11V7.5a3.5 3.5 0 0 1 7 0V11l1 1.5h-9z"/><path d="M6.8 13.5a1.3 1.3 0 0 0 2.4 0"/>',
      activity: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9.5 3v10M11 6h1M11 8.5h1"/>',
      arrow: '<path d="M3.5 8h9M9 4.5L12.5 8 9 11.5"/>',
      chevronRight: '<path d="M6 3 11 8 6 13"/>',
      back: '<path d="M12.5 8h-9M7 4.5L3.5 8 7 11.5"/>',
      paperclip: '<path d="M10.5 5.5l-4.3 4.3a1.3 1.3 0 0 0 1.8 1.8l4.6-4.6a2.6 2.6 0 0 0-3.7-3.7L4.3 8a3.9 3.9 0 0 0 5.5 5.5l3.7-3.7"/>',
      crosshair: '<circle cx="8" cy="8" r="4.2"/><path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3"/>',
      camera: '<path d="M2 5.5h2.6l1.2-1.8h4.4l1.2 1.8H14v7.5H2z"/><circle cx="8" cy="9" r="2.3"/>',
      wheel: '<circle cx="8" cy="8" r="5.6"/><circle cx="8" cy="8" r="1.6"/><path d="M8 2.4v4M8 9.6v4M2.4 8h4M9.6 8h4"/>',
      model: '<path d="M8 2.2c.5 2.9 2 4.4 4.9 4.9-2.9.5-4.4 2-4.9 4.9-.5-2.9-2-4.4-4.9-4.9 2.9-.5 4.4-2 4.9-4.9z"/><path d="M12.6 10.6c.2 1.1.8 1.7 1.9 1.9-1.1.2-1.7.8-1.9 1.9-.2-1.1-.8-1.7-1.9-1.9 1.1-.2 1.7-.8 1.9-1.9z"/>',
      agents: '<circle cx="6" cy="5.5" r="2"/><path d="M2.5 13a3.5 3.5 0 0 1 7 0"/><path d="M10.5 3.8a2 2 0 0 1 0 3.4"/><path d="M11.5 9.8a3.5 3.5 0 0 1 2 3.2"/>',
      reviewer: '<circle cx="7" cy="7" r="4.6"/><path d="M10.4 10.4 14 14"/><path d="M5 7.1l1.4 1.4 2.6-2.8"/>',
      verifier: '<path d="M8 1.8v1.4"/><path d="M5.5 3.2h5"/><path d="M5 4.6h6v7.4H5z"/><path d="M4.5 13.6h7"/><path d="M8 6.9c.9.9 1.2 1.6 1.2 2.3a1.2 1.2 0 0 1-2.4 0c0-.7.3-1.4 1.2-2.3z"/>',
      reports: '<path d="M4 2.5h5.5L12 5v8.5H4z"/><path d="M6.5 8h3M6.5 10.5h3"/>',
      work: '<circle cx="8" cy="8" r="5.5"/><path d="M8 5v3l2 1.5"/>',
      reminders: '<path d="M13 8a5 5 0 1 1-1.5-3.55"/><path d="M13 2.75V5h-2.25"/><path d="M8 5.5V8l1.75 1.25"/>',
      pencil: '<path d="M10.6 2.8l2.6 2.6-7.4 7.4-3.3.7.7-3.3z"/><path d="M9.2 4.2l2.6 2.6"/>',
      revisions: '<path d="M5.2 4.4h7v9.8h-7z"/><path d="M3.4 11.8V2.2h6.4"/><path d="M7 7.4h3.4M7 10h3.4"/>',
      docs: '<path d="M4 1.8h5.5L12.5 5v9.2H4V1.8Z"/><path d="M9.5 1.8V5h3"/>',
      rules: '<path d="M3 3.5h10M3 8h10M3 12.5h6"/>',
      folder: '<path d="M2.5 3h4l1.5 1.5h5.5v8.5h-11V3Z"/>',
      inbox: '<path d="M2 9.5l1.8-6h8.4l1.8 6v3.5H2V9.5Z"/><path d="M2 9.5h3.5l1 1.5h3l1-1.5H14"/>',
      questions: '<circle cx="8" cy="8" r="5.5"/><path d="M6.4 6.3a1.7 1.7 0 0 1 3.2.7c0 1.2-1.6 1.4-1.6 2.5"/><circle cx="8" cy="11.4" r=".6" fill="currentColor" stroke="none"/>',
      home: '<path d="M2.5 7.5L8 2.75l5.5 4.75v6.25h-3.75v-4h-3.5v4H2.5V7.5Z"/>',
      close: '<path d="M4 4l8 8M12 4l-8 8"/>',
      plus: '<path d="M8 3.5v9M3.5 8h9"/>',
      minus: '<path d="M3.5 8h9"/>',
      power: '<path d="M8 2v6"/><path d="M4.5 4.2a5 5 0 1 0 7 0"/>',
      people: '<circle cx="6" cy="5.5" r="2.2"/><path d="M2.2 13c.4-2.2 1.9-3.5 3.8-3.5s3.4 1.3 3.8 3.5"/><circle cx="11.2" cy="6" r="1.8"/><path d="M11 9.6c1.6 0 2.8 1.1 3.1 3"/>',
      lock: '<rect x="3.5" y="7" width="9" height="6.5" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/>',
      plug: '<path d="M5.2 2.2v3.2M8.8 2.2v3.2M3.4 5.4h7.2v2.1a3.6 3.6 0 0 1-3.6 3.6 3.6 3.6 0 0 1-3.6-3.6Z"/><path d="M7 11.3v2.5"/>',
      tools: '<path d="M9.8 2.3a3 3 0 0 0-3.6 3.9L2.5 9.9a1.2 1.2 0 0 0 1.7 1.7l3.7-3.7a3 3 0 0 0 3.9-3.6L10 6 8.6 5.4 8 4l1.8-1.7Z"/>',
      plan: '<path d="M4 14V2.5M4 3h7.5l-1.5 2.75 1.5 2.75H4"/>',
      search: '<circle cx="7" cy="7" r="4.25"/><path d="M10.25 10.25L13.5 13.5"/>',
      settings: '<circle cx="8" cy="8" r="2"/><path d="M8 1.75v1.5M8 12.75v1.5M1.75 8h1.5M12.75 8h1.5M3.6 3.6l1.05 1.05M11.35 11.35l1.05 1.05M3.6 12.4l1.05-1.05M11.35 4.65l1.05-1.05"/>',
      smile: '<circle cx="8" cy="8" r="5.5"/><path d="M5.8 9.5c1.2 1.2 3.2 1.2 4.4 0M6.2 6.5h.01M9.8 6.5h.01"/>',
      dots: '<path d="M4 8h.01M8 8h.01M12 8h.01"/>',
      "dots-vertical": '<circle cx="8" cy="3.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none"/><circle cx="8" cy="12.5" r="1.3" fill="currentColor" stroke="none"/>',
      eye: '<path d="M1.9 8c1.5-2.6 3.5-3.9 6.1-3.9s4.6 1.3 6.1 3.9c-1.5 2.6-3.5 3.9-6.1 3.9S3.4 10.6 1.9 8Z"/><circle cx="8" cy="8" r="1.8"/>',
      dot: '<circle cx="8" cy="8" r="2.5"/>',
      start: '<path d="M5.5 3.8v8.4L12 8z" stroke-linejoin="round"/>',
      family: '<rect x="6" y="1.8" width="4" height="3.4" rx="1"/><rect x="1.8" y="10.8" width="4" height="3.4" rx="1"/><rect x="10.2" y="10.8" width="4" height="3.4" rx="1"/><path d="M8 5.2v2.6M3.8 10.8V9.4q0-1.6 1.6-1.6h5.2q1.6 0 1.6 1.6v1.4"/>',
      loop: '<path d="M12.6 6.2A4.9 4.9 0 0 0 3.4 6M3.4 9.8a4.9 4.9 0 0 0 9.2.2"/><path d="M12.8 3v3.3H9.5M3.2 13V9.7h3.3"/>'
    };
    return (o, l) => (c(), h("svg", {
      class: "ico",
      "data-icon": e.name,
      style: ge({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...t.facing === "right" ? {} : { transform: `rotate(${n[t.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: s[a[e.name] || e.name] || s.dot
    }, null, 12, Hc));
  }
}, Uc = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: ge({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, zc = /* @__PURE__ */ J(Uc, [["__scopeId", "data-v-eb453d6f"]]), Vc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "Btn",
  props: {
    variant: { type: String, default: "ghost" },
    small: Boolean,
    large: Boolean,
    busy: Boolean,
    disabled: Boolean,
    fill: Boolean,
    bordered: Boolean,
    href: { type: String, default: "" },
    icon: { type: String, default: "" }
  },
  setup(e) {
    const t = e, n = Xn(), a = T(() => Object.fromEntries(Object.entries(n).filter(([d]) => d !== "onClick"))), s = I(!1), o = T(() => t.busy || s.value), l = Oe(Ne, null), r = T(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function i(d) {
      const u = [n.onClick].flat().filter(Boolean).map((m) => m(d)).filter((m) => m instanceof Promise);
      if (!u.length) return;
      const f = setTimeout(() => s.value = !0, ul);
      try {
        await Promise.all(u);
      } finally {
        clearTimeout(f), s.value = !1;
      }
    }
    return (d, u) => (c(), H(ht(e.href ? "a" : "button"), Le(a.value, {
      type: e.href ? void 0 : q(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: r.value,
      onClick: i
    }), {
      default: j(() => [
        g("span", {
          class: X(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (c(), H(ye, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : O("", !0),
          de(d.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (c(), H(zc, {
          key: 0,
          class: "btn-spinner"
        })) : O("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ue = /* @__PURE__ */ J(Vc, [["__scopeId", "data-v-ededdadf"]]), Gc = ["aria-checked", "aria-haspopup", "onClick"], Kc = {
  key: 0,
  class: "segmented-dot"
}, Yc = {
  key: 1,
  class: "segmented-note"
}, Jc = {
  key: 2,
  class: "segmented-count"
}, Zc = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = fs();
    return (s, o) => {
      const l = di("tip");
      return c(), h("span", {
        class: X(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(V, null, te(e.options, (r) => Ye((c(), h("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: X(["segmented-option", { on: r.key === e.value }]),
          onClick: (i) => n("pick", r.key)
        }, [
          r.dot ? (c(), h("span", Kc)) : O("", !0),
          ee(" " + $(r.label) + " ", 1),
          r.note ? (c(), h("small", Yc, $(r.note), 1)) : O("", !0),
          r.count !== void 0 ? (c(), h("em", Jc, $(r.count), 1)) : O("", !0)
        ], 10, Gc)), [
          [l, r.tip || r.title, `${q(a)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Nt = /* @__PURE__ */ J(Zc, [["__scopeId", "data-v-c89bc92d"]]), Xc = {
  key: 0,
  class: "more-items"
}, Qc = {
  key: 0,
  role: "alert"
}, eu = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (c(), h("div", Xc, [
      e.failure ? (c(), h("p", Qc, $(e.failure), 1)) : O("", !0),
      e.more ? (c(), H(ue, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: j(() => [
          ee($(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : O("", !0)
    ])) : O("", !0);
  }
}, Qn = /* @__PURE__ */ J(eu, [["__scopeId", "data-v-10464014"]]), tu = { class: "link-group" }, nu = {
  class: "group-label",
  "data-link-kind": ""
}, au = ["disabled", "onClick"], su = { class: "title" }, ou = { class: "relations" }, lu = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(!1), o = T(() => s.value ? n.rows : n.rows.slice(0, 3)), l = T(() => `${n.model.replaceAll("_", " ").replace(/^./, (u) => u.toUpperCase())} ${n.count}`), r = (u) => u.endpoint.unavailable || !u.endpoint.open_ref, i = (u) => ({ [n.linkAttribute]: !0, "data-link-model": u.endpoint.model, "data-link-id": u.endpoint.id }), d = (u) => `${u.endpoint.model === "doc" && u.endpoint.id === n.documentId ? "Design document" : u.endpoint.model.replaceAll("_", " ").replace(/^./, (f) => f.toUpperCase())} ${u.endpoint.id}, ${u.relations.map((f) => f.replaceAll("_", " ")).join(", ")}`;
    return (u, f) => (c(), h("div", tu, [
      g("div", nu, $(l.value), 1),
      (c(!0), h(V, null, te(o.value, (m) => (c(), h("button", Le({
        key: `${m.endpoint.model}:${m.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, i(m), {
        disabled: r(m),
        onClick: (v) => a("open", m)
      }), [
        g("span", su, $(m.endpoint.title), 1),
        g("span", ou, [
          ee($(d(m)), 1),
          r(m) ? (c(), h(V, { key: 0 }, [
            ee(" · Unavailable")
          ], 64)) : O("", !0)
        ])
      ], 16, au))), 128)),
      e.rows.length > 3 && !s.value ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: f[0] || (f[0] = (m) => s.value = !0)
      }, "Show more")) : O("", !0)
    ]));
  }
}, ru = /* @__PURE__ */ J(lu, [["__scopeId", "data-v-be6f079c"]]), iu = ["data-loaded"], cu = { class: "rows" }, uu = ["disabled", "onClick"], du = { class: "title" }, fu = { class: "relations" }, hu = { key: 2 }, mu = {
  __name: "ResourceLinks",
  props: {
    model: { type: String, required: !0 },
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    documentId: { type: Number, default: 0 },
    pageSize: { type: Number, default: 10 },
    changes: { type: Number, default: 0 },
    outsidePlan: Boolean,
    grouped: Boolean,
    pinned: Boolean,
    onlyKinds: { type: Array, default: () => [] },
    linkAttribute: { type: String, default: "data-resource-link" },
    empty: { type: String, default: "" }
  },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I([]), o = I({}), l = I(0), r = I(""), i = I(null), d = I(!1), u = I("");
    let f = 0;
    const m = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, v = (_) => m[_] || `${_.replaceAll("_", " ").replace(/^./, (w) => w.toUpperCase())}s`, y = T(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((_, w) => _ + w, 0) },
      ...Object.entries(o.value).filter(([_]) => !n.onlyKinds.length || n.onlyKinds.includes(_)).map(([_, w]) => ({ key: _, label: v(_), count: w }))
    ]), A = T(() => {
      const _ = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((b) => b.endpoint.model))].map((b) => [b, s.value.filter((k) => k.endpoint.model === b).length])), w = { doc: 0, task: 1, message: 2 };
      return Object.entries(_).sort(([b], [k]) => (w[b] ?? 3) - (w[k] ?? 3)).map(([b, k]) => ({ model: b, count: k, rows: s.value.filter((p) => p.endpoint.model === b) }));
    }), R = (_) => _.endpoint.unavailable || !_.endpoint.open_ref, S = (_) => ({ [n.linkAttribute]: !0, "data-link-model": _.endpoint.model, "data-link-id": _.endpoint.id }), D = (_) => `${_.endpoint.model === "doc" && _.endpoint.id === n.documentId ? "Design document" : _.endpoint.model.replaceAll("_", " ").replace(/^./, (w) => w.toUpperCase())} ${_.endpoint.id}, ${_.relations.map((w) => w.replaceAll("_", " ")).join(", ")}`;
    async function U(_ = 1) {
      const w = ++f;
      d.value = !0, u.value = "";
      const b = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(_), "--page-size", String(n.pageSize)];
      n.outsidePlan && b.push("--outside-plan"), n.documentId && b.push("--first-counterpart", `doc:${n.documentId}`), r.value && b.push("--kind", r.value);
      try {
        const k = await n.read(b);
        if (w !== f) return;
        if (!k.ok) {
          u.value = k.error;
          return;
        }
        const p = k.value.counterparts ?? [], x = _ === 1 ? p : [...s.value, ...p];
        s.value = [...new Map(x.map((M) => [`${M.endpoint.model}:${M.endpoint.id}`, M])).values()], o.value = k.value.kinds ?? {}, l.value = k.value.total, i.value = k.value.next_page ?? null;
      } catch (k) {
        w === f && (u.value = k.message);
      } finally {
        w === f && (d.value = !1);
      }
    }
    function N(_) {
      if (R(_)) return;
      const [w, b] = _.endpoint.open_ref.split(":");
      a("open", { table: w, id: Number(b) });
    }
    function B(_) {
      r.value = _, U();
    }
    const F = () => !d.value && i.value && U(i.value), E = T(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return he(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], i.value = null, r.value = "", U();
    }, { immediate: !0 }), (_, w) => s.value.length || d.value || u.value || e.empty ? (c(), h("section", {
      key: 0,
      class: X(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      y.value.length > 2 ? (c(), H(Nt, {
        key: 0,
        options: y.value,
        value: r.value,
        wrap: "",
        onPick: B
      }, null, 8, ["options", "value"])) : O("", !0),
      g("div", cu, [
        e.grouped ? (c(!0), h(V, { key: 0 }, te(A.value, (b) => (c(), H(ru, {
          key: b.model,
          model: b.model,
          count: b.count,
          rows: b.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: N
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (c(!0), h(V, { key: 1 }, te(s.value, (b) => (c(), h("button", Le({
          key: `${b.endpoint.model}:${b.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, S(b), {
          disabled: R(b),
          onClick: (k) => N(b)
        }), [
          g("span", du, $(b.endpoint.title), 1),
          g("span", fu, [
            ee($(D(b)), 1),
            R(b) ? (c(), h(V, { key: 0 }, [
              ee(" · Unavailable")
            ], 64)) : O("", !0)
          ])
        ], 16, uu))), 128)),
        !s.value.length && !d.value && !u.value && e.empty ? (c(), h("p", hu, $(e.empty), 1)) : O("", !0),
        L(Qn, {
          more: !!i.value,
          loading: d.value,
          failure: u.value,
          label: E.value,
          onMore: F
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, iu)) : O("", !0);
  }
}, pu = /* @__PURE__ */ J(mu, [["__scopeId", "data-v-29b9c31b"]]), gu = (e, t, n) => Math.max(t, Math.min(n, e)), vu = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, yl = /* @__PURE__ */ new WeakMap(), yu = (e, t) => yl.set(e, t);
function bu(e, t) {
  for (let n = t; n; n = yl.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function bl(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !bu(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Be(() => window.removeEventListener("click", n));
}
const Ct = 8, wu = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "MenuPanel",
  props: {
    anchor: { type: Object, default: null },
    align: { type: String, default: "auto" },
    minWidth: { type: Number, default: 0 },
    maxWidth: { type: Number, default: 0 },
    maxHeight: { type: Number, default: 0 },
    gap: { type: Number, default: 4 },
    height: { type: Number, default: 0 },
    plain: Boolean
  },
  emits: ["close"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = I(null), o = (p) => p ? `${p}px` : void 0, l = T(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), r = I({ w: 0, h: 0 }), i = I(a.anchor ? a.anchor.getBoundingClientRect() : null), d = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), u = (p) => ({
      left: Math.max(0, p.left),
      top: Math.max(0, p.top),
      right: Math.min(window.innerWidth, p.right),
      bottom: Math.min(window.innerHeight, p.bottom)
    }), f = (p) => {
      const x = p.closest(".pane, .float-window");
      return x ? u(x.getBoundingClientRect()) : d();
    }, m = (p, x) => `${Math.max(0, p ? Math.min(p, x) : x)}px`;
    function v(p, x) {
      return {
        below: p.bottom - x.bottom - a.gap - Ct,
        above: x.top - p.top - a.gap - Ct,
        across: p.right - p.left - 2 * Ct
      };
    }
    function y(p) {
      const x = f(a.anchor), M = v(x, p);
      return r.value.w <= M.across && r.value.h <= Math.max(M.below, M.above) ? x : d();
    }
    const A = T(() => {
      if (!i.value) return l.value;
      const p = i.value, x = y(p), M = v(x, p), { w: C, h: P } = r.value, Z = a.align === "auto" ? p.left + p.right > x.left + x.right : a.align === "right", ne = gu(Z ? p.right - C : p.left, x.left + Ct, Math.max(x.left + Ct, x.right - C - Ct)), fe = P > M.below && M.above > M.below ? { bottom: `${window.innerHeight - p.top + a.gap}px`, maxHeight: m(a.maxHeight, M.above) } : { top: `${p.bottom + a.gap}px`, maxHeight: m(a.maxHeight, M.below) };
      return { ...l.value, ...fe, left: `${ne}px`, maxWidth: m(a.maxWidth, M.across) };
    }), R = n, S = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function D(p) {
      const x = S(), M = x.indexOf(document.activeElement);
      x[(M + p + x.length) % x.length].focus();
    }
    const U = { ArrowDown: () => D(1), ArrowUp: () => D(-1), Escape: () => R("close") }, N = (p) => U[p.key] && (p.preventDefault(), U[p.key]()), B = () => s.value && (r.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let F = 0;
    const E = new ResizeObserver(() => {
      cancelAnimationFrame(F), F = requestAnimationFrame(B);
    });
    bl(s, (p) => a.anchor && !a.anchor.contains(p.target) && R("close"));
    const _ = (p, x) => ["top", "left", "right", "bottom"].some((M) => Math.abs(p[M] - x[M]) > 1), w = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let b = 0;
    function k() {
      if (a.anchor) {
        const p = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || w(p)) return R("close");
        _(p, i.value) && (i.value = p);
      }
      b = requestAnimationFrame(k);
    }
    return Re(() => {
      a.anchor && s.value && yu(s.value, a.anchor), B(), s.value && E.observe(s.value), !a.plain && S()[0] && S()[0].focus(), k();
    }), Be(() => {
      E.disconnect(), cancelAnimationFrame(b), cancelAnimationFrame(F);
    }), t({ element: s }), (p, x) => (c(), H(hs, {
      to: "body",
      disabled: !e.anchor
    }, [
      g("div", Le({
        ref_key: "panel",
        ref: s
      }, p.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: A.value,
        onKeydown: N
      }), [
        de(p.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ea = /* @__PURE__ */ J(wu, [["__scopeId", "data-v-3d203970"]]), ku = { class: "split-button" }, $u = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = I(null), s = I(!1), o = () => s.value = !1;
    return (l, r) => (c(), h("span", ku, [
      L(ue, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: r[0] || (r[0] = (i) => n("main"))
      }, {
        default: j(() => [
          de(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      g("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        L(ue, {
          variant: e.variant,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: r[1] || (r[1] = (i) => s.value = !s.value)
        }, {
          default: j(() => [
            L(ye, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (c(), H(ea, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: j(() => [
          de(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : O("", !0)
    ]));
  }
}, xu = /* @__PURE__ */ J($u, [["__scopeId", "data-v-c258494d"]]), Mu = 0, Su = "/api/lines", _u = "/api/line", eo = 5e3, to = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), no = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), ha = (e) => JSON.stringify(e.line), ao = () => new DOMException("cancelled", "AbortError");
class Eu {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(ha(t))) {
        Me.whenFree(() => this.readAlone(l));
        return;
      }
      this.waiting.push(l), this.sendSoon();
    });
  }
  // a write always finishes, also when its window has gone: it carries no signal
  write(t) {
    return new Promise((n, a) => this.alone({ body: t, resolve: n, reject: a }, Tt));
  }
  sendSoon() {
    this.timer ?? (this.timer = setTimeout(() => Me.whenFree(() => this.send()), Mu));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(ao())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(ao()), n.abort();
    });
    t.forEach((o, l) => {
      var r;
      return (r = o.signal) == null ? void 0 : r.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Me.sent(Su, to({ lines: t.map((r) => r.body) }, n.signal), t.map((r) => no(r.body, Xe)), eo);
      if (!o.ok) throw new Error(`the journal answered ${o.status} to a batch of lines`);
      const { answers: l } = await o.json();
      t.forEach((r, i) => r.resolve(l[i]));
    } catch (o) {
      n.signal.aborted ? (this.waiting.push(...a), a.size && this.sendSoon()) : o.name === "TimeoutError" ? t.forEach((l) => Me.whenFree(() => this.readAlone(l))) : t.forEach((l) => l.reject(o));
    } finally {
      t.forEach((o, l) => {
        var r;
        return (r = o.signal) == null ? void 0 : r.removeEventListener("abort", s[l]);
      });
    }
  }
  async readAlone(t) {
    const n = Date.now();
    await this.alone(t, Xe), Date.now() - n < eo ? this.slow.delete(ha(t.body)) : this.slow.add(ha(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Me.sent(_u, to(t.body, t.signal), [no(t.body, n)], n === Xe ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const wl = new Eu(), Au = "/api/window";
function Cu(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${Au}?${o}`, r = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, i = (d) => Me.whenFree(async () => {
    const u = await Me.sent(l, { signal: d, headers: r }, [{ window: e, line: l, kind: Xe }]);
    if (!u.ok) throw new Error((await u.json()).error);
    return u.json();
  });
  return Me.joined(`${e} ${n.join(",")} ${o}`, i, s);
}
const kl = /* @__PURE__ */ new Map();
class Ou {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = Ke({ buttons: [], missing: {} }), this.loading = Ke(!1), this.loaded = Ke(!1), this.failed = Ke(""), this.pending = null;
  }
  load() {
    return this.pending ? this.pending : (this.loading.value = !0, this.pending = this.read().then((t) => (this.offers.value = t, this.loaded.value = !0, this.failed.value = "", t)).catch((t) => {
      throw this.failed.value = t.message, t;
    }).finally(() => {
      this.pending = null, this.loading.value = !1;
    }), this.pending);
  }
  async read() {
    const t = await Me.raw(`/api/buttons?environment=${encodeURIComponent(this.environment)}`);
    if (t.status === 403) return { buttons: [], missing: {} };
    const n = await t.json();
    if (!t.ok) throw new Error(n.error || "Buttons could not be loaded.");
    return n;
  }
  heard(t) {
    var s;
    const n = (s = t.data) == null ? void 0 : s.key, a = t.event.startsWith("setting.") && (!n || n.includes("suite"));
    return t.event === "registry.sync" || a ? this.load() : Promise.resolve();
  }
  async allowed(t) {
    var s;
    await this.load();
    const n = this.offers.value.missing[t];
    return n != null && n.length ? await this.prompts.ask(t, {
      window: `button:${t}`,
      reads_missing: "",
      runs_missing: n.map(({ label: o, line: l }) => `${o}: ${l}`).join(", ")
    }) ? (await this.load(), !((s = this.offers.value.missing[t]) != null && s.length)) : !1 : !0;
  }
}
function m4(e, t) {
  const n = new Ou(e, t);
  return kl.set(e, n), n.load().catch(() => {
  }), n;
}
const bs = (e) => kl.get(e);
function Tu(e, t, n) {
  const a = bs(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function Ru(e, t) {
  if (!e) return !0;
  const n = bs(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Iu = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let $l = {};
async function p4(e = (t) => Me.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && ($l = (await t.json()).states);
}
const ws = (e, t) => {
  var n;
  return (n = $l[e]) == null ? void 0 : n[t];
}, xl = (e, t) => {
  var n;
  return ((n = ws(e, t)) == null ? void 0 : n.label) ?? Iu(t);
}, Ml = (e, t) => {
  var n;
  return ((n = ws(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, Bu = (e, t) => {
  var n;
  return ((n = ws(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, Lu = Symbol("pane-page"), Nu = Symbol("inspector-host"), Sl = { 1: "refused", 2: "usage", 3: "fault" }, Du = 100, ju = 50, Pu = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, qu = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function Fu({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: r, options: i = I({}), declared: d = [], page: u = null, setOption: f = () => {
}, autoScroll: m = "", tabs: v = [], sources: y = [], links: A = {}, search: R = {}, readOnly: S = !1, shared: D = null }) {
  const U = /* @__PURE__ */ new Map(), N = new AbortController(), B = I(!1), F = performance.now();
  let E = 0, _ = 0, w = () => {
  };
  const b = new Promise((P) => w = P);
  N.signal.addEventListener("abort", w, { once: !0 });
  const k = () => {
    clearTimeout(_), _ = setTimeout(() => {
      E === 0 && ps(F, () => {
        B.value = !0, w();
      });
    }, ju);
  }, p = (P, Z) => (E += 1, Rt(e, P, t, N.signal, Z).finally(() => {
    E -= 1, k();
  })), x = (P, Z) => (k(), b.then(() => N.signal.aborted ? nt : Rt(e, P, t, N.signal, Z))), M = ({ only: P = [], state: Z = {} } = {}) => (E += 1, Hu(() => Cu(e, t, P, Z, N.signal), N.signal).finally(() => {
    E -= 1, k();
  })), C = (P, { unbatched: Z = !1, deferred: ne = !1 } = {}) => {
    const ie = U.get(P);
    if (ie && performance.now() - ie.at < Du) return ie.answer;
    const fe = ne && !B.value ? x(P, Z) : p(P, Z);
    return U.set(P, { answer: fe, at: performance.now() }), fe;
  };
  return {
    answered: B,
    settle: k,
    window: e,
    environment: t,
    agent: n,
    page: u,
    visible: T(() => a()),
    permissions: s,
    autoScroll: m,
    tabs: v,
    sources: y,
    links: A,
    search: R,
    readOnly: S,
    shared: D,
    read: C,
    readKeys: M,
    waitForServer: () => vs() ? pl() : null,
    run: (P) => Rt(e, P, t, N.signal),
    upload: (P) => zu(P, e, N.signal),
    cancel: () => N.abort(),
    signal: N.signal,
    subscriptions: l,
    follow: (P, Z) => l.follow(e, [P].flat().filter((ne) => o.some((ie) => ys(ie, ne))), (ne) => {
      U.clear(), Z(ne);
    }, a),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (P) => T(() => {
      var Z;
      return i.value[P] ?? ((Z = d.find((ne) => ne.key === P)) == null ? void 0 : Z.default);
    }),
    setting: async (P, Z) => {
      const ne = await C(`window setting ${e} ${P}`);
      return ne.ok ? ne.value.value : Z;
    },
    setOption: f,
    keep: (P, Z) => Rt(e, ["window", "save-setting", e, P, JSON.stringify(Z)], t, N.signal)
  };
}
function _l(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const nt = { ok: !1, failure: "cancelled", error: "" }, ks = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function El(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? nt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: Sl[n.code] || "fault", error: _l(n.error) };
  } catch {
    return t != null && t.aborted ? nt : { ok: !1, failure: "unreachable", error: ks };
  }
}
const Wu = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: Sl[e.code] || "fault", error: _l(e.error) };
async function Hu(e, t) {
  try {
    const n = await e();
    return t.aborted ? nt : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, Wu(s)])) } };
  } catch {
    return t.aborted ? nt : { ok: !1, failure: "unreachable", error: ks };
  }
}
async function Al(e, t, n) {
  const a = await El(() => wl.read(e, t, n), t);
  return a.failure !== "unreachable" || !vs() ? a : (await pl(), t.aborted ? nt : Al(e, t, n));
}
function Rt(e, t, n, a = void 0, s = !1) {
  return Me.held(() => Uu(e, t, n, a, s), Me.knownRead(Array.isArray(t) ? t : $s(t)));
}
async function Uu(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : $s(t), environment: n };
  return await Me.isRead(o.line) ? Me.joined(JSON.stringify(o), (l, r) => Al({ ...o, attribution: r }, l, s), a, o).catch(() => nt) : El(() => wl.write({ ...o, attribution: {
    client_id: Me.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function zu(e, t, n = void 0) {
  try {
    const a = await Me.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? nt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? nt : { ok: !1, failure: "unreachable", error: ks };
  }
}
function $s(e) {
  return [...e.matchAll(Pu)].map(([t]) => t.replace(qu, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Vu = (e) => `show-${e}`, g4 = (e, t, n) => e.filter((a) => {
  var s;
  return n(Vu((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), Cl = "messages.chat", Gu = {
  key: 0,
  class: "template-brief"
}, Ku = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Yu = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I([]), o = I(""), l = T(() => s.value.map((d) => ({ key: String(d.id), label: d.title, note: d.module }))), r = T(() => s.value.find((d) => String(d.id) === n.value));
    async function i() {
      const d = await Rt(Cl, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!d.ok) {
        o.value = d.error;
        return;
      }
      s.value = d.value.rows;
      const u = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), f = s.value.find((m) => m.title === u);
      f && a("pick", String(f.id));
    }
    return i(), (d, u) => (c(), h(V, null, [
      L(Nt, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: u[0] || (u[0] = (f) => a("pick", f))
      }, null, 8, ["options", "value"]),
      r.value ? (c(), h("p", Gu, $(r.value.brief), 1)) : O("", !0),
      o.value ? (c(), h("p", Ku, $(o.value), 1)) : O("", !0)
    ], 64));
  }
}, Ju = /* @__PURE__ */ J(Yu, [["__scopeId", "data-v-14be8a5c"]]), Zu = { class: "form-field" }, Xu = { class: "form-field-head" }, Qu = ["for"], ed = {
  key: 0,
  class: "form-field-aside"
}, td = {
  key: 0,
  class: "form-field-help"
}, nd = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", Zu, [
      g("div", Xu, [
        g("label", {
          class: "form-field-label",
          for: t.$props.for
        }, $(e.label), 9, Qu),
        t.$slots.aside ? (c(), h("span", ed, [
          de(t.$slots, "aside", {}, void 0, !0)
        ])) : O("", !0)
      ]),
      de(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", td, $(e.help), 1)) : O("", !0)
    ]));
  }
}, ad = /* @__PURE__ */ J(nd, [["__scopeId", "data-v-dd7cdcff"]]), Ya = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, sd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Xn(), n = T(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Ye((c(), h("textarea", Le({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [q(Ya), q(t).value]
    ]);
  }
}), od = /* @__PURE__ */ J(sd, [["__scopeId", "data-v-e130a5b9"]]), ld = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = fs(), o = T(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, r) => (c(), H(ad, {
      label: e.field.label,
      for: q(s),
      "data-button-field": e.field.name
    }, {
      default: j(() => [
        L(Pt, { value: o.value }, {
          choice: j(() => [
            L(Nt, {
              id: q(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: r[0] || (r[0] = (i) => a("pick", i))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: j(() => [
            L(Ju, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: r[1] || (r[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: j(() => [
            L(od, {
              id: q(s),
              value: e.value,
              onInput: r[2] || (r[2] = (i) => a("pick", i.target.value))
            }, null, 8, ["id", "value"])
          ]),
          _: 1
        }, 8, ["value"])
      ]),
      _: 1
    }, 8, ["label", "for", "data-button-field"]));
  }
}, xs = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), H(ue, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: j(() => [
        L(ye, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function rd(e, t, n, a = () => window) {
  Re(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Be(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const id = (e, t = () => !0) => rd("keydown", (n) => n.key === "Escape" && t() && e());
function Ol(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = I(!1), s = T(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return id(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const cd = 80, Ot = Zn([]);
function Tl(e) {
  const t = Symbol("layer"), n = () => Ot.includes(t) && Ot.splice(Ot.indexOf(t), 1);
  return he(
    e,
    (a) => {
      a && !Ot.includes(t) && Ot.push(t), a || n();
    },
    { immediate: !0 }
  ), Be(n), T(() => cd + Math.max(0, Ot.indexOf(t)));
}
let Rl = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Rl = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const ud = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function dd(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(ud)];
    if (!l.length) return o.preventDefault();
    const [r, i] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), i.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === i && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  Re(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : Rl, document.addEventListener("keydown", s), mt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Be(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const fd = ["aria-modal", "aria-label", "aria-labelledby"], hd = {
  key: 0,
  class: "dialog-head"
}, md = ["id", "tabindex"], pd = {
  key: 1,
  class: "dialog-foot"
}, gd = 500, vd = 400, yd = {
  __name: "Dialog",
  props: {
    title: { type: String, default: "" },
    follow: { type: Boolean, default: !1 },
    fits: Boolean,
    wide: Boolean,
    small: Boolean,
    tall: Boolean,
    large: Boolean,
    bare: Boolean,
    open: { type: Boolean, default: null },
    closable: { type: Boolean, default: !0 },
    modal: Boolean,
    sheet: Boolean
  },
  emits: ["close", "dismiss", "escape"],
  setup(e, { emit: t }) {
    const n = e, a = t, { visible: s, close: o, closed: l } = Ol(a, n), r = Tl(s), i = I(null), d = I(null), u = I(null), f = fs(), m = I(!1), v = Date.now();
    n.modal && dd(d, () => a("escape"), u);
    function y() {
      if (!n.modal) return n.closable && o();
      m.value = !0, setTimeout(() => m.value = !1, vd);
    }
    function A(D) {
      !n.modal || Date.now() - v >= gd || ![" ", "Enter"].includes(D.key) || (D.preventDefault(), D.stopPropagation());
    }
    const R = () => i.value && (i.value.scrollTop = i.value.scrollHeight), S = new MutationObserver(R);
    return he(i, (D) => {
      S.disconnect(), D && n.follow && (S.observe(D, { childList: !0, subtree: !0, characterData: !0 }), R());
    }), Be(() => S.disconnect()), (D, U) => (c(), H(hs, { to: "body" }, [
      L(jt, {
        name: "dialog",
        appear: "",
        onAfterLeave: q(l)
      }, {
        default: j(() => [
          q(s) ? (c(), h("div", {
            key: 0,
            class: X(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ge({ zIndex: q(r) }),
            onClick: $e(y, ["self"])
          }, [
            g("section", {
              ref_key: "panel",
              ref: d,
              class: X(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: m.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? q(f) : void 0,
              onKeydownCapture: A
            }, [
              e.bare ? O("", !0) : (c(), h("header", hd, [
                g("h3", {
                  id: q(f),
                  ref_key: "heading",
                  ref: u,
                  tabindex: e.modal ? -1 : void 0
                }, $(e.title), 9, md),
                e.closable ? (c(), H(xs, {
                  key: 0,
                  onClick: q(o)
                }, null, 8, ["onClick"])) : O("", !0)
              ])),
              g("div", {
                ref_key: "body",
                ref: i,
                class: X(["dialog-body", { bare: e.bare }])
              }, [
                de(D.$slots, "default", {}, void 0, !0)
              ], 2),
              D.$slots.foot ? (c(), h("footer", pd, [
                de(D.$slots, "foot", {}, void 0, !0)
              ])) : O("", !0)
            ], 42, fd)
          ], 6)) : O("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Ms = /* @__PURE__ */ J(yd, [["__scopeId", "data-v-6d1ecd98"]]), bd = {
  class: "action-output",
  "data-action-output": ""
}, wd = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), H(Ms, {
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: j(() => [
        g("pre", bd, $(e.text), 1)
      ]),
      _: 1
    }));
  }
}, kd = /* @__PURE__ */ J(wd, [["__scopeId", "data-v-423a045c"]]);
function $d(e) {
  const t = document.body.appendChild(document.createElement("div")), n = fi(kd, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const xd = (e, t, n = {}) => $s(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function cn(e, t, n, a = {}) {
  var s;
  try {
    if (!await Ru(e.module, n)) return { ok: !1, error: "" };
    const o = await Rt(Cl, xd(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && $d(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const Md = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, ma = [
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], be = (e, t, n, a = {}) => ({
  title: e,
  icon: t,
  abstract: n,
  view: "small",
  scope: "environment",
  in_sidebar: !1,
  listed_under: "",
  needs_attention: !1,
  lists_completed_unread: !1,
  nested: !1,
  takes_comments: !1,
  closed_first: !1,
  created_in_viewer: !1,
  listed_as_cards: !1,
  typed_as_title: !1,
  start_as_count: !1,
  exports: !1,
  labels: {},
  filters: [],
  ...a
}), ta = {
  messages: be("Message", "mail", "Messages between you and the agent", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: be("Question", "help", "A question from the agent with suggested answers", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: be("Plan", "flag", "A series of phases and tasks for you to approve before work begins", {
    view: "document",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    lists_completed_unread: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you want, in your own words; the agent builds the plan with you from here" },
    filters: ma
  }),
  tasks: be("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: ma
  }),
  reports: be("Report", "report", "A record of what was checked and found", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: be("Collection", "folder", "Related items grouped under a name", {
    in_sidebar: !0,
    listed_under: "sidebar",
    listed_as_cards: !0,
    created_in_viewer: !0,
    typed_as_title: !0,
    labels: { abstract: "What belongs in it" }
  }),
  docs: be("Document", "file", "What stays true about the project, catalogued for every session", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    exports: !0,
    start_as_count: !0
  }),
  memories: be("Memory", "pin", "What the agent keeps in mind here, with a weight from 1 to 10 that every compaction lowers by one", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { weight: "A weight from 1 to 10" }
  }),
  rules: be("Rule", "list", "An instruction that applies to every environment in the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: be("Reminder", "clock", "An instruction repeated until it is removed", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  pins: be("Pin", "band", "One line pinned to the chat while it matters", { filters: ma }),
  reactions: be("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: be("Plugin", "plug", "An installed extension that responds to events and can run background services", { scope: "project" }),
  environments: be("Environment", "branch", "A separate workspace with messages, tasks, memories, plans and settings", { scope: "project" }),
  agents: be("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: be("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: be("Worker", "bot", "An agent assigned a task in a separate working copy"),
  verifiers: be("Verifier", "verifier", "An agent that checks whether an output reader report was correctly closed"),
  test_turns: be("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: be("Reviewer", "reviewer", "An agent that tests and reviews worker changes and reports the results to the main agent"),
  helpers: be("Helper", "bot", "A helper started by the agent for a specific job", { nested: !0 }),
  sequences: be("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by its triggers", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    listed_as_cards: !0,
    takes_comments: !0,
    labels: { brief: "What it is for" }
  }),
  templates: be("Template", "docs", "Instructions put in front of anything made from it, with the parts it starts with", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    labels: { brief: "Instructions" }
  }),
  triggers: be("Trigger", "bolt", "Words to watch for and the action to take when they appear", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    labels: { words: "Words", action: "What it does", text: "What it sends" }
  }),
  checks: be("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
    view: "check",
    filters: [
      { key: "open", title: "Checks", shows: "open" },
      { key: "closed", title: "Waits", shows: "closed", empty: "No wait has a check." }
    ],
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0
  }),
  dumps: be("Dump", "inbox", "Text and files you submit for the agent to sort by subject", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: be("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: be("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
}, Sd = ["secrets", "plugins"], Il = Object.keys(ta).filter((e) => !(cl && Sd.includes(e)));
T(() => Il.map((e) => ({ name: e, ...ta[e] })));
const qt = (e) => ta[e], Bl = new Map(Il.flatMap((e) => [e, e.replace(/s$/, ""), ta[e].title.toLowerCase()].map((t) => [t, e]))), ct = (e) => Bl.get(String(e).toLowerCase()) || "", Ll = [...Bl.keys()].sort((e, t) => t.length - e.length).join("|"), _d = {
  class: "button-form",
  "data-button-form": ""
}, Ed = {
  key: 0,
  class: "button-form-title"
}, Ad = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, Cd = { class: "button-form-actions" }, Od = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(Object.fromEntries(n.button.fields.map((u) => [u.name, u.default || ""]))), o = I(!1), l = I(""), r = T(() => n.button.fields.every((u) => s.value[u.name].trim().length > 0)), i = T(() => {
      var f;
      if (!n.row) return n.button.label;
      const u = ((f = qt(ct(n.row.noun))) == null ? void 0 : f.title) || "Item";
      return `${n.button.label} · ${u} ${n.row.id}`;
    });
    async function d() {
      if (o.value || !r.value) return;
      o.value = !0;
      const u = await cn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = u.ok ? "" : u.error, u.ok && (a("done"), a("close"));
    }
    return (u, f) => (c(), H(Ms, {
      title: i.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: f[1] || (f[1] = (m) => a("close"))
    }, {
      default: j(() => {
        var m;
        return [
          g("div", _d, [
            (m = e.row) != null && m.title ? (c(), h("p", Ed, $(e.row.title), 1)) : O("", !0),
            (c(!0), h(V, null, te(e.button.fields, (v) => (c(), H(ld, {
              key: v.name,
              field: v,
              value: s.value[v.name],
              environment: e.environment,
              onPick: (y) => s.value[v.name] = y
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (c(), h("p", Ad, $(l.value), 1)) : O("", !0),
            g("div", Cd, [
              L(ue, {
                small: "",
                onClick: f[0] || (f[0] = (v) => a("close"))
              }, {
                default: j(() => [...f[2] || (f[2] = [
                  ee("Cancel", -1)
                ])]),
                _: 1
              }),
              L(ue, {
                variant: "primary",
                small: "",
                disabled: !r.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: d
              }, {
                default: j(() => [...f[3] || (f[3] = [
                  ee("Send", -1)
                ])]),
                _: 1
              }, 8, ["disabled", "busy"])
            ])
          ])
        ];
      }),
      _: 1
    }, 8, ["title"]));
  }
}, Td = /* @__PURE__ */ J(Od, [["__scopeId", "data-v-f26c27a7"]]), Rd = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Id = {
  key: 1,
  class: "menu-item-text"
}, Bd = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: X(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", Rd, $(e.checked ? "✓" : ""), 1)) : O("", !0),
      e.description ? (c(), h("span", Id, [
        g("span", null, [
          de(t.$slots, "default", {}, void 0, !0)
        ]),
        g("small", null, $(e.description), 1)
      ])) : de(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Mt = /* @__PURE__ */ J(Bd, [["__scopeId", "data-v-fec99974"]]), Ld = ["aria-busy"], Nd = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, Dd = { class: "button-slot-confirm-text" }, jd = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Pd = {
  __name: "ButtonSlot",
  props: {
    name: { type: String, required: !0 },
    row: { type: Object, default: null },
    environment: { type: String, required: !0 },
    readOnly: Boolean,
    externalFailure: Boolean,
    objectName: { type: String, default: "" }
  },
  emits: ["done", "failure"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(() => bs(n.environment)), o = T(
      () => {
        var S;
        return !n.readOnly && ((S = s.value) == null ? void 0 : S.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = T(() => {
      var S;
      return !n.readOnly && ((S = s.value) == null ? void 0 : S.failed.value);
    }), r = () => s.value.load().catch(() => {
    }), i = T(() => n.readOnly ? [] : Tu(n.environment, n.name, n.row)), d = I(null), u = I(null), f = I(""), m = I(!1), v = (S) => [S.from ? `From ${S.from}` : "", S.tip, S.warning].filter(Boolean).join(" · "), y = (S) => S.icon || (S.warning ? "dot" : "");
    function A(S) {
      if (!(m.value || n.readOnly)) {
        if (S.fields.length) {
          d.value = S;
          return;
        }
        if (S.confirm) {
          u.value = S;
          return;
        }
        return R(S);
      }
    }
    async function R(S) {
      u.value = null, f.value = "", a("failure", ""), m.value = !0;
      const D = await cn(S, n.row, n.environment);
      m.value = !1, f.value = D.ok ? "" : D.error;
      const U = S.label.toLowerCase() + (n.objectName && !S.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", D.ok ? "" : `Could not ${U}: ${D.error}`), D.ok && a("done");
    }
    return (S, D) => (c(), h("span", {
      class: X(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (c(), h(V, { key: 0 }, [
        D[5] || (D[5] = g("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        L(ue, {
          small: "",
          onClick: r
        }, {
          default: j(() => [...D[4] || (D[4] = [
            ee("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && u.value ? (c(), h("span", Nd, [
        g("span", Dd, $(u.value.confirm), 1),
        L(ue, {
          small: "",
          variant: u.value.danger ? "ghost" : "primary",
          bordered: u.value.danger,
          class: X({ danger: u.value.danger }),
          "data-button-confirm-yes": "",
          onClick: D[0] || (D[0] = (U) => R(u.value))
        }, {
          default: j(() => [
            ee($(u.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        L(ue, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: D[1] || (D[1] = (U) => u.value = null)
        }, {
          default: j(() => [...D[6] || (D[6] = [
            ee("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? O("", !0) : (c(), h(V, { key: 2 }, [
        (c(!0), h(V, null, te(i.value, (U) => (c(), h(V, {
          key: U.name
        }, [
          U.menu.length ? (c(), H(xu, {
            key: 0,
            small: "",
            variant: U.primary ? "primary" : "ghost",
            disabled: m.value,
            "menu-label": U.menu_label || "More ways",
            title: v(U),
            "data-button": U.name,
            onMain: (N) => A(U)
          }, {
            menu: j(({ close: N }) => [
              (c(!0), h(V, null, te(U.menu, (B) => (c(), H(Mt, {
                key: B.label,
                description: B.description,
                onClick: (F) => (N(), A({ ...U, ...B, menu: [] }))
              }, {
                default: j(() => [
                  ee($(B.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: j(() => [
              ee($(U.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (c(), H(ue, {
            key: 1,
            small: "",
            variant: U.primary ? "primary" : "ghost",
            bordered: !U.primary,
            class: X({ danger: U.danger }),
            icon: y(U),
            disabled: m.value,
            title: v(U),
            "data-button": U.name,
            onClick: (N) => A(U)
          }, {
            default: j(() => [
              ee($(U.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        f.value && !e.readOnly && !e.externalFailure ? (c(), h("span", jd, $(f.value), 1)) : O("", !0),
        d.value && !e.readOnly ? (c(), H(Td, {
          key: d.value.runs,
          button: d.value,
          row: e.row,
          environment: e.environment,
          onClose: D[2] || (D[2] = (U) => d.value = null),
          onDone: D[3] || (D[3] = (U) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : O("", !0)
      ], 64))
    ], 10, Ld));
  }
}, qd = /* @__PURE__ */ J(Pd, [["__scopeId", "data-v-a4b6f174"]]), Fd = {
  class: "running",
  "data-running-command": ""
}, Wd = ["title"], Hd = {
  key: "idle",
  class: "running-idle"
}, Ud = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", Fd, [
      L(jt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: j(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, $(e.text), 9, Wd)) : (c(), h("span", Hd, $(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, v4 = /* @__PURE__ */ J(Ud, [["__scopeId", "data-v-d3240219"]]), zd = ["aria-checked", "aria-label", "title"], Vd = {
  key: 0,
  class: "switch-inner"
}, Gd = {
  key: 0,
  class: "switch-word"
}, Kd = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("button", {
      type: "button",
      class: X(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: s[0] || (s[0] = (o) => n("change", !e.on))
    }, [
      g("span", {
        class: X(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (c(), h("span", Vd, $(e.word), 1)) : O("", !0),
        s[1] || (s[1] = g("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", Gd, $(e.word), 1)) : O("", !0)
    ], 10, zd));
  }
}, y4 = /* @__PURE__ */ J(Kd, [["__scopeId", "data-v-1bfb90f3"]]);
function Nl(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function jn(e, t) {
  return Nl(() => localStorage, e, t);
}
function Dl(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Ss(e, t) {
  return Dl(() => localStorage, e, t);
}
function jl(e, t) {
  he(t, (n) => Ss(e, n), { deep: !0 });
}
function Yd(e, t) {
  return Nl(() => sessionStorage, e, t);
}
function Jd(e, t) {
  return Dl(() => sessionStorage, e, t);
}
const Pn = "journal.environment", Pl = I(Yd(Pn, jn(Pn, "")));
function Zd(e) {
  Pl.value = e, Jd(Pn, e), Ss(Pn, e);
}
const qn = I(location.hash), so = Ke(null), oo = { integrations: "mcp", library: "team" };
function Xd() {
  if (!so.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (oo[n]) {
    location.replace(`#/${[oo[n], ...a].join("/")}${t ? `?${t}` : ""}`), qn.value = location.hash;
    return;
  }
  !n || so.value(n) || (Zd(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), qn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  qn.value = location.hash, Xd();
});
const Ja = T(() => {
  const [e, t = ""] = qn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [r, i = ""] = l.split("@"), [d = "", u = "", f = ""] = r.split(":");
    return { table: d, id: Number(u), comment: Number(f) || 0, env: i };
  });
  return {
    env: Pl.value,
    page: n,
    n: a ? /^\d+$/.test(a) ? Number(a) : a : 0,
    q: s.get("q") || "",
    sub: s.get("sub") || "",
    tab: s.get("tab") || "",
    plugin: s.get("plugin") || "",
    install: s.get("install") || "",
    line: Number(s.get("line") || 0),
    at: s.get("at") || "",
    stack: o,
    open: o[o.length - 1] || null
  };
}), _s = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${_s.page(e)}?open=${t}`
};
function Qd(e = "", t = 0, n = "") {
  location.hash = _s.page(e, t, n);
}
const ef = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function ql(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, r]) => `${l}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(ef).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Bt = {};
function b4(e, t) {
  return Bt[e] = t, () => Bt[e] === t && delete Bt[e];
}
function Fl(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Bt[e]) != null && l.call(Bt, t))) return;
  const s = Ja.value.stack, o = s.findIndex((r) => r.table === e && r.id === t);
  ql([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function tf(e, t, n, a = 0, s = "") {
  if (e === Ja.value.env) return Fl(t, n, a, s);
  const o = Ja.value.stack, l = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  ql([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function Fe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? tf(a, s, Number(o), 0, t) : Fl(s, Number(o), 0, t);
}
function nf(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function It(e) {
  const t = nf(e);
  t && Fe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function w4(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const af = { class: "inspector-part" }, sf = { class: "inspector-part-title" }, of = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("section", af, [
      g("h4", sf, $(e.title), 1),
      de(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, k4 = /* @__PURE__ */ J(of, [["__scopeId", "data-v-0da7fa52"]]), lf = {
  key: 1,
  class: "row-list-failure"
}, rf = ["data-row"], cf = {
  __name: "RowList",
  props: {
    rows: { type: Array, required: !0 },
    failure: { type: String, default: "" },
    // what is empty, in the window's own terms, and under it the sentence that says what brings rows there
    empty: { type: String, required: !0 },
    hint: { type: String, default: "" },
    // whether a search or a filter is on: with it, and no row left, the list says nothing matches (`matches` names it in the window's words) and what to try, not that it is empty
    searching: Boolean,
    matches: { type: String, default: "Nothing matches" },
    loaded: { type: Boolean, required: !0 },
    // what the skeleton looks like while the first read is out: the shape of what is coming
    shape: { type: String, default: "rows" },
    // reads the next page behind the rows and says whether it found any; with none given the list has no pages
    older: { type: Function, default: null },
    // whether the server holds a page behind the rows, which is what shows the button to read it
    more: { type: Boolean, default: !0 },
    // how a row comes in and goes out, {enter, leave} each given the row's element and the call that ends it; with none given rows just appear
    arrival: { type: Object, default: null }
  },
  setup(e) {
    const t = e, n = T(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = I(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (c(), H(_t, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", lf, $(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), H(Qt, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: j(() => [
        ee($(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(V, { key: 3 }, [
      (c(), H(ht(e.arrival ? al : "ul"), Le(n.value, { class: "row-list" }), {
        default: j(() => [
          (c(!0), h(V, null, te(e.rows, (r) => (c(), h("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            de(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, rf))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (r) => s(e.older))
      }, "Show more")) : O("", !0)
    ], 64));
  }
}, uf = /* @__PURE__ */ J(cf, [["__scopeId", "data-v-6c7ba696"]]), df = {
  class: "agent-rows",
  "data-agent-rows": ""
}, ff = {
  key: 1,
  class: "agent-rows-note"
}, hf = {
  key: 2,
  class: "agent-rows-note"
}, mf = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, pf = ["data-agent-row", "onClick"], gf = { class: "agent-row-name" }, vf = { class: "agent-row-state" }, yf = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = T(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = T(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (c(), h("div", df, [
      e.loaded ? e.failure ? (c(), h("p", ff, $(e.failure), 1)) : e.rows.length ? (c(), h(V, { key: 3 }, [
        g("p", mf, $(a.value) + " running", 1),
        (c(!0), h(V, null, te(n.value, (l) => (c(), h("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (r) => q(Fe)(`agents:${l.id}`)
        }, [
          g("span", gf, "#" + $(l.id) + " " + $(l.session), 1),
          g("span", vf, $(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, pf))), 128))
      ], 64)) : (c(), h("p", hf, $(e.none), 1)) : (c(), H(_t, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, $4 = /* @__PURE__ */ J(yf, [["__scopeId", "data-v-a01e5a17"]]), bf = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: X(["badge", e.tone])
    }, $(e.text), 3));
  }
}, Wl = /* @__PURE__ */ J(bf, [["__scopeId", "data-v-9e7e1157"]]), wf = ["aria-valuenow", "aria-valuemax"], kf = {
  __name: "ProgressBar",
  props: {
    value: { type: Number, required: !0 },
    max: { type: Number, default: 100 },
    tone: { type: String, default: "" },
    least: { type: Number, default: 0 },
    thin: Boolean,
    busy: Boolean
  },
  setup(e) {
    const t = e, n = T(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (a, s) => (c(), h("span", {
      class: X(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      g("span", {
        class: "fill",
        style: ge({ width: n.value })
      }, null, 4)
    ], 10, wf));
  }
}, $f = /* @__PURE__ */ J(kf, [["__scopeId", "data-v-9eba6a85"]]), xf = { class: "bars" }, Mf = { class: "bar-name" }, Sf = { class: "bar-value" }, _f = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = T(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, r) => (c(), h("div", xf, [
      (c(!0), h(V, null, te(e.items, (i, d) => (c(), H(ht(i.open ? "button" : "div"), {
        key: `${d}-${i.label}`,
        type: i.open ? "button" : void 0,
        class: X(["bar-row", i.tone, { opens: i.open }]),
        onClick: (u) => i.open && a("open", i.open)
      }, {
        default: j(() => [
          g("span", Mf, $(i.label), 1),
          L($f, {
            value: Number(i.value) || 0,
            max: s.value,
            tone: i.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          g("span", Sf, $(i.value) + $(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Ef = /* @__PURE__ */ J(_f, [["__scopeId", "data-v-663427f4"]]), Af = { class: "bars" }, Cf = {
  key: 0,
  class: "bars-title"
}, Of = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", Af, [
      e.node.title ? (c(), h("span", Cf, $(e.node.title), 1)) : O("", !0),
      L(Ef, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Tf = /* @__PURE__ */ J(Of, [["__scopeId", "data-v-7135bb11"]]), Rf = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = T(() => n[a.node.type](a.node));
    return (l, r) => (c(), h("div", {
      class: X([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ge(o.value)
    }, [
      (c(!0), h(V, null, te(e.node.children || [], (i, d) => (c(), H(ar, {
        key: d,
        node: i,
        onOpen: r[0] || (r[0] = (u) => s("open", u)),
        onFile: r[1] || (r[1] = (u) => s("file", u))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Tn = /* @__PURE__ */ J(Rf, [["__scopeId", "data-v-d142a3f4"]]), If = {
  key: 0,
  class: "card-head"
}, Bf = { class: "card-title" }, Lf = {
  key: 0,
  class: "card-note"
}, Nf = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", {
      class: X(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", If, [
        g("span", Bf, $(e.node.title), 1),
        e.node.note ? (c(), h("span", Lf, $(e.node.note), 1)) : O("", !0)
      ])) : O("", !0),
      L(Tn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Df = /* @__PURE__ */ J(Nf, [["__scopeId", "data-v-67b72d40"]]), jf = { processes: "process", memories: "memory", replies: "reply" }, Fn = (e) => (jf[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), Za = [], Pf = 2e3, lt = /* @__PURE__ */ new Map(), qf = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Ff = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Et(e, { first: t = !1 } = {}) {
  t ? Za.unshift(e) : Za.push(e), lt.clear();
}
function Hl(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Wf = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Hf = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function tt(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Uf(e, t) {
  const n = [{ type: "text", text: tt(e).replace(/\r\n/g, `
`) }];
  for (const a of Za)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.type !== "text") continue;
      const l = a(o.text, t);
      typeof l == "string" ? o.text = l : l && n.splice(s, 1, ...l);
    }
  return n;
}
function en(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return zf(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function zf(e) {
  return e.split(Ff).map((t, n) => n % 2 ? t : t.replace(qf, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function lo(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const Vf = 24;
function Gf(e) {
  const [t, , ...n] = e, a = lo(t), s = n.map(lo), o = (i) => [a, ...s].some((d) => (d[i] ?? "").length > Vf) ? ' class="text-column"' : "", l = a.map((i, d) => `<th${o(d)}>${en(i)}</th>`).join(""), r = s.map((i) => `<tr>${i.map((d, u) => `<td${o(u)}>${en(d)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${r}</tbody></table>`;
}
const Ul = /^\s*(?:[-*+]|\d+[.)])\s+/, Xa = /^\s*(\d+)[.)]\s/, ro = (e) => e.match(/^\s*/)[0].length;
function zl(e) {
  const t = e[0].match(Xa), n = ro(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), r = a[a.length - 1];
    l && ro(o) <= n ? a.push({ text: l[2], nested: [] }) : r && o.trim() && (l || r.nested.length) ? r.nested.push(o) : r && o.trim() && (r.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${en(o.text)}${o.nested.length ? zl(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function Kf(e, t) {
  const n = Xa.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Ul.test(e[s]) && Xa.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const io = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Vl(e) {
  const t = String(e || "").replace(/\r\n/g, `
`).split(`
`), n = [];
  let a = 0;
  for (; a < t.length; ) {
    const s = t[a];
    if (!s.trim()) {
      a += 1;
      continue;
    }
    if (/^(```|~~~)/.test(s)) {
      const r = t.findIndex((d, u) => u > a && /^(```|~~~)/.test(d)), i = r < 0 ? t.length : r;
      n.push(`<pre><code>${t.slice(a + 1, i).join(`
`)}</code></pre>`), a = i + 1;
      continue;
    }
    const o = s.match(/^(#{1,6})\s+(.*)$/);
    if (o) {
      const r = Math.min(6, o[1].length + 2);
      n.push(`<h${r}>${en(o[2])}</h${r}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (io(t, a)) {
      let r = a + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(Gf(t.slice(a, r))), a = r;
      continue;
    }
    if (Ul.test(s)) {
      const r = Kf(t, a);
      n.push(zl(t.slice(a, r))), a = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let r = a;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${Vl(
          t.slice(a, r).map((i) => i.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = r;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !io(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${en(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const Yf = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Jf = (e) => e.type !== "text" && !Yf.test(e.html);
function Zf(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(Vl(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : Jf(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function Xf(e, t = { env: "" }) {
  const n = Hf(e, t), a = lt.get(n);
  if (lt.delete(n), a && a.source === t.source && a.reads.every((l) => Wf(l, t)))
    return lt.set(n, a), a.html;
  const s = [], o = Zf(Uf(e, { ...t, reads: s }));
  return lt.set(n, { html: o, reads: s, source: t.source }), lt.size > Pf && lt.delete(lt.keys().next().value), o;
}
const pa = /* @__PURE__ */ new WeakMap();
function Qf(e) {
  if (pa.has(e)) return pa.get(e);
  const t = hi(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (d, u) => `${d}:${u}`;
  function o(d, u) {
    const f = s(d, u), m = e.read(`${Fn(d)} show ${u}`);
    n.set(f, m), m.then((v) => {
      n.get(f) === m && (n.delete(f), t.set(f, v.ok ? { ...v.value, table: d } : null));
    });
  }
  function l(d) {
    a.has(d) || (a.add(d), e.follow([`${Fn(d).replace(/-/g, "_")}.*`], (u) => {
      const f = `${d}:`;
      for (const m of t.keys()) {
        if (!m.startsWith(f)) continue;
        const v = Number(m.slice(f.length));
        (!u.row_id || u.row_id === v) && o(d, v);
      }
    }));
  }
  function r(d, u) {
    l(d);
    const f = s(d, u);
    return !t.has(f) && !n.has(f) && o(d, u), t.get(f);
  }
  const i = { id: Symbol("window text rows"), row: r };
  return pa.set(e, i), i;
}
function Gl() {
  const e = Oe(Ne, null), t = e ? Qf(e) : null;
  return (n, a = {}) => Xf(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Kl = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, un = (e) => String(e || "").replace(Kl, (t, n, a, s) => s), eh = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), $n = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, th = /^Traceback \(most recent call last\):/m, nh = 8;
function Yl(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, nh).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function ah(e) {
  const t = [...e.matchAll(eh)].map((a) => a.index);
  if ($n.lastIndex = 0, !t.length || !$n.test(e)) return null;
  $n.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll($n)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((r) => r[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Yl(n), tail: "" } : null;
}
function sh(e) {
  const t = th.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Yl([o]), tail: n.slice(s).join(`
`) };
}
Et((e) => {
  const t = un(e), n = sh(t) || ah(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const Wn = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Jl = (e) => `${e.table}:${e.id}`, co = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", ga = 80;
function uo(e) {
  return e.length <= ga ? e : `${e.slice(0, ga + 1).replace(/\s+\S*$/, "") || e.slice(0, ga)}…`;
}
const fo = {
  messages: (e) => uo(co(e.text)),
  comments: (e) => uo(co(e.text)),
  questions: (e) => e.text,
  memories: (e) => `${e.text} (weight ${e.weight})`,
  rules: (e) => e.text,
  reminders: (e) => e.text,
  environments: (e) => e.name,
  agents: (e) => e.session,
  workers: (e) => e.name,
  triggers: (e) => (e.phrases || []).join(", "),
  reactions: (e) => e.face,
  nudges: (e) => {
    var t;
    return ((t = e.data) == null ? void 0 : t.line) || "";
  },
  plugins: (e) => {
    var t;
    return ((t = e.manifest) == null ? void 0 : t.title) || e.name;
  },
  shares: (e) => `Share of ${e.target || "nothing"}`
}, oh = (e) => (fo[e.table] ? fo[e.table](e) : e.title || "") || "", St = (e) => Wn(e.created_at), Zl = (e) => Wn(e.updated_at) || St(e), lh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, rh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function ih(e) {
  const t = lh.exec(e);
  if (t && ct(t[1])) return { at: t.index, length: t[0].length, table: ct(t[1]), id: Number(t[2]), label: t[3] };
  const n = rh.exec(e), a = n && ct(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function ch(e, t, n, a) {
  const s = Hl(a, e, t), o = un(s ? oh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${tt(qt(e).title)} ${t}</span><span class="row-card-title">${tt(o)}</span></a>`;
}
Et(
  (e, t) => {
    const n = ih(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: ch(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const uh = /\.(png|jpe?g|gif|webp|svg)$/i, dh = (e) => uh.test(e), fh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, hh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function mh(e, t) {
  const n = fh.exec(e), [, a, s, o, l, r] = n || [], i = n && ct(a || o), d = i && Hl(t, i, Number(s || l));
  if (i !== "messages" || !d || !(d.files || []).includes(r)) return null;
  const u = `/api/files/message/${d.id}/${encodeURIComponent(r)}`, f = `${qt(i).title} ${d.id} · ${tt(r)}`, m = dh(r) ? `<img class="file-card-image" src="${u}" alt="${tt(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${u}" data-attached="${tt(r)}">${m}<span class="file-card-name">${f}</span></a>` };
}
function ph(e) {
  const t = hh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${tt(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Et(
  (e, t) => {
    if (t.inline) return null;
    const n = mh(e, t) || ph(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const gh = /`([^`\n]+)`/g;
Et((e) => e.replace(gh, (t, n) => `<code>${n}</code>`));
const ho = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${_s.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Et(
  (e, t) => e.replace(Kl, (n, a, s, o) => ho[a] ? ho[a](s, o, t) : o)
);
const vh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Xl = new RegExp(`\\b(${Ll}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Ql = new RegExp(`\\b(${Ll}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), yh = new RegExp(`<code>((?:${Xl.source}|${Ql.source}))</code>`, "gi"), bh = (e) => e.replace(yh, "$1"), wh = (e, t) => `<a class="row-pill" href="#" data-peek="${ct(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, kh = (e) => e.replace(Ql, (t, n, a) => a.replace(/\d+/g, (s) => wh(n.replace(/s$/i, ""), s))), $h = (e) => kh(e).replace(
  Xl,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${ct(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Et(
  (e, t) => t.rowNames === !1 ? e : bh(e).split(vh).map((n, a) => a % 2 ? n : $h(n)).join("")
);
const xh = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Mh = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Sh = /[\w\]]\(/, _h = /^[\w$.[\]'"]+\s*=\s*[^=]/, Eh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Ah = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Ch = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Oh = /[[({,]$/, Th = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Rh = /^(\t|\s{2,})\S/, Ih = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Bh = /`[^`]+`/, Lh = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Nh = /[{}()[\];=<>$&|*\\@+^~%]/g, er = /^\s*(?:[-*+]|\d+[.)])\s/, Dh = /^\s*>/, jh = /^\s*\|/, Ph = 0.6, qh = 0.4, Fh = 5, Wh = 0.03, tr = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Fh && t.every((n) => Lh.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Nh) ?? []).length / e.length < Wh;
}, va = (e) => {
  const t = e.trim();
  return Bh.test(t) ? !1 : [xh, Mh, Sh, _h, Eh, Ah, Ch, Oh, Th].some((n) => n.test(t)) || /[;{}]$/.test(t) || Rh.test(e) && !er.test(e) && !tr(e);
};
function Hh(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || er.test(t[0]) || t.every((o) => Dh.test(o) || jh.test(o))) return "text";
  const n = t.filter((o) => !Ih.test(o.trim()));
  if (t.length === 1) return !n.length || va(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(va).length, s = n.filter((o) => !va(o) && tr(o)).length;
  return a >= n.length * Ph && s <= n.length * qh ? "code" : "text";
}
const Qa = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Uh = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", zh = `${Qa} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Vh = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Gh = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", mo = {
  js: { keywords: Qa, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Uh, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: zh, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Qa, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Vh, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Gh, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, Kh = {
  javascript: "js",
  mjs: "js",
  cjs: "js",
  ts: "js",
  typescript: "js",
  tsx: "js",
  jsx: "js",
  vue: "html",
  python: "py",
  cpp: "c",
  cc: "c",
  h: "c",
  hpp: "c",
  cs: "c",
  csharp: "c",
  java: "c",
  kt: "c",
  kotlin: "c",
  go: "c",
  golang: "c",
  rs: "c",
  rust: "c",
  swift: "c",
  scala: "c",
  dart: "c",
  bash: "sh",
  shell: "sh",
  zsh: "sh",
  fish: "sh",
  scss: "css",
  less: "css",
  htm: "html",
  xml: "html",
  yml: "yaml",
  markdown: "md"
};
function po(e, t, n) {
  return n && e.startsWith(n, t);
}
function Yh(e, t) {
  const n = mo[Kh[t] ?? t] || mo.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
  let o = 0;
  const l = (r, i) => i && s.push({ type: r, value: i });
  for (; o < e.length; ) {
    const r = e[o];
    if (n.markdown) {
      const d = e.indexOf(`
`, o), u = e.slice(o, d < 0 ? e.length : d);
      l(
        /^#{1,6}\s/.test(u) ? "keyword" : /^(```|~~~)/.test(u) ? "comment" : /^\s*([-*+]|\d+\.)\s/.test(u) ? "number" : "plain",
        u
      ), l("plain", d < 0 ? "" : `
`), o = d < 0 ? e.length : d + 1;
      continue;
    }
    if (po(e, o, n.line) || n.hash && r === "#") {
      const d = e.indexOf(`
`, o);
      l("comment", e.slice(o, d < 0 ? e.length : d)), o = d < 0 ? e.length : d;
      continue;
    }
    if (n.block && po(e, o, n.block[0])) {
      const d = e.indexOf(n.block[1], o + n.block[0].length), u = d < 0 ? e.length : d + n.block[1].length;
      l("comment", e.slice(o, u)), o = u;
      continue;
    }
    const i = (n.triple || []).find((d) => e.startsWith(d, o));
    if (i) {
      const d = e.indexOf(i, o + 3), u = d < 0 ? e.length : d + 3;
      l("string", e.slice(o, u)), o = u;
      continue;
    }
    if (n.quotes.includes(r)) {
      let d = o + 1;
      for (; d < e.length && e[d] !== r && (r === "`" || e[d] !== `
`); ) d += e[d] === "\\" ? 2 : 1;
      l(n.keyed && /^\s*:/.test(e.slice(d + 1)) ? "property" : "string", e.slice(o, d + 1)), o = d + 1;
      continue;
    }
    if (n.tags && r === "<" && /[A-Za-z/!?]/.test(e[o + 1] || "")) {
      const d = e.slice(o).match(/^<\/?[\w:-]+/);
      l("keyword", d[0]), o += d[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(r)) {
      const u = e.slice(o).match(/^[\w$]+/)[0], f = n.lower ? u.toLowerCase() : u, m = n.property && /^\s*:/.test(e.slice(o + u.length));
      l(a.has(f) ? "keyword" : m ? "property" : /^[A-Z]/.test(u) && t !== "text" ? "type" : "plain", u), o += u.length;
      continue;
    }
    if (/\d/.test(r)) {
      const d = e.slice(o).match(/^(0x[\da-fA-F]+|\d[\d_]*(\.\d+)?([eE][+-]?\d+)?)/);
      l("number", d[0]), o += d[0].length;
      continue;
    }
    if (n.tags && (r === ">" || e.startsWith("/>", o))) {
      const d = r === ">" ? 1 : 2;
      l("keyword", e.slice(o, o + d)), o += d;
      continue;
    }
    l("plain", r), o += 1;
  }
  return s;
}
function Jh(e, t) {
  const n = [""];
  for (const { type: a, value: s } of Yh(e, t))
    s.split(`
`).forEach((l, r) => {
      r && n.push(""), l && (n[n.length - 1] += a === "plain" ? tt(l) : `<span class="tok-${a}">${tt(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Zh(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Xh = 1500, go = /* @__PURE__ */ new WeakMap();
async function Qh(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Zh(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(go.get(t)), go.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Xh)
  )));
}
typeof document < "u" && document.addEventListener("click", Qh, !0);
const em = /\n\s*\n/, tm = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, nm = /^\s*(`{3,}|~{3,})\s*$/, am = /^\s{4,}\S/, sm = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, es = /^\s*(?:[-*+]|\d+[.)])\s/, nr = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, om = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function Es(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function lm(e) {
  const t = Es(e.join(`
`));
  return (om.find(([, n]) => n.test(t)) || ["text"])[0];
}
const rm = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && nr.test(t) && !es.test(t);
}, im = (e, t) => es.test(t) || es.test([...e].reverse().find((n) => n.trim()) || "");
function As(e, t) {
  const n = t || lm(e), a = Jh(Es(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function cm(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && nm.test(s));
  return a < 0 ? e.length : a;
}
function um(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return As(a.map(un), n ? n.toLowerCase() : "");
}
function dm(e) {
  const t = e.split(em).map((l) => ({ paragraph: l, type: Hh(Es(l).split(`
`)) })), n = [];
  let a = [];
  const s = () => {
    a.length && n.push({ type: "text", text: a.join(`

`) }), a = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    let l = o;
    for (; l < t.length && t[l].type !== "text"; ) l += 1;
    const r = t.slice(o, l);
    if (r.some(({ type: i }) => i === "code") || r.length > 1) {
      s(), n.push(As(r.map(({ paragraph: i }) => i).join(`

`).split(`
`).map(un), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function fm(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : dm(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const r = n[l].match(tm);
    if (r) {
      const d = cm(n, l, r[2]);
      o(), a.push(um(n.slice(l + 1, d), r[1], r[3])), l = d + 1;
      continue;
    }
    const i = rm(s) ? sm : am;
    if (!t && i.test(n[l]) && !im(s, n[l])) {
      let d = l;
      for (; d < n.length && (i.test(n[d]) || !n[d].trim()); ) d += 1;
      for (; d > l && !n[d - 1].trim(); ) d -= 1;
      const u = [];
      for (; s.length && s[s.length - 1].trim() && nr.test(s[s.length - 1].trim()); ) u.unshift(s.pop());
      if (d - l + u.length >= 2) {
        o(), a.push(As([...u, ...n.slice(l, d)].map(un), "")), l = d;
        continue;
      }
      s.push(...u);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Et((e, t) => fm(e, t.document), { first: !0 });
const hm = ["innerHTML"], mm = ["innerHTML"], pm = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Gl(), a = T(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => q(It) && q(It)(...l)),
      innerHTML: a.value
    }, null, 8, hm)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => q(It) && q(It)(...l)),
      innerHTML: a.value
    }, null, 8, mm));
  }
}, kt = /* @__PURE__ */ J(pm, [["__scopeId", "data-v-d8e75741"]]), gm = { class: "fact" }, vm = { class: "fact-label" }, ym = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", gm, [
      g("span", vm, $(e.label), 1),
      L(kt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, bm = /* @__PURE__ */ J(ym, [["__scopeId", "data-v-3a88ecf8"]]), wm = { class: "list" }, km = { class: "list-label" }, $m = {
  key: 1,
  class: "list-note"
}, xm = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", wm, [
      (c(!0), h(V, null, te(e.items, (o, l) => (c(), H(ht(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: X(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: j(() => [
          g("span", km, $(o.label), 1),
          o.badge ? (c(), H(Wl, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : O("", !0),
          o.note ? (c(), h("span", $m, $(o.note), 1)) : O("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Mm = /* @__PURE__ */ J(xm, [["__scopeId", "data-v-ebe2ae0a"]]), Sm = { class: "table" }, _m = {
  key: 0,
  class: "table-row empty"
}, Em = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (c(), h("div", Sm, [
      g("div", {
        class: "table-row head",
        style: ge(s.value)
      }, [
        (c(!0), h(V, null, te(e.columns, (r) => (c(), h("span", {
          key: r,
          class: "cell"
        }, $(r), 1))), 128))
      ], 4),
      (c(!0), h(V, null, te(e.rows, (r, i) => (c(), H(ht(r.open ? "button" : "div"), {
        key: i,
        type: r.open ? "button" : void 0,
        class: X(["table-row", r.tone, { opens: r.open }]),
        style: ge(s.value),
        onClick: (d) => r.open && a("open", r.open)
      }, {
        default: j(() => [
          (c(!0), h(V, null, te(r.cells, (d, u) => (c(), h("span", {
            key: u,
            class: "cell"
          }, $(d), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", _m, $(e.empty), 1)) : O("", !0)
    ]));
  }
}, Am = /* @__PURE__ */ J(Em, [["__scopeId", "data-v-9326a52e"]]), Cm = { class: "stat-value" }, Om = { class: "stat-label" }, Tm = {
  key: 0,
  class: "stat-note"
}, Rm = {
  __name: "StatTile",
  props: {
    label: { type: String, required: !0 },
    value: { type: [String, Number], required: !0 },
    note: { type: String, default: "" },
    tone: { type: String, default: "" },
    opens: Boolean
  },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), H(ht(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: X(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: j(() => [
        g("span", Cm, $(e.value), 1),
        g("span", Om, $(e.label), 1),
        e.note ? (c(), h("span", Tm, $(e.note), 1)) : O("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Im = /* @__PURE__ */ J(Rm, [["__scopeId", "data-v-ad0db6d6"]]), Bm = { class: "code" }, Lm = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (c(), H(Pt, {
      value: e.node.type
    }, {
      stack: j(() => [
        L(Tn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: j(() => [
        L(Tn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: j(() => [
        L(Tn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: j(() => [
        L(Df, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: j(() => [
        g("h3", {
          class: X(["heading", `level-${e.node.level || 2}`])
        }, $(e.node.text), 3)
      ]),
      divider: j(() => [...l[2] || (l[2] = [
        g("hr", { class: "divider" }, null, -1)
      ])]),
      stat: j(() => [
        L(Im, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (r) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: j(() => [
        L(Tf, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: j(() => [
        L(Am, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: j(() => [
        L(Mm, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: j(() => [
        L(kt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: j(() => [
        L(bm, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: j(() => [
        L(Wl, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: j(() => [
        g("pre", Bm, [
          g("code", null, $(e.node.text), 1)
        ])
      ]),
      file: j(() => [
        g("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (r) => s(e.node))
        }, $(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), ar = /* @__PURE__ */ J(Lm, [["__scopeId", "data-v-cbdcf540"]]), Nm = { class: "dashboard" }, Dm = { class: "trail" }, jm = ["onClick"], Pm = {
  key: 0,
  class: "gone",
  role: "status"
}, qm = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (m) => m in (n.document.pages || {}), o = I(!!n.page && !s(n.page)), l = I(n.page && !o.value ? [n.page] : []), r = T(() => l.value.at(-1) || n.document.start), i = T(() => (n.document.pages || {})[r.value] || null), d = (m) => ((n.document.pages || {})[m] || {}).title || m, u = (m) => {
      o.value = !1, l.value = [...l.value, m];
    }, f = (m) => {
      o.value = !1, l.value = l.value.slice(0, m);
    };
    return he(
      () => n.document.start,
      () => l.value = []
    ), (m, v) => (c(), h("div", Nm, [
      e.document.broken ? (c(), H(Qt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: j(() => [
          ee($(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), H(Qt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: j(() => [
          ee($(e.document.missing), 1)
        ]),
        _: 1
      })) : i.value ? (c(), h(V, { key: 2 }, [
        g("nav", Dm, [
          g("button", {
            type: "button",
            class: X(["step", { current: !l.value.length }]),
            onClick: v[0] || (v[0] = (y) => f(0))
          }, $(d(e.document.start)), 3),
          (c(!0), h(V, null, te(l.value, (y, A) => (c(), h(V, {
            key: `${A}-${y}`
          }, [
            v[2] || (v[2] = g("span", { class: "sep" }, "/", -1)),
            g("button", {
              type: "button",
              class: X(["step", { current: A === l.value.length - 1 }]),
              onClick: (R) => f(A + 1)
            }, $(d(y)), 11, jm)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", Pm, "What you opened is no longer in this dashboard. Here is its start page.")) : O("", !0),
        L(jt, {
          name: "page",
          mode: "out-in"
        }, {
          default: j(() => [
            (c(), h("div", {
              key: r.value,
              class: "page"
            }, [
              L(ar, {
                node: i.value.view,
                onOpen: u,
                onFile: v[1] || (v[1] = (y) => a("file", y))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : O("", !0)
    ]));
  }
}, Fm = /* @__PURE__ */ J(qm, [["__scopeId", "data-v-fbe83734"]]), sr = {
  runningTool: 1e3,
  agentCommand: 5e3,
  planCard: 3e3,
  openPanel: 5e3,
  documentWithNoEvents: 6e4,
  pageOfAgents: 3e3,
  projectHooks: 1e4,
  numbers: 1e4,
  services: 15e3,
  libraryCopies: 3e4,
  systemLogs: 5e3
};
function Wm(e, t) {
  const n = We(), a = gl(e, sr.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Re(e), ft(() => {
    s(), a.cancel();
  });
}
const Hm = {
  key: 0,
  class: "window-failure"
}, Um = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = We(), o = I(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? Wm(l, n.events) : gs(l, () => !0, sr.documentWithNoEvents), (r, i) => o.value && !o.value.ok ? (c(), h("p", Hm, $(o.value.error), 1)) : o.value ? (c(), H(Fm, {
      key: 1,
      document: o.value.value,
      onFile: i[0] || (i[0] = (d) => a("file", d))
    }, null, 8, ["document"])) : O("", !0);
  }
}, ot = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, qe = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Pe = { across: 48, down: 110, margin: 32, labelSpace: 14 }, zm = 6;
function Cs(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Vm = (e) => {
  const t = Cs(e, ot.lineChars), n = Math.max(ot.minWidth, Math.max(...t.map((a) => a.length)) * ot.charWidth + ot.padX * 2);
  return { name: e, lines: t, line: ot.line, padY: ot.padY, width: n, height: t.length * ot.line + ot.padY * 2 };
};
function Gm(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((r, i) => {
      if (r[0] !== l) return;
      const d = s.get(r[1]);
      d === "open" ? a.add(i) : d || o(r[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function Km(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function Ym(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var r;
    return (a[r = n.get(l)] || (a[r] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((r, i) => [r, i]))), o = (l, r) => {
    const i = s(), d = (u) => {
      const f = r(u).map((m) => i.get(m));
      return f.length ? f.reduce((m, v) => m + v, 0) / f.length : i.get(u);
    };
    return [...l].sort((u, f) => d(u) - d(f));
  };
  for (let l = 0; l < zm; l++) {
    const r = l % 2 === 0, i = a.map((d, u) => u);
    (r ? i.slice(1) : i.slice(0, -1).reverse()).forEach((d) => {
      const u = (f) => t.filter((m) => m[r ? 1 : 0] === f).map((m) => m[r ? 0 : 1]);
      a[d] = o(a[d], u);
    });
  }
  return a;
}
function Jm(e, t) {
  const n = /* @__PURE__ */ new Map(), a = (s, o, l, r) => {
    const i = `${s[o]}:${l}`;
    (n.get(i) || n.set(i, []).get(i)).push({ arrow: s, end: o, other: r });
  };
  e.forEach((s) => {
    a(s, "from", s.back ? "top" : "bottom", s.to), a(s, "to", s.back ? "bottom" : "top", s.from);
  });
  for (const s of n.values())
    s.sort((o, l) => t.get(o.other).x - t.get(l.other).x), s.forEach(({ arrow: o, end: l }, r) => o[`${l}Share`] = (r + 1) / (s.length + 1));
}
function Zm(e) {
  const t = [...new Set(e.flatMap(([N, B]) => [N, B]))], n = new Set(e.map(([, N]) => N)), a = t.filter((N) => !n.has(N)), s = Gm(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((N, B) => !s.has(B)), l = Km(t, o), r = Ym(t, o, l), i = new Map(t.map((N) => [N, Vm(N)])), d = r.map((N) => N.reduce((B, F) => B + i.get(F).width, 0) + Pe.across * (N.length - 1)), u = Math.max(...d) + Pe.margin * 2, f = Qm(e, l, r.length), m = /* @__PURE__ */ new Map();
  let v = Pe.margin;
  r.forEach((N, B) => {
    let F = (u - d[B]) / 2;
    const E = Math.max(...N.map((_) => i.get(_).height));
    N.forEach((_) => {
      const w = i.get(_);
      m.set(_, { ...w, x: F, y: v + (E - w.height) / 2 }), F += w.width + Pe.across;
    }), v += E + (f[B] ?? Pe.down);
  });
  const y = e.map(([N, B, F], E) => ({ from: N, to: B, label: F || "", back: s.has(E) || l.get(B) <= l.get(N) }));
  Jm(y, m);
  const A = y.map((N) => e1(N, m.get(N.from), m.get(N.to))), R = [...m.values()], S = s1(A, R), D = Math.max(v - Pe.down, ...S.filter((N) => N.label).map((N) => N.label.y + N.label.height));
  return { width: Math.max(u - Pe.margin, ...S.filter((N) => N.label).map((N) => N.label.x + N.label.width)) + Pe.margin, height: D + Pe.margin, nodes: R, arrows: S };
}
const Xm = (e) => e ? Cs(e, qe.lineChars).length * qe.line + qe.pad * 2 : 0;
function Qm(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Pe.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [r, i] = [t.get(s), t.get(o)].sort((d, u) => d - u);
    i > r && (a[r + Math.floor((i - r - 1) / 2)] += Xm(l) + Pe.labelSpace);
  }), a.map((s) => Math.max(Pe.down, s));
}
function e1(e, t, n) {
  const a = e.label ? Cs(e.label, qe.lineChars) : [], s = a.length ? Math.max(...a.map((m) => m.length)) * qe.charWidth + qe.pad * 2 : 0, o = a.length * qe.line + (a.length ? qe.pad * 2 : 0), l = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, d = e.back ? n.y + n.height : n.y, u = (d - r) / 2, f = [{ x: l, y: r }, { x: l, y: r + u }, { x: i, y: d - u }, { x: i, y: d }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: f, path: `M${l} ${r} C${l} ${r + u} ${i} ${d - u} ${i} ${d}` };
}
const t1 = ([e, t, n, a], s) => {
  const o = 1 - s, l = (r) => o * o * o * e[r] + 3 * o * o * s * t[r] + 3 * o * s * s * n[r] + s * s * s * a[r];
  return { x: l("x"), y: l("y") };
}, n1 = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], a1 = [0, -1, 1, -2, 2, -3, 3].map((e) => e * qe.line);
function s1(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, d) => {
      const u = t1(a.curve, i);
      return { x: u.x - a.labelWidth / 2, y: u.y - a.labelHeight / 2 + d, width: a.labelWidth, height: a.labelHeight };
    }, r = a1.flatMap((i) => n1.map((d) => s(d, i))).find((i) => !n.some((d) => vo(i, d))) ?? s(0.5, 0);
    for (; n.some((i) => vo(r, i)); ) r.y += qe.line;
    return n.push(r), { ...a, label: { ...r, lines: a.lines, line: qe.line, pad: qe.pad } };
  });
}
const vo = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, o1 = { class: "flowchart-tools" }, l1 = ["width", "height", "viewBox", "aria-label"], r1 = ["d"], i1 = ["x", "y", "width", "height"], c1 = ["x", "y"], u1 = ["x", "dy"], d1 = {
  key: 0,
  class: "flowchart-label"
}, f1 = ["x", "y", "width", "height"], h1 = ["x", "y"], m1 = ["x", "dy"], p1 = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(() => Zm(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = I(null), r = I({ zoom: 1, x: 0, y: 0 });
    let i = null;
    function d() {
      var S;
      const A = (S = l.value) == null ? void 0 : S.getBoundingClientRect();
      if (!(A != null && A.width)) return;
      const R = Math.min(A.width / s.value.width, A.height / s.value.height, 1.5);
      r.value = { zoom: R, x: (A.width - s.value.width * R) / 2, y: (A.height - s.value.height * R) / 2 };
    }
    function u(A, R, S) {
      const { zoom: D, x: U, y: N } = r.value, B = Math.min(o.most, Math.max(o.least, D * A));
      r.value = { zoom: B, x: R - (R - U) * B / D, y: S - (S - N) * B / D };
    }
    function f(A) {
      const R = l.value.getBoundingClientRect();
      u(A, R.width / 2, R.height / 2);
    }
    function m(A) {
      const R = l.value.getBoundingClientRect();
      A.ctrlKey || A.metaKey ? u(A.deltaY < 0 ? o.step : 1 / o.step, A.clientX - R.left, A.clientY - R.top) : r.value = { ...r.value, x: r.value.x - A.deltaX, y: r.value.y - A.deltaY };
    }
    function v(A) {
      var R, S, D;
      A.preventDefault(), (R = window.getSelection()) == null || R.removeAllRanges(), i = { x: A.clientX - r.value.x, y: A.clientY - r.value.y }, (D = (S = l.value).setPointerCapture) == null || D.call(S, A.pointerId);
    }
    function y(A) {
      i && (r.value = { ...r.value, x: A.clientX - i.x, y: A.clientY - i.y });
    }
    return Re(d), (A, R) => (c(), H(Ms, {
      title: e.title,
      large: "",
      onClose: R[4] || (R[4] = (S) => a("close"))
    }, {
      default: j(() => [
        g("div", o1, [
          L(ue, {
            small: "",
            onClick: R[0] || (R[0] = (S) => f(o.step))
          }, {
            default: j(() => [...R[5] || (R[5] = [
              ee("Zoom in", -1)
            ])]),
            _: 1
          }),
          L(ue, {
            small: "",
            onClick: R[1] || (R[1] = (S) => f(1 / o.step))
          }, {
            default: j(() => [...R[6] || (R[6] = [
              ee("Zoom out", -1)
            ])]),
            _: 1
          }),
          L(ue, {
            small: "",
            onClick: d
          }, {
            default: j(() => [...R[7] || (R[7] = [
              ee("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        g("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: $e(m, ["prevent"]),
          onPointerdown: v,
          onPointermove: y,
          onPointerup: R[2] || (R[2] = (S) => Vs(i) ? i.value = null : i = null),
          onPointercancel: R[3] || (R[3] = (S) => Vs(i) ? i.value = null : i = null)
        }, [
          (c(), h("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: ge({ transform: `translate(${r.value.x}px, ${r.value.y}px) scale(${r.value.zoom})` })
          }, [
            R[8] || (R[8] = g("defs", null, [
              g("marker", {
                id: "flowchart-head",
                viewBox: "0 0 10 10",
                refX: "9",
                refY: "5",
                markerWidth: "7",
                markerHeight: "7",
                orient: "auto"
              }, [
                g("path", { d: "M0 0L10 5L0 10z" })
              ])
            ], -1)),
            (c(!0), h(V, null, te(s.value.arrows, (S, D) => (c(), h("path", {
              key: `arrow-${D}`,
              class: "flowchart-arrow",
              d: S.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, r1))), 128)),
            (c(!0), h(V, null, te(s.value.nodes, (S) => (c(), h("g", {
              key: S.name,
              class: "flowchart-node"
            }, [
              g("rect", {
                x: S.x,
                y: S.y,
                width: S.width,
                height: S.height,
                rx: "8"
              }, null, 8, i1),
              g("text", {
                x: S.x + S.width / 2,
                y: S.y + S.padY + S.line / 2
              }, [
                (c(!0), h(V, null, te(S.lines, (D, U) => (c(), h("tspan", {
                  key: U,
                  x: S.x + S.width / 2,
                  dy: U ? S.line : 0
                }, $(D), 9, u1))), 128))
              ], 8, c1)
            ]))), 128)),
            (c(!0), h(V, null, te(s.value.arrows, (S, D) => (c(), h(V, {
              key: `label-${D}`
            }, [
              S.label ? (c(), h("g", d1, [
                g("rect", {
                  x: S.label.x,
                  y: S.label.y,
                  width: S.label.width,
                  height: S.label.height,
                  rx: "4"
                }, null, 8, f1),
                g("text", {
                  x: S.label.x + S.label.width / 2,
                  y: S.label.y + S.label.pad + S.label.line / 2
                }, [
                  (c(!0), h(V, null, te(S.label.lines, (U, N) => (c(), h("tspan", {
                    key: N,
                    x: S.label.x + S.label.width / 2,
                    dy: N ? S.label.line : 0
                  }, $(U), 9, m1))), 128))
                ], 8, h1)
              ])) : O("", !0)
            ], 64))), 128))
          ], 12, l1))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, g1 = /* @__PURE__ */ J(p1, [["__scopeId", "data-v-51d24cfe"]]), yo = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', bo = {
  words: '<rect x="2.5" y="3" width="11" height="8" rx="2"/><polyline points="5,11 5,13.5 8,11"/>',
  summary: '<line x1="3" y1="4.5" x2="13" y2="4.5"/><line x1="3" y1="8" x2="11" y2="8"/><line x1="3" y1="11.5" x2="8" y2="11.5"/>',
  warning: '<polygon points="8,2.5 14,13 2,13"/><line x1="8" y1="6.5" x2="8" y2="9.3"/><circle class="f" cx="8" cy="11.2" r=".75"/>',
  visitor: '<circle cx="6.5" cy="5.5" r="2.3"/><path d="M2.5 13.5c0-2.3 1.8-3.8 4-3.8s4 1.5 4 3.8"/><line x1="12" y1="4" x2="14" y2="4"/><line x1="12" y1="6.5" x2="14" y2="6.5"/>',
  flowchart: '<rect x="5.5" y="2" width="5" height="3.5" rx="1"/><rect x="1.5" y="10.5" width="5" height="3.5" rx="1"/><rect x="9.5" y="10.5" width="5" height="3.5" rx="1"/><polyline points="8,5.5 8,8 4,8 4,10.5"/><polyline points="8,8 12,8 12,10.5"/>',
  skill: '<rect x="3" y="2.5" width="10" height="11" rx="1.5"/><line x1="6" y1="2.5" x2="6" y2="13.5"/>',
  compact: '<polyline points="5,2.5 8,5.5 11,2.5"/><polyline points="5,13.5 8,10.5 11,13.5"/><line x1="2.5" y1="8" x2="13.5" y2="8"/>',
  rule: '<path d="M4 13.5V6.5a4 4 0 0 1 8 0v7z"/><line x1="6.3" y1="7.6" x2="9.7" y2="7.6"/><line x1="6.3" y1="10.3" x2="9.7" y2="10.3"/>',
  fact: '<circle cx="8" cy="6" r="3.2"/><line x1="8" y1="9.2" x2="8" y2="14"/>',
  reminder: '<path d="M4 11V7.5a4 4 0 0 1 8 0V11l1 1.2H3z"/><line x1="6.8" y1="14.2" x2="9.2" y2="14.2"/>',
  ack: '<path d="M4 11V7.5a4 4 0 0 1 8 0V11l1 1.2H3z"/><polyline points="6.2,7.8 7.6,9.2 10,6.6"/>',
  task: '<rect x="3" y="3" width="10" height="10" rx="2"/>',
  task_start: '<rect x="3" y="3" width="10" height="10" rx="2"/><polygon class="f" points="6.8,5.8 10.4,8 6.8,10.2"/>',
  task_done: '<rect x="3" y="3" width="10" height="10" rx="2"/><polyline points="5.6,8.1 7.3,9.8 10.4,6.3"/>',
  task_pause: '<rect x="3" y="3" width="10" height="10" rx="2"/><line x1="6.8" y1="6" x2="6.8" y2="10"/><line x1="9.2" y1="6" x2="9.2" y2="10"/>',
  task_block: '<rect x="3" y="3" width="10" height="10" rx="2"/><line x1="5.6" y1="8" x2="10.4" y2="8"/>',
  stuck: '<circle cx="8" cy="8" r="5.5"/><line x1="4.2" y1="11.8" x2="11.8" y2="4.2"/>',
  request: '<path d="M2.5 9l1.8-5.5h7.4L13.5 9v3.5h-11z"/><polyline points="2.5,9 6,9 6.8,10.5 9.2,10.5 10,9 13.5,9"/>',
  filed: '<polyline points="2.5,10 2.5,13 13.5,13 13.5,10"/><line x1="8" y1="2.5" x2="8" y2="9.5"/><polyline points="5.5,7 8,9.5 10.5,7"/>',
  question: '<circle cx="8" cy="8" r="5.5"/><path d="M6.4 6.6a1.7 1.7 0 1 1 2.4 1.5c-.5.3-.8.6-.8 1.2"/><circle class="f" cx="8" cy="11.1" r=".7"/>',
  answered: '<circle cx="8" cy="8" r="5.5"/><polyline points="5.6,8.1 7.3,9.8 10.4,6.3"/>',
  sequence: '<circle cx="4" cy="4" r="1.3"/><circle cx="4" cy="8" r="1.3"/><circle cx="4" cy="12" r="1.3"/><line x1="7" y1="4" x2="13" y2="4"/><line x1="7" y1="8" x2="13" y2="8"/><line x1="7" y1="12" x2="11" y2="12"/>',
  step: '<polyline points="6,4 10,8 6,12"/>',
  agent: yo,
  worker: yo,
  subagent: '<circle cx="6.5" cy="6" r="2.2"/><path d="M2.5 13.5c0-2.4 1.8-4 4-4s4 1.6 4 4"/><circle cx="12" cy="4" r="1.4"/>',
  send: '<line x1="2.5" y1="8" x2="13" y2="8"/><polyline points="9,4 13,8 9,12"/>',
  receive: '<line x1="13.5" y1="8" x2="3" y2="8"/><polyline points="7,4 3,8 7,12"/>',
  report: '<rect x="3.5" y="2.5" width="9" height="11" rx="1.5"/><line x1="6" y1="6" x2="10" y2="6"/><line x1="6" y1="8.5" x2="10" y2="8.5"/><line x1="6" y1="11" x2="8.5" y2="11"/>',
  document: '<path d="M4 2.5h5.5l3 3v8h-8.5z"/><polyline points="9.5,2.5 9.5,5.5 12.5,5.5"/>',
  fitness: '<polyline points="2,9 5,9 6.5,5 9,12 10.5,8 14,8"/>',
  worker_step: '<path d="M12.5 6.5A5 5 0 0 0 3.6 6.6"/><polyline points="3.2,3.8 3.6,6.6 6.3,6.2"/><path d="M3.5 9.5a5 5 0 0 0 8.9-.1"/><polyline points="12.8,12.2 12.4,9.4 9.7,9.8"/>',
  trigger: '<polygon points="9,2 4,9 8,9 7,14 12,7 8,7"/>',
  check: '<circle cx="8" cy="8" r="5.5"/><polyline points="5.6,8.1 7.3,9.8 10.4,6.3"/>',
  check_fail: '<circle cx="8" cy="8" r="5.5"/><line x1="6" y1="6" x2="10" y2="10"/><line x1="10" y1="6" x2="6" y2="10"/>',
  terminal: '<rect x="2" y="3" width="12" height="10" rx="2"/><polyline points="5,6.5 7,8 5,9.5"/><line x1="8.5" y1="10" x2="11" y2="10"/>',
  verifier: '<path d="M8 2.5l4.5 1.8v3.6c0 2.8-2 4.8-4.5 5.6-2.5-.8-4.5-2.8-4.5-5.6V4.3z"/><polyline points="6,8 7.5,9.5 10,6.8"/>',
  review: '<path d="M2 8s2.2-4 6-4 6 4 6 4-2.2 4-6 4-6-4-6-4z"/><circle cx="8" cy="8" r="1.6"/>',
  menu: '<circle class="f" cx="3.5" cy="8" r="1"/><line x1="6" y1="4.5" x2="13" y2="4.5"/><line x1="6" y1="8" x2="13" y2="8"/><line x1="6" y1="11.5" x2="13" y2="11.5"/>',
  commit: '<circle cx="8" cy="8" r="2.5"/><line x1="2" y1="8" x2="5.5" y2="8"/><line x1="10.5" y1="8" x2="14" y2="8"/>',
  worktree: '<circle cx="5" cy="3.5" r="1.5"/><circle cx="5" cy="12.5" r="1.5"/><circle cx="11" cy="5.5" r="1.5"/><line x1="5" y1="5" x2="5" y2="11"/><path d="M11 7c0 2.6-6 2-6 4"/>',
  push: '<line x1="8" y1="11.5" x2="8" y2="3"/><polyline points="4.5,6.5 8,3 11.5,6.5"/><line x1="3" y1="13.5" x2="13" y2="13.5"/>',
  branch: '<line x1="3" y1="5.5" x2="12" y2="5.5"/><polyline points="9.5,3 12,5.5 9.5,8"/><line x1="13" y1="10.5" x2="4" y2="10.5"/><polyline points="6.5,8 4,10.5 6.5,13"/>',
  plugin: '<rect x="4" y="6" width="8" height="5" rx="1.5"/><line x1="6.5" y1="3" x2="6.5" y2="6"/><line x1="9.5" y1="3" x2="9.5" y2="6"/><line x1="8" y1="11" x2="8" y2="14"/>',
  phone: '<rect x="4.5" y="1.8" width="7" height="12.4" rx="1.8"/><line x1="7" y1="12" x2="9" y2="12"/>',
  share: '<path d="M6.5 9.5l5-5"/><polyline points="8,4.5 11.5,4.5 11.5,8"/><path d="M9.5 9.5v3a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h3"/>',
  search: '<circle cx="7" cy="7" r="4"/><line x1="10" y1="10" x2="13.5" y2="13.5"/>',
  update: '<path d="M13 8a5 5 0 1 1-1.5-3.6"/><polyline points="11.8,1.9 11.6,4.6 8.9,4.4"/>',
  bulb: '<circle cx="8" cy="6.5" r="4"/><line x1="6.5" y1="12" x2="9.5" y2="12"/><line x1="7" y1="14" x2="9" y2="14"/>',
  conflict: '<rect x="2.5" y="5" width="7" height="7" rx="1.5"/><rect x="6.5" y="2.5" width="7" height="7" rx="1.5"/>',
  plan: '<line x1="4" y1="2.5" x2="4" y2="14"/><path d="M4 3h8l-2 2.8 2 2.7H4"/>',
  dock: '<rect x="2.5" y="2.5" width="11" height="11" rx="2"/><line x1="2.5" y1="6" x2="13.5" y2="6"/>',
  fold: '<polyline points="4,6 8,10 12,6"/>',
  open: '<path d="M7.5 3.5H5a1.5 1.5 0 0 0-1.5 1.5v6A1.5 1.5 0 0 0 5 12.5h6a1.5 1.5 0 0 0 1.5-1.5V8.5"/><line x1="8" y1="8" x2="12.5" y2="3.5"/><polyline points="9.5,3.5 12.5,3.5 12.5,6.5"/>',
  stop: '<circle cx="8" cy="8" r="5.75"/><rect class="f" x="5.9" y="5.9" width="4.2" height="4.2" rx=".9"/>',
  stopped: '<rect class="f" x="4" y="4" width="8" height="8" rx="1.6"/>',
  runs: '<rect x="2.5" y="6.5" width="11" height="7" rx="1.8"/><line x1="4.5" y1="4.3" x2="11.5" y2="4.3"/><line x1="6" y1="2.2" x2="10" y2="2.2"/>',
  linked: '<path d="M6.8 9.2l2.4-2.4"/><path d="M7.4 5.6l1-1a2.3 2.3 0 0 1 3.2 3.2l-1 1"/><path d="M8.6 10.4l-1 1a2.3 2.3 0 0 1-3.2-3.2l1-1"/>',
  close: '<line x1="4.5" y1="4.5" x2="11.5" y2="11.5"/><line x1="11.5" y1="4.5" x2="4.5" y2="11.5"/>',
  tick: '<polyline points="3.5,8.3 6.5,11.2 12.5,4.8"/>',
  cross: '<line x1="4.5" y1="4.5" x2="11.5" y2="11.5"/><line x1="11.5" y1="4.5" x2="4.5" y2="11.5"/>',
  bang: '<line x1="8" y1="3.5" x2="8" y2="9"/><circle class="f" cx="8" cy="12" r="1"/>',
  file: '<path d="M4.5 2.5h4.5l2.5 2.5v8.5h-7z"/>',
  hash: '<line x1="6" y1="3" x2="5" y2="13"/><line x1="11" y1="3" x2="10" y2="13"/><line x1="3" y1="6.5" x2="13" y2="6.5"/><line x1="3" y1="10" x2="13" y2="10"/>',
  dot: '<circle class="f" cx="8" cy="8" r="2.5"/>',
  window: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><line x1="2.5" y1="6" x2="13.5" y2="6"/>'
}, v1 = ["innerHTML"], y1 = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = T(() => bo[t.name] || bo.dot);
    return (a, s) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, v1));
  }
}, dt = /* @__PURE__ */ J(y1, [["__scopeId", "data-v-beb5935c"]]), b1 = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: X(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      L(dt, { name: "fold" })
    ], 2));
  }
}, xt = /* @__PURE__ */ J(b1, [["__scopeId", "data-v-d03899bb"]]), w1 = ["data-tip", "aria-label"], k1 = {
  key: 0,
  class: "mact-word"
}, $1 = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: X(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      L(dt, { name: "open" }),
      e.open ? (c(), h("span", k1, $(e.label), 1)) : O("", !0),
      n[0] || (n[0] = g("span", { class: "hit" }, null, -1))
    ], 10, w1));
  }
}, or = /* @__PURE__ */ J($1, [["__scopeId", "data-v-3b292e09"]]), lr = 120, Rn = 280, rr = 160, x1 = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, M1 = ["leaving", "resizing", "entering"];
function ts(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function S1(e) {
  const t = M1.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = ts(e);
  return e.classList.add(...t), n;
}
function ir(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = I(t()), s = I("");
  let o = 0;
  const l = (f, m) => Object.assign(f.style, { width: `${m.width}px`, height: `${m.height}px` }), r = (f) => Object.assign(f.style, { width: "", height: "", transition: "" });
  function i(f, m) {
    r(f);
    const v = S1(f);
    l(f, m), f.offsetWidth, f.style.transition = `width ${Rn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Rn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(f, v);
  }
  function d(f) {
    const m = f.querySelector(":scope > :not(.top)");
    if (!m || typeof ResizeObserver > "u") return null;
    let v = m.offsetHeight;
    const y = new ResizeObserver(() => {
      m.offsetHeight !== v && (v = m.offsetHeight, i(f, ts(f)));
    });
    return y.observe(m), y;
  }
  async function u(f) {
    const m = e.value, v = ++o;
    if (!m || !m.offsetWidth || x1()) {
      a.value = f;
      return;
    }
    const y = ts(m);
    if (l(m, y), s.value = "leaving", await n(lr), v !== o) return;
    a.value = f, s.value = "resizing", await mt(), i(m, y);
    const A = d(m);
    await n(Rn), A == null || A.disconnect(), v === o && (r(m), s.value = "entering", await n(rr), v === o && (s.value = ""));
  }
  return he(t, (f) => u(f)), ft(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const _1 = { class: "growing-card-top" }, E1 = ["aria-expanded"], A1 = { class: "growing-card-avatar" }, C1 = { class: "growing-card-title" }, O1 = { class: "growing-card-more" }, T1 = { class: "growing-card-body" }, R1 = {
  __name: "GrowingCard",
  props: {
    title: { type: String, required: !0 },
    text: { type: String, default: "" },
    icon: { type: String, default: "agents" },
    person: { type: String, default: "" },
    bad: Boolean,
    action: { type: String, default: "" },
    incoming: Boolean,
    commentable: Boolean
  },
  emits: ["act", "comment"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(!1), o = I(null), { folded: l, phase: r } = ir(o, () => !s.value), i = T(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), d = T(() => n.text.split(/\n\s*\n/).filter((u) => u.trim()));
    return (u, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: X(["growing-card-wrap", q(r), { open: !q(l), bad: e.bad, incoming: e.incoming }])
    }, [
      g("div", _1, [
        g("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: f[0] || (f[0] = (m) => s.value = !s.value)
        }, [
          g("span", A1, [
            e.bad ? (c(), H(dt, {
              key: 0,
              name: "cross"
            })) : i.value ? (c(), h(V, { key: 1 }, [
              ee($(i.value), 1)
            ], 64)) : (c(), H(ye, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          g("span", C1, $(e.title), 1),
          L(xt, { open: s.value }, null, 8, ["open"])
        ], 8, E1),
        e.action ? (c(), H(or, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: f[1] || (f[1] = (m) => a("act"))
        }, null, 8, ["label", "open"])) : O("", !0),
        e.commentable ? (c(), h("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: f[2] || (f[2] = (m) => a("comment"))
        }, [
          L(ye, {
            name: "bubble",
            size: 13
          })
        ])) : O("", !0)
      ]),
      g("div", O1, [
        g("div", T1, [
          (c(!0), h(V, null, te(d.value, (m, v) => (c(), h("p", {
            key: v,
            class: "growing-card-text"
          }, $(m), 1))), 128))
        ])
      ])
    ], 2));
  }
}, I1 = /* @__PURE__ */ J(R1, [["__scopeId", "data-v-f2b4930d"]]), B1 = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, L1 = { class: "md inline" }, N1 = ["disabled", "title", "onClick"], D1 = {
  key: 1,
  class: "message-links-many"
}, j1 = ["aria-expanded"], P1 = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, q1 = ["disabled", "onClick"], F1 = { class: "row-pill message-links-chip" }, W1 = { class: "message-links-title" }, H1 = { key: 0 }, ya = 3, U1 = "task", z1 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(() => n.total || n.links.length), o = T(() => n.links.every((m) => m.endpoint.model === U1) ? "tasks" : "items"), l = I(!1), r = I(null);
    bl(r, () => l.value = !1);
    const i = () => l.value = !l.value, d = (m) => m.endpoint.unavailable || !m.endpoint.open_ref, u = (m) => m.relations.includes("edited") ? m.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function f(m) {
      d(m) || (l.value = !1, Fe(m.endpoint.open_ref));
    }
    return (m, v) => (c(), h("div", {
      ref_key: "line",
      ref: r,
      class: X(["message-links", { many: s.value > ya, three: s.value === ya, open: l.value }]),
      "data-message-links": ""
    }, [
      L(dt, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (c(), h("span", B1, [
        g("span", L1, [
          v[1] || (v[1] = ee("Linked: ", -1)),
          (c(!0), h(V, null, te(e.links, (y) => (c(), h("button", {
            key: `${y.endpoint.model}:${y.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: d(y),
            title: y.endpoint.title,
            onClick: (A) => f(y)
          }, [
            ee($(y.endpoint.model.replaceAll("_", " ")) + " " + $(y.endpoint.id), 1),
            u(y) ? (c(), h(V, { key: 0 }, [
              ee(" (" + $(u(y)) + ")", 1)
            ], 64)) : O("", !0),
            d(y) ? (c(), h(V, { key: 1 }, [
              ee(" (unavailable)")
            ], 64)) : O("", !0)
          ], 8, N1))), 128))
        ])
      ])) : O("", !0),
      s.value >= ya ? (c(), h("span", D1, [
        g("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: i
        }, [
          ee($(s.value) + " linked " + $(o.value) + " ", 1),
          L(xt, { open: l.value }, null, 8, ["open"])
        ], 8, j1)
      ])) : O("", !0),
      l.value ? (c(), h("div", P1, [
        (c(!0), h(V, null, te(e.links, (y) => (c(), h("button", {
          key: `${y.endpoint.model}:${y.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: d(y),
          onClick: (A) => f(y)
        }, [
          g("span", F1, $(y.endpoint.model.replaceAll("_", " ")) + " " + $(y.endpoint.id), 1),
          g("span", W1, $(y.endpoint.title), 1),
          g("span", null, $(u(y)), 1),
          d(y) ? (c(), h("span", H1, "Unavailable")) : O("", !0)
        ], 8, q1))), 128))
      ])) : O("", !0),
      L(Qn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: v[0] || (v[0] = (y) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, V1 = /* @__PURE__ */ J(z1, [["__scopeId", "data-v-e9bc783c"]]), G1 = ["title", "aria-label"], K1 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Y1 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, J1 = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = T(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (c(), h("span", {
      class: X(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (c(), h("svg", K1, [
        o[0] || (o[0] = g("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (c(), h("path", Y1)) : O("", !0)
      ]))
    ], 10, G1));
  }
}, Z1 = /* @__PURE__ */ J(J1, [["__scopeId", "data-v-6dc92808"]]);
function X1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function cr(e, t = Date.now()) {
  const n = X1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const Q1 = 36e5;
function x4(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / Q1;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function ur(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function wo(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const ba = (e) => String(e).padStart(2, "0");
function ep(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${ba(t % 60)}s` : `${Math.floor(t / 3600)}h ${ba(Math.floor(t % 3600 / 60))}m ${ba(t % 60)}s`;
}
const tp = "img,pre,table";
function np(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function ap(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function sp(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(tp)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = np(ap(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function op(e, t) {
  let n = null;
  const a = () => e.value && sp(e.value);
  Re(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== s && (s = r.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Be(() => n == null ? void 0 : n.disconnect()), he(t, a, { flush: "post" });
}
const lp = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function rp(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const xn = /* @__PURE__ */ new WeakMap(), Ge = "work", Ut = "sent", ip = 50, ko = () => ({ rows: I([]), total: I(0), next: I(null), loading: I(!1), failure: I(""), version: 0 });
function cp(e) {
  var f;
  if (xn.has(e)) return xn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (m) => {
    var v;
    return ((v = e.visible) == null ? void 0 : v.value) !== !1 && [...m.views].some((y) => y.visible);
  };
  async function o(m, v, y = 1) {
    const A = m[v], R = ++A.version;
    A.loading.value = !0, A.failure.value = "";
    const S = v === Ge ? "--type about --type edited --group-counterparts" : "--type sent_to", D = `link list --source message:${m.id} ${S} --page ${y} --page-size ${v === Ge ? 10 : 25}`;
    try {
      const U = await e.read(D);
      if (t.get(m.id) !== m || A.version !== R) return;
      if (!U.ok) {
        A.failure.value = U.error;
        return;
      }
      const N = v === Ge ? U.value.counterparts ?? [] : U.value.rows ?? [], B = y === 1 ? N : [...A.rows.value, ...N], F = v === Ge ? (E) => `${E.endpoint.model}:${E.endpoint.id}` : (E) => E.id ?? E.target_id;
      A.rows.value = [...new Map(B.map((E) => [F(E), E])).values()], A.total.value = U.value.total ?? A.rows.value.length, A.next.value = U.value.next_page ?? null;
    } catch (U) {
      A.version === R && (A.failure.value = U.message);
    } finally {
      A.version === R && (A.loading.value = !1);
    }
  }
  function l() {
    a = null;
    const m = [...n].map((v) => t.get(v)).filter((v) => v && s(v));
    n.clear();
    for (const v of m) {
      const y = [...v.dirty];
      v.dirty.clear();
      for (const A of y) o(v, A);
    }
  }
  function r(m, v = [Ge, Ut]) {
    for (const y of v) m.dirty.add(y);
    s(m) && (n.add(m.id), a ?? (a = setTimeout(l, 0)));
  }
  function i(m) {
    const v = m.sources ?? (m.source_model && Number.isInteger(m.source_id) ? [{ model: m.source_model, id: m.source_id }] : []), y = m.link_types ?? (m.link_type ? [m.link_type] : []), A = y.length ? [Ge, Ut].filter((S) => S === Ge ? y.some((D) => ["about", "edited"].includes(D)) : y.includes("sent_to")) : [Ge, Ut];
    if (!A.length) return;
    const R = v.length ? [...new Set(v.filter((S) => S.model === "message").map((S) => S.id))].map((S) => t.get(S)).filter(Boolean) : [...t.values()].filter(s).slice(0, ip);
    for (const S of R) r(S, A);
  }
  const d = (f = e.follow) == null ? void 0 : f.call(e, ["link.*"], i), u = {
    attach(m, v) {
      let y = t.get(m);
      return y || (y = { id: m, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Ge, Ut]), work: ko(), sent: ko() }, t.set(m, y)), y.views.add(v), y.dirty.size && r(y, [...y.dirty]), y;
    },
    shown(m) {
      m.dirty.size && r(m, [...m.dirty]);
    },
    detach(m, v) {
      m.views.delete(v), m.views.size || t.delete(m.id), t.size || (clearTimeout(a), d == null || d(), xn.delete(e));
    },
    more(m, v) {
      const y = m == null ? void 0 : m[v];
      if (y != null && y.next.value && !y.loading.value) return o(m, v, y.next.value);
    }
  };
  return xn.set(e, u), u;
}
function up(e, t, n) {
  const a = Ke(null);
  let s = null;
  const o = he(t, (l, r, i) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = cp(e);
    const d = { visible: typeof IntersectionObserver > "u" }, u = s.attach(l, d);
    a.value = u;
    const f = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((v) => {
      d.visible = v.some((y) => y.isIntersecting), d.visible && s.shown(u);
    }, { rootMargin: "100px" }), m = he(n, (v) => {
      f == null || f.disconnect(), v && (f == null || f.observe(v));
    }, { immediate: !0, flush: "post" });
    i(() => {
      m(), f == null || f.disconnect(), s.detach(u, d), a.value = null;
    });
  }, { immediate: !0 });
  return ms(o), {
    links: T(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.rows.value) ?? [];
    }),
    total: T(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.total.value) ?? 0;
    }),
    more: T(() => {
      var l;
      return !!((l = a.value) != null && l.work.next.value);
    }),
    loading: T(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.loading.value) ?? !1;
    }),
    failure: T(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.failure.value) ?? "";
    }),
    sentTo: T(() => {
      var l;
      return (((l = a.value) == null ? void 0 : l.sent.rows.value) ?? []).map((r) => r.target);
    }),
    sentMore: T(() => {
      var l;
      return !!((l = a.value) != null && l.sent.next.value);
    }),
    sentLoading: T(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.loading.value) ?? !1;
    }),
    sentFailure: T(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.failure.value) ?? "";
    }),
    loadMore: () => s == null ? void 0 : s.more(a.value, Ge),
    loadSent: () => s == null ? void 0 : s.more(a.value, Ut)
  };
}
const dp = ["data-incoming", "data-ref"], fp = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], hp = { class: "message-body" }, mp = ["title"], pp = ["innerHTML"], gp = ["title"], vp = ["innerHTML"], yp = {
  class: "message-faces",
  "data-message-faces": ""
}, bp = ["title", "data-face", "onClick"], wp = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, kp = ["title", "data-reaction", "onClick"], $p = {
  key: 0,
  class: "message-reaction-count"
}, xp = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Mp = ["href", "title"], Sp = ["src", "alt"], _p = ["href"], Ep = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, Ap = ["disabled", "data-sent-worker", "title", "onClick"], Cp = { class: "message-foot" }, Op = { class: "message-time" }, Tp = {
  class: "message-id",
  "data-message-id": ""
}, Rp = 140, Ip = 2, Bp = 1500, Lp = "An earlier message", Np = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(!1), o = I(null), l = T(() => ["user", "comment"].includes(n.message.type)), r = T(() => {
      const [ve, me] = (n.message.commented_row || ":").split(":"), se = ct(ve);
      return se ? { ref: `${se}:${me}`, label: `${qt(se).title.toLowerCase()} ${me}` } : null;
    }), i = T(() => n.message.worker_id ?? null), d = I(!1), u = T(() => i.value !== null && ((n.message.text ?? "").length > Rp || (n.message.text ?? "").split(`
`).filter((ve) => ve.trim()).length > Ip)), f = T(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var ve;
      await ((ve = navigator.clipboard) == null ? void 0 : ve.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, Bp);
    }
    const v = Gl(), y = T(() => v(n.message.text ?? "")), A = T(() => JSON.parse(n.message.flowchart_edges || "[]")), R = I(!1), S = T(() => v(n.quote || Lp));
    function D() {
      const ve = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      ve ? ve.scrollIntoView({ block: "center", behavior: "smooth" }) : Fe(`messages:${n.message.parent_id}`);
    }
    op(o, () => `${n.message.text} ${n.quote}`);
    const U = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, N = (ve) => `/api/files/message/${n.message.id}/${encodeURIComponent(ve)}`, B = T(() => JSON.parse(n.message.captions || "{}")), F = T(() => (n.message.files ?? []).map((ve) => ({ name: ve, address: N(ve), isImage: U.test(ve), title: B.value[ve] || ve }))), E = T(() => ur(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), _ = Oe(Ne, null), { links: w, total: b, more: k, loading: p, failure: x, sentTo: M, sentMore: C, sentLoading: P, sentFailure: Z, loadMore: ne, loadSent: ie } = up(_, () => l.value && !n.message.local ? n.message.id : null, o), fe = I(!1), Ae = T(() => rp(n.message.reactions));
    function He(ve) {
      fe.value = !1, a("react", n.message, ve);
    }
    return (ve, me) => e.message.peer || e.message.recipient ? (c(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      L(I1, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: me[0] || (me[0] = (se) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, dp)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      g("div", hp, [
        g("div", {
          ref_key: "bubble",
          ref: o,
          class: X(["message-card", "md", { comment: r.value }]),
          onClick: me[6] || (me[6] = (...se) => q(It) && q(It)(...se))
        }, [
          r.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${r.value.label}`,
            onClick: me[1] || (me[1] = $e((se) => q(Fe)(r.value.ref), ["stop"]))
          }, [
            L(ye, {
              name: "bubble",
              size: 12
            }),
            g("span", null, "Comment on " + $(r.value.label), 1)
          ], 8, mp)) : O("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: $e(D, ["stop"]),
            innerHTML: S.value
          }, null, 8, pp)) : O("", !0),
          i.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${i.value}`,
            onClick: me[2] || (me[2] = $e((se) => q(Fe)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + $(i.value), 9, gp)) : O("", !0),
          g("div", {
            class: X({ "message-folded": u.value && !d.value }),
            "data-message-text": "",
            innerHTML: y.value
          }, null, 10, vp),
          u.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: me[3] || (me[3] = $e((se) => d.value = !d.value, ["stop"]))
          }, $(d.value ? "Show less" : "Show more"), 1)) : O("", !0),
          A.value.length ? (c(), h(V, { key: 4 }, [
            g("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: me[4] || (me[4] = (se) => R.value = !0)
            }, "Open the flowchart"),
            R.value ? (c(), H(g1, {
              key: 0,
              title: e.message.text,
              edges: A.value,
              onClose: me[5] || (me[5] = (se) => R.value = !1)
            }, null, 8, ["title", "edges"])) : O("", !0)
          ], 64)) : O("", !0)
        ], 2),
        g("div", {
          class: X(["message-tools", { picking: fe.value }]),
          "data-message-tools": ""
        }, [
          fe.value ? (c(), h(V, { key: 0 }, [
            g("div", yp, [
              (c(!0), h(V, null, te(q(lp), (se) => (c(), h("button", {
                key: se,
                type: "button",
                class: "message-face",
                title: `React ${se}`,
                "data-face": se,
                onClick: (Je) => He(se)
              }, $(se), 9, bp))), 128))
            ]),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: me[7] || (me[7] = (se) => fe.value = !1)
            }, [
              L(ye, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (c(), h(V, { key: 1 }, [
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: me[8] || (me[8] = (se) => fe.value = !0)
            }, "React"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: me[9] || (me[9] = (se) => a("reply", e.message))
            }, "Reply"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: m
            }, $(s.value ? "Copied" : "Copy"), 1),
            f.value ? (c(), h("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: me[10] || (me[10] = (se) => a("delete", e.message))
            }, "Delete")) : O("", !0)
          ], 64))
        ], 2)
      ]),
      Ae.value.length ? (c(), h("div", wp, [
        (c(!0), h(V, null, te(Ae.value, (se) => (c(), h("button", {
          key: se.emoji,
          type: "button",
          class: X(["message-reaction", { mine: se.mine }]),
          title: se.title,
          "data-reaction": se.emoji,
          onClick: (Je) => a("react", e.message, se.emoji)
        }, [
          ee($(se.emoji) + " ", 1),
          se.count > 1 ? (c(), h("span", $p, $(se.count), 1)) : O("", !0)
        ], 10, kp))), 128))
      ])) : O("", !0),
      F.value.length ? (c(), h("div", xp, [
        (c(!0), h(V, null, te(F.value, (se) => (c(), h(V, {
          key: se.name
        }, [
          se.isImage ? (c(), h("a", {
            key: 0,
            href: se.address,
            target: "_blank",
            class: "message-image",
            title: se.title
          }, [
            g("img", {
              src: se.address,
              alt: se.name,
              "data-figure-picture": ""
            }, null, 8, Sp)
          ], 8, Mp)) : (c(), h("a", {
            key: 1,
            href: se.address,
            target: "_blank",
            class: "message-file"
          }, $(se.name), 9, _p))
        ], 64))), 128))
      ])) : O("", !0),
      q(M).length ? (c(), h("div", Ep, [
        L(ye, {
          name: "send",
          size: 12
        }),
        (c(!0), h(V, null, te(q(M), (se) => (c(), h("button", {
          key: se.id,
          type: "button",
          class: "message-sent-worker",
          disabled: se.unavailable || !se.open_ref,
          "data-sent-worker": se.id,
          title: `Open worker ${se.id}`,
          onClick: $e((Je) => se.open_ref && q(Fe)(se.open_ref), ["stop"])
        }, [
          ee("Also sent to worker " + $(se.id), 1),
          se.unavailable ? (c(), h(V, { key: 0 }, [
            ee(" (unavailable)")
          ], 64)) : O("", !0)
        ], 8, Ap))), 128))
      ])) : O("", !0),
      L(Qn, {
        more: q(C),
        loading: q(P),
        failure: q(Z),
        label: "More recipients",
        onMore: q(ie)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      g("div", Cp, [
        g("time", Op, $(E.value), 1),
        Number.isInteger(e.message.id) ? (c(), h(V, { key: 0 }, [
          me[11] || (me[11] = g("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          g("span", Tp, "message " + $(e.message.id), 1)
        ], 64)) : O("", !0),
        l.value ? (c(), H(Z1, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : O("", !0)
      ]),
      q(w).length || q(x) ? (c(), H(V1, {
        key: 3,
        links: q(w),
        total: q(b),
        more: q(k),
        loading: q(p),
        failure: q(x),
        onMore: q(ne)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : O("", !0)
    ], 8, fp));
  }
}, M4 = /* @__PURE__ */ J(Np, [["__scopeId", "data-v-0be1107c"]]), Dp = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const r = mi("SkeletonParts", !0);
      return c(!0), h(V, null, te(e.parts, (i, d) => (c(), h(V, { key: d }, [
        (c(!0), h(V, null, te(i.count, (u) => (c(), H(Pt, {
          key: u,
          value: i.shape
        }, {
          line: j(() => [
            L(Gt, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ge({ width: i.width, height: `${t[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: j(() => [
            L(Gt, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ge({ width: `${n[i.size]}px`, height: `${n[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: j(() => [
            L(Gt, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ge({ width: i.width, height: `${i.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: j(() => [...l[0] || (l[0] = [
            g("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: j(() => [
            g("div", {
              class: "skeleton-row",
              style: ge(a(i))
            }, [
              L(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: j(() => [
            g("div", {
              class: "skeleton-stack",
              style: ge(a(i))
            }, [
              L(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: j(() => [
            g("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ge(a(i))
            }, [
              L(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: j(() => [
            g("div", {
              class: "skeleton-grid",
              style: ge(s(i))
            }, [
              L(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), jp = /* @__PURE__ */ J(Dp, [["__scopeId", "data-v-fa8baeaf"]]), Pp = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, qp = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", Pp, [
      L(jp, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Os = /* @__PURE__ */ J(qp, [["__scopeId", "data-v-52f66b64"]]), Hn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], wa = 200, dr = (e) => {
  var t;
  return ((t = Hn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Hn[0].key;
}, S4 = (e) => {
  var t;
  return ((t = Hn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Fp = ["aria-label"], Wp = 300, $o = 400, Hp = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: wa } },
  setup(e) {
    const t = e, n = T(() => dr(t.value)), a = T(() => n.value < wa ? [1, 0.25, 0.25] : n.value === wa ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (c(), h("svg", {
      class: X(["ico", "prio", { hot: n.value >= $o, high: n.value >= Wp && n.value < $o }]),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.6",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-label": `priority ${e.value}`
    }, [
      g("path", {
        d: "M4.5 13l3.5-2.25L11.5 13",
        style: ge({ opacity: a.value[0] })
      }, null, 4),
      g("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: ge({ opacity: a.value[1] })
      }, null, 4),
      g("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: ge({ opacity: a.value[2] })
      }, null, 4)
    ], 10, Fp));
  }
}, _4 = /* @__PURE__ */ J(Hp, [["__scopeId", "data-v-b10e610f"]]), xo = (e) => [...new Set(e.agents.map((t) => t.name))], E4 = (e) => xo(e).length === 1 ? `Worker: ${xo(e)[0]}` : "Delegated", Up = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, Mo = (e) => Up[e.card.state] || "idle", zp = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), So = { working: 0, waiting: 1, idle: 2, stopped: 3 }, _o = (e, t) => So[Mo(e)] - So[Mo(t)], Eo = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, A4 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => _o(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || zp(a, s)) : [...e].sort((a, s) => _o(a, s) || (Eo[t] || Eo.state)(a, s)), Vp = { class: "list-row" }, Gp = {
  key: 0,
  class: "list-row-type"
}, Kp = { class: "list-row-main" }, Yp = {
  key: 0,
  class: "list-row-title"
}, Jp = { class: "list-row-body" }, Zp = {
  key: 1,
  class: "list-row-end"
}, Xp = {
  key: 1,
  class: "list-row-text"
}, Qp = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", Vp, [
      e.type ? (c(), h("span", Gp, $(e.type), 1)) : O("", !0),
      g("div", Kp, [
        e.title ? (c(), h("span", Yp, $(e.title), 1)) : O("", !0),
        g("div", Jp, [
          de(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", Zp, [
          de(t.$slots, "end", {}, void 0, !0)
        ])) : O("", !0)
      ]),
      e.text ? (c(), h("span", Xp, $(e.text), 1)) : O("", !0)
    ]));
  }
}, C4 = /* @__PURE__ */ J(Qp, [["__scopeId", "data-v-dfc8c3a7"]]), eg = ["aria-expanded"], tg = { class: "drop-label" }, ng = ["value"], ag = {
  key: 1,
  class: "drop-lead"
}, sg = { class: "drop-item-text" }, og = {
  key: 2,
  class: "drop-note"
}, lg = {
  key: 1,
  class: "drop-none"
}, rg = {
  __name: "DropList",
  props: {
    label: { type: String, default: "" },
    icon: { type: String, default: "" },
    items: { type: Array, default: () => [] },
    picked: { type: String, default: "" },
    empty: { type: String, default: "Nothing here" },
    wide: Boolean,
    bare: Boolean,
    menuWidth: { type: Number, default: 260 },
    searchable: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(!1), o = I(null), l = I(""), r = T(() => {
      const d = l.value.trim().toLowerCase();
      return d ? n.items.filter((u) => `${u.label} ${u.note || ""}`.toLowerCase().includes(d)) : n.items;
    });
    function i(d) {
      s.value = !1, a("pick", d);
    }
    return (d, u) => (c(), h("div", {
      class: X(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      g("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: X(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: u[0] || (u[0] = (f) => s.value = !s.value)
      }, [
        e.icon ? (c(), H(ye, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : O("", !0),
        g("span", tg, $(e.label), 1),
        L(ye, {
          name: "down",
          size: 11
        })
      ], 10, eg),
      s.value ? (c(), H(ea, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: u[2] || (u[2] = (f) => s.value = !1)
      }, {
        default: j(() => [
          e.searchable ? (c(), h("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: u[1] || (u[1] = (f) => l.value = f.target.value)
          }, null, 40, ng)) : O("", !0),
          (c(!0), h(V, null, te(r.value, (f) => (c(), H(Mt, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (m) => i(f)
          }, {
            default: j(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: X(["drop-dot", { live: f.running }])
              }, null, 2)) : O("", !0),
              f.lead ? (c(), h("span", ag, $(f.lead), 1)) : O("", !0),
              g("span", sg, $(f.label), 1),
              f.note ? (c(), h("span", og, $(f.note), 1)) : O("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          r.value.length ? O("", !0) : (c(), h("p", lg, $(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : O("", !0)
    ], 2));
  }
}, ig = /* @__PURE__ */ J(rg, [["__scopeId", "data-v-29dfcce5"]]), O4 = {
  __name: "ModelPicker",
  props: {
    title: { type: String, required: !0 },
    models: { type: Array, required: !0 },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(() => [
      ...n.models.map((l) => ({ key: l.name, label: l.name, note: l.tier })),
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = T(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, r) => (c(), H(ig, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: r[0] || (r[0] = (i) => a("pick", i.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, cg = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: X(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      de(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, fr = /* @__PURE__ */ J(cg, [["__scopeId", "data-v-978e0921"]]), ug = ["aria-label"], dg = { class: "head" }, fg = { class: "names" }, hg = { class: "body" }, mg = {
  __name: "SidePanel",
  props: {
    title: { type: String, default: "" },
    abstract: { type: String, default: "" },
    width: { type: String, default: "normal" },
    open: { type: Boolean, default: null },
    depth: { type: Number, default: 0 },
    over: { type: Boolean, default: !1 },
    closeLabel: { type: String, default: "Close the panel" }
  },
  emits: ["close", "dismiss"],
  setup(e, { emit: t }) {
    const n = e, a = t, { visible: s, close: o, closed: l } = Ol(a, n), r = Tl(s);
    return (i, d) => (c(), H(hs, { to: "body" }, [
      L(jt, {
        name: "side",
        appear: "",
        onAfterLeave: q(l)
      }, {
        default: j(() => [
          q(s) ? (c(), h("div", {
            key: 0,
            class: X(["veil", { over: e.over, under: e.depth }]),
            style: ge({ "--depth": e.depth, zIndex: q(r) }),
            "data-side-panel": "",
            onClick: d[0] || (d[0] = $e((...u) => q(o) && q(o)(...u), ["self"]))
          }, [
            g("aside", {
              class: X(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(V, { key: 0 }, [
                g("header", dg, [
                  g("div", fg, [
                    g("h2", null, $(e.title), 1),
                    e.abstract ? (c(), H(kt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : O("", !0)
                  ]),
                  de(i.$slots, "actions", {}, void 0, !0),
                  L(xs, {
                    title: e.closeLabel,
                    onClick: q(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                i.$slots.foot ? (c(), H(fr, { key: 0 }, {
                  default: j(() => [
                    de(i.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : O("", !0),
                g("div", hg, [
                  de(i.$slots, "default", {}, void 0, !0)
                ])
              ], 64)) : de(i.$slots, "default", {}, void 0, !0, 1)
            ], 10, ug)
          ], 6)) : O("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, T4 = /* @__PURE__ */ J(mg, [["__scopeId", "data-v-f276f055"]]), pg = {
  key: 1,
  class: "text-field-label"
}, gg = {
  key: 2,
  class: "text-field-end"
}, vg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Ha({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var u;
    const n = Wa(e, "modelValue"), a = Xn(), s = "onUpdate:modelValue" in (((u = pi()) == null ? void 0 : u.vnode.props) || {}), o = T(() => s ? n.value : a.value), l = (f) => s && (n.value = f.target.value), r = T(
      () => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), i = T(() => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "value"))), d = I(null);
    return t({ focus: () => d.value && d.value.focus() }), (f, m) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: X(["text-field", { large: e.large, ended: f.$slots.end }, q(a).class]),
      style: ge(q(a).style)
    }, [
      e.icon ? (c(), H(ye, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : O("", !0),
      e.label ? (c(), h("span", pg, $(e.label), 1)) : O("", !0),
      Ye(g("input", Le({
        ref_key: "input",
        ref: d,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: l }), null, 16), [
        [q(Ya), o.value]
      ]),
      f.$slots.end ? (c(), h("span", gg, [
        de(f.$slots, "end", {}, void 0, !0)
      ])) : O("", !0)
    ], 6)) : Ye((c(), h("input", Le({
      key: 1,
      ref_key: "input",
      ref: d,
      class: "text-input",
      spellcheck: "false"
    }, i.value, { onInput: l }), null, 16)), [
      [q(Ya), o.value]
    ]);
  }
}), R4 = /* @__PURE__ */ J(vg, [["__scopeId", "data-v-d9c38ca8"]]), yg = { class: "title" }, bg = { class: "state" }, wg = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = Ua(t.line, t.events);
    return (o, l) => (c(), H(uf, {
      rows: q(n),
      failure: q(a),
      loaded: q(s),
      empty: e.empty
    }, {
      default: j(({ row: r }) => [
        g("span", yg, $(r.title), 1),
        g("span", bg, $(q(xl)(e.noun, r.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, I4 = /* @__PURE__ */ J(wg, [["__scopeId", "data-v-9191a6f0"]]);
function kg(e = 1e3, t = null) {
  const n = I(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? he(t, s, { immediate: !0 }) : s(!0), Be(() => clearInterval(a)), n;
}
const ka = I(Date.now() / 1e3);
let Ao = 0, Mn = 0;
function hr() {
  return Mn || (ka.value = Date.now() / 1e3, Ao = setInterval(() => ka.value = Date.now() / 1e3, 1e3)), Mn += 1, sl() && ms(() => {
    Mn -= 1, Mn || clearInterval(Ao);
  }), ka;
}
const $g = 200, xg = lr + Rn + rr + $g;
function Wt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function Mg(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: Wt(e),
    top: Wt(e.querySelector(".top")),
    title: Wt(e.querySelector(".title")),
    contents: Wt(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var l, r, i, d;
      return `${((r = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : r.className) || ((d = (i = o.effect) == null ? void 0 : i.target) == null ? void 0 : d.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: d, display: u }) => ({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: d, display: u }))(getComputedStyle(e)),
    parent: Wt(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function Sg(e, t, n, a) {
  he(t, (s) => {
    var d;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((d = a.markMotion) != null && d.value)) return;
    const l = performance.now(), r = [];
    function i() {
      if (a.markMotion.value) {
        if (r.push(Mg(o, l, n.value)), performance.now() - l < xg) return void requestAnimationFrame(i);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: r })]);
      }
    }
    i();
  }, { flush: "sync" });
}
const _g = ["title", "data-figure-mark", "data-folded", "data-open"], Eg = {
  key: 2,
  class: "worker"
}, Ag = { class: "head" }, Cg = { key: 0 }, Og = {
  key: 3,
  class: "status"
}, Tg = {
  key: 0,
  class: "figure"
}, Rg = {
  key: 1,
  class: "ran-for"
}, Ig = { key: 2 }, Bg = {
  key: 3,
  class: "news"
}, Lg = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Ng = {
  key: 6,
  class: "settled"
}, Dg = {
  key: 1,
  class: "bar"
}, jg = {
  key: 3,
  class: "detail body"
}, Pg = {
  key: 0,
  class: "body-label"
}, qg = ["title"], Fg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Xn(), a = ["onClick", "onAct"], s = T(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = I(!1), l = T(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = T(() => t.open !== void 0), i = T(() => r.value || l.value), d = T(() => r.value ? t.open : o.value), u = T(() => r.value ? !t.open : l.value && !o.value), f = T(() => !!(t.mark.action && n.onAct)), m = T(() => i.value || f.value || !!n.onClick), v = I(null), y = I(null), { folded: A, phase: R } = ir(v, () => u.value);
    Sg(v, u, R, Oe(Ne, null));
    function S(ie) {
      var fe, Ae;
      if (!(ie.target !== v.value && !y.value.contains(ie.target))) {
        if (r.value) return (fe = n.onClick) == null ? void 0 : fe.call(n, ie);
        if (l.value) return void (o.value = !o.value);
        (Ae = n.onAct || n.onClick) == null || Ae(ie);
      }
    }
    const D = (ie) => n.onAct(ie), U = ["failed", "unfinished"], N = T(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? U.includes(t.mark.state) ? "danger" : "good" : ""), B = T(() => t.mark.color ? t.mark.color : N.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : N.value ? `var(--tone-${N.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), F = T(() => B.value || "var(--tone-work)"), E = T(() => !t.mark.ending && !t.mark.ended && N.value !== "stopped"), _ = hr(), w = T(
      () => t.mark.began_at && E.value && !t.mark.figure && !t.mark.counting ? ep(_.value - t.mark.began_at) : ""
    ), b = T(() => {
      const { started: ie, ended: fe } = t.mark;
      return ie ? fe ? `ran ${wo(fe - ie, !0)}` : wo(_.value - ie, !0) : w.value;
    }), k = ["bad", "danger", "warn"], p = T(() => k.includes(N.value) || t.mark.asks ? "attention" : E.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), x = ["bad", "danger"], M = T(() => x.includes(N.value)), C = T(() => p.value === "process" ? "running" : M.value ? "cross" : N.value === "stopped" ? "stopped" : N.value === "good" ? "tick" : ""), P = T(
      () => !!(t.mark.figure || b.value || t.mark.docked || t.mark.stopping || C.value || t.mark.settled || t.mark.news)
    ), Z = T(() => [t.mark.title, t.mark.time ? ur(t.mark.time) : ""].filter(Boolean).join(" · ")), ne = T(() => ({
      ...B.value ? { "--mark": B.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ie, fe) => (c(), h("div", Le(s.value, {
      ref_key: "root",
      ref: v,
      class: [
        "mark",
        `w-${p.value}`,
        q(R),
        {
          open: d.value,
          folding: r.value && u.value,
          live: m.value,
          failed: M.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: B.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: ne.value,
      title: Z.value,
      "data-figure-mark": e.mark.key,
      "data-folded": q(A) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: S
    }), [
      (c(), H(ht(m.value ? "button" : "span"), {
        ref_key: "top",
        ref: y,
        class: "top",
        type: m.value ? "button" : void 0,
        "aria-expanded": i.value ? String(!!d.value) : void 0
      }, {
        default: j(() => [
          e.mark.markIcon ? (c(), H(dt, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), H(ye, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", Eg, $(e.mark.worker), 1)) : O("", !0),
          g("span", Ag, [
            L(kt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", Cg, $(e.mark.name), 1)) : O("", !0),
            i.value ? (c(), H(xt, {
              key: 1,
              open: !!d.value
            }, null, 8, ["open"])) : O("", !0)
          ]),
          P.value ? (c(), h("span", Og, [
            e.mark.figure ? (c(), h("span", Tg, $(e.mark.figure), 1)) : O("", !0),
            b.value ? (c(), h("span", Rg, $(b.value), 1)) : O("", !0),
            e.mark.stopping ? (c(), h("span", Ig, "Stopping")) : O("", !0),
            e.mark.news ? (c(), h("span", Bg, $(e.mark.news), 1)) : O("", !0),
            C.value === "running" ? (c(), h("span", Lg)) : C.value ? (c(), H(dt, {
              key: 5,
              class: X(["sign", C.value]),
              name: C.value
            }, null, 8, ["class", "name"])) : O("", !0),
            e.mark.settled ? (c(), h("span", Ng, $(e.mark.settled), 1)) : O("", !0)
          ])) : O("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), H(or, {
        key: 0,
        label: e.mark.action,
        open: !!d.value,
        onClick: $e(D, ["stop"])
      }, null, 8, ["label", "open"])) : O("", !0),
      (e.mark.figure || e.mark.counting) && E.value ? (c(), h("span", Dg, [
        g("span", {
          class: "progress",
          style: ge({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: F.value })
        }, null, 4)
      ])) : O("", !0),
      e.mark.detail && !q(A) ? (c(), H(kt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : O("", !0),
      e.mark.body && !q(A) ? (c(), h("div", jg, [
        e.mark.bodyLabel ? (c(), h("p", Pg, $(e.mark.bodyLabel), 1)) : O("", !0),
        L(kt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : O("", !0),
      e.mark.command && !q(A) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, $(e.mark.command), 9, qg)) : O("", !0),
      e.mark.card ? (c(), H(kt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : O("", !0),
      de(ie.$slots, "default", {
        shown: !q(A)
      }, void 0, !0)
    ], 16, _g));
  }
}), mr = /* @__PURE__ */ J(Fg, [["__scopeId", "data-v-2aa9c496"]]), Wg = 60, pr = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function Hg(e, t) {
  const n = I([]), a = I(0);
  let s = -1, o = 0, l = !1;
  async function r() {
    const u = await e(["output", "page", String(t())]);
    return u.ok && (n.value = u.value.lines, a.value = u.value.first_byte, s = u.value.last_byte, o = u.value.cut_bytes), u;
  }
  async function i() {
    if (s < 0) return r();
    const u = await e(["output", "page", String(t()), "--after", String(s)]);
    return u.ok ? u.value.cut_bytes !== o || u.value.total < s ? r() : (u.value.lines.length && (n.value = [...n.value, ...u.value.lines]), s = u.value.last_byte, u) : u;
  }
  async function d(u) {
    if (l || a.value <= 0 || u.scrollTop > Wg) return;
    l = !0;
    const f = u.scrollHeight, m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    l = !1, m.ok && (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, await mt(), u.scrollTop += u.scrollHeight - f);
  }
  return { lines: n, newest: r, follow: i, loadEarlier: d };
}
const Ug = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function gr(e) {
  var n;
  const t = Ug[e] || ((n = qt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const zg = (e) => gr(String(e).split(":")[0]), Vg = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Gg = { passed: "good", failed: "danger", warned: "warn", running: "" }, Kg = { good: "good", warn: "warn", danger: "danger" }, Co = {
  "open row": (e) => Fe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Qd(e.target_model, e.target_id || 0)
}, Yg = { "open row": (e) => zg(e.target_model), "open page": () => gr("pages") };
function Jg(e, t) {
  const n = t || {}, a = Co[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Gg[e.outcome] || "" : Kg[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? Yg[a](e) : "",
    handlers: a ? { onAct: () => Co[a](e) } : {}
  };
}
const Zg = 24, Xg = 1e3, Oo = 2e3, Qg = 0.25, ev = 5e3;
function tv(e, t = Zg, n = () => !0) {
  const a = I(!1), s = I(0), o = I(!1);
  let l = 0, r = 0, i = 0;
  const d = () => e && "value" in e ? e.value : e, u = () => {
    const N = d();
    return N ? N.scrollHeight - N.scrollTop - N.clientHeight : 0;
  }, f = () => !d() || u() <= t;
  function m(N) {
    if (clearTimeout(l), !N) {
      o.value = !1, i = Date.now();
      return;
    }
    const B = Date.now() - i < Oo ? Oo : Xg;
    l = setTimeout(() => o.value = a.value, B);
  }
  function v() {
    clearTimeout(r), a.value = !1, s.value = 0, m(!1);
  }
  function y(N = !1) {
    const B = d();
    B && N && B.scrollTo ? B.scrollTo({ top: B.scrollHeight, behavior: "smooth" }) : B && (B.scrollTop = B.scrollHeight), v();
  }
  function A() {
    S(), !a.value && (a.value = !0, m(!0));
  }
  const R = () => !!d() && u() <= d().clientHeight * Qg;
  function S() {
    clearTimeout(r), R() && (r = setTimeout(() => a.value && R() && n() && y(!0), ev));
  }
  function D() {
    f() ? v() : A();
  }
  function U(N = 1, B = !1) {
    a.value ? s.value += Math.max(0, N) : y(B);
  }
  return sl() && ms(() => [l, r].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: u, atBottom: f, follow: v, toBottom: y, left: A, scrolled: D, arrived: U };
}
const nv = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, av = (e) => String(e ?? "").replace(nv, ""), sv = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(null), { away: o, scrolled: l, arrived: r, toBottom: i } = tv(s);
    he(
      () => n.lines.length,
      () => mt(() => r()),
      { immediate: !0 }
    );
    function d(u) {
      l(), a("older", u.target);
    }
    return (u, f) => (c(), h("pre", {
      ref_key: "box",
      ref: s,
      class: "output-lines",
      onScroll: d
    }, [
      ee($(q(av)(e.lines.join(`
`)) || e.empty), 1),
      q(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (m) => q(i)(!0))
      }, "Follow")) : O("", !0)
    ], 544));
  }
}, ov = /* @__PURE__ */ J(sv, [["__scopeId", "data-v-c2fb1783"]]), lv = 1e4;
class rv {
  constructor(t, n) {
    this.frame = t, this.context = n, this.heardAt = null, this.received = this.received.bind(this);
  }
  start() {
    window.addEventListener("message", this.received);
  }
  stop() {
    window.removeEventListener("message", this.received);
  }
  silent(t = Date.now()) {
    return this.heardAt !== null && t - this.heardAt > lv;
  }
  async received(t) {
    if (t.source !== this.frame.contentWindow) return;
    this.heardAt = Date.now();
    const n = t.data;
    !n || typeof n.id != "number" || (n.type === "read" && this.send(n.id, await this.context.read(n.line)), n.type === "run" && this.send(n.id, await this.context.run(n.line)), n.type === "option" && this.send(n.id, { ok: !0, value: this.context.option(n.key).value ?? null }), n.type === "follow" && (this.context.follow(n.patterns, (a) => this.send(n.id, { ok: !0, value: a })), this.send(n.id, { ok: !0, value: null })));
  }
  send(t, n) {
    var a;
    (a = this.frame.contentWindow) == null || a.postMessage({ id: t, answer: n }, "*");
  }
}
const iv = {
  key: 0,
  class: "frame-note"
}, cv = {
  key: 0,
  class: "frame-note"
}, uv = ["src", "title"], dv = 1e3, fv = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = We(), a = I(null), s = I(!1), o = I(!1);
    let l = null, r = 0;
    return Re(() => {
      l = new rv(a.value, n), l.start(), r = setInterval(() => {
        s.value = l.silent();
      }, dv);
    }), Be(() => {
      l == null || l.stop(), clearInterval(r);
    }), (i, d) => o.value ? (c(), h("p", iv, "This window was closed because it stopped answering.")) : (c(), h(V, { key: 1 }, [
      s.value ? (c(), h("div", cv, [
        d[2] || (d[2] = g("p", null, "This window has not answered for ten seconds.", -1)),
        L(ue, {
          onClick: d[0] || (d[0] = (u) => o.value = !0)
        }, {
          default: j(() => [...d[1] || (d[1] = [
            ee("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : O("", !0),
      g("iframe", {
        ref_key: "frame",
        ref: a,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: q(n).window
      }, null, 8, uv)
    ], 64));
  }
}, hv = /* @__PURE__ */ J(fv, [["__scopeId", "data-v-32a49046"]]), Sn = (e) => e ? e.split(", ") : [];
function mv({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function pv(e, t) {
  return {
    reads: Sn(e.reads_allowed),
    runs: Sn(e.runs_allowed),
    missing: [...Sn(e.reads_missing), ...Sn(e.runs_missing)],
    ask: t
  };
}
const gv = {
  class: "allowance-prompt",
  role: "dialog"
}, vv = { class: "allowance-prompt-text" }, yv = { class: "allowance-prompt-buttons" }, bv = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", gv, [
      g("p", vv, $(q(mv)(e.request)), 1),
      g("div", yv, [
        L(ue, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            ee("Allow", -1)
          ])]),
          _: 1
        }),
        L(ue, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: j(() => [...s[3] || (s[3] = [
            ee("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, wv = /* @__PURE__ */ J(bv, [["__scopeId", "data-v-cad69fe2"]]), $a = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), H(Qt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: j(() => [
        ee($(e.reason) + " ", 1),
        e.retry ? (c(), H(ue, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            ee("Retry", -1)
          ])]),
          _: 1
        })) : O("", !0),
        e.removable ? (c(), H(ue, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: j(() => [...s[3] || (s[3] = [
            ee("Remove tab", -1)
          ])]),
          _: 1
        })) : O("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, kv = ["data-window", "data-agent"], $v = {
  __name: "WindowHost",
  props: {
    name: { type: String, required: !0 },
    component: { type: Object, default: null },
    subscriptions: { type: Object, required: !0 },
    environment: { type: String, default: "" },
    agent: { type: Number, default: null },
    visible: { type: Boolean, default: !0 },
    permissions: { type: Object, default: () => ({ reads: [], runs: [], missing: [], ask: async () => !0 }) },
    prompts: { type: Object, default: null },
    events: { type: Array, default: () => [] },
    unavailableReason: { type: String, default: "" },
    options: { type: Object, default: () => ({}) },
    declared: { type: Array, default: () => [] },
    autoScroll: { type: String, default: "" },
    tabs: { type: Array, default: () => [] },
    sources: { type: Array, default: () => [] },
    links: { type: Object, default: () => ({}) },
    search: { type: Object, default: () => ({}) },
    readOnly: Boolean,
    shared: { type: Object, default: null },
    skeleton: { type: Array, default: () => [] }
  },
  emits: ["open", "option", "remove"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(""), o = I(0);
    function l() {
      s.value = "", o.value++;
    }
    const r = Oe(qc, null), i = Fu({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: T(() => n.options),
      declared: n.declared,
      page: Oe(Lu, null),
      setOption: (f, m) => a("option", f, m),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      sources: n.sources,
      links: n.links,
      search: n.search,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (f, m) => {
        a("open", f, m), r == null || r(f, m);
      }
    });
    ol(Ne, i), he(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Re(i.settle), Be(() => {
      i.cancel(), n.subscriptions.stopAll(n.name);
    }), gi((f) => (s.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const d = () => Jn(n.component), u = () => {
      var f, m;
      return ((m = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : m.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, m) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      u() ? (c(), H(wv, {
        key: 0,
        request: u(),
        onAnswer: m[0] || (m[0] = (v) => e.prompts.answer(v))
      }, null, 8, ["request"])) : O("", !0),
      e.unavailableReason ? (c(), H($a, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (c(), H($a, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (c(), h(V, { key: 4 }, [
        (c(), H(d, { key: o.value })),
        e.skeleton.length && !q(i).answered.value ? (c(), H(Os, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : O("", !0)
      ], 64)) : (c(), H($a, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: m[1] || (m[1] = (v) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, kv));
  }
}, Kt = /* @__PURE__ */ J($v, [["__scopeId", "data-v-c4443e2b"]]), vr = {
  __name: "FrameWindow",
  props: {
    entry: { type: Object, required: !0 },
    subscriptions: { type: Object, required: !0 },
    environment: { type: String, required: !0 },
    agent: { type: Number, default: null },
    visible: { type: Boolean, default: !0 },
    permissions: { type: Object, default: () => ({ reads: [], runs: [], missing: [], ask: async () => !0 }) },
    prompts: { type: Object, default: null },
    options: { type: Object, default: () => ({}) }
  },
  emits: ["option"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = { render: () => Jn(hv, { src: n.entry.entry_url }) };
    return (o, l) => (c(), H(Kt, {
      key: e.entry.entry_url,
      name: e.entry.name,
      component: s,
      subscriptions: e.subscriptions,
      environment: e.environment,
      agent: e.agent,
      visible: e.visible,
      permissions: e.permissions,
      prompts: e.prompts,
      options: e.options,
      declared: e.entry.options,
      "auto-scroll": e.entry.auto_scroll,
      tabs: e.entry.tabs,
      sources: e.entry.sources,
      links: e.entry.links,
      search: e.entry.search,
      events: e.entry.events || [],
      "unavailable-reason": e.entry.unavailable_reason || "",
      onOption: l[0] || (l[0] = (r, i) => a("option", r, i))
    }, null, 8, ["name", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "unavailable-reason"]));
  }
}, xv = ["data-window"], yr = {
  __name: "PageWindow",
  props: {
    entry: { type: Object, required: !0 },
    subscriptions: { type: Object, required: !0 },
    environment: { type: String, required: !0 },
    agent: { type: Number, default: null },
    visible: { type: Boolean, default: !0 },
    permissions: { type: Object, required: !0 },
    prompts: { type: Object, default: null },
    options: { type: Object, default: () => ({}) }
  },
  emits: ["option"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ke(null), o = I("");
    return he(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, sc();
          } catch (r) {
            if (nc(r) && ac(r)) return;
            o.value = `This window's file could not be loaded: ${r.message}`;
          }
      },
      { immediate: !0 }
    ), (l, r) => !s.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      L(Os, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, xv)) : (c(), H(Kt, {
      key: e.entry.entry_url,
      name: e.entry.name,
      component: s.value,
      subscriptions: e.subscriptions,
      environment: e.environment,
      agent: e.agent,
      visible: e.visible,
      permissions: e.permissions,
      prompts: e.prompts,
      options: e.options,
      declared: e.entry.options,
      "auto-scroll": e.entry.auto_scroll,
      tabs: e.entry.tabs,
      sources: e.entry.sources,
      links: e.entry.links,
      search: e.entry.search,
      events: e.entry.events,
      skeleton: e.entry.skeleton,
      "unavailable-reason": e.entry.unavailable_reason || o.value,
      onOption: r[0] || (r[0] = (i, d) => a("option", i, d))
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "skeleton", "unavailable-reason"]));
  }
}, Mv = "*.*", Sv = {
  __name: "ModuleBody",
  props: {
    declaration: { type: Object, required: !0 },
    row: { type: Object, default: null },
    head: { type: Object, default: null },
    foot: { type: Object, default: null },
    actions: { type: Object, default: null },
    time: { type: Object, default: null },
    folded: Boolean,
    environment: { type: String, default: "" }
  },
  setup(e) {
    const t = e, n = Oe(Ne, null), a = new Oc();
    he(
      () => a.patterns,
      (i, d, u) => {
        var m;
        const f = (m = n == null ? void 0 : n.subscriptions) == null ? void 0 : m.follow(`body of ${t.declaration.type}`, i, (v) => a.dispatch(v));
        u(() => f == null ? void 0 : f());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = T(() => !!(t.declaration.shipped || t.declaration.trusted)), r = T(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [Mv] : t.declaration.events ?? [],
      options: []
    }));
    return (i, d) => l.value ? (c(), H(yr, {
      key: 0,
      entry: r.value,
      subscriptions: q(a),
      environment: q(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), H(vr, {
      key: 1,
      entry: r.value,
      subscriptions: q(a),
      environment: q(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, _v = { class: "mark-more-inner" }, Ev = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Av = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Cv = {
  key: 3,
  class: "mark-lines"
}, Ov = "process", To = "task", Tv = {
  __name: "MarkBody",
  props: {
    declaration: { type: Object, required: !0 },
    mark: { type: Object, required: !0 },
    shown: Boolean,
    head: { type: Object, default: null },
    foot: { type: Object, default: null },
    actions: { type: Object, default: null },
    time: { type: Object, default: null },
    folded: Boolean
  },
  setup(e) {
    const t = e, n = We(), a = T(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = T(() => Vg.has(t.mark.variant) && t.mark.detail || ""), o = T(() => t.mark.target_model === To ? t.mark.target_id : 0), l = Hg(
      pr(n),
      () => t.mark.target_id
    ), r = l.lines, i = I(!1), d = I(""), u = T(() => !t.declaration.body_url && t.mark.target_model === Ov && !!t.mark.target_id);
    async function f(v = l.follow) {
      const y = await v();
      i.value = !0, d.value = y.ok ? "" : y.error;
    }
    const m = T(() => t.shown && u.value);
    return he(m, (v) => v && f()), gs(() => m.value && f(), () => m.value && !t.mark.ended_at), he(
      () => t.mark.ended_at,
      (v) => v && m.value && f(l.newest)
    ), (v, y) => (c(), h("div", {
      class: X(["mark-more", { open: e.shown }]),
      onClick: y[1] || (y[1] = $e(() => {
      }, ["stop"]))
    }, [
      g("div", _v, [
        e.declaration.body_url ? (c(), H(Sv, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded"])) : (c(), h(V, { key: 1 }, [
          s.value ? (c(), h(V, { key: 0 }, [
            y[2] || (y[2] = g("p", { class: "mark-label" }, "Why it stopped", -1)),
            g("p", Ev, $(s.value), 1)
          ], 64)) : O("", !0),
          u.value && d.value ? (c(), h("p", Av, $(d.value), 1)) : u.value && i.value ? (c(), h(V, { key: 2 }, [
            y[3] || (y[3] = g("p", { class: "mark-label" }, "Output", -1)),
            L(ov, {
              class: "mark-terminal",
              lines: q(r),
              onOlder: q(l).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (c(), h("p", Cv, $(a.value.join(`
`)), 1)) : O("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: y[0] || (y[0] = $e((A) => q(Fe)(`${To}:${o.value}`), ["stop"]))
          }, " Open task " + $(o.value) + " and its proofs ", 1)) : O("", !0)
        ], 64))
      ])
    ], 2));
  }
}, ns = /* @__PURE__ */ J(Tv, [["__scopeId", "data-v-2f996108"]]), Rv = ["title", "aria-label", "onClick"], Iv = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Bv = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = T(() => Md(t.buttons, t.allowedRuns).filter((l) => {
      var r;
      return !((r = l.variants) != null && r.length) || l.variants.includes(t.mark.variant);
    })), a = I(""), s = Oe(Ne);
    async function o(l) {
      const r = await cn(l, { id: t.mark.target_id }, s.environment);
      a.value = r.ok ? "" : r.error;
    }
    return (l, r) => (c(), h(V, null, [
      (c(!0), h(V, null, te(n.value, (i) => (c(), h("button", {
        key: i.runs,
        type: "button",
        class: "mark-button",
        title: i.label,
        "aria-label": i.label,
        onClick: $e((d) => o(i), ["stop"])
      }, [
        L(dt, {
          name: i.icon
        }, null, 8, ["name"])
      ], 8, Rv))), 128)),
      a.value ? (c(), h("span", Iv, $(a.value), 1)) : O("", !0)
    ], 64));
  }
}, Lv = /* @__PURE__ */ J(Bv, [["__scopeId", "data-v-7a62c88e"]]);
function br(e, t) {
  const n = Ke(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Me.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const wr = br("/api/marks", "marks"), B4 = wr.fetchAll, Nv = wr.find, Dv = ["data-ref"], jv = ["data-ref"], Pv = { class: "mark-row" }, qv = "dock add", Fv = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = T(() => Nv(a.mark.type)), o = T(() => Jg(a.mark, s.value)), l = T(() => {
      var u;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (u = s.value) != null && u.body_url);
    }), r = I(!1);
    function i(u) {
      if (o.value.handlers.onAct && !u.target.closest(".fold")) return o.value.handlers.onAct();
      r.value = !r.value;
    }
    const d = T(() => {
      var u;
      return (((u = s.value) == null ? void 0 : u.buttons) || []).filter((f) => {
        var m;
        return !a.docked || !((m = f.runs) != null && m.startsWith(qv));
      }).map((f) => ({ ...f, module: s.value.module }));
    });
    return (u, f) => {
      var m, v;
      return (m = s.value) != null && m.card ? (c(), h("div", {
        key: 0,
        class: X(["thread-turn", "card", "whole-card", { "user-side": q(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        L(ns, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, Dv)) : (c(), h("div", {
        key: 1,
        class: X(["thread-turn", "card", { "full-width": (v = s.value) == null ? void 0 : v.full_width, docked: e.docked, "user-side": q(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        g("span", Pv, [
          L(mr, Le({
            mark: o.value,
            open: l.value ? r.value : void 0
          }, vi(o.value.handlers), { onClick: i }), yi({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: j(({ shown: y }) => [
                L(ns, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: y
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          L(Lv, {
            buttons: d.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, jv));
    };
  }
}, Wv = /* @__PURE__ */ J(Fv, [["__scopeId", "data-v-afd7d6b1"]]), Hv = ["data-ref"], Uv = ["inert"], zv = { class: "group-fold" }, Vv = { class: "thread-group" }, Gv = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = I(!1), a = I(!1), s = I(!1), o = I(null);
    he(n, async (r) => {
      var i;
      a.value = !0, await mt(), (i = o.value) == null || i.offsetHeight, s.value = r;
    });
    const l = T(() => ({
      key: t.group.id,
      icon: t.group.declaration.family_icon || "",
      markIcon: t.group.declaration.mark_icon || "",
      group: t.group.declaration.group || "",
      label: t.group.label,
      time: t.group.time,
      title: n.value ? "Fold them back into one line" : "Show each of them"
    }));
    return (r, i) => (c(), h("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      L(mr, {
        mark: l.value,
        open: n.value,
        onClick: i[0] || (i[0] = (d) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (c(), h("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: X(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        g("div", zv, [
          g("div", Vv, [
            (c(!0), h(V, null, te(e.group.marks, (d) => (c(), H(Wv, {
              key: d.id,
              mark: d
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, Uv)) : O("", !0)
    ], 8, Hv));
  }
}, L4 = /* @__PURE__ */ J(Gv, [["__scopeId", "data-v-45b58b9b"]]);
function Kv(e) {
  const t = I(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Re(() => n.observe(e.value)), ft(() => n.disconnect()), t;
}
const Yv = { class: "chat-dock-fold" }, Jv = ["aria-label"], Zv = { class: "chat-dock-head" }, Xv = { class: "chat-dock-inner" }, Qv = { class: "chat-dock-foot" }, kr = 700, e0 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = I(null), a = I(null), s = Kv(a), o = I(!1);
    let l = 0;
    return Re(() => l = setTimeout(() => o.value = !0, kr)), ft(() => clearTimeout(l)), t({ card: n }), (r, i) => (c(), h("div", {
      class: X(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      g("div", Yv, [
        g("section", {
          ref_key: "card",
          ref: n,
          class: X(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          de(r.$slots, "edge", {}, void 0, !0),
          g("header", Zv, [
            de(r.$slots, "head", {}, void 0, !0)
          ]),
          g("div", {
            class: X(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            g("div", Xv, [
              g("div", {
                class: X(["chat-dock-grow", { settled: o.value }]),
                style: ge(q(s) === null ? null : { height: `${q(s)}px` })
              }, [
                g("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  de(r.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          de(r.$slots, "still", {}, void 0, !0),
          g("footer", Qv, [
            de(r.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, Jv)
      ])
    ], 2));
  }
}, $r = /* @__PURE__ */ J(e0, [["__scopeId", "data-v-74d44b19"]]), t0 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, xa = 5, n0 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(xa, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${xa}s`, animationDelay: `${(n - xa).toFixed(2)}s` };
    return (s, o) => (c(), h("span", t0, [
      g("i", { style: a })
    ]));
  }
}, xr = /* @__PURE__ */ J(n0, [["__scopeId", "data-v-2a7bc150"]]), a0 = { reviewing: "Under review" }, s0 = (e, t) => e || a0[t == null ? void 0 : t.state] || "", Qe = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, o0 = {
  draft: [{ word: "ready", label: "Mark ready" }, Qe],
  ready: [Qe],
  approved: [{ word: "start", label: "Start", main: !0 }, Qe],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Qe],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Qe],
  completed: [],
  cancelled: []
}, l0 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Qe],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Qe],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, Qe],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Qe],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, r0 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], i0 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], c0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], u0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function d0(e, t) {
  const n = { plan: o0, task: l0 }[e], a = t != null && t.state ? Bu(e, t.state) : null;
  return a ? ((n == null ? void 0 : n[Ml(e, t.state)]) ?? []).filter((s) => a.includes(s.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const f0 = (e, t) => e === "doc" || e === "report" ? u0(t).map((n) => ({ ...n, word: e === "doc" ? "settle" : n.word })) : e === "agent" ? [...c0(t), ...i0(t)] : e === "question" ? r0(t) : d0(e, t), Mr = br("/api/docks", "docks"), N4 = Mr.fetchAll, zt = Mr.find, h0 = 6, m0 = 3, Ma = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, na = (e) => Date.parse(e.leaves_at) / 1e3, wt = (e) => !!(e.leaves_at && !e.kept), p0 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!wt(e) || t < na(e) || n.has(e.id)), g0 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => p0(a, t, n)).sort((a, s) => a.id - s.id);
function v0(e, t, n = h0) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(na(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const y0 = (e, t, n = e) => n < 2 ? !1 : e >= m0 ? !0 : t, b0 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), as = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), w0 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), k0 = (e) => ({ ...e.kept ? as("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : as("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), $0 = ["keep", "unkeep", "open", "undock"], x0 = (e) => ({ ...e, iconOnly: $0.includes(e.action) });
function M0(e, t) {
  var n;
  return [
    ...w0(e, t) ? [k0(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || qt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    as("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(x0);
}
function S0(e, t) {
  const n = M0(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: b0(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const _0 = { class: "dock-text" }, E0 = ["title"], A0 = {
  class: "dock-facts",
  "data-dock-facts": ""
}, C0 = { "data-dock-row": "" }, O0 = {
  key: 1,
  class: "dock-kept"
}, T0 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, R0 = { class: "dock-facts" }, I0 = { "data-dock-row": "" }, B0 = {
  key: 1,
  class: "dock-kept"
}, L0 = { class: "dock-acts" }, N0 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = T(() => zt(a.item.type)), o = hr(), l = T(() => cr(a.item.created_at, o.value * 1e3)), r = I(null), i = I(null), d = I(null), u = I(null), f = T(() => S0(a.item, s.value)), m = We(), v = T(() => `dock.${a.item.id}`), y = T(() => m.props[v.value].data.value), A = T(() => Fn(a.item.target_model ?? "")), R = T(() => {
      var b;
      return (((b = s.value) == null ? void 0 : b.word) || A.value.replaceAll("-", " ")).replace(/^./, (k) => k.toUpperCase());
    }), S = T(() => ({ ...y.value, id: a.item.target_id, noun: A.value })), D = () => {
      var b, k;
      return ((k = (b = s.value) == null ? void 0 : b.reads) == null ? void 0 : k.length) && m.reload(v.value);
    };
    Wc(ol, { data: y, reload: D, readOutput: pr(m) }), he(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (b, k, p) => {
        var M;
        D();
        const x = (M = m.subscriptions) == null ? void 0 : M.follow(`dock ${a.item.id}`, [`${A.value.replaceAll("-", "_")}.*`], (C) => {
          (!C.row_id || C.row_id === a.item.target_id) && D();
        });
        p(() => x == null ? void 0 : x());
      },
      { immediate: !0 }
    );
    const U = I(/* @__PURE__ */ new Set()), N = I("");
    async function B(b) {
      if (b.action === "undock") return n("undock", b);
      if (b.action === "open") return Fe(`${a.item.target_model}:${a.item.target_id}`);
      b.action === "declared" && (U.value = /* @__PURE__ */ new Set([...U.value, b.label])), N.value = "";
      const p = await cn(b, { id: a.item.target_id }, m.environment);
      (p == null ? void 0 : p.ok) === !1 && (U.value = new Set([...U.value].filter((x) => x !== b.label)), N.value = `Could not ${b.label.toLowerCase()}: ${p.error}`);
    }
    const F = T(() => f.value.actions.filter((b) => !U.value.has(b.label))), E = T(() => {
      var b;
      return s0((b = s.value) == null ? void 0 : b.badge, S.value);
    }), _ = T(() => f.value.controls.filter((b) => !(a.collapsed && ["keep", "unkeep"].includes(b.action)))), w = T(() => {
      var b;
      return !!((b = s.value) != null && b.draws_head) && !a.collapsed;
    });
    return (b, k) => {
      var p, x, M, C;
      return c(), H($r, {
        label: f.value.title + ((p = s.value) != null && p.needs_user ? ", waiting for you" : ""),
        type: (x = s.value) != null && x.needs_user ? "waiting" : "",
        folded: !!((M = s.value) != null && M.folds) && e.folded,
        body: !!((C = s.value) != null && C.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: k[3] || (k[3] = (P) => e.collapsed && n("open"))
      }, {
        edge: j(() => [
          e.leaving && !e.item.kept ? (c(), H(xr, {
            key: 0,
            "ends-at": q(na)(e.item)
          }, null, 8, ["ends-at"])) : O("", !0)
        ]),
        head: j(() => {
          var P;
          return [
            w.value ? (c(), h("span", {
              key: 0,
              ref_key: "head",
              ref: r,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (c(), h(V, { key: 1 }, [
              L(ye, {
                name: f.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              g("span", _0, [
                g("span", {
                  class: "dock-title",
                  title: f.value.title
                }, $(f.value.title), 9, E0),
                g("span", A0, [
                  E.value ? (c(), h("span", {
                    key: 0,
                    class: X(["dock-badge", e.item.type.split(".")[1]]),
                    "data-dock-badge": ""
                  }, $(E.value), 3)) : O("", !0),
                  g("span", C0, $(R.value) + " " + $(e.item.target_id), 1),
                  e.item.kept ? (c(), h("span", O0, "Kept")) : O("", !0)
                ])
              ])
            ], 64)),
            _.value.length ? (c(), h("span", {
              key: 2,
              class: "dock-controls",
              onClick: k[0] || (k[0] = $e(() => {
              }, ["stop"]))
            }, [
              (c(!0), h(V, null, te(_.value, (Z) => {
                var ne, ie;
                return c(), h(V, {
                  key: Z.action + Z.runs
                }, [
                  !U.value.has(Z.label) && (!((ne = Z.variants) != null && ne.length) || !((ie = S.value) != null && ie.state) || Z.variants.includes(S.value.state)) ? (c(), H(ue, {
                    key: 0,
                    variant: "icon",
                    class: X({ kept: Z.pressed }),
                    "aria-pressed": Z.pressed,
                    "aria-label": Z.label,
                    title: Z.label,
                    "data-dock-action": Z.action,
                    onClick: (fe) => B(Z)
                  }, {
                    default: j(() => [
                      L(ye, {
                        name: Z.icon,
                        size: 13
                      }, null, 8, ["name"])
                    ]),
                    _: 2
                  }, 1032, ["class", "aria-pressed", "aria-label", "title", "data-dock-action", "onClick"])) : O("", !0)
                ], 64);
              }), 128))
            ])) : O("", !0),
            g("span", {
              ref_key: "time",
              ref: u,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (P = s.value) != null && P.leaves_after_seconds ? O("", !0) : (c(), h(V, { key: 0 }, [
                ee($(l.value), 1)
              ], 64))
            ], 512)
          ];
        }),
        still: j(() => [
          N.value || e.refusal ? (c(), h("p", T0, $(N.value || e.refusal), 1)) : O("", !0)
        ]),
        foot: j(() => {
          var P;
          return [
            g("span", R0, [
              w.value ? (c(), h(V, { key: 0 }, [
                E.value ? (c(), h("span", {
                  key: 0,
                  class: X(["dock-badge", e.item.type.split(".")[1]]),
                  "data-dock-badge": ""
                }, $(E.value), 3)) : O("", !0),
                g("span", I0, $(R.value) + " " + $(e.item.target_id), 1),
                e.item.kept ? (c(), h("span", B0, "Kept")) : O("", !0)
              ], 64)) : O("", !0),
              g("span", {
                ref_key: "foot",
                ref: i,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (P = s.value) != null && P.folds ? (c(), H(ue, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: k[1] || (k[1] = (Z) => n("fold"))
            }, {
              default: j(() => [
                ee($(s.value.folds) + " ", 1),
                L(xt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : O("", !0),
            g("span", L0, [
              g("span", {
                ref_key: "actions",
                ref: d,
                class: "dock-module-actions"
              }, null, 512),
              L(qd, {
                name: `dock.${e.item.type}`,
                row: S.value,
                environment: q(m).environment,
                "read-only": q(m).readOnly,
                "object-name": q(Fn)(e.item.target_model),
                "external-failure": "",
                onFailure: k[2] || (k[2] = (Z) => N.value = Z),
                onDone: b.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (c(!0), h(V, null, te(F.value, (Z) => (c(), H(ue, {
                key: Z.action + Z.runs,
                small: "",
                variant: Z.primary ? "primary" : "ghost",
                bordered: !Z.primary,
                "data-dock-action": Z.action,
                onClick: (ne) => B(Z)
              }, {
                default: j(() => [
                  ee($(Z.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128))
            ])
          ];
        }),
        default: j(() => {
          var P;
          return [
            (P = s.value) != null && P.body_url ? (c(), H(ns, {
              key: 0,
              declaration: s.value,
              mark: e.item,
              shown: "",
              head: r.value,
              foot: i.value,
              actions: d.value,
              time: u.value,
              folded: e.folded
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded"])) : O("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, Ro = /* @__PURE__ */ J(N0, [["__scopeId", "data-v-973f5d66"]]), D0 = ["title", "aria-label"], j0 = { class: "run-chip-in" }, P0 = {
  key: 0,
  class: "run-chip-ring"
}, q0 = { class: "run-chip-name" }, F0 = { class: "run-chip-bar" }, W0 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = We(), o = T(() => `run.${a.item.target_id}`), l = T(() => s.props[o.value].data.value), r = T(() => !l.value || l.value.state === "running" || l.value.state === "background"), i = T(() => {
      var m, v;
      return ((m = l.value) == null ? void 0 : m.title) || ((v = l.value) == null ? void 0 : v.line) || a.item.title || "";
    }), d = T(() => r.value ? t.running : t[l.value.state] ?? "var(--text-3)"), u = () => s.reload(o.value);
    let f = null;
    return Re(() => {
      var m;
      u(), f = (m = s.subscriptions) == null ? void 0 : m.follow(`run chip ${a.item.id}`, ["process.*"], (v) => {
        (!v.row_id || v.row_id === a.item.target_id) && u();
      });
    }), ft(() => f == null ? void 0 : f()), (m, v) => {
      var y;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: ge({ "--tone": d.value })
      }, [
        q(wt)(e.item) ? (c(), H(xr, {
          key: 0,
          "ends-at": q(na)(e.item)
        }, null, 8, ["ends-at"])) : O("", !0),
        g("span", j0, [
          r.value ? (c(), h("span", P0)) : (c(), H(dt, {
            key: 1,
            name: n[l.value.state] ?? "stop"
          }, null, 8, ["name"])),
          g("span", q0, $(i.value), 1)
        ]),
        g("span", F0, [
          g("i", {
            style: ge({ width: r.value ? `${((y = l.value) == null ? void 0 : y.progress) ?? 0}%` : "100%", background: d.value })
          }, null, 4)
        ])
      ], 12, D0);
    };
  }
}, H0 = /* @__PURE__ */ J(W0, [["__scopeId", "data-v-226ac6c8"]]), U0 = 24, z0 = 8, D4 = 420;
function j4({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= U0 ? !0 : e < t && s > z0 ? !1 : null;
}
const V0 = (e, t) => e === void 0 ? t : e, G0 = { me: 1, people: [] }, Un = Zn({
  spec: null,
  drafting: 0,
  quoting: null,
  dumping: !1,
  dumpSelected: 0,
  dumpFiles: [],
  pane: "chat",
  skill: "",
  pluginPage: null,
  identity: null,
  rows: {},
  elsewhere: {},
  paging: { size: {}, more: {} },
  counts: {},
  entries: [],
  settings: null,
  agents: [],
  live: [],
  journals: [],
  summary: null,
  people: G0,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: jn("journal.activity", !0),
  wide: !1,
  sideMini: jn("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
jl("journal.activity", () => Un.activity);
jl("journal.side.mini", () => Un.sideMini);
const Sr = "journal.viewer.";
function K0(e, t, n) {
  try {
    const a = n.getItem(Sr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function Y0(e, t, n) {
  try {
    n.setItem(Sr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function Io(e, t, n = window.localStorage) {
  const a = I(K0(e, t, n));
  return he(a, (s) => Y0(e, s, n), { deep: !0 }), a;
}
const J0 = {
  key: "dock-all",
  class: "dock-all"
}, Z0 = {
  key: "runs-head",
  class: "dock-runs-head"
}, X0 = { class: "dock-runs-title" }, Q0 = { class: "dock-runs-chips" }, ey = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean },
  setup(e) {
    var k, p;
    const t = e, n = kg(500), a = I(/* @__PURE__ */ new Set()), s = I(!1), o = I(!1), l = Oe(Ne), r = I(/* @__PURE__ */ new Set()), i = I({});
    async function d(x, M) {
      i.value = { ...i.value, [x.id]: "" }, r.value = /* @__PURE__ */ new Set([...r.value, x.id]);
      const C = await cn(M, { id: x.target_id }, l.environment);
      (C == null ? void 0 : C.ok) === !1 && (r.value = new Set([...r.value].filter((P) => P !== x.id)), i.value = { ...i.value, [x.id]: `Could not dismiss this card: ${C.error}` });
    }
    const u = T(
      () => g0(
        t.items.filter((x) => !r.value.has(x.id)),
        n.value,
        a.value
      )
    ), f = T(
      () => v0(
        u.value.filter((x) => Ma(x, zt)),
        n.value
      )
    ), m = T(() => u.value.filter((x) => !f.value.includes(x) && !Ma(x, zt))), v = T(() => f.value.filter((x) => !wt(x))), y = Io(`dock-size:${((k = Un.identity) == null ? void 0 : k.root) || location.host}`, null), A = (x) => y.value ? y.value.collapsed && !y.value.opened.includes(x.id) : t.collapsed, R = T(() => u.value.some(A)), S = T(() => (s.value = y0(f.value.length, s.value, v.value.length)) && !o.value && !u.value.some(A));
    function D() {
      y.value = { collapsed: !R.value, opened: [] };
    }
    function U(x) {
      var C;
      if (!A(x)) return;
      const M = (C = y.value) != null && C.collapsed ? y.value.opened : [];
      y.value = { collapsed: !0, opened: [...M, x.id] };
    }
    const N = Io(`dock-folded:${((p = Un.identity) == null ? void 0 : p.root) || location.host}`, {}), B = (x) => {
      var M;
      return !!((M = zt(x.type)) != null && M.folds) && V0(N.value[x.id], Ma(x, zt) || t.folded);
    };
    function F(x) {
      N.value = { ...N.value, [x.id]: !B(x) };
    }
    function E(x) {
      N.value = { ...N.value, ...Object.fromEntries(f.value.map((M) => [M.id, M.id !== x.id])) }, o.value = !0;
    }
    function _() {
      N.value = Object.fromEntries(Object.entries(N.value).filter(([x]) => !f.value.some((M) => String(M.id) === x))), o.value = !1;
    }
    function w(x) {
      a.value = /* @__PURE__ */ new Set([...a.value, x.id]);
    }
    function b(x) {
      a.value = new Set([...a.value].filter((M) => M !== x.id));
    }
    return (x, M) => (c(), H(al, {
      tag: "div",
      name: "dock",
      duration: q(kr),
      class: "dock-stack"
    }, {
      default: j(() => [
        u.value.length > 1 ? (c(), h("div", J0, [
          L(ue, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": R.value ? "Open all" : "Collapse all",
            onClick: D
          }, {
            default: j(() => [
              L(xt, {
                open: !R.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : O("", !0),
        (c(!0), h(V, null, te(m.value, (C) => (c(), H(Ro, {
          key: C.id,
          item: C,
          class: X({ timed: q(wt)(C) }),
          leaving: q(wt)(C) && !a.value.has(C.id),
          folded: B(C),
          collapsed: A(C),
          refusal: i.value[C.id],
          onOpen: (P) => U(C),
          onFold: (P) => F(C),
          onUndock: (P) => d(C, P),
          onMouseenter: (P) => w(C),
          onMouseleave: (P) => b(C)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !R.value ? (c(), h("div", Z0, [
          g("span", null, $(f.value.length) + " runs", 1),
          L(ue, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: _
          }, {
            default: j(() => [
              M[1] || (M[1] = ee(" Runs ", -1)),
              L(xt, { open: "" })
            ]),
            _: 1
          })
        ])) : O("", !0),
        (c(!0), h(V, null, te(S.value ? [] : f.value, (C) => (c(), H(Ro, {
          key: C.id,
          item: C,
          class: X({ timed: q(wt)(C) }),
          leaving: q(wt)(C) && !a.value.has(C.id),
          folded: B(C),
          collapsed: A(C),
          refusal: i.value[C.id],
          onOpen: (P) => U(C),
          onFold: (P) => F(C),
          onUndock: (P) => d(C, P),
          onMouseenter: (P) => w(C),
          onMouseleave: (P) => b(C)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        S.value ? (c(), H($r, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: j(() => [
            L(ye, {
              name: "runs",
              size: 14
            }),
            g("span", X0, $(f.value.length) + " runs", 1)
          ]),
          foot: j(() => [
            g("span", Q0, [
              (c(!0), h(V, null, te(f.value, (C) => (c(), H(H0, {
                key: C.id,
                item: C,
                onClick: (P) => E(C)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            L(ue, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: M[0] || (M[0] = (C) => o.value = !0)
            }, {
              default: j(() => [
                M[2] || (M[2] = ee(" Runs ", -1)),
                L(xt)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["label"])) : O("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, P4 = /* @__PURE__ */ J(ey, [["__scopeId", "data-v-990baf5f"]]), $t = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, In = (e) => Math.min(Math.max(e, 0), 1), ty = (e) => {
  const t = In(e);
  return t * t * (3 - 2 * t);
}, gt = (e, t, n) => ty((e - t) / (n - t));
function q4(e) {
  const t = In(e), n = In((t - 0.12) / 0.76) * $t.shuffles, a = Math.min(Math.floor(n), $t.shuffles - 1), s = n - a, o = gt(s, 0.26, 0.38) * (1 - gt(s, 0.76, 0.96)), l = gt(s, 0.38, 0.76), r = gt(t, 0, 0.12) * (1 - gt(t, 0.88, 1)), i = gt(s, 0.2, 0.34) * (1 - gt(s, 0.84, 1)), d = Math.sin(Math.PI * In((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / $t.shuffles, lift: $t.lift * o, ready: r, weight: i, follow: d, shuffle: a, phase: s };
}
function F4(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const Bo = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, W4 = (e) => Bo[e] ?? Bo.butler, Ts = 2400, ny = 0.05;
function ay({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, ny), l = Math.min(t + Ts * o, s), r = e + l * o;
  return r < n ? { y: r, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function H4(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function sy(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function U4(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const z4 = (e, t) => ({ ...e, stretch: t.stretch }), V4 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, _r = (e, t) => t >= (e.least ?? 0);
function G4(e, t, n) {
  if (!_r(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const K4 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), oy = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", Lo = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), ly = (e) => e.right > e.left && e.bottom > e.top;
function Y4(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(oy)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let r = Lo(l, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (r = Lo(r, i.getBoundingClientRect()), a && (r.bottom = Math.min(r.bottom, a.top))), ly(r) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: r }] : [];
  });
}
function Er(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, r = 1;
    for (const [u, f, m] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const v = t[u] - e[u];
      if (Math.abs(v) < 1e-9)
        (e[u] < o[f] || e[u] > o[m]) && (r = -1);
      else {
        const y = (o[f] - e[u]) / v, A = (o[m] - e[u]) / v;
        l = Math.max(l, Math.min(y, A)), r = Math.min(r, Math.max(y, A));
      }
    }
    if (l > r || a && l >= a.share) continue;
    const i = e.x + (t.x - e.x) * l, d = e.y + (t.y - e.y) * l;
    a = { share: l, x: i, y: d, on: "surface", surface: s.id, dx: i - s.left, dy: d - s.top };
  }
  return a;
}
const _e = {
  // a celebration: it jumps for joy `jumps` times with its arms flung up, each jump a little lower than the last
  joy: { frames: 50, fps: 14, jumps: 5 },
  // a worker sent off or another session messaged: a call on an old desk telephone (figure.js TELEPHONE). The telephone appears on the
  // floor before it, whole, in a poof of smoke over `poof`, `above` its units over the floor, drops onto it over `drop` and settles with
  // a jiggle over `settle`, squashing `squash` flat as it lands and wobbling `wobbles` times to still (figure.js phoneArrival), its handset
  // resting on the cradle a moment; it bends to the handset over `reach` and lifts it to its ear over `lift`; it bends to the dial and
  // puts a finger in it over `finger` and turns it `turn` degrees over `dial`; over `back` the finger withdraws first for `release` of
  // that phase, then the dial springs back once the finger is clear. It
  // talks over `talk`, nodding `nods` times; it bends to put the handset back on the cradle over `hang`, stands back from it a moment, and the telephone goes in a poof over `goes`
  // While it talks and until the handset is down it says whom it calls in a speech bubble beside its head (figure/places.js callSays)
  // Seated it follows the same phases. The set sits beside and behind the hip, turned inward toward the hands; the torso
  // leans toward it while the far hand dials, then returns upright. `beside` and `behind` place it in the figure's units, `turn` rotates
  // the dial toward its owner, `lean` is the dialling lean in degrees, and `backLean` tips the torso toward the set for pickup.
  // phonePlacement.js reserves the complete rotated base and receiver footprint on the seat.
  phone_call: { frames: 108, fps: 12, poof: [0, 0.06], above: 0.7, drop: [0.015, 0.055], settle: [0.055, 0.12], squash: 0.24, wobbles: 3, reach: [0.13, 0.2], lift: [0.2, 0.28], finger: [0.28, 0.33], dial: [0.33, 0.42], turn: 250, back: [0.42, 0.5], release: 0.25, talk: [0.5, 0.72], nods: 3, hang: [0.72, 0.84], goes: [0.92, 1], seated: { finger: [0.28, 0.33], dial: [0.33, 0.42], back: [0.42, 0.5], reach: [0.13, 0.2], lift: [0.2, 0.28], beside: 1.2, behind: 0.95, wide: 0.82, turn: 45, lean: 20, backLean: 8 } },
  // a question asked: it raises a sign with a question mark on a stick over its head and waggles it
  ask_sign: { frames: 42, fps: 12, raise: [0, 0.22], waggle: [0.22, 0.78], waggles: 3, lower: [0.78, 1] },
  // a report: it brings the rolled scroll up before its chest over `raise`, a roller in each hand, the free hand's on top; pulls the
  // rollers apart over `unrolls`, the written side toward itself and the parchment's plain back to the viewer (figure.js SCROLL); reads
  // it `lines` lines down, its head going slowly along each; rolls it closed between its hands over `rolls` and lowers it over `lower`
  scroll: { frames: 96, fps: 12, raise: [0, 0.09], unrolls: [0.09, 0.22], rolls: [0.85, 0.93], lower: [0.93, 1], lines: 3 },
  // a task finished, a job well done: standing, it brings its hands together before its chest over `together`, rubs them round each
  // other `rubs` times, slowly, a stroke and a half a second at most, nodding a little with each, and lowers them over `apart`; `puffs`
  // small puffs rise from the hands once each over `puff`, with `sparkles` sparkles among them (chat/act/HandRub.vue)
  hand_rub: { frames: 48, fps: 12, together: [0, 0.12], rubs: 2, apart: [0.88, 1], puff: [0.2, 0.9], puffs: 2, sparkles: 1 },
  // stopping to think at the laptop (figure.js type_ponder), under the thought cloud, its dots pulsing three times a loop
  type_ponder: { frames: 24, fps: 6, pulse: 4 / 3 },
  // The thinking act, now and then while the agent thinks (figure.js thinkingClip, reactions.js thinkingAct), in its three plays. With
  // the cloud: it raises its finger to its cheek over `into`, tilting its head up, swaying `sways` times; three puffs rise from its head
  // over `puffs` into a small thought cloud over it, held over `cloud`, its three dots pulsing one after another, `pulse` seconds round
  // (chat/FigureAct.vue), and over `rise` its hand comes away. With the bulb: over `rise` the finger comes up, "got it", the light bulb
  // over the head (figure.js LIGHT_BULB) appears over `appears`, switches on over `lights`, glows, goes out over `fades` and is gone over
  // `goes`. "ponder" has both, the bulb at its end; "think_cloud" the cloud alone, its hand going down; "got_it" the bulb alone.
  ponder: { frames: 84, fps: 12, into: [0, 0.1], puffs: [0.06, 0.24], cloud: [0.06, 0.72], pulse: 1.2, sways: 2, rise: [0.72, 0.8], appears: [0.75, 0.78], lights: [0.79, 0.82], fades: [0.9, 0.96], goes: [0.95, 1] },
  think_cloud: { frames: 66, fps: 12, into: [0, 0.12], puffs: [0.07, 0.29], cloud: [0.07, 0.86], pulse: 1.2, sways: 2, rise: [0.86, 1] },
  got_it: { frames: 30, fps: 12, rise: [0, 0.25], appears: [0.05, 0.15], lights: [0.18, 0.26], fades: [0.72, 0.88], goes: [0.86, 1] },
  // a fact or a reminder: a small cabinet grows beside it, its drawer slides out, it files a card in it and the drawer shuts
  file_card: { frames: 42, fps: 12, grows: [0, 0.15], opens: [0.12, 0.28], reach: [0.2, 0.44], filed: [0.44, 0.56], back: [0.56, 0.72], shuts: [0.58, 0.72], sinks: [0.86, 1] },
  // searching from the compose box: binoculars at its eyes, tipped `up` degrees up the chat and scanning slowly up and down it `scan`
  // degrees either way, twice, with a little turn left and right
  binoculars: { frames: 100, fps: 10, sweep: 1, up: 9, scan: 6 },
  // searching, now and then: at the edge of the chat window the figure reaches past it into the space beyond, where nothing is seen, and
  // rummages there like a cartoon character hunting through a closet: it turns side-on to the edge and leans in, head and shoulders past
  // it, over `leans`, digging about `digs` times, and flings what it pulls out back over its shoulder, one thing at each of `throws`, each
  // from `from` (the figure's units, across, forward and up, before it turns side-on) on the arc its throw gives it (throwsFor), shrinking
  // away to nothing over `shrinks` once it lands; over `pops` it pulls back out, having found nothing
  rummage: {
    frames: 120,
    fps: 12,
    leans: [0.05, 0.14],
    digs: 7,
    pops: [0.8, 0.9],
    throws: [0.18, 0.28, 0.38, 0.48],
    from: [0, -1.5, 1.5],
    shrinks: 0.05
  },
  // a bar it was eager for failed: crushed at first, then plainly mad about it, stamping and fuming, steam rising off its head
  fume: { frames: 54, fps: 12, crushed: [0, 0.36], mad: [0.36, 0.96], stamps: 6, steam: [0.42, 0.96] },
  // Each voice has its own angry performance, with a full recovery before ordinary activity resumes.
  tantrum: { frames: 108, fps: 18, hops: 6 },
  // a rope swing tied under a bubble, drawn whole from the act's first frame: its two ropes `rope` of the figure's height long from the
  // middle of the bubble's bottom edge, `ties` of it apart, just outside the figure's arms, down to a seat `seat` of it wide, a little wider
  // than its body, whose top is `under` of it below the line the figure sits on, where its thighs' underside rests. Its frames are an
  // intro, the figure sitting down onto the seat as it starts to swing; a held stretch looped for `swings` pendulum cycles toward the
  // camera and away, `angle` degrees either side of the bottom, around the fixed knots, its legs pumping; and an outro, settling as the
  // figure rises off it. The ropes stay straight and keep their length, the seat rising at both ends of the arc. The knots stand at
  // least `room` of the figure's height in from the chat's sides, with `clearance` extra room kept around the hanging figure.
  rope_swing: { intro: 12, hold: 60, outro: 12, fps: 12, swings: 2, rope: 0.62, ties: 0.53, seat: 0.59, under: 0.025, angle: 20, clearance: 0.12, room: 0.85 },
  // a pogo stick up onto a bubble's top: it reaches behind its back and pulls the stick out over `draw`, bounces `count` times on the spot
  // over `bounces`, each higher than the last up to `bounce` of its height, and springs up over `spring` to the top of its throw, `over`
  // of its height past the bubble's edge; there it lets the stick go over `release`, the stick falling away over `drop`, and it falls
  // onto the bubble on its own feet; every hop and the fall are timed by one gravity (pogoHop); the lower shaft keeps its existing
  // `stick`-based length, with the handles `handles` of the picture's height above the feet, shared by the stick and the hands
  pogo: { frames: 54, fps: 12, draw: [0, 0.18], bounces: [0.18, 0.62], count: 3, bounce: 0.45, spring: [0.62, 0.82], over: 0.3, release: [0.82, 0.86], drop: [0.82, 1], stick: 0.62, handles: 0.2455 },
  // a fixed run's bugs: two to five of them crawl along the chat window's walls (WALL_BUGS); the figure first walks to its firing spot,
  // turns its whole body toward each wall (back toward the screen for a top-wall bug), and pulls a rifle from behind its back
  // over `draw` and shoulders it, then shoots them one by one, each in its own `turn` of the act played over again for every bug
  // (bugShotFrame): it swings its aim onto the bug over `aim`, shoots `count` bursts over `shots`, each kicking the rifle and the shoulder
  // back, and the bug splatters on its wall at `splat`; after the last, drops of its splatter fly out at the screen over `fly`, growing
  // as they come, land on it as on a camera's lens at their `lens` places (from the figure's middle, in shares of the picture, as big as
  // `size`), and run down and fade over `drops`, as the rifle is lowered; a bug steeper from the figure's eyes than `back.limit` degrees is
  // first backed away from along the floor, facing it, stepping `back.stride` of the picture at a time, to within it (backPlan), never
  // nearer an end of its floor than `back.margin` of the picture
  bug_shot: {
    frames: 80,
    fps: 12,
    draw: [0, 0.22],
    turn: [0.25, 0.55],
    aim: [0.25, 0.32],
    shots: [0.33, 0.48],
    count: 2,
    splat: 0.48,
    fly: [0.56, 0.64],
    drops: [0.64, 1],
    back: { limit: 55, margin: 0.25, stride: 0.5 },
    lens: [{ at: [-1.3, -1.6], size: 0.2 }, { at: [0.9, -0.9], size: 0.14 }, { at: [-0.4, 0.2], size: 0.16 }, { at: [1.6, -2.1], size: 0.1 }]
  },
  // a fixed run's bug smashed with a big wooden mallet on the floor the figure stands on (smashPlan): the bug climbs up the back of the
  // floor's box, out of sight behind it, over `emerge`, comes over its top edge onto it over `climb`, and it and the figure walk to meet
  // each other over `walk`, until it is `away` of the picture out on the figure's left (`side`); the figure raises the mallet high before
  // its head over `raise` and holds it there for the wind-up until `swing`, swings it down over `swing` and flattens the bug at `blow`,
  // which lies flat and fades over `gone`, and lowers the mallet over `lower`
  bug_smash: {
    frames: 96,
    fps: 12,
    side: 1,
    emerge: [0, 0.09],
    climb: [0.09, 0.16],
    walk: [0.16, 0.38],
    raise: [0.46, 0.58],
    swing: [0.66, 0.72],
    blow: 0.72,
    gone: [0.84, 0.95],
    lower: [0.88, 0.95],
    away: 0.42
  },
  // a sin repented: a halo grows over the head over `grows` and fades over `fades`, the figure floating up `float` of its units and down
  // with its hands folded and a serene, holy look
  halo: { frames: 48, fps: 12, grows: [0, 0.15], fades: [0.85, 1], float: 0.01 },
  // A confession: the hands come to the chest during the descent, the head bows after the shoulders, and the figure rises slowly.
  repent: { frames: 84, fps: 12, stand: [0, 0.12], kneel: [0.12, 0.34], out: [0.18, 0.4], up: [0.34, 0.48], hold: [0.48, 0.74], down: [0.74, 0.86], rise: [0.76, 1] },
  // a disco dance under a disco ball: the classic move, one arm pointing up and the other down, switching sides `beats` times, the hips
  // swaying and the knees bouncing, the visor flashing through the colours; the ball `ball` of the picture across, turning, hung `clear`
  // of it over the hat, on a string at least `tie` of it long from the bottom of a bubble no further than `far` of the figure's height
  // above the hat
  disco: { frames: 96, fps: 12, beats: 8, ball: 0.24, clear: 0.08, tie: 0.1, far: 2.2 },
  // leaning against a wall to rest (perches.js leanSpot): the wall `wall` of the picture out from its middle, the hand flat against it
  // `contact` of the figure's units above its feet; the whole body tilted `tilt` degrees toward it from the feet, its weight on that hand;
  // the other hand on its hip at `hip` (across, forward, up); the ankles crossed, the inner leg turned in `inner` degrees and the outer
  // `outer`, swung `over` degrees before the inner so its foot crosses over in front
  lean: { wall: 0.33, contact: 1.95, tilt: 16, hip: [0.62, 0.05, 1.5], inner: 20, outer: 42, over: 12 },
  // coming down on a parachute, swaying `sway` degrees under it, its canopy (figure.js canopyOf) `width` of the picture across with its
  // rim `above` of the picture over the eyes, the lines running from the rim down to the hands
  chute: { frames: 24, fps: 8, sway: 8, width: 0.66, above: 0.5 },
  // compacting: a box appears, it hops into it and the box shrinks with it inside; once the compaction is over the box grows back and
  // pops in a puff, and it jumps out. Its frames are an intro, a held stretch looped while the compaction lasts, and an outro
  pack_box: { intro: 36, hold: 24, outro: 26, fps: 12, appears: [0, 0.3], hop: [0.3, 0.62], into: [0.55, 0.88], shrinks: [0.86, 1], grows: [0, 0.3], pops: 0.38, leap: [0.38, 0.88], small: 0.5 },
  // compacting: a press comes down onto its head, it holds it up with both hands and is squashed under it, and springs back once it lifts
  press: { intro: 24, hold: 24, outro: 24, fps: 12, lowers: [0, 0.55], squashes: [0.5, 1], frees: [0, 0.3], springs: [0.25, 0.7], lifts: [0.3, 1], flat: 0.42 },
  // compacting: it vacuums up the words flying in from beside it, the canister on the floor and the nozzle in its hand
  vacuum: { intro: 10, hold: 40, outro: 10, fps: 10, words: 5 }
}, tn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), ry = (e) => e * e * (3 - 2 * e), Ee = (e, [t, n]) => ry(tn(e, t, n)), iy = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], it = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, _n = ([e, t], n) => e + n() * (t - e);
function cy(e) {
  return iy.map(() => {
    const t = _n(it.speed, e), n = _n(it.angle, e) * Math.PI / 180, a = _n(it.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [_n(it.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const uy = cy(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function dy(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * it.gravity * (t[2] - it.floor))) / it.gravity;
}
function J4(e, t, n = uy) {
  const a = _e.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = dy(o, a.from), r = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + r) return null;
  const i = Math.min(s, l), d = a.from.map((u, f) => u + o.velocity[f] * i);
  return d[2] -= it.gravity * i * i / 2, { at: d, turn: o.spin * i, landed: Math.max(0, s - l) / r };
}
const Z4 = (e, t) => e && _e[e.name] ? { name: e.name, u: t / e.frames } : null;
function X4(e, t) {
  const n = e.map((o) => Math.sqrt(o)), a = n.reduce((o, l) => o + l, 0);
  let s = Math.min(Math.max(t, 0), 1) * a;
  for (const [o, l] of n.entries()) {
    if (s <= l || o === n.length - 1) {
      const r = l > 0 ? Math.min(s / l, 1) : 1;
      return { index: o, s: r, height: e[o] * 4 * r * (1 - r) };
    }
    s -= l;
  }
  return { index: 0, s: 1, height: 0 };
}
const Q4 = () => Array.from({ length: _e.pogo.count }, (e, t) => _e.pogo.bounce * (t + 1) / _e.pogo.count), Lt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function e$(e, t, n) {
  const { away: a, side: s } = _e.bug_smash, o = s * a * n, [l, r] = [t.left + Lt.margin * n, t.right - Lt.margin * n], i = Math.min(Math.max(e + o + s * Lt.reach * n, l), r), d = i - o - e, u = i - (s * d > 0 ? d / 2 : 0);
  return { figure: [e - t.left, u - o - t.left], bug: [i - t.left, u - t.left] };
}
function t$(e, t, n) {
  const a = _e.bug_smash, s = Ee(t, a.walk), o = ([l, r]) => l + (r - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Lt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Lt.tall * n * (1 - Ee(t, a.emerge)),
      turn: 90 * (1 - Ee(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Ee(t, a.gone)
    }
  };
}
function n$(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Lt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = ay({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Ie = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function a$(e) {
  const t = Ie.least + Math.floor(e() * (Ie.most - Ie.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Ie.walls[Math.floor(e() * Ie.walls.length)],
    along: Ie.margin + e() * (1 - 2 * Ie.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function ss(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Ie.margin, l = ((e.along - Ie.margin + e.way * Ie.speed * n / a) / s % 2 + 2) % 2, r = Ie.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + r * a, y: t.top + Ie.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Ie.inset : t.right - Ie.inset, y: t.top + r * a, turn: e.wall === "left" ? 90 : -90 };
}
function fy(e, t) {
  const n = _e.bug_shot, [a, s] = n.turn.map((u) => u * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = sy(e, o), r = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), d = e >= a + t * (s - a) ? t : r + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: r, shot: d };
}
function s$(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = _e.bug_shot, { frame: l, bug: r, shot: i } = fy(n, e.length), d = e.map((S, D) => ({ ...ss(S, t, Math.min(n / o.fps, Bn(D).shot)), shot: D < i })), u = Ee(l / o.frames, o.aim), [f, m] = [d[Math.max(r - 1, 0)], d[r]], v = e.map((S, D) => ({ bug: S, index: D, seconds: n / o.fps - Bn(D).shot, spot: ss(S, t, Bn(D).shot) })).filter((S) => S.seconds >= 0), y = v.flatMap((S) => {
    const D = (s == null ? void 0 : s.get(S.index)) ?? vy(S.bug, t, S.spot, s ? [] : a);
    return s == null || s.set(S.index, D), s && yy(D, S.seconds, a), by(D, S.seconds, a);
  }), A = v.filter((S) => py(S.bug)).map((S) => ({ seconds: S.seconds, from: S.spot })), R = +(e[Math.max(r - 1, 0)].wall === "top") * (1 - u) + +(e[r].wall === "top") * u;
  return { bugs: d, frame: l, target: { x: f.x + (m.x - f.x) * u, y: f.y + (m.y - f.y) * u, back: R }, slush: y, camera: A };
}
function Bn(e) {
  const t = _e.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function o$(e, t, n, a) {
  const { limit: s, margin: o } = _e.bug_shot.back, [l, r] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((d, u) => {
    const f = Bn(u), m = ss(d, t, f.shot), v = Math.abs(m.y - n.y) / Math.tan(s * Math.PI / 180), y = m.x === i ? i - l >= r - i ? -1 : 1 : Math.sign(i - m.x), A = Math.abs(m.x - i) >= v ? i : m.x + y * v, R = y > 0 ? Math.max(i, Math.min(A, r)) : Math.min(i, Math.max(A, l)), S = { from: i, to: R, begin: f.walk, end: f.aim };
    return i = R, S;
  });
}
function l$(e, t, n) {
  var o;
  const a = _e.bug_shot.back.stride * n;
  let s = 0;
  for (const l of e) {
    if (t <= l.begin) return { x: l.from, steps: s / a, way: 0 };
    if (t < l.end) {
      const r = l.from + (l.to - l.from) * Ee(t, [l.begin, l.end]);
      return { x: r, steps: (s + Math.abs(r - l.from)) / a, way: Math.sign(l.to - l.from) };
    }
    s += Math.abs(l.to - l.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: s / a, way: 0 };
}
const xe = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, hy = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function my(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const py = (e) => e.along * 97 % 1 < xe.camera, nn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * xe.gravity * t * t });
function gy(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * xe.gravity * (t.bottom - e.from.y))) / xe.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * xe.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / xe.gravity, on: "top" });
  const l = s.filter((d) => d.t >= 0).sort((d, u) => d.t - u.t)[0];
  let r = e.from;
  for (let d = 0; d < l.t; d += xe.step) {
    const u = Math.min(d + xe.step, l.t), f = nn(e, u), m = Er(r, f, n);
    if (m) return { ...m, t: d + (u - d) * m.share };
    r = f;
  }
  const i = nn(e, l.t);
  return { ...l, x: Math.min(Math.max(i.x, t.left), t.right), y: Math.min(Math.max(i.y, t.top), t.bottom) };
}
function vy(e, t, n, a = []) {
  const s = my(e.along + 1), [o, l] = hy[e.wall], r = Math.atan2(l, o);
  return Array.from({ length: xe.count }, () => {
    const i = r + (s() - 0.5) * 2 * (xe.spread * Math.PI / 180), d = xe.speed[0] + s() * (xe.speed[1] - xe.speed[0]), u = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * d, vy: Math.sin(i) * d, r: xe.radius[0] + s() * (xe.radius[1] - xe.radius[0]) };
    return { ...u, ...gy(u, t, a) };
  });
}
function yy(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += xe.step) {
      const l = Math.min(o + xe.step, s), r = Er(nn(a, o), nn(a, l), n);
      if (r) {
        Object.assign(a, r, { t: o + (l - o) * r.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function by(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...nn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - xe.hold) / xe.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((u) => u.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const r = l ? l.left + a.dx : a.x, i = l ? l.top + a.dy : a.y, d = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - i)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: r, y: i, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: d, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function r$(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: r, fps: i } = _e.bug_shot;
  if (e < 0) return [];
  const d = (s[1] - s[0]) * r / i, u = (o[1] - o[0]) * r / i, f = Ee(e, [0, d]), m = Ee(e, [d, d + u]);
  return l.map((v) => {
    const y = { x: a.x + v.at[0] * t, y: a.y + v.at[1] * t };
    return {
      x: n.x + (y.x - n.x) * f,
      y: n.y + (y.y - n.y) * f,
      r: v.size * t * (0.15 + 0.85 * f * f),
      run: m * m * t * 1.2,
      fade: 1 - m,
      landed: f >= 1
    };
  });
}
function i$(e, t, n, a, s) {
  const { sway: o, above: l } = _e.chute, r = { x: t.x, y: t.y - l * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [d, u] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], f = (A) => {
    const [R, S] = [A.x - e.at.x, A.y - e.at.y];
    return { x: r.x + R * d - S * u, y: r.y + R * u + S * d };
  }, [m, v] = [...n].sort((A, R) => A.x - R.x), y = e.ends.map(f);
  return { left: r.x - e.at.x, top: r.y - e.at.y, middle: r, turn: i, lines: y.map((A, R) => ({ from: A, to: R < y.length / 2 ? m : v })) };
}
const c$ = (e, t) => Ee(t, e.grows) * (1 - Ee(t, e.sinks));
function zn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: tn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: tn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function u$(e, t) {
  const n = _e[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = zn(n, t), l = 1 - (1 - n.small) * Ee(a, n.shrinks) * (1 - Ee(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = zn(n, t), o = n.flat * Ee(a, n.squashes) * (1 - Ee(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * tn(s, ...n.springs)) * (1 - tn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const d$ = (e) => e === "pack_box";
function f$(e) {
  const { into: t, out: n } = zn(_e.rope_swing, e);
  return 1 - Ee(t, [0, 1]) * (1 - Ee(n, [0, 1]));
}
function h$(e) {
  const t = _e.rope_swing, { into: n, out: a } = zn(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Ee(n, [0, 1]) * (1 - Ee(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const wy = { after: 3 }, Rs = 10, ky = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, $y = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, xy = { weight: 19 }, Ar = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, My = { every: 120 }, Cr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Or = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, Sy = {
  "❤️": "hearts",
  "👍": "amused",
  "🎉": "startled",
  "😄": "amused",
  "👀": "reading",
  "🙏": "hearts",
  "👎": "worried",
  "💔": "worried",
  "😠": "angry",
  "🎩": "amused",
  "🧐": "reading",
  "🥂": "amused",
  "🤙": "amused",
  "😎": "amused",
  "🔥": "startled",
  "💪": "amused",
  "🏆": "hearts",
  "⚔️": "angry",
  "🛡️": "worried",
  "🏰": "amused"
}, dn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: Rs }), ae = (e, t, n = {}) => dn(e, "clip", t, n), Sa = (e, t, n = {}) => dn(e, "look", t, n), No = (e, t, n = {}) => dn(e, "gaze", t, n), pe = (e, t, n = {}, a = {}) => ({ ...dn(e, "pick", t, n), ...a }), we = (e) => dn("nothing", "nothing", e, {}), _y = 120, Ey = 300, _a = (e, t) => ({ ...ae(e, t), cooldown: Ey }), re = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), Ay = () => [ae("joy", 2)], vt = (e, t, n, a, s = {}) => ({ ...ae(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), yt = (e) => ({ ...e, cooldown: ky[e.name] }), Ht = (e) => ({ ...e, shenanigan: !0, lasts: $y[e.name] }), aa = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...re("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ae("nod", 2), we(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...re("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...yt(ae("bug_shot", 3)), toward: "", onto: !1 },
    { ...yt(ae("bug_smash", 2)), toward: "", onto: !1 },
    ae("nod", 2)
  ]),
  ...re("tests_failed", { cooldown: 20, toward: "card" }, [ae("startled", 2), ae("dismay", 1), ae("tantrum", 3), we(1)]),
  ...re("committed", { cooldown: 30, toward: "card", onto: !0 }, [ae("nod", 2), we(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...re("sin_fixed", { cooldown: 300 }, [ae("halo", 1), we(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...re("sin_committed", { cooldown: 300 }, [ae("repent", 1), we(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...re("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ae("nod", 4), ae("hand_rub", 4), we(7)]),
  ...re("question_asked", { cooldown: 60 }, [ae("ask_sign", 9), ae("look_up", 3), we(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...re("reported", { cooldown: 90 }, [No("read", 3), ae("nod", 1), we(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...re("read_message", { cooldown: 30 }, [No("read", 3), we(1)]),
  ...re("fact_filed", { cooldown: 120 }, [ae("file_card", 3), ae("nod", 1), we(6)]),
  ...re("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ae("nod", 2), we(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...re("bar_done", { holds: !0 }, Ay()),
  ...re("bar_failed", { holds: !0 }, [ae("fume", 1), ae("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...re("standing", { cooldown: 12 }, [ae("look_left", 2), ae("look_right", 2), ae("look_up", 1), we(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...re("launched", { cooldown: 300 }, [ae("tumble", 3), we(47)]),
  // a break from the hammering now and then
  ...re("building", { cooldown: 30 }, [ae("wipe_brow", 4), ae("look_left", 1), ae("look_right", 1), we(69)]),
  ...re("failed", { cooldown: 20, toward: "card" }, [ae("shake", 3), ae("tantrum", 2), we(2)]),
  ...re("refused", { cooldown: 20 }, [ae("shake", 1), we(1)]),
  ...re("work_done", { cooldown: 120 }, [ae("stretch", 2), we(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...re("pondering", { cooldown: [30, 60] }, [pe("ponder", 1)]),
  ...re("thought_cloud", { cooldown: 90 }, [pe("cloud", 1)]),
  ...re("light_bulb", { cooldown: 150 }, [pe("bulb", 1)]),
  ...re("answered", { cooldown: 15 }, [Sa("amused", 3), we(2)]),
  ...re("heard", { cooldown: 30 }, [
    ae("bow", 1, { voices: ["butler"] }),
    ae("salute", 1, { voices: ["squire"] }),
    ae("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    we(1)
  ]),
  ...re("long_walk", { cooldown: 90 }, [ae("stumble", 3), we(22)]),
  ...re("card_arrived", { cooldown: 20, toward: "card" }, [ae("glance", 7), we(13)]),
  ...re("typing", { cooldown: 60 }, [Sa("reading", 1), we(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(Sy).flatMap(([e, t]) => re(`reacted:${e}`, {}, [Sa(t, 1)])),
  ...Object.entries(Cr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => re(`agent_reacted:${n}`, {}, [ae(a, 1, { voices: [e] })])[0])),
  ...Object.entries(Or).flatMap(([e, t]) => re(`agent_reacted:${e}`, {}, [ae(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...re("pastime", {}, [
    vt("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    vt("rest", 3, 180, 120),
    vt("yawn", 2, 60, 60),
    vt("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    vt("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    vt("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    vt("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...Ht(yt(ae("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Ht(yt(ae("disco", 2, { ball: "bubble" }))),
    we(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...re("held:search", { cooldown: _y }, [_a("search", 3), { ..._a("binoculars", 2), when: { home: !0 } }, { ..._a("glass_bubble", 2), when: { bubble: !0 } }]),
  ...re("held:type", {}, [ae("type", 3), ae("type_ponder", 1)]),
  ...re("held:compacting", {}, [ae("pack_box", 3), ae("vacuum", 2), ae("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...re("spell", {}, [pe("writing", 12, { state: "writing" }), pe("reading", 12, { state: "reading" }), pe("searching", 12, { state: "searching" }), we(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...re("tickled", {}, [{ ...yt(ae("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...re("eager", {}, [ae("eager", 2, { slow: !0 }), we(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...re("jump", {}, [Ht(yt(ae("backflip", 7, { high: !0 }))), ae("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...re("climb", {}, [pe("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...re("unit", { cooldown: Ar.build.cooldown }, [pe("unit", xy.weight), we(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...re("progress_jump", { cooldown: 6 }, [ae("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...re("perch", {}, [{ ...pe("hang", 1, { hands: !0, free: !0 }), cooldown: My.every }, pe("stand", 5)]),
  // a digit a blow's dust lets out
  ...re("digit", {}, [pe("0", 1), pe("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...re("roam", {}, [
    pe("rest", 35, {}, { stay: [25, 60] }),
    pe("seat", 15, {}, { stay: [15, 40] }),
    pe("edge", 25, {}, { stay: [8, 20] }),
    Ht(pe("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    pe("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    pe("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    pe("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    pe("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    pe("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    Ht(yt(pe("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...re("laptop", {}, [pe("seat", 6, {}, { stay: [60, 150] }), pe("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...re("ledge_at", {}, [pe("middle", 2, {}, { along: 1 / 2 }), pe("third", 1, {}, { along: 1 / 3 }), pe("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...re("composed_as", {}, [
    pe("facing", 4, {}, { turn: 0, leans: 0 }),
    pe("turned_left", 1, {}, { turn: 335, leans: 0 }),
    pe("turned_right", 1, {}, { turn: 25, leans: 0 }),
    pe("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    pe("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], Tr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), Rr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), Cy = (e) => Array.isArray(e) ? e[0] : e, Oy = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, Ty = (e) => aa.some((t) => t.when.moment === e);
function Ry(e) {
  var d;
  const t = e.has ?? (() => !0), n = (u) => e.now - (e.memory.get(u) ?? -1 / 0), a = (u) => !e.memory || Rr(u).every(([f, m]) => n(f) >= Cy(m)), s = (u) => !u.shenanigan || u.lasts <= (e.room ?? 0), o = aa.filter((u) => Tr(u.when, e) && (u.type !== "clip" || t(u.name)) && a(u) && s(u)), r = (((d = e.tally) == null ? void 0 : d.plain) ?? 0) >= wy.after && o.some((u) => u.shenanigan) ? o.filter((u) => u.shenanigan) : o, i = r.filter((u) => {
    var f;
    return u.type === "nothing" || u.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return i.some((u) => u.type !== "nothing") ? i : r;
}
function ze(e, t) {
  const n = Ry(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (Ir(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Ir(e, t, n) {
  var a;
  for (const [s, o] of Rr(t)) (a = e.memory) == null || a.set(s, e.now + Oy(o, n));
}
function m$(e, t, n) {
  Ir(e, aa.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const p$ = (e) => Object.values(Ar).find((t) => Tr(t.when, e)) ?? null, Iy = (e, t, n) => n - t <= (e.lifetime ?? Rs), g$ = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || _r(e.clip, t));
class Br {
  constructor(t) {
    this.card = t;
  }
  isTest() {
    var t;
    return !!((t = this.card.guesses) != null && t.test);
  }
  isBuild() {
    var t;
    return !!((t = this.card.guesses) != null && t.build);
  }
  isUpload() {
    var t;
    return !!((t = this.card.guesses) != null && t.upload);
  }
}
const os = {
  idle: "idle",
  asleep: "sleep",
  thinking: "idle",
  quiet: "idle",
  searching: "search",
  reading: "read",
  writing: "type",
  testing: "idle",
  building: "work",
  running: "idle",
  waiting: "waiting",
  asking: "waiting",
  compacting: "compacting",
  paused: "idle",
  stopped: "sleep"
}, v$ = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Lr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), y$ = {
  Read: "reading",
  Grep: "searching",
  Glob: "searching",
  WebSearch: "searching",
  WebFetch: "searching",
  Edit: "writing",
  MultiEdit: "writing",
  Write: "writing",
  NotebookEdit: "writing",
  Bash: "running"
}, b$ = 120, By = 20, w$ = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < By), Ly = (e) => os[e] || os.idle, k$ = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Nr = "airborne", Ny = "landing", Dy = "travelling", Dr = "grounded", $$ = ({ airborne: e, landing: t, trip: n }) => e ? Nr : t ? Ny : n != null && n.started ? Dy : Dr;
function x$(e, t) {
  var s;
  const n = jy(e, t);
  return e.mode === Dr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function jy(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: r, beat: i, state: d, doing: u, doingFacing: f = 0, readingFacing: m = null } = e;
  if (n === Nr && r.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? r.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...Py(o, u, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (r.posture === "hang") return { clip: `hang_${r.grip}`, facing: r.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (r.view && d === "asking") return { clip: "point", facing: 0 };
  const v = m !== null && r.posture === "stand" && u !== "push";
  return ["asking", "waiting"].includes(d) && !["work", "push"].includes(u) ? { clip: "waiting", facing: v ? m : e.composeFacing ?? 0 } : { clip: t(u, r.posture) ? u : Ly(d), facing: v ? m : r.posture === "sit" ? r.face : f };
}
function Py(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const ls = (e) => e.outcome, qy = "plugin:code-commandments:sins:", Do = (e) => e.type === "plugins.card" && e.markKey.startsWith(qy), Fy = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => Do(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => Do(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], M$ = (e, t) => e.filter((n) => n.author === "user" && Wn(n.read_at) > t).map((n) => ({ beat: "read_message", time: Wn(n.read_at), card: Jl(n) })).sort((n, a) => n.time - a.time), jo = { user: "reacted", agent: "agent_reacted" };
function S$(e, t) {
  return e.filter((n) => jo[n.author] && St(n) > t).map((n) => ({ beat: `${jo[n.author]}:${n.emoji}`, time: St(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const Wy = [.../* @__PURE__ */ new Set([...Object.values(Cr).flatMap((e) => Object.keys(e)), ...Object.keys(Or)])];
function _$(e, t) {
  return e.filter((n) => n.author === "agent" && St(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = Wy.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: St(n), card: Jl(n) })).sort((n, a) => n.time - a.time);
}
const Hy = (e) => new Br(e).isTest(), Vn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[ls(e)] || "";
}, Uy = 1800, zy = (e, t) => {
  if (Vn(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && Vn(n) !== "finished" && Number(e.time) - Number(n.time) <= Uy ? "tests_fixed" : "tests_passed";
};
function E$(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(Hy), s = a.filter((r) => Vn(r)), o = s.filter((r) => t.get(r.key) === "" || !t.has(r.key) && Number(r.time) > n);
  return a.forEach((r) => t.set(r.key, Vn(r))), o.map((r) => ({ beat: zy(r, s), time: Number(r.time), card: r.key }));
}
function A$(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(ls(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: ls(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const C$ = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: St(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function O$(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function T$(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function R$(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((r) => r.time > t).map((r) => {
    var i;
    return { beat: (i = Fy.find((d) => d.matches(r))) == null ? void 0 : i.beat, time: r.time, card: r.key };
  }).filter((r) => r.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((r, i) => r.time - i.time);
}
function Is(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const Po = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function Vy(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const r = (s + o) / 2;
    Is(e, t, r, a).pitch > n ? s = r : o = r;
  }
  return (s + o) / 2;
}
function I$(e, t, n, a = {}) {
  const s = ze({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : Ty(`held:${e}`) ? "idle" : e;
}
const Te = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function B$(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Te.ahead * n ? 180 : Math.sign(a) * Te.turn;
}
const qo = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function L$(e, t) {
  const n = Math.min(Te.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Te.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Te.lines, Math.floor((e.bottom - e.top - 2 * a) / Te.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Te.sweep) % s, r = o % Te.sweep, i = Te.sweep - Te.returnSeconds, d = qo((r - i) / Te.returnSeconds), u = r <= i ? qo(r / i) : 1 - d, f = l + ((l + 1) % s - l) * d;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * u, y: e.top + a + f * Te.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Fo = 3, jr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, Wo = 12, N$ = (e, t) => ({ mood: e, began: t, seen: 0 });
function D$(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!jr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= Fo ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * Wo) / Wo, lasts: Fo } };
}
const j$ = (e) => e.posture === "hang" && !jr(e.face), Gy = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), Ky = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function P$(e, t, n) {
  return Gy.has(e) ? 1 / 0 : !Ky.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Pr(n - t.began, t.share) - et.lead, 0);
}
const Yy = 5;
function q$(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= Yy ? { beat: "long_walk", time: n } : null };
}
const Jy = 30, En = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function F$(e, t, n, a, s = null) {
  if (t && n < t.until || !En.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = ze({ moment: "spell", state: e, tally: s }, a), [l, r] = En.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (r - l), next: n + En.every } : { state: e, began: 0, until: 0, next: n + En.every };
}
const W$ = (e, t, n) => t && n < t.until && Lr.has(e.state) ? { state: t.state, since: t.began } : e, et = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Pr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function H$(e, t, n, a) {
  var r;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = Pr(o, e.share);
  return s ? { eager: Zy(t, l), moment: null } : l > et.lead ? { eager: t, moment: null } : l < et.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > et.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < et.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((r = ze({ moment: "eager", slow: !0 }, n)) == null ? void 0 : r.name) === "eager" }, moment: null };
}
function Zy(e, t) {
  return e.on && t > et.lead + et.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= et.lead && t >= et.least ? { ...e, on: !0, calm: !1 } : e;
}
const Xy = 1, Qy = { look: "look", gaze: "gaze" };
function eb(e, t, n, a, s = "", o = () => !0, l = null) {
  const r = ze({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return r ? { [Qy[r.type] ?? "clip"]: r.name, toward: r.toward ?? "", onto: !!r.onto, holds: !!r.holds, lifetime: r.lifetime } : null;
}
const tb = (e, t, n, a, s, o = "", l = () => !0, r = null, i = "") => ze({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: r, ball: i }, s), nb = (e, t, n, a, s, o = 0) => ze({ moment: "jump", high: e > Xy * t, memory: a, now: s, room: o }, n).name === "backflip", ab = { work: ["building"], idle: ["standing"] };
function U$(e, t, n, a) {
  const s = os[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(ab[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), Lr.has(e) ? { moments: o, began: n || a } : (n && a - n >= Jy && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function sb(e, t, n) {
  return !ze({ moment: "pondering", memory: e, now: t }, n) || !ze({ moment: "thought_cloud", memory: e, now: t }, n) ? null : ze({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Ho = { pondering: sb };
function z$(e, t, n, a, s, o) {
  if (Ho[e.beat]) {
    const r = Ho[e.beat](n.reacted, a, s);
    return r && o(r) ? { beat: { clip: r, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = eb(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== Rs && { lifetime: l.lifetime } } } : null;
}
function V$(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = tb(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return i && { clip: i.name, card: "", flies: !!i.flies };
}
const G$ = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function K$(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function Y$(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const J$ = (e, t) => !!(e != null && e.watches) && !t.once, Z$ = 10, X$ = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || Iy(a, a.queuedAt, n)), Q$ = (e, t) => t ? null : e[0] ?? null;
function ex(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const tx = (e, t) => !t.during || !e.some((n) => n.during === t.during), ob = 2 * Math.PI, lb = 500;
function nx(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), r = l / lb, i = t && e.point && !!t.behind != !!e.point.behind, d = i && e.amount > 0, u = t && !d ? o : 0, f = e.amount < u ? Math.min(e.amount + r, u) : Math.max(e.amount - r, u), m = ob * l / 1e3, v = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, A = (d ? v : t != null && t.behind && t.mood === "reading" ? { ...t } : t && v && !i ? s && !t.behind && !v.behind ? ib(v, t, n, m, s) : ub(v, t, n, m) : t) ?? v, R = A != null && A.behind && A.mood === "reading" ? rb(e.point, A, n, l, s) : A;
  return { point: R ?? null, toward: R ? { x: R.x - n.x, y: R.y - n.y } : null, amount: f, at: a };
}
function rb(e, t, n, a, s) {
  const o = (w) => w * 180 / Math.PI, l = (w) => o(Math.atan2(Math.sin(w * Math.PI / 180), Math.cos(w * Math.PI / 180))), r = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, d = l(o(Math.atan2(t.x - n.x, -i)) - r), u = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - r), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), m = f ? l(e.readingFacing - r) : 0, v = f ? e.readingYaw + m : u, y = v + l(d - v), A = Math.min(Math.max(a / 1e3, 0), 0.1), R = Te.turnSpeed * A, S = f ? v + Math.min(Math.max(y - v, -R), R) : y, D = f ? e.readingFollow + m : S, U = D + (S - D) * (1 - Math.exp(-A / Te.followSeconds)), N = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, B = o(Is(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), F = Math.min(Math.max(B, -N.up), N.down), E = Te.tipSpeed * A, _ = f ? e.readingPitch + Math.min(Math.max(F - e.readingPitch, -E), E) : F;
  return { ...t, readingYaw: S, readingFollow: U, readingPitch: _, readingFacing: r };
}
function ib(e, t, n, a, { depth: s, above: o, tip: l }) {
  const r = (D) => {
    const { yaw: U, pitch: N } = Is(D.x - n.x, s, n.y - D.y, o);
    return { yaw: U, pitch: Math.min(Math.max(N, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [i, d] = [Po(r(e)), Po(r(t))], u = Math.acos(Math.min(Math.max(i[0] * d[0] + i[1] * d[1] + i[2] * d[2], -1), 1));
  if (u <= a) return { ...t };
  const f = a / u, [m, v] = [Math.sin((1 - f) * u) / Math.sin(u), Math.sin(f * u) / Math.sin(u)], [y, A, R] = i.map((D, U) => m * D + v * d[U]), S = s * y / A;
  return { ...t, x: n.x + S, y: n.y - Vy(S, s, -Math.asin(Math.min(Math.max(R, -1), 1)), o) };
}
const cb = 0.15;
function ax(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= cb;
}
function ub(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), r = s + Math.max(-a, Math.min(a, l)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(r), y: n.y + i * Math.sin(r) };
}
const db = (e) => !(e != null && e.on);
function sx(e, t, n) {
  if (db(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((r) => r.beat === s.beat && r.card === s.card) === o);
  return { answer: [], held: a };
}
const an = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Ze = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Ea = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Uo = (e) => e * e * (3 - 2 * e);
function fb(e) {
  if (e < 0 || e >= Ze.seconds) return null;
  const t = Ea(e, ...Ze.flicker), n = Math.floor(t * Ze.flickers * 2) % 2 === 0, a = e < Ze.flicker[1] ? n ? 0.35 + 0.5 * t : Ze.dim : 1;
  return { strength: 1 - Uo(Ea(e, ...Ze.fade)), lit: a, white: e < Ze.flash[0] ? 0 : 1 - Uo(Ea(e, ...Ze.flash)) };
}
const ox = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function lx(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = fb(t - e.at);
  return a && { colour: an.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Ze.signs[e.tone], ...a } };
}
function rx(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function ix(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= an.looks || a === null && n - e.since >= an.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function cx(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (r) => (r + a * 12) % 12, o = (r) => 0.5 - 0.5 * Math.max(-1, Math.min(s(r) - 3, 9 - s(r), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const rt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, ux = { behind: 39, figure: 40, ahead: 41 }, hb = "[data-figure-pile]", mb = { amber: [1, 0.69, 0.125], good: an.colours.good, bad: an.colours.bad }, Ln = { phases: 4, ms: 230, dim: 0.25 }, dx = (e, t, n) => e !== "amber" || (t + n) % Ln.phases < Ln.phases / 2 ? 1 : Ln.dim, fx = (e) => e === "amber" ? Ln.phases : 1;
function hx(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const mx = Object.keys(mb), Ve = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Vt = ([e, t], n) => e + n() * (t - e);
function px(e) {
  const t = Ve.least + Math.floor(e() * (Ve.most - Ve.least + 1));
  return Array.from({ length: Math.min(t, Ve.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Ve.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Vt(Ve.start, e), l = Vt(Ve.reach, e);
    return {
      text: ze({ moment: "digit" }, e).name,
      x: a * o,
      y: Ve.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(Vt(Ve.moveMs, e)),
      fadeMs: Math.round(Vt(Ve.fadeMs, e))
    };
  });
}
const Aa = { high: 3, gap: 1 };
function gx(e) {
  const t = Math.floor(e / Aa.high);
  return { left: -(rt.inside + rt.width / 2 + t * (rt.width + Aa.gap)), up: e % Aa.high * (rt.height - rt.top) };
}
const pb = (e, t, n) => ze({ moment: "unit", memory: e, now: t }, n) !== null, gb = { after: 5 }, vb = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Br(t).isBuild());
function vx(e, t, n) {
  const a = vb(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= gb.after ? s : null;
}
function yx(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: pb(n, a, s) } : null;
}
const zo = { ahead: 140, up: 70 };
function bx(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * zo.ahead, y: a - zo.up } } : o ? { at: { x: n(o), y: a - o.up - rt.height } } : t ? { at: null } : null;
}
const Ca = { least: 4e3, most: 1e4 }, yb = (e) => Ca.least + e() * (Ca.most - Ca.least), bt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function wx(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = yb(t);
    if (n.length >= bt.most || t() >= bt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (bt.at[0] + t() * (bt.at[1] - bt.at[0]));
    n.push({ from: o, to: o + bt.ms }), a = o + bt.ms;
  }
}
const kx = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), $x = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), qr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), xx = new Set(aa.filter((e) => qr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), bb = (e) => e.some((t) => t.state === "built"), Mx = (e, t) => bb(t) ? e.filter((n) => !qr.has(n.beat)) : e, ut = { reach: 40, room: 6 }, wb = (e, t) => t <= e - ut.reach + 2, Sx = (e, t, n) => wb(e, n) ? t - ut.reach : e - ut.reach - ut.room, _x = (e, t, n, a) => a > 0 && t < e && t + ut.reach >= e - 2 ? Math.min(n, Math.max(e, t + ut.reach)) : e, Oa = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, Ex = (e) => Vt(e() < Oa.longShare ? Oa.long : Oa.short, e), kb = 2 * rt.width;
function Ax(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= kb ? o : e + (o - e + s / 2) % s;
}
const $b = 60, Cx = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= $b, Vo = "[data-figure-home]", fn = () => {
  var t;
  const e = document.querySelector(Vo);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Vo)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, xb = "[data-figure-docked-bars]", Mb = "[data-figure-chat-foot]", Sb = [0.85, 0.6, 0.35, 0.15], _b = ["question", "waiting", "suggestion"], Ox = (e, t) => _b.find((n) => e[n] > 0 && t[n] === "behind") || null;
function Tx() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const Eb = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Ab = "[data-figure-newest]";
function Fr() {
  var a, s;
  const e = (a = fn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Ab), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, r;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Bs(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function sn(e, t, n = Fr()) {
  if (!e || !n) return !0;
  const a = at(e, t), s = oa(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Ce.top * t.size, bottom: a.top + Ce.bottom * t.size }, l = $t.gap;
  return !sa(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function Rx(e, t, n, a = Fr()) {
  if (!a || sn(t, e, a)) return null;
  const s = oa(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, r = At(), i = t.posture === "stand" ? Ns * e.size : Yr * e.size, d = Math.max(n.left + i, r.left + o), u = Math.min(n.right - i, r.right - l);
  return [a.left - $t.gap - l, a.right + $t.gap + o].map((m) => ({ ...t, x: m })).filter((m) => m.x >= d && m.x <= u && sn(m, e, a) && aw(m, e)).sort((m, v) => Math.abs(m.x - t.x) - Math.abs(v.x - t.x))[0] ?? null;
}
const Ta = 0.26, Wr = 0.54, Cb = 1.25 / 5.4, hn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Ta, travels: "stand" },
  lounge: { drop: Ta, travels: "stand" },
  composed: { drop: Ta, travels: "stand" },
  hang: { drop: Wr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, Ix = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * Cb * Math.cos(t * Math.PI / 180),
  y: 1 - n - Wr
}), Yt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), Ob = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), Bx = (e, t) => (e === "sit" ? Ob.has(t) : Yt.has(e)) ? e : "stand";
function Lx(e, t) {
  return e.facing === t.facing || !Yt.has(e.posture) && !Yt.has(t.posture) ? t : { posture: "stand", facing: Yt.has(e.posture) ? e.facing : t.facing };
}
const Nx = 0.25, Dx = (e, t) => Yt.has(e) && hn[t].drop === 0, Hr = 2, Tb = 90, Rb = 180, Ib = 140, Bb = 280, Lb = 420, Nb = 0.25, Db = 290, jb = 600, Pb = "cubic-bezier(0.2, 0.7, 0.4, 1)", qb = "cubic-bezier(0.55, 0, 0.9, 0.6)", Ra = 5;
function Gn(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: r = !1, random: i = Math.random, memory: d = null, now: u = 0, room: f = 0, pogo: m = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Ra) return null;
  (l || r) && (o = Math.max(o, Hr));
  const v = o > 1, y = Math.abs(t.x - e.x), A = y < Ra ? 0 : y / (Tb * o) * 1e3, R = Math.min(A, v ? Ib : Rb), S = Math.abs(t.y - e.y), D = t.y < e.y, U = D && !m && nb(S, n, i, d, u, f), N = D ? Lb + Math.min(S, 400) * Nb : Math.sqrt(2 * S / Ts) * 1e3, B = {
    x: t.x,
    y: t.y,
    ms: S > Ra ? U ? jb : N : 0,
    lead: U ? Db : D ? Bb : 0,
    easing: D ? Pb : qb,
    hopping: !0,
    clip: U ? "backflip" : D ? "jump" : "fall"
  }, F = { x: t.x, y: t.y, ms: A + R, lead: 0, easing: "linear", ramp: R, ...v ? { clip: "run" } : {} }, E = m ? Fb(t, n) : B, _ = D && !a ? [{ ...F, y: e.y }, E] : [{ ...B, x: e.x }, F];
  return { way: Math.sign(t.x - e.x) || 1, legs: _, lands: !s, pace: o, running: v };
}
const Fb = (e, t) => ({ x: e.x, y: e.y, ms: _e.pogo.frames / _e.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), Wb = (e, t) => e.postures.includes(t) ? t : e.postures[0], jx = (e, t, n) => e.posture === "walk" && n ? "walk" : Wb(e.clip, t), at = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - hn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, sa = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Bs = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function At() {
  var t;
  const e = (t = fn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const An = 0.5, Go = 20;
function Px(e, t, n = At()) {
  const a = at(e, t);
  return a.left >= n.left + Go && a.right <= n.right - Go;
}
function Ls(e, t, n = At()) {
  const a = at(e, t), s = a.right - a.left, o = oa(e), [l, r] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - An && r <= n.right + An && a.top >= n.top - An && i <= n.bottom + An;
}
const Kn = [0.35, 0.5, 0.65], Yn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ce = { left: Kn[0], right: Kn.at(-1), top: Yn[0], bottom: Yn.at(-1) }, Hb = 0.24;
function oa(e) {
  if (e.posture === "stand") return { left: Ce.left, right: Ce.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Hb * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ce.left, t), right: Math.max(Ce.right, t) };
}
function Ub(e, { size: t }, n = At()) {
  const a = oa(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const Ns = (Ce.right - Ce.left) / 2 + 0.08;
function qx(e, t) {
  return e === "hang" ? Ce : { ...Ce, bottom: Math.min(Ce.bottom, 1 - t - hn[e].drop) };
}
const zb = "[data-figure-agent]";
function Ur(e, t, n = "", a = "") {
  var r;
  const s = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !Bs(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const i of [l - 1, l].filter((d) => d >= 0)) {
    if (!o.data[i].trim()) continue;
    const d = document.createRange();
    if (d.setStart(o, i), d.setEnd(o, i + 1), [...d.getClientRects()].some((u) => e >= u.left && e <= u.right && t >= u.top && t <= u.bottom)) return !0;
  }
  return !1;
}
const zr = (e) => Yn.flatMap(
  (t) => Kn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Ds(e, t, n = "") {
  if (!sn(e, t)) return Kn.length * Yn.length;
  const a = at(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(Eb)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: i }) => i.width && i.height && sa(s, i) && Bs(r)).map(({ rect: r }) => r), l = (r, i) => o.some((d) => r >= d.left && r <= d.right && i >= d.top && i <= d.bottom);
  return zr(s).filter(([r, i]) => l(r, i) || Ur(r, i, n)).length;
}
function Vb(e, t) {
  const n = at(e, t);
  return zr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Ur(a, s, "", zb)).length;
}
const Ko = 4;
function Fx(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Ko; o <= s; o += Ko)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const r = { ...t, x: l };
      if (!Vb(r, e) && sn(r, e)) return r;
    }
  return null;
}
function on(e, t, n) {
  const a = At(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => Ls(l, t, a) && sn(l, t)).map((l) => ({ spot: l, covered: Ds(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, r) => r.covered < l.covered || r.covered === l.covered && r.away < l.away ? r : l
  ).spot : null;
}
const Vr = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), Gb = [0.5, 0.25, 0.75], Kb = (e) => Vr(e.getBoundingClientRect(), Gb), Gr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, Yb = Ns, Jb = (e, t, { size: n }, a = Yb) => Kr(e, Gr[t], a * n, "stand");
function Kr(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const Zb = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Yr = 0.1, Xb = (e, t, { size: n }) => Kr(e, Zb[t], Yr * n, "sit"), Qb = (e) => ((e + 180) % 360 + 360) % 360 - 180, Ia = 60;
function Wx(e, t) {
  const n = Qb(t);
  return !e.aside || Math.abs(n) >= Ia ? t : n < 0 ? 360 - Ia : Ia;
}
const Jt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, ew = (e) => [.../* @__PURE__ */ new Set([e, ...Jt.turns.map((t) => (t + 360) % 360)])];
function Hx(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = ew(t), l = Jt.every[0] + a() * (Jt.every[1] - Jt.every[0]);
  return { face: t, from: s ? tw(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function tw(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Jt.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function Ux(e, t) {
  const { element: n, edge: a } = la(), s = ["left", "right"].map((r) => mn(Xb(a, r, e), e)).filter((r) => n && Ls(r, e) && !Ds(r, e)), o = (r) => t ? Math.abs(r.x - t.x) : 0, l = s.sort((r, i) => o(r) - o(i))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function zx(e, t, { size: n }) {
  const a = (Ce.right - Ce.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Jr } : e;
}
const Jr = 7;
function Zr() {
  const e = [...document.querySelectorAll(hb)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function nw(e, t) {
  const n = at(e, t), a = n.right - n.left;
  return { left: n.left + Ce.left * a, right: n.left + Ce.right * a, top: n.top + Ce.top * a, bottom: n.bottom };
}
function aw(e, t) {
  const n = Zr();
  return !n || !sa(nw(e, t), n);
}
const sw = 4;
function la() {
  const e = pn(), t = Zr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > sw || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Jr - n, 0) } };
}
const Vx = ({ size: e, below: t }) => (1 - t) * e;
function mn(e, t) {
  const n = At(), { size: a, below: s } = t, o = hn[e.posture].drop * a;
  return { ...Ub(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const rs = (e, t) => Object.keys(Gr).map((n) => mn(Jb(e, n, t), t)), js = (e, t) => Vr(e, Sb).map((n) => mn(n, t)), Xr = (e, t, n) => on(e, t, n) ?? e[0];
function Gx(e, t) {
  const { element: n, edge: a } = la();
  return { ...Xr(rs(a, e), e, t), view: null, on: n };
}
function Kx(e, t, n, a) {
  const { element: s, edge: o } = la(), l = (a ? rs(o, t) : [...rs(o, t), ...js(o, t)]).filter(
    (d) => !sa(at(d, t), e)
  ), r = on(
    l.filter((d) => d.x > (e.left + e.right) / 2),
    t,
    n
  ), i = r && !Ds(r, t) ? r : on(l, t, n);
  return i && { ...i, view: null, on: s };
}
function pn() {
  var a;
  const e = fn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(xb);
  if (!t) return { ...ra(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Yo = { within: 2 };
function Yx(e) {
  const { element: t, docked: n, edge: a } = pn();
  if (!n || e.on !== t) return !0;
  const s = ra().edge;
  return a.left > s.left + Yo.within || a.left + a.width < s.left + s.width - Yo.within;
}
const ow = "[data-figure-closing]";
function Jx() {
  var n;
  const { element: e, docked: t } = pn();
  return t && !!((n = e.firstElementChild) != null && n.matches(ow));
}
const Qr = "[data-figure-progress]";
function Zx(e) {
  const t = e.querySelector(Qr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function Xx(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const lw = { across: 300, above: 380, below: 60 };
function Qx(e) {
  const { across: t, above: n, below: a } = lw;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: rw(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const rw = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), ei = "[data-figure-bar]", is = { back: 144, along: 0.4 };
function e8(e) {
  const { element: t, docked: n, edge: a } = pn(), s = n ? t.querySelector(ei) : null;
  if (!(s != null && s.querySelector(Qr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...mn({ x: o - is.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function t8(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < is.along * a.size ? t.x + is.along * a.size : e.x, y: e.y, behind: !0 };
}
function n8(e) {
  const t = e.querySelector(ei), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function ra() {
  const e = fn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function a8(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: r } = ra(), i = n === null ? iw(r, e, o === null ? t : { x: o, y: r.top }, a, s) : mn({ x: n, y: r.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: l, stays: !0 };
}
function iw(e, t, n, a, s) {
  const o = js(e, t), l = Math.min(...o.map((i) => i.x)), r = o.filter((i) => i.x + a + rt.width < s && i.x + a - ut.reach - ut.room >= l);
  return on(r.length ? r : o, t, n);
}
const cw = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function s8(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: r = Math.random, via: i = [], memory: d = null, now: u = 0, room: f = 0, pogo: m = !1 } = {}) {
  (o || l) && (s = Math.max(s, Hr));
  const v = (U) => {
    const N = at(U, n, hn[U.posture].travels);
    return { x: N.left, y: N.top };
  }, y = t.ladder ?? e.ladder;
  if (y && !(t.ladder && e.ladder)) return uw(v(e), v(t), v({ ...y.foot, posture: "stand" }), y.way, !!t.ladder, n, s);
  const [A, ...R] = [e, ...i, t].map(v), S = Gn(A, R[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: r, memory: d, now: u, room: f, pogo: m }), D = R.slice(1).map((U, N) => {
    var B;
    return (B = Gn(R[N], U, n.size, { random: r, memory: d, now: u, room: f })) == null ? void 0 : B.legs.find((F) => F.hopping);
  });
  return S && { ...S, legs: [...S.legs, ...D.filter(Boolean)] };
}
function uw(e, t, n, a, s, o, l) {
  const r = (u, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - u.x, f.y - u.y) / cw.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? Gn(e, n, o.size, { pace: l }) : Gn(n, t, o.size, { pace: l }), d = s ? [...(i == null ? void 0 : i.legs) ?? [], r(n, t)] : [r(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: d, lands: !1, pace: l, running: l > 1 };
}
function o8(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function l8(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && on(Kb(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = la();
  return { ...Xr(js(s, t), t, n), view: null, on: a };
}
const dw = "[data-figure-bubble]", fw = 250;
let Zt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), ti = 0;
const Ft = () => Zt, Ba = /* @__PURE__ */ new WeakMap();
let hw = 0;
function Ps(e) {
  return Ba.has(e) || Ba.set(e, `floor-${++hw}`), Ba.get(e);
}
const mw = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, pw = () => {
  var e, t;
  return ((t = (e = fn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function gw(e, t) {
  var a;
  const n = (a = e.querySelector(Mb)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function vw(e, t) {
  const n = e && gw(e, t), a = e ? [...e.querySelectorAll(dw)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || mw(l, n))).map(({ element: o, type: l, box: r }) => ({ id: Ps(o), type: l, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const yw = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= fw ? (t.top - a.top) / s * 1e3 : 0;
};
function ni(e = Zt, t = performance.now()) {
  const n = At(), a = pw(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: r } = pn(), i = [];
  o && i.push({ id: "home", type: l ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const d = ra();
  return d.element && i.push({ id: Ps(d.element), type: "build", element: d.element, left: d.edge.left, right: d.edge.left + d.edge.width, top: d.edge.top }), i.push(...vw(a, s)), i.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((u) => Object.freeze({ ...u, vy: yw(e, u, t) }))) });
}
const cs = /* @__PURE__ */ new Set();
function bw(e) {
  return cs.add(e), () => cs.delete(e);
}
function ww() {
  ai();
  const e = () => {
    ti = requestAnimationFrame(e), !document.hidden && (Zt = ni(Zt), cs.forEach((t) => t(Zt)));
  };
  e();
}
function ai() {
  cancelAnimationFrame(ti);
}
const qs = 5, kw = 56, $w = { share: 0.6 }, xw = (e) => -Math.sqrt(2 * Ts * $w.share * e), Dt = (e, t) => e.find((n) => n.id === t) ?? null;
function r8(e, t = ni().floors) {
  const n = Dt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : Ps(e.on) : null, o = s && Dt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function si({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, r, i = Ft().floors) {
  const d = Dt(i, e);
  if (!d) return null;
  const u = { x: d.left + t, y: d.top + n, posture: a, face: s };
  return (l || Mw(d, u, o)) && Sw(u, r, i) ? { x: u.x, y: u.y } : null;
}
const Fs = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, Mw = (e, t, n) => !Fs({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function i8(e, t = Ft().floors) {
  if (!Fs(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= qs && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function Sw(e, t, n = Ft().floors) {
  const a = Dt(n, "home");
  return e.posture === "hang" && a && at(e, t).bottom >= a.top ? !1 : Ls(e, t);
}
function c8(e, t, n, a = Ft().floors) {
  const s = si(e, n, a);
  if (!e.home) return _w(e, t, s, a);
  if (!s) return null;
  const o = Dt(a, "home"), l = s.y - t.y, r = l > qs ? "dropping" : -l > kw ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: r };
}
function _w(e, t, n, a) {
  const s = n ? Dt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: xw(e.risen) };
  if (!n) return null;
  if (Fs(t) && n.y - t.y > qs) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function u8(e, t, n) {
  const a = Ns * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function d8(e, t, n, a = Ft().floors) {
  const s = t && si(t, n, a);
  return s ? { ...e, ...s } : e;
}
const Ew = ["data-type"], Aw = { class: "figure-floor-name" }, Cw = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ge({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      g("span", Aw, $(e.floor.type), 1)
    ], 12, Ew));
  }
}, Ow = /* @__PURE__ */ J(Cw, [["__scopeId", "data-v-4e0f1e2e"]]), Tw = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Rw = {
  __name: "FigureFloors",
  setup(e) {
    const t = Ke(Ft().floors);
    let n = () => {
    };
    return Re(() => {
      n = bw((a) => t.value = a.floors), ww();
    }), Be(() => {
      n(), ai();
    }), (a, s) => (c(), h("div", Tw, [
      (c(!0), h(V, null, te(t.value, (o) => (c(), H(Ow, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, f8 = /* @__PURE__ */ J(Rw, [["__scopeId", "data-v-e519168b"]]), La = (e) => typeof e == "number" ? e : Date.parse(e);
function h8(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: La(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => La(s.row.created_at) - La(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const Iw = 3, Na = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function Bw(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Na[n.grouping]) == null ? void 0 : a.call(Na, e.row, n)) || "";
}
function Lw(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function m8(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= Iw ? [Lw(a, t)] : a), a = [];
  };
  for (const l of e) {
    const r = Bw(l, t);
    r !== s && o(), s = r, r ? a.push(l) : n.push(l);
  }
  return o(), n;
}
const Nw = 1e3;
function Dw() {
  const e = I(Date.now()), t = setInterval(() => e.value = Date.now(), Nw);
  return ft(() => clearInterval(t)), e;
}
const jw = ["datetime", "title"], ia = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Dw(), a = T(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, $(q(cr)(e.at, q(n))), 9, jw));
  }
};
function p8(e) {
  const t = We(), n = t.option("row"), a = I(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), he(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function Pw(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const g8 = (e) => (t) => t.filter((n) => n.id !== e), v8 = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), y8 = (e) => (t) => [...t, e], b8 = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function w8(e, t = {}) {
  const n = We(), a = I(null), s = I("");
  async function o(...l) {
    const r = await n.read(e(...l), t);
    s.value = r.ok ? "" : r.error, r.ok && (a.value = r.value);
  }
  return { value: a, failure: s, load: o };
}
function k8(e) {
  const t = We(), n = I("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Cn = /* @__PURE__ */ new Map();
function qw(e, t) {
  if (Cn.has(e)) return Cn.get(e);
  const n = t().finally(() => Cn.delete(e));
  return Cn.set(e, n), n;
}
function $8() {
  const e = We(), t = I(null), n = I("");
  async function a() {
    const s = await qw(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const Fw = { class: "cards-page" }, Ww = { class: "cards-bar" }, Hw = { class: "cards-count" }, Uw = { class: "cards" }, zw = {
  key: 1,
  class: "cards-note"
}, Vw = {
  key: 2,
  class: "cards-note"
}, Gw = ["data-row", "onClick"], Kw = { class: "card-head" }, Yw = { class: "card-title" }, Jw = { class: "card-foot" }, Zw = {
  __name: "RowCards",
  props: {
    rows: { type: Array, required: !0 },
    failure: { type: String, default: "" },
    loaded: { type: Boolean, required: !0 },
    noun: { type: String, required: !0 },
    icon: { type: String, required: !0 },
    head: { type: Function, required: !0 },
    title: { type: Function, required: !0 },
    foot: { type: Function, required: !0 }
  },
  emits: ["new", "open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", Fw, [
      g("div", Ww, [
        g("span", Hw, $(e.rows.length) + " " + $(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        L(ue, Le({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: j(() => [
            L(ye, {
              name: "plus",
              size: 12
            }),
            ee(" New " + $(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      g("div", Uw, [
        e.loaded ? e.failure ? (c(), h("p", zw, $(e.failure), 1)) : e.rows.length ? O("", !0) : (c(), h("p", Vw, "No " + $(e.noun) + "s yet", 1)) : (c(), H(_t, {
          key: 0,
          shape: "cards"
        })),
        (c(!0), h(V, null, te(e.rows, (o) => (c(), h("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          g("span", Kw, [
            L(ye, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            ee(" " + $(e.head(o)), 1),
            L(ia, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          g("span", Yw, $(e.title(o)), 1),
          g("span", Jw, $(e.foot(o)), 1)
        ], 8, Gw))), 128))
      ]),
      de(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, x8 = /* @__PURE__ */ J(Zw, [["__scopeId", "data-v-990e6b37"]]), Jo = "newest";
function M8(e, { title: t, isOpen: n = null }) {
  var d;
  const a = (d = Oe(Ne, null)) == null ? void 0 : d.search, s = I(""), o = I(Jo), l = I("all"), r = T(() => {
    const u = s.value.trim().toLowerCase(), f = e.value.filter((m) => Pw(m, u, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(m) === (l.value === "open")));
    return o.value === Jo ? f : [...f].sort((m, v) => t(m).localeCompare(t(v)));
  }), i = T(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: r, filtering: i, hasStates: !!n };
}
const Xw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, Qw = 40, ek = "top", tk = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, a = (f = Oe(Ne, null)) == null ? void 0 : f.autoScroll, s = T(() => a === ek), o = I(null), l = I(!1), r = (m) => s.value ? m.scrollTop : m.scrollHeight - m.scrollTop - m.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, d = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function u() {
      l.value = r(o.value) >= Qw;
    }
    return he(() => n.rowCount, async () => {
      await mt(), !l.value && o.value && (o.value.scrollTop = i());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (m, v) => (c(), h("div", Xw, [
      g("div", {
        ref_key: "pane",
        ref: o,
        class: X(["auto-scroll-pane", e.paneClass]),
        onScroll: u
      }, [
        de(m.$slots, "default", {}, void 0, !0)
      ], 34),
      L(jt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: j(() => [
          Ye(g("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: d
          }, [
            L(ye, {
              name: s.value ? "up" : "down"
            }, null, 8, ["name"]),
            v[0] || (v[0] = ee(" Newest ", -1))
          ], 512), [
            [ll, l.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, S8 = /* @__PURE__ */ J(tk, [["__scopeId", "data-v-3accb764"]]), nk = ["aria-selected", "data-tab", "onClick"], ak = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, sk = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Oe(Ne, null), o = T(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = I(null), r = I({ left: 0, width: 0, slides: !1 }), i = (m) => n.answer[m.count_field] !== void 0;
    function d(m) {
      var y;
      const v = (y = l.value) == null ? void 0 : y.querySelector(".inner-tab.on");
      if (!v) return void (r.value = { left: 0, width: 0, slides: !1 });
      r.value = { left: v.offsetLeft, width: v.offsetWidth, slides: m }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, v.offsetLeft - 12));
    }
    const u = () => mt(() => d(!0));
    let f = null;
    return Re(() => {
      var m;
      d(!1), f = new ResizeObserver(() => d(!1)), f.observe(l.value), (m = document.fonts) == null || m.ready.then(() => d(!1));
    }), Be(() => f == null ? void 0 : f.disconnect()), he(() => {
      var m;
      return (m = n.active) == null ? void 0 : m.key;
    }, u), he(() => n.answer, u, { deep: !0 }), (m, v) => (c(), h("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (c(!0), h(V, null, te(o.value, (y) => {
        var A, R;
        return c(), h("button", {
          key: y.key,
          type: "button",
          role: "tab",
          class: X(["inner-tab", { on: ((A = e.active) == null ? void 0 : A.key) === y.key }]),
          "aria-selected": ((R = e.active) == null ? void 0 : R.key) === y.key,
          "data-tab": y.key,
          onClick: (S) => a("choose", y)
        }, [
          ee($(y.label) + " ", 1),
          i(y) ? (c(), h("span", ak, $(e.answer[y.count_field]), 1)) : O("", !0)
        ], 10, nk);
      }), 128)),
      g("i", {
        class: X(["inner-tabs-line", { slides: r.value.slides }]),
        style: ge({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, _8 = /* @__PURE__ */ J(sk, [["__scopeId", "data-v-63fcd326"]]), ok = {
  class: "tab-body",
  "data-tab-body": ""
}, lk = { "data-tab-content": "" }, rk = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = I(!1);
    let a = 0;
    return he(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, ps(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (c(), h("div", ok, [
      n.value ? (c(), H(_t, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : O("", !0),
      Ye(g("div", lk, [
        de(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [ll, !n.value]
      ])
    ]));
  }
}, E8 = /* @__PURE__ */ J(rk, [["__scopeId", "data-v-63876533"]]), ik = {}, ck = { class: "menu-label" };
function uk(e, t) {
  return c(), h("span", ck, [
    de(e.$slots, "default", {}, void 0, !0)
  ]);
}
const us = /* @__PURE__ */ J(ik, [["render", uk], ["__scopeId", "data-v-aa955b3e"]]), dk = {
  class: "search-bar",
  "data-search-bar": ""
}, fk = { class: "search-bar-control" }, hk = ["value", "placeholder", "aria-label"], mk = ["aria-expanded"], pk = {
  key: 0,
  "data-menu-count": ""
}, gk = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var S;
    const a = e, s = n, o = bi(), l = ((S = Oe(Ne, null)) == null ? void 0 : S.search) ?? {}, r = T(() => l.placeholder || a.placeholder), i = l.context ?? [], d = I(null), u = I(null), f = I([]), m = T(() => f.value.length ? f.value[f.value.length - 1].next : i), v = T(() => !!o.menu || i.length > 0), y = (D) => {
      f.value = [], u.value = u.value ? null : D.currentTarget;
    };
    function A(D) {
      if (D.next.length) {
        f.value = [...f.value, D];
        return;
      }
      u.value = null, s("pick", D.click);
    }
    function R() {
      var D;
      s("update:modelValue", ""), (D = d.value) == null || D.focus();
    }
    return t({ focus: () => {
      var D;
      return (D = d.value) == null ? void 0 : D.focus();
    } }), (D, U) => {
      var N;
      return c(), h("div", dk, [
        g("div", fk, [
          L(ye, {
            class: "search-bar-icon",
            name: "search",
            size: 14
          }),
          g("input", {
            ref_key: "field",
            ref: d,
            class: "search-bar-input",
            type: "text",
            "data-search-input": "",
            value: e.modelValue,
            placeholder: r.value,
            "aria-label": r.value,
            onInput: U[0] || (U[0] = (B) => s("update:modelValue", B.target.value)),
            onKeydown: Xt(R, ["esc"])
          }, null, 40, hk),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: R
          }, [
            L(ye, {
              name: "close",
              size: 12
            })
          ])) : O("", !0),
          v.value ? (c(), h("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!u.value,
            onClick: y
          }, [
            e.menuCount ? (c(), h("span", pk, $(e.menuCount), 1)) : O("", !0),
            L(ye, {
              name: "caret",
              size: 12
            })
          ], 8, mk)) : O("", !0)
        ]),
        (N = q(l).button) != null && N.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: U[1] || (U[1] = (B) => s("pick", q(l).button.click))
        }, $(q(l).button.title), 1)) : O("", !0),
        de(D.$slots, "default", {}, void 0, !0),
        u.value ? (c(), H(ea, {
          key: 1,
          anchor: u.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: U[3] || (U[3] = $e(() => {
          }, ["stop"])),
          onClose: U[4] || (U[4] = (B) => u.value = null)
        }, {
          default: j(() => [
            f.value.length ? (c(), H(Mt, {
              key: 0,
              "data-search-back": "",
              onClick: U[2] || (U[2] = (B) => f.value = f.value.slice(0, -1))
            }, {
              default: j(() => [
                ee("‹ " + $(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : O("", !0),
            (c(!0), h(V, null, te(m.value, (B) => (c(), H(Mt, {
              key: B.title,
              description: B.subtext,
              "data-search-entry": B.title,
              onClick: (F) => A(B)
            }, {
              default: j(() => [
                ee($(B.title) + $(B.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? O("", !0) : de(D.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : O("", !0)
      ]);
    };
  }
}, vk = /* @__PURE__ */ J(gk, [["__scopeId", "data-v-45374bed"]]), yk = {
  __name: "ListTools",
  props: { tools: { type: Object, required: !0 }, placeholder: { type: String, default: "Search" } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], s = [
      { key: "open", label: "Open" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ];
    return (o, l) => (c(), H(vk, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (r) => e.tools.words.value = r),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (r) => n("pick", r))
    }, {
      menu: j(() => [
        L(us, null, {
          default: j(() => [...l[2] || (l[2] = [
            ee("Order", -1)
          ])]),
          _: 1
        }),
        (c(), h(V, null, te(a, (r) => L(Mt, {
          key: r.key,
          checked: e.tools.order.value === r.key,
          "data-list-order": r.key,
          onClick: (i) => e.tools.order.value = r.key
        }, {
          default: j(() => [
            ee($(r.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (c(), h(V, { key: 0 }, [
          L(us, null, {
            default: j(() => [...l[3] || (l[3] = [
              ee("Show", -1)
            ])]),
            _: 1
          }),
          (c(), h(V, null, te(s, (r) => L(Mt, {
            key: r.key,
            checked: e.tools.state.value === r.key,
            "data-list-state": r.key,
            onClick: (i) => e.tools.state.value = r.key
          }, {
            default: j(() => [
              ee($(r.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : O("", !0)
      ]),
      default: j(() => [
        de(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, A8 = /* @__PURE__ */ J(yk, [["__scopeId", "data-v-dab0064d"]]);
function C8() {
  const e = I(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const O8 = (e) => import(
  /* @vite-ignore */
  e
), bk = 86400, ds = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function wk(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((ds(t) - ds(e)) / bk);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function T8(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = ds(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: wk(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Da = 280, ja = 240, Pa = 120, kk = 6, $k = 14, ln = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function xk(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function oi(e, t) {
  const n = Math.max(0, xk(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function Mk(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${$k}px)` }), e.offsetHeight, e.style.transition = `height ${Da}ms ${ln}`, e.style.height = `${l}px`;
  const r = s();
  let i = !1, d = !1;
  const u = () => {
    d || (d = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (d) return;
    n() && (t.scrollTop = oi(t, e));
    const m = s() - r;
    if (!i && m >= Da && (i = !0, e.style.transition = `opacity ${ja}ms ease-out, transform ${ja}ms ${ln}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), m < Da + ja) return a(f);
    u();
  };
  return a(f), u;
}
function R8(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${kk}px)` }), e.offsetHeight, e.style.transition = `opacity ${Pa}ms ease-out, transform ${Pa}ms ${ln}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), r = () => {
    if (n() && (t.scrollTop = oi(t, e)), s() - l < Pa) return a(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(r);
}
const Sk = 140, On = 220, Zo = 5;
function I8({ gap: e = Sk, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function r(u, f) {
    a.add(u), u.cancel = u.arrival(u.el, u.options, () => {
      a.delete(u), u.done(), f();
    });
  }
  function i() {
    const u = n.splice(0, Zo);
    if (s = u.length > 0, !s) return;
    let f = u.length;
    for (const m of u)
      m.el.style.display = m.display, r(m, () => {
        f -= 1, f || (o = t(i, e));
      });
  }
  const d = (u, f, m, v = Mk) => {
    if (l || !f.pane || !f.follows()) return m();
    const y = { el: u, options: f, done: m, arrival: v, display: u.style.display || "" };
    if (!s)
      return s = !0, r(y, () => o = t(i, e));
    u.style.display = "none", n.push(y), n.length >= Zo && d.flush();
  };
  return d.flush = () => {
    var u;
    l = !0, queueMicrotask(() => l = !1);
    for (const f of [...a]) (u = f.cancel) == null || u.call(f);
    clearTimeout(o), s = !1;
    for (const f of n.splice(0))
      f.el.style.display = f.display, f.done();
  }, d;
}
function B8(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${On}ms ${ln}, opacity ${On}ms ease-in, margin ${On}ms ${ln}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, On);
}
const li = "chat.pins.minimised", Nn = I(jn(li, !1));
function Xo(e) {
  Nn.value = e, Ss(li, e);
}
function _k(e) {
  const t = T(() => e()), n = T(() => Nn.value ? [] : e()), a = () => Xo(!Nn.value), s = Date.now() / 1e3;
  return he(
    () => t.value.filter((o) => St(o) > s).length,
    (o, l) => o > l && Xo(!1)
  ), { pins: t, visible: n, minimised: Nn, toggle: a };
}
const Ek = ["title"], Ak = {
  key: 0,
  class: "pins-count"
}, Ck = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = _k(() => t.pinRows);
    return (o, l) => q(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: X(["pins-toggle", { minimised: q(a), inline: e.inline }]),
      title: q(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = $e((...r) => q(s) && q(s)(...r), ["stop"]))
    }, [
      L(ye, {
        name: q(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      q(a) ? (c(), h("span", Ak, $(q(n).length), 1)) : O("", !0)
    ], 10, Ek)) : O("", !0);
  }
}, L8 = /* @__PURE__ */ J(Ck, [["__scopeId", "data-v-d073c504"]]), Ok = ["title"], Tk = ["title"], Rk = { class: "diff-card-dir" }, Ik = { class: "diff-card-name" }, Bk = ["title"], Lk = ["title"], Nk = {
  key: 0,
  class: "diff-card-note"
}, Dk = ["href"], jk = ["src", "alt"], Pk = { class: "diff-card-rows" }, qk = { class: "diff-row-num" }, Fk = { class: "diff-row-sign" }, Wk = { class: "diff-row-code" }, Hk = {
  __name: "DiffCard",
  props: {
    path: { type: String, required: !0 },
    change: { type: String, required: !0 },
    added: { type: Number, required: !0 },
    removed: { type: Number, required: !0 },
    at: { type: [String, Number], required: !0 },
    rows: { type: Array, required: !0 },
    flush: Boolean,
    half: Boolean,
    folded: Boolean,
    editsOnly: Boolean,
    hideRemovals: Boolean,
    capped: Boolean,
    lines: { type: Number, default: 0 },
    whole: { type: Object, default: null },
    entering: Boolean,
    picture: { type: String, default: "" },
    fresh: { type: String, default: "" }
  },
  emits: ["fold", "whole", "open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = navigator.platform.startsWith("Mac") ? "⌘" : "Ctrl";
    function o(b) {
      (b.metaKey || b.ctrlKey) && (b.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, i = T(() => n.path.lastIndexOf("/") + 1), d = T(() => n.path.slice(0, i.value)), u = T(() => n.path.slice(i.value)), f = T(() => n.change === "deleted"), m = T(() => l[n.change]), v = T(() => new Set(n.rows.filter((b) => b.line_type === "add").map((b) => b.line))), y = I("after"), A = T(() => y.value === "before" ? n.whole.old : n.whole.text), R = T(() => n.whole && n.whole.text !== void 0 ? A.value.split(`
`).map((b, k) => ({ line_type: y.value === "after" && v.value.has(k + 1) ? "add" : "ctx", line: k + 1, text: b })) : n.rows.filter(
      (b) => !(n.editsOnly && ["ctx", "fold"].includes(b.line_type)) && !(n.hideRemovals && b.line_type === "del")
    )), S = I(!1), D = T(() => n.lines && !S.value && !n.whole), U = T(() => D.value ? R.value.slice(0, n.lines) : R.value), N = T(() => R.value.length - U.value.length), B = (b) => b.line === null || b.line_type === "del" ? "" : b.line, F = (b) => b.line_type === "fold" ? b.hidden ? `⋯ ${b.hidden} lines` : "⋯" : b.text, E = I(null), _ = I(null);
    let w = null;
    return Re(() => {
      if (!_.value) return;
      let b = !0;
      w = new ResizeObserver(() => {
        !E.value || !_.value || (E.value.style.transition = b ? "none" : "", E.value.style.height = `${_.value.offsetHeight}px`, b = !1);
      }), w.observe(_.value);
    }), Be(() => w && w.disconnect()), (b, k) => (c(), h("section", {
      class: X(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      g("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: k[2] || (k[2] = (p) => !f.value && a("fold"))
      }, [
        g("span", {
          class: "diff-card-path",
          title: `${e.path} · ${q(s)}-click to open it`,
          onClick: o
        }, [
          g("span", Rk, $(d.value), 1),
          g("span", Ik, $(u.value), 1),
          m.value ? (c(), h("span", {
            key: 0,
            class: X(["diff-card-badge", e.change])
          }, $(m.value), 3)) : O("", !0)
        ], 8, Tk),
        g("span", {
          class: X(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + $(e.added), 3),
        g("span", {
          class: X(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + $(e.removed), 3),
        L(ia, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: y.value === "after" ? "Show the file before" : "Show the file after",
          onClick: k[0] || (k[0] = $e((p) => y.value = y.value === "after" ? "before" : "after", ["stop"]))
        }, $(y.value === "after" ? "After" : "Before"), 9, Bk)) : O("", !0),
        f.value ? O("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: X(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: k[1] || (k[1] = $e((p) => a("whole"), ["stop"]))
        }, [
          L(ye, {
            name: "file",
            size: 12
          })
        ], 10, Lk))
      ], 8, Ok),
      e.whole && e.whole.error ? (c(), h("p", Nk, $(e.whole.error), 1)) : O("", !0),
      !f.value && !e.folded ? (c(), h(V, { key: 1 }, [
        e.picture ? (c(), h("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          g("img", {
            src: e.picture,
            alt: u.value,
            loading: "lazy"
          }, null, 8, jk)
        ], 8, Dk)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: E,
          class: "diff-card-grow"
        }, [
          g("div", {
            ref_key: "body",
            ref: _,
            class: "diff-card-diff"
          }, [
            g("div", Pk, [
              (c(!0), h(V, null, te(U.value, (p, x) => (c(), h("div", {
                key: x,
                class: X(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                g("span", qk, $(B(p)), 1),
                g("span", Fk, $(r[p.line_type]), 1),
                g("span", Wk, $(F(p)), 1)
              ], 2))), 128)),
              N.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: k[3] || (k[3] = $e((p) => S.value = !0, ["stop"]))
              }, $(N.value) + " more " + $(N.value === 1 ? "line" : "lines"), 1)) : O("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : O("", !0)
    ], 2));
  }
}, N8 = /* @__PURE__ */ J(Hk, [["__scopeId", "data-v-23581cbb"]]), Uk = {
  __name: "WindowPane",
  props: {
    name: { type: String, required: !0 },
    catalogue: { type: Object, required: !0 },
    subscriptions: { type: Object, required: !0 },
    environment: { type: String, required: !0 },
    agent: { type: Number, default: null },
    visible: { type: Boolean, default: !0 },
    prompts: { type: Object, default: null },
    shellRead: { type: Function, default: null },
    options: { type: Object, default: () => ({}) },
    dropdown: { type: Boolean, default: !1 },
    bar: { type: Boolean, default: !1 }
  },
  emits: ["remove", "option"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = T(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = T(() => s.value && { render: () => Jn(Um, { line: s.value.line, events: s.value.events }) }), l = I(null), r = T(() => {
      var m, v;
      return ((m = s.value) == null ? void 0 : m.loading) === "component" && !s.value.allowed && !((v = l.value) != null && v.component_trusted);
    }), i = T(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), d = T(
      () => {
        var m, v;
        return l.value ? pv(l.value, f) : { reads: ((m = s.value) == null ? void 0 : m.reads) || [], runs: ((v = s.value) == null ? void 0 : v.runs) || [], missing: [], ask: async () => !0 };
      }
    );
    async function u() {
      if (!s.value || s.value.allowed || !a.shellRead) return;
      const m = await a.shellRead(`window permissions ${a.name} --environment ${a.environment}`);
      l.value = m.ok ? m.value : null;
    }
    async function f() {
      const m = await a.prompts.ask(s.value.title, l.value);
      return await u(), m;
    }
    return he(
      () => {
        var m, v;
        return ((m = s.value) == null ? void 0 : m.entry_url) || ((v = s.value) == null ? void 0 : v.line);
      },
      async () => {
        await u(), d.value.missing.length && !r.value && f();
      },
      { immediate: !0 }
    ), (m, v) => {
      var y, A;
      return !s.value && ((y = e.catalogue.loaded) == null ? void 0 : y.value) === !1 ? (c(), H(Os, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((A = s.value) == null ? void 0 : A.shows) === "one-agent" && e.agent === null ? (c(), H(Qt, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : r.value ? (c(), H(Kt, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": i.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (c(), H(yr, {
        key: d.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: d.value,
        prompts: e.prompts,
        options: e.options,
        onOption: v[0] || (v[0] = (R, S) => n("option", R, S))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (c(), H(vr, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: d.value,
        prompts: e.prompts,
        options: e.options,
        onOption: v[1] || (v[1] = (R, S) => n("option", R, S))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (c(), H(Kt, {
        key: s.value.line || s.value.entry_url,
        name: e.name,
        component: o.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: d.value,
        prompts: e.prompts,
        events: s.value.events,
        options: e.options,
        declared: s.value.options,
        "auto-scroll": s.value.auto_scroll,
        tabs: s.value.tabs,
        sources: s.value.sources,
        links: s.value.links,
        search: s.value.search,
        skeleton: s.value.skeleton,
        "unavailable-reason": s.value.unavailable_reason,
        onOption: v[2] || (v[2] = (R, S) => n("option", R, S))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (c(), H(Kt, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: v[3] || (v[3] = (R) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, zk = ["data-section"], Vk = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, Gk = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Oe(Nu, null), a = T(() => {
      const o = t.names.map((r) => ({ name: r, offered: !!(n != null && n.catalogue.window(r)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((r) => !t.names.includes(r.name));
      return [...o, ...l.map((r) => ({ name: r.name, offered: !0 }))];
    }), s = T(() => ({ row: t.row }));
    return (o, l) => q(n) ? (c(!0), h(V, { key: 0 }, te(a.value, (r) => (c(), h("div", {
      key: r.name,
      class: "inspector-section",
      "data-section": r.name
    }, [
      r.offered ? (c(), H(Uk, {
        key: 0,
        name: r.name,
        catalogue: q(n).catalogue,
        subscriptions: q(n).subscriptions,
        environment: q(n).environment,
        prompts: q(n).prompts,
        "shell-read": q(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (c(), h("p", Vk, $(r.name) + " is not available", 1))
    ], 8, zk))), 128)) : O("", !0);
  }
}, Kk = /* @__PURE__ */ J(Gk, [["__scopeId", "data-v-a47d36b7"]]), Yk = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), H(ue, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: s[0] || (s[0] = (o) => n("back"))
    }, {
      default: j(() => [
        L(ye, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, Jk = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, Zk = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, Xk = { class: "ask-text" }, Qk = ["placeholder", "aria-label"], e2 = ["placeholder", "aria-label"], t2 = {
  key: 3,
  class: "moves"
}, n2 = {
  __name: "RowMoves",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = T(() => f0(a.noun, a.row)), l = I(""), r = I(null), i = I(""), d = I("");
    he(() => a.id, () => {
      l.value = "", r.value = null;
    });
    async function u(v, y = "") {
      const A = await a.read([v.noun ?? a.noun, v.word, String(a.id), ...v.flag ? [v.flag, y] : v.positional ? [y] : [], ...v.opener && d.value.trim() ? ["--on", d.value.trim()] : []]);
      l.value = A.ok ? "" : A.error, A.ok && (r.value = null, i.value = "", d.value = "", s("done"));
    }
    const f = (v) => v.confirm ? r.value = v : v.said ? u(v, v.said) : v.flag || v.positional ? (r.value = v, i.value = "") : u(v), m = () => i.value.trim() && u(r.value, i.value.trim());
    return t({ moves: o, press: f }), (v, y) => o.value.length ? (c(), H(fr, {
      key: 0,
      inline: e.inline
    }, {
      default: j(() => {
        var A;
        return [
          l.value ? (c(), h("p", Jk, $(l.value), 1)) : O("", !0),
          (A = r.value) != null && A.confirm ? (c(), h("div", Zk, [
            g("span", Xk, $(r.value.confirm), 1),
            L(ue, {
              small: "",
              variant: r.value.danger ? "ghost" : "primary",
              bordered: r.value.danger,
              class: X({ danger: r.value.danger }),
              "data-resource-confirm-yes": "",
              onClick: y[0] || (y[0] = (R) => u(r.value))
            }, {
              default: j(() => [
                ee($(r.value.label), 1)
              ]),
              _: 1
            }, 8, ["variant", "bordered", "class"]),
            L(ue, {
              small: "",
              variant: "ghost",
              onClick: y[1] || (y[1] = (R) => r.value = null)
            }, {
              default: j(() => [...y[7] || (y[7] = [
                ee("Back", -1)
              ])]),
              _: 1
            })
          ])) : r.value ? (c(), h("form", {
            key: 2,
            class: "ask",
            "data-resource-ask": "",
            onSubmit: $e(m, ["prevent"])
          }, [
            Ye(g("input", {
              "onUpdate:modelValue": y[2] || (y[2] = (R) => i.value = R),
              class: "ask-input",
              placeholder: r.value.ask,
              "aria-label": r.value.ask,
              onKeydown: y[3] || (y[3] = Xt($e((R) => r.value = null, ["stop"]), ["esc"]))
            }, null, 40, Qk), [
              [Dn, i.value]
            ]),
            r.value.opener ? Ye((c(), h("input", {
              key: 0,
              "onUpdate:modelValue": y[4] || (y[4] = (R) => d.value = R),
              class: "ask-input",
              "data-resource-opener": "",
              placeholder: r.value.opener,
              "aria-label": r.value.opener,
              onKeydown: y[5] || (y[5] = Xt($e((R) => r.value = null, ["stop"]), ["esc"]))
            }, null, 40, e2)), [
              [Dn, d.value]
            ]) : O("", !0),
            L(ue, {
              small: "",
              variant: "primary",
              type: "submit",
              disabled: !i.value.trim()
            }, {
              default: j(() => [
                ee($(r.value.label), 1)
              ]),
              _: 1
            }, 8, ["disabled"]),
            L(ue, {
              small: "",
              variant: "ghost",
              onClick: y[6] || (y[6] = (R) => r.value = null)
            }, {
              default: j(() => [...y[8] || (y[8] = [
                ee("Back", -1)
              ])]),
              _: 1
            })
          ], 32)) : (c(), h("div", t2, [
            (c(!0), h(V, null, te(o.value, (R) => (c(), H(ue, {
              key: R.word,
              small: !R.bordered,
              bordered: R.bordered,
              icon: R.icon,
              variant: R.main ? "primary" : "ghost",
              class: X({ danger: R.danger }),
              "data-move": R.word,
              onClick: (S) => f(R)
            }, {
              default: j(() => [
                ee($(R.label), 1)
              ]),
              _: 2
            }, 1032, ["small", "bordered", "icon", "variant", "class", "data-move", "onClick"]))), 128))
          ]))
        ];
      }),
      _: 1
    }, 8, ["inline"])) : O("", !0);
  }
}, a2 = /* @__PURE__ */ J(n2, [["__scopeId", "data-v-bdac0207"]]), s2 = /* @__PURE__ */ new Set(["completed", "cancelled"]), o2 = (e) => s2.has(e), rn = (e) => o2(e) ? "done" : e, l2 = { class: "facts" }, r2 = { class: "fact wide" }, i2 = ["title"], c2 = {
  key: 1,
  class: "fact-value"
}, u2 = {
  key: 0,
  class: "fact"
}, d2 = { class: "fact-value" }, f2 = { class: "fact" }, h2 = { class: "fact-label" }, m2 = ["title"], p2 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, g2 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, v2 = {
  key: 2,
  class: "fact"
}, y2 = { class: "fact-value" }, b2 = { class: "fact wide" }, w2 = { class: "fact wide" }, k2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, $2 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = Hn.map(({ key: l, label: r }) => ({ key: String(l), label: r })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, r) => {
      var i, d;
      return c(), h("div", l2, [
        g("div", r2, [
          r[4] || (r[4] = g("span", { class: "fact-label" }, "Plan", -1)),
          (i = e.place) != null && i.plan_id ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: r[0] || (r[0] = (u) => q(Fe)(`plans:${e.place.plan_id}`))
          }, "Plan " + $(e.place.plan_id) + ": " + $(e.place.plan_title), 9, i2)) : (c(), h("span", c2, "Not in a plan"))
        ]),
        ((d = e.place) == null ? void 0 : d.phase_total) > 1 ? (c(), h("div", u2, [
          r[5] || (r[5] = g("span", { class: "fact-label" }, "Phase", -1)),
          g("span", d2, $(e.place.phase_number) + " of " + $(e.place.phase_total) + ": " + $(e.place.phase_title), 1)
        ])) : O("", !0),
        e.task.helper_id ? (c(), h(V, { key: 1 }, [
          g("div", f2, [
            g("span", h2, $(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            g("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: r[1] || (r[1] = (u) => q(Fe)(`agents:${e.task.helper_id}`))
            }, $(e.task.helper_name), 9, m2)
          ]),
          q(o).has(e.task.state) ? (c(), h("p", p2, $(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (c(), h("p", g2, $(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : O("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (c(), h("div", v2, [
          r[6] || (r[6] = g("span", { class: "fact-label" }, "Assigned to", -1)),
          g("span", y2, "Agent " + $(e.task.holder_id), 1)
        ])) : O("", !0),
        g("div", b2, [
          r[7] || (r[7] = g("span", { class: "fact-label" }, "Complexity", -1)),
          L(Nt, {
            options: q(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: r[2] || (r[2] = (u) => s("complexity", u))
          }, null, 8, ["options", "value"]),
          r[8] || (r[8] = g("span", { class: "fact-label" }, "1: a few lines. 5: a design with risk.", -1))
        ]),
        g("div", w2, [
          r[9] || (r[9] = g("span", { class: "fact-label" }, "Priority", -1)),
          L(Nt, {
            options: q(n),
            value: String(q(dr)(e.task.priority)),
            "data-task-priority": "",
            onPick: r[3] || (r[3] = (u) => s("priority", u))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", k2, $(e.refusal), 1)) : O("", !0)
        ])
      ]);
    };
  }
}, x2 = /* @__PURE__ */ J($2, [["__scopeId", "data-v-81d598cf"]]);
function M2(e, t) {
  const n = new Map(t.tasks.map((i) => [i.id, i])), a = (i) => t.edges.filter(([, d]) => d === i).map(([d]) => d), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let i = a(e); i.length; i = [...new Set(i.flatMap(a))].filter((d) => !s.has(d)))
    i.forEach((d) => s.add(d)), o.push(i.map((d) => n.get(d)));
  const l = [], r = /* @__PURE__ */ new Set([e]);
  for (let i = t.edges.find(([d]) => d === e); i && !r.has(i[1]); i = t.edges.find(([d]) => d === i[1]))
    r.add(i[1]), l.push(n.get(i[1]));
  return { above: o.reverse(), below: l };
}
const S2 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, _2 = { ...S2, done: "Completed" }, E2 = { class: "task-status-icon" }, A2 = ["width", "height", "aria-label"], C2 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = T(() => Ml("task", rn(t.status))), a = T(() => n.value === "testing" ? "started" : n.value), s = T(() => _2[t.status] ?? xl("task", t.status));
    return (o, l) => (c(), h("span", E2, [
      L(jt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: j(() => [
          (c(), h("svg", {
            key: n.value,
            class: X(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            L(Pt, { value: a.value }, {
              blocked: j(() => [...l[0] || (l[0] = [
                g("circle", {
                  cx: "6.3",
                  cy: "8",
                  r: "4.7",
                  class: "stroke"
                }, null, -1),
                g("rect", {
                  x: "10.8",
                  y: "7.3",
                  width: "3.2",
                  height: "1.4",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                g("circle", {
                  cx: "14.5",
                  cy: "8",
                  r: "1.25",
                  class: "fill"
                }, null, -1)
              ])]),
              done: j(() => [...l[1] || (l[1] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "6.3",
                  class: "fill"
                }, null, -1),
                g("polyline", {
                  points: "5.3,8.2 7.2,10 10.7,6.2",
                  class: "tick"
                }, null, -1)
              ])]),
              started: j(() => [...l[2] || (l[2] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                g("path", {
                  d: "M8 4.2 A3.8 3.8 0 0 1 8 11.8 Z",
                  class: "fill"
                }, null, -1)
              ])]),
              asked: j(() => [...l[3] || (l[3] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                g("rect", {
                  x: "7.3",
                  y: "4.8",
                  width: "1.4",
                  height: "3.6",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                g("circle", {
                  cx: "8",
                  cy: "10.5",
                  r: "0.9",
                  class: "fill"
                }, null, -1)
              ])]),
              paused: j(() => [...l[4] || (l[4] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                g("rect", {
                  x: "6",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1),
                g("rect", {
                  x: "8.7",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1)
              ])]),
              planned: j(() => [...l[5] || (l[5] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: j(() => [...l[6] || (l[6] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, A2))
        ]),
        _: 1
      })
    ]));
  }
}, Ws = /* @__PURE__ */ J(C2, [["__scopeId", "data-v-ae24a63f"]]), O2 = { class: "number" }, T2 = { class: "title" }, R2 = { class: "word" }, I2 = {
  __name: "TaskChainLink",
  props: {
    status: { type: String, required: !0 },
    number: { type: Number, required: !0 },
    title: { type: String, required: !0 },
    word: { type: String, required: !0 },
    current: Boolean
  },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), H(ht(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: X(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: j(() => [
        L(Ws, { status: e.status }, null, 8, ["status"]),
        g("span", O2, $(e.number), 1),
        g("span", T2, $(e.title), 1),
        g("span", R2, $(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, qa = /* @__PURE__ */ J(I2, [["__scopeId", "data-v-f6417ae8"]]), B2 = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, L2 = { class: "level" }, N2 = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(!1);
    he(() => n.task.id, () => s.value = !1);
    const o = T(() => M2(n.task.id, n.graph)), l = T(() => s.value ? o.value.above : o.value.above.slice(-1)), r = T(() => s.value ? o.value.below : o.value.below.slice(0, 1)), i = T(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), d = (f) => f.slice(0, 1).toUpperCase() + f.slice(1), u = (f, m = !1) => ({ status: rn(f.state), number: f.id, title: f.title, word: m ? "This task" : d(f.state), current: m });
    return (f, m) => o.value.above.length || o.value.below.length ? (c(), h("section", B2, [
      m[5] || (m[5] = g("h4", null, "What waits on what", -1)),
      (c(!0), h(V, null, te(l.value, (v) => (c(), h(V, {
        key: v.map((y) => y.id).join()
      }, [
        g("div", L2, [
          (c(!0), h(V, null, te(v, (y) => (c(), H(qa, Le({
            key: y.id,
            ref_for: !0
          }, u(y), {
            onSelect: m[0] || (m[0] = (A) => a("select", A))
          }), null, 16))), 128))
        ]),
        m[3] || (m[3] = g("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      L(qa, wi(ki(u(e.task, !0))), null, 16),
      (c(!0), h(V, null, te(r.value, (v) => (c(), h(V, {
        key: v.id
      }, [
        m[4] || (m[4] = g("div", { class: "waits" }, "↓ waits on", -1)),
        L(qa, Le({ ref_for: !0 }, u(v), {
          onSelect: m[1] || (m[1] = (y) => a("select", y))
        }), null, 16)
      ], 64))), 128)),
      i.value ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: m[2] || (m[2] = (v) => s.value = !s.value)
      }, $(s.value ? "Show less" : `Show the whole chain (${i.value} more)`), 1)) : O("", !0)
    ])) : O("", !0);
  }
}, D2 = /* @__PURE__ */ J(N2, [["__scopeId", "data-v-db05c4b2"]]), j2 = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, P2 = ["datetime"], q2 = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (c(), h("section", j2, [
      n[0] || (n[0] = g("h3", null, "Block history", -1)),
      (c(!0), h(V, null, te(e.renewals, (a) => (c(), h("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        g("time", {
          datetime: a.created_at
        }, $(new Date(a.created_at).toLocaleString()), 9, P2),
        g("p", null, $(a.reason), 1)
      ]))), 128))
    ])) : O("", !0);
  }
}, F2 = /* @__PURE__ */ J(q2, [["__scopeId", "data-v-b41f213b"]]), W2 = {
  class: "part",
  "data-resource-waits": ""
}, H2 = ["onClick"], U2 = { class: "wait-id" }, z2 = { class: "wait-title" }, V2 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", W2, [
      g("h4", null, $(e.title), 1),
      (c(!0), h(V, null, te(e.waits, (o) => (c(), h("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        L(Ws, {
          status: q(rn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        g("span", U2, $(o.id), 1),
        g("span", z2, $(o.title), 1)
      ], 8, H2))), 128))
    ]));
  }
}, Qo = /* @__PURE__ */ J(V2, [["__scopeId", "data-v-8fb2e251"]]), G2 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, K2 = { class: "text" }, Y2 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, J2 = 180, Z2 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = I(!1), l = T(() => a.task.waits.filter((i) => !n.has(i.state))), r = T(() => a.task.waits.filter((i) => n.has(i.state)));
    return (i, d) => (c(), h(V, null, [
      l.value.length ? (c(), H(Qo, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: d[0] || (d[0] = (u) => s("select", u))
      }, null, 8, ["waits"])) : O("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", G2, [
        d[3] || (d[3] = g("h4", null, "How it was done", -1)),
        g("p", K2, $(e.task.outcome), 1)
      ])) : O("", !0),
      e.task.brief ? (c(), h("section", Y2, [
        d[4] || (d[4] = g("h4", null, "The brief", -1)),
        g("p", {
          class: X(["text", { clamped: !o.value }])
        }, $(e.task.brief), 3),
        e.task.brief.length > J2 && !o.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: d[1] || (d[1] = (u) => o.value = !0)
        }, "Show the whole brief")) : O("", !0)
      ])) : O("", !0),
      r.value.length ? (c(), H(Qo, {
        key: 3,
        title: "Waited on",
        waits: r.value,
        onSelect: d[2] || (d[2] = (u) => s("select", u))
      }, null, 8, ["waits"])) : O("", !0)
    ], 64));
  }
}, X2 = /* @__PURE__ */ J(Z2, [["__scopeId", "data-v-4a3f1e79"]]), Q2 = {
  class: "task-details",
  "data-task-details": ""
}, e5 = { class: "since" }, t5 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, n5 = { class: "text" }, a5 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, s5 = {
  key: 1,
  class: "note"
}, o5 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, l5 = { class: "text" }, r5 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return c(), h("div", Q2, [
        g("div", {
          class: X(["state-line", q(rn)(e.task.state)])
        }, [
          g("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (r) => n("status", r.currentTarget))
          }, [
            L(Ws, {
              status: q(rn)(e.task.state)
            }, null, 8, ["status"]),
            ee(" " + $(a(e.task.state)), 1)
          ]),
          g("span", e5, [
            o[5] || (o[5] = ee(" since ", -1)),
            L(ia, {
              at: q(Zl)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", t5, [
          o[6] || (o[6] = g("span", { class: "label" }, "Blocked, waiting on", -1)),
          g("p", n5, $(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (c(), h("p", a5, "Opens by itself when " + $(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", s5, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", o5, [
          o[7] || (o[7] = g("span", { class: "label" }, "Why it was cancelled", -1)),
          g("p", l5, $(e.task.reason), 1)
        ])) : O("", !0),
        e.graph ? (c(), H(D2, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (r) => n("select", r))
        }, null, 8, ["task", "graph"])) : O("", !0),
        L(x2, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (r) => n("priority", r)),
          onComplexity: o[3] || (o[3] = (r) => n("complexity", r))
        }, null, 8, ["task", "place", "refusal"]),
        L(X2, {
          task: e.task,
          onSelect: o[4] || (o[4] = (r) => n("select", r))
        }, null, 8, ["task"]),
        L(F2, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, i5 = /* @__PURE__ */ J(r5, [["__scopeId", "data-v-7e73fa21"]]), c5 = 50, u5 = { messages: 25 }, d5 = (e) => u5[e] || c5, f5 = {
  class: "task-log",
  "aria-label": "Task log"
}, h5 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, m5 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, p5 = { class: "entries" }, g5 = ["data-task-log-important"], v5 = ["datetime"], y5 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, b5 = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = I([]), a = I(1), s = I(!0), o = I(!0), l = I("");
    let r = 0;
    async function i(d = 1) {
      const u = ++r;
      a.value = d, o.value = !0, l.value = "";
      const f = await t.read([
        "task-log",
        "list",
        "--task",
        String(t.id),
        "--limit",
        String(d5("task_logs")),
        "--page",
        String(d)
      ]);
      u === r && (o.value = !1, l.value = f.ok ? "" : f.error, f.ok && (n.value = f.value.rows, s.value = f.value.is_last_page));
    }
    return he(
      () => [t.id, t.changes],
      () => {
        n.value = [], i();
      },
      { immediate: !0 }
    ), ft(() => {
      r += 1;
    }), (d, u) => (c(), h("section", f5, [
      o.value ? (c(), H(_t, { key: 0 })) : l.value ? (c(), h(V, { key: 1 }, [
        g("p", h5, $(l.value), 1),
        L(ue, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: u[0] || (u[0] = (f) => i(a.value))
        }, {
          default: j(() => [...u[3] || (u[3] = [
            ee("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (c(), h(V, { key: 2 }, [
        n.value.length ? O("", !0) : (c(), h("p", m5, "No log entries yet.")),
        g("ol", p5, [
          (c(!0), h(V, null, te(n.value, (f) => (c(), h("li", {
            key: f.id,
            class: X(["entry", { important: f.important }]),
            "data-task-log": "",
            "data-task-log-important": f.important ? "" : null
          }, [
            g("time", {
              datetime: f.created_at
            }, $(new Date(f.created_at).toLocaleString()), 9, v5),
            g("p", null, $(f.line), 1)
          ], 10, g5))), 128))
        ]),
        a.value > 1 || !s.value ? (c(), h("nav", y5, [
          L(ue, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: u[1] || (u[1] = (f) => i(a.value - 1))
          }, {
            default: j(() => [...u[4] || (u[4] = [
              ee("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          g("span", null, "Page " + $(a.value), 1),
          L(ue, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: u[2] || (u[2] = (f) => i(a.value + 1))
          }, {
            default: j(() => [...u[5] || (u[5] = [
              ee("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : O("", !0)
      ], 64))
    ]));
  }
}, w5 = /* @__PURE__ */ J(b5, [["__scopeId", "data-v-cfa43bf1"]]), k5 = {
  class: "task-tags",
  "aria-label": "Task tags"
}, $5 = { class: "tags" }, x5 = ["aria-label", "data-remove-tag", "onClick"], M5 = {
  __name: "TaskTags",
  props: { tags: { type: Array, required: !0 } },
  emits: ["add", "remove"],
  setup(e, { emit: t }) {
    const n = t, a = I("");
    function s() {
      const o = a.value.trim();
      o && (n("add", o), a.value = "");
    }
    return (o, l) => (c(), h("section", k5, [
      g("div", $5, [
        (c(!0), h(V, null, te(e.tags, (r) => (c(), h("span", {
          key: r,
          class: "tag",
          "data-task-tag": ""
        }, [
          ee($(r) + " ", 1),
          g("button", {
            type: "button",
            "aria-label": `Remove tag ${r}`,
            "data-remove-tag": r,
            onClick: (i) => n("remove", r)
          }, "×", 8, x5)
        ]))), 128))
      ]),
      g("form", {
        class: "add-tag",
        onSubmit: $e(s, ["prevent"])
      }, [
        Ye(g("input", {
          "onUpdate:modelValue": l[0] || (l[0] = (r) => a.value = r),
          "aria-label": "New tag",
          placeholder: "New tag",
          pattern: "[a-z0-9-]+",
          "data-task-tag-input": ""
        }, null, 512), [
          [Dn, a.value]
        ]),
        L(ue, {
          small: "",
          type: "submit",
          disabled: !a.value.trim(),
          "data-task-tag-add": ""
        }, {
          default: j(() => [...l[1] || (l[1] = [
            ee("Add tag", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)
    ]));
  }
}, S5 = /* @__PURE__ */ J(M5, [["__scopeId", "data-v-1d720cf2"]]), _5 = { class: "comment-side-head" }, E5 = {
  key: 0,
  class: "comment-none"
}, A5 = { key: 0 }, C5 = {
  key: 1,
  class: "comment-none"
}, O5 = {
  class: "comment",
  "data-comment": ""
}, T5 = {
  __name: "CommentSide",
  props: {
    comments: { type: Array, required: !0 },
    words: { type: Function, required: !0 },
    below: Boolean,
    more: Boolean,
    loading: Boolean,
    failure: { type: String, default: "" }
  },
  emits: ["close", "more"],
  setup(e) {
    return (t, n) => (c(), h("aside", {
      class: X(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      g("header", _5, [
        n[2] || (n[2] = g("h3", null, "Comments", -1)),
        L(xs, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (c(), h("p", E5, "No comments yet")) : O("", !0),
      (c(!0), h(V, null, te(e.comments, (a) => (c(), h("section", {
        key: a.id
      }, [
        a.quote ? (c(), h("blockquote", A5, $(a.quote), 1)) : O("", !0),
        a.revision ? (c(), h("span", C5, "Revision " + $(a.revision), 1)) : O("", !0),
        g("p", O5, $(e.words(a)), 1)
      ]))), 128)),
      L(Qn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, R5 = /* @__PURE__ */ J(T5, [["__scopeId", "data-v-276284a3"]]);
var nl;
/Mac|iPhone|iPad/.test(((nl = navigator.userAgentData) == null ? void 0 : nl.platform) || navigator.platform);
function I5(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const B5 = ["placeholder"], L5 = { class: "actions" }, N5 = { class: "error" }, D5 = {
  key: 1,
  class: "card closed"
}, j5 = { class: "mark" }, P5 = { class: "prompt" }, q5 = {
  key: 0,
  class: "draft"
}, F5 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Ha({
    send: { type: Function, required: !0 },
    count: { type: Number, default: 0 },
    ready: { type: Boolean, default: !0 },
    placeholder: { type: String, default: "Write a comment…" }
  }, {
    draft: { type: String, default: "" },
    draftModifiers: {},
    error: { type: String, default: "" },
    errorModifiers: {}
  }),
  emits: /* @__PURE__ */ Ha(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = Wa(e, "draft"), l = Wa(e, "error"), r = I(!!l.value), i = I(!1), d = I(!1), u = I(null);
    async function f() {
      var y, A;
      r.value = !0, i.value = !1, await mt(), (A = ((y = u.value) == null ? void 0 : y.querySelector("input")) || u.value) == null || A.focus();
    }
    function m() {
      r.value = !1, l.value = "";
    }
    async function v() {
      const y = o.value.trim();
      if (!(!y || !a.ready || d.value)) {
        l.value = "", d.value = !0, o.value = "";
        try {
          await a.send(y), r.value = !1, i.value = !0;
        } catch (A) {
          o.value = y, l.value = A.message;
        } finally {
          d.value = !1;
        }
      }
    }
    return t({ expand: f }), (y, A) => (c(), h("div", {
      class: X(["comment-bar", { open: r.value }])
    }, [
      r.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: $e(v, ["prevent"]),
        onKeydown: Xt(m, ["esc"])
      }, [
        de(y.$slots, "who", {}, void 0, !0),
        Ye(g("textarea", {
          ref_key: "box",
          ref: u,
          "onUpdate:modelValue": A[0] || (A[0] = (R) => o.value = R),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: A[1] || (A[1] = Xt((R) => q(I5)(R, v), ["enter"]))
        }, null, 40, B5), [
          [Dn, o.value]
        ]),
        g("div", L5, [
          g("span", N5, $(l.value), 1),
          L(ue, {
            small: "",
            onClick: m
          }, {
            default: j(() => [...A[3] || (A[3] = [
              ee("Cancel", -1)
            ])]),
            _: 1
          }),
          L(ue, {
            variant: "primary",
            small: "",
            busy: d.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: v
          }, {
            default: j(() => [...A[4] || (A[4] = [
              ee("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", D5, [
        g("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          g("span", j5, [
            L(ye, {
              name: i.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          g("span", P5, $(i.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", q5, "Draft kept")) : O("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: A[2] || (A[2] = (R) => s("show"))
        }, [
          g("span", null, $(q(vu)(e.count, "comment")), 1),
          L(ye, {
            name: "down",
            size: 12
          })
        ])) : O("", !0)
      ]))
    ], 2));
  }
}, W5 = /* @__PURE__ */ J(F5, [["__scopeId", "data-v-b68baddd"]]);
function H5(e, t) {
  const n = I([]), a = I(!1), s = I(null), o = I(0), l = I(!1), r = I("");
  let i = 0, d = 0;
  const u = (y) => {
    if (typeof y.body == "string") return y.body;
    const { noun: A, id: R, title: S } = e(), D = `On ${A} ${R}, ${S}: `;
    return y.text.startsWith(D) ? y.text.slice(D.length) : y.text;
  };
  async function f(y = 1) {
    const { noun: A, id: R } = e();
    if (!R) return;
    const S = ++d;
    l.value = !0, r.value = "";
    try {
      const D = await t([A, "comments", String(R), "--page", String(y), "--page-size", "25"]);
      if (S !== d) return;
      if (!D.ok) {
        r.value = D.error;
        return;
      }
      const U = D.value.rows ?? [], N = y === 1 ? U : [...n.value, ...U];
      n.value = [...new Map(N.map((B) => [B.id, B])).values()], o.value = D.value.total ?? n.value.length, s.value = D.value.next_page ?? null;
    } catch (D) {
      S === d && (r.value = D.message);
    } finally {
      S === d && (l.value = !1);
    }
  }
  async function m(y) {
    var B;
    const { noun: A, id: R } = e(), S = `${A}:${R}`, D = { id: `sending-${++i}`, text: y };
    n.value = [...n.value, D], o.value++, a.value = !0;
    const U = await t([A, "comment", String(R), y]);
    if (S !== `${e().noun}:${e().id}`) return;
    if (!U.ok)
      throw n.value = n.value.filter((F) => F.id !== D.id), o.value = Math.max(0, o.value - 1), new Error(U.error);
    await f();
    const N = (B = U.value) == null ? void 0 : B.id;
    N && !n.value.some((F) => F.id === N) && (n.value = [...n.value, { ...D, id: N }]);
  }
  const v = () => !l.value && s.value && f(s.value);
  return he(() => `${e().noun}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, r.value = "", d++, f();
  }, { immediate: !0 }), { comments: n, open: a, words: u, send: m, load: f, loadMore: v, nextPage: s, total: o, loading: l, failure: r };
}
const U5 = { class: "top" }, z5 = {
  class: "crumb",
  "data-task-crumb": ""
}, V5 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, G5 = {
  key: 1,
  class: "body"
}, K5 = { class: "summary" }, Y5 = { class: "stamp" }, J5 = {
  class: "title",
  "data-resource-title": ""
}, Z5 = {
  class: "tabs",
  "data-task-tabs": ""
}, X5 = { class: "panels" }, Q5 = {
  __name: "TaskInspector",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    lone: Boolean,
    stepped: Boolean,
    backed: Boolean,
    changes: { type: Number, default: 0 }
  },
  emits: ["close", "step", "select", "back"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = I(null), l = I(null), r = I(null), i = I(""), d = I(""), u = I(null), f = I(null), m = I("details"), v = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], y = H5(
      () => o.value ? { noun: "task", id: a.id, title: o.value.title } : {},
      (F) => a.read(F)
    );
    let A = 0;
    const R = T(() => {
      var F;
      return (F = l.value) != null && F.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function S() {
      const F = ++A, [E, _, w] = await Promise.all([
        a.read(["task", "inspect", String(a.id)]),
        a.read(["plan", "place", String(a.id)]),
        a.read(["task", "graph"])
      ]);
      F === A && (i.value = E.ok ? "" : E.error, o.value = E.ok ? E.value : null, l.value = _.ok ? _.value : null, r.value = w.ok ? w.value : null);
    }
    he(
      () => a.id,
      () => {
        o.value = null, l.value = null, r.value = null, u.value = null, m.value = "details", S();
      },
      { immediate: !0 }
    ), he(() => a.changes, S), he(y.open, (F) => {
      F && (m.value = "comments");
    });
    async function D(F, E) {
      const _ = o.value[F];
      o.value[F] = Number(E);
      const w = await a.read(["task", "edit", String(a.id), `--${F}`, E]);
      if (d.value = w.ok ? "" : w.error, w.ok) return S();
      o.value[F] = _;
    }
    async function U(F, E) {
      const _ = await a.read(["task", F, String(a.id), E]);
      d.value = _.ok ? "" : _.error, _.ok && await S();
    }
    function N(F) {
      u.value = null, f.value.press(F);
    }
    const B = (F) => {
      var E;
      return ((E = f.value) == null ? void 0 : E.moves.length) && (u.value = F);
    };
    return t({ openStatus: B }), (F, E) => (c(), h("aside", {
      class: X(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      g("div", U5, [
        e.backed ? (c(), H(Yk, {
          key: 0,
          onBack: E[0] || (E[0] = (_) => s("back"))
        })) : O("", !0),
        g("span", z5, $(R.value), 1),
        E[14] || (E[14] = g("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(V, { key: 1 }, [
          L(ue, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: E[1] || (E[1] = (_) => s("step", -1))
          }, {
            default: j(() => [
              L(ye, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          L(ue, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: E[2] || (E[2] = (_) => s("step", 1))
          }, {
            default: j(() => [
              L(ye, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : O("", !0),
        L(ue, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: E[3] || (E[3] = (_) => s("close"))
        }, {
          default: j(() => [
            L(ye, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (c(), h("p", V5, $(i.value), 1)) : o.value ? (c(), h(V, { key: 2 }, [
        L(a2, {
          ref_key: "actions",
          ref: f,
          noun: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: S
        }, null, 8, ["id", "row", "read"]),
        g("header", K5, [
          g("div", Y5, [
            ee(" Task " + $(o.value.id) + " · updated ", 1),
            L(ia, {
              at: q(Zl)(o.value)
            }, null, 8, ["at"])
          ]),
          g("h3", J5, $(o.value.title), 1),
          L(S5, {
            tags: o.value.tags,
            onAdd: E[4] || (E[4] = (_) => U("tag", _)),
            onRemove: E[5] || (E[5] = (_) => U("untag", _))
          }, null, 8, ["tags"])
        ]),
        g("div", Z5, [
          L(Nt, {
            options: v,
            value: m.value,
            onPick: E[6] || (E[6] = (_) => m.value = _)
          }, null, 8, ["value"])
        ]),
        g("div", X5, [
          L(Pt, { value: m.value }, {
            details: j(() => [
              L(i5, {
                task: o.value,
                place: l.value,
                graph: r.value,
                refusal: d.value,
                onStatus: B,
                onPriority: E[7] || (E[7] = (_) => D("priority", _)),
                onComplexity: E[8] || (E[8] = (_) => D("complexity", _)),
                onSelect: E[9] || (E[9] = (_) => s("select", _))
              }, null, 8, ["task", "place", "graph", "refusal"]),
              L(Kk, {
                "slot-name": "inspector.task",
                row: o.value
              }, null, 8, ["row"]),
              L(pu, {
                model: "task",
                id: e.id,
                read: e.read,
                changes: e.changes,
                onOpen: E[10] || (E[10] = (_) => s("select", _))
              }, null, 8, ["id", "read", "changes"])
            ]),
            comments: j(() => [
              L(R5, {
                below: "",
                comments: q(y).comments.value,
                words: q(y).words,
                more: !!q(y).nextPage.value,
                loading: q(y).loading.value,
                failure: q(y).failure.value,
                onMore: q(y).loadMore,
                onClose: E[11] || (E[11] = (_) => m.value = "details")
              }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
            ]),
            log: j(() => [
              L(w5, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        L(W5, {
          send: q(y).send,
          count: q(y).total.value,
          onShow: E[12] || (E[12] = (_) => m.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", G5, [
        L(_t)
      ])),
      u.value ? (c(), H(ea, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: E[13] || (E[13] = (_) => u.value = null)
      }, {
        default: j(() => [
          L(us, null, {
            default: j(() => [
              ee("Change the status of task " + $(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(V, null, te(f.value.moves, (_) => (c(), H(Mt, {
            key: _.word,
            onClick: (w) => N(_)
          }, {
            default: j(() => [
              ee($(_.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : O("", !0)
    ], 2));
  }
}, D8 = /* @__PURE__ */ J(Q5, [["__scopeId", "data-v-d8c2872e"]]);
function e4(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Fa = { exports: {} }, el;
function t4() {
  return el || (el = 1, (function(e, t) {
    var n = (function() {
      var a = function(B, F) {
        var E = 236, _ = 17, w = B, b = o[F], k = null, p = 0, x = null, M = [], C = {}, P = function(z, G) {
          p = w * 4 + 17, k = (function(W) {
            for (var K = new Array(W), Y = 0; Y < W; Y += 1) {
              K[Y] = new Array(W);
              for (var Q = 0; Q < W; Q += 1)
                K[Y][Q] = null;
            }
            return K;
          })(p), Z(0, 0), Z(p - 7, 0), Z(0, p - 7), fe(), ie(), He(z, G), w >= 7 && Ae(z), x == null && (x = se(w, b, M)), ve(x, G);
        }, Z = function(z, G) {
          for (var W = -1; W <= 7; W += 1)
            if (!(z + W <= -1 || p <= z + W))
              for (var K = -1; K <= 7; K += 1)
                G + K <= -1 || p <= G + K || (0 <= W && W <= 6 && (K == 0 || K == 6) || 0 <= K && K <= 6 && (W == 0 || W == 6) || 2 <= W && W <= 4 && 2 <= K && K <= 4 ? k[z + W][G + K] = !0 : k[z + W][G + K] = !1);
        }, ne = function() {
          for (var z = 0, G = 0, W = 0; W < 8; W += 1) {
            P(!0, W);
            var K = r.getLostPoint(C);
            (W == 0 || z > K) && (z = K, G = W);
          }
          return G;
        }, ie = function() {
          for (var z = 8; z < p - 8; z += 1)
            k[z][6] == null && (k[z][6] = z % 2 == 0);
          for (var G = 8; G < p - 8; G += 1)
            k[6][G] == null && (k[6][G] = G % 2 == 0);
        }, fe = function() {
          for (var z = r.getPatternPosition(w), G = 0; G < z.length; G += 1)
            for (var W = 0; W < z.length; W += 1) {
              var K = z[G], Y = z[W];
              if (k[K][Y] == null)
                for (var Q = -2; Q <= 2; Q += 1)
                  for (var le = -2; le <= 2; le += 1)
                    Q == -2 || Q == 2 || le == -2 || le == 2 || Q == 0 && le == 0 ? k[K + Q][Y + le] = !0 : k[K + Q][Y + le] = !1;
            }
        }, Ae = function(z) {
          for (var G = r.getBCHTypeNumber(w), W = 0; W < 18; W += 1) {
            var K = !z && (G >> W & 1) == 1;
            k[Math.floor(W / 3)][W % 3 + p - 8 - 3] = K;
          }
          for (var W = 0; W < 18; W += 1) {
            var K = !z && (G >> W & 1) == 1;
            k[W % 3 + p - 8 - 3][Math.floor(W / 3)] = K;
          }
        }, He = function(z, G) {
          for (var W = b << 3 | G, K = r.getBCHTypeInfo(W), Y = 0; Y < 15; Y += 1) {
            var Q = !z && (K >> Y & 1) == 1;
            Y < 6 ? k[Y][8] = Q : Y < 8 ? k[Y + 1][8] = Q : k[p - 15 + Y][8] = Q;
          }
          for (var Y = 0; Y < 15; Y += 1) {
            var Q = !z && (K >> Y & 1) == 1;
            Y < 8 ? k[8][p - Y - 1] = Q : Y < 9 ? k[8][15 - Y - 1 + 1] = Q : k[8][15 - Y - 1] = Q;
          }
          k[p - 8][8] = !z;
        }, ve = function(z, G) {
          for (var W = -1, K = p - 1, Y = 7, Q = 0, le = r.getMaskFunction(G), oe = p - 1; oe > 0; oe -= 2)
            for (oe == 6 && (oe -= 1); ; ) {
              for (var ke = 0; ke < 2; ke += 1)
                if (k[K][oe - ke] == null) {
                  var Se = !1;
                  Q < z.length && (Se = (z[Q] >>> Y & 1) == 1);
                  var ce = le(K, oe - ke);
                  ce && (Se = !Se), k[K][oe - ke] = Se, Y -= 1, Y == -1 && (Q += 1, Y = 7);
                }
              if (K += W, K < 0 || p <= K) {
                K -= W, W = -W;
                break;
              }
            }
        }, me = function(z, G) {
          for (var W = 0, K = 0, Y = 0, Q = new Array(G.length), le = new Array(G.length), oe = 0; oe < G.length; oe += 1) {
            var ke = G[oe].dataCount, Se = G[oe].totalCount - ke;
            K = Math.max(K, ke), Y = Math.max(Y, Se), Q[oe] = new Array(ke);
            for (var ce = 0; ce < Q[oe].length; ce += 1)
              Q[oe][ce] = 255 & z.getBuffer()[ce + W];
            W += ke;
            var De = r.getErrorCorrectPolynomial(Se), je = d(Q[oe], De.getLength() - 1), Hs = je.mod(De);
            le[oe] = new Array(De.getLength() - 1);
            for (var ce = 0; ce < le[oe].length; ce += 1) {
              var Us = ce + Hs.getLength() - le[oe].length;
              le[oe][ce] = Us >= 0 ? Hs.getAt(Us) : 0;
            }
          }
          for (var zs = 0, ce = 0; ce < G.length; ce += 1)
            zs += G[ce].totalCount;
          for (var ca = new Array(zs), gn = 0, ce = 0; ce < K; ce += 1)
            for (var oe = 0; oe < G.length; oe += 1)
              ce < Q[oe].length && (ca[gn] = Q[oe][ce], gn += 1);
          for (var ce = 0; ce < Y; ce += 1)
            for (var oe = 0; oe < G.length; oe += 1)
              ce < le[oe].length && (ca[gn] = le[oe][ce], gn += 1);
          return ca;
        }, se = function(z, G, W) {
          for (var K = u.getRSBlocks(z, G), Y = f(), Q = 0; Q < W.length; Q += 1) {
            var le = W[Q];
            Y.put(le.getMode(), 4), Y.put(le.getLength(), r.getLengthInBits(le.getMode(), z)), le.write(Y);
          }
          for (var oe = 0, Q = 0; Q < K.length; Q += 1)
            oe += K[Q].dataCount;
          if (Y.getLengthInBits() > oe * 8)
            throw "code length overflow. (" + Y.getLengthInBits() + ">" + oe * 8 + ")";
          for (Y.getLengthInBits() + 4 <= oe * 8 && Y.put(0, 4); Y.getLengthInBits() % 8 != 0; )
            Y.putBit(!1);
          for (; !(Y.getLengthInBits() >= oe * 8 || (Y.put(E, 8), Y.getLengthInBits() >= oe * 8)); )
            Y.put(_, 8);
          return me(Y, K);
        };
        C.addData = function(z, G) {
          G = G || "Byte";
          var W = null;
          switch (G) {
            case "Numeric":
              W = m(z);
              break;
            case "Alphanumeric":
              W = v(z);
              break;
            case "Byte":
              W = y(z);
              break;
            case "Kanji":
              W = A(z);
              break;
            default:
              throw "mode:" + G;
          }
          M.push(W), x = null;
        }, C.isDark = function(z, G) {
          if (z < 0 || p <= z || G < 0 || p <= G)
            throw z + "," + G;
          return k[z][G];
        }, C.getModuleCount = function() {
          return p;
        }, C.make = function() {
          if (w < 1) {
            for (var z = 1; z < 40; z++) {
              for (var G = u.getRSBlocks(z, b), W = f(), K = 0; K < M.length; K++) {
                var Y = M[K];
                W.put(Y.getMode(), 4), W.put(Y.getLength(), r.getLengthInBits(Y.getMode(), z)), Y.write(W);
              }
              for (var Q = 0, K = 0; K < G.length; K++)
                Q += G[K].dataCount;
              if (W.getLengthInBits() <= Q * 8)
                break;
            }
            w = z;
          }
          P(!1, ne());
        }, C.createTableTag = function(z, G) {
          z = z || 2, G = typeof G > "u" ? z * 4 : G;
          var W = "";
          W += '<table style="', W += " border-width: 0px; border-style: none;", W += " border-collapse: collapse;", W += " padding: 0px; margin: " + G + "px;", W += '">', W += "<tbody>";
          for (var K = 0; K < C.getModuleCount(); K += 1) {
            W += "<tr>";
            for (var Y = 0; Y < C.getModuleCount(); Y += 1)
              W += '<td style="', W += " border-width: 0px; border-style: none;", W += " border-collapse: collapse;", W += " padding: 0px; margin: 0px;", W += " width: " + z + "px;", W += " height: " + z + "px;", W += " background-color: ", W += C.isDark(K, Y) ? "#000000" : "#ffffff", W += ";", W += '"/>';
            W += "</tr>";
          }
          return W += "</tbody>", W += "</table>", W;
        }, C.createSvgTag = function(z, G, W, K) {
          var Y = {};
          typeof arguments[0] == "object" && (Y = arguments[0], z = Y.cellSize, G = Y.margin, W = Y.alt, K = Y.title), z = z || 2, G = typeof G > "u" ? z * 4 : G, W = typeof W == "string" ? { text: W } : W || {}, W.text = W.text || null, W.id = W.text ? W.id || "qrcode-description" : null, K = typeof K == "string" ? { text: K } : K || {}, K.text = K.text || null, K.id = K.text ? K.id || "qrcode-title" : null;
          var Q = C.getModuleCount() * z + G * 2, le, oe, ke, Se, ce = "", De;
          for (De = "l" + z + ",0 0," + z + " -" + z + ",0 0,-" + z + "z ", ce += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ce += Y.scalable ? "" : ' width="' + Q + 'px" height="' + Q + 'px"', ce += ' viewBox="0 0 ' + Q + " " + Q + '" ', ce += ' preserveAspectRatio="xMinYMin meet"', ce += K.text || W.text ? ' role="img" aria-labelledby="' + Je([K.id, W.id].join(" ").trim()) + '"' : "", ce += ">", ce += K.text ? '<title id="' + Je(K.id) + '">' + Je(K.text) + "</title>" : "", ce += W.text ? '<description id="' + Je(W.id) + '">' + Je(W.text) + "</description>" : "", ce += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ce += '<path d="', ke = 0; ke < C.getModuleCount(); ke += 1)
            for (Se = ke * z + G, le = 0; le < C.getModuleCount(); le += 1)
              C.isDark(ke, le) && (oe = le * z + G, ce += "M" + oe + "," + Se + De);
          return ce += '" stroke="transparent" fill="black"/>', ce += "</svg>", ce;
        }, C.createDataURL = function(z, G) {
          z = z || 2, G = typeof G > "u" ? z * 4 : G;
          var W = C.getModuleCount() * z + G * 2, K = G, Y = W - G;
          return N(W, W, function(Q, le) {
            if (K <= Q && Q < Y && K <= le && le < Y) {
              var oe = Math.floor((Q - K) / z), ke = Math.floor((le - K) / z);
              return C.isDark(ke, oe) ? 0 : 1;
            } else
              return 1;
          });
        }, C.createImgTag = function(z, G, W) {
          z = z || 2, G = typeof G > "u" ? z * 4 : G;
          var K = C.getModuleCount() * z + G * 2, Y = "";
          return Y += "<img", Y += ' src="', Y += C.createDataURL(z, G), Y += '"', Y += ' width="', Y += K, Y += '"', Y += ' height="', Y += K, Y += '"', W && (Y += ' alt="', Y += Je(W), Y += '"'), Y += "/>", Y;
        };
        var Je = function(z) {
          for (var G = "", W = 0; W < z.length; W += 1) {
            var K = z.charAt(W);
            switch (K) {
              case "<":
                G += "&lt;";
                break;
              case ">":
                G += "&gt;";
                break;
              case "&":
                G += "&amp;";
                break;
              case '"':
                G += "&quot;";
                break;
              default:
                G += K;
                break;
            }
          }
          return G;
        }, ri = function(z) {
          var G = 1;
          z = typeof z > "u" ? G * 2 : z;
          var W = C.getModuleCount() * G + z * 2, K = z, Y = W - z, Q, le, oe, ke, Se, ce = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, De = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, je = "";
          for (Q = 0; Q < W; Q += 2) {
            for (oe = Math.floor((Q - K) / G), ke = Math.floor((Q + 1 - K) / G), le = 0; le < W; le += 1)
              Se = "█", K <= le && le < Y && K <= Q && Q < Y && C.isDark(oe, Math.floor((le - K) / G)) && (Se = " "), K <= le && le < Y && K <= Q + 1 && Q + 1 < Y && C.isDark(ke, Math.floor((le - K) / G)) ? Se += " " : Se += "█", je += z < 1 && Q + 1 >= Y ? De[Se] : ce[Se];
            je += `
`;
          }
          return W % 2 && z > 0 ? je.substring(0, je.length - W - 1) + Array(W + 1).join("▀") : je.substring(0, je.length - 1);
        };
        return C.createASCII = function(z, G) {
          if (z = z || 1, z < 2)
            return ri(G);
          z -= 1, G = typeof G > "u" ? z * 2 : G;
          var W = C.getModuleCount() * z + G * 2, K = G, Y = W - G, Q, le, oe, ke, Se = Array(z + 1).join("██"), ce = Array(z + 1).join("  "), De = "", je = "";
          for (Q = 0; Q < W; Q += 1) {
            for (oe = Math.floor((Q - K) / z), je = "", le = 0; le < W; le += 1)
              ke = 1, K <= le && le < Y && K <= Q && Q < Y && C.isDark(oe, Math.floor((le - K) / z)) && (ke = 0), je += ke ? Se : ce;
            for (oe = 0; oe < z; oe += 1)
              De += je + `
`;
          }
          return De.substring(0, De.length - 1);
        }, C.renderTo2dContext = function(z, G) {
          G = G || 2;
          for (var W = C.getModuleCount(), K = 0; K < W; K++)
            for (var Y = 0; Y < W; Y++)
              z.fillStyle = C.isDark(K, Y) ? "black" : "white", z.fillRect(K * G, Y * G, G, G);
        }, C;
      };
      a.stringToBytesFuncs = {
        default: function(B) {
          for (var F = [], E = 0; E < B.length; E += 1) {
            var _ = B.charCodeAt(E);
            F.push(_ & 255);
          }
          return F;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(B, F) {
        var E = (function() {
          for (var w = D(B), b = function() {
            var ie = w.read();
            if (ie == -1) throw "eof";
            return ie;
          }, k = 0, p = {}; ; ) {
            var x = w.read();
            if (x == -1) break;
            var M = b(), C = b(), P = b(), Z = String.fromCharCode(x << 8 | M), ne = C << 8 | P;
            p[Z] = ne, k += 1;
          }
          if (k != F)
            throw k + " != " + F;
          return p;
        })(), _ = 63;
        return function(w) {
          for (var b = [], k = 0; k < w.length; k += 1) {
            var p = w.charCodeAt(k);
            if (p < 128)
              b.push(p);
            else {
              var x = E[w.charAt(k)];
              typeof x == "number" ? (x & 255) == x ? b.push(x) : (b.push(x >>> 8), b.push(x & 255)) : b.push(_);
            }
          }
          return b;
        };
      };
      var s = {
        MODE_NUMBER: 1,
        MODE_ALPHA_NUM: 2,
        MODE_8BIT_BYTE: 4,
        MODE_KANJI: 8
      }, o = {
        L: 1,
        M: 0,
        Q: 3,
        H: 2
      }, l = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
      }, r = (function() {
        var B = [
          [],
          [6, 18],
          [6, 22],
          [6, 26],
          [6, 30],
          [6, 34],
          [6, 22, 38],
          [6, 24, 42],
          [6, 26, 46],
          [6, 28, 50],
          [6, 30, 54],
          [6, 32, 58],
          [6, 34, 62],
          [6, 26, 46, 66],
          [6, 26, 48, 70],
          [6, 26, 50, 74],
          [6, 30, 54, 78],
          [6, 30, 56, 82],
          [6, 30, 58, 86],
          [6, 34, 62, 90],
          [6, 28, 50, 72, 94],
          [6, 26, 50, 74, 98],
          [6, 30, 54, 78, 102],
          [6, 28, 54, 80, 106],
          [6, 32, 58, 84, 110],
          [6, 30, 58, 86, 114],
          [6, 34, 62, 90, 118],
          [6, 26, 50, 74, 98, 122],
          [6, 30, 54, 78, 102, 126],
          [6, 26, 52, 78, 104, 130],
          [6, 30, 56, 82, 108, 134],
          [6, 34, 60, 86, 112, 138],
          [6, 30, 58, 86, 114, 142],
          [6, 34, 62, 90, 118, 146],
          [6, 30, 54, 78, 102, 126, 150],
          [6, 24, 50, 76, 102, 128, 154],
          [6, 28, 54, 80, 106, 132, 158],
          [6, 32, 58, 84, 110, 136, 162],
          [6, 26, 54, 82, 110, 138, 166],
          [6, 30, 58, 86, 114, 142, 170]
        ], F = 1335, E = 7973, _ = 21522, w = {}, b = function(k) {
          for (var p = 0; k != 0; )
            p += 1, k >>>= 1;
          return p;
        };
        return w.getBCHTypeInfo = function(k) {
          for (var p = k << 10; b(p) - b(F) >= 0; )
            p ^= F << b(p) - b(F);
          return (k << 10 | p) ^ _;
        }, w.getBCHTypeNumber = function(k) {
          for (var p = k << 12; b(p) - b(E) >= 0; )
            p ^= E << b(p) - b(E);
          return k << 12 | p;
        }, w.getPatternPosition = function(k) {
          return B[k - 1];
        }, w.getMaskFunction = function(k) {
          switch (k) {
            case l.PATTERN000:
              return function(p, x) {
                return (p + x) % 2 == 0;
              };
            case l.PATTERN001:
              return function(p, x) {
                return p % 2 == 0;
              };
            case l.PATTERN010:
              return function(p, x) {
                return x % 3 == 0;
              };
            case l.PATTERN011:
              return function(p, x) {
                return (p + x) % 3 == 0;
              };
            case l.PATTERN100:
              return function(p, x) {
                return (Math.floor(p / 2) + Math.floor(x / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(p, x) {
                return p * x % 2 + p * x % 3 == 0;
              };
            case l.PATTERN110:
              return function(p, x) {
                return (p * x % 2 + p * x % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(p, x) {
                return (p * x % 3 + (p + x) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + k;
          }
        }, w.getErrorCorrectPolynomial = function(k) {
          for (var p = d([1], 0), x = 0; x < k; x += 1)
            p = p.multiply(d([1, i.gexp(x)], 0));
          return p;
        }, w.getLengthInBits = function(k, p) {
          if (1 <= p && p < 10)
            switch (k) {
              case s.MODE_NUMBER:
                return 10;
              case s.MODE_ALPHA_NUM:
                return 9;
              case s.MODE_8BIT_BYTE:
                return 8;
              case s.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + k;
            }
          else if (p < 27)
            switch (k) {
              case s.MODE_NUMBER:
                return 12;
              case s.MODE_ALPHA_NUM:
                return 11;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + k;
            }
          else if (p < 41)
            switch (k) {
              case s.MODE_NUMBER:
                return 14;
              case s.MODE_ALPHA_NUM:
                return 13;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + k;
            }
          else
            throw "type:" + p;
        }, w.getLostPoint = function(k) {
          for (var p = k.getModuleCount(), x = 0, M = 0; M < p; M += 1)
            for (var C = 0; C < p; C += 1) {
              for (var P = 0, Z = k.isDark(M, C), ne = -1; ne <= 1; ne += 1)
                if (!(M + ne < 0 || p <= M + ne))
                  for (var ie = -1; ie <= 1; ie += 1)
                    C + ie < 0 || p <= C + ie || ne == 0 && ie == 0 || Z == k.isDark(M + ne, C + ie) && (P += 1);
              P > 5 && (x += 3 + P - 5);
            }
          for (var M = 0; M < p - 1; M += 1)
            for (var C = 0; C < p - 1; C += 1) {
              var fe = 0;
              k.isDark(M, C) && (fe += 1), k.isDark(M + 1, C) && (fe += 1), k.isDark(M, C + 1) && (fe += 1), k.isDark(M + 1, C + 1) && (fe += 1), (fe == 0 || fe == 4) && (x += 3);
            }
          for (var M = 0; M < p; M += 1)
            for (var C = 0; C < p - 6; C += 1)
              k.isDark(M, C) && !k.isDark(M, C + 1) && k.isDark(M, C + 2) && k.isDark(M, C + 3) && k.isDark(M, C + 4) && !k.isDark(M, C + 5) && k.isDark(M, C + 6) && (x += 40);
          for (var C = 0; C < p; C += 1)
            for (var M = 0; M < p - 6; M += 1)
              k.isDark(M, C) && !k.isDark(M + 1, C) && k.isDark(M + 2, C) && k.isDark(M + 3, C) && k.isDark(M + 4, C) && !k.isDark(M + 5, C) && k.isDark(M + 6, C) && (x += 40);
          for (var Ae = 0, C = 0; C < p; C += 1)
            for (var M = 0; M < p; M += 1)
              k.isDark(M, C) && (Ae += 1);
          var He = Math.abs(100 * Ae / p / p - 50) / 5;
          return x += He * 10, x;
        }, w;
      })(), i = (function() {
        for (var B = new Array(256), F = new Array(256), E = 0; E < 8; E += 1)
          B[E] = 1 << E;
        for (var E = 8; E < 256; E += 1)
          B[E] = B[E - 4] ^ B[E - 5] ^ B[E - 6] ^ B[E - 8];
        for (var E = 0; E < 255; E += 1)
          F[B[E]] = E;
        var _ = {};
        return _.glog = function(w) {
          if (w < 1)
            throw "glog(" + w + ")";
          return F[w];
        }, _.gexp = function(w) {
          for (; w < 0; )
            w += 255;
          for (; w >= 256; )
            w -= 255;
          return B[w];
        }, _;
      })();
      function d(B, F) {
        if (typeof B.length > "u")
          throw B.length + "/" + F;
        var E = (function() {
          for (var w = 0; w < B.length && B[w] == 0; )
            w += 1;
          for (var b = new Array(B.length - w + F), k = 0; k < B.length - w; k += 1)
            b[k] = B[k + w];
          return b;
        })(), _ = {};
        return _.getAt = function(w) {
          return E[w];
        }, _.getLength = function() {
          return E.length;
        }, _.multiply = function(w) {
          for (var b = new Array(_.getLength() + w.getLength() - 1), k = 0; k < _.getLength(); k += 1)
            for (var p = 0; p < w.getLength(); p += 1)
              b[k + p] ^= i.gexp(i.glog(_.getAt(k)) + i.glog(w.getAt(p)));
          return d(b, 0);
        }, _.mod = function(w) {
          if (_.getLength() - w.getLength() < 0)
            return _;
          for (var b = i.glog(_.getAt(0)) - i.glog(w.getAt(0)), k = new Array(_.getLength()), p = 0; p < _.getLength(); p += 1)
            k[p] = _.getAt(p);
          for (var p = 0; p < w.getLength(); p += 1)
            k[p] ^= i.gexp(i.glog(w.getAt(p)) + b);
          return d(k, 0).mod(w);
        }, _;
      }
      var u = (function() {
        var B = [
          // L
          // M
          // Q
          // H
          // 1
          [1, 26, 19],
          [1, 26, 16],
          [1, 26, 13],
          [1, 26, 9],
          // 2
          [1, 44, 34],
          [1, 44, 28],
          [1, 44, 22],
          [1, 44, 16],
          // 3
          [1, 70, 55],
          [1, 70, 44],
          [2, 35, 17],
          [2, 35, 13],
          // 4
          [1, 100, 80],
          [2, 50, 32],
          [2, 50, 24],
          [4, 25, 9],
          // 5
          [1, 134, 108],
          [2, 67, 43],
          [2, 33, 15, 2, 34, 16],
          [2, 33, 11, 2, 34, 12],
          // 6
          [2, 86, 68],
          [4, 43, 27],
          [4, 43, 19],
          [4, 43, 15],
          // 7
          [2, 98, 78],
          [4, 49, 31],
          [2, 32, 14, 4, 33, 15],
          [4, 39, 13, 1, 40, 14],
          // 8
          [2, 121, 97],
          [2, 60, 38, 2, 61, 39],
          [4, 40, 18, 2, 41, 19],
          [4, 40, 14, 2, 41, 15],
          // 9
          [2, 146, 116],
          [3, 58, 36, 2, 59, 37],
          [4, 36, 16, 4, 37, 17],
          [4, 36, 12, 4, 37, 13],
          // 10
          [2, 86, 68, 2, 87, 69],
          [4, 69, 43, 1, 70, 44],
          [6, 43, 19, 2, 44, 20],
          [6, 43, 15, 2, 44, 16],
          // 11
          [4, 101, 81],
          [1, 80, 50, 4, 81, 51],
          [4, 50, 22, 4, 51, 23],
          [3, 36, 12, 8, 37, 13],
          // 12
          [2, 116, 92, 2, 117, 93],
          [6, 58, 36, 2, 59, 37],
          [4, 46, 20, 6, 47, 21],
          [7, 42, 14, 4, 43, 15],
          // 13
          [4, 133, 107],
          [8, 59, 37, 1, 60, 38],
          [8, 44, 20, 4, 45, 21],
          [12, 33, 11, 4, 34, 12],
          // 14
          [3, 145, 115, 1, 146, 116],
          [4, 64, 40, 5, 65, 41],
          [11, 36, 16, 5, 37, 17],
          [11, 36, 12, 5, 37, 13],
          // 15
          [5, 109, 87, 1, 110, 88],
          [5, 65, 41, 5, 66, 42],
          [5, 54, 24, 7, 55, 25],
          [11, 36, 12, 7, 37, 13],
          // 16
          [5, 122, 98, 1, 123, 99],
          [7, 73, 45, 3, 74, 46],
          [15, 43, 19, 2, 44, 20],
          [3, 45, 15, 13, 46, 16],
          // 17
          [1, 135, 107, 5, 136, 108],
          [10, 74, 46, 1, 75, 47],
          [1, 50, 22, 15, 51, 23],
          [2, 42, 14, 17, 43, 15],
          // 18
          [5, 150, 120, 1, 151, 121],
          [9, 69, 43, 4, 70, 44],
          [17, 50, 22, 1, 51, 23],
          [2, 42, 14, 19, 43, 15],
          // 19
          [3, 141, 113, 4, 142, 114],
          [3, 70, 44, 11, 71, 45],
          [17, 47, 21, 4, 48, 22],
          [9, 39, 13, 16, 40, 14],
          // 20
          [3, 135, 107, 5, 136, 108],
          [3, 67, 41, 13, 68, 42],
          [15, 54, 24, 5, 55, 25],
          [15, 43, 15, 10, 44, 16],
          // 21
          [4, 144, 116, 4, 145, 117],
          [17, 68, 42],
          [17, 50, 22, 6, 51, 23],
          [19, 46, 16, 6, 47, 17],
          // 22
          [2, 139, 111, 7, 140, 112],
          [17, 74, 46],
          [7, 54, 24, 16, 55, 25],
          [34, 37, 13],
          // 23
          [4, 151, 121, 5, 152, 122],
          [4, 75, 47, 14, 76, 48],
          [11, 54, 24, 14, 55, 25],
          [16, 45, 15, 14, 46, 16],
          // 24
          [6, 147, 117, 4, 148, 118],
          [6, 73, 45, 14, 74, 46],
          [11, 54, 24, 16, 55, 25],
          [30, 46, 16, 2, 47, 17],
          // 25
          [8, 132, 106, 4, 133, 107],
          [8, 75, 47, 13, 76, 48],
          [7, 54, 24, 22, 55, 25],
          [22, 45, 15, 13, 46, 16],
          // 26
          [10, 142, 114, 2, 143, 115],
          [19, 74, 46, 4, 75, 47],
          [28, 50, 22, 6, 51, 23],
          [33, 46, 16, 4, 47, 17],
          // 27
          [8, 152, 122, 4, 153, 123],
          [22, 73, 45, 3, 74, 46],
          [8, 53, 23, 26, 54, 24],
          [12, 45, 15, 28, 46, 16],
          // 28
          [3, 147, 117, 10, 148, 118],
          [3, 73, 45, 23, 74, 46],
          [4, 54, 24, 31, 55, 25],
          [11, 45, 15, 31, 46, 16],
          // 29
          [7, 146, 116, 7, 147, 117],
          [21, 73, 45, 7, 74, 46],
          [1, 53, 23, 37, 54, 24],
          [19, 45, 15, 26, 46, 16],
          // 30
          [5, 145, 115, 10, 146, 116],
          [19, 75, 47, 10, 76, 48],
          [15, 54, 24, 25, 55, 25],
          [23, 45, 15, 25, 46, 16],
          // 31
          [13, 145, 115, 3, 146, 116],
          [2, 74, 46, 29, 75, 47],
          [42, 54, 24, 1, 55, 25],
          [23, 45, 15, 28, 46, 16],
          // 32
          [17, 145, 115],
          [10, 74, 46, 23, 75, 47],
          [10, 54, 24, 35, 55, 25],
          [19, 45, 15, 35, 46, 16],
          // 33
          [17, 145, 115, 1, 146, 116],
          [14, 74, 46, 21, 75, 47],
          [29, 54, 24, 19, 55, 25],
          [11, 45, 15, 46, 46, 16],
          // 34
          [13, 145, 115, 6, 146, 116],
          [14, 74, 46, 23, 75, 47],
          [44, 54, 24, 7, 55, 25],
          [59, 46, 16, 1, 47, 17],
          // 35
          [12, 151, 121, 7, 152, 122],
          [12, 75, 47, 26, 76, 48],
          [39, 54, 24, 14, 55, 25],
          [22, 45, 15, 41, 46, 16],
          // 36
          [6, 151, 121, 14, 152, 122],
          [6, 75, 47, 34, 76, 48],
          [46, 54, 24, 10, 55, 25],
          [2, 45, 15, 64, 46, 16],
          // 37
          [17, 152, 122, 4, 153, 123],
          [29, 74, 46, 14, 75, 47],
          [49, 54, 24, 10, 55, 25],
          [24, 45, 15, 46, 46, 16],
          // 38
          [4, 152, 122, 18, 153, 123],
          [13, 74, 46, 32, 75, 47],
          [48, 54, 24, 14, 55, 25],
          [42, 45, 15, 32, 46, 16],
          // 39
          [20, 147, 117, 4, 148, 118],
          [40, 75, 47, 7, 76, 48],
          [43, 54, 24, 22, 55, 25],
          [10, 45, 15, 67, 46, 16],
          // 40
          [19, 148, 118, 6, 149, 119],
          [18, 75, 47, 31, 76, 48],
          [34, 54, 24, 34, 55, 25],
          [20, 45, 15, 61, 46, 16]
        ], F = function(w, b) {
          var k = {};
          return k.totalCount = w, k.dataCount = b, k;
        }, E = {}, _ = function(w, b) {
          switch (b) {
            case o.L:
              return B[(w - 1) * 4 + 0];
            case o.M:
              return B[(w - 1) * 4 + 1];
            case o.Q:
              return B[(w - 1) * 4 + 2];
            case o.H:
              return B[(w - 1) * 4 + 3];
            default:
              return;
          }
        };
        return E.getRSBlocks = function(w, b) {
          var k = _(w, b);
          if (typeof k > "u")
            throw "bad rs block @ typeNumber:" + w + "/errorCorrectionLevel:" + b;
          for (var p = k.length / 3, x = [], M = 0; M < p; M += 1)
            for (var C = k[M * 3 + 0], P = k[M * 3 + 1], Z = k[M * 3 + 2], ne = 0; ne < C; ne += 1)
              x.push(F(P, Z));
          return x;
        }, E;
      })(), f = function() {
        var B = [], F = 0, E = {};
        return E.getBuffer = function() {
          return B;
        }, E.getAt = function(_) {
          var w = Math.floor(_ / 8);
          return (B[w] >>> 7 - _ % 8 & 1) == 1;
        }, E.put = function(_, w) {
          for (var b = 0; b < w; b += 1)
            E.putBit((_ >>> w - b - 1 & 1) == 1);
        }, E.getLengthInBits = function() {
          return F;
        }, E.putBit = function(_) {
          var w = Math.floor(F / 8);
          B.length <= w && B.push(0), _ && (B[w] |= 128 >>> F % 8), F += 1;
        }, E;
      }, m = function(B) {
        var F = s.MODE_NUMBER, E = B, _ = {};
        _.getMode = function() {
          return F;
        }, _.getLength = function(k) {
          return E.length;
        }, _.write = function(k) {
          for (var p = E, x = 0; x + 2 < p.length; )
            k.put(w(p.substring(x, x + 3)), 10), x += 3;
          x < p.length && (p.length - x == 1 ? k.put(w(p.substring(x, x + 1)), 4) : p.length - x == 2 && k.put(w(p.substring(x, x + 2)), 7));
        };
        var w = function(k) {
          for (var p = 0, x = 0; x < k.length; x += 1)
            p = p * 10 + b(k.charAt(x));
          return p;
        }, b = function(k) {
          if ("0" <= k && k <= "9")
            return k.charCodeAt(0) - 48;
          throw "illegal char :" + k;
        };
        return _;
      }, v = function(B) {
        var F = s.MODE_ALPHA_NUM, E = B, _ = {};
        _.getMode = function() {
          return F;
        }, _.getLength = function(b) {
          return E.length;
        }, _.write = function(b) {
          for (var k = E, p = 0; p + 1 < k.length; )
            b.put(
              w(k.charAt(p)) * 45 + w(k.charAt(p + 1)),
              11
            ), p += 2;
          p < k.length && b.put(w(k.charAt(p)), 6);
        };
        var w = function(b) {
          if ("0" <= b && b <= "9")
            return b.charCodeAt(0) - 48;
          if ("A" <= b && b <= "Z")
            return b.charCodeAt(0) - 65 + 10;
          switch (b) {
            case " ":
              return 36;
            case "$":
              return 37;
            case "%":
              return 38;
            case "*":
              return 39;
            case "+":
              return 40;
            case "-":
              return 41;
            case ".":
              return 42;
            case "/":
              return 43;
            case ":":
              return 44;
            default:
              throw "illegal char :" + b;
          }
        };
        return _;
      }, y = function(B) {
        var F = s.MODE_8BIT_BYTE, E = a.stringToBytes(B), _ = {};
        return _.getMode = function() {
          return F;
        }, _.getLength = function(w) {
          return E.length;
        }, _.write = function(w) {
          for (var b = 0; b < E.length; b += 1)
            w.put(E[b], 8);
        }, _;
      }, A = function(B) {
        var F = s.MODE_KANJI, E = a.stringToBytesFuncs.SJIS;
        if (!E)
          throw "sjis not supported.";
        (function(b, k) {
          var p = E(b);
          if (p.length != 2 || (p[0] << 8 | p[1]) != k)
            throw "sjis not supported.";
        })("友", 38726);
        var _ = E(B), w = {};
        return w.getMode = function() {
          return F;
        }, w.getLength = function(b) {
          return ~~(_.length / 2);
        }, w.write = function(b) {
          for (var k = _, p = 0; p + 1 < k.length; ) {
            var x = (255 & k[p]) << 8 | 255 & k[p + 1];
            if (33088 <= x && x <= 40956)
              x -= 33088;
            else if (57408 <= x && x <= 60351)
              x -= 49472;
            else
              throw "illegal char at " + (p + 1) + "/" + x;
            x = (x >>> 8 & 255) * 192 + (x & 255), b.put(x, 13), p += 2;
          }
          if (p < k.length)
            throw "illegal char at " + (p + 1);
        }, w;
      }, R = function() {
        var B = [], F = {};
        return F.writeByte = function(E) {
          B.push(E & 255);
        }, F.writeShort = function(E) {
          F.writeByte(E), F.writeByte(E >>> 8);
        }, F.writeBytes = function(E, _, w) {
          _ = _ || 0, w = w || E.length;
          for (var b = 0; b < w; b += 1)
            F.writeByte(E[b + _]);
        }, F.writeString = function(E) {
          for (var _ = 0; _ < E.length; _ += 1)
            F.writeByte(E.charCodeAt(_));
        }, F.toByteArray = function() {
          return B;
        }, F.toString = function() {
          var E = "";
          E += "[";
          for (var _ = 0; _ < B.length; _ += 1)
            _ > 0 && (E += ","), E += B[_];
          return E += "]", E;
        }, F;
      }, S = function() {
        var B = 0, F = 0, E = 0, _ = "", w = {}, b = function(p) {
          _ += String.fromCharCode(k(p & 63));
        }, k = function(p) {
          if (!(p < 0)) {
            if (p < 26)
              return 65 + p;
            if (p < 52)
              return 97 + (p - 26);
            if (p < 62)
              return 48 + (p - 52);
            if (p == 62)
              return 43;
            if (p == 63)
              return 47;
          }
          throw "n:" + p;
        };
        return w.writeByte = function(p) {
          for (B = B << 8 | p & 255, F += 8, E += 1; F >= 6; )
            b(B >>> F - 6), F -= 6;
        }, w.flush = function() {
          if (F > 0 && (b(B << 6 - F), B = 0, F = 0), E % 3 != 0)
            for (var p = 3 - E % 3, x = 0; x < p; x += 1)
              _ += "=";
        }, w.toString = function() {
          return _;
        }, w;
      }, D = function(B) {
        var F = B, E = 0, _ = 0, w = 0, b = {};
        b.read = function() {
          for (; w < 8; ) {
            if (E >= F.length) {
              if (w == 0)
                return -1;
              throw "unexpected end of file./" + w;
            }
            var p = F.charAt(E);
            if (E += 1, p == "=")
              return w = 0, -1;
            if (p.match(/^\s$/))
              continue;
            _ = _ << 6 | k(p.charCodeAt(0)), w += 6;
          }
          var x = _ >>> w - 8 & 255;
          return w -= 8, x;
        };
        var k = function(p) {
          if (65 <= p && p <= 90)
            return p - 65;
          if (97 <= p && p <= 122)
            return p - 97 + 26;
          if (48 <= p && p <= 57)
            return p - 48 + 52;
          if (p == 43)
            return 62;
          if (p == 47)
            return 63;
          throw "c:" + p;
        };
        return b;
      }, U = function(B, F) {
        var E = B, _ = F, w = new Array(B * F), b = {};
        b.setPixel = function(M, C, P) {
          w[C * E + M] = P;
        }, b.write = function(M) {
          M.writeString("GIF87a"), M.writeShort(E), M.writeShort(_), M.writeByte(128), M.writeByte(0), M.writeByte(0), M.writeByte(0), M.writeByte(0), M.writeByte(0), M.writeByte(255), M.writeByte(255), M.writeByte(255), M.writeString(","), M.writeShort(0), M.writeShort(0), M.writeShort(E), M.writeShort(_), M.writeByte(0);
          var C = 2, P = p(C);
          M.writeByte(C);
          for (var Z = 0; P.length - Z > 255; )
            M.writeByte(255), M.writeBytes(P, Z, 255), Z += 255;
          M.writeByte(P.length - Z), M.writeBytes(P, Z, P.length - Z), M.writeByte(0), M.writeString(";");
        };
        var k = function(M) {
          var C = M, P = 0, Z = 0, ne = {};
          return ne.write = function(ie, fe) {
            if (ie >>> fe)
              throw "length over";
            for (; P + fe >= 8; )
              C.writeByte(255 & (ie << P | Z)), fe -= 8 - P, ie >>>= 8 - P, Z = 0, P = 0;
            Z = ie << P | Z, P = P + fe;
          }, ne.flush = function() {
            P > 0 && C.writeByte(Z);
          }, ne;
        }, p = function(M) {
          for (var C = 1 << M, P = (1 << M) + 1, Z = M + 1, ne = x(), ie = 0; ie < C; ie += 1)
            ne.add(String.fromCharCode(ie));
          ne.add(String.fromCharCode(C)), ne.add(String.fromCharCode(P));
          var fe = R(), Ae = k(fe);
          Ae.write(C, Z);
          var He = 0, ve = String.fromCharCode(w[He]);
          for (He += 1; He < w.length; ) {
            var me = String.fromCharCode(w[He]);
            He += 1, ne.contains(ve + me) ? ve = ve + me : (Ae.write(ne.indexOf(ve), Z), ne.size() < 4095 && (ne.size() == 1 << Z && (Z += 1), ne.add(ve + me)), ve = me);
          }
          return Ae.write(ne.indexOf(ve), Z), Ae.write(P, Z), Ae.flush(), fe.toByteArray();
        }, x = function() {
          var M = {}, C = 0, P = {};
          return P.add = function(Z) {
            if (P.contains(Z))
              throw "dup key:" + Z;
            M[Z] = C, C += 1;
          }, P.size = function() {
            return C;
          }, P.indexOf = function(Z) {
            return M[Z];
          }, P.contains = function(Z) {
            return typeof M[Z] < "u";
          }, P;
        };
        return b;
      }, N = function(B, F, E) {
        for (var _ = U(B, F), w = 0; w < F; w += 1)
          for (var b = 0; b < B; b += 1)
            _.setPixel(b, w, E(b, w));
        var k = R();
        _.write(k);
        for (var p = S(), x = k.toByteArray(), M = 0; M < x.length; M += 1)
          p.writeByte(x[M]);
        return p.flush(), "data:image/gif;base64," + p;
      };
      return a;
    })();
    (function() {
      n.stringToBytesFuncs["UTF-8"] = function(a) {
        function s(o) {
          for (var l = [], r = 0; r < o.length; r++) {
            var i = o.charCodeAt(r);
            i < 128 ? l.push(i) : i < 2048 ? l.push(
              192 | i >> 6,
              128 | i & 63
            ) : i < 55296 || i >= 57344 ? l.push(
              224 | i >> 12,
              128 | i >> 6 & 63,
              128 | i & 63
            ) : (r++, i = 65536 + ((i & 1023) << 10 | o.charCodeAt(r) & 1023), l.push(
              240 | i >> 18,
              128 | i >> 12 & 63,
              128 | i >> 6 & 63,
              128 | i & 63
            ));
          }
          return l;
        }
        return s(a);
      };
    })(), (function(a) {
      e.exports = a();
    })(function() {
      return n;
    });
  })(Fa)), Fa.exports;
}
var n4 = t4();
const a4 = /* @__PURE__ */ e4(n4), s4 = ["width", "height", "viewBox"], o4 = ["width", "height"], l4 = ["d"], r4 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = T(() => {
      const a = a4(0, "M");
      a.addData(t.text), a.make();
      const s = a.getModuleCount(), o = [];
      for (let l = 0; l < s; l += 1)
        for (let r = 0; r < s; r += 1)
          a.isDark(l, r) && o.push(`M${r + 4} ${l + 4}h1v1h-1z`);
      return { count: s + 8, path: o.join("") };
    });
    return (a, s) => (c(), h("svg", {
      class: "qr",
      width: e.size,
      height: e.size,
      viewBox: `0 0 ${n.value.count} ${n.value.count}`,
      "shape-rendering": "crispEdges",
      role: "img",
      "aria-label": "QR code"
    }, [
      g("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, o4),
      g("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, l4)
    ], 8, s4));
  }
}, j8 = /* @__PURE__ */ J(r4, [["__scopeId", "data-v-489f0852"]]), i4 = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "window-room",
      "data-window-room": "",
      style: ge({ padding: e.padding })
    }, [
      de(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, P8 = /* @__PURE__ */ J(i4, [["__scopeId", "data-v-47e67f04"]]);
function q8(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const F8 = $i(() => import("./VoiceFigure-CJ4elHcY.js").then((e) => e.V)), W8 = "1.2.0", H8 = "3.5";
export {
  Jd as $,
  _e as A,
  Ce as B,
  sa as C,
  at as D,
  Kx as E,
  Jb as F,
  j$ as G,
  Ux as H,
  Ob as I,
  aw as J,
  At as K,
  f4 as L,
  Ns as M,
  cw as N,
  nw as O,
  aa as P,
  ux as Q,
  v$ as R,
  Ln as S,
  px as T,
  c$ as U,
  Ee as V,
  zn as W,
  i$ as X,
  r$ as Y,
  Yd as Z,
  J as _,
  Q4 as a,
  Rx as a$,
  rw as a0,
  y$ as a1,
  b$ as a2,
  Ne as a3,
  O$ as a4,
  C$ as a5,
  St as a6,
  w$ as a7,
  W$ as a8,
  W4 as a9,
  Mx as aA,
  rx as aB,
  bb as aC,
  V$ as aD,
  G$ as aE,
  Yx as aF,
  Hr as aG,
  mx as aH,
  fn as aI,
  K4 as aJ,
  z4 as aK,
  jx as aL,
  hn as aM,
  Wx as aN,
  D$ as aO,
  ix as aP,
  cx as aQ,
  lx as aR,
  an as aS,
  $t as aT,
  H4 as aU,
  cy as aV,
  sx as aW,
  p$ as aX,
  Fr as aY,
  Dt as aZ,
  Ft as a_,
  Ix as aa,
  qx as ab,
  Z4 as ac,
  u$ as ad,
  d$ as ae,
  E$ as af,
  A$ as ag,
  T$ as ah,
  a$ as ai,
  Vo as aj,
  k$ as ak,
  F$ as al,
  Qx as am,
  ex as an,
  X$ as ao,
  Z$ as ap,
  R$ as aq,
  S$ as ar,
  M$ as as,
  _$ as at,
  hx as au,
  q$ as av,
  H$ as aw,
  n8 as ax,
  Yt as ay,
  U$ as az,
  ww as b,
  t8 as b$,
  Vb as b0,
  Fx as b1,
  yx as b2,
  vx as b3,
  Iy as b4,
  Ar as b5,
  Cx as b6,
  P$ as b7,
  ra as b8,
  rt as b9,
  wx as bA,
  _x as bB,
  ut as bC,
  gx as bD,
  Ex as bE,
  z$ as bF,
  tx as bG,
  K$ as bH,
  Te as bI,
  N$ as bJ,
  Ax as bK,
  u8 as bL,
  d8 as bM,
  q4 as bN,
  fy as bO,
  B$ as bP,
  kx as bQ,
  e$ as bR,
  Xx as bS,
  bx as bT,
  $x as bU,
  xx as bV,
  I$ as bW,
  wb as bX,
  L$ as bY,
  J$ as bZ,
  Zx as b_,
  Sx as ba,
  Aa as bb,
  Jl as bc,
  s8 as bd,
  r8 as be,
  fx as bf,
  Dx as bg,
  F4 as bh,
  Q$ as bi,
  o8 as bj,
  $$ as bk,
  x$ as bl,
  o$ as bm,
  g$ as bn,
  G4 as bo,
  Lx as bp,
  t$ as bq,
  n$ as br,
  l$ as bs,
  ax as bt,
  sy as bu,
  Hx as bv,
  tw as bw,
  s$ as bx,
  Y4 as by,
  nx as bz,
  Ry as c,
  Nt as c$,
  V4 as c0,
  U4 as c1,
  Y$ as c2,
  i8 as c3,
  Fs as c4,
  c8 as c5,
  si as c6,
  Nx as c7,
  h$ as c8,
  f$ as c9,
  ye as cA,
  _8 as cB,
  k4 as cC,
  W8 as cD,
  H8 as cE,
  C4 as cF,
  A8 as cG,
  ns as cH,
  L4 as cI,
  Wv as cJ,
  Mt as cK,
  us as cL,
  ea as cM,
  M4 as cN,
  O4 as cO,
  qc as cP,
  ov as cQ,
  L8 as cR,
  _4 as cS,
  j8 as cT,
  sr as cU,
  pu as cV,
  x8 as cW,
  uf as cX,
  v4 as cY,
  D4 as cZ,
  vk as c_,
  iy as ca,
  J4 as cb,
  Qb as cc,
  ox as cd,
  Is as ce,
  mb as cf,
  dx as cg,
  Jt as ch,
  Lt as ci,
  $4 as cj,
  S8 as ck,
  ue as cl,
  Td as cm,
  qd as cn,
  xs as co,
  Fm as cp,
  Ms as cq,
  N8 as cr,
  P4 as cs,
  Um as ct,
  ig as cu,
  Qt as cv,
  f8 as cw,
  u4 as cx,
  xt as cy,
  ad as cz,
  ze as d,
  h4 as d$,
  T4 as d0,
  _t as d1,
  pt as d2,
  jp as d3,
  xu as d4,
  I4 as d5,
  y4 as d6,
  Pt as d7,
  E8 as d8,
  D8 as d9,
  Jh as dA,
  h8 as dB,
  p4 as dC,
  O8 as dD,
  Nv as dE,
  Pw as dF,
  b4 as dG,
  A4 as dH,
  v8 as dI,
  b8 as dJ,
  Fe as dK,
  x4 as dL,
  S4 as dM,
  Wc as dN,
  pr as dO,
  g8 as dP,
  Ki as dQ,
  g4 as dR,
  m4 as dS,
  xl as dT,
  Ml as dU,
  Bu as dV,
  w4 as dW,
  ct as dX,
  q8 as dY,
  qw as dZ,
  d4 as d_,
  Ws as da,
  od as db,
  kt as dc,
  R4 as dd,
  ia as de,
  F8 as df,
  P8 as dg,
  Os as dh,
  y8 as di,
  ps as dj,
  X1 as dk,
  xo as dl,
  cr as dm,
  Ru as dn,
  I8 as dp,
  R8 as dq,
  bs as dr,
  Tu as ds,
  gl as dt,
  E4 as du,
  B8 as dv,
  j4 as dw,
  N4 as dx,
  B4 as dy,
  m8 as dz,
  m$ as e,
  p8 as e0,
  M8 as e1,
  Dw as e2,
  C8 as e3,
  Hg as e4,
  bl as e5,
  _k as e6,
  gs as e7,
  w8 as e8,
  Ua as e9,
  k8 as ea,
  $8 as eb,
  We as ec,
  T8 as ed,
  Iu as ee,
  ay as f,
  a8 as g,
  sn as h,
  zx as i,
  l8 as j,
  Vx as k,
  Bx as l,
  Sw as m,
  Ds as n,
  Px as o,
  X4 as p,
  Gx as q,
  ni as r,
  ai as s,
  Me as t,
  Ly as u,
  Ox as v,
  e8 as w,
  Tx as x,
  pn as y,
  Jx as z
};
