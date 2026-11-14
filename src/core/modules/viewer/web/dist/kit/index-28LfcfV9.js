import { openBlock as r, createElementBlock as d, normalizeStyle as ve, unref as R, renderSlot as re, createElementVNode as m, normalizeClass as Y, Fragment as q, renderList as ne, defineComponent as lu, Comment as iu, h as ma, cloneVNode as ru, createBlock as j, withCtx as P, createVNode as A, toDisplayString as v, createCommentVNode as k, ref as C, inject as Me, watch as pe, onMounted as _e, onBeforeUnmount as at, reactive as Gt, shallowRef as tt, onUnmounted as Ne, useAttrs as pa, computed as x, resolveDynamicComponent as Ye, mergeProps as De, useId as Ds, resolveDirective as uu, withDirectives as Ve, createTextVNode as G, Teleport as wn, nextTick as Fe, Transition as Vt, withModifiers as xe, createApp as cu, shallowReactive as du, withKeys as Et, createSlots as Ul, onScopeDispose as ga, useModel as un, mergeModels as Ft, toRef as Ea, vModelText as ta, resolveComponent as fu, provide as Ps, onErrorCaptured as hu, TransitionGroup as js, isRef as Eo, getCurrentInstance as mu, getCurrentScope as Gl, normalizeProps as ds, guardReactiveProps as Vl, vShow as Kl, useSlots as pu, vModelSelect as Ao, defineAsyncComponent as gu } from "vue";
function Yl(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const z = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, vu = 1600, yu = {
  __name: "Shimmer",
  setup(e) {
    const t = Yl(vu);
    return (n, a) => (r(), d("span", {
      class: "shimmer",
      style: ve(R(t))
    }, null, 4));
  }
}, nn = /* @__PURE__ */ z(yu, [["__scopeId", "data-v-6c018b03"]]), bu = { class: "skeleton-line" }, ku = 2e3, wu = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = Yl(ku);
    return (n, a) => (r(), d("span", bu, [
      re(n.$slots, "default", {}, void 0, !0),
      m("span", {
        class: Y(["bars", { faded: e.filled }])
      }, [
        (r(!0), d(q, null, ne(e.bars, (s) => (r(), d("span", {
          key: s.width,
          class: Y(["bar", { still: e.still }]),
          style: ve({ ...R(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, kt = /* @__PURE__ */ z(wu, [["__scopeId", "data-v-484fe8a0"]]), Kt = lu({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== iu);
      return a.length !== 1 ? ma(q, { key: n }, a) : a[0].key == null ? ru(a[0], { key: n }) : a[0];
    };
  }
}), $u = ["aria-label"], xu = ["aria-label"], Su = ["aria-label"], Mu = ["aria-label"], _u = ["aria-label"], Cu = ["aria-label"], Eu = ["aria-label"], Au = {
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
    return (u, c) => (r(), j(Kt, { value: e.shape }, {
      messages: P(() => [
        m("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(), d(q, null, ne(t, (f) => A(nn, {
            key: f.id,
            class: Y(["skeleton-message", { mine: f.mine }]),
            style: ve({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, $u)
      ]),
      older: P(() => [
        m("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(q, null, ne(t.slice(0, 3), (f) => (r(), j(nn, {
            key: f.id,
            class: Y(["skeleton-message", { mine: f.mine }]),
            style: ve({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, xu)
      ]),
      cards: P(() => [
        m("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(q, null, ne(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (r(), d(q, null, ne(n, (h) => A(kt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Su)
      ]),
      file: P(() => [
        m("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(q, null, ne(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-file"
          }, [
            A(kt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (r(), d(q, null, ne(s, (h) => A(kt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Mu)
      ]),
      page: P(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          A(kt, {
            class: "skeleton-heading",
            bars: i
          }),
          (r(!0), d(q, null, ne(e.count, (f) => (r(), j(kt, {
            key: f,
            bars: R(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, _u)
      ]),
      text: P(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(q, null, ne(e.count, (f) => (r(), j(kt, {
            key: f,
            bars: R(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Cu)
      ]),
      default: P(() => [
        m("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(q, null, ne(e.count, (f) => (r(), j(kt, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Eu)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Xe = /* @__PURE__ */ z(Au, [["__scopeId", "data-v-ef519c5f"]]), Ou = {
  key: 1,
  class: "empty-state titled"
}, Tu = { class: "empty-state-title" }, Iu = { class: "empty-state-text" }, Bu = {
  key: 2,
  class: "empty-state"
}, Ru = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (r(), j(Xe, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (r(), d("div", Ou, [
      m("p", Tu, v(e.title), 1),
      m("p", Iu, [
        re(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (r(), d("p", Bu, [
      re(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, cn = /* @__PURE__ */ z(Ru, [["__scopeId", "data-v-b27e89b0"]]), Nu = { class: "fold-group" }, Lu = ["aria-expanded"], qu = { class: "fold-label" }, Du = {
  key: 0,
  class: "fold-count"
}, Pu = {
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
    return (a, s) => (r(), d("div", Nu, [
      m("button", {
        type: "button",
        class: Y(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        m("span", qu, v(e.label), 1),
        e.count !== "" ? (r(), d("span", Du, v(e.count), 1)) : k("", !0),
        m("span", {
          class: Y(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Lu),
      e.open ? re(a.$slots, "default", {}, void 0, !0, 0) : k("", !0)
    ]));
  }
}, P6 = /* @__PURE__ */ z(Pu, [["__scopeId", "data-v-9ef1865c"]]), ju = 150, Fu = () => ju;
function Fs(e, t, n = Fu(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function Ql(e, t, n) {
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
const Wu = 50, Oo = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function j6(e) {
  const t = st().sources.find((n) => n.key === e);
  return t ? fs(t.read, t.events) : fs("", []);
}
function Xl(e, t, n, a, s = () => !1) {
  const o = C([]), l = C(null), i = C(""), u = C(!1), c = performance.now(), f = C(!1), h = C(""), g = C(null), y = /* @__PURE__ */ new Set();
  let b = null;
  function M(p) {
    return s() ? (y.add(p), b ?? (b = new Promise(($) => setTimeout(() => $(_()), Wu)))) : S(p);
  }
  async function _() {
    const p = new Set(y);
    y.clear(), b = null;
    const $ = W, O = await t({ ids: [...p].join(","), limit: p.size });
    if ($ !== W) return;
    if (!O.ok) return E();
    const B = new Map(O.value.rows.map((F) => [F.id, F]));
    o.value = o.value.flatMap((F) => p.has(F.id) ? B.has(F.id) ? [B.get(F.id)] : [] : [F]);
  }
  async function S(p) {
    const $ = W, O = await t({ "before-id": p + 1, limit: 1 });
    if ($ !== W) return;
    if (!O.ok) return E();
    const B = O.value.rows.find((F) => F.id === p);
    o.value = B ? o.value.map((F) => F.id === p ? B : F) : o.value.filter((F) => F.id !== p);
  }
  async function T(p) {
    if (a() && String((p == null ? void 0 : p.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((J) => J.id !== p.row_id));
    if (a() && (p != null && p.row_id) && !String(p.event ?? "").endsWith(".create") && o.value.some((J) => J.id === p.row_id)) return M(p.row_id);
    if (!(a() && o.value.length && String((p == null ? void 0 : p.event) ?? "").endsWith(".create"))) return E();
    const O = Math.max(...o.value.map((J) => J.id)), B = W, F = await t({ "after-id": O });
    if (B !== W) return;
    if (!F.ok) return E();
    const U = new Set(o.value.map((J) => J.id));
    o.value = [...F.value.rows.filter((J) => !U.has(J.id)), ...o.value];
  }
  async function H() {
    if (!f.value || !o.value.length) return !1;
    const p = W, $ = Math.min(...o.value.map((F) => F.id)), O = await t({ "before-id": $ });
    if (p !== W) return !1;
    if (!O.ok || !O.value.rows.length) return f.value = !1;
    f.value = Oo(O.value, n());
    const B = new Set(o.value.map((F) => F.id));
    return o.value = [...o.value, ...O.value.rows.filter((F) => !B.has(F.id))], !0;
  }
  let W = 0;
  function I(p, $) {
    var F, U;
    const O = p.ok ? e.shared ? [p.value] : ((F = p.value) == null ? void 0 : F.rows) ?? [] : [];
    p.ok && (o.value = $(O)), l.value = p.ok ? p.value : null;
    const B = O.length ? Math.min(...O.map((J) => J.id)) : 0;
    p.ok && ((U = p.value) != null && U.rows) && !o.value.some((J) => J.id < B) && (f.value = !e.shared && Oo(p.value, n())), i.value = p.ok ? "" : p.error, Fs(c, () => u.value = !0);
  }
  async function V(p) {
    const $ = ++W, O = await t({});
    $ === W && I(O, p);
  }
  const L = (p) => {
    if (!a() || !p.length) return p;
    const $ = Math.min(...p.map((B) => B.id)), O = Math.max(...p.map((B) => B.id));
    return [...o.value.filter((B) => B.id > O), ...p, ...o.value.filter((B) => B.id < $)];
  }, E = () => V(L), N = (p) => I(p, L), D = () => V((p) => p);
  async function w(p, $ = null) {
    const O = await Ql($ && { target: o, fields: { value: $(o.value) } }, p, e.run);
    return h.value = O.ok ? "" : O.error, g.value = O.ok ? O.value : null, await E(), O;
  }
  return { rows: o, listing: l, failure: i, loaded: u, more: f, load: E, loadLatest: D, older: H, act: w, actionFailure: h, answer: g, context: e, heard: T, showFirst: N, pageSize: n };
}
const Hu = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function fs(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = st(), l = Xl(s, (u) => s.read(s.shared && !Object.keys(u).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Hu(u)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const zu = 2e3;
function Ws(e, t, n = zu) {
  let a = null, s = !1, o = !1, l = !1;
  const i = Me(Be, null), u = () => {
    var M;
    return ((M = i == null ? void 0 : i.visible) == null ? void 0 : M.value) === !1;
  }, c = () => document.hidden || u(), f = async (M) => {
    o = !0;
    try {
      await M();
    } catch {
    } finally {
      o = !1;
    }
  }, h = () => f(async () => t() && await e()), g = () => {
    s || c() || (a = setTimeout(
      async () => {
        c() || await h(), g();
      },
      typeof n == "function" ? n() : n
    ));
  }, y = async () => {
    l = !0, await f(e), g();
  }, b = async () => {
    if (!(s || c() || o)) {
      if (clearTimeout(a), !l) return y();
      await h(), g();
    }
  };
  pe(() => {
    var M;
    return (M = i == null ? void 0 : i.visible) == null ? void 0 : M.value;
  }, b), _e(async () => {
    document.addEventListener("visibilitychange", b), u() || await y();
  }), at(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", b);
  });
}
const Jl = typeof document < "u" && document.documentElement.classList.contains("phone"), Zl = 120;
var Hl;
const Aa = globalThis[Hl = Symbol.for("journal.pressed")] ?? (globalThis[Hl] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Uu(e = 0) {
  const t = Aa.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, Aa.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, Aa.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function hs(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function ei(e = window) {
  if (!hs(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    hs(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const ms = "journal.stale-build-reload", Gu = 'script[type="module"][src*="/assets/index-"]', To = (e) => {
  var t;
  return ((t = e.querySelector(Gu)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Vu(e = document, t = (a, s) => Ee.quietRead(a, s), n = () => ei(window)) {
  const a = To(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = To(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let Oa = "";
function Ku(e, t = () => ei(window)) {
  if (!e) return !1;
  const n = !!Oa && Oa !== e;
  return Oa = e, n && t(), n;
}
const Yu = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Qu(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(ms) === e.message) return !1;
    t.setItem(ms, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Xu(e = window.sessionStorage) {
  try {
    e.removeItem(ms);
  } catch {
    return;
  }
}
const Ju = 2e3, Zu = 3e4, Ke = Gt({ starting: !1, external: !1, late: !1, offline: !1 }), Hs = () => Ke.starting, ec = 3;
let Bn = 0, ps = 0, ti = 0, ni = [];
async function tc() {
  try {
    const e = await Ee.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ke.external };
  }
}
let Io = null;
const nc = () => Io ?? (Io = tc().finally(() => Io = null));
function ac() {
  clearTimeout(ps), clearTimeout(ti), ps = 0, Object.assign(Ke, { starting: !1, external: !1, late: !1, offline: !1 }), ni.splice(0).forEach((e) => e()), Vu();
}
async function sc() {
  Ke.offline = !navigator.onLine;
  const e = await nc();
  if (Ke.external = e.updating, Bn = !e.restarting && !e.updating && e.reachable ? Bn + 1 : 0, Bn < ec) return;
  Bn = 0, (!Ku(e.started_at) || hs()) && ac();
}
function ai() {
  ps = setTimeout(async () => {
    await sc(), Ke.starting && ai();
  }, Ju);
}
function Bo() {
  Ke.starting || (Ke.starting = !0, Ke.offline = !navigator.onLine, ai(), ti = setTimeout(() => Ke.late = !0, Zu));
}
const si = () => Ke.starting ? new Promise((e) => ni.push(e)) : Promise.resolve();
function zs(e, t, n = 0) {
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
function oc(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class lc {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = zs(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = oc(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const ft = "viewer.shell";
function ic(e = typeof document < "u" ? document.visibilityState : "visible") {
  return e === "hidden";
}
const Rn = 2e4, rc = 4, Ro = "/api/read-lines", uc = 5e3, cc = 403, No = "/api/repeated-lines", dc = 10, fc = 2e3, hc = 3e5, F6 = 6e5, mc = "X-Journal-Window-Hidden", Nn = 6, pc = 500, gc = "/journal/summary", Lo = "/api/server-state", vc = 2e4, Ln = Jl ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, yc = (e) => e.split("?")[0].endsWith(gc), gs = (e, t) => Object.assign(new Error(t), { status: e });
async function bc(e, t, n = gs) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const kc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), wc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), qo = (e) => e.split(" ").slice(0, 2).join(" "), lt = "read", Nt = "write", $c = "stream";
class xc {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = Nn;
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = qo(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one term and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, u]) => o - u < fc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < dc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const i = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(No, { method: "POST", headers: { ...Ln, "Content-Type": "application/json" }, body: i }, [{ window: ft, line: No, kind: Nt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Uu(n ? Zl : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = { ...n, headers: { ...n.headers || {}, [mc]: ic() ? "1" : "0" } }, i = s ? { ...l, signal: wc(n.signal, s) } : l;
    try {
      return await fetch(t, a[0].kind === Nt ? { ...i, priority: "high" } : i);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up; a read is tried once more at once first, since the
  // server closes a connection left idle and the read may have gone out on it; a write is never sent twice
  async sent(t, n, a, s = Rn) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      if (!(o instanceof TypeError)) throw o;
      if ((n.method || "GET") === "GET")
        try {
          return await this.out(t, n, a, s);
        } catch (l) {
          throw l instanceof TypeError && Bo(), l;
        }
      throw Bo(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= rc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(Ro, { headers: Ln }, [{ window: ft, line: Ro, kind: lt }], uc).then(async (t) => {
      if (t.status === cc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw gs(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new lc(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = qo(n.join(" ")), i = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
      this.tries = Nn;
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
    const i = a instanceof FormData, u = { method: t, headers: { ...Ln, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: kc(a) }, c = s || (i ? hc : Rn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, u, [{ window: ft, line: n, kind: lt }], c)) : await this.sent(n, u, [{ window: ft, line: n, kind: Nt }], c);
    } catch (f) {
      if (t !== "GET" || !(f instanceof TypeError) || o <= 1) throw f;
      return await new Promise((h) => setTimeout(h, pc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = Nn, l = {}) {
    this.watcher("sent", t, n, a);
    const i = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return bc(i, `${i.status} ${i.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: ft, line: t, kind: lt }], Rn)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: Ln });
    if (!n.ok) throw gs(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, Nn, o).then((i) => (this.written(n), i)) : Hs() && !yc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: ft, line: t, kind: $c }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Lo, { cache: "no-store" }, [{ window: ft, line: Lo, kind: lt }], vc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = ft, line: s = t, limit: o = Rn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? lt : Nt;
    return l === Nt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const Ta = Symbol.for("journal.transport"), Ee = globalThis[Ta] ?? (globalThis[Ta] = new xc());
class oi {
  constructor() {
    this.following = tt([]), this.held = /* @__PURE__ */ new Set();
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
      n.patterns.some((a) => Us(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Us(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const li = (e, t) => !e.row_id || t.has(e.row_id), Sc = (e, t, n) => {
  var a;
  return !e.row_id || (((a = e.changed_ids) == null ? void 0 : a[t]) ?? []).some((s) => n.has(s));
}, Mc = (e, t, n) => {
  var a, s;
  return !((s = (a = e.changed_ids) == null ? void 0 : a[t]) != null && s.length) || e.changed_ids[t].some((o) => n.has(o));
}, _c = 50, Cc = "refresh", Ec = 1e3, Ac = 3e4, Oc = "requested", Tc = "after_window", Ic = 50, qn = ".*", Bc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function Rc(e) {
  const t = {}, n = Gt({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let u = {}, c = 0, f = 0, h = !1;
  const g = (w) => u[w] ?? u[`${w.slice(0, w.lastIndexOf("."))}.*`] ?? {};
  function y(w) {
    const p = () => g(w), $ = C(void 0), O = Xl(e, async (B) => {
      const F = await _(w, B);
      return F.ok && !Object.keys(B).length && ($.value = F.value), F;
    }, () => p().page_size || Ic, () => !!p().page_size, () => !!p().reads_ids);
    return t[w] = { ...O, data: $, readAt: 0 };
  }
  const b = new Proxy({}, { get: (w, p) => typeof p != "string" || p.startsWith("__v") ? void 0 : t[p] ?? y(p) }), M = (w) => (u[w].loading !== Oc || w.endsWith(qn)) && (!u[w].tab || u[w].tab === n.tab);
  function _(w, p = {}) {
    return new Promise(($) => {
      a.push({ name: w, flags: p, resolve: $ }), a.length === 1 && setTimeout(S);
    });
  }
  async function S() {
    const w = /* @__PURE__ */ new Map(), p = a.splice(0).filter((B) => {
      const F = JSON.stringify(B.flags);
      return w.has(B.name) || w.set(B.name, F), w.get(B.name) === F ? !0 : (a.push(B), !1);
    });
    a.length && setTimeout(S);
    const $ = Object.fromEntries(p.flatMap(({ name: B, flags: F }) => Object.entries(F).map(([U, J]) => [`${B}.${U}`, J]))), O = await e.readKeys({ only: [...new Set(p.map(({ name: B }) => B))], state: { ...n, ...$ } });
    p.forEach(({ name: B, resolve: F }) => F(O.ok ? O.value.keys[B] : O));
  }
  async function T(w) {
    var B;
    const p = ++f;
    (w.length ? w : Object.keys(u).filter((F) => !F.endsWith(qn) && u[F].loading === "first" && M(F))).forEach((F) => l[F] = p);
    const O = await e.readKeys({ only: w, state: { ...n } });
    if (!O.ok) {
      if (O.failure === "cancelled") return !1;
      const F = (w.length ? w : Object.keys(t)).filter((J) => (l[J] ?? 0) <= p);
      F.forEach((J) => {
        b[J].readAt = Date.now(), O.failure === "unreachable" ? i.add(J) : i.delete(J), b[J].showFirst(O);
      });
      const U = O.failure === "unreachable" && ((B = e.waitForServer) == null ? void 0 : B.call(e));
      return U && U.then(() => {
        if (h) return;
        const J = F.filter((oe) => l[oe] === p);
        (J.length || !w.length && !F.length && f === p) && T(J);
      }), !1;
    }
    return N(O.value.declared), Object.entries(O.value.keys).forEach(([F, U]) => {
      (l[F] ?? 0) > p || (l[F] = p, b[F].readAt = Date.now(), i.delete(F), U.ok && (b[F].data.value = U.value), b[F].showFirst(U));
    }), !0;
  }
  function H(w) {
    const p = Bc(w);
    return p.length ? (p.forEach(($) => o.names.add($)), o.answer ?? (o.answer = new Promise(($) => setTimeout(() => {
      const O = [...o.names];
      o.names.clear(), o.answer = null, $(T(O));
    })))) : T([]);
  }
  function W(w) {
    w.forEach((p) => s.add(p)), clearTimeout(c), c = setTimeout(() => {
      const p = [...s];
      s.clear(), p.length && H(p);
    }, _c);
  }
  const I = (w) => w.endsWith(qn) ? Object.keys(t).filter((p) => p.startsWith(w.slice(0, -1)) && t[p].readAt) : [w], V = (w, p) => {
    const $ = g(w).event_column;
    return !$ || Mc(p, $, /* @__PURE__ */ new Set([Number(w.slice(w.lastIndexOf(".") + 1))]));
  }, L = (w) => (u[w] ?? u[`${w.split(".")[0]}.*`]).reload_seconds;
  function E(w) {
    const p = Object.keys(u).filter((O) => w.event === Cc || u[O].events.some((B) => Us(B, w.event)));
    p.filter((O) => u[O].page_size).forEach((O) => b[O].heard(w));
    const $ = p.filter((O) => !u[O].page_size);
    $.filter((O) => !M(O)).forEach((O) => b[O].readAt = 0), W($.filter(M).flatMap(I).filter((O) => V(O, w)));
  }
  function N(w) {
    if (Object.keys(u).length) return;
    u = w;
    const p = [...new Set(Object.values(w).flatMap((O) => O.events))];
    p.length && e.follow(p, E);
    const $ = Object.keys(w).filter((O) => w[O].loading === Tc);
    $.length && T($);
  }
  pe(() => n.tab, () => {
    const w = Object.keys(u).filter((p) => !p.endsWith(qn) && M(p) && !b[p].readAt);
    w.length && T(w);
  }), Ne(() => {
    h = !0, clearTimeout(c);
  });
  function D() {
    const w = Date.now(), p = Object.keys(u).filter(($) => u[$].reload_seconds > 0 && M($)).flatMap(I).filter(($) => w - b[$].readAt >= (i.has($) ? Math.min(L($) * 1e3, Ac) : L($) * 1e3));
    p.length && W(p);
  }
  return Ws(D, () => e.visible.value, Ec), queueMicrotask(() => T([])), { props: b, state: n, reload: H, readKey: _ };
}
const Nc = Symbol("open-view"), Be = Symbol.for("journal.window-context"), ii = Symbol("dock-card"), ri = Symbol.for("journal.inspector-actions");
function Lc(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = Rc(e));
  return Object.defineProperties(e, {
    props: { get: () => n().props },
    state: { get: () => n().state },
    reload: { value: (a) => n().reload(a) },
    readKey: { value: (a, s) => n().readKey(a, s) }
  });
}
function st() {
  const e = Me(Be, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return Lc(e);
}
const qc = (e, t) => e(ii, t), W6 = () => Me(ii), vs = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Do = {
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
  agent: vs,
  worker: vs,
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
}, Dc = ["data-icon", "stroke-width", "innerHTML"], le = {
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
      agent: vs,
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
      style: ve({
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
    }, null, 12, Dc));
  }
}, Pc = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: "spinner",
      style: ve({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, jc = /* @__PURE__ */ z(Pc, [["__scopeId", "data-v-eb453d6f"]]), Fc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = pa(), a = x(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = C(!1), o = x(() => t.busy || s.value), l = Me(Be, null), i = x(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function u(c) {
      const f = [n.onClick].flat().filter(Boolean).map((g) => g(c)).filter((g) => g instanceof Promise);
      if (!f.length) return;
      const h = setTimeout(() => s.value = !0, Zl);
      try {
        await Promise.all(f);
      } finally {
        clearTimeout(h), s.value = !1;
      }
    }
    return (c, f) => (r(), j(Ye(e.href ? "a" : "button"), De(a.value, {
      type: e.href ? void 0 : R(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: i.value,
      onClick: u
    }), {
      default: P(() => [
        m("span", {
          class: Y(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (r(), j(le, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : k("", !0),
          re(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (r(), j(jc, {
          key: 0,
          class: "btn-spinner"
        })) : k("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ge = /* @__PURE__ */ z(Fc, [["__scopeId", "data-v-ededdadf"]]), Wc = ["aria-checked", "aria-haspopup", "onClick"], Hc = {
  key: 0,
  class: "segmented-dot"
}, zc = {
  key: 1,
  class: "segmented-note"
}, Uc = {
  key: 2,
  class: "segmented-count"
}, Gc = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = Ds();
    return (s, o) => {
      const l = uu("tip");
      return r(), d("span", {
        class: Y(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (r(!0), d(q, null, ne(e.options, (i) => Ve((r(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: Y(["segmented-option", { on: i.key === e.value }]),
          onClick: (u) => n("pick", i.key)
        }, [
          i.dot ? (r(), d("span", Hc)) : k("", !0),
          G(" " + v(i.label) + " ", 1),
          i.note ? (r(), d("small", zc, v(i.note), 1)) : k("", !0),
          i.count !== void 0 ? (r(), d("em", Uc, v(i.count), 1)) : k("", !0)
        ], 10, Wc)), [
          [l, i.tip || i.title, `${R(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Wt = /* @__PURE__ */ z(Gc, [["__scopeId", "data-v-c89bc92d"]]), Vc = {
  key: 0,
  class: "more-items"
}, Kc = {
  key: 0,
  role: "alert"
}, Yc = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (r(), d("div", Vc, [
      e.failure ? (r(), d("p", Kc, v(e.failure), 1)) : k("", !0),
      e.more ? (r(), j(ge, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: P(() => [
          G(v(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : k("", !0)
    ])) : k("", !0);
  }
}, $n = /* @__PURE__ */ z(Yc, [["__scopeId", "data-v-10464014"]]), Qc = { class: "link-group" }, Xc = {
  class: "group-label",
  "data-link-kind": ""
}, Jc = ["disabled", "onClick"], Zc = { class: "title" }, ed = { class: "relations" }, td = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(!1), o = x(() => s.value ? n.rows : n.rows.slice(0, 3)), l = x(() => `${n.model.replaceAll("_", " ").replace(/^./, (f) => f.toUpperCase())} ${n.count}`), i = (f) => f.endpoint.unavailable || !f.endpoint.open_ref, u = (f) => ({ [n.linkAttribute]: !0, "data-link-model": f.endpoint.model, "data-link-id": f.endpoint.id }), c = (f) => `${f.endpoint.model === "doc" && f.endpoint.id === n.documentId ? "Design document" : f.endpoint.model.replaceAll("_", " ").replace(/^./, (h) => h.toUpperCase())} ${f.endpoint.id}, ${f.relations.map((h) => h.replaceAll("_", " ")).join(", ")}`;
    return (f, h) => (r(), d("div", Qc, [
      m("div", Xc, v(l.value), 1),
      (r(!0), d(q, null, ne(o.value, (g) => (r(), d("button", De({
        key: `${g.endpoint.model}:${g.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, u(g), {
        disabled: i(g),
        onClick: (y) => a("open", g)
      }), [
        m("span", Zc, v(g.endpoint.title), 1),
        m("span", ed, [
          G(v(c(g)), 1),
          i(g) ? (r(), d(q, { key: 0 }, [
            G(" · Unavailable")
          ], 64)) : k("", !0)
        ])
      ], 16, Jc))), 128)),
      e.rows.length > 3 && !s.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: h[0] || (h[0] = (g) => s.value = !0)
      }, "Show more")) : k("", !0)
    ]));
  }
}, nd = /* @__PURE__ */ z(td, [["__scopeId", "data-v-be6f079c"]]), ad = ["data-loaded"], sd = { class: "rows" }, od = ["disabled", "onClick"], ld = { class: "title" }, id = { class: "relations" }, rd = { key: 2 }, ud = {
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
    const n = e, a = t, s = C([]), o = C({}), l = C(0), i = C(""), u = C(null), c = C(!1), f = C("");
    let h = 0;
    const g = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, y = (E) => g[E] || `${E.replaceAll("_", " ").replace(/^./, (N) => N.toUpperCase())}s`, b = x(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((E, N) => E + N, 0) },
      ...Object.entries(o.value).filter(([E]) => !n.onlyKinds.length || n.onlyKinds.includes(E)).map(([E, N]) => ({ key: E, label: y(E), count: N }))
    ]), M = x(() => {
      const E = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((D) => D.endpoint.model))].map((D) => [D, s.value.filter((w) => w.endpoint.model === D).length])), N = { doc: 0, task: 1, message: 2 };
      return Object.entries(E).sort(([D], [w]) => (N[D] ?? 3) - (N[w] ?? 3)).map(([D, w]) => ({ model: D, count: w, rows: s.value.filter((p) => p.endpoint.model === D) }));
    }), _ = (E) => E.endpoint.unavailable || !E.endpoint.open_ref, S = (E) => ({ [n.linkAttribute]: !0, "data-link-model": E.endpoint.model, "data-link-id": E.endpoint.id }), T = (E) => `${E.endpoint.model === "doc" && E.endpoint.id === n.documentId ? "Design document" : E.endpoint.model.replaceAll("_", " ").replace(/^./, (N) => N.toUpperCase())} ${E.endpoint.id}, ${E.relations.map((N) => N.replaceAll("_", " ")).join(", ")}`;
    async function H(E = 1) {
      const N = ++h;
      c.value = !0, f.value = "";
      const D = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(E), "--page-size", String(n.pageSize)];
      n.outsidePlan && D.push("--outside-plan"), n.documentId && D.push("--first-counterpart", `doc:${n.documentId}`), i.value && D.push("--kind", i.value);
      try {
        const w = await n.read(D);
        if (N !== h) return;
        if (!w.ok) {
          f.value = w.error;
          return;
        }
        const p = w.value.counterparts ?? [], $ = E === 1 ? p : [...s.value, ...p];
        s.value = [...new Map($.map((O) => [`${O.endpoint.model}:${O.endpoint.id}`, O])).values()], o.value = w.value.categories ?? {}, l.value = w.value.total, u.value = w.value.next_page ?? null;
      } catch (w) {
        N === h && (f.value = w.message);
      } finally {
        N === h && (c.value = !1);
      }
    }
    function W(E) {
      if (_(E)) return;
      const [N, D] = E.endpoint.open_ref.split(":");
      a("open", { table: N, id: Number(D) });
    }
    function I(E) {
      i.value = E, H();
    }
    const V = () => !c.value && u.value && H(u.value), L = x(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return pe(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], u.value = null, i.value = "", H();
    }, { immediate: !0 }), (E, N) => s.value.length || c.value || f.value || e.empty ? (r(), d("section", {
      key: 0,
      class: Y(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      b.value.length > 2 ? (r(), j(Wt, {
        key: 0,
        options: b.value,
        value: i.value,
        wrap: "",
        onPick: I
      }, null, 8, ["options", "value"])) : k("", !0),
      m("div", sd, [
        e.grouped ? (r(!0), d(q, { key: 0 }, ne(M.value, (D) => (r(), j(nd, {
          key: D.model,
          model: D.model,
          count: D.count,
          rows: D.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: W
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (r(!0), d(q, { key: 1 }, ne(s.value, (D) => (r(), d("button", De({
          key: `${D.endpoint.model}:${D.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, S(D), {
          disabled: _(D),
          onClick: (w) => W(D)
        }), [
          m("span", ld, v(D.endpoint.title), 1),
          m("span", id, [
            G(v(T(D)), 1),
            _(D) ? (r(), d(q, { key: 0 }, [
              G(" · Unavailable")
            ], 64)) : k("", !0)
          ])
        ], 16, od))), 128)),
        !s.value.length && !c.value && !f.value && e.empty ? (r(), d("p", rd, v(e.empty), 1)) : k("", !0),
        A($n, {
          more: !!u.value,
          loading: c.value,
          failure: f.value,
          label: L.value,
          onMore: V
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, ad)) : k("", !0);
  }
}, cd = /* @__PURE__ */ z(ud, [["__scopeId", "data-v-3b23de37"]]), dd = (e, t, n) => Math.max(t, Math.min(n, e)), fd = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, ui = /* @__PURE__ */ new WeakMap(), hd = (e, t) => ui.set(e, t);
function md(e, t) {
  for (let n = t; n; n = ui.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function ci(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !md(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Ne(() => window.removeEventListener("click", n));
}
const Bt = 8, pd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = C(null), o = (p) => p ? `${p}px` : void 0, l = x(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), i = C({ w: 0, h: 0 }), u = C(a.anchor ? a.anchor.getBoundingClientRect() : null), c = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), f = (p) => ({
      left: Math.max(0, p.left),
      top: Math.max(0, p.top),
      right: Math.min(window.innerWidth, p.right),
      bottom: Math.min(window.innerHeight, p.bottom)
    }), h = (p) => {
      const $ = p.closest(".pane, .float-window");
      return $ ? f($.getBoundingClientRect()) : c();
    }, g = (p, $) => `${Math.max(0, p ? Math.min(p, $) : $)}px`;
    function y(p, $) {
      return {
        below: p.bottom - $.bottom - a.gap - Bt,
        above: $.top - p.top - a.gap - Bt,
        across: p.right - p.left - 2 * Bt
      };
    }
    function b(p) {
      const $ = h(a.anchor), O = y($, p);
      return i.value.w <= O.across && i.value.h <= Math.max(O.below, O.above) ? $ : c();
    }
    const M = x(() => {
      if (!u.value) return l.value;
      const p = u.value, $ = b(p), O = y($, p), { w: B, h: F } = i.value, U = a.align === "auto" ? p.left + p.right > $.left + $.right : a.align === "right", J = dd(U ? p.right - B : p.left, $.left + Bt, Math.max($.left + Bt, $.right - B - Bt)), ue = F > O.below && O.above > O.below ? { bottom: `${window.innerHeight - p.top + a.gap}px`, maxHeight: g(a.maxHeight, O.above) } : { top: `${p.bottom + a.gap}px`, maxHeight: g(a.maxHeight, O.below) };
      return { ...l.value, ...ue, left: `${J}px`, maxWidth: g(a.maxWidth, O.across) };
    }), _ = n, S = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function T(p) {
      const $ = S(), O = $.indexOf(document.activeElement);
      $[(O + p + $.length) % $.length].focus();
    }
    const H = { ArrowDown: () => T(1), ArrowUp: () => T(-1), Escape: () => _("close") }, W = (p) => H[p.key] && (p.preventDefault(), H[p.key]()), I = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let V = 0;
    const L = new ResizeObserver(() => {
      cancelAnimationFrame(V), V = requestAnimationFrame(I);
    });
    ci(s, (p) => a.anchor && !a.anchor.contains(p.target) && _("close"));
    const E = (p, $) => ["top", "left", "right", "bottom"].some((O) => Math.abs(p[O] - $[O]) > 1), N = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let D = 0;
    function w() {
      if (a.anchor) {
        const p = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || N(p)) return _("close");
        E(p, u.value) && (u.value = p);
      }
      D = requestAnimationFrame(w);
    }
    return _e(() => {
      a.anchor && s.value && hd(s.value, a.anchor), I(), s.value && L.observe(s.value), !a.plain && S()[0] && S()[0].focus(), w();
    }), Ne(() => {
      L.disconnect(), cancelAnimationFrame(D), cancelAnimationFrame(V);
    }), t({ element: s }), (p, $) => (r(), j(wn, {
      to: "body",
      disabled: !e.anchor
    }, [
      m("div", De({
        ref_key: "panel",
        ref: s
      }, p.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: M.value,
        onKeydown: W
      }), [
        re(p.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), va = /* @__PURE__ */ z(pd, [["__scopeId", "data-v-3d203970"]]), gd = { class: "split-button" }, vd = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = C(null), s = C(!1), o = () => s.value = !1;
    return (l, i) => (r(), d("span", gd, [
      A(ge, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: i[0] || (i[0] = (u) => n("main"))
      }, {
        default: P(() => [
          re(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      m("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        A(ge, {
          variant: e.variant,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: i[1] || (i[1] = (u) => s.value = !s.value)
        }, {
          default: P(() => [
            A(le, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (r(), j(va, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: P(() => [
          re(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : k("", !0)
    ]));
  }
}, yd = /* @__PURE__ */ z(vd, [["__scopeId", "data-v-c258494d"]]), bd = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, kd = {
  key: 1,
  class: "menu-item-text"
}, wd = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: Y(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (r(), d("span", bd, v(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (r(), d("span", kd, [
        m("span", null, [
          re(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, v(e.description), 1)
      ])) : re(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Ue = /* @__PURE__ */ z(wd, [["__scopeId", "data-v-fec99974"]]), $d = ["aria-expanded"], xd = { class: "drop-label" }, Sd = ["value"], Md = {
  key: 1,
  class: "drop-lead"
}, _d = { class: "drop-item-text" }, Cd = {
  key: 2,
  class: "drop-note"
}, Ed = {
  key: 1,
  class: "drop-none"
}, Ad = {
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
    const n = e, a = t, s = C(!1), o = C(null), l = C(""), i = x(() => {
      const c = l.value.trim().toLowerCase();
      return c ? n.items.filter((f) => `${f.label} ${f.note || ""}`.toLowerCase().includes(c)) : n.items;
    });
    function u(c) {
      s.value = !1, a("pick", c);
    }
    return (c, f) => (r(), d("div", {
      class: Y(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      m("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: Y(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: f[0] || (f[0] = (h) => s.value = !s.value)
      }, [
        e.icon ? (r(), j(le, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : k("", !0),
        m("span", xd, v(e.label), 1),
        A(le, {
          name: "down",
          size: 11
        })
      ], 10, $d),
      s.value ? (r(), j(va, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: f[2] || (f[2] = (h) => s.value = !1)
      }, {
        default: P(() => [
          e.searchable ? (r(), d("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: f[1] || (f[1] = (h) => l.value = h.target.value)
          }, null, 40, Sd)) : k("", !0),
          (r(!0), d(q, null, ne(i.value, (h) => (r(), j(Ue, {
            key: h.key,
            on: h.key === e.picked,
            "data-drop-item": h.key,
            onClick: (g) => u(h)
          }, {
            default: P(() => [
              h.running !== void 0 ? (r(), d("span", {
                key: 0,
                class: Y(["drop-dot", { live: h.running }])
              }, null, 2)) : k("", !0),
              h.lead ? (r(), d("span", Md, v(h.lead), 1)) : k("", !0),
              m("span", _d, v(h.label), 1),
              h.note ? (r(), d("span", Cd, v(h.note), 1)) : k("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? k("", !0) : (r(), d("p", Ed, v(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : k("", !0)
    ], 2));
  }
}, Gs = /* @__PURE__ */ z(Ad, [["__scopeId", "data-v-29dfcce5"]]), Od = 0, Td = "/api/lines", Id = "/api/line", Po = 5e3, jo = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Fo = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), Ia = (e) => JSON.stringify(e.line), Wo = () => new DOMException("cancelled", "AbortError");
class Bd {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(Ia(t))) {
        Ee.whenFree(() => this.readAlone(l));
        return;
      }
      this.waiting.push(l), this.sendSoon();
    });
  }
  // a write always finishes, also when its window has gone: it carries no signal
  write(t) {
    return new Promise((n, a) => this.alone({ body: t, resolve: n, reject: a }, Nt));
  }
  sendSoon() {
    this.timer ?? (this.timer = setTimeout(() => Ee.whenFree(() => this.send()), Od));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(Wo())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(Wo()), n.abort();
    });
    t.forEach((o, l) => {
      var i;
      return (i = o.signal) == null ? void 0 : i.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Ee.sent(Td, jo({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => Fo(i.body, lt)), Po);
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
    await this.alone(t, lt), Date.now() - n < Po ? this.slow.delete(Ia(t.body)) : this.slow.add(Ia(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Ee.sent(Id, jo(t.body, t.signal), [Fo(t.body, n)], n === lt ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const di = new Bd(), Rd = "/api/window";
function Nd(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${Rd}?${o}`, i = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, u = (c) => Ee.whenFree(async () => {
    const f = await Ee.sent(l, { signal: c, headers: i }, [{ window: e, line: l, kind: lt }]);
    if (!f.ok) throw new Error((await f.json()).error);
    return f.json();
  });
  return Ee.joined(`${e} ${n.join(",")} ${o}`, u, s);
}
const fi = /* @__PURE__ */ new Map();
class Ld {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = tt({ buttons: [], missing: {} }), this.loading = tt(!1), this.loaded = tt(!1), this.failed = tt(""), this.pending = null;
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
function H6(e, t) {
  const n = new Ld(e, t);
  return fi.set(e, n), n.load().catch(() => {
  }), n;
}
const Vs = (e) => fi.get(e);
function qd(e, t, n) {
  const a = Vs(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function Dd(e, t) {
  if (!e) return !0;
  const n = Vs(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Pd = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let hi = {};
async function z6(e = (t) => Ee.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (hi = (await t.json()).states);
}
const Ks = (e, t) => {
  var n;
  return (n = hi[e]) == null ? void 0 : n[t];
}, dn = (e, t) => {
  var n;
  return ((n = Ks(e, t)) == null ? void 0 : n.label) ?? Pd(t);
}, mi = (e, t) => {
  var n;
  return ((n = Ks(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, jd = (e, t) => {
  var n;
  return ((n = Ks(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, Fd = Symbol("pane-page"), Ys = Symbol("inspector-host"), pi = { 1: "refused", 2: "usage", 3: "fault" }, Wd = 100, Hd = 50, zd = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, Ud = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function Gd({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: i, options: u = C({}), declared: c = [], page: f = null, setOption: h = () => {
}, autoScroll: g = "", tabs: y = [], sources: b = [], links: M = {}, search: _ = {}, readOnly: S = !1, shared: T = null }) {
  const H = /* @__PURE__ */ new Map(), W = (U, J) => l.follow(e, U, (oe) => {
    H.clear(), J(oe);
  }, a), I = new AbortController(), V = C(!1), L = performance.now();
  let E = 0, N = 0, D = () => {
  };
  const w = new Promise((U) => D = U);
  I.signal.addEventListener("abort", D, { once: !0 });
  const p = () => {
    clearTimeout(N), N = setTimeout(() => {
      E === 0 && Fs(L, () => {
        V.value = !0, D();
      });
    }, Hd);
  }, $ = (U, J) => (E += 1, Mt(e, U, t, I.signal, J).finally(() => {
    E -= 1, p();
  })), O = (U, J) => (p(), w.then(() => I.signal.aborted ? ct : Mt(e, U, t, I.signal, J))), B = ({ only: U = [], state: J = {} } = {}) => (E += 1, Kd(() => Nd(e, t, U, J, I.signal), I.signal).finally(() => {
    E -= 1, p();
  })), F = (U, { unbatched: J = !1, deferred: oe = !1 } = {}) => {
    const ue = H.get(U);
    if (ue && performance.now() - ue.at < Wd) return ue.answer;
    const ke = oe && !V.value ? O(U, J) : $(U, J);
    return H.set(U, { answer: ke, at: performance.now() }), ke;
  };
  return {
    answered: V,
    settle: p,
    window: e,
    environment: t,
    agent: n,
    page: f,
    visible: x(() => a()),
    permissions: s,
    autoScroll: g,
    tabs: y,
    sources: b,
    links: M,
    search: _,
    readOnly: S,
    shared: T,
    read: F,
    readKeys: B,
    waitForServer: () => Hs() ? si() : null,
    run: (U) => Mt(e, U, t, I.signal),
    upload: (U) => Qd(U, e, I.signal),
    cancel: () => I.abort(),
    signal: I.signal,
    subscriptions: l,
    follow: (U, J) => W([U].flat().filter((oe) => o.some((ue) => Us(ue, oe))), J),
    // for a dock of the chat, whose row's term the window cannot declare ahead
    followUndeclared: W,
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (U) => x(() => {
      var J;
      return u.value[U] ?? ((J = c.find((oe) => oe.key === U)) == null ? void 0 : J.default);
    }),
    setting: async (U, J) => {
      const oe = await F(`window setting ${e} ${U}`);
      return oe.ok ? oe.value.value : J;
    },
    setOption: h,
    keep: (U, J) => Mt(e, ["window", "save-setting", e, U, JSON.stringify(J)], t, I.signal)
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
const ct = { ok: !1, failure: "cancelled", error: "" }, Qs = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function vi(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? ct : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: pi[n.code] || "fault", error: gi(n.error) };
  } catch {
    return t != null && t.aborted ? ct : { ok: !1, failure: "unreachable", error: Qs };
  }
}
const Vd = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: pi[e.code] || "fault", error: gi(e.error) };
async function Kd(e, t) {
  try {
    const n = await e();
    return t.aborted ? ct : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, Vd(s)])) } };
  } catch {
    return t.aborted ? ct : { ok: !1, failure: "unreachable", error: Qs };
  }
}
async function yi(e, t, n) {
  const a = await vi(() => di.read(e, t, n), t);
  return a.failure !== "unreachable" || !Hs() ? a : (await si(), t.aborted ? ct : yi(e, t, n));
}
function Mt(e, t, n, a = void 0, s = !1) {
  return Ee.held(() => Yd(e, t, n, a, s), Ee.knownRead(Array.isArray(t) ? t : Xs(t)));
}
async function Yd(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : Xs(t), environment: n };
  return await Ee.isRead(o.line) ? Ee.joined(JSON.stringify(o), (l, i) => yi({ ...o, attribution: i }, l, s), a, o).catch(() => ct) : vi(() => di.write({ ...o, attribution: {
    client_id: Ee.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function Qd(e, t, n = void 0) {
  try {
    const a = await Ee.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? ct : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? ct : { ok: !1, failure: "unreachable", error: Qs };
  }
}
function Xs(e) {
  return [...e.matchAll(zd)].map(([t]) => t.replace(Ud, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Xd = (e) => `show-${e}`, U6 = (e, t, n) => e.filter((a) => {
  var s;
  return n(Xd((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), Js = "messages.chat", Kn = "main", bi = "Main agent", Jd = { main: bi, worker: "Worker", helper: "Helper" }, Zd = "journal-", Zs = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), ef = (e) => Zs(e.replace(Zd, "").replaceAll("-", " ")), tf = (e) => `${e.role} ${e.number}`, nf = (e) => e.role === Kn ? bi : `${Zs(e.role)} ${e.number}`;
function Ht(e, t = e.facts) {
  const n = (t == null ? void 0 : t.profile) || e.profile || "", a = e.role === Kn || !n ? Jd[e.role] ?? Zs(e.role) : ef(n), s = e.role === Kn ? "" : tf(e), o = e.role === Kn ? a : n ? `${a} · ${s}` : `${a} ${e.number}`;
  return { title: a, subtext: s, text: o, name: nf(e) };
}
const af = {
  key: 0,
  class: "agent-failure",
  role: "alert"
}, sf = {
  __name: "ButtonAgentField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C([]), o = C(""), l = x(() => [...s.value].sort((c, f) => +(f.role === n.field.first_role) - +(c.role === n.field.first_role) || c.id - f.id).map((c) => ({ key: String(c.number), label: Ht(c).title, note: Ht(c).subtext }))), i = x(() => l.value.find((c) => c.key === n.value));
    async function u() {
      const c = await Mt(Js, ["agent", "running"], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
    }
    return u(), (c, f) => (r(), d(q, null, [
      A(Gs, {
        label: i.value ? i.value.label : "Choose an agent",
        items: l.value,
        picked: e.value,
        empty: "No agent is running",
        wide: "",
        "data-agent-field": "",
        onPick: f[0] || (f[0] = (h) => a("pick", h.key))
      }, null, 8, ["label", "items", "picked"]),
      o.value ? (r(), d("p", af, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, of = /* @__PURE__ */ z(sf, [["__scopeId", "data-v-d2ea58f1"]]), lf = {
  key: 0,
  class: "template-brief"
}, rf = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, uf = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C([]), o = C(""), l = x(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = x(() => s.value.find((c) => String(c.id) === n.value));
    async function u() {
      const c = await Mt(Js, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const f = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), h = s.value.find((g) => g.title === f);
      h && a("pick", String(h.id));
    }
    return u(), (c, f) => (r(), d(q, null, [
      A(Wt, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: f[0] || (f[0] = (h) => a("pick", h))
      }, null, 8, ["options", "value"]),
      i.value ? (r(), d("p", lf, v(i.value.brief), 1)) : k("", !0),
      o.value ? (r(), d("p", rf, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, cf = /* @__PURE__ */ z(uf, [["__scopeId", "data-v-14be8a5c"]]), df = { class: "info-tip" }, ff = ["aria-label"], hf = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, mf = {
  __name: "InfoTip",
  props: { lines: { type: Array, required: !0 }, label: { type: String, default: "More information" } },
  setup(e) {
    return (t, n) => (r(), d("span", df, [
      m("button", {
        type: "button",
        class: "info-tip-icon",
        "aria-label": e.label,
        "data-info-tip": ""
      }, [
        A(le, {
          name: "info",
          size: 13
        })
      ], 8, ff),
      m("span", hf, [
        (r(!0), d(q, null, ne(e.lines, (a, s) => (r(), d("span", {
          key: s,
          class: "info-tip-line"
        }, v(a), 1))), 128))
      ])
    ]));
  }
}, ki = /* @__PURE__ */ z(mf, [["__scopeId", "data-v-a2fe5ff1"]]), pf = { class: "form-field" }, gf = { class: "form-field-head" }, vf = ["for"], yf = {
  key: 1,
  class: "form-field-aside"
}, bf = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", pf, [
      m("div", gf, [
        m("label", {
          class: "form-field-label",
          for: t.$props.for
        }, v(e.label), 9, vf),
        e.help ? (r(), j(ki, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : k("", !0),
        t.$slots.aside ? (r(), d("span", yf, [
          re(t.$slots, "aside", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      re(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, kf = /* @__PURE__ */ z(bf, [["__scopeId", "data-v-302c40bf"]]), ys = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, wf = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = pa(), n = x(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Ve((r(), d("textarea", De({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [R(ys), R(t).value]
    ]);
  }
}), $f = /* @__PURE__ */ z(wf, [["__scopeId", "data-v-e130a5b9"]]), xf = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ds(), o = x(() => n.field.choices ? "choice" : n.field.target ? "template" : n.field.first_role ? "agent" : "text");
    return (l, i) => (r(), j(kf, {
      label: e.field.label,
      for: R(s),
      "data-button-field": e.field.name
    }, {
      default: P(() => [
        A(Kt, { value: o.value }, {
          choice: P(() => [
            A(Wt, {
              id: R(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (u) => a("pick", u))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: P(() => [
            A(cf, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          agent: P(() => [
            A(of, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[2] || (i[2] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: P(() => [
            A($f, {
              id: R(s),
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
}, ya = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (r(), j(ge, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: P(() => [
        A(le, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Sf(e, t, n, a = () => window) {
  _e(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Ne(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Mf = (e, t = () => !0) => Sf("keydown", (n) => n.key === "Escape" && t() && e());
function wi(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = C(!1), s = x(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Mf(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const _f = 80, Rt = Gt([]);
function $i(e) {
  const t = Symbol("layer"), n = () => Rt.includes(t) && Rt.splice(Rt.indexOf(t), 1);
  return pe(
    e,
    (a) => {
      a && !Rt.includes(t) && Rt.push(t), a || n();
    },
    { immediate: !0 }
  ), Ne(n), x(() => _f + Math.max(0, Rt.indexOf(t)));
}
let xi = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return xi = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Cf = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Ef(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(Cf)];
    if (!l.length) return o.preventDefault();
    const [i, u] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), u.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === u && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  _e(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : xi, document.addEventListener("keydown", s), Fe(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ne(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const Af = ["aria-modal", "aria-label", "aria-labelledby"], Of = {
  key: 0,
  class: "dialog-head"
}, Tf = ["id", "tabindex"], If = {
  key: 1,
  class: "dialog-foot"
}, Bf = 500, Rf = 400, Nf = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = wi(a, n), i = $i(s), u = C(null), c = C(null), f = C(null), h = Ds(), g = C(!1), y = Date.now();
    n.modal && Ef(c, () => a("escape"), f);
    function b() {
      if (!n.modal) return n.closable && o();
      g.value = !0, setTimeout(() => g.value = !1, Rf);
    }
    function M(T) {
      !n.modal || Date.now() - y >= Bf || ![" ", "Enter"].includes(T.key) || (T.preventDefault(), T.stopPropagation());
    }
    const _ = () => u.value && (u.value.scrollTop = u.value.scrollHeight), S = new MutationObserver(_);
    return pe(u, (T) => {
      S.disconnect(), T && n.follow && (S.observe(T, { childList: !0, subtree: !0, characterData: !0 }), _());
    }), Ne(() => S.disconnect()), (T, H) => (r(), j(wn, { to: "body" }, [
      A(Vt, {
        name: "dialog",
        appear: "",
        onAfterLeave: R(l)
      }, {
        default: P(() => [
          R(s) ? (r(), d("div", {
            key: 0,
            class: Y(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ve({ zIndex: R(i) }),
            onClick: xe(b, ["self"])
          }, [
            m("section", {
              ref_key: "panel",
              ref: c,
              class: Y(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, huge: e.huge, sheet: e.sheet, nudged: g.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? R(h) : void 0,
              onKeydownCapture: M
            }, [
              e.bare ? k("", !0) : (r(), d("header", Of, [
                m("h3", {
                  id: R(h),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, v(e.title), 9, Tf),
                e.closable ? (r(), j(ya, {
                  key: 0,
                  onClick: R(o)
                }, null, 8, ["onClick"])) : k("", !0)
              ])),
              m("div", {
                ref_key: "body",
                ref: u,
                class: Y(["dialog-body", { bare: e.bare, padded: e.padded }])
              }, [
                re(T.$slots, "default", {}, void 0, !0)
              ], 2),
              T.$slots.foot ? (r(), d("footer", If, [
                re(T.$slots, "foot", {}, void 0, !0)
              ])) : k("", !0)
            ], 42, Af)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, ba = /* @__PURE__ */ z(Nf, [["__scopeId", "data-v-089c42bc"]]), Lf = {
  class: "action-output",
  "data-action-output": ""
}, qf = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), j(ba, {
      padded: "",
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: P(() => [
        m("pre", Lf, v(e.text), 1)
      ]),
      _: 1
    }));
  }
}, Df = /* @__PURE__ */ z(qf, [["__scopeId", "data-v-b32f94a4"]]);
function Pf(e) {
  const t = document.body.appendChild(document.createElement("div")), n = cu(Df, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const jf = (e, t, n = {}) => Xs(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function xn(e, t, n, a = {}) {
  var s;
  try {
    if (!await Dd(e.module, n)) return { ok: !1, error: "" };
    const o = await Mt(Js, jf(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && Pf(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const Ff = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Ba = [
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
}), ka = {
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
    filters: Ba
  }),
  tasks: we("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: Ba
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
  pins: we("Pin", "band", "One line pinned to the chat while it matters", { filters: Ba }),
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
}, Wf = ["secrets", "plugins"], Si = Object.keys(ka).filter((e) => !(Jl && Wf.includes(e)));
x(() => Si.map((e) => ({ name: e, ...ka[e] })));
const Yt = (e) => ka[e], Mi = new Map(Si.flatMap((e) => [e, e.replace(/s$/, ""), ka[e].title.toLowerCase()].map((t) => [t, e]))), vt = (e) => Mi.get(String(e).toLowerCase()) || "", _i = [...Mi.keys()].sort((e, t) => t.length - e.length).join("|"), Hf = {
  class: "button-form",
  "data-button-form": ""
}, zf = {
  key: 0,
  class: "button-form-title"
}, Uf = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, Gf = { class: "button-form-actions" }, Vf = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(Object.fromEntries(n.button.fields.map((f) => [f.name, f.default || ""]))), o = C(!1), l = C(""), i = x(() => n.button.fields.every((f) => s.value[f.name].trim().length > 0)), u = x(() => {
      var h;
      if (!n.row) return n.button.label;
      const f = ((h = Yt(vt(n.row.term))) == null ? void 0 : h.title) || "Item";
      return `${n.button.label} · ${f} ${n.row.id}`;
    });
    async function c() {
      if (o.value || !i.value) return;
      o.value = !0;
      const f = await xn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = f.ok ? "" : f.error, f.ok && (a("done"), a("close"));
    }
    return (f, h) => (r(), j(ba, {
      padded: "",
      title: u.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: h[1] || (h[1] = (g) => a("close"))
    }, {
      default: P(() => {
        var g;
        return [
          m("div", Hf, [
            (g = e.row) != null && g.title ? (r(), d("p", zf, v(e.row.title), 1)) : k("", !0),
            (r(!0), d(q, null, ne(e.button.fields, (y) => (r(), j(xf, {
              key: y.name,
              field: y,
              value: s.value[y.name],
              environment: e.environment,
              onPick: (b) => s.value[y.name] = b
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (r(), d("p", Uf, v(l.value), 1)) : k("", !0),
            m("div", Gf, [
              A(ge, {
                small: "",
                onClick: h[0] || (h[0] = (y) => a("close"))
              }, {
                default: P(() => [...h[2] || (h[2] = [
                  G("Cancel", -1)
                ])]),
                _: 1
              }),
              A(ge, {
                variant: "primary",
                small: "",
                disabled: !i.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: c
              }, {
                default: P(() => [...h[3] || (h[3] = [
                  G("Send", -1)
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
}, Kf = /* @__PURE__ */ z(Vf, [["__scopeId", "data-v-e3f0d786"]]), Yf = ["aria-busy"], Qf = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, Xf = { class: "button-slot-confirm-text" }, Jf = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Zf = {
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
    const n = e, a = t, s = x(() => Vs(n.environment)), o = x(
      () => {
        var S;
        return !n.readOnly && ((S = s.value) == null ? void 0 : S.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = x(() => {
      var S;
      return !n.readOnly && ((S = s.value) == null ? void 0 : S.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), u = x(() => n.readOnly ? [] : qd(n.environment, n.name, n.row)), c = C(null), f = C(null), h = C(""), g = C(!1), y = (S) => [S.from ? `From ${S.from}` : "", S.tip, S.warning].filter(Boolean).join(" · "), b = (S) => S.icon || (S.warning ? "dot" : "");
    function M(S) {
      if (!(g.value || n.readOnly)) {
        if (S.fields.length) {
          c.value = S;
          return;
        }
        if (S.confirm) {
          f.value = S;
          return;
        }
        return _(S);
      }
    }
    async function _(S) {
      f.value = null, h.value = "", a("failure", ""), g.value = !0;
      const T = await xn(S, n.row, n.environment);
      g.value = !1, h.value = T.ok ? "" : T.error;
      const H = S.label.toLowerCase() + (n.objectName && !S.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", T.ok ? "" : `Could not ${H}: ${T.error}`), T.ok && a("done");
    }
    return (S, T) => (r(), d("span", {
      class: Y(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (r(), d(q, { key: 0 }, [
        T[5] || (T[5] = m("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        A(ge, {
          small: "",
          onClick: i
        }, {
          default: P(() => [...T[4] || (T[4] = [
            G("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && f.value ? (r(), d("span", Qf, [
        m("span", Xf, v(f.value.confirm), 1),
        A(ge, {
          small: "",
          variant: f.value.danger ? "ghost" : "primary",
          bordered: f.value.danger,
          class: Y({ danger: f.value.danger }),
          "data-button-confirm-yes": "",
          onClick: T[0] || (T[0] = (H) => _(f.value))
        }, {
          default: P(() => [
            G(v(f.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        A(ge, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: T[1] || (T[1] = (H) => f.value = null)
        }, {
          default: P(() => [...T[6] || (T[6] = [
            G("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? k("", !0) : (r(), d(q, { key: 2 }, [
        (r(!0), d(q, null, ne(u.value, (H) => (r(), d(q, {
          key: H.name
        }, [
          H.menu.length ? (r(), j(yd, {
            key: 0,
            small: "",
            variant: H.primary ? "primary" : "ghost",
            disabled: g.value,
            "menu-label": H.menu_label || "More ways",
            title: y(H),
            "data-button": H.name,
            onMain: (W) => M(H)
          }, {
            menu: P(({ close: W }) => [
              (r(!0), d(q, null, ne(H.menu, (I) => (r(), j(Ue, {
                key: I.label,
                description: I.description,
                onClick: (V) => (W(), M({ ...H, ...I, menu: [] }))
              }, {
                default: P(() => [
                  G(v(I.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: P(() => [
              G(v(H.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (r(), j(ge, {
            key: 1,
            small: "",
            variant: H.primary ? "primary" : "ghost",
            bordered: !H.primary,
            class: Y({ danger: H.danger }),
            icon: b(H),
            disabled: g.value,
            title: y(H),
            "data-button": H.name,
            onClick: (W) => M(H)
          }, {
            default: P(() => [
              G(v(H.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        h.value && !e.readOnly && !e.externalFailure ? (r(), d("span", Jf, v(h.value), 1)) : k("", !0),
        c.value && !e.readOnly ? (r(), j(Kf, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: T[2] || (T[2] = (H) => c.value = null),
          onDone: T[3] || (T[3] = (H) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : k("", !0)
      ], 64))
    ], 10, Yf));
  }
}, eo = /* @__PURE__ */ z(Zf, [["__scopeId", "data-v-a4b6f174"]]), eh = {
  class: "running",
  "data-running-command": ""
}, th = ["title"], nh = {
  key: "idle",
  class: "running-idle"
}, ah = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (r(), d("span", eh, [
      A(Vt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: P(() => [
          e.text ? (r(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, v(e.text), 9, th)) : (r(), d("span", nh, v(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, G6 = /* @__PURE__ */ z(ah, [["__scopeId", "data-v-d3240219"]]), sh = ["aria-checked", "disabled", "aria-label", "title"], oh = {
  key: 0,
  class: "switch-inner"
}, lh = {
  key: 0,
  class: "switch-word"
}, ih = {
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
      m("span", {
        class: Y(["switch", { on: e.on, labelled: e.labelled, large: e.large, small: e.small }])
      }, [
        e.labelled ? (r(), d("span", oh, v(e.word), 1)) : k("", !0),
        s[1] || (s[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (r(), d("span", lh, v(e.word), 1)) : k("", !0)
    ], 10, sh));
  }
}, V6 = /* @__PURE__ */ z(ih, [["__scopeId", "data-v-92ae7767"]]), rh = { class: "notice-text" }, uh = {
  key: 1,
  class: "notice-actions"
}, ch = {
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
      e.icon ? (r(), j(le, {
        key: 0,
        name: e.icon,
        size: 18
      }, null, 8, ["name"])) : k("", !0),
      m("span", rh, [
        re(n.$slots, "default", {}, void 0, !0)
      ]),
      n.$slots.actions ? (r(), d("span", uh, [
        re(n.$slots, "actions", {}, void 0, !0)
      ])) : k("", !0)
    ], 2));
  }
}, K6 = /* @__PURE__ */ z(ch, [["__scopeId", "data-v-445bd8a6"]]);
function Ci(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function na(e, t) {
  return Ci(() => localStorage, e, t);
}
function Ei(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function to(e, t) {
  return Ei(() => localStorage, e, t);
}
function Ai(e, t) {
  pe(t, (n) => to(e, n), { deep: !0 });
}
function dh(e, t) {
  return Ci(() => sessionStorage, e, t);
}
function fh(e, t) {
  return Ei(() => sessionStorage, e, t);
}
const aa = "journal.environment", Oi = C(dh(aa, na(aa, "")));
function hh(e) {
  Oi.value = e, fh(aa, e), to(aa, e);
}
const sa = C(location.hash), Ho = tt(null), zo = { integrations: "mcp", library: "team" };
function mh() {
  if (!Ho.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (zo[n]) {
    location.replace(`#/${[zo[n], ...a].join("/")}${t ? `?${t}` : ""}`), sa.value = location.hash;
    return;
  }
  !n || Ho.value(n) || (hh(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), sa.value = location.hash);
}
window.addEventListener("hashchange", () => {
  sa.value = location.hash, mh();
});
const bs = x(() => {
  const [e, t = ""] = sa.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [i, u = ""] = l.split("@"), [c = "", f = "", h = ""] = i.split(":");
    return { table: c, id: Number(f), comment: Number(h) || 0, env: u };
  });
  return {
    env: Oi.value,
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
}), no = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${no.page(e)}?open=${t}`
};
function ph(e = "", t = 0, n = "") {
  location.hash = no.page(e, t, n);
}
function gh(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const vh = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Ti(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(vh).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Dt = {};
function Y6(e, t) {
  return Dt[e] = t, () => Dt[e] === t && delete Dt[e];
}
function bt(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Dt[e]) != null && l.call(Dt, t))) return;
  const s = bs.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  Ti([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function yh(e, t, n, a = 0, s = "") {
  if (e === bs.value.env) return bt(t, n, a, s);
  const o = bs.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Ti([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function je(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? yh(a, s, Number(o), 0, t) : bt(s, Number(o), 0, t);
}
function bh(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function qt(e) {
  const t = bh(e);
  t && je(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function Q6(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const kh = { class: "inspector-part" }, wh = { class: "inspector-part-title" }, $h = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("section", kh, [
      m("h4", wh, v(e.title), 1),
      re(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, X6 = /* @__PURE__ */ z($h, [["__scopeId", "data-v-5175e4a3"]]), Uo = /* @__PURE__ */ new Map(), xh = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = C(null), a = C(!1), s = C(t.name && Uo.get(t.name) || !1);
    function o(u) {
      s.value = u, t.name && Uo.set(t.name, u);
    }
    const l = () => {
      const u = !!n.value && n.value.scrollHeight > t.at;
      u !== a.value && (a.value = u);
    }, i = new ResizeObserver(() => requestAnimationFrame(l));
    return _e(() => n.value && i.observe(n.value.firstElementChild || n.value)), Ne(() => i.disconnect()), (u, c) => (r(), d(q, null, [
      m("div", {
        ref_key: "body",
        ref: n,
        class: Y(["folded-body", { folded: a.value && !s.value }]),
        style: ve(a.value && !s.value ? { maxHeight: `${e.keep}px` } : {}),
        onReveal: c[0] || (c[0] = (f) => o(!0))
      }, [
        re(u.$slots, "default", {}, void 0, !0)
      ], 38),
      a.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "fold",
        onClick: c[1] || (c[1] = xe((f) => o(!s.value), ["stop"]))
      }, v(s.value ? "Show less" : "Show more"), 1)) : k("", !0)
    ], 64));
  }
}, Ii = /* @__PURE__ */ z(xh, [["__scopeId", "data-v-4d2235ba"]]), Sh = ["aria-valuenow", "aria-valuemax"], Mh = {
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
      m("span", {
        class: "fill",
        style: ve({ width: n.value })
      }, null, 4)
    ], 10, Sh));
  }
}, Bi = /* @__PURE__ */ z(Mh, [["__scopeId", "data-v-9eba6a85"]]), _h = { processes: "process", memories: "memory", replies: "reply" }, oa = (e) => (_h[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), ks = [], Ch = 2e3, mt = /* @__PURE__ */ new Map(), Eh = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Ah = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Tt(e, { first: t = !1 } = {}) {
  t ? ks.unshift(e) : ks.push(e), mt.clear();
}
function Ri(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Oh = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Th = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function ut(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Ih(e, t) {
  const n = [{ type: "text", text: ut(e).replace(/\r\n/g, `
`) }];
  for (const a of ks)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.type !== "text") continue;
      const l = a(o.text, t);
      typeof l == "string" ? o.text = l : l && n.splice(s, 1, ...l);
    }
  return n;
}
function fn(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Bh(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Bh(e) {
  return e.split(Ah).map((t, n) => n % 2 ? t : t.replace(Eh, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Go(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const Rh = 24;
function Nh(e) {
  const [t, , ...n] = e, a = Go(t), s = n.map(Go), o = (u) => [a, ...s].some((c) => (c[u] ?? "").length > Rh) ? ' class="text-column"' : "", l = a.map((u, c) => `<th${o(c)}>${fn(u)}</th>`).join(""), i = s.map((u) => `<tr>${u.map((c, f) => `<td${o(f)}>${fn(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const Ni = /^\s*(?:[-*+]|\d+[.)])\s+/, ws = /^\s*(\d+)[.)]\s/, Vo = (e) => e.match(/^\s*/)[0].length;
function Li(e) {
  const t = e[0].match(ws), n = Vo(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && Vo(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${fn(o.text)}${o.nested.length ? Li(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function Lh(e, t) {
  const n = ws.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Ni.test(e[s]) && ws.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const Ko = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function qi(e) {
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
      n.push(`<h${i}>${fn(o[2])}</h${i}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (Ko(t, a)) {
      let i = a + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(Nh(t.slice(a, i))), a = i;
      continue;
    }
    if (Ni.test(s)) {
      const i = Lh(t, a);
      n.push(Li(t.slice(a, i))), a = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let i = a;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${qi(
          t.slice(a, i).map((u) => u.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = i;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !Ko(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${fn(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const qh = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Dh = (e) => e.type !== "text" && !qh.test(e.html);
function Ph(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(qi(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : Dh(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function ao(e, t = { env: "" }) {
  const n = Th(e, t), a = mt.get(n);
  if (mt.delete(n), a && a.source === t.source && a.reads.every((l) => Oh(l, t)))
    return mt.set(n, a), a.html;
  const s = [], o = Ph(Ih(e, { ...t, reads: s }));
  return mt.set(n, { html: o, reads: s, source: t.source }), mt.size > Ch && mt.delete(mt.keys().next().value), o;
}
const Ra = /* @__PURE__ */ new WeakMap();
function jh(e) {
  if (Ra.has(e)) return Ra.get(e);
  const t = du(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, f) => `${c}:${f}`;
  function o(c, f) {
    const h = s(c, f), g = e.read(`${oa(c)} show ${f}`);
    n.set(h, g), g.then((y) => {
      n.get(h) === g && (n.delete(h), t.set(h, y.ok ? { ...y.value, table: c } : null));
    });
  }
  function l(c) {
    a.has(c) || (a.add(c), e.follow([`${oa(c).replace(/-/g, "_")}.*`], (f) => {
      const h = `${c}:`;
      for (const g of t.keys()) {
        if (!g.startsWith(h)) continue;
        const y = Number(g.slice(h.length));
        (!f.row_id || f.row_id === y) && o(c, y);
      }
    }));
  }
  function i(c, f) {
    l(c);
    const h = s(c, f);
    return !t.has(h) && !n.has(h) && o(c, f), t.get(h);
  }
  const u = { id: Symbol("window text rows"), row: i };
  return Ra.set(e, u), u;
}
function Di() {
  const e = Me(Be, null), t = e ? jh(e) : null;
  return (n, a = {}) => ao(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Pi = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Sn = (e) => String(e || "").replace(Pi, (t, n, a, s) => s), Fh = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Dn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Wh = /^Traceback \(most recent call last\):/m, Hh = 8;
function ji(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Hh).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function zh(e) {
  const t = [...e.matchAll(Fh)].map((a) => a.index);
  if (Dn.lastIndex = 0, !t.length || !Dn.test(e)) return null;
  Dn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(Dn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: ji(n), tail: "" } : null;
}
function Uh(e) {
  const t = Wh.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: ji([o]), tail: n.slice(s).join(`
`) };
}
Tt((e) => {
  const t = Sn(e), n = Uh(t) || zh(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const la = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Fi = (e) => `${e.table}:${e.id}`, $s = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Na = 80;
function Yo(e) {
  return e.length <= Na ? e : `${e.slice(0, Na + 1).replace(/\s+\S*$/, "") || e.slice(0, Na)}…`;
}
const Qo = {
  messages: (e) => Yo($s(e.text)),
  comments: (e) => Yo($s(e.text)),
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
}, Gh = (e) => (Qo[e.table] ? Qo[e.table](e) : e.title || "") || "", At = (e) => la(e.created_at), Vh = (e) => la(e.updated_at) || At(e), Kh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Yh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Qh(e) {
  const t = Kh.exec(e);
  if (t && vt(t[1])) return { at: t.index, length: t[0].length, table: vt(t[1]), id: Number(t[2]), label: t[3] };
  const n = Yh.exec(e), a = n && vt(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function Xh(e, t, n, a) {
  const s = Ri(a, e, t), o = Sn(s ? Gh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${ut(Yt(e).title)} ${t}</span><span class="row-card-title">${ut(o)}</span></a>`;
}
Tt(
  (e, t) => {
    const n = Qh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: Xh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Jh = /\.(png|jpe?g|gif|webp|svg)$/i, Zh = (e) => Jh.test(e), em = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, tm = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function nm(e, t) {
  const n = em.exec(e), [, a, s, o, l, i] = n || [], u = n && vt(a || o), c = u && Ri(t, u, Number(s || l));
  if (u !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const f = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, h = `${Yt(u).title} ${c.id} · ${ut(i)}`, g = Zh(i) ? `<img class="file-card-image" src="${f}" alt="${ut(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${ut(i)}">${g}<span class="file-card-name">${h}</span></a>` };
}
function am(e) {
  const t = tm.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${ut(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Tt(
  (e, t) => {
    if (t.inline) return null;
    const n = nm(e, t) || am(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const sm = /`([^`\n]+)`/g;
Tt((e) => e.replace(sm, (t, n) => `<code>${n}</code>`));
const Xo = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${no.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Tt(
  (e, t) => e.replace(Pi, (n, a, s, o) => Xo[a] ? Xo[a](s, o, t) : o)
);
const om = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Wi = new RegExp(`\\b(${_i}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Hi = new RegExp(`\\b(${_i}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), lm = new RegExp(`<code>((?:${Wi.source}|${Hi.source}))</code>`, "gi"), im = (e) => e.replace(lm, "$1"), rm = (e, t) => `<a class="row-pill" href="#" data-peek="${vt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, um = (e) => e.replace(Hi, (t, n, a) => a.replace(/\d+/g, (s) => rm(n.replace(/s$/i, ""), s))), cm = (e) => um(e).replace(
  Wi,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${vt(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Tt(
  (e, t) => t.rowNames === !1 ? e : im(e).split(om).map((n, a) => a % 2 ? n : cm(n)).join("")
);
const dm = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, fm = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, hm = /[\w\]]\(/, mm = /^[\w$.[\]'"]+\s*=\s*[^=]/, pm = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, gm = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, vm = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, ym = /[[({,]$/, bm = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, km = /^(\t|\s{2,})\S/, wm = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, $m = /`[^`]+`/, xm = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Sm = /[{}()[\];=<>$&|*\\@+^~%]/g, zi = /^\s*(?:[-*+]|\d+[.)])\s/, Mm = /^\s*>/, _m = /^\s*\|/, Cm = 0.6, Em = 0.4, Am = 5, Om = 0.03, Ui = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Am && t.every((n) => xm.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Sm) ?? []).length / e.length < Om;
}, La = (e) => {
  const t = e.trim();
  return $m.test(t) ? !1 : [dm, fm, hm, mm, pm, gm, vm, ym, bm].some((n) => n.test(t)) || /[;{}]$/.test(t) || km.test(e) && !zi.test(e) && !Ui(e);
};
function Tm(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || zi.test(t[0]) || t.every((o) => Mm.test(o) || _m.test(o))) return "text";
  const n = t.filter((o) => !wm.test(o.trim()));
  if (t.length === 1) return !n.length || La(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(La).length, s = n.filter((o) => !La(o) && Ui(o)).length;
  return a >= n.length * Cm && s <= n.length * Em ? "code" : "text";
}
const xs = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Im = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Bm = `${xs} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Rm = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Nm = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Jo = {
  js: { keywords: xs, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Im, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Bm, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: xs, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Rm, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Nm, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, Lm = {
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
function Zo(e, t, n) {
  return n && e.startsWith(n, t);
}
function qm(e, t) {
  const n = Jo[Lm[t] ?? t] || Jo.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (Zo(e, o, n.line) || n.hash && i === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && Zo(e, o, n.block[0])) {
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
      const f = e.slice(o).match(/^[\w$]+/)[0], h = n.lower ? f.toLowerCase() : f, g = n.property && /^\s*:/.test(e.slice(o + f.length));
      l(a.has(h) ? "keyword" : g ? "property" : /^[A-Z]/.test(f) && t !== "text" ? "type" : "plain", f), o += f.length;
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
function Dm(e, t) {
  const n = [""];
  for (const { type: a, value: s } of qm(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? ut(l) : `<span class="tok-${a}">${ut(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Pm(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const jm = 1500, el = /* @__PURE__ */ new WeakMap();
async function Fm(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Pm(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(el.get(t)), el.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, jm)
  )));
}
typeof document < "u" && document.addEventListener("click", Fm, !0);
const Wm = /\n\s*\n/, Hm = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, zm = /^\s*(`{3,}|~{3,})\s*$/, Um = /^\s{4,}\S/, Gm = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Ss = /^\s*(?:[-*+]|\d+[.)])\s/, Gi = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Vm = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function so(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Km(e) {
  const t = so(e.join(`
`));
  return (Vm.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Ym = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Gi.test(t) && !Ss.test(t);
}, Qm = (e, t) => Ss.test(t) || Ss.test([...e].reverse().find((n) => n.trim()) || "");
function oo(e, t) {
  const n = t || Km(e), a = Dm(so(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function Xm(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && zm.test(s));
  return a < 0 ? e.length : a;
}
function Jm(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return oo(a.map(Sn), n ? n.toLowerCase() : "");
}
function Zm(e) {
  const t = e.split(Wm).map((l) => ({ paragraph: l, type: Tm(so(l).split(`
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
      s(), n.push(oo(i.map(({ paragraph: u }) => u).join(`

`).split(`
`).map(Sn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function ep(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : Zm(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const i = n[l].match(Hm);
    if (i) {
      const c = Xm(n, l, i[2]);
      o(), a.push(Jm(n.slice(l + 1, c), i[1], i[3])), l = c + 1;
      continue;
    }
    const u = Ym(s) ? Gm : Um;
    if (!t && u.test(n[l]) && !Qm(s, n[l])) {
      let c = l;
      for (; c < n.length && (u.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const f = [];
      for (; s.length && s[s.length - 1].trim() && Gi.test(s[s.length - 1].trim()); ) f.unshift(s.pop());
      if (c - l + f.length >= 2) {
        o(), a.push(oo([...f, ...n.slice(l, c)].map(Sn), "")), l = c;
        continue;
      }
      s.push(...f);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Tt((e, t) => ep(e, t.document), { first: !0 });
const tp = ["innerHTML"], np = ["innerHTML"], ap = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Di(), a = x(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (r(), d("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => R(qt) && R(qt)(...l)),
      innerHTML: a.value
    }, null, 8, tp)) : (r(), d("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => R(qt) && R(qt)(...l)),
      innerHTML: a.value
    }, null, 8, np));
  }
}, it = /* @__PURE__ */ z(ap, [["__scopeId", "data-v-d8e75741"]]), J6 = (e) => [...new Set(e.agents.map((t) => t.name))], qa = (e) => new Set(e.agents.map((t) => t.id)).size === 1 ? e.agents[0] : null, sp = "main agent", lo = (e, t) => t ? sp : e, op = ["data-agent-main"], lp = {
  key: 0,
  class: "agent-badge-icon",
  "data-agent-main-icon": "",
  width: "14",
  height: "14",
  viewBox: "0 0 16 16",
  fill: "currentColor",
  "aria-hidden": "true"
}, ip = {
  key: 2,
  class: "agent-badge-name",
  "data-agent-badge-name": ""
}, rp = {
  __name: "AgentBadge",
  props: { name: { type: String, required: !0 }, main: Boolean, iconOnly: Boolean },
  setup(e) {
    const t = e, n = x(() => lo(t.name, t.main));
    return (a, s) => (r(), d("span", {
      class: Y(["agent-badge", { main: e.main }]),
      "data-agent-badge": "",
      "data-agent-main": e.main ? "" : null
    }, [
      e.main ? (r(), d("svg", lp, [...s[0] || (s[0] = [
        m("circle", {
          cx: "8",
          cy: "4.8",
          r: "3.3"
        }, null, -1),
        m("path", { d: "M1.8 14.6c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6c0 .4-.3.7-.7.7H2.5c-.4 0-.7-.3-.7-.7z" }, null, -1)
      ])])) : (r(), j(le, {
        key: 1,
        class: "agent-badge-icon",
        name: "agent",
        size: 14
      })),
      e.iconOnly ? k("", !0) : (r(), d("span", ip, v(n.value), 1))
    ], 10, op));
  }
}, Pt = /* @__PURE__ */ z(rp, [["__scopeId", "data-v-a4c3d1e5"]]), up = ["aria-expanded"], cp = {
  key: 0,
  class: "state-tip",
  role: "tooltip",
  "data-state-tip": ""
}, dp = {
  key: 0,
  class: "tip-failure"
}, fp = { key: 1 }, hp = {
  __name: "StateBadge",
  props: { type: { type: String, required: !0 }, state: { type: String, required: !0 }, rowId: { type: Number, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    const t = e, n = Me(Be, null), a = x(() => jd(t.type, t.state)), s = C(!1), o = C([]), l = C("");
    async function i() {
      s.value = !0;
      const f = await (t.read ?? n.read)(a.value.replace("{row_id}", t.rowId));
      l.value = f.ok ? "" : f.error, f.ok && (o.value = f.value.lines ?? []);
    }
    const u = () => s.value = !1, c = () => s.value ? u() : i();
    return (f, h) => a.value ? (r(), d("span", {
      key: 0,
      class: "state-badge",
      tabindex: "0",
      role: "button",
      "aria-expanded": s.value,
      "data-state-badge": "",
      onMouseenter: i,
      onMouseleave: u,
      onFocus: i,
      onBlur: u,
      onClick: c,
      onKeydown: Et(u, ["escape"])
    }, [
      G(v(R(dn)(e.type, e.state)) + " ", 1),
      s.value ? (r(), d("span", cp, [
        l.value ? (r(), d("span", dp, v(l.value), 1)) : k("", !0),
        (r(!0), d(q, null, ne(o.value, (g) => (r(), d("span", {
          key: g,
          class: "tip-line"
        }, v(g), 1))), 128))
      ])) : k("", !0)
    ], 40, up)) : (r(), d("span", fp, v(R(dn)(e.type, e.state)), 1));
  }
}, mp = /* @__PURE__ */ z(hp, [["__scopeId", "data-v-bf9353d9"]]), pp = {
  class: "plan-details",
  "data-plan-details": ""
}, gp = { class: "state-line" }, vp = {
  key: 0,
  class: "phase-count"
}, yp = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, bp = { class: "text" }, kp = {
  key: 1,
  class: "note",
  "data-plan-waits-on": ""
}, wp = {
  key: 2,
  class: "part",
  "data-plan-progress": ""
}, $p = { class: "overall" }, xp = { class: "overall-figure" }, Sp = {
  key: 3,
  class: "delegation",
  "data-plan-assignee": ""
}, Mp = {
  key: 4,
  class: "delegation",
  "data-plan-delegated": ""
}, _p = {
  key: 5,
  class: "part"
}, Cp = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    return (t, n) => {
      var a;
      return r(), d("div", pp, [
        m("div", gp, [
          A(mp, {
            type: "plan",
            state: e.plan.state,
            "row-id": e.plan.id,
            read: e.read,
            class: Y(["status", R(mi)("plan", e.plan.state)]),
            "data-plan-status": ""
          }, null, 8, ["state", "row-id", "read", "class"]),
          e.plan.current_phase ? (r(), d("span", vp, "Phase " + v(e.plan.current_phase) + " of " + v(e.plan.phases.length), 1)) : k("", !0)
        ]),
        e.plan.reason ? (r(), d("section", yp, [
          m("h4", null, v(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
          m("p", bp, v(e.plan.reason), 1)
        ])) : k("", !0),
        (a = e.plan.blocker_ids) != null && a.length ? (r(), d("p", kp, "Opens by itself when " + v(e.plan.blocker_ids.map((s) => `plan ${s}`).join(" and ")) + " " + v(e.plan.blocker_ids.length === 1 ? "ends" : "have ended") + ".", 1)) : k("", !0),
        e.plan.total ? (r(), d("section", wp, [
          n[0] || (n[0] = m("h4", null, "Progress", -1)),
          m("div", $p, [
            A(Bi, {
              value: e.plan.finished,
              max: e.plan.total
            }, null, 8, ["value", "max"]),
            m("span", xp, v(e.plan.finished) + " of " + v(e.plan.total) + " done", 1)
          ])
        ])) : k("", !0),
        e.plan.assignee ? (r(), d("p", Sp, [
          A(Pt, {
            name: e.plan.assignee.name,
            main: e.plan.assignee.main
          }, null, 8, ["name", "main"])
        ])) : e.plan.delegated ? (r(), d("p", Mp, [
          R(qa)(e.plan) ? (r(), j(Pt, {
            key: 0,
            name: R(qa)(e.plan).name,
            main: R(qa)(e.plan).main
          }, null, 8, ["name", "main"])) : (r(), d(q, { key: 1 }, [
            G(" Delegated ")
          ], 64))
        ])) : k("", !0),
        e.plan.brief ? (r(), d("section", _p, [
          n[1] || (n[1] = m("h4", null, "The brief", -1)),
          A(Ii, {
            name: `plans:${e.plan.id}:brief`,
            at: 220,
            keep: 160
          }, {
            default: P(() => [
              A(it, {
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
}, Z6 = /* @__PURE__ */ z(Cp, [["__scopeId", "data-v-8c7a9053"]]), Ep = {
  __name: "HoverTip",
  props: { as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    return (t, n) => (r(), j(Ye(e.as), {
      type: e.as === "button" ? "button" : void 0,
      class: "tipped"
    }, {
      default: P(() => [
        re(t.$slots, "default", {}, void 0, !0),
        m("span", {
          class: Y(["tip", e.place]),
          role: "tooltip"
        }, [
          re(t.$slots, "tip", {}, void 0, !0)
        ], 2)
      ]),
      _: 3
    }, 8, ["type"]));
  }
}, Ap = /* @__PURE__ */ z(Ep, [["__scopeId", "data-v-683e1839"]]), Vi = (e) => `row:${e}`, Op = 5e3, Tp = "cancelled", Da = /* @__PURE__ */ new Map();
async function Ip(e, t) {
  const n = `${e.environment}:${t}`, a = Da.get(n);
  if (a && performance.now() - a.at < Op) {
    const o = await a.answer;
    if (o.failure !== Tp) return o;
    Da.delete(n);
  }
  const s = e.read(`agent tip ${Vi(t)}`);
  return Da.set(n, { answer: s, at: performance.now() }), s;
}
function Bp(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function Mn(e, t = Date.now()) {
  const n = Bp(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const Rp = 36e5;
function Np(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / Rp;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function tl(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function Ki(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function nl(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const Pa = (e) => String(e).padStart(2, "0");
function Yi(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Pa(t % 60)}s` : `${Math.floor(t / 3600)}h ${Pa(Math.floor(t % 3600 / 60))}m ${Pa(t % 60)}s`;
}
const Lp = { working: { state: "working", words: "Working" }, paused: { state: "paused", words: "Paused" }, "at usage limit": { state: "limited", words: "At usage limit" }, ended: { state: "idle", words: "Idle" } }, qp = { state: "retired", words: "Retired" }, Dp = (e) => e.retired ? qp : Lp[e.activity], Pp = (e) => [e.program, e.model, e.effort, e.role_label].filter(Boolean).join(", "), jp = (e, t) => e ? `Since: ${new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${Mn(e, t)}` : "", Fp = (e, t) => e ? `Seen: ${Mn(e, t)}` : "", Wp = {
  class: "line head",
  "data-agent-tip-head": ""
}, Hp = { key: 0 }, zp = {
  class: "line",
  "data-agent-tip-identity": ""
}, Up = {
  class: "line status",
  "data-agent-tip-status": ""
}, Gp = ["data-state"], Vp = {
  key: 0,
  class: "line",
  "data-agent-tip-since": ""
}, Kp = {
  key: 1,
  class: "line",
  "data-agent-tip-seen": ""
}, Yp = {
  key: 1,
  class: "line",
  "data-agent-tip-head": ""
}, Qp = {
  key: 2,
  class: "line failure",
  "data-agent-tip-failure": ""
}, Xp = {
  __name: "AgentTip",
  props: { agentId: { type: Number, required: !0 }, label: { type: String, default: "" }, as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    const t = e, n = Me(Be, null), a = C(!1), s = C(null), o = C(""), l = C(Date.now()), i = x(() => Dp(s.value)), u = x(() => jp(s.value.since, l.value)), c = x(() => Fp(s.value.last_seen, l.value));
    async function f() {
      if (a.value = !0, !n) return;
      const h = await Ip(n, t.agentId);
      o.value = h.ok ? "" : h.error, h.ok && (l.value = Date.now(), s.value = h.value);
    }
    return (h, g) => (r(), j(Ap, {
      as: e.as,
      place: e.place,
      class: "agent-tip",
      "data-agent-tip": "",
      onMouseenter: f,
      onFocusin: f
    }, Ul({
      default: P(() => [
        re(h.$slots, "default", {}, void 0, !0)
      ]),
      _: 2
    }, [
      a.value ? {
        name: "tip",
        fn: P(() => [
          s.value ? (r(), d(q, { key: 0 }, [
            m("span", Wp, [
              m("b", null, v(s.value.title), 1),
              g[0] || (g[0] = G()),
              s.value.name ? (r(), d("span", Hp, v(s.value.name), 1)) : k("", !0)
            ]),
            m("span", zp, v(R(Pp)(s.value)), 1),
            m("span", Up, [
              m("i", {
                "data-state": i.value.state
              }, null, 8, Gp),
              G(v(i.value.words), 1)
            ]),
            u.value ? (r(), d("span", Vp, v(u.value), 1)) : k("", !0),
            c.value ? (r(), d("span", Kp, v(c.value), 1)) : k("", !0)
          ], 64)) : (r(), d("b", Yp, v(e.label), 1)),
          o.value ? (r(), d("span", Qp, v(o.value), 1)) : k("", !0)
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["as", "place"]));
  }
}, hn = /* @__PURE__ */ z(Xp, [["__scopeId", "data-v-71d17663"]]), Jp = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, Zp = { class: "agent-word" }, e1 = {
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
    return (o, l) => s.value.length ? (r(), d("div", Jp, [
      (r(!0), d(q, null, ne(s.value, (i) => (r(), j(hn, {
        key: i.id,
        as: "button",
        "agent-id": i.id,
        label: R(lo)(i.name, i.main),
        class: "phase-agent",
        "data-plan-phase-agent": "",
        onClick: (u) => R(je)(`agents:${i.id}`)
      }, {
        default: P(() => [
          m("span", {
            class: Y(["agent-dot", { held: i.held }])
          }, null, 2),
          A(Pt, {
            name: i.name,
            main: i.main
          }, null, 8, ["name", "main"]),
          m("span", Zp, v(i.held ? "Working" : "Queued"), 1)
        ]),
        _: 2
      }, 1032, ["agent-id", "label", "onClick"]))), 128))
    ])) : k("", !0);
  }
}, t1 = /* @__PURE__ */ z(e1, [["__scopeId", "data-v-619caeed"]]), n1 = { class: "phases" }, a1 = { class: "phead" }, s1 = { class: "mark" }, o1 = { class: "ptitle" }, l1 = { class: "phead-end" }, i1 = {
  key: 0,
  class: "checkpoint"
}, r1 = { class: "progress" }, u1 = {
  key: 0,
  class: "when"
}, c1 = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["completed", "cancelled"]), n = (s) => s.tasks.filter((o) => t.has(o.state)).length, a = (s) => s.tasks.length > 0 && n(s) === s.tasks.length;
    return (s, o) => (r(), d("ol", n1, [
      (r(!0), d(q, null, ne(e.phases, (l, i) => (r(), d("li", {
        key: l.id,
        class: Y(["phase", { current: i + 1 === e.currentPhase, done: a(l) }]),
        "data-resource-phase": ""
      }, [
        m("div", a1, [
          m("span", s1, [
            A(le, {
              name: a(l) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", o1, v(i + 1) + ". " + v(l.title), 1),
          m("span", l1, [
            l.checkpoint ? (r(), d("span", i1, "checkpoint")) : k("", !0),
            m("span", r1, v(n(l)) + "/" + v(l.tasks.length), 1)
          ])
        ]),
        l.goal ? (r(), d("div", u1, v(l.goal), 1)) : k("", !0),
        A(t1, {
          tasks: l.tasks
        }, null, 8, ["tasks"]),
        (r(!0), d(q, null, ne(l.tasks, (u) => re(s.$slots, "task", { task: u }, void 0, !0, u.id)), 128))
      ], 2))), 128))
    ]));
  }
}, eM = /* @__PURE__ */ z(c1, [["__scopeId", "data-v-05aaa685"]]), d1 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, f1 = { ...d1, done: "Completed" }, h1 = /* @__PURE__ */ new Set(["completed", "cancelled"]), m1 = (e) => h1.has(e), mn = (e) => m1(e) ? "done" : e, p1 = { class: "task-status-icon" }, g1 = ["width", "height", "aria-label"], v1 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = x(() => mi("task", mn(t.status))), a = x(() => n.value === "testing" ? "started" : n.value), s = x(() => f1[t.status] ?? dn("task", t.status));
    return (o, l) => (r(), d("span", p1, [
      A(Vt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: P(() => [
          (r(), d("svg", {
            key: n.value,
            class: Y(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            A(Kt, { value: a.value }, {
              blocked: P(() => [...l[0] || (l[0] = [
                m("circle", {
                  cx: "6.3",
                  cy: "8",
                  r: "4.7",
                  class: "stroke"
                }, null, -1),
                m("rect", {
                  x: "10.8",
                  y: "7.3",
                  width: "3.2",
                  height: "1.4",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                m("circle", {
                  cx: "14.5",
                  cy: "8",
                  r: "1.25",
                  class: "fill"
                }, null, -1)
              ])]),
              done: P(() => [...l[1] || (l[1] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "6.3",
                  class: "fill"
                }, null, -1),
                m("polyline", {
                  points: "5.3,8.2 7.2,10 10.7,6.2",
                  class: "tick"
                }, null, -1)
              ])]),
              started: P(() => [...l[2] || (l[2] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                m("path", {
                  d: "M8 4.2 A3.8 3.8 0 0 1 8 11.8 Z",
                  class: "fill"
                }, null, -1)
              ])]),
              asked: P(() => [...l[3] || (l[3] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                m("rect", {
                  x: "7.3",
                  y: "4.8",
                  width: "1.4",
                  height: "3.6",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                m("circle", {
                  cx: "8",
                  cy: "10.5",
                  r: "0.9",
                  class: "fill"
                }, null, -1)
              ])]),
              paused: P(() => [...l[4] || (l[4] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                m("rect", {
                  x: "6",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1),
                m("rect", {
                  x: "8.7",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1)
              ])]),
              planned: P(() => [...l[5] || (l[5] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: P(() => [...l[6] || (l[6] = [
                m("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, g1))
        ]),
        _: 1
      })
    ]));
  }
}, wa = /* @__PURE__ */ z(v1, [["__scopeId", "data-v-ae24a63f"]]), y1 = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, b1 = {
  key: 0,
  class: "empty",
  role: "alert"
}, k1 = {
  key: 2,
  class: "empty"
}, w1 = { class: "day" }, $1 = { class: "events" }, x1 = { class: "mark" }, S1 = { class: "what" }, M1 = { class: "head" }, _1 = { class: "word" }, C1 = ["title", "onClick"], E1 = { class: "at" }, A1 = {
  __name: "PlanTimeline",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = {
      made: { state: "open", word: "Made" },
      logged: { icon: "edits", word: "Logged" },
      completed: { state: "completed", word: "Finished" },
      cancelled: { state: "cancelled", word: "Cancelled" }
    }, a = e, s = t, o = C(null), l = C(""), i = x(() => {
      const f = /* @__PURE__ */ new Map();
      for (const h of o.value ?? []) {
        const g = new Date(h.time).toLocaleDateString(void 0, { weekday: "long", month: "long", day: "numeric" });
        f.set(g, [...f.get(g) ?? [], h]);
      }
      return [...f].map(([h, g]) => ({ day: h, items: g }));
    }), u = (f) => new Date(f).toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
    async function c() {
      const f = await a.read(["plan", "timeline", String(a.id)]);
      l.value = f.ok ? "" : f.error, o.value = f.ok ? f.value.events : [];
    }
    return pe(() => a.id, c, { immediate: !0 }), (f, h) => (r(), d("section", y1, [
      l.value ? (r(), d("p", b1, v(l.value), 1)) : o.value === null ? (r(), j(Xe, { key: 1 })) : o.value.length ? k("", !0) : (r(), d("p", k1, "Nothing has happened on this plan's tasks yet.")),
      (r(!0), d(q, null, ne(i.value, (g) => (r(), d(q, {
        key: g.day
      }, [
        m("h3", w1, v(g.day), 1),
        m("ol", $1, [
          (r(!0), d(q, null, ne(g.items, (y) => (r(), d("li", {
            key: `${y.time}-${y.event_type}-${y.task_id}`,
            class: Y(["event", y.event_type]),
            "data-plan-event": ""
          }, [
            m("span", x1, [
              n[y.event_type].state ? (r(), j(wa, {
                key: 0,
                status: n[y.event_type].state
              }, null, 8, ["status"])) : (r(), j(le, {
                key: 1,
                name: n[y.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            m("div", S1, [
              m("div", M1, [
                m("span", _1, v(n[y.event_type].word), 1),
                m("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${y.task_id}`,
                  onClick: (b) => s("select", y.task_id)
                }, "#" + v(y.task_id) + " " + v(y.title), 9, C1),
                m("span", E1, v(u(y.time)), 1)
              ]),
              y.text ? (r(), j(it, {
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
}, tM = /* @__PURE__ */ z(A1, [["__scopeId", "data-v-9e511133"]]), O1 = 1e3;
function Qi() {
  const e = C(Date.now()), t = setInterval(() => e.value = Date.now(), O1);
  return at(() => clearInterval(t)), e;
}
const T1 = Symbol("resource-subscriptions");
function I1() {
  const e = Me(T1, null);
  if (e) return (a, s) => e.follow("resources", a, s);
  const t = Me(Be, null);
  if (t) return (a, s) => t.subscriptions.follow(t.window, a, s);
  const n = new oi();
  return (a, s) => n.follow("resources", a, s);
}
function _n(e, t, n = () => !0) {
  const a = zs(t, 100), s = I1()(e, (o) => {
    n(o) && a();
  });
  ga(() => {
    s(), a.cancel();
  });
}
function B1(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const Xi = { compact: "Compaction", clear: "Clear" }, R1 = { stop_limit: "The journal, at the context size", hard_stop: "The journal, at the second context size", person: "A user, in the viewer", auto: "The program", terminal_person: "A user, in the terminal", headless_program: "The journal, before the next job" }, N1 = { requested: "Asked, not started yet", started: "Running", ended: "Ended, size not read yet", measured: "Done", unreduced: "Done, context not smaller", failed: "Failed", abandoned: "Given up" };
function L1(e) {
  return e != null && e.is_open ? `${Xi[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
function q1(e) {
  if (!e) return [];
  const t = [["Last context change", `${Xi[e.change]}: ${N1[e.state]}`], ["Asked by", R1[e.reason]], ["Asked", new Date(e.requested_at).toLocaleString()]];
  return e.request_tokens != null && t.push(["Size at the request", `${e.request_tokens} tokens`]), e.tokens_after != null && t.push(["Size after", `${e.tokens_after} tokens`]), t;
}
const D1 = "Not known", P1 = 80, j1 = 1e3, F1 = "worker", W1 = "main", H1 = /* @__PURE__ */ new Set(["waiting", "blocked", "at usage limit"]), z1 = (e) => e.ok ? e.value.rows : [], U1 = (e, t) => e.ended_at ? "ended" : e.paused_at || H1.has(t == null ? void 0 : t.state) ? "waiting" : "running", Ji = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function G1({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / j1, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: Yi(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > P1 }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? D1 : `$${t.cost_dollars.toFixed(2)}` }), e.role === F1 && l.push({ key: "pace", label: "Tasks an hour", value: String(Np(Ji(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === W1 && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function V1(e) {
  const t = Ji(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function K1(e, t, n = null) {
  const a = [["Number", String(e.number)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && a.push(["Parent agent", `Agent ${e.parent_id}`]), a.push(["Started by", t.started_by], ["Started", tl(e.created_at)]), e.ended_at && a.push(["Ended", tl(e.ended_at)]), e.pid && a.push(["Process", `pid ${e.pid}`]), a.push(...q1(n)), a;
}
const Y1 = { class: "band" }, Q1 = { key: 0 }, X1 = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (r(), d("h2", Y1, [
      A(le, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      re(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (r(), d("span", Q1, v(e.count), 1)) : k("", !0)
    ]));
  }
}, zt = /* @__PURE__ */ z(X1, [["__scopeId", "data-v-1758914f"]]), J1 = { class: "number" }, Z1 = { class: "text" }, eg = 150, tg = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = C(!1), a = x(() => t.text.length > eg), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (r(), d(q, null, [
      e.text ? (r(), d(q, { key: 0 }, [
        A(zt, { icon: "file" }, {
          default: P(() => [
            G(v(e.label), 1)
          ]),
          _: 1
        }),
        m("div", {
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
      e.points.length ? (r(), d(q, { key: 1 }, [
        A(zt, { icon: "points" }, {
          default: P(() => [...l[1] || (l[1] = [
            G("Points to prove", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(q, null, ne(e.points, (i) => {
          var u;
          return r(), d("p", {
            key: i.id,
            class: "point",
            "data-agent-point": ""
          }, [
            m("span", J1, v(i.id), 1),
            m("span", Z1, [
              G(v(i.text), 1),
              m("span", {
                class: Y(["proof", { checked: ((u = i.proof) == null ? void 0 : u.state) === "checked" }])
              }, v(s(i)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : k("", !0)
    ], 64));
  }
}, ng = /* @__PURE__ */ z(tg, [["__scopeId", "data-v-c99de22c"]]), ag = ["aria-expanded"], sg = { class: "count" }, og = {
  key: 0,
  "data-agent-fold-body": ""
}, lg = {
  __name: "AgentFold",
  props: /* @__PURE__ */ Ft({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = un(e, "open");
    return (n, a) => (r(), d(q, null, [
      m("button", {
        type: "button",
        class: Y(["fold", { shut: !t.value }]),
        "aria-expanded": t.value,
        "data-agent-fold": "",
        onClick: a[0] || (a[0] = (s) => t.value = !t.value)
      }, [
        A(le, {
          name: e.icon,
          size: 12
        }, null, 8, ["name"]),
        G(v(e.label), 1),
        m("span", sg, v(e.count), 1),
        A(le, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, ag),
      t.value ? (r(), d("div", og, [
        re(n.$slots, "default", {}, void 0, !0)
      ])) : k("", !0)
    ], 64));
  }
}, ja = /* @__PURE__ */ z(lg, [["__scopeId", "data-v-7f93d8d9"]]), ig = ["onClick"], rg = { class: "text" }, ug = { class: "aside" }, cg = {
  key: 0,
  class: "none"
}, dg = {
  class: "skills",
  "data-agent-skills": ""
}, fg = {
  key: 0,
  class: "none-inline"
}, hg = { class: "label" }, mg = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = Gt({ helpers: !1, skills: !1 }), a = C([]), s = C([]), o = async (l) => z1(await t.read(l));
    return pe(() => [n.helpers, t.loads], async ([l]) => {
      l && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), pe(() => [n.skills, t.loads], async ([l]) => {
      l && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    }), (l, i) => (r(), d(q, null, [
      A(ja, {
        open: n.helpers,
        "onUpdate:open": i[0] || (i[0] = (u) => n.helpers = u),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: P(() => [
          (r(!0), d(q, null, ne(a.value, (u) => (r(), d("button", {
            key: u.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (c) => R(bt)("agents", u.id)
          }, [
            m("span", rg, v(R(Ht)(u).title), 1),
            m("span", ug, v(R(Ht)(u).subtext), 1)
          ], 8, ig))), 128)),
          a.value.length ? k("", !0) : (r(), d("p", cg, "It started no helpers."))
        ]),
        _: 1
      }, 8, ["open", "count"]),
      A(ja, {
        open: n.skills,
        "onUpdate:open": i[1] || (i[1] = (u) => n.skills = u),
        icon: "style",
        label: "Skills loaded",
        count: e.counts.skills
      }, {
        default: P(() => [
          m("p", dg, [
            (r(!0), d(q, null, ne(s.value, (u) => (r(), d("span", {
              key: u.id,
              "data-agent-skill": ""
            }, v(u.skill), 1))), 128)),
            s.value.length ? k("", !0) : (r(), d("span", fg, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      A(ja, {
        icon: "rules",
        label: "Details",
        count: e.details.length
      }, {
        default: P(() => [
          (r(!0), d(q, null, ne(e.details, ([u, c, f]) => (r(), d("div", {
            key: u,
            class: "detail",
            "data-agent-detail": ""
          }, [
            m("span", hg, v(u) + ":", 1),
            m("span", {
              class: Y(["value", f])
            }, v(c), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, pg = /* @__PURE__ */ z(mg, [["__scopeId", "data-v-1281605f"]]), gg = ["datetime", "title"], nt = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Qi(), a = x(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (r(), d("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, v(R(Mn)(e.at, R(n))), 9, gg));
  }
}, vg = {
  class: "now",
  "data-agent-now": ""
}, yg = {
  key: 1,
  class: "muted"
}, bg = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, kg = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, wg = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, $g = { class: "line" }, xg = { class: "detail" }, Sg = { class: "bar" }, Mg = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = x(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = x(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (r(), d(q, null, [
      A(zt, { icon: "play" }, {
        default: P(() => [...o[2] || (o[2] = [
          G("Doing now", -1)
        ])]),
        _: 1
      }),
      m("div", vg, [
        e.inspection.task ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => R(bt)("tasks", e.inspection.task.id))
        }, "Task " + v(e.inspection.task.id) + ": " + v(e.inspection.task.title), 1)) : (r(), d("span", yg, v(e.nothing), 1)),
        n.value ? (r(), d("span", bg, v(n.value), 1)) : k("", !0),
        e.inspection.last_activity ? (r(), d("span", kg, [
          o[3] || (o[3] = G("Seen: ", -1)),
          A(nt, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : k("", !0)
      ]),
      e.inspection.plan ? (r(), d("div", wg, [
        m("div", $g, [
          m("span", null, "Plan " + v(e.inspection.plan.id) + ", phase " + v(e.inspection.plan.phase), 1),
          m("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => R(bt)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        m("span", xg, v(e.inspection.plan.done) + " of " + v(e.inspection.plan.total) + " tasks done", 1),
        m("div", Sg, [
          m("i", {
            style: ve({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : k("", !0)
    ], 64));
  }
}, _g = /* @__PURE__ */ z(Mg, [["__scopeId", "data-v-ff25c609"]]), Cg = ["onClick"], Eg = { class: "text" }, Ag = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, Og = { class: "text" }, Tg = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, Ig = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d(q, null, [
      A(zt, { icon: "clock" }, {
        default: P(() => [...n[0] || (n[0] = [
          G("Recent", -1)
        ])]),
        _: 1
      }),
      (r(!0), d(q, null, ne(e.moves, (a) => (r(), d(q, {
        key: `${a.time}:${a.text}`
      }, [
        a.table ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "move",
          "data-agent-move": "",
          onClick: (s) => R(bt)(a.table, a.id)
        }, [
          m("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          m("span", Eg, v(a.text), 1),
          A(nt, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, Cg)) : (r(), d("div", Ag, [
          m("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          m("span", Og, v(a.text), 1),
          A(nt, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? k("", !0) : (r(), d("p", Tg, "Nothing yet."))
    ], 64));
  }
}, Bg = /* @__PURE__ */ z(Ig, [["__scopeId", "data-v-58f0db57"]]), Rg = {
  class: "strip",
  "data-agent-strip": ""
}, Ng = ["data-agent-cell"], Lg = {
  key: 0,
  class: "meter"
}, qg = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", Rg, [
      (r(!0), d(q, null, ne(e.cells, (a) => (r(), d("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        m("small", null, v(a.label), 1),
        m("b", {
          class: Y({ bad: a.bad })
        }, v(a.value), 3),
        a.meter !== void 0 ? (r(), d("div", Lg, [
          m("i", {
            class: Y({ high: a.high }),
            style: ve({ width: `${a.meter}%` })
          }, null, 6)
        ])) : k("", !0)
      ], 8, Ng))), 128))
    ]));
  }
}, Dg = /* @__PURE__ */ z(qg, [["__scopeId", "data-v-b6657ab7"]]), Pg = {}, jg = { class: "menu-label" };
function Fg(e, t) {
  return r(), d("span", jg, [
    re(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Ct = /* @__PURE__ */ z(Pg, [["render", Fg], ["__scopeId", "data-v-aa955b3e"]]), Wg = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, Hg = {
  key: 0,
  class: "skills-none"
}, zg = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(() => n.skills.filter((l) => l.state === "loaded")), o = x(() => n.skills.filter((l) => l.state !== "loaded"));
    return (l, i) => (r(), d("div", Wg, [
      A(Ct, null, {
        default: P(() => [...i[1] || (i[1] = [
          G("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      s.value.length ? k("", !0) : (r(), d("p", Hg, "None yet. Compacting the conversation empties this list.")),
      (r(!0), d(q, null, ne(s.value, (u) => (r(), d("p", {
        key: u.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        A(le, {
          name: "book",
          size: 12
        }),
        G(v(u.skill), 1)
      ]))), 128)),
      o.value.length ? (r(), d(q, { key: 1 }, [
        A(Ct, null, {
          default: P(() => [...i[2] || (i[2] = [
            G("Still to read", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(q, null, ne(o.value, (u) => (r(), d("p", {
          key: u.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          A(le, {
            name: "book",
            size: 12
          }),
          G(v(u.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      A(Ue, {
        "data-agent-skills-browse": "",
        onClick: i[0] || (i[0] = (u) => a("browse"))
      }, {
        default: P(() => [...i[3] || (i[3] = [
          G("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Ug = /* @__PURE__ */ z(zg, [["__scopeId", "data-v-be514d47"]]), Gg = ["disabled", "title"], Vg = { class: "gauge usage" }, Kg = {
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
      onClick: f[0] || (f[0] = (h) => a("open", h.currentTarget))
    }, [
      A(le, {
        name: "allowance",
        size: 12
      }),
      f[1] || (f[1] = G()),
      m("span", Vg, [
        m("span", {
          style: ve({ width: `${o.value}%` })
        }, null, 4)
      ]),
      G(" " + v(l.value ? "At usage limit" : `${o.value}%`), 1)
    ], 8, Gg)) : k("", !0);
  }
}, Yg = /* @__PURE__ */ z(Kg, [["__scopeId", "data-v-a36f09dc"]]), Qg = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: Y(["badge", e.tone])
    }, v(e.text), 3));
  }
}, io = /* @__PURE__ */ z(Qg, [["__scopeId", "data-v-9e7e1157"]]);
function Xg(e, t, n, { groups: a, programs: s }) {
  const o = C({}), l = C(""), i = C(!1), u = x(() => !!e.value && !e.value.ended_at), c = x(() => u.value && !!e.value.paused_at);
  async function f(b, M = null) {
    l.value = "";
    const _ = await Ql(M, b, t);
    return l.value = _.ok ? "" : _.error, n(), _;
  }
  return { groups: a, programs: s, chosen: o, failure: l, asking: i, running: u, paused: c, choose: (b, M) => f(["agent", "control", String(e.value.number), b, M.value], { target: o, fields: { value: { ...o.value, [b]: M.label } } }), stop: () => (i.value = !1, f(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (b) => f(["agent", "launch", b.name]) };
}
const Jg = ["disabled", "title"], Zg = ["disabled", "title"], ev = { class: "gauge" }, tv = {
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, nv = ["disabled", "title"], av = ["disabled"], sv = ["disabled"], ov = {
  key: 5,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, lv = ["title"], iv = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, rv = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, uv = { class: "gauge" }, cv = { class: "context-used" }, dv = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, fv = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, hv = 75, mv = {
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
    const n = e, a = t, s = Xg(Ea(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: Ea(n, "controlGroups"), programs: Ea(n, "agentPrograms") }), o = C(null), l = C(""), i = x(() => s.groups.value.find((L) => L.key === l.value));
    function u(L, E) {
      o.value = L.currentTarget, l.value = E;
    }
    function c() {
      o.value = null, l.value = "", s.asking.value = !1;
    }
    const f = x(() => n.skills.filter((L) => L.state === "loaded"));
    function h(L) {
      u(L, "skills"), a("skills");
    }
    const g = (L) => s.groups.value.some((E) => E.key === L), y = x(() => {
      var L;
      return s.chosen.value.model ?? ((L = M.value) == null ? void 0 : L.model) ?? "";
    }), b = x(() => {
      var L;
      return s.chosen.value.effort ?? ((L = M.value) == null ? void 0 : L.effort) ?? "";
    });
    x(() => !!n.agent && !n.agent.ended_at);
    const M = x(() => {
      var L;
      return ((L = n.usage.agents) == null ? void 0 : L.find((E) => {
        var N;
        return E.id === ((N = n.agent) == null ? void 0 : N.id);
      })) ?? null;
    }), _ = x(() => {
      var L;
      return ((L = M.value) == null ? void 0 : L.context_percent) == null ? null : Math.round(M.value.context_percent);
    }), S = x(() => {
      var L;
      return L1(((L = M.value) == null ? void 0 : L.context_change) ?? null);
    }), T = (L) => `${Math.round(L / 1e3)}k`, H = x(() => {
      var L;
      return !!((L = M.value) != null && L.context_limit_tokens);
    }), W = x(() => {
      var L, E;
      return ((L = M.value) == null ? void 0 : L.context_limit_tokens) || ((E = M.value) == null ? void 0 : E.context_window_tokens) || 0;
    }), I = x(() => W.value ? `${T(M.value.context_tokens ?? 0)} of ${T(W.value)}` : ""), V = x(() => {
      var L;
      return (L = M.value) != null && L.cost_dollars ? `$${M.value.cost_dollars.toFixed(2)}` : "";
    });
    return (L, E) => {
      var N, D;
      return r(), d("div", {
        class: Y(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (r(), d(q, { key: 0 }, [
          m("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: E[0] || (E[0] = (w) => u(w, "agent"))
          }, [
            A(le, {
              name: "agents",
              size: 12
            }),
            G(" " + v(((N = e.agentPrograms.find((w) => w.name === e.agent.program)) == null ? void 0 : N.title) || e.agent.program), 1)
          ], 8, Jg),
          A(Yg, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: E[1] || (E[1] = (w) => a("open", "usage", w))
          }, null, 8, ["windows", "disabled"]),
          _.value !== null ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${_.value}% full: clear or compact it`,
            onClick: E[2] || (E[2] = (w) => g("context") ? u(w, "context") : a("open", "context", w.currentTarget))
          }, [
            A(le, {
              name: "gauge",
              size: 12
            }),
            E[14] || (E[14] = G()),
            m("span", ev, [
              m("span", {
                style: ve({ width: `${_.value}%` })
              }, null, 4)
            ]),
            G(" " + v(_.value) + "% ", 1)
          ], 8, Zg)) : (D = M.value) != null && D.context_unknown ? (r(), d("span", tv, [
            A(le, {
              name: "gauge",
              size: 12
            }),
            E[15] || (E[15] = G(" Context: unknown", -1))
          ])) : k("", !0),
          y.value ? (r(), d("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${y.value}: change the model`,
            onClick: E[3] || (E[3] = (w) => g("model") ? u(w, "model") : null)
          }, [
            A(le, {
              name: "model",
              size: 12
            }),
            G(" " + v(y.value), 1)
          ], 8, nv)) : k("", !0),
          g("effort") || e.card && b.value ? (r(), d("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: E[4] || (E[4] = (w) => u(w, "effort"))
          }, [
            A(le, {
              name: "bolt",
              size: 12
            }),
            G(" " + v(b.value), 1)
          ], 8, av)) : k("", !0),
          V.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: E[5] || (E[5] = (w) => a("open", "cost", w.currentTarget))
          }, v(V.value), 9, sv)) : k("", !0),
          e.branch ? (r(), d("span", ov, [
            A(le, {
              name: "branch",
              size: 12
            }),
            G(" " + v(e.branch), 1)
          ])) : k("", !0),
          e.card ? k("", !0) : (r(), d("button", {
            key: 6,
            type: "button",
            class: Y(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: E[6] || (E[6] = (w) => a("open", "jobs", w.currentTarget))
          }, [
            A(le, {
              name: "clock",
              size: 12
            }),
            G(" " + v(e.jobs), 1)
          ], 2)),
          e.run ? (r(), d("button", {
            key: 7,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: h
          }, [
            A(le, {
              name: "book",
              size: 12
            }),
            G(" " + v(f.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (r(), d(q, { key: 8 }, [
            m("button", {
              type: "button",
              class: Y(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < hv }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: E[7] || (E[7] = (w) => a("open", "fitness", w.currentTarget))
            }, [
              A(le, {
                name: "heart",
                size: 12
              }),
              G(" " + v(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            m("button", {
              type: "button",
              class: Y(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: E[8] || (E[8] = (w) => a("open", "load", w.currentTarget))
            }, [
              A(le, {
                name: "weight",
                size: 12
              }),
              G(" " + v(e.fitness.workload), 1)
            ], 2)
          ], 64)) : k("", !0)
        ], 64)) : e.run && !e.loading ? (r(), d("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: E[9] || (E[9] = (w) => u(w, "start"))
        }, [
          A(le, {
            name: "agents",
            size: 12
          }),
          E[16] || (E[16] = G(" Start an agent", -1))
        ])) : k("", !0),
        E[22] || (E[22] = m("span", { class: "space" }, null, -1)),
        R(s).failure.value ? (r(), d("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: R(s).failure.value
        }, v(R(s).failure.value), 9, lv)) : k("", !0),
        re(L.$slots, "default", {}, void 0, !0),
        o.value ? (r(), j(va, {
          key: 3,
          anchor: o.value,
          "min-width": 190,
          onClose: c
        }, {
          default: P(() => {
            var w;
            return [
              l.value === "agent" ? (r(), d(q, { key: 0 }, [
                R(s).asking.value ? (r(), d(q, { key: 0 }, [
                  A(Ct, { "data-agent-stop-ask": "" }, {
                    default: P(() => [...E[17] || (E[17] = [
                      G("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  A(Ue, {
                    "data-agent-stop-confirm": "",
                    onClick: E[10] || (E[10] = (p) => (c(), R(s).stop()))
                  }, {
                    default: P(() => [...E[18] || (E[18] = [
                      G("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  A(Ue, {
                    onClick: E[11] || (E[11] = (p) => R(s).asking.value = !1)
                  }, {
                    default: P(() => [...E[19] || (E[19] = [
                      G("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (r(), j(Ue, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: E[12] || (E[12] = (p) => R(s).asking.value = !0)
                }, {
                  default: P(() => [...E[20] || (E[20] = [
                    G("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : l.value === "start" ? (r(), d(q, { key: 1 }, [
                A(Ct, null, {
                  default: P(() => [...E[21] || (E[21] = [
                    G("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (r(!0), d(q, null, ne(R(s).programs.value, (p) => (r(), j(Ue, {
                  key: p.name,
                  "data-agent-program": p.name,
                  onClick: ($) => (c(), R(s).start(p))
                }, {
                  default: P(() => [
                    G(v(p.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : l.value === "skills" ? (r(), j(Ug, {
                key: 2,
                skills: e.skills,
                onBrowse: E[13] || (E[13] = (p) => (c(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : i.value ? (r(), d(q, { key: 3 }, [
                A(Ct, null, {
                  default: P(() => [
                    G(v(i.value.label), 1)
                  ]),
                  _: 1
                }),
                l.value === "context" ? (r(), d(q, { key: 0 }, [
                  m("p", iv, v(R(B1)(((w = M.value) == null ? void 0 : w.last_compaction) ?? null)), 1),
                  m("div", rv, [
                    m("span", uv, [
                      m("span", {
                        style: ve({ width: `${_.value}%` })
                      }, null, 4)
                    ]),
                    m("span", cv, v(_.value) + "%", 1)
                  ]),
                  I.value ? (r(), d("p", dv, [
                    G(v(I.value) + " ", 1),
                    H.value ? (r(), j(io, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : k("", !0)
                  ])) : k("", !0)
                ], 64)) : k("", !0),
                l.value === "context" && S.value ? (r(), d("p", fv, v(S.value), 1)) : (r(!0), d(q, { key: 2 }, ne(i.value.choices, (p) => (r(), j(Ue, {
                  key: p.value,
                  "data-agent-choice": p.value,
                  onClick: ($) => (R(s).choose(i.value.key, p), c())
                }, {
                  default: P(() => [
                    G(v(p.label), 1)
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
}, pv = /* @__PURE__ */ z(mv, [["__scopeId", "data-v-d7113347"]]), gv = {
  class: "who",
  "data-agent-who": ""
}, vv = { class: "name" }, yv = ["data-agent-state"], bv = {
  class: "sub",
  "data-agent-started-by": ""
}, kv = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, startedBy: { type: String, required: !0 }, agent: { type: Object, required: !0 }, programs: { type: Array, default: () => [] }, usage: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", gv, [
      m("h2", vv, [
        m("i", {
          class: Y(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, yv),
        G(v(e.name), 1)
      ]),
      A(pv, {
        class: "bar",
        agent: e.agent,
        "agent-programs": e.programs,
        usage: e.usage,
        card: ""
      }, null, 8, ["agent", "agent-programs", "usage"]),
      m("p", bv, "Started by: " + v(e.startedBy), 1)
    ]));
  }
}, wv = /* @__PURE__ */ z(kv, [["__scopeId", "data-v-83bd4a9d"]]), $v = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, xv = { class: "scroll" }, Sv = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Mv = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, _v = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Qi(), a = C(null), s = C(null), o = C(null), l = C(null), i = C({}), u = C({ helpers: 0, skills: 0 }), c = C(0), f = C([]), h = C([]), g = C("");
    let y = 0;
    const b = x(() => {
      var T;
      return a.value.ended_at ? V1(s.value) : `It has no task.${(T = s.value) != null && T.instruction ? " It was given an instruction." : ""}`;
    });
    async function M() {
      const T = ++y, H = await t.read(["usage", "inspector", Vi(t.id), "--environment", t.environment]);
      T === y && (g.value = H.ok ? "" : H.error, H.ok && (a.value = H.value.agent, s.value = H.value.facts, o.value = H.value.inspection, l.value = H.value.compaction ?? null, i.value = H.value.tool, u.value = { helpers: H.value.helpers, skills: H.value.skills }, f.value = H.value.points, h.value = H.value.programs, c.value += 1));
    }
    const _ = x(() => /* @__PURE__ */ new Set([t.id])), S = {
      agent: (T) => li(T, _.value),
      hook_call: (T) => Sc(T, "session_agent_id", _.value)
    };
    return _n(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], M, (T) => {
      var H;
      return ((H = S[T.event.split(".")[0]]) == null ? void 0 : H.call(S, T)) ?? !0;
    }), _e(M), (T, H) => {
      var W, I;
      return r(), d("article", $v, [
        m("div", xv, [
          g.value ? (r(), d("p", Sv, v(g.value), 1)) : a.value && o.value ? (r(), d(q, { key: 1 }, [
            A(wv, {
              name: R(Ht)(a.value, s.value).text,
              state: R(U1)(a.value, s.value),
              "started-by": o.value.started_by,
              agent: a.value,
              programs: h.value,
              usage: { agents: s.value ? [s.value] : [], windows: ((W = s.value) == null ? void 0 : W.windows) ?? [] }
            }, null, 8, ["name", "state", "started-by", "agent", "programs", "usage"]),
            A(Dg, {
              cells: R(G1)({ row: a.value, facts: s.value, inspection: o.value, now: R(n) })
            }, null, 8, ["cells"]),
            A(_g, {
              inspection: o.value,
              tool: i.value,
              nothing: b.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            A(ng, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((I = s.value) == null ? void 0 : I.instruction) ?? "",
              points: f.value
            }, null, 8, ["label", "text", "points"]),
            A(Bg, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            A(pg, {
              id: e.id,
              read: e.read,
              counts: u.value,
              loads: c.value,
              details: R(K1)(a.value, o.value, l.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (r(), d("p", Mv, "Ended " + v(R(Mn)(a.value.ended_at, R(n))) + ". It takes no more actions.", 1)) : k("", !0)
          ], 64)) : (r(), j(Xe, { key: 2 }))
        ])
      ]);
    };
  }
}, nM = /* @__PURE__ */ z(_v, [["__scopeId", "data-v-b88512f5"]]);
function Cv(e) {
  const t = C(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return _e(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), at(() => n.disconnect()), t;
}
const Ev = ["data-comment-id"], Av = {
  key: 0,
  class: "comment-top"
}, Ov = { class: "comment-mark" }, Tv = {
  class: "comment-body",
  "data-comment": ""
}, Iv = { class: "comment-foot" }, Bv = {
  key: 1,
  "data-comment-lost": ""
}, Rv = {
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
      e.comment.quote ? (r(), d("div", Av, [
        m("span", Ov, v(e.comment.number), 1),
        m("span", {
          class: Y(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, v(e.comment.quote), 3)
      ])) : k("", !0),
      m("p", Tv, v(e.comment.body), 1),
      m("div", Iv, [
        e.comment.created_at ? (r(), j(nt, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : k("", !0),
        e.lost ? (r(), d("span", Bv, "The text has changed here")) : e.comment.quote ? (r(), d("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : k("", !0)
      ])
    ], 10, Ev));
  }
}, Zi = /* @__PURE__ */ z(Rv, [["__scopeId", "data-v-a37d4507"]]);
var zl;
/Mac|iPhone|iPad/.test(((zl = navigator.userAgentData) == null ? void 0 : zl.platform) || navigator.platform);
function er(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const Nv = {
  class: "comment-box",
  "data-comment-box": ""
}, Lv = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, qv = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, Dv = { class: "comment-row" }, Pv = ["placeholder"], jv = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ Ft({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ Ft(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = un(e, "draft"), l = C(""), i = C(!1), u = C(null), c = x(() => {
      var y;
      return ((y = a.selection) == null ? void 0 : y.selection_type) === "code";
    }), f = x(() => a.narrow ? "Write a comment" : "Write a comment, or select text to comment on a selection");
    function h() {
      u.value.style.height = "auto", u.value.style.height = `${u.value.scrollHeight + 2}px`;
    }
    async function g() {
      const y = o.value.trim();
      if (!(!y || i.value)) {
        l.value = "", i.value = !0;
        try {
          await a.send(y), o.value = "", await Fe(), h();
        } catch (b) {
          l.value = b.message;
        } finally {
          i.value = !1;
        }
      }
    }
    return t({ focus: () => u.value.focus() }), (y, b) => (r(), d("div", Nv, [
      e.selection ? (r(), d("div", Lv, [
        b[3] || (b[3] = m("span", { class: "comment-on-label" }, "On this selection", -1)),
        m("span", {
          class: Y(["comment-on-words", { mono: c.value }])
        }, v(e.selection.quote), 3),
        A(ya, {
          title: "Comment on the whole document instead",
          onClick: b[0] || (b[0] = (M) => s("clear"))
        })
      ])) : k("", !0),
      l.value ? (r(), d("p", qv, v(l.value), 1)) : k("", !0),
      m("div", Dv, [
        Ve(m("textarea", {
          ref_key: "box",
          ref: u,
          "onUpdate:modelValue": b[1] || (b[1] = (M) => o.value = M),
          rows: "1",
          maxlength: "2000",
          class: Y({ on: o.value }),
          placeholder: f.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: h,
          onKeydown: b[2] || (b[2] = Et((M) => R(er)(M, g), ["enter"]))
        }, null, 42, Pv), [
          [ta, o.value]
        ]),
        A(ge, {
          variant: "primary",
          busy: i.value,
          disabled: !o.value.trim(),
          "data-comment-send": "",
          onClick: g
        }, {
          default: P(() => [...b[4] || (b[4] = [
            G("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, Fv = /* @__PURE__ */ z(jv, [["__scopeId", "data-v-41d2081c"]]), Pn = (e) => e ? e.split(", ") : [];
function Wv({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function Hv(e, t) {
  return {
    reads: Pn(e.reads_allowed),
    runs: Pn(e.runs_allowed),
    missing: [...Pn(e.reads_missing), ...Pn(e.runs_missing)],
    ask: t
  };
}
const zv = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = fu("SkeletonParts", !0);
      return r(!0), d(q, null, ne(e.parts, (u, c) => (r(), d(q, { key: c }, [
        (r(!0), d(q, null, ne(u.count, (f) => (r(), j(Kt, {
          key: f,
          value: u.shape
        }, {
          line: P(() => [
            A(nn, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ve({ width: u.width, height: `${t[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: P(() => [
            A(nn, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ve({ width: `${n[u.size]}px`, height: `${n[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: P(() => [
            A(nn, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ve({ width: u.width, height: `${u.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: P(() => [...l[0] || (l[0] = [
            m("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: P(() => [
            m("div", {
              class: "skeleton-row",
              style: ve(a(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: P(() => [
            m("div", {
              class: "skeleton-stack",
              style: ve(a(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: P(() => [
            m("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ve(a(u))
            }, [
              A(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: P(() => [
            m("div", {
              class: "skeleton-grid",
              style: ve(s(u))
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
}), Uv = /* @__PURE__ */ z(zv, [["__scopeId", "data-v-fa8baeaf"]]), Gv = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, Vv = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (r(), d("div", Gv, [
      A(Uv, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, ro = /* @__PURE__ */ z(Vv, [["__scopeId", "data-v-52f66b64"]]), tr = {
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
}, Kv = { class: "bars" }, Yv = { class: "bar-name" }, Qv = { class: "bar-value" }, Xv = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = x(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (r(), d("div", Kv, [
      (r(!0), d(q, null, ne(e.items, (u, c) => (r(), j(Ye(u.open ? "button" : "div"), {
        key: `${c}-${u.label}`,
        type: u.open ? "button" : void 0,
        class: Y(["bar-row", u.tone, { opens: u.open }]),
        onClick: (f) => u.open && a("open", u.open)
      }, {
        default: P(() => [
          m("span", Yv, v(u.label), 1),
          A(Bi, {
            value: Number(u.value) || 0,
            max: s.value,
            tone: u.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", Qv, v(u.value) + v(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Jv = /* @__PURE__ */ z(Xv, [["__scopeId", "data-v-663427f4"]]), Zv = { class: "bars" }, ey = {
  key: 0,
  class: "bars-title"
}, ty = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", Zv, [
      e.node.title ? (r(), d("span", ey, v(e.node.title), 1)) : k("", !0),
      A(Jv, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, ny = /* @__PURE__ */ z(ty, [["__scopeId", "data-v-7135bb11"]]), ay = {
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
      style: ve(o.value)
    }, [
      (r(!0), d(q, null, ne(e.node.children || [], (u, c) => (r(), j(ar, {
        key: c,
        node: u,
        onOpen: i[0] || (i[0] = (f) => s("open", f)),
        onFile: i[1] || (i[1] = (f) => s("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, nr = /* @__PURE__ */ z(ay, [["__scopeId", "data-v-d142a3f4"]]), sy = {
  key: 0,
  class: "card-head"
}, oy = { class: "card-title" }, ly = {
  key: 0,
  class: "card-note"
}, iy = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", {
      class: Y(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (r(), d("header", sy, [
        m("span", oy, v(e.node.title), 1),
        e.node.note ? (r(), d("span", ly, v(e.node.note), 1)) : k("", !0)
      ])) : k("", !0),
      A(nr, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, ry = /* @__PURE__ */ z(iy, [["__scopeId", "data-v-67b72d40"]]), uy = { class: "fact" }, cy = { class: "fact-label" }, dy = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", uy, [
      m("span", cy, v(e.label), 1),
      A(it, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, fy = /* @__PURE__ */ z(dy, [["__scopeId", "data-v-3a88ecf8"]]), hy = { class: "list" }, my = { class: "list-label" }, py = {
  key: 1,
  class: "list-note"
}, gy = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", hy, [
      (r(!0), d(q, null, ne(e.items, (o, l) => (r(), j(Ye(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Y(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: P(() => [
          m("span", my, v(o.label), 1),
          o.badge ? (r(), j(io, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : k("", !0),
          o.note ? (r(), d("span", py, v(o.note), 1)) : k("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, vy = /* @__PURE__ */ z(gy, [["__scopeId", "data-v-ebe2ae0a"]]), yy = { class: "table" }, by = {
  key: 0,
  class: "table-row empty"
}, ky = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (r(), d("div", yy, [
      m("div", {
        class: "table-row head",
        style: ve(s.value)
      }, [
        (r(!0), d(q, null, ne(e.columns, (i) => (r(), d("span", {
          key: i,
          class: "cell"
        }, v(i), 1))), 128))
      ], 4),
      (r(!0), d(q, null, ne(e.rows, (i, u) => (r(), j(Ye(i.open ? "button" : "div"), {
        key: u,
        type: i.open ? "button" : void 0,
        class: Y(["table-row", i.tone, { opens: i.open }]),
        style: ve(s.value),
        onClick: (c) => i.open && a("open", i.open)
      }, {
        default: P(() => [
          (r(!0), d(q, null, ne(i.cells, (c, f) => (r(), d("span", {
            key: f,
            class: "cell"
          }, v(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (r(), d("div", by, v(e.empty), 1)) : k("", !0)
    ]));
  }
}, wy = /* @__PURE__ */ z(ky, [["__scopeId", "data-v-9326a52e"]]), $y = { class: "stat-value" }, xy = { class: "stat-label" }, Sy = {
  key: 0,
  class: "stat-note"
}, My = {
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
    return (a, s) => (r(), j(Ye(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Y(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: P(() => [
        m("span", $y, v(e.value), 1),
        m("span", xy, v(e.label), 1),
        e.note ? (r(), d("span", Sy, v(e.note), 1)) : k("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, _y = /* @__PURE__ */ z(My, [["__scopeId", "data-v-ad0db6d6"]]), Cy = { class: "code" }, Ey = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = e, a = ["stack", "row", "grid"], s = x(() => a.includes(n.node.type) ? "group" : n.node.type), o = t, l = (u) => o("open", u), i = (u) => o("file", u);
    return (u, c) => (r(), j(Kt, { value: s.value }, {
      group: P(() => [
        A(nr, {
          node: e.node,
          onOpen: l,
          onFile: i
        }, null, 8, ["node"])
      ]),
      card: P(() => [
        A(ry, {
          node: e.node,
          onOpen: l,
          onFile: i
        }, null, 8, ["node"])
      ]),
      heading: P(() => [
        m("h3", {
          class: Y(["heading", `level-${e.node.level || 2}`])
        }, v(e.node.text), 3)
      ]),
      divider: P(() => [...c[2] || (c[2] = [
        m("hr", { class: "divider" }, null, -1)
      ])]),
      stat: P(() => [
        A(_y, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: c[0] || (c[0] = (f) => l(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: P(() => [
        A(ny, {
          node: e.node,
          onOpen: l
        }, null, 8, ["node"])
      ]),
      table: P(() => [
        A(wy, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: l
        }, null, 8, ["columns", "rows"])
      ]),
      list: P(() => [
        A(vy, {
          items: e.node.items,
          onOpen: l
        }, null, 8, ["items"])
      ]),
      text: P(() => [
        A(it, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: P(() => [
        A(fy, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: P(() => [
        A(io, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: P(() => [
        m("pre", Cy, [
          m("code", null, v(e.node.text), 1)
        ])
      ]),
      file: P(() => [
        m("button", {
          type: "button",
          class: "file",
          onClick: c[1] || (c[1] = (f) => i(e.node))
        }, v(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), ar = /* @__PURE__ */ z(Ey, [["__scopeId", "data-v-b9156b43"]]), Ay = { class: "dashboard" }, Oy = { class: "trail" }, Ty = ["onClick"], Iy = {
  key: 0,
  class: "gone",
  role: "status"
}, By = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (g) => g in (n.document.pages || {}), o = C(!!n.page && !s(n.page)), l = C(n.page && !o.value ? [n.page] : []), i = x(() => l.value.at(-1) || n.document.start), u = x(() => (n.document.pages || {})[i.value] || null), c = (g) => ((n.document.pages || {})[g] || {}).title || g, f = (g) => {
      o.value = !1, l.value = [...l.value, g];
    }, h = (g) => {
      o.value = !1, l.value = l.value.slice(0, g);
    };
    return pe(
      () => n.document.start,
      () => l.value = []
    ), (g, y) => (r(), d("div", Ay, [
      e.document.broken ? (r(), j(cn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: P(() => [
          G(v(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (r(), j(cn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: P(() => [
          G(v(e.document.missing), 1)
        ]),
        _: 1
      })) : u.value ? (r(), d(q, { key: 2 }, [
        m("nav", Oy, [
          m("button", {
            type: "button",
            class: Y(["step", { current: !l.value.length }]),
            onClick: y[0] || (y[0] = (b) => h(0))
          }, v(c(e.document.start)), 3),
          (r(!0), d(q, null, ne(l.value, (b, M) => (r(), d(q, {
            key: `${M}-${b}`
          }, [
            y[2] || (y[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: Y(["step", { current: M === l.value.length - 1 }]),
              onClick: (_) => h(M + 1)
            }, v(c(b)), 11, Ty)
          ], 64))), 128))
        ]),
        o.value ? (r(), d("p", Iy, "What you opened is no longer in this dashboard. Here is its start page.")) : k("", !0),
        A(Vt, {
          name: "page",
          mode: "out-in"
        }, {
          default: P(() => [
            (r(), d("div", {
              key: i.value,
              class: "page"
            }, [
              A(ar, {
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
}, Ry = /* @__PURE__ */ z(By, [["__scopeId", "data-v-fbe83734"]]);
function Ny(e, t) {
  const n = st(), a = zs(e, tr.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  _e(e), at(() => {
    s(), a.cancel();
  });
}
const Ly = {
  key: 0,
  class: "window-failure"
}, qy = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = st(), o = C(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? Ny(l, n.events) : Ws(l, () => !0, tr.documentWithNoEvents), (i, u) => o.value && !o.value.ok ? (r(), d("p", Ly, v(o.value.error), 1)) : o.value ? (r(), j(Ry, {
      key: 1,
      document: o.value.value,
      onFile: u[0] || (u[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : k("", !0);
  }
}, Dy = 1e4;
class Py {
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
    return this.heardAt !== null && t - this.heardAt > Dy;
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
const jy = {
  key: 0,
  class: "frame-note"
}, Fy = {
  key: 0,
  class: "frame-note"
}, Wy = ["src", "title"], Hy = 1e3, zy = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = st(), a = C(null), s = C(!1), o = C(!1);
    let l = null, i = 0;
    return _e(() => {
      l = new Py(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, Hy);
    }), Ne(() => {
      l == null || l.stop(), clearInterval(i);
    }), (u, c) => o.value ? (r(), d("p", jy, "This window was closed because it stopped answering.")) : (r(), d(q, { key: 1 }, [
      s.value ? (r(), d("div", Fy, [
        c[2] || (c[2] = m("p", null, "This window has not answered for ten seconds.", -1)),
        A(ge, {
          onClick: c[0] || (c[0] = (f) => o.value = !0)
        }, {
          default: P(() => [...c[1] || (c[1] = [
            G("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : k("", !0),
      m("iframe", {
        ref_key: "frame",
        ref: a,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: R(n).window
      }, null, 8, Wy)
    ], 64));
  }
}, Uy = /* @__PURE__ */ z(zy, [["__scopeId", "data-v-32a49046"]]), Gy = {
  class: "allowance-prompt",
  role: "dialog"
}, Vy = { class: "allowance-prompt-text" }, Ky = { class: "allowance-prompt-buttons" }, Yy = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", Gy, [
      m("p", Vy, v(R(Wv)(e.request)), 1),
      m("div", Ky, [
        A(ge, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: P(() => [...s[2] || (s[2] = [
            G("Allow", -1)
          ])]),
          _: 1
        }),
        A(ge, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: P(() => [...s[3] || (s[3] = [
            G("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Qy = /* @__PURE__ */ z(Yy, [["__scopeId", "data-v-cad69fe2"]]), Fa = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), j(cn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: P(() => [
        G(v(e.reason) + " ", 1),
        e.retry ? (r(), j(ge, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: P(() => [...s[2] || (s[2] = [
            G("Retry", -1)
          ])]),
          _: 1
        })) : k("", !0),
        e.removable ? (r(), j(ge, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: P(() => [...s[3] || (s[3] = [
            G("Remove tab", -1)
          ])]),
          _: 1
        })) : k("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Xy = ["data-window", "data-agent"], Jy = {
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
    const n = e, a = t, s = C(""), o = C(0);
    function l() {
      s.value = "", o.value++;
    }
    const i = Me(Nc, null), u = Gd({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: x(() => n.options),
      declared: n.declared,
      page: Me(Fd, null),
      setOption: (h, g) => a("option", h, g),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      sources: n.sources,
      links: n.links,
      search: n.search,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (h, g) => {
        a("open", h, g), i == null || i(h, g);
      }
    });
    Ps(Be, u), pe(() => n.visible, (h) => h && n.subscriptions.shown(n.name)), _e(u.settle), Ne(() => {
      u.cancel(), n.subscriptions.stopAll(n.name);
    }), hu((h) => (s.value = h instanceof Error ? h.message : String(h), n.subscriptions.stopAll(n.name), !1));
    const c = () => ma(n.component), f = () => {
      var h, g;
      return ((g = (h = n.prompts) == null ? void 0 : h.current.value) == null ? void 0 : g.window) === n.name ? n.prompts.current.value : null;
    };
    return (h, g) => (r(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (r(), j(Qy, {
        key: 0,
        request: f(),
        onAnswer: g[0] || (g[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : k("", !0),
      e.unavailableReason ? (r(), j(Fa, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (r(), j(Fa, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (r(), d(q, { key: 4 }, [
        (r(), j(c, { key: o.value })),
        e.skeleton.length && !R(u).answered.value ? (r(), j(ro, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : k("", !0)
      ], 64)) : (r(), j(Fa, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: g[1] || (g[1] = (y) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, Xy));
  }
}, an = /* @__PURE__ */ z(Jy, [["__scopeId", "data-v-c4443e2b"]]), sr = {
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
    const n = e, a = t, s = { render: () => ma(Uy, { src: n.entry.entry_url }) };
    return (o, l) => (r(), j(an, {
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
}, Zy = ["data-window"], or = {
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
    const n = e, a = t, s = tt(null), o = C("");
    return pe(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, Xu();
          } catch (i) {
            if (Yu(i) && Qu(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (l, i) => !s.value && !o.value && !e.entry.unavailable_reason ? (r(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      A(ro, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, Zy)) : (r(), j(an, {
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
}, e0 = {
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
    const n = t, a = e, s = x(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = x(() => s.value && { render: () => ma(qy, { line: s.value.line, events: s.value.events }) }), l = C(null), i = x(() => {
      var g, y;
      return ((g = s.value) == null ? void 0 : g.loading) === "component" && !s.value.allowed && !((y = l.value) != null && y.component_trusted);
    }), u = x(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = x(
      () => {
        var g, y;
        return l.value ? Hv(l.value, h) : { reads: ((g = s.value) == null ? void 0 : g.reads) || [], runs: ((y = s.value) == null ? void 0 : y.runs) || [], missing: [], ask: async () => !0 };
      }
    );
    async function f() {
      if (!s.value || s.value.allowed || !a.shellRead) return;
      const g = await a.shellRead(`window permissions ${a.name} --environment ${a.environment}`);
      l.value = g.ok ? g.value : null;
    }
    async function h() {
      const g = await a.prompts.ask(s.value.title, l.value);
      return await f(), g;
    }
    return pe(
      () => {
        var g, y;
        return ((g = s.value) == null ? void 0 : g.entry_url) || ((y = s.value) == null ? void 0 : y.line);
      },
      async () => {
        await f(), c.value.missing.length && !i.value && h();
      },
      { immediate: !0 }
    ), (g, y) => {
      var b, M;
      return !s.value && ((b = e.catalogue.loaded) == null ? void 0 : b.value) === !1 ? (r(), j(ro, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((M = s.value) == null ? void 0 : M.shows) === "one-agent" && e.agent === null ? (r(), j(cn, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (r(), j(an, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": u.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (r(), j(or, {
        key: c.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[0] || (y[0] = (_, S) => n("option", _, S))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (r(), j(sr, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[1] || (y[1] = (_, S) => n("option", _, S))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (r(), j(an, {
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
        onOption: y[2] || (y[2] = (_, S) => n("option", _, S))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (r(), j(an, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: y[3] || (y[3] = (_) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, t0 = ["data-section"], n0 = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, a0 = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Me(Ys, null), a = x(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = x(() => ({ row: t.row }));
    return (o, l) => R(n) ? (r(!0), d(q, { key: 0 }, ne(a.value, (i) => (r(), d("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (r(), j(e0, {
        key: 0,
        name: i.name,
        catalogue: R(n).catalogue,
        subscriptions: R(n).subscriptions,
        environment: R(n).environment,
        prompts: R(n).prompts,
        "shell-read": R(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (r(), d("p", n0, v(i.name) + " is not available", 1))
    ], 8, t0))), 128)) : k("", !0);
  }
}, Ms = /* @__PURE__ */ z(a0, [["__scopeId", "data-v-a47d36b7"]]), s0 = { class: "rail-head" }, o0 = { key: 0 }, l0 = {
  key: 1,
  class: "rail-none"
}, i0 = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (r(), d("aside", {
      class: Y(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      m("div", s0, [
        n[0] || (n[0] = m("h3", null, "Comments", -1)),
        e.comments.length ? (r(), d("span", o0, v(e.total || e.comments.length), 1)) : k("", !0)
      ]),
      e.comments.length ? (r(!0), d(q, { key: 0 }, ne(e.comments, (a) => (r(), j(Zi, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (r(), d("p", l0, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, r0 = /* @__PURE__ */ z(i0, [["__scopeId", "data-v-4d684649"]]), u0 = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, c0 = ["aria-pressed"], d0 = ["aria-pressed"], f0 = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, h0 = {
  key: 0,
  role: "alert"
}, m0 = {
  key: 1,
  class: "sidebar-none"
}, p0 = ["data-question-id"], g0 = { class: "question-state" }, v0 = ["data-question-show", "onClick"], y0 = {
  key: 0,
  class: "sidebar-none"
}, b0 = {
  key: 1,
  class: "question-answer"
}, k0 = {
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
    const t = Me(Ys, null);
    return (n, a) => (r(), d("div", {
      class: Y(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      m("nav", u0, [
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, c0),
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, d0)
      ]),
      e.mode === "comments" ? (r(), d(q, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (r(), j(r0, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : k("", !0),
        A($n, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (r(), d("aside", f0, [
        e.failure ? (r(), d("p", h0, v(e.failure), 1)) : e.questions.length ? k("", !0) : (r(), d("p", m0, "No questions about this text yet.")),
        (r(!0), d(q, null, ne(e.questions, (s) => {
          var o;
          return r(), d("section", {
            key: s.id,
            class: Y(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            m("span", g0, v(R(dn)("question", s.state)), 1),
            m("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, v(s.text), 9, v0),
            s.quote ? (r(), d(q, { key: 0 }, [
              m("blockquote", null, v(s.quote), 1),
              e.lost.includes(s.id) ? (r(), d("p", y0, "The quoted text has changed.")) : k("", !0)
            ], 64)) : k("", !0),
            s.answer ? (r(), d("p", b0, "Answered: " + v(s.answer), 1)) : k("", !0),
            A(Ms, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            A(eo, {
              name: "row.question",
              row: { ...s, term: "question" },
              environment: ((o = R(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, p0);
        }), 128))
      ]))
    ], 2));
  }
}, al = /* @__PURE__ */ z(k0, [["__scopeId", "data-v-660e5c85"]]), w0 = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, $0 = {
  __name: "DocumentEditDialog",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Gt({ abstract: n.row.abstract, body: n.row.body }), o = C("");
    async function l() {
      const i = await n.read([n.term, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = i.ok ? "" : i.error, i.ok && a("saved");
    }
    return (i, u) => (r(), j(ba, {
      padded: "",
      title: "Edit the document",
      wide: "",
      onClose: u[3] || (u[3] = (c) => a("close"))
    }, {
      foot: P(() => [
        m("span", w0, v(o.value), 1),
        A(ge, {
          onClick: u[2] || (u[2] = (c) => a("close"))
        }, {
          default: P(() => [...u[6] || (u[6] = [
            G("Cancel", -1)
          ])]),
          _: 1
        }),
        A(ge, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: P(() => [...u[7] || (u[7] = [
            G("Save", -1)
          ])]),
          _: 1
        })
      ]),
      default: P(() => [
        m("form", {
          class: "edit-form",
          "data-text-form": "",
          onSubmit: xe(l, ["prevent"])
        }, [
          m("label", null, [
            u[4] || (u[4] = m("span", null, "Abstract", -1)),
            Ve(m("input", {
              "onUpdate:modelValue": u[0] || (u[0] = (c) => s.abstract = c)
            }, null, 512), [
              [ta, s.abstract]
            ])
          ]),
          m("label", null, [
            u[5] || (u[5] = m("span", null, "Text", -1)),
            Ve(m("textarea", {
              "onUpdate:modelValue": u[1] || (u[1] = (c) => s.body = c),
              rows: "20"
            }, null, 512), [
              [ta, s.body]
            ])
          ])
        ], 32)
      ]),
      _: 1
    }));
  }
}, x0 = /* @__PURE__ */ z($0, [["__scopeId", "data-v-464d77a8"]]);
function lr(e, t) {
  const n = C([]), a = C(!1), s = C(null), o = C(0), l = C(!1), i = C("");
  let u = 0, c = 0;
  const f = (b) => {
    if (typeof b.body == "string") return b.body;
    const { term: M, id: _, title: S } = e(), T = `On ${M} ${_}, ${S}: `;
    return b.text.startsWith(T) ? b.text.slice(T.length) : b.text;
  };
  async function h(b = 1) {
    const { term: M, id: _ } = e();
    if (!_) return;
    const S = ++c;
    l.value = !0, i.value = "";
    try {
      const T = await t([M, "comments", String(_), "--page", String(b), "--page-size", "25"]);
      if (S !== c) return;
      if (!T.ok) {
        i.value = T.error;
        return;
      }
      const H = T.value.rows ?? [], W = b === 1 ? H : [...n.value, ...H];
      n.value = [...new Map(W.map((I) => [I.id, I])).values()], o.value = T.value.total ?? n.value.length, s.value = T.value.next_page ?? null;
    } catch (T) {
      S === c && (i.value = T.message);
    } finally {
      S === c && (l.value = !1);
    }
  }
  async function g(b) {
    var I;
    const { term: M, id: _ } = e(), S = `${M}:${_}`, T = { id: `sending-${++u}`, text: b };
    n.value = [...n.value, T], o.value++, a.value = !0;
    const H = await t([M, "comment", String(_), b]);
    if (S !== `${e().term}:${e().id}`) return;
    if (!H.ok)
      throw n.value = n.value.filter((V) => V.id !== T.id), o.value = Math.max(0, o.value - 1), new Error(H.error);
    await h();
    const W = (I = H.value) == null ? void 0 : I.id;
    W && !n.value.some((V) => V.id === W) && (n.value = [...n.value, { ...T, id: W }]);
  }
  const y = () => !l.value && s.value && h(s.value);
  return pe(() => `${e().term}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, i.value = "", c++, h();
  }, { immediate: !0 }), { comments: n, open: a, words: f, send: g, load: h, loadMore: y, nextPage: s, total: o, loading: l, failure: i };
}
function S0(e, t) {
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
const M0 = {
  class: "document-tab",
  "data-document-revisions": ""
}, _0 = ["datetime"], C0 = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, E0 = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, A0 = {
  key: 2,
  class: "document-none"
}, O0 = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(null), o = C(""), l = x(() => s.value ? S0(s.value.body, n.text) : []);
    async function i(c) {
      const f = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = f.ok ? f.value : null, o.value = f.ok ? "" : f.error;
    }
    async function u() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, f) => (r(), d("div", M0, [
      e.editing ? (r(), j(ge, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: f[0] || (f[0] = (h) => a("close-revision"))
      }, {
        default: P(() => [...f[1] || (f[1] = [
          G("Close the open revision", -1)
        ])]),
        _: 1
      })) : k("", !0),
      e.revisions.length ? (r(), d(q, { key: 1 }, [
        (r(!0), d(q, null, ne(e.revisions, (h) => (r(), j(ge, {
          key: h.number,
          variant: "text",
          "data-text-revision": h.number,
          onClick: (g) => i(h)
        }, {
          default: P(() => [
            G("Revision " + v(h.number) + ": " + v(h.change) + " · " + v(h.author_name) + " · ", 1),
            m("time", {
              datetime: h.created_at
            }, v(h.created_at.slice(0, 16).replace("T", " ")), 9, _0)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (r(), d("p", C0, v(o.value), 1)) : k("", !0),
        s.value ? (r(), d(q, { key: 1 }, [
          A(ge, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: u
          }, {
            default: P(() => [...f[2] || (f[2] = [
              G("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          m("div", E0, [
            (r(!0), d(q, null, ne(l.value, (h) => (r(), d("div", {
              key: h.key,
              class: Y(["revision-line", h.type])
            }, v(h.text || " "), 3))), 128))
          ])
        ], 64)) : k("", !0)
      ], 64)) : (r(), d("p", A0, "No revisions"))
    ]));
  }
}, T0 = /* @__PURE__ */ z(O0, [["__scopeId", "data-v-3a381aa4"]]), I0 = "button, [data-comment-number]", B0 = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function ir(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(I0) || n.push(t.currentNode);
  return n;
}
function sl(e, t, n) {
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
const R0 = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function N0(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = ir(e), s = a.map((c) => c.data).join(""), o = sl(a, n.startContainer, n.startOffset), l = s.slice(o, sl(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const u = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: R0(u.nodeType === Node.TEXT_NODE ? u.parentElement : u) };
}
function L0(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function q0(e, t, n) {
  const a = [];
  let s = 0;
  for (const o of e) {
    const l = Math.max(t - s, 0), i = Math.min(n - s, o.data.length);
    l < i && a.push({ node: o, from: l, to: i }), s += o.data.length;
  }
  return a;
}
function Wa(e, t, n = "Comment") {
  const a = document.createElement("button");
  return a.type = "button", a.className = "comment-number", a.dataset.commentNumber = t, a.setAttribute("aria-label", `${n} ${e}`), a.textContent = e, a;
}
function D0({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function P0(e, t) {
  const n = ir(e), a = L0(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = q0(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(D0).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(Wa(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(Wa(t.number, t.id, t.label)) : l.at(-1).append(Wa(t.number, t.id, t.label))), !0;
}
function j0(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !P0(e, a) && a.id && n.push(a.id);
  return n;
}
const F0 = (e) => e.closest(B0) ?? e;
function ol(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const W0 = {
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
    const a = e, s = n, o = C(null), l = C(null), i = C(null), u = C(!1), c = C(null);
    function f() {
      if (!l.value || u.value) return;
      l.value.innerHTML = a.html;
      const M = a.comments.filter((H) => H.quote).map((H) => ({ ...H, label: a.annotationLabel, hot: H.id === a.hot })), _ = j0(l.value, a.pending ? [...M, { ...a.pending, pending: !0 }] : M);
      s("lost", _);
      const S = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!S) {
        c.value = null;
        return;
      }
      const T = document.createElement("div");
      T.className = "inline-comment", F0(S).after(T), c.value = T;
    }
    function h() {
      if (!l.value) return;
      const M = N0(l.value);
      if (u.value = !!M, !M) {
        i.value = null;
        return;
      }
      const _ = window.getSelection().getRangeAt(0).getBoundingClientRect(), S = o.value.getBoundingClientRect();
      i.value = { left: `${Math.max(_.left - S.left, 0)}px`, top: `${_.top - S.top + o.value.scrollTop}px` }, s("select", M);
    }
    function g(M) {
      const _ = M.target.closest("[data-comment-number]");
      _ ? s("number", Number(_.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function y(M) {
      var _;
      (_ = l.value.querySelector(`[data-comment="${M}"]`)) == null || _.scrollIntoView({ block: "center" });
    }
    function b(M) {
      var _;
      (_ = l.value.querySelectorAll("h3, h4, h5, h6")[M]) == null || _.scrollIntoView({ block: "start" });
    }
    return pe(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, u.value, a.pending], f, { flush: "post" }), _e(() => {
      f(), document.addEventListener("selectionchange", h);
    }), at(() => document.removeEventListener("selectionchange", h)), t({ show: y, showHeading: b, nextTick: Fe }), (M, _) => (r(), d("div", {
      ref_key: "box",
      ref: o,
      class: "document-text"
    }, [
      m("div", {
        ref_key: "text",
        ref: l,
        class: "md document-words",
        "data-resource-text": "",
        onClick: g
      }, null, 512),
      i.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "comment-pill",
        style: ve(i.value),
        "data-comment-pill": "",
        onMousedown: _[0] || (_[0] = xe(() => {
        }, ["prevent"])),
        onClick: _[1] || (_[1] = (S) => s("write"))
      }, [
        A(le, {
          name: "chat",
          size: 13
        }),
        _[2] || (_[2] = G("Comment on this", -1))
      ], 36)) : k("", !0),
      c.value ? (r(), j(wn, {
        key: 1,
        to: c.value
      }, [
        re(M.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : k("", !0),
      re(M.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, H0 = /* @__PURE__ */ z(W0, [["__scopeId", "data-v-a92386e6"]]), z0 = { class: "document-tabs" }, U0 = ["aria-pressed"], G0 = { class: "document-body" }, V0 = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, K0 = {
  key: 1,
  class: "document-loading"
}, Y0 = {
  class: "document-details",
  "data-resource-fields": ""
}, Q0 = 760, X0 = {
  __name: "DocumentBody",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = Me(ri, C(null)), a = C(null), s = Cv(a), o = x(() => s.value !== null && s.value < Q0), l = C(null), i = C(""), u = C([]), c = C([]), f = C(""), h = C("comments"), g = C("text"), y = C(0), b = C(!1), M = C(0), _ = C([]), S = C(null), T = C(""), H = C(!1), W = C(null), I = C(null);
    let V = 0;
    const L = lr(() => l.value ? { term: t.term, id: t.id, title: l.value.title } : {}, (se) => t.read(se)), E = x(() => ol(L.comments.value)), N = x(() => h.value === "questions" ? ol(c.value) : E.value), D = x(() => h.value === "questions" ? N.value.length : L.total.value), w = x(() => {
      var se;
      return (se = l.value) != null && se.body ? ao(l.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), p = x(() => {
      var se;
      return (((se = l.value) == null ? void 0 : se.body) ?? "").split(`
`).filter((Q) => /^#{1,4} /.test(Q)).map((Q, me) => ({ key: String(me), value: me, label: Q.replace(/^#+ /, "") }));
    }), $ = x(() => E.value.find((se) => se.id === M.value)), O = x(() => {
      var se;
      return (se = l.value) != null && se.close_reason ? "Closed" : "Open";
    }), B = x(() => g.value === "comments" && !o.value ? "text" : g.value), F = (se) => se.ok ? se.value.rows ?? [] : [];
    async function U() {
      const se = ++V, Q = await t.read([t.term, "inspect", String(t.id)]);
      if (se !== V) return;
      i.value = Q.ok ? "" : Q.error, l.value = Q.ok ? Q.value : null;
      const me = await t.read(["question", "list", "--all", "--row", `${t.term}:${t.id}`]), Je = t.term === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      se === V && (c.value = F(me), f.value = me.ok ? "" : me.error, u.value = Je ? F(Je) : []);
    }
    async function J(se) {
      const Q = S.value ? ["--quote", S.value.quote, "--position", String(S.value.position), "--selection-type", S.value.selection_type] : [], me = await t.read([t.term, "comment", String(t.id), ...Q, "--", se]);
      if (!me.ok) throw new Error(me.error);
      S.value = null, await Promise.all([U(), L.load()]);
    }
    async function oe() {
      const se = await t.read(["doc", "close", String(t.id)]);
      i.value = se.ok ? "" : se.error, se.ok && await U();
    }
    function ue() {
      T.value.trim() || (S.value = null);
    }
    async function ke(se) {
      var Q;
      if (y.value = se, o.value && h.value === "questions") {
        g.value = "comments";
        return;
      }
      if (o.value) {
        M.value = M.value === se ? 0 : se;
        return;
      }
      b.value = !0, await Fe(), (Q = a.value.querySelector(h.value === "questions" ? `[data-question-id="${se}"]` : `[data-comment-id="${se}"]`)) == null || Q.scrollIntoView({ block: "nearest" });
    }
    async function Ae(se) {
      var Q, me;
      g.value = "text", y.value = se, await ((Q = W.value) == null ? void 0 : Q.nextTick()), (me = W.value) == null || me.show(se);
    }
    function be() {
      H.value = !1, U();
    }
    return pe(() => `${t.term}:${t.id}`, () => {
      l.value = null, g.value = "text", b.value = !1, y.value = 0, M.value = 0, S.value = null, c.value = [], f.value = "", U();
    }, { immediate: !0 }), pe(h, () => {
      y.value = 0, M.value = 0;
    }), (se, Q) => (r(), d("div", {
      ref_key: "panel",
      ref: a,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      l.value ? (r(), j(wn, {
        key: 0,
        to: R(n),
        disabled: !R(n)
      }, [
        m("span", {
          class: Y(["document-actions", { placed: R(n) }]),
          "data-document-actions": ""
        }, [
          A(ge, {
            bordered: "",
            "data-text-edit": "",
            onClick: Q[0] || (Q[0] = (me) => H.value = !0)
          }, {
            default: P(() => [...Q[15] || (Q[15] = [
              G("Edit", -1)
            ])]),
            _: 1
          }),
          B.value === "text" && p.value.length > 1 ? (r(), j(Gs, {
            key: 0,
            label: o.value ? "" : "Chapters",
            icon: "list",
            items: p.value,
            "data-text-chapters": "",
            onPick: Q[1] || (Q[1] = (me) => {
              var Je;
              return (Je = W.value) == null ? void 0 : Je.showHeading(me.value);
            })
          }, null, 8, ["label", "items"])) : k("", !0)
        ], 2)
      ], 8, ["to", "disabled"])) : k("", !0),
      m("nav", z0, [
        m("button", {
          type: "button",
          class: Y(["document-tab-button", { on: B.value === "text" }]),
          "data-document-tab": "text",
          onClick: Q[2] || (Q[2] = (me) => g.value = "text")
        }, "Text", 2),
        o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: Y(["document-tab-button", { on: B.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: Q[3] || (Q[3] = (me) => g.value = "comments")
        }, [
          G(v(h.value === "questions" ? "Questions" : "Comments") + " ", 1),
          m("em", null, v(D.value || ""), 1)
        ], 2)) : (r(), d("button", {
          key: 1,
          type: "button",
          class: Y(["document-tab-button", { on: b.value }]),
          "aria-pressed": b.value,
          "data-document-notes-toggle": "",
          onClick: Q[4] || (Q[4] = (me) => b.value = !b.value)
        }, [
          G(v(h.value === "questions" ? "Questions" : "Comments") + " ", 1),
          m("em", null, v(D.value || ""), 1)
        ], 10, U0)),
        e.term === "doc" ? (r(), d("button", {
          key: 2,
          type: "button",
          class: Y(["document-tab-button", { on: B.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: Q[5] || (Q[5] = (me) => g.value = "revisions")
        }, [
          Q[16] || (Q[16] = G("Revisions ", -1)),
          m("em", null, v(u.value.length || ""), 1)
        ], 2)) : k("", !0)
      ]),
      m("div", G0, [
        i.value ? (r(), d("p", V0, v(i.value), 1)) : l.value ? B.value === "revisions" ? (r(), j(T0, {
          key: 2,
          id: e.id,
          revisions: u.value,
          text: l.value.body,
          read: e.read,
          editing: l.value.open_author_id !== null && l.value.open_author_id !== void 0,
          onCloseRevision: oe,
          onRestored: U
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : B.value === "comments" ? (r(), j(al, {
          key: 3,
          mode: h.value,
          "onUpdate:mode": Q[6] || (Q[6] = (me) => h.value = me),
          tab: "",
          comments: E.value,
          questions: c.value,
          hot: y.value,
          lost: _.value,
          failure: f.value,
          read: e.read,
          "comment-more": !!R(L).nextPage.value,
          "comment-loading": R(L).loading.value,
          "comment-failure": R(L).failure.value,
          "comment-total": R(L).total.value,
          onMore: R(L).loadMore,
          onShow: Ae,
          onChanged: U
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (r(), d(q, { key: 4 }, [
          A(H0, {
            ref_key: "words",
            ref: W,
            html: w.value,
            comments: N.value,
            "annotation-label": h.value === "questions" ? "Question" : "Comment",
            hot: y.value,
            pending: S.value,
            inline: M.value,
            onSelect: Q[8] || (Q[8] = (me) => S.value = me),
            onClear: ue,
            onNumber: ke,
            onWrite: Q[9] || (Q[9] = (me) => {
              var Je;
              return (Je = I.value) == null ? void 0 : Je.focus();
            }),
            onLost: Q[10] || (Q[10] = (me) => _.value = me)
          }, {
            inline: P(() => [
              $.value ? (r(), j(Zi, {
                key: 0,
                comment: $.value,
                hot: "",
                onShow: Q[7] || (Q[7] = (me) => Ae($.value.id))
              }, null, 8, ["comment"])) : k("", !0)
            ]),
            default: P(() => [
              m("dl", Y0, [
                Q[18] || (Q[18] = m("h4", null, "Details", -1)),
                Q[19] || (Q[19] = m("dt", null, "State", -1)),
                m("dd", null, v(O.value), 1),
                l.value.close_reason ? (r(), d(q, { key: 0 }, [
                  Q[17] || (Q[17] = m("dt", null, "Why closed", -1)),
                  m("dd", null, v(l.value.close_reason), 1)
                ], 64)) : k("", !0),
                Q[20] || (Q[20] = m("dt", null, "Created", -1)),
                m("dd", null, [
                  A(nt, {
                    at: l.value.created_at
                  }, null, 8, ["at"])
                ]),
                Q[21] || (Q[21] = m("dt", null, "Updated", -1)),
                m("dd", null, [
                  A(nt, {
                    at: l.value.updated_at
                  }, null, 8, ["at"])
                ])
              ])
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          !o.value && b.value ? (r(), j(al, {
            key: 0,
            mode: h.value,
            "onUpdate:mode": Q[11] || (Q[11] = (me) => h.value = me),
            comments: E.value,
            questions: c.value,
            hot: y.value,
            lost: _.value,
            failure: f.value,
            read: e.read,
            "comment-more": !!R(L).nextPage.value,
            "comment-loading": R(L).loading.value,
            "comment-failure": R(L).failure.value,
            "comment-total": R(L).total.value,
            onMore: R(L).loadMore,
            onShow: Ae,
            onChanged: U
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : k("", !0)
        ], 64)) : (r(), d("div", K0, [
          A(Xe)
        ]))
      ]),
      l.value ? (r(), j(Fv, {
        key: 1,
        ref_key: "composer",
        ref: I,
        draft: T.value,
        "onUpdate:draft": Q[12] || (Q[12] = (me) => T.value = me),
        selection: S.value,
        send: J,
        narrow: o.value,
        onClear: Q[13] || (Q[13] = (me) => S.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : k("", !0),
      H.value ? (r(), j(x0, {
        key: 2,
        term: e.term,
        id: e.id,
        row: l.value,
        read: e.read,
        onClose: Q[14] || (Q[14] = (me) => H.value = !1),
        onSaved: be
      }, null, 8, ["term", "id", "row", "read"])) : k("", !0)
    ], 512));
  }
}, aM = /* @__PURE__ */ z(X0, [["__scopeId", "data-v-f9bd78a7"]]), J0 = {
  key: 1,
  class: "row-list-failure"
}, Z0 = ["data-row"], eb = {
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
    const t = e, n = x(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : t.moves ? { tag: "ul", name: "row-list", css: !t.leavesAtOnce, "data-row-list-moves": "" } : {}), a = C(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (r(), j(Xe, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (r(), d("p", J0, v(e.failure), 1)) : !e.rows.length && e.loaded ? (r(), j(cn, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: P(() => [
        G(v(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (r(), d(q, { key: 3 }, [
      (r(), j(Ye(e.arrival || e.moves ? js : "ul"), De(n.value, { class: "row-list" }), {
        default: P(() => [
          (r(!0), d(q, null, ne(e.rows, (i) => (r(), d("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            re(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, Z0))), 128))
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
}, tb = /* @__PURE__ */ z(eb, [["__scopeId", "data-v-e9f251f3"]]), nb = {
  class: "agent-rows",
  "data-agent-rows": ""
}, ab = {
  key: 1,
  class: "agent-rows-note"
}, sb = {
  key: 2,
  class: "agent-rows-note"
}, ob = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, lb = ["data-agent-row", "onClick"], ib = { class: "agent-row-name" }, rb = { class: "agent-row-state" }, ub = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = x(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = x(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (r(), d("div", nb, [
      e.loaded ? e.failure ? (r(), d("p", ab, v(e.failure), 1)) : e.rows.length ? (r(), d(q, { key: 3 }, [
        m("p", ob, v(a.value) + " running", 1),
        (r(!0), d(q, null, ne(n.value, (l) => (r(), d("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => R(je)(`agents:${l.id}`)
        }, [
          m("span", ib, "#" + v(l.id) + " " + v(l.session), 1),
          m("span", rb, v(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, lb))), 128))
      ], 64)) : (r(), d("p", sb, v(e.none), 1)) : (r(), j(Xe, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, sM = /* @__PURE__ */ z(ub, [["__scopeId", "data-v-a01e5a17"]]), ht = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ge = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, ze = { across: 48, down: 110, margin: 32, labelSpace: 14 }, cb = 6;
function uo(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const db = (e) => {
  const t = uo(e, ht.lineChars), n = Math.max(ht.minWidth, Math.max(...t.map((a) => a.length)) * ht.charWidth + ht.padX * 2);
  return { name: e, lines: t, line: ht.line, padY: ht.padY, width: n, height: t.length * ht.line + ht.padY * 2 };
};
function fb(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, u) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(u) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function hb(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function mb(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var i;
    return (a[i = n.get(l)] || (a[i] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((i, u) => [i, u]))), o = (l, i) => {
    const u = s(), c = (f) => {
      const h = i(f).map((g) => u.get(g));
      return h.length ? h.reduce((g, y) => g + y, 0) / h.length : u.get(f);
    };
    return [...l].sort((f, h) => c(f) - c(h));
  };
  for (let l = 0; l < cb; l++) {
    const i = l % 2 === 0, u = a.map((c, f) => f);
    (i ? u.slice(1) : u.slice(0, -1).reverse()).forEach((c) => {
      const f = (h) => t.filter((g) => g[i ? 1 : 0] === h).map((g) => g[i ? 0 : 1]);
      a[c] = o(a[c], f);
    });
  }
  return a;
}
function pb(e, t) {
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
function gb(e) {
  const t = [...new Set(e.flatMap(([W, I]) => [W, I]))], n = new Set(e.map(([, W]) => W)), a = t.filter((W) => !n.has(W)), s = fb(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((W, I) => !s.has(I)), l = hb(t, o), i = mb(t, o, l), u = new Map(t.map((W) => [W, db(W)])), c = i.map((W) => W.reduce((I, V) => I + u.get(V).width, 0) + ze.across * (W.length - 1)), f = Math.max(...c) + ze.margin * 2, h = yb(e, l, i.length), g = /* @__PURE__ */ new Map();
  let y = ze.margin;
  i.forEach((W, I) => {
    let V = (f - c[I]) / 2;
    const L = Math.max(...W.map((E) => u.get(E).height));
    W.forEach((E) => {
      const N = u.get(E);
      g.set(E, { ...N, x: V, y: y + (L - N.height) / 2 }), V += N.width + ze.across;
    }), y += L + (h[I] ?? ze.down);
  });
  const b = e.map(([W, I, V], L) => ({ from: W, to: I, label: V || "", back: s.has(L) || l.get(I) <= l.get(W) }));
  pb(b, g);
  const M = b.map((W) => bb(W, g.get(W.from), g.get(W.to))), _ = [...g.values()], S = xb(M, _), T = Math.max(y - ze.down, ...S.filter((W) => W.label).map((W) => W.label.y + W.label.height));
  return { width: Math.max(f - ze.margin, ...S.filter((W) => W.label).map((W) => W.label.x + W.label.width)) + ze.margin, height: T + ze.margin, nodes: _, arrows: S };
}
const vb = (e) => e ? uo(e, Ge.lineChars).length * Ge.line + Ge.pad * 2 : 0;
function yb(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => ze.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, u] = [t.get(s), t.get(o)].sort((c, f) => c - f);
    u > i && (a[i + Math.floor((u - i - 1) / 2)] += vb(l) + ze.labelSpace);
  }), a.map((s) => Math.max(ze.down, s));
}
function bb(e, t, n) {
  const a = e.label ? uo(e.label, Ge.lineChars) : [], s = a.length ? Math.max(...a.map((g) => g.length)) * Ge.charWidth + Ge.pad * 2 : 0, o = a.length * Ge.line + (a.length ? Ge.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, u = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, f = (c - i) / 2, h = [{ x: l, y: i }, { x: l, y: i + f }, { x: u, y: c - f }, { x: u, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: h, path: `M${l} ${i} C${l} ${i + f} ${u} ${c - f} ${u} ${c}` };
}
const kb = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, wb = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], $b = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ge.line);
function xb(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (u, c) => {
      const f = kb(a.curve, u);
      return { x: f.x - a.labelWidth / 2, y: f.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = $b.flatMap((u) => wb.map((c) => s(c, u))).find((u) => !n.some((c) => ll(u, c))) ?? s(0.5, 0);
    for (; n.some((u) => ll(i, u)); ) i.y += Ge.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: Ge.line, pad: Ge.pad } };
  });
}
const ll = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Sb = { class: "flowchart-tools" }, Mb = ["width", "height", "viewBox", "aria-label"], _b = ["d"], Cb = ["x", "y", "width", "height"], Eb = ["x", "y"], Ab = ["x", "dy"], Ob = {
  key: 0,
  class: "flowchart-label"
}, Tb = ["x", "y", "width", "height"], Ib = ["x", "y"], Bb = ["x", "dy"], Rb = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(() => gb(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = C(null), i = C({ zoom: 1, x: 0, y: 0 });
    let u = null;
    function c() {
      var S;
      const M = (S = l.value) == null ? void 0 : S.getBoundingClientRect();
      if (!(M != null && M.width)) return;
      const _ = Math.min(M.width / s.value.width, M.height / s.value.height, 1.5);
      i.value = { zoom: _, x: (M.width - s.value.width * _) / 2, y: (M.height - s.value.height * _) / 2 };
    }
    function f(M, _, S) {
      const { zoom: T, x: H, y: W } = i.value, I = Math.min(o.most, Math.max(o.least, T * M));
      i.value = { zoom: I, x: _ - (_ - H) * I / T, y: S - (S - W) * I / T };
    }
    function h(M) {
      const _ = l.value.getBoundingClientRect();
      f(M, _.width / 2, _.height / 2);
    }
    function g(M) {
      const _ = l.value.getBoundingClientRect();
      M.ctrlKey || M.metaKey ? f(M.deltaY < 0 ? o.step : 1 / o.step, M.clientX - _.left, M.clientY - _.top) : i.value = { ...i.value, x: i.value.x - M.deltaX, y: i.value.y - M.deltaY };
    }
    function y(M) {
      var _, S, T;
      M.preventDefault(), (_ = window.getSelection()) == null || _.removeAllRanges(), u = { x: M.clientX - i.value.x, y: M.clientY - i.value.y }, (T = (S = l.value).setPointerCapture) == null || T.call(S, M.pointerId);
    }
    function b(M) {
      u && (i.value = { ...i.value, x: M.clientX - u.x, y: M.clientY - u.y });
    }
    return _e(c), (M, _) => (r(), j(ba, {
      padded: "",
      title: e.title,
      large: "",
      onClose: _[4] || (_[4] = (S) => a("close"))
    }, {
      default: P(() => [
        m("div", Sb, [
          A(ge, {
            small: "",
            onClick: _[0] || (_[0] = (S) => h(o.step))
          }, {
            default: P(() => [..._[5] || (_[5] = [
              G("Zoom in", -1)
            ])]),
            _: 1
          }),
          A(ge, {
            small: "",
            onClick: _[1] || (_[1] = (S) => h(1 / o.step))
          }, {
            default: P(() => [..._[6] || (_[6] = [
              G("Zoom out", -1)
            ])]),
            _: 1
          }),
          A(ge, {
            small: "",
            onClick: c
          }, {
            default: P(() => [..._[7] || (_[7] = [
              G("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        m("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: xe(g, ["prevent"]),
          onPointerdown: y,
          onPointermove: b,
          onPointerup: _[2] || (_[2] = (S) => Eo(u) ? u.value = null : u = null),
          onPointercancel: _[3] || (_[3] = (S) => Eo(u) ? u.value = null : u = null)
        }, [
          (r(), d("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: ve({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
          }, [
            _[8] || (_[8] = m("defs", null, [
              m("marker", {
                id: "flowchart-head",
                viewBox: "0 0 10 10",
                refX: "9",
                refY: "5",
                markerWidth: "7",
                markerHeight: "7",
                orient: "auto"
              }, [
                m("path", { d: "M0 0L10 5L0 10z" })
              ])
            ], -1)),
            (r(!0), d(q, null, ne(s.value.arrows, (S, T) => (r(), d("path", {
              key: `arrow-${T}`,
              class: "flowchart-arrow",
              d: S.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, _b))), 128)),
            (r(!0), d(q, null, ne(s.value.nodes, (S) => (r(), d("g", {
              key: S.name,
              class: "flowchart-node"
            }, [
              m("rect", {
                x: S.x,
                y: S.y,
                width: S.width,
                height: S.height,
                rx: "8"
              }, null, 8, Cb),
              m("text", {
                x: S.x + S.width / 2,
                y: S.y + S.padY + S.line / 2
              }, [
                (r(!0), d(q, null, ne(S.lines, (T, H) => (r(), d("tspan", {
                  key: H,
                  x: S.x + S.width / 2,
                  dy: H ? S.line : 0
                }, v(T), 9, Ab))), 128))
              ], 8, Eb)
            ]))), 128)),
            (r(!0), d(q, null, ne(s.value.arrows, (S, T) => (r(), d(q, {
              key: `label-${T}`
            }, [
              S.label ? (r(), d("g", Ob, [
                m("rect", {
                  x: S.label.x,
                  y: S.label.y,
                  width: S.label.width,
                  height: S.label.height,
                  rx: "4"
                }, null, 8, Tb),
                m("text", {
                  x: S.label.x + S.label.width / 2,
                  y: S.label.y + S.label.pad + S.label.line / 2
                }, [
                  (r(!0), d(q, null, ne(S.label.lines, (H, W) => (r(), d("tspan", {
                    key: W,
                    x: S.label.x + S.label.width / 2,
                    dy: W ? S.label.line : 0
                  }, v(H), 9, Bb))), 128))
                ], 8, Ib)
              ])) : k("", !0)
            ], 64))), 128))
          ], 12, Mb))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Nb = /* @__PURE__ */ z(Rb, [["__scopeId", "data-v-e98799dc"]]), Lb = ["innerHTML"], qb = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = x(() => Do[t.name] || Do.dot);
    return (a, s) => (r(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Lb));
  }
}, Ot = /* @__PURE__ */ z(qb, [["__scopeId", "data-v-beb5935c"]]), Db = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: Y(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      A(Ot, { name: "fold" })
    ], 2));
  }
}, Qt = /* @__PURE__ */ z(Db, [["__scopeId", "data-v-d03899bb"]]), Pb = ["data-tip", "aria-label"], jb = {
  key: 0,
  class: "mact-word"
}, Fb = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: Y(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      A(Ot, { name: "open" }),
      e.open ? (r(), d("span", jb, v(e.label), 1)) : k("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, Pb));
  }
}, rr = /* @__PURE__ */ z(Fb, [["__scopeId", "data-v-3b292e09"]]), ur = 120, Yn = 280, cr = 160, Wb = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, Hb = ["leaving", "resizing", "entering"];
function _s(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function zb(e) {
  const t = Hb.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = _s(e);
  return e.classList.add(...t), n;
}
function dr(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = C(t()), s = C("");
  let o = 0;
  const l = (h, g) => Object.assign(h.style, { width: `${g.width}px`, height: `${g.height}px` }), i = (h) => Object.assign(h.style, { width: "", height: "", transition: "" });
  function u(h, g) {
    i(h);
    const y = zb(h);
    l(h, g), h.offsetWidth, h.style.transition = `width ${Yn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Yn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(h, y);
  }
  function c(h) {
    const g = h.querySelector(":scope > :not(.top)");
    if (!g || typeof ResizeObserver > "u") return null;
    let y = g.offsetHeight;
    const b = new ResizeObserver(() => {
      g.offsetHeight !== y && (y = g.offsetHeight, u(h, _s(h)));
    });
    return b.observe(g), b;
  }
  async function f(h) {
    const g = e.value, y = ++o;
    if (!g || !g.offsetWidth || Wb()) {
      a.value = h;
      return;
    }
    const b = _s(g);
    if (l(g, b), s.value = "leaving", await n(ur), y !== o) return;
    a.value = h, s.value = "resizing", await Fe(), u(g, b);
    const M = c(g);
    await n(Yn), M == null || M.disconnect(), y === o && (i(g), s.value = "entering", await n(cr), y === o && (s.value = ""));
  }
  return pe(t, (h) => f(h)), at(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const Ub = { class: "growing-card-top" }, Gb = ["aria-expanded"], Vb = { class: "growing-card-avatar" }, Kb = { class: "growing-card-title" }, Yb = { class: "growing-card-more" }, Qb = { class: "growing-card-body" }, Xb = {
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
    const n = e, a = t, s = C(!1), o = C(null), { folded: l, phase: i } = dr(o, () => !s.value), u = x(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = x(() => n.text.split(/\n\s*\n/).filter((f) => f.trim()));
    return (f, h) => (r(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: Y(["growing-card-wrap", R(i), { open: !R(l), bad: e.bad, incoming: e.incoming }])
    }, [
      m("div", Ub, [
        m("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: h[0] || (h[0] = (g) => s.value = !s.value)
        }, [
          m("span", Vb, [
            e.bad ? (r(), j(Ot, {
              key: 0,
              name: "cross"
            })) : u.value ? (r(), d(q, { key: 1 }, [
              G(v(u.value), 1)
            ], 64)) : (r(), j(le, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          m("span", Kb, v(e.title), 1),
          A(Qt, { open: s.value }, null, 8, ["open"])
        ], 8, Gb),
        e.action ? (r(), j(rr, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: h[1] || (h[1] = (g) => a("act"))
        }, null, 8, ["label", "open"])) : k("", !0),
        e.commentable ? (r(), d("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: h[2] || (h[2] = (g) => a("comment"))
        }, [
          A(le, {
            name: "bubble",
            size: 13
          })
        ])) : k("", !0)
      ]),
      m("div", Yb, [
        m("div", Qb, [
          (r(!0), d(q, null, ne(c.value, (g, y) => (r(), d("p", {
            key: y,
            class: "growing-card-text"
          }, v(g), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Jb = /* @__PURE__ */ z(Xb, [["__scopeId", "data-v-f2b4930d"]]), Zb = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, ek = { class: "md inline" }, tk = ["disabled", "title", "onClick"], nk = {
  key: 1,
  class: "message-links-many"
}, ak = ["aria-expanded"], sk = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, ok = ["disabled", "onClick"], lk = { class: "row-pill message-links-chip" }, ik = { class: "message-links-title" }, rk = { key: 0 }, Ha = 3, uk = "task", ck = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = x(() => n.total || n.links.length), o = x(() => n.links.every((g) => g.endpoint.model === uk) ? "tasks" : "items"), l = C(!1), i = C(null);
    ci(i, () => l.value = !1);
    const u = () => l.value = !l.value, c = (g) => g.endpoint.unavailable || !g.endpoint.open_ref, f = (g) => g.relations.includes("edited") ? g.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function h(g) {
      c(g) || (l.value = !1, je(g.endpoint.open_ref));
    }
    return (g, y) => (r(), d("div", {
      ref_key: "line",
      ref: i,
      class: Y(["message-links", { many: s.value > Ha, three: s.value === Ha, open: l.value }]),
      "data-message-links": ""
    }, [
      A(Ot, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (r(), d("span", Zb, [
        m("span", ek, [
          y[1] || (y[1] = G("Linked: ", -1)),
          (r(!0), d(q, null, ne(e.links, (b) => (r(), d("button", {
            key: `${b.endpoint.model}:${b.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(b),
            title: b.endpoint.title,
            onClick: (M) => h(b)
          }, [
            G(v(b.endpoint.model.replaceAll("_", " ")) + " " + v(b.endpoint.id), 1),
            f(b) ? (r(), d(q, { key: 0 }, [
              G(" (" + v(f(b)) + ")", 1)
            ], 64)) : k("", !0),
            c(b) ? (r(), d(q, { key: 1 }, [
              G(" (unavailable)")
            ], 64)) : k("", !0)
          ], 8, tk))), 128))
        ])
      ])) : k("", !0),
      s.value >= Ha ? (r(), d("span", nk, [
        m("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: u
        }, [
          G(v(s.value) + " linked " + v(o.value) + " ", 1),
          A(Qt, { open: l.value }, null, 8, ["open"])
        ], 8, ak)
      ])) : k("", !0),
      l.value ? (r(), d("div", sk, [
        (r(!0), d(q, null, ne(e.links, (b) => (r(), d("button", {
          key: `${b.endpoint.model}:${b.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(b),
          onClick: (M) => h(b)
        }, [
          m("span", lk, v(b.endpoint.model.replaceAll("_", " ")) + " " + v(b.endpoint.id), 1),
          m("span", ik, v(b.endpoint.title), 1),
          m("span", null, v(f(b)), 1),
          c(b) ? (r(), d("span", rk, "Unavailable")) : k("", !0)
        ], 8, ok))), 128))
      ])) : k("", !0),
      A($n, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: y[0] || (y[0] = (b) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, dk = /* @__PURE__ */ z(ck, [["__scopeId", "data-v-843fc3bd"]]), fk = ["title", "aria-label"], hk = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, mk = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, pk = {
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
      (r(), d("svg", hk, [
        o[0] || (o[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (r(), d("path", mk)) : k("", !0)
      ]))
    ], 10, fk));
  }
}, gk = /* @__PURE__ */ z(pk, [["__scopeId", "data-v-6dc92808"]]), vk = {
  report: { at: 70, keep: 46 },
  message: { at: 420, keep: 320 }
}, yk = (e) => e.worker_id != null ? "report" : "message", bk = (e) => vk[yk(e)], kk = "img,pre,table";
function wk(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function $k(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function xk(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(kk)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = wk($k(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function Sk(e, t) {
  let n = null;
  const a = () => e.value && xk(e.value);
  _e(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Ne(() => n == null ? void 0 : n.disconnect()), pe(t, a, { flush: "post" });
}
const Mk = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function _k(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const jn = /* @__PURE__ */ new WeakMap(), Le = "work", et = "sent", Ck = 50, il = 50, rl = () => ({ rows: C([]), total: C(0), next: C(null), loading: C(!1), failure: C(""), version: 0 });
function Ek(e) {
  var M;
  if (jn.has(e)) return jn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (_) => {
    var S;
    return ((S = e.visible) == null ? void 0 : S.value) !== !1 && [..._.views].some((T) => T.visible);
  };
  function o(_, S) {
    const T = _[S], H = ++T.version;
    return T.loading.value = !0, T.failure.value = "", H;
  }
  function l(_, S, T, H, W) {
    const I = _[S];
    if (t.get(_.id) !== _ || I.version !== T) return;
    if (I.loading.value = !1, !W.ok) {
      I.failure.value = W.error;
      return;
    }
    const V = S === Le ? W.value.counterparts ?? [] : W.value.rows ?? [], L = H === 1 ? V : [...I.rows.value, ...V], E = S === Le ? (N) => `${N.endpoint.model}:${N.endpoint.id}` : (N) => N.id ?? N.target_id;
    I.rows.value = [...new Map(L.map((N) => [E(N), N])).values()], I.total.value = W.value.total ?? I.rows.value.length, I.next.value = W.value.next_page ?? null;
  }
  function i(_, S, T, H) {
    const W = _[S];
    W.version === T && (W.failure.value = H.message, W.loading.value = !1);
  }
  async function u(_, S, T) {
    const H = o(_, S), W = S === Le ? "--type about --type edited --group-counterparts" : "--type sent_to";
    try {
      l(_, S, H, T, await e.read(`link list --source message:${_.id} ${W} --page ${T} --page-size ${S === Le ? 10 : 25}`));
    } catch (I) {
      i(_, S, H, I);
    }
  }
  async function c(_) {
    const S = _.map((T) => ({ [Le]: o(T, Le), [et]: o(T, et) }));
    try {
      const T = await e.read(`link receipts --messages ${_.map((H) => H.id).join(",")}`);
      _.forEach((H, W) => {
        const I = T.ok ? T.value.messages[String(H.id)] : null;
        l(H, Le, S[W][Le], 1, T.ok ? { ok: !0, value: I.named } : T), l(H, et, S[W][et], 1, T.ok ? { ok: !0, value: I.sent } : T);
      });
    } catch (T) {
      _.forEach((H, W) => [Le, et].forEach((I) => i(H, I, S[W][I], T)));
    }
  }
  function f() {
    a = null;
    const _ = [...n].map((S) => t.get(S)).filter((S) => S && s(S));
    n.clear(), _.forEach((S) => S.dirty.clear());
    for (let S = 0; S < _.length; S += il) c(_.slice(S, S + il));
  }
  function h(_, S = [Le, et]) {
    for (const T of S) _.dirty.add(T);
    s(_) && (n.add(_.id), a ?? (a = setTimeout(f, 0)));
  }
  function g(_) {
    const S = _.sources ?? (_.source_model && Number.isInteger(_.source_id) ? [{ model: _.source_model, id: _.source_id }] : []), T = _.link_types ?? (_.link_type ? [_.link_type] : []), H = T.length ? [Le, et].filter((I) => I === Le ? T.some((V) => ["about", "edited"].includes(V)) : T.includes("sent_to")) : [Le, et];
    if (!H.length) return;
    const W = S.length ? [...new Set(S.filter((I) => I.model === "message").map((I) => I.id))].map((I) => t.get(I)).filter(Boolean) : [...t.values()].filter(s).slice(0, Ck);
    for (const I of W) h(I, H);
  }
  const y = (M = e.follow) == null ? void 0 : M.call(e, ["link.*"], g), b = {
    attach(_, S) {
      let T = t.get(_);
      return T || (T = { id: _, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Le, et]), work: rl(), sent: rl() }, t.set(_, T)), T.views.add(S), T.dirty.size && h(T, [...T.dirty]), T;
    },
    shown(_) {
      _.dirty.size && h(_, [..._.dirty]);
    },
    detach(_, S) {
      _.views.delete(S), _.views.size || t.delete(_.id), t.size || (clearTimeout(a), y == null || y(), jn.delete(e));
    },
    more(_, S) {
      const T = _ == null ? void 0 : _[S];
      if (T != null && T.next.value && !T.loading.value) return u(_, S, T.next.value);
    }
  };
  return jn.set(e, b), b;
}
function Ak(e, t, n) {
  const a = tt(null);
  let s = null;
  const o = pe(t, (l, i, u) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = Ek(e);
    const c = { visible: typeof IntersectionObserver > "u" }, f = s.attach(l, c);
    a.value = f;
    const h = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((y) => {
      c.visible = y.some((b) => b.isIntersecting), c.visible && s.shown(f);
    }, { rootMargin: "100px" }), g = pe(n, (y) => {
      h == null || h.disconnect(), y && (h == null || h.observe(y));
    }, { immediate: !0, flush: "post" });
    u(() => {
      g(), h == null || h.disconnect(), s.detach(f, c), a.value = null;
    });
  }, { immediate: !0 });
  return ga(o), {
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
    loadMore: () => s == null ? void 0 : s.more(a.value, Le),
    loadSent: () => s == null ? void 0 : s.more(a.value, et)
  };
}
const Ok = ["data-incoming", "data-ref"], Tk = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], Ik = { class: "message-body" }, Bk = ["title"], Rk = ["innerHTML"], Nk = ["innerHTML"], Lk = {
  class: "message-faces",
  "data-message-faces": ""
}, qk = ["title", "data-face", "onClick"], Dk = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, Pk = ["title", "data-reaction", "onClick"], jk = {
  key: 0,
  class: "message-reaction-count"
}, Fk = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Wk = ["href", "title"], Hk = ["src", "alt"], zk = ["href"], Uk = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, Gk = { class: "message-foot" }, Vk = { class: "message-time" }, Kk = {
  class: "message-id",
  "data-message-id": ""
}, Yk = 1500, Qk = "An earlier message", Xk = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(!1), o = C(null), l = x(() => ["user", "comment"].includes(n.message.type)), i = x(() => {
      const [be, se] = (n.message.commented_row || ":").split(":"), Q = vt(be);
      return Q ? { ref: `${Q}:${se}`, label: `${Yt(Q).title.toLowerCase()} ${se}` } : null;
    }), u = x(() => n.message.worker_id ?? null), c = x(() => bk(n.message)), f = x(() => l.value && !n.message.read_at && !n.message.local);
    async function h() {
      var be;
      await ((be = navigator.clipboard) == null ? void 0 : be.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, Yk);
    }
    const g = Di(), y = x(() => g(n.message.text ?? "")), b = x(() => JSON.parse(n.message.flowchart_edges || "[]")), M = C(!1), _ = x(() => $s(n.quote)), S = x(() => g(_.value || Qk));
    function T() {
      const be = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      be ? be.scrollIntoView({ block: "center", behavior: "smooth" }) : je(`messages:${n.message.parent_id}`);
    }
    Sk(o, () => `${n.message.text} ${_.value}`);
    const H = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, W = (be) => `/api/files/message/${n.message.id}/${encodeURIComponent(be)}`, I = x(() => JSON.parse(n.message.captions || "{}")), V = x(() => (n.message.files ?? []).map((be) => ({ name: be, address: W(be), isImage: H.test(be), title: I.value[be] || be }))), L = x(() => Ki(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), E = Me(Be, null), { links: N, total: D, more: w, loading: p, failure: $, sentTo: O, sentMore: B, sentLoading: F, sentFailure: U, loadMore: J, loadSent: oe } = Ak(E, () => l.value && !n.message.local ? n.message.id : null, o), ue = C(!1), ke = x(() => _k(n.message.reactions));
    function Ae(be) {
      ue.value = !1, a("react", n.message, be);
    }
    return (be, se) => e.message.peer || e.message.recipient ? (r(), d("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      A(Jb, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: se[0] || (se[0] = (Q) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Ok)) : (r(), d("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", Ik, [
        m("div", {
          ref_key: "bubble",
          ref: o,
          class: Y(["message-card", "md", { comment: i.value }]),
          onClick: se[5] || (se[5] = (...Q) => R(qt) && R(qt)(...Q))
        }, [
          i.value ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: se[1] || (se[1] = xe((Q) => R(je)(i.value.ref), ["stop"]))
          }, [
            A(le, {
              name: "bubble",
              size: 12
            }),
            m("span", null, "Comment on " + v(i.value.label), 1)
          ], 8, Bk)) : k("", !0),
          e.message.parent_id ? (r(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: xe(T, ["stop"]),
            innerHTML: S.value
          }, null, 8, Rk)) : k("", !0),
          u.value !== null ? (r(), j(hn, {
            key: 2,
            as: "button",
            "agent-id": u.value,
            label: `Worker ${u.value}`,
            class: "message-worker",
            "data-message-worker": "",
            onClick: se[2] || (se[2] = xe((Q) => R(je)(`agents:${u.value}`), ["stop"]))
          }, {
            default: P(() => [
              G("Worker " + v(u.value), 1)
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : k("", !0),
          A(Ii, {
            at: c.value.at,
            keep: c.value.keep,
            name: `message:${e.message.id}`
          }, {
            default: P(() => [
              m("div", {
                "data-message-text": "",
                innerHTML: y.value
              }, null, 8, Nk)
            ]),
            _: 1
          }, 8, ["at", "keep", "name"]),
          b.value.length ? (r(), d(q, { key: 3 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: se[3] || (se[3] = (Q) => M.value = !0)
            }, "Open the flowchart"),
            M.value ? (r(), j(Nb, {
              key: 0,
              title: e.message.text,
              edges: b.value,
              onClose: se[4] || (se[4] = (Q) => M.value = !1)
            }, null, 8, ["title", "edges"])) : k("", !0)
          ], 64)) : k("", !0)
        ], 2),
        m("div", {
          class: Y(["message-tools", { picking: ue.value }]),
          "data-message-tools": ""
        }, [
          ue.value ? (r(), d(q, { key: 0 }, [
            m("div", Lk, [
              (r(!0), d(q, null, ne(R(Mk), (Q) => (r(), d("button", {
                key: Q,
                type: "button",
                class: "message-face",
                title: `React ${Q}`,
                "data-face": Q,
                onClick: (me) => Ae(Q)
              }, v(Q), 9, qk))), 128))
            ]),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: se[6] || (se[6] = (Q) => ue.value = !1)
            }, [
              A(le, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (r(), d(q, { key: 1 }, [
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: se[7] || (se[7] = (Q) => ue.value = !0)
            }, "React"),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: se[8] || (se[8] = (Q) => a("reply", e.message))
            }, "Reply"),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: h
            }, v(s.value ? "Copied" : "Copy"), 1),
            f.value ? (r(), d("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: se[9] || (se[9] = (Q) => a("delete", e.message))
            }, "Delete")) : k("", !0)
          ], 64))
        ], 2)
      ]),
      ke.value.length ? (r(), d("div", Dk, [
        (r(!0), d(q, null, ne(ke.value, (Q) => (r(), d("button", {
          key: Q.emoji,
          type: "button",
          class: Y(["message-reaction", { mine: Q.mine }]),
          title: Q.title,
          "data-reaction": Q.emoji,
          onClick: (me) => a("react", e.message, Q.emoji)
        }, [
          G(v(Q.emoji) + " ", 1),
          Q.count > 1 ? (r(), d("span", jk, v(Q.count), 1)) : k("", !0)
        ], 10, Pk))), 128))
      ])) : k("", !0),
      V.value.length ? (r(), d("div", Fk, [
        (r(!0), d(q, null, ne(V.value, (Q) => (r(), d(q, {
          key: Q.name
        }, [
          Q.isImage ? (r(), d("a", {
            key: 0,
            href: Q.address,
            target: "_blank",
            class: "message-image",
            title: Q.title
          }, [
            m("img", {
              src: Q.address,
              alt: Q.name,
              "data-figure-picture": ""
            }, null, 8, Hk)
          ], 8, Wk)) : (r(), d("a", {
            key: 1,
            href: Q.address,
            target: "_blank",
            class: "message-file"
          }, v(Q.name), 9, zk))
        ], 64))), 128))
      ])) : k("", !0),
      R(O).length ? (r(), d("div", Uk, [
        A(le, {
          name: "send",
          size: 12
        }),
        (r(!0), d(q, null, ne(R(O), (Q) => (r(), j(hn, {
          key: Q.id,
          as: "button",
          "agent-id": Q.id,
          label: `Worker ${Q.id}`,
          class: "message-sent-worker",
          disabled: Q.unavailable || !Q.open_ref,
          "data-sent-worker": Q.id,
          onClick: xe((me) => Q.open_ref && R(je)(Q.open_ref), ["stop"])
        }, {
          default: P(() => [
            G("Also sent to worker " + v(Q.id), 1),
            Q.unavailable ? (r(), d(q, { key: 0 }, [
              G(" (unavailable)")
            ], 64)) : k("", !0)
          ]),
          _: 2
        }, 1032, ["agent-id", "label", "disabled", "data-sent-worker", "onClick"]))), 128))
      ])) : k("", !0),
      A($n, {
        more: R(B),
        loading: R(F),
        failure: R(U),
        label: "More recipients",
        onMore: R(oe)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      m("div", Gk, [
        m("time", Vk, v(L.value), 1),
        Number.isInteger(e.message.id) ? (r(), d(q, { key: 0 }, [
          se[10] || (se[10] = m("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          m("span", Kk, "message " + v(e.message.id), 1)
        ], 64)) : k("", !0),
        l.value ? (r(), j(gk, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : k("", !0)
      ]),
      R(N).length || R($) ? (r(), j(dk, {
        key: 3,
        links: R(N),
        total: R(D),
        more: R(w),
        loading: R(p),
        failure: R($),
        onMore: R(J)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : k("", !0)
    ], 8, Tk));
  }
}, oM = /* @__PURE__ */ z(Xk, [["__scopeId", "data-v-95d3070e"]]), ia = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], za = 200, fr = (e) => {
  var t;
  return ((t = ia.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? ia[0].key;
}, lM = (e) => {
  var t;
  return ((t = ia.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Jk = ["aria-label"], Zk = 300, ul = 400, ew = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: za } },
  setup(e) {
    const t = e, n = x(() => fr(t.value)), a = x(() => n.value < za ? [1, 0.25, 0.25] : n.value === za ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (r(), d("svg", {
      class: Y(["ico", "prio", { hot: n.value >= ul, high: n.value >= Zk && n.value < ul }]),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.6",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-label": `priority ${e.value}`
    }, [
      m("path", {
        d: "M4.5 13l3.5-2.25L11.5 13",
        style: ve({ opacity: a.value[0] })
      }, null, 4),
      m("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: ve({ opacity: a.value[1] })
      }, null, 4),
      m("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: ve({ opacity: a.value[2] })
      }, null, 4)
    ], 10, Jk));
  }
}, iM = /* @__PURE__ */ z(ew, [["__scopeId", "data-v-b10e610f"]]), hr = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], rM = (e) => {
  const t = hr[e - 1];
  return t.slice(0, 1).toUpperCase() + t.slice(1);
}, tw = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, cl = (e) => tw[e.card.state] || "idle", nw = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), dl = { working: 0, waiting: 1, idle: 2, stopped: 3 }, fl = (e, t) => dl[cl(e)] - dl[cl(t)], hl = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, uM = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => fl(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || nw(a, s)) : [...e].sort((a, s) => fl(a, s) || (hl[t] || hl.state)(a, s)), aw = { class: "list-row" }, sw = {
  key: 0,
  class: "list-row-type"
}, ow = { class: "list-row-main" }, lw = {
  key: 0,
  class: "list-row-title"
}, iw = { class: "list-row-body" }, rw = {
  key: 1,
  class: "list-row-end"
}, uw = {
  key: 1,
  class: "list-row-text"
}, cw = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", aw, [
      e.type ? (r(), d("span", sw, v(e.type), 1)) : k("", !0),
      m("div", ow, [
        e.title ? (r(), d("span", lw, v(e.title), 1)) : k("", !0),
        m("div", iw, [
          re(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (r(), d("div", rw, [
          re(t.$slots, "end", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      e.text ? (r(), d("span", uw, v(e.text), 1)) : k("", !0)
    ]));
  }
}, cM = /* @__PURE__ */ z(cw, [["__scopeId", "data-v-dfc8c3a7"]]), dM = {
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
    return (l, i) => (r(), j(Gs, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: i[0] || (i[0] = (u) => a("pick", u.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, dw = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: Y(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      re(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, Cs = /* @__PURE__ */ z(dw, [["__scopeId", "data-v-978e0921"]]), fw = ["aria-label"], hw = { class: "head" }, mw = { class: "names" }, pw = { class: "body" }, gw = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = wi(a, n), i = $i(s);
    return (u, c) => (r(), j(wn, { to: "body" }, [
      A(Vt, {
        name: "side",
        appear: "",
        onAfterLeave: R(l)
      }, {
        default: P(() => [
          R(s) ? (r(), d("div", {
            key: 0,
            class: Y(["veil", { over: e.over, under: e.depth }]),
            style: ve({ "--depth": e.depth, zIndex: R(i) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = xe((...f) => R(o) && R(o)(...f), ["self"]))
          }, [
            m("aside", {
              class: Y(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (r(), d(q, { key: 0 }, [
                m("header", hw, [
                  m("div", mw, [
                    m("h2", null, v(e.title), 1),
                    e.abstract ? (r(), j(it, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : k("", !0),
                    re(u.$slots, "meta", {}, void 0, !0)
                  ]),
                  re(u.$slots, "actions", {}, void 0, !0),
                  A(ya, {
                    title: e.closeLabel,
                    onClick: R(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                u.$slots.foot && !e.footBelow ? (r(), j(Cs, { key: 0 }, {
                  default: P(() => [
                    re(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0),
                m("div", pw, [
                  re(u.$slots, "default", {}, void 0, !0)
                ]),
                u.$slots.foot && e.footBelow ? (r(), j(Cs, {
                  key: 1,
                  class: "below"
                }, {
                  default: P(() => [
                    re(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0)
              ], 64)) : re(u.$slots, "default", {}, void 0, !0, 1)
            ], 10, fw)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, fM = /* @__PURE__ */ z(gw, [["__scopeId", "data-v-d0a677ef"]]), vw = {
  key: 1,
  class: "text-field-label"
}, yw = {
  key: 2,
  class: "text-field-end"
}, bw = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Ft({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = un(e, "modelValue"), a = pa(), s = "onUpdate:modelValue" in (((f = mu()) == null ? void 0 : f.vnode.props) || {}), o = x(() => s ? n.value : a.value), l = (h) => s && (n.value = h.target.value), i = x(
      () => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "class" && h !== "style" && h !== "value"))
    ), u = x(() => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "value"))), c = C(null);
    return t({ focus: () => c.value && c.value.focus() }), (h, g) => e.label || e.icon || h.$slots.end ? (r(), d("label", {
      key: 0,
      class: Y(["text-field", { large: e.large, ended: h.$slots.end }, R(a).class]),
      style: ve(R(a).style)
    }, [
      e.icon ? (r(), j(le, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : k("", !0),
      e.label ? (r(), d("span", vw, v(e.label), 1)) : k("", !0),
      Ve(m("input", De({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [R(ys), o.value]
      ]),
      h.$slots.end ? (r(), d("span", yw, [
        re(h.$slots, "end", {}, void 0, !0)
      ])) : k("", !0)
    ], 6)) : Ve((r(), d("input", De({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, u.value, { onInput: l }), null, 16)), [
      [R(ys), o.value]
    ]);
  }
}), hM = /* @__PURE__ */ z(bw, [["__scopeId", "data-v-d9c38ca8"]]), kw = { class: "title" }, ww = { class: "state" }, $w = {
  __name: "StateRows",
  props: {
    term: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = fs(t.line, t.events);
    return (o, l) => (r(), j(tb, {
      rows: R(n),
      failure: R(a),
      loaded: R(s),
      empty: e.empty
    }, {
      default: P(({ row: i }) => [
        m("span", kw, v(i.title), 1),
        m("span", ww, v(R(dn)(e.term, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, mM = /* @__PURE__ */ z($w, [["__scopeId", "data-v-6be0c59e"]]);
function xw(e = 1e3, t = null) {
  const n = C(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? pe(t, s, { immediate: !0 }) : s(!0), Ne(() => clearInterval(a)), n;
}
const Ua = C(Date.now() / 1e3);
let ml = 0, Fn = 0;
function co() {
  return Fn || (Ua.value = Date.now() / 1e3, ml = setInterval(() => Ua.value = Date.now() / 1e3, 1e3)), Fn += 1, Gl() && ga(() => {
    Fn -= 1, Fn || clearInterval(ml);
  }), Ua;
}
const Sw = 200, Mw = ur + Yn + cr + Sw, _w = 300, Wn = /* @__PURE__ */ new WeakMap();
function Cw(e, t) {
  const n = Wn.get(e) ?? [];
  Wn.set(e, [...n, t]), !n.length && setTimeout(() => {
    const a = Wn.get(e);
    Wn.delete(e), e.run(["developer", "record-mark-motion", JSON.stringify(a)]);
  }, _w);
}
function Jt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function Ew(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: Jt(e),
    top: Jt(e.querySelector(".top")),
    title: Jt(e.querySelector(".title")),
    contents: Jt(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var l, i, u, c;
      return `${((i = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : i.className) || ((c = (u = o.effect) == null ? void 0 : u.target) == null ? void 0 : c.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: i, boxSizing: u, transform: c, display: f }) => ({ width: o, minWidth: l, maxWidth: i, boxSizing: u, transform: c, display: f }))(getComputedStyle(e)),
    parent: Jt(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function Aw(e, t, n, a) {
  pe(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function u() {
      if (a.markMotion.value) {
        if (i.push(Ew(o, l, n.value)), performance.now() - l < Mw) return void requestAnimationFrame(u);
        Cw(a, { key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i });
      }
    }
    u();
  }, { flush: "sync" });
}
const Ow = ["title", "data-figure-mark", "data-folded", "data-open"], Tw = {
  key: 2,
  class: "worker"
}, Iw = { class: "head" }, Bw = { key: 0 }, Rw = {
  key: 3,
  class: "status"
}, Nw = {
  key: 0,
  class: "figure"
}, Lw = {
  key: 1,
  class: "ran-for"
}, qw = { key: 2 }, Dw = {
  key: 3,
  class: "news"
}, Pw = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, jw = {
  key: 6,
  class: "settled"
}, Fw = {
  key: 1,
  class: "bar"
}, Ww = {
  key: 3,
  class: "detail body"
}, Hw = {
  key: 0,
  class: "body-label"
}, zw = ["title"], Uw = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = pa(), a = ["onClick", "onAct"], s = x(() => Object.fromEntries(Object.entries(n).filter(([ue]) => !a.includes(ue)))), o = C(!1), l = x(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = x(() => t.open !== void 0), u = x(() => i.value || l.value), c = x(() => i.value ? t.open : o.value), f = x(() => i.value ? !t.open : l.value && !o.value), h = x(() => !!(t.mark.action && n.onAct)), g = x(() => u.value || h.value || !!n.onClick), y = C(null), b = C(null), { folded: M, phase: _ } = dr(y, () => f.value);
    Aw(y, f, _, Me(Be, null));
    function S(ue) {
      var ke, Ae;
      if (!(ue.target !== y.value && !b.value.contains(ue.target))) {
        if (i.value) return (ke = n.onClick) == null ? void 0 : ke.call(n, ue);
        if (l.value) return void (o.value = !o.value);
        (Ae = n.onAct || n.onClick) == null || Ae(ue);
      }
    }
    const T = (ue) => n.onAct(ue), H = ["failed", "unfinished"], W = x(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? H.includes(t.mark.state) ? "danger" : "good" : ""), I = x(() => t.mark.color ? t.mark.color : W.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : W.value ? `var(--tone-${W.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), V = x(() => I.value || "var(--tone-work)"), L = x(() => !t.mark.ending && !t.mark.ended && W.value !== "stopped"), E = co(), N = x(
      () => t.mark.began_at && L.value && !t.mark.figure && !t.mark.counting ? Yi(E.value - t.mark.began_at) : ""
    ), D = x(() => {
      const { started: ue, ended: ke } = t.mark;
      return ue ? ke ? `ran ${nl(ke - ue, !0)}` : nl(E.value - ue, !0) : N.value;
    }), w = ["bad", "danger", "warn"], p = x(() => w.includes(W.value) || t.mark.asks ? "attention" : L.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), $ = ["bad", "danger"], O = x(() => $.includes(W.value)), B = x(() => p.value === "process" ? "running" : O.value ? "cross" : W.value === "stopped" ? "stopped" : W.value === "good" ? "tick" : ""), F = x(
      () => !!(t.mark.figure || D.value || t.mark.docked || t.mark.stopping || B.value || t.mark.settled || t.mark.news)
    ), U = x(() => t.mark.markIcon ? { component: Ot, props: { class: "ico", name: t.mark.markIcon } } : { component: le, props: { name: t.mark.icon || "dot" } }), J = x(() => [t.mark.title, t.mark.time ? Ki(t.mark.time) : ""].filter(Boolean).join(" · ")), oe = x(() => ({
      ...I.value ? { "--mark": I.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ue, ke) => (r(), d("div", De(s.value, {
      ref_key: "root",
      ref: y,
      class: [
        "mark",
        `w-${p.value}`,
        R(_),
        {
          open: c.value,
          folding: i.value && f.value,
          live: g.value,
          failed: O.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: I.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: oe.value,
      title: J.value,
      "data-figure-mark": e.mark.key,
      "data-folded": R(M) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: S
    }), [
      (r(), j(Ye(g.value ? "button" : "span"), {
        ref_key: "top",
        ref: b,
        class: "top",
        type: g.value ? "button" : void 0,
        "aria-expanded": u.value ? String(!!c.value) : void 0
      }, {
        default: P(() => [
          e.mark.agentId ? (r(), j(hn, {
            key: 0,
            "agent-id": e.mark.agentId,
            label: e.mark.label,
            class: "agent-icon",
            "data-mark-agent": ""
          }, {
            default: P(() => [
              (r(), j(Ye(U.value.component), ds(Vl(U.value.props)), null, 16))
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : (r(), j(Ye(U.value.component), ds(De({ key: 1 }, U.value.props)), null, 16)),
          e.mark.worker ? (r(), d("span", Tw, v(e.mark.worker), 1)) : k("", !0),
          m("span", Iw, [
            A(it, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (r(), d("strong", Bw, v(e.mark.name), 1)) : k("", !0),
            u.value ? (r(), j(Qt, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : k("", !0)
          ]),
          F.value ? (r(), d("span", Rw, [
            e.mark.figure ? (r(), d("span", Nw, v(e.mark.figure), 1)) : k("", !0),
            D.value ? (r(), d("span", Lw, v(D.value), 1)) : k("", !0),
            e.mark.stopping ? (r(), d("span", qw, "Stopping")) : k("", !0),
            e.mark.news ? (r(), d("span", Dw, v(e.mark.news), 1)) : k("", !0),
            B.value === "running" ? (r(), d("span", Pw)) : B.value ? (r(), j(Ot, {
              key: 5,
              class: Y(["sign", B.value]),
              name: B.value
            }, null, 8, ["class", "name"])) : k("", !0),
            e.mark.settled ? (r(), d("span", jw, v(e.mark.settled), 1)) : k("", !0)
          ])) : k("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      h.value ? (r(), j(rr, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: xe(T, ["stop"])
      }, null, 8, ["label", "open"])) : k("", !0),
      (e.mark.figure || e.mark.counting) && L.value ? (r(), d("span", Fw, [
        m("span", {
          class: "progress",
          style: ve({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: V.value })
        }, null, 4)
      ])) : k("", !0),
      e.mark.detail && !R(M) ? (r(), j(it, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      e.mark.body && !R(M) ? (r(), d("div", Ww, [
        e.mark.bodyLabel ? (r(), d("p", Hw, v(e.mark.bodyLabel), 1)) : k("", !0),
        A(it, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : k("", !0),
      e.mark.command && !R(M) ? (r(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, v(e.mark.command), 9, zw)) : k("", !0),
      e.mark.card ? (r(), j(it, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      re(ue.$slots, "default", {
        shown: !R(M)
      }, void 0, !0)
    ], 16, Ow));
  }
}), mr = /* @__PURE__ */ z(Uw, [["__scopeId", "data-v-6e839007"]]), Gw = 8, Vw = 40, Kw = [];
class fo {
  constructor(t, n, { top: a = Gw, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && Kw.push(this);
  }
  // a feed over a window's rows, as `useRows` and a window's props give them: refs of the rows, whether they loaded and whether more follow
  static ofRows(t, n, a) {
    return new fo(t, {
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
    n > Vw && this.breach(`opened ${n}px above the bottom`), this.source.count() > this.source.pageSize() && this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
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
const Yw = 60, Qw = 300, pr = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function gr(e, t) {
  const n = C([]), a = C(0);
  let s = -1, o = 0;
  async function l() {
    const h = await e(["output", "page", String(t())]);
    return h.ok && (n.value = h.value.lines, a.value = h.value.first_byte, s = h.value.last_byte, o = h.value.cut_bytes), h;
  }
  async function i() {
    if (s < 0) return l();
    const h = await e(["output", "page", String(t()), "--after", String(s)]);
    return h.ok ? h.value.cut_bytes !== o || h.value.total < s ? l() : (h.value.lines.length && (n.value = [...n.value, ...h.value.lines]), s = h.value.last_byte, h) : h;
  }
  async function u() {
    const h = await e(["output", "page", String(t()), "--before", String(a.value)]);
    return h.ok ? (n.value = [...h.value.lines, ...n.value], a.value = h.value.first_byte, !0) : !1;
  }
  const c = new fo("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => Qw, more: () => a.value > 0, previous: u }, { top: Yw });
  return { lines: n, newest: l, follow: i, loadEarlier: (h) => c.reachTop(h), feed: c };
}
const Xw = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function vr(e) {
  var n;
  const t = Xw[e] || ((n = Yt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open";
}
const Jw = (e) => vr(String(e).split(":")[0]), Zw = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), e2 = "agents", t2 = { passed: "good", failed: "danger", warned: "warn", running: "" }, n2 = { good: "good", warn: "warn", danger: "danger" }, pl = {
  "open row": (e) => je(`${e.target_model}:${e.target_id}`),
  "open page": (e) => ph(e.target_model, e.target_id || 0)
}, a2 = { "open row": (e) => Jw(e.target_model), "open page": () => vr("pages") };
function s2(e, t) {
  const n = t || {}, a = pl[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? t2[e.outcome] || "" : n2[e.variant] || "",
    label: e.text,
    // a mark about an agent shows the agent's tooltip on its icon
    agentId: e.target_model === e2 ? e.target_id : 0,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? a2[a](e) : "",
    handlers: a ? { onAct: () => pl[a](e) } : {}
  };
}
const o2 = 24, l2 = 1e3, gl = 2e3, i2 = 0.25, r2 = 5e3;
function u2(e, t = o2, n = () => !0) {
  const a = C(!1), s = C(0), o = C(!1);
  let l = 0, i = 0, u = 0;
  const c = () => e && "value" in e ? e.value : e, f = () => {
    const W = c();
    return W ? W.scrollHeight - W.scrollTop - W.clientHeight : 0;
  }, h = () => !c() || f() <= t;
  function g(W) {
    if (clearTimeout(l), !W) {
      o.value = !1, u = Date.now();
      return;
    }
    const I = Date.now() - u < gl ? gl : l2;
    l = setTimeout(() => o.value = a.value, I);
  }
  function y() {
    clearTimeout(i), a.value = !1, s.value = 0, g(!1);
  }
  function b(W = !1) {
    const I = c();
    I && W && I.scrollTo ? I.scrollTo({ top: I.scrollHeight, behavior: "smooth" }) : I && (I.scrollTop = I.scrollHeight), y();
  }
  function M() {
    S(), !a.value && (a.value = !0, g(!0));
  }
  const _ = () => !!c() && f() <= c().clientHeight * i2;
  function S() {
    clearTimeout(i), _() && (i = setTimeout(() => a.value && _() && n() && b(!0), r2));
  }
  function T() {
    h() ? y() : M();
  }
  function H(W = 1, I = !1) {
    a.value ? s.value += Math.max(0, W) : b(I);
  }
  return Gl() && ga(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: f, atBottom: h, follow: y, toBottom: b, left: M, scrolled: T, arrived: H };
}
const c2 = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, d2 = (e) => String(e ?? "").replace(c2, ""), f2 = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(null), { away: o, scrolled: l, arrived: i, toBottom: u } = u2(s);
    pe(
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
    return (f, h) => (r(), d("pre", {
      ref_key: "box",
      ref: s,
      class: "output-lines",
      onScroll: c
    }, [
      G(v(R(d2)(e.lines.join(`
`)) || e.empty), 1),
      R(o) ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: h[0] || (h[0] = (g) => R(u)(!0))
      }, "Follow")) : k("", !0)
    ], 544));
  }
}, h2 = /* @__PURE__ */ z(f2, [["__scopeId", "data-v-89621acd"]]), m2 = "*.*", p2 = {
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
    const t = e, n = Me(Be, null), a = new oi();
    pe(
      () => a.patterns,
      (u, c, f) => {
        var g;
        const h = (g = n == null ? void 0 : n.subscriptions) == null ? void 0 : g.follow(`body of ${t.declaration.type}`, u, (y) => a.dispatch(y));
        f(() => h == null ? void 0 : h());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = x(() => !!(t.declaration.shipped || t.declaration.trusted)), i = x(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the user trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [m2] : t.declaration.events ?? [],
      options: []
    }));
    return (u, c) => l.value ? (r(), j(or, {
      key: 0,
      entry: i.value,
      subscriptions: R(a),
      environment: R(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (r(), j(sr, {
      key: 1,
      entry: i.value,
      subscriptions: R(a),
      environment: R(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, g2 = { class: "mark-more-inner" }, v2 = {
  class: "mark-lines",
  "data-mark-reason": ""
}, y2 = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, b2 = {
  key: 3,
  class: "mark-lines"
}, k2 = "process", vl = "task", w2 = {
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
    const t = e, n = st(), a = x(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = x(() => Zw.has(t.mark.variant) && t.mark.detail || ""), o = x(() => t.mark.target_model === vl ? t.mark.target_id : 0), l = gr(
      pr(n),
      () => t.mark.target_id
    ), i = l.lines, u = C(!1), c = C(""), f = x(() => !t.declaration.body_url && t.mark.target_model === k2 && !!t.mark.target_id);
    async function h(y = l.follow) {
      const b = await y();
      u.value = !0, c.value = b.ok ? "" : b.error;
    }
    const g = x(() => t.shown && f.value);
    return pe(g, (y) => y && h()), Ws(() => g.value && h(), () => g.value && !t.mark.ended_at), pe(
      () => t.mark.ended_at,
      (y) => y && g.value && h(l.newest)
    ), (y, b) => (r(), d("div", {
      class: Y(["mark-more", { open: e.shown }]),
      onClick: b[1] || (b[1] = xe(() => {
      }, ["stop"]))
    }, [
      m("div", g2, [
        e.declaration.body_url ? (r(), j(p2, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded,
          collapsed: e.collapsed
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded", "collapsed"])) : (r(), d(q, { key: 1 }, [
          s.value ? (r(), d(q, { key: 0 }, [
            b[2] || (b[2] = m("p", { class: "mark-label" }, "Why it stopped", -1)),
            m("p", v2, v(s.value), 1)
          ], 64)) : k("", !0),
          f.value && c.value ? (r(), d("p", y2, v(c.value), 1)) : f.value && u.value ? (r(), d(q, { key: 2 }, [
            b[3] || (b[3] = m("p", { class: "mark-label" }, "Output", -1)),
            A(h2, {
              class: "mark-terminal",
              lines: R(i),
              feed: R(l).feed,
              onOlder: R(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (r(), d("p", b2, v(a.value.join(`
`)), 1)) : k("", !0),
          o.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: b[0] || (b[0] = xe((M) => R(je)(`${vl}:${o.value}`), ["stop"]))
          }, " Open task " + v(o.value) + " and its proofs ", 1)) : k("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Es = /* @__PURE__ */ z(w2, [["__scopeId", "data-v-df71b15a"]]), $2 = ["title", "aria-label", "onClick"], x2 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, S2 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = x(() => Ff(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = C(""), s = Me(Be);
    async function o(l) {
      const i = await xn(l, { id: t.mark.target_id }, s.environment);
      a.value = i.ok ? "" : i.error;
    }
    return (l, i) => (r(), d(q, null, [
      (r(!0), d(q, null, ne(n.value, (u) => (r(), d("button", {
        key: u.runs,
        type: "button",
        class: "mark-button",
        title: u.label,
        "aria-label": u.label,
        onClick: xe((c) => o(u), ["stop"])
      }, [
        A(Ot, {
          name: u.icon
        }, null, 8, ["name"])
      ], 8, $2))), 128)),
      a.value ? (r(), d("span", x2, v(a.value), 1)) : k("", !0)
    ], 64));
  }
}, M2 = /* @__PURE__ */ z(S2, [["__scopeId", "data-v-7a62c88e"]]);
function yr(e, t) {
  const n = tt(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Ee.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const br = yr("/api/marks", "marks"), pM = br.fetchAll, _2 = br.find, C2 = ["data-ref"], E2 = ["data-ref"], A2 = { class: "mark-row" }, O2 = "dock add", T2 = "questions.answer", I2 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = x(() => _2(a.mark.type)), o = x(() => s2(a.mark, s.value)), l = x(() => {
      var g;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (g = s.value) != null && g.body_url);
    }), i = x(() => l.value || !!o.value.handlers.onAct), u = x(() => a.mark.type === T2), c = C(!1);
    function f() {
      c.value = !c.value;
    }
    const h = x(() => {
      var g;
      return (((g = s.value) == null ? void 0 : g.buttons) || []).filter((y) => {
        var b;
        return !a.docked || !((b = y.runs) != null && b.startsWith(O2));
      }).map((y) => ({ ...y, module: s.value.module }));
    });
    return (g, y) => {
      var b, M;
      return (b = s.value) != null && b.card ? (r(), d("div", {
        key: 0,
        class: Y(["thread-turn", "card", "whole-card", { "user-side": R(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        A(Es, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, C2)) : (r(), d("div", {
        key: 1,
        class: Y(["thread-turn", "card", { "full-width": (M = s.value) == null ? void 0 : M.full_width, docked: e.docked, "user-side": R(n).has(e.mark.variant), "answer-bubble": u.value }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", A2, [
          A(mr, {
            mark: o.value,
            open: i.value ? c.value : void 0,
            onAct: o.value.handlers.onAct,
            onClick: f
          }, Ul({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: P(({ shown: _ }) => [
                A(Es, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: _
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["mark", "open", "onAct"]),
          A(M2, {
            buttons: h.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, E2));
    };
  }
}, B2 = /* @__PURE__ */ z(I2, [["__scopeId", "data-v-424ddb61"]]), R2 = ["data-ref"], N2 = ["inert"], L2 = { class: "group-fold" }, q2 = { class: "thread-group" }, D2 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = C(!1), a = C(!1), s = C(!1), o = C(null);
    pe(n, async (i) => {
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
      A(mr, {
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
        m("div", L2, [
          m("div", q2, [
            (r(!0), d(q, null, ne(e.group.marks, (c) => (r(), j(B2, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, N2)) : k("", !0)
    ], 8, R2));
  }
}, gM = /* @__PURE__ */ z(D2, [["__scopeId", "data-v-45b58b9b"]]);
function P2(e) {
  const t = C(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return _e(() => n.observe(e.value)), at(() => n.disconnect()), t;
}
const j2 = { class: "chat-dock-fold" }, F2 = ["aria-label"], W2 = { class: "chat-dock-head" }, H2 = { class: "chat-dock-inner" }, z2 = { class: "chat-dock-foot" }, kr = 700, U2 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = C(null), a = C(null), s = P2(a), o = C(!1);
    let l = 0;
    return _e(() => l = setTimeout(() => o.value = !0, kr)), at(() => clearTimeout(l)), t({ card: n }), (i, u) => (r(), d("div", {
      class: Y(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      m("div", j2, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: Y(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          re(i.$slots, "edge", {}, void 0, !0),
          m("header", W2, [
            re(i.$slots, "head", {}, void 0, !0)
          ]),
          m("div", {
            class: Y(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            m("div", H2, [
              m("div", {
                class: Y(["chat-dock-grow", { settled: o.value }]),
                style: ve(R(s) === null ? null : { height: `${R(s)}px` })
              }, [
                m("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  re(i.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          re(i.$slots, "still", {}, void 0, !0),
          m("footer", z2, [
            re(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, F2)
      ])
    ], 2));
  }
}, G2 = /* @__PURE__ */ z(U2, [["__scopeId", "data-v-cc05fdac"]]), V2 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Ga = 5, K2 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Ga, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${Ga}s`, animationDelay: `${(n - Ga).toFixed(2)}s` };
    return (s, o) => (r(), d("span", V2, [
      m("i", { style: a })
    ]));
  }
}, Y2 = /* @__PURE__ */ z(K2, [["__scopeId", "data-v-2a7bc150"]]), Q2 = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), As = (e) => e.charAt(0).toUpperCase() + e.slice(1), X2 = (e) => As(e.replace(/_at$/, "").replaceAll("_", " ")), J2 = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, Z2 = (e, t, n) => [As(`${e} ${n}`), (t == null ? void 0 : t.state) && As(t.state)].filter(Boolean).join(" · "), wr = (e) => Ht(e).text, e$ = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? wr(t) : (e == null ? void 0 : e.name) ?? "", t$ = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? wr(t) : "", n$ = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !Q2.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: X2(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], a$ = { reviewing: "Under review" }, s$ = (e, t) => e || a$[t == null ? void 0 : t.state] || "", $r = yr("/api/docks", "docks"), vM = $r.fetchAll, Lt = $r.find, o$ = 6, Va = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, ho = (e) => Date.parse(e.leaves_at) / 1e3, en = (e) => !!(e.leaves_at && !e.kept), l$ = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!en(e) || t < ho(e) || n.has(e.id)), i$ = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => l$(a, t, n)).sort((a, s) => a.id - s.id);
function r$(e, t, n = o$) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(ho(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const u$ = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Os = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), c$ = (e, t) => !(t != null && t.needs_user) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), d$ = (e) => ({ ...e.kept ? Os("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : Os("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), f$ = ["keep", "unkeep", "open", "undock"], h$ = (e) => ({ ...e, iconOnly: f$.includes(e.action) });
function m$(e, t) {
  var n;
  return [
    ...c$(e, t) ? [d$(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Yt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    Os("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(h$);
}
function xr(e, t) {
  const n = m$(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: u$(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const p$ = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || xr(e, t).title, g$ = { class: "dock-text" }, v$ = ["title"], y$ = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, b$ = {
  class: "dock-facts",
  "data-dock-facts": ""
}, k$ = {
  key: 1,
  "data-dock-row": ""
}, w$ = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = x(() => Lt(a.item.type)), o = co(), l = x(() => Mn(a.item.created_at, o.value * 1e3)), i = C(null), u = C(null), c = C(null), f = C(null), h = x(() => xr(a.item, s.value)), g = st(), y = x(() => `dock.${a.item.id}`), b = x(() => g.props[y.value].data.value), M = x(() => p$(a.item, s.value, b.value)), _ = x(() => oa(a.item.target_model ?? "")), S = x(() => {
      var p;
      return ((p = s.value) == null ? void 0 : p.word) ?? "";
    }), T = x(() => ({ ...b.value, id: a.item.target_id, term: _.value })), H = () => {
      var p, $;
      return (($ = (p = s.value) == null ? void 0 : p.reads) == null ? void 0 : $.length) && g.reload(y.value);
    };
    qc(Ps, { data: b, reload: H, readOutput: pr(g) }), pe(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (p, $, O) => {
        var F;
        H();
        const B = (F = g.followUndeclared) == null ? void 0 : F.call(g, [`${_.value.replaceAll("-", "_")}.*`], (U) => {
          (!U.row_id || U.row_id === a.item.target_id) && H();
        });
        O(() => B == null ? void 0 : B());
      },
      { immediate: !0 }
    );
    const W = C(/* @__PURE__ */ new Set()), I = C("");
    async function V(p) {
      if (p.action === "undock") return n("undock", p);
      if (p.action === "open") return je(`${a.item.target_model}:${a.item.target_id}`);
      p.action === "declared" && (W.value = /* @__PURE__ */ new Set([...W.value, p.label])), I.value = "";
      const O = await xn(p, { id: a.item.target_id }, g.environment);
      (O == null ? void 0 : O.ok) === !1 && (W.value = new Set([...W.value].filter((B) => B !== p.label)), I.value = `Could not ${p.label.toLowerCase()}: ${O.error}`);
    }
    const L = x(() => h.value.actions.filter((p) => !W.value.has(p.label))), E = x(() => {
      var p;
      return s$((p = s.value) == null ? void 0 : p.badge, T.value);
    }), N = x(() => h.value.controls), D = x(() => {
      var p;
      return !((p = s.value) != null && p.folds && a.folded);
    }), w = x(() => {
      var p;
      return !!((p = s.value) != null && p.draws_head) && !a.collapsed;
    });
    return (p, $) => {
      var O, B, F, U;
      return r(), j(G2, {
        label: h.value.title + ((O = s.value) != null && O.needs_user ? ", waiting for you" : ""),
        type: (B = s.value) != null && B.needs_user ? "waiting" : "",
        folded: !!((F = s.value) != null && F.folds) && e.folded,
        body: !!((U = s.value) != null && U.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: $[4] || ($[4] = (J) => e.collapsed && n("open"))
      }, {
        edge: P(() => [
          e.leaving && !e.item.kept ? (r(), j(Y2, {
            key: 0,
            "ends-at": R(ho)(e.item)
          }, null, 8, ["ends-at"])) : k("", !0)
        ]),
        head: P(() => {
          var J;
          return [
            w.value ? (r(), d("span", {
              key: 0,
              ref_key: "head",
              ref: i,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (r(), d(q, { key: 1 }, [
              A(le, {
                name: h.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              m("span", g$, [
                m("span", {
                  class: Y(["dock-title", { strip: e.collapsed }]),
                  title: M.value
                }, v(M.value), 11, v$)
              ])
            ], 64)),
            m("span", {
              ref_key: "time",
              ref: f,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (J = s.value) != null && J.leaves_after_seconds ? k("", !0) : (r(), d(q, { key: 0 }, [
                G(v(l.value), 1)
              ], 64))
            ], 512),
            N.value.length ? (r(), d("span", {
              key: 2,
              class: "dock-controls",
              onClick: $[0] || ($[0] = xe(() => {
              }, ["stop"]))
            }, [
              (r(!0), d(q, null, ne(N.value, (oe) => {
                var ue, ke;
                return r(), d(q, {
                  key: oe.action + oe.runs
                }, [
                  !W.value.has(oe.label) && (!((ue = oe.variants) != null && ue.length) || !((ke = T.value) != null && ke.state) || oe.variants.includes(T.value.state)) ? (r(), j(ge, {
                    key: 0,
                    variant: "icon",
                    class: Y({ kept: oe.pressed }),
                    "aria-pressed": oe.pressed,
                    "aria-label": oe.label,
                    title: oe.label,
                    "data-dock-action": oe.action,
                    onClick: (Ae) => V(oe)
                  }, {
                    default: P(() => [
                      A(le, {
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
        still: P(() => [
          I.value || e.refusal ? (r(), d("p", y$, v(I.value || e.refusal), 1)) : k("", !0)
        ]),
        foot: P(() => {
          var J;
          return [
            m("span", b$, [
              E.value ? (r(), d("span", {
                key: 0,
                class: Y(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, v(E.value), 3)) : k("", !0),
              S.value ? (r(), d("span", k$, v(S.value) + " " + v(e.item.target_id), 1)) : k("", !0),
              m("span", {
                ref_key: "foot",
                ref: u,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (J = s.value) != null && J.folds ? (r(), j(ge, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: $[1] || ($[1] = (oe) => n("fold"))
            }, {
              default: P(() => [
                G(v(s.value.folds) + " ", 1),
                A(Qt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : k("", !0),
            m("span", {
              class: "dock-acts",
              onClick: $[3] || ($[3] = xe(() => {
              }, ["stop"]))
            }, [
              m("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              D.value ? (r(), d(q, { key: 0 }, [
                A(eo, {
                  name: `dock.${e.item.type}`,
                  row: T.value,
                  environment: R(g).environment,
                  "read-only": R(g).readOnly,
                  "object-name": R(oa)(e.item.target_model),
                  "external-failure": "",
                  onFailure: $[2] || ($[2] = (oe) => I.value = oe),
                  onDone: p.loadRow
                }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
                (r(!0), d(q, null, ne(L.value, (oe) => (r(), j(ge, {
                  key: oe.action + oe.runs,
                  small: "",
                  variant: oe.primary ? "primary" : "ghost",
                  bordered: !oe.primary,
                  "data-dock-action": oe.action,
                  onClick: (ue) => V(oe)
                }, {
                  default: P(() => [
                    G(v(oe.label), 1)
                  ]),
                  _: 2
                }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128))
              ], 64)) : k("", !0)
            ])
          ];
        }),
        default: P(() => {
          var J;
          return [
            (J = s.value) != null && J.body_url ? (r(), j(Es, {
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
}, yl = /* @__PURE__ */ z(w$, [["__scopeId", "data-v-4d692a2f"]]), $$ = 24, x$ = 8, yM = 420;
function bM({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= $$ ? !0 : e < t && s > x$ ? !1 : null;
}
const S$ = (e, t) => e === void 0 ? t : e, M$ = { me: 1, people: [] }, ra = Gt({
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
  people: M$,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: na("journal.activity", !0),
  wide: !1,
  sideMini: na("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Ai("journal.activity", () => ra.activity);
Ai("journal.side.mini", () => ra.sideMini);
const Sr = "journal.viewer.";
function _$(e, t, n) {
  try {
    const a = n.getItem(Sr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function C$(e, t, n) {
  try {
    n.setItem(Sr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function bl(e, t, n = window.localStorage) {
  const a = C(_$(e, t, n));
  return pe(a, (s) => C$(e, s, n), { deep: !0 }), a;
}
const E$ = {
  key: "dock-all",
  class: "dock-all"
}, A$ = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var w, p;
    const t = e, n = xw(500), a = C(/* @__PURE__ */ new Set()), s = Me(Be), o = C(/* @__PURE__ */ new Set()), l = C({});
    async function i($, O) {
      l.value = { ...l.value, [$.id]: "" }, o.value = /* @__PURE__ */ new Set([...o.value, $.id]);
      const B = await xn(O, { id: $.target_id }, s.environment);
      (B == null ? void 0 : B.ok) === !1 && (o.value = new Set([...o.value].filter((F) => F !== $.id)), l.value = { ...l.value, [$.id]: `Could not dismiss this card: ${B.error}` });
    }
    const u = x(
      () => i$(
        t.items.filter(($) => !o.value.has($.id)),
        n.value,
        a.value
      )
    ), c = x(
      () => r$(
        u.value.filter(($) => Va($, Lt)),
        n.value
      )
    ), f = x(() => u.value.filter(($) => !c.value.includes($) && !Va($, Lt))), h = bl(`dock-size:${((w = ra.identity) == null ? void 0 : w.root) || location.host}`, null), g = ($) => {
      var O;
      return !!((O = Lt($.type)) != null && O.needs_user);
    }, y = C(/* @__PURE__ */ new Set()), b = C(/* @__PURE__ */ new Set()), M = x(() => u.value.length === 1), _ = ($) => g($) || M.value, S = ($) => _($) ? y.value.has($.id) || b.value.has($.id) : h.value ? h.value.collapsed && !h.value.opened.includes($.id) : t.collapsed, T = x(() => u.value.some(S));
    pe(() => t.collapsed, ($) => {
      b.value = new Set($ ? u.value.filter(g).map((O) => O.id) : []);
    });
    function H() {
      const $ = !T.value;
      h.value = { collapsed: $, opened: [] }, y.value = new Set($ ? u.value.filter(g).map((O) => O.id) : []), b.value = /* @__PURE__ */ new Set();
    }
    function W($) {
      var B;
      if (!S($)) return;
      if (_($)) {
        y.value = new Set([...y.value].filter((F) => F !== $.id)), b.value = new Set([...b.value].filter((F) => F !== $.id));
        return;
      }
      const O = (B = h.value) != null && B.collapsed ? h.value.opened : [];
      h.value = { collapsed: !0, opened: [...O, $.id] };
    }
    const I = bl(`dock-folded:${((p = ra.identity) == null ? void 0 : p.root) || location.host}`, {}), V = ($) => {
      var O;
      return !!((O = Lt($.type)) != null && O.folds) && (t.insidesFolded || S$(I.value[$.id], Va($, Lt) || t.folded));
    };
    function L($) {
      V($) && E($), I.value = { ...I.value, [$.id]: !V($) };
    }
    function E($) {
      var O;
      !((O = h.value) != null && O.collapsed) || h.value.opened.includes($.id) || (h.value = { collapsed: !0, opened: [...h.value.opened, $.id] });
    }
    function N($) {
      a.value = /* @__PURE__ */ new Set([...a.value, $.id]);
    }
    function D($) {
      a.value = new Set([...a.value].filter((O) => O !== $.id));
    }
    return ($, O) => (r(), j(js, {
      tag: "div",
      name: "dock",
      duration: R(kr),
      class: "dock-stack"
    }, {
      default: P(() => [
        u.value.length > 1 ? (r(), d("div", E$, [
          A(ge, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": T.value ? "Open all" : "Collapse all",
            onClick: H
          }, {
            default: P(() => [
              A(Qt, {
                open: !T.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : k("", !0),
        (r(!0), d(q, null, ne(f.value, (B) => (r(), j(yl, {
          key: B.id,
          item: B,
          class: Y({ timed: R(en)(B) }),
          leaving: R(en)(B) && !a.value.has(B.id),
          folded: V(B),
          collapsed: S(B),
          refusal: l.value[B.id],
          onOpen: (F) => W(B),
          onFold: (F) => L(B),
          onUndock: (F) => i(B, F),
          onMouseenter: (F) => N(B),
          onMouseleave: (F) => D(B)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        (r(!0), d(q, null, ne(c.value, (B) => (r(), j(yl, {
          key: B.id,
          item: B,
          class: Y({ timed: R(en)(B) }),
          leaving: R(en)(B) && !a.value.has(B.id),
          folded: V(B),
          collapsed: S(B),
          refusal: l.value[B.id],
          onOpen: (F) => W(B),
          onFold: (F) => L(B),
          onUndock: (F) => i(B, F),
          onMouseenter: (F) => N(B),
          onMouseleave: (F) => D(B)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128))
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, kM = /* @__PURE__ */ z(A$, [["__scopeId", "data-v-ab76ae18"]]), _t = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Qn = (e) => Math.min(Math.max(e, 0), 1), O$ = (e) => {
  const t = Qn(e);
  return t * t * (3 - 2 * t);
}, wt = (e, t, n) => O$((e - t) / (n - t));
function wM(e) {
  const t = Qn(e), n = Qn((t - 0.12) / 0.76) * _t.shuffles, a = Math.min(Math.floor(n), _t.shuffles - 1), s = n - a, o = wt(s, 0.26, 0.38) * (1 - wt(s, 0.76, 0.96)), l = wt(s, 0.38, 0.76), i = wt(t, 0, 0.12) * (1 - wt(t, 0.88, 1)), u = wt(s, 0.2, 0.34) * (1 - wt(s, 0.84, 1)), c = Math.sin(Math.PI * Qn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / _t.shuffles, lift: _t.lift * o, ready: i, weight: u, follow: c, shuffle: a, phase: s };
}
function $M(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const kl = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, xM = (e) => kl[e] ?? kl.butler, mo = 2400, T$ = 0.05;
function I$({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, T$), l = Math.min(t + mo * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function SM(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function B$(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function MM(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const _M = (e, t) => ({ ...e, stretch: t.stretch }), CM = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, Mr = (e, t) => t >= (e.least ?? 0);
function EM(e, t, n) {
  if (!Mr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const AM = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), R$ = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", wl = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), N$ = (e) => e.right > e.left && e.bottom > e.top;
function OM(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(R$)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = wl(l, n);
    const u = o.closest("[data-figure-scroll]");
    return u && !o.closest("[data-figure-chat-foot]") && (i = wl(i, u.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), N$(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
  });
}
function _r(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, i = 1;
    for (const [f, h, g] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[f] - e[f];
      if (Math.abs(y) < 1e-9)
        (e[f] < o[h] || e[f] > o[g]) && (i = -1);
      else {
        const b = (o[h] - e[f]) / y, M = (o[g] - e[f]) / y;
        l = Math.max(l, Math.min(b, M)), i = Math.min(i, Math.max(b, M));
      }
    }
    if (l > i || a && l >= a.share) continue;
    const u = e.x + (t.x - e.x) * l, c = e.y + (t.y - e.y) * l;
    a = { share: l, x: u, y: c, on: "surface", surface: s.id, dx: u - s.left, dy: c - s.top };
  }
  return a;
}
const Te = {
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
}, pn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), L$ = (e) => e * e * (3 - 2 * e), Ie = (e, [t, n]) => L$(pn(e, t, n)), q$ = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], gt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Hn = ([e, t], n) => e + n() * (t - e);
function D$(e) {
  return q$.map(() => {
    const t = Hn(gt.speed, e), n = Hn(gt.angle, e) * Math.PI / 180, a = Hn(gt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Hn(gt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const P$ = D$(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function j$(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * gt.gravity * (t[2] - gt.floor))) / gt.gravity;
}
function TM(e, t, n = P$) {
  const a = Te.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = j$(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const u = Math.min(s, l), c = a.from.map((f, h) => f + o.velocity[h] * u);
  return c[2] -= gt.gravity * u * u / 2, { at: c, turn: o.spin * u, landed: Math.max(0, s - l) / i };
}
const IM = (e, t) => e && Te[e.name] ? { name: e.name, u: t / e.frames } : null;
function BM(e, t) {
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
const RM = () => Array.from({ length: Te.pogo.count }, (e, t) => Te.pogo.bounce * (t + 1) / Te.pogo.count), jt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function NM(e, t, n) {
  const { away: a, side: s } = Te.bug_smash, o = s * a * n, [l, i] = [t.left + jt.margin * n, t.right - jt.margin * n], u = Math.min(Math.max(e + o + s * jt.reach * n, l), i), c = u - o - e, f = u - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, f - o - t.left], bug: [u - t.left, f - t.left] };
}
function LM(e, t, n) {
  const a = Te.bug_smash, s = Ie(t, a.walk), o = ([l, i]) => l + (i - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (jt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: jt.tall * n * (1 - Ie(t, a.emerge)),
      turn: 90 * (1 - Ie(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Ie(t, a.gone)
    }
  };
}
function qM(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= jt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = I$({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Pe = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function DM(e) {
  const t = Pe.least + Math.floor(e() * (Pe.most - Pe.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Pe.walls[Math.floor(e() * Pe.walls.length)],
    along: Pe.margin + e() * (1 - 2 * Pe.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function Ts(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Pe.margin, l = ((e.along - Pe.margin + e.way * Pe.speed * n / a) / s % 2 + 2) % 2, i = Pe.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + i * a, y: t.top + Pe.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Pe.inset : t.right - Pe.inset, y: t.top + i * a, turn: e.wall === "left" ? 90 : -90 };
}
function F$(e, t) {
  const n = Te.bug_shot, [a, s] = n.turn.map((f) => f * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = B$(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function PM(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Te.bug_shot, { frame: l, bug: i, shot: u } = F$(n, e.length), c = e.map((S, T) => ({ ...Ts(S, t, Math.min(n / o.fps, Xn(T).shot)), shot: T < u })), f = Ie(l / o.frames, o.aim), [h, g] = [c[Math.max(i - 1, 0)], c[i]], y = e.map((S, T) => ({ bug: S, index: T, seconds: n / o.fps - Xn(T).shot, spot: Ts(S, t, Xn(T).shot) })).filter((S) => S.seconds >= 0), b = y.flatMap((S) => {
    const T = (s == null ? void 0 : s.get(S.index)) ?? G$(S.bug, t, S.spot, s ? [] : a);
    return s == null || s.set(S.index, T), s && V$(T, S.seconds, a), K$(T, S.seconds, a);
  }), M = y.filter((S) => z$(S.bug)).map((S) => ({ seconds: S.seconds, from: S.spot })), _ = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - f) + +(e[i].wall === "top") * f;
  return { bugs: c, frame: l, target: { x: h.x + (g.x - h.x) * f, y: h.y + (g.y - h.y) * f, back: _ }, slush: b, camera: M };
}
function Xn(e) {
  const t = Te.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function jM(e, t, n, a) {
  const { limit: s, margin: o } = Te.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let u = n.x;
  return e.map((c, f) => {
    const h = Xn(f), g = Ts(c, t, h.shot), y = Math.abs(g.y - n.y) / Math.tan(s * Math.PI / 180), b = g.x === u ? u - l >= i - u ? -1 : 1 : Math.sign(u - g.x), M = Math.abs(g.x - u) >= y ? u : g.x + b * y, _ = b > 0 ? Math.max(u, Math.min(M, i)) : Math.min(u, Math.max(M, l)), S = { from: u, to: _, begin: h.walk, end: h.aim };
    return u = _, S;
  });
}
function FM(e, t, n) {
  var o;
  const a = Te.bug_shot.back.stride * n;
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
const Ce = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, W$ = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function H$(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const z$ = (e) => e.along * 97 % 1 < Ce.camera, gn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * Ce.gravity * t * t });
function U$(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * Ce.gravity * (t.bottom - e.from.y))) / Ce.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * Ce.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / Ce.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, f) => c.t - f.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += Ce.step) {
    const f = Math.min(c + Ce.step, l.t), h = gn(e, f), g = _r(i, h, n);
    if (g) return { ...g, t: c + (f - c) * g.share };
    i = h;
  }
  const u = gn(e, l.t);
  return { ...l, x: Math.min(Math.max(u.x, t.left), t.right), y: Math.min(Math.max(u.y, t.top), t.bottom) };
}
function G$(e, t, n, a = []) {
  const s = H$(e.along + 1), [o, l] = W$[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: Ce.count }, () => {
    const u = i + (s() - 0.5) * 2 * (Ce.spread * Math.PI / 180), c = Ce.speed[0] + s() * (Ce.speed[1] - Ce.speed[0]), f = { from: { x: n.x, y: n.y }, vx: Math.cos(u) * c, vy: Math.sin(u) * c, r: Ce.radius[0] + s() * (Ce.radius[1] - Ce.radius[0]) };
    return { ...f, ...U$(f, t, a) };
  });
}
function V$(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += Ce.step) {
      const l = Math.min(o + Ce.step, s), i = _r(gn(a, o), gn(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function K$(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...gn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - Ce.hold) / Ce.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((f) => f.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const i = l ? l.left + a.dx : a.x, u = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - u)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: i, y: u, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function WM(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: i, fps: u } = Te.bug_shot;
  if (e < 0) return [];
  const c = (s[1] - s[0]) * i / u, f = (o[1] - o[0]) * i / u, h = Ie(e, [0, c]), g = Ie(e, [c, c + f]);
  return l.map((y) => {
    const b = { x: a.x + y.at[0] * t, y: a.y + y.at[1] * t };
    return {
      x: n.x + (b.x - n.x) * h,
      y: n.y + (b.y - n.y) * h,
      r: y.size * t * (0.15 + 0.85 * h * h),
      run: g * g * t * 1.2,
      fade: 1 - g,
      landed: h >= 1
    };
  });
}
function HM(e, t, n, a, s) {
  const { sway: o, above: l } = Te.chute, i = { x: t.x, y: t.y - l * a }, u = o / 2 * Math.sin(2 * Math.PI * s), [c, f] = [Math.cos(u * Math.PI / 180), Math.sin(u * Math.PI / 180)], h = (M) => {
    const [_, S] = [M.x - e.at.x, M.y - e.at.y];
    return { x: i.x + _ * c - S * f, y: i.y + _ * f + S * c };
  }, [g, y] = [...n].sort((M, _) => M.x - _.x), b = e.ends.map(h);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: u, lines: b.map((M, _) => ({ from: M, to: _ < b.length / 2 ? g : y })) };
}
const zM = (e, t) => Ie(t, e.grows) * (1 - Ie(t, e.sinks));
function ua(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: pn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: pn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function UM(e, t) {
  const n = Te[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = ua(n, t), l = 1 - (1 - n.small) * Ie(a, n.shrinks) * (1 - Ie(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = ua(n, t), o = n.flat * Ie(a, n.squashes) * (1 - Ie(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * pn(s, ...n.springs)) * (1 - pn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const GM = (e) => e === "pack_box";
function VM(e) {
  const { into: t, out: n } = ua(Te.rope_swing, e);
  return 1 - Ie(t, [0, 1]) * (1 - Ie(n, [0, 1]));
}
function KM(e) {
  const t = Te.rope_swing, { into: n, out: a } = ua(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Ie(n, [0, 1]) * (1 - Ie(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const Y$ = { after: 3 }, po = 10, Q$ = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, X$ = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, J$ = { weight: 19 }, Cr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, Z$ = { every: 120 }, Er = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Ar = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, e5 = {
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
}, Cn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: po }), ie = (e, t, n = {}) => Cn(e, "clip", t, n), Ka = (e, t, n = {}) => Cn(e, "look", t, n), $l = (e, t, n = {}) => Cn(e, "gaze", t, n), ye = (e, t, n = {}, a = {}) => ({ ...Cn(e, "pick", t, n), ...a }), $e = (e) => Cn("nothing", "nothing", e, {}), t5 = 120, n5 = 300, Ya = (e, t) => ({ ...ie(e, t), cooldown: n5 }), fe = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), a5 = () => [ie("joy", 2)], $t = (e, t, n, a, s = {}) => ({ ...ie(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), xt = (e) => ({ ...e, cooldown: Q$[e.name] }), Zt = (e) => ({ ...e, shenanigan: !0, lasts: X$[e.name] }), $a = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...fe("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ie("nod", 2), $e(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...fe("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...xt(ie("bug_shot", 3)), toward: "", onto: !1 },
    { ...xt(ie("bug_smash", 2)), toward: "", onto: !1 },
    ie("nod", 2)
  ]),
  ...fe("tests_failed", { cooldown: 20, toward: "card" }, [ie("startled", 2), ie("dismay", 1), ie("tantrum", 3), $e(1)]),
  ...fe("committed", { cooldown: 30, toward: "card", onto: !0 }, [ie("nod", 2), $e(2)]),
  // a finding a plugin found fixed: now and then a halo over the head and a serene, holy look
  ...fe("sin_fixed", { cooldown: 300 }, [ie("halo", 1), $e(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...fe("sin_committed", { cooldown: 300 }, [ie("repent", 1), $e(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...fe("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ie("nod", 4), ie("hand_rub", 4), $e(7)]),
  ...fe("question_asked", { cooldown: 60 }, [ie("ask_sign", 9), ie("look_up", 3), $e(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...fe("reported", { cooldown: 90 }, [$l("read", 3), ie("nod", 1), $e(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...fe("read_message", { cooldown: 30 }, [$l("read", 3), $e(1)]),
  ...fe("fact_filed", { cooldown: 120 }, [ie("file_card", 3), ie("nod", 1), $e(6)]),
  ...fe("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ie("nod", 2), $e(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...fe("bar_done", { holds: !0 }, a5()),
  ...fe("bar_failed", { holds: !0 }, [ie("fume", 1), ie("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...fe("standing", { cooldown: 12 }, [ie("look_left", 2), ie("look_right", 2), ie("look_up", 1), $e(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...fe("launched", { cooldown: 300 }, [ie("tumble", 3), $e(47)]),
  // a break from the hammering now and then
  ...fe("building", { cooldown: 30 }, [ie("wipe_brow", 4), ie("look_left", 1), ie("look_right", 1), $e(69)]),
  ...fe("failed", { cooldown: 20, toward: "card" }, [ie("shake", 3), ie("tantrum", 2), $e(2)]),
  ...fe("refused", { cooldown: 20 }, [ie("shake", 1), $e(1)]),
  ...fe("work_done", { cooldown: 120 }, [ie("stretch", 2), $e(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...fe("pondering", { cooldown: [30, 60] }, [ye("ponder", 1)]),
  ...fe("thought_cloud", { cooldown: 90 }, [ye("cloud", 1)]),
  ...fe("light_bulb", { cooldown: 150 }, [ye("bulb", 1)]),
  ...fe("answered", { cooldown: 15 }, [Ka("amused", 3), $e(2)]),
  ...fe("heard", { cooldown: 30 }, [
    ie("bow", 1, { voices: ["butler"] }),
    ie("salute", 1, { voices: ["squire"] }),
    ie("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    $e(1)
  ]),
  ...fe("long_walk", { cooldown: 90 }, [ie("stumble", 3), $e(22)]),
  ...fe("card_arrived", { cooldown: 20, toward: "card" }, [ie("glance", 7), $e(13)]),
  ...fe("typing", { cooldown: 60 }, [Ka("reading", 1), $e(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(e5).flatMap(([e, t]) => fe(`reacted:${e}`, {}, [Ka(t, 1)])),
  ...Object.entries(Er).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => fe(`agent_reacted:${n}`, {}, [ie(a, 1, { voices: [e] })])[0])),
  ...Object.entries(Ar).flatMap(([e, t]) => fe(`agent_reacted:${e}`, {}, [ie(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...fe("pastime", {}, [
    $t("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    $t("rest", 3, 180, 120),
    $t("yawn", 2, 60, 60),
    $t("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    $t("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    $t("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    $t("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...Zt(xt(ie("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Zt(xt(ie("disco", 2, { ball: "bubble" }))),
    $e(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...fe("held:search", { cooldown: t5 }, [Ya("search", 3), { ...Ya("binoculars", 2), when: { home: !0 } }, { ...Ya("glass_bubble", 2), when: { bubble: !0 } }]),
  ...fe("held:type", {}, [ie("type", 3), ie("type_ponder", 1)]),
  ...fe("held:compacting", {}, [ie("pack_box", 3), ie("vacuum", 2), ie("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...fe("spell", {}, [ye("writing", 12, { state: "writing" }), ye("reading", 12, { state: "reading" }), ye("searching", 12, { state: "searching" }), $e(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...fe("tickled", {}, [{ ...xt(ie("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...fe("eager", {}, [ie("eager", 2, { slow: !0 }), $e(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...fe("jump", {}, [Zt(xt(ie("backflip", 7, { high: !0 }))), ie("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...fe("climb", {}, [ye("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...fe("unit", { cooldown: Cr.build.cooldown }, [ye("unit", J$.weight), $e(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...fe("progress_jump", { cooldown: 6 }, [ie("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...fe("perch", {}, [{ ...ye("hang", 1, { hands: !0, free: !0 }), cooldown: Z$.every }, ye("stand", 5)]),
  // a digit a blow's dust lets out
  ...fe("digit", {}, [ye("0", 1), ye("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...fe("roam", {}, [
    ye("rest", 35, {}, { stay: [25, 60] }),
    ye("seat", 15, {}, { stay: [15, 40] }),
    ye("edge", 25, {}, { stay: [8, 20] }),
    Zt(ye("bubble", 15, {}, { stay: [30, 80] })),
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
    Zt(xt(ye("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
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
], Or = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), Tr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), s5 = (e) => Array.isArray(e) ? e[0] : e, o5 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, l5 = (e) => $a.some((t) => t.when.moment === e);
function i5(e) {
  var c;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), a = (f) => !e.memory || Tr(f).every(([h, g]) => n(h) >= s5(g)), s = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = $a.filter((f) => Or(f.when, e) && (f.type !== "clip" || t(f.name)) && a(f) && s(f)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= Y$.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, u = i.filter((f) => {
    var h;
    return f.type === "nothing" || f.name !== ((h = e.tally) == null ? void 0 : h.last);
  });
  return u.some((f) => f.type !== "nothing") ? u : i;
}
function Qe(e, t) {
  const n = i5(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (Ir(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Ir(e, t, n) {
  var a;
  for (const [s, o] of Tr(t)) (a = e.memory) == null || a.set(s, e.now + o5(o, n));
}
function YM(e, t, n) {
  Ir(e, $a.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const QM = (e) => Object.values(Cr).find((t) => Or(t.when, e)) ?? null, r5 = (e, t, n) => n - t <= (e.lifetime ?? po), XM = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || Mr(e.clip, t));
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
const Is = {
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
}, JM = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Rr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), ZM = {
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
}, e_ = 120, u5 = 20, t_ = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < u5), c5 = (e) => Is[e] || Is.idle, n_ = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Nr = "airborne", d5 = "landing", f5 = "travelling", Lr = "grounded", a_ = ({ airborne: e, landing: t, trip: n }) => e ? Nr : t ? d5 : n != null && n.started ? f5 : Lr;
function s_(e, t) {
  var s;
  const n = h5(e, t);
  return e.mode === Lr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function h5(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: u, state: c, doing: f, doingFacing: h = 0, readingFacing: g = null } = e;
  if (n === Nr && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (u == null ? void 0 : u.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...m5(o, f, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (u && !(u.onto && o)) return { clip: u.clip, facing: u.facing, once: !0, ...u.holds && { holds: !0 }, ...u.stretch && { stretch: u.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const y = g !== null && i.posture === "stand" && f !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(f) ? { clip: "waiting", facing: y ? g : e.composeFacing ?? 0 } : { clip: t(f, i.posture) ? f : c5(c), facing: y ? g : i.posture === "sit" ? i.face : h };
}
function m5(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Bs = (e) => e.outcome, p5 = /^plugin:[^:]+:sins:/, xl = (e) => e.type === "plugins.card" && p5.test(e.markKey), g5 = [
  // a finding a plugin made in the agent's change, and one it found fixed, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => xl(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => xl(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], o_ = (e, t) => e.filter((n) => n.author === "user" && la(n.read_at) > t).map((n) => ({ beat: "read_message", time: la(n.read_at), card: Fi(n) })).sort((n, a) => n.time - a.time), Sl = { user: "reacted", agent: "agent_reacted" };
function l_(e, t) {
  return e.filter((n) => Sl[n.author] && At(n) > t).map((n) => ({ beat: `${Sl[n.author]}:${n.emoji}`, time: At(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const v5 = [.../* @__PURE__ */ new Set([...Object.values(Er).flatMap((e) => Object.keys(e)), ...Object.keys(Ar)])];
function i_(e, t) {
  return e.filter((n) => n.author === "agent" && At(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = v5.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: At(n), card: Fi(n) })).sort((n, a) => n.time - a.time);
}
const y5 = (e) => new Br(e).isTest(), ca = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Bs(e)] || "";
}, b5 = 1800, k5 = (e, t) => {
  if (ca(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && ca(n) !== "finished" && Number(e.time) - Number(n.time) <= b5 ? "tests_fixed" : "tests_passed";
};
function r_(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(y5), s = a.filter((i) => ca(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, ca(i))), o.map((i) => ({ beat: k5(i, s), time: Number(i.time), card: i.key }));
}
function u_(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Bs(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Bs(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const c_ = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: At(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function d_(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function f_(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function h_(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var u;
    return { beat: (u = g5.find((c) => c.matches(i))) == null ? void 0 : u.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, u) => i.time - u.time);
}
function go(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const Ml = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function w5(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    go(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function m_(e, t, n, a = {}) {
  const s = Qe({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : l5(`held:${e}`) ? "idle" : e;
}
const qe = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function p_(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < qe.ahead * n ? 180 : Math.sign(a) * qe.turn;
}
const _l = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function g_(e, t) {
  const n = Math.min(qe.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(qe.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(qe.lines, Math.floor((e.bottom - e.top - 2 * a) / qe.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / qe.sweep) % s, i = o % qe.sweep, u = qe.sweep - qe.returnSeconds, c = _l((i - u) / qe.returnSeconds), f = i <= u ? _l(i / u) : 1 - c, h = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + a + h * qe.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Cl = 3, qr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, El = 12, v_ = (e, t) => ({ mood: e, began: t, seen: 0 });
function y_(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!qr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= Cl ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * El) / El, lasts: Cl } };
}
const b_ = (e) => e.posture === "hang" && !qr(e.face), $5 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), x5 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function k_(e, t, n) {
  return $5.has(e) ? 1 / 0 : !x5.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Dr(n - t.began, t.share) - rt.lead, 0);
}
const S5 = 5;
function w_(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= S5 ? { beat: "long_walk", time: n } : null };
}
const M5 = 30, zn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function $_(e, t, n, a, s = null) {
  if (t && n < t.until || !zn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Qe({ moment: "spell", state: e, tally: s }, a), [l, i] = zn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + zn.every } : { state: e, began: 0, until: 0, next: n + zn.every };
}
const x_ = (e, t, n) => t && n < t.until && Rr.has(e.state) ? { state: t.state, since: t.began } : e, rt = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Dr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function S_(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const u = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: u ? { beat: u } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = Dr(o, e.share);
  return s ? { eager: _5(t, l), moment: null } : l > rt.lead ? { eager: t, moment: null } : l < rt.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > rt.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < rt.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = Qe({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function _5(e, t) {
  return e.on && t > rt.lead + rt.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= rt.lead && t >= rt.least ? { ...e, on: !0, calm: !1 } : e;
}
const C5 = 1, E5 = { look: "look", gaze: "gaze" };
function A5(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = Qe({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [E5[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const O5 = (e, t, n, a, s, o = "", l = () => !0, i = null, u = "") => Qe({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: u }, s), T5 = (e, t, n, a, s, o = 0) => Qe({ moment: "jump", high: e > C5 * t, memory: a, now: s, room: o }, n).name === "backflip", I5 = { work: ["building"], idle: ["standing"] };
function M_(e, t, n, a) {
  const s = Is[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(I5[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), Rr.has(e) ? { moments: o, began: n || a } : (n && a - n >= M5 && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function B5(e, t, n) {
  return !Qe({ moment: "pondering", memory: e, now: t }, n) || !Qe({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Qe({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Al = { pondering: B5 };
function __(e, t, n, a, s, o) {
  if (Al[e.beat]) {
    const i = Al[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = A5(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== po && { lifetime: l.lifetime } } } : null;
}
function C_(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const u = O5(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return u && { clip: u.name, card: "", flies: !!u.flies };
}
const E_ = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function A_(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function O_(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const T_ = (e, t) => !!(e != null && e.watches) && !t.once, I_ = 10, B_ = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || r5(a, a.queuedAt, n)), R_ = (e, t) => t ? null : e[0] ?? null;
function N_(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const L_ = (e, t) => !t.during || !e.some((n) => n.during === t.during), R5 = 2 * Math.PI, N5 = 500;
function q_(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / N5, u = t && e.point && !!t.behind != !!e.point.behind, c = u && e.amount > 0, f = t && !c ? o : 0, h = e.amount < f ? Math.min(e.amount + i, f) : Math.max(e.amount - i, f), g = R5 * l / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, M = (c ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !u ? s && !t.behind && !y.behind ? q5(y, t, n, g, s) : P5(y, t, n, g) : t) ?? y, _ = M != null && M.behind && M.mood === "reading" ? L5(e.point, M, n, l, s) : M;
  return { point: _ ?? null, toward: _ ? { x: _.x - n.x, y: _.y - n.y } : null, amount: h, at: a };
}
function L5(e, t, n, a, s) {
  const o = (N) => N * 180 / Math.PI, l = (N) => o(Math.atan2(Math.sin(N * Math.PI / 180), Math.cos(N * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, u = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -u)) - i), f = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -u)) - i), h = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), g = h ? l(e.readingFacing - i) : 0, y = h ? e.readingYaw + g : f, b = y + l(c - y), M = Math.min(Math.max(a / 1e3, 0), 0.1), _ = qe.turnSpeed * M, S = h ? y + Math.min(Math.max(b - y, -_), _) : b, T = h ? e.readingFollow + g : S, H = T + (S - T) * (1 - Math.exp(-M / qe.followSeconds)), W = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, I = o(go(t.x - n.x, -u, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), V = Math.min(Math.max(I, -W.up), W.down), L = qe.tipSpeed * M, E = h ? e.readingPitch + Math.min(Math.max(V - e.readingPitch, -L), L) : V;
  return { ...t, readingYaw: S, readingFollow: H, readingPitch: E, readingFacing: i };
}
function q5(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (T) => {
    const { yaw: H, pitch: W } = go(T.x - n.x, s, n.y - T.y, o);
    return { yaw: H, pitch: Math.min(Math.max(W, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [u, c] = [Ml(i(e)), Ml(i(t))], f = Math.acos(Math.min(Math.max(u[0] * c[0] + u[1] * c[1] + u[2] * c[2], -1), 1));
  if (f <= a) return { ...t };
  const h = a / f, [g, y] = [Math.sin((1 - h) * f) / Math.sin(f), Math.sin(h * f) / Math.sin(f)], [b, M, _] = u.map((T, H) => g * T + y * c[H]), S = s * b / M;
  return { ...t, x: n.x + S, y: n.y - w5(S, s, -Math.asin(Math.min(Math.max(_, -1), 1)), o) };
}
const D5 = 0.15;
function D_(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= D5;
}
function P5(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), u = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + u * Math.cos(i), y: n.y + u * Math.sin(i) };
}
const j5 = (e) => !(e != null && e.on);
function P_(e, t, n) {
  if (j5(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const vn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, ot = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Qa = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Ol = (e) => e * e * (3 - 2 * e);
function F5(e) {
  if (e < 0 || e >= ot.seconds) return null;
  const t = Qa(e, ...ot.flicker), n = Math.floor(t * ot.flickers * 2) % 2 === 0, a = e < ot.flicker[1] ? n ? 0.35 + 0.5 * t : ot.dim : 1;
  return { strength: 1 - Ol(Qa(e, ...ot.fade)), lit: a, white: e < ot.flash[0] ? 0 : 1 - Ol(Qa(e, ...ot.flash)) };
}
const j_ = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function F_(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = F5(t - e.at);
  return a && { colour: vn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: ot.signs[e.tone], ...a } };
}
function W_(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function H_(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= vn.looks || a === null && n - e.since >= vn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function z_(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const pt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, U_ = { behind: 39, figure: 40, ahead: 41 }, W5 = "[data-figure-pile]", H5 = { amber: [1, 0.69, 0.125], good: vn.colours.good, bad: vn.colours.bad }, Jn = { phases: 4, ms: 230, dim: 0.25 }, G_ = (e, t, n) => e !== "amber" || (t + n) % Jn.phases < Jn.phases / 2 ? 1 : Jn.dim, V_ = (e) => e === "amber" ? Jn.phases : 1;
function K_(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const Y_ = Object.keys(H5), Ze = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, tn = ([e, t], n) => e + n() * (t - e);
function Q_(e) {
  const t = Ze.least + Math.floor(e() * (Ze.most - Ze.least + 1));
  return Array.from({ length: Math.min(t, Ze.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Ze.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = tn(Ze.start, e), l = tn(Ze.reach, e);
    return {
      text: Qe({ moment: "digit" }, e).name,
      x: a * o,
      y: Ze.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(tn(Ze.moveMs, e)),
      fadeMs: Math.round(tn(Ze.fadeMs, e))
    };
  });
}
const Xa = { high: 3, gap: 1 };
function X_(e) {
  const t = Math.floor(e / Xa.high);
  return { left: -(pt.inside + pt.width / 2 + t * (pt.width + Xa.gap)), up: e % Xa.high * (pt.height - pt.top) };
}
const z5 = (e, t, n) => Qe({ moment: "unit", memory: e, now: t }, n) !== null, U5 = { after: 5 }, G5 = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Br(t).isBuild());
function J_(e, t, n) {
  const a = G5(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= U5.after ? s : null;
}
function Z_(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: z5(n, a, s) } : null;
}
const Tl = { ahead: 140, up: 70 };
function eC(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Tl.ahead, y: a - Tl.up } } : o ? { at: { x: n(o), y: a - o.up - pt.height } } : t ? { at: null } : null;
}
const Ja = { least: 4e3, most: 1e4 }, V5 = (e) => Ja.least + e() * (Ja.most - Ja.least), St = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function tC(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = V5(t);
    if (n.length >= St.most || t() >= St.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (St.at[0] + t() * (St.at[1] - St.at[0]));
    n.push({ from: o, to: o + St.ms }), a = o + St.ms;
  }
}
const nC = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), aC = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Pr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), sC = new Set($a.filter((e) => Pr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), K5 = (e) => e.some((t) => t.state === "built"), oC = (e, t) => K5(t) ? e.filter((n) => !Pr.has(n.beat)) : e, yt = { reach: 40, room: 6 }, Y5 = (e, t) => t <= e - yt.reach + 2, lC = (e, t, n) => Y5(e, n) ? t - yt.reach : e - yt.reach - yt.room, iC = (e, t, n, a) => a > 0 && t < e && t + yt.reach >= e - 2 ? Math.min(n, Math.max(e, t + yt.reach)) : e, Za = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, rC = (e) => tn(e() < Za.longShare ? Za.long : Za.short, e), Q5 = 2 * pt.width;
function uC(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= Q5 ? o : e + (o - e + s / 2) % s;
}
const X5 = 60, cC = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= X5, Il = "[data-figure-home]", En = () => {
  var t;
  const e = document.querySelector(Il);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Il)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, J5 = "[data-figure-docked-bars]", Z5 = "[data-figure-chat-foot]", e4 = [0.85, 0.6, 0.35, 0.15], t4 = ["question", "waiting", "suggestion"], dC = (e, t) => t4.find((n) => e[n] > 0 && t[n] === "behind") || null;
function fC() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const n4 = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", a4 = "[data-figure-newest]";
function jr() {
  var a, s;
  const e = (a = En()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(a4), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, i;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !vo(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function yn(e, t, n = jr()) {
  if (!e || !n) return !0;
  const a = dt(e, t), s = Sa(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Re.top * t.size, bottom: a.top + Re.bottom * t.size }, l = _t.gap;
  return !xa(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function hC(e, t, n, a = jr()) {
  if (!a || yn(t, e, a)) return null;
  const s = Sa(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = It(), u = t.posture === "stand" ? bo * e.size : Kr * e.size, c = Math.max(n.left + u, i.left + o), f = Math.min(n.right - u, i.right - l);
  return [a.left - _t.gap - l, a.right + _t.gap + o].map((g) => ({ ...t, x: g })).filter((g) => g.x >= c && g.x <= f && yn(g, e, a) && I4(g, e)).sort((g, y) => Math.abs(g.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const es = 0.26, Fr = 0.54, s4 = 1.25 / 5.4, An = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: es, travels: "stand" },
  lounge: { drop: es, travels: "stand" },
  composed: { drop: es, travels: "stand" },
  hang: { drop: Fr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, mC = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * s4 * Math.cos(t * Math.PI / 180),
  y: 1 - n - Fr
}), sn = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), o4 = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), pC = (e, t) => (e === "sit" ? o4.has(t) : sn.has(e)) ? e : "stand";
function gC(e, t) {
  return e.facing === t.facing || !sn.has(e.posture) && !sn.has(t.posture) ? t : { posture: "stand", facing: sn.has(e.posture) ? e.facing : t.facing };
}
const vC = 0.25, yC = (e, t) => sn.has(e) && An[t].drop === 0, Wr = 2, l4 = 90, i4 = 180, r4 = 140, u4 = 280, c4 = 420, d4 = 0.25, f4 = 290, h4 = 600, m4 = "cubic-bezier(0.2, 0.7, 0.4, 1)", p4 = "cubic-bezier(0.55, 0, 0.9, 0.6)", ts = 5;
function da(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: u = Math.random, memory: c = null, now: f = 0, room: h = 0, pogo: g = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < ts) return null;
  (l || i) && (o = Math.max(o, Wr));
  const y = o > 1, b = Math.abs(t.x - e.x), M = b < ts ? 0 : b / (l4 * o) * 1e3, _ = Math.min(M, y ? r4 : i4), S = Math.abs(t.y - e.y), T = t.y < e.y, H = T && !g && T5(S, n, u, c, f, h), W = T ? c4 + Math.min(S, 400) * d4 : Math.sqrt(2 * S / mo) * 1e3, I = {
    x: t.x,
    y: t.y,
    ms: S > ts ? H ? h4 : W : 0,
    lead: H ? f4 : T ? u4 : 0,
    easing: T ? m4 : p4,
    hopping: !0,
    clip: H ? "backflip" : T ? "jump" : "fall"
  }, V = { x: t.x, y: t.y, ms: M + _, lead: 0, easing: "linear", ramp: _, ...y ? { clip: "run" } : {} }, L = g ? g4(t, n) : I, E = T && !a ? [{ ...V, y: e.y }, L] : [{ ...I, x: e.x }, V];
  return { way: Math.sign(t.x - e.x) || 1, legs: E, lands: !s, pace: o, running: y };
}
const g4 = (e, t) => ({ x: e.x, y: e.y, ms: Te.pogo.frames / Te.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), v4 = (e, t) => e.postures.includes(t) ? t : e.postures[0], bC = (e, t, n) => e.posture === "walk" && n ? "walk" : v4(e.clip, t), dt = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - An[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, xa = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, vo = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function It() {
  var t;
  const e = (t = En()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Un = 0.5, Bl = 20;
function kC(e, t, n = It()) {
  const a = dt(e, t);
  return a.left >= n.left + Bl && a.right <= n.right - Bl;
}
function yo(e, t, n = It()) {
  const a = dt(e, t), s = a.right - a.left, o = Sa(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], u = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - Un && i <= n.right + Un && a.top >= n.top - Un && u <= n.bottom + Un;
}
const fa = [0.35, 0.5, 0.65], ha = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Re = { left: fa[0], right: fa.at(-1), top: ha[0], bottom: ha.at(-1) }, y4 = 0.24;
function Sa(e) {
  if (e.posture === "stand") return { left: Re.left, right: Re.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + y4 * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Re.left, t), right: Math.max(Re.right, t) };
}
function b4(e, { size: t }, n = It()) {
  const a = Sa(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const bo = (Re.right - Re.left) / 2 + 0.08;
function wC(e, t) {
  return e === "hang" ? Re : { ...Re, bottom: Math.min(Re.bottom, 1 - t - An[e].drop) };
}
const k4 = "[data-figure-agent]";
function Hr(e, t, n = "", a = "") {
  var i;
  const s = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !vo(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const u of [l - 1, l].filter((c) => c >= 0)) {
    if (!o.data[u].trim()) continue;
    const c = document.createRange();
    if (c.setStart(o, u), c.setEnd(o, u + 1), [...c.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const zr = (e) => ha.flatMap(
  (t) => fa.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function ko(e, t, n = "") {
  if (!yn(e, t)) return fa.length * ha.length;
  const a = dt(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(n4)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: u }) => u.width && u.height && xa(s, u) && vo(i)).map(({ rect: i }) => i), l = (i, u) => o.some((c) => i >= c.left && i <= c.right && u >= c.top && u <= c.bottom);
  return zr(s).filter(([i, u]) => l(i, u) || Hr(i, u, n)).length;
}
function w4(e, t) {
  const n = dt(e, t);
  return zr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Hr(a, s, "", k4)).length;
}
const Rl = 4;
function $C(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Rl; o <= s; o += Rl)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!w4(i, e) && yn(i, e)) return i;
    }
  return null;
}
function bn(e, t, n) {
  const a = It(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => yo(l, t, a) && yn(l, t)).map((l) => ({ spot: l, covered: ko(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const Ur = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), $4 = [0.5, 0.25, 0.75], x4 = (e) => Ur(e.getBoundingClientRect(), $4), Gr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, S4 = bo, M4 = (e, t, { size: n }, a = S4) => Vr(e, Gr[t], a * n, "stand");
function Vr(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const _4 = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Kr = 0.1, C4 = (e, t, { size: n }) => Vr(e, _4[t], Kr * n, "sit"), E4 = (e) => ((e + 180) % 360 + 360) % 360 - 180, ns = 60;
function xC(e, t) {
  const n = E4(t);
  return !e.aside || Math.abs(n) >= ns ? t : n < 0 ? 360 - ns : ns;
}
const on = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, A4 = (e) => [.../* @__PURE__ */ new Set([e, ...on.turns.map((t) => (t + 360) % 360)])];
function SC(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = A4(t), l = on.every[0] + a() * (on.every[1] - on.every[0]);
  return { face: t, from: s ? O4(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function O4(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / on.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function MC(e, t) {
  const { element: n, edge: a } = Ma(), s = ["left", "right"].map((i) => On(C4(a, i, e), e)).filter((i) => n && yo(i, e) && !ko(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, u) => o(i) - o(u))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function _C(e, t, { size: n }) {
  const a = (Re.right - Re.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Yr } : e;
}
const Yr = 7;
function Qr() {
  const e = [...document.querySelectorAll(W5)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function T4(e, t) {
  const n = dt(e, t), a = n.right - n.left;
  return { left: n.left + Re.left * a, right: n.left + Re.right * a, top: n.top + Re.top * a, bottom: n.bottom };
}
function I4(e, t) {
  const n = Qr();
  return !n || !xa(T4(e, t), n);
}
const B4 = 4;
function Ma() {
  const e = Tn(), t = Qr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > B4 || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Yr - n, 0) } };
}
const CC = ({ size: e, below: t }) => (1 - t) * e;
function On(e, t) {
  const n = It(), { size: a, below: s } = t, o = An[e.posture].drop * a;
  return { ...b4(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const Rs = (e, t) => Object.keys(Gr).map((n) => On(M4(e, n, t), t)), wo = (e, t) => Ur(e, e4).map((n) => On(n, t)), Xr = (e, t, n) => bn(e, t, n) ?? e[0];
function EC(e, t) {
  const { element: n, edge: a } = Ma();
  return { ...Xr(Rs(a, e), e, t), view: null, on: n };
}
function AC(e, t, n, a) {
  const { element: s, edge: o } = Ma(), l = (a ? Rs(o, t) : [...Rs(o, t), ...wo(o, t)]).filter(
    (c) => !xa(dt(c, t), e)
  ), i = bn(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), u = i && !ko(i, t) ? i : bn(l, t, n);
  return u && { ...u, view: null, on: s };
}
function Tn() {
  var a;
  const e = En(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(J5);
  if (!t) return { ..._a(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Nl = { within: 2 };
function OC(e) {
  const { element: t, docked: n, edge: a } = Tn();
  if (!n || e.on !== t) return !0;
  const s = _a().edge;
  return a.left > s.left + Nl.within || a.left + a.width < s.left + s.width - Nl.within;
}
const R4 = "[data-figure-closing]";
function TC() {
  var n;
  const { element: e, docked: t } = Tn();
  return t && !!((n = e.firstElementChild) != null && n.matches(R4));
}
const Jr = "[data-figure-progress]";
function IC(e) {
  const t = e.querySelector(Jr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function BC(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const N4 = { across: 300, above: 380, below: 60 };
function RC(e) {
  const { across: t, above: n, below: a } = N4;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: L4(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const L4 = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Zr = "[data-figure-bar]", Ns = { back: 144, along: 0.4 };
function NC(e) {
  const { element: t, docked: n, edge: a } = Tn(), s = n ? t.querySelector(Zr) : null;
  if (!(s != null && s.querySelector(Jr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...On({ x: o - Ns.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function LC(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < Ns.along * a.size ? t.x + Ns.along * a.size : e.x, y: e.y, behind: !0 };
}
function qC(e) {
  const t = e.querySelector(Zr), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function _a() {
  const e = En();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function DC(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = _a(), u = n === null ? q4(i, e, o === null ? t : { x: o, y: i.top }, a, s) : On({ x: n, y: i.top, posture: "stand" }, e);
  return u && { ...u, view: null, on: l, stays: !0 };
}
function q4(e, t, n, a, s) {
  const o = wo(e, t), l = Math.min(...o.map((u) => u.x)), i = o.filter((u) => u.x + a + pt.width < s && u.x + a - yt.reach - yt.room >= l);
  return bn(i.length ? i : o, t, n);
}
const D4 = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function PC(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: u = [], memory: c = null, now: f = 0, room: h = 0, pogo: g = !1 } = {}) {
  (o || l) && (s = Math.max(s, Wr));
  const y = (H) => {
    const W = dt(H, n, An[H.posture].travels);
    return { x: W.left, y: W.top };
  }, b = t.ladder ?? e.ladder;
  if (b && !(t.ladder && e.ladder)) return P4(y(e), y(t), y({ ...b.foot, posture: "stand" }), b.way, !!t.ladder, n, s);
  const [M, ..._] = [e, ...u, t].map(y), S = da(M, _[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: f, room: h, pogo: g }), T = _.slice(1).map((H, W) => {
    var I;
    return (I = da(_[W], H, n.size, { random: i, memory: c, now: f, room: h })) == null ? void 0 : I.legs.find((V) => V.hopping);
  });
  return S && { ...S, legs: [...S.legs, ...T.filter(Boolean)] };
}
function P4(e, t, n, a, s, o, l) {
  const i = (f, h) => ({ x: h.x, y: h.y, ms: Math.hypot(h.x - f.x, h.y - f.y) / D4.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), u = s ? da(e, n, o.size, { pace: l }) : da(n, t, o.size, { pace: l }), c = s ? [...(u == null ? void 0 : u.legs) ?? [], i(n, t)] : [i(e, n), ...(u == null ? void 0 : u.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function jC(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function FC(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && bn(x4(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = Ma();
  return { ...Xr(wo(s, t), t, n), view: null, on: a };
}
const j4 = "[data-figure-bubble]", F4 = 250;
let ln = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), eu = 0;
const Xt = () => ln, as = /* @__PURE__ */ new WeakMap();
let W4 = 0;
function $o(e) {
  return as.has(e) || as.set(e, `floor-${++W4}`), as.get(e);
}
const H4 = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, z4 = () => {
  var e, t;
  return ((t = (e = En()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function U4(e, t) {
  var a;
  const n = (a = e.querySelector(Z5)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function G4(e, t) {
  const n = e && U4(e, t), a = e ? [...e.querySelectorAll(j4)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || H4(l, n))).map(({ element: o, type: l, box: i }) => ({ id: $o(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const V4 = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= F4 ? (t.top - a.top) / s * 1e3 : 0;
};
function tu(e = ln, t = performance.now()) {
  const n = It(), a = z4(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = Tn(), u = [];
  o && u.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = _a();
  return c.element && u.push({ id: $o(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), u.push(...G4(a, s)), u.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(u.map((f) => Object.freeze({ ...f, vy: V4(e, f, t) }))) });
}
const Ls = /* @__PURE__ */ new Set();
function K4(e) {
  return Ls.add(e), () => Ls.delete(e);
}
function Y4() {
  nu();
  const e = () => {
    eu = requestAnimationFrame(e), !document.hidden && (ln = tu(ln), Ls.forEach((t) => t(ln)));
  };
  e();
}
function nu() {
  cancelAnimationFrame(eu);
}
const xo = 5, Q4 = 56, X4 = { share: 0.6 }, J4 = (e) => -Math.sqrt(2 * mo * X4.share * e), Ut = (e, t) => e.find((n) => n.id === t) ?? null;
function WC(e, t = tu().floors) {
  const n = Ut(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : $o(e.on) : null, o = s && Ut(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function au({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, u = Xt().floors) {
  const c = Ut(u, e);
  if (!c) return null;
  const f = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || Z4(c, f, o)) && ex(f, i, u) ? { x: f.x, y: f.y } : null;
}
const So = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, Z4 = (e, t, n) => !So({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function HC(e, t = Xt().floors) {
  if (!So(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= xo && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function ex(e, t, n = Xt().floors) {
  const a = Ut(n, "home");
  return e.posture === "hang" && a && dt(e, t).bottom >= a.top ? !1 : yo(e, t);
}
function zC(e, t, n, a = Xt().floors) {
  const s = au(e, n, a);
  if (!e.home) return tx(e, t, s, a);
  if (!s) return null;
  const o = Ut(a, "home"), l = s.y - t.y, i = l > xo ? "dropping" : -l > Q4 ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function tx(e, t, n, a) {
  const s = n ? Ut(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: J4(e.risen) };
  if (!n) return null;
  if (So(t) && n.y - t.y > xo) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function UC(e, t, n) {
  const a = bo * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function GC(e, t, n, a = Xt().floors) {
  const s = t && au(t, n, a);
  return s ? { ...e, ...s } : e;
}
const nx = ["data-type"], ax = { class: "figure-floor-name" }, sx = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ve({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", ax, v(e.floor.type), 1)
    ], 12, nx));
  }
}, ox = /* @__PURE__ */ z(sx, [["__scopeId", "data-v-4e0f1e2e"]]), lx = {
  class: "figure-floors",
  "aria-hidden": "true"
}, ix = {
  __name: "FigureFloors",
  setup(e) {
    const t = tt(Xt().floors);
    let n = () => {
    };
    return _e(() => {
      n = K4((a) => t.value = a.floors), Y4();
    }), Ne(() => {
      n(), nu();
    }), (a, s) => (r(), d("div", lx, [
      (r(!0), d(q, null, ne(t.value, (o) => (r(), j(ox, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, VC = /* @__PURE__ */ z(ix, [["__scopeId", "data-v-e519168b"]]), rn = (e) => typeof e == "number" ? e : Date.parse(e);
function KC(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: rn(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => rn(s.row.created_at) - rn(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const Ll = 20;
async function YC(e, t, n) {
  for (let a = 0; a < Ll; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || rn(o.created_at) <= rn(s.created_at) || !await n()) return a;
  }
  return Ll;
}
const rx = 3, ss = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function ux(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = ss[n.grouping]) == null ? void 0 : a.call(ss, e.row, n)) || "";
}
function cx(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function QC(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= rx ? [cx(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = ux(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
function dx(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const XC = (e) => (t) => t.filter((n) => n.id !== e), JC = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), ZC = (e) => (t) => [...t, e], eE = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function tE(e, t = {}) {
  const n = st(), a = C(null), s = C("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function nE(e) {
  const t = st(), n = C("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Gn = /* @__PURE__ */ new Map();
function fx(e, t) {
  if (Gn.has(e)) return Gn.get(e);
  const n = t().finally(() => Gn.delete(e));
  return Gn.set(e, n), n;
}
function aE() {
  const e = st(), t = C(null), n = C("");
  async function a() {
    const s = await fx(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const hx = { class: "cards-page" }, mx = { class: "cards-bar" }, px = { class: "cards-count" }, gx = { class: "cards" }, vx = {
  key: 1,
  class: "cards-note"
}, yx = {
  key: 2,
  class: "cards-note"
}, bx = ["data-row", "onClick"], kx = { class: "card-head" }, wx = { class: "card-title" }, $x = { class: "card-foot" }, xx = {
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
    return (a, s) => (r(), d("div", hx, [
      m("div", mx, [
        m("span", px, v(e.rows.length) + " " + v(e.rows.length === 1 ? e.term : `${e.term}s`), 1),
        A(ge, De({
          small: "",
          bordered: ""
        }, { [`data-${e.term}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: P(() => [
            A(le, {
              name: "plus",
              size: 12
            }),
            G(" New " + v(e.term), 1)
          ]),
          _: 1
        }, 16)
      ]),
      m("div", gx, [
        e.loaded ? e.failure ? (r(), d("p", vx, v(e.failure), 1)) : e.rows.length ? k("", !0) : (r(), d("p", yx, "No " + v(e.term) + "s yet", 1)) : (r(), j(Xe, {
          key: 0,
          shape: "cards"
        })),
        (r(!0), d(q, null, ne(e.rows, (o) => (r(), d("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          m("span", kx, [
            A(le, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            G(" " + v(e.head(o)), 1),
            A(nt, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          m("span", wx, v(e.title(o)), 1),
          m("span", $x, v(e.foot(o)), 1)
        ], 8, bx))), 128))
      ]),
      re(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, sE = /* @__PURE__ */ z(xx, [["__scopeId", "data-v-b39fea5d"]]), ql = "newest";
function oE(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Me(Be, null)) == null ? void 0 : c.search, s = C(""), o = C(ql), l = C("all"), i = x(() => {
    const f = s.value.trim().toLowerCase(), h = e.value.filter((g) => dx(g, f, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(g) === (l.value === "open")));
    return o.value === ql ? h : [...h].sort((g, y) => t(g).localeCompare(t(y)));
  }), u = x(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: u, hasStates: !!n };
}
const Sx = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, Mx = {
  class: "auto-scroll-newest-line",
  "data-scroll-newest-line": ""
}, _x = 40, Cx = "top", Ex = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" }, feed: { type: Object, default: null } },
  setup(e, { expose: t }) {
    var g;
    const n = e, a = (g = Me(Be, null)) == null ? void 0 : g.autoScroll, s = x(() => a === Cx), o = C(null), l = C(!1), i = (y) => s.value ? y.scrollTop : y.scrollHeight - y.scrollTop - y.clientHeight, u = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: u(), behavior: "smooth" });
    function f() {
      var y;
      l.value = i(o.value) >= _x, s.value || (y = n.feed) == null || y.reachTop(o.value);
    }
    pe(() => {
      var y;
      return [n.rowCount, (y = n.feed) == null ? void 0 : y.isLoaded()];
    }, async () => {
      await Fe(), o.value && (l.value || (o.value.scrollTop = u()), n.feed && !s.value && (n.feed.drawn(o.value), await n.feed.fill(o.value)));
    }, { immediate: !0, flush: "post" });
    let h = null;
    return _e(() => {
      typeof MutationObserver > "u" || (h = new MutationObserver(() => {
        !l.value && o.value && (o.value.scrollTop = u());
      }), h.observe(o.value, { childList: !0, subtree: !0, attributes: !0, characterData: !0 }));
    }), at(() => h == null ? void 0 : h.disconnect()), t({ pane: o }), (y, b) => (r(), d("div", Sx, [
      m("div", {
        ref_key: "pane",
        ref: o,
        class: Y(["auto-scroll-pane", e.paneClass]),
        onScroll: f
      }, [
        re(y.$slots, "default", {}, void 0, !0)
      ], 34),
      m("div", Mx, [
        A(Vt, {
          name: "auto-scroll-rise",
          persisted: ""
        }, {
          default: P(() => [
            Ve(m("button", {
              type: "button",
              class: "auto-scroll-newest",
              "data-scroll-newest": "",
              title: "Back to the newest",
              onClick: c
            }, [
              A(le, {
                name: s.value ? "up" : "down"
              }, null, 8, ["name"]),
              b[0] || (b[0] = G(" Newest ", -1))
            ], 512), [
              [Kl, l.value]
            ])
          ]),
          _: 1
        })
      ])
    ]));
  }
}, lE = /* @__PURE__ */ z(Ex, [["__scopeId", "data-v-d704d7e3"]]), Ax = ["aria-selected", "data-tab", "onClick"], Ox = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, Tx = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Me(Be, null), o = x(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = C(null), i = C({ left: 0, width: 0, slides: !1 }), u = (g) => n.answer[g.count_field] !== void 0;
    function c(g) {
      var b;
      const y = (b = l.value) == null ? void 0 : b.querySelector(".inner-tab.on");
      if (!y) return void (i.value = { left: 0, width: 0, slides: !1 });
      i.value = { left: y.offsetLeft, width: y.offsetWidth, slides: g }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, y.offsetLeft - 12));
    }
    const f = () => Fe(() => c(!0));
    let h = null;
    return _e(() => {
      var g;
      c(!1), h = new ResizeObserver(() => c(!1)), h.observe(l.value), (g = document.fonts) == null || g.ready.then(() => c(!1));
    }), Ne(() => h == null ? void 0 : h.disconnect()), pe(() => {
      var g;
      return (g = n.active) == null ? void 0 : g.key;
    }, f), pe(() => n.answer, f, { deep: !0 }), (g, y) => (r(), d("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (r(!0), d(q, null, ne(o.value, (b) => {
        var M, _;
        return r(), d("button", {
          key: b.key,
          type: "button",
          role: "tab",
          class: Y(["inner-tab", { on: ((M = e.active) == null ? void 0 : M.key) === b.key }]),
          "aria-selected": ((_ = e.active) == null ? void 0 : _.key) === b.key,
          "data-tab": b.key,
          onClick: (S) => a("choose", b)
        }, [
          G(v(b.label) + " ", 1),
          u(b) ? (r(), d("span", Ox, v(e.answer[b.count_field]), 1)) : k("", !0)
        ], 10, Ax);
      }), 128)),
      m("i", {
        class: Y(["inner-tabs-line", { slides: i.value.slides }]),
        style: ve({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, iE = /* @__PURE__ */ z(Tx, [["__scopeId", "data-v-63fcd326"]]), Ix = { class: "task-bar" }, Bx = {
  __name: "TaskBar",
  props: { total: { type: Number, required: !0 }, done: { type: Number, required: !0 }, testing: { type: Number, required: !0 }, started: { type: Number, default: 0 } },
  setup(e) {
    const t = e, n = (a) => t.total ? Math.round(a / t.total * 100) : 0;
    return (a, s) => (r(), d("span", Ix, [
      m("span", {
        class: "task-bar-fill",
        "data-task-bar-done": "",
        style: ve({ width: `${n(e.done)}%` })
      }, null, 4),
      m("span", {
        class: "task-bar-testing",
        "data-task-bar-testing": "",
        style: ve({ width: `${n(e.testing)}%` })
      }, null, 4),
      m("span", {
        class: "task-bar-started",
        "data-task-bar-started": "",
        style: ve({ width: `${n(e.started)}%` })
      }, null, 4)
    ]));
  }
}, rE = /* @__PURE__ */ z(Bx, [["__scopeId", "data-v-eafa73d4"]]), Rx = {
  class: "tab-body",
  "data-tab-body": ""
}, Nx = { "data-tab-content": "" }, Lx = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = C(!1);
    let a = 0;
    return pe(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, Fs(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (r(), d("div", Rx, [
      n.value ? (r(), j(Xe, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : k("", !0),
      Ve(m("div", Nx, [
        re(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Kl, !n.value]
      ])
    ]));
  }
}, uE = /* @__PURE__ */ z(Lx, [["__scopeId", "data-v-63876533"]]), qx = {
  class: "search-bar",
  "data-search-bar": ""
}, Dx = { class: "search-bar-control" }, Px = ["value", "placeholder", "aria-label"], jx = ["aria-expanded"], Fx = {
  key: 0,
  "data-menu-count": ""
}, Wx = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var S;
    const a = e, s = n, o = pu(), l = ((S = Me(Be, null)) == null ? void 0 : S.search) ?? {}, i = x(() => l.placeholder || a.placeholder), u = l.context ?? [], c = C(null), f = C(null), h = C([]), g = x(() => h.value.length ? h.value[h.value.length - 1].next : u), y = x(() => !!o.menu || u.length > 0), b = (T) => {
      h.value = [], f.value = f.value ? null : T.currentTarget;
    };
    function M(T) {
      if (T.next.length) {
        h.value = [...h.value, T];
        return;
      }
      f.value = null, s("pick", T.click);
    }
    function _() {
      var T;
      s("update:modelValue", ""), (T = c.value) == null || T.focus();
    }
    return t({ focus: () => {
      var T;
      return (T = c.value) == null ? void 0 : T.focus();
    } }), (T, H) => {
      var W;
      return r(), d("div", qx, [
        m("div", Dx, [
          A(le, {
            class: "search-bar-icon",
            name: "search",
            size: 14
          }),
          m("input", {
            ref_key: "field",
            ref: c,
            class: "search-bar-input",
            type: "text",
            "data-search-input": "",
            value: e.modelValue,
            placeholder: i.value,
            "aria-label": i.value,
            onInput: H[0] || (H[0] = (I) => s("update:modelValue", I.target.value)),
            onKeydown: Et(_, ["esc"])
          }, null, 40, Px),
          e.modelValue ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: _
          }, [
            A(le, {
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
            e.menuCount ? (r(), d("span", Fx, v(e.menuCount), 1)) : k("", !0),
            A(le, {
              name: "caret",
              size: 12
            })
          ], 8, jx)) : k("", !0)
        ]),
        (W = R(l).button) != null && W.title ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: H[1] || (H[1] = (I) => s("pick", R(l).button.click))
        }, v(R(l).button.title), 1)) : k("", !0),
        re(T.$slots, "default", {}, void 0, !0),
        f.value ? (r(), j(va, {
          key: 1,
          anchor: f.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: H[3] || (H[3] = xe(() => {
          }, ["stop"])),
          onClose: H[4] || (H[4] = (I) => f.value = null)
        }, {
          default: P(() => [
            h.value.length ? (r(), j(Ue, {
              key: 0,
              "data-search-back": "",
              onClick: H[2] || (H[2] = (I) => h.value = h.value.slice(0, -1))
            }, {
              default: P(() => [
                G("‹ " + v(h.value[h.value.length - 1].title), 1)
              ]),
              _: 1
            })) : k("", !0),
            (r(!0), d(q, null, ne(g.value, (I) => (r(), j(Ue, {
              key: I.title,
              description: I.subtext,
              "data-search-entry": I.title,
              onClick: (V) => M(I)
            }, {
              default: P(() => [
                G(v(I.title) + v(I.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            h.value.length ? k("", !0) : re(T.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : k("", !0)
      ]);
    };
  }
}, Hx = /* @__PURE__ */ z(Wx, [["__scopeId", "data-v-45374bed"]]), zx = {
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
    return (o, l) => (r(), j(Hx, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (i) => n("pick", i))
    }, {
      menu: P(() => [
        A(Ct, null, {
          default: P(() => [...l[2] || (l[2] = [
            G("Order", -1)
          ])]),
          _: 1
        }),
        (r(), d(q, null, ne(a, (i) => A(Ue, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (u) => e.tools.order.value = i.key
        }, {
          default: P(() => [
            G(v(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (r(), d(q, { key: 0 }, [
          A(Ct, null, {
            default: P(() => [...l[3] || (l[3] = [
              G("Show", -1)
            ])]),
            _: 1
          }),
          (r(), d(q, null, ne(s, (i) => A(Ue, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (u) => e.tools.state.value = i.key
          }, {
            default: P(() => [
              G(v(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : k("", !0)
      ]),
      default: P(() => [
        re(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, cE = /* @__PURE__ */ z(zx, [["__scopeId", "data-v-dab0064d"]]);
function dE() {
  const e = C(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const fE = (e) => import(
  /* @vite-ignore */
  e
), Ux = 86400, qs = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Gx(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((qs(t) - qs(e)) / Ux);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function hE(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = qs(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: Gx(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const os = 280, ls = 240, is = 120, Vx = 6, Kx = 14, kn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Yx(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function su(e, t) {
  const n = Math.max(0, Yx(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function Qx(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Kx}px)` }), e.offsetHeight, e.style.transition = `height ${os}ms ${kn}`, e.style.height = `${l}px`;
  const i = s();
  let u = !1, c = !1;
  const f = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, h = () => {
    if (c) return;
    n() && (t.scrollTop = su(t, e));
    const g = s() - i;
    if (!u && g >= os && (u = !0, e.style.transition = `opacity ${ls}ms ease-out, transform ${ls}ms ${kn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), g < os + ls) return a(h);
    f();
  };
  return a(h), f;
}
function mE(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Vx}px)` }), e.offsetHeight, e.style.transition = `opacity ${is}ms ease-out, transform ${is}ms ${kn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = su(t, e)), s() - l < is) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const Xx = 140, Vn = 220, Dl = 5;
function pE({ gap: e = Xx, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function i(f, h) {
    a.add(f), f.cancel = f.arrival(f.el, f.options, () => {
      a.delete(f), f.done(), h();
    });
  }
  function u() {
    const f = n.splice(0, Dl);
    if (s = f.length > 0, !s) return;
    let h = f.length;
    for (const g of f)
      g.el.style.display = g.display, i(g, () => {
        h -= 1, h || (o = t(u, e));
      });
  }
  const c = (f, h, g, y = Qx) => {
    if (l || !h.pane || !h.follows()) return g();
    const b = { el: f, options: h, done: g, arrival: y, display: f.style.display || "" };
    if (!s)
      return s = !0, i(b, () => o = t(u, e));
    f.style.display = "none", n.push(b), n.length >= Dl && c.flush();
  };
  return c.flush = () => {
    var f;
    l = !0, queueMicrotask(() => l = !1);
    for (const h of [...a]) (f = h.cancel) == null || f.call(h);
    clearTimeout(o), s = !1;
    for (const h of n.splice(0))
      h.el.style.display = h.display, h.done();
  }, c;
}
function gE(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Vn}ms ${kn}, opacity ${Vn}ms ease-in, margin ${Vn}ms ${kn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Vn);
}
const ou = "chat.pins.minimised", Zn = C(na(ou, !1));
function Pl(e) {
  Zn.value = e, to(ou, e);
}
function Jx(e) {
  const t = x(() => e()), n = x(() => Zn.value ? [] : e()), a = () => Pl(!Zn.value), s = Date.now() / 1e3;
  return pe(
    () => t.value.filter((o) => At(o) > s).length,
    (o, l) => o > l && Pl(!1)
  ), { pins: t, visible: n, minimised: Zn, toggle: a };
}
const Zx = ["title"], e8 = {
  key: 0,
  class: "pins-count"
}, t8 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = Jx(() => t.pinRows);
    return (o, l) => R(n).length ? (r(), d("button", {
      key: 0,
      type: "button",
      class: Y(["pins-toggle", { minimised: R(a), inline: e.inline }]),
      title: R(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = xe((...i) => R(s) && R(s)(...i), ["stop"]))
    }, [
      A(le, {
        name: R(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      R(a) ? (r(), d("span", e8, v(R(n).length), 1)) : k("", !0)
    ], 10, Zx)) : k("", !0);
  }
}, vE = /* @__PURE__ */ z(t8, [["__scopeId", "data-v-d073c504"]]), n8 = ["title"], a8 = ["title"], s8 = { class: "diff-card-dir" }, o8 = { class: "diff-card-name" }, l8 = {
  key: 1,
  class: "diff-card-from",
  "data-diff-card-from": ""
}, i8 = ["title"], r8 = ["title"], u8 = {
  key: 0,
  class: "diff-card-note"
}, c8 = ["href"], d8 = ["src", "alt"], f8 = { class: "diff-card-rows" }, h8 = { class: "diff-row-num" }, m8 = { class: "diff-row-sign" }, p8 = { class: "diff-row-code" }, g8 = {
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
    function o(D) {
      (D.metaKey || D.ctrlKey) && (D.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted", moved: "moved" }, i = { add: "+", del: "−" }, u = x(() => n.path.lastIndexOf("/") + 1), c = x(() => n.path.slice(0, u.value)), f = x(() => n.path.slice(u.value)), h = x(() => n.change === "deleted"), g = x(() => l[n.change]), y = x(() => new Set(n.rows.filter((D) => D.line_type === "add").map((D) => D.line))), b = C("after"), M = x(() => b.value === "before" ? n.whole.old : n.whole.text), _ = x(() => n.whole && n.whole.text !== void 0 ? M.value.split(`
`).map((D, w) => ({ line_type: b.value === "after" && y.value.has(w + 1) ? "add" : "ctx", line: w + 1, text: D })) : n.rows.filter(
      (D) => !(n.editsOnly && ["ctx", "fold"].includes(D.line_type)) && !(n.hideRemovals && D.line_type === "del")
    )), S = C(!1), T = x(() => n.lines && !S.value && !n.whole), H = x(() => T.value ? _.value.slice(0, n.lines) : _.value), W = x(() => _.value.length - H.value.length), I = (D) => D.line === null || D.line_type === "del" ? "" : D.line, V = (D) => D.line_type === "fold" ? D.hidden ? `⋯ ${D.hidden} lines` : "⋯" : D.text, L = C(null), E = C(null);
    let N = null;
    return _e(() => {
      if (!E.value) return;
      let D = !0;
      N = new ResizeObserver(() => {
        !L.value || !E.value || (L.value.style.transition = D ? "none" : "", L.value.style.height = `${E.value.offsetHeight}px`, D = !1);
      }), N.observe(E.value);
    }), Ne(() => N && N.disconnect()), (D, w) => (r(), d("section", {
      class: Y(["diff-card", { half: e.half, gone: h.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      m("header", {
        class: "diff-card-head",
        title: h.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: w[2] || (w[2] = (p) => !h.value && a("fold"))
      }, [
        m("span", {
          class: "diff-card-path",
          title: `${e.path} · ${R(s)}-click to open it`,
          onClick: o
        }, [
          m("span", s8, v(c.value), 1),
          m("span", o8, v(f.value), 1),
          g.value ? (r(), d("span", {
            key: 0,
            class: Y(["diff-card-badge", e.change])
          }, v(g.value), 3)) : k("", !0),
          e.from ? (r(), d("span", l8, "from " + v(e.from), 1)) : k("", !0)
        ], 8, a8),
        m("span", {
          class: Y(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + v(e.added), 3),
        m("span", {
          class: Y(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + v(e.removed), 3),
        A(nt, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: b.value === "after" ? "Show the file before" : "Show the file after",
          onClick: w[0] || (w[0] = xe((p) => b.value = b.value === "after" ? "before" : "after", ["stop"]))
        }, v(b.value === "after" ? "After" : "Before"), 9, i8)) : k("", !0),
        h.value ? k("", !0) : (r(), d("button", {
          key: 1,
          type: "button",
          class: Y(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: w[1] || (w[1] = xe((p) => a("whole"), ["stop"]))
        }, [
          A(le, {
            name: "file",
            size: 12
          })
        ], 10, r8))
      ], 8, n8),
      e.whole && e.whole.error ? (r(), d("p", u8, v(e.whole.error), 1)) : k("", !0),
      !h.value && !e.folded ? (r(), d(q, { key: 1 }, [
        e.picture ? (r(), d("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          m("img", {
            src: e.picture,
            alt: f.value,
            loading: "lazy"
          }, null, 8, d8)
        ], 8, c8)) : (r(), d("div", {
          key: 1,
          ref_key: "grow",
          ref: L,
          class: "diff-card-grow"
        }, [
          m("div", {
            ref_key: "body",
            ref: E,
            class: "diff-card-diff"
          }, [
            m("div", f8, [
              (r(!0), d(q, null, ne(H.value, (p, $) => (r(), d("div", {
                key: $,
                class: Y(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                m("span", h8, v(I(p)), 1),
                m("span", m8, v(i[p.line_type]), 1),
                m("span", p8, v(V(p)), 1)
              ], 2))), 128)),
              W.value > 0 ? (r(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: w[3] || (w[3] = xe((p) => S.value = !0, ["stop"]))
              }, v(W.value) + " more " + v(W.value === 1 ? "line" : "lines"), 1)) : k("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : k("", !0)
    ], 2));
  }
}, yE = /* @__PURE__ */ z(g8, [["__scopeId", "data-v-021c4dbc"]]), v8 = { "data-queue-controls": "" }, y8 = { class: "counts" }, b8 = { "data-queue-spots": "" }, k8 = {
  class: "spots",
  "aria-label": "Places in use"
}, w8 = { "data-queue-waiting": "" }, $8 = { key: 0 }, x8 = { class: "control" }, S8 = { class: "stepper" }, M8 = ["disabled"], _8 = {
  "aria-labelledby": "queue-limit-label",
  "data-queue-limit": ""
}, C8 = ["disabled"], E8 = ["for"], A8 = ["id", "value", "disabled", "onChange"], O8 = {
  key: 0,
  class: "note halted",
  role: "status",
  "data-queue-update-waits": ""
}, T8 = {
  key: 1,
  class: "note halted",
  role: "status",
  "data-queue-held": ""
}, I8 = {
  key: 2,
  class: "note failure",
  role: "alert"
}, B8 = {
  __name: "ProcessQueueControls",
  props: { queue: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(!1), o = C("");
    async function l(i, u) {
      if (s.value) return;
      s.value = !0;
      const c = await n.read(["setting", "set", i, String(u)]);
      o.value = c.ok ? "" : c.error, c.ok && a("saved"), s.value = !1;
    }
    return (i, u) => (r(), d("div", v8, [
      A(zt, { icon: "gauge" }, {
        default: P(() => [...u[2] || (u[2] = [
          G("Now", -1)
        ])]),
        _: 1
      }),
      m("div", y8, [
        m("div", null, [
          m("strong", b8, [
            G(v(e.queue.used_slots) + " ", 1),
            m("span", null, "of " + v(e.queue.parallel_limit), 1)
          ]),
          m("p", null, "Commands running. " + v(e.queue.used_slots >= e.queue.parallel_limit ? "Every place is taken." : `${e.queue.parallel_limit - e.queue.used_slots} ${e.queue.parallel_limit - e.queue.used_slots === 1 ? "place" : "places"} free.`), 1),
          m("div", k8, [
            (r(!0), d(q, null, ne(e.queue.parallel_limit, (c) => (r(), d("span", {
              key: c,
              class: Y({ used: c <= e.queue.used_slots })
            }, null, 2))), 128))
          ])
        ]),
        m("div", null, [
          m("strong", w8, v(e.queue.waiting_count), 1),
          u[3] || (u[3] = m("p", null, "Commands waiting", -1)),
          e.queue.waiting_count ? (r(), d("p", $8, "The oldest goes first.")) : k("", !0)
        ])
      ]),
      m("div", x8, [
        u[4] || (u[4] = m("div", null, [
          m("label", { id: "queue-limit-label" }, "Commands at once"),
          m("p", null, "How many of the workers' commands may run at the same time. The rest wait. Lowering it stops none that are running.")
        ], -1)),
        m("div", S8, [
          m("button", {
            type: "button",
            "aria-label": "One fewer command at once",
            disabled: s.value || e.queue.parallel_limit <= 1,
            onClick: u[0] || (u[0] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit - 1))
          }, "−", 8, M8),
          m("output", _8, v(e.queue.parallel_limit), 1),
          m("button", {
            type: "button",
            "aria-label": "One more command at once",
            disabled: s.value,
            onClick: u[1] || (u[1] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit + 1))
          }, "+", 8, C8)
        ])
      ]),
      (r(!0), d(q, null, ne(e.queue.suite_limits, (c) => (r(), d("div", {
        key: c.key,
        class: "control"
      }, [
        m("div", null, [
          m("label", {
            for: c.key
          }, v(c.title), 9, E8),
          m("p", null, v(c.description), 1)
        ]),
        m("input", {
          id: c.key,
          class: "limit",
          type: "number",
          min: "0",
          value: c.value,
          disabled: s.value,
          "data-queue-suite-limit": "",
          onChange: (f) => l(c.key, f.target.value)
        }, null, 40, A8)
      ]))), 128)),
      e.queue.halt_cause === "update" ? (r(), d("p", O8, [
        A(le, {
          name: "pause",
          size: 13
        }),
        u[5] || (u[5] = G("An update waits for the running commands to end. Every command that waits stays in the queue, in order, and gets its place once the update is done.", -1))
      ])) : e.queue.halted ? (r(), d("p", T8, [
        A(le, {
          name: "pause",
          size: 13
        }),
        G("The queue is paused. No waiting command gets a place until it is resumed. " + v(e.queue.halt_reason), 1)
      ])) : k("", !0),
      o.value ? (r(), d("p", I8, v(o.value), 1)) : k("", !0)
    ]));
  }
}, R8 = /* @__PURE__ */ z(B8, [["__scopeId", "data-v-9ebbefc9"]]), N8 = ["data-queue-row", "data-queue-process"], L8 = ["aria-expanded"], q8 = { class: "run-line" }, D8 = { class: "leading" }, P8 = {
  key: 0,
  "data-queue-position": ""
}, j8 = ["title"], F8 = { class: "command" }, W8 = {
  class: "time",
  "data-queue-time": ""
}, H8 = { class: "details" }, z8 = { "data-queue-type": "" }, U8 = { class: "failed" }, G8 = { class: "drop-inner" }, V8 = { class: "output" }, K8 = { class: "output-heading" }, Y8 = ["href"], Q8 = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(), o = gr((g) => n.read([...g, "--limit", "50"]), () => n.run.id), l = o.lines, i = co(), u = x(() => n.run.plugin ? `Plugin ${n.run.plugin}` : { test: "Test run", build: "Build", check: "Check", install: "Install" }[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = x(() => {
      const g = n.run.section === "waiting" ? n.run.created_at : n.run.started_at;
      if (!g) return "";
      const y = n.run.ended_at ? new Date(n.run.ended_at).getTime() : i.value * 1e3, b = Math.max(0, Math.floor((y - new Date(g).getTime()) / 1e3));
      return b < 60 ? `${b} s` : b < 3600 ? `${Math.floor(b / 60)} m ${b % 60} s` : `${Math.floor(b / 3600)} h ${String(Math.floor(b / 60) % 60).padStart(2, "0")} m`;
    });
    async function f() {
      if (!n.expanded) return;
      const g = s.value, y = g.scrollHeight - g.scrollTop - g.clientHeight < 2;
      await o.follow(), await Fe(), n.expanded && y && (g.scrollTop = g.scrollHeight);
    }
    async function h() {
      n.expanded && (await o.newest(), await Fe(), n.expanded && (s.value.scrollTop = s.value.scrollHeight, o.feed.drawn(s.value)));
    }
    return pe(() => n.expanded, h, { immediate: !0 }), _n(["output.*"], f, (g) => li(g, /* @__PURE__ */ new Set([n.run.id]))), (g, y) => (r(), d("div", {
      class: "run",
      "data-queue-row": e.run.section,
      "data-queue-process": e.run.id
    }, [
      m("div", {
        class: "toggle",
        role: "button",
        tabindex: "0",
        "aria-expanded": e.expanded,
        onClick: y[2] || (y[2] = (b) => a("toggle")),
        onKeydown: [
          y[3] || (y[3] = Et(xe((b) => a("toggle"), ["prevent"]), ["enter"])),
          y[4] || (y[4] = Et(xe((b) => a("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        m("div", q8, [
          m("span", D8, [
            e.run.section === "waiting" ? (r(), d("span", P8, v(e.position), 1)) : (r(), d("span", {
              key: 1,
              class: Y(["dot", { ring: e.run.section === "running" && !e.run.uses_slot, passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "running" && !e.run.uses_slot ? "Running, not counted in the limit" : e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, j8))
          ]),
          m("code", F8, v(e.run.line), 1),
          m("span", W8, v(c.value), 1),
          A(le, {
            class: Y(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        m("div", H8, [
          m("span", z8, v(u.value), 1),
          e.run.owner_agent_id ? (r(), d(q, { key: 0 }, [
            y[6] || (y[6] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: y[0] || (y[0] = xe((b) => R(bt)("agents", e.run.owner_agent_id), ["stop"]))
            }, "Agent " + v(e.run.owner_agent_id), 1)
          ], 64)) : e.run.is_main ? (r(), d(q, { key: 1 }, [
            y[7] || (y[7] = m("span", { class: "separator" }, "·", -1)),
            y[8] || (y[8] = m("span", null, "Main agent", -1))
          ], 64)) : k("", !0),
          e.run.task_id ? (r(), d(q, { key: 2 }, [
            y[9] || (y[9] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-task": "",
              onClick: y[1] || (y[1] = xe((b) => R(bt)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + v(e.run.task_id), 1)
          ], 64)) : k("", !0),
          e.run.state === "failed" ? (r(), d(q, { key: 3 }, [
            y[10] || (y[10] = m("span", { class: "separator" }, "·", -1)),
            m("span", U8, "Failed, exit " + v(e.run.exit_code), 1)
          ], 64)) : k("", !0)
        ])
      ], 40, L8),
      m("div", {
        class: Y(["drop", { open: e.expanded }])
      }, [
        m("div", G8, [
          m("div", V8, [
            m("div", K8, [
              m("span", null, "Output " + v(e.run.id), 1),
              m("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, Y8)
            ]),
            m("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: y[5] || (y[5] = (b) => e.expanded && R(o).loadEarlier(b.target))
            }, [
              y[11] || (y[11] = m("span", { class: "prompt" }, "$ ", -1)),
              G(v(e.run.line), 1),
              R(l).length ? (r(), d(q, { key: 0 }, [
                G(v(`
` + R(l).join(`
`)), 1)
              ], 64)) : k("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, N8));
  }
}, X8 = /* @__PURE__ */ z(Q8, [["__scopeId", "data-v-18099d0b"]]), J8 = {
  class: "lanes",
  "data-execution-lanes": ""
}, Z8 = { class: "filters" }, e3 = ["value"], t3 = ["value"], n3 = ["data-lane"], a3 = {
  key: 0,
  class: "empty"
}, s3 = { class: "line" }, o3 = { class: "facts" }, l3 = { class: "line" }, i3 = { class: "facts" }, r3 = {
  class: "waits",
  "data-lanes-waits": ""
}, u3 = {
  key: 0,
  class: "empty"
}, c3 = {
  __name: "ExecutionLanes",
  props: { execution: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = C(""), a = C(""), s = x(() => [...new Set(t.execution.lanes.flatMap((h) => [...h.running, ...h.waiting].map((g) => g.class)))].sort()), o = x(() => [...new Set(t.execution.lanes.flatMap((h) => [...h.running, ...h.waiting].map((g) => g.starter)))].sort()), l = (h) => (!n.value || h.class === n.value) && (!a.value || h.starter === a.value), i = x(() => t.execution.lanes.map((h) => ({ ...h, running: h.running.filter(l), waiting: h.waiting.filter(l) }))), u = x(() => t.execution.waits.filter((h) => h.runs)), c = (h) => `${h.lane[0].toUpperCase()}${h.lane.slice(1)} lane`, f = (h) => h < 60 ? `${h} s` : `${Math.round(h / 60)} min`;
    return (h, g) => (r(), d("section", J8, [
      m("div", Z8, [
        m("label", null, [
          g[3] || (g[3] = G("Class ", -1)),
          Ve(m("select", {
            "onUpdate:modelValue": g[0] || (g[0] = (y) => n.value = y),
            "data-lanes-class": ""
          }, [
            g[2] || (g[2] = m("option", { value: "" }, "Every class", -1)),
            (r(!0), d(q, null, ne(s.value, (y) => (r(), d("option", {
              key: y,
              value: y
            }, v(y), 9, e3))), 128))
          ], 512), [
            [Ao, n.value]
          ])
        ]),
        m("label", null, [
          g[5] || (g[5] = G("Started by ", -1)),
          Ve(m("select", {
            "onUpdate:modelValue": g[1] || (g[1] = (y) => a.value = y),
            "data-lanes-starter": ""
          }, [
            g[4] || (g[4] = m("option", { value: "" }, "Anyone", -1)),
            (r(!0), d(q, null, ne(o.value, (y) => (r(), d("option", {
              key: y,
              value: y
            }, v(y), 9, t3))), 128))
          ], 512), [
            [Ao, a.value]
          ])
        ])
      ]),
      (r(!0), d(q, null, ne(i.value, (y) => (r(), d("div", {
        key: y.lane,
        class: "lane",
        "data-lane": y.lane
      }, [
        m("h2", null, [
          G(v(c(y)) + " ", 1),
          m("span", {
            class: Y(["room", { over: y.over_capacity }])
          }, [
            G(v(y.used) + " of " + v(y.capacity) + " in use", 1),
            y.over_capacity ? (r(), d(q, { key: 0 }, [
              G(", over capacity")
            ], 64)) : k("", !0),
            y.halted ? (r(), d(q, { key: 1 }, [
              G(", halted")
            ], 64)) : k("", !0)
          ], 2)
        ]),
        !y.running.length && !y.waiting.length ? (r(), d("p", a3, "Nothing runs or waits here.")) : k("", !0),
        m("ul", null, [
          (r(!0), d(q, null, ne(y.running, (b, M) => (r(), d("li", {
            key: `run:${M}`,
            class: Y({ child: b.parent_line }),
            "data-lane-entry": "running"
          }, [
            m("span", s3, v(b.line), 1),
            m("span", o3, [
              G(v(b.class) + ", " + v(b.priority) + ", " + v(b.starter) + ", running " + v(f(b.seconds)), 1),
              b.parent_line ? (r(), d(q, { key: 0 }, [
                G(", for " + v(b.parent_line), 1)
              ], 64)) : k("", !0)
            ])
          ], 2))), 128)),
          (r(!0), d(q, null, ne(y.waiting, (b, M) => (r(), d("li", {
            key: `wait:${M}`,
            class: "waiting",
            "data-lane-entry": "waiting"
          }, [
            m("span", l3, v(b.line), 1),
            m("span", i3, [
              G(v(b.class) + ", " + v(b.priority) + ", " + v(b.starter) + ", waiting " + v(f(b.seconds)) + ": " + v(b.reason), 1),
              b.raised_from ? (r(), d(q, { key: 0 }, [
                G(". Raised from " + v(b.raised_from), 1)
              ], 64)) : k("", !0)
            ])
          ]))), 128))
        ])
      ], 8, n3))), 128)),
      m("div", r3, [
        g[6] || (g[6] = m("h2", null, "Waits over the last hour", -1)),
        u.value.length ? k("", !0) : (r(), d("p", u3, "No run started in the last hour.")),
        (r(!0), d(q, null, ne(u.value, (y) => (r(), d("p", {
          key: y.priority,
          class: "wait"
        }, v(y.priority) + ": " + v(y.runs) + " started, longest wait " + v(f(y.longest_seconds)) + ", average " + v(f(y.average_seconds)), 1))), 128))
      ])
    ]));
  }
}, d3 = /* @__PURE__ */ z(c3, [["__scopeId", "data-v-4a25d644"]]), f3 = {
  class: "process-queue",
  "data-test-queue": ""
}, h3 = {
  key: 0,
  class: "lead"
}, m3 = { class: "scroll" }, p3 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, g3 = ["data-queue-empty"], rs = 20, v3 = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 }, agent: { type: Number, default: 0 } },
  setup(e) {
    const t = e, n = x(() => t.agent ? ["--agent", `row:${t.agent}`] : []), a = C(null), s = C(""), o = C([]), l = C(rs), i = x(() => {
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
      ...b.rows.length ? b.rows.map((M, _) => ({ key: `run:${M.id}`, run: M, position: _ + 1 })) : [{ key: `none:${b.type}`, section: b, empty: !0 }]
    ]) : []);
    function f(y) {
      o.value = o.value.includes(y) ? o.value.filter((b) => b !== y) : [...o.value, y];
    }
    async function h() {
      const y = ++u, b = await t.read([...l.value === rs ? ["queue", "list"] : ["queue", "list", "--recent", String(l.value)], ...n.value]);
      y === u && (s.value = b.ok ? "" : b.error, b.ok && (a.value = b.value));
    }
    function g() {
      l.value += rs, h();
    }
    return _n(["process.*", "setting.*"], h), _e(h), (y, b) => (r(), d("article", f3, [
      e.agent ? k("", !0) : (r(), d("p", h3, "Commands from workers wait here for a free place. Reading and editing never wait.")),
      m("div", m3, [
        s.value ? (r(), d("p", p3, v(s.value), 1)) : k("", !0),
        a.value ? (r(), d(q, { key: 1 }, [
          e.agent ? k("", !0) : (r(), j(R8, {
            key: 0,
            queue: a.value,
            read: e.read,
            onSaved: h
          }, null, 8, ["queue", "read"])),
          a.value.execution && !e.agent ? (r(), j(d3, {
            key: 1,
            execution: a.value.execution
          }, null, 8, ["execution"])) : k("", !0),
          A(js, {
            name: "queue",
            tag: "div",
            class: "queue-list"
          }, {
            default: P(() => [
              (r(!0), d(q, null, ne(c.value, (M) => (r(), d(q, {
                key: M.key
              }, [
                M.run ? (r(), j(X8, {
                  key: 0,
                  run: M.run,
                  environment: a.value.environment_name,
                  position: M.position,
                  read: e.read,
                  expanded: o.value.includes(M.run.id),
                  onToggle: (_) => f(M.run.id)
                }, null, 8, ["run", "environment", "position", "read", "expanded", "onToggle"])) : M.empty ? (r(), d("p", {
                  key: 1,
                  class: "empty",
                  "data-queue-empty": M.section.type
                }, v(M.section.empty), 9, g3)) : (r(), j(zt, {
                  key: 2,
                  class: "sticky-band",
                  icon: M.section.icon,
                  count: M.section.rows.length,
                  "data-queue-heading": M.section.type
                }, {
                  default: P(() => [
                    G(v(M.section.heading), 1)
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
            onClick: g
          }, "Show older commands")) : k("", !0)
        ], 64)) : s.value ? k("", !0) : (r(), j(Xe, { key: 2 }))
      ])
    ]));
  }
}, bE = /* @__PURE__ */ z(v3, [["__scopeId", "data-v-20a5e555"]]), y3 = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, b3 = ["aria-expanded"], k3 = {
  class: "links-count",
  "data-inspector-links-count": ""
}, w3 = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, $3 = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, x3 = {
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
    const t = e, n = C(t.open), a = C(0), s = C(0), o = C("");
    let l = 0;
    async function i() {
      const u = ++l, c = ["link", "list", "--row", `${t.model}:${t.id}`, "--group-counterparts", ...t.outsidePlan ? ["--outside-plan"] : [], "--page-size", "1"], f = await t.read(c);
      u === l && (o.value = f.ok ? "" : f.error, f.ok && (a.value = f.value.total), s.value += 1);
    }
    return pe(() => `${t.model}:${t.id}`, () => {
      n.value = t.open, a.value = 0, i();
    }, { immediate: !0 }), _n(["link.*", "phase.*", "phase_task.*"], i), (u, c) => (r(), d(q, null, [
      a.value ? (r(), d("section", y3, [
        m("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (f) => n.value = !n.value)
        }, [
          c[2] || (c[2] = m("span", { class: "links-label" }, "Links", -1)),
          m("span", k3, v(a.value), 1),
          A(Qt, { open: n.value }, null, 8, ["open"])
        ], 8, b3),
        m("div", {
          class: Y(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (r(), d("div", w3, [
            A(cd, {
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
      o.value ? (r(), d("p", $3, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, S3 = /* @__PURE__ */ z(x3, [["__scopeId", "data-v-a4550728"]]), M3 = ["placeholder"], _3 = { class: "actions" }, C3 = { class: "error" }, E3 = {
  key: 1,
  class: "card closed"
}, A3 = { class: "mark" }, O3 = { class: "prompt" }, T3 = {
  key: 0,
  class: "draft"
}, I3 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Ft({
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
  emits: /* @__PURE__ */ Ft(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = un(e, "draft"), l = un(e, "error"), i = C(!!l.value), u = C(!1), c = C(!1), f = C(null);
    async function h() {
      var b, M;
      i.value = !0, u.value = !1, await Fe(), (M = ((b = f.value) == null ? void 0 : b.querySelector("input")) || f.value) == null || M.focus();
    }
    function g() {
      i.value = !1, l.value = "";
    }
    async function y() {
      const b = o.value.trim();
      if (!(!b || !a.ready || c.value)) {
        l.value = "", c.value = !0, o.value = "";
        try {
          await a.send(b), i.value = !1, u.value = !0;
        } catch (M) {
          o.value = b, l.value = M.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: h }), (b, M) => (r(), d("div", {
      class: Y(["comment-bar", { open: i.value }])
    }, [
      i.value ? (r(), d("form", {
        key: 0,
        class: "card compose",
        onSubmit: xe(y, ["prevent"]),
        onKeydown: Et(g, ["esc"])
      }, [
        re(b.$slots, "who", {}, void 0, !0),
        Ve(m("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": M[0] || (M[0] = (_) => o.value = _),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: M[1] || (M[1] = Et((_) => R(er)(_, y), ["enter"]))
        }, null, 40, M3), [
          [ta, o.value]
        ]),
        m("div", _3, [
          m("span", C3, v(l.value), 1),
          A(ge, {
            small: "",
            onClick: g
          }, {
            default: P(() => [...M[3] || (M[3] = [
              G("Cancel", -1)
            ])]),
            _: 1
          }),
          A(ge, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: y
          }, {
            default: P(() => [...M[4] || (M[4] = [
              G("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (r(), d("div", E3, [
        m("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: h
        }, [
          m("span", A3, [
            A(le, {
              name: u.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", O3, v(u.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (r(), d("span", T3, "Draft kept")) : k("", !0)
        ]),
        e.count ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: M[2] || (M[2] = (_) => s("show"))
        }, [
          m("span", null, v(R(fd)(e.count, "comment")), 1),
          A(le, {
            name: "down",
            size: 12
          })
        ])) : k("", !0)
      ]))
    ], 2));
  }
}, B3 = /* @__PURE__ */ z(I3, [["__scopeId", "data-v-b68baddd"]]), R3 = { wide: 1130 }, N3 = /\{([A-Za-z_]\w*)\}/g;
function ea(e, t, n = {}) {
  return e.replace(N3, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const L3 = (e, t, n, a) => ea(e.label, n, { row_id: a, id: a }) || Z2(t, n, a), q3 = { class: "comment-side-head" }, D3 = {
  key: 0,
  class: "comment-none"
}, P3 = { key: 0 }, j3 = {
  key: 1,
  class: "comment-none"
}, F3 = {
  class: "comment",
  "data-comment": ""
}, W3 = {
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
      m("header", q3, [
        n[2] || (n[2] = m("h3", null, "Comments", -1)),
        A(ya, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (r(), d("p", D3, "No comments yet")) : k("", !0),
      (r(!0), d(q, null, ne(e.comments, (a) => (r(), d("section", {
        key: a.id
      }, [
        a.quote ? (r(), d("blockquote", P3, v(a.quote), 1)) : k("", !0),
        a.revision ? (r(), d("span", j3, "Revision " + v(a.revision), 1)) : k("", !0),
        m("p", F3, v(e.words(a)), 1)
      ]))), 128)),
      A($n, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, jl = /* @__PURE__ */ z(W3, [["__scopeId", "data-v-276284a3"]]), H3 = { class: "resource-heading" }, z3 = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, U3 = {
  key: 1,
  class: "resource-abstract"
}, G3 = {
  __name: "ResourceHeading",
  props: { title: String, abstract: String },
  setup(e) {
    return (t, n) => (r(), d("div", H3, [
      e.title ? (r(), d("h2", z3, v(e.title), 1)) : k("", !0),
      e.abstract ? (r(), d("p", U3, v(e.abstract), 1)) : k("", !0)
    ]));
  }
}, V3 = /* @__PURE__ */ z(G3, [["__scopeId", "data-v-d65ef53f"]]), K3 = {
  class: "inspector-head",
  "data-inspector-head": ""
}, Y3 = { class: "inspector-icons" }, Q3 = { class: "inspector-icons-start" }, X3 = {
  key: 0,
  class: "inspector-band-title",
  "data-resource-title": ""
}, J3 = {
  key: 1,
  class: "inspector-label",
  "data-resource-type": ""
}, Z3 = { class: "inspector-icons-end" }, eS = ["href"], tS = {
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
    return (u, c) => (r(), d("header", K3, [
      m("div", Y3, [
        m("span", Q3, [
          e.backed ? (r(), j(ge, {
            key: 0,
            variant: "icon",
            title: "Back",
            "aria-label": "Back",
            "data-resource-back": "",
            onClick: c[0] || (c[0] = (f) => a("back"))
          }, {
            default: P(() => [
              A(le, {
                name: "back",
                size: 13
              })
            ]),
            _: 1
          })) : k("", !0),
          e.stepped ? (r(), d(q, { key: 1 }, [
            A(ge, {
              variant: "icon",
              title: "Previous",
              "aria-label": "Previous",
              "data-inspector-step": "previous",
              onClick: c[1] || (c[1] = (f) => a("step", -1))
            }, {
              default: P(() => [
                A(le, {
                  name: "up",
                  size: 13
                })
              ]),
              _: 1
            }),
            A(ge, {
              variant: "icon",
              title: "Next",
              "aria-label": "Next",
              "data-inspector-step": "next",
              onClick: c[2] || (c[2] = (f) => a("step", 1))
            }, {
              default: P(() => [
                A(le, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : k("", !0)
        ]),
        l.value ? (r(), d("h2", X3, v(e.title), 1)) : (r(), d("p", J3, v(e.label), 1)),
        m("span", Z3, [
          e.embedded ? (r(), j(ge, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: c[3] || (c[3] = (f) => R(je)(s.value))
          }, {
            default: P(() => [
              A(le, {
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
            href: R(gh)(s.value)
          }, [
            A(le, {
              name: "share",
              size: 13
            })
          ], 8, eS)) : k("", !0),
          e.embedded ? k("", !0) : (r(), j(ge, {
            key: 2,
            variant: "icon",
            title: i.value,
            "aria-label": i.value,
            "data-resource-close": "",
            onClick: c[4] || (c[4] = (f) => a("close"))
          }, {
            default: P(() => [
              A(le, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          }, 8, ["title", "aria-label"]))
        ])
      ]),
      A(V3, {
        title: l.value ? "" : e.title,
        abstract: e.description
      }, null, 8, ["title", "abstract"])
    ]));
  }
}, nS = /* @__PURE__ */ z(tS, [["__scopeId", "data-v-f7878e15"]]), aS = {
  class: "section field-grid",
  "data-resource-fields": ""
}, sS = { class: "field-name" }, oS = {
  key: 1,
  class: "field-value"
}, lS = ["onClick"], iS = {
  key: 2,
  class: "field-value"
}, rS = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", aS, [
      (r(!0), d(q, null, ne(e.fields, (o) => (r(), d(q, {
        key: o.name
      }, [
        m("p", sS, v(o.label), 1),
        o.isTime ? (r(), j(nt, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (r(), d("p", oS, [
          m("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, v(o.value), 9, lS)
        ])) : (r(), d("p", iS, v(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, uS = /* @__PURE__ */ z(rS, [["__scopeId", "data-v-7e45afb5"]]);
async function cS(e, t) {
  const n = t.creator_id ? ["--creator", String(t.creator_id)] : [], a = t.agent_id ? ["--owner", String(t.agent_id)] : [];
  if (!n.length && !a.length) return { creator: "", owner: "" };
  const s = await e(["agent", "people", ...n, ...a]);
  return s.ok ? { creator: e$(s.value.actor, s.value.creator_agent), owner: a.length ? t$(t, s.value.owner) : "" } : { creator: "", owner: "" };
}
const dS = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, fS = {
  key: 1,
  class: "inspector-wait"
}, hS = { class: "inspector-main" }, mS = { class: "inspector-column" }, pS = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, gS = {
  class: "inspector-body",
  "data-inspector-body": ""
}, vS = { class: "inspector-text" }, yS = ["innerHTML"], bS = {
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
    const n = e, a = t, s = C(null);
    Ps(ri, x(() => {
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
    }), i = C(null), u = C(""), c = C(""), f = C(""), h = C("details"), g = C(null), y = C(0);
    let b = 0;
    const M = x(() => ({ row_id: n.id, id: n.id })), _ = x(() => i.value ? ea(l.value.title, i.value, M.value) || J2(n.term, i.value, n.id) : ""), S = x(() => i.value ? L3(l.value, n.term, i.value, n.id) : ""), T = x(() => S.value === _.value ? "" : S.value), H = x(() => i.value ? ea(l.value.description, i.value, M.value) : ""), W = x(() => {
      var F, U, J;
      return ((F = i.value) == null ? void 0 : F.body) || ((U = i.value) == null ? void 0 : U.brief) || (o.has(n.term) ? (J = i.value) == null ? void 0 : J.text : "") || "";
    }), I = x(() => W.value ? ao(W.value, { env: "", rowNames: !1 }) : ""), V = x(() => n$(i.value, W.value, u.value, c.value)), L = x(() => l.value.comments && y.value >= R3.wide), E = x(() => l.value.comments && !L.value), N = (F) => l.value.components.filter((U) => (U.tab || "") === F).map((U) => U.window), D = x(() => [...new Set(l.value.components.map((F) => F.tab).filter(Boolean))]), w = x(() => D.value.length || E.value ? [{ key: "details", label: "Details" }, ...D.value.map((F) => ({ key: F, label: F })), ...E.value ? [{ key: "comments", label: "Comments" }] : []] : []), p = x(() => {
      const F = l.value.links;
      return F ? { categories: F.categories, open: F.open, outsidePlan: F.excludes_plan, pageSize: F.page_size } : null;
    }), $ = lr(() => l.value.comments && i.value ? { term: n.term, id: n.id, title: i.value.title } : {}, (F) => n.read(F));
    async function O() {
      const F = ++b, U = await n.read(ea(l.value.reads, null, M.value).split(/\s+/).filter(Boolean));
      if (F !== b || (f.value = U.ok ? "" : U.error, !U.ok)) return;
      i.value = U.value;
      const J = await cS(n.read, i.value);
      F === b && (u.value = J.creator, c.value = J.owner);
    }
    pe(() => `${n.term}:${n.id}`, () => {
      i.value = null, u.value = "", c.value = "", f.value = "", h.value = "details", O();
    }, { immediate: !0 }), _n(l.value.events, O), pe($.open, (F) => F && E.value && (h.value = "comments"));
    let B = null;
    return _e(() => {
      var F;
      y.value = ((F = g.value) == null ? void 0 : F.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (B = new ResizeObserver(() => y.value = g.value.clientWidth), B.observe(g.value));
    }), Ne(() => B == null ? void 0 : B.disconnect()), (F, U) => (r(), d("aside", {
      ref_key: "root",
      ref: g,
      class: "inspector",
      "data-inspector": ""
    }, [
      A(nS, {
        label: T.value,
        title: _.value,
        description: H.value,
        backed: e.backed,
        stepped: e.stepped,
        embedded: e.embedded,
        shareable: l.value.shareable,
        "read-only": e.readOnly,
        opened: { table: e.table || `${e.term}s`, id: e.id },
        onClose: U[0] || (U[0] = (J) => a("close")),
        onBack: U[1] || (U[1] = (J) => a("back")),
        onStep: U[2] || (U[2] = (J) => a("step", J))
      }, null, 8, ["label", "title", "description", "backed", "stepped", "embedded", "shareable", "read-only", "opened"]),
      f.value ? (r(), d("p", dS, v(f.value), 1)) : i.value ? (r(), d(q, { key: 2 }, [
        A(Cs, {
          ref_key: "actionBar",
          ref: s
        }, {
          default: P(() => [
            A(eo, {
              name: `row.${e.term}`,
              row: { ...i.value, id: e.id, term: e.term },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: O
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }, 512),
        m("div", hS, [
          m("div", mS, [
            w.value.length ? (r(), d("div", pS, [
              A(Wt, {
                options: w.value,
                value: h.value,
                onPick: U[3] || (U[3] = (J) => h.value = J)
              }, null, 8, ["options", "value"])
            ])) : k("", !0),
            m("div", gS, [
              A(Kt, { value: h.value }, {
                details: P(() => [
                  m("div", vS, [
                    I.value && !l.value.draws_text ? (r(), d("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: I.value
                    }, null, 8, yS)) : k("", !0),
                    l.value.lists_fields ? (r(), j(uS, {
                      key: 1,
                      fields: V.value,
                      onPeek: U[4] || (U[4] = (J) => a("open", J))
                    }, null, 8, ["fields"])) : k("", !0)
                  ]),
                  A(Ms, {
                    "slot-name": `inspector.${e.term}`,
                    names: N(""),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: P(() => [
                  A(jl, {
                    below: "",
                    comments: R($).comments.value,
                    words: R($).words,
                    more: !!R($).nextPage.value,
                    loading: R($).loading.value,
                    failure: R($).failure.value,
                    onMore: R($).loadMore,
                    onClose: U[5] || (U[5] = (J) => h.value = "details")
                  }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
                ]),
                default: P(() => [
                  A(Ms, {
                    names: N(h.value),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              p.value ? (r(), j(S3, De({
                key: 0,
                model: e.term,
                id: e.id,
                read: e.read
              }, p.value, {
                onOpen: U[6] || (U[6] = (J) => a("open", J))
              }), null, 16, ["model", "id", "read"])) : k("", !0)
            ]),
            l.value.comments ? (r(), j(B3, {
              key: 1,
              send: R($).send,
              count: R($).total.value,
              onShow: U[7] || (U[7] = (J) => E.value && (h.value = "comments"))
            }, null, 8, ["send", "count"])) : k("", !0)
          ]),
          L.value ? (r(), j(jl, {
            key: 0,
            comments: R($).comments.value,
            words: R($).words,
            more: !!R($).nextPage.value,
            loading: R($).loading.value,
            failure: R($).failure.value,
            onMore: R($).loadMore,
            onClose: () => {
            }
          }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])) : k("", !0)
        ])
      ], 64)) : (r(), d("div", fS, [
        A(Xe)
      ]))
    ], 512));
  }
}, kS = /* @__PURE__ */ z(bS, [["__scopeId", "data-v-60363e95"]]), kE = {
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
    const t = Me(Ys);
    return (n, a) => (r(), j(kS, De(n.$props, {
      catalogue: R(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, wS = { class: "facts" }, $S = { class: "fact wide" }, xS = ["title"], SS = {
  key: 1,
  class: "fact-value"
}, MS = {
  key: 0,
  class: "fact"
}, _S = { class: "fact-value" }, CS = { class: "fact" }, ES = { class: "fact-label" }, AS = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, OS = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, TS = {
  key: 2,
  class: "fact"
}, IS = { class: "fact-value" }, BS = { class: "fact wide" }, RS = { class: "fact-label" }, NS = { class: "fact wide" }, LS = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, qS = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = ia.map(({ key: l, label: i }) => ({ key: String(l), label: i })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, i) => {
      var u, c;
      return r(), d("div", wS, [
        m("div", $S, [
          i[4] || (i[4] = m("span", { class: "fact-label" }, "Plan", -1)),
          (u = e.place) != null && u.plan_id ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: i[0] || (i[0] = (f) => R(je)(`plans:${e.place.plan_id}`))
          }, "Plan " + v(e.place.plan_id) + ": " + v(e.place.plan_title), 9, xS)) : (r(), d("span", SS, "Not in a plan"))
        ]),
        ((c = e.place) == null ? void 0 : c.phase_total) > 1 ? (r(), d("div", MS, [
          i[5] || (i[5] = m("span", { class: "fact-label" }, "Phase", -1)),
          m("span", _S, v(e.place.phase_number) + " of " + v(e.place.phase_total) + ": " + v(e.place.phase_title), 1)
        ])) : k("", !0),
        e.task.helper_id ? (r(), d(q, { key: 1 }, [
          m("div", CS, [
            m("span", ES, v(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            A(hn, {
              as: "button",
              "agent-id": e.task.helper_id,
              label: R(lo)(e.task.helper_name, e.task.helper_main),
              class: "fact-value agent-link",
              "data-task-agent": "",
              onClick: i[1] || (i[1] = (f) => R(je)(`agents:${e.task.helper_id}`))
            }, {
              default: P(() => [
                A(Pt, {
                  name: e.task.helper_name,
                  main: e.task.helper_main
                }, null, 8, ["name", "main"])
              ]),
              _: 1
            }, 8, ["agent-id", "label"])
          ]),
          R(o).has(e.task.state) && e.task.holder_id ? (r(), d("p", AS, [
            A(Pt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[6] || (i[6] = G(" holds it: merging its work finishes it, and releasing the worker opens it again.", -1))
          ])) : e.task.state === "open" ? (r(), d("p", OS, [
            A(Pt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[7] || (i[7] = G(" takes it after the task it is on.", -1))
          ])) : k("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (r(), d("div", TS, [
          i[8] || (i[8] = m("span", { class: "fact-label" }, "Assigned to", -1)),
          m("span", IS, "Agent " + v(e.task.holder_id), 1)
        ])) : k("", !0),
        m("div", BS, [
          m("span", RS, [
            i[9] || (i[9] = G(" Complexity ", -1)),
            A(ki, {
              lines: R(hr).map((f, h) => `${h + 1}: ${f}`),
              label: "What the scores mean"
            }, null, 8, ["lines"])
          ]),
          A(Wt, {
            options: R(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: i[2] || (i[2] = (f) => s("complexity", f))
          }, null, 8, ["options", "value"])
        ]),
        m("div", NS, [
          i[10] || (i[10] = m("span", { class: "fact-label" }, "Priority", -1)),
          A(Wt, {
            options: R(n),
            value: String(R(fr)(e.task.priority)),
            "data-task-priority": "",
            onPick: i[3] || (i[3] = (f) => s("priority", f))
          }, null, 8, ["options", "value"]),
          e.refusal ? (r(), d("p", LS, v(e.refusal), 1)) : k("", !0)
        ])
      ]);
    };
  }
}, DS = /* @__PURE__ */ z(qS, [["__scopeId", "data-v-4bf27961"]]);
function PS(e, t) {
  const n = new Map(t.tasks.map((u) => [u.id, u])), a = (u) => t.edges.filter(([, c]) => c === u).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let u = a(e); u.length; u = [...new Set(u.flatMap(a))].filter((c) => !s.has(c)))
    u.forEach((c) => s.add(c)), o.push(u.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let u = t.edges.find(([c]) => c === e); u && !i.has(u[1]); u = t.edges.find(([c]) => c === u[1]))
    i.add(u[1]), l.push(n.get(u[1]));
  return { above: o.reverse(), below: l };
}
const jS = { class: "number" }, FS = { class: "title" }, WS = { class: "word" }, HS = {
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
    return (a, s) => (r(), j(Ye(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: Y(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: P(() => [
        A(wa, { status: e.status }, null, 8, ["status"]),
        m("span", jS, v(e.number), 1),
        m("span", FS, v(e.title), 1),
        m("span", WS, v(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, us = /* @__PURE__ */ z(HS, [["__scopeId", "data-v-f6417ae8"]]), zS = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, US = { class: "level" }, GS = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(!1);
    pe(() => n.task.id, () => s.value = !1);
    const o = x(() => PS(n.task.id, n.graph)), l = x(() => s.value ? o.value.above : o.value.above.slice(-1)), i = x(() => s.value ? o.value.below : o.value.below.slice(0, 1)), u = x(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (h) => h.slice(0, 1).toUpperCase() + h.slice(1), f = (h, g = !1) => ({ status: mn(h.state), number: h.id, title: h.title, word: g ? "This task" : c(h.state), current: g });
    return (h, g) => o.value.above.length || o.value.below.length ? (r(), d("section", zS, [
      g[5] || (g[5] = m("h4", null, "What waits on what", -1)),
      (r(!0), d(q, null, ne(l.value, (y) => (r(), d(q, {
        key: y.map((b) => b.id).join()
      }, [
        m("div", US, [
          (r(!0), d(q, null, ne(y, (b) => (r(), j(us, De({
            key: b.id,
            ref_for: !0
          }, f(b), {
            onSelect: g[0] || (g[0] = (M) => a("select", M))
          }), null, 16))), 128))
        ]),
        g[3] || (g[3] = m("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      A(us, ds(Vl(f(e.task, !0))), null, 16),
      (r(!0), d(q, null, ne(i.value, (y) => (r(), d(q, {
        key: y.id
      }, [
        g[4] || (g[4] = m("div", { class: "waits" }, "↓ waits on", -1)),
        A(us, De({ ref_for: !0 }, f(y), {
          onSelect: g[1] || (g[1] = (b) => a("select", b))
        }), null, 16)
      ], 64))), 128)),
      u.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: g[2] || (g[2] = (y) => s.value = !s.value)
      }, v(s.value ? "Show less" : `Show the whole chain (${u.value} more)`), 1)) : k("", !0)
    ])) : k("", !0);
  }
}, VS = /* @__PURE__ */ z(GS, [["__scopeId", "data-v-79c52417"]]), KS = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, YS = ["datetime"], QS = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (r(), d("section", KS, [
      n[0] || (n[0] = m("h3", null, "Block history", -1)),
      (r(!0), d(q, null, ne(e.renewals, (a) => (r(), d("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        m("time", {
          datetime: a.created_at
        }, v(new Date(a.created_at).toLocaleString()), 9, YS),
        m("p", null, v(a.reason), 1)
      ]))), 128))
    ])) : k("", !0);
  }
}, XS = /* @__PURE__ */ z(QS, [["__scopeId", "data-v-b41f213b"]]), JS = {
  class: "part",
  "data-resource-waits": ""
}, ZS = ["onClick"], e6 = { class: "wait-id" }, t6 = { class: "wait-title" }, n6 = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", JS, [
      m("h4", null, v(e.title), 1),
      (r(!0), d(q, null, ne(e.waits, (o) => (r(), d("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        A(wa, {
          status: R(mn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        m("span", e6, v(o.id), 1),
        m("span", t6, v(o.title), 1)
      ], 8, ZS))), 128))
    ]));
  }
}, Fl = /* @__PURE__ */ z(n6, [["__scopeId", "data-v-8fb2e251"]]), a6 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, s6 = { class: "text" }, o6 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, l6 = 180, i6 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = C(!1), l = x(() => a.task.waits.filter((u) => !n.has(u.state))), i = x(() => a.task.waits.filter((u) => n.has(u.state)));
    return (u, c) => (r(), d(q, null, [
      l.value.length ? (r(), j(Fl, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0),
      e.task.state === "completed" && e.task.outcome ? (r(), d("section", a6, [
        c[3] || (c[3] = m("h4", null, "How it was done", -1)),
        m("p", s6, v(e.task.outcome), 1)
      ])) : k("", !0),
      e.task.brief ? (r(), d("section", o6, [
        c[4] || (c[4] = m("h4", null, "The brief", -1)),
        m("p", {
          class: Y(["text", { clamped: !o.value }])
        }, v(e.task.brief), 3),
        e.task.brief.length > l6 && !o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (f) => o.value = !0)
        }, "Show the whole brief")) : k("", !0)
      ])) : k("", !0),
      i.value.length ? (r(), j(Fl, {
        key: 3,
        title: "Waited on",
        waits: i.value,
        onSelect: c[2] || (c[2] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0)
    ], 64));
  }
}, r6 = /* @__PURE__ */ z(i6, [["__scopeId", "data-v-4a3f1e79"]]), u6 = {
  class: "task-details",
  "data-task-details": ""
}, c6 = { class: "since" }, d6 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, f6 = { class: "text" }, h6 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, m6 = {
  key: 1,
  class: "note"
}, p6 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, g6 = { class: "text" }, v6 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return r(), d("div", u6, [
        m("div", {
          class: Y(["state-line", R(mn)(e.task.state)])
        }, [
          m("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            A(wa, {
              status: R(mn)(e.task.state)
            }, null, 8, ["status"]),
            G(" " + v(a(e.task.state)), 1)
          ]),
          m("span", c6, [
            o[5] || (o[5] = G(" since ", -1)),
            A(nt, {
              at: R(Vh)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (r(), d("section", d6, [
          o[6] || (o[6] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
          m("p", f6, v(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (r(), d("p", h6, "Opens by itself when " + v(e.task.openers.join(" or ")) + ".", 1)) : (r(), d("p", m6, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (r(), d("section", p6, [
          o[7] || (o[7] = m("span", { class: "label" }, "Why it was cancelled", -1)),
          m("p", g6, v(e.task.reason), 1)
        ])) : k("", !0),
        e.graph ? (r(), j(VS, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : k("", !0),
        A(DS, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        A(r6, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        A(XS, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, wE = /* @__PURE__ */ z(v6, [["__scopeId", "data-v-7e73fa21"]]), y6 = 50, b6 = { messages: 25 }, k6 = (e) => b6[e] || y6, w6 = {
  class: "task-log",
  "aria-label": "Task log"
}, $6 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, x6 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, S6 = { class: "entries" }, M6 = ["data-task-log-important"], _6 = ["datetime"], C6 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, E6 = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = C([]), a = C(1), s = C(!0), o = C(!0), l = C("");
    let i = 0;
    async function u(c = 1) {
      const f = ++i;
      a.value = c, o.value = !0, l.value = "";
      const h = await t.read([
        "task-log",
        "list",
        "--task",
        String(t.id),
        "--limit",
        String(k6("task_logs")),
        "--page",
        String(c)
      ]);
      f === i && (o.value = !1, l.value = h.ok ? "" : h.error, h.ok && (n.value = h.value.rows, s.value = h.value.is_last_page));
    }
    return pe(
      () => [t.id, t.changes],
      () => {
        n.value = [], u();
      },
      { immediate: !0 }
    ), at(() => {
      i += 1;
    }), (c, f) => (r(), d("section", w6, [
      o.value ? (r(), j(Xe, { key: 0 })) : l.value ? (r(), d(q, { key: 1 }, [
        m("p", $6, v(l.value), 1),
        A(ge, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: f[0] || (f[0] = (h) => u(a.value))
        }, {
          default: P(() => [...f[3] || (f[3] = [
            G("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (r(), d(q, { key: 2 }, [
        n.value.length ? k("", !0) : (r(), d("p", x6, "No log entries yet.")),
        m("ol", S6, [
          (r(!0), d(q, null, ne(n.value, (h) => (r(), d("li", {
            key: h.id,
            class: Y(["entry", { important: h.important }]),
            "data-task-log": "",
            "data-task-log-important": h.important ? "" : null
          }, [
            m("time", {
              datetime: h.created_at
            }, v(new Date(h.created_at).toLocaleString()), 9, _6),
            m("p", null, v(h.line), 1)
          ], 10, M6))), 128))
        ]),
        a.value > 1 || !s.value ? (r(), d("nav", C6, [
          A(ge, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: f[1] || (f[1] = (h) => u(a.value - 1))
          }, {
            default: P(() => [...f[4] || (f[4] = [
              G("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          m("span", null, "Page " + v(a.value), 1),
          A(ge, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: f[2] || (f[2] = (h) => u(a.value + 1))
          }, {
            default: P(() => [...f[5] || (f[5] = [
              G("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : k("", !0)
      ], 64))
    ]));
  }
}, $E = /* @__PURE__ */ z(E6, [["__scopeId", "data-v-cfa43bf1"]]);
function A6(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var cs = { exports: {} }, Wl;
function O6() {
  return Wl || (Wl = 1, (function(e, t) {
    var n = (function() {
      var a = function(I, V) {
        var L = 236, E = 17, N = I, D = o[V], w = null, p = 0, $ = null, O = [], B = {}, F = function(X, Z) {
          p = N * 4 + 17, w = (function(K) {
            for (var ee = new Array(K), te = 0; te < K; te += 1) {
              ee[te] = new Array(K);
              for (var ae = 0; ae < K; ae += 1)
                ee[te][ae] = null;
            }
            return ee;
          })(p), U(0, 0), U(p - 7, 0), U(0, p - 7), ue(), oe(), Ae(X, Z), N >= 7 && ke(X), $ == null && ($ = Q(N, D, O)), be($, Z);
        }, U = function(X, Z) {
          for (var K = -1; K <= 7; K += 1)
            if (!(X + K <= -1 || p <= X + K))
              for (var ee = -1; ee <= 7; ee += 1)
                Z + ee <= -1 || p <= Z + ee || (0 <= K && K <= 6 && (ee == 0 || ee == 6) || 0 <= ee && ee <= 6 && (K == 0 || K == 6) || 2 <= K && K <= 4 && 2 <= ee && ee <= 4 ? w[X + K][Z + ee] = !0 : w[X + K][Z + ee] = !1);
        }, J = function() {
          for (var X = 0, Z = 0, K = 0; K < 8; K += 1) {
            F(!0, K);
            var ee = i.getLostPoint(B);
            (K == 0 || X > ee) && (X = ee, Z = K);
          }
          return Z;
        }, oe = function() {
          for (var X = 8; X < p - 8; X += 1)
            w[X][6] == null && (w[X][6] = X % 2 == 0);
          for (var Z = 8; Z < p - 8; Z += 1)
            w[6][Z] == null && (w[6][Z] = Z % 2 == 0);
        }, ue = function() {
          for (var X = i.getPatternPosition(N), Z = 0; Z < X.length; Z += 1)
            for (var K = 0; K < X.length; K += 1) {
              var ee = X[Z], te = X[K];
              if (w[ee][te] == null)
                for (var ae = -2; ae <= 2; ae += 1)
                  for (var de = -2; de <= 2; de += 1)
                    ae == -2 || ae == 2 || de == -2 || de == 2 || ae == 0 && de == 0 ? w[ee + ae][te + de] = !0 : w[ee + ae][te + de] = !1;
            }
        }, ke = function(X) {
          for (var Z = i.getBCHTypeNumber(N), K = 0; K < 18; K += 1) {
            var ee = !X && (Z >> K & 1) == 1;
            w[Math.floor(K / 3)][K % 3 + p - 8 - 3] = ee;
          }
          for (var K = 0; K < 18; K += 1) {
            var ee = !X && (Z >> K & 1) == 1;
            w[K % 3 + p - 8 - 3][Math.floor(K / 3)] = ee;
          }
        }, Ae = function(X, Z) {
          for (var K = D << 3 | Z, ee = i.getBCHTypeInfo(K), te = 0; te < 15; te += 1) {
            var ae = !X && (ee >> te & 1) == 1;
            te < 6 ? w[te][8] = ae : te < 8 ? w[te + 1][8] = ae : w[p - 15 + te][8] = ae;
          }
          for (var te = 0; te < 15; te += 1) {
            var ae = !X && (ee >> te & 1) == 1;
            te < 8 ? w[8][p - te - 1] = ae : te < 9 ? w[8][15 - te - 1 + 1] = ae : w[8][15 - te - 1] = ae;
          }
          w[p - 8][8] = !X;
        }, be = function(X, Z) {
          for (var K = -1, ee = p - 1, te = 7, ae = 0, de = i.getMaskFunction(Z), ce = p - 1; ce > 0; ce -= 2)
            for (ce == 6 && (ce -= 1); ; ) {
              for (var Se = 0; Se < 2; Se += 1)
                if (w[ee][ce - Se] == null) {
                  var Oe = !1;
                  ae < X.length && (Oe = (X[ae] >>> te & 1) == 1);
                  var he = de(ee, ce - Se);
                  he && (Oe = !Oe), w[ee][ce - Se] = Oe, te -= 1, te == -1 && (ae += 1, te = 7);
                }
              if (ee += K, ee < 0 || p <= ee) {
                ee -= K, K = -K;
                break;
              }
            }
        }, se = function(X, Z) {
          for (var K = 0, ee = 0, te = 0, ae = new Array(Z.length), de = new Array(Z.length), ce = 0; ce < Z.length; ce += 1) {
            var Se = Z[ce].dataCount, Oe = Z[ce].totalCount - Se;
            ee = Math.max(ee, Se), te = Math.max(te, Oe), ae[ce] = new Array(Se);
            for (var he = 0; he < ae[ce].length; he += 1)
              ae[ce][he] = 255 & X.getBuffer()[he + K];
            K += Se;
            var We = i.getErrorCorrectPolynomial(Oe), He = c(ae[ce], We.getLength() - 1), Mo = He.mod(We);
            de[ce] = new Array(We.getLength() - 1);
            for (var he = 0; he < de[ce].length; he += 1) {
              var _o = he + Mo.getLength() - de[ce].length;
              de[ce][he] = _o >= 0 ? Mo.getAt(_o) : 0;
            }
          }
          for (var Co = 0, he = 0; he < Z.length; he += 1)
            Co += Z[he].totalCount;
          for (var Ca = new Array(Co), In = 0, he = 0; he < ee; he += 1)
            for (var ce = 0; ce < Z.length; ce += 1)
              he < ae[ce].length && (Ca[In] = ae[ce][he], In += 1);
          for (var he = 0; he < te; he += 1)
            for (var ce = 0; ce < Z.length; ce += 1)
              he < de[ce].length && (Ca[In] = de[ce][he], In += 1);
          return Ca;
        }, Q = function(X, Z, K) {
          for (var ee = f.getRSBlocks(X, Z), te = h(), ae = 0; ae < K.length; ae += 1) {
            var de = K[ae];
            te.put(de.getMode(), 4), te.put(de.getLength(), i.getLengthInBits(de.getMode(), X)), de.write(te);
          }
          for (var ce = 0, ae = 0; ae < ee.length; ae += 1)
            ce += ee[ae].dataCount;
          if (te.getLengthInBits() > ce * 8)
            throw "code length overflow. (" + te.getLengthInBits() + ">" + ce * 8 + ")";
          for (te.getLengthInBits() + 4 <= ce * 8 && te.put(0, 4); te.getLengthInBits() % 8 != 0; )
            te.putBit(!1);
          for (; !(te.getLengthInBits() >= ce * 8 || (te.put(L, 8), te.getLengthInBits() >= ce * 8)); )
            te.put(E, 8);
          return se(te, ee);
        };
        B.addData = function(X, Z) {
          Z = Z || "Byte";
          var K = null;
          switch (Z) {
            case "Numeric":
              K = g(X);
              break;
            case "Alphanumeric":
              K = y(X);
              break;
            case "Byte":
              K = b(X);
              break;
            case "Kanji":
              K = M(X);
              break;
            default:
              throw "mode:" + Z;
          }
          O.push(K), $ = null;
        }, B.isDark = function(X, Z) {
          if (X < 0 || p <= X || Z < 0 || p <= Z)
            throw X + "," + Z;
          return w[X][Z];
        }, B.getModuleCount = function() {
          return p;
        }, B.make = function() {
          if (N < 1) {
            for (var X = 1; X < 40; X++) {
              for (var Z = f.getRSBlocks(X, D), K = h(), ee = 0; ee < O.length; ee++) {
                var te = O[ee];
                K.put(te.getMode(), 4), K.put(te.getLength(), i.getLengthInBits(te.getMode(), X)), te.write(K);
              }
              for (var ae = 0, ee = 0; ee < Z.length; ee++)
                ae += Z[ee].dataCount;
              if (K.getLengthInBits() <= ae * 8)
                break;
            }
            N = X;
          }
          F(!1, J());
        }, B.createTableTag = function(X, Z) {
          X = X || 2, Z = typeof Z > "u" ? X * 4 : Z;
          var K = "";
          K += '<table style="', K += " border-width: 0px; border-style: none;", K += " border-collapse: collapse;", K += " padding: 0px; margin: " + Z + "px;", K += '">', K += "<tbody>";
          for (var ee = 0; ee < B.getModuleCount(); ee += 1) {
            K += "<tr>";
            for (var te = 0; te < B.getModuleCount(); te += 1)
              K += '<td style="', K += " border-width: 0px; border-style: none;", K += " border-collapse: collapse;", K += " padding: 0px; margin: 0px;", K += " width: " + X + "px;", K += " height: " + X + "px;", K += " background-color: ", K += B.isDark(ee, te) ? "#000000" : "#ffffff", K += ";", K += '"/>';
            K += "</tr>";
          }
          return K += "</tbody>", K += "</table>", K;
        }, B.createSvgTag = function(X, Z, K, ee) {
          var te = {};
          typeof arguments[0] == "object" && (te = arguments[0], X = te.cellSize, Z = te.margin, K = te.alt, ee = te.title), X = X || 2, Z = typeof Z > "u" ? X * 4 : Z, K = typeof K == "string" ? { text: K } : K || {}, K.text = K.text || null, K.id = K.text ? K.id || "qrcode-description" : null, ee = typeof ee == "string" ? { text: ee } : ee || {}, ee.text = ee.text || null, ee.id = ee.text ? ee.id || "qrcode-title" : null;
          var ae = B.getModuleCount() * X + Z * 2, de, ce, Se, Oe, he = "", We;
          for (We = "l" + X + ",0 0," + X + " -" + X + ",0 0,-" + X + "z ", he += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', he += te.scalable ? "" : ' width="' + ae + 'px" height="' + ae + 'px"', he += ' viewBox="0 0 ' + ae + " " + ae + '" ', he += ' preserveAspectRatio="xMinYMin meet"', he += ee.text || K.text ? ' role="img" aria-labelledby="' + me([ee.id, K.id].join(" ").trim()) + '"' : "", he += ">", he += ee.text ? '<title id="' + me(ee.id) + '">' + me(ee.text) + "</title>" : "", he += K.text ? '<description id="' + me(K.id) + '">' + me(K.text) + "</description>" : "", he += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', he += '<path d="', Se = 0; Se < B.getModuleCount(); Se += 1)
            for (Oe = Se * X + Z, de = 0; de < B.getModuleCount(); de += 1)
              B.isDark(Se, de) && (ce = de * X + Z, he += "M" + ce + "," + Oe + We);
          return he += '" stroke="transparent" fill="black"/>', he += "</svg>", he;
        }, B.createDataURL = function(X, Z) {
          X = X || 2, Z = typeof Z > "u" ? X * 4 : Z;
          var K = B.getModuleCount() * X + Z * 2, ee = Z, te = K - Z;
          return W(K, K, function(ae, de) {
            if (ee <= ae && ae < te && ee <= de && de < te) {
              var ce = Math.floor((ae - ee) / X), Se = Math.floor((de - ee) / X);
              return B.isDark(Se, ce) ? 0 : 1;
            } else
              return 1;
          });
        }, B.createImgTag = function(X, Z, K) {
          X = X || 2, Z = typeof Z > "u" ? X * 4 : Z;
          var ee = B.getModuleCount() * X + Z * 2, te = "";
          return te += "<img", te += ' src="', te += B.createDataURL(X, Z), te += '"', te += ' width="', te += ee, te += '"', te += ' height="', te += ee, te += '"', K && (te += ' alt="', te += me(K), te += '"'), te += "/>", te;
        };
        var me = function(X) {
          for (var Z = "", K = 0; K < X.length; K += 1) {
            var ee = X.charAt(K);
            switch (ee) {
              case "<":
                Z += "&lt;";
                break;
              case ">":
                Z += "&gt;";
                break;
              case "&":
                Z += "&amp;";
                break;
              case '"':
                Z += "&quot;";
                break;
              default:
                Z += ee;
                break;
            }
          }
          return Z;
        }, Je = function(X) {
          var Z = 1;
          X = typeof X > "u" ? Z * 2 : X;
          var K = B.getModuleCount() * Z + X * 2, ee = X, te = K - X, ae, de, ce, Se, Oe, he = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, We = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, He = "";
          for (ae = 0; ae < K; ae += 2) {
            for (ce = Math.floor((ae - ee) / Z), Se = Math.floor((ae + 1 - ee) / Z), de = 0; de < K; de += 1)
              Oe = "█", ee <= de && de < te && ee <= ae && ae < te && B.isDark(ce, Math.floor((de - ee) / Z)) && (Oe = " "), ee <= de && de < te && ee <= ae + 1 && ae + 1 < te && B.isDark(Se, Math.floor((de - ee) / Z)) ? Oe += " " : Oe += "█", He += X < 1 && ae + 1 >= te ? We[Oe] : he[Oe];
            He += `
`;
          }
          return K % 2 && X > 0 ? He.substring(0, He.length - K - 1) + Array(K + 1).join("▀") : He.substring(0, He.length - 1);
        };
        return B.createASCII = function(X, Z) {
          if (X = X || 1, X < 2)
            return Je(Z);
          X -= 1, Z = typeof Z > "u" ? X * 2 : Z;
          var K = B.getModuleCount() * X + Z * 2, ee = Z, te = K - Z, ae, de, ce, Se, Oe = Array(X + 1).join("██"), he = Array(X + 1).join("  "), We = "", He = "";
          for (ae = 0; ae < K; ae += 1) {
            for (ce = Math.floor((ae - ee) / X), He = "", de = 0; de < K; de += 1)
              Se = 1, ee <= de && de < te && ee <= ae && ae < te && B.isDark(ce, Math.floor((de - ee) / X)) && (Se = 0), He += Se ? Oe : he;
            for (ce = 0; ce < X; ce += 1)
              We += He + `
`;
          }
          return We.substring(0, We.length - 1);
        }, B.renderTo2dContext = function(X, Z) {
          Z = Z || 2;
          for (var K = B.getModuleCount(), ee = 0; ee < K; ee++)
            for (var te = 0; te < K; te++)
              X.fillStyle = B.isDark(ee, te) ? "black" : "white", X.fillRect(ee * Z, te * Z, Z, Z);
        }, B;
      };
      a.stringToBytesFuncs = {
        default: function(I) {
          for (var V = [], L = 0; L < I.length; L += 1) {
            var E = I.charCodeAt(L);
            V.push(E & 255);
          }
          return V;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(I, V) {
        var L = (function() {
          for (var N = T(I), D = function() {
            var oe = N.read();
            if (oe == -1) throw "eof";
            return oe;
          }, w = 0, p = {}; ; ) {
            var $ = N.read();
            if ($ == -1) break;
            var O = D(), B = D(), F = D(), U = String.fromCharCode($ << 8 | O), J = B << 8 | F;
            p[U] = J, w += 1;
          }
          if (w != V)
            throw w + " != " + V;
          return p;
        })(), E = 63;
        return function(N) {
          for (var D = [], w = 0; w < N.length; w += 1) {
            var p = N.charCodeAt(w);
            if (p < 128)
              D.push(p);
            else {
              var $ = L[N.charAt(w)];
              typeof $ == "number" ? ($ & 255) == $ ? D.push($) : (D.push($ >>> 8), D.push($ & 255)) : D.push(E);
            }
          }
          return D;
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
        ], V = 1335, L = 7973, E = 21522, N = {}, D = function(w) {
          for (var p = 0; w != 0; )
            p += 1, w >>>= 1;
          return p;
        };
        return N.getBCHTypeInfo = function(w) {
          for (var p = w << 10; D(p) - D(V) >= 0; )
            p ^= V << D(p) - D(V);
          return (w << 10 | p) ^ E;
        }, N.getBCHTypeNumber = function(w) {
          for (var p = w << 12; D(p) - D(L) >= 0; )
            p ^= L << D(p) - D(L);
          return w << 12 | p;
        }, N.getPatternPosition = function(w) {
          return I[w - 1];
        }, N.getMaskFunction = function(w) {
          switch (w) {
            case l.PATTERN000:
              return function(p, $) {
                return (p + $) % 2 == 0;
              };
            case l.PATTERN001:
              return function(p, $) {
                return p % 2 == 0;
              };
            case l.PATTERN010:
              return function(p, $) {
                return $ % 3 == 0;
              };
            case l.PATTERN011:
              return function(p, $) {
                return (p + $) % 3 == 0;
              };
            case l.PATTERN100:
              return function(p, $) {
                return (Math.floor(p / 2) + Math.floor($ / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(p, $) {
                return p * $ % 2 + p * $ % 3 == 0;
              };
            case l.PATTERN110:
              return function(p, $) {
                return (p * $ % 2 + p * $ % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(p, $) {
                return (p * $ % 3 + (p + $) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + w;
          }
        }, N.getErrorCorrectPolynomial = function(w) {
          for (var p = c([1], 0), $ = 0; $ < w; $ += 1)
            p = p.multiply(c([1, u.gexp($)], 0));
          return p;
        }, N.getLengthInBits = function(w, p) {
          if (1 <= p && p < 10)
            switch (w) {
              case s.MODE_NUMBER:
                return 10;
              case s.MODE_ALPHA_NUM:
                return 9;
              case s.MODE_8BIT_BYTE:
                return 8;
              case s.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + w;
            }
          else if (p < 27)
            switch (w) {
              case s.MODE_NUMBER:
                return 12;
              case s.MODE_ALPHA_NUM:
                return 11;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + w;
            }
          else if (p < 41)
            switch (w) {
              case s.MODE_NUMBER:
                return 14;
              case s.MODE_ALPHA_NUM:
                return 13;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + w;
            }
          else
            throw "type:" + p;
        }, N.getLostPoint = function(w) {
          for (var p = w.getModuleCount(), $ = 0, O = 0; O < p; O += 1)
            for (var B = 0; B < p; B += 1) {
              for (var F = 0, U = w.isDark(O, B), J = -1; J <= 1; J += 1)
                if (!(O + J < 0 || p <= O + J))
                  for (var oe = -1; oe <= 1; oe += 1)
                    B + oe < 0 || p <= B + oe || J == 0 && oe == 0 || U == w.isDark(O + J, B + oe) && (F += 1);
              F > 5 && ($ += 3 + F - 5);
            }
          for (var O = 0; O < p - 1; O += 1)
            for (var B = 0; B < p - 1; B += 1) {
              var ue = 0;
              w.isDark(O, B) && (ue += 1), w.isDark(O + 1, B) && (ue += 1), w.isDark(O, B + 1) && (ue += 1), w.isDark(O + 1, B + 1) && (ue += 1), (ue == 0 || ue == 4) && ($ += 3);
            }
          for (var O = 0; O < p; O += 1)
            for (var B = 0; B < p - 6; B += 1)
              w.isDark(O, B) && !w.isDark(O, B + 1) && w.isDark(O, B + 2) && w.isDark(O, B + 3) && w.isDark(O, B + 4) && !w.isDark(O, B + 5) && w.isDark(O, B + 6) && ($ += 40);
          for (var B = 0; B < p; B += 1)
            for (var O = 0; O < p - 6; O += 1)
              w.isDark(O, B) && !w.isDark(O + 1, B) && w.isDark(O + 2, B) && w.isDark(O + 3, B) && w.isDark(O + 4, B) && !w.isDark(O + 5, B) && w.isDark(O + 6, B) && ($ += 40);
          for (var ke = 0, B = 0; B < p; B += 1)
            for (var O = 0; O < p; O += 1)
              w.isDark(O, B) && (ke += 1);
          var Ae = Math.abs(100 * ke / p / p - 50) / 5;
          return $ += Ae * 10, $;
        }, N;
      })(), u = (function() {
        for (var I = new Array(256), V = new Array(256), L = 0; L < 8; L += 1)
          I[L] = 1 << L;
        for (var L = 8; L < 256; L += 1)
          I[L] = I[L - 4] ^ I[L - 5] ^ I[L - 6] ^ I[L - 8];
        for (var L = 0; L < 255; L += 1)
          V[I[L]] = L;
        var E = {};
        return E.glog = function(N) {
          if (N < 1)
            throw "glog(" + N + ")";
          return V[N];
        }, E.gexp = function(N) {
          for (; N < 0; )
            N += 255;
          for (; N >= 256; )
            N -= 255;
          return I[N];
        }, E;
      })();
      function c(I, V) {
        if (typeof I.length > "u")
          throw I.length + "/" + V;
        var L = (function() {
          for (var N = 0; N < I.length && I[N] == 0; )
            N += 1;
          for (var D = new Array(I.length - N + V), w = 0; w < I.length - N; w += 1)
            D[w] = I[w + N];
          return D;
        })(), E = {};
        return E.getAt = function(N) {
          return L[N];
        }, E.getLength = function() {
          return L.length;
        }, E.multiply = function(N) {
          for (var D = new Array(E.getLength() + N.getLength() - 1), w = 0; w < E.getLength(); w += 1)
            for (var p = 0; p < N.getLength(); p += 1)
              D[w + p] ^= u.gexp(u.glog(E.getAt(w)) + u.glog(N.getAt(p)));
          return c(D, 0);
        }, E.mod = function(N) {
          if (E.getLength() - N.getLength() < 0)
            return E;
          for (var D = u.glog(E.getAt(0)) - u.glog(N.getAt(0)), w = new Array(E.getLength()), p = 0; p < E.getLength(); p += 1)
            w[p] = E.getAt(p);
          for (var p = 0; p < N.getLength(); p += 1)
            w[p] ^= u.gexp(u.glog(N.getAt(p)) + D);
          return c(w, 0).mod(N);
        }, E;
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
        ], V = function(N, D) {
          var w = {};
          return w.totalCount = N, w.dataCount = D, w;
        }, L = {}, E = function(N, D) {
          switch (D) {
            case o.L:
              return I[(N - 1) * 4 + 0];
            case o.M:
              return I[(N - 1) * 4 + 1];
            case o.Q:
              return I[(N - 1) * 4 + 2];
            case o.H:
              return I[(N - 1) * 4 + 3];
            default:
              return;
          }
        };
        return L.getRSBlocks = function(N, D) {
          var w = E(N, D);
          if (typeof w > "u")
            throw "bad rs block @ typeNumber:" + N + "/errorCorrectionLevel:" + D;
          for (var p = w.length / 3, $ = [], O = 0; O < p; O += 1)
            for (var B = w[O * 3 + 0], F = w[O * 3 + 1], U = w[O * 3 + 2], J = 0; J < B; J += 1)
              $.push(V(F, U));
          return $;
        }, L;
      })(), h = function() {
        var I = [], V = 0, L = {};
        return L.getBuffer = function() {
          return I;
        }, L.getAt = function(E) {
          var N = Math.floor(E / 8);
          return (I[N] >>> 7 - E % 8 & 1) == 1;
        }, L.put = function(E, N) {
          for (var D = 0; D < N; D += 1)
            L.putBit((E >>> N - D - 1 & 1) == 1);
        }, L.getLengthInBits = function() {
          return V;
        }, L.putBit = function(E) {
          var N = Math.floor(V / 8);
          I.length <= N && I.push(0), E && (I[N] |= 128 >>> V % 8), V += 1;
        }, L;
      }, g = function(I) {
        var V = s.MODE_NUMBER, L = I, E = {};
        E.getMode = function() {
          return V;
        }, E.getLength = function(w) {
          return L.length;
        }, E.write = function(w) {
          for (var p = L, $ = 0; $ + 2 < p.length; )
            w.put(N(p.substring($, $ + 3)), 10), $ += 3;
          $ < p.length && (p.length - $ == 1 ? w.put(N(p.substring($, $ + 1)), 4) : p.length - $ == 2 && w.put(N(p.substring($, $ + 2)), 7));
        };
        var N = function(w) {
          for (var p = 0, $ = 0; $ < w.length; $ += 1)
            p = p * 10 + D(w.charAt($));
          return p;
        }, D = function(w) {
          if ("0" <= w && w <= "9")
            return w.charCodeAt(0) - 48;
          throw "illegal char :" + w;
        };
        return E;
      }, y = function(I) {
        var V = s.MODE_ALPHA_NUM, L = I, E = {};
        E.getMode = function() {
          return V;
        }, E.getLength = function(D) {
          return L.length;
        }, E.write = function(D) {
          for (var w = L, p = 0; p + 1 < w.length; )
            D.put(
              N(w.charAt(p)) * 45 + N(w.charAt(p + 1)),
              11
            ), p += 2;
          p < w.length && D.put(N(w.charAt(p)), 6);
        };
        var N = function(D) {
          if ("0" <= D && D <= "9")
            return D.charCodeAt(0) - 48;
          if ("A" <= D && D <= "Z")
            return D.charCodeAt(0) - 65 + 10;
          switch (D) {
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
              throw "illegal char :" + D;
          }
        };
        return E;
      }, b = function(I) {
        var V = s.MODE_8BIT_BYTE, L = a.stringToBytes(I), E = {};
        return E.getMode = function() {
          return V;
        }, E.getLength = function(N) {
          return L.length;
        }, E.write = function(N) {
          for (var D = 0; D < L.length; D += 1)
            N.put(L[D], 8);
        }, E;
      }, M = function(I) {
        var V = s.MODE_KANJI, L = a.stringToBytesFuncs.SJIS;
        if (!L)
          throw "sjis not supported.";
        (function(D, w) {
          var p = L(D);
          if (p.length != 2 || (p[0] << 8 | p[1]) != w)
            throw "sjis not supported.";
        })("友", 38726);
        var E = L(I), N = {};
        return N.getMode = function() {
          return V;
        }, N.getLength = function(D) {
          return ~~(E.length / 2);
        }, N.write = function(D) {
          for (var w = E, p = 0; p + 1 < w.length; ) {
            var $ = (255 & w[p]) << 8 | 255 & w[p + 1];
            if (33088 <= $ && $ <= 40956)
              $ -= 33088;
            else if (57408 <= $ && $ <= 60351)
              $ -= 49472;
            else
              throw "illegal char at " + (p + 1) + "/" + $;
            $ = ($ >>> 8 & 255) * 192 + ($ & 255), D.put($, 13), p += 2;
          }
          if (p < w.length)
            throw "illegal char at " + (p + 1);
        }, N;
      }, _ = function() {
        var I = [], V = {};
        return V.writeByte = function(L) {
          I.push(L & 255);
        }, V.writeShort = function(L) {
          V.writeByte(L), V.writeByte(L >>> 8);
        }, V.writeBytes = function(L, E, N) {
          E = E || 0, N = N || L.length;
          for (var D = 0; D < N; D += 1)
            V.writeByte(L[D + E]);
        }, V.writeString = function(L) {
          for (var E = 0; E < L.length; E += 1)
            V.writeByte(L.charCodeAt(E));
        }, V.toByteArray = function() {
          return I;
        }, V.toString = function() {
          var L = "";
          L += "[";
          for (var E = 0; E < I.length; E += 1)
            E > 0 && (L += ","), L += I[E];
          return L += "]", L;
        }, V;
      }, S = function() {
        var I = 0, V = 0, L = 0, E = "", N = {}, D = function(p) {
          E += String.fromCharCode(w(p & 63));
        }, w = function(p) {
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
        return N.writeByte = function(p) {
          for (I = I << 8 | p & 255, V += 8, L += 1; V >= 6; )
            D(I >>> V - 6), V -= 6;
        }, N.flush = function() {
          if (V > 0 && (D(I << 6 - V), I = 0, V = 0), L % 3 != 0)
            for (var p = 3 - L % 3, $ = 0; $ < p; $ += 1)
              E += "=";
        }, N.toString = function() {
          return E;
        }, N;
      }, T = function(I) {
        var V = I, L = 0, E = 0, N = 0, D = {};
        D.read = function() {
          for (; N < 8; ) {
            if (L >= V.length) {
              if (N == 0)
                return -1;
              throw "unexpected end of file./" + N;
            }
            var p = V.charAt(L);
            if (L += 1, p == "=")
              return N = 0, -1;
            if (p.match(/^\s$/))
              continue;
            E = E << 6 | w(p.charCodeAt(0)), N += 6;
          }
          var $ = E >>> N - 8 & 255;
          return N -= 8, $;
        };
        var w = function(p) {
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
        return D;
      }, H = function(I, V) {
        var L = I, E = V, N = new Array(I * V), D = {};
        D.setPixel = function(O, B, F) {
          N[B * L + O] = F;
        }, D.write = function(O) {
          O.writeString("GIF87a"), O.writeShort(L), O.writeShort(E), O.writeByte(128), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(255), O.writeByte(255), O.writeByte(255), O.writeString(","), O.writeShort(0), O.writeShort(0), O.writeShort(L), O.writeShort(E), O.writeByte(0);
          var B = 2, F = p(B);
          O.writeByte(B);
          for (var U = 0; F.length - U > 255; )
            O.writeByte(255), O.writeBytes(F, U, 255), U += 255;
          O.writeByte(F.length - U), O.writeBytes(F, U, F.length - U), O.writeByte(0), O.writeString(";");
        };
        var w = function(O) {
          var B = O, F = 0, U = 0, J = {};
          return J.write = function(oe, ue) {
            if (oe >>> ue)
              throw "length over";
            for (; F + ue >= 8; )
              B.writeByte(255 & (oe << F | U)), ue -= 8 - F, oe >>>= 8 - F, U = 0, F = 0;
            U = oe << F | U, F = F + ue;
          }, J.flush = function() {
            F > 0 && B.writeByte(U);
          }, J;
        }, p = function(O) {
          for (var B = 1 << O, F = (1 << O) + 1, U = O + 1, J = $(), oe = 0; oe < B; oe += 1)
            J.add(String.fromCharCode(oe));
          J.add(String.fromCharCode(B)), J.add(String.fromCharCode(F));
          var ue = _(), ke = w(ue);
          ke.write(B, U);
          var Ae = 0, be = String.fromCharCode(N[Ae]);
          for (Ae += 1; Ae < N.length; ) {
            var se = String.fromCharCode(N[Ae]);
            Ae += 1, J.contains(be + se) ? be = be + se : (ke.write(J.indexOf(be), U), J.size() < 4095 && (J.size() == 1 << U && (U += 1), J.add(be + se)), be = se);
          }
          return ke.write(J.indexOf(be), U), ke.write(F, U), ke.flush(), ue.toByteArray();
        }, $ = function() {
          var O = {}, B = 0, F = {};
          return F.add = function(U) {
            if (F.contains(U))
              throw "dup key:" + U;
            O[U] = B, B += 1;
          }, F.size = function() {
            return B;
          }, F.indexOf = function(U) {
            return O[U];
          }, F.contains = function(U) {
            return typeof O[U] < "u";
          }, F;
        };
        return D;
      }, W = function(I, V, L) {
        for (var E = H(I, V), N = 0; N < V; N += 1)
          for (var D = 0; D < I; D += 1)
            E.setPixel(D, N, L(D, N));
        var w = _();
        E.write(w);
        for (var p = S(), $ = w.toByteArray(), O = 0; O < $.length; O += 1)
          p.writeByte($[O]);
        return p.flush(), "data:image/gif;base64," + p;
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
  })(cs)), cs.exports;
}
var T6 = O6();
const I6 = /* @__PURE__ */ A6(T6), B6 = ["width", "height", "viewBox"], R6 = ["width", "height"], N6 = ["d"], L6 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = x(() => {
      const a = I6(0, "M");
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
      m("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, R6),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, N6)
    ], 8, B6));
  }
}, xE = /* @__PURE__ */ z(L6, [["__scopeId", "data-v-489f0852"]]), q6 = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "window-room",
      "data-window-room": "",
      style: ve({ padding: e.padding })
    }, [
      re(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, SE = /* @__PURE__ */ z(q6, [["__scopeId", "data-v-47e67f04"]]);
function ME(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const _E = gu(() => import("./VoiceFigure-B1f9ZXxA.js").then((e) => e.V)), CE = "1.2.0", EE = "3.5";
export {
  fh as $,
  Te as A,
  Re as B,
  xa as C,
  dt as D,
  AC as E,
  M4 as F,
  b_ as G,
  MC as H,
  o4 as I,
  I4 as J,
  It as K,
  F6 as L,
  bo as M,
  D4 as N,
  T4 as O,
  $a as P,
  U_ as Q,
  JM as R,
  Jn as S,
  Q_ as T,
  zM as U,
  Ie as V,
  ua as W,
  HM as X,
  WM as Y,
  dh as Z,
  z as _,
  RM as a,
  hC as a$,
  L4 as a0,
  ZM as a1,
  e_ as a2,
  Be as a3,
  d_ as a4,
  c_ as a5,
  At as a6,
  t_ as a7,
  x_ as a8,
  xM as a9,
  oC as aA,
  W_ as aB,
  K5 as aC,
  C_ as aD,
  E_ as aE,
  OC as aF,
  Wr as aG,
  Y_ as aH,
  En as aI,
  AM as aJ,
  _M as aK,
  bC as aL,
  An as aM,
  xC as aN,
  y_ as aO,
  H_ as aP,
  z_ as aQ,
  F_ as aR,
  vn as aS,
  _t as aT,
  SM as aU,
  D$ as aV,
  P_ as aW,
  QM as aX,
  jr as aY,
  Ut as aZ,
  Xt as a_,
  mC as aa,
  wC as ab,
  IM as ac,
  UM as ad,
  GM as ae,
  r_ as af,
  u_ as ag,
  f_ as ah,
  DM as ai,
  Il as aj,
  n_ as ak,
  $_ as al,
  RC as am,
  N_ as an,
  B_ as ao,
  I_ as ap,
  h_ as aq,
  l_ as ar,
  o_ as as,
  i_ as at,
  K_ as au,
  w_ as av,
  S_ as aw,
  qC as ax,
  sn as ay,
  M_ as az,
  Y4 as b,
  LC as b$,
  w4 as b0,
  $C as b1,
  Z_ as b2,
  J_ as b3,
  r5 as b4,
  Cr as b5,
  cC as b6,
  k_ as b7,
  _a as b8,
  pt as b9,
  tC as bA,
  iC as bB,
  yt as bC,
  X_ as bD,
  rC as bE,
  __ as bF,
  L_ as bG,
  A_ as bH,
  qe as bI,
  v_ as bJ,
  uC as bK,
  UC as bL,
  GC as bM,
  wM as bN,
  F$ as bO,
  p_ as bP,
  nC as bQ,
  NM as bR,
  BC as bS,
  eC as bT,
  aC as bU,
  sC as bV,
  m_ as bW,
  Y5 as bX,
  g_ as bY,
  T_ as bZ,
  IC as b_,
  lC as ba,
  Xa as bb,
  Fi as bc,
  PC as bd,
  WC as be,
  V_ as bf,
  yC as bg,
  $M as bh,
  R_ as bi,
  jC as bj,
  a_ as bk,
  s_ as bl,
  jM as bm,
  XM as bn,
  EM as bo,
  gC as bp,
  LM as bq,
  qM as br,
  FM as bs,
  D_ as bt,
  B$ as bu,
  SC as bv,
  O4 as bw,
  PM as bx,
  OM as by,
  q_ as bz,
  i5 as c,
  ia as c$,
  CM as c0,
  MM as c1,
  O_ as c2,
  HC as c3,
  So as c4,
  zC as c5,
  au as c6,
  vC as c7,
  KM as c8,
  VM as c9,
  fo as cA,
  VC as cB,
  P6 as cC,
  Qt as cD,
  kf as cE,
  kE as cF,
  Ap as cG,
  ri as cH,
  le as cI,
  ki as cJ,
  iE as cK,
  X6 as cL,
  CE as cM,
  EE as cN,
  cM as cO,
  cE as cP,
  Es as cQ,
  gM as cR,
  B2 as cS,
  Ue as cT,
  Ct as cU,
  va as cV,
  oM as cW,
  dM as cX,
  K6 as cY,
  Nc as cZ,
  h2 as c_,
  q$ as ca,
  TM as cb,
  E4 as cc,
  j_ as cd,
  go as ce,
  H5 as cf,
  G_ as cg,
  on as ch,
  jt as ci,
  Pt as cj,
  nM as ck,
  sM as cl,
  hn as cm,
  lE as cn,
  ge as co,
  Kf as cp,
  eo as cq,
  ya as cr,
  Ry as cs,
  ba as ct,
  yE as cu,
  kM as cv,
  aM as cw,
  qy as cx,
  Gs as cy,
  cn as cz,
  Qe as d,
  Dm as d$,
  vE as d0,
  Z6 as d1,
  eM as d2,
  tM as d3,
  iM as d4,
  bE as d5,
  xE as d6,
  tr as d7,
  cd as d8,
  sE as d9,
  SE as dA,
  ro as dB,
  ZC as dC,
  Fs as dD,
  Bp as dE,
  lo as dF,
  J6 as dG,
  tf as dH,
  Vi as dI,
  Ht as dJ,
  Mn as dK,
  Dd as dL,
  pE as dM,
  mE as dN,
  Vs as dO,
  qd as dP,
  zs as dQ,
  tl as dR,
  gE as dS,
  bM as dT,
  li as dU,
  Sc as dV,
  Mc as dW,
  Kw as dX,
  vM as dY,
  pM as dZ,
  QC as d_,
  tb as da,
  G6 as db,
  yM as dc,
  Hx as dd,
  Wt as de,
  fM as df,
  Xe as dg,
  kt as dh,
  Uv as di,
  yd as dj,
  mp as dk,
  mM as dl,
  V6 as dm,
  Kt as dn,
  uE as dp,
  rE as dq,
  VS as dr,
  wE as ds,
  $E as dt,
  wa as du,
  $f as dv,
  it as dw,
  hM as dx,
  nt as dy,
  _E as dz,
  YM as e,
  KC as e0,
  z6 as e1,
  fE as e2,
  _2 as e3,
  dx as e4,
  fr as e5,
  Y6 as e6,
  uM as e7,
  JC as e8,
  eE as e9,
  gr as eA,
  ci as eB,
  Jx as eC,
  Ws as eD,
  tE as eE,
  fs as eF,
  nE as eG,
  aE as eH,
  st as eI,
  hE as eJ,
  Pd as eK,
  je as ea,
  Np as eb,
  lM as ec,
  qc as ed,
  YC as ee,
  pr as ef,
  XC as eg,
  Ql as eh,
  rM as ei,
  Fp as ej,
  U6 as ek,
  jp as el,
  qa as em,
  H6 as en,
  dn as eo,
  mi as ep,
  jd as eq,
  Q6 as er,
  vt as es,
  ME as et,
  fx as eu,
  j6 as ev,
  W6 as ew,
  oE as ex,
  Qi as ey,
  dE as ez,
  I$ as f,
  DC as g,
  yn as h,
  _C as i,
  FC as j,
  CC as k,
  pC as l,
  ex as m,
  ko as n,
  kC as o,
  BM as p,
  EC as q,
  tu as r,
  nu as s,
  Ee as t,
  c5 as u,
  dC as v,
  NC as w,
  fC as x,
  Tn as y,
  TC as z
};
