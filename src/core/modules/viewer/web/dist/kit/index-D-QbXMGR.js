import { openBlock as r, createElementBlock as d, normalizeStyle as ve, unref as R, renderSlot as re, createElementVNode as m, normalizeClass as Y, Fragment as D, renderList as ne, defineComponent as su, Comment as ou, h as ma, cloneVNode as lu, createBlock as F, withCtx as P, createVNode as E, toDisplayString as v, createCommentVNode as k, ref as C, inject as Me, watch as pe, onMounted as _e, onBeforeUnmount as at, reactive as Gt, shallowRef as et, onUnmounted as Re, useAttrs as pa, computed as S, resolveDynamicComponent as Ke, mergeProps as De, useId as Ds, resolveDirective as iu, withDirectives as tt, createTextVNode as K, Teleport as wn, nextTick as Fe, Transition as Vt, withModifiers as xe, createApp as ru, shallowReactive as uu, withKeys as At, createSlots as Hl, onScopeDispose as ga, useModel as un, mergeModels as Ft, toRef as Aa, vModelText as ta, resolveComponent as cu, provide as Ps, onErrorCaptured as du, TransitionGroup as js, isRef as Ao, getCurrentInstance as fu, getCurrentScope as zl, normalizeProps as ds, guardReactiveProps as Ul, vShow as Gl, useSlots as hu, defineAsyncComponent as mu } from "vue";
function Vl(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const z = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, pu = 1600, gu = {
  __name: "Shimmer",
  setup(e) {
    const t = Vl(pu);
    return (n, a) => (r(), d("span", {
      class: "shimmer",
      style: ve(R(t))
    }, null, 4));
  }
}, nn = /* @__PURE__ */ z(gu, [["__scopeId", "data-v-6c018b03"]]), vu = { class: "skeleton-line" }, yu = 2e3, bu = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = Vl(yu);
    return (n, a) => (r(), d("span", vu, [
      re(n.$slots, "default", {}, void 0, !0),
      m("span", {
        class: Y(["bars", { faded: e.filled }])
      }, [
        (r(!0), d(D, null, ne(e.bars, (s) => (r(), d("span", {
          key: s.width,
          class: Y(["bar", { still: e.still }]),
          style: ve({ ...R(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, kt = /* @__PURE__ */ z(bu, [["__scopeId", "data-v-484fe8a0"]]), Kt = su({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== ou);
      return a.length !== 1 ? ma(D, { key: n }, a) : a[0].key == null ? lu(a[0], { key: n }) : a[0];
    };
  }
}), ku = ["aria-label"], wu = ["aria-label"], $u = ["aria-label"], xu = ["aria-label"], Su = ["aria-label"], Mu = ["aria-label"], _u = ["aria-label"], Cu = {
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
    return (u, c) => (r(), F(Kt, { value: e.shape }, {
      messages: P(() => [
        m("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(), d(D, null, ne(t, (f) => E(nn, {
            key: f.id,
            class: Y(["skeleton-message", { mine: f.mine }]),
            style: ve({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, ku)
      ]),
      older: P(() => [
        m("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(D, null, ne(t.slice(0, 3), (f) => (r(), F(nn, {
            key: f.id,
            class: Y(["skeleton-message", { mine: f.mine }]),
            style: ve({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, wu)
      ]),
      cards: P(() => [
        m("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(D, null, ne(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (r(), d(D, null, ne(n, (h) => E(kt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, $u)
      ]),
      file: P(() => [
        m("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(D, null, ne(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-file"
          }, [
            E(kt, {
              class: "skeleton-file-head",
              bars: a
            }),
            (r(), d(D, null, ne(s, (h) => E(kt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, xu)
      ]),
      page: P(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          E(kt, {
            class: "skeleton-heading",
            bars: i
          }),
          (r(!0), d(D, null, ne(e.count, (f) => (r(), F(kt, {
            key: f,
            bars: R(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Su)
      ]),
      text: P(() => [
        m("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(D, null, ne(e.count, (f) => (r(), F(kt, {
            key: f,
            bars: R(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Mu)
      ]),
      default: P(() => [
        m("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(D, null, ne(e.count, (f) => (r(), F(kt, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, _u)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Qe = /* @__PURE__ */ z(Cu, [["__scopeId", "data-v-ef519c5f"]]), Au = {
  key: 1,
  class: "empty-state titled"
}, Eu = { class: "empty-state-title" }, Ou = { class: "empty-state-text" }, Tu = {
  key: 2,
  class: "empty-state"
}, Iu = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (r(), F(Qe, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (r(), d("div", Au, [
      m("p", Eu, v(e.title), 1),
      m("p", Ou, [
        re(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (r(), d("p", Tu, [
      re(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, cn = /* @__PURE__ */ z(Iu, [["__scopeId", "data-v-b27e89b0"]]), Bu = { class: "fold-group" }, Ru = ["aria-expanded"], Lu = { class: "fold-label" }, Nu = {
  key: 0,
  class: "fold-count"
}, qu = {
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
    return (a, s) => (r(), d("div", Bu, [
      m("button", {
        type: "button",
        class: Y(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        m("span", Lu, v(e.label), 1),
        e.count !== "" ? (r(), d("span", Nu, v(e.count), 1)) : k("", !0),
        m("span", {
          class: Y(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Ru),
      e.open ? re(a.$slots, "default", {}, void 0, !0, 0) : k("", !0)
    ]));
  }
}, $6 = /* @__PURE__ */ z(qu, [["__scopeId", "data-v-9ef1865c"]]), Du = 150, Pu = () => Du;
function Fs(e, t, n = Pu(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function Kl(e, t, n) {
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
const ju = 50, Eo = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function x6(e) {
  const t = st().sources.find((n) => n.key === e);
  return t ? fs(t.read, t.events) : fs("", []);
}
function Yl(e, t, n, a, s = () => !1) {
  const o = C([]), l = C(null), i = C(""), u = C(!1), c = performance.now(), f = C(!1), h = C(""), g = C(null), y = /* @__PURE__ */ new Set();
  let b = null;
  function _(p) {
    return s() ? (y.add(p), b ?? (b = new Promise(($) => setTimeout(() => $(M()), ju)))) : x(p);
  }
  async function M() {
    const p = new Set(y);
    y.clear(), b = null;
    const $ = W, O = await t({ ids: [...p].join(","), limit: p.size });
    if ($ !== W) return;
    if (!O.ok) return A();
    const B = new Map(O.value.rows.map((j) => [j.id, j]));
    o.value = o.value.flatMap((j) => p.has(j.id) ? B.has(j.id) ? [B.get(j.id)] : [] : [j]);
  }
  async function x(p) {
    const $ = W, O = await t({ "before-id": p + 1, limit: 1 });
    if ($ !== W) return;
    if (!O.ok) return A();
    const B = O.value.rows.find((j) => j.id === p);
    o.value = B ? o.value.map((j) => j.id === p ? B : j) : o.value.filter((j) => j.id !== p);
  }
  async function T(p) {
    if (a() && String((p == null ? void 0 : p.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((J) => J.id !== p.row_id));
    if (a() && (p != null && p.row_id) && !String(p.event ?? "").endsWith(".create") && o.value.some((J) => J.id === p.row_id)) return _(p.row_id);
    if (!(a() && o.value.length && String((p == null ? void 0 : p.event) ?? "").endsWith(".create"))) return A();
    const O = Math.max(...o.value.map((J) => J.id)), B = W, j = await t({ "after-id": O });
    if (B !== W) return;
    if (!j.ok) return A();
    const U = new Set(o.value.map((J) => J.id));
    o.value = [...j.value.rows.filter((J) => !U.has(J.id)), ...o.value];
  }
  async function H() {
    if (!f.value || !o.value.length) return !1;
    const p = W, $ = Math.min(...o.value.map((j) => j.id)), O = await t({ "before-id": $ });
    if (p !== W) return !1;
    if (!O.ok || !O.value.rows.length) return f.value = !1;
    f.value = Eo(O.value, n());
    const B = new Set(o.value.map((j) => j.id));
    return o.value = [...o.value, ...O.value.rows.filter((j) => !B.has(j.id))], !0;
  }
  let W = 0;
  function I(p, $) {
    var j, U;
    const O = p.ok ? e.shared ? [p.value] : ((j = p.value) == null ? void 0 : j.rows) ?? [] : [];
    p.ok && (o.value = $(O)), l.value = p.ok ? p.value : null;
    const B = O.length ? Math.min(...O.map((J) => J.id)) : 0;
    p.ok && ((U = p.value) != null && U.rows) && !o.value.some((J) => J.id < B) && (f.value = !e.shared && Eo(p.value, n())), i.value = p.ok ? "" : p.error, Fs(c, () => u.value = !0);
  }
  async function G(p) {
    const $ = ++W, O = await t({});
    $ === W && I(O, p);
  }
  const N = (p) => {
    if (!a() || !p.length) return p;
    const $ = Math.min(...p.map((B) => B.id)), O = Math.max(...p.map((B) => B.id));
    return [...o.value.filter((B) => B.id > O), ...p, ...o.value.filter((B) => B.id < $)];
  }, A = () => G(N), L = (p) => I(p, N), q = () => G((p) => p);
  async function w(p, $ = null) {
    const O = await Kl($ && { target: o, fields: { value: $(o.value) } }, p, e.run);
    return h.value = O.ok ? "" : O.error, g.value = O.ok ? O.value : null, await A(), O;
  }
  return { rows: o, listing: l, failure: i, loaded: u, more: f, load: A, loadLatest: q, older: H, act: w, actionFailure: h, answer: g, context: e, heard: T, showFirst: L, pageSize: n };
}
const Fu = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function fs(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = st(), l = Yl(s, (u) => s.read(s.shared && !Object.keys(u).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Fu(u)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const Wu = 2e3;
function Ws(e, t, n = Wu) {
  let a = null, s = !1, o = !1, l = !1;
  const i = Me(Le, null), u = () => {
    var _;
    return ((_ = i == null ? void 0 : i.visible) == null ? void 0 : _.value) === !1;
  }, c = () => document.hidden || u(), f = async (_) => {
    o = !0;
    try {
      await _();
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
    var _;
    return (_ = i == null ? void 0 : i.visible) == null ? void 0 : _.value;
  }, b), _e(async () => {
    document.addEventListener("visibilitychange", b), u() || await y();
  }), at(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", b);
  });
}
const Ql = typeof document < "u" && document.documentElement.classList.contains("phone"), Xl = 120;
var Fl;
const Ea = globalThis[Fl = Symbol.for("journal.pressed")] ?? (globalThis[Fl] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Hu(e = 0) {
  const t = Ea.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, Ea.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, Ea.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function hs(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Jl(e = window) {
  if (!hs(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    hs(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const ms = "journal.stale-build-reload", zu = 'script[type="module"][src*="/assets/index-"]', Oo = (e) => {
  var t;
  return ((t = e.querySelector(zu)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Uu(e = document, t = (a, s) => Ae.quietRead(a, s), n = () => Jl(window)) {
  const a = Oo(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Oo(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let Oa = "";
function Gu(e, t = () => Jl(window)) {
  if (!e) return !1;
  const n = !!Oa && Oa !== e;
  return Oa = e, n && t(), n;
}
const Vu = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Ku(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(ms) === e.message) return !1;
    t.setItem(ms, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Yu(e = window.sessionStorage) {
  try {
    e.removeItem(ms);
  } catch {
    return;
  }
}
const Qu = 2e3, Xu = 3e4, Ve = Gt({ starting: !1, external: !1, late: !1, offline: !1 }), Hs = () => Ve.starting, Ju = 3;
let Bn = 0, ps = 0, Zl = 0, ei = [];
async function Zu() {
  try {
    const e = await Ae.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ve.external };
  }
}
let To = null;
const ec = () => To ?? (To = Zu().finally(() => To = null));
function tc() {
  clearTimeout(ps), clearTimeout(Zl), ps = 0, Object.assign(Ve, { starting: !1, external: !1, late: !1, offline: !1 }), ei.splice(0).forEach((e) => e()), Uu();
}
async function nc() {
  Ve.offline = !navigator.onLine;
  const e = await ec();
  if (Ve.external = e.updating, Bn = !e.restarting && !e.updating && e.reachable ? Bn + 1 : 0, Bn < Ju) return;
  Bn = 0, (!Gu(e.started_at) || hs()) && tc();
}
function ti() {
  ps = setTimeout(async () => {
    await nc(), Ve.starting && ti();
  }, Qu);
}
function ac() {
  Ve.starting || (Ve.starting = !0, Ve.offline = !navigator.onLine, ti(), Zl = setTimeout(() => Ve.late = !0, Xu));
}
const ni = () => Ve.starting ? new Promise((e) => ei.push(e)) : Promise.resolve();
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
function sc(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class oc {
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = sc(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const ft = "viewer.shell", Rn = 2e4, lc = 4, Io = "/api/read-lines", ic = 5e3, rc = 403, Bo = "/api/repeated-lines", uc = 10, cc = 2e3, dc = 3e5, S6 = 6e5, Ln = 6, fc = 500, hc = "/journal/summary", Ro = "/api/server-state", mc = 2e4, Nn = Ql ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, pc = (e) => e.split("?")[0].endsWith(hc), gs = (e, t) => Object.assign(new Error(t), { status: e });
async function gc(e, t, n = gs) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const vc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), yc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), Lo = (e) => e.split(" ").slice(0, 2).join(" "), lt = "read", Lt = "write", bc = "stream";
class kc {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = Ln;
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = Lo(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one term and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, u]) => o - u < cc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < uc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const i = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(Bo, { method: "POST", headers: { ...Nn, "Content-Type": "application/json" }, body: i }, [{ window: ft, line: Bo, kind: Lt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Hu(n ? Xl : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: yc(n.signal, s) } : n;
    try {
      return await fetch(t, a[0].kind === Lt ? { ...l, priority: "high" } : l);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up
  async sent(t, n, a, s = Rn) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      throw o instanceof TypeError && ac(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= lc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(Io, { headers: Nn }, [{ window: ft, line: Io, kind: lt }], ic).then(async (t) => {
      if (t.status === rc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw gs(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new oc(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = Lo(n.join(" ")), i = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
      this.tries = Ln;
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
    const i = a instanceof FormData, u = { method: t, headers: { ...Nn, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: vc(a) }, c = s || (i ? dc : Rn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, u, [{ window: ft, line: n, kind: lt }], c)) : await this.sent(n, u, [{ window: ft, line: n, kind: Lt }], c);
    } catch (f) {
      if (t !== "GET" || !(f instanceof TypeError) || o <= 1) throw f;
      return await new Promise((h) => setTimeout(h, fc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = Ln, l = {}) {
    this.watcher("sent", t, n, a);
    const i = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return gc(i, `${i.status} ${i.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: ft, line: t, kind: lt }], Rn)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: Nn });
    if (!n.ok) throw gs(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, Ln, o).then((i) => (this.written(n), i)) : Hs() && !pc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: ft, line: t, kind: bc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Ro, { cache: "no-store" }, [{ window: ft, line: Ro, kind: lt }], mc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = ft, line: s = t, limit: o = Rn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? lt : Lt;
    return l === Lt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const Ta = Symbol.for("journal.transport"), Ae = globalThis[Ta] ?? (globalThis[Ta] = new kc());
class ai {
  constructor() {
    this.following = et([]), this.held = /* @__PURE__ */ new Set();
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
    Ae.readsOutdated();
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
const si = (e, t) => !e.row_id || t.has(e.row_id), wc = (e, t, n) => {
  var a;
  return !e.row_id || (((a = e.changed_ids) == null ? void 0 : a[t]) ?? []).some((s) => n.has(s));
}, $c = (e, t, n) => {
  var a, s;
  return !((s = (a = e.changed_ids) == null ? void 0 : a[t]) != null && s.length) || e.changed_ids[t].some((o) => n.has(o));
}, xc = 50, Sc = "refresh", Mc = 1e3, _c = 3e4, Cc = "requested", Ac = "after_window", Ec = 50, qn = ".*", Oc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function Tc(e) {
  const t = {}, n = Gt({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let u = {}, c = 0, f = 0, h = !1;
  const g = (w) => u[w] ?? u[`${w.slice(0, w.lastIndexOf("."))}.*`] ?? {};
  function y(w) {
    const p = () => g(w), $ = C(void 0), O = Yl(e, async (B) => {
      const j = await M(w, B);
      return j.ok && !Object.keys(B).length && ($.value = j.value), j;
    }, () => p().page_size || Ec, () => !!p().page_size, () => !!p().reads_ids);
    return t[w] = { ...O, data: $, readAt: 0 };
  }
  const b = new Proxy({}, { get: (w, p) => typeof p != "string" || p.startsWith("__v") ? void 0 : t[p] ?? y(p) }), _ = (w) => (u[w].loading !== Cc || w.endsWith(qn)) && (!u[w].tab || u[w].tab === n.tab);
  function M(w, p = {}) {
    return new Promise(($) => {
      a.push({ name: w, flags: p, resolve: $ }), a.length === 1 && setTimeout(x);
    });
  }
  async function x() {
    const w = /* @__PURE__ */ new Map(), p = a.splice(0).filter((B) => {
      const j = JSON.stringify(B.flags);
      return w.has(B.name) || w.set(B.name, j), w.get(B.name) === j ? !0 : (a.push(B), !1);
    });
    a.length && setTimeout(x);
    const $ = Object.fromEntries(p.flatMap(({ name: B, flags: j }) => Object.entries(j).map(([U, J]) => [`${B}.${U}`, J]))), O = await e.readKeys({ only: [...new Set(p.map(({ name: B }) => B))], state: { ...n, ...$ } });
    p.forEach(({ name: B, resolve: j }) => j(O.ok ? O.value.keys[B] : O));
  }
  async function T(w) {
    var B;
    const p = ++f;
    (w.length ? w : Object.keys(u).filter((j) => !j.endsWith(qn) && u[j].loading === "first" && _(j))).forEach((j) => l[j] = p);
    const O = await e.readKeys({ only: w, state: { ...n } });
    if (!O.ok) {
      if (O.failure === "cancelled") return !1;
      const j = (w.length ? w : Object.keys(t)).filter((J) => (l[J] ?? 0) <= p);
      j.forEach((J) => {
        b[J].readAt = Date.now(), O.failure === "unreachable" ? i.add(J) : i.delete(J), b[J].showFirst(O);
      });
      const U = O.failure === "unreachable" && ((B = e.waitForServer) == null ? void 0 : B.call(e));
      return U && U.then(() => {
        if (h) return;
        const J = j.filter((oe) => l[oe] === p);
        (J.length || !w.length && !j.length && f === p) && T(J);
      }), !1;
    }
    return L(O.value.declared), Object.entries(O.value.keys).forEach(([j, U]) => {
      (l[j] ?? 0) > p || (l[j] = p, b[j].readAt = Date.now(), i.delete(j), U.ok && (b[j].data.value = U.value), b[j].showFirst(U));
    }), !0;
  }
  function H(w) {
    const p = Oc(w);
    return p.length ? (p.forEach(($) => o.names.add($)), o.answer ?? (o.answer = new Promise(($) => setTimeout(() => {
      const O = [...o.names];
      o.names.clear(), o.answer = null, $(T(O));
    })))) : T([]);
  }
  function W(w) {
    w.forEach((p) => s.add(p)), clearTimeout(c), c = setTimeout(() => {
      const p = [...s];
      s.clear(), p.length && H(p);
    }, xc);
  }
  const I = (w) => w.endsWith(qn) ? Object.keys(t).filter((p) => p.startsWith(w.slice(0, -1)) && t[p].readAt) : [w], G = (w, p) => {
    const $ = g(w).event_column;
    return !$ || $c(p, $, /* @__PURE__ */ new Set([Number(w.slice(w.lastIndexOf(".") + 1))]));
  }, N = (w) => (u[w] ?? u[`${w.split(".")[0]}.*`]).reload_seconds;
  function A(w) {
    const p = Object.keys(u).filter((O) => w.event === Sc || u[O].events.some((B) => Us(B, w.event)));
    p.filter((O) => u[O].page_size).forEach((O) => b[O].heard(w));
    const $ = p.filter((O) => !u[O].page_size);
    $.filter((O) => !_(O)).forEach((O) => b[O].readAt = 0), W($.filter(_).flatMap(I).filter((O) => G(O, w)));
  }
  function L(w) {
    if (Object.keys(u).length) return;
    u = w;
    const p = [...new Set(Object.values(w).flatMap((O) => O.events))];
    p.length && e.follow(p, A);
    const $ = Object.keys(w).filter((O) => w[O].loading === Ac);
    $.length && T($);
  }
  pe(() => n.tab, () => {
    const w = Object.keys(u).filter((p) => !p.endsWith(qn) && _(p) && !b[p].readAt);
    w.length && T(w);
  }), Re(() => {
    h = !0, clearTimeout(c);
  });
  function q() {
    const w = Date.now(), p = Object.keys(u).filter(($) => u[$].reload_seconds > 0 && _($)).flatMap(I).filter(($) => w - b[$].readAt >= (i.has($) ? Math.min(N($) * 1e3, _c) : N($) * 1e3));
    p.length && W(p);
  }
  return Ws(q, () => e.visible.value, Mc), queueMicrotask(() => T([])), { props: b, state: n, reload: H, readKey: M };
}
const Ic = Symbol("open-view"), Le = Symbol.for("journal.window-context"), oi = Symbol("dock-card"), li = Symbol.for("journal.inspector-actions");
function Bc(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = Tc(e));
  return Object.defineProperties(e, {
    props: { get: () => n().props },
    state: { get: () => n().state },
    reload: { value: (a) => n().reload(a) },
    readKey: { value: (a, s) => n().readKey(a, s) }
  });
}
function st() {
  const e = Me(Le, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return Bc(e);
}
const Rc = (e, t) => e(oi, t), M6 = () => Me(oi), vs = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', No = {
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
}, Lc = ["data-icon", "stroke-width", "innerHTML"], le = {
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
    }, null, 12, Lc));
  }
}, Nc = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: "spinner",
      style: ve({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, qc = /* @__PURE__ */ z(Nc, [["__scopeId", "data-v-eb453d6f"]]), Dc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = pa(), a = S(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = C(!1), o = S(() => t.busy || s.value), l = Me(Le, null), i = S(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function u(c) {
      const f = [n.onClick].flat().filter(Boolean).map((g) => g(c)).filter((g) => g instanceof Promise);
      if (!f.length) return;
      const h = setTimeout(() => s.value = !0, Xl);
      try {
        await Promise.all(f);
      } finally {
        clearTimeout(h), s.value = !1;
      }
    }
    return (c, f) => (r(), F(Ke(e.href ? "a" : "button"), De(a.value, {
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
          e.icon ? (r(), F(le, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : k("", !0),
          re(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (r(), F(qc, {
          key: 0,
          class: "btn-spinner"
        })) : k("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ge = /* @__PURE__ */ z(Dc, [["__scopeId", "data-v-ededdadf"]]), Pc = ["aria-checked", "aria-haspopup", "onClick"], jc = {
  key: 0,
  class: "segmented-dot"
}, Fc = {
  key: 1,
  class: "segmented-note"
}, Wc = {
  key: 2,
  class: "segmented-count"
}, Hc = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = Ds();
    return (s, o) => {
      const l = iu("tip");
      return r(), d("span", {
        class: Y(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (r(!0), d(D, null, ne(e.options, (i) => tt((r(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: Y(["segmented-option", { on: i.key === e.value }]),
          onClick: (u) => n("pick", i.key)
        }, [
          i.dot ? (r(), d("span", jc)) : k("", !0),
          K(" " + v(i.label) + " ", 1),
          i.note ? (r(), d("small", Fc, v(i.note), 1)) : k("", !0),
          i.count !== void 0 ? (r(), d("em", Wc, v(i.count), 1)) : k("", !0)
        ], 10, Pc)), [
          [l, i.tip || i.title, `${R(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Wt = /* @__PURE__ */ z(Hc, [["__scopeId", "data-v-c89bc92d"]]), zc = {
  key: 0,
  class: "more-items"
}, Uc = {
  key: 0,
  role: "alert"
}, Gc = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (r(), d("div", zc, [
      e.failure ? (r(), d("p", Uc, v(e.failure), 1)) : k("", !0),
      e.more ? (r(), F(ge, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: P(() => [
          K(v(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : k("", !0)
    ])) : k("", !0);
  }
}, $n = /* @__PURE__ */ z(Gc, [["__scopeId", "data-v-10464014"]]), Vc = { class: "link-group" }, Kc = {
  class: "group-label",
  "data-link-kind": ""
}, Yc = ["disabled", "onClick"], Qc = { class: "title" }, Xc = { class: "relations" }, Jc = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(!1), o = S(() => s.value ? n.rows : n.rows.slice(0, 3)), l = S(() => `${n.model.replaceAll("_", " ").replace(/^./, (f) => f.toUpperCase())} ${n.count}`), i = (f) => f.endpoint.unavailable || !f.endpoint.open_ref, u = (f) => ({ [n.linkAttribute]: !0, "data-link-model": f.endpoint.model, "data-link-id": f.endpoint.id }), c = (f) => `${f.endpoint.model === "doc" && f.endpoint.id === n.documentId ? "Design document" : f.endpoint.model.replaceAll("_", " ").replace(/^./, (h) => h.toUpperCase())} ${f.endpoint.id}, ${f.relations.map((h) => h.replaceAll("_", " ")).join(", ")}`;
    return (f, h) => (r(), d("div", Vc, [
      m("div", Kc, v(l.value), 1),
      (r(!0), d(D, null, ne(o.value, (g) => (r(), d("button", De({
        key: `${g.endpoint.model}:${g.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, u(g), {
        disabled: i(g),
        onClick: (y) => a("open", g)
      }), [
        m("span", Qc, v(g.endpoint.title), 1),
        m("span", Xc, [
          K(v(c(g)), 1),
          i(g) ? (r(), d(D, { key: 0 }, [
            K(" · Unavailable")
          ], 64)) : k("", !0)
        ])
      ], 16, Yc))), 128)),
      e.rows.length > 3 && !s.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: h[0] || (h[0] = (g) => s.value = !0)
      }, "Show more")) : k("", !0)
    ]));
  }
}, Zc = /* @__PURE__ */ z(Jc, [["__scopeId", "data-v-be6f079c"]]), ed = ["data-loaded"], td = { class: "rows" }, nd = ["disabled", "onClick"], ad = { class: "title" }, sd = { class: "relations" }, od = { key: 2 }, ld = {
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
    const g = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, y = (A) => g[A] || `${A.replaceAll("_", " ").replace(/^./, (L) => L.toUpperCase())}s`, b = S(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((A, L) => A + L, 0) },
      ...Object.entries(o.value).filter(([A]) => !n.onlyKinds.length || n.onlyKinds.includes(A)).map(([A, L]) => ({ key: A, label: y(A), count: L }))
    ]), _ = S(() => {
      const A = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((q) => q.endpoint.model))].map((q) => [q, s.value.filter((w) => w.endpoint.model === q).length])), L = { doc: 0, task: 1, message: 2 };
      return Object.entries(A).sort(([q], [w]) => (L[q] ?? 3) - (L[w] ?? 3)).map(([q, w]) => ({ model: q, count: w, rows: s.value.filter((p) => p.endpoint.model === q) }));
    }), M = (A) => A.endpoint.unavailable || !A.endpoint.open_ref, x = (A) => ({ [n.linkAttribute]: !0, "data-link-model": A.endpoint.model, "data-link-id": A.endpoint.id }), T = (A) => `${A.endpoint.model === "doc" && A.endpoint.id === n.documentId ? "Design document" : A.endpoint.model.replaceAll("_", " ").replace(/^./, (L) => L.toUpperCase())} ${A.endpoint.id}, ${A.relations.map((L) => L.replaceAll("_", " ")).join(", ")}`;
    async function H(A = 1) {
      const L = ++h;
      c.value = !0, f.value = "";
      const q = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(A), "--page-size", String(n.pageSize)];
      n.outsidePlan && q.push("--outside-plan"), n.documentId && q.push("--first-counterpart", `doc:${n.documentId}`), i.value && q.push("--kind", i.value);
      try {
        const w = await n.read(q);
        if (L !== h) return;
        if (!w.ok) {
          f.value = w.error;
          return;
        }
        const p = w.value.counterparts ?? [], $ = A === 1 ? p : [...s.value, ...p];
        s.value = [...new Map($.map((O) => [`${O.endpoint.model}:${O.endpoint.id}`, O])).values()], o.value = w.value.categories ?? {}, l.value = w.value.total, u.value = w.value.next_page ?? null;
      } catch (w) {
        L === h && (f.value = w.message);
      } finally {
        L === h && (c.value = !1);
      }
    }
    function W(A) {
      if (M(A)) return;
      const [L, q] = A.endpoint.open_ref.split(":");
      a("open", { table: L, id: Number(q) });
    }
    function I(A) {
      i.value = A, H();
    }
    const G = () => !c.value && u.value && H(u.value), N = S(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return pe(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], u.value = null, i.value = "", H();
    }, { immediate: !0 }), (A, L) => s.value.length || c.value || f.value || e.empty ? (r(), d("section", {
      key: 0,
      class: Y(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      b.value.length > 2 ? (r(), F(Wt, {
        key: 0,
        options: b.value,
        value: i.value,
        wrap: "",
        onPick: I
      }, null, 8, ["options", "value"])) : k("", !0),
      m("div", td, [
        e.grouped ? (r(!0), d(D, { key: 0 }, ne(_.value, (q) => (r(), F(Zc, {
          key: q.model,
          model: q.model,
          count: q.count,
          rows: q.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: W
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (r(!0), d(D, { key: 1 }, ne(s.value, (q) => (r(), d("button", De({
          key: `${q.endpoint.model}:${q.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, x(q), {
          disabled: M(q),
          onClick: (w) => W(q)
        }), [
          m("span", ad, v(q.endpoint.title), 1),
          m("span", sd, [
            K(v(T(q)), 1),
            M(q) ? (r(), d(D, { key: 0 }, [
              K(" · Unavailable")
            ], 64)) : k("", !0)
          ])
        ], 16, nd))), 128)),
        !s.value.length && !c.value && !f.value && e.empty ? (r(), d("p", od, v(e.empty), 1)) : k("", !0),
        E($n, {
          more: !!u.value,
          loading: c.value,
          failure: f.value,
          label: N.value,
          onMore: G
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, ed)) : k("", !0);
  }
}, id = /* @__PURE__ */ z(ld, [["__scopeId", "data-v-3b23de37"]]), rd = (e, t, n) => Math.max(t, Math.min(n, e)), ud = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, ii = /* @__PURE__ */ new WeakMap(), cd = (e, t) => ii.set(e, t);
function dd(e, t) {
  for (let n = t; n; n = ii.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function ri(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !dd(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Re(() => window.removeEventListener("click", n));
}
const Bt = 8, fd = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = C(null), o = (p) => p ? `${p}px` : void 0, l = S(() => ({
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
    const _ = S(() => {
      if (!u.value) return l.value;
      const p = u.value, $ = b(p), O = y($, p), { w: B, h: j } = i.value, U = a.align === "auto" ? p.left + p.right > $.left + $.right : a.align === "right", J = rd(U ? p.right - B : p.left, $.left + Bt, Math.max($.left + Bt, $.right - B - Bt)), ue = j > O.below && O.above > O.below ? { bottom: `${window.innerHeight - p.top + a.gap}px`, maxHeight: g(a.maxHeight, O.above) } : { top: `${p.bottom + a.gap}px`, maxHeight: g(a.maxHeight, O.below) };
      return { ...l.value, ...ue, left: `${J}px`, maxWidth: g(a.maxWidth, O.across) };
    }), M = n, x = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function T(p) {
      const $ = x(), O = $.indexOf(document.activeElement);
      $[(O + p + $.length) % $.length].focus();
    }
    const H = { ArrowDown: () => T(1), ArrowUp: () => T(-1), Escape: () => M("close") }, W = (p) => H[p.key] && (p.preventDefault(), H[p.key]()), I = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let G = 0;
    const N = new ResizeObserver(() => {
      cancelAnimationFrame(G), G = requestAnimationFrame(I);
    });
    ri(s, (p) => a.anchor && !a.anchor.contains(p.target) && M("close"));
    const A = (p, $) => ["top", "left", "right", "bottom"].some((O) => Math.abs(p[O] - $[O]) > 1), L = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let q = 0;
    function w() {
      if (a.anchor) {
        const p = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || L(p)) return M("close");
        A(p, u.value) && (u.value = p);
      }
      q = requestAnimationFrame(w);
    }
    return _e(() => {
      a.anchor && s.value && cd(s.value, a.anchor), I(), s.value && N.observe(s.value), !a.plain && x()[0] && x()[0].focus(), w();
    }), Re(() => {
      N.disconnect(), cancelAnimationFrame(q), cancelAnimationFrame(G);
    }), t({ element: s }), (p, $) => (r(), F(wn, {
      to: "body",
      disabled: !e.anchor
    }, [
      m("div", De({
        ref_key: "panel",
        ref: s
      }, p.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: _.value,
        onKeydown: W
      }), [
        re(p.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), va = /* @__PURE__ */ z(fd, [["__scopeId", "data-v-3d203970"]]), hd = { class: "split-button" }, md = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = C(null), s = C(!1), o = () => s.value = !1;
    return (l, i) => (r(), d("span", hd, [
      E(ge, {
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
        E(ge, {
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
            E(le, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (r(), F(va, {
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
}, pd = /* @__PURE__ */ z(md, [["__scopeId", "data-v-c258494d"]]), gd = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, vd = {
  key: 1,
  class: "menu-item-text"
}, yd = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: Y(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (r(), d("span", gd, v(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (r(), d("span", vd, [
        m("span", null, [
          re(t.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, v(e.description), 1)
      ])) : re(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Ue = /* @__PURE__ */ z(yd, [["__scopeId", "data-v-fec99974"]]), bd = ["aria-expanded"], kd = { class: "drop-label" }, wd = ["value"], $d = {
  key: 1,
  class: "drop-lead"
}, xd = { class: "drop-item-text" }, Sd = {
  key: 2,
  class: "drop-note"
}, Md = {
  key: 1,
  class: "drop-none"
}, _d = {
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
    const n = e, a = t, s = C(!1), o = C(null), l = C(""), i = S(() => {
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
        e.icon ? (r(), F(le, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : k("", !0),
        m("span", kd, v(e.label), 1),
        E(le, {
          name: "down",
          size: 11
        })
      ], 10, bd),
      s.value ? (r(), F(va, {
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
          }, null, 40, wd)) : k("", !0),
          (r(!0), d(D, null, ne(i.value, (h) => (r(), F(Ue, {
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
              h.lead ? (r(), d("span", $d, v(h.lead), 1)) : k("", !0),
              m("span", xd, v(h.label), 1),
              h.note ? (r(), d("span", Sd, v(h.note), 1)) : k("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? k("", !0) : (r(), d("p", Md, v(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : k("", !0)
    ], 2));
  }
}, Gs = /* @__PURE__ */ z(_d, [["__scopeId", "data-v-29dfcce5"]]), Cd = 0, Ad = "/api/lines", Ed = "/api/line", qo = 5e3, Do = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Po = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), Ia = (e) => JSON.stringify(e.line), jo = () => new DOMException("cancelled", "AbortError");
class Od {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(Ia(t))) {
        Ae.whenFree(() => this.readAlone(l));
        return;
      }
      this.waiting.push(l), this.sendSoon();
    });
  }
  // a write always finishes, also when its window has gone: it carries no signal
  write(t) {
    return new Promise((n, a) => this.alone({ body: t, resolve: n, reject: a }, Lt));
  }
  sendSoon() {
    this.timer ?? (this.timer = setTimeout(() => Ae.whenFree(() => this.send()), Cd));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(jo())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(jo()), n.abort();
    });
    t.forEach((o, l) => {
      var i;
      return (i = o.signal) == null ? void 0 : i.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Ae.sent(Ad, Do({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => Po(i.body, lt)), qo);
      if (!o.ok) throw new Error(`the journal answered ${o.status} to a batch of lines`);
      const { answers: l } = await o.json();
      t.forEach((i, u) => i.resolve(l[u]));
    } catch (o) {
      n.signal.aborted ? (this.waiting.push(...a), a.size && this.sendSoon()) : o.name === "TimeoutError" ? t.forEach((l) => Ae.whenFree(() => this.readAlone(l))) : t.forEach((l) => l.reject(o));
    } finally {
      t.forEach((o, l) => {
        var i;
        return (i = o.signal) == null ? void 0 : i.removeEventListener("abort", s[l]);
      });
    }
  }
  async readAlone(t) {
    const n = Date.now();
    await this.alone(t, lt), Date.now() - n < qo ? this.slow.delete(Ia(t.body)) : this.slow.add(Ia(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Ae.sent(Ed, Do(t.body, t.signal), [Po(t.body, n)], n === lt ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const ui = new Od(), Td = "/api/window";
function Id(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${Td}?${o}`, i = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, u = (c) => Ae.whenFree(async () => {
    const f = await Ae.sent(l, { signal: c, headers: i }, [{ window: e, line: l, kind: lt }]);
    if (!f.ok) throw new Error((await f.json()).error);
    return f.json();
  });
  return Ae.joined(`${e} ${n.join(",")} ${o}`, u, s);
}
const ci = /* @__PURE__ */ new Map();
class Bd {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = et({ buttons: [], missing: {} }), this.loading = et(!1), this.loaded = et(!1), this.failed = et(""), this.pending = null;
  }
  load() {
    return this.pending ? this.pending : (this.loading.value = !0, this.pending = this.read().then((t) => (this.offers.value = t, this.loaded.value = !0, this.failed.value = "", t)).catch((t) => {
      throw this.failed.value = t.message, t;
    }).finally(() => {
      this.pending = null, this.loading.value = !1;
    }), this.pending);
  }
  async read() {
    const t = await Ae.raw(`/api/buttons?environment=${encodeURIComponent(this.environment)}`);
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
function _6(e, t) {
  const n = new Bd(e, t);
  return ci.set(e, n), n.load().catch(() => {
  }), n;
}
const Vs = (e) => ci.get(e);
function Rd(e, t, n) {
  const a = Vs(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function Ld(e, t) {
  if (!e) return !0;
  const n = Vs(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Nd = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let di = {};
async function C6(e = (t) => Ae.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (di = (await t.json()).states);
}
const Ks = (e, t) => {
  var n;
  return (n = di[e]) == null ? void 0 : n[t];
}, dn = (e, t) => {
  var n;
  return ((n = Ks(e, t)) == null ? void 0 : n.label) ?? Nd(t);
}, fi = (e, t) => {
  var n;
  return ((n = Ks(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, qd = (e, t) => {
  var n;
  return ((n = Ks(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, Dd = Symbol("pane-page"), Ys = Symbol("inspector-host"), hi = { 1: "refused", 2: "usage", 3: "fault" }, Pd = 100, jd = 50, Fd = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, Wd = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function Hd({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: i, options: u = C({}), declared: c = [], page: f = null, setOption: h = () => {
}, autoScroll: g = "", tabs: y = [], sources: b = [], links: _ = {}, search: M = {}, readOnly: x = !1, shared: T = null }) {
  const H = /* @__PURE__ */ new Map(), W = (U, J) => l.follow(e, U, (oe) => {
    H.clear(), J(oe);
  }, a), I = new AbortController(), G = C(!1), N = performance.now();
  let A = 0, L = 0, q = () => {
  };
  const w = new Promise((U) => q = U);
  I.signal.addEventListener("abort", q, { once: !0 });
  const p = () => {
    clearTimeout(L), L = setTimeout(() => {
      A === 0 && Fs(N, () => {
        G.value = !0, q();
      });
    }, jd);
  }, $ = (U, J) => (A += 1, Mt(e, U, t, I.signal, J).finally(() => {
    A -= 1, p();
  })), O = (U, J) => (p(), w.then(() => I.signal.aborted ? ct : Mt(e, U, t, I.signal, J))), B = ({ only: U = [], state: J = {} } = {}) => (A += 1, Ud(() => Id(e, t, U, J, I.signal), I.signal).finally(() => {
    A -= 1, p();
  })), j = (U, { unbatched: J = !1, deferred: oe = !1 } = {}) => {
    const ue = H.get(U);
    if (ue && performance.now() - ue.at < Pd) return ue.answer;
    const ke = oe && !G.value ? O(U, J) : $(U, J);
    return H.set(U, { answer: ke, at: performance.now() }), ke;
  };
  return {
    answered: G,
    settle: p,
    window: e,
    environment: t,
    agent: n,
    page: f,
    visible: S(() => a()),
    permissions: s,
    autoScroll: g,
    tabs: y,
    sources: b,
    links: _,
    search: M,
    readOnly: x,
    shared: T,
    read: j,
    readKeys: B,
    waitForServer: () => Hs() ? ni() : null,
    run: (U) => Mt(e, U, t, I.signal),
    upload: (U) => Vd(U, e, I.signal),
    cancel: () => I.abort(),
    signal: I.signal,
    subscriptions: l,
    follow: (U, J) => W([U].flat().filter((oe) => o.some((ue) => Us(ue, oe))), J),
    // for a dock of the chat, whose row's term the window cannot declare ahead
    followUndeclared: W,
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (U) => S(() => {
      var J;
      return u.value[U] ?? ((J = c.find((oe) => oe.key === U)) == null ? void 0 : J.default);
    }),
    setting: async (U, J) => {
      const oe = await j(`window setting ${e} ${U}`);
      return oe.ok ? oe.value.value : J;
    },
    setOption: h,
    keep: (U, J) => Mt(e, ["window", "save-setting", e, U, JSON.stringify(J)], t, I.signal)
  };
}
function mi(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const ct = { ok: !1, failure: "cancelled", error: "" }, Qs = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function pi(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? ct : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: hi[n.code] || "fault", error: mi(n.error) };
  } catch {
    return t != null && t.aborted ? ct : { ok: !1, failure: "unreachable", error: Qs };
  }
}
const zd = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: hi[e.code] || "fault", error: mi(e.error) };
async function Ud(e, t) {
  try {
    const n = await e();
    return t.aborted ? ct : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, zd(s)])) } };
  } catch {
    return t.aborted ? ct : { ok: !1, failure: "unreachable", error: Qs };
  }
}
async function gi(e, t, n) {
  const a = await pi(() => ui.read(e, t, n), t);
  return a.failure !== "unreachable" || !Hs() ? a : (await ni(), t.aborted ? ct : gi(e, t, n));
}
function Mt(e, t, n, a = void 0, s = !1) {
  return Ae.held(() => Gd(e, t, n, a, s), Ae.knownRead(Array.isArray(t) ? t : Xs(t)));
}
async function Gd(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : Xs(t), environment: n };
  return await Ae.isRead(o.line) ? Ae.joined(JSON.stringify(o), (l, i) => gi({ ...o, attribution: i }, l, s), a, o).catch(() => ct) : pi(() => ui.write({ ...o, attribution: {
    client_id: Ae.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function Vd(e, t, n = void 0) {
  try {
    const a = await Ae.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? ct : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? ct : { ok: !1, failure: "unreachable", error: Qs };
  }
}
function Xs(e) {
  return [...e.matchAll(Fd)].map(([t]) => t.replace(Wd, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Kd = (e) => `show-${e}`, A6 = (e, t, n) => e.filter((a) => {
  var s;
  return n(Kd((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), Js = "messages.chat", Kn = "main", vi = "Main agent", Yd = { main: vi, worker: "Worker", helper: "Helper" }, Qd = "journal-", Zs = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), Xd = (e) => Zs(e.replace(Qd, "").replaceAll("-", " ")), Jd = (e) => `${e.role} ${e.number}`, Zd = (e) => e.role === Kn ? vi : `${Zs(e.role)} ${e.number}`;
function Ht(e, t = e.facts) {
  const n = (t == null ? void 0 : t.profile) || e.profile || "", a = e.role === Kn || !n ? Yd[e.role] ?? Zs(e.role) : Xd(n), s = e.role === Kn ? "" : Jd(e), o = e.role === Kn ? a : n ? `${a} · ${s}` : `${a} ${e.number}`;
  return { title: a, subtext: s, text: o, name: Zd(e) };
}
const ef = {
  key: 0,
  class: "agent-failure",
  role: "alert"
}, tf = {
  __name: "ButtonAgentField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C([]), o = C(""), l = S(() => [...s.value].sort((c, f) => +(f.role === n.field.first_role) - +(c.role === n.field.first_role) || c.id - f.id).map((c) => ({ key: String(c.number), label: Ht(c).title, note: Ht(c).subtext }))), i = S(() => l.value.find((c) => c.key === n.value));
    async function u() {
      const c = await Mt(Js, ["agent", "running"], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
    }
    return u(), (c, f) => (r(), d(D, null, [
      E(Gs, {
        label: i.value ? i.value.label : "Choose an agent",
        items: l.value,
        picked: e.value,
        empty: "No agent is running",
        wide: "",
        "data-agent-field": "",
        onPick: f[0] || (f[0] = (h) => a("pick", h.key))
      }, null, 8, ["label", "items", "picked"]),
      o.value ? (r(), d("p", ef, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, nf = /* @__PURE__ */ z(tf, [["__scopeId", "data-v-d2ea58f1"]]), af = {
  key: 0,
  class: "template-brief"
}, sf = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, of = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C([]), o = C(""), l = S(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = S(() => s.value.find((c) => String(c.id) === n.value));
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
    return u(), (c, f) => (r(), d(D, null, [
      E(Wt, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: f[0] || (f[0] = (h) => a("pick", h))
      }, null, 8, ["options", "value"]),
      i.value ? (r(), d("p", af, v(i.value.brief), 1)) : k("", !0),
      o.value ? (r(), d("p", sf, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, lf = /* @__PURE__ */ z(of, [["__scopeId", "data-v-14be8a5c"]]), rf = { class: "info-tip" }, uf = ["aria-label"], cf = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, df = {
  __name: "InfoTip",
  props: { lines: { type: Array, required: !0 }, label: { type: String, default: "More information" } },
  setup(e) {
    return (t, n) => (r(), d("span", rf, [
      m("button", {
        type: "button",
        class: "info-tip-icon",
        "aria-label": e.label,
        "data-info-tip": ""
      }, [
        E(le, {
          name: "info",
          size: 13
        })
      ], 8, uf),
      m("span", cf, [
        (r(!0), d(D, null, ne(e.lines, (a, s) => (r(), d("span", {
          key: s,
          class: "info-tip-line"
        }, v(a), 1))), 128))
      ])
    ]));
  }
}, yi = /* @__PURE__ */ z(df, [["__scopeId", "data-v-a2fe5ff1"]]), ff = { class: "form-field" }, hf = { class: "form-field-head" }, mf = ["for"], pf = {
  key: 1,
  class: "form-field-aside"
}, gf = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", ff, [
      m("div", hf, [
        m("label", {
          class: "form-field-label",
          for: t.$props.for
        }, v(e.label), 9, mf),
        e.help ? (r(), F(yi, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : k("", !0),
        t.$slots.aside ? (r(), d("span", pf, [
          re(t.$slots, "aside", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      re(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, vf = /* @__PURE__ */ z(gf, [["__scopeId", "data-v-302c40bf"]]), ys = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, yf = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = pa(), n = S(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => tt((r(), d("textarea", De({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [R(ys), R(t).value]
    ]);
  }
}), bf = /* @__PURE__ */ z(yf, [["__scopeId", "data-v-e130a5b9"]]), kf = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ds(), o = S(() => n.field.choices ? "choice" : n.field.target ? "template" : n.field.first_role ? "agent" : "text");
    return (l, i) => (r(), F(vf, {
      label: e.field.label,
      for: R(s),
      "data-button-field": e.field.name
    }, {
      default: P(() => [
        E(Kt, { value: o.value }, {
          choice: P(() => [
            E(Wt, {
              id: R(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (u) => a("pick", u))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: P(() => [
            E(lf, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          agent: P(() => [
            E(nf, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[2] || (i[2] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: P(() => [
            E(bf, {
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
    return (t, n) => (r(), F(ge, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: P(() => [
        E(le, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function wf(e, t, n, a = () => window) {
  _e(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Re(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const $f = (e, t = () => !0) => wf("keydown", (n) => n.key === "Escape" && t() && e());
function bi(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = C(!1), s = S(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return $f(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const xf = 80, Rt = Gt([]);
function ki(e) {
  const t = Symbol("layer"), n = () => Rt.includes(t) && Rt.splice(Rt.indexOf(t), 1);
  return pe(
    e,
    (a) => {
      a && !Rt.includes(t) && Rt.push(t), a || n();
    },
    { immediate: !0 }
  ), Re(n), S(() => xf + Math.max(0, Rt.indexOf(t)));
}
let wi = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return wi = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Sf = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Mf(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(Sf)];
    if (!l.length) return o.preventDefault();
    const [i, u] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), u.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === u && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  _e(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : wi, document.addEventListener("keydown", s), Fe(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Re(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const _f = ["aria-modal", "aria-label", "aria-labelledby"], Cf = {
  key: 0,
  class: "dialog-head"
}, Af = ["id", "tabindex"], Ef = {
  key: 1,
  class: "dialog-foot"
}, Of = 500, Tf = 400, If = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = bi(a, n), i = ki(s), u = C(null), c = C(null), f = C(null), h = Ds(), g = C(!1), y = Date.now();
    n.modal && Mf(c, () => a("escape"), f);
    function b() {
      if (!n.modal) return n.closable && o();
      g.value = !0, setTimeout(() => g.value = !1, Tf);
    }
    function _(T) {
      !n.modal || Date.now() - y >= Of || ![" ", "Enter"].includes(T.key) || (T.preventDefault(), T.stopPropagation());
    }
    const M = () => u.value && (u.value.scrollTop = u.value.scrollHeight), x = new MutationObserver(M);
    return pe(u, (T) => {
      x.disconnect(), T && n.follow && (x.observe(T, { childList: !0, subtree: !0, characterData: !0 }), M());
    }), Re(() => x.disconnect()), (T, H) => (r(), F(wn, { to: "body" }, [
      E(Vt, {
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
              onKeydownCapture: _
            }, [
              e.bare ? k("", !0) : (r(), d("header", Cf, [
                m("h3", {
                  id: R(h),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, v(e.title), 9, Af),
                e.closable ? (r(), F(ya, {
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
              T.$slots.foot ? (r(), d("footer", Ef, [
                re(T.$slots, "foot", {}, void 0, !0)
              ])) : k("", !0)
            ], 42, _f)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, ba = /* @__PURE__ */ z(If, [["__scopeId", "data-v-089c42bc"]]), Bf = {
  class: "action-output",
  "data-action-output": ""
}, Rf = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), F(ba, {
      padded: "",
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: P(() => [
        m("pre", Bf, v(e.text), 1)
      ]),
      _: 1
    }));
  }
}, Lf = /* @__PURE__ */ z(Rf, [["__scopeId", "data-v-b32f94a4"]]);
function Nf(e) {
  const t = document.body.appendChild(document.createElement("div")), n = ru(Lf, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const qf = (e, t, n = {}) => Xs(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function xn(e, t, n, a = {}) {
  var s;
  try {
    if (!await Ld(e.module, n)) return { ok: !1, error: "" };
    const o = await Mt(Js, qf(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && Nf(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const Df = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Ba = [
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
}, Pf = ["secrets", "plugins"], $i = Object.keys(ka).filter((e) => !(Ql && Pf.includes(e)));
S(() => $i.map((e) => ({ name: e, ...ka[e] })));
const Yt = (e) => ka[e], xi = new Map($i.flatMap((e) => [e, e.replace(/s$/, ""), ka[e].title.toLowerCase()].map((t) => [t, e]))), vt = (e) => xi.get(String(e).toLowerCase()) || "", Si = [...xi.keys()].sort((e, t) => t.length - e.length).join("|"), jf = {
  class: "button-form",
  "data-button-form": ""
}, Ff = {
  key: 0,
  class: "button-form-title"
}, Wf = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, Hf = { class: "button-form-actions" }, zf = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(Object.fromEntries(n.button.fields.map((f) => [f.name, f.default || ""]))), o = C(!1), l = C(""), i = S(() => n.button.fields.every((f) => s.value[f.name].trim().length > 0)), u = S(() => {
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
    return (f, h) => (r(), F(ba, {
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
          m("div", jf, [
            (g = e.row) != null && g.title ? (r(), d("p", Ff, v(e.row.title), 1)) : k("", !0),
            (r(!0), d(D, null, ne(e.button.fields, (y) => (r(), F(kf, {
              key: y.name,
              field: y,
              value: s.value[y.name],
              environment: e.environment,
              onPick: (b) => s.value[y.name] = b
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (r(), d("p", Wf, v(l.value), 1)) : k("", !0),
            m("div", Hf, [
              E(ge, {
                small: "",
                onClick: h[0] || (h[0] = (y) => a("close"))
              }, {
                default: P(() => [...h[2] || (h[2] = [
                  K("Cancel", -1)
                ])]),
                _: 1
              }),
              E(ge, {
                variant: "primary",
                small: "",
                disabled: !i.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: c
              }, {
                default: P(() => [...h[3] || (h[3] = [
                  K("Send", -1)
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
}, Uf = /* @__PURE__ */ z(zf, [["__scopeId", "data-v-e3f0d786"]]), Gf = ["aria-busy"], Vf = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, Kf = { class: "button-slot-confirm-text" }, Yf = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Qf = {
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
    const n = e, a = t, s = S(() => Vs(n.environment)), o = S(
      () => {
        var x;
        return !n.readOnly && ((x = s.value) == null ? void 0 : x.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = S(() => {
      var x;
      return !n.readOnly && ((x = s.value) == null ? void 0 : x.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), u = S(() => n.readOnly ? [] : Rd(n.environment, n.name, n.row)), c = C(null), f = C(null), h = C(""), g = C(!1), y = (x) => [x.from ? `From ${x.from}` : "", x.tip, x.warning].filter(Boolean).join(" · "), b = (x) => x.icon || (x.warning ? "dot" : "");
    function _(x) {
      if (!(g.value || n.readOnly)) {
        if (x.fields.length) {
          c.value = x;
          return;
        }
        if (x.confirm) {
          f.value = x;
          return;
        }
        return M(x);
      }
    }
    async function M(x) {
      f.value = null, h.value = "", a("failure", ""), g.value = !0;
      const T = await xn(x, n.row, n.environment);
      g.value = !1, h.value = T.ok ? "" : T.error;
      const H = x.label.toLowerCase() + (n.objectName && !x.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", T.ok ? "" : `Could not ${H}: ${T.error}`), T.ok && a("done");
    }
    return (x, T) => (r(), d("span", {
      class: Y(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (r(), d(D, { key: 0 }, [
        T[5] || (T[5] = m("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        E(ge, {
          small: "",
          onClick: i
        }, {
          default: P(() => [...T[4] || (T[4] = [
            K("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && f.value ? (r(), d("span", Vf, [
        m("span", Kf, v(f.value.confirm), 1),
        E(ge, {
          small: "",
          variant: f.value.danger ? "ghost" : "primary",
          bordered: f.value.danger,
          class: Y({ danger: f.value.danger }),
          "data-button-confirm-yes": "",
          onClick: T[0] || (T[0] = (H) => M(f.value))
        }, {
          default: P(() => [
            K(v(f.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        E(ge, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: T[1] || (T[1] = (H) => f.value = null)
        }, {
          default: P(() => [...T[6] || (T[6] = [
            K("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? k("", !0) : (r(), d(D, { key: 2 }, [
        (r(!0), d(D, null, ne(u.value, (H) => (r(), d(D, {
          key: H.name
        }, [
          H.menu.length ? (r(), F(pd, {
            key: 0,
            small: "",
            variant: H.primary ? "primary" : "ghost",
            disabled: g.value,
            "menu-label": H.menu_label || "More ways",
            title: y(H),
            "data-button": H.name,
            onMain: (W) => _(H)
          }, {
            menu: P(({ close: W }) => [
              (r(!0), d(D, null, ne(H.menu, (I) => (r(), F(Ue, {
                key: I.label,
                description: I.description,
                onClick: (G) => (W(), _({ ...H, ...I, menu: [] }))
              }, {
                default: P(() => [
                  K(v(I.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: P(() => [
              K(v(H.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (r(), F(ge, {
            key: 1,
            small: "",
            variant: H.primary ? "primary" : "ghost",
            bordered: !H.primary,
            class: Y({ danger: H.danger }),
            icon: b(H),
            disabled: g.value,
            title: y(H),
            "data-button": H.name,
            onClick: (W) => _(H)
          }, {
            default: P(() => [
              K(v(H.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        h.value && !e.readOnly && !e.externalFailure ? (r(), d("span", Yf, v(h.value), 1)) : k("", !0),
        c.value && !e.readOnly ? (r(), F(Uf, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: T[2] || (T[2] = (H) => c.value = null),
          onDone: T[3] || (T[3] = (H) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : k("", !0)
      ], 64))
    ], 10, Gf));
  }
}, eo = /* @__PURE__ */ z(Qf, [["__scopeId", "data-v-a4b6f174"]]), Xf = {
  class: "running",
  "data-running-command": ""
}, Jf = ["title"], Zf = {
  key: "idle",
  class: "running-idle"
}, eh = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (r(), d("span", Xf, [
      E(Vt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: P(() => [
          e.text ? (r(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, v(e.text), 9, Jf)) : (r(), d("span", Zf, v(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, E6 = /* @__PURE__ */ z(eh, [["__scopeId", "data-v-d3240219"]]), th = ["aria-checked", "disabled", "aria-label", "title"], nh = {
  key: 0,
  class: "switch-inner"
}, ah = {
  key: 0,
  class: "switch-word"
}, sh = {
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
        e.labelled ? (r(), d("span", nh, v(e.word), 1)) : k("", !0),
        s[1] || (s[1] = m("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (r(), d("span", ah, v(e.word), 1)) : k("", !0)
    ], 10, th));
  }
}, O6 = /* @__PURE__ */ z(sh, [["__scopeId", "data-v-92ae7767"]]), oh = { class: "notice-text" }, lh = {
  key: 1,
  class: "notice-actions"
}, ih = {
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
      e.icon ? (r(), F(le, {
        key: 0,
        name: e.icon,
        size: 18
      }, null, 8, ["name"])) : k("", !0),
      m("span", oh, [
        re(n.$slots, "default", {}, void 0, !0)
      ]),
      n.$slots.actions ? (r(), d("span", lh, [
        re(n.$slots, "actions", {}, void 0, !0)
      ])) : k("", !0)
    ], 2));
  }
}, T6 = /* @__PURE__ */ z(ih, [["__scopeId", "data-v-445bd8a6"]]);
function Mi(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function na(e, t) {
  return Mi(() => localStorage, e, t);
}
function _i(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function to(e, t) {
  return _i(() => localStorage, e, t);
}
function Ci(e, t) {
  pe(t, (n) => to(e, n), { deep: !0 });
}
function rh(e, t) {
  return Mi(() => sessionStorage, e, t);
}
function uh(e, t) {
  return _i(() => sessionStorage, e, t);
}
const aa = "journal.environment", Ai = C(rh(aa, na(aa, "")));
function ch(e) {
  Ai.value = e, uh(aa, e), to(aa, e);
}
const sa = C(location.hash), Fo = et(null), Wo = { integrations: "mcp", library: "team" };
function dh() {
  if (!Fo.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (Wo[n]) {
    location.replace(`#/${[Wo[n], ...a].join("/")}${t ? `?${t}` : ""}`), sa.value = location.hash;
    return;
  }
  !n || Fo.value(n) || (ch(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), sa.value = location.hash);
}
window.addEventListener("hashchange", () => {
  sa.value = location.hash, dh();
});
const bs = S(() => {
  const [e, t = ""] = sa.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [i, u = ""] = l.split("@"), [c = "", f = "", h = ""] = i.split(":");
    return { table: c, id: Number(f), comment: Number(h) || 0, env: u };
  });
  return {
    env: Ai.value,
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
function fh(e = "", t = 0, n = "") {
  location.hash = no.page(e, t, n);
}
function hh(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const mh = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Ei(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(mh).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Dt = {};
function I6(e, t) {
  return Dt[e] = t, () => Dt[e] === t && delete Dt[e];
}
function bt(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Dt[e]) != null && l.call(Dt, t))) return;
  const s = bs.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  Ei([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function ph(e, t, n, a = 0, s = "") {
  if (e === bs.value.env) return bt(t, n, a, s);
  const o = bs.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Ei([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function je(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? ph(a, s, Number(o), 0, t) : bt(s, Number(o), 0, t);
}
function gh(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function qt(e) {
  const t = gh(e);
  t && je(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function B6(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const vh = { class: "inspector-part" }, yh = { class: "inspector-part-title" }, bh = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("section", vh, [
      m("h4", yh, v(e.title), 1),
      re(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, R6 = /* @__PURE__ */ z(bh, [["__scopeId", "data-v-5175e4a3"]]), Ho = /* @__PURE__ */ new Map(), kh = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = C(null), a = C(!1), s = C(t.name && Ho.get(t.name) || !1);
    function o(u) {
      s.value = u, t.name && Ho.set(t.name, u);
    }
    const l = () => {
      const u = !!n.value && n.value.scrollHeight > t.at;
      u !== a.value && (a.value = u);
    }, i = new ResizeObserver(() => requestAnimationFrame(l));
    return _e(() => n.value && i.observe(n.value.firstElementChild || n.value)), Re(() => i.disconnect()), (u, c) => (r(), d(D, null, [
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
}, Oi = /* @__PURE__ */ z(kh, [["__scopeId", "data-v-4d2235ba"]]), wh = ["aria-valuenow", "aria-valuemax"], $h = {
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
    const t = e, n = S(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
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
    ], 10, wh));
  }
}, Ti = /* @__PURE__ */ z($h, [["__scopeId", "data-v-9eba6a85"]]), xh = { processes: "process", memories: "memory", replies: "reply" }, oa = (e) => (xh[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), ks = [], Sh = 2e3, mt = /* @__PURE__ */ new Map(), Mh = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, _h = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Tt(e, { first: t = !1 } = {}) {
  t ? ks.unshift(e) : ks.push(e), mt.clear();
}
function Ii(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Ch = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Ah = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function ut(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Eh(e, t) {
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
  return Oh(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Oh(e) {
  return e.split(_h).map((t, n) => n % 2 ? t : t.replace(Mh, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function zo(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const Th = 24;
function Ih(e) {
  const [t, , ...n] = e, a = zo(t), s = n.map(zo), o = (u) => [a, ...s].some((c) => (c[u] ?? "").length > Th) ? ' class="text-column"' : "", l = a.map((u, c) => `<th${o(c)}>${fn(u)}</th>`).join(""), i = s.map((u) => `<tr>${u.map((c, f) => `<td${o(f)}>${fn(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const Bi = /^\s*(?:[-*+]|\d+[.)])\s+/, ws = /^\s*(\d+)[.)]\s/, Uo = (e) => e.match(/^\s*/)[0].length;
function Ri(e) {
  const t = e[0].match(ws), n = Uo(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && Uo(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${fn(o.text)}${o.nested.length ? Ri(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function Bh(e, t) {
  const n = ws.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Bi.test(e[s]) && ws.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const Go = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Li(e) {
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
    if (Go(t, a)) {
      let i = a + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(Ih(t.slice(a, i))), a = i;
      continue;
    }
    if (Bi.test(s)) {
      const i = Bh(t, a);
      n.push(Ri(t.slice(a, i))), a = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let i = a;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${Li(
          t.slice(a, i).map((u) => u.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = i;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !Go(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${fn(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const Rh = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Lh = (e) => e.type !== "text" && !Rh.test(e.html);
function Nh(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(Li(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : Lh(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function ao(e, t = { env: "" }) {
  const n = Ah(e, t), a = mt.get(n);
  if (mt.delete(n), a && a.source === t.source && a.reads.every((l) => Ch(l, t)))
    return mt.set(n, a), a.html;
  const s = [], o = Nh(Eh(e, { ...t, reads: s }));
  return mt.set(n, { html: o, reads: s, source: t.source }), mt.size > Sh && mt.delete(mt.keys().next().value), o;
}
const Ra = /* @__PURE__ */ new WeakMap();
function qh(e) {
  if (Ra.has(e)) return Ra.get(e);
  const t = uu(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, f) => `${c}:${f}`;
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
function Ni() {
  const e = Me(Le, null), t = e ? qh(e) : null;
  return (n, a = {}) => ao(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const qi = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Sn = (e) => String(e || "").replace(qi, (t, n, a, s) => s), Dh = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Dn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Ph = /^Traceback \(most recent call last\):/m, jh = 8;
function Di(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, jh).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function Fh(e) {
  const t = [...e.matchAll(Dh)].map((a) => a.index);
  if (Dn.lastIndex = 0, !t.length || !Dn.test(e)) return null;
  Dn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(Dn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Di(n), tail: "" } : null;
}
function Wh(e) {
  const t = Ph.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Di([o]), tail: n.slice(s).join(`
`) };
}
Tt((e) => {
  const t = Sn(e), n = Wh(t) || Fh(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const la = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Pi = (e) => `${e.table}:${e.id}`, $s = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", La = 80;
function Vo(e) {
  return e.length <= La ? e : `${e.slice(0, La + 1).replace(/\s+\S*$/, "") || e.slice(0, La)}…`;
}
const Ko = {
  messages: (e) => Vo($s(e.text)),
  comments: (e) => Vo($s(e.text)),
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
}, Hh = (e) => (Ko[e.table] ? Ko[e.table](e) : e.title || "") || "", Et = (e) => la(e.created_at), zh = (e) => la(e.updated_at) || Et(e), Uh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Gh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Vh(e) {
  const t = Uh.exec(e);
  if (t && vt(t[1])) return { at: t.index, length: t[0].length, table: vt(t[1]), id: Number(t[2]), label: t[3] };
  const n = Gh.exec(e), a = n && vt(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function Kh(e, t, n, a) {
  const s = Ii(a, e, t), o = Sn(s ? Hh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${ut(Yt(e).title)} ${t}</span><span class="row-card-title">${ut(o)}</span></a>`;
}
Tt(
  (e, t) => {
    const n = Vh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: Kh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Yh = /\.(png|jpe?g|gif|webp|svg)$/i, Qh = (e) => Yh.test(e), Xh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Jh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Zh(e, t) {
  const n = Xh.exec(e), [, a, s, o, l, i] = n || [], u = n && vt(a || o), c = u && Ii(t, u, Number(s || l));
  if (u !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const f = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, h = `${Yt(u).title} ${c.id} · ${ut(i)}`, g = Qh(i) ? `<img class="file-card-image" src="${f}" alt="${ut(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${ut(i)}">${g}<span class="file-card-name">${h}</span></a>` };
}
function em(e) {
  const t = Jh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${ut(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Tt(
  (e, t) => {
    if (t.inline) return null;
    const n = Zh(e, t) || em(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const tm = /`([^`\n]+)`/g;
Tt((e) => e.replace(tm, (t, n) => `<code>${n}</code>`));
const Yo = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${no.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Tt(
  (e, t) => e.replace(qi, (n, a, s, o) => Yo[a] ? Yo[a](s, o, t) : o)
);
const nm = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, ji = new RegExp(`\\b(${Si}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Fi = new RegExp(`\\b(${Si}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), am = new RegExp(`<code>((?:${ji.source}|${Fi.source}))</code>`, "gi"), sm = (e) => e.replace(am, "$1"), om = (e, t) => `<a class="row-pill" href="#" data-peek="${vt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, lm = (e) => e.replace(Fi, (t, n, a) => a.replace(/\d+/g, (s) => om(n.replace(/s$/i, ""), s))), im = (e) => lm(e).replace(
  ji,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${vt(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Tt(
  (e, t) => t.rowNames === !1 ? e : sm(e).split(nm).map((n, a) => a % 2 ? n : im(n)).join("")
);
const rm = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, um = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, cm = /[\w\]]\(/, dm = /^[\w$.[\]'"]+\s*=\s*[^=]/, fm = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, hm = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, mm = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, pm = /[[({,]$/, gm = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, vm = /^(\t|\s{2,})\S/, ym = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, bm = /`[^`]+`/, km = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, wm = /[{}()[\];=<>$&|*\\@+^~%]/g, Wi = /^\s*(?:[-*+]|\d+[.)])\s/, $m = /^\s*>/, xm = /^\s*\|/, Sm = 0.6, Mm = 0.4, _m = 5, Cm = 0.03, Hi = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= _m && t.every((n) => km.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(wm) ?? []).length / e.length < Cm;
}, Na = (e) => {
  const t = e.trim();
  return bm.test(t) ? !1 : [rm, um, cm, dm, fm, hm, mm, pm, gm].some((n) => n.test(t)) || /[;{}]$/.test(t) || vm.test(e) && !Wi.test(e) && !Hi(e);
};
function Am(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Wi.test(t[0]) || t.every((o) => $m.test(o) || xm.test(o))) return "text";
  const n = t.filter((o) => !ym.test(o.trim()));
  if (t.length === 1) return !n.length || Na(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(Na).length, s = n.filter((o) => !Na(o) && Hi(o)).length;
  return a >= n.length * Sm && s <= n.length * Mm ? "code" : "text";
}
const xs = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Em = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Om = `${xs} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Tm = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Im = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Qo = {
  js: { keywords: xs, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Em, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Om, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: xs, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Tm, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Im, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, Bm = {
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
function Xo(e, t, n) {
  return n && e.startsWith(n, t);
}
function Rm(e, t) {
  const n = Qo[Bm[t] ?? t] || Qo.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (Xo(e, o, n.line) || n.hash && i === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && Xo(e, o, n.block[0])) {
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
function Lm(e, t) {
  const n = [""];
  for (const { type: a, value: s } of Rm(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? ut(l) : `<span class="tok-${a}">${ut(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Nm(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const qm = 1500, Jo = /* @__PURE__ */ new WeakMap();
async function Dm(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Nm(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Jo.get(t)), Jo.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, qm)
  )));
}
typeof document < "u" && document.addEventListener("click", Dm, !0);
const Pm = /\n\s*\n/, jm = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, Fm = /^\s*(`{3,}|~{3,})\s*$/, Wm = /^\s{4,}\S/, Hm = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Ss = /^\s*(?:[-*+]|\d+[.)])\s/, zi = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, zm = [
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
function Um(e) {
  const t = so(e.join(`
`));
  return (zm.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Gm = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && zi.test(t) && !Ss.test(t);
}, Vm = (e, t) => Ss.test(t) || Ss.test([...e].reverse().find((n) => n.trim()) || "");
function oo(e, t) {
  const n = t || Um(e), a = Lm(so(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function Km(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && Fm.test(s));
  return a < 0 ? e.length : a;
}
function Ym(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return oo(a.map(Sn), n ? n.toLowerCase() : "");
}
function Qm(e) {
  const t = e.split(Pm).map((l) => ({ paragraph: l, type: Am(so(l).split(`
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
function Xm(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : Qm(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const i = n[l].match(jm);
    if (i) {
      const c = Km(n, l, i[2]);
      o(), a.push(Ym(n.slice(l + 1, c), i[1], i[3])), l = c + 1;
      continue;
    }
    const u = Gm(s) ? Hm : Wm;
    if (!t && u.test(n[l]) && !Vm(s, n[l])) {
      let c = l;
      for (; c < n.length && (u.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const f = [];
      for (; s.length && s[s.length - 1].trim() && zi.test(s[s.length - 1].trim()); ) f.unshift(s.pop());
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
Tt((e, t) => Xm(e, t.document), { first: !0 });
const Jm = ["innerHTML"], Zm = ["innerHTML"], ep = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Ni(), a = S(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (r(), d("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => R(qt) && R(qt)(...l)),
      innerHTML: a.value
    }, null, 8, Jm)) : (r(), d("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => R(qt) && R(qt)(...l)),
      innerHTML: a.value
    }, null, 8, Zm));
  }
}, it = /* @__PURE__ */ z(ep, [["__scopeId", "data-v-d8e75741"]]), L6 = (e) => [...new Set(e.agents.map((t) => t.name))], qa = (e) => new Set(e.agents.map((t) => t.id)).size === 1 ? e.agents[0] : null, tp = "main agent", lo = (e, t) => t ? tp : e, np = ["data-agent-main"], ap = {
  key: 0,
  class: "agent-badge-icon",
  "data-agent-main-icon": "",
  width: "14",
  height: "14",
  viewBox: "0 0 16 16",
  fill: "currentColor",
  "aria-hidden": "true"
}, sp = {
  key: 2,
  class: "agent-badge-name",
  "data-agent-badge-name": ""
}, op = {
  __name: "AgentBadge",
  props: { name: { type: String, required: !0 }, main: Boolean, iconOnly: Boolean },
  setup(e) {
    const t = e, n = S(() => lo(t.name, t.main));
    return (a, s) => (r(), d("span", {
      class: Y(["agent-badge", { main: e.main }]),
      "data-agent-badge": "",
      "data-agent-main": e.main ? "" : null
    }, [
      e.main ? (r(), d("svg", ap, [...s[0] || (s[0] = [
        m("circle", {
          cx: "8",
          cy: "4.8",
          r: "3.3"
        }, null, -1),
        m("path", { d: "M1.8 14.6c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6c0 .4-.3.7-.7.7H2.5c-.4 0-.7-.3-.7-.7z" }, null, -1)
      ])])) : (r(), F(le, {
        key: 1,
        class: "agent-badge-icon",
        name: "agent",
        size: 14
      })),
      e.iconOnly ? k("", !0) : (r(), d("span", sp, v(n.value), 1))
    ], 10, np));
  }
}, Pt = /* @__PURE__ */ z(op, [["__scopeId", "data-v-a4c3d1e5"]]), lp = ["aria-expanded"], ip = {
  key: 0,
  class: "state-tip",
  role: "tooltip",
  "data-state-tip": ""
}, rp = {
  key: 0,
  class: "tip-failure"
}, up = { key: 1 }, cp = {
  __name: "StateBadge",
  props: { type: { type: String, required: !0 }, state: { type: String, required: !0 }, rowId: { type: Number, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    const t = e, n = Me(Le, null), a = S(() => qd(t.type, t.state)), s = C(!1), o = C([]), l = C("");
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
      onKeydown: At(u, ["escape"])
    }, [
      K(v(R(dn)(e.type, e.state)) + " ", 1),
      s.value ? (r(), d("span", ip, [
        l.value ? (r(), d("span", rp, v(l.value), 1)) : k("", !0),
        (r(!0), d(D, null, ne(o.value, (g) => (r(), d("span", {
          key: g,
          class: "tip-line"
        }, v(g), 1))), 128))
      ])) : k("", !0)
    ], 40, lp)) : (r(), d("span", up, v(R(dn)(e.type, e.state)), 1));
  }
}, dp = /* @__PURE__ */ z(cp, [["__scopeId", "data-v-bf9353d9"]]), fp = {
  class: "plan-details",
  "data-plan-details": ""
}, hp = { class: "state-line" }, mp = {
  key: 0,
  class: "phase-count"
}, pp = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, gp = { class: "text" }, vp = {
  key: 1,
  class: "note",
  "data-plan-waits-on": ""
}, yp = {
  key: 2,
  class: "part",
  "data-plan-progress": ""
}, bp = { class: "overall" }, kp = { class: "overall-figure" }, wp = {
  key: 3,
  class: "delegation",
  "data-plan-assignee": ""
}, $p = {
  key: 4,
  class: "delegation",
  "data-plan-delegated": ""
}, xp = {
  key: 5,
  class: "part"
}, Sp = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    return (t, n) => {
      var a;
      return r(), d("div", fp, [
        m("div", hp, [
          E(dp, {
            type: "plan",
            state: e.plan.state,
            "row-id": e.plan.id,
            read: e.read,
            class: Y(["status", R(fi)("plan", e.plan.state)]),
            "data-plan-status": ""
          }, null, 8, ["state", "row-id", "read", "class"]),
          e.plan.current_phase ? (r(), d("span", mp, "Phase " + v(e.plan.current_phase) + " of " + v(e.plan.phases.length), 1)) : k("", !0)
        ]),
        e.plan.reason ? (r(), d("section", pp, [
          m("h4", null, v(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
          m("p", gp, v(e.plan.reason), 1)
        ])) : k("", !0),
        (a = e.plan.blocker_ids) != null && a.length ? (r(), d("p", vp, "Opens by itself when " + v(e.plan.blocker_ids.map((s) => `plan ${s}`).join(" and ")) + " " + v(e.plan.blocker_ids.length === 1 ? "ends" : "have ended") + ".", 1)) : k("", !0),
        e.plan.total ? (r(), d("section", yp, [
          n[0] || (n[0] = m("h4", null, "Progress", -1)),
          m("div", bp, [
            E(Ti, {
              value: e.plan.finished,
              max: e.plan.total
            }, null, 8, ["value", "max"]),
            m("span", kp, v(e.plan.finished) + " of " + v(e.plan.total) + " done", 1)
          ])
        ])) : k("", !0),
        e.plan.assignee ? (r(), d("p", wp, [
          E(Pt, {
            name: e.plan.assignee.name,
            main: e.plan.assignee.main
          }, null, 8, ["name", "main"])
        ])) : e.plan.delegated ? (r(), d("p", $p, [
          R(qa)(e.plan) ? (r(), F(Pt, {
            key: 0,
            name: R(qa)(e.plan).name,
            main: R(qa)(e.plan).main
          }, null, 8, ["name", "main"])) : (r(), d(D, { key: 1 }, [
            K(" Delegated ")
          ], 64))
        ])) : k("", !0),
        e.plan.brief ? (r(), d("section", xp, [
          n[1] || (n[1] = m("h4", null, "The brief", -1)),
          E(Oi, {
            name: `plans:${e.plan.id}:brief`,
            at: 220,
            keep: 160
          }, {
            default: P(() => [
              E(it, {
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
}, N6 = /* @__PURE__ */ z(Sp, [["__scopeId", "data-v-8c7a9053"]]), Mp = {
  __name: "HoverTip",
  props: { as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    return (t, n) => (r(), F(Ke(e.as), {
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
}, _p = /* @__PURE__ */ z(Mp, [["__scopeId", "data-v-683e1839"]]), Ui = (e) => `row:${e}`, Cp = 5e3, Ap = "cancelled", Da = /* @__PURE__ */ new Map();
async function Ep(e, t) {
  const n = `${e.environment}:${t}`, a = Da.get(n);
  if (a && performance.now() - a.at < Cp) {
    const o = await a.answer;
    if (o.failure !== Ap) return o;
    Da.delete(n);
  }
  const s = e.read(`agent tip ${Ui(t)}`);
  return Da.set(n, { answer: s, at: performance.now() }), s;
}
function Op(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function Mn(e, t = Date.now()) {
  const n = Op(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const Tp = 36e5;
function Ip(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / Tp;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function Zo(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function Gi(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function el(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const Pa = (e) => String(e).padStart(2, "0");
function Vi(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Pa(t % 60)}s` : `${Math.floor(t / 3600)}h ${Pa(Math.floor(t % 3600 / 60))}m ${Pa(t % 60)}s`;
}
const Bp = { working: { state: "working", words: "Working" }, paused: { state: "paused", words: "Paused" }, "at usage limit": { state: "limited", words: "At usage limit" }, ended: { state: "idle", words: "Idle" } }, Rp = { state: "retired", words: "Retired" }, Lp = (e) => e.retired ? Rp : Bp[e.activity], Np = (e) => [e.program, e.model, e.effort, e.role_label].filter(Boolean).join(", "), qp = (e, t) => e ? `Since: ${new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${Mn(e, t)}` : "", Dp = (e, t) => e ? `Seen: ${Mn(e, t)}` : "", Pp = {
  class: "line head",
  "data-agent-tip-head": ""
}, jp = { key: 0 }, Fp = {
  class: "line",
  "data-agent-tip-identity": ""
}, Wp = {
  class: "line status",
  "data-agent-tip-status": ""
}, Hp = ["data-state"], zp = {
  key: 0,
  class: "line",
  "data-agent-tip-since": ""
}, Up = {
  key: 1,
  class: "line",
  "data-agent-tip-seen": ""
}, Gp = {
  key: 1,
  class: "line",
  "data-agent-tip-head": ""
}, Vp = {
  key: 2,
  class: "line failure",
  "data-agent-tip-failure": ""
}, Kp = {
  __name: "AgentTip",
  props: { agentId: { type: Number, required: !0 }, label: { type: String, default: "" }, as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    const t = e, n = Me(Le, null), a = C(!1), s = C(null), o = C(""), l = C(Date.now()), i = S(() => Lp(s.value)), u = S(() => qp(s.value.since, l.value)), c = S(() => Dp(s.value.last_seen, l.value));
    async function f() {
      if (a.value = !0, !n) return;
      const h = await Ep(n, t.agentId);
      o.value = h.ok ? "" : h.error, h.ok && (l.value = Date.now(), s.value = h.value);
    }
    return (h, g) => (r(), F(_p, {
      as: e.as,
      place: e.place,
      class: "agent-tip",
      "data-agent-tip": "",
      onMouseenter: f,
      onFocusin: f
    }, Hl({
      default: P(() => [
        re(h.$slots, "default", {}, void 0, !0)
      ]),
      _: 2
    }, [
      a.value ? {
        name: "tip",
        fn: P(() => [
          s.value ? (r(), d(D, { key: 0 }, [
            m("span", Pp, [
              m("b", null, v(s.value.title), 1),
              g[0] || (g[0] = K()),
              s.value.name ? (r(), d("span", jp, v(s.value.name), 1)) : k("", !0)
            ]),
            m("span", Fp, v(R(Np)(s.value)), 1),
            m("span", Wp, [
              m("i", {
                "data-state": i.value.state
              }, null, 8, Hp),
              K(v(i.value.words), 1)
            ]),
            u.value ? (r(), d("span", zp, v(u.value), 1)) : k("", !0),
            c.value ? (r(), d("span", Up, v(c.value), 1)) : k("", !0)
          ], 64)) : (r(), d("b", Gp, v(e.label), 1)),
          o.value ? (r(), d("span", Vp, v(o.value), 1)) : k("", !0)
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["as", "place"]));
  }
}, hn = /* @__PURE__ */ z(Kp, [["__scopeId", "data-v-71d17663"]]), Yp = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, Qp = { class: "agent-word" }, Xp = {
  __name: "PlanPhaseAgents",
  props: { tasks: { type: Array, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["started", "testing"]), n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = S(() => {
      var l;
      const o = /* @__PURE__ */ new Map();
      for (const i of a.tasks.filter((u) => u.helper_id && !n.has(u.state))) {
        const u = ((l = o.get(i.helper_id)) == null ? void 0 : l.held) || t.has(i.state);
        o.set(i.helper_id, { id: i.helper_id, name: i.helper_name, main: i.helper_main, held: u });
      }
      return [...o.values()];
    });
    return (o, l) => s.value.length ? (r(), d("div", Yp, [
      (r(!0), d(D, null, ne(s.value, (i) => (r(), F(hn, {
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
          E(Pt, {
            name: i.name,
            main: i.main
          }, null, 8, ["name", "main"]),
          m("span", Qp, v(i.held ? "Working" : "Queued"), 1)
        ]),
        _: 2
      }, 1032, ["agent-id", "label", "onClick"]))), 128))
    ])) : k("", !0);
  }
}, Jp = /* @__PURE__ */ z(Xp, [["__scopeId", "data-v-619caeed"]]), Zp = { class: "phases" }, e1 = { class: "phead" }, t1 = { class: "mark" }, n1 = { class: "ptitle" }, a1 = { class: "phead-end" }, s1 = {
  key: 0,
  class: "checkpoint"
}, o1 = { class: "progress" }, l1 = {
  key: 0,
  class: "when"
}, i1 = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["completed", "cancelled"]), n = (s) => s.tasks.filter((o) => t.has(o.state)).length, a = (s) => s.tasks.length > 0 && n(s) === s.tasks.length;
    return (s, o) => (r(), d("ol", Zp, [
      (r(!0), d(D, null, ne(e.phases, (l, i) => (r(), d("li", {
        key: l.id,
        class: Y(["phase", { current: i + 1 === e.currentPhase, done: a(l) }]),
        "data-resource-phase": ""
      }, [
        m("div", e1, [
          m("span", t1, [
            E(le, {
              name: a(l) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", n1, v(i + 1) + ". " + v(l.title), 1),
          m("span", a1, [
            l.checkpoint ? (r(), d("span", s1, "checkpoint")) : k("", !0),
            m("span", o1, v(n(l)) + "/" + v(l.tasks.length), 1)
          ])
        ]),
        l.goal ? (r(), d("div", l1, v(l.goal), 1)) : k("", !0),
        E(Jp, {
          tasks: l.tasks
        }, null, 8, ["tasks"]),
        (r(!0), d(D, null, ne(l.tasks, (u) => re(s.$slots, "task", { task: u }, void 0, !0, u.id)), 128))
      ], 2))), 128))
    ]));
  }
}, q6 = /* @__PURE__ */ z(i1, [["__scopeId", "data-v-05aaa685"]]), r1 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, u1 = { ...r1, done: "Completed" }, c1 = /* @__PURE__ */ new Set(["completed", "cancelled"]), d1 = (e) => c1.has(e), mn = (e) => d1(e) ? "done" : e, f1 = { class: "task-status-icon" }, h1 = ["width", "height", "aria-label"], m1 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = S(() => fi("task", mn(t.status))), a = S(() => n.value === "testing" ? "started" : n.value), s = S(() => u1[t.status] ?? dn("task", t.status));
    return (o, l) => (r(), d("span", f1, [
      E(Vt, {
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
            E(Kt, { value: a.value }, {
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
          ], 10, h1))
        ]),
        _: 1
      })
    ]));
  }
}, wa = /* @__PURE__ */ z(m1, [["__scopeId", "data-v-ae24a63f"]]), p1 = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, g1 = {
  key: 0,
  class: "empty",
  role: "alert"
}, v1 = {
  key: 2,
  class: "empty"
}, y1 = { class: "day" }, b1 = { class: "events" }, k1 = { class: "mark" }, w1 = { class: "what" }, $1 = { class: "head" }, x1 = { class: "word" }, S1 = ["title", "onClick"], M1 = { class: "at" }, _1 = {
  __name: "PlanTimeline",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = {
      made: { state: "open", word: "Made" },
      logged: { icon: "edits", word: "Logged" },
      completed: { state: "completed", word: "Finished" },
      cancelled: { state: "cancelled", word: "Cancelled" }
    }, a = e, s = t, o = C(null), l = C(""), i = S(() => {
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
    return pe(() => a.id, c, { immediate: !0 }), (f, h) => (r(), d("section", p1, [
      l.value ? (r(), d("p", g1, v(l.value), 1)) : o.value === null ? (r(), F(Qe, { key: 1 })) : o.value.length ? k("", !0) : (r(), d("p", v1, "Nothing has happened on this plan's tasks yet.")),
      (r(!0), d(D, null, ne(i.value, (g) => (r(), d(D, {
        key: g.day
      }, [
        m("h3", y1, v(g.day), 1),
        m("ol", b1, [
          (r(!0), d(D, null, ne(g.items, (y) => (r(), d("li", {
            key: `${y.time}-${y.event_type}-${y.task_id}`,
            class: Y(["event", y.event_type]),
            "data-plan-event": ""
          }, [
            m("span", k1, [
              n[y.event_type].state ? (r(), F(wa, {
                key: 0,
                status: n[y.event_type].state
              }, null, 8, ["status"])) : (r(), F(le, {
                key: 1,
                name: n[y.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            m("div", w1, [
              m("div", $1, [
                m("span", x1, v(n[y.event_type].word), 1),
                m("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${y.task_id}`,
                  onClick: (b) => s("select", y.task_id)
                }, "#" + v(y.task_id) + " " + v(y.title), 9, S1),
                m("span", M1, v(u(y.time)), 1)
              ]),
              y.text ? (r(), F(it, {
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
}, D6 = /* @__PURE__ */ z(_1, [["__scopeId", "data-v-9e511133"]]), C1 = 1e3;
function Ki() {
  const e = C(Date.now()), t = setInterval(() => e.value = Date.now(), C1);
  return at(() => clearInterval(t)), e;
}
const A1 = Symbol("resource-subscriptions");
function _n(e, t, n = () => !0) {
  const a = Me(A1, () => new ai(), !0), s = zs(t, 100), o = a.follow("resources", e, (l) => {
    n(l) && s();
  });
  ga(() => {
    o(), s.cancel();
  });
}
function E1(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const Yi = { compact: "Compaction", clear: "Clear" }, O1 = { stop_limit: "The journal, at the context size", hard_stop: "The journal, at the second context size", person: "A user, in the viewer", auto: "The program", terminal_person: "A user, in the terminal", headless_program: "The journal, before the next job" }, T1 = { requested: "Asked, not started yet", started: "Running", ended: "Ended, size not read yet", measured: "Done", unreduced: "Done, context not smaller", failed: "Failed", abandoned: "Given up" };
function I1(e) {
  return e != null && e.is_open ? `${Yi[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
function B1(e) {
  if (!e) return [];
  const t = [["Last context change", `${Yi[e.change]}: ${T1[e.state]}`], ["Asked by", O1[e.reason]], ["Asked", new Date(e.requested_at).toLocaleString()]];
  return e.request_tokens != null && t.push(["Size at the request", `${e.request_tokens} tokens`]), e.tokens_after != null && t.push(["Size after", `${e.tokens_after} tokens`]), t;
}
const R1 = "Not known", L1 = 80, N1 = 1e3, q1 = "worker", D1 = "main", P1 = /* @__PURE__ */ new Set(["waiting", "blocked", "at usage limit"]), j1 = (e) => e.ok ? e.value.rows : [], F1 = (e, t) => e.ended_at ? "ended" : e.paused_at || P1.has(t == null ? void 0 : t.state) ? "waiting" : "running", Qi = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function W1({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / N1, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: Vi(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > L1 }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? R1 : `$${t.cost_dollars.toFixed(2)}` }), e.role === q1 && l.push({ key: "pace", label: "Tasks an hour", value: String(Ip(Qi(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === D1 && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function H1(e) {
  const t = Qi(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function z1(e, t, n = null) {
  const a = [["Number", String(e.number)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && a.push(["Parent agent", `Agent ${e.parent_id}`]), a.push(["Started by", t.started_by], ["Started", Zo(e.created_at)]), e.ended_at && a.push(["Ended", Zo(e.ended_at)]), e.pid && a.push(["Process", `pid ${e.pid}`]), a.push(...B1(n)), a;
}
const U1 = { class: "band" }, G1 = { key: 0 }, V1 = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (r(), d("h2", U1, [
      E(le, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      re(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (r(), d("span", G1, v(e.count), 1)) : k("", !0)
    ]));
  }
}, zt = /* @__PURE__ */ z(V1, [["__scopeId", "data-v-1758914f"]]), K1 = { class: "number" }, Y1 = { class: "text" }, Q1 = 150, X1 = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = C(!1), a = S(() => t.text.length > Q1), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (r(), d(D, null, [
      e.text ? (r(), d(D, { key: 0 }, [
        E(zt, { icon: "file" }, {
          default: P(() => [
            K(v(e.label), 1)
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
      e.points.length ? (r(), d(D, { key: 1 }, [
        E(zt, { icon: "points" }, {
          default: P(() => [...l[1] || (l[1] = [
            K("Points to prove", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(D, null, ne(e.points, (i) => {
          var u;
          return r(), d("p", {
            key: i.id,
            class: "point",
            "data-agent-point": ""
          }, [
            m("span", K1, v(i.id), 1),
            m("span", Y1, [
              K(v(i.text), 1),
              m("span", {
                class: Y(["proof", { checked: ((u = i.proof) == null ? void 0 : u.state) === "checked" }])
              }, v(s(i)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : k("", !0)
    ], 64));
  }
}, J1 = /* @__PURE__ */ z(X1, [["__scopeId", "data-v-c99de22c"]]), Z1 = ["aria-expanded"], eg = { class: "count" }, tg = {
  key: 0,
  "data-agent-fold-body": ""
}, ng = {
  __name: "AgentFold",
  props: /* @__PURE__ */ Ft({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = un(e, "open");
    return (n, a) => (r(), d(D, null, [
      m("button", {
        type: "button",
        class: Y(["fold", { shut: !t.value }]),
        "aria-expanded": t.value,
        "data-agent-fold": "",
        onClick: a[0] || (a[0] = (s) => t.value = !t.value)
      }, [
        E(le, {
          name: e.icon,
          size: 12
        }, null, 8, ["name"]),
        K(v(e.label), 1),
        m("span", eg, v(e.count), 1),
        E(le, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, Z1),
      t.value ? (r(), d("div", tg, [
        re(n.$slots, "default", {}, void 0, !0)
      ])) : k("", !0)
    ], 64));
  }
}, ja = /* @__PURE__ */ z(ng, [["__scopeId", "data-v-7f93d8d9"]]), ag = ["onClick"], sg = { class: "text" }, og = { class: "aside" }, lg = {
  key: 0,
  class: "none"
}, ig = {
  class: "skills",
  "data-agent-skills": ""
}, rg = {
  key: 0,
  class: "none-inline"
}, ug = { class: "label" }, cg = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = Gt({ helpers: !1, skills: !1 }), a = C([]), s = C([]), o = async (l) => j1(await t.read(l));
    return pe(() => [n.helpers, t.loads], async ([l]) => {
      l && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), pe(() => [n.skills, t.loads], async ([l]) => {
      l && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    }), (l, i) => (r(), d(D, null, [
      E(ja, {
        open: n.helpers,
        "onUpdate:open": i[0] || (i[0] = (u) => n.helpers = u),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: P(() => [
          (r(!0), d(D, null, ne(a.value, (u) => (r(), d("button", {
            key: u.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (c) => R(bt)("agents", u.id)
          }, [
            m("span", sg, v(R(Ht)(u).title), 1),
            m("span", og, v(R(Ht)(u).subtext), 1)
          ], 8, ag))), 128)),
          a.value.length ? k("", !0) : (r(), d("p", lg, "It started no helpers."))
        ]),
        _: 1
      }, 8, ["open", "count"]),
      E(ja, {
        open: n.skills,
        "onUpdate:open": i[1] || (i[1] = (u) => n.skills = u),
        icon: "style",
        label: "Skills loaded",
        count: e.counts.skills
      }, {
        default: P(() => [
          m("p", ig, [
            (r(!0), d(D, null, ne(s.value, (u) => (r(), d("span", {
              key: u.id,
              "data-agent-skill": ""
            }, v(u.skill), 1))), 128)),
            s.value.length ? k("", !0) : (r(), d("span", rg, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      E(ja, {
        icon: "rules",
        label: "Details",
        count: e.details.length
      }, {
        default: P(() => [
          (r(!0), d(D, null, ne(e.details, ([u, c, f]) => (r(), d("div", {
            key: u,
            class: "detail",
            "data-agent-detail": ""
          }, [
            m("span", ug, v(u) + ":", 1),
            m("span", {
              class: Y(["value", f])
            }, v(c), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, dg = /* @__PURE__ */ z(cg, [["__scopeId", "data-v-1281605f"]]), fg = ["datetime", "title"], nt = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Ki(), a = S(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (r(), d("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, v(R(Mn)(e.at, R(n))), 9, fg));
  }
}, hg = {
  class: "now",
  "data-agent-now": ""
}, mg = {
  key: 1,
  class: "muted"
}, pg = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, gg = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, vg = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, yg = { class: "line" }, bg = { class: "detail" }, kg = { class: "bar" }, wg = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = S(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = S(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (r(), d(D, null, [
      E(zt, { icon: "play" }, {
        default: P(() => [...o[2] || (o[2] = [
          K("Doing now", -1)
        ])]),
        _: 1
      }),
      m("div", hg, [
        e.inspection.task ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => R(bt)("tasks", e.inspection.task.id))
        }, "Task " + v(e.inspection.task.id) + ": " + v(e.inspection.task.title), 1)) : (r(), d("span", mg, v(e.nothing), 1)),
        n.value ? (r(), d("span", pg, v(n.value), 1)) : k("", !0),
        e.inspection.last_activity ? (r(), d("span", gg, [
          o[3] || (o[3] = K("Seen: ", -1)),
          E(nt, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : k("", !0)
      ]),
      e.inspection.plan ? (r(), d("div", vg, [
        m("div", yg, [
          m("span", null, "Plan " + v(e.inspection.plan.id) + ", phase " + v(e.inspection.plan.phase), 1),
          m("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => R(bt)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        m("span", bg, v(e.inspection.plan.done) + " of " + v(e.inspection.plan.total) + " tasks done", 1),
        m("div", kg, [
          m("i", {
            style: ve({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : k("", !0)
    ], 64));
  }
}, $g = /* @__PURE__ */ z(wg, [["__scopeId", "data-v-ff25c609"]]), xg = ["onClick"], Sg = { class: "text" }, Mg = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, _g = { class: "text" }, Cg = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, Ag = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d(D, null, [
      E(zt, { icon: "clock" }, {
        default: P(() => [...n[0] || (n[0] = [
          K("Recent", -1)
        ])]),
        _: 1
      }),
      (r(!0), d(D, null, ne(e.moves, (a) => (r(), d(D, {
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
          m("span", Sg, v(a.text), 1),
          E(nt, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, xg)) : (r(), d("div", Mg, [
          m("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          m("span", _g, v(a.text), 1),
          E(nt, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? k("", !0) : (r(), d("p", Cg, "Nothing yet."))
    ], 64));
  }
}, Eg = /* @__PURE__ */ z(Ag, [["__scopeId", "data-v-58f0db57"]]), Og = {
  class: "strip",
  "data-agent-strip": ""
}, Tg = ["data-agent-cell"], Ig = {
  key: 0,
  class: "meter"
}, Bg = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", Og, [
      (r(!0), d(D, null, ne(e.cells, (a) => (r(), d("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        m("small", null, v(a.label), 1),
        m("b", {
          class: Y({ bad: a.bad })
        }, v(a.value), 3),
        a.meter !== void 0 ? (r(), d("div", Ig, [
          m("i", {
            class: Y({ high: a.high }),
            style: ve({ width: `${a.meter}%` })
          }, null, 6)
        ])) : k("", !0)
      ], 8, Tg))), 128))
    ]));
  }
}, Rg = /* @__PURE__ */ z(Bg, [["__scopeId", "data-v-b6657ab7"]]), Lg = {}, Ng = { class: "menu-label" };
function qg(e, t) {
  return r(), d("span", Ng, [
    re(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Ct = /* @__PURE__ */ z(Lg, [["render", qg], ["__scopeId", "data-v-aa955b3e"]]), Dg = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, Pg = {
  key: 0,
  class: "skills-none"
}, jg = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => n.skills.filter((l) => l.state === "loaded")), o = S(() => n.skills.filter((l) => l.state !== "loaded"));
    return (l, i) => (r(), d("div", Dg, [
      E(Ct, null, {
        default: P(() => [...i[1] || (i[1] = [
          K("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      s.value.length ? k("", !0) : (r(), d("p", Pg, "None yet. Compacting the conversation empties this list.")),
      (r(!0), d(D, null, ne(s.value, (u) => (r(), d("p", {
        key: u.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        E(le, {
          name: "book",
          size: 12
        }),
        K(v(u.skill), 1)
      ]))), 128)),
      o.value.length ? (r(), d(D, { key: 1 }, [
        E(Ct, null, {
          default: P(() => [...i[2] || (i[2] = [
            K("Still to read", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(D, null, ne(o.value, (u) => (r(), d("p", {
          key: u.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          E(le, {
            name: "book",
            size: 12
          }),
          K(v(u.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      E(Ue, {
        "data-agent-skills-browse": "",
        onClick: i[0] || (i[0] = (u) => a("browse"))
      }, {
        default: P(() => [...i[3] || (i[3] = [
          K("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Fg = /* @__PURE__ */ z(jg, [["__scopeId", "data-v-be514d47"]]), Wg = ["disabled", "title"], Hg = { class: "gauge usage" }, zg = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => n.windows[0] ?? null), o = S(() => s.value && Number.isFinite(s.value.used_percent) ? Math.max(0, Math.min(100, Math.round(s.value.used_percent))) : null), l = S(() => o.value !== null && o.value >= 100), i = S(() => {
      var c;
      return (c = s.value) != null && c.reset_epoch_seconds ? new Date(s.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), u = S(() => l.value ? `At usage limit: the plan's ${s.value.title} allowance is used up${i.value ? `, starts again ${i.value}` : ""}` : `${o.value}% of the plan's ${s.value.title} allowance used${i.value ? `, starts again ${i.value}` : ""}`);
    return (c, f) => o.value !== null ? (r(), d("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: u.value,
      onClick: f[0] || (f[0] = (h) => a("open", h.currentTarget))
    }, [
      E(le, {
        name: "allowance",
        size: 12
      }),
      f[1] || (f[1] = K()),
      m("span", Hg, [
        m("span", {
          style: ve({ width: `${o.value}%` })
        }, null, 4)
      ]),
      K(" " + v(l.value ? "At usage limit" : `${o.value}%`), 1)
    ], 8, Wg)) : k("", !0);
  }
}, Ug = /* @__PURE__ */ z(zg, [["__scopeId", "data-v-a36f09dc"]]), Gg = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: Y(["badge", e.tone])
    }, v(e.text), 3));
  }
}, io = /* @__PURE__ */ z(Gg, [["__scopeId", "data-v-9e7e1157"]]);
function Vg(e, t, n, { groups: a, programs: s }) {
  const o = C({}), l = C(""), i = C(!1), u = S(() => !!e.value && !e.value.ended_at), c = S(() => u.value && !!e.value.paused_at);
  async function f(b, _ = null) {
    l.value = "";
    const M = await Kl(_, b, t);
    return l.value = M.ok ? "" : M.error, n(), M;
  }
  return { groups: a, programs: s, chosen: o, failure: l, asking: i, running: u, paused: c, choose: (b, _) => f(["agent", "control", String(e.value.number), b, _.value], { target: o, fields: { value: { ...o.value, [b]: _.label } } }), stop: () => (i.value = !1, f(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (b) => f(["agent", "launch", b.name]) };
}
const Kg = ["disabled", "title"], Yg = ["disabled", "title"], Qg = { class: "gauge" }, Xg = {
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, Jg = ["disabled", "title"], Zg = ["disabled"], ev = ["disabled"], tv = {
  key: 5,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, nv = ["title"], av = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, sv = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, ov = { class: "gauge" }, lv = { class: "context-used" }, iv = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, rv = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, uv = 75, cv = {
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
    const n = e, a = t, s = Vg(Aa(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: Aa(n, "controlGroups"), programs: Aa(n, "agentPrograms") }), o = C(null), l = C(""), i = S(() => s.groups.value.find((N) => N.key === l.value));
    function u(N, A) {
      o.value = N.currentTarget, l.value = A;
    }
    function c() {
      o.value = null, l.value = "", s.asking.value = !1;
    }
    const f = S(() => n.skills.filter((N) => N.state === "loaded"));
    function h(N) {
      u(N, "skills"), a("skills");
    }
    const g = (N) => s.groups.value.some((A) => A.key === N), y = S(() => {
      var N;
      return s.chosen.value.model ?? ((N = _.value) == null ? void 0 : N.model) ?? "";
    }), b = S(() => {
      var N;
      return s.chosen.value.effort ?? ((N = _.value) == null ? void 0 : N.effort) ?? "";
    });
    S(() => !!n.agent && !n.agent.ended_at);
    const _ = S(() => {
      var N;
      return ((N = n.usage.agents) == null ? void 0 : N.find((A) => {
        var L;
        return A.id === ((L = n.agent) == null ? void 0 : L.id);
      })) ?? null;
    }), M = S(() => {
      var N;
      return ((N = _.value) == null ? void 0 : N.context_percent) == null ? null : Math.round(_.value.context_percent);
    }), x = S(() => {
      var N;
      return I1(((N = _.value) == null ? void 0 : N.context_change) ?? null);
    }), T = (N) => `${Math.round(N / 1e3)}k`, H = S(() => {
      var N;
      return !!((N = _.value) != null && N.context_limit_tokens);
    }), W = S(() => {
      var N, A;
      return ((N = _.value) == null ? void 0 : N.context_limit_tokens) || ((A = _.value) == null ? void 0 : A.context_window_tokens) || 0;
    }), I = S(() => W.value ? `${T(_.value.context_tokens ?? 0)} of ${T(W.value)}` : ""), G = S(() => {
      var N;
      return (N = _.value) != null && N.cost_dollars ? `$${_.value.cost_dollars.toFixed(2)}` : "";
    });
    return (N, A) => {
      var L, q;
      return r(), d("div", {
        class: Y(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (r(), d(D, { key: 0 }, [
          m("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: A[0] || (A[0] = (w) => u(w, "agent"))
          }, [
            E(le, {
              name: "agents",
              size: 12
            }),
            K(" " + v(((L = e.agentPrograms.find((w) => w.name === e.agent.program)) == null ? void 0 : L.title) || e.agent.program), 1)
          ], 8, Kg),
          E(Ug, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: A[1] || (A[1] = (w) => a("open", "usage", w))
          }, null, 8, ["windows", "disabled"]),
          M.value !== null ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${M.value}% full: clear or compact it`,
            onClick: A[2] || (A[2] = (w) => g("context") ? u(w, "context") : a("open", "context", w.currentTarget))
          }, [
            E(le, {
              name: "gauge",
              size: 12
            }),
            A[14] || (A[14] = K()),
            m("span", Qg, [
              m("span", {
                style: ve({ width: `${M.value}%` })
              }, null, 4)
            ]),
            K(" " + v(M.value) + "% ", 1)
          ], 8, Yg)) : (q = _.value) != null && q.context_unknown ? (r(), d("span", Xg, [
            E(le, {
              name: "gauge",
              size: 12
            }),
            A[15] || (A[15] = K(" Context: unknown", -1))
          ])) : k("", !0),
          y.value ? (r(), d("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${y.value}: change the model`,
            onClick: A[3] || (A[3] = (w) => g("model") ? u(w, "model") : null)
          }, [
            E(le, {
              name: "model",
              size: 12
            }),
            K(" " + v(y.value), 1)
          ], 8, Jg)) : k("", !0),
          g("effort") || e.card && b.value ? (r(), d("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: A[4] || (A[4] = (w) => u(w, "effort"))
          }, [
            E(le, {
              name: "bolt",
              size: 12
            }),
            K(" " + v(b.value), 1)
          ], 8, Zg)) : k("", !0),
          G.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: A[5] || (A[5] = (w) => a("open", "cost", w.currentTarget))
          }, v(G.value), 9, ev)) : k("", !0),
          e.branch ? (r(), d("span", tv, [
            E(le, {
              name: "branch",
              size: 12
            }),
            K(" " + v(e.branch), 1)
          ])) : k("", !0),
          e.card ? k("", !0) : (r(), d("button", {
            key: 6,
            type: "button",
            class: Y(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: A[6] || (A[6] = (w) => a("open", "jobs", w.currentTarget))
          }, [
            E(le, {
              name: "clock",
              size: 12
            }),
            K(" " + v(e.jobs), 1)
          ], 2)),
          e.run ? (r(), d("button", {
            key: 7,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: h
          }, [
            E(le, {
              name: "book",
              size: 12
            }),
            K(" " + v(f.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (r(), d(D, { key: 8 }, [
            m("button", {
              type: "button",
              class: Y(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < uv }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: A[7] || (A[7] = (w) => a("open", "fitness", w.currentTarget))
            }, [
              E(le, {
                name: "heart",
                size: 12
              }),
              K(" " + v(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            m("button", {
              type: "button",
              class: Y(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: A[8] || (A[8] = (w) => a("open", "load", w.currentTarget))
            }, [
              E(le, {
                name: "weight",
                size: 12
              }),
              K(" " + v(e.fitness.workload), 1)
            ], 2)
          ], 64)) : k("", !0)
        ], 64)) : e.run && !e.loading ? (r(), d("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: A[9] || (A[9] = (w) => u(w, "start"))
        }, [
          E(le, {
            name: "agents",
            size: 12
          }),
          A[16] || (A[16] = K(" Start an agent", -1))
        ])) : k("", !0),
        A[22] || (A[22] = m("span", { class: "space" }, null, -1)),
        R(s).failure.value ? (r(), d("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: R(s).failure.value
        }, v(R(s).failure.value), 9, nv)) : k("", !0),
        re(N.$slots, "default", {}, void 0, !0),
        o.value ? (r(), F(va, {
          key: 3,
          anchor: o.value,
          "min-width": 190,
          onClose: c
        }, {
          default: P(() => {
            var w;
            return [
              l.value === "agent" ? (r(), d(D, { key: 0 }, [
                R(s).asking.value ? (r(), d(D, { key: 0 }, [
                  E(Ct, { "data-agent-stop-ask": "" }, {
                    default: P(() => [...A[17] || (A[17] = [
                      K("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  E(Ue, {
                    "data-agent-stop-confirm": "",
                    onClick: A[10] || (A[10] = (p) => (c(), R(s).stop()))
                  }, {
                    default: P(() => [...A[18] || (A[18] = [
                      K("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  E(Ue, {
                    onClick: A[11] || (A[11] = (p) => R(s).asking.value = !1)
                  }, {
                    default: P(() => [...A[19] || (A[19] = [
                      K("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (r(), F(Ue, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: A[12] || (A[12] = (p) => R(s).asking.value = !0)
                }, {
                  default: P(() => [...A[20] || (A[20] = [
                    K("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : l.value === "start" ? (r(), d(D, { key: 1 }, [
                E(Ct, null, {
                  default: P(() => [...A[21] || (A[21] = [
                    K("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (r(!0), d(D, null, ne(R(s).programs.value, (p) => (r(), F(Ue, {
                  key: p.name,
                  "data-agent-program": p.name,
                  onClick: ($) => (c(), R(s).start(p))
                }, {
                  default: P(() => [
                    K(v(p.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : l.value === "skills" ? (r(), F(Fg, {
                key: 2,
                skills: e.skills,
                onBrowse: A[13] || (A[13] = (p) => (c(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : i.value ? (r(), d(D, { key: 3 }, [
                E(Ct, null, {
                  default: P(() => [
                    K(v(i.value.label), 1)
                  ]),
                  _: 1
                }),
                l.value === "context" ? (r(), d(D, { key: 0 }, [
                  m("p", av, v(R(E1)(((w = _.value) == null ? void 0 : w.last_compaction) ?? null)), 1),
                  m("div", sv, [
                    m("span", ov, [
                      m("span", {
                        style: ve({ width: `${M.value}%` })
                      }, null, 4)
                    ]),
                    m("span", lv, v(M.value) + "%", 1)
                  ]),
                  I.value ? (r(), d("p", iv, [
                    K(v(I.value) + " ", 1),
                    H.value ? (r(), F(io, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : k("", !0)
                  ])) : k("", !0)
                ], 64)) : k("", !0),
                l.value === "context" && x.value ? (r(), d("p", rv, v(x.value), 1)) : (r(!0), d(D, { key: 2 }, ne(i.value.choices, (p) => (r(), F(Ue, {
                  key: p.value,
                  "data-agent-choice": p.value,
                  onClick: ($) => (R(s).choose(i.value.key, p), c())
                }, {
                  default: P(() => [
                    K(v(p.label), 1)
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
}, dv = /* @__PURE__ */ z(cv, [["__scopeId", "data-v-d7113347"]]), fv = {
  class: "who",
  "data-agent-who": ""
}, hv = { class: "name" }, mv = ["data-agent-state"], pv = {
  class: "sub",
  "data-agent-started-by": ""
}, gv = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, startedBy: { type: String, required: !0 }, agent: { type: Object, required: !0 }, programs: { type: Array, default: () => [] }, usage: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", fv, [
      m("h2", hv, [
        m("i", {
          class: Y(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, mv),
        K(v(e.name), 1)
      ]),
      E(dv, {
        class: "bar",
        agent: e.agent,
        "agent-programs": e.programs,
        usage: e.usage,
        card: ""
      }, null, 8, ["agent", "agent-programs", "usage"]),
      m("p", pv, "Started by: " + v(e.startedBy), 1)
    ]));
  }
}, vv = /* @__PURE__ */ z(gv, [["__scopeId", "data-v-83bd4a9d"]]), yv = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, bv = { class: "scroll" }, kv = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, wv = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, $v = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Ki(), a = C(null), s = C(null), o = C(null), l = C(null), i = C({}), u = C({ helpers: 0, skills: 0 }), c = C(0), f = C([]), h = C([]), g = C("");
    let y = 0;
    const b = S(() => {
      var T;
      return a.value.ended_at ? H1(s.value) : `It has no task.${(T = s.value) != null && T.instruction ? " It was given an instruction." : ""}`;
    });
    async function _() {
      const T = ++y, H = await t.read(["usage", "inspector", Ui(t.id), "--environment", t.environment]);
      T === y && (g.value = H.ok ? "" : H.error, H.ok && (a.value = H.value.agent, s.value = H.value.facts, o.value = H.value.inspection, l.value = H.value.compaction ?? null, i.value = H.value.tool, u.value = { helpers: H.value.helpers, skills: H.value.skills }, f.value = H.value.points, h.value = H.value.programs, c.value += 1));
    }
    const M = S(() => /* @__PURE__ */ new Set([t.id])), x = {
      agent: (T) => si(T, M.value),
      hook_call: (T) => wc(T, "session_agent_id", M.value)
    };
    return _n(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], _, (T) => {
      var H;
      return ((H = x[T.event.split(".")[0]]) == null ? void 0 : H.call(x, T)) ?? !0;
    }), _e(_), (T, H) => {
      var W, I;
      return r(), d("article", yv, [
        m("div", bv, [
          g.value ? (r(), d("p", kv, v(g.value), 1)) : a.value && o.value ? (r(), d(D, { key: 1 }, [
            E(vv, {
              name: R(Ht)(a.value, s.value).text,
              state: R(F1)(a.value, s.value),
              "started-by": o.value.started_by,
              agent: a.value,
              programs: h.value,
              usage: { agents: s.value ? [s.value] : [], windows: ((W = s.value) == null ? void 0 : W.windows) ?? [] }
            }, null, 8, ["name", "state", "started-by", "agent", "programs", "usage"]),
            E(Rg, {
              cells: R(W1)({ row: a.value, facts: s.value, inspection: o.value, now: R(n) })
            }, null, 8, ["cells"]),
            E($g, {
              inspection: o.value,
              tool: i.value,
              nothing: b.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            E(J1, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((I = s.value) == null ? void 0 : I.instruction) ?? "",
              points: f.value
            }, null, 8, ["label", "text", "points"]),
            E(Eg, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            E(dg, {
              id: e.id,
              read: e.read,
              counts: u.value,
              loads: c.value,
              details: R(z1)(a.value, o.value, l.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (r(), d("p", wv, "Ended " + v(R(Mn)(a.value.ended_at, R(n))) + ". It takes no more actions.", 1)) : k("", !0)
          ], 64)) : (r(), F(Qe, { key: 2 }))
        ])
      ]);
    };
  }
}, P6 = /* @__PURE__ */ z($v, [["__scopeId", "data-v-b88512f5"]]);
function xv(e) {
  const t = C(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return _e(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), at(() => n.disconnect()), t;
}
const Sv = ["data-comment-id"], Mv = {
  key: 0,
  class: "comment-top"
}, _v = { class: "comment-mark" }, Cv = {
  class: "comment-body",
  "data-comment": ""
}, Av = { class: "comment-foot" }, Ev = {
  key: 1,
  "data-comment-lost": ""
}, Ov = {
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
      e.comment.quote ? (r(), d("div", Mv, [
        m("span", _v, v(e.comment.number), 1),
        m("span", {
          class: Y(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, v(e.comment.quote), 3)
      ])) : k("", !0),
      m("p", Cv, v(e.comment.body), 1),
      m("div", Av, [
        e.comment.created_at ? (r(), F(nt, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : k("", !0),
        e.lost ? (r(), d("span", Ev, "The text has changed here")) : e.comment.quote ? (r(), d("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : k("", !0)
      ])
    ], 10, Sv));
  }
}, Xi = /* @__PURE__ */ z(Ov, [["__scopeId", "data-v-a37d4507"]]);
var Wl;
/Mac|iPhone|iPad/.test(((Wl = navigator.userAgentData) == null ? void 0 : Wl.platform) || navigator.platform);
function Ji(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const Tv = {
  class: "comment-box",
  "data-comment-box": ""
}, Iv = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, Bv = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, Rv = { class: "comment-row" }, Lv = ["placeholder"], Nv = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ Ft({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ Ft(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = un(e, "draft"), l = C(""), i = C(!1), u = C(null), c = S(() => {
      var y;
      return ((y = a.selection) == null ? void 0 : y.selection_type) === "code";
    }), f = S(() => a.narrow ? "Write a comment" : "Write a comment, or select text to comment on a selection");
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
    return t({ focus: () => u.value.focus() }), (y, b) => (r(), d("div", Tv, [
      e.selection ? (r(), d("div", Iv, [
        b[3] || (b[3] = m("span", { class: "comment-on-label" }, "On this selection", -1)),
        m("span", {
          class: Y(["comment-on-words", { mono: c.value }])
        }, v(e.selection.quote), 3),
        E(ya, {
          title: "Comment on the whole document instead",
          onClick: b[0] || (b[0] = (_) => s("clear"))
        })
      ])) : k("", !0),
      l.value ? (r(), d("p", Bv, v(l.value), 1)) : k("", !0),
      m("div", Rv, [
        tt(m("textarea", {
          ref_key: "box",
          ref: u,
          "onUpdate:modelValue": b[1] || (b[1] = (_) => o.value = _),
          rows: "1",
          maxlength: "2000",
          class: Y({ on: o.value }),
          placeholder: f.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: h,
          onKeydown: b[2] || (b[2] = At((_) => R(Ji)(_, g), ["enter"]))
        }, null, 42, Lv), [
          [ta, o.value]
        ]),
        E(ge, {
          variant: "primary",
          busy: i.value,
          disabled: !o.value.trim(),
          "data-comment-send": "",
          onClick: g
        }, {
          default: P(() => [...b[4] || (b[4] = [
            K("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, qv = /* @__PURE__ */ z(Nv, [["__scopeId", "data-v-41d2081c"]]), Pn = (e) => e ? e.split(", ") : [];
function Dv({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function Pv(e, t) {
  return {
    reads: Pn(e.reads_allowed),
    runs: Pn(e.runs_allowed),
    missing: [...Pn(e.reads_missing), ...Pn(e.runs_missing)],
    ask: t
  };
}
const jv = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = cu("SkeletonParts", !0);
      return r(!0), d(D, null, ne(e.parts, (u, c) => (r(), d(D, { key: c }, [
        (r(!0), d(D, null, ne(u.count, (f) => (r(), F(Kt, {
          key: f,
          value: u.shape
        }, {
          line: P(() => [
            E(nn, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ve({ width: u.width, height: `${t[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: P(() => [
            E(nn, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ve({ width: `${n[u.size]}px`, height: `${n[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: P(() => [
            E(nn, {
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
              E(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: P(() => [
            m("div", {
              class: "skeleton-stack",
              style: ve(a(u))
            }, [
              E(i, {
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
              E(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: P(() => [
            m("div", {
              class: "skeleton-grid",
              style: ve(s(u))
            }, [
              E(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), Fv = /* @__PURE__ */ z(jv, [["__scopeId", "data-v-fa8baeaf"]]), Wv = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, Hv = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (r(), d("div", Wv, [
      E(Fv, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, ro = /* @__PURE__ */ z(Hv, [["__scopeId", "data-v-52f66b64"]]), Zi = {
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
}, zv = { class: "bars" }, Uv = { class: "bar-name" }, Gv = { class: "bar-value" }, Vv = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = S(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (r(), d("div", zv, [
      (r(!0), d(D, null, ne(e.items, (u, c) => (r(), F(Ke(u.open ? "button" : "div"), {
        key: `${c}-${u.label}`,
        type: u.open ? "button" : void 0,
        class: Y(["bar-row", u.tone, { opens: u.open }]),
        onClick: (f) => u.open && a("open", u.open)
      }, {
        default: P(() => [
          m("span", Uv, v(u.label), 1),
          E(Ti, {
            value: Number(u.value) || 0,
            max: s.value,
            tone: u.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          m("span", Gv, v(u.value) + v(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Kv = /* @__PURE__ */ z(Vv, [["__scopeId", "data-v-663427f4"]]), Yv = { class: "bars" }, Qv = {
  key: 0,
  class: "bars-title"
}, Xv = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", Yv, [
      e.node.title ? (r(), d("span", Qv, v(e.node.title), 1)) : k("", !0),
      E(Kv, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Jv = /* @__PURE__ */ z(Xv, [["__scopeId", "data-v-7135bb11"]]), Zv = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = S(() => n[a.node.type](a.node));
    return (l, i) => (r(), d("div", {
      class: Y([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ve(o.value)
    }, [
      (r(!0), d(D, null, ne(e.node.children || [], (u, c) => (r(), F(tr, {
        key: c,
        node: u,
        onOpen: i[0] || (i[0] = (f) => s("open", f)),
        onFile: i[1] || (i[1] = (f) => s("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, er = /* @__PURE__ */ z(Zv, [["__scopeId", "data-v-d142a3f4"]]), ey = {
  key: 0,
  class: "card-head"
}, ty = { class: "card-title" }, ny = {
  key: 0,
  class: "card-note"
}, ay = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", {
      class: Y(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (r(), d("header", ey, [
        m("span", ty, v(e.node.title), 1),
        e.node.note ? (r(), d("span", ny, v(e.node.note), 1)) : k("", !0)
      ])) : k("", !0),
      E(er, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, sy = /* @__PURE__ */ z(ay, [["__scopeId", "data-v-67b72d40"]]), oy = { class: "fact" }, ly = { class: "fact-label" }, iy = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", oy, [
      m("span", ly, v(e.label), 1),
      E(it, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, ry = /* @__PURE__ */ z(iy, [["__scopeId", "data-v-3a88ecf8"]]), uy = { class: "list" }, cy = { class: "list-label" }, dy = {
  key: 1,
  class: "list-note"
}, fy = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", uy, [
      (r(!0), d(D, null, ne(e.items, (o, l) => (r(), F(Ke(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Y(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: P(() => [
          m("span", cy, v(o.label), 1),
          o.badge ? (r(), F(io, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : k("", !0),
          o.note ? (r(), d("span", dy, v(o.note), 1)) : k("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, hy = /* @__PURE__ */ z(fy, [["__scopeId", "data-v-ebe2ae0a"]]), my = { class: "table" }, py = {
  key: 0,
  class: "table-row empty"
}, gy = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (r(), d("div", my, [
      m("div", {
        class: "table-row head",
        style: ve(s.value)
      }, [
        (r(!0), d(D, null, ne(e.columns, (i) => (r(), d("span", {
          key: i,
          class: "cell"
        }, v(i), 1))), 128))
      ], 4),
      (r(!0), d(D, null, ne(e.rows, (i, u) => (r(), F(Ke(i.open ? "button" : "div"), {
        key: u,
        type: i.open ? "button" : void 0,
        class: Y(["table-row", i.tone, { opens: i.open }]),
        style: ve(s.value),
        onClick: (c) => i.open && a("open", i.open)
      }, {
        default: P(() => [
          (r(!0), d(D, null, ne(i.cells, (c, f) => (r(), d("span", {
            key: f,
            class: "cell"
          }, v(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (r(), d("div", py, v(e.empty), 1)) : k("", !0)
    ]));
  }
}, vy = /* @__PURE__ */ z(gy, [["__scopeId", "data-v-9326a52e"]]), yy = { class: "stat-value" }, by = { class: "stat-label" }, ky = {
  key: 0,
  class: "stat-note"
}, wy = {
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
    return (a, s) => (r(), F(Ke(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Y(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: P(() => [
        m("span", yy, v(e.value), 1),
        m("span", by, v(e.label), 1),
        e.note ? (r(), d("span", ky, v(e.note), 1)) : k("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, $y = /* @__PURE__ */ z(wy, [["__scopeId", "data-v-ad0db6d6"]]), xy = { class: "code" }, Sy = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = e, a = ["stack", "row", "grid"], s = S(() => a.includes(n.node.type) ? "group" : n.node.type), o = t, l = (u) => o("open", u), i = (u) => o("file", u);
    return (u, c) => (r(), F(Kt, { value: s.value }, {
      group: P(() => [
        E(er, {
          node: e.node,
          onOpen: l,
          onFile: i
        }, null, 8, ["node"])
      ]),
      card: P(() => [
        E(sy, {
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
        E($y, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: c[0] || (c[0] = (f) => l(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: P(() => [
        E(Jv, {
          node: e.node,
          onOpen: l
        }, null, 8, ["node"])
      ]),
      table: P(() => [
        E(vy, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: l
        }, null, 8, ["columns", "rows"])
      ]),
      list: P(() => [
        E(hy, {
          items: e.node.items,
          onOpen: l
        }, null, 8, ["items"])
      ]),
      text: P(() => [
        E(it, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: P(() => [
        E(ry, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: P(() => [
        E(io, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: P(() => [
        m("pre", xy, [
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
}), tr = /* @__PURE__ */ z(Sy, [["__scopeId", "data-v-b9156b43"]]), My = { class: "dashboard" }, _y = { class: "trail" }, Cy = ["onClick"], Ay = {
  key: 0,
  class: "gone",
  role: "status"
}, Ey = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (g) => g in (n.document.pages || {}), o = C(!!n.page && !s(n.page)), l = C(n.page && !o.value ? [n.page] : []), i = S(() => l.value.at(-1) || n.document.start), u = S(() => (n.document.pages || {})[i.value] || null), c = (g) => ((n.document.pages || {})[g] || {}).title || g, f = (g) => {
      o.value = !1, l.value = [...l.value, g];
    }, h = (g) => {
      o.value = !1, l.value = l.value.slice(0, g);
    };
    return pe(
      () => n.document.start,
      () => l.value = []
    ), (g, y) => (r(), d("div", My, [
      e.document.broken ? (r(), F(cn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: P(() => [
          K(v(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (r(), F(cn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: P(() => [
          K(v(e.document.missing), 1)
        ]),
        _: 1
      })) : u.value ? (r(), d(D, { key: 2 }, [
        m("nav", _y, [
          m("button", {
            type: "button",
            class: Y(["step", { current: !l.value.length }]),
            onClick: y[0] || (y[0] = (b) => h(0))
          }, v(c(e.document.start)), 3),
          (r(!0), d(D, null, ne(l.value, (b, _) => (r(), d(D, {
            key: `${_}-${b}`
          }, [
            y[2] || (y[2] = m("span", { class: "sep" }, "/", -1)),
            m("button", {
              type: "button",
              class: Y(["step", { current: _ === l.value.length - 1 }]),
              onClick: (M) => h(_ + 1)
            }, v(c(b)), 11, Cy)
          ], 64))), 128))
        ]),
        o.value ? (r(), d("p", Ay, "What you opened is no longer in this dashboard. Here is its start page.")) : k("", !0),
        E(Vt, {
          name: "page",
          mode: "out-in"
        }, {
          default: P(() => [
            (r(), d("div", {
              key: i.value,
              class: "page"
            }, [
              E(tr, {
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
}, Oy = /* @__PURE__ */ z(Ey, [["__scopeId", "data-v-fbe83734"]]);
function Ty(e, t) {
  const n = st(), a = zs(e, Zi.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  _e(e), at(() => {
    s(), a.cancel();
  });
}
const Iy = {
  key: 0,
  class: "window-failure"
}, By = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = st(), o = C(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? Ty(l, n.events) : Ws(l, () => !0, Zi.documentWithNoEvents), (i, u) => o.value && !o.value.ok ? (r(), d("p", Iy, v(o.value.error), 1)) : o.value ? (r(), F(Oy, {
      key: 1,
      document: o.value.value,
      onFile: u[0] || (u[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : k("", !0);
  }
}, Ry = 1e4;
class Ly {
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
    return this.heardAt !== null && t - this.heardAt > Ry;
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
const Ny = {
  key: 0,
  class: "frame-note"
}, qy = {
  key: 0,
  class: "frame-note"
}, Dy = ["src", "title"], Py = 1e3, jy = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = st(), a = C(null), s = C(!1), o = C(!1);
    let l = null, i = 0;
    return _e(() => {
      l = new Ly(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, Py);
    }), Re(() => {
      l == null || l.stop(), clearInterval(i);
    }), (u, c) => o.value ? (r(), d("p", Ny, "This window was closed because it stopped answering.")) : (r(), d(D, { key: 1 }, [
      s.value ? (r(), d("div", qy, [
        c[2] || (c[2] = m("p", null, "This window has not answered for ten seconds.", -1)),
        E(ge, {
          onClick: c[0] || (c[0] = (f) => o.value = !0)
        }, {
          default: P(() => [...c[1] || (c[1] = [
            K("Close the window", -1)
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
      }, null, 8, Dy)
    ], 64));
  }
}, Fy = /* @__PURE__ */ z(jy, [["__scopeId", "data-v-32a49046"]]), Wy = {
  class: "allowance-prompt",
  role: "dialog"
}, Hy = { class: "allowance-prompt-text" }, zy = { class: "allowance-prompt-buttons" }, Uy = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", Wy, [
      m("p", Hy, v(R(Dv)(e.request)), 1),
      m("div", zy, [
        E(ge, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: P(() => [...s[2] || (s[2] = [
            K("Allow", -1)
          ])]),
          _: 1
        }),
        E(ge, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: P(() => [...s[3] || (s[3] = [
            K("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Gy = /* @__PURE__ */ z(Uy, [["__scopeId", "data-v-cad69fe2"]]), Fa = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), F(cn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: P(() => [
        K(v(e.reason) + " ", 1),
        e.retry ? (r(), F(ge, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: P(() => [...s[2] || (s[2] = [
            K("Retry", -1)
          ])]),
          _: 1
        })) : k("", !0),
        e.removable ? (r(), F(ge, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: P(() => [...s[3] || (s[3] = [
            K("Remove tab", -1)
          ])]),
          _: 1
        })) : k("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Vy = ["data-window", "data-agent"], Ky = {
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
    const i = Me(Ic, null), u = Hd({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: S(() => n.options),
      declared: n.declared,
      page: Me(Dd, null),
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
    Ps(Le, u), pe(() => n.visible, (h) => h && n.subscriptions.shown(n.name)), _e(u.settle), Re(() => {
      u.cancel(), n.subscriptions.stopAll(n.name);
    }), du((h) => (s.value = h instanceof Error ? h.message : String(h), n.subscriptions.stopAll(n.name), !1));
    const c = () => ma(n.component), f = () => {
      var h, g;
      return ((g = (h = n.prompts) == null ? void 0 : h.current.value) == null ? void 0 : g.window) === n.name ? n.prompts.current.value : null;
    };
    return (h, g) => (r(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (r(), F(Gy, {
        key: 0,
        request: f(),
        onAnswer: g[0] || (g[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : k("", !0),
      e.unavailableReason ? (r(), F(Fa, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (r(), F(Fa, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (r(), d(D, { key: 4 }, [
        (r(), F(c, { key: o.value })),
        e.skeleton.length && !R(u).answered.value ? (r(), F(ro, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : k("", !0)
      ], 64)) : (r(), F(Fa, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: g[1] || (g[1] = (y) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, Vy));
  }
}, an = /* @__PURE__ */ z(Ky, [["__scopeId", "data-v-c4443e2b"]]), nr = {
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
    const n = e, a = t, s = { render: () => ma(Fy, { src: n.entry.entry_url }) };
    return (o, l) => (r(), F(an, {
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
}, Yy = ["data-window"], ar = {
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
    const n = e, a = t, s = et(null), o = C("");
    return pe(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, Yu();
          } catch (i) {
            if (Vu(i) && Ku(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (l, i) => !s.value && !o.value && !e.entry.unavailable_reason ? (r(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      E(ro, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, Yy)) : (r(), F(an, {
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
}, Qy = {
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
    const n = t, a = e, s = S(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = S(() => s.value && { render: () => ma(By, { line: s.value.line, events: s.value.events }) }), l = C(null), i = S(() => {
      var g, y;
      return ((g = s.value) == null ? void 0 : g.loading) === "component" && !s.value.allowed && !((y = l.value) != null && y.component_trusted);
    }), u = S(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = S(
      () => {
        var g, y;
        return l.value ? Pv(l.value, h) : { reads: ((g = s.value) == null ? void 0 : g.reads) || [], runs: ((y = s.value) == null ? void 0 : y.runs) || [], missing: [], ask: async () => !0 };
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
      var b, _;
      return !s.value && ((b = e.catalogue.loaded) == null ? void 0 : b.value) === !1 ? (r(), F(ro, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((_ = s.value) == null ? void 0 : _.shows) === "one-agent" && e.agent === null ? (r(), F(cn, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (r(), F(an, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": u.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (r(), F(ar, {
        key: c.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[0] || (y[0] = (M, x) => n("option", M, x))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (r(), F(nr, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[1] || (y[1] = (M, x) => n("option", M, x))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (r(), F(an, {
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
        onOption: y[2] || (y[2] = (M, x) => n("option", M, x))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (r(), F(an, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: y[3] || (y[3] = (M) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, Xy = ["data-section"], Jy = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, Zy = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Me(Ys, null), a = S(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = S(() => ({ row: t.row }));
    return (o, l) => R(n) ? (r(!0), d(D, { key: 0 }, ne(a.value, (i) => (r(), d("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (r(), F(Qy, {
        key: 0,
        name: i.name,
        catalogue: R(n).catalogue,
        subscriptions: R(n).subscriptions,
        environment: R(n).environment,
        prompts: R(n).prompts,
        "shell-read": R(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (r(), d("p", Jy, v(i.name) + " is not available", 1))
    ], 8, Xy))), 128)) : k("", !0);
  }
}, Ms = /* @__PURE__ */ z(Zy, [["__scopeId", "data-v-a47d36b7"]]), e0 = { class: "rail-head" }, t0 = { key: 0 }, n0 = {
  key: 1,
  class: "rail-none"
}, a0 = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (r(), d("aside", {
      class: Y(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      m("div", e0, [
        n[0] || (n[0] = m("h3", null, "Comments", -1)),
        e.comments.length ? (r(), d("span", t0, v(e.total || e.comments.length), 1)) : k("", !0)
      ]),
      e.comments.length ? (r(!0), d(D, { key: 0 }, ne(e.comments, (a) => (r(), F(Xi, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (r(), d("p", n0, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, s0 = /* @__PURE__ */ z(a0, [["__scopeId", "data-v-4d684649"]]), o0 = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, l0 = ["aria-pressed"], i0 = ["aria-pressed"], r0 = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, u0 = {
  key: 0,
  role: "alert"
}, c0 = {
  key: 1,
  class: "sidebar-none"
}, d0 = ["data-question-id"], f0 = { class: "question-state" }, h0 = ["data-question-show", "onClick"], m0 = {
  key: 0,
  class: "sidebar-none"
}, p0 = {
  key: 1,
  class: "question-answer"
}, g0 = {
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
      m("nav", o0, [
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, l0),
        m("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, i0)
      ]),
      e.mode === "comments" ? (r(), d(D, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (r(), F(s0, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : k("", !0),
        E($n, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (r(), d("aside", r0, [
        e.failure ? (r(), d("p", u0, v(e.failure), 1)) : e.questions.length ? k("", !0) : (r(), d("p", c0, "No questions about this text yet.")),
        (r(!0), d(D, null, ne(e.questions, (s) => {
          var o;
          return r(), d("section", {
            key: s.id,
            class: Y(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            m("span", f0, v(R(dn)("question", s.state)), 1),
            m("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, v(s.text), 9, h0),
            s.quote ? (r(), d(D, { key: 0 }, [
              m("blockquote", null, v(s.quote), 1),
              e.lost.includes(s.id) ? (r(), d("p", m0, "The quoted text has changed.")) : k("", !0)
            ], 64)) : k("", !0),
            s.answer ? (r(), d("p", p0, "Answered: " + v(s.answer), 1)) : k("", !0),
            E(Ms, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            E(eo, {
              name: "row.question",
              row: { ...s, term: "question" },
              environment: ((o = R(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, d0);
        }), 128))
      ]))
    ], 2));
  }
}, tl = /* @__PURE__ */ z(g0, [["__scopeId", "data-v-660e5c85"]]), v0 = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, y0 = {
  __name: "DocumentEditDialog",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Gt({ abstract: n.row.abstract, body: n.row.body }), o = C("");
    async function l() {
      const i = await n.read([n.term, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = i.ok ? "" : i.error, i.ok && a("saved");
    }
    return (i, u) => (r(), F(ba, {
      padded: "",
      title: "Edit the document",
      wide: "",
      onClose: u[3] || (u[3] = (c) => a("close"))
    }, {
      foot: P(() => [
        m("span", v0, v(o.value), 1),
        E(ge, {
          onClick: u[2] || (u[2] = (c) => a("close"))
        }, {
          default: P(() => [...u[6] || (u[6] = [
            K("Cancel", -1)
          ])]),
          _: 1
        }),
        E(ge, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: P(() => [...u[7] || (u[7] = [
            K("Save", -1)
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
            tt(m("input", {
              "onUpdate:modelValue": u[0] || (u[0] = (c) => s.abstract = c)
            }, null, 512), [
              [ta, s.abstract]
            ])
          ]),
          m("label", null, [
            u[5] || (u[5] = m("span", null, "Text", -1)),
            tt(m("textarea", {
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
}, b0 = /* @__PURE__ */ z(y0, [["__scopeId", "data-v-464d77a8"]]);
function sr(e, t) {
  const n = C([]), a = C(!1), s = C(null), o = C(0), l = C(!1), i = C("");
  let u = 0, c = 0;
  const f = (b) => {
    if (typeof b.body == "string") return b.body;
    const { term: _, id: M, title: x } = e(), T = `On ${_} ${M}, ${x}: `;
    return b.text.startsWith(T) ? b.text.slice(T.length) : b.text;
  };
  async function h(b = 1) {
    const { term: _, id: M } = e();
    if (!M) return;
    const x = ++c;
    l.value = !0, i.value = "";
    try {
      const T = await t([_, "comments", String(M), "--page", String(b), "--page-size", "25"]);
      if (x !== c) return;
      if (!T.ok) {
        i.value = T.error;
        return;
      }
      const H = T.value.rows ?? [], W = b === 1 ? H : [...n.value, ...H];
      n.value = [...new Map(W.map((I) => [I.id, I])).values()], o.value = T.value.total ?? n.value.length, s.value = T.value.next_page ?? null;
    } catch (T) {
      x === c && (i.value = T.message);
    } finally {
      x === c && (l.value = !1);
    }
  }
  async function g(b) {
    var I;
    const { term: _, id: M } = e(), x = `${_}:${M}`, T = { id: `sending-${++u}`, text: b };
    n.value = [...n.value, T], o.value++, a.value = !0;
    const H = await t([_, "comment", String(M), b]);
    if (x !== `${e().term}:${e().id}`) return;
    if (!H.ok)
      throw n.value = n.value.filter((G) => G.id !== T.id), o.value = Math.max(0, o.value - 1), new Error(H.error);
    await h();
    const W = (I = H.value) == null ? void 0 : I.id;
    W && !n.value.some((G) => G.id === W) && (n.value = [...n.value, { ...T, id: W }]);
  }
  const y = () => !l.value && s.value && h(s.value);
  return pe(() => `${e().term}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, i.value = "", c++, h();
  }, { immediate: !0 }), { comments: n, open: a, words: f, send: g, load: h, loadMore: y, nextPage: s, total: o, loading: l, failure: i };
}
function k0(e, t) {
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
const w0 = {
  class: "document-tab",
  "data-document-revisions": ""
}, $0 = ["datetime"], x0 = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, S0 = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, M0 = {
  key: 2,
  class: "document-none"
}, _0 = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(null), o = C(""), l = S(() => s.value ? k0(s.value.body, n.text) : []);
    async function i(c) {
      const f = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = f.ok ? f.value : null, o.value = f.ok ? "" : f.error;
    }
    async function u() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, f) => (r(), d("div", w0, [
      e.editing ? (r(), F(ge, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: f[0] || (f[0] = (h) => a("close-revision"))
      }, {
        default: P(() => [...f[1] || (f[1] = [
          K("Close the open revision", -1)
        ])]),
        _: 1
      })) : k("", !0),
      e.revisions.length ? (r(), d(D, { key: 1 }, [
        (r(!0), d(D, null, ne(e.revisions, (h) => (r(), F(ge, {
          key: h.number,
          variant: "text",
          "data-text-revision": h.number,
          onClick: (g) => i(h)
        }, {
          default: P(() => [
            K("Revision " + v(h.number) + ": " + v(h.change) + " · " + v(h.author_name) + " · ", 1),
            m("time", {
              datetime: h.created_at
            }, v(h.created_at.slice(0, 16).replace("T", " ")), 9, $0)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (r(), d("p", x0, v(o.value), 1)) : k("", !0),
        s.value ? (r(), d(D, { key: 1 }, [
          E(ge, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: u
          }, {
            default: P(() => [...f[2] || (f[2] = [
              K("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          m("div", S0, [
            (r(!0), d(D, null, ne(l.value, (h) => (r(), d("div", {
              key: h.key,
              class: Y(["revision-line", h.type])
            }, v(h.text || " "), 3))), 128))
          ])
        ], 64)) : k("", !0)
      ], 64)) : (r(), d("p", M0, "No revisions"))
    ]));
  }
}, C0 = /* @__PURE__ */ z(_0, [["__scopeId", "data-v-3a381aa4"]]), A0 = "button, [data-comment-number]", E0 = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function or(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(A0) || n.push(t.currentNode);
  return n;
}
function nl(e, t, n) {
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
const O0 = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function T0(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = or(e), s = a.map((c) => c.data).join(""), o = nl(a, n.startContainer, n.startOffset), l = s.slice(o, nl(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const u = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: O0(u.nodeType === Node.TEXT_NODE ? u.parentElement : u) };
}
function I0(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function B0(e, t, n) {
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
function R0({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function L0(e, t) {
  const n = or(e), a = I0(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = B0(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(R0).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(Wa(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(Wa(t.number, t.id, t.label)) : l.at(-1).append(Wa(t.number, t.id, t.label))), !0;
}
function N0(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !L0(e, a) && a.id && n.push(a.id);
  return n;
}
const q0 = (e) => e.closest(E0) ?? e;
function al(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const D0 = {
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
      const _ = a.comments.filter((H) => H.quote).map((H) => ({ ...H, label: a.annotationLabel, hot: H.id === a.hot })), M = N0(l.value, a.pending ? [..._, { ...a.pending, pending: !0 }] : _);
      s("lost", M);
      const x = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!x) {
        c.value = null;
        return;
      }
      const T = document.createElement("div");
      T.className = "inline-comment", q0(x).after(T), c.value = T;
    }
    function h() {
      if (!l.value) return;
      const _ = T0(l.value);
      if (u.value = !!_, !_) {
        i.value = null;
        return;
      }
      const M = window.getSelection().getRangeAt(0).getBoundingClientRect(), x = o.value.getBoundingClientRect();
      i.value = { left: `${Math.max(M.left - x.left, 0)}px`, top: `${M.top - x.top + o.value.scrollTop}px` }, s("select", _);
    }
    function g(_) {
      const M = _.target.closest("[data-comment-number]");
      M ? s("number", Number(M.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function y(_) {
      var M;
      (M = l.value.querySelector(`[data-comment="${_}"]`)) == null || M.scrollIntoView({ block: "center" });
    }
    function b(_) {
      var M;
      (M = l.value.querySelectorAll("h3, h4, h5, h6")[_]) == null || M.scrollIntoView({ block: "start" });
    }
    return pe(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, u.value, a.pending], f, { flush: "post" }), _e(() => {
      f(), document.addEventListener("selectionchange", h);
    }), at(() => document.removeEventListener("selectionchange", h)), t({ show: y, showHeading: b, nextTick: Fe }), (_, M) => (r(), d("div", {
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
        onMousedown: M[0] || (M[0] = xe(() => {
        }, ["prevent"])),
        onClick: M[1] || (M[1] = (x) => s("write"))
      }, [
        E(le, {
          name: "chat",
          size: 13
        }),
        M[2] || (M[2] = K("Comment on this", -1))
      ], 36)) : k("", !0),
      c.value ? (r(), F(wn, {
        key: 1,
        to: c.value
      }, [
        re(_.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : k("", !0),
      re(_.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, P0 = /* @__PURE__ */ z(D0, [["__scopeId", "data-v-a92386e6"]]), j0 = { class: "document-tabs" }, F0 = ["aria-pressed"], W0 = { class: "document-body" }, H0 = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, z0 = {
  key: 1,
  class: "document-loading"
}, U0 = {
  class: "document-details",
  "data-resource-fields": ""
}, G0 = 760, V0 = {
  __name: "DocumentBody",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = Me(li, C(null)), a = C(null), s = xv(a), o = S(() => s.value !== null && s.value < G0), l = C(null), i = C(""), u = C([]), c = C([]), f = C(""), h = C("comments"), g = C("text"), y = C(0), b = C(!1), _ = C(0), M = C([]), x = C(null), T = C(""), H = C(!1), W = C(null), I = C(null);
    let G = 0;
    const N = sr(() => l.value ? { term: t.term, id: t.id, title: l.value.title } : {}, (se) => t.read(se)), A = S(() => al(N.comments.value)), L = S(() => h.value === "questions" ? al(c.value) : A.value), q = S(() => h.value === "questions" ? L.value.length : N.total.value), w = S(() => {
      var se;
      return (se = l.value) != null && se.body ? ao(l.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), p = S(() => {
      var se;
      return (((se = l.value) == null ? void 0 : se.body) ?? "").split(`
`).filter((Q) => /^#{1,4} /.test(Q)).map((Q, me) => ({ key: String(me), value: me, label: Q.replace(/^#+ /, "") }));
    }), $ = S(() => A.value.find((se) => se.id === _.value)), O = S(() => {
      var se;
      return (se = l.value) != null && se.close_reason ? "Closed" : "Open";
    }), B = S(() => g.value === "comments" && !o.value ? "text" : g.value), j = (se) => se.ok ? se.value.rows ?? [] : [];
    async function U() {
      const se = ++G, Q = await t.read([t.term, "inspect", String(t.id)]);
      if (se !== G) return;
      i.value = Q.ok ? "" : Q.error, l.value = Q.ok ? Q.value : null;
      const me = await t.read(["question", "list", "--all", "--row", `${t.term}:${t.id}`]), Xe = t.term === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      se === G && (c.value = j(me), f.value = me.ok ? "" : me.error, u.value = Xe ? j(Xe) : []);
    }
    async function J(se) {
      const Q = x.value ? ["--quote", x.value.quote, "--position", String(x.value.position), "--selection-type", x.value.selection_type] : [], me = await t.read([t.term, "comment", String(t.id), ...Q, "--", se]);
      if (!me.ok) throw new Error(me.error);
      x.value = null, await Promise.all([U(), N.load()]);
    }
    async function oe() {
      const se = await t.read(["doc", "close", String(t.id)]);
      i.value = se.ok ? "" : se.error, se.ok && await U();
    }
    function ue() {
      T.value.trim() || (x.value = null);
    }
    async function ke(se) {
      var Q;
      if (y.value = se, o.value && h.value === "questions") {
        g.value = "comments";
        return;
      }
      if (o.value) {
        _.value = _.value === se ? 0 : se;
        return;
      }
      b.value = !0, await Fe(), (Q = a.value.querySelector(h.value === "questions" ? `[data-question-id="${se}"]` : `[data-comment-id="${se}"]`)) == null || Q.scrollIntoView({ block: "nearest" });
    }
    async function Ee(se) {
      var Q, me;
      g.value = "text", y.value = se, await ((Q = W.value) == null ? void 0 : Q.nextTick()), (me = W.value) == null || me.show(se);
    }
    function be() {
      H.value = !1, U();
    }
    return pe(() => `${t.term}:${t.id}`, () => {
      l.value = null, g.value = "text", b.value = !1, y.value = 0, _.value = 0, x.value = null, c.value = [], f.value = "", U();
    }, { immediate: !0 }), pe(h, () => {
      y.value = 0, _.value = 0;
    }), (se, Q) => (r(), d("div", {
      ref_key: "panel",
      ref: a,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      l.value ? (r(), F(wn, {
        key: 0,
        to: R(n),
        disabled: !R(n)
      }, [
        m("span", {
          class: Y(["document-actions", { placed: R(n) }]),
          "data-document-actions": ""
        }, [
          E(ge, {
            bordered: "",
            "data-text-edit": "",
            onClick: Q[0] || (Q[0] = (me) => H.value = !0)
          }, {
            default: P(() => [...Q[15] || (Q[15] = [
              K("Edit", -1)
            ])]),
            _: 1
          }),
          B.value === "text" && p.value.length > 1 ? (r(), F(Gs, {
            key: 0,
            label: o.value ? "" : "Chapters",
            icon: "list",
            items: p.value,
            "data-text-chapters": "",
            onPick: Q[1] || (Q[1] = (me) => {
              var Xe;
              return (Xe = W.value) == null ? void 0 : Xe.showHeading(me.value);
            })
          }, null, 8, ["label", "items"])) : k("", !0)
        ], 2)
      ], 8, ["to", "disabled"])) : k("", !0),
      m("nav", j0, [
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
          K(v(h.value === "questions" ? "Questions" : "Comments") + " ", 1),
          m("em", null, v(q.value || ""), 1)
        ], 2)) : (r(), d("button", {
          key: 1,
          type: "button",
          class: Y(["document-tab-button", { on: b.value }]),
          "aria-pressed": b.value,
          "data-document-notes-toggle": "",
          onClick: Q[4] || (Q[4] = (me) => b.value = !b.value)
        }, [
          K(v(h.value === "questions" ? "Questions" : "Comments") + " ", 1),
          m("em", null, v(q.value || ""), 1)
        ], 10, F0)),
        e.term === "doc" ? (r(), d("button", {
          key: 2,
          type: "button",
          class: Y(["document-tab-button", { on: B.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: Q[5] || (Q[5] = (me) => g.value = "revisions")
        }, [
          Q[16] || (Q[16] = K("Revisions ", -1)),
          m("em", null, v(u.value.length || ""), 1)
        ], 2)) : k("", !0)
      ]),
      m("div", W0, [
        i.value ? (r(), d("p", H0, v(i.value), 1)) : l.value ? B.value === "revisions" ? (r(), F(C0, {
          key: 2,
          id: e.id,
          revisions: u.value,
          text: l.value.body,
          read: e.read,
          editing: l.value.open_author_id !== null && l.value.open_author_id !== void 0,
          onCloseRevision: oe,
          onRestored: U
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : B.value === "comments" ? (r(), F(tl, {
          key: 3,
          mode: h.value,
          "onUpdate:mode": Q[6] || (Q[6] = (me) => h.value = me),
          tab: "",
          comments: A.value,
          questions: c.value,
          hot: y.value,
          lost: M.value,
          failure: f.value,
          read: e.read,
          "comment-more": !!R(N).nextPage.value,
          "comment-loading": R(N).loading.value,
          "comment-failure": R(N).failure.value,
          "comment-total": R(N).total.value,
          onMore: R(N).loadMore,
          onShow: Ee,
          onChanged: U
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (r(), d(D, { key: 4 }, [
          E(P0, {
            ref_key: "words",
            ref: W,
            html: w.value,
            comments: L.value,
            "annotation-label": h.value === "questions" ? "Question" : "Comment",
            hot: y.value,
            pending: x.value,
            inline: _.value,
            onSelect: Q[8] || (Q[8] = (me) => x.value = me),
            onClear: ue,
            onNumber: ke,
            onWrite: Q[9] || (Q[9] = (me) => {
              var Xe;
              return (Xe = I.value) == null ? void 0 : Xe.focus();
            }),
            onLost: Q[10] || (Q[10] = (me) => M.value = me)
          }, {
            inline: P(() => [
              $.value ? (r(), F(Xi, {
                key: 0,
                comment: $.value,
                hot: "",
                onShow: Q[7] || (Q[7] = (me) => Ee($.value.id))
              }, null, 8, ["comment"])) : k("", !0)
            ]),
            default: P(() => [
              m("dl", U0, [
                Q[18] || (Q[18] = m("h4", null, "Details", -1)),
                Q[19] || (Q[19] = m("dt", null, "State", -1)),
                m("dd", null, v(O.value), 1),
                l.value.close_reason ? (r(), d(D, { key: 0 }, [
                  Q[17] || (Q[17] = m("dt", null, "Why closed", -1)),
                  m("dd", null, v(l.value.close_reason), 1)
                ], 64)) : k("", !0),
                Q[20] || (Q[20] = m("dt", null, "Created", -1)),
                m("dd", null, [
                  E(nt, {
                    at: l.value.created_at
                  }, null, 8, ["at"])
                ]),
                Q[21] || (Q[21] = m("dt", null, "Updated", -1)),
                m("dd", null, [
                  E(nt, {
                    at: l.value.updated_at
                  }, null, 8, ["at"])
                ])
              ])
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          !o.value && b.value ? (r(), F(tl, {
            key: 0,
            mode: h.value,
            "onUpdate:mode": Q[11] || (Q[11] = (me) => h.value = me),
            comments: A.value,
            questions: c.value,
            hot: y.value,
            lost: M.value,
            failure: f.value,
            read: e.read,
            "comment-more": !!R(N).nextPage.value,
            "comment-loading": R(N).loading.value,
            "comment-failure": R(N).failure.value,
            "comment-total": R(N).total.value,
            onMore: R(N).loadMore,
            onShow: Ee,
            onChanged: U
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : k("", !0)
        ], 64)) : (r(), d("div", z0, [
          E(Qe)
        ]))
      ]),
      l.value ? (r(), F(qv, {
        key: 1,
        ref_key: "composer",
        ref: I,
        draft: T.value,
        "onUpdate:draft": Q[12] || (Q[12] = (me) => T.value = me),
        selection: x.value,
        send: J,
        narrow: o.value,
        onClear: Q[13] || (Q[13] = (me) => x.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : k("", !0),
      H.value ? (r(), F(b0, {
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
}, j6 = /* @__PURE__ */ z(V0, [["__scopeId", "data-v-f9bd78a7"]]), K0 = {
  key: 1,
  class: "row-list-failure"
}, Y0 = ["data-row"], Q0 = {
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
    const t = e, n = S(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : t.moves ? { tag: "ul", name: "row-list", css: !t.leavesAtOnce, "data-row-list-moves": "" } : {}), a = C(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (r(), F(Qe, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (r(), d("p", K0, v(e.failure), 1)) : !e.rows.length && e.loaded ? (r(), F(cn, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: P(() => [
        K(v(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (r(), d(D, { key: 3 }, [
      (r(), F(Ke(e.arrival || e.moves ? js : "ul"), De(n.value, { class: "row-list" }), {
        default: P(() => [
          (r(!0), d(D, null, ne(e.rows, (i) => (r(), d("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            re(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, Y0))), 128))
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
}, X0 = /* @__PURE__ */ z(Q0, [["__scopeId", "data-v-e9f251f3"]]), J0 = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Z0 = {
  key: 1,
  class: "agent-rows-note"
}, eb = {
  key: 2,
  class: "agent-rows-note"
}, tb = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, nb = ["data-agent-row", "onClick"], ab = { class: "agent-row-name" }, sb = { class: "agent-row-state" }, ob = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = S(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = S(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (r(), d("div", J0, [
      e.loaded ? e.failure ? (r(), d("p", Z0, v(e.failure), 1)) : e.rows.length ? (r(), d(D, { key: 3 }, [
        m("p", tb, v(a.value) + " running", 1),
        (r(!0), d(D, null, ne(n.value, (l) => (r(), d("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => R(je)(`agents:${l.id}`)
        }, [
          m("span", ab, "#" + v(l.id) + " " + v(l.session), 1),
          m("span", sb, v(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, nb))), 128))
      ], 64)) : (r(), d("p", eb, v(e.none), 1)) : (r(), F(Qe, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, F6 = /* @__PURE__ */ z(ob, [["__scopeId", "data-v-a01e5a17"]]), ht = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ge = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, ze = { across: 48, down: 110, margin: 32, labelSpace: 14 }, lb = 6;
function uo(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const ib = (e) => {
  const t = uo(e, ht.lineChars), n = Math.max(ht.minWidth, Math.max(...t.map((a) => a.length)) * ht.charWidth + ht.padX * 2);
  return { name: e, lines: t, line: ht.line, padY: ht.padY, width: n, height: t.length * ht.line + ht.padY * 2 };
};
function rb(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, u) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(u) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function ub(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function cb(e, t, n) {
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
  for (let l = 0; l < lb; l++) {
    const i = l % 2 === 0, u = a.map((c, f) => f);
    (i ? u.slice(1) : u.slice(0, -1).reverse()).forEach((c) => {
      const f = (h) => t.filter((g) => g[i ? 1 : 0] === h).map((g) => g[i ? 0 : 1]);
      a[c] = o(a[c], f);
    });
  }
  return a;
}
function db(e, t) {
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
function fb(e) {
  const t = [...new Set(e.flatMap(([W, I]) => [W, I]))], n = new Set(e.map(([, W]) => W)), a = t.filter((W) => !n.has(W)), s = rb(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((W, I) => !s.has(I)), l = ub(t, o), i = cb(t, o, l), u = new Map(t.map((W) => [W, ib(W)])), c = i.map((W) => W.reduce((I, G) => I + u.get(G).width, 0) + ze.across * (W.length - 1)), f = Math.max(...c) + ze.margin * 2, h = mb(e, l, i.length), g = /* @__PURE__ */ new Map();
  let y = ze.margin;
  i.forEach((W, I) => {
    let G = (f - c[I]) / 2;
    const N = Math.max(...W.map((A) => u.get(A).height));
    W.forEach((A) => {
      const L = u.get(A);
      g.set(A, { ...L, x: G, y: y + (N - L.height) / 2 }), G += L.width + ze.across;
    }), y += N + (h[I] ?? ze.down);
  });
  const b = e.map(([W, I, G], N) => ({ from: W, to: I, label: G || "", back: s.has(N) || l.get(I) <= l.get(W) }));
  db(b, g);
  const _ = b.map((W) => pb(W, g.get(W.from), g.get(W.to))), M = [...g.values()], x = bb(_, M), T = Math.max(y - ze.down, ...x.filter((W) => W.label).map((W) => W.label.y + W.label.height));
  return { width: Math.max(f - ze.margin, ...x.filter((W) => W.label).map((W) => W.label.x + W.label.width)) + ze.margin, height: T + ze.margin, nodes: M, arrows: x };
}
const hb = (e) => e ? uo(e, Ge.lineChars).length * Ge.line + Ge.pad * 2 : 0;
function mb(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => ze.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, u] = [t.get(s), t.get(o)].sort((c, f) => c - f);
    u > i && (a[i + Math.floor((u - i - 1) / 2)] += hb(l) + ze.labelSpace);
  }), a.map((s) => Math.max(ze.down, s));
}
function pb(e, t, n) {
  const a = e.label ? uo(e.label, Ge.lineChars) : [], s = a.length ? Math.max(...a.map((g) => g.length)) * Ge.charWidth + Ge.pad * 2 : 0, o = a.length * Ge.line + (a.length ? Ge.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, u = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, f = (c - i) / 2, h = [{ x: l, y: i }, { x: l, y: i + f }, { x: u, y: c - f }, { x: u, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: h, path: `M${l} ${i} C${l} ${i + f} ${u} ${c - f} ${u} ${c}` };
}
const gb = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, vb = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], yb = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ge.line);
function bb(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (u, c) => {
      const f = gb(a.curve, u);
      return { x: f.x - a.labelWidth / 2, y: f.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = yb.flatMap((u) => vb.map((c) => s(c, u))).find((u) => !n.some((c) => sl(u, c))) ?? s(0.5, 0);
    for (; n.some((u) => sl(i, u)); ) i.y += Ge.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: Ge.line, pad: Ge.pad } };
  });
}
const sl = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, kb = { class: "flowchart-tools" }, wb = ["width", "height", "viewBox", "aria-label"], $b = ["d"], xb = ["x", "y", "width", "height"], Sb = ["x", "y"], Mb = ["x", "dy"], _b = {
  key: 0,
  class: "flowchart-label"
}, Cb = ["x", "y", "width", "height"], Ab = ["x", "y"], Eb = ["x", "dy"], Ob = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => fb(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = C(null), i = C({ zoom: 1, x: 0, y: 0 });
    let u = null;
    function c() {
      var x;
      const _ = (x = l.value) == null ? void 0 : x.getBoundingClientRect();
      if (!(_ != null && _.width)) return;
      const M = Math.min(_.width / s.value.width, _.height / s.value.height, 1.5);
      i.value = { zoom: M, x: (_.width - s.value.width * M) / 2, y: (_.height - s.value.height * M) / 2 };
    }
    function f(_, M, x) {
      const { zoom: T, x: H, y: W } = i.value, I = Math.min(o.most, Math.max(o.least, T * _));
      i.value = { zoom: I, x: M - (M - H) * I / T, y: x - (x - W) * I / T };
    }
    function h(_) {
      const M = l.value.getBoundingClientRect();
      f(_, M.width / 2, M.height / 2);
    }
    function g(_) {
      const M = l.value.getBoundingClientRect();
      _.ctrlKey || _.metaKey ? f(_.deltaY < 0 ? o.step : 1 / o.step, _.clientX - M.left, _.clientY - M.top) : i.value = { ...i.value, x: i.value.x - _.deltaX, y: i.value.y - _.deltaY };
    }
    function y(_) {
      var M, x, T;
      _.preventDefault(), (M = window.getSelection()) == null || M.removeAllRanges(), u = { x: _.clientX - i.value.x, y: _.clientY - i.value.y }, (T = (x = l.value).setPointerCapture) == null || T.call(x, _.pointerId);
    }
    function b(_) {
      u && (i.value = { ...i.value, x: _.clientX - u.x, y: _.clientY - u.y });
    }
    return _e(c), (_, M) => (r(), F(ba, {
      padded: "",
      title: e.title,
      large: "",
      onClose: M[4] || (M[4] = (x) => a("close"))
    }, {
      default: P(() => [
        m("div", kb, [
          E(ge, {
            small: "",
            onClick: M[0] || (M[0] = (x) => h(o.step))
          }, {
            default: P(() => [...M[5] || (M[5] = [
              K("Zoom in", -1)
            ])]),
            _: 1
          }),
          E(ge, {
            small: "",
            onClick: M[1] || (M[1] = (x) => h(1 / o.step))
          }, {
            default: P(() => [...M[6] || (M[6] = [
              K("Zoom out", -1)
            ])]),
            _: 1
          }),
          E(ge, {
            small: "",
            onClick: c
          }, {
            default: P(() => [...M[7] || (M[7] = [
              K("Fit the whole chart", -1)
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
          onPointerup: M[2] || (M[2] = (x) => Ao(u) ? u.value = null : u = null),
          onPointercancel: M[3] || (M[3] = (x) => Ao(u) ? u.value = null : u = null)
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
            M[8] || (M[8] = m("defs", null, [
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
            (r(!0), d(D, null, ne(s.value.arrows, (x, T) => (r(), d("path", {
              key: `arrow-${T}`,
              class: "flowchart-arrow",
              d: x.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, $b))), 128)),
            (r(!0), d(D, null, ne(s.value.nodes, (x) => (r(), d("g", {
              key: x.name,
              class: "flowchart-node"
            }, [
              m("rect", {
                x: x.x,
                y: x.y,
                width: x.width,
                height: x.height,
                rx: "8"
              }, null, 8, xb),
              m("text", {
                x: x.x + x.width / 2,
                y: x.y + x.padY + x.line / 2
              }, [
                (r(!0), d(D, null, ne(x.lines, (T, H) => (r(), d("tspan", {
                  key: H,
                  x: x.x + x.width / 2,
                  dy: H ? x.line : 0
                }, v(T), 9, Mb))), 128))
              ], 8, Sb)
            ]))), 128)),
            (r(!0), d(D, null, ne(s.value.arrows, (x, T) => (r(), d(D, {
              key: `label-${T}`
            }, [
              x.label ? (r(), d("g", _b, [
                m("rect", {
                  x: x.label.x,
                  y: x.label.y,
                  width: x.label.width,
                  height: x.label.height,
                  rx: "4"
                }, null, 8, Cb),
                m("text", {
                  x: x.label.x + x.label.width / 2,
                  y: x.label.y + x.label.pad + x.label.line / 2
                }, [
                  (r(!0), d(D, null, ne(x.label.lines, (H, W) => (r(), d("tspan", {
                    key: W,
                    x: x.label.x + x.label.width / 2,
                    dy: W ? x.label.line : 0
                  }, v(H), 9, Eb))), 128))
                ], 8, Ab)
              ])) : k("", !0)
            ], 64))), 128))
          ], 12, wb))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Tb = /* @__PURE__ */ z(Ob, [["__scopeId", "data-v-e98799dc"]]), Ib = ["innerHTML"], Bb = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = S(() => No[t.name] || No.dot);
    return (a, s) => (r(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Ib));
  }
}, Ot = /* @__PURE__ */ z(Bb, [["__scopeId", "data-v-beb5935c"]]), Rb = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: Y(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      E(Ot, { name: "fold" })
    ], 2));
  }
}, Qt = /* @__PURE__ */ z(Rb, [["__scopeId", "data-v-d03899bb"]]), Lb = ["data-tip", "aria-label"], Nb = {
  key: 0,
  class: "mact-word"
}, qb = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: Y(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      E(Ot, { name: "open" }),
      e.open ? (r(), d("span", Nb, v(e.label), 1)) : k("", !0),
      n[0] || (n[0] = m("span", { class: "hit" }, null, -1))
    ], 10, Lb));
  }
}, lr = /* @__PURE__ */ z(qb, [["__scopeId", "data-v-3b292e09"]]), ir = 120, Yn = 280, rr = 160, Db = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, Pb = ["leaving", "resizing", "entering"];
function _s(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function jb(e) {
  const t = Pb.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = _s(e);
  return e.classList.add(...t), n;
}
function ur(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = C(t()), s = C("");
  let o = 0;
  const l = (h, g) => Object.assign(h.style, { width: `${g.width}px`, height: `${g.height}px` }), i = (h) => Object.assign(h.style, { width: "", height: "", transition: "" });
  function u(h, g) {
    i(h);
    const y = jb(h);
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
    if (!g || !g.offsetWidth || Db()) {
      a.value = h;
      return;
    }
    const b = _s(g);
    if (l(g, b), s.value = "leaving", await n(ir), y !== o) return;
    a.value = h, s.value = "resizing", await Fe(), u(g, b);
    const _ = c(g);
    await n(Yn), _ == null || _.disconnect(), y === o && (i(g), s.value = "entering", await n(rr), y === o && (s.value = ""));
  }
  return pe(t, (h) => f(h)), at(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const Fb = { class: "growing-card-top" }, Wb = ["aria-expanded"], Hb = { class: "growing-card-avatar" }, zb = { class: "growing-card-title" }, Ub = { class: "growing-card-more" }, Gb = { class: "growing-card-body" }, Vb = {
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
    const n = e, a = t, s = C(!1), o = C(null), { folded: l, phase: i } = ur(o, () => !s.value), u = S(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = S(() => n.text.split(/\n\s*\n/).filter((f) => f.trim()));
    return (f, h) => (r(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: Y(["growing-card-wrap", R(i), { open: !R(l), bad: e.bad, incoming: e.incoming }])
    }, [
      m("div", Fb, [
        m("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: h[0] || (h[0] = (g) => s.value = !s.value)
        }, [
          m("span", Hb, [
            e.bad ? (r(), F(Ot, {
              key: 0,
              name: "cross"
            })) : u.value ? (r(), d(D, { key: 1 }, [
              K(v(u.value), 1)
            ], 64)) : (r(), F(le, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          m("span", zb, v(e.title), 1),
          E(Qt, { open: s.value }, null, 8, ["open"])
        ], 8, Wb),
        e.action ? (r(), F(lr, {
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
          E(le, {
            name: "bubble",
            size: 13
          })
        ])) : k("", !0)
      ]),
      m("div", Ub, [
        m("div", Gb, [
          (r(!0), d(D, null, ne(c.value, (g, y) => (r(), d("p", {
            key: y,
            class: "growing-card-text"
          }, v(g), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Kb = /* @__PURE__ */ z(Vb, [["__scopeId", "data-v-f2b4930d"]]), Yb = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, Qb = { class: "md inline" }, Xb = ["disabled", "title", "onClick"], Jb = {
  key: 1,
  class: "message-links-many"
}, Zb = ["aria-expanded"], ek = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, tk = ["disabled", "onClick"], nk = { class: "row-pill message-links-chip" }, ak = { class: "message-links-title" }, sk = { key: 0 }, Ha = 3, ok = "task", lk = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => n.total || n.links.length), o = S(() => n.links.every((g) => g.endpoint.model === ok) ? "tasks" : "items"), l = C(!1), i = C(null);
    ri(i, () => l.value = !1);
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
      E(Ot, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (r(), d("span", Yb, [
        m("span", Qb, [
          y[1] || (y[1] = K("Linked: ", -1)),
          (r(!0), d(D, null, ne(e.links, (b) => (r(), d("button", {
            key: `${b.endpoint.model}:${b.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(b),
            title: b.endpoint.title,
            onClick: (_) => h(b)
          }, [
            K(v(b.endpoint.model.replaceAll("_", " ")) + " " + v(b.endpoint.id), 1),
            f(b) ? (r(), d(D, { key: 0 }, [
              K(" (" + v(f(b)) + ")", 1)
            ], 64)) : k("", !0),
            c(b) ? (r(), d(D, { key: 1 }, [
              K(" (unavailable)")
            ], 64)) : k("", !0)
          ], 8, Xb))), 128))
        ])
      ])) : k("", !0),
      s.value >= Ha ? (r(), d("span", Jb, [
        m("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: u
        }, [
          K(v(s.value) + " linked " + v(o.value) + " ", 1),
          E(Qt, { open: l.value }, null, 8, ["open"])
        ], 8, Zb)
      ])) : k("", !0),
      l.value ? (r(), d("div", ek, [
        (r(!0), d(D, null, ne(e.links, (b) => (r(), d("button", {
          key: `${b.endpoint.model}:${b.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(b),
          onClick: (_) => h(b)
        }, [
          m("span", nk, v(b.endpoint.model.replaceAll("_", " ")) + " " + v(b.endpoint.id), 1),
          m("span", ak, v(b.endpoint.title), 1),
          m("span", null, v(f(b)), 1),
          c(b) ? (r(), d("span", sk, "Unavailable")) : k("", !0)
        ], 8, tk))), 128))
      ])) : k("", !0),
      E($n, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: y[0] || (y[0] = (b) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, ik = /* @__PURE__ */ z(lk, [["__scopeId", "data-v-843fc3bd"]]), rk = ["title", "aria-label"], uk = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, ck = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, dk = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = S(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (r(), d("span", {
      class: Y(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (r(), d("svg", uk, [
        o[0] || (o[0] = m("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (r(), d("path", ck)) : k("", !0)
      ]))
    ], 10, rk));
  }
}, fk = /* @__PURE__ */ z(dk, [["__scopeId", "data-v-6dc92808"]]), hk = {
  report: { at: 70, keep: 46 },
  message: { at: 420, keep: 320 }
}, mk = (e) => e.worker_id != null ? "report" : "message", pk = (e) => hk[mk(e)], gk = "img,pre,table";
function vk(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function yk(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function bk(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(gk)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = vk(yk(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function kk(e, t) {
  let n = null;
  const a = () => e.value && bk(e.value);
  _e(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Re(() => n == null ? void 0 : n.disconnect()), pe(t, a, { flush: "post" });
}
const wk = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function $k(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const jn = /* @__PURE__ */ new WeakMap(), Ne = "work", Ze = "sent", xk = 50, ol = 50, ll = () => ({ rows: C([]), total: C(0), next: C(null), loading: C(!1), failure: C(""), version: 0 });
function Sk(e) {
  var _;
  if (jn.has(e)) return jn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (M) => {
    var x;
    return ((x = e.visible) == null ? void 0 : x.value) !== !1 && [...M.views].some((T) => T.visible);
  };
  function o(M, x) {
    const T = M[x], H = ++T.version;
    return T.loading.value = !0, T.failure.value = "", H;
  }
  function l(M, x, T, H, W) {
    const I = M[x];
    if (t.get(M.id) !== M || I.version !== T) return;
    if (I.loading.value = !1, !W.ok) {
      I.failure.value = W.error;
      return;
    }
    const G = x === Ne ? W.value.counterparts ?? [] : W.value.rows ?? [], N = H === 1 ? G : [...I.rows.value, ...G], A = x === Ne ? (L) => `${L.endpoint.model}:${L.endpoint.id}` : (L) => L.id ?? L.target_id;
    I.rows.value = [...new Map(N.map((L) => [A(L), L])).values()], I.total.value = W.value.total ?? I.rows.value.length, I.next.value = W.value.next_page ?? null;
  }
  function i(M, x, T, H) {
    const W = M[x];
    W.version === T && (W.failure.value = H.message, W.loading.value = !1);
  }
  async function u(M, x, T) {
    const H = o(M, x), W = x === Ne ? "--type about --type edited --group-counterparts" : "--type sent_to";
    try {
      l(M, x, H, T, await e.read(`link list --source message:${M.id} ${W} --page ${T} --page-size ${x === Ne ? 10 : 25}`));
    } catch (I) {
      i(M, x, H, I);
    }
  }
  async function c(M) {
    const x = M.map((T) => ({ [Ne]: o(T, Ne), [Ze]: o(T, Ze) }));
    try {
      const T = await e.read(`link receipts --messages ${M.map((H) => H.id).join(",")}`);
      M.forEach((H, W) => {
        const I = T.ok ? T.value.messages[String(H.id)] : null;
        l(H, Ne, x[W][Ne], 1, T.ok ? { ok: !0, value: I.named } : T), l(H, Ze, x[W][Ze], 1, T.ok ? { ok: !0, value: I.sent } : T);
      });
    } catch (T) {
      M.forEach((H, W) => [Ne, Ze].forEach((I) => i(H, I, x[W][I], T)));
    }
  }
  function f() {
    a = null;
    const M = [...n].map((x) => t.get(x)).filter((x) => x && s(x));
    n.clear(), M.forEach((x) => x.dirty.clear());
    for (let x = 0; x < M.length; x += ol) c(M.slice(x, x + ol));
  }
  function h(M, x = [Ne, Ze]) {
    for (const T of x) M.dirty.add(T);
    s(M) && (n.add(M.id), a ?? (a = setTimeout(f, 0)));
  }
  function g(M) {
    const x = M.sources ?? (M.source_model && Number.isInteger(M.source_id) ? [{ model: M.source_model, id: M.source_id }] : []), T = M.link_types ?? (M.link_type ? [M.link_type] : []), H = T.length ? [Ne, Ze].filter((I) => I === Ne ? T.some((G) => ["about", "edited"].includes(G)) : T.includes("sent_to")) : [Ne, Ze];
    if (!H.length) return;
    const W = x.length ? [...new Set(x.filter((I) => I.model === "message").map((I) => I.id))].map((I) => t.get(I)).filter(Boolean) : [...t.values()].filter(s).slice(0, xk);
    for (const I of W) h(I, H);
  }
  const y = (_ = e.follow) == null ? void 0 : _.call(e, ["link.*"], g), b = {
    attach(M, x) {
      let T = t.get(M);
      return T || (T = { id: M, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Ne, Ze]), work: ll(), sent: ll() }, t.set(M, T)), T.views.add(x), T.dirty.size && h(T, [...T.dirty]), T;
    },
    shown(M) {
      M.dirty.size && h(M, [...M.dirty]);
    },
    detach(M, x) {
      M.views.delete(x), M.views.size || t.delete(M.id), t.size || (clearTimeout(a), y == null || y(), jn.delete(e));
    },
    more(M, x) {
      const T = M == null ? void 0 : M[x];
      if (T != null && T.next.value && !T.loading.value) return u(M, x, T.next.value);
    }
  };
  return jn.set(e, b), b;
}
function Mk(e, t, n) {
  const a = et(null);
  let s = null;
  const o = pe(t, (l, i, u) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = Sk(e);
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
    links: S(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.rows.value) ?? [];
    }),
    total: S(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.total.value) ?? 0;
    }),
    more: S(() => {
      var l;
      return !!((l = a.value) != null && l.work.next.value);
    }),
    loading: S(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.loading.value) ?? !1;
    }),
    failure: S(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.failure.value) ?? "";
    }),
    sentTo: S(() => {
      var l;
      return (((l = a.value) == null ? void 0 : l.sent.rows.value) ?? []).map((i) => i.target);
    }),
    sentMore: S(() => {
      var l;
      return !!((l = a.value) != null && l.sent.next.value);
    }),
    sentLoading: S(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.loading.value) ?? !1;
    }),
    sentFailure: S(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.failure.value) ?? "";
    }),
    loadMore: () => s == null ? void 0 : s.more(a.value, Ne),
    loadSent: () => s == null ? void 0 : s.more(a.value, Ze)
  };
}
const _k = ["data-incoming", "data-ref"], Ck = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], Ak = { class: "message-body" }, Ek = ["title"], Ok = ["innerHTML"], Tk = ["innerHTML"], Ik = {
  class: "message-faces",
  "data-message-faces": ""
}, Bk = ["title", "data-face", "onClick"], Rk = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, Lk = ["title", "data-reaction", "onClick"], Nk = {
  key: 0,
  class: "message-reaction-count"
}, qk = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Dk = ["href", "title"], Pk = ["src", "alt"], jk = ["href"], Fk = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, Wk = { class: "message-foot" }, Hk = { class: "message-time" }, zk = {
  class: "message-id",
  "data-message-id": ""
}, Uk = 1500, Gk = "An earlier message", Vk = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(!1), o = C(null), l = S(() => ["user", "comment"].includes(n.message.type)), i = S(() => {
      const [be, se] = (n.message.commented_row || ":").split(":"), Q = vt(be);
      return Q ? { ref: `${Q}:${se}`, label: `${Yt(Q).title.toLowerCase()} ${se}` } : null;
    }), u = S(() => n.message.worker_id ?? null), c = S(() => pk(n.message)), f = S(() => l.value && !n.message.read_at && !n.message.local);
    async function h() {
      var be;
      await ((be = navigator.clipboard) == null ? void 0 : be.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, Uk);
    }
    const g = Ni(), y = S(() => g(n.message.text ?? "")), b = S(() => JSON.parse(n.message.flowchart_edges || "[]")), _ = C(!1), M = S(() => $s(n.quote)), x = S(() => g(M.value || Gk));
    function T() {
      const be = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      be ? be.scrollIntoView({ block: "center", behavior: "smooth" }) : je(`messages:${n.message.parent_id}`);
    }
    kk(o, () => `${n.message.text} ${M.value}`);
    const H = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, W = (be) => `/api/files/message/${n.message.id}/${encodeURIComponent(be)}`, I = S(() => JSON.parse(n.message.captions || "{}")), G = S(() => (n.message.files ?? []).map((be) => ({ name: be, address: W(be), isImage: H.test(be), title: I.value[be] || be }))), N = S(() => Gi(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), A = Me(Le, null), { links: L, total: q, more: w, loading: p, failure: $, sentTo: O, sentMore: B, sentLoading: j, sentFailure: U, loadMore: J, loadSent: oe } = Mk(A, () => l.value && !n.message.local ? n.message.id : null, o), ue = C(!1), ke = S(() => $k(n.message.reactions));
    function Ee(be) {
      ue.value = !1, a("react", n.message, be);
    }
    return (be, se) => e.message.peer || e.message.recipient ? (r(), d("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      E(Kb, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: se[0] || (se[0] = (Q) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, _k)) : (r(), d("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      m("div", Ak, [
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
            E(le, {
              name: "bubble",
              size: 12
            }),
            m("span", null, "Comment on " + v(i.value.label), 1)
          ], 8, Ek)) : k("", !0),
          e.message.parent_id ? (r(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: xe(T, ["stop"]),
            innerHTML: x.value
          }, null, 8, Ok)) : k("", !0),
          u.value !== null ? (r(), F(hn, {
            key: 2,
            as: "button",
            "agent-id": u.value,
            label: `Worker ${u.value}`,
            class: "message-worker",
            "data-message-worker": "",
            onClick: se[2] || (se[2] = xe((Q) => R(je)(`agents:${u.value}`), ["stop"]))
          }, {
            default: P(() => [
              K("Worker " + v(u.value), 1)
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : k("", !0),
          E(Oi, {
            at: c.value.at,
            keep: c.value.keep,
            name: `message:${e.message.id}`
          }, {
            default: P(() => [
              m("div", {
                "data-message-text": "",
                innerHTML: y.value
              }, null, 8, Tk)
            ]),
            _: 1
          }, 8, ["at", "keep", "name"]),
          b.value.length ? (r(), d(D, { key: 3 }, [
            m("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: se[3] || (se[3] = (Q) => _.value = !0)
            }, "Open the flowchart"),
            _.value ? (r(), F(Tb, {
              key: 0,
              title: e.message.text,
              edges: b.value,
              onClose: se[4] || (se[4] = (Q) => _.value = !1)
            }, null, 8, ["title", "edges"])) : k("", !0)
          ], 64)) : k("", !0)
        ], 2),
        m("div", {
          class: Y(["message-tools", { picking: ue.value }]),
          "data-message-tools": ""
        }, [
          ue.value ? (r(), d(D, { key: 0 }, [
            m("div", Ik, [
              (r(!0), d(D, null, ne(R(wk), (Q) => (r(), d("button", {
                key: Q,
                type: "button",
                class: "message-face",
                title: `React ${Q}`,
                "data-face": Q,
                onClick: (me) => Ee(Q)
              }, v(Q), 9, Bk))), 128))
            ]),
            m("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: se[6] || (se[6] = (Q) => ue.value = !1)
            }, [
              E(le, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (r(), d(D, { key: 1 }, [
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
      ke.value.length ? (r(), d("div", Rk, [
        (r(!0), d(D, null, ne(ke.value, (Q) => (r(), d("button", {
          key: Q.emoji,
          type: "button",
          class: Y(["message-reaction", { mine: Q.mine }]),
          title: Q.title,
          "data-reaction": Q.emoji,
          onClick: (me) => a("react", e.message, Q.emoji)
        }, [
          K(v(Q.emoji) + " ", 1),
          Q.count > 1 ? (r(), d("span", Nk, v(Q.count), 1)) : k("", !0)
        ], 10, Lk))), 128))
      ])) : k("", !0),
      G.value.length ? (r(), d("div", qk, [
        (r(!0), d(D, null, ne(G.value, (Q) => (r(), d(D, {
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
            }, null, 8, Pk)
          ], 8, Dk)) : (r(), d("a", {
            key: 1,
            href: Q.address,
            target: "_blank",
            class: "message-file"
          }, v(Q.name), 9, jk))
        ], 64))), 128))
      ])) : k("", !0),
      R(O).length ? (r(), d("div", Fk, [
        E(le, {
          name: "send",
          size: 12
        }),
        (r(!0), d(D, null, ne(R(O), (Q) => (r(), F(hn, {
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
            K("Also sent to worker " + v(Q.id), 1),
            Q.unavailable ? (r(), d(D, { key: 0 }, [
              K(" (unavailable)")
            ], 64)) : k("", !0)
          ]),
          _: 2
        }, 1032, ["agent-id", "label", "disabled", "data-sent-worker", "onClick"]))), 128))
      ])) : k("", !0),
      E($n, {
        more: R(B),
        loading: R(j),
        failure: R(U),
        label: "More recipients",
        onMore: R(oe)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      m("div", Wk, [
        m("time", Hk, v(N.value), 1),
        Number.isInteger(e.message.id) ? (r(), d(D, { key: 0 }, [
          se[10] || (se[10] = m("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          m("span", zk, "message " + v(e.message.id), 1)
        ], 64)) : k("", !0),
        l.value ? (r(), F(fk, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : k("", !0)
      ]),
      R(L).length || R($) ? (r(), F(ik, {
        key: 3,
        links: R(L),
        total: R(q),
        more: R(w),
        loading: R(p),
        failure: R($),
        onMore: R(J)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : k("", !0)
    ], 8, Ck));
  }
}, W6 = /* @__PURE__ */ z(Vk, [["__scopeId", "data-v-95d3070e"]]), ia = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], za = 200, cr = (e) => {
  var t;
  return ((t = ia.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? ia[0].key;
}, H6 = (e) => {
  var t;
  return ((t = ia.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Kk = ["aria-label"], Yk = 300, il = 400, Qk = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: za } },
  setup(e) {
    const t = e, n = S(() => cr(t.value)), a = S(() => n.value < za ? [1, 0.25, 0.25] : n.value === za ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (r(), d("svg", {
      class: Y(["ico", "prio", { hot: n.value >= il, high: n.value >= Yk && n.value < il }]),
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
    ], 10, Kk));
  }
}, z6 = /* @__PURE__ */ z(Qk, [["__scopeId", "data-v-b10e610f"]]), dr = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], U6 = (e) => {
  const t = dr[e - 1];
  return t.slice(0, 1).toUpperCase() + t.slice(1);
}, Xk = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, rl = (e) => Xk[e.card.state] || "idle", Jk = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), ul = { working: 0, waiting: 1, idle: 2, stopped: 3 }, cl = (e, t) => ul[rl(e)] - ul[rl(t)], dl = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, G6 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => cl(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || Jk(a, s)) : [...e].sort((a, s) => cl(a, s) || (dl[t] || dl.state)(a, s)), Zk = { class: "list-row" }, ew = {
  key: 0,
  class: "list-row-type"
}, tw = { class: "list-row-main" }, nw = {
  key: 0,
  class: "list-row-title"
}, aw = { class: "list-row-body" }, sw = {
  key: 1,
  class: "list-row-end"
}, ow = {
  key: 1,
  class: "list-row-text"
}, lw = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", Zk, [
      e.type ? (r(), d("span", ew, v(e.type), 1)) : k("", !0),
      m("div", tw, [
        e.title ? (r(), d("span", nw, v(e.title), 1)) : k("", !0),
        m("div", aw, [
          re(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (r(), d("div", sw, [
          re(t.$slots, "end", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      e.text ? (r(), d("span", ow, v(e.text), 1)) : k("", !0)
    ]));
  }
}, V6 = /* @__PURE__ */ z(lw, [["__scopeId", "data-v-dfc8c3a7"]]), K6 = {
  __name: "ModelPicker",
  props: {
    title: { type: String, required: !0 },
    models: { type: Array, required: !0 },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => [
      ...n.models.map((l) => ({ key: l.name, label: l.name, note: l.tier })),
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = S(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, i) => (r(), F(Gs, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: i[0] || (i[0] = (u) => a("pick", u.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, iw = {
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
}, Cs = /* @__PURE__ */ z(iw, [["__scopeId", "data-v-978e0921"]]), rw = ["aria-label"], uw = { class: "head" }, cw = { class: "names" }, dw = { class: "body" }, fw = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = bi(a, n), i = ki(s);
    return (u, c) => (r(), F(wn, { to: "body" }, [
      E(Vt, {
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
              e.title ? (r(), d(D, { key: 0 }, [
                m("header", uw, [
                  m("div", cw, [
                    m("h2", null, v(e.title), 1),
                    e.abstract ? (r(), F(it, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : k("", !0),
                    re(u.$slots, "meta", {}, void 0, !0)
                  ]),
                  re(u.$slots, "actions", {}, void 0, !0),
                  E(ya, {
                    title: e.closeLabel,
                    onClick: R(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                u.$slots.foot && !e.footBelow ? (r(), F(Cs, { key: 0 }, {
                  default: P(() => [
                    re(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0),
                m("div", dw, [
                  re(u.$slots, "default", {}, void 0, !0)
                ]),
                u.$slots.foot && e.footBelow ? (r(), F(Cs, {
                  key: 1,
                  class: "below"
                }, {
                  default: P(() => [
                    re(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0)
              ], 64)) : re(u.$slots, "default", {}, void 0, !0, 1)
            ], 10, rw)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Y6 = /* @__PURE__ */ z(fw, [["__scopeId", "data-v-d0a677ef"]]), hw = {
  key: 1,
  class: "text-field-label"
}, mw = {
  key: 2,
  class: "text-field-end"
}, pw = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Ft({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = un(e, "modelValue"), a = pa(), s = "onUpdate:modelValue" in (((f = fu()) == null ? void 0 : f.vnode.props) || {}), o = S(() => s ? n.value : a.value), l = (h) => s && (n.value = h.target.value), i = S(
      () => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "class" && h !== "style" && h !== "value"))
    ), u = S(() => Object.fromEntries(Object.entries(a).filter(([h]) => h !== "value"))), c = C(null);
    return t({ focus: () => c.value && c.value.focus() }), (h, g) => e.label || e.icon || h.$slots.end ? (r(), d("label", {
      key: 0,
      class: Y(["text-field", { large: e.large, ended: h.$slots.end }, R(a).class]),
      style: ve(R(a).style)
    }, [
      e.icon ? (r(), F(le, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : k("", !0),
      e.label ? (r(), d("span", hw, v(e.label), 1)) : k("", !0),
      tt(m("input", De({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [R(ys), o.value]
      ]),
      h.$slots.end ? (r(), d("span", mw, [
        re(h.$slots, "end", {}, void 0, !0)
      ])) : k("", !0)
    ], 6)) : tt((r(), d("input", De({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, u.value, { onInput: l }), null, 16)), [
      [R(ys), o.value]
    ]);
  }
}), Q6 = /* @__PURE__ */ z(pw, [["__scopeId", "data-v-d9c38ca8"]]), gw = { class: "title" }, vw = { class: "state" }, yw = {
  __name: "StateRows",
  props: {
    term: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = fs(t.line, t.events);
    return (o, l) => (r(), F(X0, {
      rows: R(n),
      failure: R(a),
      loaded: R(s),
      empty: e.empty
    }, {
      default: P(({ row: i }) => [
        m("span", gw, v(i.title), 1),
        m("span", vw, v(R(dn)(e.term, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, X6 = /* @__PURE__ */ z(yw, [["__scopeId", "data-v-6be0c59e"]]);
function bw(e = 1e3, t = null) {
  const n = C(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? pe(t, s, { immediate: !0 }) : s(!0), Re(() => clearInterval(a)), n;
}
const Ua = C(Date.now() / 1e3);
let fl = 0, Fn = 0;
function co() {
  return Fn || (Ua.value = Date.now() / 1e3, fl = setInterval(() => Ua.value = Date.now() / 1e3, 1e3)), Fn += 1, zl() && ga(() => {
    Fn -= 1, Fn || clearInterval(fl);
  }), Ua;
}
const kw = 200, ww = ir + Yn + rr + kw, $w = 300, Wn = /* @__PURE__ */ new WeakMap();
function xw(e, t) {
  const n = Wn.get(e) ?? [];
  Wn.set(e, [...n, t]), !n.length && setTimeout(() => {
    const a = Wn.get(e);
    Wn.delete(e), e.run(["developer", "record-mark-motion", JSON.stringify(a)]);
  }, $w);
}
function Jt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function Sw(e, t, n) {
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
function Mw(e, t, n, a) {
  pe(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function u() {
      if (a.markMotion.value) {
        if (i.push(Sw(o, l, n.value)), performance.now() - l < ww) return void requestAnimationFrame(u);
        xw(a, { key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i });
      }
    }
    u();
  }, { flush: "sync" });
}
const _w = ["title", "data-figure-mark", "data-folded", "data-open"], Cw = {
  key: 2,
  class: "worker"
}, Aw = { class: "head" }, Ew = { key: 0 }, Ow = {
  key: 3,
  class: "status"
}, Tw = {
  key: 0,
  class: "figure"
}, Iw = {
  key: 1,
  class: "ran-for"
}, Bw = { key: 2 }, Rw = {
  key: 3,
  class: "news"
}, Lw = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Nw = {
  key: 6,
  class: "settled"
}, qw = {
  key: 1,
  class: "bar"
}, Dw = {
  key: 3,
  class: "detail body"
}, Pw = {
  key: 0,
  class: "body-label"
}, jw = ["title"], Fw = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = pa(), a = ["onClick", "onAct"], s = S(() => Object.fromEntries(Object.entries(n).filter(([ue]) => !a.includes(ue)))), o = C(!1), l = S(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = S(() => t.open !== void 0), u = S(() => i.value || l.value), c = S(() => i.value ? t.open : o.value), f = S(() => i.value ? !t.open : l.value && !o.value), h = S(() => !!(t.mark.action && n.onAct)), g = S(() => u.value || h.value || !!n.onClick), y = C(null), b = C(null), { folded: _, phase: M } = ur(y, () => f.value);
    Mw(y, f, M, Me(Le, null));
    function x(ue) {
      var ke, Ee;
      if (!(ue.target !== y.value && !b.value.contains(ue.target))) {
        if (i.value) return (ke = n.onClick) == null ? void 0 : ke.call(n, ue);
        if (l.value) return void (o.value = !o.value);
        (Ee = n.onAct || n.onClick) == null || Ee(ue);
      }
    }
    const T = (ue) => n.onAct(ue), H = ["failed", "unfinished"], W = S(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? H.includes(t.mark.state) ? "danger" : "good" : ""), I = S(() => t.mark.color ? t.mark.color : W.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : W.value ? `var(--tone-${W.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), G = S(() => I.value || "var(--tone-work)"), N = S(() => !t.mark.ending && !t.mark.ended && W.value !== "stopped"), A = co(), L = S(
      () => t.mark.began_at && N.value && !t.mark.figure && !t.mark.counting ? Vi(A.value - t.mark.began_at) : ""
    ), q = S(() => {
      const { started: ue, ended: ke } = t.mark;
      return ue ? ke ? `ran ${el(ke - ue, !0)}` : el(A.value - ue, !0) : L.value;
    }), w = ["bad", "danger", "warn"], p = S(() => w.includes(W.value) || t.mark.asks ? "attention" : N.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), $ = ["bad", "danger"], O = S(() => $.includes(W.value)), B = S(() => p.value === "process" ? "running" : O.value ? "cross" : W.value === "stopped" ? "stopped" : W.value === "good" ? "tick" : ""), j = S(
      () => !!(t.mark.figure || q.value || t.mark.docked || t.mark.stopping || B.value || t.mark.settled || t.mark.news)
    ), U = S(() => t.mark.markIcon ? { component: Ot, props: { class: "ico", name: t.mark.markIcon } } : { component: le, props: { name: t.mark.icon || "dot" } }), J = S(() => [t.mark.title, t.mark.time ? Gi(t.mark.time) : ""].filter(Boolean).join(" · ")), oe = S(() => ({
      ...I.value ? { "--mark": I.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ue, ke) => (r(), d("div", De(s.value, {
      ref_key: "root",
      ref: y,
      class: [
        "mark",
        `w-${p.value}`,
        R(M),
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
      "data-folded": R(_) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: x
    }), [
      (r(), F(Ke(g.value ? "button" : "span"), {
        ref_key: "top",
        ref: b,
        class: "top",
        type: g.value ? "button" : void 0,
        "aria-expanded": u.value ? String(!!c.value) : void 0
      }, {
        default: P(() => [
          e.mark.agentId ? (r(), F(hn, {
            key: 0,
            "agent-id": e.mark.agentId,
            label: e.mark.label,
            class: "agent-icon",
            "data-mark-agent": ""
          }, {
            default: P(() => [
              (r(), F(Ke(U.value.component), ds(Ul(U.value.props)), null, 16))
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : (r(), F(Ke(U.value.component), ds(De({ key: 1 }, U.value.props)), null, 16)),
          e.mark.worker ? (r(), d("span", Cw, v(e.mark.worker), 1)) : k("", !0),
          m("span", Aw, [
            E(it, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (r(), d("strong", Ew, v(e.mark.name), 1)) : k("", !0),
            u.value ? (r(), F(Qt, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : k("", !0)
          ]),
          j.value ? (r(), d("span", Ow, [
            e.mark.figure ? (r(), d("span", Tw, v(e.mark.figure), 1)) : k("", !0),
            q.value ? (r(), d("span", Iw, v(q.value), 1)) : k("", !0),
            e.mark.stopping ? (r(), d("span", Bw, "Stopping")) : k("", !0),
            e.mark.news ? (r(), d("span", Rw, v(e.mark.news), 1)) : k("", !0),
            B.value === "running" ? (r(), d("span", Lw)) : B.value ? (r(), F(Ot, {
              key: 5,
              class: Y(["sign", B.value]),
              name: B.value
            }, null, 8, ["class", "name"])) : k("", !0),
            e.mark.settled ? (r(), d("span", Nw, v(e.mark.settled), 1)) : k("", !0)
          ])) : k("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      h.value ? (r(), F(lr, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: xe(T, ["stop"])
      }, null, 8, ["label", "open"])) : k("", !0),
      (e.mark.figure || e.mark.counting) && N.value ? (r(), d("span", qw, [
        m("span", {
          class: "progress",
          style: ve({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: G.value })
        }, null, 4)
      ])) : k("", !0),
      e.mark.detail && !R(_) ? (r(), F(it, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      e.mark.body && !R(_) ? (r(), d("div", Dw, [
        e.mark.bodyLabel ? (r(), d("p", Pw, v(e.mark.bodyLabel), 1)) : k("", !0),
        E(it, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : k("", !0),
      e.mark.command && !R(_) ? (r(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, v(e.mark.command), 9, jw)) : k("", !0),
      e.mark.card ? (r(), F(it, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      re(ue.$slots, "default", {
        shown: !R(_)
      }, void 0, !0)
    ], 16, _w));
  }
}), fr = /* @__PURE__ */ z(Fw, [["__scopeId", "data-v-6e839007"]]), Ww = 8, Hw = 40, zw = [];
class fo {
  constructor(t, n, { top: a = Ww, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && zw.push(this);
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
    n > Hw && this.breach(`opened ${n}px above the bottom`), this.source.count() > this.source.pageSize() && this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
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
const Uw = 60, Gw = 300, hr = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function mr(e, t) {
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
  const c = new fo("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => Gw, more: () => a.value > 0, previous: u }, { top: Uw });
  return { lines: n, newest: l, follow: i, loadEarlier: (h) => c.reachTop(h), feed: c };
}
const Vw = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function pr(e) {
  var n;
  const t = Vw[e] || ((n = Yt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open";
}
const Kw = (e) => pr(String(e).split(":")[0]), Yw = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Qw = "agents", Xw = { passed: "good", failed: "danger", warned: "warn", running: "" }, Jw = { good: "good", warn: "warn", danger: "danger" }, hl = {
  "open row": (e) => je(`${e.target_model}:${e.target_id}`),
  "open page": (e) => fh(e.target_model, e.target_id || 0)
}, Zw = { "open row": (e) => Kw(e.target_model), "open page": () => pr("pages") };
function e2(e, t) {
  const n = t || {}, a = hl[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Xw[e.outcome] || "" : Jw[e.variant] || "",
    label: e.text,
    // a mark about an agent shows the agent's tooltip on its icon
    agentId: e.target_model === Qw ? e.target_id : 0,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? Zw[a](e) : "",
    handlers: a ? { onAct: () => hl[a](e) } : {}
  };
}
const t2 = 24, n2 = 1e3, ml = 2e3, a2 = 0.25, s2 = 5e3;
function o2(e, t = t2, n = () => !0) {
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
    const I = Date.now() - u < ml ? ml : n2;
    l = setTimeout(() => o.value = a.value, I);
  }
  function y() {
    clearTimeout(i), a.value = !1, s.value = 0, g(!1);
  }
  function b(W = !1) {
    const I = c();
    I && W && I.scrollTo ? I.scrollTo({ top: I.scrollHeight, behavior: "smooth" }) : I && (I.scrollTop = I.scrollHeight), y();
  }
  function _() {
    x(), !a.value && (a.value = !0, g(!0));
  }
  const M = () => !!c() && f() <= c().clientHeight * a2;
  function x() {
    clearTimeout(i), M() && (i = setTimeout(() => a.value && M() && n() && b(!0), s2));
  }
  function T() {
    h() ? y() : _();
  }
  function H(W = 1, I = !1) {
    a.value ? s.value += Math.max(0, W) : b(I);
  }
  return zl() && ga(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: f, atBottom: h, follow: y, toBottom: b, left: _, scrolled: T, arrived: H };
}
const l2 = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, i2 = (e) => String(e ?? "").replace(l2, ""), r2 = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(null), { away: o, scrolled: l, arrived: i, toBottom: u } = o2(s);
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
      K(v(R(i2)(e.lines.join(`
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
}, u2 = /* @__PURE__ */ z(r2, [["__scopeId", "data-v-89621acd"]]), c2 = "*.*", d2 = {
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
    const t = e, n = Me(Le, null), a = new ai();
    pe(
      () => a.patterns,
      (u, c, f) => {
        var g;
        const h = (g = n == null ? void 0 : n.subscriptions) == null ? void 0 : g.follow(`body of ${t.declaration.type}`, u, (y) => a.dispatch(y));
        f(() => h == null ? void 0 : h());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = S(() => !!(t.declaration.shipped || t.declaration.trusted)), i = S(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the user trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [c2] : t.declaration.events ?? [],
      options: []
    }));
    return (u, c) => l.value ? (r(), F(ar, {
      key: 0,
      entry: i.value,
      subscriptions: R(a),
      environment: R(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (r(), F(nr, {
      key: 1,
      entry: i.value,
      subscriptions: R(a),
      environment: R(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, f2 = { class: "mark-more-inner" }, h2 = {
  class: "mark-lines",
  "data-mark-reason": ""
}, m2 = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, p2 = {
  key: 3,
  class: "mark-lines"
}, g2 = "process", pl = "task", v2 = {
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
    const t = e, n = st(), a = S(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = S(() => Yw.has(t.mark.variant) && t.mark.detail || ""), o = S(() => t.mark.target_model === pl ? t.mark.target_id : 0), l = mr(
      hr(n),
      () => t.mark.target_id
    ), i = l.lines, u = C(!1), c = C(""), f = S(() => !t.declaration.body_url && t.mark.target_model === g2 && !!t.mark.target_id);
    async function h(y = l.follow) {
      const b = await y();
      u.value = !0, c.value = b.ok ? "" : b.error;
    }
    const g = S(() => t.shown && f.value);
    return pe(g, (y) => y && h()), Ws(() => g.value && h(), () => g.value && !t.mark.ended_at), pe(
      () => t.mark.ended_at,
      (y) => y && g.value && h(l.newest)
    ), (y, b) => (r(), d("div", {
      class: Y(["mark-more", { open: e.shown }]),
      onClick: b[1] || (b[1] = xe(() => {
      }, ["stop"]))
    }, [
      m("div", f2, [
        e.declaration.body_url ? (r(), F(d2, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded,
          collapsed: e.collapsed
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded", "collapsed"])) : (r(), d(D, { key: 1 }, [
          s.value ? (r(), d(D, { key: 0 }, [
            b[2] || (b[2] = m("p", { class: "mark-label" }, "Why it stopped", -1)),
            m("p", h2, v(s.value), 1)
          ], 64)) : k("", !0),
          f.value && c.value ? (r(), d("p", m2, v(c.value), 1)) : f.value && u.value ? (r(), d(D, { key: 2 }, [
            b[3] || (b[3] = m("p", { class: "mark-label" }, "Output", -1)),
            E(u2, {
              class: "mark-terminal",
              lines: R(i),
              feed: R(l).feed,
              onOlder: R(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (r(), d("p", p2, v(a.value.join(`
`)), 1)) : k("", !0),
          o.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: b[0] || (b[0] = xe((_) => R(je)(`${pl}:${o.value}`), ["stop"]))
          }, " Open task " + v(o.value) + " and its proofs ", 1)) : k("", !0)
        ], 64))
      ])
    ], 2));
  }
}, As = /* @__PURE__ */ z(v2, [["__scopeId", "data-v-df71b15a"]]), y2 = ["title", "aria-label", "onClick"], b2 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, k2 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = S(() => Df(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = C(""), s = Me(Le);
    async function o(l) {
      const i = await xn(l, { id: t.mark.target_id }, s.environment);
      a.value = i.ok ? "" : i.error;
    }
    return (l, i) => (r(), d(D, null, [
      (r(!0), d(D, null, ne(n.value, (u) => (r(), d("button", {
        key: u.runs,
        type: "button",
        class: "mark-button",
        title: u.label,
        "aria-label": u.label,
        onClick: xe((c) => o(u), ["stop"])
      }, [
        E(Ot, {
          name: u.icon
        }, null, 8, ["name"])
      ], 8, y2))), 128)),
      a.value ? (r(), d("span", b2, v(a.value), 1)) : k("", !0)
    ], 64));
  }
}, w2 = /* @__PURE__ */ z(k2, [["__scopeId", "data-v-7a62c88e"]]);
function gr(e, t) {
  const n = et(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Ae.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const vr = gr("/api/marks", "marks"), J6 = vr.fetchAll, $2 = vr.find, x2 = ["data-ref"], S2 = ["data-ref"], M2 = { class: "mark-row" }, _2 = "dock add", C2 = "questions.answer", A2 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = S(() => $2(a.mark.type)), o = S(() => e2(a.mark, s.value)), l = S(() => {
      var g;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (g = s.value) != null && g.body_url);
    }), i = S(() => l.value || !!o.value.handlers.onAct), u = S(() => a.mark.type === C2), c = C(!1);
    function f() {
      c.value = !c.value;
    }
    const h = S(() => {
      var g;
      return (((g = s.value) == null ? void 0 : g.buttons) || []).filter((y) => {
        var b;
        return !a.docked || !((b = y.runs) != null && b.startsWith(_2));
      }).map((y) => ({ ...y, module: s.value.module }));
    });
    return (g, y) => {
      var b, _;
      return (b = s.value) != null && b.card ? (r(), d("div", {
        key: 0,
        class: Y(["thread-turn", "card", "whole-card", { "user-side": R(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        E(As, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, x2)) : (r(), d("div", {
        key: 1,
        class: Y(["thread-turn", "card", { "full-width": (_ = s.value) == null ? void 0 : _.full_width, docked: e.docked, "user-side": R(n).has(e.mark.variant), "answer-bubble": u.value }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        m("span", M2, [
          E(fr, {
            mark: o.value,
            open: i.value ? c.value : void 0,
            onAct: o.value.handlers.onAct,
            onClick: f
          }, Hl({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: P(({ shown: M }) => [
                E(As, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: M
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["mark", "open", "onAct"]),
          E(w2, {
            buttons: h.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, S2));
    };
  }
}, E2 = /* @__PURE__ */ z(A2, [["__scopeId", "data-v-424ddb61"]]), O2 = ["data-ref"], T2 = ["inert"], I2 = { class: "group-fold" }, B2 = { class: "thread-group" }, R2 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = C(!1), a = C(!1), s = C(!1), o = C(null);
    pe(n, async (i) => {
      var u;
      a.value = !0, await Fe(), (u = o.value) == null || u.offsetHeight, s.value = i;
    });
    const l = S(() => ({
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
      E(fr, {
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
        m("div", I2, [
          m("div", B2, [
            (r(!0), d(D, null, ne(e.group.marks, (c) => (r(), F(E2, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, T2)) : k("", !0)
    ], 8, O2));
  }
}, Z6 = /* @__PURE__ */ z(R2, [["__scopeId", "data-v-45b58b9b"]]);
function L2(e) {
  const t = C(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return _e(() => n.observe(e.value)), at(() => n.disconnect()), t;
}
const N2 = { class: "chat-dock-fold" }, q2 = ["aria-label"], D2 = { class: "chat-dock-head" }, P2 = { class: "chat-dock-inner" }, j2 = { class: "chat-dock-foot" }, yr = 700, F2 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = C(null), a = C(null), s = L2(a), o = C(!1);
    let l = 0;
    return _e(() => l = setTimeout(() => o.value = !0, yr)), at(() => clearTimeout(l)), t({ card: n }), (i, u) => (r(), d("div", {
      class: Y(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      m("div", N2, [
        m("section", {
          ref_key: "card",
          ref: n,
          class: Y(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          re(i.$slots, "edge", {}, void 0, !0),
          m("header", D2, [
            re(i.$slots, "head", {}, void 0, !0)
          ]),
          m("div", {
            class: Y(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            m("div", P2, [
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
          m("footer", j2, [
            re(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, q2)
      ])
    ], 2));
  }
}, W2 = /* @__PURE__ */ z(F2, [["__scopeId", "data-v-cc05fdac"]]), H2 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Ga = 5, z2 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Ga, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${Ga}s`, animationDelay: `${(n - Ga).toFixed(2)}s` };
    return (s, o) => (r(), d("span", H2, [
      m("i", { style: a })
    ]));
  }
}, U2 = /* @__PURE__ */ z(z2, [["__scopeId", "data-v-2a7bc150"]]), G2 = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), Es = (e) => e.charAt(0).toUpperCase() + e.slice(1), V2 = (e) => Es(e.replace(/_at$/, "").replaceAll("_", " ")), K2 = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, Y2 = (e, t, n) => [Es(`${e} ${n}`), (t == null ? void 0 : t.state) && Es(t.state)].filter(Boolean).join(" · "), br = (e) => Ht(e).text, Q2 = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? br(t) : (e == null ? void 0 : e.name) ?? "", X2 = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? br(t) : "", J2 = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !G2.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: V2(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], Z2 = { reviewing: "Under review" }, e$ = (e, t) => e || Z2[t == null ? void 0 : t.state] || "", kr = gr("/api/docks", "docks"), eM = kr.fetchAll, Nt = kr.find, t$ = 6, Va = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, ho = (e) => Date.parse(e.leaves_at) / 1e3, en = (e) => !!(e.leaves_at && !e.kept), n$ = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!en(e) || t < ho(e) || n.has(e.id)), a$ = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => n$(a, t, n)).sort((a, s) => a.id - s.id);
function s$(e, t, n = t$) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(ho(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const o$ = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Os = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), l$ = (e, t) => !(t != null && t.needs_user) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), i$ = (e) => ({ ...e.kept ? Os("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : Os("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), r$ = ["keep", "unkeep", "open", "undock"], u$ = (e) => ({ ...e, iconOnly: r$.includes(e.action) });
function c$(e, t) {
  var n;
  return [
    ...l$(e, t) ? [i$(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Yt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    Os("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(u$);
}
function wr(e, t) {
  const n = c$(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: o$(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const d$ = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || wr(e, t).title, f$ = { class: "dock-text" }, h$ = ["title"], m$ = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, p$ = {
  class: "dock-facts",
  "data-dock-facts": ""
}, g$ = {
  key: 1,
  "data-dock-row": ""
}, v$ = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = S(() => Nt(a.item.type)), o = co(), l = S(() => Mn(a.item.created_at, o.value * 1e3)), i = C(null), u = C(null), c = C(null), f = C(null), h = S(() => wr(a.item, s.value)), g = st(), y = S(() => `dock.${a.item.id}`), b = S(() => g.props[y.value].data.value), _ = S(() => d$(a.item, s.value, b.value)), M = S(() => oa(a.item.target_model ?? "")), x = S(() => {
      var p;
      return ((p = s.value) == null ? void 0 : p.word) ?? "";
    }), T = S(() => ({ ...b.value, id: a.item.target_id, term: M.value })), H = () => {
      var p, $;
      return (($ = (p = s.value) == null ? void 0 : p.reads) == null ? void 0 : $.length) && g.reload(y.value);
    };
    Rc(Ps, { data: b, reload: H, readOutput: hr(g) }), pe(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (p, $, O) => {
        var j;
        H();
        const B = (j = g.followUndeclared) == null ? void 0 : j.call(g, [`${M.value.replaceAll("-", "_")}.*`], (U) => {
          (!U.row_id || U.row_id === a.item.target_id) && H();
        });
        O(() => B == null ? void 0 : B());
      },
      { immediate: !0 }
    );
    const W = C(/* @__PURE__ */ new Set()), I = C("");
    async function G(p) {
      if (p.action === "undock") return n("undock", p);
      if (p.action === "open") return je(`${a.item.target_model}:${a.item.target_id}`);
      p.action === "declared" && (W.value = /* @__PURE__ */ new Set([...W.value, p.label])), I.value = "";
      const O = await xn(p, { id: a.item.target_id }, g.environment);
      (O == null ? void 0 : O.ok) === !1 && (W.value = new Set([...W.value].filter((B) => B !== p.label)), I.value = `Could not ${p.label.toLowerCase()}: ${O.error}`);
    }
    const N = S(() => h.value.actions.filter((p) => !W.value.has(p.label))), A = S(() => {
      var p;
      return e$((p = s.value) == null ? void 0 : p.badge, T.value);
    }), L = S(() => h.value.controls), q = S(() => {
      var p;
      return !((p = s.value) != null && p.folds && a.folded);
    }), w = S(() => {
      var p;
      return !!((p = s.value) != null && p.draws_head) && !a.collapsed;
    });
    return (p, $) => {
      var O, B, j, U;
      return r(), F(W2, {
        label: h.value.title + ((O = s.value) != null && O.needs_user ? ", waiting for you" : ""),
        type: (B = s.value) != null && B.needs_user ? "waiting" : "",
        folded: !!((j = s.value) != null && j.folds) && e.folded,
        body: !!((U = s.value) != null && U.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: $[4] || ($[4] = (J) => e.collapsed && n("open"))
      }, {
        edge: P(() => [
          e.leaving && !e.item.kept ? (r(), F(U2, {
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
            }, null, 512)) : (r(), d(D, { key: 1 }, [
              E(le, {
                name: h.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              m("span", f$, [
                m("span", {
                  class: Y(["dock-title", { strip: e.collapsed }]),
                  title: _.value
                }, v(_.value), 11, h$)
              ])
            ], 64)),
            m("span", {
              ref_key: "time",
              ref: f,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (J = s.value) != null && J.leaves_after_seconds ? k("", !0) : (r(), d(D, { key: 0 }, [
                K(v(l.value), 1)
              ], 64))
            ], 512),
            L.value.length ? (r(), d("span", {
              key: 2,
              class: "dock-controls",
              onClick: $[0] || ($[0] = xe(() => {
              }, ["stop"]))
            }, [
              (r(!0), d(D, null, ne(L.value, (oe) => {
                var ue, ke;
                return r(), d(D, {
                  key: oe.action + oe.runs
                }, [
                  !W.value.has(oe.label) && (!((ue = oe.variants) != null && ue.length) || !((ke = T.value) != null && ke.state) || oe.variants.includes(T.value.state)) ? (r(), F(ge, {
                    key: 0,
                    variant: "icon",
                    class: Y({ kept: oe.pressed }),
                    "aria-pressed": oe.pressed,
                    "aria-label": oe.label,
                    title: oe.label,
                    "data-dock-action": oe.action,
                    onClick: (Ee) => G(oe)
                  }, {
                    default: P(() => [
                      E(le, {
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
          I.value || e.refusal ? (r(), d("p", m$, v(I.value || e.refusal), 1)) : k("", !0)
        ]),
        foot: P(() => {
          var J;
          return [
            m("span", p$, [
              A.value ? (r(), d("span", {
                key: 0,
                class: Y(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, v(A.value), 3)) : k("", !0),
              x.value ? (r(), d("span", g$, v(x.value) + " " + v(e.item.target_id), 1)) : k("", !0),
              m("span", {
                ref_key: "foot",
                ref: u,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (J = s.value) != null && J.folds ? (r(), F(ge, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: $[1] || ($[1] = (oe) => n("fold"))
            }, {
              default: P(() => [
                K(v(s.value.folds) + " ", 1),
                E(Qt, {
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
              q.value ? (r(), d(D, { key: 0 }, [
                E(eo, {
                  name: `dock.${e.item.type}`,
                  row: T.value,
                  environment: R(g).environment,
                  "read-only": R(g).readOnly,
                  "object-name": R(oa)(e.item.target_model),
                  "external-failure": "",
                  onFailure: $[2] || ($[2] = (oe) => I.value = oe),
                  onDone: p.loadRow
                }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
                (r(!0), d(D, null, ne(N.value, (oe) => (r(), F(ge, {
                  key: oe.action + oe.runs,
                  small: "",
                  variant: oe.primary ? "primary" : "ghost",
                  bordered: !oe.primary,
                  "data-dock-action": oe.action,
                  onClick: (ue) => G(oe)
                }, {
                  default: P(() => [
                    K(v(oe.label), 1)
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
            (J = s.value) != null && J.body_url ? (r(), F(As, {
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
}, gl = /* @__PURE__ */ z(v$, [["__scopeId", "data-v-4d692a2f"]]), y$ = 24, b$ = 8, tM = 420;
function nM({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= y$ ? !0 : e < t && s > b$ ? !1 : null;
}
const k$ = (e, t) => e === void 0 ? t : e, w$ = { me: 1, people: [] }, ra = Gt({
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
  people: w$,
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
Ci("journal.activity", () => ra.activity);
Ci("journal.side.mini", () => ra.sideMini);
const $r = "journal.viewer.";
function $$(e, t, n) {
  try {
    const a = n.getItem($r + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function x$(e, t, n) {
  try {
    n.setItem($r + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function vl(e, t, n = window.localStorage) {
  const a = C($$(e, t, n));
  return pe(a, (s) => x$(e, s, n), { deep: !0 }), a;
}
const S$ = {
  key: "dock-all",
  class: "dock-all"
}, M$ = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var w, p;
    const t = e, n = bw(500), a = C(/* @__PURE__ */ new Set()), s = Me(Le), o = C(/* @__PURE__ */ new Set()), l = C({});
    async function i($, O) {
      l.value = { ...l.value, [$.id]: "" }, o.value = /* @__PURE__ */ new Set([...o.value, $.id]);
      const B = await xn(O, { id: $.target_id }, s.environment);
      (B == null ? void 0 : B.ok) === !1 && (o.value = new Set([...o.value].filter((j) => j !== $.id)), l.value = { ...l.value, [$.id]: `Could not dismiss this card: ${B.error}` });
    }
    const u = S(
      () => a$(
        t.items.filter(($) => !o.value.has($.id)),
        n.value,
        a.value
      )
    ), c = S(
      () => s$(
        u.value.filter(($) => Va($, Nt)),
        n.value
      )
    ), f = S(() => u.value.filter(($) => !c.value.includes($) && !Va($, Nt))), h = vl(`dock-size:${((w = ra.identity) == null ? void 0 : w.root) || location.host}`, null), g = ($) => {
      var O;
      return !!((O = Nt($.type)) != null && O.needs_user);
    }, y = C(/* @__PURE__ */ new Set()), b = C(/* @__PURE__ */ new Set()), _ = S(() => u.value.length === 1), M = ($) => g($) || _.value, x = ($) => M($) ? y.value.has($.id) || b.value.has($.id) : h.value ? h.value.collapsed && !h.value.opened.includes($.id) : t.collapsed, T = S(() => u.value.some(x));
    pe(() => t.collapsed, ($) => {
      b.value = new Set($ ? u.value.filter(g).map((O) => O.id) : []);
    });
    function H() {
      const $ = !T.value;
      h.value = { collapsed: $, opened: [] }, y.value = new Set($ ? u.value.filter(g).map((O) => O.id) : []), b.value = /* @__PURE__ */ new Set();
    }
    function W($) {
      var B;
      if (!x($)) return;
      if (M($)) {
        y.value = new Set([...y.value].filter((j) => j !== $.id)), b.value = new Set([...b.value].filter((j) => j !== $.id));
        return;
      }
      const O = (B = h.value) != null && B.collapsed ? h.value.opened : [];
      h.value = { collapsed: !0, opened: [...O, $.id] };
    }
    const I = vl(`dock-folded:${((p = ra.identity) == null ? void 0 : p.root) || location.host}`, {}), G = ($) => {
      var O;
      return !!((O = Nt($.type)) != null && O.folds) && (t.insidesFolded || k$(I.value[$.id], Va($, Nt) || t.folded));
    };
    function N($) {
      G($) && A($), I.value = { ...I.value, [$.id]: !G($) };
    }
    function A($) {
      var O;
      !((O = h.value) != null && O.collapsed) || h.value.opened.includes($.id) || (h.value = { collapsed: !0, opened: [...h.value.opened, $.id] });
    }
    function L($) {
      a.value = /* @__PURE__ */ new Set([...a.value, $.id]);
    }
    function q($) {
      a.value = new Set([...a.value].filter((O) => O !== $.id));
    }
    return ($, O) => (r(), F(js, {
      tag: "div",
      name: "dock",
      duration: R(yr),
      class: "dock-stack"
    }, {
      default: P(() => [
        u.value.length > 1 ? (r(), d("div", S$, [
          E(ge, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": T.value ? "Open all" : "Collapse all",
            onClick: H
          }, {
            default: P(() => [
              E(Qt, {
                open: !T.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : k("", !0),
        (r(!0), d(D, null, ne(f.value, (B) => (r(), F(gl, {
          key: B.id,
          item: B,
          class: Y({ timed: R(en)(B) }),
          leaving: R(en)(B) && !a.value.has(B.id),
          folded: G(B),
          collapsed: x(B),
          refusal: l.value[B.id],
          onOpen: (j) => W(B),
          onFold: (j) => N(B),
          onUndock: (j) => i(B, j),
          onMouseenter: (j) => L(B),
          onMouseleave: (j) => q(B)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        (r(!0), d(D, null, ne(c.value, (B) => (r(), F(gl, {
          key: B.id,
          item: B,
          class: Y({ timed: R(en)(B) }),
          leaving: R(en)(B) && !a.value.has(B.id),
          folded: G(B),
          collapsed: x(B),
          refusal: l.value[B.id],
          onOpen: (j) => W(B),
          onFold: (j) => N(B),
          onUndock: (j) => i(B, j),
          onMouseenter: (j) => L(B),
          onMouseleave: (j) => q(B)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128))
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, aM = /* @__PURE__ */ z(M$, [["__scopeId", "data-v-ab76ae18"]]), _t = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Qn = (e) => Math.min(Math.max(e, 0), 1), _$ = (e) => {
  const t = Qn(e);
  return t * t * (3 - 2 * t);
}, wt = (e, t, n) => _$((e - t) / (n - t));
function sM(e) {
  const t = Qn(e), n = Qn((t - 0.12) / 0.76) * _t.shuffles, a = Math.min(Math.floor(n), _t.shuffles - 1), s = n - a, o = wt(s, 0.26, 0.38) * (1 - wt(s, 0.76, 0.96)), l = wt(s, 0.38, 0.76), i = wt(t, 0, 0.12) * (1 - wt(t, 0.88, 1)), u = wt(s, 0.2, 0.34) * (1 - wt(s, 0.84, 1)), c = Math.sin(Math.PI * Qn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / _t.shuffles, lift: _t.lift * o, ready: i, weight: u, follow: c, shuffle: a, phase: s };
}
function oM(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const yl = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, lM = (e) => yl[e] ?? yl.butler, mo = 2400, C$ = 0.05;
function A$({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, C$), l = Math.min(t + mo * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function iM(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function E$(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function rM(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const uM = (e, t) => ({ ...e, stretch: t.stretch }), cM = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, xr = (e, t) => t >= (e.least ?? 0);
function dM(e, t, n) {
  if (!xr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const fM = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), O$ = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", bl = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), T$ = (e) => e.right > e.left && e.bottom > e.top;
function hM(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(O$)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = bl(l, n);
    const u = o.closest("[data-figure-scroll]");
    return u && !o.closest("[data-figure-chat-foot]") && (i = bl(i, u.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), T$(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
  });
}
function Sr(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, i = 1;
    for (const [f, h, g] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[f] - e[f];
      if (Math.abs(y) < 1e-9)
        (e[f] < o[h] || e[f] > o[g]) && (i = -1);
      else {
        const b = (o[h] - e[f]) / y, _ = (o[g] - e[f]) / y;
        l = Math.max(l, Math.min(b, _)), i = Math.min(i, Math.max(b, _));
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
}, pn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), I$ = (e) => e * e * (3 - 2 * e), Ie = (e, [t, n]) => I$(pn(e, t, n)), B$ = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], gt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Hn = ([e, t], n) => e + n() * (t - e);
function R$(e) {
  return B$.map(() => {
    const t = Hn(gt.speed, e), n = Hn(gt.angle, e) * Math.PI / 180, a = Hn(gt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Hn(gt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const L$ = R$(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function N$(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * gt.gravity * (t[2] - gt.floor))) / gt.gravity;
}
function mM(e, t, n = L$) {
  const a = Te.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = N$(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const u = Math.min(s, l), c = a.from.map((f, h) => f + o.velocity[h] * u);
  return c[2] -= gt.gravity * u * u / 2, { at: c, turn: o.spin * u, landed: Math.max(0, s - l) / i };
}
const pM = (e, t) => e && Te[e.name] ? { name: e.name, u: t / e.frames } : null;
function gM(e, t) {
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
const vM = () => Array.from({ length: Te.pogo.count }, (e, t) => Te.pogo.bounce * (t + 1) / Te.pogo.count), jt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function yM(e, t, n) {
  const { away: a, side: s } = Te.bug_smash, o = s * a * n, [l, i] = [t.left + jt.margin * n, t.right - jt.margin * n], u = Math.min(Math.max(e + o + s * jt.reach * n, l), i), c = u - o - e, f = u - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, f - o - t.left], bug: [u - t.left, f - t.left] };
}
function bM(e, t, n) {
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
function kM(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= jt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = A$({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Pe = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function wM(e) {
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
function q$(e, t) {
  const n = Te.bug_shot, [a, s] = n.turn.map((f) => f * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = E$(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function $M(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Te.bug_shot, { frame: l, bug: i, shot: u } = q$(n, e.length), c = e.map((x, T) => ({ ...Ts(x, t, Math.min(n / o.fps, Xn(T).shot)), shot: T < u })), f = Ie(l / o.frames, o.aim), [h, g] = [c[Math.max(i - 1, 0)], c[i]], y = e.map((x, T) => ({ bug: x, index: T, seconds: n / o.fps - Xn(T).shot, spot: Ts(x, t, Xn(T).shot) })).filter((x) => x.seconds >= 0), b = y.flatMap((x) => {
    const T = (s == null ? void 0 : s.get(x.index)) ?? W$(x.bug, t, x.spot, s ? [] : a);
    return s == null || s.set(x.index, T), s && H$(T, x.seconds, a), z$(T, x.seconds, a);
  }), _ = y.filter((x) => j$(x.bug)).map((x) => ({ seconds: x.seconds, from: x.spot })), M = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - f) + +(e[i].wall === "top") * f;
  return { bugs: c, frame: l, target: { x: h.x + (g.x - h.x) * f, y: h.y + (g.y - h.y) * f, back: M }, slush: b, camera: _ };
}
function Xn(e) {
  const t = Te.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function xM(e, t, n, a) {
  const { limit: s, margin: o } = Te.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let u = n.x;
  return e.map((c, f) => {
    const h = Xn(f), g = Ts(c, t, h.shot), y = Math.abs(g.y - n.y) / Math.tan(s * Math.PI / 180), b = g.x === u ? u - l >= i - u ? -1 : 1 : Math.sign(u - g.x), _ = Math.abs(g.x - u) >= y ? u : g.x + b * y, M = b > 0 ? Math.max(u, Math.min(_, i)) : Math.min(u, Math.max(_, l)), x = { from: u, to: M, begin: h.walk, end: h.aim };
    return u = M, x;
  });
}
function SM(e, t, n) {
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
const Ce = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, D$ = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function P$(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const j$ = (e) => e.along * 97 % 1 < Ce.camera, gn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * Ce.gravity * t * t });
function F$(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * Ce.gravity * (t.bottom - e.from.y))) / Ce.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * Ce.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / Ce.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, f) => c.t - f.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += Ce.step) {
    const f = Math.min(c + Ce.step, l.t), h = gn(e, f), g = Sr(i, h, n);
    if (g) return { ...g, t: c + (f - c) * g.share };
    i = h;
  }
  const u = gn(e, l.t);
  return { ...l, x: Math.min(Math.max(u.x, t.left), t.right), y: Math.min(Math.max(u.y, t.top), t.bottom) };
}
function W$(e, t, n, a = []) {
  const s = P$(e.along + 1), [o, l] = D$[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: Ce.count }, () => {
    const u = i + (s() - 0.5) * 2 * (Ce.spread * Math.PI / 180), c = Ce.speed[0] + s() * (Ce.speed[1] - Ce.speed[0]), f = { from: { x: n.x, y: n.y }, vx: Math.cos(u) * c, vy: Math.sin(u) * c, r: Ce.radius[0] + s() * (Ce.radius[1] - Ce.radius[0]) };
    return { ...f, ...F$(f, t, a) };
  });
}
function H$(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += Ce.step) {
      const l = Math.min(o + Ce.step, s), i = Sr(gn(a, o), gn(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function z$(e, t, n = []) {
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
function MM(e, t, n, a) {
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
function _M(e, t, n, a, s) {
  const { sway: o, above: l } = Te.chute, i = { x: t.x, y: t.y - l * a }, u = o / 2 * Math.sin(2 * Math.PI * s), [c, f] = [Math.cos(u * Math.PI / 180), Math.sin(u * Math.PI / 180)], h = (_) => {
    const [M, x] = [_.x - e.at.x, _.y - e.at.y];
    return { x: i.x + M * c - x * f, y: i.y + M * f + x * c };
  }, [g, y] = [...n].sort((_, M) => _.x - M.x), b = e.ends.map(h);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: u, lines: b.map((_, M) => ({ from: _, to: M < b.length / 2 ? g : y })) };
}
const CM = (e, t) => Ie(t, e.grows) * (1 - Ie(t, e.sinks));
function ua(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: pn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: pn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function AM(e, t) {
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
const EM = (e) => e === "pack_box";
function OM(e) {
  const { into: t, out: n } = ua(Te.rope_swing, e);
  return 1 - Ie(t, [0, 1]) * (1 - Ie(n, [0, 1]));
}
function TM(e) {
  const t = Te.rope_swing, { into: n, out: a } = ua(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Ie(n, [0, 1]) * (1 - Ie(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const U$ = { after: 3 }, po = 10, G$ = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, V$ = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, K$ = { weight: 19 }, Mr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, Y$ = { every: 120 }, _r = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Cr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, Q$ = {
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
}, Cn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: po }), ie = (e, t, n = {}) => Cn(e, "clip", t, n), Ka = (e, t, n = {}) => Cn(e, "look", t, n), kl = (e, t, n = {}) => Cn(e, "gaze", t, n), ye = (e, t, n = {}, a = {}) => ({ ...Cn(e, "pick", t, n), ...a }), $e = (e) => Cn("nothing", "nothing", e, {}), X$ = 120, J$ = 300, Ya = (e, t) => ({ ...ie(e, t), cooldown: J$ }), fe = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), Z$ = () => [ie("joy", 2)], $t = (e, t, n, a, s = {}) => ({ ...ie(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), xt = (e) => ({ ...e, cooldown: G$[e.name] }), Zt = (e) => ({ ...e, shenanigan: !0, lasts: V$[e.name] }), $a = [
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
  ...fe("reported", { cooldown: 90 }, [kl("read", 3), ie("nod", 1), $e(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...fe("read_message", { cooldown: 30 }, [kl("read", 3), $e(1)]),
  ...fe("fact_filed", { cooldown: 120 }, [ie("file_card", 3), ie("nod", 1), $e(6)]),
  ...fe("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ie("nod", 2), $e(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...fe("bar_done", { holds: !0 }, Z$()),
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
  ...Object.entries(Q$).flatMap(([e, t]) => fe(`reacted:${e}`, {}, [Ka(t, 1)])),
  ...Object.entries(_r).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => fe(`agent_reacted:${n}`, {}, [ie(a, 1, { voices: [e] })])[0])),
  ...Object.entries(Cr).flatMap(([e, t]) => fe(`agent_reacted:${e}`, {}, [ie(t, 1)])),
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
  ...fe("held:search", { cooldown: X$ }, [Ya("search", 3), { ...Ya("binoculars", 2), when: { home: !0 } }, { ...Ya("glass_bubble", 2), when: { bubble: !0 } }]),
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
  ...fe("unit", { cooldown: Mr.build.cooldown }, [ye("unit", K$.weight), $e(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...fe("progress_jump", { cooldown: 6 }, [ie("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...fe("perch", {}, [{ ...ye("hang", 1, { hands: !0, free: !0 }), cooldown: Y$.every }, ye("stand", 5)]),
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
], Ar = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), Er = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), e5 = (e) => Array.isArray(e) ? e[0] : e, t5 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, n5 = (e) => $a.some((t) => t.when.moment === e);
function a5(e) {
  var c;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), a = (f) => !e.memory || Er(f).every(([h, g]) => n(h) >= e5(g)), s = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = $a.filter((f) => Ar(f.when, e) && (f.type !== "clip" || t(f.name)) && a(f) && s(f)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= U$.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, u = i.filter((f) => {
    var h;
    return f.type === "nothing" || f.name !== ((h = e.tally) == null ? void 0 : h.last);
  });
  return u.some((f) => f.type !== "nothing") ? u : i;
}
function Ye(e, t) {
  const n = a5(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (Or(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Or(e, t, n) {
  var a;
  for (const [s, o] of Er(t)) (a = e.memory) == null || a.set(s, e.now + t5(o, n));
}
function IM(e, t, n) {
  Or(e, $a.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const BM = (e) => Object.values(Mr).find((t) => Ar(t.when, e)) ?? null, s5 = (e, t, n) => n - t <= (e.lifetime ?? po), RM = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || xr(e.clip, t));
class Tr {
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
}, LM = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Ir = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), NM = {
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
}, qM = 120, o5 = 20, DM = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < o5), l5 = (e) => Is[e] || Is.idle, PM = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Br = "airborne", i5 = "landing", r5 = "travelling", Rr = "grounded", jM = ({ airborne: e, landing: t, trip: n }) => e ? Br : t ? i5 : n != null && n.started ? r5 : Rr;
function FM(e, t) {
  var s;
  const n = u5(e, t);
  return e.mode === Rr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function u5(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: u, state: c, doing: f, doingFacing: h = 0, readingFacing: g = null } = e;
  if (n === Br && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (u == null ? void 0 : u.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...c5(o, f, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (u && !(u.onto && o)) return { clip: u.clip, facing: u.facing, once: !0, ...u.holds && { holds: !0 }, ...u.stretch && { stretch: u.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const y = g !== null && i.posture === "stand" && f !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(f) ? { clip: "waiting", facing: y ? g : e.composeFacing ?? 0 } : { clip: t(f, i.posture) ? f : l5(c), facing: y ? g : i.posture === "sit" ? i.face : h };
}
function c5(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Bs = (e) => e.outcome, d5 = /^plugin:[^:]+:sins:/, wl = (e) => e.type === "plugins.card" && d5.test(e.markKey), f5 = [
  // a finding a plugin made in the agent's change, and one it found fixed, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => wl(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => wl(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], WM = (e, t) => e.filter((n) => n.author === "user" && la(n.read_at) > t).map((n) => ({ beat: "read_message", time: la(n.read_at), card: Pi(n) })).sort((n, a) => n.time - a.time), $l = { user: "reacted", agent: "agent_reacted" };
function HM(e, t) {
  return e.filter((n) => $l[n.author] && Et(n) > t).map((n) => ({ beat: `${$l[n.author]}:${n.emoji}`, time: Et(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const h5 = [.../* @__PURE__ */ new Set([...Object.values(_r).flatMap((e) => Object.keys(e)), ...Object.keys(Cr)])];
function zM(e, t) {
  return e.filter((n) => n.author === "agent" && Et(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = h5.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: Et(n), card: Pi(n) })).sort((n, a) => n.time - a.time);
}
const m5 = (e) => new Tr(e).isTest(), ca = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Bs(e)] || "";
}, p5 = 1800, g5 = (e, t) => {
  if (ca(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && ca(n) !== "finished" && Number(e.time) - Number(n.time) <= p5 ? "tests_fixed" : "tests_passed";
};
function UM(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(m5), s = a.filter((i) => ca(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, ca(i))), o.map((i) => ({ beat: g5(i, s), time: Number(i.time), card: i.key }));
}
function GM(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Bs(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Bs(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const VM = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: Et(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function KM(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function YM(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function QM(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var u;
    return { beat: (u = f5.find((c) => c.matches(i))) == null ? void 0 : u.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, u) => i.time - u.time);
}
function go(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const xl = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function v5(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    go(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function XM(e, t, n, a = {}) {
  const s = Ye({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : n5(`held:${e}`) ? "idle" : e;
}
const qe = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function JM(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < qe.ahead * n ? 180 : Math.sign(a) * qe.turn;
}
const Sl = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function ZM(e, t) {
  const n = Math.min(qe.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(qe.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(qe.lines, Math.floor((e.bottom - e.top - 2 * a) / qe.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / qe.sweep) % s, i = o % qe.sweep, u = qe.sweep - qe.returnSeconds, c = Sl((i - u) / qe.returnSeconds), f = i <= u ? Sl(i / u) : 1 - c, h = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + a + h * qe.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Ml = 3, Lr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, _l = 12, e_ = (e, t) => ({ mood: e, began: t, seen: 0 });
function t_(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!Lr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= Ml ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * _l) / _l, lasts: Ml } };
}
const n_ = (e) => e.posture === "hang" && !Lr(e.face), y5 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), b5 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function a_(e, t, n) {
  return y5.has(e) ? 1 / 0 : !b5.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Nr(n - t.began, t.share) - rt.lead, 0);
}
const k5 = 5;
function s_(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= k5 ? { beat: "long_walk", time: n } : null };
}
const w5 = 30, zn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function o_(e, t, n, a, s = null) {
  if (t && n < t.until || !zn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Ye({ moment: "spell", state: e, tally: s }, a), [l, i] = zn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + zn.every } : { state: e, began: 0, until: 0, next: n + zn.every };
}
const l_ = (e, t, n) => t && n < t.until && Ir.has(e.state) ? { state: t.state, since: t.began } : e, rt = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Nr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function i_(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const u = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: u ? { beat: u } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = Nr(o, e.share);
  return s ? { eager: $5(t, l), moment: null } : l > rt.lead ? { eager: t, moment: null } : l < rt.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > rt.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < rt.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = Ye({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function $5(e, t) {
  return e.on && t > rt.lead + rt.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= rt.lead && t >= rt.least ? { ...e, on: !0, calm: !1 } : e;
}
const x5 = 1, S5 = { look: "look", gaze: "gaze" };
function M5(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = Ye({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [S5[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const _5 = (e, t, n, a, s, o = "", l = () => !0, i = null, u = "") => Ye({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: u }, s), C5 = (e, t, n, a, s, o = 0) => Ye({ moment: "jump", high: e > x5 * t, memory: a, now: s, room: o }, n).name === "backflip", A5 = { work: ["building"], idle: ["standing"] };
function r_(e, t, n, a) {
  const s = Is[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(A5[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), Ir.has(e) ? { moments: o, began: n || a } : (n && a - n >= w5 && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function E5(e, t, n) {
  return !Ye({ moment: "pondering", memory: e, now: t }, n) || !Ye({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Ye({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Cl = { pondering: E5 };
function u_(e, t, n, a, s, o) {
  if (Cl[e.beat]) {
    const i = Cl[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = M5(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== po && { lifetime: l.lifetime } } } : null;
}
function c_(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const u = _5(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return u && { clip: u.name, card: "", flies: !!u.flies };
}
const d_ = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function f_(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function h_(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const m_ = (e, t) => !!(e != null && e.watches) && !t.once, p_ = 10, g_ = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || s5(a, a.queuedAt, n)), v_ = (e, t) => t ? null : e[0] ?? null;
function y_(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const b_ = (e, t) => !t.during || !e.some((n) => n.during === t.during), O5 = 2 * Math.PI, T5 = 500;
function k_(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / T5, u = t && e.point && !!t.behind != !!e.point.behind, c = u && e.amount > 0, f = t && !c ? o : 0, h = e.amount < f ? Math.min(e.amount + i, f) : Math.max(e.amount - i, f), g = O5 * l / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, _ = (c ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !u ? s && !t.behind && !y.behind ? B5(y, t, n, g, s) : L5(y, t, n, g) : t) ?? y, M = _ != null && _.behind && _.mood === "reading" ? I5(e.point, _, n, l, s) : _;
  return { point: M ?? null, toward: M ? { x: M.x - n.x, y: M.y - n.y } : null, amount: h, at: a };
}
function I5(e, t, n, a, s) {
  const o = (L) => L * 180 / Math.PI, l = (L) => o(Math.atan2(Math.sin(L * Math.PI / 180), Math.cos(L * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, u = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -u)) - i), f = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -u)) - i), h = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), g = h ? l(e.readingFacing - i) : 0, y = h ? e.readingYaw + g : f, b = y + l(c - y), _ = Math.min(Math.max(a / 1e3, 0), 0.1), M = qe.turnSpeed * _, x = h ? y + Math.min(Math.max(b - y, -M), M) : b, T = h ? e.readingFollow + g : x, H = T + (x - T) * (1 - Math.exp(-_ / qe.followSeconds)), W = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, I = o(go(t.x - n.x, -u, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), G = Math.min(Math.max(I, -W.up), W.down), N = qe.tipSpeed * _, A = h ? e.readingPitch + Math.min(Math.max(G - e.readingPitch, -N), N) : G;
  return { ...t, readingYaw: x, readingFollow: H, readingPitch: A, readingFacing: i };
}
function B5(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (T) => {
    const { yaw: H, pitch: W } = go(T.x - n.x, s, n.y - T.y, o);
    return { yaw: H, pitch: Math.min(Math.max(W, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [u, c] = [xl(i(e)), xl(i(t))], f = Math.acos(Math.min(Math.max(u[0] * c[0] + u[1] * c[1] + u[2] * c[2], -1), 1));
  if (f <= a) return { ...t };
  const h = a / f, [g, y] = [Math.sin((1 - h) * f) / Math.sin(f), Math.sin(h * f) / Math.sin(f)], [b, _, M] = u.map((T, H) => g * T + y * c[H]), x = s * b / _;
  return { ...t, x: n.x + x, y: n.y - v5(x, s, -Math.asin(Math.min(Math.max(M, -1), 1)), o) };
}
const R5 = 0.15;
function w_(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= R5;
}
function L5(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), u = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + u * Math.cos(i), y: n.y + u * Math.sin(i) };
}
const N5 = (e) => !(e != null && e.on);
function $_(e, t, n) {
  if (N5(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const vn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, ot = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Qa = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Al = (e) => e * e * (3 - 2 * e);
function q5(e) {
  if (e < 0 || e >= ot.seconds) return null;
  const t = Qa(e, ...ot.flicker), n = Math.floor(t * ot.flickers * 2) % 2 === 0, a = e < ot.flicker[1] ? n ? 0.35 + 0.5 * t : ot.dim : 1;
  return { strength: 1 - Al(Qa(e, ...ot.fade)), lit: a, white: e < ot.flash[0] ? 0 : 1 - Al(Qa(e, ...ot.flash)) };
}
const x_ = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function S_(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = q5(t - e.at);
  return a && { colour: vn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: ot.signs[e.tone], ...a } };
}
function M_(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function __(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= vn.looks || a === null && n - e.since >= vn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function C_(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const pt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, A_ = { behind: 39, figure: 40, ahead: 41 }, D5 = "[data-figure-pile]", P5 = { amber: [1, 0.69, 0.125], good: vn.colours.good, bad: vn.colours.bad }, Jn = { phases: 4, ms: 230, dim: 0.25 }, E_ = (e, t, n) => e !== "amber" || (t + n) % Jn.phases < Jn.phases / 2 ? 1 : Jn.dim, O_ = (e) => e === "amber" ? Jn.phases : 1;
function T_(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const I_ = Object.keys(P5), Je = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, tn = ([e, t], n) => e + n() * (t - e);
function B_(e) {
  const t = Je.least + Math.floor(e() * (Je.most - Je.least + 1));
  return Array.from({ length: Math.min(t, Je.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Je.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = tn(Je.start, e), l = tn(Je.reach, e);
    return {
      text: Ye({ moment: "digit" }, e).name,
      x: a * o,
      y: Je.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(tn(Je.moveMs, e)),
      fadeMs: Math.round(tn(Je.fadeMs, e))
    };
  });
}
const Xa = { high: 3, gap: 1 };
function R_(e) {
  const t = Math.floor(e / Xa.high);
  return { left: -(pt.inside + pt.width / 2 + t * (pt.width + Xa.gap)), up: e % Xa.high * (pt.height - pt.top) };
}
const j5 = (e, t, n) => Ye({ moment: "unit", memory: e, now: t }, n) !== null, F5 = { after: 5 }, W5 = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Tr(t).isBuild());
function L_(e, t, n) {
  const a = W5(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= F5.after ? s : null;
}
function N_(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: j5(n, a, s) } : null;
}
const El = { ahead: 140, up: 70 };
function q_(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * El.ahead, y: a - El.up } } : o ? { at: { x: n(o), y: a - o.up - pt.height } } : t ? { at: null } : null;
}
const Ja = { least: 4e3, most: 1e4 }, H5 = (e) => Ja.least + e() * (Ja.most - Ja.least), St = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function D_(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = H5(t);
    if (n.length >= St.most || t() >= St.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (St.at[0] + t() * (St.at[1] - St.at[0]));
    n.push({ from: o, to: o + St.ms }), a = o + St.ms;
  }
}
const P_ = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), j_ = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), qr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), F_ = new Set($a.filter((e) => qr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), z5 = (e) => e.some((t) => t.state === "built"), W_ = (e, t) => z5(t) ? e.filter((n) => !qr.has(n.beat)) : e, yt = { reach: 40, room: 6 }, U5 = (e, t) => t <= e - yt.reach + 2, H_ = (e, t, n) => U5(e, n) ? t - yt.reach : e - yt.reach - yt.room, z_ = (e, t, n, a) => a > 0 && t < e && t + yt.reach >= e - 2 ? Math.min(n, Math.max(e, t + yt.reach)) : e, Za = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, U_ = (e) => tn(e() < Za.longShare ? Za.long : Za.short, e), G5 = 2 * pt.width;
function G_(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= G5 ? o : e + (o - e + s / 2) % s;
}
const V5 = 60, V_ = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= V5, Ol = "[data-figure-home]", An = () => {
  var t;
  const e = document.querySelector(Ol);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Ol)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, K5 = "[data-figure-docked-bars]", Y5 = "[data-figure-chat-foot]", Q5 = [0.85, 0.6, 0.35, 0.15], X5 = ["question", "waiting", "suggestion"], K_ = (e, t) => X5.find((n) => e[n] > 0 && t[n] === "behind") || null;
function Y_() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const J5 = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Z5 = "[data-figure-newest]";
function Dr() {
  var a, s;
  const e = (a = An()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Z5), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
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
function yn(e, t, n = Dr()) {
  if (!e || !n) return !0;
  const a = dt(e, t), s = Sa(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Be.top * t.size, bottom: a.top + Be.bottom * t.size }, l = _t.gap;
  return !xa(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function Q_(e, t, n, a = Dr()) {
  if (!a || yn(t, e, a)) return null;
  const s = Sa(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = It(), u = t.posture === "stand" ? bo * e.size : Gr * e.size, c = Math.max(n.left + u, i.left + o), f = Math.min(n.right - u, i.right - l);
  return [a.left - _t.gap - l, a.right + _t.gap + o].map((g) => ({ ...t, x: g })).filter((g) => g.x >= c && g.x <= f && yn(g, e, a) && A4(g, e)).sort((g, y) => Math.abs(g.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const es = 0.26, Pr = 0.54, e4 = 1.25 / 5.4, En = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: es, travels: "stand" },
  lounge: { drop: es, travels: "stand" },
  composed: { drop: es, travels: "stand" },
  hang: { drop: Pr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, X_ = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * e4 * Math.cos(t * Math.PI / 180),
  y: 1 - n - Pr
}), sn = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), t4 = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), J_ = (e, t) => (e === "sit" ? t4.has(t) : sn.has(e)) ? e : "stand";
function Z_(e, t) {
  return e.facing === t.facing || !sn.has(e.posture) && !sn.has(t.posture) ? t : { posture: "stand", facing: sn.has(e.posture) ? e.facing : t.facing };
}
const eC = 0.25, tC = (e, t) => sn.has(e) && En[t].drop === 0, jr = 2, n4 = 90, a4 = 180, s4 = 140, o4 = 280, l4 = 420, i4 = 0.25, r4 = 290, u4 = 600, c4 = "cubic-bezier(0.2, 0.7, 0.4, 1)", d4 = "cubic-bezier(0.55, 0, 0.9, 0.6)", ts = 5;
function da(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: u = Math.random, memory: c = null, now: f = 0, room: h = 0, pogo: g = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < ts) return null;
  (l || i) && (o = Math.max(o, jr));
  const y = o > 1, b = Math.abs(t.x - e.x), _ = b < ts ? 0 : b / (n4 * o) * 1e3, M = Math.min(_, y ? s4 : a4), x = Math.abs(t.y - e.y), T = t.y < e.y, H = T && !g && C5(x, n, u, c, f, h), W = T ? l4 + Math.min(x, 400) * i4 : Math.sqrt(2 * x / mo) * 1e3, I = {
    x: t.x,
    y: t.y,
    ms: x > ts ? H ? u4 : W : 0,
    lead: H ? r4 : T ? o4 : 0,
    easing: T ? c4 : d4,
    hopping: !0,
    clip: H ? "backflip" : T ? "jump" : "fall"
  }, G = { x: t.x, y: t.y, ms: _ + M, lead: 0, easing: "linear", ramp: M, ...y ? { clip: "run" } : {} }, N = g ? f4(t, n) : I, A = T && !a ? [{ ...G, y: e.y }, N] : [{ ...I, x: e.x }, G];
  return { way: Math.sign(t.x - e.x) || 1, legs: A, lands: !s, pace: o, running: y };
}
const f4 = (e, t) => ({ x: e.x, y: e.y, ms: Te.pogo.frames / Te.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), h4 = (e, t) => e.postures.includes(t) ? t : e.postures[0], nC = (e, t, n) => e.posture === "walk" && n ? "walk" : h4(e.clip, t), dt = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - En[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, xa = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, vo = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function It() {
  var t;
  const e = (t = An()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Un = 0.5, Tl = 20;
function aC(e, t, n = It()) {
  const a = dt(e, t);
  return a.left >= n.left + Tl && a.right <= n.right - Tl;
}
function yo(e, t, n = It()) {
  const a = dt(e, t), s = a.right - a.left, o = Sa(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], u = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - Un && i <= n.right + Un && a.top >= n.top - Un && u <= n.bottom + Un;
}
const fa = [0.35, 0.5, 0.65], ha = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Be = { left: fa[0], right: fa.at(-1), top: ha[0], bottom: ha.at(-1) }, m4 = 0.24;
function Sa(e) {
  if (e.posture === "stand") return { left: Be.left, right: Be.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + m4 * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Be.left, t), right: Math.max(Be.right, t) };
}
function p4(e, { size: t }, n = It()) {
  const a = Sa(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const bo = (Be.right - Be.left) / 2 + 0.08;
function sC(e, t) {
  return e === "hang" ? Be : { ...Be, bottom: Math.min(Be.bottom, 1 - t - En[e].drop) };
}
const g4 = "[data-figure-agent]";
function Fr(e, t, n = "", a = "") {
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
const Wr = (e) => ha.flatMap(
  (t) => fa.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function ko(e, t, n = "") {
  if (!yn(e, t)) return fa.length * ha.length;
  const a = dt(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(J5)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: u }) => u.width && u.height && xa(s, u) && vo(i)).map(({ rect: i }) => i), l = (i, u) => o.some((c) => i >= c.left && i <= c.right && u >= c.top && u <= c.bottom);
  return Wr(s).filter(([i, u]) => l(i, u) || Fr(i, u, n)).length;
}
function v4(e, t) {
  const n = dt(e, t);
  return Wr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Fr(a, s, "", g4)).length;
}
const Il = 4;
function oC(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Il; o <= s; o += Il)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!v4(i, e) && yn(i, e)) return i;
    }
  return null;
}
function bn(e, t, n) {
  const a = It(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => yo(l, t, a) && yn(l, t)).map((l) => ({ spot: l, covered: ko(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const Hr = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), y4 = [0.5, 0.25, 0.75], b4 = (e) => Hr(e.getBoundingClientRect(), y4), zr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, k4 = bo, w4 = (e, t, { size: n }, a = k4) => Ur(e, zr[t], a * n, "stand");
function Ur(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const $4 = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Gr = 0.1, x4 = (e, t, { size: n }) => Ur(e, $4[t], Gr * n, "sit"), S4 = (e) => ((e + 180) % 360 + 360) % 360 - 180, ns = 60;
function lC(e, t) {
  const n = S4(t);
  return !e.aside || Math.abs(n) >= ns ? t : n < 0 ? 360 - ns : ns;
}
const on = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, M4 = (e) => [.../* @__PURE__ */ new Set([e, ...on.turns.map((t) => (t + 360) % 360)])];
function iC(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = M4(t), l = on.every[0] + a() * (on.every[1] - on.every[0]);
  return { face: t, from: s ? _4(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function _4(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / on.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function rC(e, t) {
  const { element: n, edge: a } = Ma(), s = ["left", "right"].map((i) => On(x4(a, i, e), e)).filter((i) => n && yo(i, e) && !ko(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, u) => o(i) - o(u))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function uC(e, t, { size: n }) {
  const a = (Be.right - Be.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Vr } : e;
}
const Vr = 7;
function Kr() {
  const e = [...document.querySelectorAll(D5)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function C4(e, t) {
  const n = dt(e, t), a = n.right - n.left;
  return { left: n.left + Be.left * a, right: n.left + Be.right * a, top: n.top + Be.top * a, bottom: n.bottom };
}
function A4(e, t) {
  const n = Kr();
  return !n || !xa(C4(e, t), n);
}
const E4 = 4;
function Ma() {
  const e = Tn(), t = Kr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > E4 || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Vr - n, 0) } };
}
const cC = ({ size: e, below: t }) => (1 - t) * e;
function On(e, t) {
  const n = It(), { size: a, below: s } = t, o = En[e.posture].drop * a;
  return { ...p4(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const Rs = (e, t) => Object.keys(zr).map((n) => On(w4(e, n, t), t)), wo = (e, t) => Hr(e, Q5).map((n) => On(n, t)), Yr = (e, t, n) => bn(e, t, n) ?? e[0];
function dC(e, t) {
  const { element: n, edge: a } = Ma();
  return { ...Yr(Rs(a, e), e, t), view: null, on: n };
}
function fC(e, t, n, a) {
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
  const e = An(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(K5);
  if (!t) return { ..._a(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Bl = { within: 2 };
function hC(e) {
  const { element: t, docked: n, edge: a } = Tn();
  if (!n || e.on !== t) return !0;
  const s = _a().edge;
  return a.left > s.left + Bl.within || a.left + a.width < s.left + s.width - Bl.within;
}
const O4 = "[data-figure-closing]";
function mC() {
  var n;
  const { element: e, docked: t } = Tn();
  return t && !!((n = e.firstElementChild) != null && n.matches(O4));
}
const Qr = "[data-figure-progress]";
function pC(e) {
  const t = e.querySelector(Qr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function gC(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const T4 = { across: 300, above: 380, below: 60 };
function vC(e) {
  const { across: t, above: n, below: a } = T4;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: I4(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const I4 = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Xr = "[data-figure-bar]", Ls = { back: 144, along: 0.4 };
function yC(e) {
  const { element: t, docked: n, edge: a } = Tn(), s = n ? t.querySelector(Xr) : null;
  if (!(s != null && s.querySelector(Qr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...On({ x: o - Ls.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function bC(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < Ls.along * a.size ? t.x + Ls.along * a.size : e.x, y: e.y, behind: !0 };
}
function kC(e) {
  const t = e.querySelector(Xr), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function _a() {
  const e = An();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function wC(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = _a(), u = n === null ? B4(i, e, o === null ? t : { x: o, y: i.top }, a, s) : On({ x: n, y: i.top, posture: "stand" }, e);
  return u && { ...u, view: null, on: l, stays: !0 };
}
function B4(e, t, n, a, s) {
  const o = wo(e, t), l = Math.min(...o.map((u) => u.x)), i = o.filter((u) => u.x + a + pt.width < s && u.x + a - yt.reach - yt.room >= l);
  return bn(i.length ? i : o, t, n);
}
const R4 = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function $C(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: u = [], memory: c = null, now: f = 0, room: h = 0, pogo: g = !1 } = {}) {
  (o || l) && (s = Math.max(s, jr));
  const y = (H) => {
    const W = dt(H, n, En[H.posture].travels);
    return { x: W.left, y: W.top };
  }, b = t.ladder ?? e.ladder;
  if (b && !(t.ladder && e.ladder)) return L4(y(e), y(t), y({ ...b.foot, posture: "stand" }), b.way, !!t.ladder, n, s);
  const [_, ...M] = [e, ...u, t].map(y), x = da(_, M[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: f, room: h, pogo: g }), T = M.slice(1).map((H, W) => {
    var I;
    return (I = da(M[W], H, n.size, { random: i, memory: c, now: f, room: h })) == null ? void 0 : I.legs.find((G) => G.hopping);
  });
  return x && { ...x, legs: [...x.legs, ...T.filter(Boolean)] };
}
function L4(e, t, n, a, s, o, l) {
  const i = (f, h) => ({ x: h.x, y: h.y, ms: Math.hypot(h.x - f.x, h.y - f.y) / R4.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), u = s ? da(e, n, o.size, { pace: l }) : da(n, t, o.size, { pace: l }), c = s ? [...(u == null ? void 0 : u.legs) ?? [], i(n, t)] : [i(e, n), ...(u == null ? void 0 : u.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function xC(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function SC(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && bn(b4(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = Ma();
  return { ...Yr(wo(s, t), t, n), view: null, on: a };
}
const N4 = "[data-figure-bubble]", q4 = 250;
let ln = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Jr = 0;
const Xt = () => ln, as = /* @__PURE__ */ new WeakMap();
let D4 = 0;
function $o(e) {
  return as.has(e) || as.set(e, `floor-${++D4}`), as.get(e);
}
const P4 = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, j4 = () => {
  var e, t;
  return ((t = (e = An()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function F4(e, t) {
  var a;
  const n = (a = e.querySelector(Y5)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function W4(e, t) {
  const n = e && F4(e, t), a = e ? [...e.querySelectorAll(N4)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || P4(l, n))).map(({ element: o, type: l, box: i }) => ({ id: $o(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const H4 = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= q4 ? (t.top - a.top) / s * 1e3 : 0;
};
function Zr(e = ln, t = performance.now()) {
  const n = It(), a = j4(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = Tn(), u = [];
  o && u.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = _a();
  return c.element && u.push({ id: $o(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), u.push(...W4(a, s)), u.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(u.map((f) => Object.freeze({ ...f, vy: H4(e, f, t) }))) });
}
const Ns = /* @__PURE__ */ new Set();
function z4(e) {
  return Ns.add(e), () => Ns.delete(e);
}
function U4() {
  eu();
  const e = () => {
    Jr = requestAnimationFrame(e), !document.hidden && (ln = Zr(ln), Ns.forEach((t) => t(ln)));
  };
  e();
}
function eu() {
  cancelAnimationFrame(Jr);
}
const xo = 5, G4 = 56, V4 = { share: 0.6 }, K4 = (e) => -Math.sqrt(2 * mo * V4.share * e), Ut = (e, t) => e.find((n) => n.id === t) ?? null;
function MC(e, t = Zr().floors) {
  const n = Ut(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : $o(e.on) : null, o = s && Ut(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function tu({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, u = Xt().floors) {
  const c = Ut(u, e);
  if (!c) return null;
  const f = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || Y4(c, f, o)) && Q4(f, i, u) ? { x: f.x, y: f.y } : null;
}
const So = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, Y4 = (e, t, n) => !So({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function _C(e, t = Xt().floors) {
  if (!So(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= xo && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function Q4(e, t, n = Xt().floors) {
  const a = Ut(n, "home");
  return e.posture === "hang" && a && dt(e, t).bottom >= a.top ? !1 : yo(e, t);
}
function CC(e, t, n, a = Xt().floors) {
  const s = tu(e, n, a);
  if (!e.home) return X4(e, t, s, a);
  if (!s) return null;
  const o = Ut(a, "home"), l = s.y - t.y, i = l > xo ? "dropping" : -l > G4 ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function X4(e, t, n, a) {
  const s = n ? Ut(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: K4(e.risen) };
  if (!n) return null;
  if (So(t) && n.y - t.y > xo) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function AC(e, t, n) {
  const a = bo * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function EC(e, t, n, a = Xt().floors) {
  const s = t && tu(t, n, a);
  return s ? { ...e, ...s } : e;
}
const J4 = ["data-type"], Z4 = { class: "figure-floor-name" }, ex = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ve({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      m("span", Z4, v(e.floor.type), 1)
    ], 12, J4));
  }
}, tx = /* @__PURE__ */ z(ex, [["__scopeId", "data-v-4e0f1e2e"]]), nx = {
  class: "figure-floors",
  "aria-hidden": "true"
}, ax = {
  __name: "FigureFloors",
  setup(e) {
    const t = et(Xt().floors);
    let n = () => {
    };
    return _e(() => {
      n = z4((a) => t.value = a.floors), U4();
    }), Re(() => {
      n(), eu();
    }), (a, s) => (r(), d("div", nx, [
      (r(!0), d(D, null, ne(t.value, (o) => (r(), F(tx, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, OC = /* @__PURE__ */ z(ax, [["__scopeId", "data-v-e519168b"]]), rn = (e) => typeof e == "number" ? e : Date.parse(e);
function TC(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: rn(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => rn(s.row.created_at) - rn(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const Rl = 20;
async function IC(e, t, n) {
  for (let a = 0; a < Rl; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || rn(o.created_at) <= rn(s.created_at) || !await n()) return a;
  }
  return Rl;
}
const sx = 3, ss = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function ox(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = ss[n.grouping]) == null ? void 0 : a.call(ss, e.row, n)) || "";
}
function lx(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function BC(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= sx ? [lx(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = ox(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
function ix(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const RC = (e) => (t) => t.filter((n) => n.id !== e), LC = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), NC = (e) => (t) => [...t, e], qC = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function DC(e, t = {}) {
  const n = st(), a = C(null), s = C("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function PC(e) {
  const t = st(), n = C("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Gn = /* @__PURE__ */ new Map();
function rx(e, t) {
  if (Gn.has(e)) return Gn.get(e);
  const n = t().finally(() => Gn.delete(e));
  return Gn.set(e, n), n;
}
function jC() {
  const e = st(), t = C(null), n = C("");
  async function a() {
    const s = await rx(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const ux = { class: "cards-page" }, cx = { class: "cards-bar" }, dx = { class: "cards-count" }, fx = { class: "cards" }, hx = {
  key: 1,
  class: "cards-note"
}, mx = {
  key: 2,
  class: "cards-note"
}, px = ["data-row", "onClick"], gx = { class: "card-head" }, vx = { class: "card-title" }, yx = { class: "card-foot" }, bx = {
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
    return (a, s) => (r(), d("div", ux, [
      m("div", cx, [
        m("span", dx, v(e.rows.length) + " " + v(e.rows.length === 1 ? e.term : `${e.term}s`), 1),
        E(ge, De({
          small: "",
          bordered: ""
        }, { [`data-${e.term}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: P(() => [
            E(le, {
              name: "plus",
              size: 12
            }),
            K(" New " + v(e.term), 1)
          ]),
          _: 1
        }, 16)
      ]),
      m("div", fx, [
        e.loaded ? e.failure ? (r(), d("p", hx, v(e.failure), 1)) : e.rows.length ? k("", !0) : (r(), d("p", mx, "No " + v(e.term) + "s yet", 1)) : (r(), F(Qe, {
          key: 0,
          shape: "cards"
        })),
        (r(!0), d(D, null, ne(e.rows, (o) => (r(), d("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          m("span", gx, [
            E(le, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            K(" " + v(e.head(o)), 1),
            E(nt, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          m("span", vx, v(e.title(o)), 1),
          m("span", yx, v(e.foot(o)), 1)
        ], 8, px))), 128))
      ]),
      re(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, FC = /* @__PURE__ */ z(bx, [["__scopeId", "data-v-b39fea5d"]]), Ll = "newest";
function WC(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = Me(Le, null)) == null ? void 0 : c.search, s = C(""), o = C(Ll), l = C("all"), i = S(() => {
    const f = s.value.trim().toLowerCase(), h = e.value.filter((g) => ix(g, f, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(g) === (l.value === "open")));
    return o.value === Ll ? h : [...h].sort((g, y) => t(g).localeCompare(t(y)));
  }), u = S(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: u, hasStates: !!n };
}
const kx = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, wx = {
  class: "auto-scroll-newest-line",
  "data-scroll-newest-line": ""
}, $x = 40, xx = "top", Sx = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" }, feed: { type: Object, default: null } },
  setup(e, { expose: t }) {
    var g;
    const n = e, a = (g = Me(Le, null)) == null ? void 0 : g.autoScroll, s = S(() => a === xx), o = C(null), l = C(!1), i = (y) => s.value ? y.scrollTop : y.scrollHeight - y.scrollTop - y.clientHeight, u = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: u(), behavior: "smooth" });
    function f() {
      var y;
      l.value = i(o.value) >= $x, s.value || (y = n.feed) == null || y.reachTop(o.value);
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
    }), at(() => h == null ? void 0 : h.disconnect()), t({ pane: o }), (y, b) => (r(), d("div", kx, [
      m("div", {
        ref_key: "pane",
        ref: o,
        class: Y(["auto-scroll-pane", e.paneClass]),
        onScroll: f
      }, [
        re(y.$slots, "default", {}, void 0, !0)
      ], 34),
      m("div", wx, [
        E(Vt, {
          name: "auto-scroll-rise",
          persisted: ""
        }, {
          default: P(() => [
            tt(m("button", {
              type: "button",
              class: "auto-scroll-newest",
              "data-scroll-newest": "",
              title: "Back to the newest",
              onClick: c
            }, [
              E(le, {
                name: s.value ? "up" : "down"
              }, null, 8, ["name"]),
              b[0] || (b[0] = K(" Newest ", -1))
            ], 512), [
              [Gl, l.value]
            ])
          ]),
          _: 1
        })
      ])
    ]));
  }
}, HC = /* @__PURE__ */ z(Sx, [["__scopeId", "data-v-d704d7e3"]]), Mx = ["aria-selected", "data-tab", "onClick"], _x = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, Cx = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Me(Le, null), o = S(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = C(null), i = C({ left: 0, width: 0, slides: !1 }), u = (g) => n.answer[g.count_field] !== void 0;
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
    }), Re(() => h == null ? void 0 : h.disconnect()), pe(() => {
      var g;
      return (g = n.active) == null ? void 0 : g.key;
    }, f), pe(() => n.answer, f, { deep: !0 }), (g, y) => (r(), d("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (r(!0), d(D, null, ne(o.value, (b) => {
        var _, M;
        return r(), d("button", {
          key: b.key,
          type: "button",
          role: "tab",
          class: Y(["inner-tab", { on: ((_ = e.active) == null ? void 0 : _.key) === b.key }]),
          "aria-selected": ((M = e.active) == null ? void 0 : M.key) === b.key,
          "data-tab": b.key,
          onClick: (x) => a("choose", b)
        }, [
          K(v(b.label) + " ", 1),
          u(b) ? (r(), d("span", _x, v(e.answer[b.count_field]), 1)) : k("", !0)
        ], 10, Mx);
      }), 128)),
      m("i", {
        class: Y(["inner-tabs-line", { slides: i.value.slides }]),
        style: ve({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, zC = /* @__PURE__ */ z(Cx, [["__scopeId", "data-v-63fcd326"]]), Ax = { class: "task-bar" }, Ex = {
  __name: "TaskBar",
  props: { total: { type: Number, required: !0 }, done: { type: Number, required: !0 }, testing: { type: Number, required: !0 } },
  setup(e) {
    const t = e, n = (a) => t.total ? Math.round(a / t.total * 100) : 0;
    return (a, s) => (r(), d("span", Ax, [
      m("span", {
        class: "task-bar-fill",
        "data-task-bar-done": "",
        style: ve({ width: `${n(e.done)}%` })
      }, null, 4),
      m("span", {
        class: "task-bar-testing",
        "data-task-bar-testing": "",
        style: ve({ width: `${n(e.testing)}%` })
      }, null, 4)
    ]));
  }
}, UC = /* @__PURE__ */ z(Ex, [["__scopeId", "data-v-a4fc52ae"]]), Ox = {
  class: "tab-body",
  "data-tab-body": ""
}, Tx = { "data-tab-content": "" }, Ix = {
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
    }), (s, o) => (r(), d("div", Ox, [
      n.value ? (r(), F(Qe, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : k("", !0),
      tt(m("div", Tx, [
        re(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Gl, !n.value]
      ])
    ]));
  }
}, GC = /* @__PURE__ */ z(Ix, [["__scopeId", "data-v-63876533"]]), Bx = {
  class: "search-bar",
  "data-search-bar": ""
}, Rx = { class: "search-bar-control" }, Lx = ["value", "placeholder", "aria-label"], Nx = ["aria-expanded"], qx = {
  key: 0,
  "data-menu-count": ""
}, Dx = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var x;
    const a = e, s = n, o = hu(), l = ((x = Me(Le, null)) == null ? void 0 : x.search) ?? {}, i = S(() => l.placeholder || a.placeholder), u = l.context ?? [], c = C(null), f = C(null), h = C([]), g = S(() => h.value.length ? h.value[h.value.length - 1].next : u), y = S(() => !!o.menu || u.length > 0), b = (T) => {
      h.value = [], f.value = f.value ? null : T.currentTarget;
    };
    function _(T) {
      if (T.next.length) {
        h.value = [...h.value, T];
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
    } }), (T, H) => {
      var W;
      return r(), d("div", Bx, [
        m("div", Rx, [
          E(le, {
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
            onKeydown: At(M, ["esc"])
          }, null, 40, Lx),
          e.modelValue ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: M
          }, [
            E(le, {
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
            e.menuCount ? (r(), d("span", qx, v(e.menuCount), 1)) : k("", !0),
            E(le, {
              name: "caret",
              size: 12
            })
          ], 8, Nx)) : k("", !0)
        ]),
        (W = R(l).button) != null && W.title ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: H[1] || (H[1] = (I) => s("pick", R(l).button.click))
        }, v(R(l).button.title), 1)) : k("", !0),
        re(T.$slots, "default", {}, void 0, !0),
        f.value ? (r(), F(va, {
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
            h.value.length ? (r(), F(Ue, {
              key: 0,
              "data-search-back": "",
              onClick: H[2] || (H[2] = (I) => h.value = h.value.slice(0, -1))
            }, {
              default: P(() => [
                K("‹ " + v(h.value[h.value.length - 1].title), 1)
              ]),
              _: 1
            })) : k("", !0),
            (r(!0), d(D, null, ne(g.value, (I) => (r(), F(Ue, {
              key: I.title,
              description: I.subtext,
              "data-search-entry": I.title,
              onClick: (G) => _(I)
            }, {
              default: P(() => [
                K(v(I.title) + v(I.next.length ? " ›" : ""), 1)
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
}, Px = /* @__PURE__ */ z(Dx, [["__scopeId", "data-v-45374bed"]]), jx = {
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
    return (o, l) => (r(), F(Px, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (i) => n("pick", i))
    }, {
      menu: P(() => [
        E(Ct, null, {
          default: P(() => [...l[2] || (l[2] = [
            K("Order", -1)
          ])]),
          _: 1
        }),
        (r(), d(D, null, ne(a, (i) => E(Ue, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (u) => e.tools.order.value = i.key
        }, {
          default: P(() => [
            K(v(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (r(), d(D, { key: 0 }, [
          E(Ct, null, {
            default: P(() => [...l[3] || (l[3] = [
              K("Show", -1)
            ])]),
            _: 1
          }),
          (r(), d(D, null, ne(s, (i) => E(Ue, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (u) => e.tools.state.value = i.key
          }, {
            default: P(() => [
              K(v(i.label), 1)
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
}, VC = /* @__PURE__ */ z(jx, [["__scopeId", "data-v-dab0064d"]]);
function KC() {
  const e = C(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const YC = (e) => import(
  /* @vite-ignore */
  e
), Fx = 86400, qs = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Wx(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((qs(t) - qs(e)) / Fx);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function QC(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = qs(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: Wx(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const os = 280, ls = 240, is = 120, Hx = 6, zx = 14, kn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Ux(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function nu(e, t) {
  const n = Math.max(0, Ux(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function Gx(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${zx}px)` }), e.offsetHeight, e.style.transition = `height ${os}ms ${kn}`, e.style.height = `${l}px`;
  const i = s();
  let u = !1, c = !1;
  const f = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, h = () => {
    if (c) return;
    n() && (t.scrollTop = nu(t, e));
    const g = s() - i;
    if (!u && g >= os && (u = !0, e.style.transition = `opacity ${ls}ms ease-out, transform ${ls}ms ${kn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), g < os + ls) return a(h);
    f();
  };
  return a(h), f;
}
function XC(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Hx}px)` }), e.offsetHeight, e.style.transition = `opacity ${is}ms ease-out, transform ${is}ms ${kn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = nu(t, e)), s() - l < is) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const Vx = 140, Vn = 220, Nl = 5;
function JC({ gap: e = Vx, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function i(f, h) {
    a.add(f), f.cancel = f.arrival(f.el, f.options, () => {
      a.delete(f), f.done(), h();
    });
  }
  function u() {
    const f = n.splice(0, Nl);
    if (s = f.length > 0, !s) return;
    let h = f.length;
    for (const g of f)
      g.el.style.display = g.display, i(g, () => {
        h -= 1, h || (o = t(u, e));
      });
  }
  const c = (f, h, g, y = Gx) => {
    if (l || !h.pane || !h.follows()) return g();
    const b = { el: f, options: h, done: g, arrival: y, display: f.style.display || "" };
    if (!s)
      return s = !0, i(b, () => o = t(u, e));
    f.style.display = "none", n.push(b), n.length >= Nl && c.flush();
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
function ZC(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Vn}ms ${kn}, opacity ${Vn}ms ease-in, margin ${Vn}ms ${kn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Vn);
}
const au = "chat.pins.minimised", Zn = C(na(au, !1));
function ql(e) {
  Zn.value = e, to(au, e);
}
function Kx(e) {
  const t = S(() => e()), n = S(() => Zn.value ? [] : e()), a = () => ql(!Zn.value), s = Date.now() / 1e3;
  return pe(
    () => t.value.filter((o) => Et(o) > s).length,
    (o, l) => o > l && ql(!1)
  ), { pins: t, visible: n, minimised: Zn, toggle: a };
}
const Yx = ["title"], Qx = {
  key: 0,
  class: "pins-count"
}, Xx = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = Kx(() => t.pinRows);
    return (o, l) => R(n).length ? (r(), d("button", {
      key: 0,
      type: "button",
      class: Y(["pins-toggle", { minimised: R(a), inline: e.inline }]),
      title: R(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = xe((...i) => R(s) && R(s)(...i), ["stop"]))
    }, [
      E(le, {
        name: R(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      R(a) ? (r(), d("span", Qx, v(R(n).length), 1)) : k("", !0)
    ], 10, Yx)) : k("", !0);
  }
}, eA = /* @__PURE__ */ z(Xx, [["__scopeId", "data-v-d073c504"]]), Jx = ["title"], Zx = ["title"], e8 = { class: "diff-card-dir" }, t8 = { class: "diff-card-name" }, n8 = ["title"], a8 = ["title"], s8 = {
  key: 0,
  class: "diff-card-note"
}, o8 = ["href"], l8 = ["src", "alt"], i8 = { class: "diff-card-rows" }, r8 = { class: "diff-row-num" }, u8 = { class: "diff-row-sign" }, c8 = { class: "diff-row-code" }, d8 = {
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
    function o(q) {
      (q.metaKey || q.ctrlKey) && (q.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, u = S(() => n.path.lastIndexOf("/") + 1), c = S(() => n.path.slice(0, u.value)), f = S(() => n.path.slice(u.value)), h = S(() => n.change === "deleted"), g = S(() => l[n.change]), y = S(() => new Set(n.rows.filter((q) => q.line_type === "add").map((q) => q.line))), b = C("after"), _ = S(() => b.value === "before" ? n.whole.old : n.whole.text), M = S(() => n.whole && n.whole.text !== void 0 ? _.value.split(`
`).map((q, w) => ({ line_type: b.value === "after" && y.value.has(w + 1) ? "add" : "ctx", line: w + 1, text: q })) : n.rows.filter(
      (q) => !(n.editsOnly && ["ctx", "fold"].includes(q.line_type)) && !(n.hideRemovals && q.line_type === "del")
    )), x = C(!1), T = S(() => n.lines && !x.value && !n.whole), H = S(() => T.value ? M.value.slice(0, n.lines) : M.value), W = S(() => M.value.length - H.value.length), I = (q) => q.line === null || q.line_type === "del" ? "" : q.line, G = (q) => q.line_type === "fold" ? q.hidden ? `⋯ ${q.hidden} lines` : "⋯" : q.text, N = C(null), A = C(null);
    let L = null;
    return _e(() => {
      if (!A.value) return;
      let q = !0;
      L = new ResizeObserver(() => {
        !N.value || !A.value || (N.value.style.transition = q ? "none" : "", N.value.style.height = `${A.value.offsetHeight}px`, q = !1);
      }), L.observe(A.value);
    }), Re(() => L && L.disconnect()), (q, w) => (r(), d("section", {
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
          m("span", e8, v(c.value), 1),
          m("span", t8, v(f.value), 1),
          g.value ? (r(), d("span", {
            key: 0,
            class: Y(["diff-card-badge", e.change])
          }, v(g.value), 3)) : k("", !0)
        ], 8, Zx),
        m("span", {
          class: Y(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + v(e.added), 3),
        m("span", {
          class: Y(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + v(e.removed), 3),
        E(nt, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: b.value === "after" ? "Show the file before" : "Show the file after",
          onClick: w[0] || (w[0] = xe((p) => b.value = b.value === "after" ? "before" : "after", ["stop"]))
        }, v(b.value === "after" ? "After" : "Before"), 9, n8)) : k("", !0),
        h.value ? k("", !0) : (r(), d("button", {
          key: 1,
          type: "button",
          class: Y(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: w[1] || (w[1] = xe((p) => a("whole"), ["stop"]))
        }, [
          E(le, {
            name: "file",
            size: 12
          })
        ], 10, a8))
      ], 8, Jx),
      e.whole && e.whole.error ? (r(), d("p", s8, v(e.whole.error), 1)) : k("", !0),
      !h.value && !e.folded ? (r(), d(D, { key: 1 }, [
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
          }, null, 8, l8)
        ], 8, o8)) : (r(), d("div", {
          key: 1,
          ref_key: "grow",
          ref: N,
          class: "diff-card-grow"
        }, [
          m("div", {
            ref_key: "body",
            ref: A,
            class: "diff-card-diff"
          }, [
            m("div", i8, [
              (r(!0), d(D, null, ne(H.value, (p, $) => (r(), d("div", {
                key: $,
                class: Y(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                m("span", r8, v(I(p)), 1),
                m("span", u8, v(i[p.line_type]), 1),
                m("span", c8, v(G(p)), 1)
              ], 2))), 128)),
              W.value > 0 ? (r(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: w[3] || (w[3] = xe((p) => x.value = !0, ["stop"]))
              }, v(W.value) + " more " + v(W.value === 1 ? "line" : "lines"), 1)) : k("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : k("", !0)
    ], 2));
  }
}, tA = /* @__PURE__ */ z(d8, [["__scopeId", "data-v-23581cbb"]]), f8 = { "data-queue-controls": "" }, h8 = { class: "counts" }, m8 = { "data-queue-spots": "" }, p8 = {
  class: "spots",
  "aria-label": "Places in use"
}, g8 = { "data-queue-waiting": "" }, v8 = { key: 0 }, y8 = { class: "control" }, b8 = { class: "stepper" }, k8 = ["disabled"], w8 = {
  "aria-labelledby": "queue-limit-label",
  "data-queue-limit": ""
}, $8 = ["disabled"], x8 = ["for"], S8 = ["id", "value", "disabled", "onChange"], M8 = { class: "control" }, _8 = ["aria-checked", "disabled"], C8 = {
  key: 0,
  class: "note halted",
  role: "status",
  "data-queue-update-waits": ""
}, A8 = {
  key: 1,
  class: "note halted",
  role: "status",
  "data-queue-held": ""
}, E8 = {
  key: 2,
  class: "note failure",
  role: "alert"
}, O8 = {
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
    return (i, u) => (r(), d("div", f8, [
      E(zt, { icon: "gauge" }, {
        default: P(() => [...u[3] || (u[3] = [
          K("Now", -1)
        ])]),
        _: 1
      }),
      m("div", h8, [
        m("div", null, [
          m("strong", m8, [
            K(v(e.queue.used_slots) + " ", 1),
            m("span", null, "of " + v(e.queue.parallel_limit), 1)
          ]),
          m("p", null, "Commands running. " + v(e.queue.used_slots >= e.queue.parallel_limit ? "Every place is taken." : `${e.queue.parallel_limit - e.queue.used_slots} ${e.queue.parallel_limit - e.queue.used_slots === 1 ? "place" : "places"} free.`), 1),
          m("div", p8, [
            (r(!0), d(D, null, ne(e.queue.parallel_limit, (c) => (r(), d("span", {
              key: c,
              class: Y({ used: c <= e.queue.used_slots })
            }, null, 2))), 128))
          ])
        ]),
        m("div", null, [
          m("strong", g8, v(e.queue.waiting_count), 1),
          u[4] || (u[4] = m("p", null, "Commands waiting", -1)),
          e.queue.waiting_count ? (r(), d("p", v8, "The oldest goes first.")) : k("", !0)
        ])
      ]),
      m("div", y8, [
        u[5] || (u[5] = m("div", null, [
          m("label", { id: "queue-limit-label" }, "Commands at once"),
          m("p", null, "How many of the workers' commands may run at the same time. The rest wait. Lowering it stops none that are running.")
        ], -1)),
        m("div", b8, [
          m("button", {
            type: "button",
            "aria-label": "One fewer command at once",
            disabled: s.value || e.queue.parallel_limit <= 1,
            onClick: u[0] || (u[0] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit - 1))
          }, "−", 8, k8),
          m("output", w8, v(e.queue.parallel_limit), 1),
          m("button", {
            type: "button",
            "aria-label": "One more command at once",
            disabled: s.value,
            onClick: u[1] || (u[1] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit + 1))
          }, "+", 8, $8)
        ])
      ]),
      (r(!0), d(D, null, ne(e.queue.suite_limits, (c) => (r(), d("div", {
        key: c.key,
        class: "control"
      }, [
        m("div", null, [
          m("label", {
            for: c.key
          }, v(c.title), 9, x8),
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
        }, null, 40, S8)
      ]))), 128)),
      m("div", M8, [
        u[7] || (u[7] = m("div", null, [
          m("label", { id: "main-spots-label" }, "Count the main agent"),
          m("p", null, "Its commands always start right away, but each one takes a place, so fewer workers run at once.")
        ], -1)),
        m("button", {
          type: "button",
          role: "switch",
          "aria-labelledby": "main-spots-label",
          "aria-checked": e.queue.count_main_runs,
          disabled: s.value,
          "data-queue-main-spots": "",
          onClick: u[2] || (u[2] = (c) => l(e.queue.main_spots_setting, e.queue.count_main_runs ? "off" : "on"))
        }, [...u[6] || (u[6] = [
          m("span", null, null, -1)
        ])], 8, _8)
      ]),
      e.queue.halt_cause === "update" ? (r(), d("p", C8, [
        E(le, {
          name: "pause",
          size: 13
        }),
        u[8] || (u[8] = K("An update waits for the running commands to end. Every command that waits stays in the queue, in order, and gets its place once the update is done.", -1))
      ])) : e.queue.halted ? (r(), d("p", A8, [
        E(le, {
          name: "pause",
          size: 13
        }),
        K("The queue is paused. No waiting command gets a place until it is resumed. " + v(e.queue.halt_reason), 1)
      ])) : k("", !0),
      o.value ? (r(), d("p", E8, v(o.value), 1)) : k("", !0)
    ]));
  }
}, T8 = /* @__PURE__ */ z(O8, [["__scopeId", "data-v-975b4b89"]]), I8 = ["data-queue-row", "data-queue-process"], B8 = ["aria-expanded"], R8 = { class: "run-line" }, L8 = { class: "leading" }, N8 = {
  key: 0,
  "data-queue-position": ""
}, q8 = ["title"], D8 = { class: "command" }, P8 = {
  class: "time",
  "data-queue-time": ""
}, j8 = { class: "details" }, F8 = { "data-queue-type": "" }, W8 = { class: "failed" }, H8 = { class: "drop-inner" }, z8 = { class: "output" }, U8 = { class: "output-heading" }, G8 = ["href"], V8 = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(), o = mr((g) => n.read([...g, "--limit", "50"]), () => n.run.id), l = o.lines, i = co(), u = S(() => n.run.plugin ? `Plugin ${n.run.plugin}` : { test: "Test run", build: "Build", check: "Check", install: "Install" }[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = S(() => {
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
    return pe(() => n.expanded, h, { immediate: !0 }), _n(["output.*"], f, (g) => si(g, /* @__PURE__ */ new Set([n.run.id]))), (g, y) => (r(), d("div", {
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
          y[3] || (y[3] = At(xe((b) => a("toggle"), ["prevent"]), ["enter"])),
          y[4] || (y[4] = At(xe((b) => a("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        m("div", R8, [
          m("span", L8, [
            e.run.section === "waiting" ? (r(), d("span", N8, v(e.position), 1)) : (r(), d("span", {
              key: 1,
              class: Y(["dot", { ring: e.run.section === "running" && !e.run.uses_slot, passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "running" && !e.run.uses_slot ? "Running, not counted in the limit" : e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, q8))
          ]),
          m("code", D8, v(e.run.line), 1),
          m("span", P8, v(c.value), 1),
          E(le, {
            class: Y(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        m("div", j8, [
          m("span", F8, v(u.value), 1),
          e.run.owner_agent_id ? (r(), d(D, { key: 0 }, [
            y[6] || (y[6] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: y[0] || (y[0] = xe((b) => R(bt)("agents", e.run.owner_agent_id), ["stop"]))
            }, "Agent " + v(e.run.owner_agent_id), 1)
          ], 64)) : e.run.is_main ? (r(), d(D, { key: 1 }, [
            y[7] || (y[7] = m("span", { class: "separator" }, "·", -1)),
            y[8] || (y[8] = m("span", null, "Main agent", -1))
          ], 64)) : k("", !0),
          e.run.task_id ? (r(), d(D, { key: 2 }, [
            y[9] || (y[9] = m("span", { class: "separator" }, "·", -1)),
            m("button", {
              type: "button",
              class: "link",
              "data-queue-task": "",
              onClick: y[1] || (y[1] = xe((b) => R(bt)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + v(e.run.task_id), 1)
          ], 64)) : k("", !0),
          e.run.state === "failed" ? (r(), d(D, { key: 3 }, [
            y[10] || (y[10] = m("span", { class: "separator" }, "·", -1)),
            m("span", W8, "Failed, exit " + v(e.run.exit_code), 1)
          ], 64)) : k("", !0)
        ])
      ], 40, B8),
      m("div", {
        class: Y(["drop", { open: e.expanded }])
      }, [
        m("div", H8, [
          m("div", z8, [
            m("div", U8, [
              m("span", null, "Output " + v(e.run.id), 1),
              m("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, G8)
            ]),
            m("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: y[5] || (y[5] = (b) => e.expanded && R(o).loadEarlier(b.target))
            }, [
              y[11] || (y[11] = m("span", { class: "prompt" }, "$ ", -1)),
              K(v(e.run.line), 1),
              R(l).length ? (r(), d(D, { key: 0 }, [
                K(v(`
` + R(l).join(`
`)), 1)
              ], 64)) : k("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, I8));
  }
}, K8 = /* @__PURE__ */ z(V8, [["__scopeId", "data-v-18099d0b"]]), Y8 = {
  class: "process-queue",
  "data-test-queue": ""
}, Q8 = {
  key: 0,
  class: "lead"
}, X8 = { class: "scroll" }, J8 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Z8 = ["data-queue-empty"], rs = 20, e3 = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 }, agent: { type: Number, default: 0 } },
  setup(e) {
    const t = e, n = S(() => t.agent ? ["--agent", `row:${t.agent}`] : []), a = C(null), s = C(""), o = C([]), l = C(rs), i = S(() => {
      var y, b;
      return (((y = a.value) == null ? void 0 : y.recent_total) ?? 0) > (((b = a.value) == null ? void 0 : b.recent.length) ?? 0);
    });
    let u = 0;
    const c = S(() => a.value ? [
      { type: "running", heading: "Running", icon: "start", rows: a.value.running, empty: "Nothing is running." },
      { type: "waiting", heading: "Waiting", icon: "clock", rows: a.value.waiting, empty: "Nothing waits. A command that starts now gets a place at once." },
      { type: "recent", heading: "Finished", icon: "check", rows: a.value.recent, empty: "Nothing has run yet." }
    ].flatMap((b) => [
      { key: `band:${b.type}`, section: b },
      ...b.rows.length ? b.rows.map((_, M) => ({ key: `run:${_.id}`, run: _, position: M + 1 })) : [{ key: `none:${b.type}`, section: b, empty: !0 }]
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
    return _n(["process.*", "setting.*"], h), _e(h), (y, b) => (r(), d("article", Y8, [
      e.agent ? k("", !0) : (r(), d("p", Q8, "Commands from workers wait here for a free place. Reading and editing never wait.")),
      m("div", X8, [
        s.value ? (r(), d("p", J8, v(s.value), 1)) : k("", !0),
        a.value ? (r(), d(D, { key: 1 }, [
          e.agent ? k("", !0) : (r(), F(T8, {
            key: 0,
            queue: a.value,
            read: e.read,
            onSaved: h
          }, null, 8, ["queue", "read"])),
          E(js, {
            name: "queue",
            tag: "div",
            class: "queue-list"
          }, {
            default: P(() => [
              (r(!0), d(D, null, ne(c.value, (_) => (r(), d(D, {
                key: _.key
              }, [
                _.run ? (r(), F(K8, {
                  key: 0,
                  run: _.run,
                  environment: a.value.environment_name,
                  position: _.position,
                  read: e.read,
                  expanded: o.value.includes(_.run.id),
                  onToggle: (M) => f(_.run.id)
                }, null, 8, ["run", "environment", "position", "read", "expanded", "onToggle"])) : _.empty ? (r(), d("p", {
                  key: 1,
                  class: "empty",
                  "data-queue-empty": _.section.type
                }, v(_.section.empty), 9, Z8)) : (r(), F(zt, {
                  key: 2,
                  class: "sticky-band",
                  icon: _.section.icon,
                  count: _.section.rows.length,
                  "data-queue-heading": _.section.type
                }, {
                  default: P(() => [
                    K(v(_.section.heading), 1)
                  ]),
                  _: 2
                }, 1032, ["icon", "count", "data-queue-heading"]))
              ], 64))), 128))
            ]),
            _: 1
          }),
          i.value ? (r(), d("button", {
            key: 1,
            type: "button",
            class: "older",
            "data-queue-older": "",
            onClick: g
          }, "Show older commands")) : k("", !0)
        ], 64)) : s.value ? k("", !0) : (r(), F(Qe, { key: 2 }))
      ])
    ]));
  }
}, nA = /* @__PURE__ */ z(e3, [["__scopeId", "data-v-3f01ced0"]]), t3 = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, n3 = ["aria-expanded"], a3 = {
  class: "links-count",
  "data-inspector-links-count": ""
}, s3 = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, o3 = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, l3 = {
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
    }, { immediate: !0 }), _n(["link.*", "phase.*", "phase_task.*"], i), (u, c) => (r(), d(D, null, [
      a.value ? (r(), d("section", t3, [
        m("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (f) => n.value = !n.value)
        }, [
          c[2] || (c[2] = m("span", { class: "links-label" }, "Links", -1)),
          m("span", a3, v(a.value), 1),
          E(Qt, { open: n.value }, null, 8, ["open"])
        ], 8, n3),
        m("div", {
          class: Y(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (r(), d("div", s3, [
            E(id, {
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
      o.value ? (r(), d("p", o3, v(o.value), 1)) : k("", !0)
    ], 64));
  }
}, i3 = /* @__PURE__ */ z(l3, [["__scopeId", "data-v-a4550728"]]), r3 = ["placeholder"], u3 = { class: "actions" }, c3 = { class: "error" }, d3 = {
  key: 1,
  class: "card closed"
}, f3 = { class: "mark" }, h3 = { class: "prompt" }, m3 = {
  key: 0,
  class: "draft"
}, p3 = {
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
      var b, _;
      i.value = !0, u.value = !1, await Fe(), (_ = ((b = f.value) == null ? void 0 : b.querySelector("input")) || f.value) == null || _.focus();
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
        } catch (_) {
          o.value = b, l.value = _.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: h }), (b, _) => (r(), d("div", {
      class: Y(["comment-bar", { open: i.value }])
    }, [
      i.value ? (r(), d("form", {
        key: 0,
        class: "card compose",
        onSubmit: xe(y, ["prevent"]),
        onKeydown: At(g, ["esc"])
      }, [
        re(b.$slots, "who", {}, void 0, !0),
        tt(m("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": _[0] || (_[0] = (M) => o.value = M),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: _[1] || (_[1] = At((M) => R(Ji)(M, y), ["enter"]))
        }, null, 40, r3), [
          [ta, o.value]
        ]),
        m("div", u3, [
          m("span", c3, v(l.value), 1),
          E(ge, {
            small: "",
            onClick: g
          }, {
            default: P(() => [..._[3] || (_[3] = [
              K("Cancel", -1)
            ])]),
            _: 1
          }),
          E(ge, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: y
          }, {
            default: P(() => [..._[4] || (_[4] = [
              K("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (r(), d("div", d3, [
        m("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: h
        }, [
          m("span", f3, [
            E(le, {
              name: u.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          m("span", h3, v(u.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (r(), d("span", m3, "Draft kept")) : k("", !0)
        ]),
        e.count ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: _[2] || (_[2] = (M) => s("show"))
        }, [
          m("span", null, v(R(ud)(e.count, "comment")), 1),
          E(le, {
            name: "down",
            size: 12
          })
        ])) : k("", !0)
      ]))
    ], 2));
  }
}, g3 = /* @__PURE__ */ z(p3, [["__scopeId", "data-v-b68baddd"]]), v3 = { wide: 1130 }, y3 = /\{([A-Za-z_]\w*)\}/g;
function ea(e, t, n = {}) {
  return e.replace(y3, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const b3 = (e, t, n, a) => ea(e.label, n, { row_id: a, id: a }) || Y2(t, n, a), k3 = { class: "comment-side-head" }, w3 = {
  key: 0,
  class: "comment-none"
}, $3 = { key: 0 }, x3 = {
  key: 1,
  class: "comment-none"
}, S3 = {
  class: "comment",
  "data-comment": ""
}, M3 = {
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
      m("header", k3, [
        n[2] || (n[2] = m("h3", null, "Comments", -1)),
        E(ya, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (r(), d("p", w3, "No comments yet")) : k("", !0),
      (r(!0), d(D, null, ne(e.comments, (a) => (r(), d("section", {
        key: a.id
      }, [
        a.quote ? (r(), d("blockquote", $3, v(a.quote), 1)) : k("", !0),
        a.revision ? (r(), d("span", x3, "Revision " + v(a.revision), 1)) : k("", !0),
        m("p", S3, v(e.words(a)), 1)
      ]))), 128)),
      E($n, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, Dl = /* @__PURE__ */ z(M3, [["__scopeId", "data-v-276284a3"]]), _3 = { class: "resource-heading" }, C3 = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, A3 = {
  key: 1,
  class: "resource-abstract"
}, E3 = {
  __name: "ResourceHeading",
  props: { title: String, abstract: String },
  setup(e) {
    return (t, n) => (r(), d("div", _3, [
      e.title ? (r(), d("h2", C3, v(e.title), 1)) : k("", !0),
      e.abstract ? (r(), d("p", A3, v(e.abstract), 1)) : k("", !0)
    ]));
  }
}, O3 = /* @__PURE__ */ z(E3, [["__scopeId", "data-v-d65ef53f"]]), T3 = {
  class: "inspector-head",
  "data-inspector-head": ""
}, I3 = { class: "inspector-icons" }, B3 = { class: "inspector-icons-start" }, R3 = {
  key: 0,
  class: "inspector-band-title",
  "data-resource-title": ""
}, L3 = {
  key: 1,
  class: "inspector-label",
  "data-resource-type": ""
}, N3 = { class: "inspector-icons-end" }, q3 = ["href"], D3 = {
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
    const n = e, a = t, s = S(() => `${n.opened.table}:${n.opened.id}`), o = S(() => n.shareable && !n.readOnly), l = S(() => !n.label && !!n.title), i = S(() => n.backed ? "Close all rows" : "Close");
    return (u, c) => (r(), d("header", T3, [
      m("div", I3, [
        m("span", B3, [
          e.backed ? (r(), F(ge, {
            key: 0,
            variant: "icon",
            title: "Back",
            "aria-label": "Back",
            "data-resource-back": "",
            onClick: c[0] || (c[0] = (f) => a("back"))
          }, {
            default: P(() => [
              E(le, {
                name: "back",
                size: 13
              })
            ]),
            _: 1
          })) : k("", !0),
          e.stepped ? (r(), d(D, { key: 1 }, [
            E(ge, {
              variant: "icon",
              title: "Previous",
              "aria-label": "Previous",
              "data-inspector-step": "previous",
              onClick: c[1] || (c[1] = (f) => a("step", -1))
            }, {
              default: P(() => [
                E(le, {
                  name: "up",
                  size: 13
                })
              ]),
              _: 1
            }),
            E(ge, {
              variant: "icon",
              title: "Next",
              "aria-label": "Next",
              "data-inspector-step": "next",
              onClick: c[2] || (c[2] = (f) => a("step", 1))
            }, {
              default: P(() => [
                E(le, {
                  name: "down",
                  size: 13
                })
              ]),
              _: 1
            })
          ], 64)) : k("", !0)
        ]),
        l.value ? (r(), d("h2", R3, v(e.title), 1)) : (r(), d("p", L3, v(e.label), 1)),
        m("span", N3, [
          e.embedded ? (r(), F(ge, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: c[3] || (c[3] = (f) => R(je)(s.value))
          }, {
            default: P(() => [
              E(le, {
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
            href: R(hh)(s.value)
          }, [
            E(le, {
              name: "share",
              size: 13
            })
          ], 8, q3)) : k("", !0),
          e.embedded ? k("", !0) : (r(), F(ge, {
            key: 2,
            variant: "icon",
            title: i.value,
            "aria-label": i.value,
            "data-resource-close": "",
            onClick: c[4] || (c[4] = (f) => a("close"))
          }, {
            default: P(() => [
              E(le, {
                name: "close",
                size: 13
              })
            ]),
            _: 1
          }, 8, ["title", "aria-label"]))
        ])
      ]),
      E(O3, {
        title: l.value ? "" : e.title,
        abstract: e.description
      }, null, 8, ["title", "abstract"])
    ]));
  }
}, P3 = /* @__PURE__ */ z(D3, [["__scopeId", "data-v-f7878e15"]]), j3 = {
  class: "section field-grid",
  "data-resource-fields": ""
}, F3 = { class: "field-name" }, W3 = {
  key: 1,
  class: "field-value"
}, H3 = ["onClick"], z3 = {
  key: 2,
  class: "field-value"
}, U3 = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", j3, [
      (r(!0), d(D, null, ne(e.fields, (o) => (r(), d(D, {
        key: o.name
      }, [
        m("p", F3, v(o.label), 1),
        o.isTime ? (r(), F(nt, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (r(), d("p", W3, [
          m("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, v(o.value), 9, H3)
        ])) : (r(), d("p", z3, v(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, G3 = /* @__PURE__ */ z(U3, [["__scopeId", "data-v-7e45afb5"]]);
async function V3(e, t) {
  const n = t.creator_id ? ["--creator", String(t.creator_id)] : [], a = t.agent_id ? ["--owner", String(t.agent_id)] : [];
  if (!n.length && !a.length) return { creator: "", owner: "" };
  const s = await e(["agent", "people", ...n, ...a]);
  return s.ok ? { creator: Q2(s.value.actor, s.value.creator_agent), owner: a.length ? X2(t, s.value.owner) : "" } : { creator: "", owner: "" };
}
const K3 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Y3 = {
  key: 1,
  class: "inspector-wait"
}, Q3 = { class: "inspector-main" }, X3 = { class: "inspector-column" }, J3 = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, Z3 = {
  class: "inspector-body",
  "data-inspector-body": ""
}, eS = { class: "inspector-text" }, tS = ["innerHTML"], nS = {
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
    Ps(li, S(() => {
      var j;
      return ((j = s.value) == null ? void 0 : j.$el) ?? null;
    }));
    const o = /* @__PURE__ */ new Set(["question", "memory", "rule"]), l = S(() => n.catalogue.inspector(n.term) ?? {
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
    const _ = S(() => ({ row_id: n.id, id: n.id })), M = S(() => i.value ? ea(l.value.title, i.value, _.value) || K2(n.term, i.value, n.id) : ""), x = S(() => i.value ? b3(l.value, n.term, i.value, n.id) : ""), T = S(() => x.value === M.value ? "" : x.value), H = S(() => i.value ? ea(l.value.description, i.value, _.value) : ""), W = S(() => {
      var j, U, J;
      return ((j = i.value) == null ? void 0 : j.body) || ((U = i.value) == null ? void 0 : U.brief) || (o.has(n.term) ? (J = i.value) == null ? void 0 : J.text : "") || "";
    }), I = S(() => W.value ? ao(W.value, { env: "", rowNames: !1 }) : ""), G = S(() => J2(i.value, W.value, u.value, c.value)), N = S(() => l.value.comments && y.value >= v3.wide), A = S(() => l.value.comments && !N.value), L = (j) => l.value.components.filter((U) => (U.tab || "") === j).map((U) => U.window), q = S(() => [...new Set(l.value.components.map((j) => j.tab).filter(Boolean))]), w = S(() => q.value.length || A.value ? [{ key: "details", label: "Details" }, ...q.value.map((j) => ({ key: j, label: j })), ...A.value ? [{ key: "comments", label: "Comments" }] : []] : []), p = S(() => {
      const j = l.value.links;
      return j ? { categories: j.categories, open: j.open, outsidePlan: j.excludes_plan, pageSize: j.page_size } : null;
    }), $ = sr(() => l.value.comments && i.value ? { term: n.term, id: n.id, title: i.value.title } : {}, (j) => n.read(j));
    async function O() {
      const j = ++b, U = await n.read(ea(l.value.reads, null, _.value).split(/\s+/).filter(Boolean));
      if (j !== b || (f.value = U.ok ? "" : U.error, !U.ok)) return;
      i.value = U.value;
      const J = await V3(n.read, i.value);
      j === b && (u.value = J.creator, c.value = J.owner);
    }
    pe(() => `${n.term}:${n.id}`, () => {
      i.value = null, u.value = "", c.value = "", f.value = "", h.value = "details", O();
    }, { immediate: !0 }), _n(l.value.events, O), pe($.open, (j) => j && A.value && (h.value = "comments"));
    let B = null;
    return _e(() => {
      var j;
      y.value = ((j = g.value) == null ? void 0 : j.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (B = new ResizeObserver(() => y.value = g.value.clientWidth), B.observe(g.value));
    }), Re(() => B == null ? void 0 : B.disconnect()), (j, U) => (r(), d("aside", {
      ref_key: "root",
      ref: g,
      class: "inspector",
      "data-inspector": ""
    }, [
      E(P3, {
        label: T.value,
        title: M.value,
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
      f.value ? (r(), d("p", K3, v(f.value), 1)) : i.value ? (r(), d(D, { key: 2 }, [
        E(Cs, {
          ref_key: "actionBar",
          ref: s
        }, {
          default: P(() => [
            E(eo, {
              name: `row.${e.term}`,
              row: { ...i.value, id: e.id, term: e.term },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: O
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }, 512),
        m("div", Q3, [
          m("div", X3, [
            w.value.length ? (r(), d("div", J3, [
              E(Wt, {
                options: w.value,
                value: h.value,
                onPick: U[3] || (U[3] = (J) => h.value = J)
              }, null, 8, ["options", "value"])
            ])) : k("", !0),
            m("div", Z3, [
              E(Kt, { value: h.value }, {
                details: P(() => [
                  m("div", eS, [
                    I.value && !l.value.draws_text ? (r(), d("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: I.value
                    }, null, 8, tS)) : k("", !0),
                    l.value.lists_fields ? (r(), F(G3, {
                      key: 1,
                      fields: G.value,
                      onPeek: U[4] || (U[4] = (J) => a("open", J))
                    }, null, 8, ["fields"])) : k("", !0)
                  ]),
                  E(Ms, {
                    "slot-name": `inspector.${e.term}`,
                    names: L(""),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: P(() => [
                  E(Dl, {
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
                  E(Ms, {
                    names: L(h.value),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              p.value ? (r(), F(i3, De({
                key: 0,
                model: e.term,
                id: e.id,
                read: e.read
              }, p.value, {
                onOpen: U[6] || (U[6] = (J) => a("open", J))
              }), null, 16, ["model", "id", "read"])) : k("", !0)
            ]),
            l.value.comments ? (r(), F(g3, {
              key: 1,
              send: R($).send,
              count: R($).total.value,
              onShow: U[7] || (U[7] = (J) => A.value && (h.value = "comments"))
            }, null, 8, ["send", "count"])) : k("", !0)
          ]),
          N.value ? (r(), F(Dl, {
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
      ], 64)) : (r(), d("div", Y3, [
        E(Qe)
      ]))
    ], 512));
  }
}, aS = /* @__PURE__ */ z(nS, [["__scopeId", "data-v-60363e95"]]), aA = {
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
    return (n, a) => (r(), F(aS, De(n.$props, {
      catalogue: R(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, sS = { class: "facts" }, oS = { class: "fact wide" }, lS = ["title"], iS = {
  key: 1,
  class: "fact-value"
}, rS = {
  key: 0,
  class: "fact"
}, uS = { class: "fact-value" }, cS = { class: "fact" }, dS = { class: "fact-label" }, fS = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, hS = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, mS = {
  key: 2,
  class: "fact"
}, pS = { class: "fact-value" }, gS = { class: "fact wide" }, vS = { class: "fact-label" }, yS = { class: "fact wide" }, bS = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, kS = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = ia.map(({ key: l, label: i }) => ({ key: String(l), label: i })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, i) => {
      var u, c;
      return r(), d("div", sS, [
        m("div", oS, [
          i[4] || (i[4] = m("span", { class: "fact-label" }, "Plan", -1)),
          (u = e.place) != null && u.plan_id ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: i[0] || (i[0] = (f) => R(je)(`plans:${e.place.plan_id}`))
          }, "Plan " + v(e.place.plan_id) + ": " + v(e.place.plan_title), 9, lS)) : (r(), d("span", iS, "Not in a plan"))
        ]),
        ((c = e.place) == null ? void 0 : c.phase_total) > 1 ? (r(), d("div", rS, [
          i[5] || (i[5] = m("span", { class: "fact-label" }, "Phase", -1)),
          m("span", uS, v(e.place.phase_number) + " of " + v(e.place.phase_total) + ": " + v(e.place.phase_title), 1)
        ])) : k("", !0),
        e.task.helper_id ? (r(), d(D, { key: 1 }, [
          m("div", cS, [
            m("span", dS, v(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            E(hn, {
              as: "button",
              "agent-id": e.task.helper_id,
              label: R(lo)(e.task.helper_name, e.task.helper_main),
              class: "fact-value agent-link",
              "data-task-agent": "",
              onClick: i[1] || (i[1] = (f) => R(je)(`agents:${e.task.helper_id}`))
            }, {
              default: P(() => [
                E(Pt, {
                  name: e.task.helper_name,
                  main: e.task.helper_main
                }, null, 8, ["name", "main"])
              ]),
              _: 1
            }, 8, ["agent-id", "label"])
          ]),
          R(o).has(e.task.state) && e.task.holder_id ? (r(), d("p", fS, [
            E(Pt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[6] || (i[6] = K(" holds it: merging its work finishes it, and releasing the worker opens it again.", -1))
          ])) : e.task.state === "open" ? (r(), d("p", hS, [
            E(Pt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[7] || (i[7] = K(" takes it after the task it is on.", -1))
          ])) : k("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (r(), d("div", mS, [
          i[8] || (i[8] = m("span", { class: "fact-label" }, "Assigned to", -1)),
          m("span", pS, "Agent " + v(e.task.holder_id), 1)
        ])) : k("", !0),
        m("div", gS, [
          m("span", vS, [
            i[9] || (i[9] = K(" Complexity ", -1)),
            E(yi, {
              lines: R(dr).map((f, h) => `${h + 1}: ${f}`),
              label: "What the scores mean"
            }, null, 8, ["lines"])
          ]),
          E(Wt, {
            options: R(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: i[2] || (i[2] = (f) => s("complexity", f))
          }, null, 8, ["options", "value"])
        ]),
        m("div", yS, [
          i[10] || (i[10] = m("span", { class: "fact-label" }, "Priority", -1)),
          E(Wt, {
            options: R(n),
            value: String(R(cr)(e.task.priority)),
            "data-task-priority": "",
            onPick: i[3] || (i[3] = (f) => s("priority", f))
          }, null, 8, ["options", "value"]),
          e.refusal ? (r(), d("p", bS, v(e.refusal), 1)) : k("", !0)
        ])
      ]);
    };
  }
}, wS = /* @__PURE__ */ z(kS, [["__scopeId", "data-v-4bf27961"]]);
function $S(e, t) {
  const n = new Map(t.tasks.map((u) => [u.id, u])), a = (u) => t.edges.filter(([, c]) => c === u).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let u = a(e); u.length; u = [...new Set(u.flatMap(a))].filter((c) => !s.has(c)))
    u.forEach((c) => s.add(c)), o.push(u.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let u = t.edges.find(([c]) => c === e); u && !i.has(u[1]); u = t.edges.find(([c]) => c === u[1]))
    i.add(u[1]), l.push(n.get(u[1]));
  return { above: o.reverse(), below: l };
}
const xS = { class: "number" }, SS = { class: "title" }, MS = { class: "word" }, _S = {
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
    return (a, s) => (r(), F(Ke(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: Y(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: P(() => [
        E(wa, { status: e.status }, null, 8, ["status"]),
        m("span", xS, v(e.number), 1),
        m("span", SS, v(e.title), 1),
        m("span", MS, v(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, us = /* @__PURE__ */ z(_S, [["__scopeId", "data-v-f6417ae8"]]), CS = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, AS = { class: "level" }, ES = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = C(!1);
    pe(() => n.task.id, () => s.value = !1);
    const o = S(() => $S(n.task.id, n.graph)), l = S(() => s.value ? o.value.above : o.value.above.slice(-1)), i = S(() => s.value ? o.value.below : o.value.below.slice(0, 1)), u = S(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (h) => h.slice(0, 1).toUpperCase() + h.slice(1), f = (h, g = !1) => ({ status: mn(h.state), number: h.id, title: h.title, word: g ? "This task" : c(h.state), current: g });
    return (h, g) => o.value.above.length || o.value.below.length ? (r(), d("section", CS, [
      g[5] || (g[5] = m("h4", null, "What waits on what", -1)),
      (r(!0), d(D, null, ne(l.value, (y) => (r(), d(D, {
        key: y.map((b) => b.id).join()
      }, [
        m("div", AS, [
          (r(!0), d(D, null, ne(y, (b) => (r(), F(us, De({
            key: b.id,
            ref_for: !0
          }, f(b), {
            onSelect: g[0] || (g[0] = (_) => a("select", _))
          }), null, 16))), 128))
        ]),
        g[3] || (g[3] = m("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      E(us, ds(Ul(f(e.task, !0))), null, 16),
      (r(!0), d(D, null, ne(i.value, (y) => (r(), d(D, {
        key: y.id
      }, [
        g[4] || (g[4] = m("div", { class: "waits" }, "↓ waits on", -1)),
        E(us, De({ ref_for: !0 }, f(y), {
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
}, OS = /* @__PURE__ */ z(ES, [["__scopeId", "data-v-79c52417"]]), TS = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, IS = ["datetime"], BS = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (r(), d("section", TS, [
      n[0] || (n[0] = m("h3", null, "Block history", -1)),
      (r(!0), d(D, null, ne(e.renewals, (a) => (r(), d("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        m("time", {
          datetime: a.created_at
        }, v(new Date(a.created_at).toLocaleString()), 9, IS),
        m("p", null, v(a.reason), 1)
      ]))), 128))
    ])) : k("", !0);
  }
}, RS = /* @__PURE__ */ z(BS, [["__scopeId", "data-v-b41f213b"]]), LS = {
  class: "part",
  "data-resource-waits": ""
}, NS = ["onClick"], qS = { class: "wait-id" }, DS = { class: "wait-title" }, PS = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", LS, [
      m("h4", null, v(e.title), 1),
      (r(!0), d(D, null, ne(e.waits, (o) => (r(), d("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        E(wa, {
          status: R(mn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        m("span", qS, v(o.id), 1),
        m("span", DS, v(o.title), 1)
      ], 8, NS))), 128))
    ]));
  }
}, Pl = /* @__PURE__ */ z(PS, [["__scopeId", "data-v-8fb2e251"]]), jS = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, FS = { class: "text" }, WS = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, HS = 180, zS = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = C(!1), l = S(() => a.task.waits.filter((u) => !n.has(u.state))), i = S(() => a.task.waits.filter((u) => n.has(u.state)));
    return (u, c) => (r(), d(D, null, [
      l.value.length ? (r(), F(Pl, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0),
      e.task.state === "completed" && e.task.outcome ? (r(), d("section", jS, [
        c[3] || (c[3] = m("h4", null, "How it was done", -1)),
        m("p", FS, v(e.task.outcome), 1)
      ])) : k("", !0),
      e.task.brief ? (r(), d("section", WS, [
        c[4] || (c[4] = m("h4", null, "The brief", -1)),
        m("p", {
          class: Y(["text", { clamped: !o.value }])
        }, v(e.task.brief), 3),
        e.task.brief.length > HS && !o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (f) => o.value = !0)
        }, "Show the whole brief")) : k("", !0)
      ])) : k("", !0),
      i.value.length ? (r(), F(Pl, {
        key: 3,
        title: "Waited on",
        waits: i.value,
        onSelect: c[2] || (c[2] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0)
    ], 64));
  }
}, US = /* @__PURE__ */ z(zS, [["__scopeId", "data-v-4a3f1e79"]]), GS = {
  class: "task-details",
  "data-task-details": ""
}, VS = { class: "since" }, KS = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, YS = { class: "text" }, QS = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, XS = {
  key: 1,
  class: "note"
}, JS = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, ZS = { class: "text" }, e6 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return r(), d("div", GS, [
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
            E(wa, {
              status: R(mn)(e.task.state)
            }, null, 8, ["status"]),
            K(" " + v(a(e.task.state)), 1)
          ]),
          m("span", VS, [
            o[5] || (o[5] = K(" since ", -1)),
            E(nt, {
              at: R(zh)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (r(), d("section", KS, [
          o[6] || (o[6] = m("span", { class: "label" }, "Blocked, waiting on", -1)),
          m("p", YS, v(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (r(), d("p", QS, "Opens by itself when " + v(e.task.openers.join(" or ")) + ".", 1)) : (r(), d("p", XS, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (r(), d("section", JS, [
          o[7] || (o[7] = m("span", { class: "label" }, "Why it was cancelled", -1)),
          m("p", ZS, v(e.task.reason), 1)
        ])) : k("", !0),
        e.graph ? (r(), F(OS, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : k("", !0),
        E(wS, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        E(US, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        E(RS, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, sA = /* @__PURE__ */ z(e6, [["__scopeId", "data-v-7e73fa21"]]), t6 = 50, n6 = { messages: 25 }, a6 = (e) => n6[e] || t6, s6 = {
  class: "task-log",
  "aria-label": "Task log"
}, o6 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, l6 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, i6 = { class: "entries" }, r6 = ["data-task-log-important"], u6 = ["datetime"], c6 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, d6 = {
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
        String(a6("task_logs")),
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
    }), (c, f) => (r(), d("section", s6, [
      o.value ? (r(), F(Qe, { key: 0 })) : l.value ? (r(), d(D, { key: 1 }, [
        m("p", o6, v(l.value), 1),
        E(ge, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: f[0] || (f[0] = (h) => u(a.value))
        }, {
          default: P(() => [...f[3] || (f[3] = [
            K("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (r(), d(D, { key: 2 }, [
        n.value.length ? k("", !0) : (r(), d("p", l6, "No log entries yet.")),
        m("ol", i6, [
          (r(!0), d(D, null, ne(n.value, (h) => (r(), d("li", {
            key: h.id,
            class: Y(["entry", { important: h.important }]),
            "data-task-log": "",
            "data-task-log-important": h.important ? "" : null
          }, [
            m("time", {
              datetime: h.created_at
            }, v(new Date(h.created_at).toLocaleString()), 9, u6),
            m("p", null, v(h.line), 1)
          ], 10, r6))), 128))
        ]),
        a.value > 1 || !s.value ? (r(), d("nav", c6, [
          E(ge, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: f[1] || (f[1] = (h) => u(a.value - 1))
          }, {
            default: P(() => [...f[4] || (f[4] = [
              K("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          m("span", null, "Page " + v(a.value), 1),
          E(ge, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: f[2] || (f[2] = (h) => u(a.value + 1))
          }, {
            default: P(() => [...f[5] || (f[5] = [
              K("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : k("", !0)
      ], 64))
    ]));
  }
}, oA = /* @__PURE__ */ z(d6, [["__scopeId", "data-v-cfa43bf1"]]);
function f6(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var cs = { exports: {} }, jl;
function h6() {
  return jl || (jl = 1, (function(e, t) {
    var n = (function() {
      var a = function(I, G) {
        var N = 236, A = 17, L = I, q = o[G], w = null, p = 0, $ = null, O = [], B = {}, j = function(X, Z) {
          p = L * 4 + 17, w = (function(V) {
            for (var ee = new Array(V), te = 0; te < V; te += 1) {
              ee[te] = new Array(V);
              for (var ae = 0; ae < V; ae += 1)
                ee[te][ae] = null;
            }
            return ee;
          })(p), U(0, 0), U(p - 7, 0), U(0, p - 7), ue(), oe(), Ee(X, Z), L >= 7 && ke(X), $ == null && ($ = Q(L, q, O)), be($, Z);
        }, U = function(X, Z) {
          for (var V = -1; V <= 7; V += 1)
            if (!(X + V <= -1 || p <= X + V))
              for (var ee = -1; ee <= 7; ee += 1)
                Z + ee <= -1 || p <= Z + ee || (0 <= V && V <= 6 && (ee == 0 || ee == 6) || 0 <= ee && ee <= 6 && (V == 0 || V == 6) || 2 <= V && V <= 4 && 2 <= ee && ee <= 4 ? w[X + V][Z + ee] = !0 : w[X + V][Z + ee] = !1);
        }, J = function() {
          for (var X = 0, Z = 0, V = 0; V < 8; V += 1) {
            j(!0, V);
            var ee = i.getLostPoint(B);
            (V == 0 || X > ee) && (X = ee, Z = V);
          }
          return Z;
        }, oe = function() {
          for (var X = 8; X < p - 8; X += 1)
            w[X][6] == null && (w[X][6] = X % 2 == 0);
          for (var Z = 8; Z < p - 8; Z += 1)
            w[6][Z] == null && (w[6][Z] = Z % 2 == 0);
        }, ue = function() {
          for (var X = i.getPatternPosition(L), Z = 0; Z < X.length; Z += 1)
            for (var V = 0; V < X.length; V += 1) {
              var ee = X[Z], te = X[V];
              if (w[ee][te] == null)
                for (var ae = -2; ae <= 2; ae += 1)
                  for (var de = -2; de <= 2; de += 1)
                    ae == -2 || ae == 2 || de == -2 || de == 2 || ae == 0 && de == 0 ? w[ee + ae][te + de] = !0 : w[ee + ae][te + de] = !1;
            }
        }, ke = function(X) {
          for (var Z = i.getBCHTypeNumber(L), V = 0; V < 18; V += 1) {
            var ee = !X && (Z >> V & 1) == 1;
            w[Math.floor(V / 3)][V % 3 + p - 8 - 3] = ee;
          }
          for (var V = 0; V < 18; V += 1) {
            var ee = !X && (Z >> V & 1) == 1;
            w[V % 3 + p - 8 - 3][Math.floor(V / 3)] = ee;
          }
        }, Ee = function(X, Z) {
          for (var V = q << 3 | Z, ee = i.getBCHTypeInfo(V), te = 0; te < 15; te += 1) {
            var ae = !X && (ee >> te & 1) == 1;
            te < 6 ? w[te][8] = ae : te < 8 ? w[te + 1][8] = ae : w[p - 15 + te][8] = ae;
          }
          for (var te = 0; te < 15; te += 1) {
            var ae = !X && (ee >> te & 1) == 1;
            te < 8 ? w[8][p - te - 1] = ae : te < 9 ? w[8][15 - te - 1 + 1] = ae : w[8][15 - te - 1] = ae;
          }
          w[p - 8][8] = !X;
        }, be = function(X, Z) {
          for (var V = -1, ee = p - 1, te = 7, ae = 0, de = i.getMaskFunction(Z), ce = p - 1; ce > 0; ce -= 2)
            for (ce == 6 && (ce -= 1); ; ) {
              for (var Se = 0; Se < 2; Se += 1)
                if (w[ee][ce - Se] == null) {
                  var Oe = !1;
                  ae < X.length && (Oe = (X[ae] >>> te & 1) == 1);
                  var he = de(ee, ce - Se);
                  he && (Oe = !Oe), w[ee][ce - Se] = Oe, te -= 1, te == -1 && (ae += 1, te = 7);
                }
              if (ee += V, ee < 0 || p <= ee) {
                ee -= V, V = -V;
                break;
              }
            }
        }, se = function(X, Z) {
          for (var V = 0, ee = 0, te = 0, ae = new Array(Z.length), de = new Array(Z.length), ce = 0; ce < Z.length; ce += 1) {
            var Se = Z[ce].dataCount, Oe = Z[ce].totalCount - Se;
            ee = Math.max(ee, Se), te = Math.max(te, Oe), ae[ce] = new Array(Se);
            for (var he = 0; he < ae[ce].length; he += 1)
              ae[ce][he] = 255 & X.getBuffer()[he + V];
            V += Se;
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
        }, Q = function(X, Z, V) {
          for (var ee = f.getRSBlocks(X, Z), te = h(), ae = 0; ae < V.length; ae += 1) {
            var de = V[ae];
            te.put(de.getMode(), 4), te.put(de.getLength(), i.getLengthInBits(de.getMode(), X)), de.write(te);
          }
          for (var ce = 0, ae = 0; ae < ee.length; ae += 1)
            ce += ee[ae].dataCount;
          if (te.getLengthInBits() > ce * 8)
            throw "code length overflow. (" + te.getLengthInBits() + ">" + ce * 8 + ")";
          for (te.getLengthInBits() + 4 <= ce * 8 && te.put(0, 4); te.getLengthInBits() % 8 != 0; )
            te.putBit(!1);
          for (; !(te.getLengthInBits() >= ce * 8 || (te.put(N, 8), te.getLengthInBits() >= ce * 8)); )
            te.put(A, 8);
          return se(te, ee);
        };
        B.addData = function(X, Z) {
          Z = Z || "Byte";
          var V = null;
          switch (Z) {
            case "Numeric":
              V = g(X);
              break;
            case "Alphanumeric":
              V = y(X);
              break;
            case "Byte":
              V = b(X);
              break;
            case "Kanji":
              V = _(X);
              break;
            default:
              throw "mode:" + Z;
          }
          O.push(V), $ = null;
        }, B.isDark = function(X, Z) {
          if (X < 0 || p <= X || Z < 0 || p <= Z)
            throw X + "," + Z;
          return w[X][Z];
        }, B.getModuleCount = function() {
          return p;
        }, B.make = function() {
          if (L < 1) {
            for (var X = 1; X < 40; X++) {
              for (var Z = f.getRSBlocks(X, q), V = h(), ee = 0; ee < O.length; ee++) {
                var te = O[ee];
                V.put(te.getMode(), 4), V.put(te.getLength(), i.getLengthInBits(te.getMode(), X)), te.write(V);
              }
              for (var ae = 0, ee = 0; ee < Z.length; ee++)
                ae += Z[ee].dataCount;
              if (V.getLengthInBits() <= ae * 8)
                break;
            }
            L = X;
          }
          j(!1, J());
        }, B.createTableTag = function(X, Z) {
          X = X || 2, Z = typeof Z > "u" ? X * 4 : Z;
          var V = "";
          V += '<table style="', V += " border-width: 0px; border-style: none;", V += " border-collapse: collapse;", V += " padding: 0px; margin: " + Z + "px;", V += '">', V += "<tbody>";
          for (var ee = 0; ee < B.getModuleCount(); ee += 1) {
            V += "<tr>";
            for (var te = 0; te < B.getModuleCount(); te += 1)
              V += '<td style="', V += " border-width: 0px; border-style: none;", V += " border-collapse: collapse;", V += " padding: 0px; margin: 0px;", V += " width: " + X + "px;", V += " height: " + X + "px;", V += " background-color: ", V += B.isDark(ee, te) ? "#000000" : "#ffffff", V += ";", V += '"/>';
            V += "</tr>";
          }
          return V += "</tbody>", V += "</table>", V;
        }, B.createSvgTag = function(X, Z, V, ee) {
          var te = {};
          typeof arguments[0] == "object" && (te = arguments[0], X = te.cellSize, Z = te.margin, V = te.alt, ee = te.title), X = X || 2, Z = typeof Z > "u" ? X * 4 : Z, V = typeof V == "string" ? { text: V } : V || {}, V.text = V.text || null, V.id = V.text ? V.id || "qrcode-description" : null, ee = typeof ee == "string" ? { text: ee } : ee || {}, ee.text = ee.text || null, ee.id = ee.text ? ee.id || "qrcode-title" : null;
          var ae = B.getModuleCount() * X + Z * 2, de, ce, Se, Oe, he = "", We;
          for (We = "l" + X + ",0 0," + X + " -" + X + ",0 0,-" + X + "z ", he += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', he += te.scalable ? "" : ' width="' + ae + 'px" height="' + ae + 'px"', he += ' viewBox="0 0 ' + ae + " " + ae + '" ', he += ' preserveAspectRatio="xMinYMin meet"', he += ee.text || V.text ? ' role="img" aria-labelledby="' + me([ee.id, V.id].join(" ").trim()) + '"' : "", he += ">", he += ee.text ? '<title id="' + me(ee.id) + '">' + me(ee.text) + "</title>" : "", he += V.text ? '<description id="' + me(V.id) + '">' + me(V.text) + "</description>" : "", he += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', he += '<path d="', Se = 0; Se < B.getModuleCount(); Se += 1)
            for (Oe = Se * X + Z, de = 0; de < B.getModuleCount(); de += 1)
              B.isDark(Se, de) && (ce = de * X + Z, he += "M" + ce + "," + Oe + We);
          return he += '" stroke="transparent" fill="black"/>', he += "</svg>", he;
        }, B.createDataURL = function(X, Z) {
          X = X || 2, Z = typeof Z > "u" ? X * 4 : Z;
          var V = B.getModuleCount() * X + Z * 2, ee = Z, te = V - Z;
          return W(V, V, function(ae, de) {
            if (ee <= ae && ae < te && ee <= de && de < te) {
              var ce = Math.floor((ae - ee) / X), Se = Math.floor((de - ee) / X);
              return B.isDark(Se, ce) ? 0 : 1;
            } else
              return 1;
          });
        }, B.createImgTag = function(X, Z, V) {
          X = X || 2, Z = typeof Z > "u" ? X * 4 : Z;
          var ee = B.getModuleCount() * X + Z * 2, te = "";
          return te += "<img", te += ' src="', te += B.createDataURL(X, Z), te += '"', te += ' width="', te += ee, te += '"', te += ' height="', te += ee, te += '"', V && (te += ' alt="', te += me(V), te += '"'), te += "/>", te;
        };
        var me = function(X) {
          for (var Z = "", V = 0; V < X.length; V += 1) {
            var ee = X.charAt(V);
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
        }, Xe = function(X) {
          var Z = 1;
          X = typeof X > "u" ? Z * 2 : X;
          var V = B.getModuleCount() * Z + X * 2, ee = X, te = V - X, ae, de, ce, Se, Oe, he = {
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
          for (ae = 0; ae < V; ae += 2) {
            for (ce = Math.floor((ae - ee) / Z), Se = Math.floor((ae + 1 - ee) / Z), de = 0; de < V; de += 1)
              Oe = "█", ee <= de && de < te && ee <= ae && ae < te && B.isDark(ce, Math.floor((de - ee) / Z)) && (Oe = " "), ee <= de && de < te && ee <= ae + 1 && ae + 1 < te && B.isDark(Se, Math.floor((de - ee) / Z)) ? Oe += " " : Oe += "█", He += X < 1 && ae + 1 >= te ? We[Oe] : he[Oe];
            He += `
`;
          }
          return V % 2 && X > 0 ? He.substring(0, He.length - V - 1) + Array(V + 1).join("▀") : He.substring(0, He.length - 1);
        };
        return B.createASCII = function(X, Z) {
          if (X = X || 1, X < 2)
            return Xe(Z);
          X -= 1, Z = typeof Z > "u" ? X * 2 : Z;
          var V = B.getModuleCount() * X + Z * 2, ee = Z, te = V - Z, ae, de, ce, Se, Oe = Array(X + 1).join("██"), he = Array(X + 1).join("  "), We = "", He = "";
          for (ae = 0; ae < V; ae += 1) {
            for (ce = Math.floor((ae - ee) / X), He = "", de = 0; de < V; de += 1)
              Se = 1, ee <= de && de < te && ee <= ae && ae < te && B.isDark(ce, Math.floor((de - ee) / X)) && (Se = 0), He += Se ? Oe : he;
            for (ce = 0; ce < X; ce += 1)
              We += He + `
`;
          }
          return We.substring(0, We.length - 1);
        }, B.renderTo2dContext = function(X, Z) {
          Z = Z || 2;
          for (var V = B.getModuleCount(), ee = 0; ee < V; ee++)
            for (var te = 0; te < V; te++)
              X.fillStyle = B.isDark(ee, te) ? "black" : "white", X.fillRect(ee * Z, te * Z, Z, Z);
        }, B;
      };
      a.stringToBytesFuncs = {
        default: function(I) {
          for (var G = [], N = 0; N < I.length; N += 1) {
            var A = I.charCodeAt(N);
            G.push(A & 255);
          }
          return G;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(I, G) {
        var N = (function() {
          for (var L = T(I), q = function() {
            var oe = L.read();
            if (oe == -1) throw "eof";
            return oe;
          }, w = 0, p = {}; ; ) {
            var $ = L.read();
            if ($ == -1) break;
            var O = q(), B = q(), j = q(), U = String.fromCharCode($ << 8 | O), J = B << 8 | j;
            p[U] = J, w += 1;
          }
          if (w != G)
            throw w + " != " + G;
          return p;
        })(), A = 63;
        return function(L) {
          for (var q = [], w = 0; w < L.length; w += 1) {
            var p = L.charCodeAt(w);
            if (p < 128)
              q.push(p);
            else {
              var $ = N[L.charAt(w)];
              typeof $ == "number" ? ($ & 255) == $ ? q.push($) : (q.push($ >>> 8), q.push($ & 255)) : q.push(A);
            }
          }
          return q;
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
        ], G = 1335, N = 7973, A = 21522, L = {}, q = function(w) {
          for (var p = 0; w != 0; )
            p += 1, w >>>= 1;
          return p;
        };
        return L.getBCHTypeInfo = function(w) {
          for (var p = w << 10; q(p) - q(G) >= 0; )
            p ^= G << q(p) - q(G);
          return (w << 10 | p) ^ A;
        }, L.getBCHTypeNumber = function(w) {
          for (var p = w << 12; q(p) - q(N) >= 0; )
            p ^= N << q(p) - q(N);
          return w << 12 | p;
        }, L.getPatternPosition = function(w) {
          return I[w - 1];
        }, L.getMaskFunction = function(w) {
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
        }, L.getErrorCorrectPolynomial = function(w) {
          for (var p = c([1], 0), $ = 0; $ < w; $ += 1)
            p = p.multiply(c([1, u.gexp($)], 0));
          return p;
        }, L.getLengthInBits = function(w, p) {
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
        }, L.getLostPoint = function(w) {
          for (var p = w.getModuleCount(), $ = 0, O = 0; O < p; O += 1)
            for (var B = 0; B < p; B += 1) {
              for (var j = 0, U = w.isDark(O, B), J = -1; J <= 1; J += 1)
                if (!(O + J < 0 || p <= O + J))
                  for (var oe = -1; oe <= 1; oe += 1)
                    B + oe < 0 || p <= B + oe || J == 0 && oe == 0 || U == w.isDark(O + J, B + oe) && (j += 1);
              j > 5 && ($ += 3 + j - 5);
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
          var Ee = Math.abs(100 * ke / p / p - 50) / 5;
          return $ += Ee * 10, $;
        }, L;
      })(), u = (function() {
        for (var I = new Array(256), G = new Array(256), N = 0; N < 8; N += 1)
          I[N] = 1 << N;
        for (var N = 8; N < 256; N += 1)
          I[N] = I[N - 4] ^ I[N - 5] ^ I[N - 6] ^ I[N - 8];
        for (var N = 0; N < 255; N += 1)
          G[I[N]] = N;
        var A = {};
        return A.glog = function(L) {
          if (L < 1)
            throw "glog(" + L + ")";
          return G[L];
        }, A.gexp = function(L) {
          for (; L < 0; )
            L += 255;
          for (; L >= 256; )
            L -= 255;
          return I[L];
        }, A;
      })();
      function c(I, G) {
        if (typeof I.length > "u")
          throw I.length + "/" + G;
        var N = (function() {
          for (var L = 0; L < I.length && I[L] == 0; )
            L += 1;
          for (var q = new Array(I.length - L + G), w = 0; w < I.length - L; w += 1)
            q[w] = I[w + L];
          return q;
        })(), A = {};
        return A.getAt = function(L) {
          return N[L];
        }, A.getLength = function() {
          return N.length;
        }, A.multiply = function(L) {
          for (var q = new Array(A.getLength() + L.getLength() - 1), w = 0; w < A.getLength(); w += 1)
            for (var p = 0; p < L.getLength(); p += 1)
              q[w + p] ^= u.gexp(u.glog(A.getAt(w)) + u.glog(L.getAt(p)));
          return c(q, 0);
        }, A.mod = function(L) {
          if (A.getLength() - L.getLength() < 0)
            return A;
          for (var q = u.glog(A.getAt(0)) - u.glog(L.getAt(0)), w = new Array(A.getLength()), p = 0; p < A.getLength(); p += 1)
            w[p] = A.getAt(p);
          for (var p = 0; p < L.getLength(); p += 1)
            w[p] ^= u.gexp(u.glog(L.getAt(p)) + q);
          return c(w, 0).mod(L);
        }, A;
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
        ], G = function(L, q) {
          var w = {};
          return w.totalCount = L, w.dataCount = q, w;
        }, N = {}, A = function(L, q) {
          switch (q) {
            case o.L:
              return I[(L - 1) * 4 + 0];
            case o.M:
              return I[(L - 1) * 4 + 1];
            case o.Q:
              return I[(L - 1) * 4 + 2];
            case o.H:
              return I[(L - 1) * 4 + 3];
            default:
              return;
          }
        };
        return N.getRSBlocks = function(L, q) {
          var w = A(L, q);
          if (typeof w > "u")
            throw "bad rs block @ typeNumber:" + L + "/errorCorrectionLevel:" + q;
          for (var p = w.length / 3, $ = [], O = 0; O < p; O += 1)
            for (var B = w[O * 3 + 0], j = w[O * 3 + 1], U = w[O * 3 + 2], J = 0; J < B; J += 1)
              $.push(G(j, U));
          return $;
        }, N;
      })(), h = function() {
        var I = [], G = 0, N = {};
        return N.getBuffer = function() {
          return I;
        }, N.getAt = function(A) {
          var L = Math.floor(A / 8);
          return (I[L] >>> 7 - A % 8 & 1) == 1;
        }, N.put = function(A, L) {
          for (var q = 0; q < L; q += 1)
            N.putBit((A >>> L - q - 1 & 1) == 1);
        }, N.getLengthInBits = function() {
          return G;
        }, N.putBit = function(A) {
          var L = Math.floor(G / 8);
          I.length <= L && I.push(0), A && (I[L] |= 128 >>> G % 8), G += 1;
        }, N;
      }, g = function(I) {
        var G = s.MODE_NUMBER, N = I, A = {};
        A.getMode = function() {
          return G;
        }, A.getLength = function(w) {
          return N.length;
        }, A.write = function(w) {
          for (var p = N, $ = 0; $ + 2 < p.length; )
            w.put(L(p.substring($, $ + 3)), 10), $ += 3;
          $ < p.length && (p.length - $ == 1 ? w.put(L(p.substring($, $ + 1)), 4) : p.length - $ == 2 && w.put(L(p.substring($, $ + 2)), 7));
        };
        var L = function(w) {
          for (var p = 0, $ = 0; $ < w.length; $ += 1)
            p = p * 10 + q(w.charAt($));
          return p;
        }, q = function(w) {
          if ("0" <= w && w <= "9")
            return w.charCodeAt(0) - 48;
          throw "illegal char :" + w;
        };
        return A;
      }, y = function(I) {
        var G = s.MODE_ALPHA_NUM, N = I, A = {};
        A.getMode = function() {
          return G;
        }, A.getLength = function(q) {
          return N.length;
        }, A.write = function(q) {
          for (var w = N, p = 0; p + 1 < w.length; )
            q.put(
              L(w.charAt(p)) * 45 + L(w.charAt(p + 1)),
              11
            ), p += 2;
          p < w.length && q.put(L(w.charAt(p)), 6);
        };
        var L = function(q) {
          if ("0" <= q && q <= "9")
            return q.charCodeAt(0) - 48;
          if ("A" <= q && q <= "Z")
            return q.charCodeAt(0) - 65 + 10;
          switch (q) {
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
              throw "illegal char :" + q;
          }
        };
        return A;
      }, b = function(I) {
        var G = s.MODE_8BIT_BYTE, N = a.stringToBytes(I), A = {};
        return A.getMode = function() {
          return G;
        }, A.getLength = function(L) {
          return N.length;
        }, A.write = function(L) {
          for (var q = 0; q < N.length; q += 1)
            L.put(N[q], 8);
        }, A;
      }, _ = function(I) {
        var G = s.MODE_KANJI, N = a.stringToBytesFuncs.SJIS;
        if (!N)
          throw "sjis not supported.";
        (function(q, w) {
          var p = N(q);
          if (p.length != 2 || (p[0] << 8 | p[1]) != w)
            throw "sjis not supported.";
        })("友", 38726);
        var A = N(I), L = {};
        return L.getMode = function() {
          return G;
        }, L.getLength = function(q) {
          return ~~(A.length / 2);
        }, L.write = function(q) {
          for (var w = A, p = 0; p + 1 < w.length; ) {
            var $ = (255 & w[p]) << 8 | 255 & w[p + 1];
            if (33088 <= $ && $ <= 40956)
              $ -= 33088;
            else if (57408 <= $ && $ <= 60351)
              $ -= 49472;
            else
              throw "illegal char at " + (p + 1) + "/" + $;
            $ = ($ >>> 8 & 255) * 192 + ($ & 255), q.put($, 13), p += 2;
          }
          if (p < w.length)
            throw "illegal char at " + (p + 1);
        }, L;
      }, M = function() {
        var I = [], G = {};
        return G.writeByte = function(N) {
          I.push(N & 255);
        }, G.writeShort = function(N) {
          G.writeByte(N), G.writeByte(N >>> 8);
        }, G.writeBytes = function(N, A, L) {
          A = A || 0, L = L || N.length;
          for (var q = 0; q < L; q += 1)
            G.writeByte(N[q + A]);
        }, G.writeString = function(N) {
          for (var A = 0; A < N.length; A += 1)
            G.writeByte(N.charCodeAt(A));
        }, G.toByteArray = function() {
          return I;
        }, G.toString = function() {
          var N = "";
          N += "[";
          for (var A = 0; A < I.length; A += 1)
            A > 0 && (N += ","), N += I[A];
          return N += "]", N;
        }, G;
      }, x = function() {
        var I = 0, G = 0, N = 0, A = "", L = {}, q = function(p) {
          A += String.fromCharCode(w(p & 63));
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
        return L.writeByte = function(p) {
          for (I = I << 8 | p & 255, G += 8, N += 1; G >= 6; )
            q(I >>> G - 6), G -= 6;
        }, L.flush = function() {
          if (G > 0 && (q(I << 6 - G), I = 0, G = 0), N % 3 != 0)
            for (var p = 3 - N % 3, $ = 0; $ < p; $ += 1)
              A += "=";
        }, L.toString = function() {
          return A;
        }, L;
      }, T = function(I) {
        var G = I, N = 0, A = 0, L = 0, q = {};
        q.read = function() {
          for (; L < 8; ) {
            if (N >= G.length) {
              if (L == 0)
                return -1;
              throw "unexpected end of file./" + L;
            }
            var p = G.charAt(N);
            if (N += 1, p == "=")
              return L = 0, -1;
            if (p.match(/^\s$/))
              continue;
            A = A << 6 | w(p.charCodeAt(0)), L += 6;
          }
          var $ = A >>> L - 8 & 255;
          return L -= 8, $;
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
        return q;
      }, H = function(I, G) {
        var N = I, A = G, L = new Array(I * G), q = {};
        q.setPixel = function(O, B, j) {
          L[B * N + O] = j;
        }, q.write = function(O) {
          O.writeString("GIF87a"), O.writeShort(N), O.writeShort(A), O.writeByte(128), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(255), O.writeByte(255), O.writeByte(255), O.writeString(","), O.writeShort(0), O.writeShort(0), O.writeShort(N), O.writeShort(A), O.writeByte(0);
          var B = 2, j = p(B);
          O.writeByte(B);
          for (var U = 0; j.length - U > 255; )
            O.writeByte(255), O.writeBytes(j, U, 255), U += 255;
          O.writeByte(j.length - U), O.writeBytes(j, U, j.length - U), O.writeByte(0), O.writeString(";");
        };
        var w = function(O) {
          var B = O, j = 0, U = 0, J = {};
          return J.write = function(oe, ue) {
            if (oe >>> ue)
              throw "length over";
            for (; j + ue >= 8; )
              B.writeByte(255 & (oe << j | U)), ue -= 8 - j, oe >>>= 8 - j, U = 0, j = 0;
            U = oe << j | U, j = j + ue;
          }, J.flush = function() {
            j > 0 && B.writeByte(U);
          }, J;
        }, p = function(O) {
          for (var B = 1 << O, j = (1 << O) + 1, U = O + 1, J = $(), oe = 0; oe < B; oe += 1)
            J.add(String.fromCharCode(oe));
          J.add(String.fromCharCode(B)), J.add(String.fromCharCode(j));
          var ue = M(), ke = w(ue);
          ke.write(B, U);
          var Ee = 0, be = String.fromCharCode(L[Ee]);
          for (Ee += 1; Ee < L.length; ) {
            var se = String.fromCharCode(L[Ee]);
            Ee += 1, J.contains(be + se) ? be = be + se : (ke.write(J.indexOf(be), U), J.size() < 4095 && (J.size() == 1 << U && (U += 1), J.add(be + se)), be = se);
          }
          return ke.write(J.indexOf(be), U), ke.write(j, U), ke.flush(), ue.toByteArray();
        }, $ = function() {
          var O = {}, B = 0, j = {};
          return j.add = function(U) {
            if (j.contains(U))
              throw "dup key:" + U;
            O[U] = B, B += 1;
          }, j.size = function() {
            return B;
          }, j.indexOf = function(U) {
            return O[U];
          }, j.contains = function(U) {
            return typeof O[U] < "u";
          }, j;
        };
        return q;
      }, W = function(I, G, N) {
        for (var A = H(I, G), L = 0; L < G; L += 1)
          for (var q = 0; q < I; q += 1)
            A.setPixel(q, L, N(q, L));
        var w = M();
        A.write(w);
        for (var p = x(), $ = w.toByteArray(), O = 0; O < $.length; O += 1)
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
var m6 = h6();
const p6 = /* @__PURE__ */ f6(m6), g6 = ["width", "height", "viewBox"], v6 = ["width", "height"], y6 = ["d"], b6 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = S(() => {
      const a = p6(0, "M");
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
      }, null, 8, v6),
      m("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, y6)
    ], 8, g6));
  }
}, lA = /* @__PURE__ */ z(b6, [["__scopeId", "data-v-489f0852"]]), k6 = {
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
}, iA = /* @__PURE__ */ z(k6, [["__scopeId", "data-v-47e67f04"]]);
function rA(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const uA = mu(() => import("./VoiceFigure-33rZG6wL.js").then((e) => e.V)), cA = "1.2.0", dA = "3.5";
export {
  uh as $,
  Te as A,
  Be as B,
  xa as C,
  dt as D,
  fC as E,
  w4 as F,
  n_ as G,
  rC as H,
  t4 as I,
  A4 as J,
  It as K,
  S6 as L,
  bo as M,
  R4 as N,
  C4 as O,
  $a as P,
  A_ as Q,
  LM as R,
  Jn as S,
  B_ as T,
  CM as U,
  Ie as V,
  ua as W,
  _M as X,
  MM as Y,
  rh as Z,
  z as _,
  vM as a,
  Q_ as a$,
  I4 as a0,
  NM as a1,
  qM as a2,
  Le as a3,
  KM as a4,
  VM as a5,
  Et as a6,
  DM as a7,
  l_ as a8,
  lM as a9,
  W_ as aA,
  M_ as aB,
  z5 as aC,
  c_ as aD,
  d_ as aE,
  hC as aF,
  jr as aG,
  I_ as aH,
  An as aI,
  fM as aJ,
  uM as aK,
  nC as aL,
  En as aM,
  lC as aN,
  t_ as aO,
  __ as aP,
  C_ as aQ,
  S_ as aR,
  vn as aS,
  _t as aT,
  iM as aU,
  R$ as aV,
  $_ as aW,
  BM as aX,
  Dr as aY,
  Ut as aZ,
  Xt as a_,
  X_ as aa,
  sC as ab,
  pM as ac,
  AM as ad,
  EM as ae,
  UM as af,
  GM as ag,
  YM as ah,
  wM as ai,
  Ol as aj,
  PM as ak,
  o_ as al,
  vC as am,
  y_ as an,
  g_ as ao,
  p_ as ap,
  QM as aq,
  HM as ar,
  WM as as,
  zM as at,
  T_ as au,
  s_ as av,
  i_ as aw,
  kC as ax,
  sn as ay,
  r_ as az,
  U4 as b,
  bC as b$,
  v4 as b0,
  oC as b1,
  N_ as b2,
  L_ as b3,
  s5 as b4,
  Mr as b5,
  V_ as b6,
  a_ as b7,
  _a as b8,
  pt as b9,
  D_ as bA,
  z_ as bB,
  yt as bC,
  R_ as bD,
  U_ as bE,
  u_ as bF,
  b_ as bG,
  f_ as bH,
  qe as bI,
  e_ as bJ,
  G_ as bK,
  AC as bL,
  EC as bM,
  sM as bN,
  q$ as bO,
  JM as bP,
  P_ as bQ,
  yM as bR,
  gC as bS,
  q_ as bT,
  j_ as bU,
  F_ as bV,
  XM as bW,
  U5 as bX,
  ZM as bY,
  m_ as bZ,
  pC as b_,
  H_ as ba,
  Xa as bb,
  Pi as bc,
  $C as bd,
  MC as be,
  O_ as bf,
  tC as bg,
  oM as bh,
  v_ as bi,
  xC as bj,
  jM as bk,
  FM as bl,
  xM as bm,
  RM as bn,
  dM as bo,
  Z_ as bp,
  bM as bq,
  kM as br,
  SM as bs,
  w_ as bt,
  E$ as bu,
  iC as bv,
  _4 as bw,
  $M as bx,
  hM as by,
  k_ as bz,
  a5 as c,
  ia as c$,
  cM as c0,
  rM as c1,
  h_ as c2,
  _C as c3,
  So as c4,
  CC as c5,
  tu as c6,
  eC as c7,
  TM as c8,
  OM as c9,
  fo as cA,
  OC as cB,
  $6 as cC,
  Qt as cD,
  vf as cE,
  aA as cF,
  _p as cG,
  li as cH,
  le as cI,
  yi as cJ,
  zC as cK,
  R6 as cL,
  cA as cM,
  dA as cN,
  V6 as cO,
  VC as cP,
  As as cQ,
  Z6 as cR,
  E2 as cS,
  Ue as cT,
  Ct as cU,
  va as cV,
  W6 as cW,
  K6 as cX,
  T6 as cY,
  Ic as cZ,
  u2 as c_,
  B$ as ca,
  mM as cb,
  S4 as cc,
  x_ as cd,
  go as ce,
  P5 as cf,
  E_ as cg,
  on as ch,
  jt as ci,
  Pt as cj,
  P6 as ck,
  F6 as cl,
  hn as cm,
  HC as cn,
  ge as co,
  Uf as cp,
  eo as cq,
  ya as cr,
  Oy as cs,
  ba as ct,
  tA as cu,
  aM as cv,
  j6 as cw,
  By as cx,
  Gs as cy,
  cn as cz,
  Ye as d,
  Lm as d$,
  eA as d0,
  N6 as d1,
  q6 as d2,
  D6 as d3,
  z6 as d4,
  nA as d5,
  lA as d6,
  Zi as d7,
  id as d8,
  FC as d9,
  iA as dA,
  ro as dB,
  NC as dC,
  Fs as dD,
  Op as dE,
  lo as dF,
  L6 as dG,
  Jd as dH,
  Ui as dI,
  Ht as dJ,
  Mn as dK,
  Ld as dL,
  JC as dM,
  XC as dN,
  Vs as dO,
  Rd as dP,
  zs as dQ,
  Zo as dR,
  ZC as dS,
  nM as dT,
  si as dU,
  wc as dV,
  $c as dW,
  zw as dX,
  eM as dY,
  J6 as dZ,
  BC as d_,
  X0 as da,
  E6 as db,
  tM as dc,
  Px as dd,
  Wt as de,
  Y6 as df,
  Qe as dg,
  kt as dh,
  Fv as di,
  pd as dj,
  dp as dk,
  X6 as dl,
  O6 as dm,
  Kt as dn,
  GC as dp,
  UC as dq,
  OS as dr,
  sA as ds,
  oA as dt,
  wa as du,
  bf as dv,
  it as dw,
  Q6 as dx,
  nt as dy,
  uA as dz,
  IM as e,
  TC as e0,
  C6 as e1,
  YC as e2,
  $2 as e3,
  ix as e4,
  cr as e5,
  I6 as e6,
  G6 as e7,
  LC as e8,
  qC as e9,
  mr as eA,
  ri as eB,
  Kx as eC,
  Ws as eD,
  DC as eE,
  fs as eF,
  PC as eG,
  jC as eH,
  st as eI,
  QC as eJ,
  Nd as eK,
  je as ea,
  Ip as eb,
  H6 as ec,
  Rc as ed,
  IC as ee,
  hr as ef,
  RC as eg,
  Kl as eh,
  U6 as ei,
  Dp as ej,
  A6 as ek,
  qp as el,
  qa as em,
  _6 as en,
  dn as eo,
  fi as ep,
  qd as eq,
  B6 as er,
  vt as es,
  rA as et,
  rx as eu,
  x6 as ev,
  M6 as ew,
  WC as ex,
  Ki as ey,
  KC as ez,
  A$ as f,
  wC as g,
  yn as h,
  uC as i,
  SC as j,
  cC as k,
  J_ as l,
  Q4 as m,
  ko as n,
  aC as o,
  gM as p,
  dC as q,
  Zr as r,
  eu as s,
  Ae as t,
  l5 as u,
  K_ as v,
  yC as w,
  Y_ as x,
  Tn as y,
  mC as z
};
