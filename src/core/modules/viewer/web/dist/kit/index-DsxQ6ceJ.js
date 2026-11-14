import { openBlock as r, createElementBlock as d, normalizeStyle as ge, unref as I, renderSlot as ae, createElementVNode as h, normalizeClass as Y, Fragment as B, renderList as X, defineComponent as _u, Comment as Mu, h as ba, cloneVNode as Cu, createBlock as P, withCtx as q, createVNode as A, toDisplayString as v, createCommentVNode as k, ref as _, inject as Me, watch as me, onMounted as Ce, onBeforeUnmount as st, reactive as Qt, shallowRef as at, onUnmounted as Le, useAttrs as ka, computed as x, resolveDynamicComponent as Qe, mergeProps as je, useId as Fs, resolveDirective as Au, withDirectives as _e, createTextVNode as U, Teleport as Sn, nextTick as Fe, Transition as Xt, withModifiers as ke, createApp as Eu, shallowReactive as Ou, withKeys as Ot, createSlots as wa, onScopeDispose as $a, useModel as Gt, mergeModels as Tt, toRef as Ia, vModelText as Ke, resolveComponent as Tu, provide as Ws, onErrorCaptured as Iu, TransitionGroup as Hs, isRef as Bo, getCurrentInstance as Bu, useSlots as Ru, vShow as zs, getCurrentScope as Yl, normalizeProps as ps, guardReactiveProps as Ql, vModelSelect as It, defineAsyncComponent as Lu } from "vue";
function Xl(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const H = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, Nu = 1600, qu = {
  __name: "Shimmer",
  setup(e) {
    const t = Xl(Nu);
    return (n, a) => (r(), d("span", {
      class: "shimmer",
      style: ge(I(t))
    }, null, 4));
  }
}, rn = /* @__PURE__ */ H(qu, [["__scopeId", "data-v-6c018b03"]]), Du = { class: "skeleton-line" }, Pu = 2e3, ju = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = Xl(Pu);
    return (n, a) => (r(), d("span", Du, [
      ae(n.$slots, "default", {}, void 0, !0),
      h("span", {
        class: Y(["bars", { faded: e.filled }])
      }, [
        (r(!0), d(B, null, X(e.bars, (s) => (r(), d("span", {
          key: s.width,
          class: Y(["bar", { still: e.still }]),
          style: ge({ ...I(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, xt = /* @__PURE__ */ H(ju, [["__scopeId", "data-v-484fe8a0"]]), Jt = _u({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Mu);
      return a.length !== 1 ? ba(B, { key: n }, a) : a[0].key == null ? Cu(a[0], { key: n }) : a[0];
    };
  }
}), Fu = ["aria-label"], Wu = ["aria-label"], Hu = ["aria-label"], zu = ["aria-label"], Uu = ["aria-label"], Vu = ["aria-label"], Gu = ["aria-label"], Ku = {
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
    ], l = ["94%", "88%", "91%", "62%"].map((u) => ({ width: u, height: 10 })), i = [
      { width: "110px", height: 12 },
      { width: "86%", height: 24 },
      { width: "52%", height: 24 }
    ];
    return (u, c) => (r(), P(Jt, { value: e.shape }, {
      messages: q(() => [
        h("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(), d(B, null, X(t, (f) => A(rn, {
            key: f.id,
            class: Y(["skeleton-message", { mine: f.mine }]),
            style: ge({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, Fu)
      ]),
      older: q(() => [
        h("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(B, null, X(t.slice(0, 3), (f) => (r(), P(rn, {
            key: f.id,
            class: Y(["skeleton-message", { mine: f.mine }]),
            style: ge({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, Wu)
      ]),
      cards: q(() => [
        h("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(B, null, X(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (r(), d(B, null, X(n, (m) => A(xt, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Hu)
      ]),
      file: q(() => [
        h("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(B, null, X(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-file"
          }, [
            A(xt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (r(), d(B, null, X(s, (m) => A(xt, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, zu)
      ]),
      page: q(() => [
        h("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          A(xt, {
            class: "skeleton-heading",
            bars: i
          }),
          (r(!0), d(B, null, X(e.count, (f) => (r(), P(xt, {
            key: f,
            bars: I(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Uu)
      ]),
      text: q(() => [
        h("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(B, null, X(e.count, (f) => (r(), P(xt, {
            key: f,
            bars: I(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Vu)
      ]),
      default: q(() => [
        h("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(B, null, X(e.count, (f) => (r(), P(xt, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Gu)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Ze = /* @__PURE__ */ H(Ku, [["__scopeId", "data-v-ef519c5f"]]), Yu = {
  key: 1,
  class: "empty-state titled"
}, Qu = { class: "empty-state-title" }, Xu = { class: "empty-state-text" }, Ju = {
  key: 2,
  class: "empty-state"
}, Zu = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (r(), P(Ze, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (r(), d("div", Yu, [
      h("p", Qu, v(e.title), 1),
      h("p", Xu, [
        ae(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (r(), d("p", Ju, [
      ae(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, wt = /* @__PURE__ */ H(Zu, [["__scopeId", "data-v-b27e89b0"]]), ec = { class: "fold-group" }, tc = ["aria-expanded"], nc = { class: "fold-label" }, ac = {
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
    return (a, s) => (r(), d("div", ec, [
      h("button", {
        type: "button",
        class: Y(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        h("span", nc, v(e.label), 1),
        e.count !== "" ? (r(), d("span", ac, v(e.count), 1)) : k("", !0),
        h("span", {
          class: Y(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, tc),
      e.open ? ae(a.$slots, "default", {}, void 0, !0, 0) : k("", !0)
    ]));
  }
}, aC = /* @__PURE__ */ H(sc, [["__scopeId", "data-v-9ef1865c"]]), oc = 150, lc = () => oc;
function Us(e, t, n = lc(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function Jl(e, t, n) {
  if (!e) return n(t);
  const { target: a, fields: s } = e, o = Object.fromEntries(Object.keys(s).map((u) => [u, a[u]])), l = () => Object.assign(a, o);
  Object.assign(a, s);
  let i = !1;
  try {
    const u = await n(t);
    return i = u.ok, u;
  } finally {
    i || l();
  }
}
const ic = 50, Ro = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function sC(e) {
  const t = ot().sources.find((n) => n.key === e);
  return t ? vs(t.read, t.events) : vs("", []);
}
function Zl(e, t, n, a, s = () => !1) {
  const o = _([]), l = _(null), i = _(""), u = _(!1), c = performance.now(), f = _(!1), m = _(""), p = _(null), y = /* @__PURE__ */ new Set();
  let b = null;
  function w(g) {
    return s() ? (y.add(g), b ?? (b = new Promise((S) => setTimeout(() => S(M()), ic)))) : C(g);
  }
  async function M() {
    const g = new Set(y);
    y.clear(), b = null;
    const S = W, O = await t({ ids: [...g].join(","), limit: g.size });
    if (S !== W) return;
    if (!O.ok) return E();
    const L = new Map(O.value.rows.map((F) => [F.id, F]));
    o.value = o.value.flatMap((F) => g.has(F.id) ? L.has(F.id) ? [L.get(F.id)] : [] : [F]);
  }
  async function C(g) {
    const S = W, O = await t({ "before-id": g + 1, limit: 1 });
    if (S !== W) return;
    if (!O.ok) return E();
    const L = O.value.rows.find((F) => F.id === g);
    o.value = L ? o.value.map((F) => F.id === g ? L : F) : o.value.filter((F) => F.id !== g);
  }
  async function T(g) {
    if (a() && String((g == null ? void 0 : g.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((Z) => Z.id !== g.row_id));
    if (a() && (g != null && g.row_id) && !String(g.event ?? "").endsWith(".create") && o.value.some((Z) => Z.id === g.row_id)) return w(g.row_id);
    if (!(a() && o.value.length && String((g == null ? void 0 : g.event) ?? "").endsWith(".create"))) return E();
    const O = Math.max(...o.value.map((Z) => Z.id)), L = W, F = await t({ "after-id": O });
    if (L !== W) return;
    if (!F.ok) return E();
    const V = new Set(o.value.map((Z) => Z.id));
    o.value = [...F.value.rows.filter((Z) => !V.has(Z.id)), ...o.value];
  }
  async function z() {
    if (!f.value || !o.value.length) return !1;
    const g = W, S = Math.min(...o.value.map((F) => F.id)), O = await t({ "before-id": S });
    if (g !== W) return !1;
    if (!O.ok || !O.value.rows.length) return f.value = !1;
    f.value = Ro(O.value, n());
    const L = new Set(o.value.map((F) => F.id));
    return o.value = [...o.value, ...O.value.rows.filter((F) => !L.has(F.id))], !0;
  }
  let W = 0;
  function R(g, S) {
    var F, V;
    const O = g.ok ? e.shared ? [g.value] : ((F = g.value) == null ? void 0 : F.rows) ?? [] : [];
    g.ok && (o.value = S(O)), l.value = g.ok ? g.value : null;
    const L = O.length ? Math.min(...O.map((Z) => Z.id)) : 0;
    g.ok && ((V = g.value) != null && V.rows) && !o.value.some((Z) => Z.id < L) && (f.value = !e.shared && Ro(g.value, n())), i.value = g.ok ? "" : g.error, Us(c, () => u.value = !0);
  }
  async function G(g) {
    const S = ++W, O = await t({});
    S === W && R(O, g);
  }
  const D = (g) => {
    if (!a() || !g.length) return g;
    const S = Math.min(...g.map((L) => L.id)), O = Math.max(...g.map((L) => L.id));
    return [...o.value.filter((L) => L.id > O), ...g, ...o.value.filter((L) => L.id < S)];
  }, E = () => G(D), N = (g) => R(g, D), j = () => G((g) => g);
  async function $(g, S = null) {
    const O = await Jl(S && { target: o, fields: { value: S(o.value) } }, g, e.run);
    return m.value = O.ok ? "" : O.error, p.value = O.ok ? O.value : null, await E(), O;
  }
  return { rows: o, listing: l, failure: i, loaded: u, more: f, load: E, loadLatest: j, older: z, act: $, actionFailure: m, answer: p, context: e, heard: T, showFirst: N, pageSize: n };
}
const rc = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function vs(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = ot(), l = Zl(s, (u) => s.read(s.shared && !Object.keys(u).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${rc(u)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const uc = 2e3;
function Vs(e, t, n = uc) {
  let a = null, s = !1, o = !1, l = !1;
  const i = Me(Re, null), u = () => {
    var w;
    return ((w = i == null ? void 0 : i.visible) == null ? void 0 : w.value) === !1;
  }, c = () => document.hidden || u(), f = async (w) => {
    o = !0;
    try {
      await w();
    } catch {
    } finally {
      o = !1;
    }
  }, m = () => f(async () => t() && await e()), p = () => {
    s || c() || (a = setTimeout(
      async () => {
        c() || await m(), p();
      },
      typeof n == "function" ? n() : n
    ));
  }, y = async () => {
    l = !0, await f(e), p();
  }, b = async () => {
    if (!(s || c() || o)) {
      if (clearTimeout(a), !l) return y();
      await m(), p();
    }
  };
  me(() => {
    var w;
    return (w = i == null ? void 0 : i.visible) == null ? void 0 : w.value;
  }, b), Ce(async () => {
    document.addEventListener("visibilitychange", b), u() || await y();
  }), st(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", b);
  });
}
const ei = typeof document < "u" && document.documentElement.classList.contains("phone"), ti = 120;
var Gl;
const Ba = globalThis[Gl = Symbol.for("journal.pressed")] ?? (globalThis[Gl] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function cc(e = 0) {
  const t = Ba.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, Ba.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, Ba.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function gs(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function ni(e = window) {
  if (!gs(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    gs(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const ys = "journal.stale-build-reload", dc = 'script[type="module"][src*="/assets/index-"]', Lo = (e) => {
  var t;
  return ((t = e.querySelector(dc)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function fc(e = document, t = (a, s) => Ee.quietRead(a, s), n = () => ni(window)) {
  const a = Lo(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Lo(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let Ra = "";
function mc(e, t = () => ni(window)) {
  if (!e) return !1;
  const n = !!Ra && Ra !== e;
  return Ra = e, n && t(), n;
}
const hc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function pc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(ys) === e.message) return !1;
    t.setItem(ys, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function vc(e = window.sessionStorage) {
  try {
    e.removeItem(ys);
  } catch {
    return;
  }
}
const gc = 2e3, yc = 3e4, Ye = Qt({ starting: !1, external: !1, late: !1, offline: !1 }), Gs = () => Ye.starting, bc = 3;
let qn = 0, bs = 0, ai = 0, si = [];
async function kc() {
  try {
    const e = await Ee.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ye.external };
  }
}
let No = null;
const wc = () => No ?? (No = kc().finally(() => No = null));
function $c() {
  clearTimeout(bs), clearTimeout(ai), bs = 0, Object.assign(Ye, { starting: !1, external: !1, late: !1, offline: !1 }), si.splice(0).forEach((e) => e()), fc();
}
async function xc() {
  Ye.offline = !navigator.onLine;
  const e = await wc();
  if (Ye.external = e.updating, qn = !e.restarting && !e.updating && e.reachable ? qn + 1 : 0, qn < bc) return;
  qn = 0, (!mc(e.started_at) || gs()) && $c();
}
function oi() {
  bs = setTimeout(async () => {
    await xc(), Ye.starting && oi();
  }, gc);
}
function qo() {
  Ye.starting || (Ye.starting = !0, Ye.offline = !navigator.onLine, oi(), ai = setTimeout(() => Ye.late = !0, yc));
}
const li = () => Ye.starting ? new Promise((e) => si.push(e)) : Promise.resolve();
function Ks(e, t, n = 0) {
  let a = n, s = null, o = !1, l = !1;
  const i = () => {
    o = !1, a = Date.now(), l && (l = !1, c());
  }, u = () => {
    s = null;
    const f = e();
    a = Date.now(), f instanceof Promise && (o = !0, f.catch(() => {
    }).finally(i));
  }, c = () => {
    if (o) {
      l = !0;
      return;
    }
    if (s) return;
    const f = t - (Date.now() - a);
    f <= 0 ? u() : s = setTimeout(u, f);
  };
  return c.cancel = () => {
    clearTimeout(s), s = null, l = !1;
  }, c;
}
function Sc(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class _c {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = Ks(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = Sc(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const mt = "viewer.shell";
function Mc(e = typeof document < "u" ? document.visibilityState : "visible") {
  return e === "hidden";
}
const Dn = 2e4, Cc = 4, Do = "/api/read-lines", Ac = 5e3, Ec = 403, Po = "/api/repeated-lines", Oc = 10, Tc = 2e3, Ic = 3e5, oC = 6e5, Bc = "X-Journal-Window-Hidden", Pn = 6, Rc = 500, Lc = "/journal/summary", jo = "/api/server-state", Nc = 2e4, jn = ei ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, qc = (e) => e.split("?")[0].endsWith(Lc), ks = (e, t) => Object.assign(new Error(t), { status: e });
async function Dc(e, t, n = ks) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const Pc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), jc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), Fo = (e) => e.split(" ").slice(0, 2).join(" "), it = "read", Ft = "write", Fc = "stream";
class Wc {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = Pn;
  }
  // what is in flight, of one window or of all: each with its window, line, kind (read, write or stream), address and started_at
  inFlight(t = null) {
    return [...this.flights].filter((n) => t === null || n.window === t).map((n) => ({ ...n }));
  }
  // how many requests a window has sent, by term and verb
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = Fo(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one term and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, u]) => o - u < Tc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < Oc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const i = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(Po, { method: "POST", headers: { ...jn, "Content-Type": "application/json" }, body: i }, [{ window: mt, line: Po, kind: Ft }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = cc(n ? ti : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = { ...n, headers: { ...n.headers || {}, [Bc]: Mc() ? "1" : "0" } }, i = s ? { ...l, signal: jc(n.signal, s) } : l;
    try {
      return await fetch(t, a[0].kind === Ft ? { ...i, priority: "high" } : i);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up; a read is tried once more at once first, since the
  // server closes a connection left idle and the read may have gone out on it; a write is never sent twice
  async sent(t, n, a, s = Dn) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      if (!(o instanceof TypeError)) throw o;
      if ((n.method || "GET") === "GET")
        try {
          return await this.out(t, n, a, s);
        } catch (l) {
          throw l instanceof TypeError && qo(), l;
        }
      throw qo(), o;
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
    return this.out(Do, { headers: jn }, [{ window: mt, line: Do, kind: it }], Ac).then(async (t) => {
      if (t.status === Ec) return /* @__PURE__ */ new Set();
      if (!t.ok) throw ks(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new _c(
      (l, i) => n(l, s ? this.readAttribution(i) : void 0),
      () => this.joinedReads.delete(t),
      (l, i) => {
        s && this.trackRead(s, l, i);
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = Fo(n.join(" ")), i = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
    a === "asked" && s.callers > 1 && (i.joined_callers += 1), a === "sent" && s.trailingOf && (i.trailing_reads += 1), o.set(l, i), this.joinCounts.set(t, o), !(a !== "answered" || !this.recording) && (this.readReceipts.push(this.readAttribution(s)), this.receiptTimer ?? (this.receiptTimer = setTimeout(() => this.flushReadReceipts(), 50)));
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
      this.tries = Pn;
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
    const i = a instanceof FormData, u = { method: t, headers: { ...jn, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: Pc(a) }, c = s || (i ? Ic : Dn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, u, [{ window: mt, line: n, kind: it }], c)) : await this.sent(n, u, [{ window: mt, line: n, kind: Ft }], c);
    } catch (f) {
      if (t !== "GET" || !(f instanceof TypeError) || o <= 1) throw f;
      return await new Promise((m) => setTimeout(m, Rc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = Pn, l = {}) {
    this.watcher("sent", t, n, a);
    const i = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return Dc(i, `${i.status} ${i.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: mt, line: t, kind: it }], Dn)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: jn });
    if (!n.ok) throw ks(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, Pn, o).then((i) => (this.written(n), i)) : Gs() && !qc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: mt, line: t, kind: Fc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(jo, { cache: "no-store" }, [{ window: mt, line: jo, kind: it }], Nc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = mt, line: s = t, limit: o = Dn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? it : Ft;
    return l === Ft ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const La = Symbol.for("journal.transport"), Ee = globalThis[La] ?? (globalThis[La] = new Wc());
class ii {
  constructor() {
    this.following = at([]), this.held = /* @__PURE__ */ new Set();
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
    Ee.readsOutdated();
    for (const n of this.follows)
      n.patterns.some((a) => Ys(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Ys(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const ri = (e, t) => !e.row_id || t.has(e.row_id), Hc = (e, t, n) => {
  var a;
  return !e.row_id || (((a = e.changed_ids) == null ? void 0 : a[t]) ?? []).some((s) => n.has(s));
}, zc = (e, t, n) => {
  var a, s;
  return !((s = (a = e.changed_ids) == null ? void 0 : a[t]) != null && s.length) || e.changed_ids[t].some((o) => n.has(o));
}, Uc = 50, Vc = "refresh", Gc = 1e3, Kc = 3e4, Yc = "requested", Qc = "after_window", Xc = 50, Fn = ".*", Jc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function Zc(e) {
  const t = {}, n = Qt({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let u = {}, c = 0, f = 0, m = !1;
  const p = ($) => u[$] ?? u[`${$.slice(0, $.lastIndexOf("."))}.*`] ?? {};
  function y($) {
    const g = () => p($), S = _(void 0), O = Zl(e, async (L) => {
      const F = await M($, L);
      return F.ok && !Object.keys(L).length && (S.value = F.value), F;
    }, () => g().page_size || Xc, () => !!g().page_size, () => !!g().reads_ids);
    return t[$] = { ...O, data: S, readAt: 0 };
  }
  const b = new Proxy({}, { get: ($, g) => typeof g != "string" || g.startsWith("__v") ? void 0 : t[g] ?? y(g) }), w = ($) => (u[$].loading !== Yc || $.endsWith(Fn)) && (!u[$].tab || u[$].tab === n.tab);
  function M($, g = {}) {
    return new Promise((S) => {
      a.push({ name: $, flags: g, resolve: S }), a.length === 1 && setTimeout(C);
    });
  }
  async function C() {
    const $ = /* @__PURE__ */ new Map(), g = a.splice(0).filter((L) => {
      const F = JSON.stringify(L.flags);
      return $.has(L.name) || $.set(L.name, F), $.get(L.name) === F ? !0 : (a.push(L), !1);
    });
    a.length && setTimeout(C);
    const S = Object.fromEntries(g.flatMap(({ name: L, flags: F }) => Object.entries(F).map(([V, Z]) => [`${L}.${V}`, Z]))), O = await e.readKeys({ only: [...new Set(g.map(({ name: L }) => L))], state: { ...n, ...S } });
    g.forEach(({ name: L, resolve: F }) => F(O.ok ? O.value.keys[L] : O));
  }
  async function T($) {
    var L;
    const g = ++f;
    ($.length ? $ : Object.keys(u).filter((F) => !F.endsWith(Fn) && u[F].loading === "first" && w(F))).forEach((F) => l[F] = g);
    const O = await e.readKeys({ only: $, state: { ...n } });
    if (!O.ok) {
      if (O.failure === "cancelled") return !1;
      const F = ($.length ? $ : Object.keys(t)).filter((Z) => (l[Z] ?? 0) <= g);
      F.forEach((Z) => {
        b[Z].readAt = Date.now(), O.failure === "unreachable" ? i.add(Z) : i.delete(Z), b[Z].showFirst(O);
      });
      const V = O.failure === "unreachable" && ((L = e.waitForServer) == null ? void 0 : L.call(e));
      return V && V.then(() => {
        if (m) return;
        const Z = F.filter((le) => l[le] === g);
        (Z.length || !$.length && !F.length && f === g) && T(Z);
      }), !1;
    }
    return N(O.value.declared), Object.entries(O.value.keys).forEach(([F, V]) => {
      (l[F] ?? 0) > g || (l[F] = g, b[F].readAt = Date.now(), i.delete(F), V.ok && (b[F].data.value = V.value), b[F].showFirst(V));
    }), !0;
  }
  function z($) {
    const g = Jc($);
    return g.length ? (g.forEach((S) => o.names.add(S)), o.answer ?? (o.answer = new Promise((S) => setTimeout(() => {
      const O = [...o.names];
      o.names.clear(), o.answer = null, S(T(O));
    })))) : T([]);
  }
  function W($) {
    $.forEach((g) => s.add(g)), clearTimeout(c), c = setTimeout(() => {
      const g = [...s];
      s.clear(), g.length && z(g);
    }, Uc);
  }
  const R = ($) => $.endsWith(Fn) ? Object.keys(t).filter((g) => g.startsWith($.slice(0, -1)) && t[g].readAt) : [$], G = ($, g) => {
    const S = p($).event_column;
    return !S || zc(g, S, /* @__PURE__ */ new Set([Number($.slice($.lastIndexOf(".") + 1))]));
  }, D = ($) => (u[$] ?? u[`${$.split(".")[0]}.*`]).reload_seconds;
  function E($) {
    const g = Object.keys(u).filter((O) => $.event === Vc || u[O].events.some((L) => Ys(L, $.event)));
    g.filter((O) => u[O].page_size).forEach((O) => b[O].heard($));
    const S = g.filter((O) => !u[O].page_size);
    S.filter((O) => !w(O)).forEach((O) => b[O].readAt = 0), W(S.filter(w).flatMap(R).filter((O) => G(O, $)));
  }
  function N($) {
    if (Object.keys(u).length) return;
    u = $;
    const g = [...new Set(Object.values($).flatMap((O) => O.events))];
    g.length && e.follow(g, E);
    const S = Object.keys($).filter((O) => $[O].loading === Qc);
    S.length && T(S);
  }
  me(() => n.tab, () => {
    const $ = Object.keys(u).filter((g) => !g.endsWith(Fn) && w(g) && !b[g].readAt);
    $.length && T($);
  }), Le(() => {
    m = !0, clearTimeout(c);
  });
  function j() {
    const $ = Date.now(), g = Object.keys(u).filter((S) => u[S].reload_seconds > 0 && w(S)).flatMap(R).filter((S) => $ - b[S].readAt >= (i.has(S) ? Math.min(D(S) * 1e3, Kc) : D(S) * 1e3));
    g.length && W(g);
  }
  return Vs(j, () => e.visible.value, Gc), queueMicrotask(() => T([])), { props: b, state: n, reload: z, readKey: M };
}
const ed = Symbol("open-view"), Re = Symbol.for("journal.window-context"), ui = Symbol("dock-card"), ci = Symbol.for("journal.inspector-actions");
function td(e) {
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
function ot() {
  const e = Me(Re, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return td(e);
}
const nd = (e, t) => e(ui, t), lC = () => Me(ui), ws = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Wo = {
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
  agent: ws,
  worker: ws,
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
}, ad = ["data-icon", "stroke-width", "innerHTML"], ie = {
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
      agent: ws,
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
    return (o, l) => (r(), d("svg", {
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
    }, null, 12, ad));
  }
}, sd = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: "spinner",
      style: ge({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, od = /* @__PURE__ */ H(sd, [["__scopeId", "data-v-eb453d6f"]]), ld = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = ka(), a = x(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = _(!1), o = x(() => t.busy || s.value), l = Me(Re, null), i = x(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function u(c) {
      const f = [n.onClick].flat().filter(Boolean).map((p) => p(c)).filter((p) => p instanceof Promise);
      if (!f.length) return;
      const m = setTimeout(() => s.value = !0, ti);
      try {
        await Promise.all(f);
      } finally {
        clearTimeout(m), s.value = !1;
      }
    }
    return (c, f) => (r(), P(Qe(e.href ? "a" : "button"), je(a.value, {
      type: e.href ? void 0 : I(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: i.value,
      onClick: u
    }), {
      default: q(() => [
        h("span", {
          class: Y(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (r(), P(ie, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : k("", !0),
          ae(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (r(), P(od, {
          key: 0,
          class: "btn-spinner"
        })) : k("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ve = /* @__PURE__ */ H(ld, [["__scopeId", "data-v-ededdadf"]]), id = ["aria-checked", "aria-haspopup", "onClick"], rd = {
  key: 0,
  class: "segmented-dot"
}, ud = {
  key: 1,
  class: "segmented-note"
}, cd = {
  key: 2,
  class: "segmented-count"
}, dd = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = Fs();
    return (s, o) => {
      const l = Au("tip");
      return r(), d("span", {
        class: Y(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (r(!0), d(B, null, X(e.options, (i) => _e((r(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: Y(["segmented-option", { on: i.key === e.value }]),
          onClick: (u) => n("pick", i.key)
        }, [
          i.dot ? (r(), d("span", rd)) : k("", !0),
          U(" " + v(i.label) + " ", 1),
          i.note ? (r(), d("small", ud, v(i.note), 1)) : k("", !0),
          i.count !== void 0 ? (r(), d("em", cd, v(i.count), 1)) : k("", !0)
        ], 10, id)), [
          [l, i.tip || i.title, `${I(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Bt = /* @__PURE__ */ H(dd, [["__scopeId", "data-v-c89bc92d"]]), fd = {
  key: 0,
  class: "more-items"
}, md = {
  key: 0,
  role: "alert"
}, hd = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (r(), d("div", fd, [
      e.failure ? (r(), d("p", md, v(e.failure), 1)) : k("", !0),
      e.more ? (r(), P(ve, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: q(() => [
          U(v(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : k("", !0)
    ])) : k("", !0);
  }
}, _n = /* @__PURE__ */ H(hd, [["__scopeId", "data-v-10464014"]]), pd = { class: "link-group" }, vd = {
  class: "group-label",
  "data-link-kind": ""
}, gd = ["disabled", "onClick"], yd = { class: "title" }, bd = { class: "relations" }, kd = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1), o = x(() => s.value ? n.rows : n.rows.slice(0, 3)), l = x(() => `${n.model.replaceAll("_", " ").replace(/^./, (f) => f.toUpperCase())} ${n.count}`), i = (f) => f.endpoint.unavailable || !f.endpoint.open_ref, u = (f) => ({ [n.linkAttribute]: !0, "data-link-model": f.endpoint.model, "data-link-id": f.endpoint.id }), c = (f) => `${f.endpoint.model === "doc" && f.endpoint.id === n.documentId ? "Design document" : f.endpoint.model.replaceAll("_", " ").replace(/^./, (m) => m.toUpperCase())} ${f.endpoint.id}, ${f.relations.map((m) => m.replaceAll("_", " ")).join(", ")}`;
    return (f, m) => (r(), d("div", pd, [
      h("div", vd, v(l.value), 1),
      (r(!0), d(B, null, X(o.value, (p) => (r(), d("button", je({
        key: `${p.endpoint.model}:${p.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, u(p), {
        disabled: i(p),
        onClick: (y) => a("open", p)
      }), [
        h("span", yd, v(p.endpoint.title), 1),
        h("span", bd, [
          U(v(c(p)), 1),
          i(p) ? (r(), d(B, { key: 0 }, [
            U(" · Unavailable")
          ], 64)) : k("", !0)
        ])
      ], 16, gd))), 128)),
      e.rows.length > 3 && !s.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: m[0] || (m[0] = (p) => s.value = !0)
      }, "Show more")) : k("", !0)
    ]));
  }
}, wd = /* @__PURE__ */ H(kd, [["__scopeId", "data-v-be6f079c"]]), $d = ["data-loaded"], xd = { class: "rows" }, Sd = ["disabled", "onClick"], _d = { class: "title" }, Md = { class: "relations" }, Cd = { key: 2 }, Ad = {
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
    const n = e, a = t, s = _([]), o = _({}), l = _(0), i = _(""), u = _(null), c = _(!1), f = _("");
    let m = 0;
    const p = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, y = (E) => p[E] || `${E.replaceAll("_", " ").replace(/^./, (N) => N.toUpperCase())}s`, b = x(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((E, N) => E + N, 0) },
      ...Object.entries(o.value).filter(([E]) => !n.onlyKinds.length || n.onlyKinds.includes(E)).map(([E, N]) => ({ key: E, label: y(E), count: N }))
    ]), w = x(() => {
      const E = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((j) => j.endpoint.model))].map((j) => [j, s.value.filter(($) => $.endpoint.model === j).length])), N = { doc: 0, task: 1, message: 2 };
      return Object.entries(E).sort(([j], [$]) => (N[j] ?? 3) - (N[$] ?? 3)).map(([j, $]) => ({ model: j, count: $, rows: s.value.filter((g) => g.endpoint.model === j) }));
    }), M = (E) => E.endpoint.unavailable || !E.endpoint.open_ref, C = (E) => ({ [n.linkAttribute]: !0, "data-link-model": E.endpoint.model, "data-link-id": E.endpoint.id }), T = (E) => `${E.endpoint.model === "doc" && E.endpoint.id === n.documentId ? "Design document" : E.endpoint.model.replaceAll("_", " ").replace(/^./, (N) => N.toUpperCase())} ${E.endpoint.id}, ${E.relations.map((N) => N.replaceAll("_", " ")).join(", ")}`;
    async function z(E = 1) {
      const N = ++m;
      c.value = !0, f.value = "";
      const j = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(E), "--page-size", String(n.pageSize)];
      n.outsidePlan && j.push("--outside-plan"), n.documentId && j.push("--first-counterpart", `doc:${n.documentId}`), i.value && j.push("--kind", i.value);
      try {
        const $ = await n.read(j);
        if (N !== m) return;
        if (!$.ok) {
          f.value = $.error;
          return;
        }
        const g = $.value.counterparts ?? [], S = E === 1 ? g : [...s.value, ...g];
        s.value = [...new Map(S.map((O) => [`${O.endpoint.model}:${O.endpoint.id}`, O])).values()], o.value = $.value.categories ?? {}, l.value = $.value.total, u.value = $.value.next_page ?? null;
      } catch ($) {
        N === m && (f.value = $.message);
      } finally {
        N === m && (c.value = !1);
      }
    }
    function W(E) {
      if (M(E)) return;
      const [N, j] = E.endpoint.open_ref.split(":");
      a("open", { table: N, id: Number(j) });
    }
    function R(E) {
      i.value = E, z();
    }
    const G = () => !c.value && u.value && z(u.value), D = x(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return me(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], u.value = null, i.value = "", z();
    }, { immediate: !0 }), (E, N) => s.value.length || c.value || f.value || e.empty ? (r(), d("section", {
      key: 0,
      class: Y(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      b.value.length > 2 ? (r(), P(Bt, {
        key: 0,
        options: b.value,
        value: i.value,
        wrap: "",
        onPick: R
      }, null, 8, ["options", "value"])) : k("", !0),
      h("div", xd, [
        e.grouped ? (r(!0), d(B, { key: 0 }, X(w.value, (j) => (r(), P(wd, {
          key: j.model,
          model: j.model,
          count: j.count,
          rows: j.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: W
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (r(!0), d(B, { key: 1 }, X(s.value, (j) => (r(), d("button", je({
          key: `${j.endpoint.model}:${j.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, C(j), {
          disabled: M(j),
          onClick: ($) => W(j)
        }), [
          h("span", _d, v(j.endpoint.title), 1),
          h("span", Md, [
            U(v(T(j)), 1),
            M(j) ? (r(), d(B, { key: 0 }, [
              U(" · Unavailable")
            ], 64)) : k("", !0)
          ])
        ], 16, Sd))), 128)),
        !s.value.length && !c.value && !f.value && e.empty ? (r(), d("p", Cd, v(e.empty), 1)) : k("", !0),
        A(_n, {
          more: !!u.value,
          loading: c.value,
          failure: f.value,
          label: D.value,
          onMore: G
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, $d)) : k("", !0);
  }
}, Ed = /* @__PURE__ */ H(Ad, [["__scopeId", "data-v-3b23de37"]]), Od = (e, t, n) => Math.max(t, Math.min(n, e)), Td = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, di = /* @__PURE__ */ new WeakMap(), Id = (e, t) => di.set(e, t);
function Bd(e, t) {
  for (let n = t; n; n = di.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function fi(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !Bd(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Le(() => window.removeEventListener("click", n));
}
const Pt = 8, Rd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = _(null), o = (g) => g ? `${g}px` : void 0, l = x(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), i = _({ w: 0, h: 0 }), u = _(a.anchor ? a.anchor.getBoundingClientRect() : null), c = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), f = (g) => ({
      left: Math.max(0, g.left),
      top: Math.max(0, g.top),
      right: Math.min(window.innerWidth, g.right),
      bottom: Math.min(window.innerHeight, g.bottom)
    }), m = (g) => {
      const S = g.closest(".pane, .float-window");
      return S ? f(S.getBoundingClientRect()) : c();
    }, p = (g, S) => `${Math.max(0, g ? Math.min(g, S) : S)}px`;
    function y(g, S) {
      return {
        below: g.bottom - S.bottom - a.gap - Pt,
        above: S.top - g.top - a.gap - Pt,
        across: g.right - g.left - 2 * Pt
      };
    }
    function b(g) {
      const S = m(a.anchor), O = y(S, g);
      return i.value.w <= O.across && i.value.h <= Math.max(O.below, O.above) ? S : c();
    }
    const w = x(() => {
      if (!u.value) return l.value;
      const g = u.value, S = b(g), O = y(S, g), { w: L, h: F } = i.value, V = a.align === "auto" ? g.left + g.right > S.left + S.right : a.align === "right", Z = Od(V ? g.right - L : g.left, S.left + Pt, Math.max(S.left + Pt, S.right - L - Pt)), ue = F > O.below && O.above > O.below ? { bottom: `${window.innerHeight - g.top + a.gap}px`, maxHeight: p(a.maxHeight, O.above) } : { top: `${g.bottom + a.gap}px`, maxHeight: p(a.maxHeight, O.below) };
      return { ...l.value, ...ue, left: `${Z}px`, maxWidth: p(a.maxWidth, O.across) };
    }), M = n, C = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function T(g) {
      const S = C(), O = S.indexOf(document.activeElement);
      S[(O + g + S.length) % S.length].focus();
    }
    const z = { ArrowDown: () => T(1), ArrowUp: () => T(-1), Escape: () => M("close") }, W = (g) => z[g.key] && (g.preventDefault(), z[g.key]()), R = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let G = 0;
    const D = new ResizeObserver(() => {
      cancelAnimationFrame(G), G = requestAnimationFrame(R);
    });
    fi(s, (g) => a.anchor && !a.anchor.contains(g.target) && M("close"));
    const E = (g, S) => ["top", "left", "right", "bottom"].some((O) => Math.abs(g[O] - S[O]) > 1), N = (g) => g.bottom < 0 || g.top > window.innerHeight;
    let j = 0;
    function $() {
      if (a.anchor) {
        const g = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || N(g)) return M("close");
        E(g, u.value) && (u.value = g);
      }
      j = requestAnimationFrame($);
    }
    return Ce(() => {
      a.anchor && s.value && Id(s.value, a.anchor), R(), s.value && D.observe(s.value), !a.plain && C()[0] && C()[0].focus(), $();
    }), Le(() => {
      D.disconnect(), cancelAnimationFrame(j), cancelAnimationFrame(G);
    }), t({ element: s }), (g, S) => (r(), P(Sn, {
      to: "body",
      disabled: !e.anchor
    }, [
      h("div", je({
        ref_key: "panel",
        ref: s
      }, g.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: w.value,
        onKeydown: W
      }), [
        ae(g.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Zt = /* @__PURE__ */ H(Rd, [["__scopeId", "data-v-3d203970"]]), Ld = { class: "split-button" }, Nd = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = _(null), s = _(!1), o = () => s.value = !1;
    return (l, i) => (r(), d("span", Ld, [
      A(ve, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: i[0] || (i[0] = (u) => n("main"))
      }, {
        default: q(() => [
          ae(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      h("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        A(ve, {
          variant: e.variant,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: i[1] || (i[1] = (u) => s.value = !s.value)
        }, {
          default: q(() => [
            A(ie, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (r(), P(Zt, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: q(() => [
          ae(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : k("", !0)
    ]));
  }
}, qd = /* @__PURE__ */ H(Nd, [["__scopeId", "data-v-c258494d"]]), Dd = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Pd = {
  key: 1,
  class: "menu-item-text"
}, jd = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: Y(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (r(), d("span", Dd, v(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (r(), d("span", Pd, [
        h("span", null, [
          ae(t.$slots, "default", {}, void 0, !0)
        ]),
        h("small", null, v(e.description), 1)
      ])) : ae(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, He = /* @__PURE__ */ H(jd, [["__scopeId", "data-v-fec99974"]]), Fd = ["aria-expanded"], Wd = { class: "drop-label" }, Hd = ["value"], zd = {
  key: 1,
  class: "drop-lead"
}, Ud = { class: "drop-item-text" }, Vd = {
  key: 2,
  class: "drop-note"
}, Gd = {
  key: 1,
  class: "drop-none"
}, Kd = {
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
    const n = e, a = t, s = _(!1), o = _(null), l = _(""), i = x(() => {
      const c = l.value.trim().toLowerCase();
      return c ? n.items.filter((f) => `${f.label} ${f.note || ""}`.toLowerCase().includes(c)) : n.items;
    });
    function u(c) {
      s.value = !1, a("pick", c);
    }
    return (c, f) => (r(), d("div", {
      class: Y(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      h("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: Y(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: f[0] || (f[0] = (m) => s.value = !s.value)
      }, [
        e.icon ? (r(), P(ie, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : k("", !0),
        h("span", Wd, v(e.label), 1),
        A(ie, {
          name: "down",
          size: 11
        })
      ], 10, Fd),
      s.value ? (r(), P(Zt, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: f[2] || (f[2] = (m) => s.value = !1)
      }, {
        default: q(() => [
          e.searchable ? (r(), d("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: f[1] || (f[1] = (m) => l.value = m.target.value)
          }, null, 40, Hd)) : k("", !0),
          (r(!0), d(B, null, X(i.value, (m) => (r(), P(He, {
            key: m.key,
            on: m.key === e.picked,
            "data-drop-item": m.key,
            onClick: (p) => u(m)
          }, {
            default: q(() => [
              m.running !== void 0 ? (r(), d("span", {
                key: 0,
                class: Y(["drop-dot", { live: m.running }])
              }, null, 2)) : k("", !0),
              m.lead ? (r(), d("span", zd, v(m.lead), 1)) : k("", !0),
              h("span", Ud, v(m.label), 1),
              m.note ? (r(), d("span", Vd, v(m.note), 1)) : k("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? k("", !0) : (r(), d("p", Gd, v(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : k("", !0)
    ], 2));
  }
}, Qs = /* @__PURE__ */ H(Kd, [["__scopeId", "data-v-29dfcce5"]]), Yd = 0, Qd = "/api/lines", Xd = "/api/line", Ho = 5e3, zo = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Uo = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), Na = (e) => JSON.stringify(e.line), Vo = () => new DOMException("cancelled", "AbortError");
class Jd {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(Na(t))) {
        Ee.whenFree(() => this.readAlone(l));
        return;
      }
      this.waiting.push(l), this.sendSoon();
    });
  }
  // a write always finishes, also when its window has gone: it carries no signal
  write(t) {
    return new Promise((n, a) => this.alone({ body: t, resolve: n, reject: a }, Ft));
  }
  sendSoon() {
    this.timer ?? (this.timer = setTimeout(() => Ee.whenFree(() => this.send()), Yd));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(Vo())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(Vo()), n.abort();
    });
    t.forEach((o, l) => {
      var i;
      return (i = o.signal) == null ? void 0 : i.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Ee.sent(Qd, zo({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => Uo(i.body, it)), Ho);
      if (!o.ok) throw new Error(`the journal answered ${o.status} to a batch of lines`);
      const { answers: l } = await o.json();
      t.forEach((i, u) => i.resolve(l[u]));
    } catch (o) {
      n.signal.aborted ? (this.waiting.push(...a), a.size && this.sendSoon()) : o.name === "TimeoutError" ? t.forEach((l) => Ee.whenFree(() => this.readAlone(l))) : t.forEach((l) => l.reject(o));
    } finally {
      t.forEach((o, l) => {
        var i;
        return (i = o.signal) == null ? void 0 : i.removeEventListener("abort", s[l]);
      });
    }
  }
  async readAlone(t) {
    const n = Date.now();
    await this.alone(t, it), Date.now() - n < Ho ? this.slow.delete(Na(t.body)) : this.slow.add(Na(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Ee.sent(Xd, zo(t.body, t.signal), [Uo(t.body, n)], n === it ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const mi = new Jd(), Zd = "/api/window";
function ef(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${Zd}?${o}`, i = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, u = (c) => Ee.whenFree(async () => {
    const f = await Ee.sent(l, { signal: c, headers: i }, [{ window: e, line: l, kind: it }]);
    if (!f.ok) throw new Error((await f.json()).error);
    return f.json();
  });
  return Ee.joined(`${e} ${n.join(",")} ${o}`, u, s);
}
const hi = /* @__PURE__ */ new Map();
class tf {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = at({ buttons: [], missing: {} }), this.loading = at(!1), this.loaded = at(!1), this.failed = at(""), this.pending = null;
  }
  load() {
    return this.pending ? this.pending : (this.loading.value = !0, this.pending = this.read().then((t) => (this.offers.value = t, this.loaded.value = !0, this.failed.value = "", t)).catch((t) => {
      throw this.failed.value = t.message, t;
    }).finally(() => {
      this.pending = null, this.loading.value = !1;
    }), this.pending);
  }
  async read() {
    const t = await Ee.raw(`/api/buttons?environment=${encodeURIComponent(this.environment)}`);
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
function iC(e, t) {
  const n = new tf(e, t);
  return hi.set(e, n), n.load().catch(() => {
  }), n;
}
const Xs = (e) => hi.get(e);
function nf(e, t, n) {
  const a = Xs(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function af(e, t) {
  if (!e) return !0;
  const n = Xs(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const sf = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let pi = {};
async function rC(e = (t) => Ee.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (pi = (await t.json()).states);
}
const Js = (e, t) => {
  var n;
  return (n = pi[e]) == null ? void 0 : n[t];
}, hn = (e, t) => {
  var n;
  return ((n = Js(e, t)) == null ? void 0 : n.label) ?? sf(t);
}, Zs = (e, t) => {
  var n;
  return ((n = Js(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, of = (e, t) => {
  var n;
  return ((n = Js(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, lf = Symbol("pane-page"), eo = Symbol("inspector-host"), vi = { 1: "refused", 2: "usage", 3: "fault" }, rf = 100, uf = 50, cf = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, df = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function ff({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: i, options: u = _({}), declared: c = [], page: f = null, setOption: m = () => {
}, autoScroll: p = "", tabs: y = [], sources: b = [], links: w = {}, search: M = {}, readOnly: C = !1, shared: T = null }) {
  const z = /* @__PURE__ */ new Map(), W = (V, Z) => l.follow(e, V, (le) => {
    z.clear(), Z(le);
  }, a), R = new AbortController(), G = _(!1), D = performance.now();
  let E = 0, N = 0, j = () => {
  };
  const $ = new Promise((V) => j = V);
  R.signal.addEventListener("abort", j, { once: !0 });
  const g = () => {
    clearTimeout(N), N = setTimeout(() => {
      E === 0 && Us(D, () => {
        G.value = !0, j();
      });
    }, uf);
  }, S = (V, Z) => (E += 1, At(e, V, t, R.signal, Z).finally(() => {
    E -= 1, g();
  })), O = (V, Z) => (g(), $.then(() => R.signal.aborted ? dt : At(e, V, t, R.signal, Z))), L = ({ only: V = [], state: Z = {} } = {}) => (E += 1, hf(() => ef(e, t, V, Z, R.signal), R.signal).finally(() => {
    E -= 1, g();
  })), F = (V, { unbatched: Z = !1, deferred: le = !1 } = {}) => {
    const ue = z.get(V);
    if (ue && performance.now() - ue.at < rf) return ue.answer;
    const we = le && !G.value ? O(V, Z) : S(V, Z);
    return z.set(V, { answer: we, at: performance.now() }), we;
  };
  return {
    answered: G,
    settle: g,
    window: e,
    environment: t,
    agent: n,
    page: f,
    visible: x(() => a()),
    permissions: s,
    autoScroll: p,
    tabs: y,
    sources: b,
    links: w,
    search: M,
    readOnly: C,
    shared: T,
    read: F,
    readKeys: L,
    waitForServer: () => Gs() ? li() : null,
    run: (V) => At(e, V, t, R.signal),
    upload: (V) => vf(V, e, R.signal),
    cancel: () => R.abort(),
    signal: R.signal,
    subscriptions: l,
    follow: (V, Z) => W([V].flat().filter((le) => o.some((ue) => Ys(ue, le))), Z),
    // for a dock of the chat, whose row's term the window cannot declare ahead
    followUndeclared: W,
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (V) => x(() => {
      var Z;
      return u.value[V] ?? ((Z = c.find((le) => le.key === V)) == null ? void 0 : Z.default);
    }),
    setting: async (V, Z) => {
      const le = await F(`window setting ${e} ${V}`);
      return le.ok ? le.value.value : Z;
    },
    setOption: m,
    keep: (V, Z) => At(e, ["window", "save-setting", e, V, JSON.stringify(Z)], t, R.signal)
  };
}
function gi(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const dt = { ok: !1, failure: "cancelled", error: "" }, to = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function yi(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? dt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: vi[n.code] || "fault", error: gi(n.error) };
  } catch {
    return t != null && t.aborted ? dt : { ok: !1, failure: "unreachable", error: to };
  }
}
const mf = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: vi[e.code] || "fault", error: gi(e.error) };
async function hf(e, t) {
  try {
    const n = await e();
    return t.aborted ? dt : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, mf(s)])) } };
  } catch {
    return t.aborted ? dt : { ok: !1, failure: "unreachable", error: to };
  }
}
async function bi(e, t, n) {
  const a = await yi(() => mi.read(e, t, n), t);
  return a.failure !== "unreachable" || !Gs() ? a : (await li(), t.aborted ? dt : bi(e, t, n));
}
function At(e, t, n, a = void 0, s = !1) {
  return Ee.held(() => pf(e, t, n, a, s), Ee.knownRead(Array.isArray(t) ? t : no(t)));
}
async function pf(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : no(t), environment: n };
  return await Ee.isRead(o.line) ? Ee.joined(JSON.stringify(o), (l, i) => bi({ ...o, attribution: i }, l, s), a, o).catch(() => dt) : yi(() => mi.write({ ...o, attribution: {
    client_id: Ee.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function vf(e, t, n = void 0) {
  try {
    const a = await Ee.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? dt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? dt : { ok: !1, failure: "unreachable", error: to };
  }
}
function no(e) {
  return [...e.matchAll(cf)].map(([t]) => t.replace(df, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const gf = (e) => `show-${e}`, uC = (e, t, n) => e.filter((a) => {
  var s;
  return n(gf((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), ao = "messages.chat", Jn = "main", ki = "Main agent", yf = { main: ki, worker: "Worker", helper: "Helper" }, bf = "journal-", so = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), kf = (e) => so(e.replace(bf, "").replaceAll("-", " ")), wf = (e) => `${e.role} ${e.number}`, $f = (e) => e.role === Jn ? ki : `${so(e.role)} ${e.number}`;
function Kt(e, t = e.facts) {
  const n = (t == null ? void 0 : t.profile) || e.profile || "", a = e.role === Jn || !n ? yf[e.role] ?? so(e.role) : kf(n), s = e.role === Jn ? "" : wf(e), o = e.role === Jn ? a : n ? `${a} · ${s}` : `${a} ${e.number}`;
  return { title: a, subtext: s, text: o, name: $f(e) };
}
const xf = {
  key: 0,
  class: "agent-failure",
  role: "alert"
}, Sf = {
  __name: "ButtonAgentField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _([]), o = _(""), l = x(() => [...s.value].sort((c, f) => +(f.role === n.field.first_role) - +(c.role === n.field.first_role) || c.id - f.id).map((c) => ({ key: String(c.number), label: Kt(c).title, note: Kt(c).subtext }))), i = x(() => l.value.find((c) => c.key === n.value));
    async function u() {
      const c = await At(ao, ["agent", "running"], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
    }
    return u(), (c, f) => (r(), d(B, null, [
      A(Qs, {
        label: i.value ? i.value.label : "Choose an agent",
        items: l.value,
        picked: e.value,
        empty: "No agent is running",
        wide: "",
        "data-agent-field": "",
        onPick: f[0] || (f[0] = (m) => a("pick", m.key))
      }, null, 8, ["label", "items", "picked"]),
      o.value ? (r(), d("p", xf, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, _f = /* @__PURE__ */ H(Sf, [["__scopeId", "data-v-d2ea58f1"]]), Mf = {
  key: 0,
  class: "template-brief"
}, Cf = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Af = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _([]), o = _(""), l = x(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = x(() => s.value.find((c) => String(c.id) === n.value));
    async function u() {
      const c = await At(ao, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const f = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), m = s.value.find((p) => p.title === f);
      m && a("pick", String(m.id));
    }
    return u(), (c, f) => (r(), d(B, null, [
      A(Bt, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: f[0] || (f[0] = (m) => a("pick", m))
      }, null, 8, ["options", "value"]),
      i.value ? (r(), d("p", Mf, v(i.value.brief), 1)) : k("", !0),
      o.value ? (r(), d("p", Cf, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, Ef = /* @__PURE__ */ H(Af, [["__scopeId", "data-v-14be8a5c"]]), Of = { class: "info-tip" }, Tf = ["aria-label"], If = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, Bf = {
  __name: "InfoTip",
  props: { lines: { type: Array, required: !0 }, label: { type: String, default: "More information" } },
  setup(e) {
    return (t, n) => (r(), d("span", Of, [
      h("button", {
        type: "button",
        class: "info-tip-icon",
        "aria-label": e.label,
        "data-info-tip": ""
      }, [
        A(ie, {
          name: "info",
          size: 13
        })
      ], 8, Tf),
      h("span", If, [
        (r(!0), d(B, null, X(e.lines, (a, s) => (r(), d("span", {
          key: s,
          class: "info-tip-line"
        }, v(a), 1))), 128))
      ])
    ]));
  }
}, wi = /* @__PURE__ */ H(Bf, [["__scopeId", "data-v-a2fe5ff1"]]), Rf = { class: "form-field" }, Lf = { class: "form-field-head" }, Nf = ["for"], qf = {
  key: 1,
  class: "form-field-aside"
}, Df = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", Rf, [
      h("div", Lf, [
        h("label", {
          class: "form-field-label",
          for: t.$props.for
        }, v(e.label), 9, Nf),
        e.help ? (r(), P(wi, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : k("", !0),
        t.$slots.aside ? (r(), d("span", qf, [
          ae(t.$slots, "aside", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      ae(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, $i = /* @__PURE__ */ H(Df, [["__scopeId", "data-v-302c40bf"]]), $s = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Pf = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = ka(), n = x(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => _e((r(), d("textarea", je({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [I($s), I(t).value]
    ]);
  }
}), xi = /* @__PURE__ */ H(Pf, [["__scopeId", "data-v-e130a5b9"]]), jf = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Fs(), o = x(() => n.field.choices ? "choice" : n.field.target ? "template" : n.field.first_role ? "agent" : "text");
    return (l, i) => (r(), P($i, {
      label: e.field.label,
      for: I(s),
      "data-button-field": e.field.name
    }, {
      default: q(() => [
        A(Jt, { value: o.value }, {
          choice: q(() => [
            A(Bt, {
              id: I(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (u) => a("pick", u))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: q(() => [
            A(Ef, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          agent: q(() => [
            A(_f, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[2] || (i[2] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: q(() => [
            A(xi, {
              id: I(s),
              value: e.value,
              onInput: i[3] || (i[3] = (u) => a("pick", u.target.value))
            }, null, 8, ["id", "value"])
          ]),
          _: 1
        }, 8, ["value"])
      ]),
      _: 1
    }, 8, ["label", "for", "data-button-field"]));
  }
}, xa = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (r(), P(ve, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: q(() => [
        A(ie, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Ff(e, t, n, a = () => window) {
  Ce(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Le(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Wf = (e, t = () => !0) => Ff("keydown", (n) => n.key === "Escape" && t() && e());
function Si(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = _(!1), s = x(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Wf(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Hf = 80, jt = Qt([]);
function _i(e) {
  const t = Symbol("layer"), n = () => jt.includes(t) && jt.splice(jt.indexOf(t), 1);
  return me(
    e,
    (a) => {
      a && !jt.includes(t) && jt.push(t), a || n();
    },
    { immediate: !0 }
  ), Le(n), x(() => Hf + Math.max(0, jt.indexOf(t)));
}
let Mi = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Mi = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const zf = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Uf(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(zf)];
    if (!l.length) return o.preventDefault();
    const [i, u] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), u.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === u && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Ce(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : Mi, document.addEventListener("keydown", s), Fe(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Le(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const Vf = ["aria-modal", "aria-label", "aria-labelledby"], Gf = {
  key: 0,
  class: "dialog-head"
}, Kf = ["id", "tabindex"], Yf = {
  key: 1,
  class: "dialog-foot"
}, Qf = 500, Xf = 400, Jf = {
  __name: "Dialog",
  props: {
    title: { type: String, default: "" },
    follow: { type: Boolean, default: !1 },
    fits: Boolean,
    wide: Boolean,
    huge: Boolean,
    small: Boolean,
    tall: Boolean,
    large: Boolean,
    bare: Boolean,
    padded: Boolean,
    open: { type: Boolean, default: null },
    closable: { type: Boolean, default: !0 },
    modal: Boolean,
    sheet: Boolean
  },
  emits: ["close", "dismiss", "escape"],
  setup(e, { emit: t }) {
    const n = e, a = t, { visible: s, close: o, closed: l } = Si(a, n), i = _i(s), u = _(null), c = _(null), f = _(null), m = Fs(), p = _(!1), y = Date.now();
    n.modal && Uf(c, () => a("escape"), f);
    function b() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, Xf);
    }
    function w(T) {
      !n.modal || Date.now() - y >= Qf || ![" ", "Enter"].includes(T.key) || (T.preventDefault(), T.stopPropagation());
    }
    const M = () => u.value && (u.value.scrollTop = u.value.scrollHeight), C = new MutationObserver(M);
    return me(u, (T) => {
      C.disconnect(), T && n.follow && (C.observe(T, { childList: !0, subtree: !0, characterData: !0 }), M());
    }), Le(() => C.disconnect()), (T, z) => (r(), P(Sn, { to: "body" }, [
      A(Xt, {
        name: "dialog",
        appear: "",
        onAfterLeave: I(l)
      }, {
        default: q(() => [
          I(s) ? (r(), d("div", {
            key: 0,
            class: Y(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ge({ zIndex: I(i) }),
            onClick: ke(b, ["self"])
          }, [
            h("section", {
              ref_key: "panel",
              ref: c,
              class: Y(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, huge: e.huge, sheet: e.sheet, nudged: p.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? I(m) : void 0,
              onKeydownCapture: w
            }, [
              e.bare ? k("", !0) : (r(), d("header", Gf, [
                h("h3", {
                  id: I(m),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, v(e.title), 9, Kf),
                e.closable ? (r(), P(xa, {
                  key: 0,
                  onClick: I(o)
                }, null, 8, ["onClick"])) : k("", !0)
              ])),
              h("div", {
                ref_key: "body",
                ref: u,
                class: Y(["dialog-body", { bare: e.bare, padded: e.padded }])
              }, [
                ae(T.$slots, "default", {}, void 0, !0)
              ], 2),
              T.$slots.foot ? (r(), d("footer", Yf, [
                ae(T.$slots, "foot", {}, void 0, !0)
              ])) : k("", !0)
            ], 42, Vf)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Mn = /* @__PURE__ */ H(Jf, [["__scopeId", "data-v-089c42bc"]]), Zf = {
  class: "action-output",
  "data-action-output": ""
}, em = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), P(Mn, {
      padded: "",
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: q(() => [
        h("pre", Zf, v(e.text), 1)
      ]),
      _: 1
    }));
  }
}, tm = /* @__PURE__ */ H(em, [["__scopeId", "data-v-b32f94a4"]]);
function nm(e) {
  const t = document.body.appendChild(document.createElement("div")), n = Eu(tm, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const am = (e, t, n = {}) => no(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function Cn(e, t, n, a = {}) {
  var s;
  try {
    if (!await af(e.module, n)) return { ok: !1, error: "" };
    const o = await At(ao, am(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && nm(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const sm = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, qa = [
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], $e = (e, t, n, a = {}) => ({
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
}), Sa = {
  messages: $e("Message", "mail", "Messages between you and the agent", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: $e("Question", "help", "A question from the agent with suggested answers", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: $e("Plan", "flag", "A series of phases and tasks for you to approve before work begins", {
    view: "document",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    lists_completed_unread: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you want, in your own words; the agent builds the plan with you from here" },
    filters: qa
  }),
  tasks: $e("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: qa
  }),
  reports: $e("Report", "report", "A record of what was checked and found", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: $e("Collection", "folder", "Related items grouped under a name", {
    in_sidebar: !0,
    listed_under: "sidebar",
    listed_as_cards: !0,
    created_in_viewer: !0,
    typed_as_title: !0,
    labels: { abstract: "What belongs in it" }
  }),
  docs: $e("Document", "file", "What stays true about the project, catalogued for every session", {
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
  memories: $e("Memory", "pin", "What the agent keeps in mind here, with a weight from 1 to 10 that every compaction lowers by one", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { weight: "A weight from 1 to 10" }
  }),
  rules: $e("Rule", "list", "An instruction that applies to every environment in the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: $e("Reminder", "clock", "An instruction repeated until it is removed", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  pins: $e("Pin", "band", "One line pinned to the chat while it matters", { filters: qa }),
  reactions: $e("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: $e("Plugin", "plug", "An installed extension that responds to events and can run background services", { scope: "project" }),
  environments: $e("Environment", "branch", "A separate workspace with messages, tasks, memories, plans and settings", { scope: "project" }),
  agents: $e("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: $e("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: $e("Worker", "bot", "An agent assigned a task in a separate working copy"),
  verifiers: $e("Verifier", "verifier", "An agent that checks whether an output reader report was correctly closed"),
  test_turns: $e("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: $e("Reviewer", "reviewer", "An agent that tests and reviews worker changes and reports the results to the main agent"),
  helpers: $e("Helper", "bot", "A helper started by the agent for a specific job", { nested: !0 }),
  sequences: $e("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by its triggers", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    listed_as_cards: !0,
    takes_comments: !0,
    labels: { brief: "What it is for" }
  }),
  templates: $e("Template", "docs", "Instructions put in front of anything made from it, with the parts it starts with", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    labels: { brief: "Instructions" }
  }),
  triggers: $e("Trigger", "bolt", "Words to watch for and the action to take when they appear", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    labels: { words: "Words", action: "What it does", text: "What it sends" }
  }),
  checks: $e("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
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
  dumps: $e("Dump", "inbox", "Text and files you submit for the agent to sort by subject", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: $e("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: $e("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
}, om = ["secrets", "plugins"], Ci = Object.keys(Sa).filter((e) => !(ei && om.includes(e)));
x(() => Ci.map((e) => ({ name: e, ...Sa[e] })));
const en = (e) => Sa[e], Ai = new Map(Ci.flatMap((e) => [e, e.replace(/s$/, ""), Sa[e].title.toLowerCase()].map((t) => [t, e]))), yt = (e) => Ai.get(String(e).toLowerCase()) || "", Ei = [...Ai.keys()].sort((e, t) => t.length - e.length).join("|"), lm = {
  class: "button-form",
  "data-button-form": ""
}, im = {
  key: 0,
  class: "button-form-title"
}, rm = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, um = { class: "button-form-actions" }, cm = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(Object.fromEntries(n.button.fields.map((f) => [f.name, f.default || ""]))), o = _(!1), l = _(""), i = x(() => n.button.fields.every((f) => s.value[f.name].trim().length > 0)), u = x(() => {
      var m;
      if (!n.row) return n.button.label;
      const f = ((m = en(yt(n.row.term))) == null ? void 0 : m.title) || "Item";
      return `${n.button.label} · ${f} ${n.row.id}`;
    });
    async function c() {
      if (o.value || !i.value) return;
      o.value = !0;
      const f = await Cn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = f.ok ? "" : f.error, f.ok && (a("done"), a("close"));
    }
    return (f, m) => (r(), P(Mn, {
      padded: "",
      title: u.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: m[1] || (m[1] = (p) => a("close"))
    }, {
      default: q(() => {
        var p;
        return [
          h("div", lm, [
            (p = e.row) != null && p.title ? (r(), d("p", im, v(e.row.title), 1)) : k("", !0),
            (r(!0), d(B, null, X(e.button.fields, (y) => (r(), P(jf, {
              key: y.name,
              field: y,
              value: s.value[y.name],
              environment: e.environment,
              onPick: (b) => s.value[y.name] = b
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (r(), d("p", rm, v(l.value), 1)) : k("", !0),
            h("div", um, [
              A(ve, {
                small: "",
                onClick: m[0] || (m[0] = (y) => a("close"))
              }, {
                default: q(() => [...m[2] || (m[2] = [
                  U("Cancel", -1)
                ])]),
                _: 1
              }),
              A(ve, {
                variant: "primary",
                small: "",
                disabled: !i.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: c
              }, {
                default: q(() => [...m[3] || (m[3] = [
                  U("Send", -1)
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
}, dm = /* @__PURE__ */ H(cm, [["__scopeId", "data-v-e3f0d786"]]), fm = ["aria-busy"], mm = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, hm = { class: "button-slot-confirm-text" }, pm = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, vm = {
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
    const n = e, a = t, s = x(() => Xs(n.environment)), o = x(
      () => {
        var C;
        return !n.readOnly && ((C = s.value) == null ? void 0 : C.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = x(() => {
      var C;
      return !n.readOnly && ((C = s.value) == null ? void 0 : C.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), u = x(() => n.readOnly ? [] : nf(n.environment, n.name, n.row)), c = _(null), f = _(null), m = _(""), p = _(!1), y = (C) => [C.from ? `From ${C.from}` : "", C.tip, C.warning].filter(Boolean).join(" · "), b = (C) => C.icon || (C.warning ? "dot" : "");
    function w(C) {
      if (!(p.value || n.readOnly)) {
        if (C.fields.length) {
          c.value = C;
          return;
        }
        if (C.confirm) {
          f.value = C;
          return;
        }
        return M(C);
      }
    }
    async function M(C) {
      f.value = null, m.value = "", a("failure", ""), p.value = !0;
      const T = await Cn(C, n.row, n.environment);
      p.value = !1, m.value = T.ok ? "" : T.error;
      const z = C.label.toLowerCase() + (n.objectName && !C.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", T.ok ? "" : `Could not ${z}: ${T.error}`), T.ok && a("done");
    }
    return (C, T) => (r(), d("span", {
      class: Y(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (r(), d(B, { key: 0 }, [
        T[5] || (T[5] = h("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        A(ve, {
          small: "",
          onClick: i
        }, {
          default: q(() => [...T[4] || (T[4] = [
            U("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && f.value ? (r(), d("span", mm, [
        h("span", hm, v(f.value.confirm), 1),
        A(ve, {
          small: "",
          variant: f.value.danger ? "ghost" : "primary",
          bordered: f.value.danger,
          class: Y({ danger: f.value.danger }),
          "data-button-confirm-yes": "",
          onClick: T[0] || (T[0] = (z) => M(f.value))
        }, {
          default: q(() => [
            U(v(f.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        A(ve, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: T[1] || (T[1] = (z) => f.value = null)
        }, {
          default: q(() => [...T[6] || (T[6] = [
            U("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? k("", !0) : (r(), d(B, { key: 2 }, [
        (r(!0), d(B, null, X(u.value, (z) => (r(), d(B, {
          key: z.name
        }, [
          z.menu.length ? (r(), P(qd, {
            key: 0,
            small: "",
            variant: z.primary ? "primary" : "ghost",
            disabled: p.value,
            "menu-label": z.menu_label || "More ways",
            title: y(z),
            "data-button": z.name,
            onMain: (W) => w(z)
          }, {
            menu: q(({ close: W }) => [
              (r(!0), d(B, null, X(z.menu, (R) => (r(), P(He, {
                key: R.label,
                description: R.description,
                onClick: (G) => (W(), w({ ...z, ...R, menu: [] }))
              }, {
                default: q(() => [
                  U(v(R.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: q(() => [
              U(v(z.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (r(), P(ve, {
            key: 1,
            small: "",
            variant: z.primary ? "primary" : "ghost",
            bordered: !z.primary,
            class: Y({ danger: z.danger }),
            icon: b(z),
            disabled: p.value,
            title: y(z),
            "data-button": z.name,
            onClick: (W) => w(z)
          }, {
            default: q(() => [
              U(v(z.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        m.value && !e.readOnly && !e.externalFailure ? (r(), d("span", pm, v(m.value), 1)) : k("", !0),
        c.value && !e.readOnly ? (r(), P(dm, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: T[2] || (T[2] = (z) => c.value = null),
          onDone: T[3] || (T[3] = (z) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : k("", !0)
      ], 64))
    ], 10, fm));
  }
}, oo = /* @__PURE__ */ H(vm, [["__scopeId", "data-v-a4b6f174"]]), gm = {
  class: "running",
  "data-running-command": ""
}, ym = ["title"], bm = {
  key: "idle",
  class: "running-idle"
}, km = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (r(), d("span", gm, [
      A(Xt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: q(() => [
          e.text ? (r(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, v(e.text), 9, ym)) : (r(), d("span", bm, v(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, cC = /* @__PURE__ */ H(km, [["__scopeId", "data-v-d3240219"]]), wm = ["aria-checked", "disabled", "aria-label", "title"], $m = {
  key: 0,
  class: "switch-inner"
}, xm = {
  key: 0,
  class: "switch-word"
}, Sm = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, small: Boolean, beside: Boolean, disabled: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("button", {
      type: "button",
      class: Y(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      disabled: e.disabled,
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: s[0] || (s[0] = (o) => n("change", !e.on))
    }, [
      h("span", {
        class: Y(["switch", { on: e.on, labelled: e.labelled, large: e.large, small: e.small }])
      }, [
        e.labelled ? (r(), d("span", $m, v(e.word), 1)) : k("", !0),
        s[1] || (s[1] = h("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (r(), d("span", xm, v(e.word), 1)) : k("", !0)
    ], 10, wm));
  }
}, dC = /* @__PURE__ */ H(Sm, [["__scopeId", "data-v-92ae7767"]]), _m = { class: "notice-text" }, Mm = {
  key: 1,
  class: "notice-actions"
}, Cm = {
  __name: "Notice",
  props: {
    tone: { type: String, default: "muted" },
    icon: { type: String, default: "" }
  },
  setup(e) {
    const t = ["brief", "report", "wait", "danger", "info", "need", "ask"];
    return (n, a) => (r(), d("div", {
      class: Y(["notice", [`notice-${e.tone}`, { "notice-band": t.includes(e.tone) }]])
    }, [
      e.icon ? (r(), P(ie, {
        key: 0,
        name: e.icon,
        size: 18
      }, null, 8, ["name"])) : k("", !0),
      h("span", _m, [
        ae(n.$slots, "default", {}, void 0, !0)
      ]),
      n.$slots.actions ? (r(), d("span", Mm, [
        ae(n.$slots, "actions", {}, void 0, !0)
      ])) : k("", !0)
    ], 2));
  }
}, fC = /* @__PURE__ */ H(Cm, [["__scopeId", "data-v-445bd8a6"]]);
function Oi(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function oa(e, t) {
  return Oi(() => localStorage, e, t);
}
function Ti(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function lo(e, t) {
  return Ti(() => localStorage, e, t);
}
function Ii(e, t) {
  me(t, (n) => lo(e, n), { deep: !0 });
}
function Am(e, t) {
  return Oi(() => sessionStorage, e, t);
}
function Em(e, t) {
  return Ti(() => sessionStorage, e, t);
}
const la = "journal.environment", Bi = _(Am(la, oa(la, "")));
function Om(e) {
  Bi.value = e, Em(la, e), lo(la, e);
}
const ia = _(location.hash), Go = at(null), Ko = { integrations: "mcp", library: "team" };
function Tm() {
  if (!Go.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (Ko[n]) {
    location.replace(`#/${[Ko[n], ...a].join("/")}${t ? `?${t}` : ""}`), ia.value = location.hash;
    return;
  }
  !n || Go.value(n) || (Om(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), ia.value = location.hash);
}
window.addEventListener("hashchange", () => {
  ia.value = location.hash, Tm();
});
const ra = x(() => {
  const [e, t = ""] = ia.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [i, u = ""] = l.split("@"), [c = "", f = "", m = ""] = i.split(":");
    return { table: c, id: Number(f), comment: Number(m) || 0, env: u };
  });
  return {
    env: Bi.value,
    page: n,
    n: a ? /^\d+$/.test(a) ? Number(a) : a : 0,
    q: s.get("q") || "",
    sub: s.get("sub") || "",
    tab: s.get("tab") || "",
    row: s.get("row") || "",
    plugin: s.get("plugin") || "",
    install: s.get("install") || "",
    line: Number(s.get("line") || 0),
    at: s.get("at") || "",
    stack: o,
    open: o[o.length - 1] || null
  };
}), io = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${io.page(e)}?open=${t}`
};
function Im(e = "", t = 0, n = "") {
  location.hash = io.page(e, t, n);
}
function Bm(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const Rm = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Ri(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Rm).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
function Lm(e) {
  const [t, n = ""] = location.hash.replace(/^#/, "").split("?"), a = new URLSearchParams(n);
  a.set("row", String(e)), location.replace(`#${t}?${a}`);
}
const zt = {};
function mC(e, t) {
  return zt[e] = t, () => zt[e] === t && delete zt[e];
}
function $t(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = zt[e]) != null && l.call(zt, t))) return;
  const s = ra.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  Ri([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function Nm(e, t, n, a = 0, s = "") {
  if (e === ra.value.env) return $t(t, n, a, s);
  const o = ra.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Ri([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function Pe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? Nm(a, s, Number(o), 0, t) : $t(s, Number(o), 0, t);
}
function qm(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Ht(e) {
  const t = qm(e);
  t && Pe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function hC(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Dm = { class: "inspector-part" }, Pm = { class: "inspector-part-title" }, jm = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("section", Dm, [
      h("h4", Pm, v(e.title), 1),
      ae(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, pC = /* @__PURE__ */ H(jm, [["__scopeId", "data-v-5175e4a3"]]), Yo = /* @__PURE__ */ new Map(), Fm = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = _(null), a = _(!1), s = _(t.name && Yo.get(t.name) || !1);
    function o(u) {
      s.value = u, t.name && Yo.set(t.name, u);
    }
    const l = () => {
      const u = !!n.value && n.value.scrollHeight > t.at;
      u !== a.value && (a.value = u);
    }, i = new ResizeObserver(() => requestAnimationFrame(l));
    return Ce(() => n.value && i.observe(n.value.firstElementChild || n.value)), Le(() => i.disconnect()), (u, c) => (r(), d(B, null, [
      h("div", {
        ref_key: "body",
        ref: n,
        class: Y(["folded-body", { folded: a.value && !s.value }]),
        style: ge(a.value && !s.value ? { maxHeight: `${e.keep}px` } : {}),
        onReveal: c[0] || (c[0] = (f) => o(!0))
      }, [
        ae(u.$slots, "default", {}, void 0, !0)
      ], 38),
      a.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "fold",
        onClick: c[1] || (c[1] = ke((f) => o(!s.value), ["stop"]))
      }, v(s.value ? "Show less" : "Show more"), 1)) : k("", !0)
    ], 64));
  }
}, Li = /* @__PURE__ */ H(Fm, [["__scopeId", "data-v-4d2235ba"]]), Wm = ["aria-valuenow", "aria-valuemax"], Hm = {
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
    const t = e, n = x(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (a, s) => (r(), d("span", {
      class: Y(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      h("span", {
        class: "fill",
        style: ge({ width: n.value })
      }, null, 4)
    ], 10, Wm));
  }
}, Ni = /* @__PURE__ */ H(Hm, [["__scopeId", "data-v-9eba6a85"]]), zm = { processes: "process", memories: "memory", replies: "reply" }, ua = (e) => (zm[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), xs = [], Um = 2e3, pt = /* @__PURE__ */ new Map(), Vm = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Gm = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function qt(e, { first: t = !1 } = {}) {
  t ? xs.unshift(e) : xs.push(e), pt.clear();
}
function qi(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Km = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Ym = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function ct(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Qm(e, t) {
  const n = [{ type: "text", text: ct(e).replace(/\r\n/g, `
`) }];
  for (const a of xs)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.type !== "text") continue;
      const l = a(o.text, t);
      typeof l == "string" ? o.text = l : l && n.splice(s, 1, ...l);
    }
  return n;
}
function pn(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Xm(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Xm(e) {
  return e.split(Gm).map((t, n) => n % 2 ? t : t.replace(Vm, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Qo(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const Jm = 24;
function Zm(e) {
  const [t, , ...n] = e, a = Qo(t), s = n.map(Qo), o = (u) => [a, ...s].some((c) => (c[u] ?? "").length > Jm) ? ' class="text-column"' : "", l = a.map((u, c) => `<th${o(c)}>${pn(u)}</th>`).join(""), i = s.map((u) => `<tr>${u.map((c, f) => `<td${o(f)}>${pn(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const Di = /^\s*(?:[-*+]|\d+[.)])\s+/, Ss = /^\s*(\d+)[.)]\s/, Xo = (e) => e.match(/^\s*/)[0].length;
function Pi(e) {
  const t = e[0].match(Ss), n = Xo(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && Xo(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${pn(o.text)}${o.nested.length ? Pi(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function eh(e, t) {
  const n = Ss.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Di.test(e[s]) && Ss.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const Jo = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function ji(e) {
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
      const i = t.findIndex((c, f) => f > a && /^(```|~~~)/.test(c)), u = i < 0 ? t.length : i;
      n.push(`<pre><code>${t.slice(a + 1, u).join(`
`)}</code></pre>`), a = u + 1;
      continue;
    }
    const o = s.match(/^(#{1,6})\s+(.*)$/);
    if (o) {
      const i = Math.min(6, o[1].length + 2);
      n.push(`<h${i}>${pn(o[2])}</h${i}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (Jo(t, a)) {
      let i = a + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(Zm(t.slice(a, i))), a = i;
      continue;
    }
    if (Di.test(s)) {
      const i = eh(t, a);
      n.push(Pi(t.slice(a, i))), a = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let i = a;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${ji(
          t.slice(a, i).map((u) => u.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = i;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !Jo(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${pn(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const th = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, nh = (e) => e.type !== "text" && !th.test(e.html);
function ah(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(ji(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : nh(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function ro(e, t = { env: "" }) {
  const n = Ym(e, t), a = pt.get(n);
  if (pt.delete(n), a && a.source === t.source && a.reads.every((l) => Km(l, t)))
    return pt.set(n, a), a.html;
  const s = [], o = ah(Qm(e, { ...t, reads: s }));
  return pt.set(n, { html: o, reads: s, source: t.source }), pt.size > Um && pt.delete(pt.keys().next().value), o;
}
const Da = /* @__PURE__ */ new WeakMap();
function sh(e) {
  if (Da.has(e)) return Da.get(e);
  const t = Ou(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, f) => `${c}:${f}`;
  function o(c, f) {
    const m = s(c, f), p = e.read(`${ua(c)} show ${f}`);
    n.set(m, p), p.then((y) => {
      n.get(m) === p && (n.delete(m), t.set(m, y.ok ? { ...y.value, table: c } : null));
    });
  }
  function l(c) {
    a.has(c) || (a.add(c), e.follow([`${ua(c).replace(/-/g, "_")}.*`], (f) => {
      const m = `${c}:`;
      for (const p of t.keys()) {
        if (!p.startsWith(m)) continue;
        const y = Number(p.slice(m.length));
        (!f.row_id || f.row_id === y) && o(c, y);
      }
    }));
  }
  function i(c, f) {
    l(c);
    const m = s(c, f);
    return !t.has(m) && !n.has(m) && o(c, f), t.get(m);
  }
  const u = { id: Symbol("window text rows"), row: i };
  return Da.set(e, u), u;
}
function Fi() {
  const e = Me(Re, null), t = e ? sh(e) : null;
  return (n, a = {}) => ro(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Wi = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, An = (e) => String(e || "").replace(Wi, (t, n, a, s) => s), oh = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Wn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, lh = /^Traceback \(most recent call last\):/m, ih = 8;
function Hi(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, ih).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function rh(e) {
  const t = [...e.matchAll(oh)].map((a) => a.index);
  if (Wn.lastIndex = 0, !t.length || !Wn.test(e)) return null;
  Wn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(Wn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Hi(n), tail: "" } : null;
}
function uh(e) {
  const t = lh.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Hi([o]), tail: n.slice(s).join(`
`) };
}
qt((e) => {
  const t = An(e), n = uh(t) || rh(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const ca = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, zi = (e) => `${e.table}:${e.id}`, _s = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Pa = 80;
function Zo(e) {
  return e.length <= Pa ? e : `${e.slice(0, Pa + 1).replace(/\s+\S*$/, "") || e.slice(0, Pa)}…`;
}
const el = {
  messages: (e) => Zo(_s(e.text)),
  comments: (e) => Zo(_s(e.text)),
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
}, ch = (e) => (el[e.table] ? el[e.table](e) : e.title || "") || "", Rt = (e) => ca(e.created_at), dh = (e) => ca(e.updated_at) || Rt(e), fh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, mh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function hh(e) {
  const t = fh.exec(e);
  if (t && yt(t[1])) return { at: t.index, length: t[0].length, table: yt(t[1]), id: Number(t[2]), label: t[3] };
  const n = mh.exec(e), a = n && yt(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function ph(e, t, n, a) {
  const s = qi(a, e, t), o = An(s ? ch(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${ct(en(e).title)} ${t}</span><span class="row-card-title">${ct(o)}</span></a>`;
}
qt(
  (e, t) => {
    const n = hh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: ph(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const vh = /\.(png|jpe?g|gif|webp|svg)$/i, gh = (e) => vh.test(e), yh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, bh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function kh(e, t) {
  const n = yh.exec(e), [, a, s, o, l, i] = n || [], u = n && yt(a || o), c = u && qi(t, u, Number(s || l));
  if (u !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const f = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, m = `${en(u).title} ${c.id} · ${ct(i)}`, p = gh(i) ? `<img class="file-card-image" src="${f}" alt="${ct(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${ct(i)}">${p}<span class="file-card-name">${m}</span></a>` };
}
function wh(e) {
  const t = bh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${ct(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
qt(
  (e, t) => {
    if (t.inline) return null;
    const n = kh(e, t) || wh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const $h = /`([^`\n]+)`/g;
qt((e) => e.replace($h, (t, n) => `<code>${n}</code>`));
const tl = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${io.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
qt(
  (e, t) => e.replace(Wi, (n, a, s, o) => tl[a] ? tl[a](s, o, t) : o)
);
const xh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Ui = new RegExp(`\\b(${Ei}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Vi = new RegExp(`\\b(${Ei}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Sh = new RegExp(`<code>((?:${Ui.source}|${Vi.source}))</code>`, "gi"), _h = (e) => e.replace(Sh, "$1"), Mh = (e, t) => `<a class="row-pill" href="#" data-peek="${yt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Ch = (e) => e.replace(Vi, (t, n, a) => a.replace(/\d+/g, (s) => Mh(n.replace(/s$/i, ""), s))), Ah = (e) => Ch(e).replace(
  Ui,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${yt(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
qt(
  (e, t) => t.rowNames === !1 ? e : _h(e).split(xh).map((n, a) => a % 2 ? n : Ah(n)).join("")
);
const Eh = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Oh = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Th = /[\w\]]\(/, Ih = /^[\w$.[\]'"]+\s*=\s*[^=]/, Bh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Rh = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Lh = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Nh = /[[({,]$/, qh = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Dh = /^(\t|\s{2,})\S/, Ph = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, jh = /`[^`]+`/, Fh = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Wh = /[{}()[\];=<>$&|*\\@+^~%]/g, Gi = /^\s*(?:[-*+]|\d+[.)])\s/, Hh = /^\s*>/, zh = /^\s*\|/, Uh = 0.6, Vh = 0.4, Gh = 5, Kh = 0.03, Ki = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Gh && t.every((n) => Fh.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Wh) ?? []).length / e.length < Kh;
}, ja = (e) => {
  const t = e.trim();
  return jh.test(t) ? !1 : [Eh, Oh, Th, Ih, Bh, Rh, Lh, Nh, qh].some((n) => n.test(t)) || /[;{}]$/.test(t) || Dh.test(e) && !Gi.test(e) && !Ki(e);
};
function Yh(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Gi.test(t[0]) || t.every((o) => Hh.test(o) || zh.test(o))) return "text";
  const n = t.filter((o) => !Ph.test(o.trim()));
  if (t.length === 1) return !n.length || ja(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(ja).length, s = n.filter((o) => !ja(o) && Ki(o)).length;
  return a >= n.length * Uh && s <= n.length * Vh ? "code" : "text";
}
const Ms = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Qh = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Xh = `${Ms} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Jh = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Zh = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", nl = {
  js: { keywords: Ms, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Qh, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Xh, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Ms, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Jh, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Zh, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, ep = {
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
function al(e, t, n) {
  return n && e.startsWith(n, t);
}
function tp(e, t) {
  const n = nl[ep[t] ?? t] || nl.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
  let o = 0;
  const l = (i, u) => u && s.push({ type: i, value: u });
  for (; o < e.length; ) {
    const i = e[o];
    if (n.markdown) {
      const c = e.indexOf(`
`, o), f = e.slice(o, c < 0 ? e.length : c);
      l(
        /^#{1,6}\s/.test(f) ? "keyword" : /^(```|~~~)/.test(f) ? "comment" : /^\s*([-*+]|\d+\.)\s/.test(f) ? "number" : "plain",
        f
      ), l("plain", c < 0 ? "" : `
`), o = c < 0 ? e.length : c + 1;
      continue;
    }
    if (al(e, o, n.line) || n.hash && i === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && al(e, o, n.block[0])) {
      const c = e.indexOf(n.block[1], o + n.block[0].length), f = c < 0 ? e.length : c + n.block[1].length;
      l("comment", e.slice(o, f)), o = f;
      continue;
    }
    const u = (n.triple || []).find((c) => e.startsWith(c, o));
    if (u) {
      const c = e.indexOf(u, o + 3), f = c < 0 ? e.length : c + 3;
      l("string", e.slice(o, f)), o = f;
      continue;
    }
    if (n.quotes.includes(i)) {
      let c = o + 1;
      for (; c < e.length && e[c] !== i && (i === "`" || e[c] !== `
`); ) c += e[c] === "\\" ? 2 : 1;
      l(n.keyed && /^\s*:/.test(e.slice(c + 1)) ? "property" : "string", e.slice(o, c + 1)), o = c + 1;
      continue;
    }
    if (n.tags && i === "<" && /[A-Za-z/!?]/.test(e[o + 1] || "")) {
      const c = e.slice(o).match(/^<\/?[\w:-]+/);
      l("keyword", c[0]), o += c[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(i)) {
      const f = e.slice(o).match(/^[\w$]+/)[0], m = n.lower ? f.toLowerCase() : f, p = n.property && /^\s*:/.test(e.slice(o + f.length));
      l(a.has(m) ? "keyword" : p ? "property" : /^[A-Z]/.test(f) && t !== "text" ? "type" : "plain", f), o += f.length;
      continue;
    }
    if (/\d/.test(i)) {
      const c = e.slice(o).match(/^(0x[\da-fA-F]+|\d[\d_]*(\.\d+)?([eE][+-]?\d+)?)/);
      l("number", c[0]), o += c[0].length;
      continue;
    }
    if (n.tags && (i === ">" || e.startsWith("/>", o))) {
      const c = i === ">" ? 1 : 2;
      l("keyword", e.slice(o, o + c)), o += c;
      continue;
    }
    l("plain", i), o += 1;
  }
  return s;
}
function np(e, t) {
  const n = [""];
  for (const { type: a, value: s } of tp(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? ct(l) : `<span class="tok-${a}">${ct(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function ap(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const sp = 1500, sl = /* @__PURE__ */ new WeakMap();
async function op(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await ap(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(sl.get(t)), sl.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, sp)
  )));
}
typeof document < "u" && document.addEventListener("click", op, !0);
const lp = /\n\s*\n/, ip = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, rp = /^\s*(`{3,}|~{3,})\s*$/, up = /^\s{4,}\S/, cp = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Cs = /^\s*(?:[-*+]|\d+[.)])\s/, Yi = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, dp = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function uo(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function fp(e) {
  const t = uo(e.join(`
`));
  return (dp.find(([, n]) => n.test(t)) || ["text"])[0];
}
const mp = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Yi.test(t) && !Cs.test(t);
}, hp = (e, t) => Cs.test(t) || Cs.test([...e].reverse().find((n) => n.trim()) || "");
function co(e, t) {
  const n = t || fp(e), a = np(uo(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function pp(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && rp.test(s));
  return a < 0 ? e.length : a;
}
function vp(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return co(a.map(An), n ? n.toLowerCase() : "");
}
function gp(e) {
  const t = e.split(lp).map((l) => ({ paragraph: l, type: Yh(uo(l).split(`
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
    const i = t.slice(o, l);
    if (i.some(({ type: u }) => u === "code") || i.length > 1) {
      s(), n.push(co(i.map(({ paragraph: u }) => u).join(`

`).split(`
`).map(An), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function yp(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : gp(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const i = n[l].match(ip);
    if (i) {
      const c = pp(n, l, i[2]);
      o(), a.push(vp(n.slice(l + 1, c), i[1], i[3])), l = c + 1;
      continue;
    }
    const u = mp(s) ? cp : up;
    if (!t && u.test(n[l]) && !hp(s, n[l])) {
      let c = l;
      for (; c < n.length && (u.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const f = [];
      for (; s.length && s[s.length - 1].trim() && Yi.test(s[s.length - 1].trim()); ) f.unshift(s.pop());
      if (c - l + f.length >= 2) {
        o(), a.push(co([...f, ...n.slice(l, c)].map(An), "")), l = c;
        continue;
      }
      s.push(...f);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
qt((e, t) => yp(e, t.document), { first: !0 });
const bp = ["innerHTML"], kp = ["innerHTML"], wp = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Fi(), a = x(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (r(), d("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => I(Ht) && I(Ht)(...l)),
      innerHTML: a.value
    }, null, 8, bp)) : (r(), d("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => I(Ht) && I(Ht)(...l)),
      innerHTML: a.value
    }, null, 8, kp));
  }
}, rt = /* @__PURE__ */ H(wp, [["__scopeId", "data-v-d8e75741"]]), vC = (e) => [...new Set(e.agents.map((t) => t.name))], Fa = (e) => new Set(e.agents.map((t) => t.id)).size === 1 ? e.agents[0] : null, $p = "main agent", fo = (e, t) => t ? $p : e, xp = ["data-agent-main"], Sp = {
  key: 0,
  class: "agent-badge-icon",
  "data-agent-main-icon": "",
  width: "14",
  height: "14",
  viewBox: "0 0 16 16",
  fill: "currentColor",
  "aria-hidden": "true"
}, _p = {
  key: 2,
  class: "agent-badge-name",
  "data-agent-badge-name": ""
}, Mp = {
  __name: "AgentBadge",
  props: { name: { type: String, required: !0 }, main: Boolean, iconOnly: Boolean },
  setup(e) {
    const t = e, n = x(() => fo(t.name, t.main));
    return (a, s) => (r(), d("span", {
      class: Y(["agent-badge", { main: e.main }]),
      "data-agent-badge": "",
      "data-agent-main": e.main ? "" : null
    }, [
      e.main ? (r(), d("svg", Sp, [...s[0] || (s[0] = [
        h("circle", {
          cx: "8",
          cy: "4.8",
          r: "3.3"
        }, null, -1),
        h("path", { d: "M1.8 14.6c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6c0 .4-.3.7-.7.7H2.5c-.4 0-.7-.3-.7-.7z" }, null, -1)
      ])])) : (r(), P(ie, {
        key: 1,
        class: "agent-badge-icon",
        name: "agent",
        size: 14
      })),
      e.iconOnly ? k("", !0) : (r(), d("span", _p, v(n.value), 1))
    ], 10, xp));
  }
}, Ut = /* @__PURE__ */ H(Mp, [["__scopeId", "data-v-a4c3d1e5"]]), Cp = ["failed", "blocked", "problem", "update", "paused", "holding", "waiting", "asks"], Qi = { danger: "failed", warn: "waiting" }, Ap = (e) => Cp.includes(Qi[e] ?? e), Xi = (e) => Ap(e) ? ["badge", Qi[e] ?? e] : ["badge-quiet"], Ep = ["aria-expanded"], Op = {
  key: 0,
  class: "state-tip",
  role: "tooltip",
  "data-state-tip": ""
}, Tp = {
  key: 0,
  class: "tip-failure"
}, Ip = {
  __name: "StateBadge",
  props: { type: { type: String, required: !0 }, state: { type: String, required: !0 }, rowId: { type: Number, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    const t = e, n = Me(Re, null), a = x(() => of(t.type, t.state)), s = x(() => Xi(Zs(t.type, t.state))), o = _(!1), l = _([]), i = _("");
    async function u() {
      o.value = !0;
      const m = await (t.read ?? n.read)(a.value.replace("{row_id}", t.rowId));
      i.value = m.ok ? "" : m.error, m.ok && (l.value = m.value.lines ?? []);
    }
    const c = () => o.value = !1, f = () => o.value ? c() : u();
    return (m, p) => a.value ? (r(), d("span", {
      key: 0,
      class: Y(["state-badge", ...s.value]),
      tabindex: "0",
      role: "button",
      "aria-expanded": o.value,
      "data-state-badge": "",
      onMouseenter: u,
      onMouseleave: c,
      onFocus: u,
      onBlur: c,
      onClick: f,
      onKeydown: Ot(c, ["escape"])
    }, [
      U(v(I(hn)(e.type, e.state)) + " ", 1),
      o.value ? (r(), d("span", Op, [
        i.value ? (r(), d("span", Tp, v(i.value), 1)) : k("", !0),
        (r(!0), d(B, null, X(l.value, (y) => (r(), d("span", {
          key: y,
          class: "tip-line"
        }, v(y), 1))), 128))
      ])) : k("", !0)
    ], 42, Ep)) : (r(), d("span", {
      key: 1,
      class: Y(s.value)
    }, v(I(hn)(e.type, e.state)), 3));
  }
}, Bp = /* @__PURE__ */ H(Ip, [["__scopeId", "data-v-d276694c"]]), Rp = {
  class: "plan-details",
  "data-plan-details": ""
}, Lp = { class: "state-line" }, Np = {
  key: 0,
  class: "phase-count"
}, qp = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, Dp = { class: "text" }, Pp = {
  key: 1,
  class: "note",
  "data-plan-waits-on": ""
}, jp = {
  key: 2,
  class: "part",
  "data-plan-progress": ""
}, Fp = { class: "overall" }, Wp = { class: "overall-figure" }, Hp = {
  key: 3,
  class: "delegation",
  "data-plan-assignee": ""
}, zp = {
  key: 4,
  class: "delegation",
  "data-plan-delegated": ""
}, Up = {
  key: 5,
  class: "part"
}, Vp = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    return (t, n) => {
      var a;
      return r(), d("div", Rp, [
        h("div", Lp, [
          A(Bp, {
            type: "plan",
            state: e.plan.state,
            "row-id": e.plan.id,
            read: e.read,
            class: Y(["status", I(Zs)("plan", e.plan.state)]),
            "data-plan-status": ""
          }, null, 8, ["state", "row-id", "read", "class"]),
          e.plan.current_phase ? (r(), d("span", Np, "Phase " + v(e.plan.current_phase) + " of " + v(e.plan.phases.length), 1)) : k("", !0)
        ]),
        e.plan.reason ? (r(), d("section", qp, [
          h("h4", null, v(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
          h("p", Dp, v(e.plan.reason), 1)
        ])) : k("", !0),
        (a = e.plan.blocker_ids) != null && a.length ? (r(), d("p", Pp, "Opens by itself when " + v(e.plan.blocker_ids.map((s) => `plan ${s}`).join(" and ")) + " " + v(e.plan.blocker_ids.length === 1 ? "ends" : "have ended") + ".", 1)) : k("", !0),
        e.plan.total ? (r(), d("section", jp, [
          n[0] || (n[0] = h("h4", null, "Progress", -1)),
          h("div", Fp, [
            A(Ni, {
              value: e.plan.finished,
              max: e.plan.total
            }, null, 8, ["value", "max"]),
            h("span", Wp, v(e.plan.finished) + " of " + v(e.plan.total) + " done", 1)
          ])
        ])) : k("", !0),
        e.plan.assignee ? (r(), d("p", Hp, [
          A(Ut, {
            name: e.plan.assignee.name,
            main: e.plan.assignee.main
          }, null, 8, ["name", "main"])
        ])) : e.plan.delegated ? (r(), d("p", zp, [
          I(Fa)(e.plan) ? (r(), P(Ut, {
            key: 0,
            name: I(Fa)(e.plan).name,
            main: I(Fa)(e.plan).main
          }, null, 8, ["name", "main"])) : (r(), d(B, { key: 1 }, [
            U(" Delegated ")
          ], 64))
        ])) : k("", !0),
        e.plan.brief ? (r(), d("section", Up, [
          n[1] || (n[1] = h("h4", null, "The brief", -1)),
          A(Li, {
            name: `plans:${e.plan.id}:brief`,
            at: 220,
            keep: 160
          }, {
            default: q(() => [
              A(rt, {
                class: "text",
                "data-resource-text": "",
                text: e.plan.brief
              }, null, 8, ["text"])
            ]),
            _: 1
          }, 8, ["name"])
        ])) : k("", !0)
      ]);
    };
  }
}, gC = /* @__PURE__ */ H(Vp, [["__scopeId", "data-v-52683b11"]]), Gp = {
  __name: "HoverTip",
  props: { as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    return (t, n) => (r(), P(Qe(e.as), {
      type: e.as === "button" ? "button" : void 0,
      class: "tipped"
    }, {
      default: q(() => [
        ae(t.$slots, "default", {}, void 0, !0),
        h("span", {
          class: Y(["tip", e.place]),
          role: "tooltip"
        }, [
          ae(t.$slots, "tip", {}, void 0, !0)
        ], 2)
      ]),
      _: 3
    }, 8, ["type"]));
  }
}, Kp = /* @__PURE__ */ H(Gp, [["__scopeId", "data-v-683e1839"]]), Ji = (e) => `row:${e}`, Yp = 5e3, Qp = "cancelled", Wa = /* @__PURE__ */ new Map();
async function Xp(e, t) {
  const n = `${e.environment}:${t}`, a = Wa.get(n);
  if (a && performance.now() - a.at < Yp) {
    const o = await a.answer;
    if (o.failure !== Qp) return o;
    Wa.delete(n);
  }
  const s = e.read(`agent tip ${Ji(t)}`);
  return Wa.set(n, { answer: s, at: performance.now() }), s;
}
function Jp(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function En(e, t = Date.now()) {
  const n = Jp(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const Zp = 36e5;
function e1(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / Zp;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function ol(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function Zi(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function ll(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const Ha = (e) => String(e).padStart(2, "0");
function er(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Ha(t % 60)}s` : `${Math.floor(t / 3600)}h ${Ha(Math.floor(t % 3600 / 60))}m ${Ha(t % 60)}s`;
}
const t1 = { working: { state: "working", words: "Working" }, paused: { state: "paused", words: "Paused" }, "at usage limit": { state: "limited", words: "At usage limit" }, ended: { state: "idle", words: "Idle" } }, n1 = { state: "retired", words: "Retired" }, a1 = (e) => e.retired ? n1 : t1[e.activity], s1 = (e) => [e.program, e.model, e.effort, e.role_label].filter(Boolean).join(", "), o1 = (e, t) => e ? `Since: ${new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${En(e, t)}` : "", l1 = (e, t) => e ? `Seen: ${En(e, t)}` : "", i1 = {
  class: "line head",
  "data-agent-tip-head": ""
}, r1 = { key: 0 }, u1 = {
  class: "line",
  "data-agent-tip-identity": ""
}, c1 = {
  class: "line status",
  "data-agent-tip-status": ""
}, d1 = ["data-state"], f1 = {
  key: 0,
  class: "line",
  "data-agent-tip-since": ""
}, m1 = {
  key: 1,
  class: "line",
  "data-agent-tip-seen": ""
}, h1 = {
  key: 1,
  class: "line",
  "data-agent-tip-head": ""
}, p1 = {
  key: 2,
  class: "line failure",
  "data-agent-tip-failure": ""
}, v1 = {
  __name: "AgentTip",
  props: { agentId: { type: Number, required: !0 }, label: { type: String, default: "" }, as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    const t = e, n = Me(Re, null), a = _(!1), s = _(null), o = _(""), l = _(Date.now()), i = x(() => a1(s.value)), u = x(() => o1(s.value.since, l.value)), c = x(() => l1(s.value.last_seen, l.value));
    async function f() {
      if (a.value = !0, !n) return;
      const m = await Xp(n, t.agentId);
      o.value = m.ok ? "" : m.error, m.ok && (l.value = Date.now(), s.value = m.value);
    }
    return (m, p) => (r(), P(Kp, {
      as: e.as,
      place: e.place,
      class: "agent-tip",
      "data-agent-tip": "",
      onMouseenter: f,
      onFocusin: f
    }, wa({
      default: q(() => [
        ae(m.$slots, "default", {}, void 0, !0)
      ]),
      _: 2
    }, [
      a.value ? {
        name: "tip",
        fn: q(() => [
          s.value ? (r(), d(B, { key: 0 }, [
            h("span", i1, [
              h("b", null, v(s.value.title), 1),
              p[0] || (p[0] = U()),
              s.value.name ? (r(), d("span", r1, v(s.value.name), 1)) : k("", !0)
            ]),
            h("span", u1, v(I(s1)(s.value)), 1),
            h("span", c1, [
              h("i", {
                "data-state": i.value.state
              }, null, 8, d1),
              U(v(i.value.words), 1)
            ]),
            u.value ? (r(), d("span", f1, v(u.value), 1)) : k("", !0),
            c.value ? (r(), d("span", m1, v(c.value), 1)) : k("", !0)
          ], 64)) : (r(), d("b", h1, v(e.label), 1)),
          o.value ? (r(), d("span", p1, v(o.value), 1)) : k("", !0)
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["as", "place"]));
  }
}, vn = /* @__PURE__ */ H(v1, [["__scopeId", "data-v-71d17663"]]), g1 = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, y1 = { class: "agent-word" }, b1 = {
  __name: "PlanPhaseAgents",
  props: { tasks: { type: Array, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["started", "testing"]), n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = x(() => {
      var l;
      const o = /* @__PURE__ */ new Map();
      for (const i of a.tasks.filter((u) => u.helper_id && !n.has(u.state))) {
        const u = ((l = o.get(i.helper_id)) == null ? void 0 : l.held) || t.has(i.state);
        o.set(i.helper_id, { id: i.helper_id, name: i.helper_name, main: i.helper_main, held: u });
      }
      return [...o.values()];
    });
    return (o, l) => s.value.length ? (r(), d("div", g1, [
      (r(!0), d(B, null, X(s.value, (i) => (r(), P(vn, {
        key: i.id,
        as: "button",
        "agent-id": i.id,
        label: I(fo)(i.name, i.main),
        class: "phase-agent",
        "data-plan-phase-agent": "",
        onClick: (u) => I(Pe)(`agents:${i.id}`)
      }, {
        default: q(() => [
          h("span", {
            class: Y(["agent-dot", { held: i.held }])
          }, null, 2),
          A(Ut, {
            name: i.name,
            main: i.main
          }, null, 8, ["name", "main"]),
          h("span", y1, v(i.held ? "Working" : "Queued"), 1)
        ]),
        _: 2
      }, 1032, ["agent-id", "label", "onClick"]))), 128))
    ])) : k("", !0);
  }
}, k1 = /* @__PURE__ */ H(b1, [["__scopeId", "data-v-619caeed"]]), w1 = { class: "phases" }, $1 = { class: "phead" }, x1 = { class: "mark" }, S1 = { class: "ptitle" }, _1 = { class: "phead-end" }, M1 = {
  key: 0,
  class: "checkpoint"
}, C1 = { class: "progress" }, A1 = {
  key: 0,
  class: "when"
}, E1 = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["completed", "cancelled"]), n = (s) => s.tasks.filter((o) => t.has(o.state)).length, a = (s) => s.tasks.length > 0 && n(s) === s.tasks.length;
    return (s, o) => (r(), d("ol", w1, [
      (r(!0), d(B, null, X(e.phases, (l, i) => (r(), d("li", {
        key: l.id,
        class: Y(["phase", { current: i + 1 === e.currentPhase, done: a(l) }]),
        "data-resource-phase": ""
      }, [
        h("div", $1, [
          h("span", x1, [
            A(ie, {
              name: a(l) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          h("span", S1, v(i + 1) + ". " + v(l.title), 1),
          h("span", _1, [
            l.checkpoint ? (r(), d("span", M1, "checkpoint")) : k("", !0),
            h("span", C1, v(n(l)) + "/" + v(l.tasks.length), 1)
          ])
        ]),
        l.goal ? (r(), d("div", A1, v(l.goal), 1)) : k("", !0),
        A(k1, {
          tasks: l.tasks
        }, null, 8, ["tasks"]),
        (r(!0), d(B, null, X(l.tasks, (u) => ae(s.$slots, "task", { task: u }, void 0, !0, u.id)), 128))
      ], 2))), 128))
    ]));
  }
}, yC = /* @__PURE__ */ H(E1, [["__scopeId", "data-v-05aaa685"]]), O1 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, T1 = { ...O1, done: "Completed" }, I1 = /* @__PURE__ */ new Set(["completed", "cancelled"]), B1 = (e) => I1.has(e), gn = (e) => B1(e) ? "done" : e, R1 = { class: "task-status-icon" }, L1 = ["width", "height", "aria-label"], N1 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = x(() => Zs("task", gn(t.status))), a = x(() => n.value === "testing" ? "started" : n.value), s = x(() => T1[t.status] ?? hn("task", t.status));
    return (o, l) => (r(), d("span", R1, [
      A(Xt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: q(() => [
          (r(), d("svg", {
            key: n.value,
            class: Y(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            A(Jt, { value: a.value }, {
              blocked: q(() => [...l[0] || (l[0] = [
                h("circle", {
                  cx: "6.3",
                  cy: "8",
                  r: "4.7",
                  class: "stroke"
                }, null, -1),
                h("rect", {
                  x: "10.8",
                  y: "7.3",
                  width: "3.2",
                  height: "1.4",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                h("circle", {
                  cx: "14.5",
                  cy: "8",
                  r: "1.25",
                  class: "fill"
                }, null, -1)
              ])]),
              done: q(() => [...l[1] || (l[1] = [
                h("circle", {
                  cx: "8",
                  cy: "8",
                  r: "6.3",
                  class: "fill"
                }, null, -1),
                h("polyline", {
                  points: "5.3,8.2 7.2,10 10.7,6.2",
                  class: "tick"
                }, null, -1)
              ])]),
              started: q(() => [...l[2] || (l[2] = [
                h("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                h("path", {
                  d: "M8 4.2 A3.8 3.8 0 0 1 8 11.8 Z",
                  class: "fill"
                }, null, -1)
              ])]),
              asked: q(() => [...l[3] || (l[3] = [
                h("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                h("rect", {
                  x: "7.3",
                  y: "4.8",
                  width: "1.4",
                  height: "3.6",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                h("circle", {
                  cx: "8",
                  cy: "10.5",
                  r: "0.9",
                  class: "fill"
                }, null, -1)
              ])]),
              paused: q(() => [...l[4] || (l[4] = [
                h("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                h("rect", {
                  x: "6",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1),
                h("rect", {
                  x: "8.7",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1)
              ])]),
              planned: q(() => [...l[5] || (l[5] = [
                h("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: q(() => [...l[6] || (l[6] = [
                h("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, L1))
        ]),
        _: 1
      })
    ]));
  }
}, _a = /* @__PURE__ */ H(N1, [["__scopeId", "data-v-ae24a63f"]]), q1 = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, D1 = {
  key: 0,
  class: "empty",
  role: "alert"
}, P1 = {
  key: 2,
  class: "empty"
}, j1 = { class: "day" }, F1 = { class: "events" }, W1 = { class: "mark" }, H1 = { class: "what" }, z1 = { class: "head" }, U1 = { class: "word" }, V1 = ["title", "onClick"], G1 = { class: "at" }, K1 = {
  __name: "PlanTimeline",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = {
      made: { state: "open", word: "Made" },
      logged: { icon: "edits", word: "Logged" },
      completed: { state: "completed", word: "Finished" },
      cancelled: { state: "cancelled", word: "Cancelled" }
    }, a = e, s = t, o = _(null), l = _(""), i = x(() => {
      const f = /* @__PURE__ */ new Map();
      for (const m of o.value ?? []) {
        const p = new Date(m.time).toLocaleDateString(void 0, { weekday: "long", month: "long", day: "numeric" });
        f.set(p, [...f.get(p) ?? [], m]);
      }
      return [...f].map(([m, p]) => ({ day: m, items: p }));
    }), u = (f) => new Date(f).toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
    async function c() {
      const f = await a.read(["plan", "timeline", String(a.id)]);
      l.value = f.ok ? "" : f.error, o.value = f.ok ? f.value.events : [];
    }
    return me(() => a.id, c, { immediate: !0 }), (f, m) => (r(), d("section", q1, [
      l.value ? (r(), d("p", D1, v(l.value), 1)) : o.value === null ? (r(), P(Ze, { key: 1 })) : o.value.length ? k("", !0) : (r(), d("p", P1, "Nothing has happened on this plan's tasks yet.")),
      (r(!0), d(B, null, X(i.value, (p) => (r(), d(B, {
        key: p.day
      }, [
        h("h3", j1, v(p.day), 1),
        h("ol", F1, [
          (r(!0), d(B, null, X(p.items, (y) => (r(), d("li", {
            key: `${y.time}-${y.event_type}-${y.task_id}`,
            class: Y(["event", y.event_type]),
            "data-plan-event": ""
          }, [
            h("span", W1, [
              n[y.event_type].state ? (r(), P(_a, {
                key: 0,
                status: n[y.event_type].state
              }, null, 8, ["status"])) : (r(), P(ie, {
                key: 1,
                name: n[y.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            h("div", H1, [
              h("div", z1, [
                h("span", U1, v(n[y.event_type].word), 1),
                h("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${y.task_id}`,
                  onClick: (b) => s("select", y.task_id)
                }, "#" + v(y.task_id) + " " + v(y.title), 9, V1),
                h("span", G1, v(u(y.time)), 1)
              ]),
              y.text ? (r(), P(rt, {
                key: 0,
                class: "text",
                text: y.text
              }, null, 8, ["text"])) : k("", !0)
            ])
          ], 2))), 128))
        ])
      ], 64))), 128))
    ]));
  }
}, bC = /* @__PURE__ */ H(K1, [["__scopeId", "data-v-9e511133"]]), Y1 = 1e3;
function tr() {
  const e = _(Date.now()), t = setInterval(() => e.value = Date.now(), Y1);
  return st(() => clearInterval(t)), e;
}
const Q1 = Symbol("resource-subscriptions");
function X1() {
  const e = Me(Q1, null);
  if (e) return (a, s) => e.follow("resources", a, s);
  const t = Me(Re, null);
  if (t) return (a, s) => t.subscriptions.follow(t.window, a, s);
  const n = new ii();
  return (a, s) => n.follow("resources", a, s);
}
function On(e, t, n = () => !0) {
  const a = Ks(t, 100), s = X1()(e, (o) => {
    n(o) && a();
  });
  $a(() => {
    s(), a.cancel();
  });
}
function J1(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const nr = { compact: "Compaction", clear: "Clear" }, Z1 = { stop_limit: "The journal, at the context size", hard_stop: "The journal, at the second context size", person: "A user, in the viewer", auto: "The program", terminal_person: "A user, in the terminal", headless_program: "The journal, before the next job" }, ev = { requested: "Asked, not started yet", started: "Running", ended: "Ended, size not read yet", measured: "Done", unreduced: "Done, context not smaller", failed: "Failed", abandoned: "Given up" };
function tv(e) {
  return e != null && e.is_open ? `${nr[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
function nv(e) {
  if (!e) return [];
  const t = [["Last context change", `${nr[e.change]}: ${ev[e.state]}`], ["Asked by", Z1[e.reason]], ["Asked", new Date(e.requested_at).toLocaleString()]];
  return e.request_tokens != null && t.push(["Size at the request", `${e.request_tokens} tokens`]), e.tokens_after != null && t.push(["Size after", `${e.tokens_after} tokens`]), t;
}
const av = "Not known", sv = 80, ov = 1e3, lv = "worker", iv = "main", rv = /* @__PURE__ */ new Set(["waiting", "blocked", "at usage limit"]), uv = (e) => e.ok ? e.value.rows : [], cv = (e, t) => e.ended_at ? "ended" : e.paused_at || rv.has(t == null ? void 0 : t.state) ? "waiting" : "running", ar = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function dv({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / ov, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: er(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > sv }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? av : `$${t.cost_dollars.toFixed(2)}` }), e.role === lv && l.push({ key: "pace", label: "Tasks an hour", value: String(e1(ar(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === iv && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function fv(e) {
  const t = ar(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function mv(e, t, n = null) {
  const a = [["Number", String(e.number)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && a.push(["Parent agent", `Agent ${e.parent_id}`]), a.push(["Started by", t.started_by], ["Started", ol(e.created_at)]), e.ended_at && a.push(["Ended", ol(e.ended_at)]), e.pid && a.push(["Process", `pid ${e.pid}`]), a.push(...nv(n)), a;
}
const hv = { class: "band" }, pv = { key: 0 }, vv = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (r(), d("h2", hv, [
      A(ie, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      ae(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (r(), d("span", pv, v(e.count), 1)) : k("", !0)
    ]));
  }
}, Lt = /* @__PURE__ */ H(vv, [["__scopeId", "data-v-1758914f"]]), gv = { class: "number" }, yv = { class: "text" }, bv = 150, kv = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = _(!1), a = x(() => t.text.length > bv), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (r(), d(B, null, [
      e.text ? (r(), d(B, { key: 0 }, [
        A(Lt, { icon: "file" }, {
          default: q(() => [
            U(v(e.label), 1)
          ]),
          _: 1
        }),
        h("div", {
          class: Y(["brief", { clamp: !n.value }]),
          "data-agent-brief": ""
        }, v(e.text), 3),
        a.value && !n.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          "data-agent-brief-more": "",
          onClick: l[0] || (l[0] = (i) => n.value = !0)
        }, "Show all")) : k("", !0)
      ], 64)) : k("", !0),
      e.points.length ? (r(), d(B, { key: 1 }, [
        A(Lt, { icon: "points" }, {
          default: q(() => [...l[1] || (l[1] = [
            U("Points to prove", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(B, null, X(e.points, (i) => {
          var u;
          return r(), d("p", {
            key: i.id,
            class: "point",
            "data-agent-point": ""
          }, [
            h("span", gv, v(i.id), 1),
            h("span", yv, [
              U(v(i.text), 1),
              h("span", {
                class: Y(["proof", { checked: ((u = i.proof) == null ? void 0 : u.state) === "checked" }])
              }, v(s(i)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : k("", !0)
    ], 64));
  }
}, wv = /* @__PURE__ */ H(kv, [["__scopeId", "data-v-c99de22c"]]), $v = ["aria-expanded"], xv = { class: "count" }, Sv = {
  key: 0,
  "data-agent-fold-body": ""
}, _v = {
  __name: "AgentFold",
  props: /* @__PURE__ */ Tt({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = Gt(e, "open");
    return (n, a) => (r(), d(B, null, [
      h("button", {
        type: "button",
        class: Y(["fold", { shut: !t.value }]),
        "aria-expanded": t.value,
        "data-agent-fold": "",
        onClick: a[0] || (a[0] = (s) => t.value = !t.value)
      }, [
        A(ie, {
          name: e.icon,
          size: 12
        }, null, 8, ["name"]),
        U(v(e.label), 1),
        h("span", xv, v(e.count), 1),
        A(ie, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, $v),
      t.value ? (r(), d("div", Sv, [
        ae(n.$slots, "default", {}, void 0, !0)
      ])) : k("", !0)
    ], 64));
  }
}, za = /* @__PURE__ */ H(_v, [["__scopeId", "data-v-7f93d8d9"]]), Mv = ["onClick"], Cv = { class: "text" }, Av = { class: "aside" }, Ev = {
  key: 0,
  class: "none"
}, Ov = {
  class: "skills",
  "data-agent-skills": ""
}, Tv = {
  key: 0,
  class: "none-inline"
}, Iv = { class: "label" }, Bv = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = Qt({ helpers: !1, skills: !1 }), a = _([]), s = _([]), o = async (l) => uv(await t.read(l));
    return me(() => [n.helpers, t.loads], async ([l]) => {
      l && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), me(() => [n.skills, t.loads], async ([l]) => {
      l && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    }), (l, i) => (r(), d(B, null, [
      A(za, {
        open: n.helpers,
        "onUpdate:open": i[0] || (i[0] = (u) => n.helpers = u),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: q(() => [
          (r(!0), d(B, null, X(a.value, (u) => (r(), d("button", {
            key: u.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (c) => I($t)("agents", u.id)
          }, [
            h("span", Cv, v(I(Kt)(u).title), 1),
            h("span", Av, v(I(Kt)(u).subtext), 1)
          ], 8, Mv))), 128)),
          a.value.length ? k("", !0) : (r(), d("p", Ev, "It started no helpers."))
        ]),
        _: 1
      }, 8, ["open", "count"]),
      A(za, {
        open: n.skills,
        "onUpdate:open": i[1] || (i[1] = (u) => n.skills = u),
        icon: "style",
        label: "Skills loaded",
        count: e.counts.skills
      }, {
        default: q(() => [
          h("p", Ov, [
            (r(!0), d(B, null, X(s.value, (u) => (r(), d("span", {
              key: u.id,
              "data-agent-skill": ""
            }, v(u.skill), 1))), 128)),
            s.value.length ? k("", !0) : (r(), d("span", Tv, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      A(za, {
        icon: "rules",
        label: "Details",
        count: e.details.length
      }, {
        default: q(() => [
          (r(!0), d(B, null, X(e.details, ([u, c, f]) => (r(), d("div", {
            key: u,
            class: "detail",
            "data-agent-detail": ""
          }, [
            h("span", Iv, v(u) + ":", 1),
            h("span", {
              class: Y(["value", f])
            }, v(c), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, Rv = /* @__PURE__ */ H(Bv, [["__scopeId", "data-v-1281605f"]]), Lv = ["datetime", "title"], Je = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = tr(), a = x(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (r(), d("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, v(I(En)(e.at, I(n))), 9, Lv));
  }
}, Nv = {
  class: "now",
  "data-agent-now": ""
}, qv = {
  key: 1,
  class: "muted"
}, Dv = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, Pv = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, jv = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, Fv = { class: "line" }, Wv = { class: "detail" }, Hv = { class: "bar" }, zv = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = x(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = x(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (r(), d(B, null, [
      A(Lt, { icon: "play" }, {
        default: q(() => [...o[2] || (o[2] = [
          U("Doing now", -1)
        ])]),
        _: 1
      }),
      h("div", Nv, [
        e.inspection.task ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => I($t)("tasks", e.inspection.task.id))
        }, "Task " + v(e.inspection.task.id) + ": " + v(e.inspection.task.title), 1)) : (r(), d("span", qv, v(e.nothing), 1)),
        n.value ? (r(), d("span", Dv, v(n.value), 1)) : k("", !0),
        e.inspection.last_activity ? (r(), d("span", Pv, [
          o[3] || (o[3] = U("Seen: ", -1)),
          A(Je, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : k("", !0)
      ]),
      e.inspection.plan ? (r(), d("div", jv, [
        h("div", Fv, [
          h("span", null, "Plan " + v(e.inspection.plan.id) + ", phase " + v(e.inspection.plan.phase), 1),
          h("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => I($t)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        h("span", Wv, v(e.inspection.plan.done) + " of " + v(e.inspection.plan.total) + " tasks done", 1),
        h("div", Hv, [
          h("i", {
            style: ge({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : k("", !0)
    ], 64));
  }
}, Uv = /* @__PURE__ */ H(zv, [["__scopeId", "data-v-ff25c609"]]), Vv = ["onClick"], Gv = { class: "text" }, Kv = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, Yv = { class: "text" }, Qv = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, Xv = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d(B, null, [
      A(Lt, { icon: "clock" }, {
        default: q(() => [...n[0] || (n[0] = [
          U("Recent", -1)
        ])]),
        _: 1
      }),
      (r(!0), d(B, null, X(e.moves, (a) => (r(), d(B, {
        key: `${a.time}:${a.text}`
      }, [
        a.table ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "move",
          "data-agent-move": "",
          onClick: (s) => I($t)(a.table, a.id)
        }, [
          h("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          h("span", Gv, v(a.text), 1),
          A(Je, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, Vv)) : (r(), d("div", Kv, [
          h("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          h("span", Yv, v(a.text), 1),
          A(Je, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? k("", !0) : (r(), d("p", Qv, "Nothing yet."))
    ], 64));
  }
}, Jv = /* @__PURE__ */ H(Xv, [["__scopeId", "data-v-58f0db57"]]), Zv = {
  class: "strip",
  "data-agent-strip": ""
}, eg = ["data-agent-cell"], tg = {
  key: 0,
  class: "meter"
}, ng = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", Zv, [
      (r(!0), d(B, null, X(e.cells, (a) => (r(), d("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        h("small", null, v(a.label), 1),
        h("b", {
          class: Y({ bad: a.bad })
        }, v(a.value), 3),
        a.meter !== void 0 ? (r(), d("div", tg, [
          h("i", {
            class: Y({ high: a.high }),
            style: ge({ width: `${a.meter}%` })
          }, null, 6)
        ])) : k("", !0)
      ], 8, eg))), 128))
    ]));
  }
}, ag = /* @__PURE__ */ H(ng, [["__scopeId", "data-v-b6657ab7"]]), sg = {}, og = { class: "menu-label" };
function lg(e, t) {
  return r(), d("span", og, [
    ae(e.$slots, "default", {}, void 0, !0)
  ]);
}
const bt = /* @__PURE__ */ H(sg, [["render", lg], ["__scopeId", "data-v-aa955b3e"]]), ig = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, rg = {
  key: 0,
  class: "skills-none"
}, ug = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(() => n.skills.filter((l) => l.state === "loaded")), o = x(() => n.skills.filter((l) => l.state !== "loaded"));
    return (l, i) => (r(), d("div", ig, [
      A(bt, null, {
        default: q(() => [...i[1] || (i[1] = [
          U("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      s.value.length ? k("", !0) : (r(), d("p", rg, "None yet. Compacting the conversation empties this list.")),
      (r(!0), d(B, null, X(s.value, (u) => (r(), d("p", {
        key: u.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        A(ie, {
          name: "book",
          size: 12
        }),
        U(v(u.skill), 1)
      ]))), 128)),
      o.value.length ? (r(), d(B, { key: 1 }, [
        A(bt, null, {
          default: q(() => [...i[2] || (i[2] = [
            U("Still to read", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(B, null, X(o.value, (u) => (r(), d("p", {
          key: u.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          A(ie, {
            name: "book",
            size: 12
          }),
          U(v(u.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      A(He, {
        "data-agent-skills-browse": "",
        onClick: i[0] || (i[0] = (u) => a("browse"))
      }, {
        default: q(() => [...i[3] || (i[3] = [
          U("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, cg = /* @__PURE__ */ H(ug, [["__scopeId", "data-v-be514d47"]]), dg = ["disabled", "title"], fg = { class: "gauge usage" }, mg = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(() => n.windows[0] ?? null), o = x(() => s.value && Number.isFinite(s.value.used_percent) ? Math.max(0, Math.min(100, Math.round(s.value.used_percent))) : null), l = x(() => o.value !== null && o.value >= 100), i = x(() => {
      var c;
      return (c = s.value) != null && c.reset_epoch_seconds ? new Date(s.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), u = x(() => l.value ? `At usage limit: the plan's ${s.value.title} allowance is used up${i.value ? `, starts again ${i.value}` : ""}` : `${o.value}% of the plan's ${s.value.title} allowance used${i.value ? `, starts again ${i.value}` : ""}`);
    return (c, f) => o.value !== null ? (r(), d("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: u.value,
      onClick: f[0] || (f[0] = (m) => a("open", m.currentTarget))
    }, [
      A(ie, {
        name: "allowance",
        size: 12
      }),
      f[1] || (f[1] = U()),
      h("span", fg, [
        h("span", {
          style: ge({ width: `${o.value}%` })
        }, null, 4)
      ]),
      U(" " + v(l.value ? "At usage limit" : `${o.value}%`), 1)
    ], 8, dg)) : k("", !0);
  }
}, hg = /* @__PURE__ */ H(mg, [["__scopeId", "data-v-a36f09dc"]]), pg = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: Y(I(Xi)(e.tone))
    }, v(e.text), 3));
  }
}, mo = /* @__PURE__ */ H(pg, [["__scopeId", "data-v-b7a33f3d"]]);
function vg(e, t, n, { groups: a, programs: s }) {
  const o = _({}), l = _(""), i = _(!1), u = x(() => !!e.value && !e.value.ended_at), c = x(() => u.value && !!e.value.paused_at);
  async function f(b, w = null) {
    l.value = "";
    const M = await Jl(w, b, t);
    return l.value = M.ok ? "" : M.error, n(), M;
  }
  return { groups: a, programs: s, chosen: o, failure: l, asking: i, running: u, paused: c, choose: (b, w) => f(["agent", "control", String(e.value.number), b, w.value], { target: o, fields: { value: { ...o.value, [b]: w.label } } }), stop: () => (i.value = !1, f(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (b) => f(["agent", "launch", b.name]) };
}
const gg = ["disabled", "title"], yg = ["disabled", "title"], bg = { class: "gauge" }, kg = {
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, wg = ["disabled", "title"], $g = ["disabled"], xg = ["disabled"], Sg = {
  key: 5,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, _g = ["title"], Mg = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Cg = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Ag = { class: "gauge" }, Eg = { class: "context-used" }, Og = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, Tg = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, Ig = 75, Bg = {
  __name: "InformationBar",
  props: {
    agent: { type: Object, default: null },
    card: Boolean,
    controlGroups: { type: Array, default: () => [] },
    agentPrograms: { type: Array, default: () => [] },
    skills: { type: Array, default: () => [] },
    loading: Boolean,
    jobs: { type: Number, default: 0 },
    usage: { type: Object, default: () => ({ agents: [], windows: [] }) },
    branch: { type: String, default: "" },
    fitness: { type: Object, default: null },
    run: { type: Function, default: null }
  },
  emits: ["open", "changed", "skills"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = vg(Ia(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: Ia(n, "controlGroups"), programs: Ia(n, "agentPrograms") }), o = _(null), l = _(""), i = x(() => s.groups.value.find((D) => D.key === l.value));
    function u(D, E) {
      o.value = D.currentTarget, l.value = E;
    }
    function c() {
      o.value = null, l.value = "", s.asking.value = !1;
    }
    const f = x(() => n.skills.filter((D) => D.state === "loaded"));
    function m(D) {
      u(D, "skills"), a("skills");
    }
    const p = (D) => s.groups.value.some((E) => E.key === D), y = x(() => {
      var D;
      return s.chosen.value.model ?? ((D = w.value) == null ? void 0 : D.model) ?? "";
    }), b = x(() => {
      var D;
      return s.chosen.value.effort ?? ((D = w.value) == null ? void 0 : D.effort) ?? "";
    });
    x(() => !!n.agent && !n.agent.ended_at);
    const w = x(() => {
      var D;
      return ((D = n.usage.agents) == null ? void 0 : D.find((E) => {
        var N;
        return E.id === ((N = n.agent) == null ? void 0 : N.id);
      })) ?? null;
    }), M = x(() => {
      var D;
      return ((D = w.value) == null ? void 0 : D.context_percent) == null ? null : Math.round(w.value.context_percent);
    }), C = x(() => {
      var D;
      return tv(((D = w.value) == null ? void 0 : D.context_change) ?? null);
    }), T = (D) => `${Math.round(D / 1e3)}k`, z = x(() => {
      var D;
      return !!((D = w.value) != null && D.context_limit_tokens);
    }), W = x(() => {
      var D, E;
      return ((D = w.value) == null ? void 0 : D.context_limit_tokens) || ((E = w.value) == null ? void 0 : E.context_window_tokens) || 0;
    }), R = x(() => W.value ? `${T(w.value.context_tokens ?? 0)} of ${T(W.value)}` : ""), G = x(() => {
      var D;
      return (D = w.value) != null && D.cost_dollars ? `$${w.value.cost_dollars.toFixed(2)}` : "";
    });
    return (D, E) => {
      var N, j;
      return r(), d("div", {
        class: Y(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (r(), d(B, { key: 0 }, [
          h("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: E[0] || (E[0] = ($) => u($, "agent"))
          }, [
            A(ie, {
              name: "agents",
              size: 12
            }),
            U(" " + v(((N = e.agentPrograms.find(($) => $.name === e.agent.program)) == null ? void 0 : N.title) || e.agent.program), 1)
          ], 8, gg),
          A(hg, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: E[1] || (E[1] = ($) => a("open", "usage", $))
          }, null, 8, ["windows", "disabled"]),
          M.value !== null ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${M.value}% full: clear or compact it`,
            onClick: E[2] || (E[2] = ($) => p("context") ? u($, "context") : a("open", "context", $.currentTarget))
          }, [
            A(ie, {
              name: "gauge",
              size: 12
            }),
            E[14] || (E[14] = U()),
            h("span", bg, [
              h("span", {
                style: ge({ width: `${M.value}%` })
              }, null, 4)
            ]),
            U(" " + v(M.value) + "% ", 1)
          ], 8, yg)) : (j = w.value) != null && j.context_unknown ? (r(), d("span", kg, [
            A(ie, {
              name: "gauge",
              size: 12
            }),
            E[15] || (E[15] = U(" Context: unknown", -1))
          ])) : k("", !0),
          y.value ? (r(), d("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${y.value}: change the model`,
            onClick: E[3] || (E[3] = ($) => p("model") ? u($, "model") : null)
          }, [
            A(ie, {
              name: "model",
              size: 12
            }),
            U(" " + v(y.value), 1)
          ], 8, wg)) : k("", !0),
          p("effort") || e.card && b.value ? (r(), d("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: E[4] || (E[4] = ($) => u($, "effort"))
          }, [
            A(ie, {
              name: "bolt",
              size: 12
            }),
            U(" " + v(b.value), 1)
          ], 8, $g)) : k("", !0),
          G.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: E[5] || (E[5] = ($) => a("open", "cost", $.currentTarget))
          }, v(G.value), 9, xg)) : k("", !0),
          e.branch ? (r(), d("span", Sg, [
            A(ie, {
              name: "branch",
              size: 12
            }),
            U(" " + v(e.branch), 1)
          ])) : k("", !0),
          e.card ? k("", !0) : (r(), d("button", {
            key: 6,
            type: "button",
            class: Y(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: E[6] || (E[6] = ($) => a("open", "jobs", $.currentTarget))
          }, [
            A(ie, {
              name: "clock",
              size: 12
            }),
            U(" " + v(e.jobs), 1)
          ], 2)),
          e.run ? (r(), d("button", {
            key: 7,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: m
          }, [
            A(ie, {
              name: "book",
              size: 12
            }),
            U(" " + v(f.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (r(), d(B, { key: 8 }, [
            h("button", {
              type: "button",
              class: Y(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Ig }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: E[7] || (E[7] = ($) => a("open", "fitness", $.currentTarget))
            }, [
              A(ie, {
                name: "heart",
                size: 12
              }),
              U(" " + v(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            h("button", {
              type: "button",
              class: Y(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: E[8] || (E[8] = ($) => a("open", "load", $.currentTarget))
            }, [
              A(ie, {
                name: "weight",
                size: 12
              }),
              U(" " + v(e.fitness.workload), 1)
            ], 2)
          ], 64)) : k("", !0)
        ], 64)) : e.run && !e.loading ? (r(), d("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: E[9] || (E[9] = ($) => u($, "start"))
        }, [
          A(ie, {
            name: "agents",
            size: 12
          }),
          E[16] || (E[16] = U(" Start an agent", -1))
        ])) : k("", !0),
        E[22] || (E[22] = h("span", { class: "space" }, null, -1)),
        I(s).failure.value ? (r(), d("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: I(s).failure.value
        }, v(I(s).failure.value), 9, _g)) : k("", !0),
        ae(D.$slots, "default", {}, void 0, !0),
        o.value ? (r(), P(Zt, {
          key: 3,
          anchor: o.value,
          "min-width": 190,
          onClose: c
        }, {
          default: q(() => {
            var $;
            return [
              l.value === "agent" ? (r(), d(B, { key: 0 }, [
                I(s).asking.value ? (r(), d(B, { key: 0 }, [
                  A(bt, { "data-agent-stop-ask": "" }, {
                    default: q(() => [...E[17] || (E[17] = [
                      U("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  A(He, {
                    "data-agent-stop-confirm": "",
                    onClick: E[10] || (E[10] = (g) => (c(), I(s).stop()))
                  }, {
                    default: q(() => [...E[18] || (E[18] = [
                      U("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  A(He, {
                    onClick: E[11] || (E[11] = (g) => I(s).asking.value = !1)
                  }, {
                    default: q(() => [...E[19] || (E[19] = [
                      U("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (r(), P(He, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: E[12] || (E[12] = (g) => I(s).asking.value = !0)
                }, {
                  default: q(() => [...E[20] || (E[20] = [
                    U("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : l.value === "start" ? (r(), d(B, { key: 1 }, [
                A(bt, null, {
                  default: q(() => [...E[21] || (E[21] = [
                    U("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (r(!0), d(B, null, X(I(s).programs.value, (g) => (r(), P(He, {
                  key: g.name,
                  "data-agent-program": g.name,
                  onClick: (S) => (c(), I(s).start(g))
                }, {
                  default: q(() => [
                    U(v(g.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : l.value === "skills" ? (r(), P(cg, {
                key: 2,
                skills: e.skills,
                onBrowse: E[13] || (E[13] = (g) => (c(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : i.value ? (r(), d(B, { key: 3 }, [
                A(bt, null, {
                  default: q(() => [
                    U(v(i.value.label), 1)
                  ]),
                  _: 1
                }),
                l.value === "context" ? (r(), d(B, { key: 0 }, [
                  h("p", Mg, v(I(J1)((($ = w.value) == null ? void 0 : $.last_compaction) ?? null)), 1),
                  h("div", Cg, [
                    h("span", Ag, [
                      h("span", {
                        style: ge({ width: `${M.value}%` })
                      }, null, 4)
                    ]),
                    h("span", Eg, v(M.value) + "%", 1)
                  ]),
                  R.value ? (r(), d("p", Og, [
                    U(v(R.value) + " ", 1),
                    z.value ? (r(), P(mo, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : k("", !0)
                  ])) : k("", !0)
                ], 64)) : k("", !0),
                l.value === "context" && C.value ? (r(), d("p", Tg, v(C.value), 1)) : (r(!0), d(B, { key: 2 }, X(i.value.choices, (g) => (r(), P(He, {
                  key: g.value,
                  "data-agent-choice": g.value,
                  onClick: (S) => (I(s).choose(i.value.key, g), c())
                }, {
                  default: q(() => [
                    U(v(g.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : k("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : k("", !0)
      ], 2);
    };
  }
}, Rg = /* @__PURE__ */ H(Bg, [["__scopeId", "data-v-d7113347"]]), Lg = {
  class: "who",
  "data-agent-who": ""
}, Ng = { class: "name" }, qg = ["data-agent-state"], Dg = {
  class: "sub",
  "data-agent-started-by": ""
}, Pg = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, startedBy: { type: String, required: !0 }, agent: { type: Object, required: !0 }, programs: { type: Array, default: () => [] }, usage: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", Lg, [
      h("h2", Ng, [
        h("i", {
          class: Y(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, qg),
        U(v(e.name), 1)
      ]),
      A(Rg, {
        class: "bar",
        agent: e.agent,
        "agent-programs": e.programs,
        usage: e.usage,
        card: ""
      }, null, 8, ["agent", "agent-programs", "usage"]),
      h("p", Dg, "Started by: " + v(e.startedBy), 1)
    ]));
  }
}, jg = /* @__PURE__ */ H(Pg, [["__scopeId", "data-v-83bd4a9d"]]), Fg = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, Wg = { class: "scroll" }, Hg = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, zg = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, Ug = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = tr(), a = _(null), s = _(null), o = _(null), l = _(null), i = _({}), u = _({ helpers: 0, skills: 0 }), c = _(0), f = _([]), m = _([]), p = _("");
    let y = 0;
    const b = x(() => {
      var T;
      return a.value.ended_at ? fv(s.value) : `It has no task.${(T = s.value) != null && T.instruction ? " It was given an instruction." : ""}`;
    });
    async function w() {
      const T = ++y, z = await t.read(["usage", "inspector", Ji(t.id), "--environment", t.environment]);
      T === y && (p.value = z.ok ? "" : z.error, z.ok && (a.value = z.value.agent, s.value = z.value.facts, o.value = z.value.inspection, l.value = z.value.compaction ?? null, i.value = z.value.tool, u.value = { helpers: z.value.helpers, skills: z.value.skills }, f.value = z.value.points, m.value = z.value.programs, c.value += 1));
    }
    const M = x(() => /* @__PURE__ */ new Set([t.id])), C = {
      agent: (T) => ri(T, M.value),
      hook_call: (T) => Hc(T, "session_agent_id", M.value)
    };
    return On(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], w, (T) => {
      var z;
      return ((z = C[T.event.split(".")[0]]) == null ? void 0 : z.call(C, T)) ?? !0;
    }), Ce(w), (T, z) => {
      var W, R;
      return r(), d("article", Fg, [
        h("div", Wg, [
          p.value ? (r(), d("p", Hg, v(p.value), 1)) : a.value && o.value ? (r(), d(B, { key: 1 }, [
            A(jg, {
              name: I(Kt)(a.value, s.value).text,
              state: I(cv)(a.value, s.value),
              "started-by": o.value.started_by,
              agent: a.value,
              programs: m.value,
              usage: { agents: s.value ? [s.value] : [], windows: ((W = s.value) == null ? void 0 : W.windows) ?? [] }
            }, null, 8, ["name", "state", "started-by", "agent", "programs", "usage"]),
            A(ag, {
              cells: I(dv)({ row: a.value, facts: s.value, inspection: o.value, now: I(n) })
            }, null, 8, ["cells"]),
            A(Uv, {
              inspection: o.value,
              tool: i.value,
              nothing: b.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            A(wv, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((R = s.value) == null ? void 0 : R.instruction) ?? "",
              points: f.value
            }, null, 8, ["label", "text", "points"]),
            A(Jv, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            A(Rv, {
              id: e.id,
              read: e.read,
              counts: u.value,
              loads: c.value,
              details: I(mv)(a.value, o.value, l.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (r(), d("p", zg, "Ended " + v(I(En)(a.value.ended_at, I(n))) + ". It takes no more actions.", 1)) : k("", !0)
          ], 64)) : (r(), P(Ze, { key: 2 }))
        ])
      ]);
    };
  }
}, kC = /* @__PURE__ */ H(Ug, [["__scopeId", "data-v-b88512f5"]]);
function Vg(e) {
  const t = _(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return Ce(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), st(() => n.disconnect()), t;
}
const Gg = ["data-comment-id"], Kg = {
  key: 0,
  class: "comment-top"
}, Yg = { class: "comment-mark" }, Qg = {
  class: "comment-body",
  "data-comment": ""
}, Xg = { class: "comment-foot" }, Jg = {
  key: 1,
  "data-comment-lost": ""
}, Zg = {
  __name: "CommentCard",
  props: { comment: { type: Object, required: !0 }, hot: Boolean, lost: Boolean },
  emits: ["show"],
  setup(e) {
    const t = e, n = () => t.comment.selection_type === "code";
    return (a, s) => (r(), d("article", {
      class: Y(["comment-card", { hot: e.hot }]),
      "data-comment-card": "",
      "data-comment-id": e.comment.id
    }, [
      e.comment.quote ? (r(), d("div", Kg, [
        h("span", Yg, v(e.comment.number), 1),
        h("span", {
          class: Y(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, v(e.comment.quote), 3)
      ])) : k("", !0),
      h("p", Qg, v(e.comment.body), 1),
      h("div", Xg, [
        e.comment.created_at ? (r(), P(Je, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : k("", !0),
        e.lost ? (r(), d("span", Jg, "The text has changed here")) : e.comment.quote ? (r(), d("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : k("", !0)
      ])
    ], 10, Gg));
  }
}, sr = /* @__PURE__ */ H(Zg, [["__scopeId", "data-v-a37d4507"]]);
var Kl;
/Mac|iPhone|iPad/.test(((Kl = navigator.userAgentData) == null ? void 0 : Kl.platform) || navigator.platform);
function or(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const ey = {
  class: "comment-box",
  "data-comment-box": ""
}, ty = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, ny = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, ay = { class: "comment-row" }, sy = ["placeholder"], oy = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ Tt({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ Tt(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = Gt(e, "draft"), l = _(""), i = _(!1), u = _(null), c = x(() => {
      var y;
      return ((y = a.selection) == null ? void 0 : y.selection_type) === "code";
    }), f = x(() => a.narrow ? "Write a comment" : "Write a comment, or select text to comment on a selection");
    function m() {
      u.value.style.height = "auto", u.value.style.height = `${u.value.scrollHeight + 2}px`;
    }
    async function p() {
      const y = o.value.trim();
      if (!(!y || i.value)) {
        l.value = "", i.value = !0;
        try {
          await a.send(y), o.value = "", await Fe(), m();
        } catch (b) {
          l.value = b.message;
        } finally {
          i.value = !1;
        }
      }
    }
    return t({ focus: () => u.value.focus() }), (y, b) => (r(), d("div", ey, [
      e.selection ? (r(), d("div", ty, [
        b[3] || (b[3] = h("span", { class: "comment-on-label" }, "On this selection", -1)),
        h("span", {
          class: Y(["comment-on-words", { mono: c.value }])
        }, v(e.selection.quote), 3),
        A(xa, {
          title: "Comment on the whole document instead",
          onClick: b[0] || (b[0] = (w) => s("clear"))
        })
      ])) : k("", !0),
      l.value ? (r(), d("p", ny, v(l.value), 1)) : k("", !0),
      h("div", ay, [
        _e(h("textarea", {
          ref_key: "box",
          ref: u,
          "onUpdate:modelValue": b[1] || (b[1] = (w) => o.value = w),
          rows: "1",
          maxlength: "2000",
          class: Y({ on: o.value }),
          placeholder: f.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: m,
          onKeydown: b[2] || (b[2] = Ot((w) => I(or)(w, p), ["enter"]))
        }, null, 42, sy), [
          [Ke, o.value]
        ]),
        A(ve, {
          variant: "primary",
          busy: i.value,
          disabled: !o.value.trim(),
          "data-comment-send": "",
          onClick: p
        }, {
          default: q(() => [...b[4] || (b[4] = [
            U("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, ly = /* @__PURE__ */ H(oy, [["__scopeId", "data-v-41d2081c"]]), Hn = (e) => e ? e.split(", ") : [];
function iy({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function ry(e, t) {
  return {
    reads: Hn(e.reads_allowed),
    runs: Hn(e.runs_allowed),
    missing: [...Hn(e.reads_missing), ...Hn(e.runs_missing)],
    ask: t
  };
}
const uy = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = Tu("SkeletonParts", !0);
      return r(!0), d(B, null, X(e.parts, (u, c) => (r(), d(B, { key: c }, [
        (r(!0), d(B, null, X(u.count, (f) => (r(), P(Jt, {
          key: f,
          value: u.shape
        }, {
          line: q(() => [
            A(rn, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ge({ width: u.width, height: `${t[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: q(() => [
            A(rn, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ge({ width: `${n[u.size]}px`, height: `${n[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: q(() => [
            A(rn, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ge({ width: u.width, height: `${u.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: q(() => [...l[0] || (l[0] = [
            h("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: q(() => [
            h("div", {
              class: "skeleton-row",
              style: ge(a(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: q(() => [
            h("div", {
              class: "skeleton-stack",
              style: ge(a(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: q(() => [
            h("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ge(a(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: q(() => [
            h("div", {
              class: "skeleton-grid",
              style: ge(s(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), cy = /* @__PURE__ */ H(uy, [["__scopeId", "data-v-fa8baeaf"]]), dy = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, fy = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (r(), d("div", dy, [
      A(cy, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, ho = /* @__PURE__ */ H(fy, [["__scopeId", "data-v-52f66b64"]]), lr = {
  runningTool: 500,
  agentCommand: 500,
  planCard: 3e3,
  openPanel: 5e3,
  documentWithNoEvents: 6e4,
  pageOfAgents: 3e3,
  projectHooks: 1e4,
  numbers: 1e4,
  services: 15e3,
  libraryCopies: 3e4,
  systemLogs: 5e3
}, my = { class: "bars" }, hy = { class: "bar-name" }, py = { class: "bar-value" }, vy = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = x(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (r(), d("div", my, [
      (r(!0), d(B, null, X(e.items, (u, c) => (r(), P(Qe(u.open ? "button" : "div"), {
        key: `${c}-${u.label}`,
        type: u.open ? "button" : void 0,
        class: Y(["bar-row", u.tone, { opens: u.open }]),
        onClick: (f) => u.open && a("open", u.open)
      }, {
        default: q(() => [
          h("span", hy, v(u.label), 1),
          A(Ni, {
            value: Number(u.value) || 0,
            max: s.value,
            tone: u.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          h("span", py, v(u.value) + v(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, gy = /* @__PURE__ */ H(vy, [["__scopeId", "data-v-663427f4"]]), yy = { class: "bars" }, by = {
  key: 0,
  class: "bars-title"
}, ky = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", yy, [
      e.node.title ? (r(), d("span", by, v(e.node.title), 1)) : k("", !0),
      A(gy, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, wy = /* @__PURE__ */ H(ky, [["__scopeId", "data-v-7135bb11"]]), $y = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = x(() => n[a.node.type](a.node));
    return (l, i) => (r(), d("div", {
      class: Y([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ge(o.value)
    }, [
      (r(!0), d(B, null, X(e.node.children || [], (u, c) => (r(), P(ur, {
        key: c,
        node: u,
        onOpen: i[0] || (i[0] = (f) => s("open", f)),
        onFile: i[1] || (i[1] = (f) => s("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, ir = /* @__PURE__ */ H($y, [["__scopeId", "data-v-d142a3f4"]]), xy = {
  key: 0,
  class: "card-head"
}, Sy = { class: "card-title" }, _y = {
  key: 0,
  class: "card-note"
}, My = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", {
      class: Y(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (r(), d("header", xy, [
        h("span", Sy, v(e.node.title), 1),
        e.node.note ? (r(), d("span", _y, v(e.node.note), 1)) : k("", !0)
      ])) : k("", !0),
      A(ir, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Cy = /* @__PURE__ */ H(My, [["__scopeId", "data-v-67b72d40"]]), Ay = { class: "fact" }, Ey = { class: "fact-label" }, Oy = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", Ay, [
      h("span", Ey, v(e.label), 1),
      A(rt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Ty = /* @__PURE__ */ H(Oy, [["__scopeId", "data-v-3a88ecf8"]]), Iy = { class: "list" }, By = { class: "list-label" }, Ry = {
  key: 1,
  class: "list-note"
}, Ly = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", Iy, [
      (r(!0), d(B, null, X(e.items, (o, l) => (r(), P(Qe(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Y(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: q(() => [
          h("span", By, v(o.label), 1),
          o.badge ? (r(), P(mo, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : k("", !0),
          o.note ? (r(), d("span", Ry, v(o.note), 1)) : k("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Ny = /* @__PURE__ */ H(Ly, [["__scopeId", "data-v-ebe2ae0a"]]), qy = { class: "table" }, Dy = {
  key: 0,
  class: "table-row empty"
}, Py = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (r(), d("div", qy, [
      h("div", {
        class: "table-row head",
        style: ge(s.value)
      }, [
        (r(!0), d(B, null, X(e.columns, (i) => (r(), d("span", {
          key: i,
          class: "cell"
        }, v(i), 1))), 128))
      ], 4),
      (r(!0), d(B, null, X(e.rows, (i, u) => (r(), P(Qe(i.open ? "button" : "div"), {
        key: u,
        type: i.open ? "button" : void 0,
        class: Y(["table-row", i.tone, { opens: i.open }]),
        style: ge(s.value),
        onClick: (c) => i.open && a("open", i.open)
      }, {
        default: q(() => [
          (r(!0), d(B, null, X(i.cells, (c, f) => (r(), d("span", {
            key: f,
            class: "cell"
          }, v(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (r(), d("div", Dy, v(e.empty), 1)) : k("", !0)
    ]));
  }
}, rr = /* @__PURE__ */ H(Py, [["__scopeId", "data-v-9326a52e"]]), jy = { class: "stat-value" }, Fy = { class: "stat-label" }, Wy = {
  key: 0,
  class: "stat-note"
}, Hy = {
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
    return (a, s) => (r(), P(Qe(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Y(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: q(() => [
        h("span", jy, v(e.value), 1),
        h("span", Fy, v(e.label), 1),
        e.note ? (r(), d("span", Wy, v(e.note), 1)) : k("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, zy = /* @__PURE__ */ H(Hy, [["__scopeId", "data-v-ad0db6d6"]]), Uy = { class: "code" }, Vy = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = e, a = ["stack", "row", "grid"], s = x(() => a.includes(n.node.type) ? "group" : n.node.type), o = t, l = (u) => o("open", u), i = (u) => o("file", u);
    return (u, c) => (r(), P(Jt, { value: s.value }, {
      group: q(() => [
        A(ir, {
          node: e.node,
          onOpen: l,
          onFile: i
        }, null, 8, ["node"])
      ]),
      card: q(() => [
        A(Cy, {
          node: e.node,
          onOpen: l,
          onFile: i
        }, null, 8, ["node"])
      ]),
      heading: q(() => [
        h("h3", {
          class: Y(["heading", `level-${e.node.level || 2}`])
        }, v(e.node.text), 3)
      ]),
      divider: q(() => [...c[2] || (c[2] = [
        h("hr", { class: "divider" }, null, -1)
      ])]),
      stat: q(() => [
        A(zy, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: c[0] || (c[0] = (f) => l(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: q(() => [
        A(wy, {
          node: e.node,
          onOpen: l
        }, null, 8, ["node"])
      ]),
      table: q(() => [
        A(rr, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: l
        }, null, 8, ["columns", "rows"])
      ]),
      list: q(() => [
        A(Ny, {
          items: e.node.items,
          onOpen: l
        }, null, 8, ["items"])
      ]),
      text: q(() => [
        A(rt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: q(() => [
        A(Ty, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: q(() => [
        A(mo, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: q(() => [
        h("pre", Uy, [
          h("code", null, v(e.node.text), 1)
        ])
      ]),
      file: q(() => [
        h("button", {
          type: "button",
          class: "file",
          onClick: c[1] || (c[1] = (f) => i(e.node))
        }, v(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), ur = /* @__PURE__ */ H(Vy, [["__scopeId", "data-v-b9156b43"]]), Gy = { class: "dashboard" }, Ky = { class: "trail" }, Yy = ["onClick"], Qy = {
  key: 0,
  class: "gone",
  role: "status"
}, Xy = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (p) => p in (n.document.pages || {}), o = _(!!n.page && !s(n.page)), l = _(n.page && !o.value ? [n.page] : []), i = x(() => l.value.at(-1) || n.document.start), u = x(() => (n.document.pages || {})[i.value] || null), c = (p) => ((n.document.pages || {})[p] || {}).title || p, f = (p) => {
      o.value = !1, l.value = [...l.value, p];
    }, m = (p) => {
      o.value = !1, l.value = l.value.slice(0, p);
    };
    return me(
      () => n.document.start,
      () => l.value = []
    ), (p, y) => (r(), d("div", Gy, [
      e.document.broken ? (r(), P(wt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: q(() => [
          U(v(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (r(), P(wt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: q(() => [
          U(v(e.document.missing), 1)
        ]),
        _: 1
      })) : u.value ? (r(), d(B, { key: 2 }, [
        h("nav", Ky, [
          h("button", {
            type: "button",
            class: Y(["step", { current: !l.value.length }]),
            onClick: y[0] || (y[0] = (b) => m(0))
          }, v(c(e.document.start)), 3),
          (r(!0), d(B, null, X(l.value, (b, w) => (r(), d(B, {
            key: `${w}-${b}`
          }, [
            y[2] || (y[2] = h("span", { class: "sep" }, "/", -1)),
            h("button", {
              type: "button",
              class: Y(["step", { current: w === l.value.length - 1 }]),
              onClick: (M) => m(w + 1)
            }, v(c(b)), 11, Yy)
          ], 64))), 128))
        ]),
        o.value ? (r(), d("p", Qy, "What you opened is no longer in this dashboard. Here is its start page.")) : k("", !0),
        A(Xt, {
          name: "page",
          mode: "out-in"
        }, {
          default: q(() => [
            (r(), d("div", {
              key: i.value,
              class: "page"
            }, [
              A(ur, {
                node: u.value.view,
                onOpen: f,
                onFile: y[1] || (y[1] = (b) => a("file", b))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : k("", !0)
    ]));
  }
}, Jy = /* @__PURE__ */ H(Xy, [["__scopeId", "data-v-fbe83734"]]);
function Zy(e, t) {
  const n = ot(), a = Ks(e, lr.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Ce(e), st(() => {
    s(), a.cancel();
  });
}
const e0 = {
  key: 0,
  class: "window-failure"
}, t0 = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = ot(), o = _(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? Zy(l, n.events) : Vs(l, () => !0, lr.documentWithNoEvents), (i, u) => o.value && !o.value.ok ? (r(), d("p", e0, v(o.value.error), 1)) : o.value ? (r(), P(Jy, {
      key: 1,
      document: o.value.value,
      onFile: u[0] || (u[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : k("", !0);
  }
}, n0 = 1e4;
class a0 {
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
    return this.heardAt !== null && t - this.heardAt > n0;
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
const s0 = {
  key: 0,
  class: "frame-note"
}, o0 = {
  key: 0,
  class: "frame-note"
}, l0 = ["src", "title"], i0 = 1e3, r0 = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ot(), a = _(null), s = _(!1), o = _(!1);
    let l = null, i = 0;
    return Ce(() => {
      l = new a0(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, i0);
    }), Le(() => {
      l == null || l.stop(), clearInterval(i);
    }), (u, c) => o.value ? (r(), d("p", s0, "This window was closed because it stopped answering.")) : (r(), d(B, { key: 1 }, [
      s.value ? (r(), d("div", o0, [
        c[2] || (c[2] = h("p", null, "This window has not answered for ten seconds.", -1)),
        A(ve, {
          onClick: c[0] || (c[0] = (f) => o.value = !0)
        }, {
          default: q(() => [...c[1] || (c[1] = [
            U("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : k("", !0),
      h("iframe", {
        ref_key: "frame",
        ref: a,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: I(n).window
      }, null, 8, l0)
    ], 64));
  }
}, u0 = /* @__PURE__ */ H(r0, [["__scopeId", "data-v-32a49046"]]), c0 = {
  class: "allowance-prompt",
  role: "dialog"
}, d0 = { class: "allowance-prompt-text" }, f0 = { class: "allowance-prompt-buttons" }, m0 = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", c0, [
      h("p", d0, v(I(iy)(e.request)), 1),
      h("div", f0, [
        A(ve, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: q(() => [...s[2] || (s[2] = [
            U("Allow", -1)
          ])]),
          _: 1
        }),
        A(ve, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: q(() => [...s[3] || (s[3] = [
            U("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, h0 = /* @__PURE__ */ H(m0, [["__scopeId", "data-v-cad69fe2"]]), Ua = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), P(wt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: q(() => [
        U(v(e.reason) + " ", 1),
        e.retry ? (r(), P(ve, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: q(() => [...s[2] || (s[2] = [
            U("Retry", -1)
          ])]),
          _: 1
        })) : k("", !0),
        e.removable ? (r(), P(ve, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: q(() => [...s[3] || (s[3] = [
            U("Remove tab", -1)
          ])]),
          _: 1
        })) : k("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, p0 = ["data-window", "data-agent"], v0 = {
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
    const n = e, a = t, s = _(""), o = _(0);
    function l() {
      s.value = "", o.value++;
    }
    const i = Me(ed, null), u = ff({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: x(() => n.options),
      declared: n.declared,
      page: Me(lf, null),
      setOption: (m, p) => a("option", m, p),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      sources: n.sources,
      links: n.links,
      search: n.search,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (m, p) => {
        a("open", m, p), i == null || i(m, p);
      }
    });
    Ws(Re, u), me(() => n.visible, (m) => m && n.subscriptions.shown(n.name)), Ce(u.settle), Le(() => {
      u.cancel(), n.subscriptions.stopAll(n.name);
    }), Iu((m) => (s.value = m instanceof Error ? m.message : String(m), n.subscriptions.stopAll(n.name), !1));
    const c = () => ba(n.component), f = () => {
      var m, p;
      return ((p = (m = n.prompts) == null ? void 0 : m.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (m, p) => (r(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (r(), P(h0, {
        key: 0,
        request: f(),
        onAnswer: p[0] || (p[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : k("", !0),
      e.unavailableReason ? (r(), P(Ua, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (r(), P(Ua, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (r(), d(B, { key: 4 }, [
        (r(), P(c, { key: o.value })),
        e.skeleton.length && !I(u).answered.value ? (r(), P(ho, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : k("", !0)
      ], 64)) : (r(), P(Ua, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (y) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, p0));
  }
}, un = /* @__PURE__ */ H(v0, [["__scopeId", "data-v-c4443e2b"]]), cr = {
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
    const n = e, a = t, s = { render: () => ba(u0, { src: n.entry.entry_url }) };
    return (o, l) => (r(), P(un, {
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
      onOption: l[0] || (l[0] = (i, u) => a("option", i, u))
    }, null, 8, ["name", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "unavailable-reason"]));
  }
}, g0 = ["data-window"], dr = {
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
    const n = e, a = t, s = at(null), o = _("");
    return me(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, vc();
          } catch (i) {
            if (hc(i) && pc(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (l, i) => !s.value && !o.value && !e.entry.unavailable_reason ? (r(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      A(ho, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, g0)) : (r(), P(un, {
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
      onOption: i[0] || (i[0] = (u, c) => a("option", u, c))
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "skeleton", "unavailable-reason"]));
  }
}, y0 = {
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
    const n = t, a = e, s = x(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = x(() => s.value && { render: () => ba(t0, { line: s.value.line, events: s.value.events }) }), l = _(null), i = x(() => {
      var p, y;
      return ((p = s.value) == null ? void 0 : p.loading) === "component" && !s.value.allowed && !((y = l.value) != null && y.component_trusted);
    }), u = x(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = x(
      () => {
        var p, y;
        return l.value ? ry(l.value, m) : { reads: ((p = s.value) == null ? void 0 : p.reads) || [], runs: ((y = s.value) == null ? void 0 : y.runs) || [], missing: [], ask: async () => !0 };
      }
    );
    async function f() {
      if (!s.value || s.value.allowed || !a.shellRead) return;
      const p = await a.shellRead(`window permissions ${a.name} --environment ${a.environment}`);
      l.value = p.ok ? p.value : null;
    }
    async function m() {
      const p = await a.prompts.ask(s.value.title, l.value);
      return await f(), p;
    }
    return me(
      () => {
        var p, y;
        return ((p = s.value) == null ? void 0 : p.entry_url) || ((y = s.value) == null ? void 0 : y.line);
      },
      async () => {
        await f(), c.value.missing.length && !i.value && m();
      },
      { immediate: !0 }
    ), (p, y) => {
      var b, w;
      return !s.value && ((b = e.catalogue.loaded) == null ? void 0 : b.value) === !1 ? (r(), P(ho, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((w = s.value) == null ? void 0 : w.shows) === "one-agent" && e.agent === null ? (r(), P(wt, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (r(), P(un, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": u.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (r(), P(dr, {
        key: c.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[0] || (y[0] = (M, C) => n("option", M, C))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (r(), P(cr, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[1] || (y[1] = (M, C) => n("option", M, C))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (r(), P(un, {
        key: s.value.line || s.value.entry_url,
        name: e.name,
        component: o.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
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
        onOption: y[2] || (y[2] = (M, C) => n("option", M, C))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (r(), P(un, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: y[3] || (y[3] = (M) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, b0 = ["data-section"], k0 = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, w0 = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Me(eo, null), a = x(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = x(() => ({ row: t.row }));
    return (o, l) => I(n) ? (r(!0), d(B, { key: 0 }, X(a.value, (i) => (r(), d("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (r(), P(y0, {
        key: 0,
        name: i.name,
        catalogue: I(n).catalogue,
        subscriptions: I(n).subscriptions,
        environment: I(n).environment,
        prompts: I(n).prompts,
        "shell-read": I(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (r(), d("p", k0, v(i.name) + " is not available", 1))
    ], 8, b0))), 128)) : k("", !0);
  }
}, As = /* @__PURE__ */ H(w0, [["__scopeId", "data-v-a47d36b7"]]), $0 = { class: "rail-head" }, x0 = { key: 0 }, S0 = {
  key: 1,
  class: "rail-none"
}, _0 = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (r(), d("aside", {
      class: Y(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      h("div", $0, [
        n[0] || (n[0] = h("h3", null, "Comments", -1)),
        e.comments.length ? (r(), d("span", x0, v(e.total || e.comments.length), 1)) : k("", !0)
      ]),
      e.comments.length ? (r(!0), d(B, { key: 0 }, X(e.comments, (a) => (r(), P(sr, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (r(), d("p", S0, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, M0 = /* @__PURE__ */ H(_0, [["__scopeId", "data-v-4d684649"]]), C0 = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, A0 = ["aria-pressed"], E0 = ["aria-pressed"], O0 = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, T0 = {
  key: 0,
  role: "alert"
}, I0 = {
  key: 1,
  class: "sidebar-none"
}, B0 = ["data-question-id"], R0 = { class: "question-state" }, L0 = ["data-question-show", "onClick"], N0 = {
  key: 0,
  class: "sidebar-none"
}, q0 = {
  key: 1,
  class: "question-answer"
}, D0 = {
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
    const t = Me(eo, null);
    return (n, a) => (r(), d("div", {
      class: Y(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      h("nav", C0, [
        h("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, A0),
        h("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, E0)
      ]),
      e.mode === "comments" ? (r(), d(B, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (r(), P(M0, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : k("", !0),
        A(_n, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (r(), d("aside", O0, [
        e.failure ? (r(), d("p", T0, v(e.failure), 1)) : e.questions.length ? k("", !0) : (r(), d("p", I0, "No questions about this text yet.")),
        (r(!0), d(B, null, X(e.questions, (s) => {
          var o;
          return r(), d("section", {
            key: s.id,
            class: Y(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            h("span", R0, v(I(hn)("question", s.state)), 1),
            h("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, v(s.text), 9, L0),
            s.quote ? (r(), d(B, { key: 0 }, [
              h("blockquote", null, v(s.quote), 1),
              e.lost.includes(s.id) ? (r(), d("p", N0, "The quoted text has changed.")) : k("", !0)
            ], 64)) : k("", !0),
            s.answer ? (r(), d("p", q0, "Answered: " + v(s.answer), 1)) : k("", !0),
            A(As, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            A(oo, {
              name: "row.question",
              row: { ...s, term: "question" },
              environment: ((o = I(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, B0);
        }), 128))
      ]))
    ], 2));
  }
}, il = /* @__PURE__ */ H(D0, [["__scopeId", "data-v-660e5c85"]]), P0 = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, j0 = {
  __name: "DocumentEditDialog",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Qt({ abstract: n.row.abstract, body: n.row.body }), o = _("");
    async function l() {
      const i = await n.read([n.term, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = i.ok ? "" : i.error, i.ok && a("saved");
    }
    return (i, u) => (r(), P(Mn, {
      padded: "",
      title: "Edit the document",
      wide: "",
      onClose: u[3] || (u[3] = (c) => a("close"))
    }, {
      foot: q(() => [
        h("span", P0, v(o.value), 1),
        A(ve, {
          onClick: u[2] || (u[2] = (c) => a("close"))
        }, {
          default: q(() => [...u[6] || (u[6] = [
            U("Cancel", -1)
          ])]),
          _: 1
        }),
        A(ve, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: q(() => [...u[7] || (u[7] = [
            U("Save", -1)
          ])]),
          _: 1
        })
      ]),
      default: q(() => [
        h("form", {
          class: "edit-form",
          "data-text-form": "",
          onSubmit: ke(l, ["prevent"])
        }, [
          h("label", null, [
            u[4] || (u[4] = h("span", null, "Abstract", -1)),
            _e(h("input", {
              "onUpdate:modelValue": u[0] || (u[0] = (c) => s.abstract = c)
            }, null, 512), [
              [Ke, s.abstract]
            ])
          ]),
          h("label", null, [
            u[5] || (u[5] = h("span", null, "Text", -1)),
            _e(h("textarea", {
              "onUpdate:modelValue": u[1] || (u[1] = (c) => s.body = c),
              rows: "20"
            }, null, 512), [
              [Ke, s.body]
            ])
          ])
        ], 32)
      ]),
      _: 1
    }));
  }
}, F0 = /* @__PURE__ */ H(j0, [["__scopeId", "data-v-464d77a8"]]);
function fr(e, t) {
  const n = _([]), a = _(!1), s = _(null), o = _(0), l = _(!1), i = _("");
  let u = 0, c = 0;
  const f = (b) => {
    if (typeof b.body == "string") return b.body;
    const { term: w, id: M, title: C } = e(), T = `On ${w} ${M}, ${C}: `;
    return b.text.startsWith(T) ? b.text.slice(T.length) : b.text;
  };
  async function m(b = 1) {
    const { term: w, id: M } = e();
    if (!M) return;
    const C = ++c;
    l.value = !0, i.value = "";
    try {
      const T = await t([w, "comments", String(M), "--page", String(b), "--page-size", "25"]);
      if (C !== c) return;
      if (!T.ok) {
        i.value = T.error;
        return;
      }
      const z = T.value.rows ?? [], W = b === 1 ? z : [...n.value, ...z];
      n.value = [...new Map(W.map((R) => [R.id, R])).values()], o.value = T.value.total ?? n.value.length, s.value = T.value.next_page ?? null;
    } catch (T) {
      C === c && (i.value = T.message);
    } finally {
      C === c && (l.value = !1);
    }
  }
  async function p(b) {
    var R;
    const { term: w, id: M } = e(), C = `${w}:${M}`, T = { id: `sending-${++u}`, text: b };
    n.value = [...n.value, T], o.value++, a.value = !0;
    const z = await t([w, "comment", String(M), b]);
    if (C !== `${e().term}:${e().id}`) return;
    if (!z.ok)
      throw n.value = n.value.filter((G) => G.id !== T.id), o.value = Math.max(0, o.value - 1), new Error(z.error);
    await m();
    const W = (R = z.value) == null ? void 0 : R.id;
    W && !n.value.some((G) => G.id === W) && (n.value = [...n.value, { ...T, id: W }]);
  }
  const y = () => !l.value && s.value && m(s.value);
  return me(() => `${e().term}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, i.value = "", c++, m();
  }, { immediate: !0 }), { comments: n, open: a, words: f, send: p, load: m, loadMore: y, nextPage: s, total: o, loading: l, failure: i };
}
function W0(e, t) {
  const n = e.split(`
`), a = t.split(`
`), s = n.map(() => new Array(a.length + 1).fill(0));
  s.push(new Array(a.length + 1).fill(0));
  for (let u = n.length - 1; u >= 0; u -= 1)
    for (let c = a.length - 1; c >= 0; c -= 1)
      s[u][c] = n[u] === a[c] ? s[u + 1][c + 1] + 1 : Math.max(s[u + 1][c], s[u][c + 1]);
  const o = [];
  let l = 0, i = 0;
  for (; l < n.length || i < a.length; )
    l < n.length && i < a.length && n[l] === a[i] ? (o.push({ key: `old:${l}`, type: "same", text: n[l] }), l += 1, i += 1) : i < a.length && (l === n.length || s[l][i + 1] >= s[l + 1][i]) ? (o.push({ key: `new:${i}`, type: "added", text: a[i] }), i += 1) : (o.push({ key: `old:${l}`, type: "removed", text: n[l] }), l += 1);
  return o;
}
const H0 = {
  class: "document-tab",
  "data-document-revisions": ""
}, z0 = ["datetime"], U0 = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, V0 = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, G0 = {
  key: 2,
  class: "document-none"
}, K0 = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(null), o = _(""), l = x(() => s.value ? W0(s.value.body, n.text) : []);
    async function i(c) {
      const f = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = f.ok ? f.value : null, o.value = f.ok ? "" : f.error;
    }
    async function u() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, f) => (r(), d("div", H0, [
      e.editing ? (r(), P(ve, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: f[0] || (f[0] = (m) => a("close-revision"))
      }, {
        default: q(() => [...f[1] || (f[1] = [
          U("Close the open revision", -1)
        ])]),
        _: 1
      })) : k("", !0),
      e.revisions.length ? (r(), d(B, { key: 1 }, [
        (r(!0), d(B, null, X(e.revisions, (m) => (r(), P(ve, {
          key: m.number,
          variant: "text",
          "data-text-revision": m.number,
          onClick: (p) => i(m)
        }, {
          default: q(() => [
            U("Revision " + v(m.number) + ": " + v(m.change) + " · " + v(m.author_name) + " · ", 1),
            h("time", {
              datetime: m.created_at
            }, v(m.created_at.slice(0, 16).replace("T", " ")), 9, z0)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (r(), d("p", U0, v(o.value), 1)) : k("", !0),
        s.value ? (r(), d(B, { key: 1 }, [
          A(ve, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: u
          }, {
            default: q(() => [...f[2] || (f[2] = [
              U("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          h("div", V0, [
            (r(!0), d(B, null, X(l.value, (m) => (r(), d("div", {
              key: m.key,
              class: Y(["revision-line", m.type])
            }, v(m.text || " "), 3))), 128))
          ])
        ], 64)) : k("", !0)
      ], 64)) : (r(), d("p", G0, "No revisions"))
    ]));
  }
}, Y0 = /* @__PURE__ */ H(K0, [["__scopeId", "data-v-3a381aa4"]]), Q0 = "button, [data-comment-number]", X0 = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function mr(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(Q0) || n.push(t.currentNode);
  return n;
}
function rl(e, t, n) {
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
const J0 = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function Z0(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = mr(e), s = a.map((c) => c.data).join(""), o = rl(a, n.startContainer, n.startOffset), l = s.slice(o, rl(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const u = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: J0(u.nodeType === Node.TEXT_NODE ? u.parentElement : u) };
}
function eb(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function tb(e, t, n) {
  const a = [];
  let s = 0;
  for (const o of e) {
    const l = Math.max(t - s, 0), i = Math.min(n - s, o.data.length);
    l < i && a.push({ node: o, from: l, to: i }), s += o.data.length;
  }
  return a;
}
function Va(e, t, n = "Comment") {
  const a = document.createElement("button");
  return a.type = "button", a.className = "comment-number", a.dataset.commentNumber = t, a.setAttribute("aria-label", `${n} ${e}`), a.textContent = e, a;
}
function nb({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function ab(e, t) {
  const n = mr(e), a = eb(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = tb(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(nb).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(Va(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(Va(t.number, t.id, t.label)) : l.at(-1).append(Va(t.number, t.id, t.label))), !0;
}
function sb(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !ab(e, a) && a.id && n.push(a.id);
  return n;
}
const ob = (e) => e.closest(X0) ?? e;
function ul(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const lb = {
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
    const a = e, s = n, o = _(null), l = _(null), i = _(null), u = _(!1), c = _(null);
    function f() {
      if (!l.value || u.value) return;
      l.value.innerHTML = a.html;
      const w = a.comments.filter((z) => z.quote).map((z) => ({ ...z, label: a.annotationLabel, hot: z.id === a.hot })), M = sb(l.value, a.pending ? [...w, { ...a.pending, pending: !0 }] : w);
      s("lost", M);
      const C = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!C) {
        c.value = null;
        return;
      }
      const T = document.createElement("div");
      T.className = "inline-comment", ob(C).after(T), c.value = T;
    }
    function m() {
      if (!l.value) return;
      const w = Z0(l.value);
      if (u.value = !!w, !w) {
        i.value = null;
        return;
      }
      const M = window.getSelection().getRangeAt(0).getBoundingClientRect(), C = o.value.getBoundingClientRect();
      i.value = { left: `${Math.max(M.left - C.left, 0)}px`, top: `${M.top - C.top + o.value.scrollTop}px` }, s("select", w);
    }
    function p(w) {
      const M = w.target.closest("[data-comment-number]");
      M ? s("number", Number(M.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function y(w) {
      var M;
      (M = l.value.querySelector(`[data-comment="${w}"]`)) == null || M.scrollIntoView({ block: "center" });
    }
    function b(w) {
      var M;
      (M = l.value.querySelectorAll("h3, h4, h5, h6")[w]) == null || M.scrollIntoView({ block: "start" });
    }
    return me(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, u.value, a.pending], f, { flush: "post" }), Ce(() => {
      f(), document.addEventListener("selectionchange", m);
    }), st(() => document.removeEventListener("selectionchange", m)), t({ show: y, showHeading: b, nextTick: Fe }), (w, M) => (r(), d("div", {
      ref_key: "box",
      ref: o,
      class: "document-text"
    }, [
      h("div", {
        ref_key: "text",
        ref: l,
        class: "md document-words",
        "data-resource-text": "",
        onClick: p
      }, null, 512),
      i.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "comment-pill",
        style: ge(i.value),
        "data-comment-pill": "",
        onMousedown: M[0] || (M[0] = ke(() => {
        }, ["prevent"])),
        onClick: M[1] || (M[1] = (C) => s("write"))
      }, [
        A(ie, {
          name: "chat",
          size: 13
        }),
        M[2] || (M[2] = U("Comment on this", -1))
      ], 36)) : k("", !0),
      c.value ? (r(), P(Sn, {
        key: 1,
        to: c.value
      }, [
        ae(w.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : k("", !0),
      ae(w.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, ib = /* @__PURE__ */ H(lb, [["__scopeId", "data-v-a92386e6"]]), rb = { class: "document-tabs" }, ub = ["aria-pressed"], cb = { class: "document-body" }, db = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, fb = {
  key: 1,
  class: "document-loading"
}, mb = {
  class: "document-details",
  "data-resource-fields": ""
}, hb = 760, pb = {
  __name: "DocumentBody",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = Me(ci, _(null)), a = _(null), s = Vg(a), o = x(() => s.value !== null && s.value < hb), l = _(null), i = _(""), u = _([]), c = _([]), f = _(""), m = _("comments"), p = _("text"), y = _(0), b = _(!1), w = _(0), M = _([]), C = _(null), T = _(""), z = _(!1), W = _(null), R = _(null);
    let G = 0;
    const D = fr(() => l.value ? { term: t.term, id: t.id, title: l.value.title } : {}, (oe) => t.read(oe)), E = x(() => ul(D.comments.value)), N = x(() => m.value === "questions" ? ul(c.value) : E.value), j = x(() => m.value === "questions" ? N.value.length : D.total.value), $ = x(() => {
      var oe;
      return (oe = l.value) != null && oe.body ? ro(l.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), g = x(() => {
      var oe;
      return (((oe = l.value) == null ? void 0 : oe.body) ?? "").split(`
`).filter((Q) => /^#{1,4} /.test(Q)).map((Q, pe) => ({ key: String(pe), value: pe, label: Q.replace(/^#+ /, "") }));
    }), S = x(() => E.value.find((oe) => oe.id === w.value)), O = x(() => {
      var oe;
      return (oe = l.value) != null && oe.close_reason ? "Closed" : "Open";
    }), L = x(() => p.value === "comments" && !o.value ? "text" : p.value), F = (oe) => oe.ok ? oe.value.rows ?? [] : [];
    async function V() {
      const oe = ++G, Q = await t.read([t.term, "inspect", String(t.id)]);
      if (oe !== G) return;
      i.value = Q.ok ? "" : Q.error, l.value = Q.ok ? Q.value : null;
      const pe = await t.read(["question", "list", "--all", "--row", `${t.term}:${t.id}`]), et = t.term === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      oe === G && (c.value = F(pe), f.value = pe.ok ? "" : pe.error, u.value = et ? F(et) : []);
    }
    async function Z(oe) {
      const Q = C.value ? ["--quote", C.value.quote, "--position", String(C.value.position), "--selection-type", C.value.selection_type] : [], pe = await t.read([t.term, "comment", String(t.id), ...Q, "--", oe]);
      if (!pe.ok) throw new Error(pe.error);
      C.value = null, await Promise.all([V(), D.load()]);
    }
    async function le() {
      const oe = await t.read(["doc", "close", String(t.id)]);
      i.value = oe.ok ? "" : oe.error, oe.ok && await V();
    }
    function ue() {
      T.value.trim() || (C.value = null);
    }
    async function we(oe) {
      var Q;
      if (y.value = oe, o.value && m.value === "questions") {
        p.value = "comments";
        return;
      }
      if (o.value) {
        w.value = w.value === oe ? 0 : oe;
        return;
      }
      b.value = !0, await Fe(), (Q = a.value.querySelector(m.value === "questions" ? `[data-question-id="${oe}"]` : `[data-comment-id="${oe}"]`)) == null || Q.scrollIntoView({ block: "nearest" });
    }
    async function Oe(oe) {
      var Q, pe;
      p.value = "text", y.value = oe, await ((Q = W.value) == null ? void 0 : Q.nextTick()), (pe = W.value) == null || pe.show(oe);
    }
    function be() {
      z.value = !1, V();
    }
    return me(() => `${t.term}:${t.id}`, () => {
      l.value = null, p.value = "text", b.value = !1, y.value = 0, w.value = 0, C.value = null, c.value = [], f.value = "", V();
    }, { immediate: !0 }), me(m, () => {
      y.value = 0, w.value = 0;
    }), (oe, Q) => (r(), d("div", {
      ref_key: "panel",
      ref: a,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      l.value ? (r(), P(Sn, {
        key: 0,
        to: I(n),
        disabled: !I(n)
      }, [
        h("span", {
          class: Y(["document-actions", { placed: I(n) }]),
          "data-document-actions": ""
        }, [
          A(ve, {
            bordered: "",
            "data-text-edit": "",
            onClick: Q[0] || (Q[0] = (pe) => z.value = !0)
          }, {
            default: q(() => [...Q[15] || (Q[15] = [
              U("Edit", -1)
            ])]),
            _: 1
          }),
          L.value === "text" && g.value.length > 1 ? (r(), P(Qs, {
            key: 0,
            label: o.value ? "" : "Chapters",
            icon: "list",
            items: g.value,
            "data-text-chapters": "",
            onPick: Q[1] || (Q[1] = (pe) => {
              var et;
              return (et = W.value) == null ? void 0 : et.showHeading(pe.value);
            })
          }, null, 8, ["label", "items"])) : k("", !0)
        ], 2)
      ], 8, ["to", "disabled"])) : k("", !0),
      h("nav", rb, [
        h("button", {
          type: "button",
          class: Y(["document-tab-button", { on: L.value === "text" }]),
          "data-document-tab": "text",
          onClick: Q[2] || (Q[2] = (pe) => p.value = "text")
        }, "Text", 2),
        o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: Y(["document-tab-button", { on: L.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: Q[3] || (Q[3] = (pe) => p.value = "comments")
        }, [
          U(v(m.value === "questions" ? "Questions" : "Comments") + " ", 1),
          h("em", null, v(j.value || ""), 1)
        ], 2)) : (r(), d("button", {
          key: 1,
          type: "button",
          class: Y(["document-tab-button", { on: b.value }]),
          "aria-pressed": b.value,
          "data-document-notes-toggle": "",
          onClick: Q[4] || (Q[4] = (pe) => b.value = !b.value)
        }, [
          U(v(m.value === "questions" ? "Questions" : "Comments") + " ", 1),
          h("em", null, v(j.value || ""), 1)
        ], 10, ub)),
        e.term === "doc" ? (r(), d("button", {
          key: 2,
          type: "button",
          class: Y(["document-tab-button", { on: L.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: Q[5] || (Q[5] = (pe) => p.value = "revisions")
        }, [
          Q[16] || (Q[16] = U("Revisions ", -1)),
          h("em", null, v(u.value.length || ""), 1)
        ], 2)) : k("", !0)
      ]),
      h("div", cb, [
        i.value ? (r(), d("p", db, v(i.value), 1)) : l.value ? L.value === "revisions" ? (r(), P(Y0, {
          key: 2,
          id: e.id,
          revisions: u.value,
          text: l.value.body,
          read: e.read,
          editing: l.value.open_author_id !== null && l.value.open_author_id !== void 0,
          onCloseRevision: le,
          onRestored: V
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : L.value === "comments" ? (r(), P(il, {
          key: 3,
          mode: m.value,
          "onUpdate:mode": Q[6] || (Q[6] = (pe) => m.value = pe),
          tab: "",
          comments: E.value,
          questions: c.value,
          hot: y.value,
          lost: M.value,
          failure: f.value,
          read: e.read,
          "comment-more": !!I(D).nextPage.value,
          "comment-loading": I(D).loading.value,
          "comment-failure": I(D).failure.value,
          "comment-total": I(D).total.value,
          onMore: I(D).loadMore,
          onShow: Oe,
          onChanged: V
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (r(), d(B, { key: 4 }, [
          A(ib, {
            ref_key: "words",
            ref: W,
            html: $.value,
            comments: N.value,
            "annotation-label": m.value === "questions" ? "Question" : "Comment",
            hot: y.value,
            pending: C.value,
            inline: w.value,
            onSelect: Q[8] || (Q[8] = (pe) => C.value = pe),
            onClear: ue,
            onNumber: we,
            onWrite: Q[9] || (Q[9] = (pe) => {
              var et;
              return (et = R.value) == null ? void 0 : et.focus();
            }),
            onLost: Q[10] || (Q[10] = (pe) => M.value = pe)
          }, {
            inline: q(() => [
              S.value ? (r(), P(sr, {
                key: 0,
                comment: S.value,
                hot: "",
                onShow: Q[7] || (Q[7] = (pe) => Oe(S.value.id))
              }, null, 8, ["comment"])) : k("", !0)
            ]),
            default: q(() => [
              h("dl", mb, [
                Q[18] || (Q[18] = h("h4", null, "Details", -1)),
                Q[19] || (Q[19] = h("dt", null, "State", -1)),
                h("dd", null, v(O.value), 1),
                l.value.close_reason ? (r(), d(B, { key: 0 }, [
                  Q[17] || (Q[17] = h("dt", null, "Why closed", -1)),
                  h("dd", null, v(l.value.close_reason), 1)
                ], 64)) : k("", !0),
                Q[20] || (Q[20] = h("dt", null, "Created", -1)),
                h("dd", null, [
                  A(Je, {
                    at: l.value.created_at
                  }, null, 8, ["at"])
                ]),
                Q[21] || (Q[21] = h("dt", null, "Updated", -1)),
                h("dd", null, [
                  A(Je, {
                    at: l.value.updated_at
                  }, null, 8, ["at"])
                ])
              ])
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          !o.value && b.value ? (r(), P(il, {
            key: 0,
            mode: m.value,
            "onUpdate:mode": Q[11] || (Q[11] = (pe) => m.value = pe),
            comments: E.value,
            questions: c.value,
            hot: y.value,
            lost: M.value,
            failure: f.value,
            read: e.read,
            "comment-more": !!I(D).nextPage.value,
            "comment-loading": I(D).loading.value,
            "comment-failure": I(D).failure.value,
            "comment-total": I(D).total.value,
            onMore: I(D).loadMore,
            onShow: Oe,
            onChanged: V
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : k("", !0)
        ], 64)) : (r(), d("div", fb, [
          A(Ze)
        ]))
      ]),
      l.value ? (r(), P(ly, {
        key: 1,
        ref_key: "composer",
        ref: R,
        draft: T.value,
        "onUpdate:draft": Q[12] || (Q[12] = (pe) => T.value = pe),
        selection: C.value,
        send: Z,
        narrow: o.value,
        onClear: Q[13] || (Q[13] = (pe) => C.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : k("", !0),
      z.value ? (r(), P(F0, {
        key: 2,
        term: e.term,
        id: e.id,
        row: l.value,
        read: e.read,
        onClose: Q[14] || (Q[14] = (pe) => z.value = !1),
        onSaved: be
      }, null, 8, ["term", "id", "row", "read"])) : k("", !0)
    ], 512));
  }
}, wC = /* @__PURE__ */ H(pb, [["__scopeId", "data-v-f9bd78a7"]]), vb = {
  key: 1,
  class: "row-list-failure"
}, gb = ["data-row"], yb = {
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
    arrival: { type: Object, default: null },
    // whether rows glide to their new place when their order changes, with the move of the activity list
    moves: Boolean,
    // whether rows that leave are removed at once, for a parent that measures the list right after a change
    leavesAtOnce: Boolean
  },
  setup(e) {
    const t = e, n = x(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : t.moves ? { tag: "ul", name: "row-list", css: !t.leavesAtOnce, "data-row-list-moves": "" } : {}), a = _(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (r(), P(Ze, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (r(), d("p", vb, v(e.failure), 1)) : !e.rows.length && e.loaded ? (r(), P(wt, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: q(() => [
        U(v(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (r(), d(B, { key: 3 }, [
      (r(), P(Qe(e.arrival || e.moves ? Hs : "ul"), je(n.value, { class: "row-list" }), {
        default: q(() => [
          (r(!0), d(B, null, X(e.rows, (i) => (r(), d("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            ae(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, gb))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (i) => s(e.older))
      }, "Show more")) : k("", !0)
    ], 64));
  }
}, bb = /* @__PURE__ */ H(yb, [["__scopeId", "data-v-e9f251f3"]]), kb = {
  class: "agent-rows",
  "data-agent-rows": ""
}, wb = {
  key: 1,
  class: "agent-rows-note"
}, $b = {
  key: 2,
  class: "agent-rows-note"
}, xb = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Sb = ["data-agent-row", "onClick"], _b = { class: "agent-row-name" }, Mb = { class: "agent-row-state" }, Cb = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = x(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = x(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (r(), d("div", kb, [
      e.loaded ? e.failure ? (r(), d("p", wb, v(e.failure), 1)) : e.rows.length ? (r(), d(B, { key: 3 }, [
        h("p", xb, v(a.value) + " running", 1),
        (r(!0), d(B, null, X(n.value, (l) => (r(), d("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => I(Pe)(`agents:${l.id}`)
        }, [
          h("span", _b, "#" + v(l.id) + " " + v(l.session), 1),
          h("span", Mb, v(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, Sb))), 128))
      ], 64)) : (r(), d("p", $b, v(e.none), 1)) : (r(), P(Ze, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, $C = /* @__PURE__ */ H(Cb, [["__scopeId", "data-v-a01e5a17"]]), ht = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ge = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Ve = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Ab = 6;
function po(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Eb = (e) => {
  const t = po(e, ht.lineChars), n = Math.max(ht.minWidth, Math.max(...t.map((a) => a.length)) * ht.charWidth + ht.padX * 2);
  return { name: e, lines: t, line: ht.line, padY: ht.padY, width: n, height: t.length * ht.line + ht.padY * 2 };
};
function Ob(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, u) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(u) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function Tb(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function Ib(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var i;
    return (a[i = n.get(l)] || (a[i] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((i, u) => [i, u]))), o = (l, i) => {
    const u = s(), c = (f) => {
      const m = i(f).map((p) => u.get(p));
      return m.length ? m.reduce((p, y) => p + y, 0) / m.length : u.get(f);
    };
    return [...l].sort((f, m) => c(f) - c(m));
  };
  for (let l = 0; l < Ab; l++) {
    const i = l % 2 === 0, u = a.map((c, f) => f);
    (i ? u.slice(1) : u.slice(0, -1).reverse()).forEach((c) => {
      const f = (m) => t.filter((p) => p[i ? 1 : 0] === m).map((p) => p[i ? 0 : 1]);
      a[c] = o(a[c], f);
    });
  }
  return a;
}
function Bb(e, t) {
  const n = /* @__PURE__ */ new Map(), a = (s, o, l, i) => {
    const u = `${s[o]}:${l}`;
    (n.get(u) || n.set(u, []).get(u)).push({ arrow: s, end: o, other: i });
  };
  e.forEach((s) => {
    a(s, "from", s.back ? "top" : "bottom", s.to), a(s, "to", s.back ? "bottom" : "top", s.from);
  });
  for (const s of n.values())
    s.sort((o, l) => t.get(o.other).x - t.get(l.other).x), s.forEach(({ arrow: o, end: l }, i) => o[`${l}Share`] = (i + 1) / (s.length + 1));
}
function Rb(e) {
  const t = [...new Set(e.flatMap(([W, R]) => [W, R]))], n = new Set(e.map(([, W]) => W)), a = t.filter((W) => !n.has(W)), s = Ob(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((W, R) => !s.has(R)), l = Tb(t, o), i = Ib(t, o, l), u = new Map(t.map((W) => [W, Eb(W)])), c = i.map((W) => W.reduce((R, G) => R + u.get(G).width, 0) + Ve.across * (W.length - 1)), f = Math.max(...c) + Ve.margin * 2, m = Nb(e, l, i.length), p = /* @__PURE__ */ new Map();
  let y = Ve.margin;
  i.forEach((W, R) => {
    let G = (f - c[R]) / 2;
    const D = Math.max(...W.map((E) => u.get(E).height));
    W.forEach((E) => {
      const N = u.get(E);
      p.set(E, { ...N, x: G, y: y + (D - N.height) / 2 }), G += N.width + Ve.across;
    }), y += D + (m[R] ?? Ve.down);
  });
  const b = e.map(([W, R, G], D) => ({ from: W, to: R, label: G || "", back: s.has(D) || l.get(R) <= l.get(W) }));
  Bb(b, p);
  const w = b.map((W) => qb(W, p.get(W.from), p.get(W.to))), M = [...p.values()], C = Fb(w, M), T = Math.max(y - Ve.down, ...C.filter((W) => W.label).map((W) => W.label.y + W.label.height));
  return { width: Math.max(f - Ve.margin, ...C.filter((W) => W.label).map((W) => W.label.x + W.label.width)) + Ve.margin, height: T + Ve.margin, nodes: M, arrows: C };
}
const Lb = (e) => e ? po(e, Ge.lineChars).length * Ge.line + Ge.pad * 2 : 0;
function Nb(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Ve.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, u] = [t.get(s), t.get(o)].sort((c, f) => c - f);
    u > i && (a[i + Math.floor((u - i - 1) / 2)] += Lb(l) + Ve.labelSpace);
  }), a.map((s) => Math.max(Ve.down, s));
}
function qb(e, t, n) {
  const a = e.label ? po(e.label, Ge.lineChars) : [], s = a.length ? Math.max(...a.map((p) => p.length)) * Ge.charWidth + Ge.pad * 2 : 0, o = a.length * Ge.line + (a.length ? Ge.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, u = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, f = (c - i) / 2, m = [{ x: l, y: i }, { x: l, y: i + f }, { x: u, y: c - f }, { x: u, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: m, path: `M${l} ${i} C${l} ${i + f} ${u} ${c - f} ${u} ${c}` };
}
const Db = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, Pb = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], jb = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ge.line);
function Fb(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (u, c) => {
      const f = Db(a.curve, u);
      return { x: f.x - a.labelWidth / 2, y: f.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = jb.flatMap((u) => Pb.map((c) => s(c, u))).find((u) => !n.some((c) => cl(u, c))) ?? s(0.5, 0);
    for (; n.some((u) => cl(i, u)); ) i.y += Ge.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: Ge.line, pad: Ge.pad } };
  });
}
const cl = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Wb = { class: "flowchart-tools" }, Hb = ["width", "height", "viewBox", "aria-label"], zb = ["d"], Ub = ["x", "y", "width", "height"], Vb = ["x", "y"], Gb = ["x", "dy"], Kb = {
  key: 0,
  class: "flowchart-label"
}, Yb = ["x", "y", "width", "height"], Qb = ["x", "y"], Xb = ["x", "dy"], Jb = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(() => Rb(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = _(null), i = _({ zoom: 1, x: 0, y: 0 });
    let u = null;
    function c() {
      var C;
      const w = (C = l.value) == null ? void 0 : C.getBoundingClientRect();
      if (!(w != null && w.width)) return;
      const M = Math.min(w.width / s.value.width, w.height / s.value.height, 1.5);
      i.value = { zoom: M, x: (w.width - s.value.width * M) / 2, y: (w.height - s.value.height * M) / 2 };
    }
    function f(w, M, C) {
      const { zoom: T, x: z, y: W } = i.value, R = Math.min(o.most, Math.max(o.least, T * w));
      i.value = { zoom: R, x: M - (M - z) * R / T, y: C - (C - W) * R / T };
    }
    function m(w) {
      const M = l.value.getBoundingClientRect();
      f(w, M.width / 2, M.height / 2);
    }
    function p(w) {
      const M = l.value.getBoundingClientRect();
      w.ctrlKey || w.metaKey ? f(w.deltaY < 0 ? o.step : 1 / o.step, w.clientX - M.left, w.clientY - M.top) : i.value = { ...i.value, x: i.value.x - w.deltaX, y: i.value.y - w.deltaY };
    }
    function y(w) {
      var M, C, T;
      w.preventDefault(), (M = window.getSelection()) == null || M.removeAllRanges(), u = { x: w.clientX - i.value.x, y: w.clientY - i.value.y }, (T = (C = l.value).setPointerCapture) == null || T.call(C, w.pointerId);
    }
    function b(w) {
      u && (i.value = { ...i.value, x: w.clientX - u.x, y: w.clientY - u.y });
    }
    return Ce(c), (w, M) => (r(), P(Mn, {
      padded: "",
      title: e.title,
      large: "",
      onClose: M[4] || (M[4] = (C) => a("close"))
    }, {
      default: q(() => [
        h("div", Wb, [
          A(ve, {
            small: "",
            onClick: M[0] || (M[0] = (C) => m(o.step))
          }, {
            default: q(() => [...M[5] || (M[5] = [
              U("Zoom in", -1)
            ])]),
            _: 1
          }),
          A(ve, {
            small: "",
            onClick: M[1] || (M[1] = (C) => m(1 / o.step))
          }, {
            default: q(() => [...M[6] || (M[6] = [
              U("Zoom out", -1)
            ])]),
            _: 1
          }),
          A(ve, {
            small: "",
            onClick: c
          }, {
            default: q(() => [...M[7] || (M[7] = [
              U("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        h("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: ke(p, ["prevent"]),
          onPointerdown: y,
          onPointermove: b,
          onPointerup: M[2] || (M[2] = (C) => Bo(u) ? u.value = null : u = null),
          onPointercancel: M[3] || (M[3] = (C) => Bo(u) ? u.value = null : u = null)
        }, [
          (r(), d("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: ge({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
          }, [
            M[8] || (M[8] = h("defs", null, [
              h("marker", {
                id: "flowchart-head",
                viewBox: "0 0 10 10",
                refX: "9",
                refY: "5",
                markerWidth: "7",
                markerHeight: "7",
                orient: "auto"
              }, [
                h("path", { d: "M0 0L10 5L0 10z" })
              ])
            ], -1)),
            (r(!0), d(B, null, X(s.value.arrows, (C, T) => (r(), d("path", {
              key: `arrow-${T}`,
              class: "flowchart-arrow",
              d: C.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, zb))), 128)),
            (r(!0), d(B, null, X(s.value.nodes, (C) => (r(), d("g", {
              key: C.name,
              class: "flowchart-node"
            }, [
              h("rect", {
                x: C.x,
                y: C.y,
                width: C.width,
                height: C.height,
                rx: "8"
              }, null, 8, Ub),
              h("text", {
                x: C.x + C.width / 2,
                y: C.y + C.padY + C.line / 2
              }, [
                (r(!0), d(B, null, X(C.lines, (T, z) => (r(), d("tspan", {
                  key: z,
                  x: C.x + C.width / 2,
                  dy: z ? C.line : 0
                }, v(T), 9, Gb))), 128))
              ], 8, Vb)
            ]))), 128)),
            (r(!0), d(B, null, X(s.value.arrows, (C, T) => (r(), d(B, {
              key: `label-${T}`
            }, [
              C.label ? (r(), d("g", Kb, [
                h("rect", {
                  x: C.label.x,
                  y: C.label.y,
                  width: C.label.width,
                  height: C.label.height,
                  rx: "4"
                }, null, 8, Yb),
                h("text", {
                  x: C.label.x + C.label.width / 2,
                  y: C.label.y + C.label.pad + C.label.line / 2
                }, [
                  (r(!0), d(B, null, X(C.label.lines, (z, W) => (r(), d("tspan", {
                    key: W,
                    x: C.label.x + C.label.width / 2,
                    dy: W ? C.label.line : 0
                  }, v(z), 9, Xb))), 128))
                ], 8, Qb)
              ])) : k("", !0)
            ], 64))), 128))
          ], 12, Hb))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Zb = /* @__PURE__ */ H(Jb, [["__scopeId", "data-v-e98799dc"]]), ek = ["innerHTML"], tk = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = x(() => Wo[t.name] || Wo.dot);
    return (a, s) => (r(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, ek));
  }
}, Nt = /* @__PURE__ */ H(tk, [["__scopeId", "data-v-beb5935c"]]), nk = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: Y(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      A(Nt, { name: "fold" })
    ], 2));
  }
}, tn = /* @__PURE__ */ H(nk, [["__scopeId", "data-v-d03899bb"]]), ak = ["data-tip", "aria-label"], sk = {
  key: 0,
  class: "mact-word"
}, ok = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: Y(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      A(Nt, { name: "open" }),
      e.open ? (r(), d("span", sk, v(e.label), 1)) : k("", !0),
      n[0] || (n[0] = h("span", { class: "hit" }, null, -1))
    ], 10, ak));
  }
}, hr = /* @__PURE__ */ H(ok, [["__scopeId", "data-v-3b292e09"]]), pr = 120, Zn = 280, vr = 160, lk = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, ik = ["leaving", "resizing", "entering"];
function Es(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function rk(e) {
  const t = ik.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = Es(e);
  return e.classList.add(...t), n;
}
function gr(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = _(t()), s = _("");
  let o = 0;
  const l = (m, p) => Object.assign(m.style, { width: `${p.width}px`, height: `${p.height}px` }), i = (m) => Object.assign(m.style, { width: "", height: "", transition: "" });
  function u(m, p) {
    i(m);
    const y = rk(m);
    l(m, p), m.offsetWidth, m.style.transition = `width ${Zn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Zn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(m, y);
  }
  function c(m) {
    const p = m.querySelector(":scope > :not(.top)");
    if (!p || typeof ResizeObserver > "u") return null;
    let y = p.offsetHeight;
    const b = new ResizeObserver(() => {
      p.offsetHeight !== y && (y = p.offsetHeight, u(m, Es(m)));
    });
    return b.observe(p), b;
  }
  async function f(m) {
    const p = e.value, y = ++o;
    if (!p || !p.offsetWidth || lk()) {
      a.value = m;
      return;
    }
    const b = Es(p);
    if (l(p, b), s.value = "leaving", await n(pr), y !== o) return;
    a.value = m, s.value = "resizing", await Fe(), u(p, b);
    const w = c(p);
    await n(Zn), w == null || w.disconnect(), y === o && (i(p), s.value = "entering", await n(vr), y === o && (s.value = ""));
  }
  return me(t, (m) => f(m)), st(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const uk = { class: "growing-card-top" }, ck = ["aria-expanded"], dk = { class: "growing-card-avatar" }, fk = { class: "growing-card-title" }, mk = { class: "growing-card-more" }, hk = { class: "growing-card-body" }, pk = {
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
    const n = e, a = t, s = _(!1), o = _(null), { folded: l, phase: i } = gr(o, () => !s.value), u = x(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = x(() => n.text.split(/\n\s*\n/).filter((f) => f.trim()));
    return (f, m) => (r(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: Y(["growing-card-wrap", I(i), { open: !I(l), bad: e.bad, incoming: e.incoming }])
    }, [
      h("div", uk, [
        h("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: m[0] || (m[0] = (p) => s.value = !s.value)
        }, [
          h("span", dk, [
            e.bad ? (r(), P(Nt, {
              key: 0,
              name: "cross"
            })) : u.value ? (r(), d(B, { key: 1 }, [
              U(v(u.value), 1)
            ], 64)) : (r(), P(ie, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          h("span", fk, v(e.title), 1),
          A(tn, { open: s.value }, null, 8, ["open"])
        ], 8, ck),
        e.action ? (r(), P(hr, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: m[1] || (m[1] = (p) => a("act"))
        }, null, 8, ["label", "open"])) : k("", !0),
        e.commentable ? (r(), d("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: m[2] || (m[2] = (p) => a("comment"))
        }, [
          A(ie, {
            name: "bubble",
            size: 13
          })
        ])) : k("", !0)
      ]),
      h("div", mk, [
        h("div", hk, [
          (r(!0), d(B, null, X(c.value, (p, y) => (r(), d("p", {
            key: y,
            class: "growing-card-text"
          }, v(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, vk = /* @__PURE__ */ H(pk, [["__scopeId", "data-v-f2b4930d"]]), gk = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, yk = { class: "md inline" }, bk = ["disabled", "title", "onClick"], kk = {
  key: 1,
  class: "message-links-many"
}, wk = ["aria-expanded"], $k = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, xk = ["disabled", "onClick"], Sk = { class: "row-pill message-links-chip" }, _k = { class: "message-links-title" }, Mk = { key: 0 }, Ga = 3, Ck = "task", Ak = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(() => n.total || n.links.length), o = x(() => n.links.every((p) => p.endpoint.model === Ck) ? "tasks" : "items"), l = _(!1), i = _(null);
    fi(i, () => l.value = !1);
    const u = () => l.value = !l.value, c = (p) => p.endpoint.unavailable || !p.endpoint.open_ref, f = (p) => p.relations.includes("edited") ? p.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function m(p) {
      c(p) || (l.value = !1, Pe(p.endpoint.open_ref));
    }
    return (p, y) => (r(), d("div", {
      ref_key: "line",
      ref: i,
      class: Y(["message-links", { many: s.value > Ga, three: s.value === Ga, open: l.value }]),
      "data-message-links": ""
    }, [
      A(Nt, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (r(), d("span", gk, [
        h("span", yk, [
          y[1] || (y[1] = U("Linked: ", -1)),
          (r(!0), d(B, null, X(e.links, (b) => (r(), d("button", {
            key: `${b.endpoint.model}:${b.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(b),
            title: b.endpoint.title,
            onClick: (w) => m(b)
          }, [
            U(v(b.endpoint.model.replaceAll("_", " ")) + " " + v(b.endpoint.id), 1),
            f(b) ? (r(), d(B, { key: 0 }, [
              U(" (" + v(f(b)) + ")", 1)
            ], 64)) : k("", !0),
            c(b) ? (r(), d(B, { key: 1 }, [
              U(" (unavailable)")
            ], 64)) : k("", !0)
          ], 8, bk))), 128))
        ])
      ])) : k("", !0),
      s.value >= Ga ? (r(), d("span", kk, [
        h("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: u
        }, [
          U(v(s.value) + " linked " + v(o.value) + " ", 1),
          A(tn, { open: l.value }, null, 8, ["open"])
        ], 8, wk)
      ])) : k("", !0),
      l.value ? (r(), d("div", $k, [
        (r(!0), d(B, null, X(e.links, (b) => (r(), d("button", {
          key: `${b.endpoint.model}:${b.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(b),
          onClick: (w) => m(b)
        }, [
          h("span", Sk, v(b.endpoint.model.replaceAll("_", " ")) + " " + v(b.endpoint.id), 1),
          h("span", _k, v(b.endpoint.title), 1),
          h("span", null, v(f(b)), 1),
          c(b) ? (r(), d("span", Mk, "Unavailable")) : k("", !0)
        ], 8, xk))), 128))
      ])) : k("", !0),
      A(_n, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: y[0] || (y[0] = (b) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, Ek = /* @__PURE__ */ H(Ak, [["__scopeId", "data-v-843fc3bd"]]), Ok = ["title", "aria-label"], Tk = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Ik = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Bk = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = x(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (r(), d("span", {
      class: Y(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (r(), d("svg", Tk, [
        o[0] || (o[0] = h("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (r(), d("path", Ik)) : k("", !0)
      ]))
    ], 10, Ok));
  }
}, Rk = /* @__PURE__ */ H(Bk, [["__scopeId", "data-v-6dc92808"]]), Lk = {
  report: { at: 70, keep: 46 },
  message: { at: 420, keep: 320 }
}, Nk = (e) => e.worker_id != null ? "report" : "message", qk = (e) => Lk[Nk(e)], Dk = "img,pre,table";
function Pk(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function jk(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function Fk(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Dk)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = Pk(jk(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function Wk(e, t) {
  let n = null;
  const a = () => e.value && Fk(e.value);
  Ce(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Le(() => n == null ? void 0 : n.disconnect()), me(t, a, { flush: "post" });
}
const Hk = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function zk(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const zn = /* @__PURE__ */ new WeakMap(), qe = "work", nt = "sent", Uk = 50, dl = 50, fl = () => ({ rows: _([]), total: _(0), next: _(null), loading: _(!1), failure: _(""), version: 0 });
function Vk(e) {
  var w;
  if (zn.has(e)) return zn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (M) => {
    var C;
    return ((C = e.visible) == null ? void 0 : C.value) !== !1 && [...M.views].some((T) => T.visible);
  };
  function o(M, C) {
    const T = M[C], z = ++T.version;
    return T.loading.value = !0, T.failure.value = "", z;
  }
  function l(M, C, T, z, W) {
    const R = M[C];
    if (t.get(M.id) !== M || R.version !== T) return;
    if (R.loading.value = !1, !W.ok) {
      R.failure.value = W.error;
      return;
    }
    const G = C === qe ? W.value.counterparts ?? [] : W.value.rows ?? [], D = z === 1 ? G : [...R.rows.value, ...G], E = C === qe ? (N) => `${N.endpoint.model}:${N.endpoint.id}` : (N) => N.id ?? N.target_id;
    R.rows.value = [...new Map(D.map((N) => [E(N), N])).values()], R.total.value = W.value.total ?? R.rows.value.length, R.next.value = W.value.next_page ?? null;
  }
  function i(M, C, T, z) {
    const W = M[C];
    W.version === T && (W.failure.value = z.message, W.loading.value = !1);
  }
  async function u(M, C, T) {
    const z = o(M, C), W = C === qe ? "--type about --type edited --group-counterparts" : "--type sent_to";
    try {
      l(M, C, z, T, await e.read(`link list --source message:${M.id} ${W} --page ${T} --page-size ${C === qe ? 10 : 25}`));
    } catch (R) {
      i(M, C, z, R);
    }
  }
  async function c(M) {
    const C = M.map((T) => ({ [qe]: o(T, qe), [nt]: o(T, nt) }));
    try {
      const T = await e.read(`link receipts --messages ${M.map((z) => z.id).join(",")}`);
      M.forEach((z, W) => {
        const R = T.ok ? T.value.messages[String(z.id)] : null;
        l(z, qe, C[W][qe], 1, T.ok ? { ok: !0, value: R.named } : T), l(z, nt, C[W][nt], 1, T.ok ? { ok: !0, value: R.sent } : T);
      });
    } catch (T) {
      M.forEach((z, W) => [qe, nt].forEach((R) => i(z, R, C[W][R], T)));
    }
  }
  function f() {
    a = null;
    const M = [...n].map((C) => t.get(C)).filter((C) => C && s(C));
    n.clear(), M.forEach((C) => C.dirty.clear());
    for (let C = 0; C < M.length; C += dl) c(M.slice(C, C + dl));
  }
  function m(M, C = [qe, nt]) {
    for (const T of C) M.dirty.add(T);
    s(M) && (n.add(M.id), a ?? (a = setTimeout(f, 0)));
  }
  function p(M) {
    const C = M.sources ?? (M.source_model && Number.isInteger(M.source_id) ? [{ model: M.source_model, id: M.source_id }] : []), T = M.link_types ?? (M.link_type ? [M.link_type] : []), z = T.length ? [qe, nt].filter((R) => R === qe ? T.some((G) => ["about", "edited"].includes(G)) : T.includes("sent_to")) : [qe, nt];
    if (!z.length) return;
    const W = C.length ? [...new Set(C.filter((R) => R.model === "message").map((R) => R.id))].map((R) => t.get(R)).filter(Boolean) : [...t.values()].filter(s).slice(0, Uk);
    for (const R of W) m(R, z);
  }
  const y = (w = e.follow) == null ? void 0 : w.call(e, ["link.*"], p), b = {
    attach(M, C) {
      let T = t.get(M);
      return T || (T = { id: M, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([qe, nt]), work: fl(), sent: fl() }, t.set(M, T)), T.views.add(C), T.dirty.size && m(T, [...T.dirty]), T;
    },
    shown(M) {
      M.dirty.size && m(M, [...M.dirty]);
    },
    detach(M, C) {
      M.views.delete(C), M.views.size || t.delete(M.id), t.size || (clearTimeout(a), y == null || y(), zn.delete(e));
    },
    more(M, C) {
      const T = M == null ? void 0 : M[C];
      if (T != null && T.next.value && !T.loading.value) return u(M, C, T.next.value);
    }
  };
  return zn.set(e, b), b;
}
function Gk(e, t, n) {
  const a = at(null);
  let s = null;
  const o = me(t, (l, i, u) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = Vk(e);
    const c = { visible: typeof IntersectionObserver > "u" }, f = s.attach(l, c);
    a.value = f;
    const m = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((y) => {
      c.visible = y.some((b) => b.isIntersecting), c.visible && s.shown(f);
    }, { rootMargin: "100px" }), p = me(n, (y) => {
      m == null || m.disconnect(), y && (m == null || m.observe(y));
    }, { immediate: !0, flush: "post" });
    u(() => {
      p(), m == null || m.disconnect(), s.detach(f, c), a.value = null;
    });
  }, { immediate: !0 });
  return $a(o), {
    links: x(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.rows.value) ?? [];
    }),
    total: x(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.total.value) ?? 0;
    }),
    more: x(() => {
      var l;
      return !!((l = a.value) != null && l.work.next.value);
    }),
    loading: x(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.loading.value) ?? !1;
    }),
    failure: x(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.failure.value) ?? "";
    }),
    sentTo: x(() => {
      var l;
      return (((l = a.value) == null ? void 0 : l.sent.rows.value) ?? []).map((i) => i.target);
    }),
    sentMore: x(() => {
      var l;
      return !!((l = a.value) != null && l.sent.next.value);
    }),
    sentLoading: x(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.loading.value) ?? !1;
    }),
    sentFailure: x(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.failure.value) ?? "";
    }),
    loadMore: () => s == null ? void 0 : s.more(a.value, qe),
    loadSent: () => s == null ? void 0 : s.more(a.value, nt)
  };
}
const Kk = ["data-incoming", "data-ref"], Yk = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], Qk = { class: "message-body" }, Xk = ["title"], Jk = ["innerHTML"], Zk = ["innerHTML"], ew = {
  class: "message-faces",
  "data-message-faces": ""
}, tw = ["title", "data-face", "onClick"], nw = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, aw = ["title", "data-reaction", "onClick"], sw = {
  key: 0,
  class: "message-reaction-count"
}, ow = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, lw = ["href", "title"], iw = ["src", "alt"], rw = ["href"], uw = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, cw = { class: "message-foot" }, dw = { class: "message-time" }, fw = {
  class: "message-id",
  "data-message-id": ""
}, mw = 1500, hw = "An earlier message", pw = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1), o = _(null), l = x(() => ["user", "comment"].includes(n.message.type)), i = x(() => {
      const [be, oe] = (n.message.commented_row || ":").split(":"), Q = yt(be);
      return Q ? { ref: `${Q}:${oe}`, label: `${en(Q).title.toLowerCase()} ${oe}` } : null;
    }), u = x(() => n.message.worker_id ?? null), c = x(() => qk(n.message)), f = x(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var be;
      await ((be = navigator.clipboard) == null ? void 0 : be.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, mw);
    }
    const p = Fi(), y = x(() => p(n.message.text ?? "")), b = x(() => JSON.parse(n.message.flowchart_edges || "[]")), w = _(!1), M = x(() => _s(n.quote)), C = x(() => p(M.value || hw));
    function T() {
      const be = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      be ? be.scrollIntoView({ block: "center", behavior: "smooth" }) : Pe(`messages:${n.message.parent_id}`);
    }
    Wk(o, () => `${n.message.text} ${M.value}`);
    const z = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, W = (be) => `/api/files/message/${n.message.id}/${encodeURIComponent(be)}`, R = x(() => JSON.parse(n.message.captions || "{}")), G = x(() => (n.message.files ?? []).map((be) => ({ name: be, address: W(be), isImage: z.test(be), title: R.value[be] || be }))), D = x(() => Zi(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), E = Me(Re, null), { links: N, total: j, more: $, loading: g, failure: S, sentTo: O, sentMore: L, sentLoading: F, sentFailure: V, loadMore: Z, loadSent: le } = Gk(E, () => l.value && !n.message.local ? n.message.id : null, o), ue = _(!1), we = x(() => zk(n.message.reactions));
    function Oe(be) {
      ue.value = !1, a("react", n.message, be);
    }
    return (be, oe) => e.message.peer || e.message.recipient ? (r(), d("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      A(vk, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: oe[0] || (oe[0] = (Q) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Kk)) : (r(), d("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      h("div", Qk, [
        h("div", {
          ref_key: "bubble",
          ref: o,
          class: Y(["message-card", "md", { comment: i.value }]),
          onClick: oe[5] || (oe[5] = (...Q) => I(Ht) && I(Ht)(...Q))
        }, [
          i.value ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: oe[1] || (oe[1] = ke((Q) => I(Pe)(i.value.ref), ["stop"]))
          }, [
            A(ie, {
              name: "bubble",
              size: 12
            }),
            h("span", null, "Comment on " + v(i.value.label), 1)
          ], 8, Xk)) : k("", !0),
          e.message.parent_id ? (r(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: ke(T, ["stop"]),
            innerHTML: C.value
          }, null, 8, Jk)) : k("", !0),
          u.value !== null ? (r(), P(vn, {
            key: 2,
            as: "button",
            "agent-id": u.value,
            label: `Worker ${u.value}`,
            class: "message-worker",
            "data-message-worker": "",
            onClick: oe[2] || (oe[2] = ke((Q) => I(Pe)(`agents:${u.value}`), ["stop"]))
          }, {
            default: q(() => [
              U("Worker " + v(u.value), 1)
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : k("", !0),
          A(Li, {
            at: c.value.at,
            keep: c.value.keep,
            name: `message:${e.message.id}`
          }, {
            default: q(() => [
              h("div", {
                "data-message-text": "",
                innerHTML: y.value
              }, null, 8, Zk)
            ]),
            _: 1
          }, 8, ["at", "keep", "name"]),
          b.value.length ? (r(), d(B, { key: 3 }, [
            h("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: oe[3] || (oe[3] = (Q) => w.value = !0)
            }, "Open the flowchart"),
            w.value ? (r(), P(Zb, {
              key: 0,
              title: e.message.text,
              edges: b.value,
              onClose: oe[4] || (oe[4] = (Q) => w.value = !1)
            }, null, 8, ["title", "edges"])) : k("", !0)
          ], 64)) : k("", !0)
        ], 2),
        h("div", {
          class: Y(["message-tools", { picking: ue.value }]),
          "data-message-tools": ""
        }, [
          ue.value ? (r(), d(B, { key: 0 }, [
            h("div", ew, [
              (r(!0), d(B, null, X(I(Hk), (Q) => (r(), d("button", {
                key: Q,
                type: "button",
                class: "message-face",
                title: `React ${Q}`,
                "data-face": Q,
                onClick: (pe) => Oe(Q)
              }, v(Q), 9, tw))), 128))
            ]),
            h("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: oe[6] || (oe[6] = (Q) => ue.value = !1)
            }, [
              A(ie, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (r(), d(B, { key: 1 }, [
            h("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: oe[7] || (oe[7] = (Q) => ue.value = !0)
            }, "React"),
            h("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: oe[8] || (oe[8] = (Q) => a("reply", e.message))
            }, "Reply"),
            h("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: m
            }, v(s.value ? "Copied" : "Copy"), 1),
            f.value ? (r(), d("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: oe[9] || (oe[9] = (Q) => a("delete", e.message))
            }, "Delete")) : k("", !0)
          ], 64))
        ], 2)
      ]),
      we.value.length ? (r(), d("div", nw, [
        (r(!0), d(B, null, X(we.value, (Q) => (r(), d("button", {
          key: Q.emoji,
          type: "button",
          class: Y(["message-reaction", { mine: Q.mine }]),
          title: Q.title,
          "data-reaction": Q.emoji,
          onClick: (pe) => a("react", e.message, Q.emoji)
        }, [
          U(v(Q.emoji) + " ", 1),
          Q.count > 1 ? (r(), d("span", sw, v(Q.count), 1)) : k("", !0)
        ], 10, aw))), 128))
      ])) : k("", !0),
      G.value.length ? (r(), d("div", ow, [
        (r(!0), d(B, null, X(G.value, (Q) => (r(), d(B, {
          key: Q.name
        }, [
          Q.isImage ? (r(), d("a", {
            key: 0,
            href: Q.address,
            target: "_blank",
            class: "message-image",
            title: Q.title
          }, [
            h("img", {
              src: Q.address,
              alt: Q.name,
              "data-figure-picture": ""
            }, null, 8, iw)
          ], 8, lw)) : (r(), d("a", {
            key: 1,
            href: Q.address,
            target: "_blank",
            class: "message-file"
          }, v(Q.name), 9, rw))
        ], 64))), 128))
      ])) : k("", !0),
      I(O).length ? (r(), d("div", uw, [
        A(ie, {
          name: "send",
          size: 12
        }),
        (r(!0), d(B, null, X(I(O), (Q) => (r(), P(vn, {
          key: Q.id,
          as: "button",
          "agent-id": Q.id,
          label: `Worker ${Q.id}`,
          class: "message-sent-worker",
          disabled: Q.unavailable || !Q.open_ref,
          "data-sent-worker": Q.id,
          onClick: ke((pe) => Q.open_ref && I(Pe)(Q.open_ref), ["stop"])
        }, {
          default: q(() => [
            U("Also sent to worker " + v(Q.id), 1),
            Q.unavailable ? (r(), d(B, { key: 0 }, [
              U(" (unavailable)")
            ], 64)) : k("", !0)
          ]),
          _: 2
        }, 1032, ["agent-id", "label", "disabled", "data-sent-worker", "onClick"]))), 128))
      ])) : k("", !0),
      A(_n, {
        more: I(L),
        loading: I(F),
        failure: I(V),
        label: "More recipients",
        onMore: I(le)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      h("div", cw, [
        h("time", dw, v(D.value), 1),
        Number.isInteger(e.message.id) ? (r(), d(B, { key: 0 }, [
          oe[10] || (oe[10] = h("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          h("span", fw, "message " + v(e.message.id), 1)
        ], 64)) : k("", !0),
        l.value ? (r(), P(Rk, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : k("", !0)
      ]),
      I(N).length || I(S) ? (r(), P(Ek, {
        key: 3,
        links: I(N),
        total: I(j),
        more: I($),
        loading: I(g),
        failure: I(S),
        onMore: I(Z)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : k("", !0)
    ], 8, Yk));
  }
}, xC = /* @__PURE__ */ H(pw, [["__scopeId", "data-v-95d3070e"]]), da = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Ka = 200, yr = (e) => {
  var t;
  return ((t = da.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? da[0].key;
}, SC = (e) => {
  var t;
  return ((t = da.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, vw = ["aria-label"], gw = 300, ml = 400, yw = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Ka } },
  setup(e) {
    const t = e, n = x(() => yr(t.value)), a = x(() => n.value < Ka ? [1, 0.25, 0.25] : n.value === Ka ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (r(), d("svg", {
      class: Y(["ico", "prio", { hot: n.value >= ml, high: n.value >= gw && n.value < ml }]),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.6",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-label": `priority ${e.value}`
    }, [
      h("path", {
        d: "M4.5 13l3.5-2.25L11.5 13",
        style: ge({ opacity: a.value[0] })
      }, null, 4),
      h("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: ge({ opacity: a.value[1] })
      }, null, 4),
      h("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: ge({ opacity: a.value[2] })
      }, null, 4)
    ], 10, vw));
  }
}, _C = /* @__PURE__ */ H(yw, [["__scopeId", "data-v-b10e610f"]]), br = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], MC = (e) => {
  const t = br[e - 1];
  return t.slice(0, 1).toUpperCase() + t.slice(1);
}, bw = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, hl = (e) => bw[e.card.state] || "idle", kw = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), pl = { working: 0, waiting: 1, idle: 2, stopped: 3 }, vl = (e, t) => pl[hl(e)] - pl[hl(t)], gl = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, CC = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => vl(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || kw(a, s)) : [...e].sort((a, s) => vl(a, s) || (gl[t] || gl.state)(a, s)), ww = { class: "list-row" }, $w = {
  key: 0,
  class: "list-row-type"
}, xw = { class: "list-row-main" }, Sw = {
  key: 0,
  class: "list-row-title"
}, _w = { class: "list-row-body" }, Mw = {
  key: 1,
  class: "list-row-end"
}, Cw = {
  key: 1,
  class: "list-row-text"
}, Aw = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", ww, [
      e.type ? (r(), d("span", $w, v(e.type), 1)) : k("", !0),
      h("div", xw, [
        e.title ? (r(), d("span", Sw, v(e.title), 1)) : k("", !0),
        h("div", _w, [
          ae(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (r(), d("div", Mw, [
          ae(t.$slots, "end", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      e.text ? (r(), d("span", Cw, v(e.text), 1)) : k("", !0)
    ]));
  }
}, Ew = /* @__PURE__ */ H(Aw, [["__scopeId", "data-v-dfc8c3a7"]]), AC = {
  __name: "ModelPicker",
  props: {
    title: { type: String, required: !0 },
    models: { type: Array, required: !0 },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(() => [
      ...n.models.map((l) => ({ key: l.name, label: l.name, note: l.tier })),
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = x(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, i) => (r(), P(Qs, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: i[0] || (i[0] = (u) => a("pick", u.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Ow = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: Y(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      ae(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, Os = /* @__PURE__ */ H(Ow, [["__scopeId", "data-v-978e0921"]]), Tw = ["aria-label"], Iw = { class: "head" }, Bw = { class: "names" }, Rw = { class: "body" }, Lw = {
  __name: "SidePanel",
  props: {
    title: { type: String, default: "" },
    abstract: { type: String, default: "" },
    width: { type: String, default: "normal" },
    open: { type: Boolean, default: null },
    depth: { type: Number, default: 0 },
    over: { type: Boolean, default: !1 },
    closeLabel: { type: String, default: "Close the panel" },
    footBelow: { type: Boolean, default: !1 }
  },
  emits: ["close", "dismiss"],
  setup(e, { emit: t }) {
    const n = e, a = t, { visible: s, close: o, closed: l } = Si(a, n), i = _i(s);
    return (u, c) => (r(), P(Sn, { to: "body" }, [
      A(Xt, {
        name: "side",
        appear: "",
        onAfterLeave: I(l)
      }, {
        default: q(() => [
          I(s) ? (r(), d("div", {
            key: 0,
            class: Y(["veil", { over: e.over, under: e.depth }]),
            style: ge({ "--depth": e.depth, zIndex: I(i) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = ke((...f) => I(o) && I(o)(...f), ["self"]))
          }, [
            h("aside", {
              class: Y(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (r(), d(B, { key: 0 }, [
                h("header", Iw, [
                  h("div", Bw, [
                    h("h2", null, v(e.title), 1),
                    e.abstract ? (r(), P(rt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : k("", !0),
                    ae(u.$slots, "meta", {}, void 0, !0)
                  ]),
                  ae(u.$slots, "actions", {}, void 0, !0),
                  A(xa, {
                    title: e.closeLabel,
                    onClick: I(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                u.$slots.foot && !e.footBelow ? (r(), P(Os, { key: 0 }, {
                  default: q(() => [
                    ae(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0),
                h("div", Rw, [
                  ae(u.$slots, "default", {}, void 0, !0)
                ]),
                u.$slots.foot && e.footBelow ? (r(), P(Os, {
                  key: 1,
                  class: "below"
                }, {
                  default: q(() => [
                    ae(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0)
              ], 64)) : ae(u.$slots, "default", {}, void 0, !0, 1)
            ], 10, Tw)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, EC = /* @__PURE__ */ H(Lw, [["__scopeId", "data-v-d0a677ef"]]), Nw = {
  key: 1,
  class: "text-field-label"
}, qw = {
  key: 2,
  class: "text-field-end"
}, Dw = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Tt({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = Gt(e, "modelValue"), a = ka(), s = "onUpdate:modelValue" in (((f = Bu()) == null ? void 0 : f.vnode.props) || {}), o = x(() => s ? n.value : a.value), l = (m) => s && (n.value = m.target.value), i = x(
      () => Object.fromEntries(Object.entries(a).filter(([m]) => m !== "class" && m !== "style" && m !== "value"))
    ), u = x(() => Object.fromEntries(Object.entries(a).filter(([m]) => m !== "value"))), c = _(null);
    return t({ focus: () => c.value && c.value.focus() }), (m, p) => e.label || e.icon || m.$slots.end ? (r(), d("label", {
      key: 0,
      class: Y(["text-field", { large: e.large, ended: m.$slots.end }, I(a).class]),
      style: ge(I(a).style)
    }, [
      e.icon ? (r(), P(ie, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : k("", !0),
      e.label ? (r(), d("span", Nw, v(e.label), 1)) : k("", !0),
      _e(h("input", je({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [I($s), o.value]
      ]),
      m.$slots.end ? (r(), d("span", qw, [
        ae(m.$slots, "end", {}, void 0, !0)
      ])) : k("", !0)
    ], 6)) : _e((r(), d("input", je({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, u.value, { onInput: l }), null, 16)), [
      [I($s), o.value]
    ]);
  }
}), Pw = /* @__PURE__ */ H(Dw, [["__scopeId", "data-v-d9c38ca8"]]), jw = {
  class: "page-header",
  "data-page-header": ""
}, Fw = { class: "page-title" }, Ww = {
  key: 0,
  class: "page-count",
  "data-page-count": ""
}, Hw = { class: "page-header-end" }, zw = {
  __name: "PageHeader",
  props: { title: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (r(), d("header", jw, [
      h("h1", Fw, [
        U(v(e.title), 1),
        e.count !== null ? (r(), d("span", Ww, v(e.count), 1)) : k("", !0)
      ]),
      h("span", Hw, [
        ae(t.$slots, "primary", {}, void 0, !0),
        ae(t.$slots, "actions", {}, void 0, !0)
      ])
    ]));
  }
}, Uw = /* @__PURE__ */ H(zw, [["__scopeId", "data-v-78e5d537"]]);
function kr(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
function OC(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const TC = () => ({}), fa = (e) => Object.fromEntries(e.filter((t) => {
  var n;
  return (n = t.default) == null ? void 0 : n.length;
}).map((t) => [t.key, { not: !1, values: [...t.default] }])), wr = (e, t) => {
  const n = (t == null ? void 0 : t.values) ?? [], a = e.default ?? [];
  return !(t != null && t.not) && n.length === a.length && a.every((s) => n.includes(s));
}, $r = (e) => !!(e != null && e.values.length), IC = (e, t, n = (a) => a) => [...new Set(e.flatMap((a) => [].concat(t(a))).filter((a) => a != null && a !== ""))].map((a) => [a, n(a)]), Vw = (e, t, n) => t.filter((a) => [].concat(e.get(a)).includes(n)).length;
function xr(e, t, n, a = "", s = []) {
  return e.filter((o) => t.every((l) => Gw(o, l, n[l.key])) && (!a.trim() || kr(o, a, s)));
}
function Gw(e, t, n) {
  if (!$r(n)) return !0;
  const a = [].concat(t.get(e)), s = n.values.some((o) => a.includes(o));
  return n.not ? !s : s;
}
const Kw = { class: "filter-ways" }, Yw = { class: "filter-count" }, Qw = {
  __name: "FilterChoices",
  props: { field: { type: Object, required: !0 }, rows: { type: Array, required: !0 }, modelValue: { type: Object, default: null } },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = [
      { key: "is", label: "is" },
      { key: "not", label: "is not" }
    ], o = () => n.modelValue ?? { not: !1, values: [] }, l = (c) => a("update:modelValue", c.values.length ? c : null), i = (c) => l({ ...o(), not: c === "not" }), u = (c) => l({ ...o(), values: o().values.includes(c) ? o().values.filter((f) => f !== c) : [...o().values, c] });
    return (c, f) => (r(), d(B, null, [
      h("div", Kw, [
        A(Bt, {
          options: s,
          value: o().not ? "not" : "is",
          onPick: i
        }, null, 8, ["value"])
      ]),
      (r(!0), d(B, null, X(e.field.options, ([m, p]) => (r(), P(He, {
        key: m,
        checked: o().values.includes(m),
        "data-filter-option": m,
        onClick: (y) => u(m)
      }, {
        default: q(() => [
          U(v(p) + " ", 1),
          h("span", Yw, v(I(Vw)(e.field, e.rows, m)), 1)
        ]),
        _: 2
      }, 1032, ["checked", "data-filter-option", "onClick"]))), 128))
    ], 64));
  }
}, Sr = /* @__PURE__ */ H(Qw, [["__scopeId", "data-v-4e84eb6e"]]), Xw = ["data-filter-chip"], Jw = ["aria-expanded"], Zw = {
  key: 0,
  "data-filter-value": ""
}, e2 = ["aria-label"], t2 = {
  __name: "FilterChip",
  props: { field: { type: Object, required: !0 }, rows: { type: Array, required: !0 }, modelValue: { type: Object, default: null } },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(null), o = x(() => $r(n.modelValue)), l = x(() => !wr(n.field, n.modelValue)), i = x(() => n.modelValue.values.map((f) => {
      var m;
      return ((m = n.field.options.find(([p]) => p === f)) == null ? void 0 : m[1]) ?? f;
    }).join(", ")), u = () => {
      var f;
      return a("update:modelValue", (f = n.field.default) != null && f.length ? { not: !1, values: [...n.field.default] } : null);
    }, c = (f) => s.value = s.value ? null : f.currentTarget;
    return (f, m) => (r(), d("span", {
      class: Y(["filter-chip", { on: o.value }]),
      "data-filter-chip": e.field.key
    }, [
      h("button", {
        type: "button",
        class: "filter-chip-main",
        "aria-haspopup": "menu",
        "aria-expanded": !!s.value,
        onClick: c
      }, [
        h("span", null, v(e.field.label), 1),
        o.value ? (r(), d("b", Zw, v(e.modelValue.not ? "is not " : ": ") + v(i.value), 1)) : k("", !0),
        A(ie, {
          name: "caret",
          size: 10
        })
      ], 8, Jw),
      o.value && l.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "filter-chip-clear",
        "data-filter-clear": "",
        "aria-label": `Clear ${e.field.label}`,
        onClick: u
      }, [
        A(ie, {
          name: "close",
          size: 9
        })
      ], 8, e2)) : k("", !0),
      s.value ? (r(), P(Zt, {
        key: 1,
        anchor: s.value,
        align: "start",
        "min-width": 240,
        "max-width": 320,
        onClick: m[1] || (m[1] = ke(() => {
        }, ["stop"])),
        onClose: m[2] || (m[2] = (p) => s.value = null)
      }, {
        default: q(() => [
          A(Sr, {
            field: e.field,
            rows: e.rows,
            "model-value": e.modelValue,
            "onUpdate:modelValue": m[0] || (m[0] = (p) => a("update:modelValue", p))
          }, null, 8, ["field", "rows", "model-value"])
        ]),
        _: 1
      }, 8, ["anchor"])) : k("", !0)
    ], 10, Xw));
  }
}, n2 = /* @__PURE__ */ H(t2, [["__scopeId", "data-v-0cc7efe6"]]), a2 = {
  class: "search-bar",
  "data-search-bar": ""
}, s2 = { class: "search-bar-control" }, o2 = ["value", "placeholder", "aria-label"], l2 = ["aria-expanded"], i2 = {
  key: 0,
  "data-menu-count": ""
}, r2 = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var C;
    const a = e, s = n, o = Ru(), l = ((C = Me(Re, null)) == null ? void 0 : C.search) ?? {}, i = x(() => l.placeholder || a.placeholder), u = l.context ?? [], c = _(null), f = _(null), m = _([]), p = x(() => m.value.length ? m.value[m.value.length - 1].next : u), y = x(() => !!o.menu || u.length > 0), b = (T) => {
      m.value = [], f.value = f.value ? null : T.currentTarget;
    };
    function w(T) {
      if (T.next.length) {
        m.value = [...m.value, T];
        return;
      }
      f.value = null, s("pick", T.click);
    }
    function M() {
      var T;
      s("update:modelValue", ""), (T = c.value) == null || T.focus();
    }
    return t({ focus: () => {
      var T;
      return (T = c.value) == null ? void 0 : T.focus();
    } }), (T, z) => {
      var W;
      return r(), d("div", a2, [
        h("div", s2, [
          A(ie, {
            class: "search-bar-icon",
            name: "search",
            size: 14
          }),
          h("input", {
            ref_key: "field",
            ref: c,
            class: "search-bar-input",
            type: "text",
            "data-search-input": "",
            value: e.modelValue,
            placeholder: i.value,
            "aria-label": i.value,
            onInput: z[0] || (z[0] = (R) => s("update:modelValue", R.target.value)),
            onKeydown: Ot(M, ["esc"])
          }, null, 40, o2),
          e.modelValue ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: M
          }, [
            A(ie, {
              name: "close",
              size: 12
            })
          ])) : k("", !0),
          y.value ? (r(), d("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!f.value,
            onClick: b
          }, [
            e.menuCount ? (r(), d("span", i2, v(e.menuCount), 1)) : k("", !0),
            A(ie, {
              name: "caret",
              size: 12
            })
          ], 8, l2)) : k("", !0)
        ]),
        (W = I(l).button) != null && W.title ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: z[1] || (z[1] = (R) => s("pick", I(l).button.click))
        }, v(I(l).button.title), 1)) : k("", !0),
        ae(T.$slots, "default", {}, void 0, !0),
        f.value ? (r(), P(Zt, {
          key: 1,
          anchor: f.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: z[3] || (z[3] = ke(() => {
          }, ["stop"])),
          onClose: z[4] || (z[4] = (R) => f.value = null)
        }, {
          default: q(() => [
            m.value.length ? (r(), P(He, {
              key: 0,
              "data-search-back": "",
              onClick: z[2] || (z[2] = (R) => m.value = m.value.slice(0, -1))
            }, {
              default: q(() => [
                U("‹ " + v(m.value[m.value.length - 1].title), 1)
              ]),
              _: 1
            })) : k("", !0),
            (r(!0), d(B, null, X(p.value, (R) => (r(), P(He, {
              key: R.title,
              description: R.subtext,
              "data-search-entry": R.title,
              onClick: (G) => w(R)
            }, {
              default: q(() => [
                U(v(R.title) + v(R.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            m.value.length ? k("", !0) : ae(T.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : k("", !0)
      ]);
    };
  }
}, _r = /* @__PURE__ */ H(r2, [["__scopeId", "data-v-45374bed"]]), u2 = ["aria-expanded"], c2 = {
  key: 0,
  class: "filter-count",
  "data-filter-count": ""
}, d2 = 72, f2 = {
  __name: "FilterBar",
  props: {
    fields: { type: Array, required: !0 },
    rows: { type: Array, required: !0 },
    modelValue: { type: Object, required: !0 },
    words: { type: String, default: "" },
    shown: { type: Number, default: null },
    placeholder: { type: String, default: "Search" }
  },
  emits: ["update:modelValue", "update:words"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(null), o = _(null), l = _([]), i = x(() => n.fields.filter((y) => l.value.includes(y.key))), u = x(() => n.fields.some((y) => !wr(y, n.modelValue[y.key])) || !!n.words.trim()), c = (y, b) => a("update:modelValue", { ...n.modelValue, [y]: b }), f = () => {
      a("update:modelValue", fa(n.fields)), a("update:words", "");
    };
    async function m() {
      if (!s.value) return;
      l.value = [], await Fe();
      const y = s.value.clientWidth;
      y && (l.value = [...s.value.querySelectorAll("[data-filter-chip]")].filter((b) => b.offsetLeft + b.offsetWidth > y - d2).map((b) => b.dataset.filterChip));
    }
    let p = null;
    return Ce(() => {
      m(), p = new ResizeObserver(m), p.observe(s.value);
    }), Le(() => p == null ? void 0 : p.disconnect()), me(() => [n.fields.length, n.modelValue], () => m(), { flush: "post" }), (y, b) => (r(), P(_r, {
      "model-value": e.words,
      class: "filter-bar",
      placeholder: e.placeholder,
      "data-filter-bar": "",
      "onUpdate:modelValue": b[3] || (b[3] = (w) => a("update:words", w))
    }, {
      default: q(() => [
        h("div", {
          ref_key: "chips",
          ref: s,
          class: "filter-chips"
        }, [
          (r(!0), d(B, null, X(e.fields, (w) => _e((r(), P(n2, {
            key: w.key,
            field: w,
            rows: e.rows,
            "model-value": e.modelValue[w.key] ?? null,
            "onUpdate:modelValue": (M) => c(w.key, M)
          }, null, 8, ["field", "rows", "model-value", "onUpdate:modelValue"])), [
            [zs, !l.value.includes(w.key)]
          ])), 128))
        ], 512),
        i.value.length ? (r(), d(B, { key: 0 }, [
          h("button", {
            type: "button",
            class: "filter-more",
            "data-filter-more": "",
            "aria-haspopup": "menu",
            "aria-expanded": !!o.value,
            onClick: b[0] || (b[0] = (w) => o.value = o.value ? null : w.currentTarget)
          }, "More", 8, u2),
          o.value ? (r(), P(Zt, {
            key: 0,
            anchor: o.value,
            align: "end",
            "min-width": 240,
            "max-width": 320,
            onClick: b[1] || (b[1] = ke(() => {
            }, ["stop"])),
            onClose: b[2] || (b[2] = (w) => o.value = null)
          }, {
            default: q(() => [
              (r(!0), d(B, null, X(i.value, (w) => (r(), d(B, {
                key: w.key
              }, [
                A(bt, null, {
                  default: q(() => [
                    U(v(w.label), 1)
                  ]),
                  _: 2
                }, 1024),
                A(Sr, {
                  field: w,
                  rows: e.rows,
                  "model-value": e.modelValue[w.key] ?? null,
                  "onUpdate:modelValue": (M) => c(w.key, M)
                }, null, 8, ["field", "rows", "model-value", "onUpdate:modelValue"])
              ], 64))), 128))
            ]),
            _: 1
          }, 8, ["anchor"])) : k("", !0)
        ], 64)) : k("", !0),
        u.value ? (r(), d(B, { key: 1 }, [
          e.shown !== null ? (r(), d("span", c2, v(e.shown) + " of " + v(e.rows.length), 1)) : k("", !0),
          h("button", {
            type: "button",
            class: "filter-clear",
            "data-filter-clear-all": "",
            onClick: f
          }, "Clear")
        ], 64)) : k("", !0)
      ]),
      _: 1
    }, 8, ["model-value", "placeholder"]));
  }
}, Mr = /* @__PURE__ */ H(f2, [["__scopeId", "data-v-6580d498"]]), m2 = { class: "title" }, h2 = { class: "state" }, p2 = {
  __name: "StateRows",
  props: {
    term: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = vs(t.line, t.events);
    return (o, l) => (r(), P(bb, {
      rows: I(n),
      failure: I(a),
      loaded: I(s),
      empty: e.empty
    }, {
      default: q(({ row: i }) => [
        h("span", m2, v(i.title), 1),
        h("span", h2, v(I(hn)(e.term, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, BC = /* @__PURE__ */ H(p2, [["__scopeId", "data-v-6be0c59e"]]);
function v2(e = 1e3, t = null) {
  const n = _(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? me(t, s, { immediate: !0 }) : s(!0), Le(() => clearInterval(a)), n;
}
const Ya = _(Date.now() / 1e3);
let yl = 0, Un = 0;
function vo() {
  return Un || (Ya.value = Date.now() / 1e3, yl = setInterval(() => Ya.value = Date.now() / 1e3, 1e3)), Un += 1, Yl() && $a(() => {
    Un -= 1, Un || clearInterval(yl);
  }), Ya;
}
const g2 = 200, y2 = pr + Zn + vr + g2, b2 = 300, Vn = /* @__PURE__ */ new WeakMap();
function k2(e, t) {
  const n = Vn.get(e) ?? [];
  Vn.set(e, [...n, t]), !n.length && setTimeout(() => {
    const a = Vn.get(e);
    Vn.delete(e), e.run(["developer", "record-mark-motion", JSON.stringify(a)]);
  }, b2);
}
function an(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function w2(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: an(e),
    top: an(e.querySelector(".top")),
    title: an(e.querySelector(".title")),
    contents: an(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var l, i, u, c;
      return `${((i = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : i.className) || ((c = (u = o.effect) == null ? void 0 : u.target) == null ? void 0 : c.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: i, boxSizing: u, transform: c, display: f }) => ({ width: o, minWidth: l, maxWidth: i, boxSizing: u, transform: c, display: f }))(getComputedStyle(e)),
    parent: an(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function $2(e, t, n, a) {
  me(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function u() {
      if (a.markMotion.value) {
        if (i.push(w2(o, l, n.value)), performance.now() - l < y2) return void requestAnimationFrame(u);
        k2(a, { key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i });
      }
    }
    u();
  }, { flush: "sync" });
}
const x2 = ["title", "data-figure-mark", "data-folded", "data-open"], S2 = {
  key: 2,
  class: "worker"
}, _2 = { class: "head" }, M2 = { key: 0 }, C2 = {
  key: 3,
  class: "status"
}, A2 = {
  key: 0,
  class: "figure"
}, E2 = {
  key: 1,
  class: "ran-for"
}, O2 = { key: 2 }, T2 = {
  key: 3,
  class: "news"
}, I2 = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, B2 = {
  key: 6,
  class: "settled"
}, R2 = {
  key: 1,
  class: "bar"
}, L2 = {
  key: 3,
  class: "detail body"
}, N2 = {
  key: 0,
  class: "body-label"
}, q2 = ["title"], D2 = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ka(), a = ["onClick", "onAct"], s = x(() => Object.fromEntries(Object.entries(n).filter(([ue]) => !a.includes(ue)))), o = _(!1), l = x(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = x(() => t.open !== void 0), u = x(() => i.value || l.value), c = x(() => i.value ? t.open : o.value), f = x(() => i.value ? !t.open : l.value && !o.value), m = x(() => !!(t.mark.action && n.onAct)), p = x(() => u.value || m.value || !!n.onClick), y = _(null), b = _(null), { folded: w, phase: M } = gr(y, () => f.value);
    $2(y, f, M, Me(Re, null));
    function C(ue) {
      var we, Oe;
      if (!(ue.target !== y.value && !b.value.contains(ue.target))) {
        if (i.value) return (we = n.onClick) == null ? void 0 : we.call(n, ue);
        if (l.value) return void (o.value = !o.value);
        (Oe = n.onAct || n.onClick) == null || Oe(ue);
      }
    }
    const T = (ue) => n.onAct(ue), z = ["failed", "unfinished"], W = x(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? z.includes(t.mark.state) ? "danger" : "good" : ""), R = x(() => t.mark.color ? t.mark.color : W.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : W.value ? `var(--tone-${W.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), G = x(() => R.value || "var(--tone-work)"), D = x(() => !t.mark.ending && !t.mark.ended && W.value !== "stopped"), E = vo(), N = x(
      () => t.mark.began_at && D.value && !t.mark.figure && !t.mark.counting ? er(E.value - t.mark.began_at) : ""
    ), j = x(() => {
      const { started: ue, ended: we } = t.mark;
      return ue ? we ? `ran ${ll(we - ue, !0)}` : ll(E.value - ue, !0) : N.value;
    }), $ = ["bad", "danger", "warn"], g = x(() => $.includes(W.value) || t.mark.asks ? "attention" : D.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), S = ["bad", "danger"], O = x(() => S.includes(W.value)), L = x(() => g.value === "process" ? "running" : O.value ? "cross" : W.value === "stopped" ? "stopped" : W.value === "good" ? "tick" : ""), F = x(
      () => !!(t.mark.figure || j.value || t.mark.docked || t.mark.stopping || L.value || t.mark.settled || t.mark.news)
    ), V = x(() => t.mark.markIcon ? { component: Nt, props: { class: "ico", name: t.mark.markIcon } } : { component: ie, props: { name: t.mark.icon || "dot" } }), Z = x(() => [t.mark.title, t.mark.time ? Zi(t.mark.time) : ""].filter(Boolean).join(" · ")), le = x(() => ({
      ...R.value ? { "--mark": R.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ue, we) => (r(), d("div", je(s.value, {
      ref_key: "root",
      ref: y,
      class: [
        "mark",
        `w-${g.value}`,
        I(M),
        {
          open: c.value,
          folding: i.value && f.value,
          live: p.value,
          failed: O.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: R.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: le.value,
      title: Z.value,
      "data-figure-mark": e.mark.key,
      "data-folded": I(w) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: C
    }), [
      (r(), P(Qe(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: b,
        class: "top",
        type: p.value ? "button" : void 0,
        "aria-expanded": u.value ? String(!!c.value) : void 0
      }, {
        default: q(() => [
          e.mark.agentId ? (r(), P(vn, {
            key: 0,
            "agent-id": e.mark.agentId,
            label: e.mark.label,
            class: "agent-icon",
            "data-mark-agent": ""
          }, {
            default: q(() => [
              (r(), P(Qe(V.value.component), ps(Ql(V.value.props)), null, 16))
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : (r(), P(Qe(V.value.component), ps(je({ key: 1 }, V.value.props)), null, 16)),
          e.mark.worker ? (r(), d("span", S2, v(e.mark.worker), 1)) : k("", !0),
          h("span", _2, [
            A(rt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (r(), d("strong", M2, v(e.mark.name), 1)) : k("", !0),
            u.value ? (r(), P(tn, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : k("", !0)
          ]),
          F.value ? (r(), d("span", C2, [
            e.mark.figure ? (r(), d("span", A2, v(e.mark.figure), 1)) : k("", !0),
            j.value ? (r(), d("span", E2, v(j.value), 1)) : k("", !0),
            e.mark.stopping ? (r(), d("span", O2, "Stopping")) : k("", !0),
            e.mark.news ? (r(), d("span", T2, v(e.mark.news), 1)) : k("", !0),
            L.value === "running" ? (r(), d("span", I2)) : L.value ? (r(), P(Nt, {
              key: 5,
              class: Y(["sign", L.value]),
              name: L.value
            }, null, 8, ["class", "name"])) : k("", !0),
            e.mark.settled ? (r(), d("span", B2, v(e.mark.settled), 1)) : k("", !0)
          ])) : k("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      m.value ? (r(), P(hr, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: ke(T, ["stop"])
      }, null, 8, ["label", "open"])) : k("", !0),
      (e.mark.figure || e.mark.counting) && D.value ? (r(), d("span", R2, [
        h("span", {
          class: "progress",
          style: ge({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: G.value })
        }, null, 4)
      ])) : k("", !0),
      e.mark.detail && !I(w) ? (r(), P(rt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      e.mark.body && !I(w) ? (r(), d("div", L2, [
        e.mark.bodyLabel ? (r(), d("p", N2, v(e.mark.bodyLabel), 1)) : k("", !0),
        A(rt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : k("", !0),
      e.mark.command && !I(w) ? (r(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, v(e.mark.command), 9, q2)) : k("", !0),
      e.mark.card ? (r(), P(rt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      ae(ue.$slots, "default", {
        shown: !I(w)
      }, void 0, !0)
    ], 16, x2));
  }
}), Cr = /* @__PURE__ */ H(D2, [["__scopeId", "data-v-6e839007"]]), P2 = 8, j2 = 40, F2 = [];
class go {
  constructor(t, n, { top: a = P2, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && F2.push(this);
  }
  // a feed over a window's rows, as `useRows` and a window's props give them: refs of the rows, whether they loaded and whether more follow
  static ofRows(t, n, a) {
    return new go(t, {
      loaded: () => n.loaded.value,
      count: () => n.rows.value.length,
      pageSize: n.pageSize,
      more: () => n.more.value,
      previous: n.older
    }, a);
  }
  breach(t) {
    const n = `feed ${this.name}: ${t}`;
    if (this.breaches.push(n), this.development) throw new Error(n);
    return !1;
  }
  isLoaded() {
    return this.source.loaded();
  }
  // the first rows of the feed are on screen, and the pane has been taken to its bottom
  drawn(t) {
    if (this.shown || !this.source.loaded() || !this.source.count()) return;
    this.shown = !0;
    const n = t.scrollHeight - t.scrollTop - t.clientHeight;
    n > j2 && this.breach(`opened ${n}px above the bottom`), this.source.count() > this.source.pageSize() && this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
  }
  // the reader scrolled: at the top of the pane the page before the oldest one is read
  async reachTop(t) {
    return t.scrollTop < this.top ? this.scrollUp(t) : !1;
  }
  // one earlier page is read, and a pane stays on the row it showed. Without a pane the reader asked for it by a button.
  async scrollUp(t = null) {
    if (this.loading || !this.source.more()) return !1;
    if (!this.source.loaded()) return this.breach("an earlier page was read before the newest page");
    if (t && t.scrollTop >= this.top) return this.breach(`an earlier page was read ${t.scrollTop}px below the top`);
    this.loading = !0;
    const n = this.source.count(), a = (t == null ? void 0 : t.scrollHeight) ?? 0;
    let s = !1;
    try {
      s = await this.source.previous();
    } finally {
      this.loading = !1;
    }
    const o = this.source.count() - n;
    return o > this.source.pageSize() && this.breach(`one scroll up added ${o} rows, a page is ${this.source.pageSize()}`), s && t && (await Fe(), t.scrollTop += t.scrollHeight - a), s;
  }
  // rows too few to scroll leave no way to reach the top, so earlier pages are read until the pane scrolls or none is left
  async fill(t) {
    for (; t.clientHeight > 0 && t.scrollHeight <= t.clientHeight && this.source.more() && await this.scrollUp(); ) await Fe();
  }
}
const W2 = 60, H2 = 300, Ar = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function Er(e, t) {
  const n = _([]), a = _(0);
  let s = -1, o = 0;
  async function l() {
    const m = await e(["output", "page", String(t())]);
    return m.ok && (n.value = m.value.lines, a.value = m.value.first_byte, s = m.value.last_byte, o = m.value.cut_bytes), m;
  }
  async function i() {
    if (s < 0) return l();
    const m = await e(["output", "page", String(t()), "--after", String(s)]);
    return m.ok ? m.value.cut_bytes !== o || m.value.total < s ? l() : (m.value.lines.length && (n.value = [...n.value, ...m.value.lines]), s = m.value.last_byte, m) : m;
  }
  async function u() {
    const m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    return m.ok ? (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, !0) : !1;
  }
  const c = new go("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => H2, more: () => a.value > 0, previous: u }, { top: W2 });
  return { lines: n, newest: l, follow: i, loadEarlier: (m) => c.reachTop(m), feed: c };
}
const z2 = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function Or(e) {
  var n;
  const t = z2[e] || ((n = en(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open";
}
const U2 = (e) => Or(String(e).split(":")[0]), V2 = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), G2 = "agents", K2 = { passed: "good", failed: "danger", warned: "warn", running: "" }, Y2 = { good: "good", warn: "warn", danger: "danger" }, bl = {
  "open row": (e) => Pe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Im(e.target_model, e.target_id || 0)
}, Q2 = { "open row": (e) => U2(e.target_model), "open page": () => Or("pages") };
function X2(e, t) {
  const n = t || {}, a = bl[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? K2[e.outcome] || "" : Y2[e.variant] || "",
    label: e.text,
    // a mark about an agent shows the agent's tooltip on its icon
    agentId: e.target_model === G2 ? e.target_id : 0,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? Q2[a](e) : "",
    handlers: a ? { onAct: () => bl[a](e) } : {}
  };
}
const J2 = 24, Z2 = 1e3, kl = 2e3, e$ = 0.25, t$ = 5e3;
function n$(e, t = J2, n = () => !0) {
  const a = _(!1), s = _(0), o = _(!1);
  let l = 0, i = 0, u = 0;
  const c = () => e && "value" in e ? e.value : e, f = () => {
    const W = c();
    return W ? W.scrollHeight - W.scrollTop - W.clientHeight : 0;
  }, m = () => !c() || f() <= t;
  function p(W) {
    if (clearTimeout(l), !W) {
      o.value = !1, u = Date.now();
      return;
    }
    const R = Date.now() - u < kl ? kl : Z2;
    l = setTimeout(() => o.value = a.value, R);
  }
  function y() {
    clearTimeout(i), a.value = !1, s.value = 0, p(!1);
  }
  function b(W = !1) {
    const R = c();
    R && W && R.scrollTo ? R.scrollTo({ top: R.scrollHeight, behavior: "smooth" }) : R && (R.scrollTop = R.scrollHeight), y();
  }
  function w() {
    C(), !a.value && (a.value = !0, p(!0));
  }
  const M = () => !!c() && f() <= c().clientHeight * e$;
  function C() {
    clearTimeout(i), M() && (i = setTimeout(() => a.value && M() && n() && b(!0), t$));
  }
  function T() {
    m() ? y() : w();
  }
  function z(W = 1, R = !1) {
    a.value ? s.value += Math.max(0, W) : b(R);
  }
  return Yl() && $a(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: f, atBottom: m, follow: y, toBottom: b, left: w, scrolled: T, arrived: z };
}
const a$ = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, s$ = (e) => String(e ?? "").replace(a$, ""), o$ = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(null), { away: o, scrolled: l, arrived: i, toBottom: u } = n$(s);
    me(
      () => [n.lines, n.lines.length],
      () => Fe(() => {
        var f;
        i(), s.value && ((f = n.feed) == null || f.drawn(s.value));
      }),
      { immediate: !0 }
    );
    function c(f) {
      l(), a("older", f.target);
    }
    return (f, m) => (r(), d("pre", {
      ref_key: "box",
      ref: s,
      class: "output-lines",
      onScroll: c
    }, [
      U(v(I(s$)(e.lines.join(`
`)) || e.empty), 1),
      I(o) ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: m[0] || (m[0] = (p) => I(u)(!0))
      }, "Follow")) : k("", !0)
    ], 544));
  }
}, l$ = /* @__PURE__ */ H(o$, [["__scopeId", "data-v-89621acd"]]), i$ = "*.*", r$ = {
  __name: "ModuleBody",
  props: {
    declaration: { type: Object, required: !0 },
    row: { type: Object, default: null },
    head: { type: Object, default: null },
    foot: { type: Object, default: null },
    actions: { type: Object, default: null },
    time: { type: Object, default: null },
    folded: Boolean,
    collapsed: Boolean,
    environment: { type: String, default: "" }
  },
  setup(e) {
    const t = e, n = Me(Re, null), a = new ii();
    me(
      () => a.patterns,
      (u, c, f) => {
        var p;
        const m = (p = n == null ? void 0 : n.subscriptions) == null ? void 0 : p.follow(`body of ${t.declaration.type}`, u, (y) => a.dispatch(y));
        f(() => m == null ? void 0 : m());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = x(() => !!(t.declaration.shipped || t.declaration.trusted)), i = x(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the user trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [i$] : t.declaration.events ?? [],
      options: []
    }));
    return (u, c) => l.value ? (r(), P(dr, {
      key: 0,
      entry: i.value,
      subscriptions: I(a),
      environment: I(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (r(), P(cr, {
      key: 1,
      entry: i.value,
      subscriptions: I(a),
      environment: I(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, u$ = { class: "mark-more-inner" }, c$ = {
  class: "mark-lines",
  "data-mark-reason": ""
}, d$ = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, f$ = {
  key: 3,
  class: "mark-lines"
}, m$ = "process", wl = "task", h$ = {
  __name: "MarkBody",
  props: {
    declaration: { type: Object, required: !0 },
    mark: { type: Object, required: !0 },
    shown: Boolean,
    head: { type: Object, default: null },
    foot: { type: Object, default: null },
    actions: { type: Object, default: null },
    time: { type: Object, default: null },
    folded: Boolean,
    collapsed: Boolean
  },
  setup(e) {
    const t = e, n = ot(), a = x(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = x(() => V2.has(t.mark.variant) && t.mark.detail || ""), o = x(() => t.mark.target_model === wl ? t.mark.target_id : 0), l = Er(
      Ar(n),
      () => t.mark.target_id
    ), i = l.lines, u = _(!1), c = _(""), f = x(() => !t.declaration.body_url && t.mark.target_model === m$ && !!t.mark.target_id);
    async function m(y = l.follow) {
      const b = await y();
      u.value = !0, c.value = b.ok ? "" : b.error;
    }
    const p = x(() => t.shown && f.value);
    return me(p, (y) => y && m()), Vs(() => p.value && m(), () => p.value && !t.mark.ended_at), me(
      () => t.mark.ended_at,
      (y) => y && p.value && m(l.newest)
    ), (y, b) => (r(), d("div", {
      class: Y(["mark-more", { open: e.shown }]),
      onClick: b[1] || (b[1] = ke(() => {
      }, ["stop"]))
    }, [
      h("div", u$, [
        e.declaration.body_url ? (r(), P(r$, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded,
          collapsed: e.collapsed
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded", "collapsed"])) : (r(), d(B, { key: 1 }, [
          s.value ? (r(), d(B, { key: 0 }, [
            b[2] || (b[2] = h("p", { class: "mark-label" }, "Why it stopped", -1)),
            h("p", c$, v(s.value), 1)
          ], 64)) : k("", !0),
          f.value && c.value ? (r(), d("p", d$, v(c.value), 1)) : f.value && u.value ? (r(), d(B, { key: 2 }, [
            b[3] || (b[3] = h("p", { class: "mark-label" }, "Output", -1)),
            A(l$, {
              class: "mark-terminal",
              lines: I(i),
              feed: I(l).feed,
              onOlder: I(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (r(), d("p", f$, v(a.value.join(`
`)), 1)) : k("", !0),
          o.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: b[0] || (b[0] = ke((w) => I(Pe)(`${wl}:${o.value}`), ["stop"]))
          }, " Open task " + v(o.value) + " and its proofs ", 1)) : k("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Ts = /* @__PURE__ */ H(h$, [["__scopeId", "data-v-df71b15a"]]), p$ = ["title", "aria-label", "onClick"], v$ = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, g$ = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = x(() => sm(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = _(""), s = Me(Re);
    async function o(l) {
      const i = await Cn(l, { id: t.mark.target_id }, s.environment);
      a.value = i.ok ? "" : i.error;
    }
    return (l, i) => (r(), d(B, null, [
      (r(!0), d(B, null, X(n.value, (u) => (r(), d("button", {
        key: u.runs,
        type: "button",
        class: "mark-button",
        title: u.label,
        "aria-label": u.label,
        onClick: ke((c) => o(u), ["stop"])
      }, [
        A(Nt, {
          name: u.icon
        }, null, 8, ["name"])
      ], 8, p$))), 128)),
      a.value ? (r(), d("span", v$, v(a.value), 1)) : k("", !0)
    ], 64));
  }
}, y$ = /* @__PURE__ */ H(g$, [["__scopeId", "data-v-7a62c88e"]]);
function Tr(e, t) {
  const n = at(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Ee.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const Ir = Tr("/api/marks", "marks"), RC = Ir.fetchAll, b$ = Ir.find, k$ = ["data-ref"], w$ = ["data-ref"], $$ = { class: "mark-row" }, x$ = "dock add", S$ = "questions.answer", _$ = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = x(() => b$(a.mark.type)), o = x(() => X2(a.mark, s.value)), l = x(() => {
      var p;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (p = s.value) != null && p.body_url);
    }), i = x(() => l.value || !!o.value.handlers.onAct), u = x(() => a.mark.type === S$), c = _(!1);
    function f() {
      c.value = !c.value;
    }
    const m = x(() => {
      var p;
      return (((p = s.value) == null ? void 0 : p.buttons) || []).filter((y) => {
        var b;
        return !a.docked || !((b = y.runs) != null && b.startsWith(x$));
      }).map((y) => ({ ...y, module: s.value.module }));
    });
    return (p, y) => {
      var b, w;
      return (b = s.value) != null && b.card ? (r(), d("div", {
        key: 0,
        class: Y(["thread-turn", "card", "whole-card", { "user-side": I(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        A(Ts, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, k$)) : (r(), d("div", {
        key: 1,
        class: Y(["thread-turn", "card", { "full-width": (w = s.value) == null ? void 0 : w.full_width, docked: e.docked, "user-side": I(n).has(e.mark.variant), "answer-bubble": u.value }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        h("span", $$, [
          A(Cr, {
            mark: o.value,
            open: i.value ? c.value : void 0,
            onAct: o.value.handlers.onAct,
            onClick: f
          }, wa({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: q(({ shown: M }) => [
                A(Ts, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: M
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["mark", "open", "onAct"]),
          A(y$, {
            buttons: m.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, w$));
    };
  }
}, M$ = /* @__PURE__ */ H(_$, [["__scopeId", "data-v-424ddb61"]]), C$ = ["data-ref"], A$ = ["inert"], E$ = { class: "group-fold" }, O$ = { class: "thread-group" }, T$ = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = _(!1), a = _(!1), s = _(!1), o = _(null);
    me(n, async (i) => {
      var u;
      a.value = !0, await Fe(), (u = o.value) == null || u.offsetHeight, s.value = i;
    });
    const l = x(() => ({
      key: t.group.id,
      icon: t.group.declaration.family_icon || "",
      markIcon: t.group.declaration.mark_icon || "",
      group: t.group.declaration.group || "",
      label: t.group.label,
      time: t.group.time,
      title: n.value ? "Fold them back into one line" : "Show each of them"
    }));
    return (i, u) => (r(), d("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      A(Cr, {
        mark: l.value,
        open: n.value,
        onClick: u[0] || (u[0] = (c) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (r(), d("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: Y(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        h("div", E$, [
          h("div", O$, [
            (r(!0), d(B, null, X(e.group.marks, (c) => (r(), P(M$, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, A$)) : k("", !0)
    ], 8, C$));
  }
}, LC = /* @__PURE__ */ H(T$, [["__scopeId", "data-v-45b58b9b"]]);
function I$(e) {
  const t = _(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Ce(() => n.observe(e.value)), st(() => n.disconnect()), t;
}
const B$ = { class: "chat-dock-fold" }, R$ = ["aria-label"], L$ = { class: "chat-dock-head" }, N$ = { class: "chat-dock-inner" }, q$ = { class: "chat-dock-foot" }, Br = 700, D$ = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = _(null), a = _(null), s = I$(a), o = _(!1);
    let l = 0;
    return Ce(() => l = setTimeout(() => o.value = !0, Br)), st(() => clearTimeout(l)), t({ card: n }), (i, u) => (r(), d("div", {
      class: Y(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      h("div", B$, [
        h("section", {
          ref_key: "card",
          ref: n,
          class: Y(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ae(i.$slots, "edge", {}, void 0, !0),
          h("header", L$, [
            ae(i.$slots, "head", {}, void 0, !0)
          ]),
          h("div", {
            class: Y(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            h("div", N$, [
              h("div", {
                class: Y(["chat-dock-grow", { settled: o.value }]),
                style: ge(I(s) === null ? null : { height: `${I(s)}px` })
              }, [
                h("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  ae(i.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          ae(i.$slots, "still", {}, void 0, !0),
          h("footer", q$, [
            ae(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, R$)
      ])
    ], 2));
  }
}, P$ = /* @__PURE__ */ H(D$, [["__scopeId", "data-v-cc05fdac"]]), j$ = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Qa = 5, F$ = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Qa, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${Qa}s`, animationDelay: `${(n - Qa).toFixed(2)}s` };
    return (s, o) => (r(), d("span", j$, [
      h("i", { style: a })
    ]));
  }
}, W$ = /* @__PURE__ */ H(F$, [["__scopeId", "data-v-2a7bc150"]]), H$ = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), Is = (e) => e.charAt(0).toUpperCase() + e.slice(1), z$ = (e) => Is(e.replace(/_at$/, "").replaceAll("_", " ")), U$ = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, V$ = (e, t, n) => [Is(`${e} ${n}`), (t == null ? void 0 : t.state) && Is(t.state)].filter(Boolean).join(" · "), Rr = (e) => Kt(e).text, G$ = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? Rr(t) : (e == null ? void 0 : e.name) ?? "", K$ = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? Rr(t) : "", Y$ = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !H$.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: z$(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], Q$ = { reviewing: "Under review" }, X$ = (e, t) => e || Q$[t == null ? void 0 : t.state] || "", Lr = Tr("/api/docks", "docks"), NC = Lr.fetchAll, Wt = Lr.find, J$ = 6, Xa = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, yo = (e) => Date.parse(e.leaves_at) / 1e3, on = (e) => !!(e.leaves_at && !e.kept), Z$ = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!on(e) || t < yo(e) || n.has(e.id)), e5 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => Z$(a, t, n)).sort((a, s) => a.id - s.id);
function t5(e, t, n = J$) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(yo(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const n5 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Bs = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), a5 = (e, t) => !(t != null && t.needs_user) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), s5 = (e) => ({ ...e.kept ? Bs("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : Bs("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), o5 = ["keep", "unkeep", "open", "undock"], l5 = (e) => ({ ...e, iconOnly: o5.includes(e.action) });
function i5(e, t) {
  var n;
  return [
    ...a5(e, t) ? [s5(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || en(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    Bs("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(l5);
}
function Nr(e, t) {
  const n = i5(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: n5(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const r5 = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || Nr(e, t).title, u5 = { class: "dock-text" }, c5 = ["title"], d5 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, f5 = {
  class: "dock-facts",
  "data-dock-facts": ""
}, m5 = {
  key: 1,
  "data-dock-row": ""
}, h5 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = x(() => Wt(a.item.type)), o = vo(), l = x(() => En(a.item.created_at, o.value * 1e3)), i = _(null), u = _(null), c = _(null), f = _(null), m = x(() => Nr(a.item, s.value)), p = ot(), y = x(() => `dock.${a.item.id}`), b = x(() => p.props[y.value].data.value), w = x(() => r5(a.item, s.value, b.value)), M = x(() => ua(a.item.target_model ?? "")), C = x(() => {
      var g;
      return ((g = s.value) == null ? void 0 : g.word) ?? "";
    }), T = x(() => ({ ...b.value, id: a.item.target_id, term: M.value })), z = () => {
      var g, S;
      return ((S = (g = s.value) == null ? void 0 : g.reads) == null ? void 0 : S.length) && p.reload(y.value);
    };
    nd(Ws, { data: b, reload: z, readOutput: Ar(p) }), me(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (g, S, O) => {
        var F;
        z();
        const L = (F = p.followUndeclared) == null ? void 0 : F.call(p, [`${M.value.replaceAll("-", "_")}.*`], (V) => {
          (!V.row_id || V.row_id === a.item.target_id) && z();
        });
        O(() => L == null ? void 0 : L());
      },
      { immediate: !0 }
    );
    const W = _(/* @__PURE__ */ new Set()), R = _("");
    async function G(g) {
      if (g.action === "undock") return n("undock", g);
      if (g.action === "open") return Pe(`${a.item.target_model}:${a.item.target_id}`);
      g.action === "declared" && (W.value = /* @__PURE__ */ new Set([...W.value, g.label])), R.value = "";
      const O = await Cn(g, { id: a.item.target_id }, p.environment);
      (O == null ? void 0 : O.ok) === !1 && (W.value = new Set([...W.value].filter((L) => L !== g.label)), R.value = `Could not ${g.label.toLowerCase()}: ${O.error}`);
    }
    const D = x(() => m.value.actions.filter((g) => !W.value.has(g.label))), E = x(() => {
      var g;
      return X$((g = s.value) == null ? void 0 : g.badge, T.value);
    }), N = x(() => m.value.controls), j = x(() => {
      var g;
      return !((g = s.value) != null && g.folds && a.folded);
    }), $ = x(() => {
      var g;
      return !!((g = s.value) != null && g.draws_head) && !a.collapsed;
    });
    return (g, S) => {
      var O, L, F, V;
      return r(), P(P$, {
        label: m.value.title + ((O = s.value) != null && O.needs_user ? ", waiting for you" : ""),
        type: (L = s.value) != null && L.needs_user ? "waiting" : "",
        folded: !!((F = s.value) != null && F.folds) && e.folded,
        body: !!((V = s.value) != null && V.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: S[4] || (S[4] = (Z) => e.collapsed && n("open"))
      }, {
        edge: q(() => [
          e.leaving && !e.item.kept ? (r(), P(W$, {
            key: 0,
            "ends-at": I(yo)(e.item)
          }, null, 8, ["ends-at"])) : k("", !0)
        ]),
        head: q(() => {
          var Z;
          return [
            $.value ? (r(), d("span", {
              key: 0,
              ref_key: "head",
              ref: i,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (r(), d(B, { key: 1 }, [
              A(ie, {
                name: m.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              h("span", u5, [
                h("span", {
                  class: Y(["dock-title", { strip: e.collapsed }]),
                  title: w.value
                }, v(w.value), 11, c5)
              ])
            ], 64)),
            h("span", {
              ref_key: "time",
              ref: f,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (Z = s.value) != null && Z.leaves_after_seconds ? k("", !0) : (r(), d(B, { key: 0 }, [
                U(v(l.value), 1)
              ], 64))
            ], 512),
            N.value.length ? (r(), d("span", {
              key: 2,
              class: "dock-controls",
              onClick: S[0] || (S[0] = ke(() => {
              }, ["stop"]))
            }, [
              (r(!0), d(B, null, X(N.value, (le) => {
                var ue, we;
                return r(), d(B, {
                  key: le.action + le.runs
                }, [
                  !W.value.has(le.label) && (!((ue = le.variants) != null && ue.length) || !((we = T.value) != null && we.state) || le.variants.includes(T.value.state)) ? (r(), P(ve, {
                    key: 0,
                    variant: "icon",
                    class: Y({ kept: le.pressed }),
                    "aria-pressed": le.pressed,
                    "aria-label": le.label,
                    title: le.label,
                    "data-dock-action": le.action,
                    onClick: (Oe) => G(le)
                  }, {
                    default: q(() => [
                      A(ie, {
                        name: le.icon,
                        size: 13
                      }, null, 8, ["name"])
                    ]),
                    _: 2
                  }, 1032, ["class", "aria-pressed", "aria-label", "title", "data-dock-action", "onClick"])) : k("", !0)
                ], 64);
              }), 128))
            ])) : k("", !0)
          ];
        }),
        still: q(() => [
          R.value || e.refusal ? (r(), d("p", d5, v(R.value || e.refusal), 1)) : k("", !0)
        ]),
        foot: q(() => {
          var Z;
          return [
            h("span", f5, [
              E.value ? (r(), d("span", {
                key: 0,
                class: Y(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, v(E.value), 3)) : k("", !0),
              C.value ? (r(), d("span", m5, v(C.value) + " " + v(e.item.target_id), 1)) : k("", !0),
              h("span", {
                ref_key: "foot",
                ref: u,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (Z = s.value) != null && Z.folds ? (r(), P(ve, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: S[1] || (S[1] = (le) => n("fold"))
            }, {
              default: q(() => [
                U(v(s.value.folds) + " ", 1),
                A(tn, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : k("", !0),
            h("span", {
              class: "dock-acts",
              onClick: S[3] || (S[3] = ke(() => {
              }, ["stop"]))
            }, [
              h("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              j.value ? (r(), d(B, { key: 0 }, [
                A(oo, {
                  name: `dock.${e.item.type}`,
                  row: T.value,
                  environment: I(p).environment,
                  "read-only": I(p).readOnly,
                  "object-name": I(ua)(e.item.target_model),
                  "external-failure": "",
                  onFailure: S[2] || (S[2] = (le) => R.value = le),
                  onDone: g.loadRow
                }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
                (r(!0), d(B, null, X(D.value, (le) => (r(), P(ve, {
                  key: le.action + le.runs,
                  small: "",
                  variant: le.primary ? "primary" : "ghost",
                  bordered: !le.primary,
                  "data-dock-action": le.action,
                  onClick: (ue) => G(le)
                }, {
                  default: q(() => [
                    U(v(le.label), 1)
                  ]),
                  _: 2
                }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128))
              ], 64)) : k("", !0)
            ])
          ];
        }),
        default: q(() => {
          var Z;
          return [
            (Z = s.value) != null && Z.body_url ? (r(), P(Ts, {
              key: 0,
              declaration: s.value,
              mark: e.item,
              shown: "",
              head: i.value,
              foot: u.value,
              actions: c.value,
              time: f.value,
              folded: e.folded,
              collapsed: e.collapsed
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded", "collapsed"])) : k("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, $l = /* @__PURE__ */ H(h5, [["__scopeId", "data-v-4d692a2f"]]), p5 = 24, v5 = 8, qC = 420;
function DC({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= p5 ? !0 : e < t && s > v5 ? !1 : null;
}
const g5 = (e, t) => e === void 0 ? t : e, y5 = { me: 1, people: [] }, ma = Qt({
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
  people: y5,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: oa("journal.activity", !0),
  wide: !1,
  sideMini: oa("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Ii("journal.activity", () => ma.activity);
Ii("journal.side.mini", () => ma.sideMini);
const qr = "journal.viewer.";
function b5(e, t, n) {
  try {
    const a = n.getItem(qr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function k5(e, t, n) {
  try {
    n.setItem(qr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function xl(e, t, n = window.localStorage) {
  const a = _(b5(e, t, n));
  return me(a, (s) => k5(e, s, n), { deep: !0 }), a;
}
const w5 = {
  key: "dock-all",
  class: "dock-all"
}, $5 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var $, g;
    const t = e, n = v2(500), a = _(/* @__PURE__ */ new Set()), s = Me(Re), o = _(/* @__PURE__ */ new Set()), l = _({});
    async function i(S, O) {
      l.value = { ...l.value, [S.id]: "" }, o.value = /* @__PURE__ */ new Set([...o.value, S.id]);
      const L = await Cn(O, { id: S.target_id }, s.environment);
      (L == null ? void 0 : L.ok) === !1 && (o.value = new Set([...o.value].filter((F) => F !== S.id)), l.value = { ...l.value, [S.id]: `Could not dismiss this card: ${L.error}` });
    }
    const u = x(
      () => e5(
        t.items.filter((S) => !o.value.has(S.id)),
        n.value,
        a.value
      )
    ), c = x(
      () => t5(
        u.value.filter((S) => Xa(S, Wt)),
        n.value
      )
    ), f = x(() => u.value.filter((S) => !c.value.includes(S) && !Xa(S, Wt))), m = xl(`dock-size:${(($ = ma.identity) == null ? void 0 : $.root) || location.host}`, null), p = (S) => {
      var O;
      return !!((O = Wt(S.type)) != null && O.needs_user);
    }, y = _(/* @__PURE__ */ new Set()), b = _(/* @__PURE__ */ new Set()), w = x(() => u.value.length === 1), M = (S) => p(S) || w.value, C = (S) => M(S) ? y.value.has(S.id) || b.value.has(S.id) : m.value ? m.value.collapsed && !m.value.opened.includes(S.id) : t.collapsed, T = x(() => u.value.some(C));
    me(() => t.collapsed, (S) => {
      b.value = new Set(S ? u.value.filter(p).map((O) => O.id) : []);
    });
    function z() {
      const S = !T.value;
      m.value = { collapsed: S, opened: [] }, y.value = new Set(S ? u.value.filter(p).map((O) => O.id) : []), b.value = /* @__PURE__ */ new Set();
    }
    function W(S) {
      var L;
      if (!C(S)) return;
      if (M(S)) {
        y.value = new Set([...y.value].filter((F) => F !== S.id)), b.value = new Set([...b.value].filter((F) => F !== S.id));
        return;
      }
      const O = (L = m.value) != null && L.collapsed ? m.value.opened : [];
      m.value = { collapsed: !0, opened: [...O, S.id] };
    }
    const R = xl(`dock-folded:${((g = ma.identity) == null ? void 0 : g.root) || location.host}`, {}), G = (S) => {
      var O;
      return !!((O = Wt(S.type)) != null && O.folds) && (t.insidesFolded || g5(R.value[S.id], Xa(S, Wt) || t.folded));
    };
    function D(S) {
      G(S) && E(S), R.value = { ...R.value, [S.id]: !G(S) };
    }
    function E(S) {
      var O;
      !((O = m.value) != null && O.collapsed) || m.value.opened.includes(S.id) || (m.value = { collapsed: !0, opened: [...m.value.opened, S.id] });
    }
    function N(S) {
      a.value = /* @__PURE__ */ new Set([...a.value, S.id]);
    }
    function j(S) {
      a.value = new Set([...a.value].filter((O) => O !== S.id));
    }
    return (S, O) => (r(), P(Hs, {
      tag: "div",
      name: "dock",
      duration: I(Br),
      class: "dock-stack"
    }, {
      default: q(() => [
        u.value.length > 1 ? (r(), d("div", w5, [
          A(ve, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": T.value ? "Open all" : "Collapse all",
            onClick: z
          }, {
            default: q(() => [
              A(tn, {
                open: !T.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : k("", !0),
        (r(!0), d(B, null, X(f.value, (L) => (r(), P($l, {
          key: L.id,
          item: L,
          class: Y({ timed: I(on)(L) }),
          leaving: I(on)(L) && !a.value.has(L.id),
          folded: G(L),
          collapsed: C(L),
          refusal: l.value[L.id],
          onOpen: (F) => W(L),
          onFold: (F) => D(L),
          onUndock: (F) => i(L, F),
          onMouseenter: (F) => N(L),
          onMouseleave: (F) => j(L)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        (r(!0), d(B, null, X(c.value, (L) => (r(), P($l, {
          key: L.id,
          item: L,
          class: Y({ timed: I(on)(L) }),
          leaving: I(on)(L) && !a.value.has(L.id),
          folded: G(L),
          collapsed: C(L),
          refusal: l.value[L.id],
          onOpen: (F) => W(L),
          onFold: (F) => D(L),
          onUndock: (F) => i(L, F),
          onMouseenter: (F) => N(L),
          onMouseleave: (F) => j(L)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128))
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, PC = /* @__PURE__ */ H($5, [["__scopeId", "data-v-ab76ae18"]]), Et = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, ea = (e) => Math.min(Math.max(e, 0), 1), x5 = (e) => {
  const t = ea(e);
  return t * t * (3 - 2 * t);
}, St = (e, t, n) => x5((e - t) / (n - t));
function jC(e) {
  const t = ea(e), n = ea((t - 0.12) / 0.76) * Et.shuffles, a = Math.min(Math.floor(n), Et.shuffles - 1), s = n - a, o = St(s, 0.26, 0.38) * (1 - St(s, 0.76, 0.96)), l = St(s, 0.38, 0.76), i = St(t, 0, 0.12) * (1 - St(t, 0.88, 1)), u = St(s, 0.2, 0.34) * (1 - St(s, 0.84, 1)), c = Math.sin(Math.PI * ea((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / Et.shuffles, lift: Et.lift * o, ready: i, weight: u, follow: c, shuffle: a, phase: s };
}
function FC(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const Sl = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, WC = (e) => Sl[e] ?? Sl.butler, bo = 2400, S5 = 0.05;
function _5({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, S5), l = Math.min(t + bo * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function HC(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function M5(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function zC(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const UC = (e, t) => ({ ...e, stretch: t.stretch }), VC = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, Dr = (e, t) => t >= (e.least ?? 0);
function GC(e, t, n) {
  if (!Dr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const KC = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), C5 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", _l = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), A5 = (e) => e.right > e.left && e.bottom > e.top;
function YC(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(C5)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = _l(l, n);
    const u = o.closest("[data-figure-scroll]");
    return u && !o.closest("[data-figure-chat-foot]") && (i = _l(i, u.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), A5(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
  });
}
function Pr(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, i = 1;
    for (const [f, m, p] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[f] - e[f];
      if (Math.abs(y) < 1e-9)
        (e[f] < o[m] || e[f] > o[p]) && (i = -1);
      else {
        const b = (o[m] - e[f]) / y, w = (o[p] - e[f]) / y;
        l = Math.max(l, Math.min(b, w)), i = Math.min(i, Math.max(b, w));
      }
    }
    if (l > i || a && l >= a.share) continue;
    const u = e.x + (t.x - e.x) * l, c = e.y + (t.y - e.y) * l;
    a = { share: l, x: u, y: c, on: "surface", surface: s.id, dx: u - s.left, dy: c - s.top };
  }
  return a;
}
const Ie = {
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
}, yn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), E5 = (e) => e * e * (3 - 2 * e), Be = (e, [t, n]) => E5(yn(e, t, n)), O5 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], gt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Gn = ([e, t], n) => e + n() * (t - e);
function T5(e) {
  return O5.map(() => {
    const t = Gn(gt.speed, e), n = Gn(gt.angle, e) * Math.PI / 180, a = Gn(gt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Gn(gt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const I5 = T5(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function B5(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * gt.gravity * (t[2] - gt.floor))) / gt.gravity;
}
function QC(e, t, n = I5) {
  const a = Ie.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = B5(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const u = Math.min(s, l), c = a.from.map((f, m) => f + o.velocity[m] * u);
  return c[2] -= gt.gravity * u * u / 2, { at: c, turn: o.spin * u, landed: Math.max(0, s - l) / i };
}
const XC = (e, t) => e && Ie[e.name] ? { name: e.name, u: t / e.frames } : null;
function JC(e, t) {
  const n = e.map((o) => Math.sqrt(o)), a = n.reduce((o, l) => o + l, 0);
  let s = Math.min(Math.max(t, 0), 1) * a;
  for (const [o, l] of n.entries()) {
    if (s <= l || o === n.length - 1) {
      const i = l > 0 ? Math.min(s / l, 1) : 1;
      return { index: o, s: i, height: e[o] * 4 * i * (1 - i) };
    }
    s -= l;
  }
  return { index: 0, s: 1, height: 0 };
}
const ZC = () => Array.from({ length: Ie.pogo.count }, (e, t) => Ie.pogo.bounce * (t + 1) / Ie.pogo.count), Vt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function eA(e, t, n) {
  const { away: a, side: s } = Ie.bug_smash, o = s * a * n, [l, i] = [t.left + Vt.margin * n, t.right - Vt.margin * n], u = Math.min(Math.max(e + o + s * Vt.reach * n, l), i), c = u - o - e, f = u - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, f - o - t.left], bug: [u - t.left, f - t.left] };
}
function tA(e, t, n) {
  const a = Ie.bug_smash, s = Be(t, a.walk), o = ([l, i]) => l + (i - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Vt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Vt.tall * n * (1 - Be(t, a.emerge)),
      turn: 90 * (1 - Be(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Be(t, a.gone)
    }
  };
}
function nA(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Vt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = _5({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const We = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function aA(e) {
  const t = We.least + Math.floor(e() * (We.most - We.least + 1));
  return Array.from({ length: t }, () => ({
    wall: We.walls[Math.floor(e() * We.walls.length)],
    along: We.margin + e() * (1 - 2 * We.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function Rs(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * We.margin, l = ((e.along - We.margin + e.way * We.speed * n / a) / s % 2 + 2) % 2, i = We.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + i * a, y: t.top + We.inset, turn: 180 } : { x: e.wall === "left" ? t.left + We.inset : t.right - We.inset, y: t.top + i * a, turn: e.wall === "left" ? 90 : -90 };
}
function R5(e, t) {
  const n = Ie.bug_shot, [a, s] = n.turn.map((f) => f * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = M5(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function sA(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Ie.bug_shot, { frame: l, bug: i, shot: u } = R5(n, e.length), c = e.map((C, T) => ({ ...Rs(C, t, Math.min(n / o.fps, ta(T).shot)), shot: T < u })), f = Be(l / o.frames, o.aim), [m, p] = [c[Math.max(i - 1, 0)], c[i]], y = e.map((C, T) => ({ bug: C, index: T, seconds: n / o.fps - ta(T).shot, spot: Rs(C, t, ta(T).shot) })).filter((C) => C.seconds >= 0), b = y.flatMap((C) => {
    const T = (s == null ? void 0 : s.get(C.index)) ?? P5(C.bug, t, C.spot, s ? [] : a);
    return s == null || s.set(C.index, T), s && j5(T, C.seconds, a), F5(T, C.seconds, a);
  }), w = y.filter((C) => q5(C.bug)).map((C) => ({ seconds: C.seconds, from: C.spot })), M = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - f) + +(e[i].wall === "top") * f;
  return { bugs: c, frame: l, target: { x: m.x + (p.x - m.x) * f, y: m.y + (p.y - m.y) * f, back: M }, slush: b, camera: w };
}
function ta(e) {
  const t = Ie.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function oA(e, t, n, a) {
  const { limit: s, margin: o } = Ie.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let u = n.x;
  return e.map((c, f) => {
    const m = ta(f), p = Rs(c, t, m.shot), y = Math.abs(p.y - n.y) / Math.tan(s * Math.PI / 180), b = p.x === u ? u - l >= i - u ? -1 : 1 : Math.sign(u - p.x), w = Math.abs(p.x - u) >= y ? u : p.x + b * y, M = b > 0 ? Math.max(u, Math.min(w, i)) : Math.min(u, Math.max(w, l)), C = { from: u, to: M, begin: m.walk, end: m.aim };
    return u = M, C;
  });
}
function lA(e, t, n) {
  var o;
  const a = Ie.bug_shot.back.stride * n;
  let s = 0;
  for (const l of e) {
    if (t <= l.begin) return { x: l.from, steps: s / a, way: 0 };
    if (t < l.end) {
      const i = l.from + (l.to - l.from) * Be(t, [l.begin, l.end]);
      return { x: i, steps: (s + Math.abs(i - l.from)) / a, way: Math.sign(l.to - l.from) };
    }
    s += Math.abs(l.to - l.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: s / a, way: 0 };
}
const Ae = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, L5 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function N5(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const q5 = (e) => e.along * 97 % 1 < Ae.camera, bn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * Ae.gravity * t * t });
function D5(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * Ae.gravity * (t.bottom - e.from.y))) / Ae.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * Ae.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / Ae.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, f) => c.t - f.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += Ae.step) {
    const f = Math.min(c + Ae.step, l.t), m = bn(e, f), p = Pr(i, m, n);
    if (p) return { ...p, t: c + (f - c) * p.share };
    i = m;
  }
  const u = bn(e, l.t);
  return { ...l, x: Math.min(Math.max(u.x, t.left), t.right), y: Math.min(Math.max(u.y, t.top), t.bottom) };
}
function P5(e, t, n, a = []) {
  const s = N5(e.along + 1), [o, l] = L5[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: Ae.count }, () => {
    const u = i + (s() - 0.5) * 2 * (Ae.spread * Math.PI / 180), c = Ae.speed[0] + s() * (Ae.speed[1] - Ae.speed[0]), f = { from: { x: n.x, y: n.y }, vx: Math.cos(u) * c, vy: Math.sin(u) * c, r: Ae.radius[0] + s() * (Ae.radius[1] - Ae.radius[0]) };
    return { ...f, ...D5(f, t, a) };
  });
}
function j5(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += Ae.step) {
      const l = Math.min(o + Ae.step, s), i = Pr(bn(a, o), bn(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function F5(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...bn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - Ae.hold) / Ae.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((f) => f.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const i = l ? l.left + a.dx : a.x, u = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - u)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: i, y: u, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function iA(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: i, fps: u } = Ie.bug_shot;
  if (e < 0) return [];
  const c = (s[1] - s[0]) * i / u, f = (o[1] - o[0]) * i / u, m = Be(e, [0, c]), p = Be(e, [c, c + f]);
  return l.map((y) => {
    const b = { x: a.x + y.at[0] * t, y: a.y + y.at[1] * t };
    return {
      x: n.x + (b.x - n.x) * m,
      y: n.y + (b.y - n.y) * m,
      r: y.size * t * (0.15 + 0.85 * m * m),
      run: p * p * t * 1.2,
      fade: 1 - p,
      landed: m >= 1
    };
  });
}
function rA(e, t, n, a, s) {
  const { sway: o, above: l } = Ie.chute, i = { x: t.x, y: t.y - l * a }, u = o / 2 * Math.sin(2 * Math.PI * s), [c, f] = [Math.cos(u * Math.PI / 180), Math.sin(u * Math.PI / 180)], m = (w) => {
    const [M, C] = [w.x - e.at.x, w.y - e.at.y];
    return { x: i.x + M * c - C * f, y: i.y + M * f + C * c };
  }, [p, y] = [...n].sort((w, M) => w.x - M.x), b = e.ends.map(m);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: u, lines: b.map((w, M) => ({ from: w, to: M < b.length / 2 ? p : y })) };
}
const uA = (e, t) => Be(t, e.grows) * (1 - Be(t, e.sinks));
function ha(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: yn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: yn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function cA(e, t) {
  const n = Ie[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = ha(n, t), l = 1 - (1 - n.small) * Be(a, n.shrinks) * (1 - Be(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = ha(n, t), o = n.flat * Be(a, n.squashes) * (1 - Be(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * yn(s, ...n.springs)) * (1 - yn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const dA = (e) => e === "pack_box";
function fA(e) {
  const { into: t, out: n } = ha(Ie.rope_swing, e);
  return 1 - Be(t, [0, 1]) * (1 - Be(n, [0, 1]));
}
function mA(e) {
  const t = Ie.rope_swing, { into: n, out: a } = ha(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Be(n, [0, 1]) * (1 - Be(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const W5 = { after: 3 }, ko = 10, H5 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, z5 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, U5 = { weight: 19 }, jr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, V5 = { every: 120 }, Fr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Wr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, G5 = {
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
}, Tn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: ko }), re = (e, t, n = {}) => Tn(e, "clip", t, n), Ja = (e, t, n = {}) => Tn(e, "look", t, n), Ml = (e, t, n = {}) => Tn(e, "gaze", t, n), ye = (e, t, n = {}, a = {}) => ({ ...Tn(e, "pick", t, n), ...a }), xe = (e) => Tn("nothing", "nothing", e, {}), K5 = 120, Y5 = 300, Za = (e, t) => ({ ...re(e, t), cooldown: Y5 }), fe = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), Q5 = () => [re("joy", 2)], _t = (e, t, n, a, s = {}) => ({ ...re(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), Mt = (e) => ({ ...e, cooldown: H5[e.name] }), sn = (e) => ({ ...e, shenanigan: !0, lasts: z5[e.name] }), Ma = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...fe("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [re("nod", 2), xe(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...fe("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...Mt(re("bug_shot", 3)), toward: "", onto: !1 },
    { ...Mt(re("bug_smash", 2)), toward: "", onto: !1 },
    re("nod", 2)
  ]),
  ...fe("tests_failed", { cooldown: 20, toward: "card" }, [re("startled", 2), re("dismay", 1), re("tantrum", 3), xe(1)]),
  ...fe("committed", { cooldown: 30, toward: "card", onto: !0 }, [re("nod", 2), xe(2)]),
  // a finding a plugin found fixed: now and then a halo over the head and a serene, holy look
  ...fe("sin_fixed", { cooldown: 300 }, [re("halo", 1), xe(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...fe("sin_committed", { cooldown: 300 }, [re("repent", 1), xe(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...fe("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [re("nod", 4), re("hand_rub", 4), xe(7)]),
  ...fe("question_asked", { cooldown: 60 }, [re("ask_sign", 9), re("look_up", 3), xe(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...fe("reported", { cooldown: 90 }, [Ml("read", 3), re("nod", 1), xe(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...fe("read_message", { cooldown: 30 }, [Ml("read", 3), xe(1)]),
  ...fe("fact_filed", { cooldown: 120 }, [re("file_card", 3), re("nod", 1), xe(6)]),
  ...fe("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [re("nod", 2), xe(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...fe("bar_done", { holds: !0 }, Q5()),
  ...fe("bar_failed", { holds: !0 }, [re("fume", 1), re("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...fe("standing", { cooldown: 12 }, [re("look_left", 2), re("look_right", 2), re("look_up", 1), xe(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...fe("launched", { cooldown: 300 }, [re("tumble", 3), xe(47)]),
  // a break from the hammering now and then
  ...fe("building", { cooldown: 30 }, [re("wipe_brow", 4), re("look_left", 1), re("look_right", 1), xe(69)]),
  ...fe("failed", { cooldown: 20, toward: "card" }, [re("shake", 3), re("tantrum", 2), xe(2)]),
  ...fe("refused", { cooldown: 20 }, [re("shake", 1), xe(1)]),
  ...fe("work_done", { cooldown: 120 }, [re("stretch", 2), xe(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...fe("pondering", { cooldown: [30, 60] }, [ye("ponder", 1)]),
  ...fe("thought_cloud", { cooldown: 90 }, [ye("cloud", 1)]),
  ...fe("light_bulb", { cooldown: 150 }, [ye("bulb", 1)]),
  ...fe("answered", { cooldown: 15 }, [Ja("amused", 3), xe(2)]),
  ...fe("heard", { cooldown: 30 }, [
    re("bow", 1, { voices: ["butler"] }),
    re("salute", 1, { voices: ["squire"] }),
    re("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    xe(1)
  ]),
  ...fe("long_walk", { cooldown: 90 }, [re("stumble", 3), xe(22)]),
  ...fe("card_arrived", { cooldown: 20, toward: "card" }, [re("glance", 7), xe(13)]),
  ...fe("typing", { cooldown: 60 }, [Ja("reading", 1), xe(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(G5).flatMap(([e, t]) => fe(`reacted:${e}`, {}, [Ja(t, 1)])),
  ...Object.entries(Fr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => fe(`agent_reacted:${n}`, {}, [re(a, 1, { voices: [e] })])[0])),
  ...Object.entries(Wr).flatMap(([e, t]) => fe(`agent_reacted:${e}`, {}, [re(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...fe("pastime", {}, [
    _t("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    _t("rest", 3, 180, 120),
    _t("yawn", 2, 60, 60),
    _t("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    _t("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    _t("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    _t("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...sn(Mt(re("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    sn(Mt(re("disco", 2, { ball: "bubble" }))),
    xe(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...fe("held:search", { cooldown: K5 }, [Za("search", 3), { ...Za("binoculars", 2), when: { home: !0 } }, { ...Za("glass_bubble", 2), when: { bubble: !0 } }]),
  ...fe("held:type", {}, [re("type", 3), re("type_ponder", 1)]),
  ...fe("held:compacting", {}, [re("pack_box", 3), re("vacuum", 2), re("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...fe("spell", {}, [ye("writing", 12, { state: "writing" }), ye("reading", 12, { state: "reading" }), ye("searching", 12, { state: "searching" }), xe(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...fe("tickled", {}, [{ ...Mt(re("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...fe("eager", {}, [re("eager", 2, { slow: !0 }), xe(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...fe("jump", {}, [sn(Mt(re("backflip", 7, { high: !0 }))), re("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...fe("climb", {}, [ye("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...fe("unit", { cooldown: jr.build.cooldown }, [ye("unit", U5.weight), xe(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...fe("progress_jump", { cooldown: 6 }, [re("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...fe("perch", {}, [{ ...ye("hang", 1, { hands: !0, free: !0 }), cooldown: V5.every }, ye("stand", 5)]),
  // a digit a blow's dust lets out
  ...fe("digit", {}, [ye("0", 1), ye("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...fe("roam", {}, [
    ye("rest", 35, {}, { stay: [25, 60] }),
    ye("seat", 15, {}, { stay: [15, 40] }),
    ye("edge", 25, {}, { stay: [8, 20] }),
    sn(ye("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    ye("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    ye("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    ye("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    ye("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    ye("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    sn(Mt(ye("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...fe("laptop", {}, [ye("seat", 6, {}, { stay: [60, 150] }), ye("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...fe("ledge_at", {}, [ye("middle", 2, {}, { along: 1 / 2 }), ye("third", 1, {}, { along: 1 / 3 }), ye("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...fe("composed_as", {}, [
    ye("facing", 4, {}, { turn: 0, leans: 0 }),
    ye("turned_left", 1, {}, { turn: 335, leans: 0 }),
    ye("turned_right", 1, {}, { turn: 25, leans: 0 }),
    ye("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    ye("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], Hr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), zr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), X5 = (e) => Array.isArray(e) ? e[0] : e, J5 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, Z5 = (e) => Ma.some((t) => t.when.moment === e);
function e4(e) {
  var c;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), a = (f) => !e.memory || zr(f).every(([m, p]) => n(m) >= X5(p)), s = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = Ma.filter((f) => Hr(f.when, e) && (f.type !== "clip" || t(f.name)) && a(f) && s(f)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= W5.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, u = i.filter((f) => {
    var m;
    return f.type === "nothing" || f.name !== ((m = e.tally) == null ? void 0 : m.last);
  });
  return u.some((f) => f.type !== "nothing") ? u : i;
}
function Xe(e, t) {
  const n = e4(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (Ur(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Ur(e, t, n) {
  var a;
  for (const [s, o] of zr(t)) (a = e.memory) == null || a.set(s, e.now + J5(o, n));
}
function hA(e, t, n) {
  Ur(e, Ma.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const pA = (e) => Object.values(jr).find((t) => Hr(t.when, e)) ?? null, t4 = (e, t, n) => n - t <= (e.lifetime ?? ko), vA = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || Dr(e.clip, t));
class Vr {
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
const Ls = {
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
}, gA = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Gr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), yA = {
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
}, bA = 120, n4 = 20, kA = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < n4), a4 = (e) => Ls[e] || Ls.idle, wA = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Kr = "airborne", s4 = "landing", o4 = "travelling", Yr = "grounded", $A = ({ airborne: e, landing: t, trip: n }) => e ? Kr : t ? s4 : n != null && n.started ? o4 : Yr;
function xA(e, t) {
  var s;
  const n = l4(e, t);
  return e.mode === Yr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function l4(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: u, state: c, doing: f, doingFacing: m = 0, readingFacing: p = null } = e;
  if (n === Kr && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (u == null ? void 0 : u.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...i4(o, f, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (u && !(u.onto && o)) return { clip: u.clip, facing: u.facing, once: !0, ...u.holds && { holds: !0 }, ...u.stretch && { stretch: u.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const y = p !== null && i.posture === "stand" && f !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(f) ? { clip: "waiting", facing: y ? p : e.composeFacing ?? 0 } : { clip: t(f, i.posture) ? f : a4(c), facing: y ? p : i.posture === "sit" ? i.face : m };
}
function i4(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Ns = (e) => e.outcome, r4 = /^plugin:[^:]+:sins:/, Cl = (e) => e.type === "plugins.card" && r4.test(e.markKey), u4 = [
  // a finding a plugin made in the agent's change, and one it found fixed, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => Cl(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => Cl(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], SA = (e, t) => e.filter((n) => n.author === "user" && ca(n.read_at) > t).map((n) => ({ beat: "read_message", time: ca(n.read_at), card: zi(n) })).sort((n, a) => n.time - a.time), Al = { user: "reacted", agent: "agent_reacted" };
function _A(e, t) {
  return e.filter((n) => Al[n.author] && Rt(n) > t).map((n) => ({ beat: `${Al[n.author]}:${n.emoji}`, time: Rt(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const c4 = [.../* @__PURE__ */ new Set([...Object.values(Fr).flatMap((e) => Object.keys(e)), ...Object.keys(Wr)])];
function MA(e, t) {
  return e.filter((n) => n.author === "agent" && Rt(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = c4.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: Rt(n), card: zi(n) })).sort((n, a) => n.time - a.time);
}
const d4 = (e) => new Vr(e).isTest(), pa = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Ns(e)] || "";
}, f4 = 1800, m4 = (e, t) => {
  if (pa(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && pa(n) !== "finished" && Number(e.time) - Number(n.time) <= f4 ? "tests_fixed" : "tests_passed";
};
function CA(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(d4), s = a.filter((i) => pa(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, pa(i))), o.map((i) => ({ beat: m4(i, s), time: Number(i.time), card: i.key }));
}
function AA(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Ns(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Ns(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const EA = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: Rt(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function OA(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function TA(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function IA(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var u;
    return { beat: (u = u4.find((c) => c.matches(i))) == null ? void 0 : u.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, u) => i.time - u.time);
}
function wo(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const El = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function h4(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    wo(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function BA(e, t, n, a = {}) {
  const s = Xe({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : Z5(`held:${e}`) ? "idle" : e;
}
const De = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function RA(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < De.ahead * n ? 180 : Math.sign(a) * De.turn;
}
const Ol = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function LA(e, t) {
  const n = Math.min(De.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(De.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(De.lines, Math.floor((e.bottom - e.top - 2 * a) / De.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / De.sweep) % s, i = o % De.sweep, u = De.sweep - De.returnSeconds, c = Ol((i - u) / De.returnSeconds), f = i <= u ? Ol(i / u) : 1 - c, m = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + a + m * De.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Tl = 3, Qr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, Il = 12, NA = (e, t) => ({ mood: e, began: t, seen: 0 });
function qA(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!Qr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= Tl ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * Il) / Il, lasts: Tl } };
}
const DA = (e) => e.posture === "hang" && !Qr(e.face), p4 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), v4 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function PA(e, t, n) {
  return p4.has(e) ? 1 / 0 : !v4.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Xr(n - t.began, t.share) - ut.lead, 0);
}
const g4 = 5;
function jA(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= g4 ? { beat: "long_walk", time: n } : null };
}
const y4 = 30, Kn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function FA(e, t, n, a, s = null) {
  if (t && n < t.until || !Kn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Xe({ moment: "spell", state: e, tally: s }, a), [l, i] = Kn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + Kn.every } : { state: e, began: 0, until: 0, next: n + Kn.every };
}
const WA = (e, t, n) => t && n < t.until && Gr.has(e.state) ? { state: t.state, since: t.began } : e, ut = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Xr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function HA(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const u = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: u ? { beat: u } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = Xr(o, e.share);
  return s ? { eager: b4(t, l), moment: null } : l > ut.lead ? { eager: t, moment: null } : l < ut.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > ut.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < ut.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = Xe({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function b4(e, t) {
  return e.on && t > ut.lead + ut.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= ut.lead && t >= ut.least ? { ...e, on: !0, calm: !1 } : e;
}
const k4 = 1, w4 = { look: "look", gaze: "gaze" };
function $4(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = Xe({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [w4[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const x4 = (e, t, n, a, s, o = "", l = () => !0, i = null, u = "") => Xe({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: u }, s), S4 = (e, t, n, a, s, o = 0) => Xe({ moment: "jump", high: e > k4 * t, memory: a, now: s, room: o }, n).name === "backflip", _4 = { work: ["building"], idle: ["standing"] };
function zA(e, t, n, a) {
  const s = Ls[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(_4[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), Gr.has(e) ? { moments: o, began: n || a } : (n && a - n >= y4 && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function M4(e, t, n) {
  return !Xe({ moment: "pondering", memory: e, now: t }, n) || !Xe({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Xe({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Bl = { pondering: M4 };
function UA(e, t, n, a, s, o) {
  if (Bl[e.beat]) {
    const i = Bl[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = $4(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== ko && { lifetime: l.lifetime } } } : null;
}
function VA(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const u = x4(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return u && { clip: u.name, card: "", flies: !!u.flies };
}
const GA = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function KA(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function YA(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const QA = (e, t) => !!(e != null && e.watches) && !t.once, XA = 10, JA = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || t4(a, a.queuedAt, n)), ZA = (e, t) => t ? null : e[0] ?? null;
function eE(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const tE = (e, t) => !t.during || !e.some((n) => n.during === t.during), C4 = 2 * Math.PI, A4 = 500;
function nE(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / A4, u = t && e.point && !!t.behind != !!e.point.behind, c = u && e.amount > 0, f = t && !c ? o : 0, m = e.amount < f ? Math.min(e.amount + i, f) : Math.max(e.amount - i, f), p = C4 * l / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, w = (c ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !u ? s && !t.behind && !y.behind ? O4(y, t, n, p, s) : I4(y, t, n, p) : t) ?? y, M = w != null && w.behind && w.mood === "reading" ? E4(e.point, w, n, l, s) : w;
  return { point: M ?? null, toward: M ? { x: M.x - n.x, y: M.y - n.y } : null, amount: m, at: a };
}
function E4(e, t, n, a, s) {
  const o = (N) => N * 180 / Math.PI, l = (N) => o(Math.atan2(Math.sin(N * Math.PI / 180), Math.cos(N * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, u = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -u)) - i), f = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -u)) - i), m = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = m ? l(e.readingFacing - i) : 0, y = m ? e.readingYaw + p : f, b = y + l(c - y), w = Math.min(Math.max(a / 1e3, 0), 0.1), M = De.turnSpeed * w, C = m ? y + Math.min(Math.max(b - y, -M), M) : b, T = m ? e.readingFollow + p : C, z = T + (C - T) * (1 - Math.exp(-w / De.followSeconds)), W = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, R = o(wo(t.x - n.x, -u, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), G = Math.min(Math.max(R, -W.up), W.down), D = De.tipSpeed * w, E = m ? e.readingPitch + Math.min(Math.max(G - e.readingPitch, -D), D) : G;
  return { ...t, readingYaw: C, readingFollow: z, readingPitch: E, readingFacing: i };
}
function O4(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (T) => {
    const { yaw: z, pitch: W } = wo(T.x - n.x, s, n.y - T.y, o);
    return { yaw: z, pitch: Math.min(Math.max(W, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [u, c] = [El(i(e)), El(i(t))], f = Math.acos(Math.min(Math.max(u[0] * c[0] + u[1] * c[1] + u[2] * c[2], -1), 1));
  if (f <= a) return { ...t };
  const m = a / f, [p, y] = [Math.sin((1 - m) * f) / Math.sin(f), Math.sin(m * f) / Math.sin(f)], [b, w, M] = u.map((T, z) => p * T + y * c[z]), C = s * b / w;
  return { ...t, x: n.x + C, y: n.y - h4(C, s, -Math.asin(Math.min(Math.max(M, -1), 1)), o) };
}
const T4 = 0.15;
function aE(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= T4;
}
function I4(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), u = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + u * Math.cos(i), y: n.y + u * Math.sin(i) };
}
const B4 = (e) => !(e != null && e.on);
function sE(e, t, n) {
  if (B4(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const kn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, lt = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, es = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Rl = (e) => e * e * (3 - 2 * e);
function R4(e) {
  if (e < 0 || e >= lt.seconds) return null;
  const t = es(e, ...lt.flicker), n = Math.floor(t * lt.flickers * 2) % 2 === 0, a = e < lt.flicker[1] ? n ? 0.35 + 0.5 * t : lt.dim : 1;
  return { strength: 1 - Rl(es(e, ...lt.fade)), lit: a, white: e < lt.flash[0] ? 0 : 1 - Rl(es(e, ...lt.flash)) };
}
const oE = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function lE(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = R4(t - e.at);
  return a && { colour: kn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: lt.signs[e.tone], ...a } };
}
function iE(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function rE(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= kn.looks || a === null && n - e.since >= kn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function uE(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const vt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, cE = { behind: 39, figure: 40, ahead: 41 }, L4 = "[data-figure-pile]", N4 = { amber: [1, 0.69, 0.125], good: kn.colours.good, bad: kn.colours.bad }, na = { phases: 4, ms: 230, dim: 0.25 }, dE = (e, t, n) => e !== "amber" || (t + n) % na.phases < na.phases / 2 ? 1 : na.dim, fE = (e) => e === "amber" ? na.phases : 1;
function mE(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const hE = Object.keys(N4), tt = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, ln = ([e, t], n) => e + n() * (t - e);
function pE(e) {
  const t = tt.least + Math.floor(e() * (tt.most - tt.least + 1));
  return Array.from({ length: Math.min(t, tt.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * tt.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = ln(tt.start, e), l = ln(tt.reach, e);
    return {
      text: Xe({ moment: "digit" }, e).name,
      x: a * o,
      y: tt.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(ln(tt.moveMs, e)),
      fadeMs: Math.round(ln(tt.fadeMs, e))
    };
  });
}
const ts = { high: 3, gap: 1 };
function vE(e) {
  const t = Math.floor(e / ts.high);
  return { left: -(vt.inside + vt.width / 2 + t * (vt.width + ts.gap)), up: e % ts.high * (vt.height - vt.top) };
}
const q4 = (e, t, n) => Xe({ moment: "unit", memory: e, now: t }, n) !== null, D4 = { after: 5 }, P4 = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Vr(t).isBuild());
function gE(e, t, n) {
  const a = P4(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= D4.after ? s : null;
}
function yE(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: q4(n, a, s) } : null;
}
const Ll = { ahead: 140, up: 70 };
function bE(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Ll.ahead, y: a - Ll.up } } : o ? { at: { x: n(o), y: a - o.up - vt.height } } : t ? { at: null } : null;
}
const ns = { least: 4e3, most: 1e4 }, j4 = (e) => ns.least + e() * (ns.most - ns.least), Ct = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function kE(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = j4(t);
    if (n.length >= Ct.most || t() >= Ct.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (Ct.at[0] + t() * (Ct.at[1] - Ct.at[0]));
    n.push({ from: o, to: o + Ct.ms }), a = o + Ct.ms;
  }
}
const wE = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), $E = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Jr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), xE = new Set(Ma.filter((e) => Jr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), F4 = (e) => e.some((t) => t.state === "built"), SE = (e, t) => F4(t) ? e.filter((n) => !Jr.has(n.beat)) : e, kt = { reach: 40, room: 6 }, W4 = (e, t) => t <= e - kt.reach + 2, _E = (e, t, n) => W4(e, n) ? t - kt.reach : e - kt.reach - kt.room, ME = (e, t, n, a) => a > 0 && t < e && t + kt.reach >= e - 2 ? Math.min(n, Math.max(e, t + kt.reach)) : e, as = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, CE = (e) => ln(e() < as.longShare ? as.long : as.short, e), H4 = 2 * vt.width;
function AE(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= H4 ? o : e + (o - e + s / 2) % s;
}
const z4 = 60, EE = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= z4, Nl = "[data-figure-home]", In = () => {
  var t;
  const e = document.querySelector(Nl);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Nl)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, U4 = "[data-figure-docked-bars]", V4 = "[data-figure-chat-foot]", G4 = [0.85, 0.6, 0.35, 0.15], K4 = ["question", "waiting", "suggestion"], OE = (e, t) => K4.find((n) => e[n] > 0 && t[n] === "behind") || null;
function TE() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const Y4 = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Q4 = "[data-figure-newest]";
function Zr() {
  var a, s;
  const e = (a = In()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Q4), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, i;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !$o(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function wn(e, t, n = Zr()) {
  if (!e || !n) return !0;
  const a = ft(e, t), s = Aa(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Ne.top * t.size, bottom: a.top + Ne.bottom * t.size }, l = Et.gap;
  return !Ca(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function IE(e, t, n, a = Zr()) {
  if (!a || wn(t, e, a)) return null;
  const s = Aa(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = Dt(), u = t.posture === "stand" ? So * e.size : iu * e.size, c = Math.max(n.left + u, i.left + o), f = Math.min(n.right - u, i.right - l);
  return [a.left - Et.gap - l, a.right + Et.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= c && p.x <= f && wn(p, e, a) && _x(p, e)).sort((p, y) => Math.abs(p.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const ss = 0.26, eu = 0.54, X4 = 1.25 / 5.4, Bn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: ss, travels: "stand" },
  lounge: { drop: ss, travels: "stand" },
  composed: { drop: ss, travels: "stand" },
  hang: { drop: eu, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, BE = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * X4 * Math.cos(t * Math.PI / 180),
  y: 1 - n - eu
}), cn = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), J4 = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), RE = (e, t) => (e === "sit" ? J4.has(t) : cn.has(e)) ? e : "stand";
function LE(e, t) {
  return e.facing === t.facing || !cn.has(e.posture) && !cn.has(t.posture) ? t : { posture: "stand", facing: cn.has(e.posture) ? e.facing : t.facing };
}
const NE = 0.25, qE = (e, t) => cn.has(e) && Bn[t].drop === 0, tu = 2, Z4 = 90, ex = 180, tx = 140, nx = 280, ax = 420, sx = 0.25, ox = 290, lx = 600, ix = "cubic-bezier(0.2, 0.7, 0.4, 1)", rx = "cubic-bezier(0.55, 0, 0.9, 0.6)", os = 5;
function va(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: u = Math.random, memory: c = null, now: f = 0, room: m = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < os) return null;
  (l || i) && (o = Math.max(o, tu));
  const y = o > 1, b = Math.abs(t.x - e.x), w = b < os ? 0 : b / (Z4 * o) * 1e3, M = Math.min(w, y ? tx : ex), C = Math.abs(t.y - e.y), T = t.y < e.y, z = T && !p && S4(C, n, u, c, f, m), W = T ? ax + Math.min(C, 400) * sx : Math.sqrt(2 * C / bo) * 1e3, R = {
    x: t.x,
    y: t.y,
    ms: C > os ? z ? lx : W : 0,
    lead: z ? ox : T ? nx : 0,
    easing: T ? ix : rx,
    hopping: !0,
    clip: z ? "backflip" : T ? "jump" : "fall"
  }, G = { x: t.x, y: t.y, ms: w + M, lead: 0, easing: "linear", ramp: M, ...y ? { clip: "run" } : {} }, D = p ? ux(t, n) : R, E = T && !a ? [{ ...G, y: e.y }, D] : [{ ...R, x: e.x }, G];
  return { way: Math.sign(t.x - e.x) || 1, legs: E, lands: !s, pace: o, running: y };
}
const ux = (e, t) => ({ x: e.x, y: e.y, ms: Ie.pogo.frames / Ie.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), cx = (e, t) => e.postures.includes(t) ? t : e.postures[0], DE = (e, t, n) => e.posture === "walk" && n ? "walk" : cx(e.clip, t), ft = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - Bn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, Ca = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, $o = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Dt() {
  var t;
  const e = (t = In()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Yn = 0.5, ql = 20;
function PE(e, t, n = Dt()) {
  const a = ft(e, t);
  return a.left >= n.left + ql && a.right <= n.right - ql;
}
function xo(e, t, n = Dt()) {
  const a = ft(e, t), s = a.right - a.left, o = Aa(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], u = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - Yn && i <= n.right + Yn && a.top >= n.top - Yn && u <= n.bottom + Yn;
}
const ga = [0.35, 0.5, 0.65], ya = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ne = { left: ga[0], right: ga.at(-1), top: ya[0], bottom: ya.at(-1) }, dx = 0.24;
function Aa(e) {
  if (e.posture === "stand") return { left: Ne.left, right: Ne.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + dx * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ne.left, t), right: Math.max(Ne.right, t) };
}
function fx(e, { size: t }, n = Dt()) {
  const a = Aa(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const So = (Ne.right - Ne.left) / 2 + 0.08;
function jE(e, t) {
  return e === "hang" ? Ne : { ...Ne, bottom: Math.min(Ne.bottom, 1 - t - Bn[e].drop) };
}
const mx = "[data-figure-agent]";
function nu(e, t, n = "", a = "") {
  var i;
  const s = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !$o(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const u of [l - 1, l].filter((c) => c >= 0)) {
    if (!o.data[u].trim()) continue;
    const c = document.createRange();
    if (c.setStart(o, u), c.setEnd(o, u + 1), [...c.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const au = (e) => ya.flatMap(
  (t) => ga.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function _o(e, t, n = "") {
  if (!wn(e, t)) return ga.length * ya.length;
  const a = ft(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(Y4)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: u }) => u.width && u.height && Ca(s, u) && $o(i)).map(({ rect: i }) => i), l = (i, u) => o.some((c) => i >= c.left && i <= c.right && u >= c.top && u <= c.bottom);
  return au(s).filter(([i, u]) => l(i, u) || nu(i, u, n)).length;
}
function hx(e, t) {
  const n = ft(e, t);
  return au({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => nu(a, s, "", mx)).length;
}
const Dl = 4;
function FE(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Dl; o <= s; o += Dl)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!hx(i, e) && wn(i, e)) return i;
    }
  return null;
}
function $n(e, t, n) {
  const a = Dt(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => xo(l, t, a) && wn(l, t)).map((l) => ({ spot: l, covered: _o(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const su = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), px = [0.5, 0.25, 0.75], vx = (e) => su(e.getBoundingClientRect(), px), ou = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, gx = So, yx = (e, t, { size: n }, a = gx) => lu(e, ou[t], a * n, "stand");
function lu(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const bx = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, iu = 0.1, kx = (e, t, { size: n }) => lu(e, bx[t], iu * n, "sit"), wx = (e) => ((e + 180) % 360 + 360) % 360 - 180, ls = 60;
function WE(e, t) {
  const n = wx(t);
  return !e.aside || Math.abs(n) >= ls ? t : n < 0 ? 360 - ls : ls;
}
const dn = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, $x = (e) => [.../* @__PURE__ */ new Set([e, ...dn.turns.map((t) => (t + 360) % 360)])];
function HE(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = $x(t), l = dn.every[0] + a() * (dn.every[1] - dn.every[0]);
  return { face: t, from: s ? xx(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function xx(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / dn.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function zE(e, t) {
  const { element: n, edge: a } = Ea(), s = ["left", "right"].map((i) => Rn(kx(a, i, e), e)).filter((i) => n && xo(i, e) && !_o(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, u) => o(i) - o(u))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function UE(e, t, { size: n }) {
  const a = (Ne.right - Ne.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - ru } : e;
}
const ru = 7;
function uu() {
  const e = [...document.querySelectorAll(L4)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function Sx(e, t) {
  const n = ft(e, t), a = n.right - n.left;
  return { left: n.left + Ne.left * a, right: n.left + Ne.right * a, top: n.top + Ne.top * a, bottom: n.bottom };
}
function _x(e, t) {
  const n = uu();
  return !n || !Ca(Sx(e, t), n);
}
const Mx = 4;
function Ea() {
  const e = Ln(), t = uu(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > Mx || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - ru - n, 0) } };
}
const VE = ({ size: e, below: t }) => (1 - t) * e;
function Rn(e, t) {
  const n = Dt(), { size: a, below: s } = t, o = Bn[e.posture].drop * a;
  return { ...fx(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const qs = (e, t) => Object.keys(ou).map((n) => Rn(yx(e, n, t), t)), Mo = (e, t) => su(e, G4).map((n) => Rn(n, t)), cu = (e, t, n) => $n(e, t, n) ?? e[0];
function GE(e, t) {
  const { element: n, edge: a } = Ea();
  return { ...cu(qs(a, e), e, t), view: null, on: n };
}
function KE(e, t, n, a) {
  const { element: s, edge: o } = Ea(), l = (a ? qs(o, t) : [...qs(o, t), ...Mo(o, t)]).filter(
    (c) => !Ca(ft(c, t), e)
  ), i = $n(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), u = i && !_o(i, t) ? i : $n(l, t, n);
  return u && { ...u, view: null, on: s };
}
function Ln() {
  var a;
  const e = In(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(U4);
  if (!t) return { ...Oa(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Pl = { within: 2 };
function YE(e) {
  const { element: t, docked: n, edge: a } = Ln();
  if (!n || e.on !== t) return !0;
  const s = Oa().edge;
  return a.left > s.left + Pl.within || a.left + a.width < s.left + s.width - Pl.within;
}
const Cx = "[data-figure-closing]";
function QE() {
  var n;
  const { element: e, docked: t } = Ln();
  return t && !!((n = e.firstElementChild) != null && n.matches(Cx));
}
const du = "[data-figure-progress]";
function XE(e) {
  const t = e.querySelector(du);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function JE(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const Ax = { across: 300, above: 380, below: 60 };
function ZE(e) {
  const { across: t, above: n, below: a } = Ax;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: Ex(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const Ex = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), fu = "[data-figure-bar]", Ds = { back: 144, along: 0.4 };
function eO(e) {
  const { element: t, docked: n, edge: a } = Ln(), s = n ? t.querySelector(fu) : null;
  if (!(s != null && s.querySelector(du))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...Rn({ x: o - Ds.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function tO(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < Ds.along * a.size ? t.x + Ds.along * a.size : e.x, y: e.y, behind: !0 };
}
function nO(e) {
  const t = e.querySelector(fu), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function Oa() {
  const e = In();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function aO(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = Oa(), u = n === null ? Ox(i, e, o === null ? t : { x: o, y: i.top }, a, s) : Rn({ x: n, y: i.top, posture: "stand" }, e);
  return u && { ...u, view: null, on: l, stays: !0 };
}
function Ox(e, t, n, a, s) {
  const o = Mo(e, t), l = Math.min(...o.map((u) => u.x)), i = o.filter((u) => u.x + a + vt.width < s && u.x + a - kt.reach - kt.room >= l);
  return $n(i.length ? i : o, t, n);
}
const Tx = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function sO(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: u = [], memory: c = null, now: f = 0, room: m = 0, pogo: p = !1 } = {}) {
  (o || l) && (s = Math.max(s, tu));
  const y = (z) => {
    const W = ft(z, n, Bn[z.posture].travels);
    return { x: W.left, y: W.top };
  }, b = t.ladder ?? e.ladder;
  if (b && !(t.ladder && e.ladder)) return Ix(y(e), y(t), y({ ...b.foot, posture: "stand" }), b.way, !!t.ladder, n, s);
  const [w, ...M] = [e, ...u, t].map(y), C = va(w, M[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: f, room: m, pogo: p }), T = M.slice(1).map((z, W) => {
    var R;
    return (R = va(M[W], z, n.size, { random: i, memory: c, now: f, room: m })) == null ? void 0 : R.legs.find((G) => G.hopping);
  });
  return C && { ...C, legs: [...C.legs, ...T.filter(Boolean)] };
}
function Ix(e, t, n, a, s, o, l) {
  const i = (f, m) => ({ x: m.x, y: m.y, ms: Math.hypot(m.x - f.x, m.y - f.y) / Tx.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), u = s ? va(e, n, o.size, { pace: l }) : va(n, t, o.size, { pace: l }), c = s ? [...(u == null ? void 0 : u.legs) ?? [], i(n, t)] : [i(e, n), ...(u == null ? void 0 : u.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function oO(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function lO(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && $n(vx(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = Ea();
  return { ...cu(Mo(s, t), t, n), view: null, on: a };
}
const Bx = "[data-figure-bubble]", Rx = 250;
let fn = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), mu = 0;
const nn = () => fn, is = /* @__PURE__ */ new WeakMap();
let Lx = 0;
function Co(e) {
  return is.has(e) || is.set(e, `floor-${++Lx}`), is.get(e);
}
const Nx = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, qx = () => {
  var e, t;
  return ((t = (e = In()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Dx(e, t) {
  var a;
  const n = (a = e.querySelector(V4)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Px(e, t) {
  const n = e && Dx(e, t), a = e ? [...e.querySelectorAll(Bx)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || Nx(l, n))).map(({ element: o, type: l, box: i }) => ({ id: Co(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const jx = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= Rx ? (t.top - a.top) / s * 1e3 : 0;
};
function hu(e = fn, t = performance.now()) {
  const n = Dt(), a = qx(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = Ln(), u = [];
  o && u.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = Oa();
  return c.element && u.push({ id: Co(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), u.push(...Px(a, s)), u.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(u.map((f) => Object.freeze({ ...f, vy: jx(e, f, t) }))) });
}
const Ps = /* @__PURE__ */ new Set();
function Fx(e) {
  return Ps.add(e), () => Ps.delete(e);
}
function Wx() {
  pu();
  const e = () => {
    mu = requestAnimationFrame(e), !document.hidden && (fn = hu(fn), Ps.forEach((t) => t(fn)));
  };
  e();
}
function pu() {
  cancelAnimationFrame(mu);
}
const Ao = 5, Hx = 56, zx = { share: 0.6 }, Ux = (e) => -Math.sqrt(2 * bo * zx.share * e), Yt = (e, t) => e.find((n) => n.id === t) ?? null;
function iO(e, t = hu().floors) {
  const n = Yt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : Co(e.on) : null, o = s && Yt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function vu({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, u = nn().floors) {
  const c = Yt(u, e);
  if (!c) return null;
  const f = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || Vx(c, f, o)) && Gx(f, i, u) ? { x: f.x, y: f.y } : null;
}
const Eo = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, Vx = (e, t, n) => !Eo({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function rO(e, t = nn().floors) {
  if (!Eo(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= Ao && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function Gx(e, t, n = nn().floors) {
  const a = Yt(n, "home");
  return e.posture === "hang" && a && ft(e, t).bottom >= a.top ? !1 : xo(e, t);
}
function uO(e, t, n, a = nn().floors) {
  const s = vu(e, n, a);
  if (!e.home) return Kx(e, t, s, a);
  if (!s) return null;
  const o = Yt(a, "home"), l = s.y - t.y, i = l > Ao ? "dropping" : -l > Hx ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function Kx(e, t, n, a) {
  const s = n ? Yt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: Ux(e.risen) };
  if (!n) return null;
  if (Eo(t) && n.y - t.y > Ao) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function cO(e, t, n) {
  const a = So * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function dO(e, t, n, a = nn().floors) {
  const s = t && vu(t, n, a);
  return s ? { ...e, ...s } : e;
}
const Yx = ["data-type"], Qx = { class: "figure-floor-name" }, Xx = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ge({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      h("span", Qx, v(e.floor.type), 1)
    ], 12, Yx));
  }
}, Jx = /* @__PURE__ */ H(Xx, [["__scopeId", "data-v-4e0f1e2e"]]), Zx = {
  class: "figure-floors",
  "aria-hidden": "true"
}, e8 = {
  __name: "FigureFloors",
  setup(e) {
    const t = at(nn().floors);
    let n = () => {
    };
    return Ce(() => {
      n = Fx((a) => t.value = a.floors), Wx();
    }), Le(() => {
      n(), pu();
    }), (a, s) => (r(), d("div", Zx, [
      (r(!0), d(B, null, X(t.value, (o) => (r(), P(Jx, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, fO = /* @__PURE__ */ H(e8, [["__scopeId", "data-v-e519168b"]]), mn = (e) => typeof e == "number" ? e : Date.parse(e);
function mO(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: mn(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => mn(s.row.created_at) - mn(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const jl = 20;
async function hO(e, t, n) {
  for (let a = 0; a < jl; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || mn(o.created_at) <= mn(s.created_at) || !await n()) return a;
  }
  return jl;
}
const t8 = 3, rs = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function n8(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = rs[n.grouping]) == null ? void 0 : a.call(rs, e.row, n)) || "";
}
function a8(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function pO(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= t8 ? [a8(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = n8(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
const vO = (e) => (t) => t.filter((n) => n.id !== e), gO = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), yO = (e) => (t) => [...t, e], bO = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function kO(e, t = {}) {
  const n = ot(), a = _(null), s = _("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function wO(e) {
  const t = ot(), n = _("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Qn = /* @__PURE__ */ new Map();
function s8(e, t) {
  if (Qn.has(e)) return Qn.get(e);
  const n = t().finally(() => Qn.delete(e));
  return Qn.set(e, n), n;
}
function $O() {
  const e = ot(), t = _(null), n = _("");
  async function a() {
    const s = await s8(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const o8 = { class: "cards-page" }, l8 = { class: "cards-bar" }, i8 = { class: "cards-count" }, r8 = { class: "cards" }, u8 = {
  key: 1,
  class: "cards-note"
}, c8 = {
  key: 2,
  class: "cards-note"
}, d8 = ["data-row", "onClick"], f8 = { class: "card-head" }, m8 = { class: "card-title" }, h8 = { class: "card-foot" }, p8 = {
  __name: "RowCards",
  props: {
    rows: { type: Array, required: !0 },
    failure: { type: String, default: "" },
    loaded: { type: Boolean, required: !0 },
    term: { type: String, required: !0 },
    icon: { type: String, required: !0 },
    head: { type: Function, required: !0 },
    title: { type: Function, required: !0 },
    foot: { type: Function, required: !0 }
  },
  emits: ["new", "open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", o8, [
      h("div", l8, [
        h("span", i8, v(e.rows.length) + " " + v(e.rows.length === 1 ? e.term : `${e.term}s`), 1),
        A(ve, je({
          small: "",
          bordered: ""
        }, { [`data-${e.term}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: q(() => [
            A(ie, {
              name: "plus",
              size: 12
            }),
            U(" New " + v(e.term), 1)
          ]),
          _: 1
        }, 16)
      ]),
      h("div", r8, [
        e.loaded ? e.failure ? (r(), d("p", u8, v(e.failure), 1)) : e.rows.length ? k("", !0) : (r(), d("p", c8, "No " + v(e.term) + "s yet", 1)) : (r(), P(Ze, {
          key: 0,
          shape: "cards"
        })),
        (r(!0), d(B, null, X(e.rows, (o) => (r(), d("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          h("span", f8, [
            A(ie, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            U(" " + v(e.head(o)), 1),
            A(Je, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          h("span", m8, v(e.title(o)), 1),
          h("span", h8, v(e.foot(o)), 1)
        ], 8, d8))), 128))
      ]),
      ae(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, xO = /* @__PURE__ */ H(p8, [["__scopeId", "data-v-b39fea5d"]]), Fl = "newest";
function SO(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Me(Re, null)) == null ? void 0 : c.search, s = _(""), o = _(Fl), l = _("all"), i = x(() => {
    const f = s.value.trim().toLowerCase(), m = e.value.filter((p) => kr(p, f, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(p) === (l.value === "open")));
    return o.value === Fl ? m : [...m].sort((p, y) => t(p).localeCompare(t(y)));
  }), u = x(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: u, hasStates: !!n };
}
const v8 = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, g8 = {
  class: "auto-scroll-newest-line",
  "data-scroll-newest-line": ""
}, y8 = 40, b8 = "top", k8 = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" }, feed: { type: Object, default: null } },
  setup(e, { expose: t }) {
    var p;
    const n = e, a = (p = Me(Re, null)) == null ? void 0 : p.autoScroll, s = x(() => a === b8), o = _(null), l = _(!1), i = (y) => s.value ? y.scrollTop : y.scrollHeight - y.scrollTop - y.clientHeight, u = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: u(), behavior: "smooth" });
    function f() {
      var y;
      l.value = i(o.value) >= y8, s.value || (y = n.feed) == null || y.reachTop(o.value);
    }
    me(() => {
      var y;
      return [n.rowCount, (y = n.feed) == null ? void 0 : y.isLoaded()];
    }, async () => {
      await Fe(), o.value && (l.value || (o.value.scrollTop = u()), n.feed && !s.value && (n.feed.drawn(o.value), await n.feed.fill(o.value)));
    }, { immediate: !0, flush: "post" });
    let m = null;
    return Ce(() => {
      typeof MutationObserver > "u" || (m = new MutationObserver(() => {
        !l.value && o.value && (o.value.scrollTop = u());
      }), m.observe(o.value, { childList: !0, subtree: !0, attributes: !0, characterData: !0 }));
    }), st(() => m == null ? void 0 : m.disconnect()), t({ pane: o }), (y, b) => (r(), d("div", v8, [
      h("div", {
        ref_key: "pane",
        ref: o,
        class: Y(["auto-scroll-pane", e.paneClass]),
        onScroll: f
      }, [
        ae(y.$slots, "default", {}, void 0, !0)
      ], 34),
      h("div", g8, [
        A(Xt, {
          name: "auto-scroll-rise",
          persisted: ""
        }, {
          default: q(() => [
            _e(h("button", {
              type: "button",
              class: "auto-scroll-newest",
              "data-scroll-newest": "",
              title: "Back to the newest",
              onClick: c
            }, [
              A(ie, {
                name: s.value ? "up" : "down"
              }, null, 8, ["name"]),
              b[0] || (b[0] = U(" Newest ", -1))
            ], 512), [
              [zs, l.value]
            ])
          ]),
          _: 1
        })
      ])
    ]));
  }
}, _O = /* @__PURE__ */ H(k8, [["__scopeId", "data-v-d704d7e3"]]), w8 = ["aria-selected", "data-tab", "onClick"], $8 = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, x8 = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Me(Re, null), o = x(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = _(null), i = _({ left: 0, width: 0, slides: !1 }), u = (p) => n.answer[p.count_field] !== void 0;
    function c(p) {
      var b;
      const y = (b = l.value) == null ? void 0 : b.querySelector(".inner-tab.on");
      if (!y) return void (i.value = { left: 0, width: 0, slides: !1 });
      i.value = { left: y.offsetLeft, width: y.offsetWidth, slides: p }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, y.offsetLeft - 12));
    }
    const f = () => Fe(() => c(!0));
    let m = null;
    return Ce(() => {
      var p;
      c(!1), m = new ResizeObserver(() => c(!1)), m.observe(l.value), (p = document.fonts) == null || p.ready.then(() => c(!1));
    }), Le(() => m == null ? void 0 : m.disconnect()), me(() => {
      var p;
      return (p = n.active) == null ? void 0 : p.key;
    }, f), me(() => n.answer, f, { deep: !0 }), (p, y) => (r(), d("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (r(!0), d(B, null, X(o.value, (b) => {
        var w, M;
        return r(), d("button", {
          key: b.key,
          type: "button",
          role: "tab",
          class: Y(["inner-tab", { on: ((w = e.active) == null ? void 0 : w.key) === b.key }]),
          "aria-selected": ((M = e.active) == null ? void 0 : M.key) === b.key,
          "data-tab": b.key,
          onClick: (C) => a("choose", b)
        }, [
          U(v(b.label) + " ", 1),
          u(b) ? (r(), d("span", $8, v(e.answer[b.count_field]), 1)) : k("", !0)
        ], 10, w8);
      }), 128)),
      h("i", {
        class: Y(["inner-tabs-line", { slides: i.value.slides }]),
        style: ge({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, S8 = /* @__PURE__ */ H(x8, [["__scopeId", "data-v-63fcd326"]]), _8 = { class: "task-bar" }, M8 = {
  __name: "TaskBar",
  props: { total: { type: Number, required: !0 }, done: { type: Number, required: !0 }, testing: { type: Number, required: !0 }, started: { type: Number, default: 0 } },
  setup(e) {
    const t = e, n = (a) => t.total ? Math.round(a / t.total * 100) : 0;
    return (a, s) => (r(), d("span", _8, [
      h("span", {
        class: "task-bar-fill",
        "data-task-bar-done": "",
        style: ge({ width: `${n(e.done)}%` })
      }, null, 4),
      h("span", {
        class: "task-bar-testing",
        "data-task-bar-testing": "",
        style: ge({ width: `${n(e.testing)}%` })
      }, null, 4),
      h("span", {
        class: "task-bar-started",
        "data-task-bar-started": "",
        style: ge({ width: `${n(e.started)}%` })
      }, null, 4)
    ]));
  }
}, MO = /* @__PURE__ */ H(M8, [["__scopeId", "data-v-eafa73d4"]]), C8 = {
  class: "tab-body",
  "data-tab-body": ""
}, A8 = { "data-tab-content": "" }, E8 = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = _(!1);
    let a = 0;
    return me(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, Us(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (r(), d("div", C8, [
      n.value ? (r(), P(Ze, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : k("", !0),
      _e(h("div", A8, [
        ae(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [zs, !n.value]
      ])
    ]));
  }
}, CO = /* @__PURE__ */ H(E8, [["__scopeId", "data-v-63876533"]]), O8 = {
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
    return (o, l) => (r(), P(_r, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (i) => n("pick", i))
    }, {
      menu: q(() => [
        A(bt, null, {
          default: q(() => [...l[2] || (l[2] = [
            U("Order", -1)
          ])]),
          _: 1
        }),
        (r(), d(B, null, X(a, (i) => A(He, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (u) => e.tools.order.value = i.key
        }, {
          default: q(() => [
            U(v(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (r(), d(B, { key: 0 }, [
          A(bt, null, {
            default: q(() => [...l[3] || (l[3] = [
              U("Show", -1)
            ])]),
            _: 1
          }),
          (r(), d(B, null, X(s, (i) => A(He, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (u) => e.tools.state.value = i.key
          }, {
            default: q(() => [
              U(v(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : k("", !0)
      ]),
      default: q(() => [
        ae(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, AO = /* @__PURE__ */ H(O8, [["__scopeId", "data-v-dab0064d"]]);
function EO() {
  const e = _(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const OO = (e) => import(
  /* @vite-ignore */
  e
), T8 = 86400, js = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function I8(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((js(t) - js(e)) / T8);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function TO(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = js(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: I8(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const us = 280, cs = 240, ds = 120, B8 = 6, R8 = 14, xn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function L8(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function gu(e, t) {
  const n = Math.max(0, L8(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function N8(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${R8}px)` }), e.offsetHeight, e.style.transition = `height ${us}ms ${xn}`, e.style.height = `${l}px`;
  const i = s();
  let u = !1, c = !1;
  const f = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, m = () => {
    if (c) return;
    n() && (t.scrollTop = gu(t, e));
    const p = s() - i;
    if (!u && p >= us && (u = !0, e.style.transition = `opacity ${cs}ms ease-out, transform ${cs}ms ${xn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < us + cs) return a(m);
    f();
  };
  return a(m), f;
}
function IO(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${B8}px)` }), e.offsetHeight, e.style.transition = `opacity ${ds}ms ease-out, transform ${ds}ms ${xn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = gu(t, e)), s() - l < ds) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const q8 = 140, Xn = 220, Wl = 5;
function BO({ gap: e = q8, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function i(f, m) {
    a.add(f), f.cancel = f.arrival(f.el, f.options, () => {
      a.delete(f), f.done(), m();
    });
  }
  function u() {
    const f = n.splice(0, Wl);
    if (s = f.length > 0, !s) return;
    let m = f.length;
    for (const p of f)
      p.el.style.display = p.display, i(p, () => {
        m -= 1, m || (o = t(u, e));
      });
  }
  const c = (f, m, p, y = N8) => {
    if (l || !m.pane || !m.follows()) return p();
    const b = { el: f, options: m, done: p, arrival: y, display: f.style.display || "" };
    if (!s)
      return s = !0, i(b, () => o = t(u, e));
    f.style.display = "none", n.push(b), n.length >= Wl && c.flush();
  };
  return c.flush = () => {
    var f;
    l = !0, queueMicrotask(() => l = !1);
    for (const m of [...a]) (f = m.cancel) == null || f.call(m);
    clearTimeout(o), s = !1;
    for (const m of n.splice(0))
      m.el.style.display = m.display, m.done();
  }, c;
}
function RO(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Xn}ms ${xn}, opacity ${Xn}ms ease-in, margin ${Xn}ms ${xn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Xn);
}
const yu = "chat.pins.minimised", aa = _(oa(yu, !1));
function Hl(e) {
  aa.value = e, lo(yu, e);
}
function D8(e) {
  const t = x(() => e()), n = x(() => aa.value ? [] : e()), a = () => Hl(!aa.value), s = Date.now() / 1e3;
  return me(
    () => t.value.filter((o) => Rt(o) > s).length,
    (o, l) => o > l && Hl(!1)
  ), { pins: t, visible: n, minimised: aa, toggle: a };
}
const P8 = ["title"], j8 = {
  key: 0,
  class: "pins-count"
}, F8 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = D8(() => t.pinRows);
    return (o, l) => I(n).length ? (r(), d("button", {
      key: 0,
      type: "button",
      class: Y(["pins-toggle", { minimised: I(a), inline: e.inline }]),
      title: I(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = ke((...i) => I(s) && I(s)(...i), ["stop"]))
    }, [
      A(ie, {
        name: I(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      I(a) ? (r(), d("span", j8, v(I(n).length), 1)) : k("", !0)
    ], 10, P8)) : k("", !0);
  }
}, LO = /* @__PURE__ */ H(F8, [["__scopeId", "data-v-d073c504"]]), W8 = ["title"], H8 = ["title"], z8 = { class: "diff-card-dir" }, U8 = { class: "diff-card-name" }, V8 = {
  key: 1,
  class: "diff-card-from",
  "data-diff-card-from": ""
}, G8 = ["title"], K8 = ["title"], Y8 = {
  key: 0,
  class: "diff-card-note"
}, Q8 = ["href"], X8 = ["src", "alt"], J8 = { class: "diff-card-rows" }, Z8 = { class: "diff-row-num" }, e3 = { class: "diff-row-sign" }, t3 = { class: "diff-row-code" }, n3 = {
  __name: "DiffCard",
  props: {
    path: { type: String, required: !0 },
    change: { type: String, required: !0 },
    from: { type: String, default: "" },
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
    function o(j) {
      (j.metaKey || j.ctrlKey) && (j.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted", moved: "moved" }, i = { add: "+", del: "−" }, u = x(() => n.path.lastIndexOf("/") + 1), c = x(() => n.path.slice(0, u.value)), f = x(() => n.path.slice(u.value)), m = x(() => n.change === "deleted"), p = x(() => l[n.change]), y = x(() => new Set(n.rows.filter((j) => j.line_type === "add").map((j) => j.line))), b = _("after"), w = x(() => b.value === "before" ? n.whole.old : n.whole.text), M = x(() => n.whole && n.whole.text !== void 0 ? w.value.split(`
`).map((j, $) => ({ line_type: b.value === "after" && y.value.has($ + 1) ? "add" : "ctx", line: $ + 1, text: j })) : n.rows.filter(
      (j) => !(n.editsOnly && ["ctx", "fold"].includes(j.line_type)) && !(n.hideRemovals && j.line_type === "del")
    )), C = _(!1), T = x(() => n.lines && !C.value && !n.whole), z = x(() => T.value ? M.value.slice(0, n.lines) : M.value), W = x(() => M.value.length - z.value.length), R = (j) => j.line === null || j.line_type === "del" ? "" : j.line, G = (j) => j.line_type === "fold" ? j.hidden ? `⋯ ${j.hidden} lines` : "⋯" : j.text, D = _(null), E = _(null);
    let N = null;
    return Ce(() => {
      if (!E.value) return;
      let j = !0;
      N = new ResizeObserver(() => {
        !D.value || !E.value || (D.value.style.transition = j ? "none" : "", D.value.style.height = `${E.value.offsetHeight}px`, j = !1);
      }), N.observe(E.value);
    }), Le(() => N && N.disconnect()), (j, $) => (r(), d("section", {
      class: Y(["diff-card", { half: e.half, gone: m.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      h("header", {
        class: "diff-card-head",
        title: m.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: $[2] || ($[2] = (g) => !m.value && a("fold"))
      }, [
        h("span", {
          class: "diff-card-path",
          title: `${e.path} · ${I(s)}-click to open it`,
          onClick: o
        }, [
          h("span", z8, v(c.value), 1),
          h("span", U8, v(f.value), 1),
          p.value ? (r(), d("span", {
            key: 0,
            class: Y(["diff-card-badge", e.change])
          }, v(p.value), 3)) : k("", !0),
          e.from ? (r(), d("span", V8, "from " + v(e.from), 1)) : k("", !0)
        ], 8, H8),
        h("span", {
          class: Y(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + v(e.added), 3),
        h("span", {
          class: Y(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + v(e.removed), 3),
        A(Je, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: b.value === "after" ? "Show the file before" : "Show the file after",
          onClick: $[0] || ($[0] = ke((g) => b.value = b.value === "after" ? "before" : "after", ["stop"]))
        }, v(b.value === "after" ? "After" : "Before"), 9, G8)) : k("", !0),
        m.value ? k("", !0) : (r(), d("button", {
          key: 1,
          type: "button",
          class: Y(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: $[1] || ($[1] = ke((g) => a("whole"), ["stop"]))
        }, [
          A(ie, {
            name: "file",
            size: 12
          })
        ], 10, K8))
      ], 8, W8),
      e.whole && e.whole.error ? (r(), d("p", Y8, v(e.whole.error), 1)) : k("", !0),
      !m.value && !e.folded ? (r(), d(B, { key: 1 }, [
        e.picture ? (r(), d("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          h("img", {
            src: e.picture,
            alt: f.value,
            loading: "lazy"
          }, null, 8, X8)
        ], 8, Q8)) : (r(), d("div", {
          key: 1,
          ref_key: "grow",
          ref: D,
          class: "diff-card-grow"
        }, [
          h("div", {
            ref_key: "body",
            ref: E,
            class: "diff-card-diff"
          }, [
            h("div", J8, [
              (r(!0), d(B, null, X(z.value, (g, S) => (r(), d("div", {
                key: S,
                class: Y(["diff-row", g.line_type, { fresh: e.fresh && g.edit === e.fresh }])
              }, [
                h("span", Z8, v(R(g)), 1),
                h("span", e3, v(i[g.line_type]), 1),
                h("span", t3, v(G(g)), 1)
              ], 2))), 128)),
              W.value > 0 ? (r(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: $[3] || ($[3] = ke((g) => C.value = !0, ["stop"]))
              }, v(W.value) + " more " + v(W.value === 1 ? "line" : "lines"), 1)) : k("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : k("", !0)
    ], 2));
  }
}, NO = /* @__PURE__ */ H(n3, [["__scopeId", "data-v-021c4dbc"]]), a3 = { "data-queue-controls": "" }, s3 = { class: "counts" }, o3 = { "data-queue-spots": "" }, l3 = {
  class: "spots",
  "aria-label": "Slot units in use"
}, i3 = { "data-queue-waiting": "" }, r3 = { key: 0 }, u3 = { class: "control" }, c3 = { class: "stepper" }, d3 = ["disabled"], f3 = {
  "aria-labelledby": "queue-limit-label",
  "data-queue-limit": ""
}, m3 = ["disabled"], h3 = ["for"], p3 = ["id", "value", "disabled", "onChange"], v3 = {
  key: 0,
  class: "note halted",
  role: "status",
  "data-queue-update-waits": ""
}, g3 = {
  key: 1,
  class: "note halted",
  role: "status",
  "data-queue-held": ""
}, y3 = {
  key: 2,
  class: "note failure",
  role: "alert"
}, b3 = {
  __name: "ProcessQueueControls",
  props: { queue: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1), o = _("");
    async function l(i, u) {
      if (s.value) return;
      s.value = !0;
      const c = await n.read(["setting", "set", i, String(u)]);
      o.value = c.ok ? "" : c.error, c.ok && a("saved"), s.value = !1;
    }
    return (i, u) => (r(), d("div", a3, [
      A(Lt, { icon: "gauge" }, {
        default: q(() => [...u[2] || (u[2] = [
          U("Now", -1)
        ])]),
        _: 1
      }),
      h("div", s3, [
        h("div", null, [
          h("strong", o3, [
            U(v(e.queue.used_slots) + " ", 1),
            h("span", null, "of " + v(e.queue.parallel_limit), 1)
          ]),
          h("p", null, "Slot units of long runs in use. " + v(e.queue.used_slots >= e.queue.parallel_limit ? "Every unit is taken." : `${e.queue.parallel_limit - e.queue.used_slots} ${e.queue.parallel_limit - e.queue.used_slots === 1 ? "unit" : "units"} free.`), 1),
          h("div", l3, [
            (r(!0), d(B, null, X(e.queue.parallel_limit, (c) => (r(), d("span", {
              key: c,
              class: Y({ used: c <= e.queue.used_slots })
            }, null, 2))), 128))
          ])
        ]),
        h("div", null, [
          h("strong", i3, v(e.queue.waiting_count), 1),
          u[3] || (u[3] = h("p", null, "Commands waiting", -1)),
          e.queue.waiting_count ? (r(), d("p", r3, "The oldest goes first.")) : k("", !0)
        ])
      ]),
      h("div", u3, [
        u[4] || (u[4] = h("div", null, [
          h("label", { id: "queue-limit-label" }, "Long lane capacity"),
          h("p", null, "Slot units of long runs that may run at the same time; a test or a build costs 4. The rest wait. Lowering it stops none that are running.")
        ], -1)),
        h("div", c3, [
          h("button", {
            type: "button",
            "aria-label": "One slot unit fewer",
            disabled: s.value || e.queue.parallel_limit <= 1,
            onClick: u[0] || (u[0] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit - 1))
          }, "−", 8, d3),
          h("output", f3, v(e.queue.parallel_limit), 1),
          h("button", {
            type: "button",
            "aria-label": "One slot unit more",
            disabled: s.value,
            onClick: u[1] || (u[1] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit + 1))
          }, "+", 8, m3)
        ])
      ]),
      (r(!0), d(B, null, X(e.queue.suite_limits, (c) => (r(), d("div", {
        key: c.key,
        class: "control"
      }, [
        h("div", null, [
          h("label", {
            for: c.key
          }, v(c.title), 9, h3),
          h("p", null, v(c.description), 1)
        ]),
        h("input", {
          id: c.key,
          class: "limit",
          type: "number",
          min: "0",
          value: c.value,
          disabled: s.value,
          "data-queue-suite-limit": "",
          onChange: (f) => l(c.key, f.target.value)
        }, null, 40, p3)
      ]))), 128)),
      e.queue.halt_cause === "update" ? (r(), d("p", v3, [
        A(ie, {
          name: "pause",
          size: 13
        }),
        u[5] || (u[5] = U("An update waits for the running commands to end. Every command that waits stays in the queue, in order, and gets its place once the update is done.", -1))
      ])) : e.queue.halted ? (r(), d("p", g3, [
        A(ie, {
          name: "pause",
          size: 13
        }),
        U("The queue is paused. No waiting command gets a place until it is resumed. " + v(e.queue.halt_reason), 1)
      ])) : k("", !0),
      o.value ? (r(), d("p", y3, v(o.value), 1)) : k("", !0)
    ]));
  }
}, k3 = /* @__PURE__ */ H(b3, [["__scopeId", "data-v-f0a1f7f7"]]), w3 = ["data-queue-row", "data-queue-process"], $3 = ["aria-expanded"], x3 = { class: "run-line" }, S3 = { class: "leading" }, _3 = {
  key: 0,
  "data-queue-position": ""
}, M3 = ["title"], C3 = { class: "command" }, A3 = {
  class: "time",
  "data-queue-time": ""
}, E3 = { class: "details" }, O3 = { "data-queue-type": "" }, T3 = { class: "failed" }, I3 = { class: "drop-inner" }, B3 = { class: "output" }, R3 = { class: "output-heading" }, L3 = ["href"], N3 = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(), o = Er((p) => n.read([...p, "--limit", "50"]), () => n.run.id), l = o.lines, i = vo(), u = x(() => n.run.plugin ? `Plugin ${n.run.plugin}` : { test: "Test run", build: "Build", check: "Check", install: "Install" }[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = x(() => {
      const p = n.run.section === "waiting" ? n.run.created_at : n.run.started_at;
      if (!p) return "";
      const y = n.run.ended_at ? new Date(n.run.ended_at).getTime() : i.value * 1e3, b = Math.max(0, Math.floor((y - new Date(p).getTime()) / 1e3));
      return b < 60 ? `${b} s` : b < 3600 ? `${Math.floor(b / 60)} m ${b % 60} s` : `${Math.floor(b / 3600)} h ${String(Math.floor(b / 60) % 60).padStart(2, "0")} m`;
    });
    async function f() {
      if (!n.expanded) return;
      const p = s.value, y = p.scrollHeight - p.scrollTop - p.clientHeight < 2;
      await o.follow(), await Fe(), n.expanded && y && (p.scrollTop = p.scrollHeight);
    }
    async function m() {
      n.expanded && (await o.newest(), await Fe(), n.expanded && (s.value.scrollTop = s.value.scrollHeight, o.feed.drawn(s.value)));
    }
    return me(() => n.expanded, m, { immediate: !0 }), On(["output.*"], f, (p) => ri(p, /* @__PURE__ */ new Set([n.run.id]))), (p, y) => (r(), d("div", {
      class: "run",
      "data-queue-row": e.run.section,
      "data-queue-process": e.run.id
    }, [
      h("div", {
        class: "toggle",
        role: "button",
        tabindex: "0",
        "aria-expanded": e.expanded,
        onClick: y[2] || (y[2] = (b) => a("toggle")),
        onKeydown: [
          y[3] || (y[3] = Ot(ke((b) => a("toggle"), ["prevent"]), ["enter"])),
          y[4] || (y[4] = Ot(ke((b) => a("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        h("div", x3, [
          h("span", S3, [
            e.run.section === "waiting" ? (r(), d("span", _3, v(e.position), 1)) : (r(), d("span", {
              key: 1,
              class: Y(["dot", { passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, M3))
          ]),
          h("code", C3, v(e.run.line), 1),
          h("span", A3, v(c.value), 1),
          A(ie, {
            class: Y(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        h("div", E3, [
          h("span", O3, v(u.value), 1),
          e.run.owner_agent_id ? (r(), d(B, { key: 0 }, [
            y[6] || (y[6] = h("span", { class: "separator" }, "·", -1)),
            h("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: y[0] || (y[0] = ke((b) => I($t)("agents", e.run.owner_agent_id), ["stop"]))
            }, "Agent " + v(e.run.owner_agent_id), 1)
          ], 64)) : e.run.is_main ? (r(), d(B, { key: 1 }, [
            y[7] || (y[7] = h("span", { class: "separator" }, "·", -1)),
            y[8] || (y[8] = h("span", null, "Main agent", -1))
          ], 64)) : k("", !0),
          e.run.task_id ? (r(), d(B, { key: 2 }, [
            y[9] || (y[9] = h("span", { class: "separator" }, "·", -1)),
            h("button", {
              type: "button",
              class: "link",
              "data-queue-task": "",
              onClick: y[1] || (y[1] = ke((b) => I($t)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + v(e.run.task_id), 1)
          ], 64)) : k("", !0),
          e.run.state === "failed" ? (r(), d(B, { key: 3 }, [
            y[10] || (y[10] = h("span", { class: "separator" }, "·", -1)),
            h("span", T3, "Failed, exit " + v(e.run.exit_code), 1)
          ], 64)) : k("", !0)
        ])
      ], 40, $3),
      h("div", {
        class: Y(["drop", { open: e.expanded }])
      }, [
        h("div", I3, [
          h("div", B3, [
            h("div", R3, [
              h("span", null, "Output " + v(e.run.id), 1),
              h("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, L3)
            ]),
            h("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: y[5] || (y[5] = (b) => e.expanded && I(o).loadEarlier(b.target))
            }, [
              y[11] || (y[11] = h("span", { class: "prompt" }, "$ ", -1)),
              U(v(e.run.line), 1),
              I(l).length ? (r(), d(B, { key: 0 }, [
                U(v(`
` + I(l).join(`
`)), 1)
              ], 64)) : k("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, w3));
  }
}, q3 = /* @__PURE__ */ H(N3, [["__scopeId", "data-v-26ce3024"]]), D3 = {
  class: "lanes",
  "data-execution-lanes": ""
}, P3 = { class: "filters" }, j3 = ["value"], F3 = ["value"], W3 = ["data-lane"], H3 = {
  key: 0,
  class: "empty"
}, z3 = { class: "line" }, U3 = { class: "facts" }, V3 = { class: "line" }, G3 = { class: "facts" }, K3 = {
  class: "waits",
  "data-lanes-waits": ""
}, Y3 = {
  key: 0,
  class: "empty"
}, Q3 = {
  __name: "ExecutionLanes",
  props: { execution: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = _(""), a = _(""), s = x(() => [...new Set(t.execution.lanes.flatMap((m) => [...m.running, ...m.waiting].map((p) => p.class)))].sort()), o = x(() => [...new Set(t.execution.lanes.flatMap((m) => [...m.running, ...m.waiting].map((p) => p.starter)))].sort()), l = (m) => (!n.value || m.class === n.value) && (!a.value || m.starter === a.value), i = x(() => t.execution.lanes.map((m) => ({ ...m, running: m.running.filter(l), waiting: m.waiting.filter(l) }))), u = x(() => t.execution.waits.filter((m) => m.runs)), c = (m) => `${m.lane[0].toUpperCase()}${m.lane.slice(1)} lane`, f = (m) => m < 60 ? `${m} s` : `${Math.round(m / 60)} min`;
    return (m, p) => (r(), d("section", D3, [
      h("div", P3, [
        h("label", null, [
          p[3] || (p[3] = U("Class ", -1)),
          _e(h("select", {
            "onUpdate:modelValue": p[0] || (p[0] = (y) => n.value = y),
            "data-lanes-class": ""
          }, [
            p[2] || (p[2] = h("option", { value: "" }, "Every class", -1)),
            (r(!0), d(B, null, X(s.value, (y) => (r(), d("option", {
              key: y,
              value: y
            }, v(y), 9, j3))), 128))
          ], 512), [
            [It, n.value]
          ])
        ]),
        h("label", null, [
          p[5] || (p[5] = U("Started by ", -1)),
          _e(h("select", {
            "onUpdate:modelValue": p[1] || (p[1] = (y) => a.value = y),
            "data-lanes-starter": ""
          }, [
            p[4] || (p[4] = h("option", { value: "" }, "Anyone", -1)),
            (r(!0), d(B, null, X(o.value, (y) => (r(), d("option", {
              key: y,
              value: y
            }, v(y), 9, F3))), 128))
          ], 512), [
            [It, a.value]
          ])
        ])
      ]),
      (r(!0), d(B, null, X(i.value, (y) => (r(), d("div", {
        key: y.lane,
        class: "lane",
        "data-lane": y.lane
      }, [
        h("h2", null, [
          U(v(c(y)) + " ", 1),
          h("span", {
            class: Y(["room", { over: y.over_capacity }])
          }, [
            U(v(y.used) + " of " + v(y.capacity) + " in use", 1),
            y.over_capacity ? (r(), d(B, { key: 0 }, [
              U(", over capacity")
            ], 64)) : k("", !0),
            y.halted ? (r(), d(B, { key: 1 }, [
              U(", halted")
            ], 64)) : k("", !0)
          ], 2)
        ]),
        !y.running.length && !y.waiting.length ? (r(), d("p", H3, "Nothing runs or waits here.")) : k("", !0),
        h("ul", null, [
          (r(!0), d(B, null, X(y.running, (b, w) => (r(), d("li", {
            key: `run:${w}`,
            class: Y({ child: b.parent_line }),
            "data-lane-entry": "running"
          }, [
            h("span", z3, v(b.line), 1),
            h("span", U3, [
              U(v(b.class) + ", " + v(b.priority) + ", " + v(b.starter) + ", running " + v(f(b.seconds)), 1),
              b.parent_line ? (r(), d(B, { key: 0 }, [
                U(", for " + v(b.parent_line), 1)
              ], 64)) : k("", !0)
            ])
          ], 2))), 128)),
          (r(!0), d(B, null, X(y.waiting, (b, w) => (r(), d("li", {
            key: `wait:${w}`,
            class: "waiting",
            "data-lane-entry": "waiting"
          }, [
            h("span", V3, v(b.line), 1),
            h("span", G3, [
              U(v(b.class) + ", " + v(b.priority) + ", " + v(b.starter) + ", waiting " + v(f(b.seconds)) + ": " + v(b.reason), 1),
              b.raised_from ? (r(), d(B, { key: 0 }, [
                U(". Raised from " + v(b.raised_from), 1)
              ], 64)) : k("", !0)
            ])
          ]))), 128))
        ])
      ], 8, W3))), 128)),
      h("div", K3, [
        p[6] || (p[6] = h("h2", null, "Waits over the last hour", -1)),
        u.value.length ? k("", !0) : (r(), d("p", Y3, "No run started in the last hour.")),
        (r(!0), d(B, null, X(u.value, (y) => (r(), d("p", {
          key: y.priority,
          class: "wait"
        }, v(y.priority) + ": " + v(y.runs) + " started, longest wait " + v(f(y.longest_seconds)) + ", average " + v(f(y.average_seconds)), 1))), 128))
      ])
    ]));
  }
}, X3 = /* @__PURE__ */ H(Q3, [["__scopeId", "data-v-4a25d644"]]), bu = ["instant", "short", "long"], ku = ["background", "normal", "agent", "reserved", "immediate"], J3 = [
  { name: "small", title: "Small machine" },
  { name: "medium", title: "Medium machine" },
  { name: "large", title: "Large machine" }
];
function wu(e) {
  return ["--lane", e.lane, "--cost", String(e.cost), "--priority", e.priority, "--limit", String(e.limit)];
}
const Z3 = ["data-class-row"], eS = { scope: "row" }, tS = { key: 0 }, nS = ["value"], aS = ["value"], sS = { class: "actions" }, oS = ["disabled"], lS = ["disabled"], iS = { class: "actions" }, rS = ["disabled"], uS = ["disabled"], cS = ["disabled"], dS = {
  __name: "ExecutionClassRow",
  props: { entry: { type: Object, required: !0 }, saving: Boolean },
  emits: ["send"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1), o = _({}), l = { "built-in": "Built in", changed: "Changed", "your own": "Your own" };
    function i() {
      o.value = { ...n.entry }, s.value = !0;
    }
    function u() {
      a("send", ["queue-class", "set", n.entry.name, ...wu(o.value)], () => s.value = !1);
    }
    return (c, f) => (r(), d("tr", {
      "data-class-row": e.entry.name
    }, [
      h("th", eS, [
        U(v(e.entry.name), 1),
        e.entry.pattern || e.entry.plugin ? (r(), d("small", tS, v(e.entry.pattern || `plugin ${e.entry.plugin}`), 1)) : k("", !0)
      ]),
      s.value ? (r(), d(B, { key: 0 }, [
        h("td", null, [
          _e(h("select", {
            "onUpdate:modelValue": f[0] || (f[0] = (m) => o.value.lane = m),
            "aria-label": "Lane",
            "data-class-lane": ""
          }, [
            (r(!0), d(B, null, X(I(bu), (m) => (r(), d("option", {
              key: m,
              value: m
            }, v(m), 9, nS))), 128))
          ], 512), [
            [It, o.value.lane]
          ])
        ]),
        h("td", null, [
          _e(h("input", {
            "onUpdate:modelValue": f[1] || (f[1] = (m) => o.value.cost = m),
            type: "number",
            min: "0",
            "aria-label": "Slot units",
            "data-class-cost": ""
          }, null, 512), [
            [
              Ke,
              o.value.cost,
              void 0,
              { number: !0 }
            ]
          ])
        ]),
        h("td", null, [
          _e(h("select", {
            "onUpdate:modelValue": f[2] || (f[2] = (m) => o.value.priority = m),
            "aria-label": "Priority",
            "data-class-priority": ""
          }, [
            (r(!0), d(B, null, X(I(ku), (m) => (r(), d("option", {
              key: m,
              value: m
            }, v(m), 9, aS))), 128))
          ], 512), [
            [It, o.value.priority]
          ])
        ]),
        h("td", null, [
          _e(h("input", {
            "onUpdate:modelValue": f[3] || (f[3] = (m) => o.value.limit = m),
            type: "number",
            min: "0",
            "aria-label": "At once, 0 for no limit",
            "data-class-limit": ""
          }, null, 512), [
            [
              Ke,
              o.value.limit,
              void 0,
              { number: !0 }
            ]
          ])
        ]),
        h("td", sS, [
          h("button", {
            type: "button",
            disabled: e.saving,
            "data-class-save": "",
            onClick: u
          }, "Save", 8, oS),
          h("button", {
            type: "button",
            disabled: e.saving,
            onClick: f[4] || (f[4] = (m) => s.value = !1)
          }, "Cancel", 8, lS)
        ])
      ], 64)) : (r(), d(B, { key: 1 }, [
        h("td", null, v(e.entry.lane), 1),
        h("td", null, v(e.entry.cost), 1),
        h("td", null, v(e.entry.priority), 1),
        h("td", null, v(e.entry.limit || "no limit"), 1),
        h("td", iS, [
          h("span", {
            class: Y(["origin", { own: e.entry.origin !== "built-in" }])
          }, v(l[e.entry.origin]), 3),
          h("button", {
            type: "button",
            disabled: e.saving,
            "data-class-edit": "",
            onClick: i
          }, "Edit", 8, rS),
          e.entry.origin === "changed" ? (r(), d("button", {
            key: 0,
            type: "button",
            disabled: e.saving,
            "data-class-reset": "",
            onClick: f[5] || (f[5] = (m) => a("send", ["queue-class", "reset", e.entry.name]))
          }, "Reset", 8, uS)) : k("", !0),
          e.entry.origin === "your own" ? (r(), d("button", {
            key: 1,
            type: "button",
            disabled: e.saving,
            "data-class-remove": "",
            onClick: f[6] || (f[6] = (m) => a("send", ["queue-class", "remove", e.entry.name]))
          }, "Remove", 8, cS)) : k("", !0)
        ])
      ], 64))
    ], 8, Z3));
  }
}, fS = /* @__PURE__ */ H(dS, [["__scopeId", "data-v-e51b4825"]]), mS = { class: "fields" }, hS = ["disabled"], pS = ["disabled"], vS = ["value"], gS = ["value"], yS = { class: "buttons" }, bS = ["disabled"], kS = ["disabled"], wS = {
  key: 0,
  class: "preview",
  "data-class-preview-lines": ""
}, $S = { key: 1 }, xS = {
  key: 1,
  class: "hint"
}, SS = {
  key: 2,
  class: "failure",
  role: "alert"
}, _S = {
  __name: "ExecutionClassForm",
  props: { read: { type: Function, required: !0 }, saving: Boolean },
  emits: ["send"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _({ name: "", pattern: "", plugin: "", lane: "long", cost: 1, priority: "normal", limit: 0 }), o = _(null), l = _(""), i = x(() => s.value.pattern ? ["--pattern", s.value.pattern] : s.value.plugin ? ["--plugin", s.value.plugin] : []);
    me(() => [s.value.pattern, s.value.plugin], () => o.value = null);
    async function u() {
      const f = await n.read(["queue-class", "preview", ...i.value]);
      l.value = f.ok ? "" : f.error, o.value = f.ok ? f.value.lines : null;
    }
    function c() {
      a("send", ["queue-class", "add", s.value.name, ...i.value, ...wu(s.value)], () => {
        s.value = { ...s.value, name: "", pattern: "", plugin: "" };
      });
    }
    return (f, m) => (r(), d("form", {
      class: "add",
      "data-class-form": "",
      onSubmit: ke(c, ["prevent"])
    }, [
      h("div", mS, [
        h("label", null, [
          m[7] || (m[7] = U("Name", -1)),
          _e(h("input", {
            "onUpdate:modelValue": m[0] || (m[0] = (p) => s.value.name = p),
            required: "",
            "data-class-name": ""
          }, null, 512), [
            [
              Ke,
              s.value.name,
              void 0,
              { trim: !0 }
            ]
          ])
        ]),
        h("label", null, [
          m[8] || (m[8] = U("Line pattern", -1)),
          _e(h("input", {
            "onUpdate:modelValue": m[1] || (m[1] = (p) => s.value.pattern = p),
            placeholder: "for example ^npm run e2e",
            disabled: !!s.value.plugin,
            "data-class-pattern": ""
          }, null, 8, hS), [
            [Ke, s.value.pattern]
          ])
        ]),
        h("label", null, [
          m[9] || (m[9] = U("Or plugin", -1)),
          _e(h("input", {
            "onUpdate:modelValue": m[2] || (m[2] = (p) => s.value.plugin = p),
            disabled: !!s.value.pattern,
            "data-class-plugin": ""
          }, null, 8, pS), [
            [
              Ke,
              s.value.plugin,
              void 0,
              { trim: !0 }
            ]
          ])
        ]),
        h("label", null, [
          m[10] || (m[10] = U("Lane", -1)),
          _e(h("select", {
            "onUpdate:modelValue": m[3] || (m[3] = (p) => s.value.lane = p)
          }, [
            (r(!0), d(B, null, X(I(bu), (p) => (r(), d("option", {
              key: p,
              value: p
            }, v(p), 9, vS))), 128))
          ], 512), [
            [It, s.value.lane]
          ])
        ]),
        h("label", null, [
          m[11] || (m[11] = U("Slot units", -1)),
          _e(h("input", {
            "onUpdate:modelValue": m[4] || (m[4] = (p) => s.value.cost = p),
            type: "number",
            min: "0"
          }, null, 512), [
            [
              Ke,
              s.value.cost,
              void 0,
              { number: !0 }
            ]
          ])
        ]),
        h("label", null, [
          m[12] || (m[12] = U("Priority", -1)),
          _e(h("select", {
            "onUpdate:modelValue": m[5] || (m[5] = (p) => s.value.priority = p)
          }, [
            (r(!0), d(B, null, X(I(ku), (p) => (r(), d("option", {
              key: p,
              value: p
            }, v(p), 9, gS))), 128))
          ], 512), [
            [It, s.value.priority]
          ])
        ]),
        h("label", null, [
          m[13] || (m[13] = U("At once", -1)),
          _e(h("input", {
            "onUpdate:modelValue": m[6] || (m[6] = (p) => s.value.limit = p),
            type: "number",
            min: "0",
            title: "0 for no limit"
          }, null, 512), [
            [
              Ke,
              s.value.limit,
              void 0,
              { number: !0 }
            ]
          ])
        ])
      ]),
      h("div", yS, [
        h("button", {
          type: "button",
          disabled: !i.value.length,
          "data-class-preview": "",
          onClick: u
        }, "Show matching lines", 8, bS),
        h("button", {
          type: "submit",
          disabled: e.saving || o.value === null || !s.value.name,
          "data-class-add": ""
        }, "Add class", 8, kS)
      ]),
      o.value !== null ? (r(), d("div", wS, [
        o.value.length ? (r(), d(B, { key: 0 }, [
          h("p", null, v(o.value.length) + " recent lines would have matched:", 1),
          (r(!0), d(B, null, X(o.value, (p) => (r(), d("code", { key: p }, v(p), 1))), 128))
        ], 64)) : (r(), d("p", $S, "No recent line would have matched."))
      ])) : i.value.length ? (r(), d("p", xS, "See which recent lines the class would match before you add it.")) : k("", !0),
      l.value ? (r(), d("p", SS, v(l.value), 1)) : k("", !0)
    ], 32));
  }
}, MS = /* @__PURE__ */ H(_S, [["__scopeId", "data-v-f15e19ad"]]), CS = { "data-execution-classes": "" }, AS = ["for"], ES = ["id", "value", "disabled", "data-lane-setting", "onChange"], OS = { class: "control presets" }, TS = ["disabled", "data-class-preset", "onClick"], IS = { class: "scroll" }, BS = { "data-class-table": "" }, RS = {
  key: 1,
  class: "failure",
  role: "alert",
  "data-class-failure": ""
}, LS = {
  __name: "ExecutionClasses",
  props: { read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = _(null), a = _(""), s = _(!1);
    async function o() {
      const i = await t.read(["queue-class", "list"]);
      i.ok ? n.value = i.value : a.value = i.error;
    }
    async function l(i, u = () => {
    }) {
      if (s.value) return;
      s.value = !0;
      const c = await t.read(i);
      a.value = c.ok ? "" : c.error, s.value = !1, c.ok && (u(), await o());
    }
    return Ce(o), (i, u) => (r(), d("section", CS, [
      A(Lt, { icon: "gauge" }, {
        default: q(() => [...u[0] || (u[0] = [
          U("Execution classes", -1)
        ])]),
        _: 1
      }),
      u[3] || (u[3] = h("p", { class: "lead" }, "Each run the journal starts belongs to a class, which says its lane, how many slot units it takes and its priority.", -1)),
      n.value ? (r(), d(B, { key: 0 }, [
        (r(!0), d(B, null, X(n.value.settings, (c) => (r(), d("div", {
          key: c.key,
          class: "control"
        }, [
          h("div", null, [
            h("label", {
              for: c.key
            }, v(c.title), 9, AS),
            h("p", null, v(c.description), 1)
          ]),
          h("input", {
            id: c.key,
            class: "number",
            type: "number",
            min: "1",
            value: c.value,
            disabled: s.value,
            "data-lane-setting": c.key,
            onChange: (f) => l(["setting", "set", c.key, f.target.value])
          }, null, 40, ES)
        ]))), 128)),
        h("div", OS, [
          u[1] || (u[1] = h("div", null, [
            h("label", null, "Size for this machine"),
            h("p", null, "Sets every lane's capacity from the number of processor cores.")
          ], -1)),
          (r(!0), d(B, null, X(I(J3), (c) => (r(), d("button", {
            key: c.name,
            type: "button",
            disabled: s.value,
            "data-class-preset": c.name,
            onClick: (f) => l(["queue-class", "preset", c.name])
          }, v(c.title), 9, TS))), 128))
        ]),
        h("div", IS, [
          h("table", BS, [
            u[2] || (u[2] = h("thead", null, [
              h("tr", null, [
                h("th", { scope: "col" }, "Class"),
                h("th", { scope: "col" }, "Lane"),
                h("th", { scope: "col" }, "Slot units"),
                h("th", { scope: "col" }, "Priority"),
                h("th", { scope: "col" }, "At once"),
                h("th", { scope: "col" }, [
                  h("span", { class: "hidden" }, "Actions")
                ])
              ])
            ], -1)),
            h("tbody", null, [
              (r(!0), d(B, null, X(n.value.classes, (c) => (r(), P(fS, {
                key: c.name,
                entry: c,
                saving: s.value,
                onSend: l
              }, null, 8, ["entry", "saving"]))), 128))
            ])
          ])
        ]),
        A(MS, {
          read: e.read,
          saving: s.value,
          onSend: l
        }, null, 8, ["read", "saving"])
      ], 64)) : k("", !0),
      a.value ? (r(), d("p", RS, v(a.value), 1)) : k("", !0)
    ]));
  }
}, NS = /* @__PURE__ */ H(LS, [["__scopeId", "data-v-f6def058"]]), qS = {
  class: "process-queue",
  "data-test-queue": ""
}, DS = {
  key: 0,
  class: "lead"
}, PS = { class: "scroll" }, jS = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, FS = ["data-queue-empty"], fs = 20, WS = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 }, agent: { type: Number, default: 0 } },
  setup(e) {
    const t = e, n = x(() => t.agent ? ["--agent", `row:${t.agent}`] : []), a = _(null), s = _(""), o = _([]), l = _(fs), i = x(() => {
      var y, b;
      return (((y = a.value) == null ? void 0 : y.recent_total) ?? 0) > (((b = a.value) == null ? void 0 : b.recent.length) ?? 0);
    });
    let u = 0;
    const c = x(() => a.value ? [
      { type: "running", heading: "Running", icon: "start", rows: a.value.running, empty: "Nothing is running." },
      { type: "waiting", heading: "Waiting", icon: "clock", rows: a.value.waiting, empty: "Nothing waits. A command that starts now gets a place at once." },
      { type: "recent", heading: "Finished", icon: "check", rows: a.value.recent, empty: "Nothing has run yet." }
    ].flatMap((b) => [
      { key: `band:${b.type}`, section: b },
      ...b.rows.length ? b.rows.map((w, M) => ({ key: `run:${w.id}`, run: w, position: M + 1 })) : [{ key: `none:${b.type}`, section: b, empty: !0 }]
    ]) : []);
    function f(y) {
      o.value = o.value.includes(y) ? o.value.filter((b) => b !== y) : [...o.value, y];
    }
    async function m() {
      const y = ++u, b = await t.read([...l.value === fs ? ["queue", "list"] : ["queue", "list", "--recent", String(l.value)], ...n.value]);
      y === u && (s.value = b.ok ? "" : b.error, b.ok && (a.value = b.value));
    }
    function p() {
      l.value += fs, m();
    }
    return On(["process.*", "setting.*"], m), Ce(m), (y, b) => (r(), d("article", qS, [
      e.agent ? k("", !0) : (r(), d("p", DS, "Commands from workers wait here for a free place. Reading and editing never wait.")),
      h("div", PS, [
        s.value ? (r(), d("p", jS, v(s.value), 1)) : k("", !0),
        a.value ? (r(), d(B, { key: 1 }, [
          e.agent ? k("", !0) : (r(), P(k3, {
            key: 0,
            queue: a.value,
            read: e.read,
            onSaved: m
          }, null, 8, ["queue", "read"])),
          a.value.execution && !e.agent ? (r(), P(X3, {
            key: 1,
            execution: a.value.execution
          }, null, 8, ["execution"])) : k("", !0),
          A(Hs, {
            name: "queue",
            tag: "div",
            class: "queue-list"
          }, {
            default: q(() => [
              (r(!0), d(B, null, X(c.value, (w) => (r(), d(B, {
                key: w.key
              }, [
                w.run ? (r(), P(q3, {
                  key: 0,
                  run: w.run,
                  environment: a.value.environment_name,
                  position: w.position,
                  read: e.read,
                  expanded: o.value.includes(w.run.id),
                  onToggle: (M) => f(w.run.id)
                }, null, 8, ["run", "environment", "position", "read", "expanded", "onToggle"])) : w.empty ? (r(), d("p", {
                  key: 1,
                  class: "empty",
                  "data-queue-empty": w.section.type
                }, v(w.section.empty), 9, FS)) : (r(), P(Lt, {
                  key: 2,
                  class: "sticky-band",
                  icon: w.section.icon,
                  count: w.section.rows.length,
                  "data-queue-heading": w.section.type
                }, {
                  default: q(() => [
                    U(v(w.section.heading), 1)
                  ]),
                  _: 2
                }, 1032, ["icon", "count", "data-queue-heading"]))
              ], 64))), 128))
            ]),
            _: 1
          }),
          i.value ? (r(), d("button", {
            key: 2,
            type: "button",
            class: "older",
            "data-queue-older": "",
            onClick: p
          }, "Show older commands")) : k("", !0),
          e.agent ? k("", !0) : (r(), P(NS, {
            key: 3,
            read: e.read
          }, null, 8, ["read"]))
        ], 64)) : s.value ? k("", !0) : (r(), P(Ze, { key: 2 }))
      ])
    ]));
  }
}, qO = /* @__PURE__ */ H(WS, [["__scopeId", "data-v-a016178b"]]), HS = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, zS = ["aria-expanded"], US = {
  class: "links-count",
  "data-inspector-links-count": ""
}, VS = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, GS = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, KS = {
  __name: "InspectorLinks",
  props: {
    model: { type: String, required: !0 },
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    documentId: { type: Number, default: 0 },
    categories: { type: Array, default: () => [] },
    open: Boolean,
    outsidePlan: Boolean,
    pageSize: { type: Number, default: 10 }
  },
  emits: ["open"],
  setup(e) {
    const t = e, n = _(t.open), a = _(0), s = _(0), o = _("");
    let l = 0;
    async function i() {
      const u = ++l, c = ["link", "list", "--row", `${t.model}:${t.id}`, "--group-counterparts", ...t.outsidePlan ? ["--outside-plan"] : [], "--page-size", "1"], f = await t.read(c);
      u === l && (o.value = f.ok ? "" : f.error, f.ok && (a.value = f.value.total), s.value += 1);
    }
    return me(() => `${t.model}:${t.id}`, () => {
      n.value = t.open, a.value = 0, i();
    }, { immediate: !0 }), On(["link.*", "phase.*", "phase_task.*"], i), (u, c) => (r(), d(B, null, [
      a.value ? (r(), d("section", HS, [
        h("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (f) => n.value = !n.value)
        }, [
          c[2] || (c[2] = h("span", { class: "links-label" }, "Links", -1)),
          h("span", US, v(a.value), 1),
          A(tn, { open: n.value }, null, 8, ["open"])
        ], 8, zS),
        h("div", {
          class: Y(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (r(), d("div", VS, [
            A(Ed, {
              pinned: "",
              model: e.model,
              id: e.id,
              "document-id": e.documentId,
              read: e.read,
              changes: s.value,
              "outside-plan": e.outsidePlan,
              "page-size": e.pageSize,
              "only-kinds": e.categories,
              "link-attribute": "data-inspector-link",
              onOpen: c[1] || (c[1] = (f) => u.$emit("open", f))
            }, null, 8, ["model", "id", "document-id", "read", "changes", "outside-plan", "page-size", "only-kinds"])
          ])) : k("", !0)
        ], 2)
      ])) : k("", !0),
      o.value ? (r(), d("p", GS, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, $u = /* @__PURE__ */ H(KS, [["__scopeId", "data-v-a4550728"]]), YS = ["placeholder"], QS = { class: "actions" }, XS = { class: "error" }, JS = {
  key: 1,
  class: "card closed"
}, ZS = { class: "mark" }, e6 = { class: "prompt" }, t6 = {
  key: 0,
  class: "draft"
}, n6 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Tt({
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
  emits: /* @__PURE__ */ Tt(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = Gt(e, "draft"), l = Gt(e, "error"), i = _(!!l.value), u = _(!1), c = _(!1), f = _(null);
    async function m() {
      var b, w;
      i.value = !0, u.value = !1, await Fe(), (w = ((b = f.value) == null ? void 0 : b.querySelector("input")) || f.value) == null || w.focus();
    }
    function p() {
      i.value = !1, l.value = "";
    }
    async function y() {
      const b = o.value.trim();
      if (!(!b || !a.ready || c.value)) {
        l.value = "", c.value = !0, o.value = "";
        try {
          await a.send(b), i.value = !1, u.value = !0;
        } catch (w) {
          o.value = b, l.value = w.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: m }), (b, w) => (r(), d("div", {
      class: Y(["comment-bar", { open: i.value }])
    }, [
      i.value ? (r(), d("form", {
        key: 0,
        class: "card compose",
        onSubmit: ke(y, ["prevent"]),
        onKeydown: Ot(p, ["esc"])
      }, [
        ae(b.$slots, "who", {}, void 0, !0),
        _e(h("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": w[0] || (w[0] = (M) => o.value = M),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: w[1] || (w[1] = Ot((M) => I(or)(M, y), ["enter"]))
        }, null, 40, YS), [
          [Ke, o.value]
        ]),
        h("div", QS, [
          h("span", XS, v(l.value), 1),
          A(ve, {
            small: "",
            onClick: p
          }, {
            default: q(() => [...w[3] || (w[3] = [
              U("Cancel", -1)
            ])]),
            _: 1
          }),
          A(ve, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: y
          }, {
            default: q(() => [...w[4] || (w[4] = [
              U("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (r(), d("div", JS, [
        h("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: m
        }, [
          h("span", ZS, [
            A(ie, {
              name: u.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          h("span", e6, v(u.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (r(), d("span", t6, "Draft kept")) : k("", !0)
        ]),
        e.count ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: w[2] || (w[2] = (M) => s("show"))
        }, [
          h("span", null, v(I(Td)(e.count, "comment")), 1),
          A(ie, {
            name: "down",
            size: 12
          })
        ])) : k("", !0)
      ]))
    ], 2));
  }
}, a6 = /* @__PURE__ */ H(n6, [["__scopeId", "data-v-b68baddd"]]), s6 = { wide: 1130 }, o6 = /\{([A-Za-z_]\w*)\}/g;
function sa(e, t, n = {}) {
  return e.replace(o6, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const l6 = (e, t, n, a) => sa(e.label, n, { row_id: a, id: a }) || V$(t, n, a), i6 = { class: "comment-side-head" }, r6 = {
  key: 0,
  class: "comment-none"
}, u6 = { key: 0 }, c6 = {
  key: 1,
  class: "comment-none"
}, d6 = {
  class: "comment",
  "data-comment": ""
}, f6 = {
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
    return (t, n) => (r(), d("aside", {
      class: Y(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      h("header", i6, [
        n[2] || (n[2] = h("h3", null, "Comments", -1)),
        A(xa, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (r(), d("p", r6, "No comments yet")) : k("", !0),
      (r(!0), d(B, null, X(e.comments, (a) => (r(), d("section", {
        key: a.id
      }, [
        a.quote ? (r(), d("blockquote", u6, v(a.quote), 1)) : k("", !0),
        a.revision ? (r(), d("span", c6, "Revision " + v(a.revision), 1)) : k("", !0),
        h("p", d6, v(e.words(a)), 1)
      ]))), 128)),
      A(_n, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, zl = /* @__PURE__ */ H(f6, [["__scopeId", "data-v-276284a3"]]), m6 = { class: "resource-heading" }, h6 = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, p6 = {
  key: 1,
  class: "resource-abstract"
}, v6 = {
  __name: "ResourceHeading",
  props: { title: String, abstract: String },
  setup(e) {
    return (t, n) => (r(), d("div", m6, [
      e.title ? (r(), d("h2", h6, v(e.title), 1)) : k("", !0),
      e.abstract ? (r(), d("p", p6, v(e.abstract), 1)) : k("", !0)
    ]));
  }
}, xu = /* @__PURE__ */ H(v6, [["__scopeId", "data-v-d65ef53f"]]), g6 = {
  class: "inspector-head",
  "data-inspector-head": ""
}, y6 = { class: "inspector-icons" }, b6 = { class: "inspector-icons-start" }, k6 = {
  key: 0,
  class: "inspector-band-title",
  "data-resource-title": ""
}, w6 = {
  key: 1,
  class: "inspector-label",
  "data-resource-type": ""
}, $6 = { class: "inspector-icons-end" }, x6 = ["href"], S6 = {
  __name: "InspectorHead",
  props: {
    label: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    backed: Boolean,
    stepped: Boolean,
    embedded: Boolean,
    shareable: Boolean,
    readOnly: Boolean,
    opened: { type: Object, required: !0 }
  },
  emits: ["close", "back", "step"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(() => `${n.opened.table}:${n.opened.id}`), o = x(() => n.shareable && !n.readOnly), l = x(() => !n.label && !!n.title), i = x(() => n.backed ? "Close all rows" : "Close");
    return (u, c) => (r(), d("header", g6, [
      h("div", y6, [
        h("span", b6, [
          e.backed ? (r(), P(ve, {
            key: 0,
            variant: "icon",
            title: "Back",
            "aria-label": "Back",
            "data-resource-back": "",
            onClick: c[0] || (c[0] = (f) => a("back"))
          }, {
            default: q(() => [
              A(ie, {
                name: "back",
                size: 13
              })
            ]),
            _: 1
          })) : k("", !0),
          e.stepped ? (r(), d(B, { key: 1 }, [
            A(ve, {
              variant: "icon",
              title: "Previous",
              "aria-label": "Previous",
              "data-inspector-step": "previous",
              onClick: c[1] || (c[1] = (f) => a("step", -1))
            }, {
              default: q(() => [
                A(ie, {
                  name: "up",
                  size: 13
                })
              ]),
              _: 1
            }),
            A(ve, {
              variant: "icon",
              title: "Next",
              "aria-label": "Next",
              "data-inspector-step": "next",
              onClick: c[2] || (c[2] = (f) => a("step", 1))
            }, {
              default: q(() => [
                A(ie, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : k("", !0)
        ]),
        l.value ? (r(), d("h2", k6, v(e.title), 1)) : (r(), d("p", w6, v(e.label), 1)),
        h("span", $6, [
          e.embedded ? (r(), P(ve, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: c[3] || (c[3] = (f) => I(Pe)(s.value))
          }, {
            default: q(() => [
              A(ie, {
                name: "open",
                size: 13
              })
            ]),
            _: 1
          })) : k("", !0),
          o.value ? (r(), d("a", {
            key: 1,
            class: "inspector-share",
            title: "Share this link",
            "aria-label": "Share this link",
            "data-resource-share": "",
            href: I(Bm)(s.value)
          }, [
            A(ie, {
              name: "share",
              size: 13
            })
          ], 8, x6)) : k("", !0),
          e.embedded ? k("", !0) : (r(), P(ve, {
            key: 2,
            variant: "icon",
            title: i.value,
            "aria-label": i.value,
            "data-resource-close": "",
            onClick: c[4] || (c[4] = (f) => a("close"))
          }, {
            default: q(() => [
              A(ie, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          }, 8, ["title", "aria-label"]))
        ])
      ]),
      A(xu, {
        title: l.value ? "" : e.title,
        abstract: e.description
      }, null, 8, ["title", "abstract"])
    ]));
  }
}, _6 = /* @__PURE__ */ H(S6, [["__scopeId", "data-v-f7878e15"]]), M6 = {
  class: "section field-grid",
  "data-resource-fields": ""
}, C6 = { class: "field-name" }, A6 = {
  key: 1,
  class: "field-value"
}, E6 = ["onClick"], O6 = {
  key: 2,
  class: "field-value"
}, T6 = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", M6, [
      (r(!0), d(B, null, X(e.fields, (o) => (r(), d(B, {
        key: o.name
      }, [
        h("p", C6, v(o.label), 1),
        o.isTime ? (r(), P(Je, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (r(), d("p", A6, [
          h("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, v(o.value), 9, E6)
        ])) : (r(), d("p", O6, v(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, Su = /* @__PURE__ */ H(T6, [["__scopeId", "data-v-7e45afb5"]]);
async function I6(e, t) {
  const n = t.creator_id ? ["--creator", String(t.creator_id)] : [], a = t.agent_id ? ["--owner", String(t.agent_id)] : [];
  if (!n.length && !a.length) return { creator: "", owner: "" };
  const s = await e(["agent", "people", ...n, ...a]);
  return s.ok ? { creator: G$(s.value.actor, s.value.creator_agent), owner: a.length ? K$(t, s.value.owner) : "" } : { creator: "", owner: "" };
}
const B6 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, R6 = {
  key: 1,
  class: "inspector-wait"
}, L6 = { class: "inspector-main" }, N6 = { class: "inspector-column" }, q6 = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, D6 = {
  class: "inspector-body",
  "data-inspector-body": ""
}, P6 = { class: "inspector-text" }, j6 = ["innerHTML"], F6 = {
  __name: "Inspector",
  props: {
    term: { type: String, required: !0 },
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    catalogue: { type: Object, required: !0 },
    environment: { type: String, required: !0 },
    table: { type: String, default: "" },
    readOnly: Boolean,
    backed: Boolean,
    stepped: Boolean,
    embedded: Boolean
  },
  emits: ["close", "back", "step", "open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(null);
    Ws(ci, x(() => {
      var F;
      return ((F = s.value) == null ? void 0 : F.$el) ?? null;
    }));
    const o = /* @__PURE__ */ new Set(["question", "memory", "rule"]), l = x(() => n.catalogue.inspector(n.term) ?? {
      reads: `${n.term} show {row_id}`,
      label: "",
      title: "{title}",
      description: "",
      width: "small",
      components: [],
      comments: !1,
      events: [],
      links: { categories: [], open: !1, excludes_plan: !1, page_size: 10 },
      shareable: !1,
      lists_fields: !0,
      draws_text: !1
    }), i = _(null), u = _(""), c = _(""), f = _(""), m = _("details"), p = _(null), y = _(0);
    let b = 0;
    const w = x(() => ({ row_id: n.id, id: n.id })), M = x(() => i.value ? sa(l.value.title, i.value, w.value) || U$(n.term, i.value, n.id) : ""), C = x(() => i.value ? l6(l.value, n.term, i.value, n.id) : ""), T = x(() => C.value === M.value ? "" : C.value), z = x(() => i.value ? sa(l.value.description, i.value, w.value) : ""), W = x(() => {
      var F, V, Z;
      return ((F = i.value) == null ? void 0 : F.body) || ((V = i.value) == null ? void 0 : V.brief) || (o.has(n.term) ? (Z = i.value) == null ? void 0 : Z.text : "") || "";
    }), R = x(() => W.value ? ro(W.value, { env: "", rowNames: !1 }) : ""), G = x(() => Y$(i.value, W.value, u.value, c.value)), D = x(() => l.value.comments && y.value >= s6.wide), E = x(() => l.value.comments && !D.value), N = (F) => l.value.components.filter((V) => (V.tab || "") === F).map((V) => V.window), j = x(() => [...new Set(l.value.components.map((F) => F.tab).filter(Boolean))]), $ = x(() => j.value.length || E.value ? [{ key: "details", label: "Details" }, ...j.value.map((F) => ({ key: F, label: F })), ...E.value ? [{ key: "comments", label: "Comments" }] : []] : []), g = x(() => {
      const F = l.value.links;
      return F ? { categories: F.categories, open: F.open, outsidePlan: F.excludes_plan, pageSize: F.page_size } : null;
    }), S = fr(() => l.value.comments && i.value ? { term: n.term, id: n.id, title: i.value.title } : {}, (F) => n.read(F));
    async function O() {
      const F = ++b, V = await n.read(sa(l.value.reads, null, w.value).split(/\s+/).filter(Boolean));
      if (F !== b || (f.value = V.ok ? "" : V.error, !V.ok)) return;
      i.value = V.value;
      const Z = await I6(n.read, i.value);
      F === b && (u.value = Z.creator, c.value = Z.owner);
    }
    me(() => `${n.term}:${n.id}`, () => {
      i.value = null, u.value = "", c.value = "", f.value = "", m.value = "details", O();
    }, { immediate: !0 }), On(l.value.events, O), me(S.open, (F) => F && E.value && (m.value = "comments"));
    let L = null;
    return Ce(() => {
      var F;
      y.value = ((F = p.value) == null ? void 0 : F.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (L = new ResizeObserver(() => y.value = p.value.clientWidth), L.observe(p.value));
    }), Le(() => L == null ? void 0 : L.disconnect()), (F, V) => (r(), d("aside", {
      ref_key: "root",
      ref: p,
      class: "inspector",
      "data-inspector": ""
    }, [
      A(_6, {
        label: T.value,
        title: M.value,
        description: z.value,
        backed: e.backed,
        stepped: e.stepped,
        embedded: e.embedded,
        shareable: l.value.shareable,
        "read-only": e.readOnly,
        opened: { table: e.table || `${e.term}s`, id: e.id },
        onClose: V[0] || (V[0] = (Z) => a("close")),
        onBack: V[1] || (V[1] = (Z) => a("back")),
        onStep: V[2] || (V[2] = (Z) => a("step", Z))
      }, null, 8, ["label", "title", "description", "backed", "stepped", "embedded", "shareable", "read-only", "opened"]),
      f.value ? (r(), d("p", B6, v(f.value), 1)) : i.value ? (r(), d(B, { key: 2 }, [
        A(Os, {
          ref_key: "actionBar",
          ref: s
        }, {
          default: q(() => [
            A(oo, {
              name: `row.${e.term}`,
              row: { ...i.value, id: e.id, term: e.term },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: O
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }, 512),
        h("div", L6, [
          h("div", N6, [
            $.value.length ? (r(), d("div", q6, [
              A(Bt, {
                options: $.value,
                value: m.value,
                onPick: V[3] || (V[3] = (Z) => m.value = Z)
              }, null, 8, ["options", "value"])
            ])) : k("", !0),
            h("div", D6, [
              A(Jt, { value: m.value }, {
                details: q(() => [
                  h("div", P6, [
                    R.value && !l.value.draws_text ? (r(), d("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: R.value
                    }, null, 8, j6)) : k("", !0),
                    l.value.lists_fields ? (r(), P(Su, {
                      key: 1,
                      fields: G.value,
                      onPeek: V[4] || (V[4] = (Z) => a("open", Z))
                    }, null, 8, ["fields"])) : k("", !0)
                  ]),
                  A(As, {
                    "slot-name": `inspector.${e.term}`,
                    names: N(""),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: q(() => [
                  A(zl, {
                    below: "",
                    comments: I(S).comments.value,
                    words: I(S).words,
                    more: !!I(S).nextPage.value,
                    loading: I(S).loading.value,
                    failure: I(S).failure.value,
                    onMore: I(S).loadMore,
                    onClose: V[5] || (V[5] = (Z) => m.value = "details")
                  }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
                ]),
                default: q(() => [
                  A(As, {
                    names: N(m.value),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              g.value ? (r(), P($u, je({
                key: 0,
                model: e.term,
                id: e.id,
                read: e.read
              }, g.value, {
                onOpen: V[6] || (V[6] = (Z) => a("open", Z))
              }), null, 16, ["model", "id", "read"])) : k("", !0)
            ]),
            l.value.comments ? (r(), P(a6, {
              key: 1,
              send: I(S).send,
              count: I(S).total.value,
              onShow: V[7] || (V[7] = (Z) => E.value && (m.value = "comments"))
            }, null, 8, ["send", "count"])) : k("", !0)
          ]),
          D.value ? (r(), P(zl, {
            key: 0,
            comments: I(S).comments.value,
            words: I(S).words,
            more: !!I(S).nextPage.value,
            loading: I(S).loading.value,
            failure: I(S).failure.value,
            onMore: I(S).loadMore,
            onClose: () => {
            }
          }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])) : k("", !0)
        ])
      ], 64)) : (r(), d("div", R6, [
        A(Ze)
      ]))
    ], 512));
  }
}, W6 = /* @__PURE__ */ H(F6, [["__scopeId", "data-v-60363e95"]]), DO = {
  __name: "HostedInspector",
  props: {
    term: { type: String, required: !0 },
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    environment: { type: String, required: !0 },
    stepped: Boolean,
    embedded: Boolean,
    readOnly: Boolean
  },
  emits: ["step", "open", "close", "back"],
  setup(e) {
    const t = Me(eo);
    return (n, a) => (r(), P(W6, je(n.$props, {
      catalogue: I(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, H6 = { class: "facts" }, z6 = { class: "fact wide" }, U6 = ["title"], V6 = {
  key: 1,
  class: "fact-value"
}, G6 = {
  key: 0,
  class: "fact"
}, K6 = { class: "fact-value" }, Y6 = { class: "fact" }, Q6 = { class: "fact-label" }, X6 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, J6 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, Z6 = {
  key: 2,
  class: "fact"
}, e_ = { class: "fact-value" }, t_ = { class: "fact wide" }, n_ = { class: "fact-label" }, a_ = { class: "fact wide" }, s_ = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, o_ = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = da.map(({ key: l, label: i }) => ({ key: String(l), label: i })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, i) => {
      var u, c;
      return r(), d("div", H6, [
        h("div", z6, [
          i[4] || (i[4] = h("span", { class: "fact-label" }, "Plan", -1)),
          (u = e.place) != null && u.plan_id ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: i[0] || (i[0] = (f) => I(Pe)(`plans:${e.place.plan_id}`))
          }, "Plan " + v(e.place.plan_id) + ": " + v(e.place.plan_title), 9, U6)) : (r(), d("span", V6, "Not in a plan"))
        ]),
        ((c = e.place) == null ? void 0 : c.phase_total) > 1 ? (r(), d("div", G6, [
          i[5] || (i[5] = h("span", { class: "fact-label" }, "Phase", -1)),
          h("span", K6, v(e.place.phase_number) + " of " + v(e.place.phase_total) + ": " + v(e.place.phase_title), 1)
        ])) : k("", !0),
        e.task.helper_id ? (r(), d(B, { key: 1 }, [
          h("div", Y6, [
            h("span", Q6, v(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            A(vn, {
              as: "button",
              "agent-id": e.task.helper_id,
              label: I(fo)(e.task.helper_name, e.task.helper_main),
              class: "fact-value agent-link",
              "data-task-agent": "",
              onClick: i[1] || (i[1] = (f) => I(Pe)(`agents:${e.task.helper_id}`))
            }, {
              default: q(() => [
                A(Ut, {
                  name: e.task.helper_name,
                  main: e.task.helper_main
                }, null, 8, ["name", "main"])
              ]),
              _: 1
            }, 8, ["agent-id", "label"])
          ]),
          I(o).has(e.task.state) && e.task.holder_id ? (r(), d("p", X6, [
            A(Ut, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[6] || (i[6] = U(" holds it: merging its work finishes it, and releasing the worker opens it again.", -1))
          ])) : e.task.state === "open" ? (r(), d("p", J6, [
            A(Ut, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[7] || (i[7] = U(" takes it after the task it is on.", -1))
          ])) : k("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (r(), d("div", Z6, [
          i[8] || (i[8] = h("span", { class: "fact-label" }, "Assigned to", -1)),
          h("span", e_, "Agent " + v(e.task.holder_id), 1)
        ])) : k("", !0),
        h("div", t_, [
          h("span", n_, [
            i[9] || (i[9] = U(" Complexity ", -1)),
            A(wi, {
              lines: I(br).map((f, m) => `${m + 1}: ${f}`),
              label: "What the scores mean"
            }, null, 8, ["lines"])
          ]),
          A(Bt, {
            options: I(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: i[2] || (i[2] = (f) => s("complexity", f))
          }, null, 8, ["options", "value"])
        ]),
        h("div", a_, [
          i[10] || (i[10] = h("span", { class: "fact-label" }, "Priority", -1)),
          A(Bt, {
            options: I(n),
            value: String(I(yr)(e.task.priority)),
            "data-task-priority": "",
            onPick: i[3] || (i[3] = (f) => s("priority", f))
          }, null, 8, ["options", "value"]),
          e.refusal ? (r(), d("p", s_, v(e.refusal), 1)) : k("", !0)
        ])
      ]);
    };
  }
}, l_ = /* @__PURE__ */ H(o_, [["__scopeId", "data-v-4bf27961"]]);
function i_(e, t) {
  const n = new Map(t.tasks.map((u) => [u.id, u])), a = (u) => t.edges.filter(([, c]) => c === u).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let u = a(e); u.length; u = [...new Set(u.flatMap(a))].filter((c) => !s.has(c)))
    u.forEach((c) => s.add(c)), o.push(u.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let u = t.edges.find(([c]) => c === e); u && !i.has(u[1]); u = t.edges.find(([c]) => c === u[1]))
    i.add(u[1]), l.push(n.get(u[1]));
  return { above: o.reverse(), below: l };
}
const r_ = { class: "number" }, u_ = { class: "title" }, c_ = { class: "word" }, d_ = {
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
    return (a, s) => (r(), P(Qe(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: Y(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: q(() => [
        A(_a, { status: e.status }, null, 8, ["status"]),
        h("span", r_, v(e.number), 1),
        h("span", u_, v(e.title), 1),
        h("span", c_, v(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, ms = /* @__PURE__ */ H(d_, [["__scopeId", "data-v-f6417ae8"]]), f_ = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, m_ = { class: "level" }, h_ = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1);
    me(() => n.task.id, () => s.value = !1);
    const o = x(() => i_(n.task.id, n.graph)), l = x(() => s.value ? o.value.above : o.value.above.slice(-1)), i = x(() => s.value ? o.value.below : o.value.below.slice(0, 1)), u = x(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (m) => m.slice(0, 1).toUpperCase() + m.slice(1), f = (m, p = !1) => ({ status: gn(m.state), number: m.id, title: m.title, word: p ? "This task" : c(m.state), current: p });
    return (m, p) => o.value.above.length || o.value.below.length ? (r(), d("section", f_, [
      p[5] || (p[5] = h("h4", null, "What waits on what", -1)),
      (r(!0), d(B, null, X(l.value, (y) => (r(), d(B, {
        key: y.map((b) => b.id).join()
      }, [
        h("div", m_, [
          (r(!0), d(B, null, X(y, (b) => (r(), P(ms, je({
            key: b.id,
            ref_for: !0
          }, f(b), {
            onSelect: p[0] || (p[0] = (w) => a("select", w))
          }), null, 16))), 128))
        ]),
        p[3] || (p[3] = h("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      A(ms, ps(Ql(f(e.task, !0))), null, 16),
      (r(!0), d(B, null, X(i.value, (y) => (r(), d(B, {
        key: y.id
      }, [
        p[4] || (p[4] = h("div", { class: "waits" }, "↓ waits on", -1)),
        A(ms, je({ ref_for: !0 }, f(y), {
          onSelect: p[1] || (p[1] = (b) => a("select", b))
        }), null, 16)
      ], 64))), 128)),
      u.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: p[2] || (p[2] = (y) => s.value = !s.value)
      }, v(s.value ? "Show less" : `Show the whole chain (${u.value} more)`), 1)) : k("", !0)
    ])) : k("", !0);
  }
}, p_ = /* @__PURE__ */ H(h_, [["__scopeId", "data-v-79c52417"]]), v_ = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, g_ = ["datetime"], y_ = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (r(), d("section", v_, [
      n[0] || (n[0] = h("h3", null, "Block history", -1)),
      (r(!0), d(B, null, X(e.renewals, (a) => (r(), d("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        h("time", {
          datetime: a.created_at
        }, v(new Date(a.created_at).toLocaleString()), 9, g_),
        h("p", null, v(a.reason), 1)
      ]))), 128))
    ])) : k("", !0);
  }
}, b_ = /* @__PURE__ */ H(y_, [["__scopeId", "data-v-b41f213b"]]), k_ = {
  class: "part",
  "data-resource-waits": ""
}, w_ = ["onClick"], $_ = { class: "wait-id" }, x_ = { class: "wait-title" }, S_ = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", k_, [
      h("h4", null, v(e.title), 1),
      (r(!0), d(B, null, X(e.waits, (o) => (r(), d("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        A(_a, {
          status: I(gn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        h("span", $_, v(o.id), 1),
        h("span", x_, v(o.title), 1)
      ], 8, w_))), 128))
    ]));
  }
}, Ul = /* @__PURE__ */ H(S_, [["__scopeId", "data-v-8fb2e251"]]), __ = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, M_ = { class: "text" }, C_ = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, A_ = 180, E_ = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = _(!1), l = x(() => a.task.waits.filter((u) => !n.has(u.state))), i = x(() => a.task.waits.filter((u) => n.has(u.state)));
    return (u, c) => (r(), d(B, null, [
      l.value.length ? (r(), P(Ul, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0),
      e.task.state === "completed" && e.task.outcome ? (r(), d("section", __, [
        c[3] || (c[3] = h("h4", null, "How it was done", -1)),
        h("p", M_, v(e.task.outcome), 1)
      ])) : k("", !0),
      e.task.brief ? (r(), d("section", C_, [
        c[4] || (c[4] = h("h4", null, "The brief", -1)),
        h("p", {
          class: Y(["text", { clamped: !o.value }])
        }, v(e.task.brief), 3),
        e.task.brief.length > A_ && !o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (f) => o.value = !0)
        }, "Show the whole brief")) : k("", !0)
      ])) : k("", !0),
      i.value.length ? (r(), P(Ul, {
        key: 3,
        title: "Waited on",
        waits: i.value,
        onSelect: c[2] || (c[2] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0)
    ], 64));
  }
}, O_ = /* @__PURE__ */ H(E_, [["__scopeId", "data-v-4a3f1e79"]]), T_ = {
  class: "task-details",
  "data-task-details": ""
}, I_ = { class: "since" }, B_ = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, R_ = { class: "text" }, L_ = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, N_ = {
  key: 1,
  class: "note"
}, q_ = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, D_ = { class: "text" }, P_ = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return r(), d("div", T_, [
        h("div", {
          class: Y(["state-line", I(gn)(e.task.state)])
        }, [
          h("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            A(_a, {
              status: I(gn)(e.task.state)
            }, null, 8, ["status"]),
            U(" " + v(a(e.task.state)), 1)
          ]),
          h("span", I_, [
            o[5] || (o[5] = U(" since ", -1)),
            A(Je, {
              at: I(dh)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (r(), d("section", B_, [
          o[6] || (o[6] = h("span", { class: "label" }, "Blocked, waiting on", -1)),
          h("p", R_, v(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (r(), d("p", L_, "Opens by itself when " + v(e.task.openers.join(" or ")) + ".", 1)) : (r(), d("p", N_, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (r(), d("section", q_, [
          o[7] || (o[7] = h("span", { class: "label" }, "Why it was cancelled", -1)),
          h("p", D_, v(e.task.reason), 1)
        ])) : k("", !0),
        e.graph ? (r(), P(p_, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : k("", !0),
        A(l_, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        A(O_, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        A(b_, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, PO = /* @__PURE__ */ H(P_, [["__scopeId", "data-v-7e73fa21"]]), j_ = 50, F_ = { messages: 25 }, W_ = (e) => F_[e] || j_, H_ = {
  class: "task-log",
  "aria-label": "Task log"
}, z_ = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, U_ = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, V_ = { class: "entries" }, G_ = ["data-task-log-important"], K_ = ["datetime"], Y_ = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, Q_ = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = _([]), a = _(1), s = _(!0), o = _(!0), l = _("");
    let i = 0;
    async function u(c = 1) {
      const f = ++i;
      a.value = c, o.value = !0, l.value = "";
      const m = await t.read([
        "task-log",
        "list",
        "--task",
        String(t.id),
        "--limit",
        String(W_("task_logs")),
        "--page",
        String(c)
      ]);
      f === i && (o.value = !1, l.value = m.ok ? "" : m.error, m.ok && (n.value = m.value.rows, s.value = m.value.is_last_page));
    }
    return me(
      () => [t.id, t.changes],
      () => {
        n.value = [], u();
      },
      { immediate: !0 }
    ), st(() => {
      i += 1;
    }), (c, f) => (r(), d("section", H_, [
      o.value ? (r(), P(Ze, { key: 0 })) : l.value ? (r(), d(B, { key: 1 }, [
        h("p", z_, v(l.value), 1),
        A(ve, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: f[0] || (f[0] = (m) => u(a.value))
        }, {
          default: q(() => [...f[3] || (f[3] = [
            U("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (r(), d(B, { key: 2 }, [
        n.value.length ? k("", !0) : (r(), d("p", U_, "No log entries yet.")),
        h("ol", V_, [
          (r(!0), d(B, null, X(n.value, (m) => (r(), d("li", {
            key: m.id,
            class: Y(["entry", { important: m.important }]),
            "data-task-log": "",
            "data-task-log-important": m.important ? "" : null
          }, [
            h("time", {
              datetime: m.created_at
            }, v(new Date(m.created_at).toLocaleString()), 9, K_),
            h("p", null, v(m.line), 1)
          ], 10, G_))), 128))
        ]),
        a.value > 1 || !s.value ? (r(), d("nav", Y_, [
          A(ve, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: f[1] || (f[1] = (m) => u(a.value - 1))
          }, {
            default: q(() => [...f[4] || (f[4] = [
              U("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          h("span", null, "Page " + v(a.value), 1),
          A(ve, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: f[2] || (f[2] = (m) => u(a.value + 1))
          }, {
            default: q(() => [...f[5] || (f[5] = [
              U("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : k("", !0)
      ], 64))
    ]));
  }
}, jO = /* @__PURE__ */ H(Q_, [["__scopeId", "data-v-cfa43bf1"]]);
function X_(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var hs = { exports: {} }, Vl;
function J_() {
  return Vl || (Vl = 1, (function(e, t) {
    var n = (function() {
      var a = function(R, G) {
        var D = 236, E = 17, N = R, j = o[G], $ = null, g = 0, S = null, O = [], L = {}, F = function(J, ee) {
          g = N * 4 + 17, $ = (function(K) {
            for (var te = new Array(K), ne = 0; ne < K; ne += 1) {
              te[ne] = new Array(K);
              for (var se = 0; se < K; se += 1)
                te[ne][se] = null;
            }
            return te;
          })(g), V(0, 0), V(g - 7, 0), V(0, g - 7), ue(), le(), Oe(J, ee), N >= 7 && we(J), S == null && (S = Q(N, j, O)), be(S, ee);
        }, V = function(J, ee) {
          for (var K = -1; K <= 7; K += 1)
            if (!(J + K <= -1 || g <= J + K))
              for (var te = -1; te <= 7; te += 1)
                ee + te <= -1 || g <= ee + te || (0 <= K && K <= 6 && (te == 0 || te == 6) || 0 <= te && te <= 6 && (K == 0 || K == 6) || 2 <= K && K <= 4 && 2 <= te && te <= 4 ? $[J + K][ee + te] = !0 : $[J + K][ee + te] = !1);
        }, Z = function() {
          for (var J = 0, ee = 0, K = 0; K < 8; K += 1) {
            F(!0, K);
            var te = i.getLostPoint(L);
            (K == 0 || J > te) && (J = te, ee = K);
          }
          return ee;
        }, le = function() {
          for (var J = 8; J < g - 8; J += 1)
            $[J][6] == null && ($[J][6] = J % 2 == 0);
          for (var ee = 8; ee < g - 8; ee += 1)
            $[6][ee] == null && ($[6][ee] = ee % 2 == 0);
        }, ue = function() {
          for (var J = i.getPatternPosition(N), ee = 0; ee < J.length; ee += 1)
            for (var K = 0; K < J.length; K += 1) {
              var te = J[ee], ne = J[K];
              if ($[te][ne] == null)
                for (var se = -2; se <= 2; se += 1)
                  for (var de = -2; de <= 2; de += 1)
                    se == -2 || se == 2 || de == -2 || de == 2 || se == 0 && de == 0 ? $[te + se][ne + de] = !0 : $[te + se][ne + de] = !1;
            }
        }, we = function(J) {
          for (var ee = i.getBCHTypeNumber(N), K = 0; K < 18; K += 1) {
            var te = !J && (ee >> K & 1) == 1;
            $[Math.floor(K / 3)][K % 3 + g - 8 - 3] = te;
          }
          for (var K = 0; K < 18; K += 1) {
            var te = !J && (ee >> K & 1) == 1;
            $[K % 3 + g - 8 - 3][Math.floor(K / 3)] = te;
          }
        }, Oe = function(J, ee) {
          for (var K = j << 3 | ee, te = i.getBCHTypeInfo(K), ne = 0; ne < 15; ne += 1) {
            var se = !J && (te >> ne & 1) == 1;
            ne < 6 ? $[ne][8] = se : ne < 8 ? $[ne + 1][8] = se : $[g - 15 + ne][8] = se;
          }
          for (var ne = 0; ne < 15; ne += 1) {
            var se = !J && (te >> ne & 1) == 1;
            ne < 8 ? $[8][g - ne - 1] = se : ne < 9 ? $[8][15 - ne - 1 + 1] = se : $[8][15 - ne - 1] = se;
          }
          $[g - 8][8] = !J;
        }, be = function(J, ee) {
          for (var K = -1, te = g - 1, ne = 7, se = 0, de = i.getMaskFunction(ee), ce = g - 1; ce > 0; ce -= 2)
            for (ce == 6 && (ce -= 1); ; ) {
              for (var Se = 0; Se < 2; Se += 1)
                if ($[te][ce - Se] == null) {
                  var Te = !1;
                  se < J.length && (Te = (J[se] >>> ne & 1) == 1);
                  var he = de(te, ce - Se);
                  he && (Te = !Te), $[te][ce - Se] = Te, ne -= 1, ne == -1 && (se += 1, ne = 7);
                }
              if (te += K, te < 0 || g <= te) {
                te -= K, K = -K;
                break;
              }
            }
        }, oe = function(J, ee) {
          for (var K = 0, te = 0, ne = 0, se = new Array(ee.length), de = new Array(ee.length), ce = 0; ce < ee.length; ce += 1) {
            var Se = ee[ce].dataCount, Te = ee[ce].totalCount - Se;
            te = Math.max(te, Se), ne = Math.max(ne, Te), se[ce] = new Array(Se);
            for (var he = 0; he < se[ce].length; he += 1)
              se[ce][he] = 255 & J.getBuffer()[he + K];
            K += Se;
            var ze = i.getErrorCorrectPolynomial(Te), Ue = c(se[ce], ze.getLength() - 1), Oo = Ue.mod(ze);
            de[ce] = new Array(ze.getLength() - 1);
            for (var he = 0; he < de[ce].length; he += 1) {
              var To = he + Oo.getLength() - de[ce].length;
              de[ce][he] = To >= 0 ? Oo.getAt(To) : 0;
            }
          }
          for (var Io = 0, he = 0; he < ee.length; he += 1)
            Io += ee[he].totalCount;
          for (var Ta = new Array(Io), Nn = 0, he = 0; he < te; he += 1)
            for (var ce = 0; ce < ee.length; ce += 1)
              he < se[ce].length && (Ta[Nn] = se[ce][he], Nn += 1);
          for (var he = 0; he < ne; he += 1)
            for (var ce = 0; ce < ee.length; ce += 1)
              he < de[ce].length && (Ta[Nn] = de[ce][he], Nn += 1);
          return Ta;
        }, Q = function(J, ee, K) {
          for (var te = f.getRSBlocks(J, ee), ne = m(), se = 0; se < K.length; se += 1) {
            var de = K[se];
            ne.put(de.getMode(), 4), ne.put(de.getLength(), i.getLengthInBits(de.getMode(), J)), de.write(ne);
          }
          for (var ce = 0, se = 0; se < te.length; se += 1)
            ce += te[se].dataCount;
          if (ne.getLengthInBits() > ce * 8)
            throw "code length overflow. (" + ne.getLengthInBits() + ">" + ce * 8 + ")";
          for (ne.getLengthInBits() + 4 <= ce * 8 && ne.put(0, 4); ne.getLengthInBits() % 8 != 0; )
            ne.putBit(!1);
          for (; !(ne.getLengthInBits() >= ce * 8 || (ne.put(D, 8), ne.getLengthInBits() >= ce * 8)); )
            ne.put(E, 8);
          return oe(ne, te);
        };
        L.addData = function(J, ee) {
          ee = ee || "Byte";
          var K = null;
          switch (ee) {
            case "Numeric":
              K = p(J);
              break;
            case "Alphanumeric":
              K = y(J);
              break;
            case "Byte":
              K = b(J);
              break;
            case "Kanji":
              K = w(J);
              break;
            default:
              throw "mode:" + ee;
          }
          O.push(K), S = null;
        }, L.isDark = function(J, ee) {
          if (J < 0 || g <= J || ee < 0 || g <= ee)
            throw J + "," + ee;
          return $[J][ee];
        }, L.getModuleCount = function() {
          return g;
        }, L.make = function() {
          if (N < 1) {
            for (var J = 1; J < 40; J++) {
              for (var ee = f.getRSBlocks(J, j), K = m(), te = 0; te < O.length; te++) {
                var ne = O[te];
                K.put(ne.getMode(), 4), K.put(ne.getLength(), i.getLengthInBits(ne.getMode(), J)), ne.write(K);
              }
              for (var se = 0, te = 0; te < ee.length; te++)
                se += ee[te].dataCount;
              if (K.getLengthInBits() <= se * 8)
                break;
            }
            N = J;
          }
          F(!1, Z());
        }, L.createTableTag = function(J, ee) {
          J = J || 2, ee = typeof ee > "u" ? J * 4 : ee;
          var K = "";
          K += '<table style="', K += " border-width: 0px; border-style: none;", K += " border-collapse: collapse;", K += " padding: 0px; margin: " + ee + "px;", K += '">', K += "<tbody>";
          for (var te = 0; te < L.getModuleCount(); te += 1) {
            K += "<tr>";
            for (var ne = 0; ne < L.getModuleCount(); ne += 1)
              K += '<td style="', K += " border-width: 0px; border-style: none;", K += " border-collapse: collapse;", K += " padding: 0px; margin: 0px;", K += " width: " + J + "px;", K += " height: " + J + "px;", K += " background-color: ", K += L.isDark(te, ne) ? "#000000" : "#ffffff", K += ";", K += '"/>';
            K += "</tr>";
          }
          return K += "</tbody>", K += "</table>", K;
        }, L.createSvgTag = function(J, ee, K, te) {
          var ne = {};
          typeof arguments[0] == "object" && (ne = arguments[0], J = ne.cellSize, ee = ne.margin, K = ne.alt, te = ne.title), J = J || 2, ee = typeof ee > "u" ? J * 4 : ee, K = typeof K == "string" ? { text: K } : K || {}, K.text = K.text || null, K.id = K.text ? K.id || "qrcode-description" : null, te = typeof te == "string" ? { text: te } : te || {}, te.text = te.text || null, te.id = te.text ? te.id || "qrcode-title" : null;
          var se = L.getModuleCount() * J + ee * 2, de, ce, Se, Te, he = "", ze;
          for (ze = "l" + J + ",0 0," + J + " -" + J + ",0 0,-" + J + "z ", he += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', he += ne.scalable ? "" : ' width="' + se + 'px" height="' + se + 'px"', he += ' viewBox="0 0 ' + se + " " + se + '" ', he += ' preserveAspectRatio="xMinYMin meet"', he += te.text || K.text ? ' role="img" aria-labelledby="' + pe([te.id, K.id].join(" ").trim()) + '"' : "", he += ">", he += te.text ? '<title id="' + pe(te.id) + '">' + pe(te.text) + "</title>" : "", he += K.text ? '<description id="' + pe(K.id) + '">' + pe(K.text) + "</description>" : "", he += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', he += '<path d="', Se = 0; Se < L.getModuleCount(); Se += 1)
            for (Te = Se * J + ee, de = 0; de < L.getModuleCount(); de += 1)
              L.isDark(Se, de) && (ce = de * J + ee, he += "M" + ce + "," + Te + ze);
          return he += '" stroke="transparent" fill="black"/>', he += "</svg>", he;
        }, L.createDataURL = function(J, ee) {
          J = J || 2, ee = typeof ee > "u" ? J * 4 : ee;
          var K = L.getModuleCount() * J + ee * 2, te = ee, ne = K - ee;
          return W(K, K, function(se, de) {
            if (te <= se && se < ne && te <= de && de < ne) {
              var ce = Math.floor((se - te) / J), Se = Math.floor((de - te) / J);
              return L.isDark(Se, ce) ? 0 : 1;
            } else
              return 1;
          });
        }, L.createImgTag = function(J, ee, K) {
          J = J || 2, ee = typeof ee > "u" ? J * 4 : ee;
          var te = L.getModuleCount() * J + ee * 2, ne = "";
          return ne += "<img", ne += ' src="', ne += L.createDataURL(J, ee), ne += '"', ne += ' width="', ne += te, ne += '"', ne += ' height="', ne += te, ne += '"', K && (ne += ' alt="', ne += pe(K), ne += '"'), ne += "/>", ne;
        };
        var pe = function(J) {
          for (var ee = "", K = 0; K < J.length; K += 1) {
            var te = J.charAt(K);
            switch (te) {
              case "<":
                ee += "&lt;";
                break;
              case ">":
                ee += "&gt;";
                break;
              case "&":
                ee += "&amp;";
                break;
              case '"':
                ee += "&quot;";
                break;
              default:
                ee += te;
                break;
            }
          }
          return ee;
        }, et = function(J) {
          var ee = 1;
          J = typeof J > "u" ? ee * 2 : J;
          var K = L.getModuleCount() * ee + J * 2, te = J, ne = K - J, se, de, ce, Se, Te, he = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, ze = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, Ue = "";
          for (se = 0; se < K; se += 2) {
            for (ce = Math.floor((se - te) / ee), Se = Math.floor((se + 1 - te) / ee), de = 0; de < K; de += 1)
              Te = "█", te <= de && de < ne && te <= se && se < ne && L.isDark(ce, Math.floor((de - te) / ee)) && (Te = " "), te <= de && de < ne && te <= se + 1 && se + 1 < ne && L.isDark(Se, Math.floor((de - te) / ee)) ? Te += " " : Te += "█", Ue += J < 1 && se + 1 >= ne ? ze[Te] : he[Te];
            Ue += `
`;
          }
          return K % 2 && J > 0 ? Ue.substring(0, Ue.length - K - 1) + Array(K + 1).join("▀") : Ue.substring(0, Ue.length - 1);
        };
        return L.createASCII = function(J, ee) {
          if (J = J || 1, J < 2)
            return et(ee);
          J -= 1, ee = typeof ee > "u" ? J * 2 : ee;
          var K = L.getModuleCount() * J + ee * 2, te = ee, ne = K - ee, se, de, ce, Se, Te = Array(J + 1).join("██"), he = Array(J + 1).join("  "), ze = "", Ue = "";
          for (se = 0; se < K; se += 1) {
            for (ce = Math.floor((se - te) / J), Ue = "", de = 0; de < K; de += 1)
              Se = 1, te <= de && de < ne && te <= se && se < ne && L.isDark(ce, Math.floor((de - te) / J)) && (Se = 0), Ue += Se ? Te : he;
            for (ce = 0; ce < J; ce += 1)
              ze += Ue + `
`;
          }
          return ze.substring(0, ze.length - 1);
        }, L.renderTo2dContext = function(J, ee) {
          ee = ee || 2;
          for (var K = L.getModuleCount(), te = 0; te < K; te++)
            for (var ne = 0; ne < K; ne++)
              J.fillStyle = L.isDark(te, ne) ? "black" : "white", J.fillRect(te * ee, ne * ee, ee, ee);
        }, L;
      };
      a.stringToBytesFuncs = {
        default: function(R) {
          for (var G = [], D = 0; D < R.length; D += 1) {
            var E = R.charCodeAt(D);
            G.push(E & 255);
          }
          return G;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(R, G) {
        var D = (function() {
          for (var N = T(R), j = function() {
            var le = N.read();
            if (le == -1) throw "eof";
            return le;
          }, $ = 0, g = {}; ; ) {
            var S = N.read();
            if (S == -1) break;
            var O = j(), L = j(), F = j(), V = String.fromCharCode(S << 8 | O), Z = L << 8 | F;
            g[V] = Z, $ += 1;
          }
          if ($ != G)
            throw $ + " != " + G;
          return g;
        })(), E = 63;
        return function(N) {
          for (var j = [], $ = 0; $ < N.length; $ += 1) {
            var g = N.charCodeAt($);
            if (g < 128)
              j.push(g);
            else {
              var S = D[N.charAt($)];
              typeof S == "number" ? (S & 255) == S ? j.push(S) : (j.push(S >>> 8), j.push(S & 255)) : j.push(E);
            }
          }
          return j;
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
      }, i = (function() {
        var R = [
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
        ], G = 1335, D = 7973, E = 21522, N = {}, j = function($) {
          for (var g = 0; $ != 0; )
            g += 1, $ >>>= 1;
          return g;
        };
        return N.getBCHTypeInfo = function($) {
          for (var g = $ << 10; j(g) - j(G) >= 0; )
            g ^= G << j(g) - j(G);
          return ($ << 10 | g) ^ E;
        }, N.getBCHTypeNumber = function($) {
          for (var g = $ << 12; j(g) - j(D) >= 0; )
            g ^= D << j(g) - j(D);
          return $ << 12 | g;
        }, N.getPatternPosition = function($) {
          return R[$ - 1];
        }, N.getMaskFunction = function($) {
          switch ($) {
            case l.PATTERN000:
              return function(g, S) {
                return (g + S) % 2 == 0;
              };
            case l.PATTERN001:
              return function(g, S) {
                return g % 2 == 0;
              };
            case l.PATTERN010:
              return function(g, S) {
                return S % 3 == 0;
              };
            case l.PATTERN011:
              return function(g, S) {
                return (g + S) % 3 == 0;
              };
            case l.PATTERN100:
              return function(g, S) {
                return (Math.floor(g / 2) + Math.floor(S / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(g, S) {
                return g * S % 2 + g * S % 3 == 0;
              };
            case l.PATTERN110:
              return function(g, S) {
                return (g * S % 2 + g * S % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(g, S) {
                return (g * S % 3 + (g + S) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + $;
          }
        }, N.getErrorCorrectPolynomial = function($) {
          for (var g = c([1], 0), S = 0; S < $; S += 1)
            g = g.multiply(c([1, u.gexp(S)], 0));
          return g;
        }, N.getLengthInBits = function($, g) {
          if (1 <= g && g < 10)
            switch ($) {
              case s.MODE_NUMBER:
                return 10;
              case s.MODE_ALPHA_NUM:
                return 9;
              case s.MODE_8BIT_BYTE:
                return 8;
              case s.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + $;
            }
          else if (g < 27)
            switch ($) {
              case s.MODE_NUMBER:
                return 12;
              case s.MODE_ALPHA_NUM:
                return 11;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + $;
            }
          else if (g < 41)
            switch ($) {
              case s.MODE_NUMBER:
                return 14;
              case s.MODE_ALPHA_NUM:
                return 13;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + $;
            }
          else
            throw "type:" + g;
        }, N.getLostPoint = function($) {
          for (var g = $.getModuleCount(), S = 0, O = 0; O < g; O += 1)
            for (var L = 0; L < g; L += 1) {
              for (var F = 0, V = $.isDark(O, L), Z = -1; Z <= 1; Z += 1)
                if (!(O + Z < 0 || g <= O + Z))
                  for (var le = -1; le <= 1; le += 1)
                    L + le < 0 || g <= L + le || Z == 0 && le == 0 || V == $.isDark(O + Z, L + le) && (F += 1);
              F > 5 && (S += 3 + F - 5);
            }
          for (var O = 0; O < g - 1; O += 1)
            for (var L = 0; L < g - 1; L += 1) {
              var ue = 0;
              $.isDark(O, L) && (ue += 1), $.isDark(O + 1, L) && (ue += 1), $.isDark(O, L + 1) && (ue += 1), $.isDark(O + 1, L + 1) && (ue += 1), (ue == 0 || ue == 4) && (S += 3);
            }
          for (var O = 0; O < g; O += 1)
            for (var L = 0; L < g - 6; L += 1)
              $.isDark(O, L) && !$.isDark(O, L + 1) && $.isDark(O, L + 2) && $.isDark(O, L + 3) && $.isDark(O, L + 4) && !$.isDark(O, L + 5) && $.isDark(O, L + 6) && (S += 40);
          for (var L = 0; L < g; L += 1)
            for (var O = 0; O < g - 6; O += 1)
              $.isDark(O, L) && !$.isDark(O + 1, L) && $.isDark(O + 2, L) && $.isDark(O + 3, L) && $.isDark(O + 4, L) && !$.isDark(O + 5, L) && $.isDark(O + 6, L) && (S += 40);
          for (var we = 0, L = 0; L < g; L += 1)
            for (var O = 0; O < g; O += 1)
              $.isDark(O, L) && (we += 1);
          var Oe = Math.abs(100 * we / g / g - 50) / 5;
          return S += Oe * 10, S;
        }, N;
      })(), u = (function() {
        for (var R = new Array(256), G = new Array(256), D = 0; D < 8; D += 1)
          R[D] = 1 << D;
        for (var D = 8; D < 256; D += 1)
          R[D] = R[D - 4] ^ R[D - 5] ^ R[D - 6] ^ R[D - 8];
        for (var D = 0; D < 255; D += 1)
          G[R[D]] = D;
        var E = {};
        return E.glog = function(N) {
          if (N < 1)
            throw "glog(" + N + ")";
          return G[N];
        }, E.gexp = function(N) {
          for (; N < 0; )
            N += 255;
          for (; N >= 256; )
            N -= 255;
          return R[N];
        }, E;
      })();
      function c(R, G) {
        if (typeof R.length > "u")
          throw R.length + "/" + G;
        var D = (function() {
          for (var N = 0; N < R.length && R[N] == 0; )
            N += 1;
          for (var j = new Array(R.length - N + G), $ = 0; $ < R.length - N; $ += 1)
            j[$] = R[$ + N];
          return j;
        })(), E = {};
        return E.getAt = function(N) {
          return D[N];
        }, E.getLength = function() {
          return D.length;
        }, E.multiply = function(N) {
          for (var j = new Array(E.getLength() + N.getLength() - 1), $ = 0; $ < E.getLength(); $ += 1)
            for (var g = 0; g < N.getLength(); g += 1)
              j[$ + g] ^= u.gexp(u.glog(E.getAt($)) + u.glog(N.getAt(g)));
          return c(j, 0);
        }, E.mod = function(N) {
          if (E.getLength() - N.getLength() < 0)
            return E;
          for (var j = u.glog(E.getAt(0)) - u.glog(N.getAt(0)), $ = new Array(E.getLength()), g = 0; g < E.getLength(); g += 1)
            $[g] = E.getAt(g);
          for (var g = 0; g < N.getLength(); g += 1)
            $[g] ^= u.gexp(u.glog(N.getAt(g)) + j);
          return c($, 0).mod(N);
        }, E;
      }
      var f = (function() {
        var R = [
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
        ], G = function(N, j) {
          var $ = {};
          return $.totalCount = N, $.dataCount = j, $;
        }, D = {}, E = function(N, j) {
          switch (j) {
            case o.L:
              return R[(N - 1) * 4 + 0];
            case o.M:
              return R[(N - 1) * 4 + 1];
            case o.Q:
              return R[(N - 1) * 4 + 2];
            case o.H:
              return R[(N - 1) * 4 + 3];
            default:
              return;
          }
        };
        return D.getRSBlocks = function(N, j) {
          var $ = E(N, j);
          if (typeof $ > "u")
            throw "bad rs block @ typeNumber:" + N + "/errorCorrectionLevel:" + j;
          for (var g = $.length / 3, S = [], O = 0; O < g; O += 1)
            for (var L = $[O * 3 + 0], F = $[O * 3 + 1], V = $[O * 3 + 2], Z = 0; Z < L; Z += 1)
              S.push(G(F, V));
          return S;
        }, D;
      })(), m = function() {
        var R = [], G = 0, D = {};
        return D.getBuffer = function() {
          return R;
        }, D.getAt = function(E) {
          var N = Math.floor(E / 8);
          return (R[N] >>> 7 - E % 8 & 1) == 1;
        }, D.put = function(E, N) {
          for (var j = 0; j < N; j += 1)
            D.putBit((E >>> N - j - 1 & 1) == 1);
        }, D.getLengthInBits = function() {
          return G;
        }, D.putBit = function(E) {
          var N = Math.floor(G / 8);
          R.length <= N && R.push(0), E && (R[N] |= 128 >>> G % 8), G += 1;
        }, D;
      }, p = function(R) {
        var G = s.MODE_NUMBER, D = R, E = {};
        E.getMode = function() {
          return G;
        }, E.getLength = function($) {
          return D.length;
        }, E.write = function($) {
          for (var g = D, S = 0; S + 2 < g.length; )
            $.put(N(g.substring(S, S + 3)), 10), S += 3;
          S < g.length && (g.length - S == 1 ? $.put(N(g.substring(S, S + 1)), 4) : g.length - S == 2 && $.put(N(g.substring(S, S + 2)), 7));
        };
        var N = function($) {
          for (var g = 0, S = 0; S < $.length; S += 1)
            g = g * 10 + j($.charAt(S));
          return g;
        }, j = function($) {
          if ("0" <= $ && $ <= "9")
            return $.charCodeAt(0) - 48;
          throw "illegal char :" + $;
        };
        return E;
      }, y = function(R) {
        var G = s.MODE_ALPHA_NUM, D = R, E = {};
        E.getMode = function() {
          return G;
        }, E.getLength = function(j) {
          return D.length;
        }, E.write = function(j) {
          for (var $ = D, g = 0; g + 1 < $.length; )
            j.put(
              N($.charAt(g)) * 45 + N($.charAt(g + 1)),
              11
            ), g += 2;
          g < $.length && j.put(N($.charAt(g)), 6);
        };
        var N = function(j) {
          if ("0" <= j && j <= "9")
            return j.charCodeAt(0) - 48;
          if ("A" <= j && j <= "Z")
            return j.charCodeAt(0) - 65 + 10;
          switch (j) {
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
              throw "illegal char :" + j;
          }
        };
        return E;
      }, b = function(R) {
        var G = s.MODE_8BIT_BYTE, D = a.stringToBytes(R), E = {};
        return E.getMode = function() {
          return G;
        }, E.getLength = function(N) {
          return D.length;
        }, E.write = function(N) {
          for (var j = 0; j < D.length; j += 1)
            N.put(D[j], 8);
        }, E;
      }, w = function(R) {
        var G = s.MODE_KANJI, D = a.stringToBytesFuncs.SJIS;
        if (!D)
          throw "sjis not supported.";
        (function(j, $) {
          var g = D(j);
          if (g.length != 2 || (g[0] << 8 | g[1]) != $)
            throw "sjis not supported.";
        })("友", 38726);
        var E = D(R), N = {};
        return N.getMode = function() {
          return G;
        }, N.getLength = function(j) {
          return ~~(E.length / 2);
        }, N.write = function(j) {
          for (var $ = E, g = 0; g + 1 < $.length; ) {
            var S = (255 & $[g]) << 8 | 255 & $[g + 1];
            if (33088 <= S && S <= 40956)
              S -= 33088;
            else if (57408 <= S && S <= 60351)
              S -= 49472;
            else
              throw "illegal char at " + (g + 1) + "/" + S;
            S = (S >>> 8 & 255) * 192 + (S & 255), j.put(S, 13), g += 2;
          }
          if (g < $.length)
            throw "illegal char at " + (g + 1);
        }, N;
      }, M = function() {
        var R = [], G = {};
        return G.writeByte = function(D) {
          R.push(D & 255);
        }, G.writeShort = function(D) {
          G.writeByte(D), G.writeByte(D >>> 8);
        }, G.writeBytes = function(D, E, N) {
          E = E || 0, N = N || D.length;
          for (var j = 0; j < N; j += 1)
            G.writeByte(D[j + E]);
        }, G.writeString = function(D) {
          for (var E = 0; E < D.length; E += 1)
            G.writeByte(D.charCodeAt(E));
        }, G.toByteArray = function() {
          return R;
        }, G.toString = function() {
          var D = "";
          D += "[";
          for (var E = 0; E < R.length; E += 1)
            E > 0 && (D += ","), D += R[E];
          return D += "]", D;
        }, G;
      }, C = function() {
        var R = 0, G = 0, D = 0, E = "", N = {}, j = function(g) {
          E += String.fromCharCode($(g & 63));
        }, $ = function(g) {
          if (!(g < 0)) {
            if (g < 26)
              return 65 + g;
            if (g < 52)
              return 97 + (g - 26);
            if (g < 62)
              return 48 + (g - 52);
            if (g == 62)
              return 43;
            if (g == 63)
              return 47;
          }
          throw "n:" + g;
        };
        return N.writeByte = function(g) {
          for (R = R << 8 | g & 255, G += 8, D += 1; G >= 6; )
            j(R >>> G - 6), G -= 6;
        }, N.flush = function() {
          if (G > 0 && (j(R << 6 - G), R = 0, G = 0), D % 3 != 0)
            for (var g = 3 - D % 3, S = 0; S < g; S += 1)
              E += "=";
        }, N.toString = function() {
          return E;
        }, N;
      }, T = function(R) {
        var G = R, D = 0, E = 0, N = 0, j = {};
        j.read = function() {
          for (; N < 8; ) {
            if (D >= G.length) {
              if (N == 0)
                return -1;
              throw "unexpected end of file./" + N;
            }
            var g = G.charAt(D);
            if (D += 1, g == "=")
              return N = 0, -1;
            if (g.match(/^\s$/))
              continue;
            E = E << 6 | $(g.charCodeAt(0)), N += 6;
          }
          var S = E >>> N - 8 & 255;
          return N -= 8, S;
        };
        var $ = function(g) {
          if (65 <= g && g <= 90)
            return g - 65;
          if (97 <= g && g <= 122)
            return g - 97 + 26;
          if (48 <= g && g <= 57)
            return g - 48 + 52;
          if (g == 43)
            return 62;
          if (g == 47)
            return 63;
          throw "c:" + g;
        };
        return j;
      }, z = function(R, G) {
        var D = R, E = G, N = new Array(R * G), j = {};
        j.setPixel = function(O, L, F) {
          N[L * D + O] = F;
        }, j.write = function(O) {
          O.writeString("GIF87a"), O.writeShort(D), O.writeShort(E), O.writeByte(128), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(255), O.writeByte(255), O.writeByte(255), O.writeString(","), O.writeShort(0), O.writeShort(0), O.writeShort(D), O.writeShort(E), O.writeByte(0);
          var L = 2, F = g(L);
          O.writeByte(L);
          for (var V = 0; F.length - V > 255; )
            O.writeByte(255), O.writeBytes(F, V, 255), V += 255;
          O.writeByte(F.length - V), O.writeBytes(F, V, F.length - V), O.writeByte(0), O.writeString(";");
        };
        var $ = function(O) {
          var L = O, F = 0, V = 0, Z = {};
          return Z.write = function(le, ue) {
            if (le >>> ue)
              throw "length over";
            for (; F + ue >= 8; )
              L.writeByte(255 & (le << F | V)), ue -= 8 - F, le >>>= 8 - F, V = 0, F = 0;
            V = le << F | V, F = F + ue;
          }, Z.flush = function() {
            F > 0 && L.writeByte(V);
          }, Z;
        }, g = function(O) {
          for (var L = 1 << O, F = (1 << O) + 1, V = O + 1, Z = S(), le = 0; le < L; le += 1)
            Z.add(String.fromCharCode(le));
          Z.add(String.fromCharCode(L)), Z.add(String.fromCharCode(F));
          var ue = M(), we = $(ue);
          we.write(L, V);
          var Oe = 0, be = String.fromCharCode(N[Oe]);
          for (Oe += 1; Oe < N.length; ) {
            var oe = String.fromCharCode(N[Oe]);
            Oe += 1, Z.contains(be + oe) ? be = be + oe : (we.write(Z.indexOf(be), V), Z.size() < 4095 && (Z.size() == 1 << V && (V += 1), Z.add(be + oe)), be = oe);
          }
          return we.write(Z.indexOf(be), V), we.write(F, V), we.flush(), ue.toByteArray();
        }, S = function() {
          var O = {}, L = 0, F = {};
          return F.add = function(V) {
            if (F.contains(V))
              throw "dup key:" + V;
            O[V] = L, L += 1;
          }, F.size = function() {
            return L;
          }, F.indexOf = function(V) {
            return O[V];
          }, F.contains = function(V) {
            return typeof O[V] < "u";
          }, F;
        };
        return j;
      }, W = function(R, G, D) {
        for (var E = z(R, G), N = 0; N < G; N += 1)
          for (var j = 0; j < R; j += 1)
            E.setPixel(j, N, D(j, N));
        var $ = M();
        E.write($);
        for (var g = C(), S = $.toByteArray(), O = 0; O < S.length; O += 1)
          g.writeByte(S[O]);
        return g.flush(), "data:image/gif;base64," + g;
      };
      return a;
    })();
    (function() {
      n.stringToBytesFuncs["UTF-8"] = function(a) {
        function s(o) {
          for (var l = [], i = 0; i < o.length; i++) {
            var u = o.charCodeAt(i);
            u < 128 ? l.push(u) : u < 2048 ? l.push(
              192 | u >> 6,
              128 | u & 63
            ) : u < 55296 || u >= 57344 ? l.push(
              224 | u >> 12,
              128 | u >> 6 & 63,
              128 | u & 63
            ) : (i++, u = 65536 + ((u & 1023) << 10 | o.charCodeAt(i) & 1023), l.push(
              240 | u >> 18,
              128 | u >> 12 & 63,
              128 | u >> 6 & 63,
              128 | u & 63
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
  })(hs)), hs.exports;
}
var Z_ = J_();
const eM = /* @__PURE__ */ X_(Z_), tM = ["width", "height", "viewBox"], nM = ["width", "height"], aM = ["d"], sM = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = x(() => {
      const a = eM(0, "M");
      a.addData(t.text), a.make();
      const s = a.getModuleCount(), o = [];
      for (let l = 0; l < s; l += 1)
        for (let i = 0; i < s; i += 1)
          a.isDark(l, i) && o.push(`M${i + 4} ${l + 4}h1v1h-1z`);
      return { count: s + 8, path: o.join("") };
    });
    return (a, s) => (r(), d("svg", {
      class: "qr",
      width: e.size,
      height: e.size,
      viewBox: `0 0 ${n.value.count} ${n.value.count}`,
      "shape-rendering": "crispEdges",
      role: "img",
      "aria-label": "QR code"
    }, [
      h("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, nM),
      h("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, aM)
    ], 8, tM));
  }
}, FO = /* @__PURE__ */ H(sM, [["__scopeId", "data-v-489f0852"]]), oM = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "window-room",
      "data-window-room": "",
      style: ge({ padding: e.padding })
    }, [
      ae(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, WO = /* @__PURE__ */ H(oM, [["__scopeId", "data-v-47e67f04"]]), lM = {
  class: "list-reader",
  "data-list-reader": ""
}, iM = { class: "list-reader-body" }, rM = {
  key: 0,
  class: "list-reader-group"
}, uM = ["title", "aria-current", "data-row", "onClick"], cM = {
  class: "list-reader-reader",
  "data-reader-pane": ""
}, dM = {
  __name: "ListReaderLayout",
  props: /* @__PURE__ */ Tt({
    items: { type: Array, required: !0 },
    listWidth: { type: Number, default: 360 },
    emptyTitle: { type: String, default: "Nothing here yet" },
    pickLine: { type: String, default: "No row chosen" }
  }, {
    chosen: { type: [String, Number], default: null },
    chosenModifiers: {}
  }),
  emits: ["update:chosen"],
  setup(e) {
    const t = e, n = Gt(e, "chosen"), a = x(() => t.items.find((f) => f.id === n.value) ?? null), s = x(() => [...new Set(t.items.map((f) => f.group || ""))]), o = (f) => t.items.filter((m) => (m.group || "") === f);
    function l(f) {
      n.value = f.id, Lm(f.id);
    }
    function i(f) {
      const m = t.items.findIndex((y) => y.id === n.value), p = t.items[Math.min(t.items.length - 1, Math.max(0, m + f))];
      p && l(p);
    }
    const u = { ArrowDown: 1, ArrowUp: -1 };
    function c(f) {
      /^(INPUT|TEXTAREA|SELECT)$/.test(f.target.tagName) || !u[f.key] || (f.preventDefault(), i(u[f.key]));
    }
    return Ce(() => {
      const f = t.items.find((m) => String(m.id) === ra.value.row);
      f && (n.value = f.id);
    }), (f, m) => (r(), d("div", lM, [
      ae(f.$slots, "top", {}, void 0, !0),
      h("div", iM, [
        h("div", {
          class: "list-reader-list",
          style: ge({ width: `${e.listWidth}px` }),
          tabindex: "0",
          "aria-label": "List",
          "data-reader-list": "",
          onKeydown: c
        }, [
          e.items.length ? k("", !0) : (r(), P(wt, {
            key: 0,
            title: e.emptyTitle
          }, {
            default: q(() => [
              ae(f.$slots, "empty", {}, void 0, !0)
            ]),
            _: 3
          }, 8, ["title"])),
          (r(!0), d(B, null, X(s.value, (p) => (r(), d(B, { key: p }, [
            p ? (r(), d("p", rM, v(p), 1)) : k("", !0),
            (r(!0), d(B, null, X(o(p), (y) => (r(), d("button", {
              key: y.id,
              type: "button",
              class: Y(["list-reader-row", { on: y.id === n.value }]),
              title: y.title,
              "aria-current": y.id === n.value,
              "data-reader-row": "",
              "data-row": y.id,
              onClick: (b) => l(y)
            }, [
              A(Ew, {
                title: y.title,
                text: y.desc || ""
              }, wa({ _: 2 }, [
                f.$slots.meta ? {
                  name: "end",
                  fn: q(() => [
                    ae(f.$slots, "meta", { item: y }, void 0, !0)
                  ]),
                  key: "0"
                } : void 0
              ]), 1032, ["title", "text"])
            ], 10, uM))), 128))
          ], 64))), 128))
        ], 36),
        h("div", cM, [
          a.value ? ae(f.$slots, "reader", { item: a.value }, void 0, !0, 0) : e.items.length ? (r(), P(wt, {
            key: 1,
            title: e.pickLine
          }, null, 8, ["title"])) : k("", !0)
        ])
      ])
    ]));
  }
}, HO = /* @__PURE__ */ H(dM, [["__scopeId", "data-v-b6052f67"]]), fM = {
  class: "reader",
  "data-reader": ""
}, mM = {
  class: "reader-head",
  "data-reader-head": ""
}, hM = { class: "reader-meta" }, pM = {
  key: 0,
  class: "reader-number",
  "data-reader-number": ""
}, vM = { class: "reader-title-line" }, gM = { class: "reader-buttons" }, yM = { class: "reader-body" }, bM = {
  __name: "Reader",
  props: {
    title: { type: String, required: !0 },
    number: { type: String, default: "" },
    abstract: { type: String, default: "" },
    tabs: { type: Array, default: () => [] },
    facts: { type: Array, default: () => [] }
  },
  emits: ["peek"],
  setup(e, { emit: t }) {
    var u;
    const n = e, a = t, s = _(((u = n.tabs[0]) == null ? void 0 : u.key) ?? "");
    me(() => n.tabs.map((c) => c.key).join(), () => {
      var c;
      n.tabs.some((f) => f.key === s.value) || (s.value = ((c = n.tabs[0]) == null ? void 0 : c.key) ?? "");
    });
    const o = x(() => n.tabs.map((c) => ({ key: c.key, label: c.label, count_field: c.count != null ? `count_${c.key}` : "" }))), l = x(() => o.value.find((c) => c.key === s.value) ?? null), i = x(() => Object.fromEntries(n.tabs.filter((c) => c.count != null).map((c) => [`count_${c.key}`, c.count])));
    return (c, f) => (r(), d("article", fM, [
      h("header", mM, [
        h("div", hM, [
          e.number ? (r(), d("span", pM, v(e.number), 1)) : k("", !0),
          ae(c.$slots, "agent", {}, void 0, !0)
        ]),
        h("div", vM, [
          A(xu, {
            title: e.title,
            abstract: e.abstract
          }, null, 8, ["title", "abstract"]),
          h("span", gM, [
            ae(c.$slots, "primary", {}, void 0, !0),
            ae(c.$slots, "actions", {}, void 0, !0)
          ])
        ])
      ]),
      e.tabs.length ? (r(), P(S8, {
        key: 0,
        tabs: o.value,
        active: l.value,
        answer: i.value,
        onChoose: f[0] || (f[0] = (m) => s.value = m.key)
      }, null, 8, ["tabs", "active", "answer"])) : k("", !0),
      h("div", yM, [
        e.facts.length ? (r(), P(Su, {
          key: 0,
          fields: e.facts,
          onPeek: f[1] || (f[1] = (m) => a("peek", m))
        }, null, 8, ["fields"])) : k("", !0),
        ae(c.$slots, "default", { tab: s.value }, void 0, !0)
      ])
    ]));
  }
}, zO = /* @__PURE__ */ H(bM, [["__scopeId", "data-v-75e4d6a3"]]), kM = {
  class: "reader-section",
  "data-reader-section": ""
}, wM = { class: "reader-section-title" }, $M = { class: "reader-section-name" }, xM = {
  __name: "ReaderSection",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("section", kM, [
      h("h4", wM, [
        h("span", $M, v(e.title), 1),
        ae(t.$slots, "end", {}, void 0, !0)
      ]),
      ae(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, UO = /* @__PURE__ */ H(xM, [["__scopeId", "data-v-ab40cbe5"]]), SM = {
  class: "reader-timeline",
  "data-reader-timeline": ""
}, _M = { class: "reader-timeline-who" }, MM = { class: "reader-timeline-text" }, CM = {
  key: 0,
  class: "reader-timeline-none"
}, AM = {
  __name: "ReaderTimeline",
  props: { entries: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("ol", SM, [
      (r(!0), d(B, null, X(e.entries, (a) => (r(), d("li", {
        key: a.id,
        class: "reader-timeline-entry"
      }, [
        h("span", _M, v(a.by), 1),
        A(Je, {
          class: "reader-timeline-at",
          at: a.at
        }, null, 8, ["at"]),
        h("span", MM, v(a.text), 1)
      ]))), 128)),
      e.entries.length ? k("", !0) : (r(), d("li", CM, "None"))
    ]));
  }
}, VO = /* @__PURE__ */ H(AM, [["__scopeId", "data-v-312caab5"]]), GO = {
  __name: "ReaderLinks",
  props: { model: { type: String, required: !0 }, id: { type: Number, required: !0 } },
  emits: ["open"],
  setup(e) {
    const t = Me(Re);
    return (n, a) => (r(), P($u, {
      model: e.model,
      id: e.id,
      read: I(t).read,
      open: "",
      onOpen: a[0] || (a[0] = (s) => n.$emit("open", s))
    }, null, 8, ["model", "id", "read"]));
  }
}, EM = {
  class: "page-card",
  "data-page-card": ""
}, OM = { class: "page-card-head" }, TM = {
  key: 0,
  class: "page-card-mark",
  "aria-hidden": "true"
}, IM = { class: "page-card-names" }, BM = ["title"], RM = {
  class: "page-card-state",
  "data-card-state": ""
}, LM = {
  key: 1,
  class: "page-card-corner",
  "data-card-corner": ""
}, NM = ["title"], qM = {
  key: 0,
  class: "page-card-fault",
  role: "alert",
  "data-card-fault": ""
}, DM = {
  class: "page-card-foot",
  "data-card-foot": ""
}, PM = {
  __name: "PageCard",
  props: {
    title: { type: String, required: !0 },
    icon: { type: String, default: "" },
    state: { type: String, default: "" },
    line: { type: String, default: "" },
    fault: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("article", EM, [
      h("header", OM, [
        e.icon ? (r(), d("span", TM, [
          A(ie, {
            name: e.icon,
            size: 16
          }, null, 8, ["name"])
        ])) : k("", !0),
        h("span", IM, [
          h("h3", {
            class: "page-card-title",
            title: e.title
          }, v(e.title), 9, BM),
          h("p", RM, v(e.state || "—"), 1)
        ]),
        t.$slots.corner ? (r(), d("span", LM, [
          ae(t.$slots, "corner", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      h("p", {
        class: "page-card-line",
        "data-card-line": "",
        title: e.line
      }, v(e.line || "—"), 9, NM),
      ae(t.$slots, "default", {}, void 0, !0),
      e.fault ? (r(), d("p", qM, v(e.fault), 1)) : k("", !0),
      h("footer", DM, [
        ae(t.$slots, "foot", {}, void 0, !0),
        n[0] || (n[0] = h("span", { class: "page-card-grow" }, null, -1)),
        ae(t.$slots, "actions", {}, void 0, !0)
      ])
    ]));
  }
}, jM = /* @__PURE__ */ H(PM, [["__scopeId", "data-v-89b55585"]]), FM = {
  class: "card-page",
  "data-card-page": ""
}, WM = { class: "card-page-body" }, HM = {
  key: 0,
  class: "card-page-group"
}, zM = { class: "card-page-grid" }, UM = {
  __name: "CardPage",
  props: {
    title: { type: String, required: !0 },
    items: { type: Array, required: !0 },
    fields: { type: Array, default: () => [] },
    emptyTitle: { type: String, default: "Nothing here yet" }
  },
  setup(e) {
    const t = e, n = _(fa(t.fields)), a = _(""), s = x(() => xr(t.items, t.fields, n.value, a.value, ["title", "line"])), o = x(() => [...new Set(s.value.map((u) => u.group || ""))]), l = (u) => s.value.filter((c) => (c.group || "") === u), i = () => {
      n.value = fa(t.fields), a.value = "";
    };
    return (u, c) => (r(), d("div", FM, [
      A(Uw, {
        title: e.title,
        count: e.items.length
      }, {
        primary: q(() => [
          ae(u.$slots, "primary", {}, void 0, !0)
        ]),
        actions: q(() => [
          ae(u.$slots, "actions", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["title", "count"]),
      A(Mr, {
        modelValue: n.value,
        "onUpdate:modelValue": c[0] || (c[0] = (f) => n.value = f),
        words: a.value,
        "onUpdate:words": c[1] || (c[1] = (f) => a.value = f),
        fields: e.fields,
        rows: e.items,
        shown: s.value.length
      }, null, 8, ["modelValue", "words", "fields", "rows", "shown"]),
      h("div", WM, [
        s.value.length ? k("", !0) : (r(), P(wt, {
          key: 0,
          title: e.items.length ? "No match" : e.emptyTitle
        }, {
          default: q(() => [
            e.items.length ? (r(), P(ve, {
              key: 0,
              small: "",
              onClick: i
            }, {
              default: q(() => [...c[2] || (c[2] = [
                U("Clear", -1)
              ])]),
              _: 1
            })) : ae(u.$slots, "empty", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["title"])),
        (r(!0), d(B, null, X(o.value, (f) => (r(), d(B, { key: f }, [
          f ? (r(), d("p", HM, v(f), 1)) : k("", !0),
          h("div", zM, [
            (r(!0), d(B, null, X(l(f), (m) => (r(), P(jM, {
              key: m.id,
              title: m.title,
              icon: m.icon,
              state: m.state,
              line: m.line,
              fault: m.fault,
              "data-row": m.id
            }, wa({
              default: q(() => [
                ae(u.$slots, "card", { item: m }, void 0, !0)
              ]),
              _: 2
            }, [
              u.$slots.corner ? {
                name: "corner",
                fn: q(() => [
                  ae(u.$slots, "corner", { item: m }, void 0, !0)
                ]),
                key: "0"
              } : void 0,
              u.$slots.foot ? {
                name: "foot",
                fn: q(() => [
                  ae(u.$slots, "foot", { item: m }, void 0, !0)
                ]),
                key: "1"
              } : void 0,
              u.$slots["card-actions"] ? {
                name: "actions",
                fn: q(() => [
                  ae(u.$slots, "card-actions", { item: m }, void 0, !0)
                ]),
                key: "2"
              } : void 0
            ]), 1032, ["title", "icon", "state", "line", "fault", "data-row"]))), 128))
          ])
        ], 64))), 128))
      ])
    ]));
  }
}, KO = /* @__PURE__ */ H(UM, [["__scopeId", "data-v-7a1a1305"]]), VM = {
  class: "table-layout",
  "data-table-layout": ""
}, GM = { class: "table-layout-body" }, KM = {
  __name: "TableLayout",
  props: {
    columns: { type: Array, required: !0 },
    rows: { type: Array, required: !0 },
    fields: { type: Array, default: () => [] },
    empty: { type: String, default: "No match" }
  },
  setup(e) {
    const t = e, n = _(fa(t.fields)), a = _(""), s = x(() => xr(t.rows, t.fields, n.value, a.value, t.columns.map((i) => i.key))), o = x(() => t.columns.map((i) => i.label)), l = x(() => s.value.map((i) => ({ cells: t.columns.map((u) => i[u.key] ?? ""), open: i.ref ?? "", tone: i.tone ?? "" })));
    return (i, u) => (r(), d("div", VM, [
      A(Mr, {
        modelValue: n.value,
        "onUpdate:modelValue": u[0] || (u[0] = (c) => n.value = c),
        words: a.value,
        "onUpdate:words": u[1] || (u[1] = (c) => a.value = c),
        fields: e.fields,
        rows: e.rows,
        shown: s.value.length
      }, null, 8, ["modelValue", "words", "fields", "rows", "shown"]),
      h("div", GM, [
        A(rr, {
          columns: o.value,
          rows: l.value,
          empty: e.empty,
          onOpen: I(Pe)
        }, null, 8, ["columns", "rows", "empty", "onOpen"])
      ])
    ]));
  }
}, YO = /* @__PURE__ */ H(KM, [["__scopeId", "data-v-32f1bba5"]]), YM = ["id", "onUpdate:modelValue", "data-field"], QM = ["value"], XM = ["data-refused"], JM = {
  class: "create-command",
  "data-command-preview": ""
}, ZM = {
  key: 0,
  class: "create-refusal",
  role: "alert",
  "data-create-failure": ""
}, eC = { class: "create-actions" }, tC = {
  __name: "CreateDialog",
  props: {
    title: { type: String, required: !0 },
    fields: { type: Array, required: !0 },
    submit: { type: String, default: "Make" },
    // the command line for the values typed so far, shown under the fields
    command: { type: Function, required: !0 },
    // {key: refusal} for the values typed, or nothing when they pass; a refused field keeps its value and says why under it
    check: { type: Function, default: () => ({}) },
    // sends the values; the answer is {ok} or {ok: false, error}
    run: { type: Function, required: !0 }
  },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (y) => y.value ?? (y.kind === "select" ? y.options[0][0] : ""), o = _(Object.fromEntries(n.fields.map((y) => [y.key, s(y)]))), l = _({}), i = _(""), u = _(!1), c = x(() => n.fields.filter((y) => !y.when || y.when(o.value))), f = x(() => c.value.every((y) => !y.required || String(o.value[y.key]).trim())), m = x(() => n.command(o.value));
    async function p() {
      if (u.value || !f.value || (l.value = n.check(o.value) ?? {}, Object.keys(l.value).length)) return;
      u.value = !0;
      const y = await n.run(o.value);
      u.value = !1, i.value = y.ok ? "" : y.error, y.ok && (a("done", o.value), a("close"));
    }
    return (y, b) => (r(), P(Mn, {
      padded: "",
      title: e.title,
      fits: "",
      small: "",
      sheet: "",
      onClose: b[1] || (b[1] = (w) => a("close"))
    }, {
      default: q(() => [
        h("form", {
          class: "create-dialog",
          "data-create-dialog": "",
          onSubmit: ke(p, ["prevent"])
        }, [
          (r(!0), d(B, null, X(c.value, (w) => (r(), P($i, {
            key: w.key,
            label: w.label,
            help: w.help,
            for: `create-${w.key}`
          }, {
            default: q(() => [
              w.kind === "select" ? _e((r(), d("select", {
                key: 0,
                id: `create-${w.key}`,
                "onUpdate:modelValue": (M) => o.value[w.key] = M,
                "data-field": w.key
              }, [
                (r(!0), d(B, null, X(w.options, ([M, C]) => (r(), d("option", {
                  key: M,
                  value: M
                }, v(C), 9, QM))), 128))
              ], 8, YM)), [
                [It, o.value[w.key]]
              ]) : w.kind === "area" ? (r(), P(xi, {
                key: 1,
                id: `create-${w.key}`,
                value: o.value[w.key],
                placeholder: w.placeholder,
                "data-field": w.key,
                onInput: (M) => o.value[w.key] = M.target.value
              }, null, 8, ["id", "value", "placeholder", "data-field", "onInput"])) : (r(), P(Pw, {
                key: 2,
                id: `create-${w.key}`,
                type: w.kind === "password" ? "password" : w.kind === "number" ? "number" : "text",
                "model-value": String(o.value[w.key]),
                placeholder: w.placeholder,
                "data-field": w.key,
                "onUpdate:modelValue": (M) => o.value[w.key] = M
              }, null, 8, ["id", "type", "model-value", "placeholder", "data-field", "onUpdate:modelValue"])),
              l.value[w.key] ? (r(), d("p", {
                key: 3,
                class: "create-refusal",
                role: "alert",
                "data-refused": w.key
              }, v(l.value[w.key]), 9, XM)) : k("", !0)
            ]),
            _: 2
          }, 1032, ["label", "help", "for"]))), 128)),
          h("code", JM, v(m.value), 1),
          i.value ? (r(), d("p", ZM, v(i.value), 1)) : k("", !0),
          h("div", eC, [
            A(ve, {
              small: "",
              onClick: b[0] || (b[0] = (w) => a("close"))
            }, {
              default: q(() => [...b[2] || (b[2] = [
                U("Cancel", -1)
              ])]),
              _: 1
            }),
            A(ve, {
              variant: "primary",
              small: "",
              type: "submit",
              disabled: !f.value || u.value,
              busy: u.value,
              "data-create-send": ""
            }, {
              default: q(() => [
                U(v(e.submit), 1)
              ]),
              _: 1
            }, 8, ["disabled", "busy"])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, QO = /* @__PURE__ */ H(tC, [["__scopeId", "data-v-726cedd8"]]), XO = Lu(() => import("./VoiceFigure-LM_Q4POX.js").then((e) => e.V)), JO = "1.2.0", ZO = "3.5";
export {
  Em as $,
  Ie as A,
  Ne as B,
  Ca as C,
  ft as D,
  KE as E,
  yx as F,
  DA as G,
  zE as H,
  J4 as I,
  _x as J,
  Dt as K,
  oC as L,
  So as M,
  Tx as N,
  Sx as O,
  Ma as P,
  cE as Q,
  gA as R,
  na as S,
  pE as T,
  uA as U,
  Be as V,
  ha as W,
  rA as X,
  iA as Y,
  Am as Z,
  H as _,
  ZC as a,
  IE as a$,
  Ex as a0,
  yA as a1,
  bA as a2,
  Re as a3,
  OA as a4,
  EA as a5,
  Rt as a6,
  kA as a7,
  WA as a8,
  WC as a9,
  SE as aA,
  iE as aB,
  F4 as aC,
  VA as aD,
  GA as aE,
  YE as aF,
  tu as aG,
  hE as aH,
  In as aI,
  KC as aJ,
  UC as aK,
  DE as aL,
  Bn as aM,
  WE as aN,
  qA as aO,
  rE as aP,
  uE as aQ,
  lE as aR,
  kn as aS,
  Et as aT,
  HC as aU,
  T5 as aV,
  sE as aW,
  pA as aX,
  Zr as aY,
  Yt as aZ,
  nn as a_,
  BE as aa,
  jE as ab,
  XC as ac,
  cA as ad,
  dA as ae,
  CA as af,
  AA as ag,
  TA as ah,
  aA as ai,
  Nl as aj,
  wA as ak,
  FA as al,
  ZE as am,
  eE as an,
  JA as ao,
  XA as ap,
  IA as aq,
  _A as ar,
  SA as as,
  MA as at,
  mE as au,
  jA as av,
  HA as aw,
  nO as ax,
  cn as ay,
  zA as az,
  Wx as b,
  tO as b$,
  hx as b0,
  FE as b1,
  yE as b2,
  gE as b3,
  t4 as b4,
  jr as b5,
  EE as b6,
  PA as b7,
  Oa as b8,
  vt as b9,
  kE as bA,
  ME as bB,
  kt as bC,
  vE as bD,
  CE as bE,
  UA as bF,
  tE as bG,
  KA as bH,
  De as bI,
  NA as bJ,
  AE as bK,
  cO as bL,
  dO as bM,
  jC as bN,
  R5 as bO,
  RA as bP,
  wE as bQ,
  eA as bR,
  JE as bS,
  bE as bT,
  $E as bU,
  xE as bV,
  BA as bW,
  W4 as bX,
  LA as bY,
  QA as bZ,
  XE as b_,
  _E as ba,
  ts as bb,
  zi as bc,
  sO as bd,
  iO as be,
  fE as bf,
  qE as bg,
  FC as bh,
  ZA as bi,
  oO as bj,
  $A as bk,
  xA as bl,
  oA as bm,
  vA as bn,
  GC as bo,
  LE as bp,
  tA as bq,
  nA as br,
  lA as bs,
  aE as bt,
  M5 as bu,
  HE as bv,
  xx as bw,
  sA as bx,
  YC as by,
  nE as bz,
  e4 as c,
  bt as c$,
  VC as c0,
  zC as c1,
  YA as c2,
  rO as c3,
  Eo as c4,
  uO as c5,
  vu as c6,
  NE as c7,
  mA as c8,
  fA as c9,
  Qs as cA,
  wt as cB,
  X3 as cC,
  go as cD,
  fO as cE,
  Mr as cF,
  n2 as cG,
  aC as cH,
  tn as cI,
  $i as cJ,
  DO as cK,
  Kp as cL,
  ci as cM,
  ie as cN,
  wi as cO,
  S8 as cP,
  pC as cQ,
  JO as cR,
  ZO as cS,
  HO as cT,
  Ew as cU,
  AO as cV,
  Ts as cW,
  LC as cX,
  M$ as cY,
  rt as cZ,
  He as c_,
  O5 as ca,
  QC as cb,
  wx as cc,
  oE as cd,
  wo as ce,
  N4 as cf,
  dE as cg,
  dn as ch,
  Vt as ci,
  Ut as cj,
  kC as ck,
  $C as cl,
  vn as cm,
  _O as cn,
  ve as co,
  dm as cp,
  oo as cq,
  KO as cr,
  xa as cs,
  QO as ct,
  Jy as cu,
  Mn as cv,
  NO as cw,
  PC as cx,
  wC as cy,
  t0 as cz,
  Xe as d,
  IO as d$,
  Zt as d0,
  xC as d1,
  AC as d2,
  fC as d3,
  ed as d4,
  l$ as d5,
  da as d6,
  jM as d7,
  Uw as d8,
  LO as d9,
  dC as dA,
  Jt as dB,
  CO as dC,
  YO as dD,
  MO as dE,
  p_ as dF,
  PO as dG,
  jO as dH,
  _a as dI,
  xi as dJ,
  Pw as dK,
  Je as dL,
  XO as dM,
  WO as dN,
  ho as dO,
  yO as dP,
  Us as dQ,
  Jp as dR,
  fo as dS,
  vC as dT,
  wf as dU,
  Ji as dV,
  Kt as dW,
  En as dX,
  af as dY,
  xr as dZ,
  BO as d_,
  gC as da,
  yC as db,
  bC as dc,
  _C as dd,
  qO as de,
  FO as df,
  lr as dg,
  zO as dh,
  GO as di,
  UO as dj,
  VO as dk,
  Ed as dl,
  xO as dm,
  bb as dn,
  cC as dp,
  qC as dq,
  _r as dr,
  Bt as ds,
  EC as dt,
  Ze as du,
  xt as dv,
  cy as dw,
  qd as dx,
  Bp as dy,
  BC as dz,
  hA as e,
  sf as e$,
  Xs as e0,
  nf as e1,
  Ks as e2,
  ol as e3,
  fa as e4,
  RO as e5,
  DC as e6,
  TC as e7,
  ri as e8,
  Hc as e9,
  l1 as eA,
  uC as eB,
  o1 as eC,
  Fa as eD,
  iC as eE,
  hn as eF,
  Zs as eG,
  of as eH,
  hC as eI,
  yt as eJ,
  OC as eK,
  s8 as eL,
  sC as eM,
  lC as eN,
  SO as eO,
  tr as eP,
  EO as eQ,
  Er as eR,
  fi as eS,
  D8 as eT,
  Vs as eU,
  kO as eV,
  vs as eW,
  wO as eX,
  $O as eY,
  ot as eZ,
  TO as e_,
  zc as ea,
  F2 as eb,
  NC as ec,
  RC as ed,
  pO as ee,
  np as ef,
  mO as eg,
  rC as eh,
  OO as ei,
  b$ as ej,
  kr as ek,
  yr as el,
  mC as em,
  IC as en,
  CC as eo,
  gO as ep,
  bO as eq,
  Pe as er,
  e1 as es,
  SC as et,
  nd as eu,
  hO as ev,
  Ar as ew,
  vO as ex,
  Jl as ey,
  MC as ez,
  _5 as f,
  aO as g,
  wn as h,
  UE as i,
  lO as j,
  VE as k,
  RE as l,
  Gx as m,
  _o as n,
  PE as o,
  JC as p,
  GE as q,
  hu as r,
  pu as s,
  Ee as t,
  a4 as u,
  OE as v,
  eO as w,
  TE as x,
  Ln as y,
  QE as z
};
