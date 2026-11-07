/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, normalizeStyle as ye, unref as D, renderSlot as me, createElementVNode as g, normalizeClass as X, Fragment as z, renderList as te, defineComponent as ki, Comment as $i, h as ta, cloneVNode as xi, createBlock as W, withCtx as j, createVNode as L, toDisplayString as b, createCommentVNode as E, ref as A, onMounted as Te, onBeforeUnmount as Je, reactive as fn, shallowRef as Ye, watch as ge, onUnmounted as Le, inject as Oe, useAttrs as na, computed as I, resolveDynamicComponent as mt, mergeProps as Ne, useId as gs, resolveDirective as Mi, withDirectives as De, createTextVNode as ee, Teleport as aa, nextTick as Qe, Transition as Ft, withModifiers as xe, createApp as Si, useModel as Wn, withKeys as jt, vModelText as St, mergeModels as tn, resolveComponent as _i, shallowReactive as Ei, provide as il, onErrorCaptured as Ci, TransitionGroup as cl, isRef as Ks, onScopeDispose as vs, getCurrentInstance as Ai, getCurrentScope as ul, toHandlers as Oi, createSlots as Ti, vShow as dl, useSlots as Ri, normalizeProps as Ii, guardReactiveProps as Bi, defineAsyncComponent as Li } from "vue";
function fl(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const K = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, Ni = 1600, Di = {
  __name: "Shimmer",
  setup(e) {
    const t = fl(Ni);
    return (n, a) => (c(), h("span", {
      class: "shimmer",
      style: ye(D(t))
    }, null, 4));
  }
}, Jt = /* @__PURE__ */ K(Di, [["__scopeId", "data-v-6c018b03"]]), ji = { class: "skeleton-line" }, qi = 2e3, Pi = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = fl(qi);
    return (n, a) => (c(), h("span", ji, [
      me(n.$slots, "default", {}, void 0, !0),
      g("span", {
        class: X(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(z, null, te(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: X(["bar", { still: e.still }]),
          style: ye({ ...D(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, gt = /* @__PURE__ */ K(Pi, [["__scopeId", "data-v-484fe8a0"]]), Wt = ki({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== $i);
      return a.length !== 1 ? ta(z, { key: n }, a) : a[0].key == null ? xi(a[0], { key: n }) : a[0];
    };
  }
}), Fi = ["aria-label"], Wi = ["aria-label"], Hi = ["aria-label"], Ui = ["aria-label"], zi = ["aria-label"], Vi = ["aria-label"], Gi = ["aria-label"], Ki = {
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
    return (i, u) => (c(), W(Wt, { value: e.shape }, {
      messages: j(() => [
        g("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(z, null, te(t, (d) => L(Jt, {
            key: d.id,
            class: X(["skeleton-message", { mine: d.mine }]),
            style: ye({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, Fi)
      ]),
      older: j(() => [
        g("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(z, null, te(t.slice(0, 3), (d) => (c(), W(Jt, {
            key: d.id,
            class: X(["skeleton-message", { mine: d.mine }]),
            style: ye({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, Wi)
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
            (c(), h(z, null, te(n, (f) => L(gt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Hi)
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
            L(gt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (c(), h(z, null, te(s, (f) => L(gt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Ui)
      ]),
      page: j(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          L(gt, {
            class: "skeleton-heading",
            bars: r
          }),
          (c(!0), h(z, null, te(e.count, (d) => (c(), W(gt, {
            key: d,
            bars: D(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, zi)
      ]),
      text: j(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(z, null, te(e.count, (d) => (c(), W(gt, {
            key: d,
            bars: D(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Vi)
      ]),
      default: j(() => [
        g("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(z, null, te(e.count, (d) => (c(), W(gt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Gi)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, pt = /* @__PURE__ */ K(Ki, [["__scopeId", "data-v-ef519c5f"]]), Yi = {
  key: 1,
  class: "empty-state titled"
}, Ji = { class: "empty-state-title" }, Qi = { class: "empty-state-text" }, Zi = {
  key: 2,
  class: "empty-state"
}, Xi = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), W(pt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", Yi, [
      g("p", Ji, b(e.title), 1),
      g("p", Qi, [
        me(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", Zi, [
      me(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, nn = /* @__PURE__ */ K(Xi, [["__scopeId", "data-v-b27e89b0"]]), ec = { class: "fold-group" }, tc = ["aria-expanded"], nc = { class: "fold-label" }, ac = {
  key: 0,
  class: "fold-count"
}, sc = {
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
    return (a, s) => (c(), h("div", ec, [
      g("button", {
        type: "button",
        class: X(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        g("span", nc, b(e.label), 1),
        e.count !== "" ? (c(), h("span", ac, b(e.count), 1)) : E("", !0),
        g("span", {
          class: X(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, tc),
      e.open ? me(a.$slots, "default", {}, void 0, !0, 0) : E("", !0)
    ]));
  }
}, M$ = /* @__PURE__ */ K(sc, [["__scopeId", "data-v-9ef1865c"]]), oc = 150, lc = () => oc;
function ys(e, t, n = lc(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function rc(e, t, n) {
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
const ic = 50, Ys = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function S$(e) {
  const t = Ue().sources.find((n) => n.key === e);
  return t ? Ka(t.read, t.events) : Ka("", []);
}
function hl(e, t, n, a, s = () => !1) {
  const o = A([]), l = A(null), r = A(""), i = A(!1), u = performance.now(), d = A(!1), f = A(""), m = A(null), v = /* @__PURE__ */ new Set();
  let y = null;
  function x(p) {
    return s() ? (v.add(p), y ?? (y = new Promise((M) => setTimeout(() => M(C()), ic)))) : _(p);
  }
  async function C() {
    const p = new Set(v);
    v.clear(), y = null;
    const M = q, S = await t({ ids: [...p].join(","), limit: p.size });
    if (M !== q) return;
    if (!S.ok) return T();
    const R = new Map(S.value.rows.map((P) => [P.id, P]));
    o.value = o.value.flatMap((P) => p.has(P.id) ? R.has(P.id) ? [R.get(P.id)] : [] : [P]);
  }
  async function _(p) {
    const M = q, S = await t({ "before-id": p + 1, limit: 1 });
    if (M !== q) return;
    if (!S.ok) return T();
    const R = S.value.rows.find((P) => P.id === p);
    o.value = R ? o.value.map((P) => P.id === p ? R : P) : o.value.filter((P) => P.id !== p);
  }
  async function N(p) {
    if (a() && String((p == null ? void 0 : p.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((se) => se.id !== p.row_id));
    if (a() && (p != null && p.row_id) && !String(p.event ?? "").endsWith(".create") && o.value.some((se) => se.id === p.row_id)) return x(p.row_id);
    if (!(a() && o.value.length && String((p == null ? void 0 : p.event) ?? "").endsWith(".create"))) return T();
    const S = Math.max(...o.value.map((se) => se.id)), R = q, P = await t({ "after-id": S });
    if (R !== q) return;
    if (!P.ok) return T();
    const Q = new Set(o.value.map((se) => se.id));
    o.value = [...P.value.rows.filter((se) => !Q.has(se.id)), ...o.value];
  }
  async function U() {
    if (!d.value || !o.value.length) return !1;
    const p = q, M = Math.min(...o.value.map((P) => P.id)), S = await t({ "before-id": M });
    if (p !== q) return !1;
    if (!S.ok || !S.value.rows.length) return d.value = !1;
    d.value = Ys(S.value, n());
    const R = new Set(o.value.map((P) => P.id));
    return o.value = [...o.value, ...S.value.rows.filter((P) => !R.has(P.id))], !0;
  }
  let q = 0;
  function B(p, M) {
    var P, Q;
    const S = p.ok ? e.shared ? [p.value] : ((P = p.value) == null ? void 0 : P.rows) ?? [] : [];
    p.ok && (o.value = M(S)), l.value = p.ok ? p.value : null;
    const R = S.length ? Math.min(...S.map((se) => se.id)) : 0;
    p.ok && ((Q = p.value) != null && Q.rows) && !o.value.some((se) => se.id < R) && (d.value = !e.shared && Ys(p.value, n())), r.value = p.ok ? "" : p.error, ys(u, () => i.value = !0);
  }
  async function F(p) {
    const M = ++q, S = await t({});
    M === q && B(S, p);
  }
  const O = (p) => {
    if (!a() || !p.length) return p;
    const M = Math.min(...p.map((R) => R.id)), S = Math.max(...p.map((R) => R.id));
    return [...o.value.filter((R) => R.id > S), ...p, ...o.value.filter((R) => R.id < M)];
  }, T = () => F(O), $ = (p) => B(p, O), w = () => F((p) => p);
  async function k(p, M = null) {
    const S = await rc(M && { target: o, fields: { value: M(o.value) } }, p, e.run);
    return f.value = S.ok ? "" : S.error, m.value = S.ok ? S.value : null, await T(), S;
  }
  return { rows: o, listing: l, failure: r, loaded: i, more: d, load: T, loadLatest: w, older: U, act: k, actionFailure: f, answer: m, context: e, heard: N, showFirst: $ };
}
const cc = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function Ka(e, t, { incremental: n = !1 } = {}) {
  var r;
  const a = Number(((r = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : r[1]) ?? 50), s = Ue(), l = hl(s, (i) => s.read(s.shared && !Object.keys(i).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${cc(i)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const uc = 2e3;
function bs(e, t, n = uc) {
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
  Te(async () => {
    document.addEventListener("visibilitychange", u), await l(e), i();
  }), Je(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", u);
  });
}
const ml = typeof document < "u" && document.documentElement.classList.contains("phone"), pl = 120;
var ll;
const pa = globalThis[ll = Symbol.for("journal.pressed")] ?? (globalThis[ll] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function dc(e = 0) {
  const t = pa.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, pa.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, pa.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function Ya(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function gl(e = window) {
  if (!Ya(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Ya(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Ja = "journal.stale-build-reload", fc = 'script[type="module"][src*="/assets/index-"]', Js = (e) => {
  var t;
  return ((t = e.querySelector(fc)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function hc(e = document, t = (a, s) => Se.quietRead(a, s), n = () => gl(window)) {
  const a = Js(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Js(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let ga = "";
function mc(e, t = () => gl(window)) {
  if (!e) return !1;
  const n = !!ga && ga !== e;
  return ga = e, n && t(), n;
}
const pc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function gc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Ja) === e.message) return !1;
    t.setItem(Ja, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function vc(e = window.sessionStorage) {
  try {
    e.removeItem(Ja);
  } catch {
    return;
  }
}
const yc = 2e3, bc = 3e4, ze = fn({ starting: !1, external: !1, late: !1, offline: !1 }), ws = () => ze.starting, wc = 3;
let $n = 0, Qa = 0, vl = 0, yl = [];
async function kc() {
  try {
    const e = await Se.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: ze.external };
  }
}
let Qs = null;
const $c = () => Qs ?? (Qs = kc().finally(() => Qs = null));
function xc() {
  clearTimeout(Qa), clearTimeout(vl), Qa = 0, Object.assign(ze, { starting: !1, external: !1, late: !1, offline: !1 }), yl.splice(0).forEach((e) => e()), hc();
}
async function Mc() {
  ze.offline = !navigator.onLine;
  const e = await $c();
  if (ze.external = e.updating, $n = !e.restarting && !e.updating && e.reachable ? $n + 1 : 0, $n < wc) return;
  $n = 0, (!mc(e.started_at) || Ya()) && xc();
}
function bl() {
  Qa = setTimeout(async () => {
    await Mc(), ze.starting && bl();
  }, yc);
}
function Sc() {
  ze.starting || (ze.starting = !0, ze.offline = !navigator.onLine, bl(), vl = setTimeout(() => ze.late = !0, bc));
}
const wl = () => ze.starting ? new Promise((e) => yl.push(e)) : Promise.resolve();
function kl(e, t, n = 0) {
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
function _c(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class Ec {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = kl(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = _c(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const lt = "viewer.shell", xn = 2e4, Cc = 4, Zs = "/api/read-lines", Ac = 5e3, Oc = 403, Xs = "/api/repeated-lines", Tc = 10, Rc = 2e3, Ic = 3e5, _$ = 6e5, Mn = 6, Bc = 500, Lc = "/journal/summary", eo = "/api/server-state", Nc = 2e4, Sn = ml ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Dc = (e) => e.split("?")[0].endsWith(Lc), Za = (e, t) => Object.assign(new Error(t), { status: e });
async function jc(e, t, n = Za) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const qc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), Pc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), to = (e) => e.split(" ").slice(0, 2).join(" "), et = "read", It = "write", Fc = "stream";
class Wc {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = Mn;
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = to(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one noun and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, i]) => o - i < Rc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < Tc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const r = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(Xs, { method: "POST", headers: { ...Sn, "Content-Type": "application/json" }, body: r }, [{ window: lt, line: Xs, kind: It }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = dc(n ? pl : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: Pc(n.signal, s) } : n;
    try {
      return await fetch(t, a[0].kind === It ? { ...l, priority: "high" } : l);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up
  async sent(t, n, a, s = xn) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      throw o instanceof TypeError && Sc(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= Cc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(Zs, { headers: Sn }, [{ window: lt, line: Zs, kind: et }], Ac).then(async (t) => {
      if (t.status === Oc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw Za(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new Ec(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = to(n.join(" ")), r = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
      this.tries = Mn;
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
    const r = a instanceof FormData, i = { method: t, headers: { ...Sn, ...l, ...a === void 0 || r ? {} : { "Content-Type": "application/json" } }, body: qc(a) }, u = s || (r ? Ic : xn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, i, [{ window: lt, line: n, kind: et }], u)) : await this.sent(n, i, [{ window: lt, line: n, kind: It }], u);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((f) => setTimeout(f, Bc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = Mn, l = {}) {
    this.watcher("sent", t, n, a);
    const r = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return jc(r, `${r.status} ${r.statusText}`).catch((i) => {
      throw i.blocked && t !== "GET" && this.refused(i.message), i;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: lt, line: t, kind: et }], xn)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: Sn });
    if (!n.ok) throw Za(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, Mn, o).then((r) => (this.written(n), r)) : ws() && !Dc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: lt, line: t, kind: Fc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(eo, { cache: "no-store" }, [{ window: lt, line: eo, kind: et }], Nc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = lt, line: s = t, limit: o = xn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? et : It;
    return l === It ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const va = Symbol.for("journal.transport"), Se = globalThis[va] ?? (globalThis[va] = new Wc());
class Hc {
  constructor() {
    this.following = Ye([]), this.held = /* @__PURE__ */ new Set();
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
    Se.readsOutdated();
    for (const n of this.follows)
      n.patterns.some((a) => ks(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function ks(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const Uc = 50, zc = "refresh", Vc = 1e3, Gc = 3e4, Kc = "requested", Yc = "after_window", Jc = 50, _n = ".*", Qc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function Zc(e) {
  const t = {}, n = fn({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, r = /* @__PURE__ */ new Set();
  let i = {}, u = 0, d = 0, f = !1;
  function m($) {
    const w = () => i[$] ?? i[`${$.slice(0, $.lastIndexOf("."))}.*`] ?? {}, k = A(void 0), p = hl(e, async (M) => {
      const S = await x($, M);
      return S.ok && !Object.keys(M).length && (k.value = S.value), S;
    }, () => w().page_size || Jc, () => !!w().page_size, () => !!w().reads_ids);
    return t[$] = { ...p, data: k, readAt: 0 };
  }
  const v = new Proxy({}, { get: ($, w) => typeof w != "string" || w.startsWith("__v") ? void 0 : t[w] ?? m(w) }), y = ($) => (i[$].loading !== Kc || $.endsWith(_n)) && (!i[$].tab || i[$].tab === n.tab);
  function x($, w = {}) {
    return new Promise((k) => {
      a.push({ name: $, flags: w, resolve: k }), a.length === 1 && setTimeout(C);
    });
  }
  async function C() {
    const $ = /* @__PURE__ */ new Map(), w = a.splice(0).filter((M) => {
      const S = JSON.stringify(M.flags);
      return $.has(M.name) || $.set(M.name, S), $.get(M.name) === S ? !0 : (a.push(M), !1);
    });
    a.length && setTimeout(C);
    const k = Object.fromEntries(w.flatMap(({ name: M, flags: S }) => Object.entries(S).map(([R, P]) => [`${M}.${R}`, P]))), p = await e.readKeys({ only: [...new Set(w.map(({ name: M }) => M))], state: { ...n, ...k } });
    w.forEach(({ name: M, resolve: S }) => S(p.ok ? p.value.keys[M] : p));
  }
  async function _($) {
    var M;
    const w = ++d;
    ($.length ? $ : Object.keys(i).filter((S) => !S.endsWith(_n) && i[S].loading === "first" && y(S))).forEach((S) => l[S] = w);
    const p = await e.readKeys({ only: $, state: { ...n } });
    if (!p.ok) {
      if (p.failure === "cancelled") return !1;
      const S = ($.length ? $ : Object.keys(t)).filter((P) => (l[P] ?? 0) <= w);
      S.forEach((P) => {
        v[P].readAt = Date.now(), p.failure === "unreachable" ? r.add(P) : r.delete(P), v[P].showFirst(p);
      });
      const R = p.failure === "unreachable" && ((M = e.waitForServer) == null ? void 0 : M.call(e));
      return R && R.then(() => {
        if (f) return;
        const P = S.filter((Q) => l[Q] === w);
        (P.length || !$.length && !S.length && d === w) && _(P);
      }), !1;
    }
    return O(p.value.declared), Object.entries(p.value.keys).forEach(([S, R]) => {
      (l[S] ?? 0) > w || (l[S] = w, v[S].readAt = Date.now(), r.delete(S), R.ok && (v[S].data.value = R.value), v[S].showFirst(R));
    }), !0;
  }
  function N($) {
    const w = Qc($);
    return w.length ? (w.forEach((k) => o.names.add(k)), o.answer ?? (o.answer = new Promise((k) => setTimeout(() => {
      const p = [...o.names];
      o.names.clear(), o.answer = null, k(_(p));
    })))) : _([]);
  }
  function U($) {
    $.forEach((w) => s.add(w)), clearTimeout(u), u = setTimeout(() => {
      const w = [...s];
      s.clear(), w.length && _(w);
    }, Uc);
  }
  const q = ($) => $.endsWith(_n) ? Object.keys(t).filter((w) => w.startsWith($.slice(0, -1)) && t[w].readAt) : [$], B = ($) => (i[$] ?? i[`${$.split(".")[0]}.*`]).reload_seconds;
  function F($) {
    const w = Object.keys(i).filter((p) => $.event === zc || i[p].events.some((M) => ks(M, $.event)));
    w.filter((p) => i[p].page_size).forEach((p) => v[p].heard($));
    const k = w.filter((p) => !i[p].page_size);
    k.filter((p) => !y(p)).forEach((p) => v[p].readAt = 0), U(k.filter(y).flatMap(q));
  }
  function O($) {
    if (Object.keys(i).length) return;
    i = $;
    const w = [...new Set(Object.values($).flatMap((p) => p.events))];
    w.length && e.follow(w, F);
    const k = Object.keys($).filter((p) => $[p].loading === Yc);
    k.length && _(k);
  }
  ge(() => n.tab, () => {
    const $ = Object.keys(i).filter((w) => !w.endsWith(_n) && y(w) && !v[w].readAt);
    $.length && _($);
  }), Le(() => {
    f = !0, clearTimeout(u);
  });
  function T() {
    const $ = Date.now(), w = Object.keys(i).filter((k) => i[k].reload_seconds > 0 && y(k)).flatMap(q).filter((k) => $ - v[k].readAt >= (r.has(k) ? Math.min(B(k) * 1e3, Gc) : B(k) * 1e3));
    w.length && U(w);
  }
  return bs(T, () => e.visible.value, Vc), queueMicrotask(() => _([])), { props: v, state: n, reload: N, readKey: x };
}
const Xc = Symbol("open-view"), je = Symbol.for("journal.window-context"), $l = Symbol("dock-card");
function eu(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = Zc(e));
  return Object.defineProperties(e, {
    props: { get: () => n().props },
    state: { get: () => n().state },
    reload: { value: (a) => n().reload(a) },
    readKey: { value: (a, s) => n().readKey(a, s) }
  });
}
function Ue() {
  const e = Oe(je, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return eu(e);
}
const tu = (e, t) => e($l, t), E$ = () => Oe($l), nu = ["data-icon", "stroke-width", "innerHTML"], be = {
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
      style: ye({
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
    }, null, 12, nu));
  }
}, au = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: ye({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, su = /* @__PURE__ */ K(au, [["__scopeId", "data-v-eb453d6f"]]), ou = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = na(), a = I(() => Object.fromEntries(Object.entries(n).filter(([u]) => u !== "onClick"))), s = A(!1), o = I(() => t.busy || s.value), l = Oe(je, null), r = I(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function i(u) {
      const d = [n.onClick].flat().filter(Boolean).map((m) => m(u)).filter((m) => m instanceof Promise);
      if (!d.length) return;
      const f = setTimeout(() => s.value = !0, pl);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(f), s.value = !1;
      }
    }
    return (u, d) => (c(), W(mt(e.href ? "a" : "button"), Ne(a.value, {
      type: e.href ? void 0 : D(n).type || "button",
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
          e.icon ? (c(), W(be, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : E("", !0),
          me(u.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (c(), W(su, {
          key: 0,
          class: "btn-spinner"
        })) : E("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), de = /* @__PURE__ */ K(ou, [["__scopeId", "data-v-ededdadf"]]), lu = ["aria-checked", "aria-haspopup", "onClick"], ru = {
  key: 0,
  class: "segmented-dot"
}, iu = {
  key: 1,
  class: "segmented-note"
}, cu = {
  key: 2,
  class: "segmented-count"
}, uu = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = gs();
    return (s, o) => {
      const l = Mi("tip");
      return c(), h("span", {
        class: X(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(z, null, te(e.options, (r) => De((c(), h("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: X(["segmented-option", { on: r.key === e.value }]),
          onClick: (i) => n("pick", r.key)
        }, [
          r.dot ? (c(), h("span", ru)) : E("", !0),
          ee(" " + b(r.label) + " ", 1),
          r.note ? (c(), h("small", iu, b(r.note), 1)) : E("", !0),
          r.count !== void 0 ? (c(), h("em", cu, b(r.count), 1)) : E("", !0)
        ], 10, lu)), [
          [l, r.tip || r.title, `${D(a)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, qt = /* @__PURE__ */ K(uu, [["__scopeId", "data-v-c89bc92d"]]), du = {
  key: 0,
  class: "more-items"
}, fu = {
  key: 0,
  role: "alert"
}, hu = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (c(), h("div", du, [
      e.failure ? (c(), h("p", fu, b(e.failure), 1)) : E("", !0),
      e.more ? (c(), W(de, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: j(() => [
          ee(b(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : E("", !0)
    ])) : E("", !0);
  }
}, hn = /* @__PURE__ */ K(hu, [["__scopeId", "data-v-10464014"]]), mu = { class: "link-group" }, pu = {
  class: "group-label",
  "data-link-kind": ""
}, gu = ["disabled", "onClick"], vu = { class: "title" }, yu = { class: "relations" }, bu = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(!1), o = I(() => s.value ? n.rows : n.rows.slice(0, 3)), l = I(() => `${n.model.replaceAll("_", " ").replace(/^./, (d) => d.toUpperCase())} ${n.count}`), r = (d) => d.endpoint.unavailable || !d.endpoint.open_ref, i = (d) => ({ [n.linkAttribute]: !0, "data-link-model": d.endpoint.model, "data-link-id": d.endpoint.id }), u = (d) => `${d.endpoint.model === "doc" && d.endpoint.id === n.documentId ? "Design document" : d.endpoint.model.replaceAll("_", " ").replace(/^./, (f) => f.toUpperCase())} ${d.endpoint.id}, ${d.relations.map((f) => f.replaceAll("_", " ")).join(", ")}`;
    return (d, f) => (c(), h("div", mu, [
      g("div", pu, b(l.value), 1),
      (c(!0), h(z, null, te(o.value, (m) => (c(), h("button", Ne({
        key: `${m.endpoint.model}:${m.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, i(m), {
        disabled: r(m),
        onClick: (v) => a("open", m)
      }), [
        g("span", vu, b(m.endpoint.title), 1),
        g("span", yu, [
          ee(b(u(m)), 1),
          r(m) ? (c(), h(z, { key: 0 }, [
            ee(" · Unavailable")
          ], 64)) : E("", !0)
        ])
      ], 16, gu))), 128)),
      e.rows.length > 3 && !s.value ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: f[0] || (f[0] = (m) => s.value = !0)
      }, "Show more")) : E("", !0)
    ]));
  }
}, wu = /* @__PURE__ */ K(bu, [["__scopeId", "data-v-be6f079c"]]), ku = ["data-loaded"], $u = { class: "rows" }, xu = ["disabled", "onClick"], Mu = { class: "title" }, Su = { class: "relations" }, _u = { key: 2 }, Eu = {
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
    const n = e, a = t, s = A([]), o = A({}), l = A(0), r = A(""), i = A(null), u = A(!1), d = A("");
    let f = 0;
    const m = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, v = (T) => m[T] || `${T.replaceAll("_", " ").replace(/^./, ($) => $.toUpperCase())}s`, y = I(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((T, $) => T + $, 0) },
      ...Object.entries(o.value).filter(([T]) => !n.onlyKinds.length || n.onlyKinds.includes(T)).map(([T, $]) => ({ key: T, label: v(T), count: $ }))
    ]), x = I(() => {
      const T = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((w) => w.endpoint.model))].map((w) => [w, s.value.filter((k) => k.endpoint.model === w).length])), $ = { doc: 0, task: 1, message: 2 };
      return Object.entries(T).sort(([w], [k]) => ($[w] ?? 3) - ($[k] ?? 3)).map(([w, k]) => ({ model: w, count: k, rows: s.value.filter((p) => p.endpoint.model === w) }));
    }), C = (T) => T.endpoint.unavailable || !T.endpoint.open_ref, _ = (T) => ({ [n.linkAttribute]: !0, "data-link-model": T.endpoint.model, "data-link-id": T.endpoint.id }), N = (T) => `${T.endpoint.model === "doc" && T.endpoint.id === n.documentId ? "Design document" : T.endpoint.model.replaceAll("_", " ").replace(/^./, ($) => $.toUpperCase())} ${T.endpoint.id}, ${T.relations.map(($) => $.replaceAll("_", " ")).join(", ")}`;
    async function U(T = 1) {
      const $ = ++f;
      u.value = !0, d.value = "";
      const w = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(T), "--page-size", String(n.pageSize)];
      n.outsidePlan && w.push("--outside-plan"), n.documentId && w.push("--first-counterpart", `doc:${n.documentId}`), r.value && w.push("--kind", r.value);
      try {
        const k = await n.read(w);
        if ($ !== f) return;
        if (!k.ok) {
          d.value = k.error;
          return;
        }
        const p = k.value.counterparts ?? [], M = T === 1 ? p : [...s.value, ...p];
        s.value = [...new Map(M.map((S) => [`${S.endpoint.model}:${S.endpoint.id}`, S])).values()], o.value = k.value.kinds ?? {}, l.value = k.value.total, i.value = k.value.next_page ?? null;
      } catch (k) {
        $ === f && (d.value = k.message);
      } finally {
        $ === f && (u.value = !1);
      }
    }
    function q(T) {
      if (C(T)) return;
      const [$, w] = T.endpoint.open_ref.split(":");
      a("open", { table: $, id: Number(w) });
    }
    function B(T) {
      r.value = T, U();
    }
    const F = () => !u.value && i.value && U(i.value), O = I(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return ge(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], i.value = null, r.value = "", U();
    }, { immediate: !0 }), (T, $) => s.value.length || u.value || d.value || e.empty ? (c(), h("section", {
      key: 0,
      class: X(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      y.value.length > 2 ? (c(), W(qt, {
        key: 0,
        options: y.value,
        value: r.value,
        wrap: "",
        onPick: B
      }, null, 8, ["options", "value"])) : E("", !0),
      g("div", $u, [
        e.grouped ? (c(!0), h(z, { key: 0 }, te(x.value, (w) => (c(), W(wu, {
          key: w.model,
          model: w.model,
          count: w.count,
          rows: w.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: q
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (c(!0), h(z, { key: 1 }, te(s.value, (w) => (c(), h("button", Ne({
          key: `${w.endpoint.model}:${w.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, _(w), {
          disabled: C(w),
          onClick: (k) => q(w)
        }), [
          g("span", Mu, b(w.endpoint.title), 1),
          g("span", Su, [
            ee(b(N(w)), 1),
            C(w) ? (c(), h(z, { key: 0 }, [
              ee(" · Unavailable")
            ], 64)) : E("", !0)
          ])
        ], 16, xu))), 128)),
        !s.value.length && !u.value && !d.value && e.empty ? (c(), h("p", _u, b(e.empty), 1)) : E("", !0),
        L(hn, {
          more: !!i.value,
          loading: u.value,
          failure: d.value,
          label: O.value,
          onMore: F
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, ku)) : E("", !0);
  }
}, Cu = /* @__PURE__ */ K(Eu, [["__scopeId", "data-v-29b9c31b"]]), Au = (e, t, n) => Math.max(t, Math.min(n, e)), Ou = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, xl = /* @__PURE__ */ new WeakMap(), Tu = (e, t) => xl.set(e, t);
function Ru(e, t) {
  for (let n = t; n; n = xl.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Ml(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !Ru(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Le(() => window.removeEventListener("click", n));
}
const Tt = 8, Iu = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = A(null), o = (p) => p ? `${p}px` : void 0, l = I(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), r = A({ w: 0, h: 0 }), i = A(a.anchor ? a.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (p) => ({
      left: Math.max(0, p.left),
      top: Math.max(0, p.top),
      right: Math.min(window.innerWidth, p.right),
      bottom: Math.min(window.innerHeight, p.bottom)
    }), f = (p) => {
      const M = p.closest(".pane, .float-window");
      return M ? d(M.getBoundingClientRect()) : u();
    }, m = (p, M) => `${Math.max(0, p ? Math.min(p, M) : M)}px`;
    function v(p, M) {
      return {
        below: p.bottom - M.bottom - a.gap - Tt,
        above: M.top - p.top - a.gap - Tt,
        across: p.right - p.left - 2 * Tt
      };
    }
    function y(p) {
      const M = f(a.anchor), S = v(M, p);
      return r.value.w <= S.across && r.value.h <= Math.max(S.below, S.above) ? M : u();
    }
    const x = I(() => {
      if (!i.value) return l.value;
      const p = i.value, M = y(p), S = v(M, p), { w: R, h: P } = r.value, Q = a.align === "auto" ? p.left + p.right > M.left + M.right : a.align === "right", se = Au(Q ? p.right - R : p.left, M.left + Tt, Math.max(M.left + Tt, M.right - R - Tt)), pe = P > S.below && S.above > S.below ? { bottom: `${window.innerHeight - p.top + a.gap}px`, maxHeight: m(a.maxHeight, S.above) } : { top: `${p.bottom + a.gap}px`, maxHeight: m(a.maxHeight, S.below) };
      return { ...l.value, ...pe, left: `${se}px`, maxWidth: m(a.maxWidth, S.across) };
    }), C = n, _ = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function N(p) {
      const M = _(), S = M.indexOf(document.activeElement);
      M[(S + p + M.length) % M.length].focus();
    }
    const U = { ArrowDown: () => N(1), ArrowUp: () => N(-1), Escape: () => C("close") }, q = (p) => U[p.key] && (p.preventDefault(), U[p.key]()), B = () => s.value && (r.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let F = 0;
    const O = new ResizeObserver(() => {
      cancelAnimationFrame(F), F = requestAnimationFrame(B);
    });
    Ml(s, (p) => a.anchor && !a.anchor.contains(p.target) && C("close"));
    const T = (p, M) => ["top", "left", "right", "bottom"].some((S) => Math.abs(p[S] - M[S]) > 1), $ = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let w = 0;
    function k() {
      if (a.anchor) {
        const p = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || $(p)) return C("close");
        T(p, i.value) && (i.value = p);
      }
      w = requestAnimationFrame(k);
    }
    return Te(() => {
      a.anchor && s.value && Tu(s.value, a.anchor), B(), s.value && O.observe(s.value), !a.plain && _()[0] && _()[0].focus(), k();
    }), Le(() => {
      O.disconnect(), cancelAnimationFrame(w), cancelAnimationFrame(F);
    }), t({ element: s }), (p, M) => (c(), W(aa, {
      to: "body",
      disabled: !e.anchor
    }, [
      g("div", Ne({
        ref_key: "panel",
        ref: s
      }, p.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: x.value,
        onKeydown: q
      }), [
        me(p.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), sa = /* @__PURE__ */ K(Iu, [["__scopeId", "data-v-3d203970"]]), Bu = { class: "split-button" }, Lu = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = A(null), s = A(!1), o = () => s.value = !1;
    return (l, r) => (c(), h("span", Bu, [
      L(de, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: r[0] || (r[0] = (i) => n("main"))
      }, {
        default: j(() => [
          me(l.$slots, "default", {}, void 0, !0)
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
            L(be, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (c(), W(sa, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: j(() => [
          me(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : E("", !0)
    ]));
  }
}, Nu = /* @__PURE__ */ K(Lu, [["__scopeId", "data-v-c258494d"]]), Du = 0, ju = "/api/lines", qu = "/api/line", no = 5e3, ao = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), so = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), ya = (e) => JSON.stringify(e.line), oo = () => new DOMException("cancelled", "AbortError");
class Pu {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(ya(t))) {
        Se.whenFree(() => this.readAlone(l));
        return;
      }
      this.waiting.push(l), this.sendSoon();
    });
  }
  // a write always finishes, also when its window has gone: it carries no signal
  write(t) {
    return new Promise((n, a) => this.alone({ body: t, resolve: n, reject: a }, It));
  }
  sendSoon() {
    this.timer ?? (this.timer = setTimeout(() => Se.whenFree(() => this.send()), Du));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(oo())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(oo()), n.abort();
    });
    t.forEach((o, l) => {
      var r;
      return (r = o.signal) == null ? void 0 : r.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Se.sent(ju, ao({ lines: t.map((r) => r.body) }, n.signal), t.map((r) => so(r.body, et)), no);
      if (!o.ok) throw new Error(`the journal answered ${o.status} to a batch of lines`);
      const { answers: l } = await o.json();
      t.forEach((r, i) => r.resolve(l[i]));
    } catch (o) {
      n.signal.aborted ? (this.waiting.push(...a), a.size && this.sendSoon()) : o.name === "TimeoutError" ? t.forEach((l) => Se.whenFree(() => this.readAlone(l))) : t.forEach((l) => l.reject(o));
    } finally {
      t.forEach((o, l) => {
        var r;
        return (r = o.signal) == null ? void 0 : r.removeEventListener("abort", s[l]);
      });
    }
  }
  async readAlone(t) {
    const n = Date.now();
    await this.alone(t, et), Date.now() - n < no ? this.slow.delete(ya(t.body)) : this.slow.add(ya(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Se.sent(qu, ao(t.body, t.signal), [so(t.body, n)], n === et ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const Sl = new Pu(), Fu = "/api/window";
function Wu(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${Fu}?${o}`, r = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, i = (u) => Se.whenFree(async () => {
    const d = await Se.sent(l, { signal: u, headers: r }, [{ window: e, line: l, kind: et }]);
    if (!d.ok) throw new Error((await d.json()).error);
    return d.json();
  });
  return Se.joined(`${e} ${n.join(",")} ${o}`, i, s);
}
const _l = /* @__PURE__ */ new Map();
class Hu {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = Ye({ buttons: [], missing: {} }), this.loading = Ye(!1), this.loaded = Ye(!1), this.failed = Ye(""), this.pending = null;
  }
  load() {
    return this.pending ? this.pending : (this.loading.value = !0, this.pending = this.read().then((t) => (this.offers.value = t, this.loaded.value = !0, this.failed.value = "", t)).catch((t) => {
      throw this.failed.value = t.message, t;
    }).finally(() => {
      this.pending = null, this.loading.value = !1;
    }), this.pending);
  }
  async read() {
    const t = await Se.raw(`/api/buttons?environment=${encodeURIComponent(this.environment)}`);
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
function C$(e, t) {
  const n = new Hu(e, t);
  return _l.set(e, n), n.load().catch(() => {
  }), n;
}
const $s = (e) => _l.get(e);
function Uu(e, t, n) {
  const a = $s(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function zu(e, t) {
  if (!e) return !0;
  const n = $s(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Vu = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let El = {};
async function A$(e = (t) => Se.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (El = (await t.json()).states);
}
const xs = (e, t) => {
  var n;
  return (n = El[e]) == null ? void 0 : n[t];
}, Ms = (e, t) => {
  var n;
  return ((n = xs(e, t)) == null ? void 0 : n.label) ?? Vu(t);
}, Cl = (e, t) => {
  var n;
  return ((n = xs(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, Gu = (e, t) => {
  var n;
  return ((n = xs(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, Ku = Symbol("pane-page"), Al = Symbol("inspector-host"), Ol = { 1: "refused", 2: "usage", 3: "fault" }, Yu = 100, Ju = 50, Qu = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, Zu = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function Xu({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: r, options: i = A({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: m = "", tabs: v = [], sources: y = [], links: x = {}, search: C = {}, readOnly: _ = !1, shared: N = null }) {
  const U = /* @__PURE__ */ new Map(), q = new AbortController(), B = A(!1), F = performance.now();
  let O = 0, T = 0, $ = () => {
  };
  const w = new Promise((P) => $ = P);
  q.signal.addEventListener("abort", $, { once: !0 });
  const k = () => {
    clearTimeout(T), T = setTimeout(() => {
      O === 0 && ys(F, () => {
        B.value = !0, $();
      });
    }, Ju);
  }, p = (P, Q) => (O += 1, Bt(e, P, t, q.signal, Q).finally(() => {
    O -= 1, k();
  })), M = (P, Q) => (k(), w.then(() => q.signal.aborted ? st : Bt(e, P, t, q.signal, Q))), S = ({ only: P = [], state: Q = {} } = {}) => (O += 1, td(() => Wu(e, t, P, Q, q.signal), q.signal).finally(() => {
    O -= 1, k();
  })), R = (P, { unbatched: Q = !1, deferred: se = !1 } = {}) => {
    const ie = U.get(P);
    if (ie && performance.now() - ie.at < Yu) return ie.answer;
    const pe = se && !B.value ? M(P, Q) : p(P, Q);
    return U.set(P, { answer: pe, at: performance.now() }), pe;
  };
  return {
    answered: B,
    settle: k,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: I(() => a()),
    permissions: s,
    autoScroll: m,
    tabs: v,
    sources: y,
    links: x,
    search: C,
    readOnly: _,
    shared: N,
    read: R,
    readKeys: S,
    waitForServer: () => ws() ? wl() : null,
    run: (P) => Bt(e, P, t, q.signal),
    upload: (P) => ad(P, e, q.signal),
    cancel: () => q.abort(),
    signal: q.signal,
    subscriptions: l,
    follow: (P, Q) => l.follow(e, [P].flat().filter((se) => o.some((ie) => ks(ie, se))), (se) => {
      U.clear(), Q(se);
    }, a),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (P) => I(() => {
      var Q;
      return i.value[P] ?? ((Q = u.find((se) => se.key === P)) == null ? void 0 : Q.default);
    }),
    setting: async (P, Q) => {
      const se = await R(`window setting ${e} ${P}`);
      return se.ok ? se.value.value : Q;
    },
    setOption: f,
    keep: (P, Q) => Bt(e, ["window", "save-setting", e, P, JSON.stringify(Q)], t, q.signal)
  };
}
function Tl(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const st = { ok: !1, failure: "cancelled", error: "" }, Ss = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function Rl(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? st : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: Ol[n.code] || "fault", error: Tl(n.error) };
  } catch {
    return t != null && t.aborted ? st : { ok: !1, failure: "unreachable", error: Ss };
  }
}
const ed = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: Ol[e.code] || "fault", error: Tl(e.error) };
async function td(e, t) {
  try {
    const n = await e();
    return t.aborted ? st : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, ed(s)])) } };
  } catch {
    return t.aborted ? st : { ok: !1, failure: "unreachable", error: Ss };
  }
}
async function Il(e, t, n) {
  const a = await Rl(() => Sl.read(e, t, n), t);
  return a.failure !== "unreachable" || !ws() ? a : (await wl(), t.aborted ? st : Il(e, t, n));
}
function Bt(e, t, n, a = void 0, s = !1) {
  return Se.held(() => nd(e, t, n, a, s), Se.knownRead(Array.isArray(t) ? t : _s(t)));
}
async function nd(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : _s(t), environment: n };
  return await Se.isRead(o.line) ? Se.joined(JSON.stringify(o), (l, r) => Il({ ...o, attribution: r }, l, s), a, o).catch(() => st) : Rl(() => Sl.write({ ...o, attribution: {
    client_id: Se.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function ad(e, t, n = void 0) {
  try {
    const a = await Se.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? st : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? st : { ok: !1, failure: "unreachable", error: Ss };
  }
}
function _s(e) {
  return [...e.matchAll(Qu)].map(([t]) => t.replace(Zu, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const sd = (e) => `show-${e}`, O$ = (e, t, n) => e.filter((a) => {
  var s;
  return n(sd((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), Bl = "messages.chat", od = {
  key: 0,
  class: "template-brief"
}, ld = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, rd = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A([]), o = A(""), l = I(() => s.value.map((u) => ({ key: String(u.id), label: u.title, note: u.module }))), r = I(() => s.value.find((u) => String(u.id) === n.value));
    async function i() {
      const u = await Bt(Bl, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!u.ok) {
        o.value = u.error;
        return;
      }
      s.value = u.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), f = s.value.find((m) => m.title === d);
      f && a("pick", String(f.id));
    }
    return i(), (u, d) => (c(), h(z, null, [
      L(qt, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (f) => a("pick", f))
      }, null, 8, ["options", "value"]),
      r.value ? (c(), h("p", od, b(r.value.brief), 1)) : E("", !0),
      o.value ? (c(), h("p", ld, b(o.value), 1)) : E("", !0)
    ], 64));
  }
}, id = /* @__PURE__ */ K(rd, [["__scopeId", "data-v-14be8a5c"]]), cd = { class: "form-field" }, ud = { class: "form-field-head" }, dd = ["for"], fd = {
  key: 0,
  class: "form-field-aside"
}, hd = {
  key: 0,
  class: "form-field-help"
}, md = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", cd, [
      g("div", ud, [
        g("label", {
          class: "form-field-label",
          for: t.$props.for
        }, b(e.label), 9, dd),
        t.$slots.aside ? (c(), h("span", fd, [
          me(t.$slots, "aside", {}, void 0, !0)
        ])) : E("", !0)
      ]),
      me(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", hd, b(e.help), 1)) : E("", !0)
    ]));
  }
}, pd = /* @__PURE__ */ K(md, [["__scopeId", "data-v-dd7cdcff"]]), Xa = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, gd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = na(), n = I(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => De((c(), h("textarea", Ne({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [D(Xa), D(t).value]
    ]);
  }
}), vd = /* @__PURE__ */ K(gd, [["__scopeId", "data-v-e130a5b9"]]), yd = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = gs(), o = I(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, r) => (c(), W(pd, {
      label: e.field.label,
      for: D(s),
      "data-button-field": e.field.name
    }, {
      default: j(() => [
        L(Wt, { value: o.value }, {
          choice: j(() => [
            L(qt, {
              id: D(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: r[0] || (r[0] = (i) => a("pick", i))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: j(() => [
            L(id, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: r[1] || (r[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: j(() => [
            L(vd, {
              id: D(s),
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
}, oa = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), W(de, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: j(() => [
        L(be, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function bd(e, t, n, a = () => window) {
  Te(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Le(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const wd = (e, t = () => !0) => bd("keydown", (n) => n.key === "Escape" && t() && e());
function Ll(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = A(!1), s = I(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return wd(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const kd = 80, Rt = fn([]);
function Nl(e) {
  const t = Symbol("layer"), n = () => Rt.includes(t) && Rt.splice(Rt.indexOf(t), 1);
  return ge(
    e,
    (a) => {
      a && !Rt.includes(t) && Rt.push(t), a || n();
    },
    { immediate: !0 }
  ), Le(n), I(() => kd + Math.max(0, Rt.indexOf(t)));
}
let Dl = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Dl = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const $d = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function xd(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll($d)];
    if (!l.length) return o.preventDefault();
    const [r, i] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), i.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === i && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  Te(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : Dl, document.addEventListener("keydown", s), Qe(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Le(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const Md = ["aria-modal", "aria-label", "aria-labelledby"], Sd = {
  key: 0,
  class: "dialog-head"
}, _d = ["id", "tabindex"], Ed = {
  key: 1,
  class: "dialog-foot"
}, Cd = 500, Ad = 400, Od = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Ll(a, n), r = Nl(s), i = A(null), u = A(null), d = A(null), f = gs(), m = A(!1), v = Date.now();
    n.modal && xd(u, () => a("escape"), d);
    function y() {
      if (!n.modal) return n.closable && o();
      m.value = !0, setTimeout(() => m.value = !1, Ad);
    }
    function x(N) {
      !n.modal || Date.now() - v >= Cd || ![" ", "Enter"].includes(N.key) || (N.preventDefault(), N.stopPropagation());
    }
    const C = () => i.value && (i.value.scrollTop = i.value.scrollHeight), _ = new MutationObserver(C);
    return ge(i, (N) => {
      _.disconnect(), N && n.follow && (_.observe(N, { childList: !0, subtree: !0, characterData: !0 }), C());
    }), Le(() => _.disconnect()), (N, U) => (c(), W(aa, { to: "body" }, [
      L(Ft, {
        name: "dialog",
        appear: "",
        onAfterLeave: D(l)
      }, {
        default: j(() => [
          D(s) ? (c(), h("div", {
            key: 0,
            class: X(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ye({ zIndex: D(r) }),
            onClick: xe(y, ["self"])
          }, [
            g("section", {
              ref_key: "panel",
              ref: u,
              class: X(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: m.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? D(f) : void 0,
              onKeydownCapture: x
            }, [
              e.bare ? E("", !0) : (c(), h("header", Sd, [
                g("h3", {
                  id: D(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, b(e.title), 9, _d),
                e.closable ? (c(), W(oa, {
                  key: 0,
                  onClick: D(o)
                }, null, 8, ["onClick"])) : E("", !0)
              ])),
              g("div", {
                ref_key: "body",
                ref: i,
                class: X(["dialog-body", { bare: e.bare }])
              }, [
                me(N.$slots, "default", {}, void 0, !0)
              ], 2),
              N.$slots.foot ? (c(), h("footer", Ed, [
                me(N.$slots, "foot", {}, void 0, !0)
              ])) : E("", !0)
            ], 42, Md)
          ], 6)) : E("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, la = /* @__PURE__ */ K(Od, [["__scopeId", "data-v-6d1ecd98"]]), Td = {
  class: "action-output",
  "data-action-output": ""
}, Rd = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), W(la, {
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: j(() => [
        g("pre", Td, b(e.text), 1)
      ]),
      _: 1
    }));
  }
}, Id = /* @__PURE__ */ K(Rd, [["__scopeId", "data-v-423a045c"]]);
function Bd(e) {
  const t = document.body.appendChild(document.createElement("div")), n = Si(Id, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const Ld = (e, t, n = {}) => _s(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function mn(e, t, n, a = {}) {
  var s;
  try {
    if (!await zu(e.module, n)) return { ok: !1, error: "" };
    const o = await Bt(Bl, Ld(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && Bd(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const Nd = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, ba = [
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], we = (e, t, n, a = {}) => ({
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
}), ra = {
  messages: we("Message", "mail", "Messages between you and the agent", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: we("Question", "help", "A question from the agent with suggested answers", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: we("Plan", "flag", "A series of phases and tasks for you to approve before work begins", {
    view: "document",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    lists_completed_unread: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you want, in your own words; the agent builds the plan with you from here" },
    filters: ba
  }),
  tasks: we("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: ba
  }),
  reports: we("Report", "report", "A record of what was checked and found", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: we("Collection", "folder", "Related items grouped under a name", {
    in_sidebar: !0,
    listed_under: "sidebar",
    listed_as_cards: !0,
    created_in_viewer: !0,
    typed_as_title: !0,
    labels: { abstract: "What belongs in it" }
  }),
  docs: we("Document", "file", "What stays true about the project, catalogued for every session", {
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
  memories: we("Memory", "pin", "What the agent keeps in mind here, with a weight from 1 to 10 that every compaction lowers by one", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { weight: "A weight from 1 to 10" }
  }),
  rules: we("Rule", "list", "An instruction that applies to every environment in the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: we("Reminder", "clock", "An instruction repeated until it is removed", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  pins: we("Pin", "band", "One line pinned to the chat while it matters", { filters: ba }),
  reactions: we("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: we("Plugin", "plug", "An installed extension that responds to events and can run background services", { scope: "project" }),
  environments: we("Environment", "branch", "A separate workspace with messages, tasks, memories, plans and settings", { scope: "project" }),
  agents: we("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: we("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: we("Worker", "bot", "An agent assigned a task in a separate working copy"),
  verifiers: we("Verifier", "verifier", "An agent that checks whether an output reader report was correctly closed"),
  test_turns: we("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: we("Reviewer", "reviewer", "An agent that tests and reviews worker changes and reports the results to the main agent"),
  helpers: we("Helper", "bot", "A helper started by the agent for a specific job", { nested: !0 }),
  sequences: we("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by its triggers", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    listed_as_cards: !0,
    takes_comments: !0,
    labels: { brief: "What it is for" }
  }),
  templates: we("Template", "docs", "Instructions put in front of anything made from it, with the parts it starts with", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    labels: { brief: "Instructions" }
  }),
  triggers: we("Trigger", "bolt", "Words to watch for and the action to take when they appear", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    labels: { words: "Words", action: "What it does", text: "What it sends" }
  }),
  checks: we("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
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
  dumps: we("Dump", "inbox", "Text and files you submit for the agent to sort by subject", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: we("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: we("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
}, Dd = ["secrets", "plugins"], jl = Object.keys(ra).filter((e) => !(ml && Dd.includes(e)));
I(() => jl.map((e) => ({ name: e, ...ra[e] })));
const Ht = (e) => ra[e], ql = new Map(jl.flatMap((e) => [e, e.replace(/s$/, ""), ra[e].title.toLowerCase()].map((t) => [t, e]))), dt = (e) => ql.get(String(e).toLowerCase()) || "", Pl = [...ql.keys()].sort((e, t) => t.length - e.length).join("|"), jd = {
  class: "button-form",
  "data-button-form": ""
}, qd = {
  key: 0,
  class: "button-form-title"
}, Pd = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, Fd = { class: "button-form-actions" }, Wd = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = A(!1), l = A(""), r = I(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), i = I(() => {
      var f;
      if (!n.row) return n.button.label;
      const d = ((f = Ht(dt(n.row.noun))) == null ? void 0 : f.title) || "Item";
      return `${n.button.label} · ${d} ${n.row.id}`;
    });
    async function u() {
      if (o.value || !r.value) return;
      o.value = !0;
      const d = await mn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = d.ok ? "" : d.error, d.ok && (a("done"), a("close"));
    }
    return (d, f) => (c(), W(la, {
      title: i.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: f[1] || (f[1] = (m) => a("close"))
    }, {
      default: j(() => {
        var m;
        return [
          g("div", jd, [
            (m = e.row) != null && m.title ? (c(), h("p", qd, b(e.row.title), 1)) : E("", !0),
            (c(!0), h(z, null, te(e.button.fields, (v) => (c(), W(yd, {
              key: v.name,
              field: v,
              value: s.value[v.name],
              environment: e.environment,
              onPick: (y) => s.value[v.name] = y
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (c(), h("p", Pd, b(l.value), 1)) : E("", !0),
            g("div", Fd, [
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
}, Hd = /* @__PURE__ */ K(Wd, [["__scopeId", "data-v-f26c27a7"]]), Ud = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, zd = {
  key: 1,
  class: "menu-item-text"
}, Vd = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: X(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", Ud, b(e.checked ? "✓" : ""), 1)) : E("", !0),
      e.description ? (c(), h("span", zd, [
        g("span", null, [
          me(t.$slots, "default", {}, void 0, !0)
        ]),
        g("small", null, b(e.description), 1)
      ])) : me(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, _t = /* @__PURE__ */ K(Vd, [["__scopeId", "data-v-fec99974"]]), Gd = ["aria-busy"], Kd = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, Yd = { class: "button-slot-confirm-text" }, Jd = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Qd = {
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
    const n = e, a = t, s = I(() => $s(n.environment)), o = I(
      () => {
        var _;
        return !n.readOnly && ((_ = s.value) == null ? void 0 : _.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = I(() => {
      var _;
      return !n.readOnly && ((_ = s.value) == null ? void 0 : _.failed.value);
    }), r = () => s.value.load().catch(() => {
    }), i = I(() => n.readOnly ? [] : Uu(n.environment, n.name, n.row)), u = A(null), d = A(null), f = A(""), m = A(!1), v = (_) => [_.from ? `From ${_.from}` : "", _.tip, _.warning].filter(Boolean).join(" · "), y = (_) => _.icon || (_.warning ? "dot" : "");
    function x(_) {
      if (!(m.value || n.readOnly)) {
        if (_.fields.length) {
          u.value = _;
          return;
        }
        if (_.confirm) {
          d.value = _;
          return;
        }
        return C(_);
      }
    }
    async function C(_) {
      d.value = null, f.value = "", a("failure", ""), m.value = !0;
      const N = await mn(_, n.row, n.environment);
      m.value = !1, f.value = N.ok ? "" : N.error;
      const U = _.label.toLowerCase() + (n.objectName && !_.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", N.ok ? "" : `Could not ${U}: ${N.error}`), N.ok && a("done");
    }
    return (_, N) => (c(), h("span", {
      class: X(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (c(), h(z, { key: 0 }, [
        N[5] || (N[5] = g("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        L(de, {
          small: "",
          onClick: r
        }, {
          default: j(() => [...N[4] || (N[4] = [
            ee("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && d.value ? (c(), h("span", Kd, [
        g("span", Yd, b(d.value.confirm), 1),
        L(de, {
          small: "",
          variant: d.value.danger ? "ghost" : "primary",
          bordered: d.value.danger,
          class: X({ danger: d.value.danger }),
          "data-button-confirm-yes": "",
          onClick: N[0] || (N[0] = (U) => C(d.value))
        }, {
          default: j(() => [
            ee(b(d.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        L(de, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: N[1] || (N[1] = (U) => d.value = null)
        }, {
          default: j(() => [...N[6] || (N[6] = [
            ee("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? E("", !0) : (c(), h(z, { key: 2 }, [
        (c(!0), h(z, null, te(i.value, (U) => (c(), h(z, {
          key: U.name
        }, [
          U.menu.length ? (c(), W(Nu, {
            key: 0,
            small: "",
            variant: U.primary ? "primary" : "ghost",
            disabled: m.value,
            "menu-label": U.menu_label || "More ways",
            title: v(U),
            "data-button": U.name,
            onMain: (q) => x(U)
          }, {
            menu: j(({ close: q }) => [
              (c(!0), h(z, null, te(U.menu, (B) => (c(), W(_t, {
                key: B.label,
                description: B.description,
                onClick: (F) => (q(), x({ ...U, ...B, menu: [] }))
              }, {
                default: j(() => [
                  ee(b(B.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: j(() => [
              ee(b(U.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (c(), W(de, {
            key: 1,
            small: "",
            variant: U.primary ? "primary" : "ghost",
            bordered: !U.primary,
            class: X({ danger: U.danger }),
            icon: y(U),
            disabled: m.value,
            title: v(U),
            "data-button": U.name,
            onClick: (q) => x(U)
          }, {
            default: j(() => [
              ee(b(U.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        f.value && !e.readOnly && !e.externalFailure ? (c(), h("span", Jd, b(f.value), 1)) : E("", !0),
        u.value && !e.readOnly ? (c(), W(Hd, {
          key: u.value.runs,
          button: u.value,
          row: e.row,
          environment: e.environment,
          onClose: N[2] || (N[2] = (U) => u.value = null),
          onDone: N[3] || (N[3] = (U) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : E("", !0)
      ], 64))
    ], 10, Gd));
  }
}, Fl = /* @__PURE__ */ K(Qd, [["__scopeId", "data-v-a4b6f174"]]), Zd = {
  class: "running",
  "data-running-command": ""
}, Xd = ["title"], ef = {
  key: "idle",
  class: "running-idle"
}, tf = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", Zd, [
      L(Ft, {
        name: "roll",
        mode: "out-in"
      }, {
        default: j(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, b(e.text), 9, Xd)) : (c(), h("span", ef, b(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, T$ = /* @__PURE__ */ K(tf, [["__scopeId", "data-v-d3240219"]]), nf = ["aria-checked", "aria-label", "title"], af = {
  key: 0,
  class: "switch-inner"
}, sf = {
  key: 0,
  class: "switch-word"
}, of = {
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
        e.labelled ? (c(), h("span", af, b(e.word), 1)) : E("", !0),
        s[1] || (s[1] = g("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", sf, b(e.word), 1)) : E("", !0)
    ], 10, nf));
  }
}, R$ = /* @__PURE__ */ K(of, [["__scopeId", "data-v-1bfb90f3"]]);
function Wl(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function Hn(e, t) {
  return Wl(() => localStorage, e, t);
}
function Hl(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Es(e, t) {
  return Hl(() => localStorage, e, t);
}
function Ul(e, t) {
  ge(t, (n) => Es(e, n), { deep: !0 });
}
function lf(e, t) {
  return Wl(() => sessionStorage, e, t);
}
function rf(e, t) {
  return Hl(() => sessionStorage, e, t);
}
const Un = "journal.environment", zl = A(lf(Un, Hn(Un, "")));
function cf(e) {
  zl.value = e, rf(Un, e), Es(Un, e);
}
const zn = A(location.hash), lo = Ye(null), ro = { integrations: "mcp", library: "team" };
function uf() {
  if (!lo.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (ro[n]) {
    location.replace(`#/${[ro[n], ...a].join("/")}${t ? `?${t}` : ""}`), zn.value = location.hash;
    return;
  }
  !n || lo.value(n) || (cf(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), zn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  zn.value = location.hash, uf();
});
const es = I(() => {
  const [e, t = ""] = zn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [r, i = ""] = l.split("@"), [u = "", d = "", f = ""] = r.split(":");
    return { table: u, id: Number(d), comment: Number(f) || 0, env: i };
  });
  return {
    env: zl.value,
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
}), Cs = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Cs.page(e)}?open=${t}`
};
function df(e = "", t = 0, n = "") {
  location.hash = Cs.page(e, t, n);
}
const ff = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Vl(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, r]) => `${l}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(ff).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Nt = {};
function I$(e, t) {
  return Nt[e] = t, () => Nt[e] === t && delete Nt[e];
}
function Gl(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Nt[e]) != null && l.call(Nt, t))) return;
  const s = es.value.stack, o = s.findIndex((r) => r.table === e && r.id === t);
  Vl([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function hf(e, t, n, a = 0, s = "") {
  if (e === es.value.env) return Gl(t, n, a, s);
  const o = es.value.stack, l = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  Vl([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function He(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? hf(a, s, Number(o), 0, t) : Gl(s, Number(o), 0, t);
}
function mf(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Lt(e) {
  const t = mf(e);
  t && He(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function B$(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const pf = { class: "inspector-part" }, gf = { class: "inspector-part-title" }, vf = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("section", pf, [
      g("h4", gf, b(e.title), 1),
      me(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, L$ = /* @__PURE__ */ K(vf, [["__scopeId", "data-v-0da7fa52"]]), ts = [], yf = 2e3, it = /* @__PURE__ */ new Map(), bf = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, wf = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function At(e, { first: t = !1 } = {}) {
  t ? ts.unshift(e) : ts.push(e), it.clear();
}
function Kl(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const kf = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, $f = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function at(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function xf(e, t) {
  const n = [{ type: "text", text: at(e).replace(/\r\n/g, `
`) }];
  for (const a of ts)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.type !== "text") continue;
      const l = a(o.text, t);
      typeof l == "string" ? o.text = l : l && n.splice(s, 1, ...l);
    }
  return n;
}
function an(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Mf(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Mf(e) {
  return e.split(wf).map((t, n) => n % 2 ? t : t.replace(bf, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function io(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const Sf = 24;
function _f(e) {
  const [t, , ...n] = e, a = io(t), s = n.map(io), o = (i) => [a, ...s].some((u) => (u[i] ?? "").length > Sf) ? ' class="text-column"' : "", l = a.map((i, u) => `<th${o(u)}>${an(i)}</th>`).join(""), r = s.map((i) => `<tr>${i.map((u, d) => `<td${o(d)}>${an(u)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${r}</tbody></table>`;
}
const Yl = /^\s*(?:[-*+]|\d+[.)])\s+/, ns = /^\s*(\d+)[.)]\s/, co = (e) => e.match(/^\s*/)[0].length;
function Jl(e) {
  const t = e[0].match(ns), n = co(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), r = a[a.length - 1];
    l && co(o) <= n ? a.push({ text: l[2], nested: [] }) : r && o.trim() && (l || r.nested.length) ? r.nested.push(o) : r && o.trim() && (r.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${an(o.text)}${o.nested.length ? Jl(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function Ef(e, t) {
  const n = ns.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Yl.test(e[s]) && ns.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const uo = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Ql(e) {
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
      n.push(`<h${r}>${an(o[2])}</h${r}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (uo(t, a)) {
      let r = a + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(_f(t.slice(a, r))), a = r;
      continue;
    }
    if (Yl.test(s)) {
      const r = Ef(t, a);
      n.push(Jl(t.slice(a, r))), a = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let r = a;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${Ql(
          t.slice(a, r).map((i) => i.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = r;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !uo(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${an(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const Cf = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Af = (e) => e.type !== "text" && !Cf.test(e.html);
function Of(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(Ql(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : Af(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function Zl(e, t = { env: "" }) {
  const n = $f(e, t), a = it.get(n);
  if (it.delete(n), a && a.source === t.source && a.reads.every((l) => kf(l, t)))
    return it.set(n, a), a.html;
  const s = [], o = Of(xf(e, { ...t, reads: s }));
  return it.set(n, { html: o, reads: s, source: t.source }), it.size > yf && it.delete(it.keys().next().value), o;
}
const Tf = ["aria-expanded"], Rf = { class: "drop-label" }, If = ["value"], Bf = {
  key: 1,
  class: "drop-lead"
}, Lf = { class: "drop-item-text" }, Nf = {
  key: 2,
  class: "drop-note"
}, Df = {
  key: 1,
  class: "drop-none"
}, jf = {
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
    const n = e, a = t, s = A(!1), o = A(null), l = A(""), r = I(() => {
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
        e.icon ? (c(), W(be, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : E("", !0),
        g("span", Rf, b(e.label), 1),
        L(be, {
          name: "down",
          size: 11
        })
      ], 10, Tf),
      s.value ? (c(), W(sa, {
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
          }, null, 40, If)) : E("", !0),
          (c(!0), h(z, null, te(r.value, (f) => (c(), W(_t, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (m) => i(f)
          }, {
            default: j(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: X(["drop-dot", { live: f.running }])
              }, null, 2)) : E("", !0),
              f.lead ? (c(), h("span", Bf, b(f.lead), 1)) : E("", !0),
              g("span", Lf, b(f.label), 1),
              f.note ? (c(), h("span", Nf, b(f.note), 1)) : E("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          r.value.length ? E("", !0) : (c(), h("p", Df, b(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : E("", !0)
    ], 2));
  }
}, Xl = /* @__PURE__ */ K(jf, [["__scopeId", "data-v-29dfcce5"]]);
function qf(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function er(e, t = Date.now()) {
  const n = qf(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const Pf = 36e5;
function N$(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / Pf;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function tr(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function fo(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const wa = (e) => String(e).padStart(2, "0");
function Ff(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${wa(t % 60)}s` : `${Math.floor(t / 3600)}h ${wa(Math.floor(t % 3600 / 60))}m ${wa(t % 60)}s`;
}
const Wf = 1e3;
function Hf() {
  const e = A(Date.now()), t = setInterval(() => e.value = Date.now(), Wf);
  return Je(() => clearInterval(t)), e;
}
const Uf = ["datetime", "title"], Et = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Hf(), a = I(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, b(D(er)(e.at, D(n))), 9, Uf));
  }
};
function zf(e) {
  const t = A(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return Te(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), Je(() => n.disconnect()), t;
}
const Vf = ["data-comment-id"], Gf = {
  key: 0,
  class: "comment-top"
}, Kf = { class: "comment-mark" }, Yf = {
  class: "comment-body",
  "data-comment": ""
}, Jf = { class: "comment-foot" }, Qf = {
  key: 1,
  "data-comment-lost": ""
}, Zf = {
  __name: "CommentCard",
  props: { comment: { type: Object, required: !0 }, hot: Boolean, lost: Boolean },
  emits: ["show"],
  setup(e) {
    const t = e, n = () => t.comment.selection_type === "code";
    return (a, s) => (c(), h("article", {
      class: X(["comment-card", { hot: e.hot }]),
      "data-comment-card": "",
      "data-comment-id": e.comment.id
    }, [
      e.comment.quote ? (c(), h("div", Gf, [
        g("span", Kf, b(e.comment.number), 1),
        g("span", {
          class: X(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, b(e.comment.quote), 3)
      ])) : E("", !0),
      g("p", Yf, b(e.comment.body), 1),
      g("div", Jf, [
        e.comment.created_at ? (c(), W(Et, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : E("", !0),
        e.lost ? (c(), h("span", Qf, "The text has changed here")) : e.comment.quote ? (c(), h("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : E("", !0)
      ])
    ], 10, Vf));
  }
}, nr = /* @__PURE__ */ K(Zf, [["__scopeId", "data-v-a37d4507"]]);
var rl;
/Mac|iPhone|iPad/.test(((rl = navigator.userAgentData) == null ? void 0 : rl.platform) || navigator.platform);
function ar(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const Xf = {
  class: "comment-box",
  "data-comment-box": ""
}, eh = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, th = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, nh = { class: "comment-row" }, ah = ["placeholder"], sh = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ tn({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ tn(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = Wn(e, "draft"), l = A(""), r = A(!1), i = A(null), u = I(() => {
      var v;
      return ((v = a.selection) == null ? void 0 : v.selection_type) === "code";
    }), d = I(() => a.narrow ? "Write a comment" : "Write a comment, or select text to comment on a selection");
    function f() {
      i.value.style.height = "auto", i.value.style.height = `${i.value.scrollHeight + 2}px`;
    }
    async function m() {
      const v = o.value.trim();
      if (!(!v || r.value)) {
        l.value = "", r.value = !0;
        try {
          await a.send(v), o.value = "", await Qe(), f();
        } catch (y) {
          l.value = y.message;
        } finally {
          r.value = !1;
        }
      }
    }
    return t({ focus: () => i.value.focus() }), (v, y) => (c(), h("div", Xf, [
      e.selection ? (c(), h("div", eh, [
        y[3] || (y[3] = g("span", { class: "comment-on-label" }, "On this selection", -1)),
        g("span", {
          class: X(["comment-on-words", { mono: u.value }])
        }, b(e.selection.quote), 3),
        L(oa, {
          title: "Comment on the whole document instead",
          onClick: y[0] || (y[0] = (x) => s("clear"))
        })
      ])) : E("", !0),
      l.value ? (c(), h("p", th, b(l.value), 1)) : E("", !0),
      g("div", nh, [
        De(g("textarea", {
          ref_key: "box",
          ref: i,
          "onUpdate:modelValue": y[1] || (y[1] = (x) => o.value = x),
          rows: "1",
          maxlength: "2000",
          class: X({ on: o.value }),
          placeholder: d.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: f,
          onKeydown: y[2] || (y[2] = jt((x) => D(ar)(x, m), ["enter"]))
        }, null, 42, ah), [
          [St, o.value]
        ]),
        L(de, {
          variant: "primary",
          busy: r.value,
          disabled: !o.value.trim(),
          "data-comment-send": "",
          onClick: m
        }, {
          default: j(() => [...y[4] || (y[4] = [
            ee("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, oh = /* @__PURE__ */ K(sh, [["__scopeId", "data-v-41d2081c"]]), En = (e) => e ? e.split(", ") : [];
function lh({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function rh(e, t) {
  return {
    reads: En(e.reads_allowed),
    runs: En(e.runs_allowed),
    missing: [...En(e.reads_missing), ...En(e.runs_missing)],
    ask: t
  };
}
const ih = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const r = _i("SkeletonParts", !0);
      return c(!0), h(z, null, te(e.parts, (i, u) => (c(), h(z, { key: u }, [
        (c(!0), h(z, null, te(i.count, (d) => (c(), W(Wt, {
          key: d,
          value: i.shape
        }, {
          line: j(() => [
            L(Jt, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ye({ width: i.width, height: `${t[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: j(() => [
            L(Jt, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ye({ width: `${n[i.size]}px`, height: `${n[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: j(() => [
            L(Jt, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ye({ width: i.width, height: `${i.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: j(() => [...l[0] || (l[0] = [
            g("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: j(() => [
            g("div", {
              class: "skeleton-row",
              style: ye(a(i))
            }, [
              L(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: j(() => [
            g("div", {
              class: "skeleton-stack",
              style: ye(a(i))
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
              style: ye(a(i))
            }, [
              L(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: j(() => [
            g("div", {
              class: "skeleton-grid",
              style: ye(s(i))
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
}), ch = /* @__PURE__ */ K(ih, [["__scopeId", "data-v-fa8baeaf"]]), uh = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, dh = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", uh, [
      L(ch, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, As = /* @__PURE__ */ K(dh, [["__scopeId", "data-v-52f66b64"]]), sr = {
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
}, fh = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: X(["badge", e.tone])
    }, b(e.text), 3));
  }
}, or = /* @__PURE__ */ K(fh, [["__scopeId", "data-v-9e7e1157"]]), hh = ["aria-valuenow", "aria-valuemax"], mh = {
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
    const t = e, n = I(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (a, s) => (c(), h("span", {
      class: X(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      g("span", {
        class: "fill",
        style: ye({ width: n.value })
      }, null, 4)
    ], 10, hh));
  }
}, ph = /* @__PURE__ */ K(mh, [["__scopeId", "data-v-9eba6a85"]]), gh = { class: "bars" }, vh = { class: "bar-name" }, yh = { class: "bar-value" }, bh = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = I(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, r) => (c(), h("div", gh, [
      (c(!0), h(z, null, te(e.items, (i, u) => (c(), W(mt(i.open ? "button" : "div"), {
        key: `${u}-${i.label}`,
        type: i.open ? "button" : void 0,
        class: X(["bar-row", i.tone, { opens: i.open }]),
        onClick: (d) => i.open && a("open", i.open)
      }, {
        default: j(() => [
          g("span", vh, b(i.label), 1),
          L(ph, {
            value: Number(i.value) || 0,
            max: s.value,
            tone: i.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          g("span", yh, b(i.value) + b(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, wh = /* @__PURE__ */ K(bh, [["__scopeId", "data-v-663427f4"]]), kh = { class: "bars" }, $h = {
  key: 0,
  class: "bars-title"
}, xh = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", kh, [
      e.node.title ? (c(), h("span", $h, b(e.node.title), 1)) : E("", !0),
      L(wh, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Mh = /* @__PURE__ */ K(xh, [["__scopeId", "data-v-7135bb11"]]), Sh = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = I(() => n[a.node.type](a.node));
    return (l, r) => (c(), h("div", {
      class: X([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ye(o.value)
    }, [
      (c(!0), h(z, null, te(e.node.children || [], (i, u) => (c(), W(gr, {
        key: u,
        node: i,
        onOpen: r[0] || (r[0] = (d) => s("open", d)),
        onFile: r[1] || (r[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Nn = /* @__PURE__ */ K(Sh, [["__scopeId", "data-v-d142a3f4"]]), _h = {
  key: 0,
  class: "card-head"
}, Eh = { class: "card-title" }, Ch = {
  key: 0,
  class: "card-note"
}, Ah = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", {
      class: X(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", _h, [
        g("span", Eh, b(e.node.title), 1),
        e.node.note ? (c(), h("span", Ch, b(e.node.note), 1)) : E("", !0)
      ])) : E("", !0),
      L(Nn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Oh = /* @__PURE__ */ K(Ah, [["__scopeId", "data-v-67b72d40"]]), Th = { processes: "process", memories: "memory", replies: "reply" }, Vn = (e) => (Th[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), ka = /* @__PURE__ */ new WeakMap();
function Rh(e) {
  if (ka.has(e)) return ka.get(e);
  const t = Ei(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (u, d) => `${u}:${d}`;
  function o(u, d) {
    const f = s(u, d), m = e.read(`${Vn(u)} show ${d}`);
    n.set(f, m), m.then((v) => {
      n.get(f) === m && (n.delete(f), t.set(f, v.ok ? { ...v.value, table: u } : null));
    });
  }
  function l(u) {
    a.has(u) || (a.add(u), e.follow([`${Vn(u).replace(/-/g, "_")}.*`], (d) => {
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
  return ka.set(e, i), i;
}
function lr() {
  const e = Oe(je, null), t = e ? Rh(e) : null;
  return (n, a = {}) => Zl(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const rr = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, pn = (e) => String(e || "").replace(rr, (t, n, a, s) => s), Ih = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Cn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Bh = /^Traceback \(most recent call last\):/m, Lh = 8;
function ir(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Lh).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function Nh(e) {
  const t = [...e.matchAll(Ih)].map((a) => a.index);
  if (Cn.lastIndex = 0, !t.length || !Cn.test(e)) return null;
  Cn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(Cn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((r) => r[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: ir(n), tail: "" } : null;
}
function Dh(e) {
  const t = Bh.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: ir([o]), tail: n.slice(s).join(`
`) };
}
At((e) => {
  const t = pn(e), n = Dh(t) || Nh(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const Gn = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, cr = (e) => `${e.table}:${e.id}`, ho = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", $a = 80;
function mo(e) {
  return e.length <= $a ? e : `${e.slice(0, $a + 1).replace(/\s+\S*$/, "") || e.slice(0, $a)}…`;
}
const po = {
  messages: (e) => mo(ho(e.text)),
  comments: (e) => mo(ho(e.text)),
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
}, jh = (e) => (po[e.table] ? po[e.table](e) : e.title || "") || "", Ct = (e) => Gn(e.created_at), ur = (e) => Gn(e.updated_at) || Ct(e), qh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Ph = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Fh(e) {
  const t = qh.exec(e);
  if (t && dt(t[1])) return { at: t.index, length: t[0].length, table: dt(t[1]), id: Number(t[2]), label: t[3] };
  const n = Ph.exec(e), a = n && dt(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function Wh(e, t, n, a) {
  const s = Kl(a, e, t), o = pn(s ? jh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${at(Ht(e).title)} ${t}</span><span class="row-card-title">${at(o)}</span></a>`;
}
At(
  (e, t) => {
    const n = Fh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: Wh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Hh = /\.(png|jpe?g|gif|webp|svg)$/i, Uh = (e) => Hh.test(e), zh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Vh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Gh(e, t) {
  const n = zh.exec(e), [, a, s, o, l, r] = n || [], i = n && dt(a || o), u = i && Kl(t, i, Number(s || l));
  if (i !== "messages" || !u || !(u.files || []).includes(r)) return null;
  const d = `/api/files/message/${u.id}/${encodeURIComponent(r)}`, f = `${Ht(i).title} ${u.id} · ${at(r)}`, m = Uh(r) ? `<img class="file-card-image" src="${d}" alt="${at(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${at(r)}">${m}<span class="file-card-name">${f}</span></a>` };
}
function Kh(e) {
  const t = Vh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${at(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
At(
  (e, t) => {
    if (t.inline) return null;
    const n = Gh(e, t) || Kh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Yh = /`([^`\n]+)`/g;
At((e) => e.replace(Yh, (t, n) => `<code>${n}</code>`));
const go = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Cs.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
At(
  (e, t) => e.replace(rr, (n, a, s, o) => go[a] ? go[a](s, o, t) : o)
);
const Jh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, dr = new RegExp(`\\b(${Pl}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), fr = new RegExp(`\\b(${Pl}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Qh = new RegExp(`<code>((?:${dr.source}|${fr.source}))</code>`, "gi"), Zh = (e) => e.replace(Qh, "$1"), Xh = (e, t) => `<a class="row-pill" href="#" data-peek="${dt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, em = (e) => e.replace(fr, (t, n, a) => a.replace(/\d+/g, (s) => Xh(n.replace(/s$/i, ""), s))), tm = (e) => em(e).replace(
  dr,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${dt(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
At(
  (e, t) => t.rowNames === !1 ? e : Zh(e).split(Jh).map((n, a) => a % 2 ? n : tm(n)).join("")
);
const nm = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, am = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, sm = /[\w\]]\(/, om = /^[\w$.[\]'"]+\s*=\s*[^=]/, lm = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, rm = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, im = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, cm = /[[({,]$/, um = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, dm = /^(\t|\s{2,})\S/, fm = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, hm = /`[^`]+`/, mm = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, pm = /[{}()[\];=<>$&|*\\@+^~%]/g, hr = /^\s*(?:[-*+]|\d+[.)])\s/, gm = /^\s*>/, vm = /^\s*\|/, ym = 0.6, bm = 0.4, wm = 5, km = 0.03, mr = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= wm && t.every((n) => mm.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(pm) ?? []).length / e.length < km;
}, xa = (e) => {
  const t = e.trim();
  return hm.test(t) ? !1 : [nm, am, sm, om, lm, rm, im, cm, um].some((n) => n.test(t)) || /[;{}]$/.test(t) || dm.test(e) && !hr.test(e) && !mr(e);
};
function $m(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || hr.test(t[0]) || t.every((o) => gm.test(o) || vm.test(o))) return "text";
  const n = t.filter((o) => !fm.test(o.trim()));
  if (t.length === 1) return !n.length || xa(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(xa).length, s = n.filter((o) => !xa(o) && mr(o)).length;
  return a >= n.length * ym && s <= n.length * bm ? "code" : "text";
}
const as = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", xm = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Mm = `${as} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Sm = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", _m = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", vo = {
  js: { keywords: as, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: xm, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Mm, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: as, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Sm, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: _m, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, Em = {
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
function yo(e, t, n) {
  return n && e.startsWith(n, t);
}
function Cm(e, t) {
  const n = vo[Em[t] ?? t] || vo.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (yo(e, o, n.line) || n.hash && r === "#") {
      const u = e.indexOf(`
`, o);
      l("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && yo(e, o, n.block[0])) {
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
function Am(e, t) {
  const n = [""];
  for (const { type: a, value: s } of Cm(e, t))
    s.split(`
`).forEach((l, r) => {
      r && n.push(""), l && (n[n.length - 1] += a === "plain" ? at(l) : `<span class="tok-${a}">${at(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Om(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Tm = 1500, bo = /* @__PURE__ */ new WeakMap();
async function Rm(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Om(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(bo.get(t)), bo.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Tm)
  )));
}
typeof document < "u" && document.addEventListener("click", Rm, !0);
const Im = /\n\s*\n/, Bm = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, Lm = /^\s*(`{3,}|~{3,})\s*$/, Nm = /^\s{4,}\S/, Dm = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, ss = /^\s*(?:[-*+]|\d+[.)])\s/, pr = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, jm = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function Os(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function qm(e) {
  const t = Os(e.join(`
`));
  return (jm.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Pm = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && pr.test(t) && !ss.test(t);
}, Fm = (e, t) => ss.test(t) || ss.test([...e].reverse().find((n) => n.trim()) || "");
function Ts(e, t) {
  const n = t || qm(e), a = Am(Os(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function Wm(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && Lm.test(s));
  return a < 0 ? e.length : a;
}
function Hm(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return Ts(a.map(pn), n ? n.toLowerCase() : "");
}
function Um(e) {
  const t = e.split(Im).map((l) => ({ paragraph: l, type: $m(Os(l).split(`
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
      s(), n.push(Ts(r.map(({ paragraph: i }) => i).join(`

`).split(`
`).map(pn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function zm(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : Um(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const r = n[l].match(Bm);
    if (r) {
      const u = Wm(n, l, r[2]);
      o(), a.push(Hm(n.slice(l + 1, u), r[1], r[3])), l = u + 1;
      continue;
    }
    const i = Pm(s) ? Dm : Nm;
    if (!t && i.test(n[l]) && !Fm(s, n[l])) {
      let u = l;
      for (; u < n.length && (i.test(n[u]) || !n[u].trim()); ) u += 1;
      for (; u > l && !n[u - 1].trim(); ) u -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && pr.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (u - l + d.length >= 2) {
        o(), a.push(Ts([...d, ...n.slice(l, u)].map(pn), "")), l = u;
        continue;
      }
      s.push(...d);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
At((e, t) => zm(e, t.document), { first: !0 });
const Vm = ["innerHTML"], Gm = ["innerHTML"], Km = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = lr(), a = I(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => D(Lt) && D(Lt)(...l)),
      innerHTML: a.value
    }, null, 8, Vm)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => D(Lt) && D(Lt)(...l)),
      innerHTML: a.value
    }, null, 8, Gm));
  }
}, $t = /* @__PURE__ */ K(Km, [["__scopeId", "data-v-d8e75741"]]), Ym = { class: "fact" }, Jm = { class: "fact-label" }, Qm = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", Ym, [
      g("span", Jm, b(e.label), 1),
      L($t, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Zm = /* @__PURE__ */ K(Qm, [["__scopeId", "data-v-3a88ecf8"]]), Xm = { class: "list" }, e1 = { class: "list-label" }, t1 = {
  key: 1,
  class: "list-note"
}, n1 = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", Xm, [
      (c(!0), h(z, null, te(e.items, (o, l) => (c(), W(mt(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: X(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: j(() => [
          g("span", e1, b(o.label), 1),
          o.badge ? (c(), W(or, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : E("", !0),
          o.note ? (c(), h("span", t1, b(o.note), 1)) : E("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, a1 = /* @__PURE__ */ K(n1, [["__scopeId", "data-v-ebe2ae0a"]]), s1 = { class: "table" }, o1 = {
  key: 0,
  class: "table-row empty"
}, l1 = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (c(), h("div", s1, [
      g("div", {
        class: "table-row head",
        style: ye(s.value)
      }, [
        (c(!0), h(z, null, te(e.columns, (r) => (c(), h("span", {
          key: r,
          class: "cell"
        }, b(r), 1))), 128))
      ], 4),
      (c(!0), h(z, null, te(e.rows, (r, i) => (c(), W(mt(r.open ? "button" : "div"), {
        key: i,
        type: r.open ? "button" : void 0,
        class: X(["table-row", r.tone, { opens: r.open }]),
        style: ye(s.value),
        onClick: (u) => r.open && a("open", r.open)
      }, {
        default: j(() => [
          (c(!0), h(z, null, te(r.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, b(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", o1, b(e.empty), 1)) : E("", !0)
    ]));
  }
}, r1 = /* @__PURE__ */ K(l1, [["__scopeId", "data-v-9326a52e"]]), i1 = { class: "stat-value" }, c1 = { class: "stat-label" }, u1 = {
  key: 0,
  class: "stat-note"
}, d1 = {
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
    return (a, s) => (c(), W(mt(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: X(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: j(() => [
        g("span", i1, b(e.value), 1),
        g("span", c1, b(e.label), 1),
        e.note ? (c(), h("span", u1, b(e.note), 1)) : E("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, f1 = /* @__PURE__ */ K(d1, [["__scopeId", "data-v-ad0db6d6"]]), h1 = { class: "code" }, m1 = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (c(), W(Wt, {
      value: e.node.type
    }, {
      stack: j(() => [
        L(Nn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: j(() => [
        L(Nn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: j(() => [
        L(Nn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: j(() => [
        L(Oh, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: j(() => [
        g("h3", {
          class: X(["heading", `level-${e.node.level || 2}`])
        }, b(e.node.text), 3)
      ]),
      divider: j(() => [...l[2] || (l[2] = [
        g("hr", { class: "divider" }, null, -1)
      ])]),
      stat: j(() => [
        L(f1, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (r) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: j(() => [
        L(Mh, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: j(() => [
        L(r1, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: j(() => [
        L(a1, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: j(() => [
        L($t, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: j(() => [
        L(Zm, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: j(() => [
        L(or, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: j(() => [
        g("pre", h1, [
          g("code", null, b(e.node.text), 1)
        ])
      ]),
      file: j(() => [
        g("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (r) => s(e.node))
        }, b(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), gr = /* @__PURE__ */ K(m1, [["__scopeId", "data-v-cbdcf540"]]), p1 = { class: "dashboard" }, g1 = { class: "trail" }, v1 = ["onClick"], y1 = {
  key: 0,
  class: "gone",
  role: "status"
}, b1 = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (m) => m in (n.document.pages || {}), o = A(!!n.page && !s(n.page)), l = A(n.page && !o.value ? [n.page] : []), r = I(() => l.value.at(-1) || n.document.start), i = I(() => (n.document.pages || {})[r.value] || null), u = (m) => ((n.document.pages || {})[m] || {}).title || m, d = (m) => {
      o.value = !1, l.value = [...l.value, m];
    }, f = (m) => {
      o.value = !1, l.value = l.value.slice(0, m);
    };
    return ge(
      () => n.document.start,
      () => l.value = []
    ), (m, v) => (c(), h("div", p1, [
      e.document.broken ? (c(), W(nn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: j(() => [
          ee(b(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), W(nn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: j(() => [
          ee(b(e.document.missing), 1)
        ]),
        _: 1
      })) : i.value ? (c(), h(z, { key: 2 }, [
        g("nav", g1, [
          g("button", {
            type: "button",
            class: X(["step", { current: !l.value.length }]),
            onClick: v[0] || (v[0] = (y) => f(0))
          }, b(u(e.document.start)), 3),
          (c(!0), h(z, null, te(l.value, (y, x) => (c(), h(z, {
            key: `${x}-${y}`
          }, [
            v[2] || (v[2] = g("span", { class: "sep" }, "/", -1)),
            g("button", {
              type: "button",
              class: X(["step", { current: x === l.value.length - 1 }]),
              onClick: (C) => f(x + 1)
            }, b(u(y)), 11, v1)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", y1, "What you opened is no longer in this dashboard. Here is its start page.")) : E("", !0),
        L(Ft, {
          name: "page",
          mode: "out-in"
        }, {
          default: j(() => [
            (c(), h("div", {
              key: r.value,
              class: "page"
            }, [
              L(gr, {
                node: i.value.view,
                onOpen: d,
                onFile: v[1] || (v[1] = (y) => a("file", y))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : E("", !0)
    ]));
  }
}, w1 = /* @__PURE__ */ K(b1, [["__scopeId", "data-v-fbe83734"]]);
function k1(e, t) {
  const n = Ue(), a = kl(e, sr.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Te(e), Je(() => {
    s(), a.cancel();
  });
}
const $1 = {
  key: 0,
  class: "window-failure"
}, x1 = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ue(), o = A(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? k1(l, n.events) : bs(l, () => !0, sr.documentWithNoEvents), (r, i) => o.value && !o.value.ok ? (c(), h("p", $1, b(o.value.error), 1)) : o.value ? (c(), W(w1, {
      key: 1,
      document: o.value.value,
      onFile: i[0] || (i[0] = (u) => a("file", u))
    }, null, 8, ["document"])) : E("", !0);
  }
}, M1 = 1e4;
class S1 {
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
    return this.heardAt !== null && t - this.heardAt > M1;
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
const _1 = {
  key: 0,
  class: "frame-note"
}, E1 = {
  key: 0,
  class: "frame-note"
}, C1 = ["src", "title"], A1 = 1e3, O1 = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Ue(), a = A(null), s = A(!1), o = A(!1);
    let l = null, r = 0;
    return Te(() => {
      l = new S1(a.value, n), l.start(), r = setInterval(() => {
        s.value = l.silent();
      }, A1);
    }), Le(() => {
      l == null || l.stop(), clearInterval(r);
    }), (i, u) => o.value ? (c(), h("p", _1, "This window was closed because it stopped answering.")) : (c(), h(z, { key: 1 }, [
      s.value ? (c(), h("div", E1, [
        u[2] || (u[2] = g("p", null, "This window has not answered for ten seconds.", -1)),
        L(de, {
          onClick: u[0] || (u[0] = (d) => o.value = !0)
        }, {
          default: j(() => [...u[1] || (u[1] = [
            ee("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : E("", !0),
      g("iframe", {
        ref_key: "frame",
        ref: a,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: D(n).window
      }, null, 8, C1)
    ], 64));
  }
}, T1 = /* @__PURE__ */ K(O1, [["__scopeId", "data-v-32a49046"]]), R1 = {
  class: "allowance-prompt",
  role: "dialog"
}, I1 = { class: "allowance-prompt-text" }, B1 = { class: "allowance-prompt-buttons" }, L1 = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", R1, [
      g("p", I1, b(D(lh)(e.request)), 1),
      g("div", B1, [
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
}, N1 = /* @__PURE__ */ K(L1, [["__scopeId", "data-v-cad69fe2"]]), Ma = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), W(nn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: j(() => [
        ee(b(e.reason) + " ", 1),
        e.retry ? (c(), W(de, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            ee("Retry", -1)
          ])]),
          _: 1
        })) : E("", !0),
        e.removable ? (c(), W(de, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: j(() => [...s[3] || (s[3] = [
            ee("Remove tab", -1)
          ])]),
          _: 1
        })) : E("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, D1 = ["data-window", "data-agent"], j1 = {
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
    const n = e, a = t, s = A(""), o = A(0);
    function l() {
      s.value = "", o.value++;
    }
    const r = Oe(Xc, null), i = Xu({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: I(() => n.options),
      declared: n.declared,
      page: Oe(Ku, null),
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
    il(je, i), ge(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Te(i.settle), Le(() => {
      i.cancel(), n.subscriptions.stopAll(n.name);
    }), Ci((f) => (s.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const u = () => ta(n.component), d = () => {
      var f, m;
      return ((m = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : m.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, m) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (c(), W(N1, {
        key: 0,
        request: d(),
        onAnswer: m[0] || (m[0] = (v) => e.prompts.answer(v))
      }, null, 8, ["request"])) : E("", !0),
      e.unavailableReason ? (c(), W(Ma, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (c(), W(Ma, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (c(), h(z, { key: 4 }, [
        (c(), W(u, { key: o.value })),
        e.skeleton.length && !D(i).answered.value ? (c(), W(As, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : E("", !0)
      ], 64)) : (c(), W(Ma, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: m[1] || (m[1] = (v) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, D1));
  }
}, Qt = /* @__PURE__ */ K(j1, [["__scopeId", "data-v-c4443e2b"]]), vr = {
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
    const n = e, a = t, s = { render: () => ta(T1, { src: n.entry.entry_url }) };
    return (o, l) => (c(), W(Qt, {
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
}, q1 = ["data-window"], yr = {
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
    const n = e, a = t, s = Ye(null), o = A("");
    return ge(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, vc();
          } catch (r) {
            if (pc(r) && gc(r)) return;
            o.value = `This window's file could not be loaded: ${r.message}`;
          }
      },
      { immediate: !0 }
    ), (l, r) => !s.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      L(As, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, q1)) : (c(), W(Qt, {
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
}, P1 = {
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
    const n = t, a = e, s = I(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = I(() => s.value && { render: () => ta(x1, { line: s.value.line, events: s.value.events }) }), l = A(null), r = I(() => {
      var m, v;
      return ((m = s.value) == null ? void 0 : m.loading) === "component" && !s.value.allowed && !((v = l.value) != null && v.component_trusted);
    }), i = I(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), u = I(
      () => {
        var m, v;
        return l.value ? rh(l.value, f) : { reads: ((m = s.value) == null ? void 0 : m.reads) || [], runs: ((v = s.value) == null ? void 0 : v.runs) || [], missing: [], ask: async () => !0 };
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
    return ge(
      () => {
        var m, v;
        return ((m = s.value) == null ? void 0 : m.entry_url) || ((v = s.value) == null ? void 0 : v.line);
      },
      async () => {
        await d(), u.value.missing.length && !r.value && f();
      },
      { immediate: !0 }
    ), (m, v) => {
      var y, x;
      return !s.value && ((y = e.catalogue.loaded) == null ? void 0 : y.value) === !1 ? (c(), W(As, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((x = s.value) == null ? void 0 : x.shows) === "one-agent" && e.agent === null ? (c(), W(nn, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : r.value ? (c(), W(Qt, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": i.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (c(), W(yr, {
        key: u.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
        prompts: e.prompts,
        options: e.options,
        onOption: v[0] || (v[0] = (C, _) => n("option", C, _))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (c(), W(vr, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
        prompts: e.prompts,
        options: e.options,
        onOption: v[1] || (v[1] = (C, _) => n("option", C, _))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (c(), W(Qt, {
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
        onOption: v[2] || (v[2] = (C, _) => n("option", C, _))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (c(), W(Qt, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: v[3] || (v[3] = (C) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, F1 = ["data-section"], W1 = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, H1 = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Oe(Al, null), a = I(() => {
      const o = t.names.map((r) => ({ name: r, offered: !!(n != null && n.catalogue.window(r)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((r) => !t.names.includes(r.name));
      return [...o, ...l.map((r) => ({ name: r.name, offered: !0 }))];
    }), s = I(() => ({ row: t.row }));
    return (o, l) => D(n) ? (c(!0), h(z, { key: 0 }, te(a.value, (r) => (c(), h("div", {
      key: r.name,
      class: "inspector-section",
      "data-section": r.name
    }, [
      r.offered ? (c(), W(P1, {
        key: 0,
        name: r.name,
        catalogue: D(n).catalogue,
        subscriptions: D(n).subscriptions,
        environment: D(n).environment,
        prompts: D(n).prompts,
        "shell-read": D(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (c(), h("p", W1, b(r.name) + " is not available", 1))
    ], 8, F1))), 128)) : E("", !0);
  }
}, br = /* @__PURE__ */ K(H1, [["__scopeId", "data-v-a47d36b7"]]), U1 = { class: "rail-head" }, z1 = { key: 0 }, V1 = {
  key: 1,
  class: "rail-none"
}, G1 = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (c(), h("aside", {
      class: X(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      g("div", U1, [
        n[0] || (n[0] = g("h3", null, "Comments", -1)),
        e.comments.length ? (c(), h("span", z1, b(e.total || e.comments.length), 1)) : E("", !0)
      ]),
      e.comments.length ? (c(!0), h(z, { key: 0 }, te(e.comments, (a) => (c(), W(nr, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (c(), h("p", V1, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, K1 = /* @__PURE__ */ K(G1, [["__scopeId", "data-v-4d684649"]]), Y1 = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, J1 = ["aria-pressed"], Q1 = ["aria-pressed"], Z1 = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, X1 = {
  key: 0,
  role: "alert"
}, ep = {
  key: 1,
  class: "sidebar-none"
}, tp = ["data-question-id"], np = { class: "question-state" }, ap = ["data-question-show", "onClick"], sp = {
  key: 0,
  class: "sidebar-none"
}, op = {
  key: 1,
  class: "question-answer"
}, lp = {
  __name: "DocumentSidebar",
  props: {
    mode: { type: String, default: "comments" },
    comments: { type: Array, required: !0 },
    questions: { type: Array, required: !0 },
    hot: { type: Number, default: 0 },
    lost: { type: Array, default: () => [] },
    failure: { type: String, default: "" },
    read: { type: Function, required: !0 },
    tab: Boolean,
    commentMore: Boolean,
    commentLoading: Boolean,
    commentFailure: { type: String, default: "" },
    commentTotal: { type: Number, default: 0 }
  },
  emits: ["update:mode", "show", "changed", "more"],
  setup(e) {
    const t = Oe(Al, null);
    return (n, a) => (c(), h("div", {
      class: X(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      g("nav", Y1, [
        g("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, J1),
        g("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, Q1)
      ]),
      e.mode === "comments" ? (c(), h(z, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (c(), W(K1, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : E("", !0),
        L(hn, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (c(), h("aside", Z1, [
        e.failure ? (c(), h("p", X1, b(e.failure), 1)) : e.questions.length ? E("", !0) : (c(), h("p", ep, "No questions about this text yet.")),
        (c(!0), h(z, null, te(e.questions, (s) => {
          var o;
          return c(), h("section", {
            key: s.id,
            class: X(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            g("span", np, b(D(Ms)("question", s.state)), 1),
            g("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, b(s.text), 9, ap),
            s.quote ? (c(), h(z, { key: 0 }, [
              g("blockquote", null, b(s.quote), 1),
              e.lost.includes(s.id) ? (c(), h("p", sp, "The quoted text has changed.")) : E("", !0)
            ], 64)) : E("", !0),
            s.answer ? (c(), h("p", op, "Answered: " + b(s.answer), 1)) : E("", !0),
            L(br, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            L(Fl, {
              name: "row.question",
              row: { ...s, noun: "question" },
              environment: ((o = D(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, tp);
        }), 128))
      ]))
    ], 2));
  }
}, wo = /* @__PURE__ */ K(lp, [["__scopeId", "data-v-2718a08d"]]), rp = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, ip = {
  __name: "DocumentEditDialog",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = fn({ abstract: n.row.abstract, body: n.row.body }), o = A("");
    async function l() {
      const r = await n.read([n.noun, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = r.ok ? "" : r.error, r.ok && a("saved");
    }
    return (r, i) => (c(), W(la, {
      title: "Edit the document",
      wide: "",
      onClose: i[3] || (i[3] = (u) => a("close"))
    }, {
      foot: j(() => [
        g("span", rp, b(o.value), 1),
        L(de, {
          onClick: i[2] || (i[2] = (u) => a("close"))
        }, {
          default: j(() => [...i[6] || (i[6] = [
            ee("Cancel", -1)
          ])]),
          _: 1
        }),
        L(de, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: j(() => [...i[7] || (i[7] = [
            ee("Save", -1)
          ])]),
          _: 1
        })
      ]),
      default: j(() => [
        g("form", {
          class: "edit-form",
          "data-text-form": "",
          onSubmit: xe(l, ["prevent"])
        }, [
          g("label", null, [
            i[4] || (i[4] = g("span", null, "Abstract", -1)),
            De(g("input", {
              "onUpdate:modelValue": i[0] || (i[0] = (u) => s.abstract = u)
            }, null, 512), [
              [St, s.abstract]
            ])
          ]),
          g("label", null, [
            i[5] || (i[5] = g("span", null, "Text", -1)),
            De(g("textarea", {
              "onUpdate:modelValue": i[1] || (i[1] = (u) => s.body = u),
              rows: "20"
            }, null, 512), [
              [St, s.body]
            ])
          ])
        ], 32)
      ]),
      _: 1
    }));
  }
}, cp = /* @__PURE__ */ K(ip, [["__scopeId", "data-v-e99f14e0"]]);
function wr(e, t) {
  const n = A([]), a = A(!1), s = A(null), o = A(0), l = A(!1), r = A("");
  let i = 0, u = 0;
  const d = (y) => {
    if (typeof y.body == "string") return y.body;
    const { noun: x, id: C, title: _ } = e(), N = `On ${x} ${C}, ${_}: `;
    return y.text.startsWith(N) ? y.text.slice(N.length) : y.text;
  };
  async function f(y = 1) {
    const { noun: x, id: C } = e();
    if (!C) return;
    const _ = ++u;
    l.value = !0, r.value = "";
    try {
      const N = await t([x, "comments", String(C), "--page", String(y), "--page-size", "25"]);
      if (_ !== u) return;
      if (!N.ok) {
        r.value = N.error;
        return;
      }
      const U = N.value.rows ?? [], q = y === 1 ? U : [...n.value, ...U];
      n.value = [...new Map(q.map((B) => [B.id, B])).values()], o.value = N.value.total ?? n.value.length, s.value = N.value.next_page ?? null;
    } catch (N) {
      _ === u && (r.value = N.message);
    } finally {
      _ === u && (l.value = !1);
    }
  }
  async function m(y) {
    var B;
    const { noun: x, id: C } = e(), _ = `${x}:${C}`, N = { id: `sending-${++i}`, text: y };
    n.value = [...n.value, N], o.value++, a.value = !0;
    const U = await t([x, "comment", String(C), y]);
    if (_ !== `${e().noun}:${e().id}`) return;
    if (!U.ok)
      throw n.value = n.value.filter((F) => F.id !== N.id), o.value = Math.max(0, o.value - 1), new Error(U.error);
    await f();
    const q = (B = U.value) == null ? void 0 : B.id;
    q && !n.value.some((F) => F.id === q) && (n.value = [...n.value, { ...N, id: q }]);
  }
  const v = () => !l.value && s.value && f(s.value);
  return ge(() => `${e().noun}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, r.value = "", u++, f();
  }, { immediate: !0 }), { comments: n, open: a, words: d, send: m, load: f, loadMore: v, nextPage: s, total: o, loading: l, failure: r };
}
function up(e, t) {
  const n = e.split(`
`), a = t.split(`
`), s = n.map(() => new Array(a.length + 1).fill(0));
  s.push(new Array(a.length + 1).fill(0));
  for (let i = n.length - 1; i >= 0; i -= 1)
    for (let u = a.length - 1; u >= 0; u -= 1)
      s[i][u] = n[i] === a[u] ? s[i + 1][u + 1] + 1 : Math.max(s[i + 1][u], s[i][u + 1]);
  const o = [];
  let l = 0, r = 0;
  for (; l < n.length || r < a.length; )
    l < n.length && r < a.length && n[l] === a[r] ? (o.push({ key: `old:${l}`, type: "same", text: n[l] }), l += 1, r += 1) : r < a.length && (l === n.length || s[l][r + 1] >= s[l + 1][r]) ? (o.push({ key: `new:${r}`, type: "added", text: a[r] }), r += 1) : (o.push({ key: `old:${l}`, type: "removed", text: n[l] }), l += 1);
  return o;
}
const dp = {
  class: "document-tab",
  "data-document-revisions": ""
}, fp = ["datetime"], hp = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, mp = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, pp = {
  key: 2,
  class: "document-none"
}, gp = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(null), o = A(""), l = I(() => s.value ? up(s.value.body, n.text) : []);
    async function r(u) {
      const d = await n.read(["doc", "revision", String(n.id), String(u.number)]);
      s.value = d.ok ? d.value : null, o.value = d.ok ? "" : d.error;
    }
    async function i() {
      const u = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = u.ok ? "" : u.error, u.ok && a("restored");
    }
    return (u, d) => (c(), h("div", dp, [
      e.editing ? (c(), W(de, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: d[0] || (d[0] = (f) => a("close-revision"))
      }, {
        default: j(() => [...d[1] || (d[1] = [
          ee("Close the open revision", -1)
        ])]),
        _: 1
      })) : E("", !0),
      e.revisions.length ? (c(), h(z, { key: 1 }, [
        (c(!0), h(z, null, te(e.revisions, (f) => (c(), W(de, {
          key: f.number,
          variant: "text",
          "data-text-revision": f.number,
          onClick: (m) => r(f)
        }, {
          default: j(() => [
            ee("Revision " + b(f.number) + ": " + b(f.change) + " · " + b(f.author_name) + " · ", 1),
            g("time", {
              datetime: f.created_at
            }, b(f.created_at.slice(0, 16).replace("T", " ")), 9, fp)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (c(), h("p", hp, b(o.value), 1)) : E("", !0),
        s.value ? (c(), h(z, { key: 1 }, [
          L(de, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: i
          }, {
            default: j(() => [...d[2] || (d[2] = [
              ee("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          g("div", mp, [
            (c(!0), h(z, null, te(l.value, (f) => (c(), h("div", {
              key: f.key,
              class: X(["revision-line", f.type])
            }, b(f.text || " "), 3))), 128))
          ])
        ], 64)) : E("", !0)
      ], 64)) : (c(), h("p", pp, "No revisions"))
    ]));
  }
}, vp = /* @__PURE__ */ K(gp, [["__scopeId", "data-v-3a381aa4"]]), yp = "button, [data-comment-number]", bp = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function kr(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(yp) || n.push(t.currentNode);
  return n;
}
function ko(e, t, n) {
  const a = document.createRange();
  a.setStart(t, n), a.collapse(!0);
  let s = 0;
  for (const o of e) {
    if (o === t) return s + n;
    if (a.comparePoint(o, 0) >= 0) return s;
    s += o.data.length;
  }
  return s;
}
const wp = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function kp(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = kr(e), s = a.map((u) => u.data).join(""), o = ko(a, n.startContainer, n.startOffset), l = s.slice(o, ko(a, n.endContainer, n.endOffset)), r = l.trim();
  if (!r) return null;
  const i = n.commonAncestorContainer;
  return { quote: r, position: o + l.indexOf(r), selection_type: wp(i.nodeType === Node.TEXT_NODE ? i.parentElement : i) };
}
function $p(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function xp(e, t, n) {
  const a = [];
  let s = 0;
  for (const o of e) {
    const l = Math.max(t - s, 0), r = Math.min(n - s, o.data.length);
    l < r && a.push({ node: o, from: l, to: r }), s += o.data.length;
  }
  return a;
}
function Sa(e, t, n = "Comment") {
  const a = document.createElement("button");
  return a.type = "button", a.className = "comment-number", a.dataset.commentNumber = t, a.setAttribute("aria-label", `${n} ${e}`), a.textContent = e, a;
}
function Mp({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function Sp(e, t) {
  const n = kr(e), a = $p(n.map((r) => r.data).join(""), t);
  if (a < 0) return !1;
  const s = xp(n, a, a + t.quote.length), o = (r) => r.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(Mp).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const r of l)
    r.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && r.classList.add("hot"), t.id && (r.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(Sa(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(Sa(t.number, t.id, t.label)) : l.at(-1).append(Sa(t.number, t.id, t.label))), !0;
}
function _p(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !Sp(e, a) && a.id && n.push(a.id);
  return n;
}
const Ep = (e) => e.closest(bp) ?? e;
function $o(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const Cp = {
  __name: "DocumentText",
  props: {
    html: { type: String, required: !0 },
    comments: { type: Array, required: !0 },
    annotationLabel: { type: String, default: "Comment" },
    hot: { type: Number, default: 0 },
    pending: { type: Object, default: null },
    inline: { type: Number, default: 0 }
  },
  emits: ["select", "clear", "number", "write", "lost"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = A(null), l = A(null), r = A(null), i = A(!1), u = A(null);
    function d() {
      if (!l.value || i.value) return;
      l.value.innerHTML = a.html;
      const x = a.comments.filter((U) => U.quote).map((U) => ({ ...U, label: a.annotationLabel, hot: U.id === a.hot })), C = _p(l.value, a.pending ? [...x, { ...a.pending, pending: !0 }] : x);
      s("lost", C);
      const _ = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!_) {
        u.value = null;
        return;
      }
      const N = document.createElement("div");
      N.className = "inline-comment", Ep(_).after(N), u.value = N;
    }
    function f() {
      if (!l.value) return;
      const x = kp(l.value);
      if (i.value = !!x, !x) {
        r.value = null;
        return;
      }
      const C = window.getSelection().getRangeAt(0).getBoundingClientRect(), _ = o.value.getBoundingClientRect();
      r.value = { left: `${Math.max(C.left - _.left, 0)}px`, top: `${C.top - _.top + o.value.scrollTop}px` }, s("select", x);
    }
    function m(x) {
      const C = x.target.closest("[data-comment-number]");
      C ? s("number", Number(C.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function v(x) {
      var C;
      (C = l.value.querySelector(`[data-comment="${x}"]`)) == null || C.scrollIntoView({ block: "center" });
    }
    function y(x) {
      var C;
      (C = l.value.querySelectorAll("h3, h4, h5, h6")[x]) == null || C.scrollIntoView({ block: "start" });
    }
    return ge(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, i.value, a.pending], d, { flush: "post" }), Te(() => {
      d(), document.addEventListener("selectionchange", f);
    }), Je(() => document.removeEventListener("selectionchange", f)), t({ show: v, showHeading: y, nextTick: Qe }), (x, C) => (c(), h("div", {
      ref_key: "box",
      ref: o,
      class: "document-text"
    }, [
      g("div", {
        ref_key: "text",
        ref: l,
        class: "md document-words",
        "data-resource-text": "",
        onClick: m
      }, null, 512),
      r.value ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "comment-pill",
        style: ye(r.value),
        "data-comment-pill": "",
        onMousedown: C[0] || (C[0] = xe(() => {
        }, ["prevent"])),
        onClick: C[1] || (C[1] = (_) => s("write"))
      }, [
        L(be, {
          name: "chat",
          size: 13
        }),
        C[2] || (C[2] = ee("Comment on this", -1))
      ], 36)) : E("", !0),
      u.value ? (c(), W(aa, {
        key: 1,
        to: u.value
      }, [
        me(x.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : E("", !0),
      me(x.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, Ap = /* @__PURE__ */ K(Cp, [["__scopeId", "data-v-548d0aaa"]]), Op = {
  key: 0,
  class: "document-edit",
  "data-document-actions": ""
}, Tp = { class: "document-tabs" }, Rp = { class: "document-body" }, Ip = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, Bp = {
  key: 1,
  class: "document-loading"
}, Lp = {
  class: "document-details",
  "data-resource-fields": ""
}, Np = 760, Dp = {
  __name: "DocumentBody",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = A(null), a = zf(n), s = I(() => a.value !== null && a.value < Np), o = A(null), l = A(""), r = A([]), i = A([]), u = A(""), d = A("comments"), f = A("text"), m = A(0), v = A(0), y = A([]), x = A(null), C = A(""), _ = A(!1), N = A(null), U = A(null);
    let q = 0;
    const B = wr(() => o.value ? { noun: t.noun, id: t.id, title: o.value.title } : {}, (fe) => t.read(fe)), F = I(() => $o(B.comments.value)), O = I(() => d.value === "questions" ? $o(i.value) : F.value), T = I(() => d.value === "questions" ? O.value.length : B.total.value), $ = I(() => {
      var fe;
      return (fe = o.value) != null && fe.body ? Zl(o.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), w = I(() => {
      var fe;
      return (((fe = o.value) == null ? void 0 : fe.body) ?? "").split(`
`).filter((Z) => /^#{1,4} /.test(Z)).map((Z, ae) => ({ key: String(ae), value: ae, label: Z.replace(/^#+ /, "") }));
    }), k = I(() => F.value.find((fe) => fe.id === v.value)), p = I(() => {
      var fe;
      return (fe = o.value) != null && fe.close_reason ? "Closed" : "Open";
    }), M = I(() => f.value === "comments" && !s.value ? "text" : f.value), S = (fe) => fe.ok ? fe.value.rows ?? [] : [];
    async function R() {
      const fe = ++q, Z = await t.read([t.noun, "inspect", String(t.id)]);
      if (fe !== q) return;
      l.value = Z.ok ? "" : Z.error, o.value = Z.ok ? Z.value : null;
      const ae = await t.read(["question", "list", "--all", "--row", `${t.noun}:${t.id}`]), oe = t.noun === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      fe === q && (i.value = S(ae), u.value = ae.ok ? "" : ae.error, r.value = oe ? S(oe) : []);
    }
    async function P(fe) {
      const Z = x.value ? ["--quote", x.value.quote, "--position", String(x.value.position), "--selection-type", x.value.selection_type] : [], ae = await t.read([t.noun, "comment", String(t.id), ...Z, "--", fe]);
      if (!ae.ok) throw new Error(ae.error);
      x.value = null, await Promise.all([R(), B.load()]);
    }
    async function Q() {
      const fe = await t.read(["doc", "close", String(t.id)]);
      l.value = fe.ok ? "" : fe.error, fe.ok && await R();
    }
    function se() {
      C.value.trim() || (x.value = null);
    }
    function ie(fe) {
      var Z;
      if (m.value = fe, s.value && d.value === "questions") {
        f.value = "comments";
        return;
      }
      s.value ? v.value = v.value === fe ? 0 : fe : (Z = n.value.querySelector(d.value === "questions" ? `[data-question-id="${fe}"]` : `[data-comment-id="${fe}"]`)) == null || Z.scrollIntoView({ block: "nearest" });
    }
    async function pe(fe) {
      var Z, ae;
      f.value = "text", m.value = fe, await ((Z = N.value) == null ? void 0 : Z.nextTick()), (ae = N.value) == null || ae.show(fe);
    }
    function Ce() {
      _.value = !1, R();
    }
    return ge(() => `${t.noun}:${t.id}`, () => {
      o.value = null, f.value = "text", m.value = 0, v.value = 0, x.value = null, i.value = [], u.value = "", R();
    }, { immediate: !0 }), ge(d, () => {
      m.value = 0, v.value = 0;
    }), (fe, Z) => (c(), h("div", {
      ref_key: "panel",
      ref: n,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      o.value ? (c(), h("div", Op, [
        L(de, {
          bordered: "",
          "data-text-edit": "",
          onClick: Z[0] || (Z[0] = (ae) => _.value = !0)
        }, {
          default: j(() => [...Z[14] || (Z[14] = [
            ee("Edit", -1)
          ])]),
          _: 1
        })
      ])) : E("", !0),
      g("nav", Tp, [
        g("button", {
          type: "button",
          class: X(["document-tab-button", { on: M.value === "text" }]),
          "data-document-tab": "text",
          onClick: Z[1] || (Z[1] = (ae) => f.value = "text")
        }, "Text", 2),
        s.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: X(["document-tab-button", { on: M.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: Z[2] || (Z[2] = (ae) => f.value = "comments")
        }, [
          ee(b(d.value === "questions" ? "Questions" : "Comments") + " ", 1),
          g("em", null, b(T.value || ""), 1)
        ], 2)) : E("", !0),
        e.noun === "doc" ? (c(), h("button", {
          key: 1,
          type: "button",
          class: X(["document-tab-button", { on: M.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: Z[3] || (Z[3] = (ae) => f.value = "revisions")
        }, [
          Z[15] || (Z[15] = ee("Revisions ", -1)),
          g("em", null, b(r.value.length || ""), 1)
        ], 2)) : E("", !0),
        Z[16] || (Z[16] = g("span", { class: "document-tabs-space" }, null, -1)),
        M.value === "text" && w.value.length > 1 ? (c(), W(Xl, {
          key: 2,
          label: s.value ? "" : "Chapters",
          icon: "list",
          items: w.value,
          "data-text-chapters": "",
          onPick: Z[4] || (Z[4] = (ae) => {
            var oe;
            return (oe = N.value) == null ? void 0 : oe.showHeading(ae.value);
          })
        }, null, 8, ["label", "items"])) : E("", !0)
      ]),
      g("div", Rp, [
        l.value ? (c(), h("p", Ip, b(l.value), 1)) : o.value ? M.value === "revisions" ? (c(), W(vp, {
          key: 2,
          id: e.id,
          revisions: r.value,
          text: o.value.body,
          read: e.read,
          editing: o.value.open_author_id !== null && o.value.open_author_id !== void 0,
          onCloseRevision: Q,
          onRestored: R
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : M.value === "comments" ? (c(), W(wo, {
          key: 3,
          mode: d.value,
          "onUpdate:mode": Z[5] || (Z[5] = (ae) => d.value = ae),
          tab: "",
          comments: F.value,
          questions: i.value,
          hot: m.value,
          lost: y.value,
          failure: u.value,
          read: e.read,
          "comment-more": !!D(B).nextPage.value,
          "comment-loading": D(B).loading.value,
          "comment-failure": D(B).failure.value,
          "comment-total": D(B).total.value,
          onMore: D(B).loadMore,
          onShow: pe,
          onChanged: R
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (c(), h(z, { key: 4 }, [
          L(Ap, {
            ref_key: "words",
            ref: N,
            html: $.value,
            comments: O.value,
            "annotation-label": d.value === "questions" ? "Question" : "Comment",
            hot: m.value,
            pending: x.value,
            inline: v.value,
            onSelect: Z[7] || (Z[7] = (ae) => x.value = ae),
            onClear: se,
            onNumber: ie,
            onWrite: Z[8] || (Z[8] = (ae) => {
              var oe;
              return (oe = U.value) == null ? void 0 : oe.focus();
            }),
            onLost: Z[9] || (Z[9] = (ae) => y.value = ae)
          }, {
            inline: j(() => [
              k.value ? (c(), W(nr, {
                key: 0,
                comment: k.value,
                hot: "",
                onShow: Z[6] || (Z[6] = (ae) => pe(k.value.id))
              }, null, 8, ["comment"])) : E("", !0)
            ]),
            default: j(() => [
              g("dl", Lp, [
                Z[18] || (Z[18] = g("h4", null, "Details", -1)),
                Z[19] || (Z[19] = g("dt", null, "State", -1)),
                g("dd", null, b(p.value), 1),
                o.value.close_reason ? (c(), h(z, { key: 0 }, [
                  Z[17] || (Z[17] = g("dt", null, "Why closed", -1)),
                  g("dd", null, b(o.value.close_reason), 1)
                ], 64)) : E("", !0),
                Z[20] || (Z[20] = g("dt", null, "Created", -1)),
                g("dd", null, [
                  L(Et, {
                    at: o.value.created_at
                  }, null, 8, ["at"])
                ]),
                Z[21] || (Z[21] = g("dt", null, "Updated", -1)),
                g("dd", null, [
                  L(Et, {
                    at: o.value.updated_at
                  }, null, 8, ["at"])
                ])
              ])
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          s.value ? E("", !0) : (c(), W(wo, {
            key: 0,
            mode: d.value,
            "onUpdate:mode": Z[10] || (Z[10] = (ae) => d.value = ae),
            comments: F.value,
            questions: i.value,
            hot: m.value,
            lost: y.value,
            failure: u.value,
            read: e.read,
            "comment-more": !!D(B).nextPage.value,
            "comment-loading": D(B).loading.value,
            "comment-failure": D(B).failure.value,
            "comment-total": D(B).total.value,
            onMore: D(B).loadMore,
            onShow: pe,
            onChanged: R
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"]))
        ], 64)) : (c(), h("div", Bp, [
          L(pt)
        ]))
      ]),
      o.value ? (c(), W(oh, {
        key: 1,
        ref_key: "composer",
        ref: U,
        draft: C.value,
        "onUpdate:draft": Z[11] || (Z[11] = (ae) => C.value = ae),
        selection: x.value,
        send: P,
        narrow: s.value,
        onClear: Z[12] || (Z[12] = (ae) => x.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : E("", !0),
      _.value ? (c(), W(cp, {
        key: 2,
        noun: e.noun,
        id: e.id,
        row: o.value,
        read: e.read,
        onClose: Z[13] || (Z[13] = (ae) => _.value = !1),
        onSaved: Ce
      }, null, 8, ["noun", "id", "row", "read"])) : E("", !0)
    ], 512));
  }
}, D$ = /* @__PURE__ */ K(Dp, [["__scopeId", "data-v-784faf41"]]), jp = {
  key: 1,
  class: "row-list-failure"
}, qp = ["data-row"], Pp = {
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
    const t = e, n = I(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = A(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (c(), W(pt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", jp, b(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), W(nn, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: j(() => [
        ee(b(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(z, { key: 3 }, [
      (c(), W(mt(e.arrival ? cl : "ul"), Ne(n.value, { class: "row-list" }), {
        default: j(() => [
          (c(!0), h(z, null, te(e.rows, (r) => (c(), h("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            me(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, qp))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (r) => s(e.older))
      }, "Show more")) : E("", !0)
    ], 64));
  }
}, Fp = /* @__PURE__ */ K(Pp, [["__scopeId", "data-v-6c7ba696"]]), Wp = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Hp = {
  key: 1,
  class: "agent-rows-note"
}, Up = {
  key: 2,
  class: "agent-rows-note"
}, zp = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Vp = ["data-agent-row", "onClick"], Gp = { class: "agent-row-name" }, Kp = { class: "agent-row-state" }, Yp = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = I(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = I(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (c(), h("div", Wp, [
      e.loaded ? e.failure ? (c(), h("p", Hp, b(e.failure), 1)) : e.rows.length ? (c(), h(z, { key: 3 }, [
        g("p", zp, b(a.value) + " running", 1),
        (c(!0), h(z, null, te(n.value, (l) => (c(), h("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (r) => D(He)(`agents:${l.id}`)
        }, [
          g("span", Gp, "#" + b(l.id) + " " + b(l.session), 1),
          g("span", Kp, b(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, Vp))), 128))
      ], 64)) : (c(), h("p", Up, b(e.none), 1)) : (c(), W(pt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, j$ = /* @__PURE__ */ K(Yp, [["__scopeId", "data-v-a01e5a17"]]), rt = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, We = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Fe = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Jp = 6;
function Rs(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Qp = (e) => {
  const t = Rs(e, rt.lineChars), n = Math.max(rt.minWidth, Math.max(...t.map((a) => a.length)) * rt.charWidth + rt.padX * 2);
  return { name: e, lines: t, line: rt.line, padY: rt.padY, width: n, height: t.length * rt.line + rt.padY * 2 };
};
function Zp(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((r, i) => {
      if (r[0] !== l) return;
      const u = s.get(r[1]);
      u === "open" ? a.add(i) : u || o(r[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function Xp(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function eg(e, t, n) {
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
  for (let l = 0; l < Jp; l++) {
    const r = l % 2 === 0, i = a.map((u, d) => d);
    (r ? i.slice(1) : i.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((m) => m[r ? 1 : 0] === f).map((m) => m[r ? 0 : 1]);
      a[u] = o(a[u], d);
    });
  }
  return a;
}
function tg(e, t) {
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
function ng(e) {
  const t = [...new Set(e.flatMap(([q, B]) => [q, B]))], n = new Set(e.map(([, q]) => q)), a = t.filter((q) => !n.has(q)), s = Zp(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((q, B) => !s.has(B)), l = Xp(t, o), r = eg(t, o, l), i = new Map(t.map((q) => [q, Qp(q)])), u = r.map((q) => q.reduce((B, F) => B + i.get(F).width, 0) + Fe.across * (q.length - 1)), d = Math.max(...u) + Fe.margin * 2, f = sg(e, l, r.length), m = /* @__PURE__ */ new Map();
  let v = Fe.margin;
  r.forEach((q, B) => {
    let F = (d - u[B]) / 2;
    const O = Math.max(...q.map((T) => i.get(T).height));
    q.forEach((T) => {
      const $ = i.get(T);
      m.set(T, { ...$, x: F, y: v + (O - $.height) / 2 }), F += $.width + Fe.across;
    }), v += O + (f[B] ?? Fe.down);
  });
  const y = e.map(([q, B, F], O) => ({ from: q, to: B, label: F || "", back: s.has(O) || l.get(B) <= l.get(q) }));
  tg(y, m);
  const x = y.map((q) => og(q, m.get(q.from), m.get(q.to))), C = [...m.values()], _ = cg(x, C), N = Math.max(v - Fe.down, ..._.filter((q) => q.label).map((q) => q.label.y + q.label.height));
  return { width: Math.max(d - Fe.margin, ..._.filter((q) => q.label).map((q) => q.label.x + q.label.width)) + Fe.margin, height: N + Fe.margin, nodes: C, arrows: _ };
}
const ag = (e) => e ? Rs(e, We.lineChars).length * We.line + We.pad * 2 : 0;
function sg(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Fe.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [r, i] = [t.get(s), t.get(o)].sort((u, d) => u - d);
    i > r && (a[r + Math.floor((i - r - 1) / 2)] += ag(l) + Fe.labelSpace);
  }), a.map((s) => Math.max(Fe.down, s));
}
function og(e, t, n) {
  const a = e.label ? Rs(e.label, We.lineChars) : [], s = a.length ? Math.max(...a.map((m) => m.length)) * We.charWidth + We.pad * 2 : 0, o = a.length * We.line + (a.length ? We.pad * 2 : 0), l = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - r) / 2, f = [{ x: l, y: r }, { x: l, y: r + d }, { x: i, y: u - d }, { x: i, y: u }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: f, path: `M${l} ${r} C${l} ${r + d} ${i} ${u - d} ${i} ${u}` };
}
const lg = ([e, t, n, a], s) => {
  const o = 1 - s, l = (r) => o * o * o * e[r] + 3 * o * o * s * t[r] + 3 * o * s * s * n[r] + s * s * s * a[r];
  return { x: l("x"), y: l("y") };
}, rg = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], ig = [0, -1, 1, -2, 2, -3, 3].map((e) => e * We.line);
function cg(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, u) => {
      const d = lg(a.curve, i);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + u, width: a.labelWidth, height: a.labelHeight };
    }, r = ig.flatMap((i) => rg.map((u) => s(u, i))).find((i) => !n.some((u) => xo(i, u))) ?? s(0.5, 0);
    for (; n.some((i) => xo(r, i)); ) r.y += We.line;
    return n.push(r), { ...a, label: { ...r, lines: a.lines, line: We.line, pad: We.pad } };
  });
}
const xo = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, ug = { class: "flowchart-tools" }, dg = ["width", "height", "viewBox", "aria-label"], fg = ["d"], hg = ["x", "y", "width", "height"], mg = ["x", "y"], pg = ["x", "dy"], gg = {
  key: 0,
  class: "flowchart-label"
}, vg = ["x", "y", "width", "height"], yg = ["x", "y"], bg = ["x", "dy"], wg = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => ng(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = A(null), r = A({ zoom: 1, x: 0, y: 0 });
    let i = null;
    function u() {
      var _;
      const x = (_ = l.value) == null ? void 0 : _.getBoundingClientRect();
      if (!(x != null && x.width)) return;
      const C = Math.min(x.width / s.value.width, x.height / s.value.height, 1.5);
      r.value = { zoom: C, x: (x.width - s.value.width * C) / 2, y: (x.height - s.value.height * C) / 2 };
    }
    function d(x, C, _) {
      const { zoom: N, x: U, y: q } = r.value, B = Math.min(o.most, Math.max(o.least, N * x));
      r.value = { zoom: B, x: C - (C - U) * B / N, y: _ - (_ - q) * B / N };
    }
    function f(x) {
      const C = l.value.getBoundingClientRect();
      d(x, C.width / 2, C.height / 2);
    }
    function m(x) {
      const C = l.value.getBoundingClientRect();
      x.ctrlKey || x.metaKey ? d(x.deltaY < 0 ? o.step : 1 / o.step, x.clientX - C.left, x.clientY - C.top) : r.value = { ...r.value, x: r.value.x - x.deltaX, y: r.value.y - x.deltaY };
    }
    function v(x) {
      var C, _, N;
      x.preventDefault(), (C = window.getSelection()) == null || C.removeAllRanges(), i = { x: x.clientX - r.value.x, y: x.clientY - r.value.y }, (N = (_ = l.value).setPointerCapture) == null || N.call(_, x.pointerId);
    }
    function y(x) {
      i && (r.value = { ...r.value, x: x.clientX - i.x, y: x.clientY - i.y });
    }
    return Te(u), (x, C) => (c(), W(la, {
      title: e.title,
      large: "",
      onClose: C[4] || (C[4] = (_) => a("close"))
    }, {
      default: j(() => [
        g("div", ug, [
          L(de, {
            small: "",
            onClick: C[0] || (C[0] = (_) => f(o.step))
          }, {
            default: j(() => [...C[5] || (C[5] = [
              ee("Zoom in", -1)
            ])]),
            _: 1
          }),
          L(de, {
            small: "",
            onClick: C[1] || (C[1] = (_) => f(1 / o.step))
          }, {
            default: j(() => [...C[6] || (C[6] = [
              ee("Zoom out", -1)
            ])]),
            _: 1
          }),
          L(de, {
            small: "",
            onClick: u
          }, {
            default: j(() => [...C[7] || (C[7] = [
              ee("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        g("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: xe(m, ["prevent"]),
          onPointerdown: v,
          onPointermove: y,
          onPointerup: C[2] || (C[2] = (_) => Ks(i) ? i.value = null : i = null),
          onPointercancel: C[3] || (C[3] = (_) => Ks(i) ? i.value = null : i = null)
        }, [
          (c(), h("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: ye({ transform: `translate(${r.value.x}px, ${r.value.y}px) scale(${r.value.zoom})` })
          }, [
            C[8] || (C[8] = g("defs", null, [
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
            (c(!0), h(z, null, te(s.value.arrows, (_, N) => (c(), h("path", {
              key: `arrow-${N}`,
              class: "flowchart-arrow",
              d: _.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, fg))), 128)),
            (c(!0), h(z, null, te(s.value.nodes, (_) => (c(), h("g", {
              key: _.name,
              class: "flowchart-node"
            }, [
              g("rect", {
                x: _.x,
                y: _.y,
                width: _.width,
                height: _.height,
                rx: "8"
              }, null, 8, hg),
              g("text", {
                x: _.x + _.width / 2,
                y: _.y + _.padY + _.line / 2
              }, [
                (c(!0), h(z, null, te(_.lines, (N, U) => (c(), h("tspan", {
                  key: U,
                  x: _.x + _.width / 2,
                  dy: U ? _.line : 0
                }, b(N), 9, pg))), 128))
              ], 8, mg)
            ]))), 128)),
            (c(!0), h(z, null, te(s.value.arrows, (_, N) => (c(), h(z, {
              key: `label-${N}`
            }, [
              _.label ? (c(), h("g", gg, [
                g("rect", {
                  x: _.label.x,
                  y: _.label.y,
                  width: _.label.width,
                  height: _.label.height,
                  rx: "4"
                }, null, 8, vg),
                g("text", {
                  x: _.label.x + _.label.width / 2,
                  y: _.label.y + _.label.pad + _.label.line / 2
                }, [
                  (c(!0), h(z, null, te(_.label.lines, (U, q) => (c(), h("tspan", {
                    key: q,
                    x: _.label.x + _.label.width / 2,
                    dy: q ? _.label.line : 0
                  }, b(U), 9, bg))), 128))
                ], 8, yg)
              ])) : E("", !0)
            ], 64))), 128))
          ], 12, dg))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, kg = /* @__PURE__ */ K(wg, [["__scopeId", "data-v-51d24cfe"]]), Mo = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', So = {
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
  agent: Mo,
  worker: Mo,
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
}, $g = ["innerHTML"], xg = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = I(() => So[t.name] || So.dot);
    return (a, s) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, $g));
  }
}, ht = /* @__PURE__ */ K(xg, [["__scopeId", "data-v-beb5935c"]]), Mg = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: X(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      L(ht, { name: "fold" })
    ], 2));
  }
}, Mt = /* @__PURE__ */ K(Mg, [["__scopeId", "data-v-d03899bb"]]), Sg = ["data-tip", "aria-label"], _g = {
  key: 0,
  class: "mact-word"
}, Eg = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: X(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      L(ht, { name: "open" }),
      e.open ? (c(), h("span", _g, b(e.label), 1)) : E("", !0),
      n[0] || (n[0] = g("span", { class: "hit" }, null, -1))
    ], 10, Sg));
  }
}, $r = /* @__PURE__ */ K(Eg, [["__scopeId", "data-v-3b292e09"]]), xr = 120, Dn = 280, Mr = 160, Cg = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, Ag = ["leaving", "resizing", "entering"];
function os(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function Og(e) {
  const t = Ag.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = os(e);
  return e.classList.add(...t), n;
}
function Sr(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = A(t()), s = A("");
  let o = 0;
  const l = (f, m) => Object.assign(f.style, { width: `${m.width}px`, height: `${m.height}px` }), r = (f) => Object.assign(f.style, { width: "", height: "", transition: "" });
  function i(f, m) {
    r(f);
    const v = Og(f);
    l(f, m), f.offsetWidth, f.style.transition = `width ${Dn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Dn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(f, v);
  }
  function u(f) {
    const m = f.querySelector(":scope > :not(.top)");
    if (!m || typeof ResizeObserver > "u") return null;
    let v = m.offsetHeight;
    const y = new ResizeObserver(() => {
      m.offsetHeight !== v && (v = m.offsetHeight, i(f, os(f)));
    });
    return y.observe(m), y;
  }
  async function d(f) {
    const m = e.value, v = ++o;
    if (!m || !m.offsetWidth || Cg()) {
      a.value = f;
      return;
    }
    const y = os(m);
    if (l(m, y), s.value = "leaving", await n(xr), v !== o) return;
    a.value = f, s.value = "resizing", await Qe(), i(m, y);
    const x = u(m);
    await n(Dn), x == null || x.disconnect(), v === o && (r(m), s.value = "entering", await n(Mr), v === o && (s.value = ""));
  }
  return ge(t, (f) => d(f)), Je(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const Tg = { class: "growing-card-top" }, Rg = ["aria-expanded"], Ig = { class: "growing-card-avatar" }, Bg = { class: "growing-card-title" }, Lg = { class: "growing-card-more" }, Ng = { class: "growing-card-body" }, Dg = {
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
    const n = e, a = t, s = A(!1), o = A(null), { folded: l, phase: r } = Sr(o, () => !s.value), i = I(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = I(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: X(["growing-card-wrap", D(r), { open: !D(l), bad: e.bad, incoming: e.incoming }])
    }, [
      g("div", Tg, [
        g("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: f[0] || (f[0] = (m) => s.value = !s.value)
        }, [
          g("span", Ig, [
            e.bad ? (c(), W(ht, {
              key: 0,
              name: "cross"
            })) : i.value ? (c(), h(z, { key: 1 }, [
              ee(b(i.value), 1)
            ], 64)) : (c(), W(be, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          g("span", Bg, b(e.title), 1),
          L(Mt, { open: s.value }, null, 8, ["open"])
        ], 8, Rg),
        e.action ? (c(), W($r, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: f[1] || (f[1] = (m) => a("act"))
        }, null, 8, ["label", "open"])) : E("", !0),
        e.commentable ? (c(), h("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: f[2] || (f[2] = (m) => a("comment"))
        }, [
          L(be, {
            name: "bubble",
            size: 13
          })
        ])) : E("", !0)
      ]),
      g("div", Lg, [
        g("div", Ng, [
          (c(!0), h(z, null, te(u.value, (m, v) => (c(), h("p", {
            key: v,
            class: "growing-card-text"
          }, b(m), 1))), 128))
        ])
      ])
    ], 2));
  }
}, jg = /* @__PURE__ */ K(Dg, [["__scopeId", "data-v-f2b4930d"]]), qg = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, Pg = { class: "md inline" }, Fg = ["disabled", "title", "onClick"], Wg = {
  key: 1,
  class: "message-links-many"
}, Hg = ["aria-expanded"], Ug = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, zg = ["disabled", "onClick"], Vg = { class: "row-pill message-links-chip" }, Gg = { class: "message-links-title" }, Kg = { key: 0 }, _a = 3, Yg = "task", Jg = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => n.total || n.links.length), o = I(() => n.links.every((m) => m.endpoint.model === Yg) ? "tasks" : "items"), l = A(!1), r = A(null);
    Ml(r, () => l.value = !1);
    const i = () => l.value = !l.value, u = (m) => m.endpoint.unavailable || !m.endpoint.open_ref, d = (m) => m.relations.includes("edited") ? m.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function f(m) {
      u(m) || (l.value = !1, He(m.endpoint.open_ref));
    }
    return (m, v) => (c(), h("div", {
      ref_key: "line",
      ref: r,
      class: X(["message-links", { many: s.value > _a, three: s.value === _a, open: l.value }]),
      "data-message-links": ""
    }, [
      L(ht, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (c(), h("span", qg, [
        g("span", Pg, [
          v[1] || (v[1] = ee("Linked: ", -1)),
          (c(!0), h(z, null, te(e.links, (y) => (c(), h("button", {
            key: `${y.endpoint.model}:${y.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: u(y),
            title: y.endpoint.title,
            onClick: (x) => f(y)
          }, [
            ee(b(y.endpoint.model.replaceAll("_", " ")) + " " + b(y.endpoint.id), 1),
            d(y) ? (c(), h(z, { key: 0 }, [
              ee(" (" + b(d(y)) + ")", 1)
            ], 64)) : E("", !0),
            u(y) ? (c(), h(z, { key: 1 }, [
              ee(" (unavailable)")
            ], 64)) : E("", !0)
          ], 8, Fg))), 128))
        ])
      ])) : E("", !0),
      s.value >= _a ? (c(), h("span", Wg, [
        g("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: i
        }, [
          ee(b(s.value) + " linked " + b(o.value) + " ", 1),
          L(Mt, { open: l.value }, null, 8, ["open"])
        ], 8, Hg)
      ])) : E("", !0),
      l.value ? (c(), h("div", Ug, [
        (c(!0), h(z, null, te(e.links, (y) => (c(), h("button", {
          key: `${y.endpoint.model}:${y.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: u(y),
          onClick: (x) => f(y)
        }, [
          g("span", Vg, b(y.endpoint.model.replaceAll("_", " ")) + " " + b(y.endpoint.id), 1),
          g("span", Gg, b(y.endpoint.title), 1),
          g("span", null, b(d(y)), 1),
          u(y) ? (c(), h("span", Kg, "Unavailable")) : E("", !0)
        ], 8, zg))), 128))
      ])) : E("", !0),
      L(hn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: v[0] || (v[0] = (y) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, Qg = /* @__PURE__ */ K(Jg, [["__scopeId", "data-v-e9bc783c"]]), Zg = ["title", "aria-label"], Xg = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, ev = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, tv = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = I(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (c(), h("span", {
      class: X(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (c(), h("svg", Xg, [
        o[0] || (o[0] = g("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (c(), h("path", ev)) : E("", !0)
      ]))
    ], 10, Zg));
  }
}, nv = /* @__PURE__ */ K(tv, [["__scopeId", "data-v-6dc92808"]]), av = "img,pre,table";
function sv(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function ov(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function lv(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(av)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = sv(ov(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function rv(e, t) {
  let n = null;
  const a = () => e.value && lv(e.value);
  Te(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== s && (s = r.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Le(() => n == null ? void 0 : n.disconnect()), ge(t, a, { flush: "post" });
}
const iv = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function cv(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const An = /* @__PURE__ */ new WeakMap(), Ke = "work", Gt = "sent", uv = 50, _o = () => ({ rows: A([]), total: A(0), next: A(null), loading: A(!1), failure: A(""), version: 0 });
function dv(e) {
  var f;
  if (An.has(e)) return An.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (m) => {
    var v;
    return ((v = e.visible) == null ? void 0 : v.value) !== !1 && [...m.views].some((y) => y.visible);
  };
  async function o(m, v, y = 1) {
    const x = m[v], C = ++x.version;
    x.loading.value = !0, x.failure.value = "";
    const _ = v === Ke ? "--type about --type edited --group-counterparts" : "--type sent_to", N = `link list --source message:${m.id} ${_} --page ${y} --page-size ${v === Ke ? 10 : 25}`;
    try {
      const U = await e.read(N);
      if (t.get(m.id) !== m || x.version !== C) return;
      if (!U.ok) {
        x.failure.value = U.error;
        return;
      }
      const q = v === Ke ? U.value.counterparts ?? [] : U.value.rows ?? [], B = y === 1 ? q : [...x.rows.value, ...q], F = v === Ke ? (O) => `${O.endpoint.model}:${O.endpoint.id}` : (O) => O.id ?? O.target_id;
      x.rows.value = [...new Map(B.map((O) => [F(O), O])).values()], x.total.value = U.value.total ?? x.rows.value.length, x.next.value = U.value.next_page ?? null;
    } catch (U) {
      x.version === C && (x.failure.value = U.message);
    } finally {
      x.version === C && (x.loading.value = !1);
    }
  }
  function l() {
    a = null;
    const m = [...n].map((v) => t.get(v)).filter((v) => v && s(v));
    n.clear();
    for (const v of m) {
      const y = [...v.dirty];
      v.dirty.clear();
      for (const x of y) o(v, x);
    }
  }
  function r(m, v = [Ke, Gt]) {
    for (const y of v) m.dirty.add(y);
    s(m) && (n.add(m.id), a ?? (a = setTimeout(l, 0)));
  }
  function i(m) {
    const v = m.sources ?? (m.source_model && Number.isInteger(m.source_id) ? [{ model: m.source_model, id: m.source_id }] : []), y = m.link_types ?? (m.link_type ? [m.link_type] : []), x = y.length ? [Ke, Gt].filter((_) => _ === Ke ? y.some((N) => ["about", "edited"].includes(N)) : y.includes("sent_to")) : [Ke, Gt];
    if (!x.length) return;
    const C = v.length ? [...new Set(v.filter((_) => _.model === "message").map((_) => _.id))].map((_) => t.get(_)).filter(Boolean) : [...t.values()].filter(s).slice(0, uv);
    for (const _ of C) r(_, x);
  }
  const u = (f = e.follow) == null ? void 0 : f.call(e, ["link.*"], i), d = {
    attach(m, v) {
      let y = t.get(m);
      return y || (y = { id: m, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Ke, Gt]), work: _o(), sent: _o() }, t.set(m, y)), y.views.add(v), y.dirty.size && r(y, [...y.dirty]), y;
    },
    shown(m) {
      m.dirty.size && r(m, [...m.dirty]);
    },
    detach(m, v) {
      m.views.delete(v), m.views.size || t.delete(m.id), t.size || (clearTimeout(a), u == null || u(), An.delete(e));
    },
    more(m, v) {
      const y = m == null ? void 0 : m[v];
      if (y != null && y.next.value && !y.loading.value) return o(m, v, y.next.value);
    }
  };
  return An.set(e, d), d;
}
function fv(e, t, n) {
  const a = Ye(null);
  let s = null;
  const o = ge(t, (l, r, i) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = dv(e);
    const u = { visible: typeof IntersectionObserver > "u" }, d = s.attach(l, u);
    a.value = d;
    const f = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((v) => {
      u.visible = v.some((y) => y.isIntersecting), u.visible && s.shown(d);
    }, { rootMargin: "100px" }), m = ge(n, (v) => {
      f == null || f.disconnect(), v && (f == null || f.observe(v));
    }, { immediate: !0, flush: "post" });
    i(() => {
      m(), f == null || f.disconnect(), s.detach(d, u), a.value = null;
    });
  }, { immediate: !0 });
  return vs(o), {
    links: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.rows.value) ?? [];
    }),
    total: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.total.value) ?? 0;
    }),
    more: I(() => {
      var l;
      return !!((l = a.value) != null && l.work.next.value);
    }),
    loading: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.loading.value) ?? !1;
    }),
    failure: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.failure.value) ?? "";
    }),
    sentTo: I(() => {
      var l;
      return (((l = a.value) == null ? void 0 : l.sent.rows.value) ?? []).map((r) => r.target);
    }),
    sentMore: I(() => {
      var l;
      return !!((l = a.value) != null && l.sent.next.value);
    }),
    sentLoading: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.loading.value) ?? !1;
    }),
    sentFailure: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.failure.value) ?? "";
    }),
    loadMore: () => s == null ? void 0 : s.more(a.value, Ke),
    loadSent: () => s == null ? void 0 : s.more(a.value, Gt)
  };
}
const hv = ["data-incoming", "data-ref"], mv = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], pv = { class: "message-body" }, gv = ["title"], vv = ["innerHTML"], yv = ["title"], bv = ["innerHTML"], wv = {
  class: "message-faces",
  "data-message-faces": ""
}, kv = ["title", "data-face", "onClick"], $v = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, xv = ["title", "data-reaction", "onClick"], Mv = {
  key: 0,
  class: "message-reaction-count"
}, Sv = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, _v = ["href", "title"], Ev = ["src", "alt"], Cv = ["href"], Av = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, Ov = ["disabled", "data-sent-worker", "title", "onClick"], Tv = { class: "message-foot" }, Rv = { class: "message-time" }, Iv = {
  class: "message-id",
  "data-message-id": ""
}, Bv = 140, Lv = 2, Nv = 1500, Dv = "An earlier message", jv = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(!1), o = A(null), l = I(() => ["user", "comment"].includes(n.message.type)), r = I(() => {
      const [Z, ae] = (n.message.commented_row || ":").split(":"), oe = dt(Z);
      return oe ? { ref: `${oe}:${ae}`, label: `${Ht(oe).title.toLowerCase()} ${ae}` } : null;
    }), i = I(() => n.message.worker_id ?? null), u = A(!1), d = I(() => i.value !== null && ((n.message.text ?? "").length > Bv || (n.message.text ?? "").split(`
`).filter((Z) => Z.trim()).length > Lv)), f = I(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var Z;
      await ((Z = navigator.clipboard) == null ? void 0 : Z.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, Nv);
    }
    const v = lr(), y = I(() => v(n.message.text ?? "")), x = I(() => JSON.parse(n.message.flowchart_edges || "[]")), C = A(!1), _ = I(() => v(n.quote || Dv));
    function N() {
      const Z = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      Z ? Z.scrollIntoView({ block: "center", behavior: "smooth" }) : He(`messages:${n.message.parent_id}`);
    }
    rv(o, () => `${n.message.text} ${n.quote}`);
    const U = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, q = (Z) => `/api/files/message/${n.message.id}/${encodeURIComponent(Z)}`, B = I(() => JSON.parse(n.message.captions || "{}")), F = I(() => (n.message.files ?? []).map((Z) => ({ name: Z, address: q(Z), isImage: U.test(Z), title: B.value[Z] || Z }))), O = I(() => tr(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), T = Oe(je, null), { links: $, total: w, more: k, loading: p, failure: M, sentTo: S, sentMore: R, sentLoading: P, sentFailure: Q, loadMore: se, loadSent: ie } = fv(T, () => l.value && !n.message.local ? n.message.id : null, o), pe = A(!1), Ce = I(() => cv(n.message.reactions));
    function fe(Z) {
      pe.value = !1, a("react", n.message, Z);
    }
    return (Z, ae) => e.message.peer || e.message.recipient ? (c(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      L(jg, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: ae[0] || (ae[0] = (oe) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, hv)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      g("div", pv, [
        g("div", {
          ref_key: "bubble",
          ref: o,
          class: X(["message-card", "md", { comment: r.value }]),
          onClick: ae[6] || (ae[6] = (...oe) => D(Lt) && D(Lt)(...oe))
        }, [
          r.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${r.value.label}`,
            onClick: ae[1] || (ae[1] = xe((oe) => D(He)(r.value.ref), ["stop"]))
          }, [
            L(be, {
              name: "bubble",
              size: 12
            }),
            g("span", null, "Comment on " + b(r.value.label), 1)
          ], 8, gv)) : E("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: xe(N, ["stop"]),
            innerHTML: _.value
          }, null, 8, vv)) : E("", !0),
          i.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${i.value}`,
            onClick: ae[2] || (ae[2] = xe((oe) => D(He)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + b(i.value), 9, yv)) : E("", !0),
          g("div", {
            class: X({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: y.value
          }, null, 10, bv),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: ae[3] || (ae[3] = xe((oe) => u.value = !u.value, ["stop"]))
          }, b(u.value ? "Show less" : "Show more"), 1)) : E("", !0),
          x.value.length ? (c(), h(z, { key: 4 }, [
            g("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: ae[4] || (ae[4] = (oe) => C.value = !0)
            }, "Open the flowchart"),
            C.value ? (c(), W(kg, {
              key: 0,
              title: e.message.text,
              edges: x.value,
              onClose: ae[5] || (ae[5] = (oe) => C.value = !1)
            }, null, 8, ["title", "edges"])) : E("", !0)
          ], 64)) : E("", !0)
        ], 2),
        g("div", {
          class: X(["message-tools", { picking: pe.value }]),
          "data-message-tools": ""
        }, [
          pe.value ? (c(), h(z, { key: 0 }, [
            g("div", wv, [
              (c(!0), h(z, null, te(D(iv), (oe) => (c(), h("button", {
                key: oe,
                type: "button",
                class: "message-face",
                title: `React ${oe}`,
                "data-face": oe,
                onClick: (Ze) => fe(oe)
              }, b(oe), 9, kv))), 128))
            ]),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: ae[7] || (ae[7] = (oe) => pe.value = !1)
            }, [
              L(be, {
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
              onClick: ae[8] || (ae[8] = (oe) => pe.value = !0)
            }, "React"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: ae[9] || (ae[9] = (oe) => a("reply", e.message))
            }, "Reply"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: m
            }, b(s.value ? "Copied" : "Copy"), 1),
            f.value ? (c(), h("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: ae[10] || (ae[10] = (oe) => a("delete", e.message))
            }, "Delete")) : E("", !0)
          ], 64))
        ], 2)
      ]),
      Ce.value.length ? (c(), h("div", $v, [
        (c(!0), h(z, null, te(Ce.value, (oe) => (c(), h("button", {
          key: oe.emoji,
          type: "button",
          class: X(["message-reaction", { mine: oe.mine }]),
          title: oe.title,
          "data-reaction": oe.emoji,
          onClick: (Ze) => a("react", e.message, oe.emoji)
        }, [
          ee(b(oe.emoji) + " ", 1),
          oe.count > 1 ? (c(), h("span", Mv, b(oe.count), 1)) : E("", !0)
        ], 10, xv))), 128))
      ])) : E("", !0),
      F.value.length ? (c(), h("div", Sv, [
        (c(!0), h(z, null, te(F.value, (oe) => (c(), h(z, {
          key: oe.name
        }, [
          oe.isImage ? (c(), h("a", {
            key: 0,
            href: oe.address,
            target: "_blank",
            class: "message-image",
            title: oe.title
          }, [
            g("img", {
              src: oe.address,
              alt: oe.name,
              "data-figure-picture": ""
            }, null, 8, Ev)
          ], 8, _v)) : (c(), h("a", {
            key: 1,
            href: oe.address,
            target: "_blank",
            class: "message-file"
          }, b(oe.name), 9, Cv))
        ], 64))), 128))
      ])) : E("", !0),
      D(S).length ? (c(), h("div", Av, [
        L(be, {
          name: "send",
          size: 12
        }),
        (c(!0), h(z, null, te(D(S), (oe) => (c(), h("button", {
          key: oe.id,
          type: "button",
          class: "message-sent-worker",
          disabled: oe.unavailable || !oe.open_ref,
          "data-sent-worker": oe.id,
          title: `Open worker ${oe.id}`,
          onClick: xe((Ze) => oe.open_ref && D(He)(oe.open_ref), ["stop"])
        }, [
          ee("Also sent to worker " + b(oe.id), 1),
          oe.unavailable ? (c(), h(z, { key: 0 }, [
            ee(" (unavailable)")
          ], 64)) : E("", !0)
        ], 8, Ov))), 128))
      ])) : E("", !0),
      L(hn, {
        more: D(R),
        loading: D(P),
        failure: D(Q),
        label: "More recipients",
        onMore: D(ie)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      g("div", Tv, [
        g("time", Rv, b(O.value), 1),
        Number.isInteger(e.message.id) ? (c(), h(z, { key: 0 }, [
          ae[11] || (ae[11] = g("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          g("span", Iv, "message " + b(e.message.id), 1)
        ], 64)) : E("", !0),
        l.value ? (c(), W(nv, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : E("", !0)
      ]),
      D($).length || D(M) ? (c(), W(Qg, {
        key: 3,
        links: D($),
        total: D(w),
        more: D(k),
        loading: D(p),
        failure: D(M),
        onMore: D(se)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : E("", !0)
    ], 8, mv));
  }
}, q$ = /* @__PURE__ */ K(jv, [["__scopeId", "data-v-0be1107c"]]), Kn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Ea = 200, _r = (e) => {
  var t;
  return ((t = Kn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Kn[0].key;
}, P$ = (e) => {
  var t;
  return ((t = Kn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, qv = ["aria-label"], Pv = 300, Eo = 400, Fv = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Ea } },
  setup(e) {
    const t = e, n = I(() => _r(t.value)), a = I(() => n.value < Ea ? [1, 0.25, 0.25] : n.value === Ea ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (c(), h("svg", {
      class: X(["ico", "prio", { hot: n.value >= Eo, high: n.value >= Pv && n.value < Eo }]),
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
        style: ye({ opacity: a.value[0] })
      }, null, 4),
      g("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: ye({ opacity: a.value[1] })
      }, null, 4),
      g("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: ye({ opacity: a.value[2] })
      }, null, 4)
    ], 10, qv));
  }
}, F$ = /* @__PURE__ */ K(Fv, [["__scopeId", "data-v-b10e610f"]]), Co = (e) => [...new Set(e.agents.map((t) => t.name))], W$ = (e) => Co(e).length === 1 ? `Worker: ${Co(e)[0]}` : "Delegated", Wv = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, Ao = (e) => Wv[e.card.state] || "idle", Hv = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), Oo = { working: 0, waiting: 1, idle: 2, stopped: 3 }, To = (e, t) => Oo[Ao(e)] - Oo[Ao(t)], Ro = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, H$ = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => To(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || Hv(a, s)) : [...e].sort((a, s) => To(a, s) || (Ro[t] || Ro.state)(a, s)), Uv = { class: "list-row" }, zv = {
  key: 0,
  class: "list-row-type"
}, Vv = { class: "list-row-main" }, Gv = {
  key: 0,
  class: "list-row-title"
}, Kv = { class: "list-row-body" }, Yv = {
  key: 1,
  class: "list-row-end"
}, Jv = {
  key: 1,
  class: "list-row-text"
}, Qv = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", Uv, [
      e.type ? (c(), h("span", zv, b(e.type), 1)) : E("", !0),
      g("div", Vv, [
        e.title ? (c(), h("span", Gv, b(e.title), 1)) : E("", !0),
        g("div", Kv, [
          me(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", Yv, [
          me(t.$slots, "end", {}, void 0, !0)
        ])) : E("", !0)
      ]),
      e.text ? (c(), h("span", Jv, b(e.text), 1)) : E("", !0)
    ]));
  }
}, U$ = /* @__PURE__ */ K(Qv, [["__scopeId", "data-v-dfc8c3a7"]]), z$ = {
  __name: "ModelPicker",
  props: {
    title: { type: String, required: !0 },
    models: { type: Array, required: !0 },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => [
      ...n.models.map((l) => ({ key: l.name, label: l.name, note: l.tier })),
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = I(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, r) => (c(), W(Xl, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: r[0] || (r[0] = (i) => a("pick", i.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Zv = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: X(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      me(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, Er = /* @__PURE__ */ K(Zv, [["__scopeId", "data-v-978e0921"]]), Xv = ["aria-label"], e0 = { class: "head" }, t0 = { class: "names" }, n0 = { class: "body" }, a0 = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Ll(a, n), r = Nl(s);
    return (i, u) => (c(), W(aa, { to: "body" }, [
      L(Ft, {
        name: "side",
        appear: "",
        onAfterLeave: D(l)
      }, {
        default: j(() => [
          D(s) ? (c(), h("div", {
            key: 0,
            class: X(["veil", { over: e.over, under: e.depth }]),
            style: ye({ "--depth": e.depth, zIndex: D(r) }),
            "data-side-panel": "",
            onClick: u[0] || (u[0] = xe((...d) => D(o) && D(o)(...d), ["self"]))
          }, [
            g("aside", {
              class: X(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(z, { key: 0 }, [
                g("header", e0, [
                  g("div", t0, [
                    g("h2", null, b(e.title), 1),
                    e.abstract ? (c(), W($t, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : E("", !0)
                  ]),
                  me(i.$slots, "actions", {}, void 0, !0),
                  L(oa, {
                    title: e.closeLabel,
                    onClick: D(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                i.$slots.foot ? (c(), W(Er, { key: 0 }, {
                  default: j(() => [
                    me(i.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : E("", !0),
                g("div", n0, [
                  me(i.$slots, "default", {}, void 0, !0)
                ])
              ], 64)) : me(i.$slots, "default", {}, void 0, !0, 1)
            ], 10, Xv)
          ], 6)) : E("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, V$ = /* @__PURE__ */ K(a0, [["__scopeId", "data-v-f276f055"]]), s0 = {
  key: 1,
  class: "text-field-label"
}, o0 = {
  key: 2,
  class: "text-field-end"
}, l0 = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ tn({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = Wn(e, "modelValue"), a = na(), s = "onUpdate:modelValue" in (((d = Ai()) == null ? void 0 : d.vnode.props) || {}), o = I(() => s ? n.value : a.value), l = (f) => s && (n.value = f.target.value), r = I(
      () => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), i = I(() => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "value"))), u = A(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, m) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: X(["text-field", { large: e.large, ended: f.$slots.end }, D(a).class]),
      style: ye(D(a).style)
    }, [
      e.icon ? (c(), W(be, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : E("", !0),
      e.label ? (c(), h("span", s0, b(e.label), 1)) : E("", !0),
      De(g("input", Ne({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: l }), null, 16), [
        [D(Xa), o.value]
      ]),
      f.$slots.end ? (c(), h("span", o0, [
        me(f.$slots, "end", {}, void 0, !0)
      ])) : E("", !0)
    ], 6)) : De((c(), h("input", Ne({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, i.value, { onInput: l }), null, 16)), [
      [D(Xa), o.value]
    ]);
  }
}), G$ = /* @__PURE__ */ K(l0, [["__scopeId", "data-v-d9c38ca8"]]), r0 = { class: "title" }, i0 = { class: "state" }, c0 = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = Ka(t.line, t.events);
    return (o, l) => (c(), W(Fp, {
      rows: D(n),
      failure: D(a),
      loaded: D(s),
      empty: e.empty
    }, {
      default: j(({ row: r }) => [
        g("span", r0, b(r.title), 1),
        g("span", i0, b(D(Ms)(e.noun, r.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, K$ = /* @__PURE__ */ K(c0, [["__scopeId", "data-v-9191a6f0"]]);
function u0(e = 1e3, t = null) {
  const n = A(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? ge(t, s, { immediate: !0 }) : s(!0), Le(() => clearInterval(a)), n;
}
const Ca = A(Date.now() / 1e3);
let Io = 0, On = 0;
function Cr() {
  return On || (Ca.value = Date.now() / 1e3, Io = setInterval(() => Ca.value = Date.now() / 1e3, 1e3)), On += 1, ul() && vs(() => {
    On -= 1, On || clearInterval(Io);
  }), Ca;
}
const d0 = 200, f0 = xr + Dn + Mr + d0;
function zt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function h0(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: zt(e),
    top: zt(e.querySelector(".top")),
    title: zt(e.querySelector(".title")),
    contents: zt(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var l, r, i, u;
      return `${((r = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : r.className) || ((u = (i = o.effect) == null ? void 0 : i.target) == null ? void 0 : u.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: u, display: d }) => ({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: u, display: d }))(getComputedStyle(e)),
    parent: zt(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function m0(e, t, n, a) {
  ge(t, (s) => {
    var u;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((u = a.markMotion) != null && u.value)) return;
    const l = performance.now(), r = [];
    function i() {
      if (a.markMotion.value) {
        if (r.push(h0(o, l, n.value)), performance.now() - l < f0) return void requestAnimationFrame(i);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: r })]);
      }
    }
    i();
  }, { flush: "sync" });
}
const p0 = ["title", "data-figure-mark", "data-folded", "data-open"], g0 = {
  key: 2,
  class: "worker"
}, v0 = { class: "head" }, y0 = { key: 0 }, b0 = {
  key: 3,
  class: "status"
}, w0 = {
  key: 0,
  class: "figure"
}, k0 = {
  key: 1,
  class: "ran-for"
}, $0 = { key: 2 }, x0 = {
  key: 3,
  class: "news"
}, M0 = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, S0 = {
  key: 6,
  class: "settled"
}, _0 = {
  key: 1,
  class: "bar"
}, E0 = {
  key: 3,
  class: "detail body"
}, C0 = {
  key: 0,
  class: "body-label"
}, A0 = ["title"], O0 = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = na(), a = ["onClick", "onAct"], s = I(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = A(!1), l = I(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = I(() => t.open !== void 0), i = I(() => r.value || l.value), u = I(() => r.value ? t.open : o.value), d = I(() => r.value ? !t.open : l.value && !o.value), f = I(() => !!(t.mark.action && n.onAct)), m = I(() => i.value || f.value || !!n.onClick), v = A(null), y = A(null), { folded: x, phase: C } = Sr(v, () => d.value);
    m0(v, d, C, Oe(je, null));
    function _(ie) {
      var pe, Ce;
      if (!(ie.target !== v.value && !y.value.contains(ie.target))) {
        if (r.value) return (pe = n.onClick) == null ? void 0 : pe.call(n, ie);
        if (l.value) return void (o.value = !o.value);
        (Ce = n.onAct || n.onClick) == null || Ce(ie);
      }
    }
    const N = (ie) => n.onAct(ie), U = ["failed", "unfinished"], q = I(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? U.includes(t.mark.state) ? "danger" : "good" : ""), B = I(() => t.mark.color ? t.mark.color : q.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : q.value ? `var(--tone-${q.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), F = I(() => B.value || "var(--tone-work)"), O = I(() => !t.mark.ending && !t.mark.ended && q.value !== "stopped"), T = Cr(), $ = I(
      () => t.mark.began_at && O.value && !t.mark.figure && !t.mark.counting ? Ff(T.value - t.mark.began_at) : ""
    ), w = I(() => {
      const { started: ie, ended: pe } = t.mark;
      return ie ? pe ? `ran ${fo(pe - ie, !0)}` : fo(T.value - ie, !0) : $.value;
    }), k = ["bad", "danger", "warn"], p = I(() => k.includes(q.value) || t.mark.asks ? "attention" : O.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), M = ["bad", "danger"], S = I(() => M.includes(q.value)), R = I(() => p.value === "process" ? "running" : S.value ? "cross" : q.value === "stopped" ? "stopped" : q.value === "good" ? "tick" : ""), P = I(
      () => !!(t.mark.figure || w.value || t.mark.docked || t.mark.stopping || R.value || t.mark.settled || t.mark.news)
    ), Q = I(() => [t.mark.title, t.mark.time ? tr(t.mark.time) : ""].filter(Boolean).join(" · ")), se = I(() => ({
      ...B.value ? { "--mark": B.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ie, pe) => (c(), h("div", Ne(s.value, {
      ref_key: "root",
      ref: v,
      class: [
        "mark",
        `w-${p.value}`,
        D(C),
        {
          open: u.value,
          folding: r.value && d.value,
          live: m.value,
          failed: S.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: B.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: se.value,
      title: Q.value,
      "data-figure-mark": e.mark.key,
      "data-folded": D(x) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: _
    }), [
      (c(), W(mt(m.value ? "button" : "span"), {
        ref_key: "top",
        ref: y,
        class: "top",
        type: m.value ? "button" : void 0,
        "aria-expanded": i.value ? String(!!u.value) : void 0
      }, {
        default: j(() => [
          e.mark.markIcon ? (c(), W(ht, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), W(be, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", g0, b(e.mark.worker), 1)) : E("", !0),
          g("span", v0, [
            L($t, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", y0, b(e.mark.name), 1)) : E("", !0),
            i.value ? (c(), W(Mt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : E("", !0)
          ]),
          P.value ? (c(), h("span", b0, [
            e.mark.figure ? (c(), h("span", w0, b(e.mark.figure), 1)) : E("", !0),
            w.value ? (c(), h("span", k0, b(w.value), 1)) : E("", !0),
            e.mark.stopping ? (c(), h("span", $0, "Stopping")) : E("", !0),
            e.mark.news ? (c(), h("span", x0, b(e.mark.news), 1)) : E("", !0),
            R.value === "running" ? (c(), h("span", M0)) : R.value ? (c(), W(ht, {
              key: 5,
              class: X(["sign", R.value]),
              name: R.value
            }, null, 8, ["class", "name"])) : E("", !0),
            e.mark.settled ? (c(), h("span", S0, b(e.mark.settled), 1)) : E("", !0)
          ])) : E("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), W($r, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: xe(N, ["stop"])
      }, null, 8, ["label", "open"])) : E("", !0),
      (e.mark.figure || e.mark.counting) && O.value ? (c(), h("span", _0, [
        g("span", {
          class: "progress",
          style: ye({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: F.value })
        }, null, 4)
      ])) : E("", !0),
      e.mark.detail && !D(x) ? (c(), W($t, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : E("", !0),
      e.mark.body && !D(x) ? (c(), h("div", E0, [
        e.mark.bodyLabel ? (c(), h("p", C0, b(e.mark.bodyLabel), 1)) : E("", !0),
        L($t, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : E("", !0),
      e.mark.command && !D(x) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, b(e.mark.command), 9, A0)) : E("", !0),
      e.mark.card ? (c(), W($t, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : E("", !0),
      me(ie.$slots, "default", {
        shown: !D(x)
      }, void 0, !0)
    ], 16, p0));
  }
}), Ar = /* @__PURE__ */ K(O0, [["__scopeId", "data-v-2aa9c496"]]), T0 = 60, Or = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function R0(e, t) {
  const n = A([]), a = A(0);
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
    if (l || a.value <= 0 || d.scrollTop > T0) return;
    l = !0;
    const f = d.scrollHeight, m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    l = !1, m.ok && (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, await Qe(), d.scrollTop += d.scrollHeight - f);
  }
  return { lines: n, newest: r, follow: i, loadEarlier: u };
}
const I0 = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function Tr(e) {
  var n;
  const t = I0[e] || ((n = Ht(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const B0 = (e) => Tr(String(e).split(":")[0]), L0 = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), N0 = { passed: "good", failed: "danger", warned: "warn", running: "" }, D0 = { good: "good", warn: "warn", danger: "danger" }, Bo = {
  "open row": (e) => He(`${e.target_model}:${e.target_id}`),
  "open page": (e) => df(e.target_model, e.target_id || 0)
}, j0 = { "open row": (e) => B0(e.target_model), "open page": () => Tr("pages") };
function q0(e, t) {
  const n = t || {}, a = Bo[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? N0[e.outcome] || "" : D0[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? j0[a](e) : "",
    handlers: a ? { onAct: () => Bo[a](e) } : {}
  };
}
const P0 = 24, F0 = 1e3, Lo = 2e3, W0 = 0.25, H0 = 5e3;
function U0(e, t = P0, n = () => !0) {
  const a = A(!1), s = A(0), o = A(!1);
  let l = 0, r = 0, i = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const q = u();
    return q ? q.scrollHeight - q.scrollTop - q.clientHeight : 0;
  }, f = () => !u() || d() <= t;
  function m(q) {
    if (clearTimeout(l), !q) {
      o.value = !1, i = Date.now();
      return;
    }
    const B = Date.now() - i < Lo ? Lo : F0;
    l = setTimeout(() => o.value = a.value, B);
  }
  function v() {
    clearTimeout(r), a.value = !1, s.value = 0, m(!1);
  }
  function y(q = !1) {
    const B = u();
    B && q && B.scrollTo ? B.scrollTo({ top: B.scrollHeight, behavior: "smooth" }) : B && (B.scrollTop = B.scrollHeight), v();
  }
  function x() {
    _(), !a.value && (a.value = !0, m(!0));
  }
  const C = () => !!u() && d() <= u().clientHeight * W0;
  function _() {
    clearTimeout(r), C() && (r = setTimeout(() => a.value && C() && n() && y(!0), H0));
  }
  function N() {
    f() ? v() : x();
  }
  function U(q = 1, B = !1) {
    a.value ? s.value += Math.max(0, q) : y(B);
  }
  return ul() && vs(() => [l, r].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: f, follow: v, toBottom: y, left: x, scrolled: N, arrived: U };
}
const z0 = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, V0 = (e) => String(e ?? "").replace(z0, ""), G0 = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(null), { away: o, scrolled: l, arrived: r, toBottom: i } = U0(s);
    ge(
      () => n.lines.length,
      () => Qe(() => r()),
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
      ee(b(D(V0)(e.lines.join(`
`)) || e.empty), 1),
      D(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (m) => D(i)(!0))
      }, "Follow")) : E("", !0)
    ], 544));
  }
}, K0 = /* @__PURE__ */ K(G0, [["__scopeId", "data-v-c2fb1783"]]), Y0 = "*.*", J0 = {
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
    const t = e, n = Oe(je, null), a = new Hc();
    ge(
      () => a.patterns,
      (i, u, d) => {
        var m;
        const f = (m = n == null ? void 0 : n.subscriptions) == null ? void 0 : m.follow(`body of ${t.declaration.type}`, i, (v) => a.dispatch(v));
        d(() => f == null ? void 0 : f());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = I(() => !!(t.declaration.shipped || t.declaration.trusted)), r = I(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [Y0] : t.declaration.events ?? [],
      options: []
    }));
    return (i, u) => l.value ? (c(), W(yr, {
      key: 0,
      entry: r.value,
      subscriptions: D(a),
      environment: D(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), W(vr, {
      key: 1,
      entry: r.value,
      subscriptions: D(a),
      environment: D(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Q0 = { class: "mark-more-inner" }, Z0 = {
  class: "mark-lines",
  "data-mark-reason": ""
}, X0 = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, ey = {
  key: 3,
  class: "mark-lines"
}, ty = "process", No = "task", ny = {
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
    const t = e, n = Ue(), a = I(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = I(() => L0.has(t.mark.variant) && t.mark.detail || ""), o = I(() => t.mark.target_model === No ? t.mark.target_id : 0), l = R0(
      Or(n),
      () => t.mark.target_id
    ), r = l.lines, i = A(!1), u = A(""), d = I(() => !t.declaration.body_url && t.mark.target_model === ty && !!t.mark.target_id);
    async function f(v = l.follow) {
      const y = await v();
      i.value = !0, u.value = y.ok ? "" : y.error;
    }
    const m = I(() => t.shown && d.value);
    return ge(m, (v) => v && f()), bs(() => m.value && f(), () => m.value && !t.mark.ended_at), ge(
      () => t.mark.ended_at,
      (v) => v && m.value && f(l.newest)
    ), (v, y) => (c(), h("div", {
      class: X(["mark-more", { open: e.shown }]),
      onClick: y[1] || (y[1] = xe(() => {
      }, ["stop"]))
    }, [
      g("div", Q0, [
        e.declaration.body_url ? (c(), W(J0, {
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
            g("p", Z0, b(s.value), 1)
          ], 64)) : E("", !0),
          d.value && u.value ? (c(), h("p", X0, b(u.value), 1)) : d.value && i.value ? (c(), h(z, { key: 2 }, [
            y[3] || (y[3] = g("p", { class: "mark-label" }, "Output", -1)),
            L(K0, {
              class: "mark-terminal",
              lines: D(r),
              onOlder: D(l).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (c(), h("p", ey, b(a.value.join(`
`)), 1)) : E("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: y[0] || (y[0] = xe((x) => D(He)(`${No}:${o.value}`), ["stop"]))
          }, " Open task " + b(o.value) + " and its proofs ", 1)) : E("", !0)
        ], 64))
      ])
    ], 2));
  }
}, ls = /* @__PURE__ */ K(ny, [["__scopeId", "data-v-2f996108"]]), ay = ["title", "aria-label", "onClick"], sy = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, oy = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = I(() => Nd(t.buttons, t.allowedRuns).filter((l) => {
      var r;
      return !((r = l.variants) != null && r.length) || l.variants.includes(t.mark.variant);
    })), a = A(""), s = Oe(je);
    async function o(l) {
      const r = await mn(l, { id: t.mark.target_id }, s.environment);
      a.value = r.ok ? "" : r.error;
    }
    return (l, r) => (c(), h(z, null, [
      (c(!0), h(z, null, te(n.value, (i) => (c(), h("button", {
        key: i.runs,
        type: "button",
        class: "mark-button",
        title: i.label,
        "aria-label": i.label,
        onClick: xe((u) => o(i), ["stop"])
      }, [
        L(ht, {
          name: i.icon
        }, null, 8, ["name"])
      ], 8, ay))), 128)),
      a.value ? (c(), h("span", sy, b(a.value), 1)) : E("", !0)
    ], 64));
  }
}, ly = /* @__PURE__ */ K(oy, [["__scopeId", "data-v-7a62c88e"]]);
function Rr(e, t) {
  const n = Ye(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Se.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const Ir = Rr("/api/marks", "marks"), Y$ = Ir.fetchAll, ry = Ir.find, iy = ["data-ref"], cy = ["data-ref"], uy = { class: "mark-row" }, dy = "dock add", fy = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = I(() => ry(a.mark.type)), o = I(() => q0(a.mark, s.value)), l = I(() => {
      var d;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (d = s.value) != null && d.body_url);
    }), r = A(!1);
    function i(d) {
      if (o.value.handlers.onAct && !d.target.closest(".fold")) return o.value.handlers.onAct();
      r.value = !r.value;
    }
    const u = I(() => {
      var d;
      return (((d = s.value) == null ? void 0 : d.buttons) || []).filter((f) => {
        var m;
        return !a.docked || !((m = f.runs) != null && m.startsWith(dy));
      }).map((f) => ({ ...f, module: s.value.module }));
    });
    return (d, f) => {
      var m, v;
      return (m = s.value) != null && m.card ? (c(), h("div", {
        key: 0,
        class: X(["thread-turn", "card", "whole-card", { "user-side": D(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        L(ls, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, iy)) : (c(), h("div", {
        key: 1,
        class: X(["thread-turn", "card", { "full-width": (v = s.value) == null ? void 0 : v.full_width, docked: e.docked, "user-side": D(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        g("span", uy, [
          L(Ar, Ne({
            mark: o.value,
            open: l.value ? r.value : void 0
          }, Oi(o.value.handlers), { onClick: i }), Ti({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: j(({ shown: y }) => [
                L(ls, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: y
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          L(ly, {
            buttons: u.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, cy));
    };
  }
}, hy = /* @__PURE__ */ K(fy, [["__scopeId", "data-v-afd7d6b1"]]), my = ["data-ref"], py = ["inert"], gy = { class: "group-fold" }, vy = { class: "thread-group" }, yy = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = A(!1), a = A(!1), s = A(!1), o = A(null);
    ge(n, async (r) => {
      var i;
      a.value = !0, await Qe(), (i = o.value) == null || i.offsetHeight, s.value = r;
    });
    const l = I(() => ({
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
      L(Ar, {
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
        g("div", gy, [
          g("div", vy, [
            (c(!0), h(z, null, te(e.group.marks, (u) => (c(), W(hy, {
              key: u.id,
              mark: u
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, py)) : E("", !0)
    ], 8, my));
  }
}, J$ = /* @__PURE__ */ K(yy, [["__scopeId", "data-v-45b58b9b"]]);
function by(e) {
  const t = A(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Te(() => n.observe(e.value)), Je(() => n.disconnect()), t;
}
const wy = { class: "chat-dock-fold" }, ky = ["aria-label"], $y = { class: "chat-dock-head" }, xy = { class: "chat-dock-inner" }, My = { class: "chat-dock-foot" }, Br = 700, Sy = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = A(null), a = A(null), s = by(a), o = A(!1);
    let l = 0;
    return Te(() => l = setTimeout(() => o.value = !0, Br)), Je(() => clearTimeout(l)), t({ card: n }), (r, i) => (c(), h("div", {
      class: X(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      g("div", wy, [
        g("section", {
          ref_key: "card",
          ref: n,
          class: X(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          me(r.$slots, "edge", {}, void 0, !0),
          g("header", $y, [
            me(r.$slots, "head", {}, void 0, !0)
          ]),
          g("div", {
            class: X(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            g("div", xy, [
              g("div", {
                class: X(["chat-dock-grow", { settled: o.value }]),
                style: ye(D(s) === null ? null : { height: `${D(s)}px` })
              }, [
                g("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  me(r.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          me(r.$slots, "still", {}, void 0, !0),
          g("footer", My, [
            me(r.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, ky)
      ])
    ], 2));
  }
}, Lr = /* @__PURE__ */ K(Sy, [["__scopeId", "data-v-74d44b19"]]), _y = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Aa = 5, Ey = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Aa, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${Aa}s`, animationDelay: `${(n - Aa).toFixed(2)}s` };
    return (s, o) => (c(), h("span", _y, [
      g("i", { style: a })
    ]));
  }
}, Nr = /* @__PURE__ */ K(Ey, [["__scopeId", "data-v-2a7bc150"]]), Cy = { reviewing: "Under review" }, Ay = (e, t) => e || Cy[t == null ? void 0 : t.state] || "", tt = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Oy = {
  draft: [{ word: "ready", label: "Mark ready" }, tt],
  ready: [tt],
  approved: [{ word: "start", label: "Start", main: !0 }, tt],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, tt],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, tt],
  completed: [],
  cancelled: []
}, Ty = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, tt],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, tt],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, tt],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, tt],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, Ry = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], Iy = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], By = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function Ly(e, t) {
  const n = { plan: Oy, task: Ty }[e], a = t != null && t.state ? Gu(e, t.state) : null;
  return a ? ((n == null ? void 0 : n[Cl(e, t.state)]) ?? []).filter((s) => a.includes(s.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const Ny = (e, t) => e === "doc" || e === "report" ? By(t).map((n) => ({ ...n, word: e === "doc" ? "settle" : n.word })) : e === "agent" ? [...Iy(t), ...Ry(t)] : Ly(e, t), Dr = Rr("/api/docks", "docks"), Q$ = Dr.fetchAll, Kt = Dr.find, Dy = 6, jy = 3, Oa = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, ia = (e) => Date.parse(e.leaves_at) / 1e3, kt = (e) => !!(e.leaves_at && !e.kept), qy = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!kt(e) || t < ia(e) || n.has(e.id)), Py = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => qy(a, t, n)).sort((a, s) => a.id - s.id);
function Fy(e, t, n = Dy) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(ia(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const Wy = (e, t, n = e) => n < 2 ? !1 : e >= jy ? !0 : t, Hy = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), rs = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), Uy = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), zy = (e) => ({ ...e.kept ? rs("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : rs("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), Vy = ["keep", "unkeep", "open", "undock"], Gy = (e) => ({ ...e, iconOnly: Vy.includes(e.action) });
function Ky(e, t) {
  var n;
  return [
    ...Uy(e, t) ? [zy(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Ht(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    rs("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(Gy);
}
function Yy(e, t) {
  const n = Ky(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: Hy(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const Jy = { class: "dock-text" }, Qy = ["title"], Zy = {
  class: "dock-facts",
  "data-dock-facts": ""
}, Xy = { "data-dock-row": "" }, eb = {
  key: 1,
  class: "dock-kept"
}, tb = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, nb = { class: "dock-facts" }, ab = { "data-dock-row": "" }, sb = {
  key: 1,
  class: "dock-kept"
}, ob = { class: "dock-acts" }, lb = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = I(() => Kt(a.item.type)), o = Cr(), l = I(() => er(a.item.created_at, o.value * 1e3)), r = A(null), i = A(null), u = A(null), d = A(null), f = I(() => Yy(a.item, s.value)), m = Ue(), v = I(() => `dock.${a.item.id}`), y = I(() => m.props[v.value].data.value), x = I(() => Vn(a.item.target_model ?? "")), C = I(() => {
      var w;
      return (((w = s.value) == null ? void 0 : w.word) || x.value.replaceAll("-", " ")).replace(/^./, (k) => k.toUpperCase());
    }), _ = I(() => ({ ...y.value, id: a.item.target_id, noun: x.value })), N = () => {
      var w, k;
      return ((k = (w = s.value) == null ? void 0 : w.reads) == null ? void 0 : k.length) && m.reload(v.value);
    };
    tu(il, { data: y, reload: N, readOutput: Or(m) }), ge(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (w, k, p) => {
        var S;
        N();
        const M = (S = m.subscriptions) == null ? void 0 : S.follow(`dock ${a.item.id}`, [`${x.value.replaceAll("-", "_")}.*`], (R) => {
          (!R.row_id || R.row_id === a.item.target_id) && N();
        });
        p(() => M == null ? void 0 : M());
      },
      { immediate: !0 }
    );
    const U = A(/* @__PURE__ */ new Set()), q = A("");
    async function B(w) {
      if (w.action === "undock") return n("undock", w);
      if (w.action === "open") return He(`${a.item.target_model}:${a.item.target_id}`);
      w.action === "declared" && (U.value = /* @__PURE__ */ new Set([...U.value, w.label])), q.value = "";
      const p = await mn(w, { id: a.item.target_id }, m.environment);
      (p == null ? void 0 : p.ok) === !1 && (U.value = new Set([...U.value].filter((M) => M !== w.label)), q.value = `Could not ${w.label.toLowerCase()}: ${p.error}`);
    }
    const F = I(() => f.value.actions.filter((w) => !U.value.has(w.label))), O = I(() => {
      var w;
      return Ay((w = s.value) == null ? void 0 : w.badge, _.value);
    }), T = I(() => f.value.controls.filter((w) => !(a.collapsed && ["keep", "unkeep"].includes(w.action)))), $ = I(() => {
      var w;
      return !!((w = s.value) != null && w.draws_head) && !a.collapsed;
    });
    return (w, k) => {
      var p, M, S, R;
      return c(), W(Lr, {
        label: f.value.title + ((p = s.value) != null && p.needs_user ? ", waiting for you" : ""),
        type: (M = s.value) != null && M.needs_user ? "waiting" : "",
        folded: !!((S = s.value) != null && S.folds) && e.folded,
        body: !!((R = s.value) != null && R.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: k[3] || (k[3] = (P) => e.collapsed && n("open"))
      }, {
        edge: j(() => [
          e.leaving && !e.item.kept ? (c(), W(Nr, {
            key: 0,
            "ends-at": D(ia)(e.item)
          }, null, 8, ["ends-at"])) : E("", !0)
        ]),
        head: j(() => {
          var P;
          return [
            $.value ? (c(), h("span", {
              key: 0,
              ref_key: "head",
              ref: r,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (c(), h(z, { key: 1 }, [
              L(be, {
                name: f.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              g("span", Jy, [
                g("span", {
                  class: "dock-title",
                  title: f.value.title
                }, b(f.value.title), 9, Qy),
                g("span", Zy, [
                  O.value ? (c(), h("span", {
                    key: 0,
                    class: X(["dock-badge", e.item.type.split(".")[1]]),
                    "data-dock-badge": ""
                  }, b(O.value), 3)) : E("", !0),
                  g("span", Xy, b(C.value) + " " + b(e.item.target_id), 1),
                  e.item.kept ? (c(), h("span", eb, "Kept")) : E("", !0)
                ])
              ])
            ], 64)),
            T.value.length ? (c(), h("span", {
              key: 2,
              class: "dock-controls",
              onClick: k[0] || (k[0] = xe(() => {
              }, ["stop"]))
            }, [
              (c(!0), h(z, null, te(T.value, (Q) => {
                var se, ie;
                return c(), h(z, {
                  key: Q.action + Q.runs
                }, [
                  !U.value.has(Q.label) && (!((se = Q.variants) != null && se.length) || !((ie = _.value) != null && ie.state) || Q.variants.includes(_.value.state)) ? (c(), W(de, {
                    key: 0,
                    variant: "icon",
                    class: X({ kept: Q.pressed }),
                    "aria-pressed": Q.pressed,
                    "aria-label": Q.label,
                    title: Q.label,
                    "data-dock-action": Q.action,
                    onClick: (pe) => B(Q)
                  }, {
                    default: j(() => [
                      L(be, {
                        name: Q.icon,
                        size: 13
                      }, null, 8, ["name"])
                    ]),
                    _: 2
                  }, 1032, ["class", "aria-pressed", "aria-label", "title", "data-dock-action", "onClick"])) : E("", !0)
                ], 64);
              }), 128))
            ])) : E("", !0),
            g("span", {
              ref_key: "time",
              ref: d,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (P = s.value) != null && P.leaves_after_seconds ? E("", !0) : (c(), h(z, { key: 0 }, [
                ee(b(l.value), 1)
              ], 64))
            ], 512)
          ];
        }),
        still: j(() => [
          q.value || e.refusal ? (c(), h("p", tb, b(q.value || e.refusal), 1)) : E("", !0)
        ]),
        foot: j(() => {
          var P;
          return [
            g("span", nb, [
              $.value ? (c(), h(z, { key: 0 }, [
                O.value ? (c(), h("span", {
                  key: 0,
                  class: X(["dock-badge", e.item.type.split(".")[1]]),
                  "data-dock-badge": ""
                }, b(O.value), 3)) : E("", !0),
                g("span", ab, b(C.value) + " " + b(e.item.target_id), 1),
                e.item.kept ? (c(), h("span", sb, "Kept")) : E("", !0)
              ], 64)) : E("", !0),
              g("span", {
                ref_key: "foot",
                ref: i,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (P = s.value) != null && P.folds ? (c(), W(de, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: k[1] || (k[1] = (Q) => n("fold"))
            }, {
              default: j(() => [
                ee(b(s.value.folds) + " ", 1),
                L(Mt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : E("", !0),
            g("span", ob, [
              g("span", {
                ref_key: "actions",
                ref: u,
                class: "dock-module-actions"
              }, null, 512),
              L(Fl, {
                name: `dock.${e.item.type}`,
                row: _.value,
                environment: D(m).environment,
                "read-only": D(m).readOnly,
                "object-name": D(Vn)(e.item.target_model),
                "external-failure": "",
                onFailure: k[2] || (k[2] = (Q) => q.value = Q),
                onDone: w.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (c(!0), h(z, null, te(F.value, (Q) => (c(), W(de, {
                key: Q.action + Q.runs,
                small: "",
                variant: Q.primary ? "primary" : "ghost",
                bordered: !Q.primary,
                "data-dock-action": Q.action,
                onClick: (se) => B(Q)
              }, {
                default: j(() => [
                  ee(b(Q.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128))
            ])
          ];
        }),
        default: j(() => {
          var P;
          return [
            (P = s.value) != null && P.body_url ? (c(), W(ls, {
              key: 0,
              declaration: s.value,
              mark: e.item,
              shown: "",
              head: r.value,
              foot: i.value,
              actions: u.value,
              time: d.value,
              folded: e.folded
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded"])) : E("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, Do = /* @__PURE__ */ K(lb, [["__scopeId", "data-v-973f5d66"]]), rb = ["title", "aria-label"], ib = { class: "run-chip-in" }, cb = {
  key: 0,
  class: "run-chip-ring"
}, ub = { class: "run-chip-name" }, db = { class: "run-chip-bar" }, fb = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = Ue(), o = I(() => `run.${a.item.target_id}`), l = I(() => s.props[o.value].data.value), r = I(() => !l.value || l.value.state === "running" || l.value.state === "background"), i = I(() => {
      var m, v;
      return ((m = l.value) == null ? void 0 : m.title) || ((v = l.value) == null ? void 0 : v.line) || a.item.title || "";
    }), u = I(() => r.value ? t.running : t[l.value.state] ?? "var(--text-3)"), d = () => s.reload(o.value);
    let f = null;
    return Te(() => {
      var m;
      d(), f = (m = s.subscriptions) == null ? void 0 : m.follow(`run chip ${a.item.id}`, ["process.*"], (v) => {
        (!v.row_id || v.row_id === a.item.target_id) && d();
      });
    }), Je(() => f == null ? void 0 : f()), (m, v) => {
      var y;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: ye({ "--tone": u.value })
      }, [
        D(kt)(e.item) ? (c(), W(Nr, {
          key: 0,
          "ends-at": D(ia)(e.item)
        }, null, 8, ["ends-at"])) : E("", !0),
        g("span", ib, [
          r.value ? (c(), h("span", cb)) : (c(), W(ht, {
            key: 1,
            name: n[l.value.state] ?? "stop"
          }, null, 8, ["name"])),
          g("span", ub, b(i.value), 1)
        ]),
        g("span", db, [
          g("i", {
            style: ye({ width: r.value ? `${((y = l.value) == null ? void 0 : y.progress) ?? 0}%` : "100%", background: u.value })
          }, null, 4)
        ])
      ], 12, rb);
    };
  }
}, hb = /* @__PURE__ */ K(fb, [["__scopeId", "data-v-226ac6c8"]]), mb = 24, pb = 8, Z$ = 420;
function X$({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= mb ? !0 : e < t && s > pb ? !1 : null;
}
const gb = (e, t) => e === void 0 ? t : e, vb = { me: 1, people: [] }, Yn = fn({
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
  people: vb,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Hn("journal.activity", !0),
  wide: !1,
  sideMini: Hn("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Ul("journal.activity", () => Yn.activity);
Ul("journal.side.mini", () => Yn.sideMini);
const jr = "journal.viewer.";
function yb(e, t, n) {
  try {
    const a = n.getItem(jr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function bb(e, t, n) {
  try {
    n.setItem(jr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function jo(e, t, n = window.localStorage) {
  const a = A(yb(e, t, n));
  return ge(a, (s) => bb(e, s, n), { deep: !0 }), a;
}
const wb = {
  key: "dock-all",
  class: "dock-all"
}, kb = {
  key: "runs-head",
  class: "dock-runs-head"
}, $b = { class: "dock-runs-title" }, xb = { class: "dock-runs-chips" }, Mb = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean },
  setup(e) {
    var k, p;
    const t = e, n = u0(500), a = A(/* @__PURE__ */ new Set()), s = A(!1), o = A(!1), l = Oe(je), r = A(/* @__PURE__ */ new Set()), i = A({});
    async function u(M, S) {
      i.value = { ...i.value, [M.id]: "" }, r.value = /* @__PURE__ */ new Set([...r.value, M.id]);
      const R = await mn(S, { id: M.target_id }, l.environment);
      (R == null ? void 0 : R.ok) === !1 && (r.value = new Set([...r.value].filter((P) => P !== M.id)), i.value = { ...i.value, [M.id]: `Could not dismiss this card: ${R.error}` });
    }
    const d = I(
      () => Py(
        t.items.filter((M) => !r.value.has(M.id)),
        n.value,
        a.value
      )
    ), f = I(
      () => Fy(
        d.value.filter((M) => Oa(M, Kt)),
        n.value
      )
    ), m = I(() => d.value.filter((M) => !f.value.includes(M) && !Oa(M, Kt))), v = I(() => f.value.filter((M) => !kt(M))), y = jo(`dock-size:${((k = Yn.identity) == null ? void 0 : k.root) || location.host}`, null), x = (M) => y.value ? y.value.collapsed && !y.value.opened.includes(M.id) : t.collapsed, C = I(() => d.value.some(x)), _ = I(() => (s.value = Wy(f.value.length, s.value, v.value.length)) && !o.value && !d.value.some(x));
    function N() {
      y.value = { collapsed: !C.value, opened: [] };
    }
    function U(M) {
      var R;
      if (!x(M)) return;
      const S = (R = y.value) != null && R.collapsed ? y.value.opened : [];
      y.value = { collapsed: !0, opened: [...S, M.id] };
    }
    const q = jo(`dock-folded:${((p = Yn.identity) == null ? void 0 : p.root) || location.host}`, {}), B = (M) => {
      var S;
      return !!((S = Kt(M.type)) != null && S.folds) && gb(q.value[M.id], Oa(M, Kt) || t.folded);
    };
    function F(M) {
      q.value = { ...q.value, [M.id]: !B(M) };
    }
    function O(M) {
      q.value = { ...q.value, ...Object.fromEntries(f.value.map((S) => [S.id, S.id !== M.id])) }, o.value = !0;
    }
    function T() {
      q.value = Object.fromEntries(Object.entries(q.value).filter(([M]) => !f.value.some((S) => String(S.id) === M))), o.value = !1;
    }
    function $(M) {
      a.value = /* @__PURE__ */ new Set([...a.value, M.id]);
    }
    function w(M) {
      a.value = new Set([...a.value].filter((S) => S !== M.id));
    }
    return (M, S) => (c(), W(cl, {
      tag: "div",
      name: "dock",
      duration: D(Br),
      class: "dock-stack"
    }, {
      default: j(() => [
        d.value.length > 1 ? (c(), h("div", wb, [
          L(de, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": C.value ? "Open all" : "Collapse all",
            onClick: N
          }, {
            default: j(() => [
              L(Mt, {
                open: !C.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : E("", !0),
        (c(!0), h(z, null, te(m.value, (R) => (c(), W(Do, {
          key: R.id,
          item: R,
          class: X({ timed: D(kt)(R) }),
          leaving: D(kt)(R) && !a.value.has(R.id),
          folded: B(R),
          collapsed: x(R),
          refusal: i.value[R.id],
          onOpen: (P) => U(R),
          onFold: (P) => F(R),
          onUndock: (P) => u(R, P),
          onMouseenter: (P) => $(R),
          onMouseleave: (P) => w(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !C.value ? (c(), h("div", kb, [
          g("span", null, b(f.value.length) + " runs", 1),
          L(de, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: T
          }, {
            default: j(() => [
              S[1] || (S[1] = ee(" Runs ", -1)),
              L(Mt, { open: "" })
            ]),
            _: 1
          })
        ])) : E("", !0),
        (c(!0), h(z, null, te(_.value ? [] : f.value, (R) => (c(), W(Do, {
          key: R.id,
          item: R,
          class: X({ timed: D(kt)(R) }),
          leaving: D(kt)(R) && !a.value.has(R.id),
          folded: B(R),
          collapsed: x(R),
          refusal: i.value[R.id],
          onOpen: (P) => U(R),
          onFold: (P) => F(R),
          onUndock: (P) => u(R, P),
          onMouseenter: (P) => $(R),
          onMouseleave: (P) => w(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        _.value ? (c(), W(Lr, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: j(() => [
            L(be, {
              name: "runs",
              size: 14
            }),
            g("span", $b, b(f.value.length) + " runs", 1)
          ]),
          foot: j(() => [
            g("span", xb, [
              (c(!0), h(z, null, te(f.value, (R) => (c(), W(hb, {
                key: R.id,
                item: R,
                onClick: (P) => O(R)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            L(de, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: S[0] || (S[0] = (R) => o.value = !0)
            }, {
              default: j(() => [
                S[2] || (S[2] = ee(" Runs ", -1)),
                L(Mt)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["label"])) : E("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, ex = /* @__PURE__ */ K(Mb, [["__scopeId", "data-v-990baf5f"]]), xt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, jn = (e) => Math.min(Math.max(e, 0), 1), Sb = (e) => {
  const t = jn(e);
  return t * t * (3 - 2 * t);
}, vt = (e, t, n) => Sb((e - t) / (n - t));
function tx(e) {
  const t = jn(e), n = jn((t - 0.12) / 0.76) * xt.shuffles, a = Math.min(Math.floor(n), xt.shuffles - 1), s = n - a, o = vt(s, 0.26, 0.38) * (1 - vt(s, 0.76, 0.96)), l = vt(s, 0.38, 0.76), r = vt(t, 0, 0.12) * (1 - vt(t, 0.88, 1)), i = vt(s, 0.2, 0.34) * (1 - vt(s, 0.84, 1)), u = Math.sin(Math.PI * jn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / xt.shuffles, lift: xt.lift * o, ready: r, weight: i, follow: u, shuffle: a, phase: s };
}
function nx(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const qo = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, ax = (e) => qo[e] ?? qo.butler, Is = 2400, _b = 0.05;
function Eb({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, _b), l = Math.min(t + Is * o, s), r = e + l * o;
  return r < n ? { y: r, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function sx(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function Cb(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function ox(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const lx = (e, t) => ({ ...e, stretch: t.stretch }), rx = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, qr = (e, t) => t >= (e.least ?? 0);
function ix(e, t, n) {
  if (!qr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const cx = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), Ab = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", Po = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), Ob = (e) => e.right > e.left && e.bottom > e.top;
function ux(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(Ab)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let r = Po(l, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (r = Po(r, i.getBoundingClientRect()), a && (r.bottom = Math.min(r.bottom, a.top))), Ob(r) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: r }] : [];
  });
}
function Pr(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, r = 1;
    for (const [d, f, m] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const v = t[d] - e[d];
      if (Math.abs(v) < 1e-9)
        (e[d] < o[f] || e[d] > o[m]) && (r = -1);
      else {
        const y = (o[f] - e[d]) / v, x = (o[m] - e[d]) / v;
        l = Math.max(l, Math.min(y, x)), r = Math.min(r, Math.max(y, x));
      }
    }
    if (l > r || a && l >= a.share) continue;
    const i = e.x + (t.x - e.x) * l, u = e.y + (t.y - e.y) * l;
    a = { share: l, x: i, y: u, on: "surface", surface: s.id, dx: i - s.left, dy: u - s.top };
  }
  return a;
}
const Ee = {
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
}, sn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Tb = (e) => e * e * (3 - 2 * e), Ae = (e, [t, n]) => Tb(sn(e, t, n)), Rb = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ut = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Tn = ([e, t], n) => e + n() * (t - e);
function Ib(e) {
  return Rb.map(() => {
    const t = Tn(ut.speed, e), n = Tn(ut.angle, e) * Math.PI / 180, a = Tn(ut.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Tn(ut.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const Bb = Ib(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function Lb(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ut.gravity * (t[2] - ut.floor))) / ut.gravity;
}
function dx(e, t, n = Bb) {
  const a = Ee.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = Lb(o, a.from), r = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + r) return null;
  const i = Math.min(s, l), u = a.from.map((d, f) => d + o.velocity[f] * i);
  return u[2] -= ut.gravity * i * i / 2, { at: u, turn: o.spin * i, landed: Math.max(0, s - l) / r };
}
const fx = (e, t) => e && Ee[e.name] ? { name: e.name, u: t / e.frames } : null;
function hx(e, t) {
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
const mx = () => Array.from({ length: Ee.pogo.count }, (e, t) => Ee.pogo.bounce * (t + 1) / Ee.pogo.count), Dt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function px(e, t, n) {
  const { away: a, side: s } = Ee.bug_smash, o = s * a * n, [l, r] = [t.left + Dt.margin * n, t.right - Dt.margin * n], i = Math.min(Math.max(e + o + s * Dt.reach * n, l), r), u = i - o - e, d = i - (s * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [i - t.left, d - t.left] };
}
function gx(e, t, n) {
  const a = Ee.bug_smash, s = Ae(t, a.walk), o = ([l, r]) => l + (r - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Dt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Dt.tall * n * (1 - Ae(t, a.emerge)),
      turn: 90 * (1 - Ae(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Ae(t, a.gone)
    }
  };
}
function vx(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Dt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = Eb({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Be = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function yx(e) {
  const t = Be.least + Math.floor(e() * (Be.most - Be.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Be.walls[Math.floor(e() * Be.walls.length)],
    along: Be.margin + e() * (1 - 2 * Be.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function is(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Be.margin, l = ((e.along - Be.margin + e.way * Be.speed * n / a) / s % 2 + 2) % 2, r = Be.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + r * a, y: t.top + Be.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Be.inset : t.right - Be.inset, y: t.top + r * a, turn: e.wall === "left" ? 90 : -90 };
}
function Nb(e, t) {
  const n = Ee.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = Cb(e, o), r = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), u = e >= a + t * (s - a) ? t : r + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: r, shot: u };
}
function bx(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Ee.bug_shot, { frame: l, bug: r, shot: i } = Nb(n, e.length), u = e.map((_, N) => ({ ...is(_, t, Math.min(n / o.fps, qn(N).shot)), shot: N < i })), d = Ae(l / o.frames, o.aim), [f, m] = [u[Math.max(r - 1, 0)], u[r]], v = e.map((_, N) => ({ bug: _, index: N, seconds: n / o.fps - qn(N).shot, spot: is(_, t, qn(N).shot) })).filter((_) => _.seconds >= 0), y = v.flatMap((_) => {
    const N = (s == null ? void 0 : s.get(_.index)) ?? Fb(_.bug, t, _.spot, s ? [] : a);
    return s == null || s.set(_.index, N), s && Wb(N, _.seconds, a), Hb(N, _.seconds, a);
  }), x = v.filter((_) => qb(_.bug)).map((_) => ({ seconds: _.seconds, from: _.spot })), C = +(e[Math.max(r - 1, 0)].wall === "top") * (1 - d) + +(e[r].wall === "top") * d;
  return { bugs: u, frame: l, target: { x: f.x + (m.x - f.x) * d, y: f.y + (m.y - f.y) * d, back: C }, slush: y, camera: x };
}
function qn(e) {
  const t = Ee.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function wx(e, t, n, a) {
  const { limit: s, margin: o } = Ee.bug_shot.back, [l, r] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((u, d) => {
    const f = qn(d), m = is(u, t, f.shot), v = Math.abs(m.y - n.y) / Math.tan(s * Math.PI / 180), y = m.x === i ? i - l >= r - i ? -1 : 1 : Math.sign(i - m.x), x = Math.abs(m.x - i) >= v ? i : m.x + y * v, C = y > 0 ? Math.max(i, Math.min(x, r)) : Math.min(i, Math.max(x, l)), _ = { from: i, to: C, begin: f.walk, end: f.aim };
    return i = C, _;
  });
}
function kx(e, t, n) {
  var o;
  const a = Ee.bug_shot.back.stride * n;
  let s = 0;
  for (const l of e) {
    if (t <= l.begin) return { x: l.from, steps: s / a, way: 0 };
    if (t < l.end) {
      const r = l.from + (l.to - l.from) * Ae(t, [l.begin, l.end]);
      return { x: r, steps: (s + Math.abs(r - l.from)) / a, way: Math.sign(l.to - l.from) };
    }
    s += Math.abs(l.to - l.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: s / a, way: 0 };
}
const Me = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, Db = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function jb(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const qb = (e) => e.along * 97 % 1 < Me.camera, on = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * Me.gravity * t * t });
function Pb(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * Me.gravity * (t.bottom - e.from.y))) / Me.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * Me.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / Me.gravity, on: "top" });
  const l = s.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let r = e.from;
  for (let u = 0; u < l.t; u += Me.step) {
    const d = Math.min(u + Me.step, l.t), f = on(e, d), m = Pr(r, f, n);
    if (m) return { ...m, t: u + (d - u) * m.share };
    r = f;
  }
  const i = on(e, l.t);
  return { ...l, x: Math.min(Math.max(i.x, t.left), t.right), y: Math.min(Math.max(i.y, t.top), t.bottom) };
}
function Fb(e, t, n, a = []) {
  const s = jb(e.along + 1), [o, l] = Db[e.wall], r = Math.atan2(l, o);
  return Array.from({ length: Me.count }, () => {
    const i = r + (s() - 0.5) * 2 * (Me.spread * Math.PI / 180), u = Me.speed[0] + s() * (Me.speed[1] - Me.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * u, vy: Math.sin(i) * u, r: Me.radius[0] + s() * (Me.radius[1] - Me.radius[0]) };
    return { ...d, ...Pb(d, t, a) };
  });
}
function Wb(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += Me.step) {
      const l = Math.min(o + Me.step, s), r = Pr(on(a, o), on(a, l), n);
      if (r) {
        Object.assign(a, r, { t: o + (l - o) * r.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function Hb(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...on(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - Me.hold) / Me.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((d) => d.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const r = l ? l.left + a.dx : a.x, i = l ? l.top + a.dy : a.y, u = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - i)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: r, y: i, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: u, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function $x(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: r, fps: i } = Ee.bug_shot;
  if (e < 0) return [];
  const u = (s[1] - s[0]) * r / i, d = (o[1] - o[0]) * r / i, f = Ae(e, [0, u]), m = Ae(e, [u, u + d]);
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
function xx(e, t, n, a, s) {
  const { sway: o, above: l } = Ee.chute, r = { x: t.x, y: t.y - l * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [u, d] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], f = (x) => {
    const [C, _] = [x.x - e.at.x, x.y - e.at.y];
    return { x: r.x + C * u - _ * d, y: r.y + C * d + _ * u };
  }, [m, v] = [...n].sort((x, C) => x.x - C.x), y = e.ends.map(f);
  return { left: r.x - e.at.x, top: r.y - e.at.y, middle: r, turn: i, lines: y.map((x, C) => ({ from: x, to: C < y.length / 2 ? m : v })) };
}
const Mx = (e, t) => Ae(t, e.grows) * (1 - Ae(t, e.sinks));
function Jn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: sn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: sn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function Sx(e, t) {
  const n = Ee[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = Jn(n, t), l = 1 - (1 - n.small) * Ae(a, n.shrinks) * (1 - Ae(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = Jn(n, t), o = n.flat * Ae(a, n.squashes) * (1 - Ae(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * sn(s, ...n.springs)) * (1 - sn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const _x = (e) => e === "pack_box";
function Ex(e) {
  const { into: t, out: n } = Jn(Ee.rope_swing, e);
  return 1 - Ae(t, [0, 1]) * (1 - Ae(n, [0, 1]));
}
function Cx(e) {
  const t = Ee.rope_swing, { into: n, out: a } = Jn(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Ae(n, [0, 1]) * (1 - Ae(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const Ub = { after: 3 }, Bs = 10, zb = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, Vb = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, Gb = { weight: 19 }, Fr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, Kb = { every: 120 }, Wr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Hr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, Yb = {
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
}, gn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: Bs }), le = (e, t, n = {}) => gn(e, "clip", t, n), Ta = (e, t, n = {}) => gn(e, "look", t, n), Fo = (e, t, n = {}) => gn(e, "gaze", t, n), ve = (e, t, n = {}, a = {}) => ({ ...gn(e, "pick", t, n), ...a }), ke = (e) => gn("nothing", "nothing", e, {}), Jb = 120, Qb = 300, Ra = (e, t) => ({ ...le(e, t), cooldown: Qb }), ue = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), Zb = () => [le("joy", 2)], yt = (e, t, n, a, s = {}) => ({ ...le(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), bt = (e) => ({ ...e, cooldown: zb[e.name] }), Vt = (e) => ({ ...e, shenanigan: !0, lasts: Vb[e.name] }), ca = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...ue("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [le("nod", 2), ke(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...ue("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...bt(le("bug_shot", 3)), toward: "", onto: !1 },
    { ...bt(le("bug_smash", 2)), toward: "", onto: !1 },
    le("nod", 2)
  ]),
  ...ue("tests_failed", { cooldown: 20, toward: "card" }, [le("startled", 2), le("dismay", 1), le("tantrum", 3), ke(1)]),
  ...ue("committed", { cooldown: 30, toward: "card", onto: !0 }, [le("nod", 2), ke(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...ue("sin_fixed", { cooldown: 300 }, [le("halo", 1), ke(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...ue("sin_committed", { cooldown: 300 }, [le("repent", 1), ke(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...ue("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [le("nod", 4), le("hand_rub", 4), ke(7)]),
  ...ue("question_asked", { cooldown: 60 }, [le("ask_sign", 9), le("look_up", 3), ke(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...ue("reported", { cooldown: 90 }, [Fo("read", 3), le("nod", 1), ke(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...ue("read_message", { cooldown: 30 }, [Fo("read", 3), ke(1)]),
  ...ue("fact_filed", { cooldown: 120 }, [le("file_card", 3), le("nod", 1), ke(6)]),
  ...ue("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [le("nod", 2), ke(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...ue("bar_done", { holds: !0 }, Zb()),
  ...ue("bar_failed", { holds: !0 }, [le("fume", 1), le("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...ue("standing", { cooldown: 12 }, [le("look_left", 2), le("look_right", 2), le("look_up", 1), ke(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...ue("launched", { cooldown: 300 }, [le("tumble", 3), ke(47)]),
  // a break from the hammering now and then
  ...ue("building", { cooldown: 30 }, [le("wipe_brow", 4), le("look_left", 1), le("look_right", 1), ke(69)]),
  ...ue("failed", { cooldown: 20, toward: "card" }, [le("shake", 3), le("tantrum", 2), ke(2)]),
  ...ue("refused", { cooldown: 20 }, [le("shake", 1), ke(1)]),
  ...ue("work_done", { cooldown: 120 }, [le("stretch", 2), ke(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...ue("pondering", { cooldown: [30, 60] }, [ve("ponder", 1)]),
  ...ue("thought_cloud", { cooldown: 90 }, [ve("cloud", 1)]),
  ...ue("light_bulb", { cooldown: 150 }, [ve("bulb", 1)]),
  ...ue("answered", { cooldown: 15 }, [Ta("amused", 3), ke(2)]),
  ...ue("heard", { cooldown: 30 }, [
    le("bow", 1, { voices: ["butler"] }),
    le("salute", 1, { voices: ["squire"] }),
    le("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    ke(1)
  ]),
  ...ue("long_walk", { cooldown: 90 }, [le("stumble", 3), ke(22)]),
  ...ue("card_arrived", { cooldown: 20, toward: "card" }, [le("glance", 7), ke(13)]),
  ...ue("typing", { cooldown: 60 }, [Ta("reading", 1), ke(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(Yb).flatMap(([e, t]) => ue(`reacted:${e}`, {}, [Ta(t, 1)])),
  ...Object.entries(Wr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => ue(`agent_reacted:${n}`, {}, [le(a, 1, { voices: [e] })])[0])),
  ...Object.entries(Hr).flatMap(([e, t]) => ue(`agent_reacted:${e}`, {}, [le(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...ue("pastime", {}, [
    yt("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    yt("rest", 3, 180, 120),
    yt("yawn", 2, 60, 60),
    yt("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    yt("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    yt("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    yt("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...Vt(bt(le("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Vt(bt(le("disco", 2, { ball: "bubble" }))),
    ke(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...ue("held:search", { cooldown: Jb }, [Ra("search", 3), { ...Ra("binoculars", 2), when: { home: !0 } }, { ...Ra("glass_bubble", 2), when: { bubble: !0 } }]),
  ...ue("held:type", {}, [le("type", 3), le("type_ponder", 1)]),
  ...ue("held:compacting", {}, [le("pack_box", 3), le("vacuum", 2), le("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...ue("spell", {}, [ve("writing", 12, { state: "writing" }), ve("reading", 12, { state: "reading" }), ve("searching", 12, { state: "searching" }), ke(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...ue("tickled", {}, [{ ...bt(le("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...ue("eager", {}, [le("eager", 2, { slow: !0 }), ke(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...ue("jump", {}, [Vt(bt(le("backflip", 7, { high: !0 }))), le("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...ue("climb", {}, [ve("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...ue("unit", { cooldown: Fr.build.cooldown }, [ve("unit", Gb.weight), ke(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...ue("progress_jump", { cooldown: 6 }, [le("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...ue("perch", {}, [{ ...ve("hang", 1, { hands: !0, free: !0 }), cooldown: Kb.every }, ve("stand", 5)]),
  // a digit a blow's dust lets out
  ...ue("digit", {}, [ve("0", 1), ve("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...ue("roam", {}, [
    ve("rest", 35, {}, { stay: [25, 60] }),
    ve("seat", 15, {}, { stay: [15, 40] }),
    ve("edge", 25, {}, { stay: [8, 20] }),
    Vt(ve("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    ve("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    ve("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    ve("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    ve("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    ve("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    Vt(bt(ve("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...ue("laptop", {}, [ve("seat", 6, {}, { stay: [60, 150] }), ve("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...ue("ledge_at", {}, [ve("middle", 2, {}, { along: 1 / 2 }), ve("third", 1, {}, { along: 1 / 3 }), ve("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...ue("composed_as", {}, [
    ve("facing", 4, {}, { turn: 0, leans: 0 }),
    ve("turned_left", 1, {}, { turn: 335, leans: 0 }),
    ve("turned_right", 1, {}, { turn: 25, leans: 0 }),
    ve("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    ve("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], Ur = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), zr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), Xb = (e) => Array.isArray(e) ? e[0] : e, ew = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, tw = (e) => ca.some((t) => t.when.moment === e);
function nw(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || zr(d).every(([f, m]) => n(f) >= Xb(m)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = ca.filter((d) => Ur(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), r = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= Ub.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, i = r.filter((d) => {
    var f;
    return d.type === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return i.some((d) => d.type !== "nothing") ? i : r;
}
function Ve(e, t) {
  const n = nw(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (Vr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Vr(e, t, n) {
  var a;
  for (const [s, o] of zr(t)) (a = e.memory) == null || a.set(s, e.now + ew(o, n));
}
function Ax(e, t, n) {
  Vr(e, ca.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const Ox = (e) => Object.values(Fr).find((t) => Ur(t.when, e)) ?? null, aw = (e, t, n) => n - t <= (e.lifetime ?? Bs), Tx = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || qr(e.clip, t));
class Gr {
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
const cs = {
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
}, Rx = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Kr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), Ix = {
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
}, Bx = 120, sw = 20, Lx = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < sw), ow = (e) => cs[e] || cs.idle, Nx = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Yr = "airborne", lw = "landing", rw = "travelling", Jr = "grounded", Dx = ({ airborne: e, landing: t, trip: n }) => e ? Yr : t ? lw : n != null && n.started ? rw : Jr;
function jx(e, t) {
  var s;
  const n = iw(e, t);
  return e.mode === Jr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function iw(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: r, beat: i, state: u, doing: d, doingFacing: f = 0, readingFacing: m = null } = e;
  if (n === Yr && r.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? r.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...cw(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (r.posture === "hang") return { clip: `hang_${r.grip}`, facing: r.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (r.view && u === "asking") return { clip: "point", facing: 0 };
  const v = m !== null && r.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: v ? m : e.composeFacing ?? 0 } : { clip: t(d, r.posture) ? d : ow(u), facing: v ? m : r.posture === "sit" ? r.face : f };
}
function cw(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const us = (e) => e.outcome, uw = "plugin:code-commandments:sins:", Wo = (e) => e.type === "plugins.card" && e.markKey.startsWith(uw), dw = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => Wo(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => Wo(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], qx = (e, t) => e.filter((n) => n.author === "user" && Gn(n.read_at) > t).map((n) => ({ beat: "read_message", time: Gn(n.read_at), card: cr(n) })).sort((n, a) => n.time - a.time), Ho = { user: "reacted", agent: "agent_reacted" };
function Px(e, t) {
  return e.filter((n) => Ho[n.author] && Ct(n) > t).map((n) => ({ beat: `${Ho[n.author]}:${n.emoji}`, time: Ct(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const fw = [.../* @__PURE__ */ new Set([...Object.values(Wr).flatMap((e) => Object.keys(e)), ...Object.keys(Hr)])];
function Fx(e, t) {
  return e.filter((n) => n.author === "agent" && Ct(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = fw.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: Ct(n), card: cr(n) })).sort((n, a) => n.time - a.time);
}
const hw = (e) => new Gr(e).isTest(), Qn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[us(e)] || "";
}, mw = 1800, pw = (e, t) => {
  if (Qn(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && Qn(n) !== "finished" && Number(e.time) - Number(n.time) <= mw ? "tests_fixed" : "tests_passed";
};
function Wx(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(hw), s = a.filter((r) => Qn(r)), o = s.filter((r) => t.get(r.key) === "" || !t.has(r.key) && Number(r.time) > n);
  return a.forEach((r) => t.set(r.key, Qn(r))), o.map((r) => ({ beat: pw(r, s), time: Number(r.time), card: r.key }));
}
function Hx(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(us(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: us(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const Ux = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: Ct(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function zx(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function Vx(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function Gx(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((r) => r.time > t).map((r) => {
    var i;
    return { beat: (i = dw.find((u) => u.matches(r))) == null ? void 0 : i.beat, time: r.time, card: r.key };
  }).filter((r) => r.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((r, i) => r.time - i.time);
}
function Ls(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const Uo = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function gw(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const r = (s + o) / 2;
    Ls(e, t, r, a).pitch > n ? s = r : o = r;
  }
  return (s + o) / 2;
}
function Kx(e, t, n, a = {}) {
  const s = Ve({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : tw(`held:${e}`) ? "idle" : e;
}
const Ie = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function Yx(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Ie.ahead * n ? 180 : Math.sign(a) * Ie.turn;
}
const zo = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function Jx(e, t) {
  const n = Math.min(Ie.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Ie.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Ie.lines, Math.floor((e.bottom - e.top - 2 * a) / Ie.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Ie.sweep) % s, r = o % Ie.sweep, i = Ie.sweep - Ie.returnSeconds, u = zo((r - i) / Ie.returnSeconds), d = r <= i ? zo(r / i) : 1 - u, f = l + ((l + 1) % s - l) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + f * Ie.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Vo = 3, Qr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, Go = 12, Qx = (e, t) => ({ mood: e, began: t, seen: 0 });
function Zx(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!Qr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= Vo ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * Go) / Go, lasts: Vo } };
}
const Xx = (e) => e.posture === "hang" && !Qr(e.face), vw = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), yw = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function e8(e, t, n) {
  return vw.has(e) ? 1 / 0 : !yw.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Zr(n - t.began, t.share) - nt.lead, 0);
}
const bw = 5;
function t8(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= bw ? { beat: "long_walk", time: n } : null };
}
const ww = 30, Rn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function n8(e, t, n, a, s = null) {
  if (t && n < t.until || !Rn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ve({ moment: "spell", state: e, tally: s }, a), [l, r] = Rn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (r - l), next: n + Rn.every } : { state: e, began: 0, until: 0, next: n + Rn.every };
}
const a8 = (e, t, n) => t && n < t.until && Kr.has(e.state) ? { state: t.state, since: t.began } : e, nt = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Zr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function s8(e, t, n, a) {
  var r;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = Zr(o, e.share);
  return s ? { eager: kw(t, l), moment: null } : l > nt.lead ? { eager: t, moment: null } : l < nt.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > nt.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < nt.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((r = Ve({ moment: "eager", slow: !0 }, n)) == null ? void 0 : r.name) === "eager" }, moment: null };
}
function kw(e, t) {
  return e.on && t > nt.lead + nt.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= nt.lead && t >= nt.least ? { ...e, on: !0, calm: !1 } : e;
}
const $w = 1, xw = { look: "look", gaze: "gaze" };
function Mw(e, t, n, a, s = "", o = () => !0, l = null) {
  const r = Ve({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return r ? { [xw[r.type] ?? "clip"]: r.name, toward: r.toward ?? "", onto: !!r.onto, holds: !!r.holds, lifetime: r.lifetime } : null;
}
const Sw = (e, t, n, a, s, o = "", l = () => !0, r = null, i = "") => Ve({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: r, ball: i }, s), _w = (e, t, n, a, s, o = 0) => Ve({ moment: "jump", high: e > $w * t, memory: a, now: s, room: o }, n).name === "backflip", Ew = { work: ["building"], idle: ["standing"] };
function o8(e, t, n, a) {
  const s = cs[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(Ew[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), Kr.has(e) ? { moments: o, began: n || a } : (n && a - n >= ww && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function Cw(e, t, n) {
  return !Ve({ moment: "pondering", memory: e, now: t }, n) || !Ve({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ve({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Ko = { pondering: Cw };
function l8(e, t, n, a, s, o) {
  if (Ko[e.beat]) {
    const r = Ko[e.beat](n.reacted, a, s);
    return r && o(r) ? { beat: { clip: r, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = Mw(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== Bs && { lifetime: l.lifetime } } } : null;
}
function r8(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = Sw(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return i && { clip: i.name, card: "", flies: !!i.flies };
}
const i8 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function c8(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function u8(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const d8 = (e, t) => !!(e != null && e.watches) && !t.once, f8 = 10, h8 = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || aw(a, a.queuedAt, n)), m8 = (e, t) => t ? null : e[0] ?? null;
function p8(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const g8 = (e, t) => !t.during || !e.some((n) => n.during === t.during), Aw = 2 * Math.PI, Ow = 500;
function v8(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), r = l / Ow, i = t && e.point && !!t.behind != !!e.point.behind, u = i && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + r, d) : Math.max(e.amount - r, d), m = Aw * l / 1e3, v = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, x = (u ? v : t != null && t.behind && t.mood === "reading" ? { ...t } : t && v && !i ? s && !t.behind && !v.behind ? Rw(v, t, n, m, s) : Bw(v, t, n, m) : t) ?? v, C = x != null && x.behind && x.mood === "reading" ? Tw(e.point, x, n, l, s) : x;
  return { point: C ?? null, toward: C ? { x: C.x - n.x, y: C.y - n.y } : null, amount: f, at: a };
}
function Tw(e, t, n, a, s) {
  const o = ($) => $ * 180 / Math.PI, l = ($) => o(Math.atan2(Math.sin($ * Math.PI / 180), Math.cos($ * Math.PI / 180))), r = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, u = l(o(Math.atan2(t.x - n.x, -i)) - r), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - r), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), m = f ? l(e.readingFacing - r) : 0, v = f ? e.readingYaw + m : d, y = v + l(u - v), x = Math.min(Math.max(a / 1e3, 0), 0.1), C = Ie.turnSpeed * x, _ = f ? v + Math.min(Math.max(y - v, -C), C) : y, N = f ? e.readingFollow + m : _, U = N + (_ - N) * (1 - Math.exp(-x / Ie.followSeconds)), q = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, B = o(Ls(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), F = Math.min(Math.max(B, -q.up), q.down), O = Ie.tipSpeed * x, T = f ? e.readingPitch + Math.min(Math.max(F - e.readingPitch, -O), O) : F;
  return { ...t, readingYaw: _, readingFollow: U, readingPitch: T, readingFacing: r };
}
function Rw(e, t, n, a, { depth: s, above: o, tip: l }) {
  const r = (N) => {
    const { yaw: U, pitch: q } = Ls(N.x - n.x, s, n.y - N.y, o);
    return { yaw: U, pitch: Math.min(Math.max(q, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [i, u] = [Uo(r(e)), Uo(r(t))], d = Math.acos(Math.min(Math.max(i[0] * u[0] + i[1] * u[1] + i[2] * u[2], -1), 1));
  if (d <= a) return { ...t };
  const f = a / d, [m, v] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [y, x, C] = i.map((N, U) => m * N + v * u[U]), _ = s * y / x;
  return { ...t, x: n.x + _, y: n.y - gw(_, s, -Math.asin(Math.min(Math.max(C, -1), 1)), o) };
}
const Iw = 0.15;
function y8(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= Iw;
}
function Bw(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), r = s + Math.max(-a, Math.min(a, l)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(r), y: n.y + i * Math.sin(r) };
}
const Lw = (e) => !(e != null && e.on);
function b8(e, t, n) {
  if (Lw(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((r) => r.beat === s.beat && r.card === s.card) === o);
  return { answer: [], held: a };
}
const ln = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Xe = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Ia = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Yo = (e) => e * e * (3 - 2 * e);
function Nw(e) {
  if (e < 0 || e >= Xe.seconds) return null;
  const t = Ia(e, ...Xe.flicker), n = Math.floor(t * Xe.flickers * 2) % 2 === 0, a = e < Xe.flicker[1] ? n ? 0.35 + 0.5 * t : Xe.dim : 1;
  return { strength: 1 - Yo(Ia(e, ...Xe.fade)), lit: a, white: e < Xe.flash[0] ? 0 : 1 - Yo(Ia(e, ...Xe.flash)) };
}
const w8 = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function k8(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = Nw(t - e.at);
  return a && { colour: ln.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Xe.signs[e.tone], ...a } };
}
function $8(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function x8(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= ln.looks || a === null && n - e.since >= ln.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function M8(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (r) => (r + a * 12) % 12, o = (r) => 0.5 - 0.5 * Math.max(-1, Math.min(s(r) - 3, 9 - s(r), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const ct = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, S8 = { behind: 39, figure: 40, ahead: 41 }, Dw = "[data-figure-pile]", jw = { amber: [1, 0.69, 0.125], good: ln.colours.good, bad: ln.colours.bad }, Pn = { phases: 4, ms: 230, dim: 0.25 }, _8 = (e, t, n) => e !== "amber" || (t + n) % Pn.phases < Pn.phases / 2 ? 1 : Pn.dim, E8 = (e) => e === "amber" ? Pn.phases : 1;
function C8(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const A8 = Object.keys(jw), Ge = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Yt = ([e, t], n) => e + n() * (t - e);
function O8(e) {
  const t = Ge.least + Math.floor(e() * (Ge.most - Ge.least + 1));
  return Array.from({ length: Math.min(t, Ge.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Ge.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Yt(Ge.start, e), l = Yt(Ge.reach, e);
    return {
      text: Ve({ moment: "digit" }, e).name,
      x: a * o,
      y: Ge.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(Yt(Ge.moveMs, e)),
      fadeMs: Math.round(Yt(Ge.fadeMs, e))
    };
  });
}
const Ba = { high: 3, gap: 1 };
function T8(e) {
  const t = Math.floor(e / Ba.high);
  return { left: -(ct.inside + ct.width / 2 + t * (ct.width + Ba.gap)), up: e % Ba.high * (ct.height - ct.top) };
}
const qw = (e, t, n) => Ve({ moment: "unit", memory: e, now: t }, n) !== null, Pw = { after: 5 }, Fw = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Gr(t).isBuild());
function R8(e, t, n) {
  const a = Fw(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= Pw.after ? s : null;
}
function I8(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: qw(n, a, s) } : null;
}
const Jo = { ahead: 140, up: 70 };
function B8(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Jo.ahead, y: a - Jo.up } } : o ? { at: { x: n(o), y: a - o.up - ct.height } } : t ? { at: null } : null;
}
const La = { least: 4e3, most: 1e4 }, Ww = (e) => La.least + e() * (La.most - La.least), wt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function L8(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = Ww(t);
    if (n.length >= wt.most || t() >= wt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (wt.at[0] + t() * (wt.at[1] - wt.at[0]));
    n.push({ from: o, to: o + wt.ms }), a = o + wt.ms;
  }
}
const N8 = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), D8 = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Xr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), j8 = new Set(ca.filter((e) => Xr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), Hw = (e) => e.some((t) => t.state === "built"), q8 = (e, t) => Hw(t) ? e.filter((n) => !Xr.has(n.beat)) : e, ft = { reach: 40, room: 6 }, Uw = (e, t) => t <= e - ft.reach + 2, P8 = (e, t, n) => Uw(e, n) ? t - ft.reach : e - ft.reach - ft.room, F8 = (e, t, n, a) => a > 0 && t < e && t + ft.reach >= e - 2 ? Math.min(n, Math.max(e, t + ft.reach)) : e, Na = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, W8 = (e) => Yt(e() < Na.longShare ? Na.long : Na.short, e), zw = 2 * ct.width;
function H8(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= zw ? o : e + (o - e + s / 2) % s;
}
const Vw = 60, U8 = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= Vw, Qo = "[data-figure-home]", vn = () => {
  var t;
  const e = document.querySelector(Qo);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Qo)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, Gw = "[data-figure-docked-bars]", Kw = "[data-figure-chat-foot]", Yw = [0.85, 0.6, 0.35, 0.15], Jw = ["question", "waiting", "suggestion"], z8 = (e, t) => Jw.find((n) => e[n] > 0 && t[n] === "behind") || null;
function V8() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const Qw = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Zw = "[data-figure-newest]";
function ei() {
  var a, s;
  const e = (a = vn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Zw), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, r;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Ns(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function rn(e, t, n = ei()) {
  if (!e || !n) return !0;
  const a = ot(e, t), s = da(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Re.top * t.size, bottom: a.top + Re.bottom * t.size }, l = xt.gap;
  return !ua(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function G8(e, t, n, a = ei()) {
  if (!a || rn(t, e, a)) return null;
  const s = da(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, r = Ot(), i = t.posture === "stand" ? js * e.size : ii * e.size, u = Math.max(n.left + i, r.left + o), d = Math.min(n.right - i, r.right - l);
  return [a.left - xt.gap - l, a.right + xt.gap + o].map((m) => ({ ...t, x: m })).filter((m) => m.x >= u && m.x <= d && rn(m, e, a) && Ek(m, e)).sort((m, v) => Math.abs(m.x - t.x) - Math.abs(v.x - t.x))[0] ?? null;
}
const Da = 0.26, ti = 0.54, Xw = 1.25 / 5.4, yn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Da, travels: "stand" },
  lounge: { drop: Da, travels: "stand" },
  composed: { drop: Da, travels: "stand" },
  hang: { drop: ti, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, K8 = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * Xw * Math.cos(t * Math.PI / 180),
  y: 1 - n - ti
}), Zt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), ek = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), Y8 = (e, t) => (e === "sit" ? ek.has(t) : Zt.has(e)) ? e : "stand";
function J8(e, t) {
  return e.facing === t.facing || !Zt.has(e.posture) && !Zt.has(t.posture) ? t : { posture: "stand", facing: Zt.has(e.posture) ? e.facing : t.facing };
}
const Q8 = 0.25, Z8 = (e, t) => Zt.has(e) && yn[t].drop === 0, ni = 2, tk = 90, nk = 180, ak = 140, sk = 280, ok = 420, lk = 0.25, rk = 290, ik = 600, ck = "cubic-bezier(0.2, 0.7, 0.4, 1)", uk = "cubic-bezier(0.55, 0, 0.9, 0.6)", ja = 5;
function Zn(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: r = !1, random: i = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < ja) return null;
  (l || r) && (o = Math.max(o, ni));
  const v = o > 1, y = Math.abs(t.x - e.x), x = y < ja ? 0 : y / (tk * o) * 1e3, C = Math.min(x, v ? ak : nk), _ = Math.abs(t.y - e.y), N = t.y < e.y, U = N && !m && _w(_, n, i, u, d, f), q = N ? ok + Math.min(_, 400) * lk : Math.sqrt(2 * _ / Is) * 1e3, B = {
    x: t.x,
    y: t.y,
    ms: _ > ja ? U ? ik : q : 0,
    lead: U ? rk : N ? sk : 0,
    easing: N ? ck : uk,
    hopping: !0,
    clip: U ? "backflip" : N ? "jump" : "fall"
  }, F = { x: t.x, y: t.y, ms: x + C, lead: 0, easing: "linear", ramp: C, ...v ? { clip: "run" } : {} }, O = m ? dk(t, n) : B, T = N && !a ? [{ ...F, y: e.y }, O] : [{ ...B, x: e.x }, F];
  return { way: Math.sign(t.x - e.x) || 1, legs: T, lands: !s, pace: o, running: v };
}
const dk = (e, t) => ({ x: e.x, y: e.y, ms: Ee.pogo.frames / Ee.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), fk = (e, t) => e.postures.includes(t) ? t : e.postures[0], X8 = (e, t, n) => e.posture === "walk" && n ? "walk" : fk(e.clip, t), ot = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - yn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, ua = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Ns = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Ot() {
  var t;
  const e = (t = vn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const In = 0.5, Zo = 20;
function e3(e, t, n = Ot()) {
  const a = ot(e, t);
  return a.left >= n.left + Zo && a.right <= n.right - Zo;
}
function Ds(e, t, n = Ot()) {
  const a = ot(e, t), s = a.right - a.left, o = da(e), [l, r] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - In && r <= n.right + In && a.top >= n.top - In && i <= n.bottom + In;
}
const Xn = [0.35, 0.5, 0.65], ea = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Re = { left: Xn[0], right: Xn.at(-1), top: ea[0], bottom: ea.at(-1) }, hk = 0.24;
function da(e) {
  if (e.posture === "stand") return { left: Re.left, right: Re.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + hk * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Re.left, t), right: Math.max(Re.right, t) };
}
function mk(e, { size: t }, n = Ot()) {
  const a = da(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const js = (Re.right - Re.left) / 2 + 0.08;
function t3(e, t) {
  return e === "hang" ? Re : { ...Re, bottom: Math.min(Re.bottom, 1 - t - yn[e].drop) };
}
const pk = "[data-figure-agent]";
function ai(e, t, n = "", a = "") {
  var r;
  const s = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !Ns(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const i of [l - 1, l].filter((u) => u >= 0)) {
    if (!o.data[i].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, i), u.setEnd(o, i + 1), [...u.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const si = (e) => ea.flatMap(
  (t) => Xn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function qs(e, t, n = "") {
  if (!rn(e, t)) return Xn.length * ea.length;
  const a = ot(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(Qw)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: i }) => i.width && i.height && ua(s, i) && Ns(r)).map(({ rect: r }) => r), l = (r, i) => o.some((u) => r >= u.left && r <= u.right && i >= u.top && i <= u.bottom);
  return si(s).filter(([r, i]) => l(r, i) || ai(r, i, n)).length;
}
function gk(e, t) {
  const n = ot(e, t);
  return si({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => ai(a, s, "", pk)).length;
}
const Xo = 4;
function n3(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Xo; o <= s; o += Xo)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const r = { ...t, x: l };
      if (!gk(r, e) && rn(r, e)) return r;
    }
  return null;
}
function cn(e, t, n) {
  const a = Ot(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => Ds(l, t, a) && rn(l, t)).map((l) => ({ spot: l, covered: qs(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, r) => r.covered < l.covered || r.covered === l.covered && r.away < l.away ? r : l
  ).spot : null;
}
const oi = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), vk = [0.5, 0.25, 0.75], yk = (e) => oi(e.getBoundingClientRect(), vk), li = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, bk = js, wk = (e, t, { size: n }, a = bk) => ri(e, li[t], a * n, "stand");
function ri(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const kk = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, ii = 0.1, $k = (e, t, { size: n }) => ri(e, kk[t], ii * n, "sit"), xk = (e) => ((e + 180) % 360 + 360) % 360 - 180, qa = 60;
function a3(e, t) {
  const n = xk(t);
  return !e.aside || Math.abs(n) >= qa ? t : n < 0 ? 360 - qa : qa;
}
const Xt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, Mk = (e) => [.../* @__PURE__ */ new Set([e, ...Xt.turns.map((t) => (t + 360) % 360)])];
function s3(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = Mk(t), l = Xt.every[0] + a() * (Xt.every[1] - Xt.every[0]);
  return { face: t, from: s ? Sk(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function Sk(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Xt.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function o3(e, t) {
  const { element: n, edge: a } = fa(), s = ["left", "right"].map((r) => bn($k(a, r, e), e)).filter((r) => n && Ds(r, e) && !qs(r, e)), o = (r) => t ? Math.abs(r.x - t.x) : 0, l = s.sort((r, i) => o(r) - o(i))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function l3(e, t, { size: n }) {
  const a = (Re.right - Re.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - ci } : e;
}
const ci = 7;
function ui() {
  const e = [...document.querySelectorAll(Dw)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function _k(e, t) {
  const n = ot(e, t), a = n.right - n.left;
  return { left: n.left + Re.left * a, right: n.left + Re.right * a, top: n.top + Re.top * a, bottom: n.bottom };
}
function Ek(e, t) {
  const n = ui();
  return !n || !ua(_k(e, t), n);
}
const Ck = 4;
function fa() {
  const e = wn(), t = ui(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > Ck || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - ci - n, 0) } };
}
const r3 = ({ size: e, below: t }) => (1 - t) * e;
function bn(e, t) {
  const n = Ot(), { size: a, below: s } = t, o = yn[e.posture].drop * a;
  return { ...mk(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const ds = (e, t) => Object.keys(li).map((n) => bn(wk(e, n, t), t)), Ps = (e, t) => oi(e, Yw).map((n) => bn(n, t)), di = (e, t, n) => cn(e, t, n) ?? e[0];
function i3(e, t) {
  const { element: n, edge: a } = fa();
  return { ...di(ds(a, e), e, t), view: null, on: n };
}
function c3(e, t, n, a) {
  const { element: s, edge: o } = fa(), l = (a ? ds(o, t) : [...ds(o, t), ...Ps(o, t)]).filter(
    (u) => !ua(ot(u, t), e)
  ), r = cn(
    l.filter((u) => u.x > (e.left + e.right) / 2),
    t,
    n
  ), i = r && !qs(r, t) ? r : cn(l, t, n);
  return i && { ...i, view: null, on: s };
}
function wn() {
  var a;
  const e = vn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(Gw);
  if (!t) return { ...ha(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const el = { within: 2 };
function u3(e) {
  const { element: t, docked: n, edge: a } = wn();
  if (!n || e.on !== t) return !0;
  const s = ha().edge;
  return a.left > s.left + el.within || a.left + a.width < s.left + s.width - el.within;
}
const Ak = "[data-figure-closing]";
function d3() {
  var n;
  const { element: e, docked: t } = wn();
  return t && !!((n = e.firstElementChild) != null && n.matches(Ak));
}
const fi = "[data-figure-progress]";
function f3(e) {
  const t = e.querySelector(fi);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function h3(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const Ok = { across: 300, above: 380, below: 60 };
function m3(e) {
  const { across: t, above: n, below: a } = Ok;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: Tk(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const Tk = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), hi = "[data-figure-bar]", fs = { back: 144, along: 0.4 };
function p3(e) {
  const { element: t, docked: n, edge: a } = wn(), s = n ? t.querySelector(hi) : null;
  if (!(s != null && s.querySelector(fi))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...bn({ x: o - fs.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function g3(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < fs.along * a.size ? t.x + fs.along * a.size : e.x, y: e.y, behind: !0 };
}
function v3(e) {
  const t = e.querySelector(hi), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function ha() {
  const e = vn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function y3(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: r } = ha(), i = n === null ? Rk(r, e, o === null ? t : { x: o, y: r.top }, a, s) : bn({ x: n, y: r.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: l, stays: !0 };
}
function Rk(e, t, n, a, s) {
  const o = Ps(e, t), l = Math.min(...o.map((i) => i.x)), r = o.filter((i) => i.x + a + ct.width < s && i.x + a - ft.reach - ft.room >= l);
  return cn(r.length ? r : o, t, n);
}
const Ik = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function b3(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: r = Math.random, via: i = [], memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  (o || l) && (s = Math.max(s, ni));
  const v = (U) => {
    const q = ot(U, n, yn[U.posture].travels);
    return { x: q.left, y: q.top };
  }, y = t.ladder ?? e.ladder;
  if (y && !(t.ladder && e.ladder)) return Bk(v(e), v(t), v({ ...y.foot, posture: "stand" }), y.way, !!t.ladder, n, s);
  const [x, ...C] = [e, ...i, t].map(v), _ = Zn(x, C[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: r, memory: u, now: d, room: f, pogo: m }), N = C.slice(1).map((U, q) => {
    var B;
    return (B = Zn(C[q], U, n.size, { random: r, memory: u, now: d, room: f })) == null ? void 0 : B.legs.find((F) => F.hopping);
  });
  return _ && { ..._, legs: [..._.legs, ...N.filter(Boolean)] };
}
function Bk(e, t, n, a, s, o, l) {
  const r = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / Ik.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? Zn(e, n, o.size, { pace: l }) : Zn(n, t, o.size, { pace: l }), u = s ? [...(i == null ? void 0 : i.legs) ?? [], r(n, t)] : [r(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: l, running: l > 1 };
}
function w3(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function k3(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && cn(yk(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = fa();
  return { ...di(Ps(s, t), t, n), view: null, on: a };
}
const Lk = "[data-figure-bubble]", Nk = 250;
let en = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), mi = 0;
const Ut = () => en, Pa = /* @__PURE__ */ new WeakMap();
let Dk = 0;
function Fs(e) {
  return Pa.has(e) || Pa.set(e, `floor-${++Dk}`), Pa.get(e);
}
const jk = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, qk = () => {
  var e, t;
  return ((t = (e = vn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Pk(e, t) {
  var a;
  const n = (a = e.querySelector(Kw)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Fk(e, t) {
  const n = e && Pk(e, t), a = e ? [...e.querySelectorAll(Lk)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || jk(l, n))).map(({ element: o, type: l, box: r }) => ({ id: Fs(o), type: l, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const Wk = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= Nk ? (t.top - a.top) / s * 1e3 : 0;
};
function pi(e = en, t = performance.now()) {
  const n = Ot(), a = qk(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: r } = wn(), i = [];
  o && i.push({ id: "home", type: l ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const u = ha();
  return u.element && i.push({ id: Fs(u.element), type: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), i.push(...Fk(a, s)), i.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((d) => Object.freeze({ ...d, vy: Wk(e, d, t) }))) });
}
const hs = /* @__PURE__ */ new Set();
function Hk(e) {
  return hs.add(e), () => hs.delete(e);
}
function Uk() {
  gi();
  const e = () => {
    mi = requestAnimationFrame(e), !document.hidden && (en = pi(en), hs.forEach((t) => t(en)));
  };
  e();
}
function gi() {
  cancelAnimationFrame(mi);
}
const Ws = 5, zk = 56, Vk = { share: 0.6 }, Gk = (e) => -Math.sqrt(2 * Is * Vk.share * e), Pt = (e, t) => e.find((n) => n.id === t) ?? null;
function $3(e, t = pi().floors) {
  const n = Pt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : Fs(e.on) : null, o = s && Pt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function vi({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, r, i = Ut().floors) {
  const u = Pt(i, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: a, face: s };
  return (l || Kk(u, d, o)) && Yk(d, r, i) ? { x: d.x, y: d.y } : null;
}
const Hs = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, Kk = (e, t, n) => !Hs({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function x3(e, t = Ut().floors) {
  if (!Hs(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= Ws && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function Yk(e, t, n = Ut().floors) {
  const a = Pt(n, "home");
  return e.posture === "hang" && a && ot(e, t).bottom >= a.top ? !1 : Ds(e, t);
}
function M3(e, t, n, a = Ut().floors) {
  const s = vi(e, n, a);
  if (!e.home) return Jk(e, t, s, a);
  if (!s) return null;
  const o = Pt(a, "home"), l = s.y - t.y, r = l > Ws ? "dropping" : -l > zk ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: r };
}
function Jk(e, t, n, a) {
  const s = n ? Pt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: Gk(e.risen) };
  if (!n) return null;
  if (Hs(t) && n.y - t.y > Ws) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function S3(e, t, n) {
  const a = js * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function _3(e, t, n, a = Ut().floors) {
  const s = t && vi(t, n, a);
  return s ? { ...e, ...s } : e;
}
const Qk = ["data-type"], Zk = { class: "figure-floor-name" }, Xk = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ye({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      g("span", Zk, b(e.floor.type), 1)
    ], 12, Qk));
  }
}, e2 = /* @__PURE__ */ K(Xk, [["__scopeId", "data-v-4e0f1e2e"]]), t2 = {
  class: "figure-floors",
  "aria-hidden": "true"
}, n2 = {
  __name: "FigureFloors",
  setup(e) {
    const t = Ye(Ut().floors);
    let n = () => {
    };
    return Te(() => {
      n = Hk((a) => t.value = a.floors), Uk();
    }), Le(() => {
      n(), gi();
    }), (a, s) => (c(), h("div", t2, [
      (c(!0), h(z, null, te(t.value, (o) => (c(), W(e2, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, E3 = /* @__PURE__ */ K(n2, [["__scopeId", "data-v-e519168b"]]), Fa = (e) => typeof e == "number" ? e : Date.parse(e);
function C3(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: Fa(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => Fa(s.row.created_at) - Fa(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const a2 = 3, Wa = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function s2(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Wa[n.grouping]) == null ? void 0 : a.call(Wa, e.row, n)) || "";
}
function o2(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function A3(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= a2 ? [o2(a, t)] : a), a = [];
  };
  for (const l of e) {
    const r = s2(l, t);
    r !== s && o(), s = r, r ? a.push(l) : n.push(l);
  }
  return o(), n;
}
function O3(e) {
  const t = Ue(), n = t.option("row"), a = A(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), ge(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function l2(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const T3 = (e) => (t) => t.filter((n) => n.id !== e), R3 = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), I3 = (e) => (t) => [...t, e], B3 = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function L3(e, t = {}) {
  const n = Ue(), a = A(null), s = A("");
  async function o(...l) {
    const r = await n.read(e(...l), t);
    s.value = r.ok ? "" : r.error, r.ok && (a.value = r.value);
  }
  return { value: a, failure: s, load: o };
}
function N3(e) {
  const t = Ue(), n = A("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Bn = /* @__PURE__ */ new Map();
function r2(e, t) {
  if (Bn.has(e)) return Bn.get(e);
  const n = t().finally(() => Bn.delete(e));
  return Bn.set(e, n), n;
}
function D3() {
  const e = Ue(), t = A(null), n = A("");
  async function a() {
    const s = await r2(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const i2 = { class: "cards-page" }, c2 = { class: "cards-bar" }, u2 = { class: "cards-count" }, d2 = { class: "cards" }, f2 = {
  key: 1,
  class: "cards-note"
}, h2 = {
  key: 2,
  class: "cards-note"
}, m2 = ["data-row", "onClick"], p2 = { class: "card-head" }, g2 = { class: "card-title" }, v2 = { class: "card-foot" }, y2 = {
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
    return (a, s) => (c(), h("div", i2, [
      g("div", c2, [
        g("span", u2, b(e.rows.length) + " " + b(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        L(de, Ne({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: j(() => [
            L(be, {
              name: "plus",
              size: 12
            }),
            ee(" New " + b(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      g("div", d2, [
        e.loaded ? e.failure ? (c(), h("p", f2, b(e.failure), 1)) : e.rows.length ? E("", !0) : (c(), h("p", h2, "No " + b(e.noun) + "s yet", 1)) : (c(), W(pt, {
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
          g("span", p2, [
            L(be, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            ee(" " + b(e.head(o)), 1),
            L(Et, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          g("span", g2, b(e.title(o)), 1),
          g("span", v2, b(e.foot(o)), 1)
        ], 8, m2))), 128))
      ]),
      me(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, j3 = /* @__PURE__ */ K(y2, [["__scopeId", "data-v-990e6b37"]]), tl = "newest";
function q3(e, { title: t, isOpen: n = null }) {
  var u;
  const a = (u = Oe(je, null)) == null ? void 0 : u.search, s = A(""), o = A(tl), l = A("all"), r = I(() => {
    const d = s.value.trim().toLowerCase(), f = e.value.filter((m) => l2(m, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(m) === (l.value === "open")));
    return o.value === tl ? f : [...f].sort((m, v) => t(m).localeCompare(t(v)));
  }), i = I(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: r, filtering: i, hasStates: !!n };
}
const b2 = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, w2 = 40, k2 = "top", $2 = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, a = (f = Oe(je, null)) == null ? void 0 : f.autoScroll, s = I(() => a === k2), o = A(null), l = A(!1), r = (m) => s.value ? m.scrollTop : m.scrollHeight - m.scrollTop - m.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function d() {
      l.value = r(o.value) >= w2;
    }
    return ge(() => n.rowCount, async () => {
      await Qe(), !l.value && o.value && (o.value.scrollTop = i());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (m, v) => (c(), h("div", b2, [
      g("div", {
        ref_key: "pane",
        ref: o,
        class: X(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        me(m.$slots, "default", {}, void 0, !0)
      ], 34),
      L(Ft, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: j(() => [
          De(g("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: u
          }, [
            L(be, {
              name: s.value ? "up" : "down"
            }, null, 8, ["name"]),
            v[0] || (v[0] = ee(" Newest ", -1))
          ], 512), [
            [dl, l.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, P3 = /* @__PURE__ */ K($2, [["__scopeId", "data-v-3accb764"]]), x2 = ["aria-selected", "data-tab", "onClick"], M2 = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, S2 = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Oe(je, null), o = I(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = A(null), r = A({ left: 0, width: 0, slides: !1 }), i = (m) => n.answer[m.count_field] !== void 0;
    function u(m) {
      var y;
      const v = (y = l.value) == null ? void 0 : y.querySelector(".inner-tab.on");
      if (!v) return void (r.value = { left: 0, width: 0, slides: !1 });
      r.value = { left: v.offsetLeft, width: v.offsetWidth, slides: m }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, v.offsetLeft - 12));
    }
    const d = () => Qe(() => u(!0));
    let f = null;
    return Te(() => {
      var m;
      u(!1), f = new ResizeObserver(() => u(!1)), f.observe(l.value), (m = document.fonts) == null || m.ready.then(() => u(!1));
    }), Le(() => f == null ? void 0 : f.disconnect()), ge(() => {
      var m;
      return (m = n.active) == null ? void 0 : m.key;
    }, d), ge(() => n.answer, d, { deep: !0 }), (m, v) => (c(), h("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (c(!0), h(z, null, te(o.value, (y) => {
        var x, C;
        return c(), h("button", {
          key: y.key,
          type: "button",
          role: "tab",
          class: X(["inner-tab", { on: ((x = e.active) == null ? void 0 : x.key) === y.key }]),
          "aria-selected": ((C = e.active) == null ? void 0 : C.key) === y.key,
          "data-tab": y.key,
          onClick: (_) => a("choose", y)
        }, [
          ee(b(y.label) + " ", 1),
          i(y) ? (c(), h("span", M2, b(e.answer[y.count_field]), 1)) : E("", !0)
        ], 10, x2);
      }), 128)),
      g("i", {
        class: X(["inner-tabs-line", { slides: r.value.slides }]),
        style: ye({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, F3 = /* @__PURE__ */ K(S2, [["__scopeId", "data-v-63fcd326"]]), _2 = {
  class: "tab-body",
  "data-tab-body": ""
}, E2 = { "data-tab-content": "" }, C2 = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = A(!1);
    let a = 0;
    return ge(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, ys(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (c(), h("div", _2, [
      n.value ? (c(), W(pt, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : E("", !0),
      De(g("div", E2, [
        me(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [dl, !n.value]
      ])
    ]));
  }
}, W3 = /* @__PURE__ */ K(C2, [["__scopeId", "data-v-63876533"]]), A2 = {}, O2 = { class: "menu-label" };
function T2(e, t) {
  return c(), h("span", O2, [
    me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ms = /* @__PURE__ */ K(A2, [["render", T2], ["__scopeId", "data-v-aa955b3e"]]), R2 = {
  class: "search-bar",
  "data-search-bar": ""
}, I2 = { class: "search-bar-control" }, B2 = ["value", "placeholder", "aria-label"], L2 = ["aria-expanded"], N2 = {
  key: 0,
  "data-menu-count": ""
}, D2 = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var _;
    const a = e, s = n, o = Ri(), l = ((_ = Oe(je, null)) == null ? void 0 : _.search) ?? {}, r = I(() => l.placeholder || a.placeholder), i = l.context ?? [], u = A(null), d = A(null), f = A([]), m = I(() => f.value.length ? f.value[f.value.length - 1].next : i), v = I(() => !!o.menu || i.length > 0), y = (N) => {
      f.value = [], d.value = d.value ? null : N.currentTarget;
    };
    function x(N) {
      if (N.next.length) {
        f.value = [...f.value, N];
        return;
      }
      d.value = null, s("pick", N.click);
    }
    function C() {
      var N;
      s("update:modelValue", ""), (N = u.value) == null || N.focus();
    }
    return t({ focus: () => {
      var N;
      return (N = u.value) == null ? void 0 : N.focus();
    } }), (N, U) => {
      var q;
      return c(), h("div", R2, [
        g("div", I2, [
          L(be, {
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
            onInput: U[0] || (U[0] = (B) => s("update:modelValue", B.target.value)),
            onKeydown: jt(C, ["esc"])
          }, null, 40, B2),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: C
          }, [
            L(be, {
              name: "close",
              size: 12
            })
          ])) : E("", !0),
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
            e.menuCount ? (c(), h("span", N2, b(e.menuCount), 1)) : E("", !0),
            L(be, {
              name: "caret",
              size: 12
            })
          ], 8, L2)) : E("", !0)
        ]),
        (q = D(l).button) != null && q.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: U[1] || (U[1] = (B) => s("pick", D(l).button.click))
        }, b(D(l).button.title), 1)) : E("", !0),
        me(N.$slots, "default", {}, void 0, !0),
        d.value ? (c(), W(sa, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: U[3] || (U[3] = xe(() => {
          }, ["stop"])),
          onClose: U[4] || (U[4] = (B) => d.value = null)
        }, {
          default: j(() => [
            f.value.length ? (c(), W(_t, {
              key: 0,
              "data-search-back": "",
              onClick: U[2] || (U[2] = (B) => f.value = f.value.slice(0, -1))
            }, {
              default: j(() => [
                ee("‹ " + b(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : E("", !0),
            (c(!0), h(z, null, te(m.value, (B) => (c(), W(_t, {
              key: B.title,
              description: B.subtext,
              "data-search-entry": B.title,
              onClick: (F) => x(B)
            }, {
              default: j(() => [
                ee(b(B.title) + b(B.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? E("", !0) : me(N.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : E("", !0)
      ]);
    };
  }
}, j2 = /* @__PURE__ */ K(D2, [["__scopeId", "data-v-45374bed"]]), q2 = {
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
    return (o, l) => (c(), W(j2, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (r) => e.tools.words.value = r),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (r) => n("pick", r))
    }, {
      menu: j(() => [
        L(ms, null, {
          default: j(() => [...l[2] || (l[2] = [
            ee("Order", -1)
          ])]),
          _: 1
        }),
        (c(), h(z, null, te(a, (r) => L(_t, {
          key: r.key,
          checked: e.tools.order.value === r.key,
          "data-list-order": r.key,
          onClick: (i) => e.tools.order.value = r.key
        }, {
          default: j(() => [
            ee(b(r.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (c(), h(z, { key: 0 }, [
          L(ms, null, {
            default: j(() => [...l[3] || (l[3] = [
              ee("Show", -1)
            ])]),
            _: 1
          }),
          (c(), h(z, null, te(s, (r) => L(_t, {
            key: r.key,
            checked: e.tools.state.value === r.key,
            "data-list-state": r.key,
            onClick: (i) => e.tools.state.value = r.key
          }, {
            default: j(() => [
              ee(b(r.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : E("", !0)
      ]),
      default: j(() => [
        me(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, H3 = /* @__PURE__ */ K(q2, [["__scopeId", "data-v-dab0064d"]]);
function U3() {
  const e = A(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const z3 = (e) => import(
  /* @vite-ignore */
  e
), P2 = 86400, ps = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function F2(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((ps(t) - ps(e)) / P2);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function V3(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = ps(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: F2(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Ha = 280, Ua = 240, za = 120, W2 = 6, H2 = 14, un = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function U2(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function yi(e, t) {
  const n = Math.max(0, U2(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function z2(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${H2}px)` }), e.offsetHeight, e.style.transition = `height ${Ha}ms ${un}`, e.style.height = `${l}px`;
  const r = s();
  let i = !1, u = !1;
  const d = () => {
    u || (u = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (u) return;
    n() && (t.scrollTop = yi(t, e));
    const m = s() - r;
    if (!i && m >= Ha && (i = !0, e.style.transition = `opacity ${Ua}ms ease-out, transform ${Ua}ms ${un}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), m < Ha + Ua) return a(f);
    d();
  };
  return a(f), d;
}
function G3(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${W2}px)` }), e.offsetHeight, e.style.transition = `opacity ${za}ms ease-out, transform ${za}ms ${un}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), r = () => {
    if (n() && (t.scrollTop = yi(t, e)), s() - l < za) return a(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(r);
}
const V2 = 140, Ln = 220, nl = 5;
function K3({ gap: e = V2, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function r(d, f) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), f();
    });
  }
  function i() {
    const d = n.splice(0, nl);
    if (s = d.length > 0, !s) return;
    let f = d.length;
    for (const m of d)
      m.el.style.display = m.display, r(m, () => {
        f -= 1, f || (o = t(i, e));
      });
  }
  const u = (d, f, m, v = z2) => {
    if (l || !f.pane || !f.follows()) return m();
    const y = { el: d, options: f, done: m, arrival: v, display: d.style.display || "" };
    if (!s)
      return s = !0, r(y, () => o = t(i, e));
    d.style.display = "none", n.push(y), n.length >= nl && u.flush();
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
function Y3(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Ln}ms ${un}, opacity ${Ln}ms ease-in, margin ${Ln}ms ${un}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Ln);
}
const bi = "chat.pins.minimised", Fn = A(Hn(bi, !1));
function al(e) {
  Fn.value = e, Es(bi, e);
}
function G2(e) {
  const t = I(() => e()), n = I(() => Fn.value ? [] : e()), a = () => al(!Fn.value), s = Date.now() / 1e3;
  return ge(
    () => t.value.filter((o) => Ct(o) > s).length,
    (o, l) => o > l && al(!1)
  ), { pins: t, visible: n, minimised: Fn, toggle: a };
}
const K2 = ["title"], Y2 = {
  key: 0,
  class: "pins-count"
}, J2 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = G2(() => t.pinRows);
    return (o, l) => D(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: X(["pins-toggle", { minimised: D(a), inline: e.inline }]),
      title: D(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = xe((...r) => D(s) && D(s)(...r), ["stop"]))
    }, [
      L(be, {
        name: D(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      D(a) ? (c(), h("span", Y2, b(D(n).length), 1)) : E("", !0)
    ], 10, K2)) : E("", !0);
  }
}, J3 = /* @__PURE__ */ K(J2, [["__scopeId", "data-v-d073c504"]]), Q2 = ["title"], Z2 = ["title"], X2 = { class: "diff-card-dir" }, e5 = { class: "diff-card-name" }, t5 = ["title"], n5 = ["title"], a5 = {
  key: 0,
  class: "diff-card-note"
}, s5 = ["href"], o5 = ["src", "alt"], l5 = { class: "diff-card-rows" }, r5 = { class: "diff-row-num" }, i5 = { class: "diff-row-sign" }, c5 = { class: "diff-row-code" }, u5 = {
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
    const l = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, i = I(() => n.path.lastIndexOf("/") + 1), u = I(() => n.path.slice(0, i.value)), d = I(() => n.path.slice(i.value)), f = I(() => n.change === "deleted"), m = I(() => l[n.change]), v = I(() => new Set(n.rows.filter((w) => w.line_type === "add").map((w) => w.line))), y = A("after"), x = I(() => y.value === "before" ? n.whole.old : n.whole.text), C = I(() => n.whole && n.whole.text !== void 0 ? x.value.split(`
`).map((w, k) => ({ line_type: y.value === "after" && v.value.has(k + 1) ? "add" : "ctx", line: k + 1, text: w })) : n.rows.filter(
      (w) => !(n.editsOnly && ["ctx", "fold"].includes(w.line_type)) && !(n.hideRemovals && w.line_type === "del")
    )), _ = A(!1), N = I(() => n.lines && !_.value && !n.whole), U = I(() => N.value ? C.value.slice(0, n.lines) : C.value), q = I(() => C.value.length - U.value.length), B = (w) => w.line === null || w.line_type === "del" ? "" : w.line, F = (w) => w.line_type === "fold" ? w.hidden ? `⋯ ${w.hidden} lines` : "⋯" : w.text, O = A(null), T = A(null);
    let $ = null;
    return Te(() => {
      if (!T.value) return;
      let w = !0;
      $ = new ResizeObserver(() => {
        !O.value || !T.value || (O.value.style.transition = w ? "none" : "", O.value.style.height = `${T.value.offsetHeight}px`, w = !1);
      }), $.observe(T.value);
    }), Le(() => $ && $.disconnect()), (w, k) => (c(), h("section", {
      class: X(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      g("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: k[2] || (k[2] = (p) => !f.value && a("fold"))
      }, [
        g("span", {
          class: "diff-card-path",
          title: `${e.path} · ${D(s)}-click to open it`,
          onClick: o
        }, [
          g("span", X2, b(u.value), 1),
          g("span", e5, b(d.value), 1),
          m.value ? (c(), h("span", {
            key: 0,
            class: X(["diff-card-badge", e.change])
          }, b(m.value), 3)) : E("", !0)
        ], 8, Z2),
        g("span", {
          class: X(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + b(e.added), 3),
        g("span", {
          class: X(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + b(e.removed), 3),
        L(Et, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: y.value === "after" ? "Show the file before" : "Show the file after",
          onClick: k[0] || (k[0] = xe((p) => y.value = y.value === "after" ? "before" : "after", ["stop"]))
        }, b(y.value === "after" ? "After" : "Before"), 9, t5)) : E("", !0),
        f.value ? E("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: X(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: k[1] || (k[1] = xe((p) => a("whole"), ["stop"]))
        }, [
          L(be, {
            name: "file",
            size: 12
          })
        ], 10, n5))
      ], 8, Q2),
      e.whole && e.whole.error ? (c(), h("p", a5, b(e.whole.error), 1)) : E("", !0),
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
          }, null, 8, o5)
        ], 8, s5)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: O,
          class: "diff-card-grow"
        }, [
          g("div", {
            ref_key: "body",
            ref: T,
            class: "diff-card-diff"
          }, [
            g("div", l5, [
              (c(!0), h(z, null, te(U.value, (p, M) => (c(), h("div", {
                key: M,
                class: X(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                g("span", r5, b(B(p)), 1),
                g("span", i5, b(r[p.line_type]), 1),
                g("span", c5, b(F(p)), 1)
              ], 2))), 128)),
              q.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: k[3] || (k[3] = xe((p) => _.value = !0, ["stop"]))
              }, b(q.value) + " more " + b(q.value === 1 ? "line" : "lines"), 1)) : E("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : E("", !0)
    ], 2));
  }
}, Q3 = /* @__PURE__ */ K(u5, [["__scopeId", "data-v-23581cbb"]]), d5 = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), W(de, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: s[0] || (s[0] = (o) => n("back"))
    }, {
      default: j(() => [
        L(be, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, f5 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, h5 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, m5 = { class: "ask-text" }, p5 = ["placeholder", "aria-label"], g5 = ["placeholder", "aria-label"], v5 = {
  key: 3,
  class: "moves"
}, y5 = {
  __name: "RowMoves",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = I(() => Ny(a.noun, a.row)), l = A(""), r = A(null), i = A(""), u = A("");
    ge(() => a.id, () => {
      l.value = "", r.value = null;
    });
    async function d(v, y = "") {
      const x = await a.read([v.noun ?? a.noun, v.word, String(a.id), ...v.flag ? [v.flag, y] : v.positional ? [y] : [], ...v.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      l.value = x.ok ? "" : x.error, x.ok && (r.value = null, i.value = "", u.value = "", s("done"));
    }
    const f = (v) => v.confirm ? r.value = v : v.said ? d(v, v.said) : v.flag || v.positional ? (r.value = v, i.value = "") : d(v), m = () => i.value.trim() && d(r.value, i.value.trim());
    return t({ moves: o, press: f }), (v, y) => o.value.length ? (c(), W(Er, {
      key: 0,
      inline: e.inline
    }, {
      default: j(() => {
        var x;
        return [
          l.value ? (c(), h("p", f5, b(l.value), 1)) : E("", !0),
          (x = r.value) != null && x.confirm ? (c(), h("div", h5, [
            g("span", m5, b(r.value.confirm), 1),
            L(de, {
              small: "",
              variant: r.value.danger ? "ghost" : "primary",
              bordered: r.value.danger,
              class: X({ danger: r.value.danger }),
              "data-resource-confirm-yes": "",
              onClick: y[0] || (y[0] = (C) => d(r.value))
            }, {
              default: j(() => [
                ee(b(r.value.label), 1)
              ]),
              _: 1
            }, 8, ["variant", "bordered", "class"]),
            L(de, {
              small: "",
              variant: "ghost",
              onClick: y[1] || (y[1] = (C) => r.value = null)
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
            onSubmit: xe(m, ["prevent"])
          }, [
            De(g("input", {
              "onUpdate:modelValue": y[2] || (y[2] = (C) => i.value = C),
              class: "ask-input",
              placeholder: r.value.ask,
              "aria-label": r.value.ask,
              onKeydown: y[3] || (y[3] = jt(xe((C) => r.value = null, ["stop"]), ["esc"]))
            }, null, 40, p5), [
              [St, i.value]
            ]),
            r.value.opener ? De((c(), h("input", {
              key: 0,
              "onUpdate:modelValue": y[4] || (y[4] = (C) => u.value = C),
              class: "ask-input",
              "data-resource-opener": "",
              placeholder: r.value.opener,
              "aria-label": r.value.opener,
              onKeydown: y[5] || (y[5] = jt(xe((C) => r.value = null, ["stop"]), ["esc"]))
            }, null, 40, g5)), [
              [St, u.value]
            ]) : E("", !0),
            L(de, {
              small: "",
              variant: "primary",
              type: "submit",
              disabled: !i.value.trim()
            }, {
              default: j(() => [
                ee(b(r.value.label), 1)
              ]),
              _: 1
            }, 8, ["disabled"]),
            L(de, {
              small: "",
              variant: "ghost",
              onClick: y[6] || (y[6] = (C) => r.value = null)
            }, {
              default: j(() => [...y[8] || (y[8] = [
                ee("Back", -1)
              ])]),
              _: 1
            })
          ], 32)) : (c(), h("div", v5, [
            (c(!0), h(z, null, te(o.value, (C) => (c(), W(de, {
              key: C.word,
              small: !C.bordered,
              bordered: C.bordered,
              icon: C.icon,
              variant: C.main ? "primary" : "ghost",
              class: X({ danger: C.danger }),
              "data-move": C.word,
              onClick: (_) => f(C)
            }, {
              default: j(() => [
                ee(b(C.label), 1)
              ]),
              _: 2
            }, 1032, ["small", "bordered", "icon", "variant", "class", "data-move", "onClick"]))), 128))
          ]))
        ];
      }),
      _: 1
    }, 8, ["inline"])) : E("", !0);
  }
}, b5 = /* @__PURE__ */ K(y5, [["__scopeId", "data-v-bdac0207"]]), w5 = /* @__PURE__ */ new Set(["completed", "cancelled"]), k5 = (e) => w5.has(e), dn = (e) => k5(e) ? "done" : e, $5 = { class: "facts" }, x5 = { class: "fact wide" }, M5 = ["title"], S5 = {
  key: 1,
  class: "fact-value"
}, _5 = {
  key: 0,
  class: "fact"
}, E5 = { class: "fact-value" }, C5 = { class: "fact" }, A5 = { class: "fact-label" }, O5 = ["title"], T5 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, R5 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, I5 = {
  key: 2,
  class: "fact"
}, B5 = { class: "fact-value" }, L5 = { class: "fact wide" }, N5 = { class: "fact wide" }, D5 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, j5 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = Kn.map(({ key: l, label: r }) => ({ key: String(l), label: r })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, r) => {
      var i, u;
      return c(), h("div", $5, [
        g("div", x5, [
          r[4] || (r[4] = g("span", { class: "fact-label" }, "Plan", -1)),
          (i = e.place) != null && i.plan_id ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: r[0] || (r[0] = (d) => D(He)(`plans:${e.place.plan_id}`))
          }, "Plan " + b(e.place.plan_id) + ": " + b(e.place.plan_title), 9, M5)) : (c(), h("span", S5, "Not in a plan"))
        ]),
        ((u = e.place) == null ? void 0 : u.phase_total) > 1 ? (c(), h("div", _5, [
          r[5] || (r[5] = g("span", { class: "fact-label" }, "Phase", -1)),
          g("span", E5, b(e.place.phase_number) + " of " + b(e.place.phase_total) + ": " + b(e.place.phase_title), 1)
        ])) : E("", !0),
        e.task.helper_id ? (c(), h(z, { key: 1 }, [
          g("div", C5, [
            g("span", A5, b(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            g("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: r[1] || (r[1] = (d) => D(He)(`agents:${e.task.helper_id}`))
            }, b(e.task.helper_name), 9, O5)
          ]),
          D(o).has(e.task.state) ? (c(), h("p", T5, b(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (c(), h("p", R5, b(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : E("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (c(), h("div", I5, [
          r[6] || (r[6] = g("span", { class: "fact-label" }, "Assigned to", -1)),
          g("span", B5, "Agent " + b(e.task.holder_id), 1)
        ])) : E("", !0),
        g("div", L5, [
          r[7] || (r[7] = g("span", { class: "fact-label" }, "Complexity", -1)),
          L(qt, {
            options: D(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: r[2] || (r[2] = (d) => s("complexity", d))
          }, null, 8, ["options", "value"]),
          r[8] || (r[8] = g("span", { class: "fact-label" }, "1: a few lines. 5: a design with risk.", -1))
        ]),
        g("div", N5, [
          r[9] || (r[9] = g("span", { class: "fact-label" }, "Priority", -1)),
          L(qt, {
            options: D(n),
            value: String(D(_r)(e.task.priority)),
            "data-task-priority": "",
            onPick: r[3] || (r[3] = (d) => s("priority", d))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", D5, b(e.refusal), 1)) : E("", !0)
        ])
      ]);
    };
  }
}, q5 = /* @__PURE__ */ K(j5, [["__scopeId", "data-v-81d598cf"]]);
function P5(e, t) {
  const n = new Map(t.tasks.map((i) => [i.id, i])), a = (i) => t.edges.filter(([, u]) => u === i).map(([u]) => u), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let i = a(e); i.length; i = [...new Set(i.flatMap(a))].filter((u) => !s.has(u)))
    i.forEach((u) => s.add(u)), o.push(i.map((u) => n.get(u)));
  const l = [], r = /* @__PURE__ */ new Set([e]);
  for (let i = t.edges.find(([u]) => u === e); i && !r.has(i[1]); i = t.edges.find(([u]) => u === i[1]))
    r.add(i[1]), l.push(n.get(i[1]));
  return { above: o.reverse(), below: l };
}
const F5 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, W5 = { ...F5, done: "Completed" }, H5 = { class: "task-status-icon" }, U5 = ["width", "height", "aria-label"], z5 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = I(() => Cl("task", dn(t.status))), a = I(() => n.value === "testing" ? "started" : n.value), s = I(() => W5[t.status] ?? Ms("task", t.status));
    return (o, l) => (c(), h("span", H5, [
      L(Ft, {
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
            L(Wt, { value: a.value }, {
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
          ], 10, U5))
        ]),
        _: 1
      })
    ]));
  }
}, Us = /* @__PURE__ */ K(z5, [["__scopeId", "data-v-ae24a63f"]]), V5 = { class: "number" }, G5 = { class: "title" }, K5 = { class: "word" }, Y5 = {
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
    return (a, s) => (c(), W(mt(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: X(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: j(() => [
        L(Us, { status: e.status }, null, 8, ["status"]),
        g("span", V5, b(e.number), 1),
        g("span", G5, b(e.title), 1),
        g("span", K5, b(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Va = /* @__PURE__ */ K(Y5, [["__scopeId", "data-v-f6417ae8"]]), J5 = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, Q5 = { class: "level" }, Z5 = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = A(!1);
    ge(() => n.task.id, () => s.value = !1);
    const o = I(() => P5(n.task.id, n.graph)), l = I(() => s.value ? o.value.above : o.value.above.slice(-1)), r = I(() => s.value ? o.value.below : o.value.below.slice(0, 1)), i = I(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), u = (f) => f.slice(0, 1).toUpperCase() + f.slice(1), d = (f, m = !1) => ({ status: dn(f.state), number: f.id, title: f.title, word: m ? "This task" : u(f.state), current: m });
    return (f, m) => o.value.above.length || o.value.below.length ? (c(), h("section", J5, [
      m[5] || (m[5] = g("h4", null, "What waits on what", -1)),
      (c(!0), h(z, null, te(l.value, (v) => (c(), h(z, {
        key: v.map((y) => y.id).join()
      }, [
        g("div", Q5, [
          (c(!0), h(z, null, te(v, (y) => (c(), W(Va, Ne({
            key: y.id,
            ref_for: !0
          }, d(y), {
            onSelect: m[0] || (m[0] = (x) => a("select", x))
          }), null, 16))), 128))
        ]),
        m[3] || (m[3] = g("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      L(Va, Ii(Bi(d(e.task, !0))), null, 16),
      (c(!0), h(z, null, te(r.value, (v) => (c(), h(z, {
        key: v.id
      }, [
        m[4] || (m[4] = g("div", { class: "waits" }, "↓ waits on", -1)),
        L(Va, Ne({ ref_for: !0 }, d(v), {
          onSelect: m[1] || (m[1] = (y) => a("select", y))
        }), null, 16)
      ], 64))), 128)),
      i.value ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: m[2] || (m[2] = (v) => s.value = !s.value)
      }, b(s.value ? "Show less" : `Show the whole chain (${i.value} more)`), 1)) : E("", !0)
    ])) : E("", !0);
  }
}, X5 = /* @__PURE__ */ K(Z5, [["__scopeId", "data-v-db05c4b2"]]), e4 = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, t4 = ["datetime"], n4 = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (c(), h("section", e4, [
      n[0] || (n[0] = g("h3", null, "Block history", -1)),
      (c(!0), h(z, null, te(e.renewals, (a) => (c(), h("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        g("time", {
          datetime: a.created_at
        }, b(new Date(a.created_at).toLocaleString()), 9, t4),
        g("p", null, b(a.reason), 1)
      ]))), 128))
    ])) : E("", !0);
  }
}, a4 = /* @__PURE__ */ K(n4, [["__scopeId", "data-v-b41f213b"]]), s4 = {
  class: "part",
  "data-resource-waits": ""
}, o4 = ["onClick"], l4 = { class: "wait-id" }, r4 = { class: "wait-title" }, i4 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", s4, [
      g("h4", null, b(e.title), 1),
      (c(!0), h(z, null, te(e.waits, (o) => (c(), h("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        L(Us, {
          status: D(dn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        g("span", l4, b(o.id), 1),
        g("span", r4, b(o.title), 1)
      ], 8, o4))), 128))
    ]));
  }
}, sl = /* @__PURE__ */ K(i4, [["__scopeId", "data-v-8fb2e251"]]), c4 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, u4 = { class: "text" }, d4 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, f4 = 180, h4 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = A(!1), l = I(() => a.task.waits.filter((i) => !n.has(i.state))), r = I(() => a.task.waits.filter((i) => n.has(i.state)));
    return (i, u) => (c(), h(z, null, [
      l.value.length ? (c(), W(sl, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: u[0] || (u[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : E("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", c4, [
        u[3] || (u[3] = g("h4", null, "How it was done", -1)),
        g("p", u4, b(e.task.outcome), 1)
      ])) : E("", !0),
      e.task.brief ? (c(), h("section", d4, [
        u[4] || (u[4] = g("h4", null, "The brief", -1)),
        g("p", {
          class: X(["text", { clamped: !o.value }])
        }, b(e.task.brief), 3),
        e.task.brief.length > f4 && !o.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: u[1] || (u[1] = (d) => o.value = !0)
        }, "Show the whole brief")) : E("", !0)
      ])) : E("", !0),
      r.value.length ? (c(), W(sl, {
        key: 3,
        title: "Waited on",
        waits: r.value,
        onSelect: u[2] || (u[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : E("", !0)
    ], 64));
  }
}, m4 = /* @__PURE__ */ K(h4, [["__scopeId", "data-v-4a3f1e79"]]), p4 = {
  class: "task-details",
  "data-task-details": ""
}, g4 = { class: "since" }, v4 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, y4 = { class: "text" }, b4 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, w4 = {
  key: 1,
  class: "note"
}, k4 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, $4 = { class: "text" }, x4 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return c(), h("div", p4, [
        g("div", {
          class: X(["state-line", D(dn)(e.task.state)])
        }, [
          g("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (r) => n("status", r.currentTarget))
          }, [
            L(Us, {
              status: D(dn)(e.task.state)
            }, null, 8, ["status"]),
            ee(" " + b(a(e.task.state)), 1)
          ]),
          g("span", g4, [
            o[5] || (o[5] = ee(" since ", -1)),
            L(Et, {
              at: D(ur)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", v4, [
          o[6] || (o[6] = g("span", { class: "label" }, "Blocked, waiting on", -1)),
          g("p", y4, b(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (c(), h("p", b4, "Opens by itself when " + b(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", w4, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", k4, [
          o[7] || (o[7] = g("span", { class: "label" }, "Why it was cancelled", -1)),
          g("p", $4, b(e.task.reason), 1)
        ])) : E("", !0),
        e.graph ? (c(), W(X5, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (r) => n("select", r))
        }, null, 8, ["task", "graph"])) : E("", !0),
        L(q5, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (r) => n("priority", r)),
          onComplexity: o[3] || (o[3] = (r) => n("complexity", r))
        }, null, 8, ["task", "place", "refusal"]),
        L(m4, {
          task: e.task,
          onSelect: o[4] || (o[4] = (r) => n("select", r))
        }, null, 8, ["task"]),
        L(a4, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, M4 = /* @__PURE__ */ K(x4, [["__scopeId", "data-v-7e73fa21"]]), S4 = 50, _4 = { messages: 25 }, E4 = (e) => _4[e] || S4, C4 = {
  class: "task-log",
  "aria-label": "Task log"
}, A4 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, O4 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, T4 = { class: "entries" }, R4 = ["data-task-log-important"], I4 = ["datetime"], B4 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, L4 = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = A([]), a = A(1), s = A(!0), o = A(!0), l = A("");
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
        String(E4("task_logs")),
        "--page",
        String(u)
      ]);
      d === r && (o.value = !1, l.value = f.ok ? "" : f.error, f.ok && (n.value = f.value.rows, s.value = f.value.is_last_page));
    }
    return ge(
      () => [t.id, t.changes],
      () => {
        n.value = [], i();
      },
      { immediate: !0 }
    ), Je(() => {
      r += 1;
    }), (u, d) => (c(), h("section", C4, [
      o.value ? (c(), W(pt, { key: 0 })) : l.value ? (c(), h(z, { key: 1 }, [
        g("p", A4, b(l.value), 1),
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
        n.value.length ? E("", !0) : (c(), h("p", O4, "No log entries yet.")),
        g("ol", T4, [
          (c(!0), h(z, null, te(n.value, (f) => (c(), h("li", {
            key: f.id,
            class: X(["entry", { important: f.important }]),
            "data-task-log": "",
            "data-task-log-important": f.important ? "" : null
          }, [
            g("time", {
              datetime: f.created_at
            }, b(new Date(f.created_at).toLocaleString()), 9, I4),
            g("p", null, b(f.line), 1)
          ], 10, R4))), 128))
        ]),
        a.value > 1 || !s.value ? (c(), h("nav", B4, [
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
          g("span", null, "Page " + b(a.value), 1),
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
        ])) : E("", !0)
      ], 64))
    ]));
  }
}, N4 = /* @__PURE__ */ K(L4, [["__scopeId", "data-v-cfa43bf1"]]), D4 = {
  class: "task-tags",
  "aria-label": "Task tags"
}, j4 = { class: "tags" }, q4 = ["aria-label", "data-remove-tag", "onClick"], P4 = {
  __name: "TaskTags",
  props: { tags: { type: Array, required: !0 } },
  emits: ["add", "remove"],
  setup(e, { emit: t }) {
    const n = t, a = A("");
    function s() {
      const o = a.value.trim();
      o && (n("add", o), a.value = "");
    }
    return (o, l) => (c(), h("section", D4, [
      g("div", j4, [
        (c(!0), h(z, null, te(e.tags, (r) => (c(), h("span", {
          key: r,
          class: "tag",
          "data-task-tag": ""
        }, [
          ee(b(r) + " ", 1),
          g("button", {
            type: "button",
            "aria-label": `Remove tag ${r}`,
            "data-remove-tag": r,
            onClick: (i) => n("remove", r)
          }, "×", 8, q4)
        ]))), 128))
      ]),
      g("form", {
        class: "add-tag",
        onSubmit: xe(s, ["prevent"])
      }, [
        De(g("input", {
          "onUpdate:modelValue": l[0] || (l[0] = (r) => a.value = r),
          "aria-label": "New tag",
          placeholder: "New tag",
          pattern: "[a-z0-9-]+",
          "data-task-tag-input": ""
        }, null, 512), [
          [St, a.value]
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
}, F4 = /* @__PURE__ */ K(P4, [["__scopeId", "data-v-1d720cf2"]]), W4 = { class: "comment-side-head" }, H4 = {
  key: 0,
  class: "comment-none"
}, U4 = { key: 0 }, z4 = {
  key: 1,
  class: "comment-none"
}, V4 = {
  class: "comment",
  "data-comment": ""
}, G4 = {
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
      g("header", W4, [
        n[2] || (n[2] = g("h3", null, "Comments", -1)),
        L(oa, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (c(), h("p", H4, "No comments yet")) : E("", !0),
      (c(!0), h(z, null, te(e.comments, (a) => (c(), h("section", {
        key: a.id
      }, [
        a.quote ? (c(), h("blockquote", U4, b(a.quote), 1)) : E("", !0),
        a.revision ? (c(), h("span", z4, "Revision " + b(a.revision), 1)) : E("", !0),
        g("p", V4, b(e.words(a)), 1)
      ]))), 128)),
      L(hn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, K4 = /* @__PURE__ */ K(G4, [["__scopeId", "data-v-276284a3"]]), Y4 = ["placeholder"], J4 = { class: "actions" }, Q4 = { class: "error" }, Z4 = {
  key: 1,
  class: "card closed"
}, X4 = { class: "mark" }, e$ = { class: "prompt" }, t$ = {
  key: 0,
  class: "draft"
}, n$ = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ tn({
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
  emits: /* @__PURE__ */ tn(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = Wn(e, "draft"), l = Wn(e, "error"), r = A(!!l.value), i = A(!1), u = A(!1), d = A(null);
    async function f() {
      var y, x;
      r.value = !0, i.value = !1, await Qe(), (x = ((y = d.value) == null ? void 0 : y.querySelector("input")) || d.value) == null || x.focus();
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
        } catch (x) {
          o.value = y, l.value = x.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: f }), (y, x) => (c(), h("div", {
      class: X(["comment-bar", { open: r.value }])
    }, [
      r.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: xe(v, ["prevent"]),
        onKeydown: jt(m, ["esc"])
      }, [
        me(y.$slots, "who", {}, void 0, !0),
        De(g("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": x[0] || (x[0] = (C) => o.value = C),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: x[1] || (x[1] = jt((C) => D(ar)(C, v), ["enter"]))
        }, null, 40, Y4), [
          [St, o.value]
        ]),
        g("div", J4, [
          g("span", Q4, b(l.value), 1),
          L(de, {
            small: "",
            onClick: m
          }, {
            default: j(() => [...x[3] || (x[3] = [
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
            default: j(() => [...x[4] || (x[4] = [
              ee("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", Z4, [
        g("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          g("span", X4, [
            L(be, {
              name: i.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          g("span", e$, b(i.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", t$, "Draft kept")) : E("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: x[2] || (x[2] = (C) => s("show"))
        }, [
          g("span", null, b(D(Ou)(e.count, "comment")), 1),
          L(be, {
            name: "down",
            size: 12
          })
        ])) : E("", !0)
      ]))
    ], 2));
  }
}, a$ = /* @__PURE__ */ K(n$, [["__scopeId", "data-v-b68baddd"]]), s$ = { class: "top" }, o$ = {
  class: "crumb",
  "data-task-crumb": ""
}, l$ = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, r$ = {
  key: 1,
  class: "body"
}, i$ = { class: "summary" }, c$ = { class: "stamp" }, u$ = {
  class: "title",
  "data-resource-title": ""
}, d$ = {
  class: "tabs",
  "data-task-tabs": ""
}, f$ = { class: "panels" }, h$ = {
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
    const a = e, s = n, o = A(null), l = A(null), r = A(null), i = A(""), u = A(""), d = A(null), f = A(null), m = A("details"), v = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], y = wr(
      () => o.value ? { noun: "task", id: a.id, title: o.value.title } : {},
      (F) => a.read(F)
    );
    let x = 0;
    const C = I(() => {
      var F;
      return (F = l.value) != null && F.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function _() {
      const F = ++x, [O, T, $] = await Promise.all([
        a.read(["task", "inspect", String(a.id)]),
        a.read(["plan", "place", String(a.id)]),
        a.read(["task", "graph"])
      ]);
      F === x && (i.value = O.ok ? "" : O.error, o.value = O.ok ? O.value : null, l.value = T.ok ? T.value : null, r.value = $.ok ? $.value : null);
    }
    ge(
      () => a.id,
      () => {
        o.value = null, l.value = null, r.value = null, d.value = null, m.value = "details", _();
      },
      { immediate: !0 }
    ), ge(() => a.changes, _), ge(y.open, (F) => {
      F && (m.value = "comments");
    });
    async function N(F, O) {
      const T = o.value[F];
      o.value[F] = Number(O);
      const $ = await a.read(["task", "edit", String(a.id), `--${F}`, O]);
      if (u.value = $.ok ? "" : $.error, $.ok) return _();
      o.value[F] = T;
    }
    async function U(F, O) {
      const T = await a.read(["task", F, String(a.id), O]);
      u.value = T.ok ? "" : T.error, T.ok && await _();
    }
    function q(F) {
      d.value = null, f.value.press(F);
    }
    const B = (F) => {
      var O;
      return ((O = f.value) == null ? void 0 : O.moves.length) && (d.value = F);
    };
    return t({ openStatus: B }), (F, O) => (c(), h("aside", {
      class: X(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      g("div", s$, [
        e.backed ? (c(), W(d5, {
          key: 0,
          onBack: O[0] || (O[0] = (T) => s("back"))
        })) : E("", !0),
        g("span", o$, b(C.value), 1),
        O[14] || (O[14] = g("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(z, { key: 1 }, [
          L(de, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: O[1] || (O[1] = (T) => s("step", -1))
          }, {
            default: j(() => [
              L(be, {
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
            onClick: O[2] || (O[2] = (T) => s("step", 1))
          }, {
            default: j(() => [
              L(be, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : E("", !0),
        L(de, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: O[3] || (O[3] = (T) => s("close"))
        }, {
          default: j(() => [
            L(be, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (c(), h("p", l$, b(i.value), 1)) : o.value ? (c(), h(z, { key: 2 }, [
        L(b5, {
          ref_key: "actions",
          ref: f,
          noun: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: _
        }, null, 8, ["id", "row", "read"]),
        g("header", i$, [
          g("div", c$, [
            ee(" Task " + b(o.value.id) + " · updated ", 1),
            L(Et, {
              at: D(ur)(o.value)
            }, null, 8, ["at"])
          ]),
          g("h3", u$, b(o.value.title), 1),
          L(F4, {
            tags: o.value.tags,
            onAdd: O[4] || (O[4] = (T) => U("tag", T)),
            onRemove: O[5] || (O[5] = (T) => U("untag", T))
          }, null, 8, ["tags"])
        ]),
        g("div", d$, [
          L(qt, {
            options: v,
            value: m.value,
            onPick: O[6] || (O[6] = (T) => m.value = T)
          }, null, 8, ["value"])
        ]),
        g("div", f$, [
          L(Wt, { value: m.value }, {
            details: j(() => [
              L(M4, {
                task: o.value,
                place: l.value,
                graph: r.value,
                refusal: u.value,
                onStatus: B,
                onPriority: O[7] || (O[7] = (T) => N("priority", T)),
                onComplexity: O[8] || (O[8] = (T) => N("complexity", T)),
                onSelect: O[9] || (O[9] = (T) => s("select", T))
              }, null, 8, ["task", "place", "graph", "refusal"]),
              L(br, {
                "slot-name": "inspector.task",
                row: o.value
              }, null, 8, ["row"]),
              L(Cu, {
                model: "task",
                id: e.id,
                read: e.read,
                changes: e.changes,
                onOpen: O[10] || (O[10] = (T) => s("select", T))
              }, null, 8, ["id", "read", "changes"])
            ]),
            comments: j(() => [
              L(K4, {
                below: "",
                comments: D(y).comments.value,
                words: D(y).words,
                more: !!D(y).nextPage.value,
                loading: D(y).loading.value,
                failure: D(y).failure.value,
                onMore: D(y).loadMore,
                onClose: O[11] || (O[11] = (T) => m.value = "details")
              }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
            ]),
            log: j(() => [
              L(N4, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        L(a$, {
          send: D(y).send,
          count: D(y).total.value,
          onShow: O[12] || (O[12] = (T) => m.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", r$, [
        L(pt)
      ])),
      d.value ? (c(), W(sa, {
        key: 3,
        anchor: d.value,
        "min-width": 220,
        "max-width": 300,
        onClose: O[13] || (O[13] = (T) => d.value = null)
      }, {
        default: j(() => [
          L(ms, null, {
            default: j(() => [
              ee("Change the status of task " + b(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(z, null, te(f.value.moves, (T) => (c(), W(_t, {
            key: T.word,
            onClick: ($) => q(T)
          }, {
            default: j(() => [
              ee(b(T.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : E("", !0)
    ], 2));
  }
}, Z3 = /* @__PURE__ */ K(h$, [["__scopeId", "data-v-d8c2872e"]]);
function m$(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ga = { exports: {} }, ol;
function p$() {
  return ol || (ol = 1, (function(e, t) {
    var n = (function() {
      var a = function(B, F) {
        var O = 236, T = 17, $ = B, w = o[F], k = null, p = 0, M = null, S = [], R = {}, P = function(V, G) {
          p = $ * 4 + 17, k = (function(H) {
            for (var Y = new Array(H), J = 0; J < H; J += 1) {
              Y[J] = new Array(H);
              for (var ne = 0; ne < H; ne += 1)
                Y[J][ne] = null;
            }
            return Y;
          })(p), Q(0, 0), Q(p - 7, 0), Q(0, p - 7), pe(), ie(), fe(V, G), $ >= 7 && Ce(V), M == null && (M = oe($, w, S)), Z(M, G);
        }, Q = function(V, G) {
          for (var H = -1; H <= 7; H += 1)
            if (!(V + H <= -1 || p <= V + H))
              for (var Y = -1; Y <= 7; Y += 1)
                G + Y <= -1 || p <= G + Y || (0 <= H && H <= 6 && (Y == 0 || Y == 6) || 0 <= Y && Y <= 6 && (H == 0 || H == 6) || 2 <= H && H <= 4 && 2 <= Y && Y <= 4 ? k[V + H][G + Y] = !0 : k[V + H][G + Y] = !1);
        }, se = function() {
          for (var V = 0, G = 0, H = 0; H < 8; H += 1) {
            P(!0, H);
            var Y = r.getLostPoint(R);
            (H == 0 || V > Y) && (V = Y, G = H);
          }
          return G;
        }, ie = function() {
          for (var V = 8; V < p - 8; V += 1)
            k[V][6] == null && (k[V][6] = V % 2 == 0);
          for (var G = 8; G < p - 8; G += 1)
            k[6][G] == null && (k[6][G] = G % 2 == 0);
        }, pe = function() {
          for (var V = r.getPatternPosition($), G = 0; G < V.length; G += 1)
            for (var H = 0; H < V.length; H += 1) {
              var Y = V[G], J = V[H];
              if (k[Y][J] == null)
                for (var ne = -2; ne <= 2; ne += 1)
                  for (var ce = -2; ce <= 2; ce += 1)
                    ne == -2 || ne == 2 || ce == -2 || ce == 2 || ne == 0 && ce == 0 ? k[Y + ne][J + ce] = !0 : k[Y + ne][J + ce] = !1;
            }
        }, Ce = function(V) {
          for (var G = r.getBCHTypeNumber($), H = 0; H < 18; H += 1) {
            var Y = !V && (G >> H & 1) == 1;
            k[Math.floor(H / 3)][H % 3 + p - 8 - 3] = Y;
          }
          for (var H = 0; H < 18; H += 1) {
            var Y = !V && (G >> H & 1) == 1;
            k[H % 3 + p - 8 - 3][Math.floor(H / 3)] = Y;
          }
        }, fe = function(V, G) {
          for (var H = w << 3 | G, Y = r.getBCHTypeInfo(H), J = 0; J < 15; J += 1) {
            var ne = !V && (Y >> J & 1) == 1;
            J < 6 ? k[J][8] = ne : J < 8 ? k[J + 1][8] = ne : k[p - 15 + J][8] = ne;
          }
          for (var J = 0; J < 15; J += 1) {
            var ne = !V && (Y >> J & 1) == 1;
            J < 8 ? k[8][p - J - 1] = ne : J < 9 ? k[8][15 - J - 1 + 1] = ne : k[8][15 - J - 1] = ne;
          }
          k[p - 8][8] = !V;
        }, Z = function(V, G) {
          for (var H = -1, Y = p - 1, J = 7, ne = 0, ce = r.getMaskFunction(G), re = p - 1; re > 0; re -= 2)
            for (re == 6 && (re -= 1); ; ) {
              for (var $e = 0; $e < 2; $e += 1)
                if (k[Y][re - $e] == null) {
                  var _e = !1;
                  ne < V.length && (_e = (V[ne] >>> J & 1) == 1);
                  var he = ce(Y, re - $e);
                  he && (_e = !_e), k[Y][re - $e] = _e, J -= 1, J == -1 && (ne += 1, J = 7);
                }
              if (Y += H, Y < 0 || p <= Y) {
                Y -= H, H = -H;
                break;
              }
            }
        }, ae = function(V, G) {
          for (var H = 0, Y = 0, J = 0, ne = new Array(G.length), ce = new Array(G.length), re = 0; re < G.length; re += 1) {
            var $e = G[re].dataCount, _e = G[re].totalCount - $e;
            Y = Math.max(Y, $e), J = Math.max(J, _e), ne[re] = new Array($e);
            for (var he = 0; he < ne[re].length; he += 1)
              ne[re][he] = 255 & V.getBuffer()[he + H];
            H += $e;
            var qe = r.getErrorCorrectPolynomial(_e), Pe = u(ne[re], qe.getLength() - 1), zs = Pe.mod(qe);
            ce[re] = new Array(qe.getLength() - 1);
            for (var he = 0; he < ce[re].length; he += 1) {
              var Vs = he + zs.getLength() - ce[re].length;
              ce[re][he] = Vs >= 0 ? zs.getAt(Vs) : 0;
            }
          }
          for (var Gs = 0, he = 0; he < G.length; he += 1)
            Gs += G[he].totalCount;
          for (var ma = new Array(Gs), kn = 0, he = 0; he < Y; he += 1)
            for (var re = 0; re < G.length; re += 1)
              he < ne[re].length && (ma[kn] = ne[re][he], kn += 1);
          for (var he = 0; he < J; he += 1)
            for (var re = 0; re < G.length; re += 1)
              he < ce[re].length && (ma[kn] = ce[re][he], kn += 1);
          return ma;
        }, oe = function(V, G, H) {
          for (var Y = d.getRSBlocks(V, G), J = f(), ne = 0; ne < H.length; ne += 1) {
            var ce = H[ne];
            J.put(ce.getMode(), 4), J.put(ce.getLength(), r.getLengthInBits(ce.getMode(), V)), ce.write(J);
          }
          for (var re = 0, ne = 0; ne < Y.length; ne += 1)
            re += Y[ne].dataCount;
          if (J.getLengthInBits() > re * 8)
            throw "code length overflow. (" + J.getLengthInBits() + ">" + re * 8 + ")";
          for (J.getLengthInBits() + 4 <= re * 8 && J.put(0, 4); J.getLengthInBits() % 8 != 0; )
            J.putBit(!1);
          for (; !(J.getLengthInBits() >= re * 8 || (J.put(O, 8), J.getLengthInBits() >= re * 8)); )
            J.put(T, 8);
          return ae(J, Y);
        };
        R.addData = function(V, G) {
          G = G || "Byte";
          var H = null;
          switch (G) {
            case "Numeric":
              H = m(V);
              break;
            case "Alphanumeric":
              H = v(V);
              break;
            case "Byte":
              H = y(V);
              break;
            case "Kanji":
              H = x(V);
              break;
            default:
              throw "mode:" + G;
          }
          S.push(H), M = null;
        }, R.isDark = function(V, G) {
          if (V < 0 || p <= V || G < 0 || p <= G)
            throw V + "," + G;
          return k[V][G];
        }, R.getModuleCount = function() {
          return p;
        }, R.make = function() {
          if ($ < 1) {
            for (var V = 1; V < 40; V++) {
              for (var G = d.getRSBlocks(V, w), H = f(), Y = 0; Y < S.length; Y++) {
                var J = S[Y];
                H.put(J.getMode(), 4), H.put(J.getLength(), r.getLengthInBits(J.getMode(), V)), J.write(H);
              }
              for (var ne = 0, Y = 0; Y < G.length; Y++)
                ne += G[Y].dataCount;
              if (H.getLengthInBits() <= ne * 8)
                break;
            }
            $ = V;
          }
          P(!1, se());
        }, R.createTableTag = function(V, G) {
          V = V || 2, G = typeof G > "u" ? V * 4 : G;
          var H = "";
          H += '<table style="', H += " border-width: 0px; border-style: none;", H += " border-collapse: collapse;", H += " padding: 0px; margin: " + G + "px;", H += '">', H += "<tbody>";
          for (var Y = 0; Y < R.getModuleCount(); Y += 1) {
            H += "<tr>";
            for (var J = 0; J < R.getModuleCount(); J += 1)
              H += '<td style="', H += " border-width: 0px; border-style: none;", H += " border-collapse: collapse;", H += " padding: 0px; margin: 0px;", H += " width: " + V + "px;", H += " height: " + V + "px;", H += " background-color: ", H += R.isDark(Y, J) ? "#000000" : "#ffffff", H += ";", H += '"/>';
            H += "</tr>";
          }
          return H += "</tbody>", H += "</table>", H;
        }, R.createSvgTag = function(V, G, H, Y) {
          var J = {};
          typeof arguments[0] == "object" && (J = arguments[0], V = J.cellSize, G = J.margin, H = J.alt, Y = J.title), V = V || 2, G = typeof G > "u" ? V * 4 : G, H = typeof H == "string" ? { text: H } : H || {}, H.text = H.text || null, H.id = H.text ? H.id || "qrcode-description" : null, Y = typeof Y == "string" ? { text: Y } : Y || {}, Y.text = Y.text || null, Y.id = Y.text ? Y.id || "qrcode-title" : null;
          var ne = R.getModuleCount() * V + G * 2, ce, re, $e, _e, he = "", qe;
          for (qe = "l" + V + ",0 0," + V + " -" + V + ",0 0,-" + V + "z ", he += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', he += J.scalable ? "" : ' width="' + ne + 'px" height="' + ne + 'px"', he += ' viewBox="0 0 ' + ne + " " + ne + '" ', he += ' preserveAspectRatio="xMinYMin meet"', he += Y.text || H.text ? ' role="img" aria-labelledby="' + Ze([Y.id, H.id].join(" ").trim()) + '"' : "", he += ">", he += Y.text ? '<title id="' + Ze(Y.id) + '">' + Ze(Y.text) + "</title>" : "", he += H.text ? '<description id="' + Ze(H.id) + '">' + Ze(H.text) + "</description>" : "", he += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', he += '<path d="', $e = 0; $e < R.getModuleCount(); $e += 1)
            for (_e = $e * V + G, ce = 0; ce < R.getModuleCount(); ce += 1)
              R.isDark($e, ce) && (re = ce * V + G, he += "M" + re + "," + _e + qe);
          return he += '" stroke="transparent" fill="black"/>', he += "</svg>", he;
        }, R.createDataURL = function(V, G) {
          V = V || 2, G = typeof G > "u" ? V * 4 : G;
          var H = R.getModuleCount() * V + G * 2, Y = G, J = H - G;
          return q(H, H, function(ne, ce) {
            if (Y <= ne && ne < J && Y <= ce && ce < J) {
              var re = Math.floor((ne - Y) / V), $e = Math.floor((ce - Y) / V);
              return R.isDark($e, re) ? 0 : 1;
            } else
              return 1;
          });
        }, R.createImgTag = function(V, G, H) {
          V = V || 2, G = typeof G > "u" ? V * 4 : G;
          var Y = R.getModuleCount() * V + G * 2, J = "";
          return J += "<img", J += ' src="', J += R.createDataURL(V, G), J += '"', J += ' width="', J += Y, J += '"', J += ' height="', J += Y, J += '"', H && (J += ' alt="', J += Ze(H), J += '"'), J += "/>", J;
        };
        var Ze = function(V) {
          for (var G = "", H = 0; H < V.length; H += 1) {
            var Y = V.charAt(H);
            switch (Y) {
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
                G += Y;
                break;
            }
          }
          return G;
        }, wi = function(V) {
          var G = 1;
          V = typeof V > "u" ? G * 2 : V;
          var H = R.getModuleCount() * G + V * 2, Y = V, J = H - V, ne, ce, re, $e, _e, he = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, qe = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, Pe = "";
          for (ne = 0; ne < H; ne += 2) {
            for (re = Math.floor((ne - Y) / G), $e = Math.floor((ne + 1 - Y) / G), ce = 0; ce < H; ce += 1)
              _e = "█", Y <= ce && ce < J && Y <= ne && ne < J && R.isDark(re, Math.floor((ce - Y) / G)) && (_e = " "), Y <= ce && ce < J && Y <= ne + 1 && ne + 1 < J && R.isDark($e, Math.floor((ce - Y) / G)) ? _e += " " : _e += "█", Pe += V < 1 && ne + 1 >= J ? qe[_e] : he[_e];
            Pe += `
`;
          }
          return H % 2 && V > 0 ? Pe.substring(0, Pe.length - H - 1) + Array(H + 1).join("▀") : Pe.substring(0, Pe.length - 1);
        };
        return R.createASCII = function(V, G) {
          if (V = V || 1, V < 2)
            return wi(G);
          V -= 1, G = typeof G > "u" ? V * 2 : G;
          var H = R.getModuleCount() * V + G * 2, Y = G, J = H - G, ne, ce, re, $e, _e = Array(V + 1).join("██"), he = Array(V + 1).join("  "), qe = "", Pe = "";
          for (ne = 0; ne < H; ne += 1) {
            for (re = Math.floor((ne - Y) / V), Pe = "", ce = 0; ce < H; ce += 1)
              $e = 1, Y <= ce && ce < J && Y <= ne && ne < J && R.isDark(re, Math.floor((ce - Y) / V)) && ($e = 0), Pe += $e ? _e : he;
            for (re = 0; re < V; re += 1)
              qe += Pe + `
`;
          }
          return qe.substring(0, qe.length - 1);
        }, R.renderTo2dContext = function(V, G) {
          G = G || 2;
          for (var H = R.getModuleCount(), Y = 0; Y < H; Y++)
            for (var J = 0; J < H; J++)
              V.fillStyle = R.isDark(Y, J) ? "black" : "white", V.fillRect(Y * G, J * G, G, G);
        }, R;
      };
      a.stringToBytesFuncs = {
        default: function(B) {
          for (var F = [], O = 0; O < B.length; O += 1) {
            var T = B.charCodeAt(O);
            F.push(T & 255);
          }
          return F;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(B, F) {
        var O = (function() {
          for (var $ = N(B), w = function() {
            var ie = $.read();
            if (ie == -1) throw "eof";
            return ie;
          }, k = 0, p = {}; ; ) {
            var M = $.read();
            if (M == -1) break;
            var S = w(), R = w(), P = w(), Q = String.fromCharCode(M << 8 | S), se = R << 8 | P;
            p[Q] = se, k += 1;
          }
          if (k != F)
            throw k + " != " + F;
          return p;
        })(), T = 63;
        return function($) {
          for (var w = [], k = 0; k < $.length; k += 1) {
            var p = $.charCodeAt(k);
            if (p < 128)
              w.push(p);
            else {
              var M = O[$.charAt(k)];
              typeof M == "number" ? (M & 255) == M ? w.push(M) : (w.push(M >>> 8), w.push(M & 255)) : w.push(T);
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
        ], F = 1335, O = 7973, T = 21522, $ = {}, w = function(k) {
          for (var p = 0; k != 0; )
            p += 1, k >>>= 1;
          return p;
        };
        return $.getBCHTypeInfo = function(k) {
          for (var p = k << 10; w(p) - w(F) >= 0; )
            p ^= F << w(p) - w(F);
          return (k << 10 | p) ^ T;
        }, $.getBCHTypeNumber = function(k) {
          for (var p = k << 12; w(p) - w(O) >= 0; )
            p ^= O << w(p) - w(O);
          return k << 12 | p;
        }, $.getPatternPosition = function(k) {
          return B[k - 1];
        }, $.getMaskFunction = function(k) {
          switch (k) {
            case l.PATTERN000:
              return function(p, M) {
                return (p + M) % 2 == 0;
              };
            case l.PATTERN001:
              return function(p, M) {
                return p % 2 == 0;
              };
            case l.PATTERN010:
              return function(p, M) {
                return M % 3 == 0;
              };
            case l.PATTERN011:
              return function(p, M) {
                return (p + M) % 3 == 0;
              };
            case l.PATTERN100:
              return function(p, M) {
                return (Math.floor(p / 2) + Math.floor(M / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(p, M) {
                return p * M % 2 + p * M % 3 == 0;
              };
            case l.PATTERN110:
              return function(p, M) {
                return (p * M % 2 + p * M % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(p, M) {
                return (p * M % 3 + (p + M) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + k;
          }
        }, $.getErrorCorrectPolynomial = function(k) {
          for (var p = u([1], 0), M = 0; M < k; M += 1)
            p = p.multiply(u([1, i.gexp(M)], 0));
          return p;
        }, $.getLengthInBits = function(k, p) {
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
        }, $.getLostPoint = function(k) {
          for (var p = k.getModuleCount(), M = 0, S = 0; S < p; S += 1)
            for (var R = 0; R < p; R += 1) {
              for (var P = 0, Q = k.isDark(S, R), se = -1; se <= 1; se += 1)
                if (!(S + se < 0 || p <= S + se))
                  for (var ie = -1; ie <= 1; ie += 1)
                    R + ie < 0 || p <= R + ie || se == 0 && ie == 0 || Q == k.isDark(S + se, R + ie) && (P += 1);
              P > 5 && (M += 3 + P - 5);
            }
          for (var S = 0; S < p - 1; S += 1)
            for (var R = 0; R < p - 1; R += 1) {
              var pe = 0;
              k.isDark(S, R) && (pe += 1), k.isDark(S + 1, R) && (pe += 1), k.isDark(S, R + 1) && (pe += 1), k.isDark(S + 1, R + 1) && (pe += 1), (pe == 0 || pe == 4) && (M += 3);
            }
          for (var S = 0; S < p; S += 1)
            for (var R = 0; R < p - 6; R += 1)
              k.isDark(S, R) && !k.isDark(S, R + 1) && k.isDark(S, R + 2) && k.isDark(S, R + 3) && k.isDark(S, R + 4) && !k.isDark(S, R + 5) && k.isDark(S, R + 6) && (M += 40);
          for (var R = 0; R < p; R += 1)
            for (var S = 0; S < p - 6; S += 1)
              k.isDark(S, R) && !k.isDark(S + 1, R) && k.isDark(S + 2, R) && k.isDark(S + 3, R) && k.isDark(S + 4, R) && !k.isDark(S + 5, R) && k.isDark(S + 6, R) && (M += 40);
          for (var Ce = 0, R = 0; R < p; R += 1)
            for (var S = 0; S < p; S += 1)
              k.isDark(S, R) && (Ce += 1);
          var fe = Math.abs(100 * Ce / p / p - 50) / 5;
          return M += fe * 10, M;
        }, $;
      })(), i = (function() {
        for (var B = new Array(256), F = new Array(256), O = 0; O < 8; O += 1)
          B[O] = 1 << O;
        for (var O = 8; O < 256; O += 1)
          B[O] = B[O - 4] ^ B[O - 5] ^ B[O - 6] ^ B[O - 8];
        for (var O = 0; O < 255; O += 1)
          F[B[O]] = O;
        var T = {};
        return T.glog = function($) {
          if ($ < 1)
            throw "glog(" + $ + ")";
          return F[$];
        }, T.gexp = function($) {
          for (; $ < 0; )
            $ += 255;
          for (; $ >= 256; )
            $ -= 255;
          return B[$];
        }, T;
      })();
      function u(B, F) {
        if (typeof B.length > "u")
          throw B.length + "/" + F;
        var O = (function() {
          for (var $ = 0; $ < B.length && B[$] == 0; )
            $ += 1;
          for (var w = new Array(B.length - $ + F), k = 0; k < B.length - $; k += 1)
            w[k] = B[k + $];
          return w;
        })(), T = {};
        return T.getAt = function($) {
          return O[$];
        }, T.getLength = function() {
          return O.length;
        }, T.multiply = function($) {
          for (var w = new Array(T.getLength() + $.getLength() - 1), k = 0; k < T.getLength(); k += 1)
            for (var p = 0; p < $.getLength(); p += 1)
              w[k + p] ^= i.gexp(i.glog(T.getAt(k)) + i.glog($.getAt(p)));
          return u(w, 0);
        }, T.mod = function($) {
          if (T.getLength() - $.getLength() < 0)
            return T;
          for (var w = i.glog(T.getAt(0)) - i.glog($.getAt(0)), k = new Array(T.getLength()), p = 0; p < T.getLength(); p += 1)
            k[p] = T.getAt(p);
          for (var p = 0; p < $.getLength(); p += 1)
            k[p] ^= i.gexp(i.glog($.getAt(p)) + w);
          return u(k, 0).mod($);
        }, T;
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
        ], F = function($, w) {
          var k = {};
          return k.totalCount = $, k.dataCount = w, k;
        }, O = {}, T = function($, w) {
          switch (w) {
            case o.L:
              return B[($ - 1) * 4 + 0];
            case o.M:
              return B[($ - 1) * 4 + 1];
            case o.Q:
              return B[($ - 1) * 4 + 2];
            case o.H:
              return B[($ - 1) * 4 + 3];
            default:
              return;
          }
        };
        return O.getRSBlocks = function($, w) {
          var k = T($, w);
          if (typeof k > "u")
            throw "bad rs block @ typeNumber:" + $ + "/errorCorrectionLevel:" + w;
          for (var p = k.length / 3, M = [], S = 0; S < p; S += 1)
            for (var R = k[S * 3 + 0], P = k[S * 3 + 1], Q = k[S * 3 + 2], se = 0; se < R; se += 1)
              M.push(F(P, Q));
          return M;
        }, O;
      })(), f = function() {
        var B = [], F = 0, O = {};
        return O.getBuffer = function() {
          return B;
        }, O.getAt = function(T) {
          var $ = Math.floor(T / 8);
          return (B[$] >>> 7 - T % 8 & 1) == 1;
        }, O.put = function(T, $) {
          for (var w = 0; w < $; w += 1)
            O.putBit((T >>> $ - w - 1 & 1) == 1);
        }, O.getLengthInBits = function() {
          return F;
        }, O.putBit = function(T) {
          var $ = Math.floor(F / 8);
          B.length <= $ && B.push(0), T && (B[$] |= 128 >>> F % 8), F += 1;
        }, O;
      }, m = function(B) {
        var F = s.MODE_NUMBER, O = B, T = {};
        T.getMode = function() {
          return F;
        }, T.getLength = function(k) {
          return O.length;
        }, T.write = function(k) {
          for (var p = O, M = 0; M + 2 < p.length; )
            k.put($(p.substring(M, M + 3)), 10), M += 3;
          M < p.length && (p.length - M == 1 ? k.put($(p.substring(M, M + 1)), 4) : p.length - M == 2 && k.put($(p.substring(M, M + 2)), 7));
        };
        var $ = function(k) {
          for (var p = 0, M = 0; M < k.length; M += 1)
            p = p * 10 + w(k.charAt(M));
          return p;
        }, w = function(k) {
          if ("0" <= k && k <= "9")
            return k.charCodeAt(0) - 48;
          throw "illegal char :" + k;
        };
        return T;
      }, v = function(B) {
        var F = s.MODE_ALPHA_NUM, O = B, T = {};
        T.getMode = function() {
          return F;
        }, T.getLength = function(w) {
          return O.length;
        }, T.write = function(w) {
          for (var k = O, p = 0; p + 1 < k.length; )
            w.put(
              $(k.charAt(p)) * 45 + $(k.charAt(p + 1)),
              11
            ), p += 2;
          p < k.length && w.put($(k.charAt(p)), 6);
        };
        var $ = function(w) {
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
        return T;
      }, y = function(B) {
        var F = s.MODE_8BIT_BYTE, O = a.stringToBytes(B), T = {};
        return T.getMode = function() {
          return F;
        }, T.getLength = function($) {
          return O.length;
        }, T.write = function($) {
          for (var w = 0; w < O.length; w += 1)
            $.put(O[w], 8);
        }, T;
      }, x = function(B) {
        var F = s.MODE_KANJI, O = a.stringToBytesFuncs.SJIS;
        if (!O)
          throw "sjis not supported.";
        (function(w, k) {
          var p = O(w);
          if (p.length != 2 || (p[0] << 8 | p[1]) != k)
            throw "sjis not supported.";
        })("友", 38726);
        var T = O(B), $ = {};
        return $.getMode = function() {
          return F;
        }, $.getLength = function(w) {
          return ~~(T.length / 2);
        }, $.write = function(w) {
          for (var k = T, p = 0; p + 1 < k.length; ) {
            var M = (255 & k[p]) << 8 | 255 & k[p + 1];
            if (33088 <= M && M <= 40956)
              M -= 33088;
            else if (57408 <= M && M <= 60351)
              M -= 49472;
            else
              throw "illegal char at " + (p + 1) + "/" + M;
            M = (M >>> 8 & 255) * 192 + (M & 255), w.put(M, 13), p += 2;
          }
          if (p < k.length)
            throw "illegal char at " + (p + 1);
        }, $;
      }, C = function() {
        var B = [], F = {};
        return F.writeByte = function(O) {
          B.push(O & 255);
        }, F.writeShort = function(O) {
          F.writeByte(O), F.writeByte(O >>> 8);
        }, F.writeBytes = function(O, T, $) {
          T = T || 0, $ = $ || O.length;
          for (var w = 0; w < $; w += 1)
            F.writeByte(O[w + T]);
        }, F.writeString = function(O) {
          for (var T = 0; T < O.length; T += 1)
            F.writeByte(O.charCodeAt(T));
        }, F.toByteArray = function() {
          return B;
        }, F.toString = function() {
          var O = "";
          O += "[";
          for (var T = 0; T < B.length; T += 1)
            T > 0 && (O += ","), O += B[T];
          return O += "]", O;
        }, F;
      }, _ = function() {
        var B = 0, F = 0, O = 0, T = "", $ = {}, w = function(p) {
          T += String.fromCharCode(k(p & 63));
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
        return $.writeByte = function(p) {
          for (B = B << 8 | p & 255, F += 8, O += 1; F >= 6; )
            w(B >>> F - 6), F -= 6;
        }, $.flush = function() {
          if (F > 0 && (w(B << 6 - F), B = 0, F = 0), O % 3 != 0)
            for (var p = 3 - O % 3, M = 0; M < p; M += 1)
              T += "=";
        }, $.toString = function() {
          return T;
        }, $;
      }, N = function(B) {
        var F = B, O = 0, T = 0, $ = 0, w = {};
        w.read = function() {
          for (; $ < 8; ) {
            if (O >= F.length) {
              if ($ == 0)
                return -1;
              throw "unexpected end of file./" + $;
            }
            var p = F.charAt(O);
            if (O += 1, p == "=")
              return $ = 0, -1;
            if (p.match(/^\s$/))
              continue;
            T = T << 6 | k(p.charCodeAt(0)), $ += 6;
          }
          var M = T >>> $ - 8 & 255;
          return $ -= 8, M;
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
      }, U = function(B, F) {
        var O = B, T = F, $ = new Array(B * F), w = {};
        w.setPixel = function(S, R, P) {
          $[R * O + S] = P;
        }, w.write = function(S) {
          S.writeString("GIF87a"), S.writeShort(O), S.writeShort(T), S.writeByte(128), S.writeByte(0), S.writeByte(0), S.writeByte(0), S.writeByte(0), S.writeByte(0), S.writeByte(255), S.writeByte(255), S.writeByte(255), S.writeString(","), S.writeShort(0), S.writeShort(0), S.writeShort(O), S.writeShort(T), S.writeByte(0);
          var R = 2, P = p(R);
          S.writeByte(R);
          for (var Q = 0; P.length - Q > 255; )
            S.writeByte(255), S.writeBytes(P, Q, 255), Q += 255;
          S.writeByte(P.length - Q), S.writeBytes(P, Q, P.length - Q), S.writeByte(0), S.writeString(";");
        };
        var k = function(S) {
          var R = S, P = 0, Q = 0, se = {};
          return se.write = function(ie, pe) {
            if (ie >>> pe)
              throw "length over";
            for (; P + pe >= 8; )
              R.writeByte(255 & (ie << P | Q)), pe -= 8 - P, ie >>>= 8 - P, Q = 0, P = 0;
            Q = ie << P | Q, P = P + pe;
          }, se.flush = function() {
            P > 0 && R.writeByte(Q);
          }, se;
        }, p = function(S) {
          for (var R = 1 << S, P = (1 << S) + 1, Q = S + 1, se = M(), ie = 0; ie < R; ie += 1)
            se.add(String.fromCharCode(ie));
          se.add(String.fromCharCode(R)), se.add(String.fromCharCode(P));
          var pe = C(), Ce = k(pe);
          Ce.write(R, Q);
          var fe = 0, Z = String.fromCharCode($[fe]);
          for (fe += 1; fe < $.length; ) {
            var ae = String.fromCharCode($[fe]);
            fe += 1, se.contains(Z + ae) ? Z = Z + ae : (Ce.write(se.indexOf(Z), Q), se.size() < 4095 && (se.size() == 1 << Q && (Q += 1), se.add(Z + ae)), Z = ae);
          }
          return Ce.write(se.indexOf(Z), Q), Ce.write(P, Q), Ce.flush(), pe.toByteArray();
        }, M = function() {
          var S = {}, R = 0, P = {};
          return P.add = function(Q) {
            if (P.contains(Q))
              throw "dup key:" + Q;
            S[Q] = R, R += 1;
          }, P.size = function() {
            return R;
          }, P.indexOf = function(Q) {
            return S[Q];
          }, P.contains = function(Q) {
            return typeof S[Q] < "u";
          }, P;
        };
        return w;
      }, q = function(B, F, O) {
        for (var T = U(B, F), $ = 0; $ < F; $ += 1)
          for (var w = 0; w < B; w += 1)
            T.setPixel(w, $, O(w, $));
        var k = C();
        T.write(k);
        for (var p = _(), M = k.toByteArray(), S = 0; S < M.length; S += 1)
          p.writeByte(M[S]);
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
  })(Ga)), Ga.exports;
}
var g$ = p$();
const v$ = /* @__PURE__ */ m$(g$), y$ = ["width", "height", "viewBox"], b$ = ["width", "height"], w$ = ["d"], k$ = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = I(() => {
      const a = v$(0, "M");
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
      }, null, 8, b$),
      g("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, w$)
    ], 8, y$));
  }
}, X3 = /* @__PURE__ */ K(k$, [["__scopeId", "data-v-489f0852"]]), $$ = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "window-room",
      "data-window-room": "",
      style: ye({ padding: e.padding })
    }, [
      me(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, e6 = /* @__PURE__ */ K($$, [["__scopeId", "data-v-47e67f04"]]);
function t6(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const n6 = Li(() => import("./VoiceFigure-pISbugU7.js").then((e) => e.V)), a6 = "1.2.0", s6 = "3.5";
export {
  rf as $,
  Ee as A,
  Re as B,
  ua as C,
  ot as D,
  c3 as E,
  wk as F,
  Xx as G,
  o3 as H,
  ek as I,
  Ek as J,
  Ot as K,
  _$ as L,
  js as M,
  Ik as N,
  _k as O,
  ca as P,
  S8 as Q,
  Rx as R,
  Pn as S,
  O8 as T,
  Mx as U,
  Ae as V,
  Jn as W,
  xx as X,
  $x as Y,
  lf as Z,
  K as _,
  mx as a,
  G8 as a$,
  Tk as a0,
  Ix as a1,
  Bx as a2,
  je as a3,
  zx as a4,
  Ux as a5,
  Ct as a6,
  Lx as a7,
  a8,
  ax as a9,
  q8 as aA,
  $8 as aB,
  Hw as aC,
  r8 as aD,
  i8 as aE,
  u3 as aF,
  ni as aG,
  A8 as aH,
  vn as aI,
  cx as aJ,
  lx as aK,
  X8 as aL,
  yn as aM,
  a3 as aN,
  Zx as aO,
  x8 as aP,
  M8 as aQ,
  k8 as aR,
  ln as aS,
  xt as aT,
  sx as aU,
  Ib as aV,
  b8 as aW,
  Ox as aX,
  ei as aY,
  Pt as aZ,
  Ut as a_,
  K8 as aa,
  t3 as ab,
  fx as ac,
  Sx as ad,
  _x as ae,
  Wx as af,
  Hx as ag,
  Vx as ah,
  yx as ai,
  Qo as aj,
  Nx as ak,
  n8 as al,
  m3 as am,
  p8 as an,
  h8 as ao,
  f8 as ap,
  Gx as aq,
  Px as ar,
  qx as as,
  Fx as at,
  C8 as au,
  t8 as av,
  s8 as aw,
  v3 as ax,
  Zt as ay,
  o8 as az,
  Uk as b,
  g3 as b$,
  gk as b0,
  n3 as b1,
  I8 as b2,
  R8 as b3,
  aw as b4,
  Fr as b5,
  U8 as b6,
  e8 as b7,
  ha as b8,
  ct as b9,
  L8 as bA,
  F8 as bB,
  ft as bC,
  T8 as bD,
  W8 as bE,
  l8 as bF,
  g8 as bG,
  c8 as bH,
  Ie as bI,
  Qx as bJ,
  H8 as bK,
  S3 as bL,
  _3 as bM,
  tx as bN,
  Nb as bO,
  Yx as bP,
  N8 as bQ,
  px as bR,
  h3 as bS,
  B8 as bT,
  D8 as bU,
  j8 as bV,
  Kx as bW,
  Uw as bX,
  Jx as bY,
  d8 as bZ,
  f3 as b_,
  P8 as ba,
  Ba as bb,
  cr as bc,
  b3 as bd,
  $3 as be,
  E8 as bf,
  Z8 as bg,
  nx as bh,
  m8 as bi,
  w3 as bj,
  Dx as bk,
  jx as bl,
  wx as bm,
  Tx as bn,
  ix as bo,
  J8 as bp,
  gx as bq,
  vx as br,
  kx as bs,
  y8 as bt,
  Cb as bu,
  s3 as bv,
  Sk as bw,
  bx,
  ux as by,
  v8 as bz,
  nw as c,
  j2 as c$,
  rx as c0,
  ox as c1,
  u8 as c2,
  x3 as c3,
  Hs as c4,
  M3 as c5,
  vi as c6,
  Q8 as c7,
  Cx as c8,
  Ex as c9,
  pd as cA,
  be as cB,
  F3 as cC,
  L$ as cD,
  a6 as cE,
  s6 as cF,
  U$ as cG,
  H3 as cH,
  ls as cI,
  J$ as cJ,
  hy as cK,
  _t as cL,
  ms as cM,
  sa as cN,
  q$ as cO,
  z$ as cP,
  Xc as cQ,
  K0 as cR,
  J3 as cS,
  F$ as cT,
  X3 as cU,
  sr as cV,
  Cu as cW,
  j3 as cX,
  Fp as cY,
  T$ as cZ,
  Z$ as c_,
  Rb as ca,
  dx as cb,
  xk as cc,
  w8 as cd,
  Ls as ce,
  jw as cf,
  _8 as cg,
  Xt as ch,
  Dt as ci,
  j$ as cj,
  P3 as ck,
  de as cl,
  Hd as cm,
  Fl as cn,
  oa as co,
  w1 as cp,
  la as cq,
  Q3 as cr,
  ex as cs,
  D$ as ct,
  x1 as cu,
  Xl as cv,
  nn as cw,
  E3 as cx,
  M$ as cy,
  Mt as cz,
  Ve as d,
  S$ as d$,
  qt as d0,
  V$ as d1,
  pt as d2,
  gt as d3,
  ch as d4,
  Nu as d5,
  K$ as d6,
  R$ as d7,
  Wt as d8,
  W3 as d9,
  A3 as dA,
  Am as dB,
  C3 as dC,
  A$ as dD,
  z3 as dE,
  ry as dF,
  l2 as dG,
  I$ as dH,
  H$ as dI,
  R3 as dJ,
  B3 as dK,
  He as dL,
  N$ as dM,
  P$ as dN,
  tu as dO,
  Or as dP,
  T3 as dQ,
  rc as dR,
  O$ as dS,
  C$ as dT,
  Ms as dU,
  Cl as dV,
  Gu as dW,
  B$ as dX,
  dt as dY,
  t6 as dZ,
  r2 as d_,
  Z3 as da,
  Us as db,
  vd as dc,
  $t as dd,
  G$ as de,
  Et as df,
  n6 as dg,
  e6 as dh,
  As as di,
  I3 as dj,
  ys as dk,
  qf as dl,
  Co as dm,
  er as dn,
  zu as dp,
  K3 as dq,
  G3 as dr,
  $s as ds,
  Uu as dt,
  kl as du,
  W$ as dv,
  Y3 as dw,
  X$ as dx,
  Q$ as dy,
  Y$ as dz,
  Ax as e,
  E$ as e0,
  O3 as e1,
  q3 as e2,
  Hf as e3,
  U3 as e4,
  R0 as e5,
  Ml as e6,
  G2 as e7,
  bs as e8,
  L3 as e9,
  Ka as ea,
  N3 as eb,
  D3 as ec,
  Ue as ed,
  V3 as ee,
  Vu as ef,
  Eb as f,
  y3 as g,
  rn as h,
  l3 as i,
  k3 as j,
  r3 as k,
  Y8 as l,
  Yk as m,
  qs as n,
  e3 as o,
  hx as p,
  i3 as q,
  pi as r,
  gi as s,
  Se as t,
  ow as u,
  z8 as v,
  p3 as w,
  V8 as x,
  wn as y,
  d3 as z
};
