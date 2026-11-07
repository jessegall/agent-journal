/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, normalizeStyle as ge, unref as P, renderSlot as ue, createElementVNode as g, normalizeClass as X, Fragment as z, renderList as te, defineComponent as ii, Comment as ci, h as Jn, cloneVNode as ui, createBlock as H, withCtx as j, createVNode as L, toDisplayString as $, createCommentVNode as O, ref as I, onMounted as Re, onBeforeUnmount as ft, reactive as Zn, shallowRef as Ke, watch as he, onUnmounted as Be, inject as Oe, useAttrs as Xn, computed as R, resolveDynamicComponent as ht, mergeProps as Le, useId as fs, resolveDirective as di, withDirectives as Ye, createTextVNode as ee, Teleport as hs, nextTick as mt, Transition as jt, withModifiers as $e, createApp as fi, TransitionGroup as al, shallowReactive as hi, isRef as Vs, onScopeDispose as ms, resolveComponent as mi, useModel as Wa, getCurrentInstance as pi, mergeModels as Ha, getCurrentScope as sl, provide as ol, onErrorCaptured as gi, toHandlers as vi, createSlots as yi, vShow as ll, useSlots as bi, withKeys as Xt, vModelText as Dn, normalizeProps as wi, guardReactiveProps as ki, defineAsyncComponent as $i } from "vue";
function rl(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const Y = (e, t) => {
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
      style: ge(P(t))
    }, null, 4));
  }
}, Gt = /* @__PURE__ */ Y(Mi, [["__scopeId", "data-v-6c018b03"]]), Si = { class: "skeleton-line" }, _i = 2e3, Ei = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = rl(_i);
    return (n, a) => (c(), h("span", Si, [
      ue(n.$slots, "default", {}, void 0, !0),
      g("span", {
        class: X(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(z, null, te(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: X(["bar", { still: e.still }]),
          style: ge({ ...P(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, pt = /* @__PURE__ */ Y(Ei, [["__scopeId", "data-v-484fe8a0"]]), Pt = ii({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== ci);
      return a.length !== 1 ? Jn(z, { key: n }, a) : a[0].key == null ? ui(a[0], { key: n }) : a[0];
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
    return (i, u) => (c(), H(Pt, { value: e.shape }, {
      messages: j(() => [
        g("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(z, null, te(t, (d) => L(Gt, {
            key: d.id,
            class: X(["skeleton-message", { mine: d.mine }]),
            style: ge({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, Ai)
      ]),
      older: j(() => [
        g("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(z, null, te(t.slice(0, 3), (d) => (c(), H(Gt, {
            key: d.id,
            class: X(["skeleton-message", { mine: d.mine }]),
            style: ge({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, Ci)
      ]),
      cards: j(() => [
        g("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(z, null, te(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (c(), h(z, null, te(n, (f) => L(pt, {
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
          (c(!0), h(z, null, te(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            L(pt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (c(), h(z, null, te(s, (f) => L(pt, {
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
          (c(!0), h(z, null, te(e.count, (d) => (c(), H(pt, {
            key: d,
            bars: P(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Ri)
      ]),
      text: j(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(z, null, te(e.count, (d) => (c(), H(pt, {
            key: d,
            bars: P(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Ii)
      ]),
      default: j(() => [
        g("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(z, null, te(e.count, (d) => (c(), H(pt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Bi)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, _t = /* @__PURE__ */ Y(Li, [["__scopeId", "data-v-ef519c5f"]]), Ni = {
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
        ue(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", Pi, [
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Qt = /* @__PURE__ */ Y(qi, [["__scopeId", "data-v-b27e89b0"]]), Fi = { class: "fold-group" }, Wi = ["aria-expanded"], Hi = { class: "fold-label" }, Ui = {
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
      e.open ? ue(a.$slots, "default", {}, void 0, !0, 0) : O("", !0)
    ]));
  }
}, s4 = /* @__PURE__ */ Y(zi, [["__scopeId", "data-v-9ef1865c"]]), Vi = 150, Gi = () => Vi;
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
function o4(e) {
  const t = We().sources.find((n) => n.key === e);
  return t ? Ua(t.read, t.events) : Ua("", []);
}
function il(e, t, n, a, s = () => !1) {
  const o = I([]), l = I(null), r = I(""), i = I(!1), u = performance.now(), d = I(!1), f = I(""), m = I(null), v = /* @__PURE__ */ new Set();
  let y = null;
  function S(p) {
    return s() ? (v.add(p), y ?? (y = new Promise((x) => setTimeout(() => x(_()), Yi)))) : T(p);
  }
  async function _() {
    const p = new Set(v);
    v.clear(), y = null;
    const x = D, M = await t({ ids: [...p].join(","), limit: p.size });
    if (x !== D) return;
    if (!M.ok) return E();
    const C = new Map(M.value.rows.map((N) => [N.id, N]));
    o.value = o.value.flatMap((N) => p.has(N.id) ? C.has(N.id) ? [C.get(N.id)] : [] : [N]);
  }
  async function T(p) {
    const x = D, M = await t({ "before-id": p + 1, limit: 1 });
    if (x !== D) return;
    if (!M.ok) return E();
    const C = M.value.rows.find((N) => N.id === p);
    o.value = C ? o.value.map((N) => N.id === p ? C : N) : o.value.filter((N) => N.id !== p);
  }
  async function W(p) {
    if (a() && String((p == null ? void 0 : p.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((ne) => ne.id !== p.row_id));
    if (a() && (p != null && p.row_id) && !String(p.event ?? "").endsWith(".create") && o.value.some((ne) => ne.id === p.row_id)) return S(p.row_id);
    if (!(a() && o.value.length && String((p == null ? void 0 : p.event) ?? "").endsWith(".create"))) return E();
    const M = Math.max(...o.value.map((ne) => ne.id)), C = D, N = await t({ "after-id": M });
    if (C !== D) return;
    if (!N.ok) return E();
    const Z = new Set(o.value.map((ne) => ne.id));
    o.value = [...N.value.rows.filter((ne) => !Z.has(ne.id)), ...o.value];
  }
  async function J() {
    if (!d.value || !o.value.length) return !1;
    const p = D, x = Math.min(...o.value.map((N) => N.id)), M = await t({ "before-id": x });
    if (p !== D) return !1;
    if (!M.ok || !M.value.rows.length) return d.value = !1;
    d.value = Gs(M.value, n());
    const C = new Set(o.value.map((N) => N.id));
    return o.value = [...o.value, ...M.value.rows.filter((N) => !C.has(N.id))], !0;
  }
  let D = 0;
  function B(p, x) {
    var N, Z;
    const M = p.ok ? e.shared ? [p.value] : ((N = p.value) == null ? void 0 : N.rows) ?? [] : [];
    p.ok && (o.value = x(M)), l.value = p.ok ? p.value : null;
    const C = M.length ? Math.min(...M.map((ne) => ne.id)) : 0;
    p.ok && ((Z = p.value) != null && Z.rows) && !o.value.some((ne) => ne.id < C) && (d.value = !e.shared && Gs(p.value, n())), r.value = p.ok ? "" : p.error, ps(u, () => i.value = !0);
  }
  async function q(p) {
    const x = ++D, M = await t({});
    x === D && B(M, p);
  }
  const A = (p) => {
    if (!a() || !p.length) return p;
    const x = Math.min(...p.map((C) => C.id)), M = Math.max(...p.map((C) => C.id));
    return [...o.value.filter((C) => C.id > M), ...p, ...o.value.filter((C) => C.id < x)];
  }, E = () => q(A), b = (p) => B(p, A), w = () => q((p) => p);
  async function k(p, x = null) {
    const M = await Ki(x && { target: o, fields: { value: x(o.value) } }, p, e.run);
    return f.value = M.ok ? "" : M.error, m.value = M.ok ? M.value : null, await E(), M;
  }
  return { rows: o, listing: l, failure: r, loaded: i, more: d, load: E, loadLatest: w, older: J, act: k, actionFailure: f, answer: m, context: e, heard: W, showFirst: b };
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
  const l = async (d) => {
    o = !0;
    try {
      await d();
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
  }, u = async () => {
    s || document.hidden || o || (clearTimeout(a), await r(), i());
  };
  Re(async () => {
    document.addEventListener("visibilitychange", u), await l(e), i();
  }), ft(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", u);
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
    o = !1, a = Date.now(), l && (l = !1, u());
  }, i = () => {
    s = null;
    const d = e();
    a = Date.now(), d instanceof Promise && (o = !0, d.catch(() => {
    }).finally(r));
  }, u = () => {
    if (o) {
      l = !0;
      return;
    }
    if (s) return;
    const d = t - (Date.now() - a);
    d <= 0 ? i() : s = setTimeout(i, d);
  };
  return u.cancel = () => {
    clearTimeout(s), s = null, l = !1;
  }, u;
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
const st = "viewer.shell", yn = 2e4, pc = 4, Js = "/api/read-lines", gc = 5e3, vc = 403, Zs = "/api/repeated-lines", yc = 10, bc = 2e3, wc = 3e5, l4 = 6e5, bn = 6, kc = 500, $c = "/journal/summary", Xs = "/api/server-state", xc = 2e4, wn = cl ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Mc = (e) => e.split("?")[0].endsWith($c), Ka = (e, t) => Object.assign(new Error(t), { status: e });
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
    const r = a instanceof FormData, i = { method: t, headers: { ...wn, ...l, ...a === void 0 || r ? {} : { "Content-Type": "application/json" } }, body: _c(a) }, u = s || (r ? wc : yn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, i, [{ window: st, line: n, kind: Xe }], u)) : await this.sent(n, i, [{ window: st, line: n, kind: Tt }], u);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
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
  let i = {}, u = 0, d = 0, f = !1;
  function m(b) {
    const w = () => i[b] ?? i[`${b.slice(0, b.lastIndexOf("."))}.*`] ?? {}, k = I(void 0), p = il(e, async (x) => {
      const M = await S(b, x);
      return M.ok && !Object.keys(x).length && (k.value = M.value), M;
    }, () => w().page_size || Dc, () => !!w().page_size, () => !!w().reads_ids);
    return t[b] = { ...p, data: k, readAt: 0 };
  }
  const v = new Proxy({}, { get: (b, w) => typeof w != "string" || w.startsWith("__v") ? void 0 : t[w] ?? m(w) }), y = (b) => (i[b].loading !== Lc || b.endsWith(kn)) && (!i[b].tab || i[b].tab === n.tab);
  function S(b, w = {}) {
    return new Promise((k) => {
      a.push({ name: b, flags: w, resolve: k }), a.length === 1 && setTimeout(_);
    });
  }
  async function _() {
    const b = /* @__PURE__ */ new Map(), w = a.splice(0).filter((x) => {
      const M = JSON.stringify(x.flags);
      return b.has(x.name) || b.set(x.name, M), b.get(x.name) === M ? !0 : (a.push(x), !1);
    });
    a.length && setTimeout(_);
    const k = Object.fromEntries(w.flatMap(({ name: x, flags: M }) => Object.entries(M).map(([C, N]) => [`${x}.${C}`, N]))), p = await e.readKeys({ only: [...new Set(w.map(({ name: x }) => x))], state: { ...n, ...k } });
    w.forEach(({ name: x, resolve: M }) => M(p.ok ? p.value.keys[x] : p));
  }
  async function T(b) {
    var x;
    const w = ++d;
    (b.length ? b : Object.keys(i).filter((M) => !M.endsWith(kn) && i[M].loading === "first" && y(M))).forEach((M) => l[M] = w);
    const p = await e.readKeys({ only: b, state: { ...n } });
    if (!p.ok) {
      if (p.failure === "cancelled") return !1;
      const M = (b.length ? b : Object.keys(t)).filter((N) => (l[N] ?? 0) <= w);
      M.forEach((N) => {
        v[N].readAt = Date.now(), p.failure === "unreachable" ? r.add(N) : r.delete(N), v[N].showFirst(p);
      });
      const C = p.failure === "unreachable" && ((x = e.waitForServer) == null ? void 0 : x.call(e));
      return C && C.then(() => {
        if (f) return;
        const N = M.filter((Z) => l[Z] === w);
        (N.length || !b.length && !M.length && d === w) && T(N);
      }), !1;
    }
    return A(p.value.declared), Object.entries(p.value.keys).forEach(([M, C]) => {
      (l[M] ?? 0) > w || (l[M] = w, v[M].readAt = Date.now(), r.delete(M), C.ok && (v[M].data.value = C.value), v[M].showFirst(C));
    }), !0;
  }
  function W(b) {
    const w = jc(b);
    return w.length ? (w.forEach((k) => o.names.add(k)), o.answer ?? (o.answer = new Promise((k) => setTimeout(() => {
      const p = [...o.names];
      o.names.clear(), o.answer = null, k(T(p));
    })))) : T([]);
  }
  function J(b) {
    b.forEach((w) => s.add(w)), clearTimeout(u), u = setTimeout(() => {
      const w = [...s];
      s.clear(), w.length && T(w);
    }, Tc);
  }
  const D = (b) => b.endsWith(kn) ? Object.keys(t).filter((w) => w.startsWith(b.slice(0, -1)) && t[w].readAt) : [b], B = (b) => (i[b] ?? i[`${b.split(".")[0]}.*`]).reload_seconds;
  function q(b) {
    const w = Object.keys(i).filter((p) => b.event === Rc || i[p].events.some((x) => ys(x, b.event)));
    w.filter((p) => i[p].page_size).forEach((p) => v[p].heard(b));
    const k = w.filter((p) => !i[p].page_size);
    k.filter((p) => !y(p)).forEach((p) => v[p].readAt = 0), J(k.filter(y).flatMap(D));
  }
  function A(b) {
    if (Object.keys(i).length) return;
    i = b;
    const w = [...new Set(Object.values(b).flatMap((p) => p.events))];
    w.length && e.follow(w, q);
    const k = Object.keys(b).filter((p) => b[p].loading === Nc);
    k.length && T(k);
  }
  he(() => n.tab, () => {
    const b = Object.keys(i).filter((w) => !w.endsWith(kn) && y(w) && !v[w].readAt);
    b.length && T(b);
  }), Be(() => {
    f = !0, clearTimeout(u);
  });
  function E() {
    const b = Date.now(), w = Object.keys(i).filter((k) => i[k].reload_seconds > 0 && y(k)).flatMap(D).filter((k) => b - v[k].readAt >= (r.has(k) ? Math.min(B(k) * 1e3, Bc) : B(k) * 1e3));
    w.length && J(w);
  }
  return gs(E, () => e.visible.value, Ic), queueMicrotask(() => T([])), { props: v, state: n, reload: W, readKey: S };
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
const Wc = (e, t) => e(vl, t), r4 = () => Oe(vl), Hc = ["data-icon", "stroke-width", "innerHTML"], ye = {
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
}, zc = /* @__PURE__ */ Y(Uc, [["__scopeId", "data-v-eb453d6f"]]), Vc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = Xn(), a = R(() => Object.fromEntries(Object.entries(n).filter(([u]) => u !== "onClick"))), s = I(!1), o = R(() => t.busy || s.value), l = Oe(Ne, null), r = R(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function i(u) {
      const d = [n.onClick].flat().filter(Boolean).map((m) => m(u)).filter((m) => m instanceof Promise);
      if (!d.length) return;
      const f = setTimeout(() => s.value = !0, ul);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(f), s.value = !1;
      }
    }
    return (u, d) => (c(), H(ht(e.href ? "a" : "button"), Le(a.value, {
      type: e.href ? void 0 : P(n).type || "button",
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
          ue(u.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (c(), H(zc, {
          key: 0,
          class: "btn-spinner"
        })) : O("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), de = /* @__PURE__ */ Y(Vc, [["__scopeId", "data-v-ededdadf"]]), Gc = ["aria-checked", "aria-haspopup", "onClick"], Kc = {
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
        (c(!0), h(z, null, te(e.options, (r) => Ye((c(), h("button", {
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
          [l, r.tip || r.title, `${P(a)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Nt = /* @__PURE__ */ Y(Zc, [["__scopeId", "data-v-c89bc92d"]]), Xc = {
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
      e.more ? (c(), H(de, {
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
}, Qn = /* @__PURE__ */ Y(eu, [["__scopeId", "data-v-10464014"]]), tu = { class: "link-group" }, nu = {
  class: "group-label",
  "data-link-kind": ""
}, au = ["disabled", "onClick"], su = { class: "title" }, ou = { class: "relations" }, lu = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(!1), o = R(() => s.value ? n.rows : n.rows.slice(0, 3)), l = R(() => `${n.model.replaceAll("_", " ").replace(/^./, (d) => d.toUpperCase())} ${n.count}`), r = (d) => d.endpoint.unavailable || !d.endpoint.open_ref, i = (d) => ({ [n.linkAttribute]: !0, "data-link-model": d.endpoint.model, "data-link-id": d.endpoint.id }), u = (d) => `${d.endpoint.model === "doc" && d.endpoint.id === n.documentId ? "Design document" : d.endpoint.model.replaceAll("_", " ").replace(/^./, (f) => f.toUpperCase())} ${d.endpoint.id}, ${d.relations.map((f) => f.replaceAll("_", " ")).join(", ")}`;
    return (d, f) => (c(), h("div", tu, [
      g("div", nu, $(l.value), 1),
      (c(!0), h(z, null, te(o.value, (m) => (c(), h("button", Le({
        key: `${m.endpoint.model}:${m.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, i(m), {
        disabled: r(m),
        onClick: (v) => a("open", m)
      }), [
        g("span", su, $(m.endpoint.title), 1),
        g("span", ou, [
          ee($(u(m)), 1),
          r(m) ? (c(), h(z, { key: 0 }, [
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
}, ru = /* @__PURE__ */ Y(lu, [["__scopeId", "data-v-be6f079c"]]), iu = ["data-loaded"], cu = ["disabled", "onClick"], uu = { class: "title" }, du = { class: "relations" }, fu = { key: 3 }, hu = {
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
    linkAttribute: { type: String, default: "data-resource-link" },
    empty: { type: String, default: "" }
  },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I([]), o = I({}), l = I(0), r = I(""), i = I(null), u = I(!1), d = I("");
    let f = 0;
    const m = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, v = (E) => m[E] || `${E.replaceAll("_", " ").replace(/^./, (b) => b.toUpperCase())}s`, y = R(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((E, b) => E + b, 0) },
      ...Object.entries(o.value).map(([E, b]) => ({ key: E, label: v(E), count: b }))
    ]), S = R(() => {
      const E = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((w) => w.endpoint.model))].map((w) => [w, s.value.filter((k) => k.endpoint.model === w).length])), b = { doc: 0, task: 1, message: 2 };
      return Object.entries(E).sort(([w], [k]) => (b[w] ?? 3) - (b[k] ?? 3)).map(([w, k]) => ({ model: w, count: k, rows: s.value.filter((p) => p.endpoint.model === w) }));
    }), _ = (E) => E.endpoint.unavailable || !E.endpoint.open_ref, T = (E) => ({ [n.linkAttribute]: !0, "data-link-model": E.endpoint.model, "data-link-id": E.endpoint.id }), W = (E) => `${E.endpoint.model === "doc" && E.endpoint.id === n.documentId ? "Design document" : E.endpoint.model.replaceAll("_", " ").replace(/^./, (b) => b.toUpperCase())} ${E.endpoint.id}, ${E.relations.map((b) => b.replaceAll("_", " ")).join(", ")}`;
    async function J(E = 1) {
      const b = ++f;
      u.value = !0, d.value = "";
      const w = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(E), "--page-size", String(n.pageSize)];
      n.outsidePlan && w.push("--outside-plan"), n.documentId && w.push("--first-counterpart", `doc:${n.documentId}`), r.value && w.push("--kind", r.value);
      try {
        const k = await n.read(w);
        if (b !== f) return;
        if (!k.ok) {
          d.value = k.error;
          return;
        }
        const p = k.value.counterparts ?? [], x = E === 1 ? p : [...s.value, ...p];
        s.value = [...new Map(x.map((M) => [`${M.endpoint.model}:${M.endpoint.id}`, M])).values()], o.value = k.value.kinds ?? {}, l.value = k.value.total, i.value = k.value.next_page ?? null;
      } catch (k) {
        b === f && (d.value = k.message);
      } finally {
        b === f && (u.value = !1);
      }
    }
    function D(E) {
      if (_(E)) return;
      const [b, w] = E.endpoint.open_ref.split(":");
      a("open", { table: b, id: Number(w) });
    }
    function B(E) {
      r.value = E, J();
    }
    const q = () => !u.value && i.value && J(i.value), A = R(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return he(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], i.value = null, r.value = "", J();
    }, { immediate: !0 }), (E, b) => s.value.length || u.value || d.value || e.empty ? (c(), h("section", {
      key: 0,
      class: X(["resource-links", { grouped: e.grouped }]),
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
      e.grouped ? (c(!0), h(z, { key: 1 }, te(S.value, (w) => (c(), H(ru, {
        key: w.model,
        model: w.model,
        count: w.count,
        rows: w.rows,
        "link-attribute": e.linkAttribute,
        "document-id": e.documentId,
        onOpen: D
      }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (c(!0), h(z, { key: 2 }, te(s.value, (w) => (c(), h("button", Le({
        key: `${w.endpoint.model}:${w.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, T(w), {
        disabled: _(w),
        onClick: (k) => D(w)
      }), [
        g("span", uu, $(w.endpoint.title), 1),
        g("span", du, [
          ee($(W(w)), 1),
          _(w) ? (c(), h(z, { key: 0 }, [
            ee(" · Unavailable")
          ], 64)) : O("", !0)
        ])
      ], 16, cu))), 128)),
      !s.value.length && !u.value && !d.value && e.empty ? (c(), h("p", fu, $(e.empty), 1)) : O("", !0),
      L(Qn, {
        more: !!i.value,
        loading: u.value,
        failure: d.value,
        label: A.value,
        onMore: q
      }, null, 8, ["more", "loading", "failure", "label"])
    ], 10, iu)) : O("", !0);
  }
}, mu = /* @__PURE__ */ Y(hu, [["__scopeId", "data-v-949d0a9f"]]), pu = (e, t, n) => Math.max(t, Math.min(n, e)), gu = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, yl = /* @__PURE__ */ new WeakMap(), vu = (e, t) => yl.set(e, t);
function yu(e, t) {
  for (let n = t; n; n = yl.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function bl(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !yu(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Be(() => window.removeEventListener("click", n));
}
const Ct = 8, bu = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = I(null), o = (p) => p ? `${p}px` : void 0, l = R(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), r = I({ w: 0, h: 0 }), i = I(a.anchor ? a.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (p) => ({
      left: Math.max(0, p.left),
      top: Math.max(0, p.top),
      right: Math.min(window.innerWidth, p.right),
      bottom: Math.min(window.innerHeight, p.bottom)
    }), f = (p) => {
      const x = p.closest(".pane, .float-window");
      return x ? d(x.getBoundingClientRect()) : u();
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
      return r.value.w <= M.across && r.value.h <= Math.max(M.below, M.above) ? x : u();
    }
    const S = R(() => {
      if (!i.value) return l.value;
      const p = i.value, x = y(p), M = v(x, p), { w: C, h: N } = r.value, Z = a.align === "auto" ? p.left + p.right > x.left + x.right : a.align === "right", ne = pu(Z ? p.right - C : p.left, x.left + Ct, Math.max(x.left + Ct, x.right - C - Ct)), fe = N > M.below && M.above > M.below ? { bottom: `${window.innerHeight - p.top + a.gap}px`, maxHeight: m(a.maxHeight, M.above) } : { top: `${p.bottom + a.gap}px`, maxHeight: m(a.maxHeight, M.below) };
      return { ...l.value, ...fe, left: `${ne}px`, maxWidth: m(a.maxWidth, M.across) };
    }), _ = n, T = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function W(p) {
      const x = T(), M = x.indexOf(document.activeElement);
      x[(M + p + x.length) % x.length].focus();
    }
    const J = { ArrowDown: () => W(1), ArrowUp: () => W(-1), Escape: () => _("close") }, D = (p) => J[p.key] && (p.preventDefault(), J[p.key]()), B = () => s.value && (r.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let q = 0;
    const A = new ResizeObserver(() => {
      cancelAnimationFrame(q), q = requestAnimationFrame(B);
    });
    bl(s, (p) => a.anchor && !a.anchor.contains(p.target) && _("close"));
    const E = (p, x) => ["top", "left", "right", "bottom"].some((M) => Math.abs(p[M] - x[M]) > 1), b = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let w = 0;
    function k() {
      if (a.anchor) {
        const p = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || b(p)) return _("close");
        E(p, i.value) && (i.value = p);
      }
      w = requestAnimationFrame(k);
    }
    return Re(() => {
      a.anchor && s.value && vu(s.value, a.anchor), B(), s.value && A.observe(s.value), !a.plain && T()[0] && T()[0].focus(), k();
    }), Be(() => {
      A.disconnect(), cancelAnimationFrame(w), cancelAnimationFrame(q);
    }), t({ element: s }), (p, x) => (c(), H(hs, {
      to: "body",
      disabled: !e.anchor
    }, [
      g("div", Le({
        ref_key: "panel",
        ref: s
      }, p.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: S.value,
        onKeydown: D
      }), [
        ue(p.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ea = /* @__PURE__ */ Y(bu, [["__scopeId", "data-v-3d203970"]]), wu = { class: "split-button" }, ku = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = I(null), s = I(!1), o = () => s.value = !1;
    return (l, r) => (c(), h("span", wu, [
      L(de, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: r[0] || (r[0] = (i) => n("main"))
      }, {
        default: j(() => [
          ue(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      g("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        L(de, {
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
          ue(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : O("", !0)
    ]));
  }
}, $u = /* @__PURE__ */ Y(ku, [["__scopeId", "data-v-c258494d"]]), xu = 0, Mu = "/api/lines", Su = "/api/line", eo = 5e3, to = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), no = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), ha = (e) => JSON.stringify(e.line), ao = () => new DOMException("cancelled", "AbortError");
class _u {
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
    this.timer ?? (this.timer = setTimeout(() => Me.whenFree(() => this.send()), xu));
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
      const o = await Me.sent(Mu, to({ lines: t.map((r) => r.body) }, n.signal), t.map((r) => no(r.body, Xe)), eo);
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
      const a = await Me.sent(Su, to(t.body, t.signal), [no(t.body, n)], n === Xe ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const wl = new _u(), Eu = "/api/window";
function Au(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${Eu}?${o}`, r = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, i = (u) => Me.whenFree(async () => {
    const d = await Me.sent(l, { signal: u, headers: r }, [{ window: e, line: l, kind: Xe }]);
    if (!d.ok) throw new Error((await d.json()).error);
    return d.json();
  });
  return Me.joined(`${e} ${n.join(",")} ${o}`, i, s);
}
const kl = /* @__PURE__ */ new Map();
class Cu {
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
function i4(e, t) {
  const n = new Cu(e, t);
  return kl.set(e, n), n.load().catch(() => {
  }), n;
}
const bs = (e) => kl.get(e);
function Ou(e, t, n) {
  const a = bs(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function Tu(e, t) {
  if (!e) return !0;
  const n = bs(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Ru = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let $l = {};
async function c4(e = (t) => Me.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && ($l = (await t.json()).states);
}
const ws = (e, t) => {
  var n;
  return (n = $l[e]) == null ? void 0 : n[t];
}, xl = (e, t) => {
  var n;
  return ((n = ws(e, t)) == null ? void 0 : n.label) ?? Ru(t);
}, Ml = (e, t) => {
  var n;
  return ((n = ws(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, Iu = (e, t) => {
  var n;
  return ((n = ws(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, Bu = Symbol("pane-page"), Lu = Symbol("inspector-host"), Sl = { 1: "refused", 2: "usage", 3: "fault" }, Nu = 100, Du = 50, ju = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, Pu = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function qu({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: r, options: i = I({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: m = "", tabs: v = [], sources: y = [], links: S = {}, search: _ = {}, readOnly: T = !1, shared: W = null }) {
  const J = /* @__PURE__ */ new Map(), D = new AbortController(), B = I(!1), q = performance.now();
  let A = 0, E = 0, b = () => {
  };
  const w = new Promise((N) => b = N);
  D.signal.addEventListener("abort", b, { once: !0 });
  const k = () => {
    clearTimeout(E), E = setTimeout(() => {
      A === 0 && ps(q, () => {
        B.value = !0, b();
      });
    }, Du);
  }, p = (N, Z) => (A += 1, Rt(e, N, t, D.signal, Z).finally(() => {
    A -= 1, k();
  })), x = (N, Z) => (k(), w.then(() => D.signal.aborted ? nt : Rt(e, N, t, D.signal, Z))), M = ({ only: N = [], state: Z = {} } = {}) => (A += 1, Wu(() => Au(e, t, N, Z, D.signal), D.signal).finally(() => {
    A -= 1, k();
  })), C = (N, { unbatched: Z = !1, deferred: ne = !1 } = {}) => {
    const ie = J.get(N);
    if (ie && performance.now() - ie.at < Nu) return ie.answer;
    const fe = ne && !B.value ? x(N, Z) : p(N, Z);
    return J.set(N, { answer: fe, at: performance.now() }), fe;
  };
  return {
    answered: B,
    settle: k,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: R(() => a()),
    permissions: s,
    autoScroll: m,
    tabs: v,
    sources: y,
    links: S,
    search: _,
    readOnly: T,
    shared: W,
    read: C,
    readKeys: M,
    waitForServer: () => vs() ? pl() : null,
    run: (N) => Rt(e, N, t, D.signal),
    upload: (N) => Uu(N, e, D.signal),
    cancel: () => D.abort(),
    signal: D.signal,
    subscriptions: l,
    follow: (N, Z) => l.follow(e, [N].flat().filter((ne) => o.some((ie) => ys(ie, ne))), (ne) => {
      J.clear(), Z(ne);
    }, a),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (N) => R(() => {
      var Z;
      return i.value[N] ?? ((Z = u.find((ne) => ne.key === N)) == null ? void 0 : Z.default);
    }),
    setting: async (N, Z) => {
      const ne = await C(`window setting ${e} ${N}`);
      return ne.ok ? ne.value.value : Z;
    },
    setOption: f,
    keep: (N, Z) => Rt(e, ["window", "save-setting", e, N, JSON.stringify(Z)], t, D.signal)
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
const Fu = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: Sl[e.code] || "fault", error: _l(e.error) };
async function Wu(e, t) {
  try {
    const n = await e();
    return t.aborted ? nt : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, Fu(s)])) } };
  } catch {
    return t.aborted ? nt : { ok: !1, failure: "unreachable", error: ks };
  }
}
async function Al(e, t, n) {
  const a = await El(() => wl.read(e, t, n), t);
  return a.failure !== "unreachable" || !vs() ? a : (await pl(), t.aborted ? nt : Al(e, t, n));
}
function Rt(e, t, n, a = void 0, s = !1) {
  return Me.held(() => Hu(e, t, n, a, s), Me.knownRead(Array.isArray(t) ? t : $s(t)));
}
async function Hu(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : $s(t), environment: n };
  return await Me.isRead(o.line) ? Me.joined(JSON.stringify(o), (l, r) => Al({ ...o, attribution: r }, l, s), a, o).catch(() => nt) : El(() => wl.write({ ...o, attribution: {
    client_id: Me.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function Uu(e, t, n = void 0) {
  try {
    const a = await Me.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? nt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? nt : { ok: !1, failure: "unreachable", error: ks };
  }
}
function $s(e) {
  return [...e.matchAll(ju)].map(([t]) => t.replace(Pu, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const zu = (e) => `show-${e}`, u4 = (e, t, n) => e.filter((a) => {
  var s;
  return n(zu((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), Cl = "messages.chat", Vu = {
  key: 0,
  class: "template-brief"
}, Gu = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Ku = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I([]), o = I(""), l = R(() => s.value.map((u) => ({ key: String(u.id), label: u.title, note: u.module }))), r = R(() => s.value.find((u) => String(u.id) === n.value));
    async function i() {
      const u = await Rt(Cl, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!u.ok) {
        o.value = u.error;
        return;
      }
      s.value = u.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), f = s.value.find((m) => m.title === d);
      f && a("pick", String(f.id));
    }
    return i(), (u, d) => (c(), h(z, null, [
      L(Nt, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (f) => a("pick", f))
      }, null, 8, ["options", "value"]),
      r.value ? (c(), h("p", Vu, $(r.value.brief), 1)) : O("", !0),
      o.value ? (c(), h("p", Gu, $(o.value), 1)) : O("", !0)
    ], 64));
  }
}, Yu = /* @__PURE__ */ Y(Ku, [["__scopeId", "data-v-14be8a5c"]]), Ju = { class: "form-field" }, Zu = { class: "form-field-head" }, Xu = ["for"], Qu = {
  key: 0,
  class: "form-field-aside"
}, ed = {
  key: 0,
  class: "form-field-help"
}, td = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", Ju, [
      g("div", Zu, [
        g("label", {
          class: "form-field-label",
          for: t.$props.for
        }, $(e.label), 9, Xu),
        t.$slots.aside ? (c(), h("span", Qu, [
          ue(t.$slots, "aside", {}, void 0, !0)
        ])) : O("", !0)
      ]),
      ue(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", ed, $(e.help), 1)) : O("", !0)
    ]));
  }
}, nd = /* @__PURE__ */ Y(td, [["__scopeId", "data-v-dd7cdcff"]]), Ya = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, ad = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Xn(), n = R(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Ye((c(), h("textarea", Le({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [P(Ya), P(t).value]
    ]);
  }
}), sd = /* @__PURE__ */ Y(ad, [["__scopeId", "data-v-e130a5b9"]]), od = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = fs(), o = R(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, r) => (c(), H(nd, {
      label: e.field.label,
      for: P(s),
      "data-button-field": e.field.name
    }, {
      default: j(() => [
        L(Pt, { value: o.value }, {
          choice: j(() => [
            L(Nt, {
              id: P(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: r[0] || (r[0] = (i) => a("pick", i))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: j(() => [
            L(Yu, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: r[1] || (r[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: j(() => [
            L(sd, {
              id: P(s),
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
    return (t, n) => (c(), H(de, {
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
function ld(e, t, n, a = () => window) {
  Re(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Be(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const rd = (e, t = () => !0) => ld("keydown", (n) => n.key === "Escape" && t() && e());
function Ol(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = I(!1), s = R(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return rd(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const id = 80, Ot = Zn([]);
function Tl(e) {
  const t = Symbol("layer"), n = () => Ot.includes(t) && Ot.splice(Ot.indexOf(t), 1);
  return he(
    e,
    (a) => {
      a && !Ot.includes(t) && Ot.push(t), a || n();
    },
    { immediate: !0 }
  ), Be(n), R(() => id + Math.max(0, Ot.indexOf(t)));
}
let Rl = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Rl = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const cd = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function ud(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(cd)];
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
const dd = ["aria-modal", "aria-label", "aria-labelledby"], fd = {
  key: 0,
  class: "dialog-head"
}, hd = ["id", "tabindex"], md = {
  key: 1,
  class: "dialog-foot"
}, pd = 500, gd = 400, vd = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Ol(a, n), r = Tl(s), i = I(null), u = I(null), d = I(null), f = fs(), m = I(!1), v = Date.now();
    n.modal && ud(u, () => a("escape"), d);
    function y() {
      if (!n.modal) return n.closable && o();
      m.value = !0, setTimeout(() => m.value = !1, gd);
    }
    function S(W) {
      !n.modal || Date.now() - v >= pd || ![" ", "Enter"].includes(W.key) || (W.preventDefault(), W.stopPropagation());
    }
    const _ = () => i.value && (i.value.scrollTop = i.value.scrollHeight), T = new MutationObserver(_);
    return he(i, (W) => {
      T.disconnect(), W && n.follow && (T.observe(W, { childList: !0, subtree: !0, characterData: !0 }), _());
    }), Be(() => T.disconnect()), (W, J) => (c(), H(hs, { to: "body" }, [
      L(jt, {
        name: "dialog",
        appear: "",
        onAfterLeave: P(l)
      }, {
        default: j(() => [
          P(s) ? (c(), h("div", {
            key: 0,
            class: X(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ge({ zIndex: P(r) }),
            onClick: $e(y, ["self"])
          }, [
            g("section", {
              ref_key: "panel",
              ref: u,
              class: X(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: m.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? P(f) : void 0,
              onKeydownCapture: S
            }, [
              e.bare ? O("", !0) : (c(), h("header", fd, [
                g("h3", {
                  id: P(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, $(e.title), 9, hd),
                e.closable ? (c(), H(xs, {
                  key: 0,
                  onClick: P(o)
                }, null, 8, ["onClick"])) : O("", !0)
              ])),
              g("div", {
                ref_key: "body",
                ref: i,
                class: X(["dialog-body", { bare: e.bare }])
              }, [
                ue(W.$slots, "default", {}, void 0, !0)
              ], 2),
              W.$slots.foot ? (c(), h("footer", md, [
                ue(W.$slots, "foot", {}, void 0, !0)
              ])) : O("", !0)
            ], 42, dd)
          ], 6)) : O("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Ms = /* @__PURE__ */ Y(vd, [["__scopeId", "data-v-6d1ecd98"]]), yd = {
  class: "action-output",
  "data-action-output": ""
}, bd = {
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
        g("pre", yd, $(e.text), 1)
      ]),
      _: 1
    }));
  }
}, wd = /* @__PURE__ */ Y(bd, [["__scopeId", "data-v-423a045c"]]);
function kd(e) {
  const t = document.body.appendChild(document.createElement("div")), n = fi(wd, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const $d = (e, t, n = {}) => $s(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function cn(e, t, n, a = {}) {
  var s;
  try {
    if (!await Tu(e.module, n)) return { ok: !1, error: "" };
    const o = await Rt(Cl, $d(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && kd(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const xd = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, ma = [
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
}, Md = ["secrets", "plugins"], Il = Object.keys(ta).filter((e) => !(cl && Md.includes(e)));
R(() => Il.map((e) => ({ name: e, ...ta[e] })));
const qt = (e) => ta[e], Bl = new Map(Il.flatMap((e) => [e, e.replace(/s$/, ""), ta[e].title.toLowerCase()].map((t) => [t, e]))), ct = (e) => Bl.get(String(e).toLowerCase()) || "", Ll = [...Bl.keys()].sort((e, t) => t.length - e.length).join("|"), Sd = {
  class: "button-form",
  "data-button-form": ""
}, _d = {
  key: 0,
  class: "button-form-title"
}, Ed = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, Ad = { class: "button-form-actions" }, Cd = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = I(!1), l = I(""), r = R(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), i = R(() => {
      var f;
      if (!n.row) return n.button.label;
      const d = ((f = qt(ct(n.row.noun))) == null ? void 0 : f.title) || "Item";
      return `${n.button.label} · ${d} ${n.row.id}`;
    });
    async function u() {
      if (o.value || !r.value) return;
      o.value = !0;
      const d = await cn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = d.ok ? "" : d.error, d.ok && (a("done"), a("close"));
    }
    return (d, f) => (c(), H(Ms, {
      title: i.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: f[1] || (f[1] = (m) => a("close"))
    }, {
      default: j(() => {
        var m;
        return [
          g("div", Sd, [
            (m = e.row) != null && m.title ? (c(), h("p", _d, $(e.row.title), 1)) : O("", !0),
            (c(!0), h(z, null, te(e.button.fields, (v) => (c(), H(od, {
              key: v.name,
              field: v,
              value: s.value[v.name],
              environment: e.environment,
              onPick: (y) => s.value[v.name] = y
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (c(), h("p", Ed, $(l.value), 1)) : O("", !0),
            g("div", Ad, [
              L(de, {
                small: "",
                onClick: f[0] || (f[0] = (v) => a("close"))
              }, {
                default: j(() => [...f[2] || (f[2] = [
                  ee("Cancel", -1)
                ])]),
                _: 1
              }),
              L(de, {
                variant: "primary",
                small: "",
                disabled: !r.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: u
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
}, Od = /* @__PURE__ */ Y(Cd, [["__scopeId", "data-v-f26c27a7"]]), Td = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Rd = {
  key: 1,
  class: "menu-item-text"
}, Id = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: X(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", Td, $(e.checked ? "✓" : ""), 1)) : O("", !0),
      e.description ? (c(), h("span", Rd, [
        g("span", null, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        g("small", null, $(e.description), 1)
      ])) : ue(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Mt = /* @__PURE__ */ Y(Id, [["__scopeId", "data-v-fec99974"]]), Bd = ["aria-busy"], Ld = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Nd = {
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
    const n = e, a = t, s = R(() => bs(n.environment)), o = R(
      () => {
        var y;
        return !n.readOnly && ((y = s.value) == null ? void 0 : y.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = R(() => {
      var y;
      return !n.readOnly && ((y = s.value) == null ? void 0 : y.failed.value);
    }), r = () => s.value.load().catch(() => {
    }), i = R(() => n.readOnly ? [] : Ou(n.environment, n.name, n.row)), u = I(null), d = I(""), f = I(!1), m = (y) => [y.from ? `From ${y.from}` : "", y.tip].filter(Boolean).join(" · ");
    async function v(y) {
      if (f.value || n.readOnly) return;
      if (y.fields.length) {
        u.value = y;
        return;
      }
      d.value = "", a("failure", ""), f.value = !0;
      const S = await cn(y, n.row, n.environment);
      f.value = !1, d.value = S.ok ? "" : S.error;
      const _ = y.label.toLowerCase() + (n.objectName && !y.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", S.ok ? "" : `Could not ${_}: ${S.error}`), S.ok && a("done");
    }
    return (y, S) => (c(), h("span", {
      class: X(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (c(), h(z, { key: 0 }, [
        S[3] || (S[3] = g("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        L(de, {
          small: "",
          onClick: r
        }, {
          default: j(() => [...S[2] || (S[2] = [
            ee("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : o.value ? O("", !0) : (c(), h(z, { key: 1 }, [
        (c(!0), h(z, null, te(i.value, (_) => (c(), h(z, {
          key: _.name
        }, [
          _.menu.length ? (c(), H($u, {
            key: 0,
            small: "",
            variant: _.primary ? "primary" : "ghost",
            disabled: f.value,
            "menu-label": _.menu_label || "More ways",
            title: m(_),
            "data-button": _.name,
            onMain: (T) => v(_)
          }, {
            menu: j(({ close: T }) => [
              (c(!0), h(z, null, te(_.menu, (W) => (c(), H(Mt, {
                key: W.label,
                description: W.description,
                onClick: (J) => (T(), v({ ..._, ...W, menu: [] }))
              }, {
                default: j(() => [
                  ee($(W.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: j(() => [
              ee($(_.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (c(), H(de, {
            key: 1,
            small: "",
            variant: _.primary ? "primary" : "ghost",
            bordered: !_.primary,
            icon: _.icon,
            disabled: f.value,
            title: m(_),
            "data-button": _.name,
            onClick: (T) => v(_)
          }, {
            default: j(() => [
              ee($(_.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        d.value && !e.readOnly && !e.externalFailure ? (c(), h("span", Ld, $(d.value), 1)) : O("", !0),
        u.value && !e.readOnly ? (c(), H(Od, {
          key: u.value.runs,
          button: u.value,
          row: e.row,
          environment: e.environment,
          onClose: S[0] || (S[0] = (_) => u.value = null),
          onDone: S[1] || (S[1] = (_) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : O("", !0)
      ], 64))
    ], 10, Bd));
  }
}, Dd = /* @__PURE__ */ Y(Nd, [["__scopeId", "data-v-a07b49a4"]]), jd = {
  class: "running",
  "data-running-command": ""
}, Pd = ["title"], qd = {
  key: "idle",
  class: "running-idle"
}, Fd = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", jd, [
      L(jt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: j(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, $(e.text), 9, Pd)) : (c(), h("span", qd, $(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, d4 = /* @__PURE__ */ Y(Fd, [["__scopeId", "data-v-d3240219"]]), Wd = ["aria-checked", "aria-label", "title"], Hd = {
  key: 0,
  class: "switch-inner"
}, Ud = {
  key: 0,
  class: "switch-word"
}, zd = {
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
        e.labelled ? (c(), h("span", Hd, $(e.word), 1)) : O("", !0),
        s[1] || (s[1] = g("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", Ud, $(e.word), 1)) : O("", !0)
    ], 10, Wd));
  }
}, f4 = /* @__PURE__ */ Y(zd, [["__scopeId", "data-v-1bfb90f3"]]);
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
function Vd(e, t) {
  return Nl(() => sessionStorage, e, t);
}
function Gd(e, t) {
  return Dl(() => sessionStorage, e, t);
}
const Pn = "journal.environment", Pl = I(Vd(Pn, jn(Pn, "")));
function Kd(e) {
  Pl.value = e, Gd(Pn, e), Ss(Pn, e);
}
const qn = I(location.hash), so = Ke(null), oo = { integrations: "mcp", library: "team" };
function Yd() {
  if (!so.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (oo[n]) {
    location.replace(`#/${[oo[n], ...a].join("/")}${t ? `?${t}` : ""}`), qn.value = location.hash;
    return;
  }
  !n || so.value(n) || (Kd(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), qn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  qn.value = location.hash, Yd();
});
const Ja = R(() => {
  const [e, t = ""] = qn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [r, i = ""] = l.split("@"), [u = "", d = "", f = ""] = r.split(":");
    return { table: u, id: Number(d), comment: Number(f) || 0, env: i };
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
function Jd(e = "", t = 0, n = "") {
  location.hash = _s.page(e, t, n);
}
const Zd = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function ql(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, r]) => `${l}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(Zd).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Bt = {};
function h4(e, t) {
  return Bt[e] = t, () => Bt[e] === t && delete Bt[e];
}
function Fl(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Bt[e]) != null && l.call(Bt, t))) return;
  const s = Ja.value.stack, o = s.findIndex((r) => r.table === e && r.id === t);
  ql([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function Xd(e, t, n, a = 0, s = "") {
  if (e === Ja.value.env) return Fl(t, n, a, s);
  const o = Ja.value.stack, l = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  ql([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function Fe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? Xd(a, s, Number(o), 0, t) : Fl(s, Number(o), 0, t);
}
function Qd(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function It(e) {
  const t = Qd(e);
  t && Fe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function m4(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const ef = { class: "inspector-part" }, tf = { class: "inspector-part-title" }, nf = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("section", ef, [
      g("h4", tf, $(e.title), 1),
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, p4 = /* @__PURE__ */ Y(nf, [["__scopeId", "data-v-0da7fa52"]]), af = {
  key: 1,
  class: "row-list-failure"
}, sf = ["data-row"], of = {
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
    const t = e, n = R(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = I(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (c(), H(_t, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", af, $(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), H(Qt, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: j(() => [
        ee($(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(z, { key: 3 }, [
      (c(), H(ht(e.arrival ? al : "ul"), Le(n.value, { class: "row-list" }), {
        default: j(() => [
          (c(!0), h(z, null, te(e.rows, (r) => (c(), h("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            ue(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, sf))), 128))
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
}, lf = /* @__PURE__ */ Y(of, [["__scopeId", "data-v-6c7ba696"]]), rf = {
  class: "agent-rows",
  "data-agent-rows": ""
}, cf = {
  key: 1,
  class: "agent-rows-note"
}, uf = {
  key: 2,
  class: "agent-rows-note"
}, df = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, ff = ["data-agent-row", "onClick"], hf = { class: "agent-row-name" }, mf = { class: "agent-row-state" }, pf = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = R(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (c(), h("div", rf, [
      e.loaded ? e.failure ? (c(), h("p", cf, $(e.failure), 1)) : e.rows.length ? (c(), h(z, { key: 3 }, [
        g("p", df, $(a.value) + " running", 1),
        (c(!0), h(z, null, te(n.value, (l) => (c(), h("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (r) => P(Fe)(`agents:${l.id}`)
        }, [
          g("span", hf, "#" + $(l.id) + " " + $(l.session), 1),
          g("span", mf, $(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, ff))), 128))
      ], 64)) : (c(), h("p", uf, $(e.none), 1)) : (c(), H(_t, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, g4 = /* @__PURE__ */ Y(pf, [["__scopeId", "data-v-a01e5a17"]]), gf = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: X(["badge", e.tone])
    }, $(e.text), 3));
  }
}, Wl = /* @__PURE__ */ Y(gf, [["__scopeId", "data-v-9e7e1157"]]), vf = ["aria-valuenow", "aria-valuemax"], yf = {
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
    const t = e, n = R(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
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
    ], 10, vf));
  }
}, bf = /* @__PURE__ */ Y(yf, [["__scopeId", "data-v-9eba6a85"]]), wf = { class: "bars" }, kf = { class: "bar-name" }, $f = { class: "bar-value" }, xf = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = R(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, r) => (c(), h("div", wf, [
      (c(!0), h(z, null, te(e.items, (i, u) => (c(), H(ht(i.open ? "button" : "div"), {
        key: `${u}-${i.label}`,
        type: i.open ? "button" : void 0,
        class: X(["bar-row", i.tone, { opens: i.open }]),
        onClick: (d) => i.open && a("open", i.open)
      }, {
        default: j(() => [
          g("span", kf, $(i.label), 1),
          L(bf, {
            value: Number(i.value) || 0,
            max: s.value,
            tone: i.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          g("span", $f, $(i.value) + $(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Mf = /* @__PURE__ */ Y(xf, [["__scopeId", "data-v-663427f4"]]), Sf = { class: "bars" }, _f = {
  key: 0,
  class: "bars-title"
}, Ef = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", Sf, [
      e.node.title ? (c(), h("span", _f, $(e.node.title), 1)) : O("", !0),
      L(Mf, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Af = /* @__PURE__ */ Y(Ef, [["__scopeId", "data-v-7135bb11"]]), Cf = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = R(() => n[a.node.type](a.node));
    return (l, r) => (c(), h("div", {
      class: X([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ge(o.value)
    }, [
      (c(!0), h(z, null, te(e.node.children || [], (i, u) => (c(), H(ar, {
        key: u,
        node: i,
        onOpen: r[0] || (r[0] = (d) => s("open", d)),
        onFile: r[1] || (r[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Tn = /* @__PURE__ */ Y(Cf, [["__scopeId", "data-v-d142a3f4"]]), Of = {
  key: 0,
  class: "card-head"
}, Tf = { class: "card-title" }, Rf = {
  key: 0,
  class: "card-note"
}, If = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", {
      class: X(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", Of, [
        g("span", Tf, $(e.node.title), 1),
        e.node.note ? (c(), h("span", Rf, $(e.node.note), 1)) : O("", !0)
      ])) : O("", !0),
      L(Tn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Bf = /* @__PURE__ */ Y(If, [["__scopeId", "data-v-67b72d40"]]), Lf = { processes: "process", memories: "memory", replies: "reply" }, Fn = (e) => (Lf[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), Za = [], Nf = 2e3, lt = /* @__PURE__ */ new Map(), Df = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, jf = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Et(e, { first: t = !1 } = {}) {
  t ? Za.unshift(e) : Za.push(e), lt.clear();
}
function Hl(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Pf = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, qf = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function tt(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Ff(e, t) {
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
  return Wf(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Wf(e) {
  return e.split(jf).map((t, n) => n % 2 ? t : t.replace(Df, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function lo(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const Hf = 24;
function Uf(e) {
  const [t, , ...n] = e, a = lo(t), s = n.map(lo), o = (i) => [a, ...s].some((u) => (u[i] ?? "").length > Hf) ? ' class="text-column"' : "", l = a.map((i, u) => `<th${o(u)}>${en(i)}</th>`).join(""), r = s.map((i) => `<tr>${i.map((u, d) => `<td${o(d)}>${en(u)}</td>`).join("")}</tr>`).join("");
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
function zf(e, t) {
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
      const r = t.findIndex((u, d) => d > a && /^(```|~~~)/.test(u)), i = r < 0 ? t.length : r;
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
      n.push(Uf(t.slice(a, r))), a = r;
      continue;
    }
    if (Ul.test(s)) {
      const r = zf(t, a);
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
const Vf = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Gf = (e) => e.type !== "text" && !Vf.test(e.html);
function Kf(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(Vl(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : Gf(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function Yf(e, t = { env: "" }) {
  const n = qf(e, t), a = lt.get(n);
  if (lt.delete(n), a && a.source === t.source && a.reads.every((l) => Pf(l, t)))
    return lt.set(n, a), a.html;
  const s = [], o = Kf(Ff(e, { ...t, reads: s }));
  return lt.set(n, { html: o, reads: s, source: t.source }), lt.size > Nf && lt.delete(lt.keys().next().value), o;
}
const pa = /* @__PURE__ */ new WeakMap();
function Jf(e) {
  if (pa.has(e)) return pa.get(e);
  const t = hi(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (u, d) => `${u}:${d}`;
  function o(u, d) {
    const f = s(u, d), m = e.read(`${Fn(u)} show ${d}`);
    n.set(f, m), m.then((v) => {
      n.get(f) === m && (n.delete(f), t.set(f, v.ok ? { ...v.value, table: u } : null));
    });
  }
  function l(u) {
    a.has(u) || (a.add(u), e.follow([`${Fn(u).replace(/-/g, "_")}.*`], (d) => {
      const f = `${u}:`;
      for (const m of t.keys()) {
        if (!m.startsWith(f)) continue;
        const v = Number(m.slice(f.length));
        (!d.row_id || d.row_id === v) && o(u, v);
      }
    }));
  }
  function r(u, d) {
    l(u);
    const f = s(u, d);
    return !t.has(f) && !n.has(f) && o(u, d), t.get(f);
  }
  const i = { id: Symbol("window text rows"), row: r };
  return pa.set(e, i), i;
}
function Gl() {
  const e = Oe(Ne, null), t = e ? Jf(e) : null;
  return (n, a = {}) => Yf(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Kl = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, un = (e) => String(e || "").replace(Kl, (t, n, a, s) => s), Zf = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), $n = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Xf = /^Traceback \(most recent call last\):/m, Qf = 8;
function Yl(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Qf).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function eh(e) {
  const t = [...e.matchAll(Zf)].map((a) => a.index);
  if ($n.lastIndex = 0, !t.length || !$n.test(e)) return null;
  $n.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll($n)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((r) => r[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Yl(n), tail: "" } : null;
}
function th(e) {
  const t = Xf.exec(e);
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
  const t = un(e), n = th(t) || eh(t);
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
}, nh = (e) => (fo[e.table] ? fo[e.table](e) : e.title || "") || "", St = (e) => Wn(e.created_at), Zl = (e) => Wn(e.updated_at) || St(e), ah = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, sh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function oh(e) {
  const t = ah.exec(e);
  if (t && ct(t[1])) return { at: t.index, length: t[0].length, table: ct(t[1]), id: Number(t[2]), label: t[3] };
  const n = sh.exec(e), a = n && ct(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function lh(e, t, n, a) {
  const s = Hl(a, e, t), o = un(s ? nh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${tt(qt(e).title)} ${t}</span><span class="row-card-title">${tt(o)}</span></a>`;
}
Et(
  (e, t) => {
    const n = oh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: lh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const rh = /\.(png|jpe?g|gif|webp|svg)$/i, ih = (e) => rh.test(e), ch = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, uh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function dh(e, t) {
  const n = ch.exec(e), [, a, s, o, l, r] = n || [], i = n && ct(a || o), u = i && Hl(t, i, Number(s || l));
  if (i !== "messages" || !u || !(u.files || []).includes(r)) return null;
  const d = `/api/files/message/${u.id}/${encodeURIComponent(r)}`, f = `${qt(i).title} ${u.id} · ${tt(r)}`, m = ih(r) ? `<img class="file-card-image" src="${d}" alt="${tt(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${tt(r)}">${m}<span class="file-card-name">${f}</span></a>` };
}
function fh(e) {
  const t = uh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${tt(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Et(
  (e, t) => {
    if (t.inline) return null;
    const n = dh(e, t) || fh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const hh = /`([^`\n]+)`/g;
Et((e) => e.replace(hh, (t, n) => `<code>${n}</code>`));
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
const mh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Xl = new RegExp(`\\b(${Ll}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Ql = new RegExp(`\\b(${Ll}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), ph = new RegExp(`<code>((?:${Xl.source}|${Ql.source}))</code>`, "gi"), gh = (e) => e.replace(ph, "$1"), vh = (e, t) => `<a class="row-pill" href="#" data-peek="${ct(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, yh = (e) => e.replace(Ql, (t, n, a) => a.replace(/\d+/g, (s) => vh(n.replace(/s$/i, ""), s))), bh = (e) => yh(e).replace(
  Xl,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${ct(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Et(
  (e, t) => t.rowNames === !1 ? e : gh(e).split(mh).map((n, a) => a % 2 ? n : bh(n)).join("")
);
const wh = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, kh = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, $h = /[\w\]]\(/, xh = /^[\w$.[\]'"]+\s*=\s*[^=]/, Mh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Sh = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, _h = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Eh = /[[({,]$/, Ah = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Ch = /^(\t|\s{2,})\S/, Oh = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Th = /`[^`]+`/, Rh = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Ih = /[{}()[\];=<>$&|*\\@+^~%]/g, er = /^\s*(?:[-*+]|\d+[.)])\s/, Bh = /^\s*>/, Lh = /^\s*\|/, Nh = 0.6, Dh = 0.4, jh = 5, Ph = 0.03, tr = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= jh && t.every((n) => Rh.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Ih) ?? []).length / e.length < Ph;
}, va = (e) => {
  const t = e.trim();
  return Th.test(t) ? !1 : [wh, kh, $h, xh, Mh, Sh, _h, Eh, Ah].some((n) => n.test(t)) || /[;{}]$/.test(t) || Ch.test(e) && !er.test(e) && !tr(e);
};
function qh(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || er.test(t[0]) || t.every((o) => Bh.test(o) || Lh.test(o))) return "text";
  const n = t.filter((o) => !Oh.test(o.trim()));
  if (t.length === 1) return !n.length || va(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(va).length, s = n.filter((o) => !va(o) && tr(o)).length;
  return a >= n.length * Nh && s <= n.length * Dh ? "code" : "text";
}
const Qa = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Fh = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Wh = `${Qa} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Hh = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Uh = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", mo = {
  js: { keywords: Qa, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Fh, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Wh, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Qa, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Hh, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Uh, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, zh = {
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
function Vh(e, t) {
  const n = mo[zh[t] ?? t] || mo.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
  let o = 0;
  const l = (r, i) => i && s.push({ type: r, value: i });
  for (; o < e.length; ) {
    const r = e[o];
    if (n.markdown) {
      const u = e.indexOf(`
`, o), d = e.slice(o, u < 0 ? e.length : u);
      l(
        /^#{1,6}\s/.test(d) ? "keyword" : /^(```|~~~)/.test(d) ? "comment" : /^\s*([-*+]|\d+\.)\s/.test(d) ? "number" : "plain",
        d
      ), l("plain", u < 0 ? "" : `
`), o = u < 0 ? e.length : u + 1;
      continue;
    }
    if (po(e, o, n.line) || n.hash && r === "#") {
      const u = e.indexOf(`
`, o);
      l("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && po(e, o, n.block[0])) {
      const u = e.indexOf(n.block[1], o + n.block[0].length), d = u < 0 ? e.length : u + n.block[1].length;
      l("comment", e.slice(o, d)), o = d;
      continue;
    }
    const i = (n.triple || []).find((u) => e.startsWith(u, o));
    if (i) {
      const u = e.indexOf(i, o + 3), d = u < 0 ? e.length : u + 3;
      l("string", e.slice(o, d)), o = d;
      continue;
    }
    if (n.quotes.includes(r)) {
      let u = o + 1;
      for (; u < e.length && e[u] !== r && (r === "`" || e[u] !== `
`); ) u += e[u] === "\\" ? 2 : 1;
      l(n.keyed && /^\s*:/.test(e.slice(u + 1)) ? "property" : "string", e.slice(o, u + 1)), o = u + 1;
      continue;
    }
    if (n.tags && r === "<" && /[A-Za-z/!?]/.test(e[o + 1] || "")) {
      const u = e.slice(o).match(/^<\/?[\w:-]+/);
      l("keyword", u[0]), o += u[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(r)) {
      const d = e.slice(o).match(/^[\w$]+/)[0], f = n.lower ? d.toLowerCase() : d, m = n.property && /^\s*:/.test(e.slice(o + d.length));
      l(a.has(f) ? "keyword" : m ? "property" : /^[A-Z]/.test(d) && t !== "text" ? "type" : "plain", d), o += d.length;
      continue;
    }
    if (/\d/.test(r)) {
      const u = e.slice(o).match(/^(0x[\da-fA-F]+|\d[\d_]*(\.\d+)?([eE][+-]?\d+)?)/);
      l("number", u[0]), o += u[0].length;
      continue;
    }
    if (n.tags && (r === ">" || e.startsWith("/>", o))) {
      const u = r === ">" ? 1 : 2;
      l("keyword", e.slice(o, o + u)), o += u;
      continue;
    }
    l("plain", r), o += 1;
  }
  return s;
}
function Gh(e, t) {
  const n = [""];
  for (const { type: a, value: s } of Vh(e, t))
    s.split(`
`).forEach((l, r) => {
      r && n.push(""), l && (n[n.length - 1] += a === "plain" ? tt(l) : `<span class="tok-${a}">${tt(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Kh(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Yh = 1500, go = /* @__PURE__ */ new WeakMap();
async function Jh(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Kh(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(go.get(t)), go.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Yh)
  )));
}
typeof document < "u" && document.addEventListener("click", Jh, !0);
const Zh = /\n\s*\n/, Xh = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, Qh = /^\s*(`{3,}|~{3,})\s*$/, em = /^\s{4,}\S/, tm = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, es = /^\s*(?:[-*+]|\d+[.)])\s/, nr = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, nm = [
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
function am(e) {
  const t = Es(e.join(`
`));
  return (nm.find(([, n]) => n.test(t)) || ["text"])[0];
}
const sm = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && nr.test(t) && !es.test(t);
}, om = (e, t) => es.test(t) || es.test([...e].reverse().find((n) => n.trim()) || "");
function As(e, t) {
  const n = t || am(e), a = Gh(Es(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function lm(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && Qh.test(s));
  return a < 0 ? e.length : a;
}
function rm(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return As(a.map(un), n ? n.toLowerCase() : "");
}
function im(e) {
  const t = e.split(Zh).map((l) => ({ paragraph: l, type: qh(Es(l).split(`
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
function cm(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : im(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const r = n[l].match(Xh);
    if (r) {
      const u = lm(n, l, r[2]);
      o(), a.push(rm(n.slice(l + 1, u), r[1], r[3])), l = u + 1;
      continue;
    }
    const i = sm(s) ? tm : em;
    if (!t && i.test(n[l]) && !om(s, n[l])) {
      let u = l;
      for (; u < n.length && (i.test(n[u]) || !n[u].trim()); ) u += 1;
      for (; u > l && !n[u - 1].trim(); ) u -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && nr.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (u - l + d.length >= 2) {
        o(), a.push(As([...d, ...n.slice(l, u)].map(un), "")), l = u;
        continue;
      }
      s.push(...d);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Et((e, t) => cm(e, t.document), { first: !0 });
const um = ["innerHTML"], dm = ["innerHTML"], fm = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Gl(), a = R(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => P(It) && P(It)(...l)),
      innerHTML: a.value
    }, null, 8, um)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => P(It) && P(It)(...l)),
      innerHTML: a.value
    }, null, 8, dm));
  }
}, kt = /* @__PURE__ */ Y(fm, [["__scopeId", "data-v-d8e75741"]]), hm = { class: "fact" }, mm = { class: "fact-label" }, pm = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", hm, [
      g("span", mm, $(e.label), 1),
      L(kt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, gm = /* @__PURE__ */ Y(pm, [["__scopeId", "data-v-3a88ecf8"]]), vm = { class: "list" }, ym = { class: "list-label" }, bm = {
  key: 1,
  class: "list-note"
}, wm = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", vm, [
      (c(!0), h(z, null, te(e.items, (o, l) => (c(), H(ht(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: X(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: j(() => [
          g("span", ym, $(o.label), 1),
          o.badge ? (c(), H(Wl, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : O("", !0),
          o.note ? (c(), h("span", bm, $(o.note), 1)) : O("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, km = /* @__PURE__ */ Y(wm, [["__scopeId", "data-v-ebe2ae0a"]]), $m = { class: "table" }, xm = {
  key: 0,
  class: "table-row empty"
}, Mm = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (c(), h("div", $m, [
      g("div", {
        class: "table-row head",
        style: ge(s.value)
      }, [
        (c(!0), h(z, null, te(e.columns, (r) => (c(), h("span", {
          key: r,
          class: "cell"
        }, $(r), 1))), 128))
      ], 4),
      (c(!0), h(z, null, te(e.rows, (r, i) => (c(), H(ht(r.open ? "button" : "div"), {
        key: i,
        type: r.open ? "button" : void 0,
        class: X(["table-row", r.tone, { opens: r.open }]),
        style: ge(s.value),
        onClick: (u) => r.open && a("open", r.open)
      }, {
        default: j(() => [
          (c(!0), h(z, null, te(r.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, $(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", xm, $(e.empty), 1)) : O("", !0)
    ]));
  }
}, Sm = /* @__PURE__ */ Y(Mm, [["__scopeId", "data-v-9326a52e"]]), _m = { class: "stat-value" }, Em = { class: "stat-label" }, Am = {
  key: 0,
  class: "stat-note"
}, Cm = {
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
        g("span", _m, $(e.value), 1),
        g("span", Em, $(e.label), 1),
        e.note ? (c(), h("span", Am, $(e.note), 1)) : O("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Om = /* @__PURE__ */ Y(Cm, [["__scopeId", "data-v-ad0db6d6"]]), Tm = { class: "code" }, Rm = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
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
        L(Bf, {
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
        L(Om, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (r) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: j(() => [
        L(Af, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: j(() => [
        L(Sm, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: j(() => [
        L(km, {
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
        L(gm, {
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
        g("pre", Tm, [
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
}), ar = /* @__PURE__ */ Y(Rm, [["__scopeId", "data-v-cbdcf540"]]), Im = { class: "dashboard" }, Bm = { class: "trail" }, Lm = ["onClick"], Nm = {
  key: 0,
  class: "gone",
  role: "status"
}, Dm = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (m) => m in (n.document.pages || {}), o = I(!!n.page && !s(n.page)), l = I(n.page && !o.value ? [n.page] : []), r = R(() => l.value.at(-1) || n.document.start), i = R(() => (n.document.pages || {})[r.value] || null), u = (m) => ((n.document.pages || {})[m] || {}).title || m, d = (m) => {
      o.value = !1, l.value = [...l.value, m];
    }, f = (m) => {
      o.value = !1, l.value = l.value.slice(0, m);
    };
    return he(
      () => n.document.start,
      () => l.value = []
    ), (m, v) => (c(), h("div", Im, [
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
      })) : i.value ? (c(), h(z, { key: 2 }, [
        g("nav", Bm, [
          g("button", {
            type: "button",
            class: X(["step", { current: !l.value.length }]),
            onClick: v[0] || (v[0] = (y) => f(0))
          }, $(u(e.document.start)), 3),
          (c(!0), h(z, null, te(l.value, (y, S) => (c(), h(z, {
            key: `${S}-${y}`
          }, [
            v[2] || (v[2] = g("span", { class: "sep" }, "/", -1)),
            g("button", {
              type: "button",
              class: X(["step", { current: S === l.value.length - 1 }]),
              onClick: (_) => f(S + 1)
            }, $(u(y)), 11, Lm)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", Nm, "What you opened is no longer in this dashboard. Here is its start page.")) : O("", !0),
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
                onOpen: d,
                onFile: v[1] || (v[1] = (y) => a("file", y))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : O("", !0)
    ]));
  }
}, jm = /* @__PURE__ */ Y(Dm, [["__scopeId", "data-v-fbe83734"]]), sr = {
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
function Pm(e, t) {
  const n = We(), a = gl(e, sr.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Re(e), ft(() => {
    s(), a.cancel();
  });
}
const qm = {
  key: 0,
  class: "window-failure"
}, Fm = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = We(), o = I(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? Pm(l, n.events) : gs(l, () => !0, sr.documentWithNoEvents), (r, i) => o.value && !o.value.ok ? (c(), h("p", qm, $(o.value.error), 1)) : o.value ? (c(), H(jm, {
      key: 1,
      document: o.value.value,
      onFile: i[0] || (i[0] = (u) => a("file", u))
    }, null, 8, ["document"])) : O("", !0);
  }
}, ot = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, qe = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Pe = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Wm = 6;
function Cs(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Hm = (e) => {
  const t = Cs(e, ot.lineChars), n = Math.max(ot.minWidth, Math.max(...t.map((a) => a.length)) * ot.charWidth + ot.padX * 2);
  return { name: e, lines: t, line: ot.line, padY: ot.padY, width: n, height: t.length * ot.line + ot.padY * 2 };
};
function Um(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((r, i) => {
      if (r[0] !== l) return;
      const u = s.get(r[1]);
      u === "open" ? a.add(i) : u || o(r[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function zm(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function Vm(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var r;
    return (a[r = n.get(l)] || (a[r] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((r, i) => [r, i]))), o = (l, r) => {
    const i = s(), u = (d) => {
      const f = r(d).map((m) => i.get(m));
      return f.length ? f.reduce((m, v) => m + v, 0) / f.length : i.get(d);
    };
    return [...l].sort((d, f) => u(d) - u(f));
  };
  for (let l = 0; l < Wm; l++) {
    const r = l % 2 === 0, i = a.map((u, d) => d);
    (r ? i.slice(1) : i.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((m) => m[r ? 1 : 0] === f).map((m) => m[r ? 0 : 1]);
      a[u] = o(a[u], d);
    });
  }
  return a;
}
function Gm(e, t) {
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
function Km(e) {
  const t = [...new Set(e.flatMap(([D, B]) => [D, B]))], n = new Set(e.map(([, D]) => D)), a = t.filter((D) => !n.has(D)), s = Um(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((D, B) => !s.has(B)), l = zm(t, o), r = Vm(t, o, l), i = new Map(t.map((D) => [D, Hm(D)])), u = r.map((D) => D.reduce((B, q) => B + i.get(q).width, 0) + Pe.across * (D.length - 1)), d = Math.max(...u) + Pe.margin * 2, f = Jm(e, l, r.length), m = /* @__PURE__ */ new Map();
  let v = Pe.margin;
  r.forEach((D, B) => {
    let q = (d - u[B]) / 2;
    const A = Math.max(...D.map((E) => i.get(E).height));
    D.forEach((E) => {
      const b = i.get(E);
      m.set(E, { ...b, x: q, y: v + (A - b.height) / 2 }), q += b.width + Pe.across;
    }), v += A + (f[B] ?? Pe.down);
  });
  const y = e.map(([D, B, q], A) => ({ from: D, to: B, label: q || "", back: s.has(A) || l.get(B) <= l.get(D) }));
  Gm(y, m);
  const S = y.map((D) => Zm(D, m.get(D.from), m.get(D.to))), _ = [...m.values()], T = t1(S, _), W = Math.max(v - Pe.down, ...T.filter((D) => D.label).map((D) => D.label.y + D.label.height));
  return { width: Math.max(d - Pe.margin, ...T.filter((D) => D.label).map((D) => D.label.x + D.label.width)) + Pe.margin, height: W + Pe.margin, nodes: _, arrows: T };
}
const Ym = (e) => e ? Cs(e, qe.lineChars).length * qe.line + qe.pad * 2 : 0;
function Jm(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Pe.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [r, i] = [t.get(s), t.get(o)].sort((u, d) => u - d);
    i > r && (a[r + Math.floor((i - r - 1) / 2)] += Ym(l) + Pe.labelSpace);
  }), a.map((s) => Math.max(Pe.down, s));
}
function Zm(e, t, n) {
  const a = e.label ? Cs(e.label, qe.lineChars) : [], s = a.length ? Math.max(...a.map((m) => m.length)) * qe.charWidth + qe.pad * 2 : 0, o = a.length * qe.line + (a.length ? qe.pad * 2 : 0), l = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - r) / 2, f = [{ x: l, y: r }, { x: l, y: r + d }, { x: i, y: u - d }, { x: i, y: u }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: f, path: `M${l} ${r} C${l} ${r + d} ${i} ${u - d} ${i} ${u}` };
}
const Xm = ([e, t, n, a], s) => {
  const o = 1 - s, l = (r) => o * o * o * e[r] + 3 * o * o * s * t[r] + 3 * o * s * s * n[r] + s * s * s * a[r];
  return { x: l("x"), y: l("y") };
}, Qm = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], e1 = [0, -1, 1, -2, 2, -3, 3].map((e) => e * qe.line);
function t1(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, u) => {
      const d = Xm(a.curve, i);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + u, width: a.labelWidth, height: a.labelHeight };
    }, r = e1.flatMap((i) => Qm.map((u) => s(u, i))).find((i) => !n.some((u) => vo(i, u))) ?? s(0.5, 0);
    for (; n.some((i) => vo(r, i)); ) r.y += qe.line;
    return n.push(r), { ...a, label: { ...r, lines: a.lines, line: qe.line, pad: qe.pad } };
  });
}
const vo = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, n1 = { class: "flowchart-tools" }, a1 = ["width", "height", "viewBox", "aria-label"], s1 = ["d"], o1 = ["x", "y", "width", "height"], l1 = ["x", "y"], r1 = ["x", "dy"], i1 = {
  key: 0,
  class: "flowchart-label"
}, c1 = ["x", "y", "width", "height"], u1 = ["x", "y"], d1 = ["x", "dy"], f1 = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => Km(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = I(null), r = I({ zoom: 1, x: 0, y: 0 });
    let i = null;
    function u() {
      var T;
      const S = (T = l.value) == null ? void 0 : T.getBoundingClientRect();
      if (!(S != null && S.width)) return;
      const _ = Math.min(S.width / s.value.width, S.height / s.value.height, 1.5);
      r.value = { zoom: _, x: (S.width - s.value.width * _) / 2, y: (S.height - s.value.height * _) / 2 };
    }
    function d(S, _, T) {
      const { zoom: W, x: J, y: D } = r.value, B = Math.min(o.most, Math.max(o.least, W * S));
      r.value = { zoom: B, x: _ - (_ - J) * B / W, y: T - (T - D) * B / W };
    }
    function f(S) {
      const _ = l.value.getBoundingClientRect();
      d(S, _.width / 2, _.height / 2);
    }
    function m(S) {
      const _ = l.value.getBoundingClientRect();
      S.ctrlKey || S.metaKey ? d(S.deltaY < 0 ? o.step : 1 / o.step, S.clientX - _.left, S.clientY - _.top) : r.value = { ...r.value, x: r.value.x - S.deltaX, y: r.value.y - S.deltaY };
    }
    function v(S) {
      var _, T, W;
      S.preventDefault(), (_ = window.getSelection()) == null || _.removeAllRanges(), i = { x: S.clientX - r.value.x, y: S.clientY - r.value.y }, (W = (T = l.value).setPointerCapture) == null || W.call(T, S.pointerId);
    }
    function y(S) {
      i && (r.value = { ...r.value, x: S.clientX - i.x, y: S.clientY - i.y });
    }
    return Re(u), (S, _) => (c(), H(Ms, {
      title: e.title,
      large: "",
      onClose: _[4] || (_[4] = (T) => a("close"))
    }, {
      default: j(() => [
        g("div", n1, [
          L(de, {
            small: "",
            onClick: _[0] || (_[0] = (T) => f(o.step))
          }, {
            default: j(() => [..._[5] || (_[5] = [
              ee("Zoom in", -1)
            ])]),
            _: 1
          }),
          L(de, {
            small: "",
            onClick: _[1] || (_[1] = (T) => f(1 / o.step))
          }, {
            default: j(() => [..._[6] || (_[6] = [
              ee("Zoom out", -1)
            ])]),
            _: 1
          }),
          L(de, {
            small: "",
            onClick: u
          }, {
            default: j(() => [..._[7] || (_[7] = [
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
          onPointerup: _[2] || (_[2] = (T) => Vs(i) ? i.value = null : i = null),
          onPointercancel: _[3] || (_[3] = (T) => Vs(i) ? i.value = null : i = null)
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
            _[8] || (_[8] = g("defs", null, [
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
            (c(!0), h(z, null, te(s.value.arrows, (T, W) => (c(), h("path", {
              key: `arrow-${W}`,
              class: "flowchart-arrow",
              d: T.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, s1))), 128)),
            (c(!0), h(z, null, te(s.value.nodes, (T) => (c(), h("g", {
              key: T.name,
              class: "flowchart-node"
            }, [
              g("rect", {
                x: T.x,
                y: T.y,
                width: T.width,
                height: T.height,
                rx: "8"
              }, null, 8, o1),
              g("text", {
                x: T.x + T.width / 2,
                y: T.y + T.padY + T.line / 2
              }, [
                (c(!0), h(z, null, te(T.lines, (W, J) => (c(), h("tspan", {
                  key: J,
                  x: T.x + T.width / 2,
                  dy: J ? T.line : 0
                }, $(W), 9, r1))), 128))
              ], 8, l1)
            ]))), 128)),
            (c(!0), h(z, null, te(s.value.arrows, (T, W) => (c(), h(z, {
              key: `label-${W}`
            }, [
              T.label ? (c(), h("g", i1, [
                g("rect", {
                  x: T.label.x,
                  y: T.label.y,
                  width: T.label.width,
                  height: T.label.height,
                  rx: "4"
                }, null, 8, c1),
                g("text", {
                  x: T.label.x + T.label.width / 2,
                  y: T.label.y + T.label.pad + T.label.line / 2
                }, [
                  (c(!0), h(z, null, te(T.label.lines, (J, D) => (c(), h("tspan", {
                    key: D,
                    x: T.label.x + T.label.width / 2,
                    dy: D ? T.label.line : 0
                  }, $(J), 9, d1))), 128))
                ], 8, u1)
              ])) : O("", !0)
            ], 64))), 128))
          ], 12, a1))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, h1 = /* @__PURE__ */ Y(f1, [["__scopeId", "data-v-51d24cfe"]]), yo = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', bo = {
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
}, m1 = ["innerHTML"], p1 = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => bo[t.name] || bo.dot);
    return (a, s) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, m1));
  }
}, dt = /* @__PURE__ */ Y(p1, [["__scopeId", "data-v-beb5935c"]]), g1 = {
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
}, xt = /* @__PURE__ */ Y(g1, [["__scopeId", "data-v-d03899bb"]]), v1 = ["data-tip", "aria-label"], y1 = {
  key: 0,
  class: "mact-word"
}, b1 = {
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
      e.open ? (c(), h("span", y1, $(e.label), 1)) : O("", !0),
      n[0] || (n[0] = g("span", { class: "hit" }, null, -1))
    ], 10, v1));
  }
}, or = /* @__PURE__ */ Y(b1, [["__scopeId", "data-v-3b292e09"]]), lr = 120, Rn = 280, rr = 160, w1 = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, k1 = ["leaving", "resizing", "entering"];
function ts(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function $1(e) {
  const t = k1.filter((a) => e.classList.contains(a));
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
    const v = $1(f);
    l(f, m), f.offsetWidth, f.style.transition = `width ${Rn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Rn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(f, v);
  }
  function u(f) {
    const m = f.querySelector(":scope > :not(.top)");
    if (!m || typeof ResizeObserver > "u") return null;
    let v = m.offsetHeight;
    const y = new ResizeObserver(() => {
      m.offsetHeight !== v && (v = m.offsetHeight, i(f, ts(f)));
    });
    return y.observe(m), y;
  }
  async function d(f) {
    const m = e.value, v = ++o;
    if (!m || !m.offsetWidth || w1()) {
      a.value = f;
      return;
    }
    const y = ts(m);
    if (l(m, y), s.value = "leaving", await n(lr), v !== o) return;
    a.value = f, s.value = "resizing", await mt(), i(m, y);
    const S = u(m);
    await n(Rn), S == null || S.disconnect(), v === o && (r(m), s.value = "entering", await n(rr), v === o && (s.value = ""));
  }
  return he(t, (f) => d(f)), ft(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const x1 = { class: "growing-card-top" }, M1 = ["aria-expanded"], S1 = { class: "growing-card-avatar" }, _1 = { class: "growing-card-title" }, E1 = { class: "growing-card-more" }, A1 = { class: "growing-card-body" }, C1 = {
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
    const n = e, a = t, s = I(!1), o = I(null), { folded: l, phase: r } = ir(o, () => !s.value), i = R(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = R(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: X(["growing-card-wrap", P(r), { open: !P(l), bad: e.bad, incoming: e.incoming }])
    }, [
      g("div", x1, [
        g("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: f[0] || (f[0] = (m) => s.value = !s.value)
        }, [
          g("span", S1, [
            e.bad ? (c(), H(dt, {
              key: 0,
              name: "cross"
            })) : i.value ? (c(), h(z, { key: 1 }, [
              ee($(i.value), 1)
            ], 64)) : (c(), H(ye, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          g("span", _1, $(e.title), 1),
          L(xt, { open: s.value }, null, 8, ["open"])
        ], 8, M1),
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
      g("div", E1, [
        g("div", A1, [
          (c(!0), h(z, null, te(u.value, (m, v) => (c(), h("p", {
            key: v,
            class: "growing-card-text"
          }, $(m), 1))), 128))
        ])
      ])
    ], 2));
  }
}, O1 = /* @__PURE__ */ Y(C1, [["__scopeId", "data-v-f2b4930d"]]), T1 = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, R1 = { class: "md inline" }, I1 = ["disabled", "title", "onClick"], B1 = {
  key: 1,
  class: "message-links-many"
}, L1 = ["aria-expanded"], N1 = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, D1 = ["disabled", "onClick"], j1 = { class: "row-pill message-links-chip" }, P1 = { class: "message-links-title" }, q1 = { key: 0 }, ya = 3, F1 = "task", W1 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => n.total || n.links.length), o = R(() => n.links.every((m) => m.endpoint.model === F1) ? "tasks" : "items"), l = I(!1), r = I(null);
    bl(r, () => l.value = !1);
    const i = () => l.value = !l.value, u = (m) => m.endpoint.unavailable || !m.endpoint.open_ref, d = (m) => m.relations.includes("edited") ? m.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function f(m) {
      u(m) || (l.value = !1, Fe(m.endpoint.open_ref));
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
      e.links.length ? (c(), h("span", T1, [
        g("span", R1, [
          v[1] || (v[1] = ee("Linked: ", -1)),
          (c(!0), h(z, null, te(e.links, (y) => (c(), h("button", {
            key: `${y.endpoint.model}:${y.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: u(y),
            title: y.endpoint.title,
            onClick: (S) => f(y)
          }, [
            ee($(y.endpoint.model.replaceAll("_", " ")) + " " + $(y.endpoint.id), 1),
            d(y) ? (c(), h(z, { key: 0 }, [
              ee(" (" + $(d(y)) + ")", 1)
            ], 64)) : O("", !0),
            u(y) ? (c(), h(z, { key: 1 }, [
              ee(" (unavailable)")
            ], 64)) : O("", !0)
          ], 8, I1))), 128))
        ])
      ])) : O("", !0),
      s.value >= ya ? (c(), h("span", B1, [
        g("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: i
        }, [
          ee($(s.value) + " linked " + $(o.value) + " ", 1),
          L(xt, { open: l.value }, null, 8, ["open"])
        ], 8, L1)
      ])) : O("", !0),
      l.value ? (c(), h("div", N1, [
        (c(!0), h(z, null, te(e.links, (y) => (c(), h("button", {
          key: `${y.endpoint.model}:${y.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: u(y),
          onClick: (S) => f(y)
        }, [
          g("span", j1, $(y.endpoint.model.replaceAll("_", " ")) + " " + $(y.endpoint.id), 1),
          g("span", P1, $(y.endpoint.title), 1),
          g("span", null, $(d(y)), 1),
          u(y) ? (c(), h("span", q1, "Unavailable")) : O("", !0)
        ], 8, D1))), 128))
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
}, H1 = /* @__PURE__ */ Y(W1, [["__scopeId", "data-v-e9bc783c"]]), U1 = ["title", "aria-label"], z1 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, V1 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, G1 = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = R(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (c(), h("span", {
      class: X(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (c(), h("svg", z1, [
        o[0] || (o[0] = g("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (c(), h("path", V1)) : O("", !0)
      ]))
    ], 10, U1));
  }
}, K1 = /* @__PURE__ */ Y(G1, [["__scopeId", "data-v-6dc92808"]]);
function Y1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function cr(e, t = Date.now()) {
  const n = Y1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const J1 = 36e5;
function v4(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / J1;
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
function Z1(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${ba(t % 60)}s` : `${Math.floor(t / 3600)}h ${ba(Math.floor(t % 3600 / 60))}m ${ba(t % 60)}s`;
}
const X1 = "img,pre,table";
function Q1(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function ep(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function tp(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(X1)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = Q1(ep(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function np(e, t) {
  let n = null;
  const a = () => e.value && tp(e.value);
  Re(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== s && (s = r.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Be(() => n == null ? void 0 : n.disconnect()), he(t, a, { flush: "post" });
}
const ap = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function sp(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const xn = /* @__PURE__ */ new WeakMap(), Ge = "work", Ut = "sent", op = 50, ko = () => ({ rows: I([]), total: I(0), next: I(null), loading: I(!1), failure: I(""), version: 0 });
function lp(e) {
  var f;
  if (xn.has(e)) return xn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (m) => {
    var v;
    return ((v = e.visible) == null ? void 0 : v.value) !== !1 && [...m.views].some((y) => y.visible);
  };
  async function o(m, v, y = 1) {
    const S = m[v], _ = ++S.version;
    S.loading.value = !0, S.failure.value = "";
    const T = v === Ge ? "--type about --type edited --group-counterparts" : "--type sent_to", W = `link list --source message:${m.id} ${T} --page ${y} --page-size ${v === Ge ? 10 : 25}`;
    try {
      const J = await e.read(W);
      if (t.get(m.id) !== m || S.version !== _) return;
      if (!J.ok) {
        S.failure.value = J.error;
        return;
      }
      const D = v === Ge ? J.value.counterparts ?? [] : J.value.rows ?? [], B = y === 1 ? D : [...S.rows.value, ...D], q = v === Ge ? (A) => `${A.endpoint.model}:${A.endpoint.id}` : (A) => A.id ?? A.target_id;
      S.rows.value = [...new Map(B.map((A) => [q(A), A])).values()], S.total.value = J.value.total ?? S.rows.value.length, S.next.value = J.value.next_page ?? null;
    } catch (J) {
      S.version === _ && (S.failure.value = J.message);
    } finally {
      S.version === _ && (S.loading.value = !1);
    }
  }
  function l() {
    a = null;
    const m = [...n].map((v) => t.get(v)).filter((v) => v && s(v));
    n.clear();
    for (const v of m) {
      const y = [...v.dirty];
      v.dirty.clear();
      for (const S of y) o(v, S);
    }
  }
  function r(m, v = [Ge, Ut]) {
    for (const y of v) m.dirty.add(y);
    s(m) && (n.add(m.id), a ?? (a = setTimeout(l, 0)));
  }
  function i(m) {
    const v = m.sources ?? (m.source_model && Number.isInteger(m.source_id) ? [{ model: m.source_model, id: m.source_id }] : []), y = m.link_types ?? (m.link_type ? [m.link_type] : []), S = y.length ? [Ge, Ut].filter((T) => T === Ge ? y.some((W) => ["about", "edited"].includes(W)) : y.includes("sent_to")) : [Ge, Ut];
    if (!S.length) return;
    const _ = v.length ? [...new Set(v.filter((T) => T.model === "message").map((T) => T.id))].map((T) => t.get(T)).filter(Boolean) : [...t.values()].filter(s).slice(0, op);
    for (const T of _) r(T, S);
  }
  const u = (f = e.follow) == null ? void 0 : f.call(e, ["link.*"], i), d = {
    attach(m, v) {
      let y = t.get(m);
      return y || (y = { id: m, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Ge, Ut]), work: ko(), sent: ko() }, t.set(m, y)), y.views.add(v), y.dirty.size && r(y, [...y.dirty]), y;
    },
    shown(m) {
      m.dirty.size && r(m, [...m.dirty]);
    },
    detach(m, v) {
      m.views.delete(v), m.views.size || t.delete(m.id), t.size || (clearTimeout(a), u == null || u(), xn.delete(e));
    },
    more(m, v) {
      const y = m == null ? void 0 : m[v];
      if (y != null && y.next.value && !y.loading.value) return o(m, v, y.next.value);
    }
  };
  return xn.set(e, d), d;
}
function rp(e, t, n) {
  const a = Ke(null);
  let s = null;
  const o = he(t, (l, r, i) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = lp(e);
    const u = { visible: typeof IntersectionObserver > "u" }, d = s.attach(l, u);
    a.value = d;
    const f = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((v) => {
      u.visible = v.some((y) => y.isIntersecting), u.visible && s.shown(d);
    }, { rootMargin: "100px" }), m = he(n, (v) => {
      f == null || f.disconnect(), v && (f == null || f.observe(v));
    }, { immediate: !0, flush: "post" });
    i(() => {
      m(), f == null || f.disconnect(), s.detach(d, u), a.value = null;
    });
  }, { immediate: !0 });
  return ms(o), {
    links: R(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.rows.value) ?? [];
    }),
    total: R(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.total.value) ?? 0;
    }),
    more: R(() => {
      var l;
      return !!((l = a.value) != null && l.work.next.value);
    }),
    loading: R(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.loading.value) ?? !1;
    }),
    failure: R(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.failure.value) ?? "";
    }),
    sentTo: R(() => {
      var l;
      return (((l = a.value) == null ? void 0 : l.sent.rows.value) ?? []).map((r) => r.target);
    }),
    sentMore: R(() => {
      var l;
      return !!((l = a.value) != null && l.sent.next.value);
    }),
    sentLoading: R(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.loading.value) ?? !1;
    }),
    sentFailure: R(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.failure.value) ?? "";
    }),
    loadMore: () => s == null ? void 0 : s.more(a.value, Ge),
    loadSent: () => s == null ? void 0 : s.more(a.value, Ut)
  };
}
const ip = ["data-incoming", "data-ref"], cp = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], up = { class: "message-body" }, dp = ["title"], fp = ["innerHTML"], hp = ["title"], mp = ["innerHTML"], pp = {
  class: "message-faces",
  "data-message-faces": ""
}, gp = ["title", "data-face", "onClick"], vp = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, yp = ["title", "data-reaction", "onClick"], bp = {
  key: 0,
  class: "message-reaction-count"
}, wp = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, kp = ["href", "title"], $p = ["src", "alt"], xp = ["href"], Mp = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, Sp = ["disabled", "data-sent-worker", "title", "onClick"], _p = { class: "message-foot" }, Ep = { class: "message-time" }, Ap = {
  class: "message-id",
  "data-message-id": ""
}, Cp = 140, Op = 2, Tp = 1500, Rp = "An earlier message", Ip = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(!1), o = I(null), l = R(() => ["user", "comment"].includes(n.message.type)), r = R(() => {
      const [ve, me] = (n.message.commented_row || ":").split(":"), se = ct(ve);
      return se ? { ref: `${se}:${me}`, label: `${qt(se).title.toLowerCase()} ${me}` } : null;
    }), i = R(() => n.message.worker_id ?? null), u = I(!1), d = R(() => i.value !== null && ((n.message.text ?? "").length > Cp || (n.message.text ?? "").split(`
`).filter((ve) => ve.trim()).length > Op)), f = R(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var ve;
      await ((ve = navigator.clipboard) == null ? void 0 : ve.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, Tp);
    }
    const v = Gl(), y = R(() => v(n.message.text ?? "")), S = R(() => JSON.parse(n.message.flowchart_edges || "[]")), _ = I(!1), T = R(() => v(n.quote || Rp));
    function W() {
      const ve = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      ve ? ve.scrollIntoView({ block: "center", behavior: "smooth" }) : Fe(`messages:${n.message.parent_id}`);
    }
    np(o, () => `${n.message.text} ${n.quote}`);
    const J = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, D = (ve) => `/api/files/message/${n.message.id}/${encodeURIComponent(ve)}`, B = R(() => JSON.parse(n.message.captions || "{}")), q = R(() => (n.message.files ?? []).map((ve) => ({ name: ve, address: D(ve), isImage: J.test(ve), title: B.value[ve] || ve }))), A = R(() => ur(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), E = Oe(Ne, null), { links: b, total: w, more: k, loading: p, failure: x, sentTo: M, sentMore: C, sentLoading: N, sentFailure: Z, loadMore: ne, loadSent: ie } = rp(E, () => l.value && !n.message.local ? n.message.id : null, o), fe = I(!1), Ae = R(() => sp(n.message.reactions));
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
      L(O1, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: me[0] || (me[0] = (se) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, ip)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      g("div", up, [
        g("div", {
          ref_key: "bubble",
          ref: o,
          class: X(["message-card", "md", { comment: r.value }]),
          onClick: me[6] || (me[6] = (...se) => P(It) && P(It)(...se))
        }, [
          r.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${r.value.label}`,
            onClick: me[1] || (me[1] = $e((se) => P(Fe)(r.value.ref), ["stop"]))
          }, [
            L(ye, {
              name: "bubble",
              size: 12
            }),
            g("span", null, "Comment on " + $(r.value.label), 1)
          ], 8, dp)) : O("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: $e(W, ["stop"]),
            innerHTML: T.value
          }, null, 8, fp)) : O("", !0),
          i.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${i.value}`,
            onClick: me[2] || (me[2] = $e((se) => P(Fe)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + $(i.value), 9, hp)) : O("", !0),
          g("div", {
            class: X({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: y.value
          }, null, 10, mp),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: me[3] || (me[3] = $e((se) => u.value = !u.value, ["stop"]))
          }, $(u.value ? "Show less" : "Show more"), 1)) : O("", !0),
          S.value.length ? (c(), h(z, { key: 4 }, [
            g("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: me[4] || (me[4] = (se) => _.value = !0)
            }, "Open the flowchart"),
            _.value ? (c(), H(h1, {
              key: 0,
              title: e.message.text,
              edges: S.value,
              onClose: me[5] || (me[5] = (se) => _.value = !1)
            }, null, 8, ["title", "edges"])) : O("", !0)
          ], 64)) : O("", !0)
        ], 2),
        g("div", {
          class: X(["message-tools", { picking: fe.value }]),
          "data-message-tools": ""
        }, [
          fe.value ? (c(), h(z, { key: 0 }, [
            g("div", pp, [
              (c(!0), h(z, null, te(P(ap), (se) => (c(), h("button", {
                key: se,
                type: "button",
                class: "message-face",
                title: `React ${se}`,
                "data-face": se,
                onClick: (Je) => He(se)
              }, $(se), 9, gp))), 128))
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
          ], 64)) : (c(), h(z, { key: 1 }, [
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
      Ae.value.length ? (c(), h("div", vp, [
        (c(!0), h(z, null, te(Ae.value, (se) => (c(), h("button", {
          key: se.emoji,
          type: "button",
          class: X(["message-reaction", { mine: se.mine }]),
          title: se.title,
          "data-reaction": se.emoji,
          onClick: (Je) => a("react", e.message, se.emoji)
        }, [
          ee($(se.emoji) + " ", 1),
          se.count > 1 ? (c(), h("span", bp, $(se.count), 1)) : O("", !0)
        ], 10, yp))), 128))
      ])) : O("", !0),
      q.value.length ? (c(), h("div", wp, [
        (c(!0), h(z, null, te(q.value, (se) => (c(), h(z, {
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
            }, null, 8, $p)
          ], 8, kp)) : (c(), h("a", {
            key: 1,
            href: se.address,
            target: "_blank",
            class: "message-file"
          }, $(se.name), 9, xp))
        ], 64))), 128))
      ])) : O("", !0),
      P(M).length ? (c(), h("div", Mp, [
        L(ye, {
          name: "send",
          size: 12
        }),
        (c(!0), h(z, null, te(P(M), (se) => (c(), h("button", {
          key: se.id,
          type: "button",
          class: "message-sent-worker",
          disabled: se.unavailable || !se.open_ref,
          "data-sent-worker": se.id,
          title: `Open worker ${se.id}`,
          onClick: $e((Je) => se.open_ref && P(Fe)(se.open_ref), ["stop"])
        }, [
          ee("Also sent to worker " + $(se.id), 1),
          se.unavailable ? (c(), h(z, { key: 0 }, [
            ee(" (unavailable)")
          ], 64)) : O("", !0)
        ], 8, Sp))), 128))
      ])) : O("", !0),
      L(Qn, {
        more: P(C),
        loading: P(N),
        failure: P(Z),
        label: "More recipients",
        onMore: P(ie)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      g("div", _p, [
        g("time", Ep, $(A.value), 1),
        Number.isInteger(e.message.id) ? (c(), h(z, { key: 0 }, [
          me[11] || (me[11] = g("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          g("span", Ap, "message " + $(e.message.id), 1)
        ], 64)) : O("", !0),
        l.value ? (c(), H(K1, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : O("", !0)
      ]),
      P(b).length || P(x) ? (c(), H(H1, {
        key: 3,
        links: P(b),
        total: P(w),
        more: P(k),
        loading: P(p),
        failure: P(x),
        onMore: P(ne)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : O("", !0)
    ], 8, cp));
  }
}, y4 = /* @__PURE__ */ Y(Ip, [["__scopeId", "data-v-0be1107c"]]), Bp = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const r = mi("SkeletonParts", !0);
      return c(!0), h(z, null, te(e.parts, (i, u) => (c(), h(z, { key: u }, [
        (c(!0), h(z, null, te(i.count, (d) => (c(), H(Pt, {
          key: d,
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
}), Lp = /* @__PURE__ */ Y(Bp, [["__scopeId", "data-v-fa8baeaf"]]), Np = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, Dp = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", Np, [
      L(Lp, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Os = /* @__PURE__ */ Y(Dp, [["__scopeId", "data-v-52f66b64"]]), Hn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], wa = 200, dr = (e) => {
  var t;
  return ((t = Hn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Hn[0].key;
}, b4 = (e) => {
  var t;
  return ((t = Hn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, jp = ["aria-label"], Pp = 300, $o = 400, qp = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: wa } },
  setup(e) {
    const t = e, n = R(() => dr(t.value)), a = R(() => n.value < wa ? [1, 0.25, 0.25] : n.value === wa ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (c(), h("svg", {
      class: X(["ico", "prio", { hot: n.value >= $o, high: n.value >= Pp && n.value < $o }]),
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
    ], 10, jp));
  }
}, w4 = /* @__PURE__ */ Y(qp, [["__scopeId", "data-v-b10e610f"]]), xo = (e) => [...new Set(e.agents.map((t) => t.name))], k4 = (e) => xo(e).length === 1 ? `Worker: ${xo(e)[0]}` : "Delegated", Fp = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, Mo = (e) => Fp[e.card.state] || "idle", Wp = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), So = { working: 0, waiting: 1, idle: 2, stopped: 3 }, _o = (e, t) => So[Mo(e)] - So[Mo(t)], Eo = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, $4 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => _o(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || Wp(a, s)) : [...e].sort((a, s) => _o(a, s) || (Eo[t] || Eo.state)(a, s)), Hp = { class: "list-row" }, Up = {
  key: 0,
  class: "list-row-type"
}, zp = { class: "list-row-main" }, Vp = {
  key: 0,
  class: "list-row-title"
}, Gp = { class: "list-row-body" }, Kp = {
  key: 1,
  class: "list-row-end"
}, Yp = {
  key: 1,
  class: "list-row-text"
}, Jp = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", Hp, [
      e.type ? (c(), h("span", Up, $(e.type), 1)) : O("", !0),
      g("div", zp, [
        e.title ? (c(), h("span", Vp, $(e.title), 1)) : O("", !0),
        g("div", Gp, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", Kp, [
          ue(t.$slots, "end", {}, void 0, !0)
        ])) : O("", !0)
      ]),
      e.text ? (c(), h("span", Yp, $(e.text), 1)) : O("", !0)
    ]));
  }
}, x4 = /* @__PURE__ */ Y(Jp, [["__scopeId", "data-v-dfc8c3a7"]]), Zp = ["aria-expanded"], Xp = { class: "drop-label" }, Qp = ["value"], eg = {
  key: 1,
  class: "drop-lead"
}, tg = { class: "drop-item-text" }, ng = {
  key: 2,
  class: "drop-note"
}, ag = {
  key: 1,
  class: "drop-none"
}, sg = {
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
    const n = e, a = t, s = I(!1), o = I(null), l = I(""), r = R(() => {
      const u = l.value.trim().toLowerCase();
      return u ? n.items.filter((d) => `${d.label} ${d.note || ""}`.toLowerCase().includes(u)) : n.items;
    });
    function i(u) {
      s.value = !1, a("pick", u);
    }
    return (u, d) => (c(), h("div", {
      class: X(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      g("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: X(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: d[0] || (d[0] = (f) => s.value = !s.value)
      }, [
        e.icon ? (c(), H(ye, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : O("", !0),
        g("span", Xp, $(e.label), 1),
        L(ye, {
          name: "down",
          size: 11
        })
      ], 10, Zp),
      s.value ? (c(), H(ea, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (f) => s.value = !1)
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
            onInput: d[1] || (d[1] = (f) => l.value = f.target.value)
          }, null, 40, Qp)) : O("", !0),
          (c(!0), h(z, null, te(r.value, (f) => (c(), H(Mt, {
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
              f.lead ? (c(), h("span", eg, $(f.lead), 1)) : O("", !0),
              g("span", tg, $(f.label), 1),
              f.note ? (c(), h("span", ng, $(f.note), 1)) : O("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          r.value.length ? O("", !0) : (c(), h("p", ag, $(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : O("", !0)
    ], 2));
  }
}, og = /* @__PURE__ */ Y(sg, [["__scopeId", "data-v-29dfcce5"]]), M4 = {
  __name: "ModelPicker",
  props: {
    title: { type: String, required: !0 },
    models: { type: Array, required: !0 },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => [
      ...n.models.map((l) => ({ key: l.name, label: l.name, note: l.tier })),
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = R(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, r) => (c(), H(og, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: r[0] || (r[0] = (i) => a("pick", i.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, lg = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: X(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      ue(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, fr = /* @__PURE__ */ Y(lg, [["__scopeId", "data-v-978e0921"]]), rg = ["aria-label"], ig = { class: "head" }, cg = { class: "names" }, ug = { class: "body" }, dg = {
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
    return (i, u) => (c(), H(hs, { to: "body" }, [
      L(jt, {
        name: "side",
        appear: "",
        onAfterLeave: P(l)
      }, {
        default: j(() => [
          P(s) ? (c(), h("div", {
            key: 0,
            class: X(["veil", { over: e.over, under: e.depth }]),
            style: ge({ "--depth": e.depth, zIndex: P(r) }),
            "data-side-panel": "",
            onClick: u[0] || (u[0] = $e((...d) => P(o) && P(o)(...d), ["self"]))
          }, [
            g("aside", {
              class: X(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(z, { key: 0 }, [
                g("header", ig, [
                  g("div", cg, [
                    g("h2", null, $(e.title), 1),
                    e.abstract ? (c(), H(kt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : O("", !0)
                  ]),
                  ue(i.$slots, "actions", {}, void 0, !0),
                  L(xs, {
                    title: e.closeLabel,
                    onClick: P(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                i.$slots.foot ? (c(), H(fr, { key: 0 }, {
                  default: j(() => [
                    ue(i.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : O("", !0),
                g("div", ug, [
                  ue(i.$slots, "default", {}, void 0, !0)
                ])
              ], 64)) : ue(i.$slots, "default", {}, void 0, !0, 1)
            ], 10, rg)
          ], 6)) : O("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, S4 = /* @__PURE__ */ Y(dg, [["__scopeId", "data-v-f276f055"]]), fg = {
  key: 1,
  class: "text-field-label"
}, hg = {
  key: 2,
  class: "text-field-end"
}, mg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Ha({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = Wa(e, "modelValue"), a = Xn(), s = "onUpdate:modelValue" in (((d = pi()) == null ? void 0 : d.vnode.props) || {}), o = R(() => s ? n.value : a.value), l = (f) => s && (n.value = f.target.value), r = R(
      () => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), i = R(() => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "value"))), u = I(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, m) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: X(["text-field", { large: e.large, ended: f.$slots.end }, P(a).class]),
      style: ge(P(a).style)
    }, [
      e.icon ? (c(), H(ye, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : O("", !0),
      e.label ? (c(), h("span", fg, $(e.label), 1)) : O("", !0),
      Ye(g("input", Le({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: l }), null, 16), [
        [P(Ya), o.value]
      ]),
      f.$slots.end ? (c(), h("span", hg, [
        ue(f.$slots, "end", {}, void 0, !0)
      ])) : O("", !0)
    ], 6)) : Ye((c(), h("input", Le({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, i.value, { onInput: l }), null, 16)), [
      [P(Ya), o.value]
    ]);
  }
}), _4 = /* @__PURE__ */ Y(mg, [["__scopeId", "data-v-d9c38ca8"]]), pg = { class: "title" }, gg = { class: "state" }, vg = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = Ua(t.line, t.events);
    return (o, l) => (c(), H(lf, {
      rows: P(n),
      failure: P(a),
      loaded: P(s),
      empty: e.empty
    }, {
      default: j(({ row: r }) => [
        g("span", pg, $(r.title), 1),
        g("span", gg, $(P(xl)(e.noun, r.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, E4 = /* @__PURE__ */ Y(vg, [["__scopeId", "data-v-9191a6f0"]]);
function yg(e = 1e3, t = null) {
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
const bg = 200, wg = lr + Rn + rr + bg;
function Wt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function kg(e, t, n) {
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
      var l, r, i, u;
      return `${((r = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : r.className) || ((u = (i = o.effect) == null ? void 0 : i.target) == null ? void 0 : u.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: u, display: d }) => ({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: u, display: d }))(getComputedStyle(e)),
    parent: Wt(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function $g(e, t, n, a) {
  he(t, (s) => {
    var u;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((u = a.markMotion) != null && u.value)) return;
    const l = performance.now(), r = [];
    function i() {
      if (a.markMotion.value) {
        if (r.push(kg(o, l, n.value)), performance.now() - l < wg) return void requestAnimationFrame(i);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: r })]);
      }
    }
    i();
  }, { flush: "sync" });
}
const xg = ["title", "data-figure-mark", "data-folded", "data-open"], Mg = {
  key: 2,
  class: "worker"
}, Sg = { class: "head" }, _g = { key: 0 }, Eg = {
  key: 3,
  class: "status"
}, Ag = {
  key: 0,
  class: "figure"
}, Cg = {
  key: 1,
  class: "ran-for"
}, Og = { key: 2 }, Tg = {
  key: 3,
  class: "news"
}, Rg = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Ig = {
  key: 6,
  class: "settled"
}, Bg = {
  key: 1,
  class: "bar"
}, Lg = {
  key: 3,
  class: "detail body"
}, Ng = {
  key: 0,
  class: "body-label"
}, Dg = ["title"], jg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Xn(), a = ["onClick", "onAct"], s = R(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = I(!1), l = R(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = R(() => t.open !== void 0), i = R(() => r.value || l.value), u = R(() => r.value ? t.open : o.value), d = R(() => r.value ? !t.open : l.value && !o.value), f = R(() => !!(t.mark.action && n.onAct)), m = R(() => i.value || f.value || !!n.onClick), v = I(null), y = I(null), { folded: S, phase: _ } = ir(v, () => d.value);
    $g(v, d, _, Oe(Ne, null));
    function T(ie) {
      var fe, Ae;
      if (!(ie.target !== v.value && !y.value.contains(ie.target))) {
        if (r.value) return (fe = n.onClick) == null ? void 0 : fe.call(n, ie);
        if (l.value) return void (o.value = !o.value);
        (Ae = n.onAct || n.onClick) == null || Ae(ie);
      }
    }
    const W = (ie) => n.onAct(ie), J = ["failed", "unfinished"], D = R(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? J.includes(t.mark.state) ? "danger" : "good" : ""), B = R(() => t.mark.color ? t.mark.color : D.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : D.value ? `var(--tone-${D.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), q = R(() => B.value || "var(--tone-work)"), A = R(() => !t.mark.ending && !t.mark.ended && D.value !== "stopped"), E = hr(), b = R(
      () => t.mark.began_at && A.value && !t.mark.figure && !t.mark.counting ? Z1(E.value - t.mark.began_at) : ""
    ), w = R(() => {
      const { started: ie, ended: fe } = t.mark;
      return ie ? fe ? `ran ${wo(fe - ie, !0)}` : wo(E.value - ie, !0) : b.value;
    }), k = ["bad", "danger", "warn"], p = R(() => k.includes(D.value) || t.mark.asks ? "attention" : A.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), x = ["bad", "danger"], M = R(() => x.includes(D.value)), C = R(() => p.value === "process" ? "running" : M.value ? "cross" : D.value === "stopped" ? "stopped" : D.value === "good" ? "tick" : ""), N = R(
      () => !!(t.mark.figure || w.value || t.mark.docked || t.mark.stopping || C.value || t.mark.settled || t.mark.news)
    ), Z = R(() => [t.mark.title, t.mark.time ? ur(t.mark.time) : ""].filter(Boolean).join(" · ")), ne = R(() => ({
      ...B.value ? { "--mark": B.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ie, fe) => (c(), h("div", Le(s.value, {
      ref_key: "root",
      ref: v,
      class: [
        "mark",
        `w-${p.value}`,
        P(_),
        {
          open: u.value,
          folding: r.value && d.value,
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
      "data-folded": P(S) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: T
    }), [
      (c(), H(ht(m.value ? "button" : "span"), {
        ref_key: "top",
        ref: y,
        class: "top",
        type: m.value ? "button" : void 0,
        "aria-expanded": i.value ? String(!!u.value) : void 0
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
          e.mark.worker ? (c(), h("span", Mg, $(e.mark.worker), 1)) : O("", !0),
          g("span", Sg, [
            L(kt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", _g, $(e.mark.name), 1)) : O("", !0),
            i.value ? (c(), H(xt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : O("", !0)
          ]),
          N.value ? (c(), h("span", Eg, [
            e.mark.figure ? (c(), h("span", Ag, $(e.mark.figure), 1)) : O("", !0),
            w.value ? (c(), h("span", Cg, $(w.value), 1)) : O("", !0),
            e.mark.stopping ? (c(), h("span", Og, "Stopping")) : O("", !0),
            e.mark.news ? (c(), h("span", Tg, $(e.mark.news), 1)) : O("", !0),
            C.value === "running" ? (c(), h("span", Rg)) : C.value ? (c(), H(dt, {
              key: 5,
              class: X(["sign", C.value]),
              name: C.value
            }, null, 8, ["class", "name"])) : O("", !0),
            e.mark.settled ? (c(), h("span", Ig, $(e.mark.settled), 1)) : O("", !0)
          ])) : O("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), H(or, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: $e(W, ["stop"])
      }, null, 8, ["label", "open"])) : O("", !0),
      (e.mark.figure || e.mark.counting) && A.value ? (c(), h("span", Bg, [
        g("span", {
          class: "progress",
          style: ge({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: q.value })
        }, null, 4)
      ])) : O("", !0),
      e.mark.detail && !P(S) ? (c(), H(kt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : O("", !0),
      e.mark.body && !P(S) ? (c(), h("div", Lg, [
        e.mark.bodyLabel ? (c(), h("p", Ng, $(e.mark.bodyLabel), 1)) : O("", !0),
        L(kt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : O("", !0),
      e.mark.command && !P(S) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, $(e.mark.command), 9, Dg)) : O("", !0),
      e.mark.card ? (c(), H(kt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : O("", !0),
      ue(ie.$slots, "default", {
        shown: !P(S)
      }, void 0, !0)
    ], 16, xg));
  }
}), mr = /* @__PURE__ */ Y(jg, [["__scopeId", "data-v-2aa9c496"]]), Pg = 60, pr = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function qg(e, t) {
  const n = I([]), a = I(0);
  let s = -1, o = 0, l = !1;
  async function r() {
    const d = await e(["output", "page", String(t())]);
    return d.ok && (n.value = d.value.lines, a.value = d.value.first_byte, s = d.value.last_byte, o = d.value.cut_bytes), d;
  }
  async function i() {
    if (s < 0) return r();
    const d = await e(["output", "page", String(t()), "--after", String(s)]);
    return d.ok ? d.value.cut_bytes !== o || d.value.total < s ? r() : (d.value.lines.length && (n.value = [...n.value, ...d.value.lines]), s = d.value.last_byte, d) : d;
  }
  async function u(d) {
    if (l || a.value <= 0 || d.scrollTop > Pg) return;
    l = !0;
    const f = d.scrollHeight, m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    l = !1, m.ok && (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, await mt(), d.scrollTop += d.scrollHeight - f);
  }
  return { lines: n, newest: r, follow: i, loadEarlier: u };
}
const Fg = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function gr(e) {
  var n;
  const t = Fg[e] || ((n = qt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Wg = (e) => gr(String(e).split(":")[0]), Hg = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Ug = { passed: "good", failed: "danger", warned: "warn", running: "" }, zg = { good: "good", warn: "warn", danger: "danger" }, Co = {
  "open row": (e) => Fe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Jd(e.target_model, e.target_id || 0)
}, Vg = { "open row": (e) => Wg(e.target_model), "open page": () => gr("pages") };
function Gg(e, t) {
  const n = t || {}, a = Co[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Ug[e.outcome] || "" : zg[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? Vg[a](e) : "",
    handlers: a ? { onAct: () => Co[a](e) } : {}
  };
}
const Kg = 24, Yg = 1e3, Oo = 2e3, Jg = 0.25, Zg = 5e3;
function Xg(e, t = Kg, n = () => !0) {
  const a = I(!1), s = I(0), o = I(!1);
  let l = 0, r = 0, i = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const D = u();
    return D ? D.scrollHeight - D.scrollTop - D.clientHeight : 0;
  }, f = () => !u() || d() <= t;
  function m(D) {
    if (clearTimeout(l), !D) {
      o.value = !1, i = Date.now();
      return;
    }
    const B = Date.now() - i < Oo ? Oo : Yg;
    l = setTimeout(() => o.value = a.value, B);
  }
  function v() {
    clearTimeout(r), a.value = !1, s.value = 0, m(!1);
  }
  function y(D = !1) {
    const B = u();
    B && D && B.scrollTo ? B.scrollTo({ top: B.scrollHeight, behavior: "smooth" }) : B && (B.scrollTop = B.scrollHeight), v();
  }
  function S() {
    T(), !a.value && (a.value = !0, m(!0));
  }
  const _ = () => !!u() && d() <= u().clientHeight * Jg;
  function T() {
    clearTimeout(r), _() && (r = setTimeout(() => a.value && _() && n() && y(!0), Zg));
  }
  function W() {
    f() ? v() : S();
  }
  function J(D = 1, B = !1) {
    a.value ? s.value += Math.max(0, D) : y(B);
  }
  return sl() && ms(() => [l, r].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: f, follow: v, toBottom: y, left: S, scrolled: W, arrived: J };
}
const Qg = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, ev = (e) => String(e ?? "").replace(Qg, ""), tv = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(null), { away: o, scrolled: l, arrived: r, toBottom: i } = Xg(s);
    he(
      () => n.lines.length,
      () => mt(() => r()),
      { immediate: !0 }
    );
    function u(d) {
      l(), a("older", d.target);
    }
    return (d, f) => (c(), h("pre", {
      ref_key: "box",
      ref: s,
      class: "output-lines",
      onScroll: u
    }, [
      ee($(P(ev)(e.lines.join(`
`)) || e.empty), 1),
      P(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (m) => P(i)(!0))
      }, "Follow")) : O("", !0)
    ], 544));
  }
}, nv = /* @__PURE__ */ Y(tv, [["__scopeId", "data-v-c2fb1783"]]), av = 1e4;
class sv {
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
    return this.heardAt !== null && t - this.heardAt > av;
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
const ov = {
  key: 0,
  class: "frame-note"
}, lv = {
  key: 0,
  class: "frame-note"
}, rv = ["src", "title"], iv = 1e3, cv = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = We(), a = I(null), s = I(!1), o = I(!1);
    let l = null, r = 0;
    return Re(() => {
      l = new sv(a.value, n), l.start(), r = setInterval(() => {
        s.value = l.silent();
      }, iv);
    }), Be(() => {
      l == null || l.stop(), clearInterval(r);
    }), (i, u) => o.value ? (c(), h("p", ov, "This window was closed because it stopped answering.")) : (c(), h(z, { key: 1 }, [
      s.value ? (c(), h("div", lv, [
        u[2] || (u[2] = g("p", null, "This window has not answered for ten seconds.", -1)),
        L(de, {
          onClick: u[0] || (u[0] = (d) => o.value = !0)
        }, {
          default: j(() => [...u[1] || (u[1] = [
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
        title: P(n).window
      }, null, 8, rv)
    ], 64));
  }
}, uv = /* @__PURE__ */ Y(cv, [["__scopeId", "data-v-32a49046"]]), Sn = (e) => e ? e.split(", ") : [];
function dv({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function fv(e, t) {
  return {
    reads: Sn(e.reads_allowed),
    runs: Sn(e.runs_allowed),
    missing: [...Sn(e.reads_missing), ...Sn(e.runs_missing)],
    ask: t
  };
}
const hv = {
  class: "allowance-prompt",
  role: "dialog"
}, mv = { class: "allowance-prompt-text" }, pv = { class: "allowance-prompt-buttons" }, gv = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", hv, [
      g("p", mv, $(P(dv)(e.request)), 1),
      g("div", pv, [
        L(de, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            ee("Allow", -1)
          ])]),
          _: 1
        }),
        L(de, {
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
}, vv = /* @__PURE__ */ Y(gv, [["__scopeId", "data-v-cad69fe2"]]), $a = {
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
        e.retry ? (c(), H(de, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            ee("Retry", -1)
          ])]),
          _: 1
        })) : O("", !0),
        e.removable ? (c(), H(de, {
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
}, yv = ["data-window", "data-agent"], bv = {
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
    const r = Oe(qc, null), i = qu({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: R(() => n.options),
      declared: n.declared,
      page: Oe(Bu, null),
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
    const u = () => Jn(n.component), d = () => {
      var f, m;
      return ((m = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : m.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, m) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (c(), H(vv, {
        key: 0,
        request: d(),
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
      }, null, 8, ["name", "reason"])) : e.component ? (c(), h(z, { key: 4 }, [
        (c(), H(u, { key: o.value })),
        e.skeleton.length && !P(i).answered.value ? (c(), H(Os, {
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
    ], 8, yv));
  }
}, Kt = /* @__PURE__ */ Y(bv, [["__scopeId", "data-v-c4443e2b"]]), vr = {
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
    const n = e, a = t, s = { render: () => Jn(uv, { src: n.entry.entry_url }) };
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
}, wv = ["data-window"], yr = {
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
    ], 8, wv)) : (c(), H(Kt, {
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
      onOption: r[0] || (r[0] = (i, u) => a("option", i, u))
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "skeleton", "unavailable-reason"]));
  }
}, kv = "*.*", $v = {
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
      (i, u, d) => {
        var m;
        const f = (m = n == null ? void 0 : n.subscriptions) == null ? void 0 : m.follow(`body of ${t.declaration.type}`, i, (v) => a.dispatch(v));
        d(() => f == null ? void 0 : f());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = R(() => !!(t.declaration.shipped || t.declaration.trusted)), r = R(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [kv] : t.declaration.events ?? [],
      options: []
    }));
    return (i, u) => l.value ? (c(), H(yr, {
      key: 0,
      entry: r.value,
      subscriptions: P(a),
      environment: P(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), H(vr, {
      key: 1,
      entry: r.value,
      subscriptions: P(a),
      environment: P(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, xv = { class: "mark-more-inner" }, Mv = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Sv = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, _v = {
  key: 3,
  class: "mark-lines"
}, Ev = "process", To = "task", Av = {
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
    const t = e, n = We(), a = R(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = R(() => Hg.has(t.mark.variant) && t.mark.detail || ""), o = R(() => t.mark.target_model === To ? t.mark.target_id : 0), l = qg(
      pr(n),
      () => t.mark.target_id
    ), r = l.lines, i = I(!1), u = I(""), d = R(() => !t.declaration.body_url && t.mark.target_model === Ev && !!t.mark.target_id);
    async function f(v = l.follow) {
      const y = await v();
      i.value = !0, u.value = y.ok ? "" : y.error;
    }
    const m = R(() => t.shown && d.value);
    return he(m, (v) => v && f()), gs(() => m.value && f(), () => m.value && !t.mark.ended_at), he(
      () => t.mark.ended_at,
      (v) => v && m.value && f(l.newest)
    ), (v, y) => (c(), h("div", {
      class: X(["mark-more", { open: e.shown }]),
      onClick: y[1] || (y[1] = $e(() => {
      }, ["stop"]))
    }, [
      g("div", xv, [
        e.declaration.body_url ? (c(), H($v, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded"])) : (c(), h(z, { key: 1 }, [
          s.value ? (c(), h(z, { key: 0 }, [
            y[2] || (y[2] = g("p", { class: "mark-label" }, "Why it stopped", -1)),
            g("p", Mv, $(s.value), 1)
          ], 64)) : O("", !0),
          d.value && u.value ? (c(), h("p", Sv, $(u.value), 1)) : d.value && i.value ? (c(), h(z, { key: 2 }, [
            y[3] || (y[3] = g("p", { class: "mark-label" }, "Output", -1)),
            L(nv, {
              class: "mark-terminal",
              lines: P(r),
              onOlder: P(l).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (c(), h("p", _v, $(a.value.join(`
`)), 1)) : O("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: y[0] || (y[0] = $e((S) => P(Fe)(`${To}:${o.value}`), ["stop"]))
          }, " Open task " + $(o.value) + " and its proofs ", 1)) : O("", !0)
        ], 64))
      ])
    ], 2));
  }
}, ns = /* @__PURE__ */ Y(Av, [["__scopeId", "data-v-2f996108"]]), Cv = ["title", "aria-label", "onClick"], Ov = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Tv = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = R(() => xd(t.buttons, t.allowedRuns).filter((l) => {
      var r;
      return !((r = l.variants) != null && r.length) || l.variants.includes(t.mark.variant);
    })), a = I(""), s = Oe(Ne);
    async function o(l) {
      const r = await cn(l, { id: t.mark.target_id }, s.environment);
      a.value = r.ok ? "" : r.error;
    }
    return (l, r) => (c(), h(z, null, [
      (c(!0), h(z, null, te(n.value, (i) => (c(), h("button", {
        key: i.runs,
        type: "button",
        class: "mark-button",
        title: i.label,
        "aria-label": i.label,
        onClick: $e((u) => o(i), ["stop"])
      }, [
        L(dt, {
          name: i.icon
        }, null, 8, ["name"])
      ], 8, Cv))), 128)),
      a.value ? (c(), h("span", Ov, $(a.value), 1)) : O("", !0)
    ], 64));
  }
}, Rv = /* @__PURE__ */ Y(Tv, [["__scopeId", "data-v-7a62c88e"]]);
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
const wr = br("/api/marks", "marks"), A4 = wr.fetchAll, Iv = wr.find, Bv = ["data-ref"], Lv = ["data-ref"], Nv = { class: "mark-row" }, Dv = "dock add", jv = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = R(() => Iv(a.mark.type)), o = R(() => Gg(a.mark, s.value)), l = R(() => {
      var d;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (d = s.value) != null && d.body_url);
    }), r = I(!1);
    function i(d) {
      if (o.value.handlers.onAct && !d.target.closest(".fold")) return o.value.handlers.onAct();
      r.value = !r.value;
    }
    const u = R(() => {
      var d;
      return (((d = s.value) == null ? void 0 : d.buttons) || []).filter((f) => {
        var m;
        return !a.docked || !((m = f.runs) != null && m.startsWith(Dv));
      }).map((f) => ({ ...f, module: s.value.module }));
    });
    return (d, f) => {
      var m, v;
      return (m = s.value) != null && m.card ? (c(), h("div", {
        key: 0,
        class: X(["thread-turn", "card", "whole-card", { "user-side": P(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        L(ns, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, Bv)) : (c(), h("div", {
        key: 1,
        class: X(["thread-turn", "card", { "full-width": (v = s.value) == null ? void 0 : v.full_width, docked: e.docked, "user-side": P(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        g("span", Nv, [
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
          L(Rv, {
            buttons: u.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Lv));
    };
  }
}, Pv = /* @__PURE__ */ Y(jv, [["__scopeId", "data-v-afd7d6b1"]]), qv = ["data-ref"], Fv = ["inert"], Wv = { class: "group-fold" }, Hv = { class: "thread-group" }, Uv = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = I(!1), a = I(!1), s = I(!1), o = I(null);
    he(n, async (r) => {
      var i;
      a.value = !0, await mt(), (i = o.value) == null || i.offsetHeight, s.value = r;
    });
    const l = R(() => ({
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
        onClick: i[0] || (i[0] = (u) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (c(), h("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: X(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        g("div", Wv, [
          g("div", Hv, [
            (c(!0), h(z, null, te(e.group.marks, (u) => (c(), H(Pv, {
              key: u.id,
              mark: u
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, Fv)) : O("", !0)
    ], 8, qv));
  }
}, C4 = /* @__PURE__ */ Y(Uv, [["__scopeId", "data-v-45b58b9b"]]);
function zv(e) {
  const t = I(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Re(() => n.observe(e.value)), ft(() => n.disconnect()), t;
}
const Vv = { class: "chat-dock-fold" }, Gv = ["aria-label"], Kv = { class: "chat-dock-head" }, Yv = { class: "chat-dock-inner" }, Jv = { class: "chat-dock-foot" }, kr = 700, Zv = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = I(null), a = I(null), s = zv(a), o = I(!1);
    let l = 0;
    return Re(() => l = setTimeout(() => o.value = !0, kr)), ft(() => clearTimeout(l)), t({ card: n }), (r, i) => (c(), h("div", {
      class: X(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      g("div", Vv, [
        g("section", {
          ref_key: "card",
          ref: n,
          class: X(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ue(r.$slots, "edge", {}, void 0, !0),
          g("header", Kv, [
            ue(r.$slots, "head", {}, void 0, !0)
          ]),
          g("div", {
            class: X(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            g("div", Yv, [
              g("div", {
                class: X(["chat-dock-grow", { settled: o.value }]),
                style: ge(P(s) === null ? null : { height: `${P(s)}px` })
              }, [
                g("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  ue(r.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          ue(r.$slots, "still", {}, void 0, !0),
          g("footer", Jv, [
            ue(r.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, Gv)
      ])
    ], 2));
  }
}, $r = /* @__PURE__ */ Y(Zv, [["__scopeId", "data-v-74d44b19"]]), Xv = {
  class: "dock-leave",
  "aria-hidden": "true"
}, xa = 5, Qv = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(xa, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${xa}s`, animationDelay: `${(n - xa).toFixed(2)}s` };
    return (s, o) => (c(), h("span", Xv, [
      g("i", { style: a })
    ]));
  }
}, xr = /* @__PURE__ */ Y(Qv, [["__scopeId", "data-v-2a7bc150"]]), e0 = { reviewing: "Under review" }, t0 = (e, t) => e || e0[t == null ? void 0 : t.state] || "", Qe = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, n0 = {
  draft: [{ word: "ready", label: "Mark ready" }, Qe],
  ready: [Qe],
  approved: [{ word: "start", label: "Start", main: !0 }, Qe],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Qe],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Qe],
  completed: [],
  cancelled: []
}, a0 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Qe],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Qe],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, Qe],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Qe],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, s0 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], o0 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], l0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], r0 = (e) => e ? e.state === "removed" ? [{ word: "restore", label: "Restore", main: !0 }] : [{ word: "remove", label: "Remove", flag: "--reason", ask: "Why is it removed?" }] : [], i0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], c0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function u0(e, t) {
  const n = { plan: n0, task: a0 }[e], a = t != null && t.state ? Iu(e, t.state) : null;
  return a ? ((n == null ? void 0 : n[Ml(e, t.state)]) ?? []).filter((s) => a.includes(s.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const d0 = (e, t) => e === "doc" || e === "report" ? c0(t).map((n) => ({ ...n, word: e === "doc" ? "settle" : n.word })) : e === "agent" ? [...l0(t), ...o0(t)] : e === "check" ? i0(t) : e === "question" ? s0(t) : e === "memory" ? r0(t) : u0(e, t), Mr = br("/api/docks", "docks"), O4 = Mr.fetchAll, zt = Mr.find, f0 = 6, h0 = 3, Ma = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, na = (e) => Date.parse(e.leaves_at) / 1e3, wt = (e) => !!(e.leaves_at && !e.kept), m0 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!wt(e) || t < na(e) || n.has(e.id)), p0 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => m0(a, t, n)).sort((a, s) => a.id - s.id);
function g0(e, t, n = f0) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(na(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const v0 = (e, t, n = e) => n < 2 ? !1 : e >= h0 ? !0 : t, y0 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), as = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), b0 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), w0 = (e) => ({ ...e.kept ? as("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : as("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), k0 = ["pins"], $0 = (e) => ({ ...e, iconOnly: k0.includes(e.icon) });
function x0(e, t) {
  var n;
  return [
    ...b0(e, t) ? [w0(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || qt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    as("undock", "close", "Close this card", `dock remove ${e.id}`)
  ].map($0);
}
function M0(e, t) {
  const n = x0(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: y0(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const S0 = ["title"], _0 = {
  key: 2,
  class: "dock-controls"
}, E0 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, A0 = { class: "dock-facts" }, C0 = { "data-dock-row": "" }, O0 = {
  key: 1,
  class: "dock-kept"
}, T0 = { class: "dock-acts" }, R0 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = R(() => zt(a.item.type)), o = hr(), l = R(() => cr(a.item.created_at, o.value * 1e3)), r = I(null), i = I(null), u = I(null), d = I(null), f = R(() => M0(a.item, s.value)), m = We(), v = R(() => `dock.${a.item.id}`), y = R(() => m.props[v.value].data.value), S = R(() => Fn(a.item.target_model ?? "")), _ = R(() => {
      var b;
      return (((b = s.value) == null ? void 0 : b.word) || S.value.replaceAll("-", " ")).replace(/^./, (w) => w.toUpperCase());
    }), T = R(() => ({ ...y.value, id: a.item.target_id, noun: S.value })), W = () => {
      var b, w;
      return ((w = (b = s.value) == null ? void 0 : b.reads) == null ? void 0 : w.length) && m.reload(v.value);
    };
    Wc(ol, { data: y, reload: W, readOutput: pr(m) }), he(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (b, w, k) => {
        var x;
        W();
        const p = (x = m.subscriptions) == null ? void 0 : x.follow(`dock ${a.item.id}`, [`${S.value.replaceAll("-", "_")}.*`], (M) => {
          (!M.row_id || M.row_id === a.item.target_id) && W();
        });
        k(() => p == null ? void 0 : p());
      },
      { immediate: !0 }
    );
    const J = I(/* @__PURE__ */ new Set()), D = I("");
    async function B(b) {
      if (b.action === "open") return Fe(`${a.item.target_model}:${a.item.target_id}`);
      b.action === "declared" && (J.value = /* @__PURE__ */ new Set([...J.value, b.label])), D.value = "";
      const k = await cn(b, { id: a.item.target_id }, m.environment);
      (k == null ? void 0 : k.ok) === !1 && (J.value = new Set([...J.value].filter((p) => p !== b.label)), D.value = `Could not ${b.label.toLowerCase()}: ${k.error}`);
    }
    const q = R(() => f.value.actions.filter((b) => b.action !== "undock" && !J.value.has(b.label))), A = R(() => {
      var b;
      return t0((b = s.value) == null ? void 0 : b.badge, T.value);
    }), E = R(() => f.value.buttons.find((b) => b.action === "undock"));
    return (b, w) => {
      var k, p, x, M;
      return c(), H($r, {
        label: f.value.title + ((k = s.value) != null && k.needs_user ? ", waiting for you" : ""),
        type: (p = s.value) != null && p.needs_user ? "waiting" : "",
        folded: !!((x = s.value) != null && x.folds) && e.folded,
        body: !!((M = s.value) != null && M.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: w[3] || (w[3] = (C) => e.collapsed && n("open"))
      }, {
        edge: j(() => [
          e.leaving && !e.item.kept ? (c(), H(xr, {
            key: 0,
            "ends-at": P(na)(e.item)
          }, null, 8, ["ends-at"])) : O("", !0)
        ]),
        head: j(() => {
          var C, N;
          return [
            (C = s.value) != null && C.draws_head && !e.collapsed ? (c(), h("span", {
              key: 0,
              ref_key: "head",
              ref: r,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (c(), h(z, { key: 1 }, [
              L(ye, {
                name: f.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              g("span", {
                class: "dock-title",
                title: f.value.title
              }, $(f.value.title), 9, S0)
            ], 64)),
            f.value.controls.length && !e.collapsed ? (c(), h("span", _0, [
              (c(!0), h(z, null, te(f.value.controls, (Z) => {
                var ne, ie;
                return c(), h(z, {
                  key: Z.action + Z.runs
                }, [
                  !J.value.has(Z.label) && (!((ne = Z.variants) != null && ne.length) || !((ie = T.value) != null && ie.state) || Z.variants.includes(T.value.state)) ? (c(), H(de, {
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
              ref: d,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (N = s.value) != null && N.leaves_after_seconds ? O("", !0) : (c(), h(z, { key: 0 }, [
                ee($(l.value), 1)
              ], 64))
            ], 512)
          ];
        }),
        still: j(() => [
          D.value || e.refusal ? (c(), h("p", E0, $(D.value || e.refusal), 1)) : O("", !0)
        ]),
        foot: j(() => {
          var C;
          return [
            g("span", A0, [
              A.value ? (c(), h("span", {
                key: 0,
                class: X(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, $(A.value), 3)) : O("", !0),
              g("span", C0, $(_.value) + " " + $(e.item.target_id), 1),
              g("span", {
                ref_key: "foot",
                ref: i,
                class: "dock-module-facts"
              }, null, 512),
              e.item.kept ? (c(), h("span", O0, "Kept")) : O("", !0)
            ]),
            (C = s.value) != null && C.folds ? (c(), H(de, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: w[0] || (w[0] = (N) => n("fold"))
            }, {
              default: j(() => [
                ee($(s.value.folds) + " ", 1),
                L(xt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : O("", !0),
            g("span", T0, [
              g("span", {
                ref_key: "actions",
                ref: u,
                class: "dock-module-actions"
              }, null, 512),
              L(Dd, {
                name: `dock.${e.item.type}`,
                row: T.value,
                environment: P(m).environment,
                "read-only": P(m).readOnly,
                "object-name": P(Fn)(e.item.target_model),
                "external-failure": "",
                onFailure: w[1] || (w[1] = (N) => D.value = N),
                onDone: b.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (c(!0), h(z, null, te(q.value, (N) => (c(), H(de, {
                key: N.action + N.runs,
                small: "",
                variant: N.primary ? "primary" : "ghost",
                bordered: !N.primary,
                "data-dock-action": N.action,
                onClick: (Z) => B(N)
              }, {
                default: j(() => [
                  ee($(N.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128)),
              L(de, {
                small: "",
                bordered: "",
                title: E.value.label,
                "data-dock-action": "undock",
                onClick: w[2] || (w[2] = (N) => n("undock", E.value))
              }, {
                default: j(() => [...w[4] || (w[4] = [
                  ee("Close", -1)
                ])]),
                _: 1
              }, 8, ["title"])
            ])
          ];
        }),
        default: j(() => {
          var C;
          return [
            (C = s.value) != null && C.body_url ? (c(), H(ns, {
              key: 0,
              declaration: s.value,
              mark: e.item,
              shown: "",
              head: r.value,
              foot: i.value,
              actions: u.value,
              time: d.value,
              folded: e.folded
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded"])) : O("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, Ro = /* @__PURE__ */ Y(R0, [["__scopeId", "data-v-c6dff2d0"]]), I0 = ["title", "aria-label"], B0 = { class: "run-chip-in" }, L0 = {
  key: 0,
  class: "run-chip-ring"
}, N0 = { class: "run-chip-name" }, D0 = { class: "run-chip-bar" }, j0 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = We(), o = R(() => `run.${a.item.target_id}`), l = R(() => s.props[o.value].data.value), r = R(() => !l.value || l.value.state === "running" || l.value.state === "background"), i = R(() => {
      var m, v;
      return ((m = l.value) == null ? void 0 : m.title) || ((v = l.value) == null ? void 0 : v.line) || a.item.title || "";
    }), u = R(() => r.value ? t.running : t[l.value.state] ?? "var(--text-3)"), d = () => s.reload(o.value);
    let f = null;
    return Re(() => {
      var m;
      d(), f = (m = s.subscriptions) == null ? void 0 : m.follow(`run chip ${a.item.id}`, ["process.*"], (v) => {
        (!v.row_id || v.row_id === a.item.target_id) && d();
      });
    }), ft(() => f == null ? void 0 : f()), (m, v) => {
      var y;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: ge({ "--tone": u.value })
      }, [
        P(wt)(e.item) ? (c(), H(xr, {
          key: 0,
          "ends-at": P(na)(e.item)
        }, null, 8, ["ends-at"])) : O("", !0),
        g("span", B0, [
          r.value ? (c(), h("span", L0)) : (c(), H(dt, {
            key: 1,
            name: n[l.value.state] ?? "stop"
          }, null, 8, ["name"])),
          g("span", N0, $(i.value), 1)
        ]),
        g("span", D0, [
          g("i", {
            style: ge({ width: r.value ? `${((y = l.value) == null ? void 0 : y.progress) ?? 0}%` : "100%", background: u.value })
          }, null, 4)
        ])
      ], 12, I0);
    };
  }
}, P0 = /* @__PURE__ */ Y(j0, [["__scopeId", "data-v-226ac6c8"]]), q0 = 24, F0 = 8, T4 = 420;
function R4({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= q0 ? !0 : e < t && s > F0 ? !1 : null;
}
const W0 = (e, t) => e === void 0 ? t : e, H0 = { me: 1, people: [] }, Un = Zn({
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
  people: H0,
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
function U0(e, t, n) {
  try {
    const a = n.getItem(Sr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function z0(e, t, n) {
  try {
    n.setItem(Sr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function Io(e, t, n = window.localStorage) {
  const a = I(U0(e, t, n));
  return he(a, (s) => z0(e, s, n), { deep: !0 }), a;
}
const V0 = {
  key: "dock-all",
  class: "dock-all"
}, G0 = {
  key: "runs-head",
  class: "dock-runs-head"
}, K0 = { class: "dock-runs-title" }, Y0 = { class: "dock-runs-chips" }, J0 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean },
  setup(e) {
    var k, p;
    const t = e, n = yg(500), a = I(/* @__PURE__ */ new Set()), s = I(!1), o = I(!1), l = Oe(Ne), r = I(/* @__PURE__ */ new Set()), i = I({});
    async function u(x, M) {
      i.value = { ...i.value, [x.id]: "" }, r.value = /* @__PURE__ */ new Set([...r.value, x.id]);
      const C = await cn(M, { id: x.target_id }, l.environment);
      (C == null ? void 0 : C.ok) === !1 && (r.value = new Set([...r.value].filter((N) => N !== x.id)), i.value = { ...i.value, [x.id]: `Could not close this card: ${C.error}` });
    }
    const d = R(
      () => p0(
        t.items.filter((x) => !r.value.has(x.id)),
        n.value,
        a.value
      )
    ), f = R(
      () => g0(
        d.value.filter((x) => Ma(x, zt)),
        n.value
      )
    ), m = R(() => d.value.filter((x) => !f.value.includes(x) && !Ma(x, zt))), v = R(() => f.value.filter((x) => !wt(x))), y = Io(`dock-size:${((k = Un.identity) == null ? void 0 : k.root) || location.host}`, null), S = (x) => y.value ? y.value.collapsed && !y.value.opened.includes(x.id) : t.collapsed, _ = R(() => d.value.some(S)), T = R(() => (s.value = v0(f.value.length, s.value, v.value.length)) && !o.value && !d.value.some(S));
    function W() {
      y.value = { collapsed: !_.value, opened: [] };
    }
    function J(x) {
      var C;
      if (!S(x)) return;
      const M = (C = y.value) != null && C.collapsed ? y.value.opened : [];
      y.value = { collapsed: !0, opened: [...M, x.id] };
    }
    const D = Io(`dock-folded:${((p = Un.identity) == null ? void 0 : p.root) || location.host}`, {}), B = (x) => {
      var M;
      return !!((M = zt(x.type)) != null && M.folds) && W0(D.value[x.id], Ma(x, zt) || t.folded);
    };
    function q(x) {
      D.value = { ...D.value, [x.id]: !B(x) };
    }
    function A(x) {
      D.value = { ...D.value, ...Object.fromEntries(f.value.map((M) => [M.id, M.id !== x.id])) }, o.value = !0;
    }
    function E() {
      D.value = Object.fromEntries(Object.entries(D.value).filter(([x]) => !f.value.some((M) => String(M.id) === x))), o.value = !1;
    }
    function b(x) {
      a.value = /* @__PURE__ */ new Set([...a.value, x.id]);
    }
    function w(x) {
      a.value = new Set([...a.value].filter((M) => M !== x.id));
    }
    return (x, M) => (c(), H(al, {
      tag: "div",
      name: "dock",
      duration: P(kr),
      class: "dock-stack"
    }, {
      default: j(() => [
        d.value.length > 1 ? (c(), h("div", V0, [
          L(de, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": _.value ? "Open all" : "Collapse all",
            onClick: W
          }, {
            default: j(() => [
              L(xt, {
                open: !_.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : O("", !0),
        (c(!0), h(z, null, te(m.value, (C) => (c(), H(Ro, {
          key: C.id,
          item: C,
          class: X({ timed: P(wt)(C) }),
          leaving: P(wt)(C) && !a.value.has(C.id),
          folded: B(C),
          collapsed: S(C),
          refusal: i.value[C.id],
          onOpen: (N) => J(C),
          onFold: (N) => q(C),
          onUndock: (N) => u(C, N),
          onMouseenter: (N) => b(C),
          onMouseleave: (N) => w(C)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !_.value ? (c(), h("div", G0, [
          g("span", null, $(f.value.length) + " runs", 1),
          L(de, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: E
          }, {
            default: j(() => [
              M[1] || (M[1] = ee(" Runs ", -1)),
              L(xt, { open: "" })
            ]),
            _: 1
          })
        ])) : O("", !0),
        (c(!0), h(z, null, te(T.value ? [] : f.value, (C) => (c(), H(Ro, {
          key: C.id,
          item: C,
          class: X({ timed: P(wt)(C) }),
          leaving: P(wt)(C) && !a.value.has(C.id),
          folded: B(C),
          collapsed: S(C),
          refusal: i.value[C.id],
          onOpen: (N) => J(C),
          onFold: (N) => q(C),
          onUndock: (N) => u(C, N),
          onMouseenter: (N) => b(C),
          onMouseleave: (N) => w(C)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        T.value ? (c(), H($r, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: j(() => [
            L(ye, {
              name: "runs",
              size: 14
            }),
            g("span", K0, $(f.value.length) + " runs", 1)
          ]),
          foot: j(() => [
            g("span", Y0, [
              (c(!0), h(z, null, te(f.value, (C) => (c(), H(P0, {
                key: C.id,
                item: C,
                onClick: (N) => A(C)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            L(de, {
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
}, I4 = /* @__PURE__ */ Y(J0, [["__scopeId", "data-v-5f556521"]]), $t = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, In = (e) => Math.min(Math.max(e, 0), 1), Z0 = (e) => {
  const t = In(e);
  return t * t * (3 - 2 * t);
}, gt = (e, t, n) => Z0((e - t) / (n - t));
function B4(e) {
  const t = In(e), n = In((t - 0.12) / 0.76) * $t.shuffles, a = Math.min(Math.floor(n), $t.shuffles - 1), s = n - a, o = gt(s, 0.26, 0.38) * (1 - gt(s, 0.76, 0.96)), l = gt(s, 0.38, 0.76), r = gt(t, 0, 0.12) * (1 - gt(t, 0.88, 1)), i = gt(s, 0.2, 0.34) * (1 - gt(s, 0.84, 1)), u = Math.sin(Math.PI * In((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / $t.shuffles, lift: $t.lift * o, ready: r, weight: i, follow: u, shuffle: a, phase: s };
}
function L4(e, t, n, a, s) {
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
}, N4 = (e) => Bo[e] ?? Bo.butler, Ts = 2400, X0 = 0.05;
function Q0({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, X0), l = Math.min(t + Ts * o, s), r = e + l * o;
  return r < n ? { y: r, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function D4(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function ey(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function j4(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const P4 = (e, t) => ({ ...e, stretch: t.stretch }), q4 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, _r = (e, t) => t >= (e.least ?? 0);
function F4(e, t, n) {
  if (!_r(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const W4 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), ty = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", Lo = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), ny = (e) => e.right > e.left && e.bottom > e.top;
function H4(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(ty)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let r = Lo(l, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (r = Lo(r, i.getBoundingClientRect()), a && (r.bottom = Math.min(r.bottom, a.top))), ny(r) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: r }] : [];
  });
}
function Er(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, r = 1;
    for (const [d, f, m] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const v = t[d] - e[d];
      if (Math.abs(v) < 1e-9)
        (e[d] < o[f] || e[d] > o[m]) && (r = -1);
      else {
        const y = (o[f] - e[d]) / v, S = (o[m] - e[d]) / v;
        l = Math.max(l, Math.min(y, S)), r = Math.min(r, Math.max(y, S));
      }
    }
    if (l > r || a && l >= a.share) continue;
    const i = e.x + (t.x - e.x) * l, u = e.y + (t.y - e.y) * l;
    a = { share: l, x: i, y: u, on: "surface", surface: s.id, dx: i - s.left, dy: u - s.top };
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
}, tn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), ay = (e) => e * e * (3 - 2 * e), Ee = (e, [t, n]) => ay(tn(e, t, n)), sy = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], it = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, _n = ([e, t], n) => e + n() * (t - e);
function oy(e) {
  return sy.map(() => {
    const t = _n(it.speed, e), n = _n(it.angle, e) * Math.PI / 180, a = _n(it.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [_n(it.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const ly = oy(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function ry(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * it.gravity * (t[2] - it.floor))) / it.gravity;
}
function U4(e, t, n = ly) {
  const a = _e.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = ry(o, a.from), r = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + r) return null;
  const i = Math.min(s, l), u = a.from.map((d, f) => d + o.velocity[f] * i);
  return u[2] -= it.gravity * i * i / 2, { at: u, turn: o.spin * i, landed: Math.max(0, s - l) / r };
}
const z4 = (e, t) => e && _e[e.name] ? { name: e.name, u: t / e.frames } : null;
function V4(e, t) {
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
const G4 = () => Array.from({ length: _e.pogo.count }, (e, t) => _e.pogo.bounce * (t + 1) / _e.pogo.count), Lt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function K4(e, t, n) {
  const { away: a, side: s } = _e.bug_smash, o = s * a * n, [l, r] = [t.left + Lt.margin * n, t.right - Lt.margin * n], i = Math.min(Math.max(e + o + s * Lt.reach * n, l), r), u = i - o - e, d = i - (s * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [i - t.left, d - t.left] };
}
function Y4(e, t, n) {
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
function J4(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Lt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = Q0({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Ie = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function Z4(e) {
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
function iy(e, t) {
  const n = _e.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = ey(e, o), r = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), u = e >= a + t * (s - a) ? t : r + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: r, shot: u };
}
function X4(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = _e.bug_shot, { frame: l, bug: r, shot: i } = iy(n, e.length), u = e.map((T, W) => ({ ...ss(T, t, Math.min(n / o.fps, Bn(W).shot)), shot: W < i })), d = Ee(l / o.frames, o.aim), [f, m] = [u[Math.max(r - 1, 0)], u[r]], v = e.map((T, W) => ({ bug: T, index: W, seconds: n / o.fps - Bn(W).shot, spot: ss(T, t, Bn(W).shot) })).filter((T) => T.seconds >= 0), y = v.flatMap((T) => {
    const W = (s == null ? void 0 : s.get(T.index)) ?? hy(T.bug, t, T.spot, s ? [] : a);
    return s == null || s.set(T.index, W), s && my(W, T.seconds, a), py(W, T.seconds, a);
  }), S = v.filter((T) => dy(T.bug)).map((T) => ({ seconds: T.seconds, from: T.spot })), _ = +(e[Math.max(r - 1, 0)].wall === "top") * (1 - d) + +(e[r].wall === "top") * d;
  return { bugs: u, frame: l, target: { x: f.x + (m.x - f.x) * d, y: f.y + (m.y - f.y) * d, back: _ }, slush: y, camera: S };
}
function Bn(e) {
  const t = _e.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function Q4(e, t, n, a) {
  const { limit: s, margin: o } = _e.bug_shot.back, [l, r] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((u, d) => {
    const f = Bn(d), m = ss(u, t, f.shot), v = Math.abs(m.y - n.y) / Math.tan(s * Math.PI / 180), y = m.x === i ? i - l >= r - i ? -1 : 1 : Math.sign(i - m.x), S = Math.abs(m.x - i) >= v ? i : m.x + y * v, _ = y > 0 ? Math.max(i, Math.min(S, r)) : Math.min(i, Math.max(S, l)), T = { from: i, to: _, begin: f.walk, end: f.aim };
    return i = _, T;
  });
}
function e$(e, t, n) {
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
const xe = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, cy = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function uy(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const dy = (e) => e.along * 97 % 1 < xe.camera, nn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * xe.gravity * t * t });
function fy(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * xe.gravity * (t.bottom - e.from.y))) / xe.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * xe.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / xe.gravity, on: "top" });
  const l = s.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let r = e.from;
  for (let u = 0; u < l.t; u += xe.step) {
    const d = Math.min(u + xe.step, l.t), f = nn(e, d), m = Er(r, f, n);
    if (m) return { ...m, t: u + (d - u) * m.share };
    r = f;
  }
  const i = nn(e, l.t);
  return { ...l, x: Math.min(Math.max(i.x, t.left), t.right), y: Math.min(Math.max(i.y, t.top), t.bottom) };
}
function hy(e, t, n, a = []) {
  const s = uy(e.along + 1), [o, l] = cy[e.wall], r = Math.atan2(l, o);
  return Array.from({ length: xe.count }, () => {
    const i = r + (s() - 0.5) * 2 * (xe.spread * Math.PI / 180), u = xe.speed[0] + s() * (xe.speed[1] - xe.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * u, vy: Math.sin(i) * u, r: xe.radius[0] + s() * (xe.radius[1] - xe.radius[0]) };
    return { ...d, ...fy(d, t, a) };
  });
}
function my(e, t, n) {
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
function py(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...nn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - xe.hold) / xe.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((d) => d.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const r = l ? l.left + a.dx : a.x, i = l ? l.top + a.dy : a.y, u = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - i)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: r, y: i, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: u, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function t$(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: r, fps: i } = _e.bug_shot;
  if (e < 0) return [];
  const u = (s[1] - s[0]) * r / i, d = (o[1] - o[0]) * r / i, f = Ee(e, [0, u]), m = Ee(e, [u, u + d]);
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
function n$(e, t, n, a, s) {
  const { sway: o, above: l } = _e.chute, r = { x: t.x, y: t.y - l * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [u, d] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], f = (S) => {
    const [_, T] = [S.x - e.at.x, S.y - e.at.y];
    return { x: r.x + _ * u - T * d, y: r.y + _ * d + T * u };
  }, [m, v] = [...n].sort((S, _) => S.x - _.x), y = e.ends.map(f);
  return { left: r.x - e.at.x, top: r.y - e.at.y, middle: r, turn: i, lines: y.map((S, _) => ({ from: S, to: _ < y.length / 2 ? m : v })) };
}
const a$ = (e, t) => Ee(t, e.grows) * (1 - Ee(t, e.sinks));
function zn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: tn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: tn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function s$(e, t) {
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
const o$ = (e) => e === "pack_box";
function l$(e) {
  const { into: t, out: n } = zn(_e.rope_swing, e);
  return 1 - Ee(t, [0, 1]) * (1 - Ee(n, [0, 1]));
}
function r$(e) {
  const t = _e.rope_swing, { into: n, out: a } = zn(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Ee(n, [0, 1]) * (1 - Ee(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const gy = { after: 3 }, Rs = 10, vy = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, yy = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, by = { weight: 19 }, Ar = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, wy = { every: 120 }, Cr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Or = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, ky = {
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
}, dn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: Rs }), ae = (e, t, n = {}) => dn(e, "clip", t, n), Sa = (e, t, n = {}) => dn(e, "look", t, n), No = (e, t, n = {}) => dn(e, "gaze", t, n), pe = (e, t, n = {}, a = {}) => ({ ...dn(e, "pick", t, n), ...a }), we = (e) => dn("nothing", "nothing", e, {}), $y = 120, xy = 300, _a = (e, t) => ({ ...ae(e, t), cooldown: xy }), re = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), My = () => [ae("joy", 2)], vt = (e, t, n, a, s = {}) => ({ ...ae(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), yt = (e) => ({ ...e, cooldown: vy[e.name] }), Ht = (e) => ({ ...e, shenanigan: !0, lasts: yy[e.name] }), aa = [
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
  ...re("bar_done", { holds: !0 }, My()),
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
  ...Object.entries(ky).flatMap(([e, t]) => re(`reacted:${e}`, {}, [Sa(t, 1)])),
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
  ...re("held:search", { cooldown: $y }, [_a("search", 3), { ..._a("binoculars", 2), when: { home: !0 } }, { ..._a("glass_bubble", 2), when: { bubble: !0 } }]),
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
  ...re("unit", { cooldown: Ar.build.cooldown }, [pe("unit", by.weight), we(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...re("progress_jump", { cooldown: 6 }, [ae("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...re("perch", {}, [{ ...pe("hang", 1, { hands: !0, free: !0 }), cooldown: wy.every }, pe("stand", 5)]),
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
], Tr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), Rr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), Sy = (e) => Array.isArray(e) ? e[0] : e, _y = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, Ey = (e) => aa.some((t) => t.when.moment === e);
function Ay(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || Rr(d).every(([f, m]) => n(f) >= Sy(m)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = aa.filter((d) => Tr(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), r = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= gy.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, i = r.filter((d) => {
    var f;
    return d.type === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return i.some((d) => d.type !== "nothing") ? i : r;
}
function ze(e, t) {
  const n = Ay(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (Ir(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Ir(e, t, n) {
  var a;
  for (const [s, o] of Rr(t)) (a = e.memory) == null || a.set(s, e.now + _y(o, n));
}
function i$(e, t, n) {
  Ir(e, aa.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const c$ = (e) => Object.values(Ar).find((t) => Tr(t.when, e)) ?? null, Cy = (e, t, n) => n - t <= (e.lifetime ?? Rs), u$ = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || _r(e.clip, t));
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
}, d$ = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Lr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), f$ = {
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
}, h$ = 120, Oy = 20, m$ = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < Oy), Ty = (e) => os[e] || os.idle, p$ = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Nr = "airborne", Ry = "landing", Iy = "travelling", Dr = "grounded", g$ = ({ airborne: e, landing: t, trip: n }) => e ? Nr : t ? Ry : n != null && n.started ? Iy : Dr;
function v$(e, t) {
  var s;
  const n = By(e, t);
  return e.mode === Dr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function By(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: r, beat: i, state: u, doing: d, doingFacing: f = 0, readingFacing: m = null } = e;
  if (n === Nr && r.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? r.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...Ly(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (r.posture === "hang") return { clip: `hang_${r.grip}`, facing: r.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (r.view && u === "asking") return { clip: "point", facing: 0 };
  const v = m !== null && r.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: v ? m : e.composeFacing ?? 0 } : { clip: t(d, r.posture) ? d : Ty(u), facing: v ? m : r.posture === "sit" ? r.face : f };
}
function Ly(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const ls = (e) => e.outcome, Ny = "plugin:code-commandments:sins:", Do = (e) => e.type === "plugins.card" && e.markKey.startsWith(Ny), Dy = [
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
], y$ = (e, t) => e.filter((n) => n.author === "user" && Wn(n.read_at) > t).map((n) => ({ beat: "read_message", time: Wn(n.read_at), card: Jl(n) })).sort((n, a) => n.time - a.time), jo = { user: "reacted", agent: "agent_reacted" };
function b$(e, t) {
  return e.filter((n) => jo[n.author] && St(n) > t).map((n) => ({ beat: `${jo[n.author]}:${n.emoji}`, time: St(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const jy = [.../* @__PURE__ */ new Set([...Object.values(Cr).flatMap((e) => Object.keys(e)), ...Object.keys(Or)])];
function w$(e, t) {
  return e.filter((n) => n.author === "agent" && St(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = jy.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: St(n), card: Jl(n) })).sort((n, a) => n.time - a.time);
}
const Py = (e) => new Br(e).isTest(), Vn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[ls(e)] || "";
}, qy = 1800, Fy = (e, t) => {
  if (Vn(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && Vn(n) !== "finished" && Number(e.time) - Number(n.time) <= qy ? "tests_fixed" : "tests_passed";
};
function k$(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(Py), s = a.filter((r) => Vn(r)), o = s.filter((r) => t.get(r.key) === "" || !t.has(r.key) && Number(r.time) > n);
  return a.forEach((r) => t.set(r.key, Vn(r))), o.map((r) => ({ beat: Fy(r, s), time: Number(r.time), card: r.key }));
}
function $$(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(ls(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: ls(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const x$ = (e) => e.map((t) => {
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
function M$(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function S$(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function _$(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((r) => r.time > t).map((r) => {
    var i;
    return { beat: (i = Dy.find((u) => u.matches(r))) == null ? void 0 : i.beat, time: r.time, card: r.key };
  }).filter((r) => r.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((r, i) => r.time - i.time);
}
function Is(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const Po = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function Wy(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const r = (s + o) / 2;
    Is(e, t, r, a).pitch > n ? s = r : o = r;
  }
  return (s + o) / 2;
}
function E$(e, t, n, a = {}) {
  const s = ze({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : Ey(`held:${e}`) ? "idle" : e;
}
const Te = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function A$(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Te.ahead * n ? 180 : Math.sign(a) * Te.turn;
}
const qo = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function C$(e, t) {
  const n = Math.min(Te.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Te.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Te.lines, Math.floor((e.bottom - e.top - 2 * a) / Te.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Te.sweep) % s, r = o % Te.sweep, i = Te.sweep - Te.returnSeconds, u = qo((r - i) / Te.returnSeconds), d = r <= i ? qo(r / i) : 1 - u, f = l + ((l + 1) % s - l) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + f * Te.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Fo = 3, jr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, Wo = 12, O$ = (e, t) => ({ mood: e, began: t, seen: 0 });
function T$(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!jr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= Fo ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * Wo) / Wo, lasts: Fo } };
}
const R$ = (e) => e.posture === "hang" && !jr(e.face), Hy = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), Uy = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function I$(e, t, n) {
  return Hy.has(e) ? 1 / 0 : !Uy.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Pr(n - t.began, t.share) - et.lead, 0);
}
const zy = 5;
function B$(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= zy ? { beat: "long_walk", time: n } : null };
}
const Vy = 30, En = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function L$(e, t, n, a, s = null) {
  if (t && n < t.until || !En.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = ze({ moment: "spell", state: e, tally: s }, a), [l, r] = En.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (r - l), next: n + En.every } : { state: e, began: 0, until: 0, next: n + En.every };
}
const N$ = (e, t, n) => t && n < t.until && Lr.has(e.state) ? { state: t.state, since: t.began } : e, et = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Pr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function D$(e, t, n, a) {
  var r;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = Pr(o, e.share);
  return s ? { eager: Gy(t, l), moment: null } : l > et.lead ? { eager: t, moment: null } : l < et.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > et.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < et.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((r = ze({ moment: "eager", slow: !0 }, n)) == null ? void 0 : r.name) === "eager" }, moment: null };
}
function Gy(e, t) {
  return e.on && t > et.lead + et.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= et.lead && t >= et.least ? { ...e, on: !0, calm: !1 } : e;
}
const Ky = 1, Yy = { look: "look", gaze: "gaze" };
function Jy(e, t, n, a, s = "", o = () => !0, l = null) {
  const r = ze({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return r ? { [Yy[r.type] ?? "clip"]: r.name, toward: r.toward ?? "", onto: !!r.onto, holds: !!r.holds, lifetime: r.lifetime } : null;
}
const Zy = (e, t, n, a, s, o = "", l = () => !0, r = null, i = "") => ze({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: r, ball: i }, s), Xy = (e, t, n, a, s, o = 0) => ze({ moment: "jump", high: e > Ky * t, memory: a, now: s, room: o }, n).name === "backflip", Qy = { work: ["building"], idle: ["standing"] };
function j$(e, t, n, a) {
  const s = os[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(Qy[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), Lr.has(e) ? { moments: o, began: n || a } : (n && a - n >= Vy && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function eb(e, t, n) {
  return !ze({ moment: "pondering", memory: e, now: t }, n) || !ze({ moment: "thought_cloud", memory: e, now: t }, n) ? null : ze({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Ho = { pondering: eb };
function P$(e, t, n, a, s, o) {
  if (Ho[e.beat]) {
    const r = Ho[e.beat](n.reacted, a, s);
    return r && o(r) ? { beat: { clip: r, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = Jy(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== Rs && { lifetime: l.lifetime } } } : null;
}
function q$(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = Zy(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return i && { clip: i.name, card: "", flies: !!i.flies };
}
const F$ = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function W$(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function H$(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const U$ = (e, t) => !!(e != null && e.watches) && !t.once, z$ = 10, V$ = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || Cy(a, a.queuedAt, n)), G$ = (e, t) => t ? null : e[0] ?? null;
function K$(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const Y$ = (e, t) => !t.during || !e.some((n) => n.during === t.during), tb = 2 * Math.PI, nb = 500;
function J$(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), r = l / nb, i = t && e.point && !!t.behind != !!e.point.behind, u = i && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + r, d) : Math.max(e.amount - r, d), m = tb * l / 1e3, v = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, S = (u ? v : t != null && t.behind && t.mood === "reading" ? { ...t } : t && v && !i ? s && !t.behind && !v.behind ? sb(v, t, n, m, s) : lb(v, t, n, m) : t) ?? v, _ = S != null && S.behind && S.mood === "reading" ? ab(e.point, S, n, l, s) : S;
  return { point: _ ?? null, toward: _ ? { x: _.x - n.x, y: _.y - n.y } : null, amount: f, at: a };
}
function ab(e, t, n, a, s) {
  const o = (b) => b * 180 / Math.PI, l = (b) => o(Math.atan2(Math.sin(b * Math.PI / 180), Math.cos(b * Math.PI / 180))), r = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, u = l(o(Math.atan2(t.x - n.x, -i)) - r), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - r), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), m = f ? l(e.readingFacing - r) : 0, v = f ? e.readingYaw + m : d, y = v + l(u - v), S = Math.min(Math.max(a / 1e3, 0), 0.1), _ = Te.turnSpeed * S, T = f ? v + Math.min(Math.max(y - v, -_), _) : y, W = f ? e.readingFollow + m : T, J = W + (T - W) * (1 - Math.exp(-S / Te.followSeconds)), D = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, B = o(Is(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), q = Math.min(Math.max(B, -D.up), D.down), A = Te.tipSpeed * S, E = f ? e.readingPitch + Math.min(Math.max(q - e.readingPitch, -A), A) : q;
  return { ...t, readingYaw: T, readingFollow: J, readingPitch: E, readingFacing: r };
}
function sb(e, t, n, a, { depth: s, above: o, tip: l }) {
  const r = (W) => {
    const { yaw: J, pitch: D } = Is(W.x - n.x, s, n.y - W.y, o);
    return { yaw: J, pitch: Math.min(Math.max(D, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [i, u] = [Po(r(e)), Po(r(t))], d = Math.acos(Math.min(Math.max(i[0] * u[0] + i[1] * u[1] + i[2] * u[2], -1), 1));
  if (d <= a) return { ...t };
  const f = a / d, [m, v] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [y, S, _] = i.map((W, J) => m * W + v * u[J]), T = s * y / S;
  return { ...t, x: n.x + T, y: n.y - Wy(T, s, -Math.asin(Math.min(Math.max(_, -1), 1)), o) };
}
const ob = 0.15;
function Z$(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= ob;
}
function lb(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), r = s + Math.max(-a, Math.min(a, l)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(r), y: n.y + i * Math.sin(r) };
}
const rb = (e) => !(e != null && e.on);
function X$(e, t, n) {
  if (rb(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((r) => r.beat === s.beat && r.card === s.card) === o);
  return { answer: [], held: a };
}
const an = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Ze = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Ea = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Uo = (e) => e * e * (3 - 2 * e);
function ib(e) {
  if (e < 0 || e >= Ze.seconds) return null;
  const t = Ea(e, ...Ze.flicker), n = Math.floor(t * Ze.flickers * 2) % 2 === 0, a = e < Ze.flicker[1] ? n ? 0.35 + 0.5 * t : Ze.dim : 1;
  return { strength: 1 - Uo(Ea(e, ...Ze.fade)), lit: a, white: e < Ze.flash[0] ? 0 : 1 - Uo(Ea(e, ...Ze.flash)) };
}
const Q$ = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function ex(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = ib(t - e.at);
  return a && { colour: an.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Ze.signs[e.tone], ...a } };
}
function tx(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function nx(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= an.looks || a === null && n - e.since >= an.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function ax(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (r) => (r + a * 12) % 12, o = (r) => 0.5 - 0.5 * Math.max(-1, Math.min(s(r) - 3, 9 - s(r), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const rt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, sx = { behind: 39, figure: 40, ahead: 41 }, cb = "[data-figure-pile]", ub = { amber: [1, 0.69, 0.125], good: an.colours.good, bad: an.colours.bad }, Ln = { phases: 4, ms: 230, dim: 0.25 }, ox = (e, t, n) => e !== "amber" || (t + n) % Ln.phases < Ln.phases / 2 ? 1 : Ln.dim, lx = (e) => e === "amber" ? Ln.phases : 1;
function rx(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const ix = Object.keys(ub), Ve = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Vt = ([e, t], n) => e + n() * (t - e);
function cx(e) {
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
function ux(e) {
  const t = Math.floor(e / Aa.high);
  return { left: -(rt.inside + rt.width / 2 + t * (rt.width + Aa.gap)), up: e % Aa.high * (rt.height - rt.top) };
}
const db = (e, t, n) => ze({ moment: "unit", memory: e, now: t }, n) !== null, fb = { after: 5 }, hb = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Br(t).isBuild());
function dx(e, t, n) {
  const a = hb(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= fb.after ? s : null;
}
function fx(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: db(n, a, s) } : null;
}
const zo = { ahead: 140, up: 70 };
function hx(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * zo.ahead, y: a - zo.up } } : o ? { at: { x: n(o), y: a - o.up - rt.height } } : t ? { at: null } : null;
}
const Ca = { least: 4e3, most: 1e4 }, mb = (e) => Ca.least + e() * (Ca.most - Ca.least), bt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function mx(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = mb(t);
    if (n.length >= bt.most || t() >= bt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (bt.at[0] + t() * (bt.at[1] - bt.at[0]));
    n.push({ from: o, to: o + bt.ms }), a = o + bt.ms;
  }
}
const px = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), gx = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), qr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), vx = new Set(aa.filter((e) => qr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), pb = (e) => e.some((t) => t.state === "built"), yx = (e, t) => pb(t) ? e.filter((n) => !qr.has(n.beat)) : e, ut = { reach: 40, room: 6 }, gb = (e, t) => t <= e - ut.reach + 2, bx = (e, t, n) => gb(e, n) ? t - ut.reach : e - ut.reach - ut.room, wx = (e, t, n, a) => a > 0 && t < e && t + ut.reach >= e - 2 ? Math.min(n, Math.max(e, t + ut.reach)) : e, Oa = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, kx = (e) => Vt(e() < Oa.longShare ? Oa.long : Oa.short, e), vb = 2 * rt.width;
function $x(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= vb ? o : e + (o - e + s / 2) % s;
}
const yb = 60, xx = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= yb, Vo = "[data-figure-home]", fn = () => {
  var t;
  const e = document.querySelector(Vo);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Vo)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, bb = "[data-figure-docked-bars]", wb = "[data-figure-chat-foot]", kb = [0.85, 0.6, 0.35, 0.15], $b = ["question", "waiting", "suggestion"], Mx = (e, t) => $b.find((n) => e[n] > 0 && t[n] === "behind") || null;
function Sx() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const xb = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Mb = "[data-figure-newest]";
function Fr() {
  var a, s;
  const e = (a = fn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Mb), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
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
function _x(e, t, n, a = Fr()) {
  if (!a || sn(t, e, a)) return null;
  const s = oa(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, r = At(), i = t.posture === "stand" ? Ns * e.size : Yr * e.size, u = Math.max(n.left + i, r.left + o), d = Math.min(n.right - i, r.right - l);
  return [a.left - $t.gap - l, a.right + $t.gap + o].map((m) => ({ ...t, x: m })).filter((m) => m.x >= u && m.x <= d && sn(m, e, a) && Qb(m, e)).sort((m, v) => Math.abs(m.x - t.x) - Math.abs(v.x - t.x))[0] ?? null;
}
const Ta = 0.26, Wr = 0.54, Sb = 1.25 / 5.4, hn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Ta, travels: "stand" },
  lounge: { drop: Ta, travels: "stand" },
  composed: { drop: Ta, travels: "stand" },
  hang: { drop: Wr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, Ex = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * Sb * Math.cos(t * Math.PI / 180),
  y: 1 - n - Wr
}), Yt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), _b = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), Ax = (e, t) => (e === "sit" ? _b.has(t) : Yt.has(e)) ? e : "stand";
function Cx(e, t) {
  return e.facing === t.facing || !Yt.has(e.posture) && !Yt.has(t.posture) ? t : { posture: "stand", facing: Yt.has(e.posture) ? e.facing : t.facing };
}
const Ox = 0.25, Tx = (e, t) => Yt.has(e) && hn[t].drop === 0, Hr = 2, Eb = 90, Ab = 180, Cb = 140, Ob = 280, Tb = 420, Rb = 0.25, Ib = 290, Bb = 600, Lb = "cubic-bezier(0.2, 0.7, 0.4, 1)", Nb = "cubic-bezier(0.55, 0, 0.9, 0.6)", Ra = 5;
function Gn(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: r = !1, random: i = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Ra) return null;
  (l || r) && (o = Math.max(o, Hr));
  const v = o > 1, y = Math.abs(t.x - e.x), S = y < Ra ? 0 : y / (Eb * o) * 1e3, _ = Math.min(S, v ? Cb : Ab), T = Math.abs(t.y - e.y), W = t.y < e.y, J = W && !m && Xy(T, n, i, u, d, f), D = W ? Tb + Math.min(T, 400) * Rb : Math.sqrt(2 * T / Ts) * 1e3, B = {
    x: t.x,
    y: t.y,
    ms: T > Ra ? J ? Bb : D : 0,
    lead: J ? Ib : W ? Ob : 0,
    easing: W ? Lb : Nb,
    hopping: !0,
    clip: J ? "backflip" : W ? "jump" : "fall"
  }, q = { x: t.x, y: t.y, ms: S + _, lead: 0, easing: "linear", ramp: _, ...v ? { clip: "run" } : {} }, A = m ? Db(t, n) : B, E = W && !a ? [{ ...q, y: e.y }, A] : [{ ...B, x: e.x }, q];
  return { way: Math.sign(t.x - e.x) || 1, legs: E, lands: !s, pace: o, running: v };
}
const Db = (e, t) => ({ x: e.x, y: e.y, ms: _e.pogo.frames / _e.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), jb = (e, t) => e.postures.includes(t) ? t : e.postures[0], Rx = (e, t, n) => e.posture === "walk" && n ? "walk" : jb(e.clip, t), at = (e, { size: t, below: n }, a = e.posture) => {
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
function Ix(e, t, n = At()) {
  const a = at(e, t);
  return a.left >= n.left + Go && a.right <= n.right - Go;
}
function Ls(e, t, n = At()) {
  const a = at(e, t), s = a.right - a.left, o = oa(e), [l, r] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - An && r <= n.right + An && a.top >= n.top - An && i <= n.bottom + An;
}
const Kn = [0.35, 0.5, 0.65], Yn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ce = { left: Kn[0], right: Kn.at(-1), top: Yn[0], bottom: Yn.at(-1) }, Pb = 0.24;
function oa(e) {
  if (e.posture === "stand") return { left: Ce.left, right: Ce.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Pb * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ce.left, t), right: Math.max(Ce.right, t) };
}
function qb(e, { size: t }, n = At()) {
  const a = oa(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const Ns = (Ce.right - Ce.left) / 2 + 0.08;
function Bx(e, t) {
  return e === "hang" ? Ce : { ...Ce, bottom: Math.min(Ce.bottom, 1 - t - hn[e].drop) };
}
const Fb = "[data-figure-agent]";
function Ur(e, t, n = "", a = "") {
  var r;
  const s = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !Bs(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const i of [l - 1, l].filter((u) => u >= 0)) {
    if (!o.data[i].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, i), u.setEnd(o, i + 1), [...u.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const zr = (e) => Yn.flatMap(
  (t) => Kn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Ds(e, t, n = "") {
  if (!sn(e, t)) return Kn.length * Yn.length;
  const a = at(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(xb)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: i }) => i.width && i.height && sa(s, i) && Bs(r)).map(({ rect: r }) => r), l = (r, i) => o.some((u) => r >= u.left && r <= u.right && i >= u.top && i <= u.bottom);
  return zr(s).filter(([r, i]) => l(r, i) || Ur(r, i, n)).length;
}
function Wb(e, t) {
  const n = at(e, t);
  return zr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Ur(a, s, "", Fb)).length;
}
const Ko = 4;
function Lx(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Ko; o <= s; o += Ko)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const r = { ...t, x: l };
      if (!Wb(r, e) && sn(r, e)) return r;
    }
  return null;
}
function on(e, t, n) {
  const a = At(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => Ls(l, t, a) && sn(l, t)).map((l) => ({ spot: l, covered: Ds(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, r) => r.covered < l.covered || r.covered === l.covered && r.away < l.away ? r : l
  ).spot : null;
}
const Vr = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), Hb = [0.5, 0.25, 0.75], Ub = (e) => Vr(e.getBoundingClientRect(), Hb), Gr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, zb = Ns, Vb = (e, t, { size: n }, a = zb) => Kr(e, Gr[t], a * n, "stand");
function Kr(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const Gb = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Yr = 0.1, Kb = (e, t, { size: n }) => Kr(e, Gb[t], Yr * n, "sit"), Yb = (e) => ((e + 180) % 360 + 360) % 360 - 180, Ia = 60;
function Nx(e, t) {
  const n = Yb(t);
  return !e.aside || Math.abs(n) >= Ia ? t : n < 0 ? 360 - Ia : Ia;
}
const Jt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, Jb = (e) => [.../* @__PURE__ */ new Set([e, ...Jt.turns.map((t) => (t + 360) % 360)])];
function Dx(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = Jb(t), l = Jt.every[0] + a() * (Jt.every[1] - Jt.every[0]);
  return { face: t, from: s ? Zb(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function Zb(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Jt.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function jx(e, t) {
  const { element: n, edge: a } = la(), s = ["left", "right"].map((r) => mn(Kb(a, r, e), e)).filter((r) => n && Ls(r, e) && !Ds(r, e)), o = (r) => t ? Math.abs(r.x - t.x) : 0, l = s.sort((r, i) => o(r) - o(i))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function Px(e, t, { size: n }) {
  const a = (Ce.right - Ce.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Jr } : e;
}
const Jr = 7;
function Zr() {
  const e = [...document.querySelectorAll(cb)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function Xb(e, t) {
  const n = at(e, t), a = n.right - n.left;
  return { left: n.left + Ce.left * a, right: n.left + Ce.right * a, top: n.top + Ce.top * a, bottom: n.bottom };
}
function Qb(e, t) {
  const n = Zr();
  return !n || !sa(Xb(e, t), n);
}
const ew = 4;
function la() {
  const e = pn(), t = Zr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > ew || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Jr - n, 0) } };
}
const qx = ({ size: e, below: t }) => (1 - t) * e;
function mn(e, t) {
  const n = At(), { size: a, below: s } = t, o = hn[e.posture].drop * a;
  return { ...qb(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const rs = (e, t) => Object.keys(Gr).map((n) => mn(Vb(e, n, t), t)), js = (e, t) => Vr(e, kb).map((n) => mn(n, t)), Xr = (e, t, n) => on(e, t, n) ?? e[0];
function Fx(e, t) {
  const { element: n, edge: a } = la();
  return { ...Xr(rs(a, e), e, t), view: null, on: n };
}
function Wx(e, t, n, a) {
  const { element: s, edge: o } = la(), l = (a ? rs(o, t) : [...rs(o, t), ...js(o, t)]).filter(
    (u) => !sa(at(u, t), e)
  ), r = on(
    l.filter((u) => u.x > (e.left + e.right) / 2),
    t,
    n
  ), i = r && !Ds(r, t) ? r : on(l, t, n);
  return i && { ...i, view: null, on: s };
}
function pn() {
  var a;
  const e = fn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(bb);
  if (!t) return { ...ra(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Yo = { within: 2 };
function Hx(e) {
  const { element: t, docked: n, edge: a } = pn();
  if (!n || e.on !== t) return !0;
  const s = ra().edge;
  return a.left > s.left + Yo.within || a.left + a.width < s.left + s.width - Yo.within;
}
const tw = "[data-figure-closing]";
function Ux() {
  var n;
  const { element: e, docked: t } = pn();
  return t && !!((n = e.firstElementChild) != null && n.matches(tw));
}
const Qr = "[data-figure-progress]";
function zx(e) {
  const t = e.querySelector(Qr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function Vx(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const nw = { across: 300, above: 380, below: 60 };
function Gx(e) {
  const { across: t, above: n, below: a } = nw;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: aw(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const aw = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), ei = "[data-figure-bar]", is = { back: 144, along: 0.4 };
function Kx(e) {
  const { element: t, docked: n, edge: a } = pn(), s = n ? t.querySelector(ei) : null;
  if (!(s != null && s.querySelector(Qr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...mn({ x: o - is.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function Yx(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < is.along * a.size ? t.x + is.along * a.size : e.x, y: e.y, behind: !0 };
}
function Jx(e) {
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
function Zx(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: r } = ra(), i = n === null ? sw(r, e, o === null ? t : { x: o, y: r.top }, a, s) : mn({ x: n, y: r.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: l, stays: !0 };
}
function sw(e, t, n, a, s) {
  const o = js(e, t), l = Math.min(...o.map((i) => i.x)), r = o.filter((i) => i.x + a + rt.width < s && i.x + a - ut.reach - ut.room >= l);
  return on(r.length ? r : o, t, n);
}
const ow = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function Xx(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: r = Math.random, via: i = [], memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  (o || l) && (s = Math.max(s, Hr));
  const v = (J) => {
    const D = at(J, n, hn[J.posture].travels);
    return { x: D.left, y: D.top };
  }, y = t.ladder ?? e.ladder;
  if (y && !(t.ladder && e.ladder)) return lw(v(e), v(t), v({ ...y.foot, posture: "stand" }), y.way, !!t.ladder, n, s);
  const [S, ..._] = [e, ...i, t].map(v), T = Gn(S, _[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: r, memory: u, now: d, room: f, pogo: m }), W = _.slice(1).map((J, D) => {
    var B;
    return (B = Gn(_[D], J, n.size, { random: r, memory: u, now: d, room: f })) == null ? void 0 : B.legs.find((q) => q.hopping);
  });
  return T && { ...T, legs: [...T.legs, ...W.filter(Boolean)] };
}
function lw(e, t, n, a, s, o, l) {
  const r = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / ow.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? Gn(e, n, o.size, { pace: l }) : Gn(n, t, o.size, { pace: l }), u = s ? [...(i == null ? void 0 : i.legs) ?? [], r(n, t)] : [r(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: l, running: l > 1 };
}
function Qx(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function e8(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && on(Ub(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = la();
  return { ...Xr(js(s, t), t, n), view: null, on: a };
}
const rw = "[data-figure-bubble]", iw = 250;
let Zt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), ti = 0;
const Ft = () => Zt, Ba = /* @__PURE__ */ new WeakMap();
let cw = 0;
function Ps(e) {
  return Ba.has(e) || Ba.set(e, `floor-${++cw}`), Ba.get(e);
}
const uw = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, dw = () => {
  var e, t;
  return ((t = (e = fn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function fw(e, t) {
  var a;
  const n = (a = e.querySelector(wb)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function hw(e, t) {
  const n = e && fw(e, t), a = e ? [...e.querySelectorAll(rw)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || uw(l, n))).map(({ element: o, type: l, box: r }) => ({ id: Ps(o), type: l, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const mw = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= iw ? (t.top - a.top) / s * 1e3 : 0;
};
function ni(e = Zt, t = performance.now()) {
  const n = At(), a = dw(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: r } = pn(), i = [];
  o && i.push({ id: "home", type: l ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const u = ra();
  return u.element && i.push({ id: Ps(u.element), type: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), i.push(...hw(a, s)), i.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((d) => Object.freeze({ ...d, vy: mw(e, d, t) }))) });
}
const cs = /* @__PURE__ */ new Set();
function pw(e) {
  return cs.add(e), () => cs.delete(e);
}
function gw() {
  ai();
  const e = () => {
    ti = requestAnimationFrame(e), !document.hidden && (Zt = ni(Zt), cs.forEach((t) => t(Zt)));
  };
  e();
}
function ai() {
  cancelAnimationFrame(ti);
}
const qs = 5, vw = 56, yw = { share: 0.6 }, bw = (e) => -Math.sqrt(2 * Ts * yw.share * e), Dt = (e, t) => e.find((n) => n.id === t) ?? null;
function t8(e, t = ni().floors) {
  const n = Dt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : Ps(e.on) : null, o = s && Dt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function si({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, r, i = Ft().floors) {
  const u = Dt(i, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: a, face: s };
  return (l || ww(u, d, o)) && kw(d, r, i) ? { x: d.x, y: d.y } : null;
}
const Fs = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, ww = (e, t, n) => !Fs({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function n8(e, t = Ft().floors) {
  if (!Fs(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= qs && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function kw(e, t, n = Ft().floors) {
  const a = Dt(n, "home");
  return e.posture === "hang" && a && at(e, t).bottom >= a.top ? !1 : Ls(e, t);
}
function a8(e, t, n, a = Ft().floors) {
  const s = si(e, n, a);
  if (!e.home) return $w(e, t, s, a);
  if (!s) return null;
  const o = Dt(a, "home"), l = s.y - t.y, r = l > qs ? "dropping" : -l > vw ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: r };
}
function $w(e, t, n, a) {
  const s = n ? Dt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: bw(e.risen) };
  if (!n) return null;
  if (Fs(t) && n.y - t.y > qs) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function s8(e, t, n) {
  const a = Ns * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function o8(e, t, n, a = Ft().floors) {
  const s = t && si(t, n, a);
  return s ? { ...e, ...s } : e;
}
const xw = ["data-type"], Mw = { class: "figure-floor-name" }, Sw = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ge({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      g("span", Mw, $(e.floor.type), 1)
    ], 12, xw));
  }
}, _w = /* @__PURE__ */ Y(Sw, [["__scopeId", "data-v-4e0f1e2e"]]), Ew = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Aw = {
  __name: "FigureFloors",
  setup(e) {
    const t = Ke(Ft().floors);
    let n = () => {
    };
    return Re(() => {
      n = pw((a) => t.value = a.floors), gw();
    }), Be(() => {
      n(), ai();
    }), (a, s) => (c(), h("div", Ew, [
      (c(!0), h(z, null, te(t.value, (o) => (c(), H(_w, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, l8 = /* @__PURE__ */ Y(Aw, [["__scopeId", "data-v-e519168b"]]), La = (e) => typeof e == "number" ? e : Date.parse(e);
function r8(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: La(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => La(s.row.created_at) - La(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const Cw = 3, Na = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function Ow(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Na[n.grouping]) == null ? void 0 : a.call(Na, e.row, n)) || "";
}
function Tw(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function i8(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= Cw ? [Tw(a, t)] : a), a = [];
  };
  for (const l of e) {
    const r = Ow(l, t);
    r !== s && o(), s = r, r ? a.push(l) : n.push(l);
  }
  return o(), n;
}
const Rw = 1e3;
function Iw() {
  const e = I(Date.now()), t = setInterval(() => e.value = Date.now(), Rw);
  return ft(() => clearInterval(t)), e;
}
const Bw = ["datetime", "title"], ia = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Iw(), a = R(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, $(P(cr)(e.at, P(n))), 9, Bw));
  }
};
function c8(e) {
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
function Lw(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const u8 = (e) => (t) => t.filter((n) => n.id !== e), d8 = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), f8 = (e) => (t) => [...t, e], h8 = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function m8(e, t = {}) {
  const n = We(), a = I(null), s = I("");
  async function o(...l) {
    const r = await n.read(e(...l), t);
    s.value = r.ok ? "" : r.error, r.ok && (a.value = r.value);
  }
  return { value: a, failure: s, load: o };
}
function p8(e) {
  const t = We(), n = I("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Cn = /* @__PURE__ */ new Map();
function Nw(e, t) {
  if (Cn.has(e)) return Cn.get(e);
  const n = t().finally(() => Cn.delete(e));
  return Cn.set(e, n), n;
}
function g8() {
  const e = We(), t = I(null), n = I("");
  async function a() {
    const s = await Nw(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const Dw = { class: "cards-page" }, jw = { class: "cards-bar" }, Pw = { class: "cards-count" }, qw = { class: "cards" }, Fw = {
  key: 1,
  class: "cards-note"
}, Ww = {
  key: 2,
  class: "cards-note"
}, Hw = ["data-row", "onClick"], Uw = { class: "card-head" }, zw = { class: "card-title" }, Vw = { class: "card-foot" }, Gw = {
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
    return (a, s) => (c(), h("div", Dw, [
      g("div", jw, [
        g("span", Pw, $(e.rows.length) + " " + $(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        L(de, Le({
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
      g("div", qw, [
        e.loaded ? e.failure ? (c(), h("p", Fw, $(e.failure), 1)) : e.rows.length ? O("", !0) : (c(), h("p", Ww, "No " + $(e.noun) + "s yet", 1)) : (c(), H(_t, {
          key: 0,
          shape: "cards"
        })),
        (c(!0), h(z, null, te(e.rows, (o) => (c(), h("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          g("span", Uw, [
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
          g("span", zw, $(e.title(o)), 1),
          g("span", Vw, $(e.foot(o)), 1)
        ], 8, Hw))), 128))
      ]),
      ue(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, v8 = /* @__PURE__ */ Y(Gw, [["__scopeId", "data-v-990e6b37"]]), Jo = "newest";
function y8(e, { title: t, isOpen: n = null }) {
  var u;
  const a = (u = Oe(Ne, null)) == null ? void 0 : u.search, s = I(""), o = I(Jo), l = I("all"), r = R(() => {
    const d = s.value.trim().toLowerCase(), f = e.value.filter((m) => Lw(m, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(m) === (l.value === "open")));
    return o.value === Jo ? f : [...f].sort((m, v) => t(m).localeCompare(t(v)));
  }), i = R(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: r, filtering: i, hasStates: !!n };
}
const Kw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, Yw = 40, Jw = "top", Zw = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, a = (f = Oe(Ne, null)) == null ? void 0 : f.autoScroll, s = R(() => a === Jw), o = I(null), l = I(!1), r = (m) => s.value ? m.scrollTop : m.scrollHeight - m.scrollTop - m.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function d() {
      l.value = r(o.value) >= Yw;
    }
    return he(() => n.rowCount, async () => {
      await mt(), !l.value && o.value && (o.value.scrollTop = i());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (m, v) => (c(), h("div", Kw, [
      g("div", {
        ref_key: "pane",
        ref: o,
        class: X(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        ue(m.$slots, "default", {}, void 0, !0)
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
            onClick: u
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
}, b8 = /* @__PURE__ */ Y(Zw, [["__scopeId", "data-v-3accb764"]]), Xw = ["aria-selected", "data-tab", "onClick"], Qw = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, ek = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Oe(Ne, null), o = R(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = I(null), r = I({ left: 0, width: 0, slides: !1 }), i = (m) => n.answer[m.count_field] !== void 0;
    function u(m) {
      var y;
      const v = (y = l.value) == null ? void 0 : y.querySelector(".inner-tab.on");
      if (!v) return void (r.value = { left: 0, width: 0, slides: !1 });
      r.value = { left: v.offsetLeft, width: v.offsetWidth, slides: m }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, v.offsetLeft - 12));
    }
    const d = () => mt(() => u(!0));
    let f = null;
    return Re(() => {
      var m;
      u(!1), f = new ResizeObserver(() => u(!1)), f.observe(l.value), (m = document.fonts) == null || m.ready.then(() => u(!1));
    }), Be(() => f == null ? void 0 : f.disconnect()), he(() => {
      var m;
      return (m = n.active) == null ? void 0 : m.key;
    }, d), he(() => n.answer, d, { deep: !0 }), (m, v) => (c(), h("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (c(!0), h(z, null, te(o.value, (y) => {
        var S, _;
        return c(), h("button", {
          key: y.key,
          type: "button",
          role: "tab",
          class: X(["inner-tab", { on: ((S = e.active) == null ? void 0 : S.key) === y.key }]),
          "aria-selected": ((_ = e.active) == null ? void 0 : _.key) === y.key,
          "data-tab": y.key,
          onClick: (T) => a("choose", y)
        }, [
          ee($(y.label) + " ", 1),
          i(y) ? (c(), h("span", Qw, $(e.answer[y.count_field]), 1)) : O("", !0)
        ], 10, Xw);
      }), 128)),
      g("i", {
        class: X(["inner-tabs-line", { slides: r.value.slides }]),
        style: ge({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, w8 = /* @__PURE__ */ Y(ek, [["__scopeId", "data-v-63fcd326"]]), tk = {
  class: "tab-body",
  "data-tab-body": ""
}, nk = { "data-tab-content": "" }, ak = {
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
    }), (s, o) => (c(), h("div", tk, [
      n.value ? (c(), H(_t, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : O("", !0),
      Ye(g("div", nk, [
        ue(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [ll, !n.value]
      ])
    ]));
  }
}, k8 = /* @__PURE__ */ Y(ak, [["__scopeId", "data-v-63876533"]]), sk = {}, ok = { class: "menu-label" };
function lk(e, t) {
  return c(), h("span", ok, [
    ue(e.$slots, "default", {}, void 0, !0)
  ]);
}
const us = /* @__PURE__ */ Y(sk, [["render", lk], ["__scopeId", "data-v-aa955b3e"]]), rk = {
  class: "search-bar",
  "data-search-bar": ""
}, ik = { class: "search-bar-control" }, ck = ["value", "placeholder", "aria-label"], uk = ["aria-expanded"], dk = {
  key: 0,
  "data-menu-count": ""
}, fk = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var T;
    const a = e, s = n, o = bi(), l = ((T = Oe(Ne, null)) == null ? void 0 : T.search) ?? {}, r = R(() => l.placeholder || a.placeholder), i = l.context ?? [], u = I(null), d = I(null), f = I([]), m = R(() => f.value.length ? f.value[f.value.length - 1].next : i), v = R(() => !!o.menu || i.length > 0), y = (W) => {
      f.value = [], d.value = d.value ? null : W.currentTarget;
    };
    function S(W) {
      if (W.next.length) {
        f.value = [...f.value, W];
        return;
      }
      d.value = null, s("pick", W.click);
    }
    function _() {
      var W;
      s("update:modelValue", ""), (W = u.value) == null || W.focus();
    }
    return t({ focus: () => {
      var W;
      return (W = u.value) == null ? void 0 : W.focus();
    } }), (W, J) => {
      var D;
      return c(), h("div", rk, [
        g("div", ik, [
          L(ye, {
            class: "search-bar-icon",
            name: "search",
            size: 14
          }),
          g("input", {
            ref_key: "field",
            ref: u,
            class: "search-bar-input",
            type: "text",
            "data-search-input": "",
            value: e.modelValue,
            placeholder: r.value,
            "aria-label": r.value,
            onInput: J[0] || (J[0] = (B) => s("update:modelValue", B.target.value)),
            onKeydown: Xt(_, ["esc"])
          }, null, 40, ck),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: _
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
            "aria-expanded": !!d.value,
            onClick: y
          }, [
            e.menuCount ? (c(), h("span", dk, $(e.menuCount), 1)) : O("", !0),
            L(ye, {
              name: "caret",
              size: 12
            })
          ], 8, uk)) : O("", !0)
        ]),
        (D = P(l).button) != null && D.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: J[1] || (J[1] = (B) => s("pick", P(l).button.click))
        }, $(P(l).button.title), 1)) : O("", !0),
        ue(W.$slots, "default", {}, void 0, !0),
        d.value ? (c(), H(ea, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: J[3] || (J[3] = $e(() => {
          }, ["stop"])),
          onClose: J[4] || (J[4] = (B) => d.value = null)
        }, {
          default: j(() => [
            f.value.length ? (c(), H(Mt, {
              key: 0,
              "data-search-back": "",
              onClick: J[2] || (J[2] = (B) => f.value = f.value.slice(0, -1))
            }, {
              default: j(() => [
                ee("‹ " + $(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : O("", !0),
            (c(!0), h(z, null, te(m.value, (B) => (c(), H(Mt, {
              key: B.title,
              description: B.subtext,
              "data-search-entry": B.title,
              onClick: (q) => S(B)
            }, {
              default: j(() => [
                ee($(B.title) + $(B.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? O("", !0) : ue(W.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : O("", !0)
      ]);
    };
  }
}, hk = /* @__PURE__ */ Y(fk, [["__scopeId", "data-v-45374bed"]]), mk = {
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
    return (o, l) => (c(), H(hk, {
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
        (c(), h(z, null, te(a, (r) => L(Mt, {
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
        e.tools.hasStates ? (c(), h(z, { key: 0 }, [
          L(us, null, {
            default: j(() => [...l[3] || (l[3] = [
              ee("Show", -1)
            ])]),
            _: 1
          }),
          (c(), h(z, null, te(s, (r) => L(Mt, {
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
        ue(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, $8 = /* @__PURE__ */ Y(mk, [["__scopeId", "data-v-dab0064d"]]);
function x8() {
  const e = I(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const M8 = (e) => import(
  /* @vite-ignore */
  e
), pk = 86400, ds = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function gk(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((ds(t) - ds(e)) / pk);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function S8(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = ds(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: gk(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Da = 280, ja = 240, Pa = 120, vk = 6, yk = 14, ln = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function bk(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function oi(e, t) {
  const n = Math.max(0, bk(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function wk(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${yk}px)` }), e.offsetHeight, e.style.transition = `height ${Da}ms ${ln}`, e.style.height = `${l}px`;
  const r = s();
  let i = !1, u = !1;
  const d = () => {
    u || (u = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (u) return;
    n() && (t.scrollTop = oi(t, e));
    const m = s() - r;
    if (!i && m >= Da && (i = !0, e.style.transition = `opacity ${ja}ms ease-out, transform ${ja}ms ${ln}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), m < Da + ja) return a(f);
    d();
  };
  return a(f), d;
}
function _8(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${vk}px)` }), e.offsetHeight, e.style.transition = `opacity ${Pa}ms ease-out, transform ${Pa}ms ${ln}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), r = () => {
    if (n() && (t.scrollTop = oi(t, e)), s() - l < Pa) return a(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(r);
}
const kk = 140, On = 220, Zo = 5;
function E8({ gap: e = kk, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function r(d, f) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), f();
    });
  }
  function i() {
    const d = n.splice(0, Zo);
    if (s = d.length > 0, !s) return;
    let f = d.length;
    for (const m of d)
      m.el.style.display = m.display, r(m, () => {
        f -= 1, f || (o = t(i, e));
      });
  }
  const u = (d, f, m, v = wk) => {
    if (l || !f.pane || !f.follows()) return m();
    const y = { el: d, options: f, done: m, arrival: v, display: d.style.display || "" };
    if (!s)
      return s = !0, r(y, () => o = t(i, e));
    d.style.display = "none", n.push(y), n.length >= Zo && u.flush();
  };
  return u.flush = () => {
    var d;
    l = !0, queueMicrotask(() => l = !1);
    for (const f of [...a]) (d = f.cancel) == null || d.call(f);
    clearTimeout(o), s = !1;
    for (const f of n.splice(0))
      f.el.style.display = f.display, f.done();
  }, u;
}
function A8(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${On}ms ${ln}, opacity ${On}ms ease-in, margin ${On}ms ${ln}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, On);
}
const li = "chat.pins.minimised", Nn = I(jn(li, !1));
function Xo(e) {
  Nn.value = e, Ss(li, e);
}
function $k(e) {
  const t = R(() => e()), n = R(() => Nn.value ? [] : e()), a = () => Xo(!Nn.value), s = Date.now() / 1e3;
  return he(
    () => t.value.filter((o) => St(o) > s).length,
    (o, l) => o > l && Xo(!1)
  ), { pins: t, visible: n, minimised: Nn, toggle: a };
}
const xk = ["title"], Mk = {
  key: 0,
  class: "pins-count"
}, Sk = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = $k(() => t.pinRows);
    return (o, l) => P(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: X(["pins-toggle", { minimised: P(a), inline: e.inline }]),
      title: P(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = $e((...r) => P(s) && P(s)(...r), ["stop"]))
    }, [
      L(ye, {
        name: P(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      P(a) ? (c(), h("span", Mk, $(P(n).length), 1)) : O("", !0)
    ], 10, xk)) : O("", !0);
  }
}, C8 = /* @__PURE__ */ Y(Sk, [["__scopeId", "data-v-d073c504"]]), _k = ["title"], Ek = ["title"], Ak = { class: "diff-card-dir" }, Ck = { class: "diff-card-name" }, Ok = ["title"], Tk = ["title"], Rk = {
  key: 0,
  class: "diff-card-note"
}, Ik = ["href"], Bk = ["src", "alt"], Lk = { class: "diff-card-rows" }, Nk = { class: "diff-row-num" }, Dk = { class: "diff-row-sign" }, jk = { class: "diff-row-code" }, Pk = {
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
    function o(w) {
      (w.metaKey || w.ctrlKey) && (w.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, i = R(() => n.path.lastIndexOf("/") + 1), u = R(() => n.path.slice(0, i.value)), d = R(() => n.path.slice(i.value)), f = R(() => n.change === "deleted"), m = R(() => l[n.change]), v = R(() => new Set(n.rows.filter((w) => w.line_type === "add").map((w) => w.line))), y = I("after"), S = R(() => y.value === "before" ? n.whole.old : n.whole.text), _ = R(() => n.whole && n.whole.text !== void 0 ? S.value.split(`
`).map((w, k) => ({ line_type: y.value === "after" && v.value.has(k + 1) ? "add" : "ctx", line: k + 1, text: w })) : n.rows.filter(
      (w) => !(n.editsOnly && ["ctx", "fold"].includes(w.line_type)) && !(n.hideRemovals && w.line_type === "del")
    )), T = I(!1), W = R(() => n.lines && !T.value && !n.whole), J = R(() => W.value ? _.value.slice(0, n.lines) : _.value), D = R(() => _.value.length - J.value.length), B = (w) => w.line === null || w.line_type === "del" ? "" : w.line, q = (w) => w.line_type === "fold" ? w.hidden ? `⋯ ${w.hidden} lines` : "⋯" : w.text, A = I(null), E = I(null);
    let b = null;
    return Re(() => {
      if (!E.value) return;
      let w = !0;
      b = new ResizeObserver(() => {
        !A.value || !E.value || (A.value.style.transition = w ? "none" : "", A.value.style.height = `${E.value.offsetHeight}px`, w = !1);
      }), b.observe(E.value);
    }), Be(() => b && b.disconnect()), (w, k) => (c(), h("section", {
      class: X(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      g("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: k[2] || (k[2] = (p) => !f.value && a("fold"))
      }, [
        g("span", {
          class: "diff-card-path",
          title: `${e.path} · ${P(s)}-click to open it`,
          onClick: o
        }, [
          g("span", Ak, $(u.value), 1),
          g("span", Ck, $(d.value), 1),
          m.value ? (c(), h("span", {
            key: 0,
            class: X(["diff-card-badge", e.change])
          }, $(m.value), 3)) : O("", !0)
        ], 8, Ek),
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
        }, $(y.value === "after" ? "After" : "Before"), 9, Ok)) : O("", !0),
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
        ], 10, Tk))
      ], 8, _k),
      e.whole && e.whole.error ? (c(), h("p", Rk, $(e.whole.error), 1)) : O("", !0),
      !f.value && !e.folded ? (c(), h(z, { key: 1 }, [
        e.picture ? (c(), h("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          g("img", {
            src: e.picture,
            alt: d.value,
            loading: "lazy"
          }, null, 8, Bk)
        ], 8, Ik)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: A,
          class: "diff-card-grow"
        }, [
          g("div", {
            ref_key: "body",
            ref: E,
            class: "diff-card-diff"
          }, [
            g("div", Lk, [
              (c(!0), h(z, null, te(J.value, (p, x) => (c(), h("div", {
                key: x,
                class: X(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                g("span", Nk, $(B(p)), 1),
                g("span", Dk, $(r[p.line_type]), 1),
                g("span", jk, $(q(p)), 1)
              ], 2))), 128)),
              D.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: k[3] || (k[3] = $e((p) => T.value = !0, ["stop"]))
              }, $(D.value) + " more " + $(D.value === 1 ? "line" : "lines"), 1)) : O("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : O("", !0)
    ], 2));
  }
}, O8 = /* @__PURE__ */ Y(Pk, [["__scopeId", "data-v-23581cbb"]]), qk = {
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
    const n = t, a = e, s = R(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = R(() => s.value && { render: () => Jn(Fm, { line: s.value.line, events: s.value.events }) }), l = I(null), r = R(() => {
      var m, v;
      return ((m = s.value) == null ? void 0 : m.loading) === "component" && !s.value.allowed && !((v = l.value) != null && v.component_trusted);
    }), i = R(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), u = R(
      () => {
        var m, v;
        return l.value ? fv(l.value, f) : { reads: ((m = s.value) == null ? void 0 : m.reads) || [], runs: ((v = s.value) == null ? void 0 : v.runs) || [], missing: [], ask: async () => !0 };
      }
    );
    async function d() {
      if (!s.value || s.value.allowed || !a.shellRead) return;
      const m = await a.shellRead(`window permissions ${a.name} --environment ${a.environment}`);
      l.value = m.ok ? m.value : null;
    }
    async function f() {
      const m = await a.prompts.ask(s.value.title, l.value);
      return await d(), m;
    }
    return he(
      () => {
        var m, v;
        return ((m = s.value) == null ? void 0 : m.entry_url) || ((v = s.value) == null ? void 0 : v.line);
      },
      async () => {
        await d(), u.value.missing.length && !r.value && f();
      },
      { immediate: !0 }
    ), (m, v) => {
      var y, S;
      return !s.value && ((y = e.catalogue.loaded) == null ? void 0 : y.value) === !1 ? (c(), H(Os, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((S = s.value) == null ? void 0 : S.shows) === "one-agent" && e.agent === null ? (c(), H(Qt, {
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
        key: u.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
        prompts: e.prompts,
        options: e.options,
        onOption: v[0] || (v[0] = (_, T) => n("option", _, T))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (c(), H(vr, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
        prompts: e.prompts,
        options: e.options,
        onOption: v[1] || (v[1] = (_, T) => n("option", _, T))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (c(), H(Kt, {
        key: s.value.line || s.value.entry_url,
        name: e.name,
        component: o.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
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
        onOption: v[2] || (v[2] = (_, T) => n("option", _, T))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (c(), H(Kt, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: v[3] || (v[3] = (_) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, Fk = ["data-section"], Wk = {
  __name: "InspectorSections",
  props: { slotName: { type: String, required: !0 }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Oe(Lu, null), a = R(() => (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? []), s = R(() => ({ row: t.row }));
    return (o, l) => (c(!0), h(z, null, te(a.value, (r) => (c(), h("div", {
      key: r.name,
      class: "inspector-section",
      "data-section": r.name
    }, [
      L(qk, {
        name: r.name,
        catalogue: P(n).catalogue,
        subscriptions: P(n).subscriptions,
        environment: P(n).environment,
        prompts: P(n).prompts,
        "shell-read": P(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])
    ], 8, Fk))), 128));
  }
}, Hk = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), H(de, {
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
}, Uk = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, zk = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, Vk = { class: "ask-text" }, Gk = ["placeholder", "aria-label"], Kk = ["placeholder", "aria-label"], Yk = {
  key: 3,
  class: "moves"
}, Jk = {
  __name: "RowMoves",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = R(() => d0(a.noun, a.row)), l = I(""), r = I(null), i = I(""), u = I("");
    he(() => a.id, () => {
      l.value = "", r.value = null;
    });
    async function d(v, y = "") {
      const S = await a.read([v.noun ?? a.noun, v.word, String(a.id), ...v.flag ? [v.flag, y] : v.positional ? [y] : [], ...v.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      l.value = S.ok ? "" : S.error, S.ok && (r.value = null, i.value = "", u.value = "", s("done"));
    }
    const f = (v) => v.confirm ? r.value = v : v.said ? d(v, v.said) : v.flag || v.positional ? (r.value = v, i.value = "") : d(v), m = () => i.value.trim() && d(r.value, i.value.trim());
    return t({ moves: o, press: f }), (v, y) => o.value.length ? (c(), H(fr, {
      key: 0,
      inline: e.inline
    }, {
      default: j(() => {
        var S;
        return [
          l.value ? (c(), h("p", Uk, $(l.value), 1)) : O("", !0),
          (S = r.value) != null && S.confirm ? (c(), h("div", zk, [
            g("span", Vk, $(r.value.confirm), 1),
            L(de, {
              small: "",
              variant: r.value.danger ? "ghost" : "primary",
              bordered: r.value.danger,
              class: X({ danger: r.value.danger }),
              "data-resource-confirm-yes": "",
              onClick: y[0] || (y[0] = (_) => d(r.value))
            }, {
              default: j(() => [
                ee($(r.value.label), 1)
              ]),
              _: 1
            }, 8, ["variant", "bordered", "class"]),
            L(de, {
              small: "",
              variant: "ghost",
              onClick: y[1] || (y[1] = (_) => r.value = null)
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
              "onUpdate:modelValue": y[2] || (y[2] = (_) => i.value = _),
              class: "ask-input",
              placeholder: r.value.ask,
              "aria-label": r.value.ask,
              onKeydown: y[3] || (y[3] = Xt($e((_) => r.value = null, ["stop"]), ["esc"]))
            }, null, 40, Gk), [
              [Dn, i.value]
            ]),
            r.value.opener ? Ye((c(), h("input", {
              key: 0,
              "onUpdate:modelValue": y[4] || (y[4] = (_) => u.value = _),
              class: "ask-input",
              "data-resource-opener": "",
              placeholder: r.value.opener,
              "aria-label": r.value.opener,
              onKeydown: y[5] || (y[5] = Xt($e((_) => r.value = null, ["stop"]), ["esc"]))
            }, null, 40, Kk)), [
              [Dn, u.value]
            ]) : O("", !0),
            L(de, {
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
            L(de, {
              small: "",
              variant: "ghost",
              onClick: y[6] || (y[6] = (_) => r.value = null)
            }, {
              default: j(() => [...y[8] || (y[8] = [
                ee("Back", -1)
              ])]),
              _: 1
            })
          ], 32)) : (c(), h("div", Yk, [
            (c(!0), h(z, null, te(o.value, (_) => (c(), H(de, {
              key: _.word,
              small: !_.bordered,
              bordered: _.bordered,
              icon: _.icon,
              variant: _.main ? "primary" : "ghost",
              class: X({ danger: _.danger }),
              "data-move": _.word,
              onClick: (T) => f(_)
            }, {
              default: j(() => [
                ee($(_.label), 1)
              ]),
              _: 2
            }, 1032, ["small", "bordered", "icon", "variant", "class", "data-move", "onClick"]))), 128))
          ]))
        ];
      }),
      _: 1
    }, 8, ["inline"])) : O("", !0);
  }
}, Zk = /* @__PURE__ */ Y(Jk, [["__scopeId", "data-v-bdac0207"]]), Xk = /* @__PURE__ */ new Set(["completed", "cancelled"]), Qk = (e) => Xk.has(e), rn = (e) => Qk(e) ? "done" : e, e2 = { class: "facts" }, t2 = { class: "fact wide" }, n2 = ["title"], a2 = {
  key: 1,
  class: "fact-value"
}, s2 = {
  key: 0,
  class: "fact"
}, o2 = { class: "fact-value" }, l2 = { class: "fact" }, r2 = { class: "fact-label" }, i2 = ["title"], c2 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, u2 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, d2 = {
  key: 2,
  class: "fact"
}, f2 = { class: "fact-value" }, h2 = { class: "fact wide" }, m2 = { class: "fact wide" }, p2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, g2 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = Hn.map(({ key: l, label: r }) => ({ key: String(l), label: r })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, r) => {
      var i, u;
      return c(), h("div", e2, [
        g("div", t2, [
          r[4] || (r[4] = g("span", { class: "fact-label" }, "Plan", -1)),
          (i = e.place) != null && i.plan_id ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: r[0] || (r[0] = (d) => P(Fe)(`plans:${e.place.plan_id}`))
          }, "Plan " + $(e.place.plan_id) + ": " + $(e.place.plan_title), 9, n2)) : (c(), h("span", a2, "Not in a plan"))
        ]),
        ((u = e.place) == null ? void 0 : u.phase_total) > 1 ? (c(), h("div", s2, [
          r[5] || (r[5] = g("span", { class: "fact-label" }, "Phase", -1)),
          g("span", o2, $(e.place.phase_number) + " of " + $(e.place.phase_total) + ": " + $(e.place.phase_title), 1)
        ])) : O("", !0),
        e.task.helper_id ? (c(), h(z, { key: 1 }, [
          g("div", l2, [
            g("span", r2, $(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            g("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: r[1] || (r[1] = (d) => P(Fe)(`agents:${e.task.helper_id}`))
            }, $(e.task.helper_name), 9, i2)
          ]),
          P(o).has(e.task.state) ? (c(), h("p", c2, $(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (c(), h("p", u2, $(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : O("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (c(), h("div", d2, [
          r[6] || (r[6] = g("span", { class: "fact-label" }, "Assigned to", -1)),
          g("span", f2, "Agent " + $(e.task.holder_id), 1)
        ])) : O("", !0),
        g("div", h2, [
          r[7] || (r[7] = g("span", { class: "fact-label" }, "Complexity", -1)),
          L(Nt, {
            options: P(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: r[2] || (r[2] = (d) => s("complexity", d))
          }, null, 8, ["options", "value"]),
          r[8] || (r[8] = g("span", { class: "fact-label" }, "1: a few lines. 5: a design with risk.", -1))
        ]),
        g("div", m2, [
          r[9] || (r[9] = g("span", { class: "fact-label" }, "Priority", -1)),
          L(Nt, {
            options: P(n),
            value: String(P(dr)(e.task.priority)),
            "data-task-priority": "",
            onPick: r[3] || (r[3] = (d) => s("priority", d))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", p2, $(e.refusal), 1)) : O("", !0)
        ])
      ]);
    };
  }
}, v2 = /* @__PURE__ */ Y(g2, [["__scopeId", "data-v-81d598cf"]]);
function y2(e, t) {
  const n = new Map(t.tasks.map((i) => [i.id, i])), a = (i) => t.edges.filter(([, u]) => u === i).map(([u]) => u), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let i = a(e); i.length; i = [...new Set(i.flatMap(a))].filter((u) => !s.has(u)))
    i.forEach((u) => s.add(u)), o.push(i.map((u) => n.get(u)));
  const l = [], r = /* @__PURE__ */ new Set([e]);
  for (let i = t.edges.find(([u]) => u === e); i && !r.has(i[1]); i = t.edges.find(([u]) => u === i[1]))
    r.add(i[1]), l.push(n.get(i[1]));
  return { above: o.reverse(), below: l };
}
const b2 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, w2 = { ...b2, done: "Completed" }, k2 = { class: "task-status-icon" }, $2 = ["width", "height", "aria-label"], x2 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = R(() => Ml("task", rn(t.status))), a = R(() => n.value === "testing" ? "started" : n.value), s = R(() => w2[t.status] ?? xl("task", t.status));
    return (o, l) => (c(), h("span", k2, [
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
          ], 10, $2))
        ]),
        _: 1
      })
    ]));
  }
}, Ws = /* @__PURE__ */ Y(x2, [["__scopeId", "data-v-ae24a63f"]]), M2 = { class: "number" }, S2 = { class: "title" }, _2 = { class: "word" }, E2 = {
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
        g("span", M2, $(e.number), 1),
        g("span", S2, $(e.title), 1),
        g("span", _2, $(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, qa = /* @__PURE__ */ Y(E2, [["__scopeId", "data-v-f6417ae8"]]), A2 = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, C2 = { class: "level" }, O2 = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(!1);
    he(() => n.task.id, () => s.value = !1);
    const o = R(() => y2(n.task.id, n.graph)), l = R(() => s.value ? o.value.above : o.value.above.slice(-1)), r = R(() => s.value ? o.value.below : o.value.below.slice(0, 1)), i = R(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), u = (f) => f.slice(0, 1).toUpperCase() + f.slice(1), d = (f, m = !1) => ({ status: rn(f.state), number: f.id, title: f.title, word: m ? "This task" : u(f.state), current: m });
    return (f, m) => o.value.above.length || o.value.below.length ? (c(), h("section", A2, [
      m[5] || (m[5] = g("h4", null, "What waits on what", -1)),
      (c(!0), h(z, null, te(l.value, (v) => (c(), h(z, {
        key: v.map((y) => y.id).join()
      }, [
        g("div", C2, [
          (c(!0), h(z, null, te(v, (y) => (c(), H(qa, Le({
            key: y.id,
            ref_for: !0
          }, d(y), {
            onSelect: m[0] || (m[0] = (S) => a("select", S))
          }), null, 16))), 128))
        ]),
        m[3] || (m[3] = g("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      L(qa, wi(ki(d(e.task, !0))), null, 16),
      (c(!0), h(z, null, te(r.value, (v) => (c(), h(z, {
        key: v.id
      }, [
        m[4] || (m[4] = g("div", { class: "waits" }, "↓ waits on", -1)),
        L(qa, Le({ ref_for: !0 }, d(v), {
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
}, T2 = /* @__PURE__ */ Y(O2, [["__scopeId", "data-v-db05c4b2"]]), R2 = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, I2 = ["datetime"], B2 = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (c(), h("section", R2, [
      n[0] || (n[0] = g("h3", null, "Block history", -1)),
      (c(!0), h(z, null, te(e.renewals, (a) => (c(), h("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        g("time", {
          datetime: a.created_at
        }, $(new Date(a.created_at).toLocaleString()), 9, I2),
        g("p", null, $(a.reason), 1)
      ]))), 128))
    ])) : O("", !0);
  }
}, L2 = /* @__PURE__ */ Y(B2, [["__scopeId", "data-v-b41f213b"]]), N2 = {
  class: "part",
  "data-resource-waits": ""
}, D2 = ["onClick"], j2 = { class: "wait-id" }, P2 = { class: "wait-title" }, q2 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", N2, [
      g("h4", null, $(e.title), 1),
      (c(!0), h(z, null, te(e.waits, (o) => (c(), h("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        L(Ws, {
          status: P(rn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        g("span", j2, $(o.id), 1),
        g("span", P2, $(o.title), 1)
      ], 8, D2))), 128))
    ]));
  }
}, Qo = /* @__PURE__ */ Y(q2, [["__scopeId", "data-v-8fb2e251"]]), F2 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, W2 = { class: "text" }, H2 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, U2 = 180, z2 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = I(!1), l = R(() => a.task.waits.filter((i) => !n.has(i.state))), r = R(() => a.task.waits.filter((i) => n.has(i.state)));
    return (i, u) => (c(), h(z, null, [
      l.value.length ? (c(), H(Qo, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: u[0] || (u[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : O("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", F2, [
        u[3] || (u[3] = g("h4", null, "How it was done", -1)),
        g("p", W2, $(e.task.outcome), 1)
      ])) : O("", !0),
      e.task.brief ? (c(), h("section", H2, [
        u[4] || (u[4] = g("h4", null, "The brief", -1)),
        g("p", {
          class: X(["text", { clamped: !o.value }])
        }, $(e.task.brief), 3),
        e.task.brief.length > U2 && !o.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: u[1] || (u[1] = (d) => o.value = !0)
        }, "Show the whole brief")) : O("", !0)
      ])) : O("", !0),
      r.value.length ? (c(), H(Qo, {
        key: 3,
        title: "Waited on",
        waits: r.value,
        onSelect: u[2] || (u[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : O("", !0)
    ], 64));
  }
}, V2 = /* @__PURE__ */ Y(z2, [["__scopeId", "data-v-4a3f1e79"]]), G2 = {
  class: "task-details",
  "data-task-details": ""
}, K2 = { class: "since" }, Y2 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, J2 = { class: "text" }, Z2 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, X2 = {
  key: 1,
  class: "note"
}, Q2 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, e5 = { class: "text" }, t5 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return c(), h("div", G2, [
        g("div", {
          class: X(["state-line", P(rn)(e.task.state)])
        }, [
          g("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (r) => n("status", r.currentTarget))
          }, [
            L(Ws, {
              status: P(rn)(e.task.state)
            }, null, 8, ["status"]),
            ee(" " + $(a(e.task.state)), 1)
          ]),
          g("span", K2, [
            o[5] || (o[5] = ee(" since ", -1)),
            L(ia, {
              at: P(Zl)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", Y2, [
          o[6] || (o[6] = g("span", { class: "label" }, "Blocked, waiting on", -1)),
          g("p", J2, $(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (c(), h("p", Z2, "Opens by itself when " + $(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", X2, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", Q2, [
          o[7] || (o[7] = g("span", { class: "label" }, "Why it was cancelled", -1)),
          g("p", e5, $(e.task.reason), 1)
        ])) : O("", !0),
        e.graph ? (c(), H(T2, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (r) => n("select", r))
        }, null, 8, ["task", "graph"])) : O("", !0),
        L(v2, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (r) => n("priority", r)),
          onComplexity: o[3] || (o[3] = (r) => n("complexity", r))
        }, null, 8, ["task", "place", "refusal"]),
        L(V2, {
          task: e.task,
          onSelect: o[4] || (o[4] = (r) => n("select", r))
        }, null, 8, ["task"]),
        L(L2, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, n5 = /* @__PURE__ */ Y(t5, [["__scopeId", "data-v-7e73fa21"]]), a5 = 50, s5 = { messages: 25 }, o5 = (e) => s5[e] || a5, l5 = {
  class: "task-log",
  "aria-label": "Task log"
}, r5 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, i5 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, c5 = { class: "entries" }, u5 = ["data-task-log-important"], d5 = ["datetime"], f5 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, h5 = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = I([]), a = I(1), s = I(!0), o = I(!0), l = I("");
    let r = 0;
    async function i(u = 1) {
      const d = ++r;
      a.value = u, o.value = !0, l.value = "";
      const f = await t.read([
        "task-log",
        "list",
        "--task",
        String(t.id),
        "--limit",
        String(o5("task_logs")),
        "--page",
        String(u)
      ]);
      d === r && (o.value = !1, l.value = f.ok ? "" : f.error, f.ok && (n.value = f.value.rows, s.value = f.value.is_last_page));
    }
    return he(
      () => [t.id, t.changes],
      () => {
        n.value = [], i();
      },
      { immediate: !0 }
    ), ft(() => {
      r += 1;
    }), (u, d) => (c(), h("section", l5, [
      o.value ? (c(), H(_t, { key: 0 })) : l.value ? (c(), h(z, { key: 1 }, [
        g("p", r5, $(l.value), 1),
        L(de, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (f) => i(a.value))
        }, {
          default: j(() => [...d[3] || (d[3] = [
            ee("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (c(), h(z, { key: 2 }, [
        n.value.length ? O("", !0) : (c(), h("p", i5, "No log entries yet.")),
        g("ol", c5, [
          (c(!0), h(z, null, te(n.value, (f) => (c(), h("li", {
            key: f.id,
            class: X(["entry", { important: f.important }]),
            "data-task-log": "",
            "data-task-log-important": f.important ? "" : null
          }, [
            g("time", {
              datetime: f.created_at
            }, $(new Date(f.created_at).toLocaleString()), 9, d5),
            g("p", null, $(f.line), 1)
          ], 10, u5))), 128))
        ]),
        a.value > 1 || !s.value ? (c(), h("nav", f5, [
          L(de, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (f) => i(a.value - 1))
          }, {
            default: j(() => [...d[4] || (d[4] = [
              ee("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          g("span", null, "Page " + $(a.value), 1),
          L(de, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (f) => i(a.value + 1))
          }, {
            default: j(() => [...d[5] || (d[5] = [
              ee("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : O("", !0)
      ], 64))
    ]));
  }
}, m5 = /* @__PURE__ */ Y(h5, [["__scopeId", "data-v-cfa43bf1"]]), p5 = {
  class: "task-tags",
  "aria-label": "Task tags"
}, g5 = { class: "tags" }, v5 = ["aria-label", "data-remove-tag", "onClick"], y5 = {
  __name: "TaskTags",
  props: { tags: { type: Array, required: !0 } },
  emits: ["add", "remove"],
  setup(e, { emit: t }) {
    const n = t, a = I("");
    function s() {
      const o = a.value.trim();
      o && (n("add", o), a.value = "");
    }
    return (o, l) => (c(), h("section", p5, [
      g("div", g5, [
        (c(!0), h(z, null, te(e.tags, (r) => (c(), h("span", {
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
          }, "×", 8, v5)
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
        L(de, {
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
}, b5 = /* @__PURE__ */ Y(y5, [["__scopeId", "data-v-1d720cf2"]]), w5 = { class: "comment-side-head" }, k5 = {
  key: 0,
  class: "comment-none"
}, $5 = { key: 0 }, x5 = {
  key: 1,
  class: "comment-none"
}, M5 = {
  class: "comment",
  "data-comment": ""
}, S5 = {
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
      g("header", w5, [
        n[2] || (n[2] = g("h3", null, "Comments", -1)),
        L(xs, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (c(), h("p", k5, "No comments yet")) : O("", !0),
      (c(!0), h(z, null, te(e.comments, (a) => (c(), h("section", {
        key: a.id
      }, [
        a.quote ? (c(), h("blockquote", $5, $(a.quote), 1)) : O("", !0),
        a.revision ? (c(), h("span", x5, "Revision " + $(a.revision), 1)) : O("", !0),
        g("p", M5, $(e.words(a)), 1)
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
}, _5 = /* @__PURE__ */ Y(S5, [["__scopeId", "data-v-276284a3"]]);
var nl;
/Mac|iPhone|iPad/.test(((nl = navigator.userAgentData) == null ? void 0 : nl.platform) || navigator.platform);
function E5(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const A5 = ["placeholder"], C5 = { class: "actions" }, O5 = { class: "error" }, T5 = {
  key: 1,
  class: "card closed"
}, R5 = { class: "mark" }, I5 = { class: "prompt" }, B5 = {
  key: 0,
  class: "draft"
}, L5 = {
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
    const a = e, s = n, o = Wa(e, "draft"), l = Wa(e, "error"), r = I(!!l.value), i = I(!1), u = I(!1), d = I(null);
    async function f() {
      var y, S;
      r.value = !0, i.value = !1, await mt(), (S = ((y = d.value) == null ? void 0 : y.querySelector("input")) || d.value) == null || S.focus();
    }
    function m() {
      r.value = !1, l.value = "";
    }
    async function v() {
      const y = o.value.trim();
      if (!(!y || !a.ready || u.value)) {
        l.value = "", u.value = !0, o.value = "";
        try {
          await a.send(y), r.value = !1, i.value = !0;
        } catch (S) {
          o.value = y, l.value = S.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: f }), (y, S) => (c(), h("div", {
      class: X(["comment-bar", { open: r.value }])
    }, [
      r.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: $e(v, ["prevent"]),
        onKeydown: Xt(m, ["esc"])
      }, [
        ue(y.$slots, "who", {}, void 0, !0),
        Ye(g("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": S[0] || (S[0] = (_) => o.value = _),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: S[1] || (S[1] = Xt((_) => P(E5)(_, v), ["enter"]))
        }, null, 40, A5), [
          [Dn, o.value]
        ]),
        g("div", C5, [
          g("span", O5, $(l.value), 1),
          L(de, {
            small: "",
            onClick: m
          }, {
            default: j(() => [...S[3] || (S[3] = [
              ee("Cancel", -1)
            ])]),
            _: 1
          }),
          L(de, {
            variant: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: v
          }, {
            default: j(() => [...S[4] || (S[4] = [
              ee("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", T5, [
        g("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          g("span", R5, [
            L(ye, {
              name: i.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          g("span", I5, $(i.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", B5, "Draft kept")) : O("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: S[2] || (S[2] = (_) => s("show"))
        }, [
          g("span", null, $(P(gu)(e.count, "comment")), 1),
          L(ye, {
            name: "down",
            size: 12
          })
        ])) : O("", !0)
      ]))
    ], 2));
  }
}, N5 = /* @__PURE__ */ Y(L5, [["__scopeId", "data-v-b68baddd"]]);
function D5(e, t) {
  const n = I([]), a = I(!1), s = I(null), o = I(0), l = I(!1), r = I("");
  let i = 0, u = 0;
  const d = (y) => {
    if (typeof y.body == "string") return y.body;
    const { noun: S, id: _, title: T } = e(), W = `On ${S} ${_}, ${T}: `;
    return y.text.startsWith(W) ? y.text.slice(W.length) : y.text;
  };
  async function f(y = 1) {
    const { noun: S, id: _ } = e();
    if (!_) return;
    const T = ++u;
    l.value = !0, r.value = "";
    try {
      const W = await t([S, "comments", String(_), "--page", String(y), "--page-size", "25"]);
      if (T !== u) return;
      if (!W.ok) {
        r.value = W.error;
        return;
      }
      const J = W.value.rows ?? [], D = y === 1 ? J : [...n.value, ...J];
      n.value = [...new Map(D.map((B) => [B.id, B])).values()], o.value = W.value.total ?? n.value.length, s.value = W.value.next_page ?? null;
    } catch (W) {
      T === u && (r.value = W.message);
    } finally {
      T === u && (l.value = !1);
    }
  }
  async function m(y) {
    var B;
    const { noun: S, id: _ } = e(), T = `${S}:${_}`, W = { id: `sending-${++i}`, text: y };
    n.value = [...n.value, W], o.value++, a.value = !0;
    const J = await t([S, "comment", String(_), y]);
    if (T !== `${e().noun}:${e().id}`) return;
    if (!J.ok)
      throw n.value = n.value.filter((q) => q.id !== W.id), o.value = Math.max(0, o.value - 1), new Error(J.error);
    await f();
    const D = (B = J.value) == null ? void 0 : B.id;
    D && !n.value.some((q) => q.id === D) && (n.value = [...n.value, { ...W, id: D }]);
  }
  const v = () => !l.value && s.value && f(s.value);
  return he(() => `${e().noun}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, r.value = "", u++, f();
  }, { immediate: !0 }), { comments: n, open: a, words: d, send: m, load: f, loadMore: v, nextPage: s, total: o, loading: l, failure: r };
}
const j5 = { class: "top" }, P5 = {
  class: "crumb",
  "data-task-crumb": ""
}, q5 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, F5 = {
  key: 1,
  class: "body"
}, W5 = { class: "summary" }, H5 = { class: "stamp" }, U5 = {
  class: "title",
  "data-resource-title": ""
}, z5 = {
  class: "tabs",
  "data-task-tabs": ""
}, V5 = { class: "panels" }, G5 = {
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
    const a = e, s = n, o = I(null), l = I(null), r = I(null), i = I(""), u = I(""), d = I(null), f = I(null), m = I("details"), v = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], y = D5(
      () => o.value ? { noun: "task", id: a.id, title: o.value.title } : {},
      (q) => a.read(q)
    );
    let S = 0;
    const _ = R(() => {
      var q;
      return (q = l.value) != null && q.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function T() {
      const q = ++S, [A, E, b] = await Promise.all([
        a.read(["task", "inspect", String(a.id)]),
        a.read(["plan", "place", String(a.id)]),
        a.read(["task", "graph"])
      ]);
      q === S && (i.value = A.ok ? "" : A.error, o.value = A.ok ? A.value : null, l.value = E.ok ? E.value : null, r.value = b.ok ? b.value : null);
    }
    he(
      () => a.id,
      () => {
        o.value = null, l.value = null, r.value = null, d.value = null, m.value = "details", T();
      },
      { immediate: !0 }
    ), he(() => a.changes, T), he(y.open, (q) => {
      q && (m.value = "comments");
    });
    async function W(q, A) {
      const E = o.value[q];
      o.value[q] = Number(A);
      const b = await a.read(["task", "edit", String(a.id), `--${q}`, A]);
      if (u.value = b.ok ? "" : b.error, b.ok) return T();
      o.value[q] = E;
    }
    async function J(q, A) {
      const E = await a.read(["task", q, String(a.id), A]);
      u.value = E.ok ? "" : E.error, E.ok && await T();
    }
    function D(q) {
      d.value = null, f.value.press(q);
    }
    const B = (q) => {
      var A;
      return ((A = f.value) == null ? void 0 : A.moves.length) && (d.value = q);
    };
    return t({ openStatus: B }), (q, A) => (c(), h("aside", {
      class: X(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      g("div", j5, [
        e.backed ? (c(), H(Hk, {
          key: 0,
          onBack: A[0] || (A[0] = (E) => s("back"))
        })) : O("", !0),
        g("span", P5, $(_.value), 1),
        A[14] || (A[14] = g("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(z, { key: 1 }, [
          L(de, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: A[1] || (A[1] = (E) => s("step", -1))
          }, {
            default: j(() => [
              L(ye, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          L(de, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: A[2] || (A[2] = (E) => s("step", 1))
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
        L(de, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: A[3] || (A[3] = (E) => s("close"))
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
      i.value ? (c(), h("p", q5, $(i.value), 1)) : o.value ? (c(), h(z, { key: 2 }, [
        L(Zk, {
          ref_key: "actions",
          ref: f,
          noun: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: T
        }, null, 8, ["id", "row", "read"]),
        g("header", W5, [
          g("div", H5, [
            ee(" Task " + $(o.value.id) + " · updated ", 1),
            L(ia, {
              at: P(Zl)(o.value)
            }, null, 8, ["at"])
          ]),
          g("h3", U5, $(o.value.title), 1),
          L(b5, {
            tags: o.value.tags,
            onAdd: A[4] || (A[4] = (E) => J("tag", E)),
            onRemove: A[5] || (A[5] = (E) => J("untag", E))
          }, null, 8, ["tags"])
        ]),
        g("div", z5, [
          L(Nt, {
            options: v,
            value: m.value,
            onPick: A[6] || (A[6] = (E) => m.value = E)
          }, null, 8, ["value"])
        ]),
        g("div", V5, [
          L(Pt, { value: m.value }, {
            details: j(() => [
              L(n5, {
                task: o.value,
                place: l.value,
                graph: r.value,
                refusal: u.value,
                onStatus: B,
                onPriority: A[7] || (A[7] = (E) => W("priority", E)),
                onComplexity: A[8] || (A[8] = (E) => W("complexity", E)),
                onSelect: A[9] || (A[9] = (E) => s("select", E))
              }, null, 8, ["task", "place", "graph", "refusal"]),
              L(Wk, {
                "slot-name": "inspector.task",
                row: o.value
              }, null, 8, ["row"]),
              L(mu, {
                model: "task",
                id: e.id,
                read: e.read,
                changes: e.changes,
                onOpen: A[10] || (A[10] = (E) => s("select", E))
              }, null, 8, ["id", "read", "changes"])
            ]),
            comments: j(() => [
              L(_5, {
                below: "",
                comments: P(y).comments.value,
                words: P(y).words,
                more: !!P(y).nextPage.value,
                loading: P(y).loading.value,
                failure: P(y).failure.value,
                onMore: P(y).loadMore,
                onClose: A[11] || (A[11] = (E) => m.value = "details")
              }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
            ]),
            log: j(() => [
              L(m5, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        L(N5, {
          send: P(y).send,
          count: P(y).total.value,
          onShow: A[12] || (A[12] = (E) => m.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", F5, [
        L(_t)
      ])),
      d.value ? (c(), H(ea, {
        key: 3,
        anchor: d.value,
        "min-width": 220,
        "max-width": 300,
        onClose: A[13] || (A[13] = (E) => d.value = null)
      }, {
        default: j(() => [
          L(us, null, {
            default: j(() => [
              ee("Change the status of task " + $(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(z, null, te(f.value.moves, (E) => (c(), H(Mt, {
            key: E.word,
            onClick: (b) => D(E)
          }, {
            default: j(() => [
              ee($(E.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : O("", !0)
    ], 2));
  }
}, T8 = /* @__PURE__ */ Y(G5, [["__scopeId", "data-v-d8c2872e"]]);
function K5(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Fa = { exports: {} }, el;
function Y5() {
  return el || (el = 1, (function(e, t) {
    var n = (function() {
      var a = function(B, q) {
        var A = 236, E = 17, b = B, w = o[q], k = null, p = 0, x = null, M = [], C = {}, N = function(U, V) {
          p = b * 4 + 17, k = (function(F) {
            for (var G = new Array(F), K = 0; K < F; K += 1) {
              G[K] = new Array(F);
              for (var Q = 0; Q < F; Q += 1)
                G[K][Q] = null;
            }
            return G;
          })(p), Z(0, 0), Z(p - 7, 0), Z(0, p - 7), fe(), ie(), He(U, V), b >= 7 && Ae(U), x == null && (x = se(b, w, M)), ve(x, V);
        }, Z = function(U, V) {
          for (var F = -1; F <= 7; F += 1)
            if (!(U + F <= -1 || p <= U + F))
              for (var G = -1; G <= 7; G += 1)
                V + G <= -1 || p <= V + G || (0 <= F && F <= 6 && (G == 0 || G == 6) || 0 <= G && G <= 6 && (F == 0 || F == 6) || 2 <= F && F <= 4 && 2 <= G && G <= 4 ? k[U + F][V + G] = !0 : k[U + F][V + G] = !1);
        }, ne = function() {
          for (var U = 0, V = 0, F = 0; F < 8; F += 1) {
            N(!0, F);
            var G = r.getLostPoint(C);
            (F == 0 || U > G) && (U = G, V = F);
          }
          return V;
        }, ie = function() {
          for (var U = 8; U < p - 8; U += 1)
            k[U][6] == null && (k[U][6] = U % 2 == 0);
          for (var V = 8; V < p - 8; V += 1)
            k[6][V] == null && (k[6][V] = V % 2 == 0);
        }, fe = function() {
          for (var U = r.getPatternPosition(b), V = 0; V < U.length; V += 1)
            for (var F = 0; F < U.length; F += 1) {
              var G = U[V], K = U[F];
              if (k[G][K] == null)
                for (var Q = -2; Q <= 2; Q += 1)
                  for (var le = -2; le <= 2; le += 1)
                    Q == -2 || Q == 2 || le == -2 || le == 2 || Q == 0 && le == 0 ? k[G + Q][K + le] = !0 : k[G + Q][K + le] = !1;
            }
        }, Ae = function(U) {
          for (var V = r.getBCHTypeNumber(b), F = 0; F < 18; F += 1) {
            var G = !U && (V >> F & 1) == 1;
            k[Math.floor(F / 3)][F % 3 + p - 8 - 3] = G;
          }
          for (var F = 0; F < 18; F += 1) {
            var G = !U && (V >> F & 1) == 1;
            k[F % 3 + p - 8 - 3][Math.floor(F / 3)] = G;
          }
        }, He = function(U, V) {
          for (var F = w << 3 | V, G = r.getBCHTypeInfo(F), K = 0; K < 15; K += 1) {
            var Q = !U && (G >> K & 1) == 1;
            K < 6 ? k[K][8] = Q : K < 8 ? k[K + 1][8] = Q : k[p - 15 + K][8] = Q;
          }
          for (var K = 0; K < 15; K += 1) {
            var Q = !U && (G >> K & 1) == 1;
            K < 8 ? k[8][p - K - 1] = Q : K < 9 ? k[8][15 - K - 1 + 1] = Q : k[8][15 - K - 1] = Q;
          }
          k[p - 8][8] = !U;
        }, ve = function(U, V) {
          for (var F = -1, G = p - 1, K = 7, Q = 0, le = r.getMaskFunction(V), oe = p - 1; oe > 0; oe -= 2)
            for (oe == 6 && (oe -= 1); ; ) {
              for (var ke = 0; ke < 2; ke += 1)
                if (k[G][oe - ke] == null) {
                  var Se = !1;
                  Q < U.length && (Se = (U[Q] >>> K & 1) == 1);
                  var ce = le(G, oe - ke);
                  ce && (Se = !Se), k[G][oe - ke] = Se, K -= 1, K == -1 && (Q += 1, K = 7);
                }
              if (G += F, G < 0 || p <= G) {
                G -= F, F = -F;
                break;
              }
            }
        }, me = function(U, V) {
          for (var F = 0, G = 0, K = 0, Q = new Array(V.length), le = new Array(V.length), oe = 0; oe < V.length; oe += 1) {
            var ke = V[oe].dataCount, Se = V[oe].totalCount - ke;
            G = Math.max(G, ke), K = Math.max(K, Se), Q[oe] = new Array(ke);
            for (var ce = 0; ce < Q[oe].length; ce += 1)
              Q[oe][ce] = 255 & U.getBuffer()[ce + F];
            F += ke;
            var De = r.getErrorCorrectPolynomial(Se), je = u(Q[oe], De.getLength() - 1), Hs = je.mod(De);
            le[oe] = new Array(De.getLength() - 1);
            for (var ce = 0; ce < le[oe].length; ce += 1) {
              var Us = ce + Hs.getLength() - le[oe].length;
              le[oe][ce] = Us >= 0 ? Hs.getAt(Us) : 0;
            }
          }
          for (var zs = 0, ce = 0; ce < V.length; ce += 1)
            zs += V[ce].totalCount;
          for (var ca = new Array(zs), gn = 0, ce = 0; ce < G; ce += 1)
            for (var oe = 0; oe < V.length; oe += 1)
              ce < Q[oe].length && (ca[gn] = Q[oe][ce], gn += 1);
          for (var ce = 0; ce < K; ce += 1)
            for (var oe = 0; oe < V.length; oe += 1)
              ce < le[oe].length && (ca[gn] = le[oe][ce], gn += 1);
          return ca;
        }, se = function(U, V, F) {
          for (var G = d.getRSBlocks(U, V), K = f(), Q = 0; Q < F.length; Q += 1) {
            var le = F[Q];
            K.put(le.getMode(), 4), K.put(le.getLength(), r.getLengthInBits(le.getMode(), U)), le.write(K);
          }
          for (var oe = 0, Q = 0; Q < G.length; Q += 1)
            oe += G[Q].dataCount;
          if (K.getLengthInBits() > oe * 8)
            throw "code length overflow. (" + K.getLengthInBits() + ">" + oe * 8 + ")";
          for (K.getLengthInBits() + 4 <= oe * 8 && K.put(0, 4); K.getLengthInBits() % 8 != 0; )
            K.putBit(!1);
          for (; !(K.getLengthInBits() >= oe * 8 || (K.put(A, 8), K.getLengthInBits() >= oe * 8)); )
            K.put(E, 8);
          return me(K, G);
        };
        C.addData = function(U, V) {
          V = V || "Byte";
          var F = null;
          switch (V) {
            case "Numeric":
              F = m(U);
              break;
            case "Alphanumeric":
              F = v(U);
              break;
            case "Byte":
              F = y(U);
              break;
            case "Kanji":
              F = S(U);
              break;
            default:
              throw "mode:" + V;
          }
          M.push(F), x = null;
        }, C.isDark = function(U, V) {
          if (U < 0 || p <= U || V < 0 || p <= V)
            throw U + "," + V;
          return k[U][V];
        }, C.getModuleCount = function() {
          return p;
        }, C.make = function() {
          if (b < 1) {
            for (var U = 1; U < 40; U++) {
              for (var V = d.getRSBlocks(U, w), F = f(), G = 0; G < M.length; G++) {
                var K = M[G];
                F.put(K.getMode(), 4), F.put(K.getLength(), r.getLengthInBits(K.getMode(), U)), K.write(F);
              }
              for (var Q = 0, G = 0; G < V.length; G++)
                Q += V[G].dataCount;
              if (F.getLengthInBits() <= Q * 8)
                break;
            }
            b = U;
          }
          N(!1, ne());
        }, C.createTableTag = function(U, V) {
          U = U || 2, V = typeof V > "u" ? U * 4 : V;
          var F = "";
          F += '<table style="', F += " border-width: 0px; border-style: none;", F += " border-collapse: collapse;", F += " padding: 0px; margin: " + V + "px;", F += '">', F += "<tbody>";
          for (var G = 0; G < C.getModuleCount(); G += 1) {
            F += "<tr>";
            for (var K = 0; K < C.getModuleCount(); K += 1)
              F += '<td style="', F += " border-width: 0px; border-style: none;", F += " border-collapse: collapse;", F += " padding: 0px; margin: 0px;", F += " width: " + U + "px;", F += " height: " + U + "px;", F += " background-color: ", F += C.isDark(G, K) ? "#000000" : "#ffffff", F += ";", F += '"/>';
            F += "</tr>";
          }
          return F += "</tbody>", F += "</table>", F;
        }, C.createSvgTag = function(U, V, F, G) {
          var K = {};
          typeof arguments[0] == "object" && (K = arguments[0], U = K.cellSize, V = K.margin, F = K.alt, G = K.title), U = U || 2, V = typeof V > "u" ? U * 4 : V, F = typeof F == "string" ? { text: F } : F || {}, F.text = F.text || null, F.id = F.text ? F.id || "qrcode-description" : null, G = typeof G == "string" ? { text: G } : G || {}, G.text = G.text || null, G.id = G.text ? G.id || "qrcode-title" : null;
          var Q = C.getModuleCount() * U + V * 2, le, oe, ke, Se, ce = "", De;
          for (De = "l" + U + ",0 0," + U + " -" + U + ",0 0,-" + U + "z ", ce += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ce += K.scalable ? "" : ' width="' + Q + 'px" height="' + Q + 'px"', ce += ' viewBox="0 0 ' + Q + " " + Q + '" ', ce += ' preserveAspectRatio="xMinYMin meet"', ce += G.text || F.text ? ' role="img" aria-labelledby="' + Je([G.id, F.id].join(" ").trim()) + '"' : "", ce += ">", ce += G.text ? '<title id="' + Je(G.id) + '">' + Je(G.text) + "</title>" : "", ce += F.text ? '<description id="' + Je(F.id) + '">' + Je(F.text) + "</description>" : "", ce += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ce += '<path d="', ke = 0; ke < C.getModuleCount(); ke += 1)
            for (Se = ke * U + V, le = 0; le < C.getModuleCount(); le += 1)
              C.isDark(ke, le) && (oe = le * U + V, ce += "M" + oe + "," + Se + De);
          return ce += '" stroke="transparent" fill="black"/>', ce += "</svg>", ce;
        }, C.createDataURL = function(U, V) {
          U = U || 2, V = typeof V > "u" ? U * 4 : V;
          var F = C.getModuleCount() * U + V * 2, G = V, K = F - V;
          return D(F, F, function(Q, le) {
            if (G <= Q && Q < K && G <= le && le < K) {
              var oe = Math.floor((Q - G) / U), ke = Math.floor((le - G) / U);
              return C.isDark(ke, oe) ? 0 : 1;
            } else
              return 1;
          });
        }, C.createImgTag = function(U, V, F) {
          U = U || 2, V = typeof V > "u" ? U * 4 : V;
          var G = C.getModuleCount() * U + V * 2, K = "";
          return K += "<img", K += ' src="', K += C.createDataURL(U, V), K += '"', K += ' width="', K += G, K += '"', K += ' height="', K += G, K += '"', F && (K += ' alt="', K += Je(F), K += '"'), K += "/>", K;
        };
        var Je = function(U) {
          for (var V = "", F = 0; F < U.length; F += 1) {
            var G = U.charAt(F);
            switch (G) {
              case "<":
                V += "&lt;";
                break;
              case ">":
                V += "&gt;";
                break;
              case "&":
                V += "&amp;";
                break;
              case '"':
                V += "&quot;";
                break;
              default:
                V += G;
                break;
            }
          }
          return V;
        }, ri = function(U) {
          var V = 1;
          U = typeof U > "u" ? V * 2 : U;
          var F = C.getModuleCount() * V + U * 2, G = U, K = F - U, Q, le, oe, ke, Se, ce = {
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
          for (Q = 0; Q < F; Q += 2) {
            for (oe = Math.floor((Q - G) / V), ke = Math.floor((Q + 1 - G) / V), le = 0; le < F; le += 1)
              Se = "█", G <= le && le < K && G <= Q && Q < K && C.isDark(oe, Math.floor((le - G) / V)) && (Se = " "), G <= le && le < K && G <= Q + 1 && Q + 1 < K && C.isDark(ke, Math.floor((le - G) / V)) ? Se += " " : Se += "█", je += U < 1 && Q + 1 >= K ? De[Se] : ce[Se];
            je += `
`;
          }
          return F % 2 && U > 0 ? je.substring(0, je.length - F - 1) + Array(F + 1).join("▀") : je.substring(0, je.length - 1);
        };
        return C.createASCII = function(U, V) {
          if (U = U || 1, U < 2)
            return ri(V);
          U -= 1, V = typeof V > "u" ? U * 2 : V;
          var F = C.getModuleCount() * U + V * 2, G = V, K = F - V, Q, le, oe, ke, Se = Array(U + 1).join("██"), ce = Array(U + 1).join("  "), De = "", je = "";
          for (Q = 0; Q < F; Q += 1) {
            for (oe = Math.floor((Q - G) / U), je = "", le = 0; le < F; le += 1)
              ke = 1, G <= le && le < K && G <= Q && Q < K && C.isDark(oe, Math.floor((le - G) / U)) && (ke = 0), je += ke ? Se : ce;
            for (oe = 0; oe < U; oe += 1)
              De += je + `
`;
          }
          return De.substring(0, De.length - 1);
        }, C.renderTo2dContext = function(U, V) {
          V = V || 2;
          for (var F = C.getModuleCount(), G = 0; G < F; G++)
            for (var K = 0; K < F; K++)
              U.fillStyle = C.isDark(G, K) ? "black" : "white", U.fillRect(G * V, K * V, V, V);
        }, C;
      };
      a.stringToBytesFuncs = {
        default: function(B) {
          for (var q = [], A = 0; A < B.length; A += 1) {
            var E = B.charCodeAt(A);
            q.push(E & 255);
          }
          return q;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(B, q) {
        var A = (function() {
          for (var b = W(B), w = function() {
            var ie = b.read();
            if (ie == -1) throw "eof";
            return ie;
          }, k = 0, p = {}; ; ) {
            var x = b.read();
            if (x == -1) break;
            var M = w(), C = w(), N = w(), Z = String.fromCharCode(x << 8 | M), ne = C << 8 | N;
            p[Z] = ne, k += 1;
          }
          if (k != q)
            throw k + " != " + q;
          return p;
        })(), E = 63;
        return function(b) {
          for (var w = [], k = 0; k < b.length; k += 1) {
            var p = b.charCodeAt(k);
            if (p < 128)
              w.push(p);
            else {
              var x = A[b.charAt(k)];
              typeof x == "number" ? (x & 255) == x ? w.push(x) : (w.push(x >>> 8), w.push(x & 255)) : w.push(E);
            }
          }
          return w;
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
        ], q = 1335, A = 7973, E = 21522, b = {}, w = function(k) {
          for (var p = 0; k != 0; )
            p += 1, k >>>= 1;
          return p;
        };
        return b.getBCHTypeInfo = function(k) {
          for (var p = k << 10; w(p) - w(q) >= 0; )
            p ^= q << w(p) - w(q);
          return (k << 10 | p) ^ E;
        }, b.getBCHTypeNumber = function(k) {
          for (var p = k << 12; w(p) - w(A) >= 0; )
            p ^= A << w(p) - w(A);
          return k << 12 | p;
        }, b.getPatternPosition = function(k) {
          return B[k - 1];
        }, b.getMaskFunction = function(k) {
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
        }, b.getErrorCorrectPolynomial = function(k) {
          for (var p = u([1], 0), x = 0; x < k; x += 1)
            p = p.multiply(u([1, i.gexp(x)], 0));
          return p;
        }, b.getLengthInBits = function(k, p) {
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
        }, b.getLostPoint = function(k) {
          for (var p = k.getModuleCount(), x = 0, M = 0; M < p; M += 1)
            for (var C = 0; C < p; C += 1) {
              for (var N = 0, Z = k.isDark(M, C), ne = -1; ne <= 1; ne += 1)
                if (!(M + ne < 0 || p <= M + ne))
                  for (var ie = -1; ie <= 1; ie += 1)
                    C + ie < 0 || p <= C + ie || ne == 0 && ie == 0 || Z == k.isDark(M + ne, C + ie) && (N += 1);
              N > 5 && (x += 3 + N - 5);
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
        }, b;
      })(), i = (function() {
        for (var B = new Array(256), q = new Array(256), A = 0; A < 8; A += 1)
          B[A] = 1 << A;
        for (var A = 8; A < 256; A += 1)
          B[A] = B[A - 4] ^ B[A - 5] ^ B[A - 6] ^ B[A - 8];
        for (var A = 0; A < 255; A += 1)
          q[B[A]] = A;
        var E = {};
        return E.glog = function(b) {
          if (b < 1)
            throw "glog(" + b + ")";
          return q[b];
        }, E.gexp = function(b) {
          for (; b < 0; )
            b += 255;
          for (; b >= 256; )
            b -= 255;
          return B[b];
        }, E;
      })();
      function u(B, q) {
        if (typeof B.length > "u")
          throw B.length + "/" + q;
        var A = (function() {
          for (var b = 0; b < B.length && B[b] == 0; )
            b += 1;
          for (var w = new Array(B.length - b + q), k = 0; k < B.length - b; k += 1)
            w[k] = B[k + b];
          return w;
        })(), E = {};
        return E.getAt = function(b) {
          return A[b];
        }, E.getLength = function() {
          return A.length;
        }, E.multiply = function(b) {
          for (var w = new Array(E.getLength() + b.getLength() - 1), k = 0; k < E.getLength(); k += 1)
            for (var p = 0; p < b.getLength(); p += 1)
              w[k + p] ^= i.gexp(i.glog(E.getAt(k)) + i.glog(b.getAt(p)));
          return u(w, 0);
        }, E.mod = function(b) {
          if (E.getLength() - b.getLength() < 0)
            return E;
          for (var w = i.glog(E.getAt(0)) - i.glog(b.getAt(0)), k = new Array(E.getLength()), p = 0; p < E.getLength(); p += 1)
            k[p] = E.getAt(p);
          for (var p = 0; p < b.getLength(); p += 1)
            k[p] ^= i.gexp(i.glog(b.getAt(p)) + w);
          return u(k, 0).mod(b);
        }, E;
      }
      var d = (function() {
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
        ], q = function(b, w) {
          var k = {};
          return k.totalCount = b, k.dataCount = w, k;
        }, A = {}, E = function(b, w) {
          switch (w) {
            case o.L:
              return B[(b - 1) * 4 + 0];
            case o.M:
              return B[(b - 1) * 4 + 1];
            case o.Q:
              return B[(b - 1) * 4 + 2];
            case o.H:
              return B[(b - 1) * 4 + 3];
            default:
              return;
          }
        };
        return A.getRSBlocks = function(b, w) {
          var k = E(b, w);
          if (typeof k > "u")
            throw "bad rs block @ typeNumber:" + b + "/errorCorrectionLevel:" + w;
          for (var p = k.length / 3, x = [], M = 0; M < p; M += 1)
            for (var C = k[M * 3 + 0], N = k[M * 3 + 1], Z = k[M * 3 + 2], ne = 0; ne < C; ne += 1)
              x.push(q(N, Z));
          return x;
        }, A;
      })(), f = function() {
        var B = [], q = 0, A = {};
        return A.getBuffer = function() {
          return B;
        }, A.getAt = function(E) {
          var b = Math.floor(E / 8);
          return (B[b] >>> 7 - E % 8 & 1) == 1;
        }, A.put = function(E, b) {
          for (var w = 0; w < b; w += 1)
            A.putBit((E >>> b - w - 1 & 1) == 1);
        }, A.getLengthInBits = function() {
          return q;
        }, A.putBit = function(E) {
          var b = Math.floor(q / 8);
          B.length <= b && B.push(0), E && (B[b] |= 128 >>> q % 8), q += 1;
        }, A;
      }, m = function(B) {
        var q = s.MODE_NUMBER, A = B, E = {};
        E.getMode = function() {
          return q;
        }, E.getLength = function(k) {
          return A.length;
        }, E.write = function(k) {
          for (var p = A, x = 0; x + 2 < p.length; )
            k.put(b(p.substring(x, x + 3)), 10), x += 3;
          x < p.length && (p.length - x == 1 ? k.put(b(p.substring(x, x + 1)), 4) : p.length - x == 2 && k.put(b(p.substring(x, x + 2)), 7));
        };
        var b = function(k) {
          for (var p = 0, x = 0; x < k.length; x += 1)
            p = p * 10 + w(k.charAt(x));
          return p;
        }, w = function(k) {
          if ("0" <= k && k <= "9")
            return k.charCodeAt(0) - 48;
          throw "illegal char :" + k;
        };
        return E;
      }, v = function(B) {
        var q = s.MODE_ALPHA_NUM, A = B, E = {};
        E.getMode = function() {
          return q;
        }, E.getLength = function(w) {
          return A.length;
        }, E.write = function(w) {
          for (var k = A, p = 0; p + 1 < k.length; )
            w.put(
              b(k.charAt(p)) * 45 + b(k.charAt(p + 1)),
              11
            ), p += 2;
          p < k.length && w.put(b(k.charAt(p)), 6);
        };
        var b = function(w) {
          if ("0" <= w && w <= "9")
            return w.charCodeAt(0) - 48;
          if ("A" <= w && w <= "Z")
            return w.charCodeAt(0) - 65 + 10;
          switch (w) {
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
              throw "illegal char :" + w;
          }
        };
        return E;
      }, y = function(B) {
        var q = s.MODE_8BIT_BYTE, A = a.stringToBytes(B), E = {};
        return E.getMode = function() {
          return q;
        }, E.getLength = function(b) {
          return A.length;
        }, E.write = function(b) {
          for (var w = 0; w < A.length; w += 1)
            b.put(A[w], 8);
        }, E;
      }, S = function(B) {
        var q = s.MODE_KANJI, A = a.stringToBytesFuncs.SJIS;
        if (!A)
          throw "sjis not supported.";
        (function(w, k) {
          var p = A(w);
          if (p.length != 2 || (p[0] << 8 | p[1]) != k)
            throw "sjis not supported.";
        })("友", 38726);
        var E = A(B), b = {};
        return b.getMode = function() {
          return q;
        }, b.getLength = function(w) {
          return ~~(E.length / 2);
        }, b.write = function(w) {
          for (var k = E, p = 0; p + 1 < k.length; ) {
            var x = (255 & k[p]) << 8 | 255 & k[p + 1];
            if (33088 <= x && x <= 40956)
              x -= 33088;
            else if (57408 <= x && x <= 60351)
              x -= 49472;
            else
              throw "illegal char at " + (p + 1) + "/" + x;
            x = (x >>> 8 & 255) * 192 + (x & 255), w.put(x, 13), p += 2;
          }
          if (p < k.length)
            throw "illegal char at " + (p + 1);
        }, b;
      }, _ = function() {
        var B = [], q = {};
        return q.writeByte = function(A) {
          B.push(A & 255);
        }, q.writeShort = function(A) {
          q.writeByte(A), q.writeByte(A >>> 8);
        }, q.writeBytes = function(A, E, b) {
          E = E || 0, b = b || A.length;
          for (var w = 0; w < b; w += 1)
            q.writeByte(A[w + E]);
        }, q.writeString = function(A) {
          for (var E = 0; E < A.length; E += 1)
            q.writeByte(A.charCodeAt(E));
        }, q.toByteArray = function() {
          return B;
        }, q.toString = function() {
          var A = "";
          A += "[";
          for (var E = 0; E < B.length; E += 1)
            E > 0 && (A += ","), A += B[E];
          return A += "]", A;
        }, q;
      }, T = function() {
        var B = 0, q = 0, A = 0, E = "", b = {}, w = function(p) {
          E += String.fromCharCode(k(p & 63));
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
        return b.writeByte = function(p) {
          for (B = B << 8 | p & 255, q += 8, A += 1; q >= 6; )
            w(B >>> q - 6), q -= 6;
        }, b.flush = function() {
          if (q > 0 && (w(B << 6 - q), B = 0, q = 0), A % 3 != 0)
            for (var p = 3 - A % 3, x = 0; x < p; x += 1)
              E += "=";
        }, b.toString = function() {
          return E;
        }, b;
      }, W = function(B) {
        var q = B, A = 0, E = 0, b = 0, w = {};
        w.read = function() {
          for (; b < 8; ) {
            if (A >= q.length) {
              if (b == 0)
                return -1;
              throw "unexpected end of file./" + b;
            }
            var p = q.charAt(A);
            if (A += 1, p == "=")
              return b = 0, -1;
            if (p.match(/^\s$/))
              continue;
            E = E << 6 | k(p.charCodeAt(0)), b += 6;
          }
          var x = E >>> b - 8 & 255;
          return b -= 8, x;
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
        return w;
      }, J = function(B, q) {
        var A = B, E = q, b = new Array(B * q), w = {};
        w.setPixel = function(M, C, N) {
          b[C * A + M] = N;
        }, w.write = function(M) {
          M.writeString("GIF87a"), M.writeShort(A), M.writeShort(E), M.writeByte(128), M.writeByte(0), M.writeByte(0), M.writeByte(0), M.writeByte(0), M.writeByte(0), M.writeByte(255), M.writeByte(255), M.writeByte(255), M.writeString(","), M.writeShort(0), M.writeShort(0), M.writeShort(A), M.writeShort(E), M.writeByte(0);
          var C = 2, N = p(C);
          M.writeByte(C);
          for (var Z = 0; N.length - Z > 255; )
            M.writeByte(255), M.writeBytes(N, Z, 255), Z += 255;
          M.writeByte(N.length - Z), M.writeBytes(N, Z, N.length - Z), M.writeByte(0), M.writeString(";");
        };
        var k = function(M) {
          var C = M, N = 0, Z = 0, ne = {};
          return ne.write = function(ie, fe) {
            if (ie >>> fe)
              throw "length over";
            for (; N + fe >= 8; )
              C.writeByte(255 & (ie << N | Z)), fe -= 8 - N, ie >>>= 8 - N, Z = 0, N = 0;
            Z = ie << N | Z, N = N + fe;
          }, ne.flush = function() {
            N > 0 && C.writeByte(Z);
          }, ne;
        }, p = function(M) {
          for (var C = 1 << M, N = (1 << M) + 1, Z = M + 1, ne = x(), ie = 0; ie < C; ie += 1)
            ne.add(String.fromCharCode(ie));
          ne.add(String.fromCharCode(C)), ne.add(String.fromCharCode(N));
          var fe = _(), Ae = k(fe);
          Ae.write(C, Z);
          var He = 0, ve = String.fromCharCode(b[He]);
          for (He += 1; He < b.length; ) {
            var me = String.fromCharCode(b[He]);
            He += 1, ne.contains(ve + me) ? ve = ve + me : (Ae.write(ne.indexOf(ve), Z), ne.size() < 4095 && (ne.size() == 1 << Z && (Z += 1), ne.add(ve + me)), ve = me);
          }
          return Ae.write(ne.indexOf(ve), Z), Ae.write(N, Z), Ae.flush(), fe.toByteArray();
        }, x = function() {
          var M = {}, C = 0, N = {};
          return N.add = function(Z) {
            if (N.contains(Z))
              throw "dup key:" + Z;
            M[Z] = C, C += 1;
          }, N.size = function() {
            return C;
          }, N.indexOf = function(Z) {
            return M[Z];
          }, N.contains = function(Z) {
            return typeof M[Z] < "u";
          }, N;
        };
        return w;
      }, D = function(B, q, A) {
        for (var E = J(B, q), b = 0; b < q; b += 1)
          for (var w = 0; w < B; w += 1)
            E.setPixel(w, b, A(w, b));
        var k = _();
        E.write(k);
        for (var p = T(), x = k.toByteArray(), M = 0; M < x.length; M += 1)
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
var J5 = Y5();
const Z5 = /* @__PURE__ */ K5(J5), X5 = ["width", "height", "viewBox"], Q5 = ["width", "height"], e4 = ["d"], t4 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = R(() => {
      const a = Z5(0, "M");
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
      }, null, 8, Q5),
      g("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, e4)
    ], 8, X5));
  }
}, R8 = /* @__PURE__ */ Y(t4, [["__scopeId", "data-v-489f0852"]]), n4 = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "window-room",
      "data-window-room": "",
      style: ge({ padding: e.padding })
    }, [
      ue(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, I8 = /* @__PURE__ */ Y(n4, [["__scopeId", "data-v-47e67f04"]]);
function B8(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const L8 = $i(() => import("./VoiceFigure-DvwQQtqh.js").then((e) => e.V)), N8 = "1.2.0", D8 = "3.5";
export {
  Gd as $,
  _e as A,
  Ce as B,
  sa as C,
  at as D,
  Wx as E,
  Vb as F,
  R$ as G,
  jx as H,
  _b as I,
  Qb as J,
  At as K,
  l4 as L,
  Ns as M,
  ow as N,
  Xb as O,
  aa as P,
  sx as Q,
  d$ as R,
  Ln as S,
  cx as T,
  a$ as U,
  Ee as V,
  zn as W,
  n$ as X,
  t$ as Y,
  Vd as Z,
  Y as _,
  G4 as a,
  _x as a$,
  aw as a0,
  f$ as a1,
  h$ as a2,
  Ne as a3,
  M$ as a4,
  x$ as a5,
  St as a6,
  m$ as a7,
  N$ as a8,
  N4 as a9,
  yx as aA,
  tx as aB,
  pb as aC,
  q$ as aD,
  F$ as aE,
  Hx as aF,
  Hr as aG,
  ix as aH,
  fn as aI,
  W4 as aJ,
  P4 as aK,
  Rx as aL,
  hn as aM,
  Nx as aN,
  T$ as aO,
  nx as aP,
  ax as aQ,
  ex as aR,
  an as aS,
  $t as aT,
  D4 as aU,
  oy as aV,
  X$ as aW,
  c$ as aX,
  Fr as aY,
  Dt as aZ,
  Ft as a_,
  Ex as aa,
  Bx as ab,
  z4 as ac,
  s$ as ad,
  o$ as ae,
  k$ as af,
  $$ as ag,
  S$ as ah,
  Z4 as ai,
  Vo as aj,
  p$ as ak,
  L$ as al,
  Gx as am,
  K$ as an,
  V$ as ao,
  z$ as ap,
  _$ as aq,
  b$ as ar,
  y$ as as,
  w$ as at,
  rx as au,
  B$ as av,
  D$ as aw,
  Jx as ax,
  Yt as ay,
  j$ as az,
  gw as b,
  Yx as b$,
  Wb as b0,
  Lx as b1,
  fx as b2,
  dx as b3,
  Cy as b4,
  Ar as b5,
  xx as b6,
  I$ as b7,
  ra as b8,
  rt as b9,
  mx as bA,
  wx as bB,
  ut as bC,
  ux as bD,
  kx as bE,
  P$ as bF,
  Y$ as bG,
  W$ as bH,
  Te as bI,
  O$ as bJ,
  $x as bK,
  s8 as bL,
  o8 as bM,
  B4 as bN,
  iy as bO,
  A$ as bP,
  px as bQ,
  K4 as bR,
  Vx as bS,
  hx as bT,
  gx as bU,
  vx as bV,
  E$ as bW,
  gb as bX,
  C$ as bY,
  U$ as bZ,
  zx as b_,
  bx as ba,
  Aa as bb,
  Jl as bc,
  Xx as bd,
  t8 as be,
  lx as bf,
  Tx as bg,
  L4 as bh,
  G$ as bi,
  Qx as bj,
  g$ as bk,
  v$ as bl,
  Q4 as bm,
  u$ as bn,
  F4 as bo,
  Cx as bp,
  Y4 as bq,
  J4 as br,
  e$ as bs,
  Z$ as bt,
  ey as bu,
  Dx as bv,
  Zb as bw,
  X4 as bx,
  H4 as by,
  J$ as bz,
  Ay as c,
  Nt as c$,
  q4 as c0,
  j4 as c1,
  H$ as c2,
  n8 as c3,
  Fs as c4,
  a8 as c5,
  si as c6,
  Ox as c7,
  r$ as c8,
  l$ as c9,
  ye as cA,
  w8 as cB,
  p4 as cC,
  N8 as cD,
  D8 as cE,
  x4 as cF,
  $8 as cG,
  ns as cH,
  C4 as cI,
  Pv as cJ,
  Mt as cK,
  us as cL,
  ea as cM,
  y4 as cN,
  M4 as cO,
  qc as cP,
  nv as cQ,
  C8 as cR,
  w4 as cS,
  R8 as cT,
  sr as cU,
  mu as cV,
  v8 as cW,
  lf as cX,
  d4 as cY,
  T4 as cZ,
  hk as c_,
  sy as ca,
  U4 as cb,
  Yb as cc,
  Q$ as cd,
  Is as ce,
  ub as cf,
  ox as cg,
  Jt as ch,
  Lt as ci,
  g4 as cj,
  b8 as ck,
  de as cl,
  Od as cm,
  Dd as cn,
  xs as co,
  jm as cp,
  Ms as cq,
  O8 as cr,
  I4 as cs,
  Fm as ct,
  og as cu,
  Qt as cv,
  l8 as cw,
  s4 as cx,
  xt as cy,
  nd as cz,
  ze as d,
  r4 as d$,
  S4 as d0,
  _t as d1,
  pt as d2,
  Lp as d3,
  $u as d4,
  E4 as d5,
  f4 as d6,
  Pt as d7,
  k8 as d8,
  T8 as d9,
  Gh as dA,
  r8 as dB,
  c4 as dC,
  M8 as dD,
  Iv as dE,
  Lw as dF,
  h4 as dG,
  $4 as dH,
  d8 as dI,
  h8 as dJ,
  Fe as dK,
  v4 as dL,
  b4 as dM,
  Wc as dN,
  pr as dO,
  u8 as dP,
  Ki as dQ,
  u4 as dR,
  i4 as dS,
  xl as dT,
  Ml as dU,
  Iu as dV,
  m4 as dW,
  ct as dX,
  B8 as dY,
  Nw as dZ,
  o4 as d_,
  Ws as da,
  sd as db,
  kt as dc,
  _4 as dd,
  ia as de,
  L8 as df,
  I8 as dg,
  Os as dh,
  f8 as di,
  ps as dj,
  Y1 as dk,
  xo as dl,
  cr as dm,
  Tu as dn,
  E8 as dp,
  _8 as dq,
  bs as dr,
  Ou as ds,
  gl as dt,
  k4 as du,
  A8 as dv,
  R4 as dw,
  O4 as dx,
  A4 as dy,
  i8 as dz,
  i$ as e,
  c8 as e0,
  y8 as e1,
  Iw as e2,
  x8 as e3,
  qg as e4,
  bl as e5,
  $k as e6,
  gs as e7,
  m8 as e8,
  Ua as e9,
  p8 as ea,
  g8 as eb,
  We as ec,
  S8 as ed,
  Ru as ee,
  Q0 as f,
  Zx as g,
  sn as h,
  Px as i,
  e8 as j,
  qx as k,
  Ax as l,
  kw as m,
  Ds as n,
  Ix as o,
  V4 as p,
  Fx as q,
  ni as r,
  ai as s,
  Me as t,
  Ty as u,
  Mx as v,
  Kx as w,
  Sx as x,
  pn as y,
  Ux as z
};
