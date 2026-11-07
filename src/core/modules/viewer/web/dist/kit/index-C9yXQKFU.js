/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, normalizeStyle as ge, unref as P, renderSlot as ue, createElementVNode as g, normalizeClass as Z, Fragment as z, renderList as te, defineComponent as ri, Comment as ii, h as Jn, cloneVNode as ci, createBlock as H, withCtx as D, createVNode as B, toDisplayString as $, createCommentVNode as C, ref as I, onMounted as Re, onBeforeUnmount as ft, reactive as Zn, shallowRef as Ke, watch as fe, onUnmounted as Be, inject as Oe, useAttrs as Xn, computed as T, resolveDynamicComponent as ht, mergeProps as Le, useId as fs, resolveDirective as ui, withDirectives as Ye, createTextVNode as ee, Teleport as hs, nextTick as mt, Transition as jt, withModifiers as xe, TransitionGroup as tl, shallowReactive as di, isRef as Us, onScopeDispose as ms, resolveComponent as fi, useModel as Wa, getCurrentInstance as hi, mergeModels as Ha, getCurrentScope as nl, provide as al, onErrorCaptured as mi, toHandlers as pi, createSlots as gi, vShow as sl, useSlots as vi, withKeys as Xt, vModelText as Dn, normalizeProps as yi, guardReactiveProps as bi, defineAsyncComponent as wi } from "vue";
function ol(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const Y = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, ki = 1600, xi = {
  __name: "Shimmer",
  setup(e) {
    const t = ol(ki);
    return (n, a) => (c(), h("span", {
      class: "shimmer",
      style: ge(P(t))
    }, null, 4));
  }
}, Gt = /* @__PURE__ */ Y(xi, [["__scopeId", "data-v-6c018b03"]]), $i = { class: "skeleton-line" }, Mi = 2e3, Si = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = ol(Mi);
    return (n, a) => (c(), h("span", $i, [
      ue(n.$slots, "default", {}, void 0, !0),
      g("span", {
        class: Z(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(z, null, te(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: Z(["bar", { still: e.still }]),
          style: ge({ ...P(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, pt = /* @__PURE__ */ Y(Si, [["__scopeId", "data-v-484fe8a0"]]), Pt = ri({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== ii);
      return a.length !== 1 ? Jn(z, { key: n }, a) : a[0].key == null ? ci(a[0], { key: n }) : a[0];
    };
  }
}), _i = ["aria-label"], Ei = ["aria-label"], Ai = ["aria-label"], Ci = ["aria-label"], Oi = ["aria-label"], Ti = ["aria-label"], Ri = ["aria-label"], Ii = {
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
      messages: D(() => [
        g("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(z, null, te(t, (u) => B(Gt, {
            key: u.id,
            class: Z(["skeleton-message", { mine: u.mine }]),
            style: ge({ width: `${u.width}%`, height: `${u.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, _i)
      ]),
      older: D(() => [
        g("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(z, null, te(t.slice(0, 3), (u) => (c(), H(Gt, {
            key: u.id,
            class: Z(["skeleton-message", { mine: u.mine }]),
            style: ge({ width: `${u.width}%`, height: `${u.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, Ei)
      ]),
      cards: D(() => [
        g("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(z, null, te(e.count, (u) => (c(), h("div", {
            key: u,
            class: "skeleton-card"
          }, [
            (c(), h(z, null, te(n, (f) => B(pt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Ai)
      ]),
      file: D(() => [
        g("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(z, null, te(e.count, (u) => (c(), h("div", {
            key: u,
            class: "skeleton-file"
          }, [
            B(pt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (c(), h(z, null, te(s, (f) => B(pt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Ci)
      ]),
      page: D(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          B(pt, {
            class: "skeleton-heading",
            bars: r
          }),
          (c(!0), h(z, null, te(e.count, (u) => (c(), H(pt, {
            key: u,
            bars: P(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Oi)
      ]),
      text: D(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(z, null, te(e.count, (u) => (c(), H(pt, {
            key: u,
            bars: P(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Ti)
      ]),
      default: D(() => [
        g("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(z, null, te(e.count, (u) => (c(), H(pt, {
            key: u,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Ri)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, _t = /* @__PURE__ */ Y(Ii, [["__scopeId", "data-v-ef519c5f"]]), Bi = {
  key: 1,
  class: "empty-state titled"
}, Li = { class: "empty-state-title" }, Ni = { class: "empty-state-text" }, Di = {
  key: 2,
  class: "empty-state"
}, ji = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), H(_t, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", Bi, [
      g("p", Li, $(e.title), 1),
      g("p", Ni, [
        ue(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", Di, [
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Qt = /* @__PURE__ */ Y(ji, [["__scopeId", "data-v-b27e89b0"]]), Pi = { class: "fold-group" }, qi = ["aria-expanded"], Fi = { class: "fold-label" }, Wi = {
  key: 0,
  class: "fold-count"
}, Hi = {
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
    return (a, s) => (c(), h("div", Pi, [
      g("button", {
        type: "button",
        class: Z(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        g("span", Fi, $(e.label), 1),
        e.count !== "" ? (c(), h("span", Wi, $(e.count), 1)) : C("", !0),
        g("span", {
          class: Z(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, qi),
      e.open ? ue(a.$slots, "default", {}, void 0, !0, 0) : C("", !0)
    ]));
  }
}, X5 = /* @__PURE__ */ Y(Hi, [["__scopeId", "data-v-9ef1865c"]]), Ui = 150, zi = () => Ui;
function ps(e, t, n = zi(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function Vi(e, t, n) {
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
const Gi = 50, zs = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function Q5(e) {
  const t = We().sources.find((n) => n.key === e);
  return t ? Ua(t.read, t.events) : Ua("", []);
}
function ll(e, t, n, a, s = () => !1) {
  const o = I([]), l = I(null), r = I(""), i = I(!1), d = performance.now(), u = I(!1), f = I(""), m = I(null), y = /* @__PURE__ */ new Set();
  let v = null;
  function S(p) {
    return s() ? (y.add(p), v ?? (v = new Promise((E) => setTimeout(() => E(_()), Gi)))) : R(p);
  }
  async function _() {
    const p = new Set(y);
    y.clear(), v = null;
    const E = j, A = await t({ ids: [...p].join(","), limit: p.size });
    if (E !== j) return;
    if (!A.ok) return b();
    const O = new Map(A.value.rows.map((N) => [N.id, N]));
    o.value = o.value.flatMap((N) => p.has(N.id) ? O.has(N.id) ? [O.get(N.id)] : [] : [N]);
  }
  async function R(p) {
    const E = j, A = await t({ "before-id": p + 1, limit: 1 });
    if (E !== j) return;
    if (!A.ok) return b();
    const O = A.value.rows.find((N) => N.id === p);
    o.value = O ? o.value.map((N) => N.id === p ? O : N) : o.value.filter((N) => N.id !== p);
  }
  async function F(p) {
    if (a() && String((p == null ? void 0 : p.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((ne) => ne.id !== p.row_id));
    if (a() && (p != null && p.row_id) && !String(p.event ?? "").endsWith(".create") && o.value.some((ne) => ne.id === p.row_id)) return S(p.row_id);
    if (!(a() && o.value.length && String((p == null ? void 0 : p.event) ?? "").endsWith(".create"))) return b();
    const A = Math.max(...o.value.map((ne) => ne.id)), O = j, N = await t({ "after-id": A });
    if (O !== j) return;
    if (!N.ok) return b();
    const X = new Set(o.value.map((ne) => ne.id));
    o.value = [...N.value.rows.filter((ne) => !X.has(ne.id)), ...o.value];
  }
  async function J() {
    if (!u.value || !o.value.length) return !1;
    const p = j, E = Math.min(...o.value.map((N) => N.id)), A = await t({ "before-id": E });
    if (p !== j) return !1;
    if (!A.ok || !A.value.rows.length) return u.value = !1;
    u.value = zs(A.value, n());
    const O = new Set(o.value.map((N) => N.id));
    return o.value = [...o.value, ...A.value.rows.filter((N) => !O.has(N.id))], !0;
  }
  let j = 0;
  function L(p, E) {
    var N, X;
    const A = p.ok ? e.shared ? [p.value] : ((N = p.value) == null ? void 0 : N.rows) ?? [] : [];
    p.ok && (o.value = E(A)), l.value = p.ok ? p.value : null;
    const O = A.length ? Math.min(...A.map((ne) => ne.id)) : 0;
    p.ok && ((X = p.value) != null && X.rows) && !o.value.some((ne) => ne.id < O) && (u.value = !e.shared && zs(p.value, n())), r.value = p.ok ? "" : p.error, ps(d, () => i.value = !0);
  }
  async function q(p) {
    const E = ++j, A = await t({});
    E === j && L(A, p);
  }
  const w = (p) => {
    if (!a() || !p.length) return p;
    const E = Math.min(...p.map((O) => O.id)), A = Math.max(...p.map((O) => O.id));
    return [...o.value.filter((O) => O.id > A), ...p, ...o.value.filter((O) => O.id < E)];
  }, b = () => q(w), x = (p) => L(p, w), M = () => q((p) => p);
  async function k(p, E = null) {
    const A = await Vi(E && { target: o, fields: { value: E(o.value) } }, p, e.run);
    return f.value = A.ok ? "" : A.error, m.value = A.ok ? A.value : null, await b(), A;
  }
  return { rows: o, listing: l, failure: r, loaded: i, more: u, load: b, loadLatest: M, older: J, act: k, actionFailure: f, answer: m, context: e, heard: F, showFirst: x };
}
const Ki = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function Ua(e, t, { incremental: n = !1 } = {}) {
  var r;
  const a = Number(((r = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : r[1]) ?? 50), s = We(), l = ll(s, (i) => s.read(s.shared && !Object.keys(i).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Ki(i)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Yi = 2e3;
function gs(e, t, n = Yi) {
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
const rl = typeof document < "u" && document.documentElement.classList.contains("phone"), il = 120;
var Qo;
const ua = globalThis[Qo = Symbol.for("journal.pressed")] ?? (globalThis[Qo] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Ji(e = 0) {
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
function cl(e = window) {
  if (!za(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    za(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Va = "journal.stale-build-reload", Zi = 'script[type="module"][src*="/assets/index-"]', Vs = (e) => {
  var t;
  return ((t = e.querySelector(Zi)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Xi(e = document, t = (a, s) => Me.quietRead(a, s), n = () => cl(window)) {
  const a = Vs(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Vs(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let da = "";
function Qi(e, t = () => cl(window)) {
  if (!e) return !1;
  const n = !!da && da !== e;
  return da = e, n && t(), n;
}
const ec = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function tc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Va) === e.message) return !1;
    t.setItem(Va, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function nc(e = window.sessionStorage) {
  try {
    e.removeItem(Va);
  } catch {
    return;
  }
}
const ac = 2e3, sc = 3e4, Ue = Zn({ starting: !1, external: !1, late: !1, offline: !1 }), ul = () => Ue.starting, oc = 3;
let vn = 0, Ga = 0, dl = 0, fl = [];
async function lc() {
  try {
    const e = await Me.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ue.external };
  }
}
let Gs = null;
const rc = () => Gs ?? (Gs = lc().finally(() => Gs = null));
function ic() {
  clearTimeout(Ga), clearTimeout(dl), Ga = 0, Object.assign(Ue, { starting: !1, external: !1, late: !1, offline: !1 }), fl.splice(0).forEach((e) => e()), Xi();
}
async function cc() {
  Ue.offline = !navigator.onLine;
  const e = await rc();
  if (Ue.external = e.updating, vn = !e.restarting && !e.updating && e.reachable ? vn + 1 : 0, vn < oc) return;
  vn = 0, (!Qi(e.started_at) || za()) && ic();
}
function hl() {
  Ga = setTimeout(async () => {
    await cc(), Ue.starting && hl();
  }, ac);
}
function uc() {
  Ue.starting || (Ue.starting = !0, Ue.offline = !navigator.onLine, hl(), dl = setTimeout(() => Ue.late = !0, sc));
}
const dc = () => Ue.starting ? new Promise((e) => fl.push(e)) : Promise.resolve();
function ml(e, t, n = 0) {
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
function fc(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class hc {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = ml(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = fc(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const st = "viewer.shell", yn = 2e4, mc = 4, Ks = "/api/read-lines", pc = 5e3, gc = 403, Ys = "/api/repeated-lines", vc = 10, yc = 2e3, bc = 3e5, e4 = 6e5, bn = 6, wc = 500, kc = "/journal/summary", Js = "/api/server-state", xc = 2e4, wn = rl ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, $c = (e) => e.split("?")[0].endsWith(kc), Ka = (e, t) => Object.assign(new Error(t), { status: e });
async function Mc(e, t, n = Ka) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const Sc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), _c = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), Zs = (e) => e.split(" ").slice(0, 2).join(" "), Xe = "read", Tt = "write", Ec = "stream";
class Ac {
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = Zs(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one noun and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, i]) => o - i < yc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < vc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const r = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(Ys, { method: "POST", headers: { ...wn, "Content-Type": "application/json" }, body: r }, [{ window: st, line: Ys, kind: Tt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Ji(n ? il : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: _c(n.signal, s) } : n;
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
      throw o instanceof TypeError && uc(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= mc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(Ks, { headers: wn }, [{ window: st, line: Ks, kind: Xe }], pc).then(async (t) => {
      if (t.status === gc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw Ka(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new hc(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = Zs(n.join(" ")), r = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
    const r = a instanceof FormData, i = { method: t, headers: { ...wn, ...l, ...a === void 0 || r ? {} : { "Content-Type": "application/json" } }, body: Sc(a) }, d = s || (r ? bc : yn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, i, [{ window: st, line: n, kind: Xe }], d)) : await this.sent(n, i, [{ window: st, line: n, kind: Tt }], d);
    } catch (u) {
      if (t !== "GET" || !(u instanceof TypeError) || o <= 1) throw u;
      return await new Promise((f) => setTimeout(f, wc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = bn, l = {}) {
    this.watcher("sent", t, n, a);
    const r = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return Mc(r, `${r.status} ${r.statusText}`).catch((i) => {
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
    return t !== "GET" ? this.send(t, n, a, s, bn, o).then((r) => (this.written(n), r)) : ul() && !$c(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: st, line: t, kind: Ec }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Js, { cache: "no-store" }, [{ window: st, line: Js, kind: Xe }], xc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = st, line: s = t, limit: o = yn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? Xe : Tt;
    return l === Tt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const fa = Symbol.for("journal.transport"), Me = globalThis[fa] ?? (globalThis[fa] = new Ac());
class Cc {
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
      n.patterns.some((a) => vs(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function vs(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const Oc = 50, Tc = "refresh", Rc = 1e3, Ic = "requested", Bc = "after_window", Lc = 50, kn = ".*", Nc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function Dc(e) {
  const t = {}, n = Zn({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {};
  let r = {}, i = 0, d = 0;
  function u(w) {
    const b = () => r[w] ?? r[`${w.slice(0, w.lastIndexOf("."))}.*`] ?? {}, x = I(void 0), M = ll(e, async (k) => {
      const p = await y(w, k);
      return p.ok && !Object.keys(k).length && (x.value = p.value), p;
    }, () => b().page_size || Lc, () => !!b().page_size, () => !!b().reads_ids);
    return t[w] = { ...M, data: x, readAt: 0 };
  }
  const f = new Proxy({}, { get: (w, b) => typeof b != "string" || b.startsWith("__v") ? void 0 : t[b] ?? u(b) }), m = (w) => (r[w].loading !== Ic || w.endsWith(kn)) && (!r[w].tab || r[w].tab === n.tab);
  function y(w, b = {}) {
    return new Promise((x) => {
      a.push({ name: w, flags: b, resolve: x }), a.length === 1 && setTimeout(v);
    });
  }
  async function v() {
    const w = /* @__PURE__ */ new Map(), b = a.splice(0).filter((k) => {
      const p = JSON.stringify(k.flags);
      return w.has(k.name) || w.set(k.name, p), w.get(k.name) === p ? !0 : (a.push(k), !1);
    });
    a.length && setTimeout(v);
    const x = Object.fromEntries(b.flatMap(({ name: k, flags: p }) => Object.entries(p).map(([E, A]) => [`${k}.${E}`, A]))), M = await e.readKeys({ only: [...new Set(b.map(({ name: k }) => k))], state: { ...n, ...x } });
    b.forEach(({ name: k, resolve: p }) => p(M.ok ? M.value.keys[k] : M));
  }
  async function S(w) {
    const b = ++d;
    (w.length ? w : Object.keys(r).filter((k) => !k.endsWith(kn) && r[k].loading === "first" && m(k))).forEach((k) => l[k] = b);
    const M = await e.readKeys({ only: w, state: { ...n } });
    return M.ok ? (L(M.value.declared), Object.entries(M.value.keys).forEach(([k, p]) => {
      (l[k] ?? 0) > b || (l[k] = b, f[k].readAt = Date.now(), p.ok && (f[k].data.value = p.value), f[k].showFirst(p));
    }), !0) : (M.failure !== "cancelled" && (w.length ? w : Object.keys(t)).filter((k) => (l[k] ?? 0) <= b).forEach((k) => f[k].showFirst(M)), !1);
  }
  function _(w) {
    const b = Nc(w);
    return b.length ? (b.forEach((x) => o.names.add(x)), o.answer ?? (o.answer = new Promise((x) => setTimeout(() => {
      const M = [...o.names];
      o.names.clear(), o.answer = null, x(S(M));
    })))) : S([]);
  }
  function R(w) {
    w.forEach((b) => s.add(b)), clearTimeout(i), i = setTimeout(() => {
      const b = [...s];
      s.clear(), b.length && S(b);
    }, Oc);
  }
  const F = (w) => w.endsWith(kn) ? Object.keys(t).filter((b) => b.startsWith(w.slice(0, -1)) && t[b].readAt) : [w], J = (w) => (r[w] ?? r[`${w.split(".")[0]}.*`]).reload_seconds;
  function j(w) {
    const b = Object.keys(r).filter((M) => w.event === Tc || r[M].events.some((k) => vs(k, w.event)));
    b.filter((M) => r[M].page_size).forEach((M) => f[M].heard(w));
    const x = b.filter((M) => !r[M].page_size);
    x.filter((M) => !m(M)).forEach((M) => f[M].readAt = 0), R(x.filter(m).flatMap(F));
  }
  function L(w) {
    if (Object.keys(r).length) return;
    r = w;
    const b = [...new Set(Object.values(w).flatMap((M) => M.events))];
    b.length && e.follow(b, j);
    const x = Object.keys(w).filter((M) => w[M].loading === Bc);
    x.length && S(x);
  }
  fe(() => n.tab, () => {
    const w = Object.keys(r).filter((b) => !b.endsWith(kn) && m(b) && !f[b].readAt);
    w.length && S(w);
  }), Be(() => clearTimeout(i));
  function q() {
    const w = Date.now(), b = Object.keys(r).filter((x) => r[x].reload_seconds > 0 && m(x)).flatMap(F).filter((x) => w - f[x].readAt >= J(x) * 1e3);
    b.length && R(b);
  }
  return gs(q, () => e.visible.value, Rc), queueMicrotask(() => S([])), { props: f, state: n, reload: _, readKey: y };
}
const jc = Symbol("open-view"), Ne = Symbol.for("journal.window-context"), pl = Symbol("dock-card");
function Pc(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = Dc(e));
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
  return Pc(e);
}
const qc = (e, t) => e(pl, t), t4 = () => Oe(pl), Fc = ["data-icon", "stroke-width", "innerHTML"], ye = {
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
    }, null, 12, Fc));
  }
}, Wc = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: ge({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Hc = /* @__PURE__ */ Y(Wc, [["__scopeId", "data-v-eb453d6f"]]), Uc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
      const f = setTimeout(() => s.value = !0, il);
      try {
        await Promise.all(u);
      } finally {
        clearTimeout(f), s.value = !1;
      }
    }
    return (d, u) => (c(), H(ht(e.href ? "a" : "button"), Le(a.value, {
      type: e.href ? void 0 : P(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: r.value,
      onClick: i
    }), {
      default: D(() => [
        g("span", {
          class: Z(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (c(), H(ye, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : C("", !0),
          ue(d.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (c(), H(Hc, {
          key: 0,
          class: "btn-spinner"
        })) : C("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), de = /* @__PURE__ */ Y(Uc, [["__scopeId", "data-v-ededdadf"]]), zc = ["aria-checked", "aria-haspopup", "onClick"], Vc = {
  key: 0,
  class: "segmented-dot"
}, Gc = {
  key: 1,
  class: "segmented-note"
}, Kc = {
  key: 2,
  class: "segmented-count"
}, Yc = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = fs();
    return (s, o) => {
      const l = ui("tip");
      return c(), h("span", {
        class: Z(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(z, null, te(e.options, (r) => Ye((c(), h("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: Z(["segmented-option", { on: r.key === e.value }]),
          onClick: (i) => n("pick", r.key)
        }, [
          r.dot ? (c(), h("span", Vc)) : C("", !0),
          ee(" " + $(r.label) + " ", 1),
          r.note ? (c(), h("small", Gc, $(r.note), 1)) : C("", !0),
          r.count !== void 0 ? (c(), h("em", Kc, $(r.count), 1)) : C("", !0)
        ], 10, zc)), [
          [l, r.tip || r.title, `${P(a)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Nt = /* @__PURE__ */ Y(Yc, [["__scopeId", "data-v-c89bc92d"]]), Jc = {
  key: 0,
  class: "more-items"
}, Zc = {
  key: 0,
  role: "alert"
}, Xc = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (c(), h("div", Jc, [
      e.failure ? (c(), h("p", Zc, $(e.failure), 1)) : C("", !0),
      e.more ? (c(), H(de, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: D(() => [
          ee($(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : C("", !0)
    ])) : C("", !0);
  }
}, Qn = /* @__PURE__ */ Y(Xc, [["__scopeId", "data-v-10464014"]]), Qc = { class: "link-group" }, eu = {
  class: "group-label",
  "data-link-kind": ""
}, tu = ["disabled", "onClick"], nu = { class: "title" }, au = { class: "relations" }, su = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(!1), o = T(() => s.value ? n.rows : n.rows.slice(0, 3)), l = T(() => `${n.model.replaceAll("_", " ").replace(/^./, (u) => u.toUpperCase())} ${n.count}`), r = (u) => u.endpoint.unavailable || !u.endpoint.open_ref, i = (u) => ({ [n.linkAttribute]: !0, "data-link-model": u.endpoint.model, "data-link-id": u.endpoint.id }), d = (u) => `${u.endpoint.model === "doc" && u.endpoint.id === n.documentId ? "Design document" : u.endpoint.model.replaceAll("_", " ").replace(/^./, (f) => f.toUpperCase())} ${u.endpoint.id}, ${u.relations.map((f) => f.replaceAll("_", " ")).join(", ")}`;
    return (u, f) => (c(), h("div", Qc, [
      g("div", eu, $(l.value), 1),
      (c(!0), h(z, null, te(o.value, (m) => (c(), h("button", Le({
        key: `${m.endpoint.model}:${m.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, i(m), {
        disabled: r(m),
        onClick: (y) => a("open", m)
      }), [
        g("span", nu, $(m.endpoint.title), 1),
        g("span", au, [
          ee($(d(m)), 1),
          r(m) ? (c(), h(z, { key: 0 }, [
            ee(" · Unavailable")
          ], 64)) : C("", !0)
        ])
      ], 16, tu))), 128)),
      e.rows.length > 3 && !s.value ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: f[0] || (f[0] = (m) => s.value = !0)
      }, "Show more")) : C("", !0)
    ]));
  }
}, ou = /* @__PURE__ */ Y(su, [["__scopeId", "data-v-be6f079c"]]), lu = ["data-loaded"], ru = ["disabled", "onClick"], iu = { class: "title" }, cu = { class: "relations" }, uu = { key: 3 }, du = {
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
    const n = e, a = t, s = I([]), o = I({}), l = I(0), r = I(""), i = I(null), d = I(!1), u = I("");
    let f = 0;
    const m = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, y = (b) => m[b] || `${b.replaceAll("_", " ").replace(/^./, (x) => x.toUpperCase())}s`, v = T(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((b, x) => b + x, 0) },
      ...Object.entries(o.value).map(([b, x]) => ({ key: b, label: y(b), count: x }))
    ]), S = T(() => {
      const b = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((M) => M.endpoint.model))].map((M) => [M, s.value.filter((k) => k.endpoint.model === M).length])), x = { doc: 0, task: 1, message: 2 };
      return Object.entries(b).sort(([M], [k]) => (x[M] ?? 3) - (x[k] ?? 3)).map(([M, k]) => ({ model: M, count: k, rows: s.value.filter((p) => p.endpoint.model === M) }));
    }), _ = (b) => b.endpoint.unavailable || !b.endpoint.open_ref, R = (b) => ({ [n.linkAttribute]: !0, "data-link-model": b.endpoint.model, "data-link-id": b.endpoint.id }), F = (b) => `${b.endpoint.model === "doc" && b.endpoint.id === n.documentId ? "Design document" : b.endpoint.model.replaceAll("_", " ").replace(/^./, (x) => x.toUpperCase())} ${b.endpoint.id}, ${b.relations.map((x) => x.replaceAll("_", " ")).join(", ")}`;
    async function J(b = 1) {
      const x = ++f;
      d.value = !0, u.value = "";
      const M = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(b), "--page-size", String(n.pageSize)];
      n.outsidePlan && M.push("--outside-plan"), n.documentId && M.push("--first-counterpart", `doc:${n.documentId}`), r.value && M.push("--kind", r.value);
      try {
        const k = await n.read(M);
        if (x !== f) return;
        if (!k.ok) {
          u.value = k.error;
          return;
        }
        const p = k.value.counterparts ?? [], E = b === 1 ? p : [...s.value, ...p];
        s.value = [...new Map(E.map((A) => [`${A.endpoint.model}:${A.endpoint.id}`, A])).values()], o.value = k.value.kinds ?? {}, l.value = k.value.total, i.value = k.value.next_page ?? null;
      } catch (k) {
        x === f && (u.value = k.message);
      } finally {
        x === f && (d.value = !1);
      }
    }
    function j(b) {
      if (_(b)) return;
      const [x, M] = b.endpoint.open_ref.split(":");
      a("open", { table: x, id: Number(M) });
    }
    function L(b) {
      r.value = b, J();
    }
    const q = () => !d.value && i.value && J(i.value), w = T(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return fe(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], i.value = null, r.value = "", J();
    }, { immediate: !0 }), (b, x) => s.value.length || d.value || u.value || e.empty ? (c(), h("section", {
      key: 0,
      class: Z(["resource-links", { grouped: e.grouped }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      v.value.length > 2 ? (c(), H(Nt, {
        key: 0,
        options: v.value,
        value: r.value,
        wrap: "",
        onPick: L
      }, null, 8, ["options", "value"])) : C("", !0),
      e.grouped ? (c(!0), h(z, { key: 1 }, te(S.value, (M) => (c(), H(ou, {
        key: M.model,
        model: M.model,
        count: M.count,
        rows: M.rows,
        "link-attribute": e.linkAttribute,
        "document-id": e.documentId,
        onOpen: j
      }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (c(!0), h(z, { key: 2 }, te(s.value, (M) => (c(), h("button", Le({
        key: `${M.endpoint.model}:${M.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, R(M), {
        disabled: _(M),
        onClick: (k) => j(M)
      }), [
        g("span", iu, $(M.endpoint.title), 1),
        g("span", cu, [
          ee($(F(M)), 1),
          _(M) ? (c(), h(z, { key: 0 }, [
            ee(" · Unavailable")
          ], 64)) : C("", !0)
        ])
      ], 16, ru))), 128)),
      !s.value.length && !d.value && !u.value && e.empty ? (c(), h("p", uu, $(e.empty), 1)) : C("", !0),
      B(Qn, {
        more: !!i.value,
        loading: d.value,
        failure: u.value,
        label: w.value,
        onMore: q
      }, null, 8, ["more", "loading", "failure", "label"])
    ], 10, lu)) : C("", !0);
  }
}, fu = /* @__PURE__ */ Y(du, [["__scopeId", "data-v-949d0a9f"]]), hu = (e, t, n) => Math.max(t, Math.min(n, e)), mu = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, gl = /* @__PURE__ */ new WeakMap(), pu = (e, t) => gl.set(e, t);
function gu(e, t) {
  for (let n = t; n; n = gl.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function vl(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !gu(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Be(() => window.removeEventListener("click", n));
}
const Ct = 8, vu = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
      const E = p.closest(".pane, .float-window");
      return E ? u(E.getBoundingClientRect()) : d();
    }, m = (p, E) => `${Math.max(0, p ? Math.min(p, E) : E)}px`;
    function y(p, E) {
      return {
        below: p.bottom - E.bottom - a.gap - Ct,
        above: E.top - p.top - a.gap - Ct,
        across: p.right - p.left - 2 * Ct
      };
    }
    function v(p) {
      const E = f(a.anchor), A = y(E, p);
      return r.value.w <= A.across && r.value.h <= Math.max(A.below, A.above) ? E : d();
    }
    const S = T(() => {
      if (!i.value) return l.value;
      const p = i.value, E = v(p), A = y(E, p), { w: O, h: N } = r.value, X = a.align === "auto" ? p.left + p.right > E.left + E.right : a.align === "right", ne = hu(X ? p.right - O : p.left, E.left + Ct, Math.max(E.left + Ct, E.right - O - Ct)), he = N > A.below && A.above > A.below ? { bottom: `${window.innerHeight - p.top + a.gap}px`, maxHeight: m(a.maxHeight, A.above) } : { top: `${p.bottom + a.gap}px`, maxHeight: m(a.maxHeight, A.below) };
      return { ...l.value, ...he, left: `${ne}px`, maxWidth: m(a.maxWidth, A.across) };
    }), _ = n, R = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function F(p) {
      const E = R(), A = E.indexOf(document.activeElement);
      E[(A + p + E.length) % E.length].focus();
    }
    const J = { ArrowDown: () => F(1), ArrowUp: () => F(-1), Escape: () => _("close") }, j = (p) => J[p.key] && (p.preventDefault(), J[p.key]()), L = () => s.value && (r.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let q = 0;
    const w = new ResizeObserver(() => {
      cancelAnimationFrame(q), q = requestAnimationFrame(L);
    });
    vl(s, (p) => a.anchor && !a.anchor.contains(p.target) && _("close"));
    const b = (p, E) => ["top", "left", "right", "bottom"].some((A) => Math.abs(p[A] - E[A]) > 1), x = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let M = 0;
    function k() {
      if (a.anchor) {
        const p = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || x(p)) return _("close");
        b(p, i.value) && (i.value = p);
      }
      M = requestAnimationFrame(k);
    }
    return Re(() => {
      a.anchor && s.value && pu(s.value, a.anchor), L(), s.value && w.observe(s.value), !a.plain && R()[0] && R()[0].focus(), k();
    }), Be(() => {
      w.disconnect(), cancelAnimationFrame(M), cancelAnimationFrame(q);
    }), t({ element: s }), (p, E) => (c(), H(hs, {
      to: "body",
      disabled: !e.anchor
    }, [
      g("div", Le({
        ref_key: "panel",
        ref: s
      }, p.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: S.value,
        onKeydown: j
      }), [
        ue(p.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ea = /* @__PURE__ */ Y(vu, [["__scopeId", "data-v-3d203970"]]), yu = { class: "split-button" }, bu = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = I(null), s = I(!1), o = () => s.value = !1;
    return (l, r) => (c(), h("span", yu, [
      B(de, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: r[0] || (r[0] = (i) => n("main"))
      }, {
        default: D(() => [
          ue(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      g("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        B(de, {
          variant: e.variant,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: r[1] || (r[1] = (i) => s.value = !s.value)
        }, {
          default: D(() => [
            B(ye, { name: "caret" })
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
        default: D(() => [
          ue(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : C("", !0)
    ]));
  }
}, wu = /* @__PURE__ */ Y(bu, [["__scopeId", "data-v-c258494d"]]), ku = 0, xu = "/api/lines", $u = "/api/line", Xs = 5e3, Qs = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), eo = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), ha = (e) => JSON.stringify(e.line), to = () => new DOMException("cancelled", "AbortError");
class Mu {
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
    this.timer ?? (this.timer = setTimeout(() => Me.whenFree(() => this.send()), ku));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(to())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(to()), n.abort();
    });
    t.forEach((o, l) => {
      var r;
      return (r = o.signal) == null ? void 0 : r.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Me.sent(xu, Qs({ lines: t.map((r) => r.body) }, n.signal), t.map((r) => eo(r.body, Xe)), Xs);
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
    await this.alone(t, Xe), Date.now() - n < Xs ? this.slow.delete(ha(t.body)) : this.slow.add(ha(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Me.sent($u, Qs(t.body, t.signal), [eo(t.body, n)], n === Xe ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const yl = new Mu(), Su = "/api/window";
function _u(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${Su}?${o}`, r = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, i = (d) => Me.whenFree(async () => {
    const u = await Me.sent(l, { signal: d, headers: r }, [{ window: e, line: l, kind: Xe }]);
    if (!u.ok) throw new Error((await u.json()).error);
    return u.json();
  });
  return Me.joined(`${e} ${n.join(",")} ${o}`, i, s);
}
const bl = /* @__PURE__ */ new Map();
class Eu {
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
function n4(e, t) {
  const n = new Eu(e, t);
  return bl.set(e, n), n.load().catch(() => {
  }), n;
}
const ys = (e) => bl.get(e);
function Au(e, t, n) {
  const a = ys(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function Cu(e, t) {
  if (!e) return !0;
  const n = ys(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Ou = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let wl = {};
async function a4(e = (t) => Me.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (wl = (await t.json()).states);
}
const bs = (e, t) => {
  var n;
  return (n = wl[e]) == null ? void 0 : n[t];
}, kl = (e, t) => {
  var n;
  return ((n = bs(e, t)) == null ? void 0 : n.label) ?? Ou(t);
}, xl = (e, t) => {
  var n;
  return ((n = bs(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, Tu = (e, t) => {
  var n;
  return ((n = bs(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, Ru = Symbol("pane-page"), Iu = Symbol("inspector-host"), $l = { 1: "refused", 2: "usage", 3: "fault" }, Bu = 100, Lu = 50, Nu = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, Du = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function ju({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: r, options: i = I({}), declared: d = [], page: u = null, setOption: f = () => {
}, autoScroll: m = "", tabs: y = [], sources: v = [], links: S = {}, search: _ = {}, readOnly: R = !1, shared: F = null }) {
  const J = /* @__PURE__ */ new Map(), j = new AbortController(), L = I(!1), q = performance.now();
  let w = 0, b = 0, x = () => {
  };
  const M = new Promise((N) => x = N);
  j.signal.addEventListener("abort", x, { once: !0 });
  const k = () => {
    clearTimeout(b), b = setTimeout(() => {
      w === 0 && ps(q, () => {
        L.value = !0, x();
      });
    }, Lu);
  }, p = (N, X) => (w += 1, Rt(e, N, t, j.signal, X).finally(() => {
    w -= 1, k();
  })), E = (N, X) => (k(), M.then(() => j.signal.aborted ? nt : Rt(e, N, t, j.signal, X))), A = ({ only: N = [], state: X = {} } = {}) => (w += 1, qu(() => _u(e, t, N, X, j.signal), j.signal).finally(() => {
    w -= 1, k();
  })), O = (N, { unbatched: X = !1, deferred: ne = !1 } = {}) => {
    const ie = J.get(N);
    if (ie && performance.now() - ie.at < Bu) return ie.answer;
    const he = ne && !L.value ? E(N, X) : p(N, X);
    return J.set(N, { answer: he, at: performance.now() }), he;
  };
  return {
    answered: L,
    settle: k,
    window: e,
    environment: t,
    agent: n,
    page: u,
    visible: T(() => a()),
    permissions: s,
    autoScroll: m,
    tabs: y,
    sources: v,
    links: S,
    search: _,
    readOnly: R,
    shared: F,
    read: O,
    readKeys: A,
    run: (N) => Rt(e, N, t, j.signal),
    upload: (N) => Wu(N, e, j.signal),
    cancel: () => j.abort(),
    signal: j.signal,
    subscriptions: l,
    follow: (N, X) => l.follow(e, [N].flat().filter((ne) => o.some((ie) => vs(ie, ne))), (ne) => {
      J.clear(), X(ne);
    }, a),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (N) => T(() => {
      var X;
      return i.value[N] ?? ((X = d.find((ne) => ne.key === N)) == null ? void 0 : X.default);
    }),
    setting: async (N, X) => {
      const ne = await O(`window setting ${e} ${N}`);
      return ne.ok ? ne.value.value : X;
    },
    setOption: f,
    keep: (N, X) => Rt(e, ["window", "save-setting", e, N, JSON.stringify(X)], t, j.signal)
  };
}
function Ml(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const nt = { ok: !1, failure: "cancelled", error: "" }, ws = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function Sl(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? nt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: $l[n.code] || "fault", error: Ml(n.error) };
  } catch {
    return t != null && t.aborted ? nt : { ok: !1, failure: "unreachable", error: ws };
  }
}
const Pu = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: $l[e.code] || "fault", error: Ml(e.error) };
async function qu(e, t) {
  try {
    const n = await e();
    return t.aborted ? nt : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, Pu(s)])) } };
  } catch {
    return t.aborted ? nt : { ok: !1, failure: "unreachable", error: ws };
  }
}
async function _l(e, t, n) {
  const a = await Sl(() => yl.read(e, t, n), t);
  return a.failure !== "unreachable" || !ul() ? a : (await dc(), t.aborted ? nt : _l(e, t, n));
}
function Rt(e, t, n, a = void 0, s = !1) {
  return Me.held(() => Fu(e, t, n, a, s), Me.knownRead(Array.isArray(t) ? t : ks(t)));
}
async function Fu(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : ks(t), environment: n };
  return await Me.isRead(o.line) ? Me.joined(JSON.stringify(o), (l, r) => _l({ ...o, attribution: r }, l, s), a, o).catch(() => nt) : Sl(() => yl.write({ ...o, attribution: {
    client_id: Me.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function Wu(e, t, n = void 0) {
  try {
    const a = await Me.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? nt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? nt : { ok: !1, failure: "unreachable", error: ws };
  }
}
function ks(e) {
  return [...e.matchAll(Nu)].map(([t]) => t.replace(Du, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Hu = (e) => `show-${e}`, s4 = (e, t, n) => e.filter((a) => {
  var s;
  return n(Hu((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), El = "messages.chat", Uu = {
  key: 0,
  class: "template-brief"
}, zu = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Vu = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I([]), o = I(""), l = T(() => s.value.map((d) => ({ key: String(d.id), label: d.title, note: d.module }))), r = T(() => s.value.find((d) => String(d.id) === n.value));
    async function i() {
      const d = await Rt(El, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!d.ok) {
        o.value = d.error;
        return;
      }
      s.value = d.value.rows;
      const u = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), f = s.value.find((m) => m.title === u);
      f && a("pick", String(f.id));
    }
    return i(), (d, u) => (c(), h(z, null, [
      B(Nt, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: u[0] || (u[0] = (f) => a("pick", f))
      }, null, 8, ["options", "value"]),
      r.value ? (c(), h("p", Uu, $(r.value.brief), 1)) : C("", !0),
      o.value ? (c(), h("p", zu, $(o.value), 1)) : C("", !0)
    ], 64));
  }
}, Gu = /* @__PURE__ */ Y(Vu, [["__scopeId", "data-v-14be8a5c"]]), Ku = { class: "form-field" }, Yu = { class: "form-field-head" }, Ju = ["for"], Zu = {
  key: 0,
  class: "form-field-aside"
}, Xu = {
  key: 0,
  class: "form-field-help"
}, Qu = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", Ku, [
      g("div", Yu, [
        g("label", {
          class: "form-field-label",
          for: t.$props.for
        }, $(e.label), 9, Ju),
        t.$slots.aside ? (c(), h("span", Zu, [
          ue(t.$slots, "aside", {}, void 0, !0)
        ])) : C("", !0)
      ]),
      ue(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", Xu, $(e.help), 1)) : C("", !0)
    ]));
  }
}, ed = /* @__PURE__ */ Y(Qu, [["__scopeId", "data-v-dd7cdcff"]]), Ya = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, td = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Xn(), n = T(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Ye((c(), h("textarea", Le({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [P(Ya), P(t).value]
    ]);
  }
}), nd = /* @__PURE__ */ Y(td, [["__scopeId", "data-v-e130a5b9"]]), ad = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = fs(), o = T(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, r) => (c(), H(ed, {
      label: e.field.label,
      for: P(s),
      "data-button-field": e.field.name
    }, {
      default: D(() => [
        B(Pt, { value: o.value }, {
          choice: D(() => [
            B(Nt, {
              id: P(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: r[0] || (r[0] = (i) => a("pick", i))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: D(() => [
            B(Gu, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: r[1] || (r[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: D(() => [
            B(nd, {
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
      default: D(() => [
        B(ye, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function sd(e, t, n, a = () => window) {
  Re(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Be(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const od = (e, t = () => !0) => sd("keydown", (n) => n.key === "Escape" && t() && e());
function Al(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = I(!1), s = T(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return od(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const ld = 80, Ot = Zn([]);
function Cl(e) {
  const t = Symbol("layer"), n = () => Ot.includes(t) && Ot.splice(Ot.indexOf(t), 1);
  return fe(
    e,
    (a) => {
      a && !Ot.includes(t) && Ot.push(t), a || n();
    },
    { immediate: !0 }
  ), Be(n), T(() => ld + Math.max(0, Ot.indexOf(t)));
}
let Ol = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Ol = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const rd = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function id(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(rd)];
    if (!l.length) return o.preventDefault();
    const [r, i] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), i.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === i && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  Re(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : Ol, document.addEventListener("keydown", s), mt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Be(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const cd = ["aria-modal", "aria-label", "aria-labelledby"], ud = {
  key: 0,
  class: "dialog-head"
}, dd = ["id", "tabindex"], fd = {
  key: 1,
  class: "dialog-foot"
}, hd = 500, md = 400, pd = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Al(a, n), r = Cl(s), i = I(null), d = I(null), u = I(null), f = fs(), m = I(!1), y = Date.now();
    n.modal && id(d, () => a("escape"), u);
    function v() {
      if (!n.modal) return n.closable && o();
      m.value = !0, setTimeout(() => m.value = !1, md);
    }
    function S(F) {
      !n.modal || Date.now() - y >= hd || ![" ", "Enter"].includes(F.key) || (F.preventDefault(), F.stopPropagation());
    }
    const _ = () => i.value && (i.value.scrollTop = i.value.scrollHeight), R = new MutationObserver(_);
    return fe(i, (F) => {
      R.disconnect(), F && n.follow && (R.observe(F, { childList: !0, subtree: !0, characterData: !0 }), _());
    }), Be(() => R.disconnect()), (F, J) => (c(), H(hs, { to: "body" }, [
      B(jt, {
        name: "dialog",
        appear: "",
        onAfterLeave: P(l)
      }, {
        default: D(() => [
          P(s) ? (c(), h("div", {
            key: 0,
            class: Z(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ge({ zIndex: P(r) }),
            onClick: xe(v, ["self"])
          }, [
            g("section", {
              ref_key: "panel",
              ref: d,
              class: Z(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: m.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? P(f) : void 0,
              onKeydownCapture: S
            }, [
              e.bare ? C("", !0) : (c(), h("header", ud, [
                g("h3", {
                  id: P(f),
                  ref_key: "heading",
                  ref: u,
                  tabindex: e.modal ? -1 : void 0
                }, $(e.title), 9, dd),
                e.closable ? (c(), H(xs, {
                  key: 0,
                  onClick: P(o)
                }, null, 8, ["onClick"])) : C("", !0)
              ])),
              g("div", {
                ref_key: "body",
                ref: i,
                class: Z(["dialog-body", { bare: e.bare }])
              }, [
                ue(F.$slots, "default", {}, void 0, !0)
              ], 2),
              F.$slots.foot ? (c(), h("footer", fd, [
                ue(F.$slots, "foot", {}, void 0, !0)
              ])) : C("", !0)
            ], 42, cd)
          ], 6)) : C("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Tl = /* @__PURE__ */ Y(pd, [["__scopeId", "data-v-6d1ecd98"]]), gd = (e, t, n = {}) => ks(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function cn(e, t, n, a = {}) {
  try {
    return await Cu(e.module, n) ? Rt(El, gd(e, t, a), n) : { ok: !1, error: "" };
  } catch (s) {
    return { ok: !1, error: s.message };
  }
}
const vd = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, ma = [
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
}, yd = ["secrets", "plugins"], Rl = Object.keys(ta).filter((e) => !(rl && yd.includes(e)));
T(() => Rl.map((e) => ({ name: e, ...ta[e] })));
const qt = (e) => ta[e], Il = new Map(Rl.flatMap((e) => [e, e.replace(/s$/, ""), ta[e].title.toLowerCase()].map((t) => [t, e]))), ct = (e) => Il.get(String(e).toLowerCase()) || "", Bl = [...Il.keys()].sort((e, t) => t.length - e.length).join("|"), bd = {
  class: "button-form",
  "data-button-form": ""
}, wd = {
  key: 0,
  class: "button-form-title"
}, kd = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, xd = { class: "button-form-actions" }, $d = {
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
    return (u, f) => (c(), H(Tl, {
      title: i.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: f[1] || (f[1] = (m) => a("close"))
    }, {
      default: D(() => {
        var m;
        return [
          g("div", bd, [
            (m = e.row) != null && m.title ? (c(), h("p", wd, $(e.row.title), 1)) : C("", !0),
            (c(!0), h(z, null, te(e.button.fields, (y) => (c(), H(ad, {
              key: y.name,
              field: y,
              value: s.value[y.name],
              environment: e.environment,
              onPick: (v) => s.value[y.name] = v
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (c(), h("p", kd, $(l.value), 1)) : C("", !0),
            g("div", xd, [
              B(de, {
                small: "",
                onClick: f[0] || (f[0] = (y) => a("close"))
              }, {
                default: D(() => [...f[2] || (f[2] = [
                  ee("Cancel", -1)
                ])]),
                _: 1
              }),
              B(de, {
                variant: "primary",
                small: "",
                disabled: !r.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: d
              }, {
                default: D(() => [...f[3] || (f[3] = [
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
}, Md = /* @__PURE__ */ Y($d, [["__scopeId", "data-v-f26c27a7"]]), Sd = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, _d = {
  key: 1,
  class: "menu-item-text"
}, Ed = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: Z(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", Sd, $(e.checked ? "✓" : ""), 1)) : C("", !0),
      e.description ? (c(), h("span", _d, [
        g("span", null, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        g("small", null, $(e.description), 1)
      ])) : ue(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Mt = /* @__PURE__ */ Y(Ed, [["__scopeId", "data-v-fec99974"]]), Ad = ["aria-busy"], Cd = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Od = {
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
    const n = e, a = t, s = T(() => ys(n.environment)), o = T(
      () => {
        var v;
        return !n.readOnly && ((v = s.value) == null ? void 0 : v.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = T(() => {
      var v;
      return !n.readOnly && ((v = s.value) == null ? void 0 : v.failed.value);
    }), r = () => s.value.load().catch(() => {
    }), i = T(() => n.readOnly ? [] : Au(n.environment, n.name, n.row)), d = I(null), u = I(""), f = I(!1), m = (v) => [v.from ? `From ${v.from}` : "", v.tip].filter(Boolean).join(" · ");
    async function y(v) {
      if (f.value || n.readOnly) return;
      if (v.fields.length) {
        d.value = v;
        return;
      }
      u.value = "", a("failure", ""), f.value = !0;
      const S = await cn(v, n.row, n.environment);
      f.value = !1, u.value = S.ok ? "" : S.error;
      const _ = v.label.toLowerCase() + (n.objectName && !v.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", S.ok ? "" : `Could not ${_}: ${S.error}`), S.ok && a("done");
    }
    return (v, S) => (c(), h("span", {
      class: Z(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (c(), h(z, { key: 0 }, [
        S[3] || (S[3] = g("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        B(de, {
          small: "",
          onClick: r
        }, {
          default: D(() => [...S[2] || (S[2] = [
            ee("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : o.value ? C("", !0) : (c(), h(z, { key: 1 }, [
        (c(!0), h(z, null, te(i.value, (_) => (c(), h(z, {
          key: _.name
        }, [
          _.menu.length ? (c(), H(wu, {
            key: 0,
            small: "",
            variant: _.primary ? "primary" : "ghost",
            disabled: f.value,
            "menu-label": _.menu_label || "More ways",
            title: m(_),
            "data-button": _.name,
            onMain: (R) => y(_)
          }, {
            menu: D(({ close: R }) => [
              (c(!0), h(z, null, te(_.menu, (F) => (c(), H(Mt, {
                key: F.label,
                description: F.description,
                onClick: (J) => (R(), y({ ..._, ...F, menu: [] }))
              }, {
                default: D(() => [
                  ee($(F.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: D(() => [
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
            onClick: (R) => y(_)
          }, {
            default: D(() => [
              ee($(_.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        u.value && !e.readOnly && !e.externalFailure ? (c(), h("span", Cd, $(u.value), 1)) : C("", !0),
        d.value && !e.readOnly ? (c(), H(Md, {
          key: d.value.runs,
          button: d.value,
          row: e.row,
          environment: e.environment,
          onClose: S[0] || (S[0] = (_) => d.value = null),
          onDone: S[1] || (S[1] = (_) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : C("", !0)
      ], 64))
    ], 10, Ad));
  }
}, Td = /* @__PURE__ */ Y(Od, [["__scopeId", "data-v-a07b49a4"]]), Rd = {
  class: "running",
  "data-running-command": ""
}, Id = ["title"], Bd = {
  key: "idle",
  class: "running-idle"
}, Ld = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", Rd, [
      B(jt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: D(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, $(e.text), 9, Id)) : (c(), h("span", Bd, $(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, o4 = /* @__PURE__ */ Y(Ld, [["__scopeId", "data-v-d3240219"]]), Nd = ["aria-checked", "aria-label", "title"], Dd = {
  key: 0,
  class: "switch-inner"
}, jd = {
  key: 0,
  class: "switch-word"
}, Pd = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("button", {
      type: "button",
      class: Z(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: s[0] || (s[0] = (o) => n("change", !e.on))
    }, [
      g("span", {
        class: Z(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (c(), h("span", Dd, $(e.word), 1)) : C("", !0),
        s[1] || (s[1] = g("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", jd, $(e.word), 1)) : C("", !0)
    ], 10, Nd));
  }
}, l4 = /* @__PURE__ */ Y(Pd, [["__scopeId", "data-v-1bfb90f3"]]);
function Ll(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function jn(e, t) {
  return Ll(() => localStorage, e, t);
}
function Nl(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function $s(e, t) {
  return Nl(() => localStorage, e, t);
}
function Dl(e, t) {
  fe(t, (n) => $s(e, n), { deep: !0 });
}
function qd(e, t) {
  return Ll(() => sessionStorage, e, t);
}
function Fd(e, t) {
  return Nl(() => sessionStorage, e, t);
}
const Pn = "journal.environment", jl = I(qd(Pn, jn(Pn, "")));
function Wd(e) {
  jl.value = e, Fd(Pn, e), $s(Pn, e);
}
const qn = I(location.hash), no = Ke(null), ao = { integrations: "mcp", library: "team" };
function Hd() {
  if (!no.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (ao[n]) {
    location.replace(`#/${[ao[n], ...a].join("/")}${t ? `?${t}` : ""}`), qn.value = location.hash;
    return;
  }
  !n || no.value(n) || (Wd(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), qn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  qn.value = location.hash, Hd();
});
const Ja = T(() => {
  const [e, t = ""] = qn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [r, i = ""] = l.split("@"), [d = "", u = "", f = ""] = r.split(":");
    return { table: d, id: Number(u), comment: Number(f) || 0, env: i };
  });
  return {
    env: jl.value,
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
}), Ms = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Ms.page(e)}?open=${t}`
};
function Ud(e = "", t = 0, n = "") {
  location.hash = Ms.page(e, t, n);
}
const zd = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Pl(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, r]) => `${l}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(zd).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Bt = {};
function r4(e, t) {
  return Bt[e] = t, () => Bt[e] === t && delete Bt[e];
}
function ql(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Bt[e]) != null && l.call(Bt, t))) return;
  const s = Ja.value.stack, o = s.findIndex((r) => r.table === e && r.id === t);
  Pl([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function Vd(e, t, n, a = 0, s = "") {
  if (e === Ja.value.env) return ql(t, n, a, s);
  const o = Ja.value.stack, l = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  Pl([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function Fe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? Vd(a, s, Number(o), 0, t) : ql(s, Number(o), 0, t);
}
function Gd(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function It(e) {
  const t = Gd(e);
  t && Fe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function i4(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Kd = { class: "inspector-part" }, Yd = { class: "inspector-part-title" }, Jd = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("section", Kd, [
      g("h4", Yd, $(e.title), 1),
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, c4 = /* @__PURE__ */ Y(Jd, [["__scopeId", "data-v-0da7fa52"]]), Zd = {
  key: 1,
  class: "row-list-failure"
}, Xd = ["data-row"], Qd = {
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
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", Zd, $(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), H(Qt, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: D(() => [
        ee($(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(z, { key: 3 }, [
      (c(), H(ht(e.arrival ? tl : "ul"), Le(n.value, { class: "row-list" }), {
        default: D(() => [
          (c(!0), h(z, null, te(e.rows, (r) => (c(), h("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            ue(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, Xd))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (r) => s(e.older))
      }, "Show more")) : C("", !0)
    ], 64));
  }
}, ef = /* @__PURE__ */ Y(Qd, [["__scopeId", "data-v-6c7ba696"]]), tf = {
  class: "agent-rows",
  "data-agent-rows": ""
}, nf = {
  key: 1,
  class: "agent-rows-note"
}, af = {
  key: 2,
  class: "agent-rows-note"
}, sf = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, of = ["data-agent-row", "onClick"], lf = { class: "agent-row-name" }, rf = { class: "agent-row-state" }, cf = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = T(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = T(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (c(), h("div", tf, [
      e.loaded ? e.failure ? (c(), h("p", nf, $(e.failure), 1)) : e.rows.length ? (c(), h(z, { key: 3 }, [
        g("p", sf, $(a.value) + " running", 1),
        (c(!0), h(z, null, te(n.value, (l) => (c(), h("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (r) => P(Fe)(`agents:${l.id}`)
        }, [
          g("span", lf, "#" + $(l.id) + " " + $(l.session), 1),
          g("span", rf, $(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, of))), 128))
      ], 64)) : (c(), h("p", af, $(e.none), 1)) : (c(), H(_t, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, u4 = /* @__PURE__ */ Y(cf, [["__scopeId", "data-v-a01e5a17"]]), uf = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["badge", e.tone])
    }, $(e.text), 3));
  }
}, Fl = /* @__PURE__ */ Y(uf, [["__scopeId", "data-v-9e7e1157"]]), df = ["aria-valuenow", "aria-valuemax"], ff = {
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
      class: Z(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      g("span", {
        class: "fill",
        style: ge({ width: n.value })
      }, null, 4)
    ], 10, df));
  }
}, hf = /* @__PURE__ */ Y(ff, [["__scopeId", "data-v-9eba6a85"]]), mf = { class: "bars" }, pf = { class: "bar-name" }, gf = { class: "bar-value" }, vf = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = T(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, r) => (c(), h("div", mf, [
      (c(!0), h(z, null, te(e.items, (i, d) => (c(), H(ht(i.open ? "button" : "div"), {
        key: `${d}-${i.label}`,
        type: i.open ? "button" : void 0,
        class: Z(["bar-row", i.tone, { opens: i.open }]),
        onClick: (u) => i.open && a("open", i.open)
      }, {
        default: D(() => [
          g("span", pf, $(i.label), 1),
          B(hf, {
            value: Number(i.value) || 0,
            max: s.value,
            tone: i.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          g("span", gf, $(i.value) + $(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, yf = /* @__PURE__ */ Y(vf, [["__scopeId", "data-v-663427f4"]]), bf = { class: "bars" }, wf = {
  key: 0,
  class: "bars-title"
}, kf = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", bf, [
      e.node.title ? (c(), h("span", wf, $(e.node.title), 1)) : C("", !0),
      B(yf, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, xf = /* @__PURE__ */ Y(kf, [["__scopeId", "data-v-7135bb11"]]), $f = {
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
      class: Z([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ge(o.value)
    }, [
      (c(!0), h(z, null, te(e.node.children || [], (i, d) => (c(), H(nr, {
        key: d,
        node: i,
        onOpen: r[0] || (r[0] = (u) => s("open", u)),
        onFile: r[1] || (r[1] = (u) => s("file", u))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Tn = /* @__PURE__ */ Y($f, [["__scopeId", "data-v-d142a3f4"]]), Mf = {
  key: 0,
  class: "card-head"
}, Sf = { class: "card-title" }, _f = {
  key: 0,
  class: "card-note"
}, Ef = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", {
      class: Z(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", Mf, [
        g("span", Sf, $(e.node.title), 1),
        e.node.note ? (c(), h("span", _f, $(e.node.note), 1)) : C("", !0)
      ])) : C("", !0),
      B(Tn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Af = /* @__PURE__ */ Y(Ef, [["__scopeId", "data-v-67b72d40"]]), Cf = { processes: "process", memories: "memory", replies: "reply" }, Fn = (e) => (Cf[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), Za = [], Of = 2e3, lt = /* @__PURE__ */ new Map(), Tf = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Rf = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Et(e, { first: t = !1 } = {}) {
  t ? Za.unshift(e) : Za.push(e), lt.clear();
}
function Wl(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const If = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Bf = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function tt(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Lf(e, t) {
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
  return Nf(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Nf(e) {
  return e.split(Rf).map((t, n) => n % 2 ? t : t.replace(Tf, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function so(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const Df = 24;
function jf(e) {
  const [t, , ...n] = e, a = so(t), s = n.map(so), o = (i) => [a, ...s].some((d) => (d[i] ?? "").length > Df) ? ' class="text-column"' : "", l = a.map((i, d) => `<th${o(d)}>${en(i)}</th>`).join(""), r = s.map((i) => `<tr>${i.map((d, u) => `<td${o(u)}>${en(d)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${r}</tbody></table>`;
}
const Hl = /^\s*(?:[-*+]|\d+[.)])\s+/, Xa = /^\s*(\d+)[.)]\s/, oo = (e) => e.match(/^\s*/)[0].length;
function Ul(e) {
  const t = e[0].match(Xa), n = oo(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), r = a[a.length - 1];
    l && oo(o) <= n ? a.push({ text: l[2], nested: [] }) : r && o.trim() && (l || r.nested.length) ? r.nested.push(o) : r && o.trim() && (r.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${en(o.text)}${o.nested.length ? Ul(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function Pf(e, t) {
  const n = Xa.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Hl.test(e[s]) && Xa.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const lo = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function zl(e) {
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
    if (lo(t, a)) {
      let r = a + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(jf(t.slice(a, r))), a = r;
      continue;
    }
    if (Hl.test(s)) {
      const r = Pf(t, a);
      n.push(Ul(t.slice(a, r))), a = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let r = a;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${zl(
          t.slice(a, r).map((i) => i.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = r;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !lo(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${en(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const qf = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Ff = (e) => e.type !== "text" && !qf.test(e.html);
function Wf(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(zl(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : Ff(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function Hf(e, t = { env: "" }) {
  const n = Bf(e, t), a = lt.get(n);
  if (lt.delete(n), a && a.source === t.source && a.reads.every((l) => If(l, t)))
    return lt.set(n, a), a.html;
  const s = [], o = Wf(Lf(e, { ...t, reads: s }));
  return lt.set(n, { html: o, reads: s, source: t.source }), lt.size > Of && lt.delete(lt.keys().next().value), o;
}
const pa = /* @__PURE__ */ new WeakMap();
function Uf(e) {
  if (pa.has(e)) return pa.get(e);
  const t = di(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (d, u) => `${d}:${u}`;
  function o(d, u) {
    const f = s(d, u), m = e.read(`${Fn(d)} show ${u}`);
    n.set(f, m), m.then((y) => {
      n.get(f) === m && (n.delete(f), t.set(f, y.ok ? { ...y.value, table: d } : null));
    });
  }
  function l(d) {
    a.has(d) || (a.add(d), e.follow([`${Fn(d).replace(/-/g, "_")}.*`], (u) => {
      const f = `${d}:`;
      for (const m of t.keys()) {
        if (!m.startsWith(f)) continue;
        const y = Number(m.slice(f.length));
        (!u.row_id || u.row_id === y) && o(d, y);
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
function Vl() {
  const e = Oe(Ne, null), t = e ? Uf(e) : null;
  return (n, a = {}) => Hf(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Gl = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, un = (e) => String(e || "").replace(Gl, (t, n, a, s) => s), zf = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), xn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Vf = /^Traceback \(most recent call last\):/m, Gf = 8;
function Kl(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Gf).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function Kf(e) {
  const t = [...e.matchAll(zf)].map((a) => a.index);
  if (xn.lastIndex = 0, !t.length || !xn.test(e)) return null;
  xn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(xn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((r) => r[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Kl(n), tail: "" } : null;
}
function Yf(e) {
  const t = Vf.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Kl([o]), tail: n.slice(s).join(`
`) };
}
Et((e) => {
  const t = un(e), n = Yf(t) || Kf(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const Jf = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Zf = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Xf = /[\w\]]\(/, Qf = /^[\w$.[\]'"]+\s*=\s*[^=]/, eh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, th = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, nh = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, ah = /[[({,]$/, sh = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, oh = /^(\t|\s{2,})\S/, lh = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, rh = /`[^`]+`/, ih = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, ch = /[{}()[\];=<>$&|*\\@+^~%]/g, Yl = /^\s*(?:[-*+]|\d+[.)])\s/, uh = /^\s*>/, dh = /^\s*\|/, fh = 0.6, hh = 0.4, mh = 5, ph = 0.03, Jl = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= mh && t.every((n) => ih.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(ch) ?? []).length / e.length < ph;
}, ga = (e) => {
  const t = e.trim();
  return rh.test(t) ? !1 : [Jf, Zf, Xf, Qf, eh, th, nh, ah, sh].some((n) => n.test(t)) || /[;{}]$/.test(t) || oh.test(e) && !Yl.test(e) && !Jl(e);
};
function gh(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Yl.test(t[0]) || t.every((o) => uh.test(o) || dh.test(o))) return "text";
  const n = t.filter((o) => !lh.test(o.trim()));
  if (t.length === 1) return !n.length || ga(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(ga).length, s = n.filter((o) => !ga(o) && Jl(o)).length;
  return a >= n.length * fh && s <= n.length * hh ? "code" : "text";
}
const Qa = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", vh = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", yh = `${Qa} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, bh = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", wh = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", ro = {
  js: { keywords: Qa, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: vh, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: yh, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Qa, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: bh, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: wh, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, kh = {
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
function io(e, t, n) {
  return n && e.startsWith(n, t);
}
function xh(e, t) {
  const n = ro[kh[t] ?? t] || ro.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (io(e, o, n.line) || n.hash && r === "#") {
      const d = e.indexOf(`
`, o);
      l("comment", e.slice(o, d < 0 ? e.length : d)), o = d < 0 ? e.length : d;
      continue;
    }
    if (n.block && io(e, o, n.block[0])) {
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
function $h(e, t) {
  const n = [""];
  for (const { type: a, value: s } of xh(e, t))
    s.split(`
`).forEach((l, r) => {
      r && n.push(""), l && (n[n.length - 1] += a === "plain" ? tt(l) : `<span class="tok-${a}">${tt(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Mh(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Sh = 1500, co = /* @__PURE__ */ new WeakMap();
async function _h(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Mh(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(co.get(t)), co.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Sh)
  )));
}
typeof document < "u" && document.addEventListener("click", _h, !0);
const Eh = /\n\s*\n/, Ah = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, Ch = /^\s*(`{3,}|~{3,})\s*$/, Oh = /^\s{4,}\S/, Th = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, es = /^\s*(?:[-*+]|\d+[.)])\s/, Zl = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Rh = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function Ss(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Ih(e) {
  const t = Ss(e.join(`
`));
  return (Rh.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Bh = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Zl.test(t) && !es.test(t);
}, Lh = (e, t) => es.test(t) || es.test([...e].reverse().find((n) => n.trim()) || "");
function _s(e, t) {
  const n = t || Ih(e), a = $h(Ss(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function Nh(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && Ch.test(s));
  return a < 0 ? e.length : a;
}
function Dh(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return _s(a.map(un), n ? n.toLowerCase() : "");
}
function jh(e) {
  const t = e.split(Eh).map((l) => ({ paragraph: l, type: gh(Ss(l).split(`
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
      s(), n.push(_s(r.map(({ paragraph: i }) => i).join(`

`).split(`
`).map(un), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function Ph(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : jh(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const r = n[l].match(Ah);
    if (r) {
      const d = Nh(n, l, r[2]);
      o(), a.push(Dh(n.slice(l + 1, d), r[1], r[3])), l = d + 1;
      continue;
    }
    const i = Bh(s) ? Th : Oh;
    if (!t && i.test(n[l]) && !Lh(s, n[l])) {
      let d = l;
      for (; d < n.length && (i.test(n[d]) || !n[d].trim()); ) d += 1;
      for (; d > l && !n[d - 1].trim(); ) d -= 1;
      const u = [];
      for (; s.length && s[s.length - 1].trim() && Zl.test(s[s.length - 1].trim()); ) u.unshift(s.pop());
      if (d - l + u.length >= 2) {
        o(), a.push(_s([...u, ...n.slice(l, d)].map(un), "")), l = d;
        continue;
      }
      s.push(...u);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Et((e, t) => Ph(e, t.document));
const Wn = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Xl = (e) => `${e.table}:${e.id}`, uo = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", va = 80;
function fo(e) {
  return e.length <= va ? e : `${e.slice(0, va + 1).replace(/\s+\S*$/, "") || e.slice(0, va)}…`;
}
const ho = {
  messages: (e) => fo(uo(e.text)),
  comments: (e) => fo(uo(e.text)),
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
}, qh = (e) => (ho[e.table] ? ho[e.table](e) : e.title || "") || "", St = (e) => Wn(e.created_at), Ql = (e) => Wn(e.updated_at) || St(e), Fh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Wh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Hh(e) {
  const t = Fh.exec(e);
  if (t && ct(t[1])) return { at: t.index, length: t[0].length, table: ct(t[1]), id: Number(t[2]), label: t[3] };
  const n = Wh.exec(e), a = n && ct(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function Uh(e, t, n, a) {
  const s = Wl(a, e, t), o = un(s ? qh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${tt(qt(e).title)} ${t}</span><span class="row-card-title">${tt(o)}</span></a>`;
}
Et(
  (e, t) => {
    const n = Hh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: Uh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const zh = /\.(png|jpe?g|gif|webp|svg)$/i, Vh = (e) => zh.test(e), Gh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Kh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Yh(e, t) {
  const n = Gh.exec(e), [, a, s, o, l, r] = n || [], i = n && ct(a || o), d = i && Wl(t, i, Number(s || l));
  if (i !== "messages" || !d || !(d.files || []).includes(r)) return null;
  const u = `/api/files/message/${d.id}/${encodeURIComponent(r)}`, f = `${qt(i).title} ${d.id} · ${tt(r)}`, m = Vh(r) ? `<img class="file-card-image" src="${u}" alt="${tt(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${u}" data-attached="${tt(r)}">${m}<span class="file-card-name">${f}</span></a>` };
}
function Jh(e) {
  const t = Kh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${tt(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Et(
  (e, t) => {
    if (t.inline) return null;
    const n = Yh(e, t) || Jh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Zh = /`([^`\n]+)`/g;
Et((e) => e.replace(Zh, (t, n) => `<code>${n}</code>`));
const mo = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Ms.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Et(
  (e, t) => e.replace(Gl, (n, a, s, o) => mo[a] ? mo[a](s, o, t) : o)
);
const Xh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, er = new RegExp(`\\b(${Bl}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), tr = new RegExp(`\\b(${Bl}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Qh = new RegExp(`<code>((?:${er.source}|${tr.source}))</code>`, "gi"), em = (e) => e.replace(Qh, "$1"), tm = (e, t) => `<a class="row-pill" href="#" data-peek="${ct(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, nm = (e) => e.replace(tr, (t, n, a) => a.replace(/\d+/g, (s) => tm(n.replace(/s$/i, ""), s))), am = (e) => nm(e).replace(
  er,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${ct(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Et(
  (e, t) => t.rowNames === !1 ? e : em(e).split(Xh).map((n, a) => a % 2 ? n : am(n)).join("")
);
const sm = ["innerHTML"], om = ["innerHTML"], lm = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Vl(), a = T(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => P(It) && P(It)(...l)),
      innerHTML: a.value
    }, null, 8, sm)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => P(It) && P(It)(...l)),
      innerHTML: a.value
    }, null, 8, om));
  }
}, kt = /* @__PURE__ */ Y(lm, [["__scopeId", "data-v-d8e75741"]]), rm = { class: "fact" }, im = { class: "fact-label" }, cm = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", rm, [
      g("span", im, $(e.label), 1),
      B(kt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, um = /* @__PURE__ */ Y(cm, [["__scopeId", "data-v-3a88ecf8"]]), dm = { class: "list" }, fm = { class: "list-label" }, hm = {
  key: 1,
  class: "list-note"
}, mm = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", dm, [
      (c(!0), h(z, null, te(e.items, (o, l) => (c(), H(ht(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Z(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: D(() => [
          g("span", fm, $(o.label), 1),
          o.badge ? (c(), H(Fl, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : C("", !0),
          o.note ? (c(), h("span", hm, $(o.note), 1)) : C("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, pm = /* @__PURE__ */ Y(mm, [["__scopeId", "data-v-ebe2ae0a"]]), gm = { class: "table" }, vm = {
  key: 0,
  class: "table-row empty"
}, ym = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (c(), h("div", gm, [
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
        class: Z(["table-row", r.tone, { opens: r.open }]),
        style: ge(s.value),
        onClick: (d) => r.open && a("open", r.open)
      }, {
        default: D(() => [
          (c(!0), h(z, null, te(r.cells, (d, u) => (c(), h("span", {
            key: u,
            class: "cell"
          }, $(d), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", vm, $(e.empty), 1)) : C("", !0)
    ]));
  }
}, bm = /* @__PURE__ */ Y(ym, [["__scopeId", "data-v-9326a52e"]]), wm = { class: "stat-value" }, km = { class: "stat-label" }, xm = {
  key: 0,
  class: "stat-note"
}, $m = {
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
      class: Z(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: D(() => [
        g("span", wm, $(e.value), 1),
        g("span", km, $(e.label), 1),
        e.note ? (c(), h("span", xm, $(e.note), 1)) : C("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Mm = /* @__PURE__ */ Y($m, [["__scopeId", "data-v-ad0db6d6"]]), Sm = { class: "code" }, _m = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (c(), H(Pt, {
      value: e.node.type
    }, {
      stack: D(() => [
        B(Tn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: D(() => [
        B(Tn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: D(() => [
        B(Tn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: D(() => [
        B(Af, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: D(() => [
        g("h3", {
          class: Z(["heading", `level-${e.node.level || 2}`])
        }, $(e.node.text), 3)
      ]),
      divider: D(() => [...l[2] || (l[2] = [
        g("hr", { class: "divider" }, null, -1)
      ])]),
      stat: D(() => [
        B(Mm, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (r) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: D(() => [
        B(xf, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: D(() => [
        B(bm, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: D(() => [
        B(pm, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: D(() => [
        B(kt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: D(() => [
        B(um, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: D(() => [
        B(Fl, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: D(() => [
        g("pre", Sm, [
          g("code", null, $(e.node.text), 1)
        ])
      ]),
      file: D(() => [
        g("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (r) => s(e.node))
        }, $(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), nr = /* @__PURE__ */ Y(_m, [["__scopeId", "data-v-cbdcf540"]]), Em = { class: "dashboard" }, Am = { class: "trail" }, Cm = ["onClick"], Om = {
  key: 0,
  class: "gone",
  role: "status"
}, Tm = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (m) => m in (n.document.pages || {}), o = I(!!n.page && !s(n.page)), l = I(n.page && !o.value ? [n.page] : []), r = T(() => l.value.at(-1) || n.document.start), i = T(() => (n.document.pages || {})[r.value] || null), d = (m) => ((n.document.pages || {})[m] || {}).title || m, u = (m) => {
      o.value = !1, l.value = [...l.value, m];
    }, f = (m) => {
      o.value = !1, l.value = l.value.slice(0, m);
    };
    return fe(
      () => n.document.start,
      () => l.value = []
    ), (m, y) => (c(), h("div", Em, [
      e.document.broken ? (c(), H(Qt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: D(() => [
          ee($(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), H(Qt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: D(() => [
          ee($(e.document.missing), 1)
        ]),
        _: 1
      })) : i.value ? (c(), h(z, { key: 2 }, [
        g("nav", Am, [
          g("button", {
            type: "button",
            class: Z(["step", { current: !l.value.length }]),
            onClick: y[0] || (y[0] = (v) => f(0))
          }, $(d(e.document.start)), 3),
          (c(!0), h(z, null, te(l.value, (v, S) => (c(), h(z, {
            key: `${S}-${v}`
          }, [
            y[2] || (y[2] = g("span", { class: "sep" }, "/", -1)),
            g("button", {
              type: "button",
              class: Z(["step", { current: S === l.value.length - 1 }]),
              onClick: (_) => f(S + 1)
            }, $(d(v)), 11, Cm)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", Om, "What you opened is no longer in this dashboard. Here is its start page.")) : C("", !0),
        B(jt, {
          name: "page",
          mode: "out-in"
        }, {
          default: D(() => [
            (c(), h("div", {
              key: r.value,
              class: "page"
            }, [
              B(nr, {
                node: i.value.view,
                onOpen: u,
                onFile: y[1] || (y[1] = (v) => a("file", v))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : C("", !0)
    ]));
  }
}, Rm = /* @__PURE__ */ Y(Tm, [["__scopeId", "data-v-fbe83734"]]), ar = {
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
function Im(e, t) {
  const n = We(), a = ml(e, ar.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Re(e), ft(() => {
    s(), a.cancel();
  });
}
const Bm = {
  key: 0,
  class: "window-failure"
}, Lm = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = We(), o = I(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? Im(l, n.events) : gs(l, () => !0, ar.documentWithNoEvents), (r, i) => o.value && !o.value.ok ? (c(), h("p", Bm, $(o.value.error), 1)) : o.value ? (c(), H(Rm, {
      key: 1,
      document: o.value.value,
      onFile: i[0] || (i[0] = (d) => a("file", d))
    }, null, 8, ["document"])) : C("", !0);
  }
}, ot = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, qe = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Pe = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Nm = 6;
function Es(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Dm = (e) => {
  const t = Es(e, ot.lineChars), n = Math.max(ot.minWidth, Math.max(...t.map((a) => a.length)) * ot.charWidth + ot.padX * 2);
  return { name: e, lines: t, line: ot.line, padY: ot.padY, width: n, height: t.length * ot.line + ot.padY * 2 };
};
function jm(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((r, i) => {
      if (r[0] !== l) return;
      const d = s.get(r[1]);
      d === "open" ? a.add(i) : d || o(r[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function Pm(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function qm(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var r;
    return (a[r = n.get(l)] || (a[r] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((r, i) => [r, i]))), o = (l, r) => {
    const i = s(), d = (u) => {
      const f = r(u).map((m) => i.get(m));
      return f.length ? f.reduce((m, y) => m + y, 0) / f.length : i.get(u);
    };
    return [...l].sort((u, f) => d(u) - d(f));
  };
  for (let l = 0; l < Nm; l++) {
    const r = l % 2 === 0, i = a.map((d, u) => u);
    (r ? i.slice(1) : i.slice(0, -1).reverse()).forEach((d) => {
      const u = (f) => t.filter((m) => m[r ? 1 : 0] === f).map((m) => m[r ? 0 : 1]);
      a[d] = o(a[d], u);
    });
  }
  return a;
}
function Fm(e, t) {
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
function Wm(e) {
  const t = [...new Set(e.flatMap(([j, L]) => [j, L]))], n = new Set(e.map(([, j]) => j)), a = t.filter((j) => !n.has(j)), s = jm(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((j, L) => !s.has(L)), l = Pm(t, o), r = qm(t, o, l), i = new Map(t.map((j) => [j, Dm(j)])), d = r.map((j) => j.reduce((L, q) => L + i.get(q).width, 0) + Pe.across * (j.length - 1)), u = Math.max(...d) + Pe.margin * 2, f = Um(e, l, r.length), m = /* @__PURE__ */ new Map();
  let y = Pe.margin;
  r.forEach((j, L) => {
    let q = (u - d[L]) / 2;
    const w = Math.max(...j.map((b) => i.get(b).height));
    j.forEach((b) => {
      const x = i.get(b);
      m.set(b, { ...x, x: q, y: y + (w - x.height) / 2 }), q += x.width + Pe.across;
    }), y += w + (f[L] ?? Pe.down);
  });
  const v = e.map(([j, L, q], w) => ({ from: j, to: L, label: q || "", back: s.has(w) || l.get(L) <= l.get(j) }));
  Fm(v, m);
  const S = v.map((j) => zm(j, m.get(j.from), m.get(j.to))), _ = [...m.values()], R = Ym(S, _), F = Math.max(y - Pe.down, ...R.filter((j) => j.label).map((j) => j.label.y + j.label.height));
  return { width: Math.max(u - Pe.margin, ...R.filter((j) => j.label).map((j) => j.label.x + j.label.width)) + Pe.margin, height: F + Pe.margin, nodes: _, arrows: R };
}
const Hm = (e) => e ? Es(e, qe.lineChars).length * qe.line + qe.pad * 2 : 0;
function Um(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Pe.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [r, i] = [t.get(s), t.get(o)].sort((d, u) => d - u);
    i > r && (a[r + Math.floor((i - r - 1) / 2)] += Hm(l) + Pe.labelSpace);
  }), a.map((s) => Math.max(Pe.down, s));
}
function zm(e, t, n) {
  const a = e.label ? Es(e.label, qe.lineChars) : [], s = a.length ? Math.max(...a.map((m) => m.length)) * qe.charWidth + qe.pad * 2 : 0, o = a.length * qe.line + (a.length ? qe.pad * 2 : 0), l = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, d = e.back ? n.y + n.height : n.y, u = (d - r) / 2, f = [{ x: l, y: r }, { x: l, y: r + u }, { x: i, y: d - u }, { x: i, y: d }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: f, path: `M${l} ${r} C${l} ${r + u} ${i} ${d - u} ${i} ${d}` };
}
const Vm = ([e, t, n, a], s) => {
  const o = 1 - s, l = (r) => o * o * o * e[r] + 3 * o * o * s * t[r] + 3 * o * s * s * n[r] + s * s * s * a[r];
  return { x: l("x"), y: l("y") };
}, Gm = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Km = [0, -1, 1, -2, 2, -3, 3].map((e) => e * qe.line);
function Ym(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, d) => {
      const u = Vm(a.curve, i);
      return { x: u.x - a.labelWidth / 2, y: u.y - a.labelHeight / 2 + d, width: a.labelWidth, height: a.labelHeight };
    }, r = Km.flatMap((i) => Gm.map((d) => s(d, i))).find((i) => !n.some((d) => po(i, d))) ?? s(0.5, 0);
    for (; n.some((i) => po(r, i)); ) r.y += qe.line;
    return n.push(r), { ...a, label: { ...r, lines: a.lines, line: qe.line, pad: qe.pad } };
  });
}
const po = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Jm = { class: "flowchart-tools" }, Zm = ["width", "height", "viewBox", "aria-label"], Xm = ["d"], Qm = ["x", "y", "width", "height"], e1 = ["x", "y"], t1 = ["x", "dy"], n1 = {
  key: 0,
  class: "flowchart-label"
}, a1 = ["x", "y", "width", "height"], s1 = ["x", "y"], o1 = ["x", "dy"], l1 = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(() => Wm(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = I(null), r = I({ zoom: 1, x: 0, y: 0 });
    let i = null;
    function d() {
      var R;
      const S = (R = l.value) == null ? void 0 : R.getBoundingClientRect();
      if (!(S != null && S.width)) return;
      const _ = Math.min(S.width / s.value.width, S.height / s.value.height, 1.5);
      r.value = { zoom: _, x: (S.width - s.value.width * _) / 2, y: (S.height - s.value.height * _) / 2 };
    }
    function u(S, _, R) {
      const { zoom: F, x: J, y: j } = r.value, L = Math.min(o.most, Math.max(o.least, F * S));
      r.value = { zoom: L, x: _ - (_ - J) * L / F, y: R - (R - j) * L / F };
    }
    function f(S) {
      const _ = l.value.getBoundingClientRect();
      u(S, _.width / 2, _.height / 2);
    }
    function m(S) {
      const _ = l.value.getBoundingClientRect();
      S.ctrlKey || S.metaKey ? u(S.deltaY < 0 ? o.step : 1 / o.step, S.clientX - _.left, S.clientY - _.top) : r.value = { ...r.value, x: r.value.x - S.deltaX, y: r.value.y - S.deltaY };
    }
    function y(S) {
      var _, R, F;
      S.preventDefault(), (_ = window.getSelection()) == null || _.removeAllRanges(), i = { x: S.clientX - r.value.x, y: S.clientY - r.value.y }, (F = (R = l.value).setPointerCapture) == null || F.call(R, S.pointerId);
    }
    function v(S) {
      i && (r.value = { ...r.value, x: S.clientX - i.x, y: S.clientY - i.y });
    }
    return Re(d), (S, _) => (c(), H(Tl, {
      title: e.title,
      large: "",
      onClose: _[4] || (_[4] = (R) => a("close"))
    }, {
      default: D(() => [
        g("div", Jm, [
          B(de, {
            small: "",
            onClick: _[0] || (_[0] = (R) => f(o.step))
          }, {
            default: D(() => [..._[5] || (_[5] = [
              ee("Zoom in", -1)
            ])]),
            _: 1
          }),
          B(de, {
            small: "",
            onClick: _[1] || (_[1] = (R) => f(1 / o.step))
          }, {
            default: D(() => [..._[6] || (_[6] = [
              ee("Zoom out", -1)
            ])]),
            _: 1
          }),
          B(de, {
            small: "",
            onClick: d
          }, {
            default: D(() => [..._[7] || (_[7] = [
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
          onPointerdown: y,
          onPointermove: v,
          onPointerup: _[2] || (_[2] = (R) => Us(i) ? i.value = null : i = null),
          onPointercancel: _[3] || (_[3] = (R) => Us(i) ? i.value = null : i = null)
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
            (c(!0), h(z, null, te(s.value.arrows, (R, F) => (c(), h("path", {
              key: `arrow-${F}`,
              class: "flowchart-arrow",
              d: R.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Xm))), 128)),
            (c(!0), h(z, null, te(s.value.nodes, (R) => (c(), h("g", {
              key: R.name,
              class: "flowchart-node"
            }, [
              g("rect", {
                x: R.x,
                y: R.y,
                width: R.width,
                height: R.height,
                rx: "8"
              }, null, 8, Qm),
              g("text", {
                x: R.x + R.width / 2,
                y: R.y + R.padY + R.line / 2
              }, [
                (c(!0), h(z, null, te(R.lines, (F, J) => (c(), h("tspan", {
                  key: J,
                  x: R.x + R.width / 2,
                  dy: J ? R.line : 0
                }, $(F), 9, t1))), 128))
              ], 8, e1)
            ]))), 128)),
            (c(!0), h(z, null, te(s.value.arrows, (R, F) => (c(), h(z, {
              key: `label-${F}`
            }, [
              R.label ? (c(), h("g", n1, [
                g("rect", {
                  x: R.label.x,
                  y: R.label.y,
                  width: R.label.width,
                  height: R.label.height,
                  rx: "4"
                }, null, 8, a1),
                g("text", {
                  x: R.label.x + R.label.width / 2,
                  y: R.label.y + R.label.pad + R.label.line / 2
                }, [
                  (c(!0), h(z, null, te(R.label.lines, (J, j) => (c(), h("tspan", {
                    key: j,
                    x: R.label.x + R.label.width / 2,
                    dy: j ? R.label.line : 0
                  }, $(J), 9, o1))), 128))
                ], 8, s1)
              ])) : C("", !0)
            ], 64))), 128))
          ], 12, Zm))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, r1 = /* @__PURE__ */ Y(l1, [["__scopeId", "data-v-51d24cfe"]]), go = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', vo = {
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
  agent: go,
  worker: go,
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
}, i1 = ["innerHTML"], c1 = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = T(() => vo[t.name] || vo.dot);
    return (a, s) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, i1));
  }
}, dt = /* @__PURE__ */ Y(c1, [["__scopeId", "data-v-beb5935c"]]), u1 = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      B(dt, { name: "fold" })
    ], 2));
  }
}, $t = /* @__PURE__ */ Y(u1, [["__scopeId", "data-v-d03899bb"]]), d1 = ["data-tip", "aria-label"], f1 = {
  key: 0,
  class: "mact-word"
}, h1 = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: Z(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      B(dt, { name: "open" }),
      e.open ? (c(), h("span", f1, $(e.label), 1)) : C("", !0),
      n[0] || (n[0] = g("span", { class: "hit" }, null, -1))
    ], 10, d1));
  }
}, sr = /* @__PURE__ */ Y(h1, [["__scopeId", "data-v-3b292e09"]]), or = 120, Rn = 280, lr = 160, m1 = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, p1 = ["leaving", "resizing", "entering"];
function ts(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function g1(e) {
  const t = p1.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = ts(e);
  return e.classList.add(...t), n;
}
function rr(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = I(t()), s = I("");
  let o = 0;
  const l = (f, m) => Object.assign(f.style, { width: `${m.width}px`, height: `${m.height}px` }), r = (f) => Object.assign(f.style, { width: "", height: "", transition: "" });
  function i(f, m) {
    r(f);
    const y = g1(f);
    l(f, m), f.offsetWidth, f.style.transition = `width ${Rn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Rn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(f, y);
  }
  function d(f) {
    const m = f.querySelector(":scope > :not(.top)");
    if (!m || typeof ResizeObserver > "u") return null;
    let y = m.offsetHeight;
    const v = new ResizeObserver(() => {
      m.offsetHeight !== y && (y = m.offsetHeight, i(f, ts(f)));
    });
    return v.observe(m), v;
  }
  async function u(f) {
    const m = e.value, y = ++o;
    if (!m || !m.offsetWidth || m1()) {
      a.value = f;
      return;
    }
    const v = ts(m);
    if (l(m, v), s.value = "leaving", await n(or), y !== o) return;
    a.value = f, s.value = "resizing", await mt(), i(m, v);
    const S = d(m);
    await n(Rn), S == null || S.disconnect(), y === o && (r(m), s.value = "entering", await n(lr), y === o && (s.value = ""));
  }
  return fe(t, (f) => u(f)), ft(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const v1 = { class: "growing-card-top" }, y1 = ["aria-expanded"], b1 = { class: "growing-card-avatar" }, w1 = { class: "growing-card-title" }, k1 = { class: "growing-card-more" }, x1 = { class: "growing-card-body" }, $1 = {
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
    const n = e, a = t, s = I(!1), o = I(null), { folded: l, phase: r } = rr(o, () => !s.value), i = T(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), d = T(() => n.text.split(/\n\s*\n/).filter((u) => u.trim()));
    return (u, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: Z(["growing-card-wrap", P(r), { open: !P(l), bad: e.bad, incoming: e.incoming }])
    }, [
      g("div", v1, [
        g("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: f[0] || (f[0] = (m) => s.value = !s.value)
        }, [
          g("span", b1, [
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
          g("span", w1, $(e.title), 1),
          B($t, { open: s.value }, null, 8, ["open"])
        ], 8, y1),
        e.action ? (c(), H(sr, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: f[1] || (f[1] = (m) => a("act"))
        }, null, 8, ["label", "open"])) : C("", !0),
        e.commentable ? (c(), h("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: f[2] || (f[2] = (m) => a("comment"))
        }, [
          B(ye, {
            name: "bubble",
            size: 13
          })
        ])) : C("", !0)
      ]),
      g("div", k1, [
        g("div", x1, [
          (c(!0), h(z, null, te(d.value, (m, y) => (c(), h("p", {
            key: y,
            class: "growing-card-text"
          }, $(m), 1))), 128))
        ])
      ])
    ], 2));
  }
}, M1 = /* @__PURE__ */ Y($1, [["__scopeId", "data-v-f2b4930d"]]), S1 = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, _1 = { class: "md inline" }, E1 = ["disabled", "title", "onClick"], A1 = {
  key: 1,
  class: "message-links-many"
}, C1 = ["aria-expanded"], O1 = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, T1 = ["disabled", "onClick"], R1 = { class: "row-pill message-links-chip" }, I1 = { class: "message-links-title" }, B1 = { key: 0 }, ya = 3, L1 = "task", N1 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(() => n.total || n.links.length), o = T(() => n.links.every((m) => m.endpoint.model === L1) ? "tasks" : "items"), l = I(!1), r = I(null);
    vl(r, () => l.value = !1);
    const i = () => l.value = !l.value, d = (m) => m.endpoint.unavailable || !m.endpoint.open_ref, u = (m) => m.relations.includes("edited") ? m.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function f(m) {
      d(m) || (l.value = !1, Fe(m.endpoint.open_ref));
    }
    return (m, y) => (c(), h("div", {
      ref_key: "line",
      ref: r,
      class: Z(["message-links", { many: s.value > ya, three: s.value === ya, open: l.value }]),
      "data-message-links": ""
    }, [
      B(dt, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (c(), h("span", S1, [
        g("span", _1, [
          y[1] || (y[1] = ee("Linked: ", -1)),
          (c(!0), h(z, null, te(e.links, (v) => (c(), h("button", {
            key: `${v.endpoint.model}:${v.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: d(v),
            title: v.endpoint.title,
            onClick: (S) => f(v)
          }, [
            ee($(v.endpoint.model.replaceAll("_", " ")) + " " + $(v.endpoint.id), 1),
            u(v) ? (c(), h(z, { key: 0 }, [
              ee(" (" + $(u(v)) + ")", 1)
            ], 64)) : C("", !0),
            d(v) ? (c(), h(z, { key: 1 }, [
              ee(" (unavailable)")
            ], 64)) : C("", !0)
          ], 8, E1))), 128))
        ])
      ])) : C("", !0),
      s.value >= ya ? (c(), h("span", A1, [
        g("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: i
        }, [
          ee($(s.value) + " linked " + $(o.value) + " ", 1),
          B($t, { open: l.value }, null, 8, ["open"])
        ], 8, C1)
      ])) : C("", !0),
      l.value ? (c(), h("div", O1, [
        (c(!0), h(z, null, te(e.links, (v) => (c(), h("button", {
          key: `${v.endpoint.model}:${v.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: d(v),
          onClick: (S) => f(v)
        }, [
          g("span", R1, $(v.endpoint.model.replaceAll("_", " ")) + " " + $(v.endpoint.id), 1),
          g("span", I1, $(v.endpoint.title), 1),
          g("span", null, $(u(v)), 1),
          d(v) ? (c(), h("span", B1, "Unavailable")) : C("", !0)
        ], 8, T1))), 128))
      ])) : C("", !0),
      B(Qn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: y[0] || (y[0] = (v) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, D1 = /* @__PURE__ */ Y(N1, [["__scopeId", "data-v-e9bc783c"]]), j1 = ["title", "aria-label"], P1 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, q1 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, F1 = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = T(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (c(), h("span", {
      class: Z(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (c(), h("svg", P1, [
        o[0] || (o[0] = g("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (c(), h("path", q1)) : C("", !0)
      ]))
    ], 10, j1));
  }
}, W1 = /* @__PURE__ */ Y(F1, [["__scopeId", "data-v-6dc92808"]]);
function H1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function ir(e, t = Date.now()) {
  const n = H1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const U1 = 36e5;
function d4(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / U1;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function cr(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function yo(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const ba = (e) => String(e).padStart(2, "0");
function z1(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${ba(t % 60)}s` : `${Math.floor(t / 3600)}h ${ba(Math.floor(t % 3600 / 60))}m ${ba(t % 60)}s`;
}
const V1 = "img,pre,table";
function G1(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function K1(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function Y1(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(V1)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = G1(K1(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function J1(e, t) {
  let n = null;
  const a = () => e.value && Y1(e.value);
  Re(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== s && (s = r.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Be(() => n == null ? void 0 : n.disconnect()), fe(t, a, { flush: "post" });
}
const Z1 = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function X1(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const $n = /* @__PURE__ */ new WeakMap(), Ge = "work", Ut = "sent", Q1 = 50, bo = () => ({ rows: I([]), total: I(0), next: I(null), loading: I(!1), failure: I(""), version: 0 });
function ep(e) {
  var f;
  if ($n.has(e)) return $n.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (m) => {
    var y;
    return ((y = e.visible) == null ? void 0 : y.value) !== !1 && [...m.views].some((v) => v.visible);
  };
  async function o(m, y, v = 1) {
    const S = m[y], _ = ++S.version;
    S.loading.value = !0, S.failure.value = "";
    const R = y === Ge ? "--type about --type edited --group-counterparts" : "--type sent_to", F = `link list --source message:${m.id} ${R} --page ${v} --page-size ${y === Ge ? 10 : 25}`;
    try {
      const J = await e.read(F);
      if (t.get(m.id) !== m || S.version !== _) return;
      if (!J.ok) {
        S.failure.value = J.error;
        return;
      }
      const j = y === Ge ? J.value.counterparts ?? [] : J.value.rows ?? [], L = v === 1 ? j : [...S.rows.value, ...j], q = y === Ge ? (w) => `${w.endpoint.model}:${w.endpoint.id}` : (w) => w.id ?? w.target_id;
      S.rows.value = [...new Map(L.map((w) => [q(w), w])).values()], S.total.value = J.value.total ?? S.rows.value.length, S.next.value = J.value.next_page ?? null;
    } catch (J) {
      S.version === _ && (S.failure.value = J.message);
    } finally {
      S.version === _ && (S.loading.value = !1);
    }
  }
  function l() {
    a = null;
    const m = [...n].map((y) => t.get(y)).filter((y) => y && s(y));
    n.clear();
    for (const y of m) {
      const v = [...y.dirty];
      y.dirty.clear();
      for (const S of v) o(y, S);
    }
  }
  function r(m, y = [Ge, Ut]) {
    for (const v of y) m.dirty.add(v);
    s(m) && (n.add(m.id), a ?? (a = setTimeout(l, 0)));
  }
  function i(m) {
    const y = m.sources ?? (m.source_model && Number.isInteger(m.source_id) ? [{ model: m.source_model, id: m.source_id }] : []), v = m.link_types ?? (m.link_type ? [m.link_type] : []), S = v.length ? [Ge, Ut].filter((R) => R === Ge ? v.some((F) => ["about", "edited"].includes(F)) : v.includes("sent_to")) : [Ge, Ut];
    if (!S.length) return;
    const _ = y.length ? [...new Set(y.filter((R) => R.model === "message").map((R) => R.id))].map((R) => t.get(R)).filter(Boolean) : [...t.values()].filter(s).slice(0, Q1);
    for (const R of _) r(R, S);
  }
  const d = (f = e.follow) == null ? void 0 : f.call(e, ["link.*"], i), u = {
    attach(m, y) {
      let v = t.get(m);
      return v || (v = { id: m, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Ge, Ut]), work: bo(), sent: bo() }, t.set(m, v)), v.views.add(y), v.dirty.size && r(v, [...v.dirty]), v;
    },
    shown(m) {
      m.dirty.size && r(m, [...m.dirty]);
    },
    detach(m, y) {
      m.views.delete(y), m.views.size || t.delete(m.id), t.size || (clearTimeout(a), d == null || d(), $n.delete(e));
    },
    more(m, y) {
      const v = m == null ? void 0 : m[y];
      if (v != null && v.next.value && !v.loading.value) return o(m, y, v.next.value);
    }
  };
  return $n.set(e, u), u;
}
function tp(e, t, n) {
  const a = Ke(null);
  let s = null;
  const o = fe(t, (l, r, i) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = ep(e);
    const d = { visible: typeof IntersectionObserver > "u" }, u = s.attach(l, d);
    a.value = u;
    const f = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((y) => {
      d.visible = y.some((v) => v.isIntersecting), d.visible && s.shown(u);
    }, { rootMargin: "100px" }), m = fe(n, (y) => {
      f == null || f.disconnect(), y && (f == null || f.observe(y));
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
const np = ["data-incoming", "data-ref"], ap = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], sp = { class: "message-body" }, op = ["title"], lp = ["innerHTML"], rp = ["title"], ip = ["innerHTML"], cp = {
  class: "message-faces",
  "data-message-faces": ""
}, up = ["title", "data-face", "onClick"], dp = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, fp = ["title", "data-reaction", "onClick"], hp = {
  key: 0,
  class: "message-reaction-count"
}, mp = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, pp = ["href", "title"], gp = ["src", "alt"], vp = ["href"], yp = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, bp = ["disabled", "data-sent-worker", "title", "onClick"], wp = { class: "message-foot" }, kp = { class: "message-time" }, xp = {
  class: "message-id",
  "data-message-id": ""
}, $p = 140, Mp = 2, Sp = 1500, _p = "An earlier message", Ep = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(!1), o = I(null), l = T(() => ["user", "comment"].includes(n.message.type)), r = T(() => {
      const [ve, me] = (n.message.commented_row || ":").split(":"), se = ct(ve);
      return se ? { ref: `${se}:${me}`, label: `${qt(se).title.toLowerCase()} ${me}` } : null;
    }), i = T(() => n.message.worker_id ?? null), d = I(!1), u = T(() => i.value !== null && ((n.message.text ?? "").length > $p || (n.message.text ?? "").split(`
`).filter((ve) => ve.trim()).length > Mp)), f = T(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var ve;
      await ((ve = navigator.clipboard) == null ? void 0 : ve.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, Sp);
    }
    const y = Vl(), v = T(() => y(n.message.text ?? "")), S = T(() => JSON.parse(n.message.flowchart_edges || "[]")), _ = I(!1), R = T(() => y(n.quote || _p));
    function F() {
      const ve = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      ve ? ve.scrollIntoView({ block: "center", behavior: "smooth" }) : Fe(`messages:${n.message.parent_id}`);
    }
    J1(o, () => `${n.message.text} ${n.quote}`);
    const J = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, j = (ve) => `/api/files/message/${n.message.id}/${encodeURIComponent(ve)}`, L = T(() => JSON.parse(n.message.captions || "{}")), q = T(() => (n.message.files ?? []).map((ve) => ({ name: ve, address: j(ve), isImage: J.test(ve), title: L.value[ve] || ve }))), w = T(() => cr(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), b = Oe(Ne, null), { links: x, total: M, more: k, loading: p, failure: E, sentTo: A, sentMore: O, sentLoading: N, sentFailure: X, loadMore: ne, loadSent: ie } = tp(b, () => l.value && !n.message.local ? n.message.id : null, o), he = I(!1), Ae = T(() => X1(n.message.reactions));
    function He(ve) {
      he.value = !1, a("react", n.message, ve);
    }
    return (ve, me) => e.message.peer || e.message.recipient ? (c(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      B(M1, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: me[0] || (me[0] = (se) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, np)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      g("div", sp, [
        g("div", {
          ref_key: "bubble",
          ref: o,
          class: Z(["message-card", "md", { comment: r.value }]),
          onClick: me[6] || (me[6] = (...se) => P(It) && P(It)(...se))
        }, [
          r.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${r.value.label}`,
            onClick: me[1] || (me[1] = xe((se) => P(Fe)(r.value.ref), ["stop"]))
          }, [
            B(ye, {
              name: "bubble",
              size: 12
            }),
            g("span", null, "Comment on " + $(r.value.label), 1)
          ], 8, op)) : C("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: xe(F, ["stop"]),
            innerHTML: R.value
          }, null, 8, lp)) : C("", !0),
          i.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${i.value}`,
            onClick: me[2] || (me[2] = xe((se) => P(Fe)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + $(i.value), 9, rp)) : C("", !0),
          g("div", {
            class: Z({ "message-folded": u.value && !d.value }),
            "data-message-text": "",
            innerHTML: v.value
          }, null, 10, ip),
          u.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: me[3] || (me[3] = xe((se) => d.value = !d.value, ["stop"]))
          }, $(d.value ? "Show less" : "Show more"), 1)) : C("", !0),
          S.value.length ? (c(), h(z, { key: 4 }, [
            g("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: me[4] || (me[4] = (se) => _.value = !0)
            }, "Open the flowchart"),
            _.value ? (c(), H(r1, {
              key: 0,
              title: e.message.text,
              edges: S.value,
              onClose: me[5] || (me[5] = (se) => _.value = !1)
            }, null, 8, ["title", "edges"])) : C("", !0)
          ], 64)) : C("", !0)
        ], 2),
        g("div", {
          class: Z(["message-tools", { picking: he.value }]),
          "data-message-tools": ""
        }, [
          he.value ? (c(), h(z, { key: 0 }, [
            g("div", cp, [
              (c(!0), h(z, null, te(P(Z1), (se) => (c(), h("button", {
                key: se,
                type: "button",
                class: "message-face",
                title: `React ${se}`,
                "data-face": se,
                onClick: (Je) => He(se)
              }, $(se), 9, up))), 128))
            ]),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: me[7] || (me[7] = (se) => he.value = !1)
            }, [
              B(ye, {
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
              onClick: me[8] || (me[8] = (se) => he.value = !0)
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
            }, "Delete")) : C("", !0)
          ], 64))
        ], 2)
      ]),
      Ae.value.length ? (c(), h("div", dp, [
        (c(!0), h(z, null, te(Ae.value, (se) => (c(), h("button", {
          key: se.emoji,
          type: "button",
          class: Z(["message-reaction", { mine: se.mine }]),
          title: se.title,
          "data-reaction": se.emoji,
          onClick: (Je) => a("react", e.message, se.emoji)
        }, [
          ee($(se.emoji) + " ", 1),
          se.count > 1 ? (c(), h("span", hp, $(se.count), 1)) : C("", !0)
        ], 10, fp))), 128))
      ])) : C("", !0),
      q.value.length ? (c(), h("div", mp, [
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
            }, null, 8, gp)
          ], 8, pp)) : (c(), h("a", {
            key: 1,
            href: se.address,
            target: "_blank",
            class: "message-file"
          }, $(se.name), 9, vp))
        ], 64))), 128))
      ])) : C("", !0),
      P(A).length ? (c(), h("div", yp, [
        B(ye, {
          name: "send",
          size: 12
        }),
        (c(!0), h(z, null, te(P(A), (se) => (c(), h("button", {
          key: se.id,
          type: "button",
          class: "message-sent-worker",
          disabled: se.unavailable || !se.open_ref,
          "data-sent-worker": se.id,
          title: `Open worker ${se.id}`,
          onClick: xe((Je) => se.open_ref && P(Fe)(se.open_ref), ["stop"])
        }, [
          ee("Also sent to worker " + $(se.id), 1),
          se.unavailable ? (c(), h(z, { key: 0 }, [
            ee(" (unavailable)")
          ], 64)) : C("", !0)
        ], 8, bp))), 128))
      ])) : C("", !0),
      B(Qn, {
        more: P(O),
        loading: P(N),
        failure: P(X),
        label: "More recipients",
        onMore: P(ie)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      g("div", wp, [
        g("time", kp, $(w.value), 1),
        Number.isInteger(e.message.id) ? (c(), h(z, { key: 0 }, [
          me[11] || (me[11] = g("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          g("span", xp, "message " + $(e.message.id), 1)
        ], 64)) : C("", !0),
        l.value ? (c(), H(W1, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : C("", !0)
      ]),
      P(x).length || P(E) ? (c(), H(D1, {
        key: 3,
        links: P(x),
        total: P(M),
        more: P(k),
        loading: P(p),
        failure: P(E),
        onMore: P(ne)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : C("", !0)
    ], 8, ap));
  }
}, f4 = /* @__PURE__ */ Y(Ep, [["__scopeId", "data-v-0be1107c"]]), Ap = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const r = fi("SkeletonParts", !0);
      return c(!0), h(z, null, te(e.parts, (i, d) => (c(), h(z, { key: d }, [
        (c(!0), h(z, null, te(i.count, (u) => (c(), H(Pt, {
          key: u,
          value: i.shape
        }, {
          line: D(() => [
            B(Gt, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ge({ width: i.width, height: `${t[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: D(() => [
            B(Gt, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ge({ width: `${n[i.size]}px`, height: `${n[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: D(() => [
            B(Gt, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ge({ width: i.width, height: `${i.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: D(() => [...l[0] || (l[0] = [
            g("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: D(() => [
            g("div", {
              class: "skeleton-row",
              style: ge(a(i))
            }, [
              B(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: D(() => [
            g("div", {
              class: "skeleton-stack",
              style: ge(a(i))
            }, [
              B(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: D(() => [
            g("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ge(a(i))
            }, [
              B(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: D(() => [
            g("div", {
              class: "skeleton-grid",
              style: ge(s(i))
            }, [
              B(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), Cp = /* @__PURE__ */ Y(Ap, [["__scopeId", "data-v-fa8baeaf"]]), Op = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, Tp = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", Op, [
      B(Cp, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, As = /* @__PURE__ */ Y(Tp, [["__scopeId", "data-v-52f66b64"]]), Hn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], wa = 200, ur = (e) => {
  var t;
  return ((t = Hn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Hn[0].key;
}, h4 = (e) => {
  var t;
  return ((t = Hn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Rp = ["aria-label"], Ip = 300, wo = 400, Bp = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: wa } },
  setup(e) {
    const t = e, n = T(() => ur(t.value)), a = T(() => n.value < wa ? [1, 0.25, 0.25] : n.value === wa ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (c(), h("svg", {
      class: Z(["ico", "prio", { hot: n.value >= wo, high: n.value >= Ip && n.value < wo }]),
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
    ], 10, Rp));
  }
}, m4 = /* @__PURE__ */ Y(Bp, [["__scopeId", "data-v-b10e610f"]]), ko = (e) => [...new Set(e.agents.map((t) => t.name))], p4 = (e) => ko(e).length === 1 ? `Worker: ${ko(e)[0]}` : "Delegated", Lp = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, xo = (e) => Lp[e.card.state] || "idle", Np = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), $o = { working: 0, waiting: 1, idle: 2, stopped: 3 }, Mo = (e, t) => $o[xo(e)] - $o[xo(t)], So = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, g4 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => Mo(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || Np(a, s)) : [...e].sort((a, s) => Mo(a, s) || (So[t] || So.state)(a, s)), Dp = { class: "list-row" }, jp = {
  key: 0,
  class: "list-row-type"
}, Pp = { class: "list-row-main" }, qp = {
  key: 0,
  class: "list-row-title"
}, Fp = { class: "list-row-body" }, Wp = {
  key: 1,
  class: "list-row-end"
}, Hp = {
  key: 1,
  class: "list-row-text"
}, Up = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", Dp, [
      e.type ? (c(), h("span", jp, $(e.type), 1)) : C("", !0),
      g("div", Pp, [
        e.title ? (c(), h("span", qp, $(e.title), 1)) : C("", !0),
        g("div", Fp, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", Wp, [
          ue(t.$slots, "end", {}, void 0, !0)
        ])) : C("", !0)
      ]),
      e.text ? (c(), h("span", Hp, $(e.text), 1)) : C("", !0)
    ]));
  }
}, v4 = /* @__PURE__ */ Y(Up, [["__scopeId", "data-v-dfc8c3a7"]]), zp = ["aria-expanded"], Vp = { class: "drop-label" }, Gp = ["value"], Kp = {
  key: 1,
  class: "drop-lead"
}, Yp = { class: "drop-item-text" }, Jp = {
  key: 2,
  class: "drop-note"
}, Zp = {
  key: 1,
  class: "drop-none"
}, Xp = {
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
      class: Z(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      g("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: Z(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: u[0] || (u[0] = (f) => s.value = !s.value)
      }, [
        e.icon ? (c(), H(ye, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : C("", !0),
        g("span", Vp, $(e.label), 1),
        B(ye, {
          name: "down",
          size: 11
        })
      ], 10, zp),
      s.value ? (c(), H(ea, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: u[2] || (u[2] = (f) => s.value = !1)
      }, {
        default: D(() => [
          e.searchable ? (c(), h("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: u[1] || (u[1] = (f) => l.value = f.target.value)
          }, null, 40, Gp)) : C("", !0),
          (c(!0), h(z, null, te(r.value, (f) => (c(), H(Mt, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (m) => i(f)
          }, {
            default: D(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: Z(["drop-dot", { live: f.running }])
              }, null, 2)) : C("", !0),
              f.lead ? (c(), h("span", Kp, $(f.lead), 1)) : C("", !0),
              g("span", Yp, $(f.label), 1),
              f.note ? (c(), h("span", Jp, $(f.note), 1)) : C("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          r.value.length ? C("", !0) : (c(), h("p", Zp, $(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : C("", !0)
    ], 2));
  }
}, Qp = /* @__PURE__ */ Y(Xp, [["__scopeId", "data-v-29dfcce5"]]), y4 = {
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
    return (l, r) => (c(), H(Qp, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: r[0] || (r[0] = (i) => a("pick", i.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, eg = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: Z(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      ue(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, dr = /* @__PURE__ */ Y(eg, [["__scopeId", "data-v-978e0921"]]), tg = ["aria-label"], ng = { class: "head" }, ag = { class: "names" }, sg = { class: "body" }, og = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Al(a, n), r = Cl(s);
    return (i, d) => (c(), H(hs, { to: "body" }, [
      B(jt, {
        name: "side",
        appear: "",
        onAfterLeave: P(l)
      }, {
        default: D(() => [
          P(s) ? (c(), h("div", {
            key: 0,
            class: Z(["veil", { over: e.over, under: e.depth }]),
            style: ge({ "--depth": e.depth, zIndex: P(r) }),
            "data-side-panel": "",
            onClick: d[0] || (d[0] = xe((...u) => P(o) && P(o)(...u), ["self"]))
          }, [
            g("aside", {
              class: Z(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(z, { key: 0 }, [
                g("header", ng, [
                  g("div", ag, [
                    g("h2", null, $(e.title), 1),
                    e.abstract ? (c(), H(kt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : C("", !0)
                  ]),
                  ue(i.$slots, "actions", {}, void 0, !0),
                  B(xs, {
                    title: e.closeLabel,
                    onClick: P(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                i.$slots.foot ? (c(), H(dr, { key: 0 }, {
                  default: D(() => [
                    ue(i.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : C("", !0),
                g("div", sg, [
                  ue(i.$slots, "default", {}, void 0, !0)
                ])
              ], 64)) : ue(i.$slots, "default", {}, void 0, !0, 1)
            ], 10, tg)
          ], 6)) : C("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, b4 = /* @__PURE__ */ Y(og, [["__scopeId", "data-v-f276f055"]]), lg = {
  key: 1,
  class: "text-field-label"
}, rg = {
  key: 2,
  class: "text-field-end"
}, ig = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Ha({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var u;
    const n = Wa(e, "modelValue"), a = Xn(), s = "onUpdate:modelValue" in (((u = hi()) == null ? void 0 : u.vnode.props) || {}), o = T(() => s ? n.value : a.value), l = (f) => s && (n.value = f.target.value), r = T(
      () => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), i = T(() => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "value"))), d = I(null);
    return t({ focus: () => d.value && d.value.focus() }), (f, m) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: Z(["text-field", { large: e.large, ended: f.$slots.end }, P(a).class]),
      style: ge(P(a).style)
    }, [
      e.icon ? (c(), H(ye, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : C("", !0),
      e.label ? (c(), h("span", lg, $(e.label), 1)) : C("", !0),
      Ye(g("input", Le({
        ref_key: "input",
        ref: d,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: l }), null, 16), [
        [P(Ya), o.value]
      ]),
      f.$slots.end ? (c(), h("span", rg, [
        ue(f.$slots, "end", {}, void 0, !0)
      ])) : C("", !0)
    ], 6)) : Ye((c(), h("input", Le({
      key: 1,
      ref_key: "input",
      ref: d,
      class: "text-input",
      spellcheck: "false"
    }, i.value, { onInput: l }), null, 16)), [
      [P(Ya), o.value]
    ]);
  }
}), w4 = /* @__PURE__ */ Y(ig, [["__scopeId", "data-v-d9c38ca8"]]), cg = { class: "title" }, ug = { class: "state" }, dg = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = Ua(t.line, t.events);
    return (o, l) => (c(), H(ef, {
      rows: P(n),
      failure: P(a),
      loaded: P(s),
      empty: e.empty
    }, {
      default: D(({ row: r }) => [
        g("span", cg, $(r.title), 1),
        g("span", ug, $(P(kl)(e.noun, r.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, k4 = /* @__PURE__ */ Y(dg, [["__scopeId", "data-v-9191a6f0"]]);
function fg(e = 1e3, t = null) {
  const n = I(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? fe(t, s, { immediate: !0 }) : s(!0), Be(() => clearInterval(a)), n;
}
const ka = I(Date.now() / 1e3);
let _o = 0, Mn = 0;
function fr() {
  return Mn || (ka.value = Date.now() / 1e3, _o = setInterval(() => ka.value = Date.now() / 1e3, 1e3)), Mn += 1, nl() && ms(() => {
    Mn -= 1, Mn || clearInterval(_o);
  }), ka;
}
const hg = 200, mg = or + Rn + lr + hg;
function Wt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function pg(e, t, n) {
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
function gg(e, t, n, a) {
  fe(t, (s) => {
    var d;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((d = a.markMotion) != null && d.value)) return;
    const l = performance.now(), r = [];
    function i() {
      if (a.markMotion.value) {
        if (r.push(pg(o, l, n.value)), performance.now() - l < mg) return void requestAnimationFrame(i);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: r })]);
      }
    }
    i();
  }, { flush: "sync" });
}
const vg = ["title", "data-figure-mark", "data-folded", "data-open"], yg = {
  key: 2,
  class: "worker"
}, bg = { class: "head" }, wg = { key: 0 }, kg = {
  key: 3,
  class: "status"
}, xg = {
  key: 0,
  class: "figure"
}, $g = {
  key: 1,
  class: "ran-for"
}, Mg = { key: 2 }, Sg = {
  key: 3,
  class: "news"
}, _g = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Eg = {
  key: 6,
  class: "settled"
}, Ag = {
  key: 1,
  class: "bar"
}, Cg = {
  key: 3,
  class: "detail body"
}, Og = {
  key: 0,
  class: "body-label"
}, Tg = ["title"], Rg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Xn(), a = ["onClick", "onAct"], s = T(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = I(!1), l = T(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = T(() => t.open !== void 0), i = T(() => r.value || l.value), d = T(() => r.value ? t.open : o.value), u = T(() => r.value ? !t.open : l.value && !o.value), f = T(() => !!(t.mark.action && n.onAct)), m = T(() => i.value || f.value || !!n.onClick), y = I(null), v = I(null), { folded: S, phase: _ } = rr(y, () => u.value);
    gg(y, u, _, Oe(Ne, null));
    function R(ie) {
      var he, Ae;
      if (!(ie.target !== y.value && !v.value.contains(ie.target))) {
        if (r.value) return (he = n.onClick) == null ? void 0 : he.call(n, ie);
        if (l.value) return void (o.value = !o.value);
        (Ae = n.onAct || n.onClick) == null || Ae(ie);
      }
    }
    const F = (ie) => n.onAct(ie), J = ["failed", "unfinished"], j = T(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? J.includes(t.mark.state) ? "danger" : "good" : ""), L = T(() => t.mark.color ? t.mark.color : j.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : j.value ? `var(--tone-${j.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), q = T(() => L.value || "var(--tone-work)"), w = T(() => !t.mark.ending && !t.mark.ended && j.value !== "stopped"), b = fr(), x = T(
      () => t.mark.began_at && w.value && !t.mark.figure && !t.mark.counting ? z1(b.value - t.mark.began_at) : ""
    ), M = T(() => {
      const { started: ie, ended: he } = t.mark;
      return ie ? he ? `ran ${yo(he - ie, !0)}` : yo(b.value - ie, !0) : x.value;
    }), k = ["bad", "danger", "warn"], p = T(() => k.includes(j.value) || t.mark.asks ? "attention" : w.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), E = ["bad", "danger"], A = T(() => E.includes(j.value)), O = T(() => p.value === "process" ? "running" : A.value ? "cross" : j.value === "stopped" ? "stopped" : j.value === "good" ? "tick" : ""), N = T(
      () => !!(t.mark.figure || M.value || t.mark.docked || t.mark.stopping || O.value || t.mark.settled || t.mark.news)
    ), X = T(() => [t.mark.title, t.mark.time ? cr(t.mark.time) : ""].filter(Boolean).join(" · ")), ne = T(() => ({
      ...L.value ? { "--mark": L.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ie, he) => (c(), h("div", Le(s.value, {
      ref_key: "root",
      ref: y,
      class: [
        "mark",
        `w-${p.value}`,
        P(_),
        {
          open: d.value,
          folding: r.value && u.value,
          live: m.value,
          failed: A.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: L.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: ne.value,
      title: X.value,
      "data-figure-mark": e.mark.key,
      "data-folded": P(S) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: R
    }), [
      (c(), H(ht(m.value ? "button" : "span"), {
        ref_key: "top",
        ref: v,
        class: "top",
        type: m.value ? "button" : void 0,
        "aria-expanded": i.value ? String(!!d.value) : void 0
      }, {
        default: D(() => [
          e.mark.markIcon ? (c(), H(dt, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), H(ye, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", yg, $(e.mark.worker), 1)) : C("", !0),
          g("span", bg, [
            B(kt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", wg, $(e.mark.name), 1)) : C("", !0),
            i.value ? (c(), H($t, {
              key: 1,
              open: !!d.value
            }, null, 8, ["open"])) : C("", !0)
          ]),
          N.value ? (c(), h("span", kg, [
            e.mark.figure ? (c(), h("span", xg, $(e.mark.figure), 1)) : C("", !0),
            M.value ? (c(), h("span", $g, $(M.value), 1)) : C("", !0),
            e.mark.stopping ? (c(), h("span", Mg, "Stopping")) : C("", !0),
            e.mark.news ? (c(), h("span", Sg, $(e.mark.news), 1)) : C("", !0),
            O.value === "running" ? (c(), h("span", _g)) : O.value ? (c(), H(dt, {
              key: 5,
              class: Z(["sign", O.value]),
              name: O.value
            }, null, 8, ["class", "name"])) : C("", !0),
            e.mark.settled ? (c(), h("span", Eg, $(e.mark.settled), 1)) : C("", !0)
          ])) : C("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), H(sr, {
        key: 0,
        label: e.mark.action,
        open: !!d.value,
        onClick: xe(F, ["stop"])
      }, null, 8, ["label", "open"])) : C("", !0),
      (e.mark.figure || e.mark.counting) && w.value ? (c(), h("span", Ag, [
        g("span", {
          class: "progress",
          style: ge({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: q.value })
        }, null, 4)
      ])) : C("", !0),
      e.mark.detail && !P(S) ? (c(), H(kt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : C("", !0),
      e.mark.body && !P(S) ? (c(), h("div", Cg, [
        e.mark.bodyLabel ? (c(), h("p", Og, $(e.mark.bodyLabel), 1)) : C("", !0),
        B(kt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : C("", !0),
      e.mark.command && !P(S) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, $(e.mark.command), 9, Tg)) : C("", !0),
      e.mark.card ? (c(), H(kt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : C("", !0),
      ue(ie.$slots, "default", {
        shown: !P(S)
      }, void 0, !0)
    ], 16, vg));
  }
}), hr = /* @__PURE__ */ Y(Rg, [["__scopeId", "data-v-2aa9c496"]]), Ig = 60, mr = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function Bg(e, t) {
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
    if (l || a.value <= 0 || u.scrollTop > Ig) return;
    l = !0;
    const f = u.scrollHeight, m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    l = !1, m.ok && (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, await mt(), u.scrollTop += u.scrollHeight - f);
  }
  return { lines: n, newest: r, follow: i, loadEarlier: d };
}
const Lg = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function pr(e) {
  var n;
  const t = Lg[e] || ((n = qt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Ng = (e) => pr(String(e).split(":")[0]), Dg = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), jg = { passed: "good", failed: "danger", warned: "warn", running: "" }, Pg = { good: "good", warn: "warn", danger: "danger" }, Eo = {
  "open row": (e) => Fe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Ud(e.target_model, e.target_id || 0)
}, qg = { "open row": (e) => Ng(e.target_model), "open page": () => pr("pages") };
function Fg(e, t) {
  const n = t || {}, a = Eo[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? jg[e.outcome] || "" : Pg[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? qg[a](e) : "",
    handlers: a ? { onAct: () => Eo[a](e) } : {}
  };
}
const Wg = 24, Hg = 1e3, Ao = 2e3, Ug = 0.25, zg = 5e3;
function Vg(e, t = Wg, n = () => !0) {
  const a = I(!1), s = I(0), o = I(!1);
  let l = 0, r = 0, i = 0;
  const d = () => e && "value" in e ? e.value : e, u = () => {
    const j = d();
    return j ? j.scrollHeight - j.scrollTop - j.clientHeight : 0;
  }, f = () => !d() || u() <= t;
  function m(j) {
    if (clearTimeout(l), !j) {
      o.value = !1, i = Date.now();
      return;
    }
    const L = Date.now() - i < Ao ? Ao : Hg;
    l = setTimeout(() => o.value = a.value, L);
  }
  function y() {
    clearTimeout(r), a.value = !1, s.value = 0, m(!1);
  }
  function v(j = !1) {
    const L = d();
    L && j && L.scrollTo ? L.scrollTo({ top: L.scrollHeight, behavior: "smooth" }) : L && (L.scrollTop = L.scrollHeight), y();
  }
  function S() {
    R(), !a.value && (a.value = !0, m(!0));
  }
  const _ = () => !!d() && u() <= d().clientHeight * Ug;
  function R() {
    clearTimeout(r), _() && (r = setTimeout(() => a.value && _() && n() && v(!0), zg));
  }
  function F() {
    f() ? y() : S();
  }
  function J(j = 1, L = !1) {
    a.value ? s.value += Math.max(0, j) : v(L);
  }
  return nl() && ms(() => [l, r].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: u, atBottom: f, follow: y, toBottom: v, left: S, scrolled: F, arrived: J };
}
const Gg = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Kg = (e) => String(e ?? "").replace(Gg, ""), Yg = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(null), { away: o, scrolled: l, arrived: r, toBottom: i } = Vg(s);
    fe(
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
      ee($(P(Kg)(e.lines.join(`
`)) || e.empty), 1),
      P(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (m) => P(i)(!0))
      }, "Follow")) : C("", !0)
    ], 544));
  }
}, Jg = /* @__PURE__ */ Y(Yg, [["__scopeId", "data-v-c2fb1783"]]), Zg = 1e4;
class Xg {
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
    return this.heardAt !== null && t - this.heardAt > Zg;
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
const Qg = {
  key: 0,
  class: "frame-note"
}, ev = {
  key: 0,
  class: "frame-note"
}, tv = ["src", "title"], nv = 1e3, av = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = We(), a = I(null), s = I(!1), o = I(!1);
    let l = null, r = 0;
    return Re(() => {
      l = new Xg(a.value, n), l.start(), r = setInterval(() => {
        s.value = l.silent();
      }, nv);
    }), Be(() => {
      l == null || l.stop(), clearInterval(r);
    }), (i, d) => o.value ? (c(), h("p", Qg, "This window was closed because it stopped answering.")) : (c(), h(z, { key: 1 }, [
      s.value ? (c(), h("div", ev, [
        d[2] || (d[2] = g("p", null, "This window has not answered for ten seconds.", -1)),
        B(de, {
          onClick: d[0] || (d[0] = (u) => o.value = !0)
        }, {
          default: D(() => [...d[1] || (d[1] = [
            ee("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : C("", !0),
      g("iframe", {
        ref_key: "frame",
        ref: a,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: P(n).window
      }, null, 8, tv)
    ], 64));
  }
}, sv = /* @__PURE__ */ Y(av, [["__scopeId", "data-v-32a49046"]]), Sn = (e) => e ? e.split(", ") : [];
function ov({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function lv(e, t) {
  return {
    reads: Sn(e.reads_allowed),
    runs: Sn(e.runs_allowed),
    missing: [...Sn(e.reads_missing), ...Sn(e.runs_missing)],
    ask: t
  };
}
const rv = {
  class: "allowance-prompt",
  role: "dialog"
}, iv = { class: "allowance-prompt-text" }, cv = { class: "allowance-prompt-buttons" }, uv = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", rv, [
      g("p", iv, $(P(ov)(e.request)), 1),
      g("div", cv, [
        B(de, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: D(() => [...s[2] || (s[2] = [
            ee("Allow", -1)
          ])]),
          _: 1
        }),
        B(de, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: D(() => [...s[3] || (s[3] = [
            ee("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, dv = /* @__PURE__ */ Y(uv, [["__scopeId", "data-v-cad69fe2"]]), xa = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), H(Qt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: D(() => [
        ee($(e.reason) + " ", 1),
        e.retry ? (c(), H(de, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: D(() => [...s[2] || (s[2] = [
            ee("Retry", -1)
          ])]),
          _: 1
        })) : C("", !0),
        e.removable ? (c(), H(de, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: D(() => [...s[3] || (s[3] = [
            ee("Remove tab", -1)
          ])]),
          _: 1
        })) : C("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, fv = ["data-window", "data-agent"], hv = {
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
    const r = Oe(jc, null), i = ju({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: T(() => n.options),
      declared: n.declared,
      page: Oe(Ru, null),
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
    al(Ne, i), fe(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Re(i.settle), Be(() => {
      i.cancel(), n.subscriptions.stopAll(n.name);
    }), mi((f) => (s.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const d = () => Jn(n.component), u = () => {
      var f, m;
      return ((m = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : m.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, m) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      u() ? (c(), H(dv, {
        key: 0,
        request: u(),
        onAnswer: m[0] || (m[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : C("", !0),
      e.unavailableReason ? (c(), H(xa, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (c(), H(xa, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (c(), h(z, { key: 4 }, [
        (c(), H(d, { key: o.value })),
        e.skeleton.length && !P(i).answered.value ? (c(), H(As, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : C("", !0)
      ], 64)) : (c(), H(xa, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: m[1] || (m[1] = (y) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, fv));
  }
}, Kt = /* @__PURE__ */ Y(hv, [["__scopeId", "data-v-c4443e2b"]]), gr = {
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
    const n = e, a = t, s = { render: () => Jn(sv, { src: n.entry.entry_url }) };
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
}, mv = ["data-window"], vr = {
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
    return fe(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, nc();
          } catch (r) {
            if (ec(r) && tc(r)) return;
            o.value = `This window's file could not be loaded: ${r.message}`;
          }
      },
      { immediate: !0 }
    ), (l, r) => !s.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      B(As, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, mv)) : (c(), H(Kt, {
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
}, pv = "*.*", gv = {
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
    const t = e, n = Oe(Ne, null), a = new Cc();
    fe(
      () => a.patterns,
      (i, d, u) => {
        var m;
        const f = (m = n == null ? void 0 : n.subscriptions) == null ? void 0 : m.follow(`body of ${t.declaration.type}`, i, (y) => a.dispatch(y));
        u(() => f == null ? void 0 : f());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = T(() => !!(t.declaration.shipped || t.declaration.trusted)), r = T(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [pv] : t.declaration.events ?? [],
      options: []
    }));
    return (i, d) => l.value ? (c(), H(vr, {
      key: 0,
      entry: r.value,
      subscriptions: P(a),
      environment: P(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), H(gr, {
      key: 1,
      entry: r.value,
      subscriptions: P(a),
      environment: P(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, vv = { class: "mark-more-inner" }, yv = {
  class: "mark-lines",
  "data-mark-reason": ""
}, bv = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, wv = {
  key: 3,
  class: "mark-lines"
}, kv = "process", Co = "task", xv = {
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
    ), s = T(() => Dg.has(t.mark.variant) && t.mark.detail || ""), o = T(() => t.mark.target_model === Co ? t.mark.target_id : 0), l = Bg(
      mr(n),
      () => t.mark.target_id
    ), r = l.lines, i = I(!1), d = I(""), u = T(() => !t.declaration.body_url && t.mark.target_model === kv && !!t.mark.target_id);
    async function f(y = l.follow) {
      const v = await y();
      i.value = !0, d.value = v.ok ? "" : v.error;
    }
    const m = T(() => t.shown && u.value);
    return fe(m, (y) => y && f()), gs(() => m.value && f(), () => m.value && !t.mark.ended_at), fe(
      () => t.mark.ended_at,
      (y) => y && m.value && f(l.newest)
    ), (y, v) => (c(), h("div", {
      class: Z(["mark-more", { open: e.shown }]),
      onClick: v[1] || (v[1] = xe(() => {
      }, ["stop"]))
    }, [
      g("div", vv, [
        e.declaration.body_url ? (c(), H(gv, {
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
            v[2] || (v[2] = g("p", { class: "mark-label" }, "Why it stopped", -1)),
            g("p", yv, $(s.value), 1)
          ], 64)) : C("", !0),
          u.value && d.value ? (c(), h("p", bv, $(d.value), 1)) : u.value && i.value ? (c(), h(z, { key: 2 }, [
            v[3] || (v[3] = g("p", { class: "mark-label" }, "Output", -1)),
            B(Jg, {
              class: "mark-terminal",
              lines: P(r),
              onOlder: P(l).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (c(), h("p", wv, $(a.value.join(`
`)), 1)) : C("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: v[0] || (v[0] = xe((S) => P(Fe)(`${Co}:${o.value}`), ["stop"]))
          }, " Open task " + $(o.value) + " and its proofs ", 1)) : C("", !0)
        ], 64))
      ])
    ], 2));
  }
}, ns = /* @__PURE__ */ Y(xv, [["__scopeId", "data-v-2f996108"]]), $v = ["title", "aria-label", "onClick"], Mv = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Sv = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = T(() => vd(t.buttons, t.allowedRuns).filter((l) => {
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
        onClick: xe((d) => o(i), ["stop"])
      }, [
        B(dt, {
          name: i.icon
        }, null, 8, ["name"])
      ], 8, $v))), 128)),
      a.value ? (c(), h("span", Mv, $(a.value), 1)) : C("", !0)
    ], 64));
  }
}, _v = /* @__PURE__ */ Y(Sv, [["__scopeId", "data-v-7a62c88e"]]);
function yr(e, t) {
  const n = Ke(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Me.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const br = yr("/api/marks", "marks"), x4 = br.fetchAll, Ev = br.find, Av = ["data-ref"], Cv = ["data-ref"], Ov = { class: "mark-row" }, Tv = "dock add", Rv = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = T(() => Ev(a.mark.type)), o = T(() => Fg(a.mark, s.value)), l = T(() => {
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
        return !a.docked || !((m = f.runs) != null && m.startsWith(Tv));
      }).map((f) => ({ ...f, module: s.value.module }));
    });
    return (u, f) => {
      var m, y;
      return (m = s.value) != null && m.card ? (c(), h("div", {
        key: 0,
        class: Z(["thread-turn", "card", "whole-card", { "user-side": P(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        B(ns, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, Av)) : (c(), h("div", {
        key: 1,
        class: Z(["thread-turn", "card", { "full-width": (y = s.value) == null ? void 0 : y.full_width, docked: e.docked, "user-side": P(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        g("span", Ov, [
          B(hr, Le({
            mark: o.value,
            open: l.value ? r.value : void 0
          }, pi(o.value.handlers), { onClick: i }), gi({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: D(({ shown: v }) => [
                B(ns, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: v
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          B(_v, {
            buttons: d.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Cv));
    };
  }
}, Iv = /* @__PURE__ */ Y(Rv, [["__scopeId", "data-v-afd7d6b1"]]), Bv = ["data-ref"], Lv = ["inert"], Nv = { class: "group-fold" }, Dv = { class: "thread-group" }, jv = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = I(!1), a = I(!1), s = I(!1), o = I(null);
    fe(n, async (r) => {
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
      B(hr, {
        mark: l.value,
        open: n.value,
        onClick: i[0] || (i[0] = (d) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (c(), h("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: Z(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        g("div", Nv, [
          g("div", Dv, [
            (c(!0), h(z, null, te(e.group.marks, (d) => (c(), H(Iv, {
              key: d.id,
              mark: d
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, Lv)) : C("", !0)
    ], 8, Bv));
  }
}, $4 = /* @__PURE__ */ Y(jv, [["__scopeId", "data-v-45b58b9b"]]);
function Pv(e) {
  const t = I(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Re(() => n.observe(e.value)), ft(() => n.disconnect()), t;
}
const qv = { class: "chat-dock-fold" }, Fv = ["aria-label"], Wv = { class: "chat-dock-head" }, Hv = { class: "chat-dock-inner" }, Uv = { class: "chat-dock-foot" }, wr = 700, zv = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = I(null), a = I(null), s = Pv(a), o = I(!1);
    let l = 0;
    return Re(() => l = setTimeout(() => o.value = !0, wr)), ft(() => clearTimeout(l)), t({ card: n }), (r, i) => (c(), h("div", {
      class: Z(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      g("div", qv, [
        g("section", {
          ref_key: "card",
          ref: n,
          class: Z(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ue(r.$slots, "edge", {}, void 0, !0),
          g("header", Wv, [
            ue(r.$slots, "head", {}, void 0, !0)
          ]),
          g("div", {
            class: Z(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            g("div", Hv, [
              g("div", {
                class: Z(["chat-dock-grow", { settled: o.value }]),
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
          g("footer", Uv, [
            ue(r.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, Fv)
      ])
    ], 2));
  }
}, kr = /* @__PURE__ */ Y(zv, [["__scopeId", "data-v-74d44b19"]]), Vv = {
  class: "dock-leave",
  "aria-hidden": "true"
}, $a = 5, Gv = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min($a, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${$a}s`, animationDelay: `${(n - $a).toFixed(2)}s` };
    return (s, o) => (c(), h("span", Vv, [
      g("i", { style: a })
    ]));
  }
}, xr = /* @__PURE__ */ Y(Gv, [["__scopeId", "data-v-2a7bc150"]]), Kv = { reviewing: "Under review" }, Yv = (e, t) => e || Kv[t == null ? void 0 : t.state] || "", Qe = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Jv = {
  draft: [{ word: "ready", label: "Mark ready" }, Qe],
  ready: [Qe],
  approved: [{ word: "start", label: "Start", main: !0 }, Qe],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Qe],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Qe],
  completed: [],
  cancelled: []
}, Zv = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Qe],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Qe],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, Qe],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Qe],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, Xv = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], Qv = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], e0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], t0 = (e) => e ? e.state === "removed" ? [{ word: "restore", label: "Restore", main: !0 }] : [{ word: "remove", label: "Remove", flag: "--reason", ask: "Why is it removed?" }] : [], n0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], a0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function s0(e, t) {
  const n = { plan: Jv, task: Zv }[e], a = t != null && t.state ? Tu(e, t.state) : null;
  return a ? ((n == null ? void 0 : n[xl(e, t.state)]) ?? []).filter((s) => a.includes(s.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const o0 = (e, t) => e === "doc" || e === "report" ? a0(t).map((n) => ({ ...n, word: e === "doc" ? "settle" : n.word })) : e === "agent" ? [...e0(t), ...Qv(t)] : e === "check" ? n0(t) : e === "question" ? Xv(t) : e === "memory" ? t0(t) : s0(e, t), $r = yr("/api/docks", "docks"), M4 = $r.fetchAll, zt = $r.find, l0 = 6, r0 = 3, Ma = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, na = (e) => Date.parse(e.leaves_at) / 1e3, wt = (e) => !!(e.leaves_at && !e.kept), i0 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!wt(e) || t < na(e) || n.has(e.id)), c0 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => i0(a, t, n)).sort((a, s) => a.id - s.id);
function u0(e, t, n = l0) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(na(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const d0 = (e, t, n = e) => n < 2 ? !1 : e >= r0 ? !0 : t, f0 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), as = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), h0 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), m0 = (e) => ({ ...e.kept ? as("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : as("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), p0 = ["pins"], g0 = (e) => ({ ...e, iconOnly: p0.includes(e.icon) });
function v0(e, t) {
  var n;
  return [
    ...h0(e, t) ? [m0(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || qt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    as("undock", "close", "Close this card", `dock remove ${e.id}`)
  ].map(g0);
}
function y0(e, t) {
  const n = v0(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: f0(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const b0 = ["title"], w0 = {
  key: 2,
  class: "dock-controls"
}, k0 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, x0 = { class: "dock-facts" }, $0 = { key: 1 }, M0 = {
  key: 2,
  class: "dock-kept"
}, S0 = { class: "dock-acts" }, _0 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = T(() => zt(a.item.type)), o = fr(), l = T(() => ir(a.item.created_at, o.value * 1e3)), r = I(null), i = I(null), d = I(null), u = I(null), f = T(() => y0(a.item, s.value)), m = We(), y = T(() => `dock.${a.item.id}`), v = T(() => m.props[y.value].data.value), S = T(() => Fn(a.item.target_model ?? "")), _ = T(() => ({ ...v.value, id: a.item.target_id, noun: S.value })), R = () => {
      var b, x;
      return ((x = (b = s.value) == null ? void 0 : b.reads) == null ? void 0 : x.length) && m.reload(y.value);
    };
    qc(al, { data: v, reload: R, readOutput: mr(m) }), fe(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (b, x, M) => {
        var p;
        R();
        const k = (p = m.subscriptions) == null ? void 0 : p.follow(`dock ${a.item.id}`, [`${S.value.replaceAll("-", "_")}.*`], (E) => {
          (!E.row_id || E.row_id === a.item.target_id) && R();
        });
        M(() => k == null ? void 0 : k());
      },
      { immediate: !0 }
    );
    const F = I(/* @__PURE__ */ new Set()), J = I("");
    async function j(b) {
      if (b.action === "open") return Fe(`${a.item.target_model}:${a.item.target_id}`);
      b.action === "declared" && (F.value = /* @__PURE__ */ new Set([...F.value, b.label])), J.value = "";
      const M = await cn(b, { id: a.item.target_id }, m.environment);
      (M == null ? void 0 : M.ok) === !1 && (F.value = new Set([...F.value].filter((k) => k !== b.label)), J.value = `Could not ${b.label.toLowerCase()}: ${M.error}`);
    }
    const L = T(() => f.value.actions.filter((b) => b.action !== "undock" && !F.value.has(b.label))), q = T(() => {
      var b;
      return Yv((b = s.value) == null ? void 0 : b.badge, _.value);
    }), w = T(() => f.value.buttons.find((b) => b.action === "undock"));
    return (b, x) => {
      var M, k, p, E;
      return c(), H(kr, {
        label: f.value.title + ((M = s.value) != null && M.needs_user ? ", waiting for you" : ""),
        type: (k = s.value) != null && k.needs_user ? "waiting" : "",
        folded: !!((p = s.value) != null && p.folds) && e.folded,
        body: !!((E = s.value) != null && E.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: x[3] || (x[3] = (A) => e.collapsed && n("open"))
      }, {
        edge: D(() => [
          e.leaving && !e.item.kept ? (c(), H(xr, {
            key: 0,
            "ends-at": P(na)(e.item)
          }, null, 8, ["ends-at"])) : C("", !0)
        ]),
        head: D(() => {
          var A, O;
          return [
            (A = s.value) != null && A.draws_head && !e.collapsed ? (c(), h("span", {
              key: 0,
              ref_key: "head",
              ref: r,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (c(), h(z, { key: 1 }, [
              B(ye, {
                name: f.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              g("span", {
                class: "dock-title",
                title: f.value.title
              }, $(f.value.title), 9, b0)
            ], 64)),
            f.value.controls.length && !e.collapsed ? (c(), h("span", w0, [
              (c(!0), h(z, null, te(f.value.controls, (N) => {
                var X, ne;
                return c(), h(z, {
                  key: N.action + N.runs
                }, [
                  !F.value.has(N.label) && (!((X = N.variants) != null && X.length) || !((ne = _.value) != null && ne.state) || N.variants.includes(_.value.state)) ? (c(), H(de, {
                    key: 0,
                    variant: "icon",
                    class: Z({ kept: N.pressed }),
                    "aria-pressed": N.pressed,
                    "aria-label": N.label,
                    title: N.label,
                    "data-dock-action": N.action,
                    onClick: (ie) => j(N)
                  }, {
                    default: D(() => [
                      B(ye, {
                        name: N.icon,
                        size: 13
                      }, null, 8, ["name"])
                    ]),
                    _: 2
                  }, 1032, ["class", "aria-pressed", "aria-label", "title", "data-dock-action", "onClick"])) : C("", !0)
                ], 64);
              }), 128))
            ])) : C("", !0),
            g("span", {
              ref_key: "time",
              ref: u,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (O = s.value) != null && O.leaves_after_seconds ? C("", !0) : (c(), h(z, { key: 0 }, [
                ee($(l.value), 1)
              ], 64))
            ], 512)
          ];
        }),
        still: D(() => [
          J.value || e.refusal ? (c(), h("p", k0, $(J.value || e.refusal), 1)) : C("", !0)
        ]),
        foot: D(() => {
          var A, O;
          return [
            g("span", x0, [
              q.value ? (c(), h("span", {
                key: 0,
                class: Z(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, $(q.value), 3)) : C("", !0),
              (A = s.value) != null && A.word ? (c(), h("span", $0, $(s.value.word), 1)) : C("", !0),
              g("span", {
                ref_key: "foot",
                ref: i,
                class: "dock-module-facts"
              }, null, 512),
              e.item.kept ? (c(), h("span", M0, "Kept")) : C("", !0)
            ]),
            (O = s.value) != null && O.folds ? (c(), H(de, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: x[0] || (x[0] = (N) => n("fold"))
            }, {
              default: D(() => [
                ee($(s.value.folds) + " ", 1),
                B($t, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : C("", !0),
            g("span", S0, [
              g("span", {
                ref_key: "actions",
                ref: d,
                class: "dock-module-actions"
              }, null, 512),
              B(Td, {
                name: `dock.${e.item.type}`,
                row: _.value,
                environment: P(m).environment,
                "read-only": P(m).readOnly,
                "object-name": P(Fn)(e.item.target_model),
                "external-failure": "",
                onFailure: x[1] || (x[1] = (N) => J.value = N),
                onDone: b.loadRow
              }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
              (c(!0), h(z, null, te(L.value, (N) => (c(), H(de, {
                key: N.action + N.runs,
                small: "",
                variant: N.primary ? "primary" : "ghost",
                bordered: !N.primary,
                "data-dock-action": N.action,
                onClick: (X) => j(N)
              }, {
                default: D(() => [
                  ee($(N.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128)),
              B(de, {
                small: "",
                bordered: "",
                title: w.value.label,
                "data-dock-action": "undock",
                onClick: x[2] || (x[2] = (N) => n("undock", w.value))
              }, {
                default: D(() => [...x[4] || (x[4] = [
                  ee("Close", -1)
                ])]),
                _: 1
              }, 8, ["title"])
            ])
          ];
        }),
        default: D(() => {
          var A;
          return [
            (A = s.value) != null && A.body_url ? (c(), H(ns, {
              key: 0,
              declaration: s.value,
              mark: e.item,
              shown: "",
              head: r.value,
              foot: i.value,
              actions: d.value,
              time: u.value,
              folded: e.folded
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded"])) : C("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, Oo = /* @__PURE__ */ Y(_0, [["__scopeId", "data-v-a1d83375"]]), E0 = ["title", "aria-label"], A0 = { class: "run-chip-in" }, C0 = {
  key: 0,
  class: "run-chip-ring"
}, O0 = { class: "run-chip-name" }, T0 = { class: "run-chip-bar" }, R0 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = We(), o = T(() => `run.${a.item.target_id}`), l = T(() => s.props[o.value].data.value), r = T(() => !l.value || l.value.state === "running" || l.value.state === "background"), i = T(() => {
      var m, y;
      return ((m = l.value) == null ? void 0 : m.title) || ((y = l.value) == null ? void 0 : y.line) || a.item.title || "";
    }), d = T(() => r.value ? t.running : t[l.value.state] ?? "var(--text-3)"), u = () => s.reload(o.value);
    let f = null;
    return Re(() => {
      var m;
      u(), f = (m = s.subscriptions) == null ? void 0 : m.follow(`run chip ${a.item.id}`, ["process.*"], (y) => {
        (!y.row_id || y.row_id === a.item.target_id) && u();
      });
    }), ft(() => f == null ? void 0 : f()), (m, y) => {
      var v;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: ge({ "--tone": d.value })
      }, [
        P(wt)(e.item) ? (c(), H(xr, {
          key: 0,
          "ends-at": P(na)(e.item)
        }, null, 8, ["ends-at"])) : C("", !0),
        g("span", A0, [
          r.value ? (c(), h("span", C0)) : (c(), H(dt, {
            key: 1,
            name: n[l.value.state] ?? "stop"
          }, null, 8, ["name"])),
          g("span", O0, $(i.value), 1)
        ]),
        g("span", T0, [
          g("i", {
            style: ge({ width: r.value ? `${((v = l.value) == null ? void 0 : v.progress) ?? 0}%` : "100%", background: d.value })
          }, null, 4)
        ])
      ], 12, E0);
    };
  }
}, I0 = /* @__PURE__ */ Y(R0, [["__scopeId", "data-v-226ac6c8"]]), B0 = 24, L0 = 8, S4 = 420;
function _4({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= B0 ? !0 : e < t && s > L0 ? !1 : null;
}
const N0 = (e, t) => e === void 0 ? t : e, D0 = { me: 1, people: [] }, Un = Zn({
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
  people: D0,
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
Dl("journal.activity", () => Un.activity);
Dl("journal.side.mini", () => Un.sideMini);
const Mr = "journal.viewer.";
function j0(e, t, n) {
  try {
    const a = n.getItem(Mr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function P0(e, t, n) {
  try {
    n.setItem(Mr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function To(e, t, n = window.localStorage) {
  const a = I(j0(e, t, n));
  return fe(a, (s) => P0(e, s, n), { deep: !0 }), a;
}
const q0 = {
  key: "dock-all",
  class: "dock-all"
}, F0 = {
  key: "runs-head",
  class: "dock-runs-head"
}, W0 = { class: "dock-runs-title" }, H0 = { class: "dock-runs-chips" }, U0 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean },
  setup(e) {
    var k, p;
    const t = e, n = fg(500), a = I(/* @__PURE__ */ new Set()), s = I(!1), o = I(!1), l = Oe(Ne), r = I(/* @__PURE__ */ new Set()), i = I({});
    async function d(E, A) {
      i.value = { ...i.value, [E.id]: "" }, r.value = /* @__PURE__ */ new Set([...r.value, E.id]);
      const O = await cn(A, { id: E.target_id }, l.environment);
      (O == null ? void 0 : O.ok) === !1 && (r.value = new Set([...r.value].filter((N) => N !== E.id)), i.value = { ...i.value, [E.id]: `Could not close this card: ${O.error}` });
    }
    const u = T(
      () => c0(
        t.items.filter((E) => !r.value.has(E.id)),
        n.value,
        a.value
      )
    ), f = T(
      () => u0(
        u.value.filter((E) => Ma(E, zt)),
        n.value
      )
    ), m = T(() => u.value.filter((E) => !f.value.includes(E) && !Ma(E, zt))), y = T(() => f.value.filter((E) => !wt(E))), v = To(`dock-size:${((k = Un.identity) == null ? void 0 : k.root) || location.host}`, null), S = (E) => v.value ? v.value.collapsed && !v.value.opened.includes(E.id) : t.collapsed, _ = T(() => u.value.some(S)), R = T(() => (s.value = d0(f.value.length, s.value, y.value.length)) && !o.value && !u.value.some(S));
    function F() {
      v.value = { collapsed: !_.value, opened: [] };
    }
    function J(E) {
      var O;
      if (!S(E)) return;
      const A = (O = v.value) != null && O.collapsed ? v.value.opened : [];
      v.value = { collapsed: !0, opened: [...A, E.id] };
    }
    const j = To(`dock-folded:${((p = Un.identity) == null ? void 0 : p.root) || location.host}`, {}), L = (E) => {
      var A;
      return !!((A = zt(E.type)) != null && A.folds) && N0(j.value[E.id], Ma(E, zt) || t.folded);
    };
    function q(E) {
      j.value = { ...j.value, [E.id]: !L(E) };
    }
    function w(E) {
      j.value = { ...j.value, ...Object.fromEntries(f.value.map((A) => [A.id, A.id !== E.id])) }, o.value = !0;
    }
    function b() {
      j.value = Object.fromEntries(Object.entries(j.value).filter(([E]) => !f.value.some((A) => String(A.id) === E))), o.value = !1;
    }
    function x(E) {
      a.value = /* @__PURE__ */ new Set([...a.value, E.id]);
    }
    function M(E) {
      a.value = new Set([...a.value].filter((A) => A !== E.id));
    }
    return (E, A) => (c(), H(tl, {
      tag: "div",
      name: "dock",
      duration: P(wr),
      class: "dock-stack"
    }, {
      default: D(() => [
        u.value.length > 1 ? (c(), h("div", q0, [
          B(de, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": _.value ? "Open all" : "Collapse all",
            onClick: F
          }, {
            default: D(() => [
              B($t, {
                open: !_.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : C("", !0),
        (c(!0), h(z, null, te(m.value, (O) => (c(), H(Oo, {
          key: O.id,
          item: O,
          class: Z({ timed: P(wt)(O) }),
          leaving: P(wt)(O) && !a.value.has(O.id),
          folded: L(O),
          collapsed: S(O),
          refusal: i.value[O.id],
          onOpen: (N) => J(O),
          onFold: (N) => q(O),
          onUndock: (N) => d(O, N),
          onMouseenter: (N) => x(O),
          onMouseleave: (N) => M(O)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !_.value ? (c(), h("div", F0, [
          g("span", null, $(f.value.length) + " runs", 1),
          B(de, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: b
          }, {
            default: D(() => [
              A[1] || (A[1] = ee(" Runs ", -1)),
              B($t, { open: "" })
            ]),
            _: 1
          })
        ])) : C("", !0),
        (c(!0), h(z, null, te(R.value ? [] : f.value, (O) => (c(), H(Oo, {
          key: O.id,
          item: O,
          class: Z({ timed: P(wt)(O) }),
          leaving: P(wt)(O) && !a.value.has(O.id),
          folded: L(O),
          collapsed: S(O),
          refusal: i.value[O.id],
          onOpen: (N) => J(O),
          onFold: (N) => q(O),
          onUndock: (N) => d(O, N),
          onMouseenter: (N) => x(O),
          onMouseleave: (N) => M(O)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        R.value ? (c(), H(kr, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: D(() => [
            B(ye, {
              name: "runs",
              size: 14
            }),
            g("span", W0, $(f.value.length) + " runs", 1)
          ]),
          foot: D(() => [
            g("span", H0, [
              (c(!0), h(z, null, te(f.value, (O) => (c(), H(I0, {
                key: O.id,
                item: O,
                onClick: (N) => w(O)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            B(de, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: A[0] || (A[0] = (O) => o.value = !0)
            }, {
              default: D(() => [
                A[2] || (A[2] = ee(" Runs ", -1)),
                B($t)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["label"])) : C("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, E4 = /* @__PURE__ */ Y(U0, [["__scopeId", "data-v-d078676b"]]), xt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, In = (e) => Math.min(Math.max(e, 0), 1), z0 = (e) => {
  const t = In(e);
  return t * t * (3 - 2 * t);
}, gt = (e, t, n) => z0((e - t) / (n - t));
function A4(e) {
  const t = In(e), n = In((t - 0.12) / 0.76) * xt.shuffles, a = Math.min(Math.floor(n), xt.shuffles - 1), s = n - a, o = gt(s, 0.26, 0.38) * (1 - gt(s, 0.76, 0.96)), l = gt(s, 0.38, 0.76), r = gt(t, 0, 0.12) * (1 - gt(t, 0.88, 1)), i = gt(s, 0.2, 0.34) * (1 - gt(s, 0.84, 1)), d = Math.sin(Math.PI * In((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / xt.shuffles, lift: xt.lift * o, ready: r, weight: i, follow: d, shuffle: a, phase: s };
}
function C4(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const Ro = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, O4 = (e) => Ro[e] ?? Ro.butler, Cs = 2400, V0 = 0.05;
function G0({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, V0), l = Math.min(t + Cs * o, s), r = e + l * o;
  return r < n ? { y: r, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function T4(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function K0(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function R4(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const I4 = (e, t) => ({ ...e, stretch: t.stretch }), B4 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, Sr = (e, t) => t >= (e.least ?? 0);
function L4(e, t, n) {
  if (!Sr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const N4 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), Y0 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", Io = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), J0 = (e) => e.right > e.left && e.bottom > e.top;
function D4(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(Y0)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let r = Io(l, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (r = Io(r, i.getBoundingClientRect()), a && (r.bottom = Math.min(r.bottom, a.top))), J0(r) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: r }] : [];
  });
}
function _r(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, r = 1;
    for (const [u, f, m] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[u] - e[u];
      if (Math.abs(y) < 1e-9)
        (e[u] < o[f] || e[u] > o[m]) && (r = -1);
      else {
        const v = (o[f] - e[u]) / y, S = (o[m] - e[u]) / y;
        l = Math.max(l, Math.min(v, S)), r = Math.min(r, Math.max(v, S));
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
}, tn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Z0 = (e) => e * e * (3 - 2 * e), Ee = (e, [t, n]) => Z0(tn(e, t, n)), X0 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], it = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, _n = ([e, t], n) => e + n() * (t - e);
function Q0(e) {
  return X0.map(() => {
    const t = _n(it.speed, e), n = _n(it.angle, e) * Math.PI / 180, a = _n(it.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [_n(it.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const ey = Q0(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function ty(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * it.gravity * (t[2] - it.floor))) / it.gravity;
}
function j4(e, t, n = ey) {
  const a = _e.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = ty(o, a.from), r = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + r) return null;
  const i = Math.min(s, l), d = a.from.map((u, f) => u + o.velocity[f] * i);
  return d[2] -= it.gravity * i * i / 2, { at: d, turn: o.spin * i, landed: Math.max(0, s - l) / r };
}
const P4 = (e, t) => e && _e[e.name] ? { name: e.name, u: t / e.frames } : null;
function q4(e, t) {
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
const F4 = () => Array.from({ length: _e.pogo.count }, (e, t) => _e.pogo.bounce * (t + 1) / _e.pogo.count), Lt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function W4(e, t, n) {
  const { away: a, side: s } = _e.bug_smash, o = s * a * n, [l, r] = [t.left + Lt.margin * n, t.right - Lt.margin * n], i = Math.min(Math.max(e + o + s * Lt.reach * n, l), r), d = i - o - e, u = i - (s * d > 0 ? d / 2 : 0);
  return { figure: [e - t.left, u - o - t.left], bug: [i - t.left, u - t.left] };
}
function H4(e, t, n) {
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
function U4(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Lt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = G0({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Ie = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function z4(e) {
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
function ny(e, t) {
  const n = _e.bug_shot, [a, s] = n.turn.map((u) => u * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = K0(e, o), r = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), d = e >= a + t * (s - a) ? t : r + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: r, shot: d };
}
function V4(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = _e.bug_shot, { frame: l, bug: r, shot: i } = ny(n, e.length), d = e.map((R, F) => ({ ...ss(R, t, Math.min(n / o.fps, Bn(F).shot)), shot: F < i })), u = Ee(l / o.frames, o.aim), [f, m] = [d[Math.max(r - 1, 0)], d[r]], y = e.map((R, F) => ({ bug: R, index: F, seconds: n / o.fps - Bn(F).shot, spot: ss(R, t, Bn(F).shot) })).filter((R) => R.seconds >= 0), v = y.flatMap((R) => {
    const F = (s == null ? void 0 : s.get(R.index)) ?? ry(R.bug, t, R.spot, s ? [] : a);
    return s == null || s.set(R.index, F), s && iy(F, R.seconds, a), cy(F, R.seconds, a);
  }), S = y.filter((R) => oy(R.bug)).map((R) => ({ seconds: R.seconds, from: R.spot })), _ = +(e[Math.max(r - 1, 0)].wall === "top") * (1 - u) + +(e[r].wall === "top") * u;
  return { bugs: d, frame: l, target: { x: f.x + (m.x - f.x) * u, y: f.y + (m.y - f.y) * u, back: _ }, slush: v, camera: S };
}
function Bn(e) {
  const t = _e.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function G4(e, t, n, a) {
  const { limit: s, margin: o } = _e.bug_shot.back, [l, r] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((d, u) => {
    const f = Bn(u), m = ss(d, t, f.shot), y = Math.abs(m.y - n.y) / Math.tan(s * Math.PI / 180), v = m.x === i ? i - l >= r - i ? -1 : 1 : Math.sign(i - m.x), S = Math.abs(m.x - i) >= y ? i : m.x + v * y, _ = v > 0 ? Math.max(i, Math.min(S, r)) : Math.min(i, Math.max(S, l)), R = { from: i, to: _, begin: f.walk, end: f.aim };
    return i = _, R;
  });
}
function K4(e, t, n) {
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
const $e = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, ay = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function sy(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const oy = (e) => e.along * 97 % 1 < $e.camera, nn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * $e.gravity * t * t });
function ly(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * $e.gravity * (t.bottom - e.from.y))) / $e.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * $e.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / $e.gravity, on: "top" });
  const l = s.filter((d) => d.t >= 0).sort((d, u) => d.t - u.t)[0];
  let r = e.from;
  for (let d = 0; d < l.t; d += $e.step) {
    const u = Math.min(d + $e.step, l.t), f = nn(e, u), m = _r(r, f, n);
    if (m) return { ...m, t: d + (u - d) * m.share };
    r = f;
  }
  const i = nn(e, l.t);
  return { ...l, x: Math.min(Math.max(i.x, t.left), t.right), y: Math.min(Math.max(i.y, t.top), t.bottom) };
}
function ry(e, t, n, a = []) {
  const s = sy(e.along + 1), [o, l] = ay[e.wall], r = Math.atan2(l, o);
  return Array.from({ length: $e.count }, () => {
    const i = r + (s() - 0.5) * 2 * ($e.spread * Math.PI / 180), d = $e.speed[0] + s() * ($e.speed[1] - $e.speed[0]), u = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * d, vy: Math.sin(i) * d, r: $e.radius[0] + s() * ($e.radius[1] - $e.radius[0]) };
    return { ...u, ...ly(u, t, a) };
  });
}
function iy(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += $e.step) {
      const l = Math.min(o + $e.step, s), r = _r(nn(a, o), nn(a, l), n);
      if (r) {
        Object.assign(a, r, { t: o + (l - o) * r.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function cy(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...nn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - $e.hold) / $e.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((u) => u.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const r = l ? l.left + a.dx : a.x, i = l ? l.top + a.dy : a.y, d = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - i)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: r, y: i, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: d, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function Y4(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: r, fps: i } = _e.bug_shot;
  if (e < 0) return [];
  const d = (s[1] - s[0]) * r / i, u = (o[1] - o[0]) * r / i, f = Ee(e, [0, d]), m = Ee(e, [d, d + u]);
  return l.map((y) => {
    const v = { x: a.x + y.at[0] * t, y: a.y + y.at[1] * t };
    return {
      x: n.x + (v.x - n.x) * f,
      y: n.y + (v.y - n.y) * f,
      r: y.size * t * (0.15 + 0.85 * f * f),
      run: m * m * t * 1.2,
      fade: 1 - m,
      landed: f >= 1
    };
  });
}
function J4(e, t, n, a, s) {
  const { sway: o, above: l } = _e.chute, r = { x: t.x, y: t.y - l * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [d, u] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], f = (S) => {
    const [_, R] = [S.x - e.at.x, S.y - e.at.y];
    return { x: r.x + _ * d - R * u, y: r.y + _ * u + R * d };
  }, [m, y] = [...n].sort((S, _) => S.x - _.x), v = e.ends.map(f);
  return { left: r.x - e.at.x, top: r.y - e.at.y, middle: r, turn: i, lines: v.map((S, _) => ({ from: S, to: _ < v.length / 2 ? m : y })) };
}
const Z4 = (e, t) => Ee(t, e.grows) * (1 - Ee(t, e.sinks));
function zn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: tn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: tn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function X4(e, t) {
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
const Q4 = (e) => e === "pack_box";
function ex(e) {
  const { into: t, out: n } = zn(_e.rope_swing, e);
  return 1 - Ee(t, [0, 1]) * (1 - Ee(n, [0, 1]));
}
function tx(e) {
  const t = _e.rope_swing, { into: n, out: a } = zn(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Ee(n, [0, 1]) * (1 - Ee(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const uy = { after: 3 }, Os = 10, dy = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, fy = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, hy = { weight: 19 }, Er = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, my = { every: 120 }, Ar = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Cr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, py = {
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
}, dn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: Os }), ae = (e, t, n = {}) => dn(e, "clip", t, n), Sa = (e, t, n = {}) => dn(e, "look", t, n), Bo = (e, t, n = {}) => dn(e, "gaze", t, n), pe = (e, t, n = {}, a = {}) => ({ ...dn(e, "pick", t, n), ...a }), we = (e) => dn("nothing", "nothing", e, {}), gy = 120, vy = 300, _a = (e, t) => ({ ...ae(e, t), cooldown: vy }), re = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), yy = () => [ae("joy", 2)], vt = (e, t, n, a, s = {}) => ({ ...ae(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), yt = (e) => ({ ...e, cooldown: dy[e.name] }), Ht = (e) => ({ ...e, shenanigan: !0, lasts: fy[e.name] }), aa = [
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
  ...re("reported", { cooldown: 90 }, [Bo("read", 3), ae("nod", 1), we(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...re("read_message", { cooldown: 30 }, [Bo("read", 3), we(1)]),
  ...re("fact_filed", { cooldown: 120 }, [ae("file_card", 3), ae("nod", 1), we(6)]),
  ...re("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ae("nod", 2), we(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...re("bar_done", { holds: !0 }, yy()),
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
  ...Object.entries(py).flatMap(([e, t]) => re(`reacted:${e}`, {}, [Sa(t, 1)])),
  ...Object.entries(Ar).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => re(`agent_reacted:${n}`, {}, [ae(a, 1, { voices: [e] })])[0])),
  ...Object.entries(Cr).flatMap(([e, t]) => re(`agent_reacted:${e}`, {}, [ae(t, 1)])),
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
  ...re("held:search", { cooldown: gy }, [_a("search", 3), { ..._a("binoculars", 2), when: { home: !0 } }, { ..._a("glass_bubble", 2), when: { bubble: !0 } }]),
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
  ...re("unit", { cooldown: Er.build.cooldown }, [pe("unit", hy.weight), we(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...re("progress_jump", { cooldown: 6 }, [ae("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...re("perch", {}, [{ ...pe("hang", 1, { hands: !0, free: !0 }), cooldown: my.every }, pe("stand", 5)]),
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
], Or = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), Tr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), by = (e) => Array.isArray(e) ? e[0] : e, wy = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, ky = (e) => aa.some((t) => t.when.moment === e);
function xy(e) {
  var d;
  const t = e.has ?? (() => !0), n = (u) => e.now - (e.memory.get(u) ?? -1 / 0), a = (u) => !e.memory || Tr(u).every(([f, m]) => n(f) >= by(m)), s = (u) => !u.shenanigan || u.lasts <= (e.room ?? 0), o = aa.filter((u) => Or(u.when, e) && (u.type !== "clip" || t(u.name)) && a(u) && s(u)), r = (((d = e.tally) == null ? void 0 : d.plain) ?? 0) >= uy.after && o.some((u) => u.shenanigan) ? o.filter((u) => u.shenanigan) : o, i = r.filter((u) => {
    var f;
    return u.type === "nothing" || u.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return i.some((u) => u.type !== "nothing") ? i : r;
}
function ze(e, t) {
  const n = xy(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (Rr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Rr(e, t, n) {
  var a;
  for (const [s, o] of Tr(t)) (a = e.memory) == null || a.set(s, e.now + wy(o, n));
}
function nx(e, t, n) {
  Rr(e, aa.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const ax = (e) => Object.values(Er).find((t) => Or(t.when, e)) ?? null, $y = (e, t, n) => n - t <= (e.lifetime ?? Os), sx = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || Sr(e.clip, t));
class Ir {
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
}, ox = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Br = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), lx = {
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
}, rx = 120, My = 20, ix = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < My), Sy = (e) => os[e] || os.idle, cx = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Lr = "airborne", _y = "landing", Ey = "travelling", Nr = "grounded", ux = ({ airborne: e, landing: t, trip: n }) => e ? Lr : t ? _y : n != null && n.started ? Ey : Nr;
function dx(e, t) {
  var s;
  const n = Ay(e, t);
  return e.mode === Nr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function Ay(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: r, beat: i, state: d, doing: u, doingFacing: f = 0, readingFacing: m = null } = e;
  if (n === Lr && r.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? r.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...Cy(o, u, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (r.posture === "hang") return { clip: `hang_${r.grip}`, facing: r.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (r.view && d === "asking") return { clip: "point", facing: 0 };
  const y = m !== null && r.posture === "stand" && u !== "push";
  return ["asking", "waiting"].includes(d) && !["work", "push"].includes(u) ? { clip: "waiting", facing: y ? m : e.composeFacing ?? 0 } : { clip: t(u, r.posture) ? u : Sy(d), facing: y ? m : r.posture === "sit" ? r.face : f };
}
function Cy(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const ls = (e) => e.outcome, Oy = "plugin:code-commandments:sins:", Lo = (e) => e.type === "plugins.card" && e.markKey.startsWith(Oy), Ty = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => Lo(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => Lo(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], fx = (e, t) => e.filter((n) => n.author === "user" && Wn(n.read_at) > t).map((n) => ({ beat: "read_message", time: Wn(n.read_at), card: Xl(n) })).sort((n, a) => n.time - a.time), No = { user: "reacted", agent: "agent_reacted" };
function hx(e, t) {
  return e.filter((n) => No[n.author] && St(n) > t).map((n) => ({ beat: `${No[n.author]}:${n.emoji}`, time: St(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const Ry = [.../* @__PURE__ */ new Set([...Object.values(Ar).flatMap((e) => Object.keys(e)), ...Object.keys(Cr)])];
function mx(e, t) {
  return e.filter((n) => n.author === "agent" && St(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = Ry.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: St(n), card: Xl(n) })).sort((n, a) => n.time - a.time);
}
const Iy = (e) => new Ir(e).isTest(), Vn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[ls(e)] || "";
}, By = 1800, Ly = (e, t) => {
  if (Vn(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && Vn(n) !== "finished" && Number(e.time) - Number(n.time) <= By ? "tests_fixed" : "tests_passed";
};
function px(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(Iy), s = a.filter((r) => Vn(r)), o = s.filter((r) => t.get(r.key) === "" || !t.has(r.key) && Number(r.time) > n);
  return a.forEach((r) => t.set(r.key, Vn(r))), o.map((r) => ({ beat: Ly(r, s), time: Number(r.time), card: r.key }));
}
function gx(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(ls(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: ls(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const vx = (e) => e.map((t) => {
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
function yx(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function bx(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function wx(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((r) => r.time > t).map((r) => {
    var i;
    return { beat: (i = Ty.find((d) => d.matches(r))) == null ? void 0 : i.beat, time: r.time, card: r.key };
  }).filter((r) => r.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((r, i) => r.time - i.time);
}
function Ts(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const Do = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function Ny(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const r = (s + o) / 2;
    Ts(e, t, r, a).pitch > n ? s = r : o = r;
  }
  return (s + o) / 2;
}
function kx(e, t, n, a = {}) {
  const s = ze({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : ky(`held:${e}`) ? "idle" : e;
}
const Te = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function xx(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Te.ahead * n ? 180 : Math.sign(a) * Te.turn;
}
const jo = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function $x(e, t) {
  const n = Math.min(Te.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Te.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Te.lines, Math.floor((e.bottom - e.top - 2 * a) / Te.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Te.sweep) % s, r = o % Te.sweep, i = Te.sweep - Te.returnSeconds, d = jo((r - i) / Te.returnSeconds), u = r <= i ? jo(r / i) : 1 - d, f = l + ((l + 1) % s - l) * d;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * u, y: e.top + a + f * Te.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Po = 3, Dr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, qo = 12, Mx = (e, t) => ({ mood: e, began: t, seen: 0 });
function Sx(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!Dr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= Po ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * qo) / qo, lasts: Po } };
}
const _x = (e) => e.posture === "hang" && !Dr(e.face), Dy = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), jy = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function Ex(e, t, n) {
  return Dy.has(e) ? 1 / 0 : !jy.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(jr(n - t.began, t.share) - et.lead, 0);
}
const Py = 5;
function Ax(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= Py ? { beat: "long_walk", time: n } : null };
}
const qy = 30, En = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function Cx(e, t, n, a, s = null) {
  if (t && n < t.until || !En.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = ze({ moment: "spell", state: e, tally: s }, a), [l, r] = En.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (r - l), next: n + En.every } : { state: e, began: 0, until: 0, next: n + En.every };
}
const Ox = (e, t, n) => t && n < t.until && Br.has(e.state) ? { state: t.state, since: t.began } : e, et = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, jr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function Tx(e, t, n, a) {
  var r;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = jr(o, e.share);
  return s ? { eager: Fy(t, l), moment: null } : l > et.lead ? { eager: t, moment: null } : l < et.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > et.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < et.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((r = ze({ moment: "eager", slow: !0 }, n)) == null ? void 0 : r.name) === "eager" }, moment: null };
}
function Fy(e, t) {
  return e.on && t > et.lead + et.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= et.lead && t >= et.least ? { ...e, on: !0, calm: !1 } : e;
}
const Wy = 1, Hy = { look: "look", gaze: "gaze" };
function Uy(e, t, n, a, s = "", o = () => !0, l = null) {
  const r = ze({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return r ? { [Hy[r.type] ?? "clip"]: r.name, toward: r.toward ?? "", onto: !!r.onto, holds: !!r.holds, lifetime: r.lifetime } : null;
}
const zy = (e, t, n, a, s, o = "", l = () => !0, r = null, i = "") => ze({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: r, ball: i }, s), Vy = (e, t, n, a, s, o = 0) => ze({ moment: "jump", high: e > Wy * t, memory: a, now: s, room: o }, n).name === "backflip", Gy = { work: ["building"], idle: ["standing"] };
function Rx(e, t, n, a) {
  const s = os[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(Gy[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), Br.has(e) ? { moments: o, began: n || a } : (n && a - n >= qy && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function Ky(e, t, n) {
  return !ze({ moment: "pondering", memory: e, now: t }, n) || !ze({ moment: "thought_cloud", memory: e, now: t }, n) ? null : ze({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Fo = { pondering: Ky };
function Ix(e, t, n, a, s, o) {
  if (Fo[e.beat]) {
    const r = Fo[e.beat](n.reacted, a, s);
    return r && o(r) ? { beat: { clip: r, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = Uy(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== Os && { lifetime: l.lifetime } } } : null;
}
function Bx(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = zy(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return i && { clip: i.name, card: "", flies: !!i.flies };
}
const Lx = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function Nx(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function Dx(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const jx = (e, t) => !!(e != null && e.watches) && !t.once, Px = 10, qx = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || $y(a, a.queuedAt, n)), Fx = (e, t) => t ? null : e[0] ?? null;
function Wx(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const Hx = (e, t) => !t.during || !e.some((n) => n.during === t.during), Yy = 2 * Math.PI, Jy = 500;
function Ux(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), r = l / Jy, i = t && e.point && !!t.behind != !!e.point.behind, d = i && e.amount > 0, u = t && !d ? o : 0, f = e.amount < u ? Math.min(e.amount + r, u) : Math.max(e.amount - r, u), m = Yy * l / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, S = (d ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !i ? s && !t.behind && !y.behind ? Xy(y, t, n, m, s) : eb(y, t, n, m) : t) ?? y, _ = S != null && S.behind && S.mood === "reading" ? Zy(e.point, S, n, l, s) : S;
  return { point: _ ?? null, toward: _ ? { x: _.x - n.x, y: _.y - n.y } : null, amount: f, at: a };
}
function Zy(e, t, n, a, s) {
  const o = (x) => x * 180 / Math.PI, l = (x) => o(Math.atan2(Math.sin(x * Math.PI / 180), Math.cos(x * Math.PI / 180))), r = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, d = l(o(Math.atan2(t.x - n.x, -i)) - r), u = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - r), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), m = f ? l(e.readingFacing - r) : 0, y = f ? e.readingYaw + m : u, v = y + l(d - y), S = Math.min(Math.max(a / 1e3, 0), 0.1), _ = Te.turnSpeed * S, R = f ? y + Math.min(Math.max(v - y, -_), _) : v, F = f ? e.readingFollow + m : R, J = F + (R - F) * (1 - Math.exp(-S / Te.followSeconds)), j = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, L = o(Ts(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), q = Math.min(Math.max(L, -j.up), j.down), w = Te.tipSpeed * S, b = f ? e.readingPitch + Math.min(Math.max(q - e.readingPitch, -w), w) : q;
  return { ...t, readingYaw: R, readingFollow: J, readingPitch: b, readingFacing: r };
}
function Xy(e, t, n, a, { depth: s, above: o, tip: l }) {
  const r = (F) => {
    const { yaw: J, pitch: j } = Ts(F.x - n.x, s, n.y - F.y, o);
    return { yaw: J, pitch: Math.min(Math.max(j, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [i, d] = [Do(r(e)), Do(r(t))], u = Math.acos(Math.min(Math.max(i[0] * d[0] + i[1] * d[1] + i[2] * d[2], -1), 1));
  if (u <= a) return { ...t };
  const f = a / u, [m, y] = [Math.sin((1 - f) * u) / Math.sin(u), Math.sin(f * u) / Math.sin(u)], [v, S, _] = i.map((F, J) => m * F + y * d[J]), R = s * v / S;
  return { ...t, x: n.x + R, y: n.y - Ny(R, s, -Math.asin(Math.min(Math.max(_, -1), 1)), o) };
}
const Qy = 0.15;
function zx(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= Qy;
}
function eb(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), r = s + Math.max(-a, Math.min(a, l)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(r), y: n.y + i * Math.sin(r) };
}
const tb = (e) => !(e != null && e.on);
function Vx(e, t, n) {
  if (tb(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((r) => r.beat === s.beat && r.card === s.card) === o);
  return { answer: [], held: a };
}
const an = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Ze = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Ea = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Wo = (e) => e * e * (3 - 2 * e);
function nb(e) {
  if (e < 0 || e >= Ze.seconds) return null;
  const t = Ea(e, ...Ze.flicker), n = Math.floor(t * Ze.flickers * 2) % 2 === 0, a = e < Ze.flicker[1] ? n ? 0.35 + 0.5 * t : Ze.dim : 1;
  return { strength: 1 - Wo(Ea(e, ...Ze.fade)), lit: a, white: e < Ze.flash[0] ? 0 : 1 - Wo(Ea(e, ...Ze.flash)) };
}
const Gx = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function Kx(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = nb(t - e.at);
  return a && { colour: an.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Ze.signs[e.tone], ...a } };
}
function Yx(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function Jx(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= an.looks || a === null && n - e.since >= an.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function Zx(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (r) => (r + a * 12) % 12, o = (r) => 0.5 - 0.5 * Math.max(-1, Math.min(s(r) - 3, 9 - s(r), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const rt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, Xx = { behind: 39, figure: 40, ahead: 41 }, ab = "[data-figure-pile]", sb = { amber: [1, 0.69, 0.125], good: an.colours.good, bad: an.colours.bad }, Ln = { phases: 4, ms: 230, dim: 0.25 }, Qx = (e, t, n) => e !== "amber" || (t + n) % Ln.phases < Ln.phases / 2 ? 1 : Ln.dim, e$ = (e) => e === "amber" ? Ln.phases : 1;
function t$(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const n$ = Object.keys(sb), Ve = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Vt = ([e, t], n) => e + n() * (t - e);
function a$(e) {
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
function s$(e) {
  const t = Math.floor(e / Aa.high);
  return { left: -(rt.inside + rt.width / 2 + t * (rt.width + Aa.gap)), up: e % Aa.high * (rt.height - rt.top) };
}
const ob = (e, t, n) => ze({ moment: "unit", memory: e, now: t }, n) !== null, lb = { after: 5 }, rb = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Ir(t).isBuild());
function o$(e, t, n) {
  const a = rb(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= lb.after ? s : null;
}
function l$(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: ob(n, a, s) } : null;
}
const Ho = { ahead: 140, up: 70 };
function r$(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Ho.ahead, y: a - Ho.up } } : o ? { at: { x: n(o), y: a - o.up - rt.height } } : t ? { at: null } : null;
}
const Ca = { least: 4e3, most: 1e4 }, ib = (e) => Ca.least + e() * (Ca.most - Ca.least), bt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function i$(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = ib(t);
    if (n.length >= bt.most || t() >= bt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (bt.at[0] + t() * (bt.at[1] - bt.at[0]));
    n.push({ from: o, to: o + bt.ms }), a = o + bt.ms;
  }
}
const c$ = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), u$ = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Pr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), d$ = new Set(aa.filter((e) => Pr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), cb = (e) => e.some((t) => t.state === "built"), f$ = (e, t) => cb(t) ? e.filter((n) => !Pr.has(n.beat)) : e, ut = { reach: 40, room: 6 }, ub = (e, t) => t <= e - ut.reach + 2, h$ = (e, t, n) => ub(e, n) ? t - ut.reach : e - ut.reach - ut.room, m$ = (e, t, n, a) => a > 0 && t < e && t + ut.reach >= e - 2 ? Math.min(n, Math.max(e, t + ut.reach)) : e, Oa = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, p$ = (e) => Vt(e() < Oa.longShare ? Oa.long : Oa.short, e), db = 2 * rt.width;
function g$(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= db ? o : e + (o - e + s / 2) % s;
}
const fb = 60, v$ = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= fb, Uo = "[data-figure-home]", fn = () => {
  var t;
  const e = document.querySelector(Uo);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Uo)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, hb = "[data-figure-docked-bars]", mb = "[data-figure-chat-foot]", pb = [0.85, 0.6, 0.35, 0.15], gb = ["question", "waiting", "suggestion"], y$ = (e, t) => gb.find((n) => e[n] > 0 && t[n] === "behind") || null;
function b$() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const vb = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", yb = "[data-figure-newest]";
function qr() {
  var a, s;
  const e = (a = fn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(yb), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, r;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Rs(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function sn(e, t, n = qr()) {
  if (!e || !n) return !0;
  const a = at(e, t), s = oa(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Ce.top * t.size, bottom: a.top + Ce.bottom * t.size }, l = xt.gap;
  return !sa(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function w$(e, t, n, a = qr()) {
  if (!a || sn(t, e, a)) return null;
  const s = oa(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, r = At(), i = t.posture === "stand" ? Bs * e.size : Kr * e.size, d = Math.max(n.left + i, r.left + o), u = Math.min(n.right - i, r.right - l);
  return [a.left - xt.gap - l, a.right + xt.gap + o].map((m) => ({ ...t, x: m })).filter((m) => m.x >= d && m.x <= u && sn(m, e, a) && Gb(m, e)).sort((m, y) => Math.abs(m.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const Ta = 0.26, Fr = 0.54, bb = 1.25 / 5.4, hn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Ta, travels: "stand" },
  lounge: { drop: Ta, travels: "stand" },
  composed: { drop: Ta, travels: "stand" },
  hang: { drop: Fr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, k$ = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * bb * Math.cos(t * Math.PI / 180),
  y: 1 - n - Fr
}), Yt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), wb = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), x$ = (e, t) => (e === "sit" ? wb.has(t) : Yt.has(e)) ? e : "stand";
function $$(e, t) {
  return e.facing === t.facing || !Yt.has(e.posture) && !Yt.has(t.posture) ? t : { posture: "stand", facing: Yt.has(e.posture) ? e.facing : t.facing };
}
const M$ = 0.25, S$ = (e, t) => Yt.has(e) && hn[t].drop === 0, Wr = 2, kb = 90, xb = 180, $b = 140, Mb = 280, Sb = 420, _b = 0.25, Eb = 290, Ab = 600, Cb = "cubic-bezier(0.2, 0.7, 0.4, 1)", Ob = "cubic-bezier(0.55, 0, 0.9, 0.6)", Ra = 5;
function Gn(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: r = !1, random: i = Math.random, memory: d = null, now: u = 0, room: f = 0, pogo: m = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Ra) return null;
  (l || r) && (o = Math.max(o, Wr));
  const y = o > 1, v = Math.abs(t.x - e.x), S = v < Ra ? 0 : v / (kb * o) * 1e3, _ = Math.min(S, y ? $b : xb), R = Math.abs(t.y - e.y), F = t.y < e.y, J = F && !m && Vy(R, n, i, d, u, f), j = F ? Sb + Math.min(R, 400) * _b : Math.sqrt(2 * R / Cs) * 1e3, L = {
    x: t.x,
    y: t.y,
    ms: R > Ra ? J ? Ab : j : 0,
    lead: J ? Eb : F ? Mb : 0,
    easing: F ? Cb : Ob,
    hopping: !0,
    clip: J ? "backflip" : F ? "jump" : "fall"
  }, q = { x: t.x, y: t.y, ms: S + _, lead: 0, easing: "linear", ramp: _, ...y ? { clip: "run" } : {} }, w = m ? Tb(t, n) : L, b = F && !a ? [{ ...q, y: e.y }, w] : [{ ...L, x: e.x }, q];
  return { way: Math.sign(t.x - e.x) || 1, legs: b, lands: !s, pace: o, running: y };
}
const Tb = (e, t) => ({ x: e.x, y: e.y, ms: _e.pogo.frames / _e.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), Rb = (e, t) => e.postures.includes(t) ? t : e.postures[0], _$ = (e, t, n) => e.posture === "walk" && n ? "walk" : Rb(e.clip, t), at = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - hn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, sa = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Rs = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function At() {
  var t;
  const e = (t = fn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const An = 0.5, zo = 20;
function E$(e, t, n = At()) {
  const a = at(e, t);
  return a.left >= n.left + zo && a.right <= n.right - zo;
}
function Is(e, t, n = At()) {
  const a = at(e, t), s = a.right - a.left, o = oa(e), [l, r] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - An && r <= n.right + An && a.top >= n.top - An && i <= n.bottom + An;
}
const Kn = [0.35, 0.5, 0.65], Yn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ce = { left: Kn[0], right: Kn.at(-1), top: Yn[0], bottom: Yn.at(-1) }, Ib = 0.24;
function oa(e) {
  if (e.posture === "stand") return { left: Ce.left, right: Ce.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Ib * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ce.left, t), right: Math.max(Ce.right, t) };
}
function Bb(e, { size: t }, n = At()) {
  const a = oa(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const Bs = (Ce.right - Ce.left) / 2 + 0.08;
function A$(e, t) {
  return e === "hang" ? Ce : { ...Ce, bottom: Math.min(Ce.bottom, 1 - t - hn[e].drop) };
}
const Lb = "[data-figure-agent]";
function Hr(e, t, n = "", a = "") {
  var r;
  const s = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !Rs(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const i of [l - 1, l].filter((d) => d >= 0)) {
    if (!o.data[i].trim()) continue;
    const d = document.createRange();
    if (d.setStart(o, i), d.setEnd(o, i + 1), [...d.getClientRects()].some((u) => e >= u.left && e <= u.right && t >= u.top && t <= u.bottom)) return !0;
  }
  return !1;
}
const Ur = (e) => Yn.flatMap(
  (t) => Kn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Ls(e, t, n = "") {
  if (!sn(e, t)) return Kn.length * Yn.length;
  const a = at(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(vb)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: i }) => i.width && i.height && sa(s, i) && Rs(r)).map(({ rect: r }) => r), l = (r, i) => o.some((d) => r >= d.left && r <= d.right && i >= d.top && i <= d.bottom);
  return Ur(s).filter(([r, i]) => l(r, i) || Hr(r, i, n)).length;
}
function Nb(e, t) {
  const n = at(e, t);
  return Ur({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Hr(a, s, "", Lb)).length;
}
const Vo = 4;
function C$(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Vo; o <= s; o += Vo)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const r = { ...t, x: l };
      if (!Nb(r, e) && sn(r, e)) return r;
    }
  return null;
}
function on(e, t, n) {
  const a = At(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => Is(l, t, a) && sn(l, t)).map((l) => ({ spot: l, covered: Ls(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, r) => r.covered < l.covered || r.covered === l.covered && r.away < l.away ? r : l
  ).spot : null;
}
const zr = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), Db = [0.5, 0.25, 0.75], jb = (e) => zr(e.getBoundingClientRect(), Db), Vr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, Pb = Bs, qb = (e, t, { size: n }, a = Pb) => Gr(e, Vr[t], a * n, "stand");
function Gr(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const Fb = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Kr = 0.1, Wb = (e, t, { size: n }) => Gr(e, Fb[t], Kr * n, "sit"), Hb = (e) => ((e + 180) % 360 + 360) % 360 - 180, Ia = 60;
function O$(e, t) {
  const n = Hb(t);
  return !e.aside || Math.abs(n) >= Ia ? t : n < 0 ? 360 - Ia : Ia;
}
const Jt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, Ub = (e) => [.../* @__PURE__ */ new Set([e, ...Jt.turns.map((t) => (t + 360) % 360)])];
function T$(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = Ub(t), l = Jt.every[0] + a() * (Jt.every[1] - Jt.every[0]);
  return { face: t, from: s ? zb(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function zb(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Jt.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function R$(e, t) {
  const { element: n, edge: a } = la(), s = ["left", "right"].map((r) => mn(Wb(a, r, e), e)).filter((r) => n && Is(r, e) && !Ls(r, e)), o = (r) => t ? Math.abs(r.x - t.x) : 0, l = s.sort((r, i) => o(r) - o(i))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function I$(e, t, { size: n }) {
  const a = (Ce.right - Ce.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Yr } : e;
}
const Yr = 7;
function Jr() {
  const e = [...document.querySelectorAll(ab)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function Vb(e, t) {
  const n = at(e, t), a = n.right - n.left;
  return { left: n.left + Ce.left * a, right: n.left + Ce.right * a, top: n.top + Ce.top * a, bottom: n.bottom };
}
function Gb(e, t) {
  const n = Jr();
  return !n || !sa(Vb(e, t), n);
}
const Kb = 4;
function la() {
  const e = pn(), t = Jr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > Kb || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Yr - n, 0) } };
}
const B$ = ({ size: e, below: t }) => (1 - t) * e;
function mn(e, t) {
  const n = At(), { size: a, below: s } = t, o = hn[e.posture].drop * a;
  return { ...Bb(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const rs = (e, t) => Object.keys(Vr).map((n) => mn(qb(e, n, t), t)), Ns = (e, t) => zr(e, pb).map((n) => mn(n, t)), Zr = (e, t, n) => on(e, t, n) ?? e[0];
function L$(e, t) {
  const { element: n, edge: a } = la();
  return { ...Zr(rs(a, e), e, t), view: null, on: n };
}
function N$(e, t, n, a) {
  const { element: s, edge: o } = la(), l = (a ? rs(o, t) : [...rs(o, t), ...Ns(o, t)]).filter(
    (d) => !sa(at(d, t), e)
  ), r = on(
    l.filter((d) => d.x > (e.left + e.right) / 2),
    t,
    n
  ), i = r && !Ls(r, t) ? r : on(l, t, n);
  return i && { ...i, view: null, on: s };
}
function pn() {
  var a;
  const e = fn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(hb);
  if (!t) return { ...ra(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Go = { within: 2 };
function D$(e) {
  const { element: t, docked: n, edge: a } = pn();
  if (!n || e.on !== t) return !0;
  const s = ra().edge;
  return a.left > s.left + Go.within || a.left + a.width < s.left + s.width - Go.within;
}
const Yb = "[data-figure-closing]";
function j$() {
  var n;
  const { element: e, docked: t } = pn();
  return t && !!((n = e.firstElementChild) != null && n.matches(Yb));
}
const Xr = "[data-figure-progress]";
function P$(e) {
  const t = e.querySelector(Xr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function q$(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const Jb = { across: 300, above: 380, below: 60 };
function F$(e) {
  const { across: t, above: n, below: a } = Jb;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: Zb(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const Zb = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Qr = "[data-figure-bar]", is = { back: 144, along: 0.4 };
function W$(e) {
  const { element: t, docked: n, edge: a } = pn(), s = n ? t.querySelector(Qr) : null;
  if (!(s != null && s.querySelector(Xr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...mn({ x: o - is.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function H$(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < is.along * a.size ? t.x + is.along * a.size : e.x, y: e.y, behind: !0 };
}
function U$(e) {
  const t = e.querySelector(Qr), n = t == null ? void 0 : t.firstElementChild;
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
function z$(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: r } = ra(), i = n === null ? Xb(r, e, o === null ? t : { x: o, y: r.top }, a, s) : mn({ x: n, y: r.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: l, stays: !0 };
}
function Xb(e, t, n, a, s) {
  const o = Ns(e, t), l = Math.min(...o.map((i) => i.x)), r = o.filter((i) => i.x + a + rt.width < s && i.x + a - ut.reach - ut.room >= l);
  return on(r.length ? r : o, t, n);
}
const Qb = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function V$(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: r = Math.random, via: i = [], memory: d = null, now: u = 0, room: f = 0, pogo: m = !1 } = {}) {
  (o || l) && (s = Math.max(s, Wr));
  const y = (J) => {
    const j = at(J, n, hn[J.posture].travels);
    return { x: j.left, y: j.top };
  }, v = t.ladder ?? e.ladder;
  if (v && !(t.ladder && e.ladder)) return ew(y(e), y(t), y({ ...v.foot, posture: "stand" }), v.way, !!t.ladder, n, s);
  const [S, ..._] = [e, ...i, t].map(y), R = Gn(S, _[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: r, memory: d, now: u, room: f, pogo: m }), F = _.slice(1).map((J, j) => {
    var L;
    return (L = Gn(_[j], J, n.size, { random: r, memory: d, now: u, room: f })) == null ? void 0 : L.legs.find((q) => q.hopping);
  });
  return R && { ...R, legs: [...R.legs, ...F.filter(Boolean)] };
}
function ew(e, t, n, a, s, o, l) {
  const r = (u, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - u.x, f.y - u.y) / Qb.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? Gn(e, n, o.size, { pace: l }) : Gn(n, t, o.size, { pace: l }), d = s ? [...(i == null ? void 0 : i.legs) ?? [], r(n, t)] : [r(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: d, lands: !1, pace: l, running: l > 1 };
}
function G$(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function K$(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && on(jb(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = la();
  return { ...Zr(Ns(s, t), t, n), view: null, on: a };
}
const tw = "[data-figure-bubble]", nw = 250;
let Zt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), ei = 0;
const Ft = () => Zt, Ba = /* @__PURE__ */ new WeakMap();
let aw = 0;
function Ds(e) {
  return Ba.has(e) || Ba.set(e, `floor-${++aw}`), Ba.get(e);
}
const sw = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, ow = () => {
  var e, t;
  return ((t = (e = fn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function lw(e, t) {
  var a;
  const n = (a = e.querySelector(mb)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function rw(e, t) {
  const n = e && lw(e, t), a = e ? [...e.querySelectorAll(tw)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || sw(l, n))).map(({ element: o, type: l, box: r }) => ({ id: Ds(o), type: l, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const iw = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= nw ? (t.top - a.top) / s * 1e3 : 0;
};
function ti(e = Zt, t = performance.now()) {
  const n = At(), a = ow(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: r } = pn(), i = [];
  o && i.push({ id: "home", type: l ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const d = ra();
  return d.element && i.push({ id: Ds(d.element), type: "build", element: d.element, left: d.edge.left, right: d.edge.left + d.edge.width, top: d.edge.top }), i.push(...rw(a, s)), i.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((u) => Object.freeze({ ...u, vy: iw(e, u, t) }))) });
}
const cs = /* @__PURE__ */ new Set();
function cw(e) {
  return cs.add(e), () => cs.delete(e);
}
function uw() {
  ni();
  const e = () => {
    ei = requestAnimationFrame(e), !document.hidden && (Zt = ti(Zt), cs.forEach((t) => t(Zt)));
  };
  e();
}
function ni() {
  cancelAnimationFrame(ei);
}
const js = 5, dw = 56, fw = { share: 0.6 }, hw = (e) => -Math.sqrt(2 * Cs * fw.share * e), Dt = (e, t) => e.find((n) => n.id === t) ?? null;
function Y$(e, t = ti().floors) {
  const n = Dt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : Ds(e.on) : null, o = s && Dt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function ai({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, r, i = Ft().floors) {
  const d = Dt(i, e);
  if (!d) return null;
  const u = { x: d.left + t, y: d.top + n, posture: a, face: s };
  return (l || mw(d, u, o)) && pw(u, r, i) ? { x: u.x, y: u.y } : null;
}
const Ps = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, mw = (e, t, n) => !Ps({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function J$(e, t = Ft().floors) {
  if (!Ps(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= js && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function pw(e, t, n = Ft().floors) {
  const a = Dt(n, "home");
  return e.posture === "hang" && a && at(e, t).bottom >= a.top ? !1 : Is(e, t);
}
function Z$(e, t, n, a = Ft().floors) {
  const s = ai(e, n, a);
  if (!e.home) return gw(e, t, s, a);
  if (!s) return null;
  const o = Dt(a, "home"), l = s.y - t.y, r = l > js ? "dropping" : -l > dw ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: r };
}
function gw(e, t, n, a) {
  const s = n ? Dt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: hw(e.risen) };
  if (!n) return null;
  if (Ps(t) && n.y - t.y > js) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function X$(e, t, n) {
  const a = Bs * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function Q$(e, t, n, a = Ft().floors) {
  const s = t && ai(t, n, a);
  return s ? { ...e, ...s } : e;
}
const vw = ["data-type"], yw = { class: "figure-floor-name" }, bw = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ge({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      g("span", yw, $(e.floor.type), 1)
    ], 12, vw));
  }
}, ww = /* @__PURE__ */ Y(bw, [["__scopeId", "data-v-4e0f1e2e"]]), kw = {
  class: "figure-floors",
  "aria-hidden": "true"
}, xw = {
  __name: "FigureFloors",
  setup(e) {
    const t = Ke(Ft().floors);
    let n = () => {
    };
    return Re(() => {
      n = cw((a) => t.value = a.floors), uw();
    }), Be(() => {
      n(), ni();
    }), (a, s) => (c(), h("div", kw, [
      (c(!0), h(z, null, te(t.value, (o) => (c(), H(ww, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, e8 = /* @__PURE__ */ Y(xw, [["__scopeId", "data-v-e519168b"]]), La = (e) => typeof e == "number" ? e : Date.parse(e);
function t8(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: La(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => La(s.row.created_at) - La(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const $w = 3, Na = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function Mw(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Na[n.grouping]) == null ? void 0 : a.call(Na, e.row, n)) || "";
}
function Sw(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function n8(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= $w ? [Sw(a, t)] : a), a = [];
  };
  for (const l of e) {
    const r = Mw(l, t);
    r !== s && o(), s = r, r ? a.push(l) : n.push(l);
  }
  return o(), n;
}
const _w = 1e3;
function Ew() {
  const e = I(Date.now()), t = setInterval(() => e.value = Date.now(), _w);
  return ft(() => clearInterval(t)), e;
}
const Aw = ["datetime", "title"], ia = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Ew(), a = T(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, $(P(ir)(e.at, P(n))), 9, Aw));
  }
};
function a8(e) {
  const t = We(), n = t.option("row"), a = I(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), fe(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function Cw(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const s8 = (e) => (t) => t.filter((n) => n.id !== e), o8 = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), l8 = (e) => (t) => [...t, e], r8 = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function i8(e, t = {}) {
  const n = We(), a = I(null), s = I("");
  async function o(...l) {
    const r = await n.read(e(...l), t);
    s.value = r.ok ? "" : r.error, r.ok && (a.value = r.value);
  }
  return { value: a, failure: s, load: o };
}
function c8(e) {
  const t = We(), n = I("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Cn = /* @__PURE__ */ new Map();
function Ow(e, t) {
  if (Cn.has(e)) return Cn.get(e);
  const n = t().finally(() => Cn.delete(e));
  return Cn.set(e, n), n;
}
function u8() {
  const e = We(), t = I(null), n = I("");
  async function a() {
    const s = await Ow(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const Tw = { class: "cards-page" }, Rw = { class: "cards-bar" }, Iw = { class: "cards-count" }, Bw = { class: "cards" }, Lw = {
  key: 1,
  class: "cards-note"
}, Nw = {
  key: 2,
  class: "cards-note"
}, Dw = ["data-row", "onClick"], jw = { class: "card-head" }, Pw = { class: "card-title" }, qw = { class: "card-foot" }, Fw = {
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
    return (a, s) => (c(), h("div", Tw, [
      g("div", Rw, [
        g("span", Iw, $(e.rows.length) + " " + $(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        B(de, Le({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: D(() => [
            B(ye, {
              name: "plus",
              size: 12
            }),
            ee(" New " + $(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      g("div", Bw, [
        e.loaded ? e.failure ? (c(), h("p", Lw, $(e.failure), 1)) : e.rows.length ? C("", !0) : (c(), h("p", Nw, "No " + $(e.noun) + "s yet", 1)) : (c(), H(_t, {
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
          g("span", jw, [
            B(ye, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            ee(" " + $(e.head(o)), 1),
            B(ia, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          g("span", Pw, $(e.title(o)), 1),
          g("span", qw, $(e.foot(o)), 1)
        ], 8, Dw))), 128))
      ]),
      ue(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, d8 = /* @__PURE__ */ Y(Fw, [["__scopeId", "data-v-990e6b37"]]), Ko = "newest";
function f8(e, { title: t, isOpen: n = null }) {
  var d;
  const a = (d = Oe(Ne, null)) == null ? void 0 : d.search, s = I(""), o = I(Ko), l = I("all"), r = T(() => {
    const u = s.value.trim().toLowerCase(), f = e.value.filter((m) => Cw(m, u, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(m) === (l.value === "open")));
    return o.value === Ko ? f : [...f].sort((m, y) => t(m).localeCompare(t(y)));
  }), i = T(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: r, filtering: i, hasStates: !!n };
}
const Ww = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, Hw = 40, Uw = "top", zw = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, a = (f = Oe(Ne, null)) == null ? void 0 : f.autoScroll, s = T(() => a === Uw), o = I(null), l = I(!1), r = (m) => s.value ? m.scrollTop : m.scrollHeight - m.scrollTop - m.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, d = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function u() {
      l.value = r(o.value) >= Hw;
    }
    return fe(() => n.rowCount, async () => {
      await mt(), !l.value && o.value && (o.value.scrollTop = i());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (m, y) => (c(), h("div", Ww, [
      g("div", {
        ref_key: "pane",
        ref: o,
        class: Z(["auto-scroll-pane", e.paneClass]),
        onScroll: u
      }, [
        ue(m.$slots, "default", {}, void 0, !0)
      ], 34),
      B(jt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: D(() => [
          Ye(g("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: d
          }, [
            B(ye, {
              name: s.value ? "up" : "down"
            }, null, 8, ["name"]),
            y[0] || (y[0] = ee(" Newest ", -1))
          ], 512), [
            [sl, l.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, h8 = /* @__PURE__ */ Y(zw, [["__scopeId", "data-v-3accb764"]]), Vw = ["aria-selected", "data-tab", "onClick"], Gw = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, Kw = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Oe(Ne, null), o = T(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = I(null), r = I({ left: 0, width: 0, slides: !1 }), i = (m) => n.answer[m.count_field] !== void 0;
    function d(m) {
      var v;
      const y = (v = l.value) == null ? void 0 : v.querySelector(".inner-tab.on");
      if (!y) return void (r.value = { left: 0, width: 0, slides: !1 });
      r.value = { left: y.offsetLeft, width: y.offsetWidth, slides: m }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, y.offsetLeft - 12));
    }
    const u = () => mt(() => d(!0));
    let f = null;
    return Re(() => {
      var m;
      d(!1), f = new ResizeObserver(() => d(!1)), f.observe(l.value), (m = document.fonts) == null || m.ready.then(() => d(!1));
    }), Be(() => f == null ? void 0 : f.disconnect()), fe(() => {
      var m;
      return (m = n.active) == null ? void 0 : m.key;
    }, u), fe(() => n.answer, u, { deep: !0 }), (m, y) => (c(), h("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (c(!0), h(z, null, te(o.value, (v) => {
        var S, _;
        return c(), h("button", {
          key: v.key,
          type: "button",
          role: "tab",
          class: Z(["inner-tab", { on: ((S = e.active) == null ? void 0 : S.key) === v.key }]),
          "aria-selected": ((_ = e.active) == null ? void 0 : _.key) === v.key,
          "data-tab": v.key,
          onClick: (R) => a("choose", v)
        }, [
          ee($(v.label) + " ", 1),
          i(v) ? (c(), h("span", Gw, $(e.answer[v.count_field]), 1)) : C("", !0)
        ], 10, Vw);
      }), 128)),
      g("i", {
        class: Z(["inner-tabs-line", { slides: r.value.slides }]),
        style: ge({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, m8 = /* @__PURE__ */ Y(Kw, [["__scopeId", "data-v-63fcd326"]]), Yw = {
  class: "tab-body",
  "data-tab-body": ""
}, Jw = { "data-tab-content": "" }, Zw = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = I(!1);
    let a = 0;
    return fe(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, ps(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (c(), h("div", Yw, [
      n.value ? (c(), H(_t, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : C("", !0),
      Ye(g("div", Jw, [
        ue(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [sl, !n.value]
      ])
    ]));
  }
}, p8 = /* @__PURE__ */ Y(Zw, [["__scopeId", "data-v-63876533"]]), Xw = {}, Qw = { class: "menu-label" };
function ek(e, t) {
  return c(), h("span", Qw, [
    ue(e.$slots, "default", {}, void 0, !0)
  ]);
}
const us = /* @__PURE__ */ Y(Xw, [["render", ek], ["__scopeId", "data-v-aa955b3e"]]), tk = {
  class: "search-bar",
  "data-search-bar": ""
}, nk = { class: "search-bar-control" }, ak = ["value", "placeholder", "aria-label"], sk = ["aria-expanded"], ok = {
  key: 0,
  "data-menu-count": ""
}, lk = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var R;
    const a = e, s = n, o = vi(), l = ((R = Oe(Ne, null)) == null ? void 0 : R.search) ?? {}, r = T(() => l.placeholder || a.placeholder), i = l.context ?? [], d = I(null), u = I(null), f = I([]), m = T(() => f.value.length ? f.value[f.value.length - 1].next : i), y = T(() => !!o.menu || i.length > 0), v = (F) => {
      f.value = [], u.value = u.value ? null : F.currentTarget;
    };
    function S(F) {
      if (F.next.length) {
        f.value = [...f.value, F];
        return;
      }
      u.value = null, s("pick", F.click);
    }
    function _() {
      var F;
      s("update:modelValue", ""), (F = d.value) == null || F.focus();
    }
    return t({ focus: () => {
      var F;
      return (F = d.value) == null ? void 0 : F.focus();
    } }), (F, J) => {
      var j;
      return c(), h("div", tk, [
        g("div", nk, [
          B(ye, {
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
            onInput: J[0] || (J[0] = (L) => s("update:modelValue", L.target.value)),
            onKeydown: Xt(_, ["esc"])
          }, null, 40, ak),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: _
          }, [
            B(ye, {
              name: "close",
              size: 12
            })
          ])) : C("", !0),
          y.value ? (c(), h("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!u.value,
            onClick: v
          }, [
            e.menuCount ? (c(), h("span", ok, $(e.menuCount), 1)) : C("", !0),
            B(ye, {
              name: "caret",
              size: 12
            })
          ], 8, sk)) : C("", !0)
        ]),
        (j = P(l).button) != null && j.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: J[1] || (J[1] = (L) => s("pick", P(l).button.click))
        }, $(P(l).button.title), 1)) : C("", !0),
        ue(F.$slots, "default", {}, void 0, !0),
        u.value ? (c(), H(ea, {
          key: 1,
          anchor: u.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: J[3] || (J[3] = xe(() => {
          }, ["stop"])),
          onClose: J[4] || (J[4] = (L) => u.value = null)
        }, {
          default: D(() => [
            f.value.length ? (c(), H(Mt, {
              key: 0,
              "data-search-back": "",
              onClick: J[2] || (J[2] = (L) => f.value = f.value.slice(0, -1))
            }, {
              default: D(() => [
                ee("‹ " + $(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : C("", !0),
            (c(!0), h(z, null, te(m.value, (L) => (c(), H(Mt, {
              key: L.title,
              description: L.subtext,
              "data-search-entry": L.title,
              onClick: (q) => S(L)
            }, {
              default: D(() => [
                ee($(L.title) + $(L.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? C("", !0) : ue(F.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : C("", !0)
      ]);
    };
  }
}, rk = /* @__PURE__ */ Y(lk, [["__scopeId", "data-v-45374bed"]]), ik = {
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
    return (o, l) => (c(), H(rk, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (r) => e.tools.words.value = r),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (r) => n("pick", r))
    }, {
      menu: D(() => [
        B(us, null, {
          default: D(() => [...l[2] || (l[2] = [
            ee("Order", -1)
          ])]),
          _: 1
        }),
        (c(), h(z, null, te(a, (r) => B(Mt, {
          key: r.key,
          checked: e.tools.order.value === r.key,
          "data-list-order": r.key,
          onClick: (i) => e.tools.order.value = r.key
        }, {
          default: D(() => [
            ee($(r.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (c(), h(z, { key: 0 }, [
          B(us, null, {
            default: D(() => [...l[3] || (l[3] = [
              ee("Show", -1)
            ])]),
            _: 1
          }),
          (c(), h(z, null, te(s, (r) => B(Mt, {
            key: r.key,
            checked: e.tools.state.value === r.key,
            "data-list-state": r.key,
            onClick: (i) => e.tools.state.value = r.key
          }, {
            default: D(() => [
              ee($(r.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : C("", !0)
      ]),
      default: D(() => [
        ue(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, g8 = /* @__PURE__ */ Y(ik, [["__scopeId", "data-v-dab0064d"]]);
function v8() {
  const e = I(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const y8 = (e) => import(
  /* @vite-ignore */
  e
), ck = 86400, ds = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function uk(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((ds(t) - ds(e)) / ck);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function b8(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = ds(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: uk(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Da = 280, ja = 240, Pa = 120, dk = 6, fk = 14, ln = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function hk(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function si(e, t) {
  const n = Math.max(0, hk(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function mk(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${fk}px)` }), e.offsetHeight, e.style.transition = `height ${Da}ms ${ln}`, e.style.height = `${l}px`;
  const r = s();
  let i = !1, d = !1;
  const u = () => {
    d || (d = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (d) return;
    n() && (t.scrollTop = si(t, e));
    const m = s() - r;
    if (!i && m >= Da && (i = !0, e.style.transition = `opacity ${ja}ms ease-out, transform ${ja}ms ${ln}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), m < Da + ja) return a(f);
    u();
  };
  return a(f), u;
}
function w8(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${dk}px)` }), e.offsetHeight, e.style.transition = `opacity ${Pa}ms ease-out, transform ${Pa}ms ${ln}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), r = () => {
    if (n() && (t.scrollTop = si(t, e)), s() - l < Pa) return a(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(r);
}
const pk = 140, On = 220, Yo = 5;
function k8({ gap: e = pk, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function r(u, f) {
    a.add(u), u.cancel = u.arrival(u.el, u.options, () => {
      a.delete(u), u.done(), f();
    });
  }
  function i() {
    const u = n.splice(0, Yo);
    if (s = u.length > 0, !s) return;
    let f = u.length;
    for (const m of u)
      m.el.style.display = m.display, r(m, () => {
        f -= 1, f || (o = t(i, e));
      });
  }
  const d = (u, f, m, y = mk) => {
    if (l || !f.pane || !f.follows()) return m();
    const v = { el: u, options: f, done: m, arrival: y, display: u.style.display || "" };
    if (!s)
      return s = !0, r(v, () => o = t(i, e));
    u.style.display = "none", n.push(v), n.length >= Yo && d.flush();
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
function x8(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${On}ms ${ln}, opacity ${On}ms ease-in, margin ${On}ms ${ln}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, On);
}
const oi = "chat.pins.minimised", Nn = I(jn(oi, !1));
function Jo(e) {
  Nn.value = e, $s(oi, e);
}
function gk(e) {
  const t = T(() => e()), n = T(() => Nn.value ? [] : e()), a = () => Jo(!Nn.value), s = Date.now() / 1e3;
  return fe(
    () => t.value.filter((o) => St(o) > s).length,
    (o, l) => o > l && Jo(!1)
  ), { pins: t, visible: n, minimised: Nn, toggle: a };
}
const vk = ["title"], yk = {
  key: 0,
  class: "pins-count"
}, bk = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = gk(() => t.pinRows);
    return (o, l) => P(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: Z(["pins-toggle", { minimised: P(a), inline: e.inline }]),
      title: P(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = xe((...r) => P(s) && P(s)(...r), ["stop"]))
    }, [
      B(ye, {
        name: P(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      P(a) ? (c(), h("span", yk, $(P(n).length), 1)) : C("", !0)
    ], 10, vk)) : C("", !0);
  }
}, $8 = /* @__PURE__ */ Y(bk, [["__scopeId", "data-v-d073c504"]]), wk = ["title"], kk = ["title"], xk = { class: "diff-card-dir" }, $k = { class: "diff-card-name" }, Mk = ["title"], Sk = ["title"], _k = {
  key: 0,
  class: "diff-card-note"
}, Ek = ["href"], Ak = ["src", "alt"], Ck = { class: "diff-card-rows" }, Ok = { class: "diff-row-num" }, Tk = { class: "diff-row-sign" }, Rk = { class: "diff-row-code" }, Ik = {
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
    function o(M) {
      (M.metaKey || M.ctrlKey) && (M.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, i = T(() => n.path.lastIndexOf("/") + 1), d = T(() => n.path.slice(0, i.value)), u = T(() => n.path.slice(i.value)), f = T(() => n.change === "deleted"), m = T(() => l[n.change]), y = T(() => new Set(n.rows.filter((M) => M.line_type === "add").map((M) => M.line))), v = I("after"), S = T(() => v.value === "before" ? n.whole.old : n.whole.text), _ = T(() => n.whole && n.whole.text !== void 0 ? S.value.split(`
`).map((M, k) => ({ line_type: v.value === "after" && y.value.has(k + 1) ? "add" : "ctx", line: k + 1, text: M })) : n.rows.filter(
      (M) => !(n.editsOnly && ["ctx", "fold"].includes(M.line_type)) && !(n.hideRemovals && M.line_type === "del")
    )), R = I(!1), F = T(() => n.lines && !R.value && !n.whole), J = T(() => F.value ? _.value.slice(0, n.lines) : _.value), j = T(() => _.value.length - J.value.length), L = (M) => M.line === null || M.line_type === "del" ? "" : M.line, q = (M) => M.line_type === "fold" ? M.hidden ? `⋯ ${M.hidden} lines` : "⋯" : M.text, w = I(null), b = I(null);
    let x = null;
    return Re(() => {
      if (!b.value) return;
      let M = !0;
      x = new ResizeObserver(() => {
        !w.value || !b.value || (w.value.style.transition = M ? "none" : "", w.value.style.height = `${b.value.offsetHeight}px`, M = !1);
      }), x.observe(b.value);
    }), Be(() => x && x.disconnect()), (M, k) => (c(), h("section", {
      class: Z(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
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
          g("span", xk, $(d.value), 1),
          g("span", $k, $(u.value), 1),
          m.value ? (c(), h("span", {
            key: 0,
            class: Z(["diff-card-badge", e.change])
          }, $(m.value), 3)) : C("", !0)
        ], 8, kk),
        g("span", {
          class: Z(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + $(e.added), 3),
        g("span", {
          class: Z(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + $(e.removed), 3),
        B(ia, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: v.value === "after" ? "Show the file before" : "Show the file after",
          onClick: k[0] || (k[0] = xe((p) => v.value = v.value === "after" ? "before" : "after", ["stop"]))
        }, $(v.value === "after" ? "After" : "Before"), 9, Mk)) : C("", !0),
        f.value ? C("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: Z(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: k[1] || (k[1] = xe((p) => a("whole"), ["stop"]))
        }, [
          B(ye, {
            name: "file",
            size: 12
          })
        ], 10, Sk))
      ], 8, wk),
      e.whole && e.whole.error ? (c(), h("p", _k, $(e.whole.error), 1)) : C("", !0),
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
            alt: u.value,
            loading: "lazy"
          }, null, 8, Ak)
        ], 8, Ek)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: w,
          class: "diff-card-grow"
        }, [
          g("div", {
            ref_key: "body",
            ref: b,
            class: "diff-card-diff"
          }, [
            g("div", Ck, [
              (c(!0), h(z, null, te(J.value, (p, E) => (c(), h("div", {
                key: E,
                class: Z(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                g("span", Ok, $(L(p)), 1),
                g("span", Tk, $(r[p.line_type]), 1),
                g("span", Rk, $(q(p)), 1)
              ], 2))), 128)),
              j.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: k[3] || (k[3] = xe((p) => R.value = !0, ["stop"]))
              }, $(j.value) + " more " + $(j.value === 1 ? "line" : "lines"), 1)) : C("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : C("", !0)
    ], 2));
  }
}, M8 = /* @__PURE__ */ Y(Ik, [["__scopeId", "data-v-23581cbb"]]), Bk = {
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
    const n = t, a = e, s = T(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = T(() => s.value && { render: () => Jn(Lm, { line: s.value.line, events: s.value.events }) }), l = I(null), r = T(() => {
      var m, y;
      return ((m = s.value) == null ? void 0 : m.loading) === "component" && !s.value.allowed && !((y = l.value) != null && y.component_trusted);
    }), i = T(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), d = T(
      () => {
        var m, y;
        return l.value ? lv(l.value, f) : { reads: ((m = s.value) == null ? void 0 : m.reads) || [], runs: ((y = s.value) == null ? void 0 : y.runs) || [], missing: [], ask: async () => !0 };
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
    return fe(
      () => {
        var m, y;
        return ((m = s.value) == null ? void 0 : m.entry_url) || ((y = s.value) == null ? void 0 : y.line);
      },
      async () => {
        await u(), d.value.missing.length && !r.value && f();
      },
      { immediate: !0 }
    ), (m, y) => {
      var v, S;
      return !s.value && ((v = e.catalogue.loaded) == null ? void 0 : v.value) === !1 ? (c(), H(As, {
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
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (c(), H(vr, {
        key: d.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: d.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[0] || (y[0] = (_, R) => n("option", _, R))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (c(), H(gr, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: d.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[1] || (y[1] = (_, R) => n("option", _, R))
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
        onOption: y[2] || (y[2] = (_, R) => n("option", _, R))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (c(), H(Kt, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: y[3] || (y[3] = (_) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, Lk = ["data-section"], Nk = {
  __name: "InspectorSections",
  props: { slotName: { type: String, required: !0 }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Oe(Iu, null), a = T(() => (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? []), s = T(() => ({ row: t.row }));
    return (o, l) => (c(!0), h(z, null, te(a.value, (r) => (c(), h("div", {
      key: r.name,
      class: "inspector-section",
      "data-section": r.name
    }, [
      B(Bk, {
        name: r.name,
        catalogue: P(n).catalogue,
        subscriptions: P(n).subscriptions,
        environment: P(n).environment,
        prompts: P(n).prompts,
        "shell-read": P(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])
    ], 8, Lk))), 128));
  }
}, Dk = {
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
      default: D(() => [
        B(ye, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, jk = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, Pk = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, qk = { class: "ask-text" }, Fk = ["placeholder", "aria-label"], Wk = ["placeholder", "aria-label"], Hk = {
  key: 3,
  class: "moves"
}, Uk = {
  __name: "RowMoves",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = T(() => o0(a.noun, a.row)), l = I(""), r = I(null), i = I(""), d = I("");
    fe(() => a.id, () => {
      l.value = "", r.value = null;
    });
    async function u(y, v = "") {
      const S = await a.read([y.noun ?? a.noun, y.word, String(a.id), ...y.flag ? [y.flag, v] : y.positional ? [v] : [], ...y.opener && d.value.trim() ? ["--on", d.value.trim()] : []]);
      l.value = S.ok ? "" : S.error, S.ok && (r.value = null, i.value = "", d.value = "", s("done"));
    }
    const f = (y) => y.confirm ? r.value = y : y.said ? u(y, y.said) : y.flag || y.positional ? (r.value = y, i.value = "") : u(y), m = () => i.value.trim() && u(r.value, i.value.trim());
    return t({ moves: o, press: f }), (y, v) => o.value.length ? (c(), H(dr, {
      key: 0,
      inline: e.inline
    }, {
      default: D(() => {
        var S;
        return [
          l.value ? (c(), h("p", jk, $(l.value), 1)) : C("", !0),
          (S = r.value) != null && S.confirm ? (c(), h("div", Pk, [
            g("span", qk, $(r.value.confirm), 1),
            B(de, {
              small: "",
              variant: r.value.danger ? "ghost" : "primary",
              bordered: r.value.danger,
              class: Z({ danger: r.value.danger }),
              "data-resource-confirm-yes": "",
              onClick: v[0] || (v[0] = (_) => u(r.value))
            }, {
              default: D(() => [
                ee($(r.value.label), 1)
              ]),
              _: 1
            }, 8, ["variant", "bordered", "class"]),
            B(de, {
              small: "",
              variant: "ghost",
              onClick: v[1] || (v[1] = (_) => r.value = null)
            }, {
              default: D(() => [...v[7] || (v[7] = [
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
            Ye(g("input", {
              "onUpdate:modelValue": v[2] || (v[2] = (_) => i.value = _),
              class: "ask-input",
              placeholder: r.value.ask,
              "aria-label": r.value.ask,
              onKeydown: v[3] || (v[3] = Xt(xe((_) => r.value = null, ["stop"]), ["esc"]))
            }, null, 40, Fk), [
              [Dn, i.value]
            ]),
            r.value.opener ? Ye((c(), h("input", {
              key: 0,
              "onUpdate:modelValue": v[4] || (v[4] = (_) => d.value = _),
              class: "ask-input",
              "data-resource-opener": "",
              placeholder: r.value.opener,
              "aria-label": r.value.opener,
              onKeydown: v[5] || (v[5] = Xt(xe((_) => r.value = null, ["stop"]), ["esc"]))
            }, null, 40, Wk)), [
              [Dn, d.value]
            ]) : C("", !0),
            B(de, {
              small: "",
              variant: "primary",
              type: "submit",
              disabled: !i.value.trim()
            }, {
              default: D(() => [
                ee($(r.value.label), 1)
              ]),
              _: 1
            }, 8, ["disabled"]),
            B(de, {
              small: "",
              variant: "ghost",
              onClick: v[6] || (v[6] = (_) => r.value = null)
            }, {
              default: D(() => [...v[8] || (v[8] = [
                ee("Back", -1)
              ])]),
              _: 1
            })
          ], 32)) : (c(), h("div", Hk, [
            (c(!0), h(z, null, te(o.value, (_) => (c(), H(de, {
              key: _.word,
              small: !_.bordered,
              bordered: _.bordered,
              icon: _.icon,
              variant: _.main ? "primary" : "ghost",
              class: Z({ danger: _.danger }),
              "data-move": _.word,
              onClick: (R) => f(_)
            }, {
              default: D(() => [
                ee($(_.label), 1)
              ]),
              _: 2
            }, 1032, ["small", "bordered", "icon", "variant", "class", "data-move", "onClick"]))), 128))
          ]))
        ];
      }),
      _: 1
    }, 8, ["inline"])) : C("", !0);
  }
}, zk = /* @__PURE__ */ Y(Uk, [["__scopeId", "data-v-bdac0207"]]), Vk = /* @__PURE__ */ new Set(["completed", "cancelled"]), Gk = (e) => Vk.has(e), rn = (e) => Gk(e) ? "done" : e, Kk = { class: "facts" }, Yk = { class: "fact wide" }, Jk = ["title"], Zk = {
  key: 1,
  class: "fact-value"
}, Xk = {
  key: 0,
  class: "fact"
}, Qk = { class: "fact-value" }, e2 = { class: "fact" }, t2 = { class: "fact-label" }, n2 = ["title"], a2 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, s2 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, o2 = {
  key: 2,
  class: "fact"
}, l2 = { class: "fact-value" }, r2 = { class: "fact wide" }, i2 = { class: "fact wide" }, c2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, u2 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = Hn.map(({ key: l, label: r }) => ({ key: String(l), label: r })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, r) => {
      var i, d;
      return c(), h("div", Kk, [
        g("div", Yk, [
          r[4] || (r[4] = g("span", { class: "fact-label" }, "Plan", -1)),
          (i = e.place) != null && i.plan_id ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: r[0] || (r[0] = (u) => P(Fe)(`plans:${e.place.plan_id}`))
          }, "Plan " + $(e.place.plan_id) + ": " + $(e.place.plan_title), 9, Jk)) : (c(), h("span", Zk, "Not in a plan"))
        ]),
        ((d = e.place) == null ? void 0 : d.phase_total) > 1 ? (c(), h("div", Xk, [
          r[5] || (r[5] = g("span", { class: "fact-label" }, "Phase", -1)),
          g("span", Qk, $(e.place.phase_number) + " of " + $(e.place.phase_total) + ": " + $(e.place.phase_title), 1)
        ])) : C("", !0),
        e.task.helper_id ? (c(), h(z, { key: 1 }, [
          g("div", e2, [
            g("span", t2, $(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            g("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: r[1] || (r[1] = (u) => P(Fe)(`agents:${e.task.helper_id}`))
            }, $(e.task.helper_name), 9, n2)
          ]),
          P(o).has(e.task.state) ? (c(), h("p", a2, $(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (c(), h("p", s2, $(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : C("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (c(), h("div", o2, [
          r[6] || (r[6] = g("span", { class: "fact-label" }, "Assigned to", -1)),
          g("span", l2, "Agent " + $(e.task.holder_id), 1)
        ])) : C("", !0),
        g("div", r2, [
          r[7] || (r[7] = g("span", { class: "fact-label" }, "Complexity", -1)),
          B(Nt, {
            options: P(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: r[2] || (r[2] = (u) => s("complexity", u))
          }, null, 8, ["options", "value"]),
          r[8] || (r[8] = g("span", { class: "fact-label" }, "1: a few lines. 5: a design with risk.", -1))
        ]),
        g("div", i2, [
          r[9] || (r[9] = g("span", { class: "fact-label" }, "Priority", -1)),
          B(Nt, {
            options: P(n),
            value: String(P(ur)(e.task.priority)),
            "data-task-priority": "",
            onPick: r[3] || (r[3] = (u) => s("priority", u))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", c2, $(e.refusal), 1)) : C("", !0)
        ])
      ]);
    };
  }
}, d2 = /* @__PURE__ */ Y(u2, [["__scopeId", "data-v-81d598cf"]]);
function f2(e, t) {
  const n = new Map(t.tasks.map((i) => [i.id, i])), a = (i) => t.edges.filter(([, d]) => d === i).map(([d]) => d), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let i = a(e); i.length; i = [...new Set(i.flatMap(a))].filter((d) => !s.has(d)))
    i.forEach((d) => s.add(d)), o.push(i.map((d) => n.get(d)));
  const l = [], r = /* @__PURE__ */ new Set([e]);
  for (let i = t.edges.find(([d]) => d === e); i && !r.has(i[1]); i = t.edges.find(([d]) => d === i[1]))
    r.add(i[1]), l.push(n.get(i[1]));
  return { above: o.reverse(), below: l };
}
const h2 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, m2 = { ...h2, done: "Completed" }, p2 = { class: "task-status-icon" }, g2 = ["width", "height", "aria-label"], v2 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = T(() => xl("task", rn(t.status))), a = T(() => n.value === "testing" ? "started" : n.value), s = T(() => m2[t.status] ?? kl("task", t.status));
    return (o, l) => (c(), h("span", p2, [
      B(jt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: D(() => [
          (c(), h("svg", {
            key: n.value,
            class: Z(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            B(Pt, { value: a.value }, {
              blocked: D(() => [...l[0] || (l[0] = [
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
              done: D(() => [...l[1] || (l[1] = [
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
              started: D(() => [...l[2] || (l[2] = [
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
              asked: D(() => [...l[3] || (l[3] = [
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
              paused: D(() => [...l[4] || (l[4] = [
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
              planned: D(() => [...l[5] || (l[5] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: D(() => [...l[6] || (l[6] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, g2))
        ]),
        _: 1
      })
    ]));
  }
}, qs = /* @__PURE__ */ Y(v2, [["__scopeId", "data-v-ae24a63f"]]), y2 = { class: "number" }, b2 = { class: "title" }, w2 = { class: "word" }, k2 = {
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
      class: Z(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: D(() => [
        B(qs, { status: e.status }, null, 8, ["status"]),
        g("span", y2, $(e.number), 1),
        g("span", b2, $(e.title), 1),
        g("span", w2, $(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, qa = /* @__PURE__ */ Y(k2, [["__scopeId", "data-v-f6417ae8"]]), x2 = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, $2 = { class: "level" }, M2 = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(!1);
    fe(() => n.task.id, () => s.value = !1);
    const o = T(() => f2(n.task.id, n.graph)), l = T(() => s.value ? o.value.above : o.value.above.slice(-1)), r = T(() => s.value ? o.value.below : o.value.below.slice(0, 1)), i = T(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), d = (f) => f.slice(0, 1).toUpperCase() + f.slice(1), u = (f, m = !1) => ({ status: rn(f.state), number: f.id, title: f.title, word: m ? "This task" : d(f.state), current: m });
    return (f, m) => o.value.above.length || o.value.below.length ? (c(), h("section", x2, [
      m[5] || (m[5] = g("h4", null, "What waits on what", -1)),
      (c(!0), h(z, null, te(l.value, (y) => (c(), h(z, {
        key: y.map((v) => v.id).join()
      }, [
        g("div", $2, [
          (c(!0), h(z, null, te(y, (v) => (c(), H(qa, Le({
            key: v.id,
            ref_for: !0
          }, u(v), {
            onSelect: m[0] || (m[0] = (S) => a("select", S))
          }), null, 16))), 128))
        ]),
        m[3] || (m[3] = g("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      B(qa, yi(bi(u(e.task, !0))), null, 16),
      (c(!0), h(z, null, te(r.value, (y) => (c(), h(z, {
        key: y.id
      }, [
        m[4] || (m[4] = g("div", { class: "waits" }, "↓ waits on", -1)),
        B(qa, Le({ ref_for: !0 }, u(y), {
          onSelect: m[1] || (m[1] = (v) => a("select", v))
        }), null, 16)
      ], 64))), 128)),
      i.value ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: m[2] || (m[2] = (y) => s.value = !s.value)
      }, $(s.value ? "Show less" : `Show the whole chain (${i.value} more)`), 1)) : C("", !0)
    ])) : C("", !0);
  }
}, S2 = /* @__PURE__ */ Y(M2, [["__scopeId", "data-v-db05c4b2"]]), _2 = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, E2 = ["datetime"], A2 = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (c(), h("section", _2, [
      n[0] || (n[0] = g("h3", null, "Block history", -1)),
      (c(!0), h(z, null, te(e.renewals, (a) => (c(), h("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        g("time", {
          datetime: a.created_at
        }, $(new Date(a.created_at).toLocaleString()), 9, E2),
        g("p", null, $(a.reason), 1)
      ]))), 128))
    ])) : C("", !0);
  }
}, C2 = /* @__PURE__ */ Y(A2, [["__scopeId", "data-v-b41f213b"]]), O2 = {
  class: "part",
  "data-resource-waits": ""
}, T2 = ["onClick"], R2 = { class: "wait-id" }, I2 = { class: "wait-title" }, B2 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", O2, [
      g("h4", null, $(e.title), 1),
      (c(!0), h(z, null, te(e.waits, (o) => (c(), h("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        B(qs, {
          status: P(rn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        g("span", R2, $(o.id), 1),
        g("span", I2, $(o.title), 1)
      ], 8, T2))), 128))
    ]));
  }
}, Zo = /* @__PURE__ */ Y(B2, [["__scopeId", "data-v-8fb2e251"]]), L2 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, N2 = { class: "text" }, D2 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, j2 = 180, P2 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = I(!1), l = T(() => a.task.waits.filter((i) => !n.has(i.state))), r = T(() => a.task.waits.filter((i) => n.has(i.state)));
    return (i, d) => (c(), h(z, null, [
      l.value.length ? (c(), H(Zo, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: d[0] || (d[0] = (u) => s("select", u))
      }, null, 8, ["waits"])) : C("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", L2, [
        d[3] || (d[3] = g("h4", null, "How it was done", -1)),
        g("p", N2, $(e.task.outcome), 1)
      ])) : C("", !0),
      e.task.brief ? (c(), h("section", D2, [
        d[4] || (d[4] = g("h4", null, "The brief", -1)),
        g("p", {
          class: Z(["text", { clamped: !o.value }])
        }, $(e.task.brief), 3),
        e.task.brief.length > j2 && !o.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: d[1] || (d[1] = (u) => o.value = !0)
        }, "Show the whole brief")) : C("", !0)
      ])) : C("", !0),
      r.value.length ? (c(), H(Zo, {
        key: 3,
        title: "Waited on",
        waits: r.value,
        onSelect: d[2] || (d[2] = (u) => s("select", u))
      }, null, 8, ["waits"])) : C("", !0)
    ], 64));
  }
}, q2 = /* @__PURE__ */ Y(P2, [["__scopeId", "data-v-4a3f1e79"]]), F2 = {
  class: "task-details",
  "data-task-details": ""
}, W2 = { class: "since" }, H2 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, U2 = { class: "text" }, z2 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, V2 = {
  key: 1,
  class: "note"
}, G2 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, K2 = { class: "text" }, Y2 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return c(), h("div", F2, [
        g("div", {
          class: Z(["state-line", P(rn)(e.task.state)])
        }, [
          g("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (r) => n("status", r.currentTarget))
          }, [
            B(qs, {
              status: P(rn)(e.task.state)
            }, null, 8, ["status"]),
            ee(" " + $(a(e.task.state)), 1)
          ]),
          g("span", W2, [
            o[5] || (o[5] = ee(" since ", -1)),
            B(ia, {
              at: P(Ql)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", H2, [
          o[6] || (o[6] = g("span", { class: "label" }, "Blocked, waiting on", -1)),
          g("p", U2, $(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (c(), h("p", z2, "Opens by itself when " + $(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", V2, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", G2, [
          o[7] || (o[7] = g("span", { class: "label" }, "Why it was cancelled", -1)),
          g("p", K2, $(e.task.reason), 1)
        ])) : C("", !0),
        e.graph ? (c(), H(S2, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (r) => n("select", r))
        }, null, 8, ["task", "graph"])) : C("", !0),
        B(d2, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (r) => n("priority", r)),
          onComplexity: o[3] || (o[3] = (r) => n("complexity", r))
        }, null, 8, ["task", "place", "refusal"]),
        B(q2, {
          task: e.task,
          onSelect: o[4] || (o[4] = (r) => n("select", r))
        }, null, 8, ["task"]),
        B(C2, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, J2 = /* @__PURE__ */ Y(Y2, [["__scopeId", "data-v-7e73fa21"]]), Z2 = 50, X2 = { messages: 25 }, Q2 = (e) => X2[e] || Z2, e5 = {
  class: "task-log",
  "aria-label": "Task log"
}, t5 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, n5 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, a5 = { class: "entries" }, s5 = ["data-task-log-important"], o5 = ["datetime"], l5 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, r5 = {
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
        String(Q2("task_logs")),
        "--page",
        String(d)
      ]);
      u === r && (o.value = !1, l.value = f.ok ? "" : f.error, f.ok && (n.value = f.value.rows, s.value = f.value.is_last_page));
    }
    return fe(
      () => [t.id, t.changes],
      () => {
        n.value = [], i();
      },
      { immediate: !0 }
    ), ft(() => {
      r += 1;
    }), (d, u) => (c(), h("section", e5, [
      o.value ? (c(), H(_t, { key: 0 })) : l.value ? (c(), h(z, { key: 1 }, [
        g("p", t5, $(l.value), 1),
        B(de, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: u[0] || (u[0] = (f) => i(a.value))
        }, {
          default: D(() => [...u[3] || (u[3] = [
            ee("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (c(), h(z, { key: 2 }, [
        n.value.length ? C("", !0) : (c(), h("p", n5, "No log entries yet.")),
        g("ol", a5, [
          (c(!0), h(z, null, te(n.value, (f) => (c(), h("li", {
            key: f.id,
            class: Z(["entry", { important: f.important }]),
            "data-task-log": "",
            "data-task-log-important": f.important ? "" : null
          }, [
            g("time", {
              datetime: f.created_at
            }, $(new Date(f.created_at).toLocaleString()), 9, o5),
            g("p", null, $(f.line), 1)
          ], 10, s5))), 128))
        ]),
        a.value > 1 || !s.value ? (c(), h("nav", l5, [
          B(de, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: u[1] || (u[1] = (f) => i(a.value - 1))
          }, {
            default: D(() => [...u[4] || (u[4] = [
              ee("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          g("span", null, "Page " + $(a.value), 1),
          B(de, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: u[2] || (u[2] = (f) => i(a.value + 1))
          }, {
            default: D(() => [...u[5] || (u[5] = [
              ee("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : C("", !0)
      ], 64))
    ]));
  }
}, i5 = /* @__PURE__ */ Y(r5, [["__scopeId", "data-v-cfa43bf1"]]), c5 = {
  class: "task-tags",
  "aria-label": "Task tags"
}, u5 = { class: "tags" }, d5 = ["aria-label", "data-remove-tag", "onClick"], f5 = {
  __name: "TaskTags",
  props: { tags: { type: Array, required: !0 } },
  emits: ["add", "remove"],
  setup(e, { emit: t }) {
    const n = t, a = I("");
    function s() {
      const o = a.value.trim();
      o && (n("add", o), a.value = "");
    }
    return (o, l) => (c(), h("section", c5, [
      g("div", u5, [
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
          }, "×", 8, d5)
        ]))), 128))
      ]),
      g("form", {
        class: "add-tag",
        onSubmit: xe(s, ["prevent"])
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
        B(de, {
          small: "",
          type: "submit",
          disabled: !a.value.trim(),
          "data-task-tag-add": ""
        }, {
          default: D(() => [...l[1] || (l[1] = [
            ee("Add tag", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)
    ]));
  }
}, h5 = /* @__PURE__ */ Y(f5, [["__scopeId", "data-v-1d720cf2"]]), m5 = { class: "comment-side-head" }, p5 = {
  key: 0,
  class: "comment-none"
}, g5 = { key: 0 }, v5 = {
  key: 1,
  class: "comment-none"
}, y5 = {
  class: "comment",
  "data-comment": ""
}, b5 = {
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
      class: Z(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      g("header", m5, [
        n[2] || (n[2] = g("h3", null, "Comments", -1)),
        B(xs, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (c(), h("p", p5, "No comments yet")) : C("", !0),
      (c(!0), h(z, null, te(e.comments, (a) => (c(), h("section", {
        key: a.id
      }, [
        a.quote ? (c(), h("blockquote", g5, $(a.quote), 1)) : C("", !0),
        a.revision ? (c(), h("span", v5, "Revision " + $(a.revision), 1)) : C("", !0),
        g("p", y5, $(e.words(a)), 1)
      ]))), 128)),
      B(Qn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, w5 = /* @__PURE__ */ Y(b5, [["__scopeId", "data-v-276284a3"]]);
var el;
/Mac|iPhone|iPad/.test(((el = navigator.userAgentData) == null ? void 0 : el.platform) || navigator.platform);
function k5(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const x5 = ["placeholder"], $5 = { class: "actions" }, M5 = { class: "error" }, S5 = {
  key: 1,
  class: "card closed"
}, _5 = { class: "mark" }, E5 = { class: "prompt" }, A5 = {
  key: 0,
  class: "draft"
}, C5 = {
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
      var v, S;
      r.value = !0, i.value = !1, await mt(), (S = ((v = u.value) == null ? void 0 : v.querySelector("input")) || u.value) == null || S.focus();
    }
    function m() {
      r.value = !1, l.value = "";
    }
    async function y() {
      const v = o.value.trim();
      if (!(!v || !a.ready || d.value)) {
        l.value = "", d.value = !0, o.value = "";
        try {
          await a.send(v), r.value = !1, i.value = !0;
        } catch (S) {
          o.value = v, l.value = S.message;
        } finally {
          d.value = !1;
        }
      }
    }
    return t({ expand: f }), (v, S) => (c(), h("div", {
      class: Z(["comment-bar", { open: r.value }])
    }, [
      r.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: xe(y, ["prevent"]),
        onKeydown: Xt(m, ["esc"])
      }, [
        ue(v.$slots, "who", {}, void 0, !0),
        Ye(g("textarea", {
          ref_key: "box",
          ref: u,
          "onUpdate:modelValue": S[0] || (S[0] = (_) => o.value = _),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: S[1] || (S[1] = Xt((_) => P(k5)(_, y), ["enter"]))
        }, null, 40, x5), [
          [Dn, o.value]
        ]),
        g("div", $5, [
          g("span", M5, $(l.value), 1),
          B(de, {
            small: "",
            onClick: m
          }, {
            default: D(() => [...S[3] || (S[3] = [
              ee("Cancel", -1)
            ])]),
            _: 1
          }),
          B(de, {
            variant: "primary",
            small: "",
            busy: d.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: y
          }, {
            default: D(() => [...S[4] || (S[4] = [
              ee("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", S5, [
        g("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          g("span", _5, [
            B(ye, {
              name: i.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          g("span", E5, $(i.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", A5, "Draft kept")) : C("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: S[2] || (S[2] = (_) => s("show"))
        }, [
          g("span", null, $(P(mu)(e.count, "comment")), 1),
          B(ye, {
            name: "down",
            size: 12
          })
        ])) : C("", !0)
      ]))
    ], 2));
  }
}, O5 = /* @__PURE__ */ Y(C5, [["__scopeId", "data-v-b68baddd"]]);
function T5(e, t) {
  const n = I([]), a = I(!1), s = I(null), o = I(0), l = I(!1), r = I("");
  let i = 0, d = 0;
  const u = (v) => {
    if (typeof v.body == "string") return v.body;
    const { noun: S, id: _, title: R } = e(), F = `On ${S} ${_}, ${R}: `;
    return v.text.startsWith(F) ? v.text.slice(F.length) : v.text;
  };
  async function f(v = 1) {
    const { noun: S, id: _ } = e();
    if (!_) return;
    const R = ++d;
    l.value = !0, r.value = "";
    try {
      const F = await t([S, "comments", String(_), "--page", String(v), "--page-size", "25"]);
      if (R !== d) return;
      if (!F.ok) {
        r.value = F.error;
        return;
      }
      const J = F.value.rows ?? [], j = v === 1 ? J : [...n.value, ...J];
      n.value = [...new Map(j.map((L) => [L.id, L])).values()], o.value = F.value.total ?? n.value.length, s.value = F.value.next_page ?? null;
    } catch (F) {
      R === d && (r.value = F.message);
    } finally {
      R === d && (l.value = !1);
    }
  }
  async function m(v) {
    var L;
    const { noun: S, id: _ } = e(), R = `${S}:${_}`, F = { id: `sending-${++i}`, text: v };
    n.value = [...n.value, F], o.value++, a.value = !0;
    const J = await t([S, "comment", String(_), v]);
    if (R !== `${e().noun}:${e().id}`) return;
    if (!J.ok)
      throw n.value = n.value.filter((q) => q.id !== F.id), o.value = Math.max(0, o.value - 1), new Error(J.error);
    await f();
    const j = (L = J.value) == null ? void 0 : L.id;
    j && !n.value.some((q) => q.id === j) && (n.value = [...n.value, { ...F, id: j }]);
  }
  const y = () => !l.value && s.value && f(s.value);
  return fe(() => `${e().noun}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, r.value = "", d++, f();
  }, { immediate: !0 }), { comments: n, open: a, words: u, send: m, load: f, loadMore: y, nextPage: s, total: o, loading: l, failure: r };
}
const R5 = { class: "top" }, I5 = {
  class: "crumb",
  "data-task-crumb": ""
}, B5 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, L5 = {
  key: 1,
  class: "body"
}, N5 = { class: "summary" }, D5 = { class: "stamp" }, j5 = {
  class: "title",
  "data-resource-title": ""
}, P5 = {
  class: "tabs",
  "data-task-tabs": ""
}, q5 = { class: "panels" }, F5 = {
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
    const a = e, s = n, o = I(null), l = I(null), r = I(null), i = I(""), d = I(""), u = I(null), f = I(null), m = I("details"), y = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], v = T5(
      () => o.value ? { noun: "task", id: a.id, title: o.value.title } : {},
      (q) => a.read(q)
    );
    let S = 0;
    const _ = T(() => {
      var q;
      return (q = l.value) != null && q.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function R() {
      const q = ++S, [w, b, x] = await Promise.all([
        a.read(["task", "inspect", String(a.id)]),
        a.read(["plan", "place", String(a.id)]),
        a.read(["task", "graph"])
      ]);
      q === S && (i.value = w.ok ? "" : w.error, o.value = w.ok ? w.value : null, l.value = b.ok ? b.value : null, r.value = x.ok ? x.value : null);
    }
    fe(
      () => a.id,
      () => {
        o.value = null, l.value = null, r.value = null, u.value = null, m.value = "details", R();
      },
      { immediate: !0 }
    ), fe(() => a.changes, R), fe(v.open, (q) => {
      q && (m.value = "comments");
    });
    async function F(q, w) {
      const b = o.value[q];
      o.value[q] = Number(w);
      const x = await a.read(["task", "edit", String(a.id), `--${q}`, w]);
      if (d.value = x.ok ? "" : x.error, x.ok) return R();
      o.value[q] = b;
    }
    async function J(q, w) {
      const b = await a.read(["task", q, String(a.id), w]);
      d.value = b.ok ? "" : b.error, b.ok && await R();
    }
    function j(q) {
      u.value = null, f.value.press(q);
    }
    const L = (q) => {
      var w;
      return ((w = f.value) == null ? void 0 : w.moves.length) && (u.value = q);
    };
    return t({ openStatus: L }), (q, w) => (c(), h("aside", {
      class: Z(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      g("div", R5, [
        e.backed ? (c(), H(Dk, {
          key: 0,
          onBack: w[0] || (w[0] = (b) => s("back"))
        })) : C("", !0),
        g("span", I5, $(_.value), 1),
        w[14] || (w[14] = g("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(z, { key: 1 }, [
          B(de, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: w[1] || (w[1] = (b) => s("step", -1))
          }, {
            default: D(() => [
              B(ye, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          B(de, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: w[2] || (w[2] = (b) => s("step", 1))
          }, {
            default: D(() => [
              B(ye, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : C("", !0),
        B(de, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: w[3] || (w[3] = (b) => s("close"))
        }, {
          default: D(() => [
            B(ye, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (c(), h("p", B5, $(i.value), 1)) : o.value ? (c(), h(z, { key: 2 }, [
        B(zk, {
          ref_key: "actions",
          ref: f,
          noun: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: R
        }, null, 8, ["id", "row", "read"]),
        g("header", N5, [
          g("div", D5, [
            ee(" Task " + $(o.value.id) + " · updated ", 1),
            B(ia, {
              at: P(Ql)(o.value)
            }, null, 8, ["at"])
          ]),
          g("h3", j5, $(o.value.title), 1),
          B(h5, {
            tags: o.value.tags,
            onAdd: w[4] || (w[4] = (b) => J("tag", b)),
            onRemove: w[5] || (w[5] = (b) => J("untag", b))
          }, null, 8, ["tags"])
        ]),
        g("div", P5, [
          B(Nt, {
            options: y,
            value: m.value,
            onPick: w[6] || (w[6] = (b) => m.value = b)
          }, null, 8, ["value"])
        ]),
        g("div", q5, [
          B(Pt, { value: m.value }, {
            details: D(() => [
              B(J2, {
                task: o.value,
                place: l.value,
                graph: r.value,
                refusal: d.value,
                onStatus: L,
                onPriority: w[7] || (w[7] = (b) => F("priority", b)),
                onComplexity: w[8] || (w[8] = (b) => F("complexity", b)),
                onSelect: w[9] || (w[9] = (b) => s("select", b))
              }, null, 8, ["task", "place", "graph", "refusal"]),
              B(Nk, {
                "slot-name": "inspector.task",
                row: o.value
              }, null, 8, ["row"]),
              B(fu, {
                model: "task",
                id: e.id,
                read: e.read,
                changes: e.changes,
                onOpen: w[10] || (w[10] = (b) => s("select", b))
              }, null, 8, ["id", "read", "changes"])
            ]),
            comments: D(() => [
              B(w5, {
                below: "",
                comments: P(v).comments.value,
                words: P(v).words,
                more: !!P(v).nextPage.value,
                loading: P(v).loading.value,
                failure: P(v).failure.value,
                onMore: P(v).loadMore,
                onClose: w[11] || (w[11] = (b) => m.value = "details")
              }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
            ]),
            log: D(() => [
              B(i5, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        B(O5, {
          send: P(v).send,
          count: P(v).total.value,
          onShow: w[12] || (w[12] = (b) => m.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", L5, [
        B(_t)
      ])),
      u.value ? (c(), H(ea, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: w[13] || (w[13] = (b) => u.value = null)
      }, {
        default: D(() => [
          B(us, null, {
            default: D(() => [
              ee("Change the status of task " + $(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(z, null, te(f.value.moves, (b) => (c(), H(Mt, {
            key: b.word,
            onClick: (x) => j(b)
          }, {
            default: D(() => [
              ee($(b.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : C("", !0)
    ], 2));
  }
}, S8 = /* @__PURE__ */ Y(F5, [["__scopeId", "data-v-d8c2872e"]]);
function W5(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Fa = { exports: {} }, Xo;
function H5() {
  return Xo || (Xo = 1, (function(e, t) {
    var n = (function() {
      var a = function(L, q) {
        var w = 236, b = 17, x = L, M = o[q], k = null, p = 0, E = null, A = [], O = {}, N = function(U, V) {
          p = x * 4 + 17, k = (function(W) {
            for (var G = new Array(W), K = 0; K < W; K += 1) {
              G[K] = new Array(W);
              for (var Q = 0; Q < W; Q += 1)
                G[K][Q] = null;
            }
            return G;
          })(p), X(0, 0), X(p - 7, 0), X(0, p - 7), he(), ie(), He(U, V), x >= 7 && Ae(U), E == null && (E = se(x, M, A)), ve(E, V);
        }, X = function(U, V) {
          for (var W = -1; W <= 7; W += 1)
            if (!(U + W <= -1 || p <= U + W))
              for (var G = -1; G <= 7; G += 1)
                V + G <= -1 || p <= V + G || (0 <= W && W <= 6 && (G == 0 || G == 6) || 0 <= G && G <= 6 && (W == 0 || W == 6) || 2 <= W && W <= 4 && 2 <= G && G <= 4 ? k[U + W][V + G] = !0 : k[U + W][V + G] = !1);
        }, ne = function() {
          for (var U = 0, V = 0, W = 0; W < 8; W += 1) {
            N(!0, W);
            var G = r.getLostPoint(O);
            (W == 0 || U > G) && (U = G, V = W);
          }
          return V;
        }, ie = function() {
          for (var U = 8; U < p - 8; U += 1)
            k[U][6] == null && (k[U][6] = U % 2 == 0);
          for (var V = 8; V < p - 8; V += 1)
            k[6][V] == null && (k[6][V] = V % 2 == 0);
        }, he = function() {
          for (var U = r.getPatternPosition(x), V = 0; V < U.length; V += 1)
            for (var W = 0; W < U.length; W += 1) {
              var G = U[V], K = U[W];
              if (k[G][K] == null)
                for (var Q = -2; Q <= 2; Q += 1)
                  for (var le = -2; le <= 2; le += 1)
                    Q == -2 || Q == 2 || le == -2 || le == 2 || Q == 0 && le == 0 ? k[G + Q][K + le] = !0 : k[G + Q][K + le] = !1;
            }
        }, Ae = function(U) {
          for (var V = r.getBCHTypeNumber(x), W = 0; W < 18; W += 1) {
            var G = !U && (V >> W & 1) == 1;
            k[Math.floor(W / 3)][W % 3 + p - 8 - 3] = G;
          }
          for (var W = 0; W < 18; W += 1) {
            var G = !U && (V >> W & 1) == 1;
            k[W % 3 + p - 8 - 3][Math.floor(W / 3)] = G;
          }
        }, He = function(U, V) {
          for (var W = M << 3 | V, G = r.getBCHTypeInfo(W), K = 0; K < 15; K += 1) {
            var Q = !U && (G >> K & 1) == 1;
            K < 6 ? k[K][8] = Q : K < 8 ? k[K + 1][8] = Q : k[p - 15 + K][8] = Q;
          }
          for (var K = 0; K < 15; K += 1) {
            var Q = !U && (G >> K & 1) == 1;
            K < 8 ? k[8][p - K - 1] = Q : K < 9 ? k[8][15 - K - 1 + 1] = Q : k[8][15 - K - 1] = Q;
          }
          k[p - 8][8] = !U;
        }, ve = function(U, V) {
          for (var W = -1, G = p - 1, K = 7, Q = 0, le = r.getMaskFunction(V), oe = p - 1; oe > 0; oe -= 2)
            for (oe == 6 && (oe -= 1); ; ) {
              for (var ke = 0; ke < 2; ke += 1)
                if (k[G][oe - ke] == null) {
                  var Se = !1;
                  Q < U.length && (Se = (U[Q] >>> K & 1) == 1);
                  var ce = le(G, oe - ke);
                  ce && (Se = !Se), k[G][oe - ke] = Se, K -= 1, K == -1 && (Q += 1, K = 7);
                }
              if (G += W, G < 0 || p <= G) {
                G -= W, W = -W;
                break;
              }
            }
        }, me = function(U, V) {
          for (var W = 0, G = 0, K = 0, Q = new Array(V.length), le = new Array(V.length), oe = 0; oe < V.length; oe += 1) {
            var ke = V[oe].dataCount, Se = V[oe].totalCount - ke;
            G = Math.max(G, ke), K = Math.max(K, Se), Q[oe] = new Array(ke);
            for (var ce = 0; ce < Q[oe].length; ce += 1)
              Q[oe][ce] = 255 & U.getBuffer()[ce + W];
            W += ke;
            var De = r.getErrorCorrectPolynomial(Se), je = d(Q[oe], De.getLength() - 1), Fs = je.mod(De);
            le[oe] = new Array(De.getLength() - 1);
            for (var ce = 0; ce < le[oe].length; ce += 1) {
              var Ws = ce + Fs.getLength() - le[oe].length;
              le[oe][ce] = Ws >= 0 ? Fs.getAt(Ws) : 0;
            }
          }
          for (var Hs = 0, ce = 0; ce < V.length; ce += 1)
            Hs += V[ce].totalCount;
          for (var ca = new Array(Hs), gn = 0, ce = 0; ce < G; ce += 1)
            for (var oe = 0; oe < V.length; oe += 1)
              ce < Q[oe].length && (ca[gn] = Q[oe][ce], gn += 1);
          for (var ce = 0; ce < K; ce += 1)
            for (var oe = 0; oe < V.length; oe += 1)
              ce < le[oe].length && (ca[gn] = le[oe][ce], gn += 1);
          return ca;
        }, se = function(U, V, W) {
          for (var G = u.getRSBlocks(U, V), K = f(), Q = 0; Q < W.length; Q += 1) {
            var le = W[Q];
            K.put(le.getMode(), 4), K.put(le.getLength(), r.getLengthInBits(le.getMode(), U)), le.write(K);
          }
          for (var oe = 0, Q = 0; Q < G.length; Q += 1)
            oe += G[Q].dataCount;
          if (K.getLengthInBits() > oe * 8)
            throw "code length overflow. (" + K.getLengthInBits() + ">" + oe * 8 + ")";
          for (K.getLengthInBits() + 4 <= oe * 8 && K.put(0, 4); K.getLengthInBits() % 8 != 0; )
            K.putBit(!1);
          for (; !(K.getLengthInBits() >= oe * 8 || (K.put(w, 8), K.getLengthInBits() >= oe * 8)); )
            K.put(b, 8);
          return me(K, G);
        };
        O.addData = function(U, V) {
          V = V || "Byte";
          var W = null;
          switch (V) {
            case "Numeric":
              W = m(U);
              break;
            case "Alphanumeric":
              W = y(U);
              break;
            case "Byte":
              W = v(U);
              break;
            case "Kanji":
              W = S(U);
              break;
            default:
              throw "mode:" + V;
          }
          A.push(W), E = null;
        }, O.isDark = function(U, V) {
          if (U < 0 || p <= U || V < 0 || p <= V)
            throw U + "," + V;
          return k[U][V];
        }, O.getModuleCount = function() {
          return p;
        }, O.make = function() {
          if (x < 1) {
            for (var U = 1; U < 40; U++) {
              for (var V = u.getRSBlocks(U, M), W = f(), G = 0; G < A.length; G++) {
                var K = A[G];
                W.put(K.getMode(), 4), W.put(K.getLength(), r.getLengthInBits(K.getMode(), U)), K.write(W);
              }
              for (var Q = 0, G = 0; G < V.length; G++)
                Q += V[G].dataCount;
              if (W.getLengthInBits() <= Q * 8)
                break;
            }
            x = U;
          }
          N(!1, ne());
        }, O.createTableTag = function(U, V) {
          U = U || 2, V = typeof V > "u" ? U * 4 : V;
          var W = "";
          W += '<table style="', W += " border-width: 0px; border-style: none;", W += " border-collapse: collapse;", W += " padding: 0px; margin: " + V + "px;", W += '">', W += "<tbody>";
          for (var G = 0; G < O.getModuleCount(); G += 1) {
            W += "<tr>";
            for (var K = 0; K < O.getModuleCount(); K += 1)
              W += '<td style="', W += " border-width: 0px; border-style: none;", W += " border-collapse: collapse;", W += " padding: 0px; margin: 0px;", W += " width: " + U + "px;", W += " height: " + U + "px;", W += " background-color: ", W += O.isDark(G, K) ? "#000000" : "#ffffff", W += ";", W += '"/>';
            W += "</tr>";
          }
          return W += "</tbody>", W += "</table>", W;
        }, O.createSvgTag = function(U, V, W, G) {
          var K = {};
          typeof arguments[0] == "object" && (K = arguments[0], U = K.cellSize, V = K.margin, W = K.alt, G = K.title), U = U || 2, V = typeof V > "u" ? U * 4 : V, W = typeof W == "string" ? { text: W } : W || {}, W.text = W.text || null, W.id = W.text ? W.id || "qrcode-description" : null, G = typeof G == "string" ? { text: G } : G || {}, G.text = G.text || null, G.id = G.text ? G.id || "qrcode-title" : null;
          var Q = O.getModuleCount() * U + V * 2, le, oe, ke, Se, ce = "", De;
          for (De = "l" + U + ",0 0," + U + " -" + U + ",0 0,-" + U + "z ", ce += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ce += K.scalable ? "" : ' width="' + Q + 'px" height="' + Q + 'px"', ce += ' viewBox="0 0 ' + Q + " " + Q + '" ', ce += ' preserveAspectRatio="xMinYMin meet"', ce += G.text || W.text ? ' role="img" aria-labelledby="' + Je([G.id, W.id].join(" ").trim()) + '"' : "", ce += ">", ce += G.text ? '<title id="' + Je(G.id) + '">' + Je(G.text) + "</title>" : "", ce += W.text ? '<description id="' + Je(W.id) + '">' + Je(W.text) + "</description>" : "", ce += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ce += '<path d="', ke = 0; ke < O.getModuleCount(); ke += 1)
            for (Se = ke * U + V, le = 0; le < O.getModuleCount(); le += 1)
              O.isDark(ke, le) && (oe = le * U + V, ce += "M" + oe + "," + Se + De);
          return ce += '" stroke="transparent" fill="black"/>', ce += "</svg>", ce;
        }, O.createDataURL = function(U, V) {
          U = U || 2, V = typeof V > "u" ? U * 4 : V;
          var W = O.getModuleCount() * U + V * 2, G = V, K = W - V;
          return j(W, W, function(Q, le) {
            if (G <= Q && Q < K && G <= le && le < K) {
              var oe = Math.floor((Q - G) / U), ke = Math.floor((le - G) / U);
              return O.isDark(ke, oe) ? 0 : 1;
            } else
              return 1;
          });
        }, O.createImgTag = function(U, V, W) {
          U = U || 2, V = typeof V > "u" ? U * 4 : V;
          var G = O.getModuleCount() * U + V * 2, K = "";
          return K += "<img", K += ' src="', K += O.createDataURL(U, V), K += '"', K += ' width="', K += G, K += '"', K += ' height="', K += G, K += '"', W && (K += ' alt="', K += Je(W), K += '"'), K += "/>", K;
        };
        var Je = function(U) {
          for (var V = "", W = 0; W < U.length; W += 1) {
            var G = U.charAt(W);
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
        }, li = function(U) {
          var V = 1;
          U = typeof U > "u" ? V * 2 : U;
          var W = O.getModuleCount() * V + U * 2, G = U, K = W - U, Q, le, oe, ke, Se, ce = {
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
            for (oe = Math.floor((Q - G) / V), ke = Math.floor((Q + 1 - G) / V), le = 0; le < W; le += 1)
              Se = "█", G <= le && le < K && G <= Q && Q < K && O.isDark(oe, Math.floor((le - G) / V)) && (Se = " "), G <= le && le < K && G <= Q + 1 && Q + 1 < K && O.isDark(ke, Math.floor((le - G) / V)) ? Se += " " : Se += "█", je += U < 1 && Q + 1 >= K ? De[Se] : ce[Se];
            je += `
`;
          }
          return W % 2 && U > 0 ? je.substring(0, je.length - W - 1) + Array(W + 1).join("▀") : je.substring(0, je.length - 1);
        };
        return O.createASCII = function(U, V) {
          if (U = U || 1, U < 2)
            return li(V);
          U -= 1, V = typeof V > "u" ? U * 2 : V;
          var W = O.getModuleCount() * U + V * 2, G = V, K = W - V, Q, le, oe, ke, Se = Array(U + 1).join("██"), ce = Array(U + 1).join("  "), De = "", je = "";
          for (Q = 0; Q < W; Q += 1) {
            for (oe = Math.floor((Q - G) / U), je = "", le = 0; le < W; le += 1)
              ke = 1, G <= le && le < K && G <= Q && Q < K && O.isDark(oe, Math.floor((le - G) / U)) && (ke = 0), je += ke ? Se : ce;
            for (oe = 0; oe < U; oe += 1)
              De += je + `
`;
          }
          return De.substring(0, De.length - 1);
        }, O.renderTo2dContext = function(U, V) {
          V = V || 2;
          for (var W = O.getModuleCount(), G = 0; G < W; G++)
            for (var K = 0; K < W; K++)
              U.fillStyle = O.isDark(G, K) ? "black" : "white", U.fillRect(G * V, K * V, V, V);
        }, O;
      };
      a.stringToBytesFuncs = {
        default: function(L) {
          for (var q = [], w = 0; w < L.length; w += 1) {
            var b = L.charCodeAt(w);
            q.push(b & 255);
          }
          return q;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(L, q) {
        var w = (function() {
          for (var x = F(L), M = function() {
            var ie = x.read();
            if (ie == -1) throw "eof";
            return ie;
          }, k = 0, p = {}; ; ) {
            var E = x.read();
            if (E == -1) break;
            var A = M(), O = M(), N = M(), X = String.fromCharCode(E << 8 | A), ne = O << 8 | N;
            p[X] = ne, k += 1;
          }
          if (k != q)
            throw k + " != " + q;
          return p;
        })(), b = 63;
        return function(x) {
          for (var M = [], k = 0; k < x.length; k += 1) {
            var p = x.charCodeAt(k);
            if (p < 128)
              M.push(p);
            else {
              var E = w[x.charAt(k)];
              typeof E == "number" ? (E & 255) == E ? M.push(E) : (M.push(E >>> 8), M.push(E & 255)) : M.push(b);
            }
          }
          return M;
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
        var L = [
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
        ], q = 1335, w = 7973, b = 21522, x = {}, M = function(k) {
          for (var p = 0; k != 0; )
            p += 1, k >>>= 1;
          return p;
        };
        return x.getBCHTypeInfo = function(k) {
          for (var p = k << 10; M(p) - M(q) >= 0; )
            p ^= q << M(p) - M(q);
          return (k << 10 | p) ^ b;
        }, x.getBCHTypeNumber = function(k) {
          for (var p = k << 12; M(p) - M(w) >= 0; )
            p ^= w << M(p) - M(w);
          return k << 12 | p;
        }, x.getPatternPosition = function(k) {
          return L[k - 1];
        }, x.getMaskFunction = function(k) {
          switch (k) {
            case l.PATTERN000:
              return function(p, E) {
                return (p + E) % 2 == 0;
              };
            case l.PATTERN001:
              return function(p, E) {
                return p % 2 == 0;
              };
            case l.PATTERN010:
              return function(p, E) {
                return E % 3 == 0;
              };
            case l.PATTERN011:
              return function(p, E) {
                return (p + E) % 3 == 0;
              };
            case l.PATTERN100:
              return function(p, E) {
                return (Math.floor(p / 2) + Math.floor(E / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(p, E) {
                return p * E % 2 + p * E % 3 == 0;
              };
            case l.PATTERN110:
              return function(p, E) {
                return (p * E % 2 + p * E % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(p, E) {
                return (p * E % 3 + (p + E) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + k;
          }
        }, x.getErrorCorrectPolynomial = function(k) {
          for (var p = d([1], 0), E = 0; E < k; E += 1)
            p = p.multiply(d([1, i.gexp(E)], 0));
          return p;
        }, x.getLengthInBits = function(k, p) {
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
        }, x.getLostPoint = function(k) {
          for (var p = k.getModuleCount(), E = 0, A = 0; A < p; A += 1)
            for (var O = 0; O < p; O += 1) {
              for (var N = 0, X = k.isDark(A, O), ne = -1; ne <= 1; ne += 1)
                if (!(A + ne < 0 || p <= A + ne))
                  for (var ie = -1; ie <= 1; ie += 1)
                    O + ie < 0 || p <= O + ie || ne == 0 && ie == 0 || X == k.isDark(A + ne, O + ie) && (N += 1);
              N > 5 && (E += 3 + N - 5);
            }
          for (var A = 0; A < p - 1; A += 1)
            for (var O = 0; O < p - 1; O += 1) {
              var he = 0;
              k.isDark(A, O) && (he += 1), k.isDark(A + 1, O) && (he += 1), k.isDark(A, O + 1) && (he += 1), k.isDark(A + 1, O + 1) && (he += 1), (he == 0 || he == 4) && (E += 3);
            }
          for (var A = 0; A < p; A += 1)
            for (var O = 0; O < p - 6; O += 1)
              k.isDark(A, O) && !k.isDark(A, O + 1) && k.isDark(A, O + 2) && k.isDark(A, O + 3) && k.isDark(A, O + 4) && !k.isDark(A, O + 5) && k.isDark(A, O + 6) && (E += 40);
          for (var O = 0; O < p; O += 1)
            for (var A = 0; A < p - 6; A += 1)
              k.isDark(A, O) && !k.isDark(A + 1, O) && k.isDark(A + 2, O) && k.isDark(A + 3, O) && k.isDark(A + 4, O) && !k.isDark(A + 5, O) && k.isDark(A + 6, O) && (E += 40);
          for (var Ae = 0, O = 0; O < p; O += 1)
            for (var A = 0; A < p; A += 1)
              k.isDark(A, O) && (Ae += 1);
          var He = Math.abs(100 * Ae / p / p - 50) / 5;
          return E += He * 10, E;
        }, x;
      })(), i = (function() {
        for (var L = new Array(256), q = new Array(256), w = 0; w < 8; w += 1)
          L[w] = 1 << w;
        for (var w = 8; w < 256; w += 1)
          L[w] = L[w - 4] ^ L[w - 5] ^ L[w - 6] ^ L[w - 8];
        for (var w = 0; w < 255; w += 1)
          q[L[w]] = w;
        var b = {};
        return b.glog = function(x) {
          if (x < 1)
            throw "glog(" + x + ")";
          return q[x];
        }, b.gexp = function(x) {
          for (; x < 0; )
            x += 255;
          for (; x >= 256; )
            x -= 255;
          return L[x];
        }, b;
      })();
      function d(L, q) {
        if (typeof L.length > "u")
          throw L.length + "/" + q;
        var w = (function() {
          for (var x = 0; x < L.length && L[x] == 0; )
            x += 1;
          for (var M = new Array(L.length - x + q), k = 0; k < L.length - x; k += 1)
            M[k] = L[k + x];
          return M;
        })(), b = {};
        return b.getAt = function(x) {
          return w[x];
        }, b.getLength = function() {
          return w.length;
        }, b.multiply = function(x) {
          for (var M = new Array(b.getLength() + x.getLength() - 1), k = 0; k < b.getLength(); k += 1)
            for (var p = 0; p < x.getLength(); p += 1)
              M[k + p] ^= i.gexp(i.glog(b.getAt(k)) + i.glog(x.getAt(p)));
          return d(M, 0);
        }, b.mod = function(x) {
          if (b.getLength() - x.getLength() < 0)
            return b;
          for (var M = i.glog(b.getAt(0)) - i.glog(x.getAt(0)), k = new Array(b.getLength()), p = 0; p < b.getLength(); p += 1)
            k[p] = b.getAt(p);
          for (var p = 0; p < x.getLength(); p += 1)
            k[p] ^= i.gexp(i.glog(x.getAt(p)) + M);
          return d(k, 0).mod(x);
        }, b;
      }
      var u = (function() {
        var L = [
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
        ], q = function(x, M) {
          var k = {};
          return k.totalCount = x, k.dataCount = M, k;
        }, w = {}, b = function(x, M) {
          switch (M) {
            case o.L:
              return L[(x - 1) * 4 + 0];
            case o.M:
              return L[(x - 1) * 4 + 1];
            case o.Q:
              return L[(x - 1) * 4 + 2];
            case o.H:
              return L[(x - 1) * 4 + 3];
            default:
              return;
          }
        };
        return w.getRSBlocks = function(x, M) {
          var k = b(x, M);
          if (typeof k > "u")
            throw "bad rs block @ typeNumber:" + x + "/errorCorrectionLevel:" + M;
          for (var p = k.length / 3, E = [], A = 0; A < p; A += 1)
            for (var O = k[A * 3 + 0], N = k[A * 3 + 1], X = k[A * 3 + 2], ne = 0; ne < O; ne += 1)
              E.push(q(N, X));
          return E;
        }, w;
      })(), f = function() {
        var L = [], q = 0, w = {};
        return w.getBuffer = function() {
          return L;
        }, w.getAt = function(b) {
          var x = Math.floor(b / 8);
          return (L[x] >>> 7 - b % 8 & 1) == 1;
        }, w.put = function(b, x) {
          for (var M = 0; M < x; M += 1)
            w.putBit((b >>> x - M - 1 & 1) == 1);
        }, w.getLengthInBits = function() {
          return q;
        }, w.putBit = function(b) {
          var x = Math.floor(q / 8);
          L.length <= x && L.push(0), b && (L[x] |= 128 >>> q % 8), q += 1;
        }, w;
      }, m = function(L) {
        var q = s.MODE_NUMBER, w = L, b = {};
        b.getMode = function() {
          return q;
        }, b.getLength = function(k) {
          return w.length;
        }, b.write = function(k) {
          for (var p = w, E = 0; E + 2 < p.length; )
            k.put(x(p.substring(E, E + 3)), 10), E += 3;
          E < p.length && (p.length - E == 1 ? k.put(x(p.substring(E, E + 1)), 4) : p.length - E == 2 && k.put(x(p.substring(E, E + 2)), 7));
        };
        var x = function(k) {
          for (var p = 0, E = 0; E < k.length; E += 1)
            p = p * 10 + M(k.charAt(E));
          return p;
        }, M = function(k) {
          if ("0" <= k && k <= "9")
            return k.charCodeAt(0) - 48;
          throw "illegal char :" + k;
        };
        return b;
      }, y = function(L) {
        var q = s.MODE_ALPHA_NUM, w = L, b = {};
        b.getMode = function() {
          return q;
        }, b.getLength = function(M) {
          return w.length;
        }, b.write = function(M) {
          for (var k = w, p = 0; p + 1 < k.length; )
            M.put(
              x(k.charAt(p)) * 45 + x(k.charAt(p + 1)),
              11
            ), p += 2;
          p < k.length && M.put(x(k.charAt(p)), 6);
        };
        var x = function(M) {
          if ("0" <= M && M <= "9")
            return M.charCodeAt(0) - 48;
          if ("A" <= M && M <= "Z")
            return M.charCodeAt(0) - 65 + 10;
          switch (M) {
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
              throw "illegal char :" + M;
          }
        };
        return b;
      }, v = function(L) {
        var q = s.MODE_8BIT_BYTE, w = a.stringToBytes(L), b = {};
        return b.getMode = function() {
          return q;
        }, b.getLength = function(x) {
          return w.length;
        }, b.write = function(x) {
          for (var M = 0; M < w.length; M += 1)
            x.put(w[M], 8);
        }, b;
      }, S = function(L) {
        var q = s.MODE_KANJI, w = a.stringToBytesFuncs.SJIS;
        if (!w)
          throw "sjis not supported.";
        (function(M, k) {
          var p = w(M);
          if (p.length != 2 || (p[0] << 8 | p[1]) != k)
            throw "sjis not supported.";
        })("友", 38726);
        var b = w(L), x = {};
        return x.getMode = function() {
          return q;
        }, x.getLength = function(M) {
          return ~~(b.length / 2);
        }, x.write = function(M) {
          for (var k = b, p = 0; p + 1 < k.length; ) {
            var E = (255 & k[p]) << 8 | 255 & k[p + 1];
            if (33088 <= E && E <= 40956)
              E -= 33088;
            else if (57408 <= E && E <= 60351)
              E -= 49472;
            else
              throw "illegal char at " + (p + 1) + "/" + E;
            E = (E >>> 8 & 255) * 192 + (E & 255), M.put(E, 13), p += 2;
          }
          if (p < k.length)
            throw "illegal char at " + (p + 1);
        }, x;
      }, _ = function() {
        var L = [], q = {};
        return q.writeByte = function(w) {
          L.push(w & 255);
        }, q.writeShort = function(w) {
          q.writeByte(w), q.writeByte(w >>> 8);
        }, q.writeBytes = function(w, b, x) {
          b = b || 0, x = x || w.length;
          for (var M = 0; M < x; M += 1)
            q.writeByte(w[M + b]);
        }, q.writeString = function(w) {
          for (var b = 0; b < w.length; b += 1)
            q.writeByte(w.charCodeAt(b));
        }, q.toByteArray = function() {
          return L;
        }, q.toString = function() {
          var w = "";
          w += "[";
          for (var b = 0; b < L.length; b += 1)
            b > 0 && (w += ","), w += L[b];
          return w += "]", w;
        }, q;
      }, R = function() {
        var L = 0, q = 0, w = 0, b = "", x = {}, M = function(p) {
          b += String.fromCharCode(k(p & 63));
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
        return x.writeByte = function(p) {
          for (L = L << 8 | p & 255, q += 8, w += 1; q >= 6; )
            M(L >>> q - 6), q -= 6;
        }, x.flush = function() {
          if (q > 0 && (M(L << 6 - q), L = 0, q = 0), w % 3 != 0)
            for (var p = 3 - w % 3, E = 0; E < p; E += 1)
              b += "=";
        }, x.toString = function() {
          return b;
        }, x;
      }, F = function(L) {
        var q = L, w = 0, b = 0, x = 0, M = {};
        M.read = function() {
          for (; x < 8; ) {
            if (w >= q.length) {
              if (x == 0)
                return -1;
              throw "unexpected end of file./" + x;
            }
            var p = q.charAt(w);
            if (w += 1, p == "=")
              return x = 0, -1;
            if (p.match(/^\s$/))
              continue;
            b = b << 6 | k(p.charCodeAt(0)), x += 6;
          }
          var E = b >>> x - 8 & 255;
          return x -= 8, E;
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
        return M;
      }, J = function(L, q) {
        var w = L, b = q, x = new Array(L * q), M = {};
        M.setPixel = function(A, O, N) {
          x[O * w + A] = N;
        }, M.write = function(A) {
          A.writeString("GIF87a"), A.writeShort(w), A.writeShort(b), A.writeByte(128), A.writeByte(0), A.writeByte(0), A.writeByte(0), A.writeByte(0), A.writeByte(0), A.writeByte(255), A.writeByte(255), A.writeByte(255), A.writeString(","), A.writeShort(0), A.writeShort(0), A.writeShort(w), A.writeShort(b), A.writeByte(0);
          var O = 2, N = p(O);
          A.writeByte(O);
          for (var X = 0; N.length - X > 255; )
            A.writeByte(255), A.writeBytes(N, X, 255), X += 255;
          A.writeByte(N.length - X), A.writeBytes(N, X, N.length - X), A.writeByte(0), A.writeString(";");
        };
        var k = function(A) {
          var O = A, N = 0, X = 0, ne = {};
          return ne.write = function(ie, he) {
            if (ie >>> he)
              throw "length over";
            for (; N + he >= 8; )
              O.writeByte(255 & (ie << N | X)), he -= 8 - N, ie >>>= 8 - N, X = 0, N = 0;
            X = ie << N | X, N = N + he;
          }, ne.flush = function() {
            N > 0 && O.writeByte(X);
          }, ne;
        }, p = function(A) {
          for (var O = 1 << A, N = (1 << A) + 1, X = A + 1, ne = E(), ie = 0; ie < O; ie += 1)
            ne.add(String.fromCharCode(ie));
          ne.add(String.fromCharCode(O)), ne.add(String.fromCharCode(N));
          var he = _(), Ae = k(he);
          Ae.write(O, X);
          var He = 0, ve = String.fromCharCode(x[He]);
          for (He += 1; He < x.length; ) {
            var me = String.fromCharCode(x[He]);
            He += 1, ne.contains(ve + me) ? ve = ve + me : (Ae.write(ne.indexOf(ve), X), ne.size() < 4095 && (ne.size() == 1 << X && (X += 1), ne.add(ve + me)), ve = me);
          }
          return Ae.write(ne.indexOf(ve), X), Ae.write(N, X), Ae.flush(), he.toByteArray();
        }, E = function() {
          var A = {}, O = 0, N = {};
          return N.add = function(X) {
            if (N.contains(X))
              throw "dup key:" + X;
            A[X] = O, O += 1;
          }, N.size = function() {
            return O;
          }, N.indexOf = function(X) {
            return A[X];
          }, N.contains = function(X) {
            return typeof A[X] < "u";
          }, N;
        };
        return M;
      }, j = function(L, q, w) {
        for (var b = J(L, q), x = 0; x < q; x += 1)
          for (var M = 0; M < L; M += 1)
            b.setPixel(M, x, w(M, x));
        var k = _();
        b.write(k);
        for (var p = R(), E = k.toByteArray(), A = 0; A < E.length; A += 1)
          p.writeByte(E[A]);
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
var U5 = H5();
const z5 = /* @__PURE__ */ W5(U5), V5 = ["width", "height", "viewBox"], G5 = ["width", "height"], K5 = ["d"], Y5 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = T(() => {
      const a = z5(0, "M");
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
      }, null, 8, G5),
      g("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, K5)
    ], 8, V5));
  }
}, _8 = /* @__PURE__ */ Y(Y5, [["__scopeId", "data-v-489f0852"]]), J5 = {
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
}, E8 = /* @__PURE__ */ Y(J5, [["__scopeId", "data-v-47e67f04"]]);
function A8(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const C8 = wi(() => import("./VoiceFigure-DIobKAIl.js").then((e) => e.V)), O8 = "1.2.0", T8 = "3.5";
export {
  Fd as $,
  _e as A,
  Ce as B,
  sa as C,
  at as D,
  N$ as E,
  qb as F,
  _x as G,
  R$ as H,
  wb as I,
  Gb as J,
  At as K,
  e4 as L,
  Bs as M,
  Qb as N,
  Vb as O,
  aa as P,
  Xx as Q,
  ox as R,
  Ln as S,
  a$ as T,
  Z4 as U,
  Ee as V,
  zn as W,
  J4 as X,
  Y4 as Y,
  qd as Z,
  Y as _,
  F4 as a,
  w$ as a$,
  Zb as a0,
  lx as a1,
  rx as a2,
  Ne as a3,
  yx as a4,
  vx as a5,
  St as a6,
  ix as a7,
  Ox as a8,
  O4 as a9,
  f$ as aA,
  Yx as aB,
  cb as aC,
  Bx as aD,
  Lx as aE,
  D$ as aF,
  Wr as aG,
  n$ as aH,
  fn as aI,
  N4 as aJ,
  I4 as aK,
  _$ as aL,
  hn as aM,
  O$ as aN,
  Sx as aO,
  Jx as aP,
  Zx as aQ,
  Kx as aR,
  an as aS,
  xt as aT,
  T4 as aU,
  Q0 as aV,
  Vx as aW,
  ax as aX,
  qr as aY,
  Dt as aZ,
  Ft as a_,
  k$ as aa,
  A$ as ab,
  P4 as ac,
  X4 as ad,
  Q4 as ae,
  px as af,
  gx as ag,
  bx as ah,
  z4 as ai,
  Uo as aj,
  cx as ak,
  Cx as al,
  F$ as am,
  Wx as an,
  qx as ao,
  Px as ap,
  wx as aq,
  hx as ar,
  fx as as,
  mx as at,
  t$ as au,
  Ax as av,
  Tx as aw,
  U$ as ax,
  Yt as ay,
  Rx as az,
  uw as b,
  H$ as b$,
  Nb as b0,
  C$ as b1,
  l$ as b2,
  o$ as b3,
  $y as b4,
  Er as b5,
  v$ as b6,
  Ex as b7,
  ra as b8,
  rt as b9,
  i$ as bA,
  m$ as bB,
  ut as bC,
  s$ as bD,
  p$ as bE,
  Ix as bF,
  Hx as bG,
  Nx as bH,
  Te as bI,
  Mx as bJ,
  g$ as bK,
  X$ as bL,
  Q$ as bM,
  A4 as bN,
  ny as bO,
  xx as bP,
  c$ as bQ,
  W4 as bR,
  q$ as bS,
  r$ as bT,
  u$ as bU,
  d$ as bV,
  kx as bW,
  ub as bX,
  $x as bY,
  jx as bZ,
  P$ as b_,
  h$ as ba,
  Aa as bb,
  Xl as bc,
  V$ as bd,
  Y$ as be,
  e$ as bf,
  S$ as bg,
  C4 as bh,
  Fx as bi,
  G$ as bj,
  ux as bk,
  dx as bl,
  G4 as bm,
  sx as bn,
  L4 as bo,
  $$ as bp,
  H4 as bq,
  U4 as br,
  K4 as bs,
  zx as bt,
  K0 as bu,
  T$ as bv,
  zb as bw,
  V4 as bx,
  D4 as by,
  Ux as bz,
  xy as c,
  Nt as c$,
  B4 as c0,
  R4 as c1,
  Dx as c2,
  J$ as c3,
  Ps as c4,
  Z$ as c5,
  ai as c6,
  M$ as c7,
  tx as c8,
  ex as c9,
  ye as cA,
  m8 as cB,
  c4 as cC,
  O8 as cD,
  T8 as cE,
  v4 as cF,
  g8 as cG,
  ns as cH,
  $4 as cI,
  Iv as cJ,
  Mt as cK,
  us as cL,
  ea as cM,
  f4 as cN,
  y4 as cO,
  jc as cP,
  Jg as cQ,
  $8 as cR,
  m4 as cS,
  _8 as cT,
  ar as cU,
  fu as cV,
  d8 as cW,
  ef as cX,
  o4 as cY,
  S4 as cZ,
  rk as c_,
  X0 as ca,
  j4 as cb,
  Hb as cc,
  Gx as cd,
  Ts as ce,
  sb as cf,
  Qx as cg,
  Jt as ch,
  Lt as ci,
  u4 as cj,
  h8 as ck,
  de as cl,
  Md as cm,
  Td as cn,
  xs as co,
  Rm as cp,
  Tl as cq,
  M8 as cr,
  E4 as cs,
  Lm as ct,
  Qp as cu,
  Qt as cv,
  e8 as cw,
  X5 as cx,
  $t as cy,
  ed as cz,
  ze as d,
  t4 as d$,
  b4 as d0,
  _t as d1,
  pt as d2,
  Cp as d3,
  wu as d4,
  k4 as d5,
  l4 as d6,
  Pt as d7,
  p8 as d8,
  S8 as d9,
  $h as dA,
  t8 as dB,
  a4 as dC,
  y8 as dD,
  Ev as dE,
  Cw as dF,
  r4 as dG,
  g4 as dH,
  o8 as dI,
  r8 as dJ,
  Fe as dK,
  d4 as dL,
  h4 as dM,
  qc as dN,
  mr as dO,
  s8 as dP,
  Vi as dQ,
  s4 as dR,
  n4 as dS,
  kl as dT,
  xl as dU,
  Tu as dV,
  i4 as dW,
  ct as dX,
  A8 as dY,
  Ow as dZ,
  Q5 as d_,
  qs as da,
  nd as db,
  kt as dc,
  w4 as dd,
  ia as de,
  C8 as df,
  E8 as dg,
  As as dh,
  l8 as di,
  ps as dj,
  H1 as dk,
  ko as dl,
  ir as dm,
  Cu as dn,
  k8 as dp,
  w8 as dq,
  ys as dr,
  Au as ds,
  ml as dt,
  p4 as du,
  x8 as dv,
  _4 as dw,
  M4 as dx,
  x4 as dy,
  n8 as dz,
  nx as e,
  a8 as e0,
  f8 as e1,
  Ew as e2,
  v8 as e3,
  Bg as e4,
  vl as e5,
  gk as e6,
  gs as e7,
  i8 as e8,
  Ua as e9,
  c8 as ea,
  u8 as eb,
  We as ec,
  b8 as ed,
  Ou as ee,
  G0 as f,
  z$ as g,
  sn as h,
  I$ as i,
  K$ as j,
  B$ as k,
  x$ as l,
  pw as m,
  Ls as n,
  E$ as o,
  q4 as p,
  L$ as q,
  ti as r,
  ni as s,
  Me as t,
  Sy as u,
  y$ as v,
  W$ as w,
  b$ as x,
  pn as y,
  j$ as z
};
