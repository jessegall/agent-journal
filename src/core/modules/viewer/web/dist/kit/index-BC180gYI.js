import { openBlock as r, createElementBlock as d, normalizeStyle as pe, unref as O, renderSlot as ne, createElementVNode as h, normalizeClass as X, Fragment as B, renderList as Z, defineComponent as Wu, Comment as Hu, h as _a, cloneVNode as zu, createBlock as j, withCtx as N, createVNode as A, toDisplayString as v, createCommentVNode as k, ref as E, inject as $e, watch as ce, onMounted as _e, onBeforeUnmount as tt, reactive as tn, shallowRef as lt, onUnmounted as Te, useAttrs as Ca, computed as M, resolveDynamicComponent as Je, mergeProps as Ne, useId as eo, resolveDirective as Uu, withDirectives as ge, createTextVNode as z, Teleport as In, nextTick as Re, Transition as nn, withModifiers as he, createApp as Vu, shallowReactive as Gu, withKeys as ze, createSlots as Ea, onScopeDispose as Aa, useModel as qt, mergeModels as mt, toRef as Fa, resolveComponent as ri, vModelText as Fe, provide as to, onErrorCaptured as Ku, TransitionGroup as no, isRef as Vo, getCurrentInstance as Yu, useSlots as Qu, vShow as ao, getCurrentScope as ui, normalizeProps as bt, guardReactiveProps as ci, vModelSelect as Dt, defineAsyncComponent as Xu } from "vue";
function di(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const V = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, Ju = 1600, Zu = {
  __name: "Shimmer",
  setup(e) {
    const t = di(Ju);
    return (n, a) => (r(), d("span", {
      class: "shimmer",
      style: pe(O(t))
    }, null, 4));
  }
}, pn = /* @__PURE__ */ V(Zu, [["__scopeId", "data-v-6c018b03"]]), ec = { class: "skeleton-line" }, tc = 2e3, nc = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = di(tc);
    return (n, a) => (r(), d("span", ec, [
      ne(n.$slots, "default", {}, void 0, !0),
      h("span", {
        class: X(["bars", { faded: e.filled }])
      }, [
        (r(!0), d(B, null, Z(e.bars, (s) => (r(), d("span", {
          key: s.width,
          class: X(["bar", { still: e.still }]),
          style: pe({ ...O(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, At = /* @__PURE__ */ V(nc, [["__scopeId", "data-v-484fe8a0"]]), Ft = Wu({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Hu);
      return a.length !== 1 ? _a(B, { key: n }, a) : a[0].key == null ? zu(a[0], { key: n }) : a[0];
    };
  }
}), ac = ["aria-label"], sc = ["aria-label"], oc = ["aria-label"], lc = ["aria-label"], ic = ["aria-label"], rc = ["aria-label"], uc = ["aria-label"], cc = {
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
    return (u, c) => (r(), j(Ft, { value: e.shape }, {
      messages: N(() => [
        h("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(), d(B, null, Z(t, (f) => A(pn, {
            key: f.id,
            class: X(["skeleton-message", { mine: f.mine }]),
            style: pe({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, ac)
      ]),
      older: N(() => [
        h("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(B, null, Z(t.slice(0, 3), (f) => (r(), j(pn, {
            key: f.id,
            class: X(["skeleton-message", { mine: f.mine }]),
            style: pe({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, sc)
      ]),
      cards: N(() => [
        h("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(B, null, Z(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (r(), d(B, null, Z(n, (m) => A(At, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, oc)
      ]),
      file: N(() => [
        h("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(B, null, Z(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-file"
          }, [
            A(At, {
              class: "skeleton-file-head",
              bars: a
            }),
            (r(), d(B, null, Z(s, (m) => A(At, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, lc)
      ]),
      page: N(() => [
        h("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          A(At, {
            class: "skeleton-heading",
            bars: i
          }),
          (r(!0), d(B, null, Z(e.count, (f) => (r(), j(At, {
            key: f,
            bars: O(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, ic)
      ]),
      text: N(() => [
        h("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(B, null, Z(e.count, (f) => (r(), j(At, {
            key: f,
            bars: O(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, rc)
      ]),
      default: N(() => [
        h("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(B, null, Z(e.count, (f) => (r(), j(At, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, uc)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, nt = /* @__PURE__ */ V(cc, [["__scopeId", "data-v-ef519c5f"]]), dc = {
  key: 1,
  class: "empty-state titled"
}, fc = { class: "empty-state-title" }, mc = { class: "empty-state-text" }, hc = {
  key: 2,
  class: "empty-state"
}, pc = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (r(), j(nt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (r(), d("div", dc, [
      h("p", fc, v(e.title), 1),
      h("p", mc, [
        ne(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (r(), d("p", hc, [
      ne(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, St = /* @__PURE__ */ V(pc, [["__scopeId", "data-v-b27e89b0"]]), vc = { class: "fold-group" }, gc = ["aria-expanded"], yc = { class: "fold-label" }, bc = {
  key: 0,
  class: "fold-count"
}, kc = {
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
    return (a, s) => (r(), d("div", vc, [
      h("button", {
        type: "button",
        class: X(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        h("span", yc, v(e.label), 1),
        e.count !== "" ? (r(), d("span", bc, v(e.count), 1)) : k("", !0),
        h("span", {
          class: X(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, gc),
      e.open ? ne(a.$slots, "default", {}, void 0, !0, 0) : k("", !0)
    ]));
  }
}, sA = /* @__PURE__ */ V(kc, [["__scopeId", "data-v-9ef1865c"]]), wc = 150, $c = () => wc;
function so(e, t, n = $c(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function fi(e, t, n) {
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
const xc = 50, Go = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function oA(e) {
  const t = at().sources.find((n) => n.key === e);
  return t ? Ms(t.read, t.events) : Ms("", []);
}
function mi(e, t, n, a, s = () => !1) {
  const o = E([]), l = E(null), i = E(""), u = E(!1), c = performance.now(), f = E(!1), m = E(""), p = E(null), b = /* @__PURE__ */ new Set();
  let $ = null;
  function y(g) {
    return s() ? (b.add(g), $ ?? ($ = new Promise((S) => setTimeout(() => S(w()), xc)))) : x(g);
  }
  async function w() {
    const g = new Set(b);
    b.clear(), $ = null;
    const S = P, T = await t({ ids: [...g].join(","), limit: g.size });
    if (S !== P) return;
    if (!T.ok) return R();
    const L = new Map(T.value.rows.map((U) => [U.id, U]));
    o.value = o.value.flatMap((U) => g.has(U.id) ? L.has(U.id) ? [L.get(U.id)] : [] : [U]);
  }
  async function x(g) {
    const S = P, T = await t({ "before-id": g + 1, limit: 1 });
    if (S !== P) return;
    if (!T.ok) return R();
    const L = T.value.rows.find((U) => U.id === g);
    o.value = L ? o.value.map((U) => U.id === g ? L : U) : o.value.filter((U) => U.id !== g);
  }
  async function C(g) {
    if (a() && String((g == null ? void 0 : g.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((ee) => ee.id !== g.row_id));
    if (a() && (g != null && g.row_id) && !String(g.event ?? "").endsWith(".create") && o.value.some((ee) => ee.id === g.row_id)) return y(g.row_id);
    if (!(a() && o.value.length && String((g == null ? void 0 : g.event) ?? "").endsWith(".create"))) return R();
    const T = Math.max(...o.value.map((ee) => ee.id)), L = P, U = await t({ "after-id": T });
    if (L !== P) return;
    if (!U.ok) return R();
    const J = new Set(o.value.map((ee) => ee.id));
    o.value = [...U.value.rows.filter((ee) => !J.has(ee.id)), ...o.value];
  }
  async function q() {
    if (!f.value || !o.value.length) return !1;
    const g = P, S = Math.min(...o.value.map((U) => U.id)), T = await t({ "before-id": S });
    if (g !== P) return !1;
    if (!T.ok || !T.value.rows.length) return f.value = !1;
    f.value = Go(T.value, n());
    const L = new Set(o.value.map((U) => U.id));
    return o.value = [...o.value, ...T.value.rows.filter((U) => !L.has(U.id))], !0;
  }
  let P = 0;
  function I(g, S) {
    var U, J;
    const T = g.ok ? e.shared ? [g.value] : ((U = g.value) == null ? void 0 : U.rows) ?? [] : [];
    g.ok && (o.value = S(T)), l.value = g.ok ? g.value : null;
    const L = T.length ? Math.min(...T.map((ee) => ee.id)) : 0;
    g.ok && ((J = g.value) != null && J.rows) && !o.value.some((ee) => ee.id < L) && (f.value = !e.shared && Go(g.value, n())), i.value = g.ok ? "" : g.error, so(c, () => u.value = !0);
  }
  async function Q(g) {
    const S = ++P, T = await t({});
    S === P && I(T, g);
  }
  const W = (g) => {
    if (!a() || !g.length) return g;
    const S = Math.min(...g.map((L) => L.id)), T = Math.max(...g.map((L) => L.id));
    return [...o.value.filter((L) => L.id > T), ...g, ...o.value.filter((L) => L.id < S)];
  }, R = () => Q(W), D = (g) => I(g, W), G = () => Q((g) => g);
  async function _(g, S = null) {
    const T = await fi(S && { target: o, fields: { value: S(o.value) } }, g, e.run);
    return m.value = T.ok ? "" : T.error, p.value = T.ok ? T.value : null, await R(), T;
  }
  return { rows: o, listing: l, failure: i, loaded: u, more: f, load: R, loadLatest: G, older: q, act: _, actionFailure: m, answer: p, context: e, heard: C, showFirst: D, pageSize: n };
}
const Sc = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function Ms(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = at(), l = mi(s, (u) => s.read(s.shared && !Object.keys(u).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Sc(u)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Mc = 2e3;
function oo(e, t, n = Mc) {
  let a = null, s = !1, o = !1, l = !1;
  const i = $e(Be, null), u = () => {
    var y;
    return ((y = i == null ? void 0 : i.visible) == null ? void 0 : y.value) === !1;
  }, c = () => document.hidden || u(), f = async (y) => {
    o = !0;
    try {
      await y();
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
  }, b = async () => {
    l = !0, await f(e), p();
  }, $ = async () => {
    if (!(s || c() || o)) {
      if (clearTimeout(a), !l) return b();
      await m(), p();
    }
  };
  ce(() => {
    var y;
    return (y = i == null ? void 0 : i.visible) == null ? void 0 : y.value;
  }, $), _e(async () => {
    document.addEventListener("visibilitychange", $), u() || await b();
  }), tt(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", $);
  });
}
const hi = typeof document < "u" && document.documentElement.classList.contains("phone"), pi = 120;
var li;
const Wa = globalThis[li = Symbol.for("journal.pressed")] ?? (globalThis[li] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function _c(e = 0) {
  const t = Wa.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, Wa.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, Wa.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function _s(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function vi(e = window) {
  if (!_s(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    _s(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Cs = "journal.stale-build-reload", Cc = 'script[type="module"][src*="/assets/index-"]', Ko = (e) => {
  var t;
  return ((t = e.querySelector(Cc)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Ec(e = document, t = (a, s) => Ee.quietRead(a, s), n = () => vi(window)) {
  const a = Ko(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Ko(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let Ha = "";
function Ac(e, t = () => vi(window)) {
  if (!e) return !1;
  const n = !!Ha && Ha !== e;
  return Ha = e, n && t(), n;
}
const Oc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Tc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Cs) === e.message) return !1;
    t.setItem(Cs, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Ic(e = window.sessionStorage) {
  try {
    e.removeItem(Cs);
  } catch {
    return;
  }
}
const Bc = 2e3, Rc = 3e4, Xe = tn({ starting: !1, external: !1, late: !1, offline: !1 }), lo = () => Xe.starting, Lc = 3;
let zn = 0, Es = 0, gi = 0, yi = [];
async function Nc() {
  try {
    const e = await Ee.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Xe.external };
  }
}
let Yo = null;
const qc = () => Yo ?? (Yo = Nc().finally(() => Yo = null));
function Dc() {
  clearTimeout(Es), clearTimeout(gi), Es = 0, Object.assign(Xe, { starting: !1, external: !1, late: !1, offline: !1 }), yi.splice(0).forEach((e) => e()), Ec();
}
async function Pc() {
  Xe.offline = !navigator.onLine;
  const e = await qc();
  if (Xe.external = e.updating, zn = !e.restarting && !e.updating && e.reachable ? zn + 1 : 0, zn < Lc) return;
  zn = 0, (!Ac(e.started_at) || _s()) && Dc();
}
function bi() {
  Es = setTimeout(async () => {
    await Pc(), Xe.starting && bi();
  }, Bc);
}
function Qo() {
  Xe.starting || (Xe.starting = !0, Xe.offline = !navigator.onLine, bi(), gi = setTimeout(() => Xe.late = !0, Rc));
}
const ki = () => Xe.starting ? new Promise((e) => yi.push(e)) : Promise.resolve();
function Oa(e, t, n = 0) {
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
function jc(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class Fc {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = Oa(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = jc(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const vt = "viewer.shell";
function Wc(e = typeof document < "u" ? document.visibilityState : "visible") {
  return e === "hidden";
}
const Un = 2e4, Hc = 4, Xo = "/api/read-lines", zc = 5e3, Uc = 403, Jo = "/api/repeated-lines", Vc = 10, Gc = 2e3, Kc = 3e5, lA = 6e5, Yc = "X-Journal-Window-Hidden", Vn = 6, Qc = 500, Xc = "/journal/summary", Zo = "/api/server-state", Jc = 2e4, Gn = hi ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Zc = (e) => e.split("?")[0].endsWith(Xc), As = (e, t) => Object.assign(new Error(t), { status: e });
async function ed(e, t, n = As) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const td = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), nd = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), el = (e) => e.split(" ").slice(0, 2).join(" "), rt = "read", Vt = "write", ad = "stream";
class sd {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = Vn;
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = el(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one term and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, u]) => o - u < Gc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < Vc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const i = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(Jo, { method: "POST", headers: { ...Gn, "Content-Type": "application/json" }, body: i }, [{ window: vt, line: Jo, kind: Vt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = _c(n ? pi : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = { ...n, headers: { ...n.headers || {}, [Yc]: Wc() ? "1" : "0" } }, i = s ? { ...l, signal: nd(n.signal, s) } : l;
    try {
      return await fetch(t, a[0].kind === Vt ? { ...i, priority: "high" } : i);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up; a read is tried once more at once first, since the
  // server closes a connection left idle and the read may have gone out on it; a write is never sent twice
  async sent(t, n, a, s = Un) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      if (!(o instanceof TypeError)) throw o;
      if ((n.method || "GET") === "GET")
        try {
          return await this.out(t, n, a, s);
        } catch (l) {
          throw l instanceof TypeError && Qo(), l;
        }
      throw Qo(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= Hc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(Xo, { headers: Gn }, [{ window: vt, line: Xo, kind: rt }], zc).then(async (t) => {
      if (t.status === Uc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw As(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new Fc(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = el(n.join(" ")), i = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
      this.tries = Vn;
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
    const i = a instanceof FormData, u = { method: t, headers: { ...Gn, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: td(a) }, c = s || (i ? Kc : Un);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, u, [{ window: vt, line: n, kind: rt }], c)) : await this.sent(n, u, [{ window: vt, line: n, kind: Vt }], c);
    } catch (f) {
      if (t !== "GET" || !(f instanceof TypeError) || o <= 1) throw f;
      return await new Promise((m) => setTimeout(m, Qc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = Vn, l = {}) {
    this.watcher("sent", t, n, a);
    const i = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return ed(i, `${i.status} ${i.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: vt, line: t, kind: rt }], Un)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: Gn });
    if (!n.ok) throw As(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, Vn, o).then((i) => (this.written(n), i)) : lo() && !Zc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: vt, line: t, kind: ad }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Zo, { cache: "no-store" }, [{ window: vt, line: Zo, kind: rt }], Jc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = vt, line: s = t, limit: o = Un } = {}) {
    const l = (n.method ?? "GET") === "GET" ? rt : Vt;
    return l === Vt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const za = Symbol.for("journal.transport"), Ee = globalThis[za] ?? (globalThis[za] = new sd());
class wi {
  constructor() {
    this.following = lt([]), this.held = /* @__PURE__ */ new Set();
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
      n.patterns.some((a) => io(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function io(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const $i = (e, t) => !e.row_id || t.has(e.row_id), od = (e, t, n) => {
  var a;
  return !e.row_id || (((a = e.changed_ids) == null ? void 0 : a[t]) ?? []).some((s) => n.has(s));
}, ld = (e, t, n) => {
  var a, s;
  return !((s = (a = e.changed_ids) == null ? void 0 : a[t]) != null && s.length) || e.changed_ids[t].some((o) => n.has(o));
}, id = 50, rd = "refresh", ud = 1e3, cd = 3e4, dd = "requested", fd = "after_window", md = 50, Kn = ".*", hd = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function pd(e) {
  const t = {}, n = tn({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let u = {}, c = 0, f = 0, m = !1;
  const p = (_) => u[_] ?? u[`${_.slice(0, _.lastIndexOf("."))}.*`] ?? {};
  function b(_) {
    const g = () => p(_), S = E(void 0), T = mi(e, async (L) => {
      const U = await w(_, L);
      return U.ok && !Object.keys(L).length && (S.value = U.value), U;
    }, () => g().page_size || md, () => !!g().page_size, () => !!g().reads_ids);
    return t[_] = { ...T, data: S, readAt: 0 };
  }
  const $ = new Proxy({}, { get: (_, g) => typeof g != "string" || g.startsWith("__v") ? void 0 : t[g] ?? b(g) }), y = (_) => (u[_].loading !== dd || _.endsWith(Kn)) && (!u[_].tab || u[_].tab === n.tab);
  function w(_, g = {}) {
    return new Promise((S) => {
      a.push({ name: _, flags: g, resolve: S }), a.length === 1 && setTimeout(x);
    });
  }
  async function x() {
    const _ = /* @__PURE__ */ new Map(), g = a.splice(0).filter((L) => {
      const U = JSON.stringify(L.flags);
      return _.has(L.name) || _.set(L.name, U), _.get(L.name) === U ? !0 : (a.push(L), !1);
    });
    a.length && setTimeout(x);
    const S = Object.fromEntries(g.flatMap(({ name: L, flags: U }) => Object.entries(U).map(([J, ee]) => [`${L}.${J}`, ee]))), T = await e.readKeys({ only: [...new Set(g.map(({ name: L }) => L))], state: { ...n, ...S } });
    g.forEach(({ name: L, resolve: U }) => U(T.ok ? T.value.keys[L] : T));
  }
  async function C(_) {
    var L;
    const g = ++f;
    (_.length ? _ : Object.keys(u).filter((U) => !U.endsWith(Kn) && u[U].loading === "first" && y(U))).forEach((U) => l[U] = g);
    const T = await e.readKeys({ only: _, state: { ...n } });
    if (!T.ok) {
      if (T.failure === "cancelled") return !1;
      const U = (_.length ? _ : Object.keys(t)).filter((ee) => (l[ee] ?? 0) <= g);
      U.forEach((ee) => {
        $[ee].readAt = Date.now(), T.failure === "unreachable" ? i.add(ee) : i.delete(ee), $[ee].showFirst(T);
      });
      const J = T.failure === "unreachable" && ((L = e.waitForServer) == null ? void 0 : L.call(e));
      return J && J.then(() => {
        if (m) return;
        const ee = U.filter((oe) => l[oe] === g);
        (ee.length || !_.length && !U.length && f === g) && C(ee);
      }), !1;
    }
    return D(T.value.declared), Object.entries(T.value.keys).forEach(([U, J]) => {
      (l[U] ?? 0) > g || (l[U] = g, $[U].readAt = Date.now(), i.delete(U), J.ok && ($[U].data.value = J.value), $[U].showFirst(J));
    }), !0;
  }
  function q(_) {
    const g = hd(_);
    return g.length ? (g.forEach((S) => o.names.add(S)), o.answer ?? (o.answer = new Promise((S) => setTimeout(() => {
      const T = [...o.names];
      o.names.clear(), o.answer = null, S(C(T));
    })))) : C([]);
  }
  function P(_) {
    _.forEach((g) => s.add(g)), clearTimeout(c), c = setTimeout(() => {
      const g = [...s];
      s.clear(), g.length && q(g);
    }, id);
  }
  const I = (_) => _.endsWith(Kn) ? Object.keys(t).filter((g) => g.startsWith(_.slice(0, -1)) && t[g].readAt) : [_], Q = (_, g) => {
    const S = p(_).event_column;
    return !S || ld(g, S, /* @__PURE__ */ new Set([Number(_.slice(_.lastIndexOf(".") + 1))]));
  }, W = (_) => (u[_] ?? u[`${_.split(".")[0]}.*`]).reload_seconds;
  function R(_) {
    const g = Object.keys(u).filter((T) => _.event === rd || u[T].events.some((L) => io(L, _.event)));
    g.filter((T) => u[T].page_size).forEach((T) => $[T].heard(_));
    const S = g.filter((T) => !u[T].page_size);
    S.filter((T) => !y(T)).forEach((T) => $[T].readAt = 0), P(S.filter(y).flatMap(I).filter((T) => Q(T, _)));
  }
  function D(_) {
    if (Object.keys(u).length) return;
    u = _;
    const g = [...new Set(Object.values(_).flatMap((T) => T.events))];
    g.length && e.follow(g, R);
    const S = Object.keys(_).filter((T) => _[T].loading === fd);
    S.length && C(S);
  }
  ce(() => n.tab, () => {
    const _ = Object.keys(u).filter((g) => !g.endsWith(Kn) && y(g) && !$[g].readAt);
    _.length && C(_);
  }), Te(() => {
    m = !0, clearTimeout(c);
  });
  function G() {
    const _ = Date.now(), g = Object.keys(u).filter((S) => u[S].reload_seconds > 0 && y(S)).flatMap(I).filter((S) => _ - $[S].readAt >= (i.has(S) ? Math.min(W(S) * 1e3, cd) : W(S) * 1e3));
    g.length && P(g);
  }
  return oo(G, () => e.visible.value, ud), queueMicrotask(() => C([])), { props: $, state: n, reload: q, readKey: w };
}
const vd = Symbol("open-view"), Be = Symbol.for("journal.window-context"), xi = Symbol("dock-card"), Si = Symbol.for("journal.inspector-actions");
function gd(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = pd(e));
  return Object.defineProperties(e, {
    props: { get: () => n().props },
    state: { get: () => n().state },
    reload: { value: (a) => n().reload(a) },
    readKey: { value: (a, s) => n().readKey(a, s) }
  });
}
function at() {
  const e = $e(Be, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return gd(e);
}
const yd = (e, t) => e(xi, t), iA = () => $e(xi), Os = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', tl = {
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
  agent: Os,
  worker: Os,
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
}, bd = ["data-icon", "stroke-width", "innerHTML"], se = {
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
      agent: Os,
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
      code: '<path d="M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5"/>',
      eye: '<path d="M1.9 8c1.5-2.6 3.5-3.9 6.1-3.9s4.6 1.3 6.1 3.9c-1.5 2.6-3.5 3.9-6.1 3.9S3.4 10.6 1.9 8Z"/><circle cx="8" cy="8" r="1.8"/>',
      dot: '<circle cx="8" cy="8" r="2.5"/>',
      start: '<path d="M5.5 3.8v8.4L12 8z" stroke-linejoin="round"/>',
      family: '<rect x="6" y="1.8" width="4" height="3.4" rx="1"/><rect x="1.8" y="10.8" width="4" height="3.4" rx="1"/><rect x="10.2" y="10.8" width="4" height="3.4" rx="1"/><path d="M8 5.2v2.6M3.8 10.8V9.4q0-1.6 1.6-1.6h5.2q1.6 0 1.6 1.6v1.4"/>',
      loop: '<path d="M12.6 6.2A4.9 4.9 0 0 0 3.4 6M3.4 9.8a4.9 4.9 0 0 0 9.2.2"/><path d="M12.8 3v3.3H9.5M3.2 13V9.7h3.3"/>'
    };
    return (o, l) => (r(), d("svg", {
      class: "ico",
      "data-icon": e.name,
      style: pe({
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
    }, null, 12, bd));
  }
}, kd = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: "spinner",
      style: pe({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, wd = /* @__PURE__ */ V(kd, [["__scopeId", "data-v-eb453d6f"]]), $d = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = Ca(), a = M(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = E(!1), o = M(() => t.busy || s.value), l = $e(Be, null), i = M(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function u(c) {
      const f = [n.onClick].flat().filter(Boolean).map((p) => p(c)).filter((p) => p instanceof Promise);
      if (!f.length) return;
      const m = setTimeout(() => s.value = !0, pi);
      try {
        await Promise.all(f);
      } finally {
        clearTimeout(m), s.value = !1;
      }
    }
    return (c, f) => (r(), j(Je(e.href ? "a" : "button"), Ne(a.value, {
      type: e.href ? void 0 : O(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: i.value,
      onClick: u
    }), {
      default: N(() => [
        h("span", {
          class: X(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (r(), j(se, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : k("", !0),
          ne(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (r(), j(wd, {
          key: 0,
          class: "btn-spinner"
        })) : k("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ie = /* @__PURE__ */ V($d, [["__scopeId", "data-v-ededdadf"]]), xd = ["aria-checked", "aria-haspopup", "onClick"], Sd = {
  key: 0,
  class: "segmented-dot"
}, Md = {
  key: 1,
  class: "segmented-note"
}, _d = {
  key: 2,
  class: "segmented-count"
}, Cd = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = eo();
    return (s, o) => {
      const l = Uu("tip");
      return r(), d("span", {
        class: X(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (r(!0), d(B, null, Z(e.options, (i) => ge((r(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: X(["segmented-option", { on: i.key === e.value }]),
          onClick: (u) => n("pick", i.key)
        }, [
          i.dot ? (r(), d("span", Sd)) : k("", !0),
          z(" " + v(i.label) + " ", 1),
          i.note ? (r(), d("small", Md, v(i.note), 1)) : k("", !0),
          i.count !== void 0 ? (r(), d("em", _d, v(i.count), 1)) : k("", !0)
        ], 10, xd)), [
          [l, i.tip || i.title, `${O(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Mt = /* @__PURE__ */ V(Cd, [["__scopeId", "data-v-c89bc92d"]]), Ed = {
  key: 0,
  class: "more-items"
}, Ad = {
  key: 0,
  role: "alert"
}, Od = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (r(), d("div", Ed, [
      e.failure ? (r(), d("p", Ad, v(e.failure), 1)) : k("", !0),
      e.more ? (r(), j(ie, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: N(() => [
          z(v(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : k("", !0)
    ])) : k("", !0);
  }
}, Bn = /* @__PURE__ */ V(Od, [["__scopeId", "data-v-10464014"]]), Td = { class: "link-group" }, Id = {
  class: "group-label",
  "data-link-kind": ""
}, Bd = ["disabled", "onClick"], Rd = { class: "title" }, Ld = { class: "relations" }, Nd = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(!1), o = M(() => s.value ? n.rows : n.rows.slice(0, 3)), l = M(() => `${n.model.replaceAll("_", " ").replace(/^./, (f) => f.toUpperCase())} ${n.count}`), i = (f) => f.endpoint.unavailable || !f.endpoint.open_ref, u = (f) => ({ [n.linkAttribute]: !0, "data-link-model": f.endpoint.model, "data-link-id": f.endpoint.id }), c = (f) => `${f.endpoint.model === "doc" && f.endpoint.id === n.documentId ? "Design document" : f.endpoint.model.replaceAll("_", " ").replace(/^./, (m) => m.toUpperCase())} ${f.endpoint.id}, ${f.relations.map((m) => m.replaceAll("_", " ")).join(", ")}`;
    return (f, m) => (r(), d("div", Td, [
      h("div", Id, v(l.value), 1),
      (r(!0), d(B, null, Z(o.value, (p) => (r(), d("button", Ne({
        key: `${p.endpoint.model}:${p.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, u(p), {
        disabled: i(p),
        onClick: (b) => a("open", p)
      }), [
        h("span", Rd, v(p.endpoint.title), 1),
        h("span", Ld, [
          z(v(c(p)), 1),
          i(p) ? (r(), d(B, { key: 0 }, [
            z(" · Unavailable")
          ], 64)) : k("", !0)
        ])
      ], 16, Bd))), 128)),
      e.rows.length > 3 && !s.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: m[0] || (m[0] = (p) => s.value = !0)
      }, "Show more")) : k("", !0)
    ]));
  }
}, qd = /* @__PURE__ */ V(Nd, [["__scopeId", "data-v-be6f079c"]]), Dd = ["data-loaded"], Pd = { class: "rows" }, jd = ["disabled", "onClick"], Fd = { class: "title" }, Wd = { class: "relations" }, Hd = { key: 2 }, zd = {
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
    const n = e, a = t, s = E([]), o = E({}), l = E(0), i = E(""), u = E(null), c = E(!1), f = E("");
    let m = 0;
    const p = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, b = (R) => p[R] || `${R.replaceAll("_", " ").replace(/^./, (D) => D.toUpperCase())}s`, $ = M(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((R, D) => R + D, 0) },
      ...Object.entries(o.value).filter(([R]) => !n.onlyKinds.length || n.onlyKinds.includes(R)).map(([R, D]) => ({ key: R, label: b(R), count: D }))
    ]), y = M(() => {
      const R = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((G) => G.endpoint.model))].map((G) => [G, s.value.filter((_) => _.endpoint.model === G).length])), D = { doc: 0, task: 1, message: 2 };
      return Object.entries(R).sort(([G], [_]) => (D[G] ?? 3) - (D[_] ?? 3)).map(([G, _]) => ({ model: G, count: _, rows: s.value.filter((g) => g.endpoint.model === G) }));
    }), w = (R) => R.endpoint.unavailable || !R.endpoint.open_ref, x = (R) => ({ [n.linkAttribute]: !0, "data-link-model": R.endpoint.model, "data-link-id": R.endpoint.id }), C = (R) => `${R.endpoint.model === "doc" && R.endpoint.id === n.documentId ? "Design document" : R.endpoint.model.replaceAll("_", " ").replace(/^./, (D) => D.toUpperCase())} ${R.endpoint.id}, ${R.relations.map((D) => D.replaceAll("_", " ")).join(", ")}`;
    async function q(R = 1) {
      const D = ++m;
      c.value = !0, f.value = "";
      const G = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(R), "--page-size", String(n.pageSize)];
      n.outsidePlan && G.push("--outside-plan"), n.documentId && G.push("--first-counterpart", `doc:${n.documentId}`), i.value && G.push("--kind", i.value);
      try {
        const _ = await n.read(G);
        if (D !== m) return;
        if (!_.ok) {
          f.value = _.error;
          return;
        }
        const g = _.value.counterparts ?? [], S = R === 1 ? g : [...s.value, ...g];
        s.value = [...new Map(S.map((T) => [`${T.endpoint.model}:${T.endpoint.id}`, T])).values()], o.value = _.value.categories ?? {}, l.value = _.value.total, u.value = _.value.next_page ?? null;
      } catch (_) {
        D === m && (f.value = _.message);
      } finally {
        D === m && (c.value = !1);
      }
    }
    function P(R) {
      if (w(R)) return;
      const [D, G] = R.endpoint.open_ref.split(":");
      a("open", { table: D, id: Number(G) });
    }
    function I(R) {
      i.value = R, q();
    }
    const Q = () => !c.value && u.value && q(u.value), W = M(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return ce(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], u.value = null, i.value = "", q();
    }, { immediate: !0 }), (R, D) => s.value.length || c.value || f.value || e.empty ? (r(), d("section", {
      key: 0,
      class: X(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      $.value.length > 2 ? (r(), j(Mt, {
        key: 0,
        options: $.value,
        value: i.value,
        wrap: "",
        onPick: I
      }, null, 8, ["options", "value"])) : k("", !0),
      h("div", Pd, [
        e.grouped ? (r(!0), d(B, { key: 0 }, Z(y.value, (G) => (r(), j(qd, {
          key: G.model,
          model: G.model,
          count: G.count,
          rows: G.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: P
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (r(!0), d(B, { key: 1 }, Z(s.value, (G) => (r(), d("button", Ne({
          key: `${G.endpoint.model}:${G.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, x(G), {
          disabled: w(G),
          onClick: (_) => P(G)
        }), [
          h("span", Fd, v(G.endpoint.title), 1),
          h("span", Wd, [
            z(v(C(G)), 1),
            w(G) ? (r(), d(B, { key: 0 }, [
              z(" · Unavailable")
            ], 64)) : k("", !0)
          ])
        ], 16, jd))), 128)),
        !s.value.length && !c.value && !f.value && e.empty ? (r(), d("p", Hd, v(e.empty), 1)) : k("", !0),
        A(Bn, {
          more: !!u.value,
          loading: c.value,
          failure: f.value,
          label: W.value,
          onMore: Q
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, Dd)) : k("", !0);
  }
}, Ud = /* @__PURE__ */ V(zd, [["__scopeId", "data-v-3b23de37"]]), Vd = (e, t, n) => Math.max(t, Math.min(n, e)), Gd = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Mi = /* @__PURE__ */ new WeakMap(), Kd = (e, t) => Mi.set(e, t);
function Yd(e, t) {
  for (let n = t; n; n = Mi.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function _i(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !Yd(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Te(() => window.removeEventListener("click", n));
}
const Ot = 8, Qd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "MenuPanel",
  props: {
    anchor: { type: Object, default: null },
    // a spot on the screen instead of an element: {x, y}, and flipX when it opens leftward from there (a submenu opens beside its item)
    point: { type: Object, default: null },
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
    const a = e, s = E(null), o = (S) => S ? `${S}px` : void 0, l = M(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), i = E({ w: 0, h: 0 }), u = (S) => ({ left: S.x, right: S.flipX ?? S.x, top: S.y, bottom: S.y }), c = E(a.anchor ? a.anchor.getBoundingClientRect() : a.point ? u(a.point) : null), f = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), m = (S) => ({
      left: Math.max(0, S.left),
      top: Math.max(0, S.top),
      right: Math.min(window.innerWidth, S.right),
      bottom: Math.min(window.innerHeight, S.bottom)
    }), p = (S) => {
      const T = S.closest(".pane, .float-window");
      return T ? m(T.getBoundingClientRect()) : f();
    }, b = (S, T) => `${Math.max(0, S ? Math.min(S, T) : T)}px`;
    function $(S, T) {
      return {
        below: S.bottom - T.bottom - a.gap - Ot,
        above: T.top - S.top - a.gap - Ot,
        across: S.right - S.left - 2 * Ot
      };
    }
    function y(S) {
      if (!a.anchor) return f();
      const T = p(a.anchor), L = $(T, S);
      return i.value.w <= L.across && i.value.h <= Math.max(L.below, L.above) ? T : f();
    }
    const w = M(() => {
      if (!c.value) return l.value;
      const S = c.value, T = y(S), L = $(T, S), { w: U, h: J } = i.value, ee = a.point ? S.left + U > T.right - Ot : a.align === "auto" ? S.left + S.right > T.left + T.right : a.align === "right", oe = Vd(ee ? S.right - U : S.left, T.left + Ot, Math.max(T.left + Ot, T.right - U - Ot)), ke = J > L.below && L.above > L.below ? { bottom: `${window.innerHeight - S.top + a.gap}px`, maxHeight: b(a.maxHeight, L.above) } : { top: `${S.bottom + a.gap}px`, maxHeight: b(a.maxHeight, L.below) };
      return { ...l.value, ...ke, left: `${oe}px`, maxWidth: b(a.maxWidth, L.across) };
    }), x = n, C = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function q(S) {
      const T = C(), L = T.indexOf(document.activeElement);
      T[(L + S + T.length) % T.length].focus();
    }
    const P = { ArrowDown: () => q(1), ArrowUp: () => q(-1), Escape: () => x("close") }, I = (S) => P[S.key] && (S.preventDefault(), P[S.key]()), Q = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let W = 0;
    const R = new ResizeObserver(() => {
      cancelAnimationFrame(W), W = requestAnimationFrame(Q);
    });
    _i(s, (S) => a.anchor && !a.anchor.contains(S.target) && x("close"));
    const D = (S, T) => ["top", "left", "right", "bottom"].some((L) => Math.abs(S[L] - T[L]) > 1), G = (S) => S.bottom < 0 || S.top > window.innerHeight;
    let _ = 0;
    function g() {
      if (a.anchor) {
        const S = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || G(S)) return x("close");
        D(S, c.value) && (c.value = S);
      }
      _ = requestAnimationFrame(g);
    }
    return _e(() => {
      a.anchor && s.value && Kd(s.value, a.anchor), Q(), s.value && R.observe(s.value), !a.plain && C()[0] && C()[0].focus(), g();
    }), Te(() => {
      R.disconnect(), cancelAnimationFrame(_), cancelAnimationFrame(W);
    }), t({ element: s }), (S, T) => (r(), j(In, {
      to: "body",
      disabled: !e.anchor && !e.point
    }, [
      h("div", Ne({
        ref_key: "panel",
        ref: s
      }, S.$attrs, {
        class: ["menu-panel", { anchored: e.anchor || e.point }],
        style: w.value,
        onKeydown: I
      }), [
        ne(S.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Wt = /* @__PURE__ */ V(Qd, [["__scopeId", "data-v-8094ec27"]]), Xd = { class: "split-button" }, Jd = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = E(null), s = E(!1), o = () => s.value = !1;
    return (l, i) => (r(), d("span", Xd, [
      A(ie, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: i[0] || (i[0] = (u) => n("main"))
      }, {
        default: N(() => [
          ne(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      h("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        A(ie, {
          variant: e.variant,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: i[1] || (i[1] = (u) => s.value = !s.value)
        }, {
          default: N(() => [
            A(se, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (r(), j(Wt, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: N(() => [
          ne(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : k("", !0)
    ]));
  }
}, Zd = /* @__PURE__ */ V(Jd, [["__scopeId", "data-v-c258494d"]]), ef = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, tf = {
  key: 1,
  class: "menu-item-text"
}, nf = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: X(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (r(), d("span", ef, v(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (r(), d("span", tf, [
        h("span", null, [
          ne(t.$slots, "default", {}, void 0, !0)
        ]),
        h("small", null, v(e.description), 1)
      ])) : ne(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, We = /* @__PURE__ */ V(nf, [["__scopeId", "data-v-fec99974"]]), af = ["aria-expanded"], sf = { class: "drop-label" }, of = ["value"], lf = {
  key: 1,
  class: "drop-lead"
}, rf = { class: "drop-item-text" }, uf = {
  key: 2,
  class: "drop-note"
}, cf = {
  key: 1,
  class: "drop-none"
}, df = {
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
    const n = e, a = t, s = E(!1), o = E(null), l = E(""), i = M(() => {
      const c = l.value.trim().toLowerCase();
      return c ? n.items.filter((f) => `${f.label} ${f.note || ""}`.toLowerCase().includes(c)) : n.items;
    });
    function u(c) {
      s.value = !1, a("pick", c);
    }
    return (c, f) => (r(), d("div", {
      class: X(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      h("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: X(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: f[0] || (f[0] = (m) => s.value = !s.value)
      }, [
        e.icon ? (r(), j(se, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : k("", !0),
        h("span", sf, v(e.label), 1),
        A(se, {
          name: "down",
          size: 11
        })
      ], 10, af),
      s.value ? (r(), j(Wt, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: f[2] || (f[2] = (m) => s.value = !1)
      }, {
        default: N(() => [
          e.searchable ? (r(), d("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: f[1] || (f[1] = (m) => l.value = m.target.value)
          }, null, 40, of)) : k("", !0),
          (r(!0), d(B, null, Z(i.value, (m) => (r(), j(We, {
            key: m.key,
            on: m.key === e.picked,
            "data-drop-item": m.key,
            onClick: (p) => u(m)
          }, {
            default: N(() => [
              m.running !== void 0 ? (r(), d("span", {
                key: 0,
                class: X(["drop-dot", { live: m.running }])
              }, null, 2)) : k("", !0),
              m.lead ? (r(), d("span", lf, v(m.lead), 1)) : k("", !0),
              h("span", rf, v(m.label), 1),
              m.note ? (r(), d("span", uf, v(m.note), 1)) : k("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? k("", !0) : (r(), d("p", cf, v(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : k("", !0)
    ], 2));
  }
}, ro = /* @__PURE__ */ V(df, [["__scopeId", "data-v-29dfcce5"]]), ff = 0, mf = "/api/lines", hf = "/api/line", nl = 5e3, al = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), sl = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), Ua = (e) => JSON.stringify(e.line), ol = () => new DOMException("cancelled", "AbortError");
class pf {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(Ua(t))) {
        Ee.whenFree(() => this.readAlone(l));
        return;
      }
      this.waiting.push(l), this.sendSoon();
    });
  }
  // a write always finishes, also when its window has gone: it carries no signal
  write(t) {
    return new Promise((n, a) => this.alone({ body: t, resolve: n, reject: a }, Vt));
  }
  sendSoon() {
    this.timer ?? (this.timer = setTimeout(() => Ee.whenFree(() => this.send()), ff));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(ol())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(ol()), n.abort();
    });
    t.forEach((o, l) => {
      var i;
      return (i = o.signal) == null ? void 0 : i.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Ee.sent(mf, al({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => sl(i.body, rt)), nl);
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
    await this.alone(t, rt), Date.now() - n < nl ? this.slow.delete(Ua(t.body)) : this.slow.add(Ua(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Ee.sent(hf, al(t.body, t.signal), [sl(t.body, n)], n === rt ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const Ci = new pf(), vf = "/api/window";
function gf(e, t, n, a, s) {
  const o = Object.fromEntries(Object.entries(a).filter(([, f]) => f !== "" && f !== null && f !== void 0)), l = new URLSearchParams({ environment: t, ...o }), i = `${vf}?${l}`, u = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, c = (f) => Ee.whenFree(async () => {
    const m = await Ee.sent(i, { signal: f, headers: u }, [{ window: e, line: i, kind: rt }]);
    if (!m.ok) throw new Error((await m.json()).error);
    return m.json();
  });
  return Ee.joined(`${e} ${n.join(",")} ${l}`, c, s);
}
const Ei = /* @__PURE__ */ new Map();
class yf {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = lt({ buttons: [], missing: {} }), this.loading = lt(!1), this.loaded = lt(!1), this.failed = lt(""), this.pending = null;
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
function rA(e, t) {
  const n = new yf(e, t);
  return Ei.set(e, n), n.load().catch(() => {
  }), n;
}
const uo = (e) => Ei.get(e);
function bf(e, t, n) {
  const a = uo(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function kf(e, t) {
  if (!e) return !0;
  const n = uo(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const wf = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let Ai = {};
async function uA(e = (t) => Ee.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (Ai = (await t.json()).states);
}
const co = (e, t) => {
  var n;
  return (n = Ai[e]) == null ? void 0 : n[t];
}, wn = (e, t) => {
  var n;
  return ((n = co(e, t)) == null ? void 0 : n.label) ?? wf(t);
}, fo = (e, t) => {
  var n;
  return ((n = co(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, $f = (e, t) => {
  var n;
  return ((n = co(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, xf = Symbol("pane-page"), Ta = Symbol("inspector-host"), Oi = { 1: "refused", 2: "usage", 3: "fault" }, Sf = 100, Mf = 50, _f = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, Cf = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function Ef({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: i, options: u = E({}), declared: c = [], page: f = null, setOption: m = () => {
}, autoScroll: p = "", tabs: b = [], sources: $ = [], links: y = {}, search: w = {}, readOnly: x = !1, shared: C = null }) {
  const q = /* @__PURE__ */ new Map(), P = (J, ee) => l.follow(e, J, (oe) => {
    q.clear(), ee(oe);
  }, a), I = new AbortController(), Q = E(!1), W = performance.now();
  let R = 0, D = 0, G = () => {
  };
  const _ = new Promise((J) => G = J);
  I.signal.addEventListener("abort", G, { once: !0 });
  const g = () => {
    clearTimeout(D), D = setTimeout(() => {
      R === 0 && so(W, () => {
        Q.value = !0, G();
      });
    }, Mf);
  }, S = (J, ee) => (R += 1, Lt(e, J, t, I.signal, ee).finally(() => {
    R -= 1, g();
  })), T = (J, ee) => (g(), _.then(() => I.signal.aborted ? ht : Lt(e, J, t, I.signal, ee))), L = ({ only: J = [], state: ee = {} } = {}) => (R += 1, Of(() => gf(e, t, J, ee, I.signal), I.signal).finally(() => {
    R -= 1, g();
  })), U = (J, { unbatched: ee = !1, deferred: oe = !1 } = {}) => {
    const le = q.get(J);
    if (le && performance.now() - le.at < Sf) return le.answer;
    const ke = oe && !Q.value ? T(J, ee) : S(J, ee);
    return q.set(J, { answer: ke, at: performance.now() }), ke;
  };
  return {
    answered: Q,
    settle: g,
    window: e,
    environment: t,
    agent: n,
    page: f,
    visible: M(() => a()),
    permissions: s,
    autoScroll: p,
    tabs: b,
    sources: $,
    links: y,
    search: w,
    readOnly: x,
    shared: C,
    read: U,
    readKeys: L,
    waitForServer: () => lo() ? ki() : null,
    run: (J) => Lt(e, J, t, I.signal),
    upload: (J) => If(J, e, I.signal),
    cancel: () => I.abort(),
    signal: I.signal,
    subscriptions: l,
    follow: (J, ee) => P([J].flat().filter((oe) => o.some((le) => io(le, oe))), ee),
    // for a dock of the chat, whose row's term the window cannot declare ahead
    followUndeclared: P,
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (J) => M(() => {
      var ee;
      return u.value[J] ?? ((ee = c.find((oe) => oe.key === J)) == null ? void 0 : ee.default);
    }),
    setting: async (J, ee) => {
      const oe = await U(`window setting ${e} ${J}`);
      return oe.ok ? oe.value.value : ee;
    },
    setOption: m,
    keep: (J, ee) => Lt(e, ["window", "save-setting", e, J, JSON.stringify(ee)], t, I.signal)
  };
}
function Ti(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const ht = { ok: !1, failure: "cancelled", error: "" }, mo = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function Ii(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? ht : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: Oi[n.code] || "fault", error: Ti(n.error) };
  } catch {
    return t != null && t.aborted ? ht : { ok: !1, failure: "unreachable", error: mo };
  }
}
const Af = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: Oi[e.code] || "fault", error: Ti(e.error) };
async function Of(e, t) {
  try {
    const n = await e();
    return t.aborted ? ht : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, Af(s)])) } };
  } catch {
    return t.aborted ? ht : { ok: !1, failure: "unreachable", error: mo };
  }
}
async function Bi(e, t, n) {
  const a = await Ii(() => Ci.read(e, t, n), t);
  return a.failure !== "unreachable" || !lo() ? a : (await ki(), t.aborted ? ht : Bi(e, t, n));
}
function Lt(e, t, n, a = void 0, s = !1) {
  return Ee.held(() => Tf(e, t, n, a, s), Ee.knownRead(Array.isArray(t) ? t : ho(t)));
}
async function Tf(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : ho(t), environment: n };
  return await Ee.isRead(o.line) ? Ee.joined(JSON.stringify(o), (l, i) => Bi({ ...o, attribution: i }, l, s), a, o).catch(() => ht) : Ii(() => Ci.write({ ...o, attribution: {
    client_id: Ee.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function If(e, t, n = void 0) {
  try {
    const a = await Ee.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? ht : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? ht : { ok: !1, failure: "unreachable", error: mo };
  }
}
function ho(e) {
  return [...e.matchAll(_f)].map(([t]) => t.replace(Cf, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Bf = (e) => `show-${e}`, cA = (e, t, n) => e.filter((a) => {
  var s;
  return n(Bf((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), po = "messages.chat", oa = "main", Ri = "Main agent", Rf = { main: Ri, worker: "Worker", helper: "Helper" }, Lf = "journal-", vo = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), Nf = (e) => vo(e.replace(Lf, "").replaceAll("-", " ")), qf = (e) => `${e.role} ${e.number}`, Df = (e) => e.role === oa ? Ri : `${vo(e.role)} ${e.number}`;
function Jt(e, t = e.facts) {
  const n = (t == null ? void 0 : t.profile) || e.profile || "", a = e.role === oa || !n ? Rf[e.role] ?? vo(e.role) : Nf(n), s = e.role === oa ? "" : qf(e), o = e.role === oa ? a : n ? `${a} · ${s}` : `${a} ${e.number}`;
  return { title: a, subtext: s, text: o, name: Df(e) };
}
const Pf = {
  key: 0,
  class: "agent-failure",
  role: "alert"
}, jf = {
  __name: "ButtonAgentField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E([]), o = E(""), l = M(() => [...s.value].sort((c, f) => +(f.role === n.field.first_role) - +(c.role === n.field.first_role) || c.id - f.id).map((c) => ({ key: String(c.number), label: Jt(c).title, note: Jt(c).subtext }))), i = M(() => l.value.find((c) => c.key === n.value));
    async function u() {
      const c = await Lt(po, ["agent", "running"], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
    }
    return u(), (c, f) => (r(), d(B, null, [
      A(ro, {
        label: i.value ? i.value.label : "Choose an agent",
        items: l.value,
        picked: e.value,
        empty: "No agent is running",
        wide: "",
        "data-agent-field": "",
        onPick: f[0] || (f[0] = (m) => a("pick", m.key))
      }, null, 8, ["label", "items", "picked"]),
      o.value ? (r(), d("p", Pf, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, Ff = /* @__PURE__ */ V(jf, [["__scopeId", "data-v-d2ea58f1"]]), Wf = {
  key: 0,
  class: "template-brief"
}, Hf = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, zf = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E([]), o = E(""), l = M(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = M(() => s.value.find((c) => String(c.id) === n.value));
    async function u() {
      const c = await Lt(po, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const f = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), m = s.value.find((p) => p.title === f);
      m && a("pick", String(m.id));
    }
    return u(), (c, f) => (r(), d(B, null, [
      A(Mt, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: f[0] || (f[0] = (m) => a("pick", m))
      }, null, 8, ["options", "value"]),
      i.value ? (r(), d("p", Wf, v(i.value.brief), 1)) : k("", !0),
      o.value ? (r(), d("p", Hf, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, Uf = /* @__PURE__ */ V(zf, [["__scopeId", "data-v-14be8a5c"]]), Vf = { class: "info-tip" }, Gf = ["aria-label"], Kf = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, Yf = {
  __name: "InfoTip",
  props: { lines: { type: Array, required: !0 }, label: { type: String, default: "More information" } },
  setup(e) {
    return (t, n) => (r(), d("span", Vf, [
      h("button", {
        type: "button",
        class: "info-tip-icon",
        "aria-label": e.label,
        "data-info-tip": ""
      }, [
        A(se, {
          name: "info",
          size: 13
        })
      ], 8, Gf),
      h("span", Kf, [
        (r(!0), d(B, null, Z(e.lines, (a, s) => (r(), d("span", {
          key: s,
          class: "info-tip-line"
        }, v(a), 1))), 128))
      ])
    ]));
  }
}, Li = /* @__PURE__ */ V(Yf, [["__scopeId", "data-v-a2fe5ff1"]]), Qf = { class: "form-field" }, Xf = { class: "form-field-head" }, Jf = ["for"], Zf = {
  key: 1,
  class: "form-field-aside"
}, em = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", Qf, [
      h("div", Xf, [
        h("label", {
          class: "form-field-label",
          for: t.$props.for
        }, v(e.label), 9, Jf),
        e.help ? (r(), j(Li, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : k("", !0),
        t.$slots.aside ? (r(), d("span", Zf, [
          ne(t.$slots, "aside", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      ne(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Ni = /* @__PURE__ */ V(em, [["__scopeId", "data-v-302c40bf"]]), Ts = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, tm = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Ca(), n = M(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => ge((r(), d("textarea", Ne({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [O(Ts), O(t).value]
    ]);
  }
}), qi = /* @__PURE__ */ V(tm, [["__scopeId", "data-v-e130a5b9"]]), nm = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = eo(), o = M(() => n.field.choices ? "choice" : n.field.target ? "template" : n.field.first_role ? "agent" : "text");
    return (l, i) => (r(), j(Ni, {
      label: e.field.label,
      for: O(s),
      "data-button-field": e.field.name
    }, {
      default: N(() => [
        A(Ft, { value: o.value }, {
          choice: N(() => [
            A(Mt, {
              id: O(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (u) => a("pick", u))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: N(() => [
            A(Uf, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          agent: N(() => [
            A(Ff, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[2] || (i[2] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: N(() => [
            A(qi, {
              id: O(s),
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
}, Ia = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (r(), j(ie, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: N(() => [
        A(se, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function am(e, t, n, a = () => window) {
  _e(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Te(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const sm = (e, t = () => !0) => am("keydown", (n) => n.key === "Escape" && t() && e());
function Di(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = E(!1), s = M(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return sm(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const om = 80, Ut = tn([]);
function Pi(e) {
  const t = Symbol("layer"), n = () => Ut.includes(t) && Ut.splice(Ut.indexOf(t), 1);
  return ce(
    e,
    (a) => {
      a && !Ut.includes(t) && Ut.push(t), a || n();
    },
    { immediate: !0 }
  ), Te(n), M(() => om + Math.max(0, Ut.indexOf(t)));
}
let ji = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return ji = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const lm = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function im(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(lm)];
    if (!l.length) return o.preventDefault();
    const [i, u] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), u.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === u && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  _e(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : ji, document.addEventListener("keydown", s), Re(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Te(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const rm = ["aria-modal", "aria-label", "aria-labelledby"], um = {
  key: 0,
  class: "dialog-head"
}, cm = ["id", "tabindex"], dm = {
  key: 1,
  class: "dialog-foot"
}, fm = 500, mm = 400, hm = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Di(a, n), i = Pi(s), u = E(null), c = E(null), f = E(null), m = eo(), p = E(!1), b = Date.now();
    n.modal && im(c, () => a("escape"), f);
    function $() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, mm);
    }
    function y(C) {
      !n.modal || Date.now() - b >= fm || ![" ", "Enter"].includes(C.key) || (C.preventDefault(), C.stopPropagation());
    }
    const w = () => u.value && (u.value.scrollTop = u.value.scrollHeight), x = new MutationObserver(w);
    return ce(u, (C) => {
      x.disconnect(), C && n.follow && (x.observe(C, { childList: !0, subtree: !0, characterData: !0 }), w());
    }), Te(() => x.disconnect()), (C, q) => (r(), j(In, { to: "body" }, [
      A(nn, {
        name: "dialog",
        appear: "",
        onAfterLeave: O(l)
      }, {
        default: N(() => [
          O(s) ? (r(), d("div", {
            key: 0,
            class: X(["dialog", { large: e.large, sheet: e.sheet }]),
            style: pe({ zIndex: O(i) }),
            onClick: he($, ["self"])
          }, [
            h("section", {
              ref_key: "panel",
              ref: c,
              class: X(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, huge: e.huge, sheet: e.sheet, nudged: p.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? O(m) : void 0,
              onKeydownCapture: y
            }, [
              e.bare ? k("", !0) : (r(), d("header", um, [
                h("h3", {
                  id: O(m),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, v(e.title), 9, cm),
                e.closable ? (r(), j(Ia, {
                  key: 0,
                  onClick: O(o)
                }, null, 8, ["onClick"])) : k("", !0)
              ])),
              h("div", {
                ref_key: "body",
                ref: u,
                class: X(["dialog-body", { bare: e.bare, padded: e.padded }])
              }, [
                ne(C.$slots, "default", {}, void 0, !0)
              ], 2),
              C.$slots.foot ? (r(), d("footer", dm, [
                ne(C.$slots, "foot", {}, void 0, !0)
              ])) : k("", !0)
            ], 42, rm)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, an = /* @__PURE__ */ V(hm, [["__scopeId", "data-v-089c42bc"]]), pm = {
  class: "action-output",
  "data-action-output": ""
}, vm = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), j(an, {
      padded: "",
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: N(() => [
        h("pre", pm, v(e.text), 1)
      ]),
      _: 1
    }));
  }
}, gm = /* @__PURE__ */ V(vm, [["__scopeId", "data-v-b32f94a4"]]);
function ym(e) {
  const t = document.body.appendChild(document.createElement("div")), n = Vu(gm, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const bm = (e, t, n = {}) => ho(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function Rn(e, t, n, a = {}) {
  var s;
  try {
    if (!await kf(e.module, n)) return { ok: !1, error: "" };
    const o = await Lt(po, bm(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && ym(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const km = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Va = [
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
}), Ln = {
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
    filters: Va
  }),
  tasks: we("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: Va
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
  pins: we("Pin", "band", "One line pinned to the chat while it matters", { filters: Va }),
  reactions: we("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: we("Plugin", "plug", "An installed extension that responds to events and can run background services", { scope: "project" }),
  environments: we("Environment", "branch", "A separate workspace with messages, tasks, memories, plans and settings", { scope: "project" }),
  agents: we("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  agent_message_records: we("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
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
}, wm = ["secrets", "plugins"], Fi = Object.keys(Ln).filter((e) => !(hi && wm.includes(e)));
M(() => Fi.map((e) => ({ name: e, ...Ln[e] })));
const sn = (e) => Ln[e], Wi = new Map(Fi.flatMap((e) => [e, e.replace(/s$/, ""), Ln[e].title.toLowerCase()].map((t) => [t, e]))), dt = (e) => Wi.get(String(e).toLowerCase()) || "", dA = (e) => {
  var t;
  return ((t = Ln[dt(e)]) == null ? void 0 : t.title) || String(e).charAt(0).toUpperCase() + String(e).slice(1);
}, Hi = [...Wi.keys()].sort((e, t) => t.length - e.length).join("|"), $m = {
  class: "button-form",
  "data-button-form": ""
}, xm = {
  key: 0,
  class: "button-form-title"
}, Sm = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, Mm = { class: "button-form-actions" }, _m = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(Object.fromEntries(n.button.fields.map((f) => [f.name, f.default || ""]))), o = E(!1), l = E(""), i = M(() => n.button.fields.every((f) => s.value[f.name].trim().length > 0)), u = M(() => {
      var m;
      if (!n.row) return n.button.label;
      const f = ((m = sn(dt(n.row.term))) == null ? void 0 : m.title) || "Item";
      return `${n.button.label} · ${f} ${n.row.id}`;
    });
    async function c() {
      if (o.value || !i.value) return;
      o.value = !0;
      const f = await Rn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = f.ok ? "" : f.error, f.ok && (a("done"), a("close"));
    }
    return (f, m) => (r(), j(an, {
      padded: "",
      title: u.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: m[1] || (m[1] = (p) => a("close"))
    }, {
      default: N(() => {
        var p;
        return [
          h("div", $m, [
            (p = e.row) != null && p.title ? (r(), d("p", xm, v(e.row.title), 1)) : k("", !0),
            (r(!0), d(B, null, Z(e.button.fields, (b) => (r(), j(nm, {
              key: b.name,
              field: b,
              value: s.value[b.name],
              environment: e.environment,
              onPick: ($) => s.value[b.name] = $
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (r(), d("p", Sm, v(l.value), 1)) : k("", !0),
            h("div", Mm, [
              A(ie, {
                small: "",
                onClick: m[0] || (m[0] = (b) => a("close"))
              }, {
                default: N(() => [...m[2] || (m[2] = [
                  z("Cancel", -1)
                ])]),
                _: 1
              }),
              A(ie, {
                variant: "primary",
                small: "",
                disabled: !i.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: c
              }, {
                default: N(() => [...m[3] || (m[3] = [
                  z("Send", -1)
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
}, Cm = /* @__PURE__ */ V(_m, [["__scopeId", "data-v-e3f0d786"]]), Em = ["aria-busy"], Am = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, Om = { class: "button-slot-confirm-text" }, Tm = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Im = {
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
    const n = e, a = t, s = M(() => uo(n.environment)), o = M(
      () => {
        var x;
        return !n.readOnly && ((x = s.value) == null ? void 0 : x.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = M(() => {
      var x;
      return !n.readOnly && ((x = s.value) == null ? void 0 : x.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), u = M(() => n.readOnly ? [] : bf(n.environment, n.name, n.row)), c = E(null), f = E(null), m = E(""), p = E(!1), b = (x) => [x.from ? `From ${x.from}` : "", x.tip, x.warning].filter(Boolean).join(" · "), $ = (x) => x.icon || (x.warning ? "dot" : "");
    function y(x) {
      if (!(p.value || n.readOnly)) {
        if (x.fields.length) {
          c.value = x;
          return;
        }
        if (x.confirm) {
          f.value = x;
          return;
        }
        return w(x);
      }
    }
    async function w(x) {
      f.value = null, m.value = "", a("failure", ""), p.value = !0;
      const C = await Rn(x, n.row, n.environment);
      p.value = !1, m.value = C.ok ? "" : C.error;
      const q = x.label.toLowerCase() + (n.objectName && !x.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", C.ok ? "" : `Could not ${q}: ${C.error}`), C.ok && a("done");
    }
    return (x, C) => (r(), d("span", {
      class: X(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (r(), d(B, { key: 0 }, [
        C[5] || (C[5] = h("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        A(ie, {
          small: "",
          onClick: i
        }, {
          default: N(() => [...C[4] || (C[4] = [
            z("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && f.value ? (r(), d("span", Am, [
        h("span", Om, v(f.value.confirm), 1),
        A(ie, {
          small: "",
          variant: f.value.danger ? "ghost" : "primary",
          bordered: f.value.danger,
          class: X({ danger: f.value.danger }),
          "data-button-confirm-yes": "",
          onClick: C[0] || (C[0] = (q) => w(f.value))
        }, {
          default: N(() => [
            z(v(f.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        A(ie, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: C[1] || (C[1] = (q) => f.value = null)
        }, {
          default: N(() => [...C[6] || (C[6] = [
            z("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? k("", !0) : (r(), d(B, { key: 2 }, [
        (r(!0), d(B, null, Z(u.value, (q) => (r(), d(B, {
          key: q.name
        }, [
          q.menu.length ? (r(), j(Zd, {
            key: 0,
            small: "",
            variant: q.primary ? "primary" : "ghost",
            disabled: p.value,
            "menu-label": q.menu_label || "More ways",
            title: b(q),
            "data-button": q.name,
            onMain: (P) => y(q)
          }, {
            menu: N(({ close: P }) => [
              (r(!0), d(B, null, Z(q.menu, (I) => (r(), j(We, {
                key: I.label,
                description: I.description,
                onClick: (Q) => (P(), y({ ...q, ...I, menu: [] }))
              }, {
                default: N(() => [
                  z(v(I.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: N(() => [
              z(v(q.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (r(), j(ie, {
            key: 1,
            small: "",
            variant: q.primary ? "primary" : "ghost",
            bordered: !q.primary,
            class: X({ danger: q.danger }),
            icon: $(q),
            disabled: p.value,
            title: b(q),
            "data-button": q.name,
            onClick: (P) => y(q)
          }, {
            default: N(() => [
              z(v(q.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        m.value && !e.readOnly && !e.externalFailure ? (r(), d("span", Tm, v(m.value), 1)) : k("", !0),
        c.value && !e.readOnly ? (r(), j(Cm, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: C[2] || (C[2] = (q) => c.value = null),
          onDone: C[3] || (C[3] = (q) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : k("", !0)
      ], 64))
    ], 10, Em));
  }
}, go = /* @__PURE__ */ V(Im, [["__scopeId", "data-v-a4b6f174"]]), Bm = {
  class: "running",
  "data-running-command": ""
}, Rm = ["title"], Lm = {
  key: "idle",
  class: "running-idle"
}, Nm = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (r(), d("span", Bm, [
      A(nn, {
        name: "roll",
        mode: "out-in"
      }, {
        default: N(() => [
          e.text ? (r(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, v(e.text), 9, Rm)) : (r(), d("span", Lm, v(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, fA = /* @__PURE__ */ V(Nm, [["__scopeId", "data-v-d3240219"]]), qm = ["aria-checked", "disabled", "aria-label", "title"], Dm = {
  key: 0,
  class: "switch-inner"
}, Pm = {
  key: 0,
  class: "switch-word"
}, jm = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, small: Boolean, beside: Boolean, disabled: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("button", {
      type: "button",
      class: X(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      disabled: e.disabled,
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: s[0] || (s[0] = (o) => n("change", !e.on))
    }, [
      h("span", {
        class: X(["switch", { on: e.on, labelled: e.labelled, large: e.large, small: e.small }])
      }, [
        e.labelled ? (r(), d("span", Dm, v(e.word), 1)) : k("", !0),
        s[1] || (s[1] = h("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (r(), d("span", Pm, v(e.word), 1)) : k("", !0)
    ], 10, qm));
  }
}, mA = /* @__PURE__ */ V(jm, [["__scopeId", "data-v-92ae7767"]]), Fm = { class: "notice-text" }, Wm = {
  key: 1,
  class: "notice-actions"
}, Hm = {
  __name: "Notice",
  props: {
    tone: { type: String, default: "muted" },
    icon: { type: String, default: "" }
  },
  setup(e) {
    const t = ["brief", "report", "wait", "danger", "info", "need", "ask"];
    return (n, a) => (r(), d("div", {
      class: X(["notice", [`notice-${e.tone}`, { "notice-band": t.includes(e.tone) }]])
    }, [
      e.icon ? (r(), j(se, {
        key: 0,
        name: e.icon,
        size: 18
      }, null, 8, ["name"])) : k("", !0),
      h("span", Fm, [
        ne(n.$slots, "default", {}, void 0, !0)
      ]),
      n.$slots.actions ? (r(), d("span", Wm, [
        ne(n.$slots, "actions", {}, void 0, !0)
      ])) : k("", !0)
    ], 2));
  }
}, hA = /* @__PURE__ */ V(Hm, [["__scopeId", "data-v-445bd8a6"]]);
function zi(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function fa(e, t) {
  return zi(() => localStorage, e, t);
}
function Ui(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function yo(e, t) {
  return Ui(() => localStorage, e, t);
}
function Vi(e, t) {
  ce(t, (n) => yo(e, n), { deep: !0 });
}
function zm(e, t) {
  return zi(() => sessionStorage, e, t);
}
function Um(e, t) {
  return Ui(() => sessionStorage, e, t);
}
const ma = "journal.environment", Gi = E(zm(ma, fa(ma, "")));
function Vm(e) {
  Gi.value = e, Um(ma, e), yo(ma, e);
}
const ha = E(location.hash), ll = lt(null), il = { integrations: "mcp", library: "team" };
function Gm() {
  if (!ll.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (il[n]) {
    location.replace(`#/${[il[n], ...a].join("/")}${t ? `?${t}` : ""}`), ha.value = location.hash;
    return;
  }
  !n || ll.value(n) || (Vm(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), ha.value = location.hash);
}
window.addEventListener("hashchange", () => {
  ha.value = location.hash, Gm();
});
const bo = "file", pa = M(() => {
  const [e, t = ""] = ha.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [i, u = ""] = l.split("@"), [c = "", f = "", m = ""] = i.split(":");
    return { table: c, id: c === bo ? decodeURIComponent(f) : Number(f), comment: Number(m) || 0, env: u };
  });
  return {
    env: Gi.value,
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
}), Ba = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Ba.page(e)}?open=${t}`
};
function Km(e = "", t = 0, n = "") {
  location.hash = Ba.page(e, t, n);
}
function Ym(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const Qm = (e) => `${e.table}:${e.table === bo ? encodeURIComponent(e.id) : e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Ki(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Qm).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
function Xm(e) {
  const [t, n = ""] = location.hash.replace(/^#/, "").split("?"), a = new URLSearchParams(n);
  a.set("row", String(e)), location.replace(`#${t}?${a}`);
}
const Yt = {};
function pA(e, t) {
  return Yt[e] = t, () => Yt[e] === t && delete Yt[e];
}
function Ze(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Yt[e]) != null && l.call(Yt, t))) return;
  const s = pa.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  Ki([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
const Jm = (e = "") => Ze(bo, e);
function Zm(e, t, n, a = 0, s = "") {
  if (e === pa.value.env) return Ze(t, n, a, s);
  const o = pa.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Ki([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function Pe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? Zm(a, s, Number(o), 0, t) : Ze(s, Number(o), 0, t);
}
function eh(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Kt(e) {
  const t = eh(e);
  t && Pe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function vA(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const th = { class: "inspector-part" }, nh = { class: "inspector-part-title" }, ah = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("section", th, [
      h("h4", nh, v(e.title), 1),
      ne(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, gA = /* @__PURE__ */ V(ah, [["__scopeId", "data-v-5175e4a3"]]), rl = /* @__PURE__ */ new Map(), sh = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = E(null), a = E(!1), s = E(t.name && rl.get(t.name) || !1);
    function o(u) {
      s.value = u, t.name && rl.set(t.name, u);
    }
    const l = () => {
      const u = !!n.value && n.value.scrollHeight > t.at;
      u !== a.value && (a.value = u);
    }, i = new ResizeObserver(() => requestAnimationFrame(l));
    return _e(() => n.value && i.observe(n.value.firstElementChild || n.value)), Te(() => i.disconnect()), (u, c) => (r(), d(B, null, [
      h("div", {
        ref_key: "body",
        ref: n,
        class: X(["folded-body", { folded: a.value && !s.value }]),
        style: pe(a.value && !s.value ? { maxHeight: `${e.keep}px` } : {}),
        onReveal: c[0] || (c[0] = (f) => o(!0))
      }, [
        ne(u.$slots, "default", {}, void 0, !0)
      ], 38),
      a.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "fold",
        onClick: c[1] || (c[1] = he((f) => o(!s.value), ["stop"]))
      }, v(s.value ? "Show less" : "Show more"), 1)) : k("", !0)
    ], 64));
  }
}, Yi = /* @__PURE__ */ V(sh, [["__scopeId", "data-v-4d2235ba"]]), oh = ["aria-valuenow", "aria-valuemax"], lh = {
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
    const t = e, n = M(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (a, s) => (r(), d("span", {
      class: X(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      h("span", {
        class: "fill",
        style: pe({ width: n.value })
      }, null, 4)
    ], 10, oh));
  }
}, Qi = /* @__PURE__ */ V(lh, [["__scopeId", "data-v-9eba6a85"]]), ih = { processes: "process", memories: "memory", replies: "reply" }, va = (e) => (ih[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), Is = [], rh = 2e3, yt = /* @__PURE__ */ new Map(), uh = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, ch = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Ht(e, { first: t = !1 } = {}) {
  t ? Is.unshift(e) : Is.push(e), yt.clear();
}
function Xi(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const dh = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, fh = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function ft(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function mh(e, t) {
  const n = [{ type: "text", text: ft(e).replace(/\r\n/g, `
`) }];
  for (const a of Is)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.type !== "text") continue;
      const l = a(o.text, t);
      typeof l == "string" ? o.text = l : l && n.splice(s, 1, ...l);
    }
  return n;
}
function $n(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return hh(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function hh(e) {
  return e.split(ch).map((t, n) => n % 2 ? t : t.replace(uh, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function ul(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const ph = 24;
function vh(e) {
  const [t, , ...n] = e, a = ul(t), s = n.map(ul), o = (u) => [a, ...s].some((c) => (c[u] ?? "").length > ph) ? ' class="text-column"' : "", l = a.map((u, c) => `<th${o(c)}>${$n(u)}</th>`).join(""), i = s.map((u) => `<tr>${u.map((c, f) => `<td${o(f)}>${$n(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const Ji = /^\s*(?:[-*+]|\d+[.)])\s+/, Bs = /^\s*(\d+)[.)]\s/, cl = (e) => e.match(/^\s*/)[0].length;
function Zi(e) {
  const t = e[0].match(Bs), n = cl(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && cl(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${$n(o.text)}${o.nested.length ? Zi(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function gh(e, t) {
  const n = Bs.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Ji.test(e[s]) && Bs.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const dl = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function er(e) {
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
      n.push(`<h${i}>${$n(o[2])}</h${i}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (dl(t, a)) {
      let i = a + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(vh(t.slice(a, i))), a = i;
      continue;
    }
    if (Ji.test(s)) {
      const i = gh(t, a);
      n.push(Zi(t.slice(a, i))), a = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let i = a;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${er(
          t.slice(a, i).map((u) => u.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = i;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !dl(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${$n(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const yh = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, bh = (e) => e.type !== "text" && !yh.test(e.html);
function kh(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(er(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : bh(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function ko(e, t = { env: "" }) {
  const n = fh(e, t), a = yt.get(n);
  if (yt.delete(n), a && a.source === t.source && a.reads.every((l) => dh(l, t)))
    return yt.set(n, a), a.html;
  const s = [], o = kh(mh(e, { ...t, reads: s }));
  return yt.set(n, { html: o, reads: s, source: t.source }), yt.size > rh && yt.delete(yt.keys().next().value), o;
}
const Ga = /* @__PURE__ */ new WeakMap();
function wh(e) {
  if (Ga.has(e)) return Ga.get(e);
  const t = Gu(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, f) => `${c}:${f}`;
  function o(c, f) {
    const m = s(c, f), p = e.read(`${va(c)} show ${f}`);
    n.set(m, p), p.then((b) => {
      n.get(m) === p && (n.delete(m), t.set(m, b.ok ? { ...b.value, table: c } : null));
    });
  }
  function l(c) {
    a.has(c) || (a.add(c), e.follow([`${va(c).replace(/-/g, "_")}.*`], (f) => {
      const m = `${c}:`;
      for (const p of t.keys()) {
        if (!p.startsWith(m)) continue;
        const b = Number(p.slice(m.length));
        (!f.row_id || f.row_id === b) && o(c, b);
      }
    }));
  }
  function i(c, f) {
    l(c);
    const m = s(c, f);
    return !t.has(m) && !n.has(m) && o(c, f), t.get(m);
  }
  const u = { id: Symbol("window text rows"), row: i };
  return Ga.set(e, u), u;
}
function tr() {
  const e = $e(Be, null), t = e ? wh(e) : null;
  return (n, a = {}) => ko(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const nr = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Nn = (e) => String(e || "").replace(nr, (t, n, a, s) => s), $h = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Yn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, xh = /^Traceback \(most recent call last\):/m, Sh = 8;
function ar(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Sh).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function Mh(e) {
  const t = [...e.matchAll($h)].map((a) => a.index);
  if (Yn.lastIndex = 0, !t.length || !Yn.test(e)) return null;
  Yn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(Yn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: ar(n), tail: "" } : null;
}
function _h(e) {
  const t = xh.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: ar([o]), tail: n.slice(s).join(`
`) };
}
Ht((e) => {
  const t = Nn(e), n = _h(t) || Mh(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const ga = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, sr = (e) => `${e.table}:${e.id}`, Rs = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Ka = 80;
function fl(e) {
  return e.length <= Ka ? e : `${e.slice(0, Ka + 1).replace(/\s+\S*$/, "") || e.slice(0, Ka)}…`;
}
const ml = {
  messages: (e) => fl(Rs(e.text)),
  comments: (e) => fl(Rs(e.text)),
  questions: (e) => e.text,
  memories: (e) => `${e.text} (weight ${e.weight})`,
  rules: (e) => e.text,
  reminders: (e) => e.text,
  environments: (e) => e.name,
  agents: (e) => e.session,
  workers: (e) => e.name,
  triggers: (e) => (e.phrases || []).join(", "),
  reactions: (e) => e.face,
  agent_message_records: (e) => {
    var t;
    return ((t = e.data) == null ? void 0 : t.line) || "";
  },
  plugins: (e) => {
    var t;
    return ((t = e.manifest) == null ? void 0 : t.title) || e.name;
  },
  shares: (e) => `Share of ${e.target || "nothing"}`
}, Ch = (e) => (ml[e.table] ? ml[e.table](e) : e.title || "") || "", Pt = (e) => ga(e.created_at), Eh = (e) => ga(e.updated_at) || Pt(e), Ah = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Oh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Th(e) {
  const t = Ah.exec(e);
  if (t && dt(t[1])) return { at: t.index, length: t[0].length, table: dt(t[1]), id: Number(t[2]), label: t[3] };
  const n = Oh.exec(e), a = n && dt(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function Ih(e, t, n, a) {
  const s = Xi(a, e, t), o = Nn(s ? Ch(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${ft(sn(e).title)} ${t}</span><span class="row-card-title">${ft(o)}</span></a>`;
}
Ht(
  (e, t) => {
    const n = Th(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: Ih(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Bh = /\.(png|jpe?g|gif|webp|svg)$/i, Rh = (e) => Bh.test(e), Lh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Nh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function qh(e, t) {
  const n = Lh.exec(e), [, a, s, o, l, i] = n || [], u = n && dt(a || o), c = u && Xi(t, u, Number(s || l));
  if (u !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const f = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, m = `${sn(u).title} ${c.id} · ${ft(i)}`, p = Rh(i) ? `<img class="file-card-image" src="${f}" alt="${ft(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${ft(i)}">${p}<span class="file-card-name">${m}</span></a>` };
}
function Dh(e) {
  const t = Nh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${ft(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Ht(
  (e, t) => {
    if (t.inline) return null;
    const n = qh(e, t) || Dh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Ph = /`([^`\n]+)`/g;
Ht((e) => e.replace(Ph, (t, n) => `<code>${n}</code>`));
const hl = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Ba.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Ht(
  (e, t) => e.replace(nr, (n, a, s, o) => hl[a] ? hl[a](s, o, t) : o)
);
const jh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, or = new RegExp(`\\b(${Hi}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), lr = new RegExp(`\\b(${Hi}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Fh = new RegExp(`<code>((?:${or.source}|${lr.source}))</code>`, "gi"), Wh = (e) => e.replace(Fh, "$1"), Hh = (e, t) => `<a class="row-pill" href="#" data-peek="${dt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, zh = (e) => e.replace(lr, (t, n, a) => a.replace(/\d+/g, (s) => Hh(n.replace(/s$/i, ""), s))), Uh = (e) => zh(e).replace(
  or,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${dt(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Ht(
  (e, t) => t.rowNames === !1 ? e : Wh(e).split(jh).map((n, a) => a % 2 ? n : Uh(n)).join("")
);
const Vh = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Gh = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Kh = /[\w\]]\(/, Yh = /^[\w$.[\]'"]+\s*=\s*[^=]/, Qh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Xh = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Jh = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Zh = /[[({,]$/, ep = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, tp = /^(\t|\s{2,})\S/, np = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, ap = /`[^`]+`/, sp = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, op = /[{}()[\];=<>$&|*\\@+^~%]/g, Ls = /^\s*(?:[-*+]|\d+[.)])\s/, lp = /^\s*>/, ip = /^\s*\|/, rp = 0.6, up = 0.4, cp = 5, dp = 0.03, ir = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= cp && t.every((n) => sp.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(op) ?? []).length / e.length < dp;
}, Ya = (e) => {
  const t = e.trim();
  return ap.test(t) ? !1 : [Vh, Gh, Kh, Yh, Qh, Xh, Jh, Zh, ep].some((n) => n.test(t)) || /[;{}]$/.test(t) && !Ls.test(t) || tp.test(e) && !Ls.test(e) && !ir(e);
};
function fp(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Ls.test(t[0]) || t.every((o) => lp.test(o) || ip.test(o))) return "text";
  const n = t.filter((o) => !np.test(o.trim()));
  if (t.length === 1) return !n.length || Ya(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(Ya).length, s = n.filter((o) => !Ya(o) && ir(o)).length;
  return a >= n.length * rp && s <= n.length * up ? "code" : "text";
}
const Ns = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", mp = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", hp = `${Ns} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, pp = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", vp = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", pl = {
  js: { keywords: Ns, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: mp, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: hp, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Ns, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: pp, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: vp, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, gp = {
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
function vl(e, t, n) {
  return n && e.startsWith(n, t);
}
function yp(e, t) {
  const n = pl[gp[t] ?? t] || pl.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (vl(e, o, n.line) || n.hash && i === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && vl(e, o, n.block[0])) {
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
function bp(e, t) {
  const n = [""];
  for (const { type: a, value: s } of yp(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? ft(l) : `<span class="tok-${a}">${ft(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function rr(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const kp = 1500, gl = /* @__PURE__ */ new WeakMap();
async function wp(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await rr(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(gl.get(t)), gl.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, kp)
  )));
}
typeof document < "u" && document.addEventListener("click", wp, !0);
const $p = /\n\s*\n/, xp = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, Sp = /^\s*(`{3,}|~{3,})\s*$/, Mp = /^\s{4,}\S/, _p = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, qs = /^\s*(?:[-*+]|\d+[.)])\s/, ur = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Cp = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function wo(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Ep(e) {
  const t = wo(e.join(`
`));
  return (Cp.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Ap = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && ur.test(t) && !qs.test(t);
}, Op = (e, t) => qs.test(t) || qs.test([...e].reverse().find((n) => n.trim()) || "");
function $o(e, t) {
  const n = t || Ep(e), a = bp(wo(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function Tp(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && Sp.test(s));
  return a < 0 ? e.length : a;
}
function Ip(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return $o(a.map(Nn), n ? n.toLowerCase() : "");
}
function Bp(e) {
  const t = e.split($p).map((l) => ({ paragraph: l, type: fp(wo(l).split(`
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
      s(), n.push($o(i.map(({ paragraph: u }) => u).join(`

`).split(`
`).map(Nn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function Rp(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : Bp(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const i = n[l].match(xp);
    if (i) {
      const c = Tp(n, l, i[2]);
      o(), a.push(Ip(n.slice(l + 1, c), i[1], i[3])), l = c + 1;
      continue;
    }
    const u = Ap(s) ? _p : Mp;
    if (!t && u.test(n[l]) && !Op(s, n[l])) {
      let c = l;
      for (; c < n.length && (u.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const f = [];
      for (; s.length && s[s.length - 1].trim() && ur.test(s[s.length - 1].trim()); ) f.unshift(s.pop());
      if (c - l + f.length >= 2) {
        o(), a.push($o([...f, ...n.slice(l, c)].map(Nn), "")), l = c;
        continue;
      }
      s.push(...f);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Ht((e, t) => Rp(e, t.document), { first: !0 });
const Lp = ["innerHTML"], Np = ["innerHTML"], qp = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = tr(), a = M(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (r(), d("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => O(Kt) && O(Kt)(...l)),
      innerHTML: a.value
    }, null, 8, Lp)) : (r(), d("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => O(Kt) && O(Kt)(...l)),
      innerHTML: a.value
    }, null, 8, Np));
  }
}, ut = /* @__PURE__ */ V(qp, [["__scopeId", "data-v-d8e75741"]]), yA = (e) => [...new Set(e.agents.map((t) => t.name))], Qa = (e) => new Set(e.agents.map((t) => t.id)).size === 1 ? e.agents[0] : null, Dp = "main agent", xo = (e, t) => t ? Dp : e, Pp = ["data-agent-main"], jp = {
  key: 0,
  class: "agent-badge-icon",
  "data-agent-main-icon": "",
  width: "14",
  height: "14",
  viewBox: "0 0 16 16",
  fill: "currentColor",
  "aria-hidden": "true"
}, Fp = {
  key: 2,
  class: "agent-badge-name",
  "data-agent-badge-name": ""
}, Wp = {
  __name: "AgentBadge",
  props: { name: { type: String, required: !0 }, main: Boolean, iconOnly: Boolean, chip: Boolean },
  setup(e) {
    const t = e, n = M(() => xo(t.name, t.main));
    return (a, s) => (r(), d("span", {
      class: X(["agent-badge", { main: e.main, chip: e.chip }]),
      "data-agent-badge": "",
      "data-agent-main": e.main ? "" : null
    }, [
      e.main ? (r(), d("svg", jp, [...s[0] || (s[0] = [
        h("circle", {
          cx: "8",
          cy: "4.8",
          r: "3.3"
        }, null, -1),
        h("path", { d: "M1.8 14.6c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6c0 .4-.3.7-.7.7H2.5c-.4 0-.7-.3-.7-.7z" }, null, -1)
      ])])) : (r(), j(se, {
        key: 1,
        class: "agent-badge-icon",
        name: "agent",
        size: 14
      })),
      e.iconOnly ? k("", !0) : (r(), d("span", Fp, v(n.value), 1))
    ], 10, Pp));
  }
}, Qt = /* @__PURE__ */ V(Wp, [["__scopeId", "data-v-f8a38025"]]), Hp = ["failed", "blocked", "problem", "update", "paused", "holding", "waiting", "asks"], cr = { danger: "failed", warn: "waiting" }, zp = (e) => Hp.includes(cr[e] ?? e), dr = (e) => zp(e) ? ["badge", cr[e] ?? e] : ["badge-quiet"], Up = ["aria-expanded"], Vp = {
  key: 0,
  class: "state-tip",
  role: "tooltip",
  "data-state-tip": ""
}, Gp = {
  key: 0,
  class: "tip-failure"
}, Kp = {
  __name: "StateBadge",
  props: { type: { type: String, required: !0 }, state: { type: String, required: !0 }, rowId: { type: Number, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    const t = e, n = $e(Be, null), a = M(() => $f(t.type, t.state)), s = M(() => dr(fo(t.type, t.state))), o = E(!1), l = E([]), i = E("");
    async function u() {
      o.value = !0;
      const m = await (t.read ?? n.read)(a.value.replace("{row_id}", t.rowId));
      i.value = m.ok ? "" : m.error, m.ok && (l.value = m.value.lines ?? []);
    }
    const c = () => o.value = !1, f = () => o.value ? c() : u();
    return (m, p) => a.value ? (r(), d("span", {
      key: 0,
      class: X(["state-badge", ...s.value]),
      tabindex: "0",
      role: "button",
      "aria-expanded": o.value,
      "data-state-badge": "",
      onMouseenter: u,
      onMouseleave: c,
      onFocus: u,
      onBlur: c,
      onClick: f,
      onKeydown: ze(c, ["escape"])
    }, [
      z(v(O(wn)(e.type, e.state)) + " ", 1),
      o.value ? (r(), d("span", Vp, [
        i.value ? (r(), d("span", Gp, v(i.value), 1)) : k("", !0),
        (r(!0), d(B, null, Z(l.value, (b) => (r(), d("span", {
          key: b,
          class: "tip-line"
        }, v(b), 1))), 128))
      ])) : k("", !0)
    ], 42, Up)) : (r(), d("span", {
      key: 1,
      class: X(s.value)
    }, v(O(wn)(e.type, e.state)), 3));
  }
}, Yp = /* @__PURE__ */ V(Kp, [["__scopeId", "data-v-d276694c"]]), Qp = {
  class: "plan-details",
  "data-plan-details": ""
}, Xp = { class: "state-line" }, Jp = {
  key: 0,
  class: "phase-count"
}, Zp = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, e1 = { class: "text" }, t1 = {
  key: 1,
  class: "note",
  "data-plan-waits-on": ""
}, n1 = {
  key: 2,
  class: "part",
  "data-plan-progress": ""
}, a1 = { class: "overall" }, s1 = { class: "overall-figure" }, o1 = {
  key: 3,
  class: "delegation",
  "data-plan-assignee": ""
}, l1 = {
  key: 4,
  class: "delegation",
  "data-plan-delegated": ""
}, i1 = {
  key: 5,
  class: "part"
}, r1 = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    return (t, n) => {
      var a;
      return r(), d("div", Qp, [
        h("div", Xp, [
          A(Yp, {
            type: "plan",
            state: e.plan.state,
            "row-id": e.plan.id,
            read: e.read,
            class: X(["status", O(fo)("plan", e.plan.state)]),
            "data-plan-status": ""
          }, null, 8, ["state", "row-id", "read", "class"]),
          e.plan.current_phase ? (r(), d("span", Jp, "Phase " + v(e.plan.current_phase) + " of " + v(e.plan.phases.length), 1)) : k("", !0)
        ]),
        e.plan.reason ? (r(), d("section", Zp, [
          h("h4", null, v(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
          h("p", e1, v(e.plan.reason), 1)
        ])) : k("", !0),
        (a = e.plan.blocker_ids) != null && a.length ? (r(), d("p", t1, "Opens by itself when " + v(e.plan.blocker_ids.map((s) => `plan ${s}`).join(" and ")) + " " + v(e.plan.blocker_ids.length === 1 ? "ends" : "have ended") + ".", 1)) : k("", !0),
        e.plan.total ? (r(), d("section", n1, [
          n[0] || (n[0] = h("h4", null, "Progress", -1)),
          h("div", a1, [
            A(Qi, {
              value: e.plan.finished,
              max: e.plan.total
            }, null, 8, ["value", "max"]),
            h("span", s1, v(e.plan.finished) + " of " + v(e.plan.total) + " done", 1)
          ])
        ])) : k("", !0),
        e.plan.assignee ? (r(), d("p", o1, [
          A(Qt, {
            name: e.plan.assignee.name,
            main: e.plan.assignee.main
          }, null, 8, ["name", "main"])
        ])) : e.plan.delegated ? (r(), d("p", l1, [
          O(Qa)(e.plan) ? (r(), j(Qt, {
            key: 0,
            name: O(Qa)(e.plan).name,
            main: O(Qa)(e.plan).main
          }, null, 8, ["name", "main"])) : (r(), d(B, { key: 1 }, [
            z(" Delegated ")
          ], 64))
        ])) : k("", !0),
        e.plan.brief ? (r(), d("section", i1, [
          n[1] || (n[1] = h("h4", null, "The brief", -1)),
          A(Yi, {
            name: `plans:${e.plan.id}:brief`,
            at: 220,
            keep: 160
          }, {
            default: N(() => [
              A(ut, {
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
}, bA = /* @__PURE__ */ V(r1, [["__scopeId", "data-v-52683b11"]]), u1 = {
  __name: "HoverTip",
  props: { as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    return (t, n) => (r(), j(Je(e.as), {
      type: e.as === "button" ? "button" : void 0,
      class: "tipped"
    }, {
      default: N(() => [
        ne(t.$slots, "default", {}, void 0, !0),
        h("span", {
          class: X(["tip", e.place]),
          role: "tooltip"
        }, [
          ne(t.$slots, "tip", {}, void 0, !0)
        ], 2)
      ]),
      _: 3
    }, 8, ["type"]));
  }
}, c1 = /* @__PURE__ */ V(u1, [["__scopeId", "data-v-683e1839"]]), fr = (e) => `row:${e}`, d1 = 5e3, f1 = "cancelled", Xa = /* @__PURE__ */ new Map();
async function m1(e, t) {
  const n = `${e.environment}:${t}`, a = Xa.get(n);
  if (a && performance.now() - a.at < d1) {
    const o = await a.answer;
    if (o.failure !== f1) return o;
    Xa.delete(n);
  }
  const s = e.read(`agent tip ${fr(t)}`);
  return Xa.set(n, { answer: s, at: performance.now() }), s;
}
function h1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function on(e, t = Date.now()) {
  const n = h1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const p1 = 36e5;
function v1(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / p1;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function Ds(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function mr(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function Zt(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const Ja = (e) => String(e).padStart(2, "0");
function hr(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Ja(t % 60)}s` : `${Math.floor(t / 3600)}h ${Ja(Math.floor(t % 3600 / 60))}m ${Ja(t % 60)}s`;
}
const g1 = { working: { state: "working", words: "Working" }, paused: { state: "paused", words: "Paused" }, "at usage limit": { state: "limited", words: "At usage limit" }, ended: { state: "idle", words: "Idle" } }, y1 = { state: "retired", words: "Retired" }, b1 = (e) => e.retired ? y1 : g1[e.activity], k1 = (e) => [e.program, e.model, e.effort, e.role_label].filter(Boolean).join(", "), w1 = (e, t) => e ? `Since: ${new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${on(e, t)}` : "", $1 = (e, t) => e ? `Seen: ${on(e, t)}` : "", x1 = {
  class: "line head",
  "data-agent-tip-head": ""
}, S1 = { key: 0 }, M1 = {
  class: "line",
  "data-agent-tip-identity": ""
}, _1 = {
  class: "line status",
  "data-agent-tip-status": ""
}, C1 = ["data-state"], E1 = {
  key: 0,
  class: "line",
  "data-agent-tip-since": ""
}, A1 = {
  key: 1,
  class: "line",
  "data-agent-tip-seen": ""
}, O1 = {
  key: 1,
  class: "line",
  "data-agent-tip-head": ""
}, T1 = {
  key: 2,
  class: "line failure",
  "data-agent-tip-failure": ""
}, I1 = {
  __name: "AgentTip",
  props: { agentId: { type: Number, required: !0 }, label: { type: String, default: "" }, as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    const t = e, n = $e(Be, null), a = E(!1), s = E(null), o = E(""), l = E(Date.now()), i = M(() => b1(s.value)), u = M(() => w1(s.value.since, l.value)), c = M(() => $1(s.value.last_seen, l.value));
    async function f() {
      if (a.value = !0, !n) return;
      const m = await m1(n, t.agentId);
      o.value = m.ok ? "" : m.error, m.ok && (l.value = Date.now(), s.value = m.value);
    }
    return (m, p) => (r(), j(c1, {
      as: e.as,
      place: e.place,
      class: "agent-tip",
      "data-agent-tip": "",
      onMouseenter: f,
      onFocusin: f
    }, Ea({
      default: N(() => [
        ne(m.$slots, "default", {}, void 0, !0)
      ]),
      _: 2
    }, [
      a.value ? {
        name: "tip",
        fn: N(() => [
          s.value ? (r(), d(B, { key: 0 }, [
            h("span", x1, [
              h("b", null, v(s.value.title), 1),
              p[0] || (p[0] = z()),
              s.value.name ? (r(), d("span", S1, v(s.value.name), 1)) : k("", !0)
            ]),
            h("span", M1, v(O(k1)(s.value)), 1),
            h("span", _1, [
              h("i", {
                "data-state": i.value.state
              }, null, 8, C1),
              z(v(i.value.words), 1)
            ]),
            u.value ? (r(), d("span", E1, v(u.value), 1)) : k("", !0),
            c.value ? (r(), d("span", A1, v(c.value), 1)) : k("", !0)
          ], 64)) : (r(), d("b", O1, v(e.label), 1)),
          o.value ? (r(), d("span", T1, v(o.value), 1)) : k("", !0)
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["as", "place"]));
  }
}, xn = /* @__PURE__ */ V(I1, [["__scopeId", "data-v-71d17663"]]), B1 = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, R1 = { class: "agent-word" }, L1 = {
  __name: "PlanPhaseAgents",
  props: { tasks: { type: Array, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["started", "testing"]), n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = M(() => {
      var l;
      const o = /* @__PURE__ */ new Map();
      for (const i of a.tasks.filter((u) => u.helper_id && !n.has(u.state))) {
        const u = ((l = o.get(i.helper_id)) == null ? void 0 : l.held) || t.has(i.state);
        o.set(i.helper_id, { id: i.helper_id, name: i.helper_name, main: i.helper_main, held: u });
      }
      return [...o.values()];
    });
    return (o, l) => s.value.length ? (r(), d("div", B1, [
      (r(!0), d(B, null, Z(s.value, (i) => (r(), j(xn, {
        key: i.id,
        as: "button",
        "agent-id": i.id,
        label: O(xo)(i.name, i.main),
        class: "phase-agent",
        "data-plan-phase-agent": "",
        onClick: (u) => O(Pe)(`agents:${i.id}`)
      }, {
        default: N(() => [
          h("span", {
            class: X(["agent-dot", { held: i.held }])
          }, null, 2),
          A(Qt, {
            name: i.name,
            main: i.main
          }, null, 8, ["name", "main"]),
          h("span", R1, v(i.held ? "Working" : "Queued"), 1)
        ]),
        _: 2
      }, 1032, ["agent-id", "label", "onClick"]))), 128))
    ])) : k("", !0);
  }
}, N1 = /* @__PURE__ */ V(L1, [["__scopeId", "data-v-619caeed"]]), q1 = { class: "phases" }, D1 = { class: "phead" }, P1 = { class: "mark" }, j1 = { class: "ptitle" }, F1 = { class: "phead-end" }, W1 = {
  key: 0,
  class: "checkpoint"
}, H1 = { class: "progress" }, z1 = {
  key: 0,
  class: "when"
}, U1 = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["completed", "cancelled"]), n = (s) => s.tasks.filter((o) => t.has(o.state)).length, a = (s) => s.tasks.length > 0 && n(s) === s.tasks.length;
    return (s, o) => (r(), d("ol", q1, [
      (r(!0), d(B, null, Z(e.phases, (l, i) => (r(), d("li", {
        key: l.id,
        class: X(["phase", { current: i + 1 === e.currentPhase, done: a(l) }]),
        "data-resource-phase": ""
      }, [
        h("div", D1, [
          h("span", P1, [
            A(se, {
              name: a(l) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          h("span", j1, v(i + 1) + ". " + v(l.title), 1),
          h("span", F1, [
            l.checkpoint ? (r(), d("span", W1, "checkpoint")) : k("", !0),
            h("span", H1, v(n(l)) + "/" + v(l.tasks.length), 1)
          ])
        ]),
        l.goal ? (r(), d("div", z1, v(l.goal), 1)) : k("", !0),
        A(N1, {
          tasks: l.tasks
        }, null, 8, ["tasks"]),
        (r(!0), d(B, null, Z(l.tasks, (u) => ne(s.$slots, "task", { task: u }, void 0, !0, u.id)), 128))
      ], 2))), 128))
    ]));
  }
}, kA = /* @__PURE__ */ V(U1, [["__scopeId", "data-v-05aaa685"]]), V1 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, G1 = { ...V1, done: "Completed" }, K1 = /* @__PURE__ */ new Set(["completed", "cancelled"]), Y1 = (e) => K1.has(e), Sn = (e) => Y1(e) ? "done" : e, Q1 = { class: "task-status-icon" }, X1 = ["width", "height", "aria-label"], J1 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = M(() => fo("task", Sn(t.status))), a = M(() => n.value === "testing" ? "started" : n.value), s = M(() => G1[t.status] ?? wn("task", t.status));
    return (o, l) => (r(), d("span", Q1, [
      A(nn, {
        name: "turn",
        mode: "out-in"
      }, {
        default: N(() => [
          (r(), d("svg", {
            key: n.value,
            class: X(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            A(Ft, { value: a.value }, {
              blocked: N(() => [...l[0] || (l[0] = [
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
              done: N(() => [...l[1] || (l[1] = [
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
              started: N(() => [...l[2] || (l[2] = [
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
              asked: N(() => [...l[3] || (l[3] = [
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
              paused: N(() => [...l[4] || (l[4] = [
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
              planned: N(() => [...l[5] || (l[5] = [
                h("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: N(() => [...l[6] || (l[6] = [
                h("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, X1))
        ]),
        _: 1
      })
    ]));
  }
}, Ra = /* @__PURE__ */ V(J1, [["__scopeId", "data-v-ae24a63f"]]), Z1 = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, ev = {
  key: 0,
  class: "empty",
  role: "alert"
}, tv = {
  key: 2,
  class: "empty"
}, nv = { class: "day" }, av = { class: "events" }, sv = { class: "mark" }, ov = { class: "what" }, lv = { class: "head" }, iv = { class: "word" }, rv = ["title", "onClick"], uv = { class: "at" }, cv = {
  __name: "PlanTimeline",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = {
      made: { state: "open", word: "Made" },
      logged: { icon: "edits", word: "Logged" },
      completed: { state: "completed", word: "Finished" },
      cancelled: { state: "cancelled", word: "Cancelled" }
    }, a = e, s = t, o = E(null), l = E(""), i = M(() => {
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
    return ce(() => a.id, c, { immediate: !0 }), (f, m) => (r(), d("section", Z1, [
      l.value ? (r(), d("p", ev, v(l.value), 1)) : o.value === null ? (r(), j(nt, { key: 1 })) : o.value.length ? k("", !0) : (r(), d("p", tv, "Nothing has happened on this plan's tasks yet.")),
      (r(!0), d(B, null, Z(i.value, (p) => (r(), d(B, {
        key: p.day
      }, [
        h("h3", nv, v(p.day), 1),
        h("ol", av, [
          (r(!0), d(B, null, Z(p.items, (b) => (r(), d("li", {
            key: `${b.time}-${b.event_type}-${b.task_id}`,
            class: X(["event", b.event_type]),
            "data-plan-event": ""
          }, [
            h("span", sv, [
              n[b.event_type].state ? (r(), j(Ra, {
                key: 0,
                status: n[b.event_type].state
              }, null, 8, ["status"])) : (r(), j(se, {
                key: 1,
                name: n[b.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            h("div", ov, [
              h("div", lv, [
                h("span", iv, v(n[b.event_type].word), 1),
                h("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${b.task_id}`,
                  onClick: ($) => s("select", b.task_id)
                }, "#" + v(b.task_id) + " " + v(b.title), 9, rv),
                h("span", uv, v(u(b.time)), 1)
              ]),
              b.text ? (r(), j(ut, {
                key: 0,
                class: "text",
                text: b.text
              }, null, 8, ["text"])) : k("", !0)
            ])
          ], 2))), 128))
        ])
      ], 64))), 128))
    ]));
  }
}, wA = /* @__PURE__ */ V(cv, [["__scopeId", "data-v-9e511133"]]), dv = 1e3;
function pr() {
  const e = E(Date.now()), t = setInterval(() => e.value = Date.now(), dv);
  return tt(() => clearInterval(t)), e;
}
const fv = Symbol("resource-subscriptions");
function mv() {
  const e = $e(fv, null);
  if (e) return (a, s) => e.follow("resources", a, s);
  const t = $e(Be, null);
  if (t != null && t.subscriptions) return (a, s) => t.subscriptions.follow(t.window, a, s);
  const n = new wi();
  return (a, s) => n.follow("resources", a, s);
}
function qn(e, t, n = () => !0) {
  const a = Oa(t, 100), s = mv()(e, (o) => {
    n(o) && a();
  });
  Aa(() => {
    s(), a.cancel();
  });
}
function hv(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const vr = { compact: "Compaction", clear: "Clear" }, pv = { stop_limit: "The journal, at the context size", hard_stop: "The journal, at the second context size", person: "A user, in the viewer", auto: "The program", terminal_person: "A user, in the terminal", headless_program: "The journal, before the next job" }, vv = { requested: "Asked, not started yet", started: "Running", ended: "Ended, size not read yet", measured: "Done", unreduced: "Done, context not smaller", failed: "Failed", abandoned: "Given up" };
function gv(e) {
  return e != null && e.is_open ? `${vr[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
function yv(e) {
  if (!e) return [];
  const t = [["Last context change", `${vr[e.change]}: ${vv[e.state]}`], ["Asked by", pv[e.reason]], ["Asked", new Date(e.requested_at).toLocaleString()]];
  return e.request_tokens != null && t.push(["Size at the request", `${e.request_tokens} tokens`]), e.tokens_after != null && t.push(["Size after", `${e.tokens_after} tokens`]), t;
}
const bv = "Not known", kv = 80, wv = 1e3, $v = "worker", xv = "main", Sv = /* @__PURE__ */ new Set(["waiting", "blocked", "at usage limit"]), Mv = (e) => e.ok ? e.value.rows : [], _v = (e, t) => e.ended_at ? "ended" : e.paused_at || Sv.has(t == null ? void 0 : t.state) ? "waiting" : "running", gr = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function Cv({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / wv, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: hr(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > kv }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? bv : `$${t.cost_dollars.toFixed(2)}` }), e.role === $v && l.push({ key: "pace", label: "Tasks an hour", value: String(v1(gr(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === xv && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function Ev(e) {
  const t = gr(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function Av(e, t, n = null) {
  const a = [["Number", String(e.number)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && a.push(["Parent agent", `Agent ${e.parent_id}`]), a.push(["Started by", t.started_by], ["Started", Ds(e.created_at)]), e.ended_at && a.push(["Ended", Ds(e.ended_at)]), e.pid && a.push(["Process", `pid ${e.pid}`]), a.push(...yv(n)), a;
}
const Ov = { class: "band" }, Tv = { key: 0 }, Iv = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (r(), d("h2", Ov, [
      A(se, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      ne(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (r(), d("span", Tv, v(e.count), 1)) : k("", !0)
    ]));
  }
}, _t = /* @__PURE__ */ V(Iv, [["__scopeId", "data-v-1758914f"]]), Bv = { class: "number" }, Rv = { class: "text" }, Lv = 150, Nv = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = E(!1), a = M(() => t.text.length > Lv), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (r(), d(B, null, [
      e.text ? (r(), d(B, { key: 0 }, [
        A(_t, { icon: "file" }, {
          default: N(() => [
            z(v(e.label), 1)
          ]),
          _: 1
        }),
        h("div", {
          class: X(["brief", { clamp: !n.value }]),
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
        A(_t, { icon: "points" }, {
          default: N(() => [...l[1] || (l[1] = [
            z("Points to prove", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(B, null, Z(e.points, (i) => {
          var u;
          return r(), d("p", {
            key: i.id,
            class: "point",
            "data-agent-point": ""
          }, [
            h("span", Bv, v(i.id), 1),
            h("span", Rv, [
              z(v(i.text), 1),
              h("span", {
                class: X(["proof", { checked: ((u = i.proof) == null ? void 0 : u.state) === "checked" }])
              }, v(s(i)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : k("", !0)
    ], 64));
  }
}, qv = /* @__PURE__ */ V(Nv, [["__scopeId", "data-v-c99de22c"]]), Dv = ["aria-expanded"], Pv = { class: "count" }, jv = {
  key: 0,
  "data-agent-fold-body": ""
}, Fv = {
  __name: "AgentFold",
  props: /* @__PURE__ */ mt({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = qt(e, "open");
    return (n, a) => (r(), d(B, null, [
      h("button", {
        type: "button",
        class: X(["fold", { shut: !t.value }]),
        "aria-expanded": t.value,
        "data-agent-fold": "",
        onClick: a[0] || (a[0] = (s) => t.value = !t.value)
      }, [
        A(se, {
          name: e.icon,
          size: 12
        }, null, 8, ["name"]),
        z(v(e.label), 1),
        h("span", Pv, v(e.count), 1),
        A(se, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, Dv),
      t.value ? (r(), d("div", jv, [
        ne(n.$slots, "default", {}, void 0, !0)
      ])) : k("", !0)
    ], 64));
  }
}, Za = /* @__PURE__ */ V(Fv, [["__scopeId", "data-v-7f93d8d9"]]), Wv = ["onClick"], Hv = { class: "text" }, zv = { class: "aside" }, Uv = {
  key: 0,
  class: "none"
}, Vv = {
  class: "skills",
  "data-agent-skills": ""
}, Gv = {
  key: 0,
  class: "none-inline"
}, Kv = { class: "label" }, Yv = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = tn({ helpers: !1, skills: !1 }), a = E([]), s = E([]), o = async (l) => Mv(await t.read(l));
    return ce(() => [n.helpers, t.loads], async ([l]) => {
      l && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), ce(() => [n.skills, t.loads], async ([l]) => {
      l && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    }), (l, i) => (r(), d(B, null, [
      A(Za, {
        open: n.helpers,
        "onUpdate:open": i[0] || (i[0] = (u) => n.helpers = u),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: N(() => [
          (r(!0), d(B, null, Z(a.value, (u) => (r(), d("button", {
            key: u.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (c) => O(Ze)("agents", u.id)
          }, [
            h("span", Hv, v(O(Jt)(u).title), 1),
            h("span", zv, v(O(Jt)(u).subtext), 1)
          ], 8, Wv))), 128)),
          a.value.length ? k("", !0) : (r(), d("p", Uv, "It started no helpers."))
        ]),
        _: 1
      }, 8, ["open", "count"]),
      A(Za, {
        open: n.skills,
        "onUpdate:open": i[1] || (i[1] = (u) => n.skills = u),
        icon: "style",
        label: "Skills loaded",
        count: e.counts.skills
      }, {
        default: N(() => [
          h("p", Vv, [
            (r(!0), d(B, null, Z(s.value, (u) => (r(), d("span", {
              key: u.id,
              "data-agent-skill": ""
            }, v(u.skill), 1))), 128)),
            s.value.length ? k("", !0) : (r(), d("span", Gv, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      A(Za, {
        icon: "rules",
        label: "Details",
        count: e.details.length
      }, {
        default: N(() => [
          (r(!0), d(B, null, Z(e.details, ([u, c, f]) => (r(), d("div", {
            key: u,
            class: "detail",
            "data-agent-detail": ""
          }, [
            h("span", Kv, v(u) + ":", 1),
            h("span", {
              class: X(["value", f])
            }, v(c), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, Qv = /* @__PURE__ */ V(Yv, [["__scopeId", "data-v-1281605f"]]), Xv = ["datetime", "title"], Ye = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = pr(), a = M(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (r(), d("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, v(O(on)(e.at, O(n))), 9, Xv));
  }
}, Jv = {
  class: "now",
  "data-agent-now": ""
}, Zv = {
  key: 1,
  class: "muted"
}, eg = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, tg = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, ng = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, ag = { class: "line" }, sg = { class: "detail" }, og = { class: "bar" }, lg = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = M(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = M(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (r(), d(B, null, [
      A(_t, { icon: "play" }, {
        default: N(() => [...o[2] || (o[2] = [
          z("Doing now", -1)
        ])]),
        _: 1
      }),
      h("div", Jv, [
        e.inspection.task ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => O(Ze)("tasks", e.inspection.task.id))
        }, "Task " + v(e.inspection.task.id) + ": " + v(e.inspection.task.title), 1)) : (r(), d("span", Zv, v(e.nothing), 1)),
        n.value ? (r(), d("span", eg, v(n.value), 1)) : k("", !0),
        e.inspection.last_activity ? (r(), d("span", tg, [
          o[3] || (o[3] = z("Seen: ", -1)),
          A(Ye, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : k("", !0)
      ]),
      e.inspection.plan ? (r(), d("div", ng, [
        h("div", ag, [
          h("span", null, "Plan " + v(e.inspection.plan.id) + ", phase " + v(e.inspection.plan.phase), 1),
          h("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => O(Ze)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        h("span", sg, v(e.inspection.plan.done) + " of " + v(e.inspection.plan.total) + " tasks done", 1),
        h("div", og, [
          h("i", {
            style: pe({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : k("", !0)
    ], 64));
  }
}, ig = /* @__PURE__ */ V(lg, [["__scopeId", "data-v-ff25c609"]]), rg = ["onClick"], ug = { class: "text" }, cg = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, dg = { class: "text" }, fg = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, mg = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d(B, null, [
      A(_t, { icon: "clock" }, {
        default: N(() => [...n[0] || (n[0] = [
          z("Recent", -1)
        ])]),
        _: 1
      }),
      (r(!0), d(B, null, Z(e.moves, (a) => (r(), d(B, {
        key: `${a.time}:${a.text}`
      }, [
        a.table ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "move",
          "data-agent-move": "",
          onClick: (s) => O(Ze)(a.table, a.id)
        }, [
          h("i", {
            class: X(["dot", a.tone])
          }, null, 2),
          h("span", ug, v(a.text), 1),
          A(Ye, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, rg)) : (r(), d("div", cg, [
          h("i", {
            class: X(["dot", a.tone])
          }, null, 2),
          h("span", dg, v(a.text), 1),
          A(Ye, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? k("", !0) : (r(), d("p", fg, "Nothing yet."))
    ], 64));
  }
}, hg = /* @__PURE__ */ V(mg, [["__scopeId", "data-v-58f0db57"]]), pg = ["title"], vg = { class: "name" }, gg = { class: "state-type" }, yg = {
  __name: "AgentStates",
  props: { states: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => e.states.length ? (r(), d(B, { key: 0 }, [
      A(_t, { icon: "clock" }, {
        default: N(() => [...n[0] || (n[0] = [
          z("States", -1)
        ])]),
        _: 1
      }),
      (r(!0), d(B, null, Z(e.states, (a) => (r(), d("div", {
        key: a.name,
        class: "state",
        "data-agent-open-state": "",
        title: `${a.name} (${a.state}): ${a.rows.join(", ")}`
      }, [
        h("span", vg, v(a.name), 1),
        h("span", gg, v(a.state), 1),
        A(Ye, {
          class: "since",
          at: a.entered_at
        }, null, 8, ["at"])
      ], 8, pg))), 128))
    ], 64)) : k("", !0);
  }
}, bg = /* @__PURE__ */ V(yg, [["__scopeId", "data-v-4aebfc35"]]), kg = {
  class: "strip",
  "data-agent-strip": ""
}, wg = ["data-agent-cell"], $g = {
  key: 0,
  class: "meter"
}, xg = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", kg, [
      (r(!0), d(B, null, Z(e.cells, (a) => (r(), d("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        h("small", null, v(a.label), 1),
        h("b", {
          class: X({ bad: a.bad })
        }, v(a.value), 3),
        a.meter !== void 0 ? (r(), d("div", $g, [
          h("i", {
            class: X({ high: a.high }),
            style: pe({ width: `${a.meter}%` })
          }, null, 6)
        ])) : k("", !0)
      ], 8, wg))), 128))
    ]));
  }
}, Sg = /* @__PURE__ */ V(xg, [["__scopeId", "data-v-b6657ab7"]]), Mg = {}, _g = { class: "menu-label" };
function Cg(e, t) {
  return r(), d("span", _g, [
    ne(e.$slots, "default", {}, void 0, !0)
  ]);
}
const $t = /* @__PURE__ */ V(Mg, [["render", Cg], ["__scopeId", "data-v-aa955b3e"]]), Eg = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, Ag = {
  key: 0,
  class: "skills-none"
}, Og = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => n.skills.filter((l) => l.state === "loaded")), o = M(() => n.skills.filter((l) => l.state !== "loaded"));
    return (l, i) => (r(), d("div", Eg, [
      A($t, null, {
        default: N(() => [...i[1] || (i[1] = [
          z("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      s.value.length ? k("", !0) : (r(), d("p", Ag, "None yet. Compacting the conversation empties this list.")),
      (r(!0), d(B, null, Z(s.value, (u) => (r(), d("p", {
        key: u.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        A(se, {
          name: "book",
          size: 12
        }),
        z(v(u.skill), 1)
      ]))), 128)),
      o.value.length ? (r(), d(B, { key: 1 }, [
        A($t, null, {
          default: N(() => [...i[2] || (i[2] = [
            z("Still to read", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(B, null, Z(o.value, (u) => (r(), d("p", {
          key: u.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          A(se, {
            name: "book",
            size: 12
          }),
          z(v(u.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      A(We, {
        "data-agent-skills-browse": "",
        onClick: i[0] || (i[0] = (u) => a("browse"))
      }, {
        default: N(() => [...i[3] || (i[3] = [
          z("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Tg = /* @__PURE__ */ V(Og, [["__scopeId", "data-v-be514d47"]]), Ig = ["disabled", "title"], Bg = { class: "gauge usage" }, Rg = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => n.windows[0] ?? null), o = M(() => s.value && Number.isFinite(s.value.used_percent) ? Math.max(0, Math.min(100, Math.round(s.value.used_percent))) : null), l = M(() => o.value !== null && o.value >= 100), i = M(() => {
      var c;
      return (c = s.value) != null && c.reset_unix_seconds ? new Date(s.value.reset_unix_seconds * 1e3).toLocaleString() : "";
    }), u = M(() => l.value ? `At usage limit: the plan's ${s.value.title} allowance is used up${i.value ? `, starts again ${i.value}` : ""}` : `${o.value}% of the plan's ${s.value.title} allowance used${i.value ? `, starts again ${i.value}` : ""}`);
    return (c, f) => o.value !== null ? (r(), d("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: u.value,
      onClick: f[0] || (f[0] = (m) => a("open", m.currentTarget))
    }, [
      A(se, {
        name: "allowance",
        size: 12
      }),
      f[1] || (f[1] = z()),
      h("span", Bg, [
        h("span", {
          style: pe({ width: `${o.value}%` })
        }, null, 4)
      ]),
      z(" " + v(l.value ? "At usage limit" : `${o.value}%`), 1)
    ], 8, Ig)) : k("", !0);
  }
}, Lg = /* @__PURE__ */ V(Rg, [["__scopeId", "data-v-8ee387a5"]]), Ng = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: X(O(dr)(e.tone))
    }, v(e.text), 3));
  }
}, So = /* @__PURE__ */ V(Ng, [["__scopeId", "data-v-b7a33f3d"]]);
function qg(e, t, n, { groups: a, programs: s }) {
  const o = E({}), l = E(""), i = E(!1), u = M(() => !!e.value && !e.value.ended_at), c = M(() => u.value && !!e.value.paused_at);
  async function f($, y = null) {
    l.value = "";
    const w = await fi(y, $, t);
    return l.value = w.ok ? "" : w.error, n(), w;
  }
  return { groups: a, programs: s, chosen: o, failure: l, asking: i, running: u, paused: c, choose: ($, y) => f(["agent", "control", String(e.value.number), $, y.value], { target: o, fields: { value: { ...o.value, [$]: y.label } } }), stop: () => (i.value = !1, f(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: ($) => f(["agent", "launch", $.name]) };
}
const Dg = ["disabled", "title"], Pg = ["disabled", "title"], jg = { class: "gauge" }, Fg = {
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, Wg = ["disabled", "title"], Hg = ["disabled"], zg = ["disabled"], Ug = {
  key: 5,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Vg = ["title"], Gg = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Kg = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Yg = { class: "gauge" }, Qg = { class: "context-used" }, Xg = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, Jg = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, Zg = 75, ey = {
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
    const n = e, a = t, s = qg(Fa(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: Fa(n, "controlGroups"), programs: Fa(n, "agentPrograms") }), o = E(null), l = E(""), i = M(() => s.groups.value.find((W) => W.key === l.value));
    function u(W, R) {
      o.value = W.currentTarget, l.value = R;
    }
    function c() {
      o.value = null, l.value = "", s.asking.value = !1;
    }
    const f = M(() => n.skills.filter((W) => W.state === "loaded"));
    function m(W) {
      u(W, "skills"), a("skills");
    }
    const p = (W) => s.groups.value.some((R) => R.key === W), b = M(() => {
      var W;
      return s.chosen.value.model ?? ((W = y.value) == null ? void 0 : W.model) ?? "";
    }), $ = M(() => {
      var W;
      return s.chosen.value.effort ?? ((W = y.value) == null ? void 0 : W.effort) ?? "";
    });
    M(() => !!n.agent && !n.agent.ended_at);
    const y = M(() => {
      var W;
      return ((W = n.usage.agents) == null ? void 0 : W.find((R) => {
        var D;
        return R.id === ((D = n.agent) == null ? void 0 : D.id);
      })) ?? null;
    }), w = M(() => {
      var W;
      return ((W = y.value) == null ? void 0 : W.context_percent) == null ? null : Math.round(y.value.context_percent);
    }), x = M(() => {
      var W;
      return gv(((W = y.value) == null ? void 0 : W.context_change) ?? null);
    }), C = (W) => `${Math.round(W / 1e3)}k`, q = M(() => {
      var W;
      return !!((W = y.value) != null && W.context_limit_tokens);
    }), P = M(() => {
      var W, R;
      return ((W = y.value) == null ? void 0 : W.context_limit_tokens) || ((R = y.value) == null ? void 0 : R.context_window_tokens) || 0;
    }), I = M(() => P.value ? `${C(y.value.context_tokens ?? 0)} of ${C(P.value)}` : ""), Q = M(() => {
      var W;
      return (W = y.value) != null && W.cost_dollars ? `$${y.value.cost_dollars.toFixed(2)}` : "";
    });
    return (W, R) => {
      var D, G;
      return r(), d("div", {
        class: X(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (r(), d(B, { key: 0 }, [
          h("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: R[0] || (R[0] = (_) => u(_, "agent"))
          }, [
            A(se, {
              name: "agents",
              size: 12
            }),
            z(" " + v(((D = e.agentPrograms.find((_) => _.name === e.agent.program)) == null ? void 0 : D.title) || e.agent.program), 1)
          ], 8, Dg),
          A(Lg, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: R[1] || (R[1] = (_) => a("open", "usage", _))
          }, null, 8, ["windows", "disabled"]),
          w.value !== null ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${w.value}% full: clear or compact it`,
            onClick: R[2] || (R[2] = (_) => p("context") ? u(_, "context") : a("open", "context", _.currentTarget))
          }, [
            A(se, {
              name: "gauge",
              size: 12
            }),
            R[14] || (R[14] = z()),
            h("span", jg, [
              h("span", {
                style: pe({ width: `${w.value}%` })
              }, null, 4)
            ]),
            z(" " + v(w.value) + "% ", 1)
          ], 8, Pg)) : (G = y.value) != null && G.context_unknown ? (r(), d("span", Fg, [
            A(se, {
              name: "gauge",
              size: 12
            }),
            R[15] || (R[15] = z(" Context: unknown", -1))
          ])) : k("", !0),
          b.value ? (r(), d("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${b.value}: change the model`,
            onClick: R[3] || (R[3] = (_) => p("model") ? u(_, "model") : null)
          }, [
            A(se, {
              name: "model",
              size: 12
            }),
            z(" " + v(b.value), 1)
          ], 8, Wg)) : k("", !0),
          p("effort") || e.card && $.value ? (r(), d("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: R[4] || (R[4] = (_) => u(_, "effort"))
          }, [
            A(se, {
              name: "bolt",
              size: 12
            }),
            z(" " + v($.value), 1)
          ], 8, Hg)) : k("", !0),
          Q.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: R[5] || (R[5] = (_) => a("open", "cost", _.currentTarget))
          }, v(Q.value), 9, zg)) : k("", !0),
          e.branch ? (r(), d("span", Ug, [
            A(se, {
              name: "branch",
              size: 12
            }),
            z(" " + v(e.branch), 1)
          ])) : k("", !0),
          e.card ? k("", !0) : (r(), d("button", {
            key: 6,
            type: "button",
            class: X(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: R[6] || (R[6] = (_) => a("open", "jobs", _.currentTarget))
          }, [
            A(se, {
              name: "clock",
              size: 12
            }),
            z(" " + v(e.jobs), 1)
          ], 2)),
          e.run ? (r(), d("button", {
            key: 7,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: m
          }, [
            A(se, {
              name: "book",
              size: 12
            }),
            z(" " + v(f.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (r(), d(B, { key: 8 }, [
            h("button", {
              type: "button",
              class: X(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Zg }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: R[7] || (R[7] = (_) => a("open", "fitness", _.currentTarget))
            }, [
              A(se, {
                name: "heart",
                size: 12
              }),
              z(" " + v(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            h("button", {
              type: "button",
              class: X(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: R[8] || (R[8] = (_) => a("open", "load", _.currentTarget))
            }, [
              A(se, {
                name: "weight",
                size: 12
              }),
              z(" " + v(e.fitness.workload), 1)
            ], 2)
          ], 64)) : k("", !0)
        ], 64)) : e.run && !e.loading ? (r(), d("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: R[9] || (R[9] = (_) => u(_, "start"))
        }, [
          A(se, {
            name: "agents",
            size: 12
          }),
          R[16] || (R[16] = z(" Start an agent", -1))
        ])) : k("", !0),
        R[22] || (R[22] = h("span", { class: "space" }, null, -1)),
        O(s).failure.value ? (r(), d("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: O(s).failure.value
        }, v(O(s).failure.value), 9, Vg)) : k("", !0),
        ne(W.$slots, "default", {}, void 0, !0),
        o.value ? (r(), j(Wt, {
          key: 3,
          anchor: o.value,
          "min-width": 190,
          onClose: c
        }, {
          default: N(() => {
            var _;
            return [
              l.value === "agent" ? (r(), d(B, { key: 0 }, [
                O(s).asking.value ? (r(), d(B, { key: 0 }, [
                  A($t, { "data-agent-stop-ask": "" }, {
                    default: N(() => [...R[17] || (R[17] = [
                      z("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  A(We, {
                    "data-agent-stop-confirm": "",
                    onClick: R[10] || (R[10] = (g) => (c(), O(s).stop()))
                  }, {
                    default: N(() => [...R[18] || (R[18] = [
                      z("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  A(We, {
                    onClick: R[11] || (R[11] = (g) => O(s).asking.value = !1)
                  }, {
                    default: N(() => [...R[19] || (R[19] = [
                      z("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (r(), j(We, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: R[12] || (R[12] = (g) => O(s).asking.value = !0)
                }, {
                  default: N(() => [...R[20] || (R[20] = [
                    z("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : l.value === "start" ? (r(), d(B, { key: 1 }, [
                A($t, null, {
                  default: N(() => [...R[21] || (R[21] = [
                    z("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (r(!0), d(B, null, Z(O(s).programs.value, (g) => (r(), j(We, {
                  key: g.name,
                  "data-agent-program": g.name,
                  onClick: (S) => (c(), O(s).start(g))
                }, {
                  default: N(() => [
                    z(v(g.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : l.value === "skills" ? (r(), j(Tg, {
                key: 2,
                skills: e.skills,
                onBrowse: R[13] || (R[13] = (g) => (c(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : i.value ? (r(), d(B, { key: 3 }, [
                A($t, null, {
                  default: N(() => [
                    z(v(i.value.label), 1)
                  ]),
                  _: 1
                }),
                l.value === "context" ? (r(), d(B, { key: 0 }, [
                  h("p", Gg, v(O(hv)(((_ = y.value) == null ? void 0 : _.last_compaction) ?? null)), 1),
                  h("div", Kg, [
                    h("span", Yg, [
                      h("span", {
                        style: pe({ width: `${w.value}%` })
                      }, null, 4)
                    ]),
                    h("span", Qg, v(w.value) + "%", 1)
                  ]),
                  I.value ? (r(), d("p", Xg, [
                    z(v(I.value) + " ", 1),
                    q.value ? (r(), j(So, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : k("", !0)
                  ])) : k("", !0)
                ], 64)) : k("", !0),
                l.value === "context" && x.value ? (r(), d("p", Jg, v(x.value), 1)) : (r(!0), d(B, { key: 2 }, Z(i.value.choices, (g) => (r(), j(We, {
                  key: g.value,
                  "data-agent-choice": g.value,
                  onClick: (S) => (O(s).choose(i.value.key, g), c())
                }, {
                  default: N(() => [
                    z(v(g.label), 1)
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
}, ty = /* @__PURE__ */ V(ey, [["__scopeId", "data-v-d7113347"]]), ny = {
  class: "who",
  "data-agent-who": ""
}, ay = { class: "name" }, sy = ["data-agent-state"], oy = {
  class: "sub",
  "data-agent-started-by": ""
}, ly = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, startedBy: { type: String, required: !0 }, agent: { type: Object, required: !0 }, programs: { type: Array, default: () => [] }, usage: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", ny, [
      h("h2", ay, [
        h("i", {
          class: X(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, sy),
        z(v(e.name), 1)
      ]),
      A(ty, {
        class: "bar",
        agent: e.agent,
        "agent-programs": e.programs,
        usage: e.usage,
        card: ""
      }, null, 8, ["agent", "agent-programs", "usage"]),
      h("p", oy, "Started by: " + v(e.startedBy), 1)
    ]));
  }
}, iy = /* @__PURE__ */ V(ly, [["__scopeId", "data-v-83bd4a9d"]]), ry = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, uy = { class: "scroll" }, cy = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, dy = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, fy = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = pr(), a = E(null), s = E(null), o = E(null), l = E(null), i = E({}), u = E({ helpers: 0, skills: 0 }), c = E(0), f = E([]), m = E([]), p = E([]), b = E("");
    let $ = 0;
    const y = M(() => {
      var q;
      return a.value.ended_at ? Ev(s.value) : `It has no task.${(q = s.value) != null && q.instruction ? " It was given an instruction." : ""}`;
    });
    async function w() {
      const q = ++$, P = await t.read(["usage", "inspector", fr(t.id), "--environment", t.environment]);
      q === $ && (b.value = P.ok ? "" : P.error, P.ok && (a.value = P.value.agent, s.value = P.value.facts, o.value = P.value.inspection, l.value = P.value.compaction ?? null, i.value = P.value.tool, u.value = { helpers: P.value.helpers, skills: P.value.skills }, f.value = P.value.points, m.value = P.value.programs, p.value = P.value.states ?? [], c.value += 1));
    }
    const x = M(() => /* @__PURE__ */ new Set([t.id])), C = {
      agent: (q) => $i(q, x.value),
      hook_call: (q) => od(q, "session_agent_id", x.value)
    };
    return qn(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], w, (q) => {
      var P;
      return ((P = C[q.event.split(".")[0]]) == null ? void 0 : P.call(C, q)) ?? !0;
    }), _e(w), (q, P) => {
      var I, Q;
      return r(), d("article", ry, [
        h("div", uy, [
          b.value ? (r(), d("p", cy, v(b.value), 1)) : a.value && o.value ? (r(), d(B, { key: 1 }, [
            A(iy, {
              name: O(Jt)(a.value, s.value).text,
              state: O(_v)(a.value, s.value),
              "started-by": o.value.started_by,
              agent: a.value,
              programs: m.value,
              usage: { agents: s.value ? [s.value] : [], windows: ((I = s.value) == null ? void 0 : I.windows) ?? [] }
            }, null, 8, ["name", "state", "started-by", "agent", "programs", "usage"]),
            A(Sg, {
              cells: O(Cv)({ row: a.value, facts: s.value, inspection: o.value, now: O(n) })
            }, null, 8, ["cells"]),
            A(ig, {
              inspection: o.value,
              tool: i.value,
              nothing: y.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            A(qv, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((Q = s.value) == null ? void 0 : Q.instruction) ?? "",
              points: f.value
            }, null, 8, ["label", "text", "points"]),
            A(bg, { states: p.value }, null, 8, ["states"]),
            A(hg, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            A(Qv, {
              id: e.id,
              read: e.read,
              counts: u.value,
              loads: c.value,
              details: O(Av)(a.value, o.value, l.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (r(), d("p", dy, "Ended " + v(O(on)(a.value.ended_at, O(n))) + ". It takes no more actions.", 1)) : k("", !0)
          ], 64)) : (r(), j(nt, { key: 2 }))
        ])
      ]);
    };
  }
}, $A = /* @__PURE__ */ V(fy, [["__scopeId", "data-v-0d31bed5"]]), my = Symbol.for("journal.toast"), hy = Symbol.for("journal.page-toasts");
function xA() {
  const e = $e(my, null);
  if (!e) throw new Error("useToast is called only inside a page that shows toasts");
  return e.raise;
}
const py = ["open", "copy", "own", "delete"], vy = (e) => e.danger ? "delete" : e.group ?? "own";
function gy(e) {
  return py.map((n) => e.filter((a) => vy(a) === n)).filter((n) => n.length).flatMap((n, a) => [
    ...a ? [{ separator: !0, key: `separator-${a}` }] : [],
    ...n.map((s, o) => ({ ...s, key: `${a}-${o}` }))
  ]);
}
function yy() {
  const e = E(null);
  let t = null;
  const n = (l, i, u, c, f = c) => {
    t = f, e.value = { at: l, head: i, items: u, target: c };
  };
  function a(l, i, u) {
    l.preventDefault(), n({ x: l.clientX, y: l.clientY }, i, u, l.currentTarget);
  }
  function s(l, i, u) {
    if (l.key !== "ContextMenu" && !(l.shiftKey && l.key === "F10")) return;
    l.preventDefault();
    const c = l.target.getBoundingClientRect();
    n({ x: Math.max(8, c.left + 8), y: Math.min(window.innerHeight - 8, c.bottom + 2) }, i, u, l.currentTarget);
  }
  function o() {
    e.value = null, t != null && t.isConnected && t.focus({ preventScroll: !0 });
  }
  return { menu: e, show: n, open: a, openFromKey: s, close: o };
}
const by = {
  key: 0,
  class: "context-head",
  "data-context-head": ""
}, ky = {
  key: 0,
  class: "context-separator",
  role: "separator",
  "data-context-separator": ""
}, wy = { class: "context-label" }, $y = {
  key: 0,
  class: "context-note",
  "data-context-reason": ""
}, xy = {
  key: 1,
  class: "context-note",
  "aria-hidden": "true"
}, Sy = {
  key: 2,
  class: "context-note"
}, My = ".context-menu", _y = {
  __name: "ContextMenu",
  props: {
    at: { type: Object, required: !0 },
    head: { type: String, default: "" },
    items: { type: Array, required: !0 },
    // the element the menu belongs to; it wears an accent ring while the menu is open
    target: { type: Object, default: null },
    depth: { type: Number, default: 0 }
  },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => gy(n.items)), o = E(null), l = E(""), i = (C) => [...C.querySelectorAll("[data-menu-item]:not(:disabled)")], u = (C, q) => {
      var P;
      return (P = q(i(C))) == null ? void 0 : P.focus();
    }, c = (C) => s.value.find((q) => q.key === (C == null ? void 0 : C.dataset.menuItem));
    function f(C, q) {
      if (!C.disabled) {
        if (C.children) {
          const P = q.getBoundingClientRect();
          o.value = { items: C.children, at: { x: P.right + 2, y: P.top - 4, flipX: P.left - 2 }, opener: q };
          return;
        }
        if (C.danger && l.value !== C.key) {
          l.value = C.key;
          return;
        }
        a("close", !0), C.run && setTimeout(C.run, 0);
      }
    }
    function m(C, q) {
      if (q.focus(), C.children && !C.disabled) return f(C, q);
      o.value = null;
    }
    function p(C, q) {
      var Q;
      const P = i(C);
      (Q = P.slice(P.indexOf(document.activeElement) + 1).concat(P).find((W) => c(W).label.toLowerCase().startsWith(q.toLowerCase()))) == null || Q.focus();
    }
    const b = {
      Home: (C) => u(C, (q) => q[0]),
      End: (C) => u(C, (q) => q[q.length - 1]),
      Enter: () => document.activeElement.click(),
      " ": () => document.activeElement.click(),
      ArrowRight: (C) => {
        var q;
        return ((q = c(document.activeElement)) == null ? void 0 : q.children) && document.activeElement.click();
      },
      ArrowLeft: () => n.depth && a("close", !1),
      Tab: () => a("close", !1)
    };
    function $(C) {
      const q = C.currentTarget, P = q.contains(document.activeElement) && document.activeElement.dataset.menuItem !== void 0;
      b[C.key] && (P || !["Enter", " ", "ArrowRight"].includes(C.key)) ? (C.preventDefault(), b[C.key](q)) : C.key.length === 1 && !C.ctrlKey && !C.metaKey && !C.altKey && p(q, C.key);
    }
    function y(C) {
      var q, P;
      (P = (q = C.target).closest) != null && P.call(q, My) || a("close", !1);
    }
    const w = () => a("close", !1), x = (C) => {
      const q = o.value.opener;
      o.value = null, C ? a("close", !0) : q.focus();
    };
    return _e(() => {
      var C;
      (C = n.target) == null || C.classList.add("menu-target"), !n.depth && (window.addEventListener("pointerdown", y, !0), window.addEventListener("scroll", y, !0), window.addEventListener("blur", w), window.addEventListener("resize", w));
    }), Te(() => {
      var C;
      (C = n.target) == null || C.classList.remove("menu-target"), window.removeEventListener("pointerdown", y, !0), window.removeEventListener("scroll", y, !0), window.removeEventListener("blur", w), window.removeEventListener("resize", w);
    }), (C, q) => {
      const P = ri("ContextMenu", !0);
      return r(), j(Wt, {
        class: "context-menu",
        role: "menu",
        "data-context-menu": "",
        point: e.at,
        gap: 0,
        "min-width": 196,
        "max-width": 320,
        "aria-label": e.head,
        onClose: q[0] || (q[0] = (I) => a("close", !1)),
        onKeydown: $,
        onContextmenu: q[1] || (q[1] = he(() => {
        }, ["prevent"]))
      }, {
        default: N(() => [
          e.head && !e.depth ? (r(), d("p", by, v(e.head), 1)) : k("", !0),
          (r(!0), d(B, null, Z(s.value, (I) => (r(), d(B, {
            key: I.key
          }, [
            I.separator ? (r(), d("hr", ky)) : (r(), j(We, {
              key: 1,
              role: "menuitem",
              class: X({ "context-danger": I.danger, "context-armed": l.value === I.key }),
              disabled: I.disabled,
              "aria-haspopup": I.children ? "menu" : void 0,
              title: I.disabled ? I.reason : void 0,
              "data-menu-item": I.key,
              onClick: (Q) => f(I, Q.currentTarget),
              onMouseenter: (Q) => m(I, Q.currentTarget)
            }, {
              default: N(() => [
                h("span", wy, v(l.value === I.key ? I.armedLabel ?? `${I.label}: click again` : I.label), 1),
                I.disabled ? (r(), d("span", $y, v(I.reason), 1)) : I.children ? (r(), d("span", xy, "›")) : I.keys ? (r(), d("kbd", Sy, v(I.keys), 1)) : k("", !0)
              ]),
              _: 2
            }, 1032, ["class", "disabled", "aria-haspopup", "title", "data-menu-item", "onClick", "onMouseenter"]))
          ], 64))), 128)),
          o.value ? (r(), j(P, {
            key: 1,
            depth: e.depth + 1,
            at: o.value.at,
            items: o.value.items,
            onClose: x
          }, null, 8, ["depth", "at", "items"])) : k("", !0)
        ]),
        _: 1
      }, 8, ["point", "aria-label"]);
    };
  }
}, Cy = /* @__PURE__ */ V(_y, [["__scopeId", "data-v-92b4e261"]]), Ey = {
  __name: "ActionsMenu",
  props: { items: { type: Array, required: !0 }, head: { type: String, default: "" }, label: { type: String, default: "Actions" } },
  setup(e) {
    const t = e, { menu: n, show: a, close: s } = yy(), o = (u, c = null) => {
      var f;
      return (f = globalThis[hy]) == null ? void 0 : f.raise(u, c);
    }, l = (u) => u.map((c) => ({ ...c, run: c.run && (() => c.run({ say: o })), children: c.children && l(c.children) }));
    function i(u) {
      const c = u.currentTarget.getBoundingClientRect();
      a({ x: c.left, y: c.bottom + 2, flipX: c.right }, t.head, l(t.items), u.currentTarget);
    }
    return (u, c) => (r(), d(B, null, [
      A(ie, {
        small: "",
        "aria-haspopup": "menu",
        "aria-expanded": !!O(n),
        "data-actions-menu": "",
        onClick: i
      }, {
        default: N(() => [
          z(v(e.label), 1),
          A(se, {
            name: "chevronRight",
            size: 11,
            facing: "down"
          })
        ]),
        _: 1
      }, 8, ["aria-expanded"]),
      O(n) ? (r(), j(Cy, Ne({ key: 0 }, O(n), { onClose: O(s) }), null, 16, ["onClose"])) : k("", !0)
    ], 64));
  }
};
function Ay(e) {
  const t = E(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return _e(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), tt(() => n.disconnect()), t;
}
const Oy = ["innerHTML"], Ty = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = M(() => tl[t.name] || tl.dot);
    return (a, s) => (r(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Oy));
  }
}, Ct = /* @__PURE__ */ V(Ty, [["__scopeId", "data-v-beb5935c"]]), Iy = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: X(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      A(Ct, { name: "fold" })
    ], 2));
  }
}, ln = /* @__PURE__ */ V(Iy, [["__scopeId", "data-v-d03899bb"]]), By = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, Ry = ["aria-expanded"], Ly = {
  class: "links-count",
  "data-inspector-links-count": ""
}, Ny = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, qy = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, Dy = {
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
    const t = e, n = E(t.open), a = E(0), s = E(0), o = E("");
    let l = 0;
    async function i() {
      const u = ++l, c = ["link", "list", "--row", `${t.model}:${t.id}`, "--group-counterparts", ...t.outsidePlan ? ["--outside-plan"] : [], "--page-size", "1"], f = await t.read(c);
      u === l && (o.value = f.ok ? "" : f.error, f.ok && (a.value = f.value.total), s.value += 1);
    }
    return ce(() => `${t.model}:${t.id}`, () => {
      n.value = t.open, a.value = 0, i();
    }, { immediate: !0 }), qn(["link.*", "phase.*", "phase_task.*"], i), (u, c) => (r(), d(B, null, [
      a.value ? (r(), d("section", By, [
        h("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (f) => n.value = !n.value)
        }, [
          c[2] || (c[2] = h("span", { class: "links-label" }, "Links", -1)),
          h("span", Ly, v(a.value), 1),
          A(ln, { open: n.value }, null, 8, ["open"])
        ], 8, Ry),
        h("div", {
          class: X(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (r(), d("div", Ny, [
            A(Ud, {
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
      o.value ? (r(), d("p", qy, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, Mo = /* @__PURE__ */ V(Dy, [["__scopeId", "data-v-a4550728"]]);
var ii;
/Mac|iPhone|iPad/.test(((ii = navigator.userAgentData) == null ? void 0 : ii.platform) || navigator.platform);
function yr(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const Mn = (e, t = 40) => e.length > t ? `${e.slice(0, t - 1)}…` : e;
async function jt(e, t, n) {
  n(await rr(e) ? `Copied ${t || Mn(e)}` : "The browser did not allow copying");
}
function SA({ word: e = "Delete", name: t, remove: n, restore: a = null, erase: s = !1 }) {
  return {
    label: e,
    danger: !0,
    armedLabel: s ? "Click again: the value is erased for good" : `${e}: click again`,
    run: async ({ say: o }) => {
      const l = await n();
      if (!l.ok) return o(l.error);
      if (s) return o(`Deleted ${t}. The value is erased.`);
      o(`${e}d ${t}`, a ? { line: a } : null);
    }
  };
}
const Py = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), Ps = (e) => e.charAt(0).toUpperCase() + e.slice(1), jy = (e) => Ps(e.replace(/_at$/, "").replaceAll("_", " ")), Fy = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, Wy = (e, t, n) => [Ps(`${e} ${n}`), (t == null ? void 0 : t.state) && Ps(t.state)].filter(Boolean).join(" · "), br = (e) => Jt(e).text, Hy = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? br(t) : (e == null ? void 0 : e.name) ?? "", zy = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? br(t) : "", Uy = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !Py.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: jy(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], Vy = { reviewing: "Under review" }, Gy = (e, t) => e || Vy[t == null ? void 0 : t.state] || "";
async function kr(e, t) {
  const n = t.creator_id ? ["--creator", String(t.creator_id)] : [], a = t.agent_id ? ["--owner", String(t.agent_id)] : [];
  if (!n.length && !a.length) return { creator: "", owner: "" };
  const s = await e(["agent", "people", ...n, ...a]);
  return s.ok ? { creator: Hy(s.value.actor, s.value.creator_agent), owner: a.length ? zy(t, s.value.owner) : "" } : { creator: "", owner: "" };
}
const Ky = ["data-comment-id"], Yy = {
  key: 0,
  class: "comment-top"
}, Qy = { class: "comment-mark" }, Xy = {
  class: "comment-body",
  "data-comment": ""
}, Jy = { class: "comment-foot" }, Zy = {
  key: 1,
  "data-comment-lost": ""
}, e0 = {
  __name: "CommentCard",
  props: { comment: { type: Object, required: !0 }, hot: Boolean, lost: Boolean },
  emits: ["show"],
  setup(e) {
    const t = e, n = () => t.comment.selection_type === "code";
    return (a, s) => (r(), d("article", {
      class: X(["comment-card", { hot: e.hot }]),
      "data-comment-card": "",
      "data-comment-id": e.comment.id
    }, [
      e.comment.quote ? (r(), d("div", Yy, [
        h("span", Qy, v(e.comment.number), 1),
        h("span", {
          class: X(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, v(e.comment.quote), 3)
      ])) : k("", !0),
      h("p", Xy, v(e.comment.body), 1),
      h("div", Jy, [
        e.comment.created_at ? (r(), j(Ye, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : k("", !0),
        e.lost ? (r(), d("span", Zy, "The text has changed here")) : e.comment.quote ? (r(), d("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : k("", !0)
      ])
    ], 10, Ky));
  }
}, wr = /* @__PURE__ */ V(e0, [["__scopeId", "data-v-a37d4507"]]), t0 = {
  class: "comment-box",
  "data-comment-box": ""
}, n0 = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, a0 = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, s0 = { class: "comment-row" }, o0 = ["placeholder"], l0 = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ mt({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ mt(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = qt(e, "draft"), l = E(""), i = E(!1), u = E(null), c = M(() => {
      var b;
      return ((b = a.selection) == null ? void 0 : b.selection_type) === "code";
    }), f = M(() => a.narrow ? "Write a comment" : "Write a comment, or select text to comment on a selection");
    function m() {
      u.value.style.height = "auto", u.value.style.height = `${u.value.scrollHeight + 2}px`;
    }
    async function p() {
      const b = o.value.trim();
      if (!(!b || i.value)) {
        l.value = "", i.value = !0;
        try {
          await a.send(b), o.value = "", await Re(), m();
        } catch ($) {
          l.value = $.message;
        } finally {
          i.value = !1;
        }
      }
    }
    return t({ focus: () => u.value.focus() }), (b, $) => (r(), d("div", t0, [
      e.selection ? (r(), d("div", n0, [
        $[3] || ($[3] = h("span", { class: "comment-on-label" }, "On this selection", -1)),
        h("span", {
          class: X(["comment-on-words", { mono: c.value }])
        }, v(e.selection.quote), 3),
        A(Ia, {
          title: "Comment on the whole document instead",
          onClick: $[0] || ($[0] = (y) => s("clear"))
        })
      ])) : k("", !0),
      l.value ? (r(), d("p", a0, v(l.value), 1)) : k("", !0),
      h("div", s0, [
        ge(h("textarea", {
          ref_key: "box",
          ref: u,
          "onUpdate:modelValue": $[1] || ($[1] = (y) => o.value = y),
          rows: "1",
          maxlength: "2000",
          class: X({ on: o.value }),
          placeholder: f.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: m,
          onKeydown: $[2] || ($[2] = ze((y) => O(yr)(y, p), ["enter"]))
        }, null, 42, o0), [
          [Fe, o.value]
        ]),
        A(ie, {
          variant: "primary",
          busy: i.value,
          disabled: !o.value.trim(),
          "data-comment-send": "",
          onClick: p
        }, {
          default: N(() => [...$[4] || ($[4] = [
            z("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, i0 = /* @__PURE__ */ V(l0, [["__scopeId", "data-v-41d2081c"]]), Qn = (e) => e ? e.split(", ") : [];
function r0({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function u0(e, t) {
  return {
    reads: Qn(e.reads_allowed),
    runs: Qn(e.runs_allowed),
    missing: [...Qn(e.reads_missing), ...Qn(e.runs_missing)],
    ask: t
  };
}
const c0 = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = ri("SkeletonParts", !0);
      return r(!0), d(B, null, Z(e.parts, (u, c) => (r(), d(B, { key: c }, [
        (r(!0), d(B, null, Z(u.count, (f) => (r(), j(Ft, {
          key: f,
          value: u.shape
        }, {
          line: N(() => [
            A(pn, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: pe({ width: u.width, height: `${t[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: N(() => [
            A(pn, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: pe({ width: `${n[u.size]}px`, height: `${n[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: N(() => [
            A(pn, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: pe({ width: u.width, height: `${u.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: N(() => [...l[0] || (l[0] = [
            h("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: N(() => [
            h("div", {
              class: "skeleton-row",
              style: pe(a(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: N(() => [
            h("div", {
              class: "skeleton-stack",
              style: pe(a(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: N(() => [
            h("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: pe(a(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: N(() => [
            h("div", {
              class: "skeleton-grid",
              style: pe(s(u))
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
}), d0 = /* @__PURE__ */ V(c0, [["__scopeId", "data-v-fa8baeaf"]]), f0 = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, m0 = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (r(), d("div", f0, [
      A(d0, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, _o = /* @__PURE__ */ V(m0, [["__scopeId", "data-v-52f66b64"]]), Co = {
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
}, h0 = { class: "bars" }, p0 = { class: "bar-name" }, v0 = { class: "bar-value" }, g0 = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = M(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (r(), d("div", h0, [
      (r(!0), d(B, null, Z(e.items, (u, c) => (r(), j(Je(u.open ? "button" : "div"), {
        key: `${c}-${u.label}`,
        type: u.open ? "button" : void 0,
        class: X(["bar-row", u.tone, { opens: u.open }]),
        onClick: (f) => u.open && a("open", u.open)
      }, {
        default: N(() => [
          h("span", p0, v(u.label), 1),
          A(Qi, {
            value: Number(u.value) || 0,
            max: s.value,
            tone: u.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          h("span", v0, v(u.value) + v(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, y0 = /* @__PURE__ */ V(g0, [["__scopeId", "data-v-663427f4"]]), b0 = { class: "bars" }, k0 = {
  key: 0,
  class: "bars-title"
}, w0 = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", b0, [
      e.node.title ? (r(), d("span", k0, v(e.node.title), 1)) : k("", !0),
      A(y0, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, $0 = /* @__PURE__ */ V(w0, [["__scopeId", "data-v-7135bb11"]]), x0 = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = M(() => n[a.node.type](a.node));
    return (l, i) => (r(), d("div", {
      class: X([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: pe(o.value)
    }, [
      (r(!0), d(B, null, Z(e.node.children || [], (u, c) => (r(), j(Sr, {
        key: c,
        node: u,
        onOpen: i[0] || (i[0] = (f) => s("open", f)),
        onFile: i[1] || (i[1] = (f) => s("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, $r = /* @__PURE__ */ V(x0, [["__scopeId", "data-v-d142a3f4"]]), S0 = {
  key: 0,
  class: "card-head"
}, M0 = { class: "card-title" }, _0 = {
  key: 0,
  class: "card-note"
}, C0 = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", {
      class: X(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (r(), d("header", S0, [
        h("span", M0, v(e.node.title), 1),
        e.node.note ? (r(), d("span", _0, v(e.node.note), 1)) : k("", !0)
      ])) : k("", !0),
      A($r, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, E0 = /* @__PURE__ */ V(C0, [["__scopeId", "data-v-67b72d40"]]), A0 = { class: "fact" }, O0 = { class: "fact-label" }, T0 = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", A0, [
      h("span", O0, v(e.label), 1),
      A(ut, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, I0 = /* @__PURE__ */ V(T0, [["__scopeId", "data-v-3a88ecf8"]]), B0 = { class: "list" }, R0 = { class: "list-label" }, L0 = {
  key: 1,
  class: "list-note"
}, N0 = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", B0, [
      (r(!0), d(B, null, Z(e.items, (o, l) => (r(), j(Je(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: X(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: N(() => [
          h("span", R0, v(o.label), 1),
          o.badge ? (r(), j(So, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : k("", !0),
          o.note ? (r(), d("span", L0, v(o.note), 1)) : k("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, q0 = /* @__PURE__ */ V(N0, [["__scopeId", "data-v-ebe2ae0a"]]), es = Symbol.for("journal.context-place"), Et = {
  mounted(e, t) {
    e[es] = t.value;
  },
  updated(e, t) {
    e[es] = t.value;
  },
  unmounted(e) {
    delete e[es];
  }
}, D0 = { class: "table" }, P0 = {
  key: 0,
  class: "table-row empty"
}, j0 = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" }, widths: { type: Array, default: () => [] } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => ({ gridTemplateColumns: n.widths.length ? n.widths.join(" ") : `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` })), o = (l) => {
      const i = l.cells.join(" ").replace(/\s+/g, " ").trim();
      return {
        head: Mn(i, 40),
        items: [
          { label: "Open", group: "open", disabled: !l.open, reason: "Nothing to open", run: () => a("open", l.open) },
          { label: "Copy number", group: "copy", run: ({ say: u }) => jt(String(l.cells[0] ?? ""), "", u) },
          { label: "Copy line", group: "copy", run: ({ say: u }) => jt(i, "the line", u) }
        ]
      };
    };
    return (l, i) => (r(), d("div", D0, [
      h("div", {
        class: "table-row head",
        style: pe(s.value)
      }, [
        (r(!0), d(B, null, Z(e.columns, (u) => (r(), d("span", {
          key: u,
          class: "cell"
        }, v(u), 1))), 128))
      ], 4),
      (r(!0), d(B, null, Z(e.rows, (u, c) => ge((r(), j(Je(u.open ? "button" : "div"), {
        key: c,
        type: u.open ? "button" : void 0,
        class: X(["table-row", u.tone, { opens: u.open, active: u.active }]),
        style: pe(s.value),
        "data-table-row": u.mark,
        onClick: (f) => u.open && a("open", u.open)
      }, {
        default: N(() => [
          (r(!0), d(B, null, Z(u.cells, (f, m) => (r(), d("span", {
            key: m,
            class: "cell"
          }, v(f), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "data-table-row", "onClick"])), [
        [O(Et), () => o(u)]
      ])), 128)),
      !e.rows.length && e.empty ? (r(), d("div", P0, v(e.empty), 1)) : k("", !0)
    ]));
  }
}, xr = /* @__PURE__ */ V(j0, [["__scopeId", "data-v-8d66b77f"]]), F0 = { class: "stat-value" }, W0 = { class: "stat-label" }, H0 = {
  key: 0,
  class: "stat-note"
}, z0 = {
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
    return (a, s) => (r(), j(Je(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: X(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: N(() => [
        h("span", F0, v(e.value), 1),
        h("span", W0, v(e.label), 1),
        e.note ? (r(), d("span", H0, v(e.note), 1)) : k("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, U0 = /* @__PURE__ */ V(z0, [["__scopeId", "data-v-ad0db6d6"]]), V0 = { class: "code" }, G0 = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = e, a = ["stack", "row", "grid"], s = M(() => a.includes(n.node.type) ? "group" : n.node.type), o = t, l = (u) => o("open", u), i = (u) => o("file", u);
    return (u, c) => (r(), j(Ft, { value: s.value }, {
      group: N(() => [
        A($r, {
          node: e.node,
          onOpen: l,
          onFile: i
        }, null, 8, ["node"])
      ]),
      card: N(() => [
        A(E0, {
          node: e.node,
          onOpen: l,
          onFile: i
        }, null, 8, ["node"])
      ]),
      heading: N(() => [
        h("h3", {
          class: X(["heading", `level-${e.node.level || 2}`])
        }, v(e.node.text), 3)
      ]),
      divider: N(() => [...c[2] || (c[2] = [
        h("hr", { class: "divider" }, null, -1)
      ])]),
      stat: N(() => [
        A(U0, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: c[0] || (c[0] = (f) => l(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: N(() => [
        A($0, {
          node: e.node,
          onOpen: l
        }, null, 8, ["node"])
      ]),
      table: N(() => [
        A(xr, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: l
        }, null, 8, ["columns", "rows"])
      ]),
      list: N(() => [
        A(q0, {
          items: e.node.items,
          onOpen: l
        }, null, 8, ["items"])
      ]),
      text: N(() => [
        A(ut, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: N(() => [
        A(I0, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: N(() => [
        A(So, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: N(() => [
        h("pre", V0, [
          h("code", null, v(e.node.text), 1)
        ])
      ]),
      file: N(() => [
        h("button", {
          type: "button",
          class: "file",
          onClick: c[1] || (c[1] = (f) => i(e.node))
        }, v(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Sr = /* @__PURE__ */ V(G0, [["__scopeId", "data-v-b9156b43"]]), K0 = { class: "dashboard" }, Y0 = { class: "trail" }, Q0 = ["onClick"], X0 = {
  key: 0,
  class: "gone",
  role: "status"
}, J0 = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (p) => p in (n.document.pages || {}), o = E(!!n.page && !s(n.page)), l = E(n.page && !o.value ? [n.page] : []), i = M(() => l.value.at(-1) || n.document.start), u = M(() => (n.document.pages || {})[i.value] || null), c = (p) => ((n.document.pages || {})[p] || {}).title || p, f = (p) => {
      o.value = !1, l.value = [...l.value, p];
    }, m = (p) => {
      o.value = !1, l.value = l.value.slice(0, p);
    };
    return ce(
      () => n.document.start,
      () => l.value = []
    ), (p, b) => (r(), d("div", K0, [
      e.document.broken ? (r(), j(St, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: N(() => [
          z(v(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (r(), j(St, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: N(() => [
          z(v(e.document.missing), 1)
        ]),
        _: 1
      })) : u.value ? (r(), d(B, { key: 2 }, [
        h("nav", Y0, [
          h("button", {
            type: "button",
            class: X(["step", { current: !l.value.length }]),
            onClick: b[0] || (b[0] = ($) => m(0))
          }, v(c(e.document.start)), 3),
          (r(!0), d(B, null, Z(l.value, ($, y) => (r(), d(B, {
            key: `${y}-${$}`
          }, [
            b[2] || (b[2] = h("span", { class: "sep" }, "/", -1)),
            h("button", {
              type: "button",
              class: X(["step", { current: y === l.value.length - 1 }]),
              onClick: (w) => m(y + 1)
            }, v(c($)), 11, Q0)
          ], 64))), 128))
        ]),
        o.value ? (r(), d("p", X0, "What you opened is no longer in this dashboard. Here is its start page.")) : k("", !0),
        A(nn, {
          name: "page",
          mode: "out-in"
        }, {
          default: N(() => [
            (r(), d("div", {
              key: i.value,
              class: "page"
            }, [
              A(Sr, {
                node: u.value.view,
                onOpen: f,
                onFile: b[1] || (b[1] = ($) => a("file", $))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : k("", !0)
    ]));
  }
}, Z0 = /* @__PURE__ */ V(J0, [["__scopeId", "data-v-fbe83734"]]);
function eb(e, t) {
  const n = at(), a = Oa(e, Co.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  _e(e), tt(() => {
    s(), a.cancel();
  });
}
const tb = {
  key: 0,
  class: "window-failure"
}, nb = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = at(), o = E(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? eb(l, n.events) : oo(l, () => !0, Co.documentWithNoEvents), (i, u) => o.value && !o.value.ok ? (r(), d("p", tb, v(o.value.error), 1)) : o.value ? (r(), j(Z0, {
      key: 1,
      document: o.value.value,
      onFile: u[0] || (u[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : k("", !0);
  }
}, ab = 1e4;
class sb {
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
    return this.heardAt !== null && t - this.heardAt > ab;
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
const ob = {
  key: 0,
  class: "frame-note"
}, lb = {
  key: 0,
  class: "frame-note"
}, ib = ["src", "title"], rb = 1e3, ub = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = at(), a = E(null), s = E(!1), o = E(!1);
    let l = null, i = 0;
    return _e(() => {
      l = new sb(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, rb);
    }), Te(() => {
      l == null || l.stop(), clearInterval(i);
    }), (u, c) => o.value ? (r(), d("p", ob, "This window was closed because it stopped answering.")) : (r(), d(B, { key: 1 }, [
      s.value ? (r(), d("div", lb, [
        c[2] || (c[2] = h("p", null, "This window has not answered for ten seconds.", -1)),
        A(ie, {
          onClick: c[0] || (c[0] = (f) => o.value = !0)
        }, {
          default: N(() => [...c[1] || (c[1] = [
            z("Close the window", -1)
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
        title: O(n).window
      }, null, 8, ib)
    ], 64));
  }
}, cb = /* @__PURE__ */ V(ub, [["__scopeId", "data-v-32a49046"]]), db = {
  class: "allowance-prompt",
  role: "dialog"
}, fb = { class: "allowance-prompt-text" }, mb = { class: "allowance-prompt-buttons" }, hb = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", db, [
      h("p", fb, v(O(r0)(e.request)), 1),
      h("div", mb, [
        A(ie, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: N(() => [...s[2] || (s[2] = [
            z("Allow", -1)
          ])]),
          _: 1
        }),
        A(ie, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: N(() => [...s[3] || (s[3] = [
            z("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, pb = /* @__PURE__ */ V(hb, [["__scopeId", "data-v-cad69fe2"]]), ts = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), j(St, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: N(() => [
        z(v(e.reason) + " ", 1),
        e.retry ? (r(), j(ie, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: N(() => [...s[2] || (s[2] = [
            z("Retry", -1)
          ])]),
          _: 1
        })) : k("", !0),
        e.removable ? (r(), j(ie, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: N(() => [...s[3] || (s[3] = [
            z("Remove tab", -1)
          ])]),
          _: 1
        })) : k("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, vb = ["data-window", "data-agent"], gb = {
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
    const n = e, a = t, s = E(""), o = E(0);
    function l() {
      s.value = "", o.value++;
    }
    const i = $e(vd, null), u = Ef({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: M(() => n.options),
      declared: n.declared,
      page: $e(xf, null),
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
    to(Be, u), ce(() => n.visible, (m) => m && n.subscriptions.shown(n.name)), _e(u.settle), Te(() => {
      u.cancel(), n.subscriptions.stopAll(n.name);
    }), Ku((m) => (console.error(`window ${n.name} failed`, m), s.value = m instanceof Error ? m.message : String(m), n.subscriptions.stopAll(n.name), !1));
    const c = () => _a(n.component), f = () => {
      var m, p;
      return ((p = (m = n.prompts) == null ? void 0 : m.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (m, p) => (r(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (r(), j(pb, {
        key: 0,
        request: f(),
        onAnswer: p[0] || (p[0] = (b) => e.prompts.answer(b))
      }, null, 8, ["request"])) : k("", !0),
      e.unavailableReason ? (r(), j(ts, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (r(), j(ts, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (r(), d(B, { key: 4 }, [
        (r(), j(c, { key: o.value })),
        e.skeleton.length && !O(u).answered.value ? (r(), j(_o, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : k("", !0)
      ], 64)) : (r(), j(ts, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (b) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, vb));
  }
}, vn = /* @__PURE__ */ V(gb, [["__scopeId", "data-v-ec294108"]]), Mr = {
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
    const n = e, a = t, s = { render: () => _a(cb, { src: n.entry.entry_url }) };
    return (o, l) => (r(), j(vn, {
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
}, yb = ["data-window"], _r = {
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
    const n = e, a = t, s = lt(null), o = E("");
    return ce(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, Ic();
          } catch (i) {
            if (Oc(i) && Tc(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (l, i) => !s.value && !o.value && !e.entry.unavailable_reason ? (r(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      A(_o, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, yb)) : (r(), j(vn, {
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
}, Cr = {
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
    const n = t, a = e, s = M(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = M(() => s.value && { render: () => _a(nb, { line: s.value.line, events: s.value.events }) }), l = E(null), i = M(() => {
      var p, b;
      return ((p = s.value) == null ? void 0 : p.loading) === "component" && !s.value.allowed && !((b = l.value) != null && b.component_trusted);
    }), u = M(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = M(
      () => {
        var p, b;
        return l.value ? u0(l.value, m) : { reads: ((p = s.value) == null ? void 0 : p.reads) || [], runs: ((b = s.value) == null ? void 0 : b.runs) || [], missing: [], ask: async () => !0 };
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
    return ce(
      () => {
        var p, b;
        return ((p = s.value) == null ? void 0 : p.entry_url) || ((b = s.value) == null ? void 0 : b.line);
      },
      async () => {
        await f(), c.value.missing.length && !i.value && m();
      },
      { immediate: !0 }
    ), (p, b) => {
      var $, y;
      return !s.value && (($ = e.catalogue.loaded) == null ? void 0 : $.value) === !1 ? (r(), j(_o, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((y = s.value) == null ? void 0 : y.shows) === "one-agent" && e.agent === null ? (r(), j(St, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (r(), j(vn, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": u.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (r(), j(_r, {
        key: c.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: b[0] || (b[0] = (w, x) => n("option", w, x))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (r(), j(Mr, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: b[1] || (b[1] = (w, x) => n("option", w, x))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (r(), j(vn, {
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
        onOption: b[2] || (b[2] = (w, x) => n("option", w, x))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (r(), j(vn, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: b[3] || (b[3] = (w) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, bb = ["data-section"], kb = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, wb = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = $e(Ta, null), a = M(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = M(() => ({ row: t.row }));
    return (o, l) => O(n) ? (r(!0), d(B, { key: 0 }, Z(a.value, (i) => (r(), d("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (r(), j(Cr, {
        key: 0,
        name: i.name,
        catalogue: O(n).catalogue,
        subscriptions: O(n).subscriptions,
        environment: O(n).environment,
        prompts: O(n).prompts,
        "shell-read": O(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (r(), d("p", kb, v(i.name) + " is not available", 1))
    ], 8, bb))), 128)) : k("", !0);
  }
}, js = /* @__PURE__ */ V(wb, [["__scopeId", "data-v-a47d36b7"]]), $b = { class: "rail-head" }, xb = { key: 0 }, Sb = {
  key: 1,
  class: "rail-none"
}, Mb = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (r(), d("aside", {
      class: X(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      h("div", $b, [
        n[0] || (n[0] = h("h3", null, "Comments", -1)),
        e.comments.length ? (r(), d("span", xb, v(e.total || e.comments.length), 1)) : k("", !0)
      ]),
      e.comments.length ? (r(!0), d(B, { key: 0 }, Z(e.comments, (a) => (r(), j(wr, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (r(), d("p", Sb, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, _b = /* @__PURE__ */ V(Mb, [["__scopeId", "data-v-4d684649"]]), Cb = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, Eb = ["aria-pressed"], Ab = ["aria-pressed"], Ob = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, Tb = {
  key: 0,
  role: "alert"
}, Ib = {
  key: 1,
  class: "sidebar-none"
}, Bb = ["data-question-id"], Rb = { class: "question-state" }, Lb = ["data-question-show", "onClick"], Nb = {
  key: 0,
  class: "sidebar-none"
}, qb = {
  key: 1,
  class: "question-answer"
}, Db = {
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
    const t = $e(Ta, null);
    return (n, a) => (r(), d("div", {
      class: X(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      h("nav", Cb, [
        h("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, Eb),
        h("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, Ab)
      ]),
      e.mode === "comments" ? (r(), d(B, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (r(), j(_b, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : k("", !0),
        A(Bn, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (r(), d("aside", Ob, [
        e.failure ? (r(), d("p", Tb, v(e.failure), 1)) : e.questions.length ? k("", !0) : (r(), d("p", Ib, "No questions about this text yet.")),
        (r(!0), d(B, null, Z(e.questions, (s) => {
          var o;
          return r(), d("section", {
            key: s.id,
            class: X(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            h("span", Rb, v(O(wn)("question", s.state)), 1),
            h("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, v(s.text), 9, Lb),
            s.quote ? (r(), d(B, { key: 0 }, [
              h("blockquote", null, v(s.quote), 1),
              e.lost.includes(s.id) ? (r(), d("p", Nb, "The quoted text has changed.")) : k("", !0)
            ], 64)) : k("", !0),
            s.answer ? (r(), d("p", qb, "Answered: " + v(s.answer), 1)) : k("", !0),
            A(js, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            A(go, {
              name: "row.question",
              row: { ...s, term: "question" },
              environment: ((o = O(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, Bb);
        }), 128))
      ]))
    ], 2));
  }
}, yl = /* @__PURE__ */ V(Db, [["__scopeId", "data-v-660e5c85"]]), Pb = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, jb = {
  __name: "DocumentEditDialog",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = tn({ abstract: n.row.abstract, body: n.row.body }), o = E("");
    async function l() {
      const i = await n.read([n.term, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = i.ok ? "" : i.error, i.ok && a("saved");
    }
    return (i, u) => (r(), j(an, {
      padded: "",
      title: "Edit the document",
      wide: "",
      onClose: u[3] || (u[3] = (c) => a("close"))
    }, {
      foot: N(() => [
        h("span", Pb, v(o.value), 1),
        A(ie, {
          onClick: u[2] || (u[2] = (c) => a("close"))
        }, {
          default: N(() => [...u[6] || (u[6] = [
            z("Cancel", -1)
          ])]),
          _: 1
        }),
        A(ie, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: N(() => [...u[7] || (u[7] = [
            z("Save", -1)
          ])]),
          _: 1
        })
      ]),
      default: N(() => [
        h("form", {
          class: "edit-form",
          "data-text-form": "",
          onSubmit: he(l, ["prevent"])
        }, [
          h("label", null, [
            u[4] || (u[4] = h("span", null, "Abstract", -1)),
            ge(h("input", {
              "onUpdate:modelValue": u[0] || (u[0] = (c) => s.abstract = c)
            }, null, 512), [
              [Fe, s.abstract]
            ])
          ]),
          h("label", null, [
            u[5] || (u[5] = h("span", null, "Text", -1)),
            ge(h("textarea", {
              "onUpdate:modelValue": u[1] || (u[1] = (c) => s.body = c),
              rows: "20"
            }, null, 512), [
              [Fe, s.body]
            ])
          ])
        ], 32)
      ]),
      _: 1
    }));
  }
}, Fb = /* @__PURE__ */ V(jb, [["__scopeId", "data-v-464d77a8"]]);
function Er(e, t) {
  const n = E([]), a = E(!1), s = E(null), o = E(0), l = E(!1), i = E("");
  let u = 0, c = 0;
  const f = ($) => {
    if (typeof $.body == "string") return $.body;
    const { term: y, id: w, title: x } = e(), C = `On ${y} ${w}, ${x}: `;
    return $.text.startsWith(C) ? $.text.slice(C.length) : $.text;
  };
  async function m($ = 1) {
    const { term: y, id: w } = e();
    if (!w) return;
    const x = ++c;
    l.value = !0, i.value = "";
    try {
      const C = await t([y, "comments", String(w), "--page", String($), "--page-size", "25"]);
      if (x !== c) return;
      if (!C.ok) {
        i.value = C.error;
        return;
      }
      const q = C.value.rows ?? [], P = $ === 1 ? q : [...n.value, ...q];
      n.value = [...new Map(P.map((I) => [I.id, I])).values()], o.value = C.value.total ?? n.value.length, s.value = C.value.next_page ?? null;
    } catch (C) {
      x === c && (i.value = C.message);
    } finally {
      x === c && (l.value = !1);
    }
  }
  async function p($) {
    var I;
    const { term: y, id: w } = e(), x = `${y}:${w}`, C = { id: `sending-${++u}`, text: $ };
    n.value = [...n.value, C], o.value++, a.value = !0;
    const q = await t([y, "comment", String(w), $]);
    if (x !== `${e().term}:${e().id}`) return;
    if (!q.ok)
      throw n.value = n.value.filter((Q) => Q.id !== C.id), o.value = Math.max(0, o.value - 1), new Error(q.error);
    await m();
    const P = (I = q.value) == null ? void 0 : I.id;
    P && !n.value.some((Q) => Q.id === P) && (n.value = [...n.value, { ...C, id: P }]);
  }
  const b = () => !l.value && s.value && m(s.value);
  return ce(() => `${e().term}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, i.value = "", c++, m();
  }, { immediate: !0 }), { comments: n, open: a, words: f, send: p, load: m, loadMore: b, nextPage: s, total: o, loading: l, failure: i };
}
function Wb(e, t) {
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
const Hb = {
  class: "document-tab",
  "data-document-revisions": ""
}, zb = ["datetime"], Ub = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, Vb = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, Gb = {
  key: 2,
  class: "document-none"
}, Kb = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(null), o = E(""), l = M(() => [...n.revisions].sort((f, m) => m.number - f.number)), i = M(() => s.value ? Wb(s.value.body, n.text) : []);
    async function u(f) {
      const m = await n.read(["doc", "revision", String(n.id), String(f.number)]);
      s.value = m.ok ? m.value : null, o.value = m.ok ? "" : m.error;
    }
    async function c() {
      const f = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = f.ok ? "" : f.error, f.ok && a("restored");
    }
    return (f, m) => (r(), d("div", Hb, [
      e.editing ? (r(), j(ie, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: m[0] || (m[0] = (p) => a("close-revision"))
      }, {
        default: N(() => [...m[1] || (m[1] = [
          z("Close the open revision", -1)
        ])]),
        _: 1
      })) : k("", !0),
      e.revisions.length ? (r(), d(B, { key: 1 }, [
        (r(!0), d(B, null, Z(l.value, (p, b) => (r(), j(ie, {
          key: p.number,
          variant: "text",
          "data-text-revision": p.number,
          onClick: ($) => u(p)
        }, {
          default: N(() => [
            z("Revision " + v(p.number), 1),
            b ? k("", !0) : (r(), d(B, { key: 0 }, [
              z(" · current")
            ], 64)),
            z(": " + v(p.change) + " · " + v(p.author_name) + " · ", 1),
            h("time", {
              datetime: p.created_at
            }, v(p.created_at.slice(0, 16).replace("T", " ")), 9, zb)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (r(), d("p", Ub, v(o.value), 1)) : k("", !0),
        s.value ? (r(), d(B, { key: 1 }, [
          A(ie, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: c
          }, {
            default: N(() => [...m[2] || (m[2] = [
              z("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          h("div", Vb, [
            (r(!0), d(B, null, Z(i.value, (p) => (r(), d("div", {
              key: p.key,
              class: X(["revision-line", p.type])
            }, v(p.text || " "), 3))), 128))
          ])
        ], 64)) : k("", !0)
      ], 64)) : (r(), d("p", Gb, "No revisions"))
    ]));
  }
}, Yb = /* @__PURE__ */ V(Kb, [["__scopeId", "data-v-d99a0253"]]), Qb = {
  class: "settle-failure",
  role: "alert",
  "data-settle-failure": ""
}, Xb = {
  __name: "DocumentSettleDialog",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(""), o = E("");
    async function l() {
      const i = await n.read([n.term, n.term === "doc" ? "settle" : "close", String(n.id), "--why", s.value.trim()]);
      o.value = i.ok ? "" : i.error, i.ok && a("saved");
    }
    return (i, u) => (r(), j(an, {
      padded: "",
      title: `Settle this ${e.term === "doc" ? "document" : "report"}`,
      onClose: u[2] || (u[2] = (c) => a("close"))
    }, {
      foot: N(() => [
        h("span", Qb, v(o.value), 1),
        A(ie, {
          onClick: u[1] || (u[1] = (c) => a("close"))
        }, {
          default: N(() => [...u[4] || (u[4] = [
            z("Cancel", -1)
          ])]),
          _: 1
        }),
        A(ie, {
          variant: "primary",
          disabled: !s.value.trim(),
          "data-settle-save": "",
          onClick: l
        }, {
          default: N(() => [...u[5] || (u[5] = [
            z("Settle", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: N(() => [
        h("form", {
          class: "settle-form",
          "data-settle-form": "",
          onSubmit: he(l, ["prevent"])
        }, [
          h("label", null, [
            u[3] || (u[3] = h("span", null, "Why does it need no action?", -1)),
            ge(h("textarea", {
              "onUpdate:modelValue": u[0] || (u[0] = (c) => s.value = c),
              rows: "3",
              "data-settle-why": ""
            }, null, 512), [
              [Fe, s.value]
            ])
          ])
        ], 32)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Jb = /* @__PURE__ */ V(Xb, [["__scopeId", "data-v-10475409"]]), Zb = "button, [data-comment-number]", ek = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function Ar(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(Zb) || n.push(t.currentNode);
  return n;
}
function bl(e, t, n) {
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
const tk = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function nk(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = Ar(e), s = a.map((c) => c.data).join(""), o = bl(a, n.startContainer, n.startOffset), l = s.slice(o, bl(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const u = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: tk(u.nodeType === Node.TEXT_NODE ? u.parentElement : u) };
}
function ak(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function sk(e, t, n) {
  const a = [];
  let s = 0;
  for (const o of e) {
    const l = Math.max(t - s, 0), i = Math.min(n - s, o.data.length);
    l < i && a.push({ node: o, from: l, to: i }), s += o.data.length;
  }
  return a;
}
function ns(e, t, n = "Comment") {
  const a = document.createElement("button");
  return a.type = "button", a.className = "comment-number", a.dataset.commentNumber = t, a.setAttribute("aria-label", `${n} ${e}`), a.textContent = e, a;
}
function ok({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function lk(e, t) {
  const n = Ar(e), a = ak(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = sk(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(ok).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(ns(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(ns(t.number, t.id, t.label)) : l.at(-1).append(ns(t.number, t.id, t.label))), !0;
}
function ik(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !lk(e, a) && a.id && n.push(a.id);
  return n;
}
const rk = (e) => e.closest(ek) ?? e;
function kl(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const uk = {
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
    const a = e, s = n, o = E(null), l = E(null), i = E(null), u = E(!1), c = E(null);
    function f() {
      if (!l.value || u.value) return;
      l.value.innerHTML = a.html;
      const y = a.comments.filter((q) => q.quote).map((q) => ({ ...q, label: a.annotationLabel, hot: q.id === a.hot })), w = ik(l.value, a.pending ? [...y, { ...a.pending, pending: !0 }] : y);
      s("lost", w);
      const x = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!x) {
        c.value = null;
        return;
      }
      const C = document.createElement("div");
      C.className = "inline-comment", rk(x).after(C), c.value = C;
    }
    function m() {
      if (!l.value) return;
      const y = nk(l.value);
      if (u.value = !!y, !y) {
        i.value = null;
        return;
      }
      const w = window.getSelection().getRangeAt(0).getBoundingClientRect(), x = o.value.getBoundingClientRect();
      i.value = { left: `${Math.max(w.left - x.left, 0)}px`, top: `${w.top - x.top + o.value.scrollTop}px` }, s("select", y);
    }
    function p(y) {
      const w = y.target.closest("[data-comment-number]");
      w ? s("number", Number(w.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function b(y) {
      var w;
      (w = l.value.querySelector(`[data-comment="${y}"]`)) == null || w.scrollIntoView({ block: "center" });
    }
    function $(y) {
      var w;
      (w = l.value.querySelectorAll("h3, h4, h5, h6")[y]) == null || w.scrollIntoView({ block: "start" });
    }
    return ce(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, u.value, a.pending], f, { flush: "post" }), _e(() => {
      f(), document.addEventListener("selectionchange", m);
    }), tt(() => document.removeEventListener("selectionchange", m)), t({ show: b, showHeading: $, nextTick: Re }), (y, w) => (r(), d("div", {
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
        style: pe(i.value),
        "data-comment-pill": "",
        onMousedown: w[0] || (w[0] = he(() => {
        }, ["prevent"])),
        onClick: w[1] || (w[1] = (x) => s("write"))
      }, [
        A(se, {
          name: "chat",
          size: 13
        }),
        w[2] || (w[2] = z("Comment on this", -1))
      ], 36)) : k("", !0),
      c.value ? (r(), j(In, {
        key: 1,
        to: c.value
      }, [
        ne(y.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : k("", !0),
      ne(y.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, ck = /* @__PURE__ */ V(uk, [["__scopeId", "data-v-a92386e6"]]), dk = { class: "document-tabs" }, fk = ["aria-pressed"], mk = { class: "document-body" }, hk = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, pk = {
  key: 1,
  class: "document-loading"
}, vk = {
  key: 3,
  class: "document-pane",
  "data-document-links": ""
}, gk = {
  key: 4,
  class: "document-details",
  "data-resource-fields": ""
}, yk = 760, bk = {
  __name: "DocumentBody",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, textOnly: Boolean },
  setup(e) {
    const t = e, n = $e(Si, E(null)), a = E(null), s = Ay(a), o = M(() => s.value !== null && s.value < yk), l = E(null), i = E(""), u = E([]), c = E([]), f = E(""), m = E("comments"), p = E("text"), b = E(0), $ = E(!1), y = E(0), w = E([]), x = E(null), C = E(""), q = E(!1), P = E(!1), I = E(""), Q = E(null), W = E(null);
    let R = 0;
    const D = Er(() => l.value ? { term: t.term, id: t.id, title: l.value.title } : {}, (K) => t.read(K)), G = M(() => kl(D.comments.value)), _ = M(() => m.value === "questions" ? kl(c.value) : G.value), g = M(() => m.value === "questions" ? _.value.length : D.total.value), S = M(() => {
      var K;
      return (K = l.value) != null && K.body ? ko(l.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), T = M(() => {
      var K;
      return (((K = l.value) == null ? void 0 : K.body) ?? "").split(`
`).filter((F) => /^#{1,4} /.test(F)).map((F, Y) => ({ key: String(Y), value: Y, label: F.replace(/^#+ /, "") }));
    }), L = M(() => G.value.find((K) => K.id === y.value)), U = M(() => {
      var K;
      return !!((K = l.value) != null && K.close_reason);
    }), J = M(() => U.value ? "Closed" : "Open"), ee = new URLSearchParams(location.search).get("environment") ?? "", oe = M(() => [
      { label: "Edit", group: "own", run: () => q.value = !0 },
      ...U.value ? [] : [{ label: "Settle", group: "own", run: () => P.value = !0 }],
      { label: "Documents", group: "open", run: () => window.open(`?page=documents.page&environment=${encodeURIComponent(ee)}`, "_blank", "noopener") },
      { label: "Copy command", group: "copy", run: ({ say: K }) => jt(`journal ${t.term} show ${t.id}`, "the command", K) }
    ]), le = M(() => p.value === "comments" && !o.value ? "text" : p.value), ke = (K) => K.ok ? K.value.rows ?? [] : [];
    async function xe() {
      const K = ++R, F = await t.read([t.term, "inspect", String(t.id)]);
      if (K !== R) return;
      i.value = F.ok ? "" : F.error, l.value = F.ok ? F.value : null;
      const Y = F.ok && !t.textOnly ? await kr(t.read, l.value) : { creator: "" }, te = await t.read(["question", "list", "--all", "--row", `${t.term}:${t.id}`]), ae = t.term === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      K === R && (I.value = Y.creator, c.value = ke(te), f.value = te.ok ? "" : te.error, u.value = ae ? ke(ae) : []);
    }
    async function He(K) {
      const F = x.value ? ["--quote", x.value.quote, "--position", String(x.value.position), "--selection-type", x.value.selection_type] : [], Y = await t.read([t.term, "comment", String(t.id), ...F, "--", K]);
      if (!Y.ok) throw new Error(Y.error);
      x.value = null, await Promise.all([xe(), D.load()]);
    }
    async function Qe() {
      const K = await t.read(["doc", "close", String(t.id)]);
      i.value = K.ok ? "" : K.error, K.ok && await xe();
    }
    function un() {
      C.value.trim() || (x.value = null);
    }
    async function ve(K) {
      var F;
      if (b.value = K, o.value && m.value === "questions") {
        p.value = "comments";
        return;
      }
      if (o.value) {
        y.value = y.value === K ? 0 : K;
        return;
      }
      $.value = !0, await Re(), (F = a.value.querySelector(m.value === "questions" ? `[data-question-id="${K}"]` : `[data-comment-id="${K}"]`)) == null || F.scrollIntoView({ block: "nearest" });
    }
    async function ye(K) {
      var F, Y;
      p.value = "text", b.value = K, await ((F = Q.value) == null ? void 0 : F.nextTick()), (Y = Q.value) == null || Y.show(K);
    }
    function H() {
      q.value = !1, P.value = !1, xe();
    }
    return ce(() => `${t.term}:${t.id}`, () => {
      l.value = null, p.value = "text", $.value = !1, b.value = 0, y.value = 0, x.value = null, c.value = [], f.value = "", xe();
    }, { immediate: !0 }), ce(m, () => {
      b.value = 0, y.value = 0;
    }), (K, F) => (r(), d("div", {
      ref_key: "panel",
      ref: a,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      l.value ? (r(), j(In, {
        key: 0,
        to: O(n),
        disabled: !O(n)
      }, [
        h("span", {
          class: X(["document-actions", { placed: O(n) }]),
          "data-document-actions": ""
        }, [
          e.textOnly ? k("", !0) : (r(), j(Ey, {
            key: 0,
            items: oe.value,
            head: l.value.title
          }, null, 8, ["items", "head"])),
          le.value === "text" && T.value.length > 1 ? (r(), j(ro, {
            key: 1,
            label: o.value ? "" : "Chapters",
            icon: "list",
            items: T.value,
            "data-text-chapters": "",
            onPick: F[0] || (F[0] = (Y) => {
              var te;
              return (te = Q.value) == null ? void 0 : te.showHeading(Y.value);
            })
          }, null, 8, ["label", "items"])) : k("", !0)
        ], 2)
      ], 8, ["to", "disabled"])) : k("", !0),
      h("nav", dk, [
        h("button", {
          type: "button",
          class: X(["document-tab-button", { on: le.value === "text" }]),
          "data-document-tab": "text",
          onClick: F[1] || (F[1] = (Y) => p.value = "text")
        }, "Text", 2),
        o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: X(["document-tab-button", { on: le.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: F[2] || (F[2] = (Y) => p.value = "comments")
        }, [
          z(v(m.value === "questions" ? "Questions" : "Comments") + " ", 1),
          h("em", null, v(g.value || ""), 1)
        ], 2)) : (r(), d("button", {
          key: 1,
          type: "button",
          class: X(["document-tab-button", { on: $.value }]),
          "aria-pressed": $.value,
          "data-document-notes-toggle": "",
          onClick: F[3] || (F[3] = (Y) => $.value = !$.value)
        }, [
          z(v(m.value === "questions" ? "Questions" : "Comments") + " ", 1),
          h("em", null, v(g.value || ""), 1)
        ], 10, fk)),
        e.term === "doc" ? (r(), d("button", {
          key: 2,
          type: "button",
          class: X(["document-tab-button", { on: le.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: F[4] || (F[4] = (Y) => p.value = "revisions")
        }, [
          F[18] || (F[18] = z("Revisions ", -1)),
          h("em", null, v(u.value.length || ""), 1)
        ], 2)) : k("", !0),
        e.textOnly ? k("", !0) : (r(), d(B, { key: 3 }, [
          h("button", {
            type: "button",
            class: X(["document-tab-button", { on: le.value === "links" }]),
            "data-document-tab": "links",
            onClick: F[5] || (F[5] = (Y) => p.value = "links")
          }, "Links", 2),
          h("button", {
            type: "button",
            class: X(["document-tab-button", { on: le.value === "details" }]),
            "data-document-tab": "details",
            onClick: F[6] || (F[6] = (Y) => p.value = "details")
          }, "Details", 2)
        ], 64))
      ]),
      h("div", mk, [
        i.value ? (r(), d("p", hk, v(i.value), 1)) : l.value ? le.value === "revisions" ? (r(), j(Yb, {
          key: 2,
          id: e.id,
          revisions: u.value,
          text: l.value.body,
          read: e.read,
          editing: l.value.open_author_id !== null && l.value.open_author_id !== void 0,
          onCloseRevision: Qe,
          onRestored: xe
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : le.value === "links" ? (r(), d("div", vk, [
          A(Mo, {
            model: e.term,
            id: e.id,
            read: e.read,
            open: "",
            onOpen: F[7] || (F[7] = (Y) => O(Ze)(Y.table, Y.id))
          }, null, 8, ["model", "id", "read"])
        ])) : le.value === "details" ? (r(), d("dl", gk, [
          I.value ? (r(), d(B, { key: 0 }, [
            F[19] || (F[19] = h("dt", null, "By", -1)),
            h("dd", null, v(I.value), 1)
          ], 64)) : k("", !0),
          F[21] || (F[21] = h("dt", null, "State", -1)),
          h("dd", null, v(J.value), 1),
          l.value.close_reason ? (r(), d(B, { key: 1 }, [
            F[20] || (F[20] = h("dt", null, "Why settled", -1)),
            h("dd", null, v(l.value.close_reason), 1)
          ], 64)) : k("", !0),
          F[22] || (F[22] = h("dt", null, "Created", -1)),
          h("dd", null, [
            A(Ye, {
              at: l.value.created_at
            }, null, 8, ["at"])
          ]),
          F[23] || (F[23] = h("dt", null, "Updated", -1)),
          h("dd", null, [
            A(Ye, {
              at: l.value.updated_at
            }, null, 8, ["at"])
          ])
        ])) : le.value === "comments" ? (r(), j(yl, {
          key: 5,
          mode: m.value,
          "onUpdate:mode": F[8] || (F[8] = (Y) => m.value = Y),
          tab: "",
          comments: G.value,
          questions: c.value,
          hot: b.value,
          lost: w.value,
          failure: f.value,
          read: e.read,
          "comment-more": !!O(D).nextPage.value,
          "comment-loading": O(D).loading.value,
          "comment-failure": O(D).failure.value,
          "comment-total": O(D).total.value,
          onMore: O(D).loadMore,
          onShow: ye,
          onChanged: xe
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (r(), d(B, { key: 6 }, [
          A(ck, {
            ref_key: "words",
            ref: Q,
            html: S.value,
            comments: _.value,
            "annotation-label": m.value === "questions" ? "Question" : "Comment",
            hot: b.value,
            pending: x.value,
            inline: y.value,
            onSelect: F[10] || (F[10] = (Y) => x.value = Y),
            onClear: un,
            onNumber: ve,
            onWrite: F[11] || (F[11] = (Y) => {
              var te;
              return (te = W.value) == null ? void 0 : te.focus();
            }),
            onLost: F[12] || (F[12] = (Y) => w.value = Y)
          }, {
            inline: N(() => [
              L.value ? (r(), j(wr, {
                key: 0,
                comment: L.value,
                hot: "",
                onShow: F[9] || (F[9] = (Y) => ye(L.value.id))
              }, null, 8, ["comment"])) : k("", !0)
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          !o.value && $.value ? (r(), j(yl, {
            key: 0,
            mode: m.value,
            "onUpdate:mode": F[13] || (F[13] = (Y) => m.value = Y),
            comments: G.value,
            questions: c.value,
            hot: b.value,
            lost: w.value,
            failure: f.value,
            read: e.read,
            "comment-more": !!O(D).nextPage.value,
            "comment-loading": O(D).loading.value,
            "comment-failure": O(D).failure.value,
            "comment-total": O(D).total.value,
            onMore: O(D).loadMore,
            onShow: ye,
            onChanged: xe
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : k("", !0)
        ], 64)) : (r(), d("div", pk, [
          A(nt)
        ]))
      ]),
      l.value ? (r(), j(i0, {
        key: 1,
        ref_key: "composer",
        ref: W,
        draft: C.value,
        "onUpdate:draft": F[14] || (F[14] = (Y) => C.value = Y),
        selection: x.value,
        send: He,
        narrow: o.value,
        onClear: F[15] || (F[15] = (Y) => x.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : k("", !0),
      P.value ? (r(), j(Jb, {
        key: 2,
        term: e.term,
        id: e.id,
        read: e.read,
        onClose: F[16] || (F[16] = (Y) => P.value = !1),
        onSaved: H
      }, null, 8, ["term", "id", "read"])) : k("", !0),
      q.value ? (r(), j(Fb, {
        key: 3,
        term: e.term,
        id: e.id,
        row: l.value,
        read: e.read,
        onClose: F[17] || (F[17] = (Y) => q.value = !1),
        onSaved: H
      }, null, 8, ["term", "id", "row", "read"])) : k("", !0)
    ], 512));
  }
}, MA = /* @__PURE__ */ V(bk, [["__scopeId", "data-v-9dd1cac8"]]), kk = {
  key: 1,
  class: "row-list-failure"
}, wk = ["data-row"], $k = {
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
    const t = e, n = M(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : t.moves ? { tag: "ul", name: "row-list", css: !t.leavesAtOnce, "data-row-list-moves": "" } : {}), a = E(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (r(), j(nt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (r(), d("p", kk, v(e.failure), 1)) : !e.rows.length && e.loaded ? (r(), j(St, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: N(() => [
        z(v(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (r(), d(B, { key: 3 }, [
      (r(), j(Je(e.arrival || e.moves ? no : "ul"), Ne(n.value, { class: "row-list" }), {
        default: N(() => [
          (r(!0), d(B, null, Z(e.rows, (i) => (r(), d("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            ne(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, wk))), 128))
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
}, xk = /* @__PURE__ */ V($k, [["__scopeId", "data-v-e9f251f3"]]), Sk = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Mk = {
  key: 1,
  class: "agent-rows-note"
}, _k = {
  key: 2,
  class: "agent-rows-note"
}, Ck = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Ek = ["data-agent-row", "onClick"], Ak = { class: "agent-row-name" }, Ok = { class: "agent-row-state" }, Tk = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = M(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = M(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (r(), d("div", Sk, [
      e.loaded ? e.failure ? (r(), d("p", Mk, v(e.failure), 1)) : e.rows.length ? (r(), d(B, { key: 3 }, [
        h("p", Ck, v(a.value) + " running", 1),
        (r(!0), d(B, null, Z(n.value, (l) => (r(), d("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => O(Pe)(`agents:${l.id}`)
        }, [
          h("span", Ak, "#" + v(l.id) + " " + v(l.session), 1),
          h("span", Ok, v(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, Ek))), 128))
      ], 64)) : (r(), d("p", _k, v(e.none), 1)) : (r(), j(nt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, _A = /* @__PURE__ */ V(Tk, [["__scopeId", "data-v-a01e5a17"]]), gt = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ke = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Ge = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Ik = 6;
function Eo(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Bk = (e) => {
  const t = Eo(e, gt.lineChars), n = Math.max(gt.minWidth, Math.max(...t.map((a) => a.length)) * gt.charWidth + gt.padX * 2);
  return { name: e, lines: t, line: gt.line, padY: gt.padY, width: n, height: t.length * gt.line + gt.padY * 2 };
};
function Rk(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, u) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(u) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function Lk(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function Nk(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var i;
    return (a[i = n.get(l)] || (a[i] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((i, u) => [i, u]))), o = (l, i) => {
    const u = s(), c = (f) => {
      const m = i(f).map((p) => u.get(p));
      return m.length ? m.reduce((p, b) => p + b, 0) / m.length : u.get(f);
    };
    return [...l].sort((f, m) => c(f) - c(m));
  };
  for (let l = 0; l < Ik; l++) {
    const i = l % 2 === 0, u = a.map((c, f) => f);
    (i ? u.slice(1) : u.slice(0, -1).reverse()).forEach((c) => {
      const f = (m) => t.filter((p) => p[i ? 1 : 0] === m).map((p) => p[i ? 0 : 1]);
      a[c] = o(a[c], f);
    });
  }
  return a;
}
function qk(e, t) {
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
function Dk(e) {
  const t = [...new Set(e.flatMap(([P, I]) => [P, I]))], n = new Set(e.map(([, P]) => P)), a = t.filter((P) => !n.has(P)), s = Rk(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((P, I) => !s.has(I)), l = Lk(t, o), i = Nk(t, o, l), u = new Map(t.map((P) => [P, Bk(P)])), c = i.map((P) => P.reduce((I, Q) => I + u.get(Q).width, 0) + Ge.across * (P.length - 1)), f = Math.max(...c) + Ge.margin * 2, m = jk(e, l, i.length), p = /* @__PURE__ */ new Map();
  let b = Ge.margin;
  i.forEach((P, I) => {
    let Q = (f - c[I]) / 2;
    const W = Math.max(...P.map((R) => u.get(R).height));
    P.forEach((R) => {
      const D = u.get(R);
      p.set(R, { ...D, x: Q, y: b + (W - D.height) / 2 }), Q += D.width + Ge.across;
    }), b += W + (m[I] ?? Ge.down);
  });
  const $ = e.map(([P, I, Q], W) => ({ from: P, to: I, label: Q || "", back: s.has(W) || l.get(I) <= l.get(P) }));
  qk($, p);
  const y = $.map((P) => Fk(P, p.get(P.from), p.get(P.to))), w = [...p.values()], x = Uk(y, w), C = Math.max(b - Ge.down, ...x.filter((P) => P.label).map((P) => P.label.y + P.label.height));
  return { width: Math.max(f - Ge.margin, ...x.filter((P) => P.label).map((P) => P.label.x + P.label.width)) + Ge.margin, height: C + Ge.margin, nodes: w, arrows: x };
}
const Pk = (e) => e ? Eo(e, Ke.lineChars).length * Ke.line + Ke.pad * 2 : 0;
function jk(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Ge.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, u] = [t.get(s), t.get(o)].sort((c, f) => c - f);
    u > i && (a[i + Math.floor((u - i - 1) / 2)] += Pk(l) + Ge.labelSpace);
  }), a.map((s) => Math.max(Ge.down, s));
}
function Fk(e, t, n) {
  const a = e.label ? Eo(e.label, Ke.lineChars) : [], s = a.length ? Math.max(...a.map((p) => p.length)) * Ke.charWidth + Ke.pad * 2 : 0, o = a.length * Ke.line + (a.length ? Ke.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, u = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, f = (c - i) / 2, m = [{ x: l, y: i }, { x: l, y: i + f }, { x: u, y: c - f }, { x: u, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: m, path: `M${l} ${i} C${l} ${i + f} ${u} ${c - f} ${u} ${c}` };
}
const Wk = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, Hk = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], zk = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ke.line);
function Uk(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (u, c) => {
      const f = Wk(a.curve, u);
      return { x: f.x - a.labelWidth / 2, y: f.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = zk.flatMap((u) => Hk.map((c) => s(c, u))).find((u) => !n.some((c) => wl(u, c))) ?? s(0.5, 0);
    for (; n.some((u) => wl(i, u)); ) i.y += Ke.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: Ke.line, pad: Ke.pad } };
  });
}
const wl = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Vk = { class: "flowchart-tools" }, Gk = ["width", "height", "viewBox", "aria-label"], Kk = ["d"], Yk = ["x", "y", "width", "height"], Qk = ["x", "y"], Xk = ["x", "dy"], Jk = {
  key: 0,
  class: "flowchart-label"
}, Zk = ["x", "y", "width", "height"], ew = ["x", "y"], tw = ["x", "dy"], nw = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => Dk(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = E(null), i = E({ zoom: 1, x: 0, y: 0 });
    let u = null;
    function c() {
      var x;
      const y = (x = l.value) == null ? void 0 : x.getBoundingClientRect();
      if (!(y != null && y.width)) return;
      const w = Math.min(y.width / s.value.width, y.height / s.value.height, 1.5);
      i.value = { zoom: w, x: (y.width - s.value.width * w) / 2, y: (y.height - s.value.height * w) / 2 };
    }
    function f(y, w, x) {
      const { zoom: C, x: q, y: P } = i.value, I = Math.min(o.most, Math.max(o.least, C * y));
      i.value = { zoom: I, x: w - (w - q) * I / C, y: x - (x - P) * I / C };
    }
    function m(y) {
      const w = l.value.getBoundingClientRect();
      f(y, w.width / 2, w.height / 2);
    }
    function p(y) {
      const w = l.value.getBoundingClientRect();
      y.ctrlKey || y.metaKey ? f(y.deltaY < 0 ? o.step : 1 / o.step, y.clientX - w.left, y.clientY - w.top) : i.value = { ...i.value, x: i.value.x - y.deltaX, y: i.value.y - y.deltaY };
    }
    function b(y) {
      var w, x, C;
      y.preventDefault(), (w = window.getSelection()) == null || w.removeAllRanges(), u = { x: y.clientX - i.value.x, y: y.clientY - i.value.y }, (C = (x = l.value).setPointerCapture) == null || C.call(x, y.pointerId);
    }
    function $(y) {
      u && (i.value = { ...i.value, x: y.clientX - u.x, y: y.clientY - u.y });
    }
    return _e(c), (y, w) => (r(), j(an, {
      padded: "",
      title: e.title,
      large: "",
      onClose: w[4] || (w[4] = (x) => a("close"))
    }, {
      default: N(() => [
        h("div", Vk, [
          A(ie, {
            small: "",
            onClick: w[0] || (w[0] = (x) => m(o.step))
          }, {
            default: N(() => [...w[5] || (w[5] = [
              z("Zoom in", -1)
            ])]),
            _: 1
          }),
          A(ie, {
            small: "",
            onClick: w[1] || (w[1] = (x) => m(1 / o.step))
          }, {
            default: N(() => [...w[6] || (w[6] = [
              z("Zoom out", -1)
            ])]),
            _: 1
          }),
          A(ie, {
            small: "",
            onClick: c
          }, {
            default: N(() => [...w[7] || (w[7] = [
              z("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        h("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: he(p, ["prevent"]),
          onPointerdown: b,
          onPointermove: $,
          onPointerup: w[2] || (w[2] = (x) => Vo(u) ? u.value = null : u = null),
          onPointercancel: w[3] || (w[3] = (x) => Vo(u) ? u.value = null : u = null)
        }, [
          (r(), d("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: pe({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
          }, [
            w[8] || (w[8] = h("defs", null, [
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
            (r(!0), d(B, null, Z(s.value.arrows, (x, C) => (r(), d("path", {
              key: `arrow-${C}`,
              class: "flowchart-arrow",
              d: x.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Kk))), 128)),
            (r(!0), d(B, null, Z(s.value.nodes, (x) => (r(), d("g", {
              key: x.name,
              class: "flowchart-node"
            }, [
              h("rect", {
                x: x.x,
                y: x.y,
                width: x.width,
                height: x.height,
                rx: "8"
              }, null, 8, Yk),
              h("text", {
                x: x.x + x.width / 2,
                y: x.y + x.padY + x.line / 2
              }, [
                (r(!0), d(B, null, Z(x.lines, (C, q) => (r(), d("tspan", {
                  key: q,
                  x: x.x + x.width / 2,
                  dy: q ? x.line : 0
                }, v(C), 9, Xk))), 128))
              ], 8, Qk)
            ]))), 128)),
            (r(!0), d(B, null, Z(s.value.arrows, (x, C) => (r(), d(B, {
              key: `label-${C}`
            }, [
              x.label ? (r(), d("g", Jk, [
                h("rect", {
                  x: x.label.x,
                  y: x.label.y,
                  width: x.label.width,
                  height: x.label.height,
                  rx: "4"
                }, null, 8, Zk),
                h("text", {
                  x: x.label.x + x.label.width / 2,
                  y: x.label.y + x.label.pad + x.label.line / 2
                }, [
                  (r(!0), d(B, null, Z(x.label.lines, (q, P) => (r(), d("tspan", {
                    key: P,
                    x: x.label.x + x.label.width / 2,
                    dy: P ? x.label.line : 0
                  }, v(q), 9, tw))), 128))
                ], 8, ew)
              ])) : k("", !0)
            ], 64))), 128))
          ], 12, Gk))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, aw = /* @__PURE__ */ V(nw, [["__scopeId", "data-v-e98799dc"]]), sw = ["data-tip", "aria-label"], ow = {
  key: 0,
  class: "mact-word"
}, lw = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: X(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      A(Ct, { name: "open" }),
      e.open ? (r(), d("span", ow, v(e.label), 1)) : k("", !0),
      n[0] || (n[0] = h("span", { class: "hit" }, null, -1))
    ], 10, sw));
  }
}, Or = /* @__PURE__ */ V(lw, [["__scopeId", "data-v-3b292e09"]]), Tr = 120, la = 280, Ir = 160, iw = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, rw = ["leaving", "resizing", "entering"];
function Fs(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function uw(e) {
  const t = rw.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = Fs(e);
  return e.classList.add(...t), n;
}
function Br(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = E(t()), s = E("");
  let o = 0;
  const l = (m, p) => Object.assign(m.style, { width: `${p.width}px`, height: `${p.height}px` }), i = (m) => Object.assign(m.style, { width: "", height: "", transition: "" });
  function u(m, p) {
    i(m);
    const b = uw(m);
    l(m, p), m.offsetWidth, m.style.transition = `width ${la}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${la}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(m, b);
  }
  function c(m) {
    const p = m.querySelector(":scope > :not(.top)");
    if (!p || typeof ResizeObserver > "u") return null;
    let b = p.offsetHeight;
    const $ = new ResizeObserver(() => {
      p.offsetHeight !== b && (b = p.offsetHeight, u(m, Fs(m)));
    });
    return $.observe(p), $;
  }
  async function f(m) {
    const p = e.value, b = ++o;
    if (!p || !p.offsetWidth || iw()) {
      a.value = m;
      return;
    }
    const $ = Fs(p);
    if (l(p, $), s.value = "leaving", await n(Tr), b !== o) return;
    a.value = m, s.value = "resizing", await Re(), u(p, $);
    const y = c(p);
    await n(la), y == null || y.disconnect(), b === o && (i(p), s.value = "entering", await n(Ir), b === o && (s.value = ""));
  }
  return ce(t, (m) => f(m)), tt(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const cw = { class: "growing-card-top" }, dw = ["aria-expanded"], fw = { class: "growing-card-avatar" }, mw = { class: "growing-card-title" }, hw = { class: "growing-card-more" }, pw = { class: "growing-card-body" }, vw = {
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
    const n = e, a = t, s = E(!1), o = E(null), { folded: l, phase: i } = Br(o, () => !s.value), u = M(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = M(() => n.text.split(/\n\s*\n/).filter((f) => f.trim()));
    return (f, m) => (r(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: X(["growing-card-wrap", O(i), { open: !O(l), bad: e.bad, incoming: e.incoming }])
    }, [
      h("div", cw, [
        h("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: m[0] || (m[0] = (p) => s.value = !s.value)
        }, [
          h("span", fw, [
            e.bad ? (r(), j(Ct, {
              key: 0,
              name: "cross"
            })) : u.value ? (r(), d(B, { key: 1 }, [
              z(v(u.value), 1)
            ], 64)) : (r(), j(se, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          h("span", mw, v(e.title), 1),
          A(ln, { open: s.value }, null, 8, ["open"])
        ], 8, dw),
        e.action ? (r(), j(Or, {
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
          A(se, {
            name: "bubble",
            size: 13
          })
        ])) : k("", !0)
      ]),
      h("div", hw, [
        h("div", pw, [
          (r(!0), d(B, null, Z(c.value, (p, b) => (r(), d("p", {
            key: b,
            class: "growing-card-text"
          }, v(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, gw = /* @__PURE__ */ V(vw, [["__scopeId", "data-v-f2b4930d"]]), yw = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, bw = { class: "md inline" }, kw = ["disabled", "title", "onClick"], ww = {
  key: 1,
  class: "message-links-many"
}, $w = ["aria-expanded"], xw = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, Sw = ["disabled", "onClick"], Mw = { class: "row-pill message-links-chip" }, _w = { class: "message-links-title" }, Cw = { key: 0 }, as = 3, Ew = "task", Aw = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => n.total || n.links.length), o = M(() => n.links.every((p) => p.endpoint.model === Ew) ? "tasks" : "items"), l = E(!1), i = E(null);
    _i(i, () => l.value = !1);
    const u = () => l.value = !l.value, c = (p) => p.endpoint.unavailable || !p.endpoint.open_ref, f = (p) => p.relations.includes("edited") ? p.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function m(p) {
      c(p) || (l.value = !1, Pe(p.endpoint.open_ref));
    }
    return (p, b) => (r(), d("div", {
      ref_key: "line",
      ref: i,
      class: X(["message-links", { many: s.value > as, three: s.value === as, open: l.value }]),
      "data-message-links": ""
    }, [
      A(Ct, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (r(), d("span", yw, [
        h("span", bw, [
          b[1] || (b[1] = z("Linked: ", -1)),
          (r(!0), d(B, null, Z(e.links, ($) => (r(), d("button", {
            key: `${$.endpoint.model}:${$.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c($),
            title: $.endpoint.title,
            onClick: (y) => m($)
          }, [
            z(v($.endpoint.model.replaceAll("_", " ")) + " " + v($.endpoint.id), 1),
            f($) ? (r(), d(B, { key: 0 }, [
              z(" (" + v(f($)) + ")", 1)
            ], 64)) : k("", !0),
            c($) ? (r(), d(B, { key: 1 }, [
              z(" (unavailable)")
            ], 64)) : k("", !0)
          ], 8, kw))), 128))
        ])
      ])) : k("", !0),
      s.value >= as ? (r(), d("span", ww, [
        h("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: u
        }, [
          z(v(s.value) + " linked " + v(o.value) + " ", 1),
          A(ln, { open: l.value }, null, 8, ["open"])
        ], 8, $w)
      ])) : k("", !0),
      l.value ? (r(), d("div", xw, [
        (r(!0), d(B, null, Z(e.links, ($) => (r(), d("button", {
          key: `${$.endpoint.model}:${$.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c($),
          onClick: (y) => m($)
        }, [
          h("span", Mw, v($.endpoint.model.replaceAll("_", " ")) + " " + v($.endpoint.id), 1),
          h("span", _w, v($.endpoint.title), 1),
          h("span", null, v(f($)), 1),
          c($) ? (r(), d("span", Cw, "Unavailable")) : k("", !0)
        ], 8, Sw))), 128))
      ])) : k("", !0),
      A(Bn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: b[0] || (b[0] = ($) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, Ow = /* @__PURE__ */ V(Aw, [["__scopeId", "data-v-843fc3bd"]]), Tw = ["title", "aria-label"], Iw = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Bw = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Rw = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = M(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (r(), d("span", {
      class: X(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (r(), d("svg", Iw, [
        o[0] || (o[0] = h("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (r(), d("path", Bw)) : k("", !0)
      ]))
    ], 10, Tw));
  }
}, Lw = /* @__PURE__ */ V(Rw, [["__scopeId", "data-v-6dc92808"]]), Nw = {
  report: { at: 70, keep: 46 },
  message: { at: 420, keep: 320 }
}, qw = (e) => e.worker_id != null ? "report" : "message", Dw = (e) => Nw[qw(e)], Pw = "img,pre,table";
function jw(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Fw(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function Ww(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Pw)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = jw(Fw(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function Hw(e, t) {
  let n = null;
  const a = () => e.value && Ww(e.value);
  _e(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Te(() => n == null ? void 0 : n.disconnect()), ce(t, a, { flush: "post" });
}
const $l = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function zw(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Xn = /* @__PURE__ */ new WeakMap(), qe = "work", ot = "sent", Uw = 50, xl = 50, Sl = () => ({ rows: E([]), total: E(0), next: E(null), loading: E(!1), failure: E(""), version: 0 });
function Vw(e) {
  var y;
  if (Xn.has(e)) return Xn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (w) => {
    var x;
    return ((x = e.visible) == null ? void 0 : x.value) !== !1 && [...w.views].some((C) => C.visible);
  };
  function o(w, x) {
    const C = w[x], q = ++C.version;
    return C.loading.value = !0, C.failure.value = "", q;
  }
  function l(w, x, C, q, P) {
    const I = w[x];
    if (t.get(w.id) !== w || I.version !== C) return;
    if (I.loading.value = !1, !P.ok) {
      I.failure.value = P.error;
      return;
    }
    const Q = x === qe ? P.value.counterparts ?? [] : P.value.rows ?? [], W = q === 1 ? Q : [...I.rows.value, ...Q], R = x === qe ? (D) => `${D.endpoint.model}:${D.endpoint.id}` : (D) => D.id ?? D.target_id;
    I.rows.value = [...new Map(W.map((D) => [R(D), D])).values()], I.total.value = P.value.total ?? I.rows.value.length, I.next.value = P.value.next_page ?? null;
  }
  function i(w, x, C, q) {
    const P = w[x];
    P.version === C && (P.failure.value = q.message, P.loading.value = !1);
  }
  async function u(w, x, C) {
    const q = o(w, x), P = x === qe ? "--type about --type edited --group-counterparts" : "--type sent_to";
    try {
      l(w, x, q, C, await e.read(`link list --source message:${w.id} ${P} --page ${C} --page-size ${x === qe ? 10 : 25}`));
    } catch (I) {
      i(w, x, q, I);
    }
  }
  async function c(w) {
    const x = w.map((C) => ({ [qe]: o(C, qe), [ot]: o(C, ot) }));
    try {
      const C = await e.read(`link receipts --messages ${w.map((q) => q.id).join(",")}`);
      w.forEach((q, P) => {
        const I = C.ok ? C.value.messages[String(q.id)] : null;
        l(q, qe, x[P][qe], 1, C.ok ? { ok: !0, value: I.named } : C), l(q, ot, x[P][ot], 1, C.ok ? { ok: !0, value: I.sent } : C);
      });
    } catch (C) {
      w.forEach((q, P) => [qe, ot].forEach((I) => i(q, I, x[P][I], C)));
    }
  }
  function f() {
    a = null;
    const w = [...n].map((x) => t.get(x)).filter((x) => x && s(x));
    n.clear(), w.forEach((x) => x.dirty.clear());
    for (let x = 0; x < w.length; x += xl) c(w.slice(x, x + xl));
  }
  function m(w, x = [qe, ot]) {
    for (const C of x) w.dirty.add(C);
    s(w) && (n.add(w.id), a ?? (a = setTimeout(f, 0)));
  }
  function p(w) {
    const x = w.sources ?? (w.source_model && Number.isInteger(w.source_id) ? [{ model: w.source_model, id: w.source_id }] : []), C = w.link_types ?? (w.link_type ? [w.link_type] : []), q = C.length ? [qe, ot].filter((I) => I === qe ? C.some((Q) => ["about", "edited"].includes(Q)) : C.includes("sent_to")) : [qe, ot];
    if (!q.length) return;
    const P = x.length ? [...new Set(x.filter((I) => I.model === "message").map((I) => I.id))].map((I) => t.get(I)).filter(Boolean) : [...t.values()].filter(s).slice(0, Uw);
    for (const I of P) m(I, q);
  }
  const b = (y = e.follow) == null ? void 0 : y.call(e, ["link.*"], p), $ = {
    attach(w, x) {
      let C = t.get(w);
      return C || (C = { id: w, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([qe, ot]), work: Sl(), sent: Sl() }, t.set(w, C)), C.views.add(x), C.dirty.size && m(C, [...C.dirty]), C;
    },
    shown(w) {
      w.dirty.size && m(w, [...w.dirty]);
    },
    detach(w, x) {
      w.views.delete(x), w.views.size || t.delete(w.id), t.size || (clearTimeout(a), b == null || b(), Xn.delete(e));
    },
    more(w, x) {
      const C = w == null ? void 0 : w[x];
      if (C != null && C.next.value && !C.loading.value) return u(w, x, C.next.value);
    }
  };
  return Xn.set(e, $), $;
}
function Gw(e, t, n) {
  const a = lt(null);
  let s = null;
  const o = ce(t, (l, i, u) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = Vw(e);
    const c = { visible: typeof IntersectionObserver > "u" }, f = s.attach(l, c);
    a.value = f;
    const m = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((b) => {
      c.visible = b.some(($) => $.isIntersecting), c.visible && s.shown(f);
    }, { rootMargin: "100px" }), p = ce(n, (b) => {
      m == null || m.disconnect(), b && (m == null || m.observe(b));
    }, { immediate: !0, flush: "post" });
    u(() => {
      p(), m == null || m.disconnect(), s.detach(f, c), a.value = null;
    });
  }, { immediate: !0 });
  return Aa(o), {
    links: M(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.rows.value) ?? [];
    }),
    total: M(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.total.value) ?? 0;
    }),
    more: M(() => {
      var l;
      return !!((l = a.value) != null && l.work.next.value);
    }),
    loading: M(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.loading.value) ?? !1;
    }),
    failure: M(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.failure.value) ?? "";
    }),
    sentTo: M(() => {
      var l;
      return (((l = a.value) == null ? void 0 : l.sent.rows.value) ?? []).map((i) => i.target);
    }),
    sentMore: M(() => {
      var l;
      return !!((l = a.value) != null && l.sent.next.value);
    }),
    sentLoading: M(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.loading.value) ?? !1;
    }),
    sentFailure: M(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.failure.value) ?? "";
    }),
    loadMore: () => s == null ? void 0 : s.more(a.value, qe),
    loadSent: () => s == null ? void 0 : s.more(a.value, ot)
  };
}
const Kw = ["data-incoming", "data-ref"], Yw = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], Qw = { class: "message-body" }, Xw = ["title"], Jw = ["innerHTML"], Zw = ["innerHTML"], e2 = {
  class: "message-faces",
  "data-message-faces": ""
}, t2 = ["title", "data-face", "onClick"], n2 = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, a2 = ["title", "data-reaction", "onClick"], s2 = {
  key: 0,
  class: "message-reaction-count"
}, o2 = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, l2 = ["href", "title"], i2 = ["src", "alt"], r2 = ["href"], u2 = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, c2 = { class: "message-foot" }, d2 = { class: "message-time" }, f2 = {
  class: "message-id",
  "data-message-id": ""
}, m2 = 1500, h2 = "An earlier message", p2 = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(!1), o = E(null), l = M(() => ["user", "comment"].includes(n.message.type)), i = M(() => {
      const [ve, ye] = (n.message.commented_row || ":").split(":"), H = dt(ve);
      return H ? { ref: `${H}:${ye}`, label: `${sn(H).title.toLowerCase()} ${ye}` } : null;
    }), u = M(() => n.message.worker_id ?? null), c = M(() => Dw(n.message)), f = M(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var ve;
      await ((ve = navigator.clipboard) == null ? void 0 : ve.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, m2);
    }
    const p = tr(), b = M(() => p(n.message.text ?? "")), $ = M(() => JSON.parse(n.message.flowchart_edges || "[]")), y = E(!1), w = M(() => Rs(n.quote)), x = M(() => p(w.value || h2));
    function C() {
      const ve = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      ve ? ve.scrollIntoView({ block: "center", behavior: "smooth" }) : Pe(`messages:${n.message.parent_id}`);
    }
    Hw(o, () => `${n.message.text} ${w.value}`);
    const q = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, P = (ve) => `/api/files/message/${n.message.id}/${encodeURIComponent(ve)}`, I = M(() => JSON.parse(n.message.captions || "{}")), Q = M(() => (n.message.files ?? []).map((ve) => ({ name: ve, address: P(ve), isImage: q.test(ve), title: I.value[ve] || ve }))), W = M(() => mr(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), R = $e(Be, null), { links: D, total: G, more: _, loading: g, failure: S, sentTo: T, sentMore: L, sentLoading: U, sentFailure: J, loadMore: ee, loadSent: oe } = Gw(R, () => l.value && !n.message.local ? n.message.id : null, o), le = E(!1), ke = M(() => zw(n.message.reactions)), xe = M(() => Number.isInteger(n.message.id)), He = () => `${location.href.split("#")[0]}#open=messages:${n.message.id}`, Qe = () => ({
      head: Mn(n.message.text ?? "", 40),
      items: [
        { label: "Reply", group: "open", disabled: !xe.value, reason: "Not sent yet", run: () => a("reply", n.message) },
        { label: "React", group: "open", disabled: !xe.value, reason: "Not sent yet", children: $l.map((ve) => ({ label: ve, run: () => a("react", n.message, ve) })) },
        { label: "Copy text", group: "copy", run: ({ say: ve }) => jt(n.message.text ?? "", "the message", ve) },
        { label: "Copy link", group: "copy", disabled: !xe.value, reason: "Not sent yet", run: ({ say: ve }) => jt(He(), "the link", ve) },
        { label: "Pin to the top of the chat", disabled: !xe.value || !R, reason: "Not sent yet", run: async ({ say: ve }) => {
          const ye = await R.run(["pin", "make", Mn(n.message.text ?? "", 60) || `Message ${n.message.id}`, "--link", `messages:${n.message.id}`]);
          ve(ye.ok ? "Pinned" : ye.error);
        } }
      ]
    });
    function un(ve) {
      le.value = !1, a("react", n.message, ve);
    }
    return (ve, ye) => e.message.peer || e.message.recipient ? ge((r(), d("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      A(gw, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: ye[0] || (ye[0] = (H) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Kw)), [
      [O(Et), Qe]
    ]) : ge((r(), d("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      h("div", Qw, [
        h("div", {
          ref_key: "bubble",
          ref: o,
          class: X(["message-card", "md", { comment: i.value }]),
          onClick: ye[5] || (ye[5] = (...H) => O(Kt) && O(Kt)(...H))
        }, [
          i.value ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: ye[1] || (ye[1] = he((H) => O(Pe)(i.value.ref), ["stop"]))
          }, [
            A(se, {
              name: "bubble",
              size: 12
            }),
            h("span", null, "Comment on " + v(i.value.label), 1)
          ], 8, Xw)) : k("", !0),
          e.message.parent_id ? (r(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: he(C, ["stop"]),
            innerHTML: x.value
          }, null, 8, Jw)) : k("", !0),
          u.value !== null ? (r(), j(xn, {
            key: 2,
            as: "button",
            "agent-id": u.value,
            label: `Worker ${u.value}`,
            class: "message-worker",
            "data-message-worker": "",
            onClick: ye[2] || (ye[2] = he((H) => O(Pe)(`agents:${u.value}`), ["stop"]))
          }, {
            default: N(() => [
              z("Worker " + v(u.value), 1)
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : k("", !0),
          A(Yi, {
            at: c.value.at,
            keep: c.value.keep,
            name: `message:${e.message.id}`
          }, {
            default: N(() => [
              h("div", {
                "data-message-text": "",
                innerHTML: b.value
              }, null, 8, Zw)
            ]),
            _: 1
          }, 8, ["at", "keep", "name"]),
          $.value.length ? (r(), d(B, { key: 3 }, [
            h("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: ye[3] || (ye[3] = (H) => y.value = !0)
            }, "Open the flowchart"),
            y.value ? (r(), j(aw, {
              key: 0,
              title: e.message.text,
              edges: $.value,
              onClose: ye[4] || (ye[4] = (H) => y.value = !1)
            }, null, 8, ["title", "edges"])) : k("", !0)
          ], 64)) : k("", !0)
        ], 2),
        h("div", {
          class: X(["message-tools", { picking: le.value }]),
          "data-message-tools": ""
        }, [
          le.value ? (r(), d(B, { key: 0 }, [
            h("div", e2, [
              (r(!0), d(B, null, Z(O($l), (H) => (r(), d("button", {
                key: H,
                type: "button",
                class: "message-face",
                title: `React ${H}`,
                "data-face": H,
                onClick: (K) => un(H)
              }, v(H), 9, t2))), 128))
            ]),
            h("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: ye[6] || (ye[6] = (H) => le.value = !1)
            }, [
              A(se, {
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
              onClick: ye[7] || (ye[7] = (H) => le.value = !0)
            }, "React"),
            h("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: ye[8] || (ye[8] = (H) => a("reply", e.message))
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
              onClick: ye[9] || (ye[9] = (H) => a("delete", e.message))
            }, "Delete")) : k("", !0)
          ], 64))
        ], 2)
      ]),
      ke.value.length ? (r(), d("div", n2, [
        (r(!0), d(B, null, Z(ke.value, (H) => (r(), d("button", {
          key: H.emoji,
          type: "button",
          class: X(["message-reaction", { mine: H.mine }]),
          title: H.title,
          "data-reaction": H.emoji,
          onClick: (K) => a("react", e.message, H.emoji)
        }, [
          z(v(H.emoji) + " ", 1),
          H.count > 1 ? (r(), d("span", s2, v(H.count), 1)) : k("", !0)
        ], 10, a2))), 128))
      ])) : k("", !0),
      Q.value.length ? (r(), d("div", o2, [
        (r(!0), d(B, null, Z(Q.value, (H) => (r(), d(B, {
          key: H.name
        }, [
          H.isImage ? (r(), d("a", {
            key: 0,
            href: H.address,
            target: "_blank",
            class: "message-image",
            title: H.title
          }, [
            h("img", {
              src: H.address,
              alt: H.name,
              "data-figure-picture": ""
            }, null, 8, i2)
          ], 8, l2)) : (r(), d("a", {
            key: 1,
            href: H.address,
            target: "_blank",
            class: "message-file"
          }, v(H.name), 9, r2))
        ], 64))), 128))
      ])) : k("", !0),
      O(T).length ? (r(), d("div", u2, [
        A(se, {
          name: "send",
          size: 12
        }),
        (r(!0), d(B, null, Z(O(T), (H) => (r(), j(xn, {
          key: H.id,
          as: "button",
          "agent-id": H.id,
          label: `Worker ${H.id}`,
          class: "message-sent-worker",
          disabled: H.unavailable || !H.open_ref,
          "data-sent-worker": H.id,
          onClick: he((K) => H.open_ref && O(Pe)(H.open_ref), ["stop"])
        }, {
          default: N(() => [
            z("Also sent to worker " + v(H.id), 1),
            H.unavailable ? (r(), d(B, { key: 0 }, [
              z(" (unavailable)")
            ], 64)) : k("", !0)
          ]),
          _: 2
        }, 1032, ["agent-id", "label", "disabled", "data-sent-worker", "onClick"]))), 128))
      ])) : k("", !0),
      A(Bn, {
        more: O(L),
        loading: O(U),
        failure: O(J),
        label: "More recipients",
        onMore: O(oe)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      h("div", c2, [
        h("time", d2, v(W.value), 1),
        Number.isInteger(e.message.id) ? (r(), d(B, { key: 0 }, [
          ye[10] || (ye[10] = h("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          h("span", f2, "message " + v(e.message.id), 1)
        ], 64)) : k("", !0),
        l.value ? (r(), j(Lw, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : k("", !0)
      ]),
      O(D).length || O(S) ? (r(), j(Ow, {
        key: 3,
        links: O(D),
        total: O(G),
        more: O(_),
        loading: O(g),
        failure: O(S),
        onMore: O(ee)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : k("", !0)
    ], 8, Yw)), [
      [O(Et), Qe]
    ]);
  }
}, CA = /* @__PURE__ */ V(p2, [["__scopeId", "data-v-7241010f"]]), ya = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], ss = 200, Rr = (e) => {
  var t;
  return ((t = ya.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? ya[0].key;
}, EA = (e) => {
  var t;
  return ((t = ya.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, v2 = ["aria-label"], g2 = 300, Ml = 400, y2 = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: ss } },
  setup(e) {
    const t = e, n = M(() => Rr(t.value)), a = M(() => n.value < ss ? [1, 0.25, 0.25] : n.value === ss ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (r(), d("svg", {
      class: X(["ico", "prio", { hot: n.value >= Ml, high: n.value >= g2 && n.value < Ml }]),
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
        style: pe({ opacity: a.value[0] })
      }, null, 4),
      h("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: pe({ opacity: a.value[1] })
      }, null, 4),
      h("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: pe({ opacity: a.value[2] })
      }, null, 4)
    ], 10, v2));
  }
}, AA = /* @__PURE__ */ V(y2, [["__scopeId", "data-v-b10e610f"]]), Lr = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], OA = (e) => {
  const t = Lr[e - 1];
  return t.slice(0, 1).toUpperCase() + t.slice(1);
}, b2 = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, _l = (e) => b2[e.card.state] || "idle", k2 = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), Cl = { working: 0, waiting: 1, idle: 2, stopped: 3 }, El = (e, t) => Cl[_l(e)] - Cl[_l(t)], Al = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, TA = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => El(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || k2(a, s)) : [...e].sort((a, s) => El(a, s) || (Al[t] || Al.state)(a, s)), w2 = { class: "list-row" }, $2 = {
  key: 0,
  class: "list-row-type"
}, x2 = { class: "list-row-main" }, S2 = {
  key: 0,
  class: "list-row-title"
}, M2 = { class: "list-row-body" }, _2 = {
  key: 1,
  class: "list-row-end"
}, C2 = {
  key: 1,
  class: "list-row-line"
}, E2 = {
  key: 2,
  class: "list-row-text"
}, A2 = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", w2, [
      e.type ? (r(), d("span", $2, v(e.type), 1)) : k("", !0),
      h("div", x2, [
        e.title ? (r(), d("span", S2, v(e.title), 1)) : k("", !0),
        h("div", M2, [
          ne(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (r(), d("div", _2, [
          ne(t.$slots, "end", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      t.$slots.text ? (r(), d("div", C2, [
        ne(t.$slots, "text", {}, void 0, !0)
      ])) : e.text ? (r(), d("span", E2, v(e.text), 1)) : k("", !0)
    ]));
  }
}, O2 = /* @__PURE__ */ V(A2, [["__scopeId", "data-v-f1b2d4cf"]]), IA = {
  __name: "ModelPicker",
  props: {
    title: { type: String, required: !0 },
    models: { type: Array, required: !0 },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = M(() => [
      ...n.models.map((l) => ({ key: l.name, label: l.name, note: l.tier })),
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = M(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, i) => (r(), j(ro, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: i[0] || (i[0] = (u) => a("pick", u.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, T2 = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: X(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      ne(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, Ws = /* @__PURE__ */ V(T2, [["__scopeId", "data-v-978e0921"]]), I2 = ["aria-label"], B2 = { class: "head" }, R2 = { class: "names" }, L2 = { class: "body" }, N2 = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = Di(a, n), i = Pi(s);
    return (u, c) => (r(), j(In, { to: "body" }, [
      A(nn, {
        name: "side",
        appear: "",
        onAfterLeave: O(l)
      }, {
        default: N(() => [
          O(s) ? (r(), d("div", {
            key: 0,
            class: X(["veil", { over: e.over, under: e.depth }]),
            style: pe({ "--depth": e.depth, zIndex: O(i) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = he((...f) => O(o) && O(o)(...f), ["self"]))
          }, [
            h("aside", {
              class: X(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (r(), d(B, { key: 0 }, [
                h("header", B2, [
                  h("div", R2, [
                    h("h2", null, v(e.title), 1),
                    e.abstract ? (r(), j(ut, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : k("", !0),
                    ne(u.$slots, "meta", {}, void 0, !0)
                  ]),
                  ne(u.$slots, "actions", {}, void 0, !0),
                  A(Ia, {
                    title: e.closeLabel,
                    onClick: O(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                u.$slots.foot && !e.footBelow ? (r(), j(Ws, { key: 0 }, {
                  default: N(() => [
                    ne(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0),
                h("div", L2, [
                  ne(u.$slots, "default", {}, void 0, !0)
                ]),
                u.$slots.foot && e.footBelow ? (r(), j(Ws, {
                  key: 1,
                  class: "below"
                }, {
                  default: N(() => [
                    ne(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0)
              ], 64)) : ne(u.$slots, "default", {}, void 0, !0, 1)
            ], 10, I2)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, BA = /* @__PURE__ */ V(N2, [["__scopeId", "data-v-d0a677ef"]]), q2 = {
  key: 1,
  class: "text-field-label"
}, D2 = {
  key: 2,
  class: "text-field-end"
}, P2 = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ mt({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = qt(e, "modelValue"), a = Ca(), s = "onUpdate:modelValue" in (((f = Yu()) == null ? void 0 : f.vnode.props) || {}), o = M(() => s ? n.value : a.value), l = (m) => s && (n.value = m.target.value), i = M(
      () => Object.fromEntries(Object.entries(a).filter(([m]) => m !== "class" && m !== "style" && m !== "value"))
    ), u = M(() => Object.fromEntries(Object.entries(a).filter(([m]) => m !== "value"))), c = E(null);
    return t({ focus: () => c.value && c.value.focus() }), (m, p) => e.label || e.icon || m.$slots.end ? (r(), d("label", {
      key: 0,
      class: X(["text-field", { large: e.large, ended: m.$slots.end }, O(a).class]),
      style: pe(O(a).style)
    }, [
      e.icon ? (r(), j(se, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : k("", !0),
      e.label ? (r(), d("span", q2, v(e.label), 1)) : k("", !0),
      ge(h("input", Ne({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [O(Ts), o.value]
      ]),
      m.$slots.end ? (r(), d("span", D2, [
        ne(m.$slots, "end", {}, void 0, !0)
      ])) : k("", !0)
    ], 6)) : ge((r(), d("input", Ne({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, u.value, { onInput: l }), null, 16)), [
      [O(Ts), o.value]
    ]);
  }
}), j2 = /* @__PURE__ */ V(P2, [["__scopeId", "data-v-d9c38ca8"]]), F2 = {
  class: "page-header",
  "data-page-header": ""
}, W2 = { class: "page-title" }, H2 = {
  key: 0,
  class: "page-count",
  "data-page-count": ""
}, z2 = { class: "page-header-end" }, U2 = {
  __name: "PageHeader",
  props: { title: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (r(), d("header", F2, [
      h("h1", W2, [
        z(v(e.title), 1),
        e.count !== null ? (r(), d("span", H2, v(e.count), 1)) : k("", !0)
      ]),
      h("span", z2, [
        ne(t.$slots, "primary", {}, void 0, !0),
        ne(t.$slots, "actions", {}, void 0, !0)
      ])
    ]));
  }
}, V2 = /* @__PURE__ */ V(U2, [["__scopeId", "data-v-923fbadc"]]);
function Nr(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
function RA(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const LA = () => ({}), ba = (e) => Object.fromEntries(e.filter((t) => {
  var n;
  return (n = t.default) == null ? void 0 : n.length;
}).map((t) => [t.key, { not: !1, values: [...t.default] }])), qr = (e, t) => {
  const n = (t == null ? void 0 : t.values) ?? [], a = e.default ?? [];
  return !(t != null && t.not) && n.length === a.length && a.every((s) => n.includes(s));
}, Dr = (e) => !!(e != null && e.values.length), NA = (e, t, n = (a) => a) => [...new Set(e.flatMap((a) => [].concat(t(a))).filter((a) => a != null && a !== ""))].map((a) => [a, n(a)]), G2 = (e, t, n) => t.filter((a) => [].concat(e.get(a)).includes(n)).length;
function Pr(e, t, n, a = "", s = []) {
  return e.filter((o) => t.every((l) => K2(o, l, n[l.key])) && (!a.trim() || Nr(o, a, s)));
}
function K2(e, t, n) {
  if (!Dr(n)) return !0;
  const a = [].concat(t.get(e)), s = n.values.some((o) => a.includes(o));
  return n.not ? !s : s;
}
const Y2 = { class: "filter-ways" }, Q2 = { class: "filter-count" }, X2 = {
  __name: "FilterChoices",
  props: { field: { type: Object, required: !0 }, rows: { type: Array, required: !0 }, modelValue: { type: Object, default: null } },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = [
      { key: "is", label: "is" },
      { key: "not", label: "is not" }
    ], o = () => n.modelValue ?? { not: !1, values: [] }, l = (c) => a("update:modelValue", c.values.length ? c : null), i = (c) => l({ ...o(), not: c === "not" }), u = (c) => l({ ...o(), values: o().values.includes(c) ? o().values.filter((f) => f !== c) : [...o().values, c] });
    return (c, f) => (r(), d(B, null, [
      h("div", Y2, [
        A(Mt, {
          options: s,
          value: o().not ? "not" : "is",
          onPick: i
        }, null, 8, ["value"])
      ]),
      (r(!0), d(B, null, Z(e.field.options, ([m, p]) => (r(), j(We, {
        key: m,
        checked: o().values.includes(m),
        "data-filter-option": m,
        onClick: (b) => u(m)
      }, {
        default: N(() => [
          z(v(p) + " ", 1),
          h("span", Q2, v(O(G2)(e.field, e.rows, m)), 1)
        ]),
        _: 2
      }, 1032, ["checked", "data-filter-option", "onClick"]))), 128))
    ], 64));
  }
}, jr = /* @__PURE__ */ V(X2, [["__scopeId", "data-v-4e84eb6e"]]), J2 = ["data-filter-chip"], Z2 = ["aria-expanded"], e$ = {
  key: 0,
  "data-filter-value": ""
}, t$ = ["aria-label"], n$ = {
  __name: "FilterChip",
  props: { field: { type: Object, required: !0 }, rows: { type: Array, required: !0 }, modelValue: { type: Object, default: null } },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(null), o = M(() => Dr(n.modelValue)), l = M(() => !qr(n.field, n.modelValue)), i = M(() => n.modelValue.values.map((f) => {
      var m;
      return ((m = n.field.options.find(([p]) => p === f)) == null ? void 0 : m[1]) ?? f;
    }).join(", ")), u = () => {
      var f;
      return a("update:modelValue", (f = n.field.default) != null && f.length ? { not: !1, values: [...n.field.default] } : null);
    }, c = (f) => s.value = s.value ? null : f.currentTarget;
    return (f, m) => (r(), d("span", {
      class: X(["filter-chip", { on: o.value }]),
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
        o.value ? (r(), d("b", e$, v(e.modelValue.not ? "is not " : ": ") + v(i.value), 1)) : k("", !0),
        A(se, {
          name: "caret",
          size: 10
        })
      ], 8, Z2),
      o.value && l.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "filter-chip-clear",
        "data-filter-clear": "",
        "aria-label": `Clear ${e.field.label}`,
        onClick: u
      }, [
        A(se, {
          name: "close",
          size: 9
        })
      ], 8, t$)) : k("", !0),
      s.value ? (r(), j(Wt, {
        key: 1,
        anchor: s.value,
        align: "start",
        "min-width": 240,
        "max-width": 320,
        onClick: m[1] || (m[1] = he(() => {
        }, ["stop"])),
        onClose: m[2] || (m[2] = (p) => s.value = null)
      }, {
        default: N(() => [
          A(jr, {
            field: e.field,
            rows: e.rows,
            "model-value": e.modelValue,
            "onUpdate:modelValue": m[0] || (m[0] = (p) => a("update:modelValue", p))
          }, null, 8, ["field", "rows", "model-value"])
        ]),
        _: 1
      }, 8, ["anchor"])) : k("", !0)
    ], 10, J2));
  }
}, a$ = /* @__PURE__ */ V(n$, [["__scopeId", "data-v-0cc7efe6"]]), s$ = {
  class: "search-bar",
  "data-search-bar": ""
}, o$ = { class: "search-bar-control" }, l$ = ["value", "placeholder", "aria-label"], i$ = ["aria-expanded"], r$ = {
  key: 0,
  "data-menu-count": ""
}, u$ = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var x;
    const a = e, s = n, o = Qu(), l = ((x = $e(Be, null)) == null ? void 0 : x.search) ?? {}, i = M(() => l.placeholder || a.placeholder), u = l.context ?? [], c = E(null), f = E(null), m = E([]), p = M(() => m.value.length ? m.value[m.value.length - 1].next : u), b = M(() => !!o.menu || u.length > 0), $ = (C) => {
      m.value = [], f.value = f.value ? null : C.currentTarget;
    };
    function y(C) {
      if (C.next.length) {
        m.value = [...m.value, C];
        return;
      }
      f.value = null, s("pick", C.click);
    }
    function w() {
      var C;
      s("update:modelValue", ""), (C = c.value) == null || C.focus();
    }
    return t({ focus: () => {
      var C;
      return (C = c.value) == null ? void 0 : C.focus();
    } }), (C, q) => {
      var P;
      return r(), d("div", s$, [
        h("div", o$, [
          A(se, {
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
            onInput: q[0] || (q[0] = (I) => s("update:modelValue", I.target.value)),
            onKeydown: ze(w, ["esc"])
          }, null, 40, l$),
          e.modelValue ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: w
          }, [
            A(se, {
              name: "close",
              size: 12
            })
          ])) : k("", !0),
          b.value ? (r(), d("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!f.value,
            onClick: $
          }, [
            e.menuCount ? (r(), d("span", r$, v(e.menuCount), 1)) : k("", !0),
            A(se, {
              name: "caret",
              size: 12
            })
          ], 8, i$)) : k("", !0)
        ]),
        (P = O(l).button) != null && P.title ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: q[1] || (q[1] = (I) => s("pick", O(l).button.click))
        }, v(O(l).button.title), 1)) : k("", !0),
        ne(C.$slots, "default", {}, void 0, !0),
        f.value ? (r(), j(Wt, {
          key: 1,
          anchor: f.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: q[3] || (q[3] = he(() => {
          }, ["stop"])),
          onClose: q[4] || (q[4] = (I) => f.value = null)
        }, {
          default: N(() => [
            m.value.length ? (r(), j(We, {
              key: 0,
              "data-search-back": "",
              onClick: q[2] || (q[2] = (I) => m.value = m.value.slice(0, -1))
            }, {
              default: N(() => [
                z("‹ " + v(m.value[m.value.length - 1].title), 1)
              ]),
              _: 1
            })) : k("", !0),
            (r(!0), d(B, null, Z(p.value, (I) => (r(), j(We, {
              key: I.title,
              description: I.subtext,
              "data-search-entry": I.title,
              onClick: (Q) => y(I)
            }, {
              default: N(() => [
                z(v(I.title) + v(I.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            m.value.length ? k("", !0) : ne(C.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : k("", !0)
      ]);
    };
  }
}, Fr = /* @__PURE__ */ V(u$, [["__scopeId", "data-v-45374bed"]]), c$ = ["aria-expanded"], d$ = {
  key: 0,
  class: "filter-count",
  "data-filter-count": ""
}, f$ = 72, m$ = {
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
    const n = e, a = t, s = E(null), o = E(null), l = E([]), i = M(() => n.fields.filter((b) => l.value.includes(b.key))), u = M(() => n.fields.some((b) => !qr(b, n.modelValue[b.key])) || !!n.words.trim()), c = (b, $) => a("update:modelValue", { ...n.modelValue, [b]: $ }), f = () => {
      a("update:modelValue", ba(n.fields)), a("update:words", "");
    };
    async function m() {
      if (!s.value) return;
      l.value = [], await Re();
      const b = s.value.clientWidth;
      b && (l.value = [...s.value.querySelectorAll("[data-filter-chip]")].filter(($) => $.offsetLeft + $.offsetWidth > b - f$).map(($) => $.dataset.filterChip));
    }
    let p = null;
    return _e(() => {
      m(), p = new ResizeObserver(m), p.observe(s.value);
    }), Te(() => p == null ? void 0 : p.disconnect()), ce(() => [n.fields.length, n.modelValue], () => m(), { flush: "post" }), (b, $) => (r(), j(Fr, {
      "model-value": e.words,
      class: "filter-bar",
      placeholder: e.placeholder,
      "data-filter-bar": "",
      "onUpdate:modelValue": $[3] || ($[3] = (y) => a("update:words", y))
    }, {
      default: N(() => [
        h("div", {
          ref_key: "chips",
          ref: s,
          class: "filter-chips"
        }, [
          (r(!0), d(B, null, Z(e.fields, (y) => ge((r(), j(a$, {
            key: y.key,
            field: y,
            rows: e.rows,
            "model-value": e.modelValue[y.key] ?? null,
            "onUpdate:modelValue": (w) => c(y.key, w)
          }, null, 8, ["field", "rows", "model-value", "onUpdate:modelValue"])), [
            [ao, !l.value.includes(y.key)]
          ])), 128))
        ], 512),
        i.value.length ? (r(), d(B, { key: 0 }, [
          h("button", {
            type: "button",
            class: "filter-more",
            "data-filter-more": "",
            "aria-haspopup": "menu",
            "aria-expanded": !!o.value,
            onClick: $[0] || ($[0] = (y) => o.value = o.value ? null : y.currentTarget)
          }, "More", 8, c$),
          o.value ? (r(), j(Wt, {
            key: 0,
            anchor: o.value,
            align: "end",
            "min-width": 240,
            "max-width": 320,
            onClick: $[1] || ($[1] = he(() => {
            }, ["stop"])),
            onClose: $[2] || ($[2] = (y) => o.value = null)
          }, {
            default: N(() => [
              (r(!0), d(B, null, Z(i.value, (y) => (r(), d(B, {
                key: y.key
              }, [
                A($t, null, {
                  default: N(() => [
                    z(v(y.label), 1)
                  ]),
                  _: 2
                }, 1024),
                A(jr, {
                  field: y,
                  rows: e.rows,
                  "model-value": e.modelValue[y.key] ?? null,
                  "onUpdate:modelValue": (w) => c(y.key, w)
                }, null, 8, ["field", "rows", "model-value", "onUpdate:modelValue"])
              ], 64))), 128))
            ]),
            _: 1
          }, 8, ["anchor"])) : k("", !0)
        ], 64)) : k("", !0),
        u.value ? (r(), d(B, { key: 1 }, [
          e.shown !== null ? (r(), d("span", d$, v(e.shown) + " of " + v(e.rows.length), 1)) : k("", !0),
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
}, Wr = /* @__PURE__ */ V(m$, [["__scopeId", "data-v-c20a74ef"]]), h$ = { class: "title" }, p$ = { class: "state" }, v$ = {
  __name: "StateRows",
  props: {
    term: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = Ms(t.line, t.events);
    return (o, l) => (r(), j(xk, {
      rows: O(n),
      failure: O(a),
      loaded: O(s),
      empty: e.empty
    }, {
      default: N(({ row: i }) => [
        h("span", h$, v(i.title), 1),
        h("span", p$, v(O(wn)(e.term, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, qA = /* @__PURE__ */ V(v$, [["__scopeId", "data-v-6be0c59e"]]);
function g$(e = 1e3, t = null) {
  const n = E(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? ce(t, s, { immediate: !0 }) : s(!0), Te(() => clearInterval(a)), n;
}
const os = E(Date.now() / 1e3);
let Ol = 0, Jn = 0;
function Ao() {
  return Jn || (os.value = Date.now() / 1e3, Ol = setInterval(() => os.value = Date.now() / 1e3, 1e3)), Jn += 1, ui() && Aa(() => {
    Jn -= 1, Jn || clearInterval(Ol);
  }), os;
}
const y$ = 200, b$ = Tr + la + Ir + y$, k$ = 300, Zn = /* @__PURE__ */ new WeakMap();
function w$(e, t) {
  const n = Zn.get(e) ?? [];
  Zn.set(e, [...n, t]), !n.length && setTimeout(() => {
    const a = Zn.get(e);
    Zn.delete(e), e.run(["developer", "record-mark-motion", JSON.stringify(a)]);
  }, k$);
}
function cn(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function $$(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: cn(e),
    top: cn(e.querySelector(".top")),
    title: cn(e.querySelector(".title")),
    contents: cn(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var l, i, u, c;
      return `${((i = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : i.className) || ((c = (u = o.effect) == null ? void 0 : u.target) == null ? void 0 : c.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: i, boxSizing: u, transform: c, display: f }) => ({ width: o, minWidth: l, maxWidth: i, boxSizing: u, transform: c, display: f }))(getComputedStyle(e)),
    parent: cn(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function x$(e, t, n, a) {
  ce(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function u() {
      if (a.markMotion.value) {
        if (i.push($$(o, l, n.value)), performance.now() - l < b$) return void requestAnimationFrame(u);
        w$(a, { key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i });
      }
    }
    u();
  }, { flush: "sync" });
}
const S$ = ["title", "data-figure-mark", "data-folded", "data-open"], M$ = {
  key: 2,
  class: "worker"
}, _$ = { class: "head" }, C$ = { key: 0 }, E$ = {
  key: 3,
  class: "status"
}, A$ = {
  key: 0,
  class: "figure"
}, O$ = {
  key: 1,
  class: "ran-for"
}, T$ = { key: 2 }, I$ = {
  key: 3,
  class: "news"
}, B$ = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, R$ = {
  key: 6,
  class: "settled"
}, L$ = {
  key: 1,
  class: "bar"
}, N$ = {
  key: 3,
  class: "detail body"
}, q$ = {
  key: 0,
  class: "body-label"
}, D$ = ["title"], P$ = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Ca(), a = ["onClick", "onAct"], s = M(() => Object.fromEntries(Object.entries(n).filter(([le]) => !a.includes(le)))), o = E(!1), l = M(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = M(() => t.open !== void 0), u = M(() => i.value || l.value), c = M(() => i.value ? t.open : o.value), f = M(() => i.value ? !t.open : l.value && !o.value), m = M(() => !!(t.mark.action && n.onAct)), p = M(() => u.value || m.value || !!n.onClick), b = E(null), $ = E(null), { folded: y, phase: w } = Br(b, () => f.value);
    x$(b, f, w, $e(Be, null));
    function x(le) {
      var ke, xe;
      if (!(le.target !== b.value && !$.value.contains(le.target))) {
        if (i.value) return (ke = n.onClick) == null ? void 0 : ke.call(n, le);
        if (l.value) return void (o.value = !o.value);
        (xe = n.onAct || n.onClick) == null || xe(le);
      }
    }
    const C = (le) => n.onAct(le), q = ["failed", "unfinished"], P = M(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? q.includes(t.mark.state) ? "danger" : "good" : ""), I = M(() => t.mark.color ? t.mark.color : P.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : P.value ? `var(--tone-${P.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), Q = M(() => I.value || "var(--tone-work)"), W = M(() => !t.mark.ending && !t.mark.ended && P.value !== "stopped"), R = Ao(), D = M(
      () => t.mark.began_at && W.value && !t.mark.figure && !t.mark.counting ? hr(R.value - t.mark.began_at) : ""
    ), G = M(() => {
      const { started: le, ended: ke } = t.mark;
      return le ? ke ? `ran ${Zt(ke - le, !0)}` : Zt(R.value - le, !0) : D.value;
    }), _ = ["bad", "danger", "warn"], g = M(() => _.includes(P.value) || t.mark.asks ? "attention" : W.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), S = ["bad", "danger"], T = M(() => S.includes(P.value)), L = M(() => g.value === "process" ? "running" : T.value ? "cross" : P.value === "stopped" ? "stopped" : P.value === "good" ? "tick" : ""), U = M(
      () => !!(t.mark.figure || G.value || t.mark.docked || t.mark.stopping || L.value || t.mark.settled || t.mark.news)
    ), J = M(() => t.mark.markIcon ? { component: Ct, props: { class: "ico", name: t.mark.markIcon } } : { component: se, props: { name: t.mark.icon || "dot" } }), ee = M(() => [t.mark.title, t.mark.time ? mr(t.mark.time) : ""].filter(Boolean).join(" · ")), oe = M(() => ({
      ...I.value ? { "--mark": I.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, ke) => (r(), d("div", Ne(s.value, {
      ref_key: "root",
      ref: b,
      class: [
        "mark",
        `w-${g.value}`,
        O(w),
        {
          open: c.value,
          folding: i.value && f.value,
          live: p.value,
          failed: T.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: I.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: oe.value,
      title: ee.value,
      "data-figure-mark": e.mark.key,
      "data-folded": O(y) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: x
    }), [
      (r(), j(Je(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: $,
        class: "top",
        type: p.value ? "button" : void 0,
        "aria-expanded": u.value ? String(!!c.value) : void 0
      }, {
        default: N(() => [
          e.mark.agentId ? (r(), j(xn, {
            key: 0,
            "agent-id": e.mark.agentId,
            label: e.mark.label,
            class: "agent-icon",
            "data-mark-agent": ""
          }, {
            default: N(() => [
              (r(), j(Je(J.value.component), bt(ci(J.value.props)), null, 16))
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : (r(), j(Je(J.value.component), bt(Ne({ key: 1 }, J.value.props)), null, 16)),
          e.mark.worker ? (r(), d("span", M$, v(e.mark.worker), 1)) : k("", !0),
          h("span", _$, [
            A(ut, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (r(), d("strong", C$, v(e.mark.name), 1)) : k("", !0),
            u.value ? (r(), j(ln, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : k("", !0)
          ]),
          U.value ? (r(), d("span", E$, [
            e.mark.figure ? (r(), d("span", A$, v(e.mark.figure), 1)) : k("", !0),
            G.value ? (r(), d("span", O$, v(G.value), 1)) : k("", !0),
            e.mark.stopping ? (r(), d("span", T$, "Stopping")) : k("", !0),
            e.mark.news ? (r(), d("span", I$, v(e.mark.news), 1)) : k("", !0),
            L.value === "running" ? (r(), d("span", B$)) : L.value ? (r(), j(Ct, {
              key: 5,
              class: X(["sign", L.value]),
              name: L.value
            }, null, 8, ["class", "name"])) : k("", !0),
            e.mark.settled ? (r(), d("span", R$, v(e.mark.settled), 1)) : k("", !0)
          ])) : k("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      m.value ? (r(), j(Or, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: he(C, ["stop"])
      }, null, 8, ["label", "open"])) : k("", !0),
      (e.mark.figure || e.mark.counting) && W.value ? (r(), d("span", L$, [
        h("span", {
          class: "progress",
          style: pe({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: Q.value })
        }, null, 4)
      ])) : k("", !0),
      e.mark.detail && !O(y) ? (r(), j(ut, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      e.mark.body && !O(y) ? (r(), d("div", N$, [
        e.mark.bodyLabel ? (r(), d("p", q$, v(e.mark.bodyLabel), 1)) : k("", !0),
        A(ut, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : k("", !0),
      e.mark.command && !O(y) ? (r(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, v(e.mark.command), 9, D$)) : k("", !0),
      e.mark.card ? (r(), j(ut, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      ne(le.$slots, "default", {
        shown: !O(y)
      }, void 0, !0)
    ], 16, S$));
  }
}), Hr = /* @__PURE__ */ V(P$, [["__scopeId", "data-v-6e839007"]]), j$ = 8, F$ = 40, W$ = [];
class Oo {
  constructor(t, n, { top: a = j$, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && W$.push(this);
  }
  // a feed over a window's rows, as `useRows` and a window's props give them: refs of the rows, whether they loaded and whether more follow
  static ofRows(t, n, a) {
    return new Oo(t, {
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
    n > F$ && this.breach(`opened ${n}px above the bottom`), this.source.count() > this.source.pageSize() && this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
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
    return o > this.source.pageSize() && this.breach(`one scroll up added ${o} rows, a page is ${this.source.pageSize()}`), s && t && (await Re(), t.scrollTop += t.scrollHeight - a), s;
  }
  // rows too few to scroll leave no way to reach the top, so earlier pages are read until the pane scrolls or none is left
  async fill(t) {
    for (; t.clientHeight > 0 && t.scrollHeight <= t.clientHeight && this.source.more() && await this.scrollUp(); ) await Re();
  }
}
const H$ = 60, z$ = 300, zr = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function Ur(e, t) {
  const n = E([]), a = E(0);
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
  const c = new Oo("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => z$, more: () => a.value > 0, previous: u }, { top: H$ });
  return { lines: n, newest: l, follow: i, loadEarlier: (m) => c.reachTop(m), feed: c };
}
const U$ = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function Vr(e) {
  var n;
  const t = U$[e] || ((n = sn(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open";
}
const V$ = (e) => Vr(String(e).split(":")[0]), G$ = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), K$ = "agents", Y$ = { passed: "good", failed: "danger", warned: "warn", running: "" }, Q$ = { good: "good", warn: "warn", danger: "danger" }, Tl = {
  "open row": (e) => Pe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Km(e.target_model, e.target_id || 0)
}, X$ = { "open row": (e) => V$(e.target_model), "open page": () => Vr("pages") };
function J$(e, t) {
  const n = t || {}, a = Tl[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Y$[e.outcome] || "" : Q$[e.variant] || "",
    label: e.text,
    // a mark about an agent shows the agent's tooltip on its icon
    agentId: e.target_model === K$ ? e.target_id : 0,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? X$[a](e) : "",
    handlers: a ? { onAct: () => Tl[a](e) } : {}
  };
}
const Z$ = 24, e5 = 1e3, Il = 2e3, t5 = 0.25, n5 = 5e3;
function a5(e, t = Z$, n = () => !0) {
  const a = E(!1), s = E(0), o = E(!1);
  let l = 0, i = 0, u = 0;
  const c = () => e && "value" in e ? e.value : e, f = () => {
    const P = c();
    return P ? P.scrollHeight - P.scrollTop - P.clientHeight : 0;
  }, m = () => !c() || f() <= t;
  function p(P) {
    if (clearTimeout(l), !P) {
      o.value = !1, u = Date.now();
      return;
    }
    const I = Date.now() - u < Il ? Il : e5;
    l = setTimeout(() => o.value = a.value, I);
  }
  function b() {
    clearTimeout(i), a.value = !1, s.value = 0, p(!1);
  }
  function $(P = !1) {
    const I = c();
    I && P && I.scrollTo ? I.scrollTo({ top: I.scrollHeight, behavior: "smooth" }) : I && (I.scrollTop = I.scrollHeight), b();
  }
  function y() {
    x(), !a.value && (a.value = !0, p(!0));
  }
  const w = () => !!c() && f() <= c().clientHeight * t5;
  function x() {
    clearTimeout(i), w() && (i = setTimeout(() => a.value && w() && n() && $(!0), n5));
  }
  function C() {
    m() ? b() : y();
  }
  function q(P = 1, I = !1) {
    a.value ? s.value += Math.max(0, P) : $(I);
  }
  return ui() && Aa(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: f, atBottom: m, follow: b, toBottom: $, left: y, scrolled: C, arrived: q };
}
const s5 = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, o5 = (e) => String(e ?? "").replace(s5, ""), l5 = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(null), { away: o, scrolled: l, arrived: i, toBottom: u } = a5(s);
    ce(
      () => [n.lines, n.lines.length],
      () => Re(() => {
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
      z(v(O(o5)(e.lines.join(`
`)) || e.empty), 1),
      O(o) ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: m[0] || (m[0] = (p) => O(u)(!0))
      }, "Follow")) : k("", !0)
    ], 544));
  }
}, i5 = /* @__PURE__ */ V(l5, [["__scopeId", "data-v-89621acd"]]), r5 = "*.*", u5 = {
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
    const t = e, n = $e(Be, null), a = new wi();
    ce(
      () => a.patterns,
      (u, c, f) => {
        var p;
        const m = (p = n == null ? void 0 : n.subscriptions) == null ? void 0 : p.follow(`body of ${t.declaration.type}`, u, (b) => a.dispatch(b));
        f(() => m == null ? void 0 : m());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = M(() => !!(t.declaration.shipped || t.declaration.trusted)), i = M(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the user trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [r5] : t.declaration.events ?? [],
      options: []
    }));
    return (u, c) => l.value ? (r(), j(_r, {
      key: 0,
      entry: i.value,
      subscriptions: O(a),
      environment: O(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (r(), j(Mr, {
      key: 1,
      entry: i.value,
      subscriptions: O(a),
      environment: O(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, c5 = { class: "mark-more-inner" }, d5 = {
  class: "mark-lines",
  "data-mark-reason": ""
}, f5 = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, m5 = {
  key: 3,
  class: "mark-lines"
}, h5 = "process", Bl = "task", p5 = {
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
    const t = e, n = at(), a = M(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = M(() => G$.has(t.mark.variant) && t.mark.detail || ""), o = M(() => t.mark.target_model === Bl ? t.mark.target_id : 0), l = Ur(
      zr(n),
      () => t.mark.target_id
    ), i = l.lines, u = E(!1), c = E(""), f = M(() => !t.declaration.body_url && t.mark.target_model === h5 && !!t.mark.target_id);
    async function m(b = l.follow) {
      const $ = await b();
      u.value = !0, c.value = $.ok ? "" : $.error;
    }
    const p = M(() => t.shown && f.value);
    return ce(p, (b) => b && m()), oo(() => p.value && m(), () => p.value && !t.mark.ended_at), ce(
      () => t.mark.ended_at,
      (b) => b && p.value && m(l.newest)
    ), (b, $) => (r(), d("div", {
      class: X(["mark-more", { open: e.shown }]),
      onClick: $[1] || ($[1] = he(() => {
      }, ["stop"]))
    }, [
      h("div", c5, [
        e.declaration.body_url ? (r(), j(u5, {
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
            $[2] || ($[2] = h("p", { class: "mark-label" }, "Why it stopped", -1)),
            h("p", d5, v(s.value), 1)
          ], 64)) : k("", !0),
          f.value && c.value ? (r(), d("p", f5, v(c.value), 1)) : f.value && u.value ? (r(), d(B, { key: 2 }, [
            $[3] || ($[3] = h("p", { class: "mark-label" }, "Output", -1)),
            A(i5, {
              class: "mark-terminal",
              lines: O(i),
              feed: O(l).feed,
              onOlder: O(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (r(), d("p", m5, v(a.value.join(`
`)), 1)) : k("", !0),
          o.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: $[0] || ($[0] = he((y) => O(Pe)(`${Bl}:${o.value}`), ["stop"]))
          }, " Open task " + v(o.value) + " and its proofs ", 1)) : k("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Hs = /* @__PURE__ */ V(p5, [["__scopeId", "data-v-df71b15a"]]), v5 = ["title", "aria-label", "onClick"], g5 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, y5 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = M(() => km(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = E(""), s = $e(Be);
    async function o(l) {
      const i = await Rn(l, { id: t.mark.target_id }, s.environment);
      a.value = i.ok ? "" : i.error;
    }
    return (l, i) => (r(), d(B, null, [
      (r(!0), d(B, null, Z(n.value, (u) => (r(), d("button", {
        key: u.runs,
        type: "button",
        class: "mark-button",
        title: u.label,
        "aria-label": u.label,
        onClick: he((c) => o(u), ["stop"])
      }, [
        A(Ct, {
          name: u.icon
        }, null, 8, ["name"])
      ], 8, v5))), 128)),
      a.value ? (r(), d("span", g5, v(a.value), 1)) : k("", !0)
    ], 64));
  }
}, b5 = /* @__PURE__ */ V(y5, [["__scopeId", "data-v-7a62c88e"]]);
function Gr(e, t) {
  const n = lt(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Ee.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const Kr = Gr("/api/marks", "marks"), DA = Kr.fetchAll, k5 = Kr.find, w5 = ["data-ref"], $5 = ["data-ref"], x5 = { class: "mark-row" }, S5 = "dock add", M5 = "questions.answer", _5 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = M(() => k5(a.mark.type)), o = M(() => J$(a.mark, s.value)), l = M(() => {
      var p;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (p = s.value) != null && p.body_url);
    }), i = M(() => l.value || !!o.value.handlers.onAct), u = M(() => a.mark.type === M5), c = E(!1);
    function f() {
      c.value = !c.value;
    }
    const m = M(() => {
      var p;
      return (((p = s.value) == null ? void 0 : p.buttons) || []).filter((b) => {
        var $;
        return !a.docked || !(($ = b.runs) != null && $.startsWith(S5));
      }).map((b) => ({ ...b, module: s.value.module }));
    });
    return (p, b) => {
      var $, y;
      return ($ = s.value) != null && $.card ? (r(), d("div", {
        key: 0,
        class: X(["thread-turn", "card", "whole-card", { "user-side": O(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        A(Hs, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, w5)) : (r(), d("div", {
        key: 1,
        class: X(["thread-turn", "card", { "full-width": (y = s.value) == null ? void 0 : y.full_width, docked: e.docked, "user-side": O(n).has(e.mark.variant), "answer-bubble": u.value }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        h("span", x5, [
          A(Hr, {
            mark: o.value,
            open: i.value ? c.value : void 0,
            onAct: o.value.handlers.onAct,
            onClick: f
          }, Ea({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: N(({ shown: w }) => [
                A(Hs, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: w
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["mark", "open", "onAct"]),
          A(b5, {
            buttons: m.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, $5));
    };
  }
}, C5 = /* @__PURE__ */ V(_5, [["__scopeId", "data-v-424ddb61"]]), E5 = ["data-ref"], A5 = ["inert"], O5 = { class: "group-fold" }, T5 = { class: "thread-group" }, I5 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = E(!1), a = E(!1), s = E(!1), o = E(null);
    ce(n, async (i) => {
      var u;
      a.value = !0, await Re(), (u = o.value) == null || u.offsetHeight, s.value = i;
    });
    const l = M(() => ({
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
      A(Hr, {
        mark: l.value,
        open: n.value,
        onClick: u[0] || (u[0] = (c) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (r(), d("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: X(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        h("div", O5, [
          h("div", T5, [
            (r(!0), d(B, null, Z(e.group.marks, (c) => (r(), j(C5, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, A5)) : k("", !0)
    ], 8, E5));
  }
}, PA = /* @__PURE__ */ V(I5, [["__scopeId", "data-v-45b58b9b"]]);
function B5(e) {
  const t = E(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return _e(() => n.observe(e.value)), tt(() => n.disconnect()), t;
}
const R5 = { class: "chat-dock-fold" }, L5 = ["aria-label"], N5 = { class: "chat-dock-head" }, q5 = { class: "chat-dock-inner" }, D5 = { class: "chat-dock-foot" }, Yr = 700, P5 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = E(null), a = E(null), s = B5(a), o = E(!1);
    let l = 0;
    return _e(() => l = setTimeout(() => o.value = !0, Yr)), tt(() => clearTimeout(l)), t({ card: n }), (i, u) => (r(), d("div", {
      class: X(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      h("div", R5, [
        h("section", {
          ref_key: "card",
          ref: n,
          class: X(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ne(i.$slots, "edge", {}, void 0, !0),
          h("header", N5, [
            ne(i.$slots, "head", {}, void 0, !0)
          ]),
          h("div", {
            class: X(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            h("div", q5, [
              h("div", {
                class: X(["chat-dock-grow", { settled: o.value }]),
                style: pe(O(s) === null ? null : { height: `${O(s)}px` })
              }, [
                h("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  ne(i.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          ne(i.$slots, "still", {}, void 0, !0),
          h("footer", D5, [
            ne(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, L5)
      ])
    ], 2));
  }
}, j5 = /* @__PURE__ */ V(P5, [["__scopeId", "data-v-cc05fdac"]]), F5 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, ls = 5, W5 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(ls, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${ls}s`, animationDelay: `${(n - ls).toFixed(2)}s` };
    return (s, o) => (r(), d("span", F5, [
      h("i", { style: a })
    ]));
  }
}, H5 = /* @__PURE__ */ V(W5, [["__scopeId", "data-v-2a7bc150"]]), Qr = Gr("/api/docks", "docks"), jA = Qr.fetchAll, Gt = Qr.find, z5 = 6, is = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, To = (e) => Date.parse(e.leaves_at) / 1e3, fn = (e) => !!(e.leaves_at && !e.kept), U5 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!fn(e) || t < To(e) || n.has(e.id)), V5 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => U5(a, t, n)).sort((a, s) => a.id - s.id);
function G5(e, t, n = z5) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(To(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const K5 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), zs = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), Y5 = (e, t) => !(t != null && t.person_required) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), Q5 = (e) => ({ ...e.kept ? zs("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : zs("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), X5 = ["keep", "unkeep", "open", "undock"], J5 = (e) => ({ ...e, iconOnly: X5.includes(e.action) });
function Z5(e, t) {
  var n;
  return [
    ...Y5(e, t) ? [Q5(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || sn(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    zs("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(J5);
}
function Xr(e, t) {
  const n = Z5(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: K5(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const e4 = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || Xr(e, t).title, t4 = { class: "dock-text" }, n4 = ["title"], a4 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, s4 = {
  class: "dock-facts",
  "data-dock-facts": ""
}, o4 = {
  key: 1,
  "data-dock-row": ""
}, l4 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = M(() => Gt(a.item.type)), o = Ao(), l = M(() => on(a.item.created_at, o.value * 1e3)), i = E(null), u = E(null), c = E(null), f = E(null), m = M(() => Xr(a.item, s.value)), p = at(), b = M(() => `dock.${a.item.id}`), $ = M(() => p.props[b.value].data.value), y = M(() => e4(a.item, s.value, $.value)), w = M(() => va(a.item.target_model ?? "")), x = M(() => {
      var g;
      return ((g = s.value) == null ? void 0 : g.word) ?? "";
    }), C = M(() => ({ ...$.value, id: a.item.target_id, term: w.value })), q = () => {
      var g, S;
      return ((S = (g = s.value) == null ? void 0 : g.reads) == null ? void 0 : S.length) && p.reload(b.value);
    };
    yd(to, { data: $, reload: q, readOutput: zr(p) }), ce(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (g, S, T) => {
        var U;
        q();
        const L = (U = p.followUndeclared) == null ? void 0 : U.call(p, [`${w.value.replaceAll("-", "_")}.*`], (J) => {
          (!J.row_id || J.row_id === a.item.target_id) && q();
        });
        T(() => L == null ? void 0 : L());
      },
      { immediate: !0 }
    );
    const P = E(/* @__PURE__ */ new Set()), I = E("");
    async function Q(g) {
      if (g.action === "undock") return n("undock", g);
      if (g.action === "open") return Pe(`${a.item.target_model}:${a.item.target_id}`);
      g.action === "declared" && (P.value = /* @__PURE__ */ new Set([...P.value, g.label])), I.value = "";
      const T = await Rn(g, { id: a.item.target_id }, p.environment);
      (T == null ? void 0 : T.ok) === !1 && (P.value = new Set([...P.value].filter((L) => L !== g.label)), I.value = `Could not ${g.label.toLowerCase()}: ${T.error}`);
    }
    const W = M(() => m.value.actions.filter((g) => !P.value.has(g.label))), R = M(() => {
      var g;
      return Gy((g = s.value) == null ? void 0 : g.badge, C.value);
    }), D = M(() => m.value.controls), G = M(() => {
      var g;
      return !((g = s.value) != null && g.folds && a.folded);
    }), _ = M(() => {
      var g;
      return !!((g = s.value) != null && g.draws_head) && !a.collapsed;
    });
    return (g, S) => {
      var T, L, U, J;
      return r(), j(j5, {
        label: m.value.title + ((T = s.value) != null && T.person_required ? ", waiting for you" : ""),
        type: (L = s.value) != null && L.person_required ? "waiting" : "",
        folded: !!((U = s.value) != null && U.folds) && e.folded,
        body: !!((J = s.value) != null && J.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: S[4] || (S[4] = (ee) => e.collapsed && n("open"))
      }, {
        edge: N(() => [
          e.leaving && !e.item.kept ? (r(), j(H5, {
            key: 0,
            "ends-at": O(To)(e.item)
          }, null, 8, ["ends-at"])) : k("", !0)
        ]),
        head: N(() => {
          var ee;
          return [
            _.value ? (r(), d("span", {
              key: 0,
              ref_key: "head",
              ref: i,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (r(), d(B, { key: 1 }, [
              A(se, {
                name: m.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              h("span", t4, [
                h("span", {
                  class: X(["dock-title", { strip: e.collapsed }]),
                  title: y.value
                }, v(y.value), 11, n4)
              ])
            ], 64)),
            h("span", {
              ref_key: "time",
              ref: f,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (ee = s.value) != null && ee.leaves_after_seconds ? k("", !0) : (r(), d(B, { key: 0 }, [
                z(v(l.value), 1)
              ], 64))
            ], 512),
            D.value.length ? (r(), d("span", {
              key: 2,
              class: "dock-controls",
              onClick: S[0] || (S[0] = he(() => {
              }, ["stop"]))
            }, [
              (r(!0), d(B, null, Z(D.value, (oe) => {
                var le, ke;
                return r(), d(B, {
                  key: oe.action + oe.runs
                }, [
                  !P.value.has(oe.label) && (!((le = oe.variants) != null && le.length) || !((ke = C.value) != null && ke.state) || oe.variants.includes(C.value.state)) ? (r(), j(ie, {
                    key: 0,
                    variant: "icon",
                    class: X({ kept: oe.pressed }),
                    "aria-pressed": oe.pressed,
                    "aria-label": oe.label,
                    title: oe.label,
                    "data-dock-action": oe.action,
                    onClick: (xe) => Q(oe)
                  }, {
                    default: N(() => [
                      A(se, {
                        name: oe.icon,
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
        still: N(() => [
          I.value || e.refusal ? (r(), d("p", a4, v(I.value || e.refusal), 1)) : k("", !0)
        ]),
        foot: N(() => {
          var ee;
          return [
            h("span", s4, [
              R.value ? (r(), d("span", {
                key: 0,
                class: X(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, v(R.value), 3)) : k("", !0),
              x.value ? (r(), d("span", o4, v(x.value) + " " + v(e.item.target_id), 1)) : k("", !0),
              h("span", {
                ref_key: "foot",
                ref: u,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (ee = s.value) != null && ee.folds ? (r(), j(ie, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: S[1] || (S[1] = (oe) => n("fold"))
            }, {
              default: N(() => [
                z(v(s.value.folds) + " ", 1),
                A(ln, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : k("", !0),
            h("span", {
              class: "dock-acts",
              onClick: S[3] || (S[3] = he(() => {
              }, ["stop"]))
            }, [
              h("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              G.value ? (r(), d(B, { key: 0 }, [
                A(go, {
                  name: `dock.${e.item.type}`,
                  row: C.value,
                  environment: O(p).environment,
                  "read-only": O(p).readOnly,
                  "object-name": O(va)(e.item.target_model),
                  "external-failure": "",
                  onFailure: S[2] || (S[2] = (oe) => I.value = oe),
                  onDone: g.loadRow
                }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
                (r(!0), d(B, null, Z(W.value, (oe) => (r(), j(ie, {
                  key: oe.action + oe.runs,
                  small: "",
                  variant: oe.primary ? "primary" : "ghost",
                  bordered: !oe.primary,
                  "data-dock-action": oe.action,
                  onClick: (le) => Q(oe)
                }, {
                  default: N(() => [
                    z(v(oe.label), 1)
                  ]),
                  _: 2
                }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128))
              ], 64)) : k("", !0)
            ])
          ];
        }),
        default: N(() => {
          var ee;
          return [
            (ee = s.value) != null && ee.body_url ? (r(), j(Hs, {
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
}, Rl = /* @__PURE__ */ V(l4, [["__scopeId", "data-v-8bfc4ed9"]]), i4 = 24, r4 = 8, FA = 420;
function WA({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= i4 ? !0 : e < t && s > r4 ? !1 : null;
}
const u4 = (e, t) => e === void 0 ? t : e, c4 = { me: 1, people: [] }, ka = tn({
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
  people: c4,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: fa("journal.activity", !0),
  wide: !1,
  sideMini: fa("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Vi("journal.activity", () => ka.activity);
Vi("journal.side.mini", () => ka.sideMini);
const Jr = "journal.viewer.";
function d4(e, t, n) {
  try {
    const a = n.getItem(Jr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function f4(e, t, n) {
  try {
    n.setItem(Jr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function Ll(e, t, n = window.localStorage) {
  const a = E(d4(e, t, n));
  return ce(a, (s) => f4(e, s, n), { deep: !0 }), a;
}
const m4 = {
  key: "dock-all",
  class: "dock-all"
}, h4 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var _, g;
    const t = e, n = g$(500), a = E(/* @__PURE__ */ new Set()), s = $e(Be), o = E(/* @__PURE__ */ new Set()), l = E({});
    async function i(S, T) {
      l.value = { ...l.value, [S.id]: "" }, o.value = /* @__PURE__ */ new Set([...o.value, S.id]);
      const L = await Rn(T, { id: S.target_id }, s.environment);
      (L == null ? void 0 : L.ok) === !1 && (o.value = new Set([...o.value].filter((U) => U !== S.id)), l.value = { ...l.value, [S.id]: `Could not dismiss this card: ${L.error}` });
    }
    const u = M(
      () => V5(
        t.items.filter((S) => !o.value.has(S.id)),
        n.value,
        a.value
      )
    ), c = M(
      () => G5(
        u.value.filter((S) => is(S, Gt)),
        n.value
      )
    ), f = M(() => u.value.filter((S) => !c.value.includes(S) && !is(S, Gt))), m = Ll(`dock-size:${((_ = ka.identity) == null ? void 0 : _.root) || location.host}`, null), p = (S) => {
      var T;
      return !!((T = Gt(S.type)) != null && T.person_required);
    }, b = E(/* @__PURE__ */ new Set()), $ = E(/* @__PURE__ */ new Set()), y = M(() => u.value.length === 1), w = (S) => p(S) || y.value, x = (S) => w(S) ? b.value.has(S.id) || $.value.has(S.id) : m.value ? m.value.collapsed && !m.value.opened.includes(S.id) : t.collapsed, C = M(() => u.value.some(x));
    ce(() => t.collapsed, (S) => {
      $.value = new Set(S ? u.value.filter(p).map((T) => T.id) : []);
    });
    function q() {
      const S = !C.value;
      m.value = { collapsed: S, opened: [] }, b.value = new Set(S ? u.value.filter(p).map((T) => T.id) : []), $.value = /* @__PURE__ */ new Set();
    }
    function P(S) {
      var L;
      if (!x(S)) return;
      if (w(S)) {
        b.value = new Set([...b.value].filter((U) => U !== S.id)), $.value = new Set([...$.value].filter((U) => U !== S.id));
        return;
      }
      const T = (L = m.value) != null && L.collapsed ? m.value.opened : [];
      m.value = { collapsed: !0, opened: [...T, S.id] };
    }
    const I = Ll(`dock-folded:${((g = ka.identity) == null ? void 0 : g.root) || location.host}`, {}), Q = (S) => {
      var T;
      return !!((T = Gt(S.type)) != null && T.folds) && (t.insidesFolded || u4(I.value[S.id], is(S, Gt) || t.folded));
    };
    function W(S) {
      Q(S) && R(S), I.value = { ...I.value, [S.id]: !Q(S) };
    }
    function R(S) {
      var T;
      !((T = m.value) != null && T.collapsed) || m.value.opened.includes(S.id) || (m.value = { collapsed: !0, opened: [...m.value.opened, S.id] });
    }
    function D(S) {
      a.value = /* @__PURE__ */ new Set([...a.value, S.id]);
    }
    function G(S) {
      a.value = new Set([...a.value].filter((T) => T !== S.id));
    }
    return (S, T) => (r(), j(no, {
      tag: "div",
      name: "dock",
      duration: O(Yr),
      class: "dock-stack"
    }, {
      default: N(() => [
        u.value.length > 1 ? (r(), d("div", m4, [
          A(ie, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": C.value ? "Open all" : "Collapse all",
            onClick: q
          }, {
            default: N(() => [
              A(ln, {
                open: !C.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : k("", !0),
        (r(!0), d(B, null, Z(f.value, (L) => (r(), j(Rl, {
          key: L.id,
          item: L,
          class: X({ timed: O(fn)(L) }),
          leaving: O(fn)(L) && !a.value.has(L.id),
          folded: Q(L),
          collapsed: x(L),
          refusal: l.value[L.id],
          onOpen: (U) => P(L),
          onFold: (U) => W(L),
          onUndock: (U) => i(L, U),
          onMouseenter: (U) => D(L),
          onMouseleave: (U) => G(L)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        (r(!0), d(B, null, Z(c.value, (L) => (r(), j(Rl, {
          key: L.id,
          item: L,
          class: X({ timed: O(fn)(L) }),
          leaving: O(fn)(L) && !a.value.has(L.id),
          folded: Q(L),
          collapsed: x(L),
          refusal: l.value[L.id],
          onOpen: (U) => P(L),
          onFold: (U) => W(L),
          onUndock: (U) => i(L, U),
          onMouseenter: (U) => D(L),
          onMouseleave: (U) => G(L)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128))
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, HA = /* @__PURE__ */ V(h4, [["__scopeId", "data-v-0e24b6bb"]]), Nt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, ia = (e) => Math.min(Math.max(e, 0), 1), p4 = (e) => {
  const t = ia(e);
  return t * t * (3 - 2 * t);
}, Tt = (e, t, n) => p4((e - t) / (n - t));
function zA(e) {
  const t = ia(e), n = ia((t - 0.12) / 0.76) * Nt.shuffles, a = Math.min(Math.floor(n), Nt.shuffles - 1), s = n - a, o = Tt(s, 0.26, 0.38) * (1 - Tt(s, 0.76, 0.96)), l = Tt(s, 0.38, 0.76), i = Tt(t, 0, 0.12) * (1 - Tt(t, 0.88, 1)), u = Tt(s, 0.2, 0.34) * (1 - Tt(s, 0.84, 1)), c = Math.sin(Math.PI * ia((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / Nt.shuffles, lift: Nt.lift * o, ready: i, weight: u, follow: c, shuffle: a, phase: s };
}
function UA(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const Nl = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, VA = (e) => Nl[e] ?? Nl.butler, Io = 2400, v4 = 0.05;
function g4({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, v4), l = Math.min(t + Io * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function GA(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function y4(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function KA(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const YA = (e, t) => ({ ...e, stretch: t.stretch }), QA = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, Zr = (e, t) => t >= (e.least ?? 0);
function XA(e, t, n) {
  if (!Zr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const JA = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), b4 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", ql = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), k4 = (e) => e.right > e.left && e.bottom > e.top;
function ZA(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(b4)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = ql(l, n);
    const u = o.closest("[data-figure-scroll]");
    return u && !o.closest("[data-figure-chat-foot]") && (i = ql(i, u.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), k4(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
  });
}
function eu(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, i = 1;
    for (const [f, m, p] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const b = t[f] - e[f];
      if (Math.abs(b) < 1e-9)
        (e[f] < o[m] || e[f] > o[p]) && (i = -1);
      else {
        const $ = (o[m] - e[f]) / b, y = (o[p] - e[f]) / b;
        l = Math.max(l, Math.min($, y)), i = Math.min(i, Math.max($, y));
      }
    }
    if (l > i || a && l >= a.share) continue;
    const u = e.x + (t.x - e.x) * l, c = e.y + (t.y - e.y) * l;
    a = { share: l, x: u, y: c, on: "surface", surface: s.id, dx: u - s.left, dy: c - s.top };
  }
  return a;
}
const Oe = {
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
}, _n = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), w4 = (e) => e * e * (3 - 2 * e), Ie = (e, [t, n]) => w4(_n(e, t, n)), $4 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], wt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, ea = ([e, t], n) => e + n() * (t - e);
function x4(e) {
  return $4.map(() => {
    const t = ea(wt.speed, e), n = ea(wt.angle, e) * Math.PI / 180, a = ea(wt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [ea(wt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const S4 = x4(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function M4(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * wt.gravity * (t[2] - wt.floor))) / wt.gravity;
}
function eO(e, t, n = S4) {
  const a = Oe.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = M4(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const u = Math.min(s, l), c = a.from.map((f, m) => f + o.velocity[m] * u);
  return c[2] -= wt.gravity * u * u / 2, { at: c, turn: o.spin * u, landed: Math.max(0, s - l) / i };
}
const tO = (e, t) => e && Oe[e.name] ? { name: e.name, u: t / e.frames } : null;
function nO(e, t) {
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
const aO = () => Array.from({ length: Oe.pogo.count }, (e, t) => Oe.pogo.bounce * (t + 1) / Oe.pogo.count), Xt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function sO(e, t, n) {
  const { away: a, side: s } = Oe.bug_smash, o = s * a * n, [l, i] = [t.left + Xt.margin * n, t.right - Xt.margin * n], u = Math.min(Math.max(e + o + s * Xt.reach * n, l), i), c = u - o - e, f = u - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, f - o - t.left], bug: [u - t.left, f - t.left] };
}
function oO(e, t, n) {
  const a = Oe.bug_smash, s = Ie(t, a.walk), o = ([l, i]) => l + (i - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Xt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Xt.tall * n * (1 - Ie(t, a.emerge)),
      turn: 90 * (1 - Ie(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Ie(t, a.gone)
    }
  };
}
function lO(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Xt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = g4({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const je = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function iO(e) {
  const t = je.least + Math.floor(e() * (je.most - je.least + 1));
  return Array.from({ length: t }, () => ({
    wall: je.walls[Math.floor(e() * je.walls.length)],
    along: je.margin + e() * (1 - 2 * je.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function Us(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * je.margin, l = ((e.along - je.margin + e.way * je.speed * n / a) / s % 2 + 2) % 2, i = je.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + i * a, y: t.top + je.inset, turn: 180 } : { x: e.wall === "left" ? t.left + je.inset : t.right - je.inset, y: t.top + i * a, turn: e.wall === "left" ? 90 : -90 };
}
function _4(e, t) {
  const n = Oe.bug_shot, [a, s] = n.turn.map((f) => f * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = y4(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function rO(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Oe.bug_shot, { frame: l, bug: i, shot: u } = _4(n, e.length), c = e.map((x, C) => ({ ...Us(x, t, Math.min(n / o.fps, ra(C).shot)), shot: C < u })), f = Ie(l / o.frames, o.aim), [m, p] = [c[Math.max(i - 1, 0)], c[i]], b = e.map((x, C) => ({ bug: x, index: C, seconds: n / o.fps - ra(C).shot, spot: Us(x, t, ra(C).shot) })).filter((x) => x.seconds >= 0), $ = b.flatMap((x) => {
    const C = (s == null ? void 0 : s.get(x.index)) ?? T4(x.bug, t, x.spot, s ? [] : a);
    return s == null || s.set(x.index, C), s && I4(C, x.seconds, a), B4(C, x.seconds, a);
  }), y = b.filter((x) => A4(x.bug)).map((x) => ({ seconds: x.seconds, from: x.spot })), w = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - f) + +(e[i].wall === "top") * f;
  return { bugs: c, frame: l, target: { x: m.x + (p.x - m.x) * f, y: m.y + (p.y - m.y) * f, back: w }, slush: $, camera: y };
}
function ra(e) {
  const t = Oe.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function uO(e, t, n, a) {
  const { limit: s, margin: o } = Oe.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let u = n.x;
  return e.map((c, f) => {
    const m = ra(f), p = Us(c, t, m.shot), b = Math.abs(p.y - n.y) / Math.tan(s * Math.PI / 180), $ = p.x === u ? u - l >= i - u ? -1 : 1 : Math.sign(u - p.x), y = Math.abs(p.x - u) >= b ? u : p.x + $ * b, w = $ > 0 ? Math.max(u, Math.min(y, i)) : Math.min(u, Math.max(y, l)), x = { from: u, to: w, begin: m.walk, end: m.aim };
    return u = w, x;
  });
}
function cO(e, t, n) {
  var o;
  const a = Oe.bug_shot.back.stride * n;
  let s = 0;
  for (const l of e) {
    if (t <= l.begin) return { x: l.from, steps: s / a, way: 0 };
    if (t < l.end) {
      const i = l.from + (l.to - l.from) * Ie(t, [l.begin, l.end]);
      return { x: i, steps: (s + Math.abs(i - l.from)) / a, way: Math.sign(l.to - l.from) };
    }
    s += Math.abs(l.to - l.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: s / a, way: 0 };
}
const Ce = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, C4 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function E4(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const A4 = (e) => e.along * 97 % 1 < Ce.camera, Cn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * Ce.gravity * t * t });
function O4(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * Ce.gravity * (t.bottom - e.from.y))) / Ce.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * Ce.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / Ce.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, f) => c.t - f.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += Ce.step) {
    const f = Math.min(c + Ce.step, l.t), m = Cn(e, f), p = eu(i, m, n);
    if (p) return { ...p, t: c + (f - c) * p.share };
    i = m;
  }
  const u = Cn(e, l.t);
  return { ...l, x: Math.min(Math.max(u.x, t.left), t.right), y: Math.min(Math.max(u.y, t.top), t.bottom) };
}
function T4(e, t, n, a = []) {
  const s = E4(e.along + 1), [o, l] = C4[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: Ce.count }, () => {
    const u = i + (s() - 0.5) * 2 * (Ce.spread * Math.PI / 180), c = Ce.speed[0] + s() * (Ce.speed[1] - Ce.speed[0]), f = { from: { x: n.x, y: n.y }, vx: Math.cos(u) * c, vy: Math.sin(u) * c, r: Ce.radius[0] + s() * (Ce.radius[1] - Ce.radius[0]) };
    return { ...f, ...O4(f, t, a) };
  });
}
function I4(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += Ce.step) {
      const l = Math.min(o + Ce.step, s), i = eu(Cn(a, o), Cn(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function B4(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...Cn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - Ce.hold) / Ce.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((f) => f.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const i = l ? l.left + a.dx : a.x, u = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - u)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: i, y: u, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function dO(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: i, fps: u } = Oe.bug_shot;
  if (e < 0) return [];
  const c = (s[1] - s[0]) * i / u, f = (o[1] - o[0]) * i / u, m = Ie(e, [0, c]), p = Ie(e, [c, c + f]);
  return l.map((b) => {
    const $ = { x: a.x + b.at[0] * t, y: a.y + b.at[1] * t };
    return {
      x: n.x + ($.x - n.x) * m,
      y: n.y + ($.y - n.y) * m,
      r: b.size * t * (0.15 + 0.85 * m * m),
      run: p * p * t * 1.2,
      fade: 1 - p,
      landed: m >= 1
    };
  });
}
function fO(e, t, n, a, s) {
  const { sway: o, above: l } = Oe.chute, i = { x: t.x, y: t.y - l * a }, u = o / 2 * Math.sin(2 * Math.PI * s), [c, f] = [Math.cos(u * Math.PI / 180), Math.sin(u * Math.PI / 180)], m = (y) => {
    const [w, x] = [y.x - e.at.x, y.y - e.at.y];
    return { x: i.x + w * c - x * f, y: i.y + w * f + x * c };
  }, [p, b] = [...n].sort((y, w) => y.x - w.x), $ = e.ends.map(m);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: u, lines: $.map((y, w) => ({ from: y, to: w < $.length / 2 ? p : b })) };
}
const mO = (e, t) => Ie(t, e.grows) * (1 - Ie(t, e.sinks));
function wa(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: _n(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: _n(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function hO(e, t) {
  const n = Oe[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = wa(n, t), l = 1 - (1 - n.small) * Ie(a, n.shrinks) * (1 - Ie(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = wa(n, t), o = n.flat * Ie(a, n.squashes) * (1 - Ie(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * _n(s, ...n.springs)) * (1 - _n(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const pO = (e) => e === "pack_box";
function vO(e) {
  const { into: t, out: n } = wa(Oe.rope_swing, e);
  return 1 - Ie(t, [0, 1]) * (1 - Ie(n, [0, 1]));
}
function gO(e) {
  const t = Oe.rope_swing, { into: n, out: a } = wa(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Ie(n, [0, 1]) * (1 - Ie(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const R4 = { after: 3 }, Bo = 10, L4 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, N4 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, q4 = { weight: 19 }, tu = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, D4 = { every: 120 }, nu = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, au = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, P4 = {
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
}, Dn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: Bo }), re = (e, t, n = {}) => Dn(e, "clip", t, n), rs = (e, t, n = {}) => Dn(e, "look", t, n), Dl = (e, t, n = {}) => Dn(e, "gaze", t, n), be = (e, t, n = {}, a = {}) => ({ ...Dn(e, "pick", t, n), ...a }), Se = (e) => Dn("nothing", "nothing", e, {}), j4 = 120, F4 = 300, us = (e, t) => ({ ...re(e, t), cooldown: F4 }), fe = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), W4 = () => [re("joy", 2)], It = (e, t, n, a, s = {}) => ({ ...re(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), Bt = (e) => ({ ...e, cooldown: L4[e.name] }), dn = (e) => ({ ...e, shenanigan: !0, lasts: N4[e.name] }), La = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...fe("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [re("nod", 2), Se(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...fe("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...Bt(re("bug_shot", 3)), toward: "", onto: !1 },
    { ...Bt(re("bug_smash", 2)), toward: "", onto: !1 },
    re("nod", 2)
  ]),
  ...fe("tests_failed", { cooldown: 20, toward: "card" }, [re("startled", 2), re("dismay", 1), re("tantrum", 3), Se(1)]),
  ...fe("committed", { cooldown: 30, toward: "card", onto: !0 }, [re("nod", 2), Se(2)]),
  // a finding a plugin found fixed: now and then a halo over the head and a serene, holy look
  ...fe("sin_fixed", { cooldown: 300 }, [re("halo", 1), Se(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...fe("sin_committed", { cooldown: 300 }, [re("repent", 1), Se(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...fe("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [re("nod", 4), re("hand_rub", 4), Se(7)]),
  ...fe("question_asked", { cooldown: 60 }, [re("ask_sign", 9), re("look_up", 3), Se(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...fe("reported", { cooldown: 90 }, [Dl("read", 3), re("nod", 1), Se(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...fe("read_message", { cooldown: 30 }, [Dl("read", 3), Se(1)]),
  ...fe("fact_filed", { cooldown: 120 }, [re("file_card", 3), re("nod", 1), Se(6)]),
  ...fe("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [re("nod", 2), Se(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...fe("bar_done", { holds: !0 }, W4()),
  ...fe("bar_failed", { holds: !0 }, [re("fume", 1), re("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...fe("standing", { cooldown: 12 }, [re("look_left", 2), re("look_right", 2), re("look_up", 1), Se(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...fe("launched", { cooldown: 300 }, [re("tumble", 3), Se(47)]),
  // a break from the hammering now and then
  ...fe("building", { cooldown: 30 }, [re("wipe_brow", 4), re("look_left", 1), re("look_right", 1), Se(69)]),
  ...fe("failed", { cooldown: 20, toward: "card" }, [re("shake", 3), re("tantrum", 2), Se(2)]),
  ...fe("refused", { cooldown: 20 }, [re("shake", 1), Se(1)]),
  ...fe("work_done", { cooldown: 120 }, [re("stretch", 2), Se(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...fe("pondering", { cooldown: [30, 60] }, [be("ponder", 1)]),
  ...fe("thought_cloud", { cooldown: 90 }, [be("cloud", 1)]),
  ...fe("light_bulb", { cooldown: 150 }, [be("bulb", 1)]),
  ...fe("answered", { cooldown: 15 }, [rs("amused", 3), Se(2)]),
  ...fe("heard", { cooldown: 30 }, [
    re("bow", 1, { voices: ["butler"] }),
    re("salute", 1, { voices: ["squire"] }),
    re("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    Se(1)
  ]),
  ...fe("long_walk", { cooldown: 90 }, [re("stumble", 3), Se(22)]),
  ...fe("card_arrived", { cooldown: 20, toward: "card" }, [re("glance", 7), Se(13)]),
  ...fe("typing", { cooldown: 60 }, [rs("reading", 1), Se(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(P4).flatMap(([e, t]) => fe(`reacted:${e}`, {}, [rs(t, 1)])),
  ...Object.entries(nu).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => fe(`agent_reacted:${n}`, {}, [re(a, 1, { voices: [e] })])[0])),
  ...Object.entries(au).flatMap(([e, t]) => fe(`agent_reacted:${e}`, {}, [re(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...fe("pastime", {}, [
    It("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    It("rest", 3, 180, 120),
    It("yawn", 2, 60, 60),
    It("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    It("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    It("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    It("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...dn(Bt(re("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    dn(Bt(re("disco", 2, { ball: "bubble" }))),
    Se(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...fe("held:search", { cooldown: j4 }, [us("search", 3), { ...us("binoculars", 2), when: { home: !0 } }, { ...us("glass_bubble", 2), when: { bubble: !0 } }]),
  ...fe("held:type", {}, [re("type", 3), re("type_ponder", 1)]),
  ...fe("held:compacting", {}, [re("pack_box", 3), re("vacuum", 2), re("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...fe("spell", {}, [be("writing", 12, { state: "writing" }), be("reading", 12, { state: "reading" }), be("searching", 12, { state: "searching" }), Se(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...fe("tickled", {}, [{ ...Bt(re("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...fe("eager", {}, [re("eager", 2, { slow: !0 }), Se(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...fe("jump", {}, [dn(Bt(re("backflip", 7, { high: !0 }))), re("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...fe("climb", {}, [be("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...fe("unit", { cooldown: tu.build.cooldown }, [be("unit", q4.weight), Se(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...fe("progress_jump", { cooldown: 6 }, [re("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...fe("perch", {}, [{ ...be("hang", 1, { hands: !0, free: !0 }), cooldown: D4.every }, be("stand", 5)]),
  // a digit a blow's dust lets out
  ...fe("digit", {}, [be("0", 1), be("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...fe("roam", {}, [
    be("rest", 35, {}, { stay: [25, 60] }),
    be("seat", 15, {}, { stay: [15, 40] }),
    be("edge", 25, {}, { stay: [8, 20] }),
    dn(be("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    be("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    be("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    be("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    be("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    be("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    dn(Bt(be("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...fe("laptop", {}, [be("seat", 6, {}, { stay: [60, 150] }), be("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...fe("ledge_at", {}, [be("middle", 2, {}, { along: 1 / 2 }), be("third", 1, {}, { along: 1 / 3 }), be("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...fe("composed_as", {}, [
    be("facing", 4, {}, { turn: 0, leans: 0 }),
    be("turned_left", 1, {}, { turn: 335, leans: 0 }),
    be("turned_right", 1, {}, { turn: 25, leans: 0 }),
    be("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    be("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], su = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), ou = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), H4 = (e) => Array.isArray(e) ? e[0] : e, z4 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, U4 = (e) => La.some((t) => t.when.moment === e);
function V4(e) {
  var c;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), a = (f) => !e.memory || ou(f).every(([m, p]) => n(m) >= H4(p)), s = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = La.filter((f) => su(f.when, e) && (f.type !== "clip" || t(f.name)) && a(f) && s(f)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= R4.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, u = i.filter((f) => {
    var m;
    return f.type === "nothing" || f.name !== ((m = e.tally) == null ? void 0 : m.last);
  });
  return u.some((f) => f.type !== "nothing") ? u : i;
}
function et(e, t) {
  const n = V4(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (lu(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function lu(e, t, n) {
  var a;
  for (const [s, o] of ou(t)) (a = e.memory) == null || a.set(s, e.now + z4(o, n));
}
function yO(e, t, n) {
  lu(e, La.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const bO = (e) => Object.values(tu).find((t) => su(t.when, e)) ?? null, G4 = (e, t, n) => n - t <= (e.lifetime ?? Bo), kO = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || Zr(e.clip, t));
class iu {
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
const Vs = {
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
}, wO = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), ru = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), $O = {
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
}, xO = 120, K4 = 20, SO = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < K4), Y4 = (e) => Vs[e] || Vs.idle, MO = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, uu = "airborne", Q4 = "landing", X4 = "travelling", cu = "grounded", _O = ({ airborne: e, landing: t, trip: n }) => e ? uu : t ? Q4 : n != null && n.started ? X4 : cu;
function CO(e, t) {
  var s;
  const n = J4(e, t);
  return e.mode === cu && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function J4(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: u, state: c, doing: f, doingFacing: m = 0, readingFacing: p = null } = e;
  if (n === uu && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (u == null ? void 0 : u.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...Z4(o, f, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (u && !(u.onto && o)) return { clip: u.clip, facing: u.facing, once: !0, ...u.holds && { holds: !0 }, ...u.stretch && { stretch: u.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const b = p !== null && i.posture === "stand" && f !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(f) ? { clip: "waiting", facing: b ? p : e.composeFacing ?? 0 } : { clip: t(f, i.posture) ? f : Y4(c), facing: b ? p : i.posture === "sit" ? i.face : m };
}
function Z4(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Gs = (e) => e.outcome, ex = /^plugin:[^:]+:sins:/, Pl = (e) => e.type === "plugins.card" && ex.test(e.markKey), tx = [
  // a finding a plugin made in the agent's change, and one it found fixed, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => Pl(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => Pl(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], EO = (e, t) => e.filter((n) => n.author === "user" && ga(n.read_at) > t).map((n) => ({ beat: "read_message", time: ga(n.read_at), card: sr(n) })).sort((n, a) => n.time - a.time), jl = { user: "reacted", agent: "agent_reacted" };
function AO(e, t) {
  return e.filter((n) => jl[n.author] && Pt(n) > t).map((n) => ({ beat: `${jl[n.author]}:${n.emoji}`, time: Pt(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const nx = [.../* @__PURE__ */ new Set([...Object.values(nu).flatMap((e) => Object.keys(e)), ...Object.keys(au)])];
function OO(e, t) {
  return e.filter((n) => n.author === "agent" && Pt(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = nx.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: Pt(n), card: sr(n) })).sort((n, a) => n.time - a.time);
}
const ax = (e) => new iu(e).isTest(), $a = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Gs(e)] || "";
}, sx = 1800, ox = (e, t) => {
  if ($a(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && $a(n) !== "finished" && Number(e.time) - Number(n.time) <= sx ? "tests_fixed" : "tests_passed";
};
function TO(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(ax), s = a.filter((i) => $a(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, $a(i))), o.map((i) => ({ beat: ox(i, s), time: Number(i.time), card: i.key }));
}
function IO(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Gs(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Gs(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const BO = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: Pt(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function RO(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function LO(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function NO(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var u;
    return { beat: (u = tx.find((c) => c.matches(i))) == null ? void 0 : u.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, u) => i.time - u.time);
}
function Ro(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const Fl = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function lx(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    Ro(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function qO(e, t, n, a = {}) {
  const s = et({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : U4(`held:${e}`) ? "idle" : e;
}
const De = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function DO(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < De.ahead * n ? 180 : Math.sign(a) * De.turn;
}
const Wl = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function PO(e, t) {
  const n = Math.min(De.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(De.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(De.lines, Math.floor((e.bottom - e.top - 2 * a) / De.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / De.sweep) % s, i = o % De.sweep, u = De.sweep - De.returnSeconds, c = Wl((i - u) / De.returnSeconds), f = i <= u ? Wl(i / u) : 1 - c, m = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + a + m * De.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Hl = 3, du = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, zl = 12, jO = (e, t) => ({ mood: e, began: t, seen: 0 });
function FO(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!du(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= Hl ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * zl) / zl, lasts: Hl } };
}
const WO = (e) => e.posture === "hang" && !du(e.face), ix = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), rx = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function HO(e, t, n) {
  return ix.has(e) ? 1 / 0 : !rx.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(fu(n - t.began, t.share) - ct.lead, 0);
}
const ux = 5;
function zO(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= ux ? { beat: "long_walk", time: n } : null };
}
const cx = 30, ta = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function UO(e, t, n, a, s = null) {
  if (t && n < t.until || !ta.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = et({ moment: "spell", state: e, tally: s }, a), [l, i] = ta.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + ta.every } : { state: e, began: 0, until: 0, next: n + ta.every };
}
const VO = (e, t, n) => t && n < t.until && ru.has(e.state) ? { state: t.state, since: t.began } : e, ct = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, fu = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function GO(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const u = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: u ? { beat: u } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = fu(o, e.share);
  return s ? { eager: dx(t, l), moment: null } : l > ct.lead ? { eager: t, moment: null } : l < ct.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > ct.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < ct.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = et({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function dx(e, t) {
  return e.on && t > ct.lead + ct.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= ct.lead && t >= ct.least ? { ...e, on: !0, calm: !1 } : e;
}
const fx = 1, mx = { look: "look", gaze: "gaze" };
function hx(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = et({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [mx[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const px = (e, t, n, a, s, o = "", l = () => !0, i = null, u = "") => et({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: u }, s), vx = (e, t, n, a, s, o = 0) => et({ moment: "jump", high: e > fx * t, memory: a, now: s, room: o }, n).name === "backflip", gx = { work: ["building"], idle: ["standing"] };
function KO(e, t, n, a) {
  const s = Vs[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(gx[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), ru.has(e) ? { moments: o, began: n || a } : (n && a - n >= cx && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function yx(e, t, n) {
  return !et({ moment: "pondering", memory: e, now: t }, n) || !et({ moment: "thought_cloud", memory: e, now: t }, n) ? null : et({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Ul = { pondering: yx };
function YO(e, t, n, a, s, o) {
  if (Ul[e.beat]) {
    const i = Ul[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = hx(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== Bo && { lifetime: l.lifetime } } } : null;
}
function QO(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const u = px(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return u && { clip: u.name, card: "", flies: !!u.flies };
}
const XO = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function JO(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function ZO(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const eT = (e, t) => !!(e != null && e.watches) && !t.once, tT = 10, nT = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || G4(a, a.queuedAt, n)), aT = (e, t) => t ? null : e[0] ?? null;
function sT(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const oT = (e, t) => !t.during || !e.some((n) => n.during === t.during), bx = 2 * Math.PI, kx = 500;
function lT(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / kx, u = t && e.point && !!t.behind != !!e.point.behind, c = u && e.amount > 0, f = t && !c ? o : 0, m = e.amount < f ? Math.min(e.amount + i, f) : Math.max(e.amount - i, f), p = bx * l / 1e3, b = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, y = (c ? b : t != null && t.behind && t.mood === "reading" ? { ...t } : t && b && !u ? s && !t.behind && !b.behind ? $x(b, t, n, p, s) : Sx(b, t, n, p) : t) ?? b, w = y != null && y.behind && y.mood === "reading" ? wx(e.point, y, n, l, s) : y;
  return { point: w ?? null, toward: w ? { x: w.x - n.x, y: w.y - n.y } : null, amount: m, at: a };
}
function wx(e, t, n, a, s) {
  const o = (D) => D * 180 / Math.PI, l = (D) => o(Math.atan2(Math.sin(D * Math.PI / 180), Math.cos(D * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, u = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -u)) - i), f = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -u)) - i), m = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = m ? l(e.readingFacing - i) : 0, b = m ? e.readingYaw + p : f, $ = b + l(c - b), y = Math.min(Math.max(a / 1e3, 0), 0.1), w = De.turnSpeed * y, x = m ? b + Math.min(Math.max($ - b, -w), w) : $, C = m ? e.readingFollow + p : x, q = C + (x - C) * (1 - Math.exp(-y / De.followSeconds)), P = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, I = o(Ro(t.x - n.x, -u, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), Q = Math.min(Math.max(I, -P.up), P.down), W = De.tipSpeed * y, R = m ? e.readingPitch + Math.min(Math.max(Q - e.readingPitch, -W), W) : Q;
  return { ...t, readingYaw: x, readingFollow: q, readingPitch: R, readingFacing: i };
}
function $x(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (C) => {
    const { yaw: q, pitch: P } = Ro(C.x - n.x, s, n.y - C.y, o);
    return { yaw: q, pitch: Math.min(Math.max(P, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [u, c] = [Fl(i(e)), Fl(i(t))], f = Math.acos(Math.min(Math.max(u[0] * c[0] + u[1] * c[1] + u[2] * c[2], -1), 1));
  if (f <= a) return { ...t };
  const m = a / f, [p, b] = [Math.sin((1 - m) * f) / Math.sin(f), Math.sin(m * f) / Math.sin(f)], [$, y, w] = u.map((C, q) => p * C + b * c[q]), x = s * $ / y;
  return { ...t, x: n.x + x, y: n.y - lx(x, s, -Math.asin(Math.min(Math.max(w, -1), 1)), o) };
}
const xx = 0.15;
function iT(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= xx;
}
function Sx(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), u = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + u * Math.cos(i), y: n.y + u * Math.sin(i) };
}
const Mx = (e) => !(e != null && e.on);
function rT(e, t, n) {
  if (Mx(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const En = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, it = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, cs = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Vl = (e) => e * e * (3 - 2 * e);
function _x(e) {
  if (e < 0 || e >= it.seconds) return null;
  const t = cs(e, ...it.flicker), n = Math.floor(t * it.flickers * 2) % 2 === 0, a = e < it.flicker[1] ? n ? 0.35 + 0.5 * t : it.dim : 1;
  return { strength: 1 - Vl(cs(e, ...it.fade)), lit: a, white: e < it.flash[0] ? 0 : 1 - Vl(cs(e, ...it.flash)) };
}
const uT = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function cT(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = _x(t - e.at);
  return a && { colour: En.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: it.signs[e.tone], ...a } };
}
function dT(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function fT(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= En.looks || a === null && n - e.since >= En.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function mT(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const kt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, hT = { behind: 39, figure: 40, ahead: 41 }, Cx = "[data-figure-pile]", Ex = { amber: [1, 0.69, 0.125], good: En.colours.good, bad: En.colours.bad }, ua = { phases: 4, ms: 230, dim: 0.25 }, pT = (e, t, n) => e !== "amber" || (t + n) % ua.phases < ua.phases / 2 ? 1 : ua.dim, vT = (e) => e === "amber" ? ua.phases : 1;
function gT(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const yT = Object.keys(Ex), st = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, mn = ([e, t], n) => e + n() * (t - e);
function bT(e) {
  const t = st.least + Math.floor(e() * (st.most - st.least + 1));
  return Array.from({ length: Math.min(t, st.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * st.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = mn(st.start, e), l = mn(st.reach, e);
    return {
      text: et({ moment: "digit" }, e).name,
      x: a * o,
      y: st.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(mn(st.moveMs, e)),
      fadeMs: Math.round(mn(st.fadeMs, e))
    };
  });
}
const ds = { high: 3, gap: 1 };
function kT(e) {
  const t = Math.floor(e / ds.high);
  return { left: -(kt.inside + kt.width / 2 + t * (kt.width + ds.gap)), up: e % ds.high * (kt.height - kt.top) };
}
const Ax = (e, t, n) => et({ moment: "unit", memory: e, now: t }, n) !== null, Ox = { after: 5 }, Tx = (e) => e.filter((t) => t.active && (t.process || t.watch) && new iu(t).isBuild());
function wT(e, t, n) {
  const a = Tx(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= Ox.after ? s : null;
}
function $T(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: Ax(n, a, s) } : null;
}
const Gl = { ahead: 140, up: 70 };
function xT(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Gl.ahead, y: a - Gl.up } } : o ? { at: { x: n(o), y: a - o.up - kt.height } } : t ? { at: null } : null;
}
const fs = { least: 4e3, most: 1e4 }, Ix = (e) => fs.least + e() * (fs.most - fs.least), Rt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function ST(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = Ix(t);
    if (n.length >= Rt.most || t() >= Rt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (Rt.at[0] + t() * (Rt.at[1] - Rt.at[0]));
    n.push({ from: o, to: o + Rt.ms }), a = o + Rt.ms;
  }
}
const MT = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), _T = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), mu = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), CT = new Set(La.filter((e) => mu.has(e.when.moment) && e.type === "clip").map((e) => e.name)), Bx = (e) => e.some((t) => t.state === "built"), ET = (e, t) => Bx(t) ? e.filter((n) => !mu.has(n.beat)) : e, xt = { reach: 40, room: 6 }, Rx = (e, t) => t <= e - xt.reach + 2, AT = (e, t, n) => Rx(e, n) ? t - xt.reach : e - xt.reach - xt.room, OT = (e, t, n, a) => a > 0 && t < e && t + xt.reach >= e - 2 ? Math.min(n, Math.max(e, t + xt.reach)) : e, ms = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, TT = (e) => mn(e() < ms.longShare ? ms.long : ms.short, e), Lx = 2 * kt.width;
function IT(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= Lx ? o : e + (o - e + s / 2) % s;
}
const Nx = 60, BT = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= Nx, Kl = "[data-figure-home]", Pn = () => {
  var t;
  const e = document.querySelector(Kl);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Kl)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, qx = "[data-figure-docked-bars]", Dx = "[data-figure-chat-foot]", Px = [0.85, 0.6, 0.35, 0.15], jx = ["question", "waiting", "suggestion"], RT = (e, t) => jx.find((n) => e[n] > 0 && t[n] === "behind") || null;
function LT() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const Fx = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Wx = "[data-figure-newest]";
function hu() {
  var a, s;
  const e = (a = Pn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Wx), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, i;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Lo(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function An(e, t, n = hu()) {
  if (!e || !n) return !0;
  const a = pt(e, t), s = qa(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Le.top * t.size, bottom: a.top + Le.bottom * t.size }, l = Nt.gap;
  return !Na(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function NT(e, t, n, a = hu()) {
  if (!a || An(t, e, a)) return null;
  const s = qa(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = zt(), u = t.posture === "stand" ? qo * e.size : $u * e.size, c = Math.max(n.left + u, i.left + o), f = Math.min(n.right - u, i.right - l);
  return [a.left - Nt.gap - l, a.right + Nt.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= c && p.x <= f && An(p, e, a) && g8(p, e)).sort((p, b) => Math.abs(p.x - t.x) - Math.abs(b.x - t.x))[0] ?? null;
}
const hs = 0.26, pu = 0.54, Hx = 1.25 / 5.4, jn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: hs, travels: "stand" },
  lounge: { drop: hs, travels: "stand" },
  composed: { drop: hs, travels: "stand" },
  hang: { drop: pu, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, qT = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * Hx * Math.cos(t * Math.PI / 180),
  y: 1 - n - pu
}), gn = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), zx = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), DT = (e, t) => (e === "sit" ? zx.has(t) : gn.has(e)) ? e : "stand";
function PT(e, t) {
  return e.facing === t.facing || !gn.has(e.posture) && !gn.has(t.posture) ? t : { posture: "stand", facing: gn.has(e.posture) ? e.facing : t.facing };
}
const jT = 0.25, FT = (e, t) => gn.has(e) && jn[t].drop === 0, vu = 2, Ux = 90, Vx = 180, Gx = 140, Kx = 280, Yx = 420, Qx = 0.25, Xx = 290, Jx = 600, Zx = "cubic-bezier(0.2, 0.7, 0.4, 1)", e8 = "cubic-bezier(0.55, 0, 0.9, 0.6)", ps = 5;
function xa(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: u = Math.random, memory: c = null, now: f = 0, room: m = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < ps) return null;
  (l || i) && (o = Math.max(o, vu));
  const b = o > 1, $ = Math.abs(t.x - e.x), y = $ < ps ? 0 : $ / (Ux * o) * 1e3, w = Math.min(y, b ? Gx : Vx), x = Math.abs(t.y - e.y), C = t.y < e.y, q = C && !p && vx(x, n, u, c, f, m), P = C ? Yx + Math.min(x, 400) * Qx : Math.sqrt(2 * x / Io) * 1e3, I = {
    x: t.x,
    y: t.y,
    ms: x > ps ? q ? Jx : P : 0,
    lead: q ? Xx : C ? Kx : 0,
    easing: C ? Zx : e8,
    hopping: !0,
    clip: q ? "backflip" : C ? "jump" : "fall"
  }, Q = { x: t.x, y: t.y, ms: y + w, lead: 0, easing: "linear", ramp: w, ...b ? { clip: "run" } : {} }, W = p ? t8(t, n) : I, R = C && !a ? [{ ...Q, y: e.y }, W] : [{ ...I, x: e.x }, Q];
  return { way: Math.sign(t.x - e.x) || 1, legs: R, lands: !s, pace: o, running: b };
}
const t8 = (e, t) => ({ x: e.x, y: e.y, ms: Oe.pogo.frames / Oe.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), n8 = (e, t) => e.postures.includes(t) ? t : e.postures[0], WT = (e, t, n) => e.posture === "walk" && n ? "walk" : n8(e.clip, t), pt = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - jn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, Na = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Lo = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function zt() {
  var t;
  const e = (t = Pn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const na = 0.5, Yl = 20;
function HT(e, t, n = zt()) {
  const a = pt(e, t);
  return a.left >= n.left + Yl && a.right <= n.right - Yl;
}
function No(e, t, n = zt()) {
  const a = pt(e, t), s = a.right - a.left, o = qa(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], u = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - na && i <= n.right + na && a.top >= n.top - na && u <= n.bottom + na;
}
const Sa = [0.35, 0.5, 0.65], Ma = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Le = { left: Sa[0], right: Sa.at(-1), top: Ma[0], bottom: Ma.at(-1) }, a8 = 0.24;
function qa(e) {
  if (e.posture === "stand") return { left: Le.left, right: Le.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + a8 * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Le.left, t), right: Math.max(Le.right, t) };
}
function s8(e, { size: t }, n = zt()) {
  const a = qa(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const qo = (Le.right - Le.left) / 2 + 0.08;
function zT(e, t) {
  return e === "hang" ? Le : { ...Le, bottom: Math.min(Le.bottom, 1 - t - jn[e].drop) };
}
const o8 = "[data-figure-agent]";
function gu(e, t, n = "", a = "") {
  var i;
  const s = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !Lo(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const u of [l - 1, l].filter((c) => c >= 0)) {
    if (!o.data[u].trim()) continue;
    const c = document.createRange();
    if (c.setStart(o, u), c.setEnd(o, u + 1), [...c.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const yu = (e) => Ma.flatMap(
  (t) => Sa.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Do(e, t, n = "") {
  if (!An(e, t)) return Sa.length * Ma.length;
  const a = pt(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(Fx)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: u }) => u.width && u.height && Na(s, u) && Lo(i)).map(({ rect: i }) => i), l = (i, u) => o.some((c) => i >= c.left && i <= c.right && u >= c.top && u <= c.bottom);
  return yu(s).filter(([i, u]) => l(i, u) || gu(i, u, n)).length;
}
function l8(e, t) {
  const n = pt(e, t);
  return yu({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => gu(a, s, "", o8)).length;
}
const Ql = 4;
function UT(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Ql; o <= s; o += Ql)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!l8(i, e) && An(i, e)) return i;
    }
  return null;
}
function On(e, t, n) {
  const a = zt(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => No(l, t, a) && An(l, t)).map((l) => ({ spot: l, covered: Do(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const bu = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), i8 = [0.5, 0.25, 0.75], r8 = (e) => bu(e.getBoundingClientRect(), i8), ku = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, u8 = qo, c8 = (e, t, { size: n }, a = u8) => wu(e, ku[t], a * n, "stand");
function wu(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const d8 = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, $u = 0.1, f8 = (e, t, { size: n }) => wu(e, d8[t], $u * n, "sit"), m8 = (e) => ((e + 180) % 360 + 360) % 360 - 180, vs = 60;
function VT(e, t) {
  const n = m8(t);
  return !e.aside || Math.abs(n) >= vs ? t : n < 0 ? 360 - vs : vs;
}
const yn = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, h8 = (e) => [.../* @__PURE__ */ new Set([e, ...yn.turns.map((t) => (t + 360) % 360)])];
function GT(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = h8(t), l = yn.every[0] + a() * (yn.every[1] - yn.every[0]);
  return { face: t, from: s ? p8(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function p8(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / yn.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function KT(e, t) {
  const { element: n, edge: a } = Da(), s = ["left", "right"].map((i) => Fn(f8(a, i, e), e)).filter((i) => n && No(i, e) && !Do(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, u) => o(i) - o(u))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function YT(e, t, { size: n }) {
  const a = (Le.right - Le.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - xu } : e;
}
const xu = 7;
function Su() {
  const e = [...document.querySelectorAll(Cx)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function v8(e, t) {
  const n = pt(e, t), a = n.right - n.left;
  return { left: n.left + Le.left * a, right: n.left + Le.right * a, top: n.top + Le.top * a, bottom: n.bottom };
}
function g8(e, t) {
  const n = Su();
  return !n || !Na(v8(e, t), n);
}
const y8 = 4;
function Da() {
  const e = Wn(), t = Su(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > y8 || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - xu - n, 0) } };
}
const QT = ({ size: e, below: t }) => (1 - t) * e;
function Fn(e, t) {
  const n = zt(), { size: a, below: s } = t, o = jn[e.posture].drop * a;
  return { ...s8(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const Ks = (e, t) => Object.keys(ku).map((n) => Fn(c8(e, n, t), t)), Po = (e, t) => bu(e, Px).map((n) => Fn(n, t)), Mu = (e, t, n) => On(e, t, n) ?? e[0];
function XT(e, t) {
  const { element: n, edge: a } = Da();
  return { ...Mu(Ks(a, e), e, t), view: null, on: n };
}
function JT(e, t, n, a) {
  const { element: s, edge: o } = Da(), l = (a ? Ks(o, t) : [...Ks(o, t), ...Po(o, t)]).filter(
    (c) => !Na(pt(c, t), e)
  ), i = On(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), u = i && !Do(i, t) ? i : On(l, t, n);
  return u && { ...u, view: null, on: s };
}
function Wn() {
  var a;
  const e = Pn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(qx);
  if (!t) return { ...Pa(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Xl = { within: 2 };
function ZT(e) {
  const { element: t, docked: n, edge: a } = Wn();
  if (!n || e.on !== t) return !0;
  const s = Pa().edge;
  return a.left > s.left + Xl.within || a.left + a.width < s.left + s.width - Xl.within;
}
const b8 = "[data-figure-closing]";
function eI() {
  var n;
  const { element: e, docked: t } = Wn();
  return t && !!((n = e.firstElementChild) != null && n.matches(b8));
}
const _u = "[data-figure-progress]";
function tI(e) {
  const t = e.querySelector(_u);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function nI(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const k8 = { across: 300, above: 380, below: 60 };
function aI(e) {
  const { across: t, above: n, below: a } = k8;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: w8(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const w8 = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Cu = "[data-figure-bar]", Ys = { back: 144, along: 0.4 };
function sI(e) {
  const { element: t, docked: n, edge: a } = Wn(), s = n ? t.querySelector(Cu) : null;
  if (!(s != null && s.querySelector(_u))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...Fn({ x: o - Ys.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function oI(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < Ys.along * a.size ? t.x + Ys.along * a.size : e.x, y: e.y, behind: !0 };
}
function lI(e) {
  const t = e.querySelector(Cu), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function Pa() {
  const e = Pn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function iI(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = Pa(), u = n === null ? $8(i, e, o === null ? t : { x: o, y: i.top }, a, s) : Fn({ x: n, y: i.top, posture: "stand" }, e);
  return u && { ...u, view: null, on: l, stays: !0 };
}
function $8(e, t, n, a, s) {
  const o = Po(e, t), l = Math.min(...o.map((u) => u.x)), i = o.filter((u) => u.x + a + kt.width < s && u.x + a - xt.reach - xt.room >= l);
  return On(i.length ? i : o, t, n);
}
const x8 = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function rI(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: u = [], memory: c = null, now: f = 0, room: m = 0, pogo: p = !1 } = {}) {
  (o || l) && (s = Math.max(s, vu));
  const b = (q) => {
    const P = pt(q, n, jn[q.posture].travels);
    return { x: P.left, y: P.top };
  }, $ = t.ladder ?? e.ladder;
  if ($ && !(t.ladder && e.ladder)) return S8(b(e), b(t), b({ ...$.foot, posture: "stand" }), $.way, !!t.ladder, n, s);
  const [y, ...w] = [e, ...u, t].map(b), x = xa(y, w[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: f, room: m, pogo: p }), C = w.slice(1).map((q, P) => {
    var I;
    return (I = xa(w[P], q, n.size, { random: i, memory: c, now: f, room: m })) == null ? void 0 : I.legs.find((Q) => Q.hopping);
  });
  return x && { ...x, legs: [...x.legs, ...C.filter(Boolean)] };
}
function S8(e, t, n, a, s, o, l) {
  const i = (f, m) => ({ x: m.x, y: m.y, ms: Math.hypot(m.x - f.x, m.y - f.y) / x8.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), u = s ? xa(e, n, o.size, { pace: l }) : xa(n, t, o.size, { pace: l }), c = s ? [...(u == null ? void 0 : u.legs) ?? [], i(n, t)] : [i(e, n), ...(u == null ? void 0 : u.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function uI(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function cI(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && On(r8(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = Da();
  return { ...Mu(Po(s, t), t, n), view: null, on: a };
}
const M8 = "[data-figure-bubble]", _8 = 250;
let bn = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Eu = 0;
const rn = () => bn, gs = /* @__PURE__ */ new WeakMap();
let C8 = 0;
function jo(e) {
  return gs.has(e) || gs.set(e, `floor-${++C8}`), gs.get(e);
}
const E8 = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, A8 = () => {
  var e, t;
  return ((t = (e = Pn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function O8(e, t) {
  var a;
  const n = (a = e.querySelector(Dx)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function T8(e, t) {
  const n = e && O8(e, t), a = e ? [...e.querySelectorAll(M8)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || E8(l, n))).map(({ element: o, type: l, box: i }) => ({ id: jo(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const I8 = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= _8 ? (t.top - a.top) / s * 1e3 : 0;
};
function Au(e = bn, t = performance.now()) {
  const n = zt(), a = A8(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = Wn(), u = [];
  o && u.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = Pa();
  return c.element && u.push({ id: jo(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), u.push(...T8(a, s)), u.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(u.map((f) => Object.freeze({ ...f, vy: I8(e, f, t) }))) });
}
const Qs = /* @__PURE__ */ new Set();
function B8(e) {
  return Qs.add(e), () => Qs.delete(e);
}
function R8() {
  Ou();
  const e = () => {
    Eu = requestAnimationFrame(e), !document.hidden && (bn = Au(bn), Qs.forEach((t) => t(bn)));
  };
  e();
}
function Ou() {
  cancelAnimationFrame(Eu);
}
const Fo = 5, L8 = 56, N8 = { share: 0.6 }, q8 = (e) => -Math.sqrt(2 * Io * N8.share * e), en = (e, t) => e.find((n) => n.id === t) ?? null;
function dI(e, t = Au().floors) {
  const n = en(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : jo(e.on) : null, o = s && en(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Tu({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, u = rn().floors) {
  const c = en(u, e);
  if (!c) return null;
  const f = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || D8(c, f, o)) && P8(f, i, u) ? { x: f.x, y: f.y } : null;
}
const Wo = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, D8 = (e, t, n) => !Wo({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function fI(e, t = rn().floors) {
  if (!Wo(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= Fo && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function P8(e, t, n = rn().floors) {
  const a = en(n, "home");
  return e.posture === "hang" && a && pt(e, t).bottom >= a.top ? !1 : No(e, t);
}
function mI(e, t, n, a = rn().floors) {
  const s = Tu(e, n, a);
  if (!e.home) return j8(e, t, s, a);
  if (!s) return null;
  const o = en(a, "home"), l = s.y - t.y, i = l > Fo ? "dropping" : -l > L8 ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function j8(e, t, n, a) {
  const s = n ? en(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: q8(e.risen) };
  if (!n) return null;
  if (Wo(t) && n.y - t.y > Fo) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function hI(e, t, n) {
  const a = qo * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function pI(e, t, n, a = rn().floors) {
  const s = t && Tu(t, n, a);
  return s ? { ...e, ...s } : e;
}
const F8 = ["data-type"], W8 = { class: "figure-floor-name" }, H8 = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: pe({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      h("span", W8, v(e.floor.type), 1)
    ], 12, F8));
  }
}, z8 = /* @__PURE__ */ V(H8, [["__scopeId", "data-v-4e0f1e2e"]]), U8 = {
  class: "figure-floors",
  "aria-hidden": "true"
}, V8 = {
  __name: "FigureFloors",
  setup(e) {
    const t = lt(rn().floors);
    let n = () => {
    };
    return _e(() => {
      n = B8((a) => t.value = a.floors), R8();
    }), Te(() => {
      n(), Ou();
    }), (a, s) => (r(), d("div", U8, [
      (r(!0), d(B, null, Z(t.value, (o) => (r(), j(z8, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, vI = /* @__PURE__ */ V(V8, [["__scopeId", "data-v-e519168b"]]), G8 = 5e3;
function gI(e, { chosen: t, held: n = () => !1 }) {
  const a = (q) => {
    var P;
    return (P = e.props[q].data.value) == null ? void 0 : P.value;
  }, s = E(""), o = E(""), l = E(!1), i = E(!1), u = E(Date.now() / 1e3), c = M(() => e.props["voice-profile"].loaded.value ? { profile: a("voice-profile"), avatar: a("voice-avatar"), avatar_shown: a("voice-avatar-shown") } : null), f = () => {
    var q;
    return !((q = c.value) != null && q.avatar) || c.value.avatar_shown === "never" || c.value.avatar_shown === "working" && !s.value ? "" : c.value.profile;
  }, m = M(() => {
    const q = t();
    return q === "voice" ? f() : q && q !== "none" ? q : "";
  }), p = M(() => !!m.value && !n()), b = E("");
  ce(m, (q) => {
    q && (b.value = q);
  }, { immediate: !0 });
  const $ = E(!1), y = E(!1);
  let w = 0;
  const { data: x, failure: C } = e.props.tool;
  return ce([x, C], () => {
    const q = C.value ? {} : x.value ?? {};
    ((q.tool ?? "") !== s.value || !!q.running !== $.value) && (clearTimeout(w), y.value = !!q.tool, q.tool && !q.running && (w = setTimeout(() => {
      y.value = !1;
    }, G8))), $.value = !!q.running, s.value = q.tool ?? "", o.value = q.wait_target ?? "", l.value = !!q.thinking, i.value = !!q.asking;
  }), u.value = Date.now() / 1e3, e.follow(["hook_call.*", "dock_item.*", "process_part.*"], Oa(() => {
    u.value = Date.now() / 1e3, e.reload("tool");
  }, Co.runningTool)), { figureVoice: m, figureHere: p, shownVoice: b, runningTool: s, waitingFor: o, thinking: l, asking: i, heardAt: u, toolRunning: $, commandShown: y };
}
const Xs = E(0), yI = M(() => Xs.value > 0);
function bI() {
  Xs.value += 1, Te(() => {
    Xs.value -= 1;
  });
}
const kn = (e) => typeof e == "number" ? e : Date.parse(e);
function kI(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: kn(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => kn(s.row.created_at) - kn(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const Jl = 20;
async function wI(e, t, n) {
  for (let a = 0; a < Jl; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || kn(o.created_at) <= kn(s.created_at) || !await n()) return a;
  }
  return Jl;
}
const K8 = 3, ys = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function Y8(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = ys[n.grouping]) == null ? void 0 : a.call(ys, e.row, n)) || "";
}
function Q8(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function $I(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= K8 ? [Q8(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = Y8(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
const xI = (e) => (t) => t.filter((n) => n.id !== e), SI = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), MI = (e) => (t) => [...t, e], _I = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function CI(e, t = {}) {
  const n = at(), a = E(null), s = E("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function EI(e) {
  const t = at(), n = E("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const aa = /* @__PURE__ */ new Map();
function X8(e, t) {
  if (aa.has(e)) return aa.get(e);
  const n = t().finally(() => aa.delete(e));
  return aa.set(e, n), n;
}
function AI() {
  const e = at(), t = E(null), n = E("");
  async function a() {
    const s = await X8(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const J8 = { class: "cards-page" }, Z8 = { class: "cards-bar" }, e3 = { class: "cards-count" }, t3 = { class: "cards" }, n3 = {
  key: 1,
  class: "cards-note"
}, a3 = {
  key: 2,
  class: "cards-note"
}, s3 = ["data-row", "onClick"], o3 = { class: "card-head" }, l3 = { class: "card-title" }, i3 = { class: "card-foot" }, r3 = {
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
    return (a, s) => (r(), d("div", J8, [
      h("div", Z8, [
        h("span", e3, v(e.rows.length) + " " + v(e.rows.length === 1 ? e.term : `${e.term}s`), 1),
        A(ie, Ne({
          small: "",
          bordered: ""
        }, { [`data-${e.term}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: N(() => [
            A(se, {
              name: "plus",
              size: 12
            }),
            z(" New " + v(e.term), 1)
          ]),
          _: 1
        }, 16)
      ]),
      h("div", t3, [
        e.loaded ? e.failure ? (r(), d("p", n3, v(e.failure), 1)) : e.rows.length ? k("", !0) : (r(), d("p", a3, "No " + v(e.term) + "s yet", 1)) : (r(), j(nt, {
          key: 0,
          shape: "cards"
        })),
        (r(!0), d(B, null, Z(e.rows, (o) => (r(), d("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          h("span", o3, [
            A(se, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            z(" " + v(e.head(o)), 1),
            A(Ye, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          h("span", l3, v(e.title(o)), 1),
          h("span", i3, v(e.foot(o)), 1)
        ], 8, s3))), 128))
      ]),
      ne(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, OI = /* @__PURE__ */ V(r3, [["__scopeId", "data-v-b39fea5d"]]), Zl = "newest";
function TI(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = $e(Be, null)) == null ? void 0 : c.search, s = E(""), o = E(Zl), l = E("all"), i = M(() => {
    const f = s.value.trim().toLowerCase(), m = e.value.filter((p) => Nr(p, f, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(p) === (l.value === "open")));
    return o.value === Zl ? m : [...m].sort((p, b) => t(p).localeCompare(t(b)));
  }), u = M(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: u, hasStates: !!n };
}
const u3 = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, c3 = {
  class: "auto-scroll-newest-line",
  "data-scroll-newest-line": ""
}, d3 = 40, f3 = "top", m3 = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" }, feed: { type: Object, default: null } },
  setup(e, { expose: t }) {
    var p;
    const n = e, a = (p = $e(Be, null)) == null ? void 0 : p.autoScroll, s = M(() => a === f3), o = E(null), l = E(!1), i = (b) => s.value ? b.scrollTop : b.scrollHeight - b.scrollTop - b.clientHeight, u = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: u(), behavior: "smooth" });
    function f() {
      var b;
      l.value = i(o.value) >= d3, s.value || (b = n.feed) == null || b.reachTop(o.value);
    }
    ce(() => {
      var b;
      return [n.rowCount, (b = n.feed) == null ? void 0 : b.isLoaded()];
    }, async () => {
      await Re(), o.value && (l.value || (o.value.scrollTop = u()), n.feed && !s.value && (n.feed.drawn(o.value), await n.feed.fill(o.value)));
    }, { immediate: !0, flush: "post" });
    let m = null;
    return _e(() => {
      typeof MutationObserver > "u" || (m = new MutationObserver(() => {
        !l.value && o.value && (o.value.scrollTop = u());
      }), m.observe(o.value, { childList: !0, subtree: !0, attributes: !0, characterData: !0 }));
    }), tt(() => m == null ? void 0 : m.disconnect()), t({ pane: o }), (b, $) => (r(), d("div", u3, [
      h("div", {
        ref_key: "pane",
        ref: o,
        class: X(["auto-scroll-pane", e.paneClass]),
        onScroll: f
      }, [
        ne(b.$slots, "default", {}, void 0, !0)
      ], 34),
      h("div", c3, [
        A(nn, {
          name: "auto-scroll-rise",
          persisted: ""
        }, {
          default: N(() => [
            ge(h("button", {
              type: "button",
              class: "auto-scroll-newest",
              "data-scroll-newest": "",
              title: "Back to the newest",
              onClick: c
            }, [
              A(se, {
                name: s.value ? "up" : "down"
              }, null, 8, ["name"]),
              $[0] || ($[0] = z(" Newest ", -1))
            ], 512), [
              [ao, l.value]
            ])
          ]),
          _: 1
        })
      ])
    ]));
  }
}, II = /* @__PURE__ */ V(m3, [["__scopeId", "data-v-d704d7e3"]]), h3 = ["aria-selected", "data-tab", "onClick"], p3 = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, v3 = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = $e(Be, null), o = M(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = E(null), i = E({ left: 0, width: 0, slides: !1 }), u = (p) => n.answer[p.count_field] !== void 0;
    function c(p) {
      var $;
      const b = ($ = l.value) == null ? void 0 : $.querySelector(".inner-tab.on");
      if (!b) return void (i.value = { left: 0, width: 0, slides: !1 });
      i.value = { left: b.offsetLeft, width: b.offsetWidth, slides: p }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, b.offsetLeft - 12));
    }
    const f = () => Re(() => c(!0));
    let m = null;
    return _e(() => {
      var p;
      c(!1), m = new ResizeObserver(() => c(!1)), m.observe(l.value), (p = document.fonts) == null || p.ready.then(() => c(!1));
    }), Te(() => m == null ? void 0 : m.disconnect()), ce(() => {
      var p;
      return (p = n.active) == null ? void 0 : p.key;
    }, f), ce(() => n.answer, f, { deep: !0 }), (p, b) => (r(), d("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (r(!0), d(B, null, Z(o.value, ($) => {
        var y, w;
        return r(), d("button", {
          key: $.key,
          type: "button",
          role: "tab",
          class: X(["inner-tab", { on: ((y = e.active) == null ? void 0 : y.key) === $.key }]),
          "aria-selected": ((w = e.active) == null ? void 0 : w.key) === $.key,
          "data-tab": $.key,
          onClick: (x) => a("choose", $)
        }, [
          z(v($.label) + " ", 1),
          u($) ? (r(), d("span", p3, v(e.answer[$.count_field]), 1)) : k("", !0)
        ], 10, h3);
      }), 128)),
      h("i", {
        class: X(["inner-tabs-line", { slides: i.value.slides }]),
        style: pe({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, g3 = /* @__PURE__ */ V(v3, [["__scopeId", "data-v-63fcd326"]]), y3 = { class: "task-bar" }, b3 = {
  __name: "TaskBar",
  props: { total: { type: Number, required: !0 }, done: { type: Number, required: !0 }, testing: { type: Number, required: !0 }, started: { type: Number, default: 0 } },
  setup(e) {
    const t = e, n = (a) => t.total ? Math.round(a / t.total * 100) : 0;
    return (a, s) => (r(), d("span", y3, [
      h("span", {
        class: "task-bar-fill",
        "data-task-bar-done": "",
        style: pe({ width: `${n(e.done)}%` })
      }, null, 4),
      h("span", {
        class: "task-bar-testing",
        "data-task-bar-testing": "",
        style: pe({ width: `${n(e.testing)}%` })
      }, null, 4),
      h("span", {
        class: "task-bar-started",
        "data-task-bar-started": "",
        style: pe({ width: `${n(e.started)}%` })
      }, null, 4)
    ]));
  }
}, BI = /* @__PURE__ */ V(b3, [["__scopeId", "data-v-eafa73d4"]]), k3 = {
  class: "tab-body",
  "data-tab-body": ""
}, w3 = { "data-tab-content": "" }, $3 = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = E(!1);
    let a = 0;
    return ce(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, so(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (r(), d("div", k3, [
      n.value ? (r(), j(nt, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : k("", !0),
      ge(h("div", w3, [
        ne(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [ao, !n.value]
      ])
    ]));
  }
}, x3 = /* @__PURE__ */ V($3, [["__scopeId", "data-v-63876533"]]), S3 = {
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
    return (o, l) => (r(), j(Fr, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (i) => n("pick", i))
    }, {
      menu: N(() => [
        A($t, null, {
          default: N(() => [...l[2] || (l[2] = [
            z("Order", -1)
          ])]),
          _: 1
        }),
        (r(), d(B, null, Z(a, (i) => A(We, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (u) => e.tools.order.value = i.key
        }, {
          default: N(() => [
            z(v(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (r(), d(B, { key: 0 }, [
          A($t, null, {
            default: N(() => [...l[3] || (l[3] = [
              z("Show", -1)
            ])]),
            _: 1
          }),
          (r(), d(B, null, Z(s, (i) => A(We, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (u) => e.tools.state.value = i.key
          }, {
            default: N(() => [
              z(v(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : k("", !0)
      ]),
      default: N(() => [
        ne(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, RI = /* @__PURE__ */ V(S3, [["__scopeId", "data-v-dab0064d"]]);
function LI() {
  const e = E(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const NI = (e) => import(
  /* @vite-ignore */
  e
), M3 = 86400, Js = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function _3(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((Js(t) - Js(e)) / M3);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function qI(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = Js(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: _3(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const bs = 280, ks = 240, ws = 120, C3 = 6, E3 = 14, Tn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function A3(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function Iu(e, t) {
  const n = Math.max(0, A3(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function O3(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${E3}px)` }), e.offsetHeight, e.style.transition = `height ${bs}ms ${Tn}`, e.style.height = `${l}px`;
  const i = s();
  let u = !1, c = !1;
  const f = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, m = () => {
    if (c) return;
    n() && (t.scrollTop = Iu(t, e));
    const p = s() - i;
    if (!u && p >= bs && (u = !0, e.style.transition = `opacity ${ks}ms ease-out, transform ${ks}ms ${Tn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < bs + ks) return a(m);
    f();
  };
  return a(m), f;
}
function DI(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${C3}px)` }), e.offsetHeight, e.style.transition = `opacity ${ws}ms ease-out, transform ${ws}ms ${Tn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = Iu(t, e)), s() - l < ws) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const T3 = 140, sa = 220, ei = 5;
function PI({ gap: e = T3, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function i(f, m) {
    a.add(f), f.cancel = f.arrival(f.el, f.options, () => {
      a.delete(f), f.done(), m();
    });
  }
  function u() {
    const f = n.splice(0, ei);
    if (s = f.length > 0, !s) return;
    let m = f.length;
    for (const p of f)
      p.el.style.display = p.display, i(p, () => {
        m -= 1, m || (o = t(u, e));
      });
  }
  const c = (f, m, p, b = O3) => {
    if (l || !m.pane || !m.follows()) return p();
    const $ = { el: f, options: m, done: p, arrival: b, display: f.style.display || "" };
    if (!s)
      return s = !0, i($, () => o = t(u, e));
    f.style.display = "none", n.push($), n.length >= ei && c.flush();
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
function jI(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${sa}ms ${Tn}, opacity ${sa}ms ease-in, margin ${sa}ms ${Tn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, sa);
}
const Bu = "chat.pins.minimised", ca = E(fa(Bu, !1));
function ti(e) {
  ca.value = e, yo(Bu, e);
}
function I3(e) {
  const t = M(() => e()), n = M(() => ca.value ? [] : e()), a = () => ti(!ca.value), s = Date.now() / 1e3;
  return ce(
    () => t.value.filter((o) => Pt(o) > s).length,
    (o, l) => o > l && ti(!1)
  ), { pins: t, visible: n, minimised: ca, toggle: a };
}
const B3 = ["title"], R3 = {
  key: 0,
  class: "pins-count"
}, L3 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = I3(() => t.pinRows);
    return (o, l) => O(n).length ? (r(), d("button", {
      key: 0,
      type: "button",
      class: X(["pins-toggle", { minimised: O(a), inline: e.inline }]),
      title: O(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = he((...i) => O(s) && O(s)(...i), ["stop"]))
    }, [
      A(se, {
        name: O(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      O(a) ? (r(), d("span", R3, v(O(n).length), 1)) : k("", !0)
    ], 10, B3)) : k("", !0);
  }
}, FI = /* @__PURE__ */ V(L3, [["__scopeId", "data-v-d073c504"]]), N3 = ["title"], q3 = ["title"], D3 = { class: "diff-card-dir" }, P3 = { class: "diff-card-name" }, j3 = {
  key: 1,
  class: "diff-card-from",
  "data-diff-card-from": ""
}, F3 = ["title"], W3 = ["title"], H3 = {
  key: 0,
  class: "diff-card-note"
}, z3 = ["href"], U3 = ["src", "alt"], V3 = { class: "diff-card-rows" }, G3 = { class: "diff-row-num" }, K3 = { class: "diff-row-sign" }, Y3 = { class: "diff-row-code" }, Q3 = {
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
    function o(_) {
      (_.metaKey || _.ctrlKey) && (_.stopPropagation(), a("open", n.path));
    }
    const l = () => ({
      head: n.path,
      items: [
        { label: "Open file", group: "open", disabled: p.value, reason: "Deleted", run: () => location.hash = Ba.file(n.path) },
        { label: n.folded ? "Unfold" : "Fold", group: "open", disabled: p.value, reason: "Deleted", run: () => a("fold") },
        { label: "Copy path", group: "copy", run: ({ say: _ }) => jt(n.path, "the path", _) }
      ]
    }), i = { new: "created", deleted: "deleted", moved: "moved" }, u = { add: "+", del: "−" }, c = M(() => n.path.lastIndexOf("/") + 1), f = M(() => n.path.slice(0, c.value)), m = M(() => n.path.slice(c.value)), p = M(() => n.change === "deleted"), b = M(() => i[n.change]), $ = M(() => new Set(n.rows.filter((_) => _.line_type === "add").map((_) => _.line))), y = E("after"), w = M(() => y.value === "before" ? n.whole.old : n.whole.text), x = M(() => n.whole && n.whole.text !== void 0 ? w.value.split(`
`).map((_, g) => ({ line_type: y.value === "after" && $.value.has(g + 1) ? "add" : "ctx", line: g + 1, text: _ })) : n.rows.filter(
      (_) => !(n.editsOnly && ["ctx", "fold"].includes(_.line_type)) && !(n.hideRemovals && _.line_type === "del")
    )), C = E(!1), q = M(() => n.lines && !C.value && !n.whole), P = M(() => q.value ? x.value.slice(0, n.lines) : x.value), I = M(() => x.value.length - P.value.length), Q = (_) => _.line === null || _.line_type === "del" ? "" : _.line, W = (_) => _.line_type === "fold" ? _.hidden ? `⋯ ${_.hidden} lines` : "⋯" : _.text, R = E(null), D = E(null);
    let G = null;
    return _e(() => {
      if (!D.value) return;
      let _ = !0;
      G = new ResizeObserver(() => {
        !R.value || !D.value || (R.value.style.transition = _ ? "none" : "", R.value.style.height = `${D.value.offsetHeight}px`, _ = !1);
      }), G.observe(D.value);
    }), Te(() => G && G.disconnect()), (_, g) => (r(), d("section", {
      class: X(["diff-card", { half: e.half, gone: p.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      ge((r(), d("header", {
        class: "diff-card-head",
        title: p.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: g[3] || (g[3] = (S) => !p.value && a("fold"))
      }, [
        h("span", {
          class: "diff-card-path",
          title: `${e.path} · ${O(s)}-click to open it`,
          onClick: o
        }, [
          h("span", D3, v(f.value), 1),
          h("span", P3, v(m.value), 1),
          b.value ? (r(), d("span", {
            key: 0,
            class: X(["diff-card-badge", e.change])
          }, v(b.value), 3)) : k("", !0),
          e.from ? (r(), d("span", j3, "from " + v(e.from), 1)) : k("", !0)
        ], 8, q3),
        h("span", {
          class: X(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + v(e.added), 3),
        h("span", {
          class: X(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + v(e.removed), 3),
        A(Ye, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        h("button", {
          type: "button",
          class: "diff-card-open",
          title: "Open in the inspector",
          "aria-label": "Open in the inspector",
          "data-diff-open": "",
          onClick: g[0] || (g[0] = he((S) => O(Jm)(e.path), ["stop"]))
        }, [
          A(se, {
            name: "open",
            size: 13
          })
        ]),
        e.whole && e.whole.old !== void 0 ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: y.value === "after" ? "Show the file before" : "Show the file after",
          onClick: g[1] || (g[1] = he((S) => y.value = y.value === "after" ? "before" : "after", ["stop"]))
        }, v(y.value === "after" ? "After" : "Before"), 9, F3)) : k("", !0),
        p.value ? k("", !0) : (r(), d("button", {
          key: 1,
          type: "button",
          class: X(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: g[2] || (g[2] = he((S) => a("whole"), ["stop"]))
        }, [
          A(se, {
            name: "file",
            size: 12
          })
        ], 10, W3))
      ], 8, N3)), [
        [O(Et), l]
      ]),
      e.whole && e.whole.error ? (r(), d("p", H3, v(e.whole.error), 1)) : k("", !0),
      !p.value && !e.folded ? (r(), d(B, { key: 1 }, [
        e.picture ? (r(), d("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          h("img", {
            src: e.picture,
            alt: m.value,
            loading: "lazy"
          }, null, 8, U3)
        ], 8, z3)) : (r(), d("div", {
          key: 1,
          ref_key: "grow",
          ref: R,
          class: "diff-card-grow"
        }, [
          h("div", {
            ref_key: "body",
            ref: D,
            class: "diff-card-diff"
          }, [
            h("div", V3, [
              (r(!0), d(B, null, Z(P.value, (S, T) => (r(), d("div", {
                key: T,
                class: X(["diff-row", S.line_type, { fresh: e.fresh && S.edit === e.fresh }])
              }, [
                h("span", G3, v(Q(S)), 1),
                h("span", K3, v(u[S.line_type]), 1),
                h("span", Y3, v(W(S)), 1)
              ], 2))), 128)),
              I.value > 0 ? (r(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: g[4] || (g[4] = he((S) => C.value = !0, ["stop"]))
              }, v(I.value) + " more " + v(I.value === 1 ? "line" : "lines"), 1)) : k("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : k("", !0)
    ], 2));
  }
}, WI = /* @__PURE__ */ V(Q3, [["__scopeId", "data-v-543e1e74"]]), X3 = {
  instant: "Hooks, journal commands and viewer requests. Each takes 1 slot.",
  short: "Reads, searches, edits and git. Each takes 1 slot.",
  long: "Tests, builds, checks, installs and plugins. A test, a build or a check takes 4 slots, an install 2."
}, J3 = { "test run": "test", "version control": "git", package: "install", "background job": "job" }, Ru = (e) => `${e[0].toUpperCase()}${e.slice(1)}`, Lu = (e) => `${Ru(e.lane)} lane`, Nu = (e) => J3[e] || e.split(" ").at(-1), Zs = (e) => e === 0 ? "no slot" : e === 1 ? "1 slot" : `${e} slots`, hn = (e) => e.halt_type === "command", Z3 = {
  class: "tiles",
  "data-queue-controls": ""
}, eS = ["data-queue-tile", "onClick"], tS = {
  key: 0,
  class: "chip"
}, nS = {
  key: 1,
  class: "chip"
}, aS = { "data-queue-tile-use": "" }, sS = {
  __name: "ProcessQueueControls",
  props: { lanes: { type: Array, required: !0 } },
  setup(e) {
    function t(n, a) {
      n.currentTarget.closest("[data-test-queue]").querySelector(`[data-lane="${a.lane}"]`).scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
    return (n, a) => (r(), d("div", Z3, [
      (r(!0), d(B, null, Z(e.lanes, (s) => (r(), d("button", {
        key: s.lane,
        type: "button",
        class: "tile",
        "data-queue-tile": s.lane,
        onClick: (o) => t(o, s)
      }, [
        h("small", null, [
          z(v(O(Ru)(s.lane)), 1),
          O(hn)(s) ? (r(), d("span", tS, "Paused")) : s.halted ? (r(), d("span", nS, "Held")) : k("", !0)
        ]),
        h("b", aS, [
          z(v(s.used), 1),
          h("span", null, " of " + v(s.capacity), 1)
        ]),
        h("span", {
          class: X(["meter", { warn: s.halted, bad: !s.halted && s.over_capacity }])
        }, [
          h("i", {
            style: pe({ width: `${Math.min(100, s.used / s.capacity * 100)}%` })
          }, null, 4)
        ], 2),
        h("span", {
          class: X(["sub", { on: s.waiting.length }]),
          "data-queue-tile-waiting": ""
        }, v(s.waiting.length ? `${s.waiting.length} waiting` : "Nothing waits"), 3)
      ], 8, eS))), 128))
    ]));
  }
}, oS = /* @__PURE__ */ V(sS, [["__scopeId", "data-v-b55ad746"]]), lS = ["data-queue-row", "data-queue-process"], iS = ["aria-expanded"], rS = { class: "run-line" }, uS = { class: "leading" }, cS = {
  key: 0,
  "data-queue-position": ""
}, dS = ["title"], fS = { class: "command" }, mS = {
  class: "time",
  "data-queue-time": ""
}, hS = { class: "details" }, pS = { "data-queue-lane": "" }, vS = { "data-queue-type": "" }, gS = { class: "failed" }, yS = { class: "drop-inner" }, bS = { class: "output" }, kS = { class: "output-heading" }, wS = ["title"], $S = ["title"], xS = ["href"], SS = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(), o = Ur((y) => n.read([...y, "--limit", "50"]), () => n.run.id), l = o.lines, i = Ao(), u = M(() => n.run.plugin ? `Plugin ${n.run.plugin}` : { test: "Test run", build: "Build", check: "Check", install: "Install" }[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = M(() => {
      const y = n.run.section === "waiting" ? n.run.created_at : n.run.started_at;
      if (!y) return "";
      const w = n.run.ended_at ? new Date(n.run.ended_at).getTime() : i.value * 1e3, x = Math.max(0, Math.floor((w - new Date(y).getTime()) / 1e3));
      return x < 60 ? `${x} s` : x < 3600 ? `${Math.floor(x / 60)} m ${x % 60} s` : `${Math.floor(x / 3600)} h ${String(Math.floor(x / 60) % 60).padStart(2, "0")} m`;
    }), f = M(() => n.run.section === "waiting" || !n.run.started_at ? "" : on(n.run.started_at, i.value * 1e3)), m = M(() => n.run.section === "waiting" ? "Waiting for" : n.run.ended_at ? "Ran for" : "Running for");
    async function p() {
      if (!n.expanded) return;
      const y = s.value, w = y.scrollHeight - y.scrollTop - y.clientHeight < 2;
      await o.follow(), await Re(), n.expanded && w && (y.scrollTop = y.scrollHeight);
    }
    async function b() {
      n.expanded && (await o.newest(), await Re(), n.expanded && (s.value.scrollTop = s.value.scrollHeight, o.feed.drawn(s.value)));
    }
    const $ = () => ({
      head: Mn(n.run.line, 40),
      items: [
        { label: n.expanded ? "Hide output" : "Show output", group: "open", run: () => a("toggle") },
        { label: "Copy command", group: "copy", run: ({ say: y }) => jt(n.run.line, "the command", y) },
        { label: "Open its task", group: "copy", disabled: !n.run.task_id, reason: "No task", run: () => Ze("tasks", n.run.task_id) }
      ]
    });
    return ce(() => n.expanded, b, { immediate: !0 }), qn(["output.*"], p, (y) => $i(y, /* @__PURE__ */ new Set([n.run.id]))), (y, w) => ge((r(), d("div", {
      class: "run",
      "data-queue-row": e.run.section,
      "data-queue-process": e.run.id
    }, [
      h("div", {
        class: "toggle",
        role: "button",
        tabindex: "0",
        "aria-expanded": e.expanded,
        onClick: w[2] || (w[2] = (x) => a("toggle")),
        onKeydown: [
          w[3] || (w[3] = ze(he((x) => a("toggle"), ["prevent"]), ["enter"])),
          w[4] || (w[4] = ze(he((x) => a("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        h("div", rS, [
          h("span", uS, [
            e.run.section === "waiting" ? (r(), d("span", cS, v(e.position), 1)) : (r(), d("span", {
              key: 1,
              class: X(["dot", { passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, dS))
          ]),
          h("code", fS, v(e.run.line), 1),
          h("span", mS, v(c.value), 1),
          A(se, {
            class: X(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        h("div", hS, [
          e.run.lane ? (r(), d(B, { key: 0 }, [
            h("span", pS, v(O(Lu)(e.run)), 1),
            w[6] || (w[6] = h("span", { class: "separator" }, "·", -1))
          ], 64)) : k("", !0),
          h("span", vS, v(u.value), 1),
          e.run.owner_agent_id ? (r(), d(B, { key: 1 }, [
            w[7] || (w[7] = h("span", { class: "separator" }, "·", -1)),
            h("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: w[0] || (w[0] = he((x) => O(Ze)("agents", e.run.owner_agent_id), ["stop"]))
            }, "Agent " + v(e.run.owner_agent_id), 1)
          ], 64)) : e.run.is_main ? (r(), d(B, { key: 2 }, [
            w[8] || (w[8] = h("span", { class: "separator" }, "·", -1)),
            w[9] || (w[9] = h("span", null, "Main agent", -1))
          ], 64)) : k("", !0),
          e.run.task_id ? (r(), d(B, { key: 3 }, [
            w[10] || (w[10] = h("span", { class: "separator" }, "·", -1)),
            h("button", {
              type: "button",
              class: "link",
              "data-queue-task": "",
              onClick: w[1] || (w[1] = he((x) => O(Ze)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + v(e.run.task_id), 1)
          ], 64)) : k("", !0),
          e.run.state === "failed" ? (r(), d(B, { key: 4 }, [
            w[11] || (w[11] = h("span", { class: "separator" }, "·", -1)),
            h("span", gS, "Failed, exit " + v(e.run.exit_code), 1)
          ], 64)) : k("", !0)
        ])
      ], 40, iS),
      h("div", {
        class: X(["drop", { open: e.expanded }])
      }, [
        h("div", yS, [
          h("div", bS, [
            h("div", kS, [
              h("span", null, [
                z("Output " + v(e.run.id), 1),
                e.run.task_id ? (r(), d(B, { key: 0 }, [
                  z(" · Task " + v(e.run.task_id), 1)
                ], 64)) : k("", !0),
                f.value ? (r(), d(B, { key: 1 }, [
                  w[12] || (w[12] = z(" · ", -1)),
                  h("span", {
                    class: "started",
                    "data-queue-started": "",
                    title: O(Ds)(e.run.started_at)
                  }, "Started " + v(f.value), 9, wS)
                ], 64)) : k("", !0),
                c.value ? (r(), d(B, { key: 2 }, [
                  w[13] || (w[13] = z(" · ", -1)),
                  h("span", {
                    title: m.value,
                    "data-queue-duration": ""
                  }, v(c.value), 9, $S)
                ], 64)) : k("", !0)
              ]),
              h("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, xS)
            ]),
            h("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: w[5] || (w[5] = (x) => e.expanded && O(o).loadEarlier(x.target))
            }, [
              w[14] || (w[14] = h("span", { class: "prompt" }, "$ ", -1)),
              z(v(e.run.line), 1),
              O(l).length ? (r(), d(B, { key: 0 }, [
                z(v(`
` + O(l).join(`
`)), 1)
              ], 64)) : k("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, lS)), [
      [O(Et), $]
    ]);
  }
}, MS = /* @__PURE__ */ V(SS, [["__scopeId", "data-v-f528b4c6"]]), qu = ["instant", "short", "long"], Du = ["background", "normal", "agent", "reserved", "immediate"], _S = [
  { name: "small", title: "Small machine" },
  { name: "medium", title: "Medium machine" },
  { name: "large", title: "Large machine" }
];
function Pu(e) {
  return ["--lane", e.lane, "--cost", String(e.cost), "--priority", e.priority, "--limit", String(e.limit)];
}
const CS = ["data-class-row"], ES = { scope: "row" }, AS = { key: 0 }, OS = ["value"], TS = ["value"], IS = { class: "actions" }, BS = ["disabled"], RS = ["disabled"], LS = { class: "actions" }, NS = ["disabled"], qS = ["disabled"], DS = ["disabled"], PS = {
  __name: "ExecutionClassRow",
  props: { entry: { type: Object, required: !0 }, saving: Boolean },
  emits: ["send"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(!1), o = E({}), l = { "built-in": "Built in", changed: "Changed", "your own": "Your own" };
    function i() {
      o.value = { ...n.entry }, s.value = !0;
    }
    function u() {
      a("send", ["queue-class", "set", n.entry.name, ...Pu(o.value)], () => s.value = !1);
    }
    return (c, f) => (r(), d("tr", {
      "data-class-row": e.entry.name
    }, [
      h("th", ES, [
        z(v(e.entry.name), 1),
        e.entry.pattern || e.entry.plugin ? (r(), d("small", AS, v(e.entry.pattern || `plugin ${e.entry.plugin}`), 1)) : k("", !0)
      ]),
      s.value ? (r(), d(B, { key: 0 }, [
        h("td", null, [
          ge(h("select", {
            "onUpdate:modelValue": f[0] || (f[0] = (m) => o.value.lane = m),
            "aria-label": "Lane",
            "data-class-lane": ""
          }, [
            (r(!0), d(B, null, Z(O(qu), (m) => (r(), d("option", {
              key: m,
              value: m
            }, v(m), 9, OS))), 128))
          ], 512), [
            [Dt, o.value.lane]
          ])
        ]),
        h("td", null, [
          ge(h("input", {
            "onUpdate:modelValue": f[1] || (f[1] = (m) => o.value.cost = m),
            type: "number",
            min: "0",
            "aria-label": "Slots",
            "data-class-cost": ""
          }, null, 512), [
            [
              Fe,
              o.value.cost,
              void 0,
              { number: !0 }
            ]
          ])
        ]),
        h("td", null, [
          ge(h("select", {
            "onUpdate:modelValue": f[2] || (f[2] = (m) => o.value.priority = m),
            "aria-label": "Priority",
            "data-class-priority": ""
          }, [
            (r(!0), d(B, null, Z(O(Du), (m) => (r(), d("option", {
              key: m,
              value: m
            }, v(m), 9, TS))), 128))
          ], 512), [
            [Dt, o.value.priority]
          ])
        ]),
        h("td", null, [
          ge(h("input", {
            "onUpdate:modelValue": f[3] || (f[3] = (m) => o.value.limit = m),
            type: "number",
            min: "0",
            "aria-label": "At once, 0 for no limit",
            "data-class-limit": ""
          }, null, 512), [
            [
              Fe,
              o.value.limit,
              void 0,
              { number: !0 }
            ]
          ])
        ]),
        h("td", IS, [
          h("button", {
            type: "button",
            disabled: e.saving,
            "data-class-save": "",
            onClick: u
          }, "Save", 8, BS),
          h("button", {
            type: "button",
            disabled: e.saving,
            onClick: f[4] || (f[4] = (m) => s.value = !1)
          }, "Cancel", 8, RS)
        ])
      ], 64)) : (r(), d(B, { key: 1 }, [
        h("td", null, v(e.entry.lane), 1),
        h("td", null, v(e.entry.cost), 1),
        h("td", null, v(e.entry.priority), 1),
        h("td", null, v(e.entry.limit || "no limit"), 1),
        h("td", LS, [
          h("span", {
            class: X(["origin", { own: e.entry.origin !== "built-in" }])
          }, v(l[e.entry.origin]), 3),
          h("button", {
            type: "button",
            disabled: e.saving,
            "data-class-edit": "",
            onClick: i
          }, "Edit", 8, NS),
          e.entry.origin === "changed" ? (r(), d("button", {
            key: 0,
            type: "button",
            disabled: e.saving,
            "data-class-reset": "",
            onClick: f[5] || (f[5] = (m) => a("send", ["queue-class", "reset", e.entry.name]))
          }, "Reset", 8, qS)) : k("", !0),
          e.entry.origin === "your own" ? (r(), d("button", {
            key: 1,
            type: "button",
            disabled: e.saving,
            "data-class-remove": "",
            onClick: f[6] || (f[6] = (m) => a("send", ["queue-class", "remove", e.entry.name]))
          }, "Remove", 8, DS)) : k("", !0)
        ])
      ], 64))
    ], 8, CS));
  }
}, jS = /* @__PURE__ */ V(PS, [["__scopeId", "data-v-20ea89e6"]]), FS = { class: "fields" }, WS = ["disabled"], HS = ["disabled"], zS = ["value"], US = ["value"], VS = { class: "buttons" }, GS = ["disabled"], KS = ["disabled"], YS = {
  key: 0,
  class: "preview",
  "data-class-preview-lines": ""
}, QS = { key: 1 }, XS = {
  key: 1,
  class: "hint"
}, JS = {
  key: 2,
  class: "failure",
  role: "alert"
}, ZS = {
  __name: "ExecutionClassForm",
  props: { read: { type: Function, required: !0 }, saving: Boolean },
  emits: ["send"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E({ name: "", pattern: "", plugin: "", lane: "long", cost: 1, priority: "normal", limit: 0 }), o = E(null), l = E(""), i = M(() => s.value.pattern ? ["--pattern", s.value.pattern] : s.value.plugin ? ["--plugin", s.value.plugin] : []);
    ce(() => [s.value.pattern, s.value.plugin], () => o.value = null);
    async function u() {
      const f = await n.read(["queue-class", "preview", ...i.value]);
      l.value = f.ok ? "" : f.error, o.value = f.ok ? f.value.lines : null;
    }
    function c() {
      a("send", ["queue-class", "add", s.value.name, ...i.value, ...Pu(s.value)], () => {
        s.value = { ...s.value, name: "", pattern: "", plugin: "" };
      });
    }
    return (f, m) => (r(), d("form", {
      class: "add",
      "data-class-form": "",
      onSubmit: he(c, ["prevent"])
    }, [
      h("div", FS, [
        h("label", null, [
          m[7] || (m[7] = z("Name", -1)),
          ge(h("input", {
            "onUpdate:modelValue": m[0] || (m[0] = (p) => s.value.name = p),
            required: "",
            "data-class-name": ""
          }, null, 512), [
            [
              Fe,
              s.value.name,
              void 0,
              { trim: !0 }
            ]
          ])
        ]),
        h("label", null, [
          m[8] || (m[8] = z("Line pattern", -1)),
          ge(h("input", {
            "onUpdate:modelValue": m[1] || (m[1] = (p) => s.value.pattern = p),
            placeholder: "for example ^npm run e2e",
            disabled: !!s.value.plugin,
            "data-class-pattern": ""
          }, null, 8, WS), [
            [Fe, s.value.pattern]
          ])
        ]),
        h("label", null, [
          m[9] || (m[9] = z("Or plugin", -1)),
          ge(h("input", {
            "onUpdate:modelValue": m[2] || (m[2] = (p) => s.value.plugin = p),
            disabled: !!s.value.pattern,
            "data-class-plugin": ""
          }, null, 8, HS), [
            [
              Fe,
              s.value.plugin,
              void 0,
              { trim: !0 }
            ]
          ])
        ]),
        h("label", null, [
          m[10] || (m[10] = z("Lane", -1)),
          ge(h("select", {
            "onUpdate:modelValue": m[3] || (m[3] = (p) => s.value.lane = p)
          }, [
            (r(!0), d(B, null, Z(O(qu), (p) => (r(), d("option", {
              key: p,
              value: p
            }, v(p), 9, zS))), 128))
          ], 512), [
            [Dt, s.value.lane]
          ])
        ]),
        h("label", null, [
          m[11] || (m[11] = z("Slots", -1)),
          ge(h("input", {
            "onUpdate:modelValue": m[4] || (m[4] = (p) => s.value.cost = p),
            type: "number",
            min: "0"
          }, null, 512), [
            [
              Fe,
              s.value.cost,
              void 0,
              { number: !0 }
            ]
          ])
        ]),
        h("label", null, [
          m[12] || (m[12] = z("Priority", -1)),
          ge(h("select", {
            "onUpdate:modelValue": m[5] || (m[5] = (p) => s.value.priority = p)
          }, [
            (r(!0), d(B, null, Z(O(Du), (p) => (r(), d("option", {
              key: p,
              value: p
            }, v(p), 9, US))), 128))
          ], 512), [
            [Dt, s.value.priority]
          ])
        ]),
        h("label", null, [
          m[13] || (m[13] = z("At once", -1)),
          ge(h("input", {
            "onUpdate:modelValue": m[6] || (m[6] = (p) => s.value.limit = p),
            type: "number",
            min: "0",
            title: "0 for no limit"
          }, null, 512), [
            [
              Fe,
              s.value.limit,
              void 0,
              { number: !0 }
            ]
          ])
        ])
      ]),
      h("div", VS, [
        h("button", {
          type: "button",
          disabled: !i.value.length,
          "data-class-preview": "",
          onClick: u
        }, "Show matching lines", 8, GS),
        h("button", {
          type: "submit",
          disabled: e.saving || o.value === null || !s.value.name,
          "data-class-add": ""
        }, "Add class", 8, KS)
      ]),
      o.value !== null ? (r(), d("div", YS, [
        o.value.length ? (r(), d(B, { key: 0 }, [
          h("p", null, v(o.value.length) + " recent lines would have matched:", 1),
          (r(!0), d(B, null, Z(o.value, (p) => (r(), d("code", { key: p }, v(p), 1))), 128))
        ], 64)) : (r(), d("p", QS, "No recent line would have matched."))
      ])) : i.value.length ? (r(), d("p", XS, "See which recent lines the class would match before you add it.")) : k("", !0),
      l.value ? (r(), d("p", JS, v(l.value), 1)) : k("", !0)
    ], 32));
  }
}, e6 = /* @__PURE__ */ V(ZS, [["__scopeId", "data-v-6e42f7c8"]]), t6 = { "data-execution-classes": "" }, n6 = ["id"], a6 = ["aria-labelledby"], s6 = ["disabled", "onClick"], o6 = ["data-lane-setting"], l6 = ["disabled", "onClick"], i6 = { class: "control presets" }, r6 = ["disabled", "data-class-preset", "onClick"], u6 = { class: "scroll" }, c6 = { "data-class-table": "" }, d6 = {
  key: 1,
  class: "failure",
  role: "alert",
  "data-class-failure": ""
}, f6 = {
  __name: "ExecutionClasses",
  props: { read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = E(null), a = E(""), s = E(!1);
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
    return _e(o), (i, u) => (r(), d("section", t6, [
      A(_t, { icon: "gauge" }, {
        default: N(() => [...u[0] || (u[0] = [
          z("Execution classes", -1)
        ])]),
        _: 1
      }),
      u[3] || (u[3] = h("p", { class: "lead" }, "Each run the journal starts belongs to a class, which says its lane, how many slots it takes and its priority.", -1)),
      n.value ? (r(), d(B, { key: 0 }, [
        (r(!0), d(B, null, Z(n.value.settings, (c) => (r(), d("div", {
          key: c.key,
          class: "control"
        }, [
          h("div", null, [
            h("label", {
              id: c.key
            }, v(c.title), 9, n6),
            h("p", null, v(c.description), 1)
          ]),
          h("div", {
            class: "stepper",
            role: "group",
            "aria-labelledby": c.key
          }, [
            h("button", {
              type: "button",
              "aria-label": "One fewer",
              disabled: s.value || c.value <= 1,
              onClick: (f) => l(["setting", "set", c.key, String(c.value - 1)])
            }, "−", 8, s6),
            h("output", {
              "data-lane-setting": c.key
            }, v(c.value), 9, o6),
            h("button", {
              type: "button",
              "aria-label": "One more",
              disabled: s.value,
              onClick: (f) => l(["setting", "set", c.key, String(c.value + 1)])
            }, "+", 8, l6)
          ], 8, a6)
        ]))), 128)),
        h("div", i6, [
          u[1] || (u[1] = h("div", null, [
            h("label", null, "Size for this machine"),
            h("p", null, "Sets every lane's capacity from the number of processor cores.")
          ], -1)),
          (r(!0), d(B, null, Z(O(_S), (c) => (r(), d("button", {
            key: c.name,
            type: "button",
            disabled: s.value,
            "data-class-preset": c.name,
            onClick: (f) => l(["queue-class", "preset", c.name])
          }, v(c.title), 9, r6))), 128))
        ]),
        h("div", u6, [
          h("table", c6, [
            u[2] || (u[2] = h("thead", null, [
              h("tr", null, [
                h("th", { scope: "col" }, "Class"),
                h("th", { scope: "col" }, "Lane"),
                h("th", { scope: "col" }, "Slots"),
                h("th", { scope: "col" }, "Priority"),
                h("th", { scope: "col" }, "At once"),
                h("th", { scope: "col" }, [
                  h("span", { class: "hidden" }, "Actions")
                ])
              ])
            ], -1)),
            h("tbody", null, [
              (r(!0), d(B, null, Z(n.value.classes, (c) => (r(), j(jS, {
                key: c.name,
                entry: c,
                saving: s.value,
                onSend: l
              }, null, 8, ["entry", "saving"]))), 128))
            ])
          ])
        ]),
        A(e6, {
          read: e.read,
          saving: s.value,
          onSend: l
        }, null, 8, ["read", "saving"])
      ], 64)) : k("", !0),
      a.value ? (r(), d("p", d6, v(a.value), 1)) : k("", !0)
    ]));
  }
}, m6 = /* @__PURE__ */ V(f6, [["__scopeId", "data-v-bd3e5ac3"]]), h6 = { "data-queue-settings": "" }, p6 = ["for"], v6 = ["id", "value", "disabled", "onChange"], g6 = {
  key: 0,
  class: "failure",
  role: "alert"
}, y6 = {
  __name: "ProcessQueueSettings",
  props: { queue: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(!1), o = E("");
    async function l(i, u) {
      if (s.value) return;
      s.value = !0;
      const c = await n.read(["setting", "set", i, String(u)]);
      o.value = c.ok ? "" : c.error, c.ok && a("saved"), s.value = !1;
    }
    return (i, u) => (r(), d("div", h6, [
      (r(!0), d(B, null, Z(e.queue.suite_limits, (c) => (r(), d("div", {
        key: c.key,
        class: "control"
      }, [
        h("div", null, [
          h("label", {
            for: c.key
          }, v(c.title), 9, p6),
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
        }, null, 40, v6)
      ]))), 128)),
      o.value ? (r(), d("p", g6, v(o.value), 1)) : k("", !0),
      A(m6, { read: e.read }, null, 8, ["read"])
    ]));
  }
}, b6 = /* @__PURE__ */ V(y6, [["__scopeId", "data-v-1b1c7570"]]), k6 = ["data-lane-entry"], w6 = ["aria-expanded"], $6 = { class: "lead" }, x6 = {
  key: 0,
  "data-lane-position": ""
}, S6 = ["title"], M6 = {
  class: "kind",
  "data-lane-kind": ""
}, _6 = { class: "command" }, C6 = { class: "text" }, E6 = ["title"], A6 = {
  key: 1,
  title: "Waits for a reader"
}, O6 = ["title"], T6 = {
  class: "cost",
  "data-lane-takes": ""
}, I6 = { class: "who" }, B6 = { class: "time" }, R6 = {
  key: 0,
  class: "facts",
  "data-lane-facts": ""
}, L6 = ["href"], N6 = {
  __name: "ExecutionLaneRow",
  props: {
    entry: { type: Object, required: !0 },
    waiting: Boolean,
    position: { type: Number, required: !0 },
    waitCount: { type: Number, required: !0 },
    why: { type: String, required: !0 },
    laneName: { type: String, required: !0 },
    environment: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, n = E(!1), a = M(() => t.entry.reason === "waits for a reader"), s = M(() => [
      ["Class", t.entry.class],
      ["Priority", t.entry.raised_from ? `${t.entry.priority}, moved up from ${t.entry.raised_from} after a long wait` : t.entry.priority],
      ["Started by", t.entry.starter],
      [t.waiting ? "Waiting for" : "Running for", Zt(t.entry.seconds, !0)],
      ["Takes", Zs(t.entry.slot_cost)],
      ...t.waiting ? [["Place", `${t.position} of ${t.waitCount} in the ${t.laneName.toLowerCase()}`], ["Why it waits", a.value ? "Waits for a reader" : t.why]] : [],
      ...t.entry.parent_line ? [["For", t.entry.parent_line]] : []
    ]);
    return (o, l) => (r(), d("div", {
      class: X(["run", { open: n.value }]),
      "data-lane-entry": e.waiting ? "waiting" : "running"
    }, [
      h("button", {
        type: "button",
        class: "line",
        "aria-expanded": n.value,
        onClick: l[0] || (l[0] = (i) => n.value = !n.value)
      }, [
        h("span", $6, [
          e.waiting ? (r(), d("span", x6, v(e.position), 1)) : (r(), d("span", {
            key: 1,
            class: X(["dot", { free: !e.entry.slot_cost }]),
            title: e.entry.slot_cost ? "In a slot" : "Without a slot"
          }, null, 10, S6))
        ]),
        h("span", M6, v(O(Nu)(e.entry.kind)), 1),
        h("span", _6, [
          h("span", C6, v(e.entry.line), 1),
          e.waiting && e.entry.raised_from ? (r(), d("em", {
            key: 0,
            class: "up",
            title: `Moved up from ${e.entry.raised_from} after a long wait`
          }, "moved up", 8, E6)) : k("", !0),
          a.value ? (r(), d("em", A6, "reader")) : k("", !0),
          e.entry.parent_line ? (r(), d("em", {
            key: 2,
            title: `Runs for ${e.entry.parent_line}`
          }, "for " + v(e.entry.parent_line), 9, O6)) : k("", !0)
        ]),
        h("span", T6, v(O(Zs)(e.entry.slot_cost)), 1),
        h("span", I6, v(e.entry.starter), 1),
        h("span", B6, v(O(Zt)(e.entry.seconds, !0)), 1),
        A(se, {
          class: "chevron",
          name: "chevronRight",
          facing: "down",
          size: 11
        })
      ], 8, w6),
      n.value ? (r(), d("div", R6, [
        h("dl", null, [
          (r(!0), d(B, null, Z(s.value, ([i, u]) => (r(), d(B, { key: i }, [
            h("dt", null, v(i), 1),
            h("dd", null, v(u), 1)
          ], 64))), 128))
        ]),
        e.entry.run_id ? (r(), d("a", {
          key: 0,
          class: "output",
          href: `?page=processes.output&output=${e.entry.run_id}&environment=${encodeURIComponent(e.environment)}`,
          target: "_blank",
          rel: "noopener",
          "data-lane-output": ""
        }, "Open its output", 8, L6)) : k("", !0)
      ])) : k("", !0)
    ], 10, k6));
  }
}, ni = /* @__PURE__ */ V(N6, [["__scopeId", "data-v-287a0ae3"]]), q6 = ["data-lane", "aria-label"], D6 = { class: "head" }, P6 = {
  class: "use",
  "data-lane-use": ""
}, j6 = {
  key: 0,
  class: "chip warn",
  "data-lane-state": ""
}, F6 = {
  key: 1,
  class: "chip warn",
  "data-lane-state": ""
}, W6 = {
  key: 2,
  class: "chip bad",
  "data-lane-state": ""
}, H6 = { class: "contents" }, z6 = {
  key: 1,
  class: "note",
  role: "status",
  "data-lane-note": ""
}, U6 = ["aria-label"], V6 = ["title", "data-lane-cell"], G6 = {
  key: 2,
  class: "empty",
  "data-lane-empty": ""
}, K6 = { class: "sub" }, Y6 = {
  key: 0,
  class: "empty"
}, Q6 = { class: "sub" }, X6 = {
  class: "why",
  "data-lane-why": ""
}, J6 = {
  key: 0,
  class: "empty"
}, Z6 = {
  __name: "ExecutionLane",
  props: { lane: { type: Object, required: !0 }, kept: { type: Function, required: !0 }, environment: { type: String, required: !0 }, pausable: Boolean },
  emits: ["pause", "resume"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(!1), o = E(""), l = M(() => Lu(n.lane)), i = M(() => Math.max(0, n.lane.used - n.lane.capacity)), u = M(() => hn(n.lane) ? "The lane is paused" : n.lane.halted ? n.lane.halt_type === "update" ? "The lane is held for an update" : "The lane is held for a restart" : `No room: ${n.lane.used} of ${n.lane.capacity} slots in use`), c = M(() => hn(n.lane) ? "Paused" : n.lane.halted ? "Held" : u.value), f = M(() => n.lane.running.filter(n.kept)), m = M(() => n.lane.waiting.map(($, y) => ({ entry: $, position: y + 1 })).filter(({ entry: $ }) => n.kept($))), p = M(() => {
      let $ = 0;
      return [...n.lane.running.filter((w) => w.slot_cost > 0).map((w, x) => ($ += w.slot_cost, { key: `run:${x}`, cost: w.slot_cost, over: $ > n.lane.capacity, label: w.slot_cost >= 3 ? Nu(w.kind) : "", title: `${w.line} · ${Zs(w.slot_cost)}` })), ...Array.from({ length: Math.max(0, n.lane.capacity - $) }, (w, x) => ({ key: `free:${x}`, cost: 1, free: !0, label: "", title: "Free" }))];
    });
    function b() {
      a("pause", o.value.trim()), s.value = !1, o.value = "";
    }
    return ($, y) => (r(), d("section", {
      class: X(["lane", { stopped: e.lane.halted }]),
      "data-lane": e.lane.lane,
      "aria-label": l.value
    }, [
      h("h3", D6, [
        z(v(l.value) + " ", 1),
        h("span", P6, [
          h("b", null, v(e.lane.used), 1),
          z(" of " + v(e.lane.capacity) + " slots", 1),
          e.lane.waiting.length ? (r(), d(B, { key: 0 }, [
            z(" · " + v(e.lane.waiting.length) + " waiting", 1)
          ], 64)) : k("", !0)
        ]),
        O(hn)(e.lane) ? (r(), d("span", j6, "Paused")) : e.lane.halted ? (r(), d("span", F6, "Held")) : i.value ? (r(), d("span", W6, v(i.value) + " over", 1)) : k("", !0),
        y[6] || (y[6] = h("span", { class: "grow" }, null, -1)),
        e.pausable && O(hn)(e.lane) ? (r(), j(ie, {
          key: 3,
          small: "",
          variant: "primary",
          "data-lane-resume": "",
          onClick: y[0] || (y[0] = (w) => a("resume"))
        }, {
          default: N(() => [...y[4] || (y[4] = [
            z("Resume", -1)
          ])]),
          _: 1
        })) : k("", !0),
        e.pausable && !e.lane.halted && !s.value ? (r(), j(ie, {
          key: 4,
          small: "",
          icon: "pause",
          "data-lane-pause": "",
          onClick: y[1] || (y[1] = (w) => s.value = !0)
        }, {
          default: N(() => [...y[5] || (y[5] = [
            z("Pause", -1)
          ])]),
          _: 1
        })) : k("", !0)
      ]),
      h("p", H6, v(O(X3)[e.lane.lane]), 1),
      s.value && !e.lane.halted ? (r(), d("form", {
        key: 0,
        class: "note",
        "data-lane-pause-form": "",
        onSubmit: he(b, ["prevent"])
      }, [
        A(se, {
          name: "pause",
          size: 13
        }),
        ge(h("input", {
          "onUpdate:modelValue": y[2] || (y[2] = (w) => o.value = w),
          class: "reason",
          required: "",
          placeholder: "Why is it paused?",
          "aria-label": "Reason"
        }, null, 512), [
          [Fe, o.value]
        ]),
        A(ie, {
          small: "",
          variant: "primary",
          type: "submit"
        }, {
          default: N(() => [...y[7] || (y[7] = [
            z("Pause", -1)
          ])]),
          _: 1
        }),
        A(ie, {
          small: "",
          onClick: y[3] || (y[3] = (w) => s.value = !1)
        }, {
          default: N(() => [...y[8] || (y[8] = [
            z("Cancel", -1)
          ])]),
          _: 1
        })
      ], 32)) : k("", !0),
      e.lane.halted ? (r(), d("div", z6, [
        A(se, {
          name: "pause",
          size: 13
        }),
        A(Ft, {
          value: e.lane.halt_type
        }, {
          command: N(() => [
            h("span", null, [
              y[9] || (y[9] = h("b", null, "Paused", -1)),
              e.lane.halt_reason ? (r(), d(B, { key: 0 }, [
                z(" · " + v(e.lane.halt_reason), 1)
              ], 64)) : k("", !0),
              y[10] || (y[10] = z(". No waiting run starts here until it is resumed; what runs goes on.", -1))
            ])
          ]),
          update: N(() => [
            h("span", null, [
              y[11] || (y[11] = h("b", null, "Held for an update.", -1)),
              z(" The update waits for the running commands to end. Nothing new starts here until it is done; " + v(e.lane.waiting.length ? `the ${e.lane.waiting.length} waiting keep their place` : "nothing waits") + ".", 1)
            ])
          ]),
          restart: N(() => [
            h("span", null, [
              y[12] || (y[12] = h("b", null, "Held for a restart.", -1)),
              z(" The server is restarting. " + v(e.lane.waiting.length ? `The ${e.lane.waiting.length} waiting keep their place and start once it is back` : "Nothing waits") + ".", 1)
            ])
          ]),
          _: 1
        }, 8, ["value"])
      ])) : k("", !0),
      h("div", {
        class: X(["strip", { fine: e.lane.capacity > 16 }]),
        role: "img",
        "aria-label": `${e.lane.used} of ${e.lane.capacity} slots in use`,
        "data-lane-strip": ""
      }, [
        (r(!0), d(B, null, Z(p.value, (w) => (r(), d("i", {
          key: w.key,
          class: X(["cell", { on: !w.free, over: w.over }]),
          style: pe({ flex: w.cost }),
          title: w.title,
          "data-lane-cell": w.free ? "free" : "run"
        }, v(w.label), 15, V6))), 128))
      ], 10, U6),
      !e.lane.running.length && !e.lane.waiting.length ? (r(), d("p", G6, "Nothing runs or waits here")) : (r(), d(B, { key: 3 }, [
        h("h4", K6, [
          y[13] || (y[13] = z("Running ", -1)),
          h("span", null, v(e.lane.running.length), 1)
        ]),
        (r(!0), d(B, null, Z(f.value, (w, x) => (r(), j(ni, {
          key: `run:${x}:${w.line}`,
          entry: w,
          position: x + 1,
          "wait-count": e.lane.waiting.length,
          why: u.value,
          "lane-name": l.value,
          environment: e.environment
        }, null, 8, ["entry", "position", "wait-count", "why", "lane-name", "environment"]))), 128)),
        f.value.length ? k("", !0) : (r(), d("p", Y6, v(e.lane.running.length ? "None match the filter" : "Nothing runs"), 1)),
        e.lane.waiting.length ? (r(), d(B, { key: 1 }, [
          h("h4", Q6, [
            y[14] || (y[14] = z("Waiting, in the order they start ", -1)),
            h("span", null, v(e.lane.waiting.length), 1),
            h("span", X6, v(c.value), 1)
          ]),
          (r(!0), d(B, null, Z(m.value, (w) => (r(), j(ni, {
            key: `wait:${w.position}:${w.entry.line}`,
            entry: w.entry,
            waiting: "",
            position: w.position,
            "wait-count": e.lane.waiting.length,
            why: u.value,
            "lane-name": l.value,
            environment: e.environment
          }, null, 8, ["entry", "position", "wait-count", "why", "lane-name", "environment"]))), 128)),
          m.value.length ? k("", !0) : (r(), d("p", J6, "None match the filter"))
        ], 64)) : k("", !0)
      ], 64))
    ], 10, q6));
  }
}, eM = /* @__PURE__ */ V(Z6, [["__scopeId", "data-v-ea40d0f6"]]), tM = {
  class: "lanes",
  "data-execution-lanes": ""
}, nM = { class: "tools" }, aM = {
  class: "sum",
  "data-lanes-count": ""
}, sM = ["value"], oM = ["value"], lM = { "data-lanes-waits": "" }, iM = {
  key: 0,
  class: "empty"
}, rM = {
  key: 1,
  class: "waits"
}, uM = {
  __name: "ExecutionLanes",
  props: { execution: { type: Object, required: !0 }, environment: { type: String, required: !0 }, pausable: Boolean },
  emits: ["pause", "resume"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(""), o = E(""), l = M(() => n.execution.lanes.flatMap((b) => [...b.running, ...b.waiting])), i = M(() => n.execution.lanes.reduce((b, $) => b + $.running.length, 0)), u = M(() => [...new Set(l.value.map((b) => b.class))].sort()), c = M(() => [...new Set(l.value.map((b) => b.starter))].sort()), f = (b) => (!s.value || b.class === s.value) && (!o.value || b.starter === o.value), m = M(() => l.value.filter(f).length), p = M(() => n.execution.waits.filter((b) => b.runs));
    return (b, $) => (r(), d("section", tM, [
      h("div", nM, [
        h("span", aM, [
          z(v(i.value) + " running · " + v(l.value.length - i.value) + " waiting", 1),
          s.value || o.value ? (r(), d(B, { key: 0 }, [
            z(" · showing " + v(m.value) + " of " + v(l.value.length), 1)
          ], 64)) : k("", !0)
        ]),
        h("label", null, [
          $[5] || ($[5] = z("Class ", -1)),
          ge(h("select", {
            "onUpdate:modelValue": $[0] || ($[0] = (y) => s.value = y),
            "data-lanes-class": ""
          }, [
            $[4] || ($[4] = h("option", { value: "" }, "Every class", -1)),
            (r(!0), d(B, null, Z(u.value, (y) => (r(), d("option", {
              key: y,
              value: y
            }, v(y), 9, sM))), 128))
          ], 512), [
            [Dt, s.value]
          ])
        ]),
        h("label", null, [
          $[7] || ($[7] = z("Started by ", -1)),
          ge(h("select", {
            "onUpdate:modelValue": $[1] || ($[1] = (y) => o.value = y),
            "data-lanes-starter": ""
          }, [
            $[6] || ($[6] = h("option", { value: "" }, "Anyone", -1)),
            (r(!0), d(B, null, Z(c.value, (y) => (r(), d("option", {
              key: y,
              value: y
            }, v(y), 9, oM))), 128))
          ], 512), [
            [Dt, o.value]
          ])
        ])
      ]),
      (r(!0), d(B, null, Z(e.execution.lanes, (y) => (r(), j(eM, {
        key: y.lane,
        lane: y,
        kept: f,
        environment: e.environment,
        pausable: e.pausable && y.lane === "long",
        onPause: $[2] || ($[2] = (w) => a("pause", w)),
        onResume: $[3] || ($[3] = (w) => a("resume"))
      }, null, 8, ["lane", "environment", "pausable"]))), 128)),
      h("div", lM, [
        A(_t, { icon: "clock" }, {
          default: N(() => [...$[8] || ($[8] = [
            z("Waits, last hour", -1)
          ])]),
          _: 1
        }),
        p.value.length ? (r(), d("table", rM, [
          $[9] || ($[9] = h("thead", null, [
            h("tr", null, [
              h("th", { scope: "col" }, "Priority"),
              h("th", { scope: "col" }, "Started"),
              h("th", { scope: "col" }, "Longest wait"),
              h("th", { scope: "col" }, "Average wait")
            ])
          ], -1)),
          h("tbody", null, [
            (r(!0), d(B, null, Z(p.value, (y) => (r(), d("tr", {
              key: y.priority
            }, [
              h("td", null, v(y.priority), 1),
              h("td", null, v(y.runs), 1),
              h("td", null, v(O(Zt)(y.longest_seconds, !0)), 1),
              h("td", null, v(O(Zt)(y.average_seconds, !0)), 1)
            ]))), 128))
          ])
        ])) : (r(), d("p", iM, "No run started in the last hour."))
      ])
    ]));
  }
}, cM = /* @__PURE__ */ V(uM, [["__scopeId", "data-v-112283a4"]]), dM = {
  class: "process-queue",
  "data-test-queue": ""
}, fM = {
  key: 0,
  class: "lead"
}, mM = { class: "scroll" }, hM = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, pM = {
  key: 0,
  class: "tabs"
}, vM = ["data-queue-empty"], $s = 20, gM = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 }, agent: { type: Number, default: 0 } },
  setup(e) {
    const t = [{ key: "queue", label: "Queue" }, { key: "settings", label: "Settings" }], n = e, a = M(() => n.agent ? ["--agent", `row:${n.agent}`] : []), s = E(null), o = E(""), l = E([]), i = E($s), u = E("queue"), c = M(() => {
      var w, x;
      return (((w = s.value) == null ? void 0 : w.recent_total) ?? 0) > (((x = s.value) == null ? void 0 : x.recent.length) ?? 0);
    });
    let f = 0;
    const m = M(() => {
      if (!s.value) return [];
      const w = { type: "recent", heading: n.agent ? "Finished" : "Finished lately", icon: "check", rows: s.value.recent, empty: "None" };
      return (n.agent ? [
        { type: "running", heading: "Running", icon: "start", rows: s.value.running, empty: "None" },
        { type: "waiting", heading: "Waiting", icon: "clock", rows: s.value.waiting, empty: "None" },
        w
      ] : [w]).flatMap((C) => [
        { key: `band:${C.type}`, section: C },
        ...C.rows.length ? C.rows.map((q, P) => ({ key: `run:${q.id}`, run: q, position: P + 1 })) : [{ key: `none:${C.type}`, section: C, empty: !0 }]
      ]);
    });
    function p(w) {
      l.value = l.value.includes(w) ? l.value.filter((x) => x !== w) : [...l.value, w];
    }
    async function b() {
      const w = ++f, x = await n.read([...i.value === $s ? ["queue", "list"] : ["queue", "list", "--recent", String(i.value)], ...a.value]);
      w === f && (o.value = x.ok ? "" : x.error, x.ok && (s.value = x.value));
    }
    async function $(w) {
      const x = await n.read(w);
      o.value = x.ok ? "" : x.error, x.ok && b();
    }
    function y() {
      i.value += $s, b();
    }
    return qn(["process.*", "setting.*"], b), _e(b), (w, x) => (r(), d("article", dM, [
      e.agent ? k("", !0) : (r(), d("p", fM, "Commands from workers wait here for a free slot. Reading and editing never wait.")),
      h("div", mM, [
        o.value ? (r(), d("p", hM, v(o.value), 1)) : k("", !0),
        s.value ? (r(), d(B, { key: 1 }, [
          e.agent ? k("", !0) : (r(), d("div", pM, [
            A(Mt, {
              options: t,
              value: u.value,
              "data-queue-tabs": "",
              onPick: x[0] || (x[0] = (C) => u.value = C)
            }, null, 8, ["value"])
          ])),
          !e.agent && u.value === "settings" ? (r(), j(b6, {
            key: 1,
            queue: s.value,
            read: e.read,
            onSaved: b
          }, null, 8, ["queue", "read"])) : (r(), d(B, { key: 2 }, [
            e.agent ? k("", !0) : (r(), j(oS, {
              key: 0,
              lanes: s.value.execution.lanes
            }, null, 8, ["lanes"])),
            e.agent ? k("", !0) : (r(), j(cM, {
              key: 1,
              execution: s.value.execution,
              environment: s.value.environment_name,
              pausable: "",
              onPause: x[1] || (x[1] = (C) => $(["queue", "halt", C])),
              onResume: x[2] || (x[2] = (C) => $(["queue", "resume"]))
            }, null, 8, ["execution", "environment"])),
            A(no, {
              name: "queue",
              tag: "div",
              class: "queue-list"
            }, {
              default: N(() => [
                (r(!0), d(B, null, Z(m.value, (C) => (r(), d(B, {
                  key: C.key
                }, [
                  C.run ? (r(), j(MS, {
                    key: 0,
                    run: C.run,
                    environment: s.value.environment_name,
                    position: C.position,
                    read: e.read,
                    expanded: l.value.includes(C.run.id),
                    onToggle: (q) => p(C.run.id)
                  }, null, 8, ["run", "environment", "position", "read", "expanded", "onToggle"])) : C.empty ? (r(), d("p", {
                    key: 1,
                    class: "empty",
                    "data-queue-empty": C.section.type
                  }, v(C.section.empty), 9, vM)) : (r(), j(_t, {
                    key: 2,
                    class: "sticky-band",
                    icon: C.section.icon,
                    count: C.section.rows.length,
                    "data-queue-heading": C.section.type
                  }, {
                    default: N(() => [
                      z(v(C.section.heading), 1)
                    ]),
                    _: 2
                  }, 1032, ["icon", "count", "data-queue-heading"]))
                ], 64))), 128))
              ]),
              _: 1
            }),
            c.value ? (r(), d("button", {
              key: 2,
              type: "button",
              class: "older",
              "data-queue-older": "",
              onClick: y
            }, "Show older commands")) : k("", !0)
          ], 64))
        ], 64)) : o.value ? k("", !0) : (r(), j(nt, { key: 2 }))
      ])
    ]));
  }
}, HI = /* @__PURE__ */ V(gM, [["__scopeId", "data-v-f12b6e25"]]), yM = ["placeholder"], bM = { class: "actions" }, kM = { class: "error" }, wM = {
  key: 1,
  class: "card closed"
}, $M = { class: "mark" }, xM = { class: "prompt" }, SM = {
  key: 0,
  class: "draft"
}, MM = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ mt({
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
  emits: /* @__PURE__ */ mt(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = qt(e, "draft"), l = qt(e, "error"), i = E(!!l.value), u = E(!1), c = E(!1), f = E(null);
    async function m() {
      var $, y;
      i.value = !0, u.value = !1, await Re(), (y = (($ = f.value) == null ? void 0 : $.querySelector("input")) || f.value) == null || y.focus();
    }
    function p() {
      i.value = !1, l.value = "";
    }
    async function b() {
      const $ = o.value.trim();
      if (!(!$ || !a.ready || c.value)) {
        l.value = "", c.value = !0, o.value = "";
        try {
          await a.send($), i.value = !1, u.value = !0;
        } catch (y) {
          o.value = $, l.value = y.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: m }), ($, y) => (r(), d("div", {
      class: X(["comment-bar", { open: i.value }])
    }, [
      i.value ? (r(), d("form", {
        key: 0,
        class: "card compose",
        onSubmit: he(b, ["prevent"]),
        onKeydown: ze(p, ["esc"])
      }, [
        ne($.$slots, "who", {}, void 0, !0),
        ge(h("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": y[0] || (y[0] = (w) => o.value = w),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: y[1] || (y[1] = ze((w) => O(yr)(w, b), ["enter"]))
        }, null, 40, yM), [
          [Fe, o.value]
        ]),
        h("div", bM, [
          h("span", kM, v(l.value), 1),
          A(ie, {
            small: "",
            onClick: p
          }, {
            default: N(() => [...y[3] || (y[3] = [
              z("Cancel", -1)
            ])]),
            _: 1
          }),
          A(ie, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: b
          }, {
            default: N(() => [...y[4] || (y[4] = [
              z("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (r(), d("div", wM, [
        h("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: m
        }, [
          h("span", $M, [
            A(se, {
              name: u.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          h("span", xM, v(u.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (r(), d("span", SM, "Draft kept")) : k("", !0)
        ]),
        e.count ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: y[2] || (y[2] = (w) => s("show"))
        }, [
          h("span", null, v(O(Gd)(e.count, "comment")), 1),
          A(se, {
            name: "down",
            size: 12
          })
        ])) : k("", !0)
      ]))
    ], 2));
  }
}, _M = /* @__PURE__ */ V(MM, [["__scopeId", "data-v-b68baddd"]]), CM = { wide: 1120 }, EM = /\{([A-Za-z_]\w*)\}/g;
function da(e, t, n = {}) {
  return e.replace(EM, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const AM = (e, t, n, a) => da(e.label, n, { row_id: a, id: a }) || Wy(t, n, a), OM = { class: "comment-side-head" }, TM = {
  key: 0,
  class: "comment-none"
}, IM = { key: 0 }, BM = {
  key: 1,
  class: "comment-none"
}, RM = {
  class: "comment",
  "data-comment": ""
}, LM = {
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
      class: X(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      h("header", OM, [
        n[2] || (n[2] = h("h3", null, "Comments", -1)),
        A(Ia, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (r(), d("p", TM, "No comments yet")) : k("", !0),
      (r(!0), d(B, null, Z(e.comments, (a) => (r(), d("section", {
        key: a.id
      }, [
        a.quote ? (r(), d("blockquote", IM, v(a.quote), 1)) : k("", !0),
        a.revision ? (r(), d("span", BM, "Revision " + v(a.revision), 1)) : k("", !0),
        h("p", RM, v(e.words(a)), 1)
      ]))), 128)),
      A(Bn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, ai = /* @__PURE__ */ V(LM, [["__scopeId", "data-v-276284a3"]]), NM = {
  __name: "InspectorBack",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), j(ie, {
      variant: "icon",
      title: "Back",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: s[0] || (s[0] = (o) => n("back"))
    }, {
      default: N(() => [
        A(se, {
          name: "back",
          size: 13
        })
      ]),
      _: 1
    }));
  }
}, qM = { class: "resource-heading" }, DM = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, PM = {
  key: 1,
  class: "resource-abstract"
}, jM = {
  __name: "ResourceHeading",
  props: { title: String, abstract: String },
  setup(e) {
    return (t, n) => (r(), d("div", qM, [
      e.title ? (r(), d("h2", DM, v(e.title), 1)) : k("", !0),
      e.abstract ? (r(), d("p", PM, v(e.abstract), 1)) : k("", !0)
    ]));
  }
}, ju = /* @__PURE__ */ V(jM, [["__scopeId", "data-v-172f09ac"]]), FM = {
  class: "inspector-head",
  "data-inspector-head": ""
}, WM = { class: "inspector-icons" }, HM = { class: "inspector-icons-start" }, zM = {
  key: 0,
  class: "inspector-band-title",
  "data-resource-title": ""
}, UM = {
  key: 1,
  class: "inspector-label",
  "data-resource-type": ""
}, VM = { class: "inspector-icons-end" }, GM = ["href"], KM = {
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
    const n = e, a = t, s = M(() => `${n.opened.table}:${n.opened.id}`), o = M(() => n.shareable && !n.readOnly), l = M(() => !n.label && !!n.title), i = M(() => n.backed ? "Close all rows" : "Close");
    return (u, c) => (r(), d("header", FM, [
      h("div", WM, [
        h("span", HM, [
          e.backed ? (r(), j(NM, {
            key: 0,
            onBack: c[0] || (c[0] = (f) => a("back"))
          })) : k("", !0),
          e.stepped ? (r(), d(B, { key: 1 }, [
            A(ie, {
              variant: "icon",
              title: "Previous",
              "aria-label": "Previous",
              "data-inspector-step": "previous",
              onClick: c[1] || (c[1] = (f) => a("step", -1))
            }, {
              default: N(() => [
                A(se, {
                  name: "up",
                  size: 13
                })
              ]),
              _: 1
            }),
            A(ie, {
              variant: "icon",
              title: "Next",
              "aria-label": "Next",
              "data-inspector-step": "next",
              onClick: c[2] || (c[2] = (f) => a("step", 1))
            }, {
              default: N(() => [
                A(se, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : k("", !0)
        ]),
        l.value ? (r(), d("h2", zM, v(e.title), 1)) : (r(), d("p", UM, v(e.label), 1)),
        h("span", VM, [
          e.embedded ? (r(), j(ie, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: c[3] || (c[3] = (f) => O(Pe)(s.value))
          }, {
            default: N(() => [
              A(se, {
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
            href: O(Ym)(s.value)
          }, [
            A(se, {
              name: "share",
              size: 13
            })
          ], 8, GM)) : k("", !0),
          e.embedded ? k("", !0) : (r(), j(ie, {
            key: 2,
            variant: "icon",
            title: i.value,
            "aria-label": i.value,
            "data-resource-close": "",
            onClick: c[4] || (c[4] = (f) => a("close"))
          }, {
            default: N(() => [
              A(se, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          }, 8, ["title", "aria-label"]))
        ])
      ]),
      A(ju, {
        title: l.value ? "" : e.title,
        abstract: e.description
      }, null, 8, ["title", "abstract"])
    ]));
  }
}, YM = /* @__PURE__ */ V(KM, [["__scopeId", "data-v-48e6812e"]]), QM = {
  class: "section field-grid",
  "data-resource-fields": ""
}, XM = { class: "field-name" }, JM = {
  key: 1,
  class: "field-value"
}, ZM = ["onClick"], e_ = {
  key: 2,
  class: "field-value"
}, t_ = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", QM, [
      (r(!0), d(B, null, Z(e.fields, (o) => (r(), d(B, {
        key: o.name
      }, [
        h("p", XM, v(o.label), 1),
        o.isTime ? (r(), j(Ye, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (r(), d("p", JM, [
          h("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, v(o.value), 9, ZM)
        ])) : (r(), d("p", e_, v(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, Fu = /* @__PURE__ */ V(t_, [["__scopeId", "data-v-7e45afb5"]]), n_ = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, a_ = {
  key: 1,
  class: "inspector-wait"
}, s_ = { class: "inspector-main" }, o_ = { class: "inspector-column" }, l_ = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, i_ = {
  class: "inspector-body",
  "data-inspector-body": ""
}, r_ = { class: "inspector-text" }, u_ = ["innerHTML"], c_ = {
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
    const n = e, a = t, s = E(null);
    to(Si, M(() => {
      var U;
      return ((U = s.value) == null ? void 0 : U.$el) ?? null;
    }));
    const o = /* @__PURE__ */ new Set(["question", "memory", "rule"]), l = M(() => n.catalogue.inspector(n.term) ?? {
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
    }), i = E(null), u = E(""), c = E(""), f = E(""), m = E("details"), p = E(null), b = E(0);
    let $ = 0;
    const y = M(() => ({ row_id: n.id, id: n.id })), w = M(() => i.value ? da(l.value.title, i.value, y.value) || Fy(n.term, i.value, n.id) : ""), x = M(() => i.value ? AM(l.value, n.term, i.value, n.id) : ""), C = M(() => x.value === w.value ? "" : x.value), q = M(() => i.value ? da(l.value.description, i.value, y.value) : ""), P = M(() => {
      var U, J, ee;
      return ((U = i.value) == null ? void 0 : U.body) || ((J = i.value) == null ? void 0 : J.brief) || (o.has(n.term) ? (ee = i.value) == null ? void 0 : ee.text : "") || "";
    }), I = M(() => P.value ? ko(P.value, { env: "", rowNames: !1 }) : ""), Q = M(() => Uy(i.value, P.value, u.value, c.value)), W = M(() => l.value.comments && b.value >= CM.wide), R = M(() => l.value.comments && !W.value), D = (U) => l.value.components.filter((J) => (J.tab || "") === U).map((J) => J.window), G = M(() => [...new Set(l.value.components.map((U) => U.tab).filter(Boolean))]), _ = M(() => G.value.length || R.value ? [{ key: "details", label: "Details" }, ...G.value.map((U) => ({ key: U, label: U })), ...R.value ? [{ key: "comments", label: "Comments" }] : []] : []), g = M(() => {
      const U = l.value.links;
      return U ? { categories: U.categories, open: U.open, outsidePlan: U.excludes_plan, pageSize: U.page_size } : null;
    }), S = Er(() => l.value.comments && i.value ? { term: n.term, id: n.id, title: i.value.title } : {}, (U) => n.read(U));
    async function T() {
      const U = ++$, J = await n.read(da(l.value.reads, null, y.value).split(/\s+/).filter(Boolean));
      if (U !== $ || (f.value = J.ok ? "" : J.error, !J.ok)) return;
      i.value = J.value;
      const ee = await kr(n.read, i.value);
      U === $ && (u.value = ee.creator, c.value = ee.owner);
    }
    ce(() => `${n.term}:${n.id}`, () => {
      i.value = null, u.value = "", c.value = "", f.value = "", m.value = "details", T();
    }, { immediate: !0 }), qn(l.value.events, T), ce(S.open, (U) => U && R.value && (m.value = "comments"));
    let L = null;
    return _e(() => {
      var U;
      b.value = ((U = p.value) == null ? void 0 : U.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (L = new ResizeObserver(() => b.value = p.value.clientWidth), L.observe(p.value));
    }), Te(() => L == null ? void 0 : L.disconnect()), (U, J) => (r(), d("aside", {
      ref_key: "root",
      ref: p,
      class: "inspector",
      "data-inspector": ""
    }, [
      A(YM, {
        label: C.value,
        title: w.value,
        description: q.value,
        backed: e.backed,
        stepped: e.stepped,
        embedded: e.embedded,
        shareable: l.value.shareable,
        "read-only": e.readOnly,
        opened: { table: e.table || `${e.term}s`, id: e.id },
        onClose: J[0] || (J[0] = (ee) => a("close")),
        onBack: J[1] || (J[1] = (ee) => a("back")),
        onStep: J[2] || (J[2] = (ee) => a("step", ee))
      }, null, 8, ["label", "title", "description", "backed", "stepped", "embedded", "shareable", "read-only", "opened"]),
      f.value ? (r(), d("p", n_, v(f.value), 1)) : i.value ? (r(), d(B, { key: 2 }, [
        A(Ws, {
          ref_key: "actionBar",
          ref: s
        }, {
          default: N(() => [
            A(go, {
              name: `row.${e.term}`,
              row: { ...i.value, id: e.id, term: e.term },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: T
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }, 512),
        h("div", s_, [
          h("div", o_, [
            _.value.length ? (r(), d("div", l_, [
              A(Mt, {
                options: _.value,
                value: m.value,
                onPick: J[3] || (J[3] = (ee) => m.value = ee)
              }, null, 8, ["options", "value"])
            ])) : k("", !0),
            h("div", i_, [
              A(Ft, { value: m.value }, {
                details: N(() => [
                  h("div", r_, [
                    I.value && !l.value.draws_text ? (r(), d("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: I.value
                    }, null, 8, u_)) : k("", !0),
                    l.value.lists_fields ? (r(), j(Fu, {
                      key: 1,
                      fields: Q.value,
                      onPeek: J[4] || (J[4] = (ee) => a("open", ee))
                    }, null, 8, ["fields"])) : k("", !0)
                  ]),
                  A(js, {
                    "slot-name": `inspector.${e.term}`,
                    names: D(""),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: N(() => [
                  A(ai, {
                    below: "",
                    comments: O(S).comments.value,
                    words: O(S).words,
                    more: !!O(S).nextPage.value,
                    loading: O(S).loading.value,
                    failure: O(S).failure.value,
                    onMore: O(S).loadMore,
                    onClose: J[5] || (J[5] = (ee) => m.value = "details")
                  }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
                ]),
                default: N(() => [
                  A(js, {
                    names: D(m.value),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              g.value ? (r(), j(Mo, Ne({
                key: 0,
                model: e.term,
                id: e.id,
                read: e.read
              }, g.value, {
                onOpen: J[6] || (J[6] = (ee) => a("open", ee))
              }), null, 16, ["model", "id", "read"])) : k("", !0)
            ]),
            l.value.comments ? (r(), j(_M, {
              key: 1,
              send: O(S).send,
              count: O(S).total.value,
              onShow: J[7] || (J[7] = (ee) => R.value && (m.value = "comments"))
            }, null, 8, ["send", "count"])) : k("", !0)
          ]),
          W.value ? (r(), j(ai, {
            key: 0,
            comments: O(S).comments.value,
            words: O(S).words,
            more: !!O(S).nextPage.value,
            loading: O(S).loading.value,
            failure: O(S).failure.value,
            onMore: O(S).loadMore,
            onClose: () => {
            }
          }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])) : k("", !0)
        ])
      ], 64)) : (r(), d("div", a_, [
        A(nt)
      ]))
    ], 512));
  }
}, d_ = /* @__PURE__ */ V(c_, [["__scopeId", "data-v-60363e95"]]), zI = {
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
    const t = $e(Ta);
    return (n, a) => (r(), j(d_, Ne(n.$props, {
      catalogue: O(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, f_ = { class: "facts" }, m_ = { class: "fact wide" }, h_ = ["title"], p_ = {
  key: 1,
  class: "fact-value"
}, v_ = {
  key: 0,
  class: "fact"
}, g_ = { class: "fact-value" }, y_ = { class: "fact" }, b_ = { class: "fact-label" }, k_ = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, w_ = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, $_ = {
  key: 2,
  class: "fact"
}, x_ = { class: "fact-value" }, S_ = { class: "fact wide" }, M_ = { class: "fact-label" }, __ = { class: "fact wide" }, C_ = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, E_ = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = ya.map(({ key: l, label: i }) => ({ key: String(l), label: i })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, i) => {
      var u, c;
      return r(), d("div", f_, [
        h("div", m_, [
          i[4] || (i[4] = h("span", { class: "fact-label" }, "Plan", -1)),
          (u = e.place) != null && u.plan_id ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: i[0] || (i[0] = (f) => O(Pe)(`plans:${e.place.plan_id}`))
          }, "Plan " + v(e.place.plan_id) + ": " + v(e.place.plan_title), 9, h_)) : (r(), d("span", p_, "Not in a plan"))
        ]),
        ((c = e.place) == null ? void 0 : c.phase_total) > 1 ? (r(), d("div", v_, [
          i[5] || (i[5] = h("span", { class: "fact-label" }, "Phase", -1)),
          h("span", g_, v(e.place.phase_number) + " of " + v(e.place.phase_total) + ": " + v(e.place.phase_title), 1)
        ])) : k("", !0),
        e.task.helper_id ? (r(), d(B, { key: 1 }, [
          h("div", y_, [
            h("span", b_, v(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            A(xn, {
              as: "button",
              "agent-id": e.task.helper_id,
              label: O(xo)(e.task.helper_name, e.task.helper_main),
              class: "fact-value agent-link",
              "data-task-agent": "",
              onClick: i[1] || (i[1] = (f) => O(Pe)(`agents:${e.task.helper_id}`))
            }, {
              default: N(() => [
                A(Qt, {
                  name: e.task.helper_name,
                  main: e.task.helper_main
                }, null, 8, ["name", "main"])
              ]),
              _: 1
            }, 8, ["agent-id", "label"])
          ]),
          O(o).has(e.task.state) && e.task.holder_id ? (r(), d("p", k_, [
            A(Qt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[6] || (i[6] = z(" holds it: merging its work finishes it, and releasing the worker opens it again.", -1))
          ])) : e.task.state === "open" ? (r(), d("p", w_, [
            A(Qt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[7] || (i[7] = z(" takes it after the task it is on.", -1))
          ])) : k("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (r(), d("div", $_, [
          i[8] || (i[8] = h("span", { class: "fact-label" }, "Assigned to", -1)),
          h("span", x_, "Agent " + v(e.task.holder_id), 1)
        ])) : k("", !0),
        h("div", S_, [
          h("span", M_, [
            i[9] || (i[9] = z(" Complexity ", -1)),
            A(Li, {
              lines: O(Lr).map((f, m) => `${m + 1}: ${f}`),
              label: "What the scores mean"
            }, null, 8, ["lines"])
          ]),
          A(Mt, {
            options: O(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: i[2] || (i[2] = (f) => s("complexity", f))
          }, null, 8, ["options", "value"])
        ]),
        h("div", __, [
          i[10] || (i[10] = h("span", { class: "fact-label" }, "Priority", -1)),
          A(Mt, {
            options: O(n),
            value: String(O(Rr)(e.task.priority)),
            "data-task-priority": "",
            onPick: i[3] || (i[3] = (f) => s("priority", f))
          }, null, 8, ["options", "value"]),
          e.refusal ? (r(), d("p", C_, v(e.refusal), 1)) : k("", !0)
        ])
      ]);
    };
  }
}, A_ = /* @__PURE__ */ V(E_, [["__scopeId", "data-v-4bf27961"]]);
function O_(e, t) {
  const n = new Map(t.tasks.map((u) => [u.id, u])), a = (u) => t.edges.filter(([, c]) => c === u).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let u = a(e); u.length; u = [...new Set(u.flatMap(a))].filter((c) => !s.has(c)))
    u.forEach((c) => s.add(c)), o.push(u.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let u = t.edges.find(([c]) => c === e); u && !i.has(u[1]); u = t.edges.find(([c]) => c === u[1]))
    i.add(u[1]), l.push(n.get(u[1]));
  return { above: o.reverse(), below: l };
}
const T_ = { class: "number" }, I_ = { class: "title" }, B_ = { class: "word" }, R_ = {
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
    return (a, s) => (r(), j(Je(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: X(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: N(() => [
        A(Ra, { status: e.status }, null, 8, ["status"]),
        h("span", T_, v(e.number), 1),
        h("span", I_, v(e.title), 1),
        h("span", B_, v(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, xs = /* @__PURE__ */ V(R_, [["__scopeId", "data-v-f6417ae8"]]), L_ = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, N_ = { class: "level" }, q_ = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(!1);
    ce(() => n.task.id, () => s.value = !1);
    const o = M(() => O_(n.task.id, n.graph)), l = M(() => s.value ? o.value.above : o.value.above.slice(-1)), i = M(() => s.value ? o.value.below : o.value.below.slice(0, 1)), u = M(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (m) => m.slice(0, 1).toUpperCase() + m.slice(1), f = (m, p = !1) => ({ status: Sn(m.state), number: m.id, title: m.title, word: p ? "This task" : c(m.state), current: p });
    return (m, p) => o.value.above.length || o.value.below.length ? (r(), d("section", L_, [
      p[5] || (p[5] = h("h4", null, "What waits on what", -1)),
      (r(!0), d(B, null, Z(l.value, (b) => (r(), d(B, {
        key: b.map(($) => $.id).join()
      }, [
        h("div", N_, [
          (r(!0), d(B, null, Z(b, ($) => (r(), j(xs, Ne({
            key: $.id,
            ref_for: !0
          }, f($), {
            onSelect: p[0] || (p[0] = (y) => a("select", y))
          }), null, 16))), 128))
        ]),
        p[3] || (p[3] = h("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      A(xs, bt(ci(f(e.task, !0))), null, 16),
      (r(!0), d(B, null, Z(i.value, (b) => (r(), d(B, {
        key: b.id
      }, [
        p[4] || (p[4] = h("div", { class: "waits" }, "↓ waits on", -1)),
        A(xs, Ne({ ref_for: !0 }, f(b), {
          onSelect: p[1] || (p[1] = ($) => a("select", $))
        }), null, 16)
      ], 64))), 128)),
      u.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: p[2] || (p[2] = (b) => s.value = !s.value)
      }, v(s.value ? "Show less" : `Show the whole chain (${u.value} more)`), 1)) : k("", !0)
    ])) : k("", !0);
  }
}, D_ = /* @__PURE__ */ V(q_, [["__scopeId", "data-v-79c52417"]]), P_ = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, j_ = ["datetime"], F_ = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (r(), d("section", P_, [
      n[0] || (n[0] = h("h3", null, "Block history", -1)),
      (r(!0), d(B, null, Z(e.renewals, (a) => (r(), d("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        h("time", {
          datetime: a.created_at
        }, v(new Date(a.created_at).toLocaleString()), 9, j_),
        h("p", null, v(a.reason), 1)
      ]))), 128))
    ])) : k("", !0);
  }
}, W_ = /* @__PURE__ */ V(F_, [["__scopeId", "data-v-b41f213b"]]), H_ = {
  class: "part",
  "data-resource-waits": ""
}, z_ = ["onClick"], U_ = { class: "wait-id" }, V_ = { class: "wait-title" }, G_ = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", H_, [
      h("h4", null, v(e.title), 1),
      (r(!0), d(B, null, Z(e.waits, (o) => (r(), d("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        A(Ra, {
          status: O(Sn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        h("span", U_, v(o.id), 1),
        h("span", V_, v(o.title), 1)
      ], 8, z_))), 128))
    ]));
  }
}, si = /* @__PURE__ */ V(G_, [["__scopeId", "data-v-8fb2e251"]]), K_ = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, Y_ = { class: "text" }, Q_ = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, X_ = 180, J_ = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = E(!1), l = M(() => a.task.waits.filter((u) => !n.has(u.state))), i = M(() => a.task.waits.filter((u) => n.has(u.state)));
    return (u, c) => (r(), d(B, null, [
      l.value.length ? (r(), j(si, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0),
      e.task.state === "completed" && e.task.outcome ? (r(), d("section", K_, [
        c[3] || (c[3] = h("h4", null, "How it was done", -1)),
        h("p", Y_, v(e.task.outcome), 1)
      ])) : k("", !0),
      e.task.brief ? (r(), d("section", Q_, [
        c[4] || (c[4] = h("h4", null, "The brief", -1)),
        h("p", {
          class: X(["text", { clamped: !o.value }])
        }, v(e.task.brief), 3),
        e.task.brief.length > X_ && !o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (f) => o.value = !0)
        }, "Show the whole brief")) : k("", !0)
      ])) : k("", !0),
      i.value.length ? (r(), j(si, {
        key: 3,
        title: "Waited on",
        waits: i.value,
        onSelect: c[2] || (c[2] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0)
    ], 64));
  }
}, Z_ = /* @__PURE__ */ V(J_, [["__scopeId", "data-v-4a3f1e79"]]), eC = {
  class: "task-details",
  "data-task-details": ""
}, tC = { class: "since" }, nC = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, aC = { class: "text" }, sC = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, oC = {
  key: 1,
  class: "note"
}, lC = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, iC = { class: "text" }, rC = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return r(), d("div", eC, [
        h("div", {
          class: X(["state-line", O(Sn)(e.task.state)])
        }, [
          h("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            A(Ra, {
              status: O(Sn)(e.task.state)
            }, null, 8, ["status"]),
            z(" " + v(a(e.task.state)), 1)
          ]),
          h("span", tC, [
            o[5] || (o[5] = z(" since ", -1)),
            A(Ye, {
              at: O(Eh)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (r(), d("section", nC, [
          o[6] || (o[6] = h("span", { class: "label" }, "Blocked, waiting on", -1)),
          h("p", aC, v(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (r(), d("p", sC, "Opens by itself when " + v(e.task.openers.join(" or ")) + ".", 1)) : (r(), d("p", oC, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (r(), d("section", lC, [
          o[7] || (o[7] = h("span", { class: "label" }, "Why it was cancelled", -1)),
          h("p", iC, v(e.task.reason), 1)
        ])) : k("", !0),
        e.graph ? (r(), j(D_, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : k("", !0),
        A(A_, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        A(Z_, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        A(W_, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, UI = /* @__PURE__ */ V(rC, [["__scopeId", "data-v-7e73fa21"]]), uC = 50, cC = { messages: 25 }, dC = (e) => cC[e] || uC, fC = {
  class: "task-log",
  "aria-label": "Task log"
}, mC = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, hC = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, pC = { class: "entries" }, vC = ["data-task-log-important"], gC = ["datetime"], yC = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, bC = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = E([]), a = E(1), s = E(!0), o = E(!0), l = E("");
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
        String(dC("task_logs")),
        "--page",
        String(c)
      ]);
      f === i && (o.value = !1, l.value = m.ok ? "" : m.error, m.ok && (n.value = m.value.rows, s.value = m.value.is_last_page));
    }
    return ce(
      () => [t.id, t.changes],
      () => {
        n.value = [], u();
      },
      { immediate: !0 }
    ), tt(() => {
      i += 1;
    }), (c, f) => (r(), d("section", fC, [
      o.value ? (r(), j(nt, { key: 0 })) : l.value ? (r(), d(B, { key: 1 }, [
        h("p", mC, v(l.value), 1),
        A(ie, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: f[0] || (f[0] = (m) => u(a.value))
        }, {
          default: N(() => [...f[3] || (f[3] = [
            z("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (r(), d(B, { key: 2 }, [
        n.value.length ? k("", !0) : (r(), d("p", hC, "No log entries yet.")),
        h("ol", pC, [
          (r(!0), d(B, null, Z(n.value, (m) => (r(), d("li", {
            key: m.id,
            class: X(["entry", { important: m.important }]),
            "data-task-log": "",
            "data-task-log-important": m.important ? "" : null
          }, [
            h("time", {
              datetime: m.created_at
            }, v(new Date(m.created_at).toLocaleString()), 9, gC),
            h("p", null, v(m.line), 1)
          ], 10, vC))), 128))
        ]),
        a.value > 1 || !s.value ? (r(), d("nav", yC, [
          A(ie, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: f[1] || (f[1] = (m) => u(a.value - 1))
          }, {
            default: N(() => [...f[4] || (f[4] = [
              z("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          h("span", null, "Page " + v(a.value), 1),
          A(ie, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: f[2] || (f[2] = (m) => u(a.value + 1))
          }, {
            default: N(() => [...f[5] || (f[5] = [
              z("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : k("", !0)
      ], 64))
    ]));
  }
}, VI = /* @__PURE__ */ V(bC, [["__scopeId", "data-v-cfa43bf1"]]);
function kC(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ss = { exports: {} }, oi;
function wC() {
  return oi || (oi = 1, (function(e, t) {
    var n = (function() {
      var a = function(I, Q) {
        var W = 236, R = 17, D = I, G = o[Q], _ = null, g = 0, S = null, T = [], L = {}, U = function(H, K) {
          g = D * 4 + 17, _ = (function(F) {
            for (var Y = new Array(F), te = 0; te < F; te += 1) {
              Y[te] = new Array(F);
              for (var ae = 0; ae < F; ae += 1)
                Y[te][ae] = null;
            }
            return Y;
          })(g), J(0, 0), J(g - 7, 0), J(0, g - 7), le(), oe(), xe(H, K), D >= 7 && ke(H), S == null && (S = un(D, G, T)), He(S, K);
        }, J = function(H, K) {
          for (var F = -1; F <= 7; F += 1)
            if (!(H + F <= -1 || g <= H + F))
              for (var Y = -1; Y <= 7; Y += 1)
                K + Y <= -1 || g <= K + Y || (0 <= F && F <= 6 && (Y == 0 || Y == 6) || 0 <= Y && Y <= 6 && (F == 0 || F == 6) || 2 <= F && F <= 4 && 2 <= Y && Y <= 4 ? _[H + F][K + Y] = !0 : _[H + F][K + Y] = !1);
        }, ee = function() {
          for (var H = 0, K = 0, F = 0; F < 8; F += 1) {
            U(!0, F);
            var Y = i.getLostPoint(L);
            (F == 0 || H > Y) && (H = Y, K = F);
          }
          return K;
        }, oe = function() {
          for (var H = 8; H < g - 8; H += 1)
            _[H][6] == null && (_[H][6] = H % 2 == 0);
          for (var K = 8; K < g - 8; K += 1)
            _[6][K] == null && (_[6][K] = K % 2 == 0);
        }, le = function() {
          for (var H = i.getPatternPosition(D), K = 0; K < H.length; K += 1)
            for (var F = 0; F < H.length; F += 1) {
              var Y = H[K], te = H[F];
              if (_[Y][te] == null)
                for (var ae = -2; ae <= 2; ae += 1)
                  for (var de = -2; de <= 2; de += 1)
                    ae == -2 || ae == 2 || de == -2 || de == 2 || ae == 0 && de == 0 ? _[Y + ae][te + de] = !0 : _[Y + ae][te + de] = !1;
            }
        }, ke = function(H) {
          for (var K = i.getBCHTypeNumber(D), F = 0; F < 18; F += 1) {
            var Y = !H && (K >> F & 1) == 1;
            _[Math.floor(F / 3)][F % 3 + g - 8 - 3] = Y;
          }
          for (var F = 0; F < 18; F += 1) {
            var Y = !H && (K >> F & 1) == 1;
            _[F % 3 + g - 8 - 3][Math.floor(F / 3)] = Y;
          }
        }, xe = function(H, K) {
          for (var F = G << 3 | K, Y = i.getBCHTypeInfo(F), te = 0; te < 15; te += 1) {
            var ae = !H && (Y >> te & 1) == 1;
            te < 6 ? _[te][8] = ae : te < 8 ? _[te + 1][8] = ae : _[g - 15 + te][8] = ae;
          }
          for (var te = 0; te < 15; te += 1) {
            var ae = !H && (Y >> te & 1) == 1;
            te < 8 ? _[8][g - te - 1] = ae : te < 9 ? _[8][15 - te - 1 + 1] = ae : _[8][15 - te - 1] = ae;
          }
          _[g - 8][8] = !H;
        }, He = function(H, K) {
          for (var F = -1, Y = g - 1, te = 7, ae = 0, de = i.getMaskFunction(K), ue = g - 1; ue > 0; ue -= 2)
            for (ue == 6 && (ue -= 1); ; ) {
              for (var Me = 0; Me < 2; Me += 1)
                if (_[Y][ue - Me] == null) {
                  var Ae = !1;
                  ae < H.length && (Ae = (H[ae] >>> te & 1) == 1);
                  var me = de(Y, ue - Me);
                  me && (Ae = !Ae), _[Y][ue - Me] = Ae, te -= 1, te == -1 && (ae += 1, te = 7);
                }
              if (Y += F, Y < 0 || g <= Y) {
                Y -= F, F = -F;
                break;
              }
            }
        }, Qe = function(H, K) {
          for (var F = 0, Y = 0, te = 0, ae = new Array(K.length), de = new Array(K.length), ue = 0; ue < K.length; ue += 1) {
            var Me = K[ue].dataCount, Ae = K[ue].totalCount - Me;
            Y = Math.max(Y, Me), te = Math.max(te, Ae), ae[ue] = new Array(Me);
            for (var me = 0; me < ae[ue].length; me += 1)
              ae[ue][me] = 255 & H.getBuffer()[me + F];
            F += Me;
            var Ue = i.getErrorCorrectPolynomial(Ae), Ve = c(ae[ue], Ue.getLength() - 1), Ho = Ve.mod(Ue);
            de[ue] = new Array(Ue.getLength() - 1);
            for (var me = 0; me < de[ue].length; me += 1) {
              var zo = me + Ho.getLength() - de[ue].length;
              de[ue][me] = zo >= 0 ? Ho.getAt(zo) : 0;
            }
          }
          for (var Uo = 0, me = 0; me < K.length; me += 1)
            Uo += K[me].totalCount;
          for (var ja = new Array(Uo), Hn = 0, me = 0; me < Y; me += 1)
            for (var ue = 0; ue < K.length; ue += 1)
              me < ae[ue].length && (ja[Hn] = ae[ue][me], Hn += 1);
          for (var me = 0; me < te; me += 1)
            for (var ue = 0; ue < K.length; ue += 1)
              me < de[ue].length && (ja[Hn] = de[ue][me], Hn += 1);
          return ja;
        }, un = function(H, K, F) {
          for (var Y = f.getRSBlocks(H, K), te = m(), ae = 0; ae < F.length; ae += 1) {
            var de = F[ae];
            te.put(de.getMode(), 4), te.put(de.getLength(), i.getLengthInBits(de.getMode(), H)), de.write(te);
          }
          for (var ue = 0, ae = 0; ae < Y.length; ae += 1)
            ue += Y[ae].dataCount;
          if (te.getLengthInBits() > ue * 8)
            throw "code length overflow. (" + te.getLengthInBits() + ">" + ue * 8 + ")";
          for (te.getLengthInBits() + 4 <= ue * 8 && te.put(0, 4); te.getLengthInBits() % 8 != 0; )
            te.putBit(!1);
          for (; !(te.getLengthInBits() >= ue * 8 || (te.put(W, 8), te.getLengthInBits() >= ue * 8)); )
            te.put(R, 8);
          return Qe(te, Y);
        };
        L.addData = function(H, K) {
          K = K || "Byte";
          var F = null;
          switch (K) {
            case "Numeric":
              F = p(H);
              break;
            case "Alphanumeric":
              F = b(H);
              break;
            case "Byte":
              F = $(H);
              break;
            case "Kanji":
              F = y(H);
              break;
            default:
              throw "mode:" + K;
          }
          T.push(F), S = null;
        }, L.isDark = function(H, K) {
          if (H < 0 || g <= H || K < 0 || g <= K)
            throw H + "," + K;
          return _[H][K];
        }, L.getModuleCount = function() {
          return g;
        }, L.make = function() {
          if (D < 1) {
            for (var H = 1; H < 40; H++) {
              for (var K = f.getRSBlocks(H, G), F = m(), Y = 0; Y < T.length; Y++) {
                var te = T[Y];
                F.put(te.getMode(), 4), F.put(te.getLength(), i.getLengthInBits(te.getMode(), H)), te.write(F);
              }
              for (var ae = 0, Y = 0; Y < K.length; Y++)
                ae += K[Y].dataCount;
              if (F.getLengthInBits() <= ae * 8)
                break;
            }
            D = H;
          }
          U(!1, ee());
        }, L.createTableTag = function(H, K) {
          H = H || 2, K = typeof K > "u" ? H * 4 : K;
          var F = "";
          F += '<table style="', F += " border-width: 0px; border-style: none;", F += " border-collapse: collapse;", F += " padding: 0px; margin: " + K + "px;", F += '">', F += "<tbody>";
          for (var Y = 0; Y < L.getModuleCount(); Y += 1) {
            F += "<tr>";
            for (var te = 0; te < L.getModuleCount(); te += 1)
              F += '<td style="', F += " border-width: 0px; border-style: none;", F += " border-collapse: collapse;", F += " padding: 0px; margin: 0px;", F += " width: " + H + "px;", F += " height: " + H + "px;", F += " background-color: ", F += L.isDark(Y, te) ? "#000000" : "#ffffff", F += ";", F += '"/>';
            F += "</tr>";
          }
          return F += "</tbody>", F += "</table>", F;
        }, L.createSvgTag = function(H, K, F, Y) {
          var te = {};
          typeof arguments[0] == "object" && (te = arguments[0], H = te.cellSize, K = te.margin, F = te.alt, Y = te.title), H = H || 2, K = typeof K > "u" ? H * 4 : K, F = typeof F == "string" ? { text: F } : F || {}, F.text = F.text || null, F.id = F.text ? F.id || "qrcode-description" : null, Y = typeof Y == "string" ? { text: Y } : Y || {}, Y.text = Y.text || null, Y.id = Y.text ? Y.id || "qrcode-title" : null;
          var ae = L.getModuleCount() * H + K * 2, de, ue, Me, Ae, me = "", Ue;
          for (Ue = "l" + H + ",0 0," + H + " -" + H + ",0 0,-" + H + "z ", me += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', me += te.scalable ? "" : ' width="' + ae + 'px" height="' + ae + 'px"', me += ' viewBox="0 0 ' + ae + " " + ae + '" ', me += ' preserveAspectRatio="xMinYMin meet"', me += Y.text || F.text ? ' role="img" aria-labelledby="' + ve([Y.id, F.id].join(" ").trim()) + '"' : "", me += ">", me += Y.text ? '<title id="' + ve(Y.id) + '">' + ve(Y.text) + "</title>" : "", me += F.text ? '<description id="' + ve(F.id) + '">' + ve(F.text) + "</description>" : "", me += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', me += '<path d="', Me = 0; Me < L.getModuleCount(); Me += 1)
            for (Ae = Me * H + K, de = 0; de < L.getModuleCount(); de += 1)
              L.isDark(Me, de) && (ue = de * H + K, me += "M" + ue + "," + Ae + Ue);
          return me += '" stroke="transparent" fill="black"/>', me += "</svg>", me;
        }, L.createDataURL = function(H, K) {
          H = H || 2, K = typeof K > "u" ? H * 4 : K;
          var F = L.getModuleCount() * H + K * 2, Y = K, te = F - K;
          return P(F, F, function(ae, de) {
            if (Y <= ae && ae < te && Y <= de && de < te) {
              var ue = Math.floor((ae - Y) / H), Me = Math.floor((de - Y) / H);
              return L.isDark(Me, ue) ? 0 : 1;
            } else
              return 1;
          });
        }, L.createImgTag = function(H, K, F) {
          H = H || 2, K = typeof K > "u" ? H * 4 : K;
          var Y = L.getModuleCount() * H + K * 2, te = "";
          return te += "<img", te += ' src="', te += L.createDataURL(H, K), te += '"', te += ' width="', te += Y, te += '"', te += ' height="', te += Y, te += '"', F && (te += ' alt="', te += ve(F), te += '"'), te += "/>", te;
        };
        var ve = function(H) {
          for (var K = "", F = 0; F < H.length; F += 1) {
            var Y = H.charAt(F);
            switch (Y) {
              case "<":
                K += "&lt;";
                break;
              case ">":
                K += "&gt;";
                break;
              case "&":
                K += "&amp;";
                break;
              case '"':
                K += "&quot;";
                break;
              default:
                K += Y;
                break;
            }
          }
          return K;
        }, ye = function(H) {
          var K = 1;
          H = typeof H > "u" ? K * 2 : H;
          var F = L.getModuleCount() * K + H * 2, Y = H, te = F - H, ae, de, ue, Me, Ae, me = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, Ue = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, Ve = "";
          for (ae = 0; ae < F; ae += 2) {
            for (ue = Math.floor((ae - Y) / K), Me = Math.floor((ae + 1 - Y) / K), de = 0; de < F; de += 1)
              Ae = "█", Y <= de && de < te && Y <= ae && ae < te && L.isDark(ue, Math.floor((de - Y) / K)) && (Ae = " "), Y <= de && de < te && Y <= ae + 1 && ae + 1 < te && L.isDark(Me, Math.floor((de - Y) / K)) ? Ae += " " : Ae += "█", Ve += H < 1 && ae + 1 >= te ? Ue[Ae] : me[Ae];
            Ve += `
`;
          }
          return F % 2 && H > 0 ? Ve.substring(0, Ve.length - F - 1) + Array(F + 1).join("▀") : Ve.substring(0, Ve.length - 1);
        };
        return L.createASCII = function(H, K) {
          if (H = H || 1, H < 2)
            return ye(K);
          H -= 1, K = typeof K > "u" ? H * 2 : K;
          var F = L.getModuleCount() * H + K * 2, Y = K, te = F - K, ae, de, ue, Me, Ae = Array(H + 1).join("██"), me = Array(H + 1).join("  "), Ue = "", Ve = "";
          for (ae = 0; ae < F; ae += 1) {
            for (ue = Math.floor((ae - Y) / H), Ve = "", de = 0; de < F; de += 1)
              Me = 1, Y <= de && de < te && Y <= ae && ae < te && L.isDark(ue, Math.floor((de - Y) / H)) && (Me = 0), Ve += Me ? Ae : me;
            for (ue = 0; ue < H; ue += 1)
              Ue += Ve + `
`;
          }
          return Ue.substring(0, Ue.length - 1);
        }, L.renderTo2dContext = function(H, K) {
          K = K || 2;
          for (var F = L.getModuleCount(), Y = 0; Y < F; Y++)
            for (var te = 0; te < F; te++)
              H.fillStyle = L.isDark(Y, te) ? "black" : "white", H.fillRect(Y * K, te * K, K, K);
        }, L;
      };
      a.stringToBytesFuncs = {
        default: function(I) {
          for (var Q = [], W = 0; W < I.length; W += 1) {
            var R = I.charCodeAt(W);
            Q.push(R & 255);
          }
          return Q;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(I, Q) {
        var W = (function() {
          for (var D = C(I), G = function() {
            var oe = D.read();
            if (oe == -1) throw "eof";
            return oe;
          }, _ = 0, g = {}; ; ) {
            var S = D.read();
            if (S == -1) break;
            var T = G(), L = G(), U = G(), J = String.fromCharCode(S << 8 | T), ee = L << 8 | U;
            g[J] = ee, _ += 1;
          }
          if (_ != Q)
            throw _ + " != " + Q;
          return g;
        })(), R = 63;
        return function(D) {
          for (var G = [], _ = 0; _ < D.length; _ += 1) {
            var g = D.charCodeAt(_);
            if (g < 128)
              G.push(g);
            else {
              var S = W[D.charAt(_)];
              typeof S == "number" ? (S & 255) == S ? G.push(S) : (G.push(S >>> 8), G.push(S & 255)) : G.push(R);
            }
          }
          return G;
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
        var I = [
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
        ], Q = 1335, W = 7973, R = 21522, D = {}, G = function(_) {
          for (var g = 0; _ != 0; )
            g += 1, _ >>>= 1;
          return g;
        };
        return D.getBCHTypeInfo = function(_) {
          for (var g = _ << 10; G(g) - G(Q) >= 0; )
            g ^= Q << G(g) - G(Q);
          return (_ << 10 | g) ^ R;
        }, D.getBCHTypeNumber = function(_) {
          for (var g = _ << 12; G(g) - G(W) >= 0; )
            g ^= W << G(g) - G(W);
          return _ << 12 | g;
        }, D.getPatternPosition = function(_) {
          return I[_ - 1];
        }, D.getMaskFunction = function(_) {
          switch (_) {
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
              throw "bad maskPattern:" + _;
          }
        }, D.getErrorCorrectPolynomial = function(_) {
          for (var g = c([1], 0), S = 0; S < _; S += 1)
            g = g.multiply(c([1, u.gexp(S)], 0));
          return g;
        }, D.getLengthInBits = function(_, g) {
          if (1 <= g && g < 10)
            switch (_) {
              case s.MODE_NUMBER:
                return 10;
              case s.MODE_ALPHA_NUM:
                return 9;
              case s.MODE_8BIT_BYTE:
                return 8;
              case s.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + _;
            }
          else if (g < 27)
            switch (_) {
              case s.MODE_NUMBER:
                return 12;
              case s.MODE_ALPHA_NUM:
                return 11;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + _;
            }
          else if (g < 41)
            switch (_) {
              case s.MODE_NUMBER:
                return 14;
              case s.MODE_ALPHA_NUM:
                return 13;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + _;
            }
          else
            throw "type:" + g;
        }, D.getLostPoint = function(_) {
          for (var g = _.getModuleCount(), S = 0, T = 0; T < g; T += 1)
            for (var L = 0; L < g; L += 1) {
              for (var U = 0, J = _.isDark(T, L), ee = -1; ee <= 1; ee += 1)
                if (!(T + ee < 0 || g <= T + ee))
                  for (var oe = -1; oe <= 1; oe += 1)
                    L + oe < 0 || g <= L + oe || ee == 0 && oe == 0 || J == _.isDark(T + ee, L + oe) && (U += 1);
              U > 5 && (S += 3 + U - 5);
            }
          for (var T = 0; T < g - 1; T += 1)
            for (var L = 0; L < g - 1; L += 1) {
              var le = 0;
              _.isDark(T, L) && (le += 1), _.isDark(T + 1, L) && (le += 1), _.isDark(T, L + 1) && (le += 1), _.isDark(T + 1, L + 1) && (le += 1), (le == 0 || le == 4) && (S += 3);
            }
          for (var T = 0; T < g; T += 1)
            for (var L = 0; L < g - 6; L += 1)
              _.isDark(T, L) && !_.isDark(T, L + 1) && _.isDark(T, L + 2) && _.isDark(T, L + 3) && _.isDark(T, L + 4) && !_.isDark(T, L + 5) && _.isDark(T, L + 6) && (S += 40);
          for (var L = 0; L < g; L += 1)
            for (var T = 0; T < g - 6; T += 1)
              _.isDark(T, L) && !_.isDark(T + 1, L) && _.isDark(T + 2, L) && _.isDark(T + 3, L) && _.isDark(T + 4, L) && !_.isDark(T + 5, L) && _.isDark(T + 6, L) && (S += 40);
          for (var ke = 0, L = 0; L < g; L += 1)
            for (var T = 0; T < g; T += 1)
              _.isDark(T, L) && (ke += 1);
          var xe = Math.abs(100 * ke / g / g - 50) / 5;
          return S += xe * 10, S;
        }, D;
      })(), u = (function() {
        for (var I = new Array(256), Q = new Array(256), W = 0; W < 8; W += 1)
          I[W] = 1 << W;
        for (var W = 8; W < 256; W += 1)
          I[W] = I[W - 4] ^ I[W - 5] ^ I[W - 6] ^ I[W - 8];
        for (var W = 0; W < 255; W += 1)
          Q[I[W]] = W;
        var R = {};
        return R.glog = function(D) {
          if (D < 1)
            throw "glog(" + D + ")";
          return Q[D];
        }, R.gexp = function(D) {
          for (; D < 0; )
            D += 255;
          for (; D >= 256; )
            D -= 255;
          return I[D];
        }, R;
      })();
      function c(I, Q) {
        if (typeof I.length > "u")
          throw I.length + "/" + Q;
        var W = (function() {
          for (var D = 0; D < I.length && I[D] == 0; )
            D += 1;
          for (var G = new Array(I.length - D + Q), _ = 0; _ < I.length - D; _ += 1)
            G[_] = I[_ + D];
          return G;
        })(), R = {};
        return R.getAt = function(D) {
          return W[D];
        }, R.getLength = function() {
          return W.length;
        }, R.multiply = function(D) {
          for (var G = new Array(R.getLength() + D.getLength() - 1), _ = 0; _ < R.getLength(); _ += 1)
            for (var g = 0; g < D.getLength(); g += 1)
              G[_ + g] ^= u.gexp(u.glog(R.getAt(_)) + u.glog(D.getAt(g)));
          return c(G, 0);
        }, R.mod = function(D) {
          if (R.getLength() - D.getLength() < 0)
            return R;
          for (var G = u.glog(R.getAt(0)) - u.glog(D.getAt(0)), _ = new Array(R.getLength()), g = 0; g < R.getLength(); g += 1)
            _[g] = R.getAt(g);
          for (var g = 0; g < D.getLength(); g += 1)
            _[g] ^= u.gexp(u.glog(D.getAt(g)) + G);
          return c(_, 0).mod(D);
        }, R;
      }
      var f = (function() {
        var I = [
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
        ], Q = function(D, G) {
          var _ = {};
          return _.totalCount = D, _.dataCount = G, _;
        }, W = {}, R = function(D, G) {
          switch (G) {
            case o.L:
              return I[(D - 1) * 4 + 0];
            case o.M:
              return I[(D - 1) * 4 + 1];
            case o.Q:
              return I[(D - 1) * 4 + 2];
            case o.H:
              return I[(D - 1) * 4 + 3];
            default:
              return;
          }
        };
        return W.getRSBlocks = function(D, G) {
          var _ = R(D, G);
          if (typeof _ > "u")
            throw "bad rs block @ typeNumber:" + D + "/errorCorrectionLevel:" + G;
          for (var g = _.length / 3, S = [], T = 0; T < g; T += 1)
            for (var L = _[T * 3 + 0], U = _[T * 3 + 1], J = _[T * 3 + 2], ee = 0; ee < L; ee += 1)
              S.push(Q(U, J));
          return S;
        }, W;
      })(), m = function() {
        var I = [], Q = 0, W = {};
        return W.getBuffer = function() {
          return I;
        }, W.getAt = function(R) {
          var D = Math.floor(R / 8);
          return (I[D] >>> 7 - R % 8 & 1) == 1;
        }, W.put = function(R, D) {
          for (var G = 0; G < D; G += 1)
            W.putBit((R >>> D - G - 1 & 1) == 1);
        }, W.getLengthInBits = function() {
          return Q;
        }, W.putBit = function(R) {
          var D = Math.floor(Q / 8);
          I.length <= D && I.push(0), R && (I[D] |= 128 >>> Q % 8), Q += 1;
        }, W;
      }, p = function(I) {
        var Q = s.MODE_NUMBER, W = I, R = {};
        R.getMode = function() {
          return Q;
        }, R.getLength = function(_) {
          return W.length;
        }, R.write = function(_) {
          for (var g = W, S = 0; S + 2 < g.length; )
            _.put(D(g.substring(S, S + 3)), 10), S += 3;
          S < g.length && (g.length - S == 1 ? _.put(D(g.substring(S, S + 1)), 4) : g.length - S == 2 && _.put(D(g.substring(S, S + 2)), 7));
        };
        var D = function(_) {
          for (var g = 0, S = 0; S < _.length; S += 1)
            g = g * 10 + G(_.charAt(S));
          return g;
        }, G = function(_) {
          if ("0" <= _ && _ <= "9")
            return _.charCodeAt(0) - 48;
          throw "illegal char :" + _;
        };
        return R;
      }, b = function(I) {
        var Q = s.MODE_ALPHA_NUM, W = I, R = {};
        R.getMode = function() {
          return Q;
        }, R.getLength = function(G) {
          return W.length;
        }, R.write = function(G) {
          for (var _ = W, g = 0; g + 1 < _.length; )
            G.put(
              D(_.charAt(g)) * 45 + D(_.charAt(g + 1)),
              11
            ), g += 2;
          g < _.length && G.put(D(_.charAt(g)), 6);
        };
        var D = function(G) {
          if ("0" <= G && G <= "9")
            return G.charCodeAt(0) - 48;
          if ("A" <= G && G <= "Z")
            return G.charCodeAt(0) - 65 + 10;
          switch (G) {
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
              throw "illegal char :" + G;
          }
        };
        return R;
      }, $ = function(I) {
        var Q = s.MODE_8BIT_BYTE, W = a.stringToBytes(I), R = {};
        return R.getMode = function() {
          return Q;
        }, R.getLength = function(D) {
          return W.length;
        }, R.write = function(D) {
          for (var G = 0; G < W.length; G += 1)
            D.put(W[G], 8);
        }, R;
      }, y = function(I) {
        var Q = s.MODE_KANJI, W = a.stringToBytesFuncs.SJIS;
        if (!W)
          throw "sjis not supported.";
        (function(G, _) {
          var g = W(G);
          if (g.length != 2 || (g[0] << 8 | g[1]) != _)
            throw "sjis not supported.";
        })("友", 38726);
        var R = W(I), D = {};
        return D.getMode = function() {
          return Q;
        }, D.getLength = function(G) {
          return ~~(R.length / 2);
        }, D.write = function(G) {
          for (var _ = R, g = 0; g + 1 < _.length; ) {
            var S = (255 & _[g]) << 8 | 255 & _[g + 1];
            if (33088 <= S && S <= 40956)
              S -= 33088;
            else if (57408 <= S && S <= 60351)
              S -= 49472;
            else
              throw "illegal char at " + (g + 1) + "/" + S;
            S = (S >>> 8 & 255) * 192 + (S & 255), G.put(S, 13), g += 2;
          }
          if (g < _.length)
            throw "illegal char at " + (g + 1);
        }, D;
      }, w = function() {
        var I = [], Q = {};
        return Q.writeByte = function(W) {
          I.push(W & 255);
        }, Q.writeShort = function(W) {
          Q.writeByte(W), Q.writeByte(W >>> 8);
        }, Q.writeBytes = function(W, R, D) {
          R = R || 0, D = D || W.length;
          for (var G = 0; G < D; G += 1)
            Q.writeByte(W[G + R]);
        }, Q.writeString = function(W) {
          for (var R = 0; R < W.length; R += 1)
            Q.writeByte(W.charCodeAt(R));
        }, Q.toByteArray = function() {
          return I;
        }, Q.toString = function() {
          var W = "";
          W += "[";
          for (var R = 0; R < I.length; R += 1)
            R > 0 && (W += ","), W += I[R];
          return W += "]", W;
        }, Q;
      }, x = function() {
        var I = 0, Q = 0, W = 0, R = "", D = {}, G = function(g) {
          R += String.fromCharCode(_(g & 63));
        }, _ = function(g) {
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
        return D.writeByte = function(g) {
          for (I = I << 8 | g & 255, Q += 8, W += 1; Q >= 6; )
            G(I >>> Q - 6), Q -= 6;
        }, D.flush = function() {
          if (Q > 0 && (G(I << 6 - Q), I = 0, Q = 0), W % 3 != 0)
            for (var g = 3 - W % 3, S = 0; S < g; S += 1)
              R += "=";
        }, D.toString = function() {
          return R;
        }, D;
      }, C = function(I) {
        var Q = I, W = 0, R = 0, D = 0, G = {};
        G.read = function() {
          for (; D < 8; ) {
            if (W >= Q.length) {
              if (D == 0)
                return -1;
              throw "unexpected end of file./" + D;
            }
            var g = Q.charAt(W);
            if (W += 1, g == "=")
              return D = 0, -1;
            if (g.match(/^\s$/))
              continue;
            R = R << 6 | _(g.charCodeAt(0)), D += 6;
          }
          var S = R >>> D - 8 & 255;
          return D -= 8, S;
        };
        var _ = function(g) {
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
        return G;
      }, q = function(I, Q) {
        var W = I, R = Q, D = new Array(I * Q), G = {};
        G.setPixel = function(T, L, U) {
          D[L * W + T] = U;
        }, G.write = function(T) {
          T.writeString("GIF87a"), T.writeShort(W), T.writeShort(R), T.writeByte(128), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(255), T.writeByte(255), T.writeByte(255), T.writeString(","), T.writeShort(0), T.writeShort(0), T.writeShort(W), T.writeShort(R), T.writeByte(0);
          var L = 2, U = g(L);
          T.writeByte(L);
          for (var J = 0; U.length - J > 255; )
            T.writeByte(255), T.writeBytes(U, J, 255), J += 255;
          T.writeByte(U.length - J), T.writeBytes(U, J, U.length - J), T.writeByte(0), T.writeString(";");
        };
        var _ = function(T) {
          var L = T, U = 0, J = 0, ee = {};
          return ee.write = function(oe, le) {
            if (oe >>> le)
              throw "length over";
            for (; U + le >= 8; )
              L.writeByte(255 & (oe << U | J)), le -= 8 - U, oe >>>= 8 - U, J = 0, U = 0;
            J = oe << U | J, U = U + le;
          }, ee.flush = function() {
            U > 0 && L.writeByte(J);
          }, ee;
        }, g = function(T) {
          for (var L = 1 << T, U = (1 << T) + 1, J = T + 1, ee = S(), oe = 0; oe < L; oe += 1)
            ee.add(String.fromCharCode(oe));
          ee.add(String.fromCharCode(L)), ee.add(String.fromCharCode(U));
          var le = w(), ke = _(le);
          ke.write(L, J);
          var xe = 0, He = String.fromCharCode(D[xe]);
          for (xe += 1; xe < D.length; ) {
            var Qe = String.fromCharCode(D[xe]);
            xe += 1, ee.contains(He + Qe) ? He = He + Qe : (ke.write(ee.indexOf(He), J), ee.size() < 4095 && (ee.size() == 1 << J && (J += 1), ee.add(He + Qe)), He = Qe);
          }
          return ke.write(ee.indexOf(He), J), ke.write(U, J), ke.flush(), le.toByteArray();
        }, S = function() {
          var T = {}, L = 0, U = {};
          return U.add = function(J) {
            if (U.contains(J))
              throw "dup key:" + J;
            T[J] = L, L += 1;
          }, U.size = function() {
            return L;
          }, U.indexOf = function(J) {
            return T[J];
          }, U.contains = function(J) {
            return typeof T[J] < "u";
          }, U;
        };
        return G;
      }, P = function(I, Q, W) {
        for (var R = q(I, Q), D = 0; D < Q; D += 1)
          for (var G = 0; G < I; G += 1)
            R.setPixel(G, D, W(G, D));
        var _ = w();
        R.write(_);
        for (var g = x(), S = _.toByteArray(), T = 0; T < S.length; T += 1)
          g.writeByte(S[T]);
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
  })(Ss)), Ss.exports;
}
var $C = wC();
const xC = /* @__PURE__ */ kC($C), SC = ["width", "height", "viewBox"], MC = ["width", "height"], _C = ["d"], CC = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = M(() => {
      const a = xC(0, "M");
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
      }, null, 8, MC),
      h("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, _C)
    ], 8, SC));
  }
}, GI = /* @__PURE__ */ V(CC, [["__scopeId", "data-v-489f0852"]]), EC = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "window-room",
      "data-window-room": "",
      style: pe({ padding: e.padding })
    }, [
      ne(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, KI = /* @__PURE__ */ V(EC, [["__scopeId", "data-v-47e67f04"]]), AC = {
  class: "list-reader",
  "data-list-reader": ""
}, OC = { class: "list-reader-body" }, TC = {
  key: 0,
  class: "list-reader-group"
}, IC = ["title", "aria-current", "data-row", "onClick"], BC = {
  class: "list-reader-reader",
  "data-reader-pane": ""
}, RC = {
  __name: "ListReaderLayout",
  props: /* @__PURE__ */ mt({
    items: { type: Array, required: !0 },
    listWidth: { type: Number, default: 360 },
    emptyTitle: { type: String, default: "Nothing here yet" },
    pickLine: { type: String, default: "No row chosen" },
    place: { type: Function, default: null },
    // a page that wants its first row read at once, with no row named by the address
    openFirst: { type: Boolean, default: !1 }
  }, {
    chosen: { type: [String, Number], default: null },
    chosenModifiers: {}
  }),
  emits: ["update:chosen"],
  setup(e) {
    const t = e, n = qt(e, "chosen"), a = M(() => t.items.find((f) => f.id === n.value) ?? null), s = M(() => [...new Set(t.items.map((f) => f.group || ""))]), o = (f) => t.items.filter((m) => (m.group || "") === f);
    function l(f) {
      n.value = f.id, Xm(f.id);
    }
    function i(f) {
      const m = t.items.findIndex((b) => b.id === n.value), p = t.items[Math.min(t.items.length - 1, Math.max(0, m + f))];
      p && l(p);
    }
    const u = { ArrowDown: 1, ArrowUp: -1 };
    function c(f) {
      /^(INPUT|TEXTAREA|SELECT)$/.test(f.target.tagName) || !u[f.key] || (f.preventDefault(), i(u[f.key]));
    }
    return ce(() => t.items.length, () => {
      if (n.value !== null) return;
      const f = t.items.find((m) => String(m.id) === pa.value.row) ?? (t.openFirst ? t.items[0] : void 0);
      f && (n.value = f.id);
    }, { immediate: !0 }), (f, m) => (r(), d("div", AC, [
      ne(f.$slots, "top", {}, void 0, !0),
      h("div", OC, [
        h("div", {
          class: "list-reader-list",
          style: pe({ width: `${e.listWidth}px` }),
          tabindex: "0",
          "aria-label": "List",
          "data-reader-list": "",
          onKeydown: c
        }, [
          e.items.length ? k("", !0) : (r(), j(St, {
            key: 0,
            title: e.emptyTitle
          }, {
            default: N(() => [
              ne(f.$slots, "empty", {}, void 0, !0)
            ]),
            _: 3
          }, 8, ["title"])),
          (r(!0), d(B, null, Z(s.value, (p) => (r(), d(B, { key: p }, [
            p ? (r(), d("p", TC, v(p), 1)) : k("", !0),
            (r(!0), d(B, null, Z(o(p), (b) => ge((r(), d("button", {
              key: b.id,
              type: "button",
              class: X(["list-reader-row", { on: b.id === n.value }]),
              title: b.title,
              "aria-current": b.id === n.value,
              "data-reader-row": "",
              "data-row": b.id,
              onClick: ($) => l(b)
            }, [
              A(O2, {
                title: b.title,
                text: b.desc || ""
              }, Ea({ _: 2 }, [
                f.$slots.meta ? {
                  name: "end",
                  fn: N(() => [
                    ne(f.$slots, "meta", { item: b }, void 0, !0)
                  ]),
                  key: "0"
                } : void 0,
                f.$slots.line ? {
                  name: "text",
                  fn: N(() => [
                    ne(f.$slots, "line", { item: b }, void 0, !0)
                  ]),
                  key: "1"
                } : void 0
              ]), 1032, ["title", "text"])
            ], 10, IC)), [
              [O(Et), e.place ? () => e.place(b) : null]
            ])), 128))
          ], 64))), 128))
        ], 36),
        h("div", BC, [
          a.value ? ne(f.$slots, "reader", { item: a.value }, void 0, !0, 0) : e.items.length ? (r(), j(St, {
            key: 1,
            title: e.pickLine
          }, null, 8, ["title"])) : k("", !0)
        ])
      ])
    ]));
  }
}, YI = /* @__PURE__ */ V(RC, [["__scopeId", "data-v-998be0de"]]), LC = {
  class: "reader",
  "data-reader": ""
}, NC = {
  class: "reader-head",
  "data-reader-head": ""
}, qC = { class: "reader-meta" }, DC = {
  key: 0,
  class: "reader-number",
  "data-reader-number": ""
}, PC = { class: "reader-title-line" }, jC = { class: "reader-buttons" }, FC = { class: "reader-body" }, WC = {
  __name: "Reader",
  props: /* @__PURE__ */ mt({
    title: { type: String, required: !0 },
    number: { type: String, default: "" },
    abstract: { type: String, default: "" },
    tabs: { type: Array, default: () => [] },
    facts: { type: Array, default: () => [] }
  }, {
    tab: { type: String, default: "" },
    tabModifiers: {}
  }),
  emits: /* @__PURE__ */ mt(["peek"], ["update:tab"]),
  setup(e, { emit: t }) {
    var u;
    const n = e, a = t, s = qt(e, "tab");
    s.value || (s.value = ((u = n.tabs[0]) == null ? void 0 : u.key) ?? ""), ce(() => n.tabs.map((c) => c.key).join(), () => {
      var c;
      n.tabs.some((f) => f.key === s.value) || (s.value = ((c = n.tabs[0]) == null ? void 0 : c.key) ?? "");
    });
    const o = M(() => n.tabs.map((c) => ({ key: c.key, label: c.label, count_field: c.count != null ? `count_${c.key}` : "" }))), l = M(() => o.value.find((c) => c.key === s.value) ?? null), i = M(() => Object.fromEntries(n.tabs.filter((c) => c.count != null).map((c) => [`count_${c.key}`, c.count])));
    return (c, f) => (r(), d("article", LC, [
      h("header", NC, [
        h("div", qC, [
          e.number ? (r(), d("span", DC, v(e.number), 1)) : k("", !0),
          ne(c.$slots, "agent", {}, void 0, !0)
        ]),
        h("div", PC, [
          A(ju, {
            title: e.title,
            abstract: e.abstract
          }, null, 8, ["title", "abstract"]),
          h("span", jC, [
            ne(c.$slots, "primary", {}, void 0, !0),
            ne(c.$slots, "actions", {}, void 0, !0)
          ])
        ])
      ]),
      e.tabs.length ? (r(), j(g3, {
        key: 0,
        tabs: o.value,
        active: l.value,
        answer: i.value,
        onChoose: f[0] || (f[0] = (m) => s.value = m.key)
      }, null, 8, ["tabs", "active", "answer"])) : k("", !0),
      h("div", FC, [
        e.facts.length ? (r(), j(Fu, {
          key: 0,
          fields: e.facts,
          onPeek: f[1] || (f[1] = (m) => a("peek", m))
        }, null, 8, ["fields"])) : k("", !0),
        A(x3, { tab: l.value }, {
          default: N(() => [
            ne(c.$slots, "default", { tab: s.value }, void 0, !0)
          ]),
          _: 3
        }, 8, ["tab"])
      ])
    ]));
  }
}, QI = /* @__PURE__ */ V(WC, [["__scopeId", "data-v-4511759f"]]), HC = {
  class: "reader-section",
  "data-reader-section": ""
}, zC = { class: "reader-section-title" }, UC = { class: "reader-section-name" }, VC = {
  __name: "ReaderSection",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("section", HC, [
      h("h4", zC, [
        h("span", UC, v(e.title), 1),
        ne(t.$slots, "end", {}, void 0, !0)
      ]),
      ne(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, XI = /* @__PURE__ */ V(VC, [["__scopeId", "data-v-ab40cbe5"]]), GC = {
  class: "reader-timeline",
  "data-reader-timeline": ""
}, KC = { class: "reader-timeline-who" }, YC = { class: "reader-timeline-text" }, QC = {
  key: 0,
  class: "reader-timeline-none"
}, XC = {
  __name: "ReaderTimeline",
  props: { entries: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("ol", GC, [
      (r(!0), d(B, null, Z(e.entries, (a) => (r(), d("li", {
        key: a.id,
        class: "reader-timeline-entry"
      }, [
        h("span", KC, v(a.by), 1),
        A(Ye, {
          class: "reader-timeline-at",
          at: a.at
        }, null, 8, ["at"]),
        h("span", YC, v(a.text), 1)
      ]))), 128)),
      e.entries.length ? k("", !0) : (r(), d("li", QC, "None"))
    ]));
  }
}, JI = /* @__PURE__ */ V(XC, [["__scopeId", "data-v-312caab5"]]), ZI = {
  __name: "ReaderLinks",
  props: { model: { type: String, required: !0 }, id: { type: Number, required: !0 } },
  emits: ["open"],
  setup(e) {
    const t = $e(Be);
    return (n, a) => (r(), j(Mo, {
      model: e.model,
      id: e.id,
      read: O(t).read,
      open: "",
      onOpen: a[0] || (a[0] = (s) => n.$emit("open", s))
    }, null, 8, ["model", "id", "read"]));
  }
}, JC = {
  class: "page-card",
  "data-page-card": ""
}, ZC = { class: "page-card-head" }, eE = {
  key: 0,
  class: "page-card-mark",
  "aria-hidden": "true"
}, tE = { class: "page-card-names" }, nE = ["title"], aE = {
  class: "page-card-state",
  "data-card-state": ""
}, sE = {
  key: 1,
  class: "page-card-corner",
  "data-card-corner": ""
}, oE = ["title"], lE = {
  key: 0,
  class: "page-card-fault",
  role: "alert",
  "data-card-fault": ""
}, iE = {
  class: "page-card-foot",
  "data-card-foot": ""
}, rE = {
  __name: "PageCard",
  props: {
    title: { type: String, required: !0 },
    icon: { type: String, default: "" },
    state: { type: String, default: "" },
    line: { type: String, default: "" },
    fault: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("article", JC, [
      h("header", ZC, [
        e.icon ? (r(), d("span", eE, [
          A(se, {
            name: e.icon,
            size: 16
          }, null, 8, ["name"])
        ])) : k("", !0),
        h("span", tE, [
          h("h3", {
            class: "page-card-title",
            title: e.title
          }, v(e.title), 9, nE),
          h("p", aE, v(e.state || "—"), 1)
        ]),
        t.$slots.corner ? (r(), d("span", sE, [
          ne(t.$slots, "corner", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      h("p", {
        class: "page-card-line",
        "data-card-line": "",
        title: e.line
      }, v(e.line || "—"), 9, oE),
      ne(t.$slots, "default", {}, void 0, !0),
      e.fault ? (r(), d("p", lE, v(e.fault), 1)) : k("", !0),
      h("footer", iE, [
        ne(t.$slots, "foot", {}, void 0, !0),
        n[0] || (n[0] = h("span", { class: "page-card-grow" }, null, -1)),
        ne(t.$slots, "actions", {}, void 0, !0)
      ])
    ]));
  }
}, uE = /* @__PURE__ */ V(rE, [["__scopeId", "data-v-5fb37604"]]), cE = {
  class: "card-page",
  "data-card-page": ""
}, dE = { class: "card-page-body" }, fE = {
  key: 0,
  class: "card-page-group"
}, mE = { class: "card-page-grid" }, hE = {
  __name: "CardPage",
  props: {
    title: { type: String, required: !0 },
    items: { type: Array, required: !0 },
    fields: { type: Array, default: () => [] },
    emptyTitle: { type: String, default: "Nothing here yet" },
    place: { type: Function, default: null }
  },
  setup(e) {
    const t = e, n = E(ba(t.fields)), a = E(""), s = M(() => Pr(t.items, t.fields, n.value, a.value, ["title", "line"])), o = M(() => [...new Set(s.value.map((u) => u.group || ""))]), l = (u) => s.value.filter((c) => (c.group || "") === u), i = () => {
      n.value = ba(t.fields), a.value = "";
    };
    return (u, c) => (r(), d("div", cE, [
      A(V2, {
        title: e.title,
        count: e.items.length
      }, {
        primary: N(() => [
          ne(u.$slots, "primary", {}, void 0, !0)
        ]),
        actions: N(() => [
          ne(u.$slots, "actions", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["title", "count"]),
      A(Wr, {
        modelValue: n.value,
        "onUpdate:modelValue": c[0] || (c[0] = (f) => n.value = f),
        words: a.value,
        "onUpdate:words": c[1] || (c[1] = (f) => a.value = f),
        fields: e.fields,
        rows: e.items,
        shown: s.value.length
      }, null, 8, ["modelValue", "words", "fields", "rows", "shown"]),
      h("div", dE, [
        s.value.length ? k("", !0) : (r(), j(St, {
          key: 0,
          title: e.items.length ? "No match" : e.emptyTitle
        }, {
          default: N(() => [
            e.items.length ? (r(), j(ie, {
              key: 0,
              small: "",
              onClick: i
            }, {
              default: N(() => [...c[2] || (c[2] = [
                z("Clear", -1)
              ])]),
              _: 1
            })) : ne(u.$slots, "empty", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["title"])),
        (r(!0), d(B, null, Z(o.value, (f) => (r(), d(B, { key: f }, [
          f ? (r(), d("p", fE, v(f), 1)) : k("", !0),
          h("div", mE, [
            (r(!0), d(B, null, Z(l(f), (m) => ge((r(), j(uE, {
              key: m.id,
              title: m.title,
              icon: m.icon,
              state: m.state,
              line: m.line,
              fault: m.fault,
              "data-row": m.id
            }, Ea({
              default: N(() => [
                ne(u.$slots, "card", { item: m }, void 0, !0)
              ]),
              _: 2
            }, [
              u.$slots.corner ? {
                name: "corner",
                fn: N(() => [
                  ne(u.$slots, "corner", { item: m }, void 0, !0)
                ]),
                key: "0"
              } : void 0,
              u.$slots.foot ? {
                name: "foot",
                fn: N(() => [
                  ne(u.$slots, "foot", { item: m }, void 0, !0)
                ]),
                key: "1"
              } : void 0,
              u.$slots["card-actions"] ? {
                name: "actions",
                fn: N(() => [
                  ne(u.$slots, "card-actions", { item: m }, void 0, !0)
                ]),
                key: "2"
              } : void 0
            ]), 1032, ["title", "icon", "state", "line", "fault", "data-row"])), [
              [O(Et), e.place ? () => e.place(m) : null]
            ])), 128))
          ])
        ], 64))), 128))
      ])
    ]));
  }
}, eB = /* @__PURE__ */ V(hE, [["__scopeId", "data-v-803a0502"]]), pE = {
  class: "table-layout",
  "data-table-layout": ""
}, vE = { class: "table-layout-body" }, gE = {
  __name: "TableLayout",
  props: {
    columns: { type: Array, required: !0 },
    rows: { type: Array, required: !0 },
    fields: { type: Array, default: () => [] },
    empty: { type: String, default: "No match" },
    pick: { type: Function, default: null },
    active: { type: [String, Number], default: "" }
  },
  setup(e) {
    const t = e, n = E(ba(t.fields)), a = E(""), s = M(() => Pr(t.rows, t.fields, n.value, a.value, t.columns.map((f) => f.key))), o = M(() => t.columns.map((f) => f.label)), l = M(() => t.columns.some((f) => f.width) ? t.columns.map((f) => f.width ?? "1fr") : []), i = (f) => f.ref ?? (t.pick && f.mark !== void 0 ? String(f.mark) : ""), u = M(() => s.value.map((f) => ({ cells: t.columns.map((m) => f[m.key] ?? ""), open: i(f), tone: f.tone ?? "", mark: f.mark, active: t.active !== "" && f.mark === t.active }))), c = (f) => t.pick ? t.pick(f) : Pe(f);
    return (f, m) => (r(), d("div", pE, [
      A(Wr, {
        modelValue: n.value,
        "onUpdate:modelValue": m[0] || (m[0] = (p) => n.value = p),
        words: a.value,
        "onUpdate:words": m[1] || (m[1] = (p) => a.value = p),
        fields: e.fields,
        rows: e.rows,
        shown: s.value.length
      }, null, 8, ["modelValue", "words", "fields", "rows", "shown"]),
      h("div", vE, [
        A(xr, {
          columns: o.value,
          widths: l.value,
          rows: u.value,
          empty: e.empty,
          onOpen: c
        }, null, 8, ["columns", "widths", "rows", "empty"])
      ])
    ]));
  }
}, tB = /* @__PURE__ */ V(gE, [["__scopeId", "data-v-ee2fbabd"]]), yE = ["id", "onUpdate:modelValue", "data-field"], bE = ["value"], kE = ["data-refused"], wE = {
  class: "create-command",
  "data-command-preview": ""
}, $E = {
  key: 0,
  class: "create-refusal",
  role: "alert",
  "data-create-failure": ""
}, xE = { class: "create-actions" }, SE = {
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
    const n = e, a = t, s = (b) => b.value ?? (b.kind === "select" ? b.options[0][0] : ""), o = E(Object.fromEntries(n.fields.map((b) => [b.key, s(b)]))), l = E({}), i = E(""), u = E(!1), c = M(() => n.fields.filter((b) => !b.when || b.when(o.value))), f = M(() => c.value.every((b) => !b.required || String(o.value[b.key]).trim())), m = M(() => n.command(o.value));
    async function p() {
      if (u.value || !f.value || (l.value = n.check(o.value) ?? {}, Object.keys(l.value).length)) return;
      u.value = !0;
      const b = await n.run(o.value);
      u.value = !1, i.value = b.ok ? "" : b.error, b.ok && (a("done", o.value), a("close"));
    }
    return (b, $) => (r(), j(an, {
      padded: "",
      title: e.title,
      fits: "",
      small: "",
      sheet: "",
      onClose: $[1] || ($[1] = (y) => a("close"))
    }, {
      default: N(() => [
        h("form", {
          class: "create-dialog",
          "data-create-dialog": "",
          onSubmit: he(p, ["prevent"])
        }, [
          (r(!0), d(B, null, Z(c.value, (y) => (r(), j(Ni, {
            key: y.key,
            label: y.label,
            help: y.help,
            for: `create-${y.key}`
          }, {
            default: N(() => [
              y.kind === "select" ? ge((r(), d("select", {
                key: 0,
                id: `create-${y.key}`,
                "onUpdate:modelValue": (w) => o.value[y.key] = w,
                "data-field": y.key
              }, [
                (r(!0), d(B, null, Z(y.options, ([w, x]) => (r(), d("option", {
                  key: w,
                  value: w
                }, v(x), 9, bE))), 128))
              ], 8, yE)), [
                [Dt, o.value[y.key]]
              ]) : y.kind === "slot" ? ne(b.$slots, y.key, {
                value: o.value[y.key],
                values: o.value,
                set: (w) => o.value[y.key] = w
              }, void 0, !0, 1) : y.kind === "area" ? (r(), j(qi, {
                key: 2,
                id: `create-${y.key}`,
                value: o.value[y.key],
                placeholder: y.placeholder,
                "data-field": y.key,
                onInput: (w) => o.value[y.key] = w.target.value
              }, null, 8, ["id", "value", "placeholder", "data-field", "onInput"])) : (r(), j(j2, {
                key: 3,
                id: `create-${y.key}`,
                type: y.kind === "password" ? "password" : y.kind === "number" ? "number" : "text",
                "model-value": String(o.value[y.key]),
                placeholder: y.placeholder,
                "data-field": y.key,
                "onUpdate:modelValue": (w) => o.value[y.key] = w
              }, null, 8, ["id", "type", "model-value", "placeholder", "data-field", "onUpdate:modelValue"])),
              l.value[y.key] ? (r(), d("p", {
                key: 4,
                class: "create-refusal",
                role: "alert",
                "data-refused": y.key
              }, v(l.value[y.key]), 9, kE)) : k("", !0)
            ]),
            _: 2
          }, 1032, ["label", "help", "for"]))), 128)),
          h("code", wE, v(m.value), 1),
          i.value ? (r(), d("p", $E, v(i.value), 1)) : k("", !0),
          h("div", xE, [
            A(ie, {
              small: "",
              onClick: $[0] || ($[0] = (y) => a("close"))
            }, {
              default: N(() => [...$[2] || ($[2] = [
                z("Cancel", -1)
              ])]),
              _: 1
            }),
            A(ie, {
              variant: "primary",
              small: "",
              type: "submit",
              disabled: !f.value || u.value,
              busy: u.value,
              "data-create-send": ""
            }, {
              default: N(() => [
                z(v(e.submit), 1)
              ]),
              _: 1
            }, 8, ["disabled", "busy"])
          ])
        ], 32)
      ]),
      _: 3
    }, 8, ["title"]));
  }
}, nB = /* @__PURE__ */ V(SE, [["__scopeId", "data-v-550764d3"]]), ME = ["aria-selected", "data-tab", "onPointerdown", "onAuxclick", "onKeydown"], _E = { class: "pane-tab-label" }, CE = ["aria-label", "onClick"], EE = 1, AE = {
  __name: "EditorTabs",
  props: { tabs: { type: Array, required: !0 }, insertAt: { type: Number, default: -1 }, extra: { type: Function, default: () => [] } },
  emits: ["pick", "close", "grab"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = E(null), o = E(!1);
    let l = null;
    async function i() {
      o.value = !1, await Re(), s.value && (o.value = s.value.scrollWidth > s.value.clientWidth);
    }
    const u = (f) => f.forEach((m) => a("close", m.key)), c = (f, m) => ({
      head: f.title,
      items: [
        { label: "Close", group: "open", keys: "Del", run: () => a("close", f.key) },
        { label: "Close others", group: "open", disabled: n.tabs.length < 2, reason: "Only tab", run: () => u(n.tabs.filter((p) => p !== f)) },
        { label: "Close to the right", group: "open", disabled: m === n.tabs.length - 1, reason: "None", run: () => u(n.tabs.slice(m + 1)) },
        { label: "Close all", group: "open", run: () => u(n.tabs) },
        ...n.extra(f)
      ]
    });
    return ce(() => n.tabs.map((f) => `${f.title}:${f.count ?? ""}`).join("|"), i), _e(() => {
      i(), !(typeof ResizeObserver > "u") && (l = new ResizeObserver(i), l.observe(s.value));
    }), tt(() => l == null ? void 0 : l.disconnect()), (f, m) => (r(), d("div", {
      class: X(["pane-tabs", { compact: o.value }])
    }, [
      h("div", {
        ref_key: "row",
        ref: s,
        class: "pane-tabs-row",
        role: "tablist"
      }, [
        (r(!0), d(B, null, Z(e.tabs, (p, b) => ge((r(), d("div", {
          key: p.key,
          role: "tab",
          tabindex: "0",
          "aria-selected": p.on,
          class: X([
            "pane-tab",
            {
              on: p.on,
              lifting: p.lifting,
              gone: p.gone,
              "insert-before": e.insertAt === b,
              "insert-after": e.insertAt === e.tabs.length && b === e.tabs.length - 1
            }
          ]),
          "data-tab": p.key,
          onPointerdown: ($) => a("grab", $, p.key),
          onMousedown: m[1] || (m[1] = he(() => {
          }, ["middle", "prevent"])),
          onAuxclick: ($) => $.button === EE && (a("close", p.key), $.preventDefault()),
          onKeydown: [
            ze(he(($) => a("pick", p.key), ["prevent"]), ["enter"]),
            ze(he(($) => a("pick", p.key), ["prevent"]), ["space"]),
            ze(he(($) => a("close", p.key), ["prevent"]), ["delete"])
          ]
        }, [
          A(Ct, {
            name: p.icon
          }, null, 8, ["name"]),
          h("span", _E, v(p.title), 1),
          p.count !== void 0 ? (r(), d("span", {
            key: 0,
            class: X(["pane-tab-n", { hot: p.hot }])
          }, v(p.count), 3)) : k("", !0),
          h("button", {
            type: "button",
            class: "pane-tab-x",
            tabindex: "-1",
            "aria-label": `Close ${p.title}`,
            onPointerdown: m[0] || (m[0] = he(() => {
            }, ["stop"])),
            onClick: he(($) => a("close", p.key), ["stop"])
          }, [
            A(se, {
              name: "x",
              size: 10
            })
          ], 40, CE)
        ], 42, ME)), [
          [O(Et), () => c(p, b)]
        ])), 128))
      ], 512),
      ne(f.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, aB = /* @__PURE__ */ V(AE, [["__scopeId", "data-v-6b328f63"]]), OE = { class: "text-list" }, TE = { class: "text-number" }, IE = ["value", "aria-label", "placeholder", "onInput"], BE = { class: "text-moves" }, RE = {
  __name: "TextList",
  props: {
    items: { type: Array, required: !0 },
    kind: { type: String, default: "item" },
    noun: { type: String, default: "Item" },
    placeholder: { type: String, default: "" },
    addLabel: { type: String, default: "Add one" },
    // the last one cannot be removed while the list must not be empty
    keepOne: { type: Boolean, default: !0 }
  },
  emits: ["items"],
  setup(e, { emit: t }) {
    const n = e, a = t;
    function s(i, u) {
      a("items", n.items.map((c, f) => f === i ? u : c));
    }
    function o(i, u) {
      const c = [...n.items], [f] = c.splice(i, 1);
      c.splice(i + u, 0, f), a("items", c);
    }
    const l = (i) => a("items", n.items.filter((u, c) => c !== i));
    return (i, u) => (r(), d(B, null, [
      h("ol", OE, [
        (r(!0), d(B, null, Z(e.items, (c, f) => (r(), d("li", {
          key: f,
          class: "text-card"
        }, [
          h("span", TE, v(f + 1), 1),
          h("textarea", bt({
            value: c,
            rows: "2",
            "aria-label": `${e.noun} ${f + 1}`,
            placeholder: e.placeholder,
            [`data-${e.kind}-text` || ""]: "",
            onInput: (m) => s(f, m.target.value)
          }), null, 16, IE),
          h("div", BE, [
            A(ie, bt({
              small: "",
              disabled: f === 0,
              "aria-label": `Move ${e.noun.toLowerCase()} ${f + 1} up`,
              [`data-${e.kind}-up` || ""]: "",
              onClick: (m) => o(f, -1)
            }), {
              default: N(() => [
                A(se, {
                  name: "up",
                  size: 12
                })
              ]),
              _: 1
            }, 16, ["disabled", "aria-label", "onClick"]),
            A(ie, bt({
              small: "",
              disabled: f === e.items.length - 1,
              "aria-label": `Move ${e.noun.toLowerCase()} ${f + 1} down`,
              [`data-${e.kind}-down` || ""]: "",
              onClick: (m) => o(f, 1)
            }), {
              default: N(() => [
                A(se, {
                  name: "down",
                  size: 12
                })
              ]),
              _: 1
            }, 16, ["disabled", "aria-label", "onClick"]),
            A(ie, bt({
              small: "",
              disabled: e.keepOne && e.items.length === 1,
              "aria-label": `Remove ${e.noun.toLowerCase()} ${f + 1}`,
              [`data-${e.kind}-remove` || ""]: "",
              onClick: (m) => l(f)
            }), {
              default: N(() => [
                A(se, {
                  name: "trash",
                  size: 12
                })
              ]),
              _: 1
            }, 16, ["disabled", "aria-label", "onClick"])
          ])
        ]))), 128))
      ]),
      A(ie, bt({
        small: "",
        bordered: "",
        [`data-${e.kind}-add` || ""]: "",
        onClick: u[0] || (u[0] = (c) => a("items", [...e.items, ""]))
      }), {
        default: N(() => [
          z(v(e.addLabel), 1)
        ]),
        _: 1
      }, 16)
    ], 64));
  }
}, sB = /* @__PURE__ */ V(RE, [["__scopeId", "data-v-432edb9d"]]), oB = {
  __name: "HostedWindow",
  props: { name: { type: String, required: !0 }, options: { type: Object, default: () => ({}) } },
  setup(e) {
    const t = $e(Ta, null), n = at();
    return (a, s) => O(t) ? (r(), j(Cr, {
      key: 0,
      name: e.name,
      catalogue: O(t).catalogue,
      subscriptions: O(t).subscriptions,
      environment: O(n).environment,
      prompts: O(t).prompts,
      "shell-read": O(t).shellRead,
      options: e.options
    }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : k("", !0);
  }
}, LE = ["data-comment"], NE = { class: "comment-who" }, qE = { key: 0 }, DE = {
  key: 1,
  class: "badge-quiet",
  "data-comment-outdated": ""
}, PE = { key: 0 }, jE = { class: "comment-text" }, FE = {
  key: 1,
  class: "comment-who comment-reply"
}, WE = {
  __name: "CommentCard",
  props: { comment: { type: Object, required: !0 }, hot: Boolean },
  emits: ["show"],
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: X(["comment-card", { hot: e.hot }]),
      "data-comment-card": "",
      "data-comment": e.comment.id,
      onClick: n[0] || (n[0] = (a) => t.$emit("show"))
    }, [
      h("div", NE, [
        h("span", {
          class: X(["comment-by", { agent: e.comment.agent }])
        }, v(e.comment.by), 3),
        e.comment.at ? (r(), d("span", qE, v(e.comment.at), 1)) : k("", !0),
        e.comment.outdated ? (r(), d("span", DE, "Lines changed")) : k("", !0)
      ]),
      e.comment.quote ? (r(), d("blockquote", PE, v(e.comment.quote), 1)) : k("", !0),
      h("p", jE, v(e.comment.text), 1),
      e.comment.reply ? (r(), d("div", FE, [
        h("span", null, [
          h("b", null, v(e.comment.reply.by), 1),
          z(": " + v(e.comment.reply.text), 1)
        ])
      ])) : k("", !0)
    ], 10, LE));
  }
}, HE = /* @__PURE__ */ V(WE, [["__scopeId", "data-v-390d0c5e"]]), zE = { class: "rail-head" }, UE = { class: "rail-count" }, VE = { class: "rail-list" }, GE = {
  key: 0,
  class: "rail-empty"
}, KE = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, floating: Boolean, empty: { type: String, default: "No comments" } },
  emits: ["show", "close"],
  setup(e) {
    return (t, n) => (r(), d("aside", {
      class: X(["comment-rail", { floating: e.floating }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      h("div", zE, [
        n[1] || (n[1] = h("h3", null, "Comments", -1)),
        h("span", UE, v(e.comments.length), 1),
        n[2] || (n[2] = h("span", { class: "rail-grow" }, null, -1)),
        A(ie, {
          small: "",
          title: "Hide",
          "aria-label": "Hide the comments",
          "data-rail-close": "",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        }, {
          default: N(() => [
            A(se, {
              name: "close",
              size: 12
            })
          ]),
          _: 1
        })
      ]),
      h("div", VE, [
        e.comments.length ? k("", !0) : (r(), d("p", GE, v(e.empty), 1)),
        (r(!0), d(B, null, Z(e.comments, (a) => (r(), j(HE, {
          key: a.id,
          comment: a,
          hot: e.hot === a.id,
          onShow: (s) => t.$emit("show", a.id)
        }, null, 8, ["comment", "hot", "onShow"]))), 128))
      ])
    ], 2));
  }
}, lB = /* @__PURE__ */ V(KE, [["__scopeId", "data-v-1c625f14"]]), YE = {
  class: "comment-dock",
  "data-comment-box": ""
}, QE = { class: "comment-box" }, XE = ["onKeydown"], JE = {
  key: 0,
  class: "box-quote",
  "data-box-quote": ""
}, ZE = { class: "box-quote-words" }, eA = { class: "box-actions" }, tA = {
  key: 1,
  class: "box-closed"
}, nA = {
  __name: "CommentBox",
  props: { count: { type: Number, default: 0 }, quote: { type: String, default: "" }, placeholder: { type: String, default: "Comment on this file, or pick lines first" }, sending: Boolean },
  emits: ["send", "show", "clear-quote"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = E(!1), l = E(""), i = E(null);
    ce(() => a.quote, (f) => f && u());
    async function u() {
      var f;
      o.value = !0, await Re(), (f = i.value) == null || f.focus();
    }
    t({ openBox: u });
    function c() {
      const f = l.value.trim();
      !f || a.sending || (s("send", f), l.value = "", o.value = !1);
    }
    return (f, m) => (r(), d("div", YE, [
      h("div", QE, [
        o.value ? (r(), d("form", {
          key: 0,
          class: "box-form",
          onSubmit: he(c, ["prevent"]),
          onKeydown: [
            m[3] || (m[3] = ze(he((p) => o.value = !1, ["stop"]), ["esc"])),
            ze(he(c, ["meta", "prevent"]), ["enter"]),
            ze(he(c, ["ctrl", "prevent"]), ["enter"])
          ]
        }, [
          e.quote ? (r(), d("div", JE, [
            m[5] || (m[5] = h("b", null, "On", -1)),
            h("span", ZE, v(e.quote), 1),
            h("button", {
              type: "button",
              class: "box-quote-clear",
              title: "Whole file",
              "aria-label": "Whole file",
              onClick: m[0] || (m[0] = (p) => s("clear-quote"))
            }, [
              A(se, {
                name: "close",
                size: 10
              })
            ])
          ])) : k("", !0),
          ge(h("textarea", {
            ref_key: "field",
            ref: i,
            "onUpdate:modelValue": m[1] || (m[1] = (p) => l.value = p),
            placeholder: "Comment",
            "aria-label": "Comment",
            "data-box-field": ""
          }, null, 512), [
            [Fe, l.value]
          ]),
          h("div", eA, [
            A(ie, {
              small: "",
              onClick: m[2] || (m[2] = (p) => o.value = !1)
            }, {
              default: N(() => [...m[6] || (m[6] = [
                z("Cancel", -1)
              ])]),
              _: 1
            }),
            A(ie, {
              small: "",
              variant: "primary",
              disabled: !l.value.trim() || e.sending,
              "data-box-send": "",
              onClick: c
            }, {
              default: N(() => [...m[7] || (m[7] = [
                z("Send", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ])
        ], 40, XE)) : (r(), d("div", tA, [
          h("button", {
            type: "button",
            class: "box-open",
            "data-box-open": "",
            onClick: u
          }, [
            A(se, {
              name: "chat",
              size: 13
            }),
            h("span", null, v(e.placeholder), 1)
          ]),
          e.count > 0 ? (r(), j(ie, {
            key: 0,
            small: "",
            title: "Comments",
            "aria-label": "Show the comments",
            "data-box-count": "",
            onClick: m[4] || (m[4] = (p) => s("show"))
          }, {
            default: N(() => [
              A(se, {
                name: "chat",
                size: 13
              }),
              z(v(e.count), 1)
            ]),
            _: 1
          })) : k("", !0)
        ]))
      ])
    ]));
  }
}, iB = /* @__PURE__ */ V(nA, [["__scopeId", "data-v-b494c444"]]), rB = Xu(() => import("./VoiceFigure-DDuHIdZP.js").then((e) => e.V)), uB = "1.2.0", cB = "3.5";
export {
  Um as $,
  Oe as A,
  Le as B,
  Na as C,
  pt as D,
  JT as E,
  c8 as F,
  WO as G,
  KT as H,
  zx as I,
  g8 as J,
  zt as K,
  lA as L,
  qo as M,
  x8 as N,
  v8 as O,
  La as P,
  hT as Q,
  wO as R,
  ua as S,
  bT as T,
  mO as U,
  Ie as V,
  wa as W,
  fO as X,
  dO as Y,
  zm as Z,
  V as _,
  aO as a,
  NT as a$,
  w8 as a0,
  $O as a1,
  xO as a2,
  Be as a3,
  RO as a4,
  BO as a5,
  Pt as a6,
  SO as a7,
  VO as a8,
  VA as a9,
  ET as aA,
  dT as aB,
  Bx as aC,
  QO as aD,
  XO as aE,
  ZT as aF,
  vu as aG,
  yT as aH,
  Pn as aI,
  JA as aJ,
  YA as aK,
  WT as aL,
  jn as aM,
  VT as aN,
  FO as aO,
  fT as aP,
  mT as aQ,
  cT as aR,
  En as aS,
  Nt as aT,
  GA as aU,
  x4 as aV,
  rT as aW,
  bO as aX,
  hu as aY,
  en as aZ,
  rn as a_,
  qT as aa,
  zT as ab,
  tO as ac,
  hO as ad,
  pO as ae,
  TO as af,
  IO as ag,
  LO as ah,
  iO as ai,
  Kl as aj,
  MO as ak,
  UO as al,
  aI as am,
  sT as an,
  nT as ao,
  tT as ap,
  NO as aq,
  AO as ar,
  EO as as,
  OO as at,
  gT as au,
  zO as av,
  GO as aw,
  lI as ax,
  gn as ay,
  KO as az,
  R8 as b,
  oI as b$,
  l8 as b0,
  UT as b1,
  $T as b2,
  wT as b3,
  G4 as b4,
  tu as b5,
  BT as b6,
  HO as b7,
  Pa as b8,
  kt as b9,
  ST as bA,
  OT as bB,
  xt as bC,
  kT as bD,
  TT as bE,
  YO as bF,
  oT as bG,
  JO as bH,
  De as bI,
  jO as bJ,
  IT as bK,
  hI as bL,
  pI as bM,
  zA as bN,
  _4 as bO,
  DO as bP,
  MT as bQ,
  sO as bR,
  nI as bS,
  xT as bT,
  _T as bU,
  CT as bV,
  qO as bW,
  Rx as bX,
  PO as bY,
  eT as bZ,
  tI as b_,
  AT as ba,
  ds as bb,
  sr as bc,
  rI as bd,
  dI as be,
  vT as bf,
  FT as bg,
  UA as bh,
  aT as bi,
  uI as bj,
  _O as bk,
  CO as bl,
  uO as bm,
  kO as bn,
  XA as bo,
  PT as bp,
  oO as bq,
  lO as br,
  cO as bs,
  iT as bt,
  y4 as bu,
  GT as bv,
  p8 as bw,
  rO as bx,
  ZA as by,
  lT as bz,
  V4 as c,
  RI as c$,
  QA as c0,
  KA as c1,
  ZO as c2,
  fI as c3,
  Wo as c4,
  mI as c5,
  Tu as c6,
  jT as c7,
  gO as c8,
  vO as c9,
  WI as cA,
  HA as cB,
  MA as cC,
  nb as cD,
  ro as cE,
  aB as cF,
  St as cG,
  cM as cH,
  Oo as cI,
  vI as cJ,
  Wr as cK,
  a$ as cL,
  sA as cM,
  ln as cN,
  Ni as cO,
  zI as cP,
  oB as cQ,
  c1 as cR,
  Si as cS,
  se as cT,
  Li as cU,
  g3 as cV,
  gA as cW,
  uB as cX,
  cB as cY,
  YI as cZ,
  O2 as c_,
  $4 as ca,
  eO as cb,
  m8 as cc,
  uT as cd,
  Ro as ce,
  Ex as cf,
  pT as cg,
  yn as ch,
  Xt as ci,
  Ey as cj,
  Qt as ck,
  $A as cl,
  _A as cm,
  xn as cn,
  II as co,
  ie as cp,
  Cm as cq,
  go as cr,
  eB as cs,
  Ia as ct,
  iB as cu,
  HE as cv,
  lB as cw,
  nB as cx,
  Z0 as cy,
  an as cz,
  et as d,
  qf as d$,
  Hs as d0,
  PA as d1,
  C5 as d2,
  ut as d3,
  We as d4,
  $t as d5,
  Wt as d6,
  CA as d7,
  IA as d8,
  hA as d9,
  nt as dA,
  At as dB,
  d0 as dC,
  Zd as dD,
  Yp as dE,
  qA as dF,
  mA as dG,
  Ft as dH,
  x3 as dI,
  tB as dJ,
  BI as dK,
  D_ as dL,
  UI as dM,
  VI as dN,
  Ra as dO,
  qi as dP,
  j2 as dQ,
  sB as dR,
  Ye as dS,
  rB as dT,
  KI as dU,
  _o as dV,
  MI as dW,
  so as dX,
  h1 as dY,
  xo as dZ,
  yA as d_,
  vd as da,
  i5 as db,
  ya as dc,
  uE as dd,
  V2 as de,
  FI as df,
  bA as dg,
  kA as dh,
  wA as di,
  AA as dj,
  HI as dk,
  GI as dl,
  Co as dm,
  QI as dn,
  ZI as dp,
  XI as dq,
  JI as dr,
  Ud as ds,
  OI as dt,
  xk as du,
  fA as dv,
  FA as dw,
  Fr as dx,
  Mt as dy,
  BA as dz,
  yO as e,
  oA as e$,
  fr as e0,
  Jt as e1,
  on as e2,
  kf as e3,
  Pr as e4,
  PI as e5,
  DI as e6,
  yI as e7,
  uo as e8,
  bf as e9,
  TA as eA,
  SI as eB,
  _I as eC,
  Pe as eD,
  v1 as eE,
  EA as eF,
  yd as eG,
  wI as eH,
  zr as eI,
  xI as eJ,
  fi as eK,
  OA as eL,
  $1 as eM,
  Mn as eN,
  cA as eO,
  w1 as eP,
  Qa as eQ,
  rA as eR,
  wn as eS,
  fo as eT,
  $f as eU,
  vA as eV,
  dt as eW,
  dA as eX,
  RA as eY,
  X8 as eZ,
  gI as e_,
  Oa as ea,
  jt as eb,
  Ds as ec,
  ba as ed,
  SA as ee,
  jI as ef,
  WA as eg,
  LA as eh,
  $i as ei,
  od as ej,
  ld as ek,
  W$ as el,
  jA as em,
  DA as en,
  $I as eo,
  bp as ep,
  bI as eq,
  kI as er,
  uA as es,
  NI as et,
  k5 as eu,
  Nr as ev,
  Rr as ew,
  Jm as ex,
  pA as ey,
  NA as ez,
  g4 as f,
  iA as f0,
  TI as f1,
  pr as f2,
  LI as f3,
  Ur as f4,
  _i as f5,
  I3 as f6,
  oo as f7,
  CI as f8,
  Ms as f9,
  EI as fa,
  xA as fb,
  AI as fc,
  at as fd,
  Et as fe,
  qI as ff,
  wf as fg,
  iI as g,
  An as h,
  YT as i,
  cI as j,
  QT as k,
  DT as l,
  P8 as m,
  Do as n,
  HT as o,
  nO as p,
  XT as q,
  Au as r,
  Ou as s,
  Ee as t,
  Y4 as u,
  RT as v,
  sI as w,
  LT as x,
  Wn as y,
  eI as z
};
