import { openBlock as r, createElementBlock as d, normalizeStyle as ge, unref as B, renderSlot as ie, createElementVNode as h, normalizeClass as Y, Fragment as L, renderList as te, defineComponent as vu, Comment as gu, h as va, cloneVNode as yu, createBlock as j, withCtx as P, createVNode as E, toDisplayString as g, createCommentVNode as k, ref as _, inject as _e, watch as he, onMounted as Ce, onBeforeUnmount as st, reactive as Kt, shallowRef as nt, onUnmounted as Re, useAttrs as ga, computed as S, resolveDynamicComponent as Qe, mergeProps as Pe, useId as Ps, resolveDirective as bu, withDirectives as Me, createTextVNode as U, Teleport as Sn, nextTick as je, Transition as Yt, withModifiers as ke, createApp as ku, shallowReactive as wu, withKeys as At, createSlots as Gl, onScopeDispose as ya, useModel as fn, mergeModels as zt, toRef as Aa, vModelText as Ke, resolveComponent as $u, provide as js, onErrorCaptured as xu, TransitionGroup as Fs, isRef as To, getCurrentInstance as Su, useSlots as Mu, vShow as Ws, getCurrentScope as Kl, normalizeProps as fs, guardReactiveProps as Yl, vModelSelect as Ut, defineAsyncComponent as _u } from "vue";
function Ql(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const z = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, Cu = 1600, Eu = {
  __name: "Shimmer",
  setup(e) {
    const t = Ql(Cu);
    return (n, a) => (r(), d("span", {
      class: "shimmer",
      style: ge(B(t))
    }, null, 4));
  }
}, on = /* @__PURE__ */ z(Eu, [["__scopeId", "data-v-6c018b03"]]), Au = { class: "skeleton-line" }, Ou = 2e3, Tu = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = Ql(Ou);
    return (n, a) => (r(), d("span", Au, [
      ie(n.$slots, "default", {}, void 0, !0),
      h("span", {
        class: Y(["bars", { faded: e.filled }])
      }, [
        (r(!0), d(L, null, te(e.bars, (s) => (r(), d("span", {
          key: s.width,
          class: Y(["bar", { still: e.still }]),
          style: ge({ ...B(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, $t = /* @__PURE__ */ z(Tu, [["__scopeId", "data-v-484fe8a0"]]), Qt = vu({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== gu);
      return a.length !== 1 ? va(L, { key: n }, a) : a[0].key == null ? yu(a[0], { key: n }) : a[0];
    };
  }
}), Iu = ["aria-label"], Bu = ["aria-label"], Ru = ["aria-label"], Lu = ["aria-label"], Nu = ["aria-label"], qu = ["aria-label"], Du = ["aria-label"], Pu = {
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
    return (u, c) => (r(), j(Qt, { value: e.shape }, {
      messages: P(() => [
        h("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(), d(L, null, te(t, (f) => E(on, {
            key: f.id,
            class: Y(["skeleton-message", { mine: f.mine }]),
            style: ge({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, Iu)
      ]),
      older: P(() => [
        h("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(L, null, te(t.slice(0, 3), (f) => (r(), j(on, {
            key: f.id,
            class: Y(["skeleton-message", { mine: f.mine }]),
            style: ge({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, Bu)
      ]),
      cards: P(() => [
        h("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(L, null, te(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (r(), d(L, null, te(n, (m) => E($t, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Ru)
      ]),
      file: P(() => [
        h("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(L, null, te(e.count, (f) => (r(), d("div", {
            key: f,
            class: "skeleton-file"
          }, [
            E($t, {
              class: "skeleton-file-head",
              bars: a
            }),
            (r(), d(L, null, te(s, (m) => E($t, {
              key: m.id,
              bars: m.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Lu)
      ]),
      page: P(() => [
        h("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          E($t, {
            class: "skeleton-heading",
            bars: i
          }),
          (r(!0), d(L, null, te(e.count, (f) => (r(), j($t, {
            key: f,
            bars: B(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, Nu)
      ]),
      text: P(() => [
        h("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(L, null, te(e.count, (f) => (r(), j($t, {
            key: f,
            bars: B(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, qu)
      ]),
      default: P(() => [
        h("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (r(!0), d(L, null, te(e.count, (f) => (r(), j($t, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Du)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Je = /* @__PURE__ */ z(Pu, [["__scopeId", "data-v-ef519c5f"]]), ju = {
  key: 1,
  class: "empty-state titled"
}, Fu = { class: "empty-state-title" }, Wu = { class: "empty-state-text" }, Hu = {
  key: 2,
  class: "empty-state"
}, zu = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (r(), j(Je, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (r(), d("div", ju, [
      h("p", Fu, g(e.title), 1),
      h("p", Wu, [
        ie(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (r(), d("p", Hu, [
      ie(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, mn = /* @__PURE__ */ z(zu, [["__scopeId", "data-v-b27e89b0"]]), Uu = { class: "fold-group" }, Vu = ["aria-expanded"], Gu = { class: "fold-label" }, Ku = {
  key: 0,
  class: "fold-count"
}, Yu = {
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
    return (a, s) => (r(), d("div", Uu, [
      h("button", {
        type: "button",
        class: Y(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        h("span", Gu, g(e.label), 1),
        e.count !== "" ? (r(), d("span", Ku, g(e.count), 1)) : k("", !0),
        h("span", {
          class: Y(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Vu),
      e.open ? ie(a.$slots, "default", {}, void 0, !0, 0) : k("", !0)
    ]));
  }
}, e_ = /* @__PURE__ */ z(Yu, [["__scopeId", "data-v-9ef1865c"]]), Qu = 150, Xu = () => Qu;
function Hs(e, t, n = Xu(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
async function Xl(e, t, n) {
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
const Ju = 50, Io = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function t_(e) {
  const t = ot().sources.find((n) => n.key === e);
  return t ? ms(t.read, t.events) : ms("", []);
}
function Jl(e, t, n, a, s = () => !1) {
  const o = _([]), l = _(null), i = _(""), u = _(!1), c = performance.now(), f = _(!1), m = _(""), p = _(null), y = /* @__PURE__ */ new Set();
  let b = null;
  function x(v) {
    return s() ? (y.add(v), b ?? (b = new Promise(($) => setTimeout(() => $(C()), Ju)))) : M(v);
  }
  async function C() {
    const v = new Set(y);
    y.clear(), b = null;
    const $ = W, O = await t({ ids: [...v].join(","), limit: v.size });
    if ($ !== W) return;
    if (!O.ok) return A();
    const R = new Map(O.value.rows.map((F) => [F.id, F]));
    o.value = o.value.flatMap((F) => v.has(F.id) ? R.has(F.id) ? [R.get(F.id)] : [] : [F]);
  }
  async function M(v) {
    const $ = W, O = await t({ "before-id": v + 1, limit: 1 });
    if ($ !== W) return;
    if (!O.ok) return A();
    const R = O.value.rows.find((F) => F.id === v);
    o.value = R ? o.value.map((F) => F.id === v ? R : F) : o.value.filter((F) => F.id !== v);
  }
  async function T(v) {
    if (a() && String((v == null ? void 0 : v.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((J) => J.id !== v.row_id));
    if (a() && (v != null && v.row_id) && !String(v.event ?? "").endsWith(".create") && o.value.some((J) => J.id === v.row_id)) return x(v.row_id);
    if (!(a() && o.value.length && String((v == null ? void 0 : v.event) ?? "").endsWith(".create"))) return A();
    const O = Math.max(...o.value.map((J) => J.id)), R = W, F = await t({ "after-id": O });
    if (R !== W) return;
    if (!F.ok) return A();
    const V = new Set(o.value.map((J) => J.id));
    o.value = [...F.value.rows.filter((J) => !V.has(J.id)), ...o.value];
  }
  async function H() {
    if (!f.value || !o.value.length) return !1;
    const v = W, $ = Math.min(...o.value.map((F) => F.id)), O = await t({ "before-id": $ });
    if (v !== W) return !1;
    if (!O.ok || !O.value.rows.length) return f.value = !1;
    f.value = Io(O.value, n());
    const R = new Set(o.value.map((F) => F.id));
    return o.value = [...o.value, ...O.value.rows.filter((F) => !R.has(F.id))], !0;
  }
  let W = 0;
  function I(v, $) {
    var F, V;
    const O = v.ok ? e.shared ? [v.value] : ((F = v.value) == null ? void 0 : F.rows) ?? [] : [];
    v.ok && (o.value = $(O)), l.value = v.ok ? v.value : null;
    const R = O.length ? Math.min(...O.map((J) => J.id)) : 0;
    v.ok && ((V = v.value) != null && V.rows) && !o.value.some((J) => J.id < R) && (f.value = !e.shared && Io(v.value, n())), i.value = v.ok ? "" : v.error, Hs(c, () => u.value = !0);
  }
  async function G(v) {
    const $ = ++W, O = await t({});
    $ === W && I(O, v);
  }
  const q = (v) => {
    if (!a() || !v.length) return v;
    const $ = Math.min(...v.map((R) => R.id)), O = Math.max(...v.map((R) => R.id));
    return [...o.value.filter((R) => R.id > O), ...v, ...o.value.filter((R) => R.id < $)];
  }, A = () => G(q), N = (v) => I(v, q), D = () => G((v) => v);
  async function w(v, $ = null) {
    const O = await Xl($ && { target: o, fields: { value: $(o.value) } }, v, e.run);
    return m.value = O.ok ? "" : O.error, p.value = O.ok ? O.value : null, await A(), O;
  }
  return { rows: o, listing: l, failure: i, loaded: u, more: f, load: A, loadLatest: D, older: H, act: w, actionFailure: m, answer: p, context: e, heard: T, showFirst: N, pageSize: n };
}
const Zu = (e) => Object.entries(e).map(([t, n]) => ` --${t} ${n}`).join("");
function ms(e, t, { incremental: n = !1 } = {}) {
  var i;
  const a = Number(((i = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : i[1]) ?? 50), s = ot(), l = Jl(s, (u) => s.read(s.shared && !Object.keys(u).length ? `${s.shared.model} show ${s.shared.id}` : `${e}${Zu(u)}`), () => a, () => n);
  return e && (s.follow(t, l.heard), l.load()), l;
}
const ec = 2e3;
function zs(e, t, n = ec) {
  let a = null, s = !1, o = !1, l = !1;
  const i = _e(Le, null), u = () => {
    var x;
    return ((x = i == null ? void 0 : i.visible) == null ? void 0 : x.value) === !1;
  }, c = () => document.hidden || u(), f = async (x) => {
    o = !0;
    try {
      await x();
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
  he(() => {
    var x;
    return (x = i == null ? void 0 : i.visible) == null ? void 0 : x.value;
  }, b), Ce(async () => {
    document.addEventListener("visibilitychange", b), u() || await y();
  }), st(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", b);
  });
}
const Zl = typeof document < "u" && document.documentElement.classList.contains("phone"), ei = 120;
var Ul;
const Oa = globalThis[Ul = Symbol.for("journal.pressed")] ?? (globalThis[Ul] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function tc(e = 0) {
  const t = Oa.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, Oa.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, Oa.disabledHere.delete(t) && (t.disabled = !1);
  };
}
function hs(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function ti(e = window) {
  if (!hs(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    hs(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const ps = "journal.stale-build-reload", nc = 'script[type="module"][src*="/assets/index-"]', Bo = (e) => {
  var t;
  return ((t = e.querySelector(nc)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function ac(e = document, t = (a, s) => Ae.quietRead(a, s), n = () => ti(window)) {
  const a = Bo(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Bo(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let Ta = "";
function sc(e, t = () => ti(window)) {
  if (!e) return !1;
  const n = !!Ta && Ta !== e;
  return Ta = e, n && t(), n;
}
const oc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function lc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(ps) === e.message) return !1;
    t.setItem(ps, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function ic(e = window.sessionStorage) {
  try {
    e.removeItem(ps);
  } catch {
    return;
  }
}
const rc = 2e3, uc = 3e4, Ye = Kt({ starting: !1, external: !1, late: !1, offline: !1 }), Us = () => Ye.starting, cc = 3;
let Nn = 0, vs = 0, ni = 0, ai = [];
async function dc() {
  try {
    const e = await Ae.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Ye.external };
  }
}
let Ro = null;
const fc = () => Ro ?? (Ro = dc().finally(() => Ro = null));
function mc() {
  clearTimeout(vs), clearTimeout(ni), vs = 0, Object.assign(Ye, { starting: !1, external: !1, late: !1, offline: !1 }), ai.splice(0).forEach((e) => e()), ac();
}
async function hc() {
  Ye.offline = !navigator.onLine;
  const e = await fc();
  if (Ye.external = e.updating, Nn = !e.restarting && !e.updating && e.reachable ? Nn + 1 : 0, Nn < cc) return;
  Nn = 0, (!sc(e.started_at) || hs()) && mc();
}
function si() {
  vs = setTimeout(async () => {
    await hc(), Ye.starting && si();
  }, rc);
}
function Lo() {
  Ye.starting || (Ye.starting = !0, Ye.offline = !navigator.onLine, si(), ni = setTimeout(() => Ye.late = !0, uc));
}
const oi = () => Ye.starting ? new Promise((e) => ai.push(e)) : Promise.resolve();
function Vs(e, t, n = 0) {
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
function pc(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class vc {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = Vs(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = pc(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
function gc(e = typeof document < "u" ? document.visibilityState : "visible") {
  return e === "hidden";
}
const qn = 2e4, yc = 4, No = "/api/read-lines", bc = 5e3, kc = 403, qo = "/api/repeated-lines", wc = 10, $c = 2e3, xc = 3e5, n_ = 6e5, Sc = "X-Journal-Window-Hidden", Dn = 6, Mc = 500, _c = "/journal/summary", Do = "/api/server-state", Cc = 2e4, Pn = Zl ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Ec = (e) => e.split("?")[0].endsWith(_c), gs = (e, t) => Object.assign(new Error(t), { status: e });
async function Ac(e, t, n = gs) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const Oc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), Tc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), Po = (e) => e.split(" ").slice(0, 2).join(" "), it = "read", Dt = "write", Ic = "stream";
class Bc {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = Dn;
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = Po(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one term and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, u]) => o - u < $c));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < wc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const i = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(qo, { method: "POST", headers: { ...Pn, "Content-Type": "application/json" }, body: i }, [{ window: mt, line: qo, kind: Dt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = tc(n ? ei : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = { ...n, headers: { ...n.headers || {}, [Sc]: gc() ? "1" : "0" } }, i = s ? { ...l, signal: Tc(n.signal, s) } : l;
    try {
      return await fetch(t, a[0].kind === Dt ? { ...i, priority: "high" } : i);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up; a read is tried once more at once first, since the
  // server closes a connection left idle and the read may have gone out on it; a write is never sent twice
  async sent(t, n, a, s = qn) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      if (!(o instanceof TypeError)) throw o;
      if ((n.method || "GET") === "GET")
        try {
          return await this.out(t, n, a, s);
        } catch (l) {
          throw l instanceof TypeError && Lo(), l;
        }
      throw Lo(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= yc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(No, { headers: Pn }, [{ window: mt, line: No, kind: it }], bc).then(async (t) => {
      if (t.status === kc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw gs(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new vc(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = Po(n.join(" ")), i = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
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
      this.tries = Dn;
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
    const i = a instanceof FormData, u = { method: t, headers: { ...Pn, ...l, ...a === void 0 || i ? {} : { "Content-Type": "application/json" } }, body: Oc(a) }, c = s || (i ? xc : qn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, u, [{ window: mt, line: n, kind: it }], c)) : await this.sent(n, u, [{ window: mt, line: n, kind: Dt }], c);
    } catch (f) {
      if (t !== "GET" || !(f instanceof TypeError) || o <= 1) throw f;
      return await new Promise((m) => setTimeout(m, Mc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = Dn, l = {}) {
    this.watcher("sent", t, n, a);
    const i = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return Ac(i, `${i.status} ${i.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: mt, line: t, kind: it }], qn)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: Pn });
    if (!n.ok) throw gs(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, Dn, o).then((i) => (this.written(n), i)) : Us() && !Ec(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: mt, line: t, kind: Ic }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Do, { cache: "no-store" }, [{ window: mt, line: Do, kind: it }], Cc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = mt, line: s = t, limit: o = qn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? it : Dt;
    return l === Dt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const Ia = Symbol.for("journal.transport"), Ae = globalThis[Ia] ?? (globalThis[Ia] = new Bc());
class li {
  constructor() {
    this.following = nt([]), this.held = /* @__PURE__ */ new Set();
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
      n.patterns.some((a) => Gs(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Gs(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const ii = (e, t) => !e.row_id || t.has(e.row_id), Rc = (e, t, n) => {
  var a;
  return !e.row_id || (((a = e.changed_ids) == null ? void 0 : a[t]) ?? []).some((s) => n.has(s));
}, Lc = (e, t, n) => {
  var a, s;
  return !((s = (a = e.changed_ids) == null ? void 0 : a[t]) != null && s.length) || e.changed_ids[t].some((o) => n.has(o));
}, Nc = 50, qc = "refresh", Dc = 1e3, Pc = 3e4, jc = "requested", Fc = "after_window", Wc = 50, jn = ".*", Hc = (e) => typeof e == "string" ? [e] : Array.isArray(e) ? e : (e == null ? void 0 : e.only) ?? [];
function zc(e) {
  const t = {}, n = Kt({}), a = [], s = /* @__PURE__ */ new Set(), o = { names: /* @__PURE__ */ new Set(), answer: null }, l = {}, i = /* @__PURE__ */ new Set();
  let u = {}, c = 0, f = 0, m = !1;
  const p = (w) => u[w] ?? u[`${w.slice(0, w.lastIndexOf("."))}.*`] ?? {};
  function y(w) {
    const v = () => p(w), $ = _(void 0), O = Jl(e, async (R) => {
      const F = await C(w, R);
      return F.ok && !Object.keys(R).length && ($.value = F.value), F;
    }, () => v().page_size || Wc, () => !!v().page_size, () => !!v().reads_ids);
    return t[w] = { ...O, data: $, readAt: 0 };
  }
  const b = new Proxy({}, { get: (w, v) => typeof v != "string" || v.startsWith("__v") ? void 0 : t[v] ?? y(v) }), x = (w) => (u[w].loading !== jc || w.endsWith(jn)) && (!u[w].tab || u[w].tab === n.tab);
  function C(w, v = {}) {
    return new Promise(($) => {
      a.push({ name: w, flags: v, resolve: $ }), a.length === 1 && setTimeout(M);
    });
  }
  async function M() {
    const w = /* @__PURE__ */ new Map(), v = a.splice(0).filter((R) => {
      const F = JSON.stringify(R.flags);
      return w.has(R.name) || w.set(R.name, F), w.get(R.name) === F ? !0 : (a.push(R), !1);
    });
    a.length && setTimeout(M);
    const $ = Object.fromEntries(v.flatMap(({ name: R, flags: F }) => Object.entries(F).map(([V, J]) => [`${R}.${V}`, J]))), O = await e.readKeys({ only: [...new Set(v.map(({ name: R }) => R))], state: { ...n, ...$ } });
    v.forEach(({ name: R, resolve: F }) => F(O.ok ? O.value.keys[R] : O));
  }
  async function T(w) {
    var R;
    const v = ++f;
    (w.length ? w : Object.keys(u).filter((F) => !F.endsWith(jn) && u[F].loading === "first" && x(F))).forEach((F) => l[F] = v);
    const O = await e.readKeys({ only: w, state: { ...n } });
    if (!O.ok) {
      if (O.failure === "cancelled") return !1;
      const F = (w.length ? w : Object.keys(t)).filter((J) => (l[J] ?? 0) <= v);
      F.forEach((J) => {
        b[J].readAt = Date.now(), O.failure === "unreachable" ? i.add(J) : i.delete(J), b[J].showFirst(O);
      });
      const V = O.failure === "unreachable" && ((R = e.waitForServer) == null ? void 0 : R.call(e));
      return V && V.then(() => {
        if (m) return;
        const J = F.filter((oe) => l[oe] === v);
        (J.length || !w.length && !F.length && f === v) && T(J);
      }), !1;
    }
    return N(O.value.declared), Object.entries(O.value.keys).forEach(([F, V]) => {
      (l[F] ?? 0) > v || (l[F] = v, b[F].readAt = Date.now(), i.delete(F), V.ok && (b[F].data.value = V.value), b[F].showFirst(V));
    }), !0;
  }
  function H(w) {
    const v = Hc(w);
    return v.length ? (v.forEach(($) => o.names.add($)), o.answer ?? (o.answer = new Promise(($) => setTimeout(() => {
      const O = [...o.names];
      o.names.clear(), o.answer = null, $(T(O));
    })))) : T([]);
  }
  function W(w) {
    w.forEach((v) => s.add(v)), clearTimeout(c), c = setTimeout(() => {
      const v = [...s];
      s.clear(), v.length && H(v);
    }, Nc);
  }
  const I = (w) => w.endsWith(jn) ? Object.keys(t).filter((v) => v.startsWith(w.slice(0, -1)) && t[v].readAt) : [w], G = (w, v) => {
    const $ = p(w).event_column;
    return !$ || Lc(v, $, /* @__PURE__ */ new Set([Number(w.slice(w.lastIndexOf(".") + 1))]));
  }, q = (w) => (u[w] ?? u[`${w.split(".")[0]}.*`]).reload_seconds;
  function A(w) {
    const v = Object.keys(u).filter((O) => w.event === qc || u[O].events.some((R) => Gs(R, w.event)));
    v.filter((O) => u[O].page_size).forEach((O) => b[O].heard(w));
    const $ = v.filter((O) => !u[O].page_size);
    $.filter((O) => !x(O)).forEach((O) => b[O].readAt = 0), W($.filter(x).flatMap(I).filter((O) => G(O, w)));
  }
  function N(w) {
    if (Object.keys(u).length) return;
    u = w;
    const v = [...new Set(Object.values(w).flatMap((O) => O.events))];
    v.length && e.follow(v, A);
    const $ = Object.keys(w).filter((O) => w[O].loading === Fc);
    $.length && T($);
  }
  he(() => n.tab, () => {
    const w = Object.keys(u).filter((v) => !v.endsWith(jn) && x(v) && !b[v].readAt);
    w.length && T(w);
  }), Re(() => {
    m = !0, clearTimeout(c);
  });
  function D() {
    const w = Date.now(), v = Object.keys(u).filter(($) => u[$].reload_seconds > 0 && x($)).flatMap(I).filter(($) => w - b[$].readAt >= (i.has($) ? Math.min(q($) * 1e3, Pc) : q($) * 1e3));
    v.length && W(v);
  }
  return zs(D, () => e.visible.value, Dc), queueMicrotask(() => T([])), { props: b, state: n, reload: H, readKey: C };
}
const Uc = Symbol("open-view"), Le = Symbol.for("journal.window-context"), ri = Symbol("dock-card"), ui = Symbol.for("journal.inspector-actions");
function Vc(e) {
  if ("props" in e) return e;
  let t = null;
  const n = () => t ?? (t = zc(e));
  return Object.defineProperties(e, {
    props: { get: () => n().props },
    state: { get: () => n().state },
    reload: { value: (a) => n().reload(a) },
    readKey: { value: (a, s) => n().readKey(a, s) }
  });
}
function ot() {
  const e = _e(Le, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return Vc(e);
}
const Gc = (e, t) => e(ri, t), a_ = () => _e(ri), ys = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', jo = {
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
  agent: ys,
  worker: ys,
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
}, Kc = ["data-icon", "stroke-width", "innerHTML"], le = {
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
      agent: ys,
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
    }, null, 12, Kc));
  }
}, Yc = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: "spinner",
      style: ge({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Qc = /* @__PURE__ */ z(Yc, [["__scopeId", "data-v-eb453d6f"]]), Xc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = ga(), a = S(() => Object.fromEntries(Object.entries(n).filter(([c]) => c !== "onClick"))), s = _(!1), o = S(() => t.busy || s.value), l = _e(Le, null), i = S(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function u(c) {
      const f = [n.onClick].flat().filter(Boolean).map((p) => p(c)).filter((p) => p instanceof Promise);
      if (!f.length) return;
      const m = setTimeout(() => s.value = !0, ei);
      try {
        await Promise.all(f);
      } finally {
        clearTimeout(m), s.value = !1;
      }
    }
    return (c, f) => (r(), j(Qe(e.href ? "a" : "button"), Pe(a.value, {
      type: e.href ? void 0 : B(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: i.value,
      onClick: u
    }), {
      default: P(() => [
        h("span", {
          class: Y(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (r(), j(le, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : k("", !0),
          ie(c.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (r(), j(Qc, {
          key: 0,
          class: "btn-spinner"
        })) : k("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ve = /* @__PURE__ */ z(Xc, [["__scopeId", "data-v-ededdadf"]]), Jc = ["aria-checked", "aria-haspopup", "onClick"], Zc = {
  key: 0,
  class: "segmented-dot"
}, ed = {
  key: 1,
  class: "segmented-note"
}, td = {
  key: 2,
  class: "segmented-count"
}, nd = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = Ps();
    return (s, o) => {
      const l = bu("tip");
      return r(), d("span", {
        class: Y(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (r(!0), d(L, null, te(e.options, (i) => Me((r(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: Y(["segmented-option", { on: i.key === e.value }]),
          onClick: (u) => n("pick", i.key)
        }, [
          i.dot ? (r(), d("span", Zc)) : k("", !0),
          U(" " + g(i.label) + " ", 1),
          i.note ? (r(), d("small", ed, g(i.note), 1)) : k("", !0),
          i.count !== void 0 ? (r(), d("em", td, g(i.count), 1)) : k("", !0)
        ], 10, Jc)), [
          [l, i.tip || i.title, `${B(a)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Ot = /* @__PURE__ */ z(nd, [["__scopeId", "data-v-c89bc92d"]]), ad = {
  key: 0,
  class: "more-items"
}, sd = {
  key: 0,
  role: "alert"
}, od = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (r(), d("div", ad, [
      e.failure ? (r(), d("p", sd, g(e.failure), 1)) : k("", !0),
      e.more ? (r(), j(ve, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: P(() => [
          U(g(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : k("", !0)
    ])) : k("", !0);
  }
}, Mn = /* @__PURE__ */ z(od, [["__scopeId", "data-v-10464014"]]), ld = { class: "link-group" }, id = {
  class: "group-label",
  "data-link-kind": ""
}, rd = ["disabled", "onClick"], ud = { class: "title" }, cd = { class: "relations" }, dd = {
  __name: "ResourceLinkGroup",
  props: { model: { type: String, required: !0 }, count: { type: Number, required: !0 }, rows: { type: Array, required: !0 }, linkAttribute: { type: String, required: !0 }, documentId: { type: Number, default: 0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1), o = S(() => s.value ? n.rows : n.rows.slice(0, 3)), l = S(() => `${n.model.replaceAll("_", " ").replace(/^./, (f) => f.toUpperCase())} ${n.count}`), i = (f) => f.endpoint.unavailable || !f.endpoint.open_ref, u = (f) => ({ [n.linkAttribute]: !0, "data-link-model": f.endpoint.model, "data-link-id": f.endpoint.id }), c = (f) => `${f.endpoint.model === "doc" && f.endpoint.id === n.documentId ? "Design document" : f.endpoint.model.replaceAll("_", " ").replace(/^./, (m) => m.toUpperCase())} ${f.endpoint.id}, ${f.relations.map((m) => m.replaceAll("_", " ")).join(", ")}`;
    return (f, m) => (r(), d("div", ld, [
      h("div", id, g(l.value), 1),
      (r(!0), d(L, null, te(o.value, (p) => (r(), d("button", Pe({
        key: `${p.endpoint.model}:${p.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, u(p), {
        disabled: i(p),
        onClick: (y) => a("open", p)
      }), [
        h("span", ud, g(p.endpoint.title), 1),
        h("span", cd, [
          U(g(c(p)), 1),
          i(p) ? (r(), d(L, { key: 0 }, [
            U(" · Unavailable")
          ], 64)) : k("", !0)
        ])
      ], 16, rd))), 128)),
      e.rows.length > 3 && !s.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "show-more",
        "data-link-show-more": "",
        onClick: m[0] || (m[0] = (p) => s.value = !0)
      }, "Show more")) : k("", !0)
    ]));
  }
}, fd = /* @__PURE__ */ z(dd, [["__scopeId", "data-v-be6f079c"]]), md = ["data-loaded"], hd = { class: "rows" }, pd = ["disabled", "onClick"], vd = { class: "title" }, gd = { class: "relations" }, yd = { key: 2 }, bd = {
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
    const p = { doc: "Documents", message: "Messages", task: "Tasks", phase: "Phases" }, y = (A) => p[A] || `${A.replaceAll("_", " ").replace(/^./, (N) => N.toUpperCase())}s`, b = S(() => [
      { key: "", label: "All", count: Object.values(o.value).reduce((A, N) => A + N, 0) },
      ...Object.entries(o.value).filter(([A]) => !n.onlyKinds.length || n.onlyKinds.includes(A)).map(([A, N]) => ({ key: A, label: y(A), count: N }))
    ]), x = S(() => {
      const A = Object.keys(o.value).length ? o.value : Object.fromEntries([...new Set(s.value.map((D) => D.endpoint.model))].map((D) => [D, s.value.filter((w) => w.endpoint.model === D).length])), N = { doc: 0, task: 1, message: 2 };
      return Object.entries(A).sort(([D], [w]) => (N[D] ?? 3) - (N[w] ?? 3)).map(([D, w]) => ({ model: D, count: w, rows: s.value.filter((v) => v.endpoint.model === D) }));
    }), C = (A) => A.endpoint.unavailable || !A.endpoint.open_ref, M = (A) => ({ [n.linkAttribute]: !0, "data-link-model": A.endpoint.model, "data-link-id": A.endpoint.id }), T = (A) => `${A.endpoint.model === "doc" && A.endpoint.id === n.documentId ? "Design document" : A.endpoint.model.replaceAll("_", " ").replace(/^./, (N) => N.toUpperCase())} ${A.endpoint.id}, ${A.relations.map((N) => N.replaceAll("_", " ")).join(", ")}`;
    async function H(A = 1) {
      const N = ++m;
      c.value = !0, f.value = "";
      const D = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(A), "--page-size", String(n.pageSize)];
      n.outsidePlan && D.push("--outside-plan"), n.documentId && D.push("--first-counterpart", `doc:${n.documentId}`), i.value && D.push("--kind", i.value);
      try {
        const w = await n.read(D);
        if (N !== m) return;
        if (!w.ok) {
          f.value = w.error;
          return;
        }
        const v = w.value.counterparts ?? [], $ = A === 1 ? v : [...s.value, ...v];
        s.value = [...new Map($.map((O) => [`${O.endpoint.model}:${O.endpoint.id}`, O])).values()], o.value = w.value.categories ?? {}, l.value = w.value.total, u.value = w.value.next_page ?? null;
      } catch (w) {
        N === m && (f.value = w.message);
      } finally {
        N === m && (c.value = !1);
      }
    }
    function W(A) {
      if (C(A)) return;
      const [N, D] = A.endpoint.open_ref.split(":");
      a("open", { table: N, id: Number(D) });
    }
    function I(A) {
      i.value = A, H();
    }
    const G = () => !c.value && u.value && H(u.value), q = S(() => `Show ${Math.min(n.pageSize, Math.max(0, l.value - s.value.length))} more`);
    return he(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}:${n.outsidePlan}`, () => {
      s.value = [], u.value = null, i.value = "", H();
    }, { immediate: !0 }), (A, N) => s.value.length || c.value || f.value || e.empty ? (r(), d("section", {
      key: 0,
      class: Y(["resource-links", { grouped: e.grouped, pinned: e.pinned }]),
      "data-loaded": s.value.length,
      "data-resource-links": ""
    }, [
      b.value.length > 2 ? (r(), j(Ot, {
        key: 0,
        options: b.value,
        value: i.value,
        wrap: "",
        onPick: I
      }, null, 8, ["options", "value"])) : k("", !0),
      h("div", hd, [
        e.grouped ? (r(!0), d(L, { key: 0 }, te(x.value, (D) => (r(), j(fd, {
          key: D.model,
          model: D.model,
          count: D.count,
          rows: D.rows,
          "link-attribute": e.linkAttribute,
          "document-id": e.documentId,
          onOpen: W
        }, null, 8, ["model", "count", "rows", "link-attribute", "document-id"]))), 128)) : (r(!0), d(L, { key: 1 }, te(s.value, (D) => (r(), d("button", Pe({
          key: `${D.endpoint.model}:${D.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, M(D), {
          disabled: C(D),
          onClick: (w) => W(D)
        }), [
          h("span", vd, g(D.endpoint.title), 1),
          h("span", gd, [
            U(g(T(D)), 1),
            C(D) ? (r(), d(L, { key: 0 }, [
              U(" · Unavailable")
            ], 64)) : k("", !0)
          ])
        ], 16, pd))), 128)),
        !s.value.length && !c.value && !f.value && e.empty ? (r(), d("p", yd, g(e.empty), 1)) : k("", !0),
        E(Mn, {
          more: !!u.value,
          loading: c.value,
          failure: f.value,
          label: q.value,
          onMore: G
        }, null, 8, ["more", "loading", "failure", "label"])
      ])
    ], 10, md)) : k("", !0);
  }
}, kd = /* @__PURE__ */ z(bd, [["__scopeId", "data-v-3b23de37"]]), wd = (e, t, n) => Math.max(t, Math.min(n, e)), $d = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, ci = /* @__PURE__ */ new WeakMap(), xd = (e, t) => ci.set(e, t);
function Sd(e, t) {
  for (let n = t; n; n = ci.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function di(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !Sd(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Re(() => window.removeEventListener("click", n));
}
const Nt = 8, Md = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = _(null), o = (v) => v ? `${v}px` : void 0, l = S(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), i = _({ w: 0, h: 0 }), u = _(a.anchor ? a.anchor.getBoundingClientRect() : null), c = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), f = (v) => ({
      left: Math.max(0, v.left),
      top: Math.max(0, v.top),
      right: Math.min(window.innerWidth, v.right),
      bottom: Math.min(window.innerHeight, v.bottom)
    }), m = (v) => {
      const $ = v.closest(".pane, .float-window");
      return $ ? f($.getBoundingClientRect()) : c();
    }, p = (v, $) => `${Math.max(0, v ? Math.min(v, $) : $)}px`;
    function y(v, $) {
      return {
        below: v.bottom - $.bottom - a.gap - Nt,
        above: $.top - v.top - a.gap - Nt,
        across: v.right - v.left - 2 * Nt
      };
    }
    function b(v) {
      const $ = m(a.anchor), O = y($, v);
      return i.value.w <= O.across && i.value.h <= Math.max(O.below, O.above) ? $ : c();
    }
    const x = S(() => {
      if (!u.value) return l.value;
      const v = u.value, $ = b(v), O = y($, v), { w: R, h: F } = i.value, V = a.align === "auto" ? v.left + v.right > $.left + $.right : a.align === "right", J = wd(V ? v.right - R : v.left, $.left + Nt, Math.max($.left + Nt, $.right - R - Nt)), ue = F > O.below && O.above > O.below ? { bottom: `${window.innerHeight - v.top + a.gap}px`, maxHeight: p(a.maxHeight, O.above) } : { top: `${v.bottom + a.gap}px`, maxHeight: p(a.maxHeight, O.below) };
      return { ...l.value, ...ue, left: `${J}px`, maxWidth: p(a.maxWidth, O.across) };
    }), C = n, M = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function T(v) {
      const $ = M(), O = $.indexOf(document.activeElement);
      $[(O + v + $.length) % $.length].focus();
    }
    const H = { ArrowDown: () => T(1), ArrowUp: () => T(-1), Escape: () => C("close") }, W = (v) => H[v.key] && (v.preventDefault(), H[v.key]()), I = () => s.value && (i.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let G = 0;
    const q = new ResizeObserver(() => {
      cancelAnimationFrame(G), G = requestAnimationFrame(I);
    });
    di(s, (v) => a.anchor && !a.anchor.contains(v.target) && C("close"));
    const A = (v, $) => ["top", "left", "right", "bottom"].some((O) => Math.abs(v[O] - $[O]) > 1), N = (v) => v.bottom < 0 || v.top > window.innerHeight;
    let D = 0;
    function w() {
      if (a.anchor) {
        const v = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || N(v)) return C("close");
        A(v, u.value) && (u.value = v);
      }
      D = requestAnimationFrame(w);
    }
    return Ce(() => {
      a.anchor && s.value && xd(s.value, a.anchor), I(), s.value && q.observe(s.value), !a.plain && M()[0] && M()[0].focus(), w();
    }), Re(() => {
      q.disconnect(), cancelAnimationFrame(D), cancelAnimationFrame(G);
    }), t({ element: s }), (v, $) => (r(), j(Sn, {
      to: "body",
      disabled: !e.anchor
    }, [
      h("div", Pe({
        ref_key: "panel",
        ref: s
      }, v.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: x.value,
        onKeydown: W
      }), [
        ie(v.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Xt = /* @__PURE__ */ z(Md, [["__scopeId", "data-v-3d203970"]]), _d = { class: "split-button" }, Cd = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = _(null), s = _(!1), o = () => s.value = !1;
    return (l, i) => (r(), d("span", _d, [
      E(ve, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: i[0] || (i[0] = (u) => n("main"))
      }, {
        default: P(() => [
          ie(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      h("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        E(ve, {
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
      s.value ? (r(), j(Xt, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: P(() => [
          ie(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : k("", !0)
    ]));
  }
}, Ed = /* @__PURE__ */ z(Cd, [["__scopeId", "data-v-c258494d"]]), Ad = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Od = {
  key: 1,
  class: "menu-item-text"
}, Td = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: Y(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (r(), d("span", Ad, g(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (r(), d("span", Od, [
        h("span", null, [
          ie(t.$slots, "default", {}, void 0, !0)
        ]),
        h("small", null, g(e.description), 1)
      ])) : ie(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, He = /* @__PURE__ */ z(Td, [["__scopeId", "data-v-fec99974"]]), Id = ["aria-expanded"], Bd = { class: "drop-label" }, Rd = ["value"], Ld = {
  key: 1,
  class: "drop-lead"
}, Nd = { class: "drop-item-text" }, qd = {
  key: 2,
  class: "drop-note"
}, Dd = {
  key: 1,
  class: "drop-none"
}, Pd = {
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
    const n = e, a = t, s = _(!1), o = _(null), l = _(""), i = S(() => {
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
        e.icon ? (r(), j(le, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : k("", !0),
        h("span", Bd, g(e.label), 1),
        E(le, {
          name: "down",
          size: 11
        })
      ], 10, Id),
      s.value ? (r(), j(Xt, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: f[2] || (f[2] = (m) => s.value = !1)
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
            onInput: f[1] || (f[1] = (m) => l.value = m.target.value)
          }, null, 40, Rd)) : k("", !0),
          (r(!0), d(L, null, te(i.value, (m) => (r(), j(He, {
            key: m.key,
            on: m.key === e.picked,
            "data-drop-item": m.key,
            onClick: (p) => u(m)
          }, {
            default: P(() => [
              m.running !== void 0 ? (r(), d("span", {
                key: 0,
                class: Y(["drop-dot", { live: m.running }])
              }, null, 2)) : k("", !0),
              m.lead ? (r(), d("span", Ld, g(m.lead), 1)) : k("", !0),
              h("span", Nd, g(m.label), 1),
              m.note ? (r(), d("span", qd, g(m.note), 1)) : k("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? k("", !0) : (r(), d("p", Dd, g(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : k("", !0)
    ], 2));
  }
}, Ks = /* @__PURE__ */ z(Pd, [["__scopeId", "data-v-29dfcce5"]]), jd = 0, Fd = "/api/lines", Wd = "/api/line", Fo = 5e3, Wo = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Ho = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), Ba = (e) => JSON.stringify(e.line), zo = () => new DOMException("cancelled", "AbortError");
class Hd {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(Ba(t))) {
        Ae.whenFree(() => this.readAlone(l));
        return;
      }
      this.waiting.push(l), this.sendSoon();
    });
  }
  // a write always finishes, also when its window has gone: it carries no signal
  write(t) {
    return new Promise((n, a) => this.alone({ body: t, resolve: n, reject: a }, Dt));
  }
  sendSoon() {
    this.timer ?? (this.timer = setTimeout(() => Ae.whenFree(() => this.send()), jd));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(zo())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(zo()), n.abort();
    });
    t.forEach((o, l) => {
      var i;
      return (i = o.signal) == null ? void 0 : i.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Ae.sent(Fd, Wo({ lines: t.map((i) => i.body) }, n.signal), t.map((i) => Ho(i.body, it)), Fo);
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
    await this.alone(t, it), Date.now() - n < Fo ? this.slow.delete(Ba(t.body)) : this.slow.add(Ba(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Ae.sent(Wd, Wo(t.body, t.signal), [Ho(t.body, n)], n === it ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const fi = new Hd(), zd = "/api/window";
function Ud(e, t, n, a, s) {
  const o = new URLSearchParams({ environment: t, ...a }), l = `${zd}?${o}`, i = { "x-journal-window": e, ...n.length ? { "x-journal-data-only": n.join(",") } : {} }, u = (c) => Ae.whenFree(async () => {
    const f = await Ae.sent(l, { signal: c, headers: i }, [{ window: e, line: l, kind: it }]);
    if (!f.ok) throw new Error((await f.json()).error);
    return f.json();
  });
  return Ae.joined(`${e} ${n.join(",")} ${o}`, u, s);
}
const mi = /* @__PURE__ */ new Map();
class Vd {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = nt({ buttons: [], missing: {} }), this.loading = nt(!1), this.loaded = nt(!1), this.failed = nt(""), this.pending = null;
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
function s_(e, t) {
  const n = new Vd(e, t);
  return mi.set(e, n), n.load().catch(() => {
  }), n;
}
const Ys = (e) => mi.get(e);
function Gd(e, t, n) {
  const a = Ys(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function Kd(e, t) {
  if (!e) return !0;
  const n = Ys(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Yd = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let hi = {};
async function o_(e = (t) => Ae.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (hi = (await t.json()).states);
}
const Qs = (e, t) => {
  var n;
  return (n = hi[e]) == null ? void 0 : n[t];
}, hn = (e, t) => {
  var n;
  return ((n = Qs(e, t)) == null ? void 0 : n.label) ?? Yd(t);
}, Xs = (e, t) => {
  var n;
  return ((n = Qs(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, Qd = (e, t) => {
  var n;
  return ((n = Qs(e, t)) == null ? void 0 : n.tip_read) ?? "";
}, Xd = Symbol("pane-page"), Js = Symbol("inspector-host"), pi = { 1: "refused", 2: "usage", 3: "fault" }, Jd = 100, Zd = 50, ef = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, tf = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function nf({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: i, options: u = _({}), declared: c = [], page: f = null, setOption: m = () => {
}, autoScroll: p = "", tabs: y = [], sources: b = [], links: x = {}, search: C = {}, readOnly: M = !1, shared: T = null }) {
  const H = /* @__PURE__ */ new Map(), W = (V, J) => l.follow(e, V, (oe) => {
    H.clear(), J(oe);
  }, a), I = new AbortController(), G = _(!1), q = performance.now();
  let A = 0, N = 0, D = () => {
  };
  const w = new Promise((V) => D = V);
  I.signal.addEventListener("abort", D, { once: !0 });
  const v = () => {
    clearTimeout(N), N = setTimeout(() => {
      A === 0 && Hs(q, () => {
        G.value = !0, D();
      });
    }, Zd);
  }, $ = (V, J) => (A += 1, Ct(e, V, t, I.signal, J).finally(() => {
    A -= 1, v();
  })), O = (V, J) => (v(), w.then(() => I.signal.aborted ? dt : Ct(e, V, t, I.signal, J))), R = ({ only: V = [], state: J = {} } = {}) => (A += 1, sf(() => Ud(e, t, V, J, I.signal), I.signal).finally(() => {
    A -= 1, v();
  })), F = (V, { unbatched: J = !1, deferred: oe = !1 } = {}) => {
    const ue = H.get(V);
    if (ue && performance.now() - ue.at < Jd) return ue.answer;
    const we = oe && !G.value ? O(V, J) : $(V, J);
    return H.set(V, { answer: we, at: performance.now() }), we;
  };
  return {
    answered: G,
    settle: v,
    window: e,
    environment: t,
    agent: n,
    page: f,
    visible: S(() => a()),
    permissions: s,
    autoScroll: p,
    tabs: y,
    sources: b,
    links: x,
    search: C,
    readOnly: M,
    shared: T,
    read: F,
    readKeys: R,
    waitForServer: () => Us() ? oi() : null,
    run: (V) => Ct(e, V, t, I.signal),
    upload: (V) => lf(V, e, I.signal),
    cancel: () => I.abort(),
    signal: I.signal,
    subscriptions: l,
    follow: (V, J) => W([V].flat().filter((oe) => o.some((ue) => Gs(ue, oe))), J),
    // for a dock of the chat, whose row's term the window cannot declare ahead
    followUndeclared: W,
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (V) => S(() => {
      var J;
      return u.value[V] ?? ((J = c.find((oe) => oe.key === V)) == null ? void 0 : J.default);
    }),
    setting: async (V, J) => {
      const oe = await F(`window setting ${e} ${V}`);
      return oe.ok ? oe.value.value : J;
    },
    setOption: m,
    keep: (V, J) => Ct(e, ["window", "save-setting", e, V, JSON.stringify(J)], t, I.signal)
  };
}
function vi(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const dt = { ok: !1, failure: "cancelled", error: "" }, Zs = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function gi(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? dt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: pi[n.code] || "fault", error: vi(n.error) };
  } catch {
    return t != null && t.aborted ? dt : { ok: !1, failure: "unreachable", error: Zs };
  }
}
const af = (e) => e.code === 0 ? { ok: !0, value: e.value } : { ok: !1, failure: pi[e.code] || "fault", error: vi(e.error) };
async function sf(e, t) {
  try {
    const n = await e();
    return t.aborted ? dt : { ok: !0, value: { declared: n.declared, keys: Object.fromEntries(Object.entries(n.keys).map(([a, s]) => [a, af(s)])) } };
  } catch {
    return t.aborted ? dt : { ok: !1, failure: "unreachable", error: Zs };
  }
}
async function yi(e, t, n) {
  const a = await gi(() => fi.read(e, t, n), t);
  return a.failure !== "unreachable" || !Us() ? a : (await oi(), t.aborted ? dt : yi(e, t, n));
}
function Ct(e, t, n, a = void 0, s = !1) {
  return Ae.held(() => of(e, t, n, a, s), Ae.knownRead(Array.isArray(t) ? t : eo(t)));
}
async function of(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : eo(t), environment: n };
  return await Ae.isRead(o.line) ? Ae.joined(JSON.stringify(o), (l, i) => yi({ ...o, attribution: i }, l, s), a, o).catch(() => dt) : gi(() => fi.write({ ...o, attribution: {
    client_id: Ae.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function lf(e, t, n = void 0) {
  try {
    const a = await Ae.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? dt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? dt : { ok: !1, failure: "unreachable", error: Zs };
  }
}
function eo(e) {
  return [...e.matchAll(ef)].map(([t]) => t.replace(tf, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const rf = (e) => `show-${e}`, l_ = (e, t, n) => e.filter((a) => {
  var s;
  return n(rf((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), to = "messages.chat", Xn = "main", bi = "Main agent", uf = { main: bi, worker: "Worker", helper: "Helper" }, cf = "journal-", no = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), df = (e) => no(e.replace(cf, "").replaceAll("-", " ")), ff = (e) => `${e.role} ${e.number}`, mf = (e) => e.role === Xn ? bi : `${no(e.role)} ${e.number}`;
function Vt(e, t = e.facts) {
  const n = (t == null ? void 0 : t.profile) || e.profile || "", a = e.role === Xn || !n ? uf[e.role] ?? no(e.role) : df(n), s = e.role === Xn ? "" : ff(e), o = e.role === Xn ? a : n ? `${a} · ${s}` : `${a} ${e.number}`;
  return { title: a, subtext: s, text: o, name: mf(e) };
}
const hf = {
  key: 0,
  class: "agent-failure",
  role: "alert"
}, pf = {
  __name: "ButtonAgentField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _([]), o = _(""), l = S(() => [...s.value].sort((c, f) => +(f.role === n.field.first_role) - +(c.role === n.field.first_role) || c.id - f.id).map((c) => ({ key: String(c.number), label: Vt(c).title, note: Vt(c).subtext }))), i = S(() => l.value.find((c) => c.key === n.value));
    async function u() {
      const c = await Ct(to, ["agent", "running"], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
    }
    return u(), (c, f) => (r(), d(L, null, [
      E(Ks, {
        label: i.value ? i.value.label : "Choose an agent",
        items: l.value,
        picked: e.value,
        empty: "No agent is running",
        wide: "",
        "data-agent-field": "",
        onPick: f[0] || (f[0] = (m) => a("pick", m.key))
      }, null, 8, ["label", "items", "picked"]),
      o.value ? (r(), d("p", hf, g(o.value), 1)) : k("", !0)
    ], 64));
  }
}, vf = /* @__PURE__ */ z(pf, [["__scopeId", "data-v-d2ea58f1"]]), gf = {
  key: 0,
  class: "template-brief"
}, yf = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, bf = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _([]), o = _(""), l = S(() => s.value.map((c) => ({ key: String(c.id), label: c.title, note: c.module }))), i = S(() => s.value.find((c) => String(c.id) === n.value));
    async function u() {
      const c = await Ct(to, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!c.ok) {
        o.value = c.error;
        return;
      }
      s.value = c.value.rows;
      const f = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), m = s.value.find((p) => p.title === f);
      m && a("pick", String(m.id));
    }
    return u(), (c, f) => (r(), d(L, null, [
      E(Ot, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: f[0] || (f[0] = (m) => a("pick", m))
      }, null, 8, ["options", "value"]),
      i.value ? (r(), d("p", gf, g(i.value.brief), 1)) : k("", !0),
      o.value ? (r(), d("p", yf, g(o.value), 1)) : k("", !0)
    ], 64));
  }
}, kf = /* @__PURE__ */ z(bf, [["__scopeId", "data-v-14be8a5c"]]), wf = { class: "info-tip" }, $f = ["aria-label"], xf = {
  class: "info-tip-text",
  role: "tooltip",
  "data-info-tip-text": ""
}, Sf = {
  __name: "InfoTip",
  props: { lines: { type: Array, required: !0 }, label: { type: String, default: "More information" } },
  setup(e) {
    return (t, n) => (r(), d("span", wf, [
      h("button", {
        type: "button",
        class: "info-tip-icon",
        "aria-label": e.label,
        "data-info-tip": ""
      }, [
        E(le, {
          name: "info",
          size: 13
        })
      ], 8, $f),
      h("span", xf, [
        (r(!0), d(L, null, te(e.lines, (a, s) => (r(), d("span", {
          key: s,
          class: "info-tip-line"
        }, g(a), 1))), 128))
      ])
    ]));
  }
}, ki = /* @__PURE__ */ z(Sf, [["__scopeId", "data-v-a2fe5ff1"]]), Mf = { class: "form-field" }, _f = { class: "form-field-head" }, Cf = ["for"], Ef = {
  key: 1,
  class: "form-field-aside"
}, Af = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", Mf, [
      h("div", _f, [
        h("label", {
          class: "form-field-label",
          for: t.$props.for
        }, g(e.label), 9, Cf),
        e.help ? (r(), j(ki, {
          key: 0,
          lines: [e.help],
          label: `About ${e.label}`
        }, null, 8, ["lines", "label"])) : k("", !0),
        t.$slots.aside ? (r(), d("span", Ef, [
          ie(t.$slots, "aside", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      ie(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Of = /* @__PURE__ */ z(Af, [["__scopeId", "data-v-302c40bf"]]), bs = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Tf = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = ga(), n = S(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Me((r(), d("textarea", Pe({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [B(bs), B(t).value]
    ]);
  }
}), If = /* @__PURE__ */ z(Tf, [["__scopeId", "data-v-e130a5b9"]]), Bf = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ps(), o = S(() => n.field.choices ? "choice" : n.field.target ? "template" : n.field.first_role ? "agent" : "text");
    return (l, i) => (r(), j(Of, {
      label: e.field.label,
      for: B(s),
      "data-button-field": e.field.name
    }, {
      default: P(() => [
        E(Qt, { value: o.value }, {
          choice: P(() => [
            E(Ot, {
              id: B(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (u) => a("pick", u))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: P(() => [
            E(kf, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          agent: P(() => [
            E(vf, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[2] || (i[2] = (u) => a("pick", u))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: P(() => [
            E(If, {
              id: B(s),
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
}, ba = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (r(), j(ve, {
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
function Rf(e, t, n, a = () => window) {
  Ce(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Re(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Lf = (e, t = () => !0) => Rf("keydown", (n) => n.key === "Escape" && t() && e());
function wi(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = _(!1), s = S(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Lf(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Nf = 80, qt = Kt([]);
function $i(e) {
  const t = Symbol("layer"), n = () => qt.includes(t) && qt.splice(qt.indexOf(t), 1);
  return he(
    e,
    (a) => {
      a && !qt.includes(t) && qt.push(t), a || n();
    },
    { immediate: !0 }
  ), Re(n), S(() => Nf + Math.max(0, qt.indexOf(t)));
}
let xi = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return xi = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const qf = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Df(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(qf)];
    if (!l.length) return o.preventDefault();
    const [i, u] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), u.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === u && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Ce(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : xi, document.addEventListener("keydown", s), je(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Re(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const Pf = ["aria-modal", "aria-label", "aria-labelledby"], jf = {
  key: 0,
  class: "dialog-head"
}, Ff = ["id", "tabindex"], Wf = {
  key: 1,
  class: "dialog-foot"
}, Hf = 500, zf = 400, Uf = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = wi(a, n), i = $i(s), u = _(null), c = _(null), f = _(null), m = Ps(), p = _(!1), y = Date.now();
    n.modal && Df(c, () => a("escape"), f);
    function b() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, zf);
    }
    function x(T) {
      !n.modal || Date.now() - y >= Hf || ![" ", "Enter"].includes(T.key) || (T.preventDefault(), T.stopPropagation());
    }
    const C = () => u.value && (u.value.scrollTop = u.value.scrollHeight), M = new MutationObserver(C);
    return he(u, (T) => {
      M.disconnect(), T && n.follow && (M.observe(T, { childList: !0, subtree: !0, characterData: !0 }), C());
    }), Re(() => M.disconnect()), (T, H) => (r(), j(Sn, { to: "body" }, [
      E(Yt, {
        name: "dialog",
        appear: "",
        onAfterLeave: B(l)
      }, {
        default: P(() => [
          B(s) ? (r(), d("div", {
            key: 0,
            class: Y(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ge({ zIndex: B(i) }),
            onClick: ke(b, ["self"])
          }, [
            h("section", {
              ref_key: "panel",
              ref: c,
              class: Y(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, huge: e.huge, sheet: e.sheet, nudged: p.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? B(m) : void 0,
              onKeydownCapture: x
            }, [
              e.bare ? k("", !0) : (r(), d("header", jf, [
                h("h3", {
                  id: B(m),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, g(e.title), 9, Ff),
                e.closable ? (r(), j(ba, {
                  key: 0,
                  onClick: B(o)
                }, null, 8, ["onClick"])) : k("", !0)
              ])),
              h("div", {
                ref_key: "body",
                ref: u,
                class: Y(["dialog-body", { bare: e.bare, padded: e.padded }])
              }, [
                ie(T.$slots, "default", {}, void 0, !0)
              ], 2),
              T.$slots.foot ? (r(), d("footer", Wf, [
                ie(T.$slots, "foot", {}, void 0, !0)
              ])) : k("", !0)
            ], 42, Pf)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, ka = /* @__PURE__ */ z(Uf, [["__scopeId", "data-v-089c42bc"]]), Vf = {
  class: "action-output",
  "data-action-output": ""
}, Gf = {
  __name: "ActionOutput",
  props: { text: { type: String, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), j(ka, {
      padded: "",
      title: "Action completed",
      fits: "",
      onClose: s[0] || (s[0] = (o) => n("close"))
    }, {
      default: P(() => [
        h("pre", Vf, g(e.text), 1)
      ]),
      _: 1
    }));
  }
}, Kf = /* @__PURE__ */ z(Gf, [["__scopeId", "data-v-b32f94a4"]]);
function Yf(e) {
  const t = document.body.appendChild(document.createElement("div")), n = ku(Kf, { text: e, onClose: () => {
    n.unmount(), t.remove();
  } });
  n.mount(t);
}
const Qf = (e, t, n = {}) => eo(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function _n(e, t, n, a = {}) {
  var s;
  try {
    if (!await Kd(e.module, n)) return { ok: !1, error: "" };
    const o = await Ct(to, Qf(e, t, a), n);
    return o.ok && typeof ((s = o.value) == null ? void 0 : s.viewer_output) == "string" && o.value.viewer_output.trim() && Yf(o.value.viewer_output), o;
  } catch (o) {
    return { ok: !1, error: o.message };
  }
}
const Xf = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Ra = [
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
}), wa = {
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
    filters: Ra
  }),
  tasks: $e("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: Ra
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
  pins: $e("Pin", "band", "One line pinned to the chat while it matters", { filters: Ra }),
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
}, Jf = ["secrets", "plugins"], Si = Object.keys(wa).filter((e) => !(Zl && Jf.includes(e)));
S(() => Si.map((e) => ({ name: e, ...wa[e] })));
const Jt = (e) => wa[e], Mi = new Map(Si.flatMap((e) => [e, e.replace(/s$/, ""), wa[e].title.toLowerCase()].map((t) => [t, e]))), yt = (e) => Mi.get(String(e).toLowerCase()) || "", _i = [...Mi.keys()].sort((e, t) => t.length - e.length).join("|"), Zf = {
  class: "button-form",
  "data-button-form": ""
}, em = {
  key: 0,
  class: "button-form-title"
}, tm = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, nm = { class: "button-form-actions" }, am = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(Object.fromEntries(n.button.fields.map((f) => [f.name, f.default || ""]))), o = _(!1), l = _(""), i = S(() => n.button.fields.every((f) => s.value[f.name].trim().length > 0)), u = S(() => {
      var m;
      if (!n.row) return n.button.label;
      const f = ((m = Jt(yt(n.row.term))) == null ? void 0 : m.title) || "Item";
      return `${n.button.label} · ${f} ${n.row.id}`;
    });
    async function c() {
      if (o.value || !i.value) return;
      o.value = !0;
      const f = await _n(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = f.ok ? "" : f.error, f.ok && (a("done"), a("close"));
    }
    return (f, m) => (r(), j(ka, {
      padded: "",
      title: u.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: m[1] || (m[1] = (p) => a("close"))
    }, {
      default: P(() => {
        var p;
        return [
          h("div", Zf, [
            (p = e.row) != null && p.title ? (r(), d("p", em, g(e.row.title), 1)) : k("", !0),
            (r(!0), d(L, null, te(e.button.fields, (y) => (r(), j(Bf, {
              key: y.name,
              field: y,
              value: s.value[y.name],
              environment: e.environment,
              onPick: (b) => s.value[y.name] = b
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (r(), d("p", tm, g(l.value), 1)) : k("", !0),
            h("div", nm, [
              E(ve, {
                small: "",
                onClick: m[0] || (m[0] = (y) => a("close"))
              }, {
                default: P(() => [...m[2] || (m[2] = [
                  U("Cancel", -1)
                ])]),
                _: 1
              }),
              E(ve, {
                variant: "primary",
                small: "",
                disabled: !i.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: c
              }, {
                default: P(() => [...m[3] || (m[3] = [
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
}, sm = /* @__PURE__ */ z(am, [["__scopeId", "data-v-e3f0d786"]]), om = ["aria-busy"], lm = {
  key: 1,
  class: "button-slot-confirm",
  "data-button-confirm": ""
}, im = { class: "button-slot-confirm-text" }, rm = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, um = {
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
    const n = e, a = t, s = S(() => Ys(n.environment)), o = S(
      () => {
        var M;
        return !n.readOnly && ((M = s.value) == null ? void 0 : M.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = S(() => {
      var M;
      return !n.readOnly && ((M = s.value) == null ? void 0 : M.failed.value);
    }), i = () => s.value.load().catch(() => {
    }), u = S(() => n.readOnly ? [] : Gd(n.environment, n.name, n.row)), c = _(null), f = _(null), m = _(""), p = _(!1), y = (M) => [M.from ? `From ${M.from}` : "", M.tip, M.warning].filter(Boolean).join(" · "), b = (M) => M.icon || (M.warning ? "dot" : "");
    function x(M) {
      if (!(p.value || n.readOnly)) {
        if (M.fields.length) {
          c.value = M;
          return;
        }
        if (M.confirm) {
          f.value = M;
          return;
        }
        return C(M);
      }
    }
    async function C(M) {
      f.value = null, m.value = "", a("failure", ""), p.value = !0;
      const T = await _n(M, n.row, n.environment);
      p.value = !1, m.value = T.ok ? "" : T.error;
      const H = M.label.toLowerCase() + (n.objectName && !M.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", T.ok ? "" : `Could not ${H}: ${T.error}`), T.ok && a("done");
    }
    return (M, T) => (r(), d("span", {
      class: Y(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (r(), d(L, { key: 0 }, [
        T[5] || (T[5] = h("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        E(ve, {
          small: "",
          onClick: i
        }, {
          default: P(() => [...T[4] || (T[4] = [
            U("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : !o.value && f.value ? (r(), d("span", lm, [
        h("span", im, g(f.value.confirm), 1),
        E(ve, {
          small: "",
          variant: f.value.danger ? "ghost" : "primary",
          bordered: f.value.danger,
          class: Y({ danger: f.value.danger }),
          "data-button-confirm-yes": "",
          onClick: T[0] || (T[0] = (H) => C(f.value))
        }, {
          default: P(() => [
            U(g(f.value.label), 1)
          ]),
          _: 1
        }, 8, ["variant", "bordered", "class"]),
        E(ve, {
          small: "",
          variant: "ghost",
          "data-button-confirm-back": "",
          onClick: T[1] || (T[1] = (H) => f.value = null)
        }, {
          default: P(() => [...T[6] || (T[6] = [
            U("Back", -1)
          ])]),
          _: 1
        })
      ])) : o.value ? k("", !0) : (r(), d(L, { key: 2 }, [
        (r(!0), d(L, null, te(u.value, (H) => (r(), d(L, {
          key: H.name
        }, [
          H.menu.length ? (r(), j(Ed, {
            key: 0,
            small: "",
            variant: H.primary ? "primary" : "ghost",
            disabled: p.value,
            "menu-label": H.menu_label || "More ways",
            title: y(H),
            "data-button": H.name,
            onMain: (W) => x(H)
          }, {
            menu: P(({ close: W }) => [
              (r(!0), d(L, null, te(H.menu, (I) => (r(), j(He, {
                key: I.label,
                description: I.description,
                onClick: (G) => (W(), x({ ...H, ...I, menu: [] }))
              }, {
                default: P(() => [
                  U(g(I.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: P(() => [
              U(g(H.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (r(), j(ve, {
            key: 1,
            small: "",
            variant: H.primary ? "primary" : "ghost",
            bordered: !H.primary,
            class: Y({ danger: H.danger }),
            icon: b(H),
            disabled: p.value,
            title: y(H),
            "data-button": H.name,
            onClick: (W) => x(H)
          }, {
            default: P(() => [
              U(g(H.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "class", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        m.value && !e.readOnly && !e.externalFailure ? (r(), d("span", rm, g(m.value), 1)) : k("", !0),
        c.value && !e.readOnly ? (r(), j(sm, {
          key: c.value.runs,
          button: c.value,
          row: e.row,
          environment: e.environment,
          onClose: T[2] || (T[2] = (H) => c.value = null),
          onDone: T[3] || (T[3] = (H) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : k("", !0)
      ], 64))
    ], 10, om));
  }
}, ao = /* @__PURE__ */ z(um, [["__scopeId", "data-v-a4b6f174"]]), cm = {
  class: "running",
  "data-running-command": ""
}, dm = ["title"], fm = {
  key: "idle",
  class: "running-idle"
}, mm = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (r(), d("span", cm, [
      E(Yt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: P(() => [
          e.text ? (r(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, g(e.text), 9, dm)) : (r(), d("span", fm, g(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, i_ = /* @__PURE__ */ z(mm, [["__scopeId", "data-v-d3240219"]]), hm = ["aria-checked", "disabled", "aria-label", "title"], pm = {
  key: 0,
  class: "switch-inner"
}, vm = {
  key: 0,
  class: "switch-word"
}, gm = {
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
        e.labelled ? (r(), d("span", pm, g(e.word), 1)) : k("", !0),
        s[1] || (s[1] = h("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (r(), d("span", vm, g(e.word), 1)) : k("", !0)
    ], 10, hm));
  }
}, r_ = /* @__PURE__ */ z(gm, [["__scopeId", "data-v-92ae7767"]]), ym = { class: "notice-text" }, bm = {
  key: 1,
  class: "notice-actions"
}, km = {
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
      h("span", ym, [
        ie(n.$slots, "default", {}, void 0, !0)
      ]),
      n.$slots.actions ? (r(), d("span", bm, [
        ie(n.$slots, "actions", {}, void 0, !0)
      ])) : k("", !0)
    ], 2));
  }
}, u_ = /* @__PURE__ */ z(km, [["__scopeId", "data-v-445bd8a6"]]);
function Ci(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function sa(e, t) {
  return Ci(() => localStorage, e, t);
}
function Ei(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function so(e, t) {
  return Ei(() => localStorage, e, t);
}
function Ai(e, t) {
  he(t, (n) => so(e, n), { deep: !0 });
}
function wm(e, t) {
  return Ci(() => sessionStorage, e, t);
}
function $m(e, t) {
  return Ei(() => sessionStorage, e, t);
}
const oa = "journal.environment", Oi = _(wm(oa, sa(oa, "")));
function xm(e) {
  Oi.value = e, $m(oa, e), so(oa, e);
}
const la = _(location.hash), Uo = nt(null), Vo = { integrations: "mcp", library: "team" };
function Sm() {
  if (!Uo.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (Vo[n]) {
    location.replace(`#/${[Vo[n], ...a].join("/")}${t ? `?${t}` : ""}`), la.value = location.hash;
    return;
  }
  !n || Uo.value(n) || (xm(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), la.value = location.hash);
}
window.addEventListener("hashchange", () => {
  la.value = location.hash, Sm();
});
const ks = S(() => {
  const [e, t = ""] = la.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [i, u = ""] = l.split("@"), [c = "", f = "", m = ""] = i.split(":");
    return { table: c, id: Number(f), comment: Number(m) || 0, env: u };
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
}), oo = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${oo.page(e)}?open=${t}`
};
function Mm(e = "", t = 0, n = "") {
  location.hash = oo.page(e, t, n);
}
function _m(e, t = window.location.href) {
  const n = new URL(t);
  return n.searchParams.set("page", "sharing.shares"), n.searchParams.set("share", e), n.hash = "", n.href;
}
const Cm = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Ti(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, i]) => `${l}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Cm).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Ft = {};
function c_(e, t) {
  return Ft[e] = t, () => Ft[e] === t && delete Ft[e];
}
function wt(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Ft[e]) != null && l.call(Ft, t))) return;
  const s = ks.value.stack, o = s.findIndex((i) => i.table === e && i.id === t);
  Ti([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function Em(e, t, n, a = 0, s = "") {
  if (e === ks.value.env) return wt(t, n, a, s);
  const o = ks.value.stack, l = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Ti([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function We(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? Em(a, s, Number(o), 0, t) : wt(s, Number(o), 0, t);
}
function Am(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function jt(e) {
  const t = Am(e);
  t && We(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function d_(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Om = { class: "inspector-part" }, Tm = { class: "inspector-part-title" }, Im = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("section", Om, [
      h("h4", Tm, g(e.title), 1),
      ie(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, f_ = /* @__PURE__ */ z(Im, [["__scopeId", "data-v-5175e4a3"]]), Go = /* @__PURE__ */ new Map(), Bm = {
  __name: "Folded",
  props: { at: { type: Number, default: 420 }, keep: { type: Number, default: 320 }, name: { type: String, default: "" } },
  setup(e) {
    const t = e, n = _(null), a = _(!1), s = _(t.name && Go.get(t.name) || !1);
    function o(u) {
      s.value = u, t.name && Go.set(t.name, u);
    }
    const l = () => {
      const u = !!n.value && n.value.scrollHeight > t.at;
      u !== a.value && (a.value = u);
    }, i = new ResizeObserver(() => requestAnimationFrame(l));
    return Ce(() => n.value && i.observe(n.value.firstElementChild || n.value)), Re(() => i.disconnect()), (u, c) => (r(), d(L, null, [
      h("div", {
        ref_key: "body",
        ref: n,
        class: Y(["folded-body", { folded: a.value && !s.value }]),
        style: ge(a.value && !s.value ? { maxHeight: `${e.keep}px` } : {}),
        onReveal: c[0] || (c[0] = (f) => o(!0))
      }, [
        ie(u.$slots, "default", {}, void 0, !0)
      ], 38),
      a.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "fold",
        onClick: c[1] || (c[1] = ke((f) => o(!s.value), ["stop"]))
      }, g(s.value ? "Show less" : "Show more"), 1)) : k("", !0)
    ], 64));
  }
}, Ii = /* @__PURE__ */ z(Bm, [["__scopeId", "data-v-4d2235ba"]]), Rm = ["aria-valuenow", "aria-valuemax"], Lm = {
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
      h("span", {
        class: "fill",
        style: ge({ width: n.value })
      }, null, 4)
    ], 10, Rm));
  }
}, Bi = /* @__PURE__ */ z(Lm, [["__scopeId", "data-v-9eba6a85"]]), Nm = { processes: "process", memories: "memory", replies: "reply" }, ia = (e) => (Nm[e] ?? e.replace(/([^s])s$/, "$1")).replace(/_/g, "-"), ws = [], qm = 2e3, pt = /* @__PURE__ */ new Map(), Dm = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Pm = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Rt(e, { first: t = !1 } = {}) {
  t ? ws.unshift(e) : ws.push(e), pt.clear();
}
function Ri(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const jm = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Fm = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function ct(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Wm(e, t) {
  const n = [{ type: "text", text: ct(e).replace(/\r\n/g, `
`) }];
  for (const a of ws)
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
  return Hm(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Hm(e) {
  return e.split(Pm).map((t, n) => n % 2 ? t : t.replace(Dm, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Ko(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const zm = 24;
function Um(e) {
  const [t, , ...n] = e, a = Ko(t), s = n.map(Ko), o = (u) => [a, ...s].some((c) => (c[u] ?? "").length > zm) ? ' class="text-column"' : "", l = a.map((u, c) => `<th${o(c)}>${pn(u)}</th>`).join(""), i = s.map((u) => `<tr>${u.map((c, f) => `<td${o(f)}>${pn(c)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${i}</tbody></table>`;
}
const Li = /^\s*(?:[-*+]|\d+[.)])\s+/, $s = /^\s*(\d+)[.)]\s/, Yo = (e) => e.match(/^\s*/)[0].length;
function Ni(e) {
  const t = e[0].match($s), n = Yo(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = a[a.length - 1];
    l && Yo(o) <= n ? a.push({ text: l[2], nested: [] }) : i && o.trim() && (l || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${pn(o.text)}${o.nested.length ? Ni(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function Vm(e, t) {
  const n = $s.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Li.test(e[s]) && $s.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const Qo = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
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
      n.push(`<h${i}>${pn(o[2])}</h${i}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (Qo(t, a)) {
      let i = a + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(Um(t.slice(a, i))), a = i;
      continue;
    }
    if (Li.test(s)) {
      const i = Vm(t, a);
      n.push(Ni(t.slice(a, i))), a = i;
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
    for (; l < t.length && t[l].trim() && !Qo(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${pn(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const Gm = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Km = (e) => e.type !== "text" && !Gm.test(e.html);
function Ym(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(qi(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : Km(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function lo(e, t = { env: "" }) {
  const n = Fm(e, t), a = pt.get(n);
  if (pt.delete(n), a && a.source === t.source && a.reads.every((l) => jm(l, t)))
    return pt.set(n, a), a.html;
  const s = [], o = Ym(Wm(e, { ...t, reads: s }));
  return pt.set(n, { html: o, reads: s, source: t.source }), pt.size > qm && pt.delete(pt.keys().next().value), o;
}
const La = /* @__PURE__ */ new WeakMap();
function Qm(e) {
  if (La.has(e)) return La.get(e);
  const t = wu(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (c, f) => `${c}:${f}`;
  function o(c, f) {
    const m = s(c, f), p = e.read(`${ia(c)} show ${f}`);
    n.set(m, p), p.then((y) => {
      n.get(m) === p && (n.delete(m), t.set(m, y.ok ? { ...y.value, table: c } : null));
    });
  }
  function l(c) {
    a.has(c) || (a.add(c), e.follow([`${ia(c).replace(/-/g, "_")}.*`], (f) => {
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
  return La.set(e, u), u;
}
function Di() {
  const e = _e(Le, null), t = e ? Qm(e) : null;
  return (n, a = {}) => lo(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Pi = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Cn = (e) => String(e || "").replace(Pi, (t, n, a, s) => s), Xm = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Fn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Jm = /^Traceback \(most recent call last\):/m, Zm = 8;
function ji(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Zm).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function eh(e) {
  const t = [...e.matchAll(Xm)].map((a) => a.index);
  if (Fn.lastIndex = 0, !t.length || !Fn.test(e)) return null;
  Fn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(Fn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((i) => i[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: ji(n), tail: "" } : null;
}
function th(e) {
  const t = Jm.exec(e);
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
Rt((e) => {
  const t = Cn(e), n = th(t) || eh(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const ra = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Fi = (e) => `${e.table}:${e.id}`, xs = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Na = 80;
function Xo(e) {
  return e.length <= Na ? e : `${e.slice(0, Na + 1).replace(/\s+\S*$/, "") || e.slice(0, Na)}…`;
}
const Jo = {
  messages: (e) => Xo(xs(e.text)),
  comments: (e) => Xo(xs(e.text)),
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
}, nh = (e) => (Jo[e.table] ? Jo[e.table](e) : e.title || "") || "", Tt = (e) => ra(e.created_at), ah = (e) => ra(e.updated_at) || Tt(e), sh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, oh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function lh(e) {
  const t = sh.exec(e);
  if (t && yt(t[1])) return { at: t.index, length: t[0].length, table: yt(t[1]), id: Number(t[2]), label: t[3] };
  const n = oh.exec(e), a = n && yt(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function ih(e, t, n, a) {
  const s = Ri(a, e, t), o = Cn(s ? nh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${ct(Jt(e).title)} ${t}</span><span class="row-card-title">${ct(o)}</span></a>`;
}
Rt(
  (e, t) => {
    const n = lh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: ih(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const rh = /\.(png|jpe?g|gif|webp|svg)$/i, uh = (e) => rh.test(e), ch = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, dh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function fh(e, t) {
  const n = ch.exec(e), [, a, s, o, l, i] = n || [], u = n && yt(a || o), c = u && Ri(t, u, Number(s || l));
  if (u !== "messages" || !c || !(c.files || []).includes(i)) return null;
  const f = `/api/files/message/${c.id}/${encodeURIComponent(i)}`, m = `${Jt(u).title} ${c.id} · ${ct(i)}`, p = uh(i) ? `<img class="file-card-image" src="${f}" alt="${ct(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${ct(i)}">${p}<span class="file-card-name">${m}</span></a>` };
}
function mh(e) {
  const t = dh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${ct(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Rt(
  (e, t) => {
    if (t.inline) return null;
    const n = fh(e, t) || mh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const hh = /`([^`\n]+)`/g;
Rt((e) => e.replace(hh, (t, n) => `<code>${n}</code>`));
const Zo = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${oo.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Rt(
  (e, t) => e.replace(Pi, (n, a, s, o) => Zo[a] ? Zo[a](s, o, t) : o)
);
const ph = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Wi = new RegExp(`\\b(${_i}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Hi = new RegExp(`\\b(${_i}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), vh = new RegExp(`<code>((?:${Wi.source}|${Hi.source}))</code>`, "gi"), gh = (e) => e.replace(vh, "$1"), yh = (e, t) => `<a class="row-pill" href="#" data-peek="${yt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, bh = (e) => e.replace(Hi, (t, n, a) => a.replace(/\d+/g, (s) => yh(n.replace(/s$/i, ""), s))), kh = (e) => bh(e).replace(
  Wi,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${yt(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
Rt(
  (e, t) => t.rowNames === !1 ? e : gh(e).split(ph).map((n, a) => a % 2 ? n : kh(n)).join("")
);
const wh = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, $h = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, xh = /[\w\]]\(/, Sh = /^[\w$.[\]'"]+\s*=\s*[^=]/, Mh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, _h = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Ch = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Eh = /[[({,]$/, Ah = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Oh = /^(\t|\s{2,})\S/, Th = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Ih = /`[^`]+`/, Bh = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Rh = /[{}()[\];=<>$&|*\\@+^~%]/g, zi = /^\s*(?:[-*+]|\d+[.)])\s/, Lh = /^\s*>/, Nh = /^\s*\|/, qh = 0.6, Dh = 0.4, Ph = 5, jh = 0.03, Ui = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Ph && t.every((n) => Bh.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Rh) ?? []).length / e.length < jh;
}, qa = (e) => {
  const t = e.trim();
  return Ih.test(t) ? !1 : [wh, $h, xh, Sh, Mh, _h, Ch, Eh, Ah].some((n) => n.test(t)) || /[;{}]$/.test(t) || Oh.test(e) && !zi.test(e) && !Ui(e);
};
function Fh(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || zi.test(t[0]) || t.every((o) => Lh.test(o) || Nh.test(o))) return "text";
  const n = t.filter((o) => !Th.test(o.trim()));
  if (t.length === 1) return !n.length || qa(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(qa).length, s = n.filter((o) => !qa(o) && Ui(o)).length;
  return a >= n.length * qh && s <= n.length * Dh ? "code" : "text";
}
const Ss = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Wh = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Hh = `${Ss} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, zh = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Uh = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", el = {
  js: { keywords: Ss, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Wh, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Hh, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Ss, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: zh, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Uh, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, Vh = {
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
function tl(e, t, n) {
  return n && e.startsWith(n, t);
}
function Gh(e, t) {
  const n = el[Vh[t] ?? t] || el.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (tl(e, o, n.line) || n.hash && i === "#") {
      const c = e.indexOf(`
`, o);
      l("comment", e.slice(o, c < 0 ? e.length : c)), o = c < 0 ? e.length : c;
      continue;
    }
    if (n.block && tl(e, o, n.block[0])) {
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
function Kh(e, t) {
  const n = [""];
  for (const { type: a, value: s } of Gh(e, t))
    s.split(`
`).forEach((l, i) => {
      i && n.push(""), l && (n[n.length - 1] += a === "plain" ? ct(l) : `<span class="tok-${a}">${ct(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Yh(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Qh = 1500, nl = /* @__PURE__ */ new WeakMap();
async function Xh(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Yh(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(nl.get(t)), nl.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Qh)
  )));
}
typeof document < "u" && document.addEventListener("click", Xh, !0);
const Jh = /\n\s*\n/, Zh = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, ep = /^\s*(`{3,}|~{3,})\s*$/, tp = /^\s{4,}\S/, np = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Ms = /^\s*(?:[-*+]|\d+[.)])\s/, Vi = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, ap = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function io(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function sp(e) {
  const t = io(e.join(`
`));
  return (ap.find(([, n]) => n.test(t)) || ["text"])[0];
}
const op = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Vi.test(t) && !Ms.test(t);
}, lp = (e, t) => Ms.test(t) || Ms.test([...e].reverse().find((n) => n.trim()) || "");
function ro(e, t) {
  const n = t || sp(e), a = Kh(io(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function ip(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && ep.test(s));
  return a < 0 ? e.length : a;
}
function rp(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return ro(a.map(Cn), n ? n.toLowerCase() : "");
}
function up(e) {
  const t = e.split(Jh).map((l) => ({ paragraph: l, type: Fh(io(l).split(`
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
      s(), n.push(ro(i.map(({ paragraph: u }) => u).join(`

`).split(`
`).map(Cn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function cp(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : up(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const i = n[l].match(Zh);
    if (i) {
      const c = ip(n, l, i[2]);
      o(), a.push(rp(n.slice(l + 1, c), i[1], i[3])), l = c + 1;
      continue;
    }
    const u = op(s) ? np : tp;
    if (!t && u.test(n[l]) && !lp(s, n[l])) {
      let c = l;
      for (; c < n.length && (u.test(n[c]) || !n[c].trim()); ) c += 1;
      for (; c > l && !n[c - 1].trim(); ) c -= 1;
      const f = [];
      for (; s.length && s[s.length - 1].trim() && Vi.test(s[s.length - 1].trim()); ) f.unshift(s.pop());
      if (c - l + f.length >= 2) {
        o(), a.push(ro([...f, ...n.slice(l, c)].map(Cn), "")), l = c;
        continue;
      }
      s.push(...f);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Rt((e, t) => cp(e, t.document), { first: !0 });
const dp = ["innerHTML"], fp = ["innerHTML"], mp = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Di(), a = S(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (r(), d("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => B(jt) && B(jt)(...l)),
      innerHTML: a.value
    }, null, 8, dp)) : (r(), d("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => B(jt) && B(jt)(...l)),
      innerHTML: a.value
    }, null, 8, fp));
  }
}, rt = /* @__PURE__ */ z(mp, [["__scopeId", "data-v-d8e75741"]]), m_ = (e) => [...new Set(e.agents.map((t) => t.name))], Da = (e) => new Set(e.agents.map((t) => t.id)).size === 1 ? e.agents[0] : null, hp = "main agent", uo = (e, t) => t ? hp : e, pp = ["data-agent-main"], vp = {
  key: 0,
  class: "agent-badge-icon",
  "data-agent-main-icon": "",
  width: "14",
  height: "14",
  viewBox: "0 0 16 16",
  fill: "currentColor",
  "aria-hidden": "true"
}, gp = {
  key: 2,
  class: "agent-badge-name",
  "data-agent-badge-name": ""
}, yp = {
  __name: "AgentBadge",
  props: { name: { type: String, required: !0 }, main: Boolean, iconOnly: Boolean },
  setup(e) {
    const t = e, n = S(() => uo(t.name, t.main));
    return (a, s) => (r(), d("span", {
      class: Y(["agent-badge", { main: e.main }]),
      "data-agent-badge": "",
      "data-agent-main": e.main ? "" : null
    }, [
      e.main ? (r(), d("svg", vp, [...s[0] || (s[0] = [
        h("circle", {
          cx: "8",
          cy: "4.8",
          r: "3.3"
        }, null, -1),
        h("path", { d: "M1.8 14.6c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6c0 .4-.3.7-.7.7H2.5c-.4 0-.7-.3-.7-.7z" }, null, -1)
      ])])) : (r(), j(le, {
        key: 1,
        class: "agent-badge-icon",
        name: "agent",
        size: 14
      })),
      e.iconOnly ? k("", !0) : (r(), d("span", gp, g(n.value), 1))
    ], 10, pp));
  }
}, Wt = /* @__PURE__ */ z(yp, [["__scopeId", "data-v-a4c3d1e5"]]), bp = ["failed", "blocked", "problem", "update", "paused", "holding", "waiting", "asks"], Gi = { danger: "failed", warn: "waiting" }, kp = (e) => bp.includes(Gi[e] ?? e), Ki = (e) => kp(e) ? ["badge", Gi[e] ?? e] : ["badge-quiet"], wp = ["aria-expanded"], $p = {
  key: 0,
  class: "state-tip",
  role: "tooltip",
  "data-state-tip": ""
}, xp = {
  key: 0,
  class: "tip-failure"
}, Sp = {
  __name: "StateBadge",
  props: { type: { type: String, required: !0 }, state: { type: String, required: !0 }, rowId: { type: Number, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    const t = e, n = _e(Le, null), a = S(() => Qd(t.type, t.state)), s = S(() => Ki(Xs(t.type, t.state))), o = _(!1), l = _([]), i = _("");
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
      onKeydown: At(c, ["escape"])
    }, [
      U(g(B(hn)(e.type, e.state)) + " ", 1),
      o.value ? (r(), d("span", $p, [
        i.value ? (r(), d("span", xp, g(i.value), 1)) : k("", !0),
        (r(!0), d(L, null, te(l.value, (y) => (r(), d("span", {
          key: y,
          class: "tip-line"
        }, g(y), 1))), 128))
      ])) : k("", !0)
    ], 42, wp)) : (r(), d("span", {
      key: 1,
      class: Y(s.value)
    }, g(B(hn)(e.type, e.state)), 3));
  }
}, Mp = /* @__PURE__ */ z(Sp, [["__scopeId", "data-v-d276694c"]]), _p = {
  class: "plan-details",
  "data-plan-details": ""
}, Cp = { class: "state-line" }, Ep = {
  key: 0,
  class: "phase-count"
}, Ap = {
  key: 0,
  class: "reason",
  "data-plan-reason": ""
}, Op = { class: "text" }, Tp = {
  key: 1,
  class: "note",
  "data-plan-waits-on": ""
}, Ip = {
  key: 2,
  class: "part",
  "data-plan-progress": ""
}, Bp = { class: "overall" }, Rp = { class: "overall-figure" }, Lp = {
  key: 3,
  class: "delegation",
  "data-plan-assignee": ""
}, Np = {
  key: 4,
  class: "delegation",
  "data-plan-delegated": ""
}, qp = {
  key: 5,
  class: "part"
}, Dp = {
  __name: "PlanDetails",
  props: { plan: { type: Object, required: !0 }, read: { type: Function, default: null } },
  setup(e) {
    return (t, n) => {
      var a;
      return r(), d("div", _p, [
        h("div", Cp, [
          E(Mp, {
            type: "plan",
            state: e.plan.state,
            "row-id": e.plan.id,
            read: e.read,
            class: Y(["status", B(Xs)("plan", e.plan.state)]),
            "data-plan-status": ""
          }, null, 8, ["state", "row-id", "read", "class"]),
          e.plan.current_phase ? (r(), d("span", Ep, "Phase " + g(e.plan.current_phase) + " of " + g(e.plan.phases.length), 1)) : k("", !0)
        ]),
        e.plan.reason ? (r(), d("section", Ap, [
          h("h4", null, g(e.plan.state === "cancelled" ? "Why it was cancelled" : "Blocked, waiting on"), 1),
          h("p", Op, g(e.plan.reason), 1)
        ])) : k("", !0),
        (a = e.plan.blocker_ids) != null && a.length ? (r(), d("p", Tp, "Opens by itself when " + g(e.plan.blocker_ids.map((s) => `plan ${s}`).join(" and ")) + " " + g(e.plan.blocker_ids.length === 1 ? "ends" : "have ended") + ".", 1)) : k("", !0),
        e.plan.total ? (r(), d("section", Ip, [
          n[0] || (n[0] = h("h4", null, "Progress", -1)),
          h("div", Bp, [
            E(Bi, {
              value: e.plan.finished,
              max: e.plan.total
            }, null, 8, ["value", "max"]),
            h("span", Rp, g(e.plan.finished) + " of " + g(e.plan.total) + " done", 1)
          ])
        ])) : k("", !0),
        e.plan.assignee ? (r(), d("p", Lp, [
          E(Wt, {
            name: e.plan.assignee.name,
            main: e.plan.assignee.main
          }, null, 8, ["name", "main"])
        ])) : e.plan.delegated ? (r(), d("p", Np, [
          B(Da)(e.plan) ? (r(), j(Wt, {
            key: 0,
            name: B(Da)(e.plan).name,
            main: B(Da)(e.plan).main
          }, null, 8, ["name", "main"])) : (r(), d(L, { key: 1 }, [
            U(" Delegated ")
          ], 64))
        ])) : k("", !0),
        e.plan.brief ? (r(), d("section", qp, [
          n[1] || (n[1] = h("h4", null, "The brief", -1)),
          E(Ii, {
            name: `plans:${e.plan.id}:brief`,
            at: 220,
            keep: 160
          }, {
            default: P(() => [
              E(rt, {
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
}, h_ = /* @__PURE__ */ z(Dp, [["__scopeId", "data-v-52683b11"]]), Pp = {
  __name: "HoverTip",
  props: { as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    return (t, n) => (r(), j(Qe(e.as), {
      type: e.as === "button" ? "button" : void 0,
      class: "tipped"
    }, {
      default: P(() => [
        ie(t.$slots, "default", {}, void 0, !0),
        h("span", {
          class: Y(["tip", e.place]),
          role: "tooltip"
        }, [
          ie(t.$slots, "tip", {}, void 0, !0)
        ], 2)
      ]),
      _: 3
    }, 8, ["type"]));
  }
}, jp = /* @__PURE__ */ z(Pp, [["__scopeId", "data-v-683e1839"]]), Yi = (e) => `row:${e}`, Fp = 5e3, Wp = "cancelled", Pa = /* @__PURE__ */ new Map();
async function Hp(e, t) {
  const n = `${e.environment}:${t}`, a = Pa.get(n);
  if (a && performance.now() - a.at < Fp) {
    const o = await a.answer;
    if (o.failure !== Wp) return o;
    Pa.delete(n);
  }
  const s = e.read(`agent tip ${Yi(t)}`);
  return Pa.set(n, { answer: s, at: performance.now() }), s;
}
function zp(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function En(e, t = Date.now()) {
  const n = zp(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const Up = 36e5;
function Vp(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / Up;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function al(e) {
  return e ? new Date(e).toLocaleString([], { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: !1 }) : "";
}
function Qi(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function sl(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const ja = (e) => String(e).padStart(2, "0");
function Xi(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${ja(t % 60)}s` : `${Math.floor(t / 3600)}h ${ja(Math.floor(t % 3600 / 60))}m ${ja(t % 60)}s`;
}
const Gp = { working: { state: "working", words: "Working" }, paused: { state: "paused", words: "Paused" }, "at usage limit": { state: "limited", words: "At usage limit" }, ended: { state: "idle", words: "Idle" } }, Kp = { state: "retired", words: "Retired" }, Yp = (e) => e.retired ? Kp : Gp[e.activity], Qp = (e) => [e.program, e.model, e.effort, e.role_label].filter(Boolean).join(", "), Xp = (e, t) => e ? `Since: ${new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${En(e, t)}` : "", Jp = (e, t) => e ? `Seen: ${En(e, t)}` : "", Zp = {
  class: "line head",
  "data-agent-tip-head": ""
}, e1 = { key: 0 }, t1 = {
  class: "line",
  "data-agent-tip-identity": ""
}, n1 = {
  class: "line status",
  "data-agent-tip-status": ""
}, a1 = ["data-state"], s1 = {
  key: 0,
  class: "line",
  "data-agent-tip-since": ""
}, o1 = {
  key: 1,
  class: "line",
  "data-agent-tip-seen": ""
}, l1 = {
  key: 1,
  class: "line",
  "data-agent-tip-head": ""
}, i1 = {
  key: 2,
  class: "line failure",
  "data-agent-tip-failure": ""
}, r1 = {
  __name: "AgentTip",
  props: { agentId: { type: Number, required: !0 }, label: { type: String, default: "" }, as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    const t = e, n = _e(Le, null), a = _(!1), s = _(null), o = _(""), l = _(Date.now()), i = S(() => Yp(s.value)), u = S(() => Xp(s.value.since, l.value)), c = S(() => Jp(s.value.last_seen, l.value));
    async function f() {
      if (a.value = !0, !n) return;
      const m = await Hp(n, t.agentId);
      o.value = m.ok ? "" : m.error, m.ok && (l.value = Date.now(), s.value = m.value);
    }
    return (m, p) => (r(), j(jp, {
      as: e.as,
      place: e.place,
      class: "agent-tip",
      "data-agent-tip": "",
      onMouseenter: f,
      onFocusin: f
    }, Gl({
      default: P(() => [
        ie(m.$slots, "default", {}, void 0, !0)
      ]),
      _: 2
    }, [
      a.value ? {
        name: "tip",
        fn: P(() => [
          s.value ? (r(), d(L, { key: 0 }, [
            h("span", Zp, [
              h("b", null, g(s.value.title), 1),
              p[0] || (p[0] = U()),
              s.value.name ? (r(), d("span", e1, g(s.value.name), 1)) : k("", !0)
            ]),
            h("span", t1, g(B(Qp)(s.value)), 1),
            h("span", n1, [
              h("i", {
                "data-state": i.value.state
              }, null, 8, a1),
              U(g(i.value.words), 1)
            ]),
            u.value ? (r(), d("span", s1, g(u.value), 1)) : k("", !0),
            c.value ? (r(), d("span", o1, g(c.value), 1)) : k("", !0)
          ], 64)) : (r(), d("b", l1, g(e.label), 1)),
          o.value ? (r(), d("span", i1, g(o.value), 1)) : k("", !0)
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["as", "place"]));
  }
}, vn = /* @__PURE__ */ z(r1, [["__scopeId", "data-v-71d17663"]]), u1 = {
  key: 0,
  class: "phase-agents",
  "data-plan-phase-agents": ""
}, c1 = { class: "agent-word" }, d1 = {
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
    return (o, l) => s.value.length ? (r(), d("div", u1, [
      (r(!0), d(L, null, te(s.value, (i) => (r(), j(vn, {
        key: i.id,
        as: "button",
        "agent-id": i.id,
        label: B(uo)(i.name, i.main),
        class: "phase-agent",
        "data-plan-phase-agent": "",
        onClick: (u) => B(We)(`agents:${i.id}`)
      }, {
        default: P(() => [
          h("span", {
            class: Y(["agent-dot", { held: i.held }])
          }, null, 2),
          E(Wt, {
            name: i.name,
            main: i.main
          }, null, 8, ["name", "main"]),
          h("span", c1, g(i.held ? "Working" : "Queued"), 1)
        ]),
        _: 2
      }, 1032, ["agent-id", "label", "onClick"]))), 128))
    ])) : k("", !0);
  }
}, f1 = /* @__PURE__ */ z(d1, [["__scopeId", "data-v-619caeed"]]), m1 = { class: "phases" }, h1 = { class: "phead" }, p1 = { class: "mark" }, v1 = { class: "ptitle" }, g1 = { class: "phead-end" }, y1 = {
  key: 0,
  class: "checkpoint"
}, b1 = { class: "progress" }, k1 = {
  key: 0,
  class: "when"
}, w1 = {
  __name: "PlanPhases",
  props: { phases: { type: Array, required: !0 }, currentPhase: { type: Number, required: !0 } },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["completed", "cancelled"]), n = (s) => s.tasks.filter((o) => t.has(o.state)).length, a = (s) => s.tasks.length > 0 && n(s) === s.tasks.length;
    return (s, o) => (r(), d("ol", m1, [
      (r(!0), d(L, null, te(e.phases, (l, i) => (r(), d("li", {
        key: l.id,
        class: Y(["phase", { current: i + 1 === e.currentPhase, done: a(l) }]),
        "data-resource-phase": ""
      }, [
        h("div", h1, [
          h("span", p1, [
            E(le, {
              name: a(l) ? "check" : "circle",
              size: 14
            }, null, 8, ["name"])
          ]),
          h("span", v1, g(i + 1) + ". " + g(l.title), 1),
          h("span", g1, [
            l.checkpoint ? (r(), d("span", y1, "checkpoint")) : k("", !0),
            h("span", b1, g(n(l)) + "/" + g(l.tasks.length), 1)
          ])
        ]),
        l.goal ? (r(), d("div", k1, g(l.goal), 1)) : k("", !0),
        E(f1, {
          tasks: l.tasks
        }, null, 8, ["tasks"]),
        (r(!0), d(L, null, te(l.tasks, (u) => ie(s.$slots, "task", { task: u }, void 0, !0, u.id)), 128))
      ], 2))), 128))
    ]));
  }
}, p_ = /* @__PURE__ */ z(w1, [["__scopeId", "data-v-05aaa685"]]), $1 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, x1 = { ...$1, done: "Completed" }, S1 = /* @__PURE__ */ new Set(["completed", "cancelled"]), M1 = (e) => S1.has(e), gn = (e) => M1(e) ? "done" : e, _1 = { class: "task-status-icon" }, C1 = ["width", "height", "aria-label"], E1 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = S(() => Xs("task", gn(t.status))), a = S(() => n.value === "testing" ? "started" : n.value), s = S(() => x1[t.status] ?? hn("task", t.status));
    return (o, l) => (r(), d("span", _1, [
      E(Yt, {
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
            E(Qt, { value: a.value }, {
              blocked: P(() => [...l[0] || (l[0] = [
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
              done: P(() => [...l[1] || (l[1] = [
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
              started: P(() => [...l[2] || (l[2] = [
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
              asked: P(() => [...l[3] || (l[3] = [
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
              paused: P(() => [...l[4] || (l[4] = [
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
              planned: P(() => [...l[5] || (l[5] = [
                h("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: P(() => [...l[6] || (l[6] = [
                h("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, C1))
        ]),
        _: 1
      })
    ]));
  }
}, $a = /* @__PURE__ */ z(E1, [["__scopeId", "data-v-ae24a63f"]]), A1 = {
  class: "timeline",
  "aria-label": "Timeline",
  "data-plan-timeline": ""
}, O1 = {
  key: 0,
  class: "empty",
  role: "alert"
}, T1 = {
  key: 2,
  class: "empty"
}, I1 = { class: "day" }, B1 = { class: "events" }, R1 = { class: "mark" }, L1 = { class: "what" }, N1 = { class: "head" }, q1 = { class: "word" }, D1 = ["title", "onClick"], P1 = { class: "at" }, j1 = {
  __name: "PlanTimeline",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = {
      made: { state: "open", word: "Made" },
      logged: { icon: "edits", word: "Logged" },
      completed: { state: "completed", word: "Finished" },
      cancelled: { state: "cancelled", word: "Cancelled" }
    }, a = e, s = t, o = _(null), l = _(""), i = S(() => {
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
    return he(() => a.id, c, { immediate: !0 }), (f, m) => (r(), d("section", A1, [
      l.value ? (r(), d("p", O1, g(l.value), 1)) : o.value === null ? (r(), j(Je, { key: 1 })) : o.value.length ? k("", !0) : (r(), d("p", T1, "Nothing has happened on this plan's tasks yet.")),
      (r(!0), d(L, null, te(i.value, (p) => (r(), d(L, {
        key: p.day
      }, [
        h("h3", I1, g(p.day), 1),
        h("ol", B1, [
          (r(!0), d(L, null, te(p.items, (y) => (r(), d("li", {
            key: `${y.time}-${y.event_type}-${y.task_id}`,
            class: Y(["event", y.event_type]),
            "data-plan-event": ""
          }, [
            h("span", R1, [
              n[y.event_type].state ? (r(), j($a, {
                key: 0,
                status: n[y.event_type].state
              }, null, 8, ["status"])) : (r(), j(le, {
                key: 1,
                name: n[y.event_type].icon,
                size: 14
              }, null, 8, ["name"]))
            ]),
            h("div", L1, [
              h("div", N1, [
                h("span", q1, g(n[y.event_type].word), 1),
                h("button", {
                  type: "button",
                  class: "task",
                  title: `Open task ${y.task_id}`,
                  onClick: (b) => s("select", y.task_id)
                }, "#" + g(y.task_id) + " " + g(y.title), 9, D1),
                h("span", P1, g(u(y.time)), 1)
              ]),
              y.text ? (r(), j(rt, {
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
}, v_ = /* @__PURE__ */ z(j1, [["__scopeId", "data-v-9e511133"]]), F1 = 1e3;
function Ji() {
  const e = _(Date.now()), t = setInterval(() => e.value = Date.now(), F1);
  return st(() => clearInterval(t)), e;
}
const W1 = Symbol("resource-subscriptions");
function H1() {
  const e = _e(W1, null);
  if (e) return (a, s) => e.follow("resources", a, s);
  const t = _e(Le, null);
  if (t) return (a, s) => t.subscriptions.follow(t.window, a, s);
  const n = new li();
  return (a, s) => n.follow("resources", a, s);
}
function An(e, t, n = () => !0) {
  const a = Vs(t, 100), s = H1()(e, (o) => {
    n(o) && a();
  });
  ya(() => {
    s(), a.cancel();
  });
}
function z1(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const Zi = { compact: "Compaction", clear: "Clear" }, U1 = { stop_limit: "The journal, at the context size", hard_stop: "The journal, at the second context size", person: "A user, in the viewer", auto: "The program", terminal_person: "A user, in the terminal", headless_program: "The journal, before the next job" }, V1 = { requested: "Asked, not started yet", started: "Running", ended: "Ended, size not read yet", measured: "Done", unreduced: "Done, context not smaller", failed: "Failed", abandoned: "Given up" };
function G1(e) {
  return e != null && e.is_open ? `${Zi[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
function K1(e) {
  if (!e) return [];
  const t = [["Last context change", `${Zi[e.change]}: ${V1[e.state]}`], ["Asked by", U1[e.reason]], ["Asked", new Date(e.requested_at).toLocaleString()]];
  return e.request_tokens != null && t.push(["Size at the request", `${e.request_tokens} tokens`]), e.tokens_after != null && t.push(["Size after", `${e.tokens_after} tokens`]), t;
}
const Y1 = "Not known", Q1 = 80, X1 = 1e3, J1 = "worker", Z1 = "main", ev = /* @__PURE__ */ new Set(["waiting", "blocked", "at usage limit"]), tv = (e) => e.ok ? e.value.rows : [], nv = (e, t) => e.ended_at ? "ended" : e.paused_at || ev.has(t == null ? void 0 : t.state) ? "waiting" : "running", er = (e) => ((e == null ? void 0 : e.tasks) ?? []).filter((t) => t.state === "completed").length;
function av({ row: e, facts: t, inspection: n, now: a }) {
  const s = !!e.ended_at, o = ((s ? Date.parse(e.ended_at) : a) - Date.parse(e.process_started_at || e.created_at)) / X1, l = [{ key: "time", label: s ? "Ran for" : "Running for", value: Xi(o) }];
  return Number.isFinite(t == null ? void 0 : t.context_percent) && l.push({ key: "context", label: "Context used", value: `${t.context_percent}%`, meter: t.context_percent, high: t.context_percent > Q1 }), t && l.push({ key: "cost", label: "Cost", value: t.cost_dollars === null ? Y1 : `$${t.cost_dollars.toFixed(2)}` }), e.role === J1 && l.push({ key: "pace", label: "Tasks an hour", value: String(Vp(er(t), e.process_started_at || e.created_at, e.ended_at, a)) }), e.role === Z1 && n.plan && l.push({ key: "done", label: "Tasks done", value: `${n.plan.done} of ${n.plan.total}` }), l.push({ key: "failed", label: "Failed runs", value: String(n.failed_runs), bad: n.failed_runs > 0 }), l;
}
function sv(e) {
  const t = er(e);
  return t ? `Finished ${t} ${t === 1 ? "task" : "tasks"}` : "It finished no task.";
}
function ov(e, t, n = null) {
  const a = [["Number", String(e.number)], ["Session", e.session, "code"], ["Program", e.program], ["Type", e.role]];
  return e.parent_id && a.push(["Parent agent", `Agent ${e.parent_id}`]), a.push(["Started by", t.started_by], ["Started", al(e.created_at)]), e.ended_at && a.push(["Ended", al(e.ended_at)]), e.pid && a.push(["Process", `pid ${e.pid}`]), a.push(...K1(n)), a;
}
const lv = { class: "band" }, iv = { key: 0 }, rv = {
  __name: "ProcessQueueBand",
  props: { icon: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (r(), d("h2", lv, [
      E(le, {
        name: e.icon,
        size: 12
      }, null, 8, ["name"]),
      ie(t.$slots, "default", {}, void 0, !0),
      e.count !== null ? (r(), d("span", iv, g(e.count), 1)) : k("", !0)
    ]));
  }
}, It = /* @__PURE__ */ z(rv, [["__scopeId", "data-v-1758914f"]]), uv = { class: "number" }, cv = { class: "text" }, dv = 150, fv = {
  __name: "AgentBrief",
  props: { label: { type: String, required: !0 }, text: { type: String, required: !0 }, points: { type: Array, default: () => [] } },
  setup(e) {
    const t = e, n = _(!1), a = S(() => t.text.length > dv), s = (o) => o.proof ? `${o.proof.state.slice(0, 1).toUpperCase()}${o.proof.state.slice(1)}: ${o.proof.text}` : "No proof yet";
    return (o, l) => (r(), d(L, null, [
      e.text ? (r(), d(L, { key: 0 }, [
        E(It, { icon: "file" }, {
          default: P(() => [
            U(g(e.label), 1)
          ]),
          _: 1
        }),
        h("div", {
          class: Y(["brief", { clamp: !n.value }]),
          "data-agent-brief": ""
        }, g(e.text), 3),
        a.value && !n.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          "data-agent-brief-more": "",
          onClick: l[0] || (l[0] = (i) => n.value = !0)
        }, "Show all")) : k("", !0)
      ], 64)) : k("", !0),
      e.points.length ? (r(), d(L, { key: 1 }, [
        E(It, { icon: "points" }, {
          default: P(() => [...l[1] || (l[1] = [
            U("Points to prove", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(L, null, te(e.points, (i) => {
          var u;
          return r(), d("p", {
            key: i.id,
            class: "point",
            "data-agent-point": ""
          }, [
            h("span", uv, g(i.id), 1),
            h("span", cv, [
              U(g(i.text), 1),
              h("span", {
                class: Y(["proof", { checked: ((u = i.proof) == null ? void 0 : u.state) === "checked" }])
              }, g(s(i)), 3)
            ])
          ]);
        }), 128))
      ], 64)) : k("", !0)
    ], 64));
  }
}, mv = /* @__PURE__ */ z(fv, [["__scopeId", "data-v-c99de22c"]]), hv = ["aria-expanded"], pv = { class: "count" }, vv = {
  key: 0,
  "data-agent-fold-body": ""
}, gv = {
  __name: "AgentFold",
  props: /* @__PURE__ */ zt({ icon: { type: String, required: !0 }, label: { type: String, required: !0 }, count: { type: Number, required: !0 } }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const t = fn(e, "open");
    return (n, a) => (r(), d(L, null, [
      h("button", {
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
        U(g(e.label), 1),
        h("span", pv, g(e.count), 1),
        E(le, {
          class: "arrow",
          name: "caret",
          size: 11
        })
      ], 10, hv),
      t.value ? (r(), d("div", vv, [
        ie(n.$slots, "default", {}, void 0, !0)
      ])) : k("", !0)
    ], 64));
  }
}, Fa = /* @__PURE__ */ z(gv, [["__scopeId", "data-v-7f93d8d9"]]), yv = ["onClick"], bv = { class: "text" }, kv = { class: "aside" }, wv = {
  key: 0,
  class: "none"
}, $v = {
  class: "skills",
  "data-agent-skills": ""
}, xv = {
  key: 0,
  class: "none-inline"
}, Sv = { class: "label" }, Mv = {
  __name: "AgentFolds",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, counts: { type: Object, required: !0 }, loads: { type: Number, required: !0 }, details: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = Kt({ helpers: !1, skills: !1 }), a = _([]), s = _([]), o = async (l) => tv(await t.read(l));
    return he(() => [n.helpers, t.loads], async ([l]) => {
      l && (a.value = await o(["agent", "list", "--parent", String(t.id)]));
    }), he(() => [n.skills, t.loads], async ([l]) => {
      l && (s.value = await o(["agent-skill", "list", "--agent", String(t.id), "--state", "loaded"]));
    }), (l, i) => (r(), d(L, null, [
      E(Fa, {
        open: n.helpers,
        "onUpdate:open": i[0] || (i[0] = (u) => n.helpers = u),
        icon: "bot",
        label: "Helpers",
        count: e.counts.helpers
      }, {
        default: P(() => [
          (r(!0), d(L, null, te(a.value, (u) => (r(), d("button", {
            key: u.id,
            type: "button",
            class: "row",
            "data-agent-helper": "",
            onClick: (c) => B(wt)("agents", u.id)
          }, [
            h("span", bv, g(B(Vt)(u).title), 1),
            h("span", kv, g(B(Vt)(u).subtext), 1)
          ], 8, yv))), 128)),
          a.value.length ? k("", !0) : (r(), d("p", wv, "It started no helpers."))
        ]),
        _: 1
      }, 8, ["open", "count"]),
      E(Fa, {
        open: n.skills,
        "onUpdate:open": i[1] || (i[1] = (u) => n.skills = u),
        icon: "style",
        label: "Skills loaded",
        count: e.counts.skills
      }, {
        default: P(() => [
          h("p", $v, [
            (r(!0), d(L, null, te(s.value, (u) => (r(), d("span", {
              key: u.id,
              "data-agent-skill": ""
            }, g(u.skill), 1))), 128)),
            s.value.length ? k("", !0) : (r(), d("span", xv, "It loaded no skills."))
          ])
        ]),
        _: 1
      }, 8, ["open", "count"]),
      E(Fa, {
        icon: "rules",
        label: "Details",
        count: e.details.length
      }, {
        default: P(() => [
          (r(!0), d(L, null, te(e.details, ([u, c, f]) => (r(), d("div", {
            key: u,
            class: "detail",
            "data-agent-detail": ""
          }, [
            h("span", Sv, g(u) + ":", 1),
            h("span", {
              class: Y(["value", f])
            }, g(c), 3)
          ]))), 128))
        ]),
        _: 1
      }, 8, ["count"])
    ], 64));
  }
}, _v = /* @__PURE__ */ z(Mv, [["__scopeId", "data-v-1281605f"]]), Cv = ["datetime", "title"], at = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Ji(), a = S(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (r(), d("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, g(B(En)(e.at, B(n))), 9, Cv));
  }
}, Ev = {
  class: "now",
  "data-agent-now": ""
}, Av = {
  key: 1,
  class: "muted"
}, Ov = {
  key: 2,
  class: "detail",
  "data-agent-doing": ""
}, Tv = {
  key: 3,
  class: "detail",
  "data-agent-last-activity": ""
}, Iv = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, Bv = { class: "line" }, Rv = { class: "detail" }, Lv = { class: "bar" }, Nv = {
  __name: "AgentNow",
  props: { inspection: { type: Object, required: !0 }, tool: { type: Object, default: () => ({}) }, nothing: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = S(() => t.tool.tool ? `Command: ${t.tool.tool}` : t.tool.thinking ? "Thinking" : t.tool.wait_target ? `Waiting: ${t.tool.wait_target}` : ""), a = S(() => {
      var s;
      return (s = t.inspection.plan) != null && s.total ? Math.round(t.inspection.plan.done / t.inspection.plan.total * 100) : 0;
    });
    return (s, o) => (r(), d(L, null, [
      E(It, { icon: "play" }, {
        default: P(() => [...o[2] || (o[2] = [
          U("Doing now", -1)
        ])]),
        _: 1
      }),
      h("div", Ev, [
        e.inspection.task ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "link",
          "data-agent-task-link": "",
          onClick: o[0] || (o[0] = (l) => B(wt)("tasks", e.inspection.task.id))
        }, "Task " + g(e.inspection.task.id) + ": " + g(e.inspection.task.title), 1)) : (r(), d("span", Av, g(e.nothing), 1)),
        n.value ? (r(), d("span", Ov, g(n.value), 1)) : k("", !0),
        e.inspection.last_activity ? (r(), d("span", Tv, [
          o[3] || (o[3] = U("Seen: ", -1)),
          E(at, {
            at: e.inspection.last_activity
          }, null, 8, ["at"])
        ])) : k("", !0)
      ]),
      e.inspection.plan ? (r(), d("div", Iv, [
        h("div", Bv, [
          h("span", null, "Plan " + g(e.inspection.plan.id) + ", phase " + g(e.inspection.plan.phase), 1),
          h("button", {
            type: "button",
            class: "link",
            "data-agent-plan-link": "",
            onClick: o[1] || (o[1] = (l) => B(wt)("plans", e.inspection.plan.id))
          }, "Show the plan")
        ]),
        h("span", Rv, g(e.inspection.plan.done) + " of " + g(e.inspection.plan.total) + " tasks done", 1),
        h("div", Lv, [
          h("i", {
            style: ge({ width: `${a.value}%` })
          }, null, 4)
        ])
      ])) : k("", !0)
    ], 64));
  }
}, qv = /* @__PURE__ */ z(Nv, [["__scopeId", "data-v-ff25c609"]]), Dv = ["onClick"], Pv = { class: "text" }, jv = {
  key: 1,
  class: "move",
  "data-agent-move": ""
}, Fv = { class: "text" }, Wv = {
  key: 0,
  class: "none",
  "data-agent-no-moves": ""
}, Hv = {
  __name: "AgentRecent",
  props: { moves: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d(L, null, [
      E(It, { icon: "clock" }, {
        default: P(() => [...n[0] || (n[0] = [
          U("Recent", -1)
        ])]),
        _: 1
      }),
      (r(!0), d(L, null, te(e.moves, (a) => (r(), d(L, {
        key: `${a.time}:${a.text}`
      }, [
        a.table ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "move",
          "data-agent-move": "",
          onClick: (s) => B(wt)(a.table, a.id)
        }, [
          h("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          h("span", Pv, g(a.text), 1),
          E(at, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ], 8, Dv)) : (r(), d("div", jv, [
          h("i", {
            class: Y(["dot", a.tone])
          }, null, 2),
          h("span", Fv, g(a.text), 1),
          E(at, {
            class: "when",
            at: a.time
          }, null, 8, ["at"])
        ]))
      ], 64))), 128)),
      e.moves.length ? k("", !0) : (r(), d("p", Wv, "Nothing yet."))
    ], 64));
  }
}, zv = /* @__PURE__ */ z(Hv, [["__scopeId", "data-v-58f0db57"]]), Uv = {
  class: "strip",
  "data-agent-strip": ""
}, Vv = ["data-agent-cell"], Gv = {
  key: 0,
  class: "meter"
}, Kv = {
  __name: "AgentStrip",
  props: { cells: { type: Array, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", Uv, [
      (r(!0), d(L, null, te(e.cells, (a) => (r(), d("div", {
        key: a.key,
        class: "cell",
        "data-agent-cell": a.key
      }, [
        h("small", null, g(a.label), 1),
        h("b", {
          class: Y({ bad: a.bad })
        }, g(a.value), 3),
        a.meter !== void 0 ? (r(), d("div", Gv, [
          h("i", {
            class: Y({ high: a.high }),
            style: ge({ width: `${a.meter}%` })
          }, null, 6)
        ])) : k("", !0)
      ], 8, Vv))), 128))
    ]));
  }
}, Yv = /* @__PURE__ */ z(Kv, [["__scopeId", "data-v-b6657ab7"]]), Qv = {}, Xv = { class: "menu-label" };
function Jv(e, t) {
  return r(), d("span", Xv, [
    ie(e.$slots, "default", {}, void 0, !0)
  ]);
}
const bt = /* @__PURE__ */ z(Qv, [["render", Jv], ["__scopeId", "data-v-aa955b3e"]]), Zv = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, eg = {
  key: 0,
  class: "skills-none"
}, tg = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => n.skills.filter((l) => l.state === "loaded")), o = S(() => n.skills.filter((l) => l.state !== "loaded"));
    return (l, i) => (r(), d("div", Zv, [
      E(bt, null, {
        default: P(() => [...i[1] || (i[1] = [
          U("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      s.value.length ? k("", !0) : (r(), d("p", eg, "None yet. Compacting the conversation empties this list.")),
      (r(!0), d(L, null, te(s.value, (u) => (r(), d("p", {
        key: u.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        E(le, {
          name: "book",
          size: 12
        }),
        U(g(u.skill), 1)
      ]))), 128)),
      o.value.length ? (r(), d(L, { key: 1 }, [
        E(bt, null, {
          default: P(() => [...i[2] || (i[2] = [
            U("Still to read", -1)
          ])]),
          _: 1
        }),
        (r(!0), d(L, null, te(o.value, (u) => (r(), d("p", {
          key: u.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          E(le, {
            name: "book",
            size: 12
          }),
          U(g(u.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      E(He, {
        "data-agent-skills-browse": "",
        onClick: i[0] || (i[0] = (u) => a("browse"))
      }, {
        default: P(() => [...i[3] || (i[3] = [
          U("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, ng = /* @__PURE__ */ z(tg, [["__scopeId", "data-v-be514d47"]]), ag = ["disabled", "title"], sg = { class: "gauge usage" }, og = {
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
      onClick: f[0] || (f[0] = (m) => a("open", m.currentTarget))
    }, [
      E(le, {
        name: "allowance",
        size: 12
      }),
      f[1] || (f[1] = U()),
      h("span", sg, [
        h("span", {
          style: ge({ width: `${o.value}%` })
        }, null, 4)
      ]),
      U(" " + g(l.value ? "At usage limit" : `${o.value}%`), 1)
    ], 8, ag)) : k("", !0);
  }
}, lg = /* @__PURE__ */ z(og, [["__scopeId", "data-v-a36f09dc"]]), ig = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: Y(B(Ki)(e.tone))
    }, g(e.text), 3));
  }
}, co = /* @__PURE__ */ z(ig, [["__scopeId", "data-v-b7a33f3d"]]);
function rg(e, t, n, { groups: a, programs: s }) {
  const o = _({}), l = _(""), i = _(!1), u = S(() => !!e.value && !e.value.ended_at), c = S(() => u.value && !!e.value.paused_at);
  async function f(b, x = null) {
    l.value = "";
    const C = await Xl(x, b, t);
    return l.value = C.ok ? "" : C.error, n(), C;
  }
  return { groups: a, programs: s, chosen: o, failure: l, asking: i, running: u, paused: c, choose: (b, x) => f(["agent", "control", String(e.value.number), b, x.value], { target: o, fields: { value: { ...o.value, [b]: x.label } } }), stop: () => (i.value = !1, f(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (b) => f(["agent", "launch", b.name]) };
}
const ug = ["disabled", "title"], cg = ["disabled", "title"], dg = { class: "gauge" }, fg = {
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, mg = ["disabled", "title"], hg = ["disabled"], pg = ["disabled"], vg = {
  key: 5,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, gg = ["title"], yg = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, bg = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, kg = { class: "gauge" }, wg = { class: "context-used" }, $g = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, xg = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, Sg = 75, Mg = {
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
    const n = e, a = t, s = rg(Aa(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: Aa(n, "controlGroups"), programs: Aa(n, "agentPrograms") }), o = _(null), l = _(""), i = S(() => s.groups.value.find((q) => q.key === l.value));
    function u(q, A) {
      o.value = q.currentTarget, l.value = A;
    }
    function c() {
      o.value = null, l.value = "", s.asking.value = !1;
    }
    const f = S(() => n.skills.filter((q) => q.state === "loaded"));
    function m(q) {
      u(q, "skills"), a("skills");
    }
    const p = (q) => s.groups.value.some((A) => A.key === q), y = S(() => {
      var q;
      return s.chosen.value.model ?? ((q = x.value) == null ? void 0 : q.model) ?? "";
    }), b = S(() => {
      var q;
      return s.chosen.value.effort ?? ((q = x.value) == null ? void 0 : q.effort) ?? "";
    });
    S(() => !!n.agent && !n.agent.ended_at);
    const x = S(() => {
      var q;
      return ((q = n.usage.agents) == null ? void 0 : q.find((A) => {
        var N;
        return A.id === ((N = n.agent) == null ? void 0 : N.id);
      })) ?? null;
    }), C = S(() => {
      var q;
      return ((q = x.value) == null ? void 0 : q.context_percent) == null ? null : Math.round(x.value.context_percent);
    }), M = S(() => {
      var q;
      return G1(((q = x.value) == null ? void 0 : q.context_change) ?? null);
    }), T = (q) => `${Math.round(q / 1e3)}k`, H = S(() => {
      var q;
      return !!((q = x.value) != null && q.context_limit_tokens);
    }), W = S(() => {
      var q, A;
      return ((q = x.value) == null ? void 0 : q.context_limit_tokens) || ((A = x.value) == null ? void 0 : A.context_window_tokens) || 0;
    }), I = S(() => W.value ? `${T(x.value.context_tokens ?? 0)} of ${T(W.value)}` : ""), G = S(() => {
      var q;
      return (q = x.value) != null && q.cost_dollars ? `$${x.value.cost_dollars.toFixed(2)}` : "";
    });
    return (q, A) => {
      var N, D;
      return r(), d("div", {
        class: Y(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (r(), d(L, { key: 0 }, [
          h("button", {
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
            U(" " + g(((N = e.agentPrograms.find((w) => w.name === e.agent.program)) == null ? void 0 : N.title) || e.agent.program), 1)
          ], 8, ug),
          E(lg, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: A[1] || (A[1] = (w) => a("open", "usage", w))
          }, null, 8, ["windows", "disabled"]),
          C.value !== null ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${C.value}% full: clear or compact it`,
            onClick: A[2] || (A[2] = (w) => p("context") ? u(w, "context") : a("open", "context", w.currentTarget))
          }, [
            E(le, {
              name: "gauge",
              size: 12
            }),
            A[14] || (A[14] = U()),
            h("span", dg, [
              h("span", {
                style: ge({ width: `${C.value}%` })
              }, null, 4)
            ]),
            U(" " + g(C.value) + "% ", 1)
          ], 8, cg)) : (D = x.value) != null && D.context_unknown ? (r(), d("span", fg, [
            E(le, {
              name: "gauge",
              size: 12
            }),
            A[15] || (A[15] = U(" Context: unknown", -1))
          ])) : k("", !0),
          y.value ? (r(), d("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${y.value}: change the model`,
            onClick: A[3] || (A[3] = (w) => p("model") ? u(w, "model") : null)
          }, [
            E(le, {
              name: "model",
              size: 12
            }),
            U(" " + g(y.value), 1)
          ], 8, mg)) : k("", !0),
          p("effort") || e.card && b.value ? (r(), d("button", {
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
            U(" " + g(b.value), 1)
          ], 8, hg)) : k("", !0),
          G.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: A[5] || (A[5] = (w) => a("open", "cost", w.currentTarget))
          }, g(G.value), 9, pg)) : k("", !0),
          e.branch ? (r(), d("span", vg, [
            E(le, {
              name: "branch",
              size: 12
            }),
            U(" " + g(e.branch), 1)
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
            U(" " + g(e.jobs), 1)
          ], 2)),
          e.run ? (r(), d("button", {
            key: 7,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: m
          }, [
            E(le, {
              name: "book",
              size: 12
            }),
            U(" " + g(f.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (r(), d(L, { key: 8 }, [
            h("button", {
              type: "button",
              class: Y(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Sg }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: A[7] || (A[7] = (w) => a("open", "fitness", w.currentTarget))
            }, [
              E(le, {
                name: "heart",
                size: 12
              }),
              U(" " + g(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            h("button", {
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
              U(" " + g(e.fitness.workload), 1)
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
          A[16] || (A[16] = U(" Start an agent", -1))
        ])) : k("", !0),
        A[22] || (A[22] = h("span", { class: "space" }, null, -1)),
        B(s).failure.value ? (r(), d("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: B(s).failure.value
        }, g(B(s).failure.value), 9, gg)) : k("", !0),
        ie(q.$slots, "default", {}, void 0, !0),
        o.value ? (r(), j(Xt, {
          key: 3,
          anchor: o.value,
          "min-width": 190,
          onClose: c
        }, {
          default: P(() => {
            var w;
            return [
              l.value === "agent" ? (r(), d(L, { key: 0 }, [
                B(s).asking.value ? (r(), d(L, { key: 0 }, [
                  E(bt, { "data-agent-stop-ask": "" }, {
                    default: P(() => [...A[17] || (A[17] = [
                      U("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  E(He, {
                    "data-agent-stop-confirm": "",
                    onClick: A[10] || (A[10] = (v) => (c(), B(s).stop()))
                  }, {
                    default: P(() => [...A[18] || (A[18] = [
                      U("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  E(He, {
                    onClick: A[11] || (A[11] = (v) => B(s).asking.value = !1)
                  }, {
                    default: P(() => [...A[19] || (A[19] = [
                      U("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (r(), j(He, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: A[12] || (A[12] = (v) => B(s).asking.value = !0)
                }, {
                  default: P(() => [...A[20] || (A[20] = [
                    U("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : l.value === "start" ? (r(), d(L, { key: 1 }, [
                E(bt, null, {
                  default: P(() => [...A[21] || (A[21] = [
                    U("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (r(!0), d(L, null, te(B(s).programs.value, (v) => (r(), j(He, {
                  key: v.name,
                  "data-agent-program": v.name,
                  onClick: ($) => (c(), B(s).start(v))
                }, {
                  default: P(() => [
                    U(g(v.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : l.value === "skills" ? (r(), j(ng, {
                key: 2,
                skills: e.skills,
                onBrowse: A[13] || (A[13] = (v) => (c(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : i.value ? (r(), d(L, { key: 3 }, [
                E(bt, null, {
                  default: P(() => [
                    U(g(i.value.label), 1)
                  ]),
                  _: 1
                }),
                l.value === "context" ? (r(), d(L, { key: 0 }, [
                  h("p", yg, g(B(z1)(((w = x.value) == null ? void 0 : w.last_compaction) ?? null)), 1),
                  h("div", bg, [
                    h("span", kg, [
                      h("span", {
                        style: ge({ width: `${C.value}%` })
                      }, null, 4)
                    ]),
                    h("span", wg, g(C.value) + "%", 1)
                  ]),
                  I.value ? (r(), d("p", $g, [
                    U(g(I.value) + " ", 1),
                    H.value ? (r(), j(co, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : k("", !0)
                  ])) : k("", !0)
                ], 64)) : k("", !0),
                l.value === "context" && M.value ? (r(), d("p", xg, g(M.value), 1)) : (r(!0), d(L, { key: 2 }, te(i.value.choices, (v) => (r(), j(He, {
                  key: v.value,
                  "data-agent-choice": v.value,
                  onClick: ($) => (B(s).choose(i.value.key, v), c())
                }, {
                  default: P(() => [
                    U(g(v.label), 1)
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
}, _g = /* @__PURE__ */ z(Mg, [["__scopeId", "data-v-d7113347"]]), Cg = {
  class: "who",
  "data-agent-who": ""
}, Eg = { class: "name" }, Ag = ["data-agent-state"], Og = {
  class: "sub",
  "data-agent-started-by": ""
}, Tg = {
  __name: "AgentWho",
  props: { name: { type: String, required: !0 }, state: { type: String, required: !0 }, startedBy: { type: String, required: !0 }, agent: { type: Object, required: !0 }, programs: { type: Array, default: () => [] }, usage: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", Cg, [
      h("h2", Eg, [
        h("i", {
          class: Y(["dot", e.state]),
          "data-agent-state": e.state
        }, null, 10, Ag),
        U(g(e.name), 1)
      ]),
      E(_g, {
        class: "bar",
        agent: e.agent,
        "agent-programs": e.programs,
        usage: e.usage,
        card: ""
      }, null, 8, ["agent", "agent-programs", "usage"]),
      h("p", Og, "Started by: " + g(e.startedBy), 1)
    ]));
  }
}, Ig = /* @__PURE__ */ z(Tg, [["__scopeId", "data-v-83bd4a9d"]]), Bg = {
  class: "agent-inspector",
  "data-agent-inspector": ""
}, Rg = { class: "scroll" }, Lg = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Ng = {
  key: 0,
  class: "ended",
  "data-agent-ended": ""
}, qg = {
  __name: "AgentDetail",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, environment: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Ji(), a = _(null), s = _(null), o = _(null), l = _(null), i = _({}), u = _({ helpers: 0, skills: 0 }), c = _(0), f = _([]), m = _([]), p = _("");
    let y = 0;
    const b = S(() => {
      var T;
      return a.value.ended_at ? sv(s.value) : `It has no task.${(T = s.value) != null && T.instruction ? " It was given an instruction." : ""}`;
    });
    async function x() {
      const T = ++y, H = await t.read(["usage", "inspector", Yi(t.id), "--environment", t.environment]);
      T === y && (p.value = H.ok ? "" : H.error, H.ok && (a.value = H.value.agent, s.value = H.value.facts, o.value = H.value.inspection, l.value = H.value.compaction ?? null, i.value = H.value.tool, u.value = { helpers: H.value.helpers, skills: H.value.skills }, f.value = H.value.points, m.value = H.value.programs, c.value += 1));
    }
    const C = S(() => /* @__PURE__ */ new Set([t.id])), M = {
      agent: (T) => ii(T, C.value),
      hook_call: (T) => Rc(T, "session_agent_id", C.value)
    };
    return An(["agent.*", "task.*", "process.*", "plan.*", "hook_call.*"], x, (T) => {
      var H;
      return ((H = M[T.event.split(".")[0]]) == null ? void 0 : H.call(M, T)) ?? !0;
    }), Ce(x), (T, H) => {
      var W, I;
      return r(), d("article", Bg, [
        h("div", Rg, [
          p.value ? (r(), d("p", Lg, g(p.value), 1)) : a.value && o.value ? (r(), d(L, { key: 1 }, [
            E(Ig, {
              name: B(Vt)(a.value, s.value).text,
              state: B(nv)(a.value, s.value),
              "started-by": o.value.started_by,
              agent: a.value,
              programs: m.value,
              usage: { agents: s.value ? [s.value] : [], windows: ((W = s.value) == null ? void 0 : W.windows) ?? [] }
            }, null, 8, ["name", "state", "started-by", "agent", "programs", "usage"]),
            E(Yv, {
              cells: B(av)({ row: a.value, facts: s.value, inspection: o.value, now: B(n) })
            }, null, 8, ["cells"]),
            E(qv, {
              inspection: o.value,
              tool: i.value,
              nothing: b.value
            }, null, 8, ["inspection", "tool", "nothing"]),
            E(mv, {
              label: a.value.access === "read-only" ? "Instruction" : "Brief",
              text: ((I = s.value) == null ? void 0 : I.instruction) ?? "",
              points: f.value
            }, null, 8, ["label", "text", "points"]),
            E(zv, {
              moves: o.value.recent
            }, null, 8, ["moves"]),
            E(_v, {
              id: e.id,
              read: e.read,
              counts: u.value,
              loads: c.value,
              details: B(ov)(a.value, o.value, l.value)
            }, null, 8, ["id", "read", "counts", "loads", "details"]),
            a.value.ended_at ? (r(), d("p", Ng, "Ended " + g(B(En)(a.value.ended_at, B(n))) + ". It takes no more actions.", 1)) : k("", !0)
          ], 64)) : (r(), j(Je, { key: 2 }))
        ])
      ]);
    };
  }
}, g_ = /* @__PURE__ */ z(qg, [["__scopeId", "data-v-b88512f5"]]);
function Dg(e) {
  const t = _(null), n = new ResizeObserver(() => t.value = e.value.offsetWidth);
  return Ce(() => {
    t.value = e.value.offsetWidth, n.observe(e.value);
  }), st(() => n.disconnect()), t;
}
const Pg = ["data-comment-id"], jg = {
  key: 0,
  class: "comment-top"
}, Fg = { class: "comment-mark" }, Wg = {
  class: "comment-body",
  "data-comment": ""
}, Hg = { class: "comment-foot" }, zg = {
  key: 1,
  "data-comment-lost": ""
}, Ug = {
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
      e.comment.quote ? (r(), d("div", jg, [
        h("span", Fg, g(e.comment.number), 1),
        h("span", {
          class: Y(["comment-quote", { mono: n() }]),
          "data-comment-quote": ""
        }, g(e.comment.quote), 3)
      ])) : k("", !0),
      h("p", Wg, g(e.comment.body), 1),
      h("div", Hg, [
        e.comment.created_at ? (r(), j(at, {
          key: 0,
          at: e.comment.created_at
        }, null, 8, ["at"])) : k("", !0),
        e.lost ? (r(), d("span", zg, "The text has changed here")) : e.comment.quote ? (r(), d("button", {
          key: 2,
          type: "button",
          class: "comment-show",
          "data-comment-show": "",
          onClick: s[0] || (s[0] = (o) => a.$emit("show"))
        }, "Show in the text")) : k("", !0)
      ])
    ], 10, Pg));
  }
}, tr = /* @__PURE__ */ z(Ug, [["__scopeId", "data-v-a37d4507"]]);
var Vl;
/Mac|iPhone|iPad/.test(((Vl = navigator.userAgentData) == null ? void 0 : Vl.platform) || navigator.platform);
function nr(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const Vg = {
  class: "comment-box",
  "data-comment-box": ""
}, Gg = {
  key: 0,
  class: "comment-on",
  "data-comment-on": ""
}, Kg = {
  key: 1,
  class: "comment-failure",
  role: "alert"
}, Yg = { class: "comment-row" }, Qg = ["placeholder"], Xg = {
  __name: "CommentComposer",
  props: /* @__PURE__ */ zt({ selection: { type: Object, default: null }, send: { type: Function, required: !0 }, narrow: Boolean }, {
    draft: { type: String, default: "" },
    draftModifiers: {}
  }),
  emits: /* @__PURE__ */ zt(["clear"], ["update:draft"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = fn(e, "draft"), l = _(""), i = _(!1), u = _(null), c = S(() => {
      var y;
      return ((y = a.selection) == null ? void 0 : y.selection_type) === "code";
    }), f = S(() => a.narrow ? "Write a comment" : "Write a comment, or select text to comment on a selection");
    function m() {
      u.value.style.height = "auto", u.value.style.height = `${u.value.scrollHeight + 2}px`;
    }
    async function p() {
      const y = o.value.trim();
      if (!(!y || i.value)) {
        l.value = "", i.value = !0;
        try {
          await a.send(y), o.value = "", await je(), m();
        } catch (b) {
          l.value = b.message;
        } finally {
          i.value = !1;
        }
      }
    }
    return t({ focus: () => u.value.focus() }), (y, b) => (r(), d("div", Vg, [
      e.selection ? (r(), d("div", Gg, [
        b[3] || (b[3] = h("span", { class: "comment-on-label" }, "On this selection", -1)),
        h("span", {
          class: Y(["comment-on-words", { mono: c.value }])
        }, g(e.selection.quote), 3),
        E(ba, {
          title: "Comment on the whole document instead",
          onClick: b[0] || (b[0] = (x) => s("clear"))
        })
      ])) : k("", !0),
      l.value ? (r(), d("p", Kg, g(l.value), 1)) : k("", !0),
      h("div", Yg, [
        Me(h("textarea", {
          ref_key: "box",
          ref: u,
          "onUpdate:modelValue": b[1] || (b[1] = (x) => o.value = x),
          rows: "1",
          maxlength: "2000",
          class: Y({ on: o.value }),
          placeholder: f.value,
          "aria-label": "Write a comment",
          "data-comment-input": "",
          onInput: m,
          onKeydown: b[2] || (b[2] = At((x) => B(nr)(x, p), ["enter"]))
        }, null, 42, Qg), [
          [Ke, o.value]
        ]),
        E(ve, {
          variant: "primary",
          busy: i.value,
          disabled: !o.value.trim(),
          "data-comment-send": "",
          onClick: p
        }, {
          default: P(() => [...b[4] || (b[4] = [
            U("Comment", -1)
          ])]),
          _: 1
        }, 8, ["busy", "disabled"])
      ])
    ]));
  }
}, Jg = /* @__PURE__ */ z(Xg, [["__scopeId", "data-v-41d2081c"]]), Wn = (e) => e ? e.split(", ") : [];
function Zg({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function ey(e, t) {
  return {
    reads: Wn(e.reads_allowed),
    runs: Wn(e.runs_allowed),
    missing: [...Wn(e.reads_missing), ...Wn(e.runs_missing)],
    ask: t
  };
}
const ty = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const i = $u("SkeletonParts", !0);
      return r(!0), d(L, null, te(e.parts, (u, c) => (r(), d(L, { key: c }, [
        (r(!0), d(L, null, te(u.count, (f) => (r(), j(Qt, {
          key: f,
          value: u.shape
        }, {
          line: P(() => [
            E(on, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ge({ width: u.width, height: `${t[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: P(() => [
            E(on, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ge({ width: `${n[u.size]}px`, height: `${n[u.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: P(() => [
            E(on, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ge({ width: u.width, height: `${u.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: P(() => [...l[0] || (l[0] = [
            h("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: P(() => [
            h("div", {
              class: "skeleton-row",
              style: ge(a(u))
            }, [
              E(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: P(() => [
            h("div", {
              class: "skeleton-stack",
              style: ge(a(u))
            }, [
              E(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: P(() => [
            h("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ge(a(u))
            }, [
              E(i, {
                parts: u.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: P(() => [
            h("div", {
              class: "skeleton-grid",
              style: ge(s(u))
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
}), ny = /* @__PURE__ */ z(ty, [["__scopeId", "data-v-fa8baeaf"]]), ay = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, sy = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (r(), d("div", ay, [
      E(ny, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, fo = /* @__PURE__ */ z(sy, [["__scopeId", "data-v-52f66b64"]]), ar = {
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
}, oy = { class: "bars" }, ly = { class: "bar-name" }, iy = { class: "bar-value" }, ry = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = S(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, i) => (r(), d("div", oy, [
      (r(!0), d(L, null, te(e.items, (u, c) => (r(), j(Qe(u.open ? "button" : "div"), {
        key: `${c}-${u.label}`,
        type: u.open ? "button" : void 0,
        class: Y(["bar-row", u.tone, { opens: u.open }]),
        onClick: (f) => u.open && a("open", u.open)
      }, {
        default: P(() => [
          h("span", ly, g(u.label), 1),
          E(Bi, {
            value: Number(u.value) || 0,
            max: s.value,
            tone: u.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          h("span", iy, g(u.value) + g(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, uy = /* @__PURE__ */ z(ry, [["__scopeId", "data-v-663427f4"]]), cy = { class: "bars" }, dy = {
  key: 0,
  class: "bars-title"
}, fy = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", cy, [
      e.node.title ? (r(), d("span", dy, g(e.node.title), 1)) : k("", !0),
      E(uy, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, my = /* @__PURE__ */ z(fy, [["__scopeId", "data-v-7135bb11"]]), hy = {
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
      style: ge(o.value)
    }, [
      (r(!0), d(L, null, te(e.node.children || [], (u, c) => (r(), j(or, {
        key: c,
        node: u,
        onOpen: i[0] || (i[0] = (f) => s("open", f)),
        onFile: i[1] || (i[1] = (f) => s("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, sr = /* @__PURE__ */ z(hy, [["__scopeId", "data-v-d142a3f4"]]), py = {
  key: 0,
  class: "card-head"
}, vy = { class: "card-title" }, gy = {
  key: 0,
  class: "card-note"
}, yy = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", {
      class: Y(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (r(), d("header", py, [
        h("span", vy, g(e.node.title), 1),
        e.node.note ? (r(), d("span", gy, g(e.node.note), 1)) : k("", !0)
      ])) : k("", !0),
      E(sr, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, by = /* @__PURE__ */ z(yy, [["__scopeId", "data-v-67b72d40"]]), ky = { class: "fact" }, wy = { class: "fact-label" }, $y = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", ky, [
      h("span", wy, g(e.label), 1),
      E(rt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, xy = /* @__PURE__ */ z($y, [["__scopeId", "data-v-3a88ecf8"]]), Sy = { class: "list" }, My = { class: "list-label" }, _y = {
  key: 1,
  class: "list-note"
}, Cy = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", Sy, [
      (r(!0), d(L, null, te(e.items, (o, l) => (r(), j(Qe(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Y(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: P(() => [
          h("span", My, g(o.label), 1),
          o.badge ? (r(), j(co, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : k("", !0),
          o.note ? (r(), d("span", _y, g(o.note), 1)) : k("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Ey = /* @__PURE__ */ z(Cy, [["__scopeId", "data-v-ebe2ae0a"]]), Ay = { class: "table" }, Oy = {
  key: 0,
  class: "table-row empty"
}, Ty = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (r(), d("div", Ay, [
      h("div", {
        class: "table-row head",
        style: ge(s.value)
      }, [
        (r(!0), d(L, null, te(e.columns, (i) => (r(), d("span", {
          key: i,
          class: "cell"
        }, g(i), 1))), 128))
      ], 4),
      (r(!0), d(L, null, te(e.rows, (i, u) => (r(), j(Qe(i.open ? "button" : "div"), {
        key: u,
        type: i.open ? "button" : void 0,
        class: Y(["table-row", i.tone, { opens: i.open }]),
        style: ge(s.value),
        onClick: (c) => i.open && a("open", i.open)
      }, {
        default: P(() => [
          (r(!0), d(L, null, te(i.cells, (c, f) => (r(), d("span", {
            key: f,
            class: "cell"
          }, g(c), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (r(), d("div", Oy, g(e.empty), 1)) : k("", !0)
    ]));
  }
}, Iy = /* @__PURE__ */ z(Ty, [["__scopeId", "data-v-9326a52e"]]), By = { class: "stat-value" }, Ry = { class: "stat-label" }, Ly = {
  key: 0,
  class: "stat-note"
}, Ny = {
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
    return (a, s) => (r(), j(Qe(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Y(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: P(() => [
        h("span", By, g(e.value), 1),
        h("span", Ry, g(e.label), 1),
        e.note ? (r(), d("span", Ly, g(e.note), 1)) : k("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, qy = /* @__PURE__ */ z(Ny, [["__scopeId", "data-v-ad0db6d6"]]), Dy = { class: "code" }, Py = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = e, a = ["stack", "row", "grid"], s = S(() => a.includes(n.node.type) ? "group" : n.node.type), o = t, l = (u) => o("open", u), i = (u) => o("file", u);
    return (u, c) => (r(), j(Qt, { value: s.value }, {
      group: P(() => [
        E(sr, {
          node: e.node,
          onOpen: l,
          onFile: i
        }, null, 8, ["node"])
      ]),
      card: P(() => [
        E(by, {
          node: e.node,
          onOpen: l,
          onFile: i
        }, null, 8, ["node"])
      ]),
      heading: P(() => [
        h("h3", {
          class: Y(["heading", `level-${e.node.level || 2}`])
        }, g(e.node.text), 3)
      ]),
      divider: P(() => [...c[2] || (c[2] = [
        h("hr", { class: "divider" }, null, -1)
      ])]),
      stat: P(() => [
        E(qy, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: c[0] || (c[0] = (f) => l(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: P(() => [
        E(my, {
          node: e.node,
          onOpen: l
        }, null, 8, ["node"])
      ]),
      table: P(() => [
        E(Iy, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: l
        }, null, 8, ["columns", "rows"])
      ]),
      list: P(() => [
        E(Ey, {
          items: e.node.items,
          onOpen: l
        }, null, 8, ["items"])
      ]),
      text: P(() => [
        E(rt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: P(() => [
        E(xy, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: P(() => [
        E(co, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: P(() => [
        h("pre", Dy, [
          h("code", null, g(e.node.text), 1)
        ])
      ]),
      file: P(() => [
        h("button", {
          type: "button",
          class: "file",
          onClick: c[1] || (c[1] = (f) => i(e.node))
        }, g(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), or = /* @__PURE__ */ z(Py, [["__scopeId", "data-v-b9156b43"]]), jy = { class: "dashboard" }, Fy = { class: "trail" }, Wy = ["onClick"], Hy = {
  key: 0,
  class: "gone",
  role: "status"
}, zy = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (p) => p in (n.document.pages || {}), o = _(!!n.page && !s(n.page)), l = _(n.page && !o.value ? [n.page] : []), i = S(() => l.value.at(-1) || n.document.start), u = S(() => (n.document.pages || {})[i.value] || null), c = (p) => ((n.document.pages || {})[p] || {}).title || p, f = (p) => {
      o.value = !1, l.value = [...l.value, p];
    }, m = (p) => {
      o.value = !1, l.value = l.value.slice(0, p);
    };
    return he(
      () => n.document.start,
      () => l.value = []
    ), (p, y) => (r(), d("div", jy, [
      e.document.broken ? (r(), j(mn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: P(() => [
          U(g(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (r(), j(mn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: P(() => [
          U(g(e.document.missing), 1)
        ]),
        _: 1
      })) : u.value ? (r(), d(L, { key: 2 }, [
        h("nav", Fy, [
          h("button", {
            type: "button",
            class: Y(["step", { current: !l.value.length }]),
            onClick: y[0] || (y[0] = (b) => m(0))
          }, g(c(e.document.start)), 3),
          (r(!0), d(L, null, te(l.value, (b, x) => (r(), d(L, {
            key: `${x}-${b}`
          }, [
            y[2] || (y[2] = h("span", { class: "sep" }, "/", -1)),
            h("button", {
              type: "button",
              class: Y(["step", { current: x === l.value.length - 1 }]),
              onClick: (C) => m(x + 1)
            }, g(c(b)), 11, Wy)
          ], 64))), 128))
        ]),
        o.value ? (r(), d("p", Hy, "What you opened is no longer in this dashboard. Here is its start page.")) : k("", !0),
        E(Yt, {
          name: "page",
          mode: "out-in"
        }, {
          default: P(() => [
            (r(), d("div", {
              key: i.value,
              class: "page"
            }, [
              E(or, {
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
}, Uy = /* @__PURE__ */ z(zy, [["__scopeId", "data-v-fbe83734"]]);
function Vy(e, t) {
  const n = ot(), a = Vs(e, ar.openPanel), s = n.subscriptions.follow(n.window, t, a, () => n.visible.value);
  Ce(e), st(() => {
    s(), a.cancel();
  });
}
const Gy = {
  key: 0,
  class: "window-failure"
}, Ky = {
  __name: "DocumentRead",
  props: { line: { type: [String, Array], required: !0 }, events: { type: Array, default: () => [] } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = ot(), o = _(null);
    async function l() {
      o.value = await s.read(n.line);
    }
    return n.events.length ? Vy(l, n.events) : zs(l, () => !0, ar.documentWithNoEvents), (i, u) => o.value && !o.value.ok ? (r(), d("p", Gy, g(o.value.error), 1)) : o.value ? (r(), j(Uy, {
      key: 1,
      document: o.value.value,
      onFile: u[0] || (u[0] = (c) => a("file", c))
    }, null, 8, ["document"])) : k("", !0);
  }
}, Yy = 1e4;
class Qy {
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
    return this.heardAt !== null && t - this.heardAt > Yy;
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
const Xy = {
  key: 0,
  class: "frame-note"
}, Jy = {
  key: 0,
  class: "frame-note"
}, Zy = ["src", "title"], e0 = 1e3, t0 = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ot(), a = _(null), s = _(!1), o = _(!1);
    let l = null, i = 0;
    return Ce(() => {
      l = new Qy(a.value, n), l.start(), i = setInterval(() => {
        s.value = l.silent();
      }, e0);
    }), Re(() => {
      l == null || l.stop(), clearInterval(i);
    }), (u, c) => o.value ? (r(), d("p", Xy, "This window was closed because it stopped answering.")) : (r(), d(L, { key: 1 }, [
      s.value ? (r(), d("div", Jy, [
        c[2] || (c[2] = h("p", null, "This window has not answered for ten seconds.", -1)),
        E(ve, {
          onClick: c[0] || (c[0] = (f) => o.value = !0)
        }, {
          default: P(() => [...c[1] || (c[1] = [
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
        title: B(n).window
      }, null, 8, Zy)
    ], 64));
  }
}, n0 = /* @__PURE__ */ z(t0, [["__scopeId", "data-v-32a49046"]]), a0 = {
  class: "allowance-prompt",
  role: "dialog"
}, s0 = { class: "allowance-prompt-text" }, o0 = { class: "allowance-prompt-buttons" }, l0 = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("div", a0, [
      h("p", s0, g(B(Zg)(e.request)), 1),
      h("div", o0, [
        E(ve, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: P(() => [...s[2] || (s[2] = [
            U("Allow", -1)
          ])]),
          _: 1
        }),
        E(ve, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: P(() => [...s[3] || (s[3] = [
            U("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, i0 = /* @__PURE__ */ z(l0, [["__scopeId", "data-v-cad69fe2"]]), Wa = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), j(mn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: P(() => [
        U(g(e.reason) + " ", 1),
        e.retry ? (r(), j(ve, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: P(() => [...s[2] || (s[2] = [
            U("Retry", -1)
          ])]),
          _: 1
        })) : k("", !0),
        e.removable ? (r(), j(ve, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: P(() => [...s[3] || (s[3] = [
            U("Remove tab", -1)
          ])]),
          _: 1
        })) : k("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, r0 = ["data-window", "data-agent"], u0 = {
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
    const i = _e(Uc, null), u = nf({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: S(() => n.options),
      declared: n.declared,
      page: _e(Xd, null),
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
    js(Le, u), he(() => n.visible, (m) => m && n.subscriptions.shown(n.name)), Ce(u.settle), Re(() => {
      u.cancel(), n.subscriptions.stopAll(n.name);
    }), xu((m) => (s.value = m instanceof Error ? m.message : String(m), n.subscriptions.stopAll(n.name), !1));
    const c = () => va(n.component), f = () => {
      var m, p;
      return ((p = (m = n.prompts) == null ? void 0 : m.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (m, p) => (r(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      f() ? (r(), j(i0, {
        key: 0,
        request: f(),
        onAnswer: p[0] || (p[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : k("", !0),
      e.unavailableReason ? (r(), j(Wa, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (r(), j(Wa, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (r(), d(L, { key: 4 }, [
        (r(), j(c, { key: o.value })),
        e.skeleton.length && !B(u).answered.value ? (r(), j(fo, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : k("", !0)
      ], 64)) : (r(), j(Wa, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (y) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, r0));
  }
}, ln = /* @__PURE__ */ z(u0, [["__scopeId", "data-v-c4443e2b"]]), lr = {
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
    const n = e, a = t, s = { render: () => va(n0, { src: n.entry.entry_url }) };
    return (o, l) => (r(), j(ln, {
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
}, c0 = ["data-window"], ir = {
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
    const n = e, a = t, s = nt(null), o = _("");
    return he(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, ic();
          } catch (i) {
            if (oc(i) && lc(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (l, i) => !s.value && !o.value && !e.entry.unavailable_reason ? (r(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      E(fo, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, c0)) : (r(), j(ln, {
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
}, d0 = {
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
    const n = t, a = e, s = S(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = S(() => s.value && { render: () => va(Ky, { line: s.value.line, events: s.value.events }) }), l = _(null), i = S(() => {
      var p, y;
      return ((p = s.value) == null ? void 0 : p.loading) === "component" && !s.value.allowed && !((y = l.value) != null && y.component_trusted);
    }), u = S(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), c = S(
      () => {
        var p, y;
        return l.value ? ey(l.value, m) : { reads: ((p = s.value) == null ? void 0 : p.reads) || [], runs: ((y = s.value) == null ? void 0 : y.runs) || [], missing: [], ask: async () => !0 };
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
    return he(
      () => {
        var p, y;
        return ((p = s.value) == null ? void 0 : p.entry_url) || ((y = s.value) == null ? void 0 : y.line);
      },
      async () => {
        await f(), c.value.missing.length && !i.value && m();
      },
      { immediate: !0 }
    ), (p, y) => {
      var b, x;
      return !s.value && ((b = e.catalogue.loaded) == null ? void 0 : b.value) === !1 ? (r(), j(fo, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((x = s.value) == null ? void 0 : x.shows) === "one-agent" && e.agent === null ? (r(), j(mn, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : i.value ? (r(), j(ln, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": u.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (r(), j(ir, {
        key: c.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[0] || (y[0] = (C, M) => n("option", C, M))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (r(), j(lr, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: c.value,
        prompts: e.prompts,
        options: e.options,
        onOption: y[1] || (y[1] = (C, M) => n("option", C, M))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (r(), j(ln, {
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
        onOption: y[2] || (y[2] = (C, M) => n("option", C, M))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (r(), j(ln, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: y[3] || (y[3] = (C) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, f0 = ["data-section"], m0 = {
  key: 1,
  class: "inspector-section-missing",
  "data-section-missing": ""
}, h0 = {
  __name: "InspectorSections",
  props: { slotName: { type: String, default: "" }, names: { type: Array, default: () => [] }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = _e(Js, null), a = S(() => {
      const o = t.names.map((i) => ({ name: i, offered: !!(n != null && n.catalogue.window(i)) })), l = (t.slotName ? (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? [] : []).filter((i) => !t.names.includes(i.name));
      return [...o, ...l.map((i) => ({ name: i.name, offered: !0 }))];
    }), s = S(() => ({ row: t.row }));
    return (o, l) => B(n) ? (r(!0), d(L, { key: 0 }, te(a.value, (i) => (r(), d("div", {
      key: i.name,
      class: "inspector-section",
      "data-section": i.name
    }, [
      i.offered ? (r(), j(d0, {
        key: 0,
        name: i.name,
        catalogue: B(n).catalogue,
        subscriptions: B(n).subscriptions,
        environment: B(n).environment,
        prompts: B(n).prompts,
        "shell-read": B(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])) : (r(), d("p", m0, g(i.name) + " is not available", 1))
    ], 8, f0))), 128)) : k("", !0);
  }
}, _s = /* @__PURE__ */ z(h0, [["__scopeId", "data-v-a47d36b7"]]), p0 = { class: "rail-head" }, v0 = { key: 0 }, g0 = {
  key: 1,
  class: "rail-none"
}, y0 = {
  __name: "CommentRail",
  props: { comments: { type: Array, required: !0 }, hot: { type: Number, default: 0 }, lost: { type: Array, default: () => [] }, tab: Boolean, total: { type: Number, default: 0 } },
  emits: ["show"],
  setup(e) {
    return (t, n) => (r(), d("aside", {
      class: Y(["comment-rail", { tab: e.tab }]),
      "aria-label": "Comments",
      "data-comment-rail": ""
    }, [
      h("div", p0, [
        n[0] || (n[0] = h("h3", null, "Comments", -1)),
        e.comments.length ? (r(), d("span", v0, g(e.total || e.comments.length), 1)) : k("", !0)
      ]),
      e.comments.length ? (r(!0), d(L, { key: 0 }, te(e.comments, (a) => (r(), j(tr, {
        key: a.id,
        comment: a,
        hot: a.id === e.hot,
        lost: e.lost.includes(a.id),
        onShow: (s) => t.$emit("show", a.id)
      }, null, 8, ["comment", "hot", "lost", "onShow"]))), 128)) : (r(), d("p", g0, "No comments yet. Select a piece of the text to comment on it, or write one in the box below."))
    ], 2));
  }
}, b0 = /* @__PURE__ */ z(y0, [["__scopeId", "data-v-4d684649"]]), k0 = {
  class: "sidebar-switch",
  "aria-label": "Document discussion"
}, w0 = ["aria-pressed"], $0 = ["aria-pressed"], x0 = {
  key: 1,
  class: "question-rail",
  "aria-label": "Questions",
  "data-question-rail": ""
}, S0 = {
  key: 0,
  role: "alert"
}, M0 = {
  key: 1,
  class: "sidebar-none"
}, _0 = ["data-question-id"], C0 = { class: "question-state" }, E0 = ["data-question-show", "onClick"], A0 = {
  key: 0,
  class: "sidebar-none"
}, O0 = {
  key: 1,
  class: "question-answer"
}, T0 = {
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
    const t = _e(Js, null);
    return (n, a) => (r(), d("div", {
      class: Y(["document-sidebar", { tab: e.tab }]),
      "data-document-sidebar": ""
    }, [
      h("nav", k0, [
        h("button", {
          type: "button",
          "aria-pressed": e.mode === "comments",
          "data-document-notes": "comments",
          onClick: a[0] || (a[0] = (s) => n.$emit("update:mode", "comments"))
        }, "Comments", 8, w0),
        h("button", {
          type: "button",
          "aria-pressed": e.mode === "questions",
          "data-document-notes": "questions",
          onClick: a[1] || (a[1] = (s) => n.$emit("update:mode", "questions"))
        }, "Questions", 8, $0)
      ]),
      e.mode === "comments" ? (r(), d(L, { key: 0 }, [
        e.comments.length || !e.commentFailure && !e.commentLoading ? (r(), j(b0, {
          key: 0,
          tab: "",
          comments: e.comments,
          hot: e.hot,
          lost: e.lost,
          total: e.commentTotal,
          onShow: a[2] || (a[2] = (s) => n.$emit("show", s))
        }, null, 8, ["comments", "hot", "lost", "total"])) : k("", !0),
        E(Mn, {
          more: e.commentMore,
          loading: e.commentLoading,
          failure: e.commentFailure,
          label: "More comments",
          onMore: a[3] || (a[3] = (s) => n.$emit("more"))
        }, null, 8, ["more", "loading", "failure"])
      ], 64)) : (r(), d("aside", x0, [
        e.failure ? (r(), d("p", S0, g(e.failure), 1)) : e.questions.length ? k("", !0) : (r(), d("p", M0, "No questions about this text yet.")),
        (r(!0), d(L, null, te(e.questions, (s) => {
          var o;
          return r(), d("section", {
            key: s.id,
            class: Y(["document-question", { hot: s.id === e.hot }]),
            "data-question-id": s.id
          }, [
            h("span", C0, g(B(hn)("question", s.state)), 1),
            h("button", {
              type: "button",
              class: "question-show",
              "data-question-show": s.id,
              onClick: (l) => n.$emit("show", s.id)
            }, g(s.text), 9, E0),
            s.quote ? (r(), d(L, { key: 0 }, [
              h("blockquote", null, g(s.quote), 1),
              e.lost.includes(s.id) ? (r(), d("p", A0, "The quoted text has changed.")) : k("", !0)
            ], 64)) : k("", !0),
            s.answer ? (r(), d("p", O0, "Answered: " + g(s.answer), 1)) : k("", !0),
            E(_s, {
              names: ["questions.question-options"],
              row: s
            }, null, 8, ["row"]),
            E(ao, {
              name: "row.question",
              row: { ...s, term: "question" },
              environment: ((o = B(t)) == null ? void 0 : o.environment) ?? "",
              onDone: a[4] || (a[4] = (l) => n.$emit("changed"))
            }, null, 8, ["row", "environment"])
          ], 10, _0);
        }), 128))
      ]))
    ], 2));
  }
}, ol = /* @__PURE__ */ z(T0, [["__scopeId", "data-v-660e5c85"]]), I0 = {
  class: "edit-failure",
  role: "alert",
  "data-text-failure": ""
}, B0 = {
  __name: "DocumentEditDialog",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, required: !0 }, read: { type: Function, required: !0 } },
  emits: ["close", "saved"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Kt({ abstract: n.row.abstract, body: n.row.body }), o = _("");
    async function l() {
      const i = await n.read([n.term, "edit", String(n.id), "--abstract", s.abstract, "--body", s.body]);
      o.value = i.ok ? "" : i.error, i.ok && a("saved");
    }
    return (i, u) => (r(), j(ka, {
      padded: "",
      title: "Edit the document",
      wide: "",
      onClose: u[3] || (u[3] = (c) => a("close"))
    }, {
      foot: P(() => [
        h("span", I0, g(o.value), 1),
        E(ve, {
          onClick: u[2] || (u[2] = (c) => a("close"))
        }, {
          default: P(() => [...u[6] || (u[6] = [
            U("Cancel", -1)
          ])]),
          _: 1
        }),
        E(ve, {
          variant: "primary",
          "data-text-save": "",
          onClick: l
        }, {
          default: P(() => [...u[7] || (u[7] = [
            U("Save", -1)
          ])]),
          _: 1
        })
      ]),
      default: P(() => [
        h("form", {
          class: "edit-form",
          "data-text-form": "",
          onSubmit: ke(l, ["prevent"])
        }, [
          h("label", null, [
            u[4] || (u[4] = h("span", null, "Abstract", -1)),
            Me(h("input", {
              "onUpdate:modelValue": u[0] || (u[0] = (c) => s.abstract = c)
            }, null, 512), [
              [Ke, s.abstract]
            ])
          ]),
          h("label", null, [
            u[5] || (u[5] = h("span", null, "Text", -1)),
            Me(h("textarea", {
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
}, R0 = /* @__PURE__ */ z(B0, [["__scopeId", "data-v-464d77a8"]]);
function rr(e, t) {
  const n = _([]), a = _(!1), s = _(null), o = _(0), l = _(!1), i = _("");
  let u = 0, c = 0;
  const f = (b) => {
    if (typeof b.body == "string") return b.body;
    const { term: x, id: C, title: M } = e(), T = `On ${x} ${C}, ${M}: `;
    return b.text.startsWith(T) ? b.text.slice(T.length) : b.text;
  };
  async function m(b = 1) {
    const { term: x, id: C } = e();
    if (!C) return;
    const M = ++c;
    l.value = !0, i.value = "";
    try {
      const T = await t([x, "comments", String(C), "--page", String(b), "--page-size", "25"]);
      if (M !== c) return;
      if (!T.ok) {
        i.value = T.error;
        return;
      }
      const H = T.value.rows ?? [], W = b === 1 ? H : [...n.value, ...H];
      n.value = [...new Map(W.map((I) => [I.id, I])).values()], o.value = T.value.total ?? n.value.length, s.value = T.value.next_page ?? null;
    } catch (T) {
      M === c && (i.value = T.message);
    } finally {
      M === c && (l.value = !1);
    }
  }
  async function p(b) {
    var I;
    const { term: x, id: C } = e(), M = `${x}:${C}`, T = { id: `sending-${++u}`, text: b };
    n.value = [...n.value, T], o.value++, a.value = !0;
    const H = await t([x, "comment", String(C), b]);
    if (M !== `${e().term}:${e().id}`) return;
    if (!H.ok)
      throw n.value = n.value.filter((G) => G.id !== T.id), o.value = Math.max(0, o.value - 1), new Error(H.error);
    await m();
    const W = (I = H.value) == null ? void 0 : I.id;
    W && !n.value.some((G) => G.id === W) && (n.value = [...n.value, { ...T, id: W }]);
  }
  const y = () => !l.value && s.value && m(s.value);
  return he(() => `${e().term}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, i.value = "", c++, m();
  }, { immediate: !0 }), { comments: n, open: a, words: f, send: p, load: m, loadMore: y, nextPage: s, total: o, loading: l, failure: i };
}
function L0(e, t) {
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
const N0 = {
  class: "document-tab",
  "data-document-revisions": ""
}, q0 = ["datetime"], D0 = {
  key: 0,
  class: "revision-failure",
  role: "alert",
  "data-text-revision-failure": ""
}, P0 = {
  class: "revision-diff",
  "data-text-revision-diff": ""
}, j0 = {
  key: 2,
  class: "document-none"
}, F0 = {
  __name: "DocumentRevisions",
  props: { id: { type: Number, required: !0 }, revisions: { type: Array, required: !0 }, text: { type: String, default: "" }, read: { type: Function, required: !0 }, editing: Boolean },
  emits: ["restored", "close-revision"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(null), o = _(""), l = S(() => s.value ? L0(s.value.body, n.text) : []);
    async function i(c) {
      const f = await n.read(["doc", "revision", String(n.id), String(c.number)]);
      s.value = f.ok ? f.value : null, o.value = f.ok ? "" : f.error;
    }
    async function u() {
      const c = await n.read(["doc", "edit", String(n.id), "--abstract", s.value.abstract, "--body", s.value.body]);
      o.value = c.ok ? "" : c.error, c.ok && a("restored");
    }
    return (c, f) => (r(), d("div", N0, [
      e.editing ? (r(), j(ve, {
        key: 0,
        small: "",
        bordered: "",
        "data-close-revision": "",
        onClick: f[0] || (f[0] = (m) => a("close-revision"))
      }, {
        default: P(() => [...f[1] || (f[1] = [
          U("Close the open revision", -1)
        ])]),
        _: 1
      })) : k("", !0),
      e.revisions.length ? (r(), d(L, { key: 1 }, [
        (r(!0), d(L, null, te(e.revisions, (m) => (r(), j(ve, {
          key: m.number,
          variant: "text",
          "data-text-revision": m.number,
          onClick: (p) => i(m)
        }, {
          default: P(() => [
            U("Revision " + g(m.number) + ": " + g(m.change) + " · " + g(m.author_name) + " · ", 1),
            h("time", {
              datetime: m.created_at
            }, g(m.created_at.slice(0, 16).replace("T", " ")), 9, q0)
          ]),
          _: 2
        }, 1032, ["data-text-revision", "onClick"]))), 128)),
        o.value ? (r(), d("p", D0, g(o.value), 1)) : k("", !0),
        s.value ? (r(), d(L, { key: 1 }, [
          E(ve, {
            small: "",
            bordered: "",
            "data-text-revision-restore": "",
            onClick: u
          }, {
            default: P(() => [...f[2] || (f[2] = [
              U("Go back to this revision", -1)
            ])]),
            _: 1
          }),
          h("div", P0, [
            (r(!0), d(L, null, te(l.value, (m) => (r(), d("div", {
              key: m.key,
              class: Y(["revision-line", m.type])
            }, g(m.text || " "), 3))), 128))
          ])
        ], 64)) : k("", !0)
      ], 64)) : (r(), d("p", j0, "No revisions"))
    ]));
  }
}, W0 = /* @__PURE__ */ z(F0, [["__scopeId", "data-v-3a381aa4"]]), H0 = "button, [data-comment-number]", z0 = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";
function ur(e) {
  const t = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), n = [];
  for (; t.nextNode(); )
    t.currentNode.parentElement.closest(H0) || n.push(t.currentNode);
  return n;
}
function ll(e, t, n) {
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
const U0 = (e) => e.closest("pre") ? "code" : e.closest("tr") ? "row" : "text";
function V0(e) {
  const t = window.getSelection();
  if (!t || t.isCollapsed || !t.rangeCount) return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.commonAncestorContainer)) return null;
  const a = ur(e), s = a.map((c) => c.data).join(""), o = ll(a, n.startContainer, n.startOffset), l = s.slice(o, ll(a, n.endContainer, n.endOffset)), i = l.trim();
  if (!i) return null;
  const u = n.commonAncestorContainer;
  return { quote: i, position: o + l.indexOf(i), selection_type: U0(u.nodeType === Node.TEXT_NODE ? u.parentElement : u) };
}
function G0(e, { quote: t, position: n }) {
  if (e.startsWith(t, n ?? 0)) return n ?? 0;
  let a = -1;
  for (let s = e.indexOf(t); s >= 0; s = e.indexOf(t, s + 1))
    (a < 0 || Math.abs(s - n) < Math.abs(a - n)) && (a = s);
  return a;
}
function K0(e, t, n) {
  const a = [];
  let s = 0;
  for (const o of e) {
    const l = Math.max(t - s, 0), i = Math.min(n - s, o.data.length);
    l < i && a.push({ node: o, from: l, to: i }), s += o.data.length;
  }
  return a;
}
function Ha(e, t, n = "Comment") {
  const a = document.createElement("button");
  return a.type = "button", a.className = "comment-number", a.dataset.commentNumber = t, a.setAttribute("aria-label", `${n} ${e}`), a.textContent = e, a;
}
function Y0({ node: e, from: t, to: n }) {
  const a = document.createRange();
  a.setStart(e, t), a.setEnd(e, n);
  const s = document.createElement("mark");
  return a.surroundContents(s), s;
}
function Q0(e, t) {
  const n = ur(e), a = G0(n.map((i) => i.data).join(""), t);
  if (a < 0) return !1;
  const s = K0(n, a, a + t.quote.length), o = (i) => i.node.parentElement.closest(t.selection_type === "code" ? ".code-line" : "tr"), l = t.selection_type === "text" ? s.reverse().map(Y0).reverse() : [...new Set(s.map(o).filter(Boolean))];
  for (const i of l)
    i.classList.add(t.pending ? "selection-pending" : "selection-comment"), t.hot && i.classList.add("hot"), t.id && (i.dataset.comment = t.id);
  return !t.number || !l.length || (t.selection_type === "row" ? l.at(-1).lastElementChild.append(Ha(t.number, t.id, t.label)) : t.selection_type === "code" ? l[0].prepend(Ha(t.number, t.id, t.label)) : l.at(-1).append(Ha(t.number, t.id, t.label))), !0;
}
function X0(e, t) {
  const n = [];
  for (const a of [...t].sort((s, o) => (o.position ?? 0) - (s.position ?? 0)))
    !Q0(e, a) && a.id && n.push(a.id);
  return n;
}
const J0 = (e) => e.closest(z0) ?? e;
function il(e) {
  let t = 0;
  const n = e.filter((a) => a.quote).sort((a, s) => (a.position ?? 0) - (s.position ?? 0)).map((a) => ({ ...a, number: ++t }));
  return [...e.filter((a) => !a.quote), ...n];
}
const Z0 = {
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
      const x = a.comments.filter((H) => H.quote).map((H) => ({ ...H, label: a.annotationLabel, hot: H.id === a.hot })), C = X0(l.value, a.pending ? [...x, { ...a.pending, pending: !0 }] : x);
      s("lost", C);
      const M = a.inline && l.value.querySelector(`[data-comment="${a.inline}"]`);
      if (!M) {
        c.value = null;
        return;
      }
      const T = document.createElement("div");
      T.className = "inline-comment", J0(M).after(T), c.value = T;
    }
    function m() {
      if (!l.value) return;
      const x = V0(l.value);
      if (u.value = !!x, !x) {
        i.value = null;
        return;
      }
      const C = window.getSelection().getRangeAt(0).getBoundingClientRect(), M = o.value.getBoundingClientRect();
      i.value = { left: `${Math.max(C.left - M.left, 0)}px`, top: `${C.top - M.top + o.value.scrollTop}px` }, s("select", x);
    }
    function p(x) {
      const C = x.target.closest("[data-comment-number]");
      C ? s("number", Number(C.dataset.commentNumber)) : window.getSelection().isCollapsed && s("clear");
    }
    function y(x) {
      var C;
      (C = l.value.querySelector(`[data-comment="${x}"]`)) == null || C.scrollIntoView({ block: "center" });
    }
    function b(x) {
      var C;
      (C = l.value.querySelectorAll("h3, h4, h5, h6")[x]) == null || C.scrollIntoView({ block: "start" });
    }
    return he(() => [a.html, a.comments, a.annotationLabel, a.hot, a.inline, u.value, a.pending], f, { flush: "post" }), Ce(() => {
      f(), document.addEventListener("selectionchange", m);
    }), st(() => document.removeEventListener("selectionchange", m)), t({ show: y, showHeading: b, nextTick: je }), (x, C) => (r(), d("div", {
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
        onMousedown: C[0] || (C[0] = ke(() => {
        }, ["prevent"])),
        onClick: C[1] || (C[1] = (M) => s("write"))
      }, [
        E(le, {
          name: "chat",
          size: 13
        }),
        C[2] || (C[2] = U("Comment on this", -1))
      ], 36)) : k("", !0),
      c.value ? (r(), j(Sn, {
        key: 1,
        to: c.value
      }, [
        ie(x.$slots, "inline", {}, void 0, !0)
      ], 8, ["to"])) : k("", !0),
      ie(x.$slots, "default", {}, void 0, !0)
    ], 512));
  }
}, eb = /* @__PURE__ */ z(Z0, [["__scopeId", "data-v-a92386e6"]]), tb = { class: "document-tabs" }, nb = ["aria-pressed"], ab = { class: "document-body" }, sb = {
  key: 0,
  class: "document-failure",
  role: "alert",
  "data-resource-failure": ""
}, ob = {
  key: 1,
  class: "document-loading"
}, lb = {
  class: "document-details",
  "data-resource-fields": ""
}, ib = 760, rb = {
  __name: "DocumentBody",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const t = e, n = _e(ui, _(null)), a = _(null), s = Dg(a), o = S(() => s.value !== null && s.value < ib), l = _(null), i = _(""), u = _([]), c = _([]), f = _(""), m = _("comments"), p = _("text"), y = _(0), b = _(!1), x = _(0), C = _([]), M = _(null), T = _(""), H = _(!1), W = _(null), I = _(null);
    let G = 0;
    const q = rr(() => l.value ? { term: t.term, id: t.id, title: l.value.title } : {}, (se) => t.read(se)), A = S(() => il(q.comments.value)), N = S(() => m.value === "questions" ? il(c.value) : A.value), D = S(() => m.value === "questions" ? N.value.length : q.total.value), w = S(() => {
      var se;
      return (se = l.value) != null && se.body ? lo(l.value.body, { env: "", rowNames: !1, document: !0 }) : "";
    }), v = S(() => {
      var se;
      return (((se = l.value) == null ? void 0 : se.body) ?? "").split(`
`).filter((Q) => /^#{1,4} /.test(Q)).map((Q, pe) => ({ key: String(pe), value: pe, label: Q.replace(/^#+ /, "") }));
    }), $ = S(() => A.value.find((se) => se.id === x.value)), O = S(() => {
      var se;
      return (se = l.value) != null && se.close_reason ? "Closed" : "Open";
    }), R = S(() => p.value === "comments" && !o.value ? "text" : p.value), F = (se) => se.ok ? se.value.rows ?? [] : [];
    async function V() {
      const se = ++G, Q = await t.read([t.term, "inspect", String(t.id)]);
      if (se !== G) return;
      i.value = Q.ok ? "" : Q.error, l.value = Q.ok ? Q.value : null;
      const pe = await t.read(["question", "list", "--all", "--row", `${t.term}:${t.id}`]), Ze = t.term === "doc" ? await t.read(["doc", "revisions", String(t.id)]) : null;
      se === G && (c.value = F(pe), f.value = pe.ok ? "" : pe.error, u.value = Ze ? F(Ze) : []);
    }
    async function J(se) {
      const Q = M.value ? ["--quote", M.value.quote, "--position", String(M.value.position), "--selection-type", M.value.selection_type] : [], pe = await t.read([t.term, "comment", String(t.id), ...Q, "--", se]);
      if (!pe.ok) throw new Error(pe.error);
      M.value = null, await Promise.all([V(), q.load()]);
    }
    async function oe() {
      const se = await t.read(["doc", "close", String(t.id)]);
      i.value = se.ok ? "" : se.error, se.ok && await V();
    }
    function ue() {
      T.value.trim() || (M.value = null);
    }
    async function we(se) {
      var Q;
      if (y.value = se, o.value && m.value === "questions") {
        p.value = "comments";
        return;
      }
      if (o.value) {
        x.value = x.value === se ? 0 : se;
        return;
      }
      b.value = !0, await je(), (Q = a.value.querySelector(m.value === "questions" ? `[data-question-id="${se}"]` : `[data-comment-id="${se}"]`)) == null || Q.scrollIntoView({ block: "nearest" });
    }
    async function Oe(se) {
      var Q, pe;
      p.value = "text", y.value = se, await ((Q = W.value) == null ? void 0 : Q.nextTick()), (pe = W.value) == null || pe.show(se);
    }
    function be() {
      H.value = !1, V();
    }
    return he(() => `${t.term}:${t.id}`, () => {
      l.value = null, p.value = "text", b.value = !1, y.value = 0, x.value = 0, M.value = null, c.value = [], f.value = "", V();
    }, { immediate: !0 }), he(m, () => {
      y.value = 0, x.value = 0;
    }), (se, Q) => (r(), d("div", {
      ref_key: "panel",
      ref: a,
      class: "document-inspector",
      "data-document-inspector": ""
    }, [
      l.value ? (r(), j(Sn, {
        key: 0,
        to: B(n),
        disabled: !B(n)
      }, [
        h("span", {
          class: Y(["document-actions", { placed: B(n) }]),
          "data-document-actions": ""
        }, [
          E(ve, {
            bordered: "",
            "data-text-edit": "",
            onClick: Q[0] || (Q[0] = (pe) => H.value = !0)
          }, {
            default: P(() => [...Q[15] || (Q[15] = [
              U("Edit", -1)
            ])]),
            _: 1
          }),
          R.value === "text" && v.value.length > 1 ? (r(), j(Ks, {
            key: 0,
            label: o.value ? "" : "Chapters",
            icon: "list",
            items: v.value,
            "data-text-chapters": "",
            onPick: Q[1] || (Q[1] = (pe) => {
              var Ze;
              return (Ze = W.value) == null ? void 0 : Ze.showHeading(pe.value);
            })
          }, null, 8, ["label", "items"])) : k("", !0)
        ], 2)
      ], 8, ["to", "disabled"])) : k("", !0),
      h("nav", tb, [
        h("button", {
          type: "button",
          class: Y(["document-tab-button", { on: R.value === "text" }]),
          "data-document-tab": "text",
          onClick: Q[2] || (Q[2] = (pe) => p.value = "text")
        }, "Text", 2),
        o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: Y(["document-tab-button", { on: R.value === "comments" }]),
          "data-document-tab": "comments",
          onClick: Q[3] || (Q[3] = (pe) => p.value = "comments")
        }, [
          U(g(m.value === "questions" ? "Questions" : "Comments") + " ", 1),
          h("em", null, g(D.value || ""), 1)
        ], 2)) : (r(), d("button", {
          key: 1,
          type: "button",
          class: Y(["document-tab-button", { on: b.value }]),
          "aria-pressed": b.value,
          "data-document-notes-toggle": "",
          onClick: Q[4] || (Q[4] = (pe) => b.value = !b.value)
        }, [
          U(g(m.value === "questions" ? "Questions" : "Comments") + " ", 1),
          h("em", null, g(D.value || ""), 1)
        ], 10, nb)),
        e.term === "doc" ? (r(), d("button", {
          key: 2,
          type: "button",
          class: Y(["document-tab-button", { on: R.value === "revisions" }]),
          "data-document-tab": "revisions",
          onClick: Q[5] || (Q[5] = (pe) => p.value = "revisions")
        }, [
          Q[16] || (Q[16] = U("Revisions ", -1)),
          h("em", null, g(u.value.length || ""), 1)
        ], 2)) : k("", !0)
      ]),
      h("div", ab, [
        i.value ? (r(), d("p", sb, g(i.value), 1)) : l.value ? R.value === "revisions" ? (r(), j(W0, {
          key: 2,
          id: e.id,
          revisions: u.value,
          text: l.value.body,
          read: e.read,
          editing: l.value.open_author_id !== null && l.value.open_author_id !== void 0,
          onCloseRevision: oe,
          onRestored: V
        }, null, 8, ["id", "revisions", "text", "read", "editing"])) : R.value === "comments" ? (r(), j(ol, {
          key: 3,
          mode: m.value,
          "onUpdate:mode": Q[6] || (Q[6] = (pe) => m.value = pe),
          tab: "",
          comments: A.value,
          questions: c.value,
          hot: y.value,
          lost: C.value,
          failure: f.value,
          read: e.read,
          "comment-more": !!B(q).nextPage.value,
          "comment-loading": B(q).loading.value,
          "comment-failure": B(q).failure.value,
          "comment-total": B(q).total.value,
          onMore: B(q).loadMore,
          onShow: Oe,
          onChanged: V
        }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : (r(), d(L, { key: 4 }, [
          E(eb, {
            ref_key: "words",
            ref: W,
            html: w.value,
            comments: N.value,
            "annotation-label": m.value === "questions" ? "Question" : "Comment",
            hot: y.value,
            pending: M.value,
            inline: x.value,
            onSelect: Q[8] || (Q[8] = (pe) => M.value = pe),
            onClear: ue,
            onNumber: we,
            onWrite: Q[9] || (Q[9] = (pe) => {
              var Ze;
              return (Ze = I.value) == null ? void 0 : Ze.focus();
            }),
            onLost: Q[10] || (Q[10] = (pe) => C.value = pe)
          }, {
            inline: P(() => [
              $.value ? (r(), j(tr, {
                key: 0,
                comment: $.value,
                hot: "",
                onShow: Q[7] || (Q[7] = (pe) => Oe($.value.id))
              }, null, 8, ["comment"])) : k("", !0)
            ]),
            default: P(() => [
              h("dl", lb, [
                Q[18] || (Q[18] = h("h4", null, "Details", -1)),
                Q[19] || (Q[19] = h("dt", null, "State", -1)),
                h("dd", null, g(O.value), 1),
                l.value.close_reason ? (r(), d(L, { key: 0 }, [
                  Q[17] || (Q[17] = h("dt", null, "Why closed", -1)),
                  h("dd", null, g(l.value.close_reason), 1)
                ], 64)) : k("", !0),
                Q[20] || (Q[20] = h("dt", null, "Created", -1)),
                h("dd", null, [
                  E(at, {
                    at: l.value.created_at
                  }, null, 8, ["at"])
                ]),
                Q[21] || (Q[21] = h("dt", null, "Updated", -1)),
                h("dd", null, [
                  E(at, {
                    at: l.value.updated_at
                  }, null, 8, ["at"])
                ])
              ])
            ]),
            _: 1
          }, 8, ["html", "comments", "annotation-label", "hot", "pending", "inline"]),
          !o.value && b.value ? (r(), j(ol, {
            key: 0,
            mode: m.value,
            "onUpdate:mode": Q[11] || (Q[11] = (pe) => m.value = pe),
            comments: A.value,
            questions: c.value,
            hot: y.value,
            lost: C.value,
            failure: f.value,
            read: e.read,
            "comment-more": !!B(q).nextPage.value,
            "comment-loading": B(q).loading.value,
            "comment-failure": B(q).failure.value,
            "comment-total": B(q).total.value,
            onMore: B(q).loadMore,
            onShow: Oe,
            onChanged: V
          }, null, 8, ["mode", "comments", "questions", "hot", "lost", "failure", "read", "comment-more", "comment-loading", "comment-failure", "comment-total", "onMore"])) : k("", !0)
        ], 64)) : (r(), d("div", ob, [
          E(Je)
        ]))
      ]),
      l.value ? (r(), j(Jg, {
        key: 1,
        ref_key: "composer",
        ref: I,
        draft: T.value,
        "onUpdate:draft": Q[12] || (Q[12] = (pe) => T.value = pe),
        selection: M.value,
        send: J,
        narrow: o.value,
        onClear: Q[13] || (Q[13] = (pe) => M.value = null)
      }, null, 8, ["draft", "selection", "narrow"])) : k("", !0),
      H.value ? (r(), j(R0, {
        key: 2,
        term: e.term,
        id: e.id,
        row: l.value,
        read: e.read,
        onClose: Q[14] || (Q[14] = (pe) => H.value = !1),
        onSaved: be
      }, null, 8, ["term", "id", "row", "read"])) : k("", !0)
    ], 512));
  }
}, y_ = /* @__PURE__ */ z(rb, [["__scopeId", "data-v-f9bd78a7"]]), ub = {
  key: 1,
  class: "row-list-failure"
}, cb = ["data-row"], db = {
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
    const t = e, n = S(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : t.moves ? { tag: "ul", name: "row-list", css: !t.leavesAtOnce, "data-row-list-moves": "" } : {}), a = _(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (r(), j(Je, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (r(), d("p", ub, g(e.failure), 1)) : !e.rows.length && e.loaded ? (r(), j(mn, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: P(() => [
        U(g(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (r(), d(L, { key: 3 }, [
      (r(), j(Qe(e.arrival || e.moves ? Fs : "ul"), Pe(n.value, { class: "row-list" }), {
        default: P(() => [
          (r(!0), d(L, null, te(e.rows, (i) => (r(), d("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            ie(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, cb))), 128))
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
}, fb = /* @__PURE__ */ z(db, [["__scopeId", "data-v-e9f251f3"]]), mb = {
  class: "agent-rows",
  "data-agent-rows": ""
}, hb = {
  key: 1,
  class: "agent-rows-note"
}, pb = {
  key: 2,
  class: "agent-rows-note"
}, vb = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, gb = ["data-agent-row", "onClick"], yb = { class: "agent-row-name" }, bb = { class: "agent-row-state" }, kb = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = S(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = S(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (r(), d("div", mb, [
      e.loaded ? e.failure ? (r(), d("p", hb, g(e.failure), 1)) : e.rows.length ? (r(), d(L, { key: 3 }, [
        h("p", vb, g(a.value) + " running", 1),
        (r(!0), d(L, null, te(n.value, (l) => (r(), d("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (i) => B(We)(`agents:${l.id}`)
        }, [
          h("span", yb, "#" + g(l.id) + " " + g(l.session), 1),
          h("span", bb, g(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, gb))), 128))
      ], 64)) : (r(), d("p", pb, g(e.none), 1)) : (r(), j(Je, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, b_ = /* @__PURE__ */ z(kb, [["__scopeId", "data-v-a01e5a17"]]), ht = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ge = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Ve = { across: 48, down: 110, margin: 32, labelSpace: 14 }, wb = 6;
function mo(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const $b = (e) => {
  const t = mo(e, ht.lineChars), n = Math.max(ht.minWidth, Math.max(...t.map((a) => a.length)) * ht.charWidth + ht.padX * 2);
  return { name: e, lines: t, line: ht.line, padY: ht.padY, width: n, height: t.length * ht.line + ht.padY * 2 };
};
function xb(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((i, u) => {
      if (i[0] !== l) return;
      const c = s.get(i[1]);
      c === "open" ? a.add(u) : c || o(i[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function Sb(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function Mb(e, t, n) {
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
  for (let l = 0; l < wb; l++) {
    const i = l % 2 === 0, u = a.map((c, f) => f);
    (i ? u.slice(1) : u.slice(0, -1).reverse()).forEach((c) => {
      const f = (m) => t.filter((p) => p[i ? 1 : 0] === m).map((p) => p[i ? 0 : 1]);
      a[c] = o(a[c], f);
    });
  }
  return a;
}
function _b(e, t) {
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
function Cb(e) {
  const t = [...new Set(e.flatMap(([W, I]) => [W, I]))], n = new Set(e.map(([, W]) => W)), a = t.filter((W) => !n.has(W)), s = xb(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((W, I) => !s.has(I)), l = Sb(t, o), i = Mb(t, o, l), u = new Map(t.map((W) => [W, $b(W)])), c = i.map((W) => W.reduce((I, G) => I + u.get(G).width, 0) + Ve.across * (W.length - 1)), f = Math.max(...c) + Ve.margin * 2, m = Ab(e, l, i.length), p = /* @__PURE__ */ new Map();
  let y = Ve.margin;
  i.forEach((W, I) => {
    let G = (f - c[I]) / 2;
    const q = Math.max(...W.map((A) => u.get(A).height));
    W.forEach((A) => {
      const N = u.get(A);
      p.set(A, { ...N, x: G, y: y + (q - N.height) / 2 }), G += N.width + Ve.across;
    }), y += q + (m[I] ?? Ve.down);
  });
  const b = e.map(([W, I, G], q) => ({ from: W, to: I, label: G || "", back: s.has(q) || l.get(I) <= l.get(W) }));
  _b(b, p);
  const x = b.map((W) => Ob(W, p.get(W.from), p.get(W.to))), C = [...p.values()], M = Rb(x, C), T = Math.max(y - Ve.down, ...M.filter((W) => W.label).map((W) => W.label.y + W.label.height));
  return { width: Math.max(f - Ve.margin, ...M.filter((W) => W.label).map((W) => W.label.x + W.label.width)) + Ve.margin, height: T + Ve.margin, nodes: C, arrows: M };
}
const Eb = (e) => e ? mo(e, Ge.lineChars).length * Ge.line + Ge.pad * 2 : 0;
function Ab(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Ve.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [i, u] = [t.get(s), t.get(o)].sort((c, f) => c - f);
    u > i && (a[i + Math.floor((u - i - 1) / 2)] += Eb(l) + Ve.labelSpace);
  }), a.map((s) => Math.max(Ve.down, s));
}
function Ob(e, t, n) {
  const a = e.label ? mo(e.label, Ge.lineChars) : [], s = a.length ? Math.max(...a.map((p) => p.length)) * Ge.charWidth + Ge.pad * 2 : 0, o = a.length * Ge.line + (a.length ? Ge.pad * 2 : 0), l = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, u = n.x + n.width * e.toShare, c = e.back ? n.y + n.height : n.y, f = (c - i) / 2, m = [{ x: l, y: i }, { x: l, y: i + f }, { x: u, y: c - f }, { x: u, y: c }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: m, path: `M${l} ${i} C${l} ${i + f} ${u} ${c - f} ${u} ${c}` };
}
const Tb = ([e, t, n, a], s) => {
  const o = 1 - s, l = (i) => o * o * o * e[i] + 3 * o * o * s * t[i] + 3 * o * s * s * n[i] + s * s * s * a[i];
  return { x: l("x"), y: l("y") };
}, Ib = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Bb = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ge.line);
function Rb(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (u, c) => {
      const f = Tb(a.curve, u);
      return { x: f.x - a.labelWidth / 2, y: f.y - a.labelHeight / 2 + c, width: a.labelWidth, height: a.labelHeight };
    }, i = Bb.flatMap((u) => Ib.map((c) => s(c, u))).find((u) => !n.some((c) => rl(u, c))) ?? s(0.5, 0);
    for (; n.some((u) => rl(i, u)); ) i.y += Ge.line;
    return n.push(i), { ...a, label: { ...i, lines: a.lines, line: Ge.line, pad: Ge.pad } };
  });
}
const rl = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Lb = { class: "flowchart-tools" }, Nb = ["width", "height", "viewBox", "aria-label"], qb = ["d"], Db = ["x", "y", "width", "height"], Pb = ["x", "y"], jb = ["x", "dy"], Fb = {
  key: 0,
  class: "flowchart-label"
}, Wb = ["x", "y", "width", "height"], Hb = ["x", "y"], zb = ["x", "dy"], Ub = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => Cb(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = _(null), i = _({ zoom: 1, x: 0, y: 0 });
    let u = null;
    function c() {
      var M;
      const x = (M = l.value) == null ? void 0 : M.getBoundingClientRect();
      if (!(x != null && x.width)) return;
      const C = Math.min(x.width / s.value.width, x.height / s.value.height, 1.5);
      i.value = { zoom: C, x: (x.width - s.value.width * C) / 2, y: (x.height - s.value.height * C) / 2 };
    }
    function f(x, C, M) {
      const { zoom: T, x: H, y: W } = i.value, I = Math.min(o.most, Math.max(o.least, T * x));
      i.value = { zoom: I, x: C - (C - H) * I / T, y: M - (M - W) * I / T };
    }
    function m(x) {
      const C = l.value.getBoundingClientRect();
      f(x, C.width / 2, C.height / 2);
    }
    function p(x) {
      const C = l.value.getBoundingClientRect();
      x.ctrlKey || x.metaKey ? f(x.deltaY < 0 ? o.step : 1 / o.step, x.clientX - C.left, x.clientY - C.top) : i.value = { ...i.value, x: i.value.x - x.deltaX, y: i.value.y - x.deltaY };
    }
    function y(x) {
      var C, M, T;
      x.preventDefault(), (C = window.getSelection()) == null || C.removeAllRanges(), u = { x: x.clientX - i.value.x, y: x.clientY - i.value.y }, (T = (M = l.value).setPointerCapture) == null || T.call(M, x.pointerId);
    }
    function b(x) {
      u && (i.value = { ...i.value, x: x.clientX - u.x, y: x.clientY - u.y });
    }
    return Ce(c), (x, C) => (r(), j(ka, {
      padded: "",
      title: e.title,
      large: "",
      onClose: C[4] || (C[4] = (M) => a("close"))
    }, {
      default: P(() => [
        h("div", Lb, [
          E(ve, {
            small: "",
            onClick: C[0] || (C[0] = (M) => m(o.step))
          }, {
            default: P(() => [...C[5] || (C[5] = [
              U("Zoom in", -1)
            ])]),
            _: 1
          }),
          E(ve, {
            small: "",
            onClick: C[1] || (C[1] = (M) => m(1 / o.step))
          }, {
            default: P(() => [...C[6] || (C[6] = [
              U("Zoom out", -1)
            ])]),
            _: 1
          }),
          E(ve, {
            small: "",
            onClick: c
          }, {
            default: P(() => [...C[7] || (C[7] = [
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
          onPointerup: C[2] || (C[2] = (M) => To(u) ? u.value = null : u = null),
          onPointercancel: C[3] || (C[3] = (M) => To(u) ? u.value = null : u = null)
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
            C[8] || (C[8] = h("defs", null, [
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
            (r(!0), d(L, null, te(s.value.arrows, (M, T) => (r(), d("path", {
              key: `arrow-${T}`,
              class: "flowchart-arrow",
              d: M.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, qb))), 128)),
            (r(!0), d(L, null, te(s.value.nodes, (M) => (r(), d("g", {
              key: M.name,
              class: "flowchart-node"
            }, [
              h("rect", {
                x: M.x,
                y: M.y,
                width: M.width,
                height: M.height,
                rx: "8"
              }, null, 8, Db),
              h("text", {
                x: M.x + M.width / 2,
                y: M.y + M.padY + M.line / 2
              }, [
                (r(!0), d(L, null, te(M.lines, (T, H) => (r(), d("tspan", {
                  key: H,
                  x: M.x + M.width / 2,
                  dy: H ? M.line : 0
                }, g(T), 9, jb))), 128))
              ], 8, Pb)
            ]))), 128)),
            (r(!0), d(L, null, te(s.value.arrows, (M, T) => (r(), d(L, {
              key: `label-${T}`
            }, [
              M.label ? (r(), d("g", Fb, [
                h("rect", {
                  x: M.label.x,
                  y: M.label.y,
                  width: M.label.width,
                  height: M.label.height,
                  rx: "4"
                }, null, 8, Wb),
                h("text", {
                  x: M.label.x + M.label.width / 2,
                  y: M.label.y + M.label.pad + M.label.line / 2
                }, [
                  (r(!0), d(L, null, te(M.label.lines, (H, W) => (r(), d("tspan", {
                    key: W,
                    x: M.label.x + M.label.width / 2,
                    dy: W ? M.label.line : 0
                  }, g(H), 9, zb))), 128))
                ], 8, Hb)
              ])) : k("", !0)
            ], 64))), 128))
          ], 12, Nb))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Vb = /* @__PURE__ */ z(Ub, [["__scopeId", "data-v-e98799dc"]]), Gb = ["innerHTML"], Kb = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = S(() => jo[t.name] || jo.dot);
    return (a, s) => (r(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Gb));
  }
}, Bt = /* @__PURE__ */ z(Kb, [["__scopeId", "data-v-beb5935c"]]), Yb = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("span", {
      class: Y(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      E(Bt, { name: "fold" })
    ], 2));
  }
}, Zt = /* @__PURE__ */ z(Yb, [["__scopeId", "data-v-d03899bb"]]), Qb = ["data-tip", "aria-label"], Xb = {
  key: 0,
  class: "mact-word"
}, Jb = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (r(), d("button", {
      type: "button",
      class: Y(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      E(Bt, { name: "open" }),
      e.open ? (r(), d("span", Xb, g(e.label), 1)) : k("", !0),
      n[0] || (n[0] = h("span", { class: "hit" }, null, -1))
    ], 10, Qb));
  }
}, cr = /* @__PURE__ */ z(Jb, [["__scopeId", "data-v-3b292e09"]]), dr = 120, Jn = 280, fr = 160, Zb = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, ek = ["leaving", "resizing", "entering"];
function Cs(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function tk(e) {
  const t = ek.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = Cs(e);
  return e.classList.add(...t), n;
}
function mr(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = _(t()), s = _("");
  let o = 0;
  const l = (m, p) => Object.assign(m.style, { width: `${p.width}px`, height: `${p.height}px` }), i = (m) => Object.assign(m.style, { width: "", height: "", transition: "" });
  function u(m, p) {
    i(m);
    const y = tk(m);
    l(m, p), m.offsetWidth, m.style.transition = `width ${Jn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Jn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(m, y);
  }
  function c(m) {
    const p = m.querySelector(":scope > :not(.top)");
    if (!p || typeof ResizeObserver > "u") return null;
    let y = p.offsetHeight;
    const b = new ResizeObserver(() => {
      p.offsetHeight !== y && (y = p.offsetHeight, u(m, Cs(m)));
    });
    return b.observe(p), b;
  }
  async function f(m) {
    const p = e.value, y = ++o;
    if (!p || !p.offsetWidth || Zb()) {
      a.value = m;
      return;
    }
    const b = Cs(p);
    if (l(p, b), s.value = "leaving", await n(dr), y !== o) return;
    a.value = m, s.value = "resizing", await je(), u(p, b);
    const x = c(p);
    await n(Jn), x == null || x.disconnect(), y === o && (i(p), s.value = "entering", await n(fr), y === o && (s.value = ""));
  }
  return he(t, (m) => f(m)), st(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const nk = { class: "growing-card-top" }, ak = ["aria-expanded"], sk = { class: "growing-card-avatar" }, ok = { class: "growing-card-title" }, lk = { class: "growing-card-more" }, ik = { class: "growing-card-body" }, rk = {
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
    const n = e, a = t, s = _(!1), o = _(null), { folded: l, phase: i } = mr(o, () => !s.value), u = S(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), c = S(() => n.text.split(/\n\s*\n/).filter((f) => f.trim()));
    return (f, m) => (r(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: Y(["growing-card-wrap", B(i), { open: !B(l), bad: e.bad, incoming: e.incoming }])
    }, [
      h("div", nk, [
        h("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: m[0] || (m[0] = (p) => s.value = !s.value)
        }, [
          h("span", sk, [
            e.bad ? (r(), j(Bt, {
              key: 0,
              name: "cross"
            })) : u.value ? (r(), d(L, { key: 1 }, [
              U(g(u.value), 1)
            ], 64)) : (r(), j(le, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          h("span", ok, g(e.title), 1),
          E(Zt, { open: s.value }, null, 8, ["open"])
        ], 8, ak),
        e.action ? (r(), j(cr, {
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
          E(le, {
            name: "bubble",
            size: 13
          })
        ])) : k("", !0)
      ]),
      h("div", lk, [
        h("div", ik, [
          (r(!0), d(L, null, te(c.value, (p, y) => (r(), d("p", {
            key: y,
            class: "growing-card-text"
          }, g(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, uk = /* @__PURE__ */ z(rk, [["__scopeId", "data-v-f2b4930d"]]), ck = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, dk = { class: "md inline" }, fk = ["disabled", "title", "onClick"], mk = {
  key: 1,
  class: "message-links-many"
}, hk = ["aria-expanded"], pk = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, vk = ["disabled", "onClick"], gk = { class: "row-pill message-links-chip" }, yk = { class: "message-links-title" }, bk = { key: 0 }, za = 3, kk = "task", wk = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = S(() => n.total || n.links.length), o = S(() => n.links.every((p) => p.endpoint.model === kk) ? "tasks" : "items"), l = _(!1), i = _(null);
    di(i, () => l.value = !1);
    const u = () => l.value = !l.value, c = (p) => p.endpoint.unavailable || !p.endpoint.open_ref, f = (p) => p.relations.includes("edited") ? p.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function m(p) {
      c(p) || (l.value = !1, We(p.endpoint.open_ref));
    }
    return (p, y) => (r(), d("div", {
      ref_key: "line",
      ref: i,
      class: Y(["message-links", { many: s.value > za, three: s.value === za, open: l.value }]),
      "data-message-links": ""
    }, [
      E(Bt, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (r(), d("span", ck, [
        h("span", dk, [
          y[1] || (y[1] = U("Linked: ", -1)),
          (r(!0), d(L, null, te(e.links, (b) => (r(), d("button", {
            key: `${b.endpoint.model}:${b.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: c(b),
            title: b.endpoint.title,
            onClick: (x) => m(b)
          }, [
            U(g(b.endpoint.model.replaceAll("_", " ")) + " " + g(b.endpoint.id), 1),
            f(b) ? (r(), d(L, { key: 0 }, [
              U(" (" + g(f(b)) + ")", 1)
            ], 64)) : k("", !0),
            c(b) ? (r(), d(L, { key: 1 }, [
              U(" (unavailable)")
            ], 64)) : k("", !0)
          ], 8, fk))), 128))
        ])
      ])) : k("", !0),
      s.value >= za ? (r(), d("span", mk, [
        h("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: u
        }, [
          U(g(s.value) + " linked " + g(o.value) + " ", 1),
          E(Zt, { open: l.value }, null, 8, ["open"])
        ], 8, hk)
      ])) : k("", !0),
      l.value ? (r(), d("div", pk, [
        (r(!0), d(L, null, te(e.links, (b) => (r(), d("button", {
          key: `${b.endpoint.model}:${b.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: c(b),
          onClick: (x) => m(b)
        }, [
          h("span", gk, g(b.endpoint.model.replaceAll("_", " ")) + " " + g(b.endpoint.id), 1),
          h("span", yk, g(b.endpoint.title), 1),
          h("span", null, g(f(b)), 1),
          c(b) ? (r(), d("span", bk, "Unavailable")) : k("", !0)
        ], 8, vk))), 128))
      ])) : k("", !0),
      E(Mn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: y[0] || (y[0] = (b) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, $k = /* @__PURE__ */ z(wk, [["__scopeId", "data-v-843fc3bd"]]), xk = ["title", "aria-label"], Sk = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Mk = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, _k = {
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
      (r(), d("svg", Sk, [
        o[0] || (o[0] = h("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (r(), d("path", Mk)) : k("", !0)
      ]))
    ], 10, xk));
  }
}, Ck = /* @__PURE__ */ z(_k, [["__scopeId", "data-v-6dc92808"]]), Ek = {
  report: { at: 70, keep: 46 },
  message: { at: 420, keep: 320 }
}, Ak = (e) => e.worker_id != null ? "report" : "message", Ok = (e) => Ek[Ak(e)], Tk = "img,pre,table";
function Ik(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Bk(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function Rk(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Tk)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = Ik(Bk(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function Lk(e, t) {
  let n = null;
  const a = () => e.value && Rk(e.value);
  Ce(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== s && (s = i.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Re(() => n == null ? void 0 : n.disconnect()), he(t, a, { flush: "post" });
}
const Nk = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function qk(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Hn = /* @__PURE__ */ new WeakMap(), qe = "work", tt = "sent", Dk = 50, ul = 50, cl = () => ({ rows: _([]), total: _(0), next: _(null), loading: _(!1), failure: _(""), version: 0 });
function Pk(e) {
  var x;
  if (Hn.has(e)) return Hn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (C) => {
    var M;
    return ((M = e.visible) == null ? void 0 : M.value) !== !1 && [...C.views].some((T) => T.visible);
  };
  function o(C, M) {
    const T = C[M], H = ++T.version;
    return T.loading.value = !0, T.failure.value = "", H;
  }
  function l(C, M, T, H, W) {
    const I = C[M];
    if (t.get(C.id) !== C || I.version !== T) return;
    if (I.loading.value = !1, !W.ok) {
      I.failure.value = W.error;
      return;
    }
    const G = M === qe ? W.value.counterparts ?? [] : W.value.rows ?? [], q = H === 1 ? G : [...I.rows.value, ...G], A = M === qe ? (N) => `${N.endpoint.model}:${N.endpoint.id}` : (N) => N.id ?? N.target_id;
    I.rows.value = [...new Map(q.map((N) => [A(N), N])).values()], I.total.value = W.value.total ?? I.rows.value.length, I.next.value = W.value.next_page ?? null;
  }
  function i(C, M, T, H) {
    const W = C[M];
    W.version === T && (W.failure.value = H.message, W.loading.value = !1);
  }
  async function u(C, M, T) {
    const H = o(C, M), W = M === qe ? "--type about --type edited --group-counterparts" : "--type sent_to";
    try {
      l(C, M, H, T, await e.read(`link list --source message:${C.id} ${W} --page ${T} --page-size ${M === qe ? 10 : 25}`));
    } catch (I) {
      i(C, M, H, I);
    }
  }
  async function c(C) {
    const M = C.map((T) => ({ [qe]: o(T, qe), [tt]: o(T, tt) }));
    try {
      const T = await e.read(`link receipts --messages ${C.map((H) => H.id).join(",")}`);
      C.forEach((H, W) => {
        const I = T.ok ? T.value.messages[String(H.id)] : null;
        l(H, qe, M[W][qe], 1, T.ok ? { ok: !0, value: I.named } : T), l(H, tt, M[W][tt], 1, T.ok ? { ok: !0, value: I.sent } : T);
      });
    } catch (T) {
      C.forEach((H, W) => [qe, tt].forEach((I) => i(H, I, M[W][I], T)));
    }
  }
  function f() {
    a = null;
    const C = [...n].map((M) => t.get(M)).filter((M) => M && s(M));
    n.clear(), C.forEach((M) => M.dirty.clear());
    for (let M = 0; M < C.length; M += ul) c(C.slice(M, M + ul));
  }
  function m(C, M = [qe, tt]) {
    for (const T of M) C.dirty.add(T);
    s(C) && (n.add(C.id), a ?? (a = setTimeout(f, 0)));
  }
  function p(C) {
    const M = C.sources ?? (C.source_model && Number.isInteger(C.source_id) ? [{ model: C.source_model, id: C.source_id }] : []), T = C.link_types ?? (C.link_type ? [C.link_type] : []), H = T.length ? [qe, tt].filter((I) => I === qe ? T.some((G) => ["about", "edited"].includes(G)) : T.includes("sent_to")) : [qe, tt];
    if (!H.length) return;
    const W = M.length ? [...new Set(M.filter((I) => I.model === "message").map((I) => I.id))].map((I) => t.get(I)).filter(Boolean) : [...t.values()].filter(s).slice(0, Dk);
    for (const I of W) m(I, H);
  }
  const y = (x = e.follow) == null ? void 0 : x.call(e, ["link.*"], p), b = {
    attach(C, M) {
      let T = t.get(C);
      return T || (T = { id: C, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([qe, tt]), work: cl(), sent: cl() }, t.set(C, T)), T.views.add(M), T.dirty.size && m(T, [...T.dirty]), T;
    },
    shown(C) {
      C.dirty.size && m(C, [...C.dirty]);
    },
    detach(C, M) {
      C.views.delete(M), C.views.size || t.delete(C.id), t.size || (clearTimeout(a), y == null || y(), Hn.delete(e));
    },
    more(C, M) {
      const T = C == null ? void 0 : C[M];
      if (T != null && T.next.value && !T.loading.value) return u(C, M, T.next.value);
    }
  };
  return Hn.set(e, b), b;
}
function jk(e, t, n) {
  const a = nt(null);
  let s = null;
  const o = he(t, (l, i, u) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = Pk(e);
    const c = { visible: typeof IntersectionObserver > "u" }, f = s.attach(l, c);
    a.value = f;
    const m = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((y) => {
      c.visible = y.some((b) => b.isIntersecting), c.visible && s.shown(f);
    }, { rootMargin: "100px" }), p = he(n, (y) => {
      m == null || m.disconnect(), y && (m == null || m.observe(y));
    }, { immediate: !0, flush: "post" });
    u(() => {
      p(), m == null || m.disconnect(), s.detach(f, c), a.value = null;
    });
  }, { immediate: !0 });
  return ya(o), {
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
    loadMore: () => s == null ? void 0 : s.more(a.value, qe),
    loadSent: () => s == null ? void 0 : s.more(a.value, tt)
  };
}
const Fk = ["data-incoming", "data-ref"], Wk = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], Hk = { class: "message-body" }, zk = ["title"], Uk = ["innerHTML"], Vk = ["innerHTML"], Gk = {
  class: "message-faces",
  "data-message-faces": ""
}, Kk = ["title", "data-face", "onClick"], Yk = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, Qk = ["title", "data-reaction", "onClick"], Xk = {
  key: 0,
  class: "message-reaction-count"
}, Jk = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Zk = ["href", "title"], ew = ["src", "alt"], tw = ["href"], nw = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, aw = { class: "message-foot" }, sw = { class: "message-time" }, ow = {
  class: "message-id",
  "data-message-id": ""
}, lw = 1500, iw = "An earlier message", rw = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1), o = _(null), l = S(() => ["user", "comment"].includes(n.message.type)), i = S(() => {
      const [be, se] = (n.message.commented_row || ":").split(":"), Q = yt(be);
      return Q ? { ref: `${Q}:${se}`, label: `${Jt(Q).title.toLowerCase()} ${se}` } : null;
    }), u = S(() => n.message.worker_id ?? null), c = S(() => Ok(n.message)), f = S(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var be;
      await ((be = navigator.clipboard) == null ? void 0 : be.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, lw);
    }
    const p = Di(), y = S(() => p(n.message.text ?? "")), b = S(() => JSON.parse(n.message.flowchart_edges || "[]")), x = _(!1), C = S(() => xs(n.quote)), M = S(() => p(C.value || iw));
    function T() {
      const be = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      be ? be.scrollIntoView({ block: "center", behavior: "smooth" }) : We(`messages:${n.message.parent_id}`);
    }
    Lk(o, () => `${n.message.text} ${C.value}`);
    const H = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, W = (be) => `/api/files/message/${n.message.id}/${encodeURIComponent(be)}`, I = S(() => JSON.parse(n.message.captions || "{}")), G = S(() => (n.message.files ?? []).map((be) => ({ name: be, address: W(be), isImage: H.test(be), title: I.value[be] || be }))), q = S(() => Qi(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), A = _e(Le, null), { links: N, total: D, more: w, loading: v, failure: $, sentTo: O, sentMore: R, sentLoading: F, sentFailure: V, loadMore: J, loadSent: oe } = jk(A, () => l.value && !n.message.local ? n.message.id : null, o), ue = _(!1), we = S(() => qk(n.message.reactions));
    function Oe(be) {
      ue.value = !1, a("react", n.message, be);
    }
    return (be, se) => e.message.peer || e.message.recipient ? (r(), d("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      E(uk, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: se[0] || (se[0] = (Q) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Fk)) : (r(), d("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      h("div", Hk, [
        h("div", {
          ref_key: "bubble",
          ref: o,
          class: Y(["message-card", "md", { comment: i.value }]),
          onClick: se[5] || (se[5] = (...Q) => B(jt) && B(jt)(...Q))
        }, [
          i.value ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: se[1] || (se[1] = ke((Q) => B(We)(i.value.ref), ["stop"]))
          }, [
            E(le, {
              name: "bubble",
              size: 12
            }),
            h("span", null, "Comment on " + g(i.value.label), 1)
          ], 8, zk)) : k("", !0),
          e.message.parent_id ? (r(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: ke(T, ["stop"]),
            innerHTML: M.value
          }, null, 8, Uk)) : k("", !0),
          u.value !== null ? (r(), j(vn, {
            key: 2,
            as: "button",
            "agent-id": u.value,
            label: `Worker ${u.value}`,
            class: "message-worker",
            "data-message-worker": "",
            onClick: se[2] || (se[2] = ke((Q) => B(We)(`agents:${u.value}`), ["stop"]))
          }, {
            default: P(() => [
              U("Worker " + g(u.value), 1)
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : k("", !0),
          E(Ii, {
            at: c.value.at,
            keep: c.value.keep,
            name: `message:${e.message.id}`
          }, {
            default: P(() => [
              h("div", {
                "data-message-text": "",
                innerHTML: y.value
              }, null, 8, Vk)
            ]),
            _: 1
          }, 8, ["at", "keep", "name"]),
          b.value.length ? (r(), d(L, { key: 3 }, [
            h("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: se[3] || (se[3] = (Q) => x.value = !0)
            }, "Open the flowchart"),
            x.value ? (r(), j(Vb, {
              key: 0,
              title: e.message.text,
              edges: b.value,
              onClose: se[4] || (se[4] = (Q) => x.value = !1)
            }, null, 8, ["title", "edges"])) : k("", !0)
          ], 64)) : k("", !0)
        ], 2),
        h("div", {
          class: Y(["message-tools", { picking: ue.value }]),
          "data-message-tools": ""
        }, [
          ue.value ? (r(), d(L, { key: 0 }, [
            h("div", Gk, [
              (r(!0), d(L, null, te(B(Nk), (Q) => (r(), d("button", {
                key: Q,
                type: "button",
                class: "message-face",
                title: `React ${Q}`,
                "data-face": Q,
                onClick: (pe) => Oe(Q)
              }, g(Q), 9, Kk))), 128))
            ]),
            h("button", {
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
          ], 64)) : (r(), d(L, { key: 1 }, [
            h("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: se[7] || (se[7] = (Q) => ue.value = !0)
            }, "React"),
            h("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: se[8] || (se[8] = (Q) => a("reply", e.message))
            }, "Reply"),
            h("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: m
            }, g(s.value ? "Copied" : "Copy"), 1),
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
      we.value.length ? (r(), d("div", Yk, [
        (r(!0), d(L, null, te(we.value, (Q) => (r(), d("button", {
          key: Q.emoji,
          type: "button",
          class: Y(["message-reaction", { mine: Q.mine }]),
          title: Q.title,
          "data-reaction": Q.emoji,
          onClick: (pe) => a("react", e.message, Q.emoji)
        }, [
          U(g(Q.emoji) + " ", 1),
          Q.count > 1 ? (r(), d("span", Xk, g(Q.count), 1)) : k("", !0)
        ], 10, Qk))), 128))
      ])) : k("", !0),
      G.value.length ? (r(), d("div", Jk, [
        (r(!0), d(L, null, te(G.value, (Q) => (r(), d(L, {
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
            }, null, 8, ew)
          ], 8, Zk)) : (r(), d("a", {
            key: 1,
            href: Q.address,
            target: "_blank",
            class: "message-file"
          }, g(Q.name), 9, tw))
        ], 64))), 128))
      ])) : k("", !0),
      B(O).length ? (r(), d("div", nw, [
        E(le, {
          name: "send",
          size: 12
        }),
        (r(!0), d(L, null, te(B(O), (Q) => (r(), j(vn, {
          key: Q.id,
          as: "button",
          "agent-id": Q.id,
          label: `Worker ${Q.id}`,
          class: "message-sent-worker",
          disabled: Q.unavailable || !Q.open_ref,
          "data-sent-worker": Q.id,
          onClick: ke((pe) => Q.open_ref && B(We)(Q.open_ref), ["stop"])
        }, {
          default: P(() => [
            U("Also sent to worker " + g(Q.id), 1),
            Q.unavailable ? (r(), d(L, { key: 0 }, [
              U(" (unavailable)")
            ], 64)) : k("", !0)
          ]),
          _: 2
        }, 1032, ["agent-id", "label", "disabled", "data-sent-worker", "onClick"]))), 128))
      ])) : k("", !0),
      E(Mn, {
        more: B(R),
        loading: B(F),
        failure: B(V),
        label: "More recipients",
        onMore: B(oe)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      h("div", aw, [
        h("time", sw, g(q.value), 1),
        Number.isInteger(e.message.id) ? (r(), d(L, { key: 0 }, [
          se[10] || (se[10] = h("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          h("span", ow, "message " + g(e.message.id), 1)
        ], 64)) : k("", !0),
        l.value ? (r(), j(Ck, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : k("", !0)
      ]),
      B(N).length || B($) ? (r(), j($k, {
        key: 3,
        links: B(N),
        total: B(D),
        more: B(w),
        loading: B(v),
        failure: B($),
        onMore: B(J)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : k("", !0)
    ], 8, Wk));
  }
}, k_ = /* @__PURE__ */ z(rw, [["__scopeId", "data-v-95d3070e"]]), ua = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Ua = 200, hr = (e) => {
  var t;
  return ((t = ua.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? ua[0].key;
}, w_ = (e) => {
  var t;
  return ((t = ua.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, uw = ["aria-label"], cw = 300, dl = 400, dw = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Ua } },
  setup(e) {
    const t = e, n = S(() => hr(t.value)), a = S(() => n.value < Ua ? [1, 0.25, 0.25] : n.value === Ua ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (r(), d("svg", {
      class: Y(["ico", "prio", { hot: n.value >= dl, high: n.value >= cw && n.value < dl }]),
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
    ], 10, uw));
  }
}, $_ = /* @__PURE__ */ z(dw, [["__scopeId", "data-v-b10e610f"]]), pr = ["a line or two, nothing to decide", "one file, the way is clear", "a few files in one module", "several modules, or a choice to make", "core paths, migrations, concurrency, or a design"], x_ = (e) => {
  const t = pr[e - 1];
  return t.slice(0, 1).toUpperCase() + t.slice(1);
}, fw = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, fl = (e) => fw[e.card.state] || "idle", mw = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), ml = { working: 0, waiting: 1, idle: 2, stopped: 3 }, hl = (e, t) => ml[fl(e)] - ml[fl(t)], pl = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, S_ = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => hl(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || mw(a, s)) : [...e].sort((a, s) => hl(a, s) || (pl[t] || pl.state)(a, s)), hw = { class: "list-row" }, pw = {
  key: 0,
  class: "list-row-type"
}, vw = { class: "list-row-main" }, gw = {
  key: 0,
  class: "list-row-title"
}, yw = { class: "list-row-body" }, bw = {
  key: 1,
  class: "list-row-end"
}, kw = {
  key: 1,
  class: "list-row-text"
}, ww = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (r(), d("div", hw, [
      e.type ? (r(), d("span", pw, g(e.type), 1)) : k("", !0),
      h("div", vw, [
        e.title ? (r(), d("span", gw, g(e.title), 1)) : k("", !0),
        h("div", yw, [
          ie(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (r(), d("div", bw, [
          ie(t.$slots, "end", {}, void 0, !0)
        ])) : k("", !0)
      ]),
      e.text ? (r(), d("span", kw, g(e.text), 1)) : k("", !0)
    ]));
  }
}, M_ = /* @__PURE__ */ z(ww, [["__scopeId", "data-v-dfc8c3a7"]]), __ = {
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
    return (l, i) => (r(), j(Ks, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${e.title} model`,
      onPick: i[0] || (i[0] = (u) => a("pick", u.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, $w = {
  __name: "InspectorActions",
  props: { inline: Boolean },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: Y(["inspector-actions", { inline: e.inline }]),
      "data-inspector-actions": ""
    }, [
      ie(t.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, Es = /* @__PURE__ */ z($w, [["__scopeId", "data-v-978e0921"]]), xw = ["aria-label"], Sw = { class: "head" }, Mw = { class: "names" }, _w = { class: "body" }, Cw = {
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
    return (u, c) => (r(), j(Sn, { to: "body" }, [
      E(Yt, {
        name: "side",
        appear: "",
        onAfterLeave: B(l)
      }, {
        default: P(() => [
          B(s) ? (r(), d("div", {
            key: 0,
            class: Y(["veil", { over: e.over, under: e.depth }]),
            style: ge({ "--depth": e.depth, zIndex: B(i) }),
            "data-side-panel": "",
            onClick: c[0] || (c[0] = ke((...f) => B(o) && B(o)(...f), ["self"]))
          }, [
            h("aside", {
              class: Y(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (r(), d(L, { key: 0 }, [
                h("header", Sw, [
                  h("div", Mw, [
                    h("h2", null, g(e.title), 1),
                    e.abstract ? (r(), j(rt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : k("", !0),
                    ie(u.$slots, "meta", {}, void 0, !0)
                  ]),
                  ie(u.$slots, "actions", {}, void 0, !0),
                  E(ba, {
                    title: e.closeLabel,
                    onClick: B(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                u.$slots.foot && !e.footBelow ? (r(), j(Es, { key: 0 }, {
                  default: P(() => [
                    ie(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0),
                h("div", _w, [
                  ie(u.$slots, "default", {}, void 0, !0)
                ]),
                u.$slots.foot && e.footBelow ? (r(), j(Es, {
                  key: 1,
                  class: "below"
                }, {
                  default: P(() => [
                    ie(u.$slots, "foot", {}, void 0, !0)
                  ]),
                  _: 3
                })) : k("", !0)
              ], 64)) : ie(u.$slots, "default", {}, void 0, !0, 1)
            ], 10, xw)
          ], 6)) : k("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, C_ = /* @__PURE__ */ z(Cw, [["__scopeId", "data-v-d0a677ef"]]), Ew = {
  key: 1,
  class: "text-field-label"
}, Aw = {
  key: 2,
  class: "text-field-end"
}, Ow = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ zt({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
    const n = fn(e, "modelValue"), a = ga(), s = "onUpdate:modelValue" in (((f = Su()) == null ? void 0 : f.vnode.props) || {}), o = S(() => s ? n.value : a.value), l = (m) => s && (n.value = m.target.value), i = S(
      () => Object.fromEntries(Object.entries(a).filter(([m]) => m !== "class" && m !== "style" && m !== "value"))
    ), u = S(() => Object.fromEntries(Object.entries(a).filter(([m]) => m !== "value"))), c = _(null);
    return t({ focus: () => c.value && c.value.focus() }), (m, p) => e.label || e.icon || m.$slots.end ? (r(), d("label", {
      key: 0,
      class: Y(["text-field", { large: e.large, ended: m.$slots.end }, B(a).class]),
      style: ge(B(a).style)
    }, [
      e.icon ? (r(), j(le, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : k("", !0),
      e.label ? (r(), d("span", Ew, g(e.label), 1)) : k("", !0),
      Me(h("input", Pe({
        ref_key: "input",
        ref: c,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: l }), null, 16), [
        [B(bs), o.value]
      ]),
      m.$slots.end ? (r(), d("span", Aw, [
        ie(m.$slots, "end", {}, void 0, !0)
      ])) : k("", !0)
    ], 6)) : Me((r(), d("input", Pe({
      key: 1,
      ref_key: "input",
      ref: c,
      class: "text-input",
      spellcheck: "false"
    }, u.value, { onInput: l }), null, 16)), [
      [B(bs), o.value]
    ]);
  }
}), E_ = /* @__PURE__ */ z(Ow, [["__scopeId", "data-v-d9c38ca8"]]), Tw = {
  class: "page-header",
  "data-page-header": ""
}, Iw = { class: "page-title" }, Bw = {
  key: 0,
  class: "page-count",
  "data-page-count": ""
}, Rw = { class: "page-header-end" }, Lw = {
  __name: "PageHeader",
  props: { title: { type: String, required: !0 }, count: { type: Number, default: null } },
  setup(e) {
    return (t, n) => (r(), d("header", Tw, [
      h("h1", Iw, [
        U(g(e.title), 1),
        e.count !== null ? (r(), d("span", Bw, g(e.count), 1)) : k("", !0)
      ]),
      h("span", Rw, [
        ie(t.$slots, "primary", {}, void 0, !0),
        ie(t.$slots, "actions", {}, void 0, !0)
      ])
    ]));
  }
}, A_ = /* @__PURE__ */ z(Lw, [["__scopeId", "data-v-78e5d537"]]);
function vr(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
function O_(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const T_ = () => ({}), Nw = (e) => Object.fromEntries(e.filter((t) => {
  var n;
  return (n = t.default) == null ? void 0 : n.length;
}).map((t) => [t.key, { not: !1, values: [...t.default] }])), gr = (e, t) => {
  const n = (t == null ? void 0 : t.values) ?? [], a = e.default ?? [];
  return !(t != null && t.not) && n.length === a.length && a.every((s) => n.includes(s));
}, yr = (e) => !!(e != null && e.values.length), I_ = (e, t, n = (a) => a) => [...new Set(e.flatMap((a) => [].concat(t(a))).filter((a) => a != null && a !== ""))].map((a) => [a, n(a)]), qw = (e, t, n) => t.filter((a) => [].concat(e.get(a)).includes(n)).length;
function B_(e, t, n, a = "", s = []) {
  return e.filter((o) => t.every((l) => Dw(o, l, n[l.key])) && (!a.trim() || vr(o, a, s)));
}
function Dw(e, t, n) {
  if (!yr(n)) return !0;
  const a = [].concat(t.get(e)), s = n.values.some((o) => a.includes(o));
  return n.not ? !s : s;
}
const Pw = { class: "filter-ways" }, jw = { class: "filter-count" }, Fw = {
  __name: "FilterChoices",
  props: { field: { type: Object, required: !0 }, rows: { type: Array, required: !0 }, modelValue: { type: Object, default: null } },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = [
      { key: "is", label: "is" },
      { key: "not", label: "is not" }
    ], o = () => n.modelValue ?? { not: !1, values: [] }, l = (c) => a("update:modelValue", c.values.length ? c : null), i = (c) => l({ ...o(), not: c === "not" }), u = (c) => l({ ...o(), values: o().values.includes(c) ? o().values.filter((f) => f !== c) : [...o().values, c] });
    return (c, f) => (r(), d(L, null, [
      h("div", Pw, [
        E(Ot, {
          options: s,
          value: o().not ? "not" : "is",
          onPick: i
        }, null, 8, ["value"])
      ]),
      (r(!0), d(L, null, te(e.field.options, ([m, p]) => (r(), j(He, {
        key: m,
        checked: o().values.includes(m),
        "data-filter-option": m,
        onClick: (y) => u(m)
      }, {
        default: P(() => [
          U(g(p) + " ", 1),
          h("span", jw, g(B(qw)(e.field, e.rows, m)), 1)
        ]),
        _: 2
      }, 1032, ["checked", "data-filter-option", "onClick"]))), 128))
    ], 64));
  }
}, br = /* @__PURE__ */ z(Fw, [["__scopeId", "data-v-4e84eb6e"]]), Ww = ["data-filter-chip"], Hw = ["aria-expanded"], zw = {
  key: 0,
  "data-filter-value": ""
}, Uw = ["aria-label"], Vw = {
  __name: "FilterChip",
  props: { field: { type: Object, required: !0 }, rows: { type: Array, required: !0 }, modelValue: { type: Object, default: null } },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(null), o = S(() => yr(n.modelValue)), l = S(() => !gr(n.field, n.modelValue)), i = S(() => n.modelValue.values.map((f) => {
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
        h("span", null, g(e.field.label), 1),
        o.value ? (r(), d("b", zw, g(e.modelValue.not ? "is not " : ": ") + g(i.value), 1)) : k("", !0),
        E(le, {
          name: "caret",
          size: 10
        })
      ], 8, Hw),
      o.value && l.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "filter-chip-clear",
        "data-filter-clear": "",
        "aria-label": `Clear ${e.field.label}`,
        onClick: u
      }, [
        E(le, {
          name: "close",
          size: 9
        })
      ], 8, Uw)) : k("", !0),
      s.value ? (r(), j(Xt, {
        key: 1,
        anchor: s.value,
        align: "start",
        "min-width": 240,
        "max-width": 320,
        onClick: m[1] || (m[1] = ke(() => {
        }, ["stop"])),
        onClose: m[2] || (m[2] = (p) => s.value = null)
      }, {
        default: P(() => [
          E(br, {
            field: e.field,
            rows: e.rows,
            "model-value": e.modelValue,
            "onUpdate:modelValue": m[0] || (m[0] = (p) => a("update:modelValue", p))
          }, null, 8, ["field", "rows", "model-value"])
        ]),
        _: 1
      }, 8, ["anchor"])) : k("", !0)
    ], 10, Ww));
  }
}, Gw = /* @__PURE__ */ z(Vw, [["__scopeId", "data-v-0cc7efe6"]]), Kw = {
  class: "search-bar",
  "data-search-bar": ""
}, Yw = { class: "search-bar-control" }, Qw = ["value", "placeholder", "aria-label"], Xw = ["aria-expanded"], Jw = {
  key: 0,
  "data-menu-count": ""
}, Zw = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var M;
    const a = e, s = n, o = Mu(), l = ((M = _e(Le, null)) == null ? void 0 : M.search) ?? {}, i = S(() => l.placeholder || a.placeholder), u = l.context ?? [], c = _(null), f = _(null), m = _([]), p = S(() => m.value.length ? m.value[m.value.length - 1].next : u), y = S(() => !!o.menu || u.length > 0), b = (T) => {
      m.value = [], f.value = f.value ? null : T.currentTarget;
    };
    function x(T) {
      if (T.next.length) {
        m.value = [...m.value, T];
        return;
      }
      f.value = null, s("pick", T.click);
    }
    function C() {
      var T;
      s("update:modelValue", ""), (T = c.value) == null || T.focus();
    }
    return t({ focus: () => {
      var T;
      return (T = c.value) == null ? void 0 : T.focus();
    } }), (T, H) => {
      var W;
      return r(), d("div", Kw, [
        h("div", Yw, [
          E(le, {
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
            onInput: H[0] || (H[0] = (I) => s("update:modelValue", I.target.value)),
            onKeydown: At(C, ["esc"])
          }, null, 40, Qw),
          e.modelValue ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: C
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
            e.menuCount ? (r(), d("span", Jw, g(e.menuCount), 1)) : k("", !0),
            E(le, {
              name: "caret",
              size: 12
            })
          ], 8, Xw)) : k("", !0)
        ]),
        (W = B(l).button) != null && W.title ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: H[1] || (H[1] = (I) => s("pick", B(l).button.click))
        }, g(B(l).button.title), 1)) : k("", !0),
        ie(T.$slots, "default", {}, void 0, !0),
        f.value ? (r(), j(Xt, {
          key: 1,
          anchor: f.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: H[3] || (H[3] = ke(() => {
          }, ["stop"])),
          onClose: H[4] || (H[4] = (I) => f.value = null)
        }, {
          default: P(() => [
            m.value.length ? (r(), j(He, {
              key: 0,
              "data-search-back": "",
              onClick: H[2] || (H[2] = (I) => m.value = m.value.slice(0, -1))
            }, {
              default: P(() => [
                U("‹ " + g(m.value[m.value.length - 1].title), 1)
              ]),
              _: 1
            })) : k("", !0),
            (r(!0), d(L, null, te(p.value, (I) => (r(), j(He, {
              key: I.title,
              description: I.subtext,
              "data-search-entry": I.title,
              onClick: (G) => x(I)
            }, {
              default: P(() => [
                U(g(I.title) + g(I.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            m.value.length ? k("", !0) : ie(T.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : k("", !0)
      ]);
    };
  }
}, kr = /* @__PURE__ */ z(Zw, [["__scopeId", "data-v-45374bed"]]), e2 = ["aria-expanded"], t2 = {
  key: 0,
  class: "filter-count",
  "data-filter-count": ""
}, n2 = 72, a2 = {
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
    const n = e, a = t, s = _(null), o = _(null), l = _([]), i = S(() => n.fields.filter((y) => l.value.includes(y.key))), u = S(() => n.fields.some((y) => !gr(y, n.modelValue[y.key])) || !!n.words.trim()), c = (y, b) => a("update:modelValue", { ...n.modelValue, [y]: b }), f = () => {
      a("update:modelValue", Nw(n.fields)), a("update:words", "");
    };
    async function m() {
      if (!s.value) return;
      l.value = [], await je();
      const y = s.value.clientWidth;
      y && (l.value = [...s.value.querySelectorAll("[data-filter-chip]")].filter((b) => b.offsetLeft + b.offsetWidth > y - n2).map((b) => b.dataset.filterChip));
    }
    let p = null;
    return Ce(() => {
      m(), p = new ResizeObserver(m), p.observe(s.value);
    }), Re(() => p == null ? void 0 : p.disconnect()), he(() => [n.fields.length, n.modelValue], () => m(), { flush: "post" }), (y, b) => (r(), j(kr, {
      "model-value": e.words,
      class: "filter-bar",
      placeholder: e.placeholder,
      "data-filter-bar": "",
      "onUpdate:modelValue": b[3] || (b[3] = (x) => a("update:words", x))
    }, {
      default: P(() => [
        h("div", {
          ref_key: "chips",
          ref: s,
          class: "filter-chips"
        }, [
          (r(!0), d(L, null, te(e.fields, (x) => Me((r(), j(Gw, {
            key: x.key,
            field: x,
            rows: e.rows,
            "model-value": e.modelValue[x.key] ?? null,
            "onUpdate:modelValue": (C) => c(x.key, C)
          }, null, 8, ["field", "rows", "model-value", "onUpdate:modelValue"])), [
            [Ws, !l.value.includes(x.key)]
          ])), 128))
        ], 512),
        i.value.length ? (r(), d(L, { key: 0 }, [
          h("button", {
            type: "button",
            class: "filter-more",
            "data-filter-more": "",
            "aria-haspopup": "menu",
            "aria-expanded": !!o.value,
            onClick: b[0] || (b[0] = (x) => o.value = o.value ? null : x.currentTarget)
          }, "More", 8, e2),
          o.value ? (r(), j(Xt, {
            key: 0,
            anchor: o.value,
            align: "end",
            "min-width": 240,
            "max-width": 320,
            onClick: b[1] || (b[1] = ke(() => {
            }, ["stop"])),
            onClose: b[2] || (b[2] = (x) => o.value = null)
          }, {
            default: P(() => [
              (r(!0), d(L, null, te(i.value, (x) => (r(), d(L, {
                key: x.key
              }, [
                E(bt, null, {
                  default: P(() => [
                    U(g(x.label), 1)
                  ]),
                  _: 2
                }, 1024),
                E(br, {
                  field: x,
                  rows: e.rows,
                  "model-value": e.modelValue[x.key] ?? null,
                  "onUpdate:modelValue": (C) => c(x.key, C)
                }, null, 8, ["field", "rows", "model-value", "onUpdate:modelValue"])
              ], 64))), 128))
            ]),
            _: 1
          }, 8, ["anchor"])) : k("", !0)
        ], 64)) : k("", !0),
        u.value ? (r(), d(L, { key: 1 }, [
          e.shown !== null ? (r(), d("span", t2, g(e.shown) + " of " + g(e.rows.length), 1)) : k("", !0),
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
}, R_ = /* @__PURE__ */ z(a2, [["__scopeId", "data-v-6580d498"]]), s2 = { class: "title" }, o2 = { class: "state" }, l2 = {
  __name: "StateRows",
  props: {
    term: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = ms(t.line, t.events);
    return (o, l) => (r(), j(fb, {
      rows: B(n),
      failure: B(a),
      loaded: B(s),
      empty: e.empty
    }, {
      default: P(({ row: i }) => [
        h("span", s2, g(i.title), 1),
        h("span", o2, g(B(hn)(e.term, i.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, L_ = /* @__PURE__ */ z(l2, [["__scopeId", "data-v-6be0c59e"]]);
function i2(e = 1e3, t = null) {
  const n = _(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? he(t, s, { immediate: !0 }) : s(!0), Re(() => clearInterval(a)), n;
}
const Va = _(Date.now() / 1e3);
let vl = 0, zn = 0;
function ho() {
  return zn || (Va.value = Date.now() / 1e3, vl = setInterval(() => Va.value = Date.now() / 1e3, 1e3)), zn += 1, Kl() && ya(() => {
    zn -= 1, zn || clearInterval(vl);
  }), Va;
}
const r2 = 200, u2 = dr + Jn + fr + r2, c2 = 300, Un = /* @__PURE__ */ new WeakMap();
function d2(e, t) {
  const n = Un.get(e) ?? [];
  Un.set(e, [...n, t]), !n.length && setTimeout(() => {
    const a = Un.get(e);
    Un.delete(e), e.run(["developer", "record-mark-motion", JSON.stringify(a)]);
  }, c2);
}
function tn(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function f2(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: tn(e),
    top: tn(e.querySelector(".top")),
    title: tn(e.querySelector(".title")),
    contents: tn(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var l, i, u, c;
      return `${((i = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : i.className) || ((c = (u = o.effect) == null ? void 0 : u.target) == null ? void 0 : c.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: i, boxSizing: u, transform: c, display: f }) => ({ width: o, minWidth: l, maxWidth: i, boxSizing: u, transform: c, display: f }))(getComputedStyle(e)),
    parent: tn(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function m2(e, t, n, a) {
  he(t, (s) => {
    var c;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((c = a.markMotion) != null && c.value)) return;
    const l = performance.now(), i = [];
    function u() {
      if (a.markMotion.value) {
        if (i.push(f2(o, l, n.value)), performance.now() - l < u2) return void requestAnimationFrame(u);
        d2(a, { key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i });
      }
    }
    u();
  }, { flush: "sync" });
}
const h2 = ["title", "data-figure-mark", "data-folded", "data-open"], p2 = {
  key: 2,
  class: "worker"
}, v2 = { class: "head" }, g2 = { key: 0 }, y2 = {
  key: 3,
  class: "status"
}, b2 = {
  key: 0,
  class: "figure"
}, k2 = {
  key: 1,
  class: "ran-for"
}, w2 = { key: 2 }, $2 = {
  key: 3,
  class: "news"
}, x2 = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, S2 = {
  key: 6,
  class: "settled"
}, M2 = {
  key: 1,
  class: "bar"
}, _2 = {
  key: 3,
  class: "detail body"
}, C2 = {
  key: 0,
  class: "body-label"
}, E2 = ["title"], A2 = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ga(), a = ["onClick", "onAct"], s = S(() => Object.fromEntries(Object.entries(n).filter(([ue]) => !a.includes(ue)))), o = _(!1), l = S(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = S(() => t.open !== void 0), u = S(() => i.value || l.value), c = S(() => i.value ? t.open : o.value), f = S(() => i.value ? !t.open : l.value && !o.value), m = S(() => !!(t.mark.action && n.onAct)), p = S(() => u.value || m.value || !!n.onClick), y = _(null), b = _(null), { folded: x, phase: C } = mr(y, () => f.value);
    m2(y, f, C, _e(Le, null));
    function M(ue) {
      var we, Oe;
      if (!(ue.target !== y.value && !b.value.contains(ue.target))) {
        if (i.value) return (we = n.onClick) == null ? void 0 : we.call(n, ue);
        if (l.value) return void (o.value = !o.value);
        (Oe = n.onAct || n.onClick) == null || Oe(ue);
      }
    }
    const T = (ue) => n.onAct(ue), H = ["failed", "unfinished"], W = S(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? H.includes(t.mark.state) ? "danger" : "good" : ""), I = S(() => t.mark.color ? t.mark.color : W.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : W.value ? `var(--tone-${W.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), G = S(() => I.value || "var(--tone-work)"), q = S(() => !t.mark.ending && !t.mark.ended && W.value !== "stopped"), A = ho(), N = S(
      () => t.mark.began_at && q.value && !t.mark.figure && !t.mark.counting ? Xi(A.value - t.mark.began_at) : ""
    ), D = S(() => {
      const { started: ue, ended: we } = t.mark;
      return ue ? we ? `ran ${sl(we - ue, !0)}` : sl(A.value - ue, !0) : N.value;
    }), w = ["bad", "danger", "warn"], v = S(() => w.includes(W.value) || t.mark.asks ? "attention" : q.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), $ = ["bad", "danger"], O = S(() => $.includes(W.value)), R = S(() => v.value === "process" ? "running" : O.value ? "cross" : W.value === "stopped" ? "stopped" : W.value === "good" ? "tick" : ""), F = S(
      () => !!(t.mark.figure || D.value || t.mark.docked || t.mark.stopping || R.value || t.mark.settled || t.mark.news)
    ), V = S(() => t.mark.markIcon ? { component: Bt, props: { class: "ico", name: t.mark.markIcon } } : { component: le, props: { name: t.mark.icon || "dot" } }), J = S(() => [t.mark.title, t.mark.time ? Qi(t.mark.time) : ""].filter(Boolean).join(" · ")), oe = S(() => ({
      ...I.value ? { "--mark": I.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ue, we) => (r(), d("div", Pe(s.value, {
      ref_key: "root",
      ref: y,
      class: [
        "mark",
        `w-${v.value}`,
        B(C),
        {
          open: c.value,
          folding: i.value && f.value,
          live: p.value,
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
      "data-folded": B(x) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: M
    }), [
      (r(), j(Qe(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: b,
        class: "top",
        type: p.value ? "button" : void 0,
        "aria-expanded": u.value ? String(!!c.value) : void 0
      }, {
        default: P(() => [
          e.mark.agentId ? (r(), j(vn, {
            key: 0,
            "agent-id": e.mark.agentId,
            label: e.mark.label,
            class: "agent-icon",
            "data-mark-agent": ""
          }, {
            default: P(() => [
              (r(), j(Qe(V.value.component), fs(Yl(V.value.props)), null, 16))
            ]),
            _: 1
          }, 8, ["agent-id", "label"])) : (r(), j(Qe(V.value.component), fs(Pe({ key: 1 }, V.value.props)), null, 16)),
          e.mark.worker ? (r(), d("span", p2, g(e.mark.worker), 1)) : k("", !0),
          h("span", v2, [
            E(rt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (r(), d("strong", g2, g(e.mark.name), 1)) : k("", !0),
            u.value ? (r(), j(Zt, {
              key: 1,
              open: !!c.value
            }, null, 8, ["open"])) : k("", !0)
          ]),
          F.value ? (r(), d("span", y2, [
            e.mark.figure ? (r(), d("span", b2, g(e.mark.figure), 1)) : k("", !0),
            D.value ? (r(), d("span", k2, g(D.value), 1)) : k("", !0),
            e.mark.stopping ? (r(), d("span", w2, "Stopping")) : k("", !0),
            e.mark.news ? (r(), d("span", $2, g(e.mark.news), 1)) : k("", !0),
            R.value === "running" ? (r(), d("span", x2)) : R.value ? (r(), j(Bt, {
              key: 5,
              class: Y(["sign", R.value]),
              name: R.value
            }, null, 8, ["class", "name"])) : k("", !0),
            e.mark.settled ? (r(), d("span", S2, g(e.mark.settled), 1)) : k("", !0)
          ])) : k("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      m.value ? (r(), j(cr, {
        key: 0,
        label: e.mark.action,
        open: !!c.value,
        onClick: ke(T, ["stop"])
      }, null, 8, ["label", "open"])) : k("", !0),
      (e.mark.figure || e.mark.counting) && q.value ? (r(), d("span", M2, [
        h("span", {
          class: "progress",
          style: ge({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: G.value })
        }, null, 4)
      ])) : k("", !0),
      e.mark.detail && !B(x) ? (r(), j(rt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      e.mark.body && !B(x) ? (r(), d("div", _2, [
        e.mark.bodyLabel ? (r(), d("p", C2, g(e.mark.bodyLabel), 1)) : k("", !0),
        E(rt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : k("", !0),
      e.mark.command && !B(x) ? (r(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, g(e.mark.command), 9, E2)) : k("", !0),
      e.mark.card ? (r(), j(rt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : k("", !0),
      ie(ue.$slots, "default", {
        shown: !B(x)
      }, void 0, !0)
    ], 16, h2));
  }
}), wr = /* @__PURE__ */ z(A2, [["__scopeId", "data-v-6e839007"]]), O2 = 8, T2 = 40, I2 = [];
class po {
  constructor(t, n, { top: a = O2, development: s = !1 } = {}) {
    Object.assign(this, { name: t, source: n, top: a, development: s }), this.breaches = [], this.shown = !1, this.loading = !1, s && I2.push(this);
  }
  // a feed over a window's rows, as `useRows` and a window's props give them: refs of the rows, whether they loaded and whether more follow
  static ofRows(t, n, a) {
    return new po(t, {
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
    n > T2 && this.breach(`opened ${n}px above the bottom`), this.source.count() > this.source.pageSize() && this.breach(`opened with ${this.source.count()} rows, more than the newest page of ${this.source.pageSize()}`);
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
    return o > this.source.pageSize() && this.breach(`one scroll up added ${o} rows, a page is ${this.source.pageSize()}`), s && t && (await je(), t.scrollTop += t.scrollHeight - a), s;
  }
  // rows too few to scroll leave no way to reach the top, so earlier pages are read until the pane scrolls or none is left
  async fill(t) {
    for (; t.clientHeight > 0 && t.scrollHeight <= t.clientHeight && this.source.more() && await this.scrollUp(); ) await je();
  }
}
const B2 = 60, R2 = 300, $r = (e) => (t) => e.readKey(`output.${t[2]}`, t[3] ? { [t[3].slice(2)]: t[4] } : {});
function xr(e, t) {
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
  const c = new po("output", { loaded: () => s >= 0, count: () => n.value.length, pageSize: () => R2, more: () => a.value > 0, previous: u }, { top: B2 });
  return { lines: n, newest: l, follow: i, loadEarlier: (m) => c.reachTop(m), feed: c };
}
const L2 = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function Sr(e) {
  var n;
  const t = L2[e] || ((n = Jt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open";
}
const N2 = (e) => Sr(String(e).split(":")[0]), q2 = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), D2 = "agents", P2 = { passed: "good", failed: "danger", warned: "warn", running: "" }, j2 = { good: "good", warn: "warn", danger: "danger" }, gl = {
  "open row": (e) => We(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Mm(e.target_model, e.target_id || 0)
}, F2 = { "open row": (e) => N2(e.target_model), "open page": () => Sr("pages") };
function W2(e, t) {
  const n = t || {}, a = gl[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? P2[e.outcome] || "" : j2[e.variant] || "",
    label: e.text,
    // a mark about an agent shows the agent's tooltip on its icon
    agentId: e.target_model === D2 ? e.target_id : 0,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? F2[a](e) : "",
    handlers: a ? { onAct: () => gl[a](e) } : {}
  };
}
const H2 = 24, z2 = 1e3, yl = 2e3, U2 = 0.25, V2 = 5e3;
function G2(e, t = H2, n = () => !0) {
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
    const I = Date.now() - u < yl ? yl : z2;
    l = setTimeout(() => o.value = a.value, I);
  }
  function y() {
    clearTimeout(i), a.value = !1, s.value = 0, p(!1);
  }
  function b(W = !1) {
    const I = c();
    I && W && I.scrollTo ? I.scrollTo({ top: I.scrollHeight, behavior: "smooth" }) : I && (I.scrollTop = I.scrollHeight), y();
  }
  function x() {
    M(), !a.value && (a.value = !0, p(!0));
  }
  const C = () => !!c() && f() <= c().clientHeight * U2;
  function M() {
    clearTimeout(i), C() && (i = setTimeout(() => a.value && C() && n() && b(!0), V2));
  }
  function T() {
    m() ? y() : x();
  }
  function H(W = 1, I = !1) {
    a.value ? s.value += Math.max(0, W) : b(I);
  }
  return Kl() && ya(() => [l, i].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: f, atBottom: m, follow: y, toBottom: b, left: x, scrolled: T, arrived: H };
}
const K2 = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Y2 = (e) => String(e ?? "").replace(K2, ""), Q2 = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." }, feed: { type: Object, default: null } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(null), { away: o, scrolled: l, arrived: i, toBottom: u } = G2(s);
    he(
      () => [n.lines, n.lines.length],
      () => je(() => {
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
      U(g(B(Y2)(e.lines.join(`
`)) || e.empty), 1),
      B(o) ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: m[0] || (m[0] = (p) => B(u)(!0))
      }, "Follow")) : k("", !0)
    ], 544));
  }
}, X2 = /* @__PURE__ */ z(Q2, [["__scopeId", "data-v-89621acd"]]), J2 = "*.*", Z2 = {
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
    const t = e, n = _e(Le, null), a = new li();
    he(
      () => a.patterns,
      (u, c, f) => {
        var p;
        const m = (p = n == null ? void 0 : n.subscriptions) == null ? void 0 : p.follow(`body of ${t.declaration.type}`, u, (y) => a.dispatch(y));
        f(() => m == null ? void 0 : m());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = S(() => !!(t.declaration.shipped || t.declaration.trusted)), i = S(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the user trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [J2] : t.declaration.events ?? [],
      options: []
    }));
    return (u, c) => l.value ? (r(), j(ir, {
      key: 0,
      entry: i.value,
      subscriptions: B(a),
      environment: B(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded, collapsed: e.collapsed }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (r(), j(lr, {
      key: 1,
      entry: i.value,
      subscriptions: B(a),
      environment: B(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, e$ = { class: "mark-more-inner" }, t$ = {
  class: "mark-lines",
  "data-mark-reason": ""
}, n$ = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, a$ = {
  key: 3,
  class: "mark-lines"
}, s$ = "process", bl = "task", o$ = {
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
    const t = e, n = ot(), a = S(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = S(() => q2.has(t.mark.variant) && t.mark.detail || ""), o = S(() => t.mark.target_model === bl ? t.mark.target_id : 0), l = xr(
      $r(n),
      () => t.mark.target_id
    ), i = l.lines, u = _(!1), c = _(""), f = S(() => !t.declaration.body_url && t.mark.target_model === s$ && !!t.mark.target_id);
    async function m(y = l.follow) {
      const b = await y();
      u.value = !0, c.value = b.ok ? "" : b.error;
    }
    const p = S(() => t.shown && f.value);
    return he(p, (y) => y && m()), zs(() => p.value && m(), () => p.value && !t.mark.ended_at), he(
      () => t.mark.ended_at,
      (y) => y && p.value && m(l.newest)
    ), (y, b) => (r(), d("div", {
      class: Y(["mark-more", { open: e.shown }]),
      onClick: b[1] || (b[1] = ke(() => {
      }, ["stop"]))
    }, [
      h("div", e$, [
        e.declaration.body_url ? (r(), j(Z2, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded,
          collapsed: e.collapsed
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded", "collapsed"])) : (r(), d(L, { key: 1 }, [
          s.value ? (r(), d(L, { key: 0 }, [
            b[2] || (b[2] = h("p", { class: "mark-label" }, "Why it stopped", -1)),
            h("p", t$, g(s.value), 1)
          ], 64)) : k("", !0),
          f.value && c.value ? (r(), d("p", n$, g(c.value), 1)) : f.value && u.value ? (r(), d(L, { key: 2 }, [
            b[3] || (b[3] = h("p", { class: "mark-label" }, "Output", -1)),
            E(X2, {
              class: "mark-terminal",
              lines: B(i),
              feed: B(l).feed,
              onOlder: B(l).loadEarlier
            }, null, 8, ["lines", "feed", "onOlder"])
          ], 64)) : a.value.length ? (r(), d("p", a$, g(a.value.join(`
`)), 1)) : k("", !0),
          o.value ? (r(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: b[0] || (b[0] = ke((x) => B(We)(`${bl}:${o.value}`), ["stop"]))
          }, " Open task " + g(o.value) + " and its proofs ", 1)) : k("", !0)
        ], 64))
      ])
    ], 2));
  }
}, As = /* @__PURE__ */ z(o$, [["__scopeId", "data-v-df71b15a"]]), l$ = ["title", "aria-label", "onClick"], i$ = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, r$ = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = S(() => Xf(t.buttons, t.allowedRuns).filter((l) => {
      var i;
      return !((i = l.variants) != null && i.length) || l.variants.includes(t.mark.variant);
    })), a = _(""), s = _e(Le);
    async function o(l) {
      const i = await _n(l, { id: t.mark.target_id }, s.environment);
      a.value = i.ok ? "" : i.error;
    }
    return (l, i) => (r(), d(L, null, [
      (r(!0), d(L, null, te(n.value, (u) => (r(), d("button", {
        key: u.runs,
        type: "button",
        class: "mark-button",
        title: u.label,
        "aria-label": u.label,
        onClick: ke((c) => o(u), ["stop"])
      }, [
        E(Bt, {
          name: u.icon
        }, null, 8, ["name"])
      ], 8, l$))), 128)),
      a.value ? (r(), d("span", i$, g(a.value), 1)) : k("", !0)
    ], 64));
  }
}, u$ = /* @__PURE__ */ z(r$, [["__scopeId", "data-v-7a62c88e"]]);
function Mr(e, t) {
  const n = nt(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Ae.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const _r = Mr("/api/marks", "marks"), N_ = _r.fetchAll, c$ = _r.find, d$ = ["data-ref"], f$ = ["data-ref"], m$ = { class: "mark-row" }, h$ = "dock add", p$ = "questions.answer", v$ = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = S(() => c$(a.mark.type)), o = S(() => W2(a.mark, s.value)), l = S(() => {
      var p;
      return !!(a.mark.lines || o.value.detail || t.has(a.mark.target_model) || (p = s.value) != null && p.body_url);
    }), i = S(() => l.value || !!o.value.handlers.onAct), u = S(() => a.mark.type === p$), c = _(!1);
    function f() {
      c.value = !c.value;
    }
    const m = S(() => {
      var p;
      return (((p = s.value) == null ? void 0 : p.buttons) || []).filter((y) => {
        var b;
        return !a.docked || !((b = y.runs) != null && b.startsWith(h$));
      }).map((y) => ({ ...y, module: s.value.module }));
    });
    return (p, y) => {
      var b, x;
      return (b = s.value) != null && b.card ? (r(), d("div", {
        key: 0,
        class: Y(["thread-turn", "card", "whole-card", { "user-side": B(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        E(As, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, d$)) : (r(), d("div", {
        key: 1,
        class: Y(["thread-turn", "card", { "full-width": (x = s.value) == null ? void 0 : x.full_width, docked: e.docked, "user-side": B(n).has(e.mark.variant), "answer-bubble": u.value }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        h("span", m$, [
          E(wr, {
            mark: o.value,
            open: i.value ? c.value : void 0,
            onAct: o.value.handlers.onAct,
            onClick: f
          }, Gl({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: P(({ shown: C }) => [
                E(As, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: C
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["mark", "open", "onAct"]),
          E(u$, {
            buttons: m.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, f$));
    };
  }
}, g$ = /* @__PURE__ */ z(v$, [["__scopeId", "data-v-424ddb61"]]), y$ = ["data-ref"], b$ = ["inert"], k$ = { class: "group-fold" }, w$ = { class: "thread-group" }, $$ = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = _(!1), a = _(!1), s = _(!1), o = _(null);
    he(n, async (i) => {
      var u;
      a.value = !0, await je(), (u = o.value) == null || u.offsetHeight, s.value = i;
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
      E(wr, {
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
        h("div", k$, [
          h("div", w$, [
            (r(!0), d(L, null, te(e.group.marks, (c) => (r(), j(g$, {
              key: c.id,
              mark: c
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, b$)) : k("", !0)
    ], 8, y$));
  }
}, q_ = /* @__PURE__ */ z($$, [["__scopeId", "data-v-45b58b9b"]]);
function x$(e) {
  const t = _(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Ce(() => n.observe(e.value)), st(() => n.disconnect()), t;
}
const S$ = { class: "chat-dock-fold" }, M$ = ["aria-label"], _$ = { class: "chat-dock-head" }, C$ = { class: "chat-dock-inner" }, E$ = { class: "chat-dock-foot" }, Cr = 700, A$ = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = _(null), a = _(null), s = x$(a), o = _(!1);
    let l = 0;
    return Ce(() => l = setTimeout(() => o.value = !0, Cr)), st(() => clearTimeout(l)), t({ card: n }), (i, u) => (r(), d("div", {
      class: Y(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      h("div", S$, [
        h("section", {
          ref_key: "card",
          ref: n,
          class: Y(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ie(i.$slots, "edge", {}, void 0, !0),
          h("header", _$, [
            ie(i.$slots, "head", {}, void 0, !0)
          ]),
          h("div", {
            class: Y(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            h("div", C$, [
              h("div", {
                class: Y(["chat-dock-grow", { settled: o.value }]),
                style: ge(B(s) === null ? null : { height: `${B(s)}px` })
              }, [
                h("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  ie(i.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          ie(i.$slots, "still", {}, void 0, !0),
          h("footer", E$, [
            ie(i.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, M$)
      ])
    ], 2));
  }
}, O$ = /* @__PURE__ */ z(A$, [["__scopeId", "data-v-cc05fdac"]]), T$ = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Ga = 5, I$ = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Ga, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${Ga}s`, animationDelay: `${(n - Ga).toFixed(2)}s` };
    return (s, o) => (r(), d("span", T$, [
      h("i", { style: a })
    ]));
  }
}, B$ = /* @__PURE__ */ z(I$, [["__scopeId", "data-v-2a7bc150"]]), R$ = /* @__PURE__ */ new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]), Os = (e) => e.charAt(0).toUpperCase() + e.slice(1), L$ = (e) => Os(e.replace(/_at$/, "").replaceAll("_", " ")), N$ = (e, t, n) => (t == null ? void 0 : t.title) || (t == null ? void 0 : t.name) || `${e} ${n}`, q$ = (e, t, n) => [Os(`${e} ${n}`), (t == null ? void 0 : t.state) && Os(t.state)].filter(Boolean).join(" · "), Er = (e) => Vt(e).text, D$ = (e, t) => (e == null ? void 0 : e.type) === "agent" && t ? Er(t) : (e == null ? void 0 : e.name) ?? "", P$ = (e, t) => !e || !("agent_id" in e) ? "" : e.agent_id === null ? "Main agent" : t ? Er(t) : "", j$ = (e, t = "", n = "", a = "") => [
  ...a ? [{ name: "owner", label: "Belongs to", value: a, isTime: !1 }] : [],
  ...n ? [{ name: "creator", label: "Created by", value: n, isTime: !1 }] : [],
  ...Object.entries(e ?? {}).filter(([s, o]) => !R$.has(s) && !s.endsWith("_id") && o !== null && o !== "" && typeof o != "object" && o !== t).filter(([s, o]) => s !== "updated_at" || o !== e.created_at).map(([s, o]) => ({ name: s, label: L$(s), value: o, isTime: s.endsWith("_at") })),
  ...e != null && e.task_id ? [{ name: "task", label: "Task", value: `Task ${e.task_id}`, isTime: !1, link: { table: "tasks", id: e.task_id } }] : []
], F$ = { reviewing: "Under review" }, W$ = (e, t) => e || F$[t == null ? void 0 : t.state] || "", Ar = Mr("/api/docks", "docks"), D_ = Ar.fetchAll, Pt = Ar.find, H$ = 6, Ka = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, vo = (e) => Date.parse(e.leaves_at) / 1e3, an = (e) => !!(e.leaves_at && !e.kept), z$ = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!an(e) || t < vo(e) || n.has(e.id)), U$ = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => z$(a, t, n)).sort((a, s) => a.id - s.id);
function V$(e, t, n = H$) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(vo(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const G$ = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Ts = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), K$ = (e, t) => !(t != null && t.needs_user) && !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), Y$ = (e) => ({ ...e.kept ? Ts("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : Ts("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), Q$ = ["keep", "unkeep", "open", "undock"], X$ = (e) => ({ ...e, iconOnly: Q$.includes(e.action) });
function J$(e, t) {
  var n;
  return [
    ...K$(e, t) ? [Y$(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Jt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open in the inspector", runs: "" }] : [],
    Ts("undock", "close", "Dismiss this card", `dock remove ${e.id}`)
  ].map(X$);
}
function Or(e, t) {
  const n = J$(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: G$(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const Z$ = (e, t, n) => (t == null ? void 0 : t.draws_head) && (n == null ? void 0 : n.title) || Or(e, t).title, e5 = { class: "dock-text" }, t5 = ["title"], n5 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, a5 = {
  class: "dock-facts",
  "data-dock-facts": ""
}, s5 = {
  key: 1,
  "data-dock-row": ""
}, o5 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = S(() => Pt(a.item.type)), o = ho(), l = S(() => En(a.item.created_at, o.value * 1e3)), i = _(null), u = _(null), c = _(null), f = _(null), m = S(() => Or(a.item, s.value)), p = ot(), y = S(() => `dock.${a.item.id}`), b = S(() => p.props[y.value].data.value), x = S(() => Z$(a.item, s.value, b.value)), C = S(() => ia(a.item.target_model ?? "")), M = S(() => {
      var v;
      return ((v = s.value) == null ? void 0 : v.word) ?? "";
    }), T = S(() => ({ ...b.value, id: a.item.target_id, term: C.value })), H = () => {
      var v, $;
      return (($ = (v = s.value) == null ? void 0 : v.reads) == null ? void 0 : $.length) && p.reload(y.value);
    };
    Gc(js, { data: b, reload: H, readOutput: $r(p) }), he(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (v, $, O) => {
        var F;
        H();
        const R = (F = p.followUndeclared) == null ? void 0 : F.call(p, [`${C.value.replaceAll("-", "_")}.*`], (V) => {
          (!V.row_id || V.row_id === a.item.target_id) && H();
        });
        O(() => R == null ? void 0 : R());
      },
      { immediate: !0 }
    );
    const W = _(/* @__PURE__ */ new Set()), I = _("");
    async function G(v) {
      if (v.action === "undock") return n("undock", v);
      if (v.action === "open") return We(`${a.item.target_model}:${a.item.target_id}`);
      v.action === "declared" && (W.value = /* @__PURE__ */ new Set([...W.value, v.label])), I.value = "";
      const O = await _n(v, { id: a.item.target_id }, p.environment);
      (O == null ? void 0 : O.ok) === !1 && (W.value = new Set([...W.value].filter((R) => R !== v.label)), I.value = `Could not ${v.label.toLowerCase()}: ${O.error}`);
    }
    const q = S(() => m.value.actions.filter((v) => !W.value.has(v.label))), A = S(() => {
      var v;
      return W$((v = s.value) == null ? void 0 : v.badge, T.value);
    }), N = S(() => m.value.controls), D = S(() => {
      var v;
      return !((v = s.value) != null && v.folds && a.folded);
    }), w = S(() => {
      var v;
      return !!((v = s.value) != null && v.draws_head) && !a.collapsed;
    });
    return (v, $) => {
      var O, R, F, V;
      return r(), j(O$, {
        label: m.value.title + ((O = s.value) != null && O.needs_user ? ", waiting for you" : ""),
        type: (R = s.value) != null && R.needs_user ? "waiting" : "",
        folded: !!((F = s.value) != null && F.folds) && e.folded,
        body: !!((V = s.value) != null && V.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: $[4] || ($[4] = (J) => e.collapsed && n("open"))
      }, {
        edge: P(() => [
          e.leaving && !e.item.kept ? (r(), j(B$, {
            key: 0,
            "ends-at": B(vo)(e.item)
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
            }, null, 512)) : (r(), d(L, { key: 1 }, [
              E(le, {
                name: m.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              h("span", e5, [
                h("span", {
                  class: Y(["dock-title", { strip: e.collapsed }]),
                  title: x.value
                }, g(x.value), 11, t5)
              ])
            ], 64)),
            h("span", {
              ref_key: "time",
              ref: f,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (J = s.value) != null && J.leaves_after_seconds ? k("", !0) : (r(), d(L, { key: 0 }, [
                U(g(l.value), 1)
              ], 64))
            ], 512),
            N.value.length ? (r(), d("span", {
              key: 2,
              class: "dock-controls",
              onClick: $[0] || ($[0] = ke(() => {
              }, ["stop"]))
            }, [
              (r(!0), d(L, null, te(N.value, (oe) => {
                var ue, we;
                return r(), d(L, {
                  key: oe.action + oe.runs
                }, [
                  !W.value.has(oe.label) && (!((ue = oe.variants) != null && ue.length) || !((we = T.value) != null && we.state) || oe.variants.includes(T.value.state)) ? (r(), j(ve, {
                    key: 0,
                    variant: "icon",
                    class: Y({ kept: oe.pressed }),
                    "aria-pressed": oe.pressed,
                    "aria-label": oe.label,
                    title: oe.label,
                    "data-dock-action": oe.action,
                    onClick: (Oe) => G(oe)
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
          I.value || e.refusal ? (r(), d("p", n5, g(I.value || e.refusal), 1)) : k("", !0)
        ]),
        foot: P(() => {
          var J;
          return [
            h("span", a5, [
              A.value ? (r(), d("span", {
                key: 0,
                class: Y(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, g(A.value), 3)) : k("", !0),
              M.value ? (r(), d("span", s5, g(M.value) + " " + g(e.item.target_id), 1)) : k("", !0),
              h("span", {
                ref_key: "foot",
                ref: u,
                class: "dock-module-facts"
              }, null, 512)
            ]),
            (J = s.value) != null && J.folds ? (r(), j(ve, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: $[1] || ($[1] = (oe) => n("fold"))
            }, {
              default: P(() => [
                U(g(s.value.folds) + " ", 1),
                E(Zt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : k("", !0),
            h("span", {
              class: "dock-acts",
              onClick: $[3] || ($[3] = ke(() => {
              }, ["stop"]))
            }, [
              h("span", {
                ref_key: "actions",
                ref: c,
                class: "dock-module-actions"
              }, null, 512),
              D.value ? (r(), d(L, { key: 0 }, [
                E(ao, {
                  name: `dock.${e.item.type}`,
                  row: T.value,
                  environment: B(p).environment,
                  "read-only": B(p).readOnly,
                  "object-name": B(ia)(e.item.target_model),
                  "external-failure": "",
                  onFailure: $[2] || ($[2] = (oe) => I.value = oe),
                  onDone: v.loadRow
                }, null, 8, ["name", "row", "environment", "read-only", "object-name", "onDone"]),
                (r(!0), d(L, null, te(q.value, (oe) => (r(), j(ve, {
                  key: oe.action + oe.runs,
                  small: "",
                  variant: oe.primary ? "primary" : "ghost",
                  bordered: !oe.primary,
                  "data-dock-action": oe.action,
                  onClick: (ue) => G(oe)
                }, {
                  default: P(() => [
                    U(g(oe.label), 1)
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
            (J = s.value) != null && J.body_url ? (r(), j(As, {
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
}, kl = /* @__PURE__ */ z(o5, [["__scopeId", "data-v-4d692a2f"]]), l5 = 24, i5 = 8, P_ = 420;
function j_({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= l5 ? !0 : e < t && s > i5 ? !1 : null;
}
const r5 = (e, t) => e === void 0 ? t : e, u5 = { me: 1, people: [] }, ca = Kt({
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
  people: u5,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: sa("journal.activity", !0),
  wide: !1,
  sideMini: sa("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Ai("journal.activity", () => ca.activity);
Ai("journal.side.mini", () => ca.sideMini);
const Tr = "journal.viewer.";
function c5(e, t, n) {
  try {
    const a = n.getItem(Tr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function d5(e, t, n) {
  try {
    n.setItem(Tr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function wl(e, t, n = window.localStorage) {
  const a = _(c5(e, t, n));
  return he(a, (s) => d5(e, s, n), { deep: !0 }), a;
}
const f5 = {
  key: "dock-all",
  class: "dock-all"
}, m5 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean, insidesFolded: Boolean },
  setup(e) {
    var w, v;
    const t = e, n = i2(500), a = _(/* @__PURE__ */ new Set()), s = _e(Le), o = _(/* @__PURE__ */ new Set()), l = _({});
    async function i($, O) {
      l.value = { ...l.value, [$.id]: "" }, o.value = /* @__PURE__ */ new Set([...o.value, $.id]);
      const R = await _n(O, { id: $.target_id }, s.environment);
      (R == null ? void 0 : R.ok) === !1 && (o.value = new Set([...o.value].filter((F) => F !== $.id)), l.value = { ...l.value, [$.id]: `Could not dismiss this card: ${R.error}` });
    }
    const u = S(
      () => U$(
        t.items.filter(($) => !o.value.has($.id)),
        n.value,
        a.value
      )
    ), c = S(
      () => V$(
        u.value.filter(($) => Ka($, Pt)),
        n.value
      )
    ), f = S(() => u.value.filter(($) => !c.value.includes($) && !Ka($, Pt))), m = wl(`dock-size:${((w = ca.identity) == null ? void 0 : w.root) || location.host}`, null), p = ($) => {
      var O;
      return !!((O = Pt($.type)) != null && O.needs_user);
    }, y = _(/* @__PURE__ */ new Set()), b = _(/* @__PURE__ */ new Set()), x = S(() => u.value.length === 1), C = ($) => p($) || x.value, M = ($) => C($) ? y.value.has($.id) || b.value.has($.id) : m.value ? m.value.collapsed && !m.value.opened.includes($.id) : t.collapsed, T = S(() => u.value.some(M));
    he(() => t.collapsed, ($) => {
      b.value = new Set($ ? u.value.filter(p).map((O) => O.id) : []);
    });
    function H() {
      const $ = !T.value;
      m.value = { collapsed: $, opened: [] }, y.value = new Set($ ? u.value.filter(p).map((O) => O.id) : []), b.value = /* @__PURE__ */ new Set();
    }
    function W($) {
      var R;
      if (!M($)) return;
      if (C($)) {
        y.value = new Set([...y.value].filter((F) => F !== $.id)), b.value = new Set([...b.value].filter((F) => F !== $.id));
        return;
      }
      const O = (R = m.value) != null && R.collapsed ? m.value.opened : [];
      m.value = { collapsed: !0, opened: [...O, $.id] };
    }
    const I = wl(`dock-folded:${((v = ca.identity) == null ? void 0 : v.root) || location.host}`, {}), G = ($) => {
      var O;
      return !!((O = Pt($.type)) != null && O.folds) && (t.insidesFolded || r5(I.value[$.id], Ka($, Pt) || t.folded));
    };
    function q($) {
      G($) && A($), I.value = { ...I.value, [$.id]: !G($) };
    }
    function A($) {
      var O;
      !((O = m.value) != null && O.collapsed) || m.value.opened.includes($.id) || (m.value = { collapsed: !0, opened: [...m.value.opened, $.id] });
    }
    function N($) {
      a.value = /* @__PURE__ */ new Set([...a.value, $.id]);
    }
    function D($) {
      a.value = new Set([...a.value].filter((O) => O !== $.id));
    }
    return ($, O) => (r(), j(Fs, {
      tag: "div",
      name: "dock",
      duration: B(Cr),
      class: "dock-stack"
    }, {
      default: P(() => [
        u.value.length > 1 ? (r(), d("div", f5, [
          E(ve, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            "aria-label": T.value ? "Open all" : "Collapse all",
            onClick: H
          }, {
            default: P(() => [
              E(Zt, {
                open: !T.value
              }, null, 8, ["open"])
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : k("", !0),
        (r(!0), d(L, null, te(f.value, (R) => (r(), j(kl, {
          key: R.id,
          item: R,
          class: Y({ timed: B(an)(R) }),
          leaving: B(an)(R) && !a.value.has(R.id),
          folded: G(R),
          collapsed: M(R),
          refusal: l.value[R.id],
          onOpen: (F) => W(R),
          onFold: (F) => q(R),
          onUndock: (F) => i(R, F),
          onMouseenter: (F) => N(R),
          onMouseleave: (F) => D(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        (r(!0), d(L, null, te(c.value, (R) => (r(), j(kl, {
          key: R.id,
          item: R,
          class: Y({ timed: B(an)(R) }),
          leaving: B(an)(R) && !a.value.has(R.id),
          folded: G(R),
          collapsed: M(R),
          refusal: l.value[R.id],
          onOpen: (F) => W(R),
          onFold: (F) => q(R),
          onUndock: (F) => i(R, F),
          onMouseenter: (F) => N(R),
          onMouseleave: (F) => D(R)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128))
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, F_ = /* @__PURE__ */ z(m5, [["__scopeId", "data-v-ab76ae18"]]), Et = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Zn = (e) => Math.min(Math.max(e, 0), 1), h5 = (e) => {
  const t = Zn(e);
  return t * t * (3 - 2 * t);
}, xt = (e, t, n) => h5((e - t) / (n - t));
function W_(e) {
  const t = Zn(e), n = Zn((t - 0.12) / 0.76) * Et.shuffles, a = Math.min(Math.floor(n), Et.shuffles - 1), s = n - a, o = xt(s, 0.26, 0.38) * (1 - xt(s, 0.76, 0.96)), l = xt(s, 0.38, 0.76), i = xt(t, 0, 0.12) * (1 - xt(t, 0.88, 1)), u = xt(s, 0.2, 0.34) * (1 - xt(s, 0.84, 1)), c = Math.sin(Math.PI * Zn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / Et.shuffles, lift: Et.lift * o, ready: i, weight: u, follow: c, shuffle: a, phase: s };
}
function H_(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const $l = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, z_ = (e) => $l[e] ?? $l.butler, go = 2400, p5 = 0.05;
function v5({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, p5), l = Math.min(t + go * o, s), i = e + l * o;
  return i < n ? { y: i, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function U_(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function g5(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function V_(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const G_ = (e, t) => ({ ...e, stretch: t.stretch }), K_ = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, Ir = (e, t) => t >= (e.least ?? 0);
function Y_(e, t, n) {
  if (!Ir(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const Q_ = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), y5 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", xl = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), b5 = (e) => e.right > e.left && e.bottom > e.top;
function X_(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(y5)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let i = xl(l, n);
    const u = o.closest("[data-figure-scroll]");
    return u && !o.closest("[data-figure-chat-foot]") && (i = xl(i, u.getBoundingClientRect()), a && (i.bottom = Math.min(i.bottom, a.top))), b5(i) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: i }] : [];
  });
}
function Br(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, i = 1;
    for (const [f, m, p] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[f] - e[f];
      if (Math.abs(y) < 1e-9)
        (e[f] < o[m] || e[f] > o[p]) && (i = -1);
      else {
        const b = (o[m] - e[f]) / y, x = (o[p] - e[f]) / y;
        l = Math.max(l, Math.min(b, x)), i = Math.min(i, Math.max(b, x));
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
}, yn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), k5 = (e) => e * e * (3 - 2 * e), Be = (e, [t, n]) => k5(yn(e, t, n)), w5 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], gt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Vn = ([e, t], n) => e + n() * (t - e);
function $5(e) {
  return w5.map(() => {
    const t = Vn(gt.speed, e), n = Vn(gt.angle, e) * Math.PI / 180, a = Vn(gt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Vn(gt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const x5 = $5(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function S5(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * gt.gravity * (t[2] - gt.floor))) / gt.gravity;
}
function J_(e, t, n = x5) {
  const a = Ie.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = S5(o, a.from), i = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + i) return null;
  const u = Math.min(s, l), c = a.from.map((f, m) => f + o.velocity[m] * u);
  return c[2] -= gt.gravity * u * u / 2, { at: c, turn: o.spin * u, landed: Math.max(0, s - l) / i };
}
const Z_ = (e, t) => e && Ie[e.name] ? { name: e.name, u: t / e.frames } : null;
function eC(e, t) {
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
const tC = () => Array.from({ length: Ie.pogo.count }, (e, t) => Ie.pogo.bounce * (t + 1) / Ie.pogo.count), Ht = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function nC(e, t, n) {
  const { away: a, side: s } = Ie.bug_smash, o = s * a * n, [l, i] = [t.left + Ht.margin * n, t.right - Ht.margin * n], u = Math.min(Math.max(e + o + s * Ht.reach * n, l), i), c = u - o - e, f = u - (s * c > 0 ? c / 2 : 0);
  return { figure: [e - t.left, f - o - t.left], bug: [u - t.left, f - t.left] };
}
function aC(e, t, n) {
  const a = Ie.bug_smash, s = Be(t, a.walk), o = ([l, i]) => l + (i - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Ht.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Ht.tall * n * (1 - Be(t, a.emerge)),
      turn: 90 * (1 - Be(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Be(t, a.gone)
    }
  };
}
function sC(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Ht.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = v5({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Fe = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function oC(e) {
  const t = Fe.least + Math.floor(e() * (Fe.most - Fe.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Fe.walls[Math.floor(e() * Fe.walls.length)],
    along: Fe.margin + e() * (1 - 2 * Fe.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function Is(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Fe.margin, l = ((e.along - Fe.margin + e.way * Fe.speed * n / a) / s % 2 + 2) % 2, i = Fe.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + i * a, y: t.top + Fe.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Fe.inset : t.right - Fe.inset, y: t.top + i * a, turn: e.wall === "left" ? 90 : -90 };
}
function M5(e, t) {
  const n = Ie.bug_shot, [a, s] = n.turn.map((f) => f * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = g5(e, o), i = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), c = e >= a + t * (s - a) ? t : i + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: i, shot: c };
}
function lC(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Ie.bug_shot, { frame: l, bug: i, shot: u } = M5(n, e.length), c = e.map((M, T) => ({ ...Is(M, t, Math.min(n / o.fps, ea(T).shot)), shot: T < u })), f = Be(l / o.frames, o.aim), [m, p] = [c[Math.max(i - 1, 0)], c[i]], y = e.map((M, T) => ({ bug: M, index: T, seconds: n / o.fps - ea(T).shot, spot: Is(M, t, ea(T).shot) })).filter((M) => M.seconds >= 0), b = y.flatMap((M) => {
    const T = (s == null ? void 0 : s.get(M.index)) ?? O5(M.bug, t, M.spot, s ? [] : a);
    return s == null || s.set(M.index, T), s && T5(T, M.seconds, a), I5(T, M.seconds, a);
  }), x = y.filter((M) => E5(M.bug)).map((M) => ({ seconds: M.seconds, from: M.spot })), C = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - f) + +(e[i].wall === "top") * f;
  return { bugs: c, frame: l, target: { x: m.x + (p.x - m.x) * f, y: m.y + (p.y - m.y) * f, back: C }, slush: b, camera: x };
}
function ea(e) {
  const t = Ie.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function iC(e, t, n, a) {
  const { limit: s, margin: o } = Ie.bug_shot.back, [l, i] = [n.left + o * a, n.right - o * a];
  let u = n.x;
  return e.map((c, f) => {
    const m = ea(f), p = Is(c, t, m.shot), y = Math.abs(p.y - n.y) / Math.tan(s * Math.PI / 180), b = p.x === u ? u - l >= i - u ? -1 : 1 : Math.sign(u - p.x), x = Math.abs(p.x - u) >= y ? u : p.x + b * y, C = b > 0 ? Math.max(u, Math.min(x, i)) : Math.min(u, Math.max(x, l)), M = { from: u, to: C, begin: m.walk, end: m.aim };
    return u = C, M;
  });
}
function rC(e, t, n) {
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
const Ee = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, _5 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function C5(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const E5 = (e) => e.along * 97 % 1 < Ee.camera, bn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * Ee.gravity * t * t });
function A5(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * Ee.gravity * (t.bottom - e.from.y))) / Ee.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * Ee.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / Ee.gravity, on: "top" });
  const l = s.filter((c) => c.t >= 0).sort((c, f) => c.t - f.t)[0];
  let i = e.from;
  for (let c = 0; c < l.t; c += Ee.step) {
    const f = Math.min(c + Ee.step, l.t), m = bn(e, f), p = Br(i, m, n);
    if (p) return { ...p, t: c + (f - c) * p.share };
    i = m;
  }
  const u = bn(e, l.t);
  return { ...l, x: Math.min(Math.max(u.x, t.left), t.right), y: Math.min(Math.max(u.y, t.top), t.bottom) };
}
function O5(e, t, n, a = []) {
  const s = C5(e.along + 1), [o, l] = _5[e.wall], i = Math.atan2(l, o);
  return Array.from({ length: Ee.count }, () => {
    const u = i + (s() - 0.5) * 2 * (Ee.spread * Math.PI / 180), c = Ee.speed[0] + s() * (Ee.speed[1] - Ee.speed[0]), f = { from: { x: n.x, y: n.y }, vx: Math.cos(u) * c, vy: Math.sin(u) * c, r: Ee.radius[0] + s() * (Ee.radius[1] - Ee.radius[0]) };
    return { ...f, ...A5(f, t, a) };
  });
}
function T5(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += Ee.step) {
      const l = Math.min(o + Ee.step, s), i = Br(bn(a, o), bn(a, l), n);
      if (i) {
        Object.assign(a, i, { t: o + (l - o) * i.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function I5(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...bn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - Ee.hold) / Ee.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((f) => f.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const i = l ? l.left + a.dx : a.x, u = l ? l.top + a.dy : a.y, c = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - u)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: i, y: u, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: c, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function uC(e, t, n, a) {
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
function cC(e, t, n, a, s) {
  const { sway: o, above: l } = Ie.chute, i = { x: t.x, y: t.y - l * a }, u = o / 2 * Math.sin(2 * Math.PI * s), [c, f] = [Math.cos(u * Math.PI / 180), Math.sin(u * Math.PI / 180)], m = (x) => {
    const [C, M] = [x.x - e.at.x, x.y - e.at.y];
    return { x: i.x + C * c - M * f, y: i.y + C * f + M * c };
  }, [p, y] = [...n].sort((x, C) => x.x - C.x), b = e.ends.map(m);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: u, lines: b.map((x, C) => ({ from: x, to: C < b.length / 2 ? p : y })) };
}
const dC = (e, t) => Be(t, e.grows) * (1 - Be(t, e.sinks));
function da(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: yn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: yn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function fC(e, t) {
  const n = Ie[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = da(n, t), l = 1 - (1 - n.small) * Be(a, n.shrinks) * (1 - Be(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = da(n, t), o = n.flat * Be(a, n.squashes) * (1 - Be(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * yn(s, ...n.springs)) * (1 - yn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const mC = (e) => e === "pack_box";
function hC(e) {
  const { into: t, out: n } = da(Ie.rope_swing, e);
  return 1 - Be(t, [0, 1]) * (1 - Be(n, [0, 1]));
}
function pC(e) {
  const t = Ie.rope_swing, { into: n, out: a } = da(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Be(n, [0, 1]) * (1 - Be(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const B5 = { after: 3 }, yo = 10, R5 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, L5 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, N5 = { weight: 19 }, Rr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, q5 = { every: 120 }, Lr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Nr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, D5 = {
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
}, On = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: yo }), re = (e, t, n = {}) => On(e, "clip", t, n), Ya = (e, t, n = {}) => On(e, "look", t, n), Sl = (e, t, n = {}) => On(e, "gaze", t, n), ye = (e, t, n = {}, a = {}) => ({ ...On(e, "pick", t, n), ...a }), xe = (e) => On("nothing", "nothing", e, {}), P5 = 120, j5 = 300, Qa = (e, t) => ({ ...re(e, t), cooldown: j5 }), fe = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), F5 = () => [re("joy", 2)], St = (e, t, n, a, s = {}) => ({ ...re(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), Mt = (e) => ({ ...e, cooldown: R5[e.name] }), nn = (e) => ({ ...e, shenanigan: !0, lasts: L5[e.name] }), xa = [
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
  ...fe("reported", { cooldown: 90 }, [Sl("read", 3), re("nod", 1), xe(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...fe("read_message", { cooldown: 30 }, [Sl("read", 3), xe(1)]),
  ...fe("fact_filed", { cooldown: 120 }, [re("file_card", 3), re("nod", 1), xe(6)]),
  ...fe("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [re("nod", 2), xe(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...fe("bar_done", { holds: !0 }, F5()),
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
  ...fe("answered", { cooldown: 15 }, [Ya("amused", 3), xe(2)]),
  ...fe("heard", { cooldown: 30 }, [
    re("bow", 1, { voices: ["butler"] }),
    re("salute", 1, { voices: ["squire"] }),
    re("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    xe(1)
  ]),
  ...fe("long_walk", { cooldown: 90 }, [re("stumble", 3), xe(22)]),
  ...fe("card_arrived", { cooldown: 20, toward: "card" }, [re("glance", 7), xe(13)]),
  ...fe("typing", { cooldown: 60 }, [Ya("reading", 1), xe(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(D5).flatMap(([e, t]) => fe(`reacted:${e}`, {}, [Ya(t, 1)])),
  ...Object.entries(Lr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => fe(`agent_reacted:${n}`, {}, [re(a, 1, { voices: [e] })])[0])),
  ...Object.entries(Nr).flatMap(([e, t]) => fe(`agent_reacted:${e}`, {}, [re(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...fe("pastime", {}, [
    St("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    St("rest", 3, 180, 120),
    St("yawn", 2, 60, 60),
    St("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    St("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    St("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    St("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...nn(Mt(re("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    nn(Mt(re("disco", 2, { ball: "bubble" }))),
    xe(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...fe("held:search", { cooldown: P5 }, [Qa("search", 3), { ...Qa("binoculars", 2), when: { home: !0 } }, { ...Qa("glass_bubble", 2), when: { bubble: !0 } }]),
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
  ...fe("jump", {}, [nn(Mt(re("backflip", 7, { high: !0 }))), re("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...fe("climb", {}, [ye("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...fe("unit", { cooldown: Rr.build.cooldown }, [ye("unit", N5.weight), xe(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...fe("progress_jump", { cooldown: 6 }, [re("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...fe("perch", {}, [{ ...ye("hang", 1, { hands: !0, free: !0 }), cooldown: q5.every }, ye("stand", 5)]),
  // a digit a blow's dust lets out
  ...fe("digit", {}, [ye("0", 1), ye("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...fe("roam", {}, [
    ye("rest", 35, {}, { stay: [25, 60] }),
    ye("seat", 15, {}, { stay: [15, 40] }),
    ye("edge", 25, {}, { stay: [8, 20] }),
    nn(ye("bubble", 15, {}, { stay: [30, 80] })),
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
    nn(Mt(ye("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
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
], qr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), Dr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), W5 = (e) => Array.isArray(e) ? e[0] : e, H5 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, z5 = (e) => xa.some((t) => t.when.moment === e);
function U5(e) {
  var c;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), a = (f) => !e.memory || Dr(f).every(([m, p]) => n(m) >= W5(p)), s = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = xa.filter((f) => qr(f.when, e) && (f.type !== "clip" || t(f.name)) && a(f) && s(f)), i = (((c = e.tally) == null ? void 0 : c.plain) ?? 0) >= B5.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, u = i.filter((f) => {
    var m;
    return f.type === "nothing" || f.name !== ((m = e.tally) == null ? void 0 : m.last);
  });
  return u.some((f) => f.type !== "nothing") ? u : i;
}
function Xe(e, t) {
  const n = U5(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (Pr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Pr(e, t, n) {
  var a;
  for (const [s, o] of Dr(t)) (a = e.memory) == null || a.set(s, e.now + H5(o, n));
}
function vC(e, t, n) {
  Pr(e, xa.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const gC = (e) => Object.values(Rr).find((t) => qr(t.when, e)) ?? null, V5 = (e, t, n) => n - t <= (e.lifetime ?? yo), yC = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || Ir(e.clip, t));
class jr {
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
const Bs = {
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
}, bC = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Fr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), kC = {
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
}, wC = 120, G5 = 20, $C = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < G5), K5 = (e) => Bs[e] || Bs.idle, xC = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Wr = "airborne", Y5 = "landing", Q5 = "travelling", Hr = "grounded", SC = ({ airborne: e, landing: t, trip: n }) => e ? Wr : t ? Y5 : n != null && n.started ? Q5 : Hr;
function MC(e, t) {
  var s;
  const n = X5(e, t);
  return e.mode === Hr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function X5(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: i, beat: u, state: c, doing: f, doingFacing: m = 0, readingFacing: p = null } = e;
  if (n === Wr && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (u == null ? void 0 : u.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...J5(o, f, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (u && !(u.onto && o)) return { clip: u.clip, facing: u.facing, once: !0, ...u.holds && { holds: !0 }, ...u.stretch && { stretch: u.stretch } };
  if (i.view && c === "asking") return { clip: "point", facing: 0 };
  const y = p !== null && i.posture === "stand" && f !== "push";
  return ["asking", "waiting"].includes(c) && !["work", "push"].includes(f) ? { clip: "waiting", facing: y ? p : e.composeFacing ?? 0 } : { clip: t(f, i.posture) ? f : K5(c), facing: y ? p : i.posture === "sit" ? i.face : m };
}
function J5(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Rs = (e) => e.outcome, Z5 = /^plugin:[^:]+:sins:/, Ml = (e) => e.type === "plugins.card" && Z5.test(e.markKey), e4 = [
  // a finding a plugin made in the agent's change, and one it found fixed, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => Ml(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => Ml(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], _C = (e, t) => e.filter((n) => n.author === "user" && ra(n.read_at) > t).map((n) => ({ beat: "read_message", time: ra(n.read_at), card: Fi(n) })).sort((n, a) => n.time - a.time), _l = { user: "reacted", agent: "agent_reacted" };
function CC(e, t) {
  return e.filter((n) => _l[n.author] && Tt(n) > t).map((n) => ({ beat: `${_l[n.author]}:${n.emoji}`, time: Tt(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const t4 = [.../* @__PURE__ */ new Set([...Object.values(Lr).flatMap((e) => Object.keys(e)), ...Object.keys(Nr)])];
function EC(e, t) {
  return e.filter((n) => n.author === "agent" && Tt(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = t4.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: Tt(n), card: Fi(n) })).sort((n, a) => n.time - a.time);
}
const n4 = (e) => new jr(e).isTest(), fa = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Rs(e)] || "";
}, a4 = 1800, s4 = (e, t) => {
  if (fa(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && fa(n) !== "finished" && Number(e.time) - Number(n.time) <= a4 ? "tests_fixed" : "tests_passed";
};
function AC(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(n4), s = a.filter((i) => fa(i)), o = s.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return a.forEach((i) => t.set(i.key, fa(i))), o.map((i) => ({ beat: s4(i, s), time: Number(i.time), card: i.key }));
}
function OC(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Rs(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Rs(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const TC = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: Tt(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function IC(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function BC(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function RC(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var u;
    return { beat: (u = e4.find((c) => c.matches(i))) == null ? void 0 : u.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((i, u) => i.time - u.time);
}
function bo(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const Cl = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function o4(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const i = (s + o) / 2;
    bo(e, t, i, a).pitch > n ? s = i : o = i;
  }
  return (s + o) / 2;
}
function LC(e, t, n, a = {}) {
  const s = Xe({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : z5(`held:${e}`) ? "idle" : e;
}
const De = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function NC(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < De.ahead * n ? 180 : Math.sign(a) * De.turn;
}
const El = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function qC(e, t) {
  const n = Math.min(De.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(De.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(De.lines, Math.floor((e.bottom - e.top - 2 * a) / De.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / De.sweep) % s, i = o % De.sweep, u = De.sweep - De.returnSeconds, c = El((i - u) / De.returnSeconds), f = i <= u ? El(i / u) : 1 - c, m = l + ((l + 1) % s - l) * c;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + a + m * De.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Al = 3, zr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, Ol = 12, DC = (e, t) => ({ mood: e, began: t, seen: 0 });
function PC(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!zr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= Al ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * Ol) / Ol, lasts: Al } };
}
const jC = (e) => e.posture === "hang" && !zr(e.face), l4 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), i4 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function FC(e, t, n) {
  return l4.has(e) ? 1 / 0 : !i4.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Ur(n - t.began, t.share) - ut.lead, 0);
}
const r4 = 5;
function WC(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= r4 ? { beat: "long_walk", time: n } : null };
}
const u4 = 30, Gn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function HC(e, t, n, a, s = null) {
  if (t && n < t.until || !Gn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Xe({ moment: "spell", state: e, tally: s }, a), [l, i] = Gn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (i - l), next: n + Gn.every } : { state: e, began: 0, until: 0, next: n + Gn.every };
}
const zC = (e, t, n) => t && n < t.until && Fr.has(e.state) ? { state: t.state, since: t.began } : e, ut = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Ur = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function UC(e, t, n, a) {
  var i;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const u = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: u ? { beat: u } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = Ur(o, e.share);
  return s ? { eager: c4(t, l), moment: null } : l > ut.lead ? { eager: t, moment: null } : l < ut.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > ut.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < ut.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = Xe({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function c4(e, t) {
  return e.on && t > ut.lead + ut.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= ut.lead && t >= ut.least ? { ...e, on: !0, calm: !1 } : e;
}
const d4 = 1, f4 = { look: "look", gaze: "gaze" };
function m4(e, t, n, a, s = "", o = () => !0, l = null) {
  const i = Xe({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return i ? { [f4[i.type] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const h4 = (e, t, n, a, s, o = "", l = () => !0, i = null, u = "") => Xe({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: i, ball: u }, s), p4 = (e, t, n, a, s, o = 0) => Xe({ moment: "jump", high: e > d4 * t, memory: a, now: s, room: o }, n).name === "backflip", v4 = { work: ["building"], idle: ["standing"] };
function VC(e, t, n, a) {
  const s = Bs[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(v4[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), Fr.has(e) ? { moments: o, began: n || a } : (n && a - n >= u4 && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function g4(e, t, n) {
  return !Xe({ moment: "pondering", memory: e, now: t }, n) || !Xe({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Xe({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Tl = { pondering: g4 };
function GC(e, t, n, a, s, o) {
  if (Tl[e.beat]) {
    const i = Tl[e.beat](n.reacted, a, s);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = m4(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== yo && { lifetime: l.lifetime } } } : null;
}
function KC(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const u = h4(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return u && { clip: u.name, card: "", flies: !!u.flies };
}
const YC = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function QC(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function XC(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const JC = (e, t) => !!(e != null && e.watches) && !t.once, ZC = 10, eE = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || V5(a, a.queuedAt, n)), tE = (e, t) => t ? null : e[0] ?? null;
function nE(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const aE = (e, t) => !t.during || !e.some((n) => n.during === t.during), y4 = 2 * Math.PI, b4 = 500;
function sE(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), i = l / b4, u = t && e.point && !!t.behind != !!e.point.behind, c = u && e.amount > 0, f = t && !c ? o : 0, m = e.amount < f ? Math.min(e.amount + i, f) : Math.max(e.amount - i, f), p = y4 * l / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, x = (c ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !u ? s && !t.behind && !y.behind ? w4(y, t, n, p, s) : x4(y, t, n, p) : t) ?? y, C = x != null && x.behind && x.mood === "reading" ? k4(e.point, x, n, l, s) : x;
  return { point: C ?? null, toward: C ? { x: C.x - n.x, y: C.y - n.y } : null, amount: m, at: a };
}
function k4(e, t, n, a, s) {
  const o = (N) => N * 180 / Math.PI, l = (N) => o(Math.atan2(Math.sin(N * Math.PI / 180), Math.cos(N * Math.PI / 180))), i = (s == null ? void 0 : s.facing) ?? 0, u = (s == null ? void 0 : s.depth) ?? 24, c = l(o(Math.atan2(t.x - n.x, -u)) - i), f = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -u)) - i), m = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = m ? l(e.readingFacing - i) : 0, y = m ? e.readingYaw + p : f, b = y + l(c - y), x = Math.min(Math.max(a / 1e3, 0), 0.1), C = De.turnSpeed * x, M = m ? y + Math.min(Math.max(b - y, -C), C) : b, T = m ? e.readingFollow + p : M, H = T + (M - T) * (1 - Math.exp(-x / De.followSeconds)), W = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, I = o(bo(t.x - n.x, -u, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), G = Math.min(Math.max(I, -W.up), W.down), q = De.tipSpeed * x, A = m ? e.readingPitch + Math.min(Math.max(G - e.readingPitch, -q), q) : G;
  return { ...t, readingYaw: M, readingFollow: H, readingPitch: A, readingFacing: i };
}
function w4(e, t, n, a, { depth: s, above: o, tip: l }) {
  const i = (T) => {
    const { yaw: H, pitch: W } = bo(T.x - n.x, s, n.y - T.y, o);
    return { yaw: H, pitch: Math.min(Math.max(W, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [u, c] = [Cl(i(e)), Cl(i(t))], f = Math.acos(Math.min(Math.max(u[0] * c[0] + u[1] * c[1] + u[2] * c[2], -1), 1));
  if (f <= a) return { ...t };
  const m = a / f, [p, y] = [Math.sin((1 - m) * f) / Math.sin(f), Math.sin(m * f) / Math.sin(f)], [b, x, C] = u.map((T, H) => p * T + y * c[H]), M = s * b / x;
  return { ...t, x: n.x + M, y: n.y - o4(M, s, -Math.asin(Math.min(Math.max(C, -1), 1)), o) };
}
const $4 = 0.15;
function oE(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= $4;
}
function x4(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), i = s + Math.max(-a, Math.min(a, l)), u = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + u * Math.cos(i), y: n.y + u * Math.sin(i) };
}
const S4 = (e) => !(e != null && e.on);
function lE(e, t, n) {
  if (S4(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((i) => i.beat === s.beat && i.card === s.card) === o);
  return { answer: [], held: a };
}
const kn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, lt = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Xa = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Il = (e) => e * e * (3 - 2 * e);
function M4(e) {
  if (e < 0 || e >= lt.seconds) return null;
  const t = Xa(e, ...lt.flicker), n = Math.floor(t * lt.flickers * 2) % 2 === 0, a = e < lt.flicker[1] ? n ? 0.35 + 0.5 * t : lt.dim : 1;
  return { strength: 1 - Il(Xa(e, ...lt.fade)), lit: a, white: e < lt.flash[0] ? 0 : 1 - Il(Xa(e, ...lt.flash)) };
}
const iE = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function rE(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = M4(t - e.at);
  return a && { colour: kn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: lt.signs[e.tone], ...a } };
}
function uE(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function cE(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= kn.looks || a === null && n - e.since >= kn.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function dE(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (i) => (i + a * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(s(i) - 3, 9 - s(i), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const vt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, fE = { behind: 39, figure: 40, ahead: 41 }, _4 = "[data-figure-pile]", C4 = { amber: [1, 0.69, 0.125], good: kn.colours.good, bad: kn.colours.bad }, ta = { phases: 4, ms: 230, dim: 0.25 }, mE = (e, t, n) => e !== "amber" || (t + n) % ta.phases < ta.phases / 2 ? 1 : ta.dim, hE = (e) => e === "amber" ? ta.phases : 1;
function pE(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const vE = Object.keys(C4), et = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, sn = ([e, t], n) => e + n() * (t - e);
function gE(e) {
  const t = et.least + Math.floor(e() * (et.most - et.least + 1));
  return Array.from({ length: Math.min(t, et.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * et.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = sn(et.start, e), l = sn(et.reach, e);
    return {
      text: Xe({ moment: "digit" }, e).name,
      x: a * o,
      y: et.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(sn(et.moveMs, e)),
      fadeMs: Math.round(sn(et.fadeMs, e))
    };
  });
}
const Ja = { high: 3, gap: 1 };
function yE(e) {
  const t = Math.floor(e / Ja.high);
  return { left: -(vt.inside + vt.width / 2 + t * (vt.width + Ja.gap)), up: e % Ja.high * (vt.height - vt.top) };
}
const E4 = (e, t, n) => Xe({ moment: "unit", memory: e, now: t }, n) !== null, A4 = { after: 5 }, O4 = (e) => e.filter((t) => t.active && (t.process || t.watch) && new jr(t).isBuild());
function bE(e, t, n) {
  const a = O4(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= A4.after ? s : null;
}
function kE(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: E4(n, a, s) } : null;
}
const Bl = { ahead: 140, up: 70 };
function wE(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Bl.ahead, y: a - Bl.up } } : o ? { at: { x: n(o), y: a - o.up - vt.height } } : t ? { at: null } : null;
}
const Za = { least: 4e3, most: 1e4 }, T4 = (e) => Za.least + e() * (Za.most - Za.least), _t = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function $E(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = T4(t);
    if (n.length >= _t.most || t() >= _t.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (_t.at[0] + t() * (_t.at[1] - _t.at[0]));
    n.push({ from: o, to: o + _t.ms }), a = o + _t.ms;
  }
}
const xE = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), SE = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Vr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), ME = new Set(xa.filter((e) => Vr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), I4 = (e) => e.some((t) => t.state === "built"), _E = (e, t) => I4(t) ? e.filter((n) => !Vr.has(n.beat)) : e, kt = { reach: 40, room: 6 }, B4 = (e, t) => t <= e - kt.reach + 2, CE = (e, t, n) => B4(e, n) ? t - kt.reach : e - kt.reach - kt.room, EE = (e, t, n, a) => a > 0 && t < e && t + kt.reach >= e - 2 ? Math.min(n, Math.max(e, t + kt.reach)) : e, es = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, AE = (e) => sn(e() < es.longShare ? es.long : es.short, e), R4 = 2 * vt.width;
function OE(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= R4 ? o : e + (o - e + s / 2) % s;
}
const L4 = 60, TE = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= L4, Rl = "[data-figure-home]", Tn = () => {
  var t;
  const e = document.querySelector(Rl);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Rl)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, N4 = "[data-figure-docked-bars]", q4 = "[data-figure-chat-foot]", D4 = [0.85, 0.6, 0.35, 0.15], P4 = ["question", "waiting", "suggestion"], IE = (e, t) => P4.find((n) => e[n] > 0 && t[n] === "behind") || null;
function BE() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const j4 = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", F4 = "[data-figure-newest]";
function Gr() {
  var a, s;
  const e = (a = Tn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(F4), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, i;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !ko(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function wn(e, t, n = Gr()) {
  if (!e || !n) return !0;
  const a = ft(e, t), s = Ma(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Ne.top * t.size, bottom: a.top + Ne.bottom * t.size }, l = Et.gap;
  return !Sa(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function RE(e, t, n, a = Gr()) {
  if (!a || wn(t, e, a)) return null;
  const s = Ma(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, i = Lt(), u = t.posture === "stand" ? $o * e.size : tu * e.size, c = Math.max(n.left + u, i.left + o), f = Math.min(n.right - u, i.right - l);
  return [a.left - Et.gap - l, a.right + Et.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= c && p.x <= f && wn(p, e, a) && vx(p, e)).sort((p, y) => Math.abs(p.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const ts = 0.26, Kr = 0.54, W4 = 1.25 / 5.4, In = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: ts, travels: "stand" },
  lounge: { drop: ts, travels: "stand" },
  composed: { drop: ts, travels: "stand" },
  hang: { drop: Kr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, LE = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * W4 * Math.cos(t * Math.PI / 180),
  y: 1 - n - Kr
}), rn = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), H4 = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), NE = (e, t) => (e === "sit" ? H4.has(t) : rn.has(e)) ? e : "stand";
function qE(e, t) {
  return e.facing === t.facing || !rn.has(e.posture) && !rn.has(t.posture) ? t : { posture: "stand", facing: rn.has(e.posture) ? e.facing : t.facing };
}
const DE = 0.25, PE = (e, t) => rn.has(e) && In[t].drop === 0, Yr = 2, z4 = 90, U4 = 180, V4 = 140, G4 = 280, K4 = 420, Y4 = 0.25, Q4 = 290, X4 = 600, J4 = "cubic-bezier(0.2, 0.7, 0.4, 1)", Z4 = "cubic-bezier(0.55, 0, 0.9, 0.6)", ns = 5;
function ma(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: i = !1, random: u = Math.random, memory: c = null, now: f = 0, room: m = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < ns) return null;
  (l || i) && (o = Math.max(o, Yr));
  const y = o > 1, b = Math.abs(t.x - e.x), x = b < ns ? 0 : b / (z4 * o) * 1e3, C = Math.min(x, y ? V4 : U4), M = Math.abs(t.y - e.y), T = t.y < e.y, H = T && !p && p4(M, n, u, c, f, m), W = T ? K4 + Math.min(M, 400) * Y4 : Math.sqrt(2 * M / go) * 1e3, I = {
    x: t.x,
    y: t.y,
    ms: M > ns ? H ? X4 : W : 0,
    lead: H ? Q4 : T ? G4 : 0,
    easing: T ? J4 : Z4,
    hopping: !0,
    clip: H ? "backflip" : T ? "jump" : "fall"
  }, G = { x: t.x, y: t.y, ms: x + C, lead: 0, easing: "linear", ramp: C, ...y ? { clip: "run" } : {} }, q = p ? ex(t, n) : I, A = T && !a ? [{ ...G, y: e.y }, q] : [{ ...I, x: e.x }, G];
  return { way: Math.sign(t.x - e.x) || 1, legs: A, lands: !s, pace: o, running: y };
}
const ex = (e, t) => ({ x: e.x, y: e.y, ms: Ie.pogo.frames / Ie.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), tx = (e, t) => e.postures.includes(t) ? t : e.postures[0], jE = (e, t, n) => e.posture === "walk" && n ? "walk" : tx(e.clip, t), ft = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - In[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, Sa = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, ko = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Lt() {
  var t;
  const e = (t = Tn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Kn = 0.5, Ll = 20;
function FE(e, t, n = Lt()) {
  const a = ft(e, t);
  return a.left >= n.left + Ll && a.right <= n.right - Ll;
}
function wo(e, t, n = Lt()) {
  const a = ft(e, t), s = a.right - a.left, o = Ma(e), [l, i] = [a.left + o.left * s, a.left + o.right * s], u = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - Kn && i <= n.right + Kn && a.top >= n.top - Kn && u <= n.bottom + Kn;
}
const ha = [0.35, 0.5, 0.65], pa = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ne = { left: ha[0], right: ha.at(-1), top: pa[0], bottom: pa.at(-1) }, nx = 0.24;
function Ma(e) {
  if (e.posture === "stand") return { left: Ne.left, right: Ne.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + nx * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ne.left, t), right: Math.max(Ne.right, t) };
}
function ax(e, { size: t }, n = Lt()) {
  const a = Ma(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const $o = (Ne.right - Ne.left) / 2 + 0.08;
function WE(e, t) {
  return e === "hang" ? Ne : { ...Ne, bottom: Math.min(Ne.bottom, 1 - t - In[e].drop) };
}
const sx = "[data-figure-agent]";
function Qr(e, t, n = "", a = "") {
  var i;
  const s = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !ko(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const u of [l - 1, l].filter((c) => c >= 0)) {
    if (!o.data[u].trim()) continue;
    const c = document.createRange();
    if (c.setStart(o, u), c.setEnd(o, u + 1), [...c.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
const Xr = (e) => pa.flatMap(
  (t) => ha.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function xo(e, t, n = "") {
  if (!wn(e, t)) return ha.length * pa.length;
  const a = ft(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(j4)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: u }) => u.width && u.height && Sa(s, u) && ko(i)).map(({ rect: i }) => i), l = (i, u) => o.some((c) => i >= c.left && i <= c.right && u >= c.top && u <= c.bottom);
  return Xr(s).filter(([i, u]) => l(i, u) || Qr(i, u, n)).length;
}
function ox(e, t) {
  const n = ft(e, t);
  return Xr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Qr(a, s, "", sx)).length;
}
const Nl = 4;
function HE(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Nl; o <= s; o += Nl)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const i = { ...t, x: l };
      if (!ox(i, e) && wn(i, e)) return i;
    }
  return null;
}
function $n(e, t, n) {
  const a = Lt(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => wo(l, t, a) && wn(l, t)).map((l) => ({ spot: l, covered: xo(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, i) => i.covered < l.covered || i.covered === l.covered && i.away < l.away ? i : l
  ).spot : null;
}
const Jr = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), lx = [0.5, 0.25, 0.75], ix = (e) => Jr(e.getBoundingClientRect(), lx), Zr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, rx = $o, ux = (e, t, { size: n }, a = rx) => eu(e, Zr[t], a * n, "stand");
function eu(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const cx = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, tu = 0.1, dx = (e, t, { size: n }) => eu(e, cx[t], tu * n, "sit"), fx = (e) => ((e + 180) % 360 + 360) % 360 - 180, as = 60;
function zE(e, t) {
  const n = fx(t);
  return !e.aside || Math.abs(n) >= as ? t : n < 0 ? 360 - as : as;
}
const un = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, mx = (e) => [.../* @__PURE__ */ new Set([e, ...un.turns.map((t) => (t + 360) % 360)])];
function UE(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = mx(t), l = un.every[0] + a() * (un.every[1] - un.every[0]);
  return { face: t, from: s ? hx(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function hx(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / un.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function VE(e, t) {
  const { element: n, edge: a } = _a(), s = ["left", "right"].map((i) => Bn(dx(a, i, e), e)).filter((i) => n && wo(i, e) && !xo(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, l = s.sort((i, u) => o(i) - o(u))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function GE(e, t, { size: n }) {
  const a = (Ne.right - Ne.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - nu } : e;
}
const nu = 7;
function au() {
  const e = [...document.querySelectorAll(_4)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function px(e, t) {
  const n = ft(e, t), a = n.right - n.left;
  return { left: n.left + Ne.left * a, right: n.left + Ne.right * a, top: n.top + Ne.top * a, bottom: n.bottom };
}
function vx(e, t) {
  const n = au();
  return !n || !Sa(px(e, t), n);
}
const gx = 4;
function _a() {
  const e = Rn(), t = au(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > gx || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - nu - n, 0) } };
}
const KE = ({ size: e, below: t }) => (1 - t) * e;
function Bn(e, t) {
  const n = Lt(), { size: a, below: s } = t, o = In[e.posture].drop * a;
  return { ...ax(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const Ls = (e, t) => Object.keys(Zr).map((n) => Bn(ux(e, n, t), t)), So = (e, t) => Jr(e, D4).map((n) => Bn(n, t)), su = (e, t, n) => $n(e, t, n) ?? e[0];
function YE(e, t) {
  const { element: n, edge: a } = _a();
  return { ...su(Ls(a, e), e, t), view: null, on: n };
}
function QE(e, t, n, a) {
  const { element: s, edge: o } = _a(), l = (a ? Ls(o, t) : [...Ls(o, t), ...So(o, t)]).filter(
    (c) => !Sa(ft(c, t), e)
  ), i = $n(
    l.filter((c) => c.x > (e.left + e.right) / 2),
    t,
    n
  ), u = i && !xo(i, t) ? i : $n(l, t, n);
  return u && { ...u, view: null, on: s };
}
function Rn() {
  var a;
  const e = Tn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(N4);
  if (!t) return { ...Ca(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const ql = { within: 2 };
function XE(e) {
  const { element: t, docked: n, edge: a } = Rn();
  if (!n || e.on !== t) return !0;
  const s = Ca().edge;
  return a.left > s.left + ql.within || a.left + a.width < s.left + s.width - ql.within;
}
const yx = "[data-figure-closing]";
function JE() {
  var n;
  const { element: e, docked: t } = Rn();
  return t && !!((n = e.firstElementChild) != null && n.matches(yx));
}
const ou = "[data-figure-progress]";
function ZE(e) {
  const t = e.querySelector(ou);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function eA(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const bx = { across: 300, above: 380, below: 60 };
function tA(e) {
  const { across: t, above: n, below: a } = bx;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: kx(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const kx = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), lu = "[data-figure-bar]", Ns = { back: 144, along: 0.4 };
function nA(e) {
  const { element: t, docked: n, edge: a } = Rn(), s = n ? t.querySelector(lu) : null;
  if (!(s != null && s.querySelector(ou))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...Bn({ x: o - Ns.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function aA(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < Ns.along * a.size ? t.x + Ns.along * a.size : e.x, y: e.y, behind: !0 };
}
function sA(e) {
  const t = e.querySelector(lu), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function Ca() {
  const e = Tn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function oA(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: i } = Ca(), u = n === null ? wx(i, e, o === null ? t : { x: o, y: i.top }, a, s) : Bn({ x: n, y: i.top, posture: "stand" }, e);
  return u && { ...u, view: null, on: l, stays: !0 };
}
function wx(e, t, n, a, s) {
  const o = So(e, t), l = Math.min(...o.map((u) => u.x)), i = o.filter((u) => u.x + a + vt.width < s && u.x + a - kt.reach - kt.room >= l);
  return $n(i.length ? i : o, t, n);
}
const $x = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function lA(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: i = Math.random, via: u = [], memory: c = null, now: f = 0, room: m = 0, pogo: p = !1 } = {}) {
  (o || l) && (s = Math.max(s, Yr));
  const y = (H) => {
    const W = ft(H, n, In[H.posture].travels);
    return { x: W.left, y: W.top };
  }, b = t.ladder ?? e.ladder;
  if (b && !(t.ladder && e.ladder)) return xx(y(e), y(t), y({ ...b.foot, posture: "stand" }), b.way, !!t.ladder, n, s);
  const [x, ...C] = [e, ...u, t].map(y), M = ma(x, C[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: i, memory: c, now: f, room: m, pogo: p }), T = C.slice(1).map((H, W) => {
    var I;
    return (I = ma(C[W], H, n.size, { random: i, memory: c, now: f, room: m })) == null ? void 0 : I.legs.find((G) => G.hopping);
  });
  return M && { ...M, legs: [...M.legs, ...T.filter(Boolean)] };
}
function xx(e, t, n, a, s, o, l) {
  const i = (f, m) => ({ x: m.x, y: m.y, ms: Math.hypot(m.x - f.x, m.y - f.y) / $x.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), u = s ? ma(e, n, o.size, { pace: l }) : ma(n, t, o.size, { pace: l }), c = s ? [...(u == null ? void 0 : u.legs) ?? [], i(n, t)] : [i(e, n), ...(u == null ? void 0 : u.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: c, lands: !1, pace: l, running: l > 1 };
}
function iA(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function rA(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && $n(ix(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = _a();
  return { ...su(So(s, t), t, n), view: null, on: a };
}
const Sx = "[data-figure-bubble]", Mx = 250;
let cn = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), iu = 0;
const en = () => cn, ss = /* @__PURE__ */ new WeakMap();
let _x = 0;
function Mo(e) {
  return ss.has(e) || ss.set(e, `floor-${++_x}`), ss.get(e);
}
const Cx = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Ex = () => {
  var e, t;
  return ((t = (e = Tn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Ax(e, t) {
  var a;
  const n = (a = e.querySelector(q4)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Ox(e, t) {
  const n = e && Ax(e, t), a = e ? [...e.querySelectorAll(Sx)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || Cx(l, n))).map(({ element: o, type: l, box: i }) => ({ id: Mo(o), type: l, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const Tx = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= Mx ? (t.top - a.top) / s * 1e3 : 0;
};
function ru(e = cn, t = performance.now()) {
  const n = Lt(), a = Ex(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: i } = Rn(), u = [];
  o && u.push({ id: "home", type: l ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const c = Ca();
  return c.element && u.push({ id: Mo(c.element), type: "build", element: c.element, left: c.edge.left, right: c.edge.left + c.edge.width, top: c.edge.top }), u.push(...Ox(a, s)), u.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(u.map((f) => Object.freeze({ ...f, vy: Tx(e, f, t) }))) });
}
const qs = /* @__PURE__ */ new Set();
function Ix(e) {
  return qs.add(e), () => qs.delete(e);
}
function Bx() {
  uu();
  const e = () => {
    iu = requestAnimationFrame(e), !document.hidden && (cn = ru(cn), qs.forEach((t) => t(cn)));
  };
  e();
}
function uu() {
  cancelAnimationFrame(iu);
}
const _o = 5, Rx = 56, Lx = { share: 0.6 }, Nx = (e) => -Math.sqrt(2 * go * Lx.share * e), Gt = (e, t) => e.find((n) => n.id === t) ?? null;
function uA(e, t = ru().floors) {
  const n = Gt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : Mo(e.on) : null, o = s && Gt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function cu({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, i, u = en().floors) {
  const c = Gt(u, e);
  if (!c) return null;
  const f = { x: c.left + t, y: c.top + n, posture: a, face: s };
  return (l || qx(c, f, o)) && Dx(f, i, u) ? { x: f.x, y: f.y } : null;
}
const Co = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, qx = (e, t, n) => !Co({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function cA(e, t = en().floors) {
  if (!Co(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= _o && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function Dx(e, t, n = en().floors) {
  const a = Gt(n, "home");
  return e.posture === "hang" && a && ft(e, t).bottom >= a.top ? !1 : wo(e, t);
}
function dA(e, t, n, a = en().floors) {
  const s = cu(e, n, a);
  if (!e.home) return Px(e, t, s, a);
  if (!s) return null;
  const o = Gt(a, "home"), l = s.y - t.y, i = l > _o ? "dropping" : -l > Rx ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function Px(e, t, n, a) {
  const s = n ? Gt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: Nx(e.risen) };
  if (!n) return null;
  if (Co(t) && n.y - t.y > _o) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function fA(e, t, n) {
  const a = $o * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function mA(e, t, n, a = en().floors) {
  const s = t && cu(t, n, a);
  return s ? { ...e, ...s } : e;
}
const jx = ["data-type"], Fx = { class: "figure-floor-name" }, Wx = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ge({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      h("span", Fx, g(e.floor.type), 1)
    ], 12, jx));
  }
}, Hx = /* @__PURE__ */ z(Wx, [["__scopeId", "data-v-4e0f1e2e"]]), zx = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Ux = {
  __name: "FigureFloors",
  setup(e) {
    const t = nt(en().floors);
    let n = () => {
    };
    return Ce(() => {
      n = Ix((a) => t.value = a.floors), Bx();
    }), Re(() => {
      n(), uu();
    }), (a, s) => (r(), d("div", zx, [
      (r(!0), d(L, null, te(t.value, (o) => (r(), j(Hx, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, hA = /* @__PURE__ */ z(Ux, [["__scopeId", "data-v-e519168b"]]), dn = (e) => typeof e == "number" ? e : Date.parse(e);
function pA(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: dn(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => dn(s.row.created_at) - dn(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const Dl = 20;
async function vA(e, t, n) {
  for (let a = 0; a < Dl; a++) {
    const s = e().at(-1), o = t().at(-1);
    if (!s || !o || dn(o.created_at) <= dn(s.created_at) || !await n()) return a;
  }
  return Dl;
}
const Vx = 3, os = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function Gx(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = os[n.grouping]) == null ? void 0 : a.call(os, e.row, n)) || "";
}
function Kx(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function gA(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= Vx ? [Kx(a, t)] : a), a = [];
  };
  for (const l of e) {
    const i = Gx(l, t);
    i !== s && o(), s = i, i ? a.push(l) : n.push(l);
  }
  return o(), n;
}
const yA = (e) => (t) => t.filter((n) => n.id !== e), bA = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), kA = (e) => (t) => [...t, e], wA = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function $A(e, t = {}) {
  const n = ot(), a = _(null), s = _("");
  async function o(...l) {
    const i = await n.read(e(...l), t);
    s.value = i.ok ? "" : i.error, i.ok && (a.value = i.value);
  }
  return { value: a, failure: s, load: o };
}
function xA(e) {
  const t = ot(), n = _("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const Yn = /* @__PURE__ */ new Map();
function Yx(e, t) {
  if (Yn.has(e)) return Yn.get(e);
  const n = t().finally(() => Yn.delete(e));
  return Yn.set(e, n), n;
}
function SA() {
  const e = ot(), t = _(null), n = _("");
  async function a() {
    const s = await Yx(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const Qx = { class: "cards-page" }, Xx = { class: "cards-bar" }, Jx = { class: "cards-count" }, Zx = { class: "cards" }, e8 = {
  key: 1,
  class: "cards-note"
}, t8 = {
  key: 2,
  class: "cards-note"
}, n8 = ["data-row", "onClick"], a8 = { class: "card-head" }, s8 = { class: "card-title" }, o8 = { class: "card-foot" }, l8 = {
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
    return (a, s) => (r(), d("div", Qx, [
      h("div", Xx, [
        h("span", Jx, g(e.rows.length) + " " + g(e.rows.length === 1 ? e.term : `${e.term}s`), 1),
        E(ve, Pe({
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
            U(" New " + g(e.term), 1)
          ]),
          _: 1
        }, 16)
      ]),
      h("div", Zx, [
        e.loaded ? e.failure ? (r(), d("p", e8, g(e.failure), 1)) : e.rows.length ? k("", !0) : (r(), d("p", t8, "No " + g(e.term) + "s yet", 1)) : (r(), j(Je, {
          key: 0,
          shape: "cards"
        })),
        (r(!0), d(L, null, te(e.rows, (o) => (r(), d("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          h("span", a8, [
            E(le, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            U(" " + g(e.head(o)), 1),
            E(at, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          h("span", s8, g(e.title(o)), 1),
          h("span", o8, g(e.foot(o)), 1)
        ], 8, n8))), 128))
      ]),
      ie(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, MA = /* @__PURE__ */ z(l8, [["__scopeId", "data-v-b39fea5d"]]), Pl = "newest";
function _A(e, { title: t, isOpen: n = null }) {
  var c;
  const a = (c = _e(Le, null)) == null ? void 0 : c.search, s = _(""), o = _(Pl), l = _("all"), i = S(() => {
    const f = s.value.trim().toLowerCase(), m = e.value.filter((p) => vr(p, f, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(p) === (l.value === "open")));
    return o.value === Pl ? m : [...m].sort((p, y) => t(p).localeCompare(t(y)));
  }), u = S(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: i, filtering: u, hasStates: !!n };
}
const i8 = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, r8 = {
  class: "auto-scroll-newest-line",
  "data-scroll-newest-line": ""
}, u8 = 40, c8 = "top", d8 = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" }, feed: { type: Object, default: null } },
  setup(e, { expose: t }) {
    var p;
    const n = e, a = (p = _e(Le, null)) == null ? void 0 : p.autoScroll, s = S(() => a === c8), o = _(null), l = _(!1), i = (y) => s.value ? y.scrollTop : y.scrollHeight - y.scrollTop - y.clientHeight, u = () => s.value ? 0 : o.value.scrollHeight, c = () => o.value.scrollTo({ top: u(), behavior: "smooth" });
    function f() {
      var y;
      l.value = i(o.value) >= u8, s.value || (y = n.feed) == null || y.reachTop(o.value);
    }
    he(() => {
      var y;
      return [n.rowCount, (y = n.feed) == null ? void 0 : y.isLoaded()];
    }, async () => {
      await je(), o.value && (l.value || (o.value.scrollTop = u()), n.feed && !s.value && (n.feed.drawn(o.value), await n.feed.fill(o.value)));
    }, { immediate: !0, flush: "post" });
    let m = null;
    return Ce(() => {
      typeof MutationObserver > "u" || (m = new MutationObserver(() => {
        !l.value && o.value && (o.value.scrollTop = u());
      }), m.observe(o.value, { childList: !0, subtree: !0, attributes: !0, characterData: !0 }));
    }), st(() => m == null ? void 0 : m.disconnect()), t({ pane: o }), (y, b) => (r(), d("div", i8, [
      h("div", {
        ref_key: "pane",
        ref: o,
        class: Y(["auto-scroll-pane", e.paneClass]),
        onScroll: f
      }, [
        ie(y.$slots, "default", {}, void 0, !0)
      ], 34),
      h("div", r8, [
        E(Yt, {
          name: "auto-scroll-rise",
          persisted: ""
        }, {
          default: P(() => [
            Me(h("button", {
              type: "button",
              class: "auto-scroll-newest",
              "data-scroll-newest": "",
              title: "Back to the newest",
              onClick: c
            }, [
              E(le, {
                name: s.value ? "up" : "down"
              }, null, 8, ["name"]),
              b[0] || (b[0] = U(" Newest ", -1))
            ], 512), [
              [Ws, l.value]
            ])
          ]),
          _: 1
        })
      ])
    ]));
  }
}, CA = /* @__PURE__ */ z(d8, [["__scopeId", "data-v-d704d7e3"]]), f8 = ["aria-selected", "data-tab", "onClick"], m8 = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, h8 = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _e(Le, null), o = S(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = _(null), i = _({ left: 0, width: 0, slides: !1 }), u = (p) => n.answer[p.count_field] !== void 0;
    function c(p) {
      var b;
      const y = (b = l.value) == null ? void 0 : b.querySelector(".inner-tab.on");
      if (!y) return void (i.value = { left: 0, width: 0, slides: !1 });
      i.value = { left: y.offsetLeft, width: y.offsetWidth, slides: p }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, y.offsetLeft - 12));
    }
    const f = () => je(() => c(!0));
    let m = null;
    return Ce(() => {
      var p;
      c(!1), m = new ResizeObserver(() => c(!1)), m.observe(l.value), (p = document.fonts) == null || p.ready.then(() => c(!1));
    }), Re(() => m == null ? void 0 : m.disconnect()), he(() => {
      var p;
      return (p = n.active) == null ? void 0 : p.key;
    }, f), he(() => n.answer, f, { deep: !0 }), (p, y) => (r(), d("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (r(!0), d(L, null, te(o.value, (b) => {
        var x, C;
        return r(), d("button", {
          key: b.key,
          type: "button",
          role: "tab",
          class: Y(["inner-tab", { on: ((x = e.active) == null ? void 0 : x.key) === b.key }]),
          "aria-selected": ((C = e.active) == null ? void 0 : C.key) === b.key,
          "data-tab": b.key,
          onClick: (M) => a("choose", b)
        }, [
          U(g(b.label) + " ", 1),
          u(b) ? (r(), d("span", m8, g(e.answer[b.count_field]), 1)) : k("", !0)
        ], 10, f8);
      }), 128)),
      h("i", {
        class: Y(["inner-tabs-line", { slides: i.value.slides }]),
        style: ge({ left: `${i.value.left}px`, width: `${i.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, EA = /* @__PURE__ */ z(h8, [["__scopeId", "data-v-63fcd326"]]), p8 = { class: "task-bar" }, v8 = {
  __name: "TaskBar",
  props: { total: { type: Number, required: !0 }, done: { type: Number, required: !0 }, testing: { type: Number, required: !0 }, started: { type: Number, default: 0 } },
  setup(e) {
    const t = e, n = (a) => t.total ? Math.round(a / t.total * 100) : 0;
    return (a, s) => (r(), d("span", p8, [
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
}, AA = /* @__PURE__ */ z(v8, [["__scopeId", "data-v-eafa73d4"]]), g8 = {
  class: "tab-body",
  "data-tab-body": ""
}, y8 = { "data-tab-content": "" }, b8 = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = _(!1);
    let a = 0;
    return he(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, Hs(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (r(), d("div", g8, [
      n.value ? (r(), j(Je, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : k("", !0),
      Me(h("div", y8, [
        ie(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Ws, !n.value]
      ])
    ]));
  }
}, OA = /* @__PURE__ */ z(b8, [["__scopeId", "data-v-63876533"]]), k8 = {
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
    return (o, l) => (r(), j(kr, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (i) => n("pick", i))
    }, {
      menu: P(() => [
        E(bt, null, {
          default: P(() => [...l[2] || (l[2] = [
            U("Order", -1)
          ])]),
          _: 1
        }),
        (r(), d(L, null, te(a, (i) => E(He, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (u) => e.tools.order.value = i.key
        }, {
          default: P(() => [
            U(g(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (r(), d(L, { key: 0 }, [
          E(bt, null, {
            default: P(() => [...l[3] || (l[3] = [
              U("Show", -1)
            ])]),
            _: 1
          }),
          (r(), d(L, null, te(s, (i) => E(He, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (u) => e.tools.state.value = i.key
          }, {
            default: P(() => [
              U(g(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : k("", !0)
      ]),
      default: P(() => [
        ie(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, TA = /* @__PURE__ */ z(k8, [["__scopeId", "data-v-dab0064d"]]);
function IA() {
  const e = _(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const BA = (e) => import(
  /* @vite-ignore */
  e
), w8 = 86400, Ds = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function $8(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((Ds(t) - Ds(e)) / w8);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function RA(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = Ds(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: $8(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const ls = 280, is = 240, rs = 120, x8 = 6, S8 = 14, xn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function M8(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function du(e, t) {
  const n = Math.max(0, M8(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function _8(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${S8}px)` }), e.offsetHeight, e.style.transition = `height ${ls}ms ${xn}`, e.style.height = `${l}px`;
  const i = s();
  let u = !1, c = !1;
  const f = () => {
    c || (c = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, m = () => {
    if (c) return;
    n() && (t.scrollTop = du(t, e));
    const p = s() - i;
    if (!u && p >= ls && (u = !0, e.style.transition = `opacity ${is}ms ease-out, transform ${is}ms ${xn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < ls + is) return a(m);
    f();
  };
  return a(m), f;
}
function LA(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${x8}px)` }), e.offsetHeight, e.style.transition = `opacity ${rs}ms ease-out, transform ${rs}ms ${xn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), i = () => {
    if (n() && (t.scrollTop = du(t, e)), s() - l < rs) return a(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(i);
}
const C8 = 140, Qn = 220, jl = 5;
function NA({ gap: e = C8, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function i(f, m) {
    a.add(f), f.cancel = f.arrival(f.el, f.options, () => {
      a.delete(f), f.done(), m();
    });
  }
  function u() {
    const f = n.splice(0, jl);
    if (s = f.length > 0, !s) return;
    let m = f.length;
    for (const p of f)
      p.el.style.display = p.display, i(p, () => {
        m -= 1, m || (o = t(u, e));
      });
  }
  const c = (f, m, p, y = _8) => {
    if (l || !m.pane || !m.follows()) return p();
    const b = { el: f, options: m, done: p, arrival: y, display: f.style.display || "" };
    if (!s)
      return s = !0, i(b, () => o = t(u, e));
    f.style.display = "none", n.push(b), n.length >= jl && c.flush();
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
function qA(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Qn}ms ${xn}, opacity ${Qn}ms ease-in, margin ${Qn}ms ${xn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Qn);
}
const fu = "chat.pins.minimised", na = _(sa(fu, !1));
function Fl(e) {
  na.value = e, so(fu, e);
}
function E8(e) {
  const t = S(() => e()), n = S(() => na.value ? [] : e()), a = () => Fl(!na.value), s = Date.now() / 1e3;
  return he(
    () => t.value.filter((o) => Tt(o) > s).length,
    (o, l) => o > l && Fl(!1)
  ), { pins: t, visible: n, minimised: na, toggle: a };
}
const A8 = ["title"], O8 = {
  key: 0,
  class: "pins-count"
}, T8 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = E8(() => t.pinRows);
    return (o, l) => B(n).length ? (r(), d("button", {
      key: 0,
      type: "button",
      class: Y(["pins-toggle", { minimised: B(a), inline: e.inline }]),
      title: B(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = ke((...i) => B(s) && B(s)(...i), ["stop"]))
    }, [
      E(le, {
        name: B(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      B(a) ? (r(), d("span", O8, g(B(n).length), 1)) : k("", !0)
    ], 10, A8)) : k("", !0);
  }
}, DA = /* @__PURE__ */ z(T8, [["__scopeId", "data-v-d073c504"]]), I8 = ["title"], B8 = ["title"], R8 = { class: "diff-card-dir" }, L8 = { class: "diff-card-name" }, N8 = {
  key: 1,
  class: "diff-card-from",
  "data-diff-card-from": ""
}, q8 = ["title"], D8 = ["title"], P8 = {
  key: 0,
  class: "diff-card-note"
}, j8 = ["href"], F8 = ["src", "alt"], W8 = { class: "diff-card-rows" }, H8 = { class: "diff-row-num" }, z8 = { class: "diff-row-sign" }, U8 = { class: "diff-row-code" }, V8 = {
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
    const l = { new: "created", deleted: "deleted", moved: "moved" }, i = { add: "+", del: "−" }, u = S(() => n.path.lastIndexOf("/") + 1), c = S(() => n.path.slice(0, u.value)), f = S(() => n.path.slice(u.value)), m = S(() => n.change === "deleted"), p = S(() => l[n.change]), y = S(() => new Set(n.rows.filter((D) => D.line_type === "add").map((D) => D.line))), b = _("after"), x = S(() => b.value === "before" ? n.whole.old : n.whole.text), C = S(() => n.whole && n.whole.text !== void 0 ? x.value.split(`
`).map((D, w) => ({ line_type: b.value === "after" && y.value.has(w + 1) ? "add" : "ctx", line: w + 1, text: D })) : n.rows.filter(
      (D) => !(n.editsOnly && ["ctx", "fold"].includes(D.line_type)) && !(n.hideRemovals && D.line_type === "del")
    )), M = _(!1), T = S(() => n.lines && !M.value && !n.whole), H = S(() => T.value ? C.value.slice(0, n.lines) : C.value), W = S(() => C.value.length - H.value.length), I = (D) => D.line === null || D.line_type === "del" ? "" : D.line, G = (D) => D.line_type === "fold" ? D.hidden ? `⋯ ${D.hidden} lines` : "⋯" : D.text, q = _(null), A = _(null);
    let N = null;
    return Ce(() => {
      if (!A.value) return;
      let D = !0;
      N = new ResizeObserver(() => {
        !q.value || !A.value || (q.value.style.transition = D ? "none" : "", q.value.style.height = `${A.value.offsetHeight}px`, D = !1);
      }), N.observe(A.value);
    }), Re(() => N && N.disconnect()), (D, w) => (r(), d("section", {
      class: Y(["diff-card", { half: e.half, gone: m.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      h("header", {
        class: "diff-card-head",
        title: m.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: w[2] || (w[2] = (v) => !m.value && a("fold"))
      }, [
        h("span", {
          class: "diff-card-path",
          title: `${e.path} · ${B(s)}-click to open it`,
          onClick: o
        }, [
          h("span", R8, g(c.value), 1),
          h("span", L8, g(f.value), 1),
          p.value ? (r(), d("span", {
            key: 0,
            class: Y(["diff-card-badge", e.change])
          }, g(p.value), 3)) : k("", !0),
          e.from ? (r(), d("span", N8, "from " + g(e.from), 1)) : k("", !0)
        ], 8, B8),
        h("span", {
          class: Y(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + g(e.added), 3),
        h("span", {
          class: Y(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + g(e.removed), 3),
        E(at, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: b.value === "after" ? "Show the file before" : "Show the file after",
          onClick: w[0] || (w[0] = ke((v) => b.value = b.value === "after" ? "before" : "after", ["stop"]))
        }, g(b.value === "after" ? "After" : "Before"), 9, q8)) : k("", !0),
        m.value ? k("", !0) : (r(), d("button", {
          key: 1,
          type: "button",
          class: Y(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: w[1] || (w[1] = ke((v) => a("whole"), ["stop"]))
        }, [
          E(le, {
            name: "file",
            size: 12
          })
        ], 10, D8))
      ], 8, I8),
      e.whole && e.whole.error ? (r(), d("p", P8, g(e.whole.error), 1)) : k("", !0),
      !m.value && !e.folded ? (r(), d(L, { key: 1 }, [
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
          }, null, 8, F8)
        ], 8, j8)) : (r(), d("div", {
          key: 1,
          ref_key: "grow",
          ref: q,
          class: "diff-card-grow"
        }, [
          h("div", {
            ref_key: "body",
            ref: A,
            class: "diff-card-diff"
          }, [
            h("div", W8, [
              (r(!0), d(L, null, te(H.value, (v, $) => (r(), d("div", {
                key: $,
                class: Y(["diff-row", v.line_type, { fresh: e.fresh && v.edit === e.fresh }])
              }, [
                h("span", H8, g(I(v)), 1),
                h("span", z8, g(i[v.line_type]), 1),
                h("span", U8, g(G(v)), 1)
              ], 2))), 128)),
              W.value > 0 ? (r(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: w[3] || (w[3] = ke((v) => M.value = !0, ["stop"]))
              }, g(W.value) + " more " + g(W.value === 1 ? "line" : "lines"), 1)) : k("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : k("", !0)
    ], 2));
  }
}, PA = /* @__PURE__ */ z(V8, [["__scopeId", "data-v-021c4dbc"]]), G8 = { "data-queue-controls": "" }, K8 = { class: "counts" }, Y8 = { "data-queue-spots": "" }, Q8 = {
  class: "spots",
  "aria-label": "Slot units in use"
}, X8 = { "data-queue-waiting": "" }, J8 = { key: 0 }, Z8 = { class: "control" }, e3 = { class: "stepper" }, t3 = ["disabled"], n3 = {
  "aria-labelledby": "queue-limit-label",
  "data-queue-limit": ""
}, a3 = ["disabled"], s3 = ["for"], o3 = ["id", "value", "disabled", "onChange"], l3 = {
  key: 0,
  class: "note halted",
  role: "status",
  "data-queue-update-waits": ""
}, i3 = {
  key: 1,
  class: "note halted",
  role: "status",
  "data-queue-held": ""
}, r3 = {
  key: 2,
  class: "note failure",
  role: "alert"
}, u3 = {
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
    return (i, u) => (r(), d("div", G8, [
      E(It, { icon: "gauge" }, {
        default: P(() => [...u[2] || (u[2] = [
          U("Now", -1)
        ])]),
        _: 1
      }),
      h("div", K8, [
        h("div", null, [
          h("strong", Y8, [
            U(g(e.queue.used_slots) + " ", 1),
            h("span", null, "of " + g(e.queue.parallel_limit), 1)
          ]),
          h("p", null, "Slot units of long runs in use. " + g(e.queue.used_slots >= e.queue.parallel_limit ? "Every unit is taken." : `${e.queue.parallel_limit - e.queue.used_slots} ${e.queue.parallel_limit - e.queue.used_slots === 1 ? "unit" : "units"} free.`), 1),
          h("div", Q8, [
            (r(!0), d(L, null, te(e.queue.parallel_limit, (c) => (r(), d("span", {
              key: c,
              class: Y({ used: c <= e.queue.used_slots })
            }, null, 2))), 128))
          ])
        ]),
        h("div", null, [
          h("strong", X8, g(e.queue.waiting_count), 1),
          u[3] || (u[3] = h("p", null, "Commands waiting", -1)),
          e.queue.waiting_count ? (r(), d("p", J8, "The oldest goes first.")) : k("", !0)
        ])
      ]),
      h("div", Z8, [
        u[4] || (u[4] = h("div", null, [
          h("label", { id: "queue-limit-label" }, "Long lane capacity"),
          h("p", null, "Slot units of long runs that may run at the same time; a test or a build costs 4. The rest wait. Lowering it stops none that are running.")
        ], -1)),
        h("div", e3, [
          h("button", {
            type: "button",
            "aria-label": "One slot unit fewer",
            disabled: s.value || e.queue.parallel_limit <= 1,
            onClick: u[0] || (u[0] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit - 1))
          }, "−", 8, t3),
          h("output", n3, g(e.queue.parallel_limit), 1),
          h("button", {
            type: "button",
            "aria-label": "One slot unit more",
            disabled: s.value,
            onClick: u[1] || (u[1] = (c) => l(e.queue.limit_setting, e.queue.parallel_limit + 1))
          }, "+", 8, a3)
        ])
      ]),
      (r(!0), d(L, null, te(e.queue.suite_limits, (c) => (r(), d("div", {
        key: c.key,
        class: "control"
      }, [
        h("div", null, [
          h("label", {
            for: c.key
          }, g(c.title), 9, s3),
          h("p", null, g(c.description), 1)
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
        }, null, 40, o3)
      ]))), 128)),
      e.queue.halt_cause === "update" ? (r(), d("p", l3, [
        E(le, {
          name: "pause",
          size: 13
        }),
        u[5] || (u[5] = U("An update waits for the running commands to end. Every command that waits stays in the queue, in order, and gets its place once the update is done.", -1))
      ])) : e.queue.halted ? (r(), d("p", i3, [
        E(le, {
          name: "pause",
          size: 13
        }),
        U("The queue is paused. No waiting command gets a place until it is resumed. " + g(e.queue.halt_reason), 1)
      ])) : k("", !0),
      o.value ? (r(), d("p", r3, g(o.value), 1)) : k("", !0)
    ]));
  }
}, c3 = /* @__PURE__ */ z(u3, [["__scopeId", "data-v-f0a1f7f7"]]), d3 = ["data-queue-row", "data-queue-process"], f3 = ["aria-expanded"], m3 = { class: "run-line" }, h3 = { class: "leading" }, p3 = {
  key: 0,
  "data-queue-position": ""
}, v3 = ["title"], g3 = { class: "command" }, y3 = {
  class: "time",
  "data-queue-time": ""
}, b3 = { class: "details" }, k3 = { "data-queue-type": "" }, w3 = { class: "failed" }, $3 = { class: "drop-inner" }, x3 = { class: "output" }, S3 = { class: "output-heading" }, M3 = ["href"], _3 = {
  __name: "ProcessQueueRun",
  props: { run: { type: Object, required: !0 }, environment: { type: String, required: !0 }, position: { type: Number, required: !0 }, read: { type: Function, required: !0 }, expanded: Boolean },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(), o = xr((p) => n.read([...p, "--limit", "50"]), () => n.run.id), l = o.lines, i = ho(), u = S(() => n.run.plugin ? `Plugin ${n.run.plugin}` : { test: "Test run", build: "Build", check: "Check", install: "Install" }[n.run.category] || n.run.category.charAt(0).toUpperCase() + n.run.category.slice(1)), c = S(() => {
      const p = n.run.section === "waiting" ? n.run.created_at : n.run.started_at;
      if (!p) return "";
      const y = n.run.ended_at ? new Date(n.run.ended_at).getTime() : i.value * 1e3, b = Math.max(0, Math.floor((y - new Date(p).getTime()) / 1e3));
      return b < 60 ? `${b} s` : b < 3600 ? `${Math.floor(b / 60)} m ${b % 60} s` : `${Math.floor(b / 3600)} h ${String(Math.floor(b / 60) % 60).padStart(2, "0")} m`;
    });
    async function f() {
      if (!n.expanded) return;
      const p = s.value, y = p.scrollHeight - p.scrollTop - p.clientHeight < 2;
      await o.follow(), await je(), n.expanded && y && (p.scrollTop = p.scrollHeight);
    }
    async function m() {
      n.expanded && (await o.newest(), await je(), n.expanded && (s.value.scrollTop = s.value.scrollHeight, o.feed.drawn(s.value)));
    }
    return he(() => n.expanded, m, { immediate: !0 }), An(["output.*"], f, (p) => ii(p, /* @__PURE__ */ new Set([n.run.id]))), (p, y) => (r(), d("div", {
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
          y[3] || (y[3] = At(ke((b) => a("toggle"), ["prevent"]), ["enter"])),
          y[4] || (y[4] = At(ke((b) => a("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        h("div", m3, [
          h("span", h3, [
            e.run.section === "waiting" ? (r(), d("span", p3, g(e.position), 1)) : (r(), d("span", {
              key: 1,
              class: Y(["dot", { passed: e.run.section === "recent" && e.run.state === "finished", failed: e.run.section === "recent" && e.run.state !== "finished" }]),
              title: e.run.section === "recent" ? e.run.state === "finished" ? "Passed" : "Failed" : "Running"
            }, null, 10, v3))
          ]),
          h("code", g3, g(e.run.line), 1),
          h("span", y3, g(c.value), 1),
          E(le, {
            class: Y(["chevron", { open: e.expanded }]),
            name: "chevronRight",
            facing: "down",
            size: 12
          }, null, 8, ["class"])
        ]),
        h("div", b3, [
          h("span", k3, g(u.value), 1),
          e.run.owner_agent_id ? (r(), d(L, { key: 0 }, [
            y[6] || (y[6] = h("span", { class: "separator" }, "·", -1)),
            h("button", {
              type: "button",
              class: "link",
              "data-queue-agent": "",
              onClick: y[0] || (y[0] = ke((b) => B(wt)("agents", e.run.owner_agent_id), ["stop"]))
            }, "Agent " + g(e.run.owner_agent_id), 1)
          ], 64)) : e.run.is_main ? (r(), d(L, { key: 1 }, [
            y[7] || (y[7] = h("span", { class: "separator" }, "·", -1)),
            y[8] || (y[8] = h("span", null, "Main agent", -1))
          ], 64)) : k("", !0),
          e.run.task_id ? (r(), d(L, { key: 2 }, [
            y[9] || (y[9] = h("span", { class: "separator" }, "·", -1)),
            h("button", {
              type: "button",
              class: "link",
              "data-queue-task": "",
              onClick: y[1] || (y[1] = ke((b) => B(wt)("tasks", e.run.task_id), ["stop"]))
            }, "Task " + g(e.run.task_id), 1)
          ], 64)) : k("", !0),
          e.run.state === "failed" ? (r(), d(L, { key: 3 }, [
            y[10] || (y[10] = h("span", { class: "separator" }, "·", -1)),
            h("span", w3, "Failed, exit " + g(e.run.exit_code), 1)
          ], 64)) : k("", !0)
        ])
      ], 40, f3),
      h("div", {
        class: Y(["drop", { open: e.expanded }])
      }, [
        h("div", $3, [
          h("div", x3, [
            h("div", S3, [
              h("span", null, "Output " + g(e.run.id), 1),
              h("a", {
                href: `?page=processes.output&output=${e.run.id}&environment=${encodeURIComponent(e.environment)}`,
                target: "_blank",
                rel: "noopener"
              }, "Open output window", 8, M3)
            ]),
            h("pre", {
              ref_key: "output",
              ref: s,
              "data-queue-output-body": "",
              onScroll: y[5] || (y[5] = (b) => e.expanded && B(o).loadEarlier(b.target))
            }, [
              y[11] || (y[11] = h("span", { class: "prompt" }, "$ ", -1)),
              U(g(e.run.line), 1),
              B(l).length ? (r(), d(L, { key: 0 }, [
                U(g(`
` + B(l).join(`
`)), 1)
              ], 64)) : k("", !0)
            ], 544)
          ])
        ])
      ], 2)
    ], 8, d3));
  }
}, C3 = /* @__PURE__ */ z(_3, [["__scopeId", "data-v-26ce3024"]]), E3 = {
  class: "lanes",
  "data-execution-lanes": ""
}, A3 = { class: "filters" }, O3 = ["value"], T3 = ["value"], I3 = ["data-lane"], B3 = {
  key: 0,
  class: "empty"
}, R3 = { class: "line" }, L3 = { class: "facts" }, N3 = { class: "line" }, q3 = { class: "facts" }, D3 = {
  class: "waits",
  "data-lanes-waits": ""
}, P3 = {
  key: 0,
  class: "empty"
}, j3 = {
  __name: "ExecutionLanes",
  props: { execution: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = _(""), a = _(""), s = S(() => [...new Set(t.execution.lanes.flatMap((m) => [...m.running, ...m.waiting].map((p) => p.class)))].sort()), o = S(() => [...new Set(t.execution.lanes.flatMap((m) => [...m.running, ...m.waiting].map((p) => p.starter)))].sort()), l = (m) => (!n.value || m.class === n.value) && (!a.value || m.starter === a.value), i = S(() => t.execution.lanes.map((m) => ({ ...m, running: m.running.filter(l), waiting: m.waiting.filter(l) }))), u = S(() => t.execution.waits.filter((m) => m.runs)), c = (m) => `${m.lane[0].toUpperCase()}${m.lane.slice(1)} lane`, f = (m) => m < 60 ? `${m} s` : `${Math.round(m / 60)} min`;
    return (m, p) => (r(), d("section", E3, [
      h("div", A3, [
        h("label", null, [
          p[3] || (p[3] = U("Class ", -1)),
          Me(h("select", {
            "onUpdate:modelValue": p[0] || (p[0] = (y) => n.value = y),
            "data-lanes-class": ""
          }, [
            p[2] || (p[2] = h("option", { value: "" }, "Every class", -1)),
            (r(!0), d(L, null, te(s.value, (y) => (r(), d("option", {
              key: y,
              value: y
            }, g(y), 9, O3))), 128))
          ], 512), [
            [Ut, n.value]
          ])
        ]),
        h("label", null, [
          p[5] || (p[5] = U("Started by ", -1)),
          Me(h("select", {
            "onUpdate:modelValue": p[1] || (p[1] = (y) => a.value = y),
            "data-lanes-starter": ""
          }, [
            p[4] || (p[4] = h("option", { value: "" }, "Anyone", -1)),
            (r(!0), d(L, null, te(o.value, (y) => (r(), d("option", {
              key: y,
              value: y
            }, g(y), 9, T3))), 128))
          ], 512), [
            [Ut, a.value]
          ])
        ])
      ]),
      (r(!0), d(L, null, te(i.value, (y) => (r(), d("div", {
        key: y.lane,
        class: "lane",
        "data-lane": y.lane
      }, [
        h("h2", null, [
          U(g(c(y)) + " ", 1),
          h("span", {
            class: Y(["room", { over: y.over_capacity }])
          }, [
            U(g(y.used) + " of " + g(y.capacity) + " in use", 1),
            y.over_capacity ? (r(), d(L, { key: 0 }, [
              U(", over capacity")
            ], 64)) : k("", !0),
            y.halted ? (r(), d(L, { key: 1 }, [
              U(", halted")
            ], 64)) : k("", !0)
          ], 2)
        ]),
        !y.running.length && !y.waiting.length ? (r(), d("p", B3, "Nothing runs or waits here.")) : k("", !0),
        h("ul", null, [
          (r(!0), d(L, null, te(y.running, (b, x) => (r(), d("li", {
            key: `run:${x}`,
            class: Y({ child: b.parent_line }),
            "data-lane-entry": "running"
          }, [
            h("span", R3, g(b.line), 1),
            h("span", L3, [
              U(g(b.class) + ", " + g(b.priority) + ", " + g(b.starter) + ", running " + g(f(b.seconds)), 1),
              b.parent_line ? (r(), d(L, { key: 0 }, [
                U(", for " + g(b.parent_line), 1)
              ], 64)) : k("", !0)
            ])
          ], 2))), 128)),
          (r(!0), d(L, null, te(y.waiting, (b, x) => (r(), d("li", {
            key: `wait:${x}`,
            class: "waiting",
            "data-lane-entry": "waiting"
          }, [
            h("span", N3, g(b.line), 1),
            h("span", q3, [
              U(g(b.class) + ", " + g(b.priority) + ", " + g(b.starter) + ", waiting " + g(f(b.seconds)) + ": " + g(b.reason), 1),
              b.raised_from ? (r(), d(L, { key: 0 }, [
                U(". Raised from " + g(b.raised_from), 1)
              ], 64)) : k("", !0)
            ])
          ]))), 128))
        ])
      ], 8, I3))), 128)),
      h("div", D3, [
        p[6] || (p[6] = h("h2", null, "Waits over the last hour", -1)),
        u.value.length ? k("", !0) : (r(), d("p", P3, "No run started in the last hour.")),
        (r(!0), d(L, null, te(u.value, (y) => (r(), d("p", {
          key: y.priority,
          class: "wait"
        }, g(y.priority) + ": " + g(y.runs) + " started, longest wait " + g(f(y.longest_seconds)) + ", average " + g(f(y.average_seconds)), 1))), 128))
      ])
    ]));
  }
}, F3 = /* @__PURE__ */ z(j3, [["__scopeId", "data-v-4a25d644"]]), mu = ["instant", "short", "long"], hu = ["background", "normal", "agent", "reserved", "immediate"], W3 = [
  { name: "small", title: "Small machine" },
  { name: "medium", title: "Medium machine" },
  { name: "large", title: "Large machine" }
];
function pu(e) {
  return ["--lane", e.lane, "--cost", String(e.cost), "--priority", e.priority, "--limit", String(e.limit)];
}
const H3 = ["data-class-row"], z3 = { scope: "row" }, U3 = { key: 0 }, V3 = ["value"], G3 = ["value"], K3 = { class: "actions" }, Y3 = ["disabled"], Q3 = ["disabled"], X3 = { class: "actions" }, J3 = ["disabled"], Z3 = ["disabled"], eS = ["disabled"], tS = {
  __name: "ExecutionClassRow",
  props: { entry: { type: Object, required: !0 }, saving: Boolean },
  emits: ["send"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1), o = _({}), l = { "built-in": "Built in", changed: "Changed", "your own": "Your own" };
    function i() {
      o.value = { ...n.entry }, s.value = !0;
    }
    function u() {
      a("send", ["queue-class", "set", n.entry.name, ...pu(o.value)], () => s.value = !1);
    }
    return (c, f) => (r(), d("tr", {
      "data-class-row": e.entry.name
    }, [
      h("th", z3, [
        U(g(e.entry.name), 1),
        e.entry.pattern || e.entry.plugin ? (r(), d("small", U3, g(e.entry.pattern || `plugin ${e.entry.plugin}`), 1)) : k("", !0)
      ]),
      s.value ? (r(), d(L, { key: 0 }, [
        h("td", null, [
          Me(h("select", {
            "onUpdate:modelValue": f[0] || (f[0] = (m) => o.value.lane = m),
            "aria-label": "Lane",
            "data-class-lane": ""
          }, [
            (r(!0), d(L, null, te(B(mu), (m) => (r(), d("option", {
              key: m,
              value: m
            }, g(m), 9, V3))), 128))
          ], 512), [
            [Ut, o.value.lane]
          ])
        ]),
        h("td", null, [
          Me(h("input", {
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
          Me(h("select", {
            "onUpdate:modelValue": f[2] || (f[2] = (m) => o.value.priority = m),
            "aria-label": "Priority",
            "data-class-priority": ""
          }, [
            (r(!0), d(L, null, te(B(hu), (m) => (r(), d("option", {
              key: m,
              value: m
            }, g(m), 9, G3))), 128))
          ], 512), [
            [Ut, o.value.priority]
          ])
        ]),
        h("td", null, [
          Me(h("input", {
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
        h("td", K3, [
          h("button", {
            type: "button",
            disabled: e.saving,
            "data-class-save": "",
            onClick: u
          }, "Save", 8, Y3),
          h("button", {
            type: "button",
            disabled: e.saving,
            onClick: f[4] || (f[4] = (m) => s.value = !1)
          }, "Cancel", 8, Q3)
        ])
      ], 64)) : (r(), d(L, { key: 1 }, [
        h("td", null, g(e.entry.lane), 1),
        h("td", null, g(e.entry.cost), 1),
        h("td", null, g(e.entry.priority), 1),
        h("td", null, g(e.entry.limit || "no limit"), 1),
        h("td", X3, [
          h("span", {
            class: Y(["origin", { own: e.entry.origin !== "built-in" }])
          }, g(l[e.entry.origin]), 3),
          h("button", {
            type: "button",
            disabled: e.saving,
            "data-class-edit": "",
            onClick: i
          }, "Edit", 8, J3),
          e.entry.origin === "changed" ? (r(), d("button", {
            key: 0,
            type: "button",
            disabled: e.saving,
            "data-class-reset": "",
            onClick: f[5] || (f[5] = (m) => a("send", ["queue-class", "reset", e.entry.name]))
          }, "Reset", 8, Z3)) : k("", !0),
          e.entry.origin === "your own" ? (r(), d("button", {
            key: 1,
            type: "button",
            disabled: e.saving,
            "data-class-remove": "",
            onClick: f[6] || (f[6] = (m) => a("send", ["queue-class", "remove", e.entry.name]))
          }, "Remove", 8, eS)) : k("", !0)
        ])
      ], 64))
    ], 8, H3));
  }
}, nS = /* @__PURE__ */ z(tS, [["__scopeId", "data-v-e51b4825"]]), aS = { class: "fields" }, sS = ["disabled"], oS = ["disabled"], lS = ["value"], iS = ["value"], rS = { class: "buttons" }, uS = ["disabled"], cS = ["disabled"], dS = {
  key: 0,
  class: "preview",
  "data-class-preview-lines": ""
}, fS = { key: 1 }, mS = {
  key: 1,
  class: "hint"
}, hS = {
  key: 2,
  class: "failure",
  role: "alert"
}, pS = {
  __name: "ExecutionClassForm",
  props: { read: { type: Function, required: !0 }, saving: Boolean },
  emits: ["send"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _({ name: "", pattern: "", plugin: "", lane: "long", cost: 1, priority: "normal", limit: 0 }), o = _(null), l = _(""), i = S(() => s.value.pattern ? ["--pattern", s.value.pattern] : s.value.plugin ? ["--plugin", s.value.plugin] : []);
    he(() => [s.value.pattern, s.value.plugin], () => o.value = null);
    async function u() {
      const f = await n.read(["queue-class", "preview", ...i.value]);
      l.value = f.ok ? "" : f.error, o.value = f.ok ? f.value.lines : null;
    }
    function c() {
      a("send", ["queue-class", "add", s.value.name, ...i.value, ...pu(s.value)], () => {
        s.value = { ...s.value, name: "", pattern: "", plugin: "" };
      });
    }
    return (f, m) => (r(), d("form", {
      class: "add",
      "data-class-form": "",
      onSubmit: ke(c, ["prevent"])
    }, [
      h("div", aS, [
        h("label", null, [
          m[7] || (m[7] = U("Name", -1)),
          Me(h("input", {
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
          Me(h("input", {
            "onUpdate:modelValue": m[1] || (m[1] = (p) => s.value.pattern = p),
            placeholder: "for example ^npm run e2e",
            disabled: !!s.value.plugin,
            "data-class-pattern": ""
          }, null, 8, sS), [
            [Ke, s.value.pattern]
          ])
        ]),
        h("label", null, [
          m[9] || (m[9] = U("Or plugin", -1)),
          Me(h("input", {
            "onUpdate:modelValue": m[2] || (m[2] = (p) => s.value.plugin = p),
            disabled: !!s.value.pattern,
            "data-class-plugin": ""
          }, null, 8, oS), [
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
          Me(h("select", {
            "onUpdate:modelValue": m[3] || (m[3] = (p) => s.value.lane = p)
          }, [
            (r(!0), d(L, null, te(B(mu), (p) => (r(), d("option", {
              key: p,
              value: p
            }, g(p), 9, lS))), 128))
          ], 512), [
            [Ut, s.value.lane]
          ])
        ]),
        h("label", null, [
          m[11] || (m[11] = U("Slot units", -1)),
          Me(h("input", {
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
          Me(h("select", {
            "onUpdate:modelValue": m[5] || (m[5] = (p) => s.value.priority = p)
          }, [
            (r(!0), d(L, null, te(B(hu), (p) => (r(), d("option", {
              key: p,
              value: p
            }, g(p), 9, iS))), 128))
          ], 512), [
            [Ut, s.value.priority]
          ])
        ]),
        h("label", null, [
          m[13] || (m[13] = U("At once", -1)),
          Me(h("input", {
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
      h("div", rS, [
        h("button", {
          type: "button",
          disabled: !i.value.length,
          "data-class-preview": "",
          onClick: u
        }, "Show matching lines", 8, uS),
        h("button", {
          type: "submit",
          disabled: e.saving || o.value === null || !s.value.name,
          "data-class-add": ""
        }, "Add class", 8, cS)
      ]),
      o.value !== null ? (r(), d("div", dS, [
        o.value.length ? (r(), d(L, { key: 0 }, [
          h("p", null, g(o.value.length) + " recent lines would have matched:", 1),
          (r(!0), d(L, null, te(o.value, (p) => (r(), d("code", { key: p }, g(p), 1))), 128))
        ], 64)) : (r(), d("p", fS, "No recent line would have matched."))
      ])) : i.value.length ? (r(), d("p", mS, "See which recent lines the class would match before you add it.")) : k("", !0),
      l.value ? (r(), d("p", hS, g(l.value), 1)) : k("", !0)
    ], 32));
  }
}, vS = /* @__PURE__ */ z(pS, [["__scopeId", "data-v-f15e19ad"]]), gS = { "data-execution-classes": "" }, yS = ["for"], bS = ["id", "value", "disabled", "data-lane-setting", "onChange"], kS = { class: "control presets" }, wS = ["disabled", "data-class-preset", "onClick"], $S = { class: "scroll" }, xS = { "data-class-table": "" }, SS = {
  key: 1,
  class: "failure",
  role: "alert",
  "data-class-failure": ""
}, MS = {
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
    return Ce(o), (i, u) => (r(), d("section", gS, [
      E(It, { icon: "gauge" }, {
        default: P(() => [...u[0] || (u[0] = [
          U("Execution classes", -1)
        ])]),
        _: 1
      }),
      u[3] || (u[3] = h("p", { class: "lead" }, "Each run the journal starts belongs to a class, which says its lane, how many slot units it takes and its priority.", -1)),
      n.value ? (r(), d(L, { key: 0 }, [
        (r(!0), d(L, null, te(n.value.settings, (c) => (r(), d("div", {
          key: c.key,
          class: "control"
        }, [
          h("div", null, [
            h("label", {
              for: c.key
            }, g(c.title), 9, yS),
            h("p", null, g(c.description), 1)
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
          }, null, 40, bS)
        ]))), 128)),
        h("div", kS, [
          u[1] || (u[1] = h("div", null, [
            h("label", null, "Size for this machine"),
            h("p", null, "Sets every lane's capacity from the number of processor cores.")
          ], -1)),
          (r(!0), d(L, null, te(B(W3), (c) => (r(), d("button", {
            key: c.name,
            type: "button",
            disabled: s.value,
            "data-class-preset": c.name,
            onClick: (f) => l(["queue-class", "preset", c.name])
          }, g(c.title), 9, wS))), 128))
        ]),
        h("div", $S, [
          h("table", xS, [
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
              (r(!0), d(L, null, te(n.value.classes, (c) => (r(), j(nS, {
                key: c.name,
                entry: c,
                saving: s.value,
                onSend: l
              }, null, 8, ["entry", "saving"]))), 128))
            ])
          ])
        ]),
        E(vS, {
          read: e.read,
          saving: s.value,
          onSend: l
        }, null, 8, ["read", "saving"])
      ], 64)) : k("", !0),
      a.value ? (r(), d("p", SS, g(a.value), 1)) : k("", !0)
    ]));
  }
}, _S = /* @__PURE__ */ z(MS, [["__scopeId", "data-v-f6def058"]]), CS = {
  class: "process-queue",
  "data-test-queue": ""
}, ES = {
  key: 0,
  class: "lead"
}, AS = { class: "scroll" }, OS = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, TS = ["data-queue-empty"], us = 20, IS = {
  __name: "ProcessQueueBody",
  props: { read: { type: Function, required: !0 }, agent: { type: Number, default: 0 } },
  setup(e) {
    const t = e, n = S(() => t.agent ? ["--agent", `row:${t.agent}`] : []), a = _(null), s = _(""), o = _([]), l = _(us), i = S(() => {
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
      ...b.rows.length ? b.rows.map((x, C) => ({ key: `run:${x.id}`, run: x, position: C + 1 })) : [{ key: `none:${b.type}`, section: b, empty: !0 }]
    ]) : []);
    function f(y) {
      o.value = o.value.includes(y) ? o.value.filter((b) => b !== y) : [...o.value, y];
    }
    async function m() {
      const y = ++u, b = await t.read([...l.value === us ? ["queue", "list"] : ["queue", "list", "--recent", String(l.value)], ...n.value]);
      y === u && (s.value = b.ok ? "" : b.error, b.ok && (a.value = b.value));
    }
    function p() {
      l.value += us, m();
    }
    return An(["process.*", "setting.*"], m), Ce(m), (y, b) => (r(), d("article", CS, [
      e.agent ? k("", !0) : (r(), d("p", ES, "Commands from workers wait here for a free place. Reading and editing never wait.")),
      h("div", AS, [
        s.value ? (r(), d("p", OS, g(s.value), 1)) : k("", !0),
        a.value ? (r(), d(L, { key: 1 }, [
          e.agent ? k("", !0) : (r(), j(c3, {
            key: 0,
            queue: a.value,
            read: e.read,
            onSaved: m
          }, null, 8, ["queue", "read"])),
          a.value.execution && !e.agent ? (r(), j(F3, {
            key: 1,
            execution: a.value.execution
          }, null, 8, ["execution"])) : k("", !0),
          E(Fs, {
            name: "queue",
            tag: "div",
            class: "queue-list"
          }, {
            default: P(() => [
              (r(!0), d(L, null, te(c.value, (x) => (r(), d(L, {
                key: x.key
              }, [
                x.run ? (r(), j(C3, {
                  key: 0,
                  run: x.run,
                  environment: a.value.environment_name,
                  position: x.position,
                  read: e.read,
                  expanded: o.value.includes(x.run.id),
                  onToggle: (C) => f(x.run.id)
                }, null, 8, ["run", "environment", "position", "read", "expanded", "onToggle"])) : x.empty ? (r(), d("p", {
                  key: 1,
                  class: "empty",
                  "data-queue-empty": x.section.type
                }, g(x.section.empty), 9, TS)) : (r(), j(It, {
                  key: 2,
                  class: "sticky-band",
                  icon: x.section.icon,
                  count: x.section.rows.length,
                  "data-queue-heading": x.section.type
                }, {
                  default: P(() => [
                    U(g(x.section.heading), 1)
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
          e.agent ? k("", !0) : (r(), j(_S, {
            key: 3,
            read: e.read
          }, null, 8, ["read"]))
        ], 64)) : s.value ? k("", !0) : (r(), j(Je, { key: 2 }))
      ])
    ]));
  }
}, jA = /* @__PURE__ */ z(IS, [["__scopeId", "data-v-a016178b"]]), BS = {
  key: 0,
  class: "inspector-links",
  "data-inspector-links": ""
}, RS = ["aria-expanded"], LS = {
  class: "links-count",
  "data-inspector-links-count": ""
}, NS = {
  key: 0,
  class: "links-fixed",
  "data-inspector-links-body": ""
}, qS = {
  key: 1,
  class: "links-failure",
  role: "alert",
  "data-inspector-links-failure": ""
}, DS = {
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
    return he(() => `${t.model}:${t.id}`, () => {
      n.value = t.open, a.value = 0, i();
    }, { immediate: !0 }), An(["link.*", "phase.*", "phase_task.*"], i), (u, c) => (r(), d(L, null, [
      a.value ? (r(), d("section", BS, [
        h("button", {
          type: "button",
          class: "links-head",
          "aria-expanded": n.value,
          "data-inspector-links-head": "",
          onClick: c[0] || (c[0] = (f) => n.value = !n.value)
        }, [
          c[2] || (c[2] = h("span", { class: "links-label" }, "Links", -1)),
          h("span", LS, g(a.value), 1),
          E(Zt, { open: n.value }, null, 8, ["open"])
        ], 8, RS),
        h("div", {
          class: Y(["links-body", { unfolded: n.value }])
        }, [
          n.value ? (r(), d("div", NS, [
            E(kd, {
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
      o.value ? (r(), d("p", qS, g(o.value), 1)) : k("", !0)
    ], 64));
  }
}, PS = /* @__PURE__ */ z(DS, [["__scopeId", "data-v-a4550728"]]), jS = ["placeholder"], FS = { class: "actions" }, WS = { class: "error" }, HS = {
  key: 1,
  class: "card closed"
}, zS = { class: "mark" }, US = { class: "prompt" }, VS = {
  key: 0,
  class: "draft"
}, GS = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ zt({
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
  emits: /* @__PURE__ */ zt(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = fn(e, "draft"), l = fn(e, "error"), i = _(!!l.value), u = _(!1), c = _(!1), f = _(null);
    async function m() {
      var b, x;
      i.value = !0, u.value = !1, await je(), (x = ((b = f.value) == null ? void 0 : b.querySelector("input")) || f.value) == null || x.focus();
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
        } catch (x) {
          o.value = b, l.value = x.message;
        } finally {
          c.value = !1;
        }
      }
    }
    return t({ expand: m }), (b, x) => (r(), d("div", {
      class: Y(["comment-bar", { open: i.value }])
    }, [
      i.value ? (r(), d("form", {
        key: 0,
        class: "card compose",
        onSubmit: ke(y, ["prevent"]),
        onKeydown: At(p, ["esc"])
      }, [
        ie(b.$slots, "who", {}, void 0, !0),
        Me(h("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": x[0] || (x[0] = (C) => o.value = C),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: x[1] || (x[1] = At((C) => B(nr)(C, y), ["enter"]))
        }, null, 40, jS), [
          [Ke, o.value]
        ]),
        h("div", FS, [
          h("span", WS, g(l.value), 1),
          E(ve, {
            small: "",
            onClick: p
          }, {
            default: P(() => [...x[3] || (x[3] = [
              U("Cancel", -1)
            ])]),
            _: 1
          }),
          E(ve, {
            variant: "primary",
            small: "",
            busy: c.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: y
          }, {
            default: P(() => [...x[4] || (x[4] = [
              U("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (r(), d("div", HS, [
        h("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: m
        }, [
          h("span", zS, [
            E(le, {
              name: u.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          h("span", US, g(u.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (r(), d("span", VS, "Draft kept")) : k("", !0)
        ]),
        e.count ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: x[2] || (x[2] = (C) => s("show"))
        }, [
          h("span", null, g(B($d)(e.count, "comment")), 1),
          E(le, {
            name: "down",
            size: 12
          })
        ])) : k("", !0)
      ]))
    ], 2));
  }
}, KS = /* @__PURE__ */ z(GS, [["__scopeId", "data-v-b68baddd"]]), YS = { wide: 1130 }, QS = /\{([A-Za-z_]\w*)\}/g;
function aa(e, t, n = {}) {
  return e.replace(QS, (a, s) => {
    const o = s in n ? n[s] : t == null ? void 0 : t[s];
    return o == null ? "" : String(o);
  });
}
const XS = (e, t, n, a) => aa(e.label, n, { row_id: a, id: a }) || q$(t, n, a), JS = { class: "comment-side-head" }, ZS = {
  key: 0,
  class: "comment-none"
}, e6 = { key: 0 }, t6 = {
  key: 1,
  class: "comment-none"
}, n6 = {
  class: "comment",
  "data-comment": ""
}, a6 = {
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
      h("header", JS, [
        n[2] || (n[2] = h("h3", null, "Comments", -1)),
        E(ba, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (r(), d("p", ZS, "No comments yet")) : k("", !0),
      (r(!0), d(L, null, te(e.comments, (a) => (r(), d("section", {
        key: a.id
      }, [
        a.quote ? (r(), d("blockquote", e6, g(a.quote), 1)) : k("", !0),
        a.revision ? (r(), d("span", t6, "Revision " + g(a.revision), 1)) : k("", !0),
        h("p", n6, g(e.words(a)), 1)
      ]))), 128)),
      E(Mn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, Wl = /* @__PURE__ */ z(a6, [["__scopeId", "data-v-276284a3"]]), s6 = { class: "resource-heading" }, o6 = {
  key: 0,
  class: "resource-title",
  "data-resource-title": ""
}, l6 = {
  key: 1,
  class: "resource-abstract"
}, i6 = {
  __name: "ResourceHeading",
  props: { title: String, abstract: String },
  setup(e) {
    return (t, n) => (r(), d("div", s6, [
      e.title ? (r(), d("h2", o6, g(e.title), 1)) : k("", !0),
      e.abstract ? (r(), d("p", l6, g(e.abstract), 1)) : k("", !0)
    ]));
  }
}, r6 = /* @__PURE__ */ z(i6, [["__scopeId", "data-v-d65ef53f"]]), u6 = {
  class: "inspector-head",
  "data-inspector-head": ""
}, c6 = { class: "inspector-icons" }, d6 = { class: "inspector-icons-start" }, f6 = {
  key: 0,
  class: "inspector-band-title",
  "data-resource-title": ""
}, m6 = {
  key: 1,
  class: "inspector-label",
  "data-resource-type": ""
}, h6 = { class: "inspector-icons-end" }, p6 = ["href"], v6 = {
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
    return (u, c) => (r(), d("header", u6, [
      h("div", c6, [
        h("span", d6, [
          e.backed ? (r(), j(ve, {
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
          e.stepped ? (r(), d(L, { key: 1 }, [
            E(ve, {
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
            E(ve, {
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
        l.value ? (r(), d("h2", f6, g(e.title), 1)) : (r(), d("p", m6, g(e.label), 1)),
        h("span", h6, [
          e.embedded ? (r(), j(ve, {
            key: 0,
            variant: "icon",
            title: "Open in the inspector",
            "aria-label": "Open in the inspector",
            "data-inspector-open": "",
            onClick: c[3] || (c[3] = (f) => B(We)(s.value))
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
            href: B(_m)(s.value)
          }, [
            E(le, {
              name: "share",
              size: 13
            })
          ], 8, p6)) : k("", !0),
          e.embedded ? k("", !0) : (r(), j(ve, {
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
      E(r6, {
        title: l.value ? "" : e.title,
        abstract: e.description
      }, null, 8, ["title", "abstract"])
    ]));
  }
}, g6 = /* @__PURE__ */ z(v6, [["__scopeId", "data-v-f7878e15"]]), y6 = {
  class: "section field-grid",
  "data-resource-fields": ""
}, b6 = { class: "field-name" }, k6 = {
  key: 1,
  class: "field-value"
}, w6 = ["onClick"], $6 = {
  key: 2,
  class: "field-value"
}, x6 = {
  __name: "ResourceFields",
  props: { fields: { type: Array, required: !0 } },
  emits: ["peek"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", y6, [
      (r(!0), d(L, null, te(e.fields, (o) => (r(), d(L, {
        key: o.name
      }, [
        h("p", b6, g(o.label), 1),
        o.isTime ? (r(), j(at, {
          key: 0,
          class: "field-value",
          at: o.value
        }, null, 8, ["at"])) : o.link ? (r(), d("p", k6, [
          h("button", {
            type: "button",
            class: "field-link",
            "data-resource-link": "",
            onClick: (l) => n("peek", o.link)
          }, g(o.value), 9, w6)
        ])) : (r(), d("p", $6, g(o.value), 1))
      ], 64))), 128))
    ]));
  }
}, S6 = /* @__PURE__ */ z(x6, [["__scopeId", "data-v-7e45afb5"]]);
async function M6(e, t) {
  const n = t.creator_id ? ["--creator", String(t.creator_id)] : [], a = t.agent_id ? ["--owner", String(t.agent_id)] : [];
  if (!n.length && !a.length) return { creator: "", owner: "" };
  const s = await e(["agent", "people", ...n, ...a]);
  return s.ok ? { creator: D$(s.value.actor, s.value.creator_agent), owner: a.length ? P$(t, s.value.owner) : "" } : { creator: "", owner: "" };
}
const _6 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, C6 = {
  key: 1,
  class: "inspector-wait"
}, E6 = { class: "inspector-main" }, A6 = { class: "inspector-column" }, O6 = {
  key: 0,
  class: "inspector-tabs",
  "data-inspector-tabs": ""
}, T6 = {
  class: "inspector-body",
  "data-inspector-body": ""
}, I6 = { class: "inspector-text" }, B6 = ["innerHTML"], R6 = {
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
    js(ui, S(() => {
      var F;
      return ((F = s.value) == null ? void 0 : F.$el) ?? null;
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
    }), i = _(null), u = _(""), c = _(""), f = _(""), m = _("details"), p = _(null), y = _(0);
    let b = 0;
    const x = S(() => ({ row_id: n.id, id: n.id })), C = S(() => i.value ? aa(l.value.title, i.value, x.value) || N$(n.term, i.value, n.id) : ""), M = S(() => i.value ? XS(l.value, n.term, i.value, n.id) : ""), T = S(() => M.value === C.value ? "" : M.value), H = S(() => i.value ? aa(l.value.description, i.value, x.value) : ""), W = S(() => {
      var F, V, J;
      return ((F = i.value) == null ? void 0 : F.body) || ((V = i.value) == null ? void 0 : V.brief) || (o.has(n.term) ? (J = i.value) == null ? void 0 : J.text : "") || "";
    }), I = S(() => W.value ? lo(W.value, { env: "", rowNames: !1 }) : ""), G = S(() => j$(i.value, W.value, u.value, c.value)), q = S(() => l.value.comments && y.value >= YS.wide), A = S(() => l.value.comments && !q.value), N = (F) => l.value.components.filter((V) => (V.tab || "") === F).map((V) => V.window), D = S(() => [...new Set(l.value.components.map((F) => F.tab).filter(Boolean))]), w = S(() => D.value.length || A.value ? [{ key: "details", label: "Details" }, ...D.value.map((F) => ({ key: F, label: F })), ...A.value ? [{ key: "comments", label: "Comments" }] : []] : []), v = S(() => {
      const F = l.value.links;
      return F ? { categories: F.categories, open: F.open, outsidePlan: F.excludes_plan, pageSize: F.page_size } : null;
    }), $ = rr(() => l.value.comments && i.value ? { term: n.term, id: n.id, title: i.value.title } : {}, (F) => n.read(F));
    async function O() {
      const F = ++b, V = await n.read(aa(l.value.reads, null, x.value).split(/\s+/).filter(Boolean));
      if (F !== b || (f.value = V.ok ? "" : V.error, !V.ok)) return;
      i.value = V.value;
      const J = await M6(n.read, i.value);
      F === b && (u.value = J.creator, c.value = J.owner);
    }
    he(() => `${n.term}:${n.id}`, () => {
      i.value = null, u.value = "", c.value = "", f.value = "", m.value = "details", O();
    }, { immediate: !0 }), An(l.value.events, O), he($.open, (F) => F && A.value && (m.value = "comments"));
    let R = null;
    return Ce(() => {
      var F;
      y.value = ((F = p.value) == null ? void 0 : F.clientWidth) ?? 0, !(typeof ResizeObserver > "u") && (R = new ResizeObserver(() => y.value = p.value.clientWidth), R.observe(p.value));
    }), Re(() => R == null ? void 0 : R.disconnect()), (F, V) => (r(), d("aside", {
      ref_key: "root",
      ref: p,
      class: "inspector",
      "data-inspector": ""
    }, [
      E(g6, {
        label: T.value,
        title: C.value,
        description: H.value,
        backed: e.backed,
        stepped: e.stepped,
        embedded: e.embedded,
        shareable: l.value.shareable,
        "read-only": e.readOnly,
        opened: { table: e.table || `${e.term}s`, id: e.id },
        onClose: V[0] || (V[0] = (J) => a("close")),
        onBack: V[1] || (V[1] = (J) => a("back")),
        onStep: V[2] || (V[2] = (J) => a("step", J))
      }, null, 8, ["label", "title", "description", "backed", "stepped", "embedded", "shareable", "read-only", "opened"]),
      f.value ? (r(), d("p", _6, g(f.value), 1)) : i.value ? (r(), d(L, { key: 2 }, [
        E(Es, {
          ref_key: "actionBar",
          ref: s
        }, {
          default: P(() => [
            E(ao, {
              name: `row.${e.term}`,
              row: { ...i.value, id: e.id, term: e.term },
              environment: e.environment,
              "read-only": e.readOnly,
              onDone: O
            }, null, 8, ["name", "row", "environment", "read-only"])
          ]),
          _: 1
        }, 512),
        h("div", E6, [
          h("div", A6, [
            w.value.length ? (r(), d("div", O6, [
              E(Ot, {
                options: w.value,
                value: m.value,
                onPick: V[3] || (V[3] = (J) => m.value = J)
              }, null, 8, ["options", "value"])
            ])) : k("", !0),
            h("div", T6, [
              E(Qt, { value: m.value }, {
                details: P(() => [
                  h("div", I6, [
                    I.value && !l.value.draws_text ? (r(), d("div", {
                      key: 0,
                      class: "md text",
                      "data-resource-text": "",
                      innerHTML: I.value
                    }, null, 8, B6)) : k("", !0),
                    l.value.lists_fields ? (r(), j(S6, {
                      key: 1,
                      fields: G.value,
                      onPeek: V[4] || (V[4] = (J) => a("open", J))
                    }, null, 8, ["fields"])) : k("", !0)
                  ]),
                  E(_s, {
                    "slot-name": `inspector.${e.term}`,
                    names: N(""),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["slot-name", "names", "row"])
                ]),
                comments: P(() => [
                  E(Wl, {
                    below: "",
                    comments: B($).comments.value,
                    words: B($).words,
                    more: !!B($).nextPage.value,
                    loading: B($).loading.value,
                    failure: B($).failure.value,
                    onMore: B($).loadMore,
                    onClose: V[5] || (V[5] = (J) => m.value = "details")
                  }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
                ]),
                default: P(() => [
                  E(_s, {
                    names: N(m.value),
                    row: { ...i.value, id: e.id, term: e.term }
                  }, null, 8, ["names", "row"])
                ]),
                _: 1
              }, 8, ["value"]),
              v.value ? (r(), j(PS, Pe({
                key: 0,
                model: e.term,
                id: e.id,
                read: e.read
              }, v.value, {
                onOpen: V[6] || (V[6] = (J) => a("open", J))
              }), null, 16, ["model", "id", "read"])) : k("", !0)
            ]),
            l.value.comments ? (r(), j(KS, {
              key: 1,
              send: B($).send,
              count: B($).total.value,
              onShow: V[7] || (V[7] = (J) => A.value && (m.value = "comments"))
            }, null, 8, ["send", "count"])) : k("", !0)
          ]),
          q.value ? (r(), j(Wl, {
            key: 0,
            comments: B($).comments.value,
            words: B($).words,
            more: !!B($).nextPage.value,
            loading: B($).loading.value,
            failure: B($).failure.value,
            onMore: B($).loadMore,
            onClose: () => {
            }
          }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])) : k("", !0)
        ])
      ], 64)) : (r(), d("div", C6, [
        E(Je)
      ]))
    ], 512));
  }
}, L6 = /* @__PURE__ */ z(R6, [["__scopeId", "data-v-60363e95"]]), FA = {
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
    const t = _e(Js);
    return (n, a) => (r(), j(L6, Pe(n.$props, {
      catalogue: B(t).catalogue,
      onStep: a[0] || (a[0] = (s) => n.$emit("step", s)),
      onOpen: a[1] || (a[1] = (s) => n.$emit("open", s)),
      onClose: a[2] || (a[2] = (s) => n.$emit("close")),
      onBack: a[3] || (a[3] = (s) => n.$emit("back"))
    }), null, 16, ["catalogue"]));
  }
}, N6 = { class: "facts" }, q6 = { class: "fact wide" }, D6 = ["title"], P6 = {
  key: 1,
  class: "fact-value"
}, j6 = {
  key: 0,
  class: "fact"
}, F6 = { class: "fact-value" }, W6 = { class: "fact" }, H6 = { class: "fact-label" }, z6 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, U6 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, V6 = {
  key: 2,
  class: "fact"
}, G6 = { class: "fact-value" }, K6 = { class: "fact wide" }, Y6 = { class: "fact-label" }, Q6 = { class: "fact wide" }, X6 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, J6 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority", "complexity"],
  setup(e, { emit: t }) {
    const n = ua.map(({ key: l, label: i }) => ({ key: String(l), label: i })), a = [1, 2, 3, 4, 5].map((l) => ({ key: String(l), label: String(l) })), s = t, o = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (l, i) => {
      var u, c;
      return r(), d("div", N6, [
        h("div", q6, [
          i[4] || (i[4] = h("span", { class: "fact-label" }, "Plan", -1)),
          (u = e.place) != null && u.plan_id ? (r(), d("button", {
            key: 0,
            type: "button",
            class: "fact-value agent-link",
            title: `Open plan ${e.place.plan_id}`,
            "data-task-plan-link": "",
            onClick: i[0] || (i[0] = (f) => B(We)(`plans:${e.place.plan_id}`))
          }, "Plan " + g(e.place.plan_id) + ": " + g(e.place.plan_title), 9, D6)) : (r(), d("span", P6, "Not in a plan"))
        ]),
        ((c = e.place) == null ? void 0 : c.phase_total) > 1 ? (r(), d("div", j6, [
          i[5] || (i[5] = h("span", { class: "fact-label" }, "Phase", -1)),
          h("span", F6, g(e.place.phase_number) + " of " + g(e.place.phase_total) + ": " + g(e.place.phase_title), 1)
        ])) : k("", !0),
        e.task.helper_id ? (r(), d(L, { key: 1 }, [
          h("div", W6, [
            h("span", H6, g(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            E(vn, {
              as: "button",
              "agent-id": e.task.helper_id,
              label: B(uo)(e.task.helper_name, e.task.helper_main),
              class: "fact-value agent-link",
              "data-task-agent": "",
              onClick: i[1] || (i[1] = (f) => B(We)(`agents:${e.task.helper_id}`))
            }, {
              default: P(() => [
                E(Wt, {
                  name: e.task.helper_name,
                  main: e.task.helper_main
                }, null, 8, ["name", "main"])
              ]),
              _: 1
            }, 8, ["agent-id", "label"])
          ]),
          B(o).has(e.task.state) && e.task.holder_id ? (r(), d("p", z6, [
            E(Wt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[6] || (i[6] = U(" holds it: merging its work finishes it, and releasing the worker opens it again.", -1))
          ])) : e.task.state === "open" ? (r(), d("p", U6, [
            E(Wt, {
              name: e.task.helper_name,
              main: e.task.helper_main
            }, null, 8, ["name", "main"]),
            i[7] || (i[7] = U(" takes it after the task it is on.", -1))
          ])) : k("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (r(), d("div", V6, [
          i[8] || (i[8] = h("span", { class: "fact-label" }, "Assigned to", -1)),
          h("span", G6, "Agent " + g(e.task.holder_id), 1)
        ])) : k("", !0),
        h("div", K6, [
          h("span", Y6, [
            i[9] || (i[9] = U(" Complexity ", -1)),
            E(ki, {
              lines: B(pr).map((f, m) => `${m + 1}: ${f}`),
              label: "What the scores mean"
            }, null, 8, ["lines"])
          ]),
          E(Ot, {
            options: B(a),
            value: e.task.complexity ? String(e.task.complexity) : "",
            "data-task-complexity": "",
            onPick: i[2] || (i[2] = (f) => s("complexity", f))
          }, null, 8, ["options", "value"])
        ]),
        h("div", Q6, [
          i[10] || (i[10] = h("span", { class: "fact-label" }, "Priority", -1)),
          E(Ot, {
            options: B(n),
            value: String(B(hr)(e.task.priority)),
            "data-task-priority": "",
            onPick: i[3] || (i[3] = (f) => s("priority", f))
          }, null, 8, ["options", "value"]),
          e.refusal ? (r(), d("p", X6, g(e.refusal), 1)) : k("", !0)
        ])
      ]);
    };
  }
}, Z6 = /* @__PURE__ */ z(J6, [["__scopeId", "data-v-4bf27961"]]);
function eM(e, t) {
  const n = new Map(t.tasks.map((u) => [u.id, u])), a = (u) => t.edges.filter(([, c]) => c === u).map(([c]) => c), s = /* @__PURE__ */ new Set([e]), o = [];
  for (let u = a(e); u.length; u = [...new Set(u.flatMap(a))].filter((c) => !s.has(c)))
    u.forEach((c) => s.add(c)), o.push(u.map((c) => n.get(c)));
  const l = [], i = /* @__PURE__ */ new Set([e]);
  for (let u = t.edges.find(([c]) => c === e); u && !i.has(u[1]); u = t.edges.find(([c]) => c === u[1]))
    i.add(u[1]), l.push(n.get(u[1]));
  return { above: o.reverse(), below: l };
}
const tM = { class: "number" }, nM = { class: "title" }, aM = { class: "word" }, sM = {
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
    return (a, s) => (r(), j(Qe(e.current ? "div" : "button"), {
      type: e.current ? void 0 : "button",
      class: Y(["task-chain-link", { current: e.current }]),
      onClick: s[0] || (s[0] = (o) => n("select", e.number))
    }, {
      default: P(() => [
        E($a, { status: e.status }, null, 8, ["status"]),
        h("span", tM, g(e.number), 1),
        h("span", nM, g(e.title), 1),
        h("span", aM, g(e.word), 1)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, cs = /* @__PURE__ */ z(sM, [["__scopeId", "data-v-f6417ae8"]]), oM = {
  key: 0,
  class: "task-chain",
  "data-task-chain": ""
}, lM = { class: "level" }, iM = {
  __name: "TaskChain",
  props: { task: { type: Object, required: !0 }, graph: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = _(!1);
    he(() => n.task.id, () => s.value = !1);
    const o = S(() => eM(n.task.id, n.graph)), l = S(() => s.value ? o.value.above : o.value.above.slice(-1)), i = S(() => s.value ? o.value.below : o.value.below.slice(0, 1)), u = S(() => o.value.above.slice(0, -1).flat().length + o.value.below.slice(1).length), c = (m) => m.slice(0, 1).toUpperCase() + m.slice(1), f = (m, p = !1) => ({ status: gn(m.state), number: m.id, title: m.title, word: p ? "This task" : c(m.state), current: p });
    return (m, p) => o.value.above.length || o.value.below.length ? (r(), d("section", oM, [
      p[5] || (p[5] = h("h4", null, "What waits on what", -1)),
      (r(!0), d(L, null, te(l.value, (y) => (r(), d(L, {
        key: y.map((b) => b.id).join()
      }, [
        h("div", lM, [
          (r(!0), d(L, null, te(y, (b) => (r(), j(cs, Pe({
            key: b.id,
            ref_for: !0
          }, f(b), {
            onSelect: p[0] || (p[0] = (x) => a("select", x))
          }), null, 16))), 128))
        ]),
        p[3] || (p[3] = h("div", { class: "waits" }, "↓ waits on", -1))
      ], 64))), 128)),
      E(cs, fs(Yl(f(e.task, !0))), null, 16),
      (r(!0), d(L, null, te(i.value, (y) => (r(), d(L, {
        key: y.id
      }, [
        p[4] || (p[4] = h("div", { class: "waits" }, "↓ waits on", -1)),
        E(cs, Pe({ ref_for: !0 }, f(y), {
          onSelect: p[1] || (p[1] = (b) => a("select", b))
        }), null, 16)
      ], 64))), 128)),
      u.value ? (r(), d("button", {
        key: 0,
        type: "button",
        class: "more",
        "data-task-chain-more": "",
        onClick: p[2] || (p[2] = (y) => s.value = !s.value)
      }, g(s.value ? "Show less" : `Show the whole chain (${u.value} more)`), 1)) : k("", !0)
    ])) : k("", !0);
  }
}, rM = /* @__PURE__ */ z(iM, [["__scopeId", "data-v-79c52417"]]), uM = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, cM = ["datetime"], dM = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (r(), d("section", uM, [
      n[0] || (n[0] = h("h3", null, "Block history", -1)),
      (r(!0), d(L, null, te(e.renewals, (a) => (r(), d("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        h("time", {
          datetime: a.created_at
        }, g(new Date(a.created_at).toLocaleString()), 9, cM),
        h("p", null, g(a.reason), 1)
      ]))), 128))
    ])) : k("", !0);
  }
}, fM = /* @__PURE__ */ z(dM, [["__scopeId", "data-v-b41f213b"]]), mM = {
  class: "part",
  "data-resource-waits": ""
}, hM = ["onClick"], pM = { class: "wait-id" }, vM = { class: "wait-title" }, gM = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (r(), d("section", mM, [
      h("h4", null, g(e.title), 1),
      (r(!0), d(L, null, te(e.waits, (o) => (r(), d("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        E($a, {
          status: B(gn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        h("span", pM, g(o.id), 1),
        h("span", vM, g(o.title), 1)
      ], 8, hM))), 128))
    ]));
  }
}, Hl = /* @__PURE__ */ z(gM, [["__scopeId", "data-v-8fb2e251"]]), yM = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, bM = { class: "text" }, kM = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, wM = 180, $M = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = _(!1), l = S(() => a.task.waits.filter((u) => !n.has(u.state))), i = S(() => a.task.waits.filter((u) => n.has(u.state)));
    return (u, c) => (r(), d(L, null, [
      l.value.length ? (r(), j(Hl, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: c[0] || (c[0] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0),
      e.task.state === "completed" && e.task.outcome ? (r(), d("section", yM, [
        c[3] || (c[3] = h("h4", null, "How it was done", -1)),
        h("p", bM, g(e.task.outcome), 1)
      ])) : k("", !0),
      e.task.brief ? (r(), d("section", kM, [
        c[4] || (c[4] = h("h4", null, "The brief", -1)),
        h("p", {
          class: Y(["text", { clamped: !o.value }])
        }, g(e.task.brief), 3),
        e.task.brief.length > wM && !o.value ? (r(), d("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: c[1] || (c[1] = (f) => o.value = !0)
        }, "Show the whole brief")) : k("", !0)
      ])) : k("", !0),
      i.value.length ? (r(), j(Hl, {
        key: 3,
        title: "Waited on",
        waits: i.value,
        onSelect: c[2] || (c[2] = (f) => s("select", f))
      }, null, 8, ["waits"])) : k("", !0)
    ], 64));
  }
}, xM = /* @__PURE__ */ z($M, [["__scopeId", "data-v-4a3f1e79"]]), SM = {
  class: "task-details",
  "data-task-details": ""
}, MM = { class: "since" }, _M = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, CM = { class: "text" }, EM = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, AM = {
  key: 1,
  class: "note"
}, OM = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, TM = { class: "text" }, IM = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, graph: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "complexity", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return r(), d("div", SM, [
        h("div", {
          class: Y(["state-line", B(gn)(e.task.state)])
        }, [
          h("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            E($a, {
              status: B(gn)(e.task.state)
            }, null, 8, ["status"]),
            U(" " + g(a(e.task.state)), 1)
          ]),
          h("span", MM, [
            o[5] || (o[5] = U(" since ", -1)),
            E(at, {
              at: B(ah)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (r(), d("section", _M, [
          o[6] || (o[6] = h("span", { class: "label" }, "Blocked, waiting on", -1)),
          h("p", CM, g(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (r(), d("p", EM, "Opens by itself when " + g(e.task.openers.join(" or ")) + ".", 1)) : (r(), d("p", AM, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (r(), d("section", OM, [
          o[7] || (o[7] = h("span", { class: "label" }, "Why it was cancelled", -1)),
          h("p", TM, g(e.task.reason), 1)
        ])) : k("", !0),
        e.graph ? (r(), j(rM, {
          key: 2,
          task: e.task,
          graph: e.graph,
          onSelect: o[1] || (o[1] = (i) => n("select", i))
        }, null, 8, ["task", "graph"])) : k("", !0),
        E(Z6, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[2] || (o[2] = (i) => n("priority", i)),
          onComplexity: o[3] || (o[3] = (i) => n("complexity", i))
        }, null, 8, ["task", "place", "refusal"]),
        E(xM, {
          task: e.task,
          onSelect: o[4] || (o[4] = (i) => n("select", i))
        }, null, 8, ["task"]),
        E(fM, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, WA = /* @__PURE__ */ z(IM, [["__scopeId", "data-v-7e73fa21"]]), BM = 50, RM = { messages: 25 }, LM = (e) => RM[e] || BM, NM = {
  class: "task-log",
  "aria-label": "Task log"
}, qM = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, DM = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, PM = { class: "entries" }, jM = ["data-task-log-important"], FM = ["datetime"], WM = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, HM = {
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
        String(LM("task_logs")),
        "--page",
        String(c)
      ]);
      f === i && (o.value = !1, l.value = m.ok ? "" : m.error, m.ok && (n.value = m.value.rows, s.value = m.value.is_last_page));
    }
    return he(
      () => [t.id, t.changes],
      () => {
        n.value = [], u();
      },
      { immediate: !0 }
    ), st(() => {
      i += 1;
    }), (c, f) => (r(), d("section", NM, [
      o.value ? (r(), j(Je, { key: 0 })) : l.value ? (r(), d(L, { key: 1 }, [
        h("p", qM, g(l.value), 1),
        E(ve, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: f[0] || (f[0] = (m) => u(a.value))
        }, {
          default: P(() => [...f[3] || (f[3] = [
            U("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (r(), d(L, { key: 2 }, [
        n.value.length ? k("", !0) : (r(), d("p", DM, "No log entries yet.")),
        h("ol", PM, [
          (r(!0), d(L, null, te(n.value, (m) => (r(), d("li", {
            key: m.id,
            class: Y(["entry", { important: m.important }]),
            "data-task-log": "",
            "data-task-log-important": m.important ? "" : null
          }, [
            h("time", {
              datetime: m.created_at
            }, g(new Date(m.created_at).toLocaleString()), 9, FM),
            h("p", null, g(m.line), 1)
          ], 10, jM))), 128))
        ]),
        a.value > 1 || !s.value ? (r(), d("nav", WM, [
          E(ve, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: f[1] || (f[1] = (m) => u(a.value - 1))
          }, {
            default: P(() => [...f[4] || (f[4] = [
              U("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          h("span", null, "Page " + g(a.value), 1),
          E(ve, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: f[2] || (f[2] = (m) => u(a.value + 1))
          }, {
            default: P(() => [...f[5] || (f[5] = [
              U("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : k("", !0)
      ], 64))
    ]));
  }
}, HA = /* @__PURE__ */ z(HM, [["__scopeId", "data-v-cfa43bf1"]]);
function zM(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ds = { exports: {} }, zl;
function UM() {
  return zl || (zl = 1, (function(e, t) {
    var n = (function() {
      var a = function(I, G) {
        var q = 236, A = 17, N = I, D = o[G], w = null, v = 0, $ = null, O = [], R = {}, F = function(X, Z) {
          v = N * 4 + 17, w = (function(K) {
            for (var ee = new Array(K), ne = 0; ne < K; ne += 1) {
              ee[ne] = new Array(K);
              for (var ae = 0; ae < K; ae += 1)
                ee[ne][ae] = null;
            }
            return ee;
          })(v), V(0, 0), V(v - 7, 0), V(0, v - 7), ue(), oe(), Oe(X, Z), N >= 7 && we(X), $ == null && ($ = Q(N, D, O)), be($, Z);
        }, V = function(X, Z) {
          for (var K = -1; K <= 7; K += 1)
            if (!(X + K <= -1 || v <= X + K))
              for (var ee = -1; ee <= 7; ee += 1)
                Z + ee <= -1 || v <= Z + ee || (0 <= K && K <= 6 && (ee == 0 || ee == 6) || 0 <= ee && ee <= 6 && (K == 0 || K == 6) || 2 <= K && K <= 4 && 2 <= ee && ee <= 4 ? w[X + K][Z + ee] = !0 : w[X + K][Z + ee] = !1);
        }, J = function() {
          for (var X = 0, Z = 0, K = 0; K < 8; K += 1) {
            F(!0, K);
            var ee = i.getLostPoint(R);
            (K == 0 || X > ee) && (X = ee, Z = K);
          }
          return Z;
        }, oe = function() {
          for (var X = 8; X < v - 8; X += 1)
            w[X][6] == null && (w[X][6] = X % 2 == 0);
          for (var Z = 8; Z < v - 8; Z += 1)
            w[6][Z] == null && (w[6][Z] = Z % 2 == 0);
        }, ue = function() {
          for (var X = i.getPatternPosition(N), Z = 0; Z < X.length; Z += 1)
            for (var K = 0; K < X.length; K += 1) {
              var ee = X[Z], ne = X[K];
              if (w[ee][ne] == null)
                for (var ae = -2; ae <= 2; ae += 1)
                  for (var de = -2; de <= 2; de += 1)
                    ae == -2 || ae == 2 || de == -2 || de == 2 || ae == 0 && de == 0 ? w[ee + ae][ne + de] = !0 : w[ee + ae][ne + de] = !1;
            }
        }, we = function(X) {
          for (var Z = i.getBCHTypeNumber(N), K = 0; K < 18; K += 1) {
            var ee = !X && (Z >> K & 1) == 1;
            w[Math.floor(K / 3)][K % 3 + v - 8 - 3] = ee;
          }
          for (var K = 0; K < 18; K += 1) {
            var ee = !X && (Z >> K & 1) == 1;
            w[K % 3 + v - 8 - 3][Math.floor(K / 3)] = ee;
          }
        }, Oe = function(X, Z) {
          for (var K = D << 3 | Z, ee = i.getBCHTypeInfo(K), ne = 0; ne < 15; ne += 1) {
            var ae = !X && (ee >> ne & 1) == 1;
            ne < 6 ? w[ne][8] = ae : ne < 8 ? w[ne + 1][8] = ae : w[v - 15 + ne][8] = ae;
          }
          for (var ne = 0; ne < 15; ne += 1) {
            var ae = !X && (ee >> ne & 1) == 1;
            ne < 8 ? w[8][v - ne - 1] = ae : ne < 9 ? w[8][15 - ne - 1 + 1] = ae : w[8][15 - ne - 1] = ae;
          }
          w[v - 8][8] = !X;
        }, be = function(X, Z) {
          for (var K = -1, ee = v - 1, ne = 7, ae = 0, de = i.getMaskFunction(Z), ce = v - 1; ce > 0; ce -= 2)
            for (ce == 6 && (ce -= 1); ; ) {
              for (var Se = 0; Se < 2; Se += 1)
                if (w[ee][ce - Se] == null) {
                  var Te = !1;
                  ae < X.length && (Te = (X[ae] >>> ne & 1) == 1);
                  var me = de(ee, ce - Se);
                  me && (Te = !Te), w[ee][ce - Se] = Te, ne -= 1, ne == -1 && (ae += 1, ne = 7);
                }
              if (ee += K, ee < 0 || v <= ee) {
                ee -= K, K = -K;
                break;
              }
            }
        }, se = function(X, Z) {
          for (var K = 0, ee = 0, ne = 0, ae = new Array(Z.length), de = new Array(Z.length), ce = 0; ce < Z.length; ce += 1) {
            var Se = Z[ce].dataCount, Te = Z[ce].totalCount - Se;
            ee = Math.max(ee, Se), ne = Math.max(ne, Te), ae[ce] = new Array(Se);
            for (var me = 0; me < ae[ce].length; me += 1)
              ae[ce][me] = 255 & X.getBuffer()[me + K];
            K += Se;
            var ze = i.getErrorCorrectPolynomial(Te), Ue = c(ae[ce], ze.getLength() - 1), Eo = Ue.mod(ze);
            de[ce] = new Array(ze.getLength() - 1);
            for (var me = 0; me < de[ce].length; me += 1) {
              var Ao = me + Eo.getLength() - de[ce].length;
              de[ce][me] = Ao >= 0 ? Eo.getAt(Ao) : 0;
            }
          }
          for (var Oo = 0, me = 0; me < Z.length; me += 1)
            Oo += Z[me].totalCount;
          for (var Ea = new Array(Oo), Ln = 0, me = 0; me < ee; me += 1)
            for (var ce = 0; ce < Z.length; ce += 1)
              me < ae[ce].length && (Ea[Ln] = ae[ce][me], Ln += 1);
          for (var me = 0; me < ne; me += 1)
            for (var ce = 0; ce < Z.length; ce += 1)
              me < de[ce].length && (Ea[Ln] = de[ce][me], Ln += 1);
          return Ea;
        }, Q = function(X, Z, K) {
          for (var ee = f.getRSBlocks(X, Z), ne = m(), ae = 0; ae < K.length; ae += 1) {
            var de = K[ae];
            ne.put(de.getMode(), 4), ne.put(de.getLength(), i.getLengthInBits(de.getMode(), X)), de.write(ne);
          }
          for (var ce = 0, ae = 0; ae < ee.length; ae += 1)
            ce += ee[ae].dataCount;
          if (ne.getLengthInBits() > ce * 8)
            throw "code length overflow. (" + ne.getLengthInBits() + ">" + ce * 8 + ")";
          for (ne.getLengthInBits() + 4 <= ce * 8 && ne.put(0, 4); ne.getLengthInBits() % 8 != 0; )
            ne.putBit(!1);
          for (; !(ne.getLengthInBits() >= ce * 8 || (ne.put(q, 8), ne.getLengthInBits() >= ce * 8)); )
            ne.put(A, 8);
          return se(ne, ee);
        };
        R.addData = function(X, Z) {
          Z = Z || "Byte";
          var K = null;
          switch (Z) {
            case "Numeric":
              K = p(X);
              break;
            case "Alphanumeric":
              K = y(X);
              break;
            case "Byte":
              K = b(X);
              break;
            case "Kanji":
              K = x(X);
              break;
            default:
              throw "mode:" + Z;
          }
          O.push(K), $ = null;
        }, R.isDark = function(X, Z) {
          if (X < 0 || v <= X || Z < 0 || v <= Z)
            throw X + "," + Z;
          return w[X][Z];
        }, R.getModuleCount = function() {
          return v;
        }, R.make = function() {
          if (N < 1) {
            for (var X = 1; X < 40; X++) {
              for (var Z = f.getRSBlocks(X, D), K = m(), ee = 0; ee < O.length; ee++) {
                var ne = O[ee];
                K.put(ne.getMode(), 4), K.put(ne.getLength(), i.getLengthInBits(ne.getMode(), X)), ne.write(K);
              }
              for (var ae = 0, ee = 0; ee < Z.length; ee++)
                ae += Z[ee].dataCount;
              if (K.getLengthInBits() <= ae * 8)
                break;
            }
            N = X;
          }
          F(!1, J());
        }, R.createTableTag = function(X, Z) {
          X = X || 2, Z = typeof Z > "u" ? X * 4 : Z;
          var K = "";
          K += '<table style="', K += " border-width: 0px; border-style: none;", K += " border-collapse: collapse;", K += " padding: 0px; margin: " + Z + "px;", K += '">', K += "<tbody>";
          for (var ee = 0; ee < R.getModuleCount(); ee += 1) {
            K += "<tr>";
            for (var ne = 0; ne < R.getModuleCount(); ne += 1)
              K += '<td style="', K += " border-width: 0px; border-style: none;", K += " border-collapse: collapse;", K += " padding: 0px; margin: 0px;", K += " width: " + X + "px;", K += " height: " + X + "px;", K += " background-color: ", K += R.isDark(ee, ne) ? "#000000" : "#ffffff", K += ";", K += '"/>';
            K += "</tr>";
          }
          return K += "</tbody>", K += "</table>", K;
        }, R.createSvgTag = function(X, Z, K, ee) {
          var ne = {};
          typeof arguments[0] == "object" && (ne = arguments[0], X = ne.cellSize, Z = ne.margin, K = ne.alt, ee = ne.title), X = X || 2, Z = typeof Z > "u" ? X * 4 : Z, K = typeof K == "string" ? { text: K } : K || {}, K.text = K.text || null, K.id = K.text ? K.id || "qrcode-description" : null, ee = typeof ee == "string" ? { text: ee } : ee || {}, ee.text = ee.text || null, ee.id = ee.text ? ee.id || "qrcode-title" : null;
          var ae = R.getModuleCount() * X + Z * 2, de, ce, Se, Te, me = "", ze;
          for (ze = "l" + X + ",0 0," + X + " -" + X + ",0 0,-" + X + "z ", me += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', me += ne.scalable ? "" : ' width="' + ae + 'px" height="' + ae + 'px"', me += ' viewBox="0 0 ' + ae + " " + ae + '" ', me += ' preserveAspectRatio="xMinYMin meet"', me += ee.text || K.text ? ' role="img" aria-labelledby="' + pe([ee.id, K.id].join(" ").trim()) + '"' : "", me += ">", me += ee.text ? '<title id="' + pe(ee.id) + '">' + pe(ee.text) + "</title>" : "", me += K.text ? '<description id="' + pe(K.id) + '">' + pe(K.text) + "</description>" : "", me += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', me += '<path d="', Se = 0; Se < R.getModuleCount(); Se += 1)
            for (Te = Se * X + Z, de = 0; de < R.getModuleCount(); de += 1)
              R.isDark(Se, de) && (ce = de * X + Z, me += "M" + ce + "," + Te + ze);
          return me += '" stroke="transparent" fill="black"/>', me += "</svg>", me;
        }, R.createDataURL = function(X, Z) {
          X = X || 2, Z = typeof Z > "u" ? X * 4 : Z;
          var K = R.getModuleCount() * X + Z * 2, ee = Z, ne = K - Z;
          return W(K, K, function(ae, de) {
            if (ee <= ae && ae < ne && ee <= de && de < ne) {
              var ce = Math.floor((ae - ee) / X), Se = Math.floor((de - ee) / X);
              return R.isDark(Se, ce) ? 0 : 1;
            } else
              return 1;
          });
        }, R.createImgTag = function(X, Z, K) {
          X = X || 2, Z = typeof Z > "u" ? X * 4 : Z;
          var ee = R.getModuleCount() * X + Z * 2, ne = "";
          return ne += "<img", ne += ' src="', ne += R.createDataURL(X, Z), ne += '"', ne += ' width="', ne += ee, ne += '"', ne += ' height="', ne += ee, ne += '"', K && (ne += ' alt="', ne += pe(K), ne += '"'), ne += "/>", ne;
        };
        var pe = function(X) {
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
        }, Ze = function(X) {
          var Z = 1;
          X = typeof X > "u" ? Z * 2 : X;
          var K = R.getModuleCount() * Z + X * 2, ee = X, ne = K - X, ae, de, ce, Se, Te, me = {
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
          for (ae = 0; ae < K; ae += 2) {
            for (ce = Math.floor((ae - ee) / Z), Se = Math.floor((ae + 1 - ee) / Z), de = 0; de < K; de += 1)
              Te = "█", ee <= de && de < ne && ee <= ae && ae < ne && R.isDark(ce, Math.floor((de - ee) / Z)) && (Te = " "), ee <= de && de < ne && ee <= ae + 1 && ae + 1 < ne && R.isDark(Se, Math.floor((de - ee) / Z)) ? Te += " " : Te += "█", Ue += X < 1 && ae + 1 >= ne ? ze[Te] : me[Te];
            Ue += `
`;
          }
          return K % 2 && X > 0 ? Ue.substring(0, Ue.length - K - 1) + Array(K + 1).join("▀") : Ue.substring(0, Ue.length - 1);
        };
        return R.createASCII = function(X, Z) {
          if (X = X || 1, X < 2)
            return Ze(Z);
          X -= 1, Z = typeof Z > "u" ? X * 2 : Z;
          var K = R.getModuleCount() * X + Z * 2, ee = Z, ne = K - Z, ae, de, ce, Se, Te = Array(X + 1).join("██"), me = Array(X + 1).join("  "), ze = "", Ue = "";
          for (ae = 0; ae < K; ae += 1) {
            for (ce = Math.floor((ae - ee) / X), Ue = "", de = 0; de < K; de += 1)
              Se = 1, ee <= de && de < ne && ee <= ae && ae < ne && R.isDark(ce, Math.floor((de - ee) / X)) && (Se = 0), Ue += Se ? Te : me;
            for (ce = 0; ce < X; ce += 1)
              ze += Ue + `
`;
          }
          return ze.substring(0, ze.length - 1);
        }, R.renderTo2dContext = function(X, Z) {
          Z = Z || 2;
          for (var K = R.getModuleCount(), ee = 0; ee < K; ee++)
            for (var ne = 0; ne < K; ne++)
              X.fillStyle = R.isDark(ee, ne) ? "black" : "white", X.fillRect(ee * Z, ne * Z, Z, Z);
        }, R;
      };
      a.stringToBytesFuncs = {
        default: function(I) {
          for (var G = [], q = 0; q < I.length; q += 1) {
            var A = I.charCodeAt(q);
            G.push(A & 255);
          }
          return G;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(I, G) {
        var q = (function() {
          for (var N = T(I), D = function() {
            var oe = N.read();
            if (oe == -1) throw "eof";
            return oe;
          }, w = 0, v = {}; ; ) {
            var $ = N.read();
            if ($ == -1) break;
            var O = D(), R = D(), F = D(), V = String.fromCharCode($ << 8 | O), J = R << 8 | F;
            v[V] = J, w += 1;
          }
          if (w != G)
            throw w + " != " + G;
          return v;
        })(), A = 63;
        return function(N) {
          for (var D = [], w = 0; w < N.length; w += 1) {
            var v = N.charCodeAt(w);
            if (v < 128)
              D.push(v);
            else {
              var $ = q[N.charAt(w)];
              typeof $ == "number" ? ($ & 255) == $ ? D.push($) : (D.push($ >>> 8), D.push($ & 255)) : D.push(A);
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
        ], G = 1335, q = 7973, A = 21522, N = {}, D = function(w) {
          for (var v = 0; w != 0; )
            v += 1, w >>>= 1;
          return v;
        };
        return N.getBCHTypeInfo = function(w) {
          for (var v = w << 10; D(v) - D(G) >= 0; )
            v ^= G << D(v) - D(G);
          return (w << 10 | v) ^ A;
        }, N.getBCHTypeNumber = function(w) {
          for (var v = w << 12; D(v) - D(q) >= 0; )
            v ^= q << D(v) - D(q);
          return w << 12 | v;
        }, N.getPatternPosition = function(w) {
          return I[w - 1];
        }, N.getMaskFunction = function(w) {
          switch (w) {
            case l.PATTERN000:
              return function(v, $) {
                return (v + $) % 2 == 0;
              };
            case l.PATTERN001:
              return function(v, $) {
                return v % 2 == 0;
              };
            case l.PATTERN010:
              return function(v, $) {
                return $ % 3 == 0;
              };
            case l.PATTERN011:
              return function(v, $) {
                return (v + $) % 3 == 0;
              };
            case l.PATTERN100:
              return function(v, $) {
                return (Math.floor(v / 2) + Math.floor($ / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(v, $) {
                return v * $ % 2 + v * $ % 3 == 0;
              };
            case l.PATTERN110:
              return function(v, $) {
                return (v * $ % 2 + v * $ % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(v, $) {
                return (v * $ % 3 + (v + $) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + w;
          }
        }, N.getErrorCorrectPolynomial = function(w) {
          for (var v = c([1], 0), $ = 0; $ < w; $ += 1)
            v = v.multiply(c([1, u.gexp($)], 0));
          return v;
        }, N.getLengthInBits = function(w, v) {
          if (1 <= v && v < 10)
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
          else if (v < 27)
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
          else if (v < 41)
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
            throw "type:" + v;
        }, N.getLostPoint = function(w) {
          for (var v = w.getModuleCount(), $ = 0, O = 0; O < v; O += 1)
            for (var R = 0; R < v; R += 1) {
              for (var F = 0, V = w.isDark(O, R), J = -1; J <= 1; J += 1)
                if (!(O + J < 0 || v <= O + J))
                  for (var oe = -1; oe <= 1; oe += 1)
                    R + oe < 0 || v <= R + oe || J == 0 && oe == 0 || V == w.isDark(O + J, R + oe) && (F += 1);
              F > 5 && ($ += 3 + F - 5);
            }
          for (var O = 0; O < v - 1; O += 1)
            for (var R = 0; R < v - 1; R += 1) {
              var ue = 0;
              w.isDark(O, R) && (ue += 1), w.isDark(O + 1, R) && (ue += 1), w.isDark(O, R + 1) && (ue += 1), w.isDark(O + 1, R + 1) && (ue += 1), (ue == 0 || ue == 4) && ($ += 3);
            }
          for (var O = 0; O < v; O += 1)
            for (var R = 0; R < v - 6; R += 1)
              w.isDark(O, R) && !w.isDark(O, R + 1) && w.isDark(O, R + 2) && w.isDark(O, R + 3) && w.isDark(O, R + 4) && !w.isDark(O, R + 5) && w.isDark(O, R + 6) && ($ += 40);
          for (var R = 0; R < v; R += 1)
            for (var O = 0; O < v - 6; O += 1)
              w.isDark(O, R) && !w.isDark(O + 1, R) && w.isDark(O + 2, R) && w.isDark(O + 3, R) && w.isDark(O + 4, R) && !w.isDark(O + 5, R) && w.isDark(O + 6, R) && ($ += 40);
          for (var we = 0, R = 0; R < v; R += 1)
            for (var O = 0; O < v; O += 1)
              w.isDark(O, R) && (we += 1);
          var Oe = Math.abs(100 * we / v / v - 50) / 5;
          return $ += Oe * 10, $;
        }, N;
      })(), u = (function() {
        for (var I = new Array(256), G = new Array(256), q = 0; q < 8; q += 1)
          I[q] = 1 << q;
        for (var q = 8; q < 256; q += 1)
          I[q] = I[q - 4] ^ I[q - 5] ^ I[q - 6] ^ I[q - 8];
        for (var q = 0; q < 255; q += 1)
          G[I[q]] = q;
        var A = {};
        return A.glog = function(N) {
          if (N < 1)
            throw "glog(" + N + ")";
          return G[N];
        }, A.gexp = function(N) {
          for (; N < 0; )
            N += 255;
          for (; N >= 256; )
            N -= 255;
          return I[N];
        }, A;
      })();
      function c(I, G) {
        if (typeof I.length > "u")
          throw I.length + "/" + G;
        var q = (function() {
          for (var N = 0; N < I.length && I[N] == 0; )
            N += 1;
          for (var D = new Array(I.length - N + G), w = 0; w < I.length - N; w += 1)
            D[w] = I[w + N];
          return D;
        })(), A = {};
        return A.getAt = function(N) {
          return q[N];
        }, A.getLength = function() {
          return q.length;
        }, A.multiply = function(N) {
          for (var D = new Array(A.getLength() + N.getLength() - 1), w = 0; w < A.getLength(); w += 1)
            for (var v = 0; v < N.getLength(); v += 1)
              D[w + v] ^= u.gexp(u.glog(A.getAt(w)) + u.glog(N.getAt(v)));
          return c(D, 0);
        }, A.mod = function(N) {
          if (A.getLength() - N.getLength() < 0)
            return A;
          for (var D = u.glog(A.getAt(0)) - u.glog(N.getAt(0)), w = new Array(A.getLength()), v = 0; v < A.getLength(); v += 1)
            w[v] = A.getAt(v);
          for (var v = 0; v < N.getLength(); v += 1)
            w[v] ^= u.gexp(u.glog(N.getAt(v)) + D);
          return c(w, 0).mod(N);
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
        ], G = function(N, D) {
          var w = {};
          return w.totalCount = N, w.dataCount = D, w;
        }, q = {}, A = function(N, D) {
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
        return q.getRSBlocks = function(N, D) {
          var w = A(N, D);
          if (typeof w > "u")
            throw "bad rs block @ typeNumber:" + N + "/errorCorrectionLevel:" + D;
          for (var v = w.length / 3, $ = [], O = 0; O < v; O += 1)
            for (var R = w[O * 3 + 0], F = w[O * 3 + 1], V = w[O * 3 + 2], J = 0; J < R; J += 1)
              $.push(G(F, V));
          return $;
        }, q;
      })(), m = function() {
        var I = [], G = 0, q = {};
        return q.getBuffer = function() {
          return I;
        }, q.getAt = function(A) {
          var N = Math.floor(A / 8);
          return (I[N] >>> 7 - A % 8 & 1) == 1;
        }, q.put = function(A, N) {
          for (var D = 0; D < N; D += 1)
            q.putBit((A >>> N - D - 1 & 1) == 1);
        }, q.getLengthInBits = function() {
          return G;
        }, q.putBit = function(A) {
          var N = Math.floor(G / 8);
          I.length <= N && I.push(0), A && (I[N] |= 128 >>> G % 8), G += 1;
        }, q;
      }, p = function(I) {
        var G = s.MODE_NUMBER, q = I, A = {};
        A.getMode = function() {
          return G;
        }, A.getLength = function(w) {
          return q.length;
        }, A.write = function(w) {
          for (var v = q, $ = 0; $ + 2 < v.length; )
            w.put(N(v.substring($, $ + 3)), 10), $ += 3;
          $ < v.length && (v.length - $ == 1 ? w.put(N(v.substring($, $ + 1)), 4) : v.length - $ == 2 && w.put(N(v.substring($, $ + 2)), 7));
        };
        var N = function(w) {
          for (var v = 0, $ = 0; $ < w.length; $ += 1)
            v = v * 10 + D(w.charAt($));
          return v;
        }, D = function(w) {
          if ("0" <= w && w <= "9")
            return w.charCodeAt(0) - 48;
          throw "illegal char :" + w;
        };
        return A;
      }, y = function(I) {
        var G = s.MODE_ALPHA_NUM, q = I, A = {};
        A.getMode = function() {
          return G;
        }, A.getLength = function(D) {
          return q.length;
        }, A.write = function(D) {
          for (var w = q, v = 0; v + 1 < w.length; )
            D.put(
              N(w.charAt(v)) * 45 + N(w.charAt(v + 1)),
              11
            ), v += 2;
          v < w.length && D.put(N(w.charAt(v)), 6);
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
        return A;
      }, b = function(I) {
        var G = s.MODE_8BIT_BYTE, q = a.stringToBytes(I), A = {};
        return A.getMode = function() {
          return G;
        }, A.getLength = function(N) {
          return q.length;
        }, A.write = function(N) {
          for (var D = 0; D < q.length; D += 1)
            N.put(q[D], 8);
        }, A;
      }, x = function(I) {
        var G = s.MODE_KANJI, q = a.stringToBytesFuncs.SJIS;
        if (!q)
          throw "sjis not supported.";
        (function(D, w) {
          var v = q(D);
          if (v.length != 2 || (v[0] << 8 | v[1]) != w)
            throw "sjis not supported.";
        })("友", 38726);
        var A = q(I), N = {};
        return N.getMode = function() {
          return G;
        }, N.getLength = function(D) {
          return ~~(A.length / 2);
        }, N.write = function(D) {
          for (var w = A, v = 0; v + 1 < w.length; ) {
            var $ = (255 & w[v]) << 8 | 255 & w[v + 1];
            if (33088 <= $ && $ <= 40956)
              $ -= 33088;
            else if (57408 <= $ && $ <= 60351)
              $ -= 49472;
            else
              throw "illegal char at " + (v + 1) + "/" + $;
            $ = ($ >>> 8 & 255) * 192 + ($ & 255), D.put($, 13), v += 2;
          }
          if (v < w.length)
            throw "illegal char at " + (v + 1);
        }, N;
      }, C = function() {
        var I = [], G = {};
        return G.writeByte = function(q) {
          I.push(q & 255);
        }, G.writeShort = function(q) {
          G.writeByte(q), G.writeByte(q >>> 8);
        }, G.writeBytes = function(q, A, N) {
          A = A || 0, N = N || q.length;
          for (var D = 0; D < N; D += 1)
            G.writeByte(q[D + A]);
        }, G.writeString = function(q) {
          for (var A = 0; A < q.length; A += 1)
            G.writeByte(q.charCodeAt(A));
        }, G.toByteArray = function() {
          return I;
        }, G.toString = function() {
          var q = "";
          q += "[";
          for (var A = 0; A < I.length; A += 1)
            A > 0 && (q += ","), q += I[A];
          return q += "]", q;
        }, G;
      }, M = function() {
        var I = 0, G = 0, q = 0, A = "", N = {}, D = function(v) {
          A += String.fromCharCode(w(v & 63));
        }, w = function(v) {
          if (!(v < 0)) {
            if (v < 26)
              return 65 + v;
            if (v < 52)
              return 97 + (v - 26);
            if (v < 62)
              return 48 + (v - 52);
            if (v == 62)
              return 43;
            if (v == 63)
              return 47;
          }
          throw "n:" + v;
        };
        return N.writeByte = function(v) {
          for (I = I << 8 | v & 255, G += 8, q += 1; G >= 6; )
            D(I >>> G - 6), G -= 6;
        }, N.flush = function() {
          if (G > 0 && (D(I << 6 - G), I = 0, G = 0), q % 3 != 0)
            for (var v = 3 - q % 3, $ = 0; $ < v; $ += 1)
              A += "=";
        }, N.toString = function() {
          return A;
        }, N;
      }, T = function(I) {
        var G = I, q = 0, A = 0, N = 0, D = {};
        D.read = function() {
          for (; N < 8; ) {
            if (q >= G.length) {
              if (N == 0)
                return -1;
              throw "unexpected end of file./" + N;
            }
            var v = G.charAt(q);
            if (q += 1, v == "=")
              return N = 0, -1;
            if (v.match(/^\s$/))
              continue;
            A = A << 6 | w(v.charCodeAt(0)), N += 6;
          }
          var $ = A >>> N - 8 & 255;
          return N -= 8, $;
        };
        var w = function(v) {
          if (65 <= v && v <= 90)
            return v - 65;
          if (97 <= v && v <= 122)
            return v - 97 + 26;
          if (48 <= v && v <= 57)
            return v - 48 + 52;
          if (v == 43)
            return 62;
          if (v == 47)
            return 63;
          throw "c:" + v;
        };
        return D;
      }, H = function(I, G) {
        var q = I, A = G, N = new Array(I * G), D = {};
        D.setPixel = function(O, R, F) {
          N[R * q + O] = F;
        }, D.write = function(O) {
          O.writeString("GIF87a"), O.writeShort(q), O.writeShort(A), O.writeByte(128), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(255), O.writeByte(255), O.writeByte(255), O.writeString(","), O.writeShort(0), O.writeShort(0), O.writeShort(q), O.writeShort(A), O.writeByte(0);
          var R = 2, F = v(R);
          O.writeByte(R);
          for (var V = 0; F.length - V > 255; )
            O.writeByte(255), O.writeBytes(F, V, 255), V += 255;
          O.writeByte(F.length - V), O.writeBytes(F, V, F.length - V), O.writeByte(0), O.writeString(";");
        };
        var w = function(O) {
          var R = O, F = 0, V = 0, J = {};
          return J.write = function(oe, ue) {
            if (oe >>> ue)
              throw "length over";
            for (; F + ue >= 8; )
              R.writeByte(255 & (oe << F | V)), ue -= 8 - F, oe >>>= 8 - F, V = 0, F = 0;
            V = oe << F | V, F = F + ue;
          }, J.flush = function() {
            F > 0 && R.writeByte(V);
          }, J;
        }, v = function(O) {
          for (var R = 1 << O, F = (1 << O) + 1, V = O + 1, J = $(), oe = 0; oe < R; oe += 1)
            J.add(String.fromCharCode(oe));
          J.add(String.fromCharCode(R)), J.add(String.fromCharCode(F));
          var ue = C(), we = w(ue);
          we.write(R, V);
          var Oe = 0, be = String.fromCharCode(N[Oe]);
          for (Oe += 1; Oe < N.length; ) {
            var se = String.fromCharCode(N[Oe]);
            Oe += 1, J.contains(be + se) ? be = be + se : (we.write(J.indexOf(be), V), J.size() < 4095 && (J.size() == 1 << V && (V += 1), J.add(be + se)), be = se);
          }
          return we.write(J.indexOf(be), V), we.write(F, V), we.flush(), ue.toByteArray();
        }, $ = function() {
          var O = {}, R = 0, F = {};
          return F.add = function(V) {
            if (F.contains(V))
              throw "dup key:" + V;
            O[V] = R, R += 1;
          }, F.size = function() {
            return R;
          }, F.indexOf = function(V) {
            return O[V];
          }, F.contains = function(V) {
            return typeof O[V] < "u";
          }, F;
        };
        return D;
      }, W = function(I, G, q) {
        for (var A = H(I, G), N = 0; N < G; N += 1)
          for (var D = 0; D < I; D += 1)
            A.setPixel(D, N, q(D, N));
        var w = C();
        A.write(w);
        for (var v = M(), $ = w.toByteArray(), O = 0; O < $.length; O += 1)
          v.writeByte($[O]);
        return v.flush(), "data:image/gif;base64," + v;
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
  })(ds)), ds.exports;
}
var VM = UM();
const GM = /* @__PURE__ */ zM(VM), KM = ["width", "height", "viewBox"], YM = ["width", "height"], QM = ["d"], XM = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = S(() => {
      const a = GM(0, "M");
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
      }, null, 8, YM),
      h("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, QM)
    ], 8, KM));
  }
}, zA = /* @__PURE__ */ z(XM, [["__scopeId", "data-v-489f0852"]]), JM = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (r(), d("div", {
      class: "window-room",
      "data-window-room": "",
      style: ge({ padding: e.padding })
    }, [
      ie(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, UA = /* @__PURE__ */ z(JM, [["__scopeId", "data-v-47e67f04"]]), VA = _u(() => import("./VoiceFigure-kdbxx3EF.js").then((e) => e.V)), GA = "1.2.0", KA = "3.5";
export {
  $m as $,
  Ie as A,
  Ne as B,
  Sa as C,
  ft as D,
  QE as E,
  ux as F,
  jC as G,
  VE as H,
  H4 as I,
  vx as J,
  Lt as K,
  n_ as L,
  $o as M,
  $x as N,
  px as O,
  xa as P,
  fE as Q,
  bC as R,
  ta as S,
  gE as T,
  dC as U,
  Be as V,
  da as W,
  cC as X,
  uC as Y,
  wm as Z,
  z as _,
  tC as a,
  RE as a$,
  kx as a0,
  kC as a1,
  wC as a2,
  Le as a3,
  IC as a4,
  TC as a5,
  Tt as a6,
  $C as a7,
  zC as a8,
  z_ as a9,
  _E as aA,
  uE as aB,
  I4 as aC,
  KC as aD,
  YC as aE,
  XE as aF,
  Yr as aG,
  vE as aH,
  Tn as aI,
  Q_ as aJ,
  G_ as aK,
  jE as aL,
  In as aM,
  zE as aN,
  PC as aO,
  cE as aP,
  dE as aQ,
  rE as aR,
  kn as aS,
  Et as aT,
  U_ as aU,
  $5 as aV,
  lE as aW,
  gC as aX,
  Gr as aY,
  Gt as aZ,
  en as a_,
  LE as aa,
  WE as ab,
  Z_ as ac,
  fC as ad,
  mC as ae,
  AC as af,
  OC as ag,
  BC as ah,
  oC as ai,
  Rl as aj,
  xC as ak,
  HC as al,
  tA as am,
  nE as an,
  eE as ao,
  ZC as ap,
  RC as aq,
  CC as ar,
  _C as as,
  EC as at,
  pE as au,
  WC as av,
  UC as aw,
  sA as ax,
  rn as ay,
  VC as az,
  Bx as b,
  aA as b$,
  ox as b0,
  HE as b1,
  kE as b2,
  bE as b3,
  V5 as b4,
  Rr as b5,
  TE as b6,
  FC as b7,
  Ca as b8,
  vt as b9,
  $E as bA,
  EE as bB,
  kt as bC,
  yE as bD,
  AE as bE,
  GC as bF,
  aE as bG,
  QC as bH,
  De as bI,
  DC as bJ,
  OE as bK,
  fA as bL,
  mA as bM,
  W_ as bN,
  M5 as bO,
  NC as bP,
  xE as bQ,
  nC as bR,
  eA as bS,
  wE as bT,
  SE as bU,
  ME as bV,
  LC as bW,
  B4 as bX,
  qC as bY,
  JC as bZ,
  ZE as b_,
  CE as ba,
  Ja as bb,
  Fi as bc,
  lA as bd,
  uA as be,
  hE as bf,
  PE as bg,
  H_ as bh,
  tE as bi,
  iA as bj,
  SC as bk,
  MC as bl,
  iC as bm,
  yC as bn,
  Y_ as bo,
  qE as bp,
  aC as bq,
  sC as br,
  rC as bs,
  oE as bt,
  g5 as bu,
  UE as bv,
  hx as bw,
  lC as bx,
  X_ as by,
  sE as bz,
  U5 as c,
  u_ as c$,
  K_ as c0,
  V_ as c1,
  XC as c2,
  cA as c3,
  Co as c4,
  dA as c5,
  cu as c6,
  DE as c7,
  pC as c8,
  hC as c9,
  F3 as cA,
  po as cB,
  hA as cC,
  R_ as cD,
  Gw as cE,
  e_ as cF,
  Zt as cG,
  Of as cH,
  FA as cI,
  jp as cJ,
  ui as cK,
  le as cL,
  ki as cM,
  EA as cN,
  f_ as cO,
  GA as cP,
  KA as cQ,
  M_ as cR,
  TA as cS,
  As as cT,
  q_ as cU,
  g$ as cV,
  He as cW,
  bt as cX,
  Xt as cY,
  k_ as cZ,
  __ as c_,
  w5 as ca,
  J_ as cb,
  fx as cc,
  iE as cd,
  bo as ce,
  C4 as cf,
  mE as cg,
  un as ch,
  Ht as ci,
  Wt as cj,
  g_ as ck,
  b_ as cl,
  vn as cm,
  CA as cn,
  ve as co,
  sm as cp,
  ao as cq,
  ba as cr,
  Uy as cs,
  ka as ct,
  PA as cu,
  F_ as cv,
  y_ as cw,
  Ky as cx,
  Ks as cy,
  mn as cz,
  Xe as d,
  ii as d$,
  Uc as d0,
  X2 as d1,
  ua as d2,
  A_ as d3,
  DA as d4,
  h_ as d5,
  p_ as d6,
  v_ as d7,
  $_ as d8,
  jA as d9,
  rt as dA,
  E_ as dB,
  at as dC,
  VA as dD,
  UA as dE,
  fo as dF,
  kA as dG,
  Hs as dH,
  zp as dI,
  uo as dJ,
  m_ as dK,
  ff as dL,
  Yi as dM,
  Vt as dN,
  En as dO,
  Kd as dP,
  B_ as dQ,
  NA as dR,
  LA as dS,
  Ys as dT,
  Gd as dU,
  Vs as dV,
  al as dW,
  Nw as dX,
  qA as dY,
  j_ as dZ,
  T_ as d_,
  zA as da,
  ar as db,
  kd as dc,
  MA as dd,
  fb as de,
  i_ as df,
  P_ as dg,
  kr as dh,
  Ot as di,
  C_ as dj,
  Je as dk,
  $t as dl,
  ny as dm,
  Ed as dn,
  Mp as dp,
  L_ as dq,
  r_ as dr,
  Qt as ds,
  OA as dt,
  AA as du,
  rM as dv,
  WA as dw,
  HA as dx,
  $a as dy,
  If as dz,
  vC as e,
  Rc as e0,
  Lc as e1,
  I2 as e2,
  D_ as e3,
  N_ as e4,
  gA as e5,
  Kh as e6,
  pA as e7,
  o_ as e8,
  BA as e9,
  yt as eA,
  O_ as eB,
  Yx as eC,
  t_ as eD,
  a_ as eE,
  _A as eF,
  Ji as eG,
  IA as eH,
  xr as eI,
  di as eJ,
  E8 as eK,
  zs as eL,
  $A as eM,
  ms as eN,
  xA as eO,
  SA as eP,
  ot as eQ,
  RA as eR,
  Yd as eS,
  c$ as ea,
  vr as eb,
  hr as ec,
  c_ as ed,
  I_ as ee,
  S_ as ef,
  bA as eg,
  wA as eh,
  We as ei,
  Vp as ej,
  w_ as ek,
  Gc as el,
  vA as em,
  $r as en,
  yA as eo,
  Xl as ep,
  x_ as eq,
  Jp as er,
  l_ as es,
  Xp as et,
  Da as eu,
  s_ as ev,
  hn as ew,
  Xs as ex,
  Qd as ey,
  d_ as ez,
  v5 as f,
  oA as g,
  wn as h,
  GE as i,
  rA as j,
  KE as k,
  NE as l,
  Dx as m,
  xo as n,
  FE as o,
  eC as p,
  YE as q,
  ru as r,
  uu as s,
  Ae as t,
  K5 as u,
  IE as v,
  nA as w,
  BE as x,
  Rn as y,
  JE as z
};
